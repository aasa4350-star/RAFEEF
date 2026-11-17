#!/usr/bin/env node
/* ============================================================
   توليدُ مقاطعِ شظايا الاستماعِ المصغَّر — بصوتَين لكلِّ شظيّة.

       node tools/generate-micro.js [--dry]

   ولِمَ صوتان: تعدّدُ الأصواتِ هو جوهرُ التدريبِ الصوتيِّ عالي التنوّع
   (HVPT) — من تدرّب على صوتٍ واحدٍ تعلّم ذلك الصوتَ لا اللغة. فلكلّ
   شظيّةٍ مقطعان، ويُختار أحدُهما عند العرض.

   ولِمَ تُولَّد وتُحفَظ ولا تُطلَب من الشبكةِ وقتَ الاستعمال: بلاغُ
   الأب عن الإملاء «يتأخّر جدًّا، يبطي ما بدا». والشظيّةُ بندٌ من ستّةٍ
   في دقيقتَين، فتأخُّرُ ثانيتَين في كلِّ بندٍ يقتل التمرينَ. والملفُّ
   المحفوظُ صفرُ انتظار.

   والمواصفاتُ هي مواصفاتُ الملفّاتِ القائمةِ نفسِها (mono · 24kHz ·
   48kbps) والسرعةُ ‑10% — حتى لا يختلف صوتٌ عن صوتٍ في الصفحةِ الواحدة.
   ============================================================ */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), crypto = require('crypto');
const ROOT = path.join(__dirname, '..');
const AUDIO = path.join(ROOT, 'audio');
const REGION = 'eastus';
/* سرعتان: الطبيعيّةُ للتدريب، والبطيئةُ لحظةَ الخطأ. وتُولَّدان معًا
   ولا تُطلَب البطيئةُ من الشبكةِ وقتَ الحاجة: هي تُشغَّل تلقائيًّا عند
   الخطأِ، فلو تأخّرت لتأخّرت في أحرجِ لحظةٍ في التمرين. */
const RATES = [['', '-10%'], ['s', '-40%']];
const FORMAT = 'audio-24khz-48kbitrate-mono-mp3';
const DRY = process.argv.indexOf('--dry') >= 0;

function azureKey(){
  const s = fs.readFileSync(path.join(ROOT, 'azure-config.js'), 'utf8');
  const m = s.match(/atob\(\s*["']([A-Za-z0-9+/=]+)["']/);
  if (!m) throw new Error('لم أجد مفتاح Azure في azure-config.js');
  return Buffer.from(m[1], 'base64').toString();
}

/* البنكُ يُقرأ من ملفِّ الصفحةِ نفسِه، فلا تنفصل قائمةٌ عن قائمة */
function bank(){
  const box = { window:{} };
  vm.createContext(box);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'listen-micro.js'), 'utf8'), box);
  return { items: box.window.MICRO_LISTEN || {}, voices: box.window.MICRO_VOICES || [] };
}

/* اسمُ الملفِّ من النصِّ والصوتِ معًا — فلا يطمس صوتٌ صوتًا */
function fileOf(text, voice, tag){
  const h = crypto.createHash('sha1').update(voice + '|' + tag + '|' + text).digest('hex').slice(0, 12);
  return 'en/micro-' + (tag ? tag + '-' : '') + h + '.mp3';
}
/* مفتاحُ الفهرس: الصوتُ ثمّ وسمُ السرعةِ ثمّ النصّ */
function keyOf(voice, tag, text){ return voice + '|' + (tag ? tag + '|' : '') + text; }

async function say(key, text, voice, rate){
  const esc = String(text).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const ssml = '<speak version="1.0" xml:lang="en-GB"><voice name="' + voice +
               '"><prosody rate="' + rate + '">' + esc + '</prosody></voice></speak>';
  const r = await fetch('https://' + REGION + '.tts.speech.microsoft.com/cognitiveservices/v1', {
    method:'POST',
    headers:{ 'Ocp-Apim-Subscription-Key':key, 'Content-Type':'application/ssml+xml',
              'X-Microsoft-OutputFormat':FORMAT, 'User-Agent':'micro-gen' },
    body: ssml });
  if (!r.ok) throw new Error('HTTP ' + r.status + ' على «' + text + '» بصوت ' + voice);
  const b = Buffer.from(await r.arrayBuffer());
  if (b.length < 800) throw new Error('مقطعٌ فارغٌ على «' + text + '»');
  return b;
}

