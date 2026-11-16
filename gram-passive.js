/* ════════════════════════════════════════════════════════════════════
   gram-passive.js — مولّداتُ المبني للمجهول (المضارعُ والماضي البسيطان)

   ═══ لماذا ═══
   طلبَ معلّمُ حسنٍ بحثًا عن «الاستعمال المبني للمجهول للماضي والحاضر»
   (١٦ نوفمبر ٢٠٢٦)، فكُتب البحثُ (bahth-passive.html). ثمّ قال الأب:
   يتدرّب عليه لا يقرؤه فقط.

   وفي قسمِ «قواعد مركّزة» بطاقةٌ للمبني للمجهول فيها عشرون سؤالًا —
   لكنّها ثابتةُ النصّ: يراها مرّةً فيحفظ مواضعَ الإجابات، ثمّ يراها
   ثانيةً فيُجيب من الذاكرةِ لا من القاعدة. وهي أيضًا موزّعةٌ على
   الأزمنةِ كلِّها (will be done · is being done · has been done · had
   been done) ووحدتُه الآن في زمنَين اثنين.

   فهذه اثنا عشرَ مولّدًا تُركّب جملةً جديدةً في كلِّ مرّةٍ من أفعالٍ
   وفاعلينَ وقرائنَ زمنيّةٍ تُختار عشوائيًّا — ولا تخرج عن المضارعِ
   البسيطِ والماضي البسيطِ إلّا حيث يكون الخروجُ هو المقصود (كمصيدةِ
   الفعلِ اللازم).

   ═══ شرطٌ في كلِّ مولّد ═══
   • أربعةُ خيارات، والصحيحُ أوّلُها (تُخلَط عند العرض).
   • كلُّ مشتّتٍ خطأٌ حقيقيٌّ يقع فيه الطلّاب: التصريفُ الثاني مكانَ
     الثالث، وis مكانَ was، وwas مع الجمع، والمعلومُ مكانَ المجهول.
   • وشرحٌ يذكر القاعدةَ لا الجوابَ فقط.
   • ولا يُكتَب تصريفٌ بيدٍ: كلُّها من جدولٍ واحدٍ في أعلى الملفّ،
     فإن أُضيف فعلٌ خطأً انكشف في مكانٍ واحد.
   ════════════════════════════════════════════════════════════════════ */
