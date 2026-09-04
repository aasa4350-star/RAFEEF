/* ============================================================
   مدقّق روابط شرح الدروس في رياضيات المدرسة

   طلب الأب (٤ سبتمبر ٢٠٢٦): «قسم الرياضيات حق المدرسة حط روابط
   يوتيوب على كل درس». وحين قِسنا وجدنا math4 وmath8 تعرضه أصلًا،
   وmath5 وmath9 لا تعرضه — مع أنّ نصّ البحث لكلّ درسٍ موجودٌ عندهما
   في REMTOPICS[].yt، ولم يكن يُستعمل إلّا في قسم «علاجي». فمرّ
   النقص بلا إنذار لأنّ لا شيء في المستودع كان يفحصه.

   ويفحص هذا الملفّ أربعة أشياء، كلّها وقعت فعلًا أو كادت:

   ١) تغطية: كلّ درسٍ في CFG (عدا الاختبارات الشاملة) له مدخلٌ في
      REMTOPICS بنصّ بحثٍ غير فارغ. درسٌ بلا نصٍّ = زرٌّ لا يظهر.
   ٢) الزرّ يُبنى فعلًا: دالّة render تُخرج data-eduvid. وُجد النصّ
      ولم يُستعمل — وهذا بالضبط ما كان في math5 وmath9.
   ٣) إعفاء الحارس: صفحات الرياضيات تطرد من غاب مرّتين. وفتحُ شرح
      الدرس غيابٌ في نظر المتصفّح، فمن يشاهد فيديوين يُطرد وهو
      يتعلّم. فيجب أن يقرأ مستمعُ visibilitychange علمَ __eduExempt،
      وأن يضعه مستمعُ نقر الزرّ.
   ٤) روابط بحثٍ لا معرّفات فيديو: الفيديو يُحذف أو يصير خاصًّا
      فينكسر الزرّ صامتًا، والبحث لا ينكسر. ونتحقّق كذلك ألّا
      يتشارك درسان نصَّ بحثٍ واحدًا، فيُرسَل الولد لشرحٍ ليس درسه.
   ============================================================ */
const fs = require('fs');
const path = require('path');


/* الصفحات المقصودة: رياضيات المدرسة وحدها. math7.html متروكةٌ عمدًا —
   لا رابط إليها من أيّ صفحة، وقد خلفتها math8.html لصفّ رفيف نفسه. */
const FILES = [
  ['math4.html', 'سعود · رابع'],
  ['math5.html', 'أسامة · خامس'],
  ['math8.html', 'رفيف · ثاني متوسط'],
  ['math9.html', 'حسن · ثالث متوسط']
];

/* يقتطع نصّ تعريفٍ حرفيّ يبدأ عند "الاسم =" بعدّ الأقواس — لا نُقوّمه،
   لأنّ قيم CFG تشير إلى المولّدات بأسمائها (gens:H1) فيسقط أيّ تقويمٍ
   معزول بـReferenceError. والمطلوب هنا المفاتيح لا القيم، والقراءةُ
   بالنمط تكفي وتُغني عن تحميل الصفحة كلّها. */
function sliceLiteral(src, name, openChar, closeChar) {
  const re = new RegExp('\\b' + name + '\\s*=\\s*\\' + openChar);
  const m = re.exec(src);
  if (!m) return null;
  let i = m.index + m[0].length - 1, depth = 0, inStr = null;
  for (; i < src.length; i++) {
    const ch = src[i], prev = src[i - 1];
    if (inStr) { if (ch === inStr && prev !== '\\') inStr = null; continue; }
    if (ch === '"' || ch === "'" || ch === '`') { inStr = ch; continue; }
    if (ch === openChar) depth++;
    else if (ch === closeChar) { depth--; if (!depth) break; }
  }
  return depth === 0 ? src.slice(m.index + m[0].length - 1, i + 1) : null;
}

/* مفاتيح المستوى الأوّل في CFG مع نصّ التبويب إن وُجد.
   math8/math9 تحمل tab: داخل الوصف، وmath4/math5 تكتب التبويبات في
   HTML مباشرةً فلا tab لها — فنقبل الحالتين. */
function cfgLessons(lit) {
  const out = {};
  const re = /(^|[\n,])\s*([A-Za-z_]\w*)\s*:\s*\{([^\n]*)/g;
  let m;
  while ((m = re.exec(lit))) {
    const tab = /tab\s*:\s*"([^"]*)"/.exec(m[3]);
    const label = /label\s*:\s*"([^"]*)"/.exec(m[3]);
    out[m[2]] = tab ? tab[1] : (label ? label[1] : m[2]);
  }
  return out;
}

