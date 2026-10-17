/* ═══ الاختبار الفتري — إنجليزي سعود، على نموذج ورقتَي المعلّم ═════════
   أرسل الأبُ (١٧ أكتوبر ٢٠٢٦) أربعَ صورٍ وقال: «هذا اختبار سعود فتري».
   وهما <b>ورقتان</b> لا ورقةٌ واحدة:

     (أ) English Language · 4th elementary Grade · period Exam · …\20
     (ب) 4th Elementary Grade · First Term · First Exam - 1447 AH · \10

   وأقسامُ الورقةِ (أ) الستّةُ بدرجاتِها هي <b>نفسُها</b> أقسامُ ورقةِ
   أسامةَ ودرجاتُها حرفًا بحرف:

     General questions      ٤     مطابقةُ سؤالٍ بجوابه
     Controlled Writing     ١     إعادةُ ترتيب
     Reading short sentence ٤     ✓/✗ بالصورة (٢) + اختيار (٢)
     Grammar                ٤     اختيار
     Vocabulary             ٥     اختيار كلمةِ الصورة
     Orthography            ٢     الحرفُ الناقص
                           ───
                            ٢٠

   فبُني عليها، والورقةُ (ب) تُقرأ معها لأنّها تزيد أنماطًا: الملءُ من
   صندوقِ كلمات، ومطابقةُ الجملةِ بالصورة، واختيارُ الحرفِ الناقصِ من
   حرفَين. وأُخِذ من (ب) محتواها لا بنيتُها، فالدرجةُ تبقى عشرين.

   ── ما لم يكن له مولّدٌ في english.html ──
   في الورقتَين نمطان يسألُ عنهما المعلّمُ <b>وليس لهما مولّدٌ في مقرَّرِ
   الفصلِ الأوّل</b> (الوحدات ١–٤):

     • <b>was / were</b> — ماضي الفعلِ الناقص. (The chocolate cake … delicious)
     • <b>المقارنة -er + than</b> — (My sister is … than me · Huda is … than Rana)

   وgComp في english.html من الوحدةِ السابعةِ وهي خارجُ الفصلِ الأوّل،
   فلا تُستدعى. فبُني للنمطَين بنكانِ هنا من كلماتِ وحداتِه وحدَها.
   <b>وهذه فائدةُ الورقةِ الأهمّ:</b> أنّها كشفت أنّ المعلّمَ يختبر
   مهارتَين لم يكن في صفحتِه منهما شيء.

   والصورةُ في بندِ ✓/✗ وبندِ المفرداتِ رمزٌ تعبيريّ (emoji) لا صورةٌ
   مرفوعة — كما في فتريِّ أسامة: يؤدّي معنى الصورةِ الصغيرةِ في الورقة،
   ولا يحتاج ملفًّا يُحمَّل ولا يَكسِر إن غاب. */
