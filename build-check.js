/* ══════════════════════════════════════════════════════════════════
   رقمُ البناء: الصفحةُ تُحدِّث نفسَها بلا انتظار
   ══════════════════════════════════════════════════════════════════
   بلاغ الأب (٢٠ نوفمبر ٢٠٢٦) بصورةٍ من صفحةِ فهد: «ذي صفحة فهد ما
   عنده» — والقسمُ كان منشورًا، إنّما صورتُه الساعةَ ١٠:٣٧ والنشرُ نزل
   ١٠:٥٣. فنظر قبلَه.

   وGitHub Pages يُرسِل الصفحةَ بـcache-control: max-age=600، ولا سبيلَ
   إلى تغييرِ ترويسةِ الخادمِ هناك. والمقاطعُ والبنوكُ لها رقمُ نسخةٍ في
   رابطِها (AUDIO_VER) فتُحدَّث فورًا، وصفحةُ HTML نفسُها بلا رقمٍ —
   فتبقى عشرَ دقائقَ وأكثرَ في سفاري.

   فصارت كلُّ صفحةٍ تحمل BUILD_VER، وتسأل version.json بلا تخزينٍ عند
   الفتح: فإن اختلف الرقمان أعادت تحميلَ نفسِها برابطٍ فيه الرقمُ
   الجديد — ورابطٌ جديدٌ يعني طلبًا جديدًا من الشبكةِ لا من المخزن.

   وثلاثةُ قيودٍ تمنع الدوران:
     · لا يُعاد التحميلُ لرقمٍ جُرِّب في هذا التبويبِ من قبل
       (sessionStorage) — فإن بقي الاختلافُ بعد محاولةٍ تُرِك.
     · ولا يُفعَل شيءٌ إن تعذّر الطلبُ أو غاب الملفُّ أو غاب الرقم.
     · ولا يُفعَل شيءٌ والطفلُ يكتب: إن كان في الصفحةِ حقلٌ فيه نصٌّ،
       أُجِّل حتى يخرج منها — فإعادةُ التحميلِ تمحو إجابتَه.
   ══════════════════════════════════════════════════════════════════ */
(function(){
  "use strict";
  /* ⚠️ الرقمُ في رابطِ هذا الملفِّ لا في كتلةٍ داخليّةٍ في الصفحة:
     كتلةٌ داخليّةٌ جديدةٌ تصير «أوّلَ كتلة» في الصفحة، وفحصُ think.html
     يأخذ أوّلَها ليستخرج بنكَه — فكسرتُه بإدراجي أوّلَ مرّة. والرابطُ
     لا يُزاحِم أحدًا. */
  var MINE = (function(){
    try{
      var sc = document.currentScript;
      if(!sc) { var all = document.querySelectorAll('script[src*="build-check.js"]'); sc = all[all.length-1]; }
      var m = /[?&]v=([0-9a-f]+)/.exec(sc && sc.getAttribute("src") || "");
      return m ? m[1] : null;
    }catch(e){ return null; }
  })();
  if(!MINE || MINE === "0000000000") return;         /* بلا رقم: لا شأنَ لنا بها */
  window.BUILD_VER = MINE;

  function typing(){
    try{
      var els = document.querySelectorAll("input[type=text], input:not([type]), textarea");
      for(var i=0;i<els.length;i++){ if(String(els[i].value||"").trim()) return true; }
      var a = document.activeElement;
      if(a && /^(INPUT|TEXTAREA)$/.test(a.tagName)) return true;
    }catch(e){}
    return false;
  }

  function tried(v){
    try{ return sessionStorage.getItem("rafeef_build_try") === v; }catch(e){ return true; }
  }
  function markTried(v){ try{ sessionStorage.setItem("rafeef_build_try", v); }catch(e){} }

  function go(v){
    markTried(v);
    try{
      var u = new URL(location.href);
      u.searchParams.set("_v", v);
      location.replace(u.toString());
    }catch(e){
      location.replace(location.pathname + (location.search ? location.search + "&" : "?") + "_v=" + encodeURIComponent(v) + location.hash);
    }
  }

  function check(){
    fetch("version.json?t=" + Date.now(), { cache:"no-store" })
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(j){
        var v = j && j.v;
        if(!v || v === MINE || tried(v)) return;
        if(typing()){                                 /* لا نمحو ما كتبه */
          window.addEventListener("pagehide", function(){ markTried(v); }, { once:true });
          return;
        }
        go(v);
      })
      .catch(function(){});
  }

  /* يُسأل عند الفتحِ وعند العودةِ إلى التبويب — فمن ترك الصفحةَ مفتوحةً
     ليلةً كاملةً يجدها محدَّثةً حين يعود. */
  if(document.readyState === "complete") check();
  else window.addEventListener("load", check, { once:true });
  document.addEventListener("visibilitychange", function(){ if(!document.hidden) check(); });

  /* ونُنظّف الرابطَ بعد نجاحِ التحديثِ فلا يبقى «_v» معلّقًا */
  try{
    if(new URL(location.href).searchParams.get("_v") === MINE){
      var u2 = new URL(location.href); u2.searchParams.delete("_v");
      history.replaceState(null, "", u2.pathname + (u2.search || "") + (u2.hash || ""));
    }
  }catch(e){}
})();
