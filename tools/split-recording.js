#!/usr/bin/env node
/* ============================================================
   تقطيع تسجيلٍ واحدٍ طويل إلى مقاطع الإملاء، وربطها بالمانيفست.

       node tools/split-recording.js <الملفّ> ar|en [--dry]

   الفكرة: الأب يسجّل كلّ بنود لغةٍ في ملفٍّ واحد — يقرأ من
   tools/recording-script.txt بالترتيب ويسكت ثانيتين بين بندٍ وآخر —
   ثمّ تقطعه هذه الأداة عند السكتات وتُسمّي المقاطع بالترتيب نفسه.
   فلا يحتاج إلى تسمية مئة ملفٍّ بيده.

   لماذا التقطيع بالسكوت لا بعدد ثابت: القراءة البشرية تتفاوت، فالبند
   قد يطول ثانيةً وقد يقصر. والسكتة هي الفاصل الوحيد الموثوق.

   تحقّقٌ إلزاميّ قبل الكتابة: عدد المقاطع المستخرَجة يجب أن يساوي
   عدد البنود المنتظَرة بالضبط. فإن اختلّ توقّفنا وأخبرنا أين اختلّ —
   ولا نكتب شيئًا، لأنّ إزاحةً واحدة تعني أنّ كلّ كلمةٍ ستُنطق بصوت
   الكلمة التي بعدها، وهذا أسوأ من غياب الصوت.
   ============================================================ */
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const AUDIO = path.join(ROOT, 'audio');

const SILENCE_DB   = '-32dB';   /* ما دون هذا يُعدّ سكوتًا */
const SILENCE_MIN  = 0.7;       /* أقصر سكتةٍ تُعدّ فاصلًا، بالثواني */
const PAD          = 0.15;      /* هامشٌ يُترك حول كلّ مقطع */
const MIN_CLIP     = 0.35;      /* أقصر مقطعٍ مقبول — ما دونه ضجيج */

function sh(cmd, args){
  const r = cp.spawnSync(cmd, args, { encoding:'utf8', maxBuffer: 1 << 26 });
  if (r.error) throw r.error;
  return (r.stdout || '') + (r.stderr || '');
}

function main(){
  const [src, lang] = process.argv.slice(2);
  const dry = process.argv.includes('--dry');
  if (!src || !['ar','en'].includes(lang)){
    console.log('الاستعمال: node tools/split-recording.js <الملفّ> ar|en [--dry]');
    process.exit(1);
  }
  if (!fs.existsSync(src)){ console.log('لا أجد الملفّ: ' + src); process.exit(1); }

  const index = JSON.parse(fs.readFileSync(path.join(__dirname,'recording-index.json'),'utf8'))
                  .filter(x => x.lang === lang);
  console.log('البنود المنتظَرة في ' + (lang==='ar'?'العربي':'الإنجليزي') + ': ' + index.length);

  /* ١) نكشف السكتات */
  const log = sh('ffmpeg', ['-hide_banner','-i',src,'-af',
    'silencedetect=noise='+SILENCE_DB+':d='+SILENCE_MIN,'-f','null','-']);
  const dur = Number((log.match(/Duration: (\d+):(\d+):([\d.]+)/) || []).slice(1)
                .reduce((a,v,i) => a + Number(v) * [3600,60,1][i], 0)) || 0;
  const starts = [...log.matchAll(/silence_start: ([\d.]+)/g)].map(m => Number(m[1]));
  const ends   = [...log.matchAll(/silence_end: ([\d.]+)/g)].map(m => Number(m[1]));
  console.log('طول التسجيل: ' + dur.toFixed(1) + ' ثانية · سكتات: ' + starts.length);

  /* ٢) الكلام هو ما بين السكتات */
  const clips = [];
  /* نتخطّى سكتةَ البداية فقط إن كان التسجيل يبدأ بها فعلًا.
     (كان الشرط هنا starts[0] < ends[0] وهو صحيحٌ دائمًا لأيّ سكتةٍ
     مطابقة، فكان يبتلع البند الأوّل من كلّ تسجيل.) */
  let cur = (starts.length && starts[0] < 0.35) ? ends[0] : 0;
  for (let i = 0; i < starts.length; i++){
    const s = starts[i];
    if (s > cur + MIN_CLIP) clips.push([cur, s]);
    cur = ends[i] !== undefined ? ends[i] : s;
  }
  if (dur - cur > MIN_CLIP) clips.push([cur, dur]);

  console.log('مقاطع مستخرَجة: ' + clips.length);

  /* ٣) التحقّق الإلزاميّ */
  if (clips.length !== index.length){
    console.log('\n⛔ العدد لا يطابق. لم يُكتب شيء.');
    console.log('   منتظَر ' + index.length + ' ومستخرَج ' + clips.length + '.');
    if (clips.length < index.length)
      console.log('   غالبًا سكتةٌ قصيرة دمجت بندين. أعد التسجيل بسكتاتٍ أوضح،\n' +
                  '   أو جرّب ‎--dry‎ بعد تعديل SILENCE_MIN في أعلى الملفّ.');
    else
      console.log('   غالبًا سكتةٌ داخل بندٍ طويل قسمته. جرّب رفع SILENCE_MIN.');
    console.log('\n   أطول خمسة مقاطع (للاستئناس):');
    clips.map((c,i) => [i, c[1]-c[0]]).sort((a,b) => b[1]-a[1]).slice(0,5)
      .forEach(([i,d]) => console.log('     #' + (i+1) + '  ' + d.toFixed(2) + 'ث'));
    process.exit(2);
  }

  if (dry){ console.log('\n✅ العدد مطابق. أعد التشغيل بلا ‎--dry‎ للكتابة.'); return; }

  /* ٤) القصّ والترميز بنفس مواصفات الملفّات القائمة: mono · 24kHz · 48kbps */
  const outDir = path.join(AUDIO, lang);
  fs.mkdirSync(outDir, { recursive:true });
  const man = JSON.parse(fs.readFileSync(path.join(AUDIO,'manifest.json'),'utf8'));
  man[lang] = man[lang] || {};

  index.forEach((item, i) => {
    const [a, b] = clips[i];
    const from = Math.max(0, a - PAD), len = (b - a) + PAD*2;
    const file = lang + '/' + item.id + '.mp3';
    sh('ffmpeg', ['-hide_banner','-loglevel','error','-y','-i',src,
      '-ss',String(from),'-t',String(len),
      '-ac','1','-ar','24000','-b:a','48k', path.join(AUDIO,file)]);
    man[lang][item.text] = file;
    process.stdout.write('\r  كُتب ' + (i+1) + '/' + index.length + ' ');
  });

  fs.writeFileSync(path.join(AUDIO,'manifest.json'), JSON.stringify(man, null, 1));
  console.log('\n✅ تمّ. حُدِّث المانيفست بـ ' + index.length + ' مدخلًا.');
  console.log('   شغّل: node checks/audio.js — لا بدّ أن ترتفع التغطية.');
}

main();
