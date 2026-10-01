/* ══════════════════════════════════════════════════════════════════
   typed.js — سؤالٌ يُكتب جوابُه بدل الاختيار من متعدّد
   ══════════════════════════════════════════════════════════════════
   طلب الأب (١ أكتوبر ٢٠٢٦): «الرياضيات والإنجليزي حقّ المنهج — ودّي
   تحطّ سؤالًا يُكتب الجواب، يعني ما تصير اختياريةً كلّها».

   وهو طلبٌ في محلّه: الاختيار من ثلاثةٍ يُنجي بالتخمين ثلثَ المرّات،
   ويُخفي الفرق بين من يعرف ومن يستبعد. والكتابةُ تكشفه.

   وخطرُها أن يُخطَّأ الصواب لفرق مسافةٍ أو صيغة — وذلك أسوأ من
   الاختيار كلِّه. فالعلاج هنا شقّان:
     ١) لا يُحوّل إلى الكتابة إلّا سؤالٌ جوابُه قاطعٌ قصير: عددٌ أو
        كسرٌ في الرياضيات، وكلمةٌ أو كلمتان في الإنجليزي. وما عداهما
        يبقى اختيارًا.
     ٢) والمقارنةُ بعد تطبيعٍ واسع: الأرقام الهندية كاللاتينية،
        وإشارةُ السالب بأشكالها، و«س =» تُحذف، والكسرُ يُقارن بالقيمة
        لا بالنصّ (6/8 = 3/4)، والإنجليزيّة بلا حالة أحرفٍ ولا نقطةٍ
        ولا مسافاتٍ زائدة.
   ومن أخطأ رأى جوابَه وجوابَ المسألة والشرحَ — كما في الاختيار سواء.

   والعددُ قليلٌ قصدًا (سؤالان في الجولة): المرادُ أن يُجرّب الكتابة
   لا أن يُرهَق بها، وبقيّةُ الأسئلة تبقى اختيارًا.
   ══════════════════════════════════════════════════════════════════ */
