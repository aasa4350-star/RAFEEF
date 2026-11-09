/* ═══ قطعُ القراءةِ لأسامة — خامس ابتدائيّ ═══════════════════════════
   سؤالُ الأب (٩ نوفمبر ٢٠٢٦) ومعه صورةُ شاشتِه: «أسامة قطعته قصيرة
   جدًّا ليش؟؟». والقطعةُ التي رآها: «Recycling paper saves trees…» —
   ثلاثٌ وعشرون كلمة.

   والجوابُ في سطرٍ واحدٍ من الشِّفرة: READING_MINWORDS فيها حسنٌ ٦٠
   ورفيفُ ٦٠ وفهدٌ ١٠٠ وسعودٌ ٤٠ — **وليس فيها أسامة**. فكلُّ إخوتِه
   لهم حدٌّ أدنى لطولِ القطعةِ وهو وحدَه بلا حدّ. وقُيست بنوكُهم بعد
   الدمج:

     سعود    ١٨ قطعة · ٥٦–٦٤ كلمة
     أسامة   ٢٢ قطعة · ١٦–٣١ كلمة   ← وهو أكبرُ من سعودٍ بسنة
     رفيف    ١٨ قطعة · ١١٧–١٣١
     حسن     ١٩ قطعة · ١٤٣–١٦٨
     فهد     ٣٦ قطعة · ١٣١–١٦٩

   فأخوه الأصغرُ يقرأ ثلاثةَ أضعافِ ما يقرؤه. ولا يكفي أن يُوضَع له
   حدٌّ: أطولُ قطعةٍ في بنكِه كلِّه إحدى وثلاثون كلمة، فالحدُّ وحدَه
   يُفرِغ القائمةَ. فلزم أن تُكتَب له قطعٌ.

   وهذه عشرٌ إنجليزيّةٌ وعشرٌ عربيّة، كلٌّ ٦٥–٩٠ كلمة: فوقَ سعودٍ بقليلٍ
   ودونَ رفيفَ بكثير، وهو موضعُه بينهما. ولكلِّ قطعةٍ أربعةُ أسئلة:
   ثلاثةٌ حرفيّةٌ وواحدٌ استنتاجٌ أو فكرةٌ رئيسة — ودون خمسةِ حسنٍ لأنّه
   خامسٌ ابتدائيّ.

   والمواضيعُ قُوبِلت بقطعِه الاثنتين والعشرين قبل الكتابة، فليس فيها
   مكتبةٌ ولا جملٌ ولا إعادةُ تدويرٍ ولا مزرعةٌ ولا ماءٌ ولا حيوانات —
   وهي مواضيعُ بنكِه القائم.

   البنية كبنيةِ reading-long.js:
     pass: [نصّ القطعة, [[سؤال, [الصحيحة, خطأ, خطأ], 0], …]]
   الإجابةُ الصحيحةُ أوّلًا، وتُخلَط عند العرض.
   والعربيُّ بلا شكلٍ كامل، كبقيّةِ بنوكِ القراءة. */
