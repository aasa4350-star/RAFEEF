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
const fs = require('fs'), path = require('path'), vm = require('vm');
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
  Object.assign(ctx.window, ctx);
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

function run(){
  const issues = [];
  const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.html')).sort();
  let genCount = 0, pageCount = 0;

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

    /* ٢) تحميل الصفحة في بيئةٍ معزولة ثمّ فحص مولّداتها */
    const ctx = makeCtx();
    for (const s of srcs){
      const p = path.join(ROOT, s);
      if (fs.existsSync(p)) { try { vm.runInContext(fs.readFileSync(p,'utf8'), ctx); } catch(e){} }
    }
    for (const src of inline){ try { vm.runInContext(src, ctx); } catch(e){} }
    /* أخطاء التشغيل هنا متوقّعة (لا DOM حقيقيّ) — يعنينا الصياغة والمولّدات */
    pageCount++;

    /* أسماء المولّدات: كلّ ما جُمع في مصفوفات الاختبار داخل الصفحة */
    let names = [];
    for (const arr of ['ALLU','ALLU2','ALLU3','SKILLS','GENS','ALL']){
      try {
        const v = vm.runInContext(arr, ctx);
        if (Array.isArray(v)) names = names.concat(v.filter(x => typeof x === 'function').map(x => x.name));
      } catch(e){}
    }
    /* وإلّا فكلّ دالّةٍ اسمها على نمط مولّد */
    if (!names.length){
      const decl = [...inline.join('\n').matchAll(/\bfunction\s+((?:g|u\d|ex|m|e)[A-Z0-9]\w*)\s*\(/g)].map(m => m[1]);
      names = decl;
    }
    names = [...new Set(names)].filter(Boolean);

    for (const n of names){
      let fn; try { fn = vm.runInContext(n, ctx); } catch(e){ continue; }
      if (typeof fn !== 'function') continue;
      genCount++;

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
        if (firstBad) break;
        seen.add(strip(q[0]) + '‖' + opts.map(optKey).join('¦'));
      }

      if (firstBad) issues.push({ sev:'خطأ', file:f, msg:n + ' — ' + firstBad });
      else if (!ran)  issues.push({ sev:'خطأ', file:f, msg:n + ' — لا يعمل: يرمي في كلّ محاولة' });
      else if (seen.size <= LOW_CAPACITY)
        issues.push({ sev:'تنبيه', file:f, msg:n + ' — سعةٌ منخفضة: ' + seen.size + ' سؤالًا مختلفًا فقط' });
    }
  }

  return { issues, pageCount, genCount, fileCount: files.length };
}

module.exports = run;
if (require.main === module){
  const r = run();
  console.log('صفحات: ' + r.fileCount + ' · حُمّلت: ' + r.pageCount + ' · مولّدات: ' + r.genCount);
  r.issues.forEach(i => console.log('  ' + (i.sev === 'خطأ' ? '❌' : '⚠️ ') + ' ' + i.file + ' — ' + i.msg));
  if (!r.issues.length) console.log('  ✅ لا ملاحظات');
}
