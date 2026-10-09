/* ═══ حارسُ التأنّي — جلسةٌ نُقرت نقرًا لا تدخل المعدَّل ═══════════════
   طلبُ الأب (٩ أكتوبر ٢٠٢٦) بعد تقريرِ حسنٍ في الرياضيات: «حطّ له نفس
   فهد في مادة الرياضيات والإنجليزي». وكان التقريرُ قد أظهر أنّه أعاد
   الاختبارَ الفتريَّ تسعَ مرّاتٍ — خمسًا منها في يومٍ واحد — والدرجةُ
   ثابتةٌ بين ٤٥٪ و٦٥٪ والزمنُ ينزل: من ٩٫٧ ثانيةٍ للسؤال إلى ٤٫٠.
   فهو يُعيد رميَ الورقةِ لا يذاكرها.

   وحارسُ فهدٍ في practice.html معياران: متوسّطُ أقلُّ من ثماني ثوانٍ
   للسؤال، أو أكثرُ من نصفِ الأسئلةِ أُجيبت في أقلّ من ثلاث.

   ═══ ولِمَ زِيد شرطُ الدرجةِ لحسن ═══════════════════════════════════
   قبل التنفيذِ قِيس أثرُ قاعدةِ فهدٍ كما هي على جلساتِ حسنٍ المحفوظة:

     الرياضيات  : تُستبعَد ٦٩ من ١٤٠ جلسة (٤٩٪)
     الإنجليزي  : تُستبعَد ١٨ من ٢٣ جلسة (٧٨٪)
     ومن جلساتِه الممتازةِ (٨٠٪ فأكثر) تسقط ٤٩ من ٨٤

   أي عشرةٌ من عشرةٍ في ٦٫١ ثانيةٍ للسؤال تُشطَب. وهذا عينُ ما رفضه الأبُ
   في ٧ أكتوبر حين أرسل صورةَ «١٣/١٣ في ٤٧ ثانية — ما تُحسب لك» وقال:
   «شِلّ الخاصّية منهم كلّهم ما عدا فهد».

   والسببُ أنّ مادّةَ فهدٍ تحصيليٌّ وستيب: سؤالٌ طويلٌ يحتاج حسابًا،
   والاختبارُ الحقيقيُّ يعطيه خمسًا وسبعين ثانية. ومادّةُ حسنٍ في هاتين
   الصفحتين تمرينُ درسٍ مفردٍ وسؤالُ اختيارٍ من سطر، فستُّ ثوانٍ فيه
   إجابةٌ صادقةٌ لا تسرّع.

   فالسرعةُ وحدَها لا تفرّق عنده: جلساتُه السريعةُ الصحيحةُ وجلساتُه
   السريعةُ الضعيفةُ في مدًى واحدٍ من الثواني. الذي يفرّق هو الدرجة.
   فأُضيف شرطُ الأب نفسِه من ٧ أكتوبر: السريعةُ الصحيحةُ تُحسب.

   وقِيست القاعدةُ بشرطِها على الجلساتِ نفسِها:
     تُستبعَد ٣٣ جلسةً من ١٦٣، منها خمسٌ من جلساتِ الفتريِّ التسع،
     ومن الجلساتِ الممتازةِ (٨٠٪ فأكثر): صفر.

   فهي تمسك ما أراد الأبُ إمساكَه ولا تمسّ ما رفض مسَّه.
   وإن أراد قاعدةَ فهدٍ عاريةً فسطرٌ واحد: MIN_PCT = 101. */
