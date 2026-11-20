/* ============================================================
   فكُّ الشفرةِ السمعيّةِ — شظايا من كلمتين إلى أربع

   لماذا هذا الملفّ: قياسُ إملاءِ رفيفَ (٩٧ بندًا خاطئًا، ٩٥٪ منها
   محاولاتٌ حقيقيّةٌ لا ضربًا على الكيبورد) أظهر أنّ خطأها مركَّزٌ في
   موضعٍ واحد: الكلماتُ الوظيفيّةُ غيرُ المنبورة. «are» تصير «a» ثلاثَ
   مرّات، و«is» تصير «a»، و«They» تصير «the»، و«for» تصير «to»، و«at»
   تسقط، و«‑ed» و«‑s» تُمحى. والكلماتُ الطويلةُ تصلها سليمةً:
   grandparents · library · homework · football.

   وهذا هو بعينِه ما يصفه بحثُ فكِّ الشفرةِ السمعيّةِ في اللغةِ
   الثانية: المتعلّمون يكتبون الكلماتِ المعنويّةَ بدقّةِ ٧٦٪
   والوظيفيّةَ بدقّةِ ٥٤٪. وعلاجُه المقرَّرُ عند جون فيلد: تحديدُ
   الجانبِ الذي يُسبّب العطب، والتدريبُ عليه وحدَه بتمارينِ استماعٍ
   مصغّرةٍ قصيرة (micro-listening · paused transcription).

   وشكلُ البندِ مأخوذٌ من التدريبِ الصوتيِّ عالي التنوّع (HVPT)، وهو
   أكثرُ أساليبِ تدريبِ الإدراكِ السمعيِّ دراسةً — تحليلٌ بَعْديٌّ
   لتسعٍ وسبعين دراسةً يجد أثرًا متوسّطًا إلى كبيرٍ على الإدراك:
     · مهمّةُ تمييزٍ بين زوجٍ متقابلٍ (تُختار، لا تُوصَف)
     · ثمّ كتابةٌ من السمعِ (فالتمييزُ وحدَه لا يُثبِت الهجاء)
     · وأصواتٌ متعدّدةٌ لا صوتٌ واحد — وهذا جوهرُه، فصوتان لكلِّ شظيّة
     · وتغذيةٌ راجعةٌ فوريّةٌ تكشف المكتوب

   ⚠️ والشظيّةُ مأخوذةٌ من جملةٍ في بنكِها هو، والخطأُ المقابلُ هو ما
   كتبته هي فعلًا — لا خطأً متوقَّعًا. فمن أراد زيادةَ بندٍ فليأخذه من
   قوائمِ أخطائها المحفوظةِ في الخادم، لا من اجتهادٍ.

   ⚠️ والشظيّةُ قصيرةٌ بقصدٍ (كلمتان إلى أربع): الجملةُ الكاملةُ تقيس
   الذاكرةَ العاملةَ مع الفكِّ فتخلط السببَين، والقصيرةُ تقيس الفكَّ
   وحدَه. ولذلك لا تُطوَّل.
   ============================================================ */
