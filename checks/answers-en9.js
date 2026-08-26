/* تحقّق من english9: كل إجابة تُراجَع مقابل قاعدة الكتاب نفسها */
const fs=require('fs'),vm=require('vm'),path=require('path');
const ROOT=path.join(__dirname,'..');
/* الفحوص تعمل وقت التحميل، فلو استُدعي الملفّ كوحدةٍ من المشغّل طبع
   تفاصيله قبل عناوينه. نحبس السطور في مخزنٍ ونُظهرها عند الطلب فقط. */
const LINES=[]; const DIRECT = (require.main === module);
const say = DIRECT ? console.log : (...a)=>LINES.push(a.join(' '));
const noop=()=>{};
const ctx={window:{},document:{getElementById:()=>null,querySelector:()=>null,querySelectorAll:()=>[],
  createElement:()=>({style:{},setAttribute:noop,appendChild:noop}),addEventListener:noop,body:{appendChild:noop}},
 navigator:{},localStorage:{getItem:()=>null,setItem:noop,removeItem:noop},location:{search:'?who=hasan'},
 fetch:()=>new Promise(()=>{}),setTimeout:noop,setInterval:noop,console:{log:noop,warn:noop,error:noop},
 URLSearchParams,JSON,Math,Date,encodeURIComponent};
ctx.globalThis=ctx;Object.assign(ctx.window,ctx);vm.createContext(ctx);
const html=fs.readFileSync(path.join(ROOT,'english9.html'),'utf8');
for(const b of [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]))
  { try{ vm.runInContext(b,ctx); }catch(e){} }
const S=s=>String(s).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
/* حرفٌ واحد = خيارٌ مقطوع، إلّا الكلمات الإنجليزية المشروعة من حرف */
const CHOPPED=o=>String(o).length<2 && !['a','A','I'].includes(o);
let bad=0, ok=0;
function check(name, verify, N=1200){
  let fn; try{ fn=vm.runInContext(name,ctx); }catch(e){ say('  ⚠️ '+name+' غير موجود'); return; }
  let ran=0;
  for(let i=0;i<N;i++){
    let q; try{ q=fn(); }catch(e){ continue; }
    if(!q) continue;
    ran++;
    const opts=q[1].map(S), a=opts[q[2]], t=S(q[0]);
    if(opts.length!==3){ say('  ❌ '+name+' عدد الخيارات '+opts.length); bad++; return; }
    if(new Set(opts).size!==3){ say('  ❌ '+name+' خيارات مكررة: ['+opts.join(' | ')+']'); bad++; return; }
    if(!(q[2]>=0&&q[2]<3)){ say('  ❌ '+name+' فهرس خاطئ'); bad++; return; }
    if(!t||!S(q[3])){ say('  ❌ '+name+' نصّ أو تفسير فارغ'); bad++; return; }
    const v=verify(t,a,opts,q);
    if(v!==true){ say('  ❌ '+name+' | '+t.slice(0,90)+' | معلَّم: '+a+' | '+v); bad++; return; }
  }
  if(!ran){ say('  ⚠️ '+name+' لا يعمل'); return; }
  ok++; say('  ✅ '+name);
}
/* خيارٌ واحد فقط يحقّق الشرط وهو المعلَّم */
function only(opts,a,pred,label){
  const w=opts.filter(pred);
  if(w.length!==1) return 'عدد المحقِّقين = '+w.length+' ['+w.join(' ‖ ')+'] — '+label;
  return w[0]===a || ('المحقِّق هو: '+w[0]);
}

/* ── جدول التكرار كما في الكتاب ص ٤ ── */
const BAND={};
[['always',0],['all the time',0],
 ['usually',1],['generally',1],['normally',1],['frequently',1],['often',1],['regularly',1],
 ['sometimes',2],['occasionally',2],['from time to time',2],
 ['once in a while',3],['now and then',3],['hardly ever',3],['seldom',3],['rarely',3],
 ['never',4]].forEach(([w,b])=>BAND[w]=b);
const PCT={'100%':0,'50%–99%':1,'20%–49%':2,'1%–19%':3,'0%':4};

say('### Unit 1 — Lifestyles');
check('u1Freq',(t,a,opts)=>{
  const m=t.match(/على\s*(\S+)\s*من الوقت/); if(!m) return 'قراءة: '+t;
  const band=PCT[m[1]]; if(band===undefined) return 'نسبة غير معروفة: '+m[1];
  return only(opts,a,o=>BAND[o]===band,'ينتمي للنطاق '+m[1]);});
check('u1FreqCompare',(t,a,opts)=>{
  const m=t.match(/(أكثر|أقلّ) تكرارًا:\s*(.+?)\s*أم\s*(.+?)\s*؟/); if(!m) return 'قراءة: '+t;
  const w1=m[2].trim(), w2=m[3].trim();
  if(BAND[w1]===undefined||BAND[w2]===undefined) return 'كلمة غير معروفة';
  if(BAND[w1]===BAND[w2]) return 'من النطاق نفسه — غامض';
  const e = (m[1]==='أكثر') ? (BAND[w1]<BAND[w2]?w1:w2) : (BAND[w1]>BAND[w2]?w1:w2);
  return e===a||('متوقّع '+e);});
check('u1Place',(t,a,opts)=>{
  const ADVS=['always','usually','often','sometimes','seldom','rarely','never','hardly ever'];
  const ENDS=['twice a week','once a month','every two months','all the time','now and then'];
  const SUBJ=['Ahmed','Sara','My brother','Ibrahim','Maha','Qassim','Jamal'];
  const V3=['exercises','studies','reads books','checks his email','arrives on time','drinks tea','plays football'];
  const okSent=s=>{
    s=s.replace(/\.$/,'');
    const sub=SUBJ.find(x=>s.startsWith(x+' ')); if(!sub) return false;
    const rest=s.slice(sub.length+1);
    // بعد be
    const be=rest.match(/^is (.+)$/);
    if(be){ const ad=ADVS.find(x=>be[1].startsWith(x+' ')); return !!ad; }
    // ظرف ثمّ فعلٌ بصيغة الغائب
    const ad2=ADVS.find(x=>rest.startsWith(x+' '));
    if(ad2){ return V3.some(v=>rest.slice(ad2.length+1)===v); }
    // فعلٌ ثمّ عبارةُ نهاية
    const v3=V3.find(v=>rest.startsWith(v+' '));
    if(v3){ return ENDS.includes(rest.slice(v3.length+1)); }
    return false;
  };
  return only(opts,a,okSent,'ترتيب صحيح');});
const HOWQ={'How often':/times a day|Three times|hardly ever eats|rarely takes|How often/,
            'How much':/spend about 5 minutes|About 100 riyals|two hours every evening/,
            'How long':/about 2 hours every night|About seven hours/};
check('u1HowQ',(t,a,opts)=>{
  /* نتحقّق من القاعدة: much لكمّية (time/money) · long لمدّة · often لعدد مرّات */
  const stem=(t.match(/أكمل السؤال:\s*(.+?)\s*الإجابة/)||[])[1]||'';
  if(!stem) return 'قراءة: '+t;
  let e;
  if(/^___ (time|money)\b/.test(stem)) e='How much';
  else if(/^___ do you (spend|sleep)\b/.test(stem)) e='How long';
  else e='How often';
  return e===a||('متوقّع '+e+' من: '+stem);});
check('u1People',(t,a,opts)=>{
  const P={Arthur:['is really into fitness','works out at the gym regularly','goes rock climbing from time to time'],
    Refaa:['is a health food fanatic','normally eats vegetarian meals','hardly ever eats meat'],
    John:['hates any type of physical exercise','enjoys challenging puzzles like sudoku','plays video games in his free time'],
    Josh:['is an Internet addict','seldom spends less than three hours a day on the computer','often checks his cell phone'],
    Noura:['wants to be an artist','paints for at least two hours every evening','always does her homework after school'],
    Martin:['works very hard','always takes work home from the office','rarely takes a vacation']};
  const m=t.match(/الوحدة\s*(.+?)\s*؟/); if(!m) return 'قراءة: '+t;
  const fact=m[1].trim();
  const owners=Object.keys(P).filter(k=>P[k].some(f=>f===fact));
  if(owners.length!==1) return 'الحقيقة تعود لـ'+owners.length+' شخص';
  return owners[0]===a||('متوقّع '+owners[0]);});
