/* ============================================================
   مدقّق مسار المايكروفون

   بلاغ الأب (٥ سبتمبر ٢٠٢٦): «التسجيل عند أسامة متعطل» — وهو تكرارُ
   بلاغ ٣١ أغسطس: «أسامة كلّ الأقسام تقبل معه إلّا قراءة القطعة».

   والعلّة أنّ المايكروفون كان يُفتح من جديد لكلّ دورة تعرّف
   (AudioConfig.fromDefaultMicrophoneInput داخل الحلقة)، فقراءةُ قطعةٍ
   واحدة تفتحه وتغلقه عشر مرّاتٍ أو أكثر — وهو أهشّ ما يكون على
   سفاري/آيفون. ولهذا كانت الكلمة المفردة تنجح (فتحٌ واحد) وتفشل
   القطعة (فتحٌ متكرّر). ثمّ زادت MIC.ensure فتحةً ثانيةً قبل أزور
   لأنّها كانت تأخذ الإذن ثمّ توقف المسار فورًا.

   والدواء: فتحٌ واحد، ومسارٌ حيٌّ يُسلَّم لأزور عبر
   مسارٍ جديدٍ لكلّ تعرّف. فيفحص هذا الملفّ أن يبقى كذلك:

   ١) لا صفحةَ تفتح المايك الافتراضيّ مباشرةً — كلّها عبر MIC.audioConfig.
   ٢) MIC.ensure لا توقف المسار الذي فتحته (وإلّا عادت الفتحة الثانية).
   ٣) mic-help.js يُصدّر ما تعتمد عليه الصفحات فعلًا.
   ٤) كلّ صفحةٍ تستعمل MIC تُحمّل mic-help.js.
   ٥) إصدار أداة النطق مثبَّتٌ لا @latest، وواحدٌ في الصفحات كلّها:
      @latest يجلب أحدث إصدارٍ مهما كان، فأيّ تحديثٍ من مايكروسوفت
      يصل أجهزة الأولاد الأربعة من تلقائه ويكسر التسجيل بلا أن نلمس
      شيئًا — وهو أسوأ عطلٍ لأنّه بلا سببٍ ظاهر. وإصداران مختلفان
      بين صفحتين أسوأ: يعمل قسمٌ ويُخفق آخر فيبدو العطل عشوائيًّا.
   ============================================================ */
const fs = require('fs');
const path = require('path');

const ROOT = () => process.env.MICCHK_DIR || path.join(__dirname, '..');
const HELP = 'mic-help.js';
/* الدوالّ التي تعتمد عليها الصفحات — إن سقطت واحدةٌ انكسر التسجيل صامتًا */
const NEEDED = ['audioConfig', 'ensure', 'releaseSoon', 'stream', 'release'];

