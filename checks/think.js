/* ============================================================
   فحص مولّدات «تقوية التفكير» (think.html).

   لماذا فحصٌ مستقلّ؟ مدقّق pages.js يكتشف المولّدات بأسمائها
   (gXxx، uN…) وبِبنيةِ إرجاعٍ على شكل مصفوفة. ومولّدات think.html
   مخزَّنةٌ في كائن REMEDY بمفاتيحَ عربية وتُرجع كائنًا فيه شرحٌ
   بخطوات — فلا يراها pages.js، وكانت ستبقى بلا شبكة أمانٍ دائمة.

   وهذه صفحةٌ تُعلّم الطريقة لا الجواب فقط، فغلطُ خطوةٍ فيها أسوأ من
   غياب الصفحة أصلًا: الطفل يحفظ طريقةً خاطئة ويطبّقها في الاختبار.

   ما يفحصه — لكلّ مولّدٍ ٤٠٠ عيّنة:
     ١. صحّة الجواب: يُعاد حسابه من نصّ السؤال بقاعدةٍ مستقلّةٍ هنا،
        لا من كود الصفحة — فلو أخطأت الصفحة والفحص معًا بنفس الغلط
        لم يُكشف، ولذلك كُتبت القواعد أدناه من التعريف الرياضيّ مباشرة.
     ٢. ثلاثة خيارات متمايزة (لا مكرّر يُربك الطفل).
     ٣. فهرس الجواب داخل المدى.
     ٤. وجود القاعدة والخطوات — فبدونها الصفحة كأيّ صفحةٍ أخرى.
   ============================================================ */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');

const SAMPLES = 400;

/* قواعد مستقلّة، مبنيّة من نصّ السؤال نفسه */
const CHECK = {
  'أعداد متتالية': q => { const st = +q.match(/أوّلها (\d+)/)[1]; return st + (st+1) + (st+2); },
  'أنماط عددية': q => { const s = q.match(/: ([\d،\s]+)،\s*\.\.\./)[1].split('،').map(x => +x.trim());
                        return s[s.length-1] + (s[1] - s[0]); },
  'النسبة المئوية': q => { const m = q.match(/(\d+)% من (\d+)/); return (+m[1]) * (+m[2]) / 100; },
  'نسبة الزيادة': q => { const m = q.match(/من (\d+) ريالًا بنسبة (\d+)%/); return (+m[1]) * (1 + (+m[2])/100); },
  'نسبة النقص': q => { const m = q.match(/من (\d+) ريالًا بنسبة (\d+)%/); return (+m[1]) * (1 - (+m[2])/100); },
  'الخصم': q => { const m = q.match(/خصمٌ (\d+)% على سعر (\d+)/); return (+m[2]) * (1 - (+m[1])/100); },
  'نظرية فيثاغورس': q => { const m = q.match(/القائمان (\d+) و (\d+)/);
                           return Math.sqrt((+m[1])**2 + (+m[2])**2); },
  'مساحة المربّع': q => { const s = +q.match(/ضلعه (\d+)/)[1]; return s * s; },
  'محيط المربّع': q => { const s = +q.match(/ضلعه (\d+)/)[1]; return 4 * s; },
  'مساحة المثلّث': q => { const m = q.match(/قاعدته (\d+) وارتفاعه (\d+)/); return (+m[1]) * (+m[2]) / 2; },
  'مساحة المستطيل': q => { const m = q.match(/طوله (\d+) وعرضه (\d+)/); return (+m[1]) * (+m[2]); },
  'محيط المستطيل': q => { const m = q.match(/طوله (\d+) وعرضه (\d+)/); return 2 * ((+m[1]) + (+m[2])); },
  'تحويل الكتلة': q => (+q.match(/في (\d+) كيلو/)[1]) * 1000,
  'تحويل الأطوال': q => (+q.match(/في (\d+) أمتار/)[1]) * 100,
  'تحويل الزمن': q => (+q.match(/في (\d+) ساعات/)[1]) * 60,
  'المتوسط الحسابي': q => { const a = q.match(/: ([\d،\s]+)؟/)[1].split('،').map(x => +x.trim());
                            return a.reduce((s,x) => s+x, 0) / a.length; },
  'الوسيط': q => { const a = q.match(/: ([\d،\s]+)؟/)[1].split('،').map(x => +x.trim()).sort((x,y) => x-y);
                   return a[Math.floor(a.length/2)]; },
  'كسر من عدد': q => { const m = q.match(/(\d+)\/(\d+) من (\d+)/); return (+m[3]) * (+m[1]) / (+m[2]); },
};

