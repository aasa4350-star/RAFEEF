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

/* ═══ توسيعُ ٢٠ نوفمبر ٢٠٢٦ — تسعون نصًّا ═══════════════════════
   طلبُ الأب: «ما أبي التكرار يزيد عن مرّتين … وحتى التحصيلي».
   وستّون نصًّا بسؤالَين سعتُها مئتان وأربعون عرضًا، والجلسةُ ستّةُ
   أسئلة، فأربعون جلسةً ثمّ دورةٌ جديدة. فصارت مئةً وخمسين نصًّا
   وثلاثَ مئةِ سؤالٍ — ستُّ مئةِ عرضٍ، أي مئةُ جلسةٍ قبل الدورةِ الثانية. */
S("Good morning. This is a reminder that the school bus will not stop at the corner of King Street this week. The road is being repaired, so please wait at the mosque instead. The bus will come ten minutes earlier than usual.",
 [["Where should students wait this week?",["At the mosque","At the corner of King Street","At the school gate","At the bus station"],
   "قال: please wait at the mosque instead — بدلًا من الزاوية."],
  ["What else has changed?",["The bus comes earlier","The bus comes later","There is no bus","The bus is bigger"],
   "‏ten minutes earlier than usual — أبكرَ بعشرِ دقائق."]]);

S("Hello, I bought these shoes last Thursday, but when I got home I found that one of them has a mark on the side. I still have the receipt. I would prefer another pair in the same size rather than my money back.",
 [["What is wrong with the shoes?",["One has a mark on it","They are the wrong size","They are the wrong colour","They are too expensive"],
   "‏a mark on the side — علامةٌ في الجانب."],
  ["What does the customer want?",["Another pair the same size","His money returned","A larger size","A discount"],
   "قال: another pair in the same size rather than my money back."]]);

S("Attention passengers on flight six-two-one to Dubai. Boarding will begin at gate fourteen, not gate four as printed on your ticket. Passengers travelling with small children may board first. We expect to leave on time.",
 [["Which gate should passengers use?",["Gate fourteen","Gate four","Gate six","Gate twenty-one"],
   "‏gate fourteen, not gate four — والتصحيحُ بعد «not»."],
  ["Who may board first?",["Passengers with small children","Passengers in the front rows","Passengers without luggage","Passengers over sixty"],
   "‏travelling with small children may board first. — أصحابُ الأطفالِ الصغارِ يصعدون أوّلًا."]]);

S("Thank you for calling the clinic. Doctor Salem is not available on Wednesday, but he can see you on Thursday at four, or on Saturday morning. If the pain becomes worse before then, please come to the emergency department.",
 [["When can the patient see the doctor?",["On Thursday afternoon","On Wednesday afternoon","On Friday morning","On Saturday evening"],
   "‏Thursday at four — أي بعد الظهر."],
  ["What should the patient do if the pain gets worse?",["Go to the emergency department","Wait until Saturday","Call again on Wednesday","Take more medicine"],
   "قال: please come to the emergency department."]]);

S("Excuse me, I am looking for the city library. Walk straight to the end of this street, then turn left at the bank. It is the tall grey building opposite the post office. It takes about five minutes on foot.",
 [["Where should the person turn?",["Left at the bank","Right at the bank","Left at the post office","Right at the library"],
   "‏turn left at the bank. — يسارًا عند المصرف."],
  ["What is the library opposite?",["The post office","The bank","A school","A hospital"],
   "‏opposite the post office — مقابلَ مكتبِ البريد."]]);

S("I am afraid your parcel has not arrived yet. According to our system it left the warehouse on Monday and is now in the city, but the driver could not find your address. Could you confirm the building number for me?",
 [["What is the problem with the parcel?",["The driver could not find the address","It was never sent","It was damaged","It went to another city"],
   "‏the driver could not find your address. — السائقُ لم يجد العنوان."],
  ["What does the speaker ask for?",["The building number","A new address","Payment","A signature"],
   "قال: confirm the building number."]]);

S("Welcome to the museum. Photography is allowed in the main hall but not in the room with the old manuscripts, because the light damages the paper. Bags larger than a laptop must be left at the desk near the entrance.",
 [["In which room is photography forbidden?",["In the manuscripts room","In the main hall","At the entrance","In the garden"],
   "‏not in the room with the old manuscripts. — لا في غرفةِ المخطوطات."],
  ["Why is it not allowed there?",["The light harms the paper","The room is too small","Visitors make noise","The objects are new"],
   "‏the light damages the paper. — الضوءُ يُتلِف الورق."]]);

S("Our meeting tomorrow will be shorter than planned. I have to leave at eleven for another appointment, so let us begin with the budget and leave the new website until next week. Please read the figures before you come.",
 [["Why will the meeting be shorter?",["The speaker has another appointment","The room is needed","Fewer people will come","The subject is easy"],
   "‏I have to leave at eleven for another appointment. — عنده موعدٌ آخرُ في الحاديةَ عشرة."],
  ["What will be discussed tomorrow?",["The budget","The new website","Both equally","Neither"],
   "‏begin with the budget and leave the website until next week. — الميزانيّةُ اليومَ والموقعُ الأسبوعَ القادم."]]);

S("I have been studying English for three years, but I still find listening the hardest part. Reading is easier because I can go back and look again. When people speak quickly I lose the first word and then everything after it.",
 [["Which skill does the speaker find hardest?",["Listening","Reading","Writing","Speaking"],
   "قال: I still find listening the hardest part."],
  ["Why is reading easier for the speaker?",["He can look again","It is shorter","He reads slowly","He likes the subject"],
   "‏I can go back and look again. — في القراءةِ يرجع وينظر ثانيةً."]]);

S("This is an announcement for all residents. The water will be cut off tomorrow between nine in the morning and two in the afternoon while the pipes are cleaned. Please fill a container tonight. We are sorry for the trouble.",
 [["When will the water be cut off?",["From nine until two","From two until nine","All day","Tonight"],
   "‏between nine in the morning and two in the afternoon. — من التاسعةِ صباحًا إلى الثانيةِ بعد الظهر."],
  ["What are residents advised to do?",["Fill a container tonight","Leave the building","Call the office","Boil the water"],
   "قال: please fill a container tonight."]]);

S("The restaurant is full at the moment, but a table by the window will be free in about twenty minutes. If you prefer, we have seats outside now. The kitchen closes at ten thirty, so there is still plenty of time.",
 [["What is offered immediately?",["Seats outside","A table by the window","A private room","A table upstairs"],
   "‏we have seats outside now. — مقاعدُ في الخارجِ متاحةٌ الآن."],
  ["When does the kitchen close?",["At ten thirty","At ten","At eleven","At twenty past ten"],
   "‏The kitchen closes at ten thirty. — المطبخُ يُغلِق العاشرةَ والنصف."]]);

