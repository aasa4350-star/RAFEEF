/* ============================================================
   تشخيص المايكروفون — مشتركٌ بين كلّ صفحات النطق.

   بلاغ الأب (٢٦ أغسطس ٢٠٢٦): «حسن أتعبَته هذي» ومعها صورةٌ لرسالة
   «تعذّر المايكروفون. افتح الموقع في Safari واسمح بالمايكروفون» —
   وهو في Safari أصلًا. فالنصيحة طريقٌ مسدود: يفعل ما قيل له فيعود
   إليه الكلام نفسه.

   وأصل العلّة أنّ الرسالة كانت واحدةً لكلّ الأسباب: المنع، وانشغال
   المايك بمكالمة، وغياب الجهاز، ومتصفّحٍ داخل تطبيق. فكنّا نُخفي
   السبب الحقيقيّ خلف نصيحةٍ لا تنفع إلّا في حالةٍ واحدة.

   فصرنا نسأل المتصفّح نفسه عند الإخفاق وحده — لا قبله، لئلّا نُشغل
   المايك مرّتين على آيفون — ثمّ نقول له ما الذي منعه بالضبط وما يصنع.

   وهذا في ملفٍّ واحد لأنّ أربع صفحاتٍ تستعمله: reading.html
   وquiz.html وenglish.html وtalk.html — وكانت كلّها تحمل نسخةً من
   الرسالة العامّة نفسها. ونسخُها أربعًا يعني أن تُصلَح واحدةٌ
   وتبقى ثلاث.
   ============================================================ */
