/* تحقّق من english8 (إنجليزي ثاني متوسط): كلّ إجابةٍ تُراجَع مقابل قاعدةٍ
   مستقلّةٍ عن الكود الذي ولّدها — لا نثق بالمولّد في تصحيح نفسه.

   ولماذا هذا الملفّ أصلًا: الخطأ هنا لا يظهر كعطل. سؤالٌ جوابه المعلَّم
   خاطئ يعمل بلا شكوى، ويُصحَّح للطفل جوابه الصحيح على أنّه غلط —
   فيتعلّم الخطأ ويثق به. فلا يُكشف إلّا بقاعدةٍ ثانيةٍ تُراجعه. */
const fs=require('fs'),vm=require('vm'),path=require('path');
const ROOT=path.join(__dirname,'..');
const LINES=[]; const DIRECT = (require.main === module);
const say = DIRECT ? console.log : (...a)=>LINES.push(a.join(' '));
const noop=()=>{};
const ctx={window:{},document:{getElementById:()=>null,querySelector:()=>null,querySelectorAll:()=>[],
  createElement:()=>({style:{},setAttribute:noop,appendChild:noop}),addEventListener:noop,body:{appendChild:noop}},
 navigator:{},localStorage:{getItem:()=>null,setItem:noop,removeItem:noop},location:{search:'?who=rafeef'},
 fetch:()=>new Promise(()=>{}),setTimeout:noop,setInterval:noop,console:{log:noop,warn:noop,error:noop},
 URLSearchParams,JSON,Math,Date,encodeURIComponent,Set};
ctx.globalThis=ctx;Object.assign(ctx.window,ctx);vm.createContext(ctx);
const html=fs.readFileSync(path.join(ROOT,'english8.html'),'utf8');
for(const b of [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]))
  { try{ vm.runInContext(b,ctx); }catch(e){} }

const S=s=>String(s).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
let bad=0, ok=0, seen=0;
function check(name, verify, N=600){
  let fn; try{ fn=vm.runInContext(name,ctx); }catch(e){ say('  ⚠️ '+name+' غير موجود'); bad++; return; }
  if(typeof fn!=='function'){ say('  ⚠️ '+name+' ليس دالّة'); bad++; return; }
  seen++;
  let ran=0;
  for(let i=0;i<N;i++){
    let q; try{ q=fn(); }catch(e){ continue; }
    if(!q) continue;
    ran++;
    const opts=q[1].map(S), a=opts[q[2]], t=S(q[0]);
    if(opts.length!==3){ say('  ❌ '+name+' عدد الخيارات '+opts.length); bad++; return; }
    if(new Set(opts).size!==3){ say('  ❌ '+name+' خيارات مكرّرة: ['+opts.join(' | ')+']'); bad++; return; }
    if(!(q[2]>=0&&q[2]<3)){ say('  ❌ '+name+' فهرس خاطئ'); bad++; return; }
    if(!t||!S(q[3])){ say('  ❌ '+name+' نصّ أو تفسير فارغ'); bad++; return; }
    if(opts.some(o=>!o)){ say('  ❌ '+name+' خيارٌ فارغ'); bad++; return; }
    const v=verify(t,a,opts,q);
    if(v!==true){ say('  ❌ '+name+' | '+t.slice(0,95)+' | معلَّم: '+a+' | '+v); bad++; return; }
  }
  if(!ran){ say('  ⚠️ '+name+' لا يعمل: يرمي أو يرجع null دائمًا'); bad++; return; }
  ok++; say('  ✅ '+name+'  ('+ran+' عيّنة)');
}
/* الجواب يُستخرج من الجدول المرجعيّ بحسب مفتاح السؤال (العنصر الخامس) */
function keyed(map, pick){
  return (t,a,opts,q)=>{
    const k=q[4]; if(!k) return 'بلا مفتاح';
    const want=pick(k,map); if(want==null) return 'مفتاحٌ غير معروف: '+k;
    return want===a || ('متوقّع: '+want);
  };
}

