/* ============================================================
   مدقّق بنوك الأسئلة الثابتة

   بلاغ الأب (٥ سبتمبر ٢٠٢٦): «مادة العلوم عند حسن الأسئلة هي نفسها
   ما تتغيّر». والقياس أثبته: بنك «البراكين» أحد عشر سؤالًا ويُعرض منها
   عشرة كلّ جولة، و«الصفائح» اثنا عشر يُعرض منها أحد عشر. فالجولة
   الثانية هي الأولى مخلوطةً، لا جولةٌ جديدة.

   وهذا عيبٌ بنيويّ لا عارض: أقسامٌ كثيرة في الموقع تُولّد أسئلتها من
   بنكٍ ثابت بـ bankGen، فسعتها = حجم بنكها بالضبط. فإذا قارب عدد ما
   يُعرض في الجولة حجمَ البنك لم يبقَ للتنويع موضع، مهما خُلطت الخيارات.

   ولم يكن في المستودع ما يكشف ذلك: checks/pages.js يفحص المولّدات
   الحسابية التي تُركّب أرقامًا جديدة، وهذه بنوكٌ محفوظة لا تُركّب شيئًا.
   فمرّت صغيرةً بلا إنذار.

   النسبة المقيسة = ما يُعرض في الجولة ÷ حجم البنك:
     أقلّ من ٥٥٪   ← تنويعٌ محسوس ✅
     ٥٥٪ فأكثر    ← تكرارٌ يشعر به الطفل ⚠️
     ٩٠٪ فأكثر    ← البنك كلّه كلّ جولة، فلا تنويع البتّة ❌

   والعلاج زيادة البنك لا إنقاص ما يُعرض: الطفل جاء ليتدرّب.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const WARN_AT = 55;
const ERR_AT  = 90;

/* يمشي على النصّ عادًّا الأقواس، متجاهلًا ما بين علامات الاقتباس —
   فنصوص الأسئلة العربية تحوي أقواسًا كثيرة لا يصحّ عدّها. */
function walk(src, start, open, close) {
  let i = start, depth = 0, str = null;
  for (; i < src.length; i++) {
    const c = src[i], p = src[i - 1];
    if (str) { if (c === str && p !== '\\') str = null; continue; }
    if (c === '"' || c === "'" || c === '`') { str = c; continue; }
    if (c === open) depth++;
    else if (c === close) { depth--; if (!depth) return i; }
  }
  return -1;
}

function arrayLiteral(src, name) {
  const m = new RegExp('\\b' + name + '\\s*=\\s*\\[').exec(src);
  if (!m) return null;
  const st = m.index + m[0].length - 1;
  const en = walk(src, st, '[', ']');
  return en < 0 ? null : src.slice(st, en + 1);
}

module.exports = function banks() {
  const issues = [];
  const dir = process.env.BANKS_DIR || path.join(__dirname, '..');
  let checked = 0, worst = 0;

  fs.readdirSync(dir).filter(f => /\.html$/.test(f)).forEach(file => {
    const src = fs.readFileSync(path.join(dir, file), 'utf8');
    if (!/bankGen\s*\(/.test(src)) return;

    /* اسم مصفوفة المولّدات → اسم البنك:  var L1G=[bankGen(L1)] */
    const genOf = {};
    for (const m of src.matchAll(/(\w+)\s*=\s*\[\s*bankGen\(\s*(\w+)\s*\)/g)) genOf[m[1]] = m[2];

    /* مدخل CFG: id:{ ... gens:L1G ... n:10 ... } */
    for (const m of src.matchAll(/(\w+)\s*:\s*\{[^\n]*?gens:\s*(\w+)[^\n]*?n:\s*(\d+)/g)) {
      const id = m[1], gens = m[2], n = +m[3];
      const bankName = genOf[gens];
      if (!bankName) continue;              /* مولّدٌ محسوب لا بنكًا ثابتًا */
      const lit = arrayLiteral(src, bankName);
      if (!lit) {
        issues.push({ sev: 'تنبيه', msg: file + ' — تعذّرت قراءة بنك ' + bankName });
        continue;
      }
      let arr;
      try { arr = vm.runInNewContext('(' + lit + ')', { en: s => s }, { timeout: 5000 }); }
      catch (e) { issues.push({ sev: 'تنبيه', msg: file + ' — بنك ' + bankName + ' لا يُقوَّم: ' + String(e.message).slice(0, 60) }); continue; }
      if (!Array.isArray(arr) || !arr.length) continue;

      checked++;
      const pct = Math.round(100 * n / arr.length);
      if (pct > worst) worst = pct;
      const where = file + ' · ' + id + ' (بنك ' + bankName + ')';
      if (pct >= ERR_AT) {
        issues.push({ sev: 'خطأ', msg: where + ' — البنك ' + arr.length + ' سؤالًا ويُعرض منها ' + n +
          ' كلّ جولة (' + pct + '٪): الجولة الثانية هي الأولى مخلوطةً. زِد البنك إلى ' + (n * 2) + ' على الأقلّ.' });
      } else if (pct >= WARN_AT) {
        issues.push({ sev: 'تنبيه', msg: where + ' — البنك ' + arr.length + ' ويُعرض ' + n +
          ' (' + pct + '٪): تكرارٌ يشعر به الطفل. الأفضل ' + (n * 2) + ' فأكثر.' });
      }

      /* سلامة البنك نفسه: سؤالٌ مكرّر أو خيارٌ مُعاد يُنقص السعة الحقيقية */
      const stems = new Set();
      arr.forEach((q, i) => {
        if (!Array.isArray(q) || !Array.isArray(q[1])) {
          issues.push({ sev: 'خطأ', msg: where + ' — المدخل ' + i + ' ليس على صيغة [سؤال، خيارات، شرح]' });
          return;
        }
        const stem = String(q[0]).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        if (stems.has(stem)) issues.push({ sev: 'تنبيه', msg: where + ' — سؤالٌ مكرّر داخل البنك: ' + stem.slice(0, 50) });
        stems.add(stem);
        const opts = q[1].map(x => String(x).replace(/<[^>]*>/g, '').trim());
        if (new Set(opts).size !== opts.length) {
          issues.push({ sev: 'خطأ', msg: where + ' — خياران متطابقان في: ' + stem.slice(0, 50) });
        }
      });
    }
  });

  return { checked, worst, issues };
};
