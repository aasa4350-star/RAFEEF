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

/* ═══════════════════════════════════════════════════════════════════
   التوسعةُ الأولى — طلبُ الأب (١٨ نوفمبر ٢٠٢٦) بعد القياس.

   كان البنكُ عشرين نصًّا = أربعين سؤالًا، وحسنٌ أجاب مئةً وأربعةً
   وأربعين سؤالًا في تسعَ عشرةَ جلسة — أي أنّ كلَّ سؤالٍ مرَّ عليه ٣٫٦
   مرّاتٍ في المتوسّط. فصعودُه من ٥٤٪ إلى ٨٤٪ لا يُفصَل فيه الحفظُ عن
   المهارة. ولا يُصلَح ذلك بترتيبٍ ولا بخوارزميّة: البنكُ نفد.

   وزيدت أربعون نصًّا بالشروطِ نفسِها: أربعةُ خيارات، والصحيحُ أوّلٌ
   وتخلطه الصفحة، وسؤالان لكلِّ نصّ — أحدهما تفصيلٌ دقيقٌ والآخرُ فكرةٌ
   أو استنتاج. والمواضيعُ جديدةٌ كلُّها: قوبِلت بالعشرين قبل الكتابة
   فلا بنكٌ ولا مطعمٌ ولا مطارٌ مكرَّر.
   ═══════════════════════════════════════════════════════════════════ */

/* ═══ خدماتٌ ومعاملات ═══ */
S("Your parcel arrived at our branch on Sunday, but nobody was home when we tried to deliver it. You can collect it yourself before Thursday, or we will send it back to the seller.",
 [["What happened when they tried to deliver?",["Nobody was at home","The address was wrong","The parcel was damaged","The branch was closed"],
   "‏nobody was home when we tried to deliver it."],
  ["What happens if he does not collect it?",["It goes back to the seller","It is thrown away","The fee doubles","It waits another month"],
   "‏we will send it back to the seller."]]);

S("The machine outside is not working, so please use the one inside the branch. If you only need to deposit cash, the counter on your left is faster than waiting here.",
 [["Which machine should the customer use?",["The one inside the branch","The one outside","Both of them","Neither of them"],
   "‏please use the one inside the branch."],
  ["What is faster for depositing cash?",["The counter on the left","The machine inside","The machine outside","The counter on the right"],
   "‏the counter on your left is faster."]]);

S("I need something for a sore throat, please. — This syrup works well, but take it after meals, not before. And if you still feel pain after four days, you should see a doctor.",
 [["When should he take the syrup?",["After meals","Before meals","With water only","At night only"],
   "‏take it after meals, not before."],
  ["What should he do if the pain continues?",["See a doctor","Buy a second bottle","Stop eating","Take two spoons"],
   "‏if you still feel pain after four days, you should see a doctor."]]);

S("The lift in building B is out of order until Wednesday. Staff on the upper floors should use the stairs at the end of the corridor. We are sorry for the trouble.",
 [["Why must people use the stairs?",["The lift is out of order","The corridor is closed","The building is full","It is good exercise"],
   "‏The lift in building B is out of order."],
  ["Where are the stairs?",["At the end of the corridor","Next to the lift","Outside the building","On the roof"],
   "‏the stairs at the end of the corridor."]]);

S("Good afternoon. Your car needs new brakes, and that will take about three hours. We can also change the oil today, but the tyres can wait until your next visit.",
 [["How long will the work take?",["About three hours","About one hour","All day","Three days"],
   "‏that will take about three hours."],
  ["What does the mechanic say can wait?",["The tyres","The brakes","The oil","The battery"],
   "‏the tyres can wait until your next visit."]]);

S("Attention shoppers. A small boy named Faisal is waiting at the customer service desk near the main entrance. If he is with you, please come and collect him now.",
 [["Where is the boy waiting?",["At the customer service desk","At the main gate of the mall","In the toy section","In the car park"],
   "‏waiting at the customer service desk near the main entrance."],
  ["Why is the announcement being made?",["A child is lost","A shop is closing","A sale is starting","The mall is closing"],
   "‏طفلٌ ينتظر ويُطلَب من أهلِه أخذُه ⇐ طفلٌ تائه."]]);

