/* ============================================================
   فحص حياة خدمة النطق (أزور) — ونصيبنا من حصّتها الشهريّة.

   لماذا وُجد هذا الملفّ: في ٩ سبتمبر ٢٠٢٦ انتهى الرصيد المجانيّ
   فعُطّل الاشتراك، فتوقّف المايكروفون في الموقع كلّه — المحادثة
   والقراءة والإملاء وتقييم النطق — ساعتين ولا أحد يدري. الأولاد
   ظنّوا العطل منهم، والأب أرسل «سيّئ جدًّا»، وأنا شخّصتُ العلّة في
   الكود وكتبتُ فيه إصلاحًا ونشرتُه — والعلّة لم تكن في الكود أصلًا.
   لم يُعرف السبب إلّا حين وصلت رسالةُ مايكروسوفت إلى بريد الأب.

   ولا شيء في الكود كان يمكن أن يكشفه: الصفحة تُحمّل، والمفتاح
   موجودٌ في مكانه، والوسوم كلّها سليمة. الفرق الوحيد أنّ أزور صارت
   تردّ ٤٠١. فلا يُكشف هذا إلّا بنداءٍ حقيقيّ.

   ما يفعله:
     ١. يقرأ المفتاح والمنطقة من azure-config.js كما تقرؤهما الصفحة.
     ٢. يطلب رمز الدخول: ٤٠١/٤٠٣ يعني الاشتراك موقوفٌ أو المفتاح
        باطل — وهو خطأٌ لا تنبيه، لأنّ المايك متوقّفٌ عند الأولاد الآن.
     ٣. يُولّد جملةً قصيرةً فعلًا: فقد يمرّ الرمز ثمّ يسقط المورد نفسه،
        والنشرُ الذي يمرّ ثمّ يسقط عند الطفل أسوأ من إخفاقٍ صريح.
     ٤. يحسب ما استهلكناه من الخمس ساعات الشهريّة من صفوف الموقع،
        فنعرف قربنا من الحدّ بالرقم لا بالظنّ.

   تعذُّرُ الوصول (شبكةٌ مقطوعة) ليس خطأً: يُذكر خبرًا ولا يُفشل
   الفحص — وإلّا صار الفحص يكذب علينا كلّما فُحص بلا إنترنت.
   ============================================================ */
const fs = require('fs');
const path = require('path');

/* AZCHK_DIR: ليُختبر مسارُ الإخفاق بمفتاحٍ باطلٍ بلا مساسٍ بالمفتاح الحقيقيّ */
const ROOT = process.env.AZCHK_DIR || path.join(__dirname, '..');
const SUPA_URL = 'https://kmopkxlhisrwxllagjbu.supabase.co';
const SUPA_KEY = 'sb_publishable_fVHi2d2S5yNdve8ErqDvVw_RvphbHH_';

const FREE_STT_SEC = 5 * 60 * 60;   /* حصّة F0: خمس ساعات تفريغٍ شهريًّا */
const WARN_AT = 0.60;               /* ننبّه عند ٦٠٪ فيبقى متّسعٌ للتصرّف */

