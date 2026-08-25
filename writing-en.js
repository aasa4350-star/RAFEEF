/* ==========================================================================
   التعبير الإنجليزي (Writing) — وحدة مستقلّة تُركَّب داخل تبويب «التعبير ✍️»
   في quiz.html. مقسومة قسمين:
     أ) تدريب مصحّح آليًّا: بناء الجملة والفقرة (أسئلة مولّدة، تتغيّر كل مرّة)
     ب) كتابة فقرة حقيقية: يكتبها الطفل، تُصحَّح بمعايير واضحة، وتُحفظ
        بنصّها ليقرأها الأب في التقرير.
   المستوى 1 = ابتدائي (جملة) · المستوى 2 = متوسط (فقرة).
   ========================================================================== */
(function(){
"use strict";

function ri(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
function gp(a){ return a[Math.floor(Math.random()*a.length)]; }
function shuffle(a){ for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function en(s){ return '<span class="wen" dir="ltr">'+esc(s)+'</span>'; }
/* يبني الخيارات ويعيد [مصفوفة, فهرس الصحيح] بعد الخلط، مع إسقاط المكرّر */
function pick3(correct, wrongs){
  var seen={}, out=[correct]; seen[correct]=1;
  for(var i=0;i<wrongs.length && out.length<3;i++){ var w=wrongs[i]; if(w && !seen[w]){ seen[w]=1; out.push(w); } }
  if(out.length<3) return null;
  shuffle(out); return [out, out.indexOf(correct)];
}

/* ===================== بنوك المحتوى ===================== */

/* جُمل بسيطة مركّبة: فاعل + فعل/مفعول + ظرف زمن — تركيب توليديّ يعطي مئات الجمل */
var SUBJ = ["My brother","My sister","My father","My mother","My friend","My cousin","The teacher","My little brother"];
var VP = ["plays football","reads a book","helps my mother","rides a bike","waters the plants","cleans his room",
          "feeds the cat","draws a picture","studies English","washes the dishes","walks to school","tidies the table"];
var TIME = ["every day","in the morning","after school","on Friday","before dinner","every weekend","at night","after lunch"];

/* أزواج جُمل + أداة الربط الصحيحة (الأداة الصحيحة واحدة لا غير) */
var JOIN = [
  ["I was very tired","I went to bed early","so"],
  ["I like apples","I do not like bananas","but"],
  ["He stayed at home","he was sick","because"],
  ["She opened the window","the room was hot","because"],
  ["We finished our homework","we played outside","and"],
  ["It started to rain","we ran inside","so"],
  ["My sister can swim","she cannot ride a bike","but"],
  ["I woke up late","I missed the bus","so"],
  ["He put on his coat","the weather was cold","because"],
  ["We packed our bags","we left the house","and"],
  ["The book was long","it was very interesting","but"],
  ["She was hungry","she made a sandwich","so"],
  ["I brushed my teeth","I went to sleep","and"],
  ["The shop was closed","we came back the next day","so"],
  ["He studied hard","he passed the test","so"],
  ["I called my friend","he did not answer","but"],
  ["We took an umbrella","it was raining","because"],
  ["She washed her hands","she ate her lunch","and"],
  ["The cat was hiding","it was afraid of the noise","because"],
  ["I wanted to go out","my mother said no","but"],
  ["He saved his money","he bought a new bicycle","so"],
  ["We cleaned the classroom","we decorated the walls","and"],
  ["The soup was hot","I waited for a few minutes","so"],
  ["I looked everywhere","I could not find my keys","but"],
  ["She wore a jacket","the wind was strong","because"],
  ["They arrived early","they found good seats","so"],
  ["I enjoy science","my favourite subject is English","but"],
  ["He picked up the litter","he put it in the bin","and"],
  ["The lights went out","the storm cut the power","because"],
  ["We were thirsty","we stopped at a small shop","so"]
];

/* جملة الموضوع: [الموضوع, جملة موضوع جيّدة, تفصيلة ضيّقة, جملة خارج الموضوع] */
var TOPIC_SENT = [
  ["My favourite season",
   "Winter is my favourite season for three reasons.",
   "Last Tuesday the temperature was nine degrees.",
   "My uncle works in a hospital in Riyadh."],
  ["Reading books",
   "Reading books helps us in many different ways.",
   "I finished page forty-two of my book yesterday.",
   "Football is played by two teams of eleven players."],
  ["My school day",
   "My school day is busy from morning until afternoon.",
   "Our break starts at exactly ten o'clock.",
   "My grandmother makes the best rice in the family."],
  ["Helping at home",
   "There are many ways children can help at home.",
   "I washed six plates after dinner on Sunday.",
   "The Red Sea is on the west coast of Saudi Arabia."],
  ["Learning English",
   "Learning English opens many doors for a student.",
   "I learned the word 'curious' last week.",
   "My brother bought new shoes at the mall."],
  ["Keeping healthy",
   "Staying healthy depends on a few simple habits.",
   "I drank three glasses of water this morning.",
   "Our neighbour has a small blue car."],
  ["A trip I remember",
   "The trip to my grandfather's farm is one I will never forget.",
   "We left the house at six fifteen in the morning.",
   "Mathematics is my hardest subject this year."],
  ["Using the internet",
   "The internet is useful, but it must be used carefully.",
   "I watched a ten-minute video about volcanoes.",
   "My sister's birthday is in March."],
  ["My best friend",
   "My best friend has three qualities that I admire.",
   "He was wearing a green shirt on Monday.",
   "Camels can survive for days without water."],
  ["Sports and exercise",
   "Playing sport gives young people more than just fitness.",
   "Our match ended two goals to one.",
   "The library closes at eight in the evening."],
  ["Life in the desert",
   "Living in the desert requires special skills and habits.",
   "The sand reached forty-eight degrees at noon.",
   "My cousin studies engineering at the university."],
  ["Saving water",
   "Every family can save water with a few small changes.",
   "I turned off the tap while I brushed my teeth.",
   "The football season begins in September."],
  ["Working in a team",
   "Working in a team teaches skills that we use all our lives.",
   "There were five students in our group.",
   "My favourite colour has always been blue."],
  ["My favourite subject",
   "Science is the subject I look forward to most each week.",
   "Our science lesson is on Sunday at nine.",
   "We bought fresh bread from the bakery."],
  ["Why homework matters",
   "Homework supports learning in ways that class time cannot.",
   "I spent forty minutes on my homework last night.",
   "The airport is far from the city centre."],
  ["Kindness to neighbours",
   "Being kind to our neighbours makes the whole street better.",
   "Our neighbour knocked on the door at seven.",
   "Whales are the largest animals on earth."],
  ["Learning a new skill",
   "Learning a new skill takes patience more than talent.",
   "I practised for twenty minutes on Monday.",
   "The shop sells three kinds of dates."],
  ["Protecting the environment",
   "Protecting the environment starts with everyday choices.",
   "I put four bottles in the recycling box.",
   "My father drives a white pickup truck."],
  ["My daily routine",
   "My daily routine keeps me organised from morning to night.",
   "I wake up at five thirty every day.",
   "The museum opened last year in Jeddah."],
  ["The importance of sleep",
   "Good sleep affects our health, our mood, and our marks at school.",
   "I slept for eight hours last night.",
   "Our car needed new tyres in the summer."],
  ["Visiting my grandparents",
   "Visiting my grandparents is the part of the week I enjoy most.",
   "We arrived at their house at four o'clock.",
   "Our school has twelve classrooms."]
];

/* فقرات مرتّبة بعلامات تسلسل واضحة (First / Then / Finally) */
var SEQ = [
  ["First, I gather my books and pens.","Then, I sit at my desk and start my homework.","Finally, I check my answers before I close the book."],
  ["First, we washed the fruit carefully.","Then, we cut it into small pieces.","Finally, we mixed everything in a large bowl."],
  ["First, I set my alarm for five o'clock.","Then, I prayed and had my breakfast.","Finally, I walked to the bus stop."],
  ["First, the teacher explained the new lesson.","Then, we worked on the exercises in pairs.","Finally, she asked us questions to check our understanding."],
  ["First, we packed our bags the night before.","Then, we drove for two hours to the farm.","Finally, we helped my grandfather feed the sheep."],
  ["First, I read the question twice.","Then, I underlined the important words.","Finally, I wrote my answer in a full sentence."],
  ["First, we cleared the table after dinner.","Then, my sister washed the dishes.","Finally, I dried them and put them away."],
  ["First, I chose a topic that I liked.","Then, I wrote three sentences about it.","Finally, I read my paragraph again and fixed my mistakes."],
  ["First, we measured the flour and the sugar.","Then, we mixed them with the eggs.","Finally, we put the cake in the oven."],
  ["First, I opened my laptop and searched for the topic.","Then, I wrote down the most useful facts.","Finally, I organised my notes into a short report."],
  ["First, the coach divided us into two teams.","Then, we warmed up for ten minutes.","Finally, we played a short match."],
  ["First, I collected the old clothes we no longer wear.","Then, I folded them into a clean box.","Finally, we gave the box to a charity near our house."],
  ["First, we swept the floor of the classroom.","Then, we wiped the desks with a damp cloth.","Finally, we arranged the chairs in neat rows."],
  ["First, I filled the watering can from the tap.","Then, I watered every plant in the garden.","Finally, I pulled out the dry leaves."],
  ["First, my father parked the car near the market.","Then, we bought the vegetables on the list.","Finally, we carried the bags home together."],
  ["First, I checked the weather on my phone.","Then, I chose clothes that suited the cold morning.","Finally, I left the house on time."]
];

/* جمل متلاحقة بلا فاصل (run-on) وإصلاحها الصحيح */
var RUNON = [
  ["I woke up early I went to school.","I woke up early, so I went to school.","I woke up early I went, to school.","I woke up. early I went to school."],
  ["The film was long it was boring.","The film was long, and it was boring.","The film was long it was, boring.","The film. was long it was boring."],
  ["She was thirsty she drank water.","She was thirsty, so she drank water.","She was thirsty she, drank water.","She was. thirsty she drank water."],
  ["He likes maths he does not like science.","He likes maths, but he does not like science.","He likes maths he does not, like science.","He likes. maths he does not like science."],
  ["It was raining we stayed at home.","It was raining, so we stayed at home.","It was raining we, stayed at home.","It. was raining we stayed at home."],
  ["I opened the door the cat ran out.","I opened the door, and the cat ran out.","I opened the door the cat, ran out.","I opened. the door the cat ran out."],
  ["The test was hard I finished it.","The test was hard, but I finished it.","The test was hard I, finished it.","The. test was hard I finished it."],
  ["We were late the shop had closed.","We were late, and the shop had closed.","We were late the shop, had closed.","We were. late the shop had closed."],
  ["My phone was broken I could not call you.","My phone was broken, so I could not call you.","My phone was broken I could, not call you.","My phone. was broken I could not call you."],
  ["He knocked twice nobody opened the door.","He knocked twice, but nobody opened the door.","He knocked twice nobody, opened the door.","He knocked. twice nobody opened the door."],
  ["The soup was cold I heated it again.","The soup was cold, so I heated it again.","The soup was cold I heated, it again.","The soup. was cold I heated it again."],
  ["I read the map we still got lost.","I read the map, but we still got lost.","I read the map we still, got lost.","I read. the map we still got lost."],
  ["She finished the race she felt proud.","She finished the race, and she felt proud.","She finished the race she, felt proud.","She finished. the race she felt proud."],
  ["The bus was full we waited for the next one.","The bus was full, so we waited for the next one.","The bus was full we waited, for the next one.","The bus. was full we waited for the next one."],
  ["I packed my bag I forgot my notebook.","I packed my bag, but I forgot my notebook.","I packed my bag I forgot, my notebook.","I packed. my bag I forgot my notebook."],
  ["The wind was strong the door slammed shut.","The wind was strong, so the door slammed shut.","The wind was strong the door, slammed shut.","The wind. was strong the door slammed shut."],
  ["We planted the seeds we watered them daily.","We planted the seeds, and we watered them daily.","We planted the seeds we watered, them daily.","We planted. the seeds we watered them daily."],
  ["He apologised I was still upset.","He apologised, but I was still upset.","He apologised I was still, upset.","He apologised. I was still upset."]
];

/* أدوات ربط الفقرة للمتوسط: [الجملة الأولى, الجملة الثانية, الأداة الصحيحة, بديلان خاطئان] */
var CONN2 = [
  ["Ali studied for many hours.","___ , he did not pass the test.","However","Therefore","For example"],
  ["The roads were flooded.","___ , the school was closed.","Therefore","However","In addition"],
  ["Exercise has many benefits.","___ , it makes the heart stronger.","For example","However","Finally"],
  ["I finished my homework early.","___ , I helped my mother in the kitchen.","In addition","However","For example"],
  ["We packed our bags and locked the door.","___ , we started our journey.","Finally","However","For example"],
  ["The city is very crowded.","___ , it is an exciting place to live.","However","Therefore","Finally"],
  ["He forgot to set his alarm.","___ , he arrived late to the meeting.","Therefore","However","For example"],
  ["Many animals live in the desert.","___ , the camel and the desert fox live there.","For example","However","Therefore"],
  ["She practised the piano every evening.","___ , she won the competition.","Therefore","However","For example"],
  ["The book explains the topic clearly.","___ , it has useful pictures.","In addition","However","Finally"],
  ["The desert looks empty at first.","___ , it is full of life at night.","However","Therefore","In addition"],
  ["He had not slept for two nights.","___ , he could not concentrate in class.","Therefore","However","For example"],
  ["Some sports need very little equipment.","___ , running needs only a pair of shoes.","For example","However","Finally"],
  ["The museum is free for students.","___ , it opens late on Thursdays.","In addition","However","Therefore"],
  ["We checked the tickets and the passports.","___ , we boarded the plane.","Finally","However","For example"],
  ["Online lessons save a lot of travelling time.","___ , they can feel lonely.","However","Therefore","Finally"],
  ["The river had risen after the rain.","___ , the bridge was closed.","Therefore","However","In addition"],
  ["Many everyday objects are made from recycled material.","___ , some benches are made from old bottles.","For example","However","Finally"],
  ["The plan was clear and everyone agreed.","___ , we started work the next morning.","Therefore","However","For example"],
  ["Our library has thousands of books.","___ , it has a quiet room for studying.","In addition","However","Finally"]
];

/* مواضيع الكتابة الحرّة.
   points = نقاط المهمّة (Content في مقياس كامبردج): لكلّ نقطة سؤالٌ موجِّه
   ومجموعةُ كلماتٍ نستدلّ بها على أنّ الطفل تناولها فعلًا. */
var PROMPTS = {
  1: [
    {t:"My family", h:"Who is in your family? What do they like to do? How do you feel about them?", points:[
      {q:"Name the people in your family", k:["father","dad","mother","mum","mom","brother","sister","parents","grandfather","grandmother","uncle","aunt","cousin","family"]},
      {q:"Say what they like or do", k:["like","likes","love","loves","enjoy","enjoys","work","works","play","plays","read","reads","cook","cooks","teach","teaches","study","studies"]},
      {q:"Say how you feel about them", k:["happy","proud","kind","best","lucky","love","great","because","favourite","favorite"]}
    ]},
    {t:"My school day", h:"When does your day start? What do you study? What do you do at break?", points:[
      {q:"Say when your day starts or ends", k:["morning","clock","start","starts","begin","begins","wake","early","finish","finishes","end","ends","afternoon","seven","eight"]},
      {q:"Name subjects or lessons", k:["english","maths","math","science","arabic","lesson","lessons","class","classes","subject","subjects","teacher","study","studies"]},
      {q:"Say what you do at break or after school", k:["break","lunch","friends","play","playground","football","home","after","eat","talk"]}
    ]},
    {t:"My favourite food", h:"What is it? Who makes it? Why do you like it?", points:[
      {q:"Name the food", k:["rice","chicken","kabsa","pizza","bread","dates","fish","meat","soup","salad","food","dish","burger","pasta","sandwich"]},
      {q:"Say who cooks it and when", k:["mother","mum","mom","father","grandmother","cook","cooks","make","makes","friday","dinner","lunch","weekend"]},
      {q:"Say why you like it", k:["because","delicious","tasty","sweet","favourite","favorite","love","like","best","good"]}
    ]},
    {t:"How I help at home", h:"What jobs do you do? When? How does your family feel?", points:[
      {q:"Name the jobs you do", k:["clean","cleans","tidy","wash","washes","dishes","room","help","helps","water","cook","cooks","carry","sweep","table"]},
      {q:"Say when you do them", k:["every","day","morning","evening","after","before","weekend","friday","always","sometimes","usually"]},
      {q:"Say how your family feels", k:["happy","proud","thank","thanks","glad","pleased","because","smile"]}
    ]},
    {t:"My best friend", h:"What is his or her name? What do you do together? Why is he or she a good friend?", points:[
      {q:"Give the name and something about them", k:["name","friend","he","she","his","her","old","years","class","school","neighbour","neighbor"]},
      {q:"Say what you do together", k:["play","plays","together","football","study","studies","talk","walk","game","games","visit","ride"]},
      {q:"Say why he or she is a good friend", k:["because","kind","funny","helps","help","honest","good","best","always","share","shares"]}
    ]},
    {t:"A day I enjoyed", h:"Where were you? What did you do? How did you feel?", points:[
      {q:"Say where and when you were", k:["went","was","were","park","farm","beach","sea","house","home","yesterday","friday","weekend","last","holiday"]},
      {q:"Say what you did", k:["played","ate","saw","visited","swam","ran","rode","watched","helped","walked","bought","took"]},
      {q:"Say how you felt", k:["happy","fun","enjoyed","great","excited","tired","because","best","good"]}
    ]},
    {t:"My favourite animal", h:"What is it? Where does it live? Why do you like it?", points:[
      {q:"Name the animal and describe it", k:["cat","dog","horse","camel","bird","lion","fish","rabbit","sheep","animal","big","small","brown","white","black","fast","strong"]},
      {q:"Say where it lives or what it eats", k:["live","lives","desert","farm","house","water","sea","tree","eat","eats","grass","meat","food"]},
      {q:"Say why you like it", k:["because","like","love","beautiful","friendly","kind","useful","favourite","favorite","best"]}
    ]},
    {t:"My room", h:"What is in your room? What do you do there? Why do you like it?", points:[
      {q:"Say what is in the room", k:["bed","desk","chair","window","door","book","books","shelf","lamp","carpet","wall","picture","cupboard"]},
      {q:"Say what you do there", k:["sleep","study","read","play","write","rest","listen","draw","homework"]},
      {q:"Say why you like it", k:["because","quiet","clean","big","comfortable","like","love","favourite","favorite","best"]}
    ]}
  ],
  2: [
    {t:"The benefits of reading", h:"Give two benefits, an example for each, and a short conclusion.", points:[
      {q:"State the first benefit", k:["vocabulary","words","knowledge","learn","learns","imagination","concentration","focus","relax","understand"]},
      {q:"Give an example or a second benefit", k:["for example","such as","like","story","stories","novel","book","books","history","science","also","another"]},
      {q:"Finish with a conclusion or opinion", k:["in conclusion","finally","therefore","so","think","believe","opinion","should","every","important"]}
    ]},
    {t:"Should students use phones at school?", h:"Give your opinion, two reasons, and a conclusion.", points:[
      {q:"State your opinion clearly", k:["think","believe","opinion","should","should not","shouldn't","agree","disagree","view"]},
      {q:"Give reasons or examples", k:["because","for example","reason","first","secondly","also","distract","distracts","learn","search","emergency","call","cheat"]},
      {q:"Finish with a conclusion", k:["in conclusion","finally","therefore","so","overall","to sum up"]}
    ]},
    {t:"A person I admire", h:"Who is it? Describe two qualities with an example of each.", points:[
      {q:"Say who the person is", k:["father","mother","teacher","brother","sister","grandfather","grandmother","friend","doctor","admire","person"]},
      {q:"Describe qualities with examples", k:["kind","patient","honest","hard","working","generous","brave","clever","because","for example","always","helps","helped"]},
      {q:"Say what you learned from them", k:["learn","learned","taught","teaches","lesson","want","try","follow","example","therefore","so"]}
    ]},
    {t:"How to stay healthy", h:"Explain three habits and why each one matters.", points:[
      {q:"Mention food or diet", k:["food","eat","eats","vegetables","fruit","fruits","water","drink","sugar","healthy","diet","breakfast"]},
      {q:"Mention exercise or sleep", k:["exercise","sport","walk","run","running","football","sleep","hours","rest","gym","active"]},
      {q:"Explain why each habit matters", k:["because","therefore","so","helps","help","strong","energy","heart","mind","concentrate","illness","health"]}
    ]},
    {t:"A trip I will never forget", h:"Where and when, what happened, and how you felt at the end.", points:[
      {q:"Say where and when you went", k:["went","travelled","traveled","last","summer","holiday","visited","city","farm","sea","mountain","desert","riyadh","jeddah","makkah"]},
      {q:"Describe what happened, in order", k:["first","then","after","later","finally","next","we","arrived","saw","stayed","walked","ate","took"]},
      {q:"Say how you felt at the end", k:["felt","feel","happy","tired","excited","unforgettable","never forget","memory","best","because"]}
    ]},
    {t:"The advantages and disadvantages of the internet", h:"Two advantages, one disadvantage, then your opinion.", points:[
      {q:"Give advantages", k:["advantage","advantages","useful","learn","information","fast","communicate","search","study","helps","for example"]},
      {q:"Give a disadvantage", k:["however","but","disadvantage","waste","time","dangerous","addicted","health","eyes","false","fake","bully"]},
      {q:"Give your own opinion", k:["think","believe","opinion","should","in conclusion","overall","therefore","so","balance","careful"]}
    ]},
    {t:"My plans for the future", h:"What do you want to study or become, why, and what you are doing now.", points:[
      {q:"Say what you want to become", k:["want","hope","plan","become","engineer","doctor","teacher","pilot","programmer","study","university","future","dream"]},
      {q:"Explain your reason", k:["because","reason","help","people","interested","love","enjoy","important","country","therefore"]},
      {q:"Say what you are doing now to prepare", k:["now","study","studying","practise","practice","read","reading","learn","learning","working","every day","improve"]}
    ]},
    {t:"A problem in my city and how to solve it", h:"Describe the problem, its effect, and one solution.", points:[
      {q:"Describe the problem", k:["problem","traffic","crowded","litter","rubbish","noise","pollution","water","parking","roads","dust"]},
      {q:"Explain its effect on people", k:["because","effect","affects","people","health","late","dangerous","difficult","hard","time","accident"]},
      {q:"Suggest a solution", k:["solution","solve","should","could","government","build","more","recycle","fine","fines","bus","metro","plant","clean"]}
    ]}
  ]
};

/* أهداف CEFR لكلّ طفل — المنهج السعودي مبنيّ على CEFR (نهاية السادس = A1).
   يحدّد الطول المتوقّع وأدوات الربط المطلوبة في مقياس Organisation. */
var CEFR = {
  A1: {name:"A1", minWords:30, minSent:3, minConn:1, needSeq:false,
       conn:["and","but","because","also"],
       say:"جُمل بسيطة عن نفسك، مربوطة بـ and / but"},
  A2: {name:"A2", minWords:60, minSent:5, minConn:2, needSeq:false,
       conn:["and","but","because","so","then","after","before","also"],
       say:"سلسلة جُمل مربوطة بأدوات بسيطة: and / but / because — وهو نصّ وصف CEFR للمستوى A2"},
  B1: {name:"A2+ نحو B1", minWords:100, minSent:6, minConn:3, needSeq:true,
       conn:["and","but","because","so","however","therefore","for example","in addition","first","then","finally","although","also"],
       say:"نصّ مترابط: مقدّمة ثم أفكار مرتّبة ثم خاتمة، بأدوات ربط متنوّعة"}
};


/* ===================== مولّدات التدريب ===================== */

/* ترتيب كلمات الجملة (ابتدائي) */
function wOrder(){
  var s=gp(SUBJ), v=gp(VP), t=gp(TIME);
  var correct = s+" "+v+" "+t+".";
  var w1 = t.charAt(0).toUpperCase()+t.slice(1)+" "+v+" "+s.toLowerCase()+".";
  var w2 = v.charAt(0).toUpperCase()+v.slice(1)+" "+s.toLowerCase()+" "+t+".";
  var o=pick3(correct,[w1,w2]); if(!o) return null;
  var words=shuffle((s+" "+v+" "+t).split(" ")).join(" / ");
  return ["رتّب الكلمات لتكوين جملة صحيحة:<br>"+en(words),
    o[0].map(en), o[1],
    "الترتيب الإنجليزي: <b>الفاعل ← الفعل ← بقيّة الجملة ← ظرف الزمن</b>، ونبدأ بحرفٍ كبير وننهي بنقطة.",
    "wo:"+s+"|"+v];
}

/* الحرف الكبير وعلامة الترقيم (ابتدائي) */
function wCapital(){
  var s=gp(SUBJ), v=gp(VP), t=gp(TIME);
  var correct = s+" "+v+" "+t+".";
  var w1 = correct.charAt(0).toLowerCase()+correct.slice(1);      // بداية بحرف صغير
  var w2 = correct.slice(0,-1);                                    // بلا نقطة
  var o=pick3(correct,[w1,w2]); if(!o) return null;
  return ["أيّ الجمل مكتوبة بطريقة صحيحة؟",o[0].map(en),o[1],
    "كلّ جملة تبدأ بحرفٍ <b>كبير</b> وتنتهي بـ<b>نقطة</b>.","wc:"+s+"|"+v];
}

/* ضمير المتكلّم I يُكتب كبيرًا دائمًا (ابتدائي) */
function wCapitalI(){
  var v=gp(["like reading","play with my brother","help my father","go to the park","study every evening","watch cartoons"]);
  var t=gp(TIME);
  var correct = "I "+v+" "+t+".";
  var o=pick3(correct,["i "+v+" "+t+".", "I "+v+" "+t]); if(!o) return null;
  return ["أيّ الجمل مكتوبة بطريقة صحيحة؟",o[0].map(en),o[1],
    "الضمير "+en("I")+" يُكتب <b>كبيرًا دائمًا</b> في أيّ موضعٍ من الجملة، والجملة تنتهي بنقطة.","wi:"+v];
}

/* أداة الربط الصحيحة (ابتدائي) */
function wConnect(){
  var p=gp(JOIN), c=p[2];
  var wrongs=shuffle(["and","but","because","so"].filter(function(x){ return x!==c; })).slice(0,2);
  var o=pick3(c,wrongs); if(!o) return null;
  return ["اختر أداة الربط المناسبة:<br>"+en(p[0]+" ___ "+p[1]+"."),
    o[0].map(en),o[1],
    "الصحيح: "+en(p[0]+" "+c+" "+p[1]+".")+"<br>"+
    "<b>and</b> للإضافة · <b>but</b> للتضادّ · <b>because</b> للسبب · <b>so</b> للنتيجة.",
    "wj:"+p[0]];
}

/* جملة الموضوع (متوسط) */
function wTopicSentence(){
  var p=gp(TOPIC_SENT);
  var o=pick3(p[1],[p[2],p[3]]); if(!o) return null;
  return ["أيّ جملةٍ تصلح <b>جملةً موضوعيّة</b> (Topic Sentence) لفقرةٍ عن «"+p[0]+"»؟",
    o[0].map(en),o[1],
    "جملة الموضوع تُلخّص فكرة الفقرة كلّها. أمّا الجملة التي تذكر تفصيلةً دقيقة فهي جملة داعمة، والجملة البعيدة عن الموضوع لا مكان لها.",
    "wt:"+p[0]];
}

/* الجملة الخارجة عن الموضوع (متوسط) */
function wOffTopic(){
  var p=gp(TOPIC_SENT);
  var o=pick3(p[3],[p[1],p[2]]); if(!o) return null;
  return ["فقرةٌ عن «"+p[0]+"». أيّ جملةٍ <b>لا تنتمي</b> إليها؟",
    o[0].map(en),o[1],
    "وحدة الفقرة تعني أنّ كلّ جملةٍ فيها تخدم الفكرة نفسها. الجملة الصحيحة هنا تتكلّم عن موضوعٍ آخر تمامًا.",
    "wx:"+p[0]];
}

/* ترتيب جُمل الفقرة (متوسط) */
function wOrderPara(){
  var p=gp(SEQ);
  var correct=p.join(" ");
  var w1=[p[1],p[0],p[2]].join(" ");
  var w2=[p[2],p[1],p[0]].join(" ");
  var o=pick3(correct,[w1,w2]); if(!o) return null;
  return ["رتّب جُمل الفقرة ترتيبًا صحيحًا:",o[0].map(en),o[1],
    "علامات التسلسل تدلّك على الترتيب: "+en("First")+" ← "+en("Then")+" ← "+en("Finally")+".",
    "wp:"+p[0]];
}

/* إصلاح الجملة المتلاحقة (متوسط) */
function wRunOn(){
  var p=gp(RUNON);
  var o=pick3(p[1],[p[2],p[3]]); if(!o) return null;
  return ["الجملة التالية <b>متلاحقة</b> (run-on):<br>"+en(p[0])+"<br>أيّ إصلاحٍ صحيح؟",
    o[0].map(en),o[1],
    "جملتان كاملتان لا تُوضعان معًا بلا رابط. الحلّ: <b>فاصلة + أداة ربط</b> ("+en("and / but / so")+") أو نقطة تفصل بينهما.",
    "wr:"+p[0]];
}

/* أدوات ربط الفقرة (متوسط) */
function wConnector2(){
  var p=gp(CONN2);
  var o=pick3(p[2],[p[3],p[4]]); if(!o) return null;
  return ["اختر الأداة المناسبة:<br>"+en(p[0])+"<br>"+en(p[1]),
    o[0].map(en),o[1],
    "<b>However</b> للتضادّ · <b>Therefore</b> للنتيجة · <b>For example</b> للتمثيل · <b>In addition</b> للإضافة · <b>Finally</b> للختام.",
    "wn:"+p[0]];
}

var GENS = {
  1: [wOrder,wCapital,wCapitalI,wConnect,wTopicSentence,wOrderPara],
  2: [wTopicSentence,wOffTopic,wOrderPara,wRunOn,wConnector2,wConnect]
};

function genN(gens,n){
  var out=[], seen={}, t=0;
  while(out.length<n && t<n*40){
    t++;
    var q; try{ q=gp(gens)(); }catch(e){ continue; }
    if(!q) continue;
    var k=q[4]||q[0];
    if(seen[k]||seen[q[0]]) continue;
    seen[k]=1; seen[q[0]]=1; out.push(q);
  }
  return out;
}

/* ===================== مصحّح الكتابة الحرّة =====================
   مبنيّ على مقاييس كامبردج الأربعة لتقييم الكتابة، كلٌّ منها من ٥ ووزنه ٢٥٪،
   والدرجة ٣ هي حدّ النجاح — وهي المقاييس نفسها المستعملة في
   A2 Key for Schools و B1 Preliminary for Schools:
     Content                 هل غطّى نقاط المهمّة؟
     Communicative Achievement  هل الأسلوب مناسب للقارئ والمهمّة؟
     Organisation            هل النصّ مرتّب ومربوط؟
     Language                الإملاء والترقيم والثروة اللغوية.
   ومستوى التوقّع (الطول وأدوات الربط) يأتي من هدف CEFR للطفل. */

function splitSentences(text){
  return String(text).split(/[.!?]+/).map(function(s){ return s.trim(); }).filter(function(s){ return s.length>0; });
}
function hasWord(t, w){
  return new RegExp("(^|[^A-Za-z])"+w.replace(/ /g,"\\s+")+"([^A-Za-z]|$)","i").test(t);
}
/* من نسبة الفحوص المتحقّقة إلى نطاق كامبردج ٠–٥ */
function band(passed, total){
  if(!total) return 0;
  return Math.max(0, Math.min(5, Math.round(passed/total*5)));
}

/* لغة الدردشة والاختصارات — تُخِلّ بـ«مناسبة الأسلوب للمهمّة» (Register) */
var CHATSPEAK = ["u","ur","r","plz","pls","thx","gonna","wanna","gotta","lol","omg","bcz","bcoz","cuz","idk","btw","asap","4u","2u"];
var SEQ_WORDS = ["first","firstly","then","next","after that","finally","lastly","in conclusion","to sum up"];

function gradeWriting(text, level, targetOrCefr, prompt){
  var cef = (typeof targetOrCefr==="object" && targetOrCefr) ? targetOrCefr
          : (CEFR[targetOrCefr] || (level>=2 ? CEFR.A2 : CEFR.A1));
  var t=String(text||"").replace(/\s+/g," ").trim();
  var words=t? t.split(/\s+/).filter(function(w){ return /[A-Za-z]/.test(w); }) : [];
  var sents=splitSentences(t);
  var any = words.length>0;

  /* ---------- 1) Content: نقاط المهمّة ---------- */
  var pts = (prompt && prompt.points) || [];
  var covered = pts.map(function(p){
    return { q:p.q, ok: any && p.k.some(function(k){ return hasWord(t,k); }) };
  });
  var contentChecks = covered.map(function(c){
    return {ok:c.ok, label:"غطّيت: "+c.q, hint:"أضف جملةً تجيب عن: "+c.q};
  });
  contentChecks.push({ok: words.length>=cef.minWords,
    label:"الطول المطلوب لمستوى "+cef.name+": "+words.length+" من "+cef.minWords+" كلمة",
    hint:"اكتب "+Math.max(0,cef.minWords-words.length)+" كلمة إضافية."});
  contentChecks.push({ok: any && !/[؀-ۿ]/.test(t), label:"الفقرة كلّها بالإنجليزية",
    hint:"فيها حروف عربية — اكتبها كاملة بالإنجليزية."});

  /* ---------- 2) Organisation: الترتيب والربط ---------- */
  var conns = cef.conn.filter(function(c){ return hasWord(t,c); });
  var seq   = SEQ_WORDS.filter(function(c){ return hasWord(t,c); });
  var orgChecks=[
    {ok: sents.length>=cef.minSent, label:"عدد الجمل: "+sents.length+" من "+cef.minSent,
     hint:"قسّم أفكارك: كلّ جملةٍ فكرةٌ واحدة."},
    {ok: conns.length>=cef.minConn,
     label:"أدوات الربط: "+conns.length+" من "+cef.minConn+(conns.length?" ("+conns.join(", ")+")":""),
     hint:"اربط جُملك بـ "+cef.conn.slice(0,5).join(" / ")+"."},
    {ok: any && sents.length>=2 && sents[0].split(/\s+/).length>=4,
     label:"جملة أولى واضحة تُقدّم الموضوع", hint:"ابدأ بجملةٍ تُعرّف القارئ بموضوعك."}
  ];
  if(cef.needSeq){
    orgChecks.push({ok: seq.length>=1, label:"ترتيب زمنيّ/منطقيّ ظاهر"+(seq.length?" ("+seq.join(", ")+")":""),
      hint:"استعمل First / Then / Finally أو In conclusion لترتيب أفكارك."});
    orgChecks.push({ok: sents.length>=3 && /(?:conclusion|to sum up|overall|finally|in short|think|believe|opinion)/i.test(sents[sents.length-1]||""),
      label:"خاتمة أو رأي في آخر جملة",
      hint:"أنهِ الفقرة برأيك أو خلاصتك (In conclusion… / I think…)."});
  }

  /* ---------- 3) Language: الصحّة والثروة ---------- */
  var badCap=[], i;
  for(i=0;i<sents.length;i++){
    var m=sents[i].match(/[A-Za-z]/);
    if(m && m[0]!==m[0].toUpperCase()) badCap.push(sents[i].slice(0,24));
  }
  var lowerI = /(^|[^A-Za-z])i([^A-Za-z]|$)/.test(t);
  var STOP={the:1,a:1,an:1,and:1,to:1,of:1,in:1,is:1,are:1,was:1,were:1,i:1,my:1,it:1,he:1,she:1,we:1,they:1,you:1,that:1,this:1,for:1,on:1,at:1,with:1,but:1,so:1,because:1,have:1,has:1,do:1,does:1,very:1};
  var freq={}, top="", topN=0, uniq={};
  words.forEach(function(w){ var k=w.toLowerCase().replace(/[^a-z]/g,""); if(!k) return;
    uniq[k]=1; if(STOP[k]) return;
    freq[k]=(freq[k]||0)+1; if(freq[k]>topN){ topN=freq[k]; top=k; } });
  var overused = words.length>=20 && topN>=Math.max(4, Math.round(words.length*0.12));
  /* تنوّع المفردات: نسبة الكلمات المختلفة إلى مجموع الكلمات */
  var ttr = words.length ? Object.keys(uniq).length/words.length : 0;
  /* تنوّع أطوال الجمل: ألّا تكون كلّ الجمل بالطول نفسه تقريبًا */
  var lens = sents.map(function(s){ return s.split(/\s+/).length; });
  var avgLen = lens.length ? lens.reduce(function(a,b){return a+b;},0)/lens.length : 0;
  var varied = lens.length<3 ? false : lens.some(function(L){ return Math.abs(L-avgLen)>=3; });

  var langChecks=[
    {ok: sents.length>0 && badCap.length===0, label:"كلّ جملة تبدأ بحرفٍ كبير",
     hint: badCap.length? ("ابدأ بحرفٍ كبير: «"+badCap[0]+"…»") : ""},
    {ok: !!t && /[.!?]$/.test(t), label:"النصّ ينتهي بعلامة ترقيم", hint:"أنهِ آخر جملة بنقطة."},
    {ok: any && !lowerI, label:"الضمير I مكتوب كبيرًا", hint:"اكتب I كبيرة دائمًا، لا i."},
    {ok: any && !overused, label:"لا تكرار مفرط لكلمة واحدة",
     hint: overused? ("كرّرت «"+top+"» "+topN+" مرّات — نوّع كلماتك.") : ""},
    {ok: words.length>=15 && ttr>=0.55, label:"تنوّع المفردات: "+Math.round(ttr*100)+"%",
     hint:"استعمل مرادفاتٍ وكلماتٍ أوسع بدل تكرار نفس الكلمة."},
    {ok: varied, label:"تنوّع أطوال الجمل",
     hint:"نوّع: جملة قصيرة ثمّ أطول — لا تجعلها كلّها بالطول نفسه."}
  ];

  /* ---------- 4) Communicative Achievement: مناسبة الأسلوب ---------- */
  var chat = CHATSPEAK.filter(function(c){ return hasWord(t,c); });
  var shouty = (t.match(/\b[A-Z]{4,}\b/g)||[]).length>0;
  var comChecks=[
    {ok: any && chat.length===0, label:"أسلوب كتابيّ لا لغة دردشة",
     hint: chat.length? ("تجنّب: "+chat.join(", ")+" — اكتبها كاملة.") : ""},
    {ok: any && !shouty, label:"بلا كلماتٍ بحروفٍ كبيرة كلّها", hint:"الحروف الكبيرة كلّها تُقرأ صياحًا."},
    {ok: any && avgLen>=5, label:"جُملٌ كاملة لا كلماتٌ مبعثرة",
     hint:"اكتب جُملًا كاملة فيها فاعلٌ وفعل."},
    {ok: any && sents.length>0 && /[.!?]/.test(t), label:"الترقيم يفصل الأفكار",
     hint:"استعمل النقاط لتفصل بين أفكارك."}
  ];

  function sub(nameAr, nameEn, checks){
    var p=checks.filter(function(c){ return c.ok; }).length;
    return {ar:nameAr, en:nameEn, passed:p, total:checks.length, band:band(p,checks.length), checks:checks};
  }
  var subs=[
    sub("المحتوى","Content",contentChecks),
    sub("الترتيب والربط","Organisation",orgChecks),
    sub("اللغة","Language",langChecks),
    sub("مناسبة الأسلوب","Communicative Achievement",comChecks)
  ];
  var totalBand = subs.reduce(function(a,s){ return a+s.band; },0);   /* من ٢٠ كنظام كامبردج */
  var pass = subs.every(function(s){ return s.band>=3; });

  return { subs:subs, total:totalBand, max:20, pass:pass, cefr:cef.name,
           words:words.length, sents:sents.length, conns:conns,
           /* توافق مع النداءات القديمة */
           score:totalBand, checks:subs.reduce(function(a,s){ return a.concat(s.checks); },[]) };
}

/* ===================== الواجهة ===================== */

var CSS = ''+
'.wsec{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:15px 17px;margin-bottom:13px;box-shadow:var(--shadow)}'+
'.wen{direction:ltr;unicode-bidi:isolate;display:inline-block;text-align:left}'+
'.wq .stem{font-weight:700;margin:5px 0 9px;font-size:1.05rem}'+
'.wq .num{font-size:.8rem;color:var(--accent);font-weight:800}'+
'.wopts{display:grid;gap:8px}'+
'.wopts button{border:1.5px solid var(--line);background:transparent;color:var(--ink);padding:12px 14px;border-radius:12px;font-size:1rem;cursor:pointer;font-family:inherit;direction:ltr;text-align:left}'+
'.wopts button.correct{background:var(--good-bg);border-color:var(--good);color:var(--good);font-weight:700}'+
'.wopts button.wrong{background:var(--bad-bg);border-color:var(--bad);color:var(--bad)}'+
'.wexp{margin-top:10px;font-size:.9rem;color:var(--muted);background:var(--bg);border-radius:10px;padding:0 12px;max-height:0;overflow:hidden;transition:max-height .25s,padding .25s}'+
'.wexp.show{max-height:260px;padding:10px 12px}'+
'#wtext{width:100%;min-height:170px;direction:ltr;text-align:left;font-family:inherit;font-size:1.05rem;line-height:1.9;padding:12px;border-radius:12px;border:1.5px solid var(--line);background:var(--bg);color:var(--ink);resize:vertical}'+
'.wchk{list-style:none;padding:0;margin:10px 0 0}'+
'.wchk li{padding:6px 0;font-size:.93rem;border-bottom:1px dashed var(--line)}'+
'.wchk li:last-child{border-bottom:0}'+
'.wchk .h{display:block;color:var(--muted);font-size:.85rem;margin-top:2px}'+
'.wbtn{width:100%;margin-top:10px;background:var(--accent);border:0;color:#fff;padding:13px;border-radius:12px;font-weight:800;cursor:pointer;font-family:inherit;font-size:1rem}'+
'.wbtn.ghost{background:transparent;border:1.5px solid var(--accent);color:var(--accent)}'+
'.wmeter{height:8px;border-radius:99px;background:var(--line);overflow:hidden;margin:8px 0}'+
'.wmeter>i{display:block;height:100%;background:var(--accent);width:0;transition:width .3s}'+
'.wsub{border:1px solid var(--line);border-radius:12px;padding:10px 12px;margin-top:10px}'+
'.wsub>summary{cursor:pointer;font-weight:800;display:flex;justify-content:space-between;gap:8px;align-items:center;list-style:none}'+
'.wsub>summary::-webkit-details-marker{display:none}'+
'.wband{min-width:64px;text-align:center;border-radius:9px;padding:2px 8px;font-weight:800;font-size:.86rem}'+
'.wb-lo{background:var(--bad-bg);color:var(--bad)} .wb-ok{background:#fdf3e3;color:#b45309} .wb-hi{background:var(--good-bg);color:var(--good)}'+
'@media (prefers-color-scheme:dark){.wb-ok{background:#3a2f14;color:#fbbf24}}'+
'.wtag{display:inline-block;background:var(--bg);border:1px solid var(--line);border-radius:99px;padding:2px 10px;font-size:.8rem;color:var(--muted);font-weight:700}';

function injectCss(){
  if(document.getElementById("wen-css")) return;
  var st=document.createElement("style"); st.id="wen-css"; st.textContent=CSS;
  document.head.appendChild(st);
}

function render(el, ctx){
  injectCss();
  var level = ctx.level || 1;
  var cef = CEFR[ctx.cefr] || (level>=2 ? CEFR.A2 : CEFR.A1);
  var prompts = PROMPTS[level] || PROMPTS[1];
  /* موضوع اليوم يتغيّر يوميًّا ولا يتغيّر بإعادة التحميل في اليوم نفسه */
  var dayIdx = Math.floor((Date.now()+3*3600*1000)/86400000);
  var pIdx = dayIdx % prompts.length;
  var items = genN(GENS[level]||GENS[1], 6);

  var html = ''+
    '<div class="wsec"><b>✍️ التعبير</b> — '+
      (level>=2 ? 'بناء الفقرة: جملة الموضوع، الوحدة، الترتيب، وأدوات الربط.'
                : 'بناء الجملة: الترتيب، الحرف الكبير، النقطة، وأدوات الربط.')+
      '<br><span style="color:var(--muted);font-size:.9rem">قسمان: تدريب سريع مصحّح، ثمّ اكتب فقرتك — وتُحفظ لوالدك ليقرأها.</span>'+
      '<div style="margin-top:8px"><span class="wtag">📐 التقييم بمقاييس كامبردج الأربعة</span> '+
      '<span class="wtag">🎯 مستواك المستهدف: '+cef.name+'</span></div></div>'+
    '<div class="wsec"><b>الجزء الأول — تدريب</b><div id="wquiz"></div>'+
      '<div style="text-align:center;font-weight:800;margin-top:10px"><span id="wscore">0 / '+items.length+'</span></div>'+
      '<button class="wbtn ghost" id="wnew">تدريب جديد 🔄</button></div>'+
    '<div class="wsec"><b>الجزء الثاني — اكتب فقرتك</b>'+
      '<div style="margin:8px 0 4px;font-size:1.05rem"><b>'+en(prompts[pIdx].t)+'</b></div>'+
      '<div style="color:var(--muted);font-size:.92rem;margin-bottom:6px">'+en(prompts[pIdx].h)+'</div>'+
      '<div style="background:var(--bg);border-radius:10px;padding:9px 12px;margin-bottom:8px;font-size:.9rem">'+
        '<b>نقاط المهمّة</b> — غطِّها كلّها لترفع درجة <i>Content</i>:<ol style="margin:5px 0 0;padding-inline-start:18px">'+
        (prompts[pIdx].points||[]).map(function(pp){ return '<li>'+en(pp.q)+'</li>'; }).join('')+
        '</ol><div style="color:var(--muted);margin-top:6px">الطول المطلوب لمستوى '+cef.name+': <b>'+cef.minWords+'</b> كلمة على الأقل — '+cef.say+'.</div></div>'+
      '<textarea id="wtext" dir="ltr" placeholder="Write your paragraph here..." spellcheck="true"></textarea>'+
      '<div class="wmeter"><i id="wbar"></i></div>'+
      '<div id="wlive" style="font-size:.9rem;color:var(--muted)">0 كلمة · 0 جملة</div>'+
      '<button class="wbtn" id="wcheck">قيّم كتابتي ✅</button>'+
      '<div id="wfeed"></div></div>';
  el.innerHTML = html;

  /* ---- الجزء الأول ---- */
  function paintQuiz(list){
    var box=el.querySelector("#wquiz"), h="";
    list.forEach(function(q,i){
      h+='<div class="wq" data-i="'+i+'" style="margin-top:12px"><div class="num">سؤال '+(i+1)+'</div>'+
         '<div class="stem">'+q[0]+'</div><div class="wopts">';
      q[1].forEach(function(o,j){ h+='<button data-j="'+j+'">'+o+'</button>'; });
      h+='</div><div class="wexp">'+q[3]+'</div></div>';
    });
    box.innerHTML=h;
    var correct=0, answered={}, total=list.length, saved=false;
    var sc=el.querySelector("#wscore"); sc.textContent="0 / "+total;
    box.querySelectorAll(".wq").forEach(function(qEl){
      var i=+qEl.getAttribute("data-i"), ans=list[i][2];
      qEl.querySelectorAll(".wopts button").forEach(function(btn){
        btn.addEventListener("click", function(){
          if(answered[i]) return; answered[i]=1;
          qEl.querySelectorAll(".wopts button").forEach(function(b){ b.disabled=true; });
          if(+btn.getAttribute("data-j")===ans){ btn.classList.add("correct"); correct++; }
          else{ btn.classList.add("wrong"); qEl.querySelectorAll(".wopts button")[ans].classList.add("correct"); }
          qEl.querySelector(".wexp").classList.add("show");
          sc.textContent=correct+" / "+total;
          if(Object.keys(answered).length===total && !saved){
            saved=true;
            ctx.save({ kind:"writing-drill", correct:correct, total:total, level:level });
          }
        });
      });
    });
  }
  paintQuiz(items);
  el.querySelector("#wnew").addEventListener("click", function(){
    items = genN(GENS[level]||GENS[1], 6); paintQuiz(items);
  });

  /* ---- الجزء الثاني ---- */
  var ta=el.querySelector("#wtext"), bar=el.querySelector("#wbar"), live=el.querySelector("#wlive");
  var draftKey="wen_draft_"+ctx.who+"_"+pIdx;
  try{ var d=localStorage.getItem(draftKey); if(d) ta.value=d; }catch(e){}
  function refresh(){
    var t=ta.value.replace(/\s+/g," ").trim();
    var w=t? t.split(/\s+/).filter(function(x){ return /[A-Za-z]/.test(x); }).length : 0;
    var s=splitSentences(t).length;
    live.textContent=w+" كلمة · "+s+" جملة";
    bar.style.width=Math.min(100, Math.round(w/cef.minWords*100))+"%";
    try{ localStorage.setItem(draftKey, ta.value); }catch(e){}
  }
  ta.addEventListener("input", refresh); refresh();

  el.querySelector("#wcheck").addEventListener("click", function(){
    var g=gradeWriting(ta.value, level, cef, prompts[pIdx]);
    var feed=el.querySelector("#wfeed");
    if(g.words===0){ feed.innerHTML='<div style="color:var(--bad);font-weight:700;margin-top:10px">اكتب فقرتك أولًا ✍️</div>'; return; }

    var bcls=function(b){ return b>=4?"wb-hi":(b>=3?"wb-ok":"wb-lo"); };
    var h='<div style="margin-top:14px;display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">'+
            '<b style="font-size:1.05rem">النتيجة: '+g.total+' / 20</b>'+
            '<span class="wband '+(g.pass?"wb-hi":"wb-lo")+'">'+(g.pass?"✅ اجتزت":"⚠️ لم تجتز")+'</span>'+
          '</div>'+
          '<p style="color:var(--muted);font-size:.86rem;margin:4px 0 0">'+
            'أربعة مقاييس، كلٌّ من 5 ووزنه 25٪ — والنجاح أن تبلغ <b>3</b> في كلٍّ منها (نظام كامبردج).</p>';

    g.subs.forEach(function(s){
      var open = s.band<3 ? " open" : "";
      h+='<details class="wsub"'+open+'><summary><span>'+s.ar+' <span style="color:var(--muted);font-weight:600;font-size:.85rem">'+s.en+'</span></span>'+
         '<span class="wband '+bcls(s.band)+'">'+s.band+' / 5</span></summary><ul class="wchk">';
      s.checks.forEach(function(c){
        h+='<li>'+(c.ok?'✅':'⚠️')+' '+c.label+(!c.ok&&c.hint?'<span class="h">'+c.hint+'</span>':'')+'</li>';
      });
      h+='</ul></details>';
    });

    /* أضعف مقياس أوّلًا — نقطة واحدة يشتغل عليها الآن */
    var weakest=g.subs.slice().sort(function(a,b){ return a.band-b.band; })[0];
    if(weakest.band<5){
      var firstMiss=weakest.checks.filter(function(c){ return !c.ok; })[0];
      h+='<div style="margin-top:10px;background:var(--bg);border-radius:10px;padding:10px 12px;font-size:.92rem">'+
         '👈 <b>ابدأ من هنا:</b> أضعف مقياس عندك هو <b>'+weakest.ar+'</b>'+
         (firstMiss? ' — '+(firstMiss.hint||firstMiss.label) : '')+'</div>';
    } else {
      h+='<div style="margin-top:10px;color:var(--good);font-weight:800">ممتاز! خمسة من خمسة في المقاييس الأربعة 🎉</div>';
    }
    feed.innerHTML=h;

    var byName={}; g.subs.forEach(function(s){ byName[s.en]=s.band; });
    ctx.save({ kind:"writing", correct:g.total, total:20, level:level, cefr:g.cefr, pass:g.pass,
               bands:byName, topic:prompts[pIdx].t, words:g.words, sents:g.sents,
               text:ta.value.slice(0,1500) });
  });
}

window.WritingEN = { render:render, grade:gradeWriting, CEFR:CEFR, PROMPTS:PROMPTS, _gens:GENS, _genN:genN };
})();