S("Your essay was well organised and your examples were clear, but you used the same three words again and again. Next time choose different words for the same idea. Also check your last paragraph: you repeated the introduction.",
 [["What did the teacher praise?",["The organisation and examples","The vocabulary","The length","The handwriting"],
   "‏well organised and your examples were clear. — أثنى على التنظيمِ والأمثلة."],
  ["What was wrong with the last paragraph?",["It repeated the introduction","It was too short","It had no examples","It was missing"],
   "قال: you repeated the introduction."]]);

S("I would like to open an account, please. I have my identity card and a letter from my employer, but I do not have a bill with my address on it. Can I bring that tomorrow, or must I wait until I have everything?",
 [["What document is missing?",["A bill showing the address","The identity card","The employer's letter","A photograph"],
   "قال: I do not have a bill with my address on it."],
  ["What does the customer ask?",["Whether he can bring it tomorrow","Whether the account is free","How much to deposit","Where the branch is"],
   "‏Can I bring that tomorrow. — سأل: أجيءُ بها غدًا؟"]]);

S("Rain is expected from Thursday evening until Saturday morning, with strong wind on Friday. If you are travelling north, leave early: the mountain road is often closed when the wind is this strong. Sunday should be clear.",
 [["When is the wind strongest?",["On Friday","On Thursday","On Saturday","On Sunday"],
   "‏with strong wind on Friday. — الريحُ الشديدةُ يومَ الجمعة."],
  ["Why should travellers leave early?",["The mountain road may close","The traffic is heavy","Petrol stations shut","Buses stop running"],
   "‏the mountain road is often closed when the wind is this strong. — طريقُ الجبلِ يُغلَق مع هذه الريح."]]);

S("My brother and I share a room, and he studies late while I like to sleep early. We argued about it for a month until we agreed on a rule: the big light goes off at ten, and after that he uses a small lamp at his desk.",
 [["What was the disagreement about?",["When to turn off the light","Who cleans the room","The size of the room","Noise from outside"],
   "الخلافُ على وقتِ النوم والضوء."],
  ["How was it settled?",["The big light goes off at ten and he uses a lamp","The brother moved out","They stopped studying","They bought curtains"],
   "‏the big light goes off at ten, and after that he uses a small lamp. — الضوءُ الكبيرُ يُطفأ العاشرةَ ثمّ مصباحٌ صغير."]]);

S("Tickets bought online cost twenty-five, and tickets bought at the door cost thirty. Students pay half price with a valid card. The doors open at six, but the performance does not begin until seven, so come early for a good seat.",
 [["How much is a ticket at the door?",["Thirty","Twenty-five","Fifteen","Seven"],
   "‏at the door cost thirty. — على البابِ ثلاثون."],
  ["What time does the performance begin?",["At seven","At six","At half past six","At half past seven"],
   "‏the performance does not begin until seven. — العرضُ يبدأ السابعة."]]);

S("I applied for the job three weeks ago and I have not heard anything. I am calling to ask whether the position has been filled, because I have another offer and I must answer it by Sunday. I would rather work with you.",
 [["Why is the caller phoning?",["To ask whether the job is still open","To accept the job","To refuse the job","To ask about the salary"],
   "‏to ask whether the position has been filled. — يسأل: هل شُغِلت الوظيفة؟"],
  ["What is the caller's deadline?",["Sunday","Three weeks","Monday","Tomorrow"],
   "‏I must answer it by Sunday. — عليه الجوابُ قبل الأحد."]]);

S("The hotel has a room on the second floor with a view of the street, or a quieter room at the back with no view. Breakfast is included in both. If you want the quiet one, I should tell you that the lift does not reach that side.",
 [["What is the disadvantage of the quiet room?",["The lift does not reach it","It has no breakfast","It costs more","It is on the street"],
   "قال: the lift does not reach that side."],
  ["What is included in both rooms?",["Breakfast","A street view","Lift access","Parking"],
   "‏Breakfast is included in both. — الفطورُ في الغرفتَين كلتَيهما."]]);

S("Please read the question twice before you answer. Last year many students lost marks not because they did not know the material but because they answered a different question from the one on the paper. Take two minutes to plan.",
 [["Why did students lose marks last year?",["They answered the wrong question","They ran out of time","They did not study","They wrote too little"],
   "‏they answered a different question from the one on the paper. — أجابوا سؤالًا غيرَ المكتوب."],
  ["What does the speaker advise?",["Reading twice and planning","Writing quickly","Answering the easy questions first","Asking the teacher"],
   "‏read the question twice … Take two minutes to plan. — اقرأه مرّتَين وخطِّط دقيقتَين."]]);

S("I used to drive to work, but parking near the office became impossible and I was spending an hour looking for a space. Now I take the train and walk the last part. It takes the same time, but I arrive in a better mood.",
 [["Why did the speaker stop driving?",["Parking was impossible","The car broke down","The train is cheaper","The office moved"],
   "‏parking near the office became impossible. — الوقوفُ قربَ المكتبِ تعذّر."],
  ["What does the speaker say about the journey now?",["It takes the same time but he feels better","It is much faster","It is much slower","It is more expensive"],
   "‏It takes the same time, but I arrive in a better mood. — الوقتُ نفسُه والمِزاجُ أحسن."]]);

S("The library will be closed for two weeks in July while the shelves are replaced. Books borrowed in June may be kept until August without a fine. The reading room upstairs will stay open for students with examinations.",
 [["What will stay open in July?",["The reading room upstairs","The whole library","The borrowing desk","Nothing"],
   "‏The reading room upstairs will stay open. — قاعةُ المطالعةِ في الأعلى تبقى مفتوحة."],
  ["What happens to books borrowed in June?",["They may be kept until August","They must be returned in June","They are lost","A fine is charged"],
   "‏may be kept until August without a fine. — تُبقى إلى أغسطس بلا غرامة."]]);

S("Could you look at this photograph? We are trying to decide which one to put on the front page. The first one is sharper, but the second one shows the whole crowd. I think the crowd matters more than the detail here.",
 [["What is the advantage of the second photograph?",["It shows the whole crowd","It is sharper","It is in colour","It is larger"],
   "‏the second one shows the whole crowd. — الثانيةُ تُظهِر الحشدَ كلَّه."],
  ["Which does the speaker prefer?",["The second one","The first one","Neither","Both equally"],
   "‏the crowd matters more than the detail — فيُفضّل الثانية."]]);

S("I need to return this book, but I have lost the receipt. I can show you the message that came to my phone when I paid. If a receipt is necessary, I understand, but I hope the message is enough because I paid by card.",
 [["What has the customer lost?",["The receipt","The book","The card","The phone"],
   "قال: I have lost the receipt."],
  ["What can the customer show instead?",["A message on the phone","Another receipt","A bank statement","Nothing"],
   "‏the message that came to my phone when I paid. — الرسالةُ التي وصلت هاتفَه عند الدفع."]]);

