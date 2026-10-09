/* يولّد ملفاتِ PDF لكلماتِ الكتابِ وجملِه ومعانيها بالعربي.
 *
 * طلبُ الأب (٩ أكتوبر ٢٠٢٦): «ملف PDF للكلمات والجمل ومعناها: ملف لكلّ
 * وحدة، وملف شامل للفصل».
 *
 * ولِمَ مولَّدٌ لا مكتوبٌ بيد: الكلماتُ والجملُ في book-en*.js، فلو نُسخت
 * إلى ملفٍّ آخرَ لتخالَفا أوّلَ تعديل — فيحفظ الطفلُ من الورقةِ ما ليس في
 * الصفحة. فالملفّاتُ تُولَّد من مصدرٍ واحد، ويُعاد تشغيلُه بعد كلِّ تغيير.
 *
 * والرسمُ بمتصفّحِ Chromium نفسِه (page.pdf) لا بمكتبةِ PDF: العربيّةُ
 * تحتاج تشكيلًا ووصلًا للحروفِ واتّجاهًا من اليمين، والمتصفّحُ يُحسنها
 * كلَّها — وقد قيست الصورةُ قبل الاعتماد.
 *
 * التشغيل:
 *   NODE_PATH=/opt/node22/lib/node_modules node tools/gen-book-pdf.js
 *   ويُعاد كلّما تغيّر book-en4.js أو book-en9.js.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..');
const OUTDIR = path.join(ROOT, 'pdf');

/* الكتبُ المولَّدُ منها. والوسمُ هو بادئةُ اسمِ الملفّ — لاتينيّةٌ عمدًا:
   الرابطُ في الصفحةِ يحملها، والاسمُ العربيُّ في الرابطِ يحتاج ترميزًا
   يختلف بين المتصفّحات. والعنوانُ داخلَ الملفِّ عربيٌّ كما ينبغي. */
const BOOKS = [
  { file:'book-en4.js', global:'BOOK_EN4', tag:'en4', kid:'سعود',
    grade:'الصف الرابع الابتدائي', term:'الفصل الدراسي الأول — الوحدات 1–4' },
  { file:'book-en9.js', global:'BOOK_EN9', tag:'en9', kid:'حسن',
    grade:'الصف الثالث المتوسط · SuperGoal 3', term:'الفصل الدراسي الأول — الوحدات 1–6' }
];

