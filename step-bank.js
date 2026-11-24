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
S("since","It took me weeks to get used to ___ under time pressure.",["working","work","to work","worked"],"التعوُّدُ على فعلٍ: get used to + v-ing."),
S("since","We have known each other ___ a very long time.",["for","since","by","until"],"‏for + مدّة (a long time)."),
S("since","Nora did not use to ___ online courses, but now she prefers them.",["like","liked","liking","to like"],"‏did not use to + المصدر المجرّد."),
S("since","Are you used to ___ English instructions all day?",["reading","read","to read","reads"],"التعوُّدُ حالةً مستقرّةً: be used to + v-ing."),
S("since","The center has offered support ___ many years.",["for","since","from","during"],"‏many years مدّة ⇐ for."),
S("since","I have wanted to improve my English ___ I saw my first score report.",["since","for","during","while"],"‏since قد تكون حرفَ جرٍّ أو رابطًا لجملةٍ تُحدِّد نقطةَ البداية."),
S("since","He used to ___ careless with articles, but now he checks every sentence.",["be","being","was","to be"],"‏used to + المصدر المجرّد: used to be."),
S("since","You will soon get used to ___ these grammar patterns.",["seeing","see","to see","saw"],"التعوُّدُ على فعلٍ: get used to + v-ing."),
S("since","I wasn't used to ___ so many difficult distractors in one test.",["facing","face","to face","faced"],"‏be used to + v-ing، والنفي لا يغيّر القاعدة."),
S("since","She has worked as a tutor ___ last summer.",["since","for","during","until"],"‏last summer نقطةُ بداية ⇐ since."),
S("since","We used to ___ paper dictionaries before apps became common.",["use","using","used","to use"],"‏used to + المصدر المجرّد."),
S("since","The students have practiced sentence order ___ weeks.",["for","since","during","from"],"‏weeks مدّةٌ غير محدّدةِ البداية ⇐ for."),
S("since","By the second mock, I was used to ___ the timer next to me.",["having","have","to have","had"],"التعوُّدُ حالةً مستقرّةً: be used to + v-ing.")
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
S("prep","I saw the answer key ___ a website last week.",["on","in","at","to"],"المواقعُ والشبكةُ تأخذ on: on a website / on the internet."),
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
S("pass","The invitation must ___ before Friday.",["be sent","send","to send","being sent"],"بعد الفعلِ الناقصِ يأتي المجهولُ بصيغةٍ واحدةٍ: must + be + p.p."),
S("pass","Arabic notes ___ to simplify difficult points.",["are added","add","are adding","added"],"حقيقةٌ متكرّرة بالمجهول ⇐ are + p.p."),
S("pass","The old files ___ after the update last week.",["were deleted","deleted","have delete","are deleting"],"زمنٌ ماضٍ معلومٌ مع جمعٍ: last week ⇐ were + p.p."),
S("pass","By the time we logged in, the session ___ by the teacher.",["had been started","had started","has been started","was starting"],"‏by the teacher تُوجِب المجهول، وسبقُ الحدث يُوجِب الماضي التامّ."),
S("pass","A free sample ___ to new students every month.",["is given","gives","has giving","gave"],"‏every month عادةٌ متكرّرة بالمجهول ⇐ is + p.p."),
S("pass","The quiz cannot ___ after submission.",["be changed","change","changed","be changing"],"بعد الناقصِ المنفيِّ: cannot + be + p.p."),
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


/* ══════════════════════════════════════════════════════════════════
   زيادةُ ٢٤ نوفمبر ٢٠٢٦ — أربعُ مئةٍ وخمسةُ بنودٍ، سبعةٌ وعشرون لكلِّ قاعدة
   ══════════════════════════════════════════════════════════════════
   قال الأب: «حسن عنده اختبارُ ستيبَ بعد أربعةِ أشهر». وعدّادُ العرضِ لم
   يوجد إلّا في ٢٠ نوفمبر، وفي صفوفِ حسنٍ جلسةٌ واحدةٌ تحمل مفاتيح —
   فكلُّ ما رآه قبلَ ذلك بلا ذاكرة: سحب ٩٥٣ سؤالًا من بنكٍ فيه ٣٩٨ على
   أربعةِ أشهرٍ بلا أيِّ حدّ. فنسبتُه الصاعدةُ فيها معرفةُ سؤالٍ رآه، لا
   معرفةُ قاعدةٍ — والدليلُ حاضرٌ: خمسون بالمئةٍ في «قواعدَ مركّزة» على
   نفسِ القواعدِ بأسئلةٍ من أخطائه هو.

   والحسابُ: مئةٌ وعشرون يومًا × أربعةِ أسئلةِ تراكيبَ في الورقةِ الموزونةِ
   = أربعُ مئةٍ وثمانون سحبةً، وبحدِّ العرضَين يلزم مئتان وأربعون بندًا
   جديدًا على الأقلّ. فهذي أربعُ مئةٍ وخمسةٌ — تكفي الأشهرَ الأربعةَ
   ويبقى فضلٌ، وتُغذّي جرعةَ فهدٍ أيضًا فبنوكُ قواعدِه الستِّ تتّسع.

   والزيادةُ متساويةٌ على القواعدِ الخمسَ عشرةَ لا مُثقَلةٌ على الضعيفِ منها:
   لأنّ GRAM_BANK_N يَعِد صفحاتِ التقريرِ بأنّ بنكَ كلِّ قاعدةٍ عددٌ واحدٌ
   («حلّيت كذا من كذا»)، وتوجيهُ الجهدِ إلى الضعيفِ موضعُه الجرعةُ التي
   تسحب من قواعدَ بعينِها — لا حجمُ البنك.
   ══════════════════════════════════════════════════════════════════ */

/* ═══ ١) أزمنة المضارع — Present Tenses (زيادة) ═══ */
B.push(
S("pres","The committee ___ every Monday to review new applications.",["meets","is meeting","has met","meet"],"عادةٌ متكرّرةٌ (every Monday) ⇐ المضارعُ البسيط، وcommittee مفردٌ ⇐ meets."),
S("pres","Listen! Someone ___ on the door downstairs.",["is knocking","knocks","has knocked","knock"],"‏!Listen تُنبِّه إلى ما يحدث الآن ⇐ المضارعُ المستمرّ."),
S("pres","I ___ three units already, so only two are left.",["have covered","covered","am covering","cover"],"‏already مع أثرٍ باقٍ في الحاضر ⇐ الحاضرُ التامّ."),
S("pres","How long ___ she ___ at this centre?",["has / worked","is / working","does / work","has / working"],"سؤالٌ عن مدّةٍ ما زالت ⇐ has worked."),
S("pres","The bus ___ from platform two at a quarter past seven.",["departs","is departing","has departed","depart"],"جدولٌ ثابتٌ ⇐ المضارعُ البسيط."),
S("pres","He ___ to understand relative clauses these days.",["is beginning","begins","has begun to be","begin"],"‏these days ترتيبٌ مؤقّتٌ جارٍ ⇐ المستمرّ."),
S("pres","I ___ what you mean, but the sentence is still unclear.",["see","am seeing","have seen it","sees"],"‏see بمعنى الفهمِ لا يأتي مستمرًّا ⇐ I see."),
S("pres","They ___ in the same building since the course started.",["have been living","live","are living","lived"],"‏since مع فعلٍ ما زال مستمرًّا ⇐ have been living."),
S("pres","The earth ___ around the sun once a year.",["travels","is travelling","has travelled","travel"],"حقيقةٌ علميّةٌ ⇐ المضارعُ البسيط."),
S("pres","She ___ never ___ a timed test before today.",["has / taken","is / taking","does / take","had / taking"],"‏never مع خبرةٍ حتى الآن ⇐ الحاضرُ التامّ."),
S("pres","Where ___ your cousin ___ at the moment?",["is / staying","does / stay","has / stayed","is / stay"],"‏at the moment ⇐ المضارعُ المستمرّ."),
S("pres","Ali ___ the gym twice a week, but this week he is resting.",["attends","is attending","has attended","attend"],"عادةٌ ⇐ البسيط، والاستثناءُ في الجملةِ الثانية."),
S("pres","I ___ this book for two weeks and I am only halfway through.",["have been reading","read","am reading","have read"],"مدّةٌ متّصلةٌ لم تنتهِ ⇐ الحاضرُ التامُّ المستمرّ."),
S("pres","That explanation ___ perfect sense to me now.",["makes","is making","has made","make"],"حالةٌ لا حدثٌ جارٍ ⇐ البسيط."),
S("pres","The students ___ their projects this week, so the lab is busy.",["are finishing","finish","have finished","finishes"],"‏this week مدّةٌ لم تنتهِ وعملٌ جارٍ ⇐ المستمرّ."),
S("pres","He ___ coffee; he prefers tea with his revision.",["does not drink","is not drinking","has not drunk","not drink"],"عادةٌ منفيّةٌ ⇐ does not drink."),
S("pres","We ___ each other since primary school.",["have known","know","are knowing","knew"],"‏since مع فعلِ حالةٍ ⇐ الحاضرُ التامّ."),
S("pres","Prices ___ sharply this year, according to the report.",["have risen","rise","are rising to","rose"],"‏this year مدّةٌ لم تنتهِ ونتيجةٌ ظاهرةٌ ⇐ الحاضرُ التامّ."),
S("pres","___ this bus ___ to the test centre?",["Does / go","Is / go","Has / gone","Do / go"],"سؤالٌ عن حقيقةٍ ثابتةٍ ⇐ does go."),
S("pres","I ___ of changing my study plan next month.",["am thinking","think","have thought of it","thinks"],"‏think of بمعنى التفكيرِ في نيّةٍ ⇐ المستمرّ."),
S("pres","The teacher ___ already ___ the marked papers back.",["has / given","is / gave","does / give","have / given"],"‏already ⇐ الحاضرُ التامّ، والفاعلُ مفردٌ ⇐ has."),
S("pres","My laptop ___ slowly whenever I open too many tabs.",["runs","is running","has run","run"],"عادةٌ متكرّرةٌ مع whenever ⇐ البسيط."),
S("pres","They ___ for the final exam for a month now.",["have been preparing","prepare","are preparing since","prepared"],"‏for a month now ⇐ الحاضرُ التامُّ المستمرّ."),
S("pres","This soup ___ too salty for me.",["tastes","is tasting","has tasted","taste"],"‏taste فعلُ إحساسٍ لا يأتي مستمرًّا هنا ⇐ tastes."),
S("pres","Our team ___ two matches so far this season.",["has won","wins","is winning","won"],"‏so far مع موسمٍ لم ينتهِ ⇐ الحاضرُ التامّ."),
S("pres","Be careful — the floor ___ still wet.",["is","has been being","does be","are"],"وصفُ حالٍ آنيّةٍ ⇐ is."),
S("pres","She ___ her notes every evening before she sleeps.",["reviews","is reviewing","has reviewed","review"],"عادةٌ يوميّةٌ ⇐ البسيط مع s.")
);

