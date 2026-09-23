/* ══════════════════════════════════════════════════════════════════
   step-bank.js — بنك قواعد STEP (٣٠٠ سؤال، ١٥ موضوعًا)
   ══════════════════════════════════════════════════════════════════
   المصدر: كتيّب «Most Frequently Repeated Grammar Rules in STEP 2026»
   (منصّة عايد الأكاديمية) — ٩٦ صفحة، ١٥ موضوعًا، ٣٠٠ سؤال.

   لِمَ لم نأخذه كما هو؟ لأنّنا قِسناه أوّلًا فوجدنا ثلاثة عيوب في
   «تصميم» الأسئلة لا في مضمونها:

   ١) موضع الإجابة الصحيحة مُنحاز انحيازًا شديدًا:
        B = ١٦٥/٣٠٠ (٥٥٪) · A = ٧١ · C = ٦٢ · D = ٢ فقط (٠٫٧٪)
      وفي أقسامٍ بعينها: for/since ‏B في ١٨ من ٢٠، والمبني للمجهول
      ‏١٧ من ٢٠، واكتشاف الخطأ ‏٩ من ١٠. أي أنّ الطالب لو ظلّل B
      في الثلاثمئة كلّها بلا قراءةٍ لأخذ ٥٥٪ — فيتعلّم عادةً غالطة
      يدخل بها الاختبار الحقيقيّ.
      العلاج: نكتب الإجابة الصحيحة في الموضع الأوّل دائمًا (idx=0)،
      وتتكفّل shuffleQ في practice.html بخلط الخيارات عند العرض،
      فتصير الاحتمالات ٢٥٪ لكلّ موضع. وكتابتها أوّلًا دائمًا يمنع
      أن ننقل إليها انحيازًا من عندنا.

   ٢) ٣٥ سؤالًا (١٢٪) مشوّشاتها كلماتٌ غير موجودة في الإنجليزيّة:
      hourses · minuteses · dropses · factses · pauseses ·
      suggestionses · consistenter · realisticer · badder ·
      usefullest · repeatest · slowlier · «is try» · «have revise» ·
      «had checked tomorrow». تُشطب من أوّل نظرة فيصير السؤال
      خيارين. العلاج: استبدلناها بمشوّشاتٍ صحيحة الصياغة خاطئة
      المعنى — وهي الّتي تُقاس بها القاعدة فعلًا.

   ٣) ٥٥ سؤالًا من ٢٩٨ فيها إعلانٌ للبائع (VIP، تليجرام، المنصّة،
      «سجّل اليوم»). نُزعت كلّها وأُبدلت بسياقٍ دراسيٍّ محايد.

   وأربعةُ أسئلةٍ صحّحنا حكمها لأنّ فيها جوابين مقبولين أو تناقضًا:
     • الضمائر ٣ تقبل they/their مع everyone، والضمائر ١٨ ترفضها مع
       one of the teachers — فوحّدنا الحكم ونصصنا عليه في الشرح.
     • «Students ___ not leave the room» كان may، وshould صحيحةٌ
       أيضًا — فعدّلنا السياق ليصير الجواب واحدًا.
     • «He chose the ___ route» كان shortest، وshorter صحيحةٌ نحويًّا
       — فنصصنا في المتن على عدد الطرق.
     • «___ he opened the booklet, he checked the page number» كان
       Before والمعنى مقلوب — فأُعيدت صياغته.

   الشكل: [ متن السؤال , [خيارات — الصحيح أوّلًا] , 0 , شرح عربيّ ]
   ووسم <b>Grammar — الموضوع:</b> في أوّل المتن هو ما تقرؤه
   skillOf لتسمية المهارة في التقرير، و/Grammar/ في REMTOPICS
   يظلّ مطابِقًا فلا ينكسر القسم العلاجيّ.
   ══════════════════════════════════════════════════════════════════ */