(async () => {
  const { items, voices } = bank();
  if (!voices.length) throw new Error('لا أصواتَ في listen-micro.js');
  const mp = path.join(AUDIO, 'manifest.json');
  const man = JSON.parse(fs.readFileSync(mp, 'utf8'));
  man.en = man.en || {};
  /* خريطةٌ منفصلةٌ للشظايا: مفتاحُها «الصوت|النصّ» فيصل العارضُ إلى
     الصوتِ الذي يريده بعينِه، ولا تختلط بخريطةِ الجملِ الواحدةِ لكلّ نصّ. */
  man.micro = man.micro || {};

  /* ═══ الصحيحُ وحدَه يُنطَق ═══════════════════════════════════════
     كان التوليدُ يُنطق الخطأَ أيضًا ليكون التمييزُ بين مسموعَين. وهو
     غلط: «a playing» و«waiting to» و«have finish» تراكيبُ لا وجودَ لها
     في الإنجليزيّة، وإسماعُها للطفلِ تدريبٌ لأذنِه على العطب. وHVPT
     يُقابل بين صوتَين كلاهما صحيحٌ في اللغة (ship / sheep) لا بين
     صحيحٍ وفاسد.

     وكشفَه الفحصُ نفسُه: مقطعُ «the played» أعادته خدمةُ التعرّفِ
     «The.» وحدَها — لأنّ المركّبَ لا معنى له فلم يُنطَق نطقًا بيّنًا.
     فلو شُغّل لسمعت رفيفُ همهمةً وحُسب عليها تمييزٌ لم تُمكَّن منه.

     فالصوتُ صحيحٌ دائمًا، والخطأُ خيارٌ **مكتوبٌ** تُقابله بما سمعت.
     وهذا أقربُ إلى حاجتها أصلًا: أن تَصِلَ الصوتَ بصورتِه المكتوبة. */
  const want = [];
  Object.keys(items).forEach(who => (items[who] || []).forEach(it => {
    voices.forEach(v => RATES.forEach(([tag, rate]) => want.push({ txt: it.heard, v, tag, rate })));
  }));
  /* بلا تكرار: شظيّةٌ تتكرّر في بندَين لا تُولَّد مرّتين */
  const uniq = {}; want.forEach(w => uniq[keyOf(w.v, w.tag, w.txt)] = w);
  const list = Object.keys(uniq).map(k => uniq[k]);

  const missing = list.filter(w => !man.micro[keyOf(w.v, w.tag, w.txt)]);
  console.log('شظايا مطلوبة: ' + list.length + ' · ناقصة: ' + missing.length);
  if (DRY){ missing.forEach(w => console.log('  - ' + w.v + ' ' + w.rate + ' → «' + w.txt + '»')); return; }
  if (!missing.length){ console.log('✅ لا ناقص'); return; }

  const key = azureKey();
  let done = 0;
  for (const w of missing){
    const rel = fileOf(w.txt, w.v, w.tag);
    const abs = path.join(AUDIO, rel);
    fs.mkdirSync(path.dirname(abs), { recursive:true });
    const buf = await say(key, w.txt, w.v, w.rate);
    fs.writeFileSync(abs, buf);
    man.micro[keyOf(w.v, w.tag, w.txt)] = rel;
    done++;
    console.log('  ✅ ' + w.v.replace('en-GB-','').replace('Neural','') + ' ' + w.rate + ' → «' + w.txt + '»  (' + buf.length + ' بايت)');
    await new Promise(r => setTimeout(r, 120));   /* لا نُغرق الخدمة */
  }
  fs.writeFileSync(mp, JSON.stringify(man));
  console.log('وُلّد ' + done + ' مقطعًا · والفهرسُ محدَّث');
})().catch(e => { console.error('❌ ' + e.message); process.exit(1); });
