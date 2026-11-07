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

  window.GAT_QUANT = { CMP: CMP, CMP_AR: CMP_AR, CHART: CHART, CHART_AR: CHART_AR,
                       CMP_OPTS: CMP_OPTS };
})();
