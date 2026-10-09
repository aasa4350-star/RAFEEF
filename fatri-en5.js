/* ═══ الاختبار الفتري — إنجليزي أسامة، على نموذج ورقة المعلّم ═════════
   أرسل الأبُ (٩ أكتوبر ٢٠٢٦) ملفَّ المعلّمِ وقال: «حطّ نفس النموذج هذا
   فتري لأسامة في الإنجليزي». والورقةُ عنوانُها بنصّها:

     English Language · 5th elementary Grade · period Exam · …\20

   وأقسامُها الستّةُ بدرجاتِها كما في الورقة:

     General questions      ٤     مطابقةُ سؤالٍ بجوابه
     Controlled Writing     ١     إعادةُ ترتيبِ جملة
     Reading short sentence ٤     ✓/✗ بالصورة (٢) + اختيار (٢)
     Grammar                ٤     اختيار
     Vocabulary             ٥     اختيار كلمةِ الصورة
     Orthography            ٢     الحرفُ الناقص
                           ───
                            ٢٠

   وفي ورقةِ المعلّمِ أربعةُ بنودٍ في الإملاءِ بنصفِ درجةٍ لكلٍّ. وجعلتُها
   هنا بندين بدرجةٍ لكلٍّ: الوزنُ محفوظٌ (٢ من ٢٠) والدرجةُ تبقى عددًا
   صحيحًا فلا يرى الطفلُ «٠٫٥». وبذلك عشرون بندًا بدرجةٍ لكلٍّ.

   والمادّةُ من مقرَّرِ أسامةَ وحدَه: Welcome والوحدات ١–٤ — مفرداتُها
   وقواعدُها من مولّداتِ english5.html نفسِها، وما لم يكن له مولّدٌ
   (المطابقةُ وإعادةُ الترتيبِ و✓/✗ والحرفُ الناقص) بنوكُه هنا، مبنيّةٌ
   من كلماتِ وحداتِه لا من غيرِها.

   والصورةُ في بندِ ✓/✗ وبندِ المفرداتِ رمزٌ تعبيريّ (emoji) لا صورةٌ
   مرفوعة: الورقةُ تضع صورةً صغيرةً بجانبِ الجملة، والرمزُ يؤدّي معناها
   ولا يحتاج ملفًّا يُحمَّل ولا يَكسِر إن غاب. */
