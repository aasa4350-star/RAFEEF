/* يُشغّل محاكيَ المفرداتِ على لقطةِ ابنٍ حقيقيّةٍ ويقيس ثلاثةَ أرقامٍ معًا.
 * الاستعمال: node tools/sim-run.js <ملفُ اللقطة.json> <أيام> [بذرة]
 * ويُقاس: الإتقانُ (متقنة) · التكرارُ بين جلستين · التغطيةُ (كلماتٌ مميّزة). */
'use strict';
const fs = require('fs'), vm = require('vm'), path = require('path');
const E = require('./lib-extract.js');
const { build } = require('./sim-vocab.js');
const ROOT = path.join(__dirname, '..');

/* القائمةُ الحقيقيّةُ بترتيبِها الحقيقيّ — تُبنى بكودِ الصفحةِ لا بيدي */
function realList(){
  const SRC = fs.readFileSync(path.join(ROOT, 'reading.html'), 'utf8');
  const a = SRC.indexOf('    var P = window.VOCAB_PLUS;');
  const merge = SRC.slice(SRC.lastIndexOf('(function(){', a),
                          SRC.indexOf('var VOCAB_LIST = (function(){', a));
  const box = { window:{}, who:'hasan', VOCAB300: E.readArray(SRC, 'VOCAB300'),
                Math, JSON };
  vm.createContext(box);
  for (const f of ['vocab-plus.js','vocab-bank.js'])
    vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), box);
  vm.runInContext(merge, box);
  return box.VOCAB300;
}

/* مولّدٌ حتميٌّ بالبذرةِ — فالتجربةُ تُعاد بالرقمِ نفسِه */
function rng(seed){ let s = seed >>> 0 || 1;
  return () => { s ^= s<<13; s>>>=0; s ^= s>>17; s ^= s<<5; s>>>=0; return s/4294967296; }; }

function run(opts){
  const { bank, sr0, rvSize, days, perDay, acc, seed, label } = opts;
  const ctx = build('hasan', bank, JSON.parse(JSON.stringify(sr0)), rvSize);
  const R = rng(seed);
  const DAY = 86400000;
  const seen = {}, repeats = [];
  const pos = {}; bank.forEach((w,i) => pos[w[0]] = i);
  let posMin = 1e9, posMax = -1, posSum = 0;
  let prev = null, shown = 0, premature = 0;
  /* الزمنُ يتقدّم بالحقن: الكودُ يقرأ Date.now() فنُقدّمه يومًا بيوم */
  let t = Date.now();
  vm.runInContext('var __T = ' + t + '; Date = { now: function(){ return __T; } };', ctx);
  for (let d = 0; d < days; d++){
    for (let s = 0; s < perDay; s++){
      t += Math.round(DAY / (perDay + 1));
      vm.runInContext('__T = ' + t + ';', ctx);
      const pick = vm.runInContext('sessionPick()', ctx);
      const V = pick.V;
      if (!V.length) continue;
      if (prev){
        const set = {}; prev.forEach(w => set[w] = 1);
        repeats.push(V.filter(w => set[w]).length / V.length);
      }
      /* هل عُرضت قبل موعدها؟ — تكديسٌ يُبطل التباعد */
      const srNow = vm.runInContext('srDump()', ctx);
      const DAYS = [0,1,2,4,8,16,30,45];
      V.forEach(w => { const st = srNow[w];
        if (st && st.t && (st.t + DAYS[Math.min(st.b||0,7)]*DAY) > t) premature++; });
      V.forEach(w => { const i = pos[w];
        if (i != null){ if (i < posMin) posMin = i; if (i > posMax) posMax = i; posSum += i; } });
      V.forEach(w => { seen[w] = (seen[w]||0) + 1; shown++;
        vm.runInContext('answer(' + JSON.stringify(w) + ', ' + (R() < acc) + ')', ctx); });
      prev = V;
    }
    t = Date.now() + (d+1)*DAY;
    vm.runInContext('__T = ' + t + ';', ctx);
  }
  const known = vm.runInContext('knownCount()', ctx);
  const distinct = Object.keys(seen).length;
  const rep = repeats.length ? repeats.reduce((a,b)=>a+b,0)/repeats.length : 0;
  const counts = Object.keys(seen).map(k=>seen[k]).sort((a,b)=>b-a);
  return { label, known, distinct, shown,
           posRange: (posMin+1) + '–' + (posMax+1),
           posAvg: Math.round(posSum/Math.max(shown,1)) + 1,
           repeat: Math.round(rep*100),
           premature: Math.round(100*premature/Math.max(shown,1)),
           maxTimes: counts[0]||0,
           bankPct: Math.round(100*distinct/bank.length) };
}
module.exports = { run, realList, rng };

if (require.main === module){
  const snapFile = process.argv[2];
  const days = parseInt(process.argv[3]||'60', 10);
  const seed = parseInt(process.argv[4]||'7', 10);
  const bankAll = realList();
  const snap = JSON.parse(fs.readFileSync(snapFile, 'utf8'));
  const learned = snap.learned || 910;
  const bank = bankAll.slice(0, learned);
  /* اللقطةُ تُخزَّن مضغوطةً [b,c,يوم] — تُفَكُّ إلى ما يقرؤه الكود */
  const sr0 = {}; const now = Date.now();
  const originDay = snap.originDay;
  Object.keys(snap.sr).forEach(k => { const v = snap.sr[k];
    const b = Array.isArray(v) ? v[0] : v.b, c = Array.isArray(v) ? v[1] : v.c,
          dy = Array.isArray(v) ? v[2] : null;
    sr0[k] = { b: b||0, c: c||0, n: Math.max(c||0,1),
               t: dy != null ? now - (originDay - dy)*86400000 : now };
  });
  console.log('البنك: ' + bank.length + ' كلمة · اللقطة: ' + Object.keys(sr0).length +
              ' · الأيّام: ' + days + ' · البذرة: ' + seed);
  const r = run({ bank, sr0, rvSize: 30, days, perDay: 1, acc: 0.90, seed, label: 'الحالي' });
  console.log(JSON.stringify(r, null, 1));
}