(function(){
  var FAST_SEC = 8;    /* متوسّطُ أقلَّ من هذا للسؤال = نقرٌ لا حلّ */
  var FAST_ONE = 3;    /* إجابةٌ أسرعُ من ثلاثِ ثوانٍ تُعدّ متسرّعة */
  var MIN_PCT  = 70;   /* ومع السرعةِ درجةٌ دون هذا — فالسريعُ الصحيحُ يُحسب */

  /* الأبناءُ الذين يسري عليهم الحارسُ في صفحاتِ المنهج.
     وفهدٌ محكومٌ في practice.html بـPACE_ON هناك، لا هنا. */
  var ON = { hasan: 1 };

  window.PACE = {
    FAST_SEC: FAST_SEC, FAST_ONE: FAST_ONE, MIN_PCT: MIN_PCT,
    on: function(who){ return !!ON[String(who || "").toLowerCase()]; },

    /* الحكمُ على الجلسة. يُعيد {trusted, why, per, quick, weak} */
    judge: function(dur, total, fast, correct){
      var per = (dur != null && total) ? (dur / total) : null;
      if(per == null) return { trusted:true, per:null, quick:false, weak:false };
      var tooMany = (fast || 0) > Math.floor(total / 2);
      var quick = (per < FAST_SEC) || tooMany;
      var weak  = total ? ((correct / total) * 100 < MIN_PCT) : false;
      if(quick && weak)
        return { trusted:false, why:(tooMany && per >= FAST_SEC ? "burst" : "fast"),
                 per:per, quick:true, weak:true };
      return { trusted:true, per:per, quick:quick, weak:weak };
    },

    /* ═══ يُقال له في وجهه، لا في تقريرِ أبيه وحدَه ═══════════════════
       لو استُبعدت جلستُه بصمتٍ لظنّ أنّه يعمل ويتقدّم. فيُعرَض السببُ
       والرقمُ ساعةَ وقوعِه، ومعه ما يُفعَل. وإن كانت سريعةً صحيحةً قيل
       له ذلك صراحةً — فلا يظنّ السرعةَ تهمةً في ذاتها. */
    box: function(sec, who, dur, total, fast, correct){
      if(!sec || !this.on(who)) return;
      var J = this.judge(dur, total, fast, correct);
      if(J.per == null) return;
      var box = sec.querySelector("[data-pace]");
      if(!box){
        box = document.createElement("div"); box.setAttribute("data-pace", "");
        var sb = sec.querySelector(".scorebar");
        if(sb && sb.parentNode) sb.parentNode.insertBefore(box, sb.nextSibling);
        else sec.appendChild(box);
      }
      /* الرقمُ جزيرةٌ لاتينيّةٌ في نصٍّ عربيّ: dir وحدَه لا يعزل داخل
         الفقرة (وهو ما قلب «3/4−» على رفيفَ من قبل)، فيلزم isolate.
         وnowrap لأنّ «10 / 10» انكسر على سطرَين في القياس — فظهر «10»
         في سطرٍ و«10 /» في الذي يليه، فصار الرقمُ غيرَ مقروء. */
      var n = function(v){
        return '<b dir="ltr" style="unicode-bidi:isolate;white-space:nowrap">'+v+'</b>';
      };
      /* المعدودُ في العربيّة: ثلاثةٌ إلى عشرةٍ جمعٌ، وما فوقها مفردٌ
         منصوب. فـ«6 سؤالًا» و«10 سؤال» خطأٌ يقرؤه الطفلُ كلَّ جولة. */
      var qw = function(k){ return (k >= 3 && k <= 10) ? 'أسئلة' : 'سؤالًا'; };
      /* وكذلك الثانية. والكسرُ (٠٫٧) مفردٌ لا جمع. */
      var sw = function(v){ return (v === Math.floor(v) && v >= 3 && v <= 10) ? 'ثوانٍ' : 'ثانية'; };
      var per1 = Math.round(J.per * 10) / 10;
      if(!J.trusted){
        box.innerHTML = '<div style="background:var(--bad-bg);border:1.5px solid var(--bad);color:var(--bad);border-radius:14px;padding:13px 15px;margin:10px 0;font-weight:800;line-height:1.9">'+
          '⚠️ <b>هذي الجولة ما تُحسب لك.</b><br>'+
          (J.why === "burst"
            ? n(fast)+' '+qw(fast)+' من '+n(total)+' جاوبتها في أقلّ من ٣ ثوانٍ — ما قرأتها.'
            : 'حلّيت '+n(total)+' '+qw(total)+' في '+n(dur)+' '+sw(dur)+' — '+n(per1)+' '+sw(per1)+' للسؤال.')+
          '<div style="font-weight:600;margin-top:6px">ودرجتك فيها '+n(correct+' / '+total)+
          '. السرعة وحدها ما تُشكِل — لكن سريع وغلط يعني تخمين.</div>'+
          '<div style="font-weight:600;margin-top:6px">تطلع لأبوك في التقرير مفصولة. أعِدها بتأنٍّ وتُحسب لك ✅</div></div>';
      } else if(J.quick){
        box.innerHTML = '<div style="background:var(--good-bg);border:1px solid var(--good);color:var(--good);border-radius:14px;padding:11px 14px;margin:10px 0;font-weight:800">'+
          '✅ محسوبة لك — '+n(per1)+' '+sw(per1)+' للسؤال ودرجتك '+n(correct+' / '+total)+'. سريع وصحيح 👏</div>';
      } else {
        box.innerHTML = '<div style="background:var(--good-bg);border:1px solid var(--good);color:var(--good);border-radius:14px;padding:11px 14px;margin:10px 0;font-weight:800">'+
          '✅ محسوبة لك · '+n(per1)+' '+sw(per1)+' للسؤال.</div>';
      }
    },

    /* تُدمَج في الميتا قبل الحفظ */
    stamp: function(meta, who, dur, total, fast, correct){
      if(!this.on(who)) { meta.trusted = true; return meta; }
      var J = this.judge(dur, total, fast, correct);
      meta.trusted = J.trusted;
      if(J.why) meta.why = J.why;
      if(J.per != null) meta.secPerQ = Math.round(J.per * 10) / 10;
      return meta;
    }
  };
})();