/* المفتاح مخزّنٌ مُرمّزًا Base64 داخل atob — انظر azure-config.js */
function readKey(){
  const p = path.join(ROOT, 'azure-config.js');
  if (!fs.existsSync(p)) return { err: 'azure-config.js غير موجود' };
  const src = fs.readFileSync(p, 'utf8');
  const m = /default\s*:\s*\{\s*key\s*:\s*atob\(\s*"([^"]+)"\s*\)\s*,\s*region\s*:\s*"([^"]+)"/.exec(src);
  if (!m) return { err: 'تعذّرت قراءة المفتاح من azure-config.js — تغيّرت صيغته' };
  let key = '';
  try { key = Buffer.from(m[1], 'base64').toString('utf8'); }
  catch (e) { return { err: 'المفتاح ليس Base64 سليمًا' }; }
  if (!key || key.length < 30) return { err: 'المفتاح فارغٌ أو أقصر ممّا ينبغي' };
  return { key, region: m[2] };
}

/* ثواني الصوت التي فرّغتها أزور لنا هذا الشهر.
   لا نجمع صفوف الجلسة الواحدة: talk.html يحفظ بعد كلّ جملة والقيمة
   تراكميّةٌ للجلسة، فجمعُها يُضاعف الرقم أضعافًا. */
async function usedThisMonth(){
  const month = new Date().toISOString().slice(0, 7);
  const r = await fetch(SUPA_URL + '/rest/v1/attempts?select=created_at,meta' +
    '&created_at=gte.' + month + '-01&order=created_at.desc&limit=1000',
    { headers: { apikey: SUPA_KEY } });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  const rows = await r.json();
  const bySid = {};
  let loose = 0, seen = 0;
  for (const row of rows){
    const m = row.meta || {};
    if (typeof m.audioSec !== 'number' || !m.audioSec) continue;
    seen++;
    if (m.sid) bySid[m.sid] = Math.max(bySid[m.sid] || 0, m.audioSec);
    else loose += m.audioSec;
  }
  let sec = loose;
  for (const k in bySid) sec += bySid[k];
  return { sec, rows: seen };
}

module.exports = async function azure(){
  const issues = [];
  let live = null, region = null, used = null;

  const cfg = readKey();
  if (cfg.err){
    issues.push({ sev: 'خطأ', msg: cfg.err + ' — بلا مفتاحٍ لا يعمل أيُّ قسمٍ فيه مايكروفون' });
    return { live, region, used, issues };
  }
  region = cfg.region;

  /* ═══ ١ · رمز الدخول ═══ */
  let tok = null;
  try {
    const r = await fetch('https://' + cfg.region + '.api.cognitive.microsoft.com/sts/v1.0/issueToken',
      { method: 'POST', headers: { 'Ocp-Apim-Subscription-Key': cfg.key, 'Content-Length': '0' },
        signal: AbortSignal.timeout(25000) });
    if (r.status === 401 || r.status === 403){
      live = false;
      issues.push({ sev: 'خطأ', msg: 'أزور تردّ ' + r.status + ' — الاشتراك موقوفٌ أو المفتاح باطل. ' +
        'المايكروفون متوقّفٌ الآن في المحادثة والقراءة والإملاء وتقييم النطق. ' +
        'راجع portal.azure.com ← الاشتراك، ثمّ مورد rafeef-speech ← Keys and Endpoint' });
      return { live, region, used, issues };
    }
    if (r.status === 429){
      live = false;
      issues.push({ sev: 'خطأ', msg: 'أزور تردّ ٤٢٩ — نفدت الحصّة المجانيّة الشهريّة أو تجاوزنا معدّل الطلبات. ' +
        'الخدمة متوقّفةٌ حتى بداية الشهر (F0 لا تُفوتر، تتوقّف)' });
      return { live, region, used, issues };
    }
    if (!r.ok){
      issues.push({ sev: 'تنبيه', msg: 'أزور ردّت ' + r.status + ' على طلب الرمز — غير متوقّع' });
      return { live, region, used, issues };
    }
    tok = await r.text();
  } catch (e){
    /* شبكةٌ مقطوعةٌ لا اشتراكٌ موقوف — خبرٌ لا خطأ */
    issues.push({ sev: 'خبر', msg: 'تعذّر الوصول إلى أزور (' + String(e.message || e).slice(0, 60) + ') — لم يُفحص' });
    return { live, region, used, issues };
  }

  /* ═══ ٢ · توليدٌ فعليّ: الرمز يمرّ والمورد يسقط ═══ */
  try {
    const r = await fetch('https://' + cfg.region + '.tts.speech.microsoft.com/cognitiveservices/v1', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + tok, 'Content-Type': 'application/ssml+xml',
                 'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3', 'User-Agent': 'rafeef-checks' },
      body: '<speak version="1.0" xml:lang="en-US"><voice name="en-GB-RyanNeural">check</voice></speak>',
      signal: AbortSignal.timeout(30000)
    });
    const buf = r.ok ? Buffer.from(await r.arrayBuffer()) : null;
    if (!r.ok || !buf || buf.length < 500){
      live = false;
      issues.push({ sev: 'خطأ', msg: 'الرمز صحيحٌ لكنّ التوليد أخفق (' + r.status +
        (buf ? ' · ' + buf.length + ' بايت' : '') + ') — المورد لا يخدم' });
    } else {
      live = true;
    }
  } catch (e){
    issues.push({ sev: 'تنبيه', msg: 'تعذّر اختبار التوليد: ' + String(e.message || e).slice(0, 60) });
  }

  /* ═══ ٣ · نصيبنا من الحصّة ═══ */
  try {
    used = await usedThisMonth();
    const pct = used.sec / FREE_STT_SEC;
    if (pct >= WARN_AT){
      issues.push({ sev: 'تنبيه', msg: 'استهلكنا ' + Math.round(pct * 100) + '٪ من حصّة الشهر (' +
        Math.round(used.sec / 60) + ' من ٣٠٠ دقيقة) — عند الحدّ تتوقّف الخدمة' });
    }
  } catch (e){
    issues.push({ sev: 'خبر', msg: 'تعذّر حساب الاستهلاك: ' + String(e.message || e).slice(0, 50) });
  }

  return { live, region, used, issues };
};

/* يُشغَّل وحده أيضًا (من GitHub Actions كلّ يوم):
     node checks/azure.js
   يخرج بحالة ١ إن كانت الخدمة متوقّفة، فيصل الأب إشعارُ الإخفاق
   من غيثب في اليوم نفسه لا بعد أن يشتكي الأولاد. */
if (require.main === module){
  module.exports().then(res => {
    console.log('المنطقة: ' + (res.region || '—') +
      ' · الحالة: ' + (res.live === true ? '✅ تعمل' : res.live === false ? '⛔ متوقّفة' : '— لم تُفحص') +
      (res.used ? ' · استهلاك الشهر: ' + Math.round(res.used.sec / 60) + ' من ٣٠٠ دقيقة' : ''));
    let bad = 0;
    res.issues.forEach(i => {
      console.log((i.sev === 'خطأ' ? '❌' : i.sev === 'تنبيه' ? '⚠️' : 'ℹ️') + ' ' + i.msg);
      if (i.sev === 'خطأ') bad++;
    });
    if (!res.issues.length) console.log('✅ لا ملاحظات');
    if (bad) console.log('::error::خدمة النطق متوقّفة — المايكروفون لا يعمل عند الأولاد الآن');
    process.exit(bad ? 1 : 0);
  }).catch(e => { console.error('تعذّر الفحص: ' + (e && e.stack || e)); process.exit(2); });
}