/* ═══ ٢) أزمنة الماضي — Past Tenses (زيادة) ═══ */
B.push(
S("past","He ___ the door quietly and left before anyone noticed.",["closed","was closing","had closed","has closed"],"فعلٌ منتهٍ في زمنٍ معلومٍ ⇐ الماضي البسيط."),
S("past","They ___ dinner when the power suddenly went out.",["were having","had","have had","had had"],"فعلٌ كان جاريًا قطعه غيرُه ⇐ الماضي المستمرّ."),
S("past","She told us that she ___ the book twice before.",["had read","read","was reading","has read"],"سابقٌ لحدثٍ ماضٍ (before) ⇐ الماضي التامّ."),
S("past","I ___ in Jeddah for three years before I moved to Riyadh.",["had lived","living","was living","have lived"],"مدّةٌ انتهت قبل حدثٍ ماضٍ ⇐ had lived."),
S("past","While she ___ for the bus, she revised the irregular verbs.",["was waiting","waits","had waited","has waited"],"‏while مع فعلٍ جارٍ في الماضي ⇐ was waiting."),
S("past","By the time the teacher came in, we ___ the first page.",["had finished","finished","were finishing","have finished"],"‏by the time + ماضٍ ⇒ ما سبقه بالماضي التامّ."),
S("past","He ___ for two hours when his friend finally called.",["had been studying","studied","was studying","has been studying"],"مدّةٌ متّصلةٌ سبقت لحظةً ماضيةً ⇐ had been studying."),
S("past","The sun ___ brightly when we reached the top of the hill.",["was shining","shines","had shone","has shone"],"وصفُ خلفيّةٍ جاريةٍ عند لحظةٍ ماضية ⇐ المستمرّ."),
S("past","Last night I ___ to review, but I fell asleep early.",["intended","was intending to","intending","have intended"],"نيّةٌ منتهيةٌ في زمنٍ معلوم ⇐ الماضي البسيط."),
S("past","Nobody ___ the announcement because the room was too noisy.",["heard","was hearing","had heard","has heard"],"‏hear فعلُ إدراكٍ لا يأتي مستمرًّا هنا ⇐ الماضي البسيط."),
S("past","She ___ her phone on the table and forgot it there.",["left","was leaving","had left","has left"],"حدثان متتاليان في الماضي ⇐ البسيطُ في الاثنَين."),
S("past","When I called, they ___ already ___ home.",["had / gone","have / gone","were / gone","did / go"],"سابقٌ لحدثٍ ماضٍ ومعه already ⇐ had gone."),
S("past","He didn't pass because he ___ the instructions at all.",["hadn't read","didn't read it","wasn't reading","hasn't read"],"سببٌ سبق النتيجةَ الماضيةَ ⇐ الماضي التامُّ منفيًّا."),
S("past","At this time last year, I ___ for the same test.",["was preparing","prepared","had prepared","have prepared"],"لحظةٌ محدّدةٌ في الماضي والفعلُ جارٍ فيها ⇐ المستمرّ."),
S("past","The road was wet because it ___ all morning.",["had been raining","rains","raining","has rained"],"مدّةٌ متّصلةٌ أثرُها ظاهرٌ في الماضي ⇐ had been raining."),
S("past","We ___ the match on TV when the referee stopped the game.",["were watching","watched","had watched","have watched"],"فعلٌ جارٍ قطعه حدثٌ ⇐ المستمرّ."),
S("past","After he ___ the form, he sent it by email.",["had completed","completed it","was completing","has completed"],"‏after + الماضي التامِّ لترتيبٍ صريح."),
S("past","I ___ her since we were children, so I trusted her advice.",["had known","knew","was knowing","have known"],"معرفةٌ سابقةٌ لموقفٍ ماضٍ ⇐ had known."),
S("past","The students ___ noisy until the teacher raised her hand.",["were","had been being","were being been","have been"],"وصفُ حالٍ ماضيةٍ ⇐ were."),
S("past","He ___ his keys yesterday, so he waited outside for an hour.",["lost","was losing","had lost it","has lost"],"حدثٌ منتهٍ بزمنٍ معلوم ⇐ الماضي البسيط."),
S("past","They ___ about the change, which is why they were surprised.",["had not been told","were not telling","have not been told","did not tell"],"مجهولٌ في الماضي التامِّ لسببٍ سابق ⇐ had not been told."),
S("past","Just as I ___ the last answer, the bell rang.",["was writing","wrote","had written","have written"],"‏just as مع فعلٍ جارٍ ⇐ المستمرّ."),
S("past","She ___ three cities before she settled in Dammam.",["had visited","visiting","was visiting","has visited"],"‏before + ماضٍ ⇒ ما قبله بالماضي التامّ."),
S("past","I didn't call you because I ___ you were busy.",["thought","was thinking","had thought","have thought"],"رأيٌ في لحظةٍ ماضيةٍ ⇐ الماضي البسيط."),
S("past","The two teams ___ for the final when the storm began.",["were preparing","prepared","had prepared","have prepared"],"فعلٌ جارٍ قطعه حدثٌ مفاجئ ⇐ المستمرّ."),
S("past","He admitted that he ___ the question before answering.",["had not understood","did not understand it","was not understanding","has not understood"],"سابقٌ للإقرارِ الماضي ⇐ الماضي التامّ."),
S("past","We ___ at the airport at six and left at seven.",["arrived","were arriving","had arrived","have arrived"],"حدثان بزمنَين معلومَين ⇐ الماضي البسيط.")
);

/* ═══ ٣) for / since وused to — For / Since / Used to (زيادة) ═══ */
B.push(
S("since","The shop has been closed ___ the beginning of Ramadan.",["since","for","from since","during"],"‏since + نقطةُ بداية."),
S("since","They waited at the gate ___ about twenty minutes.",["for","since","from","during for"],"‏for + مدّة."),
S("since","I ___ live near the sea, but we moved inland last year.",["used to","use to","am used to","was used to"],"عادةٌ ماضيةٌ انقطعت ⇐ used to + مصدر."),
S("since","She is not used to ___ so early on weekends.",["getting up","get up","got up","gets up"],"التعوُّدُ حالةً مستقرّةً: be used to + v-ing."),
S("since","Nothing has changed here ___ my last visit.",["since","for","from","while"],"‏since + حدثٌ نقطةُ بداية."),
S("since","Did you ___ play football when you were at school?",["use to","used to","be used to","using to"],"في السؤالِ والنفيِ تُجرَّد: did you use to."),
S("since","He has been a volunteer ___ over a decade.",["for","since","from","along"],"‏for + مدّةٌ (over a decade)."),
S("since","It took her a month to get used to ___ in a new city.",["living","live","lived","lives"],"التعوُّدُ على فعلٍ: get used to + v-ing."),
S("since","We have not spoken ___ the day of the interview.",["since","for","from","after since"],"‏since + يومٌ بعينِه."),
S("since","My uncle used to ___ a small bookshop downtown.",["own","owned","owning","owns"],"‏used to + مصدرٌ مجرَّد."),
S("since","They have been friends ___ ages.",["for","since","from","by"],"‏for + مدّةٌ غيرُ محدّدة (ages)."),
S("since","I am slowly getting used to ___ the keyboard without looking.",["using","use","used","uses"],"التعوُّدُ الجاري: getting used to + v-ing."),
S("since","How long is it ___ you last took a full mock?",["since","for","from","that since"],"‏It is ... since + ماضٍ بسيط."),
S("since","There ___ be a bus stop right here, but they removed it.",["used to","use to","is used to","was using to"],"‏there used to be للماضي المنقطع."),
S("since","The office has been under repair ___ three weeks now.",["for","since","from","along for"],"‏for + ثلاثةُ أسابيعَ مدّةٌ."),
S("since","She is used to ___, so the crowded bus does not bother her.",["city life","live in city","living city life in","to live city"],"‏be used to + اسمٍ ⇐ used to city life."),
S("since","I have not eaten anything ___ breakfast.",["since","for","from","during"],"‏since + وجبةٌ نقطةُ بداية."),
S("since","She didn't use to ___ grammar, but now she enjoys it.",["enjoy","enjoys","enjoyed","enjoying"],"بعد didn't use to مصدرٌ مجرَّد."),
S("since","We have lived in this flat ___ almost ten years.",["for","since","from","within"],"‏for + عشرُ سنواتٍ مدّةٌ."),
S("since","Are you getting used to ___ with a timer?",["working","work","worked","works"],"التعوُّدُ على فعلٍ: get used to + v-ing."),
S("since","The results have been available ___ last Thursday.",["since","for","from","by"],"‏since + يومٌ معيَّن."),
S("since","My father used to ___ us to school every morning.",["drive","drove","driving","drives"],"‏used to + مصدرٌ مجرَّد."),
S("since","I have been revising these two rules ___ hours.",["for","since","from","over since"],"‏for + ساعاتٌ مدّةٌ."),
S("since","He soon got used to ___ in English during meetings.",["speaking","speak","spoke","speaks"],"التعوُّدُ في الماضي: got used to + v-ing."),
S("since","It has rained every day ___ we arrived.",["since","for","from","while"],"‏since + جملةٌ ماضيةٌ نقطةُ بداية."),
S("since","Nurses are used to ___ and long night shifts.",["pressure","pressured","be pressure","pressuring them"],"‏be used to + اسمٍ ⇐ used to pressure."),
S("since","We used to ___ handwritten notes before we bought tablets.",["keep","kept","keeping","keeps"],"‏used to + مصدرٌ مجرَّد.")
);

