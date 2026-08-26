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
const KIDS = ['سعود','أسامة','رفيف','حسن'];
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

  /* ٣) أدواتٌ مهجورة */
  const last = {}, now = Date.now();
  rows.forEach(r => {
    const t = (r.meta && r.meta.test) || null;
    if (!t) return;
    if (!last[t] || r.created_at > last[t]) last[t] = r.created_at;
  });
  Object.entries(last).forEach(([t, d]) => {
    const days = Math.floor((now - Date.parse(d)) / 86400000);
    if (days >= STALE_DAYS)
      issues.push({ sev:'تنبيه', msg:'«' + t + '» لم يفتحه أحدٌ منذ ' + days + ' يومًا' });
  });

  /* ٤) جلساتٌ مبتورة حقًّا.
     ننتبه: صفوف kind="activity" ليست اختبارات بل أحداثُ فتحِ درس،
     وصفوفُ «اختبر نفسك» بالصيغة الأقدم تحمل per/paper بلا meta.test.
     فالمبتور ما خلا من ذلك كلّه. */
  const stub = rows.filter(r => {
    const m = r.meta || {};
    if (m.kind === 'activity') return false;
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
    return m.kind !== 'activity' && !scorable(m);
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
