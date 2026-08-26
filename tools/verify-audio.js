#!/usr/bin/env node
/* ============================================================
   تدقيق نُطق المقاطع المولَّدة آليًّا — بردّها إلى الآلة نفسها.

       node tools/verify-audio.js ar|en [--from N --to M] [--fix]

   لماذا: الإملاء نشاطٌ لا يحتمل خطأ النطق. الطفل يكتب ما يسمع،
   فإن نطقت الآلة «مِفْتَاحُه» مكان «مِفْتَاح» كتبها الطفل خطأً
   ثمّ قيل له إنّه أخطأ — فيتعلّم الغلط ويُلام عليه. وهذا أسوأ
   من ألّا يكون هناك صوتٌ أصلًا.

   الطريقة: نُسمع كلّ مقطعٍ لمحرّك التعرّف على الكلام من Azure
   ونقارن ما سمعه بالنصّ المكتوب. فإن اختلفا فالمقطع مشبوه.

   حدُّ هذه الأداة — ويجب أن يُعرَف: التعرّف يرجع نصًّا **بلا
   تشكيل**، فغلطُ الحركات لا يظهر فيه. فما مرّ من هنا ليس بريئًا
   يقينًا، وإنّما سلِم من الغلط الجسيم (حرفٌ زائد أو ناقص أو
   كلمةٌ أخرى). ولذلك تبقى المقاطع المشبوهة مرشَّحةً لتسجيل الأب
   بصوته، وهو الأصل.

   ‎--fix‎ يحاول إصلاح الجسيم آليًّا. وسيلته أنّ Azure — على غير ما
   يُظنّ — ينطق العربيّة المشكولة أسوأ من غير المشكولة في مواضع.
   ثبت هذا بالتجربة في أغسطس ٢٠٢٦:

       «مِظَلَّة» مشكولةً  →  لا يُسمع منها شيء (ثلاث مرّات)
       «مظلة»   بلا شكل  →  «مظلة» صحيحةً
       «بَلْ ثَمَرَةَ»    →  «بلف مرة»
       «بل ثمرة»        →  «بل ثمرة» صحيحةً

   فالسكون الصريح على «بَلْ» والشدّة في «مِظَلَّة» تُربكان المُركِّب.
   فإن أخفق البند مشكولًا، أعدنا تركيبه بلا شكلٍ ودقّقناه ثانيةً،
   ولا نُبقي البديل إلّا إن نجح. والنصّ المكتوب لا يُمسّ — التجريد
   للنطق وحده، والطفل يظلّ يقرأ الكلمة مشكولةً كما هي.
   ============================================================ */
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const AUDIO = path.join(ROOT, 'audio');
const REGION = 'eastus';

