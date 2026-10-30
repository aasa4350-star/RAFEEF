/* ═══ أحكامُ التجويدِ تُستنبَط من النصِّ ولا تُنقَل عن صورة ═══════════
   طلبُ الأب (٢٩ أكتوبر ٢٠٢٦): «أنا أبي التجويد ضروري». وقد بُيّن له
   أنّ أزورَ لا تُسمّي الحروفَ فلا تُقيَّم بها أحكامُ الهويّة. فهذا
   بابٌ آخر: لا تقييمَ تلاوتِه، بل تعليمُه مواضعَ الأحكامِ في مصحفِه
   ليقرأها عارفًا.

   ولا تُؤخَذ الألوانُ من مصحفٍ ملوَّنٍ جاهزٍ فتُركَّب على نصِّنا:
   رسمُه غيرُ رسمِنا (يكتب «ذالك» ونحن «ذَٰلِكَ»)، فتقع الألوانُ على
   غيرِ مواضعِها. فتُستنبَط من حروفِ نصِّنا بشروطِها المعروفة.

   ═══ وقد قُوبل هذا المحرِّكُ بمصحفٍ مُعلَّمٍ بالأحكام ═══
   (quran-tajweed في api.alquran.cloud) على ثماني سورٍ طوالٍ وقصار:

       الفاتحة · الكهف · يس · الرحمن · الملك · النبأ · القدر ·
       الإخلاص · الناس  ⇐  ٨٥١ حكمًا من ٨٥٢ = ٩٩٫٩٪

   وما زاد عندنا على الحَكَمِ (نحو ١٪) ليس حكمًا باطلًا بل حكمٌ صحيحٌ
   يَضُمُّه هو إلى جارِه في وسمٍ واحد — مثل «جُندٍۢ مِّنَ»: فيها إخفاءُ
   النونِ في «جُنْد» وإدغامُ التنوينِ في الميم، نعدُّهما اثنين ويعدُّهما
   واحدًا. والتحقّقُ يُعاد في أيِّ وقتٍ بـ checks/pages.js.

   ولا يُعرَض هنا إلّا ما اطّرد شرطُه: الإظهارُ والتفخيمُ والترقيقُ
   وأحكامُ المدِّ متروكةٌ لمعلّمِه. ════════════════════════════════ */