S("Our team plays on Saturday at five. The pitch is the one behind the new school, not the old one near the market. Bring both shirts, because if the other team wears white we will have to change. Be there by half past four.",
 [["Which pitch will be used?",["The one behind the new school","The one near the market","The school hall","The city stadium"],
   "‏behind the new school, not the old one near the market. — خلفَ المدرسةِ الجديدةِ لا القديمة."],
  ["Why should players bring both shirts?",["In case the other team wears white","Because it may rain","Because one is too small","For the photograph"],
   "‏if the other team wears white we will have to change. — إن لبِس الخَصمُ الأبيضَ لزِم التغيير."]]);

S("The course lasts eight weeks, with one evening class and one online session each week. There is no final examination, but you must hand in four short pieces of work. Students who miss more than three classes cannot receive the certificate.",
 [["How is the course assessed?",["By four short pieces of work","By a final examination","By attendance only","By an interview"],
   "‏no final examination, but … four short pieces of work. — لا اختبارَ نهائيٌّ بل أربعةُ أعمالٍ قصيرة."],
  ["How many classes may a student miss?",["Three","Four","Eight","None"],
   "‏more than three classes — فثلاثٌ هي الحدّ."]]);

S("I am sorry, the price on the shelf was not changed after the offer ended last week. The correct price is forty. I understand that is annoying, and since the mistake was ours I will give you the lower price this time.",
 [["Why was the price on the shelf wrong?",["The offer had ended and the label was not changed","The product was new","The customer misread it","The system failed"],
   "‏the price on the shelf was not changed after the offer ended. — السعرُ لم يُحدَّث بعد انتهاءِ العرض."],
  ["What will the customer pay?",["The lower price","Forty","Nothing","Double"],
   "‏I will give you the lower price this time. — سيُعطيه السعرَ الأقلَّ هذه المرّة."]]);

S("Before you use the machine, read the sticker on the side. It must be switched off at the wall before you open the top, and the filter has to be dry. Most of the problems we are called about come from a wet filter.",
 [["What must be done before opening the top?",["Switch it off at the wall","Remove the filter","Fill it with water","Read the manual"],
   "‏It must be switched off at the wall before you open the top. — يُفصَل من الحائطِ قبل فتحِ الغطاء."],
  ["What causes most problems?",["A wet filter","A broken switch","Too much use","Old stickers"],
   "‏Most of the problems … come from a wet filter. — أكثرُ الأعطالِ من مُرشِّحٍ رطب."]]);

S("My grandfather left school at twelve and taught himself to read the newspaper. He used to say that the hardest part was not the words but believing that a man his age could still learn. He read every day until he was eighty.",
 [["What did the grandfather teach himself?",["To read the newspaper","To write letters","A second language","Mathematics"],
   "‏taught himself to read the newspaper. — علّم نفسَه قراءةَ الصحيفة."],
  ["What did he find hardest?",["Believing he could still learn","The long words","Finding newspapers","His poor eyesight"],
   "قال: not the words but believing that a man his age could still learn."]]);

S("Please note that the lecture has moved to the hall on the ground floor because more students registered than expected. The slides will be online on Sunday, but the examples we do together in class will not be, so come if you can.",
 [["Why did the lecture move?",["More students registered than expected","The room was damaged","The lecturer changed","It was too noisy"],
   "‏more students registered than expected. — المسجّلون أكثرُ من المتوقَّع."],
  ["What will not be online?",["The examples done in class","The slides","The reading list","The timetable"],
   "‏the examples we do together in class will not be. — أمثلةُ الصفِّ لن تُنشَر."]]);

S("I ordered the blue one, and the one that came is black. I do not mind the colour very much, but I bought it as a gift and the person asked for blue. Can you send the blue one and collect this at the same time?",
 [["What is the problem with the order?",["The colour is wrong","The size is wrong","It arrived late","It is damaged"],
   "‏I ordered the blue one, and the one that came is black. — طلب الأزرقَ فجاءه الأسود."],
  ["What does the speaker ask the shop to do?",["An exchange at the same visit","A refund","A discount","An apology"],
   "‏send the blue one and collect this at the same time. — تبديلٌ في الزيارةِ نفسِها."]]);

S("The train to the airport leaves from platform three every twenty minutes. It is faster than the bus and the ticket costs the same, but there is no space for very large suitcases, so take the bus if you are carrying one.",
 [["Why might someone choose the bus?",["To carry a very large suitcase","Because it is faster","Because it is cheaper","Because it is more frequent"],
   "‏no space for very large suitcases, so take the bus if you are carrying one. — لا مكانَ للحقائبِ الكبيرةِ فالباصُ أولى."],
  ["How often does the train run?",["Every twenty minutes","Every three minutes","Every hour","Twice a day"],
   "‏every twenty minutes. — كلَّ عشرين دقيقة."]]);

S("I have marked the test papers. The average was better than last time, and nobody failed. However, almost everyone lost marks on question seven, so we will go through that question together before we start the new chapter.",
 [["What will the class do next?",["Go through question seven","Start the new chapter at once","Take the test again","Correct each other's papers"],
   "‏we will go through that question together before we start the new chapter. — سؤالُ سبعةٍ قبل الفصلِ الجديد."],
  ["What does the teacher say about the results?",["Better than last time, with no failures","Worse than last time","The same as last time","Only a few passed"],
   "‏The average was better than last time, and nobody failed. — المعدّلُ أحسنُ ولا راسبَ فيهم."]]);

S("Excuse me, is this seat taken? I have a ticket for seat fourteen but someone is sitting in it, and he says his ticket also says fourteen. I think one of us has yesterday's date. Could you check them both, please?",
 [["What is the problem on the train?",["Two passengers have the same seat number","The seat is broken","The passenger lost his ticket","The train is full"],
   "‏his ticket also says fourteen. — تذكرتُه أيضًا أربعةَ عشر — مقعدٌ واحدٌ لاثنَين."],
  ["What does the passenger suspect?",["One ticket is for the wrong day","The other man is lying","The seat number is missing","The train changed"],
   "‏one of us has yesterday's date. — يُرجّح أنّ إحدى التذكرتَين بتاريخِ أمس."]]);

S("The shop opens at nine, but deliveries arrive at seven, so somebody must be here early. We take turns: one week each. If you cannot come on your week, swap with someone and tell me, and do not simply leave the door locked.",
 [["How is the early duty arranged?",["Each person takes a week in turn","The manager always comes","Nobody comes early","Two people come together"],
   "‏We take turns: one week each. — بالتناوبِ أسبوعًا لكلِّ واحد."],
  ["What must someone do if they cannot come?",["Swap and tell the speaker","Stay at home","Call the delivery driver","Open the shop late"],
   "‏swap with someone and tell me. — يُبادِل غيرَه ويُخبِر المسؤول."]]);