function azureKey(){
  const s = fs.readFileSync(path.join(ROOT, 'azure-config.js'), 'utf8');
  const m = s.match(/atob\(\s*["']([A-Za-z0-9+/=]+)["']/);
  if (!m) throw new Error('لم أجد مفتاح Azure في azure-config.js');
  return Buffer.from(m[1], 'base64').toString();
}

/* التعرّف يقبل WAV خامًا، وملفّاتنا mp3 — فنحوّل في الذاكرة */
function toWav(file){
  const r = cp.spawnSync('ffmpeg', ['-hide_banner','-loglevel','error','-i',file,
    '-ac','1','-ar','16000','-f','wav','-'], { maxBuffer: 1 << 26 });
  if (r.status !== 0) throw new Error('ffmpeg: ' + String(r.stderr).slice(0,120));
  return r.stdout;
}

/* تسويةٌ للمقارنة. نطوي هنا ما هو من عادة المحرّك في الكتابة لا من
   نطق الصوت: التشكيل لا يرجعه أصلًا، وهمزات الألف يكتبها كيفما اتّفق،
   والتاء المربوطة يكتبها هاءً دائمًا — وهي في الوقف تُنطق هاءً حقًّا،
   فالفرق بينهما لا يُسمع أصلًا ولا يصحّ أن نحاسب الصوت عليه.

   ويكتب العدد رقمًا وإن نُطق لفظًا: «five» تعود «5» و«nine» تعود
   «9:00». فنوحّدها أرقامًا في الطرفين. */
const NUM = { zero:0, one:1, two:2, three:3, four:4, five:5, six:6, seven:7, eight:8,
  nine:9, ten:10, eleven:11, twelve:12, thirteen:13, fourteen:14, fifteen:15,
  sixteen:16, seventeen:17, eighteen:18, nineteen:19, twenty:20, thirty:30,
  forty:40, fifty:50, sixty:60, seventy:70, eighty:80, ninety:90, hundred:100 };

function norm(s){
  return String(s)
    .replace(/[ً-ْٰـ]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/(\d):00\b/g, '$1')
    .replace(/[^ء-يA-Za-z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .split(' ')
    .map(w => NUM[w] !== undefined ? String(NUM[w]) : w)
    .join(' ');
}

/* تصنيف الخلل. ليس كلّ اختلافٍ سواء:

   • «نافورة» تُسمع «نافور» — سقطت الهاء الأخيرة، وهي في الوقف
     همسٌ خافت يبتلعه المحرّك عادةً. خللٌ طفيف، الأرجح أنّه في
     السمع لا في النطق.
   • «بل ثمرة» تُسمع «بلف مرة» — كلمةٌ أخرى بالكامل. جسيم.

   فالقاعدة: عدد الكلمات واحد، وكلّ كلمةٍ إمّا مطابِقة أو إحداهما
   بدايةُ الأخرى بحرفٍ واحدٍ زائدٍ في الطرف — فهذا طفيف. وما عداه
   جسيم: كلمةٌ زائدة، أو ناقصة، أو مختلفة من وسطها. */
function severity(said, heard){
  const a = norm(said), b = norm(heard);
  if (!b) return 'جسيم';
  if (a === b) return null;

  const wa = a.split(' '), wb = b.split(' ');
  if (wa.length !== wb.length) return 'جسيم';

  const tailOnly = (x, y) => {
    if (x === y) return true;
    const [s, l] = x.length < y.length ? [x, y] : [y, x];
    return l.length - s.length === 1 && l.startsWith(s);
  };
  return wa.every((w, i) => tailOnly(w, wb[i])) ? 'طفيف' : 'جسيم';
}

/* تركيبٌ بنفس مواصفات tools/generate-audio.js حرفًا بحرف، حتى لا
   يختلف المقطع المُصلَح عن جيرانه في الصوت ولا في السرعة */
const VOICE  = { en: 'en-GB-RyanNeural', ar: 'ar-SA-HamedNeural' };
const RATE   = '-10%';
const FORMAT = 'audio-24khz-48kbitrate-mono-mp3';

function esc(t){
  return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
                  .replace(/"/g,'&quot;').replace(/'/g,'&apos;');
}

async function tts(key, text, lang){
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
  if (!r.ok){ const e = new Error('HTTP ' + r.status); e.status = r.status; throw e; }
  return Buffer.from(await r.arrayBuffer());
}

async function stt(key, wav, lang){
  const locale = lang === 'ar' ? 'ar-SA' : 'en-GB';
  const r = await fetch('https://' + REGION + '.stt.speech.microsoft.com' +
    '/speech/recognition/conversation/cognitiveservices/v1?language=' + locale +
    '&format=detailed', {
    method:'POST',
    headers:{ 'Ocp-Apim-Subscription-Key': key,
              'Content-Type':'audio/wav; codecs=audio/pcm; samplerate=16000',
              'Accept':'application/json' },
    body: wav
  });
  if (!r.ok){
    const e = new Error('HTTP ' + r.status);
    e.status = r.status;
    throw e;
  }
  const j = await r.json();
  return (j.DisplayText || (j.NBest && j.NBest[0] && j.NBest[0].Display) || '').trim();
}

async function sttRetry(key, wav, lang, tries){
  tries = tries || 4;
  for (let i = 0; i < tries; i++){
    try { return await stt(key, wav, lang); }
    catch(e){
      const retriable = e.status === 429 || e.status === 503 || !e.status;
      if (!retriable || i === tries - 1) throw e;
      await new Promise(r => setTimeout(r, 1200 * Math.pow(2, i)));
    }
  }
}

(async () => {
  const lang = process.argv[2];
  const fix  = process.argv.includes('--fix');
  if (!['ar','en'].includes(lang)){
    console.log('الاستعمال: node tools/verify-audio.js ar|en [--from N --to M] [--fix]');
    process.exit(1);
  }
  const argOf = n => { const i = process.argv.indexOf(n); return i > -1 ? Number(process.argv[i+1]) : null; };
  const from = argOf('--from'), to = argOf('--to');

  let index = JSON.parse(fs.readFileSync(path.join(__dirname,'recording-index.json'),'utf8'))
                .filter(x => x.lang === lang);
  const total = index.length;
  if (from || to) index = index.slice((from || 1) - 1, to || total);

  const man = JSON.parse(fs.readFileSync(path.join(AUDIO,'manifest.json'),'utf8'));
  const key = azureKey();

  const suspect = [], gone = [];
  let ok = 0, n = 0, carried = 0;

  /* التعرّف ليس حتميًّا: المقطع نفسه قد يُسمع مرّتين مختلفتين.
     فلا نتّهم مقطعًا حتى يخفق مرّتين — وإلّا امتلأ التقرير بضجيجٍ
     يُغرق الخلل الحقيقيّ فلا يُرى. */
  async function listen(file){
    const wav = toWav(path.join(AUDIO, file));
    return await sttRetry(key, wav, lang);
  }

  /* الكلمة المفردة القصيرة قد يعجز المحرّك عن كتابتها لا لعيبٍ في
     النطق بل لأنّه مضبوطٌ على الجُمل فلا يجد سياقًا يستعين به.
     ثبت هذا في أغسطس ٢٠٢٦: gate وbread وshell رجعن فارغاتٍ ثلاث
     مرّاتٍ كلٌّ، ثمّ وُضعن في جملةٍ فسُمعن جميعًا سليمات.

     فقبل أن نتّهم النطق نضع الكلمة في جملةٍ حاملة ونُسمعها. فإن
     ظهرت فيها فالصوت ينطقها، والعيب في السمع لا في النطق.

     وحدُّ هذا: الجملة الحاملة صوتٌ آخر لا المقطع المحفوظ نفسه.
     فهي تُثبت أنّ المُركِّب يُحسن الكلمة، لا أنّ هذا الملفّ بعينه
     سليم — ولذلك لا نلجأ إليها إلّا حين يعود الأصل فارغًا تمامًا،
     وطولُ الملفّ وقوّته على القرص شاهدان أنّه ليس صامتًا. */
  async function carrierSaysIt(word){
    const frame = lang === 'ar' ? ('الكلمة هي ' + word + '.') : ('The word is ' + word + '.');
    const tmp = path.join(AUDIO, lang, '_carrier.mp3');
    try {
      fs.writeFileSync(tmp, await tts(key, frame, lang));
      const heard = norm(await sttRetry(key, toWav(tmp), lang));
      return heard.split(' ').includes(norm(word));
    } catch(e){ return false; }
    finally { if (fs.existsSync(tmp)) fs.unlinkSync(tmp); }
  }

  for (const item of index){
    const file = (man[lang] || {})[item.text];
    if (!file || !fs.existsSync(path.join(AUDIO, file))){ gone.push(item.id); continue; }
    n++;
    process.stdout.write('\r  دُقّق ' + n + '/' + index.length + ' ');

    let heard = '', sev = null;
    try {
      heard = await listen(file);
      sev = severity(item.text, heard);
      if (sev){                       /* محاولةٌ ثانية قبل الاتّهام */
        await new Promise(r => setTimeout(r, 400));
        const again = await listen(file);
        const sev2 = severity(item.text, again);
        if (!sev2){ sev = null; }
        else if (sev2 === 'طفيف'){ sev = 'طفيف'; heard = again; }
        else heard = again;
      }
      /* كلمةٌ مفردة عاد بها المحرّك فارغًا: نستوثق بجملةٍ حاملة */
      if (sev === 'جسيم' && !norm(heard) && !/\s/.test(item.text.trim())){
        const bytes = fs.statSync(path.join(AUDIO, file)).size;
        if (bytes > 4000 && await carrierSaysIt(item.text)){ sev = null; carried++; }
      }
    } catch(e){
      suspect.push({ id:item.id, text:item.text, heard:'(تعذّر التعرّف: ' + e.message + ')', sev:'جسيم' });
      continue;
    }

    if (!sev) ok++;
    else suspect.push({ id:item.id, text:item.text, heard: heard || '(لم يسمع شيئًا)', sev });

    await new Promise(r => setTimeout(r, 250));
  }

  let bad  = suspect.filter(s => s.sev === 'جسيم');
  const mild = suspect.filter(s => s.sev === 'طفيف');

  /* محاولة الإصلاح: نُعيد تركيب الجسيم بنصٍّ مجرّدٍ من الشكل، ولا
     نستبدل الملفّ إلّا إن نجح البديل في التدقيق. فإن أخفق أيضًا
     أبقينا الأصل — لأنّ الأصل على عيبه معلومُ العيب، والبديلَ
     المجهول قد يكون أسوأ. */
  if (fix && bad.length){
    console.log('\n  إصلاح: إعادة تركيب ' + bad.length + ' بندًا بلا تشكيل…');
    const still = [];
    for (const s of bad){
      const plain = s.text.replace(/[ً-ْٰـ]/g, '');
      if (plain === s.text){ still.push(s); continue; }   /* لا شكل فيه أصلًا */
      const file = man[lang][s.text];
      const tmp  = path.join(AUDIO, lang, s.id + '.try.mp3');
      try {
        const buf = await tts(key, plain, lang);
        if (buf.length < 1500) throw new Error('مقطعٌ أقصر من أن يكون صوتًا');
        fs.writeFileSync(tmp, buf);
        const heard = await sttRetry(key, toWav(tmp), lang);
        if (severity(s.text, heard) === null){
          fs.renameSync(tmp, path.join(AUDIO, file));
          console.log('    ✅ ' + s.id + ' — ' + s.text + ' → صار يُسمع «' + heard + '»');
          ok++;
        } else {
          fs.unlinkSync(tmp);
          s.fixTried = plain + ' → ' + (heard || 'لا شيء');
          still.push(s);
        }
      } catch(e){
        if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
        s.fixTried = 'تعذّر: ' + e.message;
        still.push(s);
      }
      await new Promise(r => setTimeout(r, 400));
    }
    bad = still;
  }

  /* نُبقي أثرًا على القرص ليقرأه checks/audio.js، فلا يضيع ما عُرف */
  const rec = JSON.parse(fs.existsSync(path.join(AUDIO,'suspect.json'))
    ? fs.readFileSync(path.join(AUDIO,'suspect.json'),'utf8') : '{}');
  if (!from && !to){          /* دفعةٌ جزئية لا تُلغي حكم ما لم يُدقَّق */
    rec[lang] = bad.map(s => ({ id:s.id, text:s.text, heard:s.heard }));
    rec.updated = new Date().toISOString().slice(0,10);
    fs.writeFileSync(path.join(AUDIO,'suspect.json'), JSON.stringify(rec, null, 1));
  }

  console.log('\n');
  console.log('  مقاطع مدقَّقة: ' + n + ' · مطابِقة: ' + ok + (carried ? ' (منها ' + carried + ' استوثقناها بجملةٍ حاملة)' : '') +
              ' · خللٌ طفيف: ' + mild.length + ' · خللٌ جسيم: ' + bad.length);
  if (gone.length) console.log('  ⚠️  بلا ملفّ: ' + gone.length + ' (' + gone.slice(0,5).join('، ') + ')');

  const show = (title, list) => {
    if (!list.length) return;
    console.log('\n  ' + title);
    console.log('  ' + '─'.repeat(58));
    list.forEach(s => console.log('  ' + s.id.padEnd(11) + 'مكتوب: ' + s.text +
                                  '\n' + ' '.repeat(13) + 'مسموع: ' + s.heard +
                                  (s.fixTried ? '\n' + ' '.repeat(13) + 'بلا شكل: ' + s.fixTried : '')));
  };
  show('جسيم — كلمةٌ أخرى أو لا شيء. تُسجَّل بصوت الأب:', bad);
  show('طفيف — طرفٌ خافت، الأرجح أنّه في السمع لا في النطق:', mild);

  if (suspect.length)
    console.log('\n  تذكير: التعرّف يرجع نصًّا بلا تشكيل، فغلط الحركات لا يظهر هنا.');
  if (!bad.length) console.log('\n  ✅ لا خلل جسيمًا في هذه الدفعة.');
  process.exitCode = bad.length ? 1 : 0;
})();
