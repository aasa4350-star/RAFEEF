/* محاكي اختيار كلمات المراجعة — يستخرج كودَ reading.html نفسَه ويُشغّله.
 *
 * ولِمَ محاكٍ: شكوى «نفس الكلمات تتكرّر» رُقِّعت ستّ مرّاتٍ بالاستنتاج
 * (٣١ أغسطس · ٥ و٦ و١٠ سبتمبر · ٥ أكتوبر · ١٦ نوفمبر)، وكلُّ مرّةٍ
 * أُضيف مُرجِّحٌ إلى الترتيب ولم يُقَس الأثرُ على التكرارِ نفسِه. فصار
 * القياسُ شرطًا: التكرارُ والتغطيةُ والإتقانُ تُقاس جميعًا في النَّفَسِ
 * الواحد، لأنّ تحسينَ واحدٍ منها يُفسد الآخر — والتكرارُ الذي يُشتكى
 * منه هو نفسُه محرّكُ الإتقان (قياسُ ٧ نوفمبر: ٤٦ متقنةً بلا تركيزٍ
 * مقابل ٣٥٧ معه).
 *
 * ولِمَ لا يُعاد كتابةُ الاختيارِ هنا: نسخةٌ ثانيةٌ من المنطقِ تُقاس
 * فتُعطي رقمًا لا يَصدُق على الصفحة. فيُقتطع نصُّ الكتلةِ من الملفِّ
 * ويُشغَّل كما هو؛ وإن تغيّر الملفُّ فشل الاقتطاعُ صراحةً ولم يَكذِب.
 */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const SRC = fs.readFileSync(path.join(ROOT, 'reading.html'), 'utf8');

function cut(from, to, label){
  const a = SRC.indexOf(from);
  if (a < 0) throw new Error('تعذّر إيجادُ بدايةِ ' + label);
  const b = SRC.indexOf(to, a + from.length);
  if (b < 0) throw new Error('تعذّر إيجادُ نهايةِ ' + label);
  return SRC.slice(a, b);
}

const WEAKFN   = cut('function getWeak(){', '  /* ===== مراجعة متباعدة', 'دوالِّ الضعف');
const SR_CODE  = cut('var SR_DAYS = [0, 1, 2, 4, 8, 16, 30, 45];',
                     '  /* تقدير CEFR من حجم المفردات المتقنة', 'كتلةِ SR');
const PACE     = cut('  var FRESH_WINDOW = 40;',
                     '  /* ═══ الكلمةُ التي أخطأ فيها لا تبتلع', 'كتلةِ الوتيرة');
const WEAKCAP  = cut('  var WEAK_SHARE = 0.25;', '  function getRvSize(', 'ثوابتِ الضعف');
const RVSIZE   = cut('  function getRvSize(', '  function rvCycle(', 'حجمِ الجلسة');
const RVAUTO   = cut('  function rvAuto(', '  function getRvSize(', 'rvAuto');
const PICK     = cut('      headTitle = "🔁 مراجعة المحفوظ";',
                     ' else { V=[]; }', 'كتلةِ الاختيار');

const PRELUDE = `
var __LS = {};
var localStorage = {
  getItem: function(k){ return (k in __LS) ? __LS[k] : null; },
  setItem: function(k,v){ __LS[k] = String(v); },
  removeItem: function(k){ delete __LS[k]; }
};
function vKey(k){ return "vocab_"+k+"_"+who; }
function ownedList(learned){ return BANK.slice(0, learned); }
function pushSR(){}
var VOC_STEP = 10;
`;

/* يبني صندوقًا فيه كودُ الصفحةِ وحالةُ الطفلِ الحقيقيّة */
function build(who, bank, sr0, rvSize){
  const ctx = { who, BANK: bank, SR0: sr0, RV: rvSize, console, Date, Math, JSON };
  vm.createContext(ctx);
  vm.runInContext([PRELUDE, WEAKFN, SR_CODE, PACE, RVAUTO, WEAKCAP, RVSIZE].join('\n'), ctx);
  vm.runInContext('__LS[vKey("rvver")] = RV_VER;'
                + '__LS[vKey("sr")] = JSON.stringify(SR0);'
                + 'if(RV) __LS[vKey("rvsize")] = String(RV);', ctx);
  vm.runInContext(`
function sessionPick(){
  var learned = BANK.length, owned = learned;
  var V = null, headTitle = "", rvSize = 0, dueNow = 0, masteredNow = 0, knownNow = 0;
  var rvWidened = false, rvPool = 0, workOn = 0, workCap = 0, isNew = false;
  ${PICK} else { V = []; }
  return { V: (V||[]).map(function(w){ return w[0]; }),
           known: knownNow, work: workOn, cap: workCap, due: dueNow, widened: rvWidened };
}
function answer(word, ok){ srMark(word, ok); markWeak(word, !ok); }
function boxes(){ var s = getSR(), o = {};
  BANK.forEach(function(w){ var st = s[w[0]]; var b = st ? (st.b||0) : -1; o[b] = (o[b]||0)+1; });
  return o; }
function knownCount(){ return srKnown(ownedList(BANK.length)); }
function srDump(){ return getSR(); }
`, ctx);
  return ctx;
}
module.exports = { build, SRC };