S("I enjoyed the film, but it was half an hour too long. The first part was excellent and I forgot I was watching a screen, then the story stopped moving and the same point was made three times. The ending was worth waiting for.",
 [["What did the speaker dislike?",["The middle, where the story stopped moving","The beginning","The ending","The sound"],
   "‏the story stopped moving and the same point was made three times. — الوسطُ توقّفت فيه الحكايةُ وأُعيدت الفكرةُ ثلاثًا."],
  ["What does the speaker say about the ending?",["It was worth waiting for","It was disappointing","It was too quick","It was confusing"],
   "‏The ending was worth waiting for. — النهايةُ استحقّت الانتظار."]]);

S("Do not put the medicine in the kitchen cupboard above the cooker: heat makes it weaker. Keep it somewhere cool and dark, and check the date on the box every few months. Anything older than the date should be taken to the pharmacy.",
 [["Why is the cupboard above the cooker unsuitable?",["Heat weakens the medicine","It is too high","It is too dark","Children can reach it"],
   "‏heat makes it weaker. — الحرارةُ تُضعِف الدواء."],
  ["What should be done with old medicine?",["Take it to the pharmacy","Throw it in the bin","Keep it for later","Give it away"],
   "‏should be taken to the pharmacy. — يُردُّ إلى الصيدليّة."]]);

S("The new system saves time once you learn it, but the first week is slower than the old way. Nearly everyone who complained in the first week stopped complaining by the third. Please be patient and write down what confuses you.",
 [["What does the speaker say about the first week?",["It is slower than the old way","It is faster","It is the same","It is the easiest"],
   "‏the first week is slower than the old way. — الأسبوعُ الأوّلُ أبطأُ من القديم."],
  ["What does the speaker ask people to do?",["Be patient and note what confuses them","Return to the old system","Work longer hours","Train each other"],
   "‏be patient and write down what confuses you. — الصبرُ وتدوينُ ما يُلبِس."]]);

S("My flight was cancelled and the next one was full, so I took a train instead and arrived six hours late. The airline paid for the train, which I did not expect. I was angry at the airport and much less angry by the evening.",
 [["How did the speaker finally travel?",["By train","By a later flight","By car","By bus"],
   "‏I took a train instead. — رَكِب القطارَ بدلًا من الطائرة."],
  ["What surprised the speaker?",["The airline paid for the train","The train was empty","The flight left on time","Nobody apologised"],
   "‏The airline paid for the train, which I did not expect. — الشركةُ دفعت ثمنَ القطارِ وهو لم يتوقّع ذلك."]]);

S("If you are new to the gym, start with twenty minutes and add five minutes a week. People who begin with an hour usually stop within a month. The exercise you keep doing is worth more than the exercise you do perfectly once.",
 [["What is advised for beginners?",["Twenty minutes, adding five a week","A full hour from the start","Three hours a week","Nothing for the first month"],
   "‏start with twenty minutes and add five minutes a week. — عشرون دقيقةً ثمّ خمسٌ كلَّ أسبوع."],
  ["What is the speaker's main point?",["Continuing matters more than doing it perfectly once","Short exercise is useless","Beginners should rest","The gym is too expensive"],
   "‏The exercise you keep doing is worth more than the exercise you do perfectly once. — الدوامُ على القليلِ خيرٌ من كمالٍ مرّةً واحدة."]]);

S("I am sorry to say the position has been given to someone else. Your interview was strong and the committee discussed you for a long time. If a similar job opens here in the next few months, I would like to call you first.",
 [["What is the news?",["Someone else was given the job","The job is still open","The interview must be repeated","The job was cancelled"],
   "‏the position has been given to someone else. — الوظيفةُ أُعطِيت غيرَه."],
  ["What does the speaker offer?",["To call first about a similar job","A different job now","Advice on interviews","Money for travel"],
   "‏I would like to call you first. — يَعِد بأن يتّصل به أوّلًا إن فُتِح مثلُها."]]);

S("Please remember to bring your own water bottle on the trip. There is a tap at the site but nothing is sold there, and the walk from the car park takes half an hour in the sun. Wear a hat and comfortable shoes.",
 [["What is available at the site?",["A tap","A shop","A restaurant","Nothing"],
   "‏There is a tap at the site but nothing is sold there. — حَنفيّةٌ موجودةٌ ولا بيعَ هناك."],
  ["How long is the walk from the car park?",["Half an hour","Ten minutes","An hour","Five minutes"],
   "‏takes half an hour in the sun. — نصفُ ساعةٍ في الشمس."]]);

S("The engine noise you described is probably the belt, not the gearbox. The belt is cheap and we can change it today. If the noise continues afterwards, bring the car back and we will look at the gearbox without charging you again.",
 [["What does the mechanic think is wrong?",["The belt","The gearbox","The engine itself","The brakes"],
   "‏probably the belt, not the gearbox. — الحزامُ لا ناقلُ الحركة."],
  ["What happens if the noise continues?",["They will check the gearbox at no extra charge","The customer must pay again","The car will be replaced","Nothing can be done"],
   "‏we will look at the gearbox without charging you again. — يُفحَص ناقلُ الحركةِ بلا أجرٍ ثانٍ."]]);

S("I learned more from the month I spent helping in my uncle's shop than from a year of reading about business. Nobody explained anything; I watched what happened when a customer was unhappy, and I remembered it because it mattered.",
 [["Where did the speaker learn most?",["In the uncle's shop","From books","At school","From a course"],
   "‏I learned more from the month I spent helping in my uncle's shop. — شهرٌ في دكّانِ عمِّه أنفعُ من سنةِ قراءة."],
  ["Why does the speaker remember the lessons?",["Because they mattered at the time","Because they were written down","Because they were repeated","Because they were simple"],
   "‏I remembered it because it mattered. — ثبت في ذهنِه لأنّه كان ذا أثر."]]);

S("Our office will move to the fourth floor at the end of the month. The lift is often slow in the morning, so the stairs may be quicker. The new space is smaller, which means we will share desks and book a desk the day before.",
 [["What is the disadvantage of the new office?",["It is smaller, so desks are shared","It has no lift","It is further away","It is on the ground floor"],
   "‏The new space is smaller, which means we will share desks. — المكانُ أصغرُ فتُشترَك المكاتب."],
  ["How will desks be arranged?",["Booked the day before","First to arrive","By seniority","Not at all"],
   "‏book a desk the day before. — يُحجَز المكتبُ قبلَه بيوم."]]);

S("The recipe says thirty minutes, but in my oven it needs forty. Every oven is different, so look at the colour rather than the clock. When a knife comes out clean it is ready, and five minutes more will not improve it.",
 [["What does the speaker advise watching?",["The colour rather than the clock","The clock only","The temperature","The recipe exactly"],
   "‏look at the colour rather than the clock. — اللونُ لا الساعة."],
  ["How can you tell it is ready?",["A knife comes out clean","It smells sweet","Thirty minutes have passed","It stops rising"],
   "‏When a knife comes out clean it is ready. — إذا خرجت السكّينُ نظيفةً فقد استوى."]]);