(function(g){

  function inAppBrowser(){
    var ua = navigator.userAgent || "";
    if(/FBAN|FBAV|Instagram|Line|Twitter|WhatsApp|Snapchat|MicroMessenger|OKApp/i.test(ua)) return true;
    /* على iOS كلّ متصفّحٍ حقيقيّ يذكر Safari في هويّته،
       ومتصفّح التطبيقات (WKWebView) لا يذكرها */
    var ios = /iP(hone|od|ad)/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    return ios && !/Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
  }

  /* tail: جملةٌ تخصّ الصفحة تُذيَّل بها الرسالة (ماذا يفعل الطفل الآن) */
  function diagnose(cb, tail){
    tail = tail || "";
    if(inAppBrowser()){
      cb('❌ المايكروفون لا يعمل داخل متصفّح التطبيقات. اضغط <b>«···»</b> ثمّ '+
         '<b>«فتح في Safari»</b> وأعد المحاولة.' + tail); return;
    }
    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
      cb('❌ متصفّحك لا يدعم تسجيل الصوت. جرّب <b>Safari</b> محدَّثًا.' + tail); return;
    }
    if(!g.isSecureContext && location.protocol !== "https:" && location.hostname !== "localhost"){
      cb('❌ التسجيل يحتاج اتّصالًا آمنًا (https).' + tail); return;
    }
    navigator.mediaDevices.getUserMedia({ audio:true }).then(function(st){
      try{ st.getTracks().forEach(function(t){ t.stop(); }); }catch(e){}
      /* المايك مسموحٌ وشغّال — فالعلّة في الشبكة أو في خدمة النطق */
      cb('❌ المايكروفون شغّال، لكن خدمة تقييم النطق ما استجابت. '+
         'تأكّد من الإنترنت وأعد المحاولة.' + tail);
    }).catch(function(e){
      var n = (e && (e.name || e.message)) || "";
      if(/NotAllowed|Permission|SecurityError/i.test(n)){
        cb('❌ المايكروفون <b>ممنوع</b> لهذا الموقع. في Safari: اضغط <b>«ﺃﺍ»</b> '+
           'يسار شريط العنوان ← <b>إعدادات الموقع</b> ← <b>المايكروفون</b> ← <b>سماح</b>، '+
           'ثمّ حدّث الصفحة.<div style="font-weight:400;font-size:.85rem;margin-top:4px">'+
           'وإن ما ظهر الخيار: <b>الإعدادات</b> ← <b>Safari</b> ← <b>المايكروفون</b> ← <b>سؤال</b> أو <b>سماح</b>.</div>' + tail);
      } else if(/NotFound|DevicesNotFound/i.test(n)){
        cb('❌ ما لقيت مايكروفونًا في الجهاز.' + tail);
      } else if(/NotReadable|TrackStart|AbortError/i.test(n)){
        cb('❌ المايكروفون مشغولٌ بتطبيقٍ آخر (مكالمة أو تسجيل). أغلقه وأعد المحاولة.' + tail);
      } else {
        cb('❌ تعذّر فتح المايكروفون' + (n ? ' ('+n+')' : '') + '.' + tail);
      }
    });
  }

  /* يضع الرسالة المشخَّصة مكان الرسالة العامّة.
     onFail يُنادى فورًا لا بعد التشخيص: الطفل محبوسٌ الآن، ولا ينتظر
     جوابَ المتصفّح ليُفتح له الطريق. reset يُعيد الزرّ إلى حاله. */
  function fail(statusEl, btn, opts){
    opts = opts || {};
    if(statusEl){
      statusEl.style.color="var(--bad)";
      statusEl.innerHTML="⏳ أتحقّق من سبب تعذّر المايكروفون...";
    }
    if(opts.onFail){ try{ opts.onFail(); }catch(e){} }
    diagnose(function(msg){
      if(statusEl){ statusEl.style.color="var(--bad)"; statusEl.innerHTML=msg; }
      if(opts.reset){ try{ opts.reset(); }catch(e){} }
      else if(btn){ btn.disabled=false; }
    }, opts.tail);
  }

  /* أداة النطق تُحمَّل من الشبكة. وكانت رسالة «جرّب بعد ثانية» تعود
     أبدًا إن لم تصل — فيضغط الطفل ويضغط ولا شيء يتغيّر. فننتظر مدّةً
     ثمّ نُقرّ بالعجز، ولا نتركه يضغط على بابٍ لن يُفتح. */
  function waitSDK(statusEl, btn, onReady, onGiveUp, waited){
    if(g.SpeechSDK){ onReady(); return; }
    waited = waited || 0;
    if(waited >= 6000){ onGiveUp(); return; }
    if(statusEl){ statusEl.style.color="var(--muted)"; statusEl.textContent="⏳ جارٍ تحميل أداة النطق..."; }
    if(btn){ btn.disabled = true; }
    setTimeout(function(){ waitSDK(statusEl, btn, onReady, onGiveUp, waited+500); }, 500);
  }

  /* ===== إذن المايكروفون قبل بدء التعرّف =====
     بلاغ الأب (٤ سبتمبر ٢٠٢٦) بصورة شاشة حسن على آيفون: نافذة سفاري
     «Would Like to Access the Microphone» ظاهرة، وخلفها زرّ التسجيل أحمر
     أي إنّ أزور بدأت تستمع فعلًا. فمهلة الصمت الأوّليّ (٨ ثوانٍ) تمشي
     والطفل مشغولٌ بقراءة النافذة والضغط على Allow — ثمّ يتكلّم وقد ضاع
     نصف وقته أو كلّه، فلا يُلتقط شيء ولا يُحفظ شيء.
     العلّة أنّ أحدًا لم يكن يطلب الإذن صراحةً: أزور تطلبه ضمنًا حين تبدأ،
     فيتسابق الطلب والعدّاد. فصرنا نطلبه أوّلًا ونبدأ بعده — فيأخذ الطفل
     نافذة الاستماع كاملةً. وإن رُفض الإذن ظهر السبب الحقيقيّ (diagnose)
     بدل «ما سمعتك» الغامضة.
     ونحرّر المسار فورًا: إمساكه يُبقي مؤشّر المايك مضاءً ويزاحم أزور. */
  function ensure(statusEl, onReady, onDenied){
    if(g.__micGranted){ onReady(); return; }
    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){ onReady(); return; }
    if(statusEl){ statusEl.style.color="var(--muted)";
      statusEl.innerHTML="🎤 اضغط <b>Allow</b> للسماح بالمايكروفون، وبعدها أستمع لك."; }
    navigator.mediaDevices.getUserMedia({ audio:true }).then(function(st){
      try{ st.getTracks().forEach(function(t){ t.stop(); }); }catch(e){}
      g.__micGranted = true;
      onReady();
    }).catch(function(){ onDenied(); });
  }

  g.MIC = { inAppBrowser:inAppBrowser, diagnose:diagnose, fail:fail, waitSDK:waitSDK, ensure:ensure };
})(window);
