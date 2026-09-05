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
const audio   = require('./audio');
const think   = require('./think');
const kangaroo= require('./kangaroo');
const eduvid  = require('./eduvid');
const mic     = require('./mic');

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

  head('٣ · تغطية الصوت');
  const au = audio();
  au.issues.forEach(i => {
    console.log('  ' + (i.sev === 'خطأ' ? '❌' : '⚠️ ') + ' ' + i.msg);
    i.sev === 'خطأ' ? errors++ : warns++;
  });
  if (!au.issues.length) console.log('  ✅ لا ملاحظات');

  head('٤ · مولّدات تقوية التفكير');
  const th = think();
  console.log('مولّدات: ' + th.gens + ' · عيّنات: ' + th.samples);
  th.issues.forEach(i => {
    console.log('  ' + (i.sev === 'خطأ' ? '❌' : '⚠️ ') + ' ' + i.msg);
    i.sev === 'خطأ' ? errors++ : warns++;
  });
  if (!th.issues.length) console.log('  ✅ كل المولّدات سليمة');

  head('٥ · تنوّع أسئلة مهارات التفكير (كانجرو)');
  const kg = kangaroo();
  console.log('بنك المعرفة العامة: ' + kg.gkBank + ' سؤالًا · السعة — ' + kg.caps);
  kg.issues.forEach(i => {
    console.log('  ' + (i.sev === 'خطأ' ? '❌' : '⚠️ ') + ' ' + i.msg);
    i.sev === 'خطأ' ? errors++ : warns++;
  });
  if (!kg.issues.length) console.log('  ✅ لا ملاحظات');

  head('٦ · روابط شرح الدروس (رياضيات المدرسة)');
  const ev = eduvid();
  console.log('دروس: ' + ev.lessons + ' · فيها رابط شرح: ' + ev.linked);
  ev.issues.forEach(i => {
    console.log('  ' + (i.sev === 'خطأ' ? '❌' : '⚠️ ') + ' ' + i.msg);
    i.sev === 'خطأ' ? errors++ : warns++;
  });
  if (!ev.issues.length) console.log('  ✅ لا ملاحظات');

  head('٧ · مسار المايكروفون');
  const mc = mic();
  console.log('صفحات النطق: ' + mc.pages);
  mc.issues.forEach(i => {
    console.log('  ' + (i.sev === 'خطأ' ? '❌' : '⚠️ ') + ' ' + i.msg);
    i.sev === 'خطأ' ? errors++ : warns++;
  });
  if (!mc.issues.length) console.log('  ✅ لا ملاحظات');

  head('٨ · طبقة البيانات');
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
