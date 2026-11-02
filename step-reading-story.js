/* ══════════════════════════════════════════════════════════════════
   step-reading-story.js — قصصٌ تاريخيّةٌ وعلميّةٌ لفهد، بنمطِ ستيب
   ══════════════════════════════════════════════════════════════════
   ملاحظةُ فهدٍ نقلها الأب (٢ نوفمبر ٢٠٢٦): «يبي قطعًا كثيرةً متنوّعة،
   ويفضّل قصصًا تاريخيّةً وعلميّة».

   وقِيس ما عنده قبل الزيادة: اثنتان وثلاثون قطعةً في step-reading.js،
   كلُّها مقاليّةٌ حِجاجيّة — اقتصادٌ ومنهجيّةُ بحثٍ وعلومٌ اجتماعيّة —
   ولا قصّةَ واحدة. فالفراغُ الذي يشكوه حقيقيٌّ لا انطباع.

   وهذه سرديّة: فيها شخصٌ وزمانٌ ومكانٌ وحدثٌ يتطوّر، لا أطروحةٌ
   تُدافَع. وهي على نمطِ ستيب في الطول (١٢٠–١٧٠ كلمة) وفي الأسئلة
   (صريحةٌ واستنتاجيّةٌ ومعنى كلمةٍ من السياق)، فلا تكسر وزنَ التبويب.

   الشكل نفسُه: [نصُّ القطعة, [[السؤال, [الخيارات], فهرسُ الصحيح], ...]]
   وتُدمَج في STEP_READING فتدخل القسمَين معًا (reading.html
   وpractice.html) بلا نسخةٍ ثانيةٍ يتفرّق إصلاحُها.

   والوقائعُ فيها مشهورةٌ مستقرّة، وتُجنَّب الأرقامُ الدقيقةُ التي
   تختلف فيها المصادر.
   ══════════════════════════════════════════════════════════════════ */
