/* ============================================================
   فحص طبقة البيانات — ما لا تكشفه قراءةُ الكود وحدها.

   ما يمسكه:
     ١. سقف Supabase: الواجهة ترجع ١٠٠٠ صفّ كحدٍّ أقصى لكلّ طلبٍ مهما كان
        limit، بلا خطأٍ ولا تحذير. أيّ صفحةٍ تطلب صفًّا واحدًا بـ limit أكبر
        من السقف تفقد أقدم البيانات بصمت — وهذا ما وقع فعلًا في report.html
        في أغسطس ٢٠٢٦ (١١٤٦ صفًّا، ظهر منها ١٠٠٠).
     ٢. صفوفٌ يتيمة: اسم طالبٍ لا يطابق أحد الأربعة (يقع حين تُفتح الصفحة
        بلا ?who=، فتُحفظ النتيجة ولا تظهر لأحد).
     ٣. اختبارٌ هجره الجميع: أداةٌ في الموقع لم يفتحها أحدٌ منذ مدّة.
     ٤. جلساتٌ مبتورة: لا اسم اختبار ولا نتيجة.
   ============================================================ */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');

const URL_ = 'https://kmopkxlhisrwxllagjbu.supabase.co';
const KEY  = 'sb_publishable_fVHi2d2S5yNdve8ErqDvVw_RvphbHH_';
const PAGE = 1000;                 /* سقف Supabase الثابت */
/* ═══ قائمةُ الطلبة تُقرأ من الموقع لا تُكتب هنا ═══════════════════
   كانت مكتوبةً أربعةَ أسماء، فلمّا أُضيف فهدٌ والتربيةُ الخاصّة صار
   الفحصُ يقول «صفوفٌ باسمٍ مجهول × ١٣٣» عن طالبَين معروفَين — خطأٌ
   كاذبٌ يُعمي عن خطأٍ صادق. والمصدرُ الأوثق لوحةُ الأب نفسُها
   (index.html · SLUG): من كان فيها فله مكانٌ يُعرض فيه.
   وإن تعذّرت القراءة رجعنا إلى الأسماء المعروفة حتى لا يسقط الفحص. */
const FALLBACK_KIDS = ['سعود','أسامة','رفيف','حسن','فهد','التربية الخاصة'];
function rosterFromSite(){
  try{
    const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
    const m = /const SLUG\s*=\s*\{([^}]*)\}/.exec(html);
    if(!m) return FALLBACK_KIDS;
    const names = [...m[1].matchAll(/"([^"]+)"\s*:/g)].map(x => x[1]);
    return names.length ? names : FALLBACK_KIDS;
  }catch(e){ return FALLBACK_KIDS; }
}
const KIDS = rosterFromSite();
const STALE_DAYS = 21;             /* بعدها نعدّ الأداة مهجورة */

async function fetchAll(){
  let all = [], off = 0;
  for (let i = 0; i < 20; i++){
    const r = await fetch(URL_ + '/rest/v1/attempts?select=student,created_at,meta' +
                          '&order=created_at.desc&limit=' + PAGE + '&offset=' + off,
                          { headers:{ apikey: KEY } });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const j = await r.json();
    all = all.concat(j);
    if (j.length < PAGE) break;
    off += PAGE;
  }
  return all;
}