S("You may use a dictionary in the first part of the examination but not in the second. Phones must be switched off, not silent, and left in your bag at the front of the room. You will have ten minutes to read before you write.",
 [["When is a dictionary allowed?",["In the first part only","In the second part only","Throughout","Never"],
   "‏in the first part … but not in the second. — في الجزءِ الأوّلِ وحدَه."],
  ["What must be done with phones?",["Switched off and left at the front","Set to silent","Kept in a pocket","Given to the teacher"],
   "‏switched off, not silent, and left in your bag at the front. — مُطفأةٌ لا صامتةٌ وفي الحقيبةِ أمامًا."]]);

S("I have been teaching this class for six years and the question I am asked most often is whether grammar matters. It matters less than people fear and more than they hope: nobody fails for one mistake, and nobody passes with fifty.",
 [["What question is the speaker asked most?",["Whether grammar matters","How long the course is","How to pass","Which book to buy"],
   "‏whether grammar matters. — هل للقواعدِ أثرٌ؟"],
  ["What is the speaker's answer?",["Less than feared but more than hoped","It does not matter","It is the only thing that matters","It depends on the teacher"],
   "‏It matters less than people fear and more than they hope. — أقلُّ مـمّا يخافون وأكثرُ مـمّا يرجون."]]);

S("The parcel locker is behind the supermarket. You will get a code by message; type it on the screen and the door opens. If the locker is full the driver leaves the parcel at the desk inside instead, and the message will say so.",
 [["How is the locker opened?",["By typing a code from a message","With a key","By the driver","With a card"],
   "‏You will get a code by message; type it on the screen. — رمزٌ في رسالةٍ يُكتَب على الشاشة."],
  ["What happens if the locker is full?",["The parcel is left at the desk inside","It is returned","It is delivered home","It waits a day"],
   "‏the driver leaves the parcel at the desk inside. — يُترَك الطلبُ عند المكتبِ في الداخل."]]);

S("I asked for a window seat and got one, but I did not think about the wing. I could see nothing for four hours except metal. Next time I will choose a row in front of it, even if it costs a little more.",
 [["What was the problem with the seat?",["The wing blocked the view","It was by the aisle","It did not recline","It was at the back"],
   "‏I could see nothing … except metal — الجناحُ حجب المنظر."],
  ["What will the speaker do next time?",["Choose a row in front of the wing","Choose an aisle seat","Not take a window seat","Fly at night"],
   "‏choose a row in front of it. — صفًّا أمامَ الجناح."]]);

S("Our class is collecting books for the hospital. They must be in good condition and suitable for children, and please do not bring textbooks: the hospital asked for stories. The box is outside the staff room until Thursday.",
 [["What kind of books are wanted?",["Children's stories in good condition","Textbooks","Any books at all","Books in English only"],
   "‏suitable for children … the hospital asked for stories. — قصصٌ للأطفالِ لا كتبًا دراسيّة."],
  ["Where should books be left?",["Outside the staff room","At the hospital","In the library","With the teacher"],
   "‏The box is outside the staff room. — الصندوقُ خارجَ غرفةِ المعلّمين."]]);

S("The bill includes service, so there is no need to add anything. If you would like to pay separately, tell us before we bring the machine, because afterwards we have to cancel the whole amount and start again.",
 [["What does the bill include?",["Service","A discount","Delivery","Tax only"],
   "‏The bill includes service. — الفاتورةُ فيها الخِدمة."],
  ["When should separate payment be mentioned?",["Before the machine is brought","After paying","At the beginning of the meal","It cannot be done"],
   "‏tell us before we bring the machine. — يُقال قبل إحضارِ جهازِ الدفع."]]);

S("I signed up for the morning session because I thought I would be fresher, but I am not a morning person and I spent the first hour half asleep. I have moved to the evening group and I am learning twice as fast.",
 [["Why did the speaker choose the morning?",["Expecting to be fresher","It was cheaper","It was the only one","A friend was in it"],
   "‏I thought I would be fresher. — ظنّ أنّه أنشطُ في الصباح."],
  ["What was the result of moving?",["Learning twice as fast","No difference","Missing more classes","Learning more slowly"],
   "‏I am learning twice as fast. — صار تعلّمُه ضِعفَ ما كان."]]);

S("Please do not reply to the message you received this morning asking for your password. It did not come from us. We never ask for a password by message, and anyone who does is not from this company, whatever the address looks like.",
 [["What should people not do?",["Reply with their password","Change their password","Open the company website","Call the office"],
   "‏do not reply to the message … asking for your password. — لا يُجاب من يطلب كلمةَ السِّرّ."],
  ["What does the company say about passwords?",["They never ask for one by message","They ask once a year","They ask only by phone","They ask in writing"],
   "‏We never ask for a password by message. — الشركةُ لا تطلبها برسالةٍ أبدًا."]]);

S("The road will be one lane each way for six weeks. Journeys at eight in the morning may take twice as long, but after ten the delay is small. If you can start work later for these weeks, this is the time to ask.",
 [["When is the delay worst?",["At eight in the morning","After ten","In the evening","At night"],
   "‏at eight in the morning may take twice as long. — الثامنةُ صباحًا الضِّعف."],
  ["What does the speaker suggest drivers do?",["Asking to start work later","Using another road","Walking","Working from home always"],
   "‏If you can start work later for these weeks, this is the time to ask. — يُطلَب تأخيرُ بدايةِ الدوامِ هذه الأسابيع."]]);

S("I kept a list of every word I looked up, and after two months I noticed that I had looked up the same forty words again and again. I made cards for those forty and the problem disappeared. The list was more useful than the dictionary.",
 [["What did the list reveal?",["The same forty words were looked up repeatedly","The dictionary was wrong","Reading was too hard","Vocabulary was easy"],
   "‏I had looked up the same forty words again and again. — أربعون كلمةً يرجع إليها دائمًا."],
  ["What did the speaker do about it?",["Made cards for those forty words","Bought a better dictionary","Stopped looking words up","Read easier books"],
   "‏I made cards for those forty. — صنع بطاقاتٍ لتلك الأربعين."]]);

S("Visitors must sign in at reception and wear the badge where it can be seen. If you leave the building during the day, sign out and in again, even for a few minutes: in an emergency the list is what tells us who is inside.",
 [["What must visitors do with the badge?",["Wear it visibly","Keep it in a pocket","Return it at lunch","Show it only once"],
   "‏wear the badge where it can be seen. — البطاقةُ ظاهرةٌ لا مخفيّة."],
  ["Why must visitors sign out and in?",["The list shows who is inside in an emergency","To record working hours","To collect post","For the car park"],
   "‏in an emergency the list is what tells us who is inside. — في الطوارئِ القائمةُ تُبيّن مَن في المبنى."]]);

S("My neighbour knocked on the door at midnight to say my car lights were on. I had been in a hurry and forgotten them. If he had not come, the battery would have been flat in the morning and I would have missed an interview.",
 [["Why did the neighbour knock?",["The car lights were left on","The car was blocking the road","There was a noise","To borrow something"],
   "‏my car lights were on. — أنوارُ سيّارتِه مُشعَلة."],
  ["What would have happened otherwise?",["A flat battery and a missed interview","A fine","A stolen car","Nothing"],
   "‏the battery would have been flat … I would have missed an interview. — لفَرَغت البطّاريّةُ وفاتته المقابلة."]]);

