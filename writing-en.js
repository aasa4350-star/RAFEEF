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

/* ═══ التعليمةُ نفسُها مادّةُ تعلّم ═══
   طلبُ الأب (٢٥ سبتمبر ٢٠٢٦): «الي مكتوب بالعربي حط تحته الترجمة
   بالانجليزي». وهو في موضعه: هذا قسمُ تعبيرٍ إنجليزيّ، والابنُ يقرأ
   السؤالَ بالعربيّة فيفهم المطلوب، ثمّ يرى صياغتَه الإنجليزيّةَ تحته
   فيألفها — وهي عينُها التي ستأتيه في الاختبار وفي الكتاب. فلا يضيع
   الفهمُ (بالعربيّة) ولا تضيع الألفة (بالإنجليزيّة).
   tr  = سطرُ تعليمةٍ عربيٌّ تحته ترجمتُه.  trs = ترجمةٌ وحدها لعنوانٍ أو زرّ. */
function tr(ar, enTxt){ return ar+'<div class="wtr" dir="ltr">'+enTxt+'</div>'; }
function trs(enTxt){ return '<div class="wtr" dir="ltr">'+enTxt+'</div>'; }
/* وسمٌ صغيرٌ في السطر نفسه — للأزرار والعناوين القصيرة */
function trI(enTxt){ return ' <span class="wen" style="font-weight:600;font-size:.82rem;opacity:.75">'+esc(enTxt)+'</span>'; }

/* بلاغ الأب (١ سبتمبر ٢٠٢٦): «حتى التعبير حط فيه علاجي» — نفس نمط
   الفيديو التوضيحي الموجود في كل درسٍ آخر بالموقع، لأضعف مقياسٍ من
   مقاييس كامبردج الأربعة بعد كل تقييم. */
var WRITING_YT = {
  "Content":"طريقة كتابة فقرة انجليزي تغطية نقاط الموضوع content",
  "Organisation":"أدوات الربط في الكتابة الانجليزية linking words paragraph organisation",
  "Language":"تحسين الاملاء والترقيم والمفردات في الكتابة الانجليزية",
  "Communicative Achievement":"اسلوب الكتابة الرسمي في الانجليزي paragraph writing style"
};
function ytLinkHtmlW(nameEn, label){
  var q = WRITING_YT[nameEn]; if(!q) return '';
  return '<div style="margin-top:8px"><a href="https://www.youtube.com/results?search_query='+encodeURIComponent(q)+'" target="_blank" rel="noopener" style="display:inline-block;text-decoration:none;background:#dc2626;color:#fff;padding:9px 14px;border-radius:11px;font-weight:800;font-size:.88rem">🎬 شاهد شرح '+(label||'الدرس')+'</a></div>';
}
/* أسئلةُ ستيب أربعةُ خيارات، وpick3 ثلاثةٌ — فنموذجُ فهدٍ الموزونُ كان
   يُعطي في التحليلِ الكتابيِّ ثلاثةً فيرتفع حظُّ التخمينِ من ٢٥٪ إلى ٣٣٪.
   فأُضيف pick4 ومشتّتٌ رابعٌ لكلِّ بندٍ في بنوكِ المستوى الثالث. */
