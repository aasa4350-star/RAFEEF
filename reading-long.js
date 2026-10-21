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
window.READING_MINWORDS = { hasan: 60 };
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
 }
};