function esc(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function isSentence(e){ return /[.?!]$/.test(e) && String(e).trim().split(/\s+/).length >= 3; }
function isRule(a){ return /^قاعدة/.test(a); }

const CSS = `
  @page { size: A4; margin: 14mm 12mm 16mm; }
  *{ box-sizing:border-box }
  body{ font-family:"FreeSerif","DejaVu Sans",sans-serif; color:#14202b; margin:0; line-height:1.75 }
  .cover{ text-align:center; padding:6mm 0 4mm; border-bottom:2.5px solid #0d9488; margin-bottom:6mm }
  .cover h1{ margin:0 0 2mm; font-size:21pt; color:#115e59 }
  .cover .sub{ font-size:11pt; color:#5b6b78 }
  h2{ font-size:14pt; color:#115e59; border-right:4px solid #0d9488; padding-right:7px;
      margin:7mm 0 3mm; page-break-after:avoid }
  h3{ font-size:11.5pt; color:#0d9488; margin:5mm 0 2mm; page-break-after:avoid }
  table{ width:100%; border-collapse:collapse; margin-bottom:3mm; page-break-inside:auto }
  tr{ page-break-inside:avoid }
  td{ border:1px solid #e4e9ee; padding:2.4mm 3mm; font-size:10.5pt; vertical-align:top }
  td.en{ direction:ltr; text-align:left; width:42%; font-family:"DejaVu Sans",sans-serif }
  td.ar{ width:58% }
  tr:nth-child(even) td{ background:#f6f7fb }
  .rule td{ background:#eefcf9; color:#115e59 }
  .sent td.en{ width:52% }
  .unit{ page-break-before:always }
  /* الغلافُ عنصرُ div أيضًا، فـ.unit:first-of-type لا يطابق أوّلَ وحدةٍ
     — فتُدفَع إلى صفحةٍ ثانيةٍ ويخرج الملفُّ وأوّلُ صفحاتِه فارغةٌ إلّا
     من العنوان. والمحدِّدُ الصحيحُ هو ما يلي الغلافَ مباشرةً. */
  .cover + .unit{ page-break-before:auto }
  .foot{ margin-top:6mm; padding-top:2mm; border-top:1px solid #e4e9ee;
         color:#5b6b78; font-size:9pt; text-align:center }
`;

/* قسمٌ واحد: الكلماتُ في جدول، والجملُ في جدولٍ أوسعَ للإنجليزيّ */
function sectionHtml(sec){
  const rules = sec.items.filter(it => isRule(it[1]));
  const words = sec.items.filter(it => !isRule(it[1]) && !isSentence(it[0]));
  const sents = sec.items.filter(it => !isRule(it[1]) && isSentence(it[0]));
  let h = '<h3>' + esc(sec.t) + '</h3>';
  const rows = list => '<table>' + list.map(it =>
      '<tr' + (isRule(it[1]) ? ' class="rule"' : '') + '><td class="en">' + esc(it[0]) +
      '</td><td class="ar">' + esc(it[1]) + '</td></tr>').join('') + '</table>';
  if (words.length) h += rows(words);
  if (sents.length) h += '<table class="sent">' + sents.map(it =>
      '<tr><td class="en">' + esc(it[0]) + '</td><td class="ar">' + esc(it[1]) + '</td></tr>').join('') + '</table>';
  if (rules.length) h += rows(rules);
  return h;
}
function unitHtml(unit){
  return '<div class="unit"><h2>' + esc(unit.title) + ' — ' + esc(unit.ar) + '</h2>' +
         unit.sections.map(sectionHtml).join('') + '</div>';
}
function page(title, sub, body){
  return '<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">' +
    '<title>' + esc(title) + '</title><style>' + CSS + '</style></head><body>' +
    '<div class="cover"><h1>' + esc(title) + '</h1><div class="sub">' + esc(sub) + '</div></div>' +
    body + '<div class="foot">مولَّد من مادّة الموقع — أعِد توليدَه بعد أيّ تعديل: tools/gen-book-pdf.js</div>' +
    '</body></html>';
}

(async () => {
  if (!fs.existsSync(OUTDIR)) fs.mkdirSync(OUTDIR, { recursive: true });
  /* ═══ بصمةُ المصدر تُحفظ مع المولَّد ═══════════════════════════════
     الورقةُ تُطبَع مرّةً وتبقى في يدِ الطفلِ أسابيع، والملفُّ يُعدَّل بعدها
     فتتخالف الورقةُ والشاشةُ ولا شيء يُنبّه. فنحفظ بصمةَ كلِّ كتابٍ ساعةَ
     التوليد، ويقارنها حارسُ checks/pages.js ببصمةِ الملفِّ الحاليّ. */
  const manifest = { generated: new Date().toISOString(), books: {} };
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const ctx = await browser.newContext();
  const pg = await ctx.newPage();
  let made = 0;

  for (const B of BOOKS){
    const src = path.join(ROOT, B.file);
    if (!fs.existsSync(src)){ console.log('⚠️  ' + B.file + ' غير موجود — تُخطّى'); continue; }
    const raw = fs.readFileSync(src, 'utf8');
    const sandbox = { window: {} };
    require('vm').createContext(sandbox);
    require('vm').runInContext(raw, sandbox);
    const book = sandbox.window[B.global];
    if (!book){ console.log('⚠️  ' + B.global + ' غير معرَّف في ' + B.file); continue; }

    const ids = Object.keys(book);
    let words = 0, sents = 0;
    for (const id of ids){
      const u = book[id];
      u.sections.forEach(s => s.items.forEach(it => {
        if (isRule(it[1])) return;
        if (isSentence(it[0])) sents++; else words++;
      }));
      const out = path.join(OUTDIR, B.tag + '-' + id + '.pdf');
      await pg.setContent(page(u.title + ' — ' + u.ar,
        B.kid + ' · ' + B.grade, unitHtml(u)), { waitUntil: 'load' });
      await pg.pdf({ path: out, format: 'A4', printBackground: true });
      made++;
    }
    const all = path.join(OUTDIR, B.tag + '-term1.pdf');
    await pg.setContent(page('كلمات الكتاب وجمله ومعانيها',
      B.kid + ' · ' + B.grade + ' · ' + B.term,
      ids.map(id => unitHtml(book[id])).join('')), { waitUntil: 'load' });
    await pg.pdf({ path: all, format: 'A4', printBackground: true });
    made++;
    manifest.books[B.tag] = {
      source: B.file,
      hash: crypto.createHash('sha256').update(raw).digest('hex').slice(0, 16),
      files: ids.map(id => B.tag + '-' + id + '.pdf').concat([B.tag + '-term1.pdf'])
    };
    console.log('✅ ' + B.kid + ' — ' + ids.length + ' وحدة + ملفٌّ شامل · ' +
                words + ' كلمة و' + sents + ' جملة');
  }
  await browser.close();
  fs.writeFileSync(path.join(OUTDIR, 'manifest.json'), JSON.stringify(manifest, null, 1) + '\n');
  console.log('المولَّد: ' + made + ' ملفًّا في pdf/ ومعها manifest.json');
})();
