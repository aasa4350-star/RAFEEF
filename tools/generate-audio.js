#!/usr/bin/env node
/* ============================================================
   توليد مقاطع الإملاء الناقصة بصوتٍ عصبيّ من Azure.

       node tools/generate-audio.js ar|en [--dry]

   البديل عن التسجيل بصوت الأب. يُستعمل حيث لا يمكنه القراءة — اختار
   الأب en-GB-RyanNeural للإنجليزي بعد أن سمع أربع عيّنات، وبقي العربي
   لصوته لأنّه يقرؤه سليمًا ونطقُ الآلة للعربية المشكولة أضعف منه.

   المخرَج بمواصفات الملفّات القائمة نفسها (mono · 24kHz · 48kbps) حتى
   لا يختلف صوتٌ عن صوت.

   ولا يُلمس بندٌ له تسجيلٌ أصلًا: التوليد لا يطمس صوت الأب أبدًا،
   فمن سجّل بصوته اليوم بقي صوته غدًا.
   ============================================================ */
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const AUDIO = path.join(ROOT, 'audio');

const REGION = 'eastus';
const VOICE  = { en: 'en-GB-RyanNeural', ar: 'ar-SA-HamedNeural' };
const RATE   = '-10%';           /* السرعة التي سمعها الأب واختارها */
const FORMAT = 'audio-24khz-48kbitrate-mono-mp3';

function azureKey(){
  const s = fs.readFileSync(path.join(ROOT, 'azure-config.js'), 'utf8');
  const m = s.match(/atob\(\s*["']([A-Za-z0-9+/=]+)["']/);
  if (!m) throw new Error('لم أجد مفتاح Azure في azure-config.js');
  return Buffer.from(m[1], 'base64').toString();
}

function esc(t){
  return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
                  .replace(/"/g,'&quot;').replace(/'/g,'&apos;');
}

async function synth(key, text, lang){
  const locale = lang === 'ar' ? 'ar-SA' : 'en-GB';
  const ssml = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="' + locale +
    '"><voice name="' + VOICE[lang] + '"><prosody rate="' + RATE + '">' + esc(text) +
    '</prosody></voice></speak>';
  const r = await fetch('https://' + REGION + '.tts.speech.microsoft.com/cognitiveservices/v1', {
    method:'POST',
    headers:{ 'Ocp-Apim-Subscription-Key': key, 'Content-Type':'application/ssml+xml',
              'X-Microsoft-OutputFormat': FORMAT, 'User-Agent':'rafeef-audio' },
    body: ssml
  });
  if (!r.ok){
    const e = new Error('HTTP ' + r.status + ' ' + (await r.text()).slice(0, 160));
    e.status = r.status;
    throw e;
  }
  return Buffer.from(await r.arrayBuffer());
}

/* Azure يخنق الطلبات المتلاحقة (429). ليست غلطةً في النصّ بل ازدحامٌ
   لحظيّ، فنُعيد المحاولة بتباعدٍ متزايد بدل أن نُسقط البند. */
async function synthRetry(key, text, lang, tries){
  tries = tries || 4;
  for (let i = 0; i < tries; i++){
    try { return await synth(key, text, lang); }
    catch(e){
      const retriable = e.status === 429 || e.status === 503 || !e.status;
      if (!retriable || i === tries - 1) throw e;
      await new Promise(r => setTimeout(r, 1200 * Math.pow(2, i)));
    }
  }
}

(async () => {
  const lang = process.argv[2];
  const dry  = process.argv.includes('--dry');
  if (!['ar','en'].includes(lang)){
    console.log('الاستعمال: node tools/generate-audio.js ar|en [--dry]');
    process.exit(1);
  }

  const index = JSON.parse(fs.readFileSync(path.join(__dirname,'recording-index.json'),'utf8'))
                  .filter(x => x.lang === lang);
  const man = JSON.parse(fs.readFileSync(path.join(AUDIO,'manifest.json'),'utf8'));
  man[lang] = man[lang] || {};

  /* من له تسجيلٌ أصلًا لا يُمسّ — لا نطمس صوت الأب */
  const todo = index.filter(x => !man[lang][x.text]);
  console.log('الصوت: ' + VOICE[lang] + ' · السرعة ' + RATE);
  console.log('بنود ' + (lang==='ar'?'العربي':'الإنجليزي') + ': ' + index.length +
              ' · ناقصة: ' + todo.length + ' · لها صوتٌ سلفًا: ' + (index.length - todo.length));
  if (!todo.length){ console.log('✅ لا ينقص شيء.'); return; }
  if (dry){ console.log('\n(تجربة) لم يُكتب شيء. أوّل ثلاثة:');
            todo.slice(0,3).forEach(x => console.log('   ' + x.id + '  ' + x.text.slice(0,60)));
            return; }

  const key = azureKey();
  fs.mkdirSync(path.join(AUDIO, lang), { recursive:true });

  let done = 0, failed = [];
  for (const item of todo){
    const file = lang + '/' + item.id + '.mp3';
    try {
      const buf = await synthRetry(key, item.text, lang);
      if (buf.length < 1500) throw new Error('مقطعٌ أقصر من أن يكون صوتًا (' + buf.length + ' بايت)');
      fs.writeFileSync(path.join(AUDIO, file), buf);
      man[lang][item.text] = file;
      done++;
      process.stdout.write('\r  ' + done + '/' + todo.length + ' ');
    } catch(e){
      failed.push(item.id + ': ' + e.message);
    }
    await new Promise(r => setTimeout(r, 350));   /* تباعدٌ يقلّل الخنق */
  }

  fs.writeFileSync(path.join(AUDIO,'manifest.json'), JSON.stringify(man, null, 1));
  console.log('\n✅ وُلّد ' + done + ' مقطعًا وحُدّث المانيفست.');
  if (failed.length){
    console.log('❌ فشل ' + failed.length + ':');
    failed.slice(0,8).forEach(f => console.log('   ' + f));
    process.exitCode = 1;
  }
  console.log('   شغّل: node checks/audio.js');
})();
