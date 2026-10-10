/* يولّد ورقةَ «قاعدة كلّ درس» — ملفَّ PDF للطباعة.
 *
 * طلبُ الأب (١٠ أكتوبر ٢٠٢٦): «اكتب قاعدة كلّ درس في بي دي اف عشان
 * أطبعها».
 *
 * والمادّةُ موجودةٌ أصلًا: كلُّ صفحةِ منهجٍ فيها REMTOPICS — لكلّ درسٍ
 * اسمُه وقاعدتُه (tip)، وهي التي يعرضها القسمُ العلاجيُّ حين يضعف فيه.
 * فالورقةُ تجمعها كلَّها في مكانٍ واحدٍ تُقرأ قبل الحلّ لا بعد الخطأ.
 *
 * ولِمَ مولَّدٌ لا مكتوبٌ بيد: لو نُسخت القواعدُ إلى ملفٍّ آخرَ لتخالفت
 * الورقةُ والشاشةُ أوّلَ تعديل — والورقةُ تبقى في يدِ الطفلِ أسابيع،
 * فيحفظ منها ما لم يعد في الصفحة. فمصدرٌ واحدٌ، وبصمتُه تُحفظ في
 * pdf/manifest.json ويقارنها حارسُ checks/pages.js.
 *
 * والرسمُ بمتصفّحِ Chromium نفسِه (page.pdf) لا بمكتبةِ PDF: العربيّةُ
 * تحتاج وصلَ الحروفِ واتّجاهًا من اليمين، والمتصفّحُ يُحسنها كلَّها.
 *
 * التشغيل:
 *   NODE_PATH=/opt/node22/lib/node_modules node tools/gen-rules-pdf.js
 *   ويُعاد كلّما تغيّرت قاعدةُ درسٍ في أيّ صفحة.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { chromium } = require('playwright');
const EX = require('./lib-extract.js');
const RULES = require('./lib-rules.js');

const ROOT = path.join(__dirname, '..');
const OUTDIR = path.join(ROOT, 'pdf');

const CSS = `
  @page { size: A4; margin: 14mm 12mm 15mm; }
  *{ box-sizing:border-box }
  body{ font-family:"FreeSerif","DejaVu Sans",sans-serif; color:#14202b; margin:0; line-height:1.95 }
  .cover{ text-align:center; padding:5mm 0 4mm; border-bottom:2.5px solid #0d9488; margin-bottom:5mm }
  .cover h1{ margin:0 0 2mm; font-size:20pt; color:#115e59 }
  .cover .sub{ font-size:11pt; color:#5b6b78 }
  .subj{ page-break-before:always }
  .cover + .subj{ page-break-before:auto }
  .subj > h1{ font-size:16pt; color:#115e59; margin:0 0 4mm; padding-bottom:2mm;
              border-bottom:2px solid #0d9488 }
  h2{ font-size:12.5pt; color:#0d9488; margin:6mm 0 2.5mm; page-break-after:avoid }
  .les{ border:1px solid #e4e9ee; border-right:3.5px solid #0d9488; border-radius:3mm;
        padding:2.6mm 3.4mm; margin-bottom:2.6mm; page-break-inside:avoid }
  .les .nm{ font-weight:700; font-size:11pt; color:#115e59; margin-bottom:1mm }
  .les .tp{ font-size:10.5pt }
  .les .tp b{ color:#0f766e }
  /* اللاتينيُّ داخلَ فقرةٍ عربيّةٍ يُعزَل، وإلّا انقلب ترتيبُه */
  .en{ direction:ltr; unicode-bidi:isolate; font-family:"DejaVu Sans",sans-serif }
  /* لا يُدفَع التذييلُ وحدَه إلى صفحةٍ خالية */
  .foot{ margin-top:5mm; padding-top:2mm; border-top:1px solid #e4e9ee;
         color:#5b6b78; font-size:9pt; text-align:center; page-break-before:avoid }
`;

function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
/* القاعدةُ تحمل <b> و<span class="en"> من الصفحةِ نفسِها، فتُمرَّر كما هي
   ويُهرَّب ما سواها — فلا نطبع وسمًا نصًّا ولا نفتح بابًا لوسمٍ غريب. */
function tipHtml(t){
  return esc(t)
    .replace(/&lt;(\/?)b&gt;/g, '<$1b>')
    .replace(/&lt;span class="en"&gt;/g, '<span class="en">')
    .replace(/&lt;\/span&gt;/g, '</span>');
}

function subjHtml(p, heading){
  let h = '<div class="subj">' + (heading ? '<h1>' + esc(p.title) + '</h1>' : '');
  for (const sec of p.sections){
    if (sec.name) h += '<h2>' + esc(sec.name) + '</h2>';
    h += sec.items.map(t =>
      '<div class="les"><div class="nm">' + esc(t.name || t.id) + '</div>' +
      '<div class="tp">' + tipHtml(t.tip) + '</div></div>').join('');
  }
  return h + '</div>';
}
function doc(title, sub, body){
  return '<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">' +
    '<title>' + esc(title) + '</title><style>' + CSS + '</style></head><body>' +
    '<div class="cover"><h1>' + esc(title) + '</h1><div class="sub">' + esc(sub) + '</div></div>' +
    body + '<div class="foot">قواعد الدروس — مولَّدة من مادّة الموقع. ' +
    'أعِد توليدَها بعد أيّ تعديل: tools/gen-rules-pdf.js</div></body></html>';
}

/* المعدودُ في العربيّة: ثلاثةٌ إلى عشرةٍ جمعٌ، وما فوقها مفردٌ منصوب */
function lw(n){ return n + (n >= 3 && n <= 10 ? ' دروس' : ' درسًا'); }

(async () => {
  if (!fs.existsSync(OUTDIR)) fs.mkdirSync(OUTDIR, { recursive: true });

  const files = RULES.pagesWithRules(fs, path, ROOT);
  const pages = {}, skipped = [];
  for (const f of files){
    const p = RULES.readRules(fs.readFileSync(path.join(ROOT, f), 'utf8'), f);
    if (!p) continue;
    if (!p.count){ skipped.push(f + ' (لا قاعدةَ مكتوبةً لدروسِها)'); continue; }
    if (p.noTip.length)
      console.log('⚠️  ' + f + ' — دروسٌ بلا قاعدةٍ تسقط من الورقة: ' + p.noTip.join('، '));
    pages[f] = p;
  }

  /* ═══ لمن هذه الورقة ═══════════════════════════════════════════════
     تُقرأ خريطةُ home.html نفسُها لا تُكتب هنا: لو كُتبت مرّتين لتخالفتا
     حين يُنقَل درسٌ من ابنٍ إلى أخيه، فتُطبع ورقةٌ باسمِ من لا يدرسها. */
  const hsrc = fs.readFileSync(path.join(ROOT, 'home.html'), 'utf8');
  const SUBJECTS = EX.readObject(hsrc, 'SUBJECTS') || {};
  const NAMES = EX.readObject(hsrc, 'NAMES') || {};
  const GRADES = EX.readObject(hsrc, 'GRADES') || {};
  const ownerOf = {};
  for (const kid of Object.keys(SUBJECTS))
    for (const l of SUBJECTS[kid]){
      const f = String(l.href || '').split('?')[0];
      if (pages[f]) (ownerOf[f] = ownerOf[f] || []).push(kid);
    }

  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const ctx = await browser.newContext();
  const pg = await ctx.newPage();
  const manifest = { generated: new Date().toISOString(), pages: {}, kids: {} };
  let made = 0;

  /* ═══ اسمُ الملفِّ لا يُكتب مرّتين ═══════════════════════════════════
     khassa اسمُ صفحةٍ واسمُ ابنٍ معًا، فكان ملفُّ الابنِ يدهس ورقةَ
     المادّة بلا صوت: يُفتح rules-khassa.pdf فيخرج غيرُ ما عليه اسمُه.
     فصار اسمُ الجامعِ rules-all-<الابن>، والكتابةُ تمرّ من هنا فإن
     تكرّر اسمٌ وقف التوليدُ ولم يُسلَّم ملفٌّ مكذوب. */
  const written = {};
  async function emit(nm, html){
    if (written[nm]) throw new Error('اسمُ ملفٍّ مكرَّر: ' + nm + ' — الثاني يدهس الأوّل');
    written[nm] = 1;
    await pg.setContent(html, { waitUntil: 'load' });
    await pg.pdf({ path: path.join(OUTDIR, nm + '.pdf'), format: 'A4', printBackground: true });
    made++;
  }

  /* ورقةٌ لكلّ مادّة */
  for (const f of Object.keys(pages)){
    const p = pages[f], tag = f.replace(/\.html$/, ''), n = p.count;
    const kids = (ownerOf[f] || []).map(k => NAMES[k] || k);
    const sub = 'قاعدة كلّ درس · ' + lw(n) + (kids.length ? ' · ' + kids.join(' و') : '');
    await emit('rules-' + tag, doc(p.title, sub, subjHtml(p, false)));
    manifest.pages[tag] = {
      source: f, lessons: n, file: 'rules-' + tag + '.pdf', hash: p.digest
    };
    console.log('✅ ' + tag.padEnd(10) + ' ' + String(n).padStart(3) + ' درسًا' +
                (kids.length ? '  · ' + kids.join('، ') : '  · لا ابنَ يفتحها'));

    /* ═══ وورقةُ المقرَّرِ الفتريِّ وحدَه ═══════════════════════════════
       طلبُ الأب: «أبي قواعد الرياضيات دروس حسن اختبار الفتري فقط».
       فورقةُ المادّةِ خمسةٌ وعشرون درسًا والمقرَّرُ أحدَ عشرَ — فلا
       يذاكر ما لا يُسأل عنه. والقائمةُ من FATRI_IDS في الصفحةِ نفسِها. */
    const F = RULES.readFatri(fs.readFileSync(path.join(ROOT, f), 'utf8'), f);
    if (!F) continue;
    if (F.missing.length)
      console.log('⚠️  ' + tag + ' — دروسٌ في مقرَّرِ الفتريِّ بلا قاعدة: ' + F.missing.join('، '));
    const qw = F.questions + (F.questions >= 3 && F.questions <= 10 ? ' أسئلة' : ' سؤالًا');
    const fsub = (F.unit || ('المقرَّر · ' + qw + (F.marks ? ' · ' + F.marks + ' درجة' : ''))) +
                 (kids.length ? ' · ' + kids.join(' و') : '');
    await emit('rules-' + tag + '-fatri',
      doc(F.title + ' — مقرَّر الاختبار الفتري', fsub, subjHtml(F, false)));
    manifest.pages[tag + '-fatri'] = {
      source: f, lessons: F.count, file: 'rules-' + tag + '-fatri.pdf',
      questions: F.questions, hash: F.digest
    };
    console.log('   📝 الفتري: ' + F.count + ' درسًا من ' + n + ' · ' + qw);
  }

  /* وملفٌّ جامعٌ لكلّ ابنٍ بمواده كلِّها، بترتيبِ صفحتِه */
  for (const kid of Object.keys(SUBJECTS)){
    const mine = SUBJECTS[kid]
      .map(l => String(l.href || '').split('?')[0])
      .filter((f, i, a) => pages[f] && a.indexOf(f) === i);
    if (!mine.length) continue;
    const n = mine.reduce((s, f) => s + pages[f].count, 0);
    await emit('rules-all-' + kid, doc('قواعد الدروس — ' + (NAMES[kid] || kid),
      (GRADES[kid] || '') + ' · ' + mine.length + ' مواد · ' + lw(n),
      mine.map(f => subjHtml(pages[f], true)).join('')));
    manifest.kids[kid] = { pages: mine.map(f => f.replace(/\.html$/, '')),
                           lessons: n, file: 'rules-all-' + kid + '.pdf' };
    console.log('📚 ' + (NAMES[kid] || kid) + ': ' + mine.length + ' مواد · ' + lw(n));
  }
  await browser.close();

  /* البصمةُ تُضاف ولا تمحو بصمةَ كتبِ الإنجليزيّ (gen-book-pdf.js) */
  const mf = path.join(OUTDIR, 'manifest.json');
  const old = fs.existsSync(mf) ? JSON.parse(fs.readFileSync(mf, 'utf8')) : {};
  old.rules = manifest;
  fs.writeFileSync(mf, JSON.stringify(old, null, 1) + '\n');

  if (skipped.length) console.log('\n⚠️  تُخطّيت: ' + skipped.join(' · '));
  console.log('\nالمولَّد: ' + made + ' ملفًّا في pdf/');
})();
