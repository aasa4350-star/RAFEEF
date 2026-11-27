/* ═══ عزلُ الجزيرةِ اللاتينيّةِ — نسخةٌ واحدةٌ للصفحتَين ═══
   كانت frx مكتوبةً مرّتَين — في practice.html وquiz.html — وكلتاهما
   تعرض عباراتٍ رياضيّةً داخلَ نصٍّ عربيّ. ودرسُ pace.js أمسِ:
   قاعدةٌ في نسختَين تتفرّق فيمرّ العطبُ في إحداهما صامتًا.
   فصار العازلُ هنا وحده، وتناديه frx في الصفحتَين.
   ══════════════════════════════════════════════════════════════════ */
(function(){
/* ═══ الجزيرةُ اللاتينيّةُ في نصٍّ عربيٍّ تُعزَل، وإلّا انقلبت ═══════════
   بلاغُ الأب (٢٧ نوفمبر ٢٠٢٦) بصورةِ سؤالٍ من التحصيليّ: «ما محدّد
   المصفوفة [2 −7 ; 3 8]؟» — وهو يُعرَض على الشاشةِ «]8 3 ; 7− 2[»:
   الأقواسُ مقلوبةٌ والعناصرُ معكوسة.

   والعلّةُ خوارزميّةُ الاتّجاهَين في يونيكود: في فقرةٍ عربيّةٍ تُرتَّب
   ركضاتُ الأرقامِ من اليمينِ إلى اليسار، والأقواسُ والفواصلُ محايدةٌ
   فتتبع الفقرة. فالمكتوبُ شيءٌ والمعروضُ شيءٌ آخر.

   وليس شكلًا فحسب: قِيس أثرُه على الجوابِ في الصورةِ نفسِها —
     المقصودُ [2 −7 ; 3 8] ⇒ المحدّدُ ٣٧
     والمعروضُ إن قُرئ [8 3 ; 7 2] ⇒ المحدّدُ −٥، وهو الخيارُ الثاني!
   فالعطبُ يسوق الطالبَ إلى صارفٍ موجودٍ في الورقة.

   وقِيس مداه بتشغيلِ المولّداتِ كلِّها وقراءةِ الترتيبِ البصريِّ في
   متصفّح: ٢٢٠ ركضةً معطوبةً في سبعةَ عشرَ مولّدًا — منها الأزواجُ
   المرتَّبة (5,−4) تُعرَض (4−,5) فتنقلب الإحداثيّات، والفتراتُ
   [−2,3] تُعرَض [3,2−]، والمتّجهاتُ ⟨6,8⟩ تنقلب كذلك.

   والعلاجُ في frx وحدَها لأنّها تمرُّ بها الجذوعُ والخياراتُ كلُّها من
   البنوكِ جميعًا: كلُّ ركضةٍ غيرِ عربيّةٍ فيها رقمٌ أو حرفٌ لاتينيٌّ
   تُلَفُّ بـdir="ltr" مع unicode-bidi:isolate. والـdir وحدَه لا يكفي
   داخلَ الفقرة — وهو درسٌ تكرّر عندنا من قبلُ في pace.js.

   ⚠️ والعزلُ يسبق كسورَ frx ويتخطّى الوسومَ: لو لُفَّ نصٌّ فيه <span>
   لانكسر البناء. */
/* والأُسُسُ والحروفُ اليونانيّةُ من الركضةِ نفسِها: لو تُركت خارجَها
   انقسمت «x²» و«cos\u03b8» جزيرتَين فتفرّقتا على الشاشة. */
var BIDI_OK = "0-9A-Za-z\\u00B0\\u00B1\\u00B2\\u00B3\\u00B9\\u00D7\\u00F7"+
  "\\u2070-\\u209F\\u0370-\\u03FF\\u2212\\u221A\\u221E\\u2192\\u2260\\u2248\\u2264\\u2265\\u2218"+
  "\\u222B\\u2211\\u220F\\u2208\\u27E8\\u27E9\\u00B7\\u2022\\uE000+\\\-=<>(){}\\[\\],;:./^%_'\"| ";
var BIDI_RUN = new RegExp("[" + BIDI_OK + "]*[0-9A-Za-z][" + BIDI_OK + "]*", "g");
function bidiIso(t){
  return String(t).replace(BIDI_RUN, function(m){
    var lead = m.match(/^\s*/)[0], tail = m.match(/\s*$/)[0], core = m.slice(lead.length, m.length - tail.length);
    /* ⚠️ وكان هنا شرطُ «فيها حرفٌ لاتينيٌّ» فنزعتُه: الركضةُ لا تُطابَق
       إلا بحرفٍ لاتينيٍّ أو رقمٍ في وسطِها، فالشرطُ لا يكذُب أبدًا،
       وسطرٌ لا يمكن أن يُخطئ لا يمكن أن يُحرَس. */
    /* ركضةٌ من حرفٍ لاتينيٍّ واحدٍ أو رقمٍ واحدٍ لا تنقلب، فلا تُلَفّ عبثًا */
    if(core.length < 2) return m;
    return lead + '<span dir="ltr" style="unicode-bidi:isolate">' + core + '</span>' + tail;
  });
}
/* ——— المصفوفةُ تُرسَم صفَّين وقوسَين، لا سطرًا بفاصلةٍ منقوطة ———
   «[2 −7 ; 3 8]» صيغةُ برمجةٍ لا صيغةُ رياضيّات، وهي التي انقلبت على
   الشاشة. والمولِّدُ الآن يكتب علامةً قصيرةً ⟦2,−7;3,8⟧ — تُخزَّن في
   قاعدةِ البيانات كما هي فتبقى مقروءةً — ويبنيها العرضُ شبكةً.
   والصيغةُ القديمةُ تُترجَم أيضًا، لأنّ صفوفَ الأخطاءِ المحفوظةَ
   قبلَ اليومِ تحملها، فتُعرَض في المراجعةِ مرسومةً لا مقلوبة. */
var MTX_NEW = /⟦([^⟧]{1,80})⟧/g;
var MTX_OLD = /\[\s*(−?-?\d+)\s+(−?-?\d+)\s*;\s*(−?-?\d+)\s+(−?-?\d+)\s*\]/g;
function esc(x){ return String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function mtxHtml(inner){
  var rows = String(inner).split(';').map(function(r){ return r.split(','); });
  var cols = 0, i, j;
  for(i = 0; i < rows.length; i++) if(rows[i].length > cols) cols = rows[i].length;
  var cells = '';
  for(i = 0; i < rows.length; i++)
    for(j = 0; j < cols; j++)
      cells += '<span>' + esc((rows[i][j] == null ? '' : rows[i][j]).trim()) + '</span>';
  /* القوسُ شريطٌ بثلاثةِ حدودٍ، فله شُرفتاه أعلى وأسفل كقوسِ الكتاب */
  var bar = 'width:.32em;border:1.6px solid currentColor';
  return '<span class="mtx" dir="ltr" style="display:inline-flex;align-items:stretch;'+
    'gap:.24em;vertical-align:middle;unicode-bidi:isolate;line-height:1.5;margin:0 .2em">'+
    '<span style="' + bar + ';border-right:0"></span>'+
    '<span style="display:inline-grid;grid-template-columns:repeat(' + cols + ',auto);'+
    'gap:.08em .9em;text-align:center;padding:.14em .08em">' + cells + '</span>'+
    '<span style="' + bar + ';border-left:0"></span>'+
  '</span>';
}
/* تُخبَّأ قبل العزلِ وتُردُّ بعدَه: لو مرّت على العازلِ لتقطّعت أرقامُها
   جزائرَ، ولو رُدَّت قبل مرصوفِ الكسورِ لمشى ذاك على وسومِها. */
function mtxHold(s, held){
  return String(s).replace(MTX_NEW, function(m, inner){ held.push(mtxHtml(inner)); return ""; })
                  .replace(MTX_OLD, function(m, a, b, c, d){
                    held.push(mtxHtml(a + ',' + b + ';' + c + ',' + d)); return ""; });
}
function mtxFill(s, held){
  var k = 0;
  return String(s).replace(//g, function(){ return held[k++] || ''; });
}
  window.bidiIso = bidiIso;
  window.mtxHold = mtxHold;
  window.mtxFill = mtxFill;
  window.mtxHtml = mtxHtml;
  window.BIDI_RUN_SRC = BIDI_RUN.source;
})();
