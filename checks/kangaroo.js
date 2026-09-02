/* ============================================================
   مدقّق صفحة «مهارات التفكير» (kangaroo.html)

   لماذا وُجد: اشتكى الأولاد أنّ أسئلة «المعرفة العامة» تتكرّر دائمًا.
   القياس أثبت الشكوى: بنك المعرفة العامة كان ٤٣ سؤالًا فقط ومولّدًا واحدًا،
   بينما بقيّة الأقسام تعطي مئات الأسئلة المختلفة. ولم يكن في المستودع ما
   يكشف ذلك: checks/pages.js يقرأ المولّدات بأسماءٍ معيّنة ولا يرى بنوك
   kangaroo.html، فمرّ النقص سنةً كاملة بلا إنذار.

   يفحص هذا الملفّ ثلاثة أشياء:
   ١) سعة كلّ قسم: كم سؤالًا مختلفًا يستطيع أن يعطي (بالعيّنة).
   ٢) سلامة بنوك الأسئلة الجاهزة: تكرار، مشتّتٌ يساوي الإجابة، مشتّتات ناقصة.
   ٣) مفاتيح منع التكرار: مولّدٌ مفتاحه ثابتٌ لا يعطي إلّا سؤالًا واحدًا
      في الجولة ويُحجب بعدها، فيضيع ثراؤه كلّه.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

/* KANG_FILE يسمح بتشغيل المدقّق على نسخةٍ قديمة للتأكّد أنّه يلتقط الخلل فعلًا */
const FILE = process.env.KANG_FILE || path.join(__dirname, '..', 'kangaroo.html');
const SAMPLES = 700;
/* أدنى سعةٍ مقبولة لقسمٍ كامل: جولةٌ واحدة ١٤ سؤالًا، والطفل يعيد القسم
   عشرات المرّات خلال العام. أقلّ من ١٢٠ يعني تكرارًا محسوسًا. */
const MIN_SECTION = 120;

const SECTIONS = {
  MATH_GENS: 'استدلال رياضي',
  VERB_GENS: 'استدلال لغوي',
  GK_GENS:   'معرفة عامة',
  VIS_GENS:  'فهم الصور'
};

function build(who) {
  const src = fs.readFileSync(FILE, 'utf8');
  const code = src.slice(src.indexOf('<script>') + 8,
                         src.indexOf('var app = document.getElementById'));
  const ctx = vm.createContext({
    URLSearchParams, Math, JSON, console,
    location: { search: '?who=' + who },
    localStorage: { getItem: () => null, setItem: () => {} },
    document: { getElementById: () => null },
    fetch: () => Promise.resolve()
  });
  vm.runInContext(code + '\n;globalThis.__K={MATH_GENS,VERB_GENS,GK_GENS,VIS_GENS,GK,GK_POOL:(typeof GK_POOL!=="undefined"?GK_POOL:GK),MEM_CAP:(typeof MEM_CAP!=="undefined"?MEM_CAP:{gk:20}),COLL,VIS,SEQ,lvl};',
                  ctx, { timeout: 8000 });
  return { ctx, K: ctx.__K };
}