/* ═══ ٤) روابط الزمن — Time Connectors (زيادة) ═══ */
B.push(
S("time","___ you arrive at the centre, send me a short message.",["As soon as","While","Until","Since"],"‏as soon as = فورَ أن، ويناسب حدثًا لحظيًّا."),
S("time","He kept reading ___ his eyes started to hurt.",["until","while","before","as soon as"],"‏until = إلى أن."),
S("time","___ the examiner collects the papers, no one may write.",["Once","During","Until","Since"],"‏once = متى ما، لحدثٍ يُنهي ما قبله."),
S("time","We revised the whole unit ___ the holiday.",["during","while","until","as"],"‏during + اسمٌ، وwhile + جملةٌ."),
S("time","___ she was reading, her brother was solving maths.",["While","Until","Before","Once"],"فعلان جاريان في وقتٍ واحدٍ ⇐ while."),
S("time","Do not open the booklet ___ you are told to.",["until","while","once","as soon as"],"نهيٌ إلى أن يُؤذَن ⇐ until."),
S("time","___ finishing the first section, check your name on the sheet.",["Before","Until","While","Since"],"‏before + v-ing تصحّ، وuntil لا تُتبَع بـv-ing هكذا."),
S("time","He had left ___ we got to the hall.",["by the time","until","while","as soon as"],"‏by the time + ماضٍ ⇒ ما قبله ماضٍ تامّ."),
S("time","___ the bell rings, stop writing immediately.",["The moment","Until","While","Since"],"‏the moment = اللحظةَ التي، مثلُ as soon as."),
S("time","I will wait here ___ you come back.",["until","while","before","once"],"انتظارٌ ممتدٌّ إلى حدثٍ ⇐ until."),
S("time","___ he had checked his answers, he raised his hand.",["After","Until","While","As soon"],"‏after + الماضي التامِّ لترتيبٍ صريح."),
S("time","She listens to podcasts ___ driving to work.",["while","during","until","since"],"‏while + v-ing تصحّ للفعلِ المصاحب."),
S("time","___ I opened the file, the application crashed.",["The instant","Until","While","During"],"‏the instant = في اللحظةِ التي، لحدثٍ لحظيّ."),
S("time","Keep the receipt ___ the results are announced.",["until","while","once","as"],"حفظٌ ممتدٌّ إلى موعدٍ ⇐ until."),
S("time","___ we were discussing the answer, the teacher wrote the rule.",["While","Until","Once","Before"],"فعلان جاريان ⇐ while."),
S("time","He always checks the spelling ___ he submits anything.",["before","until","while","since"],"ترتيبٌ ثابتٌ ⇐ before."),
S("time","___ the lesson ended, half the class had already left.",["By the time","Until","While","As soon"],"‏by the time + ماضٍ ⇒ ما قبله ماضٍ تامّ."),
S("time","We will start ___ everyone is seated.",["once","until","while","during"],"‏once = متى ما تمَّ الشرط."),
S("time","___ the storm, all outdoor classes were cancelled.",["During","While","Until","Once"],"‏during + اسمٌ (the storm)."),
S("time","Stay in your seat ___ the supervisor finishes counting.",["until","once","before","during"],"بقاءٌ إلى أن ينتهي ⇐ until."),
S("time","___ she had submitted the answer, she noticed the trap.",["Just after","Until","While","During"],"‏just after + ماضٍ تامٍّ لترتيبٍ قريب."),
S("time","He reads the question twice ___ choosing an option.",["before","until","while","since"],"‏before تُتبَع بالمصدرِ الصريح: before + v-ing."),
S("time","___ you have finished, put your pencil down.",["Once","Until","While","During"],"‏once + حاضرٍ تامٍّ لحدثٍ منجَز."),
S("time","They talked quietly ___ the examiner was away.",["while","until","before","during"],"مدّةٌ مصاحبةٌ ⇐ while."),
S("time","I did not understand the rule ___ I saw the example.",["until","while","during","once"],"‏not ... until = لم أفهم إلّا حين."),
S("time","___ the first week of the course, we only revised basics.",["In","While","Until","Once"],"‏in + مدّةٌ زمنيّةٌ معرَّفةٌ (in the first week)."),
S("time","Check the time ___ you start the last section.",["as soon as","during","until","while"],"‏as soon as لحدثٍ متّصلٍ بالبداية.")
);

/* ═══ ٥) الجمل الشرطية — If Conditions (زيادة) ═══ */
B.push(
S("cond","Unless you ___ the directions carefully, you may lose easy marks.",["read","will read","would read","had read"],"‏unless = if not، وبعدها مضارعٌ لا will ⇐ unless you read."),
S("cond","___ I known about the deadline, I would have applied last week.",["Had","If","Have","Would"],"قلبُ الشرطِ الثالث: يُحذَف if ويُقدَّم had ⇐ Had I known."),
S("cond","___ you to ask the teacher, she would explain the rule twice.",["Were","Was","If","Are"],"قلبُ الشرطِ الثاني بصيغةِ were to ⇐ Were you to ask."),
S("cond","We will begin on time provided that everyone ___ before eight.",["arrives","will arrive","arrived","would arrive"],"‏provided that شرطٌ واقعيٌّ ⇐ مضارعٌ بسيط، ومع everyone نضيف s."),
S("cond","Take an umbrella in case it ___ on the way back.",["rains","will rain","would rain","rained"],"‏in case يتبعها مضارعٌ لاحتمالٍ مستقبليّ ⇐ in case it rains."),
S("cond","If you had told me yesterday, I ___ waiting outside now.",["would not be","will not be","would not have been","am not"],"شرطٌ ماضٍ ونتيجةٌ حاضرةٌ (مختلط) ⇐ would not be."),
S("cond","If she ___ the key with her, we would have opened the door yesterday.",["had brought","brought","would bring","has brought"],"نتيجةٌ would have + p.p. ⇒ الشرطُ had + p.p. ⇐ had brought."),
S("cond","I would have answered faster if the font ___ clearer.",["had been","was","would be","is"],"الشرطُ الثالثُ يلزمه had been لا was."),
S("cond","Unless the weather ___, the trip will continue as planned.",["worsens","will worsen","worsened","would worsen"],"‏unless + مضارعٌ بسيط، ومع المفردِ s ⇐ unless the weather worsens."),
S("cond","If the two choices ___ the same meaning, pick the shorter one.",["have","will have","had","would have"],"الشرطُ الأوّلُ (نصيحةٌ واقعيّة): if + مضارع."),
S("cond","___ he not been absent, he would have heard the explanation himself.",["Had","If","Was","Did"],"قلبُ الشرطِ الثالثِ بالنفي ⇐ Had he not been."),
S("cond","She would be more confident today if she ___ more practice last term.",["had done","did","would do","does"],"شرطٌ ماضٍ ونتيجةٌ حاضرةٌ (مختلط) ⇐ had done."),
S("cond","If I ___ you, I would not skip the listening section.",["were","am","will be","had been"],"الشرطُ الثاني للنصيحة: if I were."),
S("cond","You can borrow my notes as long as you ___ them tomorrow.",["return","will return","returned","would return"],"‏as long as شرطٌ واقعيٌّ ⇐ مضارعٌ بسيط."),
S("cond","If a sentence starts with a time clause, you ___ a comma after it.",["put","will have put","would put","had put"],"حقيقةٌ ثابتةٌ (الشرطُ الصفريّ): if + مضارع، مضارع."),
S("cond","If anyone ___ after the bell, the door will already be closed.",["arrives","arrive","will arrive","arrived"],"‏anyone مفردٌ ⇐ arrives، والشرطُ الأوّلُ بلا will بعد if."),
S("cond","If they ___ the budget in time, the project would not have stopped.",["had increased","increased","would increase","have increased"],"ماضٍ فائتٌ لم يحدث ⇐ الشرطُ الثالث: had increased."),
S("cond","Ice ___ if you leave it in the sun for an hour.",["melts","is melting","would melt","melted"],"حقيقةٌ علميّةٌ ⇒ الشرطُ الصفريُّ بمضارعَين."),
S("cond","If I had a car, I ___ you to the center every morning.",["would drive","will drive","would have driven","drove"],"الشرطُ الثاني: if + ماضٍ، would + مصدر."),
S("cond","He would not be so tired today if he ___ earlier last night.",["had slept","slept","would sleep","sleeps"],"شرطٌ ماضٍ ونتيجةٌ حاضرةٌ ⇐ had slept."),
S("cond","If you ___ not understand a question, read it again slowly.",["do","will","would","did"],"أمرٌ بعد شرطٍ واقعيّ ⇐ if you do not understand."),
S("cond","Review the rule tonight; ___ you will forget it by Monday.",["otherwise","unless","in case","provided"],"‏otherwise = وإلّا، وتُستعمَل بعد فاصلةٍ منقوطةٍ بجملةٍ تامّة."),
S("cond","If the printer ___ working, we would have finished the copies.",["had kept","kept","keeps","would keep"],"نتيجةٌ would have finished ⇒ شرطٌ had + p.p."),
S("cond","If I ___ the answer to this one, I would tell you right now.",["knew","know","had known","would know"],"فرضٌ مخالفٌ للحاضرِ ⇐ الشرطُ الثاني: knew."),
S("cond","Oil floats if you ___ it into a glass of water.",["pour","will pour","poured","would pour"],"حقيقةٌ ثابتةٌ ⇒ مضارعٌ في الطرفَين."),
S("cond","If she had not helped me, I ___ the deadline completely.",["would have missed","would miss","will miss","missed"],"شرطٌ ثالثٌ ونتيجتُه would have + p.p."),
S("cond","If you ___ practising every day, your score will stop improving.",["stop","will stop","stopped","would stop"],"الشرطُ الأوّل: if + مضارع، will في النتيجةِ وحدَها.")
);

