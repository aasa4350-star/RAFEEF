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
                            return (f + n)/3 - n; },
  'رفع المعدّل': q => { const m = q.match(/في 4 مواد (\d+).*?في 5 موادّ (\d+)/s);
                        const a=+m[1], w=+m[2];
                        return 5*w - 4*a; },
};

/* ═══ طبقةُ التحدّي (DEEP) — القواعدُ هنا أخطرُ ما في الملفّ ═══════════
   لأنّ مصيدةَ كلِّ مسألةٍ موضوعةٌ في خياراتها قصدًا، فلو أخطأ المولّدُ
   صار الجوابُ المعتمَدُ هو المصيدةَ نفسَها — والطفلُ يتعلّم الغلطَ
   مؤكَّدًا بـ«✔». فكلُّ قاعدةٍ أدناه مبنيّةٌ من تعريفِها الرياضيِّ أو
   المنطقيِّ مباشرةً، ومن نصِّ السؤالِ وحدَه لا من خطواتِ العرض.
   وثلاثٌ منها جوابُها نصٌّ لا رقم (القياس، والكفاية، والترتيب) —
   فتُقارَن نصًّا بعد تطبيعِ المسافات. */
const norm = s => String(s).replace(/\s+/g, ' ').trim();

/* ترتيبٌ منطقيّ: نبني السلسلةَ من العلاقاتِ بترتيبٍ طوبولوجيّ */
function chainOrder(pairs){
  const after = new Map(), isAfter = new Set();
  pairs.forEach(([a,b]) => { after.set(a,b); isAfter.add(b); });
  const head = [...after.keys()].find(k => !isAfter.has(k));
  const out = []; let cur = head;
  while (cur && out.length < 10){ out.push(cur); cur = after.get(cur); }
  return out;
}
/* كفايةُ المعطيات: نقرأ معاملَي كلِّ معادلةٍ ونحكم بالرتبةِ لا بالحساب */
function parseEq(s){
  const t = norm(s).replace(/−/g, '-');
  const m = /^(-?\d*)س(?:\s*([+-])\s*(\d*)ص)?\s*=\s*(-?\d+)$/.exec(t);
  if (!m) return null;
  const a = m[1] === '' ? 1 : (m[1] === '-' ? -1 : +m[1]);
  let b = 0;
  if (m[2]) b = (m[3] === '' ? 1 : +m[3]) * (m[2] === '-' ? -1 : 1);
  return { a, b, c: +m[4] };
}
function sufficiency(s1, s2, SUF){
  const e1 = parseEq(s1), e2 = parseEq(s2);
  if (!e1 || !e2) return null;
  const alone1 = e1.b === 0 && e1.a !== 0, alone2 = e2.b === 0 && e2.a !== 0;
  if (alone1 && !alone2) return SUF[0];
  if (alone2 && !alone1) return SUF[1];
  if (alone1 && alone2)  return SUF[0];              /* لا يولّدها المولّد */
  const det = e1.a*e2.b - e2.a*e1.b;
  return det !== 0 ? SUF[2] : SUF[3];
}