(function(){
  "use strict";

  /* heard: ما يُنطَق · wrong: ما كتبته هي · why: سببُ العطبِ بلغتِها */
  var RAFEEF = [
    { heard:"are playing", wrong:"a playing",
      why:"«are» تُقال خفيفةً سريعةً فتُسمع كأنّها «a». وهي فعلٌ مساعدٌ لا بدّ منه قبل ‑ing.",
      from:"The children are playing outside." },
    { heard:"is nice", wrong:"a nice",
      why:"«is» كذلك تُقال خفيفةً فتُسمع «a». وبلا «is» تصير الجملةُ بلا فعل.",
      from:"The weather is nice today." },
    { heard:"are studying", wrong:"a studying",
      why:"جمعٌ فيلزمه «are». وسمعتِها «a» لأنّها لا تُنبَر.",
      from:"The students are studying in the library." },
    { heard:"They played", wrong:"the played",
      why:"«They» ضميرٌ فاعل، و«the» أداةُ تعريف. الفرقُ صوتُ الياءِ في آخرها.",
      from:"They played football yesterday." },
    { heard:"waiting for", wrong:"waiting to",
      why:"«wait» يأخذ «for» لا «to». و«for» غيرُ منبورةٍ فتُسمع «to».",
      from:"They are waiting for the bus." },
    { heard:"opens at nine", wrong:"open nine",
      why:"فيها شيئان ساقطان: «‑s» في آخرِ الفعل، و«at» قبل الوقت.",
      from:"The shop opens at nine o'clock." },
    { heard:"have finished", wrong:"have finish",
      why:"«‑ed» في آخرِ الكلمةِ صوتٌ خفيفٌ واحدٌ (/t/) — يُسمَع ولا يُكتَب عندكِ.",
      from:"I have finished my homework." },
    { heard:"tired after", wrong:"tired of",
      why:"«after» لا «of». وهي كلمتان مختلفتان تمامًا، فالعطبُ في السمعِ لا في القاعدة.",
      from:"He was tired after the long trip." },
    { heard:"visited our", wrong:"visited a",
      why:"«our» تعني «ـنا»، و«a» تعني «واحدًا». سمعتِها «a» لأنّها خفيفة.",
      from:"We visited our grandparents last weekend." },
    { heard:"in the library", wrong:"in a library",
      why:"«the» معيَّنةٌ و«a» نكرة. الفرقُ حرفٌ واحدٌ غيرُ منبور.",
      from:"The students are studying in the library." }
  ];

  /* ═══ حسنٌ — من محاولاتِه الخمسين الحقيقيّةِ وحدَها ═══════════════
     طلبُ الأب (١٧ نوفمبر ٢٠٢٦) أن تُوضع له كذلك قبل قياسِ أثرِها على
     رفيف. فبُنيت من قوائمِ أخطائِه هو لا بنسخِ بنكِ أختِه: استُخرجت
     محاولاتُه الحقيقيّةُ كلُّها (خمسون محاولةً فريدةً من مدى شهرَين)
     وأُخذ منها ما كان خطؤه في كلمةٍ وظيفيّةٍ بعينِها ومقيسًا لا متوقَّعًا.

     وثلاثةٌ منها قِيست مرّتين فأكثر: «They were» كتبها «the were» في
     ٢٦ أكتوبر و١٧ نوفمبر، و«If it rains» كتبها «If rains» و«If a
     rinas»، و«has already» سمعها «was ready» و«was a raudy». وهذا
     الأخيرُ أدلُّ ما في الملفّ: «has» صارت «was» مرّتين — فالعطبُ في
     الفعلِ المساعدِ نفسِه لا في الهجاء.

     وما كان خطؤه بتراً لا إبدالًا (كـ«she has lived here» ثمّ يتوقّف)
     لم يُؤخَذ: ذاك عطبُ انتباهٍ لا عطبُ فكٍّ، ولا يُدرَّب بهذا. */
  var HASAN = [
    { heard:"They were", wrong:"the were",
      why:"«They» ضميرٌ فاعل و«the» أداةُ تعريف. كتبتَها «the were» مرّتين — في ٢٦ أكتوبر و١٧ نوفمبر.",
      from:"They were watching TV" },
    { heard:"has already finished", wrong:"was already finished",
      why:"«has» لا «was». سمعتَها «was ready» و«was a raudy» — والفعلُ المساعدُ هو الذي يحدّد الزمن.",
      from:"He has already finished his work" },
    { heard:"If it rains", wrong:"If rains",
      why:"«it» لازمةٌ قبل الفعلِ في الجوّ، وهي خفيفةٌ فتسقط من سمعك. كتبتَها «If rains» و«If a rinas».",
      from:"If it rains" },
    { heard:"is spoken", wrong:"a spoken",
      why:"«is» تُقال خفيفةً فتُسمع «a» — وهي علامةُ المبنيِّ للمجهول.",
      from:"English is spoken" },
    { heard:"has been studying", wrong:"has studying",
      why:"«been» ساقطةٌ من سمعك. وبلا «been» لا يصحُّ المضارعُ التامُّ المستمرّ.",
      from:"She has been studying" },
    /* ⚠️ كانت «for three hours» فردّتها خدمةُ التعرّفِ «43 hours»: فـ«for»
       و«four» متماثلتان في النطق، والشظيّةُ مبتورةٌ قبل عددٍ فتلتبس حتى
       على السامعِ الأصليّ — فيُحاسَب الطفلُ على تمييزٍ لا يُمكِن. فضُمّ
       الفعلُ قبلها فزال اللبس: لا أحدَ يقول «studying four three». */
    { heard:"studying for three", wrong:"studying three",
      why:"«for» تدلُّ على المدّة، وهي خفيفةٌ فتسقط. أسقطتَها في ٣٠ سبتمبر.",
      from:"studying for three hours" },
    { heard:"by a famous", wrong:"by famous",
      why:"«a» قبل الصفةِ والمعدودِ المفرد. أسقطتَها في ١٤ نوفمبر.",
      from:"by a famous engineer" },
    { heard:"take the bus", wrong:"take they bus",
      why:"«the» لا «they». الفرقُ صوتُ الياءِ في آخرها، وهي غيرُ منبورةٍ فيلتبسان.",
      from:"than take the bus" },
    { heard:"believe that reading", wrong:"believe thay reading",
      why:"«that» تربط الجملتَين. كتبتَها «thay» — فالصوتُ وصلك ناقصًا لا خطأً في القاعدة.",
      from:"believe that reading improves memory" }
  ];

  /* ═══ سعودٌ — الصوائتُ لا الكلماتُ الوظيفيّة ═══════════════════════
     طلبُ الأب (١٩ نوفمبر ٢٠٢٦) بعد القياس. وعطبُ سعودٍ غيرُ عطبِ أخوَيه:
     إملاؤه كلماتٌ مفردةٌ لا جمل، وعربيُّه ٩٠–١٠٠٪ ثابت، ويحاول في ٩٨٪
     من بنودِه. وقُسمت أخطاؤه الأربعةُ والستّون بالمقياسِ الصوتيّ:
     ٥٨٪ سمعها صحيحةً وأخطأ هجاءَها، و٤٢٪ لم يسمعها.

     وثلثُها خطأٌ في الصائتِ وحدَه والصوامتُ كلُّها سليمة. والنمطُ
     الغالب: i تُكتَب e (×٤)، وai تُكتَب i أو ie (×٤). وهو متوقَّعٌ من
     طفلٍ عربيّ: الصوائتُ القصيرةُ في العربيّةِ لا تُكتَب أصلًا.

     فالخيارُ المقابلُ هنا هو ما كتبه هو بعينِه، لا خطأً متوقَّعًا:
     geft و shep و chir و rien و git و brid و shall و cap و kaet.
     والشرحُ قاعدةُ الصائتِ بلغةٍ يفهمها ابنُ الرابعِ الابتدائيّ. */
  var SAUD = [
    { heard:"gift", wrong:"geft",
      why:"الصوتُ القصيرُ هنا يُكتَب i لا e. كتبتَها «geft» ثلاثَ مرّات.",
      from:"gift" },
    { heard:"ship", wrong:"shep",
      why:"i القصيرةُ نفسُها: sh + i + p. و«shep» كلمةٌ أخرى.",
      from:"ship" },
    { heard:"chair", wrong:"chir",
      why:"‏ai معًا تُنطَق مثلَ اسمِ الحرفِ A. وبلا a تصير chir.",
      from:"chair" },
    { heard:"rain", wrong:"rien",
      why:"‏ai لا ie. الترتيبُ a ثمّ i — وهو الشائعُ في وسطِ الكلمة.",
      from:"rain" },
    { heard:"gate", wrong:"git",
      why:"الـe في آخرِها صامتةٌ لا تُنطَق، لكنّها تجعل a تُنطَق باسمِها: جيت.",
      from:"gate" },
    { heard:"kite", wrong:"kaet",
      why:"الـe الصامتةُ نفسُها: i + صامتٌ + e ⟵ تُنطَق i باسمِها.",
      from:"kite" },
    { heard:"stone", wrong:"ston",
      why:"لا تنسَ الـe الصامتةَ في آخرِها — بدونِها الصوتُ يقصُر.",
      from:"stone" },
    { heard:"bread", wrong:"brid",
      why:"‏ea هنا تُنطَق e قصيرةً. كتبتَها brid و braid و braed.",
      from:"bread" },
    { heard:"leaf", wrong:"lef",
      why:"‏ea هنا تُنطَق طويلةً مثلَ اسمِ الحرفِ E — ولا تُحذَف a.",
      from:"leaf" },
    { heard:"shell", wrong:"shall",
      why:"‏e لا a. و«shall» كلمةٌ أخرى معناها «سوف».",
      from:"shell" },
    { heard:"cup", wrong:"cap",
      why:"‏u لا a. و«cap» معناها قبّعة — كلمةٌ غيرُها.",
      from:"cup" },
    { heard:"duck", wrong:"dauk",
      why:"‏u وحدَها، بلا a. وck معًا صوتٌ واحد.",
      from:"duck" },
    { heard:"ball", wrong:"boll",
      why:"‏a قبل ll تُنطَق مثلَ o — لكنّها تُكتَب a.",
      from:"ball" },
    { heard:"grass", wrong:"graas",
      why:"‏a واحدةٌ لا اثنتان. التكرارُ في ss لا في a.",
      from:"grass" },
    { heard:"sand", wrong:"suand",
      why:"‏a وحدَها بعد s. لا u بينهما.",
      from:"sand" },
    { heard:"book", wrong:"bokk",
      why:"‏oo هي التي تُطيل الصوت، وk واحدة.",
      from:"book" },
    { heard:"door", wrong:"do",
      why:"‏oo ثمّ r. و«do» كلمةٌ أخرى معناها «يفعل».",
      from:"door" },
    { heard:"key", wrong:"kea",
      why:"تنتهي بـey لا ea. كتبتَها kea و kae ثلاثَ مرّات.",
      from:"key" },
    { heard:"shoe", wrong:"sohe",
      why:"الترتيب: sh ثمّ oe. و«sohe» ليست كلمة.",
      from:"shoe" },
    { heard:"farm", wrong:"fom",
      why:"‏ar معًا تُعطي الصوتَ الطويل. كتبتَها fom و fun و fuon أربعَ مرّات.",
      from:"farm" }
  ];

  /* أصواتٌ لكلِّ شظيّة — تعدّدُ الأصواتِ هو جوهرُ HVPT، فلا يُنقَص
     إلى واحد. وهما نفسُهما اللذان تُولَّد بهما المقاطعُ المحفوظةُ في
     tools/generate-micro.js، فلا يسمع الطفلُ صوتًا من ملفٍّ وصوتًا من
     الشبكةِ فيظنّ أحدَهما عطبًا. */
  var VOICES = ["en-GB-RyanNeural", "en-GB-SoniaNeural"];

  /* ═══ فهد — ثالثٌ ثانويّ (٢٠ نوفمبر ٢٠٢٦) ════════════════════════════
     طلبُ الأب: «حط لفهد في الإملاء تفكيك الجمل مثل حسن».
     والشظايا من أخطائِه هو: قُوبِل ما كُتِب في ستِّ جلساتٍ بما قيل له
     (تسعةٌ وثلاثون زوجًا في القاعدة)، فخرجت أربعُ عائلاتٍ منظومة:

       ١) الباءُ والپاء: العربيّةُ لا /p/ فيها فيلتبسان. published صارت
          «palpashent» و«foubshent»، وbeen صارت «peen»، وBy صارت «Pay»،
          وproject صارت «brojicte»، وbridge صارت «prejst».
       ٢) الفاءُ والڤاء: ولا /v/ في العربيّةِ كذلك. provided صارت
          «brovinted»، وvalue صارت «faly»، وvariables صارت «firbo».
       ٣) الثاءُ: theory صارت «feery» و«very»، وthat صارت «the».
       ٤) وسقوطُ الخفيفِ: of وbeen وnor وfor تسقط أو تُبدَل —
          «one of the variables» كتبها «one the firbo»، و«Neither …
          nor» كتبها «Nine … no».

     والصوتُ ينطق الصحيحَ دائمًا، والخطأُ خيارٌ مكتوبٌ يقابله بما سمع —
     وأزواجُه مسموعةُ الفرقِ حقًّا (بخلافِ هجاءِ سعود)، فسؤالُه
     «أيُّهما سمعتَ؟» كما هو. */
  var FAHAD = [
    { heard:"been published earlier", wrong:"been polished earlier",
      why:"‏published أوّلُها /p/ ووسطُها /b/ — والعربيّةُ لا پاءَ فيها فيلتبسان. كتبتَها «palpashent» و«foubshent».",
      from:"Had the results been published earlier" },
    { heard:"one of the variables", wrong:"one the variables",
      why:"‏of خفيفةٌ بين الاسمَين فتسقط من الأذن. أسقطتَها في ١١ نوفمبر: «one the firbo».",
      from:"one of the variables" },
    { heard:"was rejected", wrong:"was ejected",
      why:"‏rejected أوّلُها /r/ مسموعةٌ ومعناها «رُفِض». كتبتَها «jacted» في ١٠ نوفمبر.",
      from:"The proposal was rejected" },
    { heard:"information provided", wrong:"information provider",
      why:"‏provided فعلٌ آخرُه /d/، وprovider اسمٌ آخرُه /r/. وفيها /v/ لا /b/ — كتبتَها «brovinted».",
      from:"The information provided in the brochure" },
    { heard:"increasingly value", wrong:"increasingly falue",
      why:"‏value أوّلُها /v/: الشفةُ على السنِّ لا شفةٌ على شفة. كتبتَها «faly» في ١٧ نوفمبر.",
      from:"Employers increasingly value" },
    { heard:"which was widely", wrong:"which was wildly",
      why:"‏widely من wide «واسع»، وwildly من wild «جامح». كتبتَها «whay lattly» في ١٠ نوفمبر.",
      from:"The theory, which was widely accepted" },
    { heard:"nor the teacher", wrong:"no the teacher",
      why:"‏nor آخرُها /r/ وهي قسيمةُ Neither. كتبتَها «no» في ١٧ نوفمبر فانقطع التركيب.",
      from:"Neither the students nor the teacher" },
    { heard:"long suspected", wrong:"long expected",
      why:"‏suspected «يَشتبِه» وexpected «يَتوقَّع» — ضدَّان تقريبًا. كتبتَها «spcted».",
      from:"Scientists have long suspected" },
    { heard:"Under no circumstances", wrong:"Under the circumstances",
      why:"«Under no» نفيٌ قاطعٌ، و«Under the» وصفُ حال — فرقٌ في المعنى كلِّه. كتبتَها «and noste more» و«An now soke».",
      from:"Under no circumstances" },
    { heard:"Were it not", wrong:"Where it not",
      why:"‏Were هنا فعلٌ في شرطٍ مقلوبٍ لا ظرفَ مكان، وصوتُها /wɜː/ لا /weə/. كتبتَها «Worry» في ١٧ نوفمبر.",
      from:"Were it not for his support" },
    { heard:"for having kept", wrong:"for have kept",
      why:"بعد for يأتي having لا have. كتبتَ «gais fugh keepion» في ١٣ نوفمبر.",
      from:"He apologised for having kept us" },
    { heard:"on the basis", wrong:"on the basic",
      why:"‏basis اسمٌ «أساس» وbasic صفةٌ «أساسيّ». كتبتَها «crocet» في ١٧ نوفمبر.",
      from:"on the basis" },
    { heard:"The bridge is said", wrong:"The bridge is sold",
      why:"‏said تُقال «سِدْ» قصيرةً، وsold غيرُها. كتبتَها «sante» و«see it» مرّتَين.",
      from:"The bridge is said" },
    { heard:"number of applicants", wrong:"number applicants",
      why:"‏of تسقط هنا كما سقطت عندك في «one of the variables».",
      from:"The number of applicants" },
    { heard:"to have been built", wrong:"to have been build",
      why:"‏built مبنيٌّ للمجهولِ آخرُه /t/، وbuild مصدرٌ. كتبتَها «peen» — والباءُ لا پاء.",
      from:"to have been built" },
    { heard:"has recently been", wrong:"has recent been",
      why:"‏recently ظرفٌ بـly مسموعة، وrecent صفة.",
      from:"has recently been challenged" },
    { heard:"A great deal of", wrong:"A great deal",
      why:"‏of لازمةٌ بعد deal، وهي خفيفةٌ فتسقط — وهذا بابُك.",
      from:"A great deal of evidence" },
    { heard:"be submitted before", wrong:"be submitted after",
      why:"‏before وafter ضدّان، وأوّلُ before /b/. انتبه للمعنى لا للصوتِ وحدَه.",
      from:"be submitted before Thursday" }
  ];;

  /* ═══ أسامة — خامسٌ ابتدائيّ (٢٠ نوفمبر ٢٠٢٦) ═══════════════════════
     طلبُ الأب: «والأطفال الباقين نفسه».
     وملفُّه غيرُ ملفِّ إخوتِه: إملاؤه أربعةٌ وسبعون بالمئةِ — فأذنُه
     تعمل، والعطبُ في اليدِ لا في السمع. وأخطاؤه في القاعدةِ ثلاثُ
     عائلات:
       ١) ie / ei: friend صارت «freind» وscience صارت «sceince» —
          وهذه قاعدةُ هجاءٍ لا تُسمَع أصلًا.
       ٢) الصائتُ القصير: window صارت «Wendow» وyellow صارت «Yollow»
          وmorning صارت «morneng» وelephant صارت «elaphant».
       ٣) مقطعٌ يسقط: holiday صارت «holday» وmountain صارت «Montin».
     وثلاثةٌ من أخطائِه زلّةُ لوحةِ مفاتيحَ لا أذنٍ ولا هجاء (sisyer ·
     summet · Brothet — حرفٌ مجاورٌ للصحيح)، فتُركت خارجَ البنكِ إلّا
     ما تكرّر منها.

     وستَّ عشرةَ من عشرين من أزواجِه متطابقةٌ صوتيًّا تمامًا — قِيست
     بمفتاحِ phKey من الصفحةِ نفسِها. فسؤالُه «أيُّهما الكتابةُ
     الصحيحة؟» كسعود، لا «أيُّهما سمعت؟»: لو سُئل بالسمعِ لحوسب على
     تمييزٍ لا وجودَ له. */
  var OSAMA = [
    { heard:"friend", wrong:"freind",
      why:"‏i قبل e إلّا بعد c. كتبتَها «freind» في ١٢ أكتوبر.",
      from:"friend" },
    { heard:"science", wrong:"sceince",
      why:"وهذي الاستثناء: بعد c تأتي ei لا ie. كتبتَها «sceince».",
      from:"science" },
    { heard:"window", wrong:"Wendow",
      why:"‏wi لا we — الصائتُ i قصيرٌ هنا. كتبتَها «Wendow».",
      from:"window" },
    { heard:"yellow", wrong:"Yollow",
      why:"‏ye لا yo. والصائتان متقاربان في الأذنِ ومختلفان في الكتابة.",
      from:"yellow" },
    { heard:"morning", wrong:"morneng",
      why:"‏‑ing نهايةٌ ثابتةٌ في الإنجليزيّةِ لا ‑eng. كتبتَها «morneng».",
      from:"morning" },
    { heard:"elephant", wrong:"elaphant",
      why:"‏ele لا ela، وph تُقرأ f. كتبتَها «elaphant».",
      from:"elephant" },
    { heard:"holiday", wrong:"holday",
      why:"ثلاثةُ مقاطع: ho‑li‑day. أسقطتَ الأوسطَ فكتبتَ «holday».",
      from:"holiday" },
    { heard:"mountain", wrong:"montain",
      why:"‏ou لا o، وain في آخرِها. كتبتَها «Montin».",
      from:"mountain" },
    { heard:"bottle", wrong:"buttle",
      why:"‏o لا u. وآخرُها ‑tle لا ‑ter. كتبتَها «buttle» و«butter».",
      from:"bottle" },
    { heard:"juice", wrong:"juce",
      why:"‏ui معًا: j‑ui‑ce. ولا تُسمَع الـi لكنّها تُكتَب.",
      from:"juice" },
    { heard:"bedroom", wrong:"bedrom",
      why:"كلمتان مركّبتان: bed + room — وroom بـoo.",
      from:"bedroom" },
    { heard:"circle", wrong:"cercle",
      why:"‏ci لا ce، وc الأولى تُقرأ s لأنّ بعدها i.",
      from:"circle" },
    { heard:"pencil", wrong:"pensil",
      why:"‏c لا s — وتُقرأ s لأنّ بعدها i. كتبتَها «pensil».",
      from:"pencil" },
    { heard:"picture", wrong:"pictur",
      why:"آخرُها ‑ure ولا تُسمَع الـe.",
      from:"picture" },
    { heard:"kitchen", wrong:"kitshen",
      why:"صوتُ /tʃ/ يُكتَب tch بعد صائتٍ قصير، لا sh.",
      from:"kitchen" },
    { heard:"teacher", wrong:"techer",
      why:"‏ea معًا تُقرأ طويلةً «تيـ». كتبتَ techer.",
      from:"teacher" },
    { heard:"banana", wrong:"bannana",
      why:"‏n واحدةٌ في الوسطِ لا اثنتان: ba‑na‑na.",
      from:"banana" },
    { heard:"summer", wrong:"sumer",
      why:"‏m مضاعفةٌ بعد الصائتِ القصير: sum‑mer.",
      from:"summer" },
    { heard:"sister", wrong:"sistar",
      why:"آخرُها ‑er لا ‑ar. وانتبه: الـt مجاورةٌ للـy في اللوحةِ فكتبتَ «sisyer» مرّةً — اقرأ ما كتبتَ قبل «تحقّق».",
      from:"sister" },
    { heard:"brother", wrong:"brothar",
      why:"آخرُها ‑er كذلك. وكتبتَها «Brothet» مرّةً — زلّةُ لوحةٍ لا هجاء، فراجِعها بعينك.",
      from:"brother" }
  ];

  window.MICRO_LISTEN = { rafeef: RAFEEF, hasan: HASAN, saud: SAUD, fahad:FAHAD, osama:OSAMA };
  /* ولكلِّ بنكٍ سطرُه: عطبُ حسنٍ ورفيفَ في الكلماتِ الوظيفيّةِ غيرِ
     المنبورة، وعطبُ سعودٍ في الصوائت. فلافتةٌ واحدةٌ مكتوبةٌ تكذب على
     أحدِهما — كما كذبت لافتةُ رفيفَ على حسنٍ قبلَ أن تُستخرَج. */
  /* ═══ والسؤالُ يتبع نوعَ الجرعة ══════════════════════════════════
     بنكُ حسنٍ ورفيفَ تمييزٌ بالأذن: «They were» غيرُ «the were» صوتًا،
     فالسؤالُ «أيُّهما سمعت؟».
     وبنكُ سعودٍ هجاءٌ لا سمع: «gift» و«geft» و«ball» و«boll» تُنطَق
     متطابقةً — وقد أعادت خدمةُ التعرّفِ مقطعَ ball «Paul» و«Bull».
     فسؤالُ «أيُّهما سمعت؟» يُحاسبه على تمييزٍ لا وجودَ له، والصوابُ
     «أيُّهما الكتابةُ الصحيحة؟». والصوتُ معينٌ لا مقياس. */
  window.MICRO_ASK = {
    saud:  { m:"أيُّهما الكتابةُ الصحيحة؟", f:"أيُّهما الكتابةُ الصحيحة؟" },
    osama: { m:"أيُّهما الكتابةُ الصحيحة؟", f:"أيُّهما الكتابةُ الصحيحة؟" }
  };
  window.MICRO_NOTE = {
    rafeef: "أخطاؤك كلُّها في كلماتٍ صغيرةٍ تُقال خفيفةً",
    hasan:  "أخطاؤك كلُّها في كلماتٍ صغيرةٍ تُقال خفيفةً",
    saud:   "أخطاؤك في الصوائت — الحروفُ الساكنةُ تكتبها صح، والعلّةُ في a e i o u",
    fahad:  "أخطاؤك في الباءِ والپاءِ والفاءِ والڤاءِ وفي الخفيفِ الذي يسقط",
    osama:  "سمعُك سليم — والعلّةُ في الكتابة: ie/ei والصوائتُ القصيرةُ ومقطعٌ يسقط"
  };
  window.MICRO_VOICES = VOICES;
  window.MICRO_TAKE   = 6;     /* ستٌّ في الجلسةِ — دقيقتان أو ثلاث، لا تُترَك */
})();