(function(){
  "use strict";
  function ri(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
  function gp(a){ return a[Math.floor(Math.random()*a.length)]; }
  var TAG = "<b>Grammar — Passive Voice:</b> ";

  /* [المصدر، الماضي، التصريف الثالث، مفعولٌ مفرد، مفعولٌ جمع، معناه] */
  var V = [
    ["write","wrote","written","the letter","the letters","يكتب",1],
    ["build","built","built","the bridge","the bridges","يبني",0],
    ["clean","cleaned","cleaned","the room","the rooms","ينظّف",1],
    ["send","sent","sent","the message","the messages","يرسل",1],
    ["break","broke","broken","the window","the windows","يكسر",0],
    ["paint","painted","painted","the wall","the walls","يدهن",1],
    ["repair","repaired","repaired","the car","the cars","يصلح",1],
    ["make","made","made","the chair","the chairs","يصنع",1],
    ["plant","planted","planted","the tree","the trees","يزرع",1],
    ["find","found","found","the key","the keys","يجد",0],
    ["teach","taught","taught","the lesson","the lessons","يعلّم",1],
    ["open","opened","opened","the door","the doors","يفتح",1],
    ["design","designed","designed","the mosque","the mosques","يصمّم",0],
    ["invent","invented","invented","the machine","the machines","يخترع",0],
    ["take","took","taken","the photo","the photos","يأخذ",1]
  ];
  var DOER = ["Ali","the workers","my father","the students","the engineer",
              "the teacher","the farmers","the company","Omar","the team"];
  var NOW  = ["every day","every Friday","every year","twice a week","every morning"];
  var PAST = ["yesterday","last week","two years ago","last month","in 1998","in 2005"];

  /* ═══ الفعلُ يناسب قرينتَه الزمنيّة ═══════════════════════════════
     «Is the mosque designed every morning?» صحيحةُ القاعدةِ سخيفةُ
     المعنى — والمسجدُ لا يُصمَّم كلَّ صباح. فالعادةُ المتكرّرةُ لا
     تُسند إلّا إلى فعلٍ يتكرّر (الخانةُ السابعةُ في الجدول)، أمّا
     الماضي المنتهي فيقبلها كلَّها. */
  var VH = V.filter(function(x){ return x[6]; });
  function v(past){ return (past === false) ? gp(VH) : gp(V); }

  /* ═══ أربعةُ خياراتٍ متمايزةٍ دائمًا ═══════════════════════════════
     في الإنجليزيّة أفعالٌ تصريفُها الثاني كالثالث (sent · built · made
     · found · taught)، فمشتّتُ «التصريفُ الثاني» يُطابق الجوابَ فيها
     فيصير الصحيحُ خيارين. كُشف في الفحصِ قبل النشرِ في أربعةِ مولّدات.
     فتُمرَّر مرشّحاتٌ أكثرُ من الحاجةِ ويُؤخَذ منها ما لا يُطابق. */
  function four(correct, cands){
    var o = [correct];
    (cands || []).forEach(function(c){ if(o.indexOf(c) < 0 && o.length < 4) o.push(c); });
    return o;
  }

  var GEN = [
    /* ١ · اختيارُ المساعدِ في الماضي — والمصيدةُ المضارع */
    function(){
      var a = v(), t = gp(PAST), plural = Math.random() < 0.5;
      var obj = plural ? a[4] : a[3], aux = plural ? "were" : "was";
      return [TAG + obj.charAt(0).toUpperCase() + obj.slice(1) + " ___ " + t + ".",
        [aux + " " + a[2], (plural?"was":"were") + " " + a[2], (plural?"are":"is") + " " + a[2], a[1]],
        0,
        "القرينةُ «" + t + "» تدلّ على الماضي، و«" + obj + "» " + (plural?"جمعٌ فيلزمه were":"مفردٌ فيلزمه was") +
        "، ثمّ التصريفُ الثالث " + a[2] + "."];
    },
    /* ٢ · اختيارُ المساعدِ في المضارع — والمصيدةُ الماضي */
    function(){
      var a = v(false), t = gp(NOW), plural = Math.random() < 0.5;
      var obj = plural ? a[4] : a[3], aux = plural ? "are" : "is";
      return [TAG + obj.charAt(0).toUpperCase() + obj.slice(1) + " ___ " + t + ".",
        [aux + " " + a[2], (plural?"is":"are") + " " + a[2], (plural?"were":"was") + " " + a[2], a[0] + "s"],
        0,
        "القرينةُ «" + t + "» عادةٌ متكرّرةٌ ⇐ مضارعٌ بسيط، و«" + obj + "» " +
        (plural?"جمعٌ فيلزمه are":"مفردٌ فيلزمه is") + " + " + a[2] + "."];
    },
    /* ٣ · التصريفُ الثالثُ وحدَه — والمصيدةُ الثاني */
    function(){
      var past = Math.random() < 0.5, a = v(past), obj = a[3], aux = past ? "was" : "is";
      return [TAG + obj.charAt(0).toUpperCase() + obj.slice(1) + " " + aux + " ___ by " + gp(DOER) + ".",
        four(a[2], [a[1], a[0], a[0] + "ing", "being " + a[2]]), 0,
        "بعد be يأتي التصريفُ الثالث (" + a[2] + ")، لا الثاني (" + a[1] + ") ولا المصدر."];
    },
    /* ٤ · تحويلٌ من المعلومِ إلى المجهول */
    function(){
      var a = v(), d = gp(DOER), t = gp(PAST);
      var sing = !/s$/.test(d) || d === "the company";
      var obj = a[3];
      var act = d.charAt(0).toUpperCase() + d.slice(1) + " " + a[1] + " " + obj + " " + t + ".";
      return [TAG + "اختر الجملةَ المجهولةَ الصحيحة: «" + act + "»",
        (function(){ var O = obj.charAt(0).toUpperCase() + obj.slice(1), tail = " by " + d + " " + t + ".";
          return four(O + " was " + a[2] + tail,
            [O + " is " + a[2] + tail, O + " were " + a[2] + tail,
             O + " was " + a[1] + tail, O + " was being " + a[2] + tail]); })(),
        0,
        "المفعولُ «" + obj + "» يصير فاعلًا، والزمنُ ماضٍ والفاعلُ الجديدُ مفردٌ ⇐ was + " + a[2] + "، ثمّ by " + d + "."];
    },
    /* ٥ · النفي */
    function(){
      var past = Math.random() < 0.5, a = v(past), obj = a[3];
      var ok = past ? "was not " + a[2] : "is not " + a[2];
      return [TAG + obj.charAt(0).toUpperCase() + obj.slice(1) + " ___ " + (past ? gp(PAST) : gp(NOW)) + ".",
        four(ok, [(past ? "did not " + a[2] : "does not " + a[2]),
                  (past ? "was not " + a[0] : "is not " + a[0]),
                  (past ? "not was " + a[2] : "not is " + a[2]),
                  (past ? "was not " + a[1] : "is not " + a[1])]),
        0,
        "النفيُ في المجهولِ يكون بـnot بعد be مباشرةً: " + ok + " — ولا يُستعمل did/does مع be."];
    },
    /* ٦ · السؤال */
    function(){
      var past = Math.random() < 0.5, a = v(past), plural = Math.random() < 0.5;
      var obj = plural ? a[4] : a[3];
      var ok = past ? (plural ? "Were" : "Was") : (plural ? "Are" : "Is");
      var bad1 = past ? (plural ? "Was" : "Were") : (plural ? "Is" : "Are");
      var bad2 = past ? "Did" : "Do";
      return [TAG + "___ " + obj + " " + a[2] + " " + (past ? gp(PAST) : gp(NOW)) + "?",
        [ok, bad1, bad2, "Has"], 0,
        "السؤالُ يبدأ بـbe بزمنِ الجملةِ وبحسبِ العدد ⇐ " + ok + "، ولا يُستعمل Did/Do مع التصريفِ الثالث."];
    },
    /* ٧ · اكتشافُ الخطأ */
    function(){
      var a = v(), d = gp(DOER);
      var wrong = gp([1,2]);
      var parts = wrong === 1
        ? ["The report", "<b>was wrote</b>", "by " + d, "last week"]
        : ["The letters", "<b>was sent</b>", "by " + d, "yesterday"];
      var why = wrong === 1
        ? "الصوابُ was written: بعد be تصريفٌ ثالثٌ لا ثانٍ."
        : "الصوابُ were sent: الفاعلُ «The letters» جمعٌ فيلزمه were.";
      return [TAG + "أيُّ جزءٍ فيه الخطأ؟ « " + parts.join(" / ") + " »",
        [parts[1].replace(/<\/?b>/g,""), parts[0], parts[2], parts[3]], 0, why];
    },
    /* ٨ · الفعلُ اللازمُ لا يُبنى للمجهول */
    function(){
      var bad = gp([["die","He died in 1990."],["arrive","The train arrived late."],
                    ["happen","The accident happened yesterday."],["go","They went to Makkah."]]);
      var a = v();
      return [TAG + "أيُّ الجملِ الآتيةِ <b>لا يصحّ</b> بناؤها للمجهول؟",
        [bad[1],
         "Ali " + a[1] + " " + a[3] + ".",
         "The workers " + a[1] + " " + a[4] + ".",
         "My father " + a[1] + " " + a[3] + "."],
        0,
        "«" + bad[0] + "» فعلٌ لازمٌ لا مفعولَ له، والمبنيُّ للمجهولِ يحتاج مفعولًا يصير فاعلًا."];
    },
    /* ٩ · متى يُحذف by */
    function(){
      var a = v(), t = gp(PAST);
      return [TAG + "«" + a[3].charAt(0).toUpperCase() + a[3].slice(1) + " was " + a[2] + " " + t +
        ".» لماذا لم يُذكر الفاعلُ بـby؟",
        ["لأنّ الفاعلَ مجهولٌ أو غيرُ مهمّ",
         "لأنّ الجملةَ في الماضي",
         "لأنّ الفعلَ غيرُ منتظم",
         "لأنّ الفاعلَ جمع"],
        0,
        "يُحذف by حين يكون الفاعلُ مجهولًا أو غيرَ مهمٍّ أو معروفًا بداهةً — وهو الأكثرُ في الاستعمال."];
    },
    /* ١٠ · القرينةُ الزمنيّةُ تحكم */
    function(){
      var past = Math.random() < 0.5, a = v(past);
      var t = past ? gp(PAST) : gp(NOW);
      var ok = past ? "was " + a[2] : "is " + a[2];
      var no = past ? "is " + a[2] : "was " + a[2];
      return [TAG + a[3].charAt(0).toUpperCase() + a[3].slice(1) + " ___ " + t + ".",
        [ok, no, "has " + a[2], a[0] + "s"], 0,
        "«" + t + "» " + (past ? "زمنٌ منتهٍ ⇐ was" : "عادةٌ متكرّرةٌ ⇐ is") + " + " + a[2] + "."];
    },
    /* ١١ · المعلومُ أم المجهول؟ */
    function(){
      var a = v(), d = gp(DOER), t = gp(PAST);
      var p = a[3].charAt(0).toUpperCase() + a[3].slice(1) + " was " + a[2] + " " + t + ".";
      var act = d.charAt(0).toUpperCase() + d.slice(1) + " " + a[1] + " " + a[3] + " " + t + ".";
      /* والجملتان في المتن لا في الخيارات: يقرؤهما ثمّ يحكم، ويتغيّر
         المتنُ بتغيّرِ الفعلِ فلا يصير السؤالُ واحدًا كلَّ مرّة. */
      var first = Math.random() < 0.5;
      var A = first ? p : act, B = first ? act : p;
      var okL = first ? "(أ)" : "(ب)", noL = first ? "(ب)" : "(أ)";
      return [TAG + "أيُّ الجملتَين مبنيّةٌ للمجهول، ولماذا؟<br>(أ) " + A + "<br>(ب) " + B,
        [okL + " — لأنّ فيها be + التصريفَ الثالث والفاعلُ محذوف",
         noL + " — لأنّ فيها فعلًا ماضيًا",
         noL + " — لأنّ فيها مفعولًا به",
         "كلتاهما مبنيّةٌ للمجهول"],
        0,
        "علامةُ المجهول: be + التصريفُ الثالث، والفاعلُ محذوفٌ أو بعد by. والجملةُ الأخرى معلومةٌ فاعلُها «" + d + "»."];
    },
    /* ١٢ · الجمعُ والمفردُ في جملةٍ واحدة */
    function(){
      var past = Math.random() < 0.5, a = v(past), b = v(past);
      if(b[0] === a[0]) b = (past ? V : VH)[((past?V:VH).indexOf(a)+3) % (past?V:VH).length];
      var aux1 = past ? "was" : "is", aux2 = past ? "were" : "are";
      return [TAG + a[3].charAt(0).toUpperCase() + a[3].slice(1) + " ___ and " + b[4] + " ___ " +
        (past ? gp(PAST) : gp(NOW)) + ".",
        four(aux1 + " " + a[2] + " / " + aux2 + " " + b[2],
            [aux2 + " " + a[2] + " / " + aux1 + " " + b[2],
             aux2 + " " + a[2] + " / " + aux2 + " " + b[2],
             aux1 + " " + a[2] + " / " + aux1 + " " + b[2],
             aux1 + " " + a[1] + " / " + aux2 + " " + b[1]]),
        0,
        "لكلِّ فاعلٍ مساعدُه: «" + a[3] + "» مفردٌ ⇐ " + aux1 + "، و«" + b[4] + "» جمعٌ ⇐ " + aux2 + "، وكلاهما مع التصريفِ الثالث."];
    }
  ];

  /* الجدولُ الذي تقرؤه الصفحة: اسمُ القاعدةِ كما في gram-rules.js */
  window.GRAM_GEN = window.GRAM_GEN || {};
  window.GRAM_GEN["Passive Voice"] = GEN;
  window.GRAM_PASSIVE = GEN;
  window.GRAM_PASSIVE_V = V;      /* الجدولُ يُقرأ في الفحصِ للمقابلة */
})();