function CHECK_D(SUF){ return {
  'نسبةٌ ثمّ نسبة': q => { const m = /سعرُ جهازٍ (\d+) ريالًا\. رُفع (\d+)%، ثمّ خُفّض (\d+)%/.exec(q);
      const P=+m[1], a=+m[2], b=+m[3]; return P * (100+a)/100 * (100-b)/100; },

  'متوسّطٌ مرجّح': q => { const m = /فيه (\d+) طالبًا متوسّطُ درجاتهم (\d+)، وفصلٌ آخرُ فيه (\d+) طالبًا متوسّطُهم (\d+)/.exec(q);
      const n1=+m[1], m1=+m[2], n2=+m[3], m2=+m[4]; return (n1*m1 + n2*m2) / (n1+n2); },

  /* معدّلٌ مشترك: ١/أ + ١/ب = ١/ت ← ت = أب/(أ+ب) */
  'عاملان معًا': q => { const m = /وحدَه في (\d+) أيّام[\s\S]*?وحدَه في (\d+) أيّام/.exec(q);
      const a=+m[1], b=+m[2]; return a*b/(a+b); },

  'سلسلةُ نسب': q => { const m = /بنسبة (\d+):(\d+)، ونقاطُ \(ب\) إلى \(ج\) بنسبة (\d+):(\d+)[\s\S]*?\(ج\) (\d+) نقطة/.exec(q);
      const p=+m[1], Q=+m[2], r=+m[3], s=+m[4], N=+m[5]; return N * p * r / (Q * s); },

  'سحبُ عنصرٍ من متوسّط': q => { const m = /درجاتِ (\d+) طلّابٍ (\d+)\. خرج طالبٌ واحدٌ فصار متوسّطُ الباقينَ (\d+)/.exec(q);
      const n=+m[1], A=+m[2], B=+m[3]; return n*A - (n-1)*B; },

  /* ٢x+٣y=T1 و x+٢y=T2 ← y = ٢T2 − T1 */
  'معادلتان مُقنّعتان': q => { const m = /دفاترَ بـ(\d+) ريالًا، وقلمٌ ودفترانِ بـ(\d+) ريالًا/.exec(q);
      const T1=+m[1], T2=+m[2]; return 2*T2 - T1; },

  'مصافحات': q => { const n = +/اجتماعٍ (\d+) أشخاص/.exec(q)[1]; return n*(n-1)/2; },

  /* فرقُ الفروقِ ثابت: الحدُّ التالي = أخير + (آخرُ فرقٍ + ثابتُ التزايد) */
  'متتاليةٌ فرقُها يتغيّر': q => {
      const s = /المتتالية: ([\d،\s]+)،\s*\.\.\./.exec(q)[1].split('،').map(x => +x.trim());
      const d = []; for (let i=1;i<s.length;i++) d.push(s[i]-s[i-1]);
      const e = d[1] - d[0];
      return s[s.length-1] + d[d.length-1] + e; },

  'زوايا مثلّثٍ بعلاقة': q => { const m = /الثانيةُ (ضِعفُ|ثلاثةُ أضعافِ) الأولى، والثالثةُ تزيدُ (\d+)°/.exec(q);
      const k = m[1] === 'ضِعفُ' ? 2 : 3, c = +m[2], x = (180 - c) / (k + 2);
      return Math.max(x, k*x, x + c); },

  /* قياسٌ منطقيّ: نطبّق قاعدةَ اللزومِ على المقدّمتين كما هي في المنطق */
  'استنتاجٌ يقينيّ': q => {
      let m = /«كلُّ (.+?) هم (.+?)»، و«كلُّ (.+?) هم (.+?)»/.exec(q);
      if (m) return 'كلُّ ' + m[1] + ' هم ' + m[4];       /* تعدّي الاحتواء */
      m = /«كلُّ (.+?) هم (.+?)»، و«بعضُ (.+?) هم (.+?)»/.exec(q);
      if (m) return 'بعضُ ' + m[2] + ' هم ' + m[4];       /* بعضٌ لا تُنتج كلًّا */
      return null; },

  'كفايةُ المعطيات': q => { const m = /\(١\) (.+?)، \(٢\) (.+?)\. أيُّ/.exec(q);
      return m ? sufficiency(m[1], m[2], SUF) : null; },

  'ترتيبٌ منطقيّ': q => {
      /* الجُملُ موصولةٌ بـ«، و»، فالاسمُ يَلحقه فاصلةٌ ويَسبقه واوُ عطف —
         ولو تُركا لصار «نواف» و«ونواف» اسمين مختلفين فانكسرت السلسلة.
         (ولا اسمَ في القائمةِ يبدأ بواو، فالقَشطُ آمن.) */
      const cl = s => s.replace(/^و/, '').replace(/[،.؟]+$/, '');
      const pairs = [...q.matchAll(/(\S+) سبقَ (\S+)/g)].map(x => [cl(x[1]), cl(x[2])]);
      const ord = chainOrder(pairs);
      const k = { 'الأوّل':1, 'الثاني':2, 'الثالث':3, 'الرابع':4 }[/المركزِ (\S+?)؟$/.exec(q.trim())[1]];
      return ord[k-1] || null; },

  'نسبةٌ بعد إضافة': q => { const m = /بنسبة (\d+):(\d+)، ومجموعُها (\d+) كُرَيّة/.exec(q);
      const p=+m[1], Q=+m[2], N=+m[3], unit = N/(p+Q); return unit*p - unit*Q; },
}; }