S("Our internet has been very slow since Monday. — Let me check your line. I can see a problem outside the house, so a technician will visit tomorrow between nine and twelve.",
 [["Where is the problem?",["Outside the house","Inside the router","In the computer","At the main office"],
   "‏I can see a problem outside the house."],
  ["When will the technician come?",["Tomorrow morning","Tonight","On Monday","Next week"],
   "‏tomorrow between nine and twelve."]]);

S("This month's bill is higher than usual because of the hot weather. If you pay before the twentieth, there is no extra charge. After that, a late fee is added.",
 [["Why is the bill higher?",["Because of the hot weather","Because of a mistake","Because of a new service","Because of a price rise"],
   "‏higher than usual because of the hot weather."],
  ["What happens after the twentieth?",["A late fee is added","The service stops","The price falls","Nothing changes"],
   "‏After that, a late fee is added."]]);

S("Could you take me to the central station, please? — Of course, but the main road is closed for repairs, so I will take the ring road. It is a little longer but much faster today.",
 [["Why will the driver take the ring road?",["The main road is closed","The ring road is shorter","The passenger asked for it","There is no traffic"],
   "‏the main road is closed for repairs."],
  ["What does the driver say about the ring road?",["It is longer but faster","It is shorter and faster","It is longer and slower","It is closed too"],
   "‏a little longer but much faster today."]]);

S("Welcome to the museum. Photography is allowed in every hall except the one on your right, where the old manuscripts are kept. Please also keep your voice low near them.",
 [["Where is photography not allowed?",["In the manuscripts hall","In the main entrance","In every hall","In the garden"],
   "‏allowed in every hall except the one on your right, where the old manuscripts are kept."],
  ["What else does the guide ask visitors to do?",["Keep their voices low","Leave their bags","Walk quickly","Stay together"],
   "‏keep your voice low near them."]]);

/* ═══ المدرسةُ والنشاطُ الطلّابيّ ═══ */
S("The results of the student council election will be announced on Sunday after the second period. The three winners will meet the headmaster at noon to plan this year's activities.",
 [["When will the results be announced?",["On Sunday after the second period","On Sunday morning","On Monday at noon","At the end of the week"],
   "‏on Sunday after the second period."],
  ["Why will the winners meet the headmaster?",["To plan this year's activities","To receive their prizes","To take a photograph","To repeat the election"],
   "‏to plan this year's activities."]]);

S("The science fair is in two weeks. Each group needs a poster and a short demonstration, but not a written report. Groups of four are allowed this year, not three.",
 [["What do the groups NOT need?",["A written report","A poster","A demonstration","A group name"],
   "‏a poster and a short demonstration, but not a written report."],
  ["How many students can be in a group this year?",["Four","Three","Five","Two"],
   "‏Groups of four are allowed this year, not three."]]);

S("The deadline for the history essay has moved from Wednesday to the following Sunday. Mr Nasser said this is the last change, so anyone who is late after that will lose five marks.",
 [["When is the new deadline?",["The following Sunday","Wednesday","The following Wednesday","The end of term"],
   "‏moved from Wednesday to the following Sunday."],
  ["What happens to late work after the new date?",["It loses five marks","It is not accepted","It is marked normally","It loses half the marks"],
   "‏anyone who is late after that will lose five marks."]]);

S("The robotics club meets every Tuesday in the computer lab, not the workshop. Beginners are welcome, and you do not need to bring anything — all the parts are provided.",
 [["Where does the club meet?",["In the computer lab","In the workshop","In the library","In the science lab"],
   "‏in the computer lab, not the workshop."],
  ["What must members bring?",["Nothing","Their own tools","A laptop","A small fee"],
   "‏you do not need to bring anything — all the parts are provided."]]);