/* ══════════ جداول مرجعيّة مستقلّة (كُتبت من قاعدة اللغة لا من الصفحة) ══════════ */
const BE_OF = s => (s==='I') ? 'am'
  : (/^(He|She|It|My brother|Sara|The book|The weather)$/.test(s) ? 'is'
  : (/^(We|You|They|My parents|Sara and Noura|The students|My friends|The shops)$/.test(s) ? 'are' : null));

say('### الوحدة 1 — Are You Here on Vacation?');
check('u1Be',(t,a,o,q)=>{ const s=q[4].split(':')[1]; const w=BE_OF(s); return w?(w===a||'متوقّع '+w):'فاعل غير معروف: '+s; });
check('u1BeNeg',(t,a,o,q)=>{ const s=q[4].split(':')[1]; const b=BE_OF(s);
  if(!b) return 'فاعل غير معروف: '+s;
  const w = b==='is' ? "isn't" : "aren't";
  if(o.includes("amn't") && a==="amn't") return 'اختِير amn\'t وهي غير موجودة';
  return w===a||'متوقّع '+w; });
check('u1Wh',(t,a,o,q)=>{
  const ans=q[4].slice('u1wh:'.length);
  const R=[[/^In |^At the airport/,'Where'],[/^At seven|^On Friday/,'When'],[/^My cousin/,'Who'],
           [/^Because/,'Why'],[/^A notebook/,'What'],[/^By bus|^Very well/,'How']];
  for(const [re,w] of R) if(re.test(ans)) return w===a||'متوقّع '+w;
  return 'جوابٌ غير معروف: '+ans; });
check('u1Prep',(t,a,o,q)=>{ const w=q[4].split('u1prep:')[1]; return w===a||'متوقّع '+w; });
check('u1Func',(t,a,o,q)=>{ const w=q[4].split('u1f:')[1]; return t.includes(w)||'السؤال لا يطابق الموقف'; });
check('u1Dir',(t,a,o,q)=>{ const w=q[4].split('u1dir:')[1]; return w===a||'متوقّع '+w; });

say('### الوحدة 2 — What Are They Making?');
check('u2Prog',(t,a,o,q)=>{ const s=q[4].split(':')[1]; const w=BE_OF(s)||(s==='My mother'?'is':(s==='The children'?'are':null));
  return w?(w===a||'متوقّع '+w):'فاعل غير معروف: '+s; });
/* قاعدة ing مستقلّة */
const ING_OF = v => {
  if(/e$/.test(v) && !/ee$/.test(v)) return v.slice(0,-1)+'ing';
  if(/^(run|sit|swim|stop|plan|get|put|begin)$/.test(v)) return v+v.slice(-1)+'ing';
  return v+'ing';
};
check('u2Ing',(t,a,o,q)=>{ const v=q[4].split(':')[1]; const w=ING_OF(v); return w===a||'متوقّع '+w; });
check('u2Imper',(t,a,o,q)=>{
  const neg=t.includes('نهي');
  if(neg) return /^Don't /.test(a) || 'النهي يبدأ بـ Don\'t';
  return (!/^(You |To |Not |No )/.test(a)) || 'الأمر يبدأ بالفعل مجرّدًا'; });
check('u2Appr',(t,a)=>{
  const POS=["That's a great idea!","I like it very much.","That looks wonderful!"];
  const NEG=["I don't like it.","That's not a good idea.","I don't think so."];
  const wantPos=t.includes('الاستحسان')&&!t.includes('عدم الاستحسان');
  return (wantPos ? POS.includes(a) : NEG.includes(a)) || 'لا يطابق المطلوب'; });

