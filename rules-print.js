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

  function put(){
    var bar = document.querySelector(".bar");
    if(!bar) return false;
    if(bar.querySelector("[data-rules-pdf]")) return true;
    var a = document.createElement("a");
    a.href = "pdf/rules-" + TAG + ".pdf";
    a.target = "_blank";
    a.rel = "noopener";
    a.setAttribute("data-rules-pdf", "");
    a.textContent = "🖨️ قواعد الدروس";
    a.title = "ورقةٌ للطباعة فيها قاعدةُ كلِّ درسٍ في هذه المادّة";
    bar.appendChild(a);
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
