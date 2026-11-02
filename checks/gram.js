/* ============================================================
   مدقّق جدول قواعد ستيب

   جدول القواعد الخمسة عشر كان مكتوبًا داخل practice.html، فصفحات
   التقرير لا تعرف أسماء القواعد ولا عددها — فلا تقدر أن تقول للأب
   ما تركه الولد. وخرج الجدول إلى gram-rules.js يقرؤه ثلاث صفحات.

   وهذا الخروج أنشأ ثلاثة مواضع تنفصل بعضها عن بعض بمرور الوقت:

   ١) اسم القاعدة في الجدول واسمها في step-bank.js: المفتاح المحفوظ
      في قاعدة البيانات «Grammar — » + الاسم الإنجليزي حرفًا بحرف.
      فلو كُتب في أحدهما «Modals» وفي الآخر «Modal Auxiliaries» سقط
      الوصل صامتًا: البطاقة تُرسم ولا يصل إليها سؤال، أو السؤال يُحفظ
      ولا تُرسم له بطاقة.

   ٢) GRAM_BANK_N: صفحات التقرير تقول «قطع كذا من ثلاثمئة» وهي
      ١٥ × ٢٠، ولا تحمّل بنك الثلاثمئة لتعدّه. فإن زاد البنك يومًا
      كذب الرقم. فيُفحص هنا أن كل قاعدة فيها هذا العدد بعينه.

   ٣) وسم <script>: صفحةٌ لا تحمّل gram-rules.js تسقط عندها بطاقة
      القواعد أو تخلو من سطر التغطية — بلا خطأٍ في الطرفيّة.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
/* الصفحات التي تقرأ الجدول — وكلٌّ منها يلزمها الوسم */
const USERS = ['practice.html', 'home.html', 'child.html'];

function loadWin(file, win) {
  const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const ctx = { window: win, self: win, globalThis: win };
  vm.createContext(ctx);
  new vm.Script(src, { filename: file }).runInContext(ctx);
  return win;
}

module.exports = function () {
  const issues = [];
  const E = m => issues.push({ sev: 'خطأ', msg: m });
  const W = m => issues.push({ sev: 'تنبيه', msg: m });

  let win = {};
  try { loadWin('gram-rules.js', win); }
  catch (e) { E('gram-rules.js لا يُحمَّل: ' + e.message); return { rules: 0, bankN: 0, issues }; }
  try { loadWin('step-bank.js', win); }
  catch (e) { E('step-bank.js لا يُحمَّل: ' + e.message); return { rules: 0, bankN: 0, issues }; }

  const RULES = win.GRAM_RULES || [];
  const BANK_N = win.GRAM_BANK_N || 0;
  const SB = win.STEP_BANK || [];

  if (!RULES.length) E('window.GRAM_RULES فارغٌ أو غيرُ معرَّف');
  if (!BANK_N) E('window.GRAM_BANK_N غيرُ معرَّف');

  /* ١) سلامةُ كلِّ صفٍّ: أربعةُ نصوصٍ غيرُ فارغة، ولا اسمَ مكرّرًا */
  const byEn = {};
  RULES.forEach((t, i) => {
    const nm = 'GRAM_RULES#' + (i + 1);
    if (!Array.isArray(t) || t.length !== 4) { E(nm + ': الصفُّ ليس أربعةَ عناصر'); return; }
    t.forEach((x, j) => {
      if (typeof x !== 'string' || !x.trim())
        E(nm + ': العنصرُ ' + (j + 1) + ' فارغٌ أو ليس نصًّا');
    });
    if (byEn[t[0]]) E(nm + ': الاسمُ «' + t[0] + '» مكرّرٌ في الجدول');
    byEn[t[0]] = true;
    /* الشرحُ هو ما يُقرأ قبل الجولة، فسطرٌ قصيرٌ لا يُعلّم قاعدة */
    if (t[3].length < 60) W(nm + ' (' + t[1] + '): شرحُ القاعدةِ ' + t[3].length + ' حرفًا فقط');
  });

  /* ٢) مواضيعُ البنكِ تُقرأ من صدرِ السؤال: <b>Grammar — X:</b> */
  const cnt = {};
  SB.forEach(q => {
    const m = /^<b>Grammar — ([^:<]+):<\/b>/.exec(String((q && q[0]) || ''));
    const k = m ? m[1].trim() : null;
    if (!k) { cnt['??'] = (cnt['??'] || 0) + 1; return; }
    cnt[k] = (cnt[k] || 0) + 1;
  });
  if (cnt['??']) E('step-bank.js: ' + cnt['??'] + ' سؤالًا بلا وسمِ قاعدةٍ في صدرِه');

  /* ٣) الجدولُ والبنكُ يتطابقان اسمًا اسمًا، والعددُ هو GRAM_BANK_N */
  RULES.forEach(t => {
    const n = cnt[t[0]] || 0;
    if (!n) { E('القاعدةُ «' + t[1] + '» (' + t[0] + ') في الجدولِ ولا سؤالَ لها في البنك — بطاقةٌ تُرسَم ولا يصل إليها سؤال'); return; }
    if (BANK_N && n !== BANK_N)
      E('القاعدةُ «' + t[1] + '»: بنكُها ' + n + ' سؤالًا وGRAM_BANK_N يقول ' + BANK_N +
        ' — فعددُ «قطع كذا من كذا» في التقريرِ كاذب، فحدِّث الرقمَ في gram-rules.js');
  });
  Object.keys(cnt).forEach(k => {
    if (k === '??') return;
    if (!byEn[k]) E('موضوعُ «' + k + '» في step-bank.js وليس في الجدول — ' + cnt[k] +
      ' سؤالًا تُحفظ نتيجتُها ولا تُرسَم لها بطاقةٌ ولا شرح');
  });

  /* ٤) كلُّ صفحةٍ تقرأ الجدولَ تحمّله */
  USERS.forEach(f => {
    let h = '';
    try { h = fs.readFileSync(path.join(ROOT, f), 'utf8'); }
    catch (e) { E(f + ' غيرُ موجود'); return; }
    if (h.indexOf('gram-rules.js') < 0)
      E(f + ' يقرأ الجدولَ ولا يحمّل gram-rules.js — يسقط القسمُ أو سطرُ التغطيةِ صامتًا');
  });

  return { rules: RULES.length, bankN: BANK_N, topics: Object.keys(cnt).filter(k => k !== '??').length, issues };
};
