/* ══════════════════════════════════════════════════════════════════
   قدرات — الكمّيّ: النمطان اللذان لم يكن لهما وجودٌ عندنا
   ══════════════════════════════════════════════════════════════════
   أرسل الأب ورقةَ قدراتٍ كمّيّةٍ (منصّة نبأ، ٣٠ سؤالًا مُجمَّعةً ومحلولة).
   وقِسنا أنماطَها على مولّداتِنا الستّةِ والثلاثين:

     حسابٌ وكسورٌ ونسب   ٦  — عندنا منها كثير ✔
     هندسة                ٧  — عندنا منها كثير ✔
     متوسّطاتٌ ووسيط      ٢  — عندنا ✔
     مسائلُ لفظيّة        ٣  — عندنا ✔
     أنماطٌ وقابليّةُ قسمة ٣  — عندنا ✔
     ── المقارنات         ٤ (١٣٪) — لا شيء
     ── قراءةُ الرسوم     ٥ (١٧٪) — لا شيء

   فثلاثون في المئةٍ من القسمِ الكمّيِّ نمطان لا تدريبَ عليهما عندنا، وهما
   أشدُّ ما يُربك من لم يرَهما: المقارنةُ تُختبَر فيها عادةٌ ذهنيّةٌ غيرُ
   الحساب — أن تسأل «هل تكفي المعطيات؟» — والرسمُ يُختبَر فيه استخراجُ
   العددِ من صورةٍ لا من نصّ.

   والمولّداتُ هنا تُولّد أرقامًا جديدةً كلَّ مرّةٍ كبقيّةِ البنك، ولا
   تُنسَخ أسئلةُ الورقةِ بنصِّها: الورقةُ أرتني النمطَ فبنيتُه.

   ⚠️ كلُّ مولّدٍ هنا يحسب جوابَه بنفسِه ثمّ يُقارن — ولا يُكتَب الجوابُ
   بيدٍ. وحارسُ checks/pages.js يُشغّل كلَّ مولّدٍ مئةَ مرّةٍ ويتحقّق من
   الجوابِ حسابًا مستقلًّا.

   الصيغة: [المتن، [الخيارات]، فهرسُ الصحيح، الشرح] — صيغةُ practice.html.
   ══════════════════════════════════════════════════════════════════ */
