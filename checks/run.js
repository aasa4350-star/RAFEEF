#!/usr/bin/env node
/* ============================================================
   الفحص الدوريّ — مُشغّلٌ واحد يجمع المدقّقات كلّها.

        node checks/run.js

   يخرج بحالة ١ إن وُجد خطأ، و٠ إن لم يوجد إلّا التنبيهات.

   لماذا هذا الملفّ موجود: قبله كانت المدقّقات تُكتب في مجلّدٍ مؤقّت
   يُمسح مع نهاية كلّ جلسة، فتُعاد كتابتها من الصفر ويُنسى ما فُحص.
   الآن هي في المستودع، تُشغَّل بأمرٍ واحد وتُراجَع في كلّ تعديل.
   ============================================================ */
const pages   = require('./pages');
const answers = require('./answers-en9');
const data    = require('./data');

const BAR = '─'.repeat(56);
function head(t){ console.log('\n' + BAR + '\n  ' + t + '\n' + BAR); }

(async () => {
  let errors = 0, warns = 0;

  head('١ · بنية الصفحات والمولّدات');
  const p = pages();
  console.log('صفحات: ' + p.fileCount + ' · مولّدات: ' + p.genCount);
  p.issues.forEach(i => {
    console.log('  ' + (i.sev === 'خطأ' ? '❌' : '⚠️ ') + ' ' + i.file + ' — ' + i.msg);
    i.sev === 'خطأ' ? errors++ : warns++;
  });
  if (!p.issues.length) console.log('  ✅ لا ملاحظات');

  head('٢ · صحّة إجابات الإنجليزي (مطابقةً للكتاب)');
  const a = answers();
  /* عند وجود خطأ نُظهر تفاصيل المدقّق كاملةً، وإلّا اكتفينا بالخلاصة */
  if (a.bad) a.lines.filter(l => l.includes('❌') || l.includes('⚠️')).forEach(l => console.log(l));
  console.log('  ' + (a.bad ? '❌ أخطاء: ' + a.bad : '✅ ' + a.ok + ' مولّدًا سليمًا'));
  errors += a.bad;

  head('٣ · طبقة البيانات');
  const d = await data();
  console.log('صفوف: ' + d.rows + ' · اختبارات مختلفة: ' + (d.tests || 0));
  d.issues.forEach(i => {
    console.log('  ' + (i.sev === 'خطأ' ? '❌' : i.sev === 'تنبيه' ? '⚠️ ' : 'ℹ️ ') + ' ' + i.msg);
    if (i.sev === 'خطأ') errors++; else if (i.sev === 'تنبيه') warns++;
  });
  if (!d.issues.length) console.log('  ✅ لا ملاحظات');

  head('الخلاصة');
  console.log('  أخطاء: ' + errors + '  ·  تنبيهات: ' + warns);
  console.log(errors ? '  ⛔ يلزم إصلاح.' : '  ✅ الموقع سليم.');
  process.exit(errors ? 1 : 0);
})().catch(e => { console.error('تعذّر الفحص: ' + e.stack); process.exit(2); });
