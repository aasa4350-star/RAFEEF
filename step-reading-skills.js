/* ══════════════════════════════════════════════════════════════════
   مهارتان من مهاراتِ القراءةِ الخمسِ لم تكونا في البنكِ البتّة
   ══════════════════════════════════════════════════════════════════
   راجَعنا كُتيِّبَ قياسٍ الرسميَّ في ٢٥ نوفمبرَ ٢٠٢٦، فبان أنّ بنكَنا
   يدرّب أربعًا من مهاراتِ فهمِ المقروءِ الخمسِ ويترك الأولى، ولا يسأل
   عن العنوانِ ولا الفكرةِ العامّةِ قطّ — وهما سؤالان من تسعةٍ في قطعةِ
   العيّنةِ الرسميّة. فهذا الملفُّ يزيدهما على البنكِ عند التحميل.

   ─────────── ١) معنى الكلمةِ في سياقِها ───────────
   كُتيِّبُ قياسٍ الرسميُّ يجعلها أوّلَ مهاراتِ فهمِ المقروءِ الخمس (ص ٩):
   «1. Word Meaning. The test-taker has to select the choice closest in
   meaning to the word as it is in its context.»

   وفي قطعةِ العيّنةِ (ص ١٥–١٧) سؤالان من تسعةٍ من هذا النوع:
   «The word squashing in paragraph (4) is closest in meaning to…»
   و«The word marble in paragraph (5) is closest in meaning to:» —
   أي اثنان وعشرون بالمئةِ من أسئلةِ القراءة.

   وقِيس بنكُنا في ٢٥ نوفمبرَ ٢٠٢٦: خمسُ مئةٍ وأربعةَ عشرَ سؤالَ قراءةٍ،
   وفيها من هذا النوعِ **صفر**. فالطالبُ يتدرّب على أربعٍ من المهاراتِ
   الخمسِ ولا يرى الأولى قطّ.

   ولِمَ جدولٌ واحدٌ لا سؤالٌ لكلِّ قطعة: القطعُ مئةٌ وأربعٌ وخمسون،
   وتأليفُ سؤالٍ لكلٍّ منها يدًا عملٌ طويلٌ يُؤجَّل فلا يقع. والجدولُ
   يُكتَب مرّةً فيغطّي ما وُجدت كلماتُه فيه، ويزيد تلقائيًّا كلّما زِيدت
   قطعة. وكلماتُه مختارةٌ على شرطٍ واحد: **أن يكون معناها ثابتًا لا
   يتقلّب بالسياق** — فـstar التي ضربها الكُتيِّبُ مثلًا للتقلّب ليست
   منها، وكذلك left وhold وaround وcost.

   ⚠️ والاختيارُ حتميٌّ لا عشوائيّ: أوّلُ كلمةٍ من الجدولِ توجد في
   القطعة. وعدّادُ العرضِ (SeenCap) مفتاحُه نصُّ السؤال، فلو تغيّر
   السؤالُ من فتحةٍ إلى فتحةٍ لظنّه العدّادُ سؤالًا جديدًا في كلِّ مرّةٍ
   ولم يُحسَب تكرارُه أبدًا.
   ══════════════════════════════════════════════════════════════════ */
