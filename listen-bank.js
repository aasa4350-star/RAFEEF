/* ══════════════════════════════════════════════════════════════════
   listen-bank.js — بنكُ فهمِ المسموع (نمطُ ستيب)
   ══════════════════════════════════════════════════════════════════
   لِمَ وُضع؟ تقريرُ حسنٍ في الإنجليزي (٥ أكتوبر ٢٠٢٦) أظهر أنّ فهمَ
   المسموعِ — وهو عشرون في المئة من وزنِ ستيب بما نقله الأب — تدرّب
   عليه **مرّةً واحدةً في عمرِه كلِّه** (٦ أغسطس). والإملاءُ المسموعُ
   في الصفحةِ استماعٌ فعليّ، لكنّه إملاءُ كلمةٍ مفردة: يقيس التقاطَ
   الحروفِ لا فهمَ جملةٍ ولا استنتاجَ مقصِدِ المتكلّم — وهذا هو
   المطلوبُ في الاختبار.

   الشكل: { t:"النصُّ المسموع", q:[ [ السؤال، [خيارات — الصحيحُ أوّلًا]، شرحٌ عربيّ ] ] }
   والصحيحُ أوّلٌ دائمًا، وتتكفّل الصفحةُ بخلطِ الخيارات عند العرض —
   فلا ننقل إلى البنكِ انحيازَ موضعٍ كالذي وجدناه في كتيّب القواعد.

   والنصوصُ قصيرةٌ من حياةِ المدرسةِ والسوقِ والمطارِ والعيادة، على
   نمطِ ما يُسأل عنه في ستيب: الفكرةُ العامّة، والتفصيلُ الدقيق،
   والاستنتاجُ (أين هما؟ ماذا سيفعل؟ كيف يشعر؟).
   ══════════════════════════════════════════════════════════════════ */