/* ═══ ٦) جمل الوصل — Relative Clauses (زيادة) ═══ */
B.push(
S("rel","The woman ___ car was blocking the gate apologized at once.",["whose","who","which","that"],"ملكيّةٌ لعاقل ⇐ whose car."),
S("rel","The village ___ my grandfather was born is now a city.",["in which","which","that","where in"],"مكانٌ بعد حرفِ جرٍّ ⇐ in which = where."),
S("rel","He is the only candidate ___ answered every question.",["that","which","whose","what"],"بعد only نستعمل that لا who."),
S("rel","My laptop, ___ I bought last year, still works perfectly.",["which","that","what","whose"],"بين فاصلتَين لا تصحّ that ⇐ which."),
S("rel","The man to ___ I spoke was the head of the centre.",["whom","who","which","that"],"بعد حرفِ الجرِّ نستعمل whom لا who."),
S("rel","This is the best explanation ___ I have ever read.",["that","which","what","whom"],"بعد التفضيلِ (the best) نستعمل that."),
S("rel","The reason ___ he left early was never explained.",["why","which","where","whose"],"بعد reason نستعمل why."),
S("rel","Everything ___ you need is in the first chapter.",["that","what","which","who"],"بعد everything نستعمل that لا what."),
S("rel","The students, most of ___ were beginners, finished on time.",["whom","who","which","them"],"‏most of + whom للعاقلِ بعد فاصلة."),
S("rel","She works for a company ___ products are sold worldwide.",["whose","which","that","who"],"ملكيّةٌ لغيرِ العاقلِ أيضًا بـwhose."),
S("rel","The shelf on ___ I left the file has been moved.",["which","that","where","whom"],"بعد حرفِ الجرِّ نستعمل which لغيرِ العاقل."),
S("rel","Anything ___ helps you remember the rule is worth trying.",["that","what","which","who"],"بعد anything نستعمل that."),
S("rel","The year ___ the centre opened was 2014.",["when","which","where","whose"],"زمانٌ ⇐ when."),
S("rel","Riyadh, ___ is the capital, hosts the main test centre.",["which","that","where","what"],"اسمُ علمٍ بين فاصلتَين ⇐ which."),
S("rel","The teacher ___ class I joined last term retired recently.",["whose","who","whom","which"],"ملكيّةٌ ⇐ whose class."),
S("rel","He described the exact moment ___ he understood the difference.",["when","which","where","why"],"لحظةٌ زمنيّةٌ ⇐ when."),
S("rel","There is nothing ___ can replace daily practice.",["that","what","which","who"],"بعد nothing نستعمل that."),
S("rel","The applicants, all of ___ had passed, were interviewed again.",["whom","who","which","them"],"‏all of + whom للعاقلِ بعد فاصلة."),
S("rel","This is the shop ___ sells second-hand textbooks.",["that","who","whose","where"],"فاعلٌ لغيرِ العاقل ⇐ that."),
S("rel","The point ___ you raised in class deserves more time.",["that","what","whose","where"],"مفعولٌ لغيرِ العاقل ⇐ that أو which."),
S("rel","I met a man ___ brother studies at the same university.",["whose","who","whom","which"],"ملكيّةٌ ⇐ whose brother."),
S("rel","The method by ___ they measured the results was unusual.",["which","that","whom","what"],"بعد by نستعمل which لغيرِ العاقل."),
S("rel","Those ___ arrive late will sit at the back.",["who","which","whose","whom"],"‏those للعاقل فاعلًا ⇐ who."),
S("rel","The hall ___ we sat was far too cold.",["where","which","that","whose"],"مكانٌ بلا حرفِ جرٍّ ⇐ where."),
S("rel","She is the kind of person ___ never gives up.",["who","which","whose","whom"],"عاقلٌ فاعلٌ ⇐ who."),
S("rel","The file ___ pages were torn had to be reprinted.",["whose","which","that","who"],"ملكيّةٌ لغيرِ العاقل ⇐ whose pages."),
S("rel","All ___ glitters is not gold.",["that","what","which","who"],"بعد all نستعمل that لا what.")
);

/* ═══ ٧) الضمائر — Pronouns (زيادة) ═══ */
B.push(
S("pron","My cousin and ___ joined the same group.",["I","me","myself","mine"],"فاعلٌ معطوفٌ ⇐ ضميرُ الفاعل: I."),
S("pron","The teacher gave the sheets to Omar and ___.",["me","I","myself","mine"],"بعد حرفِ الجرِّ to نضع ضميرَ المفعول: me."),
S("pron","Each of the boys answered ___ own paper.",["his","their","its","theirs"],"‏each of + جمعٍ يُعامَل مفردًا ⇐ his."),
S("pron","Neither of the sisters remembered ___ password.",["her","their","its","hers"],"‏neither of مفردٌ، والمقصودُ مؤنّثٌ ⇐ her."),
S("pron","The committee published ___ final decision yesterday.",["its","their","it's","theirs"],"‏committee ككيانٍ واحدٍ ⇐ its، وit's = it is."),
S("pron","He hurt ___ while moving the heavy boxes.",["himself","him","his","he"],"الفاعلُ والمفعولُ واحدٌ ⇐ الانعكاسيّ."),
S("pron","They finished the work by ___ without any help.",["themselves","them","their","theirs"],"‏by + الانعكاسيِّ = بأنفسِهم."),
S("pron","Is this pen yours or ___?",["mine","my","me","my one"],"ضميرُ ملكيّةٍ مستقلٌّ لا يتبعه اسمٌ ⇐ mine."),
S("pron","Somebody left ___ bag under the chair.",["their","his or her own self","its","theirs"],"‏somebody يُشار إليه بـtheir في الاستعمالِ المعاصر."),
S("pron","The two answers look alike, but ___ is correct.",["neither","none","either of them not","both"],"‏neither = لا هذا ولا ذاك، وتُستعمَل مع اثنَين."),
S("pron","We helped ___ during the group revision.",["one another","ourself","each other's","themselves"],"‏one another للتبادلِ بين أكثرَ من اثنَين."),
S("pron","___ of the three files opened on my laptop.",["None","Neither","No one","Either"],"‏none للثلاثةِ وأكثر، وneither للاثنَين."),
S("pron","She did the whole project ___.",["herself","her","hers","she"],"توكيدٌ بالانعكاسيّ ⇐ herself."),
S("pron","The dog wagged ___ tail when it saw us.",["its","it's","his","their"],"ملكيّةُ غيرِ العاقلِ ⇐ its."),
S("pron","Both of the teachers brought ___ laptops.",["their","his","its","theirs"],"‏both جمعٌ ⇐ their."),
S("pron","My sister is taller than ___ am.",["I","me","myself","mine"],"قبل الفعلِ am يلزم ضميرُ الفاعلِ ⇐ than I am."),
S("pron","This is a matter between her and ___.",["me","I","myself","mine"],"بعد between ضميرُ المفعولِ ⇐ me."),
S("pron","Everybody has ___ own way of revising.",["their","its","his or hers","theirs"],"‏everybody + their own في الاستعمالِ المعاصر."),
S("pron","The blue markers are hers and the red ___ are mine.",["ones","one","things","them"],"‏ones تنوب عن جمعٍ مذكورٍ قبلَها."),
S("pron","Ali and Saud reminded ___ of the deadline.",["each other","themselves each","one another's","theirs"],"‏each other للتبادلِ بين اثنَين."),
S("pron","I could not find my book, so I borrowed ___.",["hers","her","her's","she"],"ضميرُ ملكيّةٍ مستقلٌّ ⇐ hers بلا فاصلةٍ عُليا."),
S("pron","Few of the students brought ___ calculators.",["their","his","its","theirs"],"‏few جمعٌ ⇐ their."),
S("pron","The problem solved ___ after the update.",["itself","its","it","himself"],"الانعكاسيُّ لغيرِ العاقل ⇐ itself."),
S("pron","Who is at the door? It is only ___.",["me","I myself am","mine","my"],"في الكلامِ المعتادِ نقول It is me."),
S("pron","Her explanation was clearer than ___.",["his","him","he","his one"],"المقارنةُ بضميرِ ملكيّةٍ مستقلٍّ ⇐ his."),
S("pron","All of the equipment was in ___ place.",["its","their","it's","theirs"],"‏equipment غيرُ معدودٍ يُعامَل مفردًا ⇐ its."),
S("pron","Let us keep this news to ___.",["ourselves","us","our","ourself"],"‏keep to + الانعكاسيّ، وجمعُه ourselves.")
);