/* مداخل REMTOPICS: المعرّف ونصّ البحث */
function remTopics(lit) {
  const out = {};
  const re = /\{\s*id\s*:\s*"([^"]+)"([\s\S]*?)\}\s*(?=,\s*\{|\s*\])/g;
  let m;
  while ((m = re.exec(lit))) {
    const yt = /yt\s*:\s*"([^"]*)"/.exec(m[2]);
    const nm = /name\s*:\s*"([^"]*)"/.exec(m[2]);
    out[m[1]] = String((yt && yt[1]) || (nm && nm[1]) || '').trim();
  }
  return out;
}

/* حارس الخروج هو مستمع visibilitychange الذي يستدعي ejc() — وفي كلّ
   صفحةٍ مستمعان، فلا يصحّ فحص الأوّل ثمّ الحكم. */
function ejectGuards(src) {
  const out = [];
  const re = /visibilitychange/g;
  let m;
  while ((m = re.exec(src))) {
    const chunk = src.slice(m.index, m.index + 600);
    if (/\bejc\s*\(/.test(chunk)) out.push(chunk);
  }
  return out;
}

module.exports = function eduvid() {
  const issues = [];
  let lessons = 0, linked = 0;

  FILES.forEach(([file, who]) => {
    /* EDUVID_DIR يسمح بتشغيل المدقّق على نسخةٍ معطوبة للتأكّد أنّه يلتقط الخلل فعلًا */
    const full = path.join(process.env.EDUVID_DIR || path.join(__dirname, '..'), file);
    if (!fs.existsSync(full)) {
      issues.push({ sev: 'خطأ', msg: file + ' — الملفّ غير موجود' });
      return;
    }
    const src = fs.readFileSync(full, 'utf8');

    /* ٢) الزرّ يُبنى، و٣) الحارس يُعفي */
    if (!/data-eduvid/.test(src)) {
      issues.push({ sev: 'خطأ', msg: file + ' (' + who + ') — لا يبني زرّ شرح الدرس أصلًا (data-eduvid مفقود)' });
    }
    const guards = ejectGuards(src);
    if (!guards.length) {
      issues.push({ sev: 'تنبيه', msg: file + ' (' + who + ') — لم يُعثر على حارس الخروج، فلم يُفحص الإعفاء' });
    } else if (guards.some(g => !/__eduExempt/.test(g))) {
      issues.push({ sev: 'خطأ', msg: file + ' (' + who + ') — حارس الخروج لا يعفي شرح الدرس: من شاهد فيديوين طُرد وهو يتعلّم' });
    }
    if (/data-eduvid/.test(src) && !/__eduExempt\s*=\s*true/.test(src)) {
      issues.push({ sev: 'خطأ', msg: file + ' (' + who + ') — زرّ الشرح لا يضع علم الإعفاء عند النقر' });
    }

    const cfgLit = sliceLiteral(src, 'CFG', '{', '}');
    const remLit = sliceLiteral(src, 'REMTOPICS', '[', ']');
    if (!cfgLit || !remLit) {
      issues.push({ sev: 'تنبيه', msg: file + ' (' + who + ') — تعذّر قراءة CFG أو REMTOPICS، فلم تُفحص التغطية' });
      return;
    }
    const CFG = cfgLessons(cfgLit);
    const yt = remTopics(remLit);
    if (!Object.keys(CFG).length || !Object.keys(yt).length) {
      issues.push({ sev: 'تنبيه', msg: file + ' (' + who + ') — قُرئت الكتل لكن بلا مداخل، فلم تُفحص التغطية' });
      return;
    }

    /* ١) التغطية: كلّ درسٍ غير شاملٍ له نصّ بحث */
    const missing = [];
    Object.keys(CFG).forEach(id => {
      if (/^all/.test(id)) return;           /* الاختبار الشامل ليس درسًا */
      lessons++;
      if (yt[id]) linked++;
      else missing.push(id + ' «' + CFG[id] + '»');
    });
    if (missing.length) {
      issues.push({ sev: 'خطأ', msg: file + ' (' + who + ') — دروسٌ بلا رابط شرح: ' + missing.join(' · ') });
    }

    /* ٤) نصّ بحثٍ مشترك بين درسين */
    const seen = {}, dup = [];
    Object.keys(CFG).forEach(id => {
      if (/^all/.test(id) || !yt[id]) return;
      const k = yt[id];
      if (seen[k]) dup.push(seen[k] + ' = ' + id); else seen[k] = id;
    });
    if (dup.length) {
      issues.push({ sev: 'تنبيه', msg: file + ' (' + who + ') — درسان يشتركان في نصّ البحث نفسه: ' + dup.join(' · ') });
    }

    /* معرّف فيديو بدل البحث */
    if (/youtube\.com\/(watch\?v=|embed\/)|youtu\.be\//.test(src)) {
      issues.push({ sev: 'تنبيه', msg: file + ' (' + who + ') — رابط فيديو مباشر: ينكسر صامتًا إذا حُذف الفيديو، والأسلم رابط بحث' });
    }
  });

  return { lessons, linked, issues };
};