check('u1Vocab',(t,a)=>{
  const V={seldom:'rarely',frequently:'often','hardly ever':'almost never','from time to time':'sometimes',
    'work out':'exercise',fanatic:'someone with an extreme interest','devoted to':'very committed to',
    overdo:'do too much',chores:'household jobs',addict:'someone who cannot stop',
    challenging:'difficult and interesting',regularly:'at regular times'};
  const m=t.match(/does\s*"(.+?)"\s*mean/); if(!m) return 'قراءة: '+t;
  const e=V[m[1]]; if(!e) return 'كلمة غير معروفة: '+m[1];
  return e===a||('متوقّع '+e);});

say('### Unit 2 — Life Stories');
const PLACE={'Jeddah':'in','Saudi Arabia':'in','the world':'in','Riyadh':'in','Makkah':'in',
  'Earth':'on','an island':'on','the second floor':'on',
  'school':'at','home':'at','work':'at','the airport':'at'};
check('u2PrepPlace',(t,a)=>{
  const m=t.match(/He lives ___ (.+)\.\s*$/); if(!m) return 'قراءة: '+t;
  const e=PLACE[m[1]]; if(!e) return 'مكان غير معروف: '+m[1];
  return e===a||('متوقّع '+e);});
const TIME={'Monday':'on','June 3rd':'on','Friday morning':'on','May 25th':'on',
  '8:00 a.m.':'at','noon':'at','6 A.M.':'at','night':'at',
  '2001':'in','May':'in','the winter':'in','1998':'in','the 20th century':'in'};
check('u2PrepTime',(t,a)=>{
  const m=t.match(/It happened ___ (.+)\.\s*$/); if(!m) return 'قراءة: '+t;
  const e=TIME[m[1]]; if(!e) return 'زمن غير معروف: '+m[1];
  return e===a||('متوقّع '+e);});
check('u2PastTime',(t,a)=>{
  const m=t.match(/أكمل الجملة:\s*(.+)$/); if(!m) return 'قراءة: '+t;
  const s=m[1];
  /* القاعدة: ago تأتي بعد المدّة · last قبلها · yesterday وحدها */
  let e;
  if(/(days|minutes|week|hours) ___/.test(s)) e='ago';
  else if(/___ (year|summer|night|week|month)\b/.test(s)) e='last';
  else if(/___ morning|before ___/.test(s)) e='yesterday';
  else return true;
  return e===a||('متوقّع '+e+' من: '+s);});
check('u2When',(t,a,opts)=>{
  /* الصحيح وحده خالٍ من: use to · didn't + ماضٍ · زمنٌ حاضر مع ماضٍ */
  const good=s=>!/\buse to\b/.test(s) && !/didn't \w+ed\b/.test(s) && !/didn't went\b/.test(s)
    && !/when (I am|they are|he is|she is)\b/i.test(s) && !/family moves\b/.test(s)
    && !/\bwas raise\b/.test(s) && !/before he goes\b/.test(s) && !/\bHe learn to\b/.test(s);
  return only(opts,a,good,'جملة سليمة');});
check('u2Vocab',(t,a)=>{
  const V={abroad:'in other countries',humanitarian:'a person who helps others',
    relief:'taking away stress and pain',appoint:'name someone for an important position',
    metropolis:'a big city',accomplishment:'something achieved successfully',
    governor:'the person who governs a region',biography:"the story of a person's life"};
  const m=t.match(/does\s*"(.+?)"\s*mean/); if(!m) return 'قراءة: '+t;
  const e=V[m[1]]; if(!e) return 'كلمة غير معروفة: '+m[1];
  return e===a||('متوقّع '+e);});

say('### Unit 3 — Traveling');
check('u3PresProg',(t,a,opts)=>{
  /* الصحيح وحده صيغة be + verb-ing سليمة */
  const good=s=>/^(am|is|are)?\s*\w*ing$/.test(s.trim()) || /^(am|is|are) \w+ing$/.test(s.trim()) || s.trim()==='are';
  return only(opts,a,good,'صيغة مستمرّة سليمة');});