(function(){
  "use strict";
  function ri(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
  function gp(a){ return a[Math.floor(Math.random()*a.length)]; }
  function ar(n){ return String(n).replace(/-/g,"−"); }

  /* ═══ (١) المقارنات ═══════════════════════════════════════════════
     خياراتُها أربعةٌ ثابتةٌ في الاختبار، وترتيبُها ثابتٌ أيضًا — فلا
     تُخلَط، لأنّ ثباتَ موضعِها جزءٌ من تدريبِ العين عليها. */
  var CMP_OPTS = ["القيمة الأولى أكبر من الثانية",
                  "القيمة الثانية أكبر من الأولى",
                  "القيمتان متساويتان",
                  "المعطيات غير كافية"];
  var FIRST = 0, SECOND = 1, EQUAL = 2, NOTENOUGH = 3;

  /* ووسمُ fixed يمنع خلطَ الخيارات: ترتيبُ المقارناتِ ثابتٌ في الاختبارِ
     نفسِه (الأربعةُ على هذا الترتيبِ في أسئلةِ الورقةِ كلِّها)، وثباتُه
     جزءٌ من المهارة — تتعلّم العينُ موضعَ «المعطيات غير كافية». */
  function cmpQ(stem, idx, why){
    var q = [stem, CMP_OPTS.slice(), idx, why];
    q.fixed = true;
    return q;
  }
  /* يحكم بالحسابِ لا باليد: يُمرَّر العددان فيُستنتَج الفهرس */
  function cmpNum(stem, a, b, why){
    var i = (a > b) ? FIRST : (b > a) ? SECOND : EQUAL;
    return cmpQ(stem, i, why);
  }

  var CMP = [
    /* أكبرُ عددٍ أوّليٍّ في مدًى، مقابلَ عددٍ — نمطُ السؤالِ الأوّلِ في الورقة */
    function(){
      var lo = gp([30,40,50,60,70,80,90]), hi = lo + 14;
      var pr = [];
      for(var n = lo; n <= hi; n++){
        var isP = n > 1, d;
        for(d = 2; d*d <= n; d++) if(n % d === 0){ isP = false; break; }
        if(isP) pr.push(n);
      }
      var big = pr.length ? pr[pr.length-1] : lo;
      var other = big + gp([-3,-2,-1,0,1,2,3]);
      return cmpNum("القيمة الأولى: أكبر عدد أوّليّ من "+lo+" إلى "+hi+" · القيمة الثانية: "+other,
        big, other,
        "الأعدادُ الأوّليّةُ بين "+lo+" و"+hi+": "+(pr.join("، ")||"لا شيء")+" — فأكبرُها "+big+
        "، و"+other+" "+(big>other?"أصغرُ منه":(big<other?"أكبرُ منه":"يساويه"))+".");
    },
    /* حاصلُ ضربٍ مقابلَ حاصلِ ضرب */
    function(){
      var A = [ri(1,6), ri(2,7), ri(3,8), ri(4,9)];
      var B = [ri(5,9), ri(5,9), ri(5,9)];
      var pa = A.reduce(function(x,y){ return x*y; }, 1);
      var pb = B.reduce(function(x,y){ return x*y; }, 1);
      return cmpNum("القيمة الأولى: ("+A.join(" × ")+") · القيمة الثانية: ("+B.join(" × ")+")",
        pa, pb, "الأولى = "+pa+"، والثانية = "+pb+".");
    },
    /* مجموعٌ مقابلَ مجموع — يكثر فيه التساوي، وهو مقصود */
    function(){
      var a = ri(2,12), b = ri(2,12), c = ri(2,12);
      var d = gp([a+b-c, ri(2,24), a+b-c]);
      return cmpNum("القيمة الأولى: ("+a+" + "+b+") · القيمة الثانية: ("+c+" + "+d+")",
        a+b, c+d, "الأولى = "+(a+b)+"، والثانية = "+(c+d)+".");
    },
    /* كسرٌ مقابلَ كسر */
    function(){
      var a = ri(1,9), b = ri(2,9), c = ri(1,9), d = ri(2,9);
      var v1 = a/b, v2 = c/d;
      return cmpNum("القيمة الأولى: "+a+"/"+b+" · القيمة الثانية: "+c+"/"+d,
        v1, v2,
        "بتوحيدِ المقامات: "+(a*d)+"/"+(b*d)+" مقابل "+(c*b)+"/"+(b*d)+" — فنقارن البسطين "+(a*d)+" و"+(c*b)+".");
    },
    /* نسبةٌ مئويّةٌ من عددٍ مقابلَ نسبةٍ من آخر */
    function(){
      var p1 = gp([10,20,25,40,50,60,75]), n1 = gp([40,60,80,120,200]);
      var p2 = gp([10,20,25,40,50,60,75]), n2 = gp([40,60,80,120,200]);
      var v1 = p1*n1/100, v2 = p2*n2/100;
      return cmpNum("القيمة الأولى: "+p1+"٪ من "+n1+" · القيمة الثانية: "+p2+"٪ من "+n2,
        v1, v2, "الأولى = "+v1+"، والثانية = "+v2+".");
    },
    /* ═══ والمعطياتُ لا تكفي ═══════════════════════════════════════
       وهو الخيارُ الذي يُنسى: متغيّرٌ مجهولٌ في مدًى يحتمل الوجهين.
       ومن لم يتدرّب عليه يحسب بقيمةٍ واحدةٍ فيُخطئ وهو مطمئنّ. */
    function(){
      var lo = ri(1,6), hi = lo + ri(2,6);
      var k = ri(lo, hi);                       /* ثابتٌ داخلَ المدى */
      return cmpQ("إذا كان "+lo+" < س < "+hi+" · القيمة الأولى: س · القيمة الثانية: "+k,
        NOTENOUGH,
        "س تقع بين "+lo+" و"+hi+"، و"+k+" داخلَ هذا المدى — فقد تكون س أكبرَ منه أو أصغرَ أو تساويه. فالمعطياتُ لا تكفي.");
    },
    function(){
      var lo = ri(2,5), hi = lo + ri(2,5), k = hi + ri(1,4);
      return cmpQ("إذا كان "+lo+" < س < "+hi+" · القيمة الأولى: س · القيمة الثانية: "+k,
        SECOND,
        "أكبرُ ما تبلغه س دون "+hi+"، و"+k+" أكبرُ من "+hi+" — فالثانيةُ أكبرُ يقينًا. (ولا يُقال «غير كافية» إلّا إذا احتمل الوجهين.)");
    },
    /* مربّعُ عددٍ مجهولِ الإشارة — فخُّ المقارنات المشهور */
    function(){
      var k = ri(2,9);
      return cmpQ("إذا كانت س² = "+(k*k)+" · القيمة الأولى: س · القيمة الثانية: "+k,
        NOTENOUGH,
        "س² = "+(k*k)+" يعني س = "+k+" أو س = −"+k+". فإن كانت موجبةً تساوت القيمتان، وإن كانت سالبةً فالثانيةُ أكبر — فالمعطياتُ لا تكفي.");
    },
    /* خارجُ قسمةٍ مقابلَ عددٍ عشريّ — نمطُ السؤالِ الأخيرِ في الورقة */
    function(){
      var x = gp([4,6,8,9,12]), y = gp([8,12,16,16]), v = x/y;
      var k = gp([0.5, 0.75, 1, 1.25]);
      return cmpNum("إذا كانت س = "+x+" و ص = "+y+" · القيمة الأولى: (س ÷ ص) · القيمة الثانية: "+String(k).replace(".","٫"),
        v, k, "س ÷ ص = "+x+" ÷ "+y+" = "+String(v).replace(".","٫")+".");
    },
    /* محيطٌ مقابلَ مساحة — وحدتان مختلفتان فلا تُقارَنان عدديًّا إلّا كأعداد */
    function(){
      var s = ri(2,9);
      return cmpNum("مربّعٌ طولُ ضلعه "+s+" · القيمة الأولى: محيطه · القيمة الثانية: مساحته",
        4*s, s*s,
        "المحيط = ٤×"+s+" = "+(4*s)+"، والمساحة = "+s+"² = "+(s*s)+". (ويتساويان عند الضلع ٤.)");
    }
  ];
  var CMP_AR = ["مقارنة: أعداد أوّليّة","مقارنة: حاصل ضرب","مقارنة: مجموع","مقارنة: كسور",
                "مقارنة: نسب مئويّة","مقارنة: معطيات غير كافية","مقارنة: مدًى ومقدار",
                "مقارنة: مربّع مجهول الإشارة","مقارنة: خارج قسمة","مقارنة: محيط ومساحة"];

  /* ═══ (٢) قراءةُ الرسوم البيانية ═══════════════════════════════════
     الرسمُ يُبنى بـSVG بأرقامٍ جديدةٍ كلَّ مرّة، والسؤالُ يُشتَقُّ منه.
     ولا يُكتَب الجوابُ بيدٍ: يُحسَب من المصفوفةِ التي رُسمت منها. */
  function barSVG(labels, vals, unit){
    var W = 320, H = 150, pad = 26, n = vals.length;
    var max = Math.max.apply(null, vals) || 1;
    var bw = (W - pad*2) / n * 0.62, gap = (W - pad*2) / n;
    var bars = "", i;
    for(i = 0; i < n; i++){
      var h = Math.round((H - pad*2) * vals[i] / max);
      var x = pad + gap*i + (gap - bw)/2, y = H - pad - h;
      bars += '<rect x="'+x.toFixed(1)+'" y="'+y+'" width="'+bw.toFixed(1)+'" height="'+h+'" rx="3" fill="currentColor" opacity=".78"></rect>'+
              '<text x="'+(x+bw/2).toFixed(1)+'" y="'+(y-4)+'" font-size="10" text-anchor="middle" fill="currentColor">'+vals[i]+'</text>'+
              '<text x="'+(x+bw/2).toFixed(1)+'" y="'+(H-pad+13)+'" font-size="10" text-anchor="middle" fill="currentColor" opacity=".75">'+labels[i]+'</text>';
    }
    return '<svg viewBox="0 0 '+W+' '+H+'" width="100%" style="max-width:360px;display:block;margin:8px auto" role="img" aria-label="رسم بياني بالأعمدة">'+
           '<line x1="'+pad+'" y1="'+(H-pad)+'" x2="'+(W-pad)+'" y2="'+(H-pad)+'" stroke="currentColor" stroke-width="1" opacity=".45"></line>'+
           bars+'<text x="'+pad+'" y="14" font-size="10" fill="currentColor" opacity=".75">'+unit+'</text></svg>';
  }
  function years(n){ var y0 = gp([2015,2016,2017,2018]); var a = []; for(var i=0;i<n;i++) a.push(String(y0+i)); return a; }
  function distinct(n, lo, hi){
    var a = [], guard = 0;
    while(a.length < n && guard++ < 400){ var v = ri(lo,hi); if(a.indexOf(v) < 0) a.push(v); }
    while(a.length < n) a.push(hi + a.length);
    return a;
  }

  var CHART = [
    /* أعلى قيمة */
    function(){
      var L = years(5), V = distinct(5, 20, 95);
      var mx = Math.max.apply(null, V), k = V.indexOf(mx);
      var o = L.slice(); /* الخياراتُ سنواتٌ أربعٌ منها الصحيحة */
      var pick = [L[k]];
      while(pick.length < 4){ var c = gp(L); if(pick.indexOf(c) < 0) pick.push(c); }
      for(var i=pick.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=pick[i]; pick[i]=pick[j]; pick[j]=t; }
      return [barSVG(L, V, "المبيعات (بالألف)")+"في أيّ سنةٍ كانت المبيعاتُ الأعلى؟",
        pick, pick.indexOf(L[k]),
        "أعلى عمودٍ هو "+L[k]+" بقيمة "+mx+"."];
    },
    /* الفرقُ بين سنتين */
    function(){
      var L = years(4), V = distinct(4, 15, 90);
      var i1 = ri(0,3), i2 = (i1 + 1 + ri(0,2)) % 4;
      var d = Math.abs(V[i1] - V[i2]);
      var ds = [d+ri(2,9), Math.abs(d-ri(2,9)), V[i1]+V[i2]];
      var o = [d]; ds.forEach(function(x){ if(o.indexOf(x)<0 && o.length<4) o.push(x); });
      var g=1; while(o.length<4){ if(o.indexOf(d+g)<0) o.push(d+g); g++; }
      for(var i=o.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=o[i]; o[i]=o[j]; o[j]=t; }
      return [barSVG(L, V, "المبيعات (بالألف)")+"ما الفرقُ بين مبيعات "+L[i1]+" ومبيعات "+L[i2]+"؟",
        o.map(ar), o.indexOf(d),
        "|"+V[i1]+" − "+V[i2]+"| = "+d+"."];
    },
    /* المجموع */
    function(){
      var L = ["الأحد","الاثنين","الثلاثاء","الأربعاء"], V = distinct(4, 10, 60);
      var s = V.reduce(function(a,b){ return a+b; }, 0);
      var o = [s, s+ri(3,12), s-ri(3,12), Math.round(s/2)];
      var u = []; o.forEach(function(x){ if(u.indexOf(x)<0) u.push(x); });
      var g=1; while(u.length<4){ if(u.indexOf(s+g)<0) u.push(s+g); g++; }
      u = u.slice(0,4);
      for(var i=u.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=u[i]; u[i]=u[j]; u[j]=t; }
      return [barSVG(L, V, "عدد الزوّار")+"كم مجموعُ الزوّار في الأيّام الأربعة؟",
        u.map(ar), u.indexOf(s),
        V.join(" + ")+" = "+s+"."];
    },
    /* المتوسّط */
    function(){
      var L = years(4), base = ri(10,40), V = [base, base+ri(2,20), base+ri(2,20), base+ri(2,20)];
      var s = V.reduce(function(a,b){ return a+b; }, 0);
      while(s % 4 !== 0){ V[3] += 1; s += 1; }
      var av = s/4;
      var o = [av, av+ri(2,8), av-ri(2,8), s];
      var u = []; o.forEach(function(x){ if(u.indexOf(x)<0) u.push(x); });
      var g=1; while(u.length<4){ if(u.indexOf(av+g)<0) u.push(av+g); g++; }
      u = u.slice(0,4);
      for(var i=u.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=u[i]; u[i]=u[j]; u[j]=t; }
      return [barSVG(L, V, "الإنتاج (طنّ)")+"ما متوسّطُ الإنتاج في السنوات الأربع؟",
        u.map(ar), u.indexOf(av),
        "المجموع "+s+" ÷ ٤ = "+av+"."];
    },
    /* الثباتُ: أيُّ البنودِ أقلُّ تغيّرًا — نمطُ «الأكثر ثباتًا» في الورقة */
    function(){
      var items = ["الطابعات","الجوّالات","الحواسيب","الملحقات"];
      var L = years(4);
      var steady = ri(0,3);
      var rows = [], i, j;
      for(i = 0; i < 4; i++){
        var b = ri(20,70), r = [];
        for(j = 0; j < 4; j++) r.push(i === steady ? b + ri(-1,1) : b + ri(-18,18));
        rows.push(r);
      }
      var spread = rows.map(function(r){ return Math.max.apply(null,r) - Math.min.apply(null,r); });
      var k = spread.indexOf(Math.min.apply(null, spread));
      var tbl = '<table style="width:100%;border-collapse:collapse;margin:8px 0;font-size:.88rem"><tr><th style="text-align:start;padding:3px 6px"></th>'+
        L.map(function(y){ return '<th style="padding:3px 6px;font-weight:700">'+y+'</th>'; }).join("")+'</tr>'+
        rows.map(function(r,ix){ return '<tr><td style="padding:3px 6px;font-weight:700">'+items[ix]+'</td>'+
          r.map(function(v){ return '<td style="padding:3px 6px;text-align:center">'+v+'</td>'; }).join("")+'</tr>'; }).join("")+'</table>';
      var pick = [items[k]];
      while(pick.length < 4){ var c = gp(items); if(pick.indexOf(c) < 0) pick.push(c); }
      for(i=pick.length-1;i>0;i--){ var jj=Math.floor(Math.random()*(i+1)); var t=pick[i]; pick[i]=pick[jj]; pick[jj]=t; }
      return [tbl+"من الجدول: ما المنتجُ الأكثرُ ثباتًا في المبيعات طوالَ المدّة؟",
        pick, pick.indexOf(items[k]),
        "الثباتُ أقلُّ فرقٍ بين الأعلى والأدنى: "+items[k]+" فرقُه "+spread[k]+"، وهو أقلُّ من "+
        items.filter(function(_,x){ return x!==k; }).map(function(nm,x){ var ix=items.indexOf(nm); return nm+" ("+spread[ix]+")"; }).join(" و")+"."];
    },
    /* المدّةُ التي لم تتغيّر فيها القيمة — نمطُ «الزيادة تساوي صفرًا» */
    function(){
      var n = 6, V = [ri(10,30)], i;
      var flat = ri(1, n-2);
      for(i = 1; i < n; i++) V.push(i === flat ? V[i-1] : V[i-1] + ri(5,25));
      var L = []; for(i = 0; i < n; i++) L.push(String(i+1));
      var right = flat + " – " + (flat+1);
      var pick = [right];
      while(pick.length < 4){
        var a = ri(1, n-1), c = a + " – " + (a+1);
        if(pick.indexOf(c) < 0) pick.push(c);
      }
      for(i=pick.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=pick[i]; pick[i]=pick[j]; pick[j]=t; }
      return [barSVG(L, V, "الكمّيّة المضافة (لتر) · المحور الأفقيّ: الساعة")+
        "من الرسم: في أيّ مدّةٍ كان مقدارُ الزيادةِ يساوي صفرًا؟",
        pick, pick.indexOf(right),
        "القيمةُ عند الساعة "+flat+" هي "+V[flat-1]+" وعند "+(flat+1)+" هي "+V[flat]+" — لم تتغيّر، فالزيادةُ صفر."];
    }
  ];
  var CHART_AR = ["رسم: أعلى قيمة","رسم: الفرق بين عمودين","رسم: المجموع",
                  "رسم: المتوسّط","جدول: الأكثر ثباتًا","رسم: الزيادة صفر"];

  /* ═══ (٣) المسائلُ المركّبة ═══════════════════════════════════════
     قرارُ الأب (١٤ نوفمبر ٢٠٢٦) بعد قياسِ القسمِ الكمّيّ: وسيطُ نصِّ
     السؤالِ ثماني كلمات، وأكثرُ قوالبِه «مستطيلٌ طولُه كذا، ما مساحتُه؟»
     — خطوةٌ واحدةٌ من حسابِ الابتدائيّة. والاختبارُ يقيس الاستدلالَ لا
     تذكّرَ قانون.

     فهذه مسائلُ لا تُحَلُّ بخطوة، وفي خياراتِ كلِّ واحدةٍ **الجوابُ
     البديهيُّ الخاطئ** مقصودًا — وهو ما يُسقط من حسب بلا فهم.

     ولكلِّ مولّدٍ مستواه في MULTI_LV: ٢ لمن في المتوسّط، و٣ لمستوى
     الاختبارِ الحقيقيّ. ويأخذ الابنُ مستواه وما دونه. */
  function opt4(correct, ds){
    var o = [correct];
    (ds||[]).forEach(function(d){ if(o.indexOf(d) < 0 && o.length < 4) o.push(d); });
    var p = 1;
    while(o.length < 4){
      var c = (typeof correct === "number") ? correct + p : String(correct) + "*";
      if(o.indexOf(c) < 0) o.push(c);
      p++; if(p > 40) break;
    }
    return o.map(ar);
  }
  var MULTI = [
    /* خصمان متتاليان: المصيدةُ جمعُ النسبتين */
    function(){
      var P, a, b, mid, fin, naive, g = 0;
      do { P = gp([200,400,500,800,1000]); a = gp([10,20,25,50]); b = gp([10,20,50]);
           mid = P*(100-a)/100; fin = mid*(100-b)/100; naive = P*(100-a-b)/100; g++; }
      while((Math.round(fin) !== fin || a + b >= 100) && g < 200);
      if(Math.round(fin) !== fin){ P=1000; a=20; b=10; mid=800; fin=720; naive=700; }
      return ["سعرُ سلعةٍ "+P+" ريالًا. خُصم منها "+a+"% ثمّ خُصم "+b+"% من السعرِ الجديد. كم سعرُها الآن؟",
        opt4(fin, [naive, mid, P*(100-b)/100]), 0,
        "الخصمُ الثاني من "+mid+" لا من "+P+": "+mid+" − "+(mid*b/100)+" = "+fin+
        " ريالًا. والمصيدةُ جمعُ النسبتين ("+(a+b)+"%) فتعطي "+naive+"."];
    },
    /* نسبةٌ عكسيّة: السعرُ قبل الخصم */
    function(){
      var d = gp([10,20,25,40,50]), after = gp([120,150,180,240,300,360]);
      var before = after*100/(100-d);
      if(Math.round(before) !== before){ d = 20; after = 240; before = 300; }
      return ["بعد خصمِ "+d+"% صار سعرُ سلعةٍ "+after+" ريالًا. كم كان سعرُها قبل الخصم؟",
        opt4(before, [2*before - after, after + d, before - d]), 0,
        "المدفوعُ "+(100-d)+"% من الأصل، فالأصل = "+after+" ÷ "+((100-d)/100)+" = "+before+
        " ريالًا. والمصيدةُ أن تزيد "+d+"% على "+after+"."];
    },
    /* تناسبٌ عكسيّ: عمّالٌ وأيّام */
    function(){
      var m1 = gp([3,4,6]), d1 = gp([8,12,24]), m2 = gp([2,6,8,12]);
      if(m2 === m1) m2 = m1 + 2;
      var work = m1*d1, d2 = work/m2;
      if(Math.round(d2) !== d2){ m1=3; d1=8; m2=4; work=24; d2=6; }
      return [m1+" عمّالٍ يُنجزون عملًا في "+d1+" يومًا. كم يومًا يحتاج "+m2+" عمّالٍ لإنجازِ العملِ نفسِه؟",
        opt4(d2, [d1 + (m2 - m1), d1, work]), 0,
        "العملُ ثابت = "+m1+" × "+d1+" = "+work+" يومَ عامل، فالزمن = "+work+" ÷ "+m2+" = "+d2+
        " يومًا. والتناسبُ عكسيّ: كلّما زاد العمّالُ قلّت الأيّام."];
    },
    /* متوسّطٌ مرجّح */
    function(){
      var n1, n2, m1, m2, T, tot, avg, g = 0;
      do { n1 = gp([10,15,20,25,30]); n2 = gp([5,10,15,20]);
           m1 = gp([50,60,70,80,90]); m2 = gp([50,60,70,80,90]);
           T = n1+n2; tot = n1*m1 + n2*m2; avg = tot/T; g++; }
      while((n1 === n2 || m1 === m2 || tot % T !== 0) && g < 300);
      if(n1 === n2 || m1 === m2 || tot % T !== 0){ n1=20;n2=10;m1=90;m2=60;T=30;tot=2400;avg=80; }
      return ["في فصلٍ "+n1+" طالبًا متوسّطُ درجاتهم "+m1+"، وفي آخرَ "+n2+" طالبًا متوسّطُهم "+m2+
        ". ما متوسّطُ درجاتِ الطلّابِ جميعًا؟",
        opt4(avg, [(m1+m2)/2, m1, m2]), 0,
        "المجموع = ("+n1+"×"+m1+") + ("+n2+"×"+m2+") = "+tot+"، والعدد = "+T+"، فالمتوسّط = "+avg+
        ". والمصيدةُ متوسّطُ المتوسّطين ("+((m1+m2)/2)+") وهو لا يصحّ لاختلافِ العددين."];
    },
    /* سحبُ عنصرٍ من متوسّط */
    function(){
      var n, A, d, B, out, g = 0;
      do { n = gp([5,6,8,10]); A = gp([60,70,75,80]); d = gp([-4,-3,-2,2,3,5]);
           B = A + d; out = n*A - (n-1)*B; g++; }
      while((out < 0 || out > 100 || out === B || out === A) && g < 300);
      if(out < 0 || out > 100){ n=6; A=80; B=82; out=70; }
      return ["متوسّطُ درجاتِ "+n+" طلّابٍ "+A+". خرج طالبٌ فصار متوسّطُ الباقين "+B+
        ". كم درجةُ الطالبِ الذي خرج؟",
        opt4(out, [A + (A-B), B, A]), 0,
        "مجموعُ الـ"+n+" = "+(n*A)+"، ومجموعُ الباقين = "+((n-1)*B)+"، والفرقُ "+out+
        ". والمتوسّطاتُ لا تُطرَح من بعضها."];
    },
    /* تقسيمُ مبلغٍ بنسبة */
    function(){
      var a = gp([2,3,4,5]), b = gp([3,5,7]), k = ri(3,9);
      if(a === b) b = a + 2;
      var T = (a+b)*k, big = Math.max(a,b)*k, diff = Math.abs(a-b)*k;
      return ["قُسِّم مبلغٌ قدرُه "+T+" ريالًا بين شخصَين بنسبة "+a+":"+b+
        ". كم نصيبُ صاحبِ النصيبِ الأكبر؟",
        opt4(big, [Math.min(a,b)*k, diff, T]), 0,
        "مجموعُ الأجزاء = "+(a+b)+"، والحصّة = "+T+" ÷ "+(a+b)+" = "+k+
        "، فالأكبر = "+Math.max(a,b)+" × "+k+" = "+big+" ريالًا."];
    },
    /* ذهابٌ وإيابٌ بسرعتَين: المصيدةُ المتوسّطُ الحسابيّ */
    function(){
      /* أزواجٌ متوسّطُها التوافقيُّ صحيحٌ ومجموعُها زوجيّ — فالمصيدةُ
         (المتوسّطُ الحسابيّ) تظهر عددًا صحيحًا كالجوابِ تمامًا */
      var pr = gp([[30,60],[40,60],[20,30],[60,120],[20,60],[30,70],[40,120],[80,120]]);
      var v1 = pr[0], v2 = pr[1];
      var dist = gp([60,120,180]);
      var t = dist/v1 + dist/v2, avg = 2*dist/t;
      if(Math.round(avg) !== avg){ v1=30; v2=60; dist=60; t=3; avg=40; }
      return ["قطع سائقٌ المسافةَ ذهابًا بسرعةِ "+v1+" كم/س وعاد بالطريقِ نفسِه بسرعةِ "+v2+
        " كم/س. ما متوسّطُ سرعتِه في الرحلةِ كلِّها؟",
        opt4(avg, [(v1+v2)/2, v2, v1]), 0,
        "المتوسّطُ = المسافةُ الكلّيّة ÷ الزمنِ الكلّيّ = "+avg+
        " كم/س. والمصيدةُ ("+v1+"+"+v2+")÷2 = "+((v1+v2)/2)+" — ولا تصحّ لأنّ زمنَ البطيءِ أطول."];
    },
    /* مساحةٌ متبقّية */
    function(){
      var L = gp([12,16,20,24]), W = gp([8,10,12]), s = gp([2,4,6]);
      if(s >= W) s = 2;
      var rest = L*W - s*s;
      return ["حديقةٌ مستطيلةٌ طولُها "+L+" م وعرضُها "+W+" م، فيها مسبحٌ مربّعٌ ضلعُه "+s+
        " م. كم مساحةُ الجزءِ المزروعِ من الحديقة؟",
        opt4(rest, [L*W, s*s, L*W + s*s]), 0,
        "مساحةُ الحديقة = "+(L*W)+" م²، ومساحةُ المسبح = "+(s*s)+" م²، والمزروع = الفرق = "+rest+" م²."];
    },
    /* احتمالٌ بسيط */
    function(){
      var r = gp([3,4,5,6]), b = gp([2,3,5,7]), w = gp([1,2,3]);
      var tot = r+b+w, g2 = gcd(r, tot);
      return ["كيسٌ فيه "+r+" كراتٍ حمراءَ و"+b+" زرقاءَ و"+w+" بيضاء. سُحبت كرةٌ عشوائيًّا، "+
        "ما احتمالُ أن تكون حمراء؟",
        opt4(ar(r/g2)+"/"+ar(tot/g2), [r+"/"+(b+w), (b+w)+"/"+tot, "1/"+tot]), 0,
        "الاحتمال = عددُ الحمراء ÷ مجموعِ الكرات = "+r+"/"+tot+
        (g2>1 ? " = "+(r/g2)+"/"+(tot/g2) : "")+". والمقامُ هو الكلُّ لا الباقي."];
    },
    /* الحدُّ النونيّ لمتتابعة */
    function(){
      var a1 = ri(2,9), d = gp([3,4,5,6,7]), n = gp([10,12,15,20]);
      var an = a1 + (n-1)*d;
      return ["في متتابعةٍ حدُّها الأوّل "+a1+" والفرقُ بين كلِّ حدَّين "+d+
        ". ما الحدُّ الـ"+n+"؟",
        opt4(an, [a1 + n*d, a1*n, a1 + d*(n+1)]), 0,
        "الحدُّ الـن = الأوّل + (ن−1)×الفرق = "+a1+" + "+(n-1)+"×"+d+" = "+an+
        ". والمصيدةُ ضربُ ن في الفرقِ بلا نقصِ واحد."];
    },
    /* زوايا مثلّثٍ بعلاقة */
    function(){
      var k, c, x, g = 0;
      do { k = gp([2,3]); c = gp([10,20,30,40]); x = (180-c)/(k+2); g++; }
      while((Math.round(x) !== x || x <= 0) && g < 200);
      if(Math.round(x) !== x){ k=3; c=30; x=30; }
      var big = Math.max(x, k*x, x+c);
      return ["في مثلّثٍ: الزاويةُ الثانيةُ "+(k===2?"ضِعفُ":"ثلاثةُ أضعافِ")+" الأولى، والثالثةُ تزيد "+
        c+"° على الأولى. ما قياسُ أكبرِ زواياه؟",
        opt4(big, [x, k*x === big ? x+c : k*x, 180-big]), 0,
        "س + "+k+"س + (س+"+c+") = 180 ⇐ س = "+x+"°، فالزوايا "+x+"° و"+(k*x)+"° و"+(x+c)+
        "°، وأكبرُها "+big+"°. والمصيدةُ أن تقف عند س."];
    },
    /* نسبةٌ من نسبة */
    function(){
      var tot = gp([200,300,400,600]), p1 = gp([40,50,60,75]), p2 = gp([20,25,50]);
      var a = tot*p1/100, b = a*p2/100;
      if(Math.round(b) !== b){ tot=400; p1=50; p2=25; a=200; b=50; }
      return ["في مدرسةٍ "+tot+" طالبًا، "+p1+"% منهم في المرحلةِ المتوسّطة، و"+p2+
        "% من هؤلاءِ يشتركون في النادي. كم عددُ المشتركين؟",
        opt4(b, [tot*p2/100, a, tot*(p1+p2)/100]), 0,
        "المتوسّطة = "+p1+"% من "+tot+" = "+a+"، والمشتركون = "+p2+"% من "+a+" = "+b+
        ". والمصيدةُ أخذُ "+p2+"% من "+tot+" مباشرةً."];
    }
  ];
  var MULTI_AR = ["مركّبة: خصمان متتاليان","مركّبة: السعر قبل الخصم","مركّبة: تناسب عكسيّ",
                  "مركّبة: متوسّط مرجّح","مركّبة: سحب عنصر من متوسّط","مركّبة: تقسيم بنسبة",
                  "مركّبة: متوسّط سرعة","مركّبة: مساحة متبقّية","مركّبة: احتمال",
                  "مركّبة: الحدّ النونيّ","مركّبة: زوايا مثلّث","مركّبة: نسبة من نسبة"];
  /* المستوى: ٢ لمن في المتوسّط، ٣ لمستوى الاختبارِ الحقيقيّ */
  var MULTI_LV = [3,3,2,2,2,2,3,2,2,2,3,3];
  function gcd(x,y){ return y ? gcd(y, x%y) : x; }

  window.GAT_QUANT = { CMP: CMP, CMP_AR: CMP_AR, CHART: CHART, CHART_AR: CHART_AR,
                       MULTI: MULTI, MULTI_AR: MULTI_AR, MULTI_LV: MULTI_LV,
                       CMP_OPTS: CMP_OPTS };
})();