(function(g){
  var AR_DIGITS = { "٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9",
                    "۰":"0","۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9" };

  /* ═══ الكسرُ المرسومُ طبقتين يفقد شرطتَه بتجريد الوسوم ═══════════
     mn() ترسم «−3/16» عناصرَ متداخلة، فتجريدُ الوسوم يُخرج «−316» —
     فيُحسب عددًا صحيحًا، ويُطلب من الطفل أن يكتب «316»! أمسكها القياسُ
     في المتصفّح قبل النشر: ظهر «الجواب الصحيح: 725» وهو ٧/٢٥.
     فنُعيد الشرطةَ من موضع المقام قبل التجريد. */
  function stripTags(s){
    return String(s == null ? "" : s)
      .replace(/<span class="frd">/g, '/<span class="frd">')
      .replace(/<[^>]*>/g, "");
  }

  /* تطبيعُ جوابٍ رياضيّ: أرقامٌ لاتينية، سالبٌ واحد، بلا مسافاتٍ ولا
     «س =»، والفاصلةُ العربية نقطة. */
  function normMath(s){
    var t = stripTags(s).replace(/[٠-٩۰-۹]/g, function(d){ return AR_DIGITS[d] || d; });
    t = t.replace(/[−‒–—―]/g, "-")   /* − – — إلى - */
         .replace(/٫/g, ".")                        /* فاصلةٌ عشريةٌ عربية */
         .replace(/[٬،]/g, ",")                     /* فاصلةُ الآلاف العربية كاللاتينية */
         .replace(/\s+/g, "")
         /* ═══ فاصلةُ الآلاف تُحذف، وفاصلةُ القائمة تبقى ════════════
            fmt() ترسم «٥٢٬٠٠٠» بفاصلةِ آلاف، والطفلُ يكتب «52000» —
            فهما جوابٌ واحد. ولو حُذفت كلُّ فاصلةٍ صار جوابُ القائمة
            «3, 5» عددًا «35»، فطُلب من الطفل أن يكتبه هكذا! فلا تُحذف
            إلّا حين تفصل ثلاثةَ أرقامٍ تامّة — وما عداها يبقى، فلا
            يصلح السؤالُ للكتابة ويبقى اختيارًا. */
         .replace(/\d{1,3}(?:,\d{3})+/g, function(m){ return m.replace(/,/g, ""); })
         .replace(/^[a-zA-Zسصع]\s*=\s*/i, "")                 /* «س = ٥» ← «٥» */
         .replace(/^[a-zA-Zسصع]=/i, "")
         .replace(/\.$/, "");
    return t;
  }

  /* تطبيعُ جوابٍ إنجليزيّ: حالةٌ صغرى، بلا نقطةٍ ولا اقتباسٍ ولا مسافاتٍ زائدة */
  function normEn(s){
    return stripTags(s).toLowerCase()
      .replace(/[‘’ʼ]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/^["'\s]+|["'\s.!?,;:]+$/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  var NUM_RE  = /^-?\d+(?:\.\d+)?$/;
  var FRAC_RE = /^-?\d+\/\d+$/;

  function asFraction(t){
    if(NUM_RE.test(t))  return [parseFloat(t), 1];
    var m = t.match(/^(-?\d+)\/(\d+)$/);
    if(m && +m[2] !== 0) return [parseInt(m[1],10), parseInt(m[2],10)];
    return null;
  }

  /* ═══ الإنجليزيُّ لا يُكتب إلّا في فراغٍ تُحدِّده الجملة ═══════════
     أمسك القياسُ في المتصفّح سؤالًا كهذا: «?What does "from time to
     time" mean» وجوابُه sometimes. وهو في الاختيار سليم، أمّا في
     الكتابة فمن كتب occasionally — وهي صحيحةٌ لغةً — رآها خطأً. وكذلك
     «?Which word is a vegetable». فالمعنى والمرادفُ والعكسُ تحتمل
     أجوبةً كثيرة، والجملةُ ذاتُ الفراغ لا تحتمل إلّا واحدًا.
     فلا يُحوَّل إلى الكتابة إلّا ما فيه فراغٌ صريح. */
  var EN_BLANK = /_{2,}|…|\.{3,}/;
  var EN_OPEN  = /\bmean(s|ing)?\b|\bsynonym\b|\bopposite\b|\bwhich word\b|معنى|مرادف|عكس|ترجم/i;

  /* هل يصلح هذا السؤال لأن يُكتب جوابُه؟ */
  function eligible(correctText, kind, stem){
    var raw = stripTags(correctText).trim();
    if(!raw) return false;
    if(kind === "en"){
      var e = normEn(raw);
      if(!e || e.length > 22) return false;
      if(e.split(" ").length > 2) return false;
      if(!/^[a-z][a-z'\- ]*$/.test(e)) return false;   /* كلمةٌ إنجليزيّةٌ أو كلمتان */
      var st = stripTags(stem == null ? "" : stem);
      return EN_BLANK.test(st) && !EN_OPEN.test(st);
    }
    var t = normMath(raw);
    return NUM_RE.test(t) || FRAC_RE.test(t);       /* عددٌ أو كسرٌ لا غير */
  }

  /* هل يطابق ما كتبه الطفلُ الجوابَ؟ */
  function ok(typed, correctText, kind){
    if(kind === "en") return !!normEn(typed) && normEn(typed) === normEn(correctText);
    var a = normMath(typed), b = normMath(correctText);
    if(!a) return false;
    if(a === b) return true;
    var fa = asFraction(a), fb = asFraction(b);
    if(fa && fb) return fa[0] * fb[1] === fb[0] * fa[1];   /* ٦/٨ = ٣/٤ */
    return false;
  }

  /* مواضعُ الأسئلة التي تُكتب: حتّى n سؤالًا ممّا يصلح، موزّعةٌ لا متجاورة */
  function pick(items, n, kind, getCorrect){
    var fit = [];
    for(var i = 0; i < items.length; i++){
      try{ if(eligible(getCorrect(items[i]), kind, items[i] && items[i][0])) fit.push(i); }catch(e){}
    }
    if(!fit.length) return {};
    var want = Math.min(n, fit.length), out = {};
    /* نأخذها متباعدةً على طول الجولة فلا تجتمع في أوّلها */
    for(var k = 0; k < want; k++){
      var idx = fit[Math.floor((k + 0.5) * fit.length / want)];
      if(idx === undefined) idx = fit[k];
      out[idx] = 1;
    }
    return out;
  }

  function inputHtml(kind){
    var ltr = (kind === "en") ? 'dir="ltr" style="text-align:left;' : 'style="';
    return '<div class="trow" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px">'+
      '<input class="tans" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" '+
        (kind === "en" ? '' : 'inputmode="text" ')+ltr+
        'flex:1;min-width:130px;padding:12px 14px;border:1.5px solid var(--line);border-radius:12px;'+
        'font-size:1.1rem;font-weight:700;font-family:inherit;background:transparent;color:var(--ink)" '+
        'placeholder="'+(kind === "en" ? "Write the answer..." : "اكتب الجواب...")+'">'+
      '<button class="tchk" style="background:var(--accent);color:#fff;border:0;padding:12px 18px;'+
        'border-radius:12px;font-weight:800;cursor:pointer;font-family:inherit">تحقّق ✅</button>'+
      '</div><div class="tfb" style="margin-top:8px;font-weight:700;font-size:.95rem"></div>';
  }

  /* يربط الحقل: يُنادي done(ok) مرّةً واحدة، ويُري الطفلَ الجواب الصحيح */
  function wire(qEl, correctText, kind, done){
    var inp = qEl.querySelector(".tans"), btn = qEl.querySelector(".tchk"),
        fb  = qEl.querySelector(".tfb");
    if(!inp || !btn) return;
    var used = false;
    function submit(){
      if(used) return;
      var val = inp.value || "";
      if(!val.trim()){ inp.focus(); return; }     /* فراغٌ ليس إجابة */
      used = true;
      var good = ok(val, correctText, kind);
      inp.disabled = true; btn.disabled = true;
      inp.style.borderColor = good ? "var(--good)" : "var(--bad)";
      fb.style.color = good ? "var(--good)" : "var(--bad)";
      fb.innerHTML = good ? "✅ إجابةٌ صحيحة"
        : ('❌ الجواب الصحيح: <b dir="ltr">' + stripTags(correctText) + '</b>');
      try{ done(good, val); }catch(e){}
    }
    btn.addEventListener("click", submit);
    inp.addEventListener("keydown", function(e){ if(e.key === "Enter"){ e.preventDefault(); submit(); } });
  }

  g.TYPED = { eligible: eligible, ok: ok, pick: pick, inputHtml: inputHtml, wire: wire,
              normMath: normMath, normEn: normEn, stripTags: stripTags };
})(window);
