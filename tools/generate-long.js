#!/usr/bin/env node
/* ============================================================
   توليدُ مقاطعِ الحواراتِ الطويلة — مقطعٌ لكلِّ حوارٍ بصوتَين، وسؤالٌ
   منطوقٌ لكلِّ سؤال.

       node tools/generate-long.js [--dry]

   كُتيِّبُ قياسٍ الرسميُّ يصف قسمَ المسموعِ حوارًا قصيرًا بسؤالَين
   وحوارًا «considerably longer» بتسعةِ أسئلة. وبنكُنا القصيرُ كلُّه
   سؤالان، فهذا بنكُ الطويل (listen-long.js).

   والصوتان متناوبان بالمتحدّث: الاختبارُ يُميّز المتحدّثَين بالصوتِ،
   فلا تُقرأ الأسماءُ («Noura:») في الصوتِ وإنّما تظهر في النصِّ بعد
   الإجابة. وحوارٌ طويلٌ بصوتٍ واحدٍ يَلتبِس على السامعِ مَن يقول ماذا
   وهو عبءٌ ليس من الاختبار.

   ⚠️ ومنفذُ أزور cognitiveservices/v1 لا يقبل صوتَين في طلبٍ واحد:
   قِيس فردَّ 400 على ssml فيه <voice> مرّتَين، وقَبِل كلَّ صوتٍ منهما
   منفردًا. فيُولَّد كلُّ سطرٍ بصوتِه وحدَه ثمّ تُخاط المقاطعُ بـffmpeg
   بسكتةِ أربعِ أعشارِ ثانيةٍ بين المتحدّثَين — والصيغةُ واحدةٌ في
   الكلِّ (مونو ٢٤ كيلو ٤٨ كيلوبت) فالخياطةُ نسخٌ بلا إعادةِ ترميز.
   ============================================================ */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), crypto = require('crypto'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const AUDIO = path.join(ROOT, 'audio');
const REGION = 'eastus';
const RATE = '-10%';
const FORMAT = 'audio-24khz-48kbitrate-mono-mp3';
const QVOICE = 'en-GB-RyanNeural';
const DRY = process.argv.indexOf('--dry') >= 0;

function azureKey(){
  const s = fs.readFileSync(path.join(ROOT, 'azure-config.js'), 'utf8');
  const m = s.match(/atob\(\s*["']([A-Za-z0-9+/=]+)["']/);
  if (!m) throw new Error('لم أجد مفتاح Azure في azure-config.js');
  return Buffer.from(m[1], 'base64').toString();
}
function bank(){
  const box = { window:{}, console };
  vm.createContext(box);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'listen-long.js'), 'utf8'), box);
  return box.window.LISTEN_LONG || [];
}
const esc = t => String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function dlgKey(text){ return 'LD|' + text; }
function dlgFile(text){
  return 'en/listenld-' + crypto.createHash('sha1').update('LD|' + text).digest('hex').slice(0,12) + '.mp3';
}
function qKey(text){ return 'Q|' + text; }
function qFile(text){
  return 'en/listenq-' + crypto.createHash('sha1').update('Q|' + text).digest('hex').slice(0,12) + '.mp3';
}
/* الأسماءُ لا تُقرَأ: يُقسَم الحوارُ أسطرًا، ويُسنَد لكلِّ متحدّثٍ صوتُه
   بترتيبِ ظهورِه، ويُنطَق كلامُه وحدَه. */
function turnsOf(text, voices){
  const lines = String(text).split('\n').map(l => l.trim()).filter(Boolean);
  const order = [];
  const turns = lines.map(l => {
    const i = l.indexOf(':');
    const who = i > 0 ? l.slice(0, i).trim() : '';
    const said = i > 0 ? l.slice(i + 1).trim() : l;
    if (who && order.indexOf(who) < 0) order.push(who);
    return { who: who, said: said, v: voices[Math.max(0, order.indexOf(who)) % voices.length] };
  });
  if (order.length !== 2) throw new Error('الحوارُ ليس بمتحدّثَين: ' + order.join('/') + ' — ' + text.slice(0,40));
  if (turns.some(t => !t.said)) throw new Error('سطرٌ بلا كلامٍ في: ' + text.slice(0,40));
  return turns;
}
function oneSsml(text, voice){
  return '<speak version="1.0" xml:lang="en-GB"><voice name="' + voice + '"><prosody rate="' + RATE +
         '">' + esc(text) + '</prosody></voice></speak>';
}
async function post(key, ssml, label){
  let last = '';
  for (let a = 0; a < 5; a++){
    const r = await fetch('https://' + REGION + '.tts.speech.microsoft.com/cognitiveservices/v1', {
      method:'POST',
      headers:{ 'Ocp-Apim-Subscription-Key':key, 'Content-Type':'application/ssml+xml',
                'X-Microsoft-OutputFormat':FORMAT, 'User-Agent':'listen-long-gen' },
      body: ssml });
    if (r.ok){
      const b = Buffer.from(await r.arrayBuffer());
      if (b.length < 2000) throw new Error('مقطعٌ قصيرٌ مريبٌ على: ' + label);
      return b;
    }
    last = 'HTTP ' + r.status + ' ' + (await r.text()).slice(0,120);
    if (r.status !== 429 && r.status < 500) break;
    await new Promise(z => setTimeout(z, 1500 * (a+1) * (a+1)));
  }
  throw new Error(last + ' على: ' + label);
}

(async () => {
  const L = bank();
  if (!L.length) throw new Error('بنكُ الحواراتِ الطويلةِ فارغ');
  const mp = path.join(AUDIO, 'manifest.json');
  const man = JSON.parse(fs.readFileSync(mp, 'utf8'));
  man.listen = man.listen || {};

  const dMissing = L.filter(it => !man.listen[dlgKey(it.t)]);
  const qAll = [];
  L.forEach(it => (it.q||[]).forEach(q => { if (q && q[0]) qAll.push(String(q[0])); }));
  const qUniq = Array.from(new Set(qAll));
  const qMissing = qUniq.filter(t => !man.listen[qKey(t)]);
  console.log('حوارات: ' + L.length + ' · ناقص: ' + dMissing.length);
  console.log('أسئلة: ' + qUniq.length + ' · ناقص: ' + qMissing.length);
  /* يُتحقَّق من بنيةِ كلِّ حوارٍ قبل أيِّ طلبٍ: متحدّثان وصوتان */
  L.forEach(it => { turnsOf(it.t, it.v || [QVOICE, 'en-GB-SoniaNeural']); });
  if (DRY){ console.log('✅ البنيةُ سليمةٌ في الحواراتِ كلِّها'); return; }
  if (!dMissing.length && !qMissing.length){ console.log('✅ لا ناقص'); return; }

  const key = azureKey();
  const TMP = fs.mkdtempSync(path.join(require('os').tmpdir(), 'ld-'));
  const sil = path.join(TMP, 'sil.mp3');
  cp.execFileSync('ffmpeg', ['-v','error','-f','lavfi','-i','anullsrc=r=24000:cl=mono',
    '-t','0.40','-c:a','libmp3lame','-b:a','48k','-ar','24000','-ac','1','-y', sil]);
  let d = 0;
  for (const it of dMissing){
    const turns = turnsOf(it.t, it.v);
    const parts = [];
    for (let i = 0; i < turns.length; i++){
      const f = path.join(TMP, 'p' + i + '.mp3');
      fs.writeFileSync(f, await post(key, oneSsml(turns[i].said, turns[i].v), turns[i].said.slice(0,34)));
      parts.push(f);
      if (i < turns.length - 1) parts.push(sil);
      await new Promise(r => setTimeout(r, 300));
    }
    const list = path.join(TMP, 'list.txt');
    fs.writeFileSync(list, parts.map(f => "file '" + f + "'").join('\n') + '\n');
    const rel = dlgFile(it.t), abs = path.join(AUDIO, rel);
    fs.mkdirSync(path.dirname(abs), { recursive:true });
    cp.execFileSync('ffmpeg', ['-v','error','-f','concat','-safe','0','-i',list,'-c','copy','-y',abs]);
    const kb = Math.round(fs.statSync(abs).size/1024);
    if (kb < 60) throw new Error('مقطعُ حوارٍ قصيرٌ مريبٌ (' + kb + 'KB) على: ' + it.t.slice(0,40));
    man.listen[dlgKey(it.t)] = rel;
    d++;
    console.log('  🎧 ' + d + ' / ' + dMissing.length + ' · ' + turns.length + ' سطرًا · ' + kb + 'KB');
    fs.writeFileSync(mp, JSON.stringify(man));
  }
  try{ fs.rmSync(TMP, { recursive:true, force:true }); }catch(e){}
  let q = 0;
  for (const t of qMissing){
    const rel = qFile(t), abs = path.join(AUDIO, rel);
    fs.mkdirSync(path.dirname(abs), { recursive:true });
    fs.writeFileSync(abs, await post(key, oneSsml(t, QVOICE), t.slice(0,40)));
    man.listen[qKey(t)] = rel;
    q++;
    if (q % 20 === 0 || q === qMissing.length) console.log('  ❓ ' + q + ' / ' + qMissing.length);
    await new Promise(r => setTimeout(r, 350));
    if (q % 25 === 0) fs.writeFileSync(mp, JSON.stringify(man));
  }
  fs.writeFileSync(mp, JSON.stringify(man));
  console.log('وُلّد ' + d + ' حوارًا و' + q + ' سؤالًا · والفهرسُ محدَّث');
})().catch(e => { console.error('❌ ' + e.message); process.exit(1); });