function pick4(correct, wrongs){
  var seen={}, out=[correct]; seen[correct]=1;
  for(var i=0;i<wrongs.length && out.length<4;i++){ var w=wrongs[i]; if(w && !seen[w]){ seen[w]=1; out.push(w); } }
  if(out.length<4) return null;
  shuffle(out); return [out, out.indexOf(correct)];
}
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
   ومجموعةُ كلماتٍ نستدلّ بها على أنّ الطفل تناولها فعلًا.

   ── التوسيعُ (٢٣ نوفمبر ٢٠٢٦) ──────────────────────────────────────
   طلبُ الأب: «وسّع بنك مواضيع التعبير». وأصلُ الشكوى أقدمُ: كان البنكُ
   ثمانيةَ مواضيعَ فدارت عليه ثمانيةُ أيّامٍ بترتيبٍ واحد، فحفِظ حسنٌ
   نصوصَه وأخذ الدرجةَ كاملةً بالذاكرةِ لا بالكتابةِ وقالها لأبيه. ثمّ
   صار ثلاثين فصارت الدورةُ شهريّة.

   فزِيد ستّون موضوعًا للمستوى الأوّلِ (سعودٌ وأسامة) وستّون للثاني
   (حسنٌ ورفيف)، فصار كلٌّ منهما تسعين. وقِيس أثرُه على سنتَين بجدولِ
   الصفحةِ نفسِه:
       معدّلُ الفجوةِ بين إعادتَي الموضوع   ٣٠ يومًا ← ٨٩ يومًا
       إعاداتٌ قبل ثلاثين يومًا               ٤٨٪  ← ٥٪
   والخمسةُ الباقيةُ من حدِّ الدورة: الترتيبُ يُخلَط في كلِّ دورةٍ خلطًا
   مستقلًّا، فموضوعٌ في آخرِ دورةٍ قد يقع في أوّلِ التي بعدها.

   ── والمستوى الثالث (٢٣ نوفمبر ٢٠٢٦، بعد ساعات) ────────────────────
   كنتُ تركتُه ثلاثين لأنّه لا يستعمله أحد. ثمّ قال الأبُ في مسائه:
   «شف فهد في التعبير — ترى اليوم أوّل مرّة يجرّب». فهو مستعملٌ من
   اليوم: practice.html تُسنِد إليه المستوى الثالثَ وهدفَ B2، وقد حلَّ
   تدريبَ التحليلِ الكتابيِّ مرّتَين (٣/٦ ثمّ ٥/٦) ولم يكتب مقالًا بعد.
   فزِيد ستّون موضوعًا جدليًّا على نمطِه (موقفٌ، ثمّ حجّتان بدليل، ثمّ
   إقرارٌ بنقطةٍ للخصمِ وردُّها) فصار تسعين كأخويه.

   ⚠️ وفي التوسيعِ نفسِه زلّةٌ تستحقّ الذكر: فاصلةٌ زائدةٌ «]},,» خلّفت
   موضعًا خاليًا في الفهرسِ الثلاثين من كلِّ بنك، فصار العدُّ أحدًا
   وتسعين والبنودُ تسعين. ولم يمسكها فحصُ البنيةِ لأنّه بـfilter وهو
   يتخطّى مواضعَ المصفوفةِ الخالية. فأُصلِحت، وأُضيف إلى الفحصِ عدُّ
   الفجواتِ بالفهرسِ لا بالقيمة — ولو نُشِرت لصادف الجدولُ ذلك الموضعَ
   يومًا من تسعين فطُلِب من الطفلِ موضوعٌ غيرُ موجود. */
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
    ]},
    /* ═══ اثنان وعشرون موضوعًا جديدًا (٢٠ نوفمبر ٢٠٢٦) ════════════════
       العلّةُ هي علّةُ المستوى الثاني: ثمانيةُ مواضيعَ دورتُها ثمانيةُ
       أيّامٍ تُحفَظ نصوصُها، وقد وقع فيها حسنٌ وقالها لأبيه. فوُسِّع هذا
       البنكُ قبل أن يقع فيها سعودٌ وأسامة.
       وهي من دنيا ابنِ الرابعِ والخامسِ: لعبُه وطريقُه إلى المدرسةِ
       وفطورُه وجدُّه وجدّتُه — جملٌ قصيرةٌ عن معلومٍ لا إنشاءٌ عن مجهول.
       وكلماتُها صيغٌ يقولها هو: play وgo وlike، ومعها صيغةُ الغائبِ
       (plays · goes) لأنّ الفحصَ يقابل الكلمةَ بنصِّه كما كتبها. */
    {t:"My favourite game", h:"What is the game? Who do you play it with? Why do you like it?", points:[
      {q:"Name the game you like", k:["game","play","plays","football","chess","cards","hide","tag","video","phone","tablet","computer","ball","like","favourite","favorite"]},
      {q:"Say who you play with and when", k:["with","brother","sister","friends","friend","cousins","father","dad","after school","evening","weekend","friday","every day","sometimes"]},
      {q:"Say why you like it", k:["because","fun","funny","easy","exciting","happy","enjoy","win","together","best","love","like"]}
    ]},
    {t:"What I do after school", h:"What do you do first? What do you do next? What is the best part?", points:[
      {q:"Say what you do first", k:["after school","home","first","eat","lunch","rest","sleep","wash","change","pray","sit","arrive","come"]},
      {q:"Say what you do next", k:["then","next","homework","study","read","play","help","mother","watch","tv","go out","bike","ride"]},
      {q:"Say which part you like best", k:["best","like","love","favourite","favorite","because","happy","fun","enjoy","part","most"]}
    ]},
    {t:"My favourite sport", h:"What sport is it? When do you do it? How do you feel after it?", points:[
      {q:"Name the sport", k:["sport","football","swimming","swim","running","run","cycling","bike","basketball","volleyball","karate","tennis","walking","play","plays"]},
      {q:"Say when and where you do it", k:["school","club","park","street","garden","home","every","week","day","friday","evening","morning","with","team","friends"]},
      {q:"Say how you feel after it", k:["feel","happy","strong","tired","good","better","healthy","fit","because","like","love","enjoy"]}
    ]},
    {t:"A place I like to visit", h:"Where is it? Who do you go with? What do you do there?", points:[
      {q:"Name the place", k:["place","park","mall","beach","farm","zoo","mosque","library","garden","city","village","grandfather","grandmother","house","visit","go"]},
      {q:"Say who you go with and how", k:["with","family","father","dad","mother","mum","brother","sister","car","bus","walk","drive","every","sometimes","weekend"]},
      {q:"Say what you do there", k:["play","eat","walk","run","swim","see","look","buy","sit","talk","pray","take","photos","fun","happy"]}
    ]},
    {t:"My brother or my sister", h:"Who is it? What does he or she like? What do you do together?", points:[
      {q:"Say who it is and how old", k:["brother","sister","older","younger","big","small","years","old","name","he","she","my"]},
      {q:"Say what he or she likes or does", k:["likes","like","loves","plays","play","studies","study","reads","read","works","school","football","draws","sings","cooks","watches"]},
      {q:"Say what you do together", k:["together","we","play","go","eat","watch","talk","help","study","share","laugh","because","best","love"]}
    ]},
    {t:"My favourite thing", h:"What is it? Where did you get it? Why is it special?", points:[
      {q:"Name the thing", k:["thing","toy","car","ball","bike","bicycle","watch","book","phone","tablet","game","bag","shoes","pen","box","favourite","favorite"]},
      {q:"Say where you got it", k:["father","dad","mother","mum","grandfather","grandmother","uncle","gift","present","bought","buy","shop","birthday","eid","gave","got"]},
      {q:"Say why it is special to you", k:["because","special","like","love","best","old","new","keep","always","use","happy","beautiful","nice"]}
    ]},
    {t:"How I go to school", h:"How do you travel? How long does it take? What do you see on the way?", points:[
      {q:"Say how you travel", k:["bus","car","walk","walking","bike","bicycle","father","dad","drive","drives","take","takes","go","school"]},
      {q:"Say how long it takes or when you leave", k:["minutes","minute","hour","early","morning","seven","six","eight","clock","long","short","near","far","leave"]},
      {q:"Say what you see on the way", k:["see","road","street","shop","shops","mosque","trees","cars","people","friends","houses","park","sometimes","every"]}
    ]},
    {t:"What I eat for breakfast", h:"What do you eat? Who makes it? Why is breakfast important?", points:[
      {q:"Name what you eat and drink", k:["breakfast","eat","eats","bread","eggs","cheese","milk","tea","juice","dates","honey","yogurt","fruit","banana","water","drink"]},
      {q:"Say who makes it and when", k:["mother","mum","mom","father","dad","i make","makes","sister","brother","morning","early","before","school","together","table"]},
      {q:"Say why breakfast is important", k:["because","important","strong","energy","hungry","healthy","study","school","feel","better","good","need"]}
    ]},
    {t:"My grandfather and my grandmother", h:"Where do they live? What do they do with you? How do you feel about them?", points:[
      {q:"Say who they are and where they live", k:["grandfather","grandmother","grandpa","grandma","live","lives","house","village","city","near","far","visit","weekend","friday"]},
      {q:"Say what they do with you", k:["tell","tells","story","stories","cook","cooks","give","gives","play","sit","talk","walk","take","teach","teaches","money","sweets"]},
      {q:"Say how you feel about them", k:["love","happy","kind","good","best","because","miss","like","proud","lucky","always"]}
    ]},
    {t:"A party I went to", h:"What was the party for? Who was there? What did you do?", points:[
      {q:"Say what the party was for", k:["party","birthday","eid","wedding","school","prize","new","house","baby","was","went","last","invited"]},
      {q:"Say who was there", k:["family","friends","cousins","brother","sister","father","mother","uncle","aunt","children","everyone","many","people","with"]},
      {q:"Say what you did and how you felt", k:["ate","eat","food","cake","played","play","sang","danced","laughed","gift","present","happy","fun","best","because"]}
    ]},
    {t:"My favourite story", h:"What is the story about? Who is in it? Why do you like it?", points:[
      {q:"Say what the story is about", k:["story","book","cartoon","film","movie","about","boy","girl","animal","lion","prophet","hero","adventure","read","watch"]},
      {q:"Name the people or animals in it", k:["he","she","they","boy","girl","man","woman","friend","friends","lion","bird","cat","dog","family","name","called"]},
      {q:"Say why you like it", k:["because","like","love","funny","exciting","sad","happy","brave","kind","learn","best","favourite","favorite","again"]}
    ]},
    {t:"What I want to be when I grow up", h:"What job do you want? Why do you want it? What will you study?", points:[
      {q:"Name the job you want", k:["want","be","become","doctor","teacher","engineer","pilot","police","nurse","driver","cook","chef","vet","big","grow"]},
      {q:"Say why you want it", k:["because","help","helps","people","like","love","good","money","important","father","mother","fun","interesting","sick","children"]},
      {q:"Say what you will study or do", k:["study","school","english","maths","math","science","read","learn","work","hard","university","will","must","need"]}
    ]},
    {t:"A rainy day", h:"When did it rain? What did you do? How did you feel?", points:[
      {q:"Say when it rained", k:["rain","rained","raining","yesterday","last","winter","morning","evening","night","week","day","cold","sky","clouds"]},
      {q:"Say what you did", k:["stayed","stay","home","inside","played","play","watched","watch","read","drank","tea","out","went","umbrella","jumped","water"]},
      {q:"Say how you felt about it", k:["happy","cold","fun","beautiful","liked","like","love","because","nice","smell","school","closed","excited"]}
    ]},
    {t:"My friend's house", h:"Where is it? What is in it? What do you do there?", points:[
      {q:"Say where the house is", k:["friend","house","near","next","far","street","same","our","my","neighbour","neighbor","live","lives","beside","behind"]},
      {q:"Say what is in it or what it looks like", k:["big","small","garden","room","rooms","tree","trees","door","yard","new","old","beautiful","clean","two","three"]},
      {q:"Say what you do there", k:["play","study","eat","watch","talk","sit","games","football","homework","together","we","go","visit","fun"]}
    ]},
    {t:"What I do on Friday", h:"What happens in the morning? What do you do with the family? What is the best part?", points:[
      {q:"Say what you do in the morning", k:["friday","morning","sleep","wake","late","mosque","pray","prayer","breakfast","father","go","rest","no school"]},
      {q:"Say what you do with the family", k:["family","lunch","eat","visit","grandfather","grandmother","uncle","cousins","park","mall","car","together","we","drive"]},
      {q:"Say which part is best and why", k:["best","like","love","because","happy","fun","favourite","favorite","day","rest","together","free","enjoy"]}
    ]},
    {t:"My favourite fruit", h:"What fruit is it? What does it taste like? When do you eat it?", points:[
      {q:"Name the fruit", k:["fruit","apple","banana","orange","grapes","dates","mango","watermelon","strawberry","peach","lemon","favourite","favorite","like"]},
      {q:"Say what it tastes or looks like", k:["sweet","sour","red","green","yellow","orange","small","big","round","soft","juice","juicy","taste","tastes","colour","color"]},
      {q:"Say when you eat it and why", k:["eat","eats","breakfast","after","lunch","school","morning","every","day","because","healthy","good","vitamins","strong","like"]}
    ]},
    {t:"A pet I have or want", h:"What animal is it? How do you take care of it? Why do you like it?", points:[
      {q:"Name the animal", k:["pet","cat","dog","bird","birds","fish","rabbit","hamster","camel","sheep","horse","want","have","my"]},
      {q:"Say how you take care of it", k:["feed","feeds","food","water","clean","wash","play","walk","cage","house","every day","give","gives","take care","look after"]},
      {q:"Say why you like it", k:["because","like","love","cute","soft","friendly","quiet","funny","happy","friend","best","plays","beautiful"]}
    ]},
    {t:"My favourite lesson at school", h:"Which lesson is it? What do you do in it? Why do you like it?", points:[
      {q:"Name the lesson", k:["lesson","subject","english","maths","math","science","arabic","islamic","art","sport","computer","history","favourite","favorite","like"]},
      {q:"Say what you do in it", k:["read","write","draw","count","play","work","listen","speak","answer","questions","book","teacher","board","group","experiment"]},
      {q:"Say why you like it", k:["because","easy","fun","interesting","teacher","kind","good","learn","like","love","best","understand","clever"]}
    ]},
    {t:"Helping my mother at home", h:"What do you help with? When do you help? How does she feel?", points:[
      {q:"Say what you help with", k:["help","helps","mother","mum","mom","clean","wash","dishes","table","cook","kitchen","carry","bags","tidy","room","clothes"]},
      {q:"Say when you help", k:["every day","after school","evening","morning","friday","weekend","before","after","lunch","dinner","sometimes","always","when"]},
      {q:"Say how she feels and how you feel", k:["happy","glad","proud","smiles","says","thank","because","good","love","feel","like","better","easy"]}
    ]},
    {t:"The best food in Ramadan", h:"What food do you like? Who makes it? What happens at iftar?", points:[
      {q:"Name the food you like", k:["ramadan","food","soup","dates","samosa","bread","rice","chicken","meat","juice","water","sweets","kunafa","best","like","favourite","favorite"]},
      {q:"Say who makes it and when", k:["mother","mum","grandmother","father","family","makes","make","cook","cooks","before","iftar","sunset","evening","kitchen","together"]},
      {q:"Say what happens at iftar", k:["iftar","table","sit","eat","pray","dates","water","family","together","happy","wait","azan","break","fast","after"]}
    ]},
    {t:"My school bag", h:"What is in it? What colour is it? Who gave it to you?", points:[
      {q:"Say what is in your bag", k:["bag","books","book","pen","pens","pencil","ruler","notebook","water","bottle","lunch","box","copybook","colours","colors","eraser"]},
      {q:"Say what it looks like", k:["colour","color","blue","red","black","green","big","small","new","old","heavy","light","pocket","pockets","strong","nice"]},
      {q:"Say who gave it to you and how you keep it", k:["father","dad","mother","mum","uncle","gave","bought","gift","clean","tidy","keep","every day","carry","school","careful"]}
    ]},
    {t:"A day I helped someone", h:"Who did you help? What did you do? How did you feel after?", points:[
      {q:"Say who you helped", k:["helped","help","friend","brother","sister","mother","father","teacher","neighbour","neighbor","old","man","woman","boy","girl","someone"]},
      {q:"Say what you did", k:["carried","carry","gave","give","showed","show","taught","opened","cleaned","found","water","money","bag","homework","door","road"]},
      {q:"Say how you felt after", k:["felt","feel","happy","good","proud","glad","because","smiled","thanked","thank","nice","better","again","love"]}
    ]},
    {t:"My favourite colour", h:"What colour do you like? What things have this colour? Why do you like it?", points:[
      {q:"Say which colour you like", k:["red","blue","green","yellow","white","black","orange","brown","purple","pink","grey","favourite","colour","color","like"]},
      {q:"Name things with that colour", k:["car","shirt","bag","wall","sky","sea","tree","flower","ball","door","book","pen","room","my"]},
      {q:"Say why you like it", k:["because","beautiful","nice","happy","calm","bright","clean","like","love","makes","feel"]}]},
    {t:"My neighbour", h:"Who is your neighbour? What does he or she do? How do you help each other?", points:[
      {q:"Say who your neighbour is", k:["neighbour","neighbor","lives","next","house","family","man","woman","boy","girl","near","beside","our"]},
      {q:"Say what your neighbour does", k:["teacher","driver","doctor","works","shop","school","engineer","police","nurse","farmer","sells","builds"]},
      {q:"Say how you help each other", k:["help","helps","helped","give","gives","bring","brings","share","shares","kind","good","together","food"]}]},
    {t:"The weather today", h:"What is the weather like? What do you wear? What do you do in this weather?", points:[
      {q:"Say what the weather is like", k:["hot","cold","sunny","rainy","windy","cloudy","warm","cool","weather","today","dust","sand"]},
      {q:"Say what you wear", k:["wear","wears","jacket","coat","shirt","cap","hat","shoes","sandals","clothes","thick","light"]},
      {q:"Say what you do in this weather", k:["play","stay","go","drink","water","inside","outside","home","park","school","because","like"]}]},
    {t:"My favourite drink", h:"What do you like to drink? When do you drink it? Why do you like it?", points:[
      {q:"Say what you like to drink", k:["water","milk","juice","tea","laban","orange","apple","mango","drink","like","favourite","love"]},
      {q:"Say when you drink it", k:["morning","breakfast","lunch","dinner","evening","night","school","after","before","every","day","hot","thirsty"]},
      {q:"Say why you like it", k:["because","sweet","cold","good","healthy","tasty","nice","strong","like","makes","feel","body"]}]},
    {t:"A book I read", h:"What is the book about? What did you like in it? Would you tell your friend about it?", points:[
      {q:"Say what the book is about", k:["book","story","read","about","animals","boy","girl","school","science","history","prophet","adventure","pictures"]},
      {q:"Say what you liked in it", k:["liked","like","best","part","funny","interesting","picture","pictures","end","nice","learned","new"]},
      {q:"Say if you would tell a friend", k:["friend","tell","should","read","give","my","yes","also","because","good","everyone","class"]}]},
    {t:"My teacher", h:"Who is your teacher? What does he or she teach? Why do you like your teacher?", points:[
      {q:"Say who your teacher is", k:["teacher","my","class","school","name","teaches","teach","is","new","first"]},
      {q:"Say what your teacher teaches", k:["english","math","maths","science","arabic","quran","islamic","sport","art","reading","writing","lesson"]},
      {q:"Say why you like your teacher", k:["because","kind","good","helps","help","explains","patient","nice","smiles","never","angry","best","learn"]}]},
    {t:"What I do before bed", h:"What do you do in the evening? When do you sleep? Why is sleep good?", points:[
      {q:"Say what you do in the evening", k:["evening","night","brush","teeth","wash","read","pray","homework","drink","milk","family","sit","talk"]},
      {q:"Say when you sleep", k:["sleep","bed","nine","ten","eight","early","late","oclock","clock","time","night","go"]},
      {q:"Say why sleep is good", k:["because","rest","strong","body","brain","school","tired","energy","grow","healthy","morning","good"]}]},
    {t:"My favourite day of the week", h:"Which day do you like? What happens on that day? How do you feel?", points:[
      {q:"Say which day you like", k:["friday","thursday","saturday","sunday","monday","tuesday","wednesday","day","week","favourite","like","best"]},
      {q:"Say what happens on that day", k:["no","school","sleep","play","visit","grandfather","grandmother","family","mosque","park","eat","rest","go"]},
      {q:"Say how you feel on that day", k:["happy","free","rest","good","fun","because","love","like","enjoy","feel","excited"]}]},
    {t:"A toy I like", h:"What is the toy? Who gave it to you? How do you play with it?", points:[
      {q:"Say what the toy is", k:["toy","ball","car","bike","robot","doll","blocks","game","kite","puzzle","my","favourite"]},
      {q:"Say who gave it to you", k:["father","mother","brother","sister","uncle","aunt","friend","grandfather","grandmother","gave","bought","gift","present"]},
      {q:"Say how you play with it", k:["play","throw","build","ride","drive","push","make","with","friends","brother","home","outside","garden"]}]},
    {t:"The shop near my house", h:"What is the shop? What do you buy there? Who works there?", points:[
      {q:"Say what the shop is", k:["shop","store","market","bakery","near","house","street","small","big","our","beside"]},
      {q:"Say what you buy there", k:["buy","bread","milk","rice","eggs","fruit","water","juice","sweets","book","pen","food"]},
      {q:"Say who works there", k:["man","works","work","seller","owner","kind","gives","helps","knows","name","always","smiles"]}]},
    {t:"My favourite vegetable", h:"Which vegetable do you like? How do you eat it? Why is it good for you?", points:[
      {q:"Say which vegetable you like", k:["carrot","tomato","cucumber","potato","onion","lettuce","pepper","vegetable","like","favourite","eat"]},
      {q:"Say how you eat it", k:["salad","soup","cooked","raw","rice","sandwich","mother","cooks","cook","with","eat","lunch","dinner"]},
      {q:"Say why it is good for you", k:["because","healthy","good","body","strong","vitamins","grow","eyes","energy","clean","water"]}]},
    {t:"A day at the hospital or clinic", h:"Why did you go? What did the doctor say? How did you feel after?", points:[
      {q:"Say why you went", k:["sick","ill","pain","fever","tooth","cold","hurt","arm","leg","head","went","because","clinic","hospital"]},
      {q:"Say what the doctor said", k:["doctor","said","gave","medicine","rest","drink","water","sleep","two","days","told","check"]},
      {q:"Say how you felt after", k:["better","good","happy","well","strong","again","school","felt","feel","now","thank"]}]},
    {t:"My favourite month", h:"Which month do you like? What happens in it? Why do you like it?", points:[
      {q:"Say which month you like", k:["ramadan","january","march","june","july","december","month","favourite","like","best","eid"]},
      {q:"Say what happens in it", k:["holiday","eid","fast","school","no","rain","cold","hot","travel","family","visit","gifts","play"]},
      {q:"Say why you like it", k:["because","happy","fun","family","rest","food","free","love","like","together","best"]}]},
    {t:"How I keep my room clean", h:"What do you do to clean it? When do you clean it? How does it look after?", points:[
      {q:"Say what you do to clean it", k:["clean","tidy","bed","make","put","books","clothes","floor","sweep","wipe","shelf","away","bag"]},
      {q:"Say when you clean it", k:["morning","every","day","week","friday","after","school","before","sleep","always","sometimes"]},
      {q:"Say how it looks after", k:["clean","nice","tidy","good","better","happy","mother","feel","like","room","because"]}]},
    {t:"A new word I learned", h:"What is the word? What does it mean? How did you learn it?", points:[
      {q:"Say what the word is", k:["word","new","learned","learn","english","arabic","means","mean","is","my","today","class"]},
      {q:"Say what it means", k:["means","mean","same","like","opposite","it","this","example","for","say","word","when"]},
      {q:"Say how you learned it", k:["teacher","book","story","friend","father","mother","school","class","read","heard","video","lesson"]}]},
    {t:"My favourite place at school", h:"Which place is it? What do you do there? Why do you like it?", points:[
      {q:"Say which place it is", k:["library","playground","class","classroom","canteen","mosque","garden","hall","field","place","school","favourite"]},
      {q:"Say what you do there", k:["read","play","eat","pray","sit","run","talk","study","friends","football","books","learn"]},
      {q:"Say why you like it", k:["because","quiet","big","fun","clean","cool","friends","nice","like","love","best","happy"]}]},
    {t:"Water in our life", h:"Where do we get water? What do we use it for? Why must we not waste it?", points:[
      {q:"Say where we get water", k:["tap","well","rain","sea","desalination","bottle","pipe","water","comes","from","get"]},
      {q:"Say what we use it for", k:["drink","wash","clean","cook","plants","trees","shower","wudu","garden","car","use","food"]},
      {q:"Say why we must not waste it", k:["because","waste","important","life","desert","little","save","close","tap","need","everyone","plants"]}]},
    {t:"A bird I saw", h:"Where did you see it? What did it look like? What was it doing?", points:[
      {q:"Say where you saw it", k:["tree","garden","roof","sky","park","window","school","street","saw","see","yesterday","near"]},
      {q:"Say what it looked like", k:["small","big","white","black","brown","grey","yellow","wings","beak","feathers","beautiful","colour","long"]},
      {q:"Say what it was doing", k:["flying","eating","singing","sitting","drinking","building","nest","looking","water","seeds","was","jumped"]}]},
    {t:"My father's work", h:"What does your father do? Where does he work? How do you feel about his work?", points:[
      {q:"Say what your father does", k:["father","dad","works","work","teacher","driver","doctor","engineer","police","soldier","shop","office","builder"]},
      {q:"Say where he works", k:["school","hospital","office","company","shop","city","near","far","every","day","goes","morning"]},
      {q:"Say how you feel about it", k:["proud","happy","because","hard","helps","people","good","important","like","love","tired","respect"]}]},
    {t:"The best gift I got", h:"What was the gift? Who gave it to you? Why was it special?", points:[
      {q:"Say what the gift was", k:["gift","present","bike","watch","book","ball","phone","shoes","game","money","got","new"]},
      {q:"Say who gave it to you", k:["father","mother","brother","sister","uncle","aunt","grandfather","grandmother","friend","gave","eid","birthday"]},
      {q:"Say why it was special", k:["because","wanted","long","time","first","loved","happy","special","best","still","use","keep"]}]},
    {t:"A time I was afraid", h:"What happened? Why were you afraid? What did you do?", points:[
      {q:"Say what happened", k:["dark","night","alone","dog","noise","lost","fell","storm","thunder","was","were","happened","one"]},
      {q:"Say why you were afraid", k:["afraid","scared","because","dark","loud","alone","big","noise","could","not","see","fear"]},
      {q:"Say what you did", k:["ran","called","shouted","held","prayed","mother","father","brother","light","stayed","went","told","then"]}]},
    {t:"How I learn English", h:"What do you do to learn? What is hard for you? What helps you most?", points:[
      {q:"Say what you do to learn", k:["read","write","listen","speak","study","watch","videos","words","school","every","day","practise","practice"]},
      {q:"Say what is hard for you", k:["hard","difficult","spelling","speaking","listening","words","writing","sometimes","forget","new","grammar","because"]},
      {q:"Say what helps you most", k:["helps","help","teacher","father","mother","friend","book","app","repeat","practise","practice","cards","most"]}]},
    {t:"My favourite kind of sweets", h:"What sweets do you like? When do you eat them? Why only a little?", points:[
      {q:"Say what sweets you like", k:["chocolate","cake","dates","candy","ice","cream","biscuit","sweets","like","favourite","eat"]},
      {q:"Say when you eat them", k:["eid","friday","party","after","lunch","dinner","sometimes","weekend","birthday","school","only","when"]},
      {q:"Say why only a little", k:["because","teeth","sugar","healthy","not","many","little","bad","doctor","mother","says","good"]}]},
    {t:"An animal I do not like", h:"Which animal is it? Why do you not like it? What do you do when you see it?", points:[
      {q:"Say which animal it is", k:["snake","spider","mouse","rat","insect","fly","cockroach","dog","cat","not","like","animal"]},
      {q:"Say why you do not like it", k:["because","afraid","scared","dirty","bite","bites","fast","ugly","dangerous","noise","small","moves"]},
      {q:"Say what you do when you see it", k:["run","call","tell","mother","father","go","away","stay","far","shout","leave","room","then"]}]},
    {t:"My school uniform", h:"What do you wear to school? What colour is it? Why is a uniform good?", points:[
      {q:"Say what you wear to school", k:["uniform","shirt","trousers","thobe","shoes","socks","belt","wear","school","every","day","my"]},
      {q:"Say what colour it is", k:["white","blue","grey","black","brown","green","colour","color","is","dark","light"]},
      {q:"Say why a uniform is good", k:["because","same","all","students","clean","easy","tidy","no","think","clothes","equal","good","school"]}]},
    {t:"The food my mother cooks best", h:"What does she cook? When do you eat it? How does it taste?", points:[
      {q:"Say what she cooks", k:["kabsa","rice","chicken","meat","soup","fish","bread","eggs","pasta","mother","cooks","cook","best"]},
      {q:"Say when you eat it", k:["friday","lunch","dinner","eid","guests","weekend","every","week","after","school","when","night"]},
      {q:"Say how it tastes", k:["delicious","good","tasty","hot","sweet","best","like","love","eat","more","because","smell"]}]},
    {t:"A friend who moved away", h:"Who was he or she? What did you do together? How do you feel now?", points:[
      {q:"Say who the friend was", k:["friend","best","classmate","neighbour","neighbor","boy","girl","school","my","name","was","lived"]},
      {q:"Say what you did together", k:["played","studied","walked","talked","football","sat","together","school","home","every","day","shared","laughed"]},
      {q:"Say how you feel now", k:["miss","sad","sometimes","call","remember","happy","still","friend","because","hope","see","again","feel"]}]},
    {t:"My favourite number", h:"Which number do you like? Where do you see it? Why do you like it?", points:[
      {q:"Say which number you like", k:["number","seven","five","ten","three","nine","two","one","eight","favourite","like","best"]},
      {q:"Say where you see it", k:["shirt","class","house","bus","door","phone","page","game","team","room","see","my"]},
      {q:"Say why you like it", k:["because","easy","lucky","birthday","age","like","nice","remember","first","always","love"]}]},
    {t:"How I help my father", h:"What do you do to help him? When do you help? How does he feel?", points:[
      {q:"Say what you do to help", k:["help","carry","wash","car","clean","bring","water","garden","shop","bags","work","tools","hold"]},
      {q:"Say when you help", k:["friday","weekend","evening","after","school","morning","always","sometimes","when","home","day","asks"]},
      {q:"Say how he feels", k:["happy","proud","thanks","smiles","says","good","son","because","glad","love","feels","tells"]}]},
    {t:"A day it rained", h:"When did it rain? What did you see? What did you do?", points:[
      {q:"Say when it rained", k:["yesterday","last","week","night","morning","winter","friday","day","rained","rain","was","started"]},
      {q:"Say what you saw", k:["water","street","puddles","clouds","sky","dark","trees","wet","thunder","lightning","cars","saw","grey"]},
      {q:"Say what you did", k:["stayed","home","played","watched","window","walked","ran","school","umbrella","drank","tea","inside","then"]}]},
    {t:"My bicycle", h:"Do you have a bicycle? Where do you ride it? How do you stay safe?", points:[
      {q:"Say about your bicycle", k:["bicycle","bike","have","new","old","red","blue","small","big","my","got","father"]},
      {q:"Say where you ride it", k:["street","park","garden","near","house","school","road","friend","ride","with","around","outside"]},
      {q:"Say how you stay safe", k:["helmet","careful","slow","look","cars","road","not","fast","safe","side","stop","because"]}]},
    {t:"A tree near my house", h:"What tree is it? What does it look like? Why are trees good?", points:[
      {q:"Say what tree it is", k:["tree","palm","date","lemon","olive","neem","big","old","near","house","garden","street"]},
      {q:"Say what it looks like", k:["tall","green","leaves","branches","trunk","wide","shade","fruit","dates","high","long","thick"]},
      {q:"Say why trees are good", k:["because","shade","air","clean","oxygen","birds","fruit","beautiful","cool","good","give","help"]}]},
    {t:"My favourite TV programme", h:"What do you watch? When do you watch it? What do you like in it?", points:[
      {q:"Say what you watch", k:["cartoon","programme","program","show","match","football","film","movie","watch","like","favourite","channel"]},
      {q:"Say when you watch it", k:["evening","night","after","school","friday","weekend","homework","every","day","before","sleep","sometimes"]},
      {q:"Say what you like in it", k:["funny","exciting","because","story","player","hero","learn","new","interesting","like","best","part"]}]},
    {t:"The mosque near us", h:"Where is it? When do you go? How do you feel there?", points:[
      {q:"Say where the mosque is", k:["mosque","near","house","street","school","beside","next","our","small","big","walk","minutes"]},
      {q:"Say when you go", k:["friday","maghrib","fajr","prayer","pray","every","day","father","with","morning","evening","go"]},
      {q:"Say how you feel there", k:["quiet","calm","good","happy","clean","peace","because","feel","like","love","beautiful"]}]},
    {t:"A day I was late", h:"Why were you late? What happened? What will you do next time?", points:[
      {q:"Say why you were late", k:["late","slept","woke","alarm","bus","traffic","forgot","because","did","not","hear","early"]},
      {q:"Say what happened", k:["teacher","said","class","started","ran","missed","lesson","door","sorry","walked","stood","then"]},
      {q:"Say what you will do next time", k:["will","sleep","early","wake","alarm","ready","bag","night","before","next","time","not"]}]},
    {t:"My favourite fish or sea animal", h:"Which one is it? Where does it live? What do you know about it?", points:[
      {q:"Say which one it is", k:["fish","dolphin","shark","turtle","whale","crab","octopus","favourite","like","sea","animal"]},
      {q:"Say where it lives", k:["sea","water","ocean","red","gulf","deep","lives","live","swims","salt","near","rocks"]},
      {q:"Say what you know about it", k:["big","small","fast","eats","swims","breathes","clever","beautiful","teeth","shell","colour","long"]}]},
    {t:"How I use a phone or tablet", h:"What do you use it for? How long do you use it? Why is too much bad?", points:[
      {q:"Say what you use it for", k:["phone","tablet","games","videos","learn","english","call","read","homework","watch","play","use"]},
      {q:"Say how long you use it", k:["hour","hours","minutes","half","after","homework","day","only","little","evening","sometimes","time"]},
      {q:"Say why too much is bad", k:["because","eyes","sleep","head","tired","study","less","time","family","bad","health","not"]}]},
    {t:"A thing I lost", h:"What did you lose? Where did you lose it? What happened after?", points:[
      {q:"Say what you lost", k:["lost","pen","bag","book","watch","money","key","toy","phone","ball","shoe","my"]},
      {q:"Say where you lost it", k:["school","class","bus","street","park","home","shop","playground","somewhere","room","friend","house"]},
      {q:"Say what happened after", k:["found","looked","searched","teacher","mother","helped","gave","sad","happy","again","never","then","bought"]}]},
    {t:"My classroom", h:"What is in it? Where do you sit? What do you like about it?", points:[
      {q:"Say what is in it", k:["desk","desks","chair","chairs","board","window","door","books","wall","pictures","teacher","table","class"]},
      {q:"Say where you sit", k:["sit","front","back","middle","near","window","door","beside","friend","my","place","row"]},
      {q:"Say what you like about it", k:["because","clean","big","bright","quiet","friends","like","love","nice","light","learn","best"]}]},
    {t:"A game I play with my family", h:"What game is it? Who plays with you? When do you play?", points:[
      {q:"Say what game it is", k:["game","cards","chess","ball","football","hide","seek","board","play","favourite","kite","race"]},
      {q:"Say who plays with you", k:["father","mother","brother","sister","cousin","uncle","family","all","we","together","with","plays"]},
      {q:"Say when you play", k:["friday","evening","night","weekend","holiday","after","dinner","eid","visit","sometimes","every","week"]}]},
    {t:"The street where I live", h:"What is on your street? Is it quiet or busy? What do you like about it?", points:[
      {q:"Say what is on your street", k:["houses","shop","mosque","school","trees","cars","park","street","our","many","beside","near"]},
      {q:"Say if it is quiet or busy", k:["quiet","busy","noisy","calm","cars","people","morning","evening","sometimes","night","traffic","very"]},
      {q:"Say what you like about it", k:["because","friends","play","near","clean","safe","know","everyone","like","love","good","home"]}]},
    {t:"My favourite smell", h:"What smell do you like? Where do you smell it? How does it make you feel?", points:[
      {q:"Say what smell you like", k:["bread","oud","perfume","rain","coffee","food","flowers","smell","like","favourite","soap","mint"]},
      {q:"Say where you smell it", k:["home","kitchen","mosque","shop","garden","street","mother","morning","bakery","after","near","when"]},
      {q:"Say how it makes you feel", k:["happy","hungry","calm","good","because","remember","home","nice","makes","feel","love","warm"]}]},
    {t:"Something I can do well", h:"What can you do well? How did you learn it? Who taught you?", points:[
      {q:"Say what you can do well", k:["can","read","swim","draw","run","ride","cook","write","count","football","memorise","quran","well"]},
      {q:"Say how you learned it", k:["practised","practice","tried","again","every","day","learned","learn","watched","slowly","hard","time","many"]},
      {q:"Say who taught you", k:["father","mother","brother","sister","teacher","uncle","friend","taught","showed","helped","me","myself"]}]},
    {t:"A visit to my grandmother", h:"When did you visit? What did you do there? What did she give you?", points:[
      {q:"Say when you visited", k:["friday","yesterday","last","week","eid","holiday","weekend","visited","visit","went","day","with"]},
      {q:"Say what you did there", k:["ate","played","talked","listened","stories","sat","helped","cousins","tea","garden","watched","slept"]},
      {q:"Say what she gave you", k:["food","dates","sweets","money","gift","tea","bread","gave","love","prayed","hugged","kind"]}]},
    {t:"My favourite subject in Arabic class", h:"What do you study? What is easy? What is hard?", points:[
      {q:"Say what you study in Arabic class", k:["arabic","reading","writing","grammar","dictation","poem","story","spelling","letters","words","study","class"]},
      {q:"Say what is easy for you", k:["easy","reading","speaking","listening","story","letters","because","know","can","like","simple","good"]},
      {q:"Say what is hard for you", k:["hard","difficult","dictation","spelling","grammar","writing","hamza","because","forget","sometimes","need","practise","practice"]}]},
    {t:"The clock and my day", h:"When do you wake up? What do you do at noon? When do you sleep?", points:[
      {q:"Say when you wake up", k:["wake","woke","six","seven","five","morning","early","fajr","alarm","oclock","get","up"]},
      {q:"Say what you do at noon", k:["noon","lunch","eat","pray","dhuhr","rest","home","school","come","back","after","then"]},
      {q:"Say when you sleep", k:["sleep","bed","nine","ten","eight","night","early","after","isha","go","oclock","time"]}]},
    {t:"A person who helped me", h:"Who helped you? What was the problem? What did he or she do?", points:[
      {q:"Say who helped you", k:["teacher","friend","father","mother","brother","sister","neighbour","neighbor","man","helped","me","uncle"]},
      {q:"Say what the problem was", k:["lost","fell","could","not","hard","homework","bag","heavy","sick","afraid","problem","because","late"]},
      {q:"Say what he or she did", k:["helped","gave","showed","carried","explained","took","called","stayed","taught","kind","thank","then"]}]},
    {t:"My favourite football team or player", h:"Who do you like? Why do you like them? When do you watch?", points:[
      {q:"Say who you like", k:["team","player","hilal","nassr","ittihad","ahli","football","favourite","like","best","my","support"]},
      {q:"Say why you like them", k:["because","good","fast","strong","wins","score","goals","plays","well","best","clever","team"]},
      {q:"Say when you watch", k:["friday","evening","night","match","weekend","father","brother","watch","with","television","sometimes","every"]}]},
    {t:"Keeping my teeth clean", h:"How do you clean your teeth? When do you do it? Why is it important?", points:[
      {q:"Say how you clean your teeth", k:["brush","toothbrush","paste","water","clean","wash","siwak","mouth","twice","up","down","minutes"]},
      {q:"Say when you do it", k:["morning","night","before","sleep","after","breakfast","every","day","twice","meals","always","then"]},
      {q:"Say why it is important", k:["because","teeth","strong","healthy","pain","dentist","sugar","clean","smell","good","white","not"]}]},
    {t:"A noise I do not like", h:"What noise is it? Where do you hear it? What do you do?", points:[
      {q:"Say what noise it is", k:["noise","loud","horn","drill","thunder","shouting","dog","machine","car","alarm","sound","not","like"]},
      {q:"Say where you hear it", k:["street","outside","night","school","near","house","morning","building","window","road","hear","sometimes"]},
      {q:"Say what you do", k:["close","window","go","inside","room","cover","ears","wait","tell","mother","read","then","leave"]}]},
    {t:"My favourite thing to draw", h:"What do you draw? What colours do you use? Who do you show it to?", points:[
      {q:"Say what you draw", k:["draw","car","house","tree","animal","cat","bird","flower","face","map","mosque","sun","picture"]},
      {q:"Say what colours you use", k:["colour","color","red","blue","green","yellow","brown","black","pencil","pen","many","use"]},
      {q:"Say who you show it to", k:["mother","father","teacher","friend","brother","sister","class","show","gave","wall","room","proud"]}]},
    {t:"Riding in a car", h:"Where do you go by car? Who drives? What do you do on the way?", points:[
      {q:"Say where you go by car", k:["school","market","city","grandfather","mosque","park","far","near","go","travel","visit","trip"]},
      {q:"Say who drives", k:["father","mother","brother","uncle","driver","drives","drive","sits","front","safe","slow","careful"]},
      {q:"Say what you do on the way", k:["look","window","talk","listen","quran","music","sleep","count","cars","read","play","sometimes"]}]},
    {t:"A day at the market", h:"When did you go? What did you see? What did you buy?", points:[
      {q:"Say when you went", k:["friday","yesterday","morning","evening","last","week","with","mother","father","went","go","day"]},
      {q:"Say what you saw", k:["fruit","vegetables","fish","meat","bread","people","shops","many","colours","saw","big","sellers"]},
      {q:"Say what you bought", k:["bought","buy","apples","dates","rice","bread","milk","tomatoes","fish","money","bag","for"]}]},
    {t:"My favourite season", h:"Which season do you like? What is the weather like? What do you do?", points:[
      {q:"Say which season you like", k:["winter","summer","spring","autumn","season","favourite","like","best","my","love"]},
      {q:"Say what the weather is like", k:["cold","hot","cool","warm","rain","wind","sun","sunny","nice","weather","dust","sky"]},
      {q:"Say what you do in it", k:["play","travel","swim","walk","park","stay","home","picnic","desert","go","with","family"]}]},
    {t:"Something old in my house", h:"What is it? Who does it belong to? Why do you keep it?", points:[
      {q:"Say what it is", k:["old","box","clock","radio","sword","coffee","pot","carpet","picture","book","lamp","chest","thing"]},
      {q:"Say who it belongs to", k:["grandfather","grandmother","father","mother","family","uncle","was","his","her","from","gave","old"]},
      {q:"Say why you keep it", k:["because","remember","beautiful","family","history","special","still","works","love","keep","never","important"]}]},
    {t:"A letter to my friend", h:"Who are you writing to? What is your news? What do you ask him or her?", points:[
      {q:"Say who you are writing to", k:["dear","friend","cousin","brother","writing","write","hello","you","my","name","hope","well"]},
      {q:"Say your news", k:["school","new","class","moved","learned","started","happy","busy","studying","english","today","now","week"]},
      {q:"Say what you ask", k:["how","are","you","what","do","when","will","come","visit","please","write","tell","ask"]}]},
    {t:"The last thing I ate", h:"What did you eat? Where did you eat it? Did you like it?", points:[
      {q:"Say what you ate", k:["ate","eat","rice","bread","chicken","eggs","soup","fish","dates","fruit","sandwich","meat"]},
      {q:"Say where you ate it", k:["home","school","kitchen","table","restaurant","garden","grandfather","house","with","family","there","sat"]},
      {q:"Say if you liked it", k:["liked","like","good","delicious","tasty","not","much","best","because","want","again","more"]}]},
    {t:"Waking up early", h:"When do you wake up? Who wakes you? Why is early good?", points:[
      {q:"Say when you wake up", k:["wake","woke","five","six","seven","fajr","morning","early","alarm","get","up","oclock"]},
      {q:"Say who wakes you", k:["mother","father","alarm","brother","myself","clock","phone","wakes","calls","sister","sometimes","me"]},
      {q:"Say why early is good", k:["because","time","pray","school","breakfast","not","late","quiet","fresh","day","long","good"]}]},
    {t:"A story my grandfather told me", h:"Who told the story? What was it about? What did you learn?", points:[
      {q:"Say who told the story", k:["grandfather","grandmother","father","mother","uncle","told","tells","night","sat","us","me","story"]},
      {q:"Say what it was about", k:["desert","camel","old","days","school","war","sea","rain","village","boy","man","about","long"]},
      {q:"Say what you learned", k:["learned","learn","patience","work","hard","kind","help","never","should","important","because","respect","truth"]}]},
    {t:"My school bus or my walk to school", h:"How do you get to school? How long does it take? Who is with you?", points:[
      {q:"Say how you get to school", k:["bus","walk","car","bike","father","drives","ride","go","take","every","morning","school"]},
      {q:"Say how long it takes", k:["minutes","five","ten","hour","half","short","long","takes","near","far","quick","about"]},
      {q:"Say who is with you", k:["friend","brother","sister","cousin","neighbour","neighbor","alone","with","me","many","students","we"]}]}
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
    ]},
    /* ═══ اثنان وعشرون موضوعًا جديدًا (١٩ نوفمبر ٢٠٢٦) ════════════════
       سأل الأبُ حسنًا كيف يأخذ الدرجةَ كاملةً فقال: «حفظتها من كثرةِ
       التكرار». وكان البنكُ ثمانيةَ مواضيعَ واختيارُها dayIdx % 8 —
       دورةٌ كلَّ ثمانيةِ أيّامٍ بترتيبٍ معلومٍ بالتقويم. فجاءه كلُّ موضوعٍ
       تسعَ مرّاتٍ في سبعين يومًا، وقِيس تداخلُ خماسيّاتِ الكلماتِ بين
       نصّيه في «The benefits of reading» بعد ستّةَ عشرَ يومًا: ٩٨٪.
       فهو صادقٌ، والعيبُ عيبُ البنكِ لا عيبُه: ثمانيةُ مواضيعَ تدور كلَّ
       ثمانيةِ أيّامٍ ليست تدريبَ كتابةٍ بل امتحانَ ذاكرة.

       والمواضيعُ هنا من دنياه هو — مدرستُه وحيُّه ورمضانُ والاختباراتُ
       والرياضةُ — فالكتابةُ عن معلومٍ أسهلُ من الكتابةِ عن مجهول، والعجزُ
       عن المادّةِ يُحسَب خطأً في اللغةِ وهو ليس منها.
       وكلماتُ النقاطِ صيغٌ يقولها ابنُ الثالثِ المتوسّطِ فعلًا، لا
       مترادفاتٌ من معجم: الفحصُ يقابل بها نصَّه فلا تُفيده كلمةٌ لا
       تأتي على لسانِه. */
    {t:"The best day of my week", h:"Say which day, what makes it special, and how you feel about it.", points:[
      {q:"Name the day and what you do", k:["friday","thursday","saturday","weekend","day","morning","evening","play","visit","sleep","family","go","meet","rest"]},
      {q:"Explain what makes it different from other days", k:["because","no school","free","homework","busy","unlike","other days","while","different","relax","time"]},
      {q:"Say how you feel and finish", k:["feel","happy","glad","enjoy","look forward","favourite","favorite","in conclusion","so","therefore","think"]}
    ]},
    {t:"A skill I want to learn", h:"Name the skill, say why you want it, and how you plan to learn it.", points:[
      {q:"Name the skill you want to learn", k:["learn","skill","want","swim","swimming","cook","cooking","drive","program","programming","design","draw","play","guitar","language","french","photography","chess"]},
      {q:"Give the reason you want it", k:["because","useful","help","helps","job","future","career","enjoy","interested","interesting","important","need"]},
      {q:"Say how you will learn it and when", k:["plan","will","going to","practise","practice","course","videos","online","teacher","every day","week","step","start","first","then"]}
    ]},
    {t:"My favourite subject at school", h:"Name the subject, give two reasons, and say how it helps you.", points:[
      {q:"Name the subject", k:["subject","favourite","favorite","maths","mathematics","science","english","arabic","history","geography","computer","physics","chemistry","biology","islamic"]},
      {q:"Give two reasons why you like it", k:["because","reason","first","second","also","easy","interesting","useful","teacher","explains","enjoy","understand","challenge"]},
      {q:"Say how it will help you later", k:["future","help","helps","job","career","university","study","need","later","life","in conclusion","therefore","believe"]}
    ]},
    {t:"Living in a city or in a village", h:"Compare the two, then say which you prefer and why.", points:[
      {q:"Say one good thing about the city", k:["city","hospital","school","schools","shops","mall","work","jobs","transport","services","university","busy","crowded"]},
      {q:"Say one good thing about the village", k:["village","countryside","quiet","clean","air","calm","nature","farm","neighbours","neighbors","cheap","safe","peaceful"]},
      {q:"Say which you prefer and why", k:["prefer","i would","i think","because","in conclusion","better","choose","opinion","myself","personally"]}
    ]},
    {t:"How I prepare for an exam", h:"Describe your steps in order, and say what you avoid.", points:[
      {q:"Say what you do first", k:["first","start","begin","plan","revise","review","read","notes","timetable","schedule","organise","organize","before"]},
      {q:"Describe the next steps in order", k:["then","after that","second","next","practise","practice","questions","past papers","memorise","memorize","summary","ask","teacher","repeat"]},
      {q:"Say what you avoid and finish", k:["avoid","not","never","should not","shouldn't","late","night","phone","distraction","tired","finally","in conclusion","advice"]}
    ]},
    {t:"The importance of sport in our life", h:"Give two benefits with an example, then conclude.", points:[
      {q:"State the first benefit of sport", k:["sport","exercise","health","healthy","strong","fit","fitness","body","heart","weight","energy","muscles"]},
      {q:"Give an example or a second benefit", k:["for example","such as","football","running","swimming","walking","cycling","team","friends","stress","mood","sleep","confidence","also","another"]},
      {q:"Finish with a conclusion or opinion", k:["in conclusion","therefore","so","think","believe","opinion","should","everyone","important","daily"]}
    ]},
    {t:"A day I will never forget in Ramadan", h:"Describe when it was, what happened, and why you remember it.", points:[
      {q:"Say when it was and who was with you", k:["ramadan","last year","last","night","evening","iftar","suhoor","family","grandfather","grandmother","uncle","cousins","mosque","home"]},
      {q:"Describe what happened", k:["we","prayed","pray","ate","food","dates","table","together","laughed","talked","visited","gave","helped","after","then","while"]},
      {q:"Say why you still remember it", k:["remember","never forget","special","happy","feel","felt","because","meant","important","unforgettable","in conclusion"]}
    ]},
    {t:"Should homework be reduced?", h:"Give your opinion, support it with reasons, mention the other view, then conclude.", points:[
      {q:"State your opinion in the first sentence", k:["homework","should","should not","shouldn't","reduce","reduced","less","more","i think","believe","opinion","agree","disagree"]},
      {q:"Support it with a reason or an example", k:["because","for example","time","tired","sleep","family","rest","practise","practice","remember","learn","revise","too much","hours"]},
      {q:"Mention the other view, then conclude", k:["however","although","some people","on the other hand","but","still","in conclusion","therefore","overall","balance"]}
    ]},
    {t:"The person who taught me the most", h:"Say who it is, what they taught you, and how it changed you.", points:[
      {q:"Say who the person is", k:["father","dad","mother","mum","mom","teacher","brother","sister","uncle","grandfather","grandmother","friend","coach","person","taught"]},
      {q:"Say what they taught you", k:["taught","showed","told","learn","learned","patience","honesty","respect","hard work","responsibility","kindness","how to","advice","lesson"]},
      {q:"Say how it changed you and finish", k:["changed","now","since then","because of","i became","i try","follow","in conclusion","grateful","thank","always","remember"]}
    ]},
    {t:"Why water must not be wasted", h:"Explain the problem, its effect, and what we should do.", points:[
      {q:"State the problem", k:["water","waste","wasted","wasting","desert","rain","little","scarce","shortage","expensive","desalination","important","life"]},
      {q:"Explain its effect on people or the country", k:["because","effect","affects","farms","farming","drinking","cost","energy","future","generations","health","crops","dry"]},
      {q:"Say what we should do", k:["should","must","can","close","tap","shorter","shower","fix","leak","reuse","recycle","drip","irrigation","teach","save","in conclusion"]}
    ]},
    {t:"My first day at this school", h:"Describe how you felt, what happened, and how it ended.", points:[
      {q:"Say how you felt at the beginning", k:["first day","felt","feel","nervous","worried","afraid","shy","excited","new","strange","did not know","nobody"]},
      {q:"Describe what happened", k:["then","after","teacher","classroom","class","sat","met","asked","introduced","students","bell","break","lunch","showed"]},
      {q:"Say how the day ended and what you learned", k:["by the end","finally","now","friends","better","happy","glad","learned","realised","realized","in conclusion","since then"]}
    ]},
    {t:"Is it better to work alone or in a team?", h:"Give both sides with examples, then state your preference.", points:[
      {q:"Say one advantage of working alone", k:["alone","myself","on my own","concentrate","focus","quiet","decide","own pace","no one","quickly","independent"]},
      {q:"Say one advantage of working in a team", k:["team","group","together","share","ideas","help","helps","faster","learn","others","divide","support","discuss"]},
      {q:"State your preference with a reason", k:["prefer","i would","i think","because","depends","in conclusion","better","choose","opinion","for me"]}
    ]},
    {t:"A problem between friends and how I solved it", h:"Describe the problem, what you did, and the result.", points:[
      {q:"Describe the problem", k:["friend","friends","problem","argued","argument","angry","upset","misunderstanding","disagreed","stopped","because","about"]},
      {q:"Say what you did about it", k:["i","talked","spoke","apologised","apologized","listened","explained","asked","waited","sorry","called","met","decided","tried"]},
      {q:"Say the result and what you learned", k:["now","after that","finally","again","better","forgave","learned","realised","realized","friendship","in conclusion","important"]}
    ]},
    {t:"The job I would like to have", h:"Name the job, give two reasons, and say what you need for it.", points:[
      {q:"Name the job you want", k:["job","work","become","engineer","doctor","teacher","pilot","programmer","designer","lawyer","nurse","businessman","accountant","want","would like"]},
      {q:"Give two reasons why you want it", k:["because","reason","first","second","also","help","people","enjoy","interested","interesting","money","respect","useful","love"]},
      {q:"Say what you need to do to get it", k:["need","must","should","study","university","degree","english","maths","experience","train","practise","practice","hard work","in conclusion"]}
    ]},
    {t:"How technology changed the way we study", h:"Give a change with an example, a drawback, and your conclusion.", points:[
      {q:"Describe one way studying has changed", k:["technology","now","before","internet","computer","laptop","tablet","online","videos","search","websites","apps","easier","faster"]},
      {q:"Give an example or a drawback", k:["for example","such as","however","but","although","distraction","phone","games","copy","lazy","screen","eyes","depend","information"]},
      {q:"Finish with your opinion", k:["in conclusion","therefore","so","i think","believe","opinion","balance","should","use","wisely","useful"]}
    ]},
    {t:"Why we should respect older people", h:"Give two reasons with examples, then conclude.", points:[
      {q:"State the first reason", k:["older","old","elderly","grandparents","respect","experience","wisdom","taught","raised","helped","knowledge","years"]},
      {q:"Give an example or a second reason", k:["for example","such as","grandfather","grandmother","parents","advice","story","stories","listen","visit","help","carry","also","another","religion","islam"]},
      {q:"Finish with a conclusion", k:["in conclusion","therefore","so","should","must","everyone","duty","important","think","believe"]}
    ]},
    {t:"My favourite place in my city", h:"Describe the place, what you do there, and why you like it.", points:[
      {q:"Name and describe the place", k:["place","park","library","mall","beach","mosque","stadium","garden","corniche","market","cafe","street","near","quiet","big"]},
      {q:"Say what you do there", k:["i go","we go","play","walk","read","study","meet","friends","family","sit","eat","watch","every","usually","often"]},
      {q:"Say why you like it and finish", k:["because","like","love","favourite","favorite","feel","calm","happy","relax","in conclusion","therefore","best"]}
    ]},
    {t:"Should school start later in the morning?", h:"State your view, support it, answer the other side, then conclude.", points:[
      {q:"State your view in the first sentence", k:["school","start","later","earlier","should","should not","shouldn't","i think","believe","opinion","agree","disagree","morning"]},
      {q:"Support it with a reason or an example", k:["because","for example","sleep","tired","early","concentrate","focus","breakfast","traffic","wake","hours","night","study","better"]},
      {q:"Answer the other side, then conclude", k:["however","although","some","parents","work","on the other hand","but","still","finish","in conclusion","therefore","overall"]}
    ]},
    {t:"An invention that changed the world", h:"Name it, explain what it changed, and give your opinion.", points:[
      {q:"Name the invention", k:["invention","invented","internet","phone","telephone","car","plane","aeroplane","airplane","computer","electricity","printing","wheel","medicine","camera","light"]},
      {q:"Explain what it changed", k:["changed","before","now","people","travel","communicate","talk","work","faster","easier","far","distance","save","lives","allowed","made"]},
      {q:"Give your opinion and finish", k:["in conclusion","therefore","so","i think","believe","opinion","important","greatest","however","although","useful"]}
    ]},
    {t:"How I spend my pocket money", h:"Say what you spend it on, what you save, and why.", points:[
      {q:"Say what you spend it on", k:["money","pocket money","spend","buy","food","snacks","drinks","game","games","book","books","clothes","gift","phone","card"]},
      {q:"Say what you save and how", k:["save","saving","keep","put","half","some","every week","month","box","account","until","for","later"]},
      {q:"Say why you manage it that way", k:["because","reason","important","learn","need","expensive","parents","taught","waste","plan","in conclusion","think","better"]}
    ]},
    {t:"A mistake I learned from", h:"Describe the mistake, what happened, and what you do differently now.", points:[
      {q:"Describe the mistake", k:["mistake","wrong","once","last","forgot","did not","didn't","late","failed","lost","broke","lied","exam","homework"]},
      {q:"Say what happened because of it", k:["because","so","then","after","result","angry","upset","punished","lost","mark","marks","grade","learned","felt","sorry","regret"]},
      {q:"Say what you do differently now", k:["now","since then","never again","always","i make sure","i check","i plan","in conclusion","lesson","better","changed","taught me"]}
    ]},
    {t:"Why learning English is important for me", h:"Give two reasons with examples, then conclude.", points:[
      {q:"State the first reason", k:["english","learn","learning","important","language","school","exam","subject","university","study","travel","job","future","world"]},
      {q:"Give an example or a second reason", k:["for example","such as","internet","videos","games","books","research","people","speak","talk","understand","abroad","also","another","science","computer"]},
      {q:"Finish with a conclusion or a plan", k:["in conclusion","therefore","so","i think","believe","will","plan","practise","practice","improve","every day","important"]}
    ]},
    {t:"Why reading the news matters", h:"Give one reason, an example, and a short conclusion.", points:[
      {q:"State the first reason", k:["know","world","events","informed","understand","decisions","happening","important","aware","learn","knowledge","reason"]},
      {q:"Give an example or a second reason", k:["for example","such as","also","another","weather","prices","election","health","report","newspaper","discuss","opinion"]},
      {q:"Finish with a conclusion or opinion", k:["in conclusion","finally","therefore","think","believe","should","everyone","opinion","every","day","important","so"]}]},
    {t:"The value of saving money", h:"Explain one benefit, give an example, then conclude.", points:[
      {q:"State the first benefit", k:["save","saving","future","emergency","buy","need","independent","plan","money","without","borrow","benefit"]},
      {q:"Give an example or a second benefit", k:["for example","such as","also","another","bicycle","book","gift","phone","little","every","month","riyals"]},
      {q:"Finish with a conclusion or opinion", k:["in conclusion","finally","therefore","think","believe","should","habit","young","learn","so","opinion","important"]}]},
    {t:"Is it better to read a book or watch a film?", h:"Give your view, support it with a reason and an example, then conclude.", points:[
      {q:"State your view and the first reason", k:["book","film","movie","better","prefer","because","imagination","detail","faster","easier","think","reason"]},
      {q:"Give an example or mention the other side", k:["for example","however","on the other hand","although","some","people","while","story","picture","time","short","long"]},
      {q:"Finish with a conclusion or opinion", k:["in conclusion","finally","therefore","think","believe","both","depends","opinion","so","prefer","still","overall"]}]},
    {t:"The hardest subject for me and why", h:"Name the subject, explain why, then say what you will do about it.", points:[
      {q:"Name the subject and say why it is hard", k:["math","maths","science","english","physics","chemistry","arabic","hard","difficult","because","understand","formulas","grammar"]},
      {q:"Give an example of a difficulty", k:["for example","such as","when","problem","question","exam","forget","mistake","confused","chapter","lesson","part"]},
      {q:"Say what you will do about it", k:["will","plan","practise","practice","ask","teacher","study","every","day","review","help","improve","try"]}]},
    {t:"How a student can manage time", h:"Give one method, an example, then a conclusion.", points:[
      {q:"State the first method", k:["plan","schedule","list","time","priority","first","important","divide","study","organise","organize","method","write"]},
      {q:"Give an example or a second method", k:["for example","such as","also","another","hour","homework","before","break","phone","away","evening","morning"]},
      {q:"Finish with a conclusion or opinion", k:["in conclusion","finally","therefore","think","believe","should","every","student","helps","so","opinion","better"]}]},
    {t:"Should schools teach cooking and simple repairs?", h:"Give your view with a reason and an example, then conclude.", points:[
      {q:"State your view and the first reason", k:["should","schools","teach","cooking","repairs","useful","life","skills","because","independent","everyone","need","think"]},
      {q:"Give an example or the other side", k:["for example","such as","however","although","some","parents","time","subjects","already","full","instead","while"]},
      {q:"Finish with a conclusion or opinion", k:["in conclusion","finally","therefore","think","believe","opinion","so","important","should","agree","overall","future"]}]},
    {t:"A tradition in my family", h:"Describe the tradition, say when it happens, and why it matters.", points:[
      {q:"Describe the tradition", k:["tradition","family","every","gather","coffee","dates","lunch","friday","eid","visit","grandfather","custom","together"]},
      {q:"Say when it happens", k:["friday","eid","ramadan","weekend","month","year","after","prayer","every","week","night","summer"]},
      {q:"Say why it matters", k:["because","family","close","love","remember","respect","children","learn","important","keeps","together","values"]}]},
    {t:"The effects of not sleeping enough", h:"Give one effect, an example, then advice.", points:[
      {q:"State the first effect", k:["tired","concentration","focus","memory","mood","angry","slow","health","effect","because","less","weak"]},
      {q:"Give an example or a second effect", k:["for example","such as","also","another","exam","class","mistake","forget","headache","sick","school","morning"]},
      {q:"Finish with advice or a conclusion", k:["in conclusion","therefore","should","sleep","hours","early","phone","advise","finally","think","better","so"]}]},
    {t:"Is social media good for young people?", h:"Give your view with a reason and an example, then conclude.", points:[
      {q:"State your view and the first reason", k:["social","media","good","bad","because","friends","learn","news","time","waste","compare","think","connect"]},
      {q:"Give an example or the other side", k:["for example","however","on the other hand","although","some","hours","sleep","bullying","useful","while","instead","videos"]},
      {q:"Finish with a conclusion or opinion", k:["in conclusion","finally","therefore","think","believe","balance","limit","opinion","so","should","overall","useful"]}]},
    {t:"A change I would make in my school", h:"Say what you would change, why, and what the result would be.", points:[
      {q:"Say what you would change", k:["would","change","add","library","break","longer","sport","lab","garden","class","schedule","new","improve"]},
      {q:"Say why you would change it", k:["because","students","need","better","tired","small","old","help","learn","more","time","space","reason"]},
      {q:"Say what the result would be", k:["result","would","better","happier","learn","improve","grades","less","more","students","then","so","benefit"]}]},
    {t:"The importance of keeping promises", h:"Give one reason, an example, then conclude.", points:[
      {q:"State the first reason", k:["trust","promise","keep","word","respect","people","believe","because","honest","important","reason","rely"]},
      {q:"Give an example or a second reason", k:["for example","such as","also","another","friend","late","forgot","said","would","come","homework","help"]},
      {q:"Finish with a conclusion or opinion", k:["in conclusion","finally","therefore","think","believe","should","only","promise","can","opinion","so","always"]}]},
    {t:"How to deal with a difficult classmate", h:"Describe the problem, say what you do, then what you learned.", points:[
      {q:"Describe the problem", k:["classmate","difficult","problem","noisy","angry","takes","laughs","does","not","listen","because","sits","annoying"]},
      {q:"Say what you do", k:["talk","calm","ignore","tell","teacher","explain","ask","politely","away","patient","try","first","then"]},
      {q:"Say what you learned", k:["learned","patience","understand","maybe","reason","home","kind","better","shout","not","respect","everyone","because"]}]},
    {t:"My opinion about homework", h:"Give your view with a reason and an example, then conclude.", points:[
      {q:"State your view and the first reason", k:["homework","useful","too","much","because","practise","practice","remember","review","time","tired","think","helps"]},
      {q:"Give an example or the other side", k:["for example","however","although","some","subjects","hours","evening","family","sport","while","instead","little"]},
      {q:"Finish with a conclusion or opinion", k:["in conclusion","finally","therefore","think","believe","should","amount","quality","opinion","so","better","overall"]}]},
    {t:"Why honesty is difficult sometimes", h:"Explain the difficulty, give an example, then your view.", points:[
      {q:"Explain why it can be difficult", k:["honest","honesty","difficult","afraid","punishment","angry","hurt","feelings","because","easier","lie","hide","admit"]},
      {q:"Give an example", k:["for example","such as","once","when","mistake","broke","forgot","exam","friend","told","said","truth","instead"]},
      {q:"Finish with your view", k:["in conclusion","therefore","think","believe","better","always","respect","trust","should","finally","so","opinion"]}]},
    {t:"A skill I taught someone", h:"Say what you taught, how you taught it, and how it went.", points:[
      {q:"Say what you taught and to whom", k:["taught","teach","brother","sister","friend","cousin","read","ride","swim","english","maths","write","how"]},
      {q:"Say how you taught it", k:["step","slowly","showed","explained","again","repeated","practised","practice","patient","example","first","then","together"]},
      {q:"Say how it went", k:["learned","succeeded","happy","proud","difficult","time","finally","improved","could","thanked","result","because","now"]}]},
    {t:"The best way to learn new words", h:"Give one way, an example, then a conclusion.", points:[
      {q:"State the first way", k:["cards","read","write","repeat","sentence","use","listen","context","notebook","review","way","every","day"]},
      {q:"Give an example or a second way", k:["for example","such as","also","another","story","song","speak","friend","app","test","myself","twenty"]},
      {q:"Finish with a conclusion or opinion", k:["in conclusion","finally","therefore","think","believe","best","should","little","daily","opinion","so","works"]}]},
    {t:"Should students have a part-time job?", h:"Give your view with a reason and an example, then conclude.", points:[
      {q:"State your view and the first reason", k:["job","work","student","should","because","responsibility","money","experience","time","study","tired","think","learn"]},
      {q:"Give an example or the other side", k:["for example","however","although","some","summer","holiday","weekend","hours","school","grades","while","instead"]},
      {q:"Finish with a conclusion or opinion", k:["in conclusion","finally","therefore","think","believe","balance","opinion","so","short","should","overall","useful"]}]},
    {t:"A problem in my school and how to solve it", h:"Describe the problem, its effect, and your solution.", points:[
      {q:"Describe the problem", k:["problem","school","crowded","noise","litter","broken","small","library","hot","class","break","short","queue"]},
      {q:"Say what effect it has", k:["because","students","cannot","hard","concentrate","learn","late","tired","dirty","unsafe","effect","result","less"]},
      {q:"Give your solution", k:["solution","should","could","add","repair","clean","rule","organise","organize","divide","teacher","students","help","fix"]}]},
    {t:"The role of libraries today", h:"Give one role, an example, then your view.", points:[
      {q:"State the first role", k:["library","books","quiet","study","free","everyone","research","borrow","read","place","role","knowledge"]},
      {q:"Give an example or a second role", k:["for example","such as","also","another","internet","computers","children","students","events","classes","poor","access"]},
      {q:"Finish with your view", k:["in conclusion","finally","therefore","think","believe","still","important","should","opinion","so","even","digital"]}]},
    {t:"How exercise changes the way you feel", h:"Give one effect, an example, then advice.", points:[
      {q:"State the first effect", k:["exercise","energy","mood","happy","strong","sleep","stress","less","better","feel","because","health","effect"]},
      {q:"Give an example or a second effect", k:["for example","such as","also","another","walk","football","running","minutes","morning","after","school","daily"]},
      {q:"Finish with advice or a conclusion", k:["in conclusion","therefore","should","every","day","minutes","start","small","finally","think","so","advise"]}]},
    {t:"A decision I had to make", h:"Describe the decision, the choices, and the result.", points:[
      {q:"Describe the decision", k:["decision","had","choose","between","difficult","whether","should","time","important","was","two","options"]},
      {q:"Say what the choices were", k:["first","second","one","other","could","either","or","option","choice","side","instead","while"]},
      {q:"Say what the result was", k:["chose","decided","result","happy","regret","learned","better","right","wrong","finally","then","because","now"]}]},
    {t:"Is competition between students useful?", h:"Give your view with a reason and an example, then conclude.", points:[
      {q:"State your view and the first reason", k:["competition","useful","harmful","because","motivates","effort","stress","compare","best","push","think","improve","reason"]},
      {q:"Give an example or the other side", k:["for example","however","although","some","students","afraid","give","up","confidence","while","instead","cooperation"]},
      {q:"Finish with a conclusion or opinion", k:["in conclusion","finally","therefore","think","believe","balance","opinion","so","should","fair","overall","both"]}]},
    {t:"Something I changed my mind about", h:"Say what you thought before, what changed it, and what you think now.", points:[
      {q:"Say what you thought before", k:["thought","before","used","believe","wrong","was","sure","opinion","first","did","not","like","idea"]},
      {q:"Say what changed your mind", k:["then","read","saw","heard","tried","experience","teacher","friend","showed","explained","evidence","because","learned"]},
      {q:"Say what you think now", k:["now","think","believe","understand","realise","realize","different","opinion","better","changed","so","today"]}]},
    {t:"The difference between a friend and a classmate", h:"Explain the difference, give an example, then your view.", points:[
      {q:"Explain the difference", k:["friend","classmate","difference","trust","choose","share","secrets","help","time","only","class","because","closer"]},
      {q:"Give an example", k:["for example","such as","when","problem","sick","needed","called","stayed","while","another","once","helped"]},
      {q:"Finish with your view", k:["in conclusion","therefore","think","believe","few","real","friends","better","many","opinion","so","finally"]}]},
    {t:"How I would spend a free day", h:"Say what you would do, with whom, and why.", points:[
      {q:"Say what you would do", k:["would","read","sleep","play","visit","travel","walk","swim","cook","draw","study","go","free"]},
      {q:"Say who you would be with", k:["family","friend","brother","sister","father","mother","alone","cousin","with","together","we","myself"]},
      {q:"Say why", k:["because","rest","enjoy","miss","need","love","happy","tired","week","time","important","so","reason"]}]},
    {t:"Why some people are afraid of speaking English", h:"Explain the reason, give an example, then advice.", points:[
      {q:"Explain the reason", k:["afraid","mistake","mistakes","laugh","shy","wrong","pronunciation","because","judge","perfect","fear","confidence","speak"]},
      {q:"Give an example", k:["for example","such as","once","class","asked","could","not","answer","forgot","word","front","everyone"]},
      {q:"Finish with advice or a conclusion", k:["in conclusion","therefore","should","practise","practice","mistakes","normal","part","learning","finally","think","start","small"]}]},
    {t:"A place I would like to see", h:"Name the place, say why, and what you would do there.", points:[
      {q:"Name the place and say where it is", k:["place","city","country","mountain","sea","museum","madinah","makkah","london","japan","visit","would","like"]},
      {q:"Say why you would like to see it", k:["because","beautiful","history","learn","different","culture","read","about","saw","pictures","interesting","always"]},
      {q:"Say what you would do there", k:["would","walk","visit","see","take","photos","try","food","museum","talk","people","learn","stay"]}]},
    {t:"The best advice I ever received", h:"Say what the advice was, who gave it, and how it helped.", points:[
      {q:"Say what the advice was", k:["advice","told","said","never","always","should","try","patient","honest","work","hard","listen","best"]},
      {q:"Say who gave it", k:["father","mother","teacher","grandfather","grandmother","uncle","friend","gave","told","advised","was","once"]},
      {q:"Say how it helped", k:["helped","because","remember","used","exam","problem","changed","better","still","follow","now","then","so"]}]},
    {t:"Should pocket money be given for chores?", h:"Give your view with a reason and an example, then conclude.", points:[
      {q:"State your view and the first reason", k:["pocket","money","chores","should","because","responsibility","value","work","family","duty","free","think","reason"]},
      {q:"Give an example or the other side", k:["for example","however","although","some","parents","help","without","payment","expect","while","instead","wash"]},
      {q:"Finish with a conclusion or opinion", k:["in conclusion","finally","therefore","think","believe","opinion","so","balance","should","both","overall","fair"]}]},
    {t:"How my city has changed", h:"Describe one change, give an example, then your view.", points:[
      {q:"Describe one change", k:["city","changed","new","roads","buildings","shops","park","bigger","metro","trees","grew","before","now"]},
      {q:"Give an example or a second change", k:["for example","such as","also","another","old","market","street","school","was","became","built","traffic"]},
      {q:"Finish with your view", k:["in conclusion","therefore","think","believe","better","worse","miss","hope","opinion","so","future","finally"]}]},
    {t:"Why wasting food is a problem", h:"Give one reason, an example, then advice.", points:[
      {q:"State the first reason", k:["waste","food","problem","money","people","hungry","effort","water","farmers","because","throw","reason","resources"]},
      {q:"Give an example or a second reason", k:["for example","such as","also","another","restaurant","party","bread","rice","plate","left","every","day"]},
      {q:"Finish with advice or a conclusion", k:["in conclusion","therefore","should","take","less","share","keep","plan","finally","think","so","advise"]}]},
    {t:"The hardest thing about growing up", h:"Explain the difficulty, give an example, then your view.", points:[
      {q:"Explain the difficulty", k:["growing","responsibility","decisions","expect","harder","alone","pressure","because","difficult","change","school","future","myself"]},
      {q:"Give an example", k:["for example","such as","when","exam","choose","friends","money","time","family","asked","must","now"]},
      {q:"Finish with your view", k:["in conclusion","therefore","think","believe","still","learn","better","part","life","finally","so","opinion"]}]},
    {t:"Is it important to learn a third language?", h:"Give your view with a reason and an example, then conclude.", points:[
      {q:"State your view and the first reason", k:["third","language","important","because","work","travel","culture","brain","opportunity","think","useful","reason","learn"]},
      {q:"Give an example or the other side", k:["for example","however","although","some","time","english","arabic","enough","difficult","while","instead","french"]},
      {q:"Finish with a conclusion or opinion", k:["in conclusion","finally","therefore","think","believe","opinion","so","should","useful","overall","later","depends"]}]},
    {t:"Someone in history I admire", h:"Name the person, say why, and what you learned.", points:[
      {q:"Name the person and say when they lived", k:["admire","person","scientist","king","doctor","leader","teacher","lived","century","history","was","ago","famous"]},
      {q:"Say why you admire them", k:["because","brave","patient","honest","helped","changed","discovered","built","worked","hard","people","never","gave"]},
      {q:"Say what you learned from them", k:["learned","learn","should","patience","effort","courage","example","follow","important","teaches","me","so","lesson"]}]},
    {t:"How to be a good listener", h:"Give one method, an example, then your view.", points:[
      {q:"State the first method", k:["listen","eyes","interrupt","not","patient","attention","understand","questions","silent","wait","method","respect","speaking"]},
      {q:"Give an example or a second method", k:["for example","such as","also","another","friend","problem","talking","phone","away","repeat","asked","said"]},
      {q:"Finish with your view", k:["in conclusion","therefore","think","believe","important","skill","everyone","should","finally","so","opinion","better"]}]},
    {t:"The advantages of living near the sea", h:"Give one advantage, an example, then your view.", points:[
      {q:"State the first advantage", k:["sea","near","weather","air","fresh","fish","swim","work","port","beautiful","advantage","because","cool"]},
      {q:"Give an example or a disadvantage", k:["for example","such as","however","although","humid","storms","expensive","while","instead","also","another","summer"]},
      {q:"Finish with your view", k:["in conclusion","therefore","think","believe","would","like","prefer","opinion","so","finally","overall","still"]}]},
    {t:"Should exams be replaced by projects?", h:"Give your view with a reason and an example, then conclude.", points:[
      {q:"State your view and the first reason", k:["exams","projects","replaced","should","because","memory","understanding","stress","real","skills","think","fair","reason"]},
      {q:"Give an example or the other side", k:["for example","however","although","some","students","copy","time","teacher","mark","while","instead","both"]},
      {q:"Finish with a conclusion or opinion", k:["in conclusion","finally","therefore","think","believe","balance","opinion","so","should","mixture","overall","better"]}]},
    {t:"A time I worked in a team", h:"Describe the task, your role, and the result.", points:[
      {q:"Describe the task", k:["team","group","project","task","class","school","together","had","clean","present","build","prepare","match"]},
      {q:"Say what your role was", k:["role","my","job","wrote","drew","organised","organize","spoke","collected","helped","leader","part","did"]},
      {q:"Say what the result was", k:["result","finished","succeeded","won","learned","difficult","argued","then","together","proud","mark","because","teacher"]}]},
    {t:"Why respecting rules matters", h:"Give one reason, an example, then your view.", points:[
      {q:"State the first reason", k:["rules","respect","safety","order","fair","everyone","because","chaos","protect","school","road","reason","important"]},
      {q:"Give an example or a second reason", k:["for example","such as","also","another","traffic","queue","class","sport","game","without","accident","noise"]},
      {q:"Finish with your view", k:["in conclusion","therefore","think","believe","should","even","small","opinion","so","finally","everyone","agree"]}]},
    {t:"The most useful thing I own", h:"Name the thing, say how you use it, and why it is useful.", points:[
      {q:"Name the thing", k:["useful","own","phone","bicycle","watch","bag","laptop","book","pen","most","my","thing","glasses"]},
      {q:"Say how you use it", k:["use","every","day","school","study","read","call","carry","write","learn","travel","work","with"]},
      {q:"Say why it is useful", k:["because","helps","saves","time","easier","without","difficult","need","important","always","so","useful"]}]},
    {t:"How weather affects our mood", h:"Give one effect, an example, then your view.", points:[
      {q:"State the first effect", k:["weather","mood","feel","happy","sad","tired","energy","sun","rain","heat","affects","because","effect"]},
      {q:"Give an example or a second effect", k:["for example","such as","also","another","hot","stay","inside","cool","walk","winter","summer","dust"]},
      {q:"Finish with your view", k:["in conclusion","therefore","think","believe","should","plan","opinion","so","finally","control","still","mind"]}]},
    {t:"Is it better to live in a big family or a small one?", h:"Give your view with a reason and an example, then conclude.", points:[
      {q:"State your view and the first reason", k:["big","small","family","better","because","help","noisy","attention","share","alone","think","many","reason"]},
      {q:"Give an example or the other side", k:["for example","however","although","some","brothers","sisters","room","money","quiet","while","instead","time"]},
      {q:"Finish with a conclusion or opinion", k:["in conclusion","finally","therefore","think","believe","opinion","so","prefer","depends","overall","both","love"]}]},
    {t:"Something I do better than last year", h:"Say what improved, how you improved it, and how you know.", points:[
      {q:"Say what improved", k:["better","improved","last","year","now","english","reading","writing","maths","football","swimming","speaking","can"]},
      {q:"Say how you improved it", k:["practised","practice","every","day","studied","asked","teacher","read","repeated","tried","slowly","effort","because"]},
      {q:"Say how you know", k:["know","mark","grade","faster","easier","teacher","said","test","compare","before","now","result","can"]}]},
    {t:"Why some people do not like change", h:"Explain the reason, give an example, then your view.", points:[
      {q:"Explain the reason", k:["change","afraid","unknown","comfortable","used","habit","because","risk","safe","difficult","prefer","same","fear"]},
      {q:"Give an example", k:["for example","such as","when","school","moved","new","house","teacher","system","phone","refused","first"]},
      {q:"Finish with your view", k:["in conclusion","therefore","think","believe","necessary","grow","should","try","opinion","so","finally","better"]}]},
    {t:"The best age to start learning a language", h:"Give your view with a reason and an example, then conclude.", points:[
      {q:"State your view and the first reason", k:["age","young","early","start","language","because","brain","easier","sounds","children","adults","think","reason"]},
      {q:"Give an example or the other side", k:["for example","however","although","some","adults","faster","grammar","understand","while","instead","motivated","still"]},
      {q:"Finish with a conclusion or opinion", k:["in conclusion","finally","therefore","think","believe","any","opinion","so","never","late","overall","should"]}]},
    {t:"How I deal with a bad mark", h:"Say what you feel, what you do, and what you learned.", points:[
      {q:"Say what you feel", k:["sad","angry","disappointed","feel","bad","mark","low","upset","first","because","expected","was"]},
      {q:"Say what you do", k:["review","look","mistakes","ask","teacher","study","again","plan","practise","practice","try","next","then"]},
      {q:"Say what you learned", k:["learned","mistake","part","learning","improve","not","end","effort","patience","because","better","now","should"]}]},
    {t:"Why cities need public parks", h:"Give one reason, an example, then your view.", points:[
      {q:"State the first reason", k:["park","parks","city","air","trees","exercise","children","play","meet","free","green","because","reason"]},
      {q:"Give an example or a second reason", k:["for example","such as","also","another","families","evening","walk","sport","shade","hot","summer","crowded"]},
      {q:"Finish with your view", k:["in conclusion","therefore","think","believe","should","build","more","opinion","so","finally","every","neighbourhood"]}]},
    {t:"A film or programme that taught me something", h:"Name it, say what it was about, and what you learned.", points:[
      {q:"Name it and say what it was about", k:["film","movie","programme","program","documentary","about","watched","story","history","science","animals","was","saw"]},
      {q:"Say what part affected you", k:["part","scene","moment","when","showed","explained","surprised","because","never","knew","most","interesting"]},
      {q:"Say what you learned", k:["learned","learn","understand","should","important","realised","realize","now","think","lesson","so","changed"]}]},
    {t:"Should students choose their own subjects?", h:"Give your view with a reason and an example, then conclude.", points:[
      {q:"State your view and the first reason", k:["choose","subjects","students","should","because","interest","motivated","future","career","young","know","think","reason"]},
      {q:"Give an example or the other side", k:["for example","however","although","some","basic","maths","language","need","everyone","while","instead","later"]},
      {q:"Finish with a conclusion or opinion", k:["in conclusion","finally","therefore","think","believe","balance","opinion","so","some","core","overall","should"]}]},
    {t:"The hardest work I have ever done", h:"Describe the work, why it was hard, and how you felt after.", points:[
      {q:"Describe the work", k:["work","carried","cleaned","helped","moved","built","studied","painted","garden","house","hours","day","hard"]},
      {q:"Say why it was hard", k:["because","heavy","hot","long","tired","slow","difficult","alone","many","hours","back","sweat","pain"]},
      {q:"Say how you felt after", k:["after","proud","tired","happy","satisfied","learned","respect","value","finished","felt","because","so"]}]},
    {t:"Why mobile phones should or should not be in class", h:"Give your view with a reason and an example, then conclude.", points:[
      {q:"State your view and the first reason", k:["phones","class","should","because","distraction","research","dictionary","noise","cheat","useful","think","allow","reason"]},
      {q:"Give an example or the other side", k:["for example","however","although","some","teacher","lesson","search","games","messages","while","instead","emergency"]},
      {q:"Finish with a conclusion or opinion", k:["in conclusion","finally","therefore","think","believe","rules","opinion","so","only","permission","overall","should"]}]},
    {t:"A habit I want to stop", h:"Name the habit, say why it is bad, and your plan.", points:[
      {q:"Name the habit", k:["habit","want","stop","late","phone","sweets","sleeping","forget","delay","nails","shouting","watching","my"]},
      {q:"Say why it is bad", k:["because","time","health","teeth","study","tired","waste","angry","affects","bad","sleep","grades","family"]},
      {q:"Give your plan", k:["plan","will","start","small","every","day","replace","ask","help","remind","myself","week","try"]}]},
    {t:"The value of helping your neighbours", h:"Give one reason, an example, then your view.", points:[
      {q:"State the first reason", k:["neighbours","neighbors","help","community","safe","trust","need","alone","because","together","reason","kindness","near"]},
      {q:"Give an example or a second reason", k:["for example","such as","also","another","old","sick","travel","keys","food","carry","watch","house"]},
      {q:"Finish with your view", k:["in conclusion","therefore","think","believe","should","everyone","small","opinion","so","finally","return","kind"]}]},
    {t:"Is homework better in the morning or the evening?", h:"Give your view with a reason and an example, then conclude.", points:[
      {q:"State your view and the first reason", k:["morning","evening","homework","better","because","fresh","tired","concentrate","quiet","time","think","mind","reason"]},
      {q:"Give an example or the other side", k:["for example","however","although","some","people","early","late","school","family","while","instead","noise"]},
      {q:"Finish with a conclusion or opinion", k:["in conclusion","finally","therefore","think","believe","depends","opinion","so","person","overall","should","own"]}]},
    {t:"Something my parents taught me", h:"Say what they taught, how, and how it helps you now.", points:[
      {q:"Say what they taught you", k:["parents","father","mother","taught","respect","honesty","patience","work","pray","save","help","others","how"]},
      {q:"Say how they taught it", k:["example","showed","told","repeated","every","day","watched","them","explained","never","always","did","by"]},
      {q:"Say how it helps you now", k:["now","helps","school","friends","decisions","remember","because","still","use","better","so","life"]}]},
    {t:"The effect of noise on studying", h:"Give one effect, an example, then advice.", points:[
      {q:"State the first effect", k:["noise","concentrate","focus","slower","mistakes","forget","tired","understand","because","effect","harder","read","distract"]},
      {q:"Give an example or a second effect", k:["for example","such as","also","another","street","television","brothers","music","class","construction","evening","while"]},
      {q:"Finish with advice or a conclusion", k:["in conclusion","therefore","should","quiet","room","library","close","window","finally","think","so","advise"]}]},
    {t:"A tradition I would like to change", h:"Name the tradition, say why, and what you suggest.", points:[
      {q:"Name the tradition", k:["tradition","custom","change","would","like","people","always","every","year","wedding","visit","gifts","habit"]},
      {q:"Say why you would change it", k:["because","expensive","tiring","waste","time","money","old","no","longer","useful","difficult","reason","many"]},
      {q:"Say what you suggest", k:["suggest","instead","could","should","simpler","smaller","keep","part","change","better","way","propose","then"]}]},
    {t:"Why learning to write well matters", h:"Give one reason, an example, then your view.", points:[
      {q:"State the first reason", k:["writing","write","clear","ideas","understand","work","study","exam","message","because","thinking","reason","express"]},
      {q:"Give an example or a second reason", k:["for example","such as","also","another","letter","report","email","answer","teacher","job","application","test"]},
      {q:"Finish with your view", k:["in conclusion","therefore","think","believe","should","practise","practice","every","opinion","so","finally","skill"]}]},
    {t:"The best thing about my neighbourhood", h:"Name it, give an example, then your view.", points:[
      {q:"Name the best thing", k:["neighbourhood","neighborhood","best","quiet","people","mosque","shops","park","near","school","safe","clean","trees"]},
      {q:"Give an example", k:["for example","such as","when","neighbours","neighbors","help","children","play","evening","everyone","knows","together"]},
      {q:"Finish with your view", k:["in conclusion","therefore","think","believe","lucky","would","not","move","opinion","so","finally","love"]}]},
    {t:"How I would improve my English this year", h:"Give your plan, an example, then how you will measure it.", points:[
      {q:"State your plan", k:["plan","will","read","write","listen","speak","every","day","words","minutes","practise","practice","improve"]},
      {q:"Give an example of what you will do", k:["for example","such as","story","video","notebook","twenty","words","week","friend","record","myself","aloud"]},
      {q:"Say how you will measure it", k:["measure","test","mark","compare","before","after","month","teacher","know","count","progress","result","because"]}]}
  ],
  /* المستوى ٣ — موضوعاتُ مقالٍ برأيٍ ودليلٍ ورأيٍ مضادّ، على نمطِ ما يُطلَب
     من طالبِ الثالثِ الثانويِّ في الكتابةِ الأكاديميّة. وثالثُ النقاطِ في
     كلِّ موضوعٍ هو الحجّةُ المضادّةُ وردُّها — وهو ما يفرِّق المقالَ الناضجَ
     عن الفقرةِ المدرسيّة. */
  3: [
    {t:"Should university education be free for everyone?", h:"State your position, support it with two reasons and evidence, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly in the first sentence", k:["should","should not","shouldn't","must","agree","disagree","believe","opinion","view","argue","maintain","favour","favor","oppose","essay"]},
      {q:"Support it with reasons and evidence", k:["because","reason","reasons","first","firstly","second","secondly","for example","for instance","such as","evidence","research","studies","shows","suggests","data","therefore"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","opponents","critics","some people","others","on the other hand","admittedly","nevertheless","it is true that"]}
    ]},
    {t:"Do social media platforms do more harm than good to young people?", h:"Take one side. Give two arguments with examples, concede one point to the other side, then conclude.", points:[
      {q:"State your position clearly", k:["harm","harmful","benefit","beneficial","more","than","believe","argue","opinion","view","agree","disagree","should"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","sleep","attention","anxiety","connect","news","learn","first","second"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others"]}
    ]},
    {t:"Is online learning as effective as learning in a classroom?", h:"Compare the two fairly, then state which you prefer and why.", points:[
      {q:"Compare the two clearly", k:["online","classroom","school","both","while","whereas","compared","comparison","than","similar","different","difference"]},
      {q:"Give concrete advantages or drawbacks", k:["because","for example","for instance","such as","flexible","flexibility","discipline","interaction","teacher","internet","cost","time","travel","distraction","evidence","research"]},
      {q:"State and justify your preference", k:["prefer","believe","opinion","view","think","conclusion","overall","therefore","consequently","to sum up","in my view"]}
    ]},
    {t:"Should students choose a major they love or one with better job prospects?", h:"Weigh both, take a position, and defend it with reasons and an example.", points:[
      {q:"Set out both sides of the choice", k:["major","majors","passion","love","interest","job","jobs","market","salary","career","prospects","both","while","whereas"]},
      {q:"Defend your position with reasons", k:["because","reason","first","second","for example","for instance","such as","evidence","therefore","consequently","succeed","motivation","skills","demand"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some people","others"]}
    ]},
    {t:"Should driving be banned in city centres?", h:"State your position, give two reasons with evidence, answer an objection, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","shouldn't","banned","ban","must","agree","disagree","believe","opinion","view","argue"]},
      {q:"Give reasons with evidence", k:["because","reason","traffic","pollution","air","noise","health","accidents","public transport","bus","metro","for example","for instance","research","studies","evidence","therefore"]},
      {q:"Answer an objection", k:["however","although","while","whereas","shops","businesses","elderly","disabled","admittedly","it is true that","on the other hand","nevertheless","critics","some"]}
    ]},
    {t:"Is reading books still important in the age of short videos?", h:"Argue one side. Use two reasons and an example, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["reading","books","videos","still","important","believe","argue","opinion","view","agree","disagree","should"]},
      {q:"Give reasons and an example", k:["because","vocabulary","concentration","attention","depth","knowledge","imagination","for example","for instance","such as","research","studies","shows","evidence","therefore","first","second"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","quick","convenient","some","others","critics"]}
    ]},
    {t:"Should high school students be required to do voluntary work?", h:"State your position, support it, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","shouldn't","required","requirement","compulsory","must","agree","disagree","believe","opinion","view","argue"]},
      {q:"Support it with reasons and an example", k:["because","reason","responsibility","skills","community","experience","confidence","for example","for instance","such as","evidence","research","therefore","first","second"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","study","time","exams","pressure","admittedly","it is true that","on the other hand","nevertheless","critics","some","others"]}
    ]},
    /* ═══ ثلاثةٌ وعشرون موضوعًا جديدًا (٢٠ نوفمبر ٢٠٢٦) ═══════════════
       العلّةُ هي علّةُ المستوى الثاني: بنكٌ من سبعةٍ دورتُه سبعةُ أيّامٍ
       تُحفَظ نصوصُه. وُسِّع قبل أن يقع فيه فهد.
       والنقطةُ الثالثةُ في كلِّ موضوعٍ هي الحجّةُ المضادّةُ وردُّها — وهي
       ما يفرِّق المقالَ الناضجَ عن الفقرةِ المدرسيّة، وكلماتُها واحدةٌ
       في المواضيعِ كلِّها لأنّها أدواتُ الجدلِ لا مفرداتُ الموضوع.
       وكلماتُ النقطةِ الثانيةِ من مادّةِ الموضوعِ نفسِه، فيُقاس أغطّى
       المسألةَ أم كتب إنشاءً عامًّا بأدواتِ ربطٍ حسنة. */
    {t:"Should exams be replaced by continuous assessment?", h:"State your position, support it with two reasons and evidence, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly in the first sentence", k:["should","should not","shouldn't","must","agree","disagree","believe","opinion","view","argue","maintain","favour","favor","oppose","convinced","essay","this essay"]},
      {q:"Support it with reasons and evidence", k:["exam","exams","assessment","continuous","marks","grades","memorise","memorize","stress","pressure","coursework","projects","fair","measure","progress","term","year","because","reason","reasons","first","firstly","second","secondly","for example","for instance","such as","evidence","research","studies","shows","suggests","data","therefore","consequently"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","opponents","critics","some people","others","on the other hand","admittedly","nevertheless","it is true that","granted","even so","counter"]}
    ]},
    {t:"Should students be allowed to use AI tools in their schoolwork?", h:"State your position, support it with two reasons and evidence, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly in the first sentence", k:["should","should not","shouldn't","must","agree","disagree","believe","opinion","view","argue","maintain","favour","favor","oppose","convinced","essay","this essay"]},
      {q:"Support it with reasons and evidence", k:["ai","artificial intelligence","tool","tools","homework","write","writing","answers","learn","learning","skills","cheat","cheating","think","thinking","depend","teacher","check","because","reason","reasons","first","firstly","second","secondly","for example","for instance","such as","evidence","research","studies","shows","suggests","data","therefore","consequently"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","opponents","critics","some people","others","on the other hand","admittedly","nevertheless","it is true that","granted","even so","counter"]}
    ]},
    {t:"Is it better to study abroad or at home?", h:"State your position, support it with two reasons and evidence, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly in the first sentence", k:["should","should not","shouldn't","must","agree","disagree","believe","opinion","view","argue","maintain","favour","favor","oppose","convinced","essay","this essay"]},
      {q:"Support it with reasons and evidence", k:["abroad","overseas","home","country","university","culture","language","english","expensive","cost","scholarship","family","independence","experience","return","opportunity","because","reason","reasons","first","firstly","second","secondly","for example","for instance","such as","evidence","research","studies","shows","suggests","data","therefore","consequently"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","opponents","critics","some people","others","on the other hand","admittedly","nevertheless","it is true that","granted","even so","counter"]}
    ]},
    {t:"Should the school day be shorter?", h:"State your position, support it with two reasons and evidence, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly in the first sentence", k:["should","should not","shouldn't","must","agree","disagree","believe","opinion","view","argue","maintain","favour","favor","oppose","convinced","essay","this essay"]},
      {q:"Support it with reasons and evidence", k:["school day","hours","shorter","longer","tired","concentration","focus","sleep","homework","activities","sport","family","teachers","curriculum","time","efficient","because","reason","reasons","first","firstly","second","secondly","for example","for instance","such as","evidence","research","studies","shows","suggests","data","therefore","consequently"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","opponents","critics","some people","others","on the other hand","admittedly","nevertheless","it is true that","granted","even so","counter"]}
    ]},
    {t:"Should advertising for fast food be restricted?", h:"State your position, support it with two reasons and evidence, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly in the first sentence", k:["should","should not","shouldn't","must","agree","disagree","believe","opinion","view","argue","maintain","favour","favor","oppose","convinced","essay","this essay"]},
      {q:"Support it with reasons and evidence", k:["advertising","advertisement","adverts","fast food","restrict","ban","children","obesity","health","sugar","salt","companies","freedom","choice","government","law","influence","because","reason","reasons","first","firstly","second","secondly","for example","for instance","such as","evidence","research","studies","shows","suggests","data","therefore","consequently"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","opponents","critics","some people","others","on the other hand","admittedly","nevertheless","it is true that","granted","even so","counter"]}
    ]},
    {t:"Does working while studying help or harm students?", h:"State your position, support it with two reasons and evidence, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly in the first sentence", k:["should","should not","shouldn't","must","agree","disagree","believe","opinion","view","argue","maintain","favour","favor","oppose","convinced","essay","this essay"]},
      {q:"Support it with reasons and evidence", k:["work","working","part-time","job","studying","student","students","income","money","experience","responsibility","time","tired","grades","balance","skills","independence","because","reason","reasons","first","firstly","second","secondly","for example","for instance","such as","evidence","research","studies","shows","suggests","data","therefore","consequently"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","opponents","critics","some people","others","on the other hand","admittedly","nevertheless","it is true that","granted","even so","counter"]}
    ]},
    {t:"Should public transport be free for everyone?", h:"State your position, support it with two reasons and evidence, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly in the first sentence", k:["should","should not","shouldn't","must","agree","disagree","believe","opinion","view","argue","maintain","favour","favor","oppose","convinced","essay","this essay"]},
      {q:"Support it with reasons and evidence", k:["public transport","bus","buses","metro","train","free","fares","tickets","traffic","congestion","pollution","cost","taxes","government","poor","access","city","because","reason","reasons","first","firstly","second","secondly","for example","for instance","such as","evidence","research","studies","shows","suggests","data","therefore","consequently"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","opponents","critics","some people","others","on the other hand","admittedly","nevertheless","it is true that","granted","even so","counter"]}
    ]},
    {t:"Should schools teach financial skills instead of some traditional subjects?", h:"State your position, support it with two reasons and evidence, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly in the first sentence", k:["should","should not","shouldn't","must","agree","disagree","believe","opinion","view","argue","maintain","favour","favor","oppose","convinced","essay","this essay"]},
      {q:"Support it with reasons and evidence", k:["financial","finance","money","budget","budgeting","saving","debt","taxes","practical","skills","curriculum","traditional","subjects","useful","adult","life","economy","because","reason","reasons","first","firstly","second","secondly","for example","for instance","such as","evidence","research","studies","shows","suggests","data","therefore","consequently"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","opponents","critics","some people","others","on the other hand","admittedly","nevertheless","it is true that","granted","even so","counter"]}
    ]},
    {t:"Is remote work better than working in an office?", h:"State your position, support it with two reasons and evidence, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly in the first sentence", k:["should","should not","shouldn't","must","agree","disagree","believe","opinion","view","argue","maintain","favour","favor","oppose","convinced","essay","this essay"]},
      {q:"Support it with reasons and evidence", k:["remote","home","office","work","working","commute","traffic","flexible","flexibility","productivity","team","teamwork","communication","isolated","lonely","balance","employer","because","reason","reasons","first","firstly","second","secondly","for example","for instance","such as","evidence","research","studies","shows","suggests","data","therefore","consequently"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","opponents","critics","some people","others","on the other hand","admittedly","nevertheless","it is true that","granted","even so","counter"]}
    ]},
    {t:"Should sport be compulsory in high school?", h:"State your position, support it with two reasons and evidence, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly in the first sentence", k:["should","should not","shouldn't","must","agree","disagree","believe","opinion","view","argue","maintain","favour","favor","oppose","convinced","essay","this essay"]},
      {q:"Support it with reasons and evidence", k:["sport","compulsory","required","optional","physical","health","obesity","fitness","teamwork","discipline","time","academic","exams","choice","students","school","because","reason","reasons","first","firstly","second","secondly","for example","for instance","such as","evidence","research","studies","shows","suggests","data","therefore","consequently"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","opponents","critics","some people","others","on the other hand","admittedly","nevertheless","it is true that","granted","even so","counter"]}
    ]},
    {t:"Should the government invest more in renewable energy than in oil?", h:"State your position, support it with two reasons and evidence, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly in the first sentence", k:["should","should not","shouldn't","must","agree","disagree","believe","opinion","view","argue","maintain","favour","favor","oppose","convinced","essay","this essay"]},
      {q:"Support it with reasons and evidence", k:["renewable","solar","wind","energy","oil","petroleum","invest","investment","economy","jobs","environment","pollution","climate","future","generations","vision","diversify","cost","because","reason","reasons","first","firstly","second","secondly","for example","for instance","such as","evidence","research","studies","shows","suggests","data","therefore","consequently"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","opponents","critics","some people","others","on the other hand","admittedly","nevertheless","it is true that","granted","even so","counter"]}
    ]},
    {t:"Should smartphones be banned for children under twelve?", h:"State your position, support it with two reasons and evidence, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly in the first sentence", k:["should","should not","shouldn't","must","agree","disagree","believe","opinion","view","argue","maintain","favour","favor","oppose","convinced","essay","this essay"]},
      {q:"Support it with reasons and evidence", k:["smartphone","phone","phones","ban","banned","children","age","twelve","screen","addiction","sleep","social media","bullying","safety","parents","control","emergency","because","reason","reasons","first","firstly","second","secondly","for example","for instance","such as","evidence","research","studies","shows","suggests","data","therefore","consequently"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","opponents","critics","some people","others","on the other hand","admittedly","nevertheless","it is true that","granted","even so","counter"]}
    ]},
    {t:"Is tourism good for a country's culture?", h:"State your position, support it with two reasons and evidence, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly in the first sentence", k:["should","should not","shouldn't","must","agree","disagree","believe","opinion","view","argue","maintain","favour","favor","oppose","convinced","essay","this essay"]},
      {q:"Support it with reasons and evidence", k:["tourism","tourists","culture","heritage","tradition","traditions","economy","jobs","income","crowded","prices","respect","identity","exchange","understanding","sites","preserve","because","reason","reasons","first","firstly","second","secondly","for example","for instance","such as","evidence","research","studies","shows","suggests","data","therefore","consequently"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","opponents","critics","some people","others","on the other hand","admittedly","nevertheless","it is true that","granted","even so","counter"]}
    ]},
    {t:"Should school uniforms be required?", h:"State your position, support it with two reasons and evidence, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly in the first sentence", k:["should","should not","shouldn't","must","agree","disagree","believe","opinion","view","argue","maintain","favour","favor","oppose","convinced","essay","this essay"]},
      {q:"Support it with reasons and evidence", k:["uniform","uniforms","required","clothes","equal","equality","rich","poor","identity","discipline","expression","individuality","cost","parents","focus","appearance","because","reason","reasons","first","firstly","second","secondly","for example","for instance","such as","evidence","research","studies","shows","suggests","data","therefore","consequently"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","opponents","critics","some people","others","on the other hand","admittedly","nevertheless","it is true that","granted","even so","counter"]}
    ]},
    {t:"Is competition between students useful?", h:"State your position, support it with two reasons and evidence, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly in the first sentence", k:["should","should not","shouldn't","must","agree","disagree","believe","opinion","view","argue","maintain","favour","favor","oppose","convinced","essay","this essay"]},
      {q:"Support it with reasons and evidence", k:["competition","compete","rank","ranking","marks","grades","motivation","motivate","pressure","anxiety","stress","cooperation","collaborate","confidence","weaker","effort","best","because","reason","reasons","first","firstly","second","secondly","for example","for instance","such as","evidence","research","studies","shows","suggests","data","therefore","consequently"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","opponents","critics","some people","others","on the other hand","admittedly","nevertheless","it is true that","granted","even so","counter"]}
    ]},
    {t:"Should zoos be closed?", h:"State your position, support it with two reasons and evidence, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly in the first sentence", k:["should","should not","shouldn't","must","agree","disagree","believe","opinion","view","argue","maintain","favour","favor","oppose","convinced","essay","this essay"]},
      {q:"Support it with reasons and evidence", k:["zoo","zoos","animals","cages","captivity","wild","nature","conservation","protect","endangered","breeding","education","children","cruel","welfare","sanctuary","because","reason","reasons","first","firstly","second","secondly","for example","for instance","such as","evidence","research","studies","shows","suggests","data","therefore","consequently"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","opponents","critics","some people","others","on the other hand","admittedly","nevertheless","it is true that","granted","even so","counter"]}
    ]},
    {t:"Should people be fined for wasting water?", h:"State your position, support it with two reasons and evidence, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly in the first sentence", k:["should","should not","shouldn't","must","agree","disagree","believe","opinion","view","argue","maintain","favour","favor","oppose","convinced","essay","this essay"]},
      {q:"Support it with reasons and evidence", k:["water","waste","wasting","fine","fines","penalty","law","desalination","scarce","shortage","desert","farms","irrigation","awareness","campaign","education","consumption","save","because","reason","reasons","first","firstly","second","secondly","for example","for instance","such as","evidence","research","studies","shows","suggests","data","therefore","consequently"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","opponents","critics","some people","others","on the other hand","admittedly","nevertheless","it is true that","granted","even so","counter"]}
    ]},
    {t:"Does technology make us less social?", h:"State your position, support it with two reasons and evidence, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly in the first sentence", k:["should","should not","shouldn't","must","agree","disagree","believe","opinion","view","argue","maintain","favour","favor","oppose","convinced","essay","this essay"]},
      {q:"Support it with reasons and evidence", k:["technology","phone","phones","social media","online","friends","face to face","conversation","family","isolated","lonely","connect","distance","relatives","screen","time","relationships","because","reason","reasons","first","firstly","second","secondly","for example","for instance","such as","evidence","research","studies","shows","suggests","data","therefore","consequently"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","opponents","critics","some people","others","on the other hand","admittedly","nevertheless","it is true that","granted","even so","counter"]}
    ]},
    {t:"Should history be taught through stories rather than dates?", h:"State your position, support it with two reasons and evidence, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly in the first sentence", k:["should","should not","shouldn't","must","agree","disagree","believe","opinion","view","argue","maintain","favour","favor","oppose","convinced","essay","this essay"]},
      {q:"Support it with reasons and evidence", k:["history","stories","narrative","dates","facts","memorise","memorize","understand","causes","consequences","interest","boring","engaging","exam","accuracy","events","teacher","because","reason","reasons","first","firstly","second","secondly","for example","for instance","such as","evidence","research","studies","shows","suggests","data","therefore","consequently"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","opponents","critics","some people","others","on the other hand","admittedly","nevertheless","it is true that","granted","even so","counter"]}
    ]},
    {t:"Is it right for cities to grow at the expense of farmland?", h:"State your position, support it with two reasons and evidence, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly in the first sentence", k:["should","should not","shouldn't","must","agree","disagree","believe","opinion","view","argue","maintain","favour","favor","oppose","convinced","essay","this essay"]},
      {q:"Support it with reasons and evidence", k:["city","cities","growth","expand","housing","farmland","agriculture","farms","food","security","imports","population","planning","vertical","desert","environment","balance","because","reason","reasons","first","firstly","second","secondly","for example","for instance","such as","evidence","research","studies","shows","suggests","data","therefore","consequently"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","opponents","critics","some people","others","on the other hand","admittedly","nevertheless","it is true that","granted","even so","counter"]}
    ]},
    {t:"Should volunteering count towards university admission?", h:"State your position, support it with two reasons and evidence, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly in the first sentence", k:["should","should not","shouldn't","must","agree","disagree","believe","opinion","view","argue","maintain","favour","favor","oppose","convinced","essay","this essay"]},
      {q:"Support it with reasons and evidence", k:["volunteering","volunteer","community","service","admission","university","application","grades","character","responsibility","genuine","forced","pressure","unfair","time","experience","because","reason","reasons","first","firstly","second","secondly","for example","for instance","such as","evidence","research","studies","shows","suggests","data","therefore","consequently"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","opponents","critics","some people","others","on the other hand","admittedly","nevertheless","it is true that","granted","even so","counter"]}
    ]},
    {t:"Should students choose their own subjects from an early age?", h:"State your position, support it with two reasons and evidence, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly in the first sentence", k:["should","should not","shouldn't","must","agree","disagree","believe","opinion","view","argue","maintain","favour","favor","oppose","convinced","essay","this essay"]},
      {q:"Support it with reasons and evidence", k:["choose","choice","subjects","early","age","specialise","specialize","narrow","broad","interests","talent","mature","change","mind","career","flexible","curriculum","because","reason","reasons","first","firstly","second","secondly","for example","for instance","such as","evidence","research","studies","shows","suggests","data","therefore","consequently"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","opponents","critics","some people","others","on the other hand","admittedly","nevertheless","it is true that","granted","even so","counter"]}
    ]},
    {t:"Is censorship of the internet ever justified?", h:"State your position, support it with two reasons and evidence, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly in the first sentence", k:["should","should not","shouldn't","must","agree","disagree","believe","opinion","view","argue","maintain","favour","favor","oppose","convinced","essay","this essay"]},
      {q:"Support it with reasons and evidence", k:["censorship","censor","internet","freedom","speech","expression","harmful","content","children","violence","misinformation","false","government","control","rights","protect","balance","because","reason","reasons","first","firstly","second","secondly","for example","for instance","such as","evidence","research","studies","shows","suggests","data","therefore","consequently"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","opponents","critics","some people","others","on the other hand","admittedly","nevertheless","it is true that","granted","even so","counter"]}
    ]},
    {t:"Should homework be abolished in secondary school?", h:"Take one side. Give two arguments with examples, concede one point to the other side, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","homework","abolished","keep"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","practice","revision","memory","time","sleep","family","independent"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Should cities invest in public transport rather than wider roads?", h:"Take one side. Give two arguments with evidence, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","transport","roads","invest","priority"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","traffic","pollution","cost","capacity","metro","bus","induced","demand"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Is artificial intelligence a threat to future jobs?", h:"Take one side. Support it with two reasons and evidence, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","threat","jobs","artificial","intelligence","replace"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","automation","factory","translation","skills","new","roles","productivity","training"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Should school start later for teenagers?", h:"Take one side. Give two arguments with evidence, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","start","later","school","teenagers","earlier"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","sleep","concentration","body","clock","attendance","traffic","parents","work","grades"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Should the government subsidise electric cars?", h:"State your position, support it with evidence, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","subsidise","subsidize","electric","cars","government"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","pollution","oil","batteries","price","charging","industry","emissions","cost"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Is it better to specialise early or study broadly?", h:"Take one side. Give two arguments with examples, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","specialise","specialize","broadly","early","better"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","depth","expertise","flexible","change","career","interests","skills","market"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Should museums return objects taken during colonial times?", h:"Take one side. Give two arguments with examples, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","return","museums","objects","heritage","keep"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","origin","access","comparison","preservation","justice","visitors","country","history"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Does tourism damage the places it celebrates?", h:"Take one side. Support it with evidence, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","tourism","damage","places","benefit","harm"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","crowds","prices","water","income","jobs","culture","heritage","local","economy"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Should screen time for students be limited by law?", h:"Take one side. Give two arguments with evidence, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","screen","time","limited","law","families"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","sleep","eyes","attention","study","enforce","parents","freedom","health"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Is it fair to judge students mainly by final exams?", h:"Take one side. Give two arguments with evidence, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","fair","exams","final","judge","assessment"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","pressure","luck","memory","coursework","comparable","cheating","effort","year"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Should water in desert countries be priced to reduce waste?", h:"State your position, support it with evidence, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","water","priced","price","waste","subsidy"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","desalination","scarcity","consumption","poor","farming","leaks","meters","energy"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Should universities admit students by interview as well as grades?", h:"Take one side. Give two arguments with examples, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","interview","grades","admit","universities","selection"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","motivation","character","fair","bias","time","cost","predict","success"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Does competition in school prepare students for real life?", h:"Take one side. Support it with evidence, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","competition","prepare","real","life","cooperation"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","effort","confidence","stress","teamwork","workplace","ranking","motivation","failure"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Should plastic packaging be banned for food?", h:"State your position, support it with evidence, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","plastic","banned","packaging","food","alternative"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","waste","sea","recycling","hygiene","shelf","cost","paper","glass","pollution"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Is reading fiction as useful as reading science?", h:"Take one side. Give two arguments with examples, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","fiction","science","useful","reading","equally"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","empathy","language","imagination","facts","knowledge","vocabulary","thinking","perspective"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Should students be paid for good grades?", h:"Take one side. Give two arguments with evidence, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","paid","grades","money","reward","students"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","motivation","short","term","interest","learning","effort","pressure","fairness"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Does the internet make people better informed or more confused?", h:"Take one side. Support it with evidence, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","informed","confused","internet","better","worse"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","access","sources","rumour","rumors","checking","speed","quality","bias","search"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Should high schools teach statistics instead of advanced algebra?", h:"Take one side. Give two arguments with examples, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","statistics","algebra","teach","instead","curriculum"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","daily","decisions","probability","engineering","foundation","university","useful","risk"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Is working from home better for families?", h:"Take one side. Give two arguments with evidence, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","working","home","families","better","office"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","commute","time","children","flexible","isolation","boundaries","meetings","productivity"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Should cities limit the height of new buildings?", h:"State your position, support it with evidence, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","height","buildings","limit","cities","towers"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","density","land","light","traffic","housing","prices","character","services"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Does social media help or harm public debate?", h:"Take one side. Give two arguments with examples, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","debate","help","harm","social","media"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","voices","reach","anger","short","nuance","rumour","rumors","access","audience"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Should charity be organised by the state or by individuals?", h:"Take one side. Support it with evidence, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","charity","state","individuals","organised","organized"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","scale","fairness","efficiency","compassion","waqf","zakat","local","needs","records"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Is it right to keep animals for food production?", h:"Take one side. Give two arguments with evidence, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","animals","food","production","right","welfare"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","nutrition","land","water","emissions","treatment","tradition","cost","alternatives"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Should examinations allow the use of a dictionary?", h:"Take one side. Give two arguments with examples, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","dictionary","examinations","allow","exams","use"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","vocabulary","meaning","skill","time","fair","memorising","memorizing","real","reading"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Does studying abroad weaken a student's ties to his country?", h:"Take one side. Support it with evidence, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","abroad","ties","country","weaken","strengthen"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","identity","language","return","skills","experience","family","culture","contribute"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Should public libraries spend more on digital or printed books?", h:"State your position, support it with evidence, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","digital","printed","libraries","spend","books"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","access","cost","storage","screens","reading","licence","license","remote","students"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Is it better to fail and learn than to succeed easily?", h:"Take one side. Give two arguments with examples, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","fail","learn","succeed","easily","better"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","effort","resilience","confidence","feedback","risk","time","motivation","lesson"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Should employers be allowed to read candidates' social media?", h:"Take one side. Give two arguments with evidence, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","employers","allowed","social","media","privacy"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","character","risk","judgement","judgment","context","bias","public","private","fair"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Does a country need heavy industry to be prosperous?", h:"Take one side. Support it with evidence, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","industry","prosperous","heavy","services","need"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","jobs","exports","technology","services","tourism","oil","diversify","investment"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Should schools measure effort as well as achievement?", h:"Take one side. Give two arguments with examples, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","effort","achievement","measure","schools","grades"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","motivation","fair","progress","starting","point","subjective","objective","report","growth"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Should a second language be compulsory until the end of school?", h:"Take one side. Give two arguments with examples, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","compulsory","language","second","school","optional"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","brain","travel","work","motivation","time","subjects","culture","opportunity"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Is it the duty of the rich to support the poor?", h:"State your position, support it with reasoning, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","duty","rich","poor","support","obligation"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","zakat","justice","society","stability","charity","earned","taxes","need","effort"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Should cars be banned from the centre of holy cities?", h:"Take one side. Give two arguments with evidence, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","banned","cars","centre","center","cities"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","crowds","safety","walking","pollution","elderly","transport","access","pilgrims","noise"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Does technology widen or narrow the gap between rich and poor?", h:"Take one side. Support it with evidence, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","widen","narrow","gap","technology","inequality"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","access","internet","skills","cost","education","jobs","remote","cheap","phones"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Should schools be allowed to use surveillance cameras in classrooms?", h:"Take one side. Give two arguments with examples, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","surveillance","cameras","classrooms","allowed","privacy"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","safety","behaviour","behavior","trust","teachers","pressure","recordings","rights","monitor"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Is a long holiday good for students?", h:"Take one side. Give two arguments with evidence, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","holiday","long","good","students","shorter"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","rest","forget","family","travel","revision","routine","summer","skills","work"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Should scientists be allowed to edit human genes to prevent disease?", h:"State your position, support it with reasoning, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","genes","edit","scientists","disease","prevent"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","suffering","inherited","safety","unknown","consent","limits","ethics","benefit","risk"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Does watching sport have any value compared with playing it?", h:"Take one side. Give two arguments with examples, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","watching","playing","sport","value","compared"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","health","community","inspiration","passive","hours","skills","teamwork","fitness","identity"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Should a city build a stadium or a hospital first?", h:"Take one side. Support it with reasoning, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","stadium","hospital","build","first","priority"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","health","lives","youth","economy","jobs","urgent","long","term","budget"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Is it better to learn from a teacher or from a video?", h:"Take one side. Give two arguments with examples, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","teacher","video","learn","better","online"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","questions","feedback","pace","repeat","discipline","attention","cost","access","discussion"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Should students be required to learn a craft or a trade?", h:"Take one side. Give two arguments with evidence, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","craft","trade","required","students","learn"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","skills","independent","jobs","respect","hands","time","academic","income","practical"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Does advertising create needs that people do not have?", h:"Take one side. Support it with evidence, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","advertising","needs","create","wants","influence"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","children","desire","compare","information","choice","prices","pressure","brands","honest"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Should the working week be four days?", h:"Take one side. Give two arguments with evidence, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","four","days","working","week","shorter"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","productivity","rest","family","output","services","cost","trials","health","hours"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Is it right to use animals in medical research?", h:"State your position, support it with reasoning, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","animals","medical","research","right","testing"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","medicines","safety","suffering","alternatives","cells","computer","models","lives","regulation"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Should schools rank students publicly?", h:"Take one side. Give two arguments with examples, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","rank","publicly","schools","students","private"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","motivation","shame","confidence","transparent","effort","compare","weakest","privacy","pressure"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Does a big city offer a better life than a small town?", h:"Take one side. Support it with evidence, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","city","town","better","life","small"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","jobs","services","hospitals","traffic","cost","quiet","community","schools","pollution"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Should exam results decide a student's whole future?", h:"Take one side. Give two arguments with examples, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","results","decide","future","whole","exam"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","one","day","illness","luck","effort","skills","chances","fair","measure","career"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Is saving historic buildings worth the cost?", h:"Take one side. Support it with evidence, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","historic","buildings","saving","cost","worth"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","identity","tourism","memory","expense","housing","modern","repair","heritage","value"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Should charity donations be anonymous?", h:"Take one side. Give two arguments with reasoning, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","anonymous","donations","charity","public","named"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","sincerity","dignity","example","encourage","pride","trust","accountability","receiver","reward"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Does learning poetry by heart still have a purpose?", h:"Take one side. Give two arguments with examples, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","poetry","heart","memorise","memorize","purpose"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","memory","language","rhythm","understanding","time","meaning","tradition","confidence","recite"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Should food imports be reduced to support local farmers?", h:"State your position, support it with evidence, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","imports","reduced","local","farmers","support"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","prices","security","water","climate","jobs","choice","quality","cost","desert"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Is it better for a country to be self-sufficient or to trade widely?", h:"Take one side. Support it with reasoning, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","self","sufficient","trade","widely","country"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","security","cost","specialise","specialize","supply","crisis","prices","partners","industry"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Should children be given smartphones before they finish primary school?", h:"Take one side. Give two arguments with evidence, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","children","smartphones","primary","given","before"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","safety","contact","sleep","content","attention","learning","control","age","apps"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Does volunteering benefit the volunteer as much as the community?", h:"Take one side. Support it with examples, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","volunteering","volunteer","community","benefit","equally"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","skills","confidence","perspective","time","need","service","experience","gratitude","work"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Should every student learn to write computer code?", h:"Take one side. Give two arguments with examples, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","code","coding","student","learn","every"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","logic","jobs","problem","solving","future","interest","time","tools","thinking"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Is it acceptable to copy a design if you improve it?", h:"State your position, support it with reasoning, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","copy","design","improve","acceptable","original"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","progress","credit","effort","rights","innovation","cheaper","users","fair","inspiration"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Should sport stars earn more than doctors?", h:"Take one side. Support it with reasoning, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","sport","stars","earn","doctors","more"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","market","audience","value","lives","training","short","career","fair","demand"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Does a school need a library if every student has the internet?", h:"Take one side. Give two arguments with examples, concede one point, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","library","internet","school","need","still"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","quiet","guidance","quality","sources","screens","habit","cost","equal","access"]},
      {q:"Concede a point to the other side", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Should students repeat a year if they fail?", h:"Take one side. Give two arguments with evidence, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","repeat","year","fail","students","promote"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","foundation","confidence","age","friends","gaps","support","summer","cost","progress"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]},
    {t:"Is it right to measure a country's success by its income alone?", h:"State your position, support it with reasoning, answer the opposite view, then conclude.", points:[
      {q:"State your position clearly", k:["should","should not","agree","disagree","believe","argue","opinion","view","think","must","convinced","position","measure","success","income","alone","country"]},
      {q:"Give arguments with examples", k:["because","for example","for instance","such as","research","studies","shows","suggests","evidence","first","second","furthermore","therefore","data","health","education","happiness","equality","environment","simple","compare","number","wealth"]},
      {q:"Answer the opposite view", k:["however","although","while","whereas","admittedly","it is true that","on the other hand","nevertheless","critics","some","others","granted"]}]}
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
       say:"نصّ مترابط: مقدّمة ثم أفكار مرتّبة ثم خاتمة، بأدوات ربط متنوّعة"},
  /* فهدٌ ثالثُ ثانويّ، ونهايةُ الثاني عشر في المنهج السعوديّ B2 — فهذا هدفُه */
  B2: {name:"B1+ نحو B2", minWords:150, minSent:8, minConn:4, needSeq:true,
       conn:["however","therefore","consequently","furthermore","in addition","moreover","nevertheless","in contrast",
             "for example","for instance","although","while","whereas","as a result","first","then","finally",
             "in conclusion","because","and","but","so"],
       say:"مقالٌ قصيرٌ ذو أطروحةٍ: مقدّمةٌ تُعلِن الموقف، ثمّ حجّةٌ بدليلٍ لكلِّ فقرة، ثمّ خاتمةٌ تُحكِمه — بأدواتٍ أكاديميّةٍ وتسجيلٍ رسميّ"}
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
  return [tr("رتّب الكلمات لتكوين جملة صحيحة:","Put the words in the correct order to make a sentence:")+en(words),
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
  return [tr("أيّ الجمل مكتوبة بطريقة صحيحة؟","Which sentence is written correctly?"),o[0].map(en),o[1],
    "كلّ جملة تبدأ بحرفٍ <b>كبير</b> وتنتهي بـ<b>نقطة</b>.","wc:"+s+"|"+v];
}