/* ═══ ٨) المعدود وغير المعدود — Countable / Uncountable (زيادة) ═══ */
B.push(
S("count","The manager asked for ___ on the new design before Friday.",["feedback","a feedback","feedbacks","some feedbacks"],"‏feedback غيرُ معدودٍ: لا a ولا جمع."),
S("count","We bought new ___ for the science laboratory last month.",["equipment","equipments","an equipment","many equipment"],"‏equipment غيرُ معدودٍ دائمًا ⇐ new equipment."),
S("count","He gave us ___ about choosing the right preposition.",["a useful tip","a useful advice","an advice","some advices"],"‏advice غيرُ معدود؛ والمعدودُ المقابلُ له tip ⇐ a useful tip."),
S("count","There is ___ evidence that short daily sessions work better.",["little","few","a few","many"],"‏evidence غيرُ معدودٍ ⇐ little لا few."),
S("count","How ___ luggage are you taking on the trip?",["much","many","few","several"],"‏luggage غيرُ معدودٍ ⇐ how much."),
S("count","She packed ___ of clothes for the whole week.",["plenty","a plenty","many","much"],"‏plenty of تصلح للمعدودِ وغيرِه، ولا تُسبَق بـa."),
S("count","The teacher wrote ___ on the board before the lesson.",["a few words","a few word","few words only","little words"],"‏words جمعٌ معدود ⇐ a few words."),
S("count","We did not have ___ to finish the last paragraph.",["enough time","enough times","many time","a time"],"‏time هنا مدّةٌ غيرُ معدودة ⇐ enough time."),
S("count","___ of the furniture in the new office was imported.",["Most","Many","A few","Several"],"‏furniture غيرُ معدودٍ ⇐ most of the furniture."),
S("count","I need ___ of milk for this recipe.",["a litre","a litres","litre","many litre"],"غيرُ المعدودِ يُعَدُّ بوحدةٍ ⇐ a litre of milk."),
S("count","There were ___ chairs than we expected in the hall.",["fewer","less","little","much less"],"‏chairs معدودٌ ⇐ fewer لا less."),
S("count","The passage contains ___ difficult vocabulary.",["a lot of","a lot","many of","a number of"],"‏vocabulary غيرُ معدودٍ ⇐ a lot of، وa number of للمعدودِ وحدَه."),
S("count","He showed ___ patience with the beginners.",["great","a great","many","a lot"],"‏patience غيرُ معدودٍ يُوصَف بـgreat بلا a."),
S("count","___ students were able to answer the last question.",["Only a few","Only a little","Only few of","Much"],"‏students معدودٌ ⇐ a few، وonly a few صيغةٌ مألوفة."),
S("count","Could you give me ___ of paper, please?",["a sheet","a paper","some papers","sheet"],"الورقُ غيرُ معدودٍ ويُعَدُّ بـa sheet of paper."),
S("count","There is not ___ room left in the suitcase.",["much","many","a few","several"],"‏room بمعنى المتّسعِ غيرُ معدودٍ ⇐ not much room."),
S("count","The report included ___ about last year's results.",["some data","some datas","a data","many data pieces"],"‏data تُعامَل غيرَ معدودٍ في الاستعمالِ العامّ ⇐ some data."),
S("count","We received ___ complaints about the new schedule.",["several","much","a great deal of","a little"],"‏complaints جمعٌ معدود ⇐ several."),
S("count","How ___ progress have you made this week?",["much","many","few","several"],"‏progress غيرُ معدودٍ ⇐ how much progress."),
S("count","She bought two ___ of bread on the way home.",["loaves","breads","loaf","bread"],"الخبزُ غيرُ معدودٍ ويُعَدُّ بـloaves of bread."),
S("count","There was ___ traffic on the ring road this morning.",["heavy","a heavy","many","several"],"‏traffic غيرُ معدودٍ ⇐ heavy traffic بلا a."),
S("count","The course does not require ___ previous knowledge.",["much","many","a few","several"],"‏knowledge غيرُ معدودٍ ⇐ not much knowledge."),
S("count","He has read ___ of the articles on the reading list.",["most","almost","the most all","much"],"‏most of + the + جمعٍ معدود."),
S("count","They offered us ___ on how to organize the paragraph.",["some guidance","some guidances","a guidance","many guidance"],"‏guidance غيرُ معدود: لا a ولا جمع."),
S("count","___ of the chairs in the second row were broken.",["Two","Much","A great deal","A little"],"‏chairs معدودٌ ⇒ يُعَدُّ بعددٍ لا بألفاظِ غيرِ المعدود."),
S("count","We wasted ___ money on books we never opened.",["a lot of","a lot","many","a number of"],"‏money غيرُ معدودٍ ⇐ a lot of money."),
S("count","The box contained ___ of different sizes.",["scissors","a scissors","scissor","many scissor"],"‏scissors جمعٌ دائمٌ لا مفردَ له في الاستعمال.")
);

/* ═══ ٩) المقارنة والتفضيل — Comparative / Superlative (زيادة) ═══ */
B.push(
S("comp","This chair is ___ comfortable as the one in the library.",["as","so","more","than"],"‏as ... as تلزمها الصفةُ المجرّدةُ بين asين."),
S("comp","He runs ___ than his younger brother.",["faster","more fast","fastest","more faster"],"صفةٌ قصيرةٌ ⇐ er، ولا نجمعها مع more."),
S("comp","That was the ___ interesting part of the whole lecture.",["least","less","fewer","lesser"],"‏the least للتفضيلِ الأدنى."),
S("comp","Reading twice is ___ safer than guessing once.",["far","very","too","so"],"‏far تُقوّي صيغةَ المقارنةِ، وvery لا تصحّ معها."),
S("comp","She is ___ of the three sisters.",["the tallest","taller","the taller","more tall"],"ثلاثةٌ وأكثرُ ⇐ التفضيل: the tallest."),
S("comp","The sooner you begin, the ___ you will finish.",["earlier","early","earliest","more early"],"صيغةُ التناسب: the + مقارنة ... the + مقارنة."),
S("comp","This method is not ___ as I expected.",["as simple","simpler","so simpler","more simple"],"‏not as + صفةٌ مجرّدةٌ + as."),
S("comp","My handwriting is ___ worse than my brother's.",["much","very","too","more"],"‏much تُقوّي المقارنةَ، وvery لا تصحّ مع worse."),
S("comp","Of all the mistakes, this one is the ___ to notice.",["hardest","harder","most hard","more hard"],"صفةٌ قصيرةٌ ⇐ est."),
S("comp","He speaks English ___ fluently than he writes it.",["more","most","much","very"],"الظرفُ الطويلُ يأخذ more."),
S("comp","This bag is twice ___ expensive as that one.",["as","more","so","than"],"‏twice as + صفةٌ + as."),
S("comp","Which of the two answers is ___?",["the better","the best","better best","more good"],"بين اثنَين نستعمل the better."),
S("comp","Nothing is ___ than reading the question carefully.",["more important","most important","importanter","the most important"],"بعد nothing نستعمل صيغةَ المقارنةِ مع than."),
S("comp","The second test was ___ difficult as the first.",["just as","just more","just so","just than"],"‏just as ... as للتعادل."),
S("comp","This is by far ___ explanation in the book.",["the clearest","clearer","the clearer","more clear"],"‏by far + تفضيلٌ معرَّف."),
S("comp","He is ___ experienced teacher I have ever met.",["the most","the more","most","more"],"‏the most + صفةٌ طويلةٌ للتفضيل."),
S("comp","Her score is higher than ___.",["mine","my","me","my one"],"المقارنةُ بضميرِ الملكيّةِ المستقلّ ⇐ mine."),
S("comp","The traffic today is worse than ___ yesterday.",["it was","it is","than was","it has"],"تُكمَل المقارنةُ بزمنِها ⇐ than it was yesterday."),
S("comp","This chapter is ___ shorter than the previous one.",["slightly","very","too","so"],"‏slightly تُلطِّف المقارنةَ، وvery لا تصحّ معها."),
S("comp","Of the four options, option B is ___ likely to be correct.",["the least","the less","less","the fewer"],"‏the least + صفةٌ للتفضيلِ الأدنى."),
S("comp","He arrived ___ than everyone else in the group.",["earlier","early","earliest","more early"],"صفةٌ تنتهي بـy ⇐ ier."),
S("comp","The more I revise, the ___ mistakes I make.",["fewer","less","fewest","least"],"‏mistakes معدودٌ ⇐ fewer."),
S("comp","This question is ___ the easiest in the section.",["probably","very","too","as"],"‏probably تُسبِق التفضيلَ، وvery لا تُقوّيه."),
S("comp","No answer was ___ clear as the first one.",["as","so clear","more","than"],"في النفيِ تصحّ as ... as."),
S("comp","Jeddah is one of the ___ cities in the Kingdom.",["largest","larger","most large","more large"],"‏one of the + تفضيلٍ + جمعٍ."),
S("comp","My new plan works ___ better than the old one.",["far","very","too","most"],"‏far better صيغةٌ مألوفةٌ لتقويةِ المقارنة."),
S("comp","The exam was less stressful ___ I had imagined.",["than","as","that","then"],"‏less ... than، وthen ظرفُ زمانٍ لا أداةُ مقارنة.")
);