(function(){
var T = {
  pres:"Present Tenses", past:"Past Tenses", since:"For / Since / Used to",
  time:"Time Connectors", cond:"If Conditions", rel:"Relative Clauses",
  pron:"Pronouns", count:"Countable / Uncountable", comp:"Comparative / Superlative",
  vform:"Verb + to / ing / base", modal:"Modal Auxiliaries",
  prep:"Prepositions / Articles", pass:"Passive Voice",
  punct:"Capitalization / Punctuation", order:"Word Order / Error ID"
};
function S(t, stem, opts, expl){ return ["<b>Grammar — "+T[t]+":</b> "+stem, opts, 0, expl]; }

var B = [];

/* ═══ ١) أزمنة المضارع — Present Tenses ═══ */
B.push(
S("pres","Right now, the research team ___ the final report.",["is reviewing","reviews","has reviewed","reviewed"],"‏right now تدلّ على حدثٍ جارٍ الآن ⇐ المضارع المستمرّ: is + v-ing."),
S("pres","Sara usually ___ her vocabulary notebook before breakfast.",["checks","is checking","has checked","check"],"‏usually عادةٌ متكرّرة ⇐ المضارع البسيط، ومع she نضيف s."),
S("pres","Look! That child ___ to copy the sentence from the board.",["is trying","tries","tried","has tried"],"‏!Look تُنبِّه إلى شيءٍ يحدث أمامك الآن ⇐ المضارع المستمرّ."),
S("pres","We ___ in Riyadh this month while our house is being painted.",["are staying","stay","stayed","have stayed"],"‏this month ترتيبٌ مؤقّت لا عادة ⇐ المضارع المستمرّ."),
S("pres","I can't lend you the book because I ___ it yet.",["haven't finished","didn't finish","am not finishing","don't finish"],"‏yet مع أثرٍ باقٍ في الحاضر ⇐ الحاضر التامّ: have/has + p.p."),
S("pres","The phone ___ constantly today, and I cannot focus.",["has been ringing","rings","rang","is rung"],"‏today مدّةٌ لم تنتهِ + تكرار مستمرّ ⇐ الحاضر التامّ المستمرّ."),
S("pres","He ___ English since he joined the class.",["has been studying","studies","studied","is studying"],"‏since تُحدِّد بداية فعلٍ ما زال مستمرًّا ⇐ has been + v-ing."),
S("pres","This is the third mock test I ___ this week.",["have taken","take","took","am taking"],"‏this week أسبوعٌ لم ينتهِ ⇐ الحاضر التامّ."),
S("pres","Why ___ at me like that? Did I say something strange?",["are you looking","do you look","have you looked","you look"],"سؤالٌ عن فعلٍ يجري الآن ⇐ are + you + v-ing."),
S("pres","The train to Dammam ___ at 6:15 every morning.",["leaves","is leaving","left","has left"],"جدولٌ ثابتٌ متكرّر ⇐ المضارع البسيط."),
S("pres","We ___ for over two hours, so let us take a short break.",["have been practicing","practice","practiced","are practiced"],"مدّةٌ متّصلة بالحاضر ‏(for two hours)‏ ⇐ الحاضر التامّ المستمرّ."),
S("pres","The soup smells great. ___ your mother ___ dinner?",["Is / cooking","Does / cook","Has / cooked","Did / cook"],"رائحةٌ تُشمّ الآن ⇐ حدثٌ جارٍ: Is she cooking؟"),
S("pres","I ___ this method; it really helps with grammar questions.",["like","am liking","was liking","have been liking"],"‏like فعلُ حالةٍ لا يُستخدَم في الأزمنة المستمرّة ⇐ المضارع البسيط."),
S("pres","Be quiet! The lecturer ___ an important point about clauses.",["is explaining","explains","explained","has explained"],"‏!Be quiet تدلّ على حدثٍ يجري في هذه اللحظة ⇐ المضارع المستمرّ."),
S("pres","Many students ___ that punctuation is easy, but it often causes mistakes.",["think","are thinking","thought","has thought"],"حقيقةٌ عامّةٌ متكرّرة ⇐ المضارع البسيط؛ و‏think فعلُ رأيٍ لا يُستمرّ هنا."),
S("pres","My brother ___ in Jeddah since 2014.",["has lived","lives","is living","lived"],"‏since + نقطةُ بداية ⇐ الحاضر التامّ: has lived."),
S("pres","She ___ hard since January, and her results show it.",["has been trying","tries","is trying","tried"],"‏since يوجِب زمنًا تامًّا؛ والاستمرار يُبرَز بـ has been + v-ing."),
S("pres","Water ___ at 100°C under normal conditions.",["boils","is boiling","has boiled","boiled"],"حقيقةٌ علميّةٌ ثابتة ⇐ المضارع البسيط."),
S("pres","Look — we ___ the same unit again because the exam is close.",["are revising","revise","revised","have revised"],"‏— Look تُشير إلى ما يجري الآن ⇐ المضارع المستمرّ."),
S("pres","How long ___ you ___ for the test?",["have / been preparing","do / prepare","are / preparing","did / prepare"],"‏?How long عن مدّةٍ ما زالت جارية ⇐ have you been + v-ing.")
);

/* ═══ ٢) أزمنة الماضي — Past Tenses ═══ */
B.push(
S("past","When I arrived, the class ___ already ___.",["had / started","has / started","was / started","started / —"],"حدثٌ سبق حدثًا ماضيًا آخر ⇐ الماضي التامّ: had + p.p."),
S("past","She ___ notes while the teacher was explaining relative clauses.",["was taking","takes","took","has taken"],"فعلان جاريان في الماضي معًا ⇐ الماضي المستمرّ في الاثنين."),
S("past","We ___ the answer only after we had read the last sentence carefully.",["understood","understand","had understood","are understanding"],"الحدث المتأخّر يُصاغ ماضيًا بسيطًا، والأسبق had + p.p. وقد ورد في المتن."),
S("past","They ___ for an hour before the bus finally came.",["had been waiting","waited","were waited","have waited"],"مدّةٌ متّصلة انتهت قبل حدثٍ ماضٍ ⇐ الماضي التامّ المستمرّ."),
S("past","I ___ my old notebook yesterday and found useful rules inside.",["opened","open","have opened","am opening"],"‏yesterday وقتٌ ماضٍ منتهٍ ⇐ الماضي البسيط."),
S("past","While Ali ___ to the center, he saw an advertisement for the course.",["was walking","walked","has walked","had walked"],"‏While + فعلٌ طويلٌ جارٍ قطعه حدثٌ قصير ⇐ الماضي المستمرّ."),
S("past","By the time he applied, he ___ the exam twice.",["had taken","takes","has taken","was taking"],"‏By the time + ماضٍ ⇐ ما قبله بالماضي التامّ."),
S("past","The students were tired because they ___ all night.",["had been studying","studied","have studied","were studied"],"سببٌ استمرّ مدّةً وانتهى قبل حالةٍ ماضية ⇐ had been + v-ing."),
S("past","I ___ to call you, but my phone battery died.",["was going","go","have gone","am going"],"نيّةٌ في الماضي لم تتمّ ⇐ was going to."),
S("past","When the lights went out, we ___ a full mock test.",["were doing","did","have done","had done"],"حدثٌ قصير قطع فعلًا جاريًا ⇐ الماضي المستمرّ للفعل الجاري."),
S("past","She ___ the answer immediately because she had reviewed the rule earlier.",["knew","knows","has known","was knowing"],"ماضٍ بسيط؛ و‏know فعلُ حالةٍ لا يأتي مستمرًّا."),
S("past","He ___ very nervous during his first speaking practice, but he became confident later.",["felt","feels","had felt","is feeling"],"حالةٌ في وقتٍ ماضٍ محدّد ⇐ الماضي البسيط."),
S("past","The coach ___ us a strategy after he had marked the errors.",["gave","gives","was giving","has given"],"الحدث اللاحق ماضٍ بسيط، والأسبق had + p.p."),
S("past","At 8 p.m. yesterday, I ___ the last five questions.",["was checking","checked","have checked","had checked"],"لحظةٌ محدّدة في الماضي والفعل جارٍ فيها ⇐ الماضي المستمرّ."),
S("past","They ___ each other for years before they became business partners.",["had known","knew","know","have known"],"مدّةٌ سبقت حدثًا ماضيًا ⇐ الماضي التامّ (و‏know لا يأتي مستمرًّا)."),
S("past","I didn't recognize her at first because she ___ her glasses.",["wasn't wearing","didn't wear","hasn't worn","hadn't wear"],"وصفُ حالٍ مرافقةٍ للحظةِ الماضي ⇐ الماضي المستمرّ."),
S("past","We ___ to leave when the rain suddenly started.",["were about","have been about","are about","had about"],"‏be about to = على وشك؛ وفي الماضي: were about to."),
S("past","After the test ended, everyone ___ their answers anxiously.",["discussed","discusses","was discussed","is discussing"],"‏After + ماضٍ ⇐ الجواب ماضٍ بسيط ومعلوم لا مجهول."),
S("past","The printer didn't work because someone ___ it in.",["hadn't plugged","didn't plug","hasn't plugged","wasn't plugging"],"سببٌ أسبق من عطلٍ ماضٍ ⇐ الماضي التامّ المنفيّ."),
S("past","He ___ grammar for years before he finally took the test.",["had been studying","studied","studies","has been studying"],"مدّةٌ متّصلة انتهت قبل حدثٍ ماضٍ ⇐ had been + v-ing.")
);

/* ═══ ٣) for / since / used to ═══ */
B.push(
S("since","I have studied with this teacher ___ March.",["since","for","from","during"],"‏since + نقطةُ بداية (شهر، سنة، حدث). و‏for للمدّة."),
S("since","We have been in the hall ___ nearly two hours.",["for","since","at","from"],"‏for + مدّةٌ زمنيّة (ساعتان)."),
S("since","She ___ drink coffee, but now she has it every morning.",["didn't use to","used to","was used to","gets used to"],"‏but now تدلّ على نفي العادة سابقًا ⇐ didn't use to."),
S("since","I am getting used to ___ long reading passages.",["solving","solve","to solve","solved"],"‏get used to + اسم أو v-ing."),
S("since","He is used to ___ early for revision classes.",["waking","wake","to wake","woke"],"‏be used to + اسم أو v-ing."),
S("since","They have lived here ___ 2019.",["since","for","during","by"],"‏since + سنةٌ محدّدة."),
S("since","My father used to ___ me grammar quizzes on weekends.",["give","giving","gave","to give"],"‏used to + المصدر المجرّد."),
S("since","It took me weeks to get used to ___ under time pressure.",["working","work","to work","worked"],"‏get used to + v-ing."),
S("since","We have known each other ___ a very long time.",["for","since","by","until"],"‏for + مدّة (a long time)."),
S("since","Nora did not use to ___ online courses, but now she prefers them.",["like","liked","liking","to like"],"‏did not use to + المصدر المجرّد."),
S("since","Are you used to ___ English instructions all day?",["reading","read","to read","reads"],"‏be used to + v-ing."),
S("since","The center has offered support ___ many years.",["for","since","from","during"],"‏many years مدّة ⇐ for."),
S("since","I have wanted to improve my English ___ I saw my first score report.",["since","for","during","while"],"‏since قد تكون حرفَ جرٍّ أو رابطًا لجملةٍ تُحدِّد نقطةَ البداية."),
S("since","He used to ___ careless with articles, but now he checks every sentence.",["be","being","was","to be"],"‏used to + المصدر المجرّد: used to be."),
S("since","You will soon get used to ___ these grammar patterns.",["seeing","see","to see","saw"],"‏get used to + v-ing."),
S("since","I wasn't used to ___ so many difficult distractors in one test.",["facing","face","to face","faced"],"‏be used to + v-ing، والنفي لا يغيّر القاعدة."),
S("since","She has worked as a tutor ___ last summer.",["since","for","during","until"],"‏last summer نقطةُ بداية ⇐ since."),
S("since","We used to ___ paper dictionaries before apps became common.",["use","using","used","to use"],"‏used to + المصدر المجرّد."),
S("since","The students have practiced sentence order ___ weeks.",["for","since","during","from"],"‏weeks مدّةٌ غير محدّدةِ البداية ⇐ for."),
S("since","By the second mock, I was used to ___ the timer next to me.",["having","have","to have","had"],"‏be used to + v-ing.")
);
/* ═══ ٤) روابط الزمن — Time Connectors ═══ */
B.push(
S("time","___ I was revising, my friend sent me a screenshot of a question.",["While","After","Until","Because"],"‏While + فعلٌ طويلٌ جارٍ في الماضي يقطعه حدثٌ قصير."),
S("time","Call me ___ you finish the mock test.",["when","while","until","during"],"‏when + حدثٌ يتمّ ثمّ يترتّب عليه غيره."),
S("time","We had to wait ___ the examiner arrived.",["until","after","since","while"],"‏until = إلى أن؛ الانتظار يمتدّ إلى لحظةِ الوصول."),
S("time","___ he opened the book, he wrote his name on the cover.",["Before","While","Since","Until"],"الكتابةُ على الغلاف سبقت الفتح ⇐ Before."),
S("time","The students started writing ___ the bell rang, without wasting a second.",["as soon as","while","until","during"],"‏as soon as = فورَ أن؛ و«بلا إهدار ثانية» تُثبِتها."),
S("time","___ I see the word \"unless\", I read the sentence twice.",["Whenever","Until","Before","Since"],"‏Whenever = كلّما؛ عادةٌ متكرّرة كلّما تحقّق الشرط."),
S("time","He was taking notes ___ the teacher was speaking.",["while","after","until","before"],"فعلان جاريان في الوقت نفسه ⇐ while."),
S("time","Finish question 20 ___ you move to the next section.",["before","while","after","since"],"ترتيبٌ لازم: إتمامُ السؤال يسبق الانتقال ⇐ before."),
S("time","___ she had submitted the form, she noticed a spelling error.",["After","Until","While","Because"],"‏had submitted ماضٍ تامّ ⇐ الرابط After."),
S("time","I will send you the file ___ I receive the final version.",["once","until","while","although"],"‏once = بمجرّد أن؛ ولا نضع will بعدها."),
S("time","___ they were discussing conditionals, the power suddenly failed.",["While","Until","After","Before"],"جملةٌ مستمرّةٌ قطعها حدثٌ مفاجئ ⇐ While."),
S("time","Do not leave the room ___ the supervisor tells you to.",["until","after","while","since"],"النهي يمتدّ إلى أن يأذن المراقب ⇐ until."),
S("time","___ the test began, several students were still nervous.",["Before","While","Until","Because"],"‏still nervous قبل البداية ⇐ Before."),
S("time","She smiled ___ she saw her improved score.",["when","until","before","since"],"ردُّ فعلٍ لحظةَ الرؤية ⇐ when."),
S("time","___ the class had ended, the teacher answered extra questions.",["After","While","Before","Until"],"‏had ended يستدعي رابطًا للّاحق ⇐ After."),
S("time","Keep practicing ___ your timing becomes natural.",["until","while","because","since"],"الاستمرار إلى أن يتحقّق الهدف ⇐ until."),
S("time","___ he was driving, he listened to an English podcast.",["While","Before","Since","Until"],"فعلٌ جارٍ يرافقه فعلٌ آخر ⇐ While."),
S("time","___ you have read all the options, choose the best answer.",["Once","While","Until","Although"],"‏Once + حاضرٌ تامّ = بعد أن تُتِمّ."),
S("time","I recognized the trap only ___ I reached the last sentence.",["when","until","before","although"],"‏only when = لم أُدرِكها إلّا لحظةَ وصولي."),
S("time","___ the students are waiting, the coach checks the attendance.",["While","After","Since","Until"],"حدثان متوازيان في الحاضر ⇐ While.")
);

/* ═══ ٥) الجمل الشرطية — If Conditions ═══ */
B.push(
S("cond","If you heat ice, it ___.",["melts","would melt","melted","has melted"],"الشرط الصفريّ (حقيقةٌ علميّة): If + مضارع بسيط، مضارع بسيط."),
S("cond","If I have enough time tonight, I ___ the passive voice again.",["will review","reviewed","would review","had reviewed"],"الشرط الأوّل: If + مضارع بسيط، will + مصدر."),
S("cond","If he ___ harder, he would score above 90.",["studied","studies","had studied","will study"],"الشرط الثاني (فرضٌ مخالف للحاضر): If + ماضٍ بسيط، would + مصدر."),
S("cond","If they had left earlier, they ___ the first session.",["would have caught","will catch","would catch","caught"],"الشرط الثالث: If + had + p.p.، would have + p.p."),
S("cond","If I were you, I ___ the repeated question types first.",["would study","study","will study","studied"],"‏If I were you نصيحةٌ فرضيّة ⇐ would + مصدر."),
S("cond","If she ___ the instructions carefully, she would not have made that mistake.",["had read","reads","studied","has read"],"جوابٌ بصيغة would not have + p.p. ⇐ الشرط ماضٍ تامّ."),
S("cond","You will improve quickly if you ___ practicing every day.",["keep","kept","had kept","will keep"],"الشرط الأوّل: بعد if مضارعٌ بسيط ولو تأخّرت الجملة."),
S("cond","If the course had included live correction, it ___ even stronger.",["would have been","will be","would be","is"],"‏had included ⇐ الشرط الثالث: would have been."),
S("cond","If he ___ more patient, he could explain the rule better.",["were","will be","had been","is"],"فرضٌ مخالف للحاضر ⇐ were مع جميع الضمائر في الشرط الثاني."),
S("cond","If water did not exist, life ___ impossible.",["would be","is","was","will be"],"‏did not exist فرضٌ غير واقعيّ ⇐ would be."),
S("cond","If you mix red and blue, you ___ purple.",["get","would get","got","are getting"],"نتيجةٌ حتميّةٌ دائمة ⇐ الشرط الصفريّ بمضارعين بسيطين."),
S("cond","If I ___ about the mock earlier, I would have joined.",["had known","know","knew","have known"],"‏would have joined ⇐ الشرط الثالث: had known."),
S("cond","If the students finish early, they ___ extra review time.",["will get","would get","got","had gotten"],"احتمالٌ واقعيّ في المستقبل ⇐ الشرط الأوّل."),
S("cond","If she were not so tired, she ___ the last ten questions now.",["would be solving","would solve","will solve","solved"],"‏now تُبرز الاستمرار ⇐ would be + v-ing."),
S("cond","If he had taken more notes, he ___ the difference between for and since now.",["would remember","remembered","will remember","would have remembered"],"شرطٌ مختلط: ماضٍ تامّ في الشرط ونتيجةٌ في الحاضر ⇐ would + مصدر."),
S("cond","If you ___ to sound more natural, read model sentences aloud.",["want","wanted","had wanted","would want"],"أمرٌ مبنيٌّ على شرطٍ واقعيّ ⇐ مضارعٌ بسيط بعد if."),
S("cond","If it ___ tomorrow, the event will be online.",["rains","rain","rained","had rained"],"لا نضع will بعد if؛ والمضارع البسيط يفيد المستقبل هنا."),
S("cond","If they had listened to the advice, they ___ in this situation now.",["would not be","would not have been","are not","will not be"],"‏now تربط نتيجةً حاضرةً بشرطٍ ماضٍ ⇐ would not be."),
S("cond","If I ___ enough money, I would enroll today.",["had","have","had had","will have"],"‏would enroll ⇐ الشرط الثاني: had."),
S("cond","If the answer choices look similar, you ___ compare the grammar around the blank.",["should","should have","would","had"],"نصيحةٌ للحاضر ⇐ should + مصدر.")
);

/* ═══ ٦) جمل الوصل — Relative Clauses ═══ */
B.push(
S("rel","The teacher ___ explained the rule became well known.",["who","which","where","whose"],"‏who للعاقل في موضع الفاعل."),
S("rel","This is the book ___ helped me most.",["that","who","where","when"],"‏that لغير العاقل (ويصحّ which)."),
S("rel","The student ___ score improved the fastest followed the plan exactly.",["whose","who","which","whom"],"‏whose للملكيّة: درجتُه هو."),
S("rel","The room ___ we took the mock was unusually quiet.",["where","which","whose","whom"],"‏where للمكان."),
S("rel","I remember the day ___ I first understood conditionals.",["when","where","which","whose"],"‏when للزمان."),
S("rel","The center offers support to learners ___ need extra practice.",["who","whose","where","which"],"‏who للعاقل فاعلًا."),
S("rel","This is the strategy ___ many top students rely on.",["that","who","where","when"],"‏that لغير العاقل مفعولًا، و‏on في آخر الجملة."),
S("rel","The writer, ___ articles are widely shared, also teaches grammar.",["whose","who","which","that"],"‏whose للملكيّة: مقالاتُه."),
S("rel","The city in ___ he studied was far from his hometown.",["which","who","whose","where"],"بعد حرف الجرّ نستخدم which لغير العاقل، لا where."),
S("rel","Anyone ___ wants the extra sheet should ask the teacher.",["who","which","where","whose"],"‏Anyone عاقل ⇐ who."),
S("rel","The sentence ___ you underlined is actually correct.",["that","who","whom","when"],"‏that لغير العاقل في موضع المفعول."),
S("rel","That is the reason ___ I slowed down in the last section.",["why","where","which","whose"],"‏why بعد reason."),
S("rel","The coach ___ we met after class gave smart advice.",["whom","which","where","whose"],"‏whom للعاقل في موضع المفعول."),
S("rel","This is the only question ___ confused almost everyone.",["that","whom","whose","where"],"بعد only وbest وsuperlative نستخدم that."),
S("rel","The boy ___ sister teaches English got full marks.",["whose","who","which","whom"],"‏whose للملكيّة: أختُه."),
S("rel","The month ___ registrations usually rise is August.",["when","where","which","whose"],"‏when للزمان (month)."),
S("rel","The desk on ___ the papers were placed was wet.",["which","where","who","whose"],"بعد حرف الجرّ on نستخدم which."),
S("rel","Students ___ rush often lose easy marks.",["who","which","whose","where"],"‏who للعاقل جمعًا كان أو مفردًا."),
S("rel","The explanation ___ she posted last night was very clear.",["that","whom","where","whose"],"‏that لغير العاقل مفعولًا."),
S("rel","The exam center, ___ was renovated recently, looks much better now.",["which","that","whose","where"],"جملةٌ وصفيّةٌ غير محدِّدة بين فاصلتين ⇐ which، ولا تصحّ that.")
);
/* ═══ ٧) الضمائر — Pronouns ═══
   ملاحظة: الكتيّب الأصل كان يقبل their مع everyone (سؤال ٣) ويرفضها
   مع one of the teachers (سؤال ١٨) — حكمان متناقضان لحالةٍ واحدة.
   وحّدنا الحكم: they/their للمفرد المجهول الجنس، وإذا كان الجنس
   معلومًا نصصنا عليه في المتن فلا يبقى للسؤال إلّا جوابٌ واحد. */
B.push(
S("pron","Neither Ahmed nor Khalid brought ___ ID card.",["his","their","our","its"],"‏Neither A nor B مفردٌ، والاسمان مذكّران ⇐ his."),
S("pron","The printer stopped working because ___ ink had run out.",["its","it's","their","his"],"‏its ضميرُ ملكيّةٍ لغير العاقل؛ و‏it's اختصارُ it is."),
S("pron","Everyone should check ___ answers before submitting.",["their","his","its","our"],"‏everyone مفردٌ شكلًا، وthey/their هي المعتمدة له عند جهلِ الجنس."),
S("pron","I told Sarah that the notebook was ___.",["hers","her","she","herself"],"بعد was نحتاج ضميرَ ملكيّةٍ مستقلًّا ⇐ hers (لا يتبعه اسم)."),
S("pron","Between you and ___, this trap appears very often.",["me","I","myself","mine"],"بعد حرف الجرّ between نضع ضميرَ المفعول ⇐ me."),
S("pron","The coach introduced ___ to the new students.",["himself","he","him","his"],"الفاعل والمفعول شخصٌ واحد ⇐ الضميرُ الانعكاسيّ."),
S("pron","We enjoyed ___ during the final review session.",["ourselves","us","our","ours"],"‏enjoy oneself تعبيرٌ ثابت ⇐ ourselves مع we."),
S("pron","If anyone calls, tell ___ I will respond later.",["them","him","he","their"],"‏anyone مجهولُ الجنس ⇐ them في موضع المفعول."),
S("pron","This grammar section is easier than the previous ___.",["one","ones","it","that"],"‏one تنوب عن اسمٍ مفردٍ معدودٍ سبق ذكره."),
S("pron","The red markers are mine; the blue ___ are the teacher's.",["ones","one","them","it"],"‏ones تنوب عن اسمٍ جمعٍ سبق ذكره."),
S("pron","Each of the girls brought ___ own notebook.",["her","their","its","our"],"‏Each of + جمع = مفردٌ، والجنس معلومٌ (girls) ⇐ her."),
S("pron","The students blamed ___ for not reading carefully.",["themselves","them","theirs","their"],"لومُ الفاعلِ نفسَه ⇐ الضميرُ الانعكاسيّ الجمعيّ."),
S("pron","My bag is black, but ___ is brown.",["hers","her","she","herself"],"مقارنةُ ملكيّةٍ بلا اسمٍ بعدها ⇐ hers."),
S("pron","Who did you invite? The teacher invited Ali and ___.",["me","I","mine","myself"],"موضعُ مفعولٍ بعد invited، والمتكلّم غيرُ الفاعل ⇐ me."),
S("pron","The center updated ___ website this week.",["its","it's","their","hers"],"‏the center مؤسّسةٌ مفردةٌ غيرُ عاقلة ⇐ its."),
S("pron","She looked at ___ in the mirror and smiled.",["herself","she","her","hers"],"النظرُ إلى الذات ⇐ herself."),
S("pron","That answer is not ___; it is theirs.",["ours","our","us","we"],"مقابلُ theirs ضميرُ ملكيّةٍ مستقلّ ⇐ ours."),
S("pron","One of the female teachers forgot ___ keys on the desk.",["her","their","its","hers"],"‏One of + جمع = مفردٌ، والجنس معلومٌ ⇐ her (وhers لا يتبعها اسم)."),
S("pron","The mistake was ___, so I corrected it immediately.",["mine","my","me","myself"],"‏mine ضميرُ ملكيّةٍ مستقلّ؛ و‏my يلزمها اسمٌ بعدها."),
S("pron","The manager asked Layla and ___ to stay after class.",["me","I","mine","myself"],"موضعُ مفعولٍ بعد asked ⇐ me.")
);

/* ═══ ٨) المعدود وغير المعدود — Countable / Uncountable ═══ */
B.push(
S("count","We need ___ information before making a final decision.",["more","many","a few","several"],"‏information غيرُ معدودٍ فلا تصحّ معه many ولا a few ⇐ more."),
S("count","There are not many ___ in this passage, but the grammar is tricky.",["words","information","advice","equipment"],"‏many تلزمها جمعٌ معدود ⇐ words."),
S("count","She gave me two useful ___ about articles.",["pieces of advice","advices","advice","informations"],"‏advice غيرُ معدودٍ فلا يُجمَع، ويُعَدّ بـ a piece of advice."),
S("count","How much ___ do you usually need for a full mock test?",["time","hours","minutes","times"],"‏?How much تلزمها غيرُ المعدود ⇐ time (ومع الجمع نقول How many)."),
S("count","Only a little ___ was left in the bottle.",["water","waters","drops","bottles"],"‏a little + غيرُ معدود ⇐ water."),
S("count","I bought several ___ to organize my notes.",["folders","folder","furniture","stationery"],"‏several + جمعٌ معدود ⇐ folders."),
S("count","Much of the ___ in that video is practical.",["information","tips","suggestions","examples"],"‏Much of + غيرُ معدود، والفعل is يؤكّد الإفراد."),
S("count","There wasn't much ___ left before the bell.",["time","times","minutes","hours"],"‏much + غيرُ معدود ⇐ time."),
S("count","A great deal of ___ is required for accurate editing.",["patience","patient","patients","patiences"],"‏a great deal of + غيرُ معدود؛ و‏patience صبرٌ وpatients مرضى."),
S("count","There were very few ___ in his final draft.",["errors","error","information","feedback"],"‏few + جمعٌ معدود ⇐ errors."),
S("count","Could you give me some ___ on sentence order?",["advice","advices","an advice","many advice"],"‏advice غيرُ معدودٍ فلا a ولا جمعٌ ولا many."),
S("count","The teacher asked us to bring ___ paper for the quiz.",["some","a","many","a few"],"‏paper بمعنى الورق غيرُ معدود ⇐ some paper."),
S("count","Too many ___ can make the paragraph unclear.",["adjectives","advice","information","research"],"‏Too many + جمعٌ معدود ⇐ adjectives."),
S("count","I need a bit of ___ before I start another set.",["rest","rests","breaks","pauses"],"‏a bit of + غيرُ معدود ⇐ rest."),
S("count","Several ___ were absent from the extra workshop.",["students","student","information","equipment"],"‏Several + جمعٌ معدود، والفعل were يؤكّده."),
S("count","How many ___ has she taken this month?",["tests","test","advice","practice"],"‏?How many + جمعٌ معدود ⇐ tests."),
S("count","There is little ___ that the new format will be easier.",["evidence","evidences","proofs","facts"],"‏little + غيرُ معدود؛ و‏evidence لا يُجمَع."),
S("count","We received a lot of ___ after the free lesson.",["feedback","feedbacks","advices","an advice"],"‏feedback غيرُ معدودٍ فلا يُجمَع."),
S("count","The librarian bought new ___ for learners.",["books","book","information","equipments"],"‏new + جمعٌ معدود هنا ⇐ books؛ و‏equipment لا يُجمَع."),
S("count","Not much ___ was available online about that minor rule.",["information","details","examples","notes"],"‏Not much + غيرُ معدود ⇐ information.")
);

/* ═══ ٩) المقارنة والتفضيل — Comparative / Superlative ═══ */
B.push(
S("comp","This mock is ___ than the one we solved yesterday.",["harder","hard","hardest","more hard"],"‏than تلزمها صيغةُ المقارنة؛ والصفةُ القصيرة تأخذ er لا more."),
S("comp","Aya is the ___ student in the Saturday group.",["most consistent","more consistent","consistent","consistently"],"‏the + in the group ⇐ التفضيل، والصفةُ الطويلة تأخذ most."),
S("comp","The second explanation was ___ than the first.",["clearer","clearest","more clearly","most clear"],"مقارنةٌ بين اثنين ⇐ clearer (صفةٌ لا حال)."),
S("comp","Of all the samples, this one is the ___.",["most realistic","more realistic","realistic","realistically"],"‏Of all ⇐ التفضيل."),
S("comp","My new schedule is much ___ than my old one.",["better","good","best","more good"],"مقارنةُ good شاذّةٌ: good → better → best."),
S("comp","That was the ___ distractor in the whole test.",["worst","worse","bad","badly"],"‏the + in the whole test ⇐ التفضيل، وتفضيلُ bad هو worst."),
S("comp","The teacher spoke ___ than usual so everyone could follow.",["more slowly","most slowly","slow","slowest"],"‏spoke فعلٌ يُوصَف بحالٍ ⇐ مقارنةُ الحال: more slowly."),
S("comp","This lesson is not as ___ as the previous one.",["long","longer","longest","more long"],"‏as … as يلزمها الصفةُ المجرّدة."),
S("comp","Which section is ___ for you: reading or grammar?",["more challenging","most challenging","challenging","challenge"],"مقارنةٌ بين اثنين فقط ⇐ المقارنة لا التفضيل."),
S("comp","The more you practice, the ___ you become.",["more confident","most confident","confident","confidently"],"صيغةُ التناسب: the more … the more."),
S("comp","This sentence is ___ complicated than it looks.",["less","least","little","few"],"‏less + صفةٌ طويلة = مقارنةٌ تنقيصيّة."),
S("comp","Of the two routes, he chose the ___ one.",["shorter","shortest","short","shortly"],"المقارنةُ بين اثنين تكون بـ er لا est، ولو دخلت the."),
S("comp","Today's class was by far the ___ of the month.",["most useful","more useful","useful","usefully"],"‏by far توكيدٌ للتفضيل."),
S("comp","My sister is ___ at punctuation than I am.",["better","good","best","well"],"‏than ⇐ مقارنة؛ ومقارنةُ good هي better."),
S("comp","The full version is slightly ___ than the free sample.",["longer","long","longest","the longest"],"‏slightly تُوصِف مقارنةً، و‏than تُثبِتها."),
S("comp","No other student in the hall was ___ than Reem.",["more prepared","most prepared","prepared","preparing"],"‏No other … than صيغةُ مقارنةٍ تُفيد معنى التفضيل."),
S("comp","The earlier you start, the ___ stressful it feels.",["less","little","least","fewer"],"صيغةُ التناسب مع صفةٍ طويلة: the less stressful."),
S("comp","This rule is one of the ___ topics in the test.",["most repeated","more repeated","repeated","repeatedly"],"‏one of the + تفضيلٌ + جمع."),
S("comp","His latest score is ___ than all his previous ones.",["higher","high","highest","more high"],"‏than ⇐ المقارنة، والصفةُ القصيرة تأخذ er."),
S("comp","The explanation on page 4 is the ___ part for beginners.",["easiest","easier","easy","more easy"],"‏the + part واحدةٌ من كثير ⇐ التفضيل: easiest.")
);
/* ═══ ١٠) الفعل الثاني — Verb + to / ing / base ═══ */
B.push(
S("vform","I decided ___ the whole unit twice.",["to review","review","reviewing","reviewed"],"بعد decide نستخدم to + المصدر."),
S("vform","She enjoys ___ tricky sentence-order questions.",["solving","solve","to solve","solved"],"بعد enjoy نستخدم v-ing."),
S("vform","We hope ___ the final file tonight.",["to receive","receive","receiving","received"],"بعد hope نستخدم to + المصدر."),
S("vform","He avoided ___ directly without evidence.",["guessing","to guess","guess","guessed"],"بعد avoid نستخدم v-ing."),
S("vform","My teacher made me ___ the paragraph again.",["read","to read","reading","reads"],"بعد make + مفعول نستخدم المصدرَ المجرّد بلا to."),
S("vform","They agreed ___ after Maghrib for revision.",["to meet","meet","meeting","met"],"بعد agree نستخدم to + المصدر."),
S("vform","I do not mind ___ the explanation in Arabic first.",["hearing","hear","to hear","heard"],"بعد mind نستخدم v-ing."),
S("vform","She refused ___ the wrong option.",["to choose","choosing","choose","chose"],"بعد refuse نستخدم to + المصدر."),
S("vform","We practiced ___ the differences between tenses.",["identifying","identify","to identify","identified"],"بعد practice نستخدم v-ing."),
S("vform","Let him ___ the answer before you explain.",["finish","to finish","finishing","finishes"],"بعد let + مفعول نستخدم المصدرَ المجرّد."),
S("vform","I forgot ___ the link, so I asked for it again.",["to save","save","saving","saved"],"‏forget + to = نسي أن يفعل (فلم يفعله)."),
S("vform","I will never forget ___ my first high score.",["getting","get","to get","got"],"‏forget + v-ing = نسيان ذكرى شيءٍ حدث فعلًا."),
S("vform","The coach suggested ___ a timing strategy.",["using","to use","use","used"],"بعد suggest نستخدم v-ing."),
S("vform","We plan ___ a new mock next week.",["to take","take","taking","took"],"بعد plan نستخدم to + المصدر."),
S("vform","He stopped ___ because the teacher entered.",["talking","to talk","talk","talked"],"‏stop + v-ing = توقّف عن الفعل نفسه."),
S("vform","He stopped ___ a snack on the way to class.",["to buy","buying","buy","bought"],"‏stop + to = توقّف لكي يفعل شيئًا آخر."),
S("vform","She seems ___ the passive voice well now.",["to understand","understand","understanding","understood"],"بعد seem نستخدم to + المصدر."),
S("vform","The students kept ___ despite the difficult options.",["working","work","to work","worked"],"‏keep + v-ing = واصَل."),
S("vform","I want ___ whether this answer is acceptable.",["to know","knowing","know","known"],"بعد want نستخدم to + المصدر."),
S("vform","The manager allowed us ___ the sample file.",["to download","download","downloading","downloaded"],"‏allow + مفعول + to + المصدر.")
);

/* ═══ ١١) الأفعال المساعدة الناقصة — Modal Auxiliaries ═══ */
B.push(
S("modal","You ___ bring a printed ID to the test center.",["must","can","might","would"],"إلزامٌ من نظامٍ رسميّ ⇐ must."),
S("modal","Students ___ not leave the room without permission.",["may","would","will","might"],"‏may not = منعٌ رسميّ (غير مسموح)."),
S("modal","If you want a high score, you ___ review the basic rules first.",["should","must have","might","cannot"],"نصيحةٌ لا إلزام ⇐ should."),
S("modal","That answer ___ be right; it breaks the sentence structure.",["cannot","must","can","should"],"استحالةٌ منطقيّةٌ في الحاضر ⇐ cannot."),
S("modal","___ you please send me the latest schedule?",["Could","Must","Should","May not"],"‏?Could you please طلبٌ مؤدَّب."),
S("modal","You ___ memorize every question, but you should know the patterns.",["do not have to","must not","cannot","should not"],"‏don't have to = لا لزوم؛ و‏mustn't = محرَّم — والفرقُ بينهما مصيدةٌ متكرّرة."),
S("modal","He ___ have missed the message; I sent it twice.",["cannot","must","should","would"],"‏can't have + p.p. = استحالةُ حدوثِ شيءٍ في الماضي."),
S("modal","They ___ arrive late if traffic gets worse.",["might","must","should have","cannot"],"احتمالٌ ضعيف ⇐ might."),
S("modal","When I was younger, I ___ solve grammar questions very quickly.",["could","may","must","should"],"قدرةٌ في الماضي ⇐ could."),
S("modal","You ___ smoke inside the training hall.",["must not","do not have to","could","would"],"تحريمٌ لا مجرّد عدمِ لزوم ⇐ must not."),
S("modal","The result is not final; they ___ update it later.",["may","must not","cannot","should have"],"احتمالٌ مفتوح ⇐ may."),
S("modal","We ___ have started earlier; now we are rushing.",["should","can","might","must"],"‏should have + p.p. = لومٌ على ما لم يُفعَل."),
S("modal","She ___ speak both Arabic and English confidently.",["can","must","should","would"],"قدرةٌ في الحاضر ⇐ can."),
S("modal","If you need extra help, you ___ ask your teacher.",["can","must have","might not","would have"],"إتاحةُ خيارٍ ⇐ can."),
S("modal","He ___ be exhausted; he has completed three full mocks today.",["must","may","cannot","should"],"استنتاجٌ شبهُ يقينيّ من دليل ⇐ must."),
S("modal","You ___ have told me earlier; I could have helped.",["should","must","may","would"],"‏should have + p.p. = عتَبٌ على تركِ الفعل."),
S("modal","This old rule ___ still appear in the exam, so do not ignore it.",["may","must not","cannot","should have"],"احتمالُ الوقوع ⇐ may."),
S("modal","We ___ use dictionaries during the official test.",["cannot","might","can","would"],"منعٌ بالنظام ⇐ cannot."),
S("modal","___ I ask a question about the answer key?",["May","Should","Must","Need"],"‏?May I استئذانٌ مؤدَّب."),
S("modal","She ___ have understood the trap because she chose the safest structure.",["must","cannot","should","might not"],"‏must have + p.p. = استنتاجٌ عن ماضٍ من دليلٍ قائم.")
);

/* ═══ ١٢) حروف الجرّ وأدوات التعريف — Prepositions / Articles ═══ */
B.push(
S("prep","We have class ___ 7:30 p.m.",["at","in","on","by"],"‏at + ساعةٌ محدّدة."),
S("prep","The grammar workshop is ___ Monday.",["on","in","at","for"],"‏on + يومٌ من أيّام الأسبوع."),
S("prep","My cousin lives ___ Riyadh.",["in","on","at","to"],"‏in + مدينةٌ أو بلد."),
S("prep","He arrived ___ the airport very early.",["at","in","on","from"],"‏arrive at + مكانٌ محدّد (مطار، محطّة)؛ و‏arrive in + مدينة."),
S("prep","I saw her ___ the morning, but not in the evening.",["in","on","at","for"],"‏in the morning / afternoon / evening، و‏at night شاذّة."),
S("prep","There is ___ unusual pattern in this question.",["an","a","the","zero article"],"‏an قبل الصوت المتحرّك، و‏unusual تبدأ بصوتِ /ʌ/."),
S("prep","She bought ___ umbrella before the rain started.",["an","a","the","some"],"‏umbrella تبدأ بصوتٍ متحرّك ⇐ an."),
S("prep","We visited ___ old library near the center.",["an","a","the","zero article"],"‏old تبدأ بصوتٍ متحرّك ⇐ an."),
S("prep","___ sun was shining when we left the exam hall.",["The","A","An","Zero article"],"‏the مع الفريد في الكون: the sun, the moon."),
S("prep","I need ___ pen and ___ notebook.",["a / a","an / an","the / the","a / the"],"كلٌّ منهما نكرةٌ مفردةٌ تبدأ بصوتٍ ساكن ⇐ a / a."),
S("prep","We stayed ___ a small hotel near the station.",["at","on","for","to"],"‏stay at + فندقٌ أو مكانُ إقامة."),
S("prep","The files are ___ the desk.",["on","at","in","to"],"‏on للسطح الملامس."),
S("prep","My father usually reads ___ night.",["at","in","on","during"],"‏at night تعبيرٌ ثابتٌ خارجٌ عن قاعدة in."),
S("prep","She has an appointment ___ Friday afternoon.",["on","in","at","to"],"إذا اقترن جزءُ اليوم باسمِ يومٍ صرنا إلى on."),
S("prep","We met ___ the entrance to the building.",["at","in","on","for"],"‏at + نقطةٌ محدّدة (مدخل، باب)."),
S("prep","He was born ___ 2007.",["in","on","at","by"],"‏in + سنةٌ أو شهر."),
S("prep","I saw the answer key ___ a website last week.",["on","in","at","to"],"‏on a website / on the internet."),
S("prep","Please put the books ___ the bag.",["in","on","at","by"],"‏in للداخل المُحتوى."),
S("prep","We sat ___ the beach and reviewed irregular verbs.",["on","in","at","from"],"‏on the beach للسطح المفتوح."),
S("prep","___ Nile is one of the world's most famous rivers.",["The","A","An","Zero article"],"‏the مع أسماء الأنهار والبحار والمحيطات.")
);
/* ═══ ١٣) المبني للمجهول — Passive Voice ═══ */
B.push(
S("pass","The final report ___ next week.",["will be published","will publish","is publishing","has published"],"مجهولُ المستقبل: will be + p.p."),
S("pass","English ___ in many countries.",["is spoken","speaks","is speaking","spoken"],"مجهولُ المضارع البسيط: is/are + p.p."),
S("pass","The mistakes ___ before the file was uploaded.",["were corrected","corrected","have corrected","are correcting"],"مجهولُ الماضي البسيط: was/were + p.p."),
S("pass","A new mock test ___ by the team right now.",["is being prepared","is prepared","was prepared","has prepared"],"‏right now ⇐ مجهولُ المضارع المستمرّ: is being + p.p."),
S("pass","The answers ___ yet.",["have not been announced","have not announced","are not announcing","did not announcing"],"مجهولُ الحاضر التامّ: have not been + p.p."),
S("pass","The room ___ before the students arrived.",["had been cleaned","had cleaned","was cleaning","has cleaned"],"مجهولُ الماضي التامّ: had been + p.p."),
S("pass","More examples should ___ in the next edition.",["be included","include","included","being included"],"بعد الفعل الناقص: modal + be + p.p."),
S("pass","This rule is often ___ by beginners.",["misunderstood","misunderstand","misunderstanding","misunderstands"],"‏is + p.p. ⇐ التصريف الثالث."),
S("pass","Our messages ___ as soon as possible yesterday.",["were answered","answered","are answered","have been answered"],"‏yesterday ماضٍ منتهٍ ⇐ were + p.p."),
S("pass","The project ___ by three editors over the last month.",["has been reviewed","reviewed","was reviewing","has reviewed"],"‏over the last month مدّةٌ متّصلة ⇐ has been + p.p."),
S("pass","The invitation must ___ before Friday.",["be sent","send","to send","being sent"],"‏must + be + p.p."),
S("pass","Arabic notes ___ to simplify difficult points.",["are added","add","are adding","added"],"حقيقةٌ متكرّرة بالمجهول ⇐ are + p.p."),
S("pass","The old files ___ after the update last week.",["were deleted","deleted","have delete","are deleting"],"‏last week ⇐ were + p.p."),
S("pass","By the time we logged in, the session ___ by the teacher.",["had been started","had started","has been started","was starting"],"‏by the teacher تُوجِب المجهول، وسبقُ الحدث يُوجِب الماضي التامّ."),
S("pass","A free sample ___ to new students every month.",["is given","gives","has giving","gave"],"‏every month عادةٌ متكرّرة بالمجهول ⇐ is + p.p."),
S("pass","The quiz cannot ___ after submission.",["be changed","change","changed","be changing"],"‏cannot + be + p.p."),
S("pass","Several grammar banks ___ recently on the website.",["have been uploaded","uploaded","are uploading","have uploaded"],"‏recently مع أثرٍ باقٍ ⇐ have been + p.p."),
S("pass","The lesson was interesting because real examples ___.",["were used","used","had using","have used"],"الفاعلُ مجهولٌ والمفعولُ هو المسنَد إليه ⇐ were used."),
S("pass","The registration link ___ at the bottom of each page.",["is placed","places","placing","has place"],"وصفُ حالٍ ثابتة بالمجهول ⇐ is + p.p."),
S("pass","The students ___ to bring their phones into the hall.",["are not allowed","do not allow","were not allowing","not allowed"],"‏be allowed to + مصدر؛ والطلّاب مفعولٌ لا فاعل.")
);

/* ═══ ١٤) الحروف الكبيرة وعلامات الترقيم — Capitalization / Punctuation ═══ */
B.push(
S("punct","Choose the correctly written sentence.",["I met Mr. Ahmed in Jeddah on Monday.","i met mr. Ahmed in jeddah on monday.","I met mr Ahmed in Jeddah on monday.","I met Mr ahmed in Jeddah on Monday."],"‏I والأسماءُ والمدنُ وأيّامُ الأسبوع بحرفٍ كبير، و‏.Mr بنقطة."),
S("punct","Choose the sentence with correct capitalization and punctuation.",["My sister, who lives in Riyadh, teaches English.","my sister, who lives in Riyadh teaches english.","My sister who lives in Riyadh teaches english.","my sister who lives in riyadh, teaches English."],"الجملةُ الوصفيّةُ غيرُ المحدِّدة بين فاصلتين، و‏English لغةٌ بحرفٍ كبير."),
S("punct","Choose the correctly punctuated question.",["Where did you buy the book?","Where did you buy the book.","where did you buy the book?","Where did you buy the book,"],"السؤالُ المباشر يبدأ بحرفٍ كبير وينتهي بعلامةِ استفهام."),
S("punct","Choose the sentence with the correct apostrophe.",["The teacher's advice was helpful.","The teachers advice was helpful.","The teacher advice's was helpful.","The teachers's advice was helpful."],"ملكيّةُ المفرد: الاسم + 's."),
S("punct","Choose the correctly written sentence.",["In August, we visit Makkah every year.","In august we visit Makkah every year.","In August we visit makkah every year.","in August, we visit Makkah every year."],"أسماءُ الشهور والمدن بحرفٍ كبير، والعبارةُ الاستهلاليّة تُتبَع بفاصلة."),
S("punct","Choose the sentence with correct punctuation.",["The course includes grammar, reading, and listening.","The course includes, grammar reading and listening.","The course includes grammar reading and, listening.","The course includes grammar reading and listening"],"عناصرُ التعداد تُفصَل بفواصل، ولا فاصلةَ بعد الفعل."),
S("punct","Choose the correctly edited sentence.",["If you need help, contact the teacher.","If you need help contact the teacher.","if you need help, contact the teacher.","If you need help contact the teacher"],"جملةُ الشرط المتقدّمة تُتبَع بفاصلة، والبدايةُ بحرفٍ كبير."),
S("punct","Choose the sentence with correct capitalization.",["My favorite subject is English grammar.","My favorite subject is english grammar.","My Favorite subject is English Grammar.","my favorite subject is English grammar."],"أسماءُ اللغات بحرفٍ كبير، وأسماءُ المواد العامّة لا."),
S("punct","Choose the correctly punctuated sentence.",["Students often say, \"Articles are easy,\" but they still make mistakes.","Students often say articles are easy but they still make mistakes.","Students often say, articles are easy but they still make mistakes.","students often say \"Articles are easy\", but they still make mistakes"],"القولُ المباشر: فاصلةٌ قبل الاقتباس، وأوّلُه بحرفٍ كبير، والفاصلةُ داخل علامتي التنصيص."),
S("punct","Choose the correct sentence.",["The exam starts at 8:00 a.m. sharp.","The exam starts at 8:00 A.M sharp","the exam starts at 8:00 a.m sharp.","The exam starts at 8:00 a.m sharp"],"‏.a.m اختصارٌ بنقطتين، والجملةُ تبدأ بحرفٍ كبير وتنتهي بنقطة."),
S("punct","Choose the sentence with correct punctuation.",["After the mock, we reviewed every mistake.","After the mock we reviewed every mistake.","After the mock; we reviewed every mistake.","after the mock, we reviewed every mistake."],"العبارةُ الاستهلاليّة تُتبَع بفاصلةٍ لا بفاصلةٍ منقوطة."),
S("punct","Choose the correctly written sentence.",["It's a difficult rule, but you can master it.","Its a difficult rule, but you can master it.","Its' a difficult rule but you can master it.","It's a difficult rule but, you can master it."],"‏it's = it is؛ و‏its ملكيّة. وفاصلةٌ قبل but الرابطة لجملتين."),
S("punct","Choose the sentence with correct capitalization and punctuation.",["We studied nouns, verbs, and adjectives in class.","we studied nouns, verbs and adjectives in class.","We studied nouns verbs and adjectives in Class.","We studied nouns verbs, and adjectives in class"],"بدايةٌ بحرفٍ كبير وتعدادٌ مفصولٌ بفواصل، و‏class اسمٌ عامّ."),
S("punct","Choose the correct sentence.",["My brother asked, \"When is the lesson?\"",'my brother asked "When is the lesson"?','My brother asked "when is the lesson?"','My brother asked, "When is the lesson".'],"فاصلةٌ قبل الاقتباس، وأوّلُه بحرفٍ كبير، وعلامةُ الاستفهام داخل التنصيص."),
S("punct","Choose the correctly punctuated sentence.",["Ali, however, preferred to study alone.","Ali however preferred, to study alone.","Ali however, preferred to study alone","ali, however preferred to study alone."],"‏however معترضةٌ فتُحصَر بين فاصلتين."),
S("punct","Choose the sentence with correct possessive punctuation.",["The students' notebooks were collected.","The students notebooks' were collected.","The student's notebooks' were collected.","The students notebooks were collected."],"ملكيّةُ الجمع المنتهي بـ s: الفاصلةُ العليا بعد الـ s."),
S("punct","Choose the correct sentence.",["Because the hall was cold, many students wore jackets.","Because the hall was cold many students wore jackets.","because the hall was cold, many students wore jackets.","Because the hall was cold; many students wore jackets."],"الجملةُ التابعةُ المتقدّمة تُتبَع بفاصلة."),
S("punct","Choose the correctly written sentence.",["Our teacher is from Canada, and she teaches English.","our teacher is from canada, and she teaches English.","Our teacher is from Canada and she teaches english.","Our teacher is from canada and she teaches english."],"أسماءُ الدول واللغات بحرفٍ كبير، وفاصلةٌ قبل and الرابطة لجملتين."),
S("punct","Choose the sentence with correct punctuation.",["Please bring a pencil, an eraser, and your ID.","Please bring a pencil an eraser and your ID.","Please bring, a pencil, an eraser and your ID.","please bring a pencil, an eraser, and your ID"],"تعدادٌ من ثلاثةٍ يُفصَل بفواصل، ولا فاصلةَ بعد الفعل."),
S("punct","Choose the correctly edited sentence.",["In my opinion, this is the most useful chapter.","In my opinion this is the most useful chapter","in my opinion, this is the most useful chapter.","In my opinion; this is the most useful chapter."],"العبارةُ الاستهلاليّة تُتبَع بفاصلة، والجملةُ تبدأ بحرفٍ كبير.")
);

/* ═══ ١٥) ترتيب الجملة واكتشاف الخطأ — Word Order / Error ID ═══
   في الأصل كانت خيارات أسئلة «اكتشاف الخطأ» حروفًا (A/B/C/D) والجواب
   ‏B في تسعةٍ من عشرة. جعلنا الخيارات هي المقاطعَ نفسها، فصار الخلط
   نافعًا والانحيازُ زائلًا، والطالبُ يقرأ الخطأ لا يحفظ موضعه. */
B.push(
S("order","Choose the best word order: always / checks / before submitting / she / her answers",["She always checks her answers before submitting.","She checks always her answers before submitting.","Always she checks her answers before submitting.","She her answers always checks before submitting."],"ظرفُ التكرار يتقدّم الفعلَ الرئيس: she always checks."),
S("order","Choose the best word order: to the center / went / after Maghrib / we / yesterday",["We went to the center after Maghrib yesterday.","Went we to the center yesterday after Maghrib.","We after Maghrib went yesterday to the center.","Yesterday went we to the center after Maghrib."],"الترتيبُ الطبيعيّ: فاعل + فعل + مكان + زمان."),
S("order","Choose the best word order: has / this year / taken / three mock tests / he",["He has taken three mock tests this year.","Has he taken this year three mock tests.","He this year has taken three mock tests.","He has this year taken three mock tests."],"المساعدُ والفعلُ الرئيس لا يُفصَل بينهما بظرفِ زمان."),
S("order","Choose the best word order: in the library / quietly / were studying / the students",["The students were studying quietly in the library.","Were studying the students quietly in the library.","Quietly the students in the library were studying.","The students in the library quietly were studying."],"الترتيب: فاعل + فعل + حالٌ (كيف) + مكان."),
S("order","Choose the best word order: never / I / have / such / seen / a confusing item",["I have never seen such a confusing item.","Never I have seen such a confusing item.","I never have seen such a confusing item.","Seen I have never such a confusing item."],"‏never تأتي بعد المساعد وقبل الفعل الرئيس."),
S("order","Choose the best word order: a useful file / sent / last night / the coach / us",["The coach sent us a useful file last night.","Sent the coach us a useful file last night.","The coach us sent last night a useful file.","A useful file the coach sent us last night."],"المفعولُ غيرُ المباشر (us) يتقدّم المفعولَ المباشر بلا حرفِ جرّ."),
S("order","Choose the best word order: at the end of the lesson / asked / several questions / the students",["The students asked several questions at the end of the lesson.","Asked the students several questions at the end of the lesson.","Several questions the students asked at the end of the lesson.","The students several questions asked at the end of the lesson."],"الترتيبُ الخبريّ: فاعل + فعل + مفعول + ظرفُ زمان."),
S("order","Choose the best word order: read / the instructions / carefully / before you answer",["Read the instructions carefully before you answer.","Read carefully the instructions before you answer.","Carefully the instructions read before you answer.","The instructions read carefully before you answer."],"في الأمر: الفعلُ أوّلًا ثمّ المفعولُ ثمّ الحال — ولا يُفصَل الفعلُ عن مفعوله بالحال."),
S("order","Choose the best word order: usually / on Fridays / we / have / an extra workshop",["We usually have an extra workshop on Fridays.","Usually we have on Fridays an extra workshop.","We have usually an extra workshop on Fridays.","We an extra workshop usually have on Fridays."],"‏usually تتقدّم الفعلَ الرئيس have."),
S("order","Choose the best word order: has / recently / the website / uploaded / new samples",["The website has recently uploaded new samples.","Has the website recently uploaded new samples.","The website recently has uploaded new samples.","Uploaded the website has recently new samples."],"في الخبر: المساعد ثمّ الظرف ثمّ الفعلُ الرئيس."),
S("order","Identify the incorrect part: Neither of the answers / were / acceptable / to the examiner.",["were","Neither of the answers","acceptable","to the examiner"],"‏Neither of + جمع يُعامَل مفردًا ⇐ was لا were."),
S("order","Identify the incorrect part: She suggested / to review / the article rules / before bedtime.",["to review","She suggested","the article rules","before bedtime"],"بعد suggest نستخدم v-ing ⇐ suggested reviewing."),
S("order","Identify the incorrect part: The information / were / very useful / for beginners.",["were","The information","very useful","for beginners"],"‏information غيرُ معدودٍ يُعامَل مفردًا ⇐ was."),
S("order","Identify the incorrect part: If I will see / the teacher / tomorrow, / I will ask.",["If I will see","the teacher","tomorrow,","I will ask"],"لا نضع will بعد if في الشرط الأوّل ⇐ If I see."),
S("order","Identify the incorrect part: He is used to / solve / difficult items / quickly.",["solve","He is used to","difficult items","quickly"],"‏be used to + اسم أو v-ing ⇐ solving."),
S("order","Identify the incorrect part: This is / the most easiest / chapter / in the file.",["the most easiest","This is","chapter","in the file"],"لا نجمع most مع est ⇐ the easiest."),
S("order","Identify the incorrect part: The report / was publish / last week / online.",["was publish","The report","last week","online"],"المجهولُ يلزمه التصريفُ الثالث ⇐ was published."),
S("order","Identify the incorrect part: My brother / do not / like / timed mock tests.",["do not","My brother","like","timed mock tests"],"فاعلٌ مفردٌ غائب ⇐ does not."),
S("order","Identify the incorrect part: We arrived / in / the airport / at noon.",["in","We arrived","the airport","at noon"],"‏arrive at + مكانٌ محدّد ⇐ at the airport."),
S("order","Identify the incorrect part: There are / too much / mistakes / in this paragraph.",["too much","There are","mistakes","in this paragraph"],"‏mistakes جمعٌ معدود ⇐ too many.")
);

window.STEP_BANK = B;
})();