check('u3GoingWill',(t,a,opts)=>{
  const bad=s=>/\b(am will|are will|going to$|don't going to)\b/.test(s)||s.trim()==='going to';
  const good=s=>!bad(s);
  const w=opts.filter(good);
  if(w.length<1) return 'لا خيار سليم';
  /* نتحقّق من المطابقة الدلالية: already decided/have tickets ⟵ going to · maybe/probably/perhaps ⟵ will */
  const m=t.match(/أكمل الجملة:\s*(.+)$/); if(!m) return 'قراءة';
  const s=m[1];
  if(/already decided|have our tickets/.test(s)) return /going to/.test(a)||('متوقّع going to في: '+s);
  if(/Maybe|probably|Perhaps|not sure/.test(s)) return /will|won't/.test(a)||('متوقّع will في: '+s);
  return true;});
check('u3Vocab',(t,a)=>{
  const V={'carry-on':'a bag you take onto the plane','boarding pass':'the card that lets you get on the plane',
    delayed:'later than the planned time',gate:'the door where passengers board',
    'checked baggage':'bags that travel in the hold',departure:'the time a flight leaves',
    belongings:'the things you own and carry',vaccination:'a medical injection against disease',
    identification:'a document that proves who you are'};
  const m=t.match(/does\s*"(.+?)"\s*mean/); if(!m) return 'قراءة: '+t;
  const e=V[m[1]]; if(!e) return 'كلمة غير معروفة: '+m[1];
  return e===a||('متوقّع '+e);});
check('u3Advice',(t,a)=>{
  const A={'Where should you put liquids when you travel?':'In your checked baggage',
    'How early should you arrive at the airport?':'At least two hours before departure',
    'What should you put on your suitcase?':'A name tag to identify it',
    'Should you pack items for strangers?':'No, never',
    'What do you need for international travel?':'A passport'};
  const e=A[t.trim()]; if(!e) return 'سؤال غير معروف: '+t;
  return e===a||('متوقّع '+e);});

/* جولات كاملة */
const genN=vm.runInContext('genN',ctx);
[['U1',10],['U2',10],['U3',10],['ALLU',12]].forEach(([n,want])=>{
  const g=vm.runInContext(n,ctx);
  for(let i=0;i<80;i++){ const it=genN(g,want); if(it.length<want){ say('⚠️ '+n+' جولة ناقصة: '+it.length+'/'+want); break; } }
});
say('\n### إتمام الوحدة 3');

/* مصدر الغرض: المعنى والشكل */
const PURP={'the airport':'to catch a plane','the travel agency':'to buy a plane ticket',
 'the bank':'to change some money','the consulate':'to get a visa','the mall':'to buy new clothes',
 'Paris':'to see the Eiffel Tower','Colorado':'to ski in the mountains','the library':'to borrow a book'};
const PURPSET=new Set(Object.values(PURP));
check('u3Infinitive',(t,a,opts)=>{
  if(opts.some(o=>CHOPPED(o))) return 'خيارٌ مقطوع: ['+opts.join(' | ')+']';
  let m=t.match(/^Why is \S+ going to (.+)\?$/);
  if(m){
    const e=PURP[m[1]]; if(!e) return 'مكان غير معروف: '+m[1];
    /* الخياران الآخران يجب أن يكونا غرضَي أماكن أخرى، فلا يصلح إلا واحد */
    const fit=opts.filter(o=>o===e);
    if(fit.length!==1) return 'عدد المطابِقين '+fit.length;
    if(!opts.every(o=>PURPSET.has(o))) return 'خيارٌ خارج القائمة: ['+opts.join(' | ')+']';
    return e===a||('متوقّع '+e);
  }
  m=t.match(/أكمل الجملة:\s*(.+)$/); if(!m) return 'قراءة: '+t;
  /* الشكل: to + مصدر مجرّد فقط */
  const good=opts.filter(o=>/^to [a-z]+$/.test(o) && !/ing$/.test(o) &&
    !['to caught','to bought'].includes(o));
  if(good.length!==1) return 'عدد الصيغ الصحيحة '+good.length+' ['+opts.join(' | ')+']';
  return good[0]===a||('متوقّع '+good[0]);});

/* لوحة المطار: نُعيد قراءة الجدول المطبوع في السؤال نفسه */
check('u3Flights',(t,a,opts,q)=>{
  const raw=q[0];
  const head=/ARRIVALS/.test(raw)?'ARRIVALS':(/DEPARTURES/.test(raw)?'DEPARTURES':null);
  if(!head) return 'لا عنوان للجدول';
  const rows=[...raw.matchAll(/<tr><td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td><\/tr>/g)]
    .map(m=>[m[1],m[2],m[3],m[4]]);
  if(rows.length!==6) return 'عدد صفوف الجدول '+rows.length;
  for(const c of [0,1,2,3])
    if(new Set(rows.map(r=>r[c])).size!==6) return 'عمودٌ فيه تكرار: '+c;
  const qm=t.match(/(What time does flight (.+?) (?:arrive|leave)\?|Which gate is flight (.+?) at\?|Which flight (?:arrives from|goes to) (.+?)\?)/);
  if(!qm) return 'قراءة: '+t;
  let e;
  if(qm[2]!==undefined){
    const r=rows.find(r=>r[0]===qm[2]); if(!r) return 'رحلة غير موجودة: '+qm[2];
    if(head==='ARRIVALS' && !/arrive\?/.test(t)) return 'فعلٌ لا يوافق الجدول';
    if(head==='DEPARTURES' && !/leave\?/.test(t)) return 'فعلٌ لا يوافق الجدول';
    e=r[2];
  } else if(qm[3]!==undefined){
    const r=rows.find(r=>r[0]===qm[3]); if(!r) return 'رحلة غير موجودة: '+qm[3];
    e=r[3];
  } else {
    if(head==='ARRIVALS' && !/arrives from/.test(t)) return 'اتجاهٌ لا يوافق الجدول';
    if(head==='DEPARTURES' && !/goes to/.test(t))   return 'اتجاهٌ لا يوافق الجدول';
    const r=rows.find(r=>r[1]===qm[4]); if(!r) return 'مدينة غير موجودة: '+qm[4];
    e=r[0];
  }
  if(!opts.includes(e)) return 'الجواب المستخرَج من الجدول ليس ضمن الخيارات: '+e;
  return e===a||('متوقّع من الجدول '+e);});

function factCheck(name,MAP,page){
  check(name,(t,a,opts)=>{
    const e=MAP[t.trim()]; if(!e) return 'سؤال غير معروف: '+t;
    if(opts.some(o=>CHOPPED(o))) return 'خيارٌ مقطوع: ['+opts.join(' | ')+']';
    if(new Set(opts).size!==3) return 'خيارات مكررة';
    return e===a||('متوقّع '+e);});
}
factCheck('u3Yahya',{
 'Where does Yahya live?':'In Dammam',
 'Where is Yahya going next month?':'To London',
 'What is Yahya going to need first?':'A passport',
 'What is he going to have to get?':'A U.K. visa',
 'What is Yahya going to do on his trip?':'Take lots of photos'});
factCheck('u3Listen',{
 'When did Dan and Larry last see one another?':'Two years ago',
 'What industry does Dan work in?':'The clothing industry',
 'Where is Larry going?':'To Florence',
 'Why is Larry going there?':'To study architecture',
 'Where is Dan going?':'To Milan',
 'Why is Dan going there?':'To find new clothing designs'});
factCheck('u3Michael',{
 'Why is Mr. Parker traveling?':'He is going on business',
 "Where does Mr. Parker's company have a branch?":'In Riyadh',
 'What is Mr. Parker doing tomorrow morning?':'Attending a conference',
 'When will Mr. Parker probably fly back to London?':'Next week',
 'Why is Michael going to Saudi Arabia?':'To study Arabic',
 'Which university is Michael going to?':'King Khalid University',
 'How long is Michael staying?':'For a year',
 'Which city is Michael going to?':'Abha',
 'Where did Mr. Parker use to live?':'In Dubai'});
check('u3RealTalk',(t,a)=>{
  const V={'kind of':'in some ways / a little','pretty':'very / quite','to pick up':'to learn'};
  const m=t.match(/does\s*"(.+?)"\s*mean here/); if(!m) return 'قراءة: '+t;
  const e=V[m[1]]; if(!e) return 'تعبير غير معروف: '+m[1];
  return e===a||('متوقّع '+e);});

/* الإملاء: نطبّق القاعدة بأنفسنا ثم نقارن */
function ingOf(v){
  if(/[^aeiou]e$/.test(v)) return v.slice(0,-1)+'ing';          /* حذف e الساكنة */
  if(/[^aeiou][aeiou][^aeiouwxy]$/.test(v)) return v+v.slice(-1)+'ing'; /* تضعيف CVC */
  return v+'ing';
}
check('u3Ing',(t,a,opts)=>{
  const m=t.match(/-ing form of\s*"(.+?)"/); if(!m) return 'قراءة: '+t;
  const e=ingOf(m[1]);
  if(!opts.includes(e)) return 'الصيغة المحسوبة ليست ضمن الخيارات: '+e;
  const others=opts.filter(o=>o!==e);
  if(others.some(o=>o===ingOf(m[1]))) return 'مشتّتٌ صحيح';
  return e===a||('متوقّع '+e);});

say('\n### الوحدة 3 — القراءة والكتابة والتراكيب (ص 28–31)');

factCheck('u3Read',{
 'What is Abha the capital of?':'Asir province',
 'How high above sea level is Abha?':'2,200 meters',
 'How high is Abha in feet?':'7,218 feet',
 'What is the population of Abha?':'Over 250,000',
 'What are the average temperatures in Abha?':'Between 12° C and 24° C',
 'What is Abha known for?':'Traditional stone and mud-brick houses',
 'When do most visitors come to Abha?':'In summer',
 'Which sport do some visitors enjoy in Abha?':'Paragliding',
 'How many people speak Arabic?':'More than 400 million',
 'Where do most Arabic speakers live?':'In the Middle East and North Africa',
 'Why is Arabic important to Muslims?':"It is the language of the Holy Qur'an",
 'Where will the students live during their stay?':'With a family',
 'What will students do at the Arabic Language School?':'Study the language and the culture of Islam',
 'Is Abha a big city?':'It is neither big nor small'});

/* معاني After Reading — المشتّتات يجب أن تكون خيارات الكتاب نفسها لا غير */
const RVOC={unique:['special',['strange','to be chosen']],
 dialects:['local varieties of language',['spelling differences','different accents']],
 recite:['repeat from memory',['tell a story','answer a question']],
 rich:['have a lot of good things',['wealthy','have a lot of sugar']],
 heritage:['traditions',['money from relatives','a preserved building']],
 buzzing:['busy and lively',['chaotic','very hot']],
 atmosphere:['the way a place or situation makes you feel',['traffic','gases surrounding Earth']]};
check('u3ReadVocab',(t,a,opts)=>{
  const m=t.match(/does\s*"(.+?)"\s*mean/); if(!m) return 'قراءة: '+t;
  const e=RVOC[m[1]]; if(!e) return 'كلمة غير معروفة: '+m[1];
  const want=new Set([e[0],...e[1]]);
  if(opts.some(o=>!want.has(o))) return 'خيارٌ ليس من خيارات الكتاب: ['+opts.join(' | ')+']';
  return e[0]===a||('متوقّع '+e[0]);});

factCheck('u3Adnan',{
 'Where is Adnan studying?':'In Toronto',
 'Is Adnan having a good time?':'Yes, he says he is doing fine',
 'What is the weather like in Toronto?':'Quite cold',
 'What is the temperature in Toronto right now?':'About 14° C',
 'What did Adnan have this afternoon?':'Vegetarian pizza and salad',
 'What happened to Adnan on his first day?':'He got lost',
 'How many hours of English does he have every day?':'Four',
 'What are his teachers like?':'Extremely helpful',
 'What are his classmates like?':'Very friendly',
 'Where is his class going next week?':'To Niagara Falls',
 'Who is going to show them around?':'A tour guide',
 'What is Adnan going to send his parents?':'Some photos',
 'When are they going to talk on Skype?':'On Saturday',
 'Where is Adnan going now?':'To the library'});

/* أدوات التقوية: تسبق الصفة/الظرف مباشرة · quite قبل أداة التعريف مع المفرد */
const INTENS=['very','quite','really','pretty','so','extremely'];
check('u3Intensifier',(t,a,opts)=>{
  if(/أيُّ الجمل صحيحة/.test(t)){
    /* الصحيحة: quite a ADJ N — أو — a/an INTENS ADJ N */
    const good=opts.filter(o=>/^(It has|It's|She is)\s+(quite (a|an) [a-z]+ [a-z]+|(a|an) (very|extremely|really|pretty|so) [a-z]+ [a-z]+)\.$/.test(o));
    if(good.length!==1) return 'عدد الصحيحات '+good.length+' ['+opts.join(' ‖ ')+']';
    return good[0]===a||('متوقّع '+good[0]);
  }
  const m=t.match(/أكمل الجملة:\s*(.+)$/); if(!m) return 'قراءة: '+t;
  /* الخيار الصحيح كلمةٌ واحدة من أدوات التقوية */
  const good=opts.filter(o=>INTENS.includes(o));
  if(good.length!==1) return 'عدد أدوات التقوية المفردة '+good.length+' ['+opts.join(' ‖ ')+']';
  /* ونتأكّد أنّ ما بعد الفراغ صفةٌ أو ظرف */
  if(!/___ [a-z]/.test(m[1])) return 'الفراغ ليس قبل صفة/ظرف';
  return good[0]===a||('متوقّع '+good[0]);});

/* الجمل الزمنية: لا صيغة مستقبل ولا مستمرّ داخلها */
check('u3TimeClause',(t,a,opts)=>{
  const m=t.match(/أكمل الجملة:\s*(.+)$/); if(!m) return 'قراءة: '+t;
  if(!/\b(after|as soon as|before|until|when|while|After|As soon as|Before|Until|When|While)\b/.test(m[1]))
    return 'لا أداة زمنية في الجملة';
  const good=opts.filter(o=>!/^will |^is |^are |^am |going to/.test(o));
  if(good.length!==1) return 'عدد الصيغ المضارعة البسيطة '+good.length+' ['+opts.join(' ‖ ')+']';
  return good[0]===a||('متوقّع '+good[0]);});

/* الفاصلة: جملةٌ زمنية متصدّرة ثمّ فاصلة، ولا فاصلة بعد الأداة نفسها */
check('u3TimeComma',(t,a,opts)=>{
  const good=opts.filter(o=>{
    if(/^(As soon as|Before|While|When),/.test(o)) return false;   /* فاصلة بعد الأداة = خطأ */
    return /^(As soon as|Before|While|When)\b[^,]+,\s/.test(o);    /* فاصلة في آخر الجملة الزمنية */
  });
  if(good.length!==1) return 'عدد الصحيحات '+good.length+' ['+opts.join(' ‖ ')+']';
  return good[0]===a||('متوقّع '+good[0]);});

/* المطابقة: نتحقّق من الجدول الأصلي في الكتاب ص 31 */
const MATCH={
 'Take your ticket and passport with you':'before you leave for the airport',
 "He's going to play football with his friends":'after he does his homework',
 "I won't spend a lot of money":'when I go to the shopping mall',
 "They'll probably visit a museum":"when they're in London",
 "We're going to miss you":"while you're away at college",
 'You must go through the security check':'before you board the airplane',
 'Passengers should wait by the gate':'until they call for boarding',
 "They're meeting their son at the airport":'as soon as he arrives',
 'You should arrive at the airport':'two hours before departure',
 "He won't go out with his friends":'until he finishes his homework'};
const MATCHVALS=new Set(Object.values(MATCH));
check('u3Match',(t,a,opts)=>{
  const m=t.match(/العبارة الزمنية المناسبة:\s*(.+?)\s*___/); if(!m) return 'قراءة: '+t;
  const e=MATCH[m[1]]; if(!e) return 'عبارة غير معروفة: '+m[1];
  if(!opts.every(o=>MATCHVALS.has(o))) return 'خيارٌ خارج قائمة الكتاب: ['+opts.join(' | ')+']';
  /* المشتّتان لا بدّ أن يكونا جوابَي بندَين آخرَين */
  if(opts.filter(o=>o===e).length!==1) return 'تكرار الجواب';
  return e===a||('متوقّع '+e);});

check('u3Move',(t,a)=>{
  const V={across:'from one side to the other side',along:'following the length of something',
   around:'in a circle or on all sides of something',
   through:'in one end and out the other end of something',
   into:'from outside to inside','out of':'from inside to outside',
   'away from':'moving so the distance gets bigger',towards:'moving so the distance gets smaller'};
  const m=t.match(/does\s*"(.+?)"\s*mean/); if(!m) return 'قراءة: '+t;
  const e=V[m[1]]; if(!e) return 'حرف غير معروف: '+m[1];
  return e===a||('متوقّع '+e);});

check('u3London',(t,a)=>{
  const V=[[/moves ___ the airport/,'away from'],[/___ underground tunnels/,'through'],
   [/check ___ the hotel, they/,'into'],[/tour ___ the city/,'around'],
   [/cruise ___ the Thames/,'along'],[/walk ___ Millennium Bridge/,'across'],
   [/check ___ the hotel and leave/,'out of']];
  const hit=V.find(([r])=>r.test(t));
  if(!hit) return 'جملة غير معروفة: '+t;
  return hit[1]===a||('متوقّع '+hit[1]);});

say('\n### Expansion — مراجعة الوحدات 1–3 (ص 32)');
check('exTigers',(t,a,opts)=>{
  const M=[[/What ___ probably become/,'will'],[/There ___ now only about 400/,'are'],
   [/___ authorities be able to protect/,'Will'],[/Siberian tigers ___ in the forests/,'live'],
   [/Some tigers ___ born and raised/,'are'],[/An adult male normally ___ 440/,'weighs'],
   [/They ___ very large animals/,'are'],[/can ___ up to 95 pounds/,'eat'],
   [/They sometimes ___ some of their catch/,'hide']];
  const hit=M.find(([r])=>r.test(t));
  if(!hit) return 'جملة غير معروفة: '+t;
  if(!opts.includes(hit[1])) return 'الجواب المتوقّع ليس ضمن الخيارات: '+hit[1];
  return hit[1]===a||('متوقّع '+hit[1]);});

factCheck('exPanda',{
 'Where do pandas live?':'In southwestern China',
 'How many pandas remain in the wild?':'About 1,900',
 'What kind of forests do pandas live in?':'Misty, rainy bamboo forests',
 "How much of a panda's diet is bamboo?":'99 percent',
 'How much bamboo does an adult giant panda eat each day?':'Up to 95 pounds',
 'How long does a panda spend eating each day?':'About 16 hours',
 'What do conservationists want to maintain?':'A bamboo corridor'});

/* صياغة السؤال: الفعل المساعد قبل الفاعل، وصيغة الفعل بعده صحيحة */
check('exAskQ',(t,a,opts)=>{
  const good=opts.filter(o=>{
    if(!/\?$/.test(o)) return false;
    /* خطأ: كلمة استفهام ثمّ فاعل ثمّ مساعد (What you are…) */
    if(/^(What|Where|Who|When)\s+(you|he|she|they|their \w+)\s+(are|is|will|was|were)\b/.test(o)) return false;
    if(/\b(are|is|will)\s+\w+(\s+\w+)?\s+doing\b.*\bgoing to\b/.test(o)) return false;
    if(/going to \w+ing\b/.test(o)) return false;        /* going to doing / meeting */
    if(/\bwill \w+ing\b/.test(o)) return false;          /* will doing */
    if(/\b(will|would)\s+\w+\s+\w+ing\b/.test(o)) return false;  /* will he doing */
    if(/\bare .* arrive from\b/.test(o)) return false;   /* are … arrive from */
    if(/\bdo you doing\b/.test(o)) return false;
    return true;});
  if(good.length!==1) return 'عدد الصيغ الصحيحة '+good.length+' ['+opts.join(' ‖ ')+']';
  return good[0]===a||('متوقّع '+good[0]);});

/* ── تحقّق عامّ من مولّدات الفهم المبنيّة على factGen ──
   نستخرج جدول [سؤال → جواب] من مصفوفة البيانات في الصفحة نفسها،
   ثمّ نتأكّد أنّ كلّ سؤالٍ يظهر بجوابه هو، وأنّ المشتّتات من القائمة المعلنة. */
function dataCheck(fnName, arrName, N=1500){
  let arr; try{ arr=vm.runInContext(arrName,ctx); }catch(e){ say('  ⚠️ '+arrName+' غير موجودة'); return; }
  const MAP={}, WRONG={};
  arr.forEach(r=>{ MAP[S(r[0])]=S(r[1]); WRONG[S(r[0])]=r[2].map(S); });
  const seen=new Set();
  check(fnName,(t,a,opts)=>{
    const e=MAP[t]; if(e===undefined) return 'سؤال غير معروف: '+t;
    seen.add(t);
    if(opts.some(o=>CHOPPED(o))) return 'خيارٌ مقطوع: ['+opts.join(' | ')+']';
    if(new Set(opts).size!==3) return 'خيارات مكررة';
    const allowed=new Set([e,...WRONG[t]]);
    if(opts.some(o=>!allowed.has(o))) return 'خيارٌ ليس من القائمة: ['+opts.join(' | ')+']';
    return e===a||('متوقّع '+e);
  },N);
  if(seen.size && seen.size<arr.length)
    say('     ↳ ظهر '+seen.size+' من '+arr.length+' بندًا');
}
/* تحقّق من مولّدات vocabGen: النصّ "What does \"x\" mean?" */
function vocabCheck(fnName, arrName, N=1500){
  let arr; try{ arr=vm.runInContext(arrName,ctx); }catch(e){ say('  ⚠️ '+arrName+' غير موجودة'); return; }
  const MAP={}, WRONG={};
  arr.forEach(r=>{ MAP[S(r[0])]=S(r[1]); WRONG[S(r[0])]=r[2].map(S); });
  check(fnName,(t,a,opts)=>{
    const m=t.match(/does\s*"(.+?)"\s*mean/); if(!m) return 'قراءة: '+t;
    const e=MAP[S(m[1])]; if(e===undefined) return 'مدخل غير معروف: '+m[1];
    if(opts.some(o=>CHOPPED(o))) return 'خيارٌ مقطوع';
    const allowed=new Set([e,...WRONG[S(m[1])]]);
    if(opts.some(o=>!allowed.has(o))) return 'خيارٌ ليس من القائمة: ['+opts.join(' | ')+']';
    return e===a||('متوقّع '+e);
  },N);
}
/* تحقّق من مولّدات clozeGen: النصّ "أكمل الجملة: <الجملة>" */
function clozeCheck(fnName, arrName, N=1500){
  let arr; try{ arr=vm.runInContext(arrName,ctx); }catch(e){ say('  ⚠️ '+arrName+' غير موجودة'); return; }
  const MAP={}, WRONG={};
  arr.forEach(r=>{ MAP[S(r[0])]=S(r[1]); WRONG[S(r[0])]=r[2].map(S); });
  check(fnName,(t,a,opts)=>{
    const m=t.match(/أكمل الجملة:\s*(.+)$/); if(!m) return 'قراءة: '+t;
    const e=MAP[S(m[1])]; if(e===undefined) return 'جملة غير معروفة: '+m[1];
    if(opts.some(o=>CHOPPED(o))) return 'خيارٌ مقطوع';
    const allowed=new Set([e,...WRONG[S(m[1])]]);
    if(opts.some(o=>!allowed.has(o))) return 'خيارٌ ليس من القائمة: ['+opts.join(' | ')+']';
    return e===a||('متوقّع '+e);
  },N);
}

say('\n### Expansion 1–3 — تكملة (ص 34–37)');
dataCheck('exWater','EX_WATER');
dataCheck('exWaterA','EX_WATER_A');
dataCheck('exChant','EX_CHANT1');

say('\n### Unit 4 — What Do I Need to Buy? (ص 38–47)');
/* التصنيف: نعيد بناء الجدول من مصفوفة الصفحة */
check('u4Category',(t,a,opts)=>{
  const arr=vm.runInContext('U4_CAT',ctx);
  const MAP={}; arr.forEach(r=>MAP[r[0]]=[r[1],r[2]]);
  const m=t.match(/does\s*"(.+?)"\s*belong/); if(!m) return 'قراءة: '+t;
  const e=MAP[m[1]]; if(!e) return 'طعام غير معروف: '+m[1];
  const allowed=new Set([e[0],...e[1]]);
  if(opts.some(o=>!allowed.has(o))) return 'خيارٌ ليس من القائمة';
  return e[0]===a||('متوقّع '+e[0]);});
/* الأسعار: نقرأ الجدول المطبوع في السؤال ونحسب العرض بأنفسنا */
check('u4Prices',(t,a,opts,q)=>{
  const rows=[...q[0].matchAll(/<tr><td>(.*?)<\/td><td>SR (.*?)<\/td><td>(.*?)<\/td><\/tr>/g)]
    .map(m=>[m[1],m[2],m[3]]);
  if(rows.length!==5) return 'عدد صفوف الجدول '+rows.length;
  if(new Set(rows.map(r=>r[1])).size!==5) return 'أسعار مكررة';
  let m;
  if((m=t.match(/How much do (\w+) cost\?/))){
    const r=rows.find(r=>r[0]===m[1]); if(!r) return 'صنف غير موجود';
    return ('SR '+r[1])===a||('متوقّع SR '+r[1]);
  }
  if((m=t.match(/How are (\w+) sold\?/))){
    const r=rows.find(r=>r[0]===m[1]); if(!r) return 'صنف غير موجود';
    return r[2]===a||('متوقّع '+r[2]);
  }
  if((m=t.match(/Buy one (\w+) and get the second for half price/))){
    const r=rows.find(r=>r[0]===m[1]); if(!r) return 'صنف غير موجود';
    const one=Number(r[1]), want='SR '+(one*1.5).toFixed(2);
    if(!opts.includes(want)) return 'الحساب المتوقّع ليس ضمن الخيارات: '+want;
    return want===a||('متوقّع '+want);
  }
  return 'قراءة: '+t;});
clozeCheck('u4Quantity','U4_QTY');
clozeCheck('u4SomeAnyNo','U4_SAN');
clozeCheck('u4Sequence','U4_SEQ');
clozeCheck('u4Noura','U4_NOURA');
vocabCheck('u4Cooking','U4_COOK');
/* النطق: الجواب لا بدّ أن يكون من مجموعة الكلمة نفسها والمشتّتان من غيرها */
check('u4Sound',(t,a,opts)=>{
  const G=[["shrimp","fish","sugar"],["cheese","chocolate","chips"],["jam","juice","orange"]];
  const m=t.match(/same sound<\/b>? as\s*"(.+?)"/) || t.match(/as\s*"(.+?)"/);
  if(!m) return 'قراءة: '+t;
  const g=G.find(x=>x.includes(m[1])); if(!g) return 'كلمة غير معروفة: '+m[1];
  const inGroup=opts.filter(o=>g.includes(o) && o!==m[1]);
  if(inGroup.length!==1) return 'عدد كلمات المجموعة نفسها '+inGroup.length+' ['+opts.join(' | ')+']';
  return inGroup[0]===a||('متوقّع '+inGroup[0]);});
dataCheck('u4Conv','U4_CONV');
vocabCheck('u4RealTalk','U4_RT');
dataCheck('u4Foods','U4_FOODS');
dataCheck('u4Maha','U4_MAHA');
clozeCheck('u4Reflexive','U4_REFL');
clozeCheck('u4BecauseSo','U4_BECSO');

say('\n### Unit 5 — Since When? (ص 48–57)');
dataCheck('u5Inventions','U5_INV');
clozeCheck('u5Perfect','U5_PP');
clozeCheck('u5ForSince','U5_FS');
/* التواريخ: نعيد قراءة الجدول من الصفحة، ونتأكّد أنّ التواريخ متمايزة */
check('u5Dates',(t,a,opts)=>{
  const arr=vm.runInContext('U5_DATES',ctx);
  if(new Set(arr.map(r=>r[1])).size!==arr.length) return 'تواريخ مكررة في الجدول';
  let m;
  if((m=t.match(/^When was (.+) invented\?$/))){
    const r=arr.find(r=>r[0]===m[1]); if(!r) return 'اختراع غير معروف: '+m[1];
    if(!opts.includes(r[1])) return 'التاريخ ليس ضمن الخيارات';
    return r[1]===a||('متوقّع '+r[1]);
  }
  if((m=t.match(/^Which invention dates from (.+)\?$/))){
    const r=arr.find(r=>r[1]===m[1]); if(!r) return 'تاريخ غير معروف: '+m[1];
    return r[0]===a||('متوقّع '+r[0]);
  }
  return 'قراءة: '+t;});
dataCheck('u5Fadi','U5_FADI');
vocabCheck('u5RealTalk','U5_RT');
dataCheck('u5Effects','U5_FX');
vocabCheck('u5FxVocab','U5_FXV');
check('u5Ref',(t,a,opts)=>{
  const arr=vm.runInContext('U5_REF',ctx);
  const hit=arr.find(r=>S(r[0])===t); if(!hit) return 'بند غير معروف: '+t;
  const allowed=new Set([S(hit[1]),...hit[2].map(S)]);
  if(opts.some(o=>!allowed.has(o))) return 'خيارٌ ليس من القائمة';
  return S(hit[1])===a||('متوقّع '+S(hit[1]));});
clozeCheck('u5Passive','U5_PASS');

say('\n### Unit 6 — Do You Know Where It Is? (ص 58–67)');
dataCheck('u6Places','U6_PLACES');
clozeCheck('u6Compare','U6_COMP');
clozeCheck('u6AsAs','U6_ASAS');
/* الأسئلة غير المباشرة: (أ) كلّ الخيارات من القائمة المعلنة، (ب) المعلَّم هو الصحيح،
   (ج) الصحيح <b>لا</b> يقع فيه قلبُ الفاعل والمساعد — وهي قاعدة الدرس نفسها. */
function inverted(o){
  const tail=o.replace(/^(Do you know|Could you tell me)\s+/,'');
  return /\b(is|are|was|were|do|does|did|can|will|could)\s+(the|a|an|I|he|she|it|they|we|you|people)\b/i.test(tail);
}
check('u6Indirect',(t,a,opts)=>{
  const arr=vm.runInContext('U6_IND',ctx);
  const hit=arr.find(r=>opts.includes(S(r[0])));
  if(!hit) return 'لا جملة صحيحة من القائمة بين الخيارات';
  const allowed=new Set([S(hit[0]),...hit[1].map(S)]);
  if(opts.some(o=>!allowed.has(o))) return 'خيارٌ ليس من القائمة: ['+opts.join(' | ')+']';
  if(inverted(S(hit[0]))) return 'الجملة المعتمدة صحيحةً فيها قلب: '+hit[0];
  return S(hit[0])===a||('متوقّع '+S(hit[0]));});
dataCheck('u6Rent','U6_RENT');
dataCheck('u6Faris','U6_FARIS');
vocabCheck('u6RealTalk','U6_RT');
dataCheck('u6Jeddah','U6_JEDDAH');
vocabCheck('u6JeddahVocab','U6_JV');
dataCheck('u6JeddahB','U6_JB');
clozeCheck('u6Article','U6_ART');

say('\n### Expansion 4–6 (ص 68–73)');
check('ex2Same',(t,a,opts)=>{
  const arr=vm.runInContext('EX2_SAME',ctx);
  const m=t.match(/المعنى نفسه؟\s*(.+)$/); if(!m) return 'قراءة: '+t;
  const hit=arr.find(r=>S(r[0])===S(m[1])); if(!hit) return 'جملة غير معروفة: '+m[1];
  const allowed=new Set([S(hit[1]),...hit[2].map(S)]);
  if(opts.some(o=>!allowed.has(o))) return 'خيارٌ ليس من القائمة';
  return S(hit[1])===a||('متوقّع '+S(hit[1]));});
dataCheck('ex2Adventure','EX2_ADV');
dataCheck('ex2Chant','EX2_CHANT');

say('\n### Unit 7 — It\'s a Good Deal, Isn\'t It? (ص 74–76)');
check('u7Tools',(t,a,opts)=>{
  const arr=vm.runInContext('U7_TOOLS',ctx);
  const m=t.match(/use\s+(.+?)\s+for\?/); if(!m) return 'قراءة: '+t;
  const hit=arr.find(r=>S(r[0])===S(m[1])); if(!hit) return 'أداة غير معروفة: '+m[1];
  return S(hit[1])===a||('متوقّع '+S(hit[1]));});
/* أسئلة الذيل: نشتقّ عائلة المساعد وقطبه من الجملة، فلا بدّ أن يوافقه الذيل
   في العائلة ويعاكسه في القطب — وهذا شرطٌ يحقّقه خيارٌ واحدٌ فقط. */
const PART=/^(been|gone|done|graduated|lived|worked|had|seen|made|taken|written|broken|changed|used|sold)$/i;
function famOf(st){
  if(/\b(won't|will)\b/i.test(st)) return 'will';
  if(/'ve\b|'s\s+\w+ed\b|\b(haven't|hasn't)\b/i.test(st)) return 'have';
  const hv=st.match(/\b(have|has)\s+(\w+)/i);
  if(hv && PART.test(hv[2])) return 'have';
  if(/\b(am|is|are|was|were|isn't|aren't|wasn't|weren't|'re|'s going)\b/i.test(st)) return 'be';
  return 'do';
}
function famTail(tl){
  if(/\b(will|won't)\b/i.test(tl)) return 'will';
  if(/\b(have|has|haven't|hasn't)\b/i.test(tl)) return 'have';
  if(/\b(is|are|am|was|were|isn't|aren't|wasn't|weren't)\b/i.test(tl)) return 'be';
  return 'do';
}
check('u7Tags',(t,a,opts)=>{
  const m=t.match(/أكمل الجملة:\s*(.+?)\s*,\s*___\s*\?$/); if(!m) return 'قراءة: '+t;
  const st=m[1];
  const neg=/\b(isn't|aren't|wasn't|weren't|don't|doesn't|didn't|haven't|hasn't|won't)\b/i.test(st);
  const fam=famOf(st);
  const good=opts.filter(o=>famTail(o)===fam && /n't/.test(o)!==neg);
  if(good.length!==1)
    return 'عدد الأذيال الموافقة للعائلة والمعاكسة للقطب '+good.length+
           ' (العائلة '+fam+(neg?'، منفيّة':'، مثبتة')+') ['+opts.join(' | ')+']';
  return good[0]===a||('متوقّع '+good[0]);});
/* إجابات الذيل: الاتّساق الداخلي — Yes مع مثبت و No مع منفيّ */
check('u7Answer',(t,a,opts)=>{
  const ok=o=>{
    const negPart=/n't|\bnot\b/.test(o.replace(/^(Yes|No),\s*/,''));
    if(/^Yes,/.test(o)) return !negPart;
    if(/^No,/.test(o))  return  negPart;
    return false;};
  const good=opts.filter(ok);
  if(good.length!==1) return 'عدد الإجابات المتّسقة '+good.length+' ['+opts.join(' ‖ ')+']';
  return good[0]===a||('متوقّع '+good[0]);});
clozeCheck('u7BeAble','U7_ABLE');

say('\n### Unit 8 — Drive Slowly! (ص 87–93)');
dataCheck('u8Aggressive','U8_AGGR');
dataCheck('u8George','U8_GEORGE');
vocabCheck('u8RealTalk','U8_RT');
dataCheck('u8Right','U8_RIGHT');
vocabCheck('u8RightVocab','U8_RV');
dataCheck('u8License','U8_LIC');
clozeCheck('u8CauseResult','U8_CAUSE');
check('u8Report',(t,a,opts)=>{
  const arr=vm.runInContext('U8_REP',ctx);
  const m=t.match(/الطلب أو الأمر:\s*(.+)$/); if(!m) return 'قراءة: '+t;
  const hit=arr.find(r=>S(r[0])===S(m[1])); if(!hit) return 'بند غير معروف: '+m[1];
  /* الصحيحة وحدها: ask/tell + مفعول + (not) to + مصدر، بلا "told to" ولا "said + مفعول" */
  const good=opts.filter(o=>{
    if(/\b(told|asked)\s+to\s+/.test(o)) return false;
    if(/\bsaid\s+(his|her|their|him|them|the)\b/.test(o)) return false;
    if(/\bto\s+not\s+/.test(o)) return false;
    if(/\b(told|asked)\s+[\w' ]+?\s+(don't|do not)\b/.test(o)) return false;
    if(/\b(told|asked)\s+[\w' ]+?\s+\w+ing\b/.test(o)) return false;
    return /\b(told|asked)\s+(?:his|her|their|the|him|them|me|us)(?:\s+\w+)?\s+(not\s+)?to\s+\w+/.test(o);});
  if(good.length!==1) return 'عدد الصحيحات '+good.length+' ['+opts.join(' ‖ ')+']';
  return S(hit[1])===a||('متوقّع '+S(hit[1]));});

say('\n### Unit 9 — All Kinds of People (ص 94–101)');
clozeCheck('u9Relative','U9_REL');
clozeCheck('u9PastProg','U9_PROG');
vocabCheck('u9Adjectives','U9_ADJ');
check('u9City',(t,a,opts)=>{
  const arr=vm.runInContext('U9_CITY',ctx);
  const m=t.match(/أكمل الجملة:\s*(.+)$/); if(!m) return 'قراءة: '+t;
  const hit=arr.find(r=>S(r[0])===S(m[1])); if(!hit) return 'جملة غير معروفة: '+m[1];
  const allowed=new Set([S(hit[1]),...hit[2].map(S)]);
  if(opts.some(o=>!allowed.has(o))) return 'خيارٌ ليس من القائمة';
  return S(hit[1])===a||('متوقّع '+S(hit[1]));});
dataCheck('u9Lars','U9_LARS');
vocabCheck('u9RealTalk','U9_RT');
dataCheck('u9Yunus','U9_YUNUS');
dataCheck('u9Jameel','U9_JAMEEL');
vocabCheck('u9YunusVocab','U9_YV');

say('\n### إتمام الوحدة 7 (ص 77–83)');
/* السؤال المنفيّ: المساعد مختصرًا مع n't وحده، بلا "not" منفصلة وبلا فاعلٍ مكرّر */
check('u7NegQ',(t,a,opts)=>{
  const m=t.match(/أكمل الجملة:\s*(.+)$/); if(!m) return 'قراءة: '+t;
  const subj=(m[1].match(/___\s+(\w+)/)||[])[1];
  const good=opts.filter(o=>{
    if(/\bnot\b/.test(o)) return false;                 /* Is not / Are not / Did not */
    if(!/n't$/.test(o))   return false;                 /* لا بدّ من الاختصار */
    if(subj && new RegExp('\\\\b'+subj+'$','i').test(o)) return false; /* Isn't he he */
    return true;});
  if(good.length<1) return 'لا صيغة مختصرة بين الخيارات ['+opts.join(' | ')+']';
  if(good.length===1) return good[0]===a||('متوقّع '+good[0]);
  /* بقي أكثر من مختصر: نرجع إلى القائمة المعلنة (خطأ مطابقة الفاعل) */
  const arr=vm.runInContext('U7_NEGQ',ctx);
  const hit=arr.find(r=>S(r[0])===S(m[1])); if(!hit) return 'جملة غير معروفة';
  const allowed=new Set([S(hit[1]),...hit[2].map(S)]);
  if(opts.some(o=>!allowed.has(o))) return 'خيارٌ ليس من القائمة';
  return S(hit[1])===a||('متوقّع '+S(hit[1]));});

function listCheck(fnName, arrName, stemRe, N=1500){
  let arr; try{ arr=vm.runInContext(arrName,ctx); }catch(e){ say('  ⚠️ '+arrName); return; }
  check(fnName,(t,a,opts)=>{
    const m=t.match(stemRe); if(!m) return 'قراءة: '+t;
    const hit=arr.find(r=>S(r[0])===S(m[1])); if(!hit) return 'بند غير معروف: '+m[1];
    if(opts.some(o=>CHOPPED(o))) return 'خيارٌ مقطوع';
    if(new Set(opts).size!==3) return 'خيارات مكررة';
    const allowed=new Set([S(hit[1]),...hit[2].map(S)]);
    if(opts.some(o=>!allowed.has(o))) return 'خيارٌ ليس من القائمة: ['+opts.join(' | ')+']';
    return S(hit[1])===a||('متوقّع '+S(hit[1]));
  },N);
}
listCheck('u7Situation','U7_SITU',/يناسب هذا الموقف؟\s*(.+)$/);
/* be able to في الماضي: الصحيح وحده ماضٍ ويوافق نفيَ الموقف أو إثباته */
check('u7AbleCtx',(t,a,opts)=>{
  const arr=vm.runInContext('U7_ABLE2',ctx);
  const m=t.match(/الصحيحة لهذا الموقف:\s*(.+)$/); if(!m) return 'قراءة: '+t;
  const hit=arr.find(r=>S(r[0])===S(m[1])); if(!hit) return 'موقف غير معروف: '+m[1];
  const past=opts.filter(o=>/\b(was|were|wasn't|weren't)\b/.test(o));
  if(past.length!==2) return 'عدد الصيغ الماضية '+past.length+' (المتوقّع مثبتة ومنفيّة)';
  if(!/\b(was|were|wasn't|weren't)\b/.test(S(hit[1]))) return 'الجواب ليس ماضيًا';
  const allowed=new Set([S(hit[1]),...hit[2].map(S)]);
  if(opts.some(o=>!allowed.has(o))) return 'خيارٌ ليس من القائمة';
  return S(hit[1])===a||('متوقّع '+S(hit[1]));});
dataCheck('u7Quiz','U7_QUIZ');
dataCheck('u7Ted','U7_TED');
vocabCheck('u7RealTalk','U7_RT');
dataCheck('u7Twins','U7_TWINS');
vocabCheck('u7TwinsVocab','U7_TV');
listCheck('u7Order','U7_ORDER',/^(.+?)\s*$/);
clozeCheck('u7Tense','U7_TENSE');
clozeCheck('u7Suggest','U7_SUGG');
listCheck('u7Accept','U7_ACCEPT',/^(A:.+)$/);

say('\n### إتمام الوحدة 8 (ص 84–86)');
vocabCheck('u8Car','U8_CAR');
/* داخل السيارة أم خارجها: الجواب من الجدول، والمشتّت الأوّل نقيضه */
check('u8InOut',(t,a,opts)=>{
  const arr=vm.runInContext('U8_INOUT',ctx);
  const m=t.match(/^Is\s+(.+?)\s+on the EXTERIOR/); if(!m) return 'قراءة: '+t;
  const hit=arr.find(r=>S(r[0])===S(m[1])); if(!hit) return 'جزء غير معروف: '+m[1];
  if(!opts.includes('EXTERIOR')||!opts.includes('INTERIOR')) return 'الخياران الأساسيّان غير موجودين';
  return hit[1]===a||('متوقّع '+hit[1]);});
/* الكلمات المركّبة: نتحقّق أنّ الوصل يعطي كلمةً من قائمة الكتاب */
check('u8Compound',(t,a,opts)=>{
  const WORDS=['steeringwheel','windshield','dashboard','seatbelt','rearviewmirror','roadsign'];
  const m=t.match(/goes with\s*"(.+?)"/); if(!m) return 'قراءة: '+t;
  const good=opts.filter(o=>WORDS.includes(m[1]+o));
  if(good.length!==1) return 'عدد الوصلات الصحيحة '+good.length+' ['+opts.join(' | ')+']';
  return good[0]===a||('متوقّع '+good[0]);});
listCheck('u8Sign','U8_SIGNS',/^What does\s+(.+?)\s+mean\?$/);
dataCheck('u8Modal','U8_MODAL');
clozeCheck('u8ModalForm','U8_MODALF');
/* الظرف: نشتقّ الصيغة بقاعدةٍ مستقلّة ثمّ نقارن */
function advOf(adj){
  if(adj==='good') return 'well';
  if(adj==='fast'||adj==='hard') return adj;
  if(/ic$/.test(adj)) return adj+'ally';
  if(/[^aeiou]y$/.test(adj)) return adj.slice(0,-1)+'ily';
  return adj+'ly';                        /* careful→carefully تلقائيًّا باللام المزدوجة */
}
check('u8Adverb',(t,a,opts)=>{
  const m=t.match(/adverb<\/b>? form of\s*"(.+?)"/) || t.match(/form of\s*"(.+?)"/);
  if(!m) return 'قراءة: '+t;
  const e=advOf(m[1]);
  if(!opts.includes(e)) return 'الصيغة المحسوبة ليست ضمن الخيارات: '+e;
  return e===a||('متوقّع '+e);});
clozeCheck('u8AdverbSent','U8_ADVS');

/* لا خيار من حرفٍ واحد في أيّ مولّد — الحارس ضدّ خطأ [..][0] */
say('\n### حارس الخيارات المقطوعة');
(function(){
  let names=[]; try{ names=vm.runInContext('ALLU.concat(ALLU2).concat(ALLU3).map(function(f){return f.name;})',ctx); }catch(e){}
  let bad1=0;
  names.forEach(n=>{ const f=vm.runInContext(n,ctx);
    for(let i=0;i<400;i++){ let q; try{q=f();}catch(e){continue;} if(!q) continue;
      const o=q[1].map(S);
      if(o.some(x=>CHOPPED(x))){ say('  ❌ '+n+' خيارٌ مقطوع: ['+o.join(' | ')+']'); bad1++; bad++; break; } } });
  if(!bad1) say('  ✅ لا خيار مقطوع في '+names.length+' مولّدًا');
})();

say('\n'+(bad?('⚠️ أخطاء: '+bad):('✅ '+ok+' مولّدًا سليمًا')));

/* ===================== المولّدات المضافة ===================== */
say('\n### إضافات الوحدة 1');
const SURVEY={'is a vegetarian':['no','no','no'],'often eats junk food':['no','no','yes'],
  'can cook':['yes','yes','yes'],'works out regularly':['yes','yes','no'],
  'drinks a lot of coffee':['no','no','no']};
check('u1Survey',(t,a,opts)=>{
  const m=t.match(/___ of them (.+?)\.\s*$/); if(!m) return 'قراءة: '+t;
  const row=SURVEY[m[1]]; if(!row) return 'صفّ غير معروف: '+m[1];
  const three=/Badria/.test(t);
  if(three){
    const yes=row.filter(x=>x==='yes').length;
    const e = yes===3?'All':(yes===0?'None':'Not all');
    return e===a||('متوقّع '+e+' من '+row.join(','));
  }
  const [n1,n2]=row;
  if(n1!==n2) return 'الشخصان مختلفان — كان يجب تجنّبه';
  const e = n1==='yes'?'Both':'Neither';
  return e===a||('متوقّع '+e);});
check('u1AllBothVerb',(t,a)=>{
  const m=t.match(/(Neither|Both|All|None) of them ___ (.+?)\.\s*$/); if(!m) return 'قراءة: '+t;
  const sing = m[1]==='Neither';
  const isNoun=/teachers?$/.test(m[2]);
  let e;
  if(isNoun) e = sing?'is':'are';
  else e = sing?'teaches':'teach';
  return e===a||('متوقّع '+e+' بعد '+m[1]);});
check('u1AllBothPos',(t,a,opts)=>{
  /* الصحيح وحده: All/Both بعد المساعد وقبل الفعل الرئيس، ولا تتصدّر ولا تتذيّل */
  const good=s=>!/^(All|Both) /.test(s) && !/ (all|both)[.?]$/.test(s);
  return only(opts,a,good,'موضع صحيح');});
check('u1Cohesion',(t,a)=>{
  const R={'they':'Teenagers','it':null,'them':'young people','their':'Teenagers'};
  const m=t.match(/ما مرجع\s*(\S+)\s*؟/); if(!m) return 'قراءة: '+t;
  const p=m[1];
  if(p==='it'){ return /Football|Playing a team sport/.test(a)||('متوقّع Football أو Playing a team sport'); }
  const e=R[p]; if(!e) return 'ضمير غير معروف: '+p;
  return e===a||('متوقّع '+e);});

say('### إضافات الوحدة 2');
check('u2PastQ',(t,a,opts)=>{
  const m=t.match(/أكمل الجملة:\s*(.+)$/); if(!m) return 'قراءة';
  const s=m[1];
  if(/^___ you live/.test(s))            return a==='Did'||'متوقّع Did';
  if(/did (they|she) ___/.test(s))       return /^(live|wear)$/.test(a)||('متوقّع مصدر، جاء '+a);
  if(/They ___ work/.test(s))            return a==="didn't"||"متوقّع didn't";
  if(/He ___ formal/.test(s))            return a==='wore'||'متوقّع wore';
  if(/Yes, they ___/.test(s))            return a==='did'||'متوقّع did';
  if(/No, he ___/.test(s))               return a==="didn't"||"متوقّع didn't";
  return true;});
check('u2Born',(t,a)=>{
  const m=t.match(/أكمل الجملة:\s*(.+)$/); if(!m) return 'قراءة';
  const s=m[1];
  const plural=/^(The twins|His parents|Linda and Jenny)/.test(s);
  const e=plural?'were':'was';
  return e===a||('متوقّع '+e+' في: '+s);});
const NEWS={'How often does Trent give blood?':'Every eight weeks',
 'How many times had Trent donated blood?':'100 times',
 'How many lives can one donation save?':'Up to three',
 'Why was it difficult for Ahmed to walk?':'He was born with a crippling disease',
 'Who taught Ahmed to play football?':'His older brother Ali',
 'How old is Ahmed?':'16',
 'Why did the employees gather at the beach?':'For a clean-up operation',
 'What was Sunset Beach awarded?':'The Blue Flag',
 'When were the twins born?':'On Monday, June 21st'};
check('u2News',(t,a,opts)=>{
  const e=NEWS[t.trim()]; if(!e) return 'سؤال غير معروف: '+t;
  if(opts.some(o=>CHOPPED(o))) return 'خيارٌ مقطوع (حرف واحد): ['+opts.join(' | ')+']';
  return e===a||('متوقّع '+e);});
check('u2QuickCheck',(t,a)=>{
  const V={'gave to charity':'donated','an arrangement to meet':'appointment','excellent':'outstanding',
   'supported someone to succeed':'encouraged','got together / met':'gathered','a baby':'infant',
   'people you work with':'colleagues','rubbish left outside':'litter'};
  const m=t.match(/means:\s*"(.+?)"/); if(!m) return 'قراءة: '+t;
  const e=V[m[1]]; if(!e) return 'تعريف غير معروف: '+m[1];
  return e===a||('متوقّع '+e);});



say('### إتمام الوحدة 2');
check('u2UsedTo',(t,a,opts)=>{
  const m=t.match(/أكمل الجملة:\s*(.+)$/); if(!m) return 'قراءة';
  const s2=m[1];
  /* لا يجوز أبدًا: didn't used to · did used to · using to */
  if(/didn't used to|did used to|using to/.test(a)) return 'صيغة خاطئة معلَّمة: '+a;
  if(/^___ you use to/.test(s2))   return a==='Did'||'متوقّع Did';
  if(/did you ___/.test(s2))       return a==='use to'||'متوقّع use to بعد did';
  if(/^I ___ play video games/.test(s2) || /^People ___ drive/.test(s2))
                                   return a==="didn't use to"||"متوقّع didn't use to";
  return a==='used to'||('متوقّع used to في: '+s2);});
check('u2IrregPast',(t,a)=>{
  const V={meet:'met',go:'went',be:'was',spend:'spent','grow up':'grew up',get:'got',know:'knew',
    come:'came',try:'tried',agree:'agreed',move:'moved',introduce:'introduced',ask:'asked',
    watch:'watched',want:'wanted',play:'played'};
  const m=t.match(/past tense of\s*"(.+?)"/); if(!m) return 'قراءة: '+t;
  const e=V[m[1]]; if(!e) return 'فعل غير معروف: '+m[1];
  return e===a||('متوقّع '+e);});
check('u2RealTalk',(t,a)=>{
  const V={'to turn up':'to appear unexpectedly','What about…?':'used to introduce a new topic',
    'to be into something':'to be interested in it','big break':'an important opportunity'};
  const m=t.match(/does\s*"(.+?)"\s*mean/); if(!m) return 'قراءة: '+t;
  const e=V[m[1]]; if(!e) return 'تعبير غير معروف: '+m[1];
  return e===a||('متوقّع '+e);});
const FALC={'How did the Falcons team start?':'The coach posted a note on the bulletin board asking for players',
 'Where did the hopeful athletes turn up?':'At the gym',
 'What position does Khalid play?':'Point guard',
 'Why did Trevor leave his old team?':"He wasn't into the attitude of the players",
 'Where did the Falcons use to practice?':'In the school gym',
 'Which division did the Falcons start in?':'B Division'};
check('u2Falcons',(t,a,opts)=>{
  const e=FALC[t.trim()]; if(!e) return 'سؤال غير معروف: '+t;
  if(opts.some(o=>CHOPPED(o))) return 'خيارٌ مقطوع: ['+opts.join(' | ')+']';
  return e===a||('متوقّع '+e);});
const KING={'Where and when was King Salman born?':'In Riyadh on December 31, 1935',
 'Where did King Salman go to school?':"At the Princes' School in Riyadh",
 'When was he appointed Crown Prince?':'On June 18, 2012',
 'When did he become King?':'On January 23, 2015',
 'How old was he when he became Emir of Riyadh?':'19',
 'Which centre did he found as king?':'The King Salman Humanitarian Aid and Relief Centre',
 'Which sites were named UNESCO World Heritage Sites?':'Al-Ahsa Oasis and the Hima Cultural Area',
 'From which university did he receive an Honorary Doctorate in Literature?':'The University of Umm Al-Qura in Makkah',
 'How did the Prince help change Riyadh?':'He helped it develop into a major urban metropolis'};
check('u2King',(t,a,opts)=>{
  const e=KING[t.trim()]; if(!e) return 'سؤال غير معروف: '+t;
  if(opts.some(o=>CHOPPED(o))) return 'خيارٌ مقطوع: ['+opts.join(' | ')+']';
  if(new Set(opts).size!==3) return 'خيارات مكررة';
  return e===a||('متوقّع '+e);});

say('\n'+(bad?('⚠️ إجمالي الأخطاء: '+bad):('✅ الإجمالي: '+ok+' مولّدًا سليمًا')));

module.exports = function(){ return { ok: ok, bad: bad, lines: LINES }; };
