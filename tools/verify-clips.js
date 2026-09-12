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
  const bad = [], weak = [], gone = [];
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
    if(!text) weak.push({ key, rel, heard:'(لم يُفرَّغ)' });
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
  if(!bad.length && !gone.length) console.log('\n✅ كلّ مقطعٍ يقول نصَّه.');
  process.exit(bad.length || gone.length ? 1 : 0);
})().catch(e => { console.error('تعذّر الفحص: '+(e && e.message || e)); process.exit(2); });