window.READING_OSAMA = {
 osama: {
  en: { pass: [

["Sami wanted to learn to ride a bicycle. On the first day he fell twice and his knee hurt. He wanted to stop, but his sister told him that every rider in the world had fallen at the beginning. The next day he tried again and rode for ten metres before he stopped. By the end of the week he could ride all the way to the corner shop and back. He still remembered the two falls, but now they made him smile.",
 [["What did Sami want to learn?",["to ride a bicycle","to swim","to cook"],0],
  ["What happened on the first day?",["he fell twice","he rode to the shop","he won a race"],0],
  ["Who encouraged him to keep trying?",["his sister","his teacher","his neighbour"],0],
  ["What is the main idea of the story?",["learning something new takes practice and patience","bicycles are dangerous","sisters are always right"],0]]],

["The honey bee is a very busy insect. A single bee visits about two thousand flowers in one day, but it makes only a small drop of honey in its whole life. Bees live together in a hive, and each bee has a job. Some clean the hive, some guard the door, and some fly out to find flowers. When a bee finds a good field, it returns and dances in the air to tell the others where to go.",
 [["How many flowers does one bee visit in a day?",["about two thousand","about ten","about one million"],0],
  ["How much honey does one bee make in its life?",["a small drop","a full jar","a kilogram"],0],
  ["How does a bee tell others where the flowers are?",["it dances in the air","it writes a map","it shouts loudly"],0],
  ["What does the passage show about bees?",["they work together and each one has a task","they are lazy","they live alone"],0]]],

["Long ago, people could not tell the time at night. Then someone thought of the water clock. It was a bowl with a very small hole in the bottom. The bowl was filled with water, and the water dripped out slowly. Lines were drawn inside the bowl, and when the water fell to the next line, one hour had passed. The water clock worked in the dark and in cloudy weather, so it was better than the sundial.",
 [["What was the water clock made from?",["a bowl with a small hole","a long stick","a glass window"],0],
  ["How did people know an hour had passed?",["the water fell to the next line","a bell rang","the bowl turned over"],0],
  ["Why was it better than a sundial?",["it worked at night and in cloudy weather","it was smaller","it was made of gold"],0],
  ["What problem did the water clock solve?",["telling the time when there was no sun","carrying water","lighting a room"],0]]],

["Our neighbour Abu Yousef grows vegetables on the roof of his house. He uses old plastic boxes filled with soil. In the spring he plants tomatoes and mint, and in the autumn he plants carrots. He says the roof gets more sun than any garden in the street. Last month he gave every family on our street a bag of tomatoes, and my mother used them to make soup. Now two other neighbours have started roof gardens of their own.",
 [["Where does Abu Yousef grow his vegetables?",["on the roof of his house","in a large field","inside his kitchen"],0],
  ["What does he plant in the autumn?",["carrots","tomatoes","mint"],0],
  ["Why does he say the roof is good?",["it gets more sun than any garden in the street","it is quiet","it is close to the water"],0],
  ["What happened after he gave away the tomatoes?",["two neighbours started roof gardens","he stopped planting","the street closed"],0]]],

["The desert fox has very large ears, and there is a good reason for them. Heat leaves the body through the ears, so the big ears keep the fox cool in the hot sand. The ears also help it hear very small sounds. At night the fox walks slowly over the sand and listens. When it hears an insect moving under the surface, it digs quickly with its front legs. The fox sleeps in a hole during the day, when the sun is strongest.",
 [["What is special about the desert fox?",["it has very large ears","it has no tail","it is blue"],0],
  ["How do the big ears help in the heat?",["heat leaves the body through them","they hold water","they make shade"],0],
  ["What does the fox do when it hears an insect?",["it digs quickly with its front legs","it runs away","it calls other foxes"],0],
  ["When does the fox sleep?",["during the day, when the sun is strongest","at midnight","it never sleeps"],0]]],

["My grandfather keeps a small notebook in his pocket. Every time he learns something new, he writes one line in it. He has done this for forty years. Last week he showed me a page from 1990 about how to fix a broken chair. He told me that writing a thing down once is better than reading it ten times. Now I keep a notebook too. It is not full yet, but I have written eleven lines in it.",
 [["What does the grandfather keep in his pocket?",["a small notebook","a radio","a hammer"],0],
  ["How long has he been doing this?",["forty years","four years","four months"],0],
  ["What was on the page from 1990?",["how to fix a broken chair","a shopping list","a map"],0],
  ["What did the grandfather believe?",["writing a thing once is better than reading it ten times","notebooks are expensive","chairs break easily"],0]]],

["A ship is made of heavy steel, so why does it float? The answer is shape. A ball of steel sinks because it pushes very little water away. But a ship is wide and hollow, so it pushes a great amount of water to the side. The water pushes back, and that push holds the ship up. You can try this at home: a small piece of clay sinks, but if you press the same clay into the shape of a bowl, it will float.",
 [["What is a ship made of?",["heavy steel","light wood only","paper"],0],
  ["Why does a ball of steel sink?",["it pushes very little water away","it is too light","it is hollow"],0],
  ["What holds the ship up?",["the push of the water","the wind","a rope"],0],
  ["What happens to clay shaped like a bowl?",["it floats","it sinks faster","it melts"],0]]],

["In 1854 a doctor in London studied a disease that was killing many people. Everyone believed it came from bad air. The doctor did not argue; instead he drew a map. He marked every house where someone had died. The marks gathered around one water pump in one street. He asked the council to remove the handle of that pump so nobody could use it, and the deaths in that street stopped. His map changed the way people thought about disease.",
 [["What did most people believe caused the disease?",["bad air","dirty water","cold weather"],0],
  ["What did the doctor do instead of arguing?",["he drew a map of the deaths","he wrote a letter","he left the city"],0],
  ["What did the marks on the map gather around?",["one water pump","one school","one hospital"],0],
  ["Why is this story important?",["careful evidence can change what people believe","maps are beautiful","pumps are dangerous"],0]]],

["Khalid and his class planted twenty young trees beside the school wall in October. Each student took one tree and promised to water it twice a week. By January four trees had died, because four students forgot. The teacher did not blame anyone. She said that a promise made in a group is easy to forget, so they made a chart on the wall with every name and every week. By June the sixteen remaining trees were taller than Khalid.",
 [["How many trees did the class plant?",["twenty","four","sixteen"],0],
  ["Why did four trees die?",["four students forgot to water them","there was no rain","the soil was bad"],0],
  ["What did the teacher do about it?",["she made a chart with every name and week","she punished the students","she removed the trees"],0],
  ["What does the story suggest?",["a clear record helps people keep a promise","trees should not be planted","teachers should blame students"],0]]],

["The first bicycle had no pedals. It was built in Germany about two hundred years ago, and the rider pushed the ground with his feet to move forward. People laughed at it and called it a running machine. Forty years later someone added pedals to the front wheel, and later someone else added a chain so that the pedals could turn the back wheel. Each person changed only one part, but together they built the bicycle we ride today.",
 [["What did the first bicycle not have?",["pedals","wheels","a seat"],0],
  ["How did the rider move it forward?",["he pushed the ground with his feet","he used a motor","he pulled a rope"],0],
  ["What was added forty years later?",["pedals on the front wheel","a chain","lights"],0],
  ["What is the main idea?",["a big invention is built from many small changes","bicycles are old","Germany is a large country"],0]]]

  ] },
  ar: { pass: [

["استيقظ ماجد مبكرا ليساعد أباه في المحل. كان عمله أن يرتب العلب على الرف، فبدأ يضعها كما اتفقت يده. وفي المساء جاء زبون يسأل عن نوع واحد من العسل، فبحث ماجد عشر دقائق ولم يجده. في اليوم التالي رتب العلب حسب الحروف، فصار يجد أي علبة في ثوان. قال له أبوه: الترتيب ليس جمالا للرف، بل وقتا يوفره عليك.",
 [["ماذا كان عمل ماجد في المحل؟",["ترتيب العلب على الرف","بيع الخبز","تنظيف الأرض"],0],
  ["كم استغرق بحثه عن علبة العسل؟",["عشر دقائق","دقيقة واحدة","ساعتين"],0],
  ["كيف رتب العلب في اليوم التالي؟",["حسب الحروف","حسب اللون","حسب الحجم"],0],
  ["ما الفكرة التي أراد الأب أن يعلمها لابنه؟",["الترتيب يوفر الوقت","المحل يحتاج رفوفا جديدة","العسل غال"],0]]],

["النخلة شجرة لا يضيع منها شيء. من ثمرها التمر الذي يؤكل طريا ويابسا، ومن جذعها يصنع سقف البيت، ومن سعفها تصنع السلال والحصر، ومن ليفها يصنع الحبل. وهي تصبر على الحر وقلة الماء، وتعيش مئة سنة وأكثر. ولذلك سماها الناس قديما شجرة الحياة، وجعلوها في بلادنا علامة على الكرم والصبر معا.",
 [["ماذا يصنع من سعف النخلة؟",["السلال والحصر","الحبل","سقف البيت"],0],
  ["كم تعيش النخلة؟",["مئة سنة وأكثر","عشر سنوات","سنة واحدة"],0],
  ["لماذا سماها الناس شجرة الحياة؟",["لأنه لا يضيع منها شيء","لأنها قصيرة","لأنها تنبت في الماء"],0],
  ["على أي شيء جعلها الناس علامة؟",["الكرم والصبر","السرعة","الغنى"],0]]],

["سألت المعلمة تلاميذها: من منكم يعرف كم خطوة بين باب الفصل وباب المدرسة؟ فلم يجب أحد. قالت: عدوها غدا. في اليوم التالي جاء كل تلميذ برقم يخالف رقم صاحبه. فضحكوا، فقالت لهم: لم يخطئ أحد منكم، فخطوة الطويل ليست كخطوة القصير. ولهذا اتفق الناس على وحدات ثابتة كالمتر، لتكون القياسات واحدة مهما اختلف الذي يقيس.",
 [["ماذا طلبت المعلمة من تلاميذها؟",["أن يعدوا الخطوات بين البابين","أن يكتبوا قصة","أن يرسموا المدرسة"],0],
  ["لماذا اختلفت أرقامهم؟",["لأن خطوة الطويل ليست كخطوة القصير","لأنهم أخطأوا في العد","لأن الطريق تغير"],0],
  ["ما الذي اتفق عليه الناس؟",["وحدات ثابتة كالمتر","أن يمشوا ببطء","أن يقيسوا بالخطوات"],0],
  ["ما الدرس من القصة؟",["القياس يحتاج وحدة ثابتة","العد صعب","المدرسة كبيرة"],0]]],

["في الشتاء تهاجر طيور كثيرة من الشمال البارد إلى الجنوب الدافئ، وتقطع آلاف الكيلومترات. وهي لا تحمل خريطة ولا تسأل أحدا، لكنها تعرف طريقها بالشمس في النهار وبالنجوم في الليل. وبعضها يطير في شكل حرف سباعي، فيكسر الطائر الأول الهواء عن الذي خلفه، ويتناوبون على المقدمة حتى لا يتعب واحد منهم وحده.",
 [["إلى أين تهاجر الطيور في الشتاء؟",["إلى الجنوب الدافئ","إلى الشمال البارد","إلى البحر"],0],
  ["بم تعرف طريقها في الليل؟",["بالنجوم","بالشمس","بالريح"],0],
  ["ما فائدة الطيران في شكل حرف سباعي؟",["يكسر الأول الهواء عن الذي خلفه","يبدو جميلا","يكون أسرع في الهبوط"],0],
  ["لماذا يتناوبون على المقدمة؟",["حتى لا يتعب واحد منهم وحده","ليروا الطريق كلهم","لأنهم يختلفون"],0]]],

["كان في قريتنا رجل اسمه عم صالح يصلح الأحذية. وكان إذا جاءه حذاء لا يستحق الإصلاح قال لصاحبه: هذا لا يستحق نقودك، اشتر غيره. فظن الناس أنه يخسر، وكان كل من سمع هذه الكلمة يرجع إليه مرة أخرى ويرسل إليه أهله وجيرانه. وبقي محله مفتوحا أربعين سنة، وأغلقت محال كثيرة حوله فتحت بعده.",
 [["ما عمل عم صالح؟",["يصلح الأحذية","يبيع الخبز","يعلم الأطفال"],0],
  ["ماذا كان يقول إذا جاءه حذاء لا يستحق الإصلاح؟",["اشتر غيره، هذا لا يستحق نقودك","سأصلحه بثمن قليل","ارجع غدا"],0],
  ["كم سنة بقي محله مفتوحا؟",["أربعين سنة","أربع سنوات","سنة واحدة"],0],
  ["ما الذي جعل الناس يرجعون إليه؟",["صدقه معهم","رخص سعره","قرب محله"],0]]],

["الماء الذي نشربه اليوم هو نفسه الماء الذي شربته الناس قبل ألف سنة. فالماء لا يفنى، وإنما يدور: يتبخر من البحر فيصعد، ثم يبرد في أعلى السماء فيصير سحابا، ثم ينزل مطرا على الأرض، فيجري في الأنهار ويرجع إلى البحر. وهذه الدورة لا تتوقف أبدا، ولذلك فإن تلويث نهر واحد يصل أثره إلى أماكن بعيدة جدا.",
 [["ماذا يحدث للماء حين يتبخر؟",["يصعد ثم يبرد فيصير سحابا","يختفي نهائيا","يصير ملحا"],0],
  ["إلى أين يرجع ماء الأنهار؟",["إلى البحر","إلى السحاب مباشرة","إلى باطن الأرض فقط"],0],
  ["هل تتوقف هذه الدورة؟",["لا تتوقف أبدا","تتوقف في الشتاء","تتوقف كل مئة سنة"],0],
  ["لماذا يضر تلويث نهر واحد؟",["لأن أثره يصل إلى أماكن بعيدة","لأن النهر صغير","لأن الماء قليل"],0]]],

["في أول يوم من الاختبارات نسي فهد قلمه في البيت. فنظر حوله فإذا زميله معه قلمان، فأعطاه واحدا بلا أن يسأله. وبعد شهرين نسي ذلك الزميل دفتره، فأعطاه فهد دفترا جديدا من حقيبته. قال له الزميل: أنا أعطيتك قلما وأنت أعطيتني دفترا. فقال فهد: أنت لم تعطني قلما، أنت علمتني ما أفعل حين ينسى أحد شيئا.",
 [["ماذا نسي فهد في أول يوم؟",["قلمه","دفتره","حقيبته"],0],
  ["ماذا فعل زميله؟",["أعطاه قلما بلا أن يسأله","ضحك عليه","أخبر المعلم"],0],
  ["ماذا فعل فهد بعد شهرين؟",["أعطى زميله دفترا","طلب قلمه","نسي الموضوع"],0],
  ["ماذا قصد فهد بكلامه الأخير؟",["أن زميله علمه كيف يتصرف","أن الدفتر أغلى من القلم","أنه لا يحب الاختبارات"],0]]],

["تحت الأرض في الغابة شبكة واسعة من الخيوط الدقيقة تصل جذور الأشجار بعضها ببعض. وقد اكتشف العلماء أن الشجرة الكبيرة ترسل الغذاء عبر هذه الخيوط إلى شجرة صغيرة في الظل لا يصلها ضوء كاف. فالغابة ليست أشجارا متجاورة، وإنما هي شيء واحد متصل من تحت، وإن بدت من فوق أشجارا منفصلة.",
 [["ماذا يوجد تحت الأرض في الغابة؟",["شبكة من الخيوط الدقيقة","أنهار صغيرة","حجارة ملونة"],0],
  ["ماذا ترسل الشجرة الكبيرة؟",["الغذاء إلى شجرة صغيرة في الظل","أوراقها","جذورها"],0],
  ["لماذا تحتاج الشجرة الصغيرة المساعدة؟",["لا يصلها ضوء كاف","لأنها مريضة","لأن أوراقها كثيرة"],0],
  ["ما الفكرة الرئيسة؟",["الغابة متصلة من تحت وإن بدت منفصلة من فوق","الأشجار تتنافس","الخيوط ضارة"],0]]],

["كتب أحدهم على باب مكتبة صغيرة: خذ كتابا واترك كتابا. ووضع رفا فيه عشرون كتابا. وظن الناس أن الرف سيفرغ في أسبوع. لكن بعد سنة صار فيه مئة وأربعون كتابا، لأن أكثر من أخذ كتابا ترك اثنين. قال صاحب الفكرة: لم أكن أثق في الناس أكثر مما ينبغي، كنت أعرف فقط أن أحدا لم يجرب أن يثق بهم.",
 [["ماذا كتب الرجل على الباب؟",["خذ كتابا واترك كتابا","ممنوع الدخول","الكتب للبيع"],0],
  ["كم كتابا وضع في البداية؟",["عشرين","مئة","اثنين"],0],
  ["كم صار عدد الكتب بعد سنة؟",["مئة وأربعين","عشرة","عشرين"],0],
  ["ما سبب زيادة الكتب؟",["أكثر من أخذ كتابا ترك اثنين","اشترى كتبا جديدة","أحد تبرع بمكتبة"],0]]],

["كان الناس قديما يحفظون الأخبار في صدورهم، فإذا مات الحافظ ذهب ما يحفظ معه. ثم كتبوا على الحجر فثقل حمله، وعلى جلود الحيوان فغلا ثمنه، حتى صنع الناس الورق من نبات رخيص فصار الكتاب في متناول من يريد. ومن يومها لم تعد المعرفة ملكا لمن يحفظ وحده، بل صارت ملكا لمن يقرأ.",
 [["أين كان الناس يحفظون الأخبار قديما؟",["في صدورهم","في الكتب","على الجدران"],0],
  ["ما عيب الكتابة على الحجر؟",["ثقل حمله","سرعة تلفه","غلاء ثمنه"],0],
  ["مم صنع الورق؟",["من نبات رخيص","من جلود الحيوان","من الحجر"],0],
  ["ما الذي تغير بعد صناعة الورق؟",["صارت المعرفة لمن يقرأ لا لمن يحفظ وحده","قل عدد الكتب","ارتفع ثمن الكتاب"],0]]]

  ] }
 }
};