S("Tomorrow at ten there will be a fire drill. When you hear the bell, leave your bags and walk — do not run — to the football field and wait with your teacher.",
 [["What should students do with their bags?",["Leave them","Carry them","Lock them","Give them to the teacher"],
   "‏leave your bags."],
  ["Where should they go?",["To the football field","To the main gate","To the car park","To the hall"],
   "‏walk to the football field."]]);

S("The cafeteria will serve only sandwiches this week because the main kitchen is being cleaned. Hot meals come back on Sunday, and the prices will stay the same.",
 [["Why are there no hot meals?",["The kitchen is being cleaned","The cook is away","Prices went up","The cafeteria is closed"],
   "‏because the main kitchen is being cleaned."],
  ["What will happen to the prices?",["They will stay the same","They will rise","They will fall","They are not mentioned"],
   "‏the prices will stay the same."]]);

S("If you want to join the trip to the farm, bring the signed form and forty riyals by Tuesday. Students who bring the money without the form cannot travel.",
 [["What must students bring?",["The signed form and the money","Only the money","Only the form","A letter from a doctor"],
   "‏bring the signed form and forty riyals."],
  ["What happens if a student brings the money only?",["He cannot travel","He pays more","He travels anyway","He waits for the next trip"],
   "‏Students who bring the money without the form cannot travel."]]);

S("I left my jacket in the gym on Thursday. — Several jackets are in the lost and found box in the office. Come after the last period and look through them yourself.",
 [["Where should he look for the jacket?",["In the office","In the gym","In the classroom","At the gate"],
   "‏in the lost and found box in the office."],
  ["When should he come?",["After the last period","Before school","During the break","On Thursday"],
   "‏Come after the last period."]]);

S("Parents are asked not to park in front of the school gate in the morning. Please use the side street instead, so the buses can enter and leave safely.",
 [["Where should parents park?",["In the side street","In front of the gate","Inside the school yard","At the bus stop"],
   "‏Please use the side street instead."],
  ["Why is this asked?",["So the buses can enter and leave safely","Because the gate is broken","Because the street is narrow","To keep the school quiet"],
   "‏so the buses can enter and leave safely."]]);

S("Library books can now be reserved online. When the book you want is returned, you will get a message, and it will be kept for you for three days only.",
 [["How can books be reserved now?",["Online","By phone","At the desk only","By email"],
   "‏can now be reserved online."],
  ["How long is the book kept?",["Three days","One week","Until the end of term","One day"],
   "‏kept for you for three days only."]]);

/* ═══ محادثاتٌ بين اثنين — الاستنتاجُ أكثرُ من التفصيل ═══ */
S("You seem quiet today. Is everything all right? — I'm fine, just thinking. My cousin is moving to another city next month, and we have been neighbours since we were children.",
 [["How does the speaker probably feel?",["Sad about his cousin leaving","Angry with his cousin","Excited about moving","Worried about an exam"],
   "جارٌ منذ الطفولةِ وسيرحل ⇐ حزنٌ لا غضبٌ ولا فرح."],
  ["What is happening next month?",["His cousin is moving away","He is moving away","His cousin is visiting","They are starting school"],
   "‏My cousin is moving to another city next month."]]);

S("Did you watch the match last night? — No, I had to finish my project. But my brother told me the score, so please don't describe the goals. I want to see it myself tonight.",
 [["Why didn't he watch the match?",["He was finishing a project","He was asleep","He does not like football","The television was broken"],
   "‏I had to finish my project."],
  ["What does he ask his friend not to do?",["Describe the goals","Tell him the score","Watch it again","Come tonight"],
   "‏please don't describe the goals."]]);

S("This recipe says two cups of flour, but I only have one. — Then make half of everything else too: one egg instead of two, and half a cup of milk. It will still work.",
 [["What is the problem?",["There is not enough flour","There are no eggs","There is no milk","The recipe is missing"],
   "‏two cups of flour, but I only have one."],
  ["What is the advice?",["Halve all the other amounts","Buy more flour","Use water instead","Try another recipe"],
   "‏make half of everything else too."]]);

