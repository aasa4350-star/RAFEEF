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
  function enqueue(url, key, payload){
    var a = read(); a.push({ u:url, k:key, p:payload, t:Date.now() }); write(a);
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
      try{ if(onState) onState("pending"); }catch(e){}
      return send(url, key, payload).then(function(r){
        if(r && r.ok){ try{ if(onState) onState("ok"); }catch(e){} return true; }
        enqueue(url, key, payload); try{ if(onState) onState("queued"); }catch(e){} return false;
      }).catch(function(){
        enqueue(url, key, payload); try{ if(onState) onState("queued"); }catch(e){} return false;
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
