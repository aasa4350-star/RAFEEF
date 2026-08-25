/* توسعة ثانية لبنك القراءة والإملاء — تُدمج مع READING_EXTRA في reading.html.
   السبب: البنك الأول أعطى ١٦ قطعة و١٠ جُمل إملاء إنجليزي للكبار، وهي تنفد
   خلال أيام مع المراجعة اليومية فتتكرّر، فتقيس الحفظ لا الفهم.

   البنية:
     pass:      [نص القطعة, [[سؤال, [الصحيحة, خطأ, خطأ], 0], ...]]
     dictation: [جملة/كلمة, ...]   (الإنجليزي جُمل للكبار وكلمات للصغار)
   الإجابة الصحيحة تُكتب أوّلًا؛ الخيارات تُخلط عند العرض. */
window.READING_EXTRA2 = {

  /* ================= سعود — رابع ابتدائي ================= */
  saud: {
    en: {
      pass: [
        ["Nora has a red bag. She puts her books in it. She carries it to school every morning.",
          [["What color is the bag?",["red","blue","black"],0],["What does she put in it?",["her books","her toys","her food"],0],["Where does she carry it?",["to school","to the park","to the shop"],0]]],
        ["The cat sleeps on the warm mat. When it wakes up, it drinks milk. Then it plays with a ball.",
          [["Where does the cat sleep?",["on the mat","on a tree","in a box"],0],["What does it drink?",["milk","water","juice"],0],["What does it play with?",["a ball","a kite","a book"],0]]],
        ["Ali helps his mother in the kitchen. He washes the plates. His mother says thank you.",
          [["Where does Ali help?",["in the kitchen","in the garden","at school"],0],["What does he wash?",["the plates","the car","his shoes"],0],["What does his mother say?",["thank you","goodbye","hello"],0]]],
        ["The sun is bright today. The children play outside. They run and laugh together.",
          [["How is the sun?",["bright","dark","cold"],0],["Where do the children play?",["outside","inside","in bed"],0],["What do they do?",["run and laugh","sleep","cry"],0]]],
        ["My grandfather has a garden. He grows tomatoes and mint. He gives some to our neighbors.",
          [["What does grandfather have?",["a garden","a shop","a boat"],0],["What does he grow?",["tomatoes and mint","apples","rice"],0],["Who does he give some to?",["our neighbors","his teacher","a lion"],0]]],
        ["The rain falls on the roof. Sara looks out of the window. She sees a big rainbow.",
          [["Where does the rain fall?",["on the roof","in the car","on the bed"],0],["What does Sara look out of?",["the window","the door","a box"],0],["What does she see?",["a rainbow","a star","a plane"],0]]],
        ["Omar lost his pencil. He looked under the desk. He found it near his shoe.",
          [["What did Omar lose?",["his pencil","his bag","his book"],0],["Where did he look?",["under the desk","in the car","on the roof"],0],["Where did he find it?",["near his shoe","in his bag","at home"],0]]],
        ["We went to the zoo on Friday. We saw a tall giraffe and a sleepy lion. It was a fun day.",
          [["Where did we go?",["to the zoo","to school","to the sea"],0],["What did we see?",["a giraffe and a lion","cars","fish"],0],["How was the day?",["fun","bad","sad"],0]]]
      ],
      dictation: ["farm","milk","road","sand","gate","lamp","desk","clock","grass","cloud","train","plant","bread","chair","horse","river","stone","brush","shell","crown"]
    },
    ar: {
      pass: [
        ["ذَهَبَ سَعْدٌ إِلَى المَكْتَبَةِ، وَاسْتَعَارَ كِتَابًا عَنِ الفَضَاءِ. قَرَأَهُ فِي يَوْمَيْنِ، ثُمَّ أَعَادَهُ فِي مَوْعِدِهِ.",
          [["إِلَى أَيْنَ ذَهَبَ سَعْدٌ؟",["إلى المكتبة","إلى الحديقة","إلى السوق"],0],["عَنْ مَاذَا الكِتَابُ؟",["عن الفضاء","عن الطبخ","عن الرياضة"],0],["مَتَى أَعَادَهُ؟",["في موعده","بعد شهر","لم يُعِدْه"],0]]],
        ["تُحِبُّ لَيْلَى رَسْمَ الطُّيُورِ. تَأْخُذُ أَلْوَانَهَا وَتَجْلِسُ قُرْبَ النَّافِذَةِ، فَتَرْسُمُ مَا تَرَاهُ.",
          [["مَاذَا تُحِبُّ لَيْلَى؟",["رسم الطيور","الغناء","السباحة"],0],["أَيْنَ تَجْلِسُ؟",["قرب النافذة","على السطح","في السيارة"],0],["مَاذَا تَرْسُمُ؟",["ما تراه","بيتًا فقط","لا شيء"],0]]],
        ["النَّحْلَةُ حَشَرَةٌ نَشِيطَةٌ. تَجْمَعُ الرَّحِيقَ مِنَ الأَزْهَارِ، وَتَصْنَعُ مِنْهُ عَسَلًا نَافِعًا لِلنَّاسِ.",
          [["مَاذَا تَجْمَعُ النَّحْلَةُ؟",["الرحيق","الحجارة","الورق"],0],["مِنْ أَيْنَ تَجْمَعُهُ؟",["من الأزهار","من البحر","من الشجر اليابس"],0],["مَاذَا تَصْنَعُ؟",["عسلًا","حليبًا","خبزًا"],0]]],
        ["سَاعَدَ خَالِدٌ جَارَهُ العَجُوزَ فِي حَمْلِ أَغْرَاضِهِ. شَكَرَهُ الجَارُ وَدَعَا لَهُ بِالخَيْرِ.",
          [["مَنْ سَاعَدَ خَالِدٌ؟",["جاره العجوز","أخاه","معلّمه"],0],["فِي مَاذَا سَاعَدَهُ؟",["في حمل أغراضه","في الدراسة","في الطبخ"],0],["مَاذَا فَعَلَ الجَارُ؟",["شكره ودعا له","غضب","سكت"],0]]],
        ["فِي الصَّبَاحِ يَسْتَيْقِظُ الفَلَّاحُ مُبَكِّرًا. يَسْقِي زَرْعَهُ، وَيُطْعِمُ دَجَاجَهُ، ثُمَّ يَسْتَرِيحُ.",
          [["مَتَى يَسْتَيْقِظُ الفَلَّاحُ؟",["مبكرًا","ظهرًا","ليلًا"],0],["مَاذَا يَسْقِي؟",["زرعه","سيارته","بيته"],0],["مَاذَا يَفْعَلُ أَخِيرًا؟",["يستريح","ينام في الحقل","يسافر"],0]]],
        ["المَاءُ نِعْمَةٌ عَظِيمَةٌ. نَشْرَبُهُ وَنَتَوَضَّأُ بِهِ وَنَسْقِي بِهِ الزَّرْعَ، فَلَا نُسْرِفْ فِيهِ.",
          [["مَا المَاءُ؟",["نعمة عظيمة","شيء قليل الفائدة","لعبة"],0],["بِمَ نَسْقِي الزَّرْعَ؟",["بالماء","بالرمل","بالحليب"],0],["مَاذَا يَنْبَغِي عَلَيْنَا؟",["ألّا نُسرف فيه","أن نرميه","أن نبيعه"],0]]],
        ["اِشْتَرَى أَحْمَدُ دَرَّاجَةً جَدِيدَةً. رَكِبَهَا فِي الحَيِّ بِحَذَرٍ، وَلَبِسَ الخُوذَةَ لِيَحْمِيَ رَأْسَهُ.",
          [["مَاذَا اشْتَرَى أَحْمَدُ؟",["دراجة","سيارة","كتابًا"],0],["كَيْفَ رَكِبَهَا؟",["بحذر","بسرعة كبيرة","بلا انتباه"],0],["لِمَاذَا لَبِسَ الخُوذَةَ؟",["ليحمي رأسه","للزينة","ليجري"],0]]],
        ["فِي المَدْرَسَةِ تَعَلَّمْنَا النَّظَافَةَ. نَرْمِي الوَرَقَ فِي السَّلَّةِ، وَنُحَافِظُ عَلَى الفَصْلِ نَظِيفًا.",
          [["مَاذَا تَعَلَّمْنَا؟",["النظافة","السباحة","الطيران"],0],["أَيْنَ نَرْمِي الوَرَقَ؟",["في السلّة","على الأرض","في الحقيبة"],0],["عَلَى مَاذَا نُحَافِظُ؟",["على الفصل نظيفًا","على اللعب","على الضجيج"],0]]]
      ],
      dictation: ["مِفْتَاح","سَحَاب","غُرَاب","قِطَار","مِظَلَّة","حَقِيبَة","سَبُّورَة","فَرَاشَة","عَصِير","خَرُوف","نَافُورَة","مِنْشَفَة","مِلْعَقَة","صَحْرَاء","سَفِينَة","جَزَرَة","بُرْكَان","شَلَّال","أَرْنَب","قُنْفُذ"]
    }
  },

  /* ================= أسامة — خامس ابتدائي ================= */
  osama: {
    en: {
      pass: [
        ["Plants need sunlight, water and air to grow. Their leaves take in sunlight and make food for the whole plant.",
          [["What do plants need?",["sunlight, water and air","only sand","only wind"],0],["Which part takes in sunlight?",["the leaves","the roots","the seeds"],0],["What do the leaves make?",["food","stones","rain"],0]]],
        ["The camel can live in the desert for many days without water. Its hump stores fat, which gives it energy.",
          [["Where does the camel live?",["in the desert","in the sea","in the snow"],0],["What does the hump store?",["fat","water only","sand"],0],["What does the fat give?",["energy","colour","noise"],0]]],
        ["Ahmed saves part of his money every week. After three months he bought a bicycle he had wanted for a long time.",
          [["What does Ahmed do every week?",["saves part of his money","spends everything","borrows money"],0],["How long did he save?",["three months","one day","five years"],0],["What did he buy?",["a bicycle","a car","a phone"],0]]],
        ["Reading before sleeping helps the mind relax. It also improves our vocabulary and makes our imagination stronger.",
          [["When is reading helpful?",["before sleeping","while running","during exams only"],0],["What does it improve?",["our vocabulary","our height","our speed"],0],["What becomes stronger?",["our imagination","our shoes","our voice"],0]]],
        ["The Earth turns around itself once every twenty-four hours. This movement gives us day and night.",
          [["How long does one turn take?",["twenty-four hours","one week","one minute"],0],["What does this movement give us?",["day and night","summer only","rain"],0],["What turns?",["the Earth","the sun","the moon"],0]]],
        ["Team sports teach children how to cooperate. Players must listen to each other and follow simple rules to win.",
          [["What do team sports teach?",["how to cooperate","how to argue","how to hide"],0],["What must players do?",["listen and follow rules","play alone","shout"],0],["Why?",["to win","to lose","to rest"],0]]],
        ["Recycling paper saves trees. When we use both sides of a page, we help protect the forests around us.",
          [["What does recycling paper save?",["trees","cars","water only"],0],["What should we use?",["both sides of a page","one side only","no paper"],0],["What do we protect?",["the forests","the roads","the shops"],0]]],
        ["A healthy breakfast gives the body energy for the whole morning. Students who eat well concentrate better in class.",
          [["What does breakfast give?",["energy","sleep","noise"],0],["For how long?",["the whole morning","one minute","a week"],0],["Who concentrates better?",["students who eat well","students who skip it","no one"],0]]]
      ],
      dictation: ["The students visit the library every Sunday.","My father repairs the old car in the garage.","She always drinks a glass of milk before bed.","The teacher explained the lesson very clearly.","We planted five small trees in the school garden.","They are building a new bridge near the river.","He forgot his umbrella at his friend's house.","The museum opens at nine in the morning.","Our neighbours travelled to Egypt last winter.","I finished my homework before the sunset."]
    },
    ar: {
      pass: [
        ["الاِبْتِكَارُ لَا يَأْتِي فَجْأَةً، بَلْ يَحْتَاجُ إِلَى مُلَاحَظَةٍ وَتَجْرِبَةٍ وَصَبْرٍ. وَكَثِيرٌ مِنَ الاِخْتِرَاعَاتِ بَدَأَتْ بِسُؤَالٍ بَسِيطٍ.",
          [["كَيْفَ يَأْتِي الاِبْتِكَارُ؟",["بملاحظة وتجربة وصبر","فجأة بلا سبب","بالنوم"],0],["بِمَ بَدَأَتْ كَثِيرٌ مِنَ الاِخْتِرَاعَاتِ؟",["بسؤال بسيط","بالمال","بالحظّ"],0],["مَاذَا نَفْهَمُ مِنَ النَّصِّ؟",["أنّ الابتكار يحتاج جهدًا","أنّه سهل","أنّه مستحيل"],0]]],
        ["الجِبَالُ تُثَبِّتُ الأَرْضَ كَمَا يُثَبِّتُ الوَتَدُ الخَيْمَةَ. وَفِيهَا مَعَادِنُ كَثِيرَةٌ يَنْتَفِعُ بِهَا الإِنْسَانُ.",
          [["بِمَ شُبِّهَتِ الجِبَالُ؟",["بالوتد","بالبحر","بالسحاب"],0],["مَاذَا فِي الجِبَالِ؟",["معادن كثيرة","ماء فقط","رمل فقط"],0],["مَاذَا تَفْعَلُ الجِبَالُ لِلْأَرْضِ؟",["تثبّتها","تحرّكها","تسخّنها"],0]]],
        ["حِفْظُ اللِّسَانِ خُلُقٌ عَظِيمٌ. فَالكَلِمَةُ الطَّيِّبَةُ تَبْنِي، وَالكَلِمَةُ الجَارِحَةُ تَهْدِمُ مَا بَنَاهُ الوُدُّ فِي سِنِينَ.",
          [["مَا الخُلُقُ العَظِيمُ؟",["حفظ اللسان","كثرة الكلام","الصمت الدائم"],0],["مَاذَا تَفْعَلُ الكَلِمَةُ الطَّيِّبَةُ؟",["تبني","تهدم","لا تؤثّر"],0],["مَاذَا تَهْدِمُ الكَلِمَةُ الجَارِحَةُ؟",["ما بناه الودّ","الجدران","الأشجار"],0]]],
        ["يَعْتَمِدُ التَّخْطِيطُ النَّاجِحُ عَلَى تَحْدِيدِ الهَدَفِ أَوَّلًا، ثُمَّ تَقْسِيمِهِ إِلَى خُطُوَاتٍ صَغِيرَةٍ يُمْكِنُ إِنْجَازُهَا.",
          [["مَا أَوَّلُ خُطْوَةٍ فِي التَّخْطِيطِ؟",["تحديد الهدف","الاستعجال","النوم"],0],["مَاذَا نَفْعَلُ بِالهَدَفِ؟",["نقسّمه إلى خطوات صغيرة","نتركه","ننساه"],0],["لِمَاذَا؟",["ليمكن إنجازه","ليصعب","ليطول"],0]]],
        ["الطَّاقَةُ المُتَجَدِّدَةُ كَطَاقَةِ الشَّمْسِ وَالرِّيَاحِ لَا تَنْفَدُ، وَهِيَ أَنْظَفُ لِلْبِيئَةِ مِنَ الوَقُودِ القَدِيمِ.",
          [["مِنْ أَمْثِلَةِ الطَّاقَةِ المُتَجَدِّدَةِ:",["الشمس والرياح","الفحم","النفط"],0],["هَلْ تَنْفَدُ؟",["لا تنفد","تنفد بسرعة","تنفد في سنة"],0],["كَيْفَ هِيَ لِلْبِيئَةِ؟",["أنظف","أكثر تلويثًا","لا فرق"],0]]],
        ["قَالَ المُعَلِّمُ: مَنْ أَخْطَأَ فَاعْتَرَفَ فَقَدْ تَعَلَّمَ نِصْفَ الدَّرْسِ، وَمَنْ أَصْلَحَ خَطَأَهُ فَقَدْ أَتَمَّهُ.",
          [["مَنْ تَعَلَّمَ نِصْفَ الدَّرْسِ؟",["من أخطأ فاعترف","من سكت","من هرب"],0],["مَنْ أَتَمَّ الدَّرْسَ؟",["من أصلح خطأه","من نسيه","من كرّره"],0],["مَا مَوْضُوعُ النَّصِّ؟",["الاعتراف بالخطأ وإصلاحه","الغشّ","اللعب"],0]]],
        ["المُدُنُ الذَّكِيَّةُ تَسْتَخْدِمُ التِّقْنِيَةَ لِتَنْظِيمِ المُرُورِ وَتَوْفِيرِ الطَّاقَةِ، فَتُصْبِحُ الحَيَاةُ فِيهَا أَسْهَلَ.",
          [["مَاذَا تَسْتَخْدِمُ المُدُنُ الذَّكِيَّةُ؟",["التقنية","الخيول","الحطب"],0],["لِمَاذَا؟",["لتنظيم المرور وتوفير الطاقة","للزينة","للسفر"],0],["مَا النَّتِيجَةُ؟",["حياة أسهل","حياة أصعب","لا تغيير"],0]]],
        ["الصَّدِيقُ الصَّالِحُ يُذَكِّرُكَ إِذَا نَسِيتَ، وَيُعِينُكَ إِذَا ضَعُفْتَ، وَيَنْصَحُكَ سِرًّا لَا أَمَامَ النَّاسِ.",
          [["مَاذَا يَفْعَلُ الصَّدِيقُ إِذَا نَسِيتَ؟",["يذكّرك","يتركك","يضحك عليك"],0],["مَتَى يُعِينُكَ؟",["إذا ضعفت","إذا قويت فقط","لا يعينك"],0],["كَيْفَ يَنْصَحُكَ؟",["سرًّا","أمام الناس","بصوت عالٍ"],0]]]
      ],
      dictation: ["اِسْتِقْلَال","مُؤْتَمَر","إِنْجَاز","مَسْؤُول","تَطَوُّر","اِخْتِرَاع","مُبَادَرَة","تَضْحِيَة","اِسْتِثْمَار","مُسَاوَاة","اِنْضِبَاط","تَخْطِيط","مُثَابَرَة","اِسْتِنْتَاج","تَجْرِبَة","مَهَارَة","إِبْدَاع","تَوَاصُل","مَسْؤُولِيَّة","اِسْتِعْدَاد"]
    }
  },

  /* ================= رفيف — ثاني متوسط ================= */
  rafeef: {
    en: {
      pass: [
        ["Sleep is not wasted time. While we sleep, the brain sorts what we learned during the day and stores the important parts in memory.",
          [["What happens while we sleep?",["the brain sorts what we learned","the brain stops","we grow taller only"],0],["What is stored?",["the important parts","nothing","only dreams"],0],["What does the writer say about sleep?",["it is not wasted time","it is useless","it is dangerous"],0]]],
        ["Deserts receive very little rain, yet they are full of life. Many animals rest in the shade all day and search for food after sunset.",
          [["How much rain do deserts get?",["very little","a lot","none at all ever"],0],["When do many animals search for food?",["after sunset","at noon","at dawn only"],0],["What is surprising about deserts?",["they are full of life","they are empty","they are cold"],0]]],
        ["Ancient people used the stars to find their way at sea. Long before maps, sailors watched the sky and knew exactly which direction to follow.",
          [["What did ancient people use?",["the stars","phones","engines"],0],["Where did they travel?",["at sea","in space","underground"],0],["What did they have before maps?",["the sky","radios","satellites"],0]]],
        ["A small habit repeated daily beats a great effort made once. Progress is built slowly, and patience is what turns effort into skill.",
          [["What beats a great effort made once?",["a small daily habit","luck","speed"],0],["How is progress built?",["slowly","in one day","by accident"],0],["What turns effort into skill?",["patience","money","noise"],0]]],
        ["Honey never spoils. Jars of honey found in ancient tombs were still safe to eat, because honey contains almost no water for bacteria to live in.",
          [["What does the text say about honey?",["it never spoils","it spoils quickly","it is poisonous"],0],["Where were old jars found?",["in ancient tombs","in the sea","in the desert sand"],0],["Why does it not spoil?",["it contains almost no water","it is frozen","it is boiled"],0]]],
        ["Learning a second language changes the brain. Studies show that people who speak two languages switch between tasks more easily than others.",
          [["What does learning a language change?",["the brain","the eyes","the height"],0],["What can bilingual people do more easily?",["switch between tasks","run faster","sleep longer"],0],["Where does this information come from?",["studies","stories","dreams"],0]]],
        ["Volunteering helps others, but it also helps the volunteer. People who give their time report feeling happier and more connected to their community.",
          [["Who does volunteering help?",["others and the volunteer","only others","no one"],0],["How do volunteers feel?",["happier and more connected","tired and sad","angry"],0],["What do volunteers give?",["their time","their houses","their names"],0]]],
        ["The Arabic language is rich in synonyms. A single idea may be expressed by many words, each carrying a slightly different shade of meaning.",
          [["What is Arabic rich in?",["synonyms","letters only","numbers"],0],["How may one idea be expressed?",["by many words","by one word only","by signs"],0],["What does each word carry?",["a different shade of meaning","the same meaning exactly","no meaning"],0]]]
      ],
      dictation: ["The library was crowded during the examination week.","She apologised for arriving late to the meeting.","Scientists believe the ocean holds many undiscovered species.","My cousin has been living in Jeddah since 2019.","The committee agreed to postpone the decision.","Reading regularly improves both writing and thinking.","He was surprised by the sudden change in weather.","They have already submitted their research project.","The government announced a new environmental plan.","Success usually follows years of quiet preparation.","Our teacher encouraged us to ask difficult questions.","The bridge was damaged during the heavy storm.","She prefers walking to school rather than taking the bus.","Many students struggle with time management.","The photograph reminded him of his childhood."]
    },
    ar: {
      pass: [
        ["لَيْسَ التَّفَوُّقُ أَنْ تَسْبِقَ غَيْرَكَ، بَلْ أَنْ تَسْبِقَ نَفْسَكَ الَّتِي كُنْتَ عَلَيْهَا أَمْسِ. وَمَنْ قَاسَ نَفْسَهُ بِالنَّاسِ ضَاعَ، وَمَنْ قَاسَهَا بِأَمْسِهِ نَمَا.",
          [["مَا التَّفَوُّقُ فِي رَأْيِ الكَاتِبِ؟",["أن تسبق نفسك","أن تسبق غيرك","أن تنتظر"],0],["مَاذَا يَحْدُثُ لِمَنْ قَاسَ نَفْسَهُ بِالنَّاسِ؟",["يضيع","ينمو","يرتاح"],0],["مَا الفِكْرَةُ الرَّئِيسَةُ؟",["المقارنة الصحيحة تكون بالنفس","مدح المنافسة","ذمّ التعلّم"],0]]],
        ["اللُّغَةُ وِعَاءُ الفِكْرِ؛ فَكُلَّمَا اتَّسَعَتْ حَصِيلَةُ الإِنْسَانِ مِنَ الأَلْفَاظِ اتَّسَعَتْ قُدْرَتُهُ عَلَى التَّعْبِيرِ الدَّقِيقِ عَنْ مَعَانِيهِ.",
          [["بِمَ شُبِّهَتِ اللُّغَةُ؟",["بوعاء الفكر","بالماء","بالطريق"],0],["مَاذَا يَحْدُثُ إِذَا اتَّسَعَتِ الحَصِيلَةُ؟",["تتّسع القدرة على التعبير","يقلّ الفهم","يصعب الكلام"],0],["أَيُّ عِبَارَةٍ تُلَخِّصُ النَّصَّ؟",["سعة الألفاظ تعني دقّة التعبير","اللغة صعبة","الفكر بلا لغة"],0]]],
        ["يَقُومُ المَنْهَجُ العِلْمِيُّ عَلَى المُلَاحَظَةِ ثُمَّ الفَرَضِيَّةِ ثُمَّ التَّجْرِبَةِ. وَمَا لَمْ يَخْضَعْ لِلتَّجْرِبَةِ يَبْقَى رَأْيًا لَا حَقِيقَةً.",
          [["مَا أَوَّلُ خُطُوَاتِ المَنْهَجِ العِلْمِيِّ؟",["الملاحظة","التجربة","النتيجة"],0],["مَاذَا يَبْقَى مَا لَمْ يَخْضَعْ لِلتَّجْرِبَةِ؟",["رأيًا لا حقيقة","حقيقة مؤكّدة","قانونًا"],0],["مَا مَوْضُوعُ النَّصِّ؟",["خطوات المنهج العلمي","تاريخ العلماء","أدوات المختبر"],0]]],
        ["كَانَ العَرَبُ يَحْفَظُونَ أَنْسَابَهُمْ وَأَشْعَارَهُمْ فِي صُدُورِهِمْ قَبْلَ التَّدْوِينِ، فَكَانَتِ الذَّاكِرَةُ عِنْدَهُمْ مَكْتَبَةً مُتَنَقِّلَةً.",
          [["أَيْنَ كَانَ العَرَبُ يَحْفَظُونَ أَشْعَارَهُمْ؟",["في صدورهم","في الكتب","على الجدران"],0],["بِمَ شُبِّهَتِ الذَّاكِرَةُ؟",["بمكتبة متنقّلة","بصندوق مغلق","بنهر"],0],["مَتَى كَانَ ذَلِكَ؟",["قبل التدوين","بعد الطباعة","اليوم"],0]]],
        ["لَا تُقَاسُ قِيمَةُ المَعْلُومَةِ بِكَثْرَتِهَا بَلْ بِصِحَّتِهَا. وَفِي زَمَنِ الشَّبَكَاتِ صَارَ التَّحَقُّقُ مِنَ المَصْدَرِ مَهَارَةً لَا تَقِلُّ عَنِ القِرَاءَةِ نَفْسِهَا.",
          [["بِمَ تُقَاسُ قِيمَةُ المَعْلُومَةِ؟",["بصحّتها","بكثرتها","بطولها"],0],["مَا المَهَارَةُ الَّتِي صَارَتْ مُهِمَّةً؟",["التحقّق من المصدر","الحفظ السريع","النسخ"],0],["مَا الفِكْرَةُ الرَّئِيسَةُ؟",["التحقّق أهمّ من الكثرة","الإنترنت ضارّ","القراءة كافية"],0]]],
        ["الاِعْتِذَارُ لَا يُنْقِصُ صَاحِبَهُ، بَلْ يَدُلُّ عَلَى شَجَاعَةٍ فِي مُوَاجَهَةِ الخَطَأِ. وَأَصْعَبُ الاِعْتِذَارِ مَا كَانَ لِمَنْ هُوَ دُونَكَ.",
          [["مَاذَا يَدُلُّ عَلَيْهِ الاِعْتِذَارُ؟",["الشجاعة","الضعف","الجهل"],0],["أَيُّ اعْتِذَارٍ أَصْعَبُ؟",["ما كان لمن هو دونك","ما كان لمن هو أعلى","لا فرق"],0],["مَا الَّذِي يَنْفِيهِ الكَاتِبُ؟",["أنّ الاعتذار ينقص صاحبه","أنّ الخطأ وارد","أنّ الشجاعة مهمّة"],0]]],
        ["الوَقْتُ رَأْسُ مَالِ الإِنْسَانِ، وَهُوَ العُمْلَةُ الوَحِيدَةُ الَّتِي تُنْفَقُ وَلَا تُسْتَرَدُّ. لِذَلِكَ كَانَ تَنْظِيمُهُ عُنْوَانَ النُّضْجِ.",
          [["بِمَ وُصِفَ الوَقْتُ؟",["رأس مال الإنسان","شيئًا هيّنًا","عبئًا"],0],["مَا الَّذِي يُمَيِّزُ الوَقْتَ؟",["يُنفق ولا يُستردّ","يعود دائمًا","يُشترى"],0],["مَاذَا يَدُلُّ تَنْظِيمُ الوَقْتِ عَلَيْهِ؟",["النضج","الكسل","الحظّ"],0]]],
        ["يَخْتَلِفُ الحِفْظُ عَنِ الفَهْمِ؛ فَالحِفْظُ نَقْلٌ لِلْأَلْفَاظِ، وَالفَهْمُ قُدْرَةٌ عَلَى إِعَادَةِ صِيَاغَتِهَا وَتَطْبِيقِهَا فِي مَوَاضِعَ جَدِيدَةٍ.",
          [["مَا الحِفْظُ؟",["نقل للألفاظ","إعادة صياغة","تطبيق"],0],["مَا عَلَامَةُ الفَهْمِ؟",["التطبيق في مواضع جديدة","التكرار","السرعة"],0],["مَا مَوْضُوعُ النَّصِّ؟",["الفرق بين الحفظ والفهم","فضل الحفظ","ذمّ الدراسة"],0]]]
      ],
      dictation: ["اِسْتِطَاعَ العُلَمَاءُ تَفْسِيرَ ظَاهِرَةٍ غَامِضَةٍ.","إِنَّ المُثَابَرَةَ سَبِيلُ المُتَفَوِّقِينَ.","اِزْدَادَتْ مَسْؤُولِيَّاتُهُ بَعْدَ التَّخَرُّجِ.","لَا يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ.","اِسْتَقْبَلَتِ المَدِينَةُ زُوَّارًا مِنْ شَتَّى البِلَادِ.","الاِخْتِرَاعُ ثَمَرَةُ سُؤَالٍ لَمْ يَجِدْ جَوَابًا.","تَحْتَاجُ البِيئَةُ إِلَى وَعْيٍ جَمَاعِيٍّ لَا فَرْدِيٍّ.","أَثْمَرَتْ تَجْرِبَتُهُ بَعْدَ سِنِينَ مِنَ الصَّبْرِ.","اِسْتَخْلَصَ البَاحِثُ نَتِيجَةً مُهِمَّةً.","مَنْ تَأَنَّى أَدْرَكَ مَا تَمَنَّى."]
    }
  },

  /* ================= حسن — ثالث متوسط ================= */
  hasan: {
    en: {
      pass: [
        ["Artificial intelligence can process enormous amounts of data in seconds, but it still depends on humans to decide which questions are worth asking.",
          [["What can AI do quickly?",["process enormous amounts of data","feel emotions","replace judgement"],0],["What does it depend on humans for?",["deciding which questions matter","electricity only","translation"],0],["What is the writer's main point?",["AI is powerful but still needs human direction","AI is useless","humans are unnecessary"],0]]],
        ["Coral reefs cover less than one percent of the ocean floor, yet they shelter about a quarter of all marine species. Rising sea temperatures now threaten them.",
          [["How much of the ocean floor do reefs cover?",["less than one percent","half","most of it"],0],["What proportion of marine species do they shelter?",["about a quarter","none","all"],0],["What threatens them?",["rising sea temperatures","too much rain","strong wind"],0]]],
        ["The invention of printing changed history. Ideas that once travelled slowly by hand could suddenly reach thousands of readers, and knowledge stopped being a privilege of the few.",
          [["What changed history?",["the invention of printing","the wheel","the telescope"],0],["How did ideas travel before?",["slowly by hand","by radio","instantly"],0],["What stopped being a privilege of the few?",["knowledge","food","travel"],0]]],
        ["Critical thinking begins with a simple habit: asking for evidence. A claim repeated a thousand times does not become true, and confidence is not the same as proof.",
          [["What habit begins critical thinking?",["asking for evidence","repeating claims","staying silent"],0],["Does repetition make a claim true?",["no","yes","sometimes always"],0],["What is confidence not the same as?",["proof","speech","effort"],0]]],
        ["Deep beneath the Sahara lies one of the largest underground water reserves on Earth. It was filled thousands of years ago, when the region was green and rainy.",
          [["What lies beneath the Sahara?",["a huge underground water reserve","an ocean","a forest"],0],["When was it filled?",["thousands of years ago","last year","never"],0],["What was the region like then?",["green and rainy","dry","frozen"],0]]],
        ["Economists note that people often value what they already own more than its market price. This bias explains why sellers ask for more than buyers are willing to pay.",
          [["What do people overvalue?",["what they already own","what others own","nothing"],0],["What does this bias explain?",["why sellers ask for more","why prices fall","why markets close"],0],["Who studies this?",["economists","doctors","engineers"],0]]],
        ["Failure is data, not judgement. Each unsuccessful attempt removes one wrong path, and the person who has failed carefully knows more than the one who never tried.",
          [["How does the writer describe failure?",["as data","as shame","as the end"],0],["What does each attempt remove?",["one wrong path","all hope","the goal"],0],["Who knows more?",["the one who failed carefully","the one who never tried","neither"],0]]],
        ["Ibn Khaldun argued that civilisations rise through solidarity and decline when comfort weakens it. His work is considered an early foundation of social science.",
          [["What makes civilisations rise?",["solidarity","wealth alone","war only"],0],["What weakens solidarity?",["comfort","hardship","study"],0],["What is his work considered?",["an early foundation of social science","a novel","a poem"],0]]]
      ],
      dictation: ["The committee unanimously approved the proposed amendment.","Researchers emphasised the significance of preliminary evidence.","She had been studying abroad before the pandemic began.","Had they consulted an expert, the outcome would have differed.","The manuscript was translated into seventeen languages.","Environmental degradation threatens future generations.","His argument was persuasive although it lacked statistics.","The archaeologist uncovered artefacts dating back centuries.","Consistency matters more than occasional brilliance.","Not only did he apologise, but he also corrected the error.","The phenomenon remains largely unexplained by scientists.","Several factors contributed to the unexpected decline.","She was awarded a scholarship for her outstanding achievement.","The negotiations concluded without a definitive agreement.","Technology has fundamentally reshaped modern communication."]
    },
    ar: {
      pass: [
        ["الحُرِّيَّةُ الحَقِيقِيَّةُ لَيْسَتْ فِعْلَ مَا تَشَاءُ، بَلِ القُدْرَةُ عَلَى الاِمْتِنَاعِ عَمَّا تَشْتَهِي حِينَ يَكُونُ ضَارًّا. فَمَنْ مَلَكَ نَفْسَهُ فَهُوَ الحُرُّ حَقًّا.",
          [["مَا الحُرِّيَّةُ الحَقِيقِيَّةُ؟",["القدرة على الامتناع عمّا يضرّ","فعل كلّ ما تشاء","ترك العمل"],0],["مَنِ الحُرُّ حَقًّا؟",["من ملك نفسه","من ملك المال","من لا قيود عليه"],0],["مَا الفِكْرَةُ الرَّئِيسَةُ؟",["ضبط النفس جوهر الحرّية","الحرّية بلا حدود","الحرّية مستحيلة"],0]]],
        ["يُخْطِئُ مَنْ يَظُنُّ أَنَّ التَّارِيخَ سَرْدٌ لِلْأَحْدَاثِ فَحَسْبُ؛ فَهُوَ فِي حَقِيقَتِهِ تَحْلِيلٌ لِأَسْبَابِ صُعُودِ الأُمَمِ وَسُقُوطِهَا، وَعِبْرَةٌ لِمَنْ يَقْرَأُ.",
          [["مَا التَّارِيخُ فِي حَقِيقَتِهِ؟",["تحليل لأسباب الصعود والسقوط","سرد للأحداث فقط","قصص خيالية"],0],["لِمَنِ العِبْرَةُ؟",["لمن يقرأ","للحكّام فقط","لا أحد"],0],["مَاذَا يَنْفِي الكَاتِبُ؟",["أنّ التاريخ سرد فحسب","أنّ التاريخ مفيد","أنّ الأمم تسقط"],0]]],
        ["إِنَّ أَخْطَرَ مَا يُوَاجِهُ الشَّبَابَ اليَوْمَ لَيْسَ نَقْصَ المَعْلُومَاتِ، بَلْ فَيْضَهَا دُونَ أَدَاةٍ لِتَمْيِيزِ صَحِيحِهَا مِنْ زَائِفِهَا.",
          [["مَا أَخْطَرُ مَا يُوَاجِهُ الشَّبَابَ؟",["فيض المعلومات بلا أداة تمييز","نقص المعلومات","قلّة الكتب"],0],["مَا الأَدَاةُ النَّاقِصَةُ؟",["تمييز الصحيح من الزائف","سرعة الحفظ","كثرة القراءة"],0],["أَيُّ عُنْوَانٍ يُنَاسِبُ النَّصَّ؟",["أزمة التمييز لا أزمة المعرفة","فضل الإنترنت","ذمّ الشباب"],0]]],
        ["لَمْ تَقُمْ حَضَارَةٌ عَلَى الاِسْتِهْلَاكِ وَحْدَهُ؛ فَالأُمَمُ الَّتِي تَصْنَعُ تَبْقَى، وَالَّتِي تَكْتَفِي بِالشِّرَاءِ تَظَلُّ تَابِعَةً مَهْمَا اتَّسَعَتْ أَسْوَاقُهَا.",
          [["عَلَامَ لَا تَقُومُ الحَضَارَةُ؟",["على الاستهلاك وحده","على الصناعة","على العلم"],0],["أَيُّ الأُمَمِ تَبْقَى؟",["التي تصنع","التي تشتري","التي تستورد"],0],["مَاذَا يَحْدُثُ لِمَنْ يَكْتَفِي بِالشِّرَاءِ؟",["يظلّ تابعًا","يصبح قائدًا","يزدهر"],0]]],
        ["يَرَى عُلَمَاءُ النَّفْسِ أَنَّ الدَّافِعَ الدَّاخِلِيَّ أَبْقَى أَثَرًا مِنَ المُكَافَأَةِ الخَارِجِيَّةِ؛ فَمَنْ تَعَلَّمَ حُبًّا لِلْعِلْمِ اسْتَمَرَّ، وَمَنْ تَعَلَّمَ طَلَبًا لِلْجَائِزَةِ تَوَقَّفَ حِينَ تَنْتَهِي.",
          [["أَيُّهُمَا أَبْقَى أَثَرًا؟",["الدافع الداخلي","المكافأة الخارجية","كلاهما سواء"],0],["مَتَى يَتَوَقَّفُ طَالِبُ الجَائِزَةِ؟",["حين تنتهي الجائزة","أبدًا","في البداية"],0],["مَا الفِكْرَةُ الرَّئِيسَةُ؟",["الدافع الداخلي أدوم للتعلّم","الجوائز ضارّة دائمًا","التعلّم صعب"],0]]],
        ["البَلَاغَةُ لَيْسَتْ تَكَلُّفَ الغَرِيبِ مِنَ الأَلْفَاظِ، وَإِنَّمَا هِيَ إِصَابَةُ المَعْنَى بِأَقْرَبِ لَفْظٍ وَأَوْضَحِهِ فِي المَقَامِ المُنَاسِبِ.",
          [["مَا البَلَاغَةُ؟",["إصابة المعنى بأوضح لفظ","تكلّف الغريب","إطالة الكلام"],0],["مَاذَا تَنْفِي العِبَارَةُ؟",["أنّ البلاغة تكلّف الغريب","أنّ الوضوح مهمّ","أنّ المقام يؤثّر"],0],["مَا شَرْطُ اللَّفْظِ؟",["أن يناسب المقام","أن يكون غريبًا","أن يكون طويلًا"],0]]],
        ["حِينَ تَفْشَلُ التَّجْرِبَةُ يَظُنُّ المُتَعَجِّلُ أَنَّهُ خَسِرَ، وَالحَقُّ أَنَّهُ رَبِحَ مَعْرِفَةَ طَرِيقٍ مَسْدُودٍ، وَهَذَا نِصْفُ الاِكْتِشَافِ.",
          [["مَاذَا يَظُنُّ المُتَعَجِّلُ؟",["أنّه خسر","أنّه ربح","أنّه انتهى"],0],["مَاذَا رَبِحَ فِي الحَقِيقَةِ؟",["معرفة طريق مسدود","مالًا","وقتًا"],0],["بِمَ وُصِفَ ذَلِكَ؟",["نصف الاكتشاف","خسارة كاملة","عبثًا"],0]]],
        ["تَتَجَاوَزُ وَظِيفَةُ المَدْرَسَةِ نَقْلَ المَعْلُومَاتِ إِلَى بِنَاءِ عَادَاتٍ عَقْلِيَّةٍ: الدِّقَّةِ فِي الحُكْمِ، وَالصَّبْرِ عَلَى الغُمُوضِ، وَالجُرْأَةِ فِي السُّؤَالِ.",
          [["مَا وَظِيفَةُ المَدْرَسَةِ الأَشْمَلُ؟",["بناء عادات عقلية","نقل المعلومات فقط","توزيع الكتب"],0],["مِنَ العَادَاتِ المَذْكُورَةِ:",["الصبر على الغموض","السرعة في الحكم","تجنّب السؤال"],0],["مَا الفِكْرَةُ الرَّئِيسَةُ؟",["التعليم أوسع من التلقين","المدرسة غير مهمّة","المعلومات كافية"],0]]]
      ],
      dictation: ["اِسْتَنْبَطَ الفُقَهَاءُ أَحْكَامًا مِنَ النُّصُوصِ.","لَا يُدْرِكُ المَجْدَ إِلَّا مَنْ صَبَرَ عَلَى مَرَارَتِهِ.","تَتَجَلَّى عَظَمَةُ الأُمَمِ فِي إِنْجَازَاتِهَا العِلْمِيَّةِ.","اِسْتَشْهَدَ البَاحِثُ بِمَرَاجِعَ مُتَعَدِّدَةٍ.","إِنَّ الظَّوَاهِرَ الطَّبِيعِيَّةَ تَخْضَعُ لِقَوَانِينَ دَقِيقَةٍ.","اِزْدَهَرَتِ الحَضَارَةُ الإِسْلَامِيَّةُ بِالتَّرْجَمَةِ وَالتَّأْلِيفِ.","لَمْ يَكُنِ التَّقَدُّمُ وَلِيدَ صُدْفَةٍ بَلْ ثَمَرَةَ تَخْطِيطٍ.","اِسْتَخْلَصَ الدَّارِسُونَ نَتَائِجَ مُتَبَايِنَةً.","تَقْتَضِي الأَمَانَةُ العِلْمِيَّةُ نِسْبَةَ القَوْلِ إِلَى قَائِلِهِ.","مَنِ اسْتَعْجَلَ الشَّيْءَ قَبْلَ أَوَانِهِ عُوقِبَ بِحِرْمَانِهِ."]
    }
  }
};