(function(){

  /* [الكلمة, الأقربُ معنًى, ثلاثةُ صوارف] */
  var V = [
    ["evidence",     "proof",                    "opinion",            "rumour",             "question"],
    ["researchers",  "investigators",            "patients",           "teachers",           "builders"],
    ["scholars",     "learned experts",          "beginners",          "traders",            "workers"],
    ["engineers",    "designers of structures",  "doctors",            "farmers",            "lawyers"],
    ["patients",     "people receiving care",    "doctors",            "visitors",           "students"],
    ["participants", "people taking part",       "observers",          "owners",             "critics"],
    ["sample",       "a selected part",          "the whole group",    "a mistake",          "a prize"],
    ["pattern",      "a regular arrangement",    "an accident",        "a shortage",         "a mistake"],
    ["method",       "a way of doing something", "a result",           "a reason",           "a mistake"],
    ["finding",      "a result of research",     "a question",         "a plan",             "a guess"],
    ["manuscript",   "a handwritten document",   "a printed poster",   "a spoken speech",    "a drawing"],
    ["treatment",    "medical care",             "payment",            "refusal",            "delay"],
    ["nutrients",    "substances that nourish",  "waste products",     "poisons",            "machines"],
    ["decades",      "periods of ten years",     "periods of a week",  "periods of a month", "periods of a day"],
    ["centuries",    "periods of a hundred years","periods of ten years","periods of a year", "periods of a season"],
    ["interval",     "a gap between two points", "a total amount",     "a final result",     "a sudden noise"],
    ["threshold",    "a point at which something begins", "a final total", "an average value", "a repeated error"],
    ["forecast",     "a prediction",             "a record of the past","a complaint",       "an order"],
    ["damage",       "harm",                     "repair",             "growth",             "delay"],
    ["erosion",      "gradual wearing away",     "sudden flooding",    "rapid growth",       "careful repair"],
    ["drought",      "a long period without rain","a heavy storm",     "a cold winter",      "a strong wind"],
    ["soil",         "the earth plants grow in", "clean water",        "loose sand only",    "solid rock"],
    ["harvest",      "the gathering of crops",   "the planting of seeds","the clearing of land","the watering of fields"],
    ["fertile",      "able to produce much growth","completely dry",   "very cold",          "newly built"],
    ["survive",      "stay alive",               "disappear",          "grow quickly",       "move away"],
    ["spread",       "extend over a wider area", "shrink",             "stop suddenly",      "repeat exactly"],
    ["migrate",      "move from one region to another","stay in place","die out",           "grow larger"],
    ["replace",      "put something else in its place","repair carefully","remove entirely","copy exactly"],
    ["reduce",       "make smaller",             "make larger",        "repeat",             "delay"],
    ["increase",     "become greater",           "become smaller",     "stay the same",      "disappear"],
    ["reveal",       "make known",               "hide",               "destroy",            "repeat"],
    ["persist",      "continue",                 "stop",               "weaken",             "vanish"],
    ["scarce",       "in short supply",          "plentiful",          "cheap",              "heavy"],
    ["dense",        "packed closely together",  "spread far apart",   "very light",         "newly made"],
    ["remote",       "far away",                 "nearby",             "crowded",            "modern"],
    ["severe",       "serious",                  "mild",               "brief",              "cheap"],
    ["modest",       "small in size or amount",  "enormous",           "sudden",             "expensive"],
    ["device",       "a piece of equipment",     "a written rule",     "a spoken order",     "a large building"],
    ["sensor",       "a device that detects",    "a storage box",      "a written record",   "a power supply"],
    ["compound",     "a combined substance",     "a single element",   "an empty space",     "a loud sound"],
    ["archive",      "a store of records",       "a public market",    "a new invention",    "a short journey"],
    ["rarely",       "seldom",                   "often",              "always",             "quickly"],
    ["frequently",   "often",                    "seldom",             "never",              "slowly"],
    ["eventually",   "in the end",               "at once",            "never",              "briefly"],
    ["gradually",    "slowly over time",         "suddenly",           "rarely",             "loudly"],
    ["entirely",     "completely",               "partly",             "rarely",             "slowly"],
    ["almost",       "nearly",                   "exactly",            "rarely",             "never"],
    ["simply",       "merely",                   "rarely",             "loudly",             "carefully"],
    ["largely",      "mostly",                   "rarely",             "equally",            "briefly"],
    ["sharply",      "suddenly and by a lot",    "slowly and slightly","rarely",             "quietly"],
    ["steadily",     "at a regular rate",        "in sudden jumps",    "very rarely",        "noisily"],
    ["slightly",     "a little",                 "a great deal",       "not at all",         "repeatedly"],
    ["instead",      "in place of that",         "in addition",        "as a result",        "by accident"],
    ["despite",      "in spite of",              "because of",         "thanks to",          "instead of"],
    ["within",       "inside",                   "outside",            "beyond",             "against"],
    ["faster",       "more quickly",             "more slowly",        "more loudly",        "more rarely"],
    ["expected",     "anticipated",              "forbidden",          "ignored",            "refused"],
    ["several",      "more than two but not many","exactly two",       "none at all",        "every one"],
    ["enough",       "sufficient",               "extra",              "missing",            "double"],
    ["wrong",        "incorrect",                "unusual",            "sudden",             "costly"],
    ["effect",       "a result",                 "a cause",            "a reason",           "a plan"],
    ["claim",        "a statement presented as true","a proven fact",  "a formal denial",     "a careful measurement"],
    ["built",        "constructed",              "destroyed",          "sold",               "planned"],
    ["spent",        "used up",                  "saved",              "earned",             "refused"],
    ["carried",      "transported",              "dropped",            "hid",                "measured"],
    ["stopped",      "came to an end",           "began",              "continued",          "hurried"],
    ["later",        "afterwards",               "earlier",            "immediately",        "never"],
    ["above",        "higher than",              "below",              "beside",             "inside"],
    /* زِيدت لتغطيةِ القطعِ التي لم يَقَع فيها شيءٌ ممّا سبق — والشرطُ
       نفسُه: معنًى ثابتٌ لا يتقلّب بالسياق. */
    ["behaviour",    "the way someone acts",     "a written rule",     "a sudden illness",   "a personal belief"],
    ["species",      "a kind of living thing",   "a single animal",    "a wide region",      "a long period"],
    ["shelter",      "a place of protection",    "an open field",      "a busy market",      "a long journey"],
    ["crops",        "plants grown for food",    "wild forests",       "farm machines",      "storage rooms"],
    ["variety",      "a range of different kinds","a single type",     "a large amount",     "a short time"],
    ["narrow",       "not wide",                 "very wide",          "very deep",          "very new"],
    ["individual",   "single and separate",      "shared by all",      "very large",         "very old"],
    ["seriously",    "in a grave way",           "playfully",          "briefly",            "cheaply"],
    ["collections",  "groups of gathered items", "empty buildings",    "written orders",     "public meetings"],
    ["exist",        "be real or present",       "disappear",          "be forbidden",       "be repeated"],
    ["argue",        "give reasons for a view",  "agree at once",      "remain silent",      "measure exactly"],
    ["beyond",       "further than",             "nearer than",        "instead of",         "because of"],
    ["rates",        "measured amounts per unit","total weights",      "written rules",      "final answers"],
    ["cause",        "the thing that makes something happen","the result","the question",    "the delay"],
    ["common",       "widespread",               "rare",               "expensive",          "recent"],
    ["difference",   "a way in which things are unlike","a close similarity","a final total","a fixed rule"],
    ["cannot",       "is not able to",           "must not",           "need not",           "will not"],
    ["energy",       "the power to do work",     "a written plan",     "a storage place",    "a fixed price"],
    /* زِيدت في ٢٦ نوفمبرَ ٢٠٢٦ بعد مراجعةِ ملفٍّ تدريبيٍّ خارجيّ: كلماتُه
       الأكاديميّةُ ليست ملكًا لأحدٍ، وقِيس أيُّها يقع في قطعِنا فعلًا —
       فستٌّ منها لا تقع فيها، وزيادتُها حرفٌ لا عمل، فلم تُزَد.
       ⚠️ و«shift» مثالٌ على ما يحذّر منه الكُتيِّبُ نفسُه في «star»:
       معناها الشائعُ «تحوُّل»، وهي في قطعتِنا الوحيدةِ «industrial
       shifts» أي نوبةُ عمل. فالشرحُ على السياقِ لا على المعجم. */
    ["preserve",     "keep from being lost",     "destroy completely", "sell quickly",       "measure carefully"],
    ["accurate",     "exactly correct",          "roughly similar",    "very fast",          "widely known"],
    ["reliable",     "able to be depended on",   "easily broken",      "recently made",      "very expensive"],
    ["alternative",  "another choice",           "the only option",    "a final decision",   "a repeated mistake"],
    ["occur",        "happen",                   "disappear",          "be forbidden",       "be measured"],
    ["display",      "show",                     "hide",               "destroy",            "measure"],
    ["adjust",       "make allowance for",       "ignore completely",  "repeat exactly",     "measure precisely"],
    ["shift",        "a set period of working time", "a sudden change of mind", "a long holiday", "a written rule"],
    /* وكلمتان أُخِذتا من القطعتَين اللتَين بقيتا بلا سؤالٍ بعد كلِّ ما
       سبق — فالجدولُ يأخذ أوّلَ مطابقةٍ، وزيادةُ كلمةٍ في آخرِه لا تنفع
       قطعةً غُطّيت. فالنافعُ أن تُؤخَذ الكلمةُ من القطعةِ المتروكةِ
       بعينِها، وبها بلغت التغطيةُ ١٣٨ من ١٣٨. */
    ["patient",      "showing calm persistence", "receiving medical care", "very quick",     "easily annoyed"],
    ["pedestrians",  "people travelling on foot","drivers of cars",    "builders of roads",  "traffic officers"]
  ];

  var R = window.STEP_READING || [];
  if(!R.length) return;

  /* الحدودُ \b لا تكفي وحدَها: نبحث عن الكلمةِ كما هي لا عن جزءٍ منها،
     فـ"pattern" لا تُلتقَط من "patterns"؟ بل تُلتقَط، وهو مقصود: السؤالُ
     يذكر الصيغةَ التي في القطعةِ نفسِها. */
  function findWord(text, w){
    var re = new RegExp("\\b" + w + "s?\\b", "i");
    var m = re.exec(text);
    return m ? m[0] : null;
  }

  var added = 0;
  R.forEach(function(p){
    if(!p || !p[0] || !Array.isArray(p[1])) return;
    var text = String(p[0]);
    for(var i = 0; i < V.length; i++){
      var row = V[i], shown = findWord(text, row[0]);
      if(!shown) continue;
      p[1].push([
        "The word " + shown + " in the passage is closest in meaning to:",
        [row[1], row[2], row[3], row[4]], 0,
        "اختر المعنى الذي يناسب السياق لا أشهرَ معاني الكلمة — والجواب من القطعة نفسها: أعِد قراءة الجملة التي فيها الكلمة. " +
        "وهذا أوّلُ مهاراتِ فهمِ المقروء في كُتيِّبِ قياس (Word Meaning)، وسؤالان من كلِّ تسعةٍ في قطعتِه النموذجيّة."
      ]);
      added++;
      return;   /* سؤالٌ واحدٌ لكلِّ قطعةٍ فلا تطغى على بقيّةِ المهارات */
    }
  });

  window.STEP_READING_CTX_N = added;

  /* ─────────── ٢) أفضلُ عنوانٍ للقطعة — Best Title ───────────
     كُتيِّبُ قياسٍ (ص ١٤): «As a general rule, reading passages are not
     given a title on the STEP test. Sometimes, though not always, you
     may be asked to select what you think is the best title for a
     passage.» و(ص ١٤ كذلك): «Questions that ask for a title or the
     general meaning of a passage are always the last questions about
     that passage.» وفي قطعةِ العيّنةِ سؤالٌ واحدٌ من تسعةٍ وهو آخرُها.

     وصوارفُه ليست عشوائيّةً، بل على نمطِ الكُتيِّب: عنوانٌ أضيقُ من
     القطعةِ (تفصيلٌ فيها)، وعنوانٌ أوسعُ منها (موضوعٌ عامّ)، وعنوانٌ
     يُحسِن الظنَّ بكلمةٍ وردت فيها ولا يُعبّر عن مقصدِها.

     وهي الآن للقطعِ الطوالِ وحدَها (١٣١–١٥٩ كلمة): قطعةٌ من ثمانٍ
     وخمسين كلمةً بفقرةٍ واحدةٍ لا يُسأل عن عنوانِها سؤالًا ذا معنى.
     وتُعمَّم متى أُلِّفت القطعُ الطوالُ (٤٠٠ كلمةٍ بفقراتٍ مرقّمة).

     والمفتاحُ عبارةٌ مميّزةٌ من نصِّ القطعةِ لا رقمُها في المصفوفة:
     لو زِيدت قطعةٌ في وسطِ الملفِّ لانزاحت الأرقامُ وعُلِّق على كلِّ
     قطعةٍ عنوانُ غيرِها في صمت. */
  var TITLES = [
    ["marked every death on a map",
     "Mapping Deaths to Find a Cause",
     "The Handle of the Broad Street Pump",
     "The History of Medicine in Europe",
     "How Bad Air Spreads Disease"],
    ["spoiled by a stray mould",
     "A Spoiled Dish That Others Had Thrown Away",
     "Keeping a Laboratory Bench Tidy",
     "The Story of Modern Science",
     "How Bacteria Are Grown in Dishes"],
    ["near the Egyptian town of Rosetta",
     "A Known Script Unlocks a Lost One",
     "Soldiers Digging Near Rosetta",
     "The Languages of the Ancient World",
     "Why Greek Replaced Egyptian Writing"],
    ["Alfred Wegener was a meteorologist",
     "An Outsider's Question About the Shape of the Coasts",
     "The Coastline of South America",
     "A History of the Earth Sciences",
     "Why Maps Are Often Inaccurate"],
    ["the smell reached the windows of Parliament",
     "A Smell That Finally Paid for the Sewers",
     "The Hot Summer of 1858",
     "The Growth of the City of London",
     "How Parliament Debates New Laws"],
    ["stomach ulcers were caused by stress",
     "A Bacterium Overturns a Settled Explanation",
     "Samples of Inflamed Stomach Tissue",
     "Advances in Australian Medicine",
     "Why Stress Makes People Ill"],
    ["finding how far east or west",
     "Finding East and West by Keeping Time",
     "How Sailors Measure the Height of the Sun",
     "The History of Travel by Sea",
     "Why Fleets Were Lost in Storms"],
    ["a scholar named Eratosthenes",
     "Measuring the Earth with a Shadow",
     "A Deep Well in a Southern Town",
     "Learning in the Ancient World",
     "How the Library at Alexandria Was Built"],
    ["Baghdad became a place where books",
     "Translation as Understanding, Not Copying",
     "The Price of Books in Silver",
     "The History of the Arabic Language",
     "How Scholars Travelled to Baghdad"],
    ["Richard Doll had expected to find the cause",
     "Expecting One Cause and Finding Another",
     "Interviews with Patients in London Hospitals",
     "The History of British Medicine",
     "How Motor Traffic Polluted Growing Cities"],
    ["printed books were made to look like manuscripts",
     "A New Technology Imitating the Old",
     "The Wide Margins of Early Printed Books",
     "The Invention of the Printing Press",
     "Why Scribes Refused to Use Printing"],
    ["Tycho Brahe spent twenty years",
     "Careful Measurements Outlive a Wrong Model",
     "Instruments Built on an Island Observatory",
     "The History of Astronomy",
     "How the Telescope Changed Observation"],
    ["a rubber seal in the joints lost its flexibility",
     "A Warning That Could Not Be Proved Precisely",
     "The Unusually Cold Night in Florida",
     "The History of Space Flight",
     "How Rubber Seals Are Manufactured"],
    ["a statistician named Abraham Wald",
     "Armour the Places with No Bullet Holes",
     "Where Returning Bombers Had Been Hit",
     "Statistics in the Second World War",
     "How Aircraft Armour Is Made"],
    ["the land above Pompeii was farmed",
     "The Ash That Destroyed a Town Also Preserved It",
     "The Unusually Rich Soil Above the Town",
     "The Volcanoes of Italy",
     "How Roman Towns Were Planned"],
    ["spent much of 1964 trying to get rid of a noise",
     "A Noise That Turned Out to Be the Signal",
     "Testing a Sensitive Antenna in New Jersey",
     "The History of Radio Engineering",
     "How to Remove Interference from Measurements"]
  ];

  var titled = 0, orphan = [];
  TITLES.forEach(function(row){
    var hit = null;
    for(var i = 0; i < R.length; i++){
      if(String(R[i][0]).indexOf(row[0]) >= 0){ hit = R[i]; break; }
    }
    if(!hit){ orphan.push(row[0]); return; }
    hit[1].push([
      "What is the best title for this passage?",
      [row[1], row[2], row[3], row[4]], 0,
      "أفضلُ عنوانٍ يشمل القطعةَ كلَّها ولا يزيد عليها: فما كان تفصيلًا فيها أضيقُ منها، وما كان موضوعًا عامًّا أوسعُ منها، وما التقط كلمةً وردت فيها ولم يُعبّر عن مقصدِها ليس عنوانًا. " +
      "وسؤالُ العنوانِ أو الفكرةِ العامّةِ في اختبارِ ستيبَ يكون دائمًا آخرَ أسئلةِ القطعة."
    ]);
    titled++;
  });
  window.STEP_READING_TITLE_N = titled;
  window.STEP_READING_TITLE_ORPHAN = orphan;



})();
