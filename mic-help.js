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
     ═══ فتحُ المايك مرّةً واحدة — بلاغ الأب (٥ سبتمبر ٢٠٢٦) ═══
     «التسجيل عند أسامة متعطل». وهو تكرارٌ لبلاغ ٣١ أغسطس: «أسامة كلّ
     الأقسام تقبل معه إلّا قراءة القطعة». وقد أعدنا يومها بناء قراءة
     القطعة على دوراتٍ من recognizeOnceAsync فلم يُشفَ.

     والعلّة الحقيقية أعمق: كانت كلّ دورةٍ تفتح المايكروفون من جديد
     بـ AudioConfig.fromDefaultMicrophoneInput()، فقراءةُ قطعةٍ واحدة
     تفتح المايك وتغلقه عشر مرّاتٍ أو أكثر. وهذا أشدّ ما يكون هشاشةً
     على سفاري/آيفون. ولهذا كانت الكلمة المفردة تنجح معه (فتحٌ واحد)
     وتفشل القطعة (فتحٌ متكرّر) — وهو الفرق الذي وصفه بنفسه.

     ثمّ زدنا الطين بلّةً في ٢ سبتمبر: صارت ensure تفتح المايك لتأخذ
     الإذن ثمّ **تغلقه فورًا**، فتفتحه أزور بعدها من جديد. ففتحتان
     متعاقبتان قبل أن ينطق الطفل حرفًا، والأولى تستهلك إيماءة الضغط
     التي يشترطها سفاري للثانية.

     فصرنا نفتحه مرّةً واحدةً ونُمسك المسار حيًّا ونُسلّمه إلى أزور عبر
     AudioConfig.fromStreamInput — والمكتبة لا تُغلق مسارًا سلّمناه لها
     (تستعمل PcmRecorder(false)، بخلاف المايك الافتراضيّ)، فيبقى
     صالحًا لكلّ الدورات. فلا فتح إلّا واحد مهما طالت القراءة.

     ونحرّره حين ينتهي التقييم (بعد مهلةٍ قصيرة تكفي النقرات المتتابعة)
     وعند مغادرة الصفحة، فلا يبقى مؤشّر المايك مضاءً بلا سبب. */
  function streamAlive(){
    var s = g.__micStream;
    if(!s || !s.active) return false;
    try{
      var ts = s.getAudioTracks ? s.getAudioTracks() : s.getTracks();
      for(var i=0;i<ts.length;i++){ if(ts[i].readyState === "live") return true; }
    }catch(e){}
    return false;
  }
  function stream(){ return streamAlive() ? g.__micStream : null; }
  function release(){
    if(_relTo){ clearTimeout(_relTo); _relTo = null; }
    var s = g.__micStream; g.__micStream = null;
    if(!s) return;
    try{ s.getTracks().forEach(function(t){ t.stop(); }); }catch(e){}
  }
  var _relTo = null;
  /* تحريرٌ مؤجَّل: نقرتان متتابعتان على كلمتين تُعيدان استعمال المسار
     نفسه بلا فتحٍ جديد، ثمّ يُغلق من تلقائه إن سكت الطفل. */
  function releaseSoon(ms){
    if(_relTo) clearTimeout(_relTo);
    _relTo = setTimeout(function(){ _relTo = null; if(!g.__paBusy) release(); }, ms || 20000);
  }
  function keep(){ if(_relTo){ clearTimeout(_relTo); _relTo = null; } }

  /* إعدادُ الصوت لأزور: مسارُنا الحيّ إن وُجد، وإلّا المايك الافتراضيّ
     (وهو ما كان يُستعمل دائمًا قبل هذا الإصلاح) حتى لا ينكسر شيء. */
  function audioConfig(SDK){
    var s = stream();
    if(s && SDK && SDK.AudioConfig && SDK.AudioConfig.fromStreamInput){
      try{ return SDK.AudioConfig.fromStreamInput(s); }catch(e){}
    }
    return SDK.AudioConfig.fromDefaultMicrophoneInput();
  }

  function ensure(statusEl, onReady, onDenied){
    keep();
    if(streamAlive()){ onReady(); return; }
    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){ onReady(); return; }
    /* لا نُظهر «اضغط Allow» إلّا في الطلب الأوّل — فبعد السماح مرّةً
       يعود الطلب فوريًّا بلا نافذة، ورسالةٌ عن نافذةٍ لا تظهر تُربك. */
    if(statusEl && !g.__micGranted){ statusEl.style.color="var(--muted)";
      statusEl.innerHTML="🎤 اضغط <b>Allow</b> للسماح بالمايكروفون، وبعدها أستمع لك."; }
    /* نافذة الإذن نافذةُ نظامٍ فوق الصفحة، وصفحات الاختبار تعدّ الغياب خروجًا.
       فنُمدّد مهلة السماح قبل الطلب وبعده لئلّا يُحسب على الطفل خروجٌ لم
       يفعله لمجرّد أنّه سمح للمايكروفون — بلاغ ٤ سبتمبر ٢٠٢٦. */
    g.__micGrace = Date.now() + 30000;
    navigator.mediaDevices.getUserMedia({ audio:true }).then(function(st){
      g.__micStream = st;
      g.__micGranted = true;
      g.__micGrace = Date.now() + 15000;
      onReady();
    }).catch(function(){ g.__micGrace = Date.now() + 15000; onDenied(); });
  }

  /* ═══ لماذا أخفق التسجيل — كما تقوله أزور نفسها ═══
     بلاغ الأب (٥ سبتمبر ٢٠٢٦): «الكلمات مضبوطة، لكن قراءة القطعة
     والمحادثة ما ضبطت». وهذا ثالث بلاغٍ في المسألة نفسها، وقد خمّنتُ
     مرّتين قبله فأخطأت: مرّةً في نوع التعرّف ومرّةً في عدد فتحات المايك.

     وسببُ الخطأ أنّي لم أكن أملك خبرًا واحدًا عمّا جرى على أجهزتهم:
     الموقع كلّه لم يكن فيه سطرٌ يقرأ سبب الإلغاء. فكلّ إخفاقٍ — سواءٌ
     أكان انقطاع شبكةٍ أم رفض مصادقةٍ أم نفاد الحصّة أم مايكًا مشغولًا —
     كان يُعرض على الطفل جملةً واحدة: «ما وضح الصوت، اقرأ أعلى». فيرفع
     صوته ولا ينفع، ولا يبقى منه أثرٌ نعرف به ما جرى.

     فصرنا نسأل أزور: NoMatch أم Canceled؟ وإن أُلغي فبأيّ رمز
     (AuthenticationFailure، ConnectionFailure، Forbidden، TooManyRequests،
     ServiceTimeout...) وبأيّ تفصيل. ونضمّ إليه وصف الجهاز والمتصفّح،
     فيُحفظ صفًّا نقرؤه بدل أن نخمّن مرّةً رابعة. */
  /* ex: الاستثناء الذي وقع أثناء قراءة نتيجة التقييم (إن وقع).
     أضيف بعد أن جاءت صفوف أسامة بسببٍ فارغ (٥ سبتمبر ٢٠٢٦): أزور تُرجع
     «RecognizedSpeech» ومع ذلك لا نحصل على كلمات — فالسبب ليس صمتًا ولا
     إلغاءً، بل شيءٌ في نتيجة التقييم نفسها. فنُسجّل حالة النتيجة كما
     تُسمّيها أزور، وطول النصّ الذي فهمته، وهل في جوابها حقلُ تقييم نطقٍ
     أصلًا، ونصّ الاستثناء إن وقع — فبهذه الأربعة يُعرف الموضع بلا تخمين. */
  function why(SDK, result, err, ex){
    var o = { reason:null, code:null, detail:null, res:null, txt:null, pa:null };
    try{
      var RR = SDK && SDK.ResultReason;
      if(result){
        /* اسم الحالة لا رقمها: enum تُولّد المفتاحين، فنأخذ غير الرقميّ */
        if(RR){ for(var k in RR){ if(!/^\d+$/.test(k) && RR[k] === result.reason){ o.res = k; break; } } }
        if(o.res == null && result.reason != null) o.res = "#"+result.reason;
        if(typeof result.text === "string") o.txt = result.text.length;
        if(typeof result.json === "string") o.pa = /PronunciationAssessment/.test(result.json);
      }
      if(ex){ o.detail = "تقييم: "+String((ex && (ex.message || ex)) || "").slice(0, 200); }
      if(result && RR){
        if(result.reason === RR.NoMatch){
          o.reason = "nomatch";
          try{ var nd = SDK.NoMatchDetails.fromResult(result); o.code = String(nd.reason); }catch(e){}
          return o;
        }
        if(result.reason === RR.Canceled){
          o.reason = "canceled";
          try{
            var c = SDK.CancellationDetails.fromResult(result);
            /* اسم الرمز أنفع من رقمه: Forbidden أوضح من 8 */
            var names = SDK.CancellationErrorCode || {};
            var ec = c.ErrorCode != null ? c.ErrorCode : c.errorCode;
            o.code = (typeof ec === "number" && names[ec]) ? String(names[ec]) : (ec != null ? String(ec) : null);
            o.detail = String(c.errorDetails || "").slice(0, 300);
          }catch(e){}
          return o;
        }
      }
    }catch(e){}
    if(err){ o.reason = "error"; o.detail = String((err && (err.message || err)) || "").slice(0, 300); return o; }
    /* سمعت أزور كلامًا ولم نحصل على تقييم: حالةٌ ثالثة لا صمتٌ ولا إلغاء،
       وكانت تُحفظ سببًا فارغًا فلا تدلّ على شيء. */
    if(o.reason == null && o.res) o.reason = "noassess";
    return o;
  }

  /* وصفُ الجهاز — مختصرٌ بلا ما يُعرّف بشخصٍ، إنّما ما يُفسّر عطلًا */
  function env(){
    var ua = navigator.userAgent || "";
    var ios = /iP(hone|od|ad)/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    var m = /OS (\d+)[_.](\d+)/.exec(ua);
    var br = /CriOS/.test(ua) ? "chrome-ios" : /FxiOS/.test(ua) ? "firefox-ios" :
             /EdgiOS/.test(ua) ? "edge-ios" : ios ? "safari" :
             /Edg\//.test(ua) ? "edge" : /Chrome/.test(ua) ? "chrome" :
             /Firefox/.test(ua) ? "firefox" : /Safari/.test(ua) ? "safari" : "other";
    return { ios:ios, osv:(m ? m[1]+"."+m[2] : null), br:br,
             inApp:inAppBrowser(), online:(navigator.onLine !== false) };
  }

  /* مغادرة الصفحة تُغلق المايك — لا يُترك مفتوحًا بعد انتهاء الدرس */
  try{
    g.addEventListener("pagehide", release);
    g.addEventListener("beforeunload", release);
  }catch(e){}

  g.MIC = { inAppBrowser:inAppBrowser, diagnose:diagnose, fail:fail, waitSDK:waitSDK,
            ensure:ensure, stream:stream, release:release, releaseSoon:releaseSoon,
            keep:keep, audioConfig:audioConfig, why:why, env:env };
})(window);
