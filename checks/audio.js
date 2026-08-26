/* ============================================================
   تغطية الصوت في الإملاء والاستماع.

   لماذا هذا الفحص موجود:
   بلاغ الأب (أغسطس ٢٠٢٦): «تقرير رفيف من زمان ما تحدّث وهي تحلّ هذي».
   وتبيّن أنّ الأنشطة الصوتية وحدها هي الواقفة عند الأربعة جميعًا،
   وأنّ نسبة استعمالها تتبع نسبة تغطيتها بالصوت المسجَّل تبعًا تامًّا:

       سعود  ١٠٪ إنجليزي · ٣٥٪ عربي  →  ١٢ جلسة إملاء
       أسامة  ٠٪ إنجليزي · ١٥٪ عربي  →   ٩ جلسات
       رفيف   ٠٪ · ٠٪                →   ٢ جلسة
       حسن    ٠٪ · ٠٪                →   ٣ جلسات

   السبب: بنك الإملاء للكبار <b>جُمل</b> لا كلمات، والمانيفست معجمُ كلماتٍ
   مفردة للصغار. فحين يضغط الكبير «استمع» لا يجد تسجيلًا، فيعتمد الأمر
   كلّه على Azure عبر الشبكة — وإن تعثّر Azure فالبديل نطقُ المتصفّح،
   وهو على آيفون رديءٌ للعربية المشكولة وصامتٌ أحيانًا. فيسمع الطفل
   لا شيء، ويترك النشاط، ولا تُحفظ جلسة — فيبدو للأب أنّ التقرير واقف.

   فالتغطية الصفرية ليست نقصَ كمالٍ بل نقطةُ عطبٍ واحدة بلا احتياط.
   ============================================================ */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');

const NAMES = { saud:'سعود (رابع)', osama:'أسامة (خامس)', rafeef:'رفيف (ثاني م)', hasan:'حسن (ثالث م)' };
const MIN_COVER = 40;        /* تحت هذا يُعدّ النشاط بلا احتياطٍ محلّيّ */

function run(){
  const issues = [];
  const manPath = path.join(ROOT, 'audio', 'manifest.json');
  if (!fs.existsSync(manPath))
    return { issues:[{ sev:'خطأ', msg:'audio/manifest.json غير موجود — لا صوت مسجّل أصلًا' }], rows:[] };

  const man = JSON.parse(fs.readFileSync(manPath, 'utf8'));

  /* الملفّ المذكور في المانيفست موجودٌ فعلًا على القرص؟ */
  let missing = 0, total = 0;
  for (const lang of Object.keys(man)){
    for (const w of Object.keys(man[lang])){
      total++;
      if (!fs.existsSync(path.join(ROOT, 'audio', man[lang][w]))) missing++;
    }
  }
  if (missing)
    issues.push({ sev:'خطأ', msg:missing + ' من ' + total + ' ملفّ صوتٍ مذكورٍ في المانيفست مفقودٌ على القرص' });

  /* مقاطعُ ثبت أنّ الآلة تنطقها خطأً — يكتبها tools/verify-audio.js
     بردّ كلّ مقطعٍ إلى محرّك التعرّف ومقارنة ما سُمع بما كُتب.
     تبقى مذكورةً هنا حتى تُستبدل بصوت الأب، فلا تُنسى بمرور الوقت. */
  const susPath = path.join(ROOT, 'audio', 'suspect.json');
  if (fs.existsSync(susPath)){
    const sus = JSON.parse(fs.readFileSync(susPath, 'utf8'));
    for (const lang of ['ar','en']){
      (sus[lang] || []).forEach(s => issues.push({ sev:'تنبيه',
        msg:'نطقٌ مشبوه · ' + lang + ' · ' + s.id + ' — مكتوب «' + s.text +
            '» ويُسمع «' + s.heard + '» — مرشَّحٌ لصوت الأب' }));
    }
  }

  /* تغطية بنوك الإملاء */
  const ctx = { window:{} }; ctx.globalThis = ctx; vm.createContext(ctx);
  for (const f of ['reading-bank.js','reading-bank2.js']){
    const p = path.join(ROOT, f);
    if (fs.existsSync(p)) { try { vm.runInContext(fs.readFileSync(p,'utf8'), ctx); } catch(e){} }
  }

  const agg = {};
  for (const bank of Object.keys(ctx.window)){
    const B = ctx.window[bank];
    if (!B || typeof B !== 'object') continue;
    for (const kid of Object.keys(B)){
      if (!NAMES[kid]) continue;
      for (const lang of Object.keys(B[kid] || {})){
        const d = (B[kid][lang] || {}).dictation;
        if (!Array.isArray(d)) continue;
        const k = kid + '|' + lang;
        agg[k] = agg[k] || { n:0, cov:0, sent:0 };
        const pool = man[lang] || {};
        d.forEach(w => {
          agg[k].n++;
          if (pool[w]) agg[k].cov++;
          if (/\s/.test(String(w).trim())) agg[k].sent++;
        });
      }
    }
  }

  const rows = Object.entries(agg).map(([k, v]) => {
    const [kid, lang] = k.split('|');
    return { kid, lang, n:v.n, cov:v.cov, sent:v.sent, pct: Math.round(100 * v.cov / v.n) };
  }).sort((a, b) => a.pct - b.pct);

  rows.forEach(r => {
    if (r.pct < MIN_COVER)
      issues.push({ sev: r.pct === 0 ? 'خطأ' : 'تنبيه',
        msg: NAMES[r.kid] + ' · ' + r.lang + ' — تغطية الصوت المسجّل ' + r.pct + '% (' +
             r.cov + ' من ' + r.n + (r.sent ? '، منها ' + r.sent + ' جُملة' : '') +
             ') — لا احتياط إن تعثّر Azure' });
  });

  return { issues, rows };
}

module.exports = run;
if (require.main === module){
  const r = run();
  console.log('  الابن            اللغة   بنود  جُمل  تغطية');
  console.log('  ' + '─'.repeat(48));
  r.rows.forEach(x => console.log('  ' + NAMES[x.kid].padEnd(16) + x.lang.padEnd(7) +
    String(x.n).padStart(4) + String(x.sent).padStart(6) + '   ' +
    (x.pct >= MIN_COVER ? '✅' : x.pct ? '⚠️ ' : '❌') + ' ' + String(x.pct).padStart(3) + '%'));
  console.log('');
  r.issues.forEach(i => console.log('  ' + (i.sev === 'خطأ' ? '❌' : '⚠️ ') + ' ' + i.msg));
  if (!r.issues.length) console.log('  ✅ لا ملاحظات');
}
