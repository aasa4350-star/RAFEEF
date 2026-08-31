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
  function stamp(p){
    try{ p.meta = p.meta || {}; if(!p.meta.at) p.meta.at = new Date().toISOString(); }catch(e){}
    return p;
  }

  var AQ = {
    /* onState: "pending" ثم "ok" أو "queued" */
    post: function(url, key, payload, onState){
      stamp(payload);
      var id = Date.now()+"_"+Math.random().toString(36).slice(2);
      enqueue(url, key, payload, id);   /* نكتب أوّلًا، قبل أن نحاول الإرسال */
      try{ if(onState) onState("pending"); }catch(e){}
      return send(url, key, payload).then(function(r){
        if(r && r.ok){ removeById(id); try{ if(onState) onState("ok"); }catch(e){} return true; }
        try{ if(onState) onState("queued"); }catch(e){} return false;
      }).catch(function(){
        try{ if(onState) onState("queued"); }catch(e){} return false;
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
          return send(it.u, it.k, it.p).then(function(r){
            if(r && r.ok) done++; else left.push(it);
          }).catch(function(){ left.push(it); });
        });
      }, Promise.resolve()).then(function(){
        if(left.length) write(read().concat(left));
        return done;
      });
    }
  };
  window.AQ = AQ;

  function tryFlush(){ try{ AQ.flush(); }catch(e){} }
  if(document.readyState === "complete") setTimeout(tryFlush, 800);
  else window.addEventListener("load", function(){ setTimeout(tryFlush, 800); });
  window.addEventListener("online", tryFlush);
})();