function loadRemedy(who){
  const html = fs.readFileSync(path.join(ROOT, 'think.html'), 'utf8');
  const m = html.match(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/);
  if (!m) return null;
  const code = m[1];
  const cut = code.indexOf('var app = document.getElementById');   /* نقف قبل ما يعتمد على DOM */
  const ctx = { console, fetch: () => Promise.resolve({ ok:false, json: () => [] }),
                document: { getElementById: () => null, addEventListener: () => {} },
                addEventListener: () => {},
                location: { search: '?who=' + (who || 'hasan') }, URLSearchParams, encodeURIComponent };
  vm.createContext(ctx);
  /* الصفحة تقرأ APP_CONFIG من config.js، وwindow ألياف العالميّ نفسِه
     لا نسخةٌ منه — وإلّا سقطت الكتلةُ عند أوّل سطرٍ يقرأ الإعداد. */
  ctx.window = ctx;
  const cfg = path.join(ROOT, 'config.js');
  if (fs.existsSync(cfg)) vm.runInContext(fs.readFileSync(cfg, 'utf8'), ctx);
  /* بترتيبِ الوسومِ في الصفحةِ نفسِه: طبقةُ التحدّي قبل الكتلةِ الداخليّة */
  const deep = path.join(ROOT, 'think-deep.js');
  if (fs.existsSync(deep)) vm.runInContext(fs.readFileSync(deep, 'utf8'), ctx);
  vm.runInContext(cut > 0 ? code.slice(0, cut) : code, ctx);
  return { REMEDY: ctx.REMEDY || null, REASON: ctx.REASON || null,
           DEEP: (ctx.THINK_DEEP && ctx.THINK_DEEP.BANK) || null,
           GRADE: (ctx.THINK_DEEP && ctx.THINK_DEEP.GRADE) || null,
           SUF: (ctx.THINK_DEEP && ctx.THINK_DEEP.SUF) || null,
           ctx };
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
    const nOpt = opts.nOpt || 3;
    let wrongAns = 0, dupOpt = 0, badIdx = 0, noSteps = 0, threw = 0, noViz = 0, noCheck = 0, ugly = 0, unreal = 0, sample = '';
    for (let i = 0; i < SAMPLES; i++){
      let it;
      try { it = gens[skill](); } catch(e){ threw++; continue; }
      samples++;
      let expect;
      try { expect = rule(it.q); } catch(e){ threw++; continue; }
      /* جوابٌ نصّيّ (القياسُ المنطقيّ، والكفاية، والترتيب): يُقارَن نصًّا.
         وقاعدةٌ أعادت null معناها أنّها لم تفهم السؤال — وذاك خطأٌ أيضًا. */
      if (typeof expect === 'string' || expect === null || expect === undefined){
        const got = norm(it.opts[it.ans]);
        if (expect == null || got !== norm(expect)){
          if(!wrongAns) sample = it.q + ' → «' + got + '» والصحيح «' + expect + '»';
          wrongAns++;
        }
      } else {
        const given = parseFloat(String(it.opts[it.ans]).replace(/−/g, '-'));
        if (!(Math.abs(given - expect) < 1e-9)){ if(!wrongAns) sample = it.q + ' → ' + given + ' والصحيح ' + expect; wrongAns++; }
      }
      if (it.opts.length !== nOpt || new Set(it.opts.map(x => norm(String(x).replace(/−/g,'-')))).size !== nOpt) dupOpt++;
      if (!(it.ans >= 0 && it.ans < it.opts.length)) badIdx++;
      if (!it.rule || !Array.isArray(it.steps) || !it.steps.length) noSteps++;
      /* توصيتا الدليل ذواتا الأدلّة القويّة: رسمٌ وخطوةُ تحقّق — غيابهما
         يُفقد الصفحةَ سببَ وجودها، فنعدّه خطأً لا تنبيهًا */
      if (opts.needViz && !it.viz) noViz++;
      if (opts.needCheck && !it.check) noCheck++;
      /* واقعيّة السياق: مسألةٌ صحيحةٌ حسابيًّا وسخيفةٌ واقعيًّا (أبٌ عمره ٢٤
         وابنه ١٠) تُفقد الطفل ثقته بالمسألة — فتُفحص أعمار الأب والابن */
      if (/عمر الأب/.test(it.q)){
        const mm = it.q.match(/الآن (\d+) سنة/);
        const fa = mm ? +mm[1] : 0, so = parseFloat(String(it.opts[it.ans]).replace(/−/g,'-'));
        if (fa < 28 || (fa - so) < 18) unreal++;
      }
      /* أرقامٌ كسريّةٌ طويلة تُربك الطفل ولا تظهر في اختبارٍ حقيقيّ */
      if (Number.isFinite(expect) && Math.abs(expect - Math.round(expect)) > 1e-9) ugly++;
    }
    const P = '«' + skill + '» ';
    if (threw)    issues.push({ sev:'خطأ', msg:P+'انهار في ' + threw + ' عيّنة' });
    if (wrongAns) issues.push({ sev:'خطأ', msg:P+'جوابٌ خاطئ في ' + wrongAns + '/' + SAMPLES + ' — مثال: ' + sample });
    if (dupOpt)   issues.push({ sev:'خطأ', msg:P+'خياراتٌ مكرّرة أو عددها ≠ ' + nOpt + ' في ' + dupOpt + ' عيّنة' });
    if (opts.needTip){
      let noTip = 0;
      for (let i = 0; i < 40; i++){ let it; try { it = gens[skill](); } catch(e){ continue; } if(!it || !it.tip) noTip++; }
      if (noTip) issues.push({ sev:'خطأ', msg:P+'بلا تنبيهٍ على المصيدة (tip) — وهي علّةُ وجودِ السؤال' });
    }
    if (badIdx)   issues.push({ sev:'خطأ', msg:P+'فهرس جوابٍ خارج المدى في ' + badIdx + ' عيّنة' });
    if (noSteps)  issues.push({ sev:'خطأ', msg:P+'بلا قاعدةٍ أو خطوات حلٍّ في ' + noSteps + ' عيّنة' });
    if (noViz)    issues.push({ sev:'خطأ', msg:P+'بلا رسمٍ توضيحيّ في ' + noViz + ' عيّنة (توصية ٣ — دليل قويّ)' });
    if (noCheck)  issues.push({ sev:'خطأ', msg:P+'بلا خطوة تحقّقٍ في ' + noCheck + ' عيّنة (توصية ٢ — دليل قويّ)' });
    if (ugly)     issues.push({ sev:'خطأ', msg:P+'جوابٌ كسريّ غير صحيحٍ في ' + ugly + ' عيّنة' });
    if (unreal)   issues.push({ sev:'خطأ', msg:P+'أعمارٌ غير واقعية (أبٌ دون ٢٨ أو فرقٌ دون ١٨ سنة) في ' + unreal + ' عيّنة' });
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
  if (!G.DEEP || !Object.keys(G.DEEP).length)
    issues.push({ sev:'خطأ', msg:'طبقةُ التحدّي (THINK_DEEP.BANK) غائبةٌ — ومن بلغ سقفَ البنكِ لا يبقى له فيه تفكير' });
  else
    samples += auditGroup(G.DEEP, CHECK_D(G.SUF || []), 'تحدٍّ', issues,
                          { needViz:true, needCheck:true, needTip:true, nOpt:4 });

  /* ═══ قياسُ الزمنِ ومسارُه ═══════════════════════════════════════
     طلبُ الأب (٣ أكتوبر ٢٠٢٦): الهدفُ يتحوّل من الصحّة إلى السرعة.
     وثلاثةٌ تنقطع بصمت: أن تعمل ساعةٌ واحدةٌ لا ساعات (وإلّا عُدّ
     الزمنُ مرّتين فظهر للطفل رقمٌ كاذب)، وألّا تجري وهو غائبٌ عن
     الصفحة (قفلُ الجوّال ليس تفكيرًا)، وأن تُحفظ الأزمنةُ وإلّا لم
     يُعرف أتحسّنت سرعتُه أم ثبتت — وهو المقصودُ كلُّه.

     ورابعٌ تربويّ: ألّا يُمدح سريعٌ مخطئ، وإلّا علّمناه التخمين. */
  try {
    const src = fs.readFileSync(path.join(__dirname, '..', 'think.html'), 'utf8');
    const need = [
      [/var T_SKILL = \d+, T_REASON = \d+;/, 'هدفا الزمن (T_SKILL و T_REASON) غير معرَّفين'],
      [/function secOf\(/,                    'لا تُقاس أزمنةُ الأسئلة'],
      [/document\.hidden \? null : pickActive\(\)/, 'الساعةُ تجري والصفحةُ مخفيّة — قفلُ الجوّال يُحسب تفكيرًا'],
      [/data-tm/,                             'الزمنُ لا يُعرض للطالب'],
      [/items:\(items\|\|\[\]\), msAvg:/, 'الأزمنةُ لا تُحفظ — فلا يُعرف أتحسّنت السرعةُ أم ثبتت'],
      [/تسرّعت/,                               'لا تنبيهَ على السرعة بلا صحّة — وهو يُعلّم التخمين'],
      [/weakIn\(agg, REASON/,                 'المسائلُ المركّبةُ غيرُ مستهدَفةٍ بالضعف — تمرّ بالصدفة']
    ];
    need.forEach(function(x){ if(!x[0].test(src)) issues.push({ sev:'خطأ', msg:x[1] }); });
    /* المدحُ مشروطٌ بالصحّة: شرطُ t-good لا بدّ أن يبدأ بـ ok */
    if (!/if\(ok && sec <= goal\)\{ klass="t-good"/.test(src) &&
        !/if\(ok && it\.deep\)\{ klass="t-good"/.test(src))
      issues.push({ sev:'خطأ', msg:'المدحُ على السرعة غيرُ مشروطٍ بالإجابة الصحيحة' });

    /* ═══ طبقةُ التحدّي: وصلُها بالصفحةِ لا وجودُها فقط ═══════════════
       ملفٌّ كاملٌ من المسائلِ لا يُغيّر شيئًا إن لم يُحمَّل، ولم يُفتح
       بقياسٍ، ولم يُمنَع عن الصفوفِ الصغيرة. */
    const wire = [
      [/<script src="think-deep\.js"><\/script>/, 'think-deep.js غيرُ محمَّلٍ في الصفحة — فالطبقةُ ميّتة'],
      [/var T_DEEP = \d+;/,                       'مهلةُ مسائلِ التحدّي (T_DEEP) غيرُ معرَّفة'],
      [/function opt4\(/,                         'خياراتٌ أربعةٌ غيرُ متوفّرة — والتخمينُ من ثلاثةٍ ٣٣٪'],
      [/\(DEEP_GRADE\[k\] \|\| 99\) <= g/,        'بوّابةُ الصفّ مفقودة — قد تُرسَل مسألةُ متوسّطٍ إلى رابعِ ابتدائيّ'],
      [/if\(!Object\.keys\(DEEP_ALLOW\)\.length\) return 0;/,
                                                  'الحصّةُ لا تُصفَّر حين لا يسمح الصفّ'],
      [/weakIn\(agg, DEEP_ALLOW/,                 'مسائلُ التحدّي غيرُ مستهدَفةٍ بالضعف — تمرّ بالصدفة'],
      [/it3\.deep = true/,                        'مسائلُ التحدّي لا تُعلَّم بـdeep — فمهلتُها وعرضُها كغيرِها'],
      [/tDeep:T_DEEP, deepN:/,                    'عددُ مسائلِ التحدّي ومهلتُها لا تُحفظان — فلا يُعرف أثرُ الرفع']
    ];
    wire.forEach(x => { if(!x[0].test(src)) issues.push({ sev:'خطأ', msg:x[1] }); });
  } catch (e){
    issues.push({ sev:'خطأ', msg:'تعذّر فحصُ مسار الزمن: ' + e.message });
  }

  /* ═══ سلوكُ البوّابةِ يُشغَّل لا يُقرأ ═══════════════════════════════
     الحرسُ النصّيُّ أعلاه يثبت وجودَ السطر، وهذا يثبت أثرَه: نُحمّل
     الصفحةَ بهويّةِ كلِّ ابنٍ ونسأل ماذا يُفتح له فعلًا. */
  try {
    const gate = { hasan:true, rafeef:true, osama:false, saud:false };
    Object.keys(gate).forEach(w => {
      const g = loadRemedy(w);
      const n = g && g.ctx ? Object.keys(g.ctx.DEEP_ALLOW || {}).length : -1;
      if (gate[w] && n <= 0)
        issues.push({ sev:'خطأ', msg:'طبقةُ التحدّي مغلقةٌ على ' + w + ' وهو في صفٍّ يسمح بها' });
      if (!gate[w] && n !== 0)
        issues.push({ sev:'خطأ', msg:'طبقةُ التحدّي مفتوحةٌ على ' + w + ' — وصعوبةٌ قبل أوانها تُعلّم العجز' });
    });

    const C = loadRemedy('hasan').ctx;
    /* السقف: دقّةٌ وسرعةٌ ← أربع، دقّةٌ وحدَها ← مسألتان، وما دون ← صفر */
    const q = C.deepQuota;
    const cases = [
      [{ n:5, pct:100, sec:4 },  4, 'متقِنٌ سريعٌ لا تُفتح له الطبقةُ كاملةً'],
      [{ n:2, pct:92,  sec:9 },  4, 'جلستانِ بدقّةٍ وسرعةٍ لا تكفيان لفتحِ الطبقة'],
      [{ n:5, pct:95,  sec:33 }, 2, 'دقيقٌ بطيءٌ لا يأخذ مسألتين (أو يأخذ أكثرَ من حقِّه)'],
      [{ n:5, pct:80,  sec:4 },  0, 'الطبقةُ تُفتح لمن لم يُتقِن — والصعوبةُ تُزاد على من أتقن'],
      [{ n:1, pct:100, sec:3 },  0, 'جلسةٌ واحدةٌ تكفي لفتحِ الطبقة — والقياسُ لا يُبنى على واحدة'],
      [{ n:0, pct:null, sec:null }, 0, 'الطبقةُ تُفتح بلا قياسٍ أصلًا']
    ];
    cases.forEach(([ms, want, msg]) => { if (q(ms) !== want) issues.push({ sev:'خطأ', msg: msg }); });

    /* المهلةُ تتبع نوعَ السؤال: ومسألةُ تحدٍّ بمهلةِ مهارةٍ مفردةٍ تُحوّل
       التفكيرَ إلى عجلةٍ — وهي عكسُ المقصود */
    if (C.goalOf({ deep:true }) !== C.T_DEEP)
      issues.push({ sev:'خطأ', msg:'مسألةُ التحدّي تُقاس بمهلةٍ غيرِ T_DEEP' });
    if (C.goalOf({ reason:true }) !== C.T_REASON || C.goalOf({}) !== C.T_SKILL)
      issues.push({ sev:'خطأ', msg:'مهلةُ الاستدلالِ أو المهارةِ المفردةِ اختلطت' });

    /* الجلسةُ ثمانيةٌ دائمًا: الرفعُ يُثقِلها ولا يُطيلها */
    const items = C.buildSession(C.DEFAULT_WEAK, [], [], 4);
    const nd = items.filter(x => x.deep).length, nr = items.filter(x => x.reason).length;
    if (items.length !== 8) issues.push({ sev:'خطأ', msg:'الجلسةُ بعد الرفعِ ' + items.length + ' أسئلة لا ٨' });
    if (nd !== 4) issues.push({ sev:'خطأ', msg:'طُلبت ٤ مسائلِ تحدٍّ فجاءت ' + nd });
    if (nr !== 2) issues.push({ sev:'خطأ', msg:'المسائلُ المركّبةُ بعد الرفعِ ' + nr + ' لا ٢' });
    const base = C.buildSession(C.DEFAULT_WEAK, [], [], 0);
    if (base.filter(x => x.deep).length !== 0)
      issues.push({ sev:'خطأ', msg:'مسائلُ تحدٍّ تُدَسُّ في جلسةٍ حصّتُها صفر' });
    if (base.length !== 8)
      issues.push({ sev:'خطأ', msg:'الجلسةُ العاديّةُ ' + base.length + ' أسئلة لا ٨' });

    /* السقفُ يُقرأ من جلساتِ هذه الصفحةِ وحدَها، والصفوفُ الجزئيّةُ تُطوى
       في pid — وإلّا حُسبت الجلسةُ الواحدةُ جلستين فانفتحت الطبقةُ باكرًا */
    const T = C.THINK_TEST;
    const ms = C.mastery([
      { meta:{ test:T, correct:4, total:5, msAvg:6, pid:'p1' } },
      { meta:{ test:T, correct:8, total:8, msAvg:5, pid:'p1' } },
      { meta:{ test:'قدرات كمي', correct:2, total:8, msAvg:40, pid:'z' } },
      { meta:{ test:T, correct:3, total:3, msAvg:4, pid:'p2' } }
    ]);
    if (ms.n !== 1) issues.push({ sev:'خطأ', msg:'حسابُ السقف يَعُدُّ الصفَّ الجزئيَّ جلسةً مستقلّة (n=' + ms.n + ')' });
    if (ms.pct !== 100) issues.push({ sev:'خطأ', msg:'حسابُ السقف يأخذ الصفَّ الناقصَ بدل الأكمل (pct=' + ms.pct + ')' });
  } catch (e){
    issues.push({ sev:'خطأ', msg:'تعذّر فحصُ بوّابةِ طبقةِ التحدّي: ' + e.message });
  }

  const nDeep = G.DEEP ? Object.keys(G.DEEP).length : 0;
  return { issues, gens: Object.keys(G.REMEDY).length + Object.keys(G.REASON).length + nDeep, samples,
           skills: Object.keys(G.REMEDY).length, reason: Object.keys(G.REASON).length, deep: nDeep };
}

module.exports = run;
if (require.main === module){
  const r = run();
  console.log('مولّدات: ' + r.gens + ' (مهارات ' + (r.skills||0) + ' · استدلال ' + (r.reason||0) +
              ' · تحدٍّ ' + (r.deep||0) + ') · عيّنات: ' + r.samples);
  r.issues.forEach(i => console.log('  ' + (i.sev === 'خطأ' ? '❌' : '⚠️ ') + ' ' + i.msg));
  if (!r.issues.length) console.log('  ✅ كل المولّدات سليمة');
}