/* ضمير المتكلّم I يُكتب كبيرًا دائمًا (ابتدائي) */
function wCapitalI(){
  var v=gp(["like reading","play with my brother","help my father","go to the park","study every evening","watch cartoons"]);
  var t=gp(TIME);
  var correct = "I "+v+" "+t+".";
  var o=pick3(correct,["i "+v+" "+t+".", "I "+v+" "+t]); if(!o) return null;
  return [tr("أيّ الجمل مكتوبة بطريقة صحيحة؟","Which sentence is written correctly?"),o[0].map(en),o[1],
    "الضمير "+en("I")+" يُكتب <b>كبيرًا دائمًا</b> في أيّ موضعٍ من الجملة، والجملة تنتهي بنقطة.","wi:"+v];
}

/* أداة الربط الصحيحة (ابتدائي) */
function wConnect(){
  var p=gp(JOIN), c=p[2];
  var wrongs=shuffle(["and","but","because","so"].filter(function(x){ return x!==c; })).slice(0,2);
  var o=pick3(c,wrongs); if(!o) return null;
  return [tr("اختر أداة الربط المناسبة:","Choose the correct linking word:")+en(p[0]+" ___ "+p[1]+"."),
    o[0].map(en),o[1],
    "الصحيح: "+en(p[0]+" "+c+" "+p[1]+".")+"<br>"+
    "<b>and</b> للإضافة · <b>but</b> للتضادّ · <b>because</b> للسبب · <b>so</b> للنتيجة.",
    "wj:"+p[0]];
}

