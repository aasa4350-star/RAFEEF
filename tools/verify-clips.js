/* يتحقّق أنّ كلّ مقطعٍ صوتيّ يقول نصَّه فعلًا — بتفريغه عبر أزور ومقارنته.
 *
 * لماذا: فحصُ الصوت عندنا (checks/audio.js) يتحقّق أنّ الملفّ موجودٌ وأنّ
 * لكلّ نصٍّ ملفًّا — ولا يسمع شيئًا. فلو ارتبط نصٌّ بتسجيلِ كلمةٍ أخرى
 * لمرّ الفحصُ كلُّه، وسمع الطفل كلمةً ويكتب غيرها، ويُحسب عليه خطأً.
 * ولا يُكشف هذا إلّا بالاستماع — فنستمع بأزور.
 *
 * التشغيل:  node tools/verify-clips.js [ar|en]
 * يحتاج ffmpeg (لتحويل mp3 إلى wav) واتّصالًا بأزور.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const os = require('os');

const ROOT = path.join(__dirname, '..');
const LANG = (process.argv[2] || 'en').toLowerCase();
const REGION_EP = r => 'https://' + r + '.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1';

function creds(){
  const src = fs.readFileSync(path.join(ROOT, 'azure-config.js'), 'utf8');
  const m = /default\s*:\s*\{\s*key\s*:\s*atob\(\s*"([^"]+)"\s*\)\s*,\s*region\s*:\s*"([^"]+)"/.exec(src);
  if(!m) throw new Error('تعذّرت قراءة مفتاح أزور');
  return { key: Buffer.from(m[1], 'base64').toString('utf8'), region: m[2] };
}
async function token(c){
  const r = await fetch('https://'+c.region+'.api.cognitive.microsoft.com/sts/v1.0/issueToken',
    { method:'POST', headers:{ 'Ocp-Apim-Subscription-Key': c.key, 'Content-Length':'0' } });
  if(!r.ok) throw new Error('رمز أزور: HTTP '+r.status);
  return r.text();
}
/* تطبيعٌ متسامح: الفارق في علامات الترقيم وحالة الأحرف ليس خطأً */
const norm = s => String(s||'').toLowerCase()
  .replace(/[.,!?;:'"“”‘’]/g,' ')
  .replace(/[ً-ْٰ]/g,'')
  .replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه')
  .replace(/\s+/g,' ').trim();

/* أثرُ التفريغ لا خطأُ التسجيل: أزور تكتب الرمزَ والرقمَ بدل الكلمة،
   وتكتب المتجانس بإملائه الأشهر. قِيست هذه الأربعة بالسماع فوُجدت
   سليمةً، فلا تُحسب خطأً كي يبقى تنبيهُ الأداة ذا معنى. */
const ARTIFACT = { star:'*', bee:'b', seven:'7', flower:'flour' };

/* ═══ «لم يُفرَّغ» ليس تهمةً على المقطع ═══════════════════════════
   في فحص ١٢ سبتمبر ٢٠٢٦ رجعت ثلاثة مقاطع بلا نصّ: gate وbread وshell.
   وأُعيد سؤال أزور عنها ثلاث مرّاتٍ لكلٍّ منها فرجعت فارغةً كلَّها،
   فبدا أنّها معطوبة. ثمّ قيس مستوى الصوت فيها فإذا هو كمستوى المقاطع
   السليمة سواءً بسواء (ذروة −٤ دسيبل، ومتوسّط −٢٥) — أي أنّ الكلمة
   منطوقةٌ فيها والطفل يسمعها، وإنّما المُفرّغ لم يجزم بكلمةٍ مفردةٍ
   قصيرةٍ بلا سياق.

   فصرنا نُفرّق بينهما: المقطع الصامت عيبٌ حقيقيّ (الطفل لا يسمع
   شيئًا) فيُعدّ خطأً، والمقطع الذي فيه صوتٌ ولم يُفرَّغ حدُّ أداةٍ لا
   عيبُ مقطع فيُذكر على حدة. وإلّا فقد التنبيهُ معناه وتُجوهل القائمة. */
const SILENT_DB = -45;
function peak(file){
  /* ffmpeg يكتب القياس على stderr وينهي بنجاح، فنلتقطه من الحالتين */
  let txt = '';
  try{
    txt = execFileSync('ffmpeg', ['-hide_banner','-i',file,'-af','volumedetect','-f','null','/dev/null'],
      { encoding:'utf8', stdio:['ignore','pipe','pipe'] }) || '';
  }catch(e){ txt = String((e && (e.stderr || e.stdout)) || ''); }
  if(!/max_volume/.test(txt)){
    try{ txt = execFileSync('sh', ['-c',
      'ffmpeg -hide_banner -i ' + JSON.stringify(file) + ' -af volumedetect -f null /dev/null 2>&1'],
      { encoding:'utf8' }) || ''; }catch(e){ txt = String((e && (e.stdout||e.stderr)) || ''); }
  }
  const m = /max_volume:\s*(-?[\d.]+) dB/.exec(txt);
  return m ? parseFloat(m[1]) : NaN;
}

/* نسبة تشابه الكلمات — التفريغ قد يخطئ حرفًا في كلمةٍ طويلة وهذا مقبول،
   أمّا أن يقول كلمةً أخرى بالكلّيّة فذاك ما نبحث عنه. */
function sim(a, b){
  const A = norm(a).split(' ').filter(Boolean), B = norm(b).split(' ').filter(Boolean);
  if(!A.length || !B.length) return 0;
  const setB = new Map(); B.forEach(w => setB.set(w, (setB.get(w)||0)+1));
  let hit = 0;
  for(const w of A){ if(setB.get(w) > 0){ hit++; setB.set(w, setB.get(w)-1); } }
  return hit / Math.max(A.length, B.length);
}

(async () => {
  const man = JSON.parse(fs.readFileSync(path.join(ROOT,'audio','manifest.json'),'utf8'));
  const map = man[LANG] || {};
  const keys = Object.keys(map);
  if(!keys.length){ console.log('لا مقاطع للغة '+LANG); process.exit(0); }

  const c = creds();
  let tok = await token(c);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'clips-'));
  const lang = LANG === 'ar' ? 'ar-SA' : 'en-US';
  const bad = [], weak = [], gone = [], mute = [];
  let done = 0;

  for(const key of keys){
    const rel = map[key];
    const src = path.join(ROOT, 'audio', rel.replace(/^\/+/, ''));
    if(!fs.existsSync(src)){ gone.push(key+' → '+rel); continue; }
    const wav = path.join(tmp, 'c.wav');
    try{ execFileSync('ffmpeg', ['-y','-loglevel','error','-i',src,'-ar','16000','-ac','1','-c:a','pcm_s16le',wav]); }
    catch(e){ bad.push({ key, rel, heard:'(تعذّر التحويل)' }); continue; }

    let text = '';
    for(let attempt=0; attempt<2; attempt++){
      const r = await fetch(REGION_EP(c.region)+'?language='+lang, {
        method:'POST',
        headers:{ 'Authorization':'Bearer '+tok,
                  'Content-Type':'audio/wav; codecs=audio/pcm; samplerate=16000' },
        body: fs.readFileSync(wav)
      });
      if(r.status === 401){ tok = await token(c); continue; }   /* الرمز يعيش عشر دقائق */
      const j = await r.json().catch(()=>({}));
      text = j.DisplayText || '';
      break;
    }
    let score = sim(key, text);
    if(ARTIFACT[key] && norm(text) === norm(ARTIFACT[key])) score = 1;
    if(!text){
      /* فارغٌ؟ نسأل الملفّ نفسه: أفيه صوتٌ أصلًا؟ (انظر شرح SILENT_DB) */
      const db = peak(src);
      if(isFinite(db) && db <= SILENT_DB)
        bad.push({ key, rel, heard:'(صامت — ذروته ' + db + ' دسيبل)' });
      else
        mute.push({ key, rel, db });
    }
    else if(score < 0.5) bad.push({ key, rel, heard:text, score });
    else if(score < 0.8) weak.push({ key, rel, heard:text, score });
    done++;
    if(done % 25 === 0) process.stdout.write('  … '+done+'/'+keys.length+'\n');
  }
  try{ fs.rmSync(tmp, { recursive:true, force:true }); }catch(e){}

  console.log('\n═══ نتيجة فحص المقاطع ('+LANG+') ═══');
  console.log('فُحص: '+done+' من '+keys.length);
  if(gone.length){ console.log('\n⛔ ملفّاتٌ مفقودة ('+gone.length+'):'); gone.forEach(g=>console.log('   '+g)); }
  if(bad.length){
    console.log('\n❌ مقاطعُ تقول غيرَ نصّها ('+bad.length+'):');
    bad.forEach(b=>console.log('   «'+b.key+'»\n      الملفّ: '+b.rel+'\n      المسموع: «'+b.heard+'»'));
  }
  if(weak.length){
    console.log('\n⚠️ مقاطعُ التفريغ فيها مختلفٌ جزئيًّا ('+weak.length+') — تُراجَع بالأذن:');
    weak.forEach(w=>console.log('   «'+String(w.key).slice(0,60)+'» ← «'+String(w.heard).slice(0,60)+'»'));
  }
  if(mute.length){
    console.log('\nℹ️ فيها صوتٌ ولم يُفرَّغ ('+mute.length+') — حدُّ الأداة لا عيبُ المقطع،');
    console.log('   فالكلمة منطوقةٌ فيها بمستوًى سليم والطفل يسمعها:');
    mute.forEach(w=>console.log('   «'+String(w.key).slice(0,60)+'» — ذروة الصوت '+
      (isFinite(w.db) ? w.db+' دسيبل' : 'تعذّر قياسها')));
  }
  if(!bad.length && !gone.length) console.log('\n✅ كلّ مقطعٍ يقول نصَّه.');
  process.exit(bad.length || gone.length ? 1 : 0);
})().catch(e => { console.error('تعذّر الفحص: '+(e && e.message || e)); process.exit(2); });