/* وسمُ إصدار أداة النطق كما يظهر في وسم <script> */
const SDK_RE = /microsoft-cognitiveservices-speech-sdk@([^/"']+)/g;

module.exports = function mic() {
  const issues = [];
  const dir = ROOT();
  let pages = 0;
  const sdkVersions = {};   /* الإصدار → الصفحات التي تحمله */

  /* ═══ mic-help.js نفسه ═══ */
  const helpPath = path.join(dir, HELP);
  if (!fs.existsSync(helpPath)) {
    issues.push({ sev: 'خطأ', msg: HELP + ' — غير موجود، وكلّ صفحات النطق تعتمد عليه' });
    return { pages, issues };
  }
  const help = fs.readFileSync(helpPath, 'utf8');

  NEEDED.forEach(fn => {
    if (!new RegExp('\\b' + fn + '\\s*:').test(help)) {
      issues.push({ sev: 'خطأ', msg: HELP + ' — لا يُصدّر MIC.' + fn + ' والصفحات تستدعيه' });
    }
  });

  /* ensure يجب أن تحتفظ بالمسار لا أن توقفه.
     نقرأ جسم ensure وحده: إيقاف المسار مشروعٌ في release وdiagnose. */
  const em = /function\s+ensure\s*\([\s\S]*?\n  \}/.exec(help);
  if (!em) {
    issues.push({ sev: 'تنبيه', msg: HELP + ' — تعذّرت قراءة جسم ensure، فلم يُفحص إمساك المسار' });
  } else {
    /* القاعدة انقلبت بالدليل (٦ سبتمبر ٢٠٢٦): كنّا نُمسك مسار المايك
       ونُسلّمه لأزور مرّةً واحدة، فتبيّن من بيانات الأولاد أنّ ذلك يقطع
       الحوار من دوره الثاني على سفاري — المسار المستعمَل في سياقٍ صوتيٍّ
       أُغلق لا يُعطي صوتًا في سياقٍ جديد. فصار المطلوب عكسه:
       مسارٌ جديد لكلّ تعرّف، وensure تُحرّر مسار الإذن فورًا. */
    if (!/getTracks\(\)[\s\S]{0,80}\.stop\(\)/.test(em[0])) {
      issues.push({ sev: 'خطأ', msg: HELP + ' — ensure لا تُحرّر مسار الإذن: إمساكُه يُصمت الدور الثاني في سفاري ويُبقي المؤشّر مضاءً' });
    }
    if (/__micStream\s*=\s*st/.test(em[0])) {
      issues.push({ sev: 'خطأ', msg: HELP + ' — ensure تُمسك المسار في __micStream: هذا ما قطع المحادثة من دورها الثاني' });
    }
  }
  if (/fromStreamInput/.test(help)) {
    issues.push({ sev: 'خطأ', msg: HELP + ' — يُسلّم أزور مسارًا مُمسكًا (fromStreamInput): يعمل الدور الأوّل ويصمت ما بعده' });
  }
  if (!/fromDefaultMicrophoneInput/.test(help)) {
    issues.push({ sev: 'خطأ', msg: HELP + ' — لا يفتح مسارًا جديدًا لكلّ تعرّف (fromDefaultMicrophoneInput)' });
  }

  /* ═══ الصفحات ═══ */
  fs.readdirSync(dir).filter(f => /\.html$/.test(f)).forEach(file => {
    const src = fs.readFileSync(path.join(dir, file), 'utf8');
    const usesMic = /\bMIC\./.test(src);
    const loadsHelp = new RegExp('src\\s*=\\s*["\']' + HELP).test(src);
    if (!usesMic && !loadsHelp) return;
    pages++;

    if (usesMic && !loadsHelp) {
      issues.push({ sev: 'خطأ', msg: file + ' — يستعمل MIC ولا يُحمّل ' + HELP });
    }
    /* الفتح المباشر: مسموحٌ داخل mic-help وحده (بديلُ الطوارئ) */
    if (/AudioConfig\.fromDefaultMicrophoneInput/.test(src)) {
      issues.push({ sev: 'خطأ', msg: file + ' — يفتح المايك مباشرةً بـfromDefaultMicrophoneInput بدل MIC.audioConfig: فتحٌ جديد لكلّ دورة' });
    }
    /* من ينشئ مُتعرّفًا يجب أن يمرّ على MIC.audioConfig */
    if (/new\s+SDK\.SpeechRecognizer|new\s+SpeechSDK\.SpeechRecognizer/.test(src) && !/MIC\.audioConfig/.test(src)) {
      issues.push({ sev: 'خطأ', msg: file + ' — يُنشئ مُتعرّفًا بلا MIC.audioConfig' });
    }
    /* من فتح المايك يُغلقه: وإلّا بقي مؤشّر التسجيل مضاءً بعد الدرس */
    if (/MIC\.audioConfig/.test(src) && !/MIC\.releaseSoon|MIC\.release\b/.test(src)) {
      issues.push({ sev: 'تنبيه', msg: file + ' — يفتح المايك ولا يُغلقه (MIC.releaseSoon مفقود)' });
    }
    /* ٦) سببُ الإخفاق يُقرأ لا يُخمَّن: صفحةٌ تُنشئ مُتعرّفًا ولا تسأل
       أزور لماذا أخفقت تُعيدنا إلى التخمين الذي أضاع ثلاثة بلاغات. */
    if (/new\s+SDK\.SpeechRecognizer|new\s+SpeechSDK\.SpeechRecognizer/.test(src) && !/MIC\.why/.test(src)) {
      issues.push({ sev: 'خطأ', msg: file + ' — لا يقرأ سبب إخفاق أزور (MIC.why): كلّ سببٍ سيُعرض «ما وضح صوتك» ولن يبقى منه أثر' });
    }
    /* ٥) إصدار أداة النطق */
    SDK_RE.lastIndex = 0;
    let v;
    while ((v = SDK_RE.exec(src))) {
      const ver = v[1];
      (sdkVersions[ver] = sdkVersions[ver] || []).push(file);
      if (!/^\d+\.\d+\.\d+$/.test(ver)) {
        issues.push({ sev: 'خطأ', msg: file + ' — إصدار أداة النطق غير مثبَّت («' + ver + '»): أيّ تحديثٍ من مايكروسوفت يصل أجهزة الأولاد من تلقائه ويكسر التسجيل' });
      }
    }
  });

  const vers = Object.keys(sdkVersions);
  if (vers.length > 1) {
    issues.push({ sev: 'خطأ', msg: 'إصدارات أداة النطق مختلفة بين الصفحات — ' +
      vers.map(v => v + ': ' + sdkVersions[v].join('، ')).join(' · ') + ' — فيعمل قسمٌ ويُخفق آخر بلا سببٍ ظاهر' });
  }

  return { pages, sdk: vers.join(', ') || '—', issues };
};