/* جملة الموضوع (متوسط) */
function wTopicSentence(){
  var p=gp(TOPIC_SENT);
  var o=pick3(p[1],[p[2],p[3]]); if(!o) return null;
  return [tr("أيّ جملةٍ تصلح <b>جملةً موضوعيّة</b> (Topic Sentence) لفقرةٍ عن «"+p[0]+"»؟",
      "Which sentence is a good topic sentence for a paragraph about \u201c"+p[0]+"\u201d?"),
    o[0].map(en),o[1],
    "جملة الموضوع تُلخّص فكرة الفقرة كلّها. أمّا الجملة التي تذكر تفصيلةً دقيقة فهي جملة داعمة، والجملة البعيدة عن الموضوع لا مكان لها.",
    "wt:"+p[0]];
}

/* الجملة الخارجة عن الموضوع (متوسط) */
function wOffTopic(){
  var p=gp(TOPIC_SENT);
  var o=pick3(p[3],[p[1],p[2]]); if(!o) return null;
  return [tr("فقرةٌ عن «"+p[0]+"». أيّ جملةٍ <b>لا تنتمي</b> إليها؟",
      "A paragraph about \u201c"+p[0]+"\u201d. Which sentence does not belong?"),
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
  return [tr("رتّب جُمل الفقرة ترتيبًا صحيحًا:","Put the sentences of the paragraph in the correct order:"),o[0].map(en),o[1],
    "علامات التسلسل تدلّك على الترتيب: "+en("First")+" ← "+en("Then")+" ← "+en("Finally")+".",
    "wp:"+p[0]];
}

/* إصلاح الجملة المتلاحقة (متوسط) */
function wRunOn(){
  var p=gp(RUNON);
  var o=pick3(p[1],[p[2],p[3]]); if(!o) return null;
  return [tr("الجملة التالية <b>متلاحقة</b> (run-on):","This sentence is a run-on. Which correction is right?")+en(p[0]),
    o[0].map(en),o[1],
    "جملتان كاملتان لا تُوضعان معًا بلا رابط. الحلّ: <b>فاصلة + أداة ربط</b> ("+en("and / but / so")+") أو نقطة تفصل بينهما.",
    "wr:"+p[0]];
}

/* أدوات ربط الفقرة (متوسط) */
function wConnector2(){
  var p=gp(CONN2);
  var o=pick3(p[2],[p[3],p[4]]); if(!o) return null;
  return [tr("اختر الأداة المناسبة:","Choose the correct linking word:")+en(p[0])+"<br>"+en(p[1]),
    o[0].map(en),o[1],
    "<b>However</b> للتضادّ · <b>Therefore</b> للنتيجة · <b>For example</b> للتمثيل · <b>In addition</b> للإضافة · <b>Finally</b> للختام.",
    "wn:"+p[0]];
}

/* ═════════ المستوى ٣ — أكاديميّ (فهد: ثالث ثانويّ، متقدّمٌ لستيب) ═════════
   طلبُ الأب (٢٤ سبتمبر ٢٠٢٦): «حط قسم تعبير لفهد». والمستويان ١ و٢
   جملةٌ وفقرةٌ لطلبةِ الابتدائيِّ والمتوسّط، فلا يصلحان لمن يتقدّم لستيب.
   فهذا مستوًى ثالثٌ أكاديميّ: أطروحةٌ ومقالٌ وتسجيلٌ رسميٌّ وتحليلٌ كتابيّ.

   وأُنبِّه على أمرٍ في ستيب: قسمُ الكتابةِ فيه — «التحليل الكتابيّ» —
   اختيارٌ من متعدّدٍ لا مقالٌ يُكتَب: تمييزُ الخطأ، وأفضلُ صياغة، وترتيبُ
   الفقرة. فالجزءُ الأوّلُ (التدريب) هو الأقربُ إلى صورةِ الاختبار،
   والجزءُ الثاني (كتابةُ مقالٍ حقيقيّ) يبني اللغةَ نفسَها. وهذا ما أعرفه
   عن صيغةِ الاختبار ولا أقدر أن أتحقّق منه من هنا (قياسٌ محجوبٌ عن جهازي)
   فليصحّح الأبُ إن كان غيرَ ذلك. */

/* [الموضوع, أطروحةٌ تصلح للمقال, تفصيلةٌ ضيّقة, خارجٌ عن الموضوع] */
var TOPIC_SENT3 = [
  ["studying abroad",
   "Studying abroad develops a student's independence, language skills and career prospects.",
   "My cousin paid about forty thousand riyals for his first year in Manchester.",
   "The new stadium in our city can hold sixty thousand people.",
   "Many Saudi students travel to Britain, the United States and Malaysia."],
  ["social media and students",
   "Although social media keeps students connected, it can seriously damage their study habits.",
   "I opened my first account when I was thirteen years old.",
   "My father prefers tea to coffee in the morning.",
   "Most teenagers check their phones within minutes of waking up."],
  ["online learning",
   "Online learning offers real flexibility, but it demands far more self-discipline than a classroom does.",
   "My laptop battery lasts about four hours without charging.",
   "Football is the most popular sport in the world.",
   "Some universities recorded every lecture during the pandemic."],
  ["choosing a university major",
   "Students should choose a major that suits both their own abilities and the needs of the job market.",
   "The application deadline last year was the fifteenth of May.",
   "Camels can survive for several days without drinking water.",
   "Engineering and medicine remain the most requested colleges."],
  ["part-time work for students",
   "A part-time job teaches students responsibility, although it can take time away from their studies.",
   "I worked eighteen hours a week in a small bookshop.",
   "The Red Sea is famous for its coral reefs.",
   "Some shops offer students four-hour evening shifts."],
  ["public transport",
   "Investing in public transport reduces traffic, pollution and the daily cost of travel.",
   "A single bus ticket in my city costs three riyals.",
   "My sister is learning to play the piano.",
   "The capital opened its first metro line a few years ago."],
  ["reading books",
   "Reading full books builds vocabulary and concentration in a way that short videos cannot.",
   "I finished a four-hundred-page novel in six days.",
   "Our school has two computer laboratories.",
   "Short videos now average less than a minute in length."],
  ["learning a second language",
   "Learning a second language sharpens memory, opens career doors and deepens cultural understanding.",
   "I study English for about forty minutes every evening.",
   "The desert becomes very cold at night.",
   "English is the second language taught in most Saudi schools."],
  ["exams and learning",
   "Exams measure only part of what a student has really learned.",
   "Our final exam lasted two hours and ten minutes.",
   "Dates are harvested in late summer.",
   "Most final exams are held in a single hall under supervision."],
  ["volunteering",
   "Volunteering benefits the community and gives young people skills that no classroom teaches.",
   "I volunteered for six Saturdays at a book fair.",
   "The airport is thirty kilometres from the city centre.",
   "Several charities run weekend programmes for school students."]
];

/* [الرسميّة الصحيحة, عامّيّةٌ أو دردشة, عامّيّةٌ أو دردشة] */
var REGISTER3 = [
  ["The results of the study were not entirely convincing.",
   "The results of the study were kind of weak, to be honest.",
   "The study's results? Not great at all.",
   "Yeah, the study didn't really prove much."],
  ["The evidence suggests that the policy had little effect.",
   "It looks like the policy didn't really do anything.",
   "Basically the policy was a total flop.",
   "The policy? A total waste of time, if you ask me."],
  ["A considerable number of participants withdrew from the programme.",
   "Loads of people just dropped out of the programme.",
   "Tons of them quit, which was pretty bad.",
   "So many people bailed on the programme, it was crazy."],
  ["This report examines the causes of traffic congestion in the capital.",
   "In this report I'm gonna talk about why traffic is so awful downtown.",
   "So, traffic downtown — let me tell you, it's a nightmare.",
   "OK so this report is all about traffic being a mess downtown."],
  ["The findings should be interpreted with caution.",
   "Don't take these findings too seriously, guys.",
   "You probably shouldn't trust this stuff much.",
   "Take these findings with a pinch of salt, guys."],
  ["Further research is required before any conclusion can be drawn.",
   "We need way more research before we can say anything for sure.",
   "Honestly nobody really knows yet, so whatever.",
   "Nobody's got a clue yet, so let's not pretend otherwise."]
];

/* [جملةٌ تامّة (الصحيح), شبهُ جملةٍ, شبهُ جملةٍ] */
var FRAGMENT3 = [
  ["Many students struggle with academic writing in their first year.",
   "Because many students struggle with academic writing in their first year.",
   "Struggling with academic writing in their very first year.",
   "In their first year, when many students struggle with academic writing."],
  ["The committee published its report in March.",
   "Although the committee published its report in March.",
   "The committee, having published its report in March.",
   "Published in March by the committee that was formed last year."],
  ["Renewable energy has become much cheaper.",
   "Since renewable energy has become much cheaper.",
   "Renewable energy becoming much cheaper every year.",
   "Now that renewable energy has become much cheaper."],
  ["The researchers repeated the experiment twice.",
   "After the researchers repeated the experiment twice.",
   "The researchers repeating the experiment twice in one week.",
   "Repeated twice by the researchers in a single week."],
  ["Reading improves a student's vocabulary.",
   "Which improves a student's vocabulary.",
   "Improving a student's vocabulary week after week.",
   "Because reading improves a student's vocabulary so quickly."]
];

/* [الأوجزُ والأوضح (الصحيح), مُطوَّلة, مُطوَّلة] */
var WORDY3 = [
  ["The committee postponed the meeting.",
   "The committee made the decision that the meeting would be postponed until a later time.",
   "It was decided by the committee that the meeting should be postponed to a later date.",
   "What the committee did was to arrive at a decision to put the meeting off."],
  ["We must reduce waste.",
   "It is absolutely necessary that we must take steps in order to reduce the amount of waste.",
   "There is a need for the reduction of the amount of waste that is produced by us.",
   "It is the case that a reduction in waste is something we are required to achieve."],
  ["The results surprised the researchers.",
   "The results were surprising in nature to the researchers who conducted the study.",
   "It came as a surprise to the researchers that the results were what they were.",
   "The researchers found themselves in a state of surprise on account of the results."],
  ["Few students finished on time.",
   "There were only a very small number of students who managed to finish at the right time.",
   "The number of students finishing in a timely manner was a rather small one.",
   "Only a rather limited quantity of students succeeded in the finishing of the work on time."],
  ["The policy failed.",
   "The policy was unsuccessful in achieving the goals that it had originally set out to achieve.",
   "It turned out to be the case that the policy did not succeed in any real way.",
   "The end result was that the policy turned out not to be a successful one at all."]
];

/* [الجملةُ الأولى, الثانية بالفراغ, الأداةُ الصحيحة, خطأ, خطأ] */
var CONN3 = [
  ["The experiment was repeated three times.","___ , the results remained inconsistent.","However","Therefore","For example",
   "In addition"],
  ["Tuition fees have risen sharply.","___ , fewer families can afford private universities.","Consequently","Nevertheless","In contrast",
   "For example"],
  ["Many species are disappearing quickly.","___ , the Arabian leopard is now extremely rare.","For example","Therefore","However",
   "In contrast"],
  ["Solar energy is clean and renewable.","___ , the price of panels has fallen sharply.","Furthermore","However","In contrast",
   "Nevertheless"],
  ["The government raised the fuel tax.","___ , car use in the capital fell by a fifth.","As a result","Although","For example",
   "However"],
  ["The book is long and detailed.","___ , it is written in very simple language.","However","Therefore","As a result",
   "Consequently"],
  ["Students need practice to write well.","___ , they should write something every week.","Therefore","However","In contrast",
   "Nevertheless"],
  ["The plan looked simple on paper.","___ , it proved difficult to apply.","Nevertheless","Therefore","In addition",
   "As a result"],
  ["The first study used a very small sample.","___ , the second one surveyed ten thousand people.","In contrast","Therefore","For example",
   "Consequently"],
  ["Reading widely improves vocabulary.","___ , it strengthens a student's general knowledge.","In addition","However","Instead",
   "In contrast"]
];

/* [الصحيحةُ نحويًّا, خطأٌ شائع, خطأٌ شائع] */
var GRAM3 = [
  ["The number of students has increased steadily.",
   "The number of students have increased steadily.",
   "The number of students are increasing steadily.",
   "The number of students have been increased steadily."],
  ["Neither of the two answers is correct.",
   "Neither of the two answers are correct.",
   "Neither of the two answers were correct.",
   "Neither of the two answers are being correct."],
  ["Each of the students was given a separate room.",
   "Each of the students were given a separate room.",
   "Each of the students have been given a separate room.",
   "Each of the students were being given a separate room."],
  ["Hardly had he finished speaking when the bell rang.",
   "Hardly he had finished speaking when the bell rang.",
   "Hardly had he finished speaking than the bell rang.",
   "Hardly did he finished speaking when the bell rang."],
  ["If I had known, I would have told you.",
   "If I would have known, I would have told you.",
   "If I had known, I would told you.",
   "If I have known, I would have told you."],
  ["She denied taking the money.",
   "She denied to take the money.",
   "She denied take the money.",
   "She denied that taking the money."],
  ["He suggested that we leave early.",
   "He suggested us to leave early.",
   "He suggested we leaving early.",
   "He suggested to us leaving early."],
  ["There are fewer cars on the road today.",
   "There are less cars on the road today.",
   "There is fewer cars on the road today.",
   "There is less cars on the road today."],
  ["I look forward to hearing from you.",
   "I look forward to hear from you.",
   "I look forward hearing from you.",
   "I am looking forward to hear from you."],
  ["Most of the information was useful.",
   "Most of the informations were useful.",
   "Most of the information were useful.",
   "Most of the information have been useful."],
  ["He is used to working long hours.",
   "He is used to work long hours.",
   "He used to working long hours.",
   "He is used working long hours."],
  ["The committee has reached a decision.",
   "The committee has reach a decision.",
   "The committee have reach a decision.",
   "The committee has been reach a decision."]
];

/* ثلاثُ جملٍ أكاديميّةٍ مرتّبةٍ: أطروحةٌ ← دليلٌ ← خاتمة */
var SEQ3 = [
  ["First, the researchers collected data from four hundred families.",
   "Then, they compared the answers with the results of an earlier survey.",
   "Finally, they concluded that household income was the strongest factor."],
  ["First, the city widened two of its main roads.",
   "Then, it added three new bus routes to the eastern districts.",
   "Finally, traffic during the morning rush hour fell by almost a fifth."],
  ["First, I read the question carefully and underlined its key terms.",
   "Then, I planned three paragraphs, one for each of my main points.",
   "Finally, I reread my essay and corrected the errors I had missed."],
  ["First, the company tested the new design in a single branch.",
   "Then, it trained the staff of every other branch to use it.",
   "Finally, the design was introduced across the whole country."],
  ["First, the school surveyed its students about their reading habits.",
   "Then, it opened the library for an extra hour each afternoon.",
   "Finally, borrowing rose by more than a third within one term."]
];

/* ─────────── مولّدات المستوى الثالث ─────────── */

/* الأطروحة (thesis statement) — أعمّ من جملة الموضوع في المستوى الثاني */
function wThesis(){
  var p=gp(TOPIC_SENT3);
  var o=pick4(p[1],[p[2],p[3],p[4]]); if(!o) return null;
  return [tr("أيُّ جملةٍ تصلح <b>أطروحةً</b> (Thesis Statement) لمقالٍ عن «"+p[0]+"»؟",
      "Which sentence works as a thesis statement for an essay about \u201c"+p[0]+"\u201d?"),
    o[0].map(en),o[1],
    "الأطروحةُ تُعلِن موقفَ المقالِ كلِّه وتُلمِّح إلى محاورِه. أمّا الجملةُ التي تذكر رقمًا أو واقعةً واحدةً فهي دليلٌ داخلَ فقرةٍ لا أطروحة، والبعيدةُ عن الموضوعِ لا موضعَ لها.",
    "w3t:"+p[0]];
}
/* الجملة الخارجة عن موضوع المقال */
function wOffTopic3(){
  var p=gp(TOPIC_SENT3);
  var o=pick4(p[3],[p[1],p[2],p[4]]); if(!o) return null;
  return [tr("مقالٌ عن «"+p[0]+"». أيُّ جملةٍ <b>لا تنتمي</b> إليه؟",
      "An essay about \u201c"+p[0]+"\u201d. Which sentence does not belong?"),
    o[0].map(en),o[1],
    "وحدةُ الموضوعِ شرطٌ في المقالِ كما في الفقرة: كلُّ جملةٍ تخدم الأطروحة. والدليلُ الضيّقُ ينتمي إليه وإن كان جزئيًّا، والجملةُ الغريبةُ لا تنتمي البتّة.",
    "w3x:"+p[0]];
}
/* التسجيل الرسميّ (register) — عمادُ الكتابة الأكاديميّة */
function wRegister(){
  var p=gp(REGISTER3);
  var o=pick4(p[0],[p[1],p[2],p[3]]); if(!o) return null;
  return [tr("أيُّ جملةٍ تناسب <b>الكتابةَ الأكاديميّةَ الرسميّة</b>؟","Which sentence is suitable for formal academic writing?"),
    o[0].map(en),o[1],
    "الأكاديميُّ يتجنّب المختصراتِ ولغةَ الحديثِ ("+en("kind of / gonna / loads of / to be honest")+") والخِطابَ المباشرَ للقارئ، ويستعمل صيغًا محتاطةً مثل "+en("suggests / may / appears to")+".",
    "w3g:"+p[0].slice(0,18)];
}
/* شبه الجملة (fragment) — أشهرُ ما يُسأل عنه في التحليل الكتابيّ */
function wFragment(){
  var p=gp(FRAGMENT3);
  var o=pick4(p[0],[p[1],p[2],p[3]]); if(!o) return null;
  return [tr("أيُّ ما يلي <b>جملةٌ تامّة</b> لا شبهَ جملةٍ (fragment) ؟","Which of these is a complete sentence, not a fragment?"),
    o[0].map(en),o[1],
    "الجملةُ التامّةُ فيها فاعلٌ وفعلٌ مُصرَّفٌ وتستقلّ بمعناها. وما بدأ بأداةِ ربطٍ تابعةٍ ("+en("Because / Although / Since / Which")+") أو كان فعلُه "+en("-ing")+" وحدَه فهو شبهُ جملةٍ يحتاج تكملة.",
    "w3f:"+p[0].slice(0,18)];
}
/* الإيجاز (conciseness) — «أفضل صياغة» */
function wWordy(){
  var p=gp(WORDY3);
  var o=pick4(p[0],[p[1],p[2],p[3]]); if(!o) return null;
  return [tr("أيُّ صياغةٍ <b>أوجزُ وأوضح</b> بالمعنى نفسِه؟","Which version is the most concise and clear with the same meaning?"),
    o[0].map(en),o[1],
    "الأكاديميُّ موجَزٌ لا مُطوَّل: تُحذف الحشوُ مثل "+en("made the decision that / it is necessary that / in nature / in a timely manner")+" ويُستعمل الفعلُ المباشرُ والمبنيُّ للمعلوم.",
    "w3w:"+p[0].slice(0,18)];
}
/* أدوات الربط الأكاديميّة */
function wConnector3(){
  var p=gp(CONN3);
  var o=pick4(p[2],[p[3],p[4],p[5]]); if(!o) return null;
  return [tr("اختر الأداةَ المناسبة:","Choose the correct linking word:")+en(p[0])+"<br>"+en(p[1]),
    o[0].map(en),o[1],
    "للتضادّ: "+en("However / Nevertheless / In contrast")+" · وللنتيجة: "+en("Therefore / Consequently / As a result")+" · وللإضافة: "+en("Furthermore / In addition / Moreover")+" · وللتمثيل: "+en("For example / For instance")+".",
    "w3n:"+p[0].slice(0,18)];
}
/* الصحّة النحويّة — أخطاءٌ شائعةٌ في قسم التراكيب */
function wGrammar3(){
  var p=gp(GRAM3);
  var o=pick4(p[0],[p[1],p[2],p[3]]); if(!o) return null;
  return [tr("أيُّ جملةٍ <b>صحيحةٌ نحويًّا</b>؟","Which sentence is grammatically correct?"),
    o[0].map(en),o[1],
    "الصحيح: "+en(p[0])+"<br>وأشهرُ ما يُختبَر: مطابقةُ الفعلِ لفاعلٍ بعيدٍ ("+en("the number of … has")+")، و"+en("each / neither")+" مفردان، و"+en("information")+" لا يُجمَع، و"+en("fewer")+" للمعدودِ و"+en("less")+" لغيرِه، وبعد "+en("deny / suggest / look forward to")+" صيغةُ "+en("-ing")+" أو "+en("that")+".",
    "w3r:"+p[0].slice(0,18)];
}
/* الجملةُ المتلاحقة — بأربعةِ خيارات. والمشتّتُ الرابعُ يُبنى آليًّا لا
   يُؤلَّف: نُسقِط أداةَ الربطِ من الإصلاحِ الصحيحِ فتبقى الفاصلةُ وحدَها
   (comma splice) — وهو الخطأُ الذي يقع فيه الطلبةُ فعلًا، فهو أنفعُ
   مشتّتٍ ممكن، وبناؤه من النصِّ نفسِه يمنع خطأَ التأليف. */
function wRunOn3(){
  var p=gp(RUNON);
  var splice=p[1].replace(/,\s+(and|but|so|yet|or)\s+/, ", ");
  if(splice===p[1]) return null;      /* ما وجدنا الرابطَ فلا نُخرِج سؤالًا ناقصًا */
  var o=pick4(p[1],[splice,p[2],p[3]]); if(!o) return null;
  return [tr("الجملة التالية <b>متلاحقة</b> (run-on):","This sentence is a run-on. Which correction is right?")+en(p[0]),
    o[0].map(en),o[1],
    "الصحيح: "+en(p[1])+"<br>جملتان كاملتان لا تُجمَعان بفاصلةٍ وحدَها (comma splice) ولا بلا رابطٍ أصلًا. الحلّ: <b>فاصلة + أداة ربط</b> ("+en("and / but / so")+") أو نقطةٌ تفصل بينهما.",
    "w3o:"+p[0].slice(0,18)];
}

/* ترتيب فقرة أكاديميّة */
function wOrderPara3(){
  var p=gp(SEQ3);
  var correct=p.join(" ");
  var w1=[p[1],p[0],p[2]].join(" ");
  var w2=[p[2],p[1],p[0]].join(" ");
  var w3=[p[0],p[2],p[1]].join(" ");
  var o=pick4(correct,[w1,w2,w3]); if(!o) return null;
  return [tr("رتّب جُملَ الفقرةِ ترتيبًا منطقيًّا:","Put the sentences of the paragraph in a logical order:"),o[0].map(en),o[1],
    "الفقرةُ الأكاديميّةُ تسير: خطوةٌ أولى ← ثمّ ما بُني عليها ← ثمّ النتيجةُ أو الخاتمة. وعلاماتُ التسلسلِ "+en("First / Then / Finally")+" تدلّك، والنتيجةُ لا تتقدّم سببَها.",
    "w3p:"+p[0].slice(0,18)];
}

var GENS = {
  1: [wOrder,wCapital,wCapitalI,wConnect,wTopicSentence,wOrderPara],
  2: [wTopicSentence,wOffTopic,wOrderPara,wRunOn,wConnector2,wConnect],
  3: [wThesis,wOffTopic3,wRegister,wFragment,wWordy,wConnector3,wGrammar3,wOrderPara3,wRunOn3]
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
/* أدواتُ الوصلِ التابعة: تجعل الجملةَ مركّبةً لا مرصوفة. وهي غيرُ
   أدواتِ الربطِ بين الجمل (however · in addition) التي يقيسها
   «الترتيب» — فلا يُحسَب الشيءُ مرّتين. */
var SUBORD = ["because","although","though","while","whereas","since","unless","if",
              "when","whenever","before","after","until","which","who","whose","that",
              "so that","even though","as long as","in order to"];
/* المئةُ الأشيعُ في الإنجليزيّة (قوائمُ التواترِ المعياريّة) — ما خرج
   عنها وطُولُه أكثرُ من ثلاثةِ أحرفٍ يُعَدُّ مفردةً حقيقيّة. وطولُ
   الثلاثةِ شرطٌ لئلّا تُحسَب الأدواتُ القصيرةُ مفرداتٍ راقية. */
var COMMON100 = (function(){
  var L = ("the be to of and a in that have i it for not on with he as you do at this but his by from "+
    "they we say her she or an will my one all would there their what so up out if about who get which go me "+
    "when make can like time no just him know take people into year your good some could them see other than "+
    "then now look only come its over think also back after use two how our work first well way even new want "+
    "because any these give day most us is are was were been being has had does did very much many more will "+
    "shall should must may might am lot thing things really").split(/\s+/);
  var o = {}; L.forEach(function(w){ if(w) o[w]=1; }); return o;
})();

/* ═══ أخطاءُ القواعدِ الشائعة ═══════════════════════════════════════
   سؤالُ الأب (٢٢ أكتوبر ٢٠٢٦): «كيف حسن في التعبير؟» — وكان المصحّحُ
   قائمةَ فحصٍ شكليّةً وحدَها: حرفٌ كبيرٌ أوّلَ الجملة، ونقطةٌ في آخرها،
   وتنوّعُ مفردات. فلا يفحص صحّةَ اللغةِ أصلًا، وتخرج الدرجةُ تقول
   «الشكل مضبوط» فيقرؤها الأبُ «اللغة سليمة».

   والقواعدُ هنا عاليةُ الثقةِ وحدَها: الإنذارُ الكاذبُ يعلّمه خطأً وهو
   أسوأُ من السكوت. ولذلك لا تُستعمل أنماطٌ عامّةٌ تصيب الصحيح:
   ‏«more + [a-z]+er» كانت تُنذر على ‎more water‎ و‎more paper‎، فصارت
   قائمةَ صيغِ تفضيلٍ معلومةً لا نمطًا.

   وقد جُرّبت على نصوصِ حسنٍ الخمسةِ وعلى خمسَ عشرةَ جملةً صحيحةً فيها
   المواضعُ الملتبسة (‎a university‎ · ‎an hour‎ · ‎a European‎ ·
   ‎I had had‎ · ‎much water‎ · ‎the news is‎) فلم تُنذر على واحدة،
   وأمسكت ستَّ عشرةَ جملةً خاطئةً كلَّها. */
var WCMP = "better|worse|easier|bigger|smaller|faster|slower|older|younger|cheaper|taller|shorter|stronger|weaker|happier|richer|safer|nicer|higher|lower|longer|harder|simpler";
var GRAMMAR = [
  [/\ba\s+(?!u[nbs]|eu|one\b)[aeiou][a-z]+/gi, "a قبل حرف علّة", "an"],
  [/\ba\s+(hour|honest|honou?r|heir)\b/gi, "a قبل h صامتة", "an"],
  [/\ban\s+(?!hour|honest|honou?r|heir)[b-df-hj-np-tv-z][a-z]{2,}/gi, "an قبل حرف ساكن", "a"],
  [/\b(he|she|it)\s+(have|do|go|like|make|take|say|want|need|think|know|live|work|play|study|help|watch|read|write)\b/gi,
   "هو/هي + فعل بلا s", "he has · she goes"],
  [/\b(did|didn't)\s+(not\s+)?(went|was|were|had|saw|took|made|came|got|said|ate|wrote|knew)\b/gi,
   "did + فعل ماضٍ", "did + المصدر: did go"],
  [/\bto\s+(went|saw|took|came|made|got|was|were|ate|wrote|knew|did)\b/gi,
   "to + فعل ماضٍ", "to + المصدر: to go"],
  [/\b(can|could|will|would|should|must|may|might)\s+to\s+[a-z]+/gi,
   "فعل مساعد + to", "can go لا can to go"],
  [new RegExp("\\bmore\\s+(" + WCMP + ")\\b", "gi"), "more + صيغة تفضيل", "better لا more better"],
  [new RegExp("\\bmost\\s+(" + WCMP + ")\\b", "gi"), "most + صيغة تفضيل", "best لا most best"],
  [/\b(people|children|men|women|police)\s+(is|was|has)\b/gi, "جمع + فعل مفرد", "people are"],
  [/\b(information|advice|knowledge|homework|furniture|equipment|luggage|progress)s\b/gi,
   "جمعُ اسمٍ لا يُجمَع", "information لا informations"],
  /* ⚠️ «a lot of» و«lots of» و«some» تصحبها أسماءٌ لا تُعَدّ: قياسُ
     ١٩ نوفمبر أنذر على «There is a lot of homework» وهي صحيحة. فلا
     يُنذَر عليها إلّا إذا تبعها جمعٌ صريح، واستُثنيَ ما آخرُه سينٌ
     وليس بجمعٍ (news · physics · mathematics). */
  [/\bthere\s+(is|was)\s+(many|several|two|three|four|five|six|seven|eight|nine|ten)\b/gi,
   "there is + جمع", "there are many"],
  [/\bthere\s+(is|was)\s+(a lot of|lots of|some|few|both)\s+(?!news\b|physics\b|mathematics\b|economics\b|politics\b)[a-z]+s\b/gi,
   "there is + جمع", "there are a lot of"],
  [/\bmuch\s+(people|students|friends|books|cars|problems|ideas|things|places|hours|days)\b/gi,
   "much + اسم معدود", "many"],
  [/\b(\w+)\s+\1\b/gi, "كلمة مكرّرة", "احذف إحداهما"],
  [/\balot\b/gi, "alot", "a lot"],
  [/\b(becuase|becasue|becouse|recieve|seperate|definately|enviroment|goverment|beatiful|intersting|succesful|diffrent|allways|thier|freind)\b/gi,
   "إملاء شائع الخطأ", "راجع تهجئتها"],

  /* ═══ زيادةُ ١٩ نوفمبر ٢٠٢٦ ══════════════════════════════════════
     جُرّب المدقّقُ بنصٍّ وضعتُ فيه اثني عشرَ خطأً من أشيعِ ما يقع فيه
     متعلّمُ العربيّةِ، فأمسك واحدًا — ومرّ النصُّ بسبعةَ عشرَ من عشرين
     «ناجحًا». والعائلاتُ الأربعُ التاليةُ تُغطّي الباقي.

     وكلُّها مقفلةُ الطرفَين (قائمةُ فاعلينَ وقائمةُ أفعال) لا أنماطٌ
     مفتوحة — لأنّ الإنذارَ الكاذبَ يُعلّمه خطأً وهو شرٌّ من السكوت.
     وقِيست على مئةٍ وسبعٍ وثلاثينَ جملةً صحيحةً فلم تُنذر على واحدة. */

  /* ١) فعلٌ مساعدٌ ثمّ فعلٌ مصرَّف: should ate · can goes */
  [/\b(can|could|will|would|should|must|may|might|shall)\s+(went|ate|took|came|saw|made|got|was|were|wrote|knew|did|had|goes|eats|takes|comes|sees|makes|gets|writes|knows|does|has|said|told|gave|found|left|felt|brought|kept|held)\b/gi,
   "فعل مساعد + فعل مصرَّف", "should eat لا should ate"],

  /* ٢) to ثمّ فعلٌ بصيغةِ الغائبِ المفرد: to helps */
  [/\bto\s+(goes|eats|takes|comes|sees|makes|gets|writes|knows|does|has|helps|gives|keeps|needs|works|plays|lives|studies|improves|allows|provides|becomes|seems|starts|stops)\b/gi,
   "to + فعل الغائب المفرد", "to go لا to goes"],

  /* ٣) فاعلٌ مفردٌ أو اسمٌ لا يُعَدُّ ثمّ فعلٌ عارٍ من s:
        exercise help · diet give · sleep allow — وهذا أشيعُ خطأٍ
        في نصوصِه، ولم يكن يُمسَك إلّا بعد he/she/it وحدَها. */
  [new RegExp("\\b(exercise|diet|sleep|food|water|health|education|technology|internet|pollution|traffic|homework|music|money|time|work|air|nature|society|government|family|team|school|city|country|person|student|teacher|book|phone|computer|reading|eating|walking|running|studying|sport|knowledge|advice|information|news|weather|experience|practice|effort|success|failure)\\s+(help|give|keep|make|take|improve|allow|need|provide|include|cause|show|mean|become|seem|look|work|live|play|come|go|start|stop|happen|teach|bring|change|reduce|increase|affect|protect|prevent|create|build|open|close|save|cost|last|grow|feel|think|want|like|love|enjoy)\\b", "gi"),
   "فاعل مفرد + فعل بلا s", "exercise helps لا exercise help"],

  /* ٤) اسمٌ لا يُعَدُّ ثمّ فعلُ جمع: exercise are important */
  /* ⚠️ الفاعلُ المعطوفُ جمعٌ وإن كان كلُّ طرفٍ منه مفردًا: قياسُ ١٩
     نوفمبر أنذر على «eating, exercise, and enough sleep are three
     habits» في نصِّ حسنٍ الأخير — وهي صحيحةٌ تمامًا. فلا يُنذَر إذا
     سبقت الاسمَ واوُ عطفٍ في كلمتَين. */
  [/(?<!\band\s)(?<!\band\s\w{1,14}\s)\b(exercise|diet|sleep|food|water|health|education|technology|internet|pollution|traffic|homework|music|money|time|work|air|nature|society|knowledge|advice|information|news|weather|progress|research|equipment|furniture)\s+(are|were)\b/gi,
   "اسمٌ لا يُجمَع + فعل جمع", "exercise is لا exercise are"],

  /* ٥) عددٌ ثمّ مفرد: three habit · many thing */
  [new RegExp("\\b(two|three|four|five|six|seven|eight|nine|ten|twenty|many|several|few|both)\\s+(habit|thing|book|student|year|day|hour|time|friend|problem|place|idea|way|person|country|city|word|minute|month|week|reason|example|step|point|part|kind|type|skill|subject|teacher|child|car|house|game|hobby|sport|meal|question|answer)\\b", "gi"),
   "عدد + اسم مفرد", "three habits لا three habit"],

  /* ٦) every/each ثمّ جمع */
  [/\b(every|each)\s+(students|children|days|years|people|books|times|hours|friends|things|ways|places)\b/gi,
   "every/each + جمع", "every student لا every students"]
];
/* صحيحةٌ وإن تكرّرت، فلا تُعدّ تكرارًا */
var WDUP_OK = /^(had|that|very|really|no|new|out)$/i;
/* كلماتُ الوظيفةِ تُستبعَد من قياسِ تشابهِ الجمل: جملتان مختلفتان
   تشتركان فيها حتمًا، فلو حُسِبت لرُفِع التشابهُ في كلِّ نصّ. */
var STOPSET = (function(){
  var o={}; ("the a an and or but so to of in on at for with from by is are was were be been being "+
   "it its this that these those we you they he she i my our your their his her as if then than "+
   "there here very also too can could will would should must may might do does did have has had "+
   "not no first second third finally however moreover addition conclusion example instead").split(/\s+/)
   .forEach(function(w){ if(w) o[w]=1; }); return o;
})();
function grammarIssues(text){
  var t = String(text||""), out = [], seen = {};
  for(var i=0; i<GRAMMAR.length && out.length<12; i++){
    var r = GRAMMAR[i], re = new RegExp(r[0].source, r[0].flags), m;
    while((m = re.exec(t)) && out.length < 12){
      if(r[1] === "كلمة مكرّرة" && WDUP_OK.test(m[1])) continue;
      /* ‏«an MP» صحيحةٌ: الاختصارُ يُنطَق أوّلُه حرفَ علّة */
      if(r[1] === "an قبل حرف ساكن" && /^an\s+[A-Z]{1,4}$/.test(m[0])) continue;
      var frag = m[0].trim();
      if(frag.length > 42) frag = frag.slice(0,42) + "…";
      var k = r[1] + "|" + frag.toLowerCase();
      if(seen[k]) continue; seen[k] = 1;
      out.push({ bad:frag, why:r[1], good:r[2] });
    }
  }
  return out;
}

/* ═══ تشابهُ الجملِ: مقياسٌ متّصلٌ لا حكمٌ بنعم أو لا ═══════════════
   كان الحسابُ محصورًا داخلَ gradeWriting يُخرِج عددَ الأزواجِ التي
   بلغت العتبةَ وحدَها. وسؤالُ الأب (١٩ نوفمبر ٢٠٢٦): «كم معدّلُ
   التكرارِ في الجمل؟» — والعتبةُ لا تجيبه: تقول «ما بلغ» ولا تقول
   «كم». فصارت النسبُ كلُّها تُردُّ، والعتبةُ تُطبَّق عليها بعدُ.

   والمقياسُ جاكار على مجموعاتِ الكلماتِ بعد طرحِ كلماتِ الوظيفة.
   وتُستثنى الجملةُ التي أقلُّ من ثلاثِ كلماتٍ مُعجَميّة: جملتان
   قصيرتان تتشابهان بالمصادفةِ لا بالتكرار. */
var PAD_SIM = 0.6;
function sentSims(sents){
  if(!sents || sents.length < 3) return [];
  var sets = sents.map(function(s){
    var o = {}; String(s).toLowerCase().split(/\s+/).forEach(function(w){
      var k = w.replace(/[^a-z]/g,""); if(k && !STOPSET[k]) o[k]=1; });
    return o;
  });
  var out = [];
  for(var i=0;i<sets.length;i++) for(var j=i+1;j<sets.length;j++){
    var A=Object.keys(sets[i]), B=Object.keys(sets[j]);
    if(A.length<3 || B.length<3) continue;
    var inter=0; A.forEach(function(k){ if(sets[j][k]) inter++; });
    var uni = A.length + B.length - inter;
    if(uni) out.push(inter/uni);
  }
  return out;
}

/* ═══ إعادةُ النصِّ القديمِ في الموضوعِ نفسِه ════════════════════════
   قال حسنٌ لأبيه إنّه يأخذ الدرجةَ كاملةً لأنّه «حفِظها من كثرةِ
   التكرار». وقِيس تداخلُ خماسيّاتِ الكلماتِ بين نصّيه في «The benefits
   of reading» بينهما ستّةَ عشرَ يومًا: ٩٨٪. فذاك استرجاعٌ لا كتابة.

   والخماسيّةُ هي الوحدةُ: الثلاثيّةُ تتكرّر في كلِّ نصٍّ عن الموضوعِ
   الواحدِ بطبيعتِه («the benefits of»)، والخماسيّةُ لا تتطابق إلّا
   بإعادةِ الصياغةِ نفسِها.

   والعتبةُ ستّون بالمئة: نصوصُه التي أخذت العشرينَ كاملةً أعادت بين
   سبعةٍ وواحدٍ وثلاثين بالمئةٍ من سابقِها — وذاك بناءٌ على ما كتبه
   وهو مشروعٌ بل مطلوب. فلا يُمنَع إلّا من أعاد أكثرَ من نصفِ نصِّه. */
function _h32(str){
  var h = 2166136261;
  for(var i=0;i<str.length;i++){ h ^= str.charCodeAt(i); h = (h * 16777619) >>> 0; }
  return h >>> 0;
}
/* ═══ حكمُ اللصق: دالّةٌ خالصةٌ يستعملها القسمُ ويقيسها الفحص ═══════
   قرارُ الأب (٢٠ نوفمبر ٢٠٢٦): لا يُمنَع اللصق — المنعُ يُتحايَل عليه
   بالنقلِ باليدِ من نافذةٍ أخرى ولا يُعلّم شيئًا — بل تُقال القاعدةُ قبل
   الكتابةِ ومن لصق أكثرَ النصِّ سُجّلت جلستُه غيرَ محتسبة.

   وحدُّ «أكثرِ النصِّ» ستّون في المئة: لصقُ اقتباسٍ أو اسمٍ داخلَ نصٍّ
   كتبه بيده لا يُسقِط جلسته، ولصقُ النصِّ كلِّه يُسقطها. وجلسةُ حسنٍ
   التي كُشفت كانت مئةً بالمئة.

   ⚠️ وبابٌ خلفيٌّ كان سيبقى: الحافظةُ تُقرأ على معظمِ الأجهزةِ وتُمنَع
   على بعضِها (getData في سفاري يرفع استثناءً) فيُعَدُّ حدثُ اللصقِ
   وأحرفُه صفرٌ — فلو كان الحكمُ على الأحرفِ وحدَها نجا اللصقُ هناك.
   فحينها يُحكَم بالسرعة: عشرون حرفًا في الثانيةِ مطّردةً ليست كتابةَ
   إنسان (أسرعُ كاتبٍ مُقاسٍ في العالمِ دون ذلك بكثير). وقِيس في
   المتصفّحِ بحدثِ لصقٍ حافظتُه ترفع استثناءً فسقطت الجلسةُ كما يجب.

   ولا يُحكَم إلّا بوجودِ حدثِ لصق: الكتابةُ السريعةُ بلا لصقٍ لا تُمَسّ
   مهما كانت سريعةً، فلا تُظلَم يدٌ مجتهدة. */
/* ═══ تنبيهُ الترقيمِ قبل التقييم ═══════════════════════════════════
   قِيست نصوصُ حسنٍ الخمسةُ والثلاثون (٢٣ نوفمبر ٢٠٢٦) فكان نصُّ ذلك
   اليومِ وحدَه بلا علامةِ وقفٍ قطّ: ثمانٍ وستّون كلمةً بلا نقطة، فعدَّها
   المصحّحُ جملةً واحدةً والمطلوبُ ثمان — فأسقطت الواحدةُ ستَّ علاماتٍ
   من المقاييسِ الأربعة (لا افتتاحيّةَ ولا خاتمةَ ولا حرفًا كبيرًا ولا
   تنوّعَ أطوالٍ ولا تنوّعَ فواتح). وإنجليزيّتُه أحسنُ من ترقيمِه: غطّى
   نقاطَ الموضوعِ كلَّها وتنوّعُ مفرداتِه ستّةٌ وسبعون بالمئة.

   فطلب الأبُ تنبيهًا قبل الضغطِ على «قيّم»: «تنبيهٌ لا عقوبة، ولا يمسّ
   درجتَه». فهو لا يمنع التقييمَ ولا يُنقِص علامةً ولا يُحفَظ في الصفّ —
   سطرٌ يُقال له وهو يكتب، ويُعاد عند النتيجةِ فلا يمرُّ السببُ عليه.

   والحدُّ عشرون كلمةً: الجملةُ أو الجملتان قد يكتبهما ثمّ يُنقِّطهما،
   فلا يُنبَّه على ما لم يُكمِله بعد. */
function needsDots(text){
  var t = String(text || "").replace(/\s+/g, " ").trim();
  if(!t) return false;
  var w = t.split(/\s+/).filter(function(x){ return /[A-Za-z]/.test(x); }).length;
  if(w < 20) return false;
  return !/[.!?]/.test(t);
}

var PASTE_MAX = 0.6;
function pasteVerdict(len, pasteN, pasteCh, activeMs){
  len = +len || 0; pasteN = +pasteN || 0; pasteCh = +pasteCh || 0;
  var share = 0;
  if(len && pasteN){
    if(pasteCh) share = Math.min(1, pasteCh / len);
    else {
      var sec = Math.max(1, Math.round((+activeMs || 0) / 1000));
      share = (len / sec > 20) ? 1 : 0;
    }
  }
  return { share: share, trusted: share < PASTE_MAX };
}

function cycleOrder(n, seed){
  var a = [], i;
  for(i=0;i<n;i++) a.push(i);
  /* فيشر–ييتس بمولّدٍ خطّيٍّ من البذرة: نفسُ البذرةِ نفسُ الترتيب */
  var r = (seed || 1) >>> 0;
  for(i=n-1;i>0;i--){
    r = (r * 1664525 + 1013904223) >>> 0;
    var j = r % (i + 1);
    var t = a[i]; a[i] = a[j]; a[j] = t;
}
  return a;
}

var REUSE_MAX = 0.6, REUSE_N = 5;
function wNgrams(t, n){
  var w = String(t||"").toLowerCase().replace(/[^a-z ]/g," ").split(/\s+/).filter(Boolean);
  var o = {}, c = 0;
  for(var i=0;i+n<=w.length;i++){ var k=w.slice(i,i+n).join(" "); if(!o[k]){ o[k]=1; c++; } }
  return { set:o, n:c };
}
/* نسبةُ ما في «الجديد» موجودٌ في «القديم» — لا العكس: من أضاف فقرةً
   إلى نصِّه القديمِ تنزل نسبتُه، وهو المطلوب. */
function reuseRatio(fresh, old){
  if(!fresh || !old) return 0;
  var A = wNgrams(fresh, REUSE_N), B = wNgrams(old, REUSE_N);
  if(!A.n || !B.n) return 0;
  var hit = 0;
  Object.keys(A.set).forEach(function(k){ if(B.set[k]) hit++; });
  return hit / A.n;
}

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
  /* النصّ يتبع الحالة: كان يقول «غطّيت: كذا» ومعه ⚠️ في الحالتين، فيقرأ
     الطفل «غطّيت» ويرى علامة تحذير فلا يدري أغطّى أم لم يُغطِّ — وهو ممّا
     شكوا منه (٥ سبتمبر ٢٠٢٦: «ما فهمنا الطريقة»). */
  var contentChecks = covered.map(function(c){
    return {ok:c.ok,
      label:(c.ok ? "غطّيت: " : "ما غطّيت: ")+c.q+trI(c.ok?"Covered":"Not covered yet"),
      hint:"أضف جملةً تجيب عن: "+c.q};
  });
  contentChecks.push({ok: words.length>=cef.minWords,
    label:"الطول المطلوب لمستوى "+cef.name+": "+words.length+" من "+cef.minWords+" كلمة"+trI("Length: "+words.length+" of "+cef.minWords+" words"),
    hint:"اكتب "+Math.max(0,cef.minWords-words.length)+" كلمة إضافية."});
  contentChecks.push({ok: any && !/[؀-ۿ]/.test(t), label:"الفقرة كلّها بالإنجليزية"+trI("All in English"),
    hint:"فيها حروف عربية — اكتبها كاملة بالإنجليزية."});

  /* ---------- 2) Organisation: الترتيب والربط ---------- */
  var conns = cef.conn.filter(function(c){ return hasWord(t,c); });
  var seq   = SEQ_WORDS.filter(function(c){ return hasWord(t,c); });
  var orgChecks=[
    {ok: sents.length>=cef.minSent, label:"عدد الجمل: "+sents.length+" من "+cef.minSent+trI("Sentences: "+sents.length+" of "+cef.minSent),
     hint:"قسّم أفكارك: كلّ جملةٍ فكرةٌ واحدة."},
    {ok: conns.length>=cef.minConn,
     label:"أدوات الربط: "+conns.length+" من "+cef.minConn+(conns.length?" ("+conns.join(", ")+")":"")+trI("Linking words"),
     hint:"اربط جُملك بـ "+cef.conn.slice(0,5).join(" / ")+"."},
    {ok: any && sents.length>=2 && sents[0].split(/\s+/).length>=4,
     label:"جملة أولى واضحة تُقدّم الموضوع"+trI("Clear opening sentence"), hint:"ابدأ بجملةٍ تُعرّف القارئ بموضوعك."}
  ];
  /* ═══ الحشوُ ليس ترتيبًا ════════════════════════════════════════
     جُرّب المصحّحُ (١٩ نوفمبر ٢٠٢٦) بنصٍّ جملتُه واحدةٌ كرّرتُها تسعَ
     مرّاتٍ وبين كلِّ مرّتَين أداةُ ربط، فأعطاه تسعةَ عشرَ من عشرين
     وأجازه. وهذا يُعلّم الطفلَ أنّ الطولَ والروابطَ تكفي، وهو عكسُ
     المقصود: أدواتُ الربطِ تُوصَل بها أفكارٌ مختلفة، فإذا وُصِل بها
     الشيءُ بنفسِه فالنصُّ جملةٌ واحدةٌ طويلة.

     والقياسُ بتشابهِ مجموعاتِ الكلماتِ (جاكار) بين كلِّ جملتَين:
     ستّون بالمئةِ فأكثرُ تشابهٌ يُعَدُّ تكرارًا. والعتبةُ زوجان، فلا
     يسقط نصٌّ أعاد صياغةَ فكرةٍ مرّةً واحدةً للتأكيد. */
  var padSims = sentSims(sents);
  var padPairs = padSims.filter(function(x){ return x >= PAD_SIM; }).length;
  orgChecks.push({ok: padPairs < 2,
    label: padPairs>=2 ? ("جملٌ مكرّرةٌ بمعناها: "+padPairs+" زوجًا") : "كلُّ جملةٍ فكرةٌ جديدة",
    hint:"أدواتُ الربطِ تَصِل أفكارًا مختلفة — لا تُعِد الجملةَ نفسَها بأداةٍ جديدة."});

  if(cef.needSeq){
    orgChecks.push({ok: seq.length>=1, label:"ترتيب زمنيّ/منطقيّ ظاهر"+(seq.length?" ("+seq.join(", ")+")":"")+trI("Clear sequencing"),
      hint:"استعمل First / Then / Finally أو In conclusion لترتيب أفكارك."});
    orgChecks.push({ok: sents.length>=3 && /(?:conclusion|to sum up|overall|finally|in short|think|believe|opinion)/i.test(sents[sents.length-1]||""),
      label:"خاتمة أو رأي في آخر جملة"+trI("Closing sentence or opinion"),
      hint:"أنهِ الفقرة برأيك أو خلاصتك (In conclusion… / I think…)."});
  }

  /* ---------- 3) Language: الصحّة والثروة ---------- */
  var gIssues = grammarIssues(text);
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
    {ok: sents.length>0 && badCap.length===0, label:"كلّ جملة تبدأ بحرفٍ كبير"+trI("Every sentence starts with a capital letter"),
     hint: badCap.length? ("ابدأ بحرفٍ كبير: «"+badCap[0]+"…»") : ""},
    {ok: !!t && /[.!?]$/.test(t), label:"النصّ ينتهي بعلامة ترقيم"+trI("Ends with a full stop"), hint:"أنهِ آخر جملة بنقطة."},
    {ok: any && !lowerI, label:"الضمير I مكتوب كبيرًا"+trI("Capital I"), hint:"اكتب I كبيرة دائمًا، لا i."},
    {ok: any && !overused, label:"لا تكرار مفرط لكلمة واحدة"+trI("No overused word"),
     hint: overused? ("كرّرت «"+top+"» "+topN+" مرّات — نوّع كلماتك.") : ""},
    {ok: words.length>=15 && ttr>=0.55, label:"تنوّع المفردات: "+Math.round(ttr*100)+"%"+trI("Vocabulary range"),
     hint:"استعمل مرادفاتٍ وكلماتٍ أوسع بدل تكرار نفس الكلمة."},
    {ok: varied, label:"تنوّع أطوال الجمل"+trI("Varied sentence length"),
     hint:"نوّع: جملة قصيرة ثمّ أطول — لا تجعلها كلّها بالطول نفسه."},
    {ok: any && gIssues.length===0,
     label:(gIssues.length ? ("أخطاء قواعد: "+gIssues.length) : "بلا أخطاء قواعد شائعة")+trI("Common grammar errors"),
     hint: gIssues.length ? ('<br>'+gIssues.slice(0,6).map(function(g){
       return '❌ <span dir="ltr" style="unicode-bidi:isolate">'+g.bad+'</span> — '+g.why+
              ' ⇐ <b dir="ltr" style="unicode-bidi:isolate">'+g.good+'</b>';
     }).join('<br>')) : ""}
  ];

  /* ---------- 4) Communicative Achievement: مناسبة الأسلوب ----------
     ═══ المعيارُ كان ميّتًا ═══════════════════════════════════════════
     سؤالُ الأب (١٩ نوفمبر ٢٠٢٦): «هل منه جدوى؟». وكان هذا المعيارُ
     يُعطي حسنًا ٥ من ٥ في تسليماتِه الثلاثِ والثلاثين كلِّها — من أوّلِ
     محاولةٍ بتسعَ عشرةَ كلمةً مبتورةً إلى آخرِ نصٍّ من مئةٍ وإحدى
     وعشرين. فربعُ الدرجةِ مُهدًى سلفًا، والمعيارُ لا يُفرّق بين نصٍّ
     ونصّ، فالامتحانُ من خمسَ عشرةَ لا من عشرين وهو يقول عشرين.

     والعلّةُ أنّ فحوصَه الأربعةَ يجتازها كلُّ من كتب كلامًا سويًّا:
     لا دردشةَ · لا حروفَ كبيرةً كلَّها · متوسّطُ الجملةِ خمسُ كلمات ·
     فيه نقطة. والأخيران مكرّران أصلًا في «اللغة» و«الترتيب».

     فبقي الصالحان، وحلَّ محلَّ المكرَّرَين ما يقيس الأسلوبَ حقًّا:
     ألّا تبدأ الجملُ كلُّها بالكلمةِ نفسِها، وأن يكون في النصِّ تركيبٌ
     مركّبٌ لا جملٌ بسيطةٌ مرصوفة، وأن تتجاوز مفرداتُه المئةَ الشائعة. */
  var chat = CHATSPEAK.filter(function(c){ return hasWord(t,c); });
  var shouty = (t.match(/\b[A-Z]{4,}\b/g)||[]).length>0;
  /* فواتحُ الجمل: لا تزيد فاتحةٌ واحدةٌ على ثلث الجمل */
  var opens = {}, topOpen = "", topOpenN = 0;
  sents.forEach(function(s){
    var w0 = (s.trim().split(/\s+/)[0]||"").toLowerCase().replace(/[^a-z]/g,"");
    if(!w0) return; opens[w0] = (opens[w0]||0)+1;
    if(opens[w0] > topOpenN){ topOpenN = opens[w0]; topOpen = w0; }
  });
  var sameOpen = sents.length >= 4 && topOpenN > Math.ceil(sents.length/3);
  /* تركيبٌ مركّب: أداةُ وصلٍ تابعةٌ داخلَ الجملةِ لا بينَ الجمل */
  var subs2 = SUBORD.filter(function(c){ return hasWord(t,c); });
  /* مفرداتٌ خارجَ المئةِ الشائعة */
  var rich = {};
  words.forEach(function(w){ var k=w.toLowerCase().replace(/[^a-z]/g,"");
    if(k && k.length>3 && !COMMON100[k]) rich[k]=1; });
  var richN = Object.keys(rich).length;
  var richNeed = Math.max(4, Math.round(words.length*0.10));
  var comChecks=[
    {ok: any && chat.length===0, label:"أسلوب كتابيّ لا لغة دردشة"+trI("Written style, not chat language"),
     hint: chat.length? ("تجنّب: "+chat.join(", ")+" — اكتبها كاملة.") : ""},
    {ok: any && !shouty, label:"بلا كلماتٍ بحروفٍ كبيرة كلّها"+trI("No ALL-CAPS words"), hint:"الحروف الكبيرة كلّها تُقرأ صياحًا."},
    {ok: any && sents.length>=2 && !sameOpen,
     label:"فواتحُ الجملِ متنوّعة"+trI("Varied sentence openings"),
     hint: sameOpen ? ("بدأتَ "+topOpenN+" جملٍ بـ«"+topOpen+"» — غيّر الفاتحة.") : "لا تبدأ جُملك كلَّها بالكلمة نفسها."},
    {ok: any && subs2.length>=1,
     label:"تركيبٌ مركّبٌ لا جملٌ مرصوفة"+(subs2.length?" ("+subs2.slice(0,3).join(", ")+")":"")+trI("Complex sentence structure"),
     hint:"اربط داخل الجملة: because / although / which / when / if."},
    {ok: any && richN>=richNeed,
     label:"مفرداتٌ خارجَ الشائع: "+richN+" من "+richNeed+trI("Vocabulary beyond the commonest words"),
     hint:"استعمل كلماتٍ أدقَّ من good / big / thing / very."}
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
  /* ═══ سقفُ «اللغة» ما دامت فيه أخطاءُ قواعد ═══════════════════════
     الفحصُ الواحدُ لا يكفي: درجةُ اللغةِ مبنيّةٌ على نسبةِ الفحوصِ
     المتحقّقة، فنصٌّ فيه خمسةُ أخطاءٍ يخسر فحصًا من سبعةٍ فتبقى درجتُه
     أربعةً من خمسة. وهذا هو ما شكا منه الأب: الدرجةُ تقول «سليمة» ولا
     تقرأ القواعدَ أصلًا. فما فيه خطأٌ لا يبلغ الخمسةَ، وما فيه ثلاثةٌ
     فأكثرُ لا يبلغ الثلاثةَ — وهي عتبةُ النجاح. */
  (function(){
    var lang = subs.filter(function(s){ return s.en === "Language"; })[0];
    if(!lang || !gIssues.length) return;
    var cap = gIssues.length >= 3 ? 2 : 3;
    if(lang.band > cap) lang.band = cap;
    lang.capped = gIssues.length;
  })();
  /* ═══ وسقفُ «الترتيب» ما دام النصُّ حشوًا ══════════════════════════
     فحصٌ واحدٌ ساقطٌ من ستّةٍ يهبط بالدرجةِ نقطةً واحدةً لا غير، فبقي
     نصُّ التكرارِ (جملةٌ واحدةٌ تسعَ مرّاتٍ بروابط) ناجحًا بثمانيةَ عشرَ
     من عشرين. والنصُّ الذي جملتُه واحدةٌ مكرّرةٌ ليس «مرتَّبًا قليلًا»،
     هو غيرُ مرتَّبٍ أصلًا: لا أفكارَ فيه تُرتَّب. فيُسقَف دون عتبةِ
     النجاح كما سُقِفت اللغةُ بأخطاءِ القواعد. */
  (function(){
    var org = subs.filter(function(s){ return s.en === "Organisation"; })[0];
    if(!org || padPairs < 2) return;
    if(org.band > 2) org.band = 2;
    org.padded = padPairs;
  })();
  var totalBand = subs.reduce(function(a,s){ return a+s.band; },0);   /* من ٢٠ كنظام كامبردج */
  var pass = subs.every(function(s){ return s.band>=3; });

  return { subs:subs, total:totalBand, max:20, pass:pass, cefr:cef.name,
           words:words.length, sents:sents.length, conns:conns,
           /* عددُ أزواجِ الجملِ المتشابهةِ ستّين بالمئةِ فأكثر — كان
              محجوبًا داخلَ الحسابِ فلا يُقاس تكرارُ الطفلِ إلّا عند
              بلوغِه العتبة. والرقمُ نفسُه يُسأل عنه (١٩ نوفمبر). */
           pad:padPairs,
           padMax:(padSims.length? Math.max.apply(null,padSims) : 0),
           padAvg:(padSims.length? padSims.reduce(function(a,b){return a+b;},0)/padSims.length : 0),
           padN:padSims.length,
           /* توافق مع النداءات القديمة */
           score:totalBand, checks:subs.reduce(function(a,s){ return a.concat(s.checks); },[]) };
}

/* ===================== الواجهة ===================== */

var CSS = ''+
/* شرح الطريقة — بلاغ الأولاد (٥ سبتمبر ٢٠٢٦): «ما فهمنا الطريقة» */
'.whow{background:var(--bg);border:1.5px solid var(--accent);border-radius:14px;padding:12px 14px;margin-bottom:13px}'+
'.whow>summary{cursor:pointer;font-weight:800;font-size:1.02rem;list-style:none}'+
'.whow>summary::-webkit-details-marker{display:none}'+
'.whow>summary::before{content:"▸ ";color:var(--accent)}'+
'.whow[open]>summary::before{content:"▾ "}'+
'.whow h4{margin:13px 0 6px;font-size:.98rem}'+
'.wstep{counter-reset:ws;margin:0;padding:0;list-style:none}'+
'.wstep li{counter-increment:ws;position:relative;padding-inline-start:30px;margin-bottom:7px;line-height:1.75}'+
'.wstep li::before{content:counter(ws);position:absolute;inset-inline-start:0;top:1px;width:21px;height:21px;'+
  'border-radius:50%;background:var(--accent);color:#fff;font-weight:800;font-size:.8rem;display:flex;align-items:center;justify-content:center}'+
'.wcrit{border-collapse:collapse;width:100%;font-size:.9rem;margin-top:4px}'+
'.wcrit td{border:1px solid var(--line);padding:6px 8px;vertical-align:top}'+
'.wcrit td:first-child{font-weight:700;white-space:nowrap}'+
'.wmodel{background:var(--card);border:1px solid var(--line);border-radius:11px;padding:11px 13px;margin-top:6px;'+
  'direction:ltr;text-align:left;line-height:2.05;font-size:.97rem}'+
'.wmodel .m1{background:rgba(37,99,235,.16);border-radius:4px;padding:1px 3px}'+   /* جملة الموضوع */
'.wmodel .m2{background:rgba(22,163,74,.16);border-radius:4px;padding:1px 3px}'+   /* أدوات الربط */
'.wmodel .m3{background:rgba(217,119,6,.18);border-radius:4px;padding:1px 3px}'+   /* الخاتمة/الرأي */
'.wkey{font-size:.85rem;margin-top:6px;display:flex;gap:12px;flex-wrap:wrap}'+
'.wkey span{display:inline-flex;align-items:center;gap:5px}'+
'.wkey i{width:13px;height:13px;border-radius:3px;display:inline-block}'+
'.wphr{display:flex;flex-wrap:wrap;gap:6px;margin-top:5px}'+
'.wphr code{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:3px 8px;'+
  'font-size:.88rem;direction:ltr;unicode-bidi:isolate}'+
'.wsec{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:15px 17px;margin-bottom:13px;box-shadow:var(--shadow)}'+
'.wen{direction:ltr;unicode-bidi:isolate;display:inline-block;text-align:left}'+
/* ترجمةُ التعليمة — تحت العربيّة، أصغرَ منها وأخفَّ لونًا: تُقرأ ولا تُزاحم */
'.wtr{direction:ltr;text-align:left;unicode-bidi:isolate;font-size:.86rem;font-weight:600;color:var(--muted);margin-top:3px;line-height:1.55}'+
'.wreq{display:inline-block;background:var(--bad-bg);color:var(--bad);border-radius:99px;padding:2px 10px;font-size:.8rem;font-weight:800}'+
'.wreq.done{background:var(--good-bg);color:var(--good)}'+
'.wread{border:1px solid var(--line);border-radius:12px;padding:11px 13px;margin-top:9px}'+
'.wread .s{direction:ltr;text-align:left;font-weight:700;font-size:1.02rem;line-height:1.8}'+
'.wread .b{display:flex;gap:7px;flex-wrap:wrap;margin-top:8px;align-items:center}'+
'.wread .fb{font-size:.9rem;margin-top:7px;display:block}'+
'.wread.ok{border-color:var(--good);background:var(--good-bg)}'+
'.wsay{border:1.5px solid var(--accent);background:transparent;color:var(--accent);padding:8px 13px;border-radius:11px;'+
  'font-weight:800;cursor:pointer;font-family:inherit;font-size:.88rem}'+
'.wsay.mic{background:#0a7cff;border-color:#0a7cff;color:#fff}'+
'.wsay.skip{border-color:var(--line);color:var(--muted)}'+
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

/* ═══════════ شرح الطريقة ═══════════
   بلاغ الأب عن الأولاد (٥ سبتمبر ٢٠٢٦): «يبون شرحًا للتعبير، يقولون
   ما فهمنا الطريقة».

   وحين فتحنا القسم بأعينهم تبيّن أنّهم محقّون: يجد الطفل موضوعًا وثلاث
   نقاطٍ وصندوقًا فارغًا يُطالبه بمئة كلمة، ولا يجد كيف يبدأ ولا ما
   المقاييس الأربعة التي سيُحاسَب عليها — لا يعرفها إلّا بعد أن تُعطى
   له درجاتها. فهي «صفحةٌ بيضاء» بلا طريق.

   فهذا شرحٌ يُفتح قبل الكتابة، فيه أربعة أشياء:
   ١) الطريقة خطوةً خطوة — ماذا يفعل بالضبط قبل أن يكتب حرفًا.
   ٢) المقاييس الأربعة بلغةٍ يفهمها، وما يرفع كلًّا منها.
   ٣) نموذجٌ محلولٌ مُلوَّن يرى فيه جملة الموضوع وأدوات الربط والخاتمة.
   ٤) عباراتٌ جاهزة يبني عليها.

   والنموذج على موضوعٍ **غير موضوع اليوم** عمدًا: لو كان عليه لنسخه
   الطفل ولم يتعلّم. فالمطلوب أن يرى الطريقة لا أن يجد الجواب. */

var HOWTO = {
  1: {
    steps: [
      "اقرأ الموضوع والنقاط الثلاث تحته، واسأل نفسك: ماذا أعرف عن هذا؟",
      "اكتب على ورقةٍ ثلاث كلماتٍ عربية — فكرةً لكلّ نقطة. لا تكتب جملًا بعد.",
      "حوّل كلّ فكرةٍ إلى جملةٍ إنجليزية قصيرة تبدأ بحرفٍ كبير وتنتهي بنقطة.",
      "اربط الجمل بـ and / but / because، وزد جملةً أو جملتين حتى تبلغ الطول المطلوب.",
      "اقرأ ما كتبت بصوتٍ خافت: هل كلّ جملةٍ عن الموضوع نفسه؟ ثمّ اضغط «قيّم كتابتي»."
    ],
    topic: "My neighbour",
    model: '<span class="m1">My neighbour is called Abu Khalid.</span> He is an old man <span class="m2">and</span> ' +
           'he lives next to our house. He waters his small garden every morning <span class="m2">because</span> ' +
           'he loves plants. Sometimes he gives us dates <span class="m2">and</span> he asks about my school. ' +
           '<span class="m3">I like him because he is kind to everyone.</span>',
    why: [
      "الجملة الأولى تقول من هو مباشرةً — فلا يحتار القارئ.",
      "كلّ الجمل عن الجار نفسه، ولا جملةَ عن شيءٍ آخر (هذه «الوحدة»).",
      "أدوات الربط ثلاث: and وbecause — فلا تبدو الجمل مقطوعة.",
      "الجملة الأخيرة رأيه هو، فأغلقت الفقرة ولم تنتهِ فجأة."
    ],
    phrases: ["My … is …", "He / She is …", "I like … because …", "and", "but", "because", "Every day I …", "I think …"]
  },
  2: {
    steps: [
      "اقرأ الموضوع والنقاط الثلاث، وحدّد: هل يطلب منك رأيًا، أم وصفًا، أم مقارنة؟",
      "خطّط قبل أن تكتب: جملةُ موضوعٍ واحدة، ثمّ فكرةٌ لكلّ نقطة، ثمّ خاتمة. أربعة صفوفٍ على ورقة.",
      "ابدأ بجملة الموضوع: جملةٌ واحدة تقول عمّ ستتكلّم، بلا تفصيل.",
      "افرد لكلّ نقطةٍ جملتين: واحدةً تقولها وأخرى تُدلّل عليها بمثالٍ أو سبب.",
      "رتّب بـ First / Also / However / Finally، واختم برأيك: In conclusion, I think …",
      "راجع: طولٌ كافٍ؟ كلّ جملةٍ تخدم الموضوع؟ حروفٌ كبيرة ونقاط؟ ثمّ «قيّم كتابتي»."
    ],
    topic: "Living in a big city",
    /* النموذج نفسه يجب أن يجتاز المقياس الذي نُحاسب به الطفل: قِسناه
       بالمُقيّم فخرج ٧٦ كلمةً وخمس جملٍ دون هدف B1، فأُطيل إلى ١٠٦ كلمةٍ
       وسبع جمل. فنموذجٌ يرسب في مقياسه لا يُعلّم الطريقة بل يُشكّك فيها. */
    model: '<span class="m1">Living in a big city has both good and bad sides.</span> ' +
           '<span class="m2">First,</span> cities offer better schools and hospitals, so families can find what they need quickly. ' +
           '<span class="m2">In addition,</span> there are many jobs, <span class="m2">and</span> this helps young people start their lives after university. ' +
           'Another advantage is that a big city has libraries, parks and sports clubs for everyone. ' +
           '<span class="m2">However,</span> the traffic is heavy <span class="m2">and</span> the air is often polluted, ' +
           '<span class="m2">because</span> there are too many cars. ' +
           'Life is also more expensive, <span class="m2">so</span> some families cannot afford a good home. ' +
           '<span class="m3">In conclusion, I think a big city is a good place to live if we solve the traffic problem.</span>',
    why: [
      "الجملة الأولى جملةُ موضوع: تُعلن أنّ للمدينة وجهين، فيعرف القارئ الخطّة من أوّل سطر.",
      "الترتيب ظاهر: First ثمّ In addition ثمّ However ثمّ In conclusion — وهذا وحده يرفع «الترتيب والربط».",
      "كلّ فكرةٍ معها سبب أو مثال (so families can find… / because there are too many cars) — وهذا يرفع «المحتوى».",
      "الخاتمة رأيٌ فيه شرط، لا تكرارًا للجملة الأولى."
    ],
    phrases: ["First,", "Second,", "In addition,", "For example,", "However,", "On the other hand,",
              "because", "so", "Finally,", "In conclusion, I think …"]
  }
  ,3: {
    steps: [
      "اقرأ الموضوع وحدّد موقفَك قبل أن تكتب حرفًا: أنا معَه أو ضدَّه، ولماذا؟",
      "اكتب على ورقةٍ أطروحةً واحدةً (Thesis) تُعلِن موقفَك وتُلمِّح إلى حجّتين.",
      "لكلِّ حجّةٍ فقرةٌ: جملةٌ تُعلِنها، ثمّ دليلٌ أو مثالٌ يسندها، ثمّ جملةٌ تربطها بالأطروحة.",
      "أضِف الرأيَ المضادَّ ثمّ ردَّه (It is true that… / However…) — فهذا وحدَه ما يفرّق المقالَ الناضجَ عن الفقرةِ المدرسيّة.",
      "اختم بخلاصةٍ لا تكرارًا: In conclusion… تُحكِم موقفَك بكلماتٍ جديدة.",
      "راجِع التسجيلَ الرسميّ: لا مختصراتٍ ولا لغةَ حديثٍ، واحذف الحشوَ، واحتَط بـ suggests / may / appears to."
    ],
    topic: "Should schools teach financial skills?",
    /* النموذجُ نفسُه يجتاز المقياسَ الذي يُحاسَب به الطالب — قِسناه بالمُقيِّم
       على هدف B2 فخرج ١٥١ كلمةً وثماني جملٍ وثمانيَ أدواتِ ربطٍ ونطاقًا كاملًا
       في الترتيبِ واللغةِ والأسلوب. فنموذجٌ يرسب في مقياسه يُشكّك في المقياسِ
       لا يُعلّم الطريقة — وهذه القاعدةُ نفسُها طُبِّقت على نموذجِ المستوى الثاني. */
    model: '<span class="m1">Schools should teach basic financial skills to every student before graduation.</span> ' +
           '<span class="m2">First,</span> young people today make real financial decisions far earlier than their parents did. ' +
           'A student who opens a bank account at eighteen without understanding debt can lose years of income to a single mistake. ' +
           '<span class="m2">Furthermore,</span> financial ability is not a talent but a skill, <span class="m2">and</span> building skills is exactly why schools exist. ' +
           '<span class="m2">For example,</span> one term on budgeting, saving and simple contracts would reach every student in the country at almost no cost. ' +
           'It is true that the timetable is already crowded, <span class="m2">and</span> teachers cannot add a new subject every year. ' +
           '<span class="m2">However,</span> this objection confuses adding hours with using them well, <span class="m2">because</span> a mathematics term spent on real household budgets would teach both subjects at once. ' +
           '<span class="m3">In conclusion, a school that prepares its students for examinations but not for their own money has finished only half of its work.</span>',
    why: [
      "الجملةُ الأولى أطروحةٌ لا وصفٌ: تُعلِن الموقفَ في سطرٍ واحدٍ فيعرف القارئُ الخطّةَ قبل أن يقرأ.",
      "لكلِّ حجّةٍ دليلٌ ملموس: «يفقد سنواتِ دخلٍ بخطأٍ واحد» و«فصلٌ دراسيٌّ بلا كلفةٍ تقريبًا» — وهذا يرفع «المحتوى» لا اللغةَ وحدها.",
      "الرأيُ المضادُّ مذكورٌ ثمّ مردودٌ (It is true that… However…) — وهو ما يميّز المقالَ عن الخطبة، وعليه مدارُ «مناسبة الأسلوب».",
      "أدواتُ الربطِ أكاديميّةٌ متنوّعة: First / Furthermore / For example / However / because / In conclusion.",
      "الخاتمةُ حكمٌ جديدٌ لا إعادةُ الأطروحةِ بلفظٍ آخر — «أنهى نصفَ عملِه» صورةٌ تُحكِم المقالَ ولم تُقَل قبلَها."
    ],
    phrases: ["This essay argues that …", "First,", "Secondly,", "Furthermore,", "In addition,",
              "For example,", "For instance,", "However,", "Nevertheless,", "In contrast,",
              "Therefore,", "Consequently,", "As a result,", "It is true that … However, …",
              "Admittedly, …", "The evidence suggests that …", "In conclusion, …"]
  }
};

var CRITERIA = [
  ["المحتوى<br><span class=\"wen\" style=\"font-weight:600;font-size:.82rem\">Content</span>",
   "هل أجبتَ عن نقاط المهمّة الثلاث كلّها، وبلغتَ الطول المطلوب؟ نقطةٌ لم تُجب عنها = درجةٌ ناقصة، ولو كانت لغتك ممتازة."],
  ["الترتيب والربط<br><span class=\"wen\" style=\"font-weight:600;font-size:.82rem\">Organisation</span>",
   "هل تبدأ بجملةٍ تُقدّم الموضوع، وترتّب أفكارك، وتربط جملك بأدوات الربط، وتختم برأيٍ أو خلاصة؟"],
  ["اللغة<br><span class=\"wen\" style=\"font-weight:600;font-size:.82rem\">Language</span>",
   "الحروف الكبيرة، والنقاط والفواصل، والضمير I كبيرًا، وتنوّع الكلمات وأطوال الجمل بلا تكرارٍ مملّ."],
  ["مناسبة الأسلوب<br><span class=\"wen\" style=\"font-weight:600;font-size:.82rem\">Communicative Achievement</span>",
   "هل تكتب بأسلوب الكتابة لا بلغة الدردشة؟ جملٌ كاملة، بلا اختصارات المحادثة، وبلا كلماتٍ كلّها حروفٌ كبيرة."]
];

function howToHtml(level, cef){
  var H = HOWTO[level] || HOWTO[1];
  return '<details class="whow"><summary>📖 ما فهمت الطريقة؟ افتح هذا أوّلًا'+trI("Not sure how? Open this first")+'</summary>'+
    '<h4>١ · الطريقة خطوةً خطوة</h4><ol class="wstep">'+
      H.steps.map(function(s){ return '<li>'+s+'</li>'; }).join('')+'</ol>'+
    '<h4>٢ · على أيّ شيءٍ تُحاسَب؟ أربعة مقاييس، كلٌّ من ٥</h4>'+
      '<p style="font-size:.88rem;color:var(--muted);margin:0 0 5px">لا يكفي أن تكتب لغةً سليمة: '+
      'من كتب لغةً ممتازة وترك نقطةً من نقاط المهمّة نزلت درجته في «المحتوى». والنجاح ٣ في كلٍّ منها.</p>'+
      '<table class="wcrit"><tbody>'+
      CRITERIA.map(function(c){ return '<tr><td>'+c[0]+'</td><td>'+c[1]+'</td></tr>'; }).join('')+
      '</tbody></table>'+
    '<h4>٣ · نموذجٌ محلول — موضوع <span class="wen">«'+H.topic+'»</span></h4>'+
      '<p style="font-size:.88rem;color:var(--muted);margin:0 0 5px">موضوعه غير موضوعك اليوم عمدًا — '+
      'المقصود أن ترى <b>الطريقة</b> لا أن تنسخ الجواب.</p>'+
      '<div class="wmodel">'+H.model+'</div>'+
      '<div class="wkey"><span><i style="background:rgba(37,99,235,.45)"></i> جملة الموضوع</span>'+
        '<span><i style="background:rgba(22,163,74,.45)"></i> أدوات الربط</span>'+
        '<span><i style="background:rgba(217,119,6,.5)"></i> الخاتمة أو الرأي</span></div>'+
      '<div style="margin-top:8px"><b style="font-size:.93rem">لماذا نال هذا النموذج درجةً عالية؟</b>'+
        '<ul style="margin:5px 0 0;padding-inline-start:20px;font-size:.91rem;line-height:1.8">'+
        H.why.map(function(w){ return '<li>'+w+'</li>'; }).join('')+'</ul></div>'+
    '<h4>٤ · عباراتٌ جاهزة تبني عليها</h4>'+
      '<div class="wphr">'+H.phrases.map(function(p){ return '<code>'+p+'</code>'; }).join('')+'</div>'+
      '<p style="font-size:.88rem;color:var(--muted);margin:8px 0 0">وتذكّر: الطول المطلوب لمستواك '+
      '<b>'+cef.name+'</b> هو <b>'+cef.minWords+'</b> كلمة — والدرجة تنقص إن قصّرت عنه ولو كان ما كتبته سليمًا.</p>'+
  '</details>';
}

/* ═════════════ الجزء الثالث — اقرأ بصوتك 🎙️ (إجباريّ: خمسُ جمل) ═════════════
   طلبُ الأب (٢٥ سبتمبر ٢٠٢٦): «وحط قيّم نطقي (إجباري ٥ طبعًا) عشان
   يتعودون عليها».

   وموضعُها من التعبير صحيحٌ لا زائد: الجملةُ التي يكتبها الابنُ ولا
   ينطقها تبقى حروفًا على ورق. وقراءتُها بصوته تكشف ما لا يكشفه
   التصحيحُ الآليّ — كلمةٌ يعرف معناها ولا يعرف نطقها.

   والخمسُ إجباريّةٌ بالعدّاد والتذكير لا بقفل القسم: المايكروفون
   أعطبُ ما في الموقع (بلاغاتُ ٣١ أغسطس و٤ و٥ و٦ و٨ سبتمبر)، ولو
   علّقنا التعبيرَ كلَّه على نجاحه لحُبس ابنٌ كتب فقرتَه كاملةً بعطلٍ
   ليس منه. فلكلّ جملةٍ زرُّ تخطٍّ يظهر بعد محاولتين فاشلتين، ويُعدّ
   تخطّيًا لا إنجازًا فيراه الأب على حقيقته.

   والعدّ يوميّ: يبدأ من صفرٍ كلّ يومٍ لأنّ المقصود عادةٌ لا رقمٌ
   يُجمع مرّةً ثمّ يُنسى. */
var READ_REQ = 5;

/* جملُ القراءة من بنوك القسم نفسِه — لا نؤلّف إنجليزيّةً جديدةً تُخطئ:
   هذه جملٌ مراجَعةٌ يستعملها التدريبُ أصلًا، ومستواها مستوى الابن. */
function sayBank(level){
  var out=[];
  if(level>=3){
    TOPIC_SENT3.forEach(function(p){ out.push(p[1]); });
    REGISTER3.forEach(function(p){ out.push(p[0]); });
    GRAM3.forEach(function(p){ out.push(p[0]); });
    SEQ3.forEach(function(p){ out.push(p[0]); out.push(p[2]); });
  } else if(level>=2){
    TOPIC_SENT.forEach(function(p){ out.push(p[1]); });
    SEQ.forEach(function(p){ out.push(p[0]); out.push(p[1]); out.push(p[2]); });
    JOIN.forEach(function(p){ out.push(p[0]+" "+p[2]+" "+p[1]+"."); });
  } else {
    SUBJ.forEach(function(sb){ out.push(sb+" "+gp(VP)+" "+gp(TIME)+"."); });
    JOIN.forEach(function(p){ out.push(p[0]+" "+p[2]+" "+p[1]+"."); });
  }
  /* جملٌ قصيرةٌ جدًّا لا تُقيَّم جيّدًا، وطويلةٌ جدًّا تُتعب المبتدئ */
  return out.filter(function(x){ var n=String(x).split(/\s+/).length; return n>=4 && n<=26; });
}
/* جملُ الابن نفسِه حين يكون قد كتب فقرتَه — أنفعُ من أيّ نموذج */
function ownSentences(text){
  return splitSentences(String(text||""))
    .map(function(x){ return String(x).replace(/\s+/g," ").trim(); })
    .filter(function(x){ var n=x.split(/\s+/).length; return n>=4 && n<=26 && /[A-Za-z]/.test(x); });
}
function pickSay(level, who){
  var pool=sayBank(level), k="wen_said_"+who, seen=[];
  try{ seen=JSON.parse(localStorage.getItem(k)||"[]")||[]; }catch(e){}
  var left=pool.filter(function(x){ return seen.indexOf(x)<0; });
  if(left.length<READ_REQ){ left=pool.slice(); seen=[]; }
  var pick=shuffle(left).slice(0,READ_REQ);
  try{ localStorage.setItem(k, JSON.stringify(seen.concat(pick).slice(-60))); }catch(e){}
  return pick;
}

function injectCss(){
  if(document.getElementById("wen-css")) return;
  var st=document.createElement("style"); st.id="wen-css"; st.textContent=CSS;
  document.head.appendChild(st);
}

function render(el, ctx){
  injectCss();
  var level = ctx.level || 1;
  /* خدمةُ تقييم النطق تصل من الصفحة المضيفة (quiz.html) — وصفحةُ فهدٍ
     (practice.html) لا تمرّرها، فلا يظهر الجزءُ الثالثُ فيها أصلًا:
     زرٌّ لا يعمل أسوأ من غيابه. */
  var PRON_OK = !!(ctx.pron && ctx.pron.ok && ctx.pron.assess && ctx.pron.speak);
  var readDone = function(){ return READ_REQ; };   /* يُستبدل حين يُبنى الجزء الثالث */
  var cef = CEFR[ctx.cefr] || (level>=2 ? CEFR.A2 : CEFR.A1);
  var prompts = PROMPTS[level] || PROMPTS[1];
  /* ═══ موضوعُ اليوم: دورةٌ تستنفد البنكَ قبل أن تعود ════════════════
     كان pIdx = dayIdx % prompts.length، والبنكُ ثمانيةٌ — فدورةٌ كلَّ
     ثمانيةِ أيّامٍ بترتيبٍ واحدٍ يعرفه الطفلُ من التقويم. فحفِظ حسنٌ
     نصوصَه وأخذ الدرجةَ كاملةً بالذاكرةِ لا بالكتابة، وقالها لأبيه.

     والبنكُ الآن ثلاثون، والقسمةُ وحدَها تكفي لدورةٍ شهريّة — لكنّ
     ترتيبَها يبقى واحدًا في كلِّ دورة. فيُخلَط ترتيبُ الدورةِ بمفتاحٍ
     من اسمِ الطفلِ ورقمِ الدورة: كلُّ موضوعٍ مرّةً واحدةً في الدورةِ
     (لا تكرارَ قبل استنفادِ البنك)، وترتيبٌ مختلفٌ في كلِّ دورةٍ (فلا
     يُتوقَّع موضوعُ الغد)، وثابتٌ في اليومِ الواحدِ فلا يتبدّل بإعادةِ
     التحميل. وبلا حالةٍ محفوظةٍ في المتصفّحِ أصلًا — فلا يضيع بتفريغِ
     الذاكرةِ ولا يختلف بين جهازٍ وجهاز. */
  var dayIdx = Math.floor((Date.now()+3*3600*1000)/86400000);
  var _cycN = prompts.length;
  var _cyc  = Math.floor(dayIdx / _cycN);
  var _pos  = ((dayIdx % _cycN) + _cycN) % _cycN;
  var pIdx  = cycleOrder(_cycN, _h32(String(ctx.who||"") + "|" + _cyc))[_pos];
  var items = genN(GENS[level]||GENS[1], 6);

  /* «أسئلة جديدة» يُعيد رسم التدريب، فنفكّ مستمعي النسخة السابقة لئلّا
     تتراكم ويُحفظ صفٌّ عن قائمةٍ لم تعد معروضة. */
  var _drillLeaveHooked = null;
  var html = ''+
    '<div class="wsec"><b>✍️ التعبير</b>'+trI("Writing")+' — '+
      (level>=3 ? 'بناء المقال: الأطروحة، والحجّة بدليل، والرأي المضادّ وردّه، والتسجيل الرسميّ.'+
                  trs("Essay writing: thesis, evidence, counter-argument and formal register.")
       : level>=2 ? 'بناء الفقرة: جملة الموضوع، الوحدة، الترتيب، وأدوات الربط.'+
                  trs("Paragraph writing: topic sentence, unity, order and linking words.")
                  : 'بناء الجملة: الترتيب، الحرف الكبير، النقطة، وأدوات الربط.'+
                  trs("Sentence writing: word order, capital letters, full stops and linking words."))+
      '<br><span style="color:var(--muted);font-size:.9rem">قسمان: تدريب سريع مصحّح'+
      (level>=3 ? ' على نمط «التحليل الكتابيّ» في ستيب، ثمّ اكتب مقالك' : '، ثمّ اكتب فقرتك')+
      ' — و'+(level>=3?'يُحفَظ':'تُحفظ')+' لوالدك ليقرأه'+(level>=3?'':'ا')+'.</span>'+
      '<div style="margin-top:8px"><span class="wtag">📐 التقييم بمقاييس كامبردج الأربعة</span> '+
      '<span class="wtag">🎯 مستواك المستهدف: '+cef.name+'</span></div></div>'+
    /* الشرح أوّل ما يقع عليه البصر، مطويًّا فلا يزحم من يعرف الطريقة */
    howToHtml(level, cef)+
    '<div class="wsec"><b>الجزء الأول — تدريب</b>'+trs("Part 1 — Practice")+'<div id="wquiz"></div>'+
      /* dir="ltr" على الرقم وحده — بلاه ينعكس بصريًّا داخل السياق العربيّ
         («3 / 10» يظهر «10 / 3»)، وهو عيبٌ وقع في كل عدّادات الدرجة
         على الموقع، هنا وفي كل صفحات الاختبارات. */
      '<div style="text-align:center;font-weight:800;margin-top:10px"><span id="wscore" dir="ltr">0 / '+items.length+'</span></div>'+
      '<button class="wbtn ghost" id="wnew">تدريب جديد 🔄'+trI("New practice")+'</button></div>'+
    '<div class="wsec"><b>الجزء الثاني — '+(level>=3?'اكتب مقالك':'اكتب فقرتك')+'</b>'+
      trs(level>=3?"Part 2 — Write your essay":"Part 2 — Write your paragraph")+
      '<div style="margin:8px 0 4px;font-size:1.05rem"><b>'+en(prompts[pIdx].t)+'</b></div>'+
      '<div style="color:var(--muted);font-size:.92rem;margin-bottom:6px">'+en(prompts[pIdx].h)+'</div>'+
      '<div style="background:var(--bg);border-radius:10px;padding:9px 12px;margin-bottom:8px;font-size:.9rem">'+
        '<b>نقاط المهمّة</b> — غطِّها كلّها لترفع درجة <i>Content</i>:'+trs("Task points — cover all of them to raise your Content mark:")+'<ol style="margin:5px 0 0;padding-inline-start:18px">'+
        (prompts[pIdx].points||[]).map(function(pp){ return '<li>'+en(pp.q)+'</li>'; }).join('')+
        '</ol><div style="color:var(--muted);margin-top:6px">الطول المطلوب لمستوى '+cef.name+': <b>'+cef.minWords+'</b> كلمة على الأقل — '+cef.say+'.'+
        trs("Required length for "+cef.name+": at least "+cef.minWords+" words.")+'</div></div>'+
      /* ═══ قاعدةٌ معلنةٌ لا بابٌ مغلق ══════════════════════════════════
         قِيست جلسةُ حسنٍ (٢٠ نوفمبر ٢٠٢٦) بعدّادِ اللصقِ الذي طلبه الأب
         أمسَ ذلك اليوم: مدّةُ الكتابةِ ثانيةٌ واحدة، ولصقةٌ واحدةٌ فيها
         ١١٧٢ حرفًا — وهو طولُ النصِّ كلِّه، أي مئةٌ بالمئةِ ملصوق.
         وقُوبِل النصُّ بنصوصِه الثمانيةِ السابقةِ في الموضوعِ نفسِه فأعلى
         تشابهٍ عشرةٌ بالمئةِ في الخمسِ المتتابعة، فليس نصَّه القديم.
         وكانت الدرجةُ أوّلَ «B1+ نحو B2» في أربعٍ وثلاثين جلسة.

         واختار الأبُ ألّا يُمنَع اللصق: المنعُ يُتحايَل عليه بالنقلِ
         باليدِ من نافذةٍ أخرى ولا يُعلّمه شيئًا. فاليدُ حرّةٌ، والقاعدةُ
         تُقال له قبل أن يكتب، ومن لصق أكثرَ النصِّ سُجّلت جلستُه
         trusted:false فلا تدخل معدّلَه — كما تُسجَّل جلسةُ المسموعِ حين
         يغيب عن الصفحة. */
      '<div style="border:1.5px solid var(--line);background:var(--bg);border-radius:10px;padding:8px 11px;margin-bottom:8px;font-size:.88rem">'+
        '📋 <b>اكتبها بيدك.</b> إن كان أكثر النصّ ملصوقًا فالجلسة تُسجَّل ولا تُحسَب لك — ويظهر ذلك في تقريرك.'+
        trs("Write it yourself. If most of the text is pasted, the session is recorded but not counted.")+'</div>'+
      '<textarea id="wtext" dir="ltr" placeholder="Write your paragraph here..." spellcheck="true"></textarea>'+
      '<div class="wmeter"><i id="wbar"></i></div>'+
      '<div id="wlive" style="font-size:.9rem;color:var(--muted)">0 كلمة · 0 جملة</div>'+
      '<button class="wbtn" id="wcheck">قيّم كتابتي ✅'+trI("Check my writing")+'</button>'+
      '<div id="wfeed"></div></div>'+
    /* الجزء الثالث: لا يُعرض إن لم تكن خدمةُ النطق مُهيّأةً لهذا الابن —
       زرٌّ لا يعمل أسوأ من غيابه (وصفحةُ فهدٍ لا تُمرّر pron أصلًا). */
    (PRON_OK ? ('<div class="wsec" id="wreadsec"><b>الجزء الثالث — اقرأ بصوتك 🎙️</b> '+
      '<span class="wreq" id="wreqbadge">إجباري: ٥ جمل</span>'+
      trs("Part 3 — Read aloud (5 required sentences)")+
      '<div style="color:var(--muted);font-size:.9rem;margin-top:6px">اقرأ كلّ جملةٍ بصوتٍ واضح واضغط «قيّم نطقي» — '+
        'الكلمةُ التي تكتبها ولا تنطقها تبقى حروفًا على ورق.'+
        trs("Read each sentence aloud and press “Check my pronunciation”.")+'</div>'+
      '<div id="wreadlist"></div>'+
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">'+
        '<button class="wsay" id="wreadown">📄 اقرأ ما كتبتُه أنا'+trI("Read my own writing")+'</button>'+
        '<button class="wsay" id="wreadnew">🔄 جملٌ أخرى'+trI("Other sentences")+'</button>'+
      '</div></div>') : '');
  el.innerHTML = html;

  /* ---- الجزء الأول ---- */
  function paintQuiz(list){
    var box=el.querySelector("#wquiz"), h="";
    list.forEach(function(q,i){
      h+='<div class="wq" data-i="'+i+'" style="margin-top:12px"><div class="num">سؤال '+(i+1)+trI("Question "+(i+1))+'</div>'+
         '<div class="stem">'+q[0]+'</div><div class="wopts">';
      q[1].forEach(function(o,j){ h+='<button data-j="'+j+'">'+o+'</button>'; });
      h+='</div><div class="wexp">'+q[3]+'</div></div>';
    });
    box.innerHTML=h;
    var correct=0, answered={}, total=list.length, saved=false;
    /* نفس علّة الفقرة: التدريب لا يُحفظ إلّا باكتمال الستّة كلّها. من أجاب
       أربعة ثمّ خرج لا يُسجَّل له شيء. نحفظ الجزئيّ عند المغادرة بثلاثة فأكثر
       (نفس عتبة reading.html) موسومًا partial. */
    function saveDrillPartial(){
      if(saved) return;
      var n=Object.keys(answered).length;
      if(n<3) return;
      saved=true;
      ctx.save({ kind:"writing-drill", correct:correct, total:n, level:level, partial:true });
    }
    if(_drillLeaveHooked) document.removeEventListener("visibilitychange", _drillLeaveHooked.v),
                          window.removeEventListener("pagehide", _drillLeaveHooked.p);
    var _v=function(){ if(document.hidden) saveDrillPartial(); }, _p=function(){ saveDrillPartial(); };
    _drillLeaveHooked={v:_v,p:_p};
    document.addEventListener("visibilitychange", _v);
    window.addEventListener("pagehide", _p);
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
  /* ⚠️ المفتاحُ بالموضوعِ لا بموضعِه: الموضعُ يُخلَط في كلِّ دورةٍ،
     فمسوّدةُ موضوعٍ محفوظةٌ تحت الموضعِ ٣ كانت تعود لموضوعٍ آخرَ في
     الدورةِ التالية. */
  var tKey = _h32(prompts[pIdx].t).toString(36);
  var draftKey="wen_draft_"+ctx.who+"_"+tKey;
  try{ var d=localStorage.getItem(draftKey); if(d) ta.value=d; }catch(e){}
  function refresh(){
    var t=ta.value.replace(/\s+/g," ").trim();
    var w=t? t.split(/\s+/).filter(function(x){ return /[A-Za-z]/.test(x); }).length : 0;
    var s=splitSentences(t).length;
    live.innerHTML=w+" كلمة · "+s+" جملة"+trI(w+" words · "+s+" sentences")+
      (needsDots(ta.value)
        ? '<div style="margin-top:6px;border:1.5px solid var(--bad);background:var(--bad-bg);color:var(--bad);border-radius:10px;padding:7px 10px;font-weight:700">'+
          '✋ '+w+' كلمة وما فيها ولا نقطة — راجِعها قبل التقييم. بلا نقاطٍ تُحسَب كلُّها جملةً واحدة.'+
          trs("No full stops yet — without them this counts as one sentence.")+'</div>'
        : '');
    bar.style.width=Math.min(100, Math.round(w/cef.minWords*100))+"%";
    try{ localStorage.setItem(draftKey, ta.value); }catch(e){}
  }
  ta.addEventListener("input", refresh); refresh();

  /* ═══ زمنُ الكتابةِ ومرّاتُ اللصق ══════════════════════════════════
     طلبُ الأب (١٩ نوفمبر ٢٠٢٦): «سجّل مدّة الكتابة وعدد مرّات اللصق
     في الصفوف القادمة». والصفُّ المحفوظُ لم يكن فيه زمنٌ أصلًا بخلافِ
     بقيّةِ أقسامِ الموقع، فلا يُعرَف أكتبها في ثلاثِ دقائقَ أم في
     ثلاثين.

     والساعةُ تبدأ بأوّلِ ضغطةِ مفتاحٍ لا بفتحِ الصفحة: الصفحةُ قد
     تبقى مفتوحةً ساعةً وهو لا يكتب، فيُحسَب عليه ما لم يعمله.
     وتتوقّف عن العدِّ وهو خارجَ الصفحة (كما يفعل عدّادُ الاختباراتِ
     بـaway) فلا يُحسَب زمنُ الغياب.

     واللصقُ يُعَدّ بحدثِه وبعددِ أحرفِه، ولا تُحسَب استعادةُ المسوّدةِ
     لصقًا — هي كتابتُه هو عادت إلى الصندوق. */
  var _wStart = 0, _wActive = 0, _wSeen = 0, _pasteN = 0, _pasteCh = 0;
  function _tick(){
    var now = Date.now();
    if(_wSeen && !document.hidden) _wActive += Math.min(now - _wSeen, 30000);
    _wSeen = now;
  }
  function _begin(){ if(!_wStart){ _wStart = Date.now(); _wSeen = _wStart; } else _tick(); }
  ta.addEventListener("input", _begin);
  ta.addEventListener("paste", function(e){
    _begin(); _pasteN++;
    try{ var d = (e.clipboardData || window.clipboardData);
         _pasteCh += (d && d.getData ? String(d.getData("text") || "").length : 0); }catch(err){}
  });
  document.addEventListener("visibilitychange", function(){
    if(document.hidden) _tick(); else _wSeen = Date.now();
  });
  /* نصيبُ الملصوقِ من النصِّ النهائيّ. والحافظةُ تُقرأ على معظمِ
     الأجهزةِ وتُمنَع على بعضِها (getData في سفاري أحيانًا) فيُعَدُّ حدثُ
     اللصقِ بلا أحرف — فحينها يُقاس بالسرعة: عشرون حرفًا في الثانيةِ
     مطّردةً ليست كتابةَ إنسان، وأسرعُ كاتبٍ في العالمِ دون ذلك. */
  function _pasteShare(){
    return pasteVerdict(_norm(ta.value).length, _pasteN, _pasteCh, _wActive).share;
  }
  function _pasted(){
    return !pasteVerdict(_norm(ta.value).length, _pasteN, _pasteCh, _wActive).trusted;
  }
  function _writeStats(){
    if(!_wStart) return {};
    _tick();
    var v = pasteVerdict(_norm(ta.value).length, _pasteN, _pasteCh, _wActive);
    return { wdur: Math.round(_wActive/1000), paste: _pasteN, pasteCh: _pasteCh || undefined,
             pasteShare: _pasteN ? Math.round(v.share*100) : undefined,
             trusted: v.trusted,
             why: v.trusted ? undefined : "paste" };
  }

  /* بلاغ الأب (٤ سبتمبر ٢٠٢٦): «رفيف حاولت التعبير اليوم» — وقاعدة البيانات
     خاليةٌ من أيّ صفّ تعبيرٍ لها اليوم. والسبب أنّ الفقرة لا تُحفظ إلّا إن
     ضغطت «قيّم نصّي»: الطفلة تكتب فقرتها كاملة، ثمّ تخرج، فيبقى نصّها في
     متصفّحها وحده ولا يصل الأب شيء. والكتابة هي الجهد، لا ضغطة الزرّ.
     فصرنا نُقيّم ونحفظ تلقائيًّا عند المغادرة (التقييم محلّيٌّ بالكامل، لا
     يحتاج شبكة)، ونضع auto:true تمييزًا لها. ونحرس من التكرار بمقارنة النصّ
     الأخير المحفوظ، فلا يتكرّر صفٌّ حفظته بنفسها بالزرّ. */
  /* ═══ النصُّ الواحدُ لا يُحفَظ مرّتين ═══════════════════════════════
     سؤالُ الأب (٢٢ أكتوبر ٢٠٢٦) عن تعبيرِ حسن: في القاعدةِ إحدى عشرةَ
     تسليمةً وفيها خمسةُ نصوصٍ فقط — والستُّ الباقيةُ إعادةٌ حرفيّةٌ
     بالنصِّ نفسِه والدرجةِ نفسِها، مرّتان منها في يومٍ واحدٍ بينهما
     أربعُ ساعات.

     والعلّةُ هنا لا في الطفل: الصفحةُ تحفظ المسوّدةَ في المتصفّحِ
     وتعيدها إلى الصندوقِ عند الفتح (draftKey أدناه)، و_lastSaved
     مقيمٌ في الذاكرةِ وحدَها فيُمحى مع كلِّ تحميل. فيفتح الطفلُ
     الموضوعَ نفسَه، فيجد نصَّه أمامه، فيضغط «قيّم كتابتي» — فيُحفَظ
     صفٌّ جديدٌ بنصٍّ قديم. فيقرأ الأبُ أحدَ عشرَ عملًا وهي خمسة.

     فصارت بصمةُ آخرِ ما حُفِظ تُخزَّن مع المسوّدةِ نفسِها، فتعيش بعد
     التحميل. والتقييمُ يُعرَض كما هو — إنّما لا يُضاف صفٌّ ما لم
     يتغيّر النصّ. */
  var savedKey = "wen_saved_" + ctx.who + "_" + tKey;
  /* آخرُ نصٍّ سلّمه في هذا الموضوعِ بعينه — يُقابَل به الجديد */
  var prevKey  = "wen_prev_"  + ctx.who + "_" + tKey;
  var _prevText = "";
  try{ _prevText = localStorage.getItem(prevKey) || ""; }catch(e){}
  var _lastSaved = "";
  try{ _lastSaved = localStorage.getItem(savedKey) || ""; }catch(e){}
  var MIN_AUTO_WORDS = 8;
  function _norm(x){ return String(x||"").replace(/\s+/g," ").trim(); }
  /* نسبةُ ما أعاده من نصِّه القديمِ في هذا الموضوع */
  function reuseNow(){ return reuseRatio(ta.value, _prevText); }
  function saveParagraph(g, auto){
    var now = _norm(ta.value);
    if(now && now === _lastSaved) return false;    /* نفسُ النصِّ: لا صفَّ جديد */
    /* ولا يُحسَب عملًا جديدًا من أعاد أكثرَ من نصفِ نصِّه القديم */
    if(reuseNow() >= REUSE_MAX) return false;
    var byName={}; g.subs.forEach(function(s){ byName[s.en]=s.band; });
    _lastSaved = now;
    try{ localStorage.setItem(savedKey, now); }catch(e){}
    try{ localStorage.setItem(prevKey, ta.value); _prevText = ta.value; }catch(e){}
    ctx.save(Object.assign({ kind:"writing", correct:g.total, total:20, level:level, cefr:g.cefr, pass:g.pass,
               bands:byName, topic:prompts[pIdx].t, words:g.words, sents:g.sents,
               auto:(auto===true)||undefined,
               text:ta.value.slice(0,1500) }, _writeStats()));
    return true;
  }
  function autoSaveParagraph(){
    var t=_norm(ta.value);
    if(!t || t===_lastSaved) return;
    var g=gradeWriting(ta.value, level, cef, prompts[pIdx]);
    if(!g || g.words < MIN_AUTO_WORDS) return;   // كلمةٌ أو كلمتان ليست محاولة
    saveParagraph(g, true);
  }
  document.addEventListener("visibilitychange", function(){ if(document.hidden) autoSaveParagraph(); });
  window.addEventListener("pagehide", autoSaveParagraph);

  el.querySelector("#wcheck").addEventListener("click", function(){
    var g=gradeWriting(ta.value, level, cef, prompts[pIdx]);
    var feed=el.querySelector("#wfeed");
    if(g.words===0){ feed.innerHTML='<div style="color:var(--bad);font-weight:700;margin-top:10px">اكتب '+(level>=3?'مقالك':'فقرتك')+' أولًا ✍️'+trs(level>=3?"Write your essay first.":"Write your paragraph first.")+'</div>'; return; }

    var bcls=function(b){ return b>=4?"wb-hi":(b>=3?"wb-ok":"wb-lo"); };
    var h='<div style="margin-top:14px;display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">'+
            '<b style="font-size:1.05rem">النتيجة'+trI("Score")+': <span dir="ltr">'+g.total+' / 20</span></b>'+
            '<span class="wband '+(g.pass?"wb-hi":"wb-lo")+'">'+(g.pass?"✅ اجتزت":"⚠️ لم تجتز")+'</span>'+
          '</div>'+
          '<p style="color:var(--muted);font-size:.86rem;margin:4px 0 0">'+
            'أربعة مقاييس، كلٌّ من 5 ووزنه 25٪ — والنجاح أن تبلغ <b>3</b> في كلٍّ منها (نظام كامبردج).</p>'+
          /* والقاعدةُ المعلنةُ تُنفَّذ أمامَه لا في صمت: يرى الدرجةَ
             ويرى أنّها لا تُحسَب، فيعرف السببَ ويعرف العلاج. */
          (needsDots(ta.value)
            ? '<div style="margin-top:10px;border:1.5px solid var(--bad);background:var(--bad-bg);border-radius:12px;padding:9px 11px;font-weight:700;color:var(--bad)">'+
              '✋ <b>ما في ولا نقطة في النصّ.</b> فحُسِبت فقرتُك جملةً واحدةً، وضاعت بذلك علاماتُ الافتتاحيّةِ والخاتمةِ والحرفِ الكبيرِ وتنوّعِ الجمل — '+
              'وهي أربعُ علاماتٍ تأخذها بنقاطٍ فقط، لا بإنجليزيّةٍ أحسن. ضَعِ النقاطَ وأعِد التقييم.</div>'
            : '')+
          (_pasted()
            ? '<div style="margin-top:10px;border:1.5px solid var(--bad);background:var(--bad-bg);border-radius:12px;padding:9px 11px;font-weight:700;color:var(--bad)">'+
              '📋 أكثر هذا النصّ ملصوق ('+Math.round(_pasteShare()*100)+'٪) — فالجلسة تُسجَّل ولا تُحسَب لك، وتظهر في تقريرك بهذه العلامة. '+
              'اكتبها بيدك ولو أقصر، فالدرجة على كتابتك أنت.</div>'
            : '');

    g.subs.forEach(function(s){
      var open = s.band<3 ? " open" : "";
      h+='<details class="wsub"'+open+'><summary><span>'+s.ar+' <span style="color:var(--muted);font-weight:600;font-size:.85rem">'+s.en+'</span></span>'+
         '<span class="wband '+bcls(s.band)+'" dir="ltr">'+s.band+' / 5</span></summary><ul class="wchk">';
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
         (firstMiss? ' — '+(firstMiss.hint||firstMiss.label) : '')+
         ytLinkHtmlW(weakest.en, weakest.ar)+'</div>';
    } else {
      h+='<div style="margin-top:10px;color:var(--good);font-weight:800">ممتاز! خمسة من خمسة في المقاييس الأربعة 🎉</div>';
    }
    /* التذكير بالإجباريّ في آخر نتيجة الكتابة — هنا يقف بصرُه فعلًا */
    if(PRON_OK && readDone() < READ_REQ){
      h+='<div style="margin-top:10px;background:var(--bad-bg);color:var(--bad);border-radius:10px;padding:10px 12px;font-weight:800;font-size:.93rem">'+
         '🎙️ باقي عليك <b>'+(READ_REQ-readDone())+'</b> من خمس جملٍ إجباريّةٍ في «الجزء الثالث — اقرأ بصوتك».'+
         trs("You still have "+(READ_REQ-readDone())+" of 5 required sentences to read aloud in Part 3.")+'</div>';
    }
    /* ولا يُترَك في حَيرةٍ: إن لم يُحفَظ صفٌّ قيل له لماذا صراحةً —
       وإلّا ظنَّ أنّ عملَه ضاع، أو حسب أنّه سلّم عملًا جديدًا. */
    var _re = reuseNow();
    if(!saveParagraph(g, false) && g.words > 0){
      /* ويُفرَّق بين سببَين: نصٌّ لم يتغيّر أصلًا، ونصٌّ أعاد كتابتَه
         القديمةَ في الموضوعِ نفسِه. والثاني هو ما وقع فيه حسنٌ. */
      h += (_re >= REUSE_MAX)
        ? ('<div style="margin-top:10px;background:var(--bg);border:1.5px solid var(--warn);border-radius:11px;'+
           'padding:10px 12px;font-weight:700;color:var(--warn);font-size:.92rem">'+
           '🔁 هذي كتابتُك القديمةُ في الموضوعِ نفسِه — أعدتَ '+Math.round(_re*100)+'٪ منها. '+
           'والمقصودُ أن تكتب، لا أن تتذكّر ما كتبتَه. هاتِ أفكارًا غيرَها أو مثالًا جديدًا أو رأيًا آخر، '+
           'والتقييمُ فوق لك تقرؤه — لكنّه لا يُحفَظ درجةً جديدة.'+
           trs("This repeats "+Math.round(_re*100)+"% of your earlier text on this topic. Write new ideas — this attempt is not recorded.")+'</div>')
        : ('<div style="margin-top:10px;background:var(--bg);border:1.5px solid var(--warn);border-radius:11px;'+
           'padding:10px 12px;font-weight:700;color:var(--warn);font-size:.92rem">'+
           '📝 هذي نفسُ الفقرةِ التي حُفظت آخرَ مرّة، فما أضفتُ عملًا جديدًا لوالدك. '+
           'عدّل فيها أو اكتب غيرَها ليُحسَب لك عملٌ جديد.'+
           trs("Same text as last time — nothing new was recorded. Change it to log new work.")+'</div>');
    } else if(_re > 0.3 && g.words > 0){
      /* وما دون العتبةِ لا يُمنَع، إنّما يُقال له الرقمُ ليعرف أين هو */
      h += '<div style="margin-top:10px;color:var(--muted);font-weight:700;font-size:.88rem">'+
           'ℹ️ بنيتَ على كتابتِك السابقةِ في هذا الموضوع ('+Math.round(_re*100)+'٪ منها) — وهذا جيّدٌ ما دام فيه جديد.</div>';
    }
    feed.innerHTML=h;
  });

  /* ---- الجزء الثالث: القراءة بصوته ---- */
  if(PRON_OK){
    /* العدّ يوميّ: المقصود عادةٌ تتكرّر لا رقمٌ يُبلَغ مرّةً واحدة */
    var dayKey = "wen_read_"+ctx.who+"_"+new Date(Date.now()+3*3600*1000).toISOString().slice(0,10);
    var st = { done:0, skip:0, sum:0 };
    try{ var sv=JSON.parse(localStorage.getItem(dayKey)); if(sv && typeof sv.done==="number") st=sv; }catch(e){}
    readDone = function(){ return st.done + st.skip; };
    var saveSt = function(){ try{ localStorage.setItem(dayKey, JSON.stringify(st)); }catch(e){} };
    var badge = function(){
      var b=el.querySelector("#wreqbadge"); if(!b) return;
      var ok = st.done>=READ_REQ;
      b.className = "wreq"+(ok?" done":"");
      b.innerHTML = ok ? ('✅ خلّصت الخمس'+(st.sum&&st.done?' · متوسط نطقك '+Math.round(st.sum/st.done)+'%':''))
                       : ('إجباري: '+st.done+' من '+READ_REQ+(st.skip?' · تخطّى '+st.skip:''));
    };
    var paintRead = function(list){
      var box=el.querySelector("#wreadlist"); if(!box) return;
      box.innerHTML = list.map(function(sx,i){
        return '<div class="wread" data-r="'+i+'"><div class="s">'+esc(sx)+'</div>'+
          '<div class="b"><button class="wsay listen">🔊 استمع</button>'+
          '<button class="wsay mic go">🎙️ قيّم نطقي</button>'+
          '<button class="wsay skip" style="display:none">تخطّ هذه</button></div>'+
          '<span class="fb"></span></div>';
      }).join("");
      box.querySelectorAll(".wread").forEach(function(row){
        var txt=list[+row.getAttribute("data-r")], fb=row.querySelector(".fb");
        var go=row.querySelector(".go"), sk=row.querySelector(".skip"), fails=0, counted=false;
        row.querySelector(".listen").addEventListener("click", function(){ ctx.pron.speak(txt); });
        go.addEventListener("click", function(){
          /* sec: ثواني الصوت التي عدّتها أزور — بلا حفظها كانت حصّة
             الشهر تُنقص قراءات هذا القسم كلَّها (٢ أكتوبر ٢٠٢٦). */
          ctx.pron.assess(txt, fb, go, function(pron, acc, flu, sec){
            if(counted) return; counted=true;
            st.done++; st.sum+=(pron||0); saveSt(); badge();
            row.classList.add("ok"); go.style.display="none"; sk.style.display="none";
            /* يُحفظ كتقييم نطقٍ مثل بقيّة الموقع، فيظهر لوالده في قسم «🗣️ النطق» */
            ctx.save({ kind:"practice", test:"نطق إنجليزي 🗣️", correct:1, total:1,
                       kindPron:true, pmode:"word", sect:"writing", level:level,
                       pron:pron, acc:(typeof acc==="number"?acc:null), flu:(typeof flu==="number"?flu:null),
                       audioSec:(typeof sec==="number"?sec:0),
                       refWords:String(txt).split(/\s+/).length });
          });
          /* بعد إخفاقين نفتح بابَ التخطّي: العطلُ في المايك لا يُحبس به ابن */
          fails++;
          if(fails>=2) setTimeout(function(){ if(!counted) sk.style.display=""; }, 1500);
        });
        sk.addEventListener("click", function(){
          if(counted) return; counted=true;
          st.skip++; saveSt(); badge();
          go.style.display="none"; sk.style.display="none";
          fb.style.color="var(--muted)"; fb.innerHTML="⏭️ تخطّيتها — والدك يراها متخطّاةً لا مُنجَزة. ارجع لها لمّا يضبط المايك.";
        });
      });
    };
    var sayList = pickSay(level, ctx.who);
    paintRead(sayList); badge();
    el.querySelector("#wreadnew").addEventListener("click", function(){
      sayList = pickSay(level, ctx.who); paintRead(sayList);
    });
    el.querySelector("#wreadown").addEventListener("click", function(){
      var own = ownSentences(ta.value);
      if(own.length < 2){
        var box=el.querySelector("#wreadlist");
        var w=document.createElement("div"); w.className="wread"; w.style.borderColor="var(--bad)";
        w.innerHTML='<b style="color:var(--bad)">اكتب فقرتك أوّلًا في الجزء الثاني، ثمّ اقرأها بصوتك.</b>'+
          trs("Write your paragraph in Part 2 first, then read it aloud.");
        box.insertBefore(w, box.firstChild);
        setTimeout(function(){ try{ w.remove(); }catch(e){} }, 5000);
        return;
      }
      /* فقرتُه أوّلًا، ثمّ نُكمل الخمسَ من البنك إن كانت جملُه أقلّ —
         فلا يبقى الإجباريُّ بعيدَ المنال لمن كتب أربعَ جملٍ فقط. */
      sayList = own.concat(pickSay(level, ctx.who)).slice(0, READ_REQ);
      paintRead(sayList);
    });
  }
}

/* grammarIssues مكشوفةٌ للفحصِ الآليّ: قواعدُها تُجرَّب على جملٍ
   صحيحةٍ وخاطئةٍ معًا، والإنذارُ الكاذبُ أسوأُ من السكوت. */
window.WritingEN = { render:render, _howto:HOWTO, grade:gradeWriting, CEFR:CEFR, PROMPTS:PROMPTS, _gens:GENS, _genN:genN,
                     grammar:grammarIssues, _rules:GRAMMAR, sims:sentSims, PAD_SIM:PAD_SIM,
                     reuse:reuseRatio, REUSE_MAX:REUSE_MAX,
                     order:cycleOrder, hash:_h32,
                     pasteVerdict:pasteVerdict, PASTE_MAX:PASTE_MAX,
                     needsDots:needsDots };
})();