S("Excuse me, where is the bookshop? — Go up to the first floor, turn left at the coffee shop, and it is at the end, next to the bank. If you reach the cinema, you have gone too far.",
 [["Where should she turn left?",["At the coffee shop","At the bank","At the cinema","At the lift"],
   "‏turn left at the coffee shop."],
  ["What does it mean if she reaches the cinema?",["She has walked too far","She has arrived","She must turn right","The shop is closed"],
   "‏If you reach the cinema, you have gone too far."]]);

S("I finished the novel you lent me. — Already? What did you think? — The beginning was slow, but the last fifty pages changed my mind completely. I'll bring it back on Sunday.",
 [["What did he think of the novel?",["He disliked the start but liked the end","He liked it all","He disliked it all","He did not finish it"],
   "‏The beginning was slow, but the last fifty pages changed my mind."],
  ["When will he return it?",["On Sunday","Today","Next month","He will keep it"],
   "‏I'll bring it back on Sunday."]]);

S("Shall we go to the beach on Friday? — The forecast says wind and dust. Why don't we wait for Saturday? The weather will be clear, and the road will be quieter too.",
 [["Why not go on Friday?",["Wind and dust are expected","The beach is closed","It will rain","They are busy"],
   "‏The forecast says wind and dust."],
  ["What is one reason to go on Saturday?",["The road will be quieter","It will be cheaper","The beach opens later","Their friends will come"],
   "‏the road will be quieter too."]]);

S("My grandfather always says the same thing: do the hard task first, while your mind is fresh. I used to laugh at that, but this year I tried it, and my marks went up.",
 [["What is the grandfather's advice?",["Do the hard task first","Rest before studying","Study at night","Ask for help early"],
   "‏do the hard task first, while your mind is fresh."],
  ["How did the speaker feel about it before?",["He used to laugh at it","He always followed it","He never heard it","He argued about it"],
   "‏I used to laugh at that."]]);

S("Which plan should I choose? — If you call a lot, take the first one. If you mostly use the internet, the second is better value. Both cost the same every month.",
 [["Which plan suits someone who uses the internet a lot?",["The second one","The first one","Either one","Neither one"],
   "‏If you mostly use the internet, the second is better value."],
  ["What is the same in both plans?",["The monthly cost","The internet speed","The number of calls","The contract length"],
   "‏Both cost the same every month."]]);

S("I'm looking for a summer course, not a job. — The university runs one in July for three weeks. It is free for school students, but you must apply before the end of May.",
 [["How long is the course?",["Three weeks","One week","Three months","All summer"],
   "‏in July for three weeks."],
  ["What must he do before the end of May?",["Apply","Pay the fee","Pass a test","Visit the university"],
   "‏you must apply before the end of May."]]);

S("The delivery came, but one of the three boxes is missing. — I'm sorry about that. I can send the missing box tomorrow, or refund that part of your order. Which do you prefer?",
 [["What is the problem?",["One box did not arrive","The boxes were damaged","The order was late","The address was wrong"],
   "‏one of the three boxes is missing."],
  ["What are the two choices?",["Receive it tomorrow or get the money back","Wait a week or cancel","Keep it or return it","Pay more or pay less"],
   "‏send the missing box tomorrow, or refund that part."]]);

/* ═══ إعلاناتٌ ورسائلُ صوتيّة ═══ */
S("This is a message for Khalid. Your appointment on Monday has been moved to Tuesday at the same time. Please press one to confirm, or call us back before Sunday evening.",
 [["What has changed?",["The day of the appointment","The time of the appointment","The place","The doctor"],
   "‏moved to Tuesday at the same time — اليومُ تغيّر لا الساعة."],
  ["What should he do if he cannot press one?",["Call back before Sunday evening","Come on Monday anyway","Send a message","Wait for another call"],
   "‏call us back before Sunday evening."]]);

