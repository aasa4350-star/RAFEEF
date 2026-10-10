/* ═══ زرُّ «اطبع قواعد الدروس» في شريطِ الصفحة ═══════════════════════
   طلبُ الأب (١٠ أكتوبر ٢٠٢٦): «اكتب قاعدة كلّ درس في بي دي اف عشان
   أطبعها». والورقةُ تُولَّد بـtools/gen-rules-pdf.js، وهذا يضع رابطَها
   في الصفحةِ نفسِها — وإلّا بقيت في مجلّدٍ لا يعرفه أحد.

   ولِمَ ملفٌّ واحدٌ لا سطرٌ في كلِّ صفحة: الصفحاتُ إحدى وعشرون، ولو
   كُتب الرابطُ في كلٍّ منها لاختلفت صياغتُه ونُسي في الصفحةِ الثانيةِ
   والعشرين حين تُضاف. والاسمُ يُشتقّ من اسمِ الصفحةِ نفسِه، فلا جدولَ
   يُحدَّث ولا يتخلّف.

   والشريطُ يُبنى بعد بوّابةِ الدخول لا مع الصفحة، فيُنتظَر ظهورُه
   بمراقبٍ يفصل نفسَه متى وُجد أو متى طال الانتظار — فلا يبقى مراقبٌ
   يعمل في صفحةٍ لا شريطَ فيها. */
(function(){
  var TAG = (function(){
    var m = /([^\/]+)\.html$/.exec(location.pathname);
    return m ? m[1] : null;
  })();
  if(!TAG) return;

  /* الصفحاتُ التي لها ورقةُ مقرَّرٍ فتريّ — يحرسها checks/pages.js */
  var FATRI_PAGES = ["math4", "math5", "math8", "math9"];

  function link(bar, mark, file, text, title){
    if(bar.querySelector("[" + mark + "]")) return;
    var a = document.createElement("a");
    a.href = "pdf/" + file;
    a.target = "_blank";
    a.rel = "noopener";
    a.setAttribute(mark, "");
    a.textContent = text;
    a.title = title;
    bar.appendChild(a);
  }

  function put(){
    var bar = document.querySelector(".bar");
    if(!bar) return false;
    if(bar.querySelector("[data-rules-pdf]")) return true;
    link(bar, "data-rules-pdf", "rules-" + TAG + ".pdf", "🖨️ قواعد الدروس",
         "ورقةٌ للطباعة فيها قاعدةُ كلِّ درسٍ في هذه المادّة");
    /* ═══ وورقةُ المقرَّرِ الفتريِّ وحدَه ═══════════════════════════════
       طلبُ الأب (١٠ أكتوبر ٢٠٢٦): «أبي قواعد الرياضيات دروس حسن اختبار
       الفتري فقط» — فورقةُ المادّةِ تُذاكِر ما لا يُسأل عنه.

       ولا يُوضَع الزرُّ إلّا حيث وُلِّدت ورقةٌ فعلًا. وجُرِّب أوّلًا أن
       يُستدَلَّ عليه بتبويبِ «الفتري» في الشاشة، فأخطأ في الجهتَين:
       math8 وmath9 تبنيان تبويبَهما من CHAPS وقتَ التشغيل، وenglish5
       فيها تبويبُ فتريٍّ ومقرَّرُه في ملفٍّ آخرَ (fatri-en5.js) لا
       دروسَ له في REMTOPICS — فكان الزرُّ يفتح ٤٠٤.
       فالقائمةُ صريحةٌ هنا، ويقابلها حارسُ checks/pages.js بملفّات
       pdf/rules-*-fatri.pdf — فلا زرَّ بلا ورقةٍ ولا ورقةَ بلا زرّ. */
    if(FATRI_PAGES.indexOf(TAG) >= 0)
      link(bar, "data-fatri-pdf", "rules-" + TAG + "-fatri.pdf", "📝 قواعد الفتري",
           "قواعدُ دروسِ مقرَّرِ الاختبارِ الفتريِّ وحدَها");
    return true;
  }

  function start(){
    if(put()) return;
    if(!window.MutationObserver) return;
    var done = false;
    var mo = new MutationObserver(function(){
      if(done) return;
      if(put()){ done = true; mo.disconnect(); }
    });
    mo.observe(document.documentElement, { childList:true, subtree:true });
    /* البوّابةُ قد لا تُفتَح أصلًا، فلا يُترك المراقبُ يعمل بلا نهاية */
    setTimeout(function(){ if(!done){ done = true; mo.disconnect(); } }, 20000);
  }

  if(document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", start);
  else start();
})();