/* ═══ ١٠) الفعل الثاني — Verb + to / ing / base (زيادة) ═══ */
B.push(
S("vform","She managed ___ the whole section in twelve minutes.",["to finish","finishing","finish","finished"],"‏manage + to + مصدر."),
S("vform","He denied ___ the answer from his neighbour.",["copying","to copy","copy","copied"],"الإنكارُ يُتبَع بالمصدرِ الصريح: deny + v-ing."),
S("vform","They let us ___ the hall five minutes early.",["leave","to leave","leaving","left"],"‏let + مفعولٌ + مصدرٌ مجرَّد."),
S("vform","I look forward to ___ the results next month.",["seeing","see","to see","saw"],"‏to هنا حرفُ جرٍّ لا أداةُ مصدرٍ: look forward to + v-ing."),
S("vform","We expect him ___ on time tomorrow.",["to arrive","arriving","arrive","arrived"],"‏expect + مفعولٌ + to + مصدر."),
S("vform","She admitted ___ the instructions too quickly.",["reading","to read","read","reads"],"الإقرارُ يُتبَع بالمصدرِ الصريح: admit + v-ing."),
S("vform","The rule is worth ___ twice before the exam.",["reviewing","to review","review","reviewed"],"ما يستحقُّ الفعلَ: be worth + v-ing."),
S("vform","He offered ___ me with the difficult items.",["to help","helping","help","helped"],"‏offer + to + مصدر."),
S("vform","Would you mind ___ the window open?",["leaving","to leave","leave","left"],"الاستئذانُ بـmind يُتبَع بالمصدرِ الصريح: mind + v-ing."),
S("vform","I cannot afford ___ time on one question.",["to waste","wasting","waste","wasted"],"‏afford + to + مصدر."),
S("vform","She is thinking of ___ for the next session.",["registering","register","to register","registered"],"بعد حرفِ الجرِّ of نضع v-ing."),
S("vform","Nothing can stop him from ___ hard.",["working","to work","work","worked"],"المنعُ من فعلٍ: stop somebody from + v-ing."),
S("vform","They warned us ___ the last page blank.",["not to leave","not leaving","no leave","not left"],"‏warn + مفعولٌ + not to + مصدر."),
S("vform","He insisted on ___ the fee himself.",["paying","to pay","pay","paid"],"بعد حرفِ الجرِّ on مصدرٌ صريحٌ: insist on + v-ing."),
S("vform","We were made ___ the test again.",["to take","take","taking","taken"],"‏make في المجهولِ تأخذ to: were made to take."),
S("vform","I would rather ___ in the morning than at night.",["study","to study","studying","studied"],"‏would rather + مصدرٌ مجرَّد."),
S("vform","She succeeded in ___ her score by ten points.",["raising","to raise","raise","raised"],"بعد حرفِ الجرِّ in مصدرٌ صريحٌ: succeed in + v-ing."),
S("vform","The teacher reminded me ___ the answer sheet.",["to sign","signing","sign","signed"],"‏remind + مفعولٌ + to + مصدر."),
S("vform","I regret ___ you that the session is full.",["to inform","informing you","inform","informed"],"‏regret to inform صيغةٌ رسميّةٌ للإبلاغِ الحاضر."),
S("vform","He regretted ___ the earlier deadline.",["missing","to miss","miss","missed"],"‏regret + v-ing للأسفِ على ما مضى."),
S("vform","It is no use ___ about the time now.",["complaining","to complain","complain","complained"],"لا جدوى من فعلٍ: it is no use + v-ing."),
S("vform","They encouraged her ___ for the scholarship.",["to apply","applying","apply","applied"],"‏encourage + مفعولٌ + to + مصدر."),
S("vform","I heard him ___ the rule out loud twice.",["repeat","to repeat","repeated","repeats"],"أفعالُ الحسِّ + مفعولٌ + مصدرٌ مجرَّدٌ للفعلِ التامّ."),
S("vform","She avoided ___ eye contact during the interview.",["making","to make","make","made"],"التجنُّبُ يُتبَع بالمصدرِ الصريح: avoid + v-ing."),
S("vform","We decided against ___ the trip this year.",["taking","to take","take","took"],"بعد against نضع v-ing."),
S("vform","He promised ___ me the file before midnight.",["to send","sending","send","sent"],"‏promise + to + مصدر."),
S("vform","There is no point in ___ the same mistake again.",["repeating","to repeat","repeat","repeated"],"لا فائدةَ في فعلٍ: no point in + v-ing.")
);

/* ═══ ١١) الأفعال الناقصة — Modal Auxiliaries (زيادة) ═══ */
B.push(
S("modal","You ___ worry about the last section; it is the easiest.",["need not","must not","cannot","may not"],"‏need not = لا لزومَ للقلق، وmust not نهيٌ لا يناسب المعنى."),
S("modal","The lights are off, so they ___ have gone home already.",["must","can","should not","need"],"استنتاجٌ شبهُ يقينيٍّ ⇐ must have + p.p."),
S("modal","He ___ have taken my notebook; he was not even here.",["cannot","must","should","may"],"استحالةٌ في الماضي ⇐ cannot have + p.p."),
S("modal","You ___ have checked the answer key before arguing.",["should","must","can","may"],"لومٌ على ما لم يُفعَل ⇐ should have + p.p."),
S("modal","Visitors ___ park in front of the gate at any time.",["may not","need not","do not have to","could not"],"نهيٌ رسميٌّ في اللافتات ⇐ may not."),
S("modal","I ___ swim when I was six, but I have forgotten how.",["could","can","may","must"],"قدرةٌ ماضيةٌ ⇐ could."),
S("modal","___ you mind closing the window, please?",["Would","Should","Must","May"],"طلبٌ مؤدَّبٌ ⇐ Would you mind + v-ing."),
S("modal","She ___ be at the library; she said she had a class now.",["cannot","must","should","will"],"استحالةٌ في الحاضرِ بناءً على دليل ⇐ cannot be."),
S("modal","We ___ submit the form by Sunday or we lose the place.",["have to","may","could","might"],"إلزامٌ من ظرفٍ خارجيٍّ ⇐ have to."),
S("modal","You ___ to bring your own calculator for this test.",["do not need","must not","cannot","may not"],"‏do not need to = لا لزوم، وتُتبَع بـto."),
S("modal","It ___ rain later, so take a jacket just in case.",["might","must","should","can"],"احتمالٌ غيرُ مؤكَّدٍ ⇐ might."),
S("modal","He ___ not have understood the instructions; he did the wrong page.",["may","should","did","does"],"احتمالٌ في الماضي ⇐ may not have + p.p."),
S("modal","Students ___ to wear the badge inside the building.",["are required","must","should","may"],"بعد required نضع to، وmust لا تُتبَع بـto."),
S("modal","___ I use your pen for a second?",["Could","Must","Would","Should"],"استئذانٌ مؤدَّبٌ ⇐ Could I."),
S("modal","You ___ not have paid; the entry was free, so your money was wasted.",["need","did","can","may"],"دفع فعلًا ولا لزومَ للدفع ⇐ need not have + p.p. وليست استنتاجًا بأنّه لم يدفع."),
S("modal","The road is closed, so we ___ take the long way.",["will have to","must not","need not","may not"],"إلزامٌ مستقبليٌّ ⇐ will have to."),
S("modal","That ___ be the answer, but I am not completely sure.",["could","must","cannot","should not"],"احتمالٌ ضعيفٌ ⇐ could be."),
S("modal","He ___ speak three languages fluently by the age of twelve.",["could","can","may","must"],"قدرةٌ في الماضي ⇐ could."),
S("modal","You ___ better write the date on every page.",["had","would","should","have"],"‏had better = من الأفضلِ لك، نصيحةٌ قويّة."),
S("modal","Passengers ___ remain seated until the plane stops.",["must","may","need","could"],"إلزامٌ في التعليماتِ الرسميّة ⇐ must."),
S("modal","She ___ have been studying all night; she looks exhausted.",["must","can","need","should not"],"استنتاجٌ عن فعلٍ ممتدٍّ في الماضي ⇐ must have been + v-ing."),
S("modal","___ we meet an hour earlier to go over the rules?",["Shall","Must","Need","Would"],"عرضٌ أو اقتراحٌ مع we ⇐ Shall we."),
S("modal","You ___ not tell anyone the questions; it is forbidden.",["must","need","do","would"],"تحريمٌ صريحٌ ⇐ must not."),
S("modal","He ___ pass if he keeps this pace.",["ought to","ought","must to","should to"],"‏ought to + مصدر، وهي قريبةٌ من should."),
S("modal","I ___ rather take the test in the morning.",["would","should","could","must"],"‏would rather + مصدرٌ مجرَّدٌ للتفضيل."),
S("modal","The file ___ be opened without the password — the system simply refuses.",["cannot","must not","need not","may not"],"القرينةُ تقول إنّ النظامَ يرفض، فهو عجزٌ تقنيٌّ لا نهيٌ ⇐ cannot be opened."),
S("modal","They left four hours ago, so they ___ have arrived by now; the trip takes two hours.",["should","must not","need","could not"],"أربعُ ساعاتٍ تكفي رحلةً ساعتَين، فالتوقُّعُ منطقيٌّ ⇐ should have + p.p.")
);

/* ═══ ١٢) حروف الجر وأدوات التعريف — Prepositions / Articles (زيادة) ═══ */
B.push(
S("prep","He has been absent ___ last Tuesday.",["since","from","at","on"],"‏since + نقطةُ بدايةٍ في الزمن."),
S("prep","She is good ___ explaining difficult rules.",["at","in","on","for"],"البراعةُ في شيءٍ بـat: good at + v-ing."),
S("prep","We depend ___ the schedule published on the site.",["on","of","in","at"],"الاعتمادُ على شيءٍ بـon: depend on."),
S("prep","I am interested ___ joining the evening group.",["in","on","at","for"],"الاهتمامُ بشيءٍ بـin: interested in + v-ing."),
S("prep","The answer is ___ page twelve.",["on","in","at","to"],"‏on page + رقم."),
S("prep","He walked ___ the hall without looking back.",["out of","out from","outside of the","from out"],"‏out of = من داخلِ شيءٍ إلى خارجِه."),
S("prep","She is afraid ___ making spelling mistakes.",["of","from","to","for"],"الخوفُ من شيءٍ بـof: afraid of + v-ing."),
S("prep","I congratulated him ___ his high score.",["on","for","about","with"],"التهنئةُ على شيءٍ بـon: congratulate somebody on something."),
S("prep","The file is similar ___ the one we used last term.",["to","with","as","like to"],"الشبهُ بشيءٍ بـto: similar to."),
S("prep","___ honest student would never copy an answer.",["An","A","The","(no article)"],"‏honest تبدأ بصوتٍ متحرّكٍ (الهاءُ لا تُنطَق) ⇐ an."),
S("prep","He is ___ university student in his final year.",["a","an","the","(no article)"],"‏university تبدأ بصوتِ yu الساكنِ ⇐ a."),
S("prep","We travelled to ___ United Arab Emirates last winter.",["the","a","an","(no article)"],"أسماءُ الدولِ المركّبةُ تأخذ the."),
S("prep","___ honesty is the best policy.",["(no article)","The","A","An"],"الاسمُ المعنويُّ العامُّ بلا أداةٍ ⇐ honesty."),
S("prep","She plays ___ piano beautifully.",["the","a","an","(no article)"],"آلاتُ الموسيقى تأخذ the."),
S("prep","He went to ___ hospital to visit his uncle.",["the","a","an","(no article)"],"هنا الزيارةُ لمكانٍ بعينِه ⇐ the hospital."),
S("prep","My brother is ___ best player on the team.",["the","a","an","(no article)"],"التفضيلُ يأخذ the."),
S("prep","They arrived ___ Riyadh late at night.",["in","at","to","on"],"‏arrive in + مدينةٌ، وarrive at + مكانٌ صغير."),
S("prep","I apologized ___ being late.",["for","of","to","about"],"الاعتذارُ عن شيءٍ بـfor: apologize for + v-ing."),
S("prep","This book belongs ___ the library, not to me.",["to","for","with","at"],"الملكيّةُ والانتسابُ بـto: belong to."),
S("prep","He succeeded ___ raising his grammar score.",["in","at","on","to"],"النجاحُ في شيءٍ بـin: succeed in."),
S("prep","We will discuss it ___ the end of the lesson.",["at","in","on","to"],"‏at the end of = عند نهايةِ شيء."),
S("prep","___ the end, everyone passed the course.",["In","At","On","To"],"‏in the end = أخيرًا، بعد تقلُّبٍ."),
S("prep","She is responsible ___ collecting the answer sheets.",["for","of","to","on"],"المسؤوليّةُ عن شيءٍ بـfor: responsible for + v-ing."),
S("prep","The meeting was postponed ___ next Sunday.",["until","for","since","from"],"‏postponed until + موعدٌ."),
S("prep","He is married ___ a teacher from Abha.",["to","with","of","for"],"الزواجُ بفلانٍ بـto لا with: married to."),
S("prep","Put your name ___ the top of the page.",["at","on","in","to"],"أعلى الشيءِ بـat: at the top of."),
S("prep","I prefer tea ___ coffee in the evening.",["to","than","over than","from"],"التفضيلُ بـto لا than: prefer A to B.")
);