say('### الوحدة 3 — Who\'s Who');
const JOB_OF = d => ({
  'works in a school and helps students learn':'a teacher',
  'helps sick people in a hospital':'a doctor',
  'flies planes':'a pilot',
  'designs machines and buildings':'an engineer',
  'takes care of patients in a hospital':'a nurse',
  'cooks food in a restaurant':'a chef',
  'grows plants and keeps animals':'a farmer',
  "takes care of people's teeth":'a dentist',
  'writes news for a newspaper':'a journalist',
  'gives people their medicine':'a pharmacist'
})[d];
check('u3Job',(t,a,o,q)=>{ const w=q[4].split('u3job:')[1]; return w===a||'متوقّع '+w; });
/* قاعدة s للغائب المفرد مستقلّة */
const S3 = v => /(ch|sh|s|x|o)$/.test(v) ? v+'es' : (/[^aeiou]y$/.test(v) ? v.slice(0,-1)+'ies' : v+'s');
check('u3Pres',(t,a,o,q)=>{
  const p=q[4].split(':'); const subj=p[1], v=p[2];
  const w = (subj==='They') ? v : S3(v);
  return w===a||'متوقّع '+w; });
check('u3DoDoes',(t,a,o,q)=>{ const s=q[4].split('u3dd:')[1];
  const w = /^(he|she|your brother|Sara)$/.test(s) ? 'does' : 'do';
  return w===a||'متوقّع '+w; });
check('u3Want',(t,a,o,q)=>{ const v=q[4].split(':')[1]; return a==='to '+v || 'متوقّع to '+v; });
check('u3Rel',(t,a,o,q)=>{
  const s=q[4].slice('u3rel:'.length);
  const person=/^The (man|woman|student)/.test(s);
  const w=person?'who':'which';
  return w===a||'متوقّع '+w; });

say('### الوحدة 4 — Favorite Pastimes');
const FREQ_PCT = { '100%':'always','about 90%':'usually','about 70%':'often',
                   'about 40%':'sometimes','about 10%':'seldom','0%':'never' };
check('u4FreqWord',(t,a)=>{
  const m=t.match(/على\s*(\S+(?:\s*\S+)?)\s*من الوقت/); if(!m) return 'قراءة: '+t;
  const key=m[1].replace(/\s+/g,' ').trim();
  const w=FREQ_PCT[key]; return w?(w===a||'متوقّع '+w):'نسبة غير معروفة: '+key; });
check('u4FreqPos',(t,a,o,q)=>{
  const p=q[4].split(':'), kind=p[1], adv=p[2];
  const w = kind==='be' ? ('She is '+adv+' late.') : ('She '+adv+' walks to school.');
  return w===a||'متوقّع '+w; });
check('u4FreqExpr',(t,a,o,q)=>{ const w=q[4].slice('u4fe:'.length); return w===a||'متوقّع '+w; });
check('u4HowOften',(t,a,o,q)=>{ const p=q[4].split(':'), su=p[1], v=p[2];
  const aux = /^(she|he|your brother|Sara)$/.test(su) ? 'does' : 'do';
  const w = 'How often '+aux+' '+su+' '+v+'?';
  return w===a||'متوقّع '+w; });
check('u4KnowHow',(t,a,o,q)=>{ const v=q[4].slice('u4kh:'.length); return a==='knows how to '+v||'متوقّع knows how to '+v; });
const GER=['enjoy','finish','practice','mind','avoid'], INF=['want','decide','hope','need','plan'];
check('u4GerInf',(t,a,o,q)=>{ const v=q[4].split(':')[1];
  if(GER.includes(v)) return a==='reading'||'بعد '+v+' نستعمل gerund';
  if(INF.includes(v)) return a==='to read'||'بعد '+v+' نستعمل infinitive';
  return 'فعل غير مصنَّف: '+v; });

say('### الوحدة 5 — Is There Any Ice Cream?');
const COUNTABLE=['apple','orange','sandwich','egg','banana','tomato'];
const UNCOUNT=['rice','milk','bread','water','cheese','sugar','coffee','meat'];
check('u5Count',(t,a)=>{
  const wantC=t.includes('معدود')&&!t.includes('غير معدود');
  return (wantC ? COUNTABLE.includes(a) : UNCOUNT.includes(a)) || 'لا يطابق المطلوب'; });
