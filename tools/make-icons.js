/* يولّد أيقونات التطبيقات (icons/*.png) من رسمٍ متجهيٍّ واحد.
 *
 * لماذا مولّدٌ لا صورٌ جاهزة: كلّ أيقونةٍ تُطلب بثلاثة أشكال (١٩٢، ٥١٢،
 * وواحدةٌ قابلةٌ للقصّ)، وهي خمسُ أيقونات — خمسةَ عشر ملفًّا. لو رُسمت
 * باليد لتفرّقت عند أوّل تغييرِ لون. فالمصدر رسمٌ واحدٌ والباقي يُشتقّ.
 *
 * التشغيل:  NODE_PATH=/opt/node22/lib/node_modules node tools/make-icons.js
 *
 * لكلّ ولدٍ لونُه، فأربعُ أيقوناتٍ متجاورةٍ على شاشةٍ واحدة يُميّزها
 * الطفل بلونها قبل أن يقرأ اسمها. وأيقونة الأب أعمدةٌ صاعدةٌ لا كتاب،
 * فلا تختلط بتطبيقات الأولاد.
 */
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const OUT = path.join(__dirname, '..', 'icons');

/* كتابٌ مفتوح — للأولاد */
const BOOK =
  `<path d="M96 148 C96 132 150 122 200 136 L200 372 C150 358 96 368 96 384 Z" fill="#fff" opacity=".97"/>
   <path d="M416 148 C416 132 362 122 312 136 L312 372 C362 358 416 368 416 384 Z" fill="#fff" opacity=".97"/>
   <rect x="240" y="128" width="32" height="252" rx="14" fill="#fff" opacity=".55"/>`;

/* أعمدةٌ صاعدة — للأب */
const CHART =
  `<rect x="112" y="300" width="72" height="120" rx="20" fill="#fff" opacity=".9"/>
   <rect x="220" y="228" width="72" height="192" rx="20" fill="#fff" opacity=".95"/>
   <rect x="328" y="140" width="72" height="280" rx="20" fill="#fff"/>
   <circle cx="364" cy="96" r="26" fill="#fff"/>`;

const ART = {
  saud:   { deep:'#047857', accent:'#10b981', svg:BOOK  },   // أخضر
  osama:  { deep:'#c2410c', accent:'#f97316', svg:BOOK  },   // برتقالي
  rafeef: { deep:'#5b21b6', accent:'#8b5cf6', svg:BOOK  },   // بنفسجي
  hasan:  { deep:'#0e7490', accent:'#06b6d4', svg:BOOK  },   // أزرق مخضرّ
  dad:    { deep:'#2b3fa0', accent:'#4c6ef5', svg:CHART }    // أزرق
};

function page(kind, maskable){
  const a = ART[kind];
  /* القابلة للقصّ (maskable) تحتاج هامشًا: أندرويد يقصّها دائرةً أو
     مربّعًا مستديرًا، فإن ملأ الرسمُ الحافّةَ قُصّ طرفُه. */
  const pad = maskable ? 0.72 : 1;
  const radius = maskable ? 0 : 112;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    html,body{margin:0;padding:0;width:512px;height:512px;overflow:hidden}
  </style></head><body>
  <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${a.deep}"/><stop offset="100%" stop-color="${a.accent}"/>
    </linearGradient></defs>
    <rect width="512" height="512" rx="${radius}" fill="url(#g)"/>
    <g transform="translate(256,256) scale(${pad}) translate(-256,-256)">${a.svg}</g>
  </svg></body></html>`;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  let n = 0;
  for (const kind of Object.keys(ART)) {
    for (const [size, maskable] of [[192,false],[512,false],[512,true]]) {
      const p = await browser.newPage({ viewport:{ width:512, height:512 }, deviceScaleFactor: size/512 });
      await p.setContent(page(kind, maskable), { waitUntil:'load' });
      const name = `${kind}-${size}${maskable ? '-maskable' : ''}.png`;
      await p.screenshot({ path: path.join(OUT, name) });
      await p.close();
      n++;
    }
  }
  await browser.close();
  console.log('✅ وُلّدت ' + n + ' أيقونة في icons/');
})();
