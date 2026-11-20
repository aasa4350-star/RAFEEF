/* ══════════════════════════════════════════════════════════════════
   عدّادُ العرض: لا يُعرَض سؤالٌ أكثرَ من مرّتَين
   ══════════════════════════════════════════════════════════════════
   طلبُ الأب (٢٠ نوفمبر ٢٠٢٦): «ما أبي التكرار يزيد عن مرّتين — في
   القواعد أو المقروء أو المسموع وحتى التحصيلي».

   وقِيس عند فهدٍ قبل هذا (١١٢ جلسةَ ستيب):
     التحليلُ الكتابيّ  ١٨ جذعًا   → ١٢٫٤ عرضًا للجذع
     فهمُ المقروء       ٣٢ قطعةً   → ١٠٫٥ عرضًا للقطعة
     فهمُ المسموع      ١٢٠ سؤالًا → ٢٫٢
     التراكيب          ٣٣١ سؤالًا → ١٫٤
   وفي القاعدةِ سؤالٌ أخطأ فيه تسعَ عشرةَ مرّةً — وهو عددُ مرّاتِ
   الخطأِ فقط، والعرضُ أكثر.

   وثلاثُ عللٍ لا واحدة:
     · stepReadItems بلا ذاكرةٍ البتّة — خلطٌ محضٌ في كلِّ جلسة.
     · وذاكرةُ التراكيب «var _shown = {}» تعيش في الصفحةِ وحدَها
       فتُمحى مع كلِّ فتحة — والصفحةُ تَعِدُه «ما يتكرّر عليك شي قبل
       ٣٣ جولة» وهو وعدٌ لا يُوفى.
     · وبركتان أرقُّ من أن تحتملا الحدَّ أصلًا.

   فهذا العدّادُ يحفظ لكلِّ سؤالٍ كم مرّةً عُرِض، في الجهازِ وفي
   الخادمِ معًا — فلا يضيع بتبديلِ جهازٍ ولا بتفريغِ ذاكرة. وما بلغ
   الحدَّ يخرج من السحبِ حتى تنفد البركةُ كلُّها، فتُفتَح دورةٌ جديدةٌ
   ويُقال له ذلك صراحةً لا يُكرَّر عليه في صمت.

   والمفتاحُ من نصِّ السؤالِ بعد تجريدِه من الوسومِ والمسافات — فسؤالٌ
   مولَّدٌ بأرقامٍ مختلفةٍ سؤالٌ آخرُ بحقّ، وسؤالٌ بالنصِّ نفسِه هو هو
   وإن خُلطت خياراتُه.
   ══════════════════════════════════════════════════════════════════ */
