/* يُولّد خريطة «اسم المولّد ← وصفه العربيّ» داخل math9.html.
 *
 * لماذا مولّدٌ لا كتابةً باليد: المولّدات إحدى وثلاثون ومئة، وفوق كلّ
 * واحدٍ منها تعليقٌ يصف سؤاله ويذكر صفحته من الكتاب — كُتبت يوم بُني
 * الدرس. فنسخُها يدويًّا يعني أن تتغيّر دالّةٌ ويبقى وصفُها القديم،
 * وأن يُضاف مولّدٌ فلا يُعطى وصفًا أصلًا. فالوصف يُقرأ من مصدره.
 *
 * التشغيل:  node tools/gen-skill-labels.js
 * ويُعاد تشغيله كلّما أُضيف مولّدٌ أو غُيّر تعليقُه.
 */
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'math9.html');
const BEG = '/* ⟨⟨ خريطة الوصف — مولّدة بـ tools/gen-skill-labels.js، لا تُحرّر يدويًّا ⟩⟩ */';
const END = '/* ⟨⟨ نهاية الخريطة ⟩⟩ */';

/* مولّداتٌ بلا تعليقٍ فوقها — تُوصف هنا حتى يُكتب لها تعليقٌ في مكانها */
const MANUAL = {
  gIndepDep:        '٢-١: المتغيّر المستقلّ والتابع',
  gDiscreteCont:    '٢-٢: دالّة متّصلة أم منفصلة',
  gZeroContext:     '٢-٢: صفر الدالّة في موقفٍ حياتيّ',
  gRateOfChange:    '٢-٥: معدّل التغيّر من جدول',
  g32Predict:       '٣-٢: التنبّؤ من معادلة الميل والمقطع',
  g32WriteFromWords:'٣-٢: كتابة المعادلة من جملةٍ كلاميّة',
  g41WordAtMost:    '٤-١: متباينة «على الأكثر»',
  g42WordAtLeast:   '٤-٢: متباينة «على الأقلّ»',
  g43WordMulti:     '٤-٣: متباينة متعدّدة الخطوات (ميزانيّة)',
  g44WordAnd:       '٤-٤: متباينة مركّبة — مدًى',
  g45WordTolerance: '٤-٥: تفاوتٌ مسموح بالقيمة المطلقة',
  g51WriteSystem:   '٥-١: كتابة نظام معادلتين من مسألة',
  g52WordSub:       '٥-٢: أسعارٌ وكمّيات — بالتعويض',
  g53WordElim:      '٥-٣: مجموعٌ وفرق — بالحذف جمعًا أو طرحًا',
  g54WordMul:       '٥-٤: سرعةٌ وريح — بالحذف بالضرب',
  g55ApplyWord:     '٥-٥: تطبيقٌ على أنظمة المعادلات'
};

const src = fs.readFileSync(FILE, 'utf8');
const lines = src.split('\n');

/* المولّدات المستعملة فعلًا في مصفوفات الدروس */
const used = new Set();
lines.forEach(l => {
  const m = /^var ([A-Z]+\d*) = \[(.+)\];/.exec(l);
  if (m) m[2].split(',').forEach(x => { x = x.trim(); if (/^g[A-Za-z0-9_]+$/.test(x)) used.add(x); });
});

/* التعليق المباشر فوق الدالّة وحده — لا تعليقٌ يفصله سطرُ كودٍ آخر */
const map = {}, missing = [];
for (let i = 0; i < lines.length; i++) {
  const m = /^function (g[A-Za-z0-9_]+)\s*\(/.exec(lines[i]);
  if (!m || !used.has(m[1])) continue;
  let c = '';
  for (let j = i - 1; j >= Math.max(0, i - 3); j--) {
    const t = lines[j].trim();
    if (/^\/\*.*\*\/$/.test(t)) { c = t.replace(/^\/\*|\*\/$/g, '').trim(); break; }
    if (t) break;
  }
  if (c) map[m[1]] = c;
  else if (MANUAL[m[1]]) map[m[1]] = MANUAL[m[1]];
  else missing.push(m[1]);
}

const keys = Object.keys(map).sort();
const body = keys.map(k => '  ' + k + ': ' + JSON.stringify(map[k]) + ',').join('\n').replace(/,$/, '');
const block = BEG + '\nvar GEN_AR = {\n' + body + '\n};\n' + END;

const re = new RegExp(BEG.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s\\S]*?' +
                      END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
let out;
if (re.test(src)) {
  out = src.replace(re, block);
} else {
  /* أوّل مرّة: نضعها قبل genN مباشرةً، فهي أوّل من يستعملها */
  const anchor = '/* نَسِم كلّ سؤالٍ باسم مولّده';
  const at = src.indexOf(anchor);
  if (at < 0) { console.error('❌ لم أجد موضع الإدراج'); process.exit(1); }
  out = src.slice(0, at) + block + '\n' + src.slice(at);
}
fs.writeFileSync(FILE, out, 'utf8');

console.log('✅ ' + keys.length + ' وصفًا من أصل ' + used.size + ' مولّدًا مستعملًا');
if (missing.length) {
  console.log('⚠️  بلا وصف (' + missing.length + '): ' + missing.join(' '));
  console.log('   أضِف تعليقًا فوق الدالّة، أو سطرًا في MANUAL هنا.');
}