check('u5SomeAny',(t,a,o,q)=>{
  const s=q[4].slice('u5sa:'.length);
  const neg=/n't|not/.test(s), ques=/^(Is|Do|Does|Are|Did)\b/.test(s);
  const w=(neg||ques)?'any':'some';
  return w===a||'متوقّع '+w; });
check('u5Part',(t,a,o,q)=>{
  const n=q[4].slice('u5p:'.length);
  const M={water:'a bottle of',milk:'a glass of',bread:'a loaf of',cheese:'a slice of',
           coffee:'a cup of',rice:'a bowl of',meat:'a kilo of',cake:'a piece of'};
  const w=M[n]; return w?(w===a||'متوقّع '+w):'اسم غير معروف: '+n; });
check('u5TooEnough',(t,a,o,q)=>{
  const s=q[4].slice('u5te:'.length);
  /* «enough» تأتي بعد الصفة، و«too» قبلها — نحكم من موضع الفراغ */
  const w=/\b(old|big)\s+_/.test(s) ? 'enough' : 'too';
  return w===a||'متوقّع '+w; });
check('u5WouldLike',(t,a,o,q)=>{ const p=q[4].split(':'), kind=p[1], x=p[2], ask=p[3]==='q';
  const core = kind==='n' ? x : ('to '+x);
  const w = ask ? ('Would you like '+core+'?') : ("I'd like "+core+'.');
  return w===a||'متوقّع '+w; });

say('### الوحدة 6 — What Was It Like?');
check('u6PastBe',(t,a,o,q)=>{ const s=q[4].split(':')[1];
  const w = /^(I|He|She|It|The weather)$/.test(s) ? 'was' : 'were';
  return w===a||'متوقّع '+w; });
const ED_OF = v => {
  if(/e$/.test(v)) return v+'d';
  if(/[^aeiou]y$/.test(v)) return v.slice(0,-1)+'ied';
  if(/^(stop|plan)$/.test(v)) return v+v.slice(-1)+'ed';
  return v+'ed';
};
check('u6PastReg',(t,a,o,q)=>{ const v=q[4].split(':')[1]; const w=ED_OF(v); return w===a||'متوقّع '+w; });
const IRR_OF={go:'went',eat:'ate',see:'saw',buy:'bought',take:'took',come:'came',
  write:'wrote',drink:'drank',give:'gave',make:'made',find:'found',meet:'met'};
check('u6PastIrr',(t,a,o,q)=>{ const v=q[4].split(':')[1]; const w=IRR_OF[v];
  return w?(w===a||'متوقّع '+w):'فعل غير معروف: '+v; });
check('u6PastQ',(t,a,o,q)=>{ const v=q[4].split(':')[1]; return a===v||'بعد did يبقى الفعل مجرّدًا: '+v; });
check('u6Intens',(t,a,o,q)=>{ const adj=q[4].split(':')[1];
  return a==='It was really '+adj+'.'||'متوقّع It was really '+adj+'.'; });

say('### الوحدة 7 — What Happened?');
check('u7There',(t,a,o,q)=>{ const n=q[4].slice('u7t:'.length);
  const plural=/^(many people|two cars|some children|a lot of books)$/.test(n);
  const w=plural?'There were':'There was';
  return w===a||'متوقّع '+w; });
check('u7Ago',(t,a,o,q)=>{ const s=q[4].slice('u7a:'.length);
  const w = /(days|years) _/.test(s) ? 'ago' : (/^She was born _/.test(s) ? 'in' : 'last');
  return w===a||'متوقّع '+w; });