/* ═══ ١٣) المبني للمجهول — Passive Voice (زيادة) ═══ */
B.push(
S("pass","The results ___ by the committee at the moment.",["are being reviewed","are reviewing","have reviewed","were reviewing"],"المجهولُ المستمرُّ الحاضر: is/are being + p.p."),
S("pass","This bridge ___ in 1998 by a local company.",["was built","was build","is built","has built"],"ماضٍ مجهولٌ: was + التصريفُ الثالث."),
S("pass","The parcel ___ to the wrong address yesterday.",["was delivered","delivered","is delivered","has delivering"],"ماضٍ مجهولٌ بزمنٍ معلوم."),
S("pass","All the questions ___ before the bell rang.",["had been answered","had answered","were answering","have answered"],"ماضٍ تامٌّ مجهولٌ: had been + p.p."),
S("pass","The new rule ___ from next semester.",["will be applied","will apply to be","is applying","will applied"],"مستقبلٌ مجهولٌ: will be + p.p."),
S("pass","The hall ___ twice a week by the cleaning team.",["is cleaned","cleans","is cleaning","has cleaned"],"مضارعٌ بسيطٌ مجهولٌ: is + p.p."),
S("pass","Nothing ___ about the delay so far.",["has been said","has said","is saying","was saying"],"حاضرٌ تامٌّ مجهولٌ: has been + p.p."),
S("pass","The documents must ___ before Thursday.",["be signed","signed","being signed","to be signed"],"بعد الناقصِ: modal + be + p.p."),
S("pass","He ___ a certificate at the end of the course.",["was given","was gave","gave","is giving"],"مجهولٌ بمفعولٍ غيرِ مباشرٍ ⇐ he was given."),
S("pass","The road ___ while we were waiting in the car.",["was being repaired","was repairing","is repaired","had repaired"],"المجهولُ المستمرُّ الماضي: was being + p.p."),
S("pass","English ___ as a second language in many schools here.",["is taught","teaches","is teaching","has taught"],"مضارعٌ مجهولٌ: is + p.p."),
S("pass","The announcement ___ yet, so we are still waiting.",["has not been made","has not made","is not making","did not made"],"‏yet مع الحاضرِ التامِّ المجهولِ المنفيّ."),
S("pass","These shoes ___ in Italy.",["were made","were make","made","are making"],"ماضٍ مجهولٌ ⇐ were made."),
S("pass","The samples ___ to the laboratory tomorrow morning.",["will be sent","will send","are sending","will sent"],"مستقبلٌ مجهولٌ: will be + p.p."),
S("pass","The window ___ by the strong wind last night.",["was broken","was break","broke by","is broken"],"ماضٍ مجهولٌ + by للفاعل."),
S("pass","Phones ___ to be switched off during the test.",["are required","require","are requiring","requires"],"مجهولٌ مع to + مصدرٍ ⇐ are required to be."),
S("pass","The office ___ since the manager travelled.",["has not been used","has not used","is not using","was not using"],"‏since مع الحاضرِ التامِّ المجهول."),
S("pass","This form should ___ in black ink only.",["be filled","fill","filled","being filled"],"بعد الناقصِ يأتي المجهولُ: should + be + p.p."),
S("pass","A second chance ___ to anyone who missed the session.",["is offered","offers","is offering","has offered"],"مضارعٌ مجهولٌ: is + p.p."),
S("pass","The old desks ___ away before the new ones arrived.",["had been taken","had taken","were taking","have taken"],"ماضٍ تامٌّ مجهولٌ: had been + p.p."),
S("pass","We ___ that the deadline had changed.",["were not told","did not tell","were not telling","have not told"],"مجهولٌ لفعلٍ بمفعولَين ⇐ we were not told."),
S("pass","The project ___ by two teams at the same time.",["is being handled","is handling","handles","has handling"],"المجهولُ المستمرُّ الحاضر."),
S("pass","Her article ___ in a well-known journal last year.",["was published","was publish","published","is published"],"ماضٍ مجهولٌ بزمنٍ معلوم."),
S("pass","Nothing can ___ until the file is checked.",["be decided","decide","decided","being decided"],"بعد الناقصِ يأتي المجهولُ: can + be + p.p."),
S("pass","The gate ___ at eight every evening.",["is locked","locks it","is locking","has locked"],"عادةٌ ثابتةٌ بالمجهول: is + p.p."),
S("pass","The classes ___ online because of the weather.",["were held","were hold","held","are holding"],"ماضٍ مجهولٌ من hold ⇐ were held."),
S("pass","A new version ___ right now, so wait a little.",["is being uploaded","is uploading","uploads","has uploaded"],"المجهولُ المستمرُّ الحاضرُ مع right now.")
);