(function(){
var L = [];
function S(t, qs){ L.push({ t:t, q:qs }); }

/* ═══ المدرسة ═══ */
S("Attention, students. The science exam will start at nine o'clock in room twelve, not room ten. Please bring your own calculator. The library will stay open until four this afternoon.",
 [["Where will the exam take place?",["In room twelve","In room ten","In the library","In the science lab"],
   "قال: in room twelve, not room ten — والتصحيحُ بعد «not» هو الصحيح."],
  ["What must the students bring?",["A calculator","A dictionary","A notebook","A laptop"],
   "‏bring your own calculator — الآلةُ الحاسبة."]]);

S("I'm sorry I missed your class yesterday. I had a bad headache, so my mother took me to the clinic. The doctor said I should rest for two days. Can I get the homework, please?",
 [["Why was the student absent?",["He was ill","He was travelling","He overslept","He had a test"],
   "صداعٌ شديدٌ وزيارةُ عيادة ⇐ كان مريضًا."],
  ["What does he ask for?",["The homework","A new book","More time in the exam","A doctor's note"],
   "آخرُ جملةٍ: Can I get the homework."]]);

S("Our school trip has been moved from Tuesday to Thursday because of the weather. The bus will leave at seven in the morning, so do not be late. Bring a jacket; the museum is cold.",
 [["Why was the trip changed?",["Because of the weather","Because the bus broke down","Because the museum closed","Because of exams"],
   "‏because of the weather — بسببِ الطقس."],
  ["What should students bring?",["A jacket","An umbrella","Extra money","Their books"],
   "‏Bring a jacket — المتحفُ بارد."]]);

S("Good morning. I'd like to register for the English course, please. I finished the beginner level last term and my teacher said I can move to the intermediate one.",
 [["What level does the speaker want?",["Intermediate","Beginner","Advanced","He is not sure"],
   "أنهى المبتدئَ ويريد الانتقالَ إلى المتوسّط."],
  ["Where is this conversation happening?",["At a language centre","At a hospital","At an airport","At a bank"],
   "تسجيلٌ في دورةِ لغة ⇐ معهدُ لغات."]]);

/* ═══ السوق والمطعم ═══ */
S("Excuse me, how much is this blue shirt? — It's ninety riyals, but today there is a twenty percent discount on all shirts. — Great, I'll take two of them.",
 [["How much is the discount?",["Twenty percent","Ninety riyals","Twenty riyals","Half the price"],
   "‏a twenty percent discount — خصمُ عشرين في المئة."],
  ["How many shirts does the customer buy?",["Two","One","Three","None"],
   "‏I'll take two of them."]]);

S("Are you ready to order? — Yes, I'll have the grilled chicken with rice, and a glass of water, please. — Would you like soup with that? — No, thank you. Just the chicken.",
 [["What does the customer order?",["Chicken and rice","Soup and bread","Fish and salad","Only water"],
   "‏grilled chicken with rice."],
  ["Does he want soup?",["No","Yes","Only a little","He asks for it later"],
   "‏No, thank you — رفض الشوربة."]]);

S("I bought this phone last week, but the battery dies after three hours. I have the receipt here. Can I change it, or do I get my money back?",
 [["What is the problem?",["The battery does not last","The screen is broken","The phone is the wrong colour","The phone is too expensive"],
   "‏the battery dies after three hours."],
  ["What does the speaker want?",["An exchange or a refund","A free charger","A new receipt","A repair appointment"],
   "‏change it, or … my money back."]]);

/* ═══ السفر ═══ */
S("Passengers travelling to Jeddah on flight two-one-four: the departure gate has changed from gate eight to gate fifteen. Boarding will begin in twenty minutes.",
 [["Which gate should passengers go to?",["Gate fifteen","Gate eight","Gate twenty","Gate two"],
   "تغيّرت من الثامنة إلى الخامسة عشرة."],
  ["When does boarding start?",["In twenty minutes","Immediately","In two hours","After the flight lands"],
   "‏in twenty minutes."]]);

S("The train to Dammam leaves at six fifteen, not six fifty. If you miss it, the next one is after two hours. I suggest we take a taxi to the station now.",
 [["When does the train leave?",["At six fifteen","At six fifty","At two o'clock","At five fifteen"],
   "‏six fifteen, not six fifty — انتبه للفرقِ بين fifteen و fifty."],
  ["What does the speaker suggest?",["Taking a taxi now","Waiting two hours","Taking the next train","Cancelling the trip"],
   "‏I suggest we take a taxi."]]);

S("Welcome to the hotel. Your room is on the fourth floor, number four-oh-two. Breakfast is served from six to ten in the restaurant downstairs. The pool closes at nine in the evening.",
 [["Where is breakfast served?",["In the restaurant downstairs","On the fourth floor","By the pool","In the room"],
   "‏in the restaurant downstairs."],
  ["Until what time is breakfast served?",["Ten o'clock","Nine o'clock","Six o'clock","Four o'clock"],
   "‏from six to ten."]]);

/* ═══ العيادة والخدمات ═══ */
S("The doctor is busy with another patient right now. Your appointment was at four, but you will have to wait about fifteen minutes. Please take a seat.",
 [["Why must the patient wait?",["The doctor is with another patient","The clinic is closed","He came on the wrong day","The doctor has left"],
   "‏busy with another patient."],
  ["How long is the wait?",["About fifteen minutes","About four hours","Until tomorrow","Only two minutes"],
   "‏about fifteen minutes."]]);

S("Your book is two days late, so there is a small fine of five riyals. You can keep the second book for one more week if you need it.",
 [["Where is this conversation?",["In a library","In a bookshop","In a classroom","In a post office"],
   "تأخيرُ كتابٍ وغرامةٌ وتمديدُ الاستعارة ⇐ مكتبة."],
  ["How long can the second book be kept?",["One more week","Two more days","One more month","It must be returned today"],
   "‏one more week."]]);

/* ═══ أخبارٌ وإعلانات ═══ */
S("Tomorrow will be cloudy in the morning with light rain in the afternoon. Temperatures will drop to eighteen degrees at night. Drivers should be careful on wet roads.",
 [["What will the weather be like in the afternoon?",["Light rain","Clear and sunny","Very hot","Snowy"],
   "‏light rain in the afternoon."],
  ["Who is the warning for?",["Drivers","Students","Farmers","Pilots"],
   "‏Drivers should be careful."]]);

S("The new sports hall will open next month. Students can register from Sunday. The fee is one hundred riyals for the whole term, and it is free for those who join the school team.",
 [["When can students register?",["From Sunday","Next month","Today","After the term ends"],
   "‏register from Sunday — والافتتاحُ الشهرَ القادم، فلا تخلط بينهما."],
  ["Who pays nothing?",["Members of the school team","All students","New students","Nobody"],
   "‏free for those who join the school team."]]);

/* ═══ حواراتٌ تحتاج استنتاجًا ═══ */
S("You look tired today. — I know. I studied until two in the morning for the chemistry test, and then I couldn't sleep at all. — You should rest after school.",
 [["Why is the speaker tired?",["He studied very late","He played football","He travelled all night","He is ill"],
   "‏studied until two in the morning."],
  ["What is the advice?",["To rest after school","To study more","To see a doctor","To sleep in class"],
   "‏You should rest after school."]]);

S("Did you finish the project? — Almost. I wrote the report, but I still need to draw the charts. I'll send it to you before Friday, I promise.",
 [["Is the project finished?",["No, part of it is left","Yes, completely","It has not been started","It was cancelled"],
   "‏Almost — كتب التقريرَ وبقيت الرسوم."],
  ["When will he send it?",["Before Friday","On Saturday","Tonight","Next month"],
   "‏before Friday."]]);

S("I called you three times yesterday but your phone was off. — Sorry, the battery died and I left my charger at my uncle's house. I got it back this morning.",
 [["Why did the speaker not answer?",["His phone had no battery","He was asleep","He was angry","He changed his number"],
   "‏the battery died."],
  ["Where was the charger?",["At his uncle's house","In his bag","At school","In the car"],
   "‏at my uncle's house."]]);

S("Our team lost the match, but I'm not sad. We played much better than last time, and the coach said we only need more practice before the final.",
 [["How does the speaker feel?",["Not sad, he sees progress","Very angry","Afraid of the coach","Bored with football"],
   "قال I'm not sad وأثنى على تحسّنِ الأداء."],
  ["What does the team need?",["More practice","A new coach","New players","A longer rest"],
   "‏we only need more practice."]]);

S("Could you help me carry these boxes to the second floor? — Of course, but let's use the lift. They look heavy, and the stairs are narrow.",
 [["What does the first speaker ask for?",["Help carrying boxes","Directions to the lift","A new box","Someone to open the door"],
   "‏help me carry these boxes."],
  ["Why does the second speaker prefer the lift?",["The boxes are heavy and the stairs are narrow","The lift is faster","The stairs are closed","He is tired"],
   "‏They look heavy, and the stairs are narrow."]]);

S("I'm thinking of studying engineering, like my brother. But my father says I should choose what I love, not what my family chose. I still have a year to decide.",
 [["What is the speaker's father's advice?",["To choose what he loves","To study engineering","To follow his brother","To decide quickly"],
   "‏choose what you love, not what your family chose."],
  ["How much time does he have?",["A year","A month","A week","No time left"],
   "‏I still have a year to decide."]]);

window.LISTEN_BANK = L;
})();
