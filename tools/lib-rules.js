/* قراءةُ «قاعدة كلّ درس» من صفحةِ منهجٍ — مصدرٌ واحدٌ للمولّدِ وللحارس.
 *
 * ولِمَ مشتركٌ: المولّدُ (tools/gen-rules-pdf.js) يرسم الورقةَ، والحارسُ
 * (checks/pages.js) يتحقّق أنّها توافق الشاشة. فلو قرأ كلٌّ منهما بطريقته
 * لاختلفا في درسٍ أو فصلٍ فصاح الحارسُ بلا سبب، أو سكت والورقةُ مخالفة.
 *
 * والبصمةُ على المادّةِ المطبوعةِ وحدَها — لا على الصفحةِ كلِّها: الصفحةُ
 * تتغيّر كلَّ أسبوعٍ لأسبابٍ لا تمسّ القواعد (وسمٌ جديد، تعديلُ نمط)،
 * فلو بُصمت كلُّها لصاح الحارسُ في كلِّ تعديلٍ حتّى يُهمَل. فتُبصَم
 * العناوينُ والقواعدُ وترتيبُها، فلا يصيح إلّا إذا تغيّر ما يُطبَع.
 */
'use strict';
const crypto = require('crypto');
const EX = require('./lib-extract.js');

/* الدوالُّ التي تستعملها نصوصُ القواعدِ داخلَ الصفحة. وen تعزل اللاتينيَّ
   عن العربيِّ — بغيرِها ينقلب «Autos» داخلَ فقرةٍ عربيّة. */
const SHIMS = { en: s => '<span class="en">' + s + '</span>' };

function readRules(src, file){
  const vm = require('vm');
  const lit = EX.literalAfter(src, /(?:var|let|const)\s+REMTOPICS\s*=/, '[', ']');
  if (!lit) return null;
  const box = Object.assign({}, SHIMS);
  vm.createContext(box);
  let topics;
  try { topics = vm.runInContext('(' + lit + ')', box, { timeout: 4000 }); }
  catch(e){ throw new Error((file || 'الصفحة') + ' — تعذّر قراءة REMTOPICS: ' + e.message); }
  if (!Array.isArray(topics)) return null;

  /* وحداتُ الفصلِ الثاني لا تُطبَع قبل أن تبدأ: english9.html يُخفيها
     بمفتاح TERM2، فلو طُبعت لكان في يدِه ورقةٌ فيها ما ليس في صفحته.
     فيُقرأ المفتاحُ نفسُه لا يُفترَض. */
  const t2 = /(?:var|let|const)\s+TERM2\s*=\s*(true|false)/.exec(src);
  const hiddenIds = (t2 && t2[1] === 'false') ? (EX.readArray(src, 'TERM2_IDS') || []) : [];
  const live = topics.filter(t => t && hiddenIds.indexOf(t.id) < 0);

  const hasTip = t => typeof t.tip === 'string' && t.tip.trim().length > 0;
  const withTip = live.filter(hasTip);
  const noTip = live.filter(t => !hasTip(t));

  let chaps = null;
  try { chaps = EX.readObject(src, 'CHAPS'); } catch(e){ chaps = null; }

  const sections = [];
  if (chaps){
    const seen = {};
    for (const k of Object.keys(chaps)){
      const ids = (chaps[k] && chaps[k].ids) || [];
      const items = withTip.filter(t => ids.indexOf(t.id) >= 0);
      items.forEach(t => { seen[t.id] = 1; });
      if (items.length) sections.push({ name: (chaps[k] && chaps[k].name) || null, items });
    }
    const rest = withTip.filter(t => !seen[t.id]);
    if (rest.length) sections.push({ name: sections.length ? 'دروسٌ أخرى' : null, items: rest });
  } else if (withTip.length){
    sections.push({ name: null, items: withTip });
  }

  const title = (/<title>([^<]*)<\/title>/.exec(src) || [, (file || '')])[1].trim();
  /* ما يدخل البصمةَ هو ما يظهر في الورقةِ بعينِه وبترتيبِه */
  const canon = JSON.stringify({
    title: title,
    secs: sections.map(s => ({
      n: s.name,
      i: s.items.map(t => [String(t.id), String(t.name || ''), String(t.tip)])
    }))
  });
  return {
    title: title,
    sections: sections,
    count: withTip.length,
    noTip: noTip.map(t => t.id),
    hiddenIds: hiddenIds,
    digest: crypto.createHash('sha256').update(canon).digest('hex').slice(0, 16)
  };
}