/* ═══ ١٤) الحروف الكبيرة والترقيم — Capitalization / Punctuation (زيادة) ═══ */
B.push(
S("punct","Choose the correctly written sentence.",["We arrived on Friday, and the course began on Saturday.","We arrived on friday, and the course began on saturday.","We arrived on Friday and, the course began on Saturday.","we arrived on Friday, and the course began on Saturday."],"أيّامُ الأسبوعِ بحرفٍ كبير، وفاصلةٌ قبل and الرابطةِ لجملتَين تامّتَين."),
S("punct","Choose the sentence with correct punctuation.",["Although it was late, he kept revising.","Although it was late he kept revising.","Although, it was late he kept revising.","Although it was late; he kept revising."],"فاصلةٌ بعد العبارةِ الاستهلاليّةِ (Although …)، ولا فاصلةَ بعد although نفسِها."),
S("punct","Choose the correctly written sentence.",["She asked, \"Is the answer final?\"","She asked \"Is the answer final?\".","She asked, \"is the answer final?\"","She asked: \"Is the answer final\"?"],"فاصلةٌ قبل المقولِ، وأوّلُه بحرفٍ كبير، وعلامةُ الاستفهامِ داخلَ القوسَين."),
S("punct","Choose the sentence with the correct apostrophe.",["The children's answers were collected.","The childrens' answers were collected.","The childrens answers were collected.","The children's answer's were collected."],"‏children جمعٌ لا ينتهي بـs ⇐ 's."),
S("punct","Choose the correctly written sentence.",["I speak Arabic, English, and a little French.","I speak arabic, english, and a little french.","I speak Arabic English and a little French.","I speak Arabic, English and, a little French."],"أسماءُ اللغاتِ بحرفٍ كبير، وفواصلُ القائمةِ بينها."),
S("punct","Choose the sentence with correct punctuation.",["My answer was wrong; I had misread the question.","My answer was wrong, I had misread the question.","My answer was wrong I had misread the question.","My answer was wrong: and I had misread the question."],"جملتان تامّتان بلا رابطٍ ⇐ فاصلةٌ منقوطة."),
S("punct","Choose the correctly written sentence.",["We studied in Makkah last Ramadan.","We studied in makkah last ramadan.","We Studied in Makkah last Ramadan.","we studied in Makkah last Ramadan."],"أسماءُ المدنِ والشهورِ بحرفٍ كبير، والأفعالُ بحرفٍ صغير."),
S("punct","Choose the sentence with correct punctuation.",["He bought three things: a pen, a ruler, and glue.","He bought three things, a pen, a ruler, and glue.","He bought three things; a pen, a ruler, and glue.","He bought: three things a pen, a ruler and glue."],"النقطتان تُقدِّمان قائمةً بعد جملةٍ تامّة."),
S("punct","Choose the correctly written sentence.",["Dr. Salem teaches physics at the university.","dr. Salem teaches Physics at the University.","Dr Salem teaches Physics at the university.","Dr. salem teaches physics at the University."],"اللقبُ المختصرُ بحرفٍ كبيرٍ ونقطةٍ، وأسماءُ المواد العامّةِ بحرفٍ صغير."),
S("punct","Choose the sentence with correct punctuation.",["The test, which lasted two hours, was fair.","The test which lasted two hours, was fair.","The test, which lasted two hours was fair.","The test; which lasted two hours; was fair."],"الجملةُ المعترضةُ بين فاصلتَين لا واحدة."),
S("punct","Choose the correctly written sentence.",["It's important to check its spelling.","Its important to check it's spelling.","It's important to check it's spelling.","Its' important to check its spelling."],"‏it's = it is، وits ملكيّةٌ بلا فاصلةٍ عُليا."),
S("punct","Choose the sentence with correct punctuation.",["First, read the question; then, choose the answer.","First read the question then choose the answer.","First, read the question, then, choose the answer.","First: read the question; then choose, the answer."],"فاصلةٌ بعد الظرفِ الاستهلاليِّ وفاصلةٌ منقوطةٌ بين الجملتَين."),
S("punct","Choose the correctly written sentence.",["My uncle, a retired teacher, still reads daily.","My uncle a retired teacher still reads daily.","My uncle, a retired teacher still reads daily.","My uncle; a retired teacher; still reads daily."],"البدلُ المفسِّرُ بين فاصلتَين."),
S("punct","Choose the sentence with correct capitalization.",["We celebrate Eid al-Fitr every year.","We celebrate eid al-fitr every year.","We Celebrate Eid Al-Fitr Every Year.","we celebrate Eid al-Fitr every year."],"أسماءُ المناسباتِ بحرفٍ كبيرٍ في أوّلِها، والأفعالُ بصغير."),
S("punct","Choose the correctly punctuated sentence.",["Did he say, \"The deadline has moved\"?","Did he say \"the deadline has moved?\"","Did he say, \"the deadline has moved\"?","Did he say: \"The deadline has moved.\"?"],"علامةُ الاستفهامِ للجملةِ الكبرى فتخرج من القوسَين، والمقولُ يبدأ بكبير."),
S("punct","Choose the sentence with correct possessive punctuation.",["This is James's notebook.","This is Jamess notebook.","This is James notebook's.","This is Jame's notebook."],"الاسمُ المفردُ المنتهي بـs يأخذ 's في الاستعمالِ الشائع."),
S("punct","Choose the correctly written sentence.",["Unfortunately, the session was cancelled.","Unfortunately the session, was cancelled.","Unfortunately the session was cancelled,","unfortunately, the session was cancelled."],"الظرفُ الاستهلاليُّ تتبعه فاصلةٌ وأوّلُ الجملةِ بحرفٍ كبير."),
S("punct","Choose the sentence with correct punctuation.",["He works hard; however, he still needs practice.","He works hard, however, he still needs practice.","He works hard however he still needs practice.","He works hard; however he still needs practice,"],"‏however بين جملتَين: فاصلةٌ منقوطةٌ قبلَها وفاصلةٌ بعدَها."),
S("punct","Choose the correctly written sentence.",["I was born in May, in the city of Abha.","I was born in may, in the City of Abha.","I was born in May in the city of abha.","i was born in May, in the city of Abha."],"الشهورُ والمدنُ بحرفٍ كبير، وcity اسمٌ عامٌّ بصغير."),
S("punct","Choose the sentence with correct punctuation.",["The answer is simple: read twice.","The answer is simple; read twice,","The answer is simple, read twice.","The answer, is simple: read twice."],"النقطتان تُقدِّمان توضيحًا بعد جملةٍ تامّة."),
S("punct","Choose the correctly written sentence.",["She studies at King Saud University.","She studies at king saud university.","She Studies at King Saud university.","she studies at King Saud University."],"الأسماءُ الخاصّةُ للمؤسّساتِ بحرفٍ كبيرٍ في كلِّ كلمة."),
S("punct","Choose the sentence with correct punctuation.",["Yes, I checked every page.","Yes I checked every page.","Yes; I checked every page.","Yes: I checked, every page."],"‏Yes في بداية الجوابِ تتبعها فاصلةٌ."),
S("punct","Choose the correctly written sentence.",["The teachers' room is on the second floor.","The teachers room's is on the second floor.","The teacher's room is on the second floor of teachers.","The teachers's room is on the second floor."],"جمعٌ منتهٍ بـs ⇐ الفاصلةُ العُليا بعدَه وحدَها."),
S("punct","Choose the sentence with correct punctuation.",["We left early, so we avoided the traffic.","We left early so, we avoided the traffic.","We left early so we avoided, the traffic.","We left early; so, we avoided the traffic."],"فاصلةٌ قبل so الرابطةِ لجملتَين تامّتَين."),
S("punct","Choose the correctly written sentence.",["He read the Quran after Fajr prayer.","He read the quran after fajr prayer.","He Read the Quran After Fajr Prayer.","he read the Quran after Fajr prayer."],"الأسماءُ المقدَّسةُ والصلواتُ المسمّاةُ بحرفٍ كبيرٍ في أوّلِها."),
S("punct","Choose the sentence with correct punctuation.",["Bring the following: a pencil, an eraser, and water.","Bring the following, a pencil, an eraser and water.","Bring the following; a pencil an eraser and water.","Bring, the following: a pencil an eraser, and water."],"النقطتان بعد following ثمّ فواصلُ القائمة."),
S("punct","Choose the correctly written sentence.",["\"Read the question twice,\" she advised.","\"Read the question twice\", she advised.","\"read the question twice,\" she advised.","\"Read the question twice\" she advised."],"الفاصلةُ داخلَ القوسَين قبل she advised، والمقولُ يبدأ بحرفٍ كبير.")
);

/* ═══ ١٥) ترتيب الجملة واكتشاف الخطأ — Word Order / Error ID (زيادة) ═══ */
B.push(
S("order","Identify the incorrect part: She speaks / fluently English / with her / cousins abroad.",["fluently English","She speaks","with her","cousins abroad"],"الترتيبُ: فعلٌ + مفعولٌ + ظرفٌ ⇐ speaks English fluently."),
S("order","Identify the incorrect part: He goes / always / to the library / after school.",["always","He goes","to the library","after school"],"ظرفُ التكرارِ قبل الفعلِ الرئيس ⇐ He always goes."),
S("order","Identify the incorrect part: I have / seen never / such a clear / explanation.",["seen never","I have","such a clear","explanation"],"بعد المساعدِ: have never seen."),
S("order","Identify the incorrect part: We discussed / about the answer / for ten / minutes.",["about the answer","We discussed","for ten","minutes"],"‏discuss فعلٌ متعدٍّ بلا about ⇐ discussed the answer."),
S("order","Identify the incorrect part: She is / enough old / to sit / the official test.",["enough old","She is","to sit","the official test"],"‏enough تأتي بعد الصفةِ ⇐ old enough."),
S("order","Identify the incorrect part: There is / too many / noise / in this hall.",["too many","There is","noise","in this hall"],"‏noise غيرُ معدودٍ ⇐ too much noise."),
S("order","Identify the incorrect part: He explained / us the rule / before the / second attempt.",["us the rule","He explained","before the","second attempt"],"‏explain يلزمها to للمخاطَب: explained the rule to us."),
S("order","Identify the incorrect part: Despite of / the noise, / she finished / the section.",["Despite of","the noise,","she finished","the section"],"‏despite بلا of، وin spite of بـof."),
S("order","Identify the incorrect part: Everyone / were ready / for the / final session.",["were ready","Everyone","for the","final session"],"‏everyone مفردٌ ⇐ was ready."),
S("order","Identify the incorrect part: I asked him / what time / is it / at the gate.",["is it","I asked him","what time","at the gate"],"في السؤالِ غيرِ المباشرِ يعود الترتيبُ خبريًّا ⇐ what time it is."),
S("order","Identify the incorrect part: The news / are good / for all / the candidates.",["are good","The news","for all","the candidates"],"‏news مفردٌ ⇐ The news is good."),
S("order","Identify the incorrect part: She returned / back home / after the / long exam.",["back home","She returned","after the","long exam"],"‏return تعني الرجوعَ فلا تُزاد back ⇐ returned home."),
S("order","Identify the incorrect part: He is / one of / the student / who passed.",["the student","He is","one of","who passed"],"‏one of + جمعٍ ⇐ one of the students."),
S("order","Identify the incorrect part: They suggested / me to review / the first / two units.",["me to review","They suggested","the first","two units"],"‏suggest + v-ing أو that ⇐ suggested that I review."),
S("order","Identify the incorrect part: This is / a my / favourite chapter / in the book.",["a my","This is","favourite chapter","in the book"],"لا تُجمَع a مع ضميرِ الملكيّة ⇐ my favourite chapter."),
S("order","Identify the incorrect part: I enjoy / to read / long passages / in the morning.",["to read","I enjoy","long passages","in the morning"],"‏enjoy تُتبَع بالمصدرِ الصريح: enjoy reading."),
S("order","Identify the incorrect part: Hardly / I had / finished when / the bell rang.",["I had","Hardly","finished when","the bell rang"],"بعد hardly يُقدَّم المساعدُ ⇐ Hardly had I finished."),
S("order","Identify the incorrect part: She has / a beautiful / red big / notebook.",["red big","She has","a beautiful","notebook"],"ترتيبُ الصفات: الحجمُ قبل اللون ⇐ big red."),
S("order","Identify the incorrect part: He married / with a / teacher from / his city.",["with a","He married","teacher from","his city"],"‏marry متعدٍّ بلا with ⇐ married a teacher."),
S("order","Identify the incorrect part: The police / is investigating / the missing / answer sheets.",["is investigating","The police","the missing","answer sheets"],"‏police جمعٌ ⇐ are investigating."),
S("order","Identify the incorrect part: I look / forward to / meet you / next week.",["meet you","I look","forward to","next week"],"‏to هنا حرفُ جرٍّ لا أداةُ مصدرٍ: look forward to meeting you."),
S("order","Identify the incorrect part: Neither Ali / nor his / brothers was / in the hall.",["brothers was","Neither Ali","nor his","in the hall"],"مع neither ... nor يتبع الفعلُ الأقربَ ⇐ were."),
S("order","Identify the incorrect part: She told / that she / would come / before noon.",["She told","that she","would come","before noon"],"‏tell يلزمها مفعولٌ ⇐ She told me that…، وsay بلا مفعولٍ ⇐ She said that…"),
S("order","Identify the incorrect part: It was / such a difficult / question that / nobody solved it not.",["nobody solved it not","It was","such a difficult","question that"],"نفيٌ مزدوجٌ ⇐ nobody solved it."),
S("order","Identify the incorrect part: The amount / of mistakes / was smaller / this time.",["The amount","of mistakes","was smaller","this time"],"‏amount لغيرِ المعدودِ، وmistakes معدودٌ ⇐ The number of mistakes."),
S("order","Identify the incorrect part: Do you know / where is / the examination / hall?",["where is","Do you know","the examination","hall?"],"سؤالٌ داخليٌّ ⇐ where the examination hall is."),
S("order","Identify the incorrect part: He plays / the football / every Friday / with friends.",["the football","He plays","every Friday","with friends"],"أسماءُ الرياضاتِ بلا the ⇐ plays football.")
);
window.STEP_BANK = B;
})();