S("The course fee can be paid in three parts, but the first part must be paid before the first class. If you stop attending after the second month there is no refund, so please be sure you can give the time before you start.",
 [["When is the first payment due?",["Before the first class","After the first month","At the end","In three parts throughout"],
   "‏the first part must be paid before the first class. — القِسطُ الأوّلُ قبل الحصّةِ الأولى."],
  ["What happens if someone leaves after two months?",["No money is returned","Half is returned","All is returned","The place is held"],
   "‏there is no refund. — لا تُردُّ النقود."]]);

S("I used to think a good presentation needed many slides. Then I watched a colleague speak for ten minutes with one picture and hold everyone's attention. The slides were never the point: I was using them to avoid preparing properly.",
 [["What changed the speaker's view?",["A colleague who used one picture","A book on presenting","A failed presentation","A training course"],
   "‏I watched a colleague speak for ten minutes with one picture. — زميلٌ تكلّم عشرَ دقائقَ بصورةٍ واحدة."],
  ["What does the speaker admit?",["Slides were a way to avoid preparing","Slides are always wrong","He cannot speak well","Pictures are better than words"],
   "‏I was using them to avoid preparing properly. — كانت الشرائحُ هربًا من الإعدادِ الجيّد."]]);

S("Please note the clinic no longer takes appointments by message. Call between eight and eleven, or use the website at any hour. If you have had an appointment with us in the last year, the website will already know your details.",
 [["How can an appointment be made?",["By phone in the morning or online any time","By message only","In person only","By letter"],
   "‏Call between eight and eleven, or use the website at any hour. — هاتفًا من الثامنةِ إلى الحاديةَ عشرةَ أو بالموقعِ أيَّ وقت."],
  ["Who already has details on the website?",["Patients seen in the last year","New patients","Nobody","Patients over sixty"],
   "‏had an appointment with us in the last year. — مَن زارهم في السنةِ الماضية."]]);

S("The examination hall has no clock, so wear a watch. There will be an announcement when thirty minutes remain and again at ten. Do not ask the invigilators the time: they are told not to answer, and it wastes your minutes.",
 [["How will students know the time?",["By their own watch and two announcements","From a clock in the hall","By asking the invigilators","They will not know"],
   "لا ساعةَ في القاعة، فساعةُ اليد وإعلانان."],
  ["When is the second announcement?",["When ten minutes remain","When thirty minutes remain","At the start","At the end"],
   "‏again at ten — عند بقاءِ عشرِ دقائق."]]);

S("I have looked at your application. The qualifications are fine, but you have left the second page empty, and we cannot process it without the dates of your previous jobs. Send that page and I will put it in this week's group.",
 [["What is wrong with the application?",["The second page is empty","The qualifications are not enough","It arrived late","The name is missing"],
   "‏you have left the second page empty. — الصفحةُ الثانيةُ فارغة."],
  ["What will happen when it is complete?",["It joins this week's group","It is sent back","It waits a month","It is refused"],
   "‏I will put it in this week's group. — تُضَمُّ إلى دفعةِ هذا الأسبوع."]]);

S("We close at eight, but the kitchen takes its last order at half past seven. If you arrive after that we can still serve cold dishes and drinks. On Fridays the kitchen works until nine because the market stays open late.",
 [["When is the last hot order taken on a normal day?",["At half past seven","At eight","At seven","At nine"],
   "‏the kitchen takes its last order at half past seven. — آخرُ طلبٍ ساخنٍ السابعةَ والنصف."],
  ["Why is Friday different?",["The market stays open late","More staff work","It is a holiday","The kitchen is cleaned"],
   "‏because the market stays open late. — لأنّ السوقَ يتأخّر في الإغلاق."]]);

S("I thought the problem was my pronunciation, but my teacher recorded me and we listened together. The sounds were fine; I was speaking so quietly that half the words disappeared. Now I practise standing up, and people understand me.",
 [["What did the recording reveal?",["The speaker was too quiet","The pronunciation was poor","The grammar was wrong","The speed was too fast"],
   "‏I was speaking so quietly that half the words disappeared. — صوتُه خفيضٌ فذهب نصفُ الكلمات."],
  ["What does the speaker do now?",["Practises standing up","Speaks more slowly","Uses a microphone","Writes before speaking"],
   "‏Now I practise standing up. — صار يتدرّب واقفًا."]]);

S("The bus pass costs ninety for a month or nine hundred for a year. If you travel every working day the year pass saves two months. If you travel three days a week it is cheaper to buy single tickets, so count before you choose.",
 [["How much does the year pass save a daily traveller?",["The cost of two months","Nothing","Half the price","One month"],
   "‏the year pass saves two months. — اشتراكُ السنةِ يوفّر شهرَين."],
  ["What is advised for someone travelling three days a week?",["Buying single tickets","The year pass","The month pass","Walking"],
   "‏it is cheaper to buy single tickets. — التذاكرُ المفردةُ أرخصُ لثلاثةِ أيّام."]]);

S("Thank you all for coming early. Two things before we begin: the fire door at the back must stay clear, and the recording will be shared with the group who could not attend, so please say your name before you ask a question.",
 [["Why should people say their name?",["The session is being recorded for others","To register attendance","For the fire list","For the certificate"],
   "‏the recording will be shared … so please say your name. — التسجيلُ يُرسَل للغائبين فيُذكَر الاسم."],
  ["What must stay clear?",["The fire door at the back","The front row","The corridor","The car park"],
   "‏the fire door at the back must stay clear. — بابُ الحريقِ في الخلفِ يبقى خاليًا."]]);

S("My daughter refused to read anything for two years. Then she found a book about horses in a friend's house and finished it in three days. The subject was what mattered, not the reading. I had been buying her the wrong books.",
 [["What changed the daughter's attitude?",["A book on a subject she loved","A new teacher","A reading course","A reward"],
   "‏she found a book about horses … finished it in three days. — كتابٌ عن الخيلِ أتمّته في ثلاثةِ أيّام."],
  ["What does the parent conclude?",["The subject mattered, not the reading itself","Reading cannot be taught","Children should choose nothing","Books are too expensive"],
   "‏The subject was what mattered, not the reading. — الموضوعُ هو المهمُّ لا القراءةُ نفسُها."]]);

S("If the machine shows a red light, do not press the button again. Wait thirty seconds and the light turns green by itself. Pressing twice sends two orders, and we have had people charged for two coffees they did not want.",
 [["What should be done when the light is red?",["Wait thirty seconds","Press the button again","Call for help","Switch it off"],
   "‏Wait thirty seconds and the light turns green by itself. — ثلاثون ثانيةً ويخضَرُّ من نفسِه."],
  ["What happens if the button is pressed twice?",["Two orders are sent","Nothing happens","The machine stops","The money is returned"],
   "‏Pressing twice sends two orders. — ضغطتان طلبان."]]);