S("Because of the sandstorm, schools in the eastern districts will start two hours late tomorrow. Schools in the north will open at the usual time. Drivers should be careful on the ring road.",
 [["Which schools start late?",["Those in the eastern districts","Those in the north","All schools","None of them"],
   "‏schools in the eastern districts will start two hours late."],
  ["What are drivers warned about?",["To be careful on the ring road","To avoid the city centre","To stay at home","To use public transport"],
   "‏Drivers should be careful on the ring road."]]);

S("Flight three-oh-eight to Riyadh is delayed by one hour because of a technical check. Passengers may stay in the lounge, and we will announce the new boarding time at six.",
 [["Why is the flight delayed?",["Because of a technical check","Because of the weather","Because the crew is late","Because of a strike"],
   "‏because of a technical check."],
  ["When will the new boarding time be announced?",["At six","In one hour","At three-oh-eight","Tomorrow"],
   "‏we will announce the new boarding time at six."]]);

S("Thank you for staying with us. Checkout is at twelve, but if you need a late checkout we can give you until two for no extra charge today. Just tell reception this morning.",
 [["What is the normal checkout time?",["Twelve","Two","Ten","Eleven"],
   "‏Checkout is at twelve."],
  ["What must the guest do to get a late checkout?",["Tell reception this morning","Pay an extra fee","Book another night","Call after twelve"],
   "‏Just tell reception this morning."]]);

S("One ticket to Abha, please. — The morning bus is full, but there are seats on the two o'clock one. It arrives at nine in the evening, and it stops once for a meal.",
 [["Which bus can he take?",["The two o'clock bus","The morning bus","The evening bus","Any bus"],
   "‏The morning bus is full, but there are seats on the two o'clock one."],
  ["How many stops does it make?",["One","Two","None","Three"],
   "‏it stops once for a meal."]]);

S("The swimming pool will close for maintenance from the first to the tenth of next month. Members will not pay for those days, and the time will be added to the end of their subscription.",
 [["How long will the pool be closed?",["Ten days","One month","One week","Two weeks"],
   "من الأوّلِ إلى العاشر ⇐ عشرةُ أيّام."],
  ["What happens to the members' money?",["The days are added to their subscription","It is returned in cash","It is lost","They pay half"],
   "‏the time will be added to the end of their subscription."]]);

S("The second-hand bicycle is in good condition, but the front tyre needs changing. I'm asking three hundred riyals, and I can deliver it free if you live inside the city.",
 [["What is wrong with the bicycle?",["The front tyre needs changing","The brakes are broken","It is very old","The seat is missing"],
   "‏the front tyre needs changing."],
  ["When is delivery free?",["If the buyer lives inside the city","If he pays in cash","If he buys today","Always"],
   "‏I can deliver it free if you live inside the city."]]);

S("Volunteers are needed for the book fair next weekend. You do not need experience, but you must be able to work both days, Friday and Saturday, from four until eight.",
 [["What is required of volunteers?",["To work both days","To have experience","To bring books","To pay a fee"],
   "‏you must be able to work both days."],
  ["What hours will they work?",["From four until eight","From eight until four","All day","Only in the morning"],
   "‏from four until eight."]]);

S("I have two tickets for the match, but my friend cannot come now. If anyone wants the second one, message me before Thursday. I'm not selling it — it's free.",
 [["Why is the ticket available?",["His friend cannot come","He bought too many","He changed his mind","The match was moved"],
   "‏my friend cannot come now."],
  ["How much does the ticket cost?",["Nothing","The full price","Half price","It is not said"],
   "‏I'm not selling it — it's free."]]);

S("Please remember that the hall must be empty by five, because another group uses it after us. Take your chairs back to the store room and switch off the lights before you leave.",
 [["Why must the hall be empty by five?",["Another group uses it","It is cleaned then","The building closes","The lights go off"],
   "‏because another group uses it after us."],
  ["What are two things they must do?",["Return the chairs and switch off the lights","Lock the door and leave the key","Clean the floor and close the windows","Move the tables and open the windows"],
   "‏Take your chairs back to the store room and switch off the lights."]]);

window.LISTEN_BANK = L;
})();