/* ═══ ورقةُ الاختبارِ الفتريِّ وحدَه ═══════════════════════════════════
   طلبُ الأب (١٠ أكتوبر ٢٠٢٦): «أبي قواعد الرياضيات دروس حسن اختبار
   الفتري فقط». فورقةُ المادّةِ كلِّها خمسٌ وعشرون درسًا، والمقرَّرُ
   أحدَ عشرَ — فيذاكر أربعةَ عشرَ درسًا لا تأتي في ورقته.

   والمقرَّرُ يُقرأ من FATRI_IDS في الصفحةِ نفسِها لا يُكتب هنا: هو
   القائمةُ التي يُبنى منها الاختبارُ فعلًا، فلو ضُيِّق المقرَّرُ أو
   وُسِّع تبعته الورقةُ في التوليدِ التالي. ولو كُتب هنا لصارت الورقةُ
   تَعِد بما لا يُسأل عنه — وهو أسوأُ من ألّا تكون ورقة.

   ويُعاد ترتيبُ الدروسِ بفصولِها كما في ورقةِ المادّة، ويُؤخَذ سطرُ
   المقرَّرِ من CHAPS.fatri.unit إن وُجد فتقول الورقةُ ما تقوله الشاشة. */
function readFatri(src, file){
  const ids = EX.readArray(src, 'FATRI_IDS');
  if (!ids || !ids.length) return null;
  const base = readRules(src, file);
  if (!base) return null;
  const want = {};
  ids.forEach(id => { want[id] = 1; });

  const sections = [];
  for (const sec of base.sections){
    const items = sec.items.filter(t => want[t.id]);
    if (items.length) sections.push({ name: sec.name, items: items });
  }
  const count = sections.reduce((n, s) => n + s.items.length, 0);
  if (!count) return null;

  /* سطرُ المقرَّرِ كما يُعرَض فوق تبويبِ الفتري */
  let unit = null;
  const lit = EX.literalAfter(src, /fatri\s*:\s*\{/, '{', '}');
  if (lit){
    try {
      const o = EX.evalLiteral(lit, 'CHAPS.fatri');
      if (o && typeof o.unit === 'string') unit = o.unit.replace(/<[^>]*>/g, '').trim();
    } catch(e){ unit = null; }
  }

  /* ═══ عددُ الأسئلةِ يُحسَب لا يُفترَض ═══════════════════════════════
     كان عددُ FATRI_IDS هو العدَّ، فخرجت ورقةُ سعودٍ وأسامةَ تقول «سؤالٌ
     واحد» وامتحانُهما عشرة: قائمتُهما بنكٌ واحدٌ يُسحَب منه عشرةُ أسئلة،
     وقائمةُ حسنٍ سؤالٌ لكلّ مدخلة. والصيغُ مختلفةٌ بين الصفحات
     (10 · FATRI_IDS.length · FATRI_IDS.length * FATRI_PER)، فتُقوَّم
     تصاريحُ FATRI_* بترتيبِها في المصدرِ ويُقرأ الناتج. */
  let questions = ids.length, marks = null;
  try {
    const vmx = require('vm');
    const sb = {};
    vmx.createContext(sb);
    const re = /(?:var|let|const)\s+(FATRI_[A-Z_0-9]+)\s*=\s*([^;]+);/g;
    let d;
    while ((d = re.exec(src))){
      try { vmx.runInContext('var ' + d[1] + ' = (' + d[2] + ');', sb, { timeout: 1000 }); }
      catch(e){ /* تصريحٌ يعتمد على غيرِه — يُتخطّى ويبقى ما قبله */ }
    }
    if (typeof sb.FATRI_MCQ === 'number' && sb.FATRI_MCQ > 0) questions = sb.FATRI_MCQ;
    if (typeof sb.FATRI_TOTAL === 'number' && sb.FATRI_TOTAL > 0) marks = sb.FATRI_TOTAL;
  } catch(e){ /* يبقى العدُّ على القائمة */ }

  const uniq = ids.filter((v, i) => ids.indexOf(v) === i);
  const canon = JSON.stringify({
    t: base.title, u: unit, q: questions, m: marks,
    secs: sections.map(s => ({ n: s.name, i: s.items.map(t => [String(t.id), String(t.name || ''), String(t.tip)]) }))
  });
  return {
    title: base.title, unit: unit, sections: sections, count: count,
    questions: questions, marks: marks, lessons: uniq.length,
    /* دروسٌ في المقرَّرِ ولا قاعدةَ لها — تُقال ولا تُطوى */
    missing: uniq.filter(id => !sections.some(s => s.items.some(t => t.id === id))),
    digest: crypto.createHash('sha256').update(canon).digest('hex').slice(0, 16)
  };
}

/* الصفحاتُ تُكتشَف ولا تُعدَّد باليد: لو كانت قائمةً مكتوبةً لسقطت منها
   صفحةٌ تُضاف بعد اليوم بلا أن يَبين. */
function pagesWithRules(fs, path, root){
  return fs.readdirSync(root).filter(f => f.endsWith('.html')).sort().filter(f =>
    /(?:var|let|const)\s+REMTOPICS\s*=/.test(fs.readFileSync(path.join(root, f), 'utf8')));
}

module.exports = { readRules, readFatri, pagesWithRules, SHIMS };
