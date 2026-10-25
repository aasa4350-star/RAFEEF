/* ═══ قطعُ القراءةِ الطويلةُ لحسن — ثالث متوسّط ═══════════════════════
   طلبُ الأب (٢١ أكتوبر ٢٠٢٦): «القراءةُ عند حسن دايمًا قصيرة، خلّه
   يحطّها قصّةً طويلة، ويحطّ قطعًا طويلةً وجديدةً مو مكرّرة».

   والقياسُ صدّق الشكوى: قطعُه الإنجليزيّةُ وسطُها ٣٢ كلمة وأطولُها ٤٩،
   وقطعُ فهدٍ وسطُها ٥٩. وفي بنكِه ثلاثةُ أزواجٍ متشابهةٍ تشابهًا شديدًا
   (Renewable ٧٤٪ · Volunteering ٦١٪ · Critical thinking ٥٩٪)، فهو
   يرى الموضوعَ نفسَه مرّتين ويظنُّ القطعةَ تكرّرت — وقد تكرّرت فعلًا.

   وقال: «Renewable — لا يحطّ هذا الموضوع، حفظته». فرُفِعت قطعتاه.

   هنا عشرُ قطعٍ إنجليزيّةٍ وعشرٌ عربيّة، كلٌّ ١٠٠–١٨٠ كلمة، وفيها ثمانيُ
   قصصٍ سرديّةٍ لا مقالاتٍ تعليميّة — وهي ما طلبه. ولكلِّ قطعةٍ خمسةُ
   أسئلةٍ لا ثلاثة: ثلاثةٌ حرفيّةٌ واثنان استنتاجٌ وفكرةٌ رئيسة، لأنّ
   النصَّ الطويلَ يحتمل ما لا يحتمله القصير.

   والمواضيعُ كلُّها جديدةٌ على بنكِه: قُوبِلت بقطعِه الأربعِ والعشرين
   قبل الكتابة.

   البنية: pass: [نصّ القطعة, [[سؤال, [الصحيحة, خطأ, خطأ], 0], …]]
   الإجابةُ الصحيحةُ تُكتب أوّلًا، والخياراتُ تُخلَط عند العرض.

   والعربيُّ هنا بلا شكلٍ كامل، كما في reading-bank.js وreading-bank2.js —
   وقراءةُ غيرِ المشكولِ هي مهارةُ هذه المرحلةِ أصلًا. */
/* ═══ قطعٌ تُرفَع من البنك ═══════════════════════════════════════════
   تُطبَّق في reading.html بعد دمجِ البنوكِ كلِّها، فلا يُحذَف شيءٌ من
   ملفِّه الأصليِّ ويبقى سببُ الرفعِ مكتوبًا في مكانٍ واحد. والمفتاحُ
   بدايةُ النصِّ لا نصُّه كاملًا، لأنّ النسختَين المتشابهتَين تختلفان
   في آخرِهما وتتّفقان في أوّلِه.

   وهذا هو الموضعُ الذي يُضاف إليه ما يقول عنه الأب «شِلّ هذا الموضوع». */
window.READING_DROP = {
  hasan: {
    en: [
      /* طلبُ الأب (٢١ أكتوبر ٢٠٢٦): «Renewable — لا يحطّ هذا الموضوع،
         حفظته». وهما نسختان من موضوعٍ واحدٍ تتشابهان ٧٤٪. */
      ["Renewable energy comes from natural sources", "حفظه — طلبُ الأب"],
      /* نسخةٌ ثانيةٌ من موضوعٍ في DATA تتشابه معه ٦١٪ — تُرفَع وتبقى الأولى */
      ["Volunteering benefits both the individual and society. It develops new skills", "مكرّرة ٦١٪"],
      /* وثالثةٌ تتشابه ٥٩٪ مع نظيرتِها في DATA */
      ["Critical thinking is the ability to analyze information and form reasoned", "مكرّرة ٥٩٪"]
    ],
    ar: [
      ["الطاقة المتجدّدة تأتي من مصادر طبيعية", "حفظه — طلبُ الأب"],
      ["العمل التطوّعي يعود بالنفع على الفرد والمجتمع", "مكرّرة"],
      ["التفكير الناقد قدرة على تحليل المعلومات وبناء أحكام", "مكرّرة"]
    ]
  },
  /* والعطبُ نفسُه عند أسامة: نسختان من المكتبةِ ونسختان من الجمل */
  osama: {
    en: [
      ["The library is a quiet place. People read books", "مكرّرة ٦٢٪"],
      ["The camel can live in the desert for many days", "مكرّرة ٦٥٪"]
    ]
  }
};

/* ═══ أدنى طولٍ للقطعة ═══════════════════════════════════════════════
   شكوى الأب: «القراءةُ عند حسن دايمًا قصيرة». وإضافةُ الطويلِ وحدَها لا
   تكفي: البنكُ يُقرَأ بالدور، فلو بقيت القصيرةُ فيه ظهرت له أكثرَ ممّا
   ظهر الطويل. فيُرفَع ما دون العتبةِ عن حسن.

   ولا يُحذَف شيء: الرفعُ عند الدمج، والقطعُ باقيةٌ في بنوكِها لمن
   دونَه. وفيه صمّامٌ: إن نقص الباقي عن MIN_KEEP أُبقيت أطولُ القطعِ
   حتّى يبلغَه، فلا تجوع القائمةُ فيتكرّر عليه القليلُ الباقي. */
/* وفهدٌ معهما (٢٣ أكتوبر ٢٠٢٦): «قراءة القطعة بالنسبة لفهد مكرّرة
   وقصيرة». وقطعُه تأتي من step-reading.js لا من بنوكِ القراءة، وعتبتُه
   أعلى: هو ثالثُ ثانويٍّ يستعدّ لستيب، وقطعُه الجديدةُ ١٥٥ كلمةً فأكثر
   بينما القديمةُ ٥٣–٦٧ — فالعتبةُ مئةٌ تفصل بينهما فصلًا نظيفًا. */
/* وسعودٌ معهم (٢٥ أكتوبر ٢٠٢٦): قطعُه أقصرُ قطعِ الموقعِ (وسطُ
   الإنجليزيِّ ١٩ كلمةً وأطولُها ٢٦، والعربيِّ ١٤ وأطولُها ١٨)، وقطعُه
   الجديدةُ ٥٦–٦٤ إنجليزيّةً و٤٥–٥٣ عربيّة — والعربيّةُ أقلُّ عددًا
   وأكثرُ معنًى، فالكلمةُ فيها تحمل ما تحمله كلمتان في الإنجليزيّة.
   فالعتبةُ أربعون: فوقَ أطولِ قطعةٍ قديمةٍ له بكثير، ودونَ أقصرِ
   جديدةٍ بخمس. وهو رابعٌ ابتدائيٌّ فلا تُرفَع عليه عتبةُ حسنٍ ولا فهد. */
window.READING_MINWORDS = { hasan: 60, rafeef: 60, fahad: 100, saud: 40 };
window.READING_MINKEEP  = 16;