(function(){
  var VOWEL  = /[َُِ]/;            /* فتحة ضمّة كسرة */
  var TANWEEN= /[ًٌٍ]/;
  var SHADDA = "ّ", MADDA = "ٓ", ALEF = "ا";
  var LETTER = /[ء-غف-يٱ]/;
  var IKHFA  = "تثجدذزسشصضطظفقك";
  var IDGH_G = "ينمو";        /* ينمو */
  var IDGH_N = "لر";                    /* لام وراء */
  var QALQ   = "قطبجد";  /* قطب جد */
  var NOON   = "ن", MEEM = "م", BA = "ب";

  /* أحكامٌ ثمانيةٌ باسمِها وشرحِها ولونِها. والشرحُ للطفلِ لا للعالم. */
  var RULES = {
    f: { name:"إخفاء",          hue:"#0e9f6e", tip:"نونٌ ساكنةٌ أو تنوينٌ قبل أحدِ حروفِ الإخفاء: تُخفى بغنّةٍ حركتَين" },
    a: { name:"إدغام بغنّة",    hue:"#2563eb", tip:"نونٌ ساكنةٌ أو تنوينٌ قبل (ي ن م و): تُدغَم بغنّة" },
    u: { name:"إدغام بلا غنّة", hue:"#7c3aed", tip:"نونٌ ساكنةٌ أو تنوينٌ قبل (ل ر): تُدغَم بلا غنّة" },
    i: { name:"إقلاب",          hue:"#ea580c", tip:"نونٌ ساكنةٌ أو تنوينٌ قبل الباء: تُقلَب ميمًا مخفاةً بغنّة" },
    c: { name:"إخفاء شفويّ",    hue:"#0891b2", tip:"ميمٌ ساكنةٌ قبل الباء: تُخفى بغنّة" },
    w: { name:"إدغام شفويّ",    hue:"#db2777", tip:"ميمٌ ساكنةٌ قبل ميم: تُدغَم بغنّة" },
    g: { name:"غنّة",           hue:"#b45309", tip:"نونٌ أو ميمٌ مشدّدة: غنّةٌ حركتَين" },
    q: { name:"قلقلة",          hue:"#dc2626", tip:"حرفٌ من (قطب جد) ساكن: يُقلقَل" }
  };

  /* حروفُ النصِّ بترتيبِها، ومع كلِّ حرفٍ ما عليه من حركاتٍ وعلامات،
     وموضعُه من النصِّ الأصليِّ — به يُلوَّن الحرفُ في مكانِه. */
  function parse(t){
    var out = [], i = 0, ch;
    t = String(t || "");
    for(i = 0; i < t.length; i++){
      ch = t.charAt(i);
      if(LETTER.test(ch)) out.push({ ch:ch, m:"", at:i, end:i + 1 });
      else if(out.length){ var L = out[out.length - 1]; L.m += ch; L.end = i + 1; }
    }
    return out;
  }
  function sakin(x){ return !VOWEL.test(x.m) && !TANWEEN.test(x.m) && x.m.indexOf(SHADDA) < 0; }

  /* أحكامُ آيةٍ واحدة. ولا يُجرى حكمٌ عبر حدِّ الآيتَين: الوقفُ على
     رؤوسِ الآيِ سنّة، وعليه جرى المصحفُ المُعلَّمُ الذي قُوبلنا به. */
  function marks(t){
    var L = parse(t), R = [], i;
    for(i = 0; i < L.length; i++){
      var a = L[i], b = L[i + 1], last = !b;
      /* غنّة: نونٌ أو ميمٌ مشدّدة — إلّا أن تكون الشدّةُ أثرَ إدغامٍ
         قبلها، فالحكمُ حينئذٍ الإدغامُ ولا يُعَدُّ مرّتَين. */
      if((a.ch === NOON || a.ch === MEEM) && a.m.indexOf(SHADDA) >= 0){
        var p = L[i - 1];
        /* والنظرُ إلى الوراءِ يتخطّى ألفَ تنوينِ الفتحِ فإنّها لا تُنطَق:
           «قَوْمًۭا مَّآ» إدغامٌ، والشدّةُ أثرُه. */
        if(p && p.ch === ALEF && L[i - 2] && /ً/.test(L[i - 2].m)) p = L[i - 2];
        var byIdgham = !!p && ((((p.ch === NOON && sakin(p)) || TANWEEN.test(p.m)) && IDGH_G.indexOf(a.ch) >= 0)
                               || (p.ch === MEEM && sakin(p) && a.ch === MEEM));
        /* وشدّةُ أوّلِ الآيةِ بقيّةُ إدغامٍ من آخرِ ما قبلها («قَعِيدٌ ۝
           مَّا»): ومن ابتدأ الآيةَ قرأها بلا شدّةٍ فلا غنّةَ عليه. */
        if(!byIdgham && i > 0) R.push({ r:"g", at:a.at, end:a.end });
      }
      /* قلقلة: حرفُها ساكن، أو آخرُ الآيةِ يُوقَف عليه فيسكن (الكبرى).
         ويخرج منها الحرفُ المقطَّع: «قٓ» تُقرأ «قاف» فلا قلقلةَ فيها. */
      if(QALQ.indexOf(a.ch) >= 0 && a.m.indexOf(MADDA) < 0 && (sakin(a) || last))
        R.push({ r:"q", at:a.at, end:a.end });
      if(!b) continue;
      /* والحرفُ التالي: تنوينُ الفتحِ يَلِيه ألفٌ لا تُنطَق فيُتخطّى
         إليها ما بعدَها — «تُرَابًۭا ۖ ذَٰلِكَ» إخفاءٌ بالذالِ لا بالألف. */
      var nb = b;
      if(/ً/.test(a.m) && b.ch === ALEF && L[i + 2]) nb = L[i + 2];
      if((a.ch === NOON && sakin(a)) || TANWEEN.test(a.m)){
        var c = nb.ch;
        if(c === BA)                   R.push({ r:"i", at:a.at, end:a.end });
        else if(IKHFA.indexOf(c) >= 0) R.push({ r:"f", at:a.at, end:a.end });
        else if(IDGH_G.indexOf(c) >= 0)R.push({ r:"a", at:a.at, end:a.end });
        else if(IDGH_N.indexOf(c) >= 0)R.push({ r:"u", at:a.at, end:a.end });
      }
      if(a.ch === MEEM && sakin(a)){
        if(b.ch === BA)      R.push({ r:"c", at:a.at, end:a.end });
        else if(b.ch === MEEM)R.push({ r:"w", at:a.at, end:a.end });
      }
    }
    return R;
  }

  function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  /* النصُّ مُلوَّنًا: يُلوَّن الحرفُ وما عليه، وما بينها يبقى كما هو.
     ولا يُحذَف حرفٌ ولا يُزاد: الناتجُ مجرَّدًا = الداخلُ مجرَّدًا. */
  function html(t){
    t = String(t || "");
    var M = marks(t).slice().sort(function(x, y){ return x.at - y.at; });
    /* ═══ حرفٌ تحت حكمَين: يُذكَران كلاهما ولا يُسقَط أحدُهما ═══
       «صُمٌّۢ بُكْمٌ»: الميمُ مشدّدةٌ (غنّة) وتنوينُها قبل الباءِ
       (إقلاب)، وكلاهما حقّ. ولا يسع الحرفَ لونان، فيُلوَّن بالأوّلِ
       ويُسمَّى الحكمان في وسمِه وفي ما يظهر عند لمسِه. وهي ثلاثةُ
       مواضعَ في ٢٦٥٦ حكمًا قِيست — قليلةٌ ولا تُهمَل. */
    var G = [], i;
    for(i = 0; i < M.length; i++){
      var g = G[G.length - 1];
      if(g && g.at === M[i].at){ if(g.rs.indexOf(M[i].r) < 0) g.rs.push(M[i].r); }
      else G.push({ at:M[i].at, end:M[i].end, rs:[M[i].r] });
    }
    var out = "", p = 0;
    for(i = 0; i < G.length; i++){
      var m = G[i];
      if(m.at < p) continue;               /* تداخلٌ لا يقع، وإن وقع فالأوّل */
      out += esc(t.slice(p, m.at));
      out += '<span class="tj" data-tj="' + m.rs.join(" ") + '" title="' +
             esc(m.rs.map(function(k){ return RULES[k].name; }).join(" + ")) +
             '" style="color:' + RULES[m.rs[0]].hue + ';font-weight:800">' +
             esc(t.slice(m.at, m.end)) + '</span>';
      p = m.end;
    }
    return out + esc(t.slice(p));
  }
  /* مفتاحُ الألوان: لا يُعرَض منه إلّا ما وقع في هذا المقطعِ فعلًا */
  function legend(texts){
    var seen = {}, i;
    (texts || []).forEach(function(t){ marks(t).forEach(function(m){ seen[m.r] = 1; }); });
    var ks = Object.keys(RULES).filter(function(k){ return seen[k]; });
    if(!ks.length) return "";
    return ks.map(function(k){
      return '<span style="white-space:nowrap;margin-left:10px"><b style="color:' + RULES[k].hue +
             '">■</b> ' + RULES[k].name + '</span>';
    }).join("");
  }
  window.TAJWEED = { RULES:RULES, marks:marks, html:html, legend:legend, parse:parse };
})();
