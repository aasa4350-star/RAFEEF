/* ============================================================
   فحصٌ بنيويّ لكلّ صفحات الموقع — لا يخصّ مادّةً بعينها.

   ما يمسكه:
     ١. خطأ صياغة في أيّ كتلة <script> (تُفشل الصفحة كلّها بلا أثرٍ ظاهر).
     ٢. مولّد سؤالٍ يرجع شكلًا خاطئًا: عدد خيارات ≠ ٣، أو خيارات مكرّرة،
        أو فهرس صحيحٍ خارج المدى، أو نصّ/تفسير فارغ.
     ٣. «الخيار المقطوع»: خيارٌ من حرفٍ واحد — علامة خطأ [..][0] الذي
        يُسطّح مصفوفةً إلى نصّ فتُعرض حروفه فرادى (وقع مرّتين فعلًا).
     ٤. مولّد لا يعمل أصلًا (يرمي في كلّ محاولة).
     ٥. سعةٌ منخفضة: مولّدٌ لا ينتج إلا أسئلةً قليلة، فيحفظها الطفل.

   لماذا vm لا متصفّح: هذا الفحص يجب أن يعمل في أيّ جلسةٍ ولو بلا
   Chromium. والفحص البصريّ يبقى يدويًّا عند تغيير التصميم.
   ============================================================ */
const fs = require('fs'), path = require('path'), vm = require('vm')
/* crypto العامّ في Node هو WebCrypto ولا createHash فيه — فيُطلَب الوحدة */
const nodeCrypto = require('crypto');
const EXTRACT = require('../tools/lib-extract.js');
const RULES = require('../tools/lib-rules.js');
const ROOT = path.join(__dirname, '..');

const LOW_CAPACITY = 12;      /* أقلّ من هذا يُعدّ قابلًا للحفظ */
/* صفحاتٌ عددُ خياراتها مقصودٌ ثابت — انظر موضعَ استعمالِها أدناه */
const EXPECT_OPTS = { 'english.html': 3, 'english5.html': 3, 'english8.html': 3, 'english9.html': 3 };
const TRIALS = 900;

function scripts(html){
  const inline = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
  const srcs = [...html.matchAll(/<script[^>]*\bsrc=["']([^"']+)["']/gi)].map(m => m[1].split('?')[0]);
  return { inline, srcs };
}

function makeCtx(){
  const noop = () => {};
  /* عنصرٌ وهميّ يبتلع أيّ استدعاء: الصفحات تلمس style.setProperty
     و classList و dataset وغيرها، ولا يعنينا منها شيء في هذا الفحص. */
  const anything = new Proxy({}, { get:(t,k)=> (typeof k === 'string' ? noop : undefined), set:()=>true });
  const el = new Proxy({ style:anything, dataset:{}, classList:anything, children:[], childNodes:[] },
    { get:(t,k) => (k in t ? t[k] : (typeof k === 'string' ? noop : undefined)), set:()=>true });
  const ctx = {
    window:{}, document:{
      getElementById:()=>el, querySelector:()=>el, querySelectorAll:()=>[],
      createElement:()=>el, addEventListener:noop, body:el, documentElement:el,
      readyState:'complete', title:''
    },
    navigator:{ platform:'', userAgent:'' },
    localStorage:{ getItem:()=>null, setItem:noop, removeItem:noop },
    location:{ search:'?who=hasan', href:'' },
    fetch:()=>new Promise(()=>{}), setTimeout:noop, setInterval:noop, clearTimeout:noop,
    console:{ log:noop, warn:noop, error:noop }, AQ:{ post:noop, flush:noop, pending:()=>0 },
    URLSearchParams, JSON, Math, Date, encodeURIComponent, decodeURIComponent,
    atob:s=>Buffer.from(s,'base64').toString('binary'),
    btoa:s=>Buffer.from(s,'binary').toString('base64'),
    crypto:{ subtle:{ digest:()=>new Promise(()=>{}) } },
    speechSynthesis:{ speak:noop, cancel:noop, getVoices:()=>[] },
    SpeechSynthesisUtterance:function(){}, Promise, Array, Object, String, Number, RegExp, Error
  };
  ctx.globalThis = ctx;
  /* window أليافُ العالميّ نفسِه لا نسخةٌ منه: الصفحاتُ تكتب
     window.APP_CONFIG = {...} في config.js ثمّ تقرأ APP_CONFIG مجرّدةً
     في كتلتها. فلو كانت window نسخةً منفصلةً لم يُعرَّف المتغيّرُ
     العالميّ، فتسقط الكتلةُ كلُّها بصمتٍ ولم يُفحص مولّدٌ واحد. */
  ctx.window = ctx;
  return vm.createContext(ctx);
}

const strip = s => String(s).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

/* «الخيار المقطوع» يستهدف خطأً بعينه: [..][0] يُسطّح مصفوفةً إلى نصّ
   فيُعرض حرفًا حرفًا («O» ثمّ «n»). فالعلامة الدالّة هي حرفٌ لاتينيّ
   مفردٌ لا رقمٌ مفرد («9» جوابٌ مشروع) ولا رمزٌ («⭐» خيارٌ مشروع)،
   واستثناء a و A و I لأنّها كلماتٌ إنجليزية قائمة بذاتها. */
const chopped = o => /^[B-HJ-Zb-hj-z]$/.test(strip(o));

/* بعض المولّدات خياراتها رسومٌ لا نصّ (كانجرو: كسورٌ ومرايا وطيّ ورق)،
   فتجريدها من الوسوم يُفرغها كلّها. عندئذٍ نقارن النصّ الخام. */
const optKey = o => { const t = strip(o); return t || String(o); };

/* ═══ تعارض الإجابات بين الصفحات ══════════════════════════════

   سأل الأب (٢٦ أغسطس ٢٠٢٦): «حسن يقول إنّ كلمة بخيل لها أكثر من
   معنًى بالإنجليزي، هل هو صادق؟» — وكان صادقًا، وكان قد وقع على
   تناقضٍ في الموقع نفسه:

       quiz.html      «The opposite of generous is:»  →  mean
       practice.html  «The opposite of generous is:»  →  stingy

   السؤال نفسه بجوابين. فالطفل يحفظ أحدهما فيُخطَّأ في الصفحة
   الأخرى، ولا يدري أيّهما الصواب — وكلاهما صواب في الحقيقة.

   وهذا الفحص لم يكن يمسكه لأنّه كان يفحص المولّدات وحدها، وهذه
   أسئلةٌ ثابتة مكتوبة في مصفوفات. فصار يجمعها من كلّ الصفحات
   ويقارن نصّ الجواب الصحيح عند تطابق نصّ السؤال.

   تكرار السؤال بالجواب نفسه لا يُنبَّه عليه — فهو تكرارٌ لا تناقض.
   ═══════════════════════════════════════════════════════════ */
const stemKey = s => strip(s)
  .replace(/^(vocabulary|grammar|reading|writing|listening)\s*:\s*/i, '')
  .replace(/[.:؟?!،,]+\s*$/, '')
  .replace(/[«»"'']/g, '"')
  .toLowerCase();

/* نجمع كلّ ما شكله [نصّ، [خيارات]، رقم] مهما كان عمق تعشيشه.
   ونمرّ بالكائنات كما نمرّ بالمصفوفات: بنك quiz.html كائنٌ
   ‎{ en:[…], ma:[…] }‎ فلو اقتصرنا على المصفوفات فاتنا كلّه. */
function harvest(v, out, depth){
  if (depth > 6 || v == null || typeof v !== 'object') return;
  if (Array.isArray(v)){
    if (typeof v[0] === 'string' && Array.isArray(v[1]) && typeof v[2] === 'number'
        && v[2] >= 0 && v[2] < v[1].length && v[1].every(x => typeof x === 'string')){
      out.push({ stem: v[0], answer: v[1][v[2]] });
      return;
    }
    for (const x of v) harvest(x, out, depth + 1);
    return;
  }
  for (const k of Object.keys(v)){
    let x; try { x = v[k]; } catch(e){ continue; }
    harvest(x, out, depth + 1);
  }
}

/* شرطُ الاقتباس — وهو ضبطٌ لزِمَ ولا يُلغى بلا سبب:

   بلا هذا الشرط يمتلئ التقرير بـ«تعارضاتٍ» ليست بتعارض: «ما الفكرة
   الرئيسة؟» تُسأل عن عشرات القطع فلكلٍّ جوابها، و«Which one is a
   fruit?» تُطرح بخياراتٍ مختلفة كلّ مرّة، و«Choose the correct
   sentence:» كذلك. هذه قوالبُ لا أسئلةٌ بعينها.

   أمّا السؤال الذي يسمّي هدفه بين علامتَي اقتباس — ‎The opposite of
   "generous"‎ — فهو سؤالٌ واحدٌ حيثما ورد، وجوابه يجب أن يكون واحدًا.
   فبهذا الشرط بقي التعارض الحقيقيّ وحده. */
const TARGETED = /["«][^"»]{2,}["»]/;

function conflicts(banks){
  const map = {};
  banks.forEach(({ file, stem, answer }) => {
    const k = stemKey(stem);
    if (k.length < 12) return;              /* نصٌّ قصير يتشابه بلا معنًى */
    if (!TARGETED.test(strip(stem))) return;
    const a = strip(answer).toLowerCase();
    (map[k] = map[k] || []).push({ file, a, stem, answer });
  });
  const out = [];
  Object.values(map).forEach(list => {
    const answers = [...new Set(list.map(x => x.a))];
    if (answers.length < 2) return;         /* تكرارٌ لا تناقض */
    const where = [...new Set(list.map(x => x.file))];
    /* تنبيهٌ لا خطأ: قد يكون الجوابان صحيحين معًا (large وhuge كلاهما
       مرادفٌ لـ big)، وقد لا يكون في أيّ سؤالٍ منهما لبسٌ لأنّ خيارات
       كلٍّ تخلو من جواب الآخر. فالحكم هنا للأب لا للأداة — ولكنّه
       يستحقّ النظر: الطفل يحفظ أحد الجوابين ثمّ يرى الآخر فيظنّ
       أحدهما غلطًا، وهو ما وقع في «بخيل» فسأل عنه. */
    out.push({ sev:'تنبيه', file: where.join(' / '),
      msg: 'جوابان مختلفان لسؤالٍ واحد — «' + strip(list[0].stem).slice(0, 60) + '» → ' +
           [...new Set(list.map(x => strip(x.answer)))].join(' / ') });
  });
  return out;
}

/* موادّ فوق صفّ الطالب: تُحفظ نتائجها موسومةً preview فتُعرض للأب
   في قسمٍ مستقلّ، ولا تدخل متوسّطًا ولا تشخيصًا (RR.isPreview) */
/* وmath7.html معها وإن لم تكن «فوق الصفّ»: هي منهجُ أوّلِ متوسّطٍ
   ورفيفُ في الثاني، فمراجعةُ العامِ الماضي تُعرَض ولا تُحتسب — والعلّةُ
   واحدةٌ وإن اختلفت الجهة: درجةٌ من غيرِ منهجِها الجاري تحرّك متوسّطَه. */
const PREVIEW_PAGES = ['chem10.html', 'bio10.html', 'phys10.html', 'math7.html'];

function run(){
  const issues = [];
  const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.html')).sort();
  let genCount = 0, pageCount = 0;
  const allBanks = [];

  for (const f of files){
    const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
    const { inline, srcs } = scripts(html);

    /* ١) الصياغة — الأهمّ: خطأ هنا يُعطّل الصفحة كلّها */
    let broken = false;
    inline.forEach((src, i) => {
      try { new vm.Script(src, { filename: f + ' [script #' + (i+1) + ']' }); }
      catch(e){ issues.push({ sev:'خطأ', file:f, msg:'خطأ صياغة في كتلة #'+(i+1)+': '+e.message }); broken = true; }
    });
    if (broken) continue;

    /* ١ب) المواد فوق الصفّ: تُحفَظ موسومةً بـ preview.
       كان الحفظ مقطوعًا منها (٧ سبتمبر ٢٠٢٦) لئلّا تدخل التقييم، ثمّ
       طلب الأب (١٤ سبتمبر) أن يرى نتائجها في صفحته دون أن تُحتسب.
       فصار الوسم هو الحارس بدل القطع، ويُفحص هنا أمران:
         أ) أنّها تحفظ فعلًا — وإلّا رجع الأب لا يرى شيئًا.
         ب) أنّ كلّ ما تحفظه موسومٌ preview:true — فلو سقط الوسم يومًا
            دخلت مادّةُ أوّل ثانوي متوسّطَ طالب ثالث متوسّط وخفضته
            بما ليس من صفّه، ولا يدري الأب لِمَ انخفض. */
    if (PREVIEW_PAGES.indexOf(f) > -1) {
      const body = inline.join('\n');
      if (!/AQ\.post\s*\(|fetch\s*\(\s*SUPA_URL|sendBeacon\s*\(/.test(body))
        issues.push({ sev:'خطأ', file:f, msg:'مادّةٌ فوق الصفّ لا تحفظ نتائجها — طلب الأب أن تظهر له في صفحته' });
      /* الوسمُ يُكتب على صورتين منذ أن صارت الصفحاتُ تدمج «مهارات» في
         الميتا: كائنٌ داخل الجسم (meta:{…}) أو متغيّرٌ يُبنى ثمّ يُسنَد
         (var meta = {…} … meta:meta). وكان الفحص يعرف الأولى وحدها،
         فلمّا تحوّلت الصفحات الثلاث إلى الثانية رأى الوسمَ غائبًا وهو
         مكتوبٌ في سطره — ثلاثةُ أخطاءٍ كاذبةٍ تُعمي عن خطأٍ صادق. */
      const metas = (body.match(/meta\s*:\s*\{[^}]*\}/g) || [])
        .concat(body.match(/\bmeta\s*=\s*\{[^}]*\}/g) || []);
      const unmarked = metas.filter(m => !/preview\s*:\s*true/.test(m));
      if (!metas.length || unmarked.length)
        issues.push({ sev:'خطأ', file:f, msg:'مادّةٌ فوق الصفّ تحفظ صفًّا بلا وسم preview:true — سيدخل التقييم ويخفض المستوى بما ليس من الصفّ' });
    }

    /* ٢) تحميل الصفحة في بيئةٍ معزولة ثمّ فحص مولّداتها */
    const ctx = makeCtx();
    for (const s of srcs){
      const p = path.join(ROOT, s);
      if (fs.existsSync(p)) { try { vm.runInContext(fs.readFileSync(p,'utf8'), ctx); } catch(e){} }
    }
    for (const src of inline){ try { vm.runInContext(src, ctx); } catch(e){} }
    /* أخطاء التشغيل هنا متوقّعة (لا DOM حقيقيّ) — يعنينا الصياغة والمولّدات */
    pageCount++;

    /* بنوك الأسئلة الثابتة في هذه الصفحة — للمقارنة بين الصفحات لاحقًا.
       نأخذ الأسماء من المصدر لا من مفاتيح البيئة، لأنّ ما أُعلن بـ const
       أو let لا يصير خاصّيةً على الكائن العامّ فلا تراه Object.keys —
       وبنك quiz.html منها، فكان يفوت كلّه. وتقييم الاسم داخل البيئة
       نفسها يبلغ الارتباط المعجميّ. */
    const declared = new Set([...inline.join('\n')
      .matchAll(/\b(?:var|let|const)\s+([A-Za-z_$][\w$]*)\s*=\s*[[{]/g)].map(m => m[1]));
    for (const k of declared){
      let v; try { v = vm.runInContext(k, ctx); } catch(e){ continue; }
      if (!v || typeof v !== 'object') continue;
      const found = [];
      try { harvest(v, found, 0); } catch(e){ continue; }
      found.forEach(q => allBanks.push({ file:f, stem:q.stem, answer:q.answer }));
    }

    /* مولّدات الصفحة: كلّ ما جُمع في مصفوفات الاختبار داخلها.
       نجمع الدوالّ نفسها لا أسماءها — فبعض الصفحات (كـ english9.html)
       تبني مولّداتها بمصانع (clozeGen/vocabGen/…) تُرجع دالّةً مجهولة
       الاسم (function(){...})، فـ.name عليها سلسلةٌ فارغة، وكانت تُستبعد
       صامتةً بـ.filter(Boolean) فيفوتها الفحص كلّه دون أثر. */
    let fns = [];
    for (const arr of ['ALLU','ALLU2','ALLU3','ALLU4','SKILLS','GENS','ALL']){
      try {
        const v = vm.runInContext(arr, ctx);
        if (Array.isArray(v)) fns = fns.concat(v.filter(x => typeof x === 'function'));
      } catch(e){}
    }
    /* وإلّا فكلّ دالّةٍ اسمها على نمط مولّد (لا مفرّ من الاسم هنا: لا مصفوفة نجمعها منها) */
    if (!fns.length){
      const decl = [...new Set([...inline.join('\n').matchAll(/\bfunction\s+((?:g|u\d|ex|m|e)[A-Z0-9]\w*)\s*\(/g)].map(m => m[1]))];
      for (const n of decl){ try { const fn = vm.runInContext(n, ctx); if (typeof fn === 'function') fns.push(fn); } catch(e){} }
    }
    fns = [...new Set(fns)]; // دالّةٌ واحدة قد تتكرّر عبر أكثر من مصفوفة (نادرًا) أو عبر الفرعين معًا

    let anonIdx = 0;
    for (const fn of fns){
      genCount++;
      let n = fn.name;
      if (!n){
        /* عيّنة أولى لاشتقاق اسمٍ مفهوم من مفتاح q[4] ("u10pp:...")
           بدل رقمٍ مجرّد لا يدلّ صاحب البلاغ على المولّد المقصود. */
        anonIdx++;
        n = '(مجهول #' + anonIdx + ')';
        try {
          const q0 = fn();
          if (Array.isArray(q0) && typeof q0[4] === 'string' && q0[4].includes(':'))
            n = q0[4].split(':')[0];
        } catch(e){}
      }

      const seen = new Set();
      let ran = 0, firstBad = null, nOpts = null;
      const args = fn.length > 0 ? [1,2,3,4] : [undefined];
      for (let i = 0; i < TRIALS; i++){
        let q; try { q = fn(args[i % args.length]); } catch(e){ continue; }
        if (!Array.isArray(q)) continue;
        ran++;
        const opts = q[1];
        if (!Array.isArray(opts) || opts.length < 2)
          firstBad = firstBad || 'عدد الخيارات ' + (Array.isArray(opts) ? opts.length : 'ليس مصفوفة');
        /* ═══ عددُ الخياراتِ المنتظَرُ في هذي الصفحة ═══════════════════
           الثباتُ وحدَه لا يكفي: كان يُقاس على أوّلِ توليدة، فمن أعطى
           خيارَين دائمًا مرّ — وخياران قرعةٌ لا سؤال، يُصيبها الطفلُ
           نصفَ المرّاتِ بلا معرفة. (ظهر في مولّدِ was/were لوحدةِ
           الترحيبِ عند قياسِ الحارسِ بالتخريب، فنجا منه.)

           ولا يصحّ حدٌّ عامٌّ بثلاثة: في math7.html أسئلةٌ ثنائيّةٌ
           بطبيعتها (أيُّهما أكبر؟ · هل تشكّلان تناسبًا؟) فخياران فيها
           هو الصواب. فالعددُ المنتظَرُ يُنَصُّ للصفحةِ التي تقصده،
           وما لم يُنَصَّ له يُكتفى فيه بالثبات. */
        else if (EXPECT_OPTS[f] && opts.length !== EXPECT_OPTS[f])
          firstBad = firstBad || 'الخيارات ' + opts.length + ' والمنتظَرُ في هذي الصفحة ' + EXPECT_OPTS[f];
        /* عدد الخيارات يُشتقّ من أوّل توليدة لا يُفترض:
           الصفحات تستعمل ٣ خيارات، وكانجرو ٤. الخطأ أن يتذبذب داخل المولّد. */
        else if (nOpts === null && (nOpts = opts.length) && false) {}
        else if (opts.length !== nOpts)
          firstBad = firstBad || 'عدد الخيارات يتذبذب: ' + nOpts + ' ثمّ ' + opts.length;
        else if (new Set(opts.map(optKey)).size !== opts.length)
          firstBad = firstBad || 'خيارات مكرّرة: [' + opts.map(strip).join(' | ') + ']';
        else if (opts.some(chopped))
          firstBad = firstBad || 'خيارٌ مقطوع: [' + opts.map(strip).join(' | ') + ']';
        else if (!(q[2] >= 0 && q[2] < opts.length))
          firstBad = firstBad || 'فهرس الصواب خارج المدى: ' + q[2] + ' من ' + opts.length;
        else if (!strip(q[0]) || !strip(q[3]))
          firstBad = firstBad || 'نصّ السؤال أو التفسير فارغ';
        /* ═══ المعادلة تُكتب بالمتغيّر أوّلًا ═══════════════════════════
           بلاغ حسن (١٢ سبتمبر ٢٠٢٦): «طريقة كتابة السؤال غلط… المتغيّر
           ضروري يكون الأوّل». وكتابُه لا يعرض المعادلة إلّا هكذا
           (ص ٢٧: ١١س − ٤ = ٢٩)، وعكسُها يُضيف على الطفل خطوةً لم تُشرح
           له — وأضاع عليه إشارةَ السالب فأجاب ١١ بدل −١١. */
        else if (/حُلَّ?\s*المعادلة\s*:\s*[−-]?\d+(?:[.,]\d+)?\s*=/.test(strip(q[0])))
          firstBad = firstBad || 'المعادلة مكتوبةٌ بالثابت أوّلًا — والكتاب يكتب المتغيّر أوّلًا: ' + strip(q[0]).slice(0, 60);
        if (firstBad) break;
        seen.add(strip(q[0]) + '‖' + opts.map(optKey).join('¦'));
      }

      if (firstBad) issues.push({ sev:'خطأ', file:f, msg:n + ' — ' + firstBad });
      else if (!ran)  issues.push({ sev:'خطأ', file:f, msg:n + ' — لا يعمل: يرمي في كلّ محاولة' });
      else if (seen.size <= LOW_CAPACITY)
        issues.push({ sev:'تنبيه', file:f, msg:n + ' — سعةٌ منخفضة: ' + seen.size + ' سؤالًا مختلفًا فقط' });
    }
  }

  issues.push(...skillLabels());
  issues.push(...typedPath());
  issues.push(...remedialPath());
  issues.push(...mawhibaPath());
  issues.push(...grammarPath());
  issues.push(...vocabReviewPath());
  issues.push(...listenPath());
  issues.push(...fragmentPath());
  issues.push(...pacePath());
  issues.push(...clickExclusion());
  issues.push(...paceCurriculum());
  issues.push(...ytPath());
  issues.push(...engVideoPath());
  issues.push(...bookStudyPath());
  issues.push(...rulesPdfPath());
  issues.push(...dosePath());
  issues.push(...math7Link());
  issues.push(...mawhiba3BookPath());
  issues.push(...mawhibaMechGens());
  issues.push(...muthPath());
  issues.push(...mawhibaTimed());
  issues.push(...localNoWrite());
  issues.push(...islamic5Path());
  issues.push(...lughati8Path());
  issues.push(...readingScore());
  issues.push(...studyCardPath());
  issues.push(...fatriPartialSave());
  issues.push(...retiredPath());
  issues.push(...subjFoldPath());
  issues.push(...myErrPath());
  issues.push(...tryTracePath());
  issues.push(...sectionClockPath());
  issues.push(...sentencesPath());
  issues.push(...readingPoolPath());
  issues.push(...readAloudPath());
  issues.push(...verbalBankPath());
  issues.push(...quantDosePath());
  issues.push(...writingPath());
  issues.push(...vocabOwnPath());
  issues.push(...vocabEn4Path());
  issues.push(...micLevelPath());
  issues.push(...lughati9UnitsPath());
  issues.push(...typedAnswers());
  issues.push(...bankAnswerIndex());
  issues.push(...conflicts(allBanks));

  return { issues, pageCount, genCount, fileCount: files.length, bankCount: allBanks.length };
}

/* كلُّ مولّدٍ في رياضيات ثالث متوسط له وصفٌ عربيٌّ في GEN_AR — وإلّا
   ظهر في تشخيص الأب باسمه البرمجيّ (gConsecOdd) لا بوصفه. الخريطة
   تُولَّد بـ tools/gen-skill-labels.js، وهذا يمسك مَن نسي أن يُعيد
   توليدها بعد إضافة مولّدٍ جديد. */

/* ═══ لوحةُ المفاتيح كانت تُملي الجواب ═══════════════════════════════
   بلاغ الأب (٢٩ سبتمبر ٢٠٢٦) بصورةٍ من حفظ الكلمات: الكلمة «أخ»،
   والطفل كتب «Bro»، فعرض عليه آيفون في شريط التوقّع «Brother» —
   فيضغطها ويُحسب له أنّه يعرفها. ومثلُه في الإملاء: التصحيحُ التلقائيّ
   يصلح ما كتبه فيضيع المقصودُ من التمرين كلِّه.

   فكلُّ حقلٍ يكتب فيه الطفل جوابًا يلزمه إطفاءُ التصحيح والتوقّع:
     autocorrect="off" · spellcheck="false" · autocapitalize="off"
   وهذا الفحص يمسك من أضاف حقلًا جديدًا ونسيها — فالعطبُ صامتٌ: الحقلُ
   يعمل، والدرجةُ ترتفع، ولا يظهر شيء. */

/* ═══ الجوابُ المعلَّم هو جوابُ البنك نفسُه ═══════════════════════════
   بنوكُ الأسئلة الثابتة صيغتُها [سؤال، [الصحيح، مشتّت، مشتّت]، شرح]،
   وbankGen يخلط الخيارات ثمّ يُعلّم موضعَ الصحيح بعد الخلط. فلو أخطأ
   الخلطُ أو الفهرس مرّةً واحدة صُحّح الخطأُ للطفل وخُطّئ الصواب — وهو
   أسوأُ ما يقع في موقعٍ تعليميّ، ولا يظهر في أيّ فحصٍ آخر: الصفحةُ
   تعمل، والدرجةُ تُحفظ، والطفلُ وحده يعرف أنّ شيئًا غلط.

   سأل الأب (٢٩ سبتمبر) عن سؤال «المتغيّر المستقلّ على أيّ محور؟» في
   علوم رفيف، وظنّه خطأً لأنّ «المحور الرأسيّ» ظهر أوّلَ الخيارات —
   والخياراتُ تُخلط في كلّ عرض، فأوّلُها ليس جوابَها. فكان الجوابُ
   سليمًا، وهذا الفحصُ يُبقيه كذلك. */
function bankAnswerIndex(){
  const out = [];
  const SAMPLES = 400;
  fs.readdirSync(ROOT).filter(f => /\.html$/.test(f)).forEach(f => {
    const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
    if (!/bankGen\s*\(/.test(html)) return;
    const ctx = makeCtx();
    const { inline, srcs } = scripts(html);
    for (const s of srcs){
      const p = path.join(ROOT, s);
      if (fs.existsSync(p)) { try { vm.runInContext(fs.readFileSync(p,'utf8'), ctx); } catch(e){} }
    }
    for (const src of inline){ try { vm.runInContext(src, ctx); } catch(e){} }
    let checked = 0;
    const stemKey = t => String(t).replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();
    for (const key of Object.keys(ctx)){
      let arr; try { arr = ctx[key]; } catch(e){ continue; }
      if (!Array.isArray(arr) || typeof arr[0] !== 'function') continue;
      for (const fn of arr){
        if (typeof fn !== 'function') continue;
        /* اسمُ البنك: من وسم bankGen الجديد، وإلّا من اسم مصفوفة
           المولّدات بحذف G الأخيرة (DEFG ← DEF) — فالصفحاتُ القديمة
           تستعمل bankGen بوسيطٍ واحدٍ بلا وسم. */
        let bankName = (typeof fn.__bank === 'string' && fn.__bank) ? fn.__bank
                     : (/G$/.test(key) ? key.slice(0, -1) : null);
        if (!bankName) continue;
        let bank; try { bank = ctx[bankName]; } catch(e){ continue; }
        if (!Array.isArray(bank) || !Array.isArray(bank[0])) continue;
        /* خريطةُ السؤال ← جوابه الصحيح، فتصحّ المطابقة بلا فهرس */
        const byStem = {};
        bank.forEach(b => { if (Array.isArray(b) && Array.isArray(b[1])) byStem[stemKey(b[0])] = b[1][0]; });
        checked++;
        for (let i = 0; i < SAMPLES; i++){
          let q; try { q = fn(); } catch(e){ continue; }
          if (!q || !Array.isArray(q[1])) continue;
          const idx = +String(q.__bk || '').split('#')[1];
          let want = (bank[idx] && Array.isArray(bank[idx][1])) ? bank[idx][1][0] : undefined;
          if (want === undefined) want = byStem[stemKey(q[0])];
          if (want === undefined) continue;
          if (q[1][q[2]] !== want){
            out.push({ sev:'خطأ', file:f,
              msg:'الجوابُ المعلَّم يخالف بنكَ ' + bankName + ' — معلَّم «' +
                  String(q[1][q[2]]).slice(0,40) + '» والصواب «' + String(want).slice(0,40) + '»' });
            i = SAMPLES;
          }
        }
      }
    }
    if (!checked) out.push({ sev:'تنبيه', file:f, msg:'فيها bankGen ولم يُفحص منها مولّدٌ واحد — تغيّر شكلُ التعريف؟' });
  });
  return out;
}

/* ═══ مسارُ «اكتب الجواب» في صفحات المنهج ══════════════════════════
   طلبُ الأب (١ أكتوبر ٢٠٢٦): «ما تصير اختياريةً كلّها». والمسارُ أربعُ
   وصلاتٍ في كلّ صفحة: تحميلُ typed.js، واختيارُ المواضع، ورسمُ الحقل،
   وربطُ التصحيح. وسقوطُ واحدةٍ منها يُعيد الصفحةَ اختيارًا كلَّها من
   غير أن يُخطئ شيء — فيُمتحن الأبناء بالتخمين ولا نعلم. */
const TYPED_PAGES = ['math4.html', 'math5.html', 'math8.html', 'math9.html',
                     'english.html', 'english5.html', 'english8.html', 'english9.html'];

function typedPath(){
  const out = [];
  if (!fs.existsSync(path.join(ROOT, 'typed.js')))
    return [{ sev:'خطأ', file:'typed.js', msg:'ملفُّ «اكتب الجواب» غير موجود' }];
  TYPED_PAGES.forEach(f => {
    const p = path.join(ROOT, f);
    if (!fs.existsSync(p)){ out.push({ sev:'خطأ', file:f, msg:'صفحةٌ مفقودة' }); return; }
    const src = fs.readFileSync(p, 'utf8');
    const miss = [];
    if (!/<script src="typed\.js/.test(src))      miss.push('تحميل typed.js');
    if (!/TYPED\.pick\(/.test(src))               miss.push('اختيار المواضع (TYPED.pick)');
    if (!/TYPED\.inputHtml\(/.test(src))          miss.push('رسم الحقل (TYPED.inputHtml)');
    if (!/TYPED\.wire\(/.test(src))               miss.push('ربط التصحيح (TYPED.wire)');
    if (!/qEl\.dataset\.typed/.test(src))         miss.push('تمييز السؤال المكتوب');
    if (miss.length)
      out.push({ sev:'خطأ', file:f, msg:'مسارُ «اكتب الجواب» ناقص — ينقصه: ' + miss.join('، ') });
  });
  /* ═══ اتّجاهُ حقلِ الرياضيات ═══════════════════════════════════════
     بلاغ الأب (٤ أكتوبر ٢٠٢٦): رفيف كتبت «−10/7» فحُسبت خطأً. والعلّةُ
     أنّ الحقلَ كان يرث اتّجاهَ الصفحة (من اليمين)، فالسالبُ المكتوبُ
     أوّلًا يُعرض آخرًا، فمن كتبه كما يراه خزّنه «10/7-».
     وهو عطلٌ لا يُرى في الكود: الحقلُ يعمل والجوابُ يُقرأ، والخطأُ في
     ترتيب حرفٍ واحد — ولا يظهر إلّا على طفلٍ أجاب صوابًا فحُسب عليه. */
  try {
    const tj = fs.readFileSync(path.join(ROOT, 'typed.js'), 'utf8');
    const ctx = { window:{} }; ctx.window = ctx;
    vm.createContext(ctx); vm.runInContext(tj, ctx);
    const T = ctx.TYPED;
    /* الفحصُ على وسم <input> نفسِه لا على كلّ المخرَج: فيه dir="ltr"
       في سطر المثال أيضًا، فالنمطُ العامُّ يمرّ وإن سقط عن الحقل. */
    const tag = (T.inputHtml('math').match(/<input\b[^>]*>/) || [''])[0];
    if (!/dir="ltr"/.test(tag))
      out.push({ sev:'خطأ', file:'typed.js', msg:'حقلُ الرياضيات ليس ltr — السالبُ سينقلب على الطفل' });
    if (!T.ok('10/7-', '−10/7', 'math'))
      out.push({ sev:'خطأ', file:'typed.js', msg:'سالبٌ في آخر المكتوب يُحسب خطأً — وهو جوابٌ صحيح' });
    if (T.ok('10/7', '−10/7', 'math'))
      out.push({ sev:'خطأ', file:'typed.js', msg:'الموجبُ يُقبل مكانَ السالب — التسامحُ تجاوز حدَّه' });
  } catch (e){
    out.push({ sev:'خطأ', file:'typed.js', msg:'تعذّر فحصُ حقل الكتابة: ' + e.message });
  }
  return out;
}

/* ═══ القسمُ العلاجيُّ في practice.html ════════════════════════════
   علّةُ ٣ أكتوبر ٢٠٢٦: كان يسحب آخرَ أربعين صفًّا بلا فرز، فامتلأت
   عند فهد بالنطقِ والمحادثةِ فلم يبقَ فيها صفٌّ واحدٌ فيه مهارات —
   وبقي شهرًا يُقال له «لسّا ما فيه بيانات» وعنده صفرٌ في الاشتقاق.
   وعطلٌ كهذا لا يُرى: الصفحةُ تُفتح والقسمُ يظهر ورسالتُه معقولة.
   فيُحرَس بثلاثة: فرزُ الخادم، والمثالُ المحلول، ومطابقةُ مفاتيحه. */
function remedialPath(){
  const out = [], f = 'practice.html';
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) return out;
  const src = fs.readFileSync(p, 'utf8');
  if (!/meta->skills=not\.is\.null/.test(src))
    out.push({ sev:'خطأ', file:f,
      msg:'نداءُ القسم العلاجيّ بلا فرزِ المهارات — سيمتلئ بالنطق والمحادثة فيعمى عن الاختبارات' });
  const wm = /var WORKED = \{[\s\S]*?\n\};/.exec(src);
  if (!wm){ out.push({ sev:'خطأ', file:f, msg:'الأمثلةُ المحلولة (WORKED) غير موجودة' }); return out; }
  if (!/workedHtml\(s\)/.test(src))
    out.push({ sev:'خطأ', file:f, msg:'الأمثلةُ المحلولة موجودةٌ ولا تُعرض — بطاقةُ الدرس لا تنادي workedHtml' });
  /* المفتاحُ اسمُ المهارة حرفًا بحرف؛ وحرفٌ واحدٌ يزيغ يُخفي المثالَ بلا خطأ */
  let W = {};
  try { W = (new vm.Script('(' + wm[0].replace(/^var WORKED = /, '') .replace(/;$/, '') + ')')).runInNewContext({}); }
  catch (e){ out.push({ sev:'خطأ', file:f, msg:'تعذّرت قراءةُ WORKED: ' + e.message }); return out; }
  const keys = new Set();
  for (const m of src.matchAll(/keys:\s*\[\s*key\s*\]/g)) void m;   /* تُبنى في وقت التشغيل */
  for (const m of src.matchAll(/"(Grammar — [^"]+)"/g)) keys.add(m[1]);
  for (const sub of ['tahsili-math.js']){
    const sp = path.join(ROOT, sub);
    if (!fs.existsSync(sp)) continue;
    const ssrc = fs.readFileSync(sp, 'utf8');
    for (const m of ssrc.matchAll(/^L\("[^"]+","([^"]+)"/gm)) keys.add('رياضيات — ' + m[1]);
  }
  /* ═══ المطابقةُ تقبل «مادّة — موضوع» ═══════════════════════════════
     عَمِيَ هذا القسمُ مرّتين بسببَين مختلفَين: أوّلًا في السحب (٣ أكتوبر
     ٢٠٢٦)، ثمّ في المطابقة — صارت البنوكُ تَسِم السؤالَ بـ«رياضيات —
     الدوال العكسية» ومفتاحُ الدرسِ «رياضيات»، فرجع كلُّ قياسٍ صفرًا
     وعُرضت «لسّا ما فيه بيانات كافية» وفي يدِه ستٌّ وسبعون مهارة.
     وكلاهما صامتٌ: الصفحةُ تعمل وتطمئنُّه. فيُفحَص الاثنان هنا. */
  if (!/nm\.split\(" — "\)\[0\]/.test(src))
    out.push({ sev:'خطأ', file:f,
      msg:'المطابقةُ لا تقبل أسماءَ «مادّة — موضوع» — سيرجع القياسُ صفرًا ويُقال له «لا بيانات كافية» وهو ضعيف' });
  /* والمواضيعُ تُعرَض بأسمائِها، وإلّا عُرضت ثلاثةُ دروسٍ بالنسبةِ نفسِها
     ولم يعرف أيَّها يفتح */
  if (!/أضعف مواضيعك بالاسم/.test(src))
    out.push({ sev:'تنبيه', file:f,
      msg:'لا تُعرَض المواضيعُ الضعيفةُ بأسمائِها — الدِلاءُ الخشنةُ لا تقول له أين يبدأ' });
  /* ولا تُقال رسالةُ الاطمئنانِ فوق قائمةِ ضعفٍ تناقضها */
  if (/else if\(inLevelData \|\| named\.length\)/.test(src))
    out.push({ sev:'خطأ', file:f,
      msg:'«ما عندك مهارة تحت ٥٠٪» تُعرَض وتحتها مواضيعُ ضعفٍ بأسمائِها — تناقضٌ في شاشةٍ واحدة' });
  if (!/\} else if\(named\.length\)\{/.test(src))
    out.push({ sev:'خطأ', file:f,
      msg:'لا فرعَ لمن ضعفُه معروفٌ بالاسمِ ولا بطاقةَ له — سيُقال له «لا بيانات» أو «ما عندك ضعف» وكلاهما كذب' });

  const orphan = Object.keys(W).filter(k => !keys.has(k));
  if (orphan.length)
    out.push({ sev:'خطأ', file:f, msg: orphan.length + ' مثالًا محلولًا بلا مهارةٍ تطابقه (فلن يظهر): ' +
      orphan.slice(0,3).join('، ') + (orphan.length>3 ? ' …' : '') });
  /* أثرُ العمل في العلاجيّ: يُحفظ في practice.html ويُعرض في التقريرين.
     وانقطاعُ أيّ وصلةٍ منها يُسقط القياسَ بلا أن يُخطئ شيءٌ ظاهر —
     وهو القياسُ الذي نعرف به: أفتَح الدرسَ ولم ينفعه، أم لم يفتحه؟ */
  if (!/function saveRemedial\(/.test(src) || !/saveRemedial\(_skill/.test(src))
    out.push({ sev:'خطأ', file:f, msg:'جولاتُ القسم العلاجيّ لا تُحفظ — لا نعرف أعمل الطالبُ عليها أم لا' });
  for (const rf of ['home.html', 'child.html']){
    const rp = path.join(ROOT, rf);
    if (!fs.existsSync(rp)) continue;
    if (!/sect\s*===\s*"rem"/.test(fs.readFileSync(rp, 'utf8')))
      out.push({ sev:'خطأ', file:rf, msg:'جولاتُ العلاجيّ تُحفظ ولا تُعرض — بطاقةُ «القسم العلاجي» مفقودة' });
  }
  return out;
}

/* ═══ مقياسُ موهبة — المستوى الثالث ════════════════════════════════
   بُني لحسنٍ (٣ أكتوبر ٢٠٢٦) حين سأل الأب عن تسجيله في موهبة. وثلاثةُ
   أشياءٍ تنقطع بصمت: أن يُحمَّل البنك، وأن يظهر التبويبُ لمن هو في
   المستوى الثالث، وأن يطابق اسمُ المجال مفتاحَه في القسم العلاجيّ —
   فحرفٌ يزيغ يقطع الضعفَ عن علاجه. ويُشغَّل البنكُ فعلًا هنا، فسؤالٌ
   بثلاثة خياراتٍ أو بخيارين متطابقين لا يُرى إلّا بالتشغيل. */
/* ═══ مسارُ القواعدِ المركَّزة ✏️ ═══════════════════════════════════
   القسمُ يقوم على خمسِ وصلاتٍ متتابعة، وانقطاعُ أيٍّ منها يُفرغه بلا
   أن يُخطئ شيءٌ ظاهر: التبويبُ، وبناؤه عند الضغط، والطابورُ من
   meta.wrong مطابَقًا على البنك، وإعادةُ المخطوءِ آخرَ الطابور،
   وحفظُ ما صُحِّح ثمّ عرضُه في التقريرين.

   ودرسٌ تعلّمتُه مرّتين في هذا المستودع: حارسٌ لم يُختبَر سقوطُه لا
   يُوثَق به — فكلُّ بندٍ هنا جُرِّب بكسرِه أوّلًا والتأكّدِ من صياحه. */
/* ═══ مسارُ مراجعةِ الكلمات 🔁 ═══════════════════════════════════════
   بلاغُ حسن (٥ أكتوبر ٢٠٢٦): «ثلاثون كلمةً فقط تتكرّر عليّ نفسُها».
   وقِستُه بالمتصفّح على حالته الفعليّة (٣٧ مسترجَعةً من ٤٦٠) فصحّ:
   ٢٣ ثمّ ٢٣ ثمّ ٣٠ من ثلاثين مكرّرةً من الجلسة السابقة.

   وله سببان، ولكلٍّ حارسُه هنا:
   ١) بركةُ المراجعةِ لا تضمّ إلّا ما استُرجع صحيحًا، فإن ضاقت عن حجم
      الجلسةِ لزم التكرارُ لزومًا رياضيًّا. فالعتبةُ يجب أن تُقاس بحجم
      الجلسةِ لا برقمٍ ثابت.
   ٢) ذاكرةُ التكرارِ في الجهازِ وحدَه والعدّادُ في الخادم، فإن فرغت
      الذاكرةُ لأيّ سببٍ بقي العدّادُ ٤٦٠ وصارت البركةُ أصفارًا.
      فلا بدّ من نسخةٍ في الخادمِ تُدمَج عند الفتح. */
/* ═══ مسارُ فهمِ المسموع 🎧 ═══════════════════════════════════════════
   خُمسُ درجةِ ستيب، وحسنٌ تدرّب عليه مرّةً واحدةً في عمرِه. وقيمةُ
   القسمِ كلُّها في ثلاثةِ قيود: ألّا يظهر النصُّ قبل الإجابة (وإلّا
   صار قراءةً)، وألّا يُسمَع أكثرَ من مرّتين، وألّا تُفتح الأسئلةُ
   قبل الاستماع. فإن سقط قيدٌ منها بقي القسمُ ظاهرًا وهو لا يقيس شيئًا. */
/* ═══ القُصاصةُ لا تصير جلسةً ═══════════════════════════════════════
   بلاغُ الأب (٥ أكتوبر ٢٠٢٦): «تطلع لي ٢ من ٤ وهو جايب ٨ من ١٠»،
   و«سعود حلّ ٣ دروس وما طلع إلا درسان».

   وكانا بلاغَين عن علّتَين في الحفظِ نفسِه:
   ١) من بدأ درسًا وأجاب بعضَه ثمّ انتقل إلى غيره حُفظت له قُصاصةٌ،
      فإذا رجع أُعيد بناءُ الدرسِ بمعرِّفٍ جديدٍ — فصار عملُه جلستَين
      وبقيت القُصاصةُ تُعرَض بجانبِ جولتِه الكاملة. فالمعرِّفُ يبقى ما
      دامت الجولةُ لم تكتمل، وقواعدُ العرضِ تُبقي الأكمل.
   ٢) الحفظُ الجزئيُّ كان لا يقع دون ثلاثِ إجابات، فدرسٌ أجاب فيه
      سؤالَين لا يُسجَّل أصلًا — فيعدّه أبوه درسًا وهو غائبٌ عن التقرير. */
/* ═══ النقرُ لا يُحسَب حلًّا ═══════════════════════════════════════
   تقريرُ فهدٍ (٥ أكتوبر ٢٠٢٦): تسعُ جلساتٍ ومئةٌ وثمانيةُ أسئلةٍ في
   ستِّ دقائق — ثلاثُ ثوانٍ للسؤال، وأسئلةُ التحصيليِّ أربعةُ خيارات
   فحظُّ التخمينِ ٢٥٪ ودرجتُه ٣٢٪. وقياسُ تاريخِه كلِّه: جلساتُ النقرِ
   ٣٤٪ وجلساتُ الحلِّ ٤٨٪.

   والعلّةُ أنّ صفحةَ التحصيليِّ وستيب لم تكن تقيس زمنًا أصلًا، بينما
   صفحاتُ المنهجِ تقيسه وتستبعد المتسرّعة. فالمتوسّطُ المعروضُ للأب
   خليطٌ من جلساتٍ حُلّت وجلساتٍ مُرَّ عليها.

   وثلاثُ وصلاتٍ لا تنفع واحدةٌ منها وحدَها: القياسُ في الصفحة،
   والوسمُ في الصفّ، والفصلُ في التقريرَين. */
/* ═══ معلّمُ التحصيليِّ باسمِه ═══════════════════════════════════════
   طلبُ فهدٍ (٧ أكتوبر ٢٠٢٦): «حط ناصر العبدالكريم ٢٠٢٦» في مقاطعِ
   التحصيليّ. والبحثُ العامُّ يُخرج عشراتِ المقاطعِ من سنواتٍ ومستوياتٍ
   مختلفة، فيضيع وقتُه في الاختيارِ قبل أن يبدأ.

   وحدُّه أن يُقيَّد بالتحصيليِّ وحدَه: قواعدُ ستيبَ لها معلّمُها،
   وتقييدُها به خطأٌ يُخفي ما ينفعها. */
function ytPath(){
  const out = [], f = 'practice.html';
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) return out;
  const src = fs.readFileSync(p, 'utf8');
  if (!/var YT_TAHSILI = "ناصر العبدالكريم 2026";/.test(src))
    out.push({ sev:'خطأ', file:f, msg:'اسمُ معلّمِ التحصيليِّ غيرُ مثبَّت — يرجع البحثُ عامًّا كما كان' });
  if (!/s\.group === "تحصيلي"/.test(src) || !/\(YT_TAHSILI \+ " " \+ s\.yt\)/.test(src))
    out.push({ sev:'خطأ', file:f, msg:'اسمُ المعلّمِ لا يُضاف للتحصيليِّ وحدَه — إمّا لا يُضاف أو يُضاف لستيبَ كذلك' });
  if (/YT_TAHSILI \+ " " \+ s\.yt\s*\)\s*:\s*\(YT_TAHSILI/.test(src))
    out.push({ sev:'خطأ', file:f, msg:'اسمُ معلّمِ التحصيليِّ أُضيف لغيرِ التحصيليّ' });
  /* ورابطُ بحثٍ لا معرّفُ فيديو — فالمقطعُ يُحذف فينكسر الزرُّ صامتًا */
  if (/youtube\.com\/watch\?v=/.test(src))
    out.push({ sev:'تنبيه', file:f, msg:'رابطُ فيديو بمعرّفٍ ثابت — يُحذف المقطعُ فينكسر الزرُّ صامتًا' });
  return out;
}
/* ═══ الاستبعادُ بسرعةِ النقرِ لفهدٍ وحدَه ══════════════════════════════
   طلبُ الأب (٧ أكتوبر ٢٠٢٦) بصورةِ شاشة: حسنٌ أصاب ثلاثةَ عشرَ من ثلاثةَ
   عشرَ في معاني الكلماتِ فوُسمت جلستُه «غيرَ محتسبة» لأنّه أجاب سريعًا —
   وهو يعرف الكلماتِ فعلًا. فقال: «شِلّ الخاصّية هذي منهم كلّهم ما عدا فهد».

   فحُصرت في practice.html بـPACE_ON (وفهدٌ وحدَه)، وبقيت في عشرين صفحةً
   أخرى تحسبها بنفسها — فجلسةٌ سريعةٌ صحيحةٌ تُحفظ ثمّ تُسقَط من المعدَّلِ
   في صفحةِ الأب، ولا يظهر في الصفحةِ سببٌ ولا تنقص درجةٌ ظاهرة.

   والاستبعادُ بالخروجِ لتطبيقٍ آخرَ (exits) شيءٌ آخرُ لم يطلب رفعَه،
   فيبقى. والمقصودُ هنا شرطُ السرعةِ وحدَه. */
function clickExclusion(){
  const out = [];
  for (const f of fs.readdirSync(ROOT).filter(x => x.endsWith('.html'))){
    if (f === 'practice.html') continue;      /* فهدٌ وحدَه، ويحرسه pacePath */
    const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
    /* ═══ ولِمَ لا تُستثنى math9 وenglish9 وفيهما حارسٌ الآن ════════════
       طلبُ الأب (٩ أكتوبر ٢٠٢٦): «حطّ له نفس فهد في الرياضيات
       والإنجليزي». فصار لحسنٍ حارسٌ في هاتين الصفحتَين — ولكنّه في
       pace.js، فلا تحمل الصفحتان شرطًا بسرعةٍ في نصِّهما. وهذا مقصود:
       القاعدةُ مكتوبةٌ مرّةً واحدةً فيُقرأ شرطُها ويُحرَس في موضعٍ واحد
       (paceCurriculum)، ويبقى هذا الحارسُ مانعًا أن تُكتب في صفحةٍ
       شرطًا مبثوثًا يُفلت منه. */
    for (const m of src.matchAll(/trusted\s*:\s*([^,\n]*)/g)){
      const cond = m[1].trim();
      /* بلا \b: الشرطُ يُكتب «__fastN» والشرطةُ السفليّةُ حرفُ كلمةٍ،
         فلا حدَّ بينها وبين fast — ولو بقي الحدُّ لمرَّ عشرون موضعًا بصمت.
         (وهذا الحارسُ نفسُه مرَّ صامتًا أوّلَ مرّةٍ لهذا السبب، فكُشف
          بكسرِه عمدًا لا بقراءتِه.) */
      if (/fast/i.test(cond))
        out.push({ sev:'خطأ', file:f, msg:'عاد الاستبعادُ بسرعةِ النقر — والأبُ رفعه عن الجميعِ إلّا فهد: ' +
                   'trusted: ' + cond.slice(0, 70) });
    }
  }
  return out;
}

/* ═══ حارسُ التأنّي في صفحاتِ المنهج — pace.js ════════════════════════
   طلبُ الأب (٩ أكتوبر ٢٠٢٦) بعد تقريرِ حسنٍ في الرياضيات: «حطّ له نفس
   فهد في مادة الرياضيات والإنجليزي».

   وفي هذا الحارسِ أمرٌ مرفوعٌ صريحًا: الأبُ في ٧ أكتوبر رأى حسنًا يُستبعَد
   وقد أصاب ١٣ من ١٣ فقال «شِلّ الخاصّية منهم كلّهم ما عدا فهد». فلو عاد
   الشرطُ سرعةً مجرّدةً لعاد عينُ ما رفضه — وقِيس: ٤٩ من جلساتِ حسنٍ
   الممتازةِ الأربعِ والثمانين تسقط بها. فالشرطُ شرطان: سرعةٌ ودرجةٌ معًا.

   وثلاثةٌ تنكسر هنا بلا صوت:
   ١) يسقط شرطُ الدرجةِ فيعود الحكمُ على السرعةِ وحدَها — والصفحةُ تعمل.
   ٢) يُزاد ابنٌ في ON فيقع عليه حارسٌ لم يُقَس على مادّتِه.
   ٣) تُستدعى PACE.stamp في صفحةٍ لا تحمّل pace.js، أو يبقى في الصفحةِ
      بانيُ ميتا لم يُوسَم — فجلسةٌ تمرّ بلا فحصٍ ولا يظهر شيء. */
function paceCurriculum(){
  const out = [], f = 'pace.js';
  const E = (file, m) => out.push({ sev:'خطأ', file:file, msg:m });
  const p = path.join(ROOT, f);
  /* الصفحاتُ التي يسري فيها الحارس. ومن حمّله ولم يَسِم، أو وسم ولم
     يحمّله — كلاهما عطبٌ صامت. */
  const PAGES = ['math9.html', 'english9.html', 'english5.html'];
  if (!fs.existsSync(p)){
    for (const g of PAGES){
      const gp = path.join(ROOT, g);
      if (fs.existsSync(gp) && /PACE\.(stamp|box)\(/.test(fs.readFileSync(gp, 'utf8')))
        E(g, 'تستدعي PACE وملفُّ pace.js غيرُ موجود — كلُّ جلسةٍ تمرّ بلا فحص');
    }
    return out;
  }
  const src = fs.readFileSync(p, 'utf8');

  if (!/var FAST_SEC\s*=\s*\d+/.test(src) || !/var FAST_ONE\s*=\s*\d+/.test(src))
    E(f, 'عتبتا السرعة غير معرّفتَين — لا يُعرف النقرُ من الحلّ');
  /* ═══ شرطُ الدرجةِ هو الفرقُ بين هذا الحارسِ وما رفضه الأب ═════════ */
  const mp = /var MIN_PCT\s*=\s*(\d+)/.exec(src);
  if (!mp) E(f, 'شرطُ الدرجةِ ساقط — فعاد الحكمُ على السرعةِ وحدَها، وهو ما رفضه الأبُ في ٧ أكتوبر');
  if (!/var weak\s*=.*correct\s*\/\s*total.*MIN_PCT/.test(src))
    E(f, 'weak لا تُحسب من الدرجة — فلا شرطَ درجةٍ فعليًّا مهما كانت MIN_PCT');
  if (!/if\(quick && weak\)/.test(src))
    E(f, 'الاستبعادُ لا يشترط الاثنَين معًا — فجلسةٌ سريعةٌ صحيحةٌ تُشطَب، وهي شكوى الأب «١٣/١٣ ما تُحسب لك»');
  /* وأنّ لا طريقَ ثانيًا إلى trusted:false غيرَ ذلك الشرطِ المزدوج */
  const falses = (src.match(/trusted\s*:\s*false/g) || []).length;
  if (falses !== 1)
    E(f, 'مواضعُ trusted:false ' + falses + ' لا واحد — فثَمّ طريقٌ إلى الاستبعادِ لا يمرّ بشرطِ الدرجة');

  /* ═══ ومن يسري عليه ═══════════════════════════════════════════════
     فهدٌ ليس هنا: حارسُه في practice.html بـPACE_ON، ومادّتُه تحصيليٌّ
     بسبعين ثانيةً للسؤال فعتبتُه تُقاس عليه. ومن زِيد هنا وجب أن يُقاس
     أثرُ القاعدةِ على جلساتِه أوّلًا — فالزيادةُ بلا قياسٍ هي ما وقع في
     ٦ أكتوبر وسقط على رفيفَ وحسنٍ في «لفظي». */
  const on = /var ON\s*=\s*\{([^}]*)\}/.exec(src);
  if (!on) E(f, 'قائمةُ ON غيرُ موجودة — فالحارسُ على الجميعِ أو على لا أحد');
  else {
    /* ═══ من قِيس عليه الحارسُ قبل زيادتِه ══════════════════════════
       الزيادةُ بلا قياسٍ هي ما وقع في ٦ أكتوبر، فلا يُزاد اسمٌ هنا حتّى
       يُقاس أثرُ القاعدةِ على جلساتِ صاحبِه ويُكتَب القياسُ في pace.js.
         hasan — ٩ أكتوبر: تُستبعَد ٣٣ من ١٦٣، ومن الممتازةِ صفر
         osama — ١٥ أكتوبر: تُستبعَد ٤٥٢ من ١١٦٣، ومن الممتازةِ صفر من ٤٢٣
       والخطُّ الأحمرُ واحدٌ في الاثنَين: لا تسقط جلسةٌ ممتازة. */
    const MEASURED = ['hasan', 'osama'];
    const kids = on[1].split(',').map(s => s.split(':')[0].trim().replace(/['"]/g, '')).filter(Boolean);
    const extra = kids.filter(k => !MEASURED.includes(k));
    if (extra.length)
      E(f, 'زِيد في الحارسِ من لم يُقَس عليه: ' + extra.join('، ') +
           ' — والأبُ قال في ٧ أكتوبر «شِلّ الخاصّية منهم كلّهم ما عدا فهد»، ولا يُزاد أحدٌ حتّى يُقاس أثرُها على جلساتِه ويُكتَب القياسُ في pace.js');
    for (const k of MEASURED)
      if (!kids.includes(k))
        E(f, k + ' خارجَ الحارسِ وقد قِيس عليه وأُدخل — فإخراجُه يُعيد جلساتِ النقرِ إلى المعدَّل');
    /* والقياسُ نفسُه يجب أن يبقى مكتوبًا: لو حُذف بقي الاسمُ بلا حجّة */
    if (kids.includes('osama') && !/صفر من ٤٢٣/.test(src))
      E(f, 'أسامةُ في الحارسِ وقياسُه ممحوٌّ من الملفّ — فلا يُعرَف على أيِّ أساسٍ أُدخل');
  }
  if (!/if\(!this\.on\(who\)\)/.test(src)) E(f, 'stamp لا تحترم قائمةَ ON — ستسِم كلَّ ابن');
  /* ⚠️ كان الفحصُ /!this\.on\(who\)/ مجرّدًا، فيطابقه شرطُ stamp نفسُه —
     فرُفع الشرطُ من box ومرَّ بصمت. فالعدُّ موضعان لا موضع: واحدٌ في
     stamp وواحدٌ في box. (وهذه سابعُ مرّةٍ يُكشف فيها حارسٌ غيرُ محدودٍ
     في هذا الملفّ، ولم يُكشف إلّا بكسرِه عمدًا.) */
  if ((src.match(/!this\.on\(who\)/g) || []).length < 2)
    E(f, 'box لا تحترم قائمةَ ON — سيُنبَّه من لا حارسَ عليه');

  /* ═══ ويُقال للطفلِ في وجهِه ═══════════════════════════════════════
     لو استُبعدت جلستُه بصمتٍ لظنّ أنّه يعمل ويتقدّم شهرًا. والقوسان في
     \[data-pace\] لازمان: بلاهما يطابق data-paceX بعد الكسرِ فلا يصيح،
     وهي رابعُ مرّةٍ يقع هذا في هذا الملفّ.

     ويُفحَص الوسمُ موضعَين: حيث يُكتب (setAttribute) وحيث يُقرأ
     (querySelector). فلو خولف بينهما لم يجد الصندوقُ نفسَه فبُني في
     كلّ جولةٍ من جديد، أو لم يُبنَ أصلًا — ولا يصيح فحصُ القراءةِ وحدَه. */
  if (!/\[data-pace\]/.test(src) || !/setAttribute\("data-pace"/.test(src) ||
      !/ما تُحسب لك/.test(src))
    out.push({ sev:'تنبيه', file:f, msg:'الاستبعادُ يقع بصمتٍ — الطفلُ لا يعرف أنّ جولتَه سقطت' });
  if (!/سريع وصحيح/.test(src))
    out.push({ sev:'تنبيه', file:f, msg:'السريعُ الصحيحُ لا يُقال له إنّها حُسبت — فيظنّ السرعةَ تهمةً في ذاتها' });

  /* ═══ والصفحتان ═══════════════════════════════════════════════════ */
  for (const g of PAGES){
    const gp = path.join(ROOT, g);
    if (!fs.existsSync(gp)) continue;
    const gs = fs.readFileSync(gp, 'utf8');
    const loads = /<script src="pace\.js/.test(gs);
    const stamps = (gs.match(/PACE\.stamp\(/g) || []).length;
    if (!loads && stamps) E(g, 'تسِم بـPACE ولا تحمّل pace.js — كلُّ جلسةٍ تمرّ بلا فحص');
    if (loads && !stamps) E(g, 'تحمّل pace.js ولا تسِم به — الحارسُ محمولٌ ولا يعمل');
    if (!loads && !stamps)
      E(g, 'حارسُ التأنّي غائبٌ عن هذه الصفحة وقد طلبه الأبُ في ٩ أكتوبر');
    /* وكلُّ بانيِ ميتا يمرّ عليه. وبقاءُ trusted:true حرفيًّا يعني
       بانيًا أُغفل — وهو ما وقع في فتريِّ math9 من قبل فبقي شهرًا. */
    const lit = (gs.match(/trusted\s*:\s*true/g) || []).length;
    if (lit) E(g, 'فيها ' + lit + ' بانيَ ميتا يوسم trusted:true حرفيًّا ولا يمرّ على الحارس');
    const builders = (gs.match(/function _*meta\(/g) || []).length;
    if (builders && stamps < builders)
      E(g, 'بُناةُ الميتا ' + builders + ' والوسمُ في ' + stamps + ' منها — فجلسةٌ تُحفظ بلا فحص');
    /* ═══ ولِمَ صار هذا خطأً لا تنبيهًا (١٥ أكتوبر) ═══════════════════
       كان تنبيهًا، فكُسر الصندوقُ عمدًا في تجربةِ تحويرٍ فمرّ بلا صياح.
       وهو ليس زينة: صفحةُ أسامةَ يسقط منها ٩٢٪ من محاولاتِ فتريِّه،
       فلو سقطت صامتةً ظنّ شهرًا أنّه يعمل ويتقدّم — وهو عينُ ما حذّر
       منه هذا الملفُّ نفسُه في أعلاه. ومن بنى القفلَ على الحكمِ فقد
       بناه على صندوقٍ يراه الطفل. */
    if (!/PACE\.box\(/.test(gs))
      E(g, 'لا تنبيهَ على الشاشة — الطفلُ لا يعرف أنّ جولتَه سقطت فيظنّ أنّه يتقدّم');
    /* والعدُّ على الأسئلةِ لا على الدرجات: لو قُسِم الزمنُ على الدرجاتِ
       في صفحةٍ درجتُها ضعفُ سؤالِها (كما math4) تضاعفت العتبةُ ضمنًا. */
    if (/FATRI_MARK/.test(gs) && /PACE\.stamp\([^)]*FATRI_TOTAL/.test(gs))
      E(g, 'الزمنُ يُقسَم على الدرجاتِ لا على الأسئلة — فالعتبةُ تتضاعف بلا قصد');
  }

  /* ═══ والفتريُّ الذي يسكن ملفًّا خارجَ صفحتِه ═══════════════════════
     فتريُّ أسامةَ في fatri-en5.js لا في english5.html، وكان الفحصُ
     ينظر في الصفحاتِ وحدَها — فمرّت فيه ٢٠٣ محاولاتٍ بلا وسمِ ثقةٍ ولا
     عدِّ نقراتٍ ولا تفصيلِ بنود، ولا صاح شيء. وهو أكثرُ سطحٍ في الموقعِ
     إعادةً، فغيابُ الحارسِ عنه أخطرُ من غيابِه عن صفحة. */
  const EXT = ['fatri-en5.js'];
  for (const xf of EXT){
    const xp = path.join(ROOT, xf);
    if (!fs.existsSync(xp)) continue;
    const xs = fs.readFileSync(xp, 'utf8');
    if (!/PACE\.stamp\(/.test(xs))
      E(xf, 'فتريٌّ يُحفَظ بلا وسمِ تأنٍّ — فجلسةُ النقرِ تدخل المعدَّل كأنّها حلّ');
    if (!/PACE\.box\(/.test(xs))
      E(xf, 'لا تنبيهَ على الشاشة — الطفلُ لا يعرف أنّ جولتَه سقطت فيظنّ أنّه يتقدّم');
    if (/trusted\s*:\s*true/.test(xs))
      E(xf, 'وسمُ ثقةٍ ثابتٌ لا يمرّ على الحارس');
    /* والعدُّ على الأسئلةِ لا على الدرجات — كما في الصفحات */
    if (/PACE\.stamp\([^)]*\bTOTAL\b/.test(xs))
      E(xf, 'الزمنُ يُقسَم على الدرجاتِ لا على عددِ الأسئلة — فالعتبةُ تتضاعف بلا قصد');
    /* وعدُّ النقراتِ السريعةِ لا يُحسَب إن لم يُقَس الفارقُ بين نقرتَين */
    if (!/lastTs/.test(xs) || !/fastN\+\+/.test(xs))
      E(xf, 'النقراتُ السريعةُ لا تُعَدّ — فشرطُ «أكثرُ من نصفِ الأسئلةِ دون ثلاثِ ثوانٍ» معطَّل');
  }

  /* ═══ وأثرُه حيث ينظر الأبُ: «تقرير المنهج الدراسي» ═══════════════
     الاستبعادُ بلا أثرٍ في الصفحةِ التي يقرؤها الأبُ لا معنى له. وكانت
     بطاقةُ الدرسِ تعرض أحدثَ جلسةٍ مطلقًا، فيُعيد الفتريَّ نقرًا فتُستبعَد
     من حساب المهارات ويبقى رقمُها هو المعروض. فيُفحَص في الصفحاتِ
     الثلاث: أنّ المعروضَ يُختار بـRR.curKeep، وأنّ المتوسّطَ من
     المحتسَبِ وحدَه، وأنّ المستبعَدةَ تُوسَم لا تُطوى. */
  if (!/curKeep:\s*function/.test(fs.readFileSync(path.join(ROOT, 'report-rules.js'), 'utf8')))
    E('report-rules.js', 'RR.curKeep غيرُ معرَّفة — فكلُّ صفحةٍ تختار جلسةَ الدرسِ بقاعدتِها');
  for (const rf of ['home.html', 'child.html', 'index.html']){
    const rp = path.join(ROOT, rf);
    if (!fs.existsSync(rp)) continue;
    const rs = fs.readFileSync(rp, 'utf8');
    if (!/تقرير المنهج الدراسي/.test(rs)) continue;
    if (!/RR\.curKeep\(currMap\[t\], p\)/.test(rs))
      E(rf, 'بطاقةُ الدرسِ تعرض أحدثَ جلسةٍ ولو كانت مستبعَدة — فالاستبعادُ بلا أثرٍ حيث ينظر الأب');
    if (/if\(!currMap\[t\]\) currMap\[t\]=p;/.test(rs))
      E(rf, 'بقي الاختيارُ القديمُ (أحدثُ جلسةٍ مطلقًا) جنبًا إلى جنبٍ مع الجديد');
    if (!/okArr\s*=\s*arr\.filter/.test(rs))
      E(rf, 'متوسّطُ المادّةِ يضمّ الجلساتِ المستبعَدة — الرقمُ الذي يقرؤه الأبُ غيرُ صادق');
    /* ⚠️ كان الفحصُ /🚫 غير محتسبة/ مجرّدًا فطابقه وسمُ جلساتِ الكلماتِ
       القديمُ في الصفحةِ نفسِها، فرُفع الوسمُ من بطاقةِ الدرسِ ومرَّ
       بصمت. فالنصُّ المفحوصُ هو سببُ الاستبعادِ وحدَه، ولا يَرِد إلّا
       في الموضعِ المقصود. */
    if (!/حلّ سريع ودرجة منخفضة/.test(rs))
      out.push({ sev:'تنبيه', file:rf, msg:'الجلسةُ المستبعَدةُ لا تُوسَم في بطاقةِ الدرس — يختفي سببُ نزولِ الرقم' });
  }
  return out;
}

/* ═══ شرحُ درسِ الإنجليزيِّ يسمّي الدرسَ والصفّ ══════════════════════
   بلاغُ الأب (٨ أكتوبر ٢٠٢٦): «درس أسامة في الإنجليزي Job Paths — الشرح
   اللي أنت حاطّه من اليوتيوب يختلف عن الدرس».

   وكان نصُّ البحثِ قاعدةً نحويّةً مجرّدةً بلا صفٍّ ولا اسمِ وحدة، فيردُّ
   يوتيوب دروسَ قواعدَ عامّةً لأعمارٍ أخرى. والعطبُ صامتٌ تمامًا: الزرُّ
   يعمل، والصفحةُ تفتح، ولا يكشفه إلّا أن يجلس الطفلُ ليشاهد.

   وظهر معه عيبٌ ثانٍ: الصفحةُ تبني الاستعلامَ في موضعين — زرِّ الوحدةِ
   وبطاقةِ الضعف — وكان أحدهما يزيد كلمةَ «انجليزي» والآخرُ لا. فالدرسُ
   الواحدُ له بحثان مختلفان بحسب الزرِّ المضغوط.

   فهذا الحارسُ يفحص خمسةً: أنّ لكلّ درسٍ نصَّ بحثٍ غيرَ فارغ، وأنّه يحمل
   صفَّ صاحبِه، وأنّ النصوصَ لا تتكرّر (فلا يُرسَل الولدُ إلى شرحِ درسٍ
   ليس درسَه)، وأنّ الاستعلامَ يُبنى بصورةٍ واحدةٍ في المواضع كلِّها،
   وأنّه بحثٌ لا معرّفُ فيديو (الفيديو يُحذف فينكسر الزرُّ صامتًا). */
/* ═══ مادّةُ الكتابِ وشريطُ احفظ·ثبّت·جمل وملفّاتُ الطباعة ═══════════
   طلبُ الأب (٨ و٩ أكتوبر ٢٠٢٦): «في كلّ درس حطّ حفظ كلماته وجمله وتثبيت
   وتمارين»، ثمّ «نفسه لحسن من كتابه»، ثمّ «ملف PDF للكلمات والجمل».

   وثلاثةُ أشياءَ تنكسر هنا بلا صوت:

   ١) وحدةٌ في الكتابِ لا درسَ لها في الصفحة (أو العكس): الشريطُ لا يُركَّب
      فيبقى الدرسُ أسئلةً بلا حفظٍ ولا تثبيت، ولا يظهر خطأ.
   ٢) معنًى عربيٌّ فيه نصٌّ لاتينيّ: يُعرَض خيارًا في «ثبّت» فيلتبس على
      الطفلِ ويدلُّه على الجواب. وقع في ستَّ عشرةَ مدخلةٍ عند أوّلِ بناء.
   ٣) تعديلُ ملفِّ الكتابِ بلا إعادةِ توليدِ الـPDF: الورقةُ في يدِ الطفلِ
      أسابيعَ، فيحفظ منها ما ليس في الشاشة. ولذلك تُحفَظ بصمةُ المصدرِ في
      pdf/manifest.json ساعةَ التوليد، وتُقارَن هنا. */
/* ═══ فتريُّ الإنجليزيِّ لأسامة — على نموذجِ ورقةِ المعلّم ═══════════
   أرسل الأبُ (٩ أكتوبر ٢٠٢٦) ملفَّ المعلّمِ وقال: «حطّ نفس النموذج هذا».
   والورقةُ ستّةُ أقسامٍ بدرجاتٍ معلومةٍ مجموعُها عشرون:

     General questions 4 · Controlled Writing 1 · Reading short sentence 4
     Grammar 4 · Vocabulary 5 · Orthography 2

   و«النموذج» هو هذه الأقسامُ بأوزانِها — فلو تغيّر وزنُ قسمٍ أو سقط قسمٌ
   لم يعد الاختبارُ نموذجَ معلّمِه، ولا يظهر ذلك في الصفحة: تبقى عشرون
   بندًا وتبقى الدرجةُ عشرين. فيُقرأ الجدولُ من الملفِّ ويُقارن بالورقة. */
function bookStudyPath(){
  const out = [];
  const SPEC = [
    { book:'book-en4.js', global:'BOOK_EN4', tag:'en4', page:'english.html' },
    { book:'book-en9.js', global:'BOOK_EN9', tag:'en9', page:'english9.html' },
    /* طلبُ الأب (١٨ أكتوبر ٢٠٢٦): «نفس سعود وحسن» لأسامة ورفيف */
    { book:'book-en5.js', global:'BOOK_EN5', tag:'en5', page:'english5.html' },
    { book:'book-en8.js', global:'BOOK_EN8', tag:'en8', page:'english8.html' }
  ];
  /* ── قاعدةُ «ما هو جملة» مكتوبةٌ أربعَ مرّات ──
     في study-en4.js (الشاشة) وsentences.html (الجمل) وtools/gen-book-pdf.js
     (الورق) وفي هذا الحارس. وقد تفرّقت فعلًا: كانت العتبةُ ثلاثًا في
     الأربعة ثمّ صارت كلمتين، ولو تُرِك واحدٌ لطبع الورقُ غيرَ ما تعرضه
     الشاشةُ بلا أثرٍ ظاهر. فتُقرأ النسخُ وتُقارَن نصًّا. */
  {
    /* تُقابَل بالسلوكِ لا بالنصّ: تُنتزَع الدالّةُ من كلِّ ملفٍّ وتُشغَّل على
       عيّناتٍ تمثّل كلَّ حالةٍ فرّقت النسخَ يومًا. فاختلافُ الصياغةِ مسموح،
       واختلافُ الحكمِ لا. */
    const PROBE = [
      ["What's wrong?",                          true,  'جملةٌ من كلمتين'],
      ["Don't laugh.",                           true,  'أمرٌ من كلمتين'],
      ["He plays football every Saturday.",      true,  'جملةٌ تامّة'],
      ["How often…?",                            false, 'قالبٌ بنقاطٍ — مفردة'],
      ["Can you / he / she / they …?",           false, 'قالبٌ بشَرطةٍ مائلة — مفردة'],
      ["Do they visit? — Yes, they do. / No.",   true,  'سؤالٌ وجوابُه — جملة'],
      ["origami",                                false, 'كلمةٌ بلا خاتمة'],
      ["Hello.",                                 false, 'كلمةٌ واحدةٌ بخاتمة']
    ];
    const RULE = [
      ['study-en4.js',          'study-en4.js'],
      ['sentences.html',        'sentences.html'],
      ['tools/gen-book-pdf.js', path.join('tools','gen-book-pdf.js')],
    ];
    for (const [nm, rel] of RULE){
      const fp = path.join(ROOT, rel);
      if (!fs.existsSync(fp)){ out.push({ sev:'خطأ', file:nm, msg:'مفقود' }); continue; }
      const t = fs.readFileSync(fp, 'utf8');
      const m = /function isSentence\(e\)\{([\s\S]*?)\n\s*\}/.exec(t);
      if (!m){ out.push({ sev:'خطأ', file:nm, msg:'قاعدةُ «ما هو جملة» لا تُنتزَع — فلا تُقابَل بالنسخِ الأخرى' }); continue; }
      let fn;
      try {
        const sb = {}; vm.createContext(sb);
        vm.runInContext('function words(s){ return String(s).trim().split(/\\s+/).filter(Boolean); }\n' +
                        'f = function(e){' + m[1] + '\n};', sb);
        fn = sb.f;
      } catch(e){ out.push({ sev:'خطأ', file:nm, msg:'قاعدةُ الجملةِ لا تُشغَّل: ' + String(e.message).slice(0,60) }); continue; }
      for (const [s, want, why] of PROBE){
        let got; try { got = !!fn(s); } catch(e){ got = null; }
        if (got !== want)
          out.push({ sev:'خطأ', file:nm, msg:'قاعدةُ الجملةِ تخالف أخواتِها — «' + s + '» (' + why +
            ') تُعَدُّ ' + (got ? 'جملةً' : 'مفردةً') + ' والمنتظَرُ ' + (want ? 'جملة' : 'مفردة') +
            '؛ فالشاشةُ والورقُ يفترقان بلا أثرٍ ظاهر' });
      }
    }
  }

  let man = null;
  const manPath = path.join(ROOT, 'pdf', 'manifest.json');
  if (fs.existsSync(manPath)){ try { man = JSON.parse(fs.readFileSync(manPath,'utf8')); } catch(e){} }

  for (const S of SPEC){
    const bp = path.join(ROOT, S.book), pp = path.join(ROOT, S.page);
    if (!fs.existsSync(bp) || !fs.existsSync(pp)) continue;
    const raw = fs.readFileSync(bp, 'utf8');
    const E = m => out.push({ sev:'خطأ', file:S.book, msg:m });
    const EP = m => out.push({ sev:'خطأ', file:S.page, msg:m });

    let book = null;
    try { const sb = { window:{} }; vm.createContext(sb); vm.runInContext(raw, sb); book = sb.window[S.global]; }
    catch(e){ E('لا يُقوَّم: ' + String(e.message).slice(0,70)); continue; }
    if (!book || typeof book !== 'object'){ E(S.global + ' غير معرَّف'); continue; }

    /* ── شكلُ المادّة ── */
    /* القاعدةُ هنا هي قاعدةُ study-en4.js نفسُها — وهي مقابَلةٌ بالعيّناتِ
       أعلاه. فلو فرَّقتا لوَسَم الحارسُ ما تقبله الوحدةُ أو سكت عمّا تردّه. */
    const isSent = e => {
      if (!/[.?!]$/.test(e) || String(e).trim().split(/\s+/).length < 2) return false;
      return / — /.test(e) || !/[\/…→]/.test(e);
    };
    const ids = Object.keys(book);
    for (const id of ids){
      const u = book[id];
      if (!u || !u.title || !u.ar || !Array.isArray(u.sections) || !u.sections.length){
        E('الوحدة ' + id + ' ناقصةُ الحقول (title / ar / sections)'); continue; }
      u.sections.forEach(sec => {
        if (!sec || !sec.t || !Array.isArray(sec.items) || !sec.items.length){
          E('قسمٌ بلا عنوانٍ أو بلا عناصرَ في ' + id); return; }
        sec.items.forEach(it => {
          if (!Array.isArray(it) || it.length !== 2 || typeof it[0] !== 'string' || typeof it[1] !== 'string'
              || !it[0].trim() || !it[1].trim()){
            E('عنصرٌ ليس زوجًا [إنجليزي، عربي] في ' + id + ' · ' + sec.t); return; }
          if (!/[؀-ۿ]/.test(it[1]))
            E('معنًى بلا عربيّة: «' + it[0] + '» ← «' + it[1] + '»');
          /* سطرُ القاعدةِ يُعرَض في «احفظ» ولا يدخل «ثبّت»، فله أن يحمل أمثلةً
             لاتينيّة. وغيرُه يصير خيارًا، فالمعنى فيه عربيٌّ خالص. */
          /* ‏study-en4.js تقشر بادئتَي «منتظم:» و«شاذ:» قبل العرض وتُبقي ما
             بعدهما وصفًا للتصريف («نضيف ed») — فهو مقصودٌ لا تسرُّبًا،
             والحارسُ يتبع قاعدةَ الوحدةِ نفسِها لا قاعدةً أشدَّ منها. */
          if (!/^قاعدة/.test(it[1]) && !/^(منتظم|شاذ):/.test(it[1])
              && !isSent(it[0]) && /[A-Za-z]/.test(it[1]))
            E('معنًى فيه نصٌّ لاتينيٌّ يُعرَض خيارًا في «ثبّت» فيلتبس: «' + it[0] + '» ← «' + it[1] + '»');
          /* ‏study-en4.js تفرز بـisSentence: ما لم يُعدَّ جملةً يسقط في قائمةِ
             الكلمات. فجملةٌ قصيرةٌ («Hello everybody.» كلمتان) أو بلا نقطةٍ
             تظهر بين المفردات بزرِّ 🔊 بدل أن تدخل تمرينَ الترتيب — وهو عطبٌ
             صامت: القسمُ معنونٌ «جمل» والعنصرُ ليس جملةً عندَ الوحدة. */
          if (/جمل/.test(sec.t) && /[.?!]$/.test(it[0]) && !isSent(it[0]))
            E('في «' + sec.t + '» (' + id + ') عنصرٌ يُختَم كالجملةِ ولا تعدُّه الوحدةُ جملةً، '
              + 'فيسقط بين المفردات: «' + it[0] + '»');
        });
      });
    }

    /* ── الصفحةُ تُحمّل الكتابَ والوحدةَ وتُركّبها ── */
    const src = fs.readFileSync(pp, 'utf8');
    if (src.indexOf('src="' + S.book) < 0) EP('لا تُحمّل ' + S.book);
    if (src.indexOf('src="study-en4.js') < 0) EP('لا تُحمّل study-en4.js');
    if (!/STUDY\.mount\(/.test(src)) EP('لا تُركّب شريطَ احفظ·ثبّت·جمل (STUDY.mount)');
    if (S.tag !== 'en4'){
      if (!new RegExp('window\\.STUDY_BOOK\\s*=\\s*window\\.' + S.global).test(src))
        EP('لا تُسنِد window.STUDY_BOOK إلى ' + S.global + ' — فيُعرَض كتابُ سعودٍ لغيرِه');
      if (!new RegExp('window\\.STUDY_TAG\\s*=\\s*"' + S.tag + '"').test(src))
        EP('وسمُ التخزينِ (STUDY_TAG) ليس "' + S.tag + '" — فيلتقي «u1» من كتابين');
    }
    /* كلُّ وحدةٍ في الكتابِ لها درسٌ في الصفحة */
    const cfgIds = new Set();
    const cm = /var CFG = \{([\s\S]*?)\n  \};/.exec(src);
    if (cm) for (const g of cm[1].matchAll(/^\s*(\w+)\s*:\s*\{/gm)) cfgIds.add(g[1]);
    /* ما حذفه مفتاحُ الفصلِ الثاني ليس درسًا قائمًا وإن بقي في نصِّ CFG:
       فوحدةٌ في الكتابِ تقابله لا يُركَّب لها شريطٌ ولا تُفتح أصلًا. */
    if (/var TERM2 = false/.test(src)){
      const tm = /var TERM2_IDS = \[([^\]]*)\]/.exec(src);
      const t2 = tm ? tm[1].split(',').map(x => x.trim().replace(/"/g,'')).filter(Boolean)
                    : ['u5','u6','u7','u8'];   /* صفحةُ سعودٍ تحذفها بالاسم */
      t2.forEach(k => cfgIds.delete(k));
    }
    if (cfgIds.size){
      const miss = ids.filter(id => !cfgIds.has(id));
      if (miss.length) EP('وحداتٌ في ' + S.book + ' بلا درسٍ في الصفحة: ' + miss.join('، ') +
                          ' — فلا يُركَّب لها الشريط');
    }

    /* ── ملفّاتُ الطباعةِ موجودةٌ وموافقةٌ لمصدرِها ── */
    const h = nodeCrypto.createHash('sha256').update(raw).digest('hex').slice(0,16);
    const rec = man && man.books && man.books[S.tag];
    if (!rec) out.push({ sev:'خطأ', file:'pdf/manifest.json', msg:'لا سجلَّ لـ' + S.tag + ' — شغّل tools/gen-book-pdf.js' });
    else {
      if (rec.hash !== h)
        out.push({ sev:'خطأ', file:'pdf/' + S.tag + '-*.pdf',
          msg:'تغيّر ' + S.book + ' بعد توليدِ ملفّاتِ الطباعة — الورقةُ تخالف الشاشة. شغّل tools/gen-book-pdf.js' });
      const want = ids.map(id => S.tag + '-' + id + '.pdf').concat([S.tag + '-term1.pdf']);
      const gone = want.filter(f => !fs.existsSync(path.join(ROOT,'pdf',f)));
      if (gone.length) out.push({ sev:'خطأ', file:'pdf/', msg:'ملفّاتُ طباعةٍ مفقودة: ' + gone.join('، ') });
    }
    /* والرابطُ في الصفحةِ يشير إلى ما وُلِّد فعلًا */
    const st = fs.readFileSync(path.join(ROOT,'study-en4.js'),'utf8');
    if (!/href="pdf\/'\+TAG\(\)\+'-'\+id\+'\.pdf"/.test(st) || !/TAG\(\)\+'-term1\.pdf/.test(st))
      out.push({ sev:'خطأ', file:'study-en4.js', msg:'رابطُ ملفِّ الطباعةِ لا يُبنى من وسمِ الكتابِ ورقمِ الوحدة' });
  }
  return out;
}

/* ═══ ورقةُ «قاعدة كلّ درس» للطباعة ═══════════════════════════════════
   طلبُ الأب (١٠ أكتوبر ٢٠٢٦): «اكتب قاعدة كلّ درس في بي دي اف عشان
   أطبعها». والمادّةُ هي REMTOPICS[].tip في كلّ صفحةِ منهج.

   وأربعةٌ تنكسر هنا بلا صوت، وكلُّها تنتهي بورقةٍ في يدِ الطفلِ تخالف
   شاشتَه — وهي أسوأُ من ألّا تكون ورقةٌ أصلًا:

   ١) تُعدَّل قاعدةُ درسٍ ولا يُعاد التوليد: الورقةُ تبقى أسابيعَ في
      يدِه بالقاعدةِ القديمة. فتُحفَظ بصمةُ كلِّ صفحةٍ ساعةَ التوليدِ
      وتُقارَن هنا.
   ٢) يُضاف درسٌ بلا قاعدة: لا يظهر في الورقةِ ولا يَبين أنّه سقط.
   ٣) يُضاف زرُّ طباعةٍ لصفحةٍ بلا ملفّ (أو العكس): زرٌّ يفتح ٤٠٤.
   ٤) تُطبَع وحداتُ الفصلِ الثاني وهي مخفيّةٌ في الشاشة (TERM2). */
function rulesPdfPath(){
  const out = [];
  const E = (f, m) => out.push({ sev:'خطأ', file:f, msg:m });
  const PDFDIR = path.join(ROOT, 'pdf');
  const tool = path.join(ROOT, 'tools', 'gen-rules-pdf.js');
  if (!fs.existsSync(tool)) return out;

  const manPath = path.join(PDFDIR, 'manifest.json');
  let man = null;
  try { man = JSON.parse(fs.readFileSync(manPath, 'utf8')); } catch(e){}
  const R = (man && man.rules) || null;
  if (!R){ E('pdf/manifest.json', 'لا سجلَّ لأوراقِ القواعد — شغّل tools/gen-rules-pdf.js'); return out; }

  /* القراءةُ من المكتبةِ نفسِها التي يقرأ بها المولّد (tools/lib-rules.js)
     — فلا يختلف الحارسُ والمولّدُ في درسٍ أو فصلٍ فيصيح بلا سبب. */
  const haveRules = RULES.pagesWithRules(fs, path, ROOT);

  for (const f of haveRules){
    const tag = f.replace(/\.html$/, '');
    const raw = fs.readFileSync(path.join(ROOT, f), 'utf8');
    let R1 = null;
    try { R1 = RULES.readRules(raw, f); }
    catch(e){ E(f, 'تعذّر قراءة قواعدِ دروسِها: ' + e.message); continue; }
    if (!R1){ E(f, 'REMTOPICS غيرُ مقروءة'); continue; }

    /* ── كلُّ درسٍ له قاعدةٌ مكتوبة ── */
    if (!R1.count){
      out.push({ sev:'تنبيه', file:f, msg:'لا قاعدةَ لأيِّ درسٍ فيها — لا ورقةَ طباعةٍ لهذه المادّة' });
      continue;
    }
    if (R1.noTip.length)
      E(f, 'دروسٌ بلا قاعدةٍ مكتوبة فتسقط من الورقة: ' + R1.noTip.join('، '));

    /* ── الورقةُ موجودةٌ وموافقةٌ لما يُعرَض على الشاشة ── */
    const rec = R.pages && R.pages[tag];
    const file = 'rules-' + tag + '.pdf';
    if (!rec) E('pdf/manifest.json', 'لا سجلَّ لورقةِ ' + tag + ' — شغّل tools/gen-rules-pdf.js');
    else {
      if (rec.hash !== R1.digest)
        E('pdf/' + file, 'تغيّرت قواعدُ ' + f + ' بعد توليدِ الورقة — الورقةُ تخالف الشاشة. ' +
                         'شغّل tools/gen-rules-pdf.js');
      if (rec.lessons !== R1.count)
        E('pdf/' + file, 'الورقةُ فيها ' + rec.lessons + ' درسًا والصفحةُ فيها ' + R1.count +
                         ' — شغّل tools/gen-rules-pdf.js');
    }
    if (!fs.existsSync(path.join(PDFDIR, file)))
      E('pdf/', 'ورقةُ طباعةٍ مفقودة: ' + file);

    /* ── وزرُّ الطباعةِ في الصفحة ── */
    if (!/<script src="rules-print\.js/.test(raw))
      E(f, 'لها ورقةُ قواعدَ ولا زرَّ طباعةٍ فيها — الورقةُ في مجلّدٍ لا يصل إليه أحد');
  }

  /* ولا صفحةَ تحمل الزرَّ بلا ورقة */
  for (const f of fs.readdirSync(ROOT).filter(x => x.endsWith('.html'))){
    const raw = fs.readFileSync(path.join(ROOT, f), 'utf8');
    if (!/<script src="rules-print\.js/.test(raw)) continue;
    const file = 'rules-' + f.replace(/\.html$/, '') + '.pdf';
    if (!fs.existsSync(path.join(PDFDIR, file)))
      E(f, 'فيها زرُّ طباعةٍ وملفُّه غيرُ موجود (' + file + ') — زرٌّ يفتح صفحةَ خطأ');
  }

  /* ── والورقةُ الجامعةُ لكلّ ابن ── */
  const onDisk = fs.readdirSync(PDFDIR)
    .filter(x => /^rules-all-.+\.pdf$/.test(x))
    .map(x => x.replace(/^rules-all-|\.pdf$/g, '')).sort();
  const csrc = fs.readFileSync(path.join(ROOT, 'child.html'), 'utf8');
  const lit = EXTRACT.literalAfter(csrc, /(?:var|let|const)\s+RULES_KIDS\s*=/, '[', ']');
  let listed = null;
  try { listed = lit ? EXTRACT.evalLiteral(lit, 'RULES_KIDS') : null; } catch(e){}
  if (!listed) E('child.html', 'RULES_KIDS غيرُ موجودة — لا زرَّ للورقةِ الجامعة');
  else {
    const L = listed.slice().sort();
    const extra = L.filter(k => onDisk.indexOf(k) < 0);
    const gone  = onDisk.filter(k => L.indexOf(k) < 0);
    if (extra.length) E('child.html', 'زرٌّ لورقةٍ جامعةٍ غيرِ موجودة: ' + extra.join('، '));
    if (gone.length)  E('child.html', 'ورقةٌ جامعةٌ بلا زرٍّ يفتحها: ' + gone.join('، '));
  }
  /* ═══ ولا تُطبَع وحدةٌ مخفيّةٌ عن الشاشة ═══════════════════════════
     يُفحَص بالأثرِ لا بذكرِ الاسم: تُقرأ كلُّ صفحةٍ فيها مفتاحُ TERM2
     ويُتحقَّق أنّ وحداتِه المخفيّةَ ليست في أقسامِ الورقة. فلو ذُكر
     TERM2_IDS في المولّدِ ولم يُستعمَل لم ينفع الفحصُ النصّيّ. */
  for (const f of haveRules){
    const raw = fs.readFileSync(path.join(ROOT, f), 'utf8');
    let R1 = null;
    try { R1 = RULES.readRules(raw, f); } catch(e){ continue; }
    if (!R1 || !R1.hiddenIds.length) continue;
    const printed = {};
    R1.sections.forEach(sec => sec.items.forEach(t => { printed[t.id] = 1; }));
    const leaked = R1.hiddenIds.filter(id => printed[id]);
    if (leaked.length)
      E('pdf/rules-' + f.replace(/\.html$/, '') + '.pdf',
        'تُطبَع وحداتٌ مخفيّةٌ عن الشاشة (TERM2): ' + leaked.join('، '));
  }
  return out;
}

function engVideoPath(){
  const SPEC = {
    /* صفحتا أسامةَ وسعودٍ يسمّي بحثُهما الوحدةَ بعنوانِها (needTitle)،
       وصفحتا رفيفٍ وحسنٍ تسمّيان القاعدةَ مع الصفِّ واسمِ السلسلة —
       ولم يشكُ الأبُ منهما، فلا يُشترط فيهما العنوان. */
    'english.html':  { grade:'رابع ابتدائي',  needTitle:true  },
    'english5.html': { grade:'خامس ابتدائي', needTitle:true  },
    'english8.html': { grade:'ثاني متوسط',   needTitle:false },
    'english9.html': { grade:'ثالث متوسط',   needTitle:false }
  };
  const out = [];
  for (const f of Object.keys(SPEC)){
    const SP = SPEC[f], p = path.join(ROOT, f);
    if (!fs.existsSync(p)) continue;
    const src = fs.readFileSync(p, 'utf8');
    const E = m => out.push({ sev:'خطأ', file:f, msg:m });

    const rows = [...src.matchAll(/\{id:"([^"]+)",\s*name:"([^"]+)"[\s\S]*?\}/g)]
      .map(m => {
        const seg = m[0];
        const y = /yt:"([^"]*)"/.exec(seg);
        return { id:m[1], name:m[2], yt: y ? y[1] : null };
      });
    if (!rows.length){ E('قائمةُ دروسِ الإنجليزيِّ (REMTOPICS) لا تُقرأ'); continue; }

    const seen = {};
    for (const r of rows){
      if (!r.yt){ E('الدرس ' + r.name + ' بلا نصِّ بحثٍ — زرُّ الشرحِ يبحث باسمِ التبويبِ وحدَه'); continue; }
      if (r.yt.indexOf(SP.grade) < 0)
        E('نصُّ بحثِ «' + r.name + '» لا يذكر الصفَّ (' + SP.grade +
          ') — فيردُّ يوتيوب شرحًا لعمرٍ آخر');
      if (seen[r.yt]) E('درسان بنصِّ بحثٍ واحد: «' + r.name + '» و«' + seen[r.yt] + '»');
      seen[r.yt] = r.name;
      if (SP.needTitle){
        /* العنوانُ ما بعد «١) » أو «Unit ١ — » */
        const title = r.name.replace(/^[A-Za-z0-9]+\)\s*/, '').replace(/^Unit\s*\d+\s*[—-]\s*/, '').trim();
        if (title && r.yt.indexOf(title) < 0)
          E('نصُّ بحثِ «' + r.name + '» لا يسمّي الوحدةَ («' + title +
            '») — فيُعرَض شرحُ قاعدةٍ لا شرحُ الدرس');
      }
    }

    /* صورةُ الاستعلامِ واحدةٌ في المواضعِ كلِّها */
    const qs = [...src.matchAll(/encodeURIComponent\('عين دروس '\+\([^)]*\)([^)]*)\)/g)].map(m => m[1]);
    if (!qs.length) E('زرُّ شرحِ الدرسِ لا يُبنى — لا استعلامَ بحثٍ في الصفحة');
    else if (new Set(qs).size > 1)
      E('استعلامُ البحثِ يُبنى بصورتين مختلفتين (' + qs.map(x => '«'+x.trim()+'»').join(' و') +
        ') — فللدرسِ الواحدِ بحثان بحسب الزرِّ المضغوط');

    if (/youtube\.com\/watch\?v=|youtu\.be\//.test(src))
      E('رابطُ فيديو بمعرّفٍ ثابت — يُحذف الفيديو فينكسر الزرُّ صامتًا، والبحثُ لا ينكسر');
  }
  return out;
}

function pacePath(){
  const out = [], f = 'practice.html';
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) return out;
  const src = fs.readFileSync(p, 'utf8');
  const E = (file, m) => out.push({ sev:'خطأ', file:file, msg:m });
  if (!/var FAST_SEC = \d+/.test(src) || !/var FAST_ONE = \d+/.test(src))
    E(f, 'عتبتا السرعة غير معرّفتَين — لا يُعرف النقرُ من الحلّ');
  /* ═══ الحارسُ لفهدٍ وحدَه ═══════════════════════════════════════════
     طلبُ الأب (٦ أكتوبر ٢٠٢٦) بعد أن وقع الحارسُ على حسنٍ ورفيفَ في
     «قدرات — لفظي»: «شِلّ الخاصية منهم كلّهم ما عدا فهد». وتعميمُه
     عقوبةٌ على إجابةٍ سريعةٍ صحيحة — فسؤالُ معنى كلمةٍ يُجاب في ثلاثِ
     ثوانٍ صدقًا، بخلاف سؤالِ تحصيليٍّ يحتاج حسابًا. */
  if (!/var PACE_ON = \(who === "fahad"\);/.test(src))
    E(f, 'حارسُ السرعةِ غيرُ مقصورٍ على فهد — سيقع على بقيّة الأبناء في «لفظي» وهو ظلمٌ لهم');
  if (!/if\(PACE_ON && per != null/.test(src))
    E(f, 'الوسمُ لا يحترم القصرَ على فهد');
  if (!/if\(!PACE_ON\) return;/.test(src))
    E(f, 'التنبيهُ على الشاشةِ لا يحترم القصرَ على فهد');
  if (!/function __timing\(\)/.test(src) || !/__fastN\+\+/.test(src))
    E(f, 'زمنُ الجلسةِ لا يُقاس — فلا يُعرف أحلَّ أم نقر');
  if ((src.match(/__timing\(\)\)/g) || []).length < 3)
    E(f, 'الزمنُ لا يُمرَّر في كلّ مواضع الحفظ — جلسةٌ تُحفظ بلا زمنٍ تمرّ بلا فحص');
  if (!/meta\.trusted = false; meta\.why =/.test(src))
    E(f, 'الجلسةُ المتسرّعةُ لا تُوسَم — ستدخل المتوسّط');
  /* معياران: المتوسّطُ وعددُ المتسرّعة */
  if (!/per < FAST_SEC \|\| tooMany/.test(src))
    E(f, 'معيارٌ واحدٌ فقط — من نقر ثمّ ترك الصفحةَ مفتوحةً يُفلت');
  /* ويُقال للطفلِ في وجهِه */
  /* ⚠️ كان الفحصُ /data-pace/ فيطابق data-paceX بعد الكسرِ فلا يصيح —
     وهي ثالثُ مرّةٍ يقع فيها هذا في هذا الملفّ. فالقوسان يلزمان. */
  if (!/\[data-pace\]/.test(src) || !/ما تُحسب لك/.test(src))
    out.push({ sev:'تنبيه', file:f, msg:'الاستبعادُ يقع بصمتٍ — الطفلُ لا يعرف أنّ جولتَه سقطت' });
  /* والفصلُ في التقريرَين */
  for (const rf of ['home.html', 'child.html']){
    const rp = path.join(ROOT, rf);
    if (!fs.existsSync(rp)) continue;
    const rsrc = fs.readFileSync(rp, 'utf8');
    if (!/trusted!==false\s*\)?;?\s*\n?\s*(var|const) skipped/.test(rsrc) && !/skipped=arr\.length-kept\.length/.test(rsrc))
      out.push({ sev:'خطأ', file:rf, msg:'متوسّطُ الاختبارات يضمّ جلساتِ النقر — الرقمُ الذي يقرؤه الأبُ غيرُ صادق' });
    if (!/مستبعدة \(نقر\)/.test(rsrc))
      out.push({ sev:'خطأ', file:rf, msg:'الجلساتُ المستبعدةُ لا يُقال عددُها — يختفي ثلثُ عملِه بلا بيان' });
    if (!/why==="fast"/.test(rsrc))
      out.push({ sev:'تنبيه', file:rf, msg:'سببُ الاستبعادِ لا يُفرَّق: «نقر» غيرُ «خرج من الصفحة»' });
  }
  return out;
}
function fragmentPath(){
  const out = [];
  const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
  let withPid = 0, bad = [], floor = [];
  for (const f of files){
    const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
    if (!/var answered=\{\}, correct=0, total=items\.length/.test(src)) continue;
    withPid++;
    /* المعرِّفُ يبقى للجولةِ غيرِ المكتملة، ويُجدَّد بعد اكتمالها */
    if (!/sec\._pid && sec\._frag/.test(src) || !/sec\._pid = pid; sec\._frag = true;/.test(src))
      bad.push(f);
    else if (!/sec\._frag=false;/.test(src))
      bad.push(f);
    if (/if\(n<3\|\|n<=savedN\) return;/.test(src)) floor.push(f);
  }
  if (!withPid) out.push({ sev:'تنبيه', file:'checks', msg:'لم يُعثر على صفحاتِ المنهج — تغيّر شكلُ الحفظ؟' });
  if (bad.length)
    out.push({ sev:'خطأ', file: bad[0], msg: bad.length+' صفحةً تُجدّد معرِّفَ الجلسةِ عند العودة للدرس — فتصير القُصاصةُ جلسةً ثانية: '+bad.slice(0,4).join('، ') });
  if (floor.length)
    out.push({ sev:'خطأ', file: floor[0], msg: floor.length+' صفحةً لا تحفظ دون ثلاثِ إجابات — درسٌ أجاب فيه سؤالَين يغيب عن التقرير: '+floor.slice(0,4).join('، ') });
  return out;
}
function listenPath(){
  const out = [], f = 'reading.html', bk = 'listen-bank.js';
  const p = path.join(ROOT, f), bp = path.join(ROOT, bk);
  if (!fs.existsSync(p)) return out;
  const src = fs.readFileSync(p, 'utf8');
  const E = (file, m) => out.push({ sev:'خطأ', file:file, msg:m });
  if (!fs.existsSync(bp)){ E(bk, 'بنكُ فهمِ المسموع مفقود'); return out; }
  if (!/listen-bank\.js/.test(src)) E(f, 'بنكُ الاستماع غيرُ محمَّلٍ في الصفحة');
  if (!/data-tab="listen"/.test(src)) E(f, 'تبويبُ «فهم المسموع» غيرُ موجود');
  if (!/function renderListen\(/.test(src) || !/renderListen\(\);/.test(src))
    E(f, 'قسمُ الاستماع لا يُبنى');
  if (!/if\(plays >= 2\)\{ return; \}/.test(src))
    E(f, 'الاستماعُ بلا حدٍّ — الاختبارُ الحقيقيُّ مرّتان');
  if (!/data-script[\s\S]{0,400}display:none/.test(src))
    E(f, 'النصُّ المسموعُ ظاهرٌ من البداية — يصير القسمُ قراءةً لا استماعًا');
  if (!/if\(opened\) return; opened = true;/.test(src) || !/data-qs[\s\S]{0,200}display:none/.test(src))
    E(f, 'الأسئلةُ مفتوحةٌ قبل الاستماع — يُخمّن بلا سماع');
  if (!/saveScore\("فهم المسموع 🎧"/.test(src))
    E(f, 'نتيجةُ الاستماعِ لا تُحفَظ — فلا تظهر في التقرير');
  /* البنكُ نفسُه: أربعةُ خياراتٍ لكلّ سؤال، والصحيحُ أوّلًا، ولكلٍّ شرح */
  let L = [];
  try { const ctx = { window:{} }; vm.createContext(ctx);
        vm.runInContext(fs.readFileSync(bp,'utf8'), ctx); L = ctx.window.LISTEN_BANK || []; }
  catch(e){ E(bk, 'تعذّرت قراءةُ البنك: ' + e.message); return out; }
  if (L.length < 10) out.push({ sev:'تنبيه', file:bk, msg:'بنكُ الاستماعِ صغير ('+L.length+' مقطعًا) — سيتكرّر سريعًا' });
  let badOpt = 0, badEx = 0, dup = 0;
  L.forEach(x => (x.q||[]).forEach(q => {
    if (!q[1] || q[1].length !== 4) badOpt++;
    if (!q[2]) badEx++;
    if (q[1] && new Set(q[1].map(o => String(o).toLowerCase())).size !== q[1].length) dup++;
  }));
  if (badOpt) E(bk, badOpt + ' سؤالًا خياراتُه ليست أربعة — فحظُّ التخمينِ غيرُ حظِّ الاختبار');
  if (badEx)  E(bk, badEx + ' سؤالًا بلا شرحٍ — يُخطئ ولا يعرف لِمَ');
  if (dup)    E(bk, dup + ' سؤالًا فيه خيارٌ مكرّر');
  return out;
}
function vocabReviewPath(){
  const out = [], f = 'reading.html';
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) return out;
  const src = fs.readFileSync(p, 'utf8');
  const E = m => out.push({ sev:'خطأ', file:f, msg:m });
  /* ١) عتبةُ توسيعِ البركة */
  if (!/var poolNeed = rvWant \+ VOC_STEP;/.test(src))
    E('عتبةُ توسيعِ بركةِ المراجعة ليست مقيسةً بحجم الجلسة — تعود «نفس الكلمات تتكرّر»');
  if (!/pool = fullPool; rvWidened = true;/.test(src))
    E('البركةُ لا تتوسّع عند ضيقها — الجلسةُ ستُعيد نفسَها');
  if (!/rvWidened \? /.test(src))
    out.push({ sev:'تنبيه', file:f, msg:'التوسيعُ يقع بلا بيانٍ للطفل — سيظنّ الخللَ عاد' });
  /* ٢) نسخةُ الذاكرةِ في الخادم */
  if (!/function pushSR\(/.test(src) || !/kind:"vocabsr"/.test(src))
    E('ذاكرةُ التكرار لا تُحفَظ في الخادم — تضيع مراجعاتُه بفراغِ تخزينِ المتصفّح');
  if (!/function pullSR\(/.test(src) || !/pullSR\(\);/.test(src))
    E('نسخةُ الذاكرةِ تُحفَظ ولا تُقرأ — فلا تنفع');
  if (!/function srMerge\(/.test(src))
    E('الذاكرةُ تُستبدل ولا تُدمَج — لقطةٌ قديمةٌ قد تمحو عملَ اليوم');
  /* الدمجُ بالكلمةِ على الأحدثِ عهدًا — لا بالجملة */
  if (!/at > bt \|\| \(at === bt/.test(src))
    E('الدمجُ لا يُرجّح الأحدثَ لكلّ كلمةٍ على حدة');
  /* لقطةٌ سبقت التصفيرَ لا تُعاد */
  if (!/if\(resetAt && !isNaN\(tms\) && tms <= resetAt\) return;/.test(src))
    E('اللقطةُ تُقرأ بلا احترامِ التصفير — سيرجع ما صُفّر');
  if (!/if\(!force && Date\.now\(\) - _srPushed/.test(src))
    out.push({ sev:'تنبيه', file:f, msg:'دفعُ اللقطةِ بلا خنقٍ — صفٌّ مع كلّ إجابة' });
  return out;
}
function grammarPath(){
  const out = [], f = 'practice.html';
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) return out;
  const src = fs.readFileSync(p, 'utf8');
  const E = m => out.push({ sev:'خطأ', file:f, msg:m });
  if (!/TABS\.push\(\["gr",/.test(src))
    E('تبويبُ «قواعد مركّزة» غيرُ مضافٍ إلى TABS — القسمُ لا يُرى');
  else if (!/if\(b\.dataset\.tab==="gr"\)\{\s*renderGrammar\(\);/.test(src))
    E('تبويبُ القواعد موجودٌ ولا يُبنى عند الضغط — سيبقى فارغًا');
  if (!/function renderGrammar\(/.test(src))
    E('renderGrammar غيرُ معرّفة');
  /* الطابورُ من أخطائه هو: الفرزُ على محاولاتِ ستيب، ثمّ قراءةُ
     meta.wrong، ثمّ مطابقتُها على البنكِ بنصِّها. */
  if (!/meta->>test=eq\./.test(src))
    E('القسمُ لا يفرز محاولاتِ ستيب — سيقرأ نافذةً عامّةً فيزيغ ترتيبُ الضعف');
  if (!/\(m\.wrong \|\| \[\]\)\.forEach/.test(src))
    E('القسمُ لا يقرأ meta.wrong — فالطابورُ لن يكون من أخطائه');
  if (!/function grBankIndex\(/.test(src) || !/bank\[stem\]/.test(src))
    E('نصُّ الخطأِ لا يُطابَق على البنك — فلا يُعاد السؤالُ بعينه');
  /* ولا يخرج السؤالُ حتى يُجيبه صحيحًا */
  if (!/queue\.shift\(\); queue\.push\(cur\);/.test(src))
    E('المخطوءُ لا يعود إلى آخرِ الطابور — فقد تُقرأ القاعدةُ ولا يُصحَّح الخطأ');
  if (!/if\(cur\.missed\)\{ fixedN\+\+/.test(src))
    E('تصحيحُ الخطأِ لا يُعدّ — فلا يُعرَف كم صحّح');
  /* ما صُحِّح يُحفَظ في الخادمِ لا في الجهازِ وحده */
  if (!/function saveGram\(/.test(src) || !/sect:"gram"/.test(src))
    E('جولاتُ القواعدِ لا تُحفظ — لا نعرف أعمل عليها أم لا');
  if (!/fixedKeys:/.test(src) || !/meta->>sect=eq\.gram/.test(src))
    E('ما صُحِّح لا يُقرأ من الخادم — ستُعاد عليه أسئلةٌ أتمّها في جهازٍ آخر');
  /* شرحُ القاعدةِ يُقرأ من جدولٍ واحدٍ لا يُكتب مرّتين */
  if (!/GRAM_BY_KEY\[key\] = \{/.test(src))
    out.push({ sev:'تنبيه', file:f, msg:'جدولُ شروحِ القواعدِ غيرُ مفتوحٍ للقسمِ المركَّز' });
  /* عزلُ المقاطعِ اللاتينيّة: بلا isoLatin تُعرَض «if + had p.p» مقلوبة */
  if (!/function isoLatin\(/.test(src) || !/isoLatin\(g\.lesson\)/.test(src))
    E('شرحُ القاعدةِ بلا عزلِ المقاطعِ اللاتينيّة — تُعرَض القاعدةُ مقلوبةً فيحفظها الطالبُ خطأً');
  /* وأثرُه يُعرَض في التقريرين */
  for (const rf of ['home.html', 'child.html']){
    const rp = path.join(ROOT, rf);
    if (!fs.existsSync(rp)) continue;
    const rsrc = fs.readFileSync(rp, 'utf8');
    /* ═══ الخانةُ الفارغةُ تُقال لا تُطوى ══════════════════════════════
       بلاغُ الأب (٧ أكتوبر ٢٠٢٦): «القواعدُ المركَّزةُ ما تطلع لي في
       التقرير» — ولم يكن فيها عطل، إنّما لم يفتحها فهدٌ فطُويت
       البطاقة. والفراغُ المطويُّ لا يُفرَّق عن العطل. */
    /* ⚠️ لا يُترك الطرفُ مفتوحًا: /hasStep/ يطابق hasStepX بعد الكسر
       فلا يصيح الحارس — وهي رابعُ مرّةٍ يقع فيها هذا هنا. */
    if (!/!gramActs\.length && hasStep[^A-Za-z0-9_]/.test(rsrc))
      out.push({ sev:'خطأ', file:rf, msg:'بطاقةُ القواعدِ تختفي إذا لم يفتحها — فلا يُفرَّق الفراغُ عن العطل' });
    if (!/!remActs\.length &&/.test(rsrc))
      out.push({ sev:'خطأ', file:rf, msg:'بطاقةُ العلاجيِّ تختفي إذا لم يفتحها — فلا يُفرَّق الفراغُ عن العطل' });
    if (!/tab=gr"/.test(rsrc))
      out.push({ sev:'تنبيه', file:rf, msg:'البطاقةُ الفارغةُ بلا رابطٍ مباشرٍ للقسم' });
    if (!/sect\s*===\s*"gram"/.test(rsrc))
      out.push({ sev:'خطأ', file:rf, msg:'جولاتُ القواعدِ المركَّزة تُحفظ ولا تُعرض — بطاقةُ «القواعد المركّزة» مفقودة' });
    else if (!/meta\.fixed\|\|0\)|meta\.fixed \|\| 0\)/.test(rsrc))
      out.push({ sev:'خطأ', file:rf, msg:'البطاقةُ تعدّ الجولاتِ ولا تعدّ ما صُحِّح — وهو الرقمُ المقصود' });
  }
  return out;
}
function mawhibaPath(){
  const out = [];
  /* مستويان: الثاني لرفيف (٦ ابتدائي–٢ متوسط) والثالث لحسن (٣ متوسط–١ ثانوي) */
  for (const [f, g] of [['mawhiba2.js','MAWHIBA2'], ['mawhiba3.js','MAWHIBA3']])
    out.push(...auditMawhibaBank(f, g));
  return out.concat(mawhibaWiring());
}
function auditMawhibaBank(f, globalName){
  const out = [];
  const bp = path.join(ROOT, f);
  if (!fs.existsSync(bp)) return [{ sev:'خطأ', file:f, msg:'بنكُ مقياس موهبة غير موجود' }];
  const ctx = { window:{} }; ctx.window = ctx;
  try { vm.createContext(ctx); vm.runInContext(fs.readFileSync(bp,'utf8'), ctx); }
  catch (e){ return [{ sev:'خطأ', file:f, msg:'البنك لا يُحمَّل: ' + e.message }]; }
  const M = ctx[globalName];
  if (!M || !Array.isArray(M.domains) || M.domains.length !== 4)
    return [{ sev:'خطأ', file:f, msg:'المجالاتُ الأربعةُ غير مكتملة (' + ((M&&M.domains&&M.domains.length)||0) + ')' }];

  /* تشغيلٌ فعليّ: كلُّ مولّدٍ يُنتج سؤالًا سليمًا */
  let ran = 0;
  M.domains.forEach(d => {
    if (!d.lesson || !d.yt) out.push({ sev:'خطأ', file:f, msg:'المجال «'+d.name+'» بلا شرحٍ أو رابطِ فيديو — فبطاقتُه العلاجيّةُ خاوية' });
    d.gens.forEach(g => {
      let q = null, tries = 0, err = null;
      while (!q && tries++ < 120){ try { q = g(); } catch(e){ err = e.message; break; } }
      if (err){ out.push({ sev:'خطأ', file:f, msg:'المولّد ' + (g.name||'?') + ' يرمي: ' + err }); return; }
      if (!q){ out.push({ sev:'خطأ', file:f, msg:'المولّد ' + (g.name||'?') + ' لا يُنتج سؤالًا في ١٢٠ محاولة' }); return; }
      ran++;
      if (!Array.isArray(q[1]) || q[1].length !== 4)
        out.push({ sev:'خطأ', file:f, msg:'المولّد ' + (g.name||'?') + ' يُخرج ' + ((q[1]&&q[1].length)||0) + ' خيارات لا أربعة' });
      else {
        const plain = q[1].map(o => String(o).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim());
        if (new Set(plain).size !== 4)
          out.push({ sev:'خطأ', file:f, msg:'المولّد ' + (g.name||'?') + ' يُكرّر خيارًا — فللسؤال جوابان' });
      }
      if (q[2] !== 0)
        out.push({ sev:'خطأ', file:f, msg:'المولّد ' + (g.name||'?') + ' لا يضع الصحيحَ أوّلًا (shuffleQ تعتمد ذلك)' });
    });
  });

  if (!out.length && ran < 20)
    out.push({ sev:'تنبيه', file:f, msg:'مولّداتُ موهبة قليلة: ' + ran });
  return out;
}
function mawhibaWiring(){
  const out = [];
  const pp = path.join(ROOT, 'practice.html');
  if (fs.existsSync(pp)){
    const src = fs.readFileSync(pp, 'utf8');
    for (const bk of ['mawhiba2', 'mawhiba3'])
      if (!new RegExp('<script src="' + bk + '\\.js"><\\/script>').test(src))
        out.push({ sev:'خطأ', file:'practice.html', msg:'بنكُ ' + bk + ' غيرُ محمَّل' });
    if (!/MW_GRADES/.test(src))
      out.push({ sev:'خطأ', file:'practice.html', msg:'خريطةُ صفوفِ مستويات موهبة مفقودة' });
    if (!/TABS\.push\(\["mw"/.test(src))
      out.push({ sev:'خطأ', file:'practice.html', msg:'تبويبُ موهبة غيرُ معروضٍ لأحد' });
    if (!/renderSet\("mw"/.test(src))
      out.push({ sev:'خطأ', file:'practice.html', msg:'لوحةُ موهبة لا تُرسَم' });
    /* اسمُ المجالِ هو مفتاحُ المهارة: q.gen = d.name و keys:[d.name] */
    if (!/q\.gen = d\.name/.test(src) || !/keys:\[d\.name\]/.test(src))
      out.push({ sev:'خطأ', file:'practice.html', msg:'اسمُ مجال موهبة لا يطابق مفتاحَه العلاجيّ — الضعفُ لن يجد علاجه' });
  }
  /* النتيجةُ تصل الأبَ بمجالاتها لا بمتوسّطها: سؤالُه (٣ أكتوبر) «تطلع
     لي نتيجته في التقرير موهبة؟» — وكانت تطلع سطرًا واحدًا في
     «الاختبارات التجريبية»، والمتوسّطُ يُخفي أنّ مجالًا ٨/٨ وآخرَ ٣/٨. */
  for (const rf of ['home.html', 'child.html']){
    const rp = path.join(ROOT, rf);
    if (!fs.existsSync(rp)) continue;
    const rsrc = fs.readFileSync(rp, 'utf8');
    if (!/mawhibaAll\b/.test(rsrc))
      out.push({ sev:'خطأ', file:rf, msg:'نتيجةُ موهبة بلا قسمٍ خاصّ — تسقط في «الاختبارات التجريبية» بمتوسّطٍ يُخفي مجالاتِها' });
  }
  return out;
}

function typedAnswers(){
  const out = [];
  const SAFE = /type=["'](checkbox|radio|range|file|password|color|date|time)["']/;
  fs.readdirSync(ROOT).filter(f => /\.(html|js)$/.test(f)).forEach(f => {
    const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of src.matchAll(/<input\b[^>]*>/g)) {
      const tag = m[0];
      if (SAFE.test(tag)) continue;
      const miss = [];
      if (!/autocorrect=["']off["']/.test(tag))  miss.push('autocorrect="off"');
      if (!/spellcheck=["']false["']/.test(tag)) miss.push('spellcheck="false"');
      if (miss.length) {
        const cls = (tag.match(/class=["']([^"']+)["']/) || [,'(بلا صنف)'])[1];
        out.push({ sev:'خطأ', file:f,
          msg:'حقلُ إجابةٍ بلا إطفاء تصحيح لوحة المفاتيح — ' + cls + ' ينقصه: ' + miss.join(' و') });
      }
    }
  });
  return out;
}

/* ═══ جرعتا حسن المركَّزتان ═══════════════════════════════════════════
   طلبُ الأب (١٥ أكتوبر ٢٠٢٦): «جرعة حسن سوّها».

   وثلاثةٌ تنكسر هنا بلا صوت:
   ١) يُبدَّل مولّدٌ في الجرعةِ بلا قياسٍ جديد — فتصير الجرعةُ رأيًا لا
      دواءً، وهي عينُ علّةِ «الزيادةِ بلا قياس» التي في حارسِ التأنّي.
   ٢) يُحذَف جدولُ «لا تقل / قل» — فتعود الجرعةُ تكرارَ أسئلةٍ أخطأها
      أصلًا، ولا تُفيده إعادةُ التجربةِ بلا مقابلةِ الخطأِ بالصواب.
   ٣) يُشار إلى مولّدٍ لا وجودَ له فتُرمى اللوحةُ فارغةً أو تَرمي. */
function dosePath(){
  const out = [];
  const f = 'english9.html';
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) return out;
  const src = fs.readFileSync(p, 'utf8');
  const E = m => out.push({ sev:'خطأ', file:f, msg:m });
  if (!/var DOSE_Q\s*=/.test(src) && !/var DOSE_F\s*=/.test(src)) return out;

  const read = nm => {
    const m = new RegExp('var ' + nm + '\\s*=\\s*\\[([^\\]]*)\\]').exec(src);
    return m ? m[1].split(',').map(s => s.trim()).filter(Boolean) : null;
  };
  const dq = read('DOSE_Q'), df = read('DOSE_F');
  if (!dq || !dq.length) E('DOSE_Q فارغةٌ أو غيرُ مقروءة — بابُ صياغةِ السؤالِ بلا أسئلة');
  if (!df || !df.length) E('DOSE_F فارغةٌ أو غيرُ مقروءة — بابُ المستقبلِ بلا أسئلة');

  for (const gname of [...(dq||[]), ...(df||[])]){
    /* المولّدُ موجودٌ فعلًا — وإلّا لوحةٌ فارغةٌ أو رميٌ عند الرسم */
    if (!new RegExp('function ' + gname + '\\s*\\(').test(src))
      E('الجرعةُ تشير إلى مولّدٍ لا وجودَ له: ' + gname);
    /* ═══ ولا يدخل الجرعةَ من لم يُقَس ═══════════════════════════════
       الاختيارُ كان من قياسِ جلساتِه الموثوقةِ لا من الرأي، فيبقى
       القياسُ مكتوبًا بجانبِ كلِّ اسم. ومن أراد تبديلَ مولّدٍ فليَقِس
       أوّلًا ويكتب رقمَه — وإلّا صارت الجرعةُ تخمينًا. */
    else if (!new RegExp(gname + '[^\\n]*[٠-٩]+٪').test(src))
      E('مولّدُ الجرعةِ ' + gname + ' بلا قياسٍ مكتوبٍ بجانبِه — فلا يُعرَف على أيِّ أساسٍ أُدخل');
  }

  /* اللوحتان موصولتان: تعريفٌ في CFG وبابٌ في CHAPS */
  for (const [id, arr] of [['doseq','DOSE_Q'], ['dosef','DOSE_F']]){
    /* القراءةُ بمسحِ الأقواسِ المتوازنة لا بنمطٍ على شكلِ النهاية —
       فالكتلةُ قد تُغلَق في سطرِها أو في سطرٍ تالٍ، وكلاهما صحيح. */
    const body = EXTRACT.literalAfter(src, new RegExp('CFG\\.' + id + '\\s*='), '{', '}');
    if (!body){ E('تعريفُ لوحةِ الجرعة CFG.' + id + ' مفقود — فالتبويبُ يرمي عند الرسم'); continue; }
    if (body.indexOf('gens: ' + arr) < 0 && body.indexOf('gens:' + arr) < 0)
      E('CFG.' + id + ' لا تسحب من ' + arr + ' — فالجرعةُ تُدرّب غيرَ ما قِيس');
    const n = /n:\s*(\d+)/.exec(body);
    if (!n || +n[1] < 10)
      E('CFG.' + id + ' عددُ أسئلتِها ' + (n ? n[1] : 'غيرُ محدَّد') + ' — والجرعةُ دونَ عشرةٍ لا تُثبّت قاعدة');
    /* ═══ جدولُ «لا تقل / قل» هو الفرقُ بين جرعةٍ وتكرار ═══════════ */
    if (!/لا تقل/.test(body) || !/<b>قل<\/b>/.test(body))
      E('CFG.' + id + ' بلا مقابلةِ «لا تقل / قل» — فهي تكرارُ أسئلةٍ أخطأها لا تصحيحٌ لها');
  }
  if (!/dose:\s*\{[^}]*ids:\s*\[[^\]]*"doseq"[^\]]*"dosef"/.test(src))
    E('بابُ الجرعةِ غيرُ مُدرَجٍ في CHAPS بلوحتَيه — فلا يُرى في شريطِ الأجزاء');

  return out;
}

/* ═══ صفحةُ المراجعةِ موصولةٌ ولا تُحتسَب ═══════════════════════════════
   طلبُ الأب (١٥ أكتوبر ٢٠٢٦): «يربط». وmath7.html بقيت شهورًا بلا رابطٍ
   من أيِّ صفحة — واحدٌ وثلاثون درسًا كاملةَ القواعدِ والفيديو لم يفتحها
   أحد. فيُحرَس أمران: أنّ الرابطَ قائمٌ (وإلّا عادت يتيمةً بلا أن يَبين)،
   وأنّ وسومَها «م١» لا «م٢» (وإلّا اختلطت مراجعةُ العامِ الماضي بمتوسّطِ
   منهجِها الجاري). وأمّا وسمُ preview فيحرسه PREVIEW_PAGES أعلاه. */
function math7Link(){
  const out = [];
  const src = path.join(ROOT, 'math7.html');
  if (!fs.existsSync(src)) return out;
  const m7 = fs.readFileSync(src, 'utf8');
  const h = path.join(ROOT, 'math8.html');
  if (fs.existsSync(h) && !/math7\.html\?who=/.test(fs.readFileSync(h, 'utf8')))
    out.push({ sev:'خطأ', file:'math8.html',
      msg:'رابطُ مراجعةِ أوّلِ متوسّط (math7.html) ساقطٌ — فتعود صفحةً يتيمةً لا يفتحها أحد' });
  const wrong = (m7.match(/label:"رياضيات م٢/g) || []).length;
  if (wrong)
    out.push({ sev:'خطأ', file:'math7.html',
      msg:'فيها ' + wrong + ' وسمًا باسم «رياضيات م٢» ومحتواها منهجُ أوّلِ متوسّط — فتختلط بمتوسّطِ منهجِها الجاري' });
  if (!/label:"رياضيات م١/.test(m7))
    out.push({ sev:'خطأ', file:'math7.html', msg:'لا وسمَ «رياضيات م١» فيها — فلا يُميَّز ما تحفظه' });
  if (/<title>[^<]*ثاني متوسط/.test(m7))
    out.push({ sev:'تنبيه', file:'math7.html', msg:'العنوانُ يقول «ثاني متوسط» ومحتواها منهجُ الأوّل' });
  return out;
}

/* ═══ أسئلةُ كتابِ موهبةَ — المستوى الثالث ═══════════════════════════
   وصل الكتابُ (١٥ أكتوبر ٢٠٢٦) فنُقلت أسئلتُه بنصِّها. وثلاثةٌ تنكسر
   هنا بلا صوت:
   ١) فهرسُ إجابةٍ خارجَ الخيارات، أو خيارٌ صحيحٌ مكرَّرٌ حرفيًّا — فسؤالٌ
      بلا إجابةٍ صحيحةٍ أبدًا، أو تنقر الصوابَ فيُحسَب خطأً.
   ٢) مجالٌ في الكتابِ لا يقابله مجالٌ في mawhiba3.js — فأسئلتُه لا
      تُسحَب أبدًا وتبقى في الملفِّ بلا أن يَبين.
   ٣) يسقط وصلُ الكتابِ من practice.html فيعود التوليدُ وحدَه — والأبُ
      طلب أسئلةَ الكتابِ أوّلًا. */
function mawhiba3BookPath(){
  const out = [];
  const BF = 'mawhiba3-book.js', PG = 'practice.html', GF = 'mawhiba3.js';
  const bp = path.join(ROOT, BF);
  if (!fs.existsSync(bp)) return out;
  const E = (f, m) => out.push({ sev:'خطأ', file:f, msg:m });

  let B = null;
  try {
    const box = { window:{} };
    require('vm').createContext(box);
    require('vm').runInContext(fs.readFileSync(bp, 'utf8'), box, { timeout: 8000 });
    B = box.window.MAWHIBA3_BOOK;
  } catch(e){ E(BF, 'تعذّرت قراءةُ الملفّ: ' + e.message); return out; }
  if (!B || typeof B !== 'object'){ E(BF, 'قائمةُ أسئلةِ الكتابِ فارغةٌ أو ليست كائنًا'); return out; }

  /* مجالاتُ الكتابِ هي مجالاتُ المولّداتِ نفسُها — وإلّا لم تُسحَب */
  const gs = fs.existsSync(path.join(ROOT, GF)) ? fs.readFileSync(path.join(ROOT, GF), 'utf8') : '';
  const domIds = [...gs.matchAll(/^DOM\("([a-z]+)"/gm)].map(m => m[1]);
  let total = 0;
  for (const k of Object.keys(B)){
    if (domIds.length && !domIds.includes(k))
      E(BF, 'مجالُ «' + k + '» لا يقابله مجالٌ في ' + GF + ' — فأسئلتُه لا تُسحَب أبدًا');
    const list = B[k];
    if (!Array.isArray(list) || !list.length){ E(BF, 'مجالُ «' + k + '» بلا أسئلة'); continue; }
    list.forEach(q => {
      total++;
      const tag = k + ' — «' + String((q && q[0]) || '').replace(/<[^>]*>/g, '').slice(0, 30) + '»';
      if (!Array.isArray(q) || q.length !== 4) return E(BF, tag + ' ليس على شكلِ [نصّ, خيارات, الصحيح, شرح]');
      if (!Array.isArray(q[1]) || q[1].length < 2) return E(BF, tag + ' خياراتُه أقلُّ من اثنَين');
      if (typeof q[2] !== 'number' || q[2] < 0 || q[2] >= q[1].length)
        return E(BF, tag + ' فهرسُ الإجابةِ خارجَ الخيارات: ' + q[2]);
      if (q[1].filter(x => x === q[1][q[2]]).length !== 1)
        E(BF, tag + ' الخيارُ الصحيحُ مكرَّرٌ حرفيًّا فلا يُميَّز');
      if (!q[3] || !String(q[3]).trim()) E(BF, tag + ' بلا شرح');
    });
  }
  if (total < 452)
    out.push({ sev:'تنبيه', file:BF, msg:'أسئلةُ الكتابِ ' + total + ' فقط — والمنقولُ ساعةَ البناءِ ٤٦٥ (١٩ أسئلةٌ تجريبية + ٧ ميكانيكا + ٣ مرونة + الاختباراتُ الأحدَ عشرَ كلُّها: ٢٣ أول · ٢٢ ثانٍ · ٢٤ ثالث · ١٧ رابع · ٢١ خامس · ٢٠ سادس · ٢٠ سابع · ٢٢ ثامن · ٢٢ تاسع · ٢٢ عاشر · ١٩ حادي عشر + ١٠٠ من ملحقِ تجميعاتِ ٢٠٢٦–٢٠٢٧ + ٣٨ من ملحقِ التناظرِ اللفظيّ + ٥ من حلولِ ملحقِ المرونة + ٥٥ علميًّا و٦ مرونةً من التجميعات)' });
  /* سؤالٌ نُقل مرّتَين من قسمَين مختلفَين عطبٌ وقع فعلًا (ص ٦–٧ مع
     الاختبار الثاني)، ولا يَظهر إلا بمقارنةِ النصوصِ كاملةً */
  {
    const arNorm = x => String(x).replace(/<[^>]*>/g, '')
      .replace(/[\u064B-\u0652\u0670\u0640]/g, '')
      .replace(/[\u0622\u0623\u0625]/g, '\u0627')
      .replace(/\u0629/g, '\u0647').replace(/\u0649/g, '\u064A')
      .replace(/\s+/g, ' ').trim();
    const seenStem = new Set();
    for (const k of Object.keys(B))
      for (const q of (B[k] || [])){
        /* هويّةُ السؤالِ نصُّه <b>وخياراتُه</b> معًا: فالكتابُ يضع لافتةً واحدةً
           فوق عدّةِ أسئلةٍ لا يفرّقها إلّا صفُّ خياراتِها (أسئلةُ «الكلمةُ
           المختلفة» في الاختبارِ الخامس). ومقارنةُ النصِّ وحدَه تعدّها مكرّرة. */
        /* ═══ المقارنةُ بعد تسويةِ الرسمِ العربيّ ══════════════════════
           نجا سؤالُ «حصان : مضمار» من هذا الفحصِ وهو منقولٌ مرّتَين
           (الاختبارُ التاسعُ وملحقُ التناظر)، لأنّ الفرقَ بين «سكّة»
           و«سكة» <b>شدّةٌ واحدة</b> والفحصُ يقارن حرفًا بحرف. فصار
           يُسقِط التشكيلَ والتطويلَ ويوحّد الهمزاتِ والتاءَ المربوطةَ
           والألفَ المقصورةَ قبل أن يقارن. */
        const s = arNorm(String((q && q[0]) || '')) +
                  ' ⟪' + (Array.isArray(q && q[1]) ? q[1].map(arNorm).join('|') : '') + '⟫';
        if (!s.trim()) continue;
        if (seenStem.has(s)) E(BF, 'سؤالٌ مكرَّرٌ حرفيًّا: «' + s.slice(0, 40) + '…»');
        seenStem.add(s);
      }
  }
  /* ═══ كلُّ سؤالٍ خالفتُ فيه مفتاحَ الكتابِ يبقى موسومًا بـ⚠ ═══════════
     وكان الفحصُ يكتفي بوجودِ الوسمِ في <b>الملفِّ كلِّه</b>، وذلك يكفي ما
     دام الموسومُ واحدًا. فلمّا صاروا ثلاثةً (١٦ أكتوبر) أمكن أن يسقط
     وسمُ أحدِهم ويبقى الفحصُ ساكتًا لأنّ أخوَيه يحملانِه — فصار الفحصُ
     يقرأ <b>شرحَ كلِّ سؤالٍ على حدة</b>. */
  {
    const FLAGGED = [
      [/وُضع حاجزٌ بين مغناطيسٍ/, 'حاجزُ المغناطيسِ — جوابُه جوابُ الكتابِ لا جوابُ الفيزياء'],
      [/فما قيمةُ <span class=ltr>م \+ س<\/span>/, 'معادلاتُ م + س — المعطياتُ لا تحسم الجواب'],
      [/فما النكهةُ الأكثرُ تصويتًا/, 'نكهاتُ الحليب — لا رابطَ بين الشوكولاتةِ والموز']
    ];
    for (const [re, label] of FLAGGED){
      const hit = [];
      for (const k of Object.keys(B))
        for (const q of (B[k] || [])) if (re.test(String((q && q[0]) || ''))) hit.push(q);
      if (!hit.length) E(BF, 'السؤالُ الموسومُ «' + label + '» لم يَعُدْ في الكتاب');
      else for (const q of hit)
        if (String(q[3] || '').indexOf('⚠ تنبيهٌ مهمّ') < 0)
          E(BF, 'سؤالُ ' + label + ' فقد وسمَ ⚠ — فيُقرَأ كأنّه الصوابُ المطلق');
    }
  }

  const pp = path.join(ROOT, PG);
  if (fs.existsSync(pp)){
    const ps = fs.readFileSync(pp, 'utf8');
    if (ps.indexOf('src="' + BF) < 0)
      E(PG, 'ملفُّ أسئلةِ الكتابِ غيرُ محمَّل — فلا تُسحَب منه أسئلة');
    if (!/mwBookTake\(/.test(ps))
      E(PG, 'أسئلةُ الكتابِ غيرُ موصولةٍ بالخلطة — والأبُ طلب أسئلةَ الكتابِ أوّلًا ثمّ التوليد');
    /* ═══ يُقرَأ جسمُ الدالّةِ لا نافذةُ حروف ═══════════════════════
       كان الفحصُ «mwBookTake خلال ٩٠٠ حرفٍ من رأسِ mawhibaMix»، فصاح
       لمّا طال التعليقُ داخلَ الدالّةِ ولم يتغيّر شيءٌ في عملِها
       (١٧ أكتوبر). وفحصٌ يقيس بالمسافةِ يَكذِب في الاتّجاهَين: يصيح على
       تعليقٍ، ويسكت لو انتقلت الدالّةُ وبقيت الأخرى قريبةً منها.
       فصار يقرأ <b>جسمَ الدالّةِ</b> نفسَه. */
    {
      const mb = /function mawhibaMix\(n\)\{\n([\s\S]*?)\n\}/.exec(ps);
      if (!mb) E(PG, 'جسمُ mawhibaMix لا يُقرَأ');
      else if (mb[1].indexOf('mwBookTake(') < 0)
        E(PG, 'mwBookTake خارجَ mawhibaMix — فلا أثرَ لها في الجولة');
    }
    /* الوسمُ 📘 يفصل المنقولَ عن المولَّدِ في تقريرِ الأب */
    if (!/gen\s*=\s*"📘/.test(ps))
      E(PG, 'أسئلةُ الكتابِ بلا وسمٍ يميّزها — فلا يفرّق الأبُ بين المنقولِ والمولَّد');
    /* وموضعُ كلِّ ابنٍ محفوظٌ وإلّا أُعيدت عليه أسئلةُ الكتابِ كلَّ جولة */
    if (!/localStorage\.setItem\(mwBookKey\(/.test(ps))
      E(PG, 'موضعُ الكتابِ لا يُحفَظ — فتُعاد عليه الأسئلةُ نفسُها كلَّ جولةٍ ولا يتقدّم فيه');
  }
  return out;
}

/* ── مولّداتُ القدرةِ الميكانيكيةِ موجودةٌ ومسجَّلة ──────────────────
   ملحقُ (٨) في كتابِ المستوى الثالثِ كشف ستّةَ أبوابٍ لا مولّدَ لها،
   فبُنيت. والعطبُ المحتمَلُ ليس أن تُحذَف الدوالّ — بل أن تبقى معرَّفةً
   ويسقط اسمُها من مصفوفةِ مجالِ sci، فلا تُستدعى أبدًا ولا يَظهر لذلك
   أثرٌ في الصفحة: جولةٌ تامّةٌ بلا سؤالِ سيرٍ واحد. فيُفحَص الأمران. */
/* ═══ 📒 اختبارُ المذكّرة — علومُ حسن ════════════════════════════════
   أرسل الأبُ (١٦ أكتوبر ٢٠٢٦) ستَّ عشرةَ صورةً من مذكّرةِ معلّمِه وقال:
   «حطّها تحت مسمّى اختبار المذكّرة، وحطّ ٤ أسئلة مقالي نفس المقالي
   اللي موجود بالصور». فبُني قسمٌ مستقلٌّ عن الفتريّ.

   وخمسةُ أشياءَ تنكسر فيه بلا صوت:
     ١) مجموعُ التوزيعِ يخالف العددَ المعلَن — تُعرَض أسئلةٌ والدرجةُ
        من غيرِ عددِها، ولا يُخطئ شيءٌ ظاهر.
     ٢) المجموعُ لا يُجمَع من جزأيه فتضيع درجاتُ المقاليّ.
     ٣) رقمٌ معروضٌ للطالبِ يخالف رقمًا آخرَ في الشاشةِ نفسِها — وهو
        عطبٌ وقع مرّتين في يومٍ واحدٍ في الفتريّ.
     ٤) بنكٌ يصغُر عن ضعفِ ما يُسحَب منه، فيتكرّر السؤالُ على الطالب —
        وهي الشكوى التي بُني هذا القسمُ أصلًا بعدها.
     ٥) نصٌّ رفعه الأبُ بطلبِه يعود صامتًا.
   ═══════════════════════════════════════════════════════════════════ */
/* ═══ ⏱️ تبويبُ موهبةَ موقوتٌ وحدَه ولا يَقطع ═══════════════════════
   طلبُ الأب (١٦ أكتوبر ٢٠٢٦) بعد أن قرّر تسجيلَ حسنٍ في المقياس:
   «أضف وضعًا موقوتًا لتبويب موهبة وحده».

   وأربعةٌ تنكسر هنا بلا صوت:
     ١) يعود التوقيتُ تابعًا للمفتاحِ العامِّ المطفأِ افتراضيًّا، فيتدرّب
        بلا وقتٍ وهو يظنّ أنّه يتدرّب عليه.
     ٢) يتسرّب التوقيتُ إلى بقيّةِ التبويبات، فيُقطَع على إخوتِه في
        أقسامٍ لم يُطلَب توقيتُها.
     ٣) يعود القطعُ عند انتهاءِ الزمن — والمطلوبُ ألّا يُقطَع، فهذه
        جولةُ تدريبٍ لا امتحانُ جهوزيّة.
     ٤) يسقط التنبيهُ بأنّ الزمنَ اجتهادٌ لا رقمٌ رسميّ، فيُقرَأ كأنّه
        زمنُ موهبةَ المعتمَد.
   ═══════════════════════════════════════════════════════════════════ */
/* ═══ 🧩 الجمل — جملُ كتابِه يرتّبها بنفسِه ═════════════════════════════
   نقاشُ الأب (٢٠–٢١ أكتوبر ٢٠٢٦): «وش رايك لو نحط لهم جمل يحفظونها…
   الأربعة إنجليزي من كتبهم وتنفعهم في التعبير وكذلك محادثة»، ثمّ:
   «أبدا».

   وقراءةُ تقاريرِهم هي التي رسمت الشكل: ترتيبُ الكلماتِ (بناء) ضعيفٌ
   عندهم بخلافِ إكمالِ الفراغ (استرجاع) — سعودٌ ١/٨ وحسنٌ ٦/١٦ — وهو
   عينُ ما يُحتاج في التعبيرِ والمحادثة. فالصفحةُ ترتيبُ كلماتٍ لا غير.

   وأربعةٌ تنكسر هنا بلا صوت:
     ١) تُبنى الجملُ من كتابِ ابنٍ آخر، فيُسأل عمّا لم يدرسْه.
     ٢) يسقط التدرّجُ بالطول، فيُستقبَل رابعٌ ابتدائيٌّ بجملةٍ من عشرِ
        كلماتٍ — وهو ما أهرب سعودًا من القسمِ القديمِ بعد محاولتَين.
     ٣) تسقط عتبةُ الإتقان، فتخرج الجملةُ بصحّةٍ واحدةٍ أو بصحّتَين في
        دقيقةٍ واحدة.
     ٤) تُحفَظ الجولةُ بدرجة، فتدخل متوسّطَ الإنجليزيِّ وهي تدريب. */
function sentencesPath(){
  const out = [];
  const F = 'sentences.html', p = path.join(ROOT, F);
  if (!fs.existsSync(p)) return [{ sev:'خطأ', file:F, msg:'الصفحةُ مفقودة' }];
  const src = fs.readFileSync(p, 'utf8');
  const E = m => out.push({ sev:'خطأ', file:F, msg:m });

  /* ── كلُّ ابنٍ وكتابُه ── */
  const BOOK = { saud:'BOOK_EN4', osama:'BOOK_EN5', rafeef:'BOOK_EN8', hasan:'BOOK_EN9' };
  const bm = /var BOOKS  = \{([^}]*)\}/.exec(src);
  if (!bm) E('جدولُ الكتبِ لا يُقرأ');
  else for (const kid of Object.keys(BOOK))
    if (!new RegExp(kid + ':"' + BOOK[kid] + '"').test(bm[1]))
      E('كتابُ ' + kid + ' ليس ' + BOOK[kid] + ' — فيُسأل عمّا لم يدرسْه');
  for (const f of ['book-en4.js','book-en5.js','book-en8.js','book-en9.js'])
    if (src.indexOf('src="' + f) < 0) E('لا تُحمّل ' + f + ' — فابنُه يفتح الصفحةَ فارغة');

  /* ── التدرّجُ بطولِ الجملة، ومستوًى يُشتقُّ لا يُكتَب ── */
  if (!/LEVELS = \[4, 6, 8, 99\]/.test(src))
    E('سلّمُ الأطوالِ ليس ٤ ثمّ ٦ ثمّ ٨ — والتدرّجُ هو ما يمنع هروبَ الصغير');
  const lv = /function levelOf\(all, credit\)\{([\s\S]*?)\n  \}/.exec(src);
  if (!lv) E('levelOf لا تُقرَأ');
  else {
    if (!/s\.n <= L && \(credit\[s\.en\]\|\|0\) < RETIRE/.test(lv[1]))
      E('المستوى لا يُشتقُّ من غيرِ المتقَنِ في طولِه — فإمّا يجمد أو يقفز');
    if (!/if\(left\.length\) return/.test(lv[1]))
      E('المستوى لا يرتفع حين يفرغ ما دونه');
  }
  /* ولا تُعرَض جملةٌ أطولُ من مستواه */
  if (!/s\.n <= L/.test(src)) E('لا قيدَ على طولِ الجملةِ المعروضة');

  /* ── الإتقانُ صحّتان في جولتَين ── */
  if (!/RETIRE = 2,/.test(src)) E('عتبةُ الإتقانِ ليست صحّتَين');
  const cr = /function creditOf\(rows\)\{([\s\S]*?)\n  \}/.exec(src);
  if (!cr) E('creditOf لا تُقرَأ');
  else if (!/if\(once\[k\]\) return;/.test(cr[1]) || !/once\[k\] = 1;/.test(cr[1]))
    E('الجولةُ الواحدةُ تُحتسب رصيدَين — فتخرج الجملةُ بصحّتَين في دقيقة');
  if (!/if\(okKeys\.indexOf\(s\.en\) < 0\) okKeys\.push\(s\.en\);/.test(src))
    E('الكتابةُ لا تمنع تكرارَ المفتاحِ في الجولةِ الواحدة');

  /* ── التمرينُ بناءٌ لا استرجاع ── */
  if (!/built\.map\(function\(p\)\{ return p\.w; \}\)\.join\(" "\) === target\.join\(" "\)/.test(src))
    E('الترتيبُ لا يُقابَل بالجملةِ الأصليّةِ كاملةً');
  if (!/🔀 رتّب الكلمات/.test(src)) E('لوحةُ الترتيبِ غيرُ معنونة');

  /* ── والحفظُ نشاطٌ بلا درجة، موسومٌ فيراه الأب ── */
  if (!/kind:"activity", sect:SECT, test:"جمل إنجليزي 🧩"/.test(src))
    E('الجولةُ لا تُحفَظ نشاطًا موسومًا — فتدخل متوسّطَ الإنجليزيِّ أو تغيب عن التقرير');
  if (!/correct:0, total:0/.test(src))
    E('الجولةُ تحمل درجةً — وهي تدريبٌ لا اختبار');
  if (!/okKeys:okKeys\.slice\(0,40\)/.test(src)) E('okKeys لا تُحفَظ — فلا رصيدَ للإتقان');
  if (!/meta->>sect=eq\." \+ SECT/.test(src))
    E('الرصيدُ لا يُقرأ من الخادم — فلا يتبع الابنَ إلى جهازٍ آخر');

  /* ── وبطاقتُها عند الأربعةِ جميعًا ── */
  const hp = path.join(ROOT, 'home.html');
  if (fs.existsSync(hp)){
    const h = fs.readFileSync(hp, 'utf8');
    const lit = EXTRACT.literalAfter(h, /(?:var|let|const)\s+SUBJECTS\s*=/, '{', '}');
    for (const kid of Object.keys(BOOK)){
      const mine = lit && EXTRACT.literalAfter(lit, new RegExp('(?:^|[{,])\\s*' + kid + '\\s*:\\s*'), '[', ']');
      if (!mine) { E('قائمةُ ' + kid + ' في home.html لا تُقرأ'); continue; }
      if (!/sentences\.html/.test(mine))
        E('لا بطاقةَ للجملِ عند ' + kid + ' — والقسمُ القديمُ هُجِر لأنّه بلا بطاقة');
    }
  }
  return out;
}

/* ═══ ساعةُ القسمِ تبدأ عند فتحِه لا عند بناءِ الصفحة ════════════════════
   بان في أثناء قراءةِ أرقامِ ٢٠ أكتوبر ٢٠٢٦ أنّ وقتَ كلِّ قسمٍ في
   صفحةِ القدراتِ يضمُّ وقتَ ما قبلَه: أقسامُها تُبنى كلُّها لحظةَ فتحِ
   الصفحة (buildAll)، وساعةُ القسمِ كانت تبدأ مع البناء. والدليلُ في
   البيانات: أربعةُ أقسامٍ في جلسةٍ واحدةٍ «بدايتُها» الثانيةُ نفسُها
   ودُرُّها متصاعدٌ (٦١ · ١١٧ · ١٥٤ · ٢٤٦).

   وضررُه ضِعفان: يقرأ الأبُ «٢٧ ثانيةً للسؤال» وحقيقتُها ستّ، وحارسُ
   النقرِ لا يُمسِك الأقسامَ المتأخّرةَ لأنّ وقتَها المنفوخَ يرفع
   متوسّطَها فوقَ العتبة — وهو أخطرُ من العرض. */
function sectionClockPath(){
  const out = [];
  const F = 'practice.html', p = path.join(ROOT, F);
  if (!fs.existsSync(p)) return [{ sev:'خطأ', file:F, msg:'مفقود' }];
  const src = fs.readFileSync(p, 'utf8');
  const E = m => out.push({ sev:'خطأ', file:F, msg:m });

  if (!/var __t0 = Date\.now\(\), __lastTs = __t0, __fastN = 0, __entered = false;/.test(src))
    E('علامةُ __entered غيرُ معلَنةٍ مع ساعةِ القسم');
  const en = /sec\._enter = function\(\)\{([\s\S]*?)\n  \};/.exec(src);
  if (!en) E('sec._enter مفقودة — فساعةُ القسمِ تبدأ مع بناءِ الصفحةِ ويرث كلُّ قسمٍ وقتَ ما قبلَه');
  else {
    if (!/__t0 = Date\.now\(\); __lastTs = __t0;/.test(en[1]))
      E('_enter لا تُصفّر الساعةَ — فهي معرَّفةٌ ولا تعمل');
    /* ولا تُصفَّر إلّا مرّةً: الخروجُ والعودةُ ليسا بابًا لإخفاءِ النقر */
    if (!/if\(__entered \|\| ended\) return;/.test(en[1]) || !/__entered = true;/.test(en[1]))
      E('_enter تُصفّر الساعةَ في كلِّ عودةٍ — فمن خرج ورجع أخفى نقرَه');
  }
  /* وتُنادى من موضعَين: بدءِ القسمِ الموقوت، وفتحِ التبويبِ مطلقًا */
  if (!/sec\._start = function\(\)\{\n    sec\._enter\(\);/.test(src))
    E('_start لا تُنادي _enter قبل شرطِ التوقيت');
  if (!/if\(typeof pan\._enter === "function"\) pan\._enter\(\);/.test(src))
    E('فتحُ التبويبِ لا يُنادي _enter — فالأقسامُ غيرُ الموقوتةِ تبقى على الساعةِ القديمة');
  /* وترتيبُها قبل _start في معالجِ التبويب */
  const i1 = src.indexOf('pan._enter();'), i2 = src.indexOf('pan._start();');
  if (i1 > -1 && i2 > -1 && i1 > i2)
    E('_enter تُنادى بعد _start في معالجِ التبويب — فالقياسُ يسبق التصفير');
  return out;
}

/* ═══ الجولةُ التي لم تبلغ العتبةَ تترك أثرًا ═══════════════════════════
   سؤال الأب (٢٠ أكتوبر ٢٠٢٦): «حسن يقول مختبر ٣ مرات اليوم ستيب»
   والقاعدةُ فيها محاولةٌ واحدة. والسببُ أنّ صفحةَ القدراتِ لا تحفظ
   جولةً أُجيب فيها عن أقلَّ من ثلاثةِ أسئلةٍ — ولا تترك لها أثرًا
   أبدًا. فيقول الابنُ «اختبرت» ولا يجد أبوه شيئًا، فيتّهم أحدُهما
   الآخرَ والخللُ في الشفرة.

   وهي علّةُ ٢٦ أغسطس نفسُها، عولجت في صفحةِ الاختباراتِ ولم تُعالَج
   هنا. والعلاجُ وسطٌ: العتبةُ تبقى (صفٌّ بدرجة «١ / ١» يرفع المتوسّطَ
   بغير حقّ) وما دونها يُحفَظ أثرًا بلا درجة.

   وثلاثةٌ تنكسر هنا بلا صوت:
     ١) يسقط الأثرُ فتعود الجولاتُ تضيع كما كانت.
     ٢) يحمل الأثرُ درجةً، فيدخل المتوسّطَ ويُسقِط مستوى الابن.
     ٣) يُحفَظ ولا يُعرَض، فلا يراه الأبُ — وهو الغرضُ كلُّه. */
function tryTracePath(){
  const out = [];
  const F = 'practice.html', p = path.join(ROOT, F);
  if (!fs.existsSync(p)) return [{ sev:'خطأ', file:F, msg:'مفقود' }];
  const src = fs.readFileSync(p, 'utf8');
  const E = (f, m) => out.push({ sev:'خطأ', file:f, msg:m });

  if (!/function saveTrace\(n\)\{/.test(src))
    E(F, 'saveTrace مفقودة — فجولةٌ أجاب فيها عن سؤالٍ أو سؤالَين تضيع بلا أثر');
  if (!/if\(n<3 \|\| !label \|\| n<=savedN\)\{ saveTrace\(n\); return; \}/.test(src))
    E(F, 'ما دون العتبةِ لا يُنادي saveTrace — فهي معرَّفةٌ ولا تعمل');

  const t = /function saveTrace\(n\)\{([\s\S]*?)\n  \}/.exec(src);
  if (!t) E(F, 'جسمُ saveTrace لا يُقرأ');
  else {
    const b = t[1];
    /* ── أثرٌ بلا درجةٍ البتّة ── */
    if (!/correct:0, total:0/.test(b))
      E(F, 'الأثرُ يحمل درجةً — فيدخل متوسّطَ الابنِ ويُسقِط مستواه');
    if (!/kind:"activity", sect:"try"/.test(b))
      E(F, 'الأثرُ ليس نشاطًا موسومًا — فلا يُستثنى من الحساب ولا يُعرَف في اللوحة');
    /* ── وحدودُه: لا قبل الإجابةِ الأولى ولا بعد بلوغِ العتبة ── */
    if (!/if\(!label \|\| n < 1 \|\| n >= 3 \|\| traced\) return;/.test(b))
      E(F, 'حدودُ الأثرِ غيرُ مضبوطة — فيُحفَظ لمن فتح ولم يُجب، أو يُزاحم الدرجة');
    if (!/traced = true;/.test(b))
      E(F, 'الأثرُ لا يُعلَّم أنّه حُفِظ — فمن غادر اللوحةَ مرّتين حُفِظ له أثران');
    if (!/answered:n, of:total/.test(b))
      E(F, 'الأثرُ لا يقول كم أجاب من كم — وهو كلُّ فائدتِه');
  }
  if (!/savedN = 0, pid = newPid\(\), traced = false;/.test(src))
    E(F, 'علامةُ traced غيرُ معلَنةٍ مع حالةِ الجولة');

  /* ── ويُعرَض في لوحةِ الأب، وإلّا حُفِظ ولا يراه أحد ── */
  const ip = path.join(ROOT, 'index.html');
  if (fs.existsSync(ip)){
    const ih = fs.readFileSync(ip, 'utf8');
    if (!/sect==="try"/.test(ih))
      E('index.html', 'الأثرُ لا يُعرَض في لوحةِ الأب — وهو الغرضُ من حفظِه');
    if (!/🚪 فتح وما كمّل/.test(ih))
      E('index.html', 'لا عنوانَ لقسمِ «فتح وما كمّل»');
    if (!/أجاب <b>\$\{m\.answered\}<\/b> من \$\{m\.of\}/.test(ih))
      E('index.html', 'سطرُ الأثرِ لا يقول كم أجاب من كم');
    /* ولا يختلط بقسمِ الدروسِ والفيديوهات */
    if (!/var acts=\(actBy\[name\]\|\|\[\]\)\.filter\(function\(a\)\{ return !\(a\.meta && a\.meta\.sect==="try"\); \}\)/.test(ih))
      E('index.html', 'الأثرُ يُعَدُّ درسًا مفتوحًا في قسمِ النشاط — فيختلط بما ليس منه');
  }
  return out;
}

/* ═══ 🎯 أخطائي — السؤالُ يعود بنصِّه حتّى يُتقِنه ═══════════════════════
   سؤال الأب (٢٠ أكتوبر ٢٠٢٦) عن سؤالٍ ثابتٍ في قائمة أخطاء حسن: «هذي
   من زمان ما تغيّرت… هل لا زال ما يعرفها؟». وكان الجواب نعم. فقال
   «سوّه» لقسمٍ يعيد عليه أخطاءه بنصّها مع الشرح، ولا يخرج السؤالُ إلّا
   بصحّتَين.

   وأربعةٌ تنكسر هنا بلا صوتٍ ولا رسالةِ خطأ:
     ١) يُقيَّد الطلبُ بأحدثِ الصفوفِ مطلقًا بدل جلساتِ الاختبار، فيرجع
        بلا جلسةٍ واحدةٍ ويُقال للابنِ «ما عندك أخطاء» وله مئةٌ وستّون.
        (وقعت: أحدثُ جلسةِ اختبارٍ عند أسامةَ ترتيبُها ١٨٣٨.)
     ٢) تسقط قاعدةُ المرّتين فيخرج السؤالُ بصحّةٍ واحدة.
     ٣) تُحتسب الجولةُ الواحدةُ رصيدَين، فيخرج بصحّتَين في دقيقة.
     ٤) لا يُحفَظ التقدّمُ في الخادم، فيضيع عند تغيير الجهاز — وهي علّةُ
        صندوقِ الأخطاءِ القديمِ (missAdd) الذي يسكن ذاكرةَ الجهازِ وحدَه. */
function myErrPath(){
  const out = [];
  const F = 'quiz.html', p = path.join(ROOT, F);
  if (!fs.existsSync(p)) return [{ sev:'خطأ', file:F, msg:'مفقود' }];
  const src = fs.readFileSync(p, 'utf8');
  const E = m => out.push({ sev:'خطأ', file:F, msg:m });

  /* ── القسمُ موصولٌ: تبويبٌ ولوحةٌ ونداء ── */
  if (!/data-tab="myerr">أخطائي 🎯</.test(src)) E('لا تبويبَ لـ«أخطائي» — فلا يصل إليه الابن');
  if (!/<section class="panel" id="myerr"/.test(src)) E('لا لوحةَ للقسم');
  if (!/if\(b\.dataset\.tab==="myerr" && !meBuilt\) renderMyErr\(\);/.test(src))
    E('التبويبُ لا يُنادي renderMyErr — فيُفتَح على فراغ');
  if (!/async function renderMyErr\(\)/.test(src)) E('renderMyErr مفقودة');

  /* ── المصدرُ جلساتُ «اختبر نفسك» لا أحدثُ الصفوفِ مطلقًا ── */
  if (!/&or=\(en_total\.gt\.0,ma_total\.gt\.0\)&order=created_at\.desc&limit=/.test(src))
    E('الطلبُ غيرُ مقيَّدٍ بجلساتِ الاختبار — فسجلُّ الكلماتِ والنطقِ يزحمه فيرجع فارغًا');
  if (!/meta->>sect=eq\." \+ ME_SECT/.test(src))
    E('رصيدُ الإتقانِ لا يُقرأ من الخادم — فالتقدّمُ لا يتبع الابنَ إلى جهازٍ آخر');

  /* ── قاعدةُ المرّتين ── */
  if (!/var ME_SECT = "myerr", ME_RETIRE = 2,/.test(src))
    E('عتبةُ الإتقانِ ليست مرّتين — وهو نصُّ ما طلبه الأب');
  if (!/if\(got >= ME_RETIRE\) return;/.test(src))
    E('الرصيدُ لا يُقاس بالعتبةِ — فلا يخرج السؤالُ أبدًا أو يخرج بلا إتقان');
  /* والجولةُ الواحدةُ رصيدٌ واحدٌ عند القراءةِ وعند الكتابةِ جميعًا */
  const cr = /var credit = \{\};([\s\S]*?)\n    \}\);/.exec(src);
  if (!cr) E('حسابُ الرصيدِ لا يُقرأ');
  else {
    if (!/var t = when\(x\), once = \{\};/.test(cr[1]) || !/if\(once\[k\]\) return;/.test(cr[1]))
      E('الجولةُ الواحدةُ تُحتسب أكثرَ من رصيد — فيخرج السؤالُ بصحّتَين في دقيقة');
    if (!/if\(t <= e\.last\) return;/.test(cr[1]))
      E('الصوابُ قبلَ الخطأِ يُحتسب — فسؤالٌ أخطأه أمسِ يُعَدُّ متقَنًا بصوابِ الشهرِ الماضي');
  }
  if (!/if\(okKeys\.indexOf\(r\.it\.key\) < 0\) okKeys\.push\(r\.it\.key\);/.test(src))
    E('الكتابةُ لا تمنع تكرارَ المفتاحِ في الجولةِ الواحدة');

  /* ── يُعاد بنصِّه ومعه شرحُه ── */
  if (!/opts = b\.q\[1\]\.slice\(\); ci = b\.q\[2\]; exp = b\.q\[3\] \|\| "";/.test(src))
    E('الشرحُ لا يُؤخَذ من البنك — وقد طلب الأبُ أن يعود السؤالُ «بنصّها مع الشرح»');
  if (!/else \{ meLost\+\+; return; \}/.test(src))
    E('سؤالٌ بلا خياراتٍ معروفةٍ قد يُلفَّق — والأصلُ أن يُحصى ويُقال');
  /* ولا يُبنى سؤالٌ بخيارٍ واحدٍ أو بجوابٍ خارجَ الخيارات */
  if (!/if\(!opts \|\| opts\.length < 2 \|\| ci == null \|\| !opts\[ci\]\)\{ meLost\+\+; return; \}/.test(src))
    E('لا حارسَ على سلامةِ الخيارات — فقد يُعرَض سؤالٌ بلا جوابٍ صحيح');

  /* ── والجولةُ تدور فلا تجمد على الثمانيةِ نفسِها ── */
  if (!/function meRound\(queue, n\)/.test(src)) E('meRound مفقودة — فالجولةُ ترتيبٌ ثابت');
  const mr = /function meRound\(queue, n\)\{([\s\S]*?)\n  \}/.exec(src);
  if (mr){
    if (!/sort\(function\(a,b\)\{ return b\.last - a\.last; \}\)/.test(mr[1]))
      E('الجولةُ لا تُقدّم أحدثَ الأخطاء — فما أخطأه أمسِ يُدفَن خلف ما أخطأه قبل شهور');
    if (!/Math\.random\(\)/.test(mr[1]))
      E('لا قرعةَ في الجولة — فتخرج الثمانيةُ نفسُها في كلِّ مرّة ولا يصل إليه الباقي');
  }

  /* ── والتقدّمُ يُحفَظ موسومًا فيراه الأبُ في تقريره ── */
  if (!/sect:ME_SECT, test:"أخطائي 🎯"/.test(src))
    E('الجولةُ لا تُحفَظ باسمٍ ووسمٍ — فلا تظهر للأبِ ولا تُقرأ في الجولةِ القادمة');
  if (!/okKeys:okKeys\.slice\(0, 60\)/.test(src))
    E('okKeys لا تُحفَظ — فلا رصيدَ للإتقان');
  if (!/kind:"activity"/.test(src.slice(src.indexOf('async function meSave'), src.indexOf('async function renderMyErr'))))
    E('صفُّ الجولةِ ليس نشاطًا — فيدخل متوسّطاتِ الموادِّ وهو تدريبٌ على الأخطاء');
  return out;
}

/* ═══ كلُّ مادّةٍ في لوحةِ الأبِ مطويّةٌ تُفتَح بالضغط ════════════════════
   طلب الأب (٢٠ أكتوبر ٢٠٢٦): «شوف التقرير حقي، يبي كل مادة تكون
   مقفلة… مثلا العلوم أضغط عليه تطلع لي اختباراته، أضغط مرة ثانية
   يسكر. نفس نظام الخمسة الطلاب اللي عندي الأولاد».

   وهي العلّةُ التي شكا منها قبلُ في ٢٤ سبتمبر («صفحة المتابعة
   متعبة… خلّ التقارير مسكّرة وأنا أفتح الي أبي») فطُويت بطاقاتُ
   الأبناء؛ ثمّ طالت البطاقةُ المفتوحةُ حتّى صارت موادُّها هي الزحمة:
   حسنٌ وحدَه ثماني موادَّ فيها خمسةٌ وستّون اختبارًا متتابعة.

   وثلاثةٌ تنكسر هنا بلا صوت:
     ١) تخرج المادّةُ مفتوحةً، فتعود الزحمةُ وقد ظنّ أنّه أصلحها.
     ٢) يُكتَب السطرُ المطويُّ بلا متوسّطٍ ولا عدد، فلا يُغني طيُّه
        عن فتحِه — ويفتحها كلَّها كما كان.
     ٣) يختلط مفتاحُ حفظِ المادّةِ بمفتاحِ بطاقةِ الابن، فيفتح «علوم»
        عند حسنٍ فتُفتَح عند رفيفَ أيضًا. */
function subjFoldPath(){
  const out = [];
  const F = 'index.html', p = path.join(ROOT, F);
  if (!fs.existsSync(p)) return [{ sev:'خطأ', file:F, msg:'مفقود' }];
  const src = fs.readFileSync(p, 'utf8');
  const E = m => out.push({ sev:'خطأ', file:F, msg:m });

  /* ── المادّةُ عنصرُ طيٍّ لا سطرٌ ثابت ── */
  const subjTags = src.match(/<details class="subj" data-subj="[^"]*"/g) || [];
  if (subjTags.length < 2)
    E('الموادُّ لا تُبنى عناصرَ طيٍّ (details.subj) — فتخرج مفتوحةً كما كانت');
  /* ولا واحدةَ منها تُولَد مفتوحة */
  if (/<details class="subj"[^>]*\bopen\b/.test(src))
    E('مادّةٌ تُبنى وفيها open — فتخرج مفتوحةً والمطلوبُ أن تكون مقفلة');

  /* ── ومفتاحُها «الابن|المادّة» لا اسمُ المادّةِ وحدَه ── */
  for (const t of subjTags)
    if (!/data-subj="\$\{name\}\|/.test(t))
      E('مفتاحُ مادّةٍ لا يبدأ باسمِ الابن (' + t.slice(0, 60) + ') — فتُفتَح عند إخوتِه معه');

  /* ── والسطرُ المطويُّ يحمل ما يُغني عن فتحِه ── */
  const sums = src.match(/<summary><span class="subjsum">[\s\S]{0,400}?<\/summary>/g) || [];
  if (sums.length !== subjTags.length)
    E('عددُ سطورِ المواد ' + sums.length + ' وعناصرُها ' + subjTags.length);
  sums.forEach(function(s, i){
    if (!/المتوسط/.test(s)) E('سطرُ المادّةِ ' + (i + 1) + ' بلا متوسّط — فلا يُغني طيُّه عن فتحِه');
    /* المنهجُ يعدّ اختبارات، وفوقَ الصفِّ جلسات، والتجريبيُّ محاولات */
    if (!/اختبارًا|جلسة|محاولة/.test(s)) E('سطرُ المادّةِ ' + (i + 1) + ' بلا عددٍ يُغني عن فتحِه');
    if (!/class="chev"/.test(s)) E('سطرُ المادّةِ ' + (i + 1) + ' بلا سهمٍ يدلّ على أنّه يُفتَح');
  });

  /* ── والجوفُ في .sbody وإلّا لم يُطوَ معها ── */
  if ((src.match(/<div class="sbody">/g) || []).length !== subjTags.length)
    E('ليس لكلِّ مادّةٍ جوفٌ (.sbody) — فما لا يُطوى معها يبقى معروضًا');

  /* ── والتوصيلُ: تُقرأ الحالةُ وتُحفَظ، بمفتاحٍ غيرِ مفتاحِ البطاقات ── */
  if (!/function wireSubjects\(\)/.test(src))
    E('wireSubjects مفقودة — فلا تُحفَظ المادّةُ المفتوحةُ ولا تُستعاد');
  if (!/\n  wireSubjects\(\);/.test(src))
    E('wireSubjects لا تُنادى من wireCards — فهي معرَّفةٌ ولا تعمل');
  if (!/var SUBJ_KEY = "rafeef_open_subj_v1";/.test(src))
    E('مفتاحُ حفظِ المواد مفقود');
  if (/SUBJ_KEY\s*=\s*OPEN_KEY|"rafeef_open_cards_v1"[\s\S]{0,40}SUBJ_KEY/.test(src))
    E('مفتاحُ المواد هو مفتاحُ البطاقات نفسُه — فطيُّ مادّةٍ يطوي بطاقةَ ابن');
  const wire = /function wireSubjects\(\)\{([\s\S]*?)\n\}/.exec(src);
  if (wire){
    if (!/OPEN_SUBJ\.indexOf\(k\) >= 0\) el\.open = true;/.test(wire[1]))
      E('wireSubjects لا تفتح ما كان مفتوحًا — فيفتحه الأبُ كلَّ مرّةٍ من جديد');
    if (!/addEventListener\("toggle"/.test(wire[1]))
      E('wireSubjects لا تُنصِت للطيّ — فلا يُحفَظ ما يفتحه');
    if (!/writeOpenSubj\(OPEN_SUBJ\);/.test(wire[1]))
      E('wireSubjects لا تكتب الحالة');
  } else E('جسمُ wireSubjects لا يُقرأ');

  /* ── وبطاقاتُ الأبناءِ باقيةٌ على حالها: هي الأصلُ المقيسُ عليه ── */
  if (!/<details class="card" data-kid=/.test(src))
    E('بطاقاتُ الأبناءِ لم تعد عناصرَ طيّ — وهي النظامُ الذي طلب أن تُحاكيه المواد');

  /* ═══ والطبقةُ الثانية: كلُّ قسمٍ في البطاقةِ مطويٌّ كذلك ══════════
     طلب الأب (٢٠ أكتوبر ٢٠٢٦): «سكّرها كلها حتى تحصيلي وستيب كل شي».
     فالأقسامُ تُطوى من .weak بعد الرسم، وكلُّ اختبارٍ تجريبيٍّ يُطوى
     وحدَه — فتحصيليٌّ وستيبُ سطران يُفتَح كلٌّ منهما على حدة. */
  if (!/function foldSections\(root\)/.test(src))
    E('foldSections مفقودة — فالأقسامُ تخرج مفتوحةً كما كانت');
  if (!/\n  foldSections\(content\);/.test(src))
    E('foldSections لا تُنادى من wireSubjects — فهي معرَّفةٌ ولا تعمل');
  const fold = /function foldSections\(root\)\{([\s\S]*?)\n\}/.exec(src);
  if (fold){
    const f = fold[1];
    if (!/el\.tagName !== "DIV" \|\| !el\.classList\.contains\("weak"\)/.test(f))
      E('foldSections لا تقصر الطيَّ على أقسامِ .weak — فتطوي ما ليس قسمًا');
    if (!/querySelector\(":scope > \.wt"\)/.test(f))
      E('عنوانُ القسمِ لا يُقرأ من .wt المباشر — فقد يُؤخذ عنوانُ قسمٍ داخلَ قسم');
    if (!/d\.className = "sect";/.test(f))
      E('القسمُ لا يُبنى details.sect');
    if (/d\.open\s*=\s*true/.test(f))
      E('foldSections تفتح القسمَ عند بنائِه — والمطلوبُ أن يخرج مقفلًا');
    if (!/body\.appendChild\(el\);/.test(f))
      E('جسمُ القسمِ لا يُنقَل إلى جوفِ الطيّ — فيبقى معروضًا خارجَه');
    if (!/wt\.remove\(\);/.test(f))
      E('عنوانُ القسمِ يبقى مكرَّرًا داخلَه وفوقَه');
    if (!/FOLD_WORD/.test(f) || !/arCount\(n, f\[0\], f\[1\], f\[2\], f\[3\]\)/.test(f))
      E('عددُ القسمِ لا يُصرَّف — فيُكتَب «٨ بندات» ونحوُها');
    if (/\+ " " \+ arCount|n \+ " " \+ arCount|\(n > 2 \? n/.test(f))
      E('العددُ يُلصَق مع arCount وهي تُلحِقه بنفسِها — فيُكتَب مرّتين');
  } else E('جسمُ foldSections لا يُقرأ');

  /* ── والطيُّ يحفظ القسمَ كما يحفظ المادّة ── */
  if (!/querySelectorAll\('details\.subj\[data-subj\], details\.sect\[data-sect\]'\)/.test(src))
    E('التوصيلُ لا يشمل الأقسام — فما يفتحه الأبُ منها لا يُحفَظ');

  /* ── وكلُّ اختبارٍ تجريبيٍّ مطويٌّ وحدَه ── */
  if (!/data-subj="\$\{name\}\|تجريبي \$\{t\}"/.test(src))
    E('الاختباراتُ التجريبيّةُ لا تُطوى واحدًا واحدًا — فتحصيليٌّ وستيبُ في كومةٍ واحدة');
  /* ── وكلمةُ العدِّ مُعلَنةٌ حيث يُعَدُّ غيرُ البنود ── */
  for (const [re, nm] of [[/data-fold-word="مادة"><div class="wt">📚 تقرير المنهج/, 'المنهج الدراسي'],
                          [/data-fold-word="اختبار"><div class="wt">📊 الاختبارات التجريبية/, 'الاختبارات التجريبية']])
    if (!re.test(src)) E('قسمُ «' + nm + '» بلا data-fold-word — فيُعَدُّ بنودًا لا موادَّ');
  return out;
}

/* ═══ أقسامٌ رُفعت: صفوفُها محجوبةٌ عن التقريرِ كلِّه ═══════════════════
   طلبُ الأب (١٩ أكتوبر ٢٠٢٦): «شِلّ من عندي في التقرير اختبارات موهبة
   حقّت الابتدائي اللي عند رفيف وحسن، وشِلّ من عندي جميع اختبارات
   الفتري، لأنها تسبّب لي زحمة».

   وهذا حارسٌ لعطبٍ لا صوتَ له: الصفوفُ باقيةٌ في القاعدةِ لا تُحذَف،
   فمتى سقطت القاعدةُ أو سقط نداؤها من المصفاةِ عادت ١٠٠٥ محاولاتٍ إلى
   التقريرِ بلا خطأٍ ولا رسالة (٧٢٣ فتريًّا و٢٨٢ كانجرو، يومَ القياس)
   — يفتح الأبُ صفحتَه فيجد الزحمةَ وقد رجعت. فيُقاس هنا على صفوفٍ
   موضوعةٍ باليد: ما يجب أن يُحجَب يُحجَب، وما يجب أن يبقى يبقى.

   والتقاطعُ هو الخطرُ الأكبر: «اختبار المذكّرة 📒» ليس فتريًّا،
   وكانجرو سعودٍ وأسامةَ من مستواهما — فلو وُسِّعت القاعدةُ سقط ما لم
   يُطلَب إسقاطُه. */
function retiredPath(){
  const out = [];
  const F = 'report-rules.js', p = path.join(ROOT, F);
  if (!fs.existsSync(p)) return [{ sev:'خطأ', file:F, msg:'مفقود' }];
  const src = fs.readFileSync(p, 'utf8');
  const E = (f, m) => out.push({ sev:'خطأ', file:f, msg:m });

  /* ── القاعدةُ تُنادى في المصفاةِ نفسِها، لا تُعلَن وتُترَك ── */
  if (!/retired: function\(row\)/.test(src))
    E(F, 'RR.retired مفقودة — فلا شيءَ يحجب ما رُفع');
  if (!/if\(self\.retired\(r\)\) return false;/.test(src))
    E(F, 'RR.usable لا تنادي retired — فالقاعدةُ معلَنةٌ ولا تعمل، وتعود الصفوفُ كلُّها');

  /* ── وتُقاس على صفوفٍ حقيقيّةِ الشكل ── */
  let RR = null;
  try {
    const box = { window: {} };
    vm.createContext(box);
    vm.runInContext(src, box);
    RR = box.window.RR;
  } catch(e){ E(F, 'تعذّر تحميل الملفّ: ' + e.message); return out; }
  if (!RR || typeof RR.retired !== 'function'){ E(F, 'RR.retired غيرُ قابلةٍ للنداء'); return out; }

  const CASES = [
    /* يُحجَب */
    ['حسن',  'رياضيات م٣ — الفتري 📝',        true,  'فتريُّ حسنٍ في الرياضيات'],
    ['حسن',  'إنجليزي م٣ — الفتري 📝',        true,  'فتريُّ حسنٍ في الإنجليزي'],
    ['رفيف', 'علوم م٢ — نماذج الفتري 📚',     true,  'نماذجُ فتريِّ رفيف'],
    ['سعود', 'إنجليزي خ٤ — الفتري 📝',        true,  'فتريُّ سعود'],
    ['أسامة','رياضيات خ٥ — الفتري 📝',        true,  'فتريُّ أسامة'],
    ['حسن',  'كانجرو — استدلال رياضي 🦘',     true,  'كانجرو حسن'],
    ['رفيف', 'كانجرو — فهم الصور 🦘',         true,  'كانجرو رفيف'],
    /* ولا يُحجَب */
    ['حسن',  'علوم م٣ — اختبار المذكّرة 📒',  false, 'اختبارُ المذكّرةِ — ليس فتريًّا'],
    ['حسن',  'موهبة م٣',                      false, 'موهبةُ حسنٍ بمستوى صفِّه'],
    ['رفيف', 'موهبة م٢',                      false, 'موهبةُ رفيفَ بمستوى صفِّها'],
    ['سعود', 'كانجرو — استدلال رياضي 🦘',     false, 'كانجرو سعودٍ — ابتدائيٌّ فهي مستواه'],
    ['أسامة','كانجرو — معرفة عامة 🦘',        false, 'كانجرو أسامةَ — ابتدائيٌّ فهي مستواه'],
    ['حسن',  'رياضيات م٣ — شامل ف١',          false, 'شاملُ الفصلِ الأوّل'],
    ['حسن',  'تقوية التفكير 🧠',              false, 'تقويةُ التفكير'],
    ['رفيف', 'كلمات إنجليزي 🔤',              false, 'كلماتُ الإنجليزي']
  ];
  for (const [kid, test, want, label] of CASES){
    let got;
    try { got = RR.retired({ student: kid, meta: { test: test } }); }
    catch(e){ E(F, 'RR.retired رمت على «' + test + '»: ' + e.message); continue; }
    if (!!got !== want)
      E(F, want ? ('لم يُحجَب ' + label + ' («' + test + '» عند ' + kid + ')')
                : ('حُجِب ' + label + ' («' + test + '» عند ' + kid + ') ولم يُطلَب حجبُه'));
  }
  /* وصفٌّ بلا اسمِ اختبارٍ لا يُحجَب بالخطأ */
  if (RR.retired({ student:'حسن', meta:{} }))
    E(F, 'صفٌّ بلا اسمِ اختبارٍ يُحجَب — فتسقط صفوفُ المحادثةِ والنطقِ وغيرُها');

  /* ── والصفحاتُ الثلاثُ تمرّ بالمصفاةِ وإلّا ظهر ما حُجِب في واحدةٍ منها ── */
  for (const f of ['report.html', 'child.html', 'home.html']){
    const q = path.join(ROOT, f);
    if (!fs.existsSync(q)) continue;
    if (!/RR\.usable\(/.test(fs.readFileSync(q, 'utf8')))
      E(f, 'لا تمرّ صفوفُها بـRR.usable — فما رُفع يظهر فيها وحدَها');
  }

  /* ═══ وبطاقةُ كانجرو عند الابتدائيَّين وحدَهما ═══════════════════════
     مادّتُها كتابُ المستوى الأوّل (٣–٥ ابتدائي). فحسنٌ ورفيفُ متوسّطان
     فلا بطاقةَ لهما — ولو عادت لأنتجت صفوفًا يحجبها التقريرُ فورًا،
     وهو عبثٌ صامت. وسعودٌ وأسامةُ ابتدائيّان فهي مستواهما وتبقى.

     ويُقرأ كلُّ ابنٍ من قائمتِه هو: فُحِص هذا أوّلَ مرّةٍ على قائمتَي
     حسنٍ ورفيفَ وحدَهما فمرّ وهو لا يفحص شيئًا (ليس لهما بطاقةٌ أصلًا)،
     وكانت البطاقةُ قد رُفعت من أسامةَ خطأً ولم يصِح به أحد. */
  const hp = path.join(ROOT, 'home.html');
  if (fs.existsSync(hp)){
    const h = fs.readFileSync(hp, 'utf8');
    const lit = EXTRACT.literalAfter(h, /(?:var|let|const)\s+SUBJECTS\s*=/, '{', '}');
    const KANG = { saud:true, osama:true, hasan:false, rafeef:false };
    if (!lit) E('home.html', 'قائمةُ SUBJECTS لا تُقرأ — فلا يُعرَف من له بطاقةُ كانجرو');
    else for (const kid of Object.keys(KANG)){
      const mine = EXTRACT.literalAfter(lit, new RegExp('(?:^|[{,])\\s*' + kid + '\\s*:\\s*'), '[', ']');
      if (!mine){ E('home.html', 'قائمةُ ' + kid + ' لا تُقرأ'); continue; }
      const has = /kangaroo\.html/.test(mine);
      if (has && !KANG[kid])
        E('home.html', 'بطاقةُ كانجرو عند ' + kid + ' — وهو متوسّطٌ، فتُنتج صفوفًا يحجبها التقرير');
      if (!has && KANG[kid])
        E('home.html', 'رُفعت بطاقةُ كانجرو عن ' + kid + ' — وهو ابتدائيٌّ فالكتابُ مستواه');
    }
  }
  return out;
}

/* ═══ الاختبارُ الناقصُ يُحفَظ بما أجابه لا بدرجةِ الورقةِ كلِّها ═══
   كشفها تشخيصُ سعودٍ في الإنجليزي (١٨ أكتوبر ٢٠٢٦): بدأ اختبارَه ٢٢
   مرّةً وترك خمسَ عشرةَ منها بعد سؤالٍ أو سؤالين، فحُفظت له «٠ من ٢٠»
   لكلِّ قُصاصة، فهبط متوسّطُه المعروضُ إلى ٣١٪ وهو في المكتملاتِ ٧٠٪.

   وهذا عطبٌ لا صوتَ له: الصفحةُ تعمل، والدرجةُ تُحفَظ، والرقمُ كذب.
   وكانت القاعدةُ تُحرَس في ثلاثةَ عشرَ موضعًا؛ ولمّا نُزعت اختباراتُ
   الفتريِّ كلُّها (١٩ أكتوبر ٢٠٢٦) بقي لها موضعٌ واحد: اختبارُ مذكّرةِ
   حسنٍ في العلوم — وهو طويلٌ (٢٤ بندًا) فالقُصاصةُ فيه أرجحُ لا أندر. */
function fatriPartialSave(){
  const out = [];
  const F = 'fatri-save.js', fp = path.join(ROOT, F);
  if (!fs.existsSync(fp)) return [{ sev:'خطأ', file:F, msg:'ملفُّ قاعدةِ الحفظِ الناقصِ مفقود' }];
  const rule = fs.readFileSync(fp, 'utf8');
  const E = (f, m) => out.push({ sev:'خطأ', file:f, msg:m });

  if (!/var MIN = 3;/.test(rule))
    E(F, 'عتبةُ الثلاثِ سقطت — وصفٌّ بدرجة «١ / ١» يرفع المتوسّطَ بغير حقّ');
  if (!/kind:"activity", sect:"fatri"/.test(rule))
    E(F, 'ما دون العتبةِ لم يَعُد أثرًا — فيدخل المتوسّطَ ويُسقطه');
  if (!/got: 0, total: 0,/.test(rule))
    E(F, 'صفُّ الأثرِ يحمل درجةً — وهو لا يُحسَب درجةً');
  if (!/var per = items \? \(\(tot - essay\) \/ items\) : 0;/.test(rule))
    E(F, 'درجةُ البندِ لا تُحسَب بعدَ نزعِ المقاليّات — فيُحاسَب على ما لم يبلغه');
  if (!/if\(o\.done \|\| \(items && n >= items\)\)/.test(rule))
    E(F, 'المكتملُ لم يَعُد يُحفَظ كاملًا');

  /* والموضعُ الباقي: كلُّ حفظٍ يمرُّ على القاعدة */
  const SITES = [
    ['science9.html', 'علوم م٣ — اختبار المذكّرة 📒']
  ];
  for (const [f, label] of SITES) {
    const p = path.join(ROOT, f);
    if (!fs.existsSync(p)) { E(f, 'مفقود'); continue; }
    const src = fs.readFileSync(p, 'utf8');
    if (src.indexOf('saveScore("' + label + '", __fr.got, __fr.total') < 0)
      E(f, 'حفظُ «' + label + '» لا يمرُّ على FATRI.row — فتعود «٠ من الورقةِ كلِّها» لمن أجاب عن سؤال');
    if (src.indexOf('answered: Object.keys(answered).length') < 0)
      E(f, 'عددُ ما أجابه لا يُمرَّر إلى القاعدة');
  }

  /* ═══ والماضي: قُصاصةٌ محفوظةٌ لا تُعرَض آخرَ ورقةٍ حلَّها ═══
     الصفوفُ القديمةُ لا تُعدَّل، والمفتاحُ المنشورُ لا يَحذِف. فكانت
     صفحةُ سعودٍ تقول «خ٤ — الفتري 📝: 0/20» وآخرُ ورقةٍ أتمَّها 16/20.
     واختباراتُ الفتريِّ نُزعت، وصفوفُها باقيةٌ لا تُحذَف — فيبقى. */
  const RRF = 'report-rules.js', rrp = path.join(ROOT, RRF);
  if (fs.existsSync(rrp)) {
    const rr = fs.readFileSync(rrp, 'utf8');
    if (!/fatriPart:\s*function\(row\)/.test(rr))
      E(RRF, 'RR.fatriPart مفقودة — فلا يُعرَف صفُّ القُصاصةِ من صفِّ الورقة');
    if (!/if \(this\.fatriPart\(cur\) && !this\.fatriPart\(p\) && ok\(p\)\) return p;/.test(rr))
      E(RRF, 'curKeep لا تُفضّل الورقةَ التامّةَ على القُصاصة — فتبقى «٠ من ٢٠» آخرَ ما يراه الأب');
    if (!/var of = \(typeof m\.mcqTotal === "number" && m\.mcqTotal\) \? m\.mcqTotal : m\.total;/.test(rr))
      E(RRF, 'عددُ بنودِ الورقةِ يُقرأ من درجتِها — فورقةُ عشرةِ بنودٍ بعشرين درجةً تُعَدُّ كلُّها قُصاصة');
  }

  /* والملفُّ محمَّلٌ في كلِّ صفحةٍ تَحفظ */
  const PAGES = ['science9.html'];
  for (const p of PAGES) {
    const q = path.join(ROOT, p);
    if (!fs.existsSync(q)) continue;
    const src = fs.readFileSync(q, 'utf8');
    if (src.indexOf('src="fatri-save.js') < 0)
      E(p, 'لا تُحمّل fatri-save.js — فـFATRI غيرُ معرَّفةٍ ويسقط الحفظُ كلُّه');
  }
  return out;
}

/* ═══ حفظُ كلماتِ المنهجِ له مكانٌ باسمِه في التقرير ═══════════════
   سؤال الأب (١٨ أكتوبر ٢٠٢٦): «وين أحصل حفظ الكلمات والجمل حقّت
   المنهج عندي في التقرير؟».

   وكان لا يجده: اسمُ الجلسة «تثبيت إنجليزي و1 🔁» لا يبدأ باسمِ مادّةٍ
   ولا بـ«كلمات» ولا «قراءة»، فيسقط في child.html إلى دلوِ «الاختبارات
   التجريبية (قدرات/تحصيلي/STEP/كانجرو…)»، وفي report.html يصير سطرًا
   بين ألفٍ وخمسمئةِ جلسةٍ في «سجلّ الجلسات».

   وهذا بابٌ يُفقَد بالصمت: البطاقةُ تُحذَف أو يُعاد الصفُّ إلى الدلوِ
   العامّ ولا يَظهر خطأٌ في شيء — تبقى الصفحتان تعملان، ويبقى الأبُ
   لا يجد ما يسأل عنه. */
function studyCardPath(){
  const out = [];
  const R = 'report-rules.js', rp = path.join(ROOT, R);
  if (!fs.existsSync(rp)) return out;
  const rr = fs.readFileSync(rp, 'utf8');
  const E = (f, m) => out.push({ sev:'خطأ', file:f, msg:m });

  if (!/studyUnits:\s*function\(rows, student\)\{/.test(rr))
    E(R, 'RR.studyUnits مفقودة — وهي التجميعُ الذي تقرؤه الصفحتان معًا');
  if (!/m\.mode !== "memo" && m\.mode !== "sentences"/.test(rr))
    E(R, 'RR.studyUnits لا تَفرز صفوفَ «ثبّت» و«جمل» — فتدخلها صفوفُ أبوابٍ أخرى');
  if (!/\(m\.missed \|\| \[\]\)\.forEach/.test(rr))
    E(R, 'الكلماتُ المتعثّرةُ لا تُجمَع — وهي أنفعُ ما في الباب للأب');
  if (!/studyUnitName:\s*function\(id\)/.test(rr))
    E(R, 'لا اسمَ بديلٌ للوحدة — فتُعرَض «u1» للأب في الصفوفِ القديمة');

  /* الوحدةُ تحفظ وسمَها وعنوانَها، وإلّا عُرض «u1» إلى الأبد */
  const S = 'study-en4.js', sp = path.join(ROOT, S);
  if (fs.existsSync(sp)) {
    const st = fs.readFileSync(sp, 'utf8');
    const n = (st.match(/tag: TAG\(\), unitTitle:/g) || []).length;
    if (n !== 2) E(S, 'وسمُ الكتابِ وعنوانُ الوحدةِ يُحفظان في ' + n + ' موضعٍ لا اثنين (ثبّت وجمل)');
  }

  /* تقريرُ الأب: بطاقةٌ باسمِها، مركّبةٌ في المسارَين */
  const P = 'report.html', pp = path.join(ROOT, P);
  if (fs.existsSync(pp)) {
    const rh = fs.readFileSync(pp, 'utf8');
    if (!/function studyCardHtml\(student\)\{/.test(rh))
      E(P, 'بطاقةُ «حفظ كلمات المنهج وجمله» مفقودة');
    const mounts = (rh.match(/studyCardHtml\(current\)/g) || []).length;
    if (mounts !== 2)
      E(P, 'البطاقةُ مركّبةٌ في ' + mounts + ' مسارٍ لا اثنين — ومسارُ «بلا تفصيل مهارات» هو حالُ الابنِ الجديد');
    if (!/RR\.studyUnits/.test(rh))
      E(P, 'البطاقةُ لا تقرأ RR.studyUnits — فتختلف أرقامُها عن صفحةِ الابن');
  }

  /* صفحةُ الابن: دلوٌ خاصٌّ قبل أن يبلغ الدلوَ العامّ */
  const C = 'child.html', cp2 = path.join(ROOT, C);
  if (fs.existsSync(cp2)) {
    const ch = fs.readFileSync(cp2, 'utf8');
    if (!/studyAll\.push\(p\)/.test(ch))
      E(C, 'صفوفُ «ثبّت» و«جمل» لا تُفرَز — فتسقط في «الاختبارات التجريبية»');
    /* والفرزُ قبل otherMap لا بعده، وإلّا لم يُغنِ شيئًا */
    const iStudy = ch.indexOf('studyAll.push(p)');
    const iOther = ch.indexOf('(otherMap[t]=otherMap[t]||[]).push(p)');
    if (iStudy >= 0 && iOther >= 0 && iStudy > iOther)
      E(C, 'فرزُ الحفظِ يأتي بعد الدلوِ العامّ — فلا يصله صفٌّ أبدًا');
    if (!/📚 حفظ كلمات المنهج وجمله/.test(ch))
      E(C, 'لا قسمَ باسمِ «حفظ كلمات المنهج وجمله» في صفحةِ الابن');
    if (!/RR\.studyUnits\(studyAll/.test(ch))
      E(C, 'القسمُ لا يقرأ RR.studyUnits');
  }
  return out;
}

/* ═══ قراءةُ القطعة: درجةٌ تقيس القارئَ، وإجاباتٌ لا تضيع ═══════════
   بلاغ حسن (١٨ أكتوبر ٢٠٢٦): «أقرأها كاملة وتطلع كلّها خضراء إلّا
   كلمتين، وأتفاجأ أنّ نسبة القراءة ٣٢٪ · وأحلّ جميع الأسئلة ويطلع
   ما حليتها».

   وصفوفُه صدّقته في الاثنتين:
     · ١٧ أكتوبر ٠٦:٣٤ — نطق ٣٢ · دقّة ٢٠ · اكتمال ١٠٠ · «١٣٨ كلمة»
       في نصٍّ من ٣٣. والقطعةُ تُقرأ على دوراتٍ، وكلُّ دورةٍ تُقيَّم
       على النصِّ كلِّه، فتَعُدُّ ما لم يُقرأ فيها متروكًا. وقراءاتُه
       التي تمّت في دورةٍ واحدةٍ أعطته ٧٧–٨١.
     · جلسةُ فهد ١٢ أكتوبر (معرّفٌ واحد): «أجاب ٠ من ٣» ثمّ «٣ / ٣».

   وهذه حراسةُ ما لا يُحدِث خللُه خطأً ظاهرًا: الصفحةُ تعمل، والأرقامُ
   تخرج، وكلُّها كذب. */
function readingScore(){
  const out = [];
  const F = 'reading.html', p = path.join(ROOT, F);
  if (!fs.existsSync(p)) return out;
  const src = fs.readFileSync(p, 'utf8');
  const E = m => out.push({ sev:'خطأ', file:F, msg:m });

  /* ـ الدرجةُ من أرقامِ القطعةِ لا من أرقامِ الدورة ـ */
  if (!/var acc = Math\.round\(sum\/readCount\);/.test(src))
    E('الدقّةُ لم تَعُد متوسّطَ درجاتِ الكلماتِ المطابَقة — فإن عادت لدقّةِ الدورةِ تبعت تقطيعَ المايك');
  if (!/var pron = Math\.round\(0\.6\*acc \+ 0\.2\*\(flu==null\?acc:flu\) \+ 0\.2\*\(comp==null\?100:comp\)\);/.test(src))
    E('درجةُ النطقِ لم تَعُد مركَّبةً من أرقامِ القطعة — وpronunciationScore للدورةِ يحمل اكتمالَها هي');
  if (!/var comp = refCount \? Math\.round\(100\*readCount\/refCount\) : null;/.test(src))
    E('الاكتمالُ لم يَعُد ما طابقَ النصَّ على عددِ كلماته');
  if (!/return et!=="Omission" && et!=="Insertion";/.test(src))
    E('المتروكاتُ عادت تدخل في الحساب — وهي وهمُ الدورةِ لا قراءةُ الابن');
  if (!/var wordsHtml = refWordsArr\.map\(/.test(src))
    E('الكلماتُ المعروضةُ لم تَعُد كلماتِ النصِّ مرّةً واحدة — فتتكرّر القطعةُ أمامه أربعَ مرّات');
  if (!/words:readCount, refWords:refCount/.test(src))
    E('المحفوظُ words عاد مجموعَ ما رجّعته الدورات — وwpm مبنيّةٌ عليه فتخرج سرعةٌ لا يقولها بشر');
  /* ولا يُحفَظ صفرٌ لمن لم تُطابَق من قراءته كلمة */
  if (!/if\(!readCount\)\{ _noWords\(\); return; \}/.test(src))
    E('دوراتٌ رجعت بمتروكاتٍ فقط تُحفَظ درجةَ صفرٍ بدل أن تُعدّ إخفاقَ التقاط');

  /* ـ وإجاباتُه تُحفَظ قبل أن تُمحى ـ */
  if (!/if\(curLang === b\.dataset\.lang\) return;/.test(src))
    E('ضغطُ تبويبِ اللغةِ نفسِها يُعيد البناءَ فيمحو إجاباتِه');
  if (!/saveAllSections\(\);/.test(src))
    E('تبديلُ اللغةِ يَمحو الأقسامَ بلا حفظ — و_leave للقسمِ دالّةٌ فارغةٌ عمدًا فلا حافظَ غيرُه');
  if (!/function saveAllSections\(\)\{[\s\S]{0,400}?f\._save\(\)/.test(src))
    E('saveAllSections لا تُنادي _save — فهي اسمٌ بلا فعل');
  if (!/fn\("hidden"\)/.test(src) || !/fn\("pagehide"\)/.test(src))
    E('hookLeaveSave لا تُفرّق بين الخروجِ والاختفاء — ومن لا يُفرّق يكتب «لم يُجب» لمن قُفل جهازُه');
  if (!/hookLeaveSave\(renderRead, function\(why\)\{ savePartial\(\); if\(why==="pagehide"\) saveActivity\(\); \}\);/.test(src))
    E('لقطةُ «لم يُجب» تُكتَب عند الاختفاء — وهو يعود بعدها ويُكمل');

  /* ـ والتقريرُ لا يَعرض لقطةً تجاوزها صاحبُها ـ */
  const C = 'child.html', cp2 = path.join(ROOT, C);
  if (fs.existsSync(cp2)) {
    const c = fs.readFileSync(cp2, 'utf8');
    const Ec = m => out.push({ sev:'خطأ', file:C, msg:m });
    if (!/const _scoredRead=\{\};/.test(c) || !/!_scoredRead\[String\(x\.meta\.pid\|\|""\)\.replace\(\/_act\$\/,""\)\]/.test(c))
      Ec('أثرُ القراءةِ يُعرَض ولو كان لجلستِه صفُّ درجة — فيقرأ «لم يُجب» بجانبِ درجتِه الكاملة');
    if (!/p\.meta\.noMic\?`تعذّر المايك/.test(c))
      Ec('يُقال «فتح الأسئلة ولم يُجب» لمن أعياه المايك — وهو خبرُ عطلٍ لا تهمةُ كسل');
  }
  return out;
}

/* ═══ الدراساتُ الإسلاميّةُ — خامسُ أسامة ══════════════════════════
   أرسل الأبُ (١٧ أكتوبر ٢٠٢٦) صورَ فهرسِ الكتابِ وقال: «حطّ له أسئلة».
   والصفحةُ بُنِيت من آلةِ science5.html نفسِها، فما يحرسها هنا ليس
   شكلَ السؤالِ (يكفيه الفحصُ العامُّ وbankAnswerIndex) بل مطابقةُ
   المقرَّرِ للفهرس: ثلاثةُ أبوابٍ وأحدَ عشرَ بنكًا وثلاثةُ شوامل.
   وأخصُّ ما يُحرَس ثلاثةٌ لا يُحدِث اختلالُها خطأً ظاهرًا:
     · درسٌ في CFG بلا موضعٍ في REMTOPICS — فالعلاجيُّ يعمى عنه.
     · شاملُ بابٍ يسحب من بنكِ بابٍ آخر — فيُسأل عن الفقهِ في التوحيد.
     · سؤالٌ واحدٌ في بنكين — والأبوابُ متجاورةٌ (الذِّكرُ في الحديث،
       والخشوعُ في التوحيدِ والفقه) فالتكرارُ وارد. */
function islamic5Path(){
  const out = [];
  const F = 'islamic5.html', p = path.join(ROOT, F);
  if (!fs.existsSync(p)) { out.push({ sev:'خطأ', file:F, msg:'الصفحةُ مفقودة' }); return out; }
  const E = m => out.push({ sev:'خطأ', file:F, msg:m });
  const html = fs.readFileSync(p, 'utf8');

  const ctx = makeCtx();
  const { inline, srcs } = scripts(html);
  for (const s of srcs){
    const q = path.join(ROOT, s);
    if (fs.existsSync(q)) { try { vm.runInContext(fs.readFileSync(q,'utf8'), ctx); } catch(e){} }
  }
  for (const src of inline){ try { vm.runInContext(src, ctx); } catch(e){} }

  const BANKS = ['T1','T2','T3','H1','H2','H3','H4','F1','F2','F3','F4'];
  /* البابُ ← بنوكُه ← شاملُه، كما في فهرسِ الكتاب */
  const BOOK = { at:['T1','T2','T3'], ah:['H1','H2','H3','H4'], af:['F1','F2','F3','F4'] };
  const LESSON = { t1:'T1', t2:'T2', t3:'T3', h1:'H1', h2:'H2', h3:'H3', h4:'H4',
                   f1:'F1', f2:'F2', f3:'F3', f4:'F4' };
  const MIN = 16;                     /* أقلُّ ما يُقبَل لئلّا يحفظَ البنك */

  const key = t => String(t).replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();
  const seen = {};
  let total = 0;
  BANKS.forEach(n => {
    const bk = ctx[n];
    if (!Array.isArray(bk)) { E('بنكُ ' + n + ' غيرُ موجود'); return; }
    total += bk.length;
    if (bk.length < MIN) E('بنكُ ' + n + ' فيه ' + bk.length + ' سؤالًا — وأقلُّ ما يُقبَل ' + MIN);
    bk.forEach((q, i) => {
      if (!Array.isArray(q) || !Array.isArray(q[1]) || q[1].length !== 3)
        { E(n + '#' + i + ': الخياراتُ ليست ثلاثة'); return; }
      const o = q[1].map(x => key(x));
      if (new Set(o).size !== 3) E(n + '#' + i + ': خياران متطابقان');
      if (o.some(x => !x)) E(n + '#' + i + ': خيارٌ فارغ');
      if (key(q[2]).length < 15) E(n + '#' + i + ': شرحٌ ناقصٌ أو مفقود');
      const k = key(q[0]);
      if (seen[k]) E('سؤالٌ واحدٌ في بنكين (' + seen[k] + ' و' + n + '): ' + k.slice(0, 45));
      else seen[k] = n;
    });
  });
  if (total < 200) E('مجموعُ أسئلةِ المادّةِ ' + total + ' — والمرصودُ أكثرُ من ٢٠٠');

  const CFG = ctx.CFG, CHAPS = ctx.CHAPS, REM = ctx.REMTOPICS;
  if (!CFG || !CHAPS || !Array.isArray(REM)) { E('CFG أو CHAPS أو REMTOPICS لم تُقرأ'); return out; }

  /* الأبوابُ الثلاثةُ وتبويباتُها */
  const chapIds = Object.keys(CHAPS);
  if (chapIds.join(',') !== 'tw,hd,fq')
    E('أبوابُ الكتابِ «' + chapIds.join(' · ') + '» والمتوقَّع التوحيدَ والحديثَ والفقه');
  const want = { tw:['t1','t2','t3','at'], hd:['h1','h2','h3','h4','ah'], fq:['f1','f2','f3','f4','af'] };
  Object.keys(want).forEach(c => {
    if (!CHAPS[c]) return;
    if ((CHAPS[c].ids || []).join(',') !== want[c].join(','))
      E('تبويباتُ بابِ «' + c + '»: ' + (CHAPS[c].ids||[]).join(' · '));
  });

  /* كلُّ درسٍ: وسمٌ عربيٌّ، وصفحةٌ في الكتاب، وموضعٌ في العلاجيّ */
  const remIds = REM.map(t => t.id);
  Object.keys(LESSON).forEach(id => {
    const c = CFG[id];
    if (!c) { E('درسُ «' + id + '» مفقودٌ من CFG'); return; }
    if (!c.label || /[A-Za-z_]{4,}/.test(c.label)) E('وسمُ «' + id + '» لا يصلح لتقريرِ الأب: ' + c.label);
    if (!c.pg) E('درسُ «' + id + '» بلا رقمِ صفحةٍ من الكتاب');
    if (remIds.indexOf(id) < 0) E('درسُ «' + id + '» ليس في العلاجيِّ — فلا يُرصَد ضعفُه فيه أبدًا');
    const g = c.gens || [];
    if (g.length !== 1 || !g[0] || g[0].__bank !== LESSON[id])
      E('درسُ «' + id + '» لا يسحب من بنكِه ' + LESSON[id]);
  });
  REM.forEach(t => {
    if (!LESSON[t.id]) E('موضوعٌ في العلاجيِّ بلا درس: ' + t.id);
    if (!t.tip || String(t.tip).length < 120) E('نصيحةُ «' + t.id + '» قصيرةٌ لا تُغني عن مراجعة');
    if (!t.yt) E('درسُ «' + t.id + '» بلا بحثِ شرحٍ مرئيّ');
  });

  /* شاملُ كلِّ بابٍ من بنوكِ بابِه وحدَها — ولا بنكَ يتخلّف */
  Object.keys(BOOK).forEach(id => {
    const c = CFG[id];
    if (!c) { E('شاملُ «' + id + '» مفقودٌ من CFG'); return; }
    const got = (c.gens || []).map(g => g && g.__bank).filter(Boolean).sort();
    const exp = BOOK[id].slice().sort();
    if (got.join(',') !== exp.join(','))
      E('شاملُ «' + id + '» يسحب من ' + (got.join(' · ') || 'لا شيء') + ' والمتوقَّع ' + exp.join(' · '));
    if (c.n !== 12) E('أسئلةُ شاملِ «' + id + '» ' + c.n + ' لا اثنا عشر');
  });
  const allIds = ctx.ALL_IDS || [];
  if (allIds.slice().sort().join(',') !== 'af,ah,at')
    E('ALL_IDS «' + allIds.join(' · ') + '» — ومن تخلّف عنها لا يُغذّي العلاجيّ');

  /* ولا فتريَّ هنا: لم تصلني ورقةُ معلّمٍ في هذه المادّة */
  if (/renderFatri|FATRI_/.test(html))
    E('ظهر فتريٌّ في الصفحةِ ولا ورقةَ معلّمٍ بُنِي عليها');

  /* ولا اسمَ مادّةٍ أخرى في نصٍّ يقرأه الابن: بُنِيت هذه الصفحةُ من
     آلةِ science5.html، فخرجت أوّلَ مرّةٍ تقول «📖 في كتاب العلوم: ص ١٦». */
  if (/في كتاب العلوم/.test(html))
    E('الصفحةُ تُحيل الابنَ إلى «كتاب العلوم» — وهي الدراساتُ الإسلاميّة');
  if (/🔬 العلوم — /.test(html))
    E('ترويسةُ العلومِ بقيت في صفحةِ الإسلاميّة');

  /* وبطاقتُها في صفحةِ أسامة، وإلّا فصفحةٌ لا يصل إليها أحد */
  const hp = path.join(ROOT, 'home.html');
  if (fs.existsSync(hp) && !/href:"islamic5\.html"/.test(fs.readFileSync(hp, 'utf8')))
    out.push({ sev:'خطأ', file:'home.html', msg:'لا بطاقةَ للدراسات الإسلاميّة — الصفحةُ موجودةٌ ولا رابطَ إليها' });

  return out;
}

/* ═══ لغتي الخالدة — ثاني متوسّط (رفيف) ══════════════════════════════
   بُنِيت في ١٩ أكتوبر ٢٠٢٦ من خريطةِ الكتابِ التي أرسلها الأب. وهي
   مبنيّةٌ على آلةِ islamic5.html، وتلك مبنيّةٌ على آلةِ science5.html،
   فخطرُها أنّ اسمَ مادّةٍ أخرى يبقى في نصٍّ تقرأه البنت: خرجت
   islamic5.html أوّلَ مرّةٍ تقول «📖 في كتاب العلوم» لهذا السبب.

   وأسئلةُ هذه الصفحةِ على المهاراتِ الأربعِ في كلِّ وحدة: الإملاءُ
   والصنفُ والأسلوبُ والنحو. أمّا نصوصُ القراءةِ والاستماعِ والتحليلِ
   الأدبيِّ فلم تصلني صفحاتُها، فأسماؤها في مدخلِ كلِّ وحدةٍ بلا
   أسئلة — والحارسُ يُلزِم بذكرِها لئلّا تضيعَ البنتُ بين الكتابِ
   والصفحة. */
function lughati8Path(){
  const out = [];
  const F = 'lughati8.html', p = path.join(ROOT, F);
  if (!fs.existsSync(p)) { out.push({ sev:'خطأ', file:F, msg:'الصفحةُ مفقودة' }); return out; }
  const E = m => out.push({ sev:'خطأ', file:F, msg:m });
  const html = fs.readFileSync(p, 'utf8');

  const ctx = makeCtx();
  const { inline, srcs } = scripts(html);
  for (const s of srcs){
    const q = path.join(ROOT, s);
    if (fs.existsSync(q)) { try { vm.runInContext(fs.readFileSync(q,'utf8'), ctx); } catch(e){} }
  }
  for (const src of inline){ try { vm.runInContext(src, ctx); } catch(e){} }

  /* المهاراتُ الأربعُ × ثلاثُ وحدات */
  const SKILL = { I:'إملاء', S:'صنف', A:'أسلوب', N:'نحو' };
  const UNITS = ['1','2','3'];
  const BANKS = [];
  UNITS.forEach(u => Object.keys(SKILL).forEach(s => BANKS.push(s + u)));
  const LESSON = {};                                  /* درسٌ ← بنكُه */
  BANKS.forEach(n => { LESSON[n.toLowerCase()] = n; });
  const MIN = 16;                     /* أقلُّ ما يُقبَل لئلّا تحفظَ البنك */

  const key = t => String(t).replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();
  const seen = {};
  let total = 0;
  BANKS.forEach(n => {
    const bk = ctx[n];
    if (!Array.isArray(bk)) { E('بنكُ ' + n + ' غيرُ موجود'); return; }
    total += bk.length;
    if (bk.length < MIN) E('بنكُ ' + n + ' فيه ' + bk.length + ' سؤالًا — وأقلُّ ما يُقبَل ' + MIN);
    bk.forEach((q, i) => {
      if (!Array.isArray(q) || !Array.isArray(q[1]) || q[1].length !== 3)
        { E(n + '#' + i + ': الخياراتُ ليست ثلاثة'); return; }
      const o = q[1].map(x => key(x));
      if (new Set(o).size !== 3) E(n + '#' + i + ': خياران متطابقان');
      if (o.some(x => !x)) E(n + '#' + i + ': خيارٌ فارغ');
      if (key(q[2]).length < 15) E(n + '#' + i + ': شرحٌ ناقصٌ أو مفقود');
      const k = key(q[0]);
      if (seen[k]) E('سؤالٌ واحدٌ في بنكين (' + seen[k] + ' و' + n + '): ' + k.slice(0, 45));
      else seen[k] = n;
    });
  });
  if (total < 200) E('مجموعُ أسئلةِ المادّةِ ' + total + ' — والمرصودُ أكثرُ من ٢٠٠');

  const CFG = ctx.CFG, CHAPS = ctx.CHAPS, REM = ctx.REMTOPICS;
  if (!CFG || !CHAPS || !Array.isArray(REM)) { E('CFG أو CHAPS أو REMTOPICS لم تُقرأ'); return out; }

  /* الوحداتُ الثلاثُ وتبويباتُها — أربعُ مهاراتٍ ثمّ شاملُ الوحدة */
  const chapIds = Object.keys(CHAPS);
  if (chapIds.join(',') !== 'u1,u2,u3')
    E('وحداتُ الكتابِ «' + chapIds.join(' · ') + '» والمتوقَّع ثلاثًا: u1 وu2 وu3');
  UNITS.forEach(u => {
    const c = CHAPS['u' + u];
    if (!c) return;
    const want = ['i','s','a','n'].map(s => s + u).concat(['x' + u]);
    if ((c.ids || []).join(',') !== want.join(','))
      E('تبويباتُ الوحدةِ ' + u + ': ' + (c.ids||[]).join(' · ') + ' والمتوقَّع ' + want.join(' · '));
  });

  /* نصوصُ كلِّ وحدةٍ مذكورةٌ في مدخلِها — فهي في الكتابِ ولا أسئلةَ عليها،
     فلو سقطت أسماؤها ظنّت البنتُ أنّ الصفحةَ تُغني عن قراءتِها. */
  const TEXTS = {
    u1: ['وسائل النقل', 'رسّام القلب', 'التلفاز', 'تقنيٌّ', 'هاتفٌ دقيقٌ'],
    u2: ['أمانته', 'الصدقة والكوب', 'جحا والوليمة', 'الضيف الثقيل', 'الخطّاط'],
    u3: ['أسامة بن زيد', 'لقمان', 'سعود الفيصل', 'عمر بن الخطّاب', 'أسماء بنت أبي بكر']
  };
  Object.keys(TEXTS).forEach(c => {
    const u = (CHAPS[c] && CHAPS[c].unit) || '';
    if (!u) { E('مدخلُ الوحدةِ ' + c + ' فارغ'); return; }
    TEXTS[c].forEach(t => { if (u.indexOf(t) < 0) E('نصُّ «' + t + '» غيرُ مذكورٍ في مدخلِ ' + c); });
  });

  /* كلُّ درسٍ: وسمٌ عربيٌّ، وصفحةٌ في الكتاب، وموضعٌ في العلاجيّ */
  const remIds = REM.map(t => t.id);
  Object.keys(LESSON).forEach(id => {
    const c = CFG[id];
    if (!c) { E('درسُ «' + id + '» مفقودٌ من CFG'); return; }
    if (!c.label || /[A-Za-z_]{4,}/.test(c.label)) E('وسمُ «' + id + '» لا يصلح لتقريرِ الأب: ' + c.label);
    if (!/^لغتي م٢ — /.test(String(c.label || '')))
      E('وسمُ «' + id + '» لا يبدأ بـ«لغتي م٢ — » فلا يُفرَز في المادّةِ الصحيحةِ في التقرير: ' + c.label);
    if (!c.pg) E('درسُ «' + id + '» بلا رقمِ صفحةٍ من الكتاب');
    if (remIds.indexOf(id) < 0) E('درسُ «' + id + '» ليس في العلاجيِّ — فلا يُرصَد ضعفُها فيه أبدًا');
    const g = c.gens || [];
    if (g.length !== 1 || !g[0] || g[0].__bank !== LESSON[id])
      E('درسُ «' + id + '» لا يسحب من بنكِه ' + LESSON[id]);
  });
  REM.forEach(t => {
    if (!LESSON[t.id]) E('موضوعٌ في العلاجيِّ بلا درس: ' + t.id);
    if (!t.tip || String(t.tip).length < 120) E('نصيحةُ «' + t.id + '» قصيرةٌ لا تُغني عن مراجعة');
    if (!t.yt) E('درسُ «' + t.id + '» بلا بحثِ شرحٍ مرئيّ');
  });

  /* شاملُ كلِّ وحدةٍ من بنوكِ وحدتِها الأربعةِ — ولا بنكَ يتخلّف */
  UNITS.forEach(u => {
    const id = 'x' + u, c = CFG[id];
    if (!c) { E('شاملُ الوحدةِ ' + u + ' مفقودٌ من CFG'); return; }
    const got = (c.gens || []).map(g => g && g.__bank).filter(Boolean).sort();
    const exp = Object.keys(SKILL).map(s => s + u).sort();
    if (got.join(',') !== exp.join(','))
      E('شاملُ «' + id + '» يسحب من ' + (got.join(' · ') || 'لا شيء') + ' والمتوقَّع ' + exp.join(' · '));
    if (c.n !== 12) E('أسئلةُ شاملِ «' + id + '» ' + c.n + ' لا اثنا عشر');
  });
  const allIds = ctx.ALL_IDS || [];
  if (allIds.slice().sort().join(',') !== 'x1,x2,x3')
    E('ALL_IDS «' + allIds.join(' · ') + '» — ومن تخلّف عنها لا يُغذّي العلاجيّ');

  /* وحفظُ العلاجيِّ باسمِ هذه الصفحةِ وحدَها، وإلّا خلط ضعفَها بمادّةٍ أخرى */
  if (!/var REM_PAGE="lughati8", REM_LABEL="لغتي";/.test(html))
    E('REM_PAGE أو REM_LABEL ليسا للغتي — فحفظُ ضعفِها يختلط بمادّةٍ أخرى');

  /* ولا فتريَّ هنا: لم تصلني ورقةُ معلّمٍ في هذه المادّة */
  if (/renderFatri|FATRI_/.test(html))
    E('ظهر فتريٌّ في الصفحةِ ولا ورقةَ معلّمٍ بُنِي عليها');

  /* ولا اسمَ مادّةٍ أخرى في نصٍّ تقرأه البنت — غيرَ شريطِ موادِّها */
  [[/في كتاب العلوم/, '«كتاب العلوم»'],
   [/في كتاب الدراسات/, '«كتاب الدراسات الإسلاميّة»'],
   [/🔬 العلوم — /, 'ترويسةُ العلوم'],
   [/🕌 الدراسات الإسلاميّة — /, 'ترويسةُ الإسلاميّة'],
   [/\bislamic5\b/, 'اسمُ صفحةِ الإسلاميّة'],
   [/\bscience5\b/, 'اسمُ صفحةِ العلوم']
  ].forEach(([re, nm]) => { if (re.test(html)) E('بقي في صفحةِ لغتي ' + nm); });
  if (!/📖 في كتاب لغتي: /.test(html))
    E('لا تُحيل البنتَ إلى كتابِ لغتي — وهي تفتح الدرسَ حين تُخطئ فيه');

  /* وبطاقتُها في صفحةِ رفيف، وإلّا فصفحةٌ لا يصل إليها أحد */
  const hp = path.join(ROOT, 'home.html');
  if (fs.existsSync(hp) && !/href:"lughati8\.html"/.test(fs.readFileSync(hp, 'utf8')))
    out.push({ sev:'خطأ', file:'home.html', msg:'لا بطاقةَ للغتي الثاني المتوسّط — الصفحةُ موجودةٌ ولا رابطَ إليها' });

  return out;
}

/* ═══ لا تَكتُبُ صفحةٌ محلّيّةٌ في قاعدةِ الأبناء ═════════════════════
   في ١٧ أكتوبر ٢٠٢٦ عددتُ محاولاتِ حسن في «اختبار المذكّرة» فوجدتُ في
   الجدولِ ٧٣ صفًّا ليست لأحدٍ منهم: ١٦ بندًا أو أكثرَ أُجيبت كاملةً في
   أقلِّ من عشرِ ثوانٍ. كتبَتْها فحوصي الآليّة: تفتحُ الصفحةَ بـ file://
   وتُجيبُ كلَّ شيءٍ فتُكمِلُ المحاولةَ فتُرسِلُها. والمفتاحُ المنشورُ
   يَكتُبُ ولا يَحذِف، فلا أستطيعُ محوَ ما كتبتُ.
   والحارسُ هنا لأنّ إزالةَ هذا الشرطِ لا تُحدِثُ خطأً ظاهرًا أبدًا:
   كلُّ ما يَحدُثُ أنّ تقريرَ الأبِ يَمتلئُ بجلساتٍ لم تكن. */
function localNoWrite(){
  const out = [];
  const F = 'attempts-queue.js', p = path.join(ROOT, F);
  if (!fs.existsSync(p)) return out;
  const src = fs.readFileSync(p, 'utf8');
  const E = m => out.push({ sev:'خطأ', file:F, msg:m });

  if (!/location\.protocol === "file:"/.test(src))
    E('شرطُ file: مفقود — فكلُّ فحصٍ آليٍّ يفتحُ صفحةً من القرصِ يكتبُ صفًّا كاذبًا في نتائجِ الأبناء');
  if (!/var LOCAL = isLocal\(\);/.test(src))
    E('isLocal() لا تُقرأُ مرّةً في LOCAL — فالشرطُ موجودٌ ولا يُستعمَل');
  if (!/window\.AQ_LOCAL = LOCAL;/.test(src))
    E('AQ_LOCAL غيرُ معلَن — وtalk.html تُرسِلُ بـsendBeacon وحدَها فلا شيءَ يمنعُها');

  /* الشرطُ داخلَ post نفسِها لا في تعليق */
  const mp = src.match(/post:\s*function\([^)]*\)\{([\s\S]*?)\n    \},/);
  if (!mp) E('لم أجد جسمَ AQ.post لأتأكّدَ من الشرطِ فيه');
  else if (!/if\(LOCAL\)\{/.test(mp[1]))
    E('AQ.post تُرسِلُ وإن كانت الصفحةُ محلّيّة');
  const mf = src.match(/flush:\s*function\(\)\{([\s\S]*?)\n    \}/);
  if (!mf) E('لم أجد جسمَ AQ.flush');
  else if (!/if\(LOCAL\) return/.test(mf[1]))
    E('AQ.flush تُفرِغُ الطابورَ المحلّيَّ إلى القاعدة — فما مُنِع في post يَخرجُ من هنا');

  /* ولا يُسقِطُ المضيفَ الفارغ: متصفّحُ التطبيقاتِ الداخليُّ قد يُخفيه */
  if (/h === ""/.test(src))
    E('المضيفُ الفارغُ يُعَدُّ محلّيًّا — فنتيجةُ طفلٍ في متصفّحٍ داخليٍّ تُسقَطُ بصمت');

  /* وtalk.html تَستعملُ الوسمَ قبلَ sendBeacon */
  const T = 'talk.html', tp = path.join(ROOT, T);
  if (fs.existsSync(tp)) {
    const t = fs.readFileSync(tp, 'utf8');
    if (!/if\(window\.AQ_LOCAL\) return;\s*\n\s*if\(useBeacon && navigator\.sendBeacon\)/.test(t))
      out.push({ sev:'خطأ', file:T, msg:'sendBeacon يَسبقُ شرطَ AQ_LOCAL — فجلسةُ المحادثةِ تُكتَبُ من الفحوصِ الآليّة' });
  }
  return out;
}

function mawhibaTimed(){
  const out = [];
  const F = 'practice.html', p = path.join(ROOT, F);
  if (!fs.existsSync(p)) return out;
  const src = fs.readFileSync(p, 'utf8');
  const E = m => out.push({ sev:'خطأ', file:F, msg:m });

  /* موقوتٌ من نفسِه لا من المفتاحِ العامّ */
  if (!/var MW_SOFT = \(id === "mw"\);/.test(src))
    E('وسمُ MW_SOFT مفقودٌ أو وُسِّع — فإمّا لا توقيتَ في موهبة وإمّا تسرّب لغيرها');
  if (!/MW_SOFT \? \(SECS\.mw \|\| 0\)/.test(src))
    E('زمنُ موهبةَ عاد تابعًا للمفتاحِ العامِّ — ويتدرّب بلا وقتٍ وهو يحسبه موقوتًا');
  if (!/mw:\s*\d+/.test(src)) E('زمنُ موهبةَ (SECS.mw) مفقود');

  /* لا يَقطع: عدٌّ تصاعديٌّ بدل finish(true) */
  if (!/if\(MW_SOFT && remaining <= 0\)\{\s*\n\s*over\+\+;/.test(src))
    E('القطعُ عاد عند انتهاءِ زمنِ موهبة — والمطلوبُ أن يُكمِل ويُعرَض تجاوزُه');
  if (src.indexOf('تجاوزت الزمن بـ') < 0)
    E('المؤقّتُ لا يُعلن التجاوزَ — فينتهي الزمنُ ولا يدري');

  /* لوحةُ الإيقاعِ وزمنُ الهدفِ محسوبٌ لا مكتوبٌ بيد */
  if (!/\[data-mwpace\]/.test(src)) E('لوحةُ إيقاعِ موهبةَ مفقودة');
  if (!/Math\.round\(secsAll\/items\.length\)/.test(src))
    E('زمنُ الهدفِ مكتوبٌ بيدٍ لا محسوبٌ من الزمنِ على العدد — فيتناقضانِ عند أيِّ تعديل');
  if (!/paceLog\.push\(\{ d: skillOf\(items\[i\]\)/.test(src))
    E('مجالُ السؤالِ لا يُسجَّل — فلا إيقاعَ لكلِّ مجالٍ على حدة');

  /* ═══ النموذجُ الكامل: ١٢٠ سؤالًا · ١٥٠ دقيقةً · ويَقطع ══════════════
     طلبُ الأب (١٧ أكتوبر) بعد أن تأكّد العدد. وهو عكسُ جولةِ التدريبِ في
     القطعِ عمدًا — فإن تساويا ضاع معنى أحدِهما. */
  if (!/var MWF_N = 120, MWF_SECS = 150\*60;/.test(src))
    E('عددُ أسئلةِ النموذجِ الكاملِ أو زمنُه تغيّر — والمستوى الثالثُ ١٢٠ سؤالًا في ساعتَينِ ونصف');
  if (!/\(id==="mwf"\) \? MWF_SECS/.test(src))
    E('النموذجُ الكاملُ لا يأخذ زمنَه — فيُجلَس بلا وقتٍ وهو موضعُ قياسِ الجهوزيّة');
  if (/MW_SOFT = \(id === "mw" \|\| id === "mwf"\)/.test(src))
    E('النموذجُ الكاملُ صار لا يَقطع — وهو موضعُ قياسٍ لا تدريب، فإن لم يَقطع لم يقِسْ');
  if (!/MW_PACE = \(id === "mw" \|\| id === "mwf"\)/.test(src))
    E('لوحةُ الإيقاعِ لا تشمل النموذجَ الكامل');
  if (!/TABS\.push\(\["mwf"/.test(src)) E('لا تبويبَ للنموذجِ الكاملِ في موهبة');
  if (!/b\.dataset\.tab==="mwf" && typeof renderMwFull==="function"/.test(src))
    E('النموذجُ الكاملُ لا يُبنى عند فتحِ تبويبِه — يُنقَر فلا يظهر شيء');
  if (!/MW_TEST\[MW_LEVEL\] \+ " — نموذج كامل"/.test(src))
    E('النموذجُ الكاملُ لا يُحفَظ باسمٍ مستقلّ — فيختلط متوسّطُه بمتوسّطِ التدريبِ القصير');
  if (src.indexOf('تأكّد منها في سديد') < 0)
    E('سقط تنبيهُ التأكّدِ من سديد — فيُقرَأ الزمنُ كأنّه معتمَدٌ بالمستوى');

  /* ═══ هويّةُ السؤالِ في الخلطةِ متنٌ وخياراتٌ معًا ══════════════════
     متونٌ في الكتابِ متطابقةٌ حرفًا بحرفٍ ولا يفرّقها إلّا خياراتُها،
     فلو كان المفتاحُ المتنَ وحدَه رُفِض الثاني منها وهو سؤالٌ آخر —
     فتضيق المادّةُ بلا أثرٍ ظاهر. */
  if (!/function mwId\(q\)\{ return q\[0\] \+ ' \\u27ea' \+ \(q\[1\] \|\| \[\]\)\.join\('\|'\) \+ '\\u27eb'; \}/.test(src))
    E('مفتاحُ تمييزِ السؤالِ في خلطةِ موهبةَ ليس المتنَ مع خياراتِه');
  {
    const mm = /function mawhibaMix\(n\)\{\n([\s\S]*?)\n\}/.exec(src);
      if (!mm) E('خلطةُ موهبةَ لا تُقرَأ');
      else {
        /* ═══ يُقاس الموضعُ لا الهجاء ════════════════════════════════
           كان الفحصُ يطابق سطرًا بعينِه، فنجت طفرةٌ كتبت «seen = {}»
           بصياغةٍ أخرى داخلَ الحلقة (١٧ أكتوبر). فصار يسأل عن الموضع:
           هل تُصفَّر «رأيتُه» داخلَ حلقةِ المجالات؟ */
        const body = mm[1];
        const at = body.indexOf('doms.forEach(');
        if (at < 0) E('حلقةُ المجالاتِ في خلطةِ موهبةَ لا تُقرَأ');
        else {
          if (!/var seen = \{\};/.test(body.slice(0, at)))
            E('«رأيتُه» غيرُ معرَّفةٍ قبل حلقةِ المجالات');
          if (/seen\s*=\s*\{\s*\}/.test(body.slice(at)))
            E('«رأيتُه» تُصفَّر داخلَ حلقةِ المجالات — فيمرّ سؤالٌ واحدٌ في مجالَين');
        }
      }
  }

  /* الصدقُ في الرقم: زمنُ التدريبِ اجتهادٌ لا رقمٌ رسميّ */
  if (src.indexOf('تقدير تدريب منّي لا زمن رسمي') < 0)
    E('سقط التنبيهُ بأنّ زمنَ الجولةِ اجتهادٌ لا رقمٌ رسميّ');
  /* ولا تُقال للطالبِ كلمتانِ متناقضتانِ في شاشةٍ واحدة */
  const im = /renderSet\("mw",[\s\S]{0,2600}?MW_TEST\[MW_LEVEL\]\)/.exec(src);
  if (!im) E('مقدّمةُ لوحةِ موهبةَ لا تُقرَأ');
  else {
    if (/\+tnote\+/.test(im[0]))
      E('مقدّمةُ موهبةَ ما زالت تُلحِق «(بدون توقيت)» وهي موقوتةٌ دائمًا');
    if (/شغّل المؤقّت فوق/.test(im[0]))
      E('مقدّمةُ موهبةَ ما زالت تطلب تشغيلَ المؤقّتِ يدويًّا وهو يعمل وحدَه');
  }
  return out;
}

function muthPath(){
  const out = [];
  const F = 'science9.html', p = path.join(ROOT, F);
  if (!fs.existsSync(p)) return out;
  const src = fs.readFileSync(p, 'utf8');
  const E = m => out.push({ sev:'خطأ', file:F, msg:m });
  const arN = n => String(n).split('').map(d => '٠١٢٣٤٥٦٧٨٩'[+d]).join('');

  const num = (name) => {
    const m = new RegExp('var ' + name + '\\s*=\\s*(\\d+);').exec(src);
    return m ? +m[1] : null;
  };
  const MCQ = num('MUTH_MCQ'), EQN = num('MUTH_EQN'), EMARK = num('MUTH_EMARK');
  if (MCQ === null || EQN === null || EMARK === null){
    E('أعدادُ اختبارِ المذكّرة (MUTH_MCQ / MUTH_EQN / MUTH_EMARK) مفقودة'); return out;
  }
  if (MCQ !== 20)  E('أسئلةُ اختيارِ المذكّرة ' + MCQ + ' والمطلوبُ ٢٠');
  if (EQN !== 4)   E('مقاليّاتُ المذكّرة ' + EQN + ' والمطلوبُ ٤ — وهو نصُّ طلبِ الأب');
  if (EMARK !== 3) E('درجةُ المقاليِّ ' + EMARK + ' والمطلوبُ ٣');
  const TOTAL = MCQ + EQN * EMARK;

  /* المجموعُ يُحسَب من جزأيه لا يُكتَب بيدٍ */
  if (!/var MUTH_ESSAY = MUTH_EQN \* MUTH_EMARK;/.test(src))
    E('درجةُ المقاليّاتِ لا تُضرَب في عددِها — فتضيع درجاتٌ بلا أثرٍ ظاهر');
  if (!/var MUTH_TOTAL = MUTH_MCQ \+ MUTH_ESSAY;/.test(src))
    E('مجموعُ درجاتِ المذكّرةِ لا يُجمَع من جزأيه');
  /* ═══ الحسابُ يُفحَص داخلَ renderMuth وحدَها ══════════════════════
     دالّةُ marks نفسُها موجودةٌ في renderFatri أيضًا بنصِّها، فبحثٌ في
     الملفِّ كلِّه يُصيب نسخةَ الفتريِّ ويمرّ على كسرِ نسخةِ المذكّرة —
     نجت هذه الطفرةُ أوّلَ مرّةٍ بهذا بعينِه. */
  const muthBody = /function renderMuth\(\)\{[\s\S]*?\n    draw\(\);\n  \}/.exec(src);
  if (!muthBody) E('دالّةُ renderMuth لا تُقرَأ');
  else if (!/function marks\(\)\{ return correct \+ essaySum\(\); \}/.test(muthBody[0]))
    E('درجةُ المقاليِّ لا تدخل حسابَ درجةِ المذكّرة — تُعرَض ٢٠ من ٣٢ وقد أجاب كلَّ شيء');

  /* التوزيعُ على المحاورِ يطابق العددَ المعلَن */
  const pm = /var MUTH_PER = \{([^}]*)\};/.exec(src);
  if (!pm) E('توزيعُ أسئلةِ المذكّرةِ (MUTH_PER) مفقود');
  else {
    const WANT = { sci:6, eq:4, volc:3, plate:3, cell:4 };
    let sum = 0; const mism = [];
    for (const k of Object.keys(WANT)){
      const g = new RegExp(k + '\\s*:\\s*(\\d+)').exec(pm[1]);
      const v = g ? +g[1] : 0; sum += v;
      if (v !== WANT[k]) mism.push(k + '=' + v + ' والمطلوبُ ' + WANT[k]);
    }
    if (mism.length) E('توزيعُ أسئلةِ المذكّرةِ على المحاورِ تغيّر: ' + mism.join('، '));
    if (sum !== MCQ)
      E('مجموعُ التوزيع ' + sum + ' يخالف العددَ المعلَن ' + MCQ +
        ' — تُعرَض أسئلةٌ والدرجةُ من غيرِ عددِها');
  }

  /* الخلطُ حيٌّ والفهرسُ يتبعه: لو جمد الفهرسُ عُلّم الطالبُ الخطأ
     والصفحةُ متّسقةٌ مع نفسِها فلا يصيح شيء */
  if (!/return \[p\[0\], o, o\.indexOf\(p\[1\]\[0\]\), p\[2\]\];/.test(src))
    E('فهرسُ الجوابِ في muthPick لا يتبع الخلطَ — يُعلَّم خيارٌ ليس هو الجواب');
  if (!/var p = bank\[i\], o = p\[1\]\.slice\(\);\s*\n\s*shuffle\(o\);/.test(src))
    E('خياراتُ سؤالِ المذكّرةِ لا تُخلَط — فيُحفَظ موضعُ الجوابِ لا الجواب');

  /* كلُّ رقمٍ يُعرَض للطالبِ يطابق أخاه */
  const um = /muth:\s*\{[\s\S]{0,900}?unit:\s*'([^']*)'/.exec(src);
  const im = /function renderMuth\(\)\{[\s\S]{0,3000}?sec\.innerHTML/.exec(src);
  const shown = [];
  if (um) shown.push(['سطرِ الوحدةِ فوق لوحةِ المذكّرة', um[1]]);
  else E('سطرُ الوحدةِ لفصلِ المذكّرةِ مفقود — لا عنوانَ فوق اللوحة');
  if (im) shown.push(['مقدّمةِ لوحةِ المذكّرة', im[0]]);
  else E('مقدّمةُ لوحةِ المذكّرةِ مفقودة');
  for (const [where, text] of shown){
    for (const g of String(text).matchAll(/([٠-٩]+)\s*(?:سؤالًا|أسئلة)/g))
      if (g[1] !== arN(MCQ))
        E('العددُ المعروضُ في ' + where + ' «' + g[0].trim() + '» والأسئلةُ ' + arN(MCQ) +
          ' — رقمان متناقضان في شاشةٍ واحدة');
    for (const g of String(text).matchAll(/([٠-٩]+)\s*درجة/g))
      if (g[1] !== arN(TOTAL))
        E('الدرجةُ المعروضةُ في ' + where + ' «' + g[0].trim() + '» والمجموعُ ' + arN(TOTAL));
  }

  /* التبويبُ مسجَّلٌ ومُوجَّهٌ — وإلّا بقي الاختبارُ في الملفِّ لا يُفتَح */
  if (!/muth:\s*\{\s*name:"📒 المذكّرة", ids:\["muth"\]/.test(src))
    E('فصلُ المذكّرةِ غيرُ مسجَّلٍ في CHAPS — لا يظهر للطالب');
  if (!/CFG\.muth\s*=/.test(src))
    E('CFG.muth مفقود — لا تبويبَ للمذكّرة');
  if (!/else if\(id==="muth"\)\{[^}]*renderMuth\(\);/.test(src))
    E('لوحةُ المذكّرةِ لا تُرسَم — يُنقَر التبويبُ فلا يظهر شيء');
  if (!/saveScore\("علوم م٣ — اختبار المذكّرة 📒"/.test(src))
    E('نتيجةُ المذكّرةِ لا تُحفَظ باسمِها — فلا تظهر في تقريرِ الأب');

  /* بنوكُ الأسئلةِ: بنيةٌ سليمةٌ، وسعةٌ لا تُكرِّر */
  const BANKS = { MUTH_SCI:'sci', MUTH_EQ:'eq', MUTH_VOLC:'volc',
                  MUTH_PLATE:'plate', MUTH_CELL:'cell' };
  const PER = { sci:6, eq:4, volc:3, plate:3, cell:4 };
  for (const [name, key] of Object.entries(BANKS)){
    const lit = EXTRACT.literalAfter(src, new RegExp('var\\s+' + name + '\\s*='), '[', ']');
    let bank = null;
    try { bank = lit ? EXTRACT.evalLiteral(lit, name) : null; } catch(e){}
    if (!Array.isArray(bank)){ E('بنكُ ' + name + ' لا يُقرَأ'); continue; }
    /* ضعفُ ما يُسحَب على الأقلّ — وإلّا تكرّر السؤالُ على الطالبِ بين جلسةٍ وأخرى */
    if (bank.length < PER[key] * 2)
      E('بنكُ ' + name + ' فيه ' + bank.length + ' سؤالًا ويُسحَب منه ' + PER[key] +
        ' — أقلُّ من الضعفِ فيتكرّر السؤالُ، وهي الشكوى التي بُني القسمُ بعدها');
    const stems = {};
    bank.forEach((q, i) => {
      const tag = name + '#' + i + ' «' + String((q && q[0]) || '').replace(/<[^>]*>/g, '').slice(0, 30) + '»';
      if (!Array.isArray(q) || q.length !== 3) return E(tag + ' ليس على شكلِ [نصّ, خيارات, شرح]');
      if (!Array.isArray(q[1]) || q[1].length < 2) return E(tag + ' خياراتُه أقلُّ من اثنَين');
      /* خياران متطابقان يجعلان indexOf يُشير إلى غيرِ الجواب */
      if (new Set(q[1]).size !== q[1].length) E(tag + ' فيه خياران متطابقان — فيُعلَّم غيرُ الجواب');
      if (!q[2] || !String(q[2]).trim()) E(tag + ' بلا شرح');
      const s0 = String(q[0]).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
      if (stems[s0]) E(tag + ' سؤالٌ مكرّرٌ في بنكِه');
      stems[s0] = 1;
    });
  }

  /* بنوكُ المقاليِّ الأربعةُ: شكلٌ لكلٍّ، ولكلِّ شكلٍ أكثرُ من نصّ */
  const EB = ['MUTH_E_EXP', 'MUTH_E_CMP', 'MUTH_E_WHY', 'MUTH_E_TERM'];
  for (const name of EB){
    const lit = EXTRACT.literalAfter(src, new RegExp('var\\s+' + name + '\\s*='), '[', ']');
    const n = lit ? (lit.match(/\{\s*stem:/g) || []).length : 0;
    if (!lit) E('بنكُ المقاليِّ ' + name + ' مفقود');
    else if (n < 3)
      E('بنكُ المقاليِّ ' + name + ' فيه ' + n + ' نصًّا فقط — فيتكرّر على الطالبِ في كلِّ اختبار');
  }
  if (!/var MUTH_E\s*=\s*\[MUTH_E_EXP, MUTH_E_CMP, MUTH_E_WHY, MUTH_E_TERM\];/.test(src))
    E('المقاليّاتُ الأربعةُ لا تُسحَب من الأشكالِ الأربعةِ كلٍّ على حدة');
  if (!/var ESS = MUTH_E\.map\(function\(bank\)\{ return gp\(bank\); \}\);/.test(src))
    E('سحبُ المقاليّاتِ لا يتبع الأشكالَ الأربعة — فقد تقع كلُّها في شكلٍ واحد');

  /* ═══ ما رفعه الأبُ لا يعود صامتًا ══════════════════════════════════
     «الأسئلة المقالية هذي وكذلك سؤال التخمر — شلها لأنها تكرّرت عليه
     كثير» (١٦ أكتوبر). والعلّةُ تكرارُها على حسنٍ لا موضعُها، فلا تعود
     في المذكّرة. */
  const DROPPED = [
    ['أثر كمّيّة السماد', 'مقاليُّ السمادِ والفول'],
    ['قارن</b> بين <b>البناء الضوئيّ</b> و<b>التنفّس الخلويّ', 'مقارنةُ البناءِ الضوئيِّ بالتنفّسِ الخلويّ'],
    ['قارن</b> بين <b>التنفّس الخلويّ</b> و<b>التخمّر', 'مقارنةُ التنفّسِ الخلويِّ بالتخمّر']
  ];
  for (const [needle, label] of DROPPED)
    if (src.indexOf(needle) >= 0)
      E(label + ' عاد إلى الصفحة — وقد رفعه الأبُ بطلبِه لتكرارِه على حسن');
  /* ═══ ونصُّ المقاليِّ يُعرَض للأبِ لا يُختصَر في رقم ═══════════════
     يضع حسنٌ درجةَ مقاليّهِ بنفسِه، فلو عُرض الرقمُ وحدَه لم يُعرَف
     أصادقٌ تقديرُه أم متساهل. (كان هذا الحارسُ مع حارسِ الفتريِّ،
     فنُقل إلى هنا حين نُزع الفتريُّ في ١٩ أكتوبر ٢٠٢٦.) */
  for (const rf of ['home.html', 'child.html']){
    const rp = path.join(ROOT, rf);
    if (!fs.existsSync(rp)) continue;
    if (!/meta\.essay &&/.test(fs.readFileSync(rp, 'utf8')))
      out.push({ sev:'خطأ', file:rf, msg:'نصُّ المقاليِّ يُحفَظ ولا يُعرَض — فالدرجةُ الذاتيّةُ بلا مراجعة' });
  }
  return out;
}

function mawhibaMechGens(){
  const out = [];
  const F = 'mawhiba3.js', p = path.join(ROOT, F);
  if (!fs.existsSync(p)) return out;
  const src = fs.readFileSync(p, 'utf8');
  const E = m => out.push({ sev:'خطأ', file:F, msg:m });

  const grab = id => {
    const m = new RegExp('DOM\\("' + id + '"[\\s\\S]*?\\n\\s*\\[([^\\]]*)\\]\\);').exec(src);
    return m ? m[1].split(',').map(s => s.trim()).filter(Boolean) : null;
  };
  const reg = grab('sci');
  if (!reg){ E('تعذّر استخراجُ مصفوفةِ مولّداتِ المجالِ العلميّ من DOM("sci")'); return out; }

  /* أنماطٌ كرّرها الكتابُ فبُنيت مولّداتٍ — في مجالَيها لا في العلميّ */
  const OTHER = {
    math: { gAllExcept:'«كلُّ ما عندي كذا إلا ن»', gTriangleNum:'مثلّثاتُ الأعداد',
            gBalance:'اتّزانُ الأشكال', gDrainFill:'حوضٌ بحنفيّتَين ومخرج',
            gWellClimb:'ضفدعُ البئرِ واليومُ الأخير' },
    sci:  { gBernoulli:'برنولي — السرعةُ تخفض الضغط' },
    flex: { gOrderMixed:'ترتيبٌ بمقارناتٍ مختلطةٍ وفيها مساواة' },
    verb: { gNonsenseWord:'كلمةٌ مجهولةٌ في قائمةٍ معلومة',
            gUnrealPremise:'مقدّمةٌ غيرُ واقعيّة',
            gCategoryTriple:'ثلاثيّةٌ من فئةٍ واحدة' }
  };
  for (const id of Object.keys(OTHER)){
    const r = grab(id);
    if (!r){ E('تعذّر استخراجُ مصفوفةِ مولّداتِ مجالِ ' + id); continue; }
    for (const g of Object.keys(OTHER[id])){
      if (src.indexOf('function ' + g + '(') < 0)
        E('المولّدُ ' + g + ' (' + OTHER[id][g] + ') غيرُ معرَّف');
      else if (!r.includes(g))
        E('المولّدُ ' + g + ' (' + OTHER[id][g] + ') معرَّفٌ لكنّه غيرُ مسجَّلٍ في مجالِ ' + id + ' — فلا يُستدعى أبدًا');
    }
  }

  const NEED = {
    gBeltDir:        'السيرُ المتقاطعُ وغيرُ المتقاطع',
    gBeltSpeed:      'أقطارُ البكراتِ ونسبةُ دورانها',
    gGearIdler:      'الترسُ الوسيط',
    gGearChainCount: 'عدُّ التروسِ في كلِّ اتّجاه',
    gRack:           'الحافّةُ المسنّنة',
    gTorque:         'العزمُ وعلاقتُه بالأسنان',
    gGearFrac:       'نسبةُ أسنانٍ كسريّة'
  };
  for (const g of Object.keys(NEED)){
    if (src.indexOf('function ' + g + '(') < 0)
      E('المولّدُ ' + g + ' (' + NEED[g] + ') غيرُ معرَّفٍ — وهو بابٌ من أبوابِ ملحقِ القدرةِ الميكانيكية');
    else if (!reg.includes(g))
      E('المولّدُ ' + g + ' (' + NEED[g] + ') معرَّفٌ لكنّه غيرُ مسجَّلٍ في مجالِ sci — فلا يُستدعى أبدًا');
  }
  /* ولا يُستغنى عن القديمَين بالجديد */
  for (const g of ['gGearDir','gGearSpeed','gPulley','gLever'])
    if (!reg.includes(g)) E('المولّدُ ' + g + ' سقط من مجالِ sci');
  return out;
}

function skillLabels(){
  const out = [];
  const f = 'math9.html';
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) return out;
  const src = fs.readFileSync(p, 'utf8');
  const mm = /var GEN_AR = \{([\s\S]*?)\n\};/.exec(src);
  if (!mm){ out.push({ sev:'خطأ', file:f, msg:'خريطة GEN_AR غير موجودة — شغّل tools/gen-skill-labels.js' }); return out; }
  const have = new Set();
  for (const m of mm[1].matchAll(/^\s*(g[A-Za-z0-9_]+)\s*:/gm)) have.add(m[1]);
  const used = new Set();
  for (const m of src.matchAll(/^var [A-Z]+\d* = \[(.+)\];/gm))
    m[1].split(',').forEach(x => { x = x.trim(); if (/^g[A-Za-z0-9_]+$/.test(x)) used.add(x); });
  const missing = [...used].filter(g => !have.has(g));
  if (missing.length)
    out.push({ sev:'تنبيه', file:f, msg: missing.length + ' مولّدًا بلا وصفٍ عربيّ (' +
      missing.slice(0,4).join(' ') + (missing.length>4?' …':'') + ') — شغّل tools/gen-skill-labels.js' });
  return out;
}

/* ═══ بنكُ قطعِ القراءةِ بعد الدمج ═══════════════════════════════════
   شكوى الأب (٢١ أكتوبر ٢٠٢٦): «قطعُ حسنٍ قصيرةٌ ومكرّرة». والتكرارُ كان
   حقيقيًّا ولم يُره أحد: البنكُ موزّعٌ على أربعةِ ملفّاتٍ تُدمَج في
   reading.html، فلا أحدَ يرى القائمةَ مجتمعةً إلّا الطفل. فكان فيها
   نسختان من Renewable تتشابهان ٧٤٪، ومثلُهما Volunteering وCritical
   thinking، ونسختان للمكتبةِ والجملِ عند أسامة.

   فيُعاد هنا الدمجُ نفسُه ثمّ يُفحَص الناتج:
   - ألّا تتشابه قطعتان لطفلٍ واحدٍ في لغةٍ واحدةٍ تشابهًا شديدًا.
   - أن يكون لكلِّ مرفوعٍ في READING_DROP ما يطابقه (وإلّا فالرفعُ لغوٌ
     يظنُّ قارئُه أنّ الموضوعَ رُفِع وهو باقٍ).
   - أن تبلغ قطعُ حسنٍ عتبةَ الطولِ التي طلبها الأب.
   - وأن يكون كلُّ سؤالٍ صحيحَ البنيةِ: ثلاثةُ خياراتٍ متمايزة، وفهرسُ
     الصواب في المدى. وهذا يُفحَص هنا لأنّ خيارًا مكرّرًا يجعل للسؤالِ
     جوابَين ولا يظهر في الصفحة: يُعرَض ويُقبَل أحدُهما ويُخطَّأ الآخر. */
function readingPoolPath(){
  const out = [];
  const F = 'reading.html', p = path.join(ROOT, F);
  if (!fs.existsSync(p)) return [{ sev:'خطأ', file:F, msg:'الصفحةُ مفقودة' }];
  const src = fs.readFileSync(p, 'utf8');
  const E = (f, m) => out.push({ sev:'خطأ', file:f, msg:m });

  /* ── البنوكُ تُحمَّل كلُّها ── */
  /* وstep-reading.js معها: قطعُ فهدٍ تأتي منه لا من DATA، فلو استُبدِل
     بقائمةٍ فارغةٍ لمرّ بنكُه كلُّه بلا فحصٍ وهو لا يُرى. */
  const BANKS = ['reading-bank.js', 'reading-bank2.js', 'reading-long.js', 'step-reading.js'];
  const sb = { window:{} }; vm.createContext(sb);
  for (const b of BANKS){
    const bp = path.join(ROOT, b);
    if (!fs.existsSync(bp)){ E(b, 'مفقود'); continue; }
    if (src.indexOf('src="' + b + '"') < 0) E(F, 'لا تُحمّل ' + b + ' — فبنكُه لا يصل الطفل');
    try { vm.runInContext(fs.readFileSync(bp, 'utf8'), sb); }
    catch(e){ E(b, 'لا يُقوَّم: ' + String(e.message).slice(0,70)); }
  }

  /* ── القائمةُ تُبنى بكودِ الصفحةِ نفسِه لا بنسخةٍ منه ──
     أوّلُ صياغةٍ أعادت الدمجَ هنا، فنجا منها تخريبٌ عطّل الدمجَ في
     الصفحة: الحارسُ كان يفحص قائمةً يبنيها بنفسِه فلا يَشعر. فيُقتطَع
     من إعلانِ DATA إلى ما قبلَ passageId — وفيه الجدولُ وكتلُ الدمجِ
     الأربع — ويُشغَّل كما هو. فما تراه الصفحةُ هو ما يُفحَص. */
  const dm = /(?:var|let|const)\s+DATA\s*=\s*\{/.exec(src);
  const at = dm ? dm.index : -1;
  const stop = src.indexOf('function passageId(');
  if (at < 0 || stop < at)
    return (E(F, 'كتلةُ DATA والدمجِ لا تُنتزَع — تغيّر موضعُ passageId أو إعلانُ DATA'), out.concat());
  let DATA;
  try {
    vm.runInContext(src.slice(at, stop).replace(/\bconst\s+DATA\s*=/, 'var DATA ='), sb);
    DATA = sb.DATA;
  } catch(e){ return (E(F, 'كتلةُ الدمجِ لا تُقوَّم: ' + String(e.message).slice(0,70)), out.concat()); }
  if (!DATA) return (E(F, 'DATA فارغةٌ بعد الدمج'), out.concat());

  const W = sb.window;
  const words = s => String(s||'').trim().split(/\s+/).filter(Boolean);
  const MW = W.READING_MINWORDS || {}, MK = W.READING_MINKEEP || 16;

  /* ═══ القطعُ الطويلةُ أسئلتُها أربعةٌ فأكثر ═══════════════════════
     بنكُ القراءةِ القديمُ ثلاثةُ أسئلةٍ لكلِّ قطعة، وهو ما يحتمله نصٌّ
     من تسعَ عشرةَ كلمة. والقطعُ الطويلةُ كُتبت بأربعةٍ فأكثر عن قصد:
     النصُّ الذي يبلغ ستّين كلمةً يحتمل سؤالَ استنتاجٍ فوق الحرفيّ،
     وثلاثةٌ عليه تترك أكثرَه بلا سؤال. والحدُّ العامُّ (ثلاثة) لا
     يمسك هذا، فيُفحَص بنكُ الطويلِ وحدَه. */
  { const LG0 = W.READING_LONG || {};
    for (const w in LG0) for (const lg in LG0[w]){
      const ps = (LG0[w][lg] || {}).pass || [];
      const few = ps.filter(x => !Array.isArray(x[1]) || x[1].length < 4);
      if (few.length)
        E('reading-long.js', w + '/' + lg + ': ' + few.length + ' قطعةً طويلةً أسئلتُها دون أربعة — ' +
          'أوّلُها «' + String(few[0][0]||'').slice(0,34) + '…»');
    } }

  /* مرفوعٌ لا يطابق شيئًا: الرفعُ لغوٌ، ويظنُّ قارئُ القائمةِ أنّ
     الموضوعَ رُفِع وهو ما زال يُعرَض على الطفل. ويُفحَص قبل الدمجِ
     لأنّ الصفحةَ قد رفعتْه فعلًا. */
  const DR = W.READING_DROP || {};
  const RAW = {};
  { const sb2 = { window:{} }; vm.createContext(sb2);
    for (const b of BANKS){ const bp = path.join(ROOT, b);
      if (fs.existsSync(bp)) { try { vm.runInContext(fs.readFileSync(bp,'utf8'), sb2); } catch(e){} } }
    try {
      vm.runInContext(src.slice(at, stop).replace(/\bconst\s+DATA\s*=/, 'var DATA =')
        .replace(/window\.READING_DROP/g, 'null').replace(/window\.READING_MINWORDS/g, 'null'), sb2);
      for (const w in sb2.DATA) for (const lg in sb2.DATA[w])
        RAW[w+'/'+lg] = ((sb2.DATA[w][lg]||{}).pass||[]).map(x => String(x[0]||''));
    } catch(e){}
  }
  for (const w in DR) for (const lg in DR[w]){
    const pool = RAW[w+'/'+lg] || [];
    for (const [pre, why] of DR[w][lg])
      if (!pool.some(t => t.indexOf(pre) === 0))
        E('reading-long.js', 'مرفوعٌ بلا مطابق — «' + String(pre).slice(0,40) +
          '…» (' + why + ') لا يطابق قطعةً عند ' + w + '/' + lg + '، فالموضوعُ ما زال يُعرَض');
  }

  /* وعتبةٌ لا تبلغها قطعةٌ واحدةٌ إعدادٌ خاطئ: الصمّامُ يُنقِذ القائمةَ
     فلا يظهر العطب، والبنكُ قد انكمش إلى الصمّامِ بلا أن يقصد أحد. */
  for (const w in MW){
    const min = MW[w]; if (!(min > 0) || !DATA[w]) continue;
    for (const lg in DATA[w]){
      const pool = RAW[w+'/'+lg] || [];
      if (pool.length && !pool.some(t => words(t).length >= min))
        E('reading-long.js', 'عتبةُ ' + w + '/' + lg + ' هي ' + min +
          ' كلمةً ولا تبلغها قطعةٌ واحدة — فالصمّامُ وحدَه يحمل القائمة');
    }
  }

  /* ── والناتجُ يُفحَص ── */
  const norm = s => String(s).replace(/[ً-ْ]/g,'').replace(/[^\p{L}\p{N}\s]/gu,' ')
                      .toLowerCase().split(/\s+/).filter(Boolean);
  for (const w in DATA) for (const lg in DATA[w]){
    const a = (DATA[w][lg] && DATA[w][lg].pass) || [];
    if (!a.length) continue;
    const tag = w + '/' + lg;

    if (a.length < 8)
      E(F, tag + ': ' + a.length + ' قطعةٍ فقط — تدور عليه بسرعةٍ فيقيس الاختبارُ الحفظَ لا الفهم');

    for (let x = 0; x < a.length; x++){
      const t = String(a[x][0] || ''), qs = a[x][1];
      if (!t.trim()){ E(F, tag + ': قطعةٌ بلا نصّ'); continue; }
      if (!Array.isArray(qs) || qs.length < 3){
        E(F, tag + ': «' + t.slice(0,32) + '…» فيها ' + ((qs&&qs.length)||0) + ' أسئلةٍ — أقلُّها ثلاثة'); continue; }
      qs.forEach((q2, qi) => {
        const stem = q2 && q2[0], opts = q2 && q2[1], right = q2 && q2[2];
        if (!stem || !Array.isArray(opts) || opts.length < 3)
          return E(F, tag + ' · «' + t.slice(0,28) + '…» سؤال ' + (qi+1) + ': أقلُّ من ثلاثةِ خيارات');
        if (!(right >= 0 && right < opts.length))
          return E(F, tag + ' · «' + t.slice(0,28) + '…» سؤال ' + (qi+1) + ': فهرسُ الصوابِ خارجَ المدى');
        const seen2 = new Set(opts.map(o => String(o).trim()));
        if (seen2.size !== opts.length)
          E(F, tag + ' · سؤال «' + String(stem).slice(0,34) + '…»: خياران متطابقان — فللسؤالِ جوابان ' +
            'ويُخطَّأ أحدُهما');
      });
    }

    for (let x = 0; x < a.length; x++) for (let y = x+1; y < a.length; y++){
      const A = String(a[x][0]), B = String(a[y][0]);
      if (A === B){ E(F, tag + ': قطعتان متطابقتان تمامًا — «' + A.slice(0,40) + '…»'); continue; }
      const sA = new Set(norm(A)), nB = norm(B);
      const ov = nB.filter(z => sA.has(z)).length / Math.max(sA.size, nB.length);
      if (ov >= 0.55)
        E(F, tag + ': قطعتان متشابهتان ' + Math.round(ov*100) + '٪ — «' + A.slice(0,34) +
          '…» و«' + B.slice(0,34) + '…» فيراها الطفلُ موضوعًا مكرّرًا');
    }

    /* الطلبُ نفسُه، لا ما يقوله الإعداد: لو هُبِطت READING_MINWORDS
       لمرّت القصيرةُ وما شكا الحارسُ شيئًا، لأنّه يتبع الإعدادَ الذي
       خُرِّب. فعتبةُ حسنٍ مكتوبةٌ هنا مستقلّةً — هي طلبُ الأب لا إعداد. */
    /* ورفيفُ دونَه بسنةٍ دراسيّة، فعتبتُها دونَ عتبتِه — طلبُ الأب
       (٢٢ أكتوبر ٢٠٢٦): «حطّ لرفيف نفس حسن في القطعة». */
    const NEED = { hasan: { en: 100, ar: 70 }, rafeef: { en: 80, ar: 60 },
                   /* وفهدٌ أعلاهم: ثالثُ ثانويٍّ يستعدّ لستيب */
                   fahad: { en: 140 },
                   /* وسعودٌ أدناهم: رابعٌ ابتدائيّ. والعربيّةُ أقلُّ عددًا
                      وأكثرُ معنًى، فحدُّها دون حدِّ الإنجليزيّة. */
                   saud: { en: 50, ar: 42 } };
    const need = (NEED[w] || {})[lg];
    if (need > 0){
      const shortOnes = a.filter(x => words(x[0]).length < need);
      if (shortOnes.length)
        E(F, tag + ': ' + shortOnes.length + ' قطعةً دون ' + need + ' كلمةً تصل الطفل — ' +
          'وطلبُ الأب (٢١ أكتوبر ٢٠٢٦) أن تكون قطعُ حسنٍ طويلة. أقصرُها «' +
          String(shortOnes.sort((x,y)=>words(x[0]).length-words(y[0]).length)[0][0]).slice(0,34) + '…»');
      if (a.length < 12)
        E(F, tag + ': ' + a.length + ' قطعةً فقط بعد الرفعِ والعتبة — تدور عليه فتتكرّر');
    }
    if (MW[w] > 0 && a.length < MK)
      E(F, tag + ': ' + a.length + ' قطعةً والصمّامُ ' + MK + ' — فالبنكُ جاع');
  }
  return out;
}

/* ═══ المقروءُ بصوتِه ومهلتُه ═══════════════════════════════════════
   بلاغُ الأب (٢١ أكتوبر ٢٠٢٦): «قرأ حسنٌ القطعةَ مرّتين ولم يلتقط
   الصوت». وتطويلُ القطعِ في اليومِ نفسِه جعل القراءةَ الجهريّةَ تتجاوز
   مهلةَ الأمانِ الثابتةَ (١٥٠ث)، وجعل كلَّ دورةِ تعرّفٍ تُقاس على مرجعٍ
   من مئةٍ وستّين كلمة. فصار المقروءُ بصوته فقرةً واحدة، وصارت المهلةُ
   تتبع طولَه. وهذا الحارسُ يمنع عودةَ الحالَين. */
function readAloudPath(){
  const out = [];
  const F = 'reading.html', p = path.join(ROOT, F);
  if (!fs.existsSync(p)) return [{ sev:'خطأ', file:F, msg:'الصفحةُ مفقودة' }];
  const src = fs.readFileSync(p, 'utf8');
  const E = m => out.push({ sev:'خطأ', file:F, msg:m });

  /* ── الدالّةُ تُنتزَع وتُشغَّل على عيّنات ── */
  const m = /function readAloudRef\(txt\)\{([\s\S]*?)\n\}/.exec(src);
  if (!m) E('readAloudRef لا تُنتزَع — فالمقروءُ بصوته لا يُفحَص');
  else {
    let fn;
    try { const sb = {}; vm.createContext(sb);
      vm.runInContext('f = function(txt){' + m[1] + '\n};', sb); fn = sb.f; }
    catch(e){ E('readAloudRef لا تُشغَّل: ' + String(e.message).slice(0,60)); }
    if (fn){
      const W = s => String(s).trim().split(/\s+/).filter(Boolean).length;
      const para = n => new Array(n).fill('word').join(' ') + '.';
      const PROBE = [
        { nm:'قطعةٌ ثلاثُ فقرات', in: para(30)+'\n\n'+para(60)+'\n\n'+para(50),
          ok: r => r === para(30), why:'تُرجَع الفقرةُ الأولى وحدَها' },
        /* وهذه تُميّز: مجموعُها دون السبعين، فلو أُهمل فاصلُ الفقراتِ
           رجع النصُّ كلُّه ولم يُنقِذه فرعُ القطع. والأولى وحدَها لا
           تُميّز لأنّ القطعَ عند آخرِ نهايةِ جملةٍ قبل السبعين يُصادف
           آخرَ الفقرةِ الأولى فيُخفي العطب. */
        /* ومجموعُهما دون الحدِّ عمدًا: لو أُهمل فاصلُ الفقراتِ رجع النصُّ
           كلُّه بلا أن يُنقِذه جمعُ الجملِ ولا القطعُ عند الحدّ. */
        { nm:'فقرتان قصيرتان', in: para(12)+'\n\n'+para(14),
          ok: r => r === para(12), why:'فاصلُ الفقراتِ يُحترَم وإن قصُر المجموع' },
        { nm:'قطعةٌ قصيرةٌ فقرةً واحدة', in: para(18),
          ok: r => r === para(18), why:'القصيرةُ تُقرأ كلُّها' },
        /* والحدُّ خمسٌ وثلاثون: هو المدى الذي قرأ فيه حسنٌ بسبعين كلمةً
           في الدقيقة، وفوقَه هبطت سرعتُه إلى إحدى وعشرين (٢٢ أكتوبر). */
        { nm:'جملةٌ أولى فوق الحدِّ', in: para(40)+' '+para(40)+' '+para(40),
          ok: r => r === para(40), why:'تُمدُّ إلى أوّلِ نهايةِ جملةٍ بدل الكسرِ في وسطها' },
        { nm:'جملةٌ أولى طويلةٌ جدًّا', in: para(80)+' '+para(10),
          ok: r => W(r) === 35, why:'فوق الخمسِ والخمسين يُرجَع إلى الحدّ' },
        /* وهذه تحرس أقلَّ المقدار: الجملُ قصيرةٌ فتُجمَع حتّى تقارب الحدَّ،
           ولا يُكتفى بأوّلِ نهايةِ جملةٍ فيخرج مقطعٌ من خمسِ كلمات. */
        { nm:'جملٌ قصيرةٌ متتابعة', in: new Array(10).fill('one two three four five.').join(' '),
          ok: r => W(r) >= 25 && W(r) <= 35 && /[.!?؟]$/.test(r),
          why:'تُجمَع الجملُ حتّى تقارب الحدَّ ولا يُكتفى بأقصرِها' },
        { nm:'فقرةٌ أولى فوق الحدِّ بقليل', in: para(30)+' '+para(30)+'\n\n'+para(40),
          ok: r => r === para(30), why:'تُقطَع عند الجملةِ الأولى لا في وسطِ الثانية' },
        { nm:'بلا نصّ', in: '', ok: r => r === '', why:'لا ترمي' }
      ];
      for (const t of PROBE){
        let r; try { r = fn(t.in); } catch(e){ r = '«رمت ' + String(e.message).slice(0,30) + '»'; }
        if (!t.ok(r))
          E('readAloudRef — ' + t.nm + ': ' + t.why + '، والناتجُ ' + W(r) + ' كلمةً «' +
            String(r).slice(0,36) + '…»');
      }
    }
  }

  /* ── وهي التي تُرسَل لأزور، والمظلَّلُ هو هي ── */
  if (!/azureAssess\(readRef,/.test(src))
    E('قطعةُ القراءةِ تُرسَل كاملةً لتقييمِ النطقِ لا readRef — فيُقاس على ما لم يُطلَب منه');
  if (!/var readRef = readAloudRef\(passage\)/.test(src))
    E('readRef لا يُشتقُّ من القطعة');
  if (!/data-readpart/.test(src))
    E('الفقرةُ المقروءةُ لا تُظلَّل — فيقرأ القطعةَ كلَّها ويُقاس على فقرة');
  if (/'<div class="txt"[^>]*>'\+passage\+/.test(src))
    E('النصُّ يُعرَض من passage لا passHtml — فالتظليلُ لا يصل الشاشة');

  /* ── ومهلةُ الأمانِ ليست رقمًا ثابتًا ── */
  if (/_to = setTimeout\(finish, 150000\)/.test(src))
    E('مهلةُ الأمانِ عادت ١٥٠ث ثابتة — وقطعةٌ طويلةٌ تُقطَع على قارئِها في وسطها');
  if (!/_capMs = Math\.min\([\s\S]{0,60}_refW/.test(src))
    E('مهلةُ الأمانِ لا تُشتقُّ من عددِ كلماتِ المرجع');

  /* ── وأرقامُ التشخيصِ تُملأ فعلًا ── */
  if (!/_cycSeq\+\+/.test(src))
    E('_cycSeq يُحفَظ ولا يُزاد — فيقرأ المشخِّصُ «cycles:0» دائمًا ويحسب أنّ الدورةَ لم تبدأ');
  ['secs:', 'stopped:', 'refW:', 'trail:'].forEach(k => {
    if (!new RegExp(k.replace(':','\\s*:')).test(src))
      E('صفُّ إخفاقِ المايكِ بلا «' + k.replace(':','') + '» — وغيابُه هو الذي أعمى تشخيصَ ٢١ أكتوبر');
  });
  return out;
}

/* ═══ بنكُ القسمِ اللفظيِّ بعد الدمج ═══════════════════════════════
   طلبُ الأب (٢٢ أكتوبر ٢٠٢٦) بعد تشخيصِ قدراتِ حسن: «وسّع بنوكَ
   المرادفِ والضدِّ ومعنى الكلمة».

   والبنكُ يُكتب في ملفَّين — practice.html وpractice-bank.js — ويُدمَجان
   عند التشغيل. فلا أحدَ يرى القائمةَ مجتمعةً، وقد وقع فيها:
   - كلماتٌ مكتوبةٌ في الملفَّين معًا («إقبال» و«أمانة» و«السداد»
     و«الوطيس») فتُسحَب ضِعفَ غيرِها ويظنُّها الطفلُ تكرارًا.
   - ومدخلاتٌ جوابُها عبارةٌ ومشتّتاها كلمتان، فيُعرَف الجوابُ بطولِه
     وحدَه بلا قراءة — أربعٌ وعشرون منها في «معنى كلمة».
   كلاهما لا يظهر في الصفحة: السؤالُ يُعرَض سليمًا ويُجاب. */
function verbalBankPath(){
  const out = [];
  const F = 'practice.html', p = path.join(ROOT, F), bp = path.join(ROOT, 'practice-bank.js');
  if (!fs.existsSync(p)) return [{ sev:'خطأ', file:F, msg:'الصفحةُ مفقودة' }];
  const src = fs.readFileSync(p, 'utf8');
  const E = (f, m) => out.push({ sev:'خطأ', file:f, msg:m });

  /* ── الدمجُ يُنتزَع ويُشغَّل: لا يكفي أن يُقرأ نصُّه ── */
  const mm = /function _vMerge\(base, add, key\)\{([\s\S]*?)\n\}/.exec(src);
  if (!mm) E(F, '_vMerge لا تُنتزَع — فالدمجُ لا يُفحَص');
  else {
    let fn;
    try { const sb2 = {}; vm.createContext(sb2);
      vm.runInContext('f = function(base, add, key){' + mm[1] + '\n};', sb2); fn = sb2.f; }
    catch(e){ E(F, '_vMerge لا تُشغَّل: ' + String(e.message).slice(0,60)); }
    if (fn){
      const k1 = x => String(x[0]);
      const r = fn([['a','الأصل'],['b','2']], [['a','الوافد'],['c','3']], k1);
      if (!Array.isArray(r) || r.length !== 3)
        E(F, '_vMerge لا تُسقِط المكرّر — الناتجُ ' + (r && r.length) + ' والمنتظَرُ ثلاثة');
      else if (r[0][1] !== 'الأصل')
        E(F, '_vMerge تُرجّح الوافدَ على الأصل — فتبديلُ مدخلةٍ في البنكِ الإضافيّ يطمس ما في الصفحة');
      /* والمفتاحان يُنتزَعان من الصفحةِ أيضًا: تبديلُ _vK3 إلى الكلمةِ
         الأولى وحدَها يحذف تناظراتٍ مختلفةً تشترك في طرفها الأوّل،
         ولا يظهر ذلك إن اختبرنا _vMerge بمفتاحٍ من عندنا. */
      const kx = /var _vK3 = (function\(x\)\{[^}]*\});/.exec(src);
      if (!kx) E(F, '_vK3 لا تُنتزَع');
      else {
        let k3; try { const s5 = {}; vm.createContext(s5); vm.runInContext('f=' + kx[1] + ';', s5); k3 = s5.f; }
        catch(e){ E(F, '_vK3 لا تُشغَّل'); }
        if (k3){
          const r3 = fn([['ماء','عطش','طعام','جوع']], [['ماء','سمكة','طائر','هواء']], k3);
          if (!r3 || r3.length !== 2)
            E(F, 'مفتاحُ التناظرِ لا يميّز تناظرَين يشتركان في أوّلِ كلمة — فيُحذف أحدُهما');
        }
      }
    }
  }
  /* ولا تُمسّ القوائمُ بعد الدمج: الحارسُ يقيس حجمَها من الملفّ، فقصٌّ
     بعد الدمجِ (slice) ينكمش به البنكُ ولا يشعر. فلا يُسمَح إلّا
     بإعلانِها ودمجِها. */
  ['VA','VS','VO','VM','VC','VR'].forEach(n => {
    const asg = (src.match(new RegExp('(^|[^\\w.])' + n + '\\s*=[^=]', 'gm')) || []).length;
    if (asg > 2)
      E(F, n + ': أُسنِد إليها ' + asg + ' مرّات — والمنتظَرُ إعلانٌ ودمجٌ فقط؛ ' +
        'إسنادٌ ثالثٌ قد يقصّ البنكَ بعد قياسِه');
  });
  ['VA','VS','VO','VM','VC','VR'].forEach(n => {
    if (!new RegExp('\\b' + n + ' = _vMerge\\(' + n + ',').test(src))
      E(F, n + ' تُدمَج بلا _vMerge — فالمكرّرُ بين الملفَّين يعود');
  });

  /* ── القوائمُ تُقرأ من الملفَّين وتُدمَج كما تُدمَج في الصفحة ── */
  function arr(name){
    const m = new RegExp('var ' + name + '\\s*=\\s*\\[').exec(src);
    if (!m) return null;
    let i = src.indexOf('[', m.index), d = 0, end = -1, q = null;
    for (; i < src.length; i++){
      const c = src[i];
      if (q){ if (c === '\\') i++; else if (c === q) q = null; continue; }
      if (c === '"' || c === "'"){ q = c; continue; }
      if (c === '[') d++; else if (c === ']'){ d--; if (!d){ end = i; break; } }
    }
    if (end < 0) return null;
    try { const sb3 = {}; vm.createContext(sb3);
      vm.runInContext('A=' + src.slice(src.indexOf('[', m.index), end + 1) + ';', sb3); return sb3.A; }
    catch(e){ return null; }
  }
  let PX = {};
  if (fs.existsSync(bp)){
    try { const sb4 = { window:{} }; vm.createContext(sb4);
      vm.runInContext(fs.readFileSync(bp,'utf8'), sb4); PX = sb4.window.PRACTICE_EXTRA || {}; }
    catch(e){ E('practice-bank.js', 'لا يُقوَّم: ' + String(e.message).slice(0,60)); }
  } else E('practice-bank.js', 'مفقود');

  const MIN = { VS:140, VO:140, VM:140, VA:80, VC:50, VR:45 };
  let total = 0;
  for (const name of ['VA','VS','VO','VM','VC','VR']){
    const base = arr(name);
    if (!base){ E(F, name + ' لا تُقرَأ'); continue; }
    const key = name === 'VA' ? (x => [x[0],x[1],x[2]].join('|')) : (x => String(x[0]));
    const seen = {}, merged = [], dup = [];
    base.concat(PX[name] || []).forEach(x => {
      const k = key(x); if (seen[k]){ dup.push(k); return; } seen[k] = 1; merged.push(x);
    });
    total += merged.length;
    if (dup.length)
      E(F, name + ': ' + dup.length + ' مدخلةً مكتوبةً مرّتين بين الملفَّين (' +
        [...new Set(dup)].slice(0,5).join('، ') + ') — تُسحَب ضِعفَ غيرِها');
    if (merged.length < MIN[name])
      E(F, name + ': ' + merged.length + ' سؤالًا والحدُّ ' + MIN[name] +
        ' — بنكٌ بهذا الصِّغَر يقيس الحفظَ لا القدرة');

    if (['VS','VO','VM'].indexOf(name) < 0) continue;
    merged.forEach((x, i) => {
      if (!Array.isArray(x) || x.length !== 4 || x.some(y => typeof y !== 'string' || !y.trim()))
        return E(F, name + '[' + i + ']: ليست [كلمة، جواب، مشتّت، مشتّت] تامّة');
      if (x[1] === x[2] || x[1] === x[3] || x[2] === x[3])
        return E(F, name + ' · «' + x[0] + '»: خياران متطابقان — فللسؤالِ جوابان');
      /* الجوابُ عبارةٌ والمشتّتان كلمتان: يُعرَف بطولِه بلا قراءة.
         ويُشترَط فارقٌ حقيقيٌّ لا حرفان، فالكلماتُ القصيرةُ تتفاوت. */
      const a = x[1].length, d = Math.max(x[2].length, x[3].length);
      if (a / d > 1.6 && a - d >= 4)
        E(F, name + ' · «' + x[0] + '»: الجوابُ أطولُ من مشتّتَيه (' + a + ' مقابل ' + d +
          ' حرفًا) — يُختار بطولِه لا بمعناه');
    });
  }
  if (total && total < 600)
    E(F, 'بنكُ القسمِ اللفظيِّ ' + total + ' سؤالًا — والحدُّ ستّمئة');
  return out;
}

/* ═══ الجرعةُ الكمّيّة ═══════════════════════════════════════════════
   طلبُ الأب (٢٢ أكتوبر ٢٠٢٦): «جرعة للنقاط الكمية الأربع».

   وأخطرُ ما فيها أن يتباعد الشرحُ عن المولّد: أوّلُ صياغةٍ علّمته
   «خصم ٢٥٪ على ٨٠ ⇐ ٢٠»، ومولّدُ الخصمِ مع ٢٥٪ يجعل السعرَ مضاعفًا
   لأربعةٍ بين ١٦ و٧٢ — فالثمانون لا تخرج أبدًا. فكان يحفظ حالةً لن
   يراها، ولا يظهر ذلك في الصفحة: الشرحُ يُقرأ والأسئلةُ تُحَلّ.

   فيُشغَّل كلُّ مولّدٍ هنا ويُقابَل بجدولِ الأمثلة: أيخرج السؤالُ بهذا
   النصّ؟ وأصوابُه هو المكتوب؟ وأالخطأُ المحذَّرُ منه خيارٌ معروضٌ فعلًا؟ */
function quantDosePath(){
  const out = [];
  const F = 'practice.html', p = path.join(ROOT, F);
  if (!fs.existsSync(p)) return [{ sev:'خطأ', file:F, msg:'الصفحةُ مفقودة' }];
  const src = fs.readFileSync(p, 'utf8');
  const E = m => out.push({ sev:'خطأ', file:F, msg:m });

  /* ── الوصلُ بالصفحة ── */
  if (!/TABS\.push\(\["qd"/.test(src)) E('تبويبُ الجرعةِ الكمّيّةِ غيرُ مُدرَجٍ في TABS');
  if (!/who === "hasan"/.test(src)) E('الجرعةُ غيرُ مقصورةٍ على من قِيس — ولا تُفرَض على من لم يُقَس');
  const rs = /renderSet\("qd",\s*doseQuant\((\d+)\)/.exec(src);
  if (!rs) E('الجرعةُ لا تُرسَم من doseQuant');
  else if (+rs[1] < 10) E('أسئلةُ الجرعةِ ' + rs[1] + ' — ودونَ عشرةٍ لا تُثبّت قاعدة');
  /* ويُشترَط نداؤها داخلَ الشرحِ لا مجرّدُ وجودِ اسمِها: أوّلُ صياغةٍ
     بحثت عن «doseQExHtml()» فطابقت سطرَ تعريفِها نفسَه، فنجا رفعُ
     الجدولِ من الشرح. */
  if (!/\+\s*doseQExHtml\(\)\s*\+/.test(src))
    E('جدولُ «لا تقل / قل» غيرُ مُدرَجٍ في شرحِ الجرعة — فهي تكرارُ أسئلةٍ لا تعليم');
  if (!/QUANT_AR\.indexOf\(name\)/.test(src))
    E('مولّداتُ الجرعةِ تُطلَب بأرقامٍ لا بأسماء — فترتيبُ QUANT إن تغيّر صارت تدرّب غيرَ ما قِيس');

  /* ── المولّداتُ تُشغَّل ── */
  const sb = {}; vm.createContext(sb);
  function take(name, kind){
    const m = new RegExp('(?:var|function)\\s+' + name + '\\s*[=(]').exec(src);
    if (!m) return false;
    let i = src.indexOf(kind === 'arr' ? '[' : '{', m.index), d = 0, end = -1, q = null;
    const O = kind === 'arr' ? '[' : '{', C = kind === 'arr' ? ']' : '}';
    for (; i < src.length; i++){
      const c = src[i];
      if (q){ if (c === '\\') i++; else if (c === q) q = null; continue; }
      if (c === '"' || c === "'"){ q = c; continue; }
      if (c === O) d++; else if (c === C){ d--; if (!d){ end = i; break; } }
    }
    if (end < 0) return false;
    const body = src.slice(src.indexOf(O, m.index), end + 1);
    try { vm.runInContext(kind === 'arr' ? ('var ' + name + ' = ' + body + ';')
                                         : ('function ' + name + src.slice(m.index + m[0].length - 1, end + 1)), sb);
          return true; } catch(e){ return false; }
  }
  for (const h of ['ri','gp','opt3'])
    if (!take(h, 'fn')) { E('المساعدُ ' + h + ' لا يُنتزَع — فالمولّداتُ لا تُشغَّل'); return out; }
  for (const a of ['QUANT','QUANT_AR','DOSE_Q_EX','DOSE_Q_SETS'])
    if (!take(a, 'arr')) { E(a + ' لا تُنتزَع'); return out; }

  const QUANT = sb.QUANT, AR = sb.QUANT_AR, EX = sb.DOSE_Q_EX, SETS = sb.DOSE_Q_SETS;
  if (!Array.isArray(QUANT) || QUANT.length !== AR.length)
    E('QUANT وQUANT_AR مختلفتا الطول (' + QUANT.length + ' و' + AR.length + ') — فاسمُ المهارةِ يزلّ عن مولّدِها');

  /* كلُّ مهارةٍ في الأبواب موجودةٌ فعلًا */
  const inDose = {};
  SETS.forEach(s => s[1].forEach(n => {
    inDose[n] = 1;
    if (AR.indexOf(n) < 0) E('بابُ «' + s[0] + '» يشير إلى مهارةٍ لا وجودَ لها: «' + n + '»');
  }));
  if (SETS.length < 4) E('أبوابُ الجرعةِ ' + SETS.length + ' — وطلبُ الأب أربعُ نقاط');

  /* ── وdoseQuant تُشغَّل لا تُقرَأ ──
     قراءةُ DOSE_Q_SETS وحدَها لا تكفي: الدالّةُ قد تقصّها (slice) فتعالج
     بابًا واحدًا والجدولُ أربعة، ولا يظهر ذلك في نصِّ البيانات. */
  if (!take('doseIdx','fn') || !take('genQuant','fn') || !take('doseQuant','fn'))
    E('doseQuant لا تُنتزَع — فتوزيعُها لا يُفحَص');
  else {
    const seen = {}, name2door = {};
    SETS.forEach(s => s[1].forEach(n => { name2door[n] = s[0]; }));
    let err = null;
    for (let i = 0; i < 25 && !err; i++){
      let q; try { q = sb.doseQuant(12); } catch(e){ err = e.message; break; }
      if (!Array.isArray(q) || q.length !== 12){ err = 'ترجع ' + (q && q.length) + ' سؤالًا لا اثنَي عشر'; break; }
      q.forEach(x => {
        const d = name2door[x.gen];
        if (!d) err = err || ('تسحب من خارجِ أبوابِها: «' + x.gen + '»');
        else seen[d] = (seen[d] || 0) + 1;
      });
    }
    if (err) E('doseQuant: ' + err);
    else {
      const got = Object.keys(seen).length;
      if (got !== SETS.length)
        E('doseQuant تسحب من ' + got + ' بابٍ والجدولُ فيه ' + SETS.length +
          ' — فالجرعةُ تعالج بعضَ النقاطِ وتترك بقيّتَها (' + Object.keys(seen).join('، ') + ')');
      const v = Object.values(seen), hi = Math.max(...v), lo = Math.min(...v);
      if (lo && hi / lo > 1.5)
        E('توزيعُ الجرعةِ غيرُ متوازن: ' + JSON.stringify(seen));
    }
  }

  /* وكلُّ مهارةٍ في الجرعةِ نسبتُها مكتوبةٌ في التعليقِ فوقَها */
  const note = /جرعةُ حسنٍ الكمّيّة[\s\S]{0,2600}/.exec(src);
  if (!note) E('تعليقُ الجرعةِ مفقود — فلا يُعرَف على أيِّ قياسٍ بُنيت');
  else Object.keys(inDose).forEach(n => {
    const row = new RegExp(n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + '[^\\n]*٪').test(note[0]);
    if (!row) E('مهارةٌ في الجرعةِ بلا نسبةٍ مكتوبةٍ بجانبِها: «' + n + '» — فلا يُعرَف أضعفٌ هي أم مقابلة');
  });

  /* ── وجدولُ الأمثلةِ يُقابَل بالمولّد ── */
  (EX || []).forEach(e => {
    const [skill, qtext, wrong, right] = e;
    if (e.length !== 5) return E('مثالٌ ناقصُ الحقول: «' + skill + '»');
    const k = AR.indexOf(skill);
    if (k < 0) return E('مثالٌ لمهارةٍ لا وجودَ لها: «' + skill + '»');
    let hit = null;
    for (let i = 0; i < 40000 && !hit; i++){
      let q; try { q = QUANT[k](); } catch(err){ return E('مولّدُ «' + skill + '» يرمي: ' + String(err.message).slice(0,50)); }
      if (q && q[0] === qtext) hit = q;
    }
    if (!hit)
      return E('مثالُ «' + skill + '» لا يخرج من مولّدِه أبدًا — يُعلَّم حالةً لن يراها: «' + String(qtext).slice(0,56) + '»');
    const got = Number(hit[1][hit[2]]);
    if (got !== Number(right))
      E('مثالُ «' + skill + '»: الصوابُ المكتوبُ ' + right + ' والمولّدُ يقول ' + got);
    if (hit[1].map(Number).indexOf(Number(wrong)) < 0)
      E('مثالُ «' + skill + '»: الخطأُ المحذَّرُ منه (' + wrong + ') ليس من خياراتِ السؤال (' +
        hit[1].join('، ') + ') — فالتحذيرُ من خطأٍ لا يقع');
    if (Number(wrong) === Number(right))
      E('مثالُ «' + skill + '»: الخطأُ والصوابُ واحد');
  });
  return out;
}

/* ═══ مصحّحُ التعبيرِ وسجلُّه ═══════════════════════════════════════
   سؤالُ الأب (٢٢ أكتوبر ٢٠٢٦): «كيف حسن في التعبير؟» — فظهر عطبان:

   ١) المصحّحُ قائمةُ فحصٍ شكليّةٍ وحدَها (حرفٌ كبير، نقطة، تنوّعُ
      مفردات) لا يقرأ صحّةَ اللغةِ أصلًا. فتخرج الدرجةُ تقول «الشكلُ
      مضبوط» ويقرؤها الأبُ «اللغةُ سليمة».

   ٢) الصفحةُ تعيد المسوّدةَ إلى الصندوقِ عند الفتح، وعلامةُ «آخرِ ما
      حُفِظ» في الذاكرةِ وحدَها فتُمحى مع التحميل. فيضغط الطفلُ «قيّم
      كتابتي» فيُحفَظ صفٌّ جديدٌ بنصٍّ قديم: إحدى عشرةَ تسليمةً في
      سجلِّ حسنٍ وفيها خمسةُ نصوصٍ فقط.

   والحارسُ يُحمّل الوحدةَ ويُشغّلها: الإنذارُ الكاذبُ يعلّم خطأً وهو
   أسوأُ من السكوت، فتُجرَّب القواعدُ على الصحيحِ قبل الخاطئ. */
function writingPath(){
  const out = [];
  const F = 'writing-en.js', p = path.join(ROOT, F);
  if (!fs.existsSync(p)) return [{ sev:'خطأ', file:F, msg:'الوحدةُ مفقودة' }];
  const src = fs.readFileSync(p, 'utf8');
  const E = m => out.push({ sev:'خطأ', file:F, msg:m });

  let W;
  try {
    const sb = { window:{}, document:{ addEventListener:function(){} }, navigator:{},
                 localStorage:{ getItem:() => null, setItem:function(){} } };
    sb.globalThis = sb; vm.createContext(sb);
    vm.runInContext(src, sb);
    W = sb.window.WritingEN;
  } catch(e){ return (E('لا تُحمَّل: ' + String(e.message).slice(0,70)), out); }
  if (!W || typeof W.grammar !== 'function' || typeof W.grade !== 'function')
    return (E('grammarIssues أو gradeWriting غيرُ مكشوفتَين — فالمصحّحُ لا يُفحَص'), out);

  /* ── الصحيحُ أوّلًا: صفرُ إنذار ── */
  const OK = [
    'a university student went to an hour-long class.',
    'He is a European teacher and an honest man.',
    'She goes to school and he has a book.',
    'There are many people in the city.',
    'I had had enough of that.',
    'This is more interesting than more water or more paper.',
    'He did not go, and I want to go.',
    'He can go now; she may go later.',
    'We need much water and many books.',
    'The news is good and the traffic is heavy.',
    'It was a one-way street with a useful sign.',
    'My teacher gave me more homework and good advice.',
    'People are waiting; the police are here.',
    'A unique idea and a unit of work.',
    'I read a lot of books because the environment matters.',
    'Reading improves vocabulary and builds knowledge every day.',
    'In addition, the crowded streets increase pollution and make the air less clean.'
  ];
  OK.forEach(s => {
    let r; try { r = W.grammar(s); } catch(e){ return E('grammarIssues ترمي: ' + String(e.message).slice(0,50)); }
    if (r && r.length)
      E('إنذارٌ كاذبٌ على جملةٍ صحيحة: «' + s.slice(0,48) + '» ⇐ ' +
        r.map(x => x.bad + ' [' + x.why + ']').join(' · ') + ' — والإنذارُ الكاذبُ يعلّم خطأً');
  });

  /* ── ثمّ الخاطئ: يُمسَك ── */
  const BAD = [
    ['a apple','a قبل حرف علّة'], ['an book','an قبل حرف ساكن'], ['a hour','a قبل h صامتة'],
    ['He have a car.','هو/هي + فعل بلا s'], ['She go to school.','هو/هي + فعل بلا s'],
    ['I did went there.','did + فعل ماضٍ'], ['I want to went home.','to + فعل ماضٍ'],
    ['He can to swim.','فعل مساعد + to'], ['This is more better.','more + صيغة تفضيل'],
    ['People is happy.','جمع + فعل مفرد'], ['I need informations.','جمعُ اسمٍ لا يُجمَع'],
    ['There is many cars.','there is + جمع'], ['Too much people came.','much + اسم معدود'],
    ['I saw the the dog.','كلمة مكرّرة'], ['I read alot.','alot'], ['becuase it rained','إملاء شائع الخطأ']
  ];
  BAD.forEach(([s, why]) => {
    const r = W.grammar(s) || [];
    if (!r.some(x => x.why === why))
      E('خطأٌ أفلت: «' + s + '» — المنتظَرُ «' + why + '» والناتجُ ' +
        (r.length ? r.map(x => x.why).join('، ') : 'لا شيء'));
  });

  /* ── وسقفُ درجةِ اللغةِ يعمل ── */
  const lang = g => { const s = (g.subs || []).filter(x => x.en === 'Language')[0]; return s ? s.band : null; };
  const CLEAN = 'Reading is very useful for students. First, it improves vocabulary and builds knowledge. ' +
                'Second, it helps people understand other cultures. However, some students do not read enough. ' +
                'In conclusion, reading every day is a good habit that everyone should keep.';
  const DIRTY = 'Reading is very useful for students. He have a book and she go to school. ' +
                'There is many informations in a apple. I did went to the the library becuase i like it.';
  try {
    const gc = W.grade(CLEAN, 2, 'A2'), gd = W.grade(DIRTY, 2, 'A2');
    const nc = (W.grammar(CLEAN) || []).length, nd = (W.grammar(DIRTY) || []).length;
    if (nc !== 0) E('النصُّ المرجعيُّ السليمُ فيه ' + nc + ' إنذارًا كاذبًا');
    if (nd < 5) E('النصُّ المرجعيُّ المليءُ بالأخطاءِ أُمسِك منه ' + nd + ' فقط');
    if (lang(gd) === null) E('مقياسُ Language غيرُ موجودٍ في الدرجة');
    else {
      if (lang(gd) > 2)
        E('درجةُ اللغةِ ' + lang(gd) + '/٥ مع ' + nd + ' خطأَ قواعدَ — والسقفُ اثنان عند ثلاثةٍ فأكثر');
      if (!(lang(gc) > lang(gd)))
        E('درجةُ اللغةِ لا تفرّق بين نصٍّ سليمٍ ونصٍّ فيه ' + nd + ' خطأً (' +
          lang(gc) + ' و' + lang(gd) + ')');
      /* ═══ والأخطاءُ تُعرَض له لا تُخصَم منه وحسب ═══════════════════
         السقفُ وحدَه لا يكفي: لو رُفِع فحصُ القواعدِ من قائمةِ مقياسِ
         اللغةِ بقيت الدرجةُ منخفضةً والطفلُ لا يدري أين أخطأ — وهو
         عقابٌ بلا تعليم، وهذي الجرعةُ تعليمٌ قبل أن تكون درجة.
         فيُشترَط بندٌ مرفوضٌ يحمل الخطأَ نفسَه وتصويبَه. */
      const shown = (gd.checks || []).filter(c => c && c.ok === false &&
        /أخطاء قواعد/.test(String(c.label || '')));
      if (!shown.length)
        E('أخطاءُ القواعدِ تُخصَم ولا تُعرَض — فالدرجةُ تنزل ولا يعرف الطفلُ أين أخطأ');
      else {
        const hint = String(shown[0].hint || '');
        const sample = (W.grammar(DIRTY) || [])[0];
        if (sample && hint.indexOf(sample.bad) < 0)
          E('بندُ أخطاءِ القواعدِ بلا الخطأِ نفسِه («' + sample.bad + '») — فلا يُعرَف ما يُصحَّح');
        if (sample && hint.indexOf(sample.good) < 0)
          E('بندُ أخطاءِ القواعدِ بلا التصويب («' + sample.good + '») — والمقابلةُ هي التعليم');
      }
    }
  } catch(e){ E('gradeWriting ترمي: ' + String(e.message).slice(0,60)); }

  /* ── وسجلُّ التسليم: النصُّ الواحدُ لا يُحفَظ مرّتين ── */
  if (!/var savedKey = "wen_saved_"/.test(src))
    E('بصمةُ آخرِ ما حُفِظ لا تُخزَّن — فإعادةُ المسوّدةِ بعد التحميلِ تُحفَظ عملًا جديدًا');
  if (!/_lastSaved = localStorage\.getItem\(savedKey\)/.test(src))
    E('البصمةُ لا تُقرأ عند الفتح — وهي تُمحى مع كلِّ تحميلٍ فتعود العلّة');
  if (!/if\(now && now === _lastSaved\) return false;/.test(src))
    E('saveParagraph تحفظ النصَّ نفسَه مرّةً ثانية');
  if (!/if\(!saveParagraph\(g, false\)/.test(src))
    E('زرُّ «قيّم كتابتي» لا يُخبر الطفلَ أنّ نصَّه لم يُحفَظ — فيحسب أنّه سلّم عملًا جديدًا');
  return out;
}

/* ═══ كلماتُ الابنِ تُعرَف بالكلمةِ لا بالموضع ═════════════════════════
   سؤالُ الأب (٢٤ أكتوبر ٢٠٢٦): «شف سعود في حفظ الكلمات». وقِياسُ سجلِّه
   كشف أنّ عدّادَه يكذب عليه: تقدُّمُه محفوظٌ رقمًا («حفظتُ ٣٨٠»)، فلمّا
   تقدّمت مفرداتُ مقرَّرِه في ٨ أكتوبر صار الرقمُ يعني أوّلَ ٣٨٠ من قائمةٍ
   أوّلُها مئةُ كلمةٍ من كتابِه لم يرَها قطّ — فحُسِبت محفوظةً وحُرِم منها،
   وفي مقابلها ١٠٣ كلماتٍ يعرفها سقطت خارج العدّاد فلم تعد تُراجَع. ودَينُه
   في سجلِّه ارتفع من ٢٢ إلى ١١٧ بلا جلسةٍ واحدةٍ بينهما.

   وهذا الحارسُ يُشغّل كودَ الصفحةِ نفسَه (ownedList · nextNewWords ·
   srDebt · freshCount وبناءَ VOCAB_LIST) على حالةٍ مُصطنَعةٍ تُحاكي
   وضعَه، فلا يفحص نسخةً من المنطق بل المنطقَ الذي يراه الطفل. */
function vocabOwnPath(){
  const out = [], F = 'reading.html', p = path.join(ROOT, F);
  if (!fs.existsSync(p)) return [{ sev:'خطأ', file:F, msg:'الصفحةُ مفقودة' }];
  const src = fs.readFileSync(p, 'utf8');
  const E = m => out.push({ sev:'خطأ', file:F, msg:m });

  /* يقتطع تعريفًا كاملًا بموازنةِ الأقواس — فما يُفحَص هو كودُ الصفحة */
  function grab(head){
    const i = src.indexOf(head);
    if (i < 0) return null;
    let j = src.indexOf('{', i), d = 0;
    if (j < 0) return null;
    for (let k = j; k < src.length; k++){
      if (src[k] === '{') d++;
      else if (src[k] === '}'){ d--; if (!d) return src.slice(i, k+1); }
    }
    return null;
  }
  const NEED = ['var VOCAB_LIST = (function(){', 'function ownedList(', 'function ownedCount(',
                'function nextNewWords(', 'function freshCount(', 'function srDebt(',
                'function isFreshWord(', 'function srRecalled('];
  const parts = {};
  for (const h of NEED){
    const g = grab(h);
    if (!g) return (E('لا يُنتزَع «' + h + '» — تغيّر اسمُه أو حُذف، فلا يُفحَص اختيارُ الكلمات'), out);
    parts[h] = g + (h.indexOf('var ') === 0 ? ')();' : '');
  }
  const stale = /var\s+POS_STALE\s*=\s*([^;]+);/.exec(src);
  if (!stale) return (E('POS_STALE غائبة — موضعُ الكلمةِ يحكم كلماتِ سعودٍ من جديد'), out);
  const num = (rx, what) => { const m = rx.exec(src); if (!m) E(what + ' لا تُقرأ'); return m ? +m[1] : 0; };
  const STEP = num(/var VOC_STEP = (\d+)/, 'VOC_STEP');
  const MBOX = num(/var MASTERED_BOX = (\d+)/, 'MASTERED_BOX');
  const FWIN = num(/var FRESH_WINDOW = (\d+)/, 'FRESH_WINDOW');

  /* ── حالةٌ مُصطنَعةٌ تُحاكي وضعَ سعود ──
     قائمةٌ عامّةٌ من ستّين، ومقرَّرٌ من عشرين تتقدّم عليها. وذاكرتُه:
     كلماتٌ من آخرِ العامّة (تسقط خارجَ العدّاد بعد الترتيب الجديد)،
     وأربعٌ من المقرَّر، وواحدةٌ عُرضت ولم تُسترجَع. */
  const GEN = [], CRS = [];
  for (let i = 0; i < 60; i++) GEN.push(['g' + i, ['ع' + i]]);
  for (let i = 0; i < 20; i++) CRS.push(['c' + i, ['م' + i]]);
  const SR = {};
  const KNOWN = ['g50','g51','g52','g53','g54','g55','c0','c1','c2','c3'];
  KNOWN.forEach(k => SR[k] = { b:2, c:3, n:3, t:Date.now() - 4*86400000 });
  SR['g59'] = { b:0, c:0, n:1, t:0 };                /* عُرضت ولم تُسترجَع */
  const OWNED = KNOWN.concat(['g59']);

  function world(who, en4){
    const sb = { window:{ VOCAB_EN4: en4 }, who:who, VOCAB300: GEN.slice(),
                 VOC_STEP: STEP, MASTERED_BOX: MBOX, FRESH_WINDOW: FWIN,
                 getSR: () => { const o = {}; for (const k in SR) o[k] = SR[k]; return o; },
                 Date: Date, Math: Math, JSON: JSON };
    vm.createContext(sb);
    try {
      vm.runInContext(parts['var VOCAB_LIST = (function(){'], sb);
      vm.runInContext('var VOC_TOTAL = VOCAB_LIST.length;', sb);
      vm.runInContext('var POS_STALE = ' + stale[1] + ';', sb);
      for (const h of NEED) if (h.indexOf('function') === 0) vm.runInContext(parts[h], sb);
    } catch(e){ E('كودُ الاختيارِ لا يُقوَّم: ' + String(e.message).slice(0,70)); return null; }
    return sb;
  }

  /* ١) سعودٌ: كلماتُه ما له ذاكرةٌ فيه، حيث وقع في القائمة */
  const S = world('saud', CRS);
  if (!S) return out;
  if (!S.POS_STALE) E('POS_STALE مطفأةٌ لسعودٍ ومقرَّرُه مُقدَّم — موضعُه سيحكم كلماتِه');
  const own = S.ownedList(999).map(w => w[0]);
  const miss = OWNED.filter(w => own.indexOf(w) < 0);
  if (miss.length) E('كلماتٌ في ذاكرتِه خرجت من بركتِه: ' + miss.join(' ') + ' — لا تعود إليه في مراجعة');
  const ghost = own.filter(w => !SR[w]);
  if (ghost.length) E('كلماتٌ لم تُعرَض عليه دخلت بركتَه: ' + ghost.slice(0,6).join(' '));
  if (S.ownedCount(999) !== OWNED.length)
    E('عدُّ كلماتِه ' + S.ownedCount(999) + ' والصوابُ ' + OWNED.length);
  /* والعدَّادُ القديمُ لا يرفعه: ٤٠ موضعًا لا تعني أربعين كلمة */
  if (S.ownedCount(40) !== OWNED.length)
    E('العدَّادُ القديمُ ما زال يحكم عدَّ كلماتِه (' + S.ownedCount(40) + ')');

  /* ٢) دَينُه على ما عُرض عليه وحده */
  if (S.srDebt(999) !== 1)
    E('دَينُه ' + S.srDebt(999) + ' والصوابُ ١ — تُحسَب عليه كلماتٌ لم تُعرَض (وهي علّةُ ١١٧)');

  /* ٣) الدفعةُ الجديدةُ من مقرَّرِه، ولم يرَها */
  const nx = S.nextNewWords(999).map(w => w[0]);
  if (nx.length !== STEP) E('الدفعةُ الجديدة ' + nx.length + ' والمنتظَر ' + STEP);
  const seen = nx.filter(w => SR[w]);
  if (seen.length) E('الدفعةُ الجديدةُ فيها ما مرّ عليه: ' + seen.join(' '));
  const notCourse = nx.filter(w => w[0] !== 'c');
  if (notCourse.length) E('الدفعةُ الجديدةُ ليست من مقرَّرِه: ' + notCourse.join(' ') + ' — وتقديمُ المقرَّرِ هو مقصودُ الترتيب');

  /* ٤) غيرُ الثابتةِ تُعَدُّ على كلماتِه لا على أوّلِ العدّاد */
  if (S.freshCount(999) < 1) E('خانةُ «ما ثبتت بعد» فارغةٌ وفيه كلمةٌ عُرضت ولم تُسترجَع');
  if (S.freshCount(999) > OWNED.length) E('«ما ثبتت بعد» تتجاوز عددَ كلماتِه');

  /* ٥) وبقيّةُ الأولادِ قائمتُهم كما كانت: الموضعُ يصفُ كلماتِهم */
  const H = world('hasan', null);
  if (!H) return out;
  if (H.POS_STALE) E('POS_STALE مشتعلةٌ لحسنٍ وقائمتُه لم تتغيّر');
  const hown = H.ownedList(30).map(w => w[0]);
  if (hown.length !== 30 || hown[0] !== 'g0' || hown[29] !== 'g29')
    E('بركةُ حسنٍ لم تبق أوّلَ ثلاثين موضعًا (' + hown.length + ')');
  if (H.srDebt(30) !== 30) E('دَينُ حسنٍ ' + H.srDebt(30) + ' والمنتظَر ٣٠ — تغيّر حسابُه وقائمتُه لم تتغيّر');
  const hnx = H.nextNewWords(30).map(w => w[0]);
  if (hnx[0] !== 'g30' || hnx.length !== STEP)
    E('دفعةُ حسنٍ الجديدةُ ليست ما يلي عدّادَه (' + hnx.join(' ') + ')');

  /* ٦) والصفحةُ تستعمل هذه الأدواتِ فعلًا — لا تُعرَّف وتُهمَل */
  const uses = [
    [/ownedList\(learned\)\.forEach/, 'خانةُ «ما ثبتت بعد» ما زالت تُبنى من أوّلِ العدّاد'],
    [/var fullPool = ownedList\(learned\);/, 'بركةُ «راجع المحفوظ» ما زالت تُبنى من أوّلِ العدّاد'],
    [/else V = nextNewWords\(learned\);/, 'الدفعةُ الجديدةُ ما زالت تُقطَع بالموضع'],
    [/var owned = ownedCount\(learned\);/, 'الرسمُ لا يحسب كلماتِه فيعود الرقمُ المعروضُ كاذبًا'],
    [/isFreshWord\(st, i, owned\)/, '«الجديد» يُقاس بالعدّادِ القديمِ لا بعددِ كلماتِه'],
    [/isFreshWord\(srs\[w\[0\]\], i, owned\)/, 'استثناءُ «الجديد» من المراجعةِ يُقاس بالعدّادِ القديم'],
    [/حفظت <span dir="ltr">'\+owned\+'/, 'شريطُ التقدّمِ يعرض العدّادَ لا عددَ كلماتِه'],
    [/var cur=vocLearnedNum\(\);/, 'رسالةُ التصفيرِ تعرض العدّادَ القديم']
  ];
  for (const [rx, msg] of uses) if (!rx.test(src)) E(msg);
  /* ومواضعُ الحفظِ ثلاثةٌ لا واحد (الجزئيّ · الجديد · المراجعة)، فلو
     فُحِص وجودُ واحدٍ منها نجا تخريبُ البقيّة: فيُعَدّ ويُشترط ألّا
     يبقى موضعٌ يحمل العدّادَ القديم. */
  const count = rx => (src.match(rx) || []).length;
  const SAVES = 3;
  if (count(/learned:vocLearnedNum\(\)/g) !== SAVES)
    E('مواضعُ حفظِ الكلماتِ التي تكتب عددَ كلماتِه ' + count(/learned:vocLearnedNum\(\)/g) + ' والمنتظَر ' + SAVES + ' — موضعٌ يكتب العدّادَ القديمَ فيكذب تقريرُ الأب');
  if (/learned:\s*getLearned\(\)/.test(src))
    E('موضعُ حفظٍ ما زال يكتب العدّادَ القديمَ في الصفّ');
  if (count(/srKnown\(ownedList\(getLearned\(\)\)\)/g) !== SAVES)
    E('أرقامُ التقريرِ (رسخت · قيد التثبيت) لا تُحسَب من كلماتِه في المواضعِ الثلاثةِ كلِّها');
  if (/srKnown\(VOCAB_LIST\.slice/.test(src) || /srLearning\(VOCAB_LIST\.slice/.test(src))
    E('أرقامُ التقريرِ تُحسَب من أوّلِ العدّاد');
  /* ولا يُسجَّل الجديدُ بمجرّدِ العرض: «جديد» هو الوضعُ الافتراضيُّ عند
     فتحِ الصفحة، فتسجيلُه يَعُدُّ عشرًا معروضةً على من لم يفتح القسم. */
  if (/else \{ V = nextNewWords\(learned\);[\s\S]{0,400}?srShow\(V\)/.test(src))
    E('الدفعةُ الجديدةُ تُسجَّل بمجرّدِ عرضِها — فمجرّدُ فتحِ الصفحةِ يُثقِل دَينَه');
  return out;
}
/* ═══ مفرداتُ كتابِ سعودٍ كما في صفحةِ Scope and Sequence ══════════════
   أرسل الأب صورةَ الصفحةِ (٢٥ أكتوبر ٢٠٢٦)، فإذا ملفُّ المفرداتِ الذي
   بُني قبلَ وصولِ الكتابِ ناقصٌ ثلاثًا وستّين كلمةً من سبعٍ وتسعين
   **تُدرَّس** في كتابِه — ومنها وحدةُ الترحيبِ كلُّها، ومراجعةُ الوحدةِ
   الرابعةِ كلُّها، وأعمالُ المنزلِ كما يعلّمها الكتابُ عباراتٍ تامّة.

   فالقائمةُ ههنا منقولةٌ من الصفحةِ حرفًا بحرف، وهي الحَكَم: من أعاد
   ترتيبَ الملفِّ أو اختصره فأسقط منها كلمةً، وقف عليه هذا الحارس.
   وليس فيها عمودُ «يُعرَّض له» (EXPOSURE) لأنّه لا يُمتَحَن فيه —
   يبقى في الملفِّ ولا يُشترَط هنا. */
const EN4_BOOK = {
  'الترحيب': ['afraid','brilliant','dangerous','different','exciting','naughty',
              'surprised','terrible','first','second','third','fourth','fifth',
              'sixth','seventh','eighth','ninth','tenth','eleventh','twelfth',
              'thirteenth','fourteenth','fifteenth','sixteenth','seventeenth',
              'eighteenth','nineteenth','twentieth',
              'beautiful','dirty','fantastic','favorite','great',
              /* ومن صفحاتِ الوحدةِ نفسِها (٤–٩، صوّرها الأب ٢٥ أكتوبر):
                 كلماتُ صورةِ «Look and find» ومراجعةُ المقارنةِ والتفضيل —
                 وليست في عمودِ المفرداتِ من صفحةِ Scope and Sequence. */
              'balloons','bus','camera','photo','playground','poster','drums','guitar',
              'taller','tallest','longer','smaller','biggest','nicest',
              'better','best','worst','more difficult'],
  'و١ Family Events': ['aunt','cousin','daughter','granddaughter','grandson',
              'grown-up','parent','son','uncle','chatty','helpful','kind','lazy',
              'strong','tired','weak','man','woman',
              /* ومن صفحاتِ الوحدةِ نفسِها (١٠–٢١، صوّرها الأب ٢٥ أكتوبر):
                 صفةُ ص١٦ وصيغُ المخاطبةِ في ص١٩ — وليست في عمودِ المفردات. */
              'shy','father','mother','grandfather','grandmother',
              'daddy','mommy','auntie','granny'],
  'و٢ Chores': ['catch the bus','comic book','get dressed','get undressed',
              'get on','get off','grandparents','get up','leaf','leaves','ride',
              'trash can','wake up','clear the table','cut the grass',
              'feed the animals','make the bed','set the table','sweep the floor',
              'take out the trash','wash the dishes',
              /* ومن صفحاتِ الوحدةِ نفسِها (٣٠–٣٣، صوّرها الأب ٢٧ أكتوبر):
                 «leave» من تمرينِ Word Work، وكلماتُ صفحةِ النظافةِ
                 التي تُسأل في مراجعةِ الوحدة. */
              'leave','bus stop','cleanliness','germs','bacteria','dust','flu','mosquito'],
  'و٣ Stories': ['call','carry','climb','cry','dream','drop','laugh','prefer',
              'score','shout','wait','e-mail','fix','invite','need','plant','rob',
              'stop','water','clap','jump','nice','old','open','young',
              /* ومن صفحاتِ الوحدةِ (٤٢–٤٥، صوّرها الأب ٢٧ أكتوبر): كلماتُ
                 تمرينِ ص٤٤ الأربع، ومفرداتُ بناءِ المسرحيّةِ في ص٤٣. */
              'writer','funny','trouble','narrator','setting'],
  'و٤ After-School Fun': ['catch the ball','dress up','go shopping','hide','inside',
              'make a model','outside','play board games','play video games',
              'take photos','texting','vlogging','badly','carefully','happily',
              'loudly','luckily','quickly','quietly','slowly','play sports',
              'read books','run in the park','see a movie','watch TV','write stories',
              /* ومن صفحاتِ الوحدةِ (٥٤–٥٧): مفرداتُ مدوّنةِ الهوايات وصفحةِ
                 الألعابِ القديمة. و«listen to music» و«play the piano» من
                 عمودِ المراجعةِ نفسِه، أُدخِلتا بإذنِ الأب (٢٧ أكتوبر). */
              'listen to music','play the piano','hobby','competition','practice',
              'hopscotch','blindfold']
};
function vocabEn4Path(){
  const out = [], f = 'vocab-en4.js', p = path.join(ROOT, f);
  const E = m => out.push({ sev:'خطأ', file:f, msg:m });
  if (!fs.existsSync(p)) return [{ sev:'خطأ', file:f, msg:'ملفُّ مفرداتِ مقرَّرِ سعودٍ مفقود' }];
  const sb = { window:{} }; vm.createContext(sb);
  try { vm.runInContext(fs.readFileSync(p, 'utf8'), sb); }
  catch(e){ return (E('لا يُقوَّم: ' + String(e.message).slice(0,70)), out); }
  const L = sb.window.VOCAB_EN4;
  if (!Array.isArray(L) || !L.length) return (E('window.VOCAB_EN4 فارغةٌ أو غائبة'), out);

  /* الصفحةُ تُحمّله، وإلّا حفظ سعودٌ من القائمةِ العامّةِ وحدَها */
  const rp = path.join(ROOT, 'reading.html');
  if (fs.existsSync(rp) && fs.readFileSync(rp,'utf8').indexOf('src="' + f + '"') < 0)
    E('reading.html لا تُحمّله — فيعود سعودٌ يحفظ ما ليس في كتابِه');

  /* الصيغةُ: ["english", ["العربيّة"]] — وخللُها يُعطّل بطاقةً بلا خبر */
  const seen = {}, ar = {};
  L.forEach(function(w, i){
    if (!Array.isArray(w) || w.length !== 2 || typeof w[0] !== 'string' ||
        !Array.isArray(w[1]) || !w[1].length || typeof w[1][0] !== 'string' ||
        !w[0].trim() || !w[1][0].trim())
      return E('المدخلُ ' + (i+1) + ' صيغتُه خاطئة: ' + JSON.stringify(w).slice(0,60));
    const k = w[0].toLowerCase().trim();
    if (seen[k]) E('كلمةٌ مكرّرة: ' + w[0]); else seen[k] = 1;
    const a = w[1][0].trim();
    if (ar[a]) E('عربيّةٌ واحدةٌ لكلمتَين (' + ar[a] + ' · ' + w[0] + ') — يُسأل عنها فلا يدري أيَّهما يكتب');
    else ar[a] = w[0];
  });

  /* ═══ ولا يدخل كتابُ الفصلِ الثاني قبل أوانِه ═══════════════════
     قال الأب (٢٥ أكتوبر ٢٠٢٦): «كتاب الفصل الثاني لا تحطّه نهائيًّا،
     إلّا لمّا يبدأ — بعد شهرين يمكن». وكانت ههنا ستٌّ وخمسون كلمةً
     لوحداتٍ أربعٍ قُدّرت تقديرًا، فنُزعت. وهذه عيّنةٌ منها تمنع عودتَها
     سهوًا — ومن أعادها عمدًا بعد أن يبدأ الفصلُ ويصلَ الكتابُ، رفع
     هذا السطرَ وعرف لماذا كان. */
  const TERM2 = ['headache','toothache','stomachache','earache','x-ray','band aid',
                 'giraffe','kangaroo','panda','polar bear','jungle','waterfall',
                 'countryside','rainbow','snowy','rainy','cloudy','sunny','windy',
                 'temperature','season'];
  const early = TERM2.filter(function(w){ return seen[w.toLowerCase()]; });
  if (early.length)
    E('كلماتٌ من كتابِ الفصلِ الثاني دخلت قبل أوانِه (' + early.length + '): ' + early.slice(0,8).join(' · ') +
      ' — وطلبُ الأب ألّا يُوضَع حتّى يبدأ الفصل');

  /* ولا تسقط كلمةٌ يُمتَحَن فيها */
  for (const unit in EN4_BOOK){
    const miss = EN4_BOOK[unit].filter(function(w){ return !seen[w.toLowerCase()]; });
    if (miss.length)
      E(unit + ': سقطت ' + miss.length + ' كلمةً من كتابِه — ' + miss.join(' · '));
  }
  return out;
}
/* ═══ المايكُ الصامتُ يُكشَف ولا تُترَك القراءةُ تضيع ═══════════════
   بلاغ الأب (٢٧ أكتوبر ٢٠٢٦): «حسن الصوت ما يلقط — قراءة القطعة».
   وسجلُّه: آخرُ قراءةٍ ناجحةٍ ٢٣ أكتوبر، ثمّ انتقل إلى حاسبٍ بمتصفّحِ
   Edge فخمسُ محاولاتٍ في ثلاثةِ أيّامٍ كلُّها «session-no-audio» —
   الجلسةُ تُفتح ولا يصلها صوتٌ قطّ، وheard=false في كلِّ دورة. ومكث
   بين ثلاثَ عشرةَ ثانيةً وإحدى وستّين يقرأ قبل أن يُقال له ذلك.

   فالعلاجُ ثلاثةٌ يُفحَص كلُّها: مقياسٌ لِما يصل من المايك، وزرٌّ
   يختبره قبل القراءة، وحارسٌ يقطع في تسعِ ثوانٍ إن كان صامتًا. */
function micLevelPath(){
  const out = [], F = 'mic-help.js', R2 = 'reading.html';
  const E = (f, m) => out.push({ sev:'خطأ', file:f, msg:m });
  const mp = path.join(ROOT, F), rp = path.join(ROOT, R2);
  if (!fs.existsSync(mp) || !fs.existsSync(rp)) return [{ sev:'خطأ', file:F, msg:'ملفٌّ مفقود' }];
  const mh = fs.readFileSync(mp, 'utf8'), rd = fs.readFileSync(rp, 'utf8');

  /* ── ١) المقياسُ يُقوَّم ويُصدَّر ويقيس فعلًا ── */
  const sb = { window:{}, navigator:{ userAgent:'' } }; sb.window.navigator = sb.navigator;
  vm.createContext(sb);
  try { vm.runInContext(mh, sb); } catch(e){ return (E(F, 'لا يُقوَّم: ' + String(e.message).slice(0,70)), out); }
  const MICo = sb.window.MIC;
  if (!MICo) return (E(F, 'window.MIC غائبة'), out);
  for (const k of ['level', 'deadMicMsg', 'LVL_DEAD', 'LVL_WEAK'])
    if (MICo[k] === undefined) E(F, 'MIC.' + k + ' غائبة — المقياسُ لا يصل الصفحة');
  if (typeof MICo.level !== 'function') E(F, 'MIC.level ليست دالّة');
  /* العتبتان بينهما فرقٌ معتبَر، ودونَ ما يبلغه صوتُ قارئٍ جهرًا */
  if (!(MICo.LVL_DEAD > 0 && MICo.LVL_DEAD < MICo.LVL_WEAK && MICo.LVL_WEAK < 0.2))
    E(F, 'عتبتا المستوى غيرُ مرتّبتَين: ' + MICo.LVL_DEAD + ' / ' + MICo.LVL_WEAK);
  /* ومقياسٌ بلا جهازٍ يرجع خطأً ولا يرمي — فلا يُعطّل القراءة */
  try {
    let got = null; MICo.level(10, null, o => { got = o; });
    if (!got || got.err !== 'unsupported') E(F, 'المقياسُ بلا جهازٍ لا يرجع خطأً نظيفًا');
  } catch(e){ E(F, 'المقياسُ يرمي حين لا جهاز: ' + String(e.message).slice(0,50)); }
  /* ورسالةُ العطبِ تدلُّ على الإجراءِ لا تقول «ارفع صوتك» */
  const dm = String(MICo.deadMicMsg('') || '');
  if (!/[؀-ۿ]/.test(dm)) E(F, 'رسالةُ المايكِ الميّتِ بلا عربيّة');
  if (/اقرأ أعلى|ارفع صوتك/.test(dm))
    E(F, 'رسالةُ المايكِ الميّتِ تنصح برفعِ الصوت — وهو لا ينفع في مايكٍ لا يُقرأ منه');
  /* الإغلاقُ التامّ: مسارٌ وسياقٌ — وإلّا بقي مؤشّرُ التسجيلِ مضاءً */
  if (!/t\.stop\(\);/.test(mh) || !/ctx\.close\(\)/.test(mh))
    E(F, 'المقياسُ لا يُغلق المسارَ والسياقَ الصوتيّ');
  if (!/noiseSuppression:false/.test(mh))
    E(F, 'كبحُ الضجيجِ مُشتغِلٌ في المقياس — قد يُصفّر ضجّةَ الغرفةِ فيبدو المايكُ السليمُ ميّتًا');

  /* ── ٢) الصفحةُ: زرٌّ وحارسٌ وحفظُ الرقم ── */
  const need = [
    [/function micTestBtnHtml\(\)/,            'زرُّ «اختبر المايك» غيرُ معرَّف'],
    [/azBtnHtml\(\)\+micTestBtnHtml\(\)/,      'الزرُّ لا يُركَّب في شريطِ القطعة'],
    [/wireMicTest\(sec\.querySelector\("\[data-mic-wrap\]"\)\)/, 'الزرُّ غيرُ موصول'],
    [/if\(window\.__paBusy\)\{ box\.style\.display="block";/,    'الاختبارُ يُزاحم تسجيلًا جاريًا — وتلك علّةُ ٦ سبتمبر'],
    [/_showListening\(retry\); _lvlStart\(\);/, 'المقياسُ لا يبدأ مع التسجيل'],
    [/clearTimeout\(_to\); _lvlEnd\(\);/,       'المقياسُ لا يُغلَق عند انتهاءِ القراءة'],
    [/if\(_IOS \|\| !window\.MIC \|\| !MIC\.level \|\| _lvlStop\) return;/,
       'الحارسُ غيرُ مقصورٍ على غيرِ آيفون — ومسارٌ ثانٍ مع أزور على سفاري قطع المحادثةَ في ٦ سبتمبر'],
    [/if\(_lvlErr \|\| !_lvlN\) return;/,       'يحكم بالعطبِ وهو لم يَقِس شيئًا'],
    [/if\(_lvlPeak >= MIC\.LVL_DEAD\) return;/, 'يقطع القراءةَ وإن وصل صوتٌ من المايك'],
    [/if\(_fin \|\| _userStopped \|\| _heardAny\) return;/,
       'يقطع القراءةَ وأزور سمعته — فالصوتُ يصل والعلّةُ في مكانٍ آخر'],
    [/_deadMic = true; _userStopped = true; finish\(\);/, 'الحارسُ لا يقطع القراءة'],
    [/lvl:Math\.round\(_lvlPeak\*1000\), lvlN:_lvlN/, 'المستوى لا يُحفَظ في صفِّ الإخفاق — فيعمى التشخيصُ من جديد'],
    [/if\(_deadMic\)\{/,                        'رسالةُ المايكِ الميّتِ لا تسبق بقيّةَ الرسائل']
  ];
  for (const [rx, msg] of need) if (!rx.test(rd)) E(R2, msg);

  /* ومهلةُ الحارسِ معقولة: لا تقطعُ قارئًا يتروّى، ولا تتركه يقرأ دقيقة */
  const mt = /\}, (\d+)\);\s*\}catch\(e\)\{ _lvlStop = null; \}/.exec(rd);
  const wait = mt ? +mt[1] : 0;
  if (!(wait >= 6000 && wait <= 15000))
    E(R2, 'مهلةُ حارسِ الصمت ' + (wait || '؟') + 'ms — والمرادُ بين ستِّ ثوانٍ وخمسَ عشرة');
  return out;
}

/* ══════════════════════════════════════════════════════════════════
   وحدات لغتي — ثالث متوسط: ثلاثُ وحداتٍ في صفحةٍ واحدة
   ──────────────────────────────────────────────────────────────────
   أرسل الأب جدولَ محتوياتِ كتابِ حسنٍ (٢٨ أكتوبر ٢٠٢٦)، وكانت الصفحةُ
   تحمل الوحدةَ الأولى وحدَها. فأُضيفت الثانيةُ والثالثةُ ببنوكِهما،
   واختيارُ الوحدةِ صار صفًّا فوق صفِّ الدروس. وهذا الحارسُ يحرس أربعةً:

   ١) أنّ كلَّ درسٍ يسحب من بنكِ وحدتِه لا من بنكِ وحدةٍ أخرى — فلو
      اختلط لرأى حسنٌ «الحال» في درسِ «التمييز» وظنّ الصفحةَ تكذب.
   ٢) أنّ «علاجي» يتبع الوحدةَ المفتوحة؛ وإلّا التقى «نحو» من وحدةٍ
      بـ«نحو» من أخرى فاختلط ضعفُ التمييزِ بضعفِ الحال.
   ٣) أنّ التحليلَ الأدبيَّ مُخفًى في الوحدتَين اللتَين لم تصل نصوصُهما
      (ص١٤٤ و٢٣٢) — لا معروضًا فارغًا.
   ٤) ألّا يُحَلَّ سؤالٌ بالطول: أن يكون الصوابُ أطولَ من مشتّتَيه طولًا
      يُفرزه به مَن لا يعرف القاعدة. وقعتُ فيها في خمسةٍ وثلاثين سؤالًا
      من مئةٍ واثني عشر، فأُصلحت، وهذا يمنع رجوعَها.
   ══════════════════════════════════════════════════════════════════ */
function lughati9UnitsPath(){
  const out = [];
  const F = 'lughati9.html', p = path.join(ROOT, F);
  if (!fs.existsSync(p)) { out.push({ sev:'خطأ', file:F, msg:'الصفحةُ مفقودة' }); return out; }
  const E = m => out.push({ sev:'خطأ', file:F, msg:m });
  const html = fs.readFileSync(p, 'utf8');

  const ctx = makeCtx();
  const { inline, srcs } = scripts(html);
  for (const s of srcs){
    const q = path.join(ROOT, s);
    if (fs.existsSync(q)) { try { vm.runInContext(fs.readFileSync(q,'utf8'), ctx); } catch(e){} }
  }
  for (const src of inline){ try { vm.runInContext(src, ctx); } catch(e){} }

  /* الدرسُ ← بنكُه، في كلِّ وحدة. الأسماءُ هي أسماءُ البنوكِ في الصفحةِ
     نفسِها (q.__bank يأتي من bankGen)، فلو أُعيد توجيهُ درسٍ إلى بنكٍ
     آخرَ انكشف هنا. */
  const MAP = {
    u1: { imla:'IMLA',  ismf:'ISMF',  qasam:'QASAM', hal:'HAL',    adab:'ADAB' },
    u2: { imla:'IMLA2', ismf:'ISMF2', qasam:'SHART', hal:'TAMYIZ', adab:'ADAB2' },
    u3: { imla:'IMLA3', ismf:'MUB',   qasam:'TAFDIL',hal:'IST',    adab:'ADAB3' }
  };
  /* اسمُ البنكِ في الوسمِ قد يُختصر (MUB عن MUBALAGHA)، فنحتاج اسمَ
     المتغيّرِ أيضًا لنقرأ أسئلتَه. */
  const VAR = { IMLA2:'IMLA2', ISMF2:'ISMF2', SHART:'SHART', TAMYIZ:'TAMYIZ',
                IMLA3:'IMLA3', MUB:'MUBALAGHA', TAFDIL:'TAFDIL', IST:'ISTITHNA',
                ADAB2:'ADAB2', ADAB3:'ADAB3' };
  const MIN = 14;                     /* أقلُّ ما يُقبَل لئلّا يُحفَظ البنك */

  const CFGU = ctx.CFGU, REMU = ctx.REMTOPICS_U, REM1 = ctx.REMTOPICS;
  if (!CFGU || !REMU || !Array.isArray(REM1)) { E('CFGU أو REMTOPICS_U لم تُقرأ'); return out; }
  const units = Object.keys(CFGU);
  if (units.join(',') !== 'u1,u2,u3')
    E('وحداتُ الصفحةِ «' + units.join(' · ') + '» والمتوقَّع ثلاثًا: u1 وu2 وu3');

  /* عنوانُ كلِّ وحدةٍ وصفحاتُها في الكتاب — من جدولِ المحتويات */
  const AR = ctx.UNIT_AR || {}, PG = ctx.UNIT_PG || {};
  const WANT_PG = { u1:'13–105', u2:'111–197', u3:'201–289' };
  ['u1','u2','u3'].forEach(u => {
    if (!AR[u] || !/[؀-ۿ]/.test(String(AR[u]))) E('عنوانُ الوحدةِ ' + u + ' مفقودٌ أو غيرُ عربيّ');
    if (PG[u] !== WANT_PG[u])
      E('صفحاتُ الوحدةِ ' + u + ' «' + (PG[u]||'؟') + '» والكتابُ يقول «' + WANT_PG[u] + '»');
  });

  const key = t => String(t).replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();

  /* ═══ البنوكُ الثمانيةُ الجديدةُ: بنيةٌ سليمةٌ ولا دلالةَ طول ═══ */
  const seen = {};
  ['u2','u3'].forEach(u => {
    Object.keys(MAP[u]).forEach(id => {
      const tag = MAP[u][id];
      if (!tag) return;
      const bk = ctx[VAR[tag]];
      if (!Array.isArray(bk)) { E('بنكُ ' + VAR[tag] + ' (' + u + '/' + id + ') غيرُ موجود'); return; }
      if (bk.length < MIN) E('بنكُ ' + VAR[tag] + ' فيه ' + bk.length + ' سؤالًا — وأقلُّ ما يُقبَل ' + MIN);
      bk.forEach((q, i) => {
        const nm = VAR[tag] + '#' + (i + 1);
        if (!Array.isArray(q) || !Array.isArray(q[1]) || q[1].length !== 3)
          { E(nm + ': الخياراتُ ليست ثلاثة'); return; }
        const o = q[1].map(key);
        if (new Set(o).size !== 3) E(nm + ': خياران متطابقان');
        if (o.some(x => !x)) E(nm + ': خيارٌ فارغ');
        if (key(q[2]).length < 15) E(nm + ': شرحٌ ناقصٌ أو مفقود');
        const k = key(q[0]);
        if (seen[k]) E('سؤالٌ واحدٌ في بنكَين (' + seen[k] + ' و' + VAR[tag] + '): ' + k.slice(0, 45));
        else seen[k] = VAR[tag];
        /* ═══ دلالةُ الطول ═══
           الصوابُ أوّلُ الخيارات قبل الخلط. فإن جاوز أطولَ مشتّتَيه
           بمرّةٍ وثُمانِ مرّةٍ وبخمسةٍ وعشرين حرفًا، فُرز بالطولِ وحده. */
        const L = o.map(x => x.length), mx = Math.max(L[1], L[2]), mn = Math.min(L[1], L[2]);
        if (L[0] > mx * 1.8 && L[0] - mx > 25)
          E(nm + ': الصوابُ ' + L[0] + ' حرفًا وأطولُ مشتّتٍ ' + mx + ' — يُحَلُّ بالطولِ لا بالقاعدة');
        if (mn > L[0] * 1.8 && mn - L[0] > 25)
          E(nm + ': الصوابُ ' + L[0] + ' حرفًا وأقصرُ مشتّتٍ ' + mn + ' — يُحَلُّ بالطولِ لا بالقاعدة');
      });
    });
  });

  /* ═══ كلُّ درسٍ يسحب من بنكِ وحدتِه، وشاملُها من أربعتِها ═══ */
  ['u1','u2','u3'].forEach(u => {
    const C = CFGU[u];
    if (!C) return;
    const ids = Object.keys(C);
    if (ids.join(',') !== 'all,imla,ismf,qasam,hal,adab')
      E('دروسُ الوحدةِ ' + u + ': ' + ids.join(' · ') + ' والمتوقَّع all وimla وismf وqasam وhal وadab');
    Object.keys(MAP[u]).forEach(id => {
      const want = MAP[u][id], c = C[id];
      /* وصلت صورتا ص١٤٤ «الجبل الأشمّ» وص٢٣٢ «ضوء الأمن» (٢٨ أكتوبر)،
         فلكلِّ وحدةٍ تحليلُها الأدبيّ. ويبقى الشرطُ قائمًا لوحدةٍ تُضاف
         غدًا بلا نصّ: إمّا بنكٌ من نصِّها، وإمّا لا تبويب. */
      if (want === null){
        if (c) E('الوحدةُ ' + u + ': درسُ «' + id + '» معروضٌ ونصُّه لم يصل من الكتاب');
        return;
      }
      if (!c) { E('الوحدةُ ' + u + ': درسُ «' + id + '» مفقودٌ من CFGU'); return; }
      const g = c.gens || [];
      if (g.length !== 1 || !g[0] || g[0].__bank !== want)
        E('الوحدةُ ' + u + ': درسُ «' + id + '» يسحب من «' +
          ((g[0] && g[0].__bank) || '؟') + '» والصوابُ «' + want + '»');
      if (!c.label || !/^لغتي م٣ — /.test(String(c.label)))
        E('الوحدةُ ' + u + ': وسمُ «' + id + '» لا يبدأ بـ«لغتي م٣ — » فلا يُفرَز في التقرير: ' + c.label);
      if (!c.n || c.n < 8) E('الوحدةُ ' + u + ': درسُ «' + id + '» عددُ أسئلتِه ' + c.n);
    });
    /* الشاملُ يسحب من بنوكِ وحدتِه الأربعةِ ولا بنكَ يتخلّف */
    const al = (C.all && C.all.gens) || [];
    const got = al.map(g => g && g.__bank).sort().join(',');
    /* وشاملُ الأولى خمسةٌ لأنّ نصَّها الأدبيَّ وصل، وشاملُ الأخرَيَين أربعة */
    const need = ['imla','ismf','qasam','hal','adab']
      .map(id => MAP[u][id]).filter(Boolean).sort().join(',');
    if (got !== need)
      E('شاملُ الوحدةِ ' + u + ' يسحب من «' + got + '» والمنتظَرُ «' + need + '»');
  });

  /* ═══ «علاجي» يتبع الوحدةَ، وكلُّ موضوعٍ له درسٌ ونصيحةٌ وشرحٌ مرئيّ ═══ */
  if (typeof ctx.remTopics !== 'function') E('remTopics() مفقودة — فالعلاجيُّ لا يتبع الوحدة');
  ['u2','u3'].forEach(u => {
    const T = REMU[u];
    if (!Array.isArray(T)) { E('علاجيُّ الوحدةِ ' + u + ' مفقود'); return; }
    const ids = T.map(t => t.id).sort().join(',');
    /* يُشتقُّ من دروسِ الوحدةِ نفسِها: كلُّ درسٍ له بنكٌ يجب أن يُرصَد
       ضعفُه في العلاجيّ، والدرسُ الذي لا بنكَ له لا يُنتظَر فيه شيء. */
    const need = Object.keys(MAP[u]).filter(id => MAP[u][id]).sort().join(',');
    if (ids !== need) E('مواضيعُ علاجيِّ ' + u + ': ' + ids + ' والمنتظَرُ ' + need);
    T.forEach(t => {
      if (!MAP[u][t.id]) E('موضوعٌ في علاجيِّ ' + u + ' بلا درس: ' + t.id);
      if (!t.name || /[A-Za-z]{4,}/.test(String(t.name))) E('اسمُ موضوعِ «' + t.id + '» في ' + u + ' لا يصلح للأب');
      if (!t.tip || String(t.tip).length < 120) E('نصيحةُ «' + t.id + '» في ' + u + ' قصيرةٌ لا تُغني عن مراجعة');
      if (!t.yt) E('موضوعُ «' + t.id + '» في ' + u + ' بلا بحثِ شرحٍ مرئيّ');
    });
  });
  /* ولا يُخلَط اسمُ موضوعٍ بين وحدتَين: «نحو: التمييز» لا «نحو: الحال» */
  const nm1 = {}; REM1.forEach(t => { nm1[t.id] = t.name; });
  ['u2','u3'].forEach(u => (REMU[u]||[]).forEach(t => {
    if (nm1[t.id] && nm1[t.id] === t.name)
      E('موضوعُ «' + t.id + '» في ' + u + ' يحمل اسمَ الوحدةِ الأولى نفسَه «' + t.name + '» — فيختلط الضعفان');
  }));

  /* ═══ وما لا يُقرأ من السياقِ وحدَه: صفُّ الوحداتِ وسلوكُ applyUnit ═══ */
  const need = [
    [/<button data-unit="u1"/, 'صفُّ الوحداتِ مفقودٌ من الصفحة — فلا سبيلَ إلى الثانيةِ والثالثة'],
    [/data-unit="u2"[\s\S]{0,400}data-unit="u3"/, 'الوحدتان الثانيةُ والثالثةُ ليستا في صفِّ الوحدات'],
    [/UNIT_KEY\s*=\s*"lg9_unit_"\s*\+\s*who/, 'الوحدةُ لا تُحفَظ لكلِّ ابنٍ وحدَه'],
    [/localStorage\.setItem\(UNIT_KEY, UNIT\)/, 'الوحدةُ المختارةُ لا تُحفَظ — فترجع الأولى كلَّ مرّة'],
    [/if\(_u && CFGU\[_u\]\) UNIT = _u;/, 'الوحدةُ المحفوظةُ لا تُستعاد (أو تُستعاد بلا تحقّق)'],
    /* مقصورةٌ على applyUnit: السطرُ الأوّلُ «var CFG = CFGU[UNIT];» يحمل
       النصَّ نفسَه، فمرساةٌ مرسلةٌ تُمسِكه وتنجو طفرةُ applyUnit. */
    [/function applyUnit\(\)\{\s*CFG = CFGU\[UNIT\];/, 'applyUnit لا يُحوّل CFG إلى الوحدةِ المختارة'],
    [/ab\.style\.display = CFG\.adab \? "" : "none";/, 'تبويبُ الأدبيِّ لا يُخفى في وحدةٍ بلا نصّ'],
    [/function remTopics\(\)\{ return \(UNIT === "u1"\) \? REMTOPICS : \(REMTOPICS_U\[UNIT\] \|\| \[\]\); \}/,
       'remTopics لا تُفرّق بين الوحدات كما كُتبت'],
    [/renderRem[\s\S]{0,600}remTopics\(\)/, 'renderRem لا يقرأ remTopics() — فالعلاجيُّ يبقى على الوحدةِ الأولى'],
    [/querySelectorAll\("\.tabs button\[data-tab\]"\)/,
       'مستمعُ التبويباتِ غيرُ مقصورٍ على [data-tab] — فزرُّ الوحدةِ يُحسَب درسًا'],
    [/\.tabs \[data-tab\]\[aria-selected="true"\]/,
       'أوّلُ رسمٍ يقرأ aria-selected بلا [data-tab] — فيقع على زرِّ الوحدة']
  ];
  for (const [rx, msg] of need) if (!rx.test(html)) E(msg);

  return out;
}
module.exports = run;
if (require.main === module){
  const r = run();
  console.log('صفحات: ' + r.fileCount + ' · حُمّلت: ' + r.pageCount + ' · مولّدات: ' + r.genCount);
  r.issues.forEach(i => console.log('  ' + (i.sev === 'خطأ' ? '❌' : '⚠️ ') + ' ' + i.file + ' — ' + i.msg));
  if (!r.issues.length) console.log('  ✅ لا ملاحظات');
}