(function(){

  /* ─── ١) General questions: سؤالٌ وجوابُه ─────────────────────────
     أربعةٌ من ورقتَي المعلّمِ بنصِّها، والباقي على نمطِها من وحداتِه. */
  var QA = [
    ["What school subject is more difficult at school?", "I think math is more difficult."],
    ["What are you afraid of?",                          "I'm afraid of spiders."],
    ["How often do you feed the fish?",                  "I never forget to feed it."],
    ["Whose dress was it?",                              "It's mine."],
    ["Which food do you think smells terrible?",         "I think fish smells terrible."],
    ["How many brothers do you have?",                   "I have three brothers."],
    ["How do you go to school?",                         "I go to school by bus."],
    ["Who is the oldest in your family?",                "My grandpa is the oldest."],
    ["What do you do after school?",                     "I sometimes play football."],
    ["How often do you clean your room?",                "I always clean it on Friday."],
    ["Whose bag is this?",                               "It is hers."],
    ["What is your little brother like?",                "He is very naughty."]
  ];

  /* ─── ٢) Controlled Writing ───────────────────────────────────────
     الورقةُ (أ) تُرتِّب الأعدادَ الترتيبيّة، والورقةُ (ب) تملأ من صندوقِ
     كلمات. فالنمطان هنا، ويُسحَب أحدُهما. */
  var REORDER = [
    ["First", "second", "third", "fourth"],
    ["Monday", "Tuesday", "Wednesday", "Thursday"],
    ["morning", "afternoon", "evening", "night"],
    ["spring", "summer", "autumn", "winter"]
  ];
  /* [الجملة بفراغ، الصحيح، مشتّتان من صندوقِ الكلماتِ نفسِه] */
  var FILLBOX = [
    ["Your mom and dad are your ____.",        "parents",  ["weak", "grandpa"]],
    ["Sara is not strong. She is ____.",       "weak",     ["parents", "grandpa"]],
    ["My father's father is my ____.",         "grandpa",  ["parents", "weak"]],
    ["He never sits still. He is very ____.",  "naughty",  ["shy", "helpful"]],
    ["He doesn't talk to new people. He is ____.", "shy",  ["naughty", "brilliant"]],
    ["She always helps me. She is ____.",      "helpful",  ["shy", "naughty"]]
  ];

  /* ─── ٣أ) Reading — ✓/✗ بالصورة ───────────────────────────────────
     [الرمز، الجملة، أصحيحةٌ هي؟] */
  var TICK = [
    ["🎸", "He is playing the guitar.",                 true],
    ["🙈", "He isn't comfortable with other people. He is shy.", true],
    ["🎣", "I often go fishing.",                       true],
    ["🚲", "I often go cycling.",                       true],
    ["👕👔", "They are the same.",                       false],
    ["💯", "I never read books.",                       false],
    ["🥁", "She is playing the drums.",                 true],
    ["🦜", "It is a lion.",                             false],
    ["⚠️", "It means danger.",                          true],
    ["🚌", "I go to school by car.",                    false],
    ["👴", "He is my grandpa.",                         true],
    ["🍕", "This is fish.",                             false]
  ];

  /* ─── ٤) Grammar: نمطان لا مولّدَ لهما في الفصلِ الأوّل ────────────── */
  /* was / were — [الجملة بفراغ، الصحيح] والمشتّتُ الثابتُ هو الآخر */
  var WASWERE = [
    ["The chocolate cake ____ delicious.",      "was"],
    ["He ____ absent in the class yesterday.",  "was"],
    ["My sister ____ at home last night.",      "was"],
    ["The children ____ in the garden.",        "were"],
    ["My parents ____ very happy.",             "were"],
    ["The film ____ exciting.",                 "was"],
    ["Those books ____ on the desk.",           "were"],
    ["It ____ a sunny day.",                    "was"]
  ];
  /* المقارنة: [الجملة بفراغ، الأصل] فيُبنى -er ويُشتَّت بالأصلِ وبـ-est */
  var COMPAR = [
    ["My sister is ____ than me.",        "short"],
    ["Huda is ____ than Rana.",           "tall"],
    ["This book is ____ than that one.",  "old"],
    ["My bag is ____ than your bag.",     "big"],
    ["Today is ____ than yesterday.",     "cold"],
    ["The parrot is ____ than the lion.", "small"],
    ["Math is ____ than English.",        "hard"],
    ["The bus is ____ than the car.",     "long"]
  ];

  /* ─── ٥) Vocabulary: صورةٌ وكلمتُها ───────────────────────────────
     [الرمز، الصحيح، مشتّت] — والمشتّتُ من ورقةِ المعلّمِ حيث وُجد. */
  var PICVOC = [
    ["🥁", "drums",    "bag"],
    ["🦜", "parrot",   "lion"],
    ["⚠️", "danger",   "brilliant"],
    ["👴", "grandpa",  "mother"],
    ["🚌", "bus",      "car"],
    ["🍕", "pizza",    "fish"],
    ["📷", "camera",   "balloon"],
    ["🎈", "balloon",  "camera"],
    ["🐱", "kitten",   "parrot"],
    ["😢", "afraid",   "surprised"],
    ["🤝", "helpful",  "dangerous"],
    ["🤸", "exciting", "brilliant"],
    ["🎸", "guitar",   "drums"],
    ["🚲", "cycling",  "fishing"],
    ["🎣", "fishing",  "cycling"]
  ];

  /* ─── ٦) Orthography: الحرفُ الناقص ──────────────────────────────
     [الكلمة، موضعُ الحرفِ المخفيّ، [الصحيح، مشتّتان]] */
  var SPELL = [
    ["balloon", 0, ["b", "k", "s"]],
    ["weak",    3, ["k", "v", "m"]],
    ["cycling", 0, ["c", "l", "p"]],
    ["camera",  2, ["m", "j", "y"]],
    ["drums",   1, ["r", "e", "o"]],
    ["kitten",  1, ["i", "m", "a"]],
    ["chatty",  5, ["y", "o", "e"]],
    ["bus",     1, ["u", "e", "a"]],
    ["parrot",  2, ["r", "l", "n"]],
    ["grandpa", 3, ["n", "m", "r"]],
    ["naughty", 2, ["u", "o", "i"]],
    ["parents", 4, ["n", "m", "r"]]
  ];

  /* ─── أدوات ─── */
  function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  function EN(s){ return '<span class="en">'+s+'</span>'; }
  /* نصُّ السؤالِ الإنجليزيُّ يُعزَل يساريًّا — كما في english.html */
  function stemLtr(h){
    var plain = String(h).replace(/<[^>]*>/g, "");
    if(/[؀-ۿ]/.test(plain)) return h;
    return '<bdi dir="ltr" style="display:block;text-align:left">' + h + '</bdi>';
  }
  function sh(a){ return (window.shuffle || function(x){ return x; })(a); }
  function pick(arr, n){ var a = arr.slice(); sh(a); return a.slice(0, n); }

  /* الورقةُ تكتب المبعثرَ هكذا: third \ First \ fourth \ second */
  function scrambled(words){
    var w = words.slice(); sh(w);
    /* ألّا يخرج المبعثرُ مرتَّبًا فيصير السؤالُ بلا سؤال */
    if (w.join(" ") === words.join(" ")) w.push(w.shift());
    return w.join(" \\ ");
  }
  /* الخيارُ الخاطئُ في الورقة: تبديلُ موضعَين (second – fourth – first – third) */
  function wrongOrder(words){
    var w = words.slice();
    return [w[1], w[3], w[0], w[2]].join(" ") + ".";
  }
  function hideLetter(word, i){ return word.slice(0, i) + "__" + word.slice(i + 1); }

  /* المقارنة: تضعيفُ الحرفِ الأخيرِ في big ⟸ bigger، وy ⟸ ier */
  function comparative(w){
    if(/[^aeiou]y$/.test(w)) return w.slice(0, -1) + "ier";
    if(/^(big|hot|sad|fat|thin|wet)$/.test(w)) return w + w.slice(-1) + "er";
    if(/e$/.test(w)) return w + "r";
    return w + "er";
  }
  function superlative(w){
    if(/[^aeiou]y$/.test(w)) return w.slice(0, -1) + "iest";
    if(/^(big|hot|sad|fat|thin|wet)$/.test(w)) return w + w.slice(-1) + "est";
    if(/e$/.test(w)) return w + "st";
    return w + "est";
  }

  /* ─── بناءُ البنودِ العشرين ─── */
  function build(){
    var items = [];

    /* ١) General questions — ٤ بنود */
    var qa = pick(QA, 4);
    var shown = qa.map(function(p){ return p[1]; }); sh(shown);
    qa.forEach(function(p){
      items.push({ sect:"gq", stem:"<b>"+EN(esc(p[0]))+"</b>",
        opts: shown.map(function(a){ return EN(esc(a)); }),
        ans: shown.indexOf(p[1]), key:"gq:"+p[0] });
    });

    /* ٢) Controlled Writing — بندٌ واحد: ترتيبٌ أو ملءٌ من صندوق */
    if(Math.random() < 0.5){
      var r = pick(REORDER, 1)[0];
      var right = r.join(" ") + ".", wrong = wrongOrder(r);
      var pair = [right, wrong]; sh(pair);
      items.push({ sect:"cw",
        stem:"<b>Reorder:</b><br>"+EN(esc(scrambled(r))),
        opts: pair.map(function(x){ return EN(esc(x)); }),
        ans: pair.indexOf(right), key:"cw:"+right });
    } else {
      var f = pick(FILLBOX, 1)[0];
      var o = [f[1]].concat(f[2]); sh(o);
      items.push({ sect:"cw",
        stem:"<b>Fill in the missing word:</b><br>"+EN(esc(f[0])),
        opts: o.map(function(x){ return EN(esc(x)); }),
        ans: o.indexOf(f[1]), key:"cw:"+f[0] });
    }

    /* ٣أ) Reading — ✓/✗ ببندين */
    pick(TICK, 2).forEach(function(t){
      items.push({ sect:"rs",
        stem:'<div class="ft-pic">'+t[0]+'</div>'+EN(esc(t[1]))+' &nbsp;( &nbsp; )',
        opts:["✓", "✗"], ans: t[2] ? 0 : 1, key:"tick:"+t[1] });
    });
    /* ٣ب) Reading — اختيارٌ ببندين من مولّداتِ المفرداتِ في السياق */
    gen(["gFam","gAdj1","gOpp","gChoreV","gChoreO","gTool"], 2, "rs", items);

    /* ٤) Grammar — أربعةُ بنود: was/were ومقارنةٌ ثمّ اثنان من مولّداتِه */
    var ww = pick(WASWERE, 1)[0];
    var wwo = ["was", "were"]; sh(wwo);
    items.push({ sect:"gr", stem: EN(esc(ww[0])),
      opts: wwo.map(function(x){ return EN(esc(x)); }),
      ans: wwo.indexOf(ww[1]), key:"ww:"+ww[0] });

    var cp = pick(COMPAR, 1)[0];
    var cpo = [comparative(cp[1]), cp[1], superlative(cp[1])]; sh(cpo);
    items.push({ sect:"gr", stem: EN(esc(cp[0])),
      opts: cpo.map(function(x){ return EN(esc(x)); }),
      ans: cpo.indexOf(comparative(cp[1])), key:"cp:"+cp[0] });

    gen(["gFreqM","gFreqFill","gPoss","gWhose","gProg","gCan",
         "gVerb3","gPastReg","gPastNeg","gPastQ","gVerb4","gIrr","gAdv","gConj"],
        2, "gr", items);

    /* ٥) Vocabulary — خمسةُ بنود: ثلاثةٌ بالصورةِ واثنان من مولّداتِه */
    pick(PICVOC, 3).forEach(function(v){
      var o = [v[1], v[2]]; sh(o);
      items.push({ sect:"vo",
        stem:'<div class="ft-pic">'+v[0]+'</div>',
        opts: o.map(function(x){ return EN(esc(x)); }),
        ans: o.indexOf(v[1]), key:"pic:"+v[1] });
    });
    gen(["gFam","gAdj1","gOpp","gChoreV","gChoreO","gTool","gVerb3","gVerb4"],
        2, "vo", items);

    /* ٦) Orthography — بندان */
    pick(SPELL, 2).forEach(function(s){
      var o = s[2].slice(); sh(o);
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
    if(!fns.length) return;
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
  '.ft-pic{font-size:2.4rem;line-height:1.2;margin-bottom:4px;direction:ltr}'+
  '.ft-note{color:var(--muted);font-size:.9rem;margin:2px 0 8px}';

  function injectCss(){
    if(document.getElementById("ft-en4-css")) return;
    var s = document.createElement("style"); s.id = "ft-en4-css"; s.textContent = CSS;
    document.head.appendChild(s);
  }

  window.FATRI_EN4 = {
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
        '<div class="m">على نموذج ورقة معلّمك: ستّة أقسام بدرجاتها. '+
        'والمادّة من مقرّرك: الوحدات <span class="en">1–4</span>.</div>'+
        '<div class="m">تأنَّ — ما فيه وقتٌ يلاحقك هنا.</div></div>';

      var i = 0;
      SECTS.forEach(function(S){
        var mine = items.filter(function(x){ return x.sect === S[0]; });
        if(!mine.length) return;
        html += '<div class="ft-sec"><span class="nm">'+S[1]+'</span>'+
                '<span class="mk">'+S[2]+' marks</span></div>';
        if(S[0] === "gq") html += '<div class="ft-note">طابِق كلّ سؤالٍ بجوابه الصحيح.</div>';
        if(S[0] === "cw") html += '<div class="ft-note">رتّب الكلمات أو املأ الفراغ.</div>';
        if(S[0] === "vo") html += '<div class="ft-note">اختر الكلمة التي تناسب الصورة.</div>';
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
      var RG_MS = 2000, lastTs = t0, fastN = 0, ITEMS = [];
      var scoreEl = sec.querySelector("[data-score]");
      function draw(){ scoreEl.textContent = correct + " / " + TOTAL; }
      function meta(){
        var by = {}; SECTS.forEach(function(S){ by[S[1]] = SK[S[0]] || {c:0,t:0}; });
        var m = { dur: Math.round((Date.now()-t0)/1000), fast: fastN, skills: by,
                  sections: by, items: ITEMS, rgMs: RG_MS, pid: pid, model: "ورقة المعلّم" };
        return (window.PACE ? PACE.stamp(m, window.who, m.dur, items.length, fastN, correct) : m);
      }
      function save(force){
        var done = Object.keys(answered).length === items.length;
        if(!force && !done) return;
        if(savedN >= correct && saved && !done) return;
        savedN = correct; saved = true;
        if(window.saveScore) saveScore("إنجليزي خ٤ — الفتري 📝", correct, TOTAL, pid, meta());
      }
      sec.querySelectorAll(".q[data-i]").forEach(function(qEl){
        var k = +qEl.dataset.i, it = items[k];
        qEl.querySelectorAll(".opts button").forEach(function(btn){
          btn.addEventListener("click", function(){
            if(answered[k]) return; answered[k] = 1;
            var now = Date.now(), ms = now - lastTs; lastTs = now;
            if(ms < RG_MS) fastN++;
            qEl.querySelectorAll(".opts button").forEach(function(b){ b.disabled = true; });
            var ok = (+btn.dataset.j === it.ans);
            if(ok){ btn.classList.add("correct"); correct++; }
            else { btn.classList.add("wrong");
                   qEl.querySelectorAll(".opts button")[it.ans].classList.add("correct"); }
            var s = SK[it.sect] || (SK[it.sect] = {c:0,t:0}); s.t++; if(ok) s.c++;
            ITEMS.push({ g: it.sect || "", ok: (ok?1:0), ms: ms, j: +btn.dataset.j, a: it.ans });
            draw(); save();
            if(Object.keys(answered).length === items.length) finish();
          });
        });
      });
      var resetBtn = sec.querySelector(".reset"), RESET_TXT = resetBtn.textContent;
      function finish(){
        var dur = Math.round((Date.now()-t0)/1000);
        if(window.PACE) PACE.box(sec, window.who, dur, items.length, fastN, correct);
        if(!window.PACE || !PACE.on(window.who)) return;
        var J = PACE.judge(dur, items.length, fastN, correct);
        if(J.trusted) return;
        var left = 20;
        resetBtn.disabled = true; resetBtn.style.opacity = ".5";
        resetBtn.textContent = "راجِع أخطاءك… " + left;
        var iv = setInterval(function(){
          left--;
          if(left > 0){ resetBtn.textContent = "راجِع أخطاءك… " + left; return; }
          clearInterval(iv);
          resetBtn.disabled = false; resetBtn.style.opacity = "";
          resetBtn.textContent = RESET_TXT;
        }, 1000);
        sec._paceTimer = iv;
      }
      sec._leave = function(){
        if(sec._paceTimer) clearInterval(sec._paceTimer);
        if(Object.keys(answered).length) save(true);
      };
      sec._done  = function(){ return Object.keys(answered).length === items.length; };
      resetBtn.addEventListener("click", function(){
        if(sec._paceTimer) clearInterval(sec._paceTimer);
        if(Object.keys(answered).length) save(true);
        window.FATRI_EN4.render(sec);
      });
      draw();
    }
  };
})();