check('u7Indef',(t,a,o,q)=>{ const s=q[4].slice('u7i:'.length);
  const M={ "_ is at the door. I can hear him.":"Someone",
            "I didn't see _ in the room.":"anyone",
            "There is _ in the box. It's empty.":"nothing",
            "Did you buy _ from the shop?":"anything",
            "She said _ interesting yesterday.":"something",
            "_ knows the answer. We are all confused.":"No one" };
  const w=M[s]; return w?(w===a||'متوقّع '+w):'جملة غير معروفة'; });
check('u7BecSo',(t,a,o,q)=>{ const s=q[4].slice('u7bs:'.length);
  /* الفاصلة قبل الفراغ علامةُ النتيجة ⇐ so */
  const w=/,\s*_/.test(s)?'so':'because';
  return w===a||'متوقّع '+w; });
check('u7SoNeither',(t,a,o,q)=>{ const s=q[4].slice('u7sn:'.length);
  const neg=/n't|not/.test(s);
  const be=/^I am|^I'm/.test(s), past=/^I (went|didn't watch)/.test(s);
  const aux = be ? 'am' : (past ? 'did' : 'do');
  const w=(neg?'Neither ':'So ')+aux+' I.';
  return w===a||'متوقّع '+w; });

say('### الوحدة 8 — What\'s Wrong?');
const ADV_OF={ 'I have a headache.':'You should take some medicine and rest.',
  'I have a toothache.':'You should see a dentist.',
  'I have a sore throat.':'You should drink warm water.',
  'I have a fever.':'You should stay in bed.',
  'I have a stomachache.':"You shouldn't eat heavy food.",
  'I have a cough.':"You shouldn't drink cold water." };
check('u8Advice',(t,a,o,q)=>{ const s=q[4].slice('u8adv:'.length); const w=ADV_OF[s];
  return w?(w===a||'متوقّع '+w):'عَرَضٌ غير معروف'; });
check('u8Should',(t,a,o,q)=>{ const v=q[4].slice('u8sh:'.length);
  return a==='You should '+v+'.'||'متوقّع You should '+v+'.'; });
check('u8When',(t,a,o,q)=>{ const s=q[4].slice('u8wh:'.length);
  const w=/^_/.test(s)?'When':'when'; return w===a||'متوقّع '+w; });
const PR_OF={ 'This is my brother. I see _ every day.':'him',
  'Sara is my friend. _ lives near us.':'She',
  'These are my books. I like _ .':'them',
  'My parents are doctors. _ work hard.':'They',
  "Can you help _ ? I'm lost.":'me',
  'The cat is hungry. _ wants food.':'It' };
check('u8Pron',(t,a,o,q)=>{ const s=q[4].slice('u8pr:'.length); const w=PR_OF[s];
  return w?(w===a||'متوقّع '+w):'جملة غير معروفة'; });
const PO_OF={ 'This is _ book. I bought it yesterday.':'my',
  'This book is _ .':'mine',
  'Is this _ pen, Sara?':'your',
  'The red car is _ , not ours.':'theirs',
  'She lost _ keys this morning.':'her',
  'That house is _ .':'ours' };
check('u8Poss',(t,a,o,q)=>{ const s=q[4].slice('u8po:'.length); const w=PO_OF[s];
  return w?(w===a||'متوقّع '+w):'جملة غير معروفة'; });
const BODY_OF={ 'الرأس':'head','اليد':'hand','الرِّجل':'leg','الأذن':'ear','العين':'eye',
  'الأنف':'nose','الأسنان':'teeth','الظهر':'back','الحلق':'throat','المعدة':'stomach' };
check('u8Body',(t,a)=>{
  const m=t.match(/ما معنى\s+(\S+)\s+بالإنجليزية/); if(!m) return 'قراءة: '+t;
  const w=BODY_OF[m[1]]; return w?(w===a||'متوقّع '+w):'كلمة غير معروفة: '+m[1]; });

module.exports = function(){ return { ok, bad, checked:seen, lines:LINES }; };
if(DIRECT){
  console.log('\n— مولّدات سليمة: '+ok+' · أخطاء: '+bad);
  process.exit(bad?1:0);
}
