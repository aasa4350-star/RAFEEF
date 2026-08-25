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

/* مواضيع الكتابة الحرّة */
var PROMPTS = {
  1: [
    {t:"My family", h:"Who is in your family? What does each person like to do?", w:35},
    {t:"My school day", h:"What do you do from the morning until you go home?", w:35},
    {t:"My favourite food", h:"What is it? Who cooks it? Why do you like it?", w:30},
    {t:"How I help at home", h:"What jobs do you do? When do you do them?", w:30},
    {t:"My best friend", h:"What is his name? What do you do together?", w:30},
    {t:"A day I enjoyed", h:"Where were you? What did you do? How did you feel?", w:35},
    {t:"My favourite animal", h:"What does it look like? Where does it live? Why do you like it?", w:30},
    {t:"My room", h:"What is in your room? What do you do there?", w:30}
  ],
  2: [
    {t:"The benefits of reading", h:"Give two benefits and an example for each.", w:70},
    {t:"Should students use phones at school?", h:"Give your opinion, then two reasons, then a conclusion.", w:80},
    {t:"A person I admire", h:"Who is it? Describe two qualities and give an example of each.", w:75},
    {t:"How to stay healthy", h:"Explain three habits and why each one matters.", w:75},
    {t:"A trip I will never forget", h:"Where, when, what happened, and how you felt at the end.", w:80},
    {t:"The advantages and disadvantages of the internet", h:"Two advantages, one disadvantage, then your opinion.", w:85},
    {t:"My plans for the future", h:"What do you want to study or become, and why?", w:70},
    {t:"A problem in my city and how to solve it", h:"Describe the problem, its effect, and one solution.", w:80}
  ]
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

/* ===================== مصحّح الكتابة الحرّة ===================== */

var CONNECTORS_1 = ["and","but","because","so","then","also"];
var CONNECTORS_2 = ["however","therefore","because","although","in addition","for example","finally","moreover","as a result","first","then"];

function splitSentences(text){
  return String(text).split(/[.!?]+/).map(function(s){ return s.trim(); }).filter(function(s){ return s.length>0; });
}

/* يُرجع {score, max, checks:[{ok,label,hint}]} — معايير واضحة لا رأي غامض */
function gradeWriting(text, level, target){
  var t=String(text||"").replace(/\s+/g," ").trim();
  var words=t? t.split(/\s+/).filter(function(w){ return /[A-Za-z]/.test(w); }) : [];
  var sents=splitSentences(t);
  var low=t.toLowerCase();
  var conns=(level>=2?CONNECTORS_2:CONNECTORS_1).filter(function(c){
    return new RegExp("(^|[^a-z])"+c.replace(/ /g,"\\s+")+"([^a-z]|$)","i").test(t);
  });
  var minSent = level>=2 ? 5 : 3;
  var minConn = level>=2 ? 2 : 1;

  /* كلّ جملة تبدأ بحرفٍ كبير؟ */
  var badCap=[], i;
  for(i=0;i<sents.length;i++){
    var m=sents[i].match(/[A-Za-z]/);
    if(m && m[0]!==m[0].toUpperCase()) badCap.push(sents[i].slice(0,24));
  }
  /* ضمير المتكلّم صغير؟ */
  var lowerI = /(^|[^A-Za-z])i([^A-Za-z]|$)/.test(t);
  /* حروف عربية داخل النصّ الإنجليزي؟ */
  var arabic = /[؀-ۿ]/.test(t);
  /* تكرار كلمة واحدة بإفراط (خارج الكلمات الوظيفية) */
  var STOP={the:1,a:1,an:1,and:1,to:1,of:1,in:1,is:1,are:1,was:1,were:1,i:1,my:1,it:1,he:1,she:1,we:1,they:1,you:1,that:1,this:1,for:1,on:1,at:1,with:1,but:1,so:1,because:1};
  var freq={}, top="", topN=0;
  words.forEach(function(w){ var k=w.toLowerCase().replace(/[^a-z]/g,""); if(!k||STOP[k]) return;
    freq[k]=(freq[k]||0)+1; if(freq[k]>topN){ topN=freq[k]; top=k; } });
  var overused = words.length>=20 && topN>=Math.max(4, Math.round(words.length*0.12));

  var checks=[
    {ok: words.length>=target, label:"الطول: "+words.length+" كلمة من "+target,
     hint:"اكتب "+(target-words.length>0?(target-words.length):0)+" كلمة إضافية على الأقل."},
    {ok: sents.length>=minSent, label:"عدد الجمل: "+sents.length+" من "+minSent,
     hint:"قسّم أفكارك إلى جملٍ أقصر، كلّ جملةٍ فكرة."},
    /* الفحوص التالية لا تُحتسب ناجحةً على نصٍّ فارغ — لا معنى لنجاحٍ بلا كتابة */
    {ok: words.length>0 && !arabic, label:"النصّ كلّه بالإنجليزية", hint:"فيه حروف عربية — اكتب الفقرة كاملة بالإنجليزية."},
    {ok: sents.length>0 && badCap.length===0, label:"كلّ جملة تبدأ بحرفٍ كبير",
     hint: badCap.length? ("ابدأ بحرفٍ كبير: «"+badCap[0]+"…»") : ""},
    {ok: !!t && /[.!?]$/.test(t), label:"النصّ ينتهي بعلامة ترقيم", hint:"أنهِ آخر جملة بنقطة."},
    {ok: words.length>0 && !lowerI, label:"الضمير I مكتوب كبيرًا", hint:"اكتب I كبيرة دائمًا، لا i."},
    {ok: conns.length>=minConn, label:"أدوات الربط: "+conns.length+" من "+minConn,
     hint:"اربط أفكارك بـ "+(level>=2?"however / therefore / for example":"and / but / because / so")+"."},
    {ok: words.length>0 && !overused, label:"لا تكرار مفرط لكلمة واحدة",
     hint: overused? ("كرّرت «"+top+"» "+topN+" مرّات — نوّع كلماتك.") : ""}
  ];
  var got=checks.filter(function(c){ return c.ok; }).length;
  return {score:got, max:checks.length, checks:checks, words:words.length, sents:sents.length, conns:conns};
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
'.wmeter>i{display:block;height:100%;background:var(--accent);width:0;transition:width .3s}';

function injectCss(){
  if(document.getElementById("wen-css")) return;
  var st=document.createElement("style"); st.id="wen-css"; st.textContent=CSS;
  document.head.appendChild(st);
}

function render(el, ctx){
  injectCss();
  var level = ctx.level || 1;
  var prompts = PROMPTS[level] || PROMPTS[1];
  /* موضوع اليوم يتغيّر يوميًّا ولا يتغيّر بإعادة التحميل في اليوم نفسه */
  var dayIdx = Math.floor((Date.now()+3*3600*1000)/86400000);
  var pIdx = dayIdx % prompts.length;
  var items = genN(GENS[level]||GENS[1], 6);

  var html = ''+
    '<div class="wsec"><b>✍️ التعبير</b> — '+
      (level>=2 ? 'بناء الفقرة: جملة الموضوع، الوحدة، الترتيب، وأدوات الربط.'
                : 'بناء الجملة: الترتيب، الحرف الكبير، النقطة، وأدوات الربط.')+
      '<br><span style="color:var(--muted);font-size:.9rem">قسمان: تدريب سريع مصحّح، ثمّ اكتب فقرتك — وتُحفظ لوالدك ليقرأها.</span></div>'+
    '<div class="wsec"><b>الجزء الأول — تدريب</b><div id="wquiz"></div>'+
      '<div style="text-align:center;font-weight:800;margin-top:10px"><span id="wscore">0 / '+items.length+'</span></div>'+
      '<button class="wbtn ghost" id="wnew">تدريب جديد 🔄</button></div>'+
    '<div class="wsec"><b>الجزء الثاني — اكتب فقرتك</b>'+
      '<div style="margin:8px 0 4px;font-size:1.05rem"><b>'+en(prompts[pIdx].t)+'</b></div>'+
      '<div style="color:var(--muted);font-size:.92rem;margin-bottom:8px">'+en(prompts[pIdx].h)+
        ' — المطلوب '+prompts[pIdx].w+' كلمة على الأقل.</div>'+
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
    bar.style.width=Math.min(100, Math.round(w/prompts[pIdx].w*100))+"%";
    try{ localStorage.setItem(draftKey, ta.value); }catch(e){}
  }
  ta.addEventListener("input", refresh); refresh();

  el.querySelector("#wcheck").addEventListener("click", function(){
    var g=gradeWriting(ta.value, level, prompts[pIdx].w);
    var feed=el.querySelector("#wfeed");
    if(g.words===0){ feed.innerHTML='<div style="color:var(--bad);font-weight:700;margin-top:10px">اكتب فقرتك أولًا ✍️</div>'; return; }
    var pct=Math.round(g.score/g.max*100);
    var h='<div style="margin-top:12px;font-weight:800">النتيجة: '+g.score+' / '+g.max+' ('+pct+'%)</div><ul class="wchk">';
    g.checks.forEach(function(c){
      h+='<li>'+(c.ok?'✅':'⚠️')+' '+c.label+(!c.ok&&c.hint?'<span class="h">'+c.hint+'</span>':'')+'</li>';
    });
    h+='</ul>';
    if(g.score===g.max) h+='<div style="margin-top:8px;color:var(--good);font-weight:800">ممتاز! فقرتك مستوفية كلّ المعايير 🎉</div>';
    else h+='<div style="margin-top:8px;color:var(--muted);font-size:.9rem">صحّح الملاحظات أعلاه ثمّ اضغط «قيّم كتابتي» مرّة ثانية.</div>';
    feed.innerHTML=h;
    ctx.save({ kind:"writing", correct:g.score, total:g.max, level:level,
               topic:prompts[pIdx].t, words:g.words, sents:g.sents, text:ta.value.slice(0,1500) });
  });
}

window.WritingEN = { render:render, grade:gradeWriting, _gens:GENS, _genN:genN };
})();
