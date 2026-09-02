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

/* مسائل الاستدلال (REASON) — متعدّدة الخطوات، فهي الأخطر: خطأٌ في خطوةٍ
   وسطى لا يظهر في الجواب النهائي إلّا بإعادة الحساب كاملًا. القواعد هنا
   مبنيّةٌ من نصّ المسألة مباشرة، لا من خطوات الحلّ المعروضة. */
const CHECK_R = {
  'تبليط وخصم': q => { const m = q.match(/ضلعها (\d+) أمتار.*?ضلعه (\d+) متر.*?البلاطة (\d+) ريالًا.*?خصم (\d+)%/s);
                       const s=+m[1], t=+m[2], p=+m[3], d=+m[4];
                       return ((s/t)*(s/t)) * p * (1 - d/100); },
  'رحلة ووقود': q => { const m = q.match(/سرعتها (\d+) كم\/ساعة سارت (\d+) ساعات.*?تقطع (\d+) كم بكل لتر.*?بـ(\d+) ريال/s);
                       const v=+m[1], t=+m[2], c=+m[3], pr=+m[4];
                       return (v*t/c) * pr; },
  'سياج وبوابة': q => { const m = q.match(/طولها (\d+) م وعرضها (\d+) م.*?عرضها (\d+) م.*?المتر (\d+) ريالًا/s);
                        const L=+m[1], W=+m[2], g=+m[3], pm=+m[4];
                        return (2*(L+W) - g) * pm; },
  'مقارنة عرضين': q => { const m = q.match(/سعر الواحدة (\d+) ريالًا.*?خصم (\d+)%/s);
                         const p=+m[1], d=+m[2];
                         return Math.abs(4*p*(1 - d/100) - 3*p); },
  'أعمار بعد سنوات': q => { const m = q.match(/الآن (\d+) سنة.*?بعد (\d+) سنوات/s);
                            const f=+m[1], n=+m[2];
                            return (f + n)/2 - n; },
  'رفع المعدّل': q => { const m = q.match(/في 4 مواد (\d+).*?في 5 موادّ (\d+)/s);
                        const a=+m[1], w=+m[2];
                        return 5*w - 4*a; },
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
  return { REMEDY: ctx.REMEDY || null, REASON: ctx.REASON || null };
}

/* فحص مجموعةٍ من المولّدات بقواعدها المستقلّة */
function auditGroup(gens, rules, label, issues, opts){
  let samples = 0;
  Object.keys(gens).forEach(skill => {
    const rule = rules[skill];
    if (!rule){
      issues.push({ sev:'تنبيه', msg:'«' + skill + '» بلا قاعدة تحقّقٍ مستقلّة في checks/think.js' });
      return;
    }
    let wrongAns = 0, dupOpt = 0, badIdx = 0, noSteps = 0, threw = 0, noViz = 0, noCheck = 0, ugly = 0, sample = '';
    for (let i = 0; i < SAMPLES; i++){
      let it;
      try { it = gens[skill](); } catch(e){ threw++; continue; }
      samples++;
      let expect;
      try { expect = rule(it.q); } catch(e){ threw++; continue; }
      const given = parseFloat(String(it.opts[it.ans]).replace(/−/g, '-'));
      if (!(Math.abs(given - expect) < 1e-9)){ if(!wrongAns) sample = it.q + ' → ' + given + ' والصحيح ' + expect; wrongAns++; }
      if (it.opts.length !== 3 || new Set(it.opts.map(x => String(x).replace(/−/g,'-'))).size !== 3) dupOpt++;
      if (!(it.ans >= 0 && it.ans < it.opts.length)) badIdx++;
      if (!it.rule || !Array.isArray(it.steps) || !it.steps.length) noSteps++;
      /* توصيتا الدليل ذواتا الأدلّة القويّة: رسمٌ وخطوةُ تحقّق — غيابهما
         يُفقد الصفحةَ سببَ وجودها، فنعدّه خطأً لا تنبيهًا */
      if (opts.needViz && !it.viz) noViz++;
      if (opts.needCheck && !it.check) noCheck++;
      /* أرقامٌ كسريّةٌ طويلة تُربك الطفل ولا تظهر في اختبارٍ حقيقيّ */
      if (Number.isFinite(expect) && Math.abs(expect - Math.round(expect)) > 1e-9) ugly++;
    }
    const P = '«' + skill + '» ';
    if (threw)    issues.push({ sev:'خطأ', msg:P+'انهار في ' + threw + ' عيّنة' });
    if (wrongAns) issues.push({ sev:'خطأ', msg:P+'جوابٌ خاطئ في ' + wrongAns + '/' + SAMPLES + ' — مثال: ' + sample });
    if (dupOpt)   issues.push({ sev:'خطأ', msg:P+'خياراتٌ مكرّرة أو عددها ≠ ٣ في ' + dupOpt + ' عيّنة' });
    if (badIdx)   issues.push({ sev:'خطأ', msg:P+'فهرس جوابٍ خارج المدى في ' + badIdx + ' عيّنة' });
    if (noSteps)  issues.push({ sev:'خطأ', msg:P+'بلا قاعدةٍ أو خطوات حلٍّ في ' + noSteps + ' عيّنة' });
    if (noViz)    issues.push({ sev:'خطأ', msg:P+'بلا رسمٍ توضيحيّ في ' + noViz + ' عيّنة (توصية ٣ — دليل قويّ)' });
    if (noCheck)  issues.push({ sev:'خطأ', msg:P+'بلا خطوة تحقّقٍ في ' + noCheck + ' عيّنة (توصية ٢ — دليل قويّ)' });
    if (ugly)     issues.push({ sev:'خطأ', msg:P+'جوابٌ كسريّ غير صحيحٍ في ' + ugly + ' عيّنة' });
  });
  return samples;
}

function run(){
  const issues = [];
  let G;
  try { G = loadRemedy(); }
  catch(e){ return { issues:[{ sev:'خطأ', msg:'تعذّر تحميل مولّدات think.html: ' + e.message }], gens:0, samples:0 }; }
  if (!G || !G.REMEDY) return { issues:[{ sev:'خطأ', msg:'لم يُعثر على REMEDY في think.html' }], gens:0, samples:0 };
  if (!G.REASON)       return { issues:[{ sev:'خطأ', msg:'لم يُعثر على REASON (مسائل الاستدلال) في think.html' }], gens:0, samples:0 };

  let samples = 0;
  samples += auditGroup(G.REMEDY, CHECK,   'مهارات',  issues, { needViz:true, needCheck:true });
  samples += auditGroup(G.REASON, CHECK_R, 'استدلال', issues, { needViz:true, needCheck:true });

  return { issues, gens: Object.keys(G.REMEDY).length + Object.keys(G.REASON).length, samples,
           skills: Object.keys(G.REMEDY).length, reason: Object.keys(G.REASON).length };
}

module.exports = run;
if (require.main === module){
  const r = run();
  console.log('مولّدات: ' + r.gens + ' (مهارات ' + (r.skills||0) + ' · استدلال ' + (r.reason||0) + ') · عيّنات: ' + r.samples);
  r.issues.forEach(i => console.log('  ' + (i.sev === 'خطأ' ? '❌' : '⚠️ ') + ' ' + i.msg));
  if (!r.issues.length) console.log('  ✅ كل المولّدات سليمة');
}