(function(){
  "use strict";
  var CAP = 2;
  var who = "", LS = "", counts = {}, pids = {};

  function h32(s){
    var h = 2166136261, i;
    for(i=0;i<s.length;i++){ h ^= s.charCodeAt(i); h = (h * 16777619) >>> 0; }
    return (h >>> 0).toString(36);
  }
  /* ═══ المفتاحُ يُميّز السؤالَ لا جذعَه وحدَه ═══════════════════════
     ⚠️ وقعتُ في هذا: كان المفتاحُ من نصِّ الجذعِ فقط، ومولّداتُ
     التحليلِ الكتابيِّ جذعُها واحدٌ لكلِّ مولّد («أيُّ ما يلي جملةٌ
     تامّة؟») والمتغيّرُ خياراتُها. فظهر البنكُ ثمانيةَ عشرَ سؤالًا وهو
     تسعةٌ وسبعون — وخرج الجذعُ سبعَ مرّاتٍ في عشرين جولةً والحدُّ
     عرضان، فحسبتُ البنكَ رقيقًا وهو ليس كذلك.

     فالمفتاحُ الآن بهذا الترتيب:
       · معرّفُ البندِ الصريحُ إن وُجِد (العنصرُ الخامس: "w3f:…")،
         وهذه المولّداتُ تحمله أصلًا ولم يُستعمَل.
       · وإلّا الجذعُ مع خياراتِه مرتَّبةً — فخلطُ الخياراتِ لا يُغيّر
         المفتاح، واختلافُ الخياراتِ يُغيّره.
       · وإلّا الجذعُ وحدَه (نصٌّ مفرَد). */
  function nrm(x){
    return String(x == null ? "" : x)
      .replace(/<[^>]*>/g, " ")
      .replace(/[\u064B-\u0652\u0670]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
  function keyOf(q){
    if(q && typeof q === "object" && typeof q.length === "number"){
      if(typeof q[4] === "string" && q[4]) return h32("id:" + nrm(q[4]));
      var opts = (q[1] && q[1].length) ? q[1].map(nrm).slice().sort().join("|") : "";
      return h32(nrm(q[0]) + "\u0000" + opts);
    }
    return h32(nrm(q));
  }

  function load(){
    try{
      var o = JSON.parse(localStorage.getItem(LS) || "{}");
      counts = o.c || {};
      pids   = o.p || {};
    }catch(e){ counts = {}; pids = {}; }
  }
  function save(){
    try{ localStorage.setItem(LS, JSON.stringify({ c:counts, p:pids })); }catch(e){}
  }

  /* صفوفُ الخادم: لكلِّ جلسةٍ مفاتيحُ ما عُرِض فيها ومعرّفُها. ولا
     تُحسَب جلسةٌ مرّتَين — المعرّفُ هو الفاصل. */
  function merge(rows){
    var n = 0;
    (rows || []).forEach(function(r){
      var m = (r && r.meta) || {};
      var id = m.pid || m.cid;
      if(!id || pids[id]) return;
      var ks = m.seenKeys;
      if(!ks || !ks.length) return;
      pids[id] = 1;
      ks.forEach(function(k){ counts[k] = (counts[k] || 0) + 1; });
      n++;
    });
    if(n) save();
    return n;
  }

  function count(stem){ return counts[keyOf(stem)] || 0; }

  /* سحبٌ بالحدّ: الجديدُ أوّلًا، ثمّ ما عُرِض مرّةً، ولا يُمَسُّ ما بلغ
     الحدَّ إلّا إذا لم يبقَ غيرُه — وحينها تُفتَح دورةٌ جديدةٌ لهذه
     البركةِ وحدَها ويُردُّ reset:true ليُقال للطفل. */
  function pick(bank, n, stemOf){
    var get = stemOf || function(q){ return q; };
    var by = [[], [], []];                       /* ٠ مرّة · مرّة · بلغ الحدّ */
    (bank || []).forEach(function(q){
      var c = counts[keyOf(get(q))] || 0;
      by[c >= CAP ? 2 : c].push(q);
    });
    shuf(by[0]); shuf(by[1]); shuf(by[2]);
    var out = by[0].concat(by[1]).slice(0, n);
    var reset = false;
    if(out.length < n){
      /* نفدت البركةُ تحت الحدّ: تُصفَّر عدّاداتُها هي وحدَها */
      reset = true;
      (bank || []).forEach(function(q){ delete counts[keyOf(get(q))]; });
      save();
      var all = (bank || []).slice(); shuf(all);
      var have = {};
      out.forEach(function(q){ have[keyOf(get(q))] = 1; });
      for(var i=0; i<all.length && out.length<n; i++){
        if(!have[keyOf(get(all[i]))]) { out.push(all[i]); have[keyOf(get(all[i]))] = 1; }
      }
    }
    return { items: out, reset: reset };
  }

  /* مولَّدٌ لا بنك: نُعيد التوليدَ حتى نجد ما لم يبلغ الحدَّ */
  /* مولَّدٌ لا بنك: يُعاد التوليدُ حتى يُعثَر على ما لم يبلغ الحدّ.
     ⚠️ وإن نفد فضاءُ المولّدِ كلُّه رُدَّ **الأقلُّ عرضًا** لا أوّلُ ما
     وُلِّد: فأوّلُ ما يُولَّد قد يكون أكثرَها عرضًا، وقِيس على
     التحليلِ الكتابيِّ عند فهدٍ فخرج جذعٌ ستَّ مرّاتٍ في عشرين جولة.
     والردُّ بالأقلِّ يُسوّي الحملَ على فضاءٍ ضيّقٍ بدل أن يُثقِل واحدًا. */
  /* ⚠️ وعددُ المحاولاتِ مئةٌ وخمسون لا أربعون: فضاءُ المولّداتِ غيرُ
     متساوي التوزيع — مولّدٌ فيه أربعةُ بنودٍ وآخرُ فيه عشرون، فالنادرُ
     لا يُصادَف في أربعين. قِيس عند فهد: بأربعين خرج بندٌ سبعَ مرّاتٍ
     في ستّين جولةً والحدُّ عرضان. والنداءُ دالّةٌ خالصةٌ بلا شبكةٍ ولا
     قرص، فالمئةُ والخمسون لا تُكلِّف شيئًا يُحَسّ. */
  /* ⚠️ والردُّ بالأقلِّ عرضًا وحدَه خرقٌ للحدِّ في صمت: قِيس في
     المتصفّحِ مئةً وخمسين جلسةً فخرج فضاءُ التحليلِ الكتابيِّ أحدًا
     وثمانين بندًا وسِعتُه مئةٌ واثنان وستّون سحبًا، والسحبُ ثلاثُ مئةٍ
     — فبلغ البندُ أربعَ عرضاتٍ والحدُّ عرضان، ولا أحدَ يُخبِر الطفل.
     فإن نفد الفضاءُ كلُّه فُتِحت دورةٌ جديدةٌ لهذا الفضاءِ وحدَه:
     تُنسى مفاتيحُ ما وُلِّد في المحاولاتِ (والمحاولاتُ مئةٌ وخمسون
     تغطّي فضاءً بهذا الضيقِ تغطيةً تامّة)، ويُرفَع fresh.reset ليُقال
     له صراحةً — كما يفعل pick في البنوكِ المعدودة. */
  function fresh(gen, tries){
    var t = tries || 150, best = null, bestC = Infinity, space = {};
    fresh.reset = false;
    for(var i=0;i<t;i++){
      var x = null;
      try{ x = gen(); }catch(e){}
      if(!x) continue;
      var k = keyOf(x), c = counts[k] || 0;
      space[k] = 1;
      if(c < CAP) return x;
      if(c < bestC){ bestC = c; best = x; }
    }
    if(best){
      fresh.reset = true;
      for(var kk in space){ if(Object.prototype.hasOwnProperty.call(space, kk)) delete counts[kk]; }
      save();
    }
    return best;
  }

  function shuf(a){ for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)), t=a[i]; a[i]=a[j]; a[j]=t; } return a; }

  /* ما عُرِض في هذه الجلسة: يُعَدُّ مرّةً واحدةً لكلِّ مفتاحٍ ولو تكرّر
     في الجلسةِ نفسِها، ويُحفَظ مفاتيحُه ليُرسَل مع الصفّ. */
  var session = {}, sessionPid = null;
  function markShown(stems, pid){
    if(pid && pid !== sessionPid){ session = {}; sessionPid = pid; }
    (stems || []).forEach(function(s){
      var k = keyOf(s);
      if(session[k]) return;
      session[k] = 1;
      counts[k] = (counts[k] || 0) + 1;
    });
    if(pid) pids[pid] = 1;
    save();
  }
  function sessionKeys(){ return Object.keys(session).slice(0, 60); }
  function startSession(pid){ session = {}; sessionPid = pid || null; }

  function forget(q){ delete counts[keyOf(q)]; }

  window.SeenCap = {
    CAP: CAP, forget: forget,
    init: function(w){ who = String(w || ""); LS = "rafeef_seen_" + who; load(); },
    merge: merge, count: count, pick: pick, fresh: fresh,
    markShown: markShown, sessionKeys: sessionKeys, startSession: startSession,
    keyOf: keyOf,
    stats: function(){ var n=0, c2=0; for(var k in counts){ n++; if(counts[k]>=CAP) c2++; } return { keys:n, atCap:c2 }; }
  };
})();
