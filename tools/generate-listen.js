#!/usr/bin/env node
/* ============================================================
   توليدُ مقاطعِ فهمِ المسموع — مقطعٌ لكلِّ نصّ.

       node tools/generate-listen.js [--dry]

   لِمَ: قسمُ فهمِ المسموع كان يطلب الصوتَ من أزور في كلِّ تشغيل
   (azureTTS داخل renderListen)، فالطفلُ ينتظر في كلِّ بندٍ من ثمانية.
   وبلاغُ الأب عن الإملاء كان «يبطي ما بدا» — والعلّةُ هي هي.

   والأصواتُ تتناوب على النصوصِ بالتناوبِ الدائريّ: جلسةٌ من ثمانيةِ
   بنودٍ تسمع متحدّثَين لا واحدًا، وهو أقربُ إلى اختبارٍ حقيقيٍّ يسمع
   فيه الممتحَنُ أكثرَ من صوت. ولا يُولَّد النصُّ الواحدُ بصوتَين: في
   فهمِ المسموعِ المطلوبُ تنوّعُ المتحدّثين عبر البنكِ لا إعادةُ النصِّ
   نفسِه بصوتَين (ذاك شأنُ تدريبِ الإدراكِ في listen-micro.js).

   والسرعةُ ‑10% صراحةً: كان الكودُ يمرّر العدد ‑10 بلا علامةِ نسبة،
   وSSML يقرأ العاريَ مضاعِفًا لا نسبة، فيخرج الصوتُ أسرعَ ممّا قُصد
   (قيس: ‑10 أعطى 12672 بايتًا و‑10% أعطى 14112 للنصِّ نفسِه).
   ============================================================ */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), crypto = require('crypto');
const ROOT = path.join(__dirname, '..');
const AUDIO = path.join(ROOT, 'audio');
const REGION = 'eastus';
const RATE = '-10%';
const FORMAT = 'audio-24khz-48kbitrate-mono-mp3';
const VOICES = ['en-GB-RyanNeural', 'en-GB-SoniaNeural'];
const DRY = process.argv.indexOf('--dry') >= 0;

function azureKey(){
  const s = fs.readFileSync(path.join(ROOT, 'azure-config.js'), 'utf8');
  const m = s.match(/atob\(\s*["']([A-Za-z0-9+/=]+)["']/);
  if (!m) throw new Error('لم أجد مفتاح Azure في azure-config.js');
  return Buffer.from(m[1], 'base64').toString();
}
function bank(){
  const box = { window:{} };
  vm.createContext(box);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'listen-bank.js'), 'utf8'), box);
  return box.window.LISTEN_BANK || [];
}
/* المفتاحُ من النصِّ وحدَه: الصفحةُ تعرف النصَّ ولا تعرف أيَّ صوتٍ
   أُسنِد إليه، فتجده بالنصِّ كما تجد مقاطعَ الإملاء. */
function fileOf(text){
  return 'en/listen-' + crypto.createHash('sha1').update(text).digest('hex').slice(0, 12) + '.mp3';
}
async function say(key, text, voice){
  const esc = String(text).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const ssml = '<speak version="1.0" xml:lang="en-GB"><voice name="' + voice +
               '"><prosody rate="' + RATE + '">' + esc + '</prosody></voice></speak>';
  let last = '';
  for (let a = 0; a < 5; a++){
    const r = await fetch('https://' + REGION + '.tts.speech.microsoft.com/cognitiveservices/v1', {
      method:'POST',
      headers:{ 'Ocp-Apim-Subscription-Key':key, 'Content-Type':'application/ssml+xml',
                'X-Microsoft-OutputFormat':FORMAT, 'User-Agent':'listen-gen' },
      body: ssml });
    if (r.ok){
      const b = Buffer.from(await r.arrayBuffer());
      if (b.length < 2000) throw new Error('مقطعٌ قصيرٌ مريبٌ على: ' + String(text).slice(0,40));
      return b;
    }
    last = 'HTTP ' + r.status;
    if (r.status !== 429 && r.status < 500) break;
    await new Promise(z => setTimeout(z, 1500 * (a + 1) * (a + 1)));
  }
  throw new Error(last + ' على: ' + String(text).slice(0,40));
}

(async () => {
  const L = bank();
  if (!L.length) throw new Error('بنكُ الاستماعِ فارغ');
  const mp = path.join(AUDIO, 'manifest.json');
  const man = JSON.parse(fs.readFileSync(mp, 'utf8'));
  man.listen = man.listen || {};

  const missing = L.map((it, i) => ({ t: it.t, v: VOICES[i % VOICES.length] }))
                   .filter(x => !man.listen[x.t]);
  console.log('نصوص: ' + L.length + ' · ناقصة: ' + missing.length);
  if (DRY){ missing.forEach(x => console.log('  - ' + x.v.replace('en-GB-','') + ' → ' + x.t.slice(0,54))); return; }
  if (!missing.length){ console.log('✅ لا ناقص'); return; }

  const key = azureKey();
  let done = 0;
  for (const x of missing){
    const rel = fileOf(x.t), abs = path.join(AUDIO, rel);
    fs.mkdirSync(path.dirname(abs), { recursive:true });
    fs.writeFileSync(abs, await say(key, x.t, x.v));
    man.listen[x.t] = rel;
    done++;
    if (done % 10 === 0 || done === missing.length) console.log('  ✅ ' + done + ' / ' + missing.length);
    await new Promise(r => setTimeout(r, 350));
  }
  fs.writeFileSync(mp, JSON.stringify(man));
  console.log('وُلّد ' + done + ' مقطعًا · والفهرسُ محدَّث');
})().catch(e => { console.error('❌ ' + e.message); process.exit(1); });
