/* يُعيد توليد مقاطعَ بعينها ولا يقبلها حتى تُفرَّغ إلى نصّها.
 *
 * لماذا: بلاغ الأب (١٢ سبتمبر ٢٠٢٦) عن صفحة أسامة — الصوت يقول شيئًا
 * والمكتوب شيءٌ آخر. وفحصُ المقاطع كلّها (tools/verify-clips.js) كشف
 * أربعةً منها تقول غير نصّها فعلًا، وكلُّها في قائمة إملاء أسامة:
 *   cat  ⇐ يُسمع «cut»      · hat ⇐ يُسمع «hut»
 *   rain ⇐ يُسمع «then»     · cup ⇐ يُسمع «cupcake»
 * فالطفل يسمع «cut» فيكتبها، ثمّ يُحسب عليه خطأً في «cat» — ويظنّ أنّ
 * أذنه أخطأت، وهي لم تخطئ.
 *
 * والتوليد وحده لا يكفي: قد يخرج المقطع الجديد مثل القديم. فلا نقبله
 * حتى نُفرّغه بأزور ونتأكّد أنّه يقول الكلمة — وإلّا أبقينا القديم
 * وأخبرنا. فالمقطع الذي لا يُسمع صوابًا لا يُكتب فوق غيره.
 *
 * التشغيل:  node tools/refix-clips.js cat hat rain cup
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const os = require('os');

const ROOT = path.join(__dirname, '..');
const VOICE = 'en-GB-RyanNeural';
const RATE = '-10%';                       /* نفس ما وُلّدت به بقيّة المقاطع */
const FORMAT = 'audio-24khz-48kbitrate-mono-mp3';

function creds(){
  const src = fs.readFileSync(path.join(ROOT,'azure-config.js'),'utf8');
  const m = /default\s*:\s*\{\s*key\s*:\s*atob\(\s*"([^"]+)"\s*\)\s*,\s*region\s*:\s*"([^"]+)"/.exec(src);
  if(!m) throw new Error('تعذّرت قراءة مفتاح أزور');
  return { key: Buffer.from(m[1],'base64').toString('utf8'), region: m[2] };
}
async function token(c){
  const r = await fetch('https://'+c.region+'.api.cognitive.microsoft.com/sts/v1.0/issueToken',
    { method:'POST', headers:{ 'Ocp-Apim-Subscription-Key': c.key, 'Content-Length':'0' } });
  if(!r.ok) throw new Error('رمز أزور: HTTP '+r.status);
  return r.text();
}
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
async function tts(c, tok, text){
  const ssml = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-GB"><voice name="'
    + VOICE + '"><prosody rate="' + RATE + '">' + esc(text) + '</prosody></voice></speak>';
  const r = await fetch('https://'+c.region+'.tts.speech.microsoft.com/cognitiveservices/v1', {
    method:'POST',
    headers:{ 'Authorization':'Bearer '+tok, 'Content-Type':'application/ssml+xml',
              'X-Microsoft-OutputFormat': FORMAT, 'User-Agent':'rafeef-refix' },
    body: ssml });
  if(!r.ok) throw new Error('TTS HTTP '+r.status);
  return Buffer.from(await r.arrayBuffer());
}
async function hear(c, tok, mp3, tmp){
  const src = path.join(tmp,'in.mp3'), wav = path.join(tmp,'in.wav');
  fs.writeFileSync(src, mp3);
  execFileSync('ffmpeg',['-y','-loglevel','error','-i',src,'-ar','16000','-ac','1','-c:a','pcm_s16le',wav]);
  const r = await fetch('https://'+c.region+'.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-GB', {
    method:'POST',
    headers:{ 'Authorization':'Bearer '+tok, 'Content-Type':'audio/wav; codecs=audio/pcm; samplerate=16000' },
    body: fs.readFileSync(wav) });
  const j = await r.json().catch(()=>({}));
  return j.DisplayText || '';
}
const norm = s => String(s||'').toLowerCase().replace(/[^a-z ]/g,' ').replace(/\s+/g,' ').trim();

(async () => {
  const words = process.argv.slice(2);
  if(!words.length){ console.log('الاستعمال: node tools/refix-clips.js cat hat rain cup'); process.exit(1); }
  const man = JSON.parse(fs.readFileSync(path.join(ROOT,'audio','manifest.json'),'utf8'));
  const c = creds(); const tok = await token(c);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(),'refix-'));
  let fixed = 0, kept = 0;

  for(const w of words){
    const rel = (man.en||{})[w];
    if(!rel){ console.log('⚠️  «'+w+'» ليست في الفهرس — تُخطّى'); continue; }
    const dest = path.join(ROOT,'audio',rel);
    let best = null, heardBest = '';
    /* ثلاث محاولات: التوليد غير حتميّ تمامًا، وقد ينجح الثاني حيث أخفق الأوّل */
    for(let i=0;i<3 && !best;i++){
      const mp3 = await tts(c, tok, w);
      const heard = await hear(c, tok, mp3, tmp);
      if(!heardBest) heardBest = heard;
      if(norm(heard) === norm(w)){ best = mp3; heardBest = heard; }
    }
    if(best){
      fs.writeFileSync(dest, best);
      console.log('✅ «'+w+'» أُعيد توليده ويُسمع «'+heardBest+'» — '+rel+' ('+best.length+' بايت)');
      fixed++;
    } else {
      console.log('⛔ «'+w+'» لم يُقبل: آخر ما سُمع «'+heardBest+'» — أُبقي القديم');
      kept++;
    }
  }
  try{ fs.rmSync(tmp,{recursive:true,force:true}); }catch(e){}
  console.log('\nأُصلح: '+fixed+' · أُبقي كما هو: '+kept);
  process.exit(kept ? 1 : 0);
})().catch(e => { console.error('تعذّر: '+(e&&e.message||e)); process.exit(2); });