(function(){

  /* ─── ١) General questions: سؤالٌ وجوابُه من وحداتِه ─── */
  var QA = [
    ["Which is your favorite month?",            "My favorite month is December."],
    ["Which month is your birthday in?",         "My birthday is in July."],
    ["How many students are there in your class?","There are twenty students."],
    ["What special interest do you have?",       "My special interest is origami."],
    ["What do you do in your free time?",        "I make models and read books."],
    ["How was the food festival?",               "It was amazing!"],
    ["What is your new house like?",             "It has a big garden and an oven."],
    ["Where do you bake the cookies?",           "In the oven."],
    ["What does your sister do?",                "She's a journalist."],
    ["What are you going to be in the future?",  "I'm going to be an engineer."],
    ["Where does a pilot work?",                 "At the airport."],
    ["What does the soup taste like?",           "It tastes too salty."],
    ["How do you make the cake?",                "First, mix the butter and the sugar."],
    ["Why might he not be a pilot?",             "Because he's scared of planes."]
  ];

  /* ─── ٢) Controlled Writing: ترتيبُ جملةٍ من وحداتِه ─── */
  var REORDER = [
    ["The", "monster", "is", "horrible"],
    ["The", "cake", "is", "delicious"],
    ["My", "sister", "is", "a", "journalist"],
    ["The", "kitchen", "is", "very", "clean"],
    ["This", "film", "is", "amazing"],
    ["Her", "room", "is", "untidy"],
    ["The", "engineer", "is", "friendly"],
    ["My", "birthday", "is", "in", "May"],
    ["The", "soup", "smells", "wonderful"],
    ["The", "oven", "is", "very", "hot"]
  ];

  /* ─── ٣أ) Reading: ✓ أو ✗ بالصورة ─── */
  var TICK = [
    ["🏔️", "It is a mountain.", true],
    ["🌈", "It is a rainbow.", true],
    ["🐌", "It is a snail.", true],
    ["⚽", "It is a snail.", false],
    ["🌧️", "It is sunny today.", false],
    ["☀️", "It is a rainy day.", false],
    ["🍪", "They are cookies.", true],
    ["🧈", "It is butter.", true],
    ["🪟", "It is an oven.", false],
    ["✈️", "He is a pilot.", true],
    ["🎹", "She is a pianist.", true],
    ["📰", "He is a waiter.", false],
    ["795", "Seven hundred ninety-five.", true],
    ["1,000", "Seven hundred ninety-five.", false],
    ["120", "One hundred and twenty.", true],
    ["515", "Five hundred and fifty.", false]
  ];

  /* ─── ٦) Orthography: الحرفُ الناقصُ من كلماتِ وحداتِه ─── */
  var SPELL = [
    ["mountain", 5, ["a", "e", "o"]],
    ["calendar", 4, ["n", "m", "r"]],
    ["festival", 4, ["i", "e", "a"]],
    ["origami",  2, ["i", "e", "a"]],
    ["amazing",  4, ["i", "e", "y"]],
    ["engineer", 6, ["e", "a", "o"]],
    ["journalist",2, ["u", "o", "a"]],
    ["pianist",  1, ["i", "e", "y"]],
    ["butter",   4, ["e", "a", "o"]],
    ["delicious",2, ["l", "r", "n"]],
    ["horrible", 3, ["r", "l", "n"]],
    ["untidy",   3, ["i", "e", "y"]],
    ["empty",    1, ["m", "n", "p"]],
    ["kitchen",  3, ["c", "k", "s"]],
    ["rainbow",  4, ["b", "p", "k"]],
    ["excellent",2, ["c", "s", "k"]]
  ];

  /* ─── أدوات ─── */
  function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  function EN(s){ return '<span class="en">'+s+'</span>'; }
  /* نصُّ السؤالِ الإنجليزيُّ يُعزَل يساريًّا — انظر stemLtr في english5.html */
  function stemLtr(h){
    var plain = String(h).replace(/<[^>]*>/g, "");
    if(/[\u0600-\u06FF]/.test(plain)) return h;
    return '<bdi dir="ltr" style="display:block;text-align:left">' + h + '</bdi>';
  }
  function pick(arr, n){ var a = arr.slice(); (window.shuffle||function(x){return x;})(a); return a.slice(0, n); }

  /* الورقةُ تكتب المبعثرَ هكذا: horrible \ The \ is \ monster */
  function scrambled(words){
    var w = words.slice();
    (window.shuffle||function(x){return x;})(w);
    /* ألّا يخرج المبعثرُ مرتَّبًا فيصير السؤالُ بلا سؤال */
    if (w.join(" ") === words.join(" ")) w.push(w.shift());
    return w.join(" \\ ");
  }
  /* الخيارُ الخاطئُ في الورقة: الصفةُ أوّلًا بحرفٍ صغير (horrible is the monster) */
  function wrongOrder(words){
    var w = words.slice(), last = w.pop();
    return last.toLowerCase() + " " + w.join(" ").toLowerCase() + ".";
  }
  function hideLetter(word, i){
    return word.slice(0, i) + "__" + word.slice(i + 1);
  }

  /* ─── بناءُ البنودِ العشرين ─── */
  function build(){
    var items = [];

    /* ١) General questions — ٤ بنود: أربعةُ أسئلةٍ وأربعةُ أجوبةٍ تُطابَق */
    var qa = pick(QA, 4);
    var answers = qa.map(function(p){ return p[1]; });
    var shown = answers.slice(); (window.shuffle||function(x){return x;})(shown);
    qa.forEach(function(p){
      items.push({ sect:"gq", stem:"<b>"+EN(esc(p[0]))+"</b>",
        opts: shown.map(function(a){ return EN(esc(a)); }),
        ans: shown.indexOf(p[1]), key:"gq:"+p[0] });
    });

    /* ٢) Controlled Writing — بندٌ واحد */
    var r = pick(REORDER, 1)[0];
    var right = r.join(" ") + ".";
    var wrong = wrongOrder(r);
    var pair = [right, wrong]; (window.shuffle||function(x){return x;})(pair);
    items.push({ sect:"cw",
      stem:"<b>Reorder:</b><br>"+EN(esc(scrambled(r))),
      opts: pair.map(function(x){ return EN(esc(x)); }),
      ans: pair.indexOf(right), key:"cw:"+right });

    /* ٣أ) Reading — ✓/✗ ببندين */
    pick(TICK, 2).forEach(function(t){
      items.push({ sect:"rs",
        stem:'<div class="ft-pic">'+t[0]+'</div>'+EN(esc(t[1]))+' &nbsp;( &nbsp; )',
        opts:["✓", "✗"], ans: t[2] ? 0 : 1, key:"tick:"+t[0]+t[1] });
    });
    /* ٣ب) Reading — اختيارٌ ببندين من مولّداتِ المفرداتِ في السياق */
    gen(["gAgo","gWVoc","gHouseW","gAdjPI","gPIExp","gFoodN"], 2, "rs", items);

    /* ٤) Grammar — أربعةُ بنود */
    gen(["gPresPast","gStateProg","gWill","gWillGoing","gShould","gZeroCond",
         "gSmells","gTag","gMayMight","gGoingTo3","gSup","gWPast","gHowManyLong"], 4, "gr", items);

    /* ٥) Vocabulary — خمسةُ بنود */
    gen(["gWVoc","gAdjPI","gPIExp","gHouse","gHouseW","gJob","gPlace","gJobPlace",
         "gFoodN","gFoodV","gUn","gIst","gMonthAr","gMonthOrder"], 5, "vo", items);

    /* ٦) Orthography — بندان */
    pick(SPELL, 2).forEach(function(s){
      var o = s[2].slice(); (window.shuffle||function(x){return x;})(o);
      items.push({ sect:"or",
        stem: EN(esc(hideLetter(s[0], s[1]))),
        opts: o.map(function(x){ return EN(esc(x)); }),
        ans: o.indexOf(s[2][0]), key:"sp:"+s[0] });
    });
    return items;
  }

  /* بنودٌ من مولّداتِ الصفحةِ نفسِها، بلا تكرارِ نصٍّ داخلَ الجولة */
  var usedStems = {};
  function gen(names, n, sect, items){
    var fns = names.map(function(x){ return window[x]; }).filter(function(f){ return typeof f === "function"; });
    var got = 0, guard = 0;
    while(got < n && guard++ < n * 60){
      var f = fns[Math.floor(Math.random() * fns.length)], q;
      try{ q = f(); }catch(e){ continue; }
      if(!q || !Array.isArray(q[1]) || q[1].length < 2) continue;
      if(usedStems[q[0]]) continue;
      usedStems[q[0]] = 1;
      items.push({ sect:sect, stem:q[0], opts:q[1], ans:q[2], key:(f.name||"")+":"+q[0], g:f.name||"" });
      got++;
    }
  }

  var SECTS = [
    ["gq", "General questions",      4],
    ["cw", "Controlled Writing",     1],
    ["rs", "Reading short sentence", 4],
    ["gr", "Grammar",                4],
    ["vo", "Vocabulary",             5],
    ["or", "Orthography",            2]
  ];
  var TOTAL = 20;

  var CSS = ''+
  '.ft-head{background:var(--card);border:1.5px solid var(--accent);border-radius:16px;padding:14px 16px;margin-bottom:14px;box-shadow:var(--shadow)}'+
  '.ft-head h3{margin:0 0 4px;font-size:1.12rem;color:var(--accent-deep,var(--accent))}'+
  '.ft-head .m{color:var(--muted);font-size:.92rem}'+
  '.ft-sec{display:flex;align-items:center;gap:8px;margin:18px 0 8px;font-weight:800;color:var(--accent)}'+
  '.ft-sec .nm{font-size:1.04rem;direction:ltr}'+
  '.ft-sec .mk{margin-inline-start:auto;border:1px solid var(--line);border-radius:10px;padding:3px 10px;font-size:.84rem;color:var(--muted);font-weight:700;direction:ltr;unicode-bidi:isolate}'+
  '.ft-pic{font-size:2rem;line-height:1.2;margin-bottom:4px;direction:ltr}'+
  '.ft-note{color:var(--muted);font-size:.9rem;margin:2px 0 8px}';

  function injectCss(){
    if(document.getElementById("ft-en5-css")) return;
    var s = document.createElement("style"); s.id = "ft-en5-css"; s.textContent = CSS;
    document.head.appendChild(s);
  }

  window.FATRI_EN5 = {
    TOTAL: TOTAL,
    SECTS: SECTS,
    render: function(sec){
      injectCss();
      usedStems = {};
      var items = build();
      var html = '<div class="ft-head"><h3>📝 الاختبار الفتري — الإنجليزي</h3>'+
        /* العددان متجاوران في سطرٍ يمينيّ فتلتصق «٢٠» بـ«٢٠» وتُقرأ «٢٠٠»
           — فيُفصل بينهما بكلمةٍ لا بنقطة. */
        '<div><b>عدد البنود: ٢٠</b> — <b>الدرجة من ٢٠</b>، درجةٌ لكلّ بند.</div>'+
        '<div class="m">على نموذج ورقة المعلّم: ستّة أقسام بدرجاتها. '+
        'والمادّة من مقرّرك: <span class="en">Welcome</span> والوحدات <span class="en">1–4</span>.</div>'+
        '<div class="m">تأنَّ — ما فيه وقتٌ يلاحقك هنا.</div></div>';

      var i = 0;
      SECTS.forEach(function(S){
        var mine = items.filter(function(x){ return x.sect === S[0]; });
        if(!mine.length) return;
        html += '<div class="ft-sec"><span class="nm">'+S[1]+'</span>'+
                '<span class="mk">'+S[2]+' marks</span></div>';
        if(S[0] === "gq") html += '<div class="ft-note">طابِق كلّ سؤالٍ بجوابه الصحيح.</div>';
        if(S[0] === "cw") html += '<div class="ft-note">رتّب الكلمات واختر الجملة الصحيحة.</div>';
        if(S[0] === "or") html += '<div class="ft-note">اختر الحرف الناقص.</div>';
        mine.forEach(function(q){
          var idx = items.indexOf(q);
          html += '<div class="q" data-i="'+idx+'"><div class="num">'+(++i)+'</div>'+
            '<div class="stem">'+stemLtr(q.stem)+'</div><div class="opts">'+
            q.opts.map(function(o,j){ return '<button data-j="'+j+'">'+o+'</button>'; }).join('')+
            '</div></div>';
        });
      });
      html += '<div class="scorebar"><span data-score dir="ltr">0 / '+TOTAL+'</span></div>'+
              '<button class="reset">اختبار جديد 🔄</button>';
      sec.innerHTML = html;

      var pid = (window.newPid ? newPid() : null);
      var answered = {}, correct = 0, saved = false, savedN = 0;
      var t0 = Date.now(), SK = {};
      var scoreEl = sec.querySelector("[data-score]");
      function draw(){ scoreEl.textContent = correct + " / " + TOTAL; }
      function meta(){
        var by = {}; SECTS.forEach(function(S){ by[S[1]] = SK[S[0]] || {c:0,t:0}; });
        return { dur: Math.round((Date.now()-t0)/1000), skills: by,
                 sections: by, pid: pid, model: "ورقة المعلّم" };
      }
      function save(force){
        var done = Object.keys(answered).length === items.length;
        if(!force && !done) return;
        if(savedN >= correct && saved && !done) return;
        savedN = correct; saved = true;
        if(window.saveScore) saveScore("إنجليزي خ٥ — الفتري 📝", correct, TOTAL, pid, meta());
      }
      sec.querySelectorAll(".q[data-i]").forEach(function(qEl){
        var k = +qEl.dataset.i, it = items[k];
        qEl.querySelectorAll(".opts button").forEach(function(btn){
          btn.addEventListener("click", function(){
            if(answered[k]) return; answered[k] = 1;
            qEl.querySelectorAll(".opts button").forEach(function(b){ b.disabled = true; });
            var ok = (+btn.dataset.j === it.ans);
            if(ok){ btn.classList.add("correct"); correct++; }
            else { btn.classList.add("wrong");
                   qEl.querySelectorAll(".opts button")[it.ans].classList.add("correct"); }
            var s = SK[it.sect] || (SK[it.sect] = {c:0,t:0}); s.t++; if(ok) s.c++;
            draw(); save();
          });
        });
      });
      sec._leave = function(){ if(Object.keys(answered).length) save(true); };
      sec._done  = function(){ return Object.keys(answered).length === items.length; };
      sec.querySelector(".reset").addEventListener("click", function(){
        if(Object.keys(answered).length) save(true);
        window.FATRI_EN5.render(sec);
      });
      draw();
    }
  };
})();
