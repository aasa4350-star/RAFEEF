/* ============================================================
   طابور المحاولات — لا تضيع نتيجةٌ بسبب انقطاع لحظيّ

   المشكلة قبل: كل صفحةٍ ترسل النتيجة بـ fetch داخل try/catch فارغ.
   فإن تعثّرت الشبكة لحظةَ الإرسال (والجوّال يتعثّر) ضاعت النتيجة نهائيًّا:
   لا إعادة محاولة، ولا نسخة محلّية، ولا إشعارٌ ظاهر. بلاغ الأب: حسن حلّ
   «اختبر نفسك» ولم يظهر اختباره، وظلّ التقرير يعرض اختبار أمس.

   الحلّ: أيّ إرسالٍ يفشل يُحفظ في التخزين المحلّي، ويُعاد إرساله تلقائيًّا
   عند أوّل فتحةٍ لأيّ صفحة، وعند عودة الاتصال.

   ملاحظة على الوقت: الصفّ الذي يُعاد إرساله غدًا يأخذ created_at الجديد
   من قاعدة البيانات، فنختم داخل meta.at وقتَ الجهاز الحقيقي ليُعرض بدله.
   ============================================================ */
(function(){
  var K = "attempts_queue_v1", MAX = 40;

  function read(){
    try{ var a = JSON.parse(localStorage.getItem(K) || "[]"); return Array.isArray(a) ? a : []; }
    catch(e){ return []; }
  }
  function write(a){
    try{ localStorage.setItem(K, JSON.stringify(a.slice(-MAX))); }catch(e){}
  }
  function enqueue(url, key, payload, id){
    var a = read(); a.push({ id:id, u:url, k:key, p:payload, t:Date.now() }); write(a);
  }
  /* بلاغ الأب (٣١ أغسطس ٢٠٢٦): رفيف شافت نتيجة قراءة القطعة والإملاء
     على الشاشة، لكنّها لم تصل التقرير إطلاقًا — لا نجاحًا ولا حتى في
     طابور الإعادة. والعلّة أنّ enqueue() كانت تُستدعى فقط من داخل
     then/catch لنتيجة fetch؛ فإن غادر الطفل الصفحة (سكّر التطبيق أو
     رجع للخلف بسرعة) بينما الطلب لا يزال في الطريق، قد يُقطَع الاتصال
     قبل أن يصل الوعد إلى then أو catch على الإطلاق — فلا يُسجَّل فشلًا
     ولا نجاحًا، ويضيع بصمتٍ تام رغم keepalive. حماية keepalive تحفظ
     الطلب من موت التبويب نفسه، لكنها لا تحفظ سطر الجافاسكربت الذي
     يُفترض أن يستجيب لنتيجته.

     فصرنا نكتب في التخزين المحلي أوّلًا (تفاؤلًا) قبل الإرسال أصلًا،
     لا بعد فشله؛ فإن قُطع كلّ شيء من نصف الطريق تبقى النسخة المحلية
     موجودة، وتُرسَل تلقائيًّا في أوّل فتحةٍ قادمة لأيّ صفحة. ونحذفها
     من الطابور فقط بعد تأكّد النجاح. */
  function removeById(id){
    if(id==null) return;
    var a = read().filter(function(it){ return it.id !== id; });
    write(a);
  }
  function send(url, key, payload){
    return fetch(url, {
      method:"POST", keepalive:true,
      headers:{ "apikey":key, "Authorization":"Bearer "+key,
                "Content-Type":"application/json", "Prefer":"return=minimal" },
      body: JSON.stringify(payload)
    });
  }
  function stamp(p, id){
    try{
      p.meta = p.meta || {};
      if(!p.meta.at) p.meta.at = new Date().toISOString();
      /* بصمةٌ فريدة لكل محاولة إرسال، تُحفظ داخل الصفّ نفسه — بها نعرف
         لاحقًا إن كان قد وصل فعلًا (انظر alreadyThere أدناه). */
      if(id && !p.meta.cid) p.meta.cid = id;
    }catch(e){}
    return p;
  }

  /* ═══ هل وصل هذا الصفّ فعلًا من قبل؟ ═══════════════════════════
     بلاغ الأب (٢ سبتمبر ٢٠٢٦): جلساتٌ مكرّرة في التقرير — فحصنا القاعدة
     فوجدنا ١٢ جلسةً مكرّرة عند الأبناء الأربعة (نفس meta.at بالضبط،
     وcreated_at مختلف)، أكثرها من «اختبر نفسك».

     السبب: الصفحات تحفظ عند pagehide/visibilitychange (وهو الصواب، لئلّا
     يضيع نصف اختبارٍ لم يُكمله الطفل). وهناك يُرسَل الطلب فعلًا — keepalive
     يضمن وصوله للخادم — لكنّ سياق الجافاسكربت يموت مع الصفحة قبل أن يصل
     ردّ fetch إلى then، فلا يُنفَّذ removeById، فيبقى الصفّ في الطابور
     المحلّي «كأنّه فشل»، ويُعاد إرساله في أوّل فتحةٍ قادمة لأيّ صفحة —
     فيتكرّر صفٌّ ناجحٌ أصلًا. عالجناه في talk.html وحدها بـ sendBeacon،
     لكنّ العلّة في الطابور نفسه فتصيب كلّ صفحةٍ تستعمله.

     فصار كلّ صفٍّ يحمل بصمته (meta.cid)، وقبل إعادة الإرسال نسأل القاعدة:
     أعندك صفٌّ بهذه البصمة؟ فإن كان، أسقطناه بلا إرسال. */
  function alreadyThere(it){
    var cid = it && it.p && it.p.meta && it.p.meta.cid;
    if(!cid) return Promise.resolve(false);   /* صفوفٌ من نسخةٍ أقدم بلا بصمة */
    return fetch(it.u + "?select=id&limit=1&meta-%3E%3Ecid=eq." + encodeURIComponent(cid),
      { headers:{ "apikey": it.k, "Authorization": "Bearer " + it.k } })
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(j){ return Array.isArray(j) && j.length > 0; })
      .catch(function(){ return false; });    /* تعذّر السؤال → نرسل كالمعتاد */
  }

  var AQ = {
    /* onState: "pending" ثم "ok" أو "queued" */
    post: function(url, key, payload, onState){
      var id = Date.now()+"_"+Math.random().toString(36).slice(2);
      stamp(payload, id);
      enqueue(url, key, payload, id);   /* نكتب أوّلًا، قبل أن نحاول الإرسال */
      try{ if(onState) onState("pending"); }catch(e){}
      var after = function(){ try{ if(AQ.nudge) AQ.nudge(); }catch(e){} };
      return send(url, key, payload).then(function(r){
        if(r && r.ok){ removeById(id); try{ if(onState) onState("ok"); }catch(e){} after(); return true; }
        try{ if(onState) onState("queued"); }catch(e){} after(); return false;
      }).catch(function(){
        try{ if(onState) onState("queued"); }catch(e){} after(); return false;
      });
    },
    pending: function(){ return read().length; },
    flush: function(){
      var a = read();
      if(!a.length) return Promise.resolve(0);
      write([]);                       /* نُفرغ أوّلًا ثم نُعيد ما فشل، فلا يتكرّر الصفّ */
      var left = [], done = 0;
      return a.reduce(function(chain, it){
        return chain.then(function(){
          /* لا نُعيد إرسال صفٍّ وصل فعلًا — وإلّا تكرّر (انظر alreadyThere) */
          return alreadyThere(it).then(function(dup){
            if(dup){ done++; return; }
            return send(it.u, it.k, it.p).then(function(r){
              if(r && r.ok) done++; else left.push(it);
            }).catch(function(){ left.push(it); });
          });
        });
      }, Promise.resolve()).then(function(){
        if(left.length) write(read().concat(left));
        return done;
      });
    }
  };
  window.AQ = AQ;

  /* ═══ لا ينتظر الطابور فتحةً قادمة ═══════════════════════════════
     بلاغ الأب (١٢ سبتمبر ٢٠٢٦): «عندك مشكلة في تحديث ستيب وتحصيلي
     وقدرات كمّي ولفظي وتقوية التفكير وإملاء إنجليزي — ما يطلع لي أنّهم
     اختبروا، خصوصًا حسن».

     وصفوف حسن تُصدّقه: حلّ الأربعة الساعة ١٩:٠٢–١٩:٠٤ ووصلت القاعدةَ
     ١٩:٢٢ جميعًا في الثانية نفسها — أي أنّها فشلت ساعةَ الحلّ فبقيت في
     طابور جهازه عشرين دقيقة، حتّى فتح صفحةً أخرى فانفلتت. ومن فتح
     التقرير في تلك العشرين رآه كأنّه لم يختبر. وهو اختبر.

     وكان الطابور لا يُعيد المحاولة إلّا عند تحميل صفحةٍ أو عودة اتّصال.
     فالطفل الذي يجلس في الصفحة نفسها ساعةً لا تُعاد محاولةٌ واحدة طوال
     جلوسه. فصرنا نُعيد المحاولة ما دام في الطابور شيء: بعد ١٥ ثانية،
     ثمّ ٣٠، ثمّ ٦٠، ثمّ كلّ دقيقتين — وعند رجوع الطفل إلى الصفحة.

     ونُري الطفلَ نفسَه ما لم يصل، فبيده أن يضغط «أرسلها الآن» وهو على
     شبكةٍ سليمة، بدل أن يكتشف أبوه غيابها بعد ساعة. */
  var STEPS = [15000, 30000, 60000, 120000], stepI = 0, timer = null, flushing = false;

  function badge(){
    var n = 0; try{ n = AQ.pending(); }catch(e){}
    var el = document.getElementById("__aqbadge");
    if(!n){ if(el) el.remove(); return; }
    if(!document.body) return;
    if(!el){
      el = document.createElement("div");
      el.id = "__aqbadge";
      el.setAttribute("style", "position:fixed;inset-inline-start:10px;bottom:10px;z-index:2147483640;"+
        "background:#b45309;color:#fff;border-radius:12px;padding:8px 12px;font:700 .82rem Tahoma,sans-serif;"+
        "direction:rtl;box-shadow:0 6px 18px rgba(0,0,0,.25);cursor:pointer;max-width:76vw");
      el.addEventListener("click", function(){ stepI = 0; tryFlush(); });
      document.body.appendChild(el);
    }
    el.innerHTML = "📥 " + n + " نتيجة ما وصلت بعد — اضغط لإرسالها";
  }

  function schedule(){
    if(timer) return;
    var n = 0; try{ n = AQ.pending(); }catch(e){}
    if(!n) return;
    var wait = STEPS[Math.min(stepI, STEPS.length - 1)];
    timer = setTimeout(function(){ timer = null; tryFlush(); }, wait);
  }
  function tryFlush(){
    if(flushing) return;
    flushing = true;
    var before = 0; try{ before = AQ.pending(); }catch(e){}
    var done = function(){
      flushing = false;
      var after = 0; try{ after = AQ.pending(); }catch(e){}
      /* نجح شيء ⇐ نعود لأقصر انتظار، وإلّا تباعدنا */
      if(after < before) stepI = 0; else stepI++;
      badge();
      if(after) schedule();
    };
    try{ AQ.flush().then(done, done); }catch(e){ done(); }
  }

  AQ.nudge = function(){ badge(); schedule(); };

  if(document.readyState === "complete") setTimeout(tryFlush, 800);
  else window.addEventListener("load", function(){ setTimeout(tryFlush, 800); });
  window.addEventListener("online", function(){ stepI = 0; tryFlush(); });
  document.addEventListener("visibilitychange", function(){
    if(!document.hidden){ stepI = 0; tryFlush(); }
  });
})();