window.READING_LONG = {
 hasan: {
  en: { pass: [

["For thirty-one years, Idris kept the lighthouse at the end of the northern cape. Every evening he climbed one hundred and forty steps, trimmed the wick, and polished the great glass lens until it threw a clean white beam across the water. Ships passed in the dark and never knew his name.\n\nOne winter a storm cut the power along the whole coast. The automatic lamp failed, and the radio in the tower went silent. Idris had no way to call for help and no way to know whether any vessel was near. He lit the old oil lamp his grandfather had used, and he turned the lens by hand, hour after hour, through the entire night.\n\nAt dawn a fishing boat reached the harbour. Its captain said that the crew had been lost in the storm until they saw a light that turned slowly, the way a hand turns something it cares about. They had followed it home.",
 [["How long had Idris kept the lighthouse?",["thirty-one years","fourteen years","one year"],0],
  ["What stopped working during the storm?",["the power and the radio","the stairs","the fishing boat"],0],
  ["What did Idris do when the automatic lamp failed?",["he turned the lens by hand with an oil lamp","he went home to sleep","he called the coast guard"],0],
  ["How did the captain describe the light?",["it turned slowly, as if by hand","it flashed very fast","it was red"],0],
  ["What does the story suggest about Idris's work?",["it mattered even though nobody knew his name","it was easy and unimportant","it was finally rewarded with money"],0]]],

["Mariam was fourteen when she began working in her uncle's clock shop. Her first task was not repairing anything; it was listening. Her uncle would wind a clock, set it on the bench, and ask her to say what was wrong before she opened the case.\n\nFor two months she was wrong almost every time. Slowly she learned to hear the difference between a tick that was merely loud and a tick that was uneven. She learned that a clock running fast is usually a simpler problem than a clock that stops without warning.\n\nIn her third month she listened to a tall case clock that had defeated two repairers before her. She said the escapement was worn on one side only. Her uncle opened the case and found exactly that.\n\nHe did not praise her. He placed another clock on the bench and said, \"Again.\" Years later Mariam told her own apprentices that the most useful tool in the shop had never been a tool at all.",
 [["What was Mariam's first task in the shop?",["listening to clocks","repairing clocks","selling clocks"],0],
  ["How long was she wrong almost every time?",["two months","two days","two years"],0],
  ["What did she say about the tall case clock?",["the escapement was worn on one side","the glass was broken","it needed a new case"],0],
  ["How did her uncle react when she was right?",["he gave her another clock to listen to","he gave her a prize","he closed the shop"],0],
  ["What did Mariam mean by her last remark?",["careful listening mattered more than any instrument","the shop had no tools","clocks cannot be repaired"],0]]],

["In 1874, a survey team spent four months mapping a valley in the north. They measured carefully, checked their instruments each morning, and produced a map that was admired for its neatness.\n\nThree years later a railway engineer named Faris used that map to plan a line through the valley. Halfway through the work, the cuttings did not meet. A hill that the map placed two kilometres east of the river stood west of it.\n\nFaris could have blamed the surveyors and stopped. Instead he walked the whole valley on foot, with a chain and a level, and remeasured it himself. It took him eleven weeks. He found that the original team had made one error on the first day — a compass reading taken beside an iron tool shed — and had then carried that error, faithfully and precisely, through every measurement afterwards.\n\nThe railway was built on the corrected line. Faris kept the old map on his wall for the rest of his life.",
 [["What problem appeared during the railway work?",["the cuttings did not meet","the workers left","the river dried up"],0],
  ["How long did Faris's remeasurement take?",["eleven weeks","eleven days","four months"],0],
  ["What caused the original error?",["a compass reading taken beside an iron shed","a torn page in the notebook","bad weather"],0],
  ["Why did one mistake spoil the whole map?",["it was carried through every later measurement","the team lost the map","nobody checked the instruments"],0],
  ["Why did Faris keep the old map on his wall?",["as a reminder that a neat result can still be wrong","because it was beautiful","because it was valuable"],0]]],

["Khalid's grandmother died in the spring, and in the autumn a letter arrived for her. It had been posted eleven years earlier from a town four hundred kilometres away, and had spent that time in a sorting office that nobody had used since.\n\nThe letter was from a woman named Hind. She wrote that she had been a student in his grandmother's class in 1962, that she had been the only girl in the village whose family allowed her to continue beyond the fourth grade, and that she had only kept going because his grandmother walked to her house every Thursday for two years to argue with her father.\n\nHind had become a doctor for children. She had written to say thank you, and had assumed, when no reply ever came, that she had been forgotten.\n\nKhalid found her address and wrote back. He told her that the letter had arrived, and that it had not come too late for everyone.",
 [["How long had the letter been delayed?",["eleven years","eleven days","one year"],0],
  ["Who was Hind?",["a former student of Khalid's grandmother","Khalid's sister","a postal worker"],0],
  ["What did the grandmother do every Thursday?",["she walked to Hind's house to argue with her father","she taught an extra class","she wrote letters"],0],
  ["Why did Hind think she had been forgotten?",["no reply ever came","she was told so","she had moved away"],0],
  ["What does the last sentence mean?",["the grandmother never read it, but her family learned what she had done","the letter was useless","Hind had forgotten the grandmother"],0]]],

["The Silk Road was never a single road, and silk was only part of what travelled along it. For more than fifteen centuries, a network of routes connected China to the Mediterranean, crossing deserts, mountain passes, and the trading cities that grew up to serve them.\n\nFew merchants made the whole journey. Goods changed hands many times, and each exchange raised the price, which is why silk could cost more in Rome than gold of the same weight. Paper, gunpowder, and the technique of making fine glass moved in the same caravans, together with things that nobody had packed deliberately: languages, religions, mathematics, and diseases.\n\nThe routes declined when sea transport became cheaper and safer in the fifteenth century. But the cities they had created — Samarkand, Bukhara, Kashgar — remained, and the habit of exchange they established did not disappear. Trade had taught distant continents that they were neighbours.",
 [["Was the Silk Road one single road?",["no, it was a network of routes","yes, one long road","yes, a sea route"],0],
  ["Why could silk be so expensive in Rome?",["goods changed hands many times and each exchange raised the price","it was made of gold","Rome forbade it"],0],
  ["What travelled along the routes besides goods?",["languages, religions, mathematics and diseases","only silk","only gold"],0],
  ["Why did the routes decline?",["sea transport became cheaper and safer","the cities were destroyed","silk went out of fashion"],0],
  ["What is the main idea of the passage?",["exchange connected distant regions and left lasting effects","silk was the most valuable cloth","deserts are hard to cross"],0]]],

["Antibiotics changed medicine in the twentieth century. Infections that had regularly killed people became, for a time, minor inconveniences. That period is now ending in parts of the world, and the reason is not that bacteria have become cleverer. It is that we have been careless.\n\nWhen an antibiotic is taken, it kills the bacteria that are sensitive to it. Any bacterium that happens to survive passes its resistance to the next generation. Every unnecessary course of antibiotics, and every course stopped early, gives those resistant survivors a wider opening.\n\nDoctors now describe resistance as a problem of shared resources. A patient who takes antibiotics for a common cold — a viral illness that antibiotics cannot touch — affects not only himself but everyone who may later need that medicine to work.\n\nResearchers are developing new antibiotics, but slowly. Using the ones we already have carefully remains the cheapest and fastest defence available.",
 [["Why is resistance increasing?",["because antibiotics have been used carelessly","because bacteria became cleverer","because doctors stopped prescribing them"],0],
  ["What happens to a bacterium that survives a course?",["it passes its resistance to the next generation","it dies later","it becomes harmless"],0],
  ["Why are antibiotics useless against a common cold?",["a cold is caused by a virus","colds are too mild","colds last too long"],0],
  ["Why is resistance called a problem of shared resources?",["one person's misuse affects everyone who may need the medicine later","antibiotics are expensive","hospitals share their supplies"],0],
  ["According to the passage, what is the cheapest defence?",["using existing antibiotics carefully","inventing new antibiotics quickly","avoiding all medicine"],0]]],

["The digits used in almost every country today are often called Arabic numerals, and in the Arab world they are called Indian numerals. Both names are correct, and together they describe a journey.\n\nThe system of nine digits and a symbol for zero was developed in India. In the ninth century, the scholar Muhammad ibn Musa al-Khwarizmi, working in Baghdad, wrote a book explaining how to calculate with it. His work was translated into Latin about three hundred years later, and European merchants slowly abandoned Roman numerals in its favour.\n\nThe real advantage was not the shape of the digits but the idea behind them: the position of a digit carries meaning. In Roman numerals there is no simple way to write a very large number, and no way at all to write nothing. Zero made columns possible, and columns made arithmetic something that could be taught.\n\nAl-Khwarizmi's name survives in a word that every student uses without noticing it: algorithm.",
 [["Where was the system of nine digits and zero developed?",["in India","in Rome","in Baghdad"],0],
  ["What did al-Khwarizmi write?",["a book explaining how to calculate with the system","a book of poetry","a map of Baghdad"],0],
  ["What was the real advantage of the system?",["the position of a digit carries meaning","the digits were beautiful","the digits were easy to carve"],0],
  ["What could Roman numerals not express?",["nothing, that is, zero","large armies","dates"],0],
  ["Which modern word comes from al-Khwarizmi's name?",["algorithm","algebra","arithmetic"],0]]],

["Saudi Arabia produces more desalinated water than any other country. Removing salt from seawater is an old idea — sailors boiled it on long voyages — but doing it for millions of people every day is a problem of energy rather than chemistry.\n\nTwo methods dominate. In thermal distillation, seawater is heated until it evaporates, and the vapour is then condensed as fresh water. In reverse osmosis, water is forced at high pressure through a membrane whose pores are too small to let salt pass. Reverse osmosis now uses roughly a quarter of the energy that thermal plants once required.\n\nTwo difficulties remain. The first is cost: desalinated water is still far more expensive than water from a river or a well. The second is brine, the concentrated salt left behind, which damages sea life if it is returned to the water carelessly.\n\nEngineers are working on both. Neither difficulty makes desalination avoidable in a country with no permanent rivers.",
 [["What kind of problem is large-scale desalination?",["a problem of energy","a problem of chemistry","a problem of space"],0],
  ["How does reverse osmosis work?",["water is forced through a membrane too fine for salt","salt is burned away","sand filters the salt"],0],
  ["How much energy does reverse osmosis use compared with old thermal plants?",["about a quarter","about double","exactly the same"],0],
  ["What is brine and why does it matter?",["concentrated leftover salt that can damage sea life","clean drinking water","a kind of membrane"],0],
  ["Why is desalination unavoidable for Saudi Arabia?",["the country has no permanent rivers","the sea is very close","it is cheaper than wells"],0]]],

["The immune system learns. When a virus enters the body for the first time, the body needs days to identify it and build the right defence, and during those days a person can become seriously ill. If the same virus returns years later, the response takes hours instead of days, because the body kept a record of it.\n\nA vaccine supplies that record without the illness. It presents the immune system with a harmless version of the virus, or with a fragment of it — often a single protein from its surface — and the body prepares its defence in advance.\n\nThis also explains why vaccines protect people who have not received them. A virus needs a chain of people who can catch it in order to spread. When enough people in a community are immune, the chain breaks, and those who cannot be vaccinated, such as newborn babies or patients receiving certain treatments, are protected by everyone around them.",
 [["Why can a first infection be dangerous?",["the body needs days to build the right defence","the virus is always stronger at first","medicine does not exist yet"],0],
  ["What does a vaccine supply?",["the body's record of the virus without the illness","a cure for every disease","a stronger virus"],0],
  ["What is often used inside a vaccine?",["a harmless fragment such as a surface protein","a live and dangerous virus","an antibiotic"],0],
  ["How are unvaccinated people protected?",["the chain of people who can catch the virus is broken","they receive the vaccine secretly","the virus disappears by itself"],0],
  ["Who depends most on that protection?",["newborn babies and patients on certain treatments","healthy adults","doctors only"],0]]],

["An earthquake is the sudden release of energy stored in rock. The outer shell of the Earth is broken into plates that move a few centimetres a year, about the speed at which fingernails grow. Where two plates meet, friction holds them in place until the stress becomes too great, and the rock finally slips.\n\nThe point underground where the slip begins is called the focus; the point on the surface directly above it is the epicentre. Seismographs in different countries record when the waves arrive, and because those waves travel at known speeds, three stations are enough to locate the source.\n\nMagnitude is measured on a logarithmic scale, which is often misunderstood. A magnitude seven earthquake is not slightly stronger than a magnitude six; it releases about thirty-two times more energy.\n\nPrediction remains impossible. Preparation does not: buildings designed to bend rather than resist have saved more lives than any forecast ever has.",
 [["What is an earthquake?",["the sudden release of energy stored in rock","a storm under the sea","a kind of volcano"],0],
  ["How fast do the plates move?",["a few centimetres a year","a few metres a day","they do not move"],0],
  ["How many stations are needed to locate the source?",["three","one","ten"],0],
  ["How much more energy does a magnitude seven release than a magnitude six?",["about thirty-two times","about twice","about one tenth"],0],
  ["What has saved the most lives, according to the passage?",["buildings designed to bend rather than resist","accurate predictions","moving cities away"],0]]],

["Yusuf had trained for two years for the regional five thousand metres. With four hundred metres left he was in second place and closing, and the runner ahead of him was tiring badly.\n\nThen a boy from another school clipped a kerb and went down hard on the inside lane. The field ran past him. Yusuf stopped, turned back, and knelt beside him. The boy's ankle was already swelling. Yusuf helped him up and the two of them walked the last lap together, long after the race had been decided.\n\nHis coach was furious. Two years, he said, for nothing.\n\nYusuf did not argue. The following season he won the same race, and nobody remembered it. What people still repeat, eleven years later, is the lap he walked.\n\nHe is a physiotherapist now. He says the decision took him less than a second, which is the only part of the story he finds interesting.",
 [["How far from the finish was Yusuf when the boy fell?",["about four hundred metres","about four kilometres","at the starting line"],0],
  ["What was wrong with the boy who fell?",["his ankle was swelling","he had lost his shoe","he could not breathe"],0],
  ["How did Yusuf's coach react?",["he was furious","he was proud","he said nothing"],0],
  ["What happened the following season?",["Yusuf won the same race","Yusuf stopped running","the boy won instead"],0],
  ["Why does Yusuf find the speed of his decision interesting?",["because it showed the choice came from habit, not thought","because he regrets it","because he wanted to be praised"],0]]],

["When Dana started secondary school, the journey was eight kilometres and there was no bus. Her neighbour, an old man named Abu Rashid, had a bicycle he no longer used. He did not give it to her. He lent it to her, formally, and wrote the date in a notebook.\n\nEvery month she returned it for a day so that he could check the brakes, and every month he wrote the date again. She thought at first that he did not trust her.\n\nShe understood later. A gift would have ended the matter; a loan gave them both a reason to meet twelve times a year. In those visits he taught her to patch a tube, to true a wheel, and eventually to read a technical drawing.\n\nDana studies mechanical engineering now. Abu Rashid died in her second year, and the notebook, which has forty-one dates in it, was left to her.",
 [["Why did Dana need a bicycle?",["her school was eight kilometres away with no bus","she wanted to race","her old one broke"],0],
  ["What did Abu Rashid do instead of giving her the bicycle?",["he lent it and recorded the date each month","he sold it cheaply","he refused at first"],0],
  ["What did Dana think at first?",["that he did not trust her","that he wanted money","that the bicycle was broken"],0],
  ["What did she learn during the monthly visits?",["to patch a tube, true a wheel and read a technical drawing","to ride faster","to keep accounts"],0],
  ["Why did he lend rather than give?",["a loan created a reason to keep meeting","he expected to need it back","he could not afford a gift"],0]]],

["Mr Sabri marked every essay in pencil. Students who moved to his class from elsewhere found this strange, and some of them found it insulting, as though their work were not worth ink.\n\nHe explained it once, briefly, and never again. A mark in ink, he said, is a verdict. A mark in pencil is a question.\n\nHis rule was that any student could come to him within a week, defend a sentence he had underlined, and if the defence was good he would rub out his own comment and leave the page clean. He kept no record of how often this happened, which irritated the administration.\n\nIn his last year, a student counted. Out of two hundred and six comments, forty-one had been erased.\n\nThe number is not the point, Mr Sabri said when she showed him. The point is that you all wrote as though you might have to defend it.",
 [["How did Mr Sabri mark essays?",["in pencil","in red ink","with a stamp"],0],
  ["What did he say the difference was?",["ink is a verdict, pencil is a question","pencil is cheaper","pencil is easier to read"],0],
  ["What could a student do within a week?",["defend an underlined sentence and have the comment erased","ask for a higher grade","rewrite the whole essay"],0],
  ["How many comments had been erased in his last year?",["forty-one out of two hundred and six","two hundred and six","none"],0],
  ["What did Mr Sabri say the real effect was?",["students wrote as though they might have to defend it","students got higher marks","students stopped making mistakes"],0]]],

["Leaves are green because of chlorophyll, a pigment that captures light and uses it to build sugar. What most people do not realise is that the other colours are already there all summer, hidden underneath.\n\nAs the days shorten, a tree faces a calculation. Keeping leaves through winter costs water the tree cannot replace from frozen ground, and broad leaves catch snow and break branches. So the tree withdraws its investment. It breaks down the chlorophyll and pulls the useful nitrogen back into the trunk and roots, and as the green disappears the yellows and oranges that were always present become visible.\n\nThe reds are different. Many of them are made fresh in autumn, which puzzled botanists for years. The leading explanation is that they act as a sunscreen, protecting the leaf long enough to finish recovering its nutrients.\n\nThen a layer of cells seals the stem, and the leaf falls without a wound.",
 [["Why are leaves green in summer?",["because of chlorophyll","because of sunlight only","because of water in the stem"],0],
  ["Where do the yellows and oranges come from?",["they were present all summer, hidden under the green","they are made in autumn","they come from the soil"],0],
  ["Why does the tree withdraw its investment in leaves?",["winter leaves cost water and catch snow","leaves become too heavy","insects eat them"],0],
  ["What is the leading explanation for the red colours?",["they protect the leaf while it recovers nutrients","they attract birds","they warm the leaf"],0],
  ["Why does the leaf fall without a wound?",["a layer of cells seals the stem first","the wind cuts it cleanly","the branch grows over it"],0]]],

["In the 1840s, the maternity hospital in Vienna had two wards. In the first, run by doctors, about one mother in ten died of fever after giving birth. In the second, run by midwives, the figure was closer to one in twenty-five. Women begged to be admitted to the second ward.\n\nA young doctor named Ignaz Semmelweis could not accept the usual explanations. He noticed that the doctors came to the delivery room directly from performing autopsies, and the midwives did not. He ordered everyone on his ward to wash their hands in a chlorine solution.\n\nDeaths in the doctors' ward fell to the level of the midwives' within months.\n\nHis colleagues rejected the finding. The idea that respectable physicians were carrying death on their hands was an insult, and Semmelweis had no theory of germs to offer, only a number. He died before Pasteur proved him right.",
 [["What was the difference between the two wards?",["far more mothers died in the doctors' ward","the second ward was larger","the first ward was free"],0],
  ["What did Semmelweis notice about the doctors?",["they came straight from performing autopsies","they worked longer hours","they were younger"],0],
  ["What did he order?",["handwashing in a chlorine solution","closing the first ward","fewer visitors"],0],
  ["Why did his colleagues reject the finding?",["they took it as an insult and he had no theory to explain it","the numbers were secret","the method was expensive"],0],
  ["What does the passage suggest about evidence?",["correct evidence can be rejected when it offends those who hear it","numbers are never convincing","doctors are usually wrong"],0]]],

["A satellite navigation receiver does not send anything. It only listens, and what it listens to is time.\n\nEach satellite carries an atomic clock and broadcasts a continuous signal that includes the exact moment of transmission and the satellite's position. The receiver compares that moment with its own clock and calculates how long the signal took to arrive. Multiplied by the speed of light, that gives a distance. One distance places the receiver somewhere on a sphere; three spheres intersect at a point; a fourth satellite corrects the receiver's cheap clock.\n\nThe system is sensitive enough that relativity is not a theoretical nicety but an engineering requirement. Clocks in orbit run slightly faster than clocks on the ground, and if the difference were ignored, positions would drift by about ten kilometres a day.\n\nThis is why your phone can be wrong about a street but is almost never wrong about a continent.",
 [["What does a navigation receiver do?",["it only listens to signals","it sends a request to the satellite","it photographs the ground"],0],
  ["What does each satellite broadcast?",["the exact time of transmission and its position","a map of the area","the user's name"],0],
  ["How is distance calculated?",["travel time multiplied by the speed of light","by counting satellites","by measuring signal strength"],0],
  ["Why is a fourth satellite needed?",["to correct the receiver's inexpensive clock","to double the accuracy of the map","to provide a spare signal"],0],
  ["What would happen if relativity were ignored?",["positions would drift about ten kilometres a day","nothing would change","the satellites would fall"],0]]],

["Before oil, the pearl was the wealth of the Gulf. From May to September, fleets of several hundred boats left ports along the Arabian coast and anchored over the banks for four months.\n\nThe work was brutal. A diver descended with a stone weight tied to his foot and a rope around his waist, held his breath for up to two minutes, filled a basket from the sea floor, and was hauled up by his puller. He repeated this fifty or more times a day. Divers suffered ruptured eardrums, and many were in permanent debt to the captain who had advanced them money before the season.\n\nIn the 1930s the Japanese perfected the cultured pearl, which could be produced reliably and sold cheaply. Within a decade the Gulf pearl industry collapsed.\n\nOil was discovered in the same period. The two events are often told as one story, but the first did not wait for the second.",
 [["How long did the pearling season last?",["about four months, from May to September","two weeks","the whole year"],0],
  ["What did a diver tie to his foot?",["a stone weight","a wooden float","a lamp"],0],
  ["Why were many divers in debt?",["the captain advanced them money before the season","they bought their own boats","they paid for medicine"],0],
  ["What destroyed the industry?",["the Japanese cultured pearl","a storm","a disease in the oysters"],0],
  ["What does the last sentence point out?",["the collapse began before oil was discovered, not because of it","oil caused the collapse","both events happened in different centuries"],0]]],

["It seems unjust that some of the most dangerous land on Earth is also the most crowded. The slopes of volcanoes in Indonesia, Italy and Central America carry dense populations who know exactly what lies beneath them.\n\nThe reason is in the soil. Volcanic ash is rich in potassium, phosphorus and magnesium, and it weathers quickly into a deep, loose, fertile layer. A farmer on volcanic soil can grow two or three crops where a neighbour thirty kilometres away manages one.\n\nThe arrangement works because the timescales do not match. A serious eruption may come once in a century or less often, while a harvest comes every year. A family that moves to safety gains protection it may never need and loses an advantage it needs constantly.\n\nGeologists call it a rational trade. It only looks like recklessness from somewhere with better soil.",
 [["Why do many people live on volcanic slopes?",["the soil is unusually fertile","the land is cheap and empty","they do not know the danger"],0],
  ["What makes volcanic ash fertile?",["it is rich in potassium, phosphorus and magnesium","it holds no water","it is very hard"],0],
  ["How much more can a farmer grow there?",["two or three crops instead of one","the same amount","half as much"],0],
  ["Why does the trade make sense?",["eruptions are rare but harvests are annual","eruptions never kill anyone","the government pays them"],0],
  ["What is the writer's attitude to these farmers?",["their choice is rational, not reckless","they are foolish","they should be moved by force"],0]]],

["Every flat map of the world is wrong, and it has to be. A sphere cannot be flattened without stretching, tearing or squashing something, so a map maker must choose which error to accept.\n\nThe Mercator projection, drawn in 1569, preserves angles. A compass bearing drawn as a straight line on a Mercator map is the bearing a ship should actually steer, which is why it dominated navigation for four centuries. Its cost is area: land far from the equator is enlarged enormously. On a Mercator map Greenland looks the size of Africa, though Africa is about fourteen times larger.\n\nOther projections preserve area and distort shape instead, or preserve distance from a single point and distort everything else.\n\nThere is no correct world map, only a map that is correct for a purpose. The useful question is never whether a map is accurate, but what it was built to get right.",
 [["Why is every flat world map wrong?",["a sphere cannot be flattened without distortion","map makers are careless","the Earth keeps changing"],0],
  ["What does the Mercator projection preserve?",["angles and compass bearings","area","distance from the pole"],0],
  ["What is the cost of that choice?",["land far from the equator is enlarged","colours become wrong","coastlines disappear"],0],
  ["How much larger is Africa than Greenland?",["about fourteen times","about the same","about twice"],0],
  ["What question does the writer recommend?",["what the map was built to get right","who drew the map","how old the map is"],0]]]

  ] },

  ar: { pass: [

["كان في القرية خطاط يكتب لوحات المسجد وأسماء الدكاكين، وكان بطيئا حتى ضاق به الناس. طلب منه تاجر لوحة لمحله فوعده بها بعد أسبوع. مضى الأسبوع ولم تصل، ثم مضى أسبوعان.\n\nذهب التاجر إلى بيته غاضبا، فوجد على المنضدة سبع عشرة ورقة فيها الاسم نفسه مكتوبا سبع عشرة مرة. قال له الخطاط: كلها صحيحة الحروف، ولكن السين في الورقة الأولى تجلس على السطر، وفي الأخيرة تمشي عليه.\n\nلم يفهم التاجر الفرق يومها، فأخذ اللوحة الأخيرة وعلقها. وبعد سنوات، حين احترق نصف السوق وأعيد بناؤه، كان أصحاب المحال يأتون بلوحاتهم القديمة ليقلدها الخطاطون الجدد، فلم يطلب أحد تقليد لوحة إلا لوحته.\n\nقال التاجر لابنه: دفعت ثمن أسبوع، وأخذت ثمن عمر.",
 [["ماذا كان يكتب الخطاط؟",["لوحات المسجد وأسماء الدكاكين","الرسائل والعقود","الكتب المدرسية"],0],
  ["كم ورقة وجد التاجر على المنضدة؟",["سبع عشرة","سبعا","سبعين"],0],
  ["ما الفرق الذي ذكره الخطاط بين الورقة الأولى والأخيرة؟",["السين تجلس على السطر في الأولى وتمشي عليه في الأخيرة","الأولى بالحبر الأسود والأخيرة بالأحمر","الأولى أكبر حجما"],0],
  ["لماذا طلب أصحاب المحال تقليد لوحته بعد الحريق؟",["لأنها كانت أتقن ما في السوق","لأنها كانت الأرخص","لأنها الوحيدة التي نجت"],0],
  ["ماذا قصد التاجر بقوله: دفعت ثمن أسبوع وأخذت ثمن عمر؟",["أن التأخر في الإتقان ربح لا خسارة","أنه دفع مالا كثيرا","أن اللوحة كانت رخيصة"],0]]],

["جفت بئر القرية في صيف قاس، فصار الناس يحملون الماء من واد يبعد ساعتين. اجتمع الرجال وقرروا حفر بئر جديدة، واختاروا موضعا قريبا من البيوت. حفروا ثلاثة أسابيع فلم يخرج ماء.\n\nكان بينهم شيخ كبير لا يحفر، إنما يجلس كل يوم ينظر إلى الأرض بعد المطر الخفيف. قال لهم: احفروا حيث يتأخر الطين في الجفاف، لا حيث يقرب الموضع من بيوتكم. فضحك بعضهم؛ فالموضع الذي أشار إليه خلف التل، والطريق إليه صاعد.\n\nحفروا هناك على مضض، فخرج الماء في اليوم التاسع.\n\nبقيت البئر تسقي القرية أربعين سنة، وبقي معها درس: أن أقرب الطرق ليس دائما أقصرها، وأن من ينظر قبل أن يعمل قد يسبق من بدأ قبله بثلاثة أسابيع.",
 [["لماذا صار أهل القرية يحملون الماء من واد بعيد؟",["لأن بئر القرية جفت","لأن ماء البئر صار مالحا","لأنهم انتقلوا إلى مكان جديد"],0],
  ["كم أسبوعا حفروا في الموضع الأول بلا ماء؟",["ثلاثة أسابيع","ثلاثة أيام","تسعة أسابيع"],0],
  ["ما العلامة التي دل عليها الشيخ؟",["الموضع الذي يتأخر طينه في الجفاف","الموضع الأقرب إلى البيوت","الموضع الذي تكثر فيه الأشجار"],0],
  ["لماذا ضحك بعضهم من رأيه؟",["لأن الموضع خلف التل والطريق إليه صاعد","لأن الشيخ لم يحفر معهم","لأنه لم يسبق أن حفر بئرا"],0],
  ["ما الفكرة التي تخلص إليها القصة؟",["أن التأمل قبل العمل يختصر الجهد","أن العمل الجماعي لا ينفع","أن الآبار لا تحفر في الصيف"],0]]],

["اشترى معلم مدرسة في بلدة صغيرة مئتي كتاب بمرتب ثلاثة أشهر، ووضعها في غرفة فارغة بجانب الصف، وكتب على الباب: المكتبة. لم يأت في الشهر الأول إلا تلميذان.\n\nلم يشك ولم يخطب في الطلاب عن فضل القراءة، إنما صار يجلس في الغرفة وقت الفسحة يقرأ وحده ولا يدعو أحدا. فصار يدخل عليه الطلاب ليسألوه عما يقرأ، فيحدثهم عن الكتاب حتى يدق الجرس ثم يسكت في أشد موضع.\n\nبعد سنتين لم تعد الغرفة تتسع، فنقلت المكتبة إلى قاعة، وتولى إدارتها الطلاب أنفسهم.\n\nسئل المعلم بعد تقاعده عن سر نجاحه، فقال: لم أطلب منهم أن يقرؤوا، طلبت من نفسي.",
 [["بكم اشترى المعلم الكتب؟",["بمرتب ثلاثة أشهر","بتبرعات الأهالي","بمال المدرسة"],0],
  ["كم طالبا جاء في الشهر الأول؟",["اثنان","عشرون","لم يأت أحد"],0],
  ["ماذا كان يفعل المعلم وقت الفسحة؟",["يجلس يقرأ وحده ولا يدعو أحدا","ينادي الطلاب بالمكبر","يوزع الكتب على الصفوف"],0],
  ["لماذا كان يسكت في أشد موضع من الحكاية؟",["ليدفعهم إلى قراءة الكتاب بأنفسهم","لأن وقته انتهى فعلا","لأنه نسي بقية القصة"],0],
  ["ما معنى قوله: لم أطلب منهم أن يقرؤوا، طلبت من نفسي؟",["أن القدوة أبلغ من النصيحة","أنه كان يقرأ ليستريح","أنه لم يهتم بالطلاب"],0]]],

["في أول سنة له طبيبا، أرسل حمد إلى مركز صحي في قرية جبلية لا يصلها الإسفلت. كان ينوي البقاء سنة واحدة ثم ينتقل إلى المدينة.\n\nفي شهره الثالث جاءته امرأة تحمل طفلا يلهث، وقد قطعت على قدميها أربع ساعات. عالجه ونجا، ثم سألها: لماذا لم تأت أمس وقد بدأ الأمر أمس؟ قالت: أمس لم أكن أعرف أن في القرية طبيبا.\n\nبقي حمد تسع سنين. لم يبن مستشفى ولم يشتر جهازا، إنما جعل من كل بيت في القرية بيتا يعرف متى يأتي. علق في المسجد وفي المدرسة وعلى باب الدكان ورقة واحدة فيها: المركز مفتوح، وهذه علامات الخطر عند الطفل.\n\nانخفضت وفيات الأطفال في القرية إلى الربع، والجهاز الذي فعل ذلك كان ورقة.",
 [["إلى أين أرسل حمد في أول سنة له؟",["إلى مركز صحي في قرية جبلية","إلى مستشفى في المدينة","إلى الخارج للدراسة"],0],
  ["كم ساعة قطعت المرأة على قدميها؟",["أربع ساعات","ساعة واحدة","تسع ساعات"],0],
  ["ما سبب تأخرها يوما كاملا؟",["لم تكن تعرف أن في القرية طبيبا","لم يكن معها مال","كان الطريق مغلقا"],0],
  ["ما الذي فعله حمد بعد ذلك؟",["علق ورقة فيها مواعيد المركز وعلامات الخطر","بنى مستشفى جديدا","اشترى أجهزة حديثة"],0],
  ["ما الدرس الذي تقدمه القصة؟",["أن المعرفة قد تنقذ أكثر من الجهاز","أن الأطباء لا ينفعون في القرى","أن المدينة أفضل للعمل"],0]]],

["قبل طريق الحرير بقرون، كان في جزيرة العرب طريق آخر يسمى طريق البخور. كانت قوافل تحمل اللبان والمر من جنوب الجزيرة إلى الشام ومصر، فتقطع نحو ثلاثة آلاف كيلومتر في رحلة تستغرق شهرين أو أكثر.\n\nولم تكن القيمة في البضاعة وحدها، بل في الطريق نفسه. فكل محطة يقف عندها الركب تحولت مع الوقت إلى مدينة: فيها ماء، وسوق، وحراسة، ومن يصلح الرحال. وهكذا نشأت مدن لم تقم على زراعة ولا صيد، وإنما على المرور.\n\nحين عرف البحارة كيف يستعملون الرياح الموسمية في المحيط الهندي، صار النقل بحرا أسرع وأرخص، فضعف الطريق البري وضمرت مدنه.\n\nوبقي من ذلك درس في الجغرافيا: المدن تنشأ حيث يتوقف الناس، لا حيث يمرون فقط.",
 [["ماذا كانت القوافل تحمل في طريق البخور؟",["اللبان والمر","الحرير والورق","الذهب والفضة"],0],
  ["كم تقريبا طول الطريق؟",["نحو ثلاثة آلاف كيلومتر","نحو ثلاثمئة كيلومتر","نحو ثلاثين ألف كيلومتر"],0],
  ["على أي شيء قامت مدن الطريق؟",["على المرور والخدمة لا على الزراعة","على الزراعة والصيد","على التعدين"],0],
  ["ما الذي أضعف الطريق البري؟",["النقل البحري بالرياح الموسمية","الحروب","جفاف الآبار"],0],
  ["ما الفكرة الرئيسة في القطعة؟",["المدن تنشأ حيث يتوقف الناس لا حيث يمرون","البخور أغلى من الذهب","السفر البري أفضل من البحري"],0]]],

["يعد ابن الهيثم من أوائل من جعل التجربة أساسا للعلم لا التأمل وحده. كان السائد قبله رأي قديم يقول إن العين ترسل شعاعا إلى الأشياء فتبصرها. فاعترض ابن الهيثم وقال: لو كان ذلك صحيحا لأبصرنا في الظلام.\n\nوأجرى تجاربه في غرفة مظلمة فتحت فيها ثقب صغير، فرأى صورة ما في الخارج تنعكس على الجدار المقابل مقلوبة. ومن هذا الباب فسر كيف يدخل الضوء إلى العين، وكيف تتكون الصورة.\n\nوأهم ما تركه ليس نتيجة بعينها، وإنما طريقته: أن يفرض الباحث فرضا، ثم يصمم تجربة قد تثبته وقد تهدمه، ثم يقبل ما تقوله التجربة ولو خالف شيخه.\n\nوقد سميت تلك الغرفة فيما بعد بالكاميرا، وهي كلمة أصلها القمرة: الغرفة المظلمة.",
 [["ما الرأي القديم الذي اعترض عليه ابن الهيثم؟",["أن العين ترسل شعاعا إلى الأشياء","أن الضوء لا ينتقل","أن الألوان في العين لا في الضوء"],0],
  ["بأي حجة رد ذلك الرأي؟",["لو صح لأبصرنا في الظلام","لأن القدماء لم يجربوا","لأن العين صغيرة"],0],
  ["ماذا رأى على الجدار المقابل للثقب؟",["صورة ما في الخارج مقلوبة","ضوءا أبيض فقط","ظلاما تاما"],0],
  ["ما أهم ما تركه ابن الهيثم؟",["طريقته في التجربة لا نتيجة بعينها","عدد كتبه","اسمه في الغرفة المظلمة"],0],
  ["ما أصل كلمة الكاميرا كما في القطعة؟",["القمرة أي الغرفة المظلمة","القمر","الكمارة اليونانية"],0]]],

["النحلة التي تجد حقل زهر لا تعود صامتة. تدخل الخلية وترقص رقصة لها شكل الرقم ثمانية، فيقترب منها بقية النحل ويتبع حركتها.\n\nوفي هذه الرقصة معلومتان دقيقتان. الاتجاه تدل عليه زاوية الخط المستقيم في وسط الرقصة بالنسبة إلى اتجاه الشمس، والمسافة يدل عليها طول زمن ذلك الخط: كلما طال الخط بعد الحقل.\n\nوالأعجب أن الرقصة تتعدل مع مرور الوقت. فالشمس تتحرك في السماء، فلو بقيت النحلة ترقص بالزاوية نفسها بعد ساعتين لأرسلت أخواتها إلى مكان خطأ. لذلك تصحح النحلة زاويتها بمقدار حركة الشمس، وكأن في رأسها ساعة.\n\nولم يكتشف هذا بالنظر وحده، بل بتعليم نحلات بعينها ومتابعتها واحدة واحدة سنوات طويلة.",
 [["ماذا تفعل النحلة حين تجد حقل زهر؟",["ترقص رقصة على شكل الرقم ثمانية","تصفر لأخواتها","تحمل زهرة إلى الخلية"],0],
  ["بم يدل على الاتجاه في الرقصة؟",["زاوية الخط المستقيم بالنسبة إلى الشمس","لون النحلة","عدد مرات الرقص"],0],
  ["بم تدل النحلة على بعد الحقل؟",["بطول زمن الخط المستقيم","بارتفاعها عن الأرض","بصوتها"],0],
  ["لماذا تعدل النحلة زاويتها مع الوقت؟",["لأن الشمس تتحرك في السماء","لأنها تتعب","لأن الحقل ينتقل"],0],
  ["كيف عرف العلماء ذلك؟",["بتعليم نحلات بعينها ومتابعتها سنوات","بالنظر العابر إلى الخلية","بالحساب وحده"],0]]],

["الحجر لا يتحمل الشد، ولكنه يتحمل الضغط تحملا هائلا. على هذه الجملة الواحدة قام فن بناء الجسور القديمة.\n\nفإذا وضعت لوحا حجريا مستقيما بين ضفتين، انحنى وسطه قليلا، فصار أعلاه مضغوطا وأسفله مشدودا، فانكسر من أسفل. أما إذا رتبت الأحجار على هيئة قوس، فإن ثقل الجسر كله يتحول إلى ضغط ينتقل من حجر إلى حجر حتى يبلغ الأرض على الطرفين. والحجر في الضغط قوي.\n\nوأغرب ما في القوس أن الحجر الأخير في أعلاه، وهو حجر القفل، لا يثبت البناء بوزنه وإنما بمكانه. وقبل وضعه يبقى القوس كله مسنودا بهيكل خشبي، فإذا وضع رفع الخشب ووقف القوس بنفسه.\n\nوكثير من جسور الرومان قائم إلى اليوم بلا حديد ولا إسمنت.",
 [["ما الذي يتحمله الحجر تحملا هائلا؟",["الضغط","الشد","الحرارة"],0],
  ["لماذا ينكسر اللوح الحجري المستقيم من أسفله؟",["لأن أسفله يكون مشدودا","لأن أعلاه يكون مشدودا","لأنه رقيق"],0],
  ["ماذا يفعل القوس بثقل الجسر؟",["يحوله إلى ضغط ينتقل حتى الأرض","يوزعه على الهواء","يخففه بالحديد"],0],
  ["بم يثبت حجر القفل البناء؟",["بمكانه لا بوزنه","بوزنه الكبير","بالإسمنت حوله"],0],
  ["ما الذي يدل عليه بقاء جسور الرومان إلى اليوم؟",["أن فهم القوى يغني عن كثرة المواد","أن الرومان استعملوا حديدا خفيا","أن الحجر لا يتغير أبدا"],0]]],

["قبل أن تعرف الجزيرة المضخات، كان الناس يستخرجون الماء بطريقة لا تحتاج إلى طاقة أصلا: الأفلاج. والفلج قناة تحفر تحت الأرض من سفح جبل فيه ماء جوفي إلى القرية، وتميل ميلا خفيفا جدا حتى يجري الماء بثقله وحده.\n\nوالعمل فيه شاق ودقيق. تحفر على طول المسار آبار رأسية متقاربة لإخراج التراب ولتهوية العمال، ثم توصل بينها القناة تحت الأرض. وخطأ بسيط في الميل يوقف الماء أو يجعله يحفر مجراه ويهدم القناة.\n\nوكان للفلج نظام توزيع عادل يقاس بالوقت لا بالكمية: لكل مزرعة نوبة بعدد ساعات معلومة، يحسبها الناس أول الأمر بظل عمود، ثم بساعة مائية.\n\nوما زال بعض الأفلاج يجري منذ أكثر من ألف سنة.",
 [["ما الفلج؟",["قناة تحت الأرض تنقل الماء من سفح الجبل إلى القرية","بئر عميقة واسعة","سد يحجز ماء المطر"],0],
  ["لماذا تميل القناة ميلا خفيفا؟",["ليجري الماء بثقله وحده","ليبرد الماء","لتقل كلفة الحفر"],0],
  ["ما فائدة الآبار الرأسية على طول المسار؟",["إخراج التراب وتهوية العمال","تخزين الماء","تحديد ملكية الأرض"],0],
  ["بم كان يقاس نصيب كل مزرعة؟",["بالوقت لا بالكمية","بالكمية لا بالوقت","بعدد الأشجار"],0],
  ["ماذا يدل عليه بقاء بعض الأفلاج أكثر من ألف سنة؟",["أن الهندسة الدقيقة تعمر طويلا","أن الماء لا ينفد","أن القرى لم تتغير"],0]]],

["يظن كثير من الناس أن الذاكرة مثل صندوق: ما وضعته فيه بقي كما هو حتى تخرجه. والبحث يقول غير ذلك. فالذكرى تبنى من جديد في كل مرة تستدعى فيها، وتتأثر في أثناء ذلك بما تعرفه الآن وبالكلمات التي سئلت بها.\n\nوقد أجريت تجربة مشهورة عرض فيها على مجموعتين مقطع لحادث سيارتين. سئلت الأولى: كم كانت سرعتهما حين اصطدمتا؟ وسئلت الثانية: كم كانت سرعتهما حين تحطمتا؟ فقدرت المجموعة الثانية سرعة أعلى، وبعد أسبوع تذكر كثير منها زجاجا مكسورا لم يكن في المقطع أصلا.\n\nولهذا تؤخذ شهادة الشاهد بحذر، لا لأنه يكذب، ولكن لأن سؤالا واحدا قد يعيد تشكيل ما رآه.",
 [["بم يشبه كثير من الناس الذاكرة خطأ؟",["بالصندوق الذي يحفظ ما وضع فيه","بالمرآة","بالنهر"],0],
  ["ما الذي يقوله البحث عن الذكرى؟",["أنها تبنى من جديد في كل استدعاء","أنها تختفي بسرعة","أنها لا تتغير أبدا"],0],
  ["بم اختلف سؤال المجموعتين؟",["بكلمة اصطدمتا وكلمة تحطمتا","بطول المقطع","بعدد المشاهدين"],0],
  ["ماذا تذكرت المجموعة الثانية بعد أسبوع؟",["زجاجا مكسورا لم يكن في المقطع","رقم السيارة","اسم السائق"],0],
  ["لماذا تؤخذ شهادة الشاهد بحذر؟",["لأن صياغة السؤال قد تعيد تشكيل ما رآه","لأن الشهود يكذبون عادة","لأن الحوادث سريعة"],0]]],

["حكم قاض في بلدة صغيرة في نزاع على أرض، فقضى بها لأحد الخصمين. ومضت على الحكم ستة أشهر، ثم جاءه في المسجد رجل لا علاقة له بالقضية، فذكر في حديث عابر أمرا عن حدود تلك الأرض لم يكن القاضي يعلمه.\n\nعاد القاضي إلى الملف تلك الليلة فوجد أن ما بني عليه حكمه ناقص. ولم يطلب منه أحد المراجعة، ولم يتظلم المحكوم عليه، وكان في وسعه أن يسكت فلا يعلم أحد.\n\nفجمع الخصمين في اليوم التالي وقال أمام الناس: حكمي الأول كان على ما بلغني، وقد بلغني بعده ما ينقضه. ثم نقض حكمه ورد الأرض.\n\nقيل له: أما خشيت أن تسقط هيبتك؟ قال: الهيبة أن يعلم الناس أن حكمي يتبع الحق، لا أن الحق يتبع حكمي.",
 [["في أي شيء حكم القاضي؟",["في نزاع على أرض","في دين بين تاجرين","في خصومة بين جارين"],0],
  ["كم مضى على الحكم قبل أن يعلم بالنقص؟",["ستة أشهر","ستة أيام","سنتان"],0],
  ["كيف علم القاضي بما ينقض حكمه؟",["من حديث عابر لرجل لا علاقة له بالقضية","من تظلم المحكوم عليه","من محكمة أعلى"],0],
  ["ماذا كان في وسعه أن يفعل؟",["أن يسكت فلا يعلم أحد","أن يرفع القضية","أن يعتزل القضاء"],0],
  ["ما معنى قوله الأخير؟",["أن هيبة القاضي في اتباعه الحق لا في ثباته على خطئه","أن الهيبة لا قيمة لها","أن الناس لا يفهمون الأحكام"],0]]],

["ترك رجل لابنه عند موته صندوقا مغلقا ووصية فيها سطر واحد: لا تفتحه إلا يوم تعجز. كان الابن في العشرين، فوضع الصندوق فوق خزانته.\n\nوفي السنة الأولى خسر تجارته، فمد يده إلى الصندوق ثم تراجع وقال: لم أعجز بعد، عندي صحة. فعمل أجيرا حتى قام من جديد.\n\nوبعد عشر سنين مرض مرضا طويلا، فنظر إلى الصندوق وقال: لم أعجز، عندي أهل يعينونني. وبعد عشرين سنة مات ابن له، فنظر إليه وقال: لم أعجز، عندي صبر.\n\nوفتحه وهو ابن سبعين، فوجد فيه ورقة واحدة مكتوبا فيها: إن قرأت هذا فقد مرت بك مصائب ولم تفتحه، وهذا كل ما كنت أريد أن أعلمك إياه.",
 [["ماذا ترك الرجل لابنه؟",["صندوقا مغلقا ووصية بسطر واحد","مالا كثيرا","دكانا في السوق"],0],
  ["متى أذن له أن يفتحه؟",["يوم يعجز","بعد سنة","يوم يتزوج"],0],
  ["بم اعتذر عن فتحه حين خسر تجارته؟",["بأن عنده صحة","بأنه نسي مكانه","بأن الوقت لم يحن"],0],
  ["في أي عمر فتح الصندوق؟",["في السبعين","في العشرين","في الثلاثين"],0],
  ["ما الذي أراد الأب أن يعلمه إياه؟",["أن يبحث عن قوته قبل أن يطلب العون","أن يحفظ المال","أن يطيع الوصايا حرفيا"],0]]],

["كان في الصف طالب يسأل السؤال مرتين. يسأل، فيجيبه المعلم، فيسكت قليلا ثم يعيد السؤال بصيغة أخرى. ضجر زملاؤه وقالوا: قد أجابك.\n\nوصارحه المعلم يوما، فقال الطالب: أنا لا أعيد السؤال لأني لم أسمع، إنما أعيده لأني أريد أن أعرف هل فهمت الجواب أم حفظت لفظه. فإذا أعدت السؤال بكلمات غير كلماتك ولم أستطع أن أربطه بجوابك، علمت أني لم أفهم.\n\nسكت المعلم طويلا ثم قال: سأعلم الصف كله هذا.\n\nوصار في الحصة وقت اسمه: أعد السؤال بكلماتك. وبعد شهرين كان متوسط الصف قد ارتفع، لا لأن المعلم شرح أكثر، بل لأن الطلاب صاروا يكتشفون بأنفسهم أين لم يفهموا.",
 [["ماذا كان يفعل الطالب بعد أن يجيبه المعلم؟",["يعيد السؤال بصيغة أخرى","يكتب الجواب","يسأل زميله"],0],
  ["لماذا كان يعيد السؤال؟",["ليعرف هل فهم أم حفظ اللفظ","لأنه لم يسمع","ليشغل الحصة"],0],
  ["ما العلامة التي تدل عنده على عدم الفهم؟",["ألا يستطيع ربط السؤال بكلماته بالجواب","أن ينسى الجواب بعد يوم","أن يخطئ في الاختبار"],0],
  ["ماذا فعل المعلم بعد ذلك؟",["جعل في الحصة وقتا لإعادة السؤال بكلمات الطالب","نقل الطالب إلى صف آخر","أطال الشرح"],0],
  ["لماذا ارتفع متوسط الصف؟",["لأن الطلاب صاروا يكتشفون أين لم يفهموا","لأن الأسئلة صارت أسهل","لأن المعلم شرح أكثر"],0]]],

["جارنا نجار لا يضع مسمارا في موضع يظهر فيه. يصل الخشب بلسان وتجويف، وهو عمل يطول ويتعب، فسأله ابنه: من سيعلم إن وضعت مسمارا وطليت فوقه؟\n\nقال الأب: الكرسي سيعلم.\n\nولم يفهم الابن، فأخذه إلى بيت قديم في الحي، وأراه بابا عمره أكثر من مئة سنة ما زال يغلق. ثم أراه بابا آخر في بيت حديث قد تفكك بعد ثماني سنين، وقال: هذا وضع فيه مسمار. والمسمار يصدأ ويتسع ثقبه ويتحرك، أما اللسان والتجويف فيشتد الخشب عليهما كلما جف.\n\nصار الابن نجارا. وكان يقول لزبائنه: لا تحكموا على صنعتي اليوم، احكموا عليها بعد عشر سنين.",
 [["بم كان النجار يصل الخشب؟",["بلسان وتجويف","بالمسامير","بالغراء وحده"],0],
  ["ماذا سأله ابنه؟",["من سيعلم إن وضع مسمارا وطلى فوقه","كم ثمن الخشب","لماذا يعمل ببطء"],0],
  ["ماذا أراه الأب في الحي؟",["بابا عمره أكثر من مئة سنة ما زال يغلق","ورشة نجارة قديمة","شجرة كبيرة"],0],
  ["لماذا يفسد المسمار الوصلة؟",["يصدأ ويتسع ثقبه فيتحرك","يكسر الخشب فورا","يغير لون الخشب"],0],
  ["ما الذي كان الابن يقوله لزبائنه؟",["احكموا على صنعتي بعد عشر سنين","ادفعوا بعد التجربة","لا تسألوا عن الثمن"],0]]],

["يرتفع ماء البحر وينخفض مرتين في اليوم تقريبا، وسبب ذلك جذب القمر للأرض. فالقمر يجذب الماء في الجهة المقابلة له فينتفخ، ويجذب الأرض نفسها بعيدا عن الماء في الجهة الأخرى فينتفخ هناك أيضا. ولهذا كان المد مرتين لا مرة واحدة.\n\nوللشمس أثر كذلك، ولكنه أقل من أثر القمر رغم عظمها، لأن الجذب يضعف مع البعد ضعفا شديدا. فإذا اصطفت الشمس والقمر والأرض على خط واحد اجتمع الجذبان فكان المد أعلى، وإذا تعامدا تعارضا فكان المد أضعف.\n\nوقد عرف البحارة هذا قبل أن يعرفوا سببه بقرون، فكانوا يدخلون الموانئ الضحلة في المد ويخرجون منها فيه، ويحسبون مواعيده بالقمر لا بالساعة.",
 [["كم مرة يرتفع ماء البحر في اليوم تقريبا؟",["مرتين","مرة واحدة","أربع مرات"],0],
  ["لماذا يحدث المد في الجهة البعيدة عن القمر أيضا؟",["لأن القمر يجذب الأرض نفسها بعيدا عن الماء هناك","لأن الماء يدور حول الأرض","بسبب الرياح"],0],
  ["لماذا أثر الشمس أقل من أثر القمر؟",["لأن الجذب يضعف مع البعد ضعفا شديدا","لأن الشمس أصغر","لأن الشمس لا تجذب الماء"],0],
  ["متى يكون المد أعلى؟",["حين تصطف الشمس والقمر والأرض على خط واحد","حين يغيب القمر","في الشتاء"],0],
  ["بم كان البحارة يحسبون مواعيد المد؟",["بالقمر لا بالساعة","بالنجوم","بالرياح"],0]]],

["كانت للعرب قبل الإسلام أسواق تقام في مواسم معلومة، وأشهرها سوق عكاظ قرب الطائف. ولم تكن سوقا للبيع وحده، فقد كانت تقام في الأشهر الحرم التي يحرم فيها القتال، فيأمن الناس ويجتمعون.\n\nوكان فيها ما هو أبقى من التجارة: المنافرة والمفاخرة بالشعر. يقف الشاعر فينشد، ويحكم بين الشعراء حكم يرضون به، فتذيع القصيدة في القبائل في أيام.\n\nوأثر ذلك في اللغة أثرا بالغا. فالقبائل مختلفة اللهجات، فلما صارت تتحاكم في موسم واحد إلى أذن واحدة، ارتفعت لغة مشتركة فوق اللهجات هي التي نزل بها القرآن بعد ذلك وكتب بها الشعر.\n\nفالسوق الذي يذكر اليوم بوصفه سوقا كان في حقيقته أول منبر إعلامي في الجزيرة.",
 [["أين كان يقام سوق عكاظ؟",["قرب الطائف","قرب مكة","في اليمن"],0],
  ["لماذا كان الناس يأمنون فيه؟",["لأنه يقام في الأشهر الحرم","لأن عليه حراسا","لأنه بعيد عن القبائل"],0],
  ["ما الذي كان أبقى فيه من التجارة؟",["المنافرة والمفاخرة بالشعر","بيع الخيل","عقد الأحلاف"],0],
  ["ما أثر ذلك في اللغة؟",["ارتفعت لغة مشتركة فوق اللهجات","اندثرت اللهجات كلها","انتشرت لهجة الطائف"],0],
  ["بم وصف الكاتب السوق في آخر القطعة؟",["بأنه أول منبر إعلامي في الجزيرة","بأنه أكبر سوق في العالم","بأنه مجرد سوق للبيع"],0]]],

["المعجم العربي لا يرتب كلماته كما ترتب المعاجم في أكثر اللغات. فالإنجليزي يرتب حروف الكلمة كما تنطق، أما العربي فيرد الكلمة إلى جذرها أولا، ثم يبحث عن الجذر.\n\nفكلمة استخراج واستخرج ومستخرج ومخرج وخارج كلها في موضع واحد تحت خرج. وهذا يعني أن من يفتح المعجم يرى معاني الأسرة كلها أمامه دفعة واحدة، فيدرك الصلة بين الخروج والمخرج والخراج.\n\nوثمن هذا الترتيب أنه يحتاج مهارة: على القارئ أن يعرف الجذر قبل أن يبحث، وأن يميز الحرف الأصلي من الزائد.\n\nولذلك قيل إن المعجم العربي لا يقرأ للباحث عن معنى واحد فقط، بل يقرأ لمن يريد أن يرى كيف تتولد المعاني بعضها من بعض.",
 [["كيف يرتب المعجم العربي كلماته؟",["يردها إلى جذرها ثم يرتب الجذور","كما تنطق حروفها","حسب طولها"],0],
  ["أين توضع كلمات استخرج ومخرج وخارج؟",["في موضع واحد تحت خرج","كل واحدة في مكانها الهجائي","في آخر المعجم"],0],
  ["ما فائدة هذا الترتيب؟",["يرى القارئ معاني الأسرة كلها دفعة واحدة","يختصر عدد الصفحات","يسهل على المبتدئ"],0],
  ["ما ثمن هذا الترتيب؟",["يحتاج معرفة الجذر وتمييز الزائد من الأصلي","يجعل المعجم أغلى","يضيع بعض الكلمات"],0],
  ["لمن يقرأ المعجم العربي كما في آخر القطعة؟",["لمن يريد أن يرى كيف تتولد المعاني","لمن يحفظ الكلمات","للباحث عن معنى واحد فقط"],0]]],

["في المحيط الهندي رياح تنعكس جهتها مرتين في السنة: تهب من الجنوب الغربي في الصيف، ومن الشمال الشرقي في الشتاء. وهذه هي الرياح الموسمية، واسمها مأخوذ من كلمة موسم العربية.\n\nوقد بنى البحارة العرب ملاحتهم على هذا الانقلاب. فالسفينة تخرج من موانئ الجزيرة والخليج مع ريح الشتاء إلى الهند وسواحل إفريقيا، وتقيم هناك أشهرا حتى تنقلب الريح، ثم تعود بها. فالرحلة ليست ذهابا وإيابا في أسابيع، وإنما دورة في سنة.\n\nولهذا نشأت في تلك الموانئ جاليات مقيمة من التجار، ونشأت معها كلمات مشتركة بين السواحلية والعربية والفارسية والهندية.\n\nفالريح لم تنقل البضاعة وحدها، بل رتبت حياة الناس على إيقاعها.",
 [["كم مرة تنعكس جهة الرياح الموسمية في السنة؟",["مرتين","مرة","أربع مرات"],0],
  ["من أين أخذ اسم هذه الرياح؟",["من كلمة موسم العربية","من اسم بحار هندي","من اسم ميناء"],0],
  ["كيف كانت السفينة تعود؟",["تنتظر حتى تنقلب الريح ثم تعود بها","تجدف ضد الريح","تسلك طريقا بريا"],0],
  ["ماذا نشأ في الموانئ بسبب طول الإقامة؟",["جاليات مقيمة من التجار وكلمات مشتركة","مدن عسكرية","مزارع كبيرة"],0],
  ["ما الفكرة الرئيسة في القطعة؟",["الريح رتبت حياة الناس لا نقلت البضاعة فقط","الملاحة البحرية خطرة","المحيط الهندي أكبر المحيطات"],0]]],

["القمر لا يضيء بنفسه، وإنما يعكس ضوء الشمس. ونصفه المواجه للشمس مضيء دائما، ونصفه الآخر مظلم دائما، سواء رأينا ذلك أم لم نره.\n\nوالذي يتغير هو زاوية نظرنا نحن. فالقمر يدور حول الأرض في نحو تسعة وعشرين يوما، وفي أثناء دورانه نرى من نصفه المضيء قدرا يزيد وينقص: فإذا كان بيننا وبين الشمس رأينا وجهه المظلم وهو المحاق، وإذا كانت الأرض بينه وبين الشمس رأينا وجهه المضيء كاملا وهو البدر.\n\nوأما الظن بأن ظل الأرض هو الذي يصنع الأوجه فخطأ شائع؛ ظل الأرض يقع على القمر في الخسوف فقط، وهو حدث نادر لا يتكرر كل شهر.\n\nوالقمر يدور حول نفسه في المدة التي يدور فيها حول الأرض، ولذلك لا نرى من وجهه إلا جهة واحدة أبدا.",
 [["من أين يأتي ضوء القمر؟",["يعكس ضوء الشمس","يضيء بنفسه","من الأرض"],0],
  ["ما الذي يتغير حتى نرى أوجه القمر؟",["زاوية نظرنا إليه","كمية ضوء الشمس","حجم القمر"],0],
  ["متى يكون المحاق؟",["حين يكون القمر بيننا وبين الشمس","حين تكون الأرض بينه وبين الشمس","في الخسوف"],0],
  ["ما الخطأ الشائع الذي ذكرته القطعة؟",["أن ظل الأرض هو الذي يصنع أوجه القمر","أن القمر يدور حول الشمس","أن القمر لا يدور"],0],
  ["لماذا لا نرى إلا جهة واحدة من القمر؟",["لأنه يدور حول نفسه في مدة دورانه حول الأرض","لأنه ثابت لا يدور","لأن الجهة الأخرى مظلمة"],0]]]

  ] }
 },

 /* ═══ رفيف — ثاني متوسّط ═══════════════════════════════════════════
    طلبُ الأب (٢٢ أكتوبر ٢٠٢٦): «حطّ لرفيف نفس حسن في القطعة».

    وقطعُها كانت على حالِ قطعِه قبل أمس: أربعٌ وعشرون، وسطُ الإنجليزيّة
    ثمانٍ وعشرون كلمةً وأطولُها ثلاثٌ وأربعون، والعربيّةُ عشرون.
    وفيها مكرّرٌ كذلك: الرياضةُ مرّتين، والتلوّثُ مرّتين، والصدقُ
    مرّتين، والصحراءُ مرّتين، والقراءةُ مرّتين، والوقتُ ثلاثًا.

    وهي دونَه بسنةٍ دراسيّة، فقطعُها دونَ قطعِه طولًا: الإنجليزيّةُ
    ١١٠–١٢٥ كلمةً (وقطعُه ١٥٦)، والعربيّةُ ٩٠–١٠٠ (وقطعُه ١٠٥). ولها
    خمسةُ أسئلةٍ لكلِّ قطعةٍ مثلُه، وثمانيُ قصصٍ سرديّةٍ في كلِّ لغة.

    والمواضيعُ جديدةٌ عليها وعليه: قُوبِلت بقطعِها الأربعِ والعشرين
    وبقطعِه التسعِ عشرةَ قبل الكتابة، فلا يلتقيان في موضوعٍ ولا تجد
    عنده جوابًا جاهزًا. */
 rafeef: {
  en: { pass: [

["Noura's science teacher gave each student a plastic rain gauge and one instruction: read it at seven o'clock every morning and write the number down. Most of the class stopped after a week, because in their city it rarely rains.\n\nNoura did not stop. For nine months she wrote a number almost every day, and almost every number was zero.\n\nIn March a storm came. Her page showed forty-one millimetres in a single night, more than the whole year before it.\n\nHer teacher photocopied the notebook for the class. She said that anyone can record an interesting day. What is difficult, and what makes the interesting day mean anything at all, is recording the empty ones first.",
 [["What did the teacher give each student?",["a plastic rain gauge","a notebook of answers","a thermometer"],0],
  ["Why did most of the class stop?",["it rarely rains in their city","the gauge broke","the teacher forgot"],0],
  ["How long did Noura keep recording?",["nine months","nine days","one week"],0],
  ["What did her page show in March?",["forty-one millimetres in one night","no rain at all","a mistake"],0],
  ["What was the teacher's point?",["the empty records give the interesting one its meaning","Noura was luckier than the others","rain gauges are not useful"],0]]],

["The school library had a rule: lose your card and you pay five riyals for a new one. Hessa lost hers in the second week of term and did not have five riyals.\n\nFor two months she went to the library anyway. She read standing at the shelves, finished nothing, and started the same book four times.\n\nThe librarian noticed. She did not offer to cancel the fee, which Hessa would have refused. Instead she asked Hessa to spend twenty minutes each Thursday putting returned books back on the shelves, and she paid her in library cards.\n\nHessa shelved books for the rest of the year. She says she learned the whole classification system by accident, and that it is still the most useful thing she knows.",
 [["What was the library's rule?",["a lost card costs five riyals","books must be returned in a week","no reading at the shelves"],0],
  ["What did Hessa do for two months?",["she read standing at the shelves","she stopped coming","she borrowed her friend's card"],0],
  ["What did the librarian suggest?",["shelving work paid in library cards","a loan of five riyals","a letter to her family"],0],
  ["Why did she not simply cancel the fee?",["Hessa would have refused it","the rule could not be changed","she did not want to"],0],
  ["What did Hessa gain without planning to?",["she learned the classification system","she became a librarian","she got free books"],0]]],

["Every autumn Maryam's grandmother dried seeds from her garden, folded them into squares of newspaper, and wrote the year on each one in pencil. She kept them in a biscuit tin under her bed.\n\nWhen she died, the family found forty-three packets. Some were nineteen years old.\n\nMaryam's uncle wanted to throw them away, because seeds that old rarely grow. Maryam asked for one week instead. She planted every packet in trays on the roof and watered them.\n\nNine packets came up. One of them was a tomato her grandmother had grown from a plant her own mother had grown, and it is not sold in any shop.\n\nMaryam dries seeds every autumn now, and she writes the year in pencil.",
 [["How did the grandmother store the seeds?",["folded in newspaper in a biscuit tin","in glass jars in the kitchen","in the garden soil"],0],
  ["How many packets did the family find?",["forty-three","nineteen","nine"],0],
  ["What did the uncle want to do?",["throw them away","plant them himself","sell them"],0],
  ["How many packets grew?",["nine","forty-three","none"],0],
  ["Why was one tomato special?",["it came down through three generations and is not sold anywhere","it was the largest","it grew fastest"],0]]],

["On her first day at the new school, Lama took the wrong bus. She realised it twenty minutes later, when the buildings outside the window stopped looking familiar.\n\nShe had no credit on her phone. The driver, who was nearly at the end of his route, told her to stay in her seat. He finished the route, and then drove the empty bus all the way back across the city to her school. He was forty minutes late for his own break.\n\nLama never learned his name. Years later, when she became a teacher, she kept a note on her desk that read: someone drove the empty bus back.\n\nShe says it reminds her what to do when a student arrives late and frightened.",
 [["When did Lama realise her mistake?",["twenty minutes later, when the buildings looked unfamiliar","as soon as she sat down","at the end of the day"],0],
  ["Why could she not call anyone?",["she had no credit on her phone","she had no phone","nobody answered"],0],
  ["What did the driver do?",["drove the empty bus back to her school","called her family","left her at a station"],0],
  ["What did it cost him?",["forty minutes of his break","his job","the bus fare"],0],
  ["Why does Lama keep the note?",["to remind her how to treat a frightened latecomer","to remember the bus number","because the driver wrote it"],0]]],

["Reem's science fair project was a model volcano. She had built it four times at home and it had worked four times. On the day, in front of the judges, nothing happened.\n\nShe checked the baking soda. She checked the vinegar. Then she noticed that the hall was cold, much colder than her kitchen, and she said so out loud: the reaction is slower at a lower temperature.\n\nThe judges asked her to prove it. She warmed the bottle of vinegar in her hands for three minutes and tried again, and the volcano erupted.\n\nShe did not win the prize for the best project. She won the prize for the best explanation, which her teacher said is the harder one, and the one scientists are actually given.",
 [["What happened on the day of the fair?",["nothing happened at first","the volcano broke","she arrived late"],0],
  ["What did Reem notice about the hall?",["it was much colder than her kitchen","it was very noisy","it was too small"],0],
  ["What did she say was happening?",["the reaction is slower at a lower temperature","the vinegar was old","the judges were wrong"],0],
  ["How did she prove it?",["she warmed the vinegar in her hands","she bought new vinegar","she waited an hour"],0],
  ["Which prize did she win?",["the prize for the best explanation","the prize for the best project","no prize"],0]]],

["The piano in the school hall had one key that made no sound: the B below middle C. Everyone worked around it. The music teacher chose pieces that avoided it, and after a while nobody heard the gap.\n\nA new student, Jana, asked why it had never been fixed. She was told that a tuner costs money and the school had other needs.\n\nJana opened the lid and looked. The problem was a small felt hammer that had slipped off its pin. She pushed it back with one finger. The repair took eleven seconds.\n\nThe teacher was not embarrassed, and said something Jana remembered. We stopped hearing it, she said, and once you stop hearing a problem you stop solving it. That is the part that costs money.",
 [["Which key made no sound?",["the B below middle C","middle C itself","the highest key"],0],
  ["How did the school cope with it?",["the teacher chose pieces that avoided it","they used another piano","they sang instead"],0],
  ["What was actually wrong?",["a felt hammer had slipped off its pin","a string had broken","the wood had split"],0],
  ["How long did the repair take?",["eleven seconds","eleven minutes","a whole day"],0],
  ["What was the teacher's point?",["once you stop noticing a problem you stop solving it","pianos are expensive","new students ask too many questions"],0]]],

["In a box of family photographs there was one that nobody could place: four women standing outside a door, with the date 1961 written on the back in faded ink.\n\nDalal took it to her great-aunt, who is ninety-one and does not always remember what she ate that morning. She looked at the photograph for a long time, then named all four women in order from left to right, including one who had died before Dalal's mother was born.\n\nThen she pointed at the door behind them and said that it was the first girls' school in the district, and that the photograph had been taken on the morning it opened.\n\nThe photograph is in a frame now. The names are on the back, in ink that will not fade.",
 [["What was written on the back of the photograph?",["the date 1961, in faded ink","the four names","nothing at all"],0],
  ["Who identified the women?",["Dalal's great-aunt, who is ninety-one","Dalal's mother","a neighbour"],0],
  ["What was surprising about her memory?",["she often forgets recent things but named all four in order","she had taken the photograph","she had never seen it"],0],
  ["What was the door behind them?",["the first girls' school in the district","her family home","a hospital"],0],
  ["Why were the names written again?",["so that they would not be lost a second time","because the old ink was wrong","to sell the photograph"],0]]],

["Every morning at six, the woman in the flat below Amal's watered a row of plants on her balcony. She had done it for as long as Amal could remember, and the sound of the tap was part of Amal's morning, the way a clock is.\n\nOne week the watering stopped. Amal noticed because of the silence.\n\nShe knocked. There was no answer, and no answer the next day either. On the third day she told her father, who called the building manager, who opened the door and found the woman on the floor of her kitchen. She had been there two days, and she recovered completely.\n\nAmal did not save her by being kind. She saved her by noticing something small and ordinary, every day, until the day it changed.",
 [["What did the woman do every morning at six?",["watered plants on her balcony","walked to the shop","opened her windows"],0],
  ["How did Amal notice something was wrong?",["the sound of the tap was missing","she saw the plants dying","a neighbour told her"],0],
  ["What happened on the third day?",["she told her father, who called the building manager","she opened the door herself","she waited again"],0],
  ["How long had the woman been on the floor?",["two days","two hours","a week"],0],
  ["What does the last sentence say saved her?",["noticing something small and ordinary every day","an act of great kindness","good luck"],0]]],

["A spider building a round web does the hardest part first. It releases a thread into the air and waits for the wind to carry it until it catches on something. The spider cannot see where it lands, so it tests the line by pulling.\n\nOnce that first bridge is fixed, the rest is geometry. The spider lays spokes from the centre outward, then walks a widening spiral to space them evenly, then eats that spiral away as it lays a second one in the opposite direction.\n\nOnly the second spiral is sticky, and the spider remembers which threads those are. It walks on the dry spokes.\n\nA web like this takes about an hour, and many spiders rebuild theirs every single day.",
 [["What is the hardest part of building the web?",["the first thread, carried by the wind","the centre","the last spiral"],0],
  ["How does the spider know the thread has caught?",["it tests the line by pulling","it sees it land","it waits for rain"],0],
  ["Which spiral is sticky?",["the second one","the first one","both of them"],0],
  ["How does the spider avoid sticking to its own web?",["it walks on the dry spokes","it oils its legs","it never walks on the web"],0],
  ["How long does the web take?",["about an hour","about a minute","about a week"],0]]],

["Sunlight looks white, but it contains every colour, and the colours do not behave in the same way when they meet the air.\n\nAir is made of very small molecules. When light strikes something much smaller than its own wavelength it scatters, and short wavelengths scatter far more strongly than long ones. Blue is short; red is long. So blue light bounces around the sky in every direction, and when you look up, away from the sun, blue is what reaches your eye.\n\nAt sunset the light has to travel through far more air to reach you. By then most of the blue has been scattered away, and what is left to arrive is red and orange.\n\nThe sky is not coloured. The air is sorting the light.",
 [["What does white sunlight actually contain?",["every colour","only blue","only white light"],0],
  ["Which wavelengths scatter more strongly?",["short ones, such as blue","long ones, such as red","all of them equally"],0],
  ["Why do we see blue when we look up?",["scattered blue light reaches the eye from every direction","the sky is painted blue","the sea reflects upward"],0],
  ["Why is the sky red at sunset?",["the light passes through more air and the blue is scattered away","the sun changes colour","dust turns it red"],0],
  ["What does the last sentence mean?",["the colour comes from sorting, not from the sky itself","the sky has no colour at sunset","air is blue"],0]]],

["A dog's sense of smell is not simply better than ours; it works differently. A dog has about three hundred million scent receptors, and a passage in its nose that sends a separate stream of air to them, so it can smell and breathe at the same time.\n\nThis makes dogs useful in medicine. Trained dogs can identify certain illnesses from a sample, sometimes earlier than a laboratory test can, because a change inside the body can change the chemicals a person gives off long before anything is visible.\n\nThe dogs are not diagnosing anybody. They are reporting a smell they were taught to report, and a doctor decides what it means.\n\nThat division of work is the whole point: the dog finds, and the human judges.",
 [["How many scent receptors does a dog have?",["about three hundred million","about three hundred","about three million"],0],
  ["What can a dog's nose do that ours cannot?",["smell and breathe at the same time","smell colours","smell through glass"],0],
  ["Why can a dog notice an illness early?",["a change in the body changes the chemicals given off","dogs can see inside the body","dogs are never wrong"],0],
  ["Are the dogs diagnosing the illness?",["no, they report a smell they were trained to report","yes, they replace the doctor","yes, but only sometimes"],0],
  ["How is the work divided?",["the dog finds and the human judges","the human finds and the dog judges","both do the same thing"],0]]],

["Water alone cannot wash away oil, because water molecules stick to one another and oil molecules stick to one another, and the two refuse to mix.\n\nA soap molecule solves this by being two things at once. One end of it is attracted to water, and the other end is attracted to oil. When soap meets a greasy plate, the oil-loving ends bury themselves in the grease while the water-loving ends face outward.\n\nThe result is a tiny ball with oil trapped inside it and a water-friendly surface outside. Water can now carry the whole thing away.\n\nSoap does not dissolve dirt and it does not destroy it. It surrounds it and makes it portable, which is why rinsing matters as much as scrubbing.",
 [["Why can water alone not remove oil?",["water and oil refuse to mix","water is not strong enough","oil is too heavy"],0],
  ["What is unusual about a soap molecule?",["one end is attracted to water and the other to oil","it is very large","it dissolves in oil only"],0],
  ["What forms around the grease?",["a tiny ball with oil trapped inside","a hard crust","a layer of foam"],0],
  ["What does soap actually do to dirt?",["it surrounds it and makes it portable","it destroys it","it dries it out"],0],
  ["Why does rinsing matter so much?",["the dirt is carried away, not destroyed","soap is harmful if left","water finishes the cleaning alone"],0]]],

["Louis Braille lost his sight at the age of three, in an accident in his father's workshop. At ten he was sent to a school for blind boys in Paris, where the books had raised printed letters pressed into thick paper. Those books were enormous, slow to read, and impossible to write.\n\nWhen he was twelve, a soldier visited the school and showed the boys a code of raised dots that soldiers used to read messages in the dark. It used twelve dots for each symbol and was far too complex.\n\nBraille reduced it to six. By the age of fifteen he had finished the system that carries his name.\n\nHis own school did not adopt it while he taught there. It was accepted two years after he died.",
 [["How did Braille lose his sight?",["in an accident in his father's workshop","from an illness","he was born blind"],0],
  ["What was wrong with the raised-letter books?",["huge, slow to read and impossible to write","too expensive to buy","written in the wrong language"],0],
  ["Where did the idea of dots come from?",["a soldier's code for reading in the dark","his teacher","a printer in Paris"],0],
  ["How many dots did Braille use for each symbol?",["six","twelve","three"],0],
  ["When was his system accepted?",["two years after he died","while he was a student","when he was fifteen"],0]]],

["An onion sitting whole on a shelf does nothing to your eyes. The trouble begins the moment you cut it.\n\nInside the cells of an onion are two substances that are kept apart: a sulphur compound and an enzyme. A knife breaks the cell walls and lets them meet. The reaction produces a gas that drifts upward, reaches the water on the surface of your eye, and forms a weak acid there.\n\nYour eye responds by washing itself, which is why you cry.\n\nChilling the onion slows the reaction down. A sharp knife crushes fewer cells than a blunt one. Cutting under running water carries the gas away before it rises. None of these are tricks; each one simply interrupts a step.",
 [["Why is a whole onion harmless to the eyes?",["the two substances are kept apart inside the cells","it has no gas in it","the skin blocks the gas"],0],
  ["What does the knife do?",["it breaks the cell walls so the two substances meet","it releases water","it heats the onion"],0],
  ["What forms on the surface of the eye?",["a weak acid","a layer of oil","a gas bubble"],0],
  ["Why does a sharp knife help?",["it crushes fewer cells","it cuts faster","it is colder"],0],
  ["What do all three remedies have in common?",["each interrupts a step in the reaction","each uses water","each needs a fridge"],0]]],

["A library does not store its books in the order it bought them. If it did, finding anything would mean searching every shelf in the building.\n\nInstead, most libraries give each book a number that describes its subject, and the numbers run in order along the shelves. A book about astronomy sits beside the other books about astronomy, even if they arrived twenty years apart.\n\nThis has a side effect that is more useful than the system itself. When you reach the shelf for the book you wanted, you are standing in front of every other book on that subject. Many readers find the book they needed next to the one they came for.\n\nA catalogue tells you where a book is. The shelf tells you what else exists.",
 [["Why are books not shelved in the order they were bought?",["finding anything would mean searching every shelf","old books would wear out","the numbers would run out"],0],
  ["What does a book's number describe?",["its subject","its price","the year it arrived"],0],
  ["What happens when you reach the right shelf?",["you stand in front of every book on that subject","you must ask for help","the book is always borrowed"],0],
  ["What is the difference between the catalogue and the shelf?",["one tells you where a book is, the other what else exists","one is older than the other","there is no difference"],0],
  ["What is the useful side effect?",["readers find books they did not know to look for","books last longer","the library needs fewer staff"],0]]],

["The Arabian oryx is a white desert antelope with long straight horns. It can survive without drinking at all, taking the water it needs from the plants it eats and from the dew that collects on them before dawn.\n\nBy 1972 it had been hunted until none were left in the wild. The species survived only because a small number had been taken into captivity years earlier, in Arizona and in private collections in the Arabian Peninsula.\n\nThose animals were bred carefully, and their descendants were released into protected areas in Oman, Saudi Arabia, the Emirates and Jordan.\n\nIn 2011 the Arabian oryx became the first animal ever moved from Extinct in the Wild back to Vulnerable. There are more than a thousand now.",
 [["How does the oryx get the water it needs?",["from the plants it eats and the dew on them","from deep wells","from winter rain only"],0],
  ["What had happened by 1972?",["none were left in the wild","they had spread across Africa","they were protected by law"],0],
  ["Why did the species survive at all?",["a small number had been taken into captivity earlier","they hid in the mountains","hunting was banned in time"],0],
  ["What happened in 2011?",["it was moved from Extinct in the Wild back to Vulnerable","it disappeared again","it was discovered in Oman"],0],
  ["What makes that change remarkable?",["it was the first animal ever to do it","it happened in one year","it cost nothing"],0]]],

["The date palm has been grown in Arabia for more than five thousand years, and almost every part of it has a use. The fruit is food, the trunk is timber, the leaves are woven into baskets and roofing, and the fibre is twisted into rope.\n\nThe tree is unusual in another way. Date palms are male or female, and only the female bears fruit. A single male can pollinate dozens of females, so farmers pollinate by hand and keep very few males.\n\nA palm takes between four and eight years to bear its first fruit, and it can go on bearing for a hundred years.\n\nThis is why planting a palm has always been understood as something a person does for somebody else.",
 [["How long has the date palm been grown in Arabia?",["more than five thousand years","about five hundred years","since the last century"],0],
  ["Name a use besides the fruit.",["the leaves are woven into baskets and roofing","the fruit stones are eaten","the roots are used as medicine"],0],
  ["Which trees bear fruit?",["only the female trees","only the male trees","all of them"],0],
  ["Why do farmers keep very few males?",["one male can pollinate dozens of females","males grow too tall","males need more water"],0],
  ["What does the last sentence mean?",["the planter is often not the one who benefits","palms should be planted in groups","palms are expensive to plant"],0]]],

["The Hijaz Railway was built between 1900 and 1908 to carry pilgrims from Damascus toward Madinah. The journey had taken about forty days by camel; by train it took four.\n\nThe line ran for more than thirteen hundred kilometres, and it was built largely with donations from Muslims all over the world, which is one reason so many of its stations carry no company name.\n\nIt operated for less than a decade. Damage during the First World War closed the southern section, and it was never reopened.\n\nMuch of the track is still there, crossing empty country, with stone stations standing at intervals in the desert. Some have been restored as museums, and the line is better remembered than many that lasted longer.",
 [["When was the railway built?",["between 1900 and 1908","in the 1950s","before 1800"],0],
  ["How long was the journey before and after?",["forty days by camel, four by train","four days by camel, forty by train","the same either way"],0],
  ["How was the line paid for?",["largely by donations from Muslims around the world","by a European company","by ticket sales"],0],
  ["Why did it close?",["damage during the First World War","the track was never finished","nobody used it"],0],
  ["What remains of it today?",["track and stone stations, some restored as museums","nothing at all","a working line to Madinah"],0]]]

  ] },

  ar: { pass: [

["وصل إلى مكتبة المدرسة طرد فيه كتاب واحد ورسالة. الكتاب مستعار منذ عشرين سنة، والرسالة من رجل يقول: استعرته وأنا في الثالث المتوسط، ثم نقل أبي إلى مدينة أخرى قبل أن أعيده، فحملته معي في كل بيت سكنته.\n\nوفي الرسالة سطر آخر: لم أقرأه إلا بعد عشر سنين، ولما قرأته عرفت لماذا لم أستطع أن أرميه.\n\nأرادت أمينة المكتبة أن تحسب الغرامة، ثم تركت ذلك وعلقت الرسالة على باب المكتبة.\n\nوصار الطلاب يقرؤون الرسالة قبل أن يستعيروا. وقل فقد الكتب في تلك السنة قلة لم تفسر بشيء آخر.",
 [["ماذا كان في الطرد؟",["كتاب ورسالة","مال وكتاب","رسالة وحدها"],0],
  ["متى استعار الرجل الكتاب؟",["وهو في الثالث المتوسط قبل عشرين سنة","قبل سنة واحدة","وهو في الجامعة"],0],
  ["لماذا لم يعده في حينه؟",["نقل أبوه إلى مدينة أخرى","أضاعه","نسيه عمدا"],0],
  ["ماذا فعلت أمينة المكتبة؟",["تركت الغرامة وعلقت الرسالة على الباب","حسبت الغرامة كاملة","أعادت الطرد"],0],
  ["ما الأثر الذي ظهر تلك السنة؟",["قل فقد الكتب","زاد عدد المستعيرين فقط","لم يتغير شيء"],0]]],

["في أول حصة لم تشرح المعلمة شيئا. وقفت أمام الصف ومعها ورقة، وصارت تسأل كل طالبة عن اسمها، ثم عن الاسم الذي تحب أن تنادى به، ثم تكتبه.\n\nاستغرق ذلك الحصة كلها، فتضايقت بعض الطالبات؛ فالمنهج طويل والسنة قصيرة.\n\nوفي اليوم التالي دخلت الصف ونادت كل واحدة بالاسم الذي اختارته، ولم تخطئ في واحدة.\n\nقالت طالبة بعد سنوات: لا أذكر من ذلك الصف درسا بعينه، لكني أذكر أني في تلك السنة كنت أرفع يدي.\n\nولم يكن ذلك مصادفة؛ فمن ينادَ باسمه يصدق أن حضوره محسوب.",
 [["ماذا فعلت المعلمة في الحصة الأولى؟",["سألت كل طالبة عن اسمها وكتبته","شرحت أول درس","وزعت الكتب"],0],
  ["لماذا تضايقت بعض الطالبات؟",["لأن الحصة ضاعت والمنهج طويل","لأنهن لا يحببن أسماءهن","لأن المعلمة تأخرت"],0],
  ["ماذا فعلت في اليوم التالي؟",["نادت كل واحدة باسمها الذي اختارته بلا خطأ","أعادت السؤال نفسه","بدأت الاختبار"],0],
  ["بم تذكرت الطالبة تلك السنة؟",["بأنها كانت ترفع يدها","بدرس بعينه","بدرجاتها العالية"],0],
  ["ما الصلة بين النداء بالاسم ورفع اليد؟",["من ينادَ باسمه يصدق أن حضوره محسوب","لا صلة بينهما","النداء يجبر الطالبة على المشاركة"],0]]],

["في عمارة قديمة درجة مكسورة في السلم بين الدور الثاني والثالث. يعرفها السكان فيتخطونها، ولا يراها الضيف إلا بعد أن يقع.\n\nشكا الناس سنتين ولم يصلح أحد شيئا؛ لأن كل واحد يقول في نفسه: أنا أعرف موضعها.\n\nثم انتقل إلى العمارة رجل كفيف، فوقع في أول أسبوع مرتين.\n\nوفي اليوم التالي اجتمع ستة من الجيران فأصلحوا الدرجة في نصف ساعة، بإسمنت اشتروه بعشرين ريالا.\n\nقال أكبرهم وهو يمسح يديه: كنا نقول إننا تعودنا على الدرجة، وما تعودنا عليها، إنما تعودنا على ألا نصلح.",
 [["أين الدرجة المكسورة؟",["بين الدور الثاني والثالث","عند باب العمارة","في السطح"],0],
  ["لماذا بقيت سنتين بلا إصلاح؟",["لأن كل ساكن يقول إنه يعرف موضعها","لأن الإصلاح غالي جدا","لأن أحدا لم يرها"],0],
  ["ما الذي غير الحال؟",["انتقال رجل كفيف وقع مرتين","زيارة مهندس","أمر من البلدية"],0],
  ["كم استغرق الإصلاح وبكم؟",["نصف ساعة بعشرين ريالا","يومين بمئتي ريال","أسبوعا بلا مقابل"],0],
  ["ما معنى قول أكبرهم؟",["أنهم اعتادوا ترك العطب لا تجنبه","أن الدرجة لم تكن مكسورة","أن الجيران كسالى"],0]]],

["كان على زاوية الشارع رجل يبيع الورد، وكان يضع مع كل باقة ورقة صغيرة فيها جملة واحدة. لا يسأل الزبون عمن سيعطيها، ولا يكتب اسما.\n\nسئل مرة: كيف تكتب لمن لا تعرفه؟ قال: أنا لا أكتب لهم، إنما أكتب ما أحب أن يقال لي.\n\nوفي يوم جاءته امرأة وقالت: البارحة كنت قد عزمت على ترك دراستي، ثم قرأت ورقتك فعدلت.\n\nلم يسألها عن شيء، ولم يحدث بالقصة أحدا، ولم يغير شيئا في عمله.\n\nوظل يكتب جملة واحدة على كل باقة ثلاثين سنة.",
 [["ماذا كان يضع مع كل باقة؟",["ورقة صغيرة فيها جملة واحدة","بطاقة باسم المشتري","سعر الباقة"],0],
  ["لمن كان يكتب كما قال؟",["يكتب ما يحب أن يقال له","لأصدقائه","للزبائن المعروفين"],0],
  ["ماذا أخبرته المرأة؟",["أنها كانت قد عزمت على ترك دراستها فعدلت","أنها فقدت الورقة","أنها تريد باقة أخرى"],0],
  ["ماذا فعل بعد سماع ذلك؟",["لم يسأل ولم يحدث أحدا ولم يغير عمله","رفع سعر الباقة","كتب القصة على ورقة"],0],
  ["كم بقي على هذا العمل؟",["ثلاثين سنة","ثلاث سنين","سنة واحدة"],0]]],

["بنى زوج من الحمام عشا في شرفة بيتنا، على حافة ضيقة لا تتسع لكرسي. أرادت أمي أن تزيله، فمنعتها جدتي وقالت: اتركيه حتى يطير الفرخ.\n\nصارت الشرفة ممنوعة أربعين يوما. لم ننشر فيها غسيلا، ولم نفتح بابها إلا قليلا.\n\nوكنا ننظر من خلف الزجاج: بيضتان، ثم فرخان بلا ريش، ثم ريش، ثم وقوف متعثر على الحافة.\n\nوفي صباح طارا ولم يعودا.\n\nقالت جدتي ونحن ننظف الشرفة: لم نعطهما شيئا، إنما كففنا عنهما. وأكثر ما يحتاجه الضعيف أن يكف عنه الأذى، لا أن يعان.",
 [["أين بنى الحمام عشه؟",["على حافة ضيقة في الشرفة","في شجرة قريبة","فوق السطح"],0],
  ["ماذا أرادت الأم أن تفعل؟",["أن تزيل العش","أن تطعم الحمام","أن تغلق الشرفة للأبد"],0],
  ["كم يوما بقيت الشرفة ممنوعة؟",["أربعين يوما","أربعة أيام","شهرين"],0],
  ["ماذا كانوا يرون من خلف الزجاج؟",["بيضتين ثم فرخين بلا ريش ثم ريشا ثم وقوفا","العش فارغا","الحمام يطير كل يوم"],0],
  ["ما خلاصة قول الجدة؟",["الكف عن الأذى قد يكون أنفع من العون","العون أهم من الكف","الحمام لا يحتاج أحدا"],0]]],

["في الحي بيت يعرفه الجميع: بيت أم خالد. عندها مفاتيح أربعة عشر بيتا، معلقة على لوح خلف الباب، ومكتوب على كل مفتاح رقم لا اسم.\n\nبدأ الأمر حين نسيت جارة مفتاحها ومعها طفل نائم، فقالت لها أم خالد: اتركي عندي نسخة.\n\nثم صارت عادة في الحي. فمن سافر ترك مفتاحه، ومن تأخر أبناؤه عن المدرسة وجدوا الباب مفتوحا.\n\nسئلت: ألا تخافين من حمل هذه الأمانة؟ قالت: أنا لا أعرف أي مفتاح لأي بيت، ولم أكتب اسما قط. الأرقام عندهم هم.\n\nوفي أربع عشرة سنة لم يفقد مفتاح واحد.",
 [["كم مفتاحا عند أم خالد؟",["أربعة عشر","أربعة","أربعون"],0],
  ["ما المكتوب على كل مفتاح؟",["رقم لا اسم","اسم صاحب البيت","رقم الشقة والاسم"],0],
  ["كيف بدأت هذه العادة؟",["جارة نسيت مفتاحها ومعها طفل نائم","قرار من أهل الحي","طلب من الشرطة"],0],
  ["لماذا لا تخاف من الأمانة؟",["لأنها لا تعرف أي مفتاح لأي بيت","لأن البيوت قريبة","لأن المفاتيح قديمة"],0],
  ["ماذا حدث في أربع عشرة سنة؟",["لم يفقد مفتاح واحد","فقدت مفاتيح كثيرة","تركت العادة"],0]]],

["في قرية جبلية مجرى ماء يفصل بين البيوت والمدرسة. في الصيف يعبره الأطفال على الحجارة، وفي الشتاء يفيض فتغيب البنات أسابيع.\n\nجاءت مهندسة شابة في زيارة عائلية فرأت ذلك، فقاست المجرى ثم رسمت جسرا صغيرا لا يتجاوز طوله ثمانية أمتار.\n\nولم يكن معها تمويل، فرسمته رسما يستطيع أهل القرية بناءه: حجر موجود عندهم، وإسمنت قليل، وحديد يشترى بثمن معقول.\n\nبناه الرجال في ثلاثة أسابيع.\n\nولم يسم الجسر باسمها؛ سماه الناس جسر البنات، وهي تقول إن هذا أدق.",
 [["ما الذي يفصل البيوت عن المدرسة؟",["مجرى ماء","جبل عال","طريق سريع"],0],
  ["ماذا يحدث في الشتاء؟",["يفيض المجرى فتغيب البنات أسابيع","يجف المجرى","يغلق الطريق بالثلج"],0],
  ["كم طول الجسر الذي رسمته؟",["ثمانية أمتار","ثمانين مترا","ثمانية عشر مترا"],0],
  ["لماذا رسمته بهذه الطريقة؟",["ليستطيع أهل القرية بناءه بما عندهم","لأنها لا تجيد غير ذلك","لأن الجسر مؤقت"],0],
  ["لماذا ترى أن اسم الجسر أدق؟",["لأن الجسر للبنات لا لها","لأن البنات بنينه","لأنها لا تحب اسمها"],0]]],

["ورث تاجر عن أبيه دكانا ودفاتر حساب قديمة. وفي دفتر سنة ألف وتسعمئة وثمانين وجد صفحة فيها أسماء ومبالغ، وفي أعلاها سطر بخط أبيه: ديون لا تطلب.\n\nسأل عمه، فقال: كان أبوك يبيع بالدين لمن يعلم أنه لن يقدر على السداد، ويكتب اسمه في هذه الصفحة لا في صفحة الديون، لئلا يحرج الرجل إن دخل الدكان.\n\nفي الصفحة أحد عشر اسما. منهم من مات، ومنهم من صار غنيا.\n\nلم يطلب التاجر من أحد شيئا. ونسخ الصفحة بخطه وعلقها في الدكان بلا أسماء، وكتب فوقها: هكذا كان يبيع أبي.",
 [["ماذا وجد في دفتر سنة ألف وتسعمئة وثمانين؟",["صفحة أسماء ومبالغ عنوانها ديون لا تطلب","عقد الدكان","رسالة من عمه"],0],
  ["لمن كان الأب يبيع بالدين؟",["لمن يعلم أنه لن يقدر على السداد","لأغنياء الحي","لأقاربه فقط"],0],
  ["لماذا كتب أسماءهم في صفحة منفصلة؟",["لئلا يحرج الرجل إن دخل الدكان","لينساهم","ليطالبهم لاحقا"],0],
  ["كم اسما في الصفحة؟",["أحد عشر","واحد","مئة"],0],
  ["ماذا فعل الابن؟",["علق نسخة بلا أسماء وكتب فوقها هكذا كان يبيع أبي","طالب من بقي منهم","أحرق الدفتر"],0]]],

["نشأ الخط العربي من خط قديم يسمى النبطي، ثم تطور حتى صار فنا قائما بذاته.\n\nوأشهر أنواعه الكوفي، وهو أقدمها؛ حروفه مستقيمة الزوايا، فكتبت به المصاحف الأولى ونقشت به جدران المساجد.\n\nثم جاء النسخ، وهو خط الكتب؛ حروفه واضحة متساوية تقرأ بسرعة، ولذلك طبعت به أكثر المصاحف اليوم.\n\nوأما الثلث فخط الزينة؛ حروفه متداخلة متشابكة، يكتب به عنوان الكتاب ولا يكتب به الكتاب.\n\nوالفرق بينها ليس في الجمال وحده، بل في الوظيفة: خط للقراءة، وخط للنقش، وخط للتزيين. ومن خلط بينها أخطأ وإن أجاد.",
 [["من أي خط نشأ الخط العربي؟",["النبطي","الكوفي","الفارسي"],0],
  ["ما أقدم أنواع الخط العربي؟",["الكوفي","النسخ","الثلث"],0],
  ["بم يتميز خط النسخ؟",["حروف واضحة متساوية تقرأ بسرعة","حروف متشابكة","زوايا مستقيمة"],0],
  ["أين يستعمل خط الثلث؟",["في العناوين والزينة","في متون الكتب","في الصحف"],0],
  ["ما الفرق الأهم بين الخطوط؟",["الوظيفة لا الجمال وحده","قدم كل خط","بلد كل خط"],0]]],

["يرى المسافر في الصحراء ما يشبه الماء على الأرض أمامه، فإذا تقدم إليه تراجع. وليس ذلك خداعا للعين وحدها، بل انكسار حقيقي للضوء.\n\nفالهواء الملاصق للرمل الساخن أقل كثافة من الهواء الذي فوقه. والضوء إذا انتقل من طبقة إلى طبقة تخالفها في الكثافة انحنى مساره.\n\nفأشعة السماء القادمة مائلة تنحني قرب الأرض حتى ترتد صاعدة إلى عين الناظر، فيرى صورة السماء منعكسة على الأرض، وهي زرقاء لامعة فيحسبها ماء.\n\nوالسراب إذن صورة صحيحة لشيء موجود، ولكن في غير موضعه؛ وليس شيئا من لا شيء.",
 [["ماذا يرى المسافر في الصحراء؟",["ما يشبه الماء على الأرض أمامه","بحيرة حقيقية","سحابة منخفضة"],0],
  ["كيف الهواء الملاصق للرمل الساخن؟",["أقل كثافة مما فوقه","أكثر كثافة مما فوقه","مثله تماما"],0],
  ["ماذا يحدث للضوء بين طبقتين مختلفتي الكثافة؟",["ينحني مساره","يتوقف","يتحول إلى حرارة"],0],
  ["ما الذي يراه الناظر في الحقيقة؟",["صورة السماء منعكسة","ماء جوفيا قريبا","ظله هو"],0],
  ["ما خلاصة القطعة؟",["السراب صورة صحيحة لشيء في غير موضعه","السراب وهم لا أصل له","السراب مرض في العين"],0]]],

["خرج ابن بطوطة من طنجة سنة خمس وعشرين وسبعمئة للهجرة وهو ابن إحدى وعشرين سنة، ينوي الحج ثم العودة. فعاد بعد تسع وعشرين سنة.\n\nطاف في تلك المدة نحو مئة وعشرين ألف كيلومتر، وزار ما يعادل اليوم أربعين دولة، وعمل قاضيا في الهند وفي جزر المالديف.\n\nولم يكتب رحلته بنفسه؛ فحين رجع أمر سلطان المغرب كاتبا اسمه ابن جزي أن يجلس إليه ويدون ما يمليه.\n\nوأهم ما في الكتاب ليس الطريق، وإنما وصف الناس: ما يأكلون، وكيف يتزوجون، وبم يقضون بينهم. فهو كتاب في الناس أكثر منه في الجغرافيا.",
 [["كم كان عمره حين خرج من طنجة؟",["إحدى وعشرين سنة","تسعا وعشرين","أربعين"],0],
  ["كم غاب عن بلده؟",["تسعا وعشرين سنة","سنة واحدة","عشر سنين"],0],
  ["أين عمل قاضيا؟",["في الهند وجزر المالديف","في مصر والشام","في الأندلس"],0],
  ["من دون الرحلة؟",["ابن جزي بأمر سلطان المغرب","ابن بطوطة بنفسه","تلاميذه بعد موته"],0],
  ["ما أهم ما في الكتاب؟",["وصف الناس وعاداتهم","أطوال الطرق","أسماء السلاطين"],0]]],

["رسم الشريف الإدريسي في صقلية خريطة للعالم، وكتب معها كتابا سماه نزهة المشتاق.\n\nولم يرسمها من الكتب وحدها؛ فقد أرسل الملك رجالا إلى البلاد يسألون التجار والبحارة ويسجلون ما يقولون، ثم قوبلت الروايات بعضها ببعض فأخذ ما اتفقت عليه وترك ما انفرد به واحد.\n\nوخريطته مرسومة والجنوب في أعلاها والشمال في أسفلها، وهو عرف ذلك الزمان؛ فليس في الأرض أعلى وأسفل.\n\nوبقيت خرائطه تنسخ في أوروبا قرونا، وهي من أوائل الخرائط التي بنيت على شهادة من رأى، لا على نقل من قرأ.",
 [["أين رسم الإدريسي خريطته؟",["في صقلية","في بغداد","في قرطبة"],0],
  ["كيف جمعت المعلومات؟",["برجال أرسلوا يسألون التجار والبحارة","من كتب القدماء وحدها","من رحلات الإدريسي نفسه"],0],
  ["كيف عوملت الروايات المختلفة؟",["أخذ ما اتفقت عليه وترك ما انفرد به واحد","أخذت كلها","رفضت كلها"],0],
  ["أين الجنوب في خريطته؟",["في أعلاها","في أسفلها","على يمينها"],0],
  ["بم تميزت خرائطه؟",["بنيت على شهادة من رأى","كانت ملونة","كانت صغيرة الحجم"],0]]],

["كان العرب يكتبون على الرق والجلد والعظم، وكلها غالية قليلة، فكان الكتاب الواحد يكلف ثمنا باهظا.\n\nثم وقعت معركة نهر طلاس، فوقع في الأسر صناع صينيون يعرفون صناعة الورق. فأنشئ في سمرقند أول مصنع للورق خارج الصين، ثم في بغداد، ثم في دمشق والقاهرة وفاس والأندلس.\n\nوأثر ذلك في العلم أثرا لا يقاس. فالكتاب الذي كان يعد ثروة صار في متناول طالب العلم، فكثرت النسخ، وقامت المكتبات، وصار العالم يكتب ليقرأ الناس لا ليحفظ عنه تلميذ واحد.\n\nومنها انتقلت الصناعة إلى أوروبا بعد قرون، عن طريق الأندلس وصقلية.",
 [["على ماذا كان العرب يكتبون قبل الورق؟",["الرق والجلد والعظم","الحجر والطين","القماش"],0],
  ["كيف عرفوا صناعة الورق؟",["من أسرى صينيين بعد معركة نهر طلاس","من رحلة تاجر","باختراع عربي"],0],
  ["أين أنشئ أول مصنع للورق خارج الصين؟",["في سمرقند","في بغداد","في دمشق"],0],
  ["ما أثر رخص الورق في الكتاب؟",["صار في متناول طالب العلم فكثرت النسخ","ارتفع ثمنه","قل عدد المكتبات"],0],
  ["كيف انتقلت الصناعة إلى أوروبا؟",["عن طريق الأندلس وصقلية","عن طريق الصين مباشرة","لم تنتقل"],0]]],

["المثل جملة قصيرة قيلت في موقف، ثم جرت على الألسنة في كل موقف يشبهه.\n\nولذلك لا يغير المثل؛ يقال كما قيل أول مرة وإن خالف ما ألفه الناس في الإعراب، لأنه محكي لا منشأ.\n\nوأكثر الأمثال نشأ من قصة، ثم نسيت القصة وبقي المثل. فقولهم رجع بخفي حنين وراءه حكاية إسكافي ورجل ساوم ولم يشتر.\n\nوفائدة المثل أنه يختصر حجة طويلة في كلمتين، وهذا سلاح ذو حدين: فهو يقرب المعنى، وقد يسكت المخالف بلا دليل.\n\nفالحكمة في المثل ألا يستعمل بديلا عن التفكير.",
 [["ما المثل كما عرفته القطعة؟",["جملة قيلت في موقف ثم جرت في كل ما يشبهه","حكمة ألفها عالم","بيت من الشعر"],0],
  ["لماذا لا يغير المثل؟",["لأنه محكي لا منشأ","لأن تغييره محرم","لأنه قصير"],0],
  ["ما الذي يبقى بعد نسيان القصة؟",["المثل","اسم صاحب القصة","القصة نفسها"],0],
  ["ما فائدة المثل؟",["يختصر حجة طويلة في كلمتين","يزين الكلام فقط","يثبت صحة الرأي"],0],
  ["ما خطر الإكثار منه؟",["قد يسكت المخالف بلا دليل","قد ينسي اللغة","قد يطيل الكلام"],0]]],

["عرفت القهوة أول ما عرفت في اليمن، وكان الصوفية يشربونها ليسهروا في الذكر.\n\nومن اليمن خرجت إلى مكة والقاهرة والآستانة، ثم إلى أوروبا بعد ذلك بزمن.\n\nوكان اليمن يحتكر زراعتها، ويمنع خروج البن غير محمص لئلا يزرع في أرض أخرى. ومن ميناء المخا أخذ الاسم الذي ما زال يطلق على نوع من القهوة في لغات كثيرة.\n\nثم هربت شتلات إلى الهند، ثم إلى إندونيسيا، ثم إلى أمريكا الجنوبية التي صارت أكبر منتج في العالم.\n\nفانتقلت الزراعة إلى غير أرضها، وبقي الاسم شاهدا على أصلها.",
 [["أين عرفت القهوة أول مرة؟",["في اليمن","في الحبشة","في تركيا"],0],
  ["لماذا كان الصوفية يشربونها؟",["ليسهروا في الذكر","للتداوي","في الأعياد"],0],
  ["كيف حفظ اليمن احتكار زراعتها؟",["بمنع خروج البن غير محمص","بإغلاق الموانئ","بتحريم بيعها"],0],
  ["من أين جاء اسم المخا؟",["من ميناء المخا في اليمن","من اسم تاجر","من كلمة تركية"],0],
  ["ما الذي انتقل وما الذي بقي؟",["انتقلت الزراعة وبقي الاسم","انتقل الاسم وبقيت الزراعة","انتقل الاثنان"],0]]],

["الصوت يخرج من حنجرة فيها وتران صوتيان يهتزان حين يمر الهواء بينهما. وكلما كان الوتر أطول وأثخن كان الصوت أخفض، كما في أوتار العود.\n\nوفي سن المراهقة تنمو الحنجرة عند الولد نموا سريعا، فيطول الوتر نحو الضعف، فيهبط الصوت هبوطا بينا. وتنمو عند البنت كذلك ولكن أقل، فيتغير صوتها تغيرا أهدأ.\n\nوفي أثناء هذا النمو يتعثر الصوت أحيانا وينقطع، لأن العضلات لم تتعود بعد على الطول الجديد.\n\nوليس ذلك عيبا ولا مرضا؛ إنما هي آلة تكبر، وصاحبها يتعلم العزف عليها من جديد.",
 [["ما الذي يهتز لإخراج الصوت؟",["الوتران الصوتيان في الحنجرة","اللسان","الرئتان"],0],
  ["متى يكون الصوت أخفض؟",["كلما طال الوتر وثخن","كلما قصر الوتر","كلما زاد الهواء"],0],
  ["ماذا يحدث للولد في المراهقة؟",["تنمو حنجرته فيطول الوتر نحو الضعف","يتوقف نمو حنجرته","يفقد صوته مدة"],0],
  ["لماذا يتعثر الصوت وينقطع؟",["لأن العضلات لم تتعود الطول الجديد","لأن الحنجرة مريضة","بسبب كثرة الكلام"],0],
  ["بم شبهت القطعة ذلك؟",["بآلة تكبر وصاحبها يتعلم العزف عليها من جديد","بجرح يلتئم","بثوب يضيق"],0]]],

["لا تتشابه بصمتا إصبعين قط، ولا حتى عند التوأمين المتطابقين اللذين تتفق جيناتهما.\n\nوسبب ذلك أن البصمة لا تحددها الجينات وحدها، وإنما تتكون في الشهور الأولى في بطن الأم بتأثير أمور دقيقة: موضع الجنين، وضغط السائل حوله، وسرعة نمو الجلد. وهذه الأمور لا تتكرر مرتين.\n\nوالبصمة تثبت بعد ذلك مدى العمر؛ فإن جرح الجلد جرحا سطحيا عاد الخط كما كان، لأن قالبه في الطبقة العميقة لا في السطح.\n\nولذلك استعملت في إثبات الهوية قبل أن يعرف الناس سبب تفردها بزمن طويل.",
 [["هل تتشابه بصمتا التوأمين المتطابقين؟",["لا تتشابهان","تتشابهان تماما","تتشابهان في يد دون يد"],0],
  ["ما الذي يكون البصمة؟",["أمور دقيقة في الشهور الأولى في بطن الأم","الجينات وحدها","العمل باليدين"],0],
  ["لماذا لا تتكرر بصمة؟",["لأن تلك الظروف الدقيقة لا تتكرر","لأن عدد الناس قليل","لأن الجلد يتغير دائما"],0],
  ["لماذا يعود الخط بعد الجرح السطحي؟",["لأن قالب البصمة في الطبقة العميقة","لأن الجلد ينمو عشوائيا","لأن الجرح لا يصل الجلد"],0],
  ["متى استعملت البصمة في إثبات الهوية؟",["قبل معرفة سبب تفردها بزمن طويل","بعد معرفة السبب مباشرة","في هذا القرن فقط"],0]]],

["قبل الثلاجة بآلاف السنين كان الملح أهم وسيلة لحفظ الطعام، وكان لذلك ثمنه: تقوم عليه طرق تجارة، وتفرض عليه ضرائب، وتنشب بسببه خصومات.\n\nوسر عمله أن البكتيريا التي تفسد الطعام تحتاج إلى ماء لتعيش. فإذا وضع الملح على اللحم أو السمك سحب الماء من الخلايا، فجف الطعام من داخله، فلم تجد البكتيريا ما تعيش فيه.\n\nوهذا نفسه سر حفظ السكر للفاكهة في المربى.\n\nفالحفظ لم يكن قتلا للجراثيم، وإنما تجفيفا لبيتها.",
 [["ماذا كان أهم وسيلة لحفظ الطعام قبل الثلاجة؟",["الملح","الثلج","الدخان"],0],
  ["ما الذي تحتاجه البكتيريا لتعيش؟",["الماء","الملح","الهواء البارد"],0],
  ["ماذا يفعل الملح باللحم؟",["يسحب الماء من خلاياه","يقتل البكتيريا مباشرة","يغير طعمه فقط"],0],
  ["ما الشبيه بذلك في المربى؟",["السكر يحفظ الفاكهة بالطريقة نفسها","الخل يحفظ الخضار","الزيت يحفظ الجبن"],0],
  ["ما خلاصة القطعة؟",["الحفظ تجفيف لبيت الجراثيم لا قتل لها","الملح يقتل كل الجراثيم","الطعام المالح لا يفسد أبدا"],0]]]

  ] }
 } ,
 /* ═══════════════════════════════════════════════════════════════════
    سعود — رابع ابتدائيّ
    ═══════════════════════════════════════════════════════════════════
    قياسُ بنكِه (٢٤ أكتوبر ٢٠٢٦): إنجليزيٌّ ٢٤ قطعةً بين ١٤ و٢٦ كلمةً
    (الوسطُ ١٩) وعربيٌّ ٢٤ بين ١١ و١٨ (الوسطُ ١٤)، وثلاثةُ أسئلةٍ لكلٍّ —
    وهي أقصرُ قطعٍ في الموقع. وفهمُه عند السقف: ٨٩٪ في ثلاثٍ وثلاثين
    جلسةً إنجليزيّةً و٩٧٪ في عشرين عربيّة، فلم تعد تقيس شيئًا. وثلاثُ
    قطعٍ جاءته مرّتين، وبنكُه أربعٌ وعشرون وجلساتُه ثلاثٌ وثلاثون.

    وأرسل الأب (٢٥ أكتوبر) عمودَ READING من صفحةِ Scope and Sequence،
    وفيه أنواعُ نصوصِ كتابِه الثمانيةُ ومهارةُ كلٍّ منها:
      و١ — قصّةٌ عن صورةِ عائلة (التنبّؤ من الصور) · وصفُ صورةٍ مفضّلة
      و٢ — قصّةٌ عن مساعدةِ الجدَّين (تحديدُ أفعالِ الشخصيّات) ·
            نصٌّ عن روتينِ الأسر (القراءةُ للتفصيل)
      و٣ — قصّةُ مغامرةٍ في الملعب (تحديدُ أحداثِ الشخصيّات) ·
            مسرحيّةٌ مدرسيّة (إكمالُ معلوماتٍ عن نصّ)
      و٤ — قصّةُ رحلةٍ إلى المول (تحديدُ الأحداثِ وترتيبُها) ·
            مدوّنةٌ عن الهوايات (تحديدُ التفاصيل)
    وثلاثةُ موضوعاتٍ من عمودِ التعلّمِ المتكامل: الدرعيّة · النظافة ·
    ألعابُ الماضي.

    فهذه ثماني عشرةَ قطعةً إنجليزيّةً وثماني عشرةَ عربيّة، كلٌّ ٥٠–٨٠
    كلمةً وأربعةُ أسئلةٍ لا ثلاثة — على أنواعِ كتابِه ومهاراتِه، لا على
    موضوعاتٍ عامّة. ولم تُنسَخ من الكتابِ شيئًا: الكتابُ أعطى النوعَ
    والمهارةَ والمستوى، والنصوصُ جديدة.

    وطولُها خمسون كلمةً لا مئةٌ وخمسون كما لحسن: هو رابعٌ ابتدائيّ،
    والعتبةُ (READING_MINWORDS) خمسٌ وأربعون — تكفي لرفعِ قطعِه القصيرةِ
    كلِّها وتبقي الثمانيَ عشرةَ الجديدةَ وحدَها.

    والعربيُّ بلا شكلٍ كاملٍ كنصفِ بنكِه القائم — وقراءةُ غيرِ المشكولِ
    مهارةٌ يحتاجها في هذا الصفّ. */
 saud: {
  en: { pass: [

["Last Friday my aunt brought an old photo to our house. In the photo, a young man stood beside a small blue car. He was holding a baby. My mother laughed and said, \"That baby is me!\" The young man was my grandfather, and the car was his first car. We put the photo on the wall in the hall.",
 [["Who brought the old photo?",["the writer's aunt","the writer's teacher","the writer's brother"],0],
  ["What was the young man holding?",["a baby","a camera","a ball"],0],
  ["Who was the baby in the photo?",["the writer's mother","the writer","the aunt"],0],
  ["Where did they put the photo?",["on the wall in the hall","in a box under the bed","inside the car"],0]]],

["Reem opened her grandmother's box and found a photo of ten children in front of a school. All the children wore white shirts. \"Which one is you?\" Reem asked. Her grandmother pointed at a tall girl standing at the back. \"I was the tallest in my class,\" she said, \"and I was always late.\" Reem could not stop laughing.",
 [["Where did Reem find the photo?",["in her grandmother's box","under her bed","at her school"],0],
  ["How many children were in the photo?",["ten","two","twenty"],0],
  ["Where was her grandmother standing?",["at the back","in front of the door","beside the teacher"],0],
  ["What did the grandmother say about herself?",["she was the tallest and always late","she was the shortest in the class","she was never late"],0]]],

["My favorite photo is small and a little dirty, but I love it. It shows my brother and me on the first day of Eid. We are wearing new clothes and we are standing in front of my grandfather's door. My brother is laughing because his new shoes were too big for him. I keep the photo inside my school book.",
 [["How does the writer describe the photo?",["small and a little dirty","big and new","dark and torn"],0],
  ["When was the photo taken?",["on the first day of Eid","on the last day of school","in the winter"],0],
  ["Why is the brother laughing?",["his new shoes were too big","he found some money","he won a game"],0],
  ["Where does the writer keep the photo?",["inside a school book","on the wall","in his pocket"],0]]],

["This is my favorite photo of my family. We are sitting on a carpet in the desert. My father is making tea, my mother is reading, and my little sister is sleeping beside the fire. Behind us there is a high sand hill. It was very cold that night, but nobody wanted to go home early.",
 [["Where is the family sitting?",["on a carpet in the desert","in the kitchen","on a boat"],0],
  ["What is the father doing?",["making tea","reading a book","sleeping"],0],
  ["What is behind the family?",["a high sand hill","a tall building","the sea"],0],
  ["How was the weather that night?",["very cold","very hot","rainy"],0]]],

["Every Thursday Turki goes to his grandparents' house. First he makes the bed in the small room. Then he sweeps the floor and takes out the trash. His grandfather says, \"Can you water the garden for me?\" Turki fills the bucket slowly, because it is heavy. After the work they drink tea together, and his grandmother tells him an old story.",
 [["When does Turki visit his grandparents?",["every Thursday","every day","once a month"],0],
  ["What does he do first?",["he makes the bed","he waters the garden","he drinks tea"],0],
  ["Why does he fill the bucket slowly?",["because it is heavy","because it is broken","because he is afraid"],0],
  ["What happens after the work?",["they drink tea and his grandmother tells a story","he goes home at once","he washes the dishes"],0]]],

["Lama's grandmother broke her arm, so she could not wash the dishes or clear the table. Lama came after school every day for two weeks. She washed the dishes carefully and set the table before dinner. On the last day her grandmother said, \"You did not help me because I asked you. You helped me before I asked.\"",
 [["What happened to the grandmother?",["she broke her arm","she lost her keys","she moved to a new house"],0],
  ["How long did Lama come?",["two weeks","two days","two months"],0],
  ["What did Lama do after school?",["she washed the dishes and set the table","she cut the grass","she cooked the dinner"],0],
  ["What did the grandmother mean?",["Lama helped without being asked","Lama worked too slowly","Lama wanted money"],0]]],

["In many families everybody has a job at home. In Badr's family, his father feeds the animals before sunrise. His mother cuts the grass on Saturday. Badr and his sister wash the dishes after dinner, one day each. Nobody does everything, and nobody does nothing. Badr says the work finishes quickly when all of them work together.",
 [["When does Badr's father feed the animals?",["before sunrise","after dinner","on Saturday"],0],
  ["Who cuts the grass?",["his mother","his father","his sister"],0],
  ["How do Badr and his sister wash the dishes?",["one day each","together every day","never"],0],
  ["What does Badr say about the work?",["it finishes quickly when they all work together","it is too hard for them","it is only his mother's job"],0]]],

["Here are two families. The first family wakes up at five o'clock, because the children walk to a school far away. The second family wakes up at half past six, because their school is near. Both families eat breakfast together, and the children in both families get dressed before they eat. The clocks are different, but the habits are the same.",
 [["Why does the first family wake up at five?",["their school is far away","they like the morning","they have animals"],0],
  ["When does the second family wake up?",["half past six","five o'clock","seven o'clock"],0],
  ["What do both families do?",["they eat breakfast together","they walk to school","they wake up at five"],0],
  ["What does the text say at the end?",["the clocks are different but the habits are the same","both families are always late","both schools are near"],0]]],

["Yesterday Ziad and Hind found a small door under the stairs of the playground. Ziad pushed it and it opened. Inside there was a box of old footballs, a broken clock, and a cat with three kittens. Hind did not shout, because the kittens were sleeping. The children closed the door quietly and told the school guard about it.",
 [["What did the children find under the stairs?",["a small door","a lost ball","a bag of money"],0],
  ["What was inside?",["old footballs, a broken clock and a cat with kittens","books and pencils","nothing at all"],0],
  ["Why did Hind not shout?",["the kittens were sleeping","she was afraid of the dark","she could not speak"],0],
  ["What did the children do at the end?",["they told the school guard","they took the footballs home","they ran away"],0]]],

["The children were playing in the playground when the ball went over the wall. Salem climbed on a box to look. On the other side there was an old man watering his plants. He picked up the ball, smiled, and threw it back to them. After that the children visited him every week, and he taught them the names of all his plants.",
 [["Where did the ball go?",["over the wall","into the street","under a car"],0],
  ["What was the old man doing?",["watering his plants","sleeping in the sun","fixing a car"],0],
  ["What did he do with the ball?",["he threw it back","he kept it","he hid it"],0],
  ["What happened after that day?",["the children visited him every week","they never went back","they lost the ball again"],0]]],

["Our class wrote a play about a lost camel. Maha was the camel, Faisal was the farmer, and I was the narrator. On the first night I forgot my words. Faisal said his line again, slowly, and then I remembered. Nobody in the hall knew. After the play our teacher said that a good team hides the small mistakes of its friends.",
 [["What was the play about?",["a lost camel","a lost key","a school trip"],0],
  ["What was the writer's part in the play?",["the narrator","the camel","the farmer"],0],
  ["What did Faisal do when the writer forgot?",["he said his line again slowly","he laughed loudly","he stopped the play"],0],
  ["What did the teacher say?",["a good team hides the small mistakes of its friends","the play was too long","the writer must practise alone"],0]]],

["Last Thursday we went to the mall, because my mother had to buy a gift. First we ate lunch. Then we walked to the toy shop, but it was closed. After that we took the lift to the top floor and looked down at the lights. When we got home, my little brother was asleep, and he was still holding the empty gift bag.",
 [["Why did the family go to the mall?",["his mother had to buy a gift","to watch a film","to meet a friend"],0],
  ["What did they do first?",["they ate lunch","they went to the toy shop","they took the lift"],0],
  ["Why did they not go into the toy shop?",["it was closed","it was too full","it was very far"],0],
  ["What was the little brother doing at home?",["sleeping and holding the empty bag","crying for a toy","eating his dinner"],0]]],

["I will never forget our trip to the old market. The streets were narrow and the shops were small. A man was selling dates from a big basket, and he gave me one to taste. It was sweet and soft. My father bought a kilo of them. On the way home the whole car smelled of dates, and I ate three more.",
 [["Where did they go?",["to the old market","to the zoo","to the sea"],0],
  ["What was the man selling?",["dates","bread","shoes"],0],
  ["How did the date taste?",["sweet and soft","salty and hard","very dry"],0],
  ["What happened on the way home?",["the car smelled of dates","they lost the basket","it started to rain"],0]]],

["Hello! My name is Jana and my hobby is making models. Last month I made a small bridge from wood and glue. It took me nine days. I worked slowly and carefully, and I broke two pieces, but I did not stop. Now the bridge is on my desk. Next month I want to make a model of our house.",
 [["What is Jana's hobby?",["making models","painting pictures","cooking"],0],
  ["What did she make last month?",["a small bridge from wood and glue","a paper boat","a kite"],0],
  ["How long did it take her?",["nine days","nine hours","nine weeks"],0],
  ["What does she want to make next?",["a model of her house","another bridge","a wooden chair"],0]]],

["My name is Rakan. People think my hobby is strange: I collect old keys. I have forty-one of them in a wooden box. I do not know which doors they opened, and for me that is the best part. My favorite key is long and black. My uncle found it in the sand near our farm, and he gave it to me.",
 [["What does Rakan collect?",["old keys","old coins","old books"],0],
  ["How many does he have?",["forty-one","fourteen","four"],0],
  ["What does he like best about the keys?",["he does not know which doors they opened","they are new and clean","they are made of gold"],0],
  ["Where was his favorite key found?",["in the sand near the farm","at his school","in the old market"],0]]],

["Diriyah is an old town near Riyadh. Its houses were built from mud, and the walls are thick, so the rooms stay cool in summer. Hundreds of years ago it was an important centre for trade and for learning. Today people walk in its narrow streets and visit its museums. At night the old walls are lit, and the whole town looks golden.",
 [["Where is Diriyah?",["near Riyadh","near the sea","in the mountains"],0],
  ["What were the houses built from?",["mud","glass","iron"],0],
  ["Why do the rooms stay cool in summer?",["the walls are thick","the windows are very big","there are trees inside"],0],
  ["How does the town look at night?",["golden, because the old walls are lit","dark and empty","white with snow"],0]]],

["Washing your hands is a small action with a big result. Most germs travel on hands, not through the air. Doctors say you should wash with soap for twenty seconds, which is the time it takes to count slowly to twenty. Water alone is not enough, because soap lifts the oil that the germs hide in. Dry your hands well afterwards.",
 [["How do most germs travel?",["on hands","through the air","in cold water"],0],
  ["How long should you wash your hands?",["twenty seconds","two seconds","twenty minutes"],0],
  ["Why is water alone not enough?",["soap lifts the oil that the germs hide in","water is always cold","water is not clean"],0],
  ["What should you do after washing?",["dry your hands well","wash them again","run outside quickly"],0]]],

["Before video games, children played in the street with very few things. One old game needed only a stick and a small stone. Another needed nothing but your hands and a good memory. Grandparents say those games taught them to run fast and to agree on the rules without an adult. Some of the games are still played today, with new names.",
 [["What did one old game need?",["a stick and a small stone","a ball and a net","a screen and a chair"],0],
  ["What did another game need?",["only hands and a good memory","a big table","a bicycle"],0],
  ["What do grandparents say the games taught them?",["to run fast and to agree on rules without an adult","to be quiet all day","to count money"],0],
  ["Are those games played today?",["yes, some of them with new names","no, none of them","only inside schools"],0]]]

  ] },
  ar: { pass: [

["فتحت أمي علبة قديمة، فوجدنا فيها صورة لا نعرفها. في الصورة رجل شاب يقف أمام باب خشبي، ويحمل طفلا صغيرا. ضحكت أمي وقالت: هذا الطفل أنا! والرجل هو جدي. نظرت إلى الصورة طويلا، ثم علقناها في الصالة. صارت كل مرة أمر بها أبتسم، لأني أعرف الآن كيف كان بيت جدي قبل أن أولد.",
 [["ماذا وجدوا في العلبة القديمة؟",["صورة لا يعرفونها","كتابا قديما","نقودا"],0],
  ["من الطفل الصغير في الصورة؟",["الأم","الكاتب","الجد"],0],
  ["أين علقوا الصورة؟",["في الصالة","في المطبخ","في الغرفة"],0],
  ["لماذا يبتسم الكاتب كلما مر بالصورة؟",["لأنه عرف كيف كان بيت جده قبل أن يولد","لأن الصورة ملونة","لأن الصورة كبيرة"],0]]],

["صورتي المفضلة صغيرة وقديمة، لكني أحبها أكثر من كل الصور. فيها أنا وأخي في أول يوم عيد، نلبس ثيابا جديدة، ونقف أمام باب جدي. أخي يضحك في الصورة لأن حذاءه كان واسعا عليه، فكان يمشي ببطء شديد. أضع الصورة بين صفحات كتابي، فأراها كل يوم قبل أن أبدأ الدرس.",
 [["كيف يصف الكاتب صورته المفضلة؟",["صغيرة وقديمة","كبيرة وجديدة","ملونة وواضحة"],0],
  ["متى أخذت الصورة؟",["في أول يوم عيد","في آخر يوم دراسة","في الصيف"],0],
  ["لماذا كان الأخ يضحك؟",["لأن حذاءه كان واسعا عليه","لأنه ربح لعبة","لأنه رأى صديقه"],0],
  ["أين يضع الكاتب الصورة؟",["بين صفحات كتابه","على الجدار","في علبة"],0]]],

["يذهب تركي إلى بيت جديه كل خميس. يبدأ بترتيب السرير في الغرفة الصغيرة، ثم يكنس الأرض ويخرج القمامة. يقول له جده: هل تسقي لي الحديقة؟ فيحمل الدلو ببطء لأنه ثقيل. وبعد أن ينتهي العمل يشربون الشاي معا، وتحكي له جدته قصة قديمة لم يسمعها من قبل.",
 [["متى يزور تركي جديه؟",["كل خميس","كل يوم","مرة في الشهر"],0],
  ["بماذا يبدأ عمله؟",["بترتيب السرير","بسقي الحديقة","بشرب الشاي"],0],
  ["لماذا يحمل الدلو ببطء؟",["لأنه ثقيل","لأنه مكسور","لأنه خائف"],0],
  ["ماذا يحدث بعد انتهاء العمل؟",["يشربون الشاي وتحكي له جدته قصة","يرجع إلى بيته مباشرة","ينام في الحديقة"],0]]],

["انكسرت يد جدة لمى، فلم تعد تستطيع غسل الصحون ولا إعداد الطاولة. صارت لمى تأتي بعد المدرسة كل يوم مدة أسبوعين. تغسل الصحون بعناية، وتعد الطاولة قبل العشاء، ثم تجلس قليلا عند جدتها. وفي آخر يوم قالت لها جدتها: أنت لم تساعديني لأني طلبت، بل ساعدتني قبل أن أطلب.",
 [["ماذا حدث للجدة؟",["انكسرت يدها","ضاعت مفاتيحها","سافرت"],0],
  ["كم مدة جاءت لمى؟",["أسبوعان","يومان","شهران"],0],
  ["ماذا كانت تعمل لمى؟",["تغسل الصحون وتعد الطاولة","تجز العشب","تطبخ العشاء"],0],
  ["ما معنى كلام الجدة في آخر يوم؟",["أن لمى ساعدت قبل أن يطلب منها","أن لمى كانت بطيئة","أن لمى تريد هدية"],0]]],

["في بيت بدر لكل واحد عمل. أبوه يطعم الحيوانات قبل شروق الشمس، وأمه تجز العشب يوم السبت، وهو وأخته يغسلان الصحون بعد العشاء، يوما له ويوما لها. لا أحد يعمل كل شيء، ولا أحد يجلس بلا عمل. يقول بدر: العمل ينتهي بسرعة حين نعمل كلنا معا، ويطول حين ينتظر كل واحد غيره.",
 [["متى يطعم أبو بدر الحيوانات؟",["قبل شروق الشمس","بعد العشاء","يوم السبت"],0],
  ["من يجز العشب؟",["الأم","الأب","الأخت"],0],
  ["كيف يغسل بدر وأخته الصحون؟",["يوما له ويوما لها","معا كل يوم","لا يغسلان"],0],
  ["ماذا يقول بدر عن العمل؟",["ينتهي بسرعة حين يعملون كلهم معا","أنه صعب جدا","أنه عمل أمه وحدها"],0]]],

["يوم الجمعة في بيتنا له ترتيب لا يتغير. نستيقظ متأخرين قليلا، ثم نفطر كلنا على طاولة واحدة. بعد الفطور يرتب كل واحد غرفته، ويخرج أبي ليغسل السيارة. نذهب إلى المسجد، وبعد الصلاة نزور جدي. وفي المساء نجلس في الحوش، ويحكي لنا أبي عن أيام كان فيها مثل عمري.",
 [["ماذا يفعلون بعد الفطور؟",["يرتب كل واحد غرفته ويغسل الأب السيارة","يخرجون للسوق","ينامون"],0],
  ["من يزورون بعد الصلاة؟",["الجد","الجيران","المعلم"],0],
  ["أين يجلسون في المساء؟",["في الحوش","في المطبخ","في السيارة"],0],
  ["عن ماذا يحكي الأب في المساء؟",["عن أيام كان فيها في عمر ابنه","عن عمله","عن الطقس"],0]]],

["وجد زياد وهند بابا صغيرا تحت درج الملعب. دفعه زياد فانفتح. في الداخل صندوق فيه كرات قديمة، وساعة مكسورة، وقطة معها ثلاثة صغار. أرادت هند أن تصرخ من الفرح، لكنها سكتت لأن الصغار كانوا نائمين. أغلقا الباب بهدوء، وذهبا إلى حارس المدرسة وأخبراه، فوضع للقطة ماء وطعاما.",
 [["ماذا وجد الطفلان تحت الدرج؟",["بابا صغيرا","كرة ضائعة","مفتاحا"],0],
  ["ماذا كان في الداخل؟",["كرات قديمة وساعة مكسورة وقطة وصغارها","كتب ودفاتر","لا شيء"],0],
  ["لماذا سكتت هند ولم تصرخ؟",["لأن صغار القطة كانوا نائمين","لأنها خافت","لأنها تعبت"],0],
  ["ماذا فعل الطفلان في النهاية؟",["أخبرا حارس المدرسة","أخذا الكرات","أغلقا الباب ونسيا الأمر"],0]]],

["كان الأطفال يلعبون في الملعب، فطارت الكرة فوق الجدار. صعد سالم على صندوق لينظر، فرأى رجلا كبيرا يسقي نباتاته في الجهة الأخرى. رفع الرجل الكرة وابتسم ورماها إليهم. ومن ذلك اليوم صار الأطفال يزورونه كل أسبوع، فيعلمهم أسماء نباتاته، ويعطيهم في آخر الزيارة ورقة نعناع لكل واحد.",
 [["أين ذهبت الكرة؟",["فوق الجدار","في الشارع","تحت السيارة"],0],
  ["ماذا كان الرجل يفعل؟",["يسقي نباتاته","ينام","يصلح سيارته"],0],
  ["ماذا فعل الرجل بالكرة؟",["رماها إليهم","أخذها","خبأها"],0],
  ["ماذا صار بعد ذلك اليوم؟",["صار الأطفال يزورونه كل أسبوع","لم يرجعوا إلى الملعب","ضاعت الكرة مرة أخرى"],0]]],

["كتب صفنا مسرحية عن ناقة ضاعت في الصحراء. كانت مها الناقة، وفيصل المزارع، وكنت أنا الراوي. في الليلة الأولى نسيت كلامي ووقفت ساكتا. أعاد فيصل جملته ببطء، فتذكرت وأكملت، ولم يشعر أحد في القاعة. قال لنا المعلم بعد المسرحية: الفريق الجيد هو الذي يستر خطأ صاحبه ولا يضحك عليه.",
 [["عن ماذا كانت المسرحية؟",["عن ناقة ضاعت في الصحراء","عن مفتاح ضائع","عن رحلة مدرسية"],0],
  ["ما دور الكاتب في المسرحية؟",["الراوي","الناقة","المزارع"],0],
  ["ماذا فعل فيصل حين نسي صاحبه كلامه؟",["أعاد جملته ببطء","ضحك عليه","أوقف المسرحية"],0],
  ["ماذا قال المعلم؟",["الفريق الجيد يستر خطأ صاحبه","المسرحية كانت طويلة","يجب أن يتدرب كل واحد وحده"],0]]],

["ذهبنا الخميس الماضي إلى المول، لأن أمي أرادت أن تشتري هدية. أكلنا الغداء أولا، ثم مشينا إلى محل الألعاب فوجدناه مغلقا. بعد ذلك ركبنا المصعد إلى الدور الأخير، ونظرنا من الزجاج إلى أضواء المدينة. وحين رجعنا إلى البيت كان أخي الصغير نائما، وما زال يمسك كيس الهدية الفارغ بيده.",
 [["لماذا ذهبوا إلى المول؟",["لأن الأم أرادت أن تشتري هدية","لمشاهدة فيلم","لمقابلة صديق"],0],
  ["ماذا فعلوا أولا؟",["أكلوا الغداء","ذهبوا لمحل الألعاب","ركبوا المصعد"],0],
  ["لماذا لم يدخلوا محل الألعاب؟",["كان مغلقا","كان بعيدا","كان مزدحما"],0],
  ["ماذا كان يفعل الأخ الصغير في البيت؟",["نائما ويمسك كيس الهدية الفارغ","يبكي","يأكل"],0]]],

["لن أنسى رحلتنا إلى السوق القديم. كانت الطرق ضيقة والمحلات صغيرة، ورائحة الهيل تملأ المكان. وقف رجل يبيع التمر من سلة كبيرة، فأعطاني واحدة لأتذوقها، فإذا هي حلوة لينة. اشترى أبي كيلو، وفي طريق العودة صارت السيارة كلها تشبه رائحة السوق، وأكلت ثلاث تمرات أخرى قبل أن نصل.",
 [["إلى أين ذهبوا؟",["إلى السوق القديم","إلى الحديقة","إلى البحر"],0],
  ["ماذا كان الرجل يبيع؟",["التمر","الخبز","الأحذية"],0],
  ["كيف كان طعم التمرة؟",["حلوة لينة","مالحة","يابسة"],0],
  ["ماذا حدث في طريق العودة؟",["صارت رائحة السيارة كرائحة السوق","ضاعت السلة","نزل المطر"],0]]],

["اسمي جنى، وهوايتي صنع المجسمات. في الشهر الماضي صنعت جسرا صغيرا من الخشب والغراء، واستغرق مني تسعة أيام. كنت أعمل ببطء وبعناية، وانكسرت عندي قطعتان، لكني لم أتوقف. الجسر الآن على مكتبي، يراه كل من يدخل غرفتي. وفي الشهر القادم أريد أن أصنع مجسما لبيتنا بالحوش والنخلة التي أمامه.",
 [["ما هواية جنى؟",["صنع المجسمات","الرسم","الطبخ"],0],
  ["ماذا صنعت في الشهر الماضي؟",["جسرا صغيرا من الخشب والغراء","قاربا من الورق","طائرة"],0],
  ["كم استغرق منها؟",["تسعة أيام","تسع ساعات","تسعة أسابيع"],0],
  ["ماذا تريد أن تصنع في الشهر القادم؟",["مجسما لبيتهم","جسرا آخر","كرسيا"],0]]],

["اسمي راكان، ويقول الناس إن هوايتي غريبة: أنا أجمع المفاتيح القديمة. عندي منها إحدى وأربعون في صندوق خشبي. لا أعرف أي باب كان يفتحه كل مفتاح، وهذا عندي أجمل ما فيها. وأحبها إلي مفتاح طويل أسود، وجده عمي في الرمل قرب مزرعتنا وأعطاني إياه، وقال: احفظه، فله بيت في مكان ما.",
 [["ماذا يجمع راكان؟",["المفاتيح القديمة","النقود القديمة","الكتب"],0],
  ["كم مفتاحا عنده؟",["إحدى وأربعون","أربعة عشر","أربعة"],0],
  ["ما أجمل ما في المفاتيح عنده؟",["أنه لا يعرف أي باب كان يفتحه كل مفتاح","أنها جديدة","أنها ثقيلة"],0],
  ["أين وجد عمه المفتاح الأسود؟",["في الرمل قرب المزرعة","في السوق","في المدرسة"],0]]],

["الدرعية بلدة قديمة قرب الرياض، بيوتها مبنية من الطين، وجدرانها سميكة، ولذلك تبقى غرفها باردة في الصيف. كانت قبل مئات السنين مركزا مهما للتجارة وطلب العلم، يقصدها الناس من أماكن بعيدة. واليوم يمشي الزوار في طرقها الضيقة ويدخلون متاحفها، وفي الليل تضاء جدرانها القديمة فتبدو البلدة كلها ذهبية اللون.",
 [["أين تقع الدرعية؟",["قرب الرياض","على البحر","في الجبال"],0],
  ["مم بنيت بيوتها؟",["من الطين","من الزجاج","من الحديد"],0],
  ["لماذا تبقى غرفها باردة في الصيف؟",["لأن جدرانها سميكة","لأن نوافذها كبيرة","لأن فيها أشجارا"],0],
  ["كيف تبدو البلدة في الليل؟",["ذهبية اللون لأن جدرانها تضاء","مظلمة وخالية","بيضاء"],0]]],

["قبل الألعاب الإلكترونية كان الأطفال يلعبون في الحارة بأشياء قليلة جدا. لعبة قديمة لا تحتاج إلا عصا وحجرا صغيرا، وأخرى لا تحتاج إلا يديك وذاكرة جيدة. يقول الأجداد إن تلك الألعاب علمتهم الجري السريع، وعلمتهم أن يتفقوا على القوانين بأنفسهم بلا كبير يحكم بينهم. وبعض هذه الألعاب ما زال يلعب اليوم بأسماء جديدة.",
 [["ماذا كانت تحتاج اللعبة القديمة الأولى؟",["عصا وحجرا صغيرا","كرة وشبكة","طاولة"],0],
  ["ماذا كانت تحتاج اللعبة الأخرى؟",["اليدين وذاكرة جيدة","دراجة","حبلا طويلا"],0],
  ["ماذا يقول الأجداد عن تلك الألعاب؟",["علمتهم الجري والاتفاق على القوانين بأنفسهم","علمتهم السكوت","علمتهم الحساب"],0],
  ["هل ما زالت تلعب اليوم؟",["نعم، بعضها بأسماء جديدة","لا، اختفت كلها","في المدارس فقط"],0]]],

["في حصة الفن تعلمنا الخط العربي. أعطانا المعلم قلما له سن عريض مائل، وقال: لا تضغط على الورقة، ودع القلم يمشي. كتبت اسمي عشر مرات، وفي كل مرة كان أحسن قليلا من التي قبلها. قال المعلم: الخط الجميل ليس موهبة تولد معك، إنما هو يد تعودت على الصبر.",
 [["ماذا تعلموا في حصة الفن؟",["الخط العربي","الرسم بالألوان","صنع المجسمات"],0],
  ["بماذا نصحهم المعلم؟",["ألا يضغطوا على الورقة","أن يكتبوا بسرعة","أن يكتبوا بقلم رفيع"],0],
  ["كم مرة كتب الطالب اسمه؟",["عشر مرات","مرتين","مرة واحدة"],0],
  ["ما معنى كلام المعلم في آخر النص؟",["الخط الجميل يحتاج صبرا وتعودا","الخط موهبة لا تتعلم","الخط لا ينفع في شيء"],0]]],

["بدأنا في المدرسة مشروع حديقة صغيرة خلف الفصول. حفرنا الأرض، ووضعنا البذور، وكتبنا على كل عود اسم ما زرعناه. في الأسبوع الأول لم يظهر شيء، فظن بعضنا أن المشروع فشل. وفي الأسبوع الثالث خرجت أوراق خضراء صغيرة. قال المعلم: الأرض لا تتأخر، لكنها لا تستعجل.",
 [["أين بدأ المشروع؟",["خلف الفصول في المدرسة","في بيت المعلم","في حديقة عامة"],0],
  ["لماذا كتبوا الأسماء على العيدان؟",["ليعرفوا ما زرعوه في كل مكان","لتزيين الحديقة","ليحفظوا الإملاء"],0],
  ["ماذا ظن بعضهم في الأسبوع الأول؟",["أن المشروع فشل","أن البذور كثيرة","أن الأرض مبللة"],0],
  ["ما معنى قول المعلم؟",["النبات يحتاج وقتا ولا ينفع فيه العجلة","الأرض لا تنبت","يجب الزراعة في الشتاء"],0]]],

["ذهبنا إلى المتحف في رحلة المدرسة. كان فيه بيت قديم نقلوه حجرا حجرا، وأدوات كان الناس يستعملونها قبل مئة سنة: رحى لطحن الحب، وقربة للماء، وفانوس صغير. وقفت طويلا عند الفانوس، وفكرت أن الضوء الذي نضغط له زرا اليوم كان قبل مئة سنة يحتاج زيتا وعود ثقاب ويدا حذرة.",
 [["إلى أين كانت رحلة المدرسة؟",["إلى المتحف","إلى الحديقة","إلى المزرعة"],0],
  ["ما الذي نقلوه إلى المتحف حجرا حجرا؟",["بيتا قديما","جدار مدرسة","مسجدا"],0],
  ["ما الأدوات التي ذكرها النص؟",["رحى وقربة وفانوس","حاسوب وهاتف","سيارة ودراجة"],0],
  ["بماذا فكر الكاتب عند الفانوس؟",["أن الضوء قديما كان يحتاج زيتا وعناية","أن الفانوس جميل الشكل","أن المتحف صغير"],0]]],

["آلمني ضرسي ليلة كاملة، فأخذني أبي في الصباح إلى طبيب الأسنان. كنت خائفا، فسألني الطبيب عن مدرستي حتى نسيت خوفي. نظر إلى ضرسي وقال: فيه ثقب صغير، وسببه الحلوى قبل النوم بلا تنظيف. أصلح الضرس في ربع ساعة، ثم أعطاني فرشاة جديدة وقال: هذه أرخص من كل علاج.",
 [["لماذا ذهب الكاتب إلى الطبيب؟",["لأن ضرسه آلمه ليلة كاملة","لفحص عينيه","لأخذ دواء للبرد"],0],
  ["كيف نسي الكاتب خوفه؟",["سأله الطبيب عن مدرسته","أعطاه الطبيب حلوى","نام في الكرسي"],0],
  ["ما سبب الثقب في الضرس؟",["الحلوى قبل النوم بلا تنظيف","الماء البارد","الخبز"],0],
  ["ماذا قصد الطبيب بكلامه الأخير؟",["أن التنظيف أسهل وأرخص من العلاج","أن الفرشاة غالية","أن العلاج لا ينفع"],0]]]

  ] }
 }

};
