/* يقرأ قيمةً حرفيّةً من مصدرِ صفحةٍ ويُعيدها كائنًا — بلا تشغيلِ الصفحة.
 *
 * ولِمَ لا regex: قواعدُ الدروسِ نصوصٌ عربيّةٌ فيها فواصلُ وأقواسٌ
 * وعلاماتُ اقتباسٍ مهروبة، فالتعبيرُ النمطيُّ يقطعها في منتصفِها ولا
 * يَبين — تخرج قاعدةٌ ناقصةٌ في ورقةٍ تُطبَع وتبقى في يدِ الطفل.
 * فالمسحُ هنا يحترم السلاسلَ والهروبَ والتعليقاتِ ويوازن الأقواس.
 *
 * ولِمَ لا تشغيلُ الصفحةِ في متصفّح: الصفحةُ تبني نفسَها بعد بوّابةِ
 * الدخول وتعتمد على DOM وشبكة، فتشغيلُها لأجلِ مصفوفةِ نصوصٍ ثمنٌ
 * غالٍ وهشّ. والمصدرُ نفسُه يكفي.
 */
'use strict';

/* يجد أوّلَ موضعٍ للتصريحِ ثمّ يوازن الأقواسَ من أوّلِ open بعدَه */
function literalAfter(src, declRe, open, close){
  const m = declRe.exec(src);
  if (!m) return null;
  let i = src.indexOf(open, m.index + m[0].length - 1);
  if (i < 0) return null;
  const start = i;
  let depth = 0, q = null, esc = false;
  for (; i < src.length; i++){
    const c = src[i], n = src[i+1];
    if (q){
      if (esc){ esc = false; continue; }
      if (c === '\\'){ esc = true; continue; }
      if (c === q) q = null;
      continue;
    }
    if (c === '/' && n === '/'){ const e = src.indexOf('\n', i); if (e < 0) return null; i = e; continue; }
    if (c === '/' && n === '*'){ const e = src.indexOf('*/', i + 2); if (e < 0) return null; i = e + 1; continue; }
    if (c === '"' || c === "'" || c === '`'){ q = c; continue; }
    if (c === open) depth++;
    else if (c === close){ depth--; if (!depth) return src.slice(start, i + 1); }
  }
  return null;
}

/* يُقوّم النصَّ الحرفيَّ في صندوقٍ معزولٍ بلا require ولا process */
function evalLiteral(text, label){
  const vm = require('vm');
  const box = {};
  vm.createContext(box);
  try {
    return vm.runInContext('(' + text + ')', box, { timeout: 2000 });
  } catch(e){
    throw new Error('تعذّر تقويمُ ' + (label || 'القيمة') + ': ' + e.message);
  }
}

function readArray(src, name){
  const t = literalAfter(src, new RegExp('(?:var|let|const)\\s+' + name + '\\s*='), '[', ']');
  return t ? evalLiteral(t, name) : null;
}
function readObject(src, name){
  const t = literalAfter(src, new RegExp('(?:var|let|const)\\s+' + name + '\\s*='), '{', '}');
  return t ? evalLiteral(t, name) : null;
}

module.exports = { literalAfter, evalLiteral, readArray, readObject };