S("The hotel is two streets from the beach, not on it, which is why it costs less. The walk takes four minutes. The rooms at the front are noisy until about eleven because of the restaurants, so ask for the back if you sleep early.",
 [["Why is the hotel cheaper?",["It is not directly on the beach","It is old","It has no breakfast","It is small"],
   "‏two streets from the beach, not on it, which is why it costs less. — شارعان عن الشاطئِ فرَخُص."],
  ["Who should ask for a room at the back?",["People who sleep early","Families","People with cars","Long-stay guests"],
   "‏ask for the back if you sleep early. — الخلفُ لمن ينام مبكّرًا."]]);

S("I was told the report had to be ten pages. I wrote ten pages and my manager asked me to cut it to four. She said nobody had ever read past the second page, and the length was a habit rather than a rule. The four-page version was better.",
 [["What did the manager ask for?",["A four-page version","A longer report","More examples","A different subject"],
   "‏asked me to cut it to four. — طلبت تقليصَه إلى أربع."],
  ["What was the manager's reason?",["Nobody read past the second page","The printer was broken","Paper was expensive","The deadline was near"],
   "‏nobody had ever read past the second page. — لا أحدَ قرأ بعد الصفحةِ الثانية."]]);

S("All students taking the examination abroad must bring the original of their identity document, not a copy, and the printed confirmation. Candidates without both are turned away at the door, and the fee is not returned.",
 [["What must candidates bring?",["The original document and the printed confirmation","A copy of the document","Only the confirmation","A photograph"],
   "‏the original … not a copy, and the printed confirmation. — الأصلُ لا الصورةُ مع التأكيدِ المطبوع."],
  ["What happens to candidates who lack them?",["They are turned away and lose the fee","They sit the test later","They pay again","They are allowed in"],
   "‏turned away at the door, and the fee is not returned. — يُمنَع ولا تُردُّ الرسوم."]]);

S("The leak is coming from the flat above, not from your pipes. I can stop the water at the main tap, but somebody must speak to your neighbour before the ceiling is repaired, or it will happen again in a month.",
 [["Where is the leak coming from?",["The flat above","The speaker's pipes","The roof","The main tap"],
   "‏from the flat above, not from your pipes. — من الشقّةِ العُلويّةِ لا من أنابيبِه."],
  ["What must happen before the repair?",["Someone must speak to the neighbour","The flat must be emptied","New pipes must be bought","The water must be tested"],
   "‏somebody must speak to your neighbour before the ceiling is repaired. — يُكلَّم الجارُ قبل إصلاحِ السقف."]]);

S("I used to answer messages the moment they arrived, and I felt busy all day without finishing anything. Now I look at them three times: morning, after lunch and before I leave. People wait two hours and nobody has complained.",
 [["What did the speaker change?",["Checking messages three set times a day","Answering faster","Ignoring messages","Working longer"],
   "‏Now I look at them three times. — ثلاثُ مرّاتٍ في اليوم: صباحًا وبعد الغداءِ وقبل الخروج."],
  ["What was the result?",["Nobody complained about waiting","People complained a lot","Work took longer","Messages increased"],
   "‏People wait two hours and nobody has complained. — ينتظرون ساعتَين ولم يشتكِ أحد."]]);

S("The gate code changes on the first of every month, and the new one is put on the notice board three days before. If you forget it, the guard will let you in during the day but not after ten at night, so write it down.",
 [["Where is the new code announced?",["On the notice board","By message","At the gate","By the guard"],
   "‏put on the notice board three days before. — في لوحةِ الإعلاناتِ قبلَه بثلاثةِ أيّام."],
  ["When will the guard not help?",["After ten at night","During the day","At weekends","In the morning"],
   "‏not after ten at night. — لا بعد العاشرةِ ليلًا."]]);

S("The temperature will reach forty-three tomorrow, the highest this year. Outdoor work should stop between eleven and four. Drink before you feel thirsty: by the time you are thirsty your body has already lost too much.",
 [["When should outdoor work stop?",["Between eleven and four","All day","Between four and eleven","Only at noon"],
   "‏between eleven and four. — بين الحاديةَ عشرةَ والرابعة."],
  ["What is the advice about drinking?",["Drink before feeling thirsty","Drink only when thirsty","Drink cold water only","Drink after work"],
   "‏Drink before you feel thirsty. — اشرب قبل أن تعطَش."]]);

S("I marked the same mistake in your work four times this term, and I realised I was writing the correction but never explaining the rule. That was my fault. Today we will spend the whole lesson on it and you will teach it back to me.",
 [["What does the teacher admit?",["Correcting without explaining the rule","Marking too harshly","Forgetting the lesson","Teaching too fast"],
   "‏I was writing the correction but never explaining the rule. — كان يُصحّح ولا يشرح القاعدة."],
  ["What will the students do today?",["Spend the lesson on it and teach it back","Take a test","Write a new essay","Read silently"],
   "‏you will teach it back to me. — يشرحونها له هم."]]);

S("Please take the lift to the third floor and turn right. The waiting area is on the left and the nurse will call you by number, not by name. If your number is called and you have stepped out, you go to the end of the list.",
 [["How are patients called?",["By number","By name","In order of arrival","By the doctor"],
   "‏call you by number, not by name. — بالرقمِ لا بالاسم."],
  ["What happens if a patient is absent when called?",["They go to the end of the list","They are called again","They lose the appointment","They are seen first"],
   "‏you go to the end of the list. — يُؤخَّر إلى آخرِ القائمة."]]);

S("The first time I spoke English on the phone I understood nothing and I put the phone down. The second time I said one sentence: please speak more slowly. It worked immediately, and I wished somebody had told me years earlier.",
 [["What did the speaker do the first time?",["Ended the call","Asked for help","Spoke slowly","Wrote everything down"],
   "‏I put the phone down. — أغلق المكالمةَ أوّلَ مرّة."],
  ["What sentence helped?",["Please speak more slowly","I do not understand","Call me later","Say that again"],
   "‏please speak more slowly. — جملةٌ واحدةٌ: تكلّم أبطأَ، فنفعت."]]);

S("The books on the top two shelves may not be taken out of the room. You may photograph a page for study but not a whole chapter. The photocopier is for staff only, and the machine downstairs takes cards rather than coins.",
 [["Which books may not be borrowed?",["Those on the top two shelves","All of them","The new ones","Those in English"],
   "‏The books on the top two shelves may not be taken out. — كتبُ الرفَّين الأعلَيَين لا تُستعار."],
  ["What does the machine downstairs accept?",["Cards","Coins","Notes","Nothing"],
   "‏takes cards rather than coins. — بالبطاقةِ لا بالنقدِ المعدنيّ."]]);