module.exports = function kangaroo() {
  const issues = [];
  const { ctx, K } = build('hasan');

  /* ١) بنك المعرفة العامة */
  const seenQ = new Set(), gk = K.GK;
  gk.forEach(g => {
    if (seenQ.has(g[0])) issues.push({ sev: 'خطأ', msg: 'سؤال معرفةٍ عامّة مكرّر — «' + g[0] + '»' });
    seenQ.add(g[0]);
    if (!Array.isArray(g[2]) || g[2].length < 3)
      issues.push({ sev: 'خطأ', msg: 'مشتّتات ناقصة (المطلوب ٣) — «' + g[0] + '»' });
    else {
      if (new Set(g[2]).size < g[2].length)
        issues.push({ sev: 'خطأ', msg: 'مشتّتٌ مكرّر — «' + g[0] + '»' });
      if (g[2].indexOf(g[1]) >= 0)
        issues.push({ sev: 'خطأ', msg: 'مشتّتٌ يساوي الإجابة — «' + g[0] + '»' });
    }
    if (g[3] !== undefined && (typeof g[3] !== 'number' || g[3] < 1 || g[3] > 4))
      issues.push({ sev: 'خطأ', msg: 'مستوًى غير صالح — «' + g[0] + '»' });
  });

  /* بنك «جماعة كذا»: المشتّتات تُؤخذ من بقيّة القيم، فتكرار قيمةٍ يجعل للسؤال جوابين */
  const cv = K.COLL.map(c => c[1]);
  if (new Set(cv).size !== cv.length)
    issues.push({ sev: 'خطأ', msg: 'تسميةُ جماعةٍ مكرّرة في COLL — تصير للسؤال إجابتان' });
  const vv = [];
  Object.keys(K.VIS).forEach(k => K.VIS[k].forEach(p => vv.push(p[1])));
  if (new Set(vv).size !== vv.length)
    issues.push({ sev: 'خطأ', msg: 'رمزٌ مكرّر في بنك فهم الصور — تصير للسؤال إجابتان' });

  /* ٢) سعة الأقسام + مفاتيح منع التكرار */
  const caps = {};
  Object.keys(SECTIONS).forEach(name => {
    const gens = K[name], all = new Set();
    gens.forEach(f => {
      const texts = new Set(), keys = new Set();
      for (let i = 0; i < SAMPLES; i++) {
        let q;
        try { q = vm.runInContext('(function(f){return f(lvl);})', ctx, { timeout: 2000 })(f); }
        catch (e) { continue; }
        if (!q) continue;
        texts.add(q[0]); keys.add(q[4] || q[0]); all.add(q[0]);
      }
      /* مفتاحٌ ثابتٌ مع نصوصٍ كثيرة = المولّد غنيٌّ لكنّه محجوبٌ بعد سؤالٍ واحد */
      if (keys.size === 1 && texts.size > 5)
        issues.push({ sev: 'خطأ', msg: SECTIONS[name] + ' — ' + (f.name || '?') +
          ': مفتاح منع التكرار ثابت مع ' + texts.size + ' سؤالًا مختلفًا، فلا يُطرح منه إلّا سؤالٌ واحد' });
    });
    caps[name] = all.size;
    if (all.size < MIN_SECTION)
      issues.push({ sev: 'خطأ', msg: SECTIONS[name] + ' — سعةٌ منخفضة: ' + all.size +
        ' سؤالًا مختلفًا فقط (الحدّ ' + MIN_SECTION + ')' });
  });

  /* ٣) الذاكرة يجب أن تبقى أصغر من البنك لكلّ طفل، وإلّا استُنفد البنك فسُمح بالتكرار */
  ['saud', 'osama', 'rafeef', 'hasan'].forEach(who => {
    const k = build(who).K;
    if (k.MEM_CAP.gk >= k.GK_POOL.length)
      issues.push({ sev: 'خطأ', msg: who + ' — ذاكرةُ المعرفة العامة (' + k.MEM_CAP.gk +
        ') ليست أصغر من بنكه (' + k.GK_POOL.length + ')' });
    else if (k.GK_POOL.length < MIN_SECTION)
      issues.push({ sev: 'تنبيه', msg: who + ' — بنك المعرفة العامة المتاح له ' +
        k.GK_POOL.length + ' سؤالًا فقط' });
  });

  return {
    gkBank: gk.length,
    caps: Object.keys(SECTIONS).map(n => SECTIONS[n] + ': ' + caps[n]).join(' · '),
    issues
  };
};

if (require.main === module) {
  const r = module.exports();
  console.log('بنك المعرفة العامة: ' + r.gkBank + ' سؤالًا');
  console.log(r.caps);
  r.issues.forEach(i => console.log('  ' + (i.sev === 'خطأ' ? '❌' : '⚠️ ') + ' ' + i.msg));
  if (!r.issues.length) console.log('  ✅ لا ملاحظات');
}