function loadRemedy(){
  const html = fs.readFileSync(path.join(ROOT, 'think.html'), 'utf8');
  const m = html.match(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/);
  if (!m) return null;
  const code = m[1];
  const cut = code.indexOf('var app = document.getElementById');   /* نقف قبل ما يعتمد على DOM */
  const ctx = { console, fetch: () => Promise.resolve({ ok:false, json: () => [] }),
                document: { getElementById: () => null, addEventListener: () => {} },
                window: { addEventListener: () => {} },
                location: { search: '?who=hasan' }, URLSearchParams, encodeURIComponent };
  vm.createContext(ctx);
  vm.runInContext(cut > 0 ? code.slice(0, cut) : code, ctx);
  return ctx.REMEDY || null;
}

function run(){
  const issues = [];
  let R;
  try { R = loadRemedy(); }
  catch(e){ return { issues:[{ sev:'خطأ', msg:'تعذّر تحميل مولّدات think.html: ' + e.message }], gens:0, samples:0 }; }
  if (!R) return { issues:[{ sev:'خطأ', msg:'لم يُعثر على REMEDY في think.html' }], gens:0, samples:0 };

  const plain = s => String(s).replace(/−/g, '-');
  let samples = 0;
  const names = Object.keys(R);

  names.forEach(skill => {
    const rule = CHECK[skill];
    if (!rule){
      /* مولّدٌ بلا قاعدة فحصٍ مستقلّة = صحّته غير مضمونة، فننبّه لا نسكت */
      issues.push({ sev:'تنبيه', msg:'«' + skill + '» بلا قاعدة تحقّقٍ مستقلّة في checks/think.js' });
      return;
    }
    let wrongAns = 0, dupOpt = 0, badIdx = 0, noSteps = 0, threw = 0, sample = '';
    for (let i = 0; i < SAMPLES; i++){
      let it;
      try { it = R[skill](); } catch(e){ threw++; continue; }
      samples++;
      let expect;
      try { expect = rule(it.q); } catch(e){ threw++; continue; }
      const given = parseFloat(plain(it.opts[it.ans]));
      if (!(Math.abs(given - expect) < 1e-9)){ if(!wrongAns) sample = it.q + ' → ' + given + ' والصحيح ' + expect; wrongAns++; }
      if (it.opts.length !== 3 || new Set(it.opts.map(plain)).size !== 3) dupOpt++;
      if (!(it.ans >= 0 && it.ans < it.opts.length)) badIdx++;
      if (!it.rule || !Array.isArray(it.steps) || !it.steps.length) noSteps++;
    }
    if (threw)    issues.push({ sev:'خطأ', msg:'«' + skill + '» انهار في ' + threw + ' عيّنة' });
    if (wrongAns) issues.push({ sev:'خطأ', msg:'«' + skill + '» جوابٌ خاطئ في ' + wrongAns + '/' + SAMPLES + ' — مثال: ' + sample });
    if (dupOpt)   issues.push({ sev:'خطأ', msg:'«' + skill + '» خياراتٌ مكرّرة أو عددها ≠ ٣ في ' + dupOpt + ' عيّنة' });
    if (badIdx)   issues.push({ sev:'خطأ', msg:'«' + skill + '» فهرس جوابٍ خارج المدى في ' + badIdx + ' عيّنة' });
    if (noSteps)  issues.push({ sev:'خطأ', msg:'«' + skill + '» بلا قاعدةٍ أو خطوات حلٍّ في ' + noSteps + ' عيّنة' });
  });

  return { issues, gens: names.length, samples };
}

module.exports = run;
if (require.main === module){
  const r = run();
  console.log('مولّدات: ' + r.gens + ' · عيّنات: ' + r.samples);
  r.issues.forEach(i => console.log('  ' + (i.sev === 'خطأ' ? '❌' : '⚠️ ') + ' ' + i.msg));
  if (!r.issues.length) console.log('  ✅ كل المولّدات سليمة');
}