S("I have reduced the price twice and nobody has called. My brother says the photographs are the problem: they were taken in the evening and the rooms look dark. I am going to take new ones in the morning before I lower it again.",
 [["What does the brother blame?",["The photographs","The price","The location","The season"],
   "‏the photographs are the problem. — الصورُ هي العلّةُ عند أخيه."],
  ["What will the speaker do next?",["Take new photographs in the morning","Reduce the price again at once","Stop selling","Change agent"],
   "‏take new ones in the morning before I lower it again. — صورٌ جديدةٌ صباحًا قبل تخفيضٍ آخر."]]);

S("Students who finish early may leave, but once you leave you cannot return, and you must hand in everything including the question paper. Those who stay should sit quietly: the last twenty minutes are when careless mistakes are found.",
 [["What must a student who leaves hand in?",["Everything, including the question paper","Only the answers","Only the question paper","Nothing"],
   "‏hand in everything including the question paper. — يُسلَّم كلُّ شيءٍ وورقةُ الأسئلةِ معه."],
  ["Why does the speaker value the last twenty minutes?",["Careless mistakes are found then","The hall is quietest","Marks are doubled","Answers are given"],
   "‏the last twenty minutes are when careless mistakes are found. — في العشرين الأخيرةِ تُكتشَف أخطاءُ السهو."]]);

S("We received your complaint about the noise. The work is licensed until the end of next month and we cannot stop it, but the licence does not allow it before seven in the morning. If it starts earlier, note the time and call us.",
 [["Can the work be stopped?",["No, it is licensed until next month","Yes, immediately","Only at weekends","Only at night"],
   "‏we cannot stop it. — العملُ مُرخَّصٌ فلا يُوقَف."],
  ["What should the resident do if work starts before seven?",["Note the time and call","Speak to the workers","Write a letter","Nothing can be done"],
   "‏note the time and call us. — يُدوَّن الوقتُ ويُتَّصَل."]]);

S("My first job interview went badly because I had prepared answers and the questions were different. The second time I prepared three stories instead and used whichever fitted. Stories are flexible; memorised answers are not.",
 [["Why did the first interview go badly?",["The prepared answers did not fit the questions","The speaker arrived late","The job was wrong","The interviewer was unkind"],
   "‏I had prepared answers and the questions were different. — حفَظ أجوبةً فجاءت أسئلةٌ غيرُها."],
  ["What did the speaker prepare the second time?",["Three stories to adapt","Ten answers","Nothing","A written list"],
   "‏I prepared three stories instead and used whichever fitted. — ثلاثُ حكاياتٍ يُنتقى منها ما يناسب."]]);

S("The address is the same but the entrance has moved to the side street because of the building work. There is a small sign, but people walk past it, so look for the blue door beside the bakery. We are on the first floor.",
 [["Where is the entrance now?",["On the side street, beside the bakery","At the front as before","Behind the building","On the first floor"],
   "‏the entrance has moved to the side street … the blue door beside the bakery. — البابُ الأزرقُ في الشارعِ الجانبيِّ جانبَ المخبز."],
  ["Why do people miss it?",["The sign is small","There is no sign","It is closed","It is dark"],
   "‏There is a small sign, but people walk past it. — اللوحةُ صغيرةٌ فيمرُّ الناسُ عنها."]]);

S("We are looking for someone who can work two evenings and one weekend day. Experience is useful but we will train the right person. What we cannot train is turning up on time, so please do not apply if the hours are difficult for you.",
 [["What will the employer train?",["The work itself, for the right person","Timekeeping","Nothing","Only experienced staff"],
   "‏we will train the right person. — يُدرَّب المناسبُ على العمل."],
  ["What is the employer unwilling to overlook?",["Not arriving on time","Lack of experience","Lack of qualifications","Age"],
   "‏What we cannot train is turning up on time. — الالتزامُ بالوقتِ لا يُدرَّب."]]);

S("I planned to revise everything twice. After a week I saw that there was not enough time, so I chose the four topics that carry the most marks and left the rest. I scored higher than the year I tried to cover all of it.",
 [["What was the original plan?",["To revise everything twice","To revise four topics","To study with a friend","To take a course"],
   "‏I planned to revise everything twice. — كانت الخطّةُ مراجعةَ كلِّ شيءٍ مرّتَين."],
  ["What was the result of the change?",["A higher score than before","A lower score","The same score","The exam was missed"],
   "‏I scored higher than the year I tried to cover all of it. — درجتُه أعلى من سنةِ المراجعةِ الشاملة."]]);

S("The train is running twelve minutes late because of a signal fault further down the line. Passengers changing at the junction should not worry: the connecting service has been told to wait. Those going to the end of the line are not affected.",
 [["Why is the train late?",["A signal fault down the line","Bad weather","Too many passengers","A broken engine"],
   "‏because of a signal fault further down the line. — عطبٌ في الإشارةِ أبعدَ في الخطّ."],
  ["What has been arranged for passengers changing trains?",["The connecting service will wait","A bus will be provided","Tickets will be refunded","They must take a later train"],
   "‏the connecting service has been told to wait. — القطارُ الموصِّلُ أُمِر بالانتظار."]]);

S("If you cannot attend, tell us at least two days before and we will offer your place to someone on the waiting list. People who simply do not come are not given a place next term, because the list is long and the room is small.",
 [["How much notice is required?",["At least two days","A week","One day","None"],
   "‏at least two days before. — قبلَه بيومَين على الأقلّ."],
  ["What happens to people who do not come without telling anyone?",["They are refused a place next term","They pay a fine","Nothing","They are called"],
   "‏are not given a place next term. — لا مقعدَ لهم الفصلَ القادم."]]);

S("The new phone is thinner and the picture is better, but the battery is smaller and mine lasts until the evening instead of the next morning. If you charge at your desk you will not notice. If you travel, keep the old one.",
 [["What is worse about the new phone?",["The battery lasts less long","The picture quality","The weight","The price"],
   "‏the battery is smaller and mine lasts until the evening instead of the next morning. — البطّاريّةُ أصغرُ فتنتهي مساءً لا صباحَ الغد."],
  ["Who should keep the old phone?",["People who travel","People who charge at a desk","Everyone","Nobody"],
   "‏If you travel, keep the old one. — المسافرُ يُبقي القديم."]]);

S("I was invited to speak for forty minutes and I said yes without asking who the audience was. They turned out to be beginners and my talk was for specialists. Half of them left. Now the first question I ask is who will be listening.",
 [["What went wrong?",["The talk did not match the audience","The talk was too short","The room was wrong","Nobody came"],
   "‏They turned out to be beginners and my talk was for specialists. — الحضورُ مبتدئون والحديثُ للمختصّين."],
  ["What does the speaker always ask now?",["Who will be listening","How long to speak","Where the room is","What the fee is"],
   "‏the first question I ask is who will be listening. — أوّلُ سؤالٍ: مَن المستمعون؟"]]);
window.LISTEN_BANK = L;
})();