(function(){
"use strict";

var STORIES = [

/* ─── تاريخ: الطبُّ والوباء ─── */
["In the summer of 1854, cholera swept through a crowded district of London. The accepted explanation was bad air rising from the river, and few doctors questioned it. A physician named John Snow doubted the theory. Instead of arguing, he walked the streets and marked every death on a map of the neighbourhood. The marks clustered tightly around a single water pump on Broad Street. Households that drew their water elsewhere were largely spared, and a nearby workhouse with its own well lost almost no one. Snow took his map to the local officials and asked them to remove the pump handle. They were unconvinced by his reasoning but agreed to the measure, and the outbreak faded soon afterwards. It took years before the medical establishment accepted that water, not air, had carried the disease. The map had done what the argument alone could not: it made the pattern impossible to ignore.",
 [["What was the accepted explanation for the outbreak at the time?",["Bad air rising from the river.","Contaminated water from a pump.","Overcrowding in the houses.","Food sold in the market."],0],
  ["How did Snow investigate the problem?",["He mapped where the deaths occurred.","He tested the air in the streets.","He interviewed doctors across London.","He compared London with other cities."],0],
  ["What does the passage say about the officials' decision?",["They acted although they did not accept his reasoning.","They were persuaded by his theory at once.","They refused to remove the handle.","They ordered a new well to be dug."],0],
  ["What does the writer mean by saying the map did what the argument could not?",["It displayed the pattern so clearly that it could not be denied.","It was easier to carry than a report.","It proved the air theory correct.","It was drawn by an official body."],0]]],

/* ─── علم: الصدفة المنضبطة ─── */
["Alexander Fleming returned to his laboratory after a holiday in 1928 and found his bench as untidy as he had left it. Among the dishes of bacteria he had been growing, one had been spoiled by a stray mould. Around the mould there was a clear ring where the bacteria had died. Many researchers had seen contaminated dishes before and had washed them away without a second glance. Fleming kept this one. He grew the mould deliberately, tested what it produced against several kinds of bacteria, and published his finding. Yet he could not purify the substance in useful amounts, and for more than ten years penicillin remained a laboratory curiosity. It became a medicine only when a team at Oxford solved the problem of producing it at scale, under the pressure of war. The discovery is often told as a lucky accident, but the luck lay in who was looking.",
 [["What had happened to the dish Fleming noticed?",["A stray mould had grown on it and killed the bacteria around it.","It had dried out completely.","It had been washed by a colleague.","It had been left outside the laboratory."],0],
  ["How did Fleming's response differ from that of other researchers?",["He kept the spoiled dish and studied it instead of discarding it.","He reported it to the hospital immediately.","He repeated the holiday experiment.","He refused to publish his results."],0],
  ["Why did penicillin not become a medicine straight away?",["It could not be produced in useful quantities.","Doctors refused to prescribe it.","It was found to be unsafe.","The mould could not be grown again."],0],
  ["What does the writer mean by 'the luck lay in who was looking'?",["The accident mattered because an observer recognised its importance.","Fleming was fortunate to take a holiday.","Other scientists were unlucky with their dishes.","The mould appeared only once."],0]]],

/* ─── تاريخ: فكُّ رموز ─── */
["When Napoleon's soldiers were digging near the Egyptian town of Rosetta in 1799, one of them uncovered a broken slab of dark stone covered in writing. The same decree had been carved on it three times: once in Greek, once in a later Egyptian script, and once in hieroglyphs. Scholars could read the Greek easily, and for the first time they held a key to a script that had been silent for centuries. Even so, the stone did not surrender its secret quickly. For twenty years scholars assumed hieroglyphs were pure pictures, each sign standing for an idea. The young French scholar Jean-Francois Champollion, who had taught himself Coptic, eventually showed that many signs recorded sounds instead. Once names could be spelled out, the rest of the system unravelled. The stone had been available to everyone; what was missing was the right assumption about how it worked.",
 [["What made the Rosetta Stone valuable to scholars?",["It carried the same text in a script they could already read.","It was the oldest stone ever found in Egypt.","It was written entirely in Greek.","It described a famous battle."],0],
  ["Why did progress take so long after the stone was found?",["Scholars wrongly assumed every sign stood for an idea.","The Greek text was damaged beyond reading.","The stone was kept hidden for twenty years.","No one was interested in Egyptian writing."],0],
  ["What helped Champollion succeed?",["His knowledge of Coptic and the idea that signs recorded sounds.","His access to a second stone.","His training as a soldier.","His work with the Greek alphabet alone."],0],
  ["What is the writer's main point in the last sentence?",["The obstacle was a mistaken assumption, not a lack of evidence.","The stone should have been moved sooner.","Scholars had too little material to work with.","Champollion was helped by chance alone."],0]]],

/* ─── علم: ملاحظةٌ تُغيّر خريطة ─── */
["Alfred Wegener was a meteorologist, not a geologist, and that may be why he asked the question. Looking at a world map, he noticed that the coast of South America seemed to fit the coast of Africa, as though the two had once been joined. Others had noticed the resemblance and dismissed it as coincidence. Wegener gathered evidence instead: identical fossils of land animals on both shores, matching rock formations, and signs of ancient ice in places that are now tropical. In 1912 he proposed that the continents had drifted apart. Geologists rejected the idea almost unanimously, and their objection was reasonable: he could not explain what force could move a continent. He died on an expedition to Greenland with the argument unresolved. Half a century later, surveys of the ocean floor revealed spreading ridges, and the mechanism he had lacked was found. The evidence had been right; the explanation had not yet been invented.",
 [["What first drew Wegener's attention?",["The apparent fit between two continental coastlines.","A fossil he found in Greenland.","A survey of the ocean floor.","A disagreement among geologists."],0],
  ["Why did geologists reject his proposal?",["He could not explain what force would move continents.","His fossils were shown to be fakes.","He was not trained as a meteorologist.","His maps were inaccurate."],0],
  ["What does the passage suggest about their objection?",["It was a fair one at the time.","It was motivated by jealousy.","It ignored all his evidence.","It was never actually stated."],0],
  ["What finally supported his idea?",["Discoveries about the ocean floor made long after his death.","A second expedition to Greenland.","New fossils found in Africa.","A change in the shape of the coastlines."],0]]],

/* ─── تاريخ: مهندسٌ ومدينة ─── */
["In the middle of the nineteenth century, London's river had become its sewer, and in the hot summer of 1858 the smell reached the windows of Parliament. Members who had resisted the cost of reform for years approved a plan within weeks. The engineer Joseph Bazalgette was given the task of building a network of brick tunnels to carry waste far downstream before releasing it. He calculated the diameter the pipes would need for the population of the city, and then he doubled it. Colleagues thought the margin extravagant. London grew far beyond anything Bazalgette's generation expected, and the tunnels he built carried the waste of a city many times larger than the one he designed them for. They are still in use. His reputation rests less on the elegance of the engineering than on a single decision about how wrong he might turn out to be.",
 [["What finally persuaded Parliament to act?",["The smell of the river reached the building itself.","A report by Bazalgette was published.","A disease outbreak closed the city.","The cost of the plan was reduced."],0],
  ["What did Bazalgette do after calculating the required size?",["He doubled it.","He reduced it to save money.","He asked Parliament to decide.","He used the figure exactly."],0],
  ["How did his colleagues view that decision?",["They thought the margin was excessive.","They considered it too cautious.","They refused to work on the project.","They copied it in their own designs."],0],
  ["What does the writer admire most about Bazalgette?",["That he allowed for being wrong about the future.","That his tunnels were beautifully built.","That he finished the work quickly.","That he worked without payment."],0]]],

/* ─── علم: تجربةٌ على الذات ─── */
["For most of the twentieth century, doctors were taught that stomach ulcers were caused by stress and acid, and that patients would need treatment for life. Two Australian researchers, Barry Marshall and Robin Warren, kept finding a spiral bacterium in samples of inflamed stomach tissue. They proposed that the infection, not the stress, was doing the damage. The idea was dismissed; everyone knew that no organism could survive in stomach acid. Unable to persuade reviewers and unable to use an animal model, Marshall took an unusual step: he drank a culture of the bacterium himself. He fell ill within days, and a biopsy showed the inflammation he had predicted. Even then acceptance came slowly, and the treatment that now cures most ulcers in a fortnight took years to become standard. Their work was eventually recognised with a Nobel Prize, long after the patients had begun to benefit.",
 [["What was the accepted explanation for ulcers at the time?",["Stress and stomach acid.","A spiral bacterium.","Poor diet alone.","An inherited weakness."],0],
  ["Why was the researchers' proposal dismissed at first?",["It was believed no organism could survive stomach acid.","Their samples were lost.","They had no medical training.","The bacterium was already well known."],0],
  ["Why did Marshall drink the culture?",["He had no animal model and could not persuade others.","He wanted to test a new medicine.","He had been ordered to do so.","He believed it would protect him."],0],
  ["What does the final sentence suggest?",["Recognition arrived long after the practical benefit did.","The prize came before the treatment worked.","Patients were never helped by the discovery.","The Nobel Prize was refused."],0]]],

/* ─── تاريخ: ملاحةٌ وساعة ─── */
["A ship at sea could find how far north or south it was by measuring the sun, but finding how far east or west it had travelled defeated navigators for centuries, and fleets were lost because of it. The principle was understood: compare the local time aboard with the time at a known port, and the difference gives the distance. The difficulty was keeping accurate time on a rolling, damp, changing ship, where pendulum clocks were useless. Britain offered a large prize for a solution, and most of the scientific establishment expected it to come from astronomy. It came instead from a carpenter's son, John Harrison, who spent decades building a series of sea clocks, each smaller and more exact than the last. His final instrument lost only a few seconds across a long Atlantic voyage. He was paid the reward reluctantly and late, after years of argument with the board that had promised it.",
 [["What problem defeated navigators for centuries?",["Determining how far east or west they had travelled.","Measuring the height of the sun.","Reading the compass at night.","Judging the depth of the sea."],0],
  ["Why were ordinary clocks unsuitable at sea?",["Motion and damp made pendulum clocks useless.","They were too expensive to buy.","They could not show local time.","They were forbidden on ships."],0],
  ["What was unexpected about the solution?",["It came from a craftsman rather than from astronomy.","It required no instrument at all.","It was found by the prize committee.","It worked only near the coast."],0],
  ["What does the passage say about Harrison's reward?",["It was paid late and with reluctance.","It was paid immediately in full.","It was given to an astronomer instead.","It was refused by Harrison."],0]]],

/* ─── علم: قياسُ الأرض ─── */
["More than two thousand years ago, a scholar named Eratosthenes was working in the library at Alexandria when he read that at noon on a particular day, in a town far to the south, the sun stood directly over a deep well and cast no shadow. In Alexandria on the same day, a vertical pillar did cast a shadow. From this difference he reasoned that the surface between the two places must curve, and that the angle of the shadow would reveal how much. He had the distance between the towns measured by professional pacers, applied simple geometry, and arrived at a figure for the circumference of the Earth remarkably close to the modern value. He used no instrument more advanced than a stick and no mathematics beyond what a student learns today. What he had was a report from elsewhere, a measurement he could make at home, and the willingness to treat the difference between them as information.",
 [["What did Eratosthenes read about the southern town?",["That the sun cast no shadow there at noon on a certain day.","That its wells had dried up.","That it lay on the equator.","That its pillars were taller."],0],
  ["What did the difference between the two places tell him?",["That the surface between them curved.","That one town was larger.","That the sun moved faster in the south.","That his reports were mistaken."],0],
  ["How was the distance between the towns obtained?",["It was measured by professional pacers.","It was estimated from a map.","It was calculated from the shadow.","It was taken from an older book."],0],
  ["What does the writer emphasise about his method?",["It used ordinary tools and simple geometry.","It required advanced instruments.","It depended on a long sea voyage.","It could not be repeated."],0]]],

/* ─── تاريخ: نقلُ المعرفة ─── */
["In the ninth century, Baghdad became a place where books were worth more than their weight in silver. Scholars gathered texts in Greek, Persian, Syriac and Sanskrit, and a generation of translators turned them into Arabic. The work was not mechanical copying. A translator had to understand the medicine or the mathematics well enough to judge when a manuscript was corrupt, and the best of them added commentary, corrected errors and extended the arguments. Hunayn ibn Ishaq, who led much of the medical translation, would seek several copies of a text and compare them before settling on a reading. Much of what later reached Europe arrived through these Arabic versions, and some Greek works survive only because they were translated in this period. The originals were lost; the translations were not. A library that had been assembled out of curiosity turned out to be an act of preservation.",
 [["What does the passage say about the translators' work?",["It required real understanding of the subject, not just language.","It was simple copying of manuscripts.","It was done mainly for payment.","It was limited to Greek texts."],0],
  ["What was Hunayn ibn Ishaq's method?",["He compared several copies before deciding on a reading.","He translated from memory.","He worked only from Persian sources.","He refused to add commentary."],0],
  ["Why do some Greek works survive today?",["Their Arabic translations outlasted the lost originals.","They were carved in stone.","They were never translated.","They were rewritten in Europe."],0],
  ["What does the writer mean by calling the library 'an act of preservation'?",["Gathering the texts out of interest ended up saving them.","The library was built to store documents safely.","The translators intended to protect Greek learning.","The books were copied for museums."],0]]],

/* ─── علم: بياناتٌ تُهمَل ─── */
["In the 1950s a British researcher noticed something in the records of a lung disease that was becoming common. Richard Doll had expected to find the cause in road tar or in the fumes of a growing number of motor cars. He and his colleague interviewed patients in London hospitals and compared them with patients admitted for other reasons. The pattern that emerged pointed somewhere else entirely, and Doll, who smoked himself, gave up the habit while the study was still running. Publishing the finding was not enough. The association was dismissed as coincidence, and the researchers followed tens of thousands of doctors for years to show that the risk rose with the amount smoked and fell when people stopped. It took decades for public policy to follow the evidence. The study is remembered less for being surprising than for being patient.",
 [["What had Doll expected to find as the cause?",["Road tar or motor fumes.","Smoking.","An infection.","A hereditary condition."],0],
  ["What did Doll do while the study was still running?",["He stopped smoking himself.","He left the research team.","He published his conclusions early.","He changed hospitals."],0],
  ["Why did the researchers follow doctors for years?",["To show the risk rose with amount and fell after stopping.","To find new patients for treatment.","To compare London with other cities.","To satisfy the hospitals' rules."],0],
  ["What does the writer say the study is remembered for?",["Its patience rather than its surprise.","Its speed.","Its small size.","Its use of new equipment."],0]]],

/* ─── تاريخ: حرفةٌ تندثر ─── */
["The craft of the scribe did not disappear the day the printing press arrived. For a generation after Gutenberg, printed books were made to look like manuscripts: the same letter shapes, the same wide margins, spaces left blank so that an artist could paint the decorated capitals by hand. Buyers expected a book to look a certain way, and printers obliged. Some wealthy collectors refused printed copies entirely and continued to commission scribes. What changed first was not the appearance of books but their number, and with number came a change nobody had designed. When a text could be reproduced identically in hundreds of copies, scholars in different cities could argue about the same page and the same line. The press is usually remembered for making books cheap. Its deeper effect was making them the same.",
 [["What did early printed books look like?",["They imitated the appearance of manuscripts.","They used entirely new letter shapes.","They had no margins or decoration.","They were much smaller than manuscripts."],0],
  ["Why did printers imitate manuscripts?",["Buyers expected books to look that way.","Manuscripts were cheaper to produce.","The law required it.","Scribes designed the presses."],0],
  ["What changed first, according to the passage?",["The number of books, not their appearance.","The language of books.","The price of paper.","The size of libraries."],0],
  ["What does the writer consider the press's deeper effect?",["It made copies identical, so scholars could discuss the same page.","It made books cheaper for everyone.","It ended the craft of the scribe at once.","It reduced the number of errors to zero."],0]]],

/* ─── علم: صبرٌ في الرصد ─── */
["Tycho Brahe spent twenty years recording the positions of the planets from an island observatory, night after night, with instruments he had built himself. He had no telescope; nobody did. What he had was care, and his measurements were several times more accurate than any before them. His own model of the heavens was wrong, and he defended it stubbornly. When he died, his assistant Johannes Kepler inherited the records. Kepler believed the planets moved in perfect circles, as everyone had believed for two thousand years, and he spent years trying to fit the data to circles. The figures for Mars refused, missing by an amount that in any earlier set of observations could have been blamed on error. Brahe's measurements were too good to blame. Kepler abandoned the circle and found the ellipse. The discovery belonged to him, but it had been made possible by a man who was certain of the wrong thing.",
 [["What was remarkable about Brahe's observations?",["They were far more accurate than earlier ones, though made without a telescope.","They were made with the first telescope.","They were completed in a single year.","They confirmed his own model."],0],
  ["What did Kepler believe when he began?",["That the planets moved in perfect circles.","That the planets moved in ellipses.","That Brahe's data were unreliable.","That Mars did not orbit the sun."],0],
  ["Why could the problem with Mars not be dismissed as error?",["Brahe's measurements were too accurate to blame.","Kepler had checked them himself.","Other astronomers agreed with the circle.","The error was too small to notice."],0],
  ["What is the writer's point in the final sentence?",["A man who was wrong about his theory still made the discovery possible.","Kepler stole Brahe's work.","Brahe should have found the ellipse himself.","Accurate data are not important."],0]]],

/* ─── تاريخ: قرارٌ تحت ضغط ─── */
["In 1986 the engineers who built a shuttle's rocket boosters spent the evening before a launch arguing against it. The night was unusually cold in Florida, and they had data suggesting that a rubber seal in the joints lost its flexibility at low temperature. They could not say precisely how cold was too cold; the test data were scattered, and no launch had ever been attempted in weather like this. Their managers asked them to prove that the launch was unsafe. The engineers had expected to be asked to prove that it was safe. The recommendation was reversed before morning. The investigation that followed found that the seal had failed exactly as the engineers feared, and its report dwelt less on the rubber than on the question that had been put to them. Which way the burden of proof points is not a technical detail.",
 [["What concerned the engineers the night before the launch?",["A rubber seal might stiffen in the cold.","The rocket fuel was too old.","The weather would reduce visibility.","The crew were inexperienced."],0],
  ["Why could the engineers not give a precise limit?",["The test data were scattered and no such launch had been tried.","They had lost their records.","They were not given time to speak.","The seal had never been tested."],0],
  ["What did the managers ask them to do?",["Prove that the launch was unsafe.","Prove that the launch was safe.","Repeat the tests overnight.","Approve the launch without comment."],0],
  ["What does the writer suggest was the deeper failure?",["The way the burden of proof had been reversed.","The quality of the rubber.","The inexperience of the engineers.","The timing of the investigation."],0]]],

/* ─── علم: ما لا يُرى في البيانات ─── */
["During the Second World War, a statistician named Abraham Wald was asked to advise on armouring aircraft. The air force had carefully recorded where returning bombers had been hit, and the damage clustered on the wings and the fuselage. The obvious recommendation was to reinforce those areas. Wald argued for the opposite. The planes in the sample were the ones that had come back. Hits to the engines and the cockpit were rare in the data not because such hits were rare in the air, but because aircraft struck there did not return to be examined. The armour, he said, belonged where the surviving planes showed no damage at all. His reasoning was accepted, and the principle has outlived the war: a sample made only of survivors describes survival, not risk.",
 [["Where was the recorded damage concentrated?",["On the wings and fuselage of returning aircraft.","On the engines and cockpit.","On aircraft that were lost.","On aircraft still under construction."],0],
  ["Why were hits to the engines rare in the records?",["Aircraft hit there usually did not return.","The engines were already armoured.","Gunners aimed away from them.","Such hits were not recorded."],0],
  ["What did Wald recommend?",["Armouring the areas where survivors showed no damage.","Armouring the wings and fuselage.","Reducing the armour to save weight.","Collecting more records before deciding."],0],
  ["What does the final sentence mean?",["Studying only those who survived tells you about survival, not about danger.","Survivors are the most reliable witnesses.","Samples should always be larger.","Risk cannot be measured at all."],0]]],

/* ─── تاريخ: مدينةٌ تحت الرماد ─── */
["For centuries the land above Pompeii was farmed by people who knew only that the soil was unusually rich. The town beneath had been buried in a single day by ash from Vesuvius, and the ash that destroyed it also sealed it. When excavation began in earnest, the diggers found not ruins worn down by weather and reuse, but a town interrupted: loaves in an oven, political slogans painted on walls, a dog still chained in a doorway. An Italian archaeologist later noticed that the bodies had decayed, leaving hollow spaces in the hardened ash. By pouring plaster into the cavities he recovered the shapes of people in their last positions. Most ancient sites tell us how a society lasted. Pompeii is valuable for the opposite reason: it tells us what an ordinary afternoon looked like, because it was never tidied away.",
 [["What did the people farming the land above Pompeii know?",["Only that the soil was unusually rich.","That a town lay beneath them.","That the volcano would erupt again.","That excavations were planned."],0],
  ["What made the site unusual when it was excavated?",["It was interrupted rather than worn away by time.","It had been carefully preserved by its inhabitants.","It contained no everyday objects.","It had been rebuilt many times."],0],
  ["How were the shapes of the bodies recovered?",["Plaster was poured into the hollows left in the ash.","The bodies were found intact.","Drawings were made from skeletons.","Photographs were taken during digging."],0],
  ["Why does the writer consider Pompeii especially valuable?",["It shows an ordinary day rather than how a society endured.","It is the largest site of its kind.","It was never disturbed by farming.","It contains the oldest Roman writing."],0]]],

/* ─── علم: خطأٌ يُكتشَف بالمصادفة ─── */
["Two engineers at a laboratory in New Jersey spent much of 1964 trying to get rid of a noise. They were testing a sensitive antenna, and a faint hiss appeared in their measurements no matter where they pointed it. They checked the electronics, cooled the receiver, and considered the city, the sun and nuclear tests. They removed a pair of pigeons that had nested in the horn and cleaned out what the birds had left behind. The hiss remained, identical in every direction and at every hour. Meanwhile, a group of physicists a short distance away had calculated that if the universe had begun hot and dense, a faint glow should still be detectable, cooled by expansion to just a few degrees above absolute zero. A phone call connected the two. What the engineers had been trying to eliminate was the measurement the physicists were preparing to look for.",
 [["What were the engineers trying to do?",["Remove a faint noise from their measurements.","Detect the origin of the universe.","Build a new antenna.","Study the behaviour of pigeons."],0],
  ["What was notable about the hiss?",["It was the same in every direction and at every hour.","It appeared only at night.","It came from the direction of the city.","It stopped when the birds were removed."],0],
  ["What had the physicists predicted?",["A faint glow remaining from a hot, dense early universe.","A noise caused by nesting birds.","A fault in the antenna design.","A signal from a distant planet."],0],
  ["What is the irony the writer points out?",["The noise they wanted to remove was the discovery others were seeking.","The physicists had the wrong calculation.","The pigeons caused the signal after all.","The antenna was never repaired."],0]]]

];

/* ويُدمَج بلا تكرار: القطعةُ تُعرَف بنصِّها. وبهذا تدخل القسمَين معًا
   (reading.html وpractice.html) ولا تُنسَخ في ملفَّين. */
try{
  var base = window.STEP_READING;
  if(Array.isArray(base)){
    var seen = {};
    base.forEach(function(p){ seen[String((p||[])[0]||"").trim()] = 1; });
    STORIES.forEach(function(p){
      var k = String((p||[])[0]||"").trim();
      if(k && !seen[k]){ seen[k] = 1; base.push(p); }
    });
  } else {
    window.STEP_READING = STORIES.slice();
  }
}catch(e){}

window.STEP_READING_STORY = STORIES;
})();