/* أيّ صفحةٍ تطلب attempts بـ limit أكبر من السقف في طلبٍ واحد؟ */
function ceilingRisk(){
  const out = [];
  for (const f of fs.readdirSync(ROOT).filter(x => x.endsWith('.html'))){
    const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
    if (!/rest\/v1\/attempts/.test(src)) continue;
    const paginates = /offset=/.test(src);
    for (const m of src.matchAll(/attempts\?[^"'`\s]*limit=(\d+)/g)){
      const lim = Number(m[1]);
      if (lim > PAGE && !paginates)
        out.push(f + ' — يطلب limit=' + lim + ' في طلبٍ واحد والسقف ' + PAGE +
                 ' ، فيفقد ما زاد بصمت');
    }

    /* ═══ ولا طلبَ قراءةٍ بلا سقفٍ ولا ترقيم ═══════════════════════
       عضّنا هذا مرّتين في يومٍ واحد (٢٥–٢٦ سبتمبر ٢٠٢٦): بطاقةُ
       «قراءة إنجليزي» عرضت ١٧ محاولةً وهي ٢٦، و«محاولاتي» فقدت أقدم
       أوراق سعود — كلاهما طلبٌ واحدٌ بلا limit ولا offset، والخادمُ
       يقطع عند ألف بلا أن يقول. وهو عيبٌ صامتٌ لا يظهر إلّا حين يكبر
       سجلُّ الابن، فيُصدَّق الرقمُ الناقصُ سنةً كاملة.
       فالقاعدة: كلُّ قراءةٍ من attempts إمّا مرقَّمةٌ (RR.fetchAll أو
       offset) وإمّا محدودةٌ بـlimit مقصود. */
    /* الرابطُ يُبنى بالتوصيل («…&student=eq."+name+"…&limit=40»)، فلا يكفي
       أن نقرأ المقطعَ النصّيَّ الأوّل: نفحص ما بعد موضع الطلب من المصدر
       نفسه (نافذةٌ تكفي لسطر الطلب) بحثًا عن limit. */
    /* الحكمُ على كلّ طلبٍ وحدَه لا على الملفّ كلِّه: ذكرُ RR.fetchAll في
       تعليقٍ في أعلى الصفحة كان يُعفي طلبًا في أسفلها لا ترقيمَ فيه —
       وهو بابٌ يُبطل الفحص من حيث لا نشعر. فننظر قبل الطلب بقليلٍ:
       أهو مُمرَّرٌ إلى RR.fetchAll فعلًا؟ */
    const unbounded = [...src.matchAll(/attempts\?select=/g)].filter(m => {
      const after = src.slice(m.index, m.index + 400);
      const before = src.slice(Math.max(0, m.index - 200), m.index);
      return !/limit=/.test(after) && !/RR\.fetchAll\s*\(\s*$|RR\.fetchAll\s*\([^;]*$/.test(before);
    });
    if (unbounded.length && !paginates)
      out.push(f + ' — يقرأ attempts بطلبٍ واحدٍ بلا limit ولا ترقيم: الخادمُ يقطع عند ' +
               PAGE + ' صفًّا فتسقط الأقدم بصمت (استعمل RR.fetchAll)');
  }
  return out;
}

async function run(){
  const issues = [];
  issues.push(...ceilingRisk().map(m => ({ sev:'خطأ', msg:m })));

  let rows;
  try { rows = await fetchAll(); }
  catch(e){ return { issues: issues.concat([{ sev:'تنبيه', msg:'تعذّر الوصول إلى القاعدة: ' + e.message }]), rows:0 }; }

  /* ١) هل بلغنا السقف؟ */
  if (rows.length >= PAGE)
    issues.push({ sev:'معلومة', msg:'الجدول تجاوز ' + PAGE + ' صفًّا (' + rows.length +
      ') — أيّ صفحةٍ لا تُرقّم الطلبات تفقد الأقدم' });

  /* ٢) صفوفٌ يتيمة */
  const orphan = {};
  rows.forEach(r => { if (!KIDS.includes(r.student)) orphan[r.student || '(فارغ)'] = (orphan[r.student || '(فارغ)'] || 0) + 1; });
  Object.entries(orphan).forEach(([k, n]) =>
    issues.push({ sev:'خطأ', msg:'صفوفٌ باسمٍ مجهول «' + k + '» × ' + n + ' — لن تظهر لأيّ ابن' }));

  /* ٣) أدواتٌ مهجورة — مع تمييز الاسم المتقاعد عن الأداة المهجورة.

     بلاغ الأب (٢ سبتمبر ٢٠٢٦: «كل شي عندك خلل»): كان الفحص يحذّر منذ
     أسابيع أنّ «استماع إنجليزي 🎧» و«استماع عربي 🎧» مهجوران، وهما في
     الحقيقة الاسمان القديمان لقسم الإملاء قبل أن يُسمّى «إملاء … ✍️»
     في reading.html. فلا أحد يستطيع «فتحهما» أبدًا، والعدد يكبر كل يوم:
     تحذيرٌ أبديّ لا يُسكته إصلاح، ويعوّد القارئ على تجاهل التحذيرات
     فيطمر التحذير الحقيقيّ حين يأتي.

     التمييز: اسمٌ لا يزال حيًّا يرد نصًّا في مصدر الموقع (اسم الاختبار
     يُكتب حرفيًّا في الصفحة أو في label الدرس). جرّبناه على أسماء
     القاعدة كلّها: ٣٤ اسمًا حيًّا وُجدت كلّها في المصدر، والمتقاعدان
     وحدهما لم يوجدا. */
  const srcAll = fs.readdirSync(ROOT)
    .filter(x => x.endsWith('.html') || x.endsWith('.js'))
    .map(x => { try { return fs.readFileSync(path.join(ROOT, x), 'utf8'); } catch(e){ return ''; } })
    .join('\n');

  const last = {}, now = Date.now();
  rows.forEach(r => {
    const t = (r.meta && r.meta.test) || null;
    if (!t) return;
    if (!last[t] || r.created_at > last[t]) last[t] = r.created_at;
  });
  const retired = [];
  Object.entries(last).forEach(([t, d]) => {
    const days = Math.floor((now - Date.parse(d)) / 86400000);
    if (days < STALE_DAYS) return;
    if (srcAll.includes(t))
      issues.push({ sev:'تنبيه', msg:'«' + t + '» لم يفتحه أحدٌ منذ ' + days + ' يومًا' });
    else
      retired.push(t);                 /* اسمٌ لم يعد في الموقع — صفوفٌ تاريخية */
  });
  if (retired.length)
    issues.push({ sev:'معلومة', msg:'أسماءٌ متقاعدة (لم تعد في الموقع، صفوفها تاريخية فقط): ' +
      retired.join('، ') });

  /* ٤) جلساتٌ مبتورة حقًّا.
     ننتبه: صفوف kind="activity" ليست اختبارات بل أحداثُ فتحِ درس،
     وصفوف kind="talk" ملخّص جلسة محادثة (موضوع/عدد جمل/متوسط نطق)
     لا اختبار له اسمٌ أو درجة بصيغة {total,correct}، وصفوفُ «اختبر
     نفسك» بالصيغة الأقدم تحمل per/paper بلا meta.test، وصفوف
     kind="micfail" تشخيصُ إخفاق تسجيلٍ لا جلسةَ اختبار — تُحفظ ليُعرف
     سببُ تعطّل المايك بدل تخمينه (انظر MIC.why في mic-help.js).
     فالمبتور ما خلا من ذلك كلّه. */
  const stub = rows.filter(r => {
    const m = r.meta || {};
    if (m.kind === 'activity' || m.kind === 'talk' || m.kind === 'micfail') return false;
    return !(m.test || m.paper || m.per || m.total);
  }).length;
  if (stub) issues.push({ sev:'خطأ', msg:stub + ' جلسة بلا اسم اختبارٍ ولا نتيجة ولا تفصيل' });

  /* ٥) جلساتٌ لا يستطيع التقرير عرض درجتها.
     بلاغ الأب (٢٦ أغسطس ٢٠٢٦): «حسن حلّ اختبر نفسك وما طلع في التقرير».
     وكانت جلساته محفوظةً فعلًا، ولكنّ التقرير كان يقرأ meta.skills وحده
     فسقطت ٦٧٠ جلسة من ١٢٠٦ بصمت. فأُصلح التقرير ليقرأ الصيغ الثلاث:
     {total,correct} أو skills أو per.

     وهذا الفحص يحرس ذلك: أيّ صفحةٍ تحفظ بصيغةٍ رابعة لن تُعرض درجتها،
     فالعطب نفسه يعود ولا يُرى. والصامت أخطر من الظاهر. */
  const scorable = m =>
    (typeof m.total === 'number' && m.total > 0) ||
    (m.skills && Object.values(m.skills).some(v => v && v.t > 0)) ||
    (Array.isArray(m.per) && m.per.length > 0);
  const mute = rows.filter(r => {
    const m = r.meta || {};
    return m.kind !== 'activity' && m.kind !== 'talk' && m.kind !== 'micfail' && !scorable(m);
  });
  if (mute.length){
    const by = {};
    mute.forEach(r => { const t = (r.meta||{}).test || '(بلا اسم)'; by[t] = (by[t]||0)+1; });
    issues.push({ sev:'خطأ', msg: mute.length + ' جلسة لا يعرف التقرير كيف يقرأ درجتها — ' +
      Object.entries(by).sort((a,b)=>b[1]-a[1]).slice(0,4)
        .map(([t,n]) => t + ' × ' + n).join('، ') });
  }

  return { issues, rows: rows.length, tests: Object.keys(last).length };
}

module.exports = run;
if (require.main === module){
  run().then(r => {
    console.log('صفوف: ' + r.rows + ' · اختبارات مختلفة: ' + (r.tests || 0));
    r.issues.forEach(i => console.log('  ' + (i.sev === 'خطأ' ? '❌' : i.sev === 'تنبيه' ? '⚠️ ' : 'ℹ️ ') + ' ' + i.msg));
    if (!r.issues.length) console.log('  ✅ لا ملاحظات');
  });
}
