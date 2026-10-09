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
const ROOT = path.join(__dirname, '..');

const LOW_CAPACITY = 12;      /* أقلّ من هذا يُعدّ قابلًا للحفظ */
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
const PREVIEW_PAGES = ['chem10.html', 'bio10.html', 'phys10.html'];

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
  issues.push(...fatriPath());
  issues.push(...clickExclusion());
  issues.push(...paceCurriculum());
  issues.push(...ytPath());
  issues.push(...engVideoPath());
  issues.push(...bookStudyPath());
  issues.push(...fatriEn5Path());
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
/* ═══ الاختبار الفتري 📝 ═══════════════════════════════════════════
   طلبُ الأب (٦ أكتوبر ٢٠٢٦) لاختبار حسنٍ يومَ الأحد: خمسةَ عشرَ سؤالًا،
   الدرجةُ من عشرين، سؤالٌ واحدٌ مقاليّ، واسمُه «الفتري». ومقرَّرُه
   بصورةِ الفهرس: الفصلان الأوّلُ والثاني كاملَين، ومن الثالثِ الدرسُ
   ٣-١ وحدَه.

   وثلاثةُ أرقامٍ لا تُترك للصدفة: عددُ الأسئلة، ومجموعُ الدرجات،
   ونطاقُ الدروس — فزيادةُ درسٍ من الثالثِ تُدخله في اختبارٍ لا يدخله. */
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
  const PAGES = ['math9.html', 'english9.html'];
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
    const kids = on[1].split(',').map(s => s.split(':')[0].trim().replace(/['"]/g, '')).filter(Boolean);
    const extra = kids.filter(k => k !== 'hasan');
    if (extra.length)
      E(f, 'زِيد في الحارسِ من لم يُقَس عليه: ' + extra.join('، ') +
           ' — والأبُ قال في ٧ أكتوبر «شِلّ الخاصّية منهم كلّهم ما عدا فهد»، وفهدٌ محكومٌ في practice.html');
    if (!kids.includes('hasan'))
      E(f, 'حسنٌ خارجَ الحارسِ وقد طلبه الأبُ في ٩ أكتوبر لمادّتَي الرياضيات والإنجليزي');
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
    if (!/PACE\.box\(/.test(gs))
      out.push({ sev:'تنبيه', file:g, msg:'لا تنبيهَ على الشاشة — الطفلُ لا يعرف أنّ جولتَه سقطت' });
    /* والعدُّ على الأسئلةِ لا على الدرجات: لو قُسِم الزمنُ على الدرجاتِ
       في صفحةٍ درجتُها ضعفُ سؤالِها (كما math4) تضاعفت العتبةُ ضمنًا. */
    if (/FATRI_MARK/.test(gs) && /PACE\.stamp\([^)]*FATRI_TOTAL/.test(gs))
      E(g, 'الزمنُ يُقسَم على الدرجاتِ لا على الأسئلة — فالعتبةُ تتضاعف بلا قصد');
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
function fatriEn5Path(){
  const out = [];
  const f = 'fatri-en5.js', page = 'english5.html';
  const fp = path.join(ROOT, f), pp = path.join(ROOT, page);
  if (!fs.existsSync(fp)){ out.push({ sev:'خطأ', file:f, msg:'ملفُّ الفتري مفقود' }); return out; }
  const src = fs.readFileSync(fp, 'utf8');
  const E  = m => out.push({ sev:'خطأ', file:f, msg:m });
  const EP = m => out.push({ sev:'خطأ', file:page, msg:m });

  /* الورقةُ كما وصلت — الاسمُ والدرجةُ وعددُ البنود */
  const WANT = [
    ['gq', 'General questions',      4],
    ['cw', 'Controlled Writing',     1],
    ['rs', 'Reading short sentence', 4],
    ['gr', 'Grammar',                4],
    ['vo', 'Vocabulary',             5],
    ['or', 'Orthography',            2]
  ];
  const m = /var SECTS = \[([\s\S]*?)\n  \];/.exec(src);
  if (!m) E('جدولُ الأقسامِ (SECTS) لا يُقرأ');
  else {
    const rows = [...m[1].matchAll(/\["(\w+)",\s*"([^"]+)",\s*(\d+)\]/g)]
      .map(g => [g[1], g[2], +g[3]]);
    if (rows.length !== WANT.length)
      E('أقسامُ الفتري ' + rows.length + ' والنموذجُ ' + WANT.length);
    WANT.forEach((w, i) => {
      const r = rows[i];
      if (!r) return;
      if (r[0] !== w[0] || r[1] !== w[1])
        E('القسم ' + (i+1) + ' «' + r[1] + '» والنموذجُ «' + w[1] + '»');
      else if (r[2] !== w[2])
        E('درجةُ «' + w[1] + '» ' + r[2] + ' والنموذجُ ' + w[2]);
    });
    const sum = rows.reduce((a, r) => a + r[2], 0);
    if (sum !== 20) E('مجموعُ درجاتِ الأقسامِ ' + sum + ' والورقةُ من ٢٠');
    /* كلُّ قسمٍ يُولَّد بعددِ درجتِه — وإلّا اختلّ الوزنُ بلا أثرٍ ظاهر */
    rows.forEach(r => {
      const pat = r[0] === 'cw' ? /pick\(REORDER, 1\)/
                : r[0] === 'gq' ? /pick\(QA, 4\)/
                : r[0] === 'or' ? /pick\(SPELL, 2\)/
                : null;
      if (pat && !pat.test(src))
        E('قسم «' + r[1] + '» لا يُولّد ' + r[2] + ' بندًا كما في النموذج');
    });
    if (!/gen\(\[[^\]]*\],\s*2,\s*"rs"/.test(src)) E('قسمُ القراءةِ لا يُولّد بندَي الاختيار');
    if (!/gen\(\[[^\]]*\],\s*4,\s*"gr"/.test(src)) E('قسمُ القواعدِ لا يُولّد أربعةَ بنود');
    if (!/gen\(\[[^\]]*\],\s*5,\s*"vo"/.test(src)) E('قسمُ المفرداتِ لا يُولّد خمسةَ بنود');
    if (!/TICK, 2/.test(src)) E('قسمُ القراءةِ لا يُولّد بندَي ✓/✗');
  }
  if (!/var TOTAL = 20;/.test(src)) E('الدرجةُ ليست من ٢٠');
  if (src.indexOf('saveScore("إنجليزي خ٥ — الفتري 📝", correct, TOTAL') < 0)
    E('الدرجةُ لا تُحفَظ من ٢٠ باسمِ الاختبارِ الصحيح');
  /* نصُّ السؤالِ الإنجليزيُّ يُعزَل، وإلّا رُسمت النقطتان في الطرفِ الخطأ */
  if (!/function stemLtr\(/.test(src) || !/stemLtr\(q\.stem\)/.test(src))
    E('نصُّ السؤالِ غيرُ معزولٍ يساريًّا — تُرسم «:Complete» بدل «Complete:»');

  if (!fs.existsSync(pp)) return out;
  const psrc = fs.readFileSync(pp, 'utf8');
  if (psrc.indexOf('src="fatri-en5.js') < 0) EP('لا تُحمّل fatri-en5.js');
  if (!/data-tab="fatri"/.test(psrc))        EP('لا تبويبَ للفتري');
  if (!/id="fatri"/.test(psrc))              EP('لا لوحةَ للفتري');
  if (!/FATRI_EN5\.render\(/.test(psrc))     EP('لوحةُ الفتري لا تُرسَم');
  if (!/data-tab="fatri" aria-selected="true"/.test(psrc))
    EP('الفتري ليس التبويبَ المفتوحَ أوّلًا');
  if (!/function stemLtr\(/.test(psrc) || !/stemLtr\(q\[0\]\)/.test(psrc))
    EP('نصُّ سؤالِ الوحداتِ غيرُ معزولٍ يساريًّا — تُرسم «:Complete» بدل «Complete:»');
  return out;
}

function bookStudyPath(){
  const out = [];
  const SPEC = [
    { book:'book-en4.js', global:'BOOK_EN4', tag:'en4', page:'english.html' },
    { book:'book-en9.js', global:'BOOK_EN9', tag:'en9', page:'english9.html' }
  ];
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
    const isSent = e => /[.?!]$/.test(e) && String(e).trim().split(/\s+/).length >= 3;
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

function fatriPath(){
  /* صفحتان الآن: حسنٌ (ثالث متوسط) ورفيف (ثاني متوسط) — ولكلٍّ مقرَّرُه
     وعددُ أسئلتِه، والمجموعُ عشرون في كلتيهما. */
  const SPEC = {
    /* ضُيِّق إلى الفصلَين الأوّلِ والثاني بصورةِ الفهرسِ (٨ أكتوبر):
       لا يدخله شيءٌ من الفصلِ الثالثِ ألبتّة، ولا مقاليٌّ مبنيٌّ عليه. */
    /* ورُفع مقاليُّه (٨ أكتوبر) فصارت عشرين سؤالًا: سؤالان لكلّ درسٍ
       إلّا الافتتاحيَّين (١-١ و٢-١) فسؤالٌ لكلٍّ. */
    'math9.html': { ids:['h1','h2','h3','h4','h5','r1','r2','r3','r4','r5','r6'], mcq:20, essay:0,
                    countMap:{h1:1,h2:2,h3:2,h4:2,h5:2,r1:1,r2:2,r3:2,r4:2,r5:2,r6:2},
                    label:'رياضيات م٣ — الفتري 📝', ban:/"t\d"|"v\d"|"s\d"/, banMsg:'درسٌ من الفصلِ الثالثِ فما بعدَه — خارجُ المقرَّر',
                    /* أنماطُ أوراقِ معلّمِه — أضافها الأبُ (٨ أكتوبر) بصورِ الأوراق */
                    teacherGens:{ H5:['gAbsFromNumLine','gAbsNumLinePick'],
                                  R2:['gFuncTableYN','gMapDiagram','gFuncGraphYN'],
                                  R3:['gGraphToEquation','gXInterceptSI','gStandardFromPS'],
                                  R5:['gRateTable4','gSlopeUnknownZero','gDistTimeGraph'] } },
    /* ورُفع مقاليُّها (٨ أكتوبر): عشرون سؤالًا — سؤالٌ لكلّ درسٍ
       وزيادةٌ على أربعةٍ يُبنى عليها ما بعدَها. */
    'math8.html': { ids:['n1','n2','n3','n4','n5','n6','n7','n8','n9','r1','r2','r3','r4','r5','r6','r7'], mcq:20, essay:0,
                    countMap:{n1:1,n2:1,n3:1,n4:2,n5:1,n6:2,n7:1,n8:1,n9:1,r1:2,r2:1,r3:1,r4:1,r5:2,r6:1,r7:1},
                    label:'رياضيات م٢ — الفتري 📝', ban:/"t\d"|"v\d"|"s\d"/, banMsg:'درسٌ من الفصلِ الثالثِ فما بعدَه — خارجُ المقرَّر' },
    /* أسامةُ فصولٌ لا دروس: خمسةُ فصولٍ × ثلاثةِ أسئلةٍ + مقاليٌّ بخمس.
       والشطبُ في صورةِ الأبِ أخرج «العبارات والمعادلات» (f5)، ولم يُذكر
       «الكسور الاعتياديّة» (f6) فبقي خارجًا. */
    /* أسامةُ بلا مقاليّ — طلبُ الأب (٧ أكتوبر): «شِلّ السؤال المقالي».
       والدرجةُ تبقى عشرين، فأربعةٌ لكلّ فصلٍ بدل ثلاثة. */
    /* ═══ حُصِر في الجمعِ والطرحِ وحدَه (٨ أكتوبر): عشرةُ أسئلةٍ بدرجتين
       لكلٍّ — فأوّلُ اختبارٍ هنا تختلف درجتُه عن عددِ أسئلتِه. ═══ */
    'math5.html': { ids:['f2'], mcq:10, mark:2, essay:0, per:10, noLessonTag:true, distinctTypes:true,
                    label:'رياضيات خ٥ — الفتري 📝', ban:/"pv"|"f1"|"f3"|"f4"|"f5"|"f6"|"all"/, banMsg:'فصلٌ خارجَ مقرَّرِ أسامة (المقرَّرُ الجمعُ والطرحُ وحدَه)' },
    /* سعودٌ ستّةُ فصولٍ بتوزيعٍ غيرِ متساوٍ (٣ ٣ ٢ ٣ ٣ ٢ = ١٦)، لأنّ
       بنكَي «البيانات» و«الضربِ في رقمين» أصغرُ من غيرِهما. */
    /* حدّد الأبُ مقرَّرَ سعود (٧ أكتوبر): القيمةُ المنزليّةُ والجمعُ
       والطرحُ والبيانات — ثلاثةٌ لا ستّة. والتوزيعُ يتبع بنكَ كلٍّ:
       الأوّلان خمسةُ مولّداتٍ لكلٍّ فيُستوفيان، والثالثُ اثنا عشر. */
    'math4.html': { ids:['f2'], mcq:10, mark:2, essay:0, perMap:{f2:10}, noLessonTag:true, distinctTypes:true,
                    label:'رياضيات خ٤ — الفتري 📝', ban:/"f1"|"f3"|"f4"|"f5"|"f6"|"fw"|"all"/, banMsg:'فصلٌ خارجَ مقرَّرِ سعود (المقرَّرُ الجمعُ والطرحُ وحدَه)' }
  };
  const out = [];
  for (const f of Object.keys(SPEC)) out.push(...fatriOne(f, SPEC[f]));
  return out;
}
function fatriOne(f, SP){
  const out = [];
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) return out;
  const src = fs.readFileSync(p, 'utf8');
  const E = m => out.push({ sev:'خطأ', file:f, msg:m });
  const m = /var FATRI_IDS = \[([^\]]*)\];/.exec(src);
  if (!m){ E('قائمةُ دروسِ الفتري مفقودة'); return out; }
  const ids = m[1].split(',').map(x => x.trim().replace(/"/g,'')).filter(Boolean);
  if (SP.countMap){
    /* قائمةٌ فيها الدرسُ مكرّرًا بعددِ أسئلتِه — نعدّ التكرارَ ونقارنه */
    const cnt = {};
    ids.forEach(x => { cnt[x] = (cnt[x]||0) + 1; });
    const mism = [];
    Object.keys(SP.countMap).forEach(k => {
      if ((cnt[k]||0) !== SP.countMap[k]) mism.push(k + '=' + (cnt[k]||0) + ' والمطلوبُ ' + SP.countMap[k]);
    });
    if (mism.length) E('توزيعُ الأسئلةِ على الدروسِ تغيّر: ' + mism.join('، '));
    if (ids.length !== SP.mcq) E('أسئلةُ الفتري ' + ids.length + ' والمطلوبُ ' + SP.mcq);
  } else if (SP.perMap){
    /* توزيعٌ غيرُ متساوٍ: نقرؤه من الكودِ ونجمعه */
    const pm = /var FATRI_PER = \{([^}]*)\};/.exec(src);
    if (!pm) E('توزيعُ أسئلةِ الفصولِ (FATRI_PER) مفقود');
    else {
      let sum = 0, mism = [];
      Object.keys(SP.perMap).forEach(k => {
        const g = new RegExp(k + '\\s*:\\s*(\\d+)').exec(pm[1]);
        const v = g ? +g[1] : 0; sum += v;
        if (v !== SP.perMap[k]) mism.push(k + '=' + v + ' والمطلوبُ ' + SP.perMap[k]);
      });
      if (mism.length) E('توزيعُ الأسئلةِ على الفصولِ تغيّر: ' + mism.join('، '));
      if (sum !== SP.mcq) E('مجموعُ أسئلةِ الفصولِ ' + sum + ' والمطلوبُ ' + SP.mcq);
      /* ═══ والعددُ المعلَن يطابق المجموع ══════════════════════════════
         ‏FATRI_MCQ مكتوبٌ بيدٍ في هذه الصفحة، لا محسوبًا من الطول.
         فلو خالف مجموعَ التوزيعِ لعُرضت عشرون سؤالًا والدرجةُ من ستّ
         عشرة — ولا يُخطئ شيءٌ ظاهر. */
      const dm = /var FATRI_MCQ = (\d+);/.exec(src);
      if (dm && +dm[1] !== sum)
        E('العددُ المعلَن ' + dm[1] + ' يخالف مجموعَ التوزيع ' + sum + ' — تُعرَض أسئلةٌ والدرجةُ من غيرِ عددِها');
    }
  } else {
    const per = SP.per || 1;
    if (per > 1 && !new RegExp('var FATRI_PER = ' + per + ';').test(src))
      E('عددُ أسئلةِ الفصلِ الواحدِ ليس ' + per);
    if (ids.length * per !== SP.mcq)
      E('أسئلةُ الفتري ' + (ids.length*per) + ' والمطلوبُ ' + SP.mcq);
  }
  const want = SP.ids;
  const extra = ids.filter(x => want.indexOf(x) < 0);
  if (extra.length) E('دروسٌ خارجَ مقرَّر الفتري: ' + [...new Set(extra)].join('، '));
  const missing = want.filter(x => ids.indexOf(x) < 0);
  if (missing.length) E('دروسٌ من المقرَّرِ غائبةٌ عن الفتري: ' + missing.join('، '));
  if (SP.ban.test(m[1])) E('دخل الفتريَّ ' + SP.banMsg);
  /* ═══ نصُّ المقرَّرِ المعروضُ يطابق القائمةَ ══════════════════════
     ضُيِّق مقرَّرُ حسنٍ فبقي في المقدّمةِ سطرٌ يقول «ومن الفصل الثالث
     الدرس ٣-١» وهو قد خرج — فيقرأ الطالبُ شيئًا ويُختبَر في غيرِه.
     فالنصُّ لا يذكر فصلًا ليس في القائمة. */
  if (SP.ban.test('"t1"') && /المقرَّر:[\s\S]{0,400}الفصل الثالث: <b>/.test(src))
    E('مقدّمةُ الفتري تُعلن درسًا من الفصلِ الثالثِ وهو خارجُ القائمة');
  /* ═══ كلُّ عددٍ يُعرَض للطالبِ يطابق عددَ أسئلتِه ══════════════════
     وقع مرّتين في يومٍ واحد (٨ أكتوبر): سطرُ «الوحدة» فوق اللوحة بقي
     يقول «١٥ سؤالًا ومن الفصل الثالث» في صفحةِ حسن و«١٧ سؤالًا» في
     صفحةِ رفيف، بعد أن صارت الأسئلةُ عشرين في كلتيهما — ومقدّمةُ اللوحةِ
     تحته تقول الصواب. فيقرأ الطالبُ رقمين متناقضَين في شاشةٍ واحدة، ولا
     يُخطئ شيءٌ ظاهر ولا تنقص درجةٌ، فلا يُكشف إلّا بعينٍ تقرأ الشاشة.
     وهذا الحارسُ يقرؤها: كلُّ «ن سؤالًا» في موضعٍ معروضٍ عن الفتري يجب
     أن يساوي عددَ أسئلتِه. */
  const arN = n => String(n).split('').map(d => '٠١٢٣٤٥٦٧٨٩'[+d]).join('');
  const um = /fatri:\s*\{[\s\S]{0,1200}?unit:\s*'([^']*)'/.exec(src);
  const im = /function renderFatri\(\)\{[\s\S]{0,4000}?sec\.innerHTML/.exec(src);
  const shown = [];
  if (um) shown.push(['سطرِ الوحدةِ فوق لوحةِ الفتري', um[1]]);
  if (im) shown.push(['مقدّمةِ لوحةِ الفتري', im[0]]);
  for (const [where, text] of shown)
    for (const g of String(text).matchAll(/([٠-٩]+)\s*(?:سؤالًا|أسئلة)/g))
      if (g[1] !== arN(SP.mcq))
        E('العددُ المعروضُ في ' + where + ' «' + g[0].trim() + '» والأسئلةُ ' + arN(SP.mcq) +
          ' — رقمان متناقضان في شاشةٍ واحدة');
  if (SP.ban.test('"t1"') && um && /الفصل الثالث|من الثالث/.test(um[1]))
    E('سطرُ الوحدةِ فوق اللوحةِ يُعلن درسًا من الفصلِ الثالثِ وهو خارجُ القائمة');

  /* ═══ أنماطُ ورقةِ المعلّمِ تبقى في بنوكِ دروسِ الفتري ════════════════
     أرسل الأبُ (٨ أكتوبر) صورَ أوراقٍ وزّعها معلّمُ حسنٍ على صفّه وقال
     «حطّ أسئلة مشابهة لها في الفتري». والأنماطُ مربوطةٌ ببنوكِ الدروسِ لا
     بالفتريِّ مباشرةً — فحذفُ اسمٍ من مصفوفةِ بنكٍ يُخرجه من الاختبارِ
     بلا أثرٍ ظاهر: الاختبارُ يبقى عشرين سؤالًا وتبقى الدرجةُ عشرين. */
  if (SP.teacherGens){
    const banks = {};
    for (const bm of src.matchAll(/^var ([A-Z]+\d*) = \[(.+)\];/gm))
      banks[bm[1]] = bm[2].split(',').map(x => x.trim());
    for (const bank of Object.keys(SP.teacherGens))
      for (const g of SP.teacherGens[bank])
        if ((banks[bank] || []).indexOf(g) < 0)
          E('نمطُ ورقةِ المعلّمِ ' + g + ' ليس في بنكِ ' + bank + ' — خرج من الفتري بلا أثرٍ ظاهر');
  }

  /* المجموعُ عشرون في الصفحتين */
  if (!new RegExp('var FATRI_ESSAY = ' + SP.essay + ';').test(src))
    E('درجةُ المقاليِّ ليست ' + SP.essay);
  const MARK = SP.mark || 1;
  if (SP.mcq * MARK + SP.essay !== 20) E('مجموعُ الدرجاتِ ليس عشرين');
  /* ═══ الدرجةُ تُحسب بدرجةِ السؤالِ لا بعددِ الأسئلة ══════════════════
     صار سؤالُ سعودٍ وأسامةَ بدرجتين (٨ أكتوبر)، فلو حُسب المجموعُ من
     العددِ وحدَه ظهرت «٠ / ١٠» على الشاشةِ وحُفظت الدرجةُ من عشرٍ —
     ويرى الأبُ في تقريرِه نصفَ ما اتّفق عليه ولا يُخطئ شيءٌ ظاهر. */
  if (SP.essay > 0){
    if (!/var FATRI_TOTAL = FATRI_MCQ \+ FATRI_ESSAY;/.test(src)) E('مجموعُ الدرجاتِ لا يُحسب من جزأيه');
  } else if (MARK > 1){
    if (!new RegExp('var FATRI_MARK = ' + MARK + ';').test(src))
      E('درجةُ السؤالِ ليست ' + MARK);
    if (!/var FATRI_TOTAL = FATRI_MCQ \* FATRI_MARK;/.test(src))
      E('مجموعُ الدرجاتِ لا يُضرب في درجةِ السؤال — فتُعرَض الدرجةُ من عددِ الأسئلةِ لا من عشرين');
    if (!/function marks\(\)\{ return correct \* FATRI_MARK; \}/.test(src))
      E('الدرجةُ المحسوبةُ ما زالت عددَ الصحيحِ لا مضروبًا في درجةِ السؤال');
  } else {
    if (!/var FATRI_TOTAL = FATRI_MCQ;/.test(src)) E('مجموعُ الدرجاتِ ليس عددَ الأسئلةِ في اختبارٍ بلا مقاليّ');
  }

  /* ═══ نوعٌ مختلفٌ لكلِّ سؤالٍ في الفتري ══════════════════════════════
     رأى الأبُ (٨ أكتوبر) النوعَ يتكرّر في فتريِّ سعودٍ وأسامةَ — والبنكُ
     خمسةُ أنواعٍ والأسئلةُ عشرة — فقال: «وسّع البنك». فوُسِّع إلى سبعةَ
     عشرَ نوعًا، وصار الفتري يأخذ سؤالًا من كلّ مولّدٍ على حدة
     (genDistinct) لا عشوائيًّا (genN).

     وهما شرطان لا واحد: لو رجع السحبُ عشوائيًّا تكرّر النوعُ وإن كبُر
     البنك، ولو صغُر البنكُ عن عددِ الأسئلةِ تكرّر وإن كان السحبُ متمايزًا.
     والعطبُ في الحالتين صامت: الاختبارُ عشرةُ أسئلةٍ والدرجةُ عشرون. */
  if (SP.distinctTypes){
    if (!/function genDistinct\(/.test(src))
      E('دالّةُ «نوعٌ لكلّ سؤال» (genDistinct) مفقودة');
    const rfd = /function renderFatri\(\)\{[\s\S]*?\n  \}\n/.exec(src);
    if (rfd && !/genDistinct\(CFG\[id\]\.gens/.test(rfd[0]))
      E('الفتري يسحب أسئلتَه عشوائيًّا فيتكرّر النوعُ في الجولةِ الواحدة');
    for (const id of SP.ids){
      const nm = id.toUpperCase();
      const bm = new RegExp('var ' + nm + ' = \\[([\\s\\S]*?)\\];').exec(src);
      if (!bm){ E('تعذّرت قراءةُ بنكِ ' + nm); continue; }
      const cnt = bm[1].split(',').map(x => x.trim()).filter(x => /^g[A-Za-z0-9_]+$/.test(x)).length;
      if (cnt < SP.mcq)
        E('بنكُ ' + nm + ' فيه ' + cnt + ' نوعًا والأسئلةُ ' + SP.mcq +
          ' — فلا بدّ أن يتكرّر النوعُ في الجولةِ الواحدة');
    }
  }

  /* ═══ اسمُ الدرسِ لا يُطبَع فوقَ السؤال، ويبقى في الحفظ ═════════════
     طلبُ الأب (٨ أكتوبر): «ولا تكتب اسم الدرس في الاختبار» — فطباعتُه
     فوقَ السؤالِ تدلُّ الطفلَ على الطريقةِ قبل أن يفكّر. ويبقى الوسمُ
     في الميتا (__lesson) لأنّ تفصيلَ الفصولِ في تقريرِ الأبِ مبنيٌّ عليه،
     فرفعُه من العرضِ لا يعني رفعَه من الحفظ. */
  if (SP.noLessonTag){
    const rf = /function renderFatri\(\)\{[\s\S]*?\n  \}\n/.exec(src);
    const body = rf ? rf[0] : '';
    if (!body) E('تعذّرت قراءةُ لوحةِ الفتري للتحقّقِ من اسمِ الدرس');
    else {
      if (/class="num"[\s\S]{0,240}?__lesson/.test(body))
        E('اسمُ الدرسِ مطبوعٌ فوقَ السؤالِ في الفتري — وقد طلب الأبُ رفعَه');
      if (/<b>المقرَّر:<\/b>[\s\S]{0,160}?FATRI_AR/.test(body))
        E('اسمُ الدرسِ مكتوبٌ في سطرِ المقرَّرِ بمقدّمةِ الفتري — وقد طلب الأبُ رفعَه');
      if (!/__lesson \|\| "غير محدّد"/.test(body))
        E('وسمُ الفصلِ (__lesson) سقط من حفظِ الفتري — فيفقد تقريرُ الأبِ تفصيلَ الفصول');
    }
  }
  if (!/FATRI_TOTAL\b/.test(src) || src.indexOf('saveScore("' + SP.label + '", marks(), FATRI_TOTAL') < 0)
    E('الدرجةُ لا تُحفَظ من عشرين باسمِ الاختبارِ الصحيح');
  /* ═══ فحوصُ المقاليِّ تُطبَّق على من له مقاليٌّ وحدَه ══════════════
     أسامةُ رُفع مقاليُّه بطلبِ أبيه، فمطالبتُه بحفظِ نصٍّ لا وجودَ له
     خطأٌ في الحارسِ لا في الصفحة. وبالمقابل: من أُلغي مقاليُّه يجب
     ألّا تبقى في صفحتِه بقايا منه — فنتحقّق من ذهابِها. */
  if (SP.essay > 0){
    if (!/essayText\.length < 10/.test(src))
      E('الحلُّ النموذجيُّ يظهر قبل أن يكتب — فينقله');
    if (!/essay: essayText\.slice/.test(src) || !/essaySelf: essayMark/.test(src))
      E('نصُّ المقاليِّ أو درجتُه الذاتيّةُ لا تُحفَظ — فلا يراجعها الأب');
  } else {
    if (/data-essay|fatriEssay|essayMark/.test(src))
      E('بقايا السؤالِ المقاليِّ في صفحةٍ أُلغي منها — إمّا يظهر ناقصًا أو يرمي');
    if (!/var FATRI_ESSAY = 0;/.test(src))
      E('المقاليُّ مرفوعٌ من العرضِ ودرجتُه ما زالت تُحسب');
  }
  /* ويُعرَضان في التقريرَين */
  for (const rf of ['home.html', 'child.html']){
    const rp = path.join(ROOT, rf);
    if (!fs.existsSync(rp)) continue;
    if (!/meta\.essay &&/.test(fs.readFileSync(rp, 'utf8')))
      out.push({ sev:'خطأ', file:rf, msg:'نصُّ المقاليِّ يُحفَظ ولا يُعرَض — فالدرجةُ الذاتيّةُ بلا مراجعة' });
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

module.exports = run;
if (require.main === module){
  const r = run();
  console.log('صفحات: ' + r.fileCount + ' · حُمّلت: ' + r.pageCount + ' · مولّدات: ' + r.genCount);
  r.issues.forEach(i => console.log('  ' + (i.sev === 'خطأ' ? '❌' : '⚠️ ') + ' ' + i.file + ' — ' + i.msg));
  if (!r.issues.length) console.log('  ✅ لا ملاحظات');
}
