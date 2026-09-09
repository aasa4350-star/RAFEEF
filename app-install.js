/* يجعل الصفحة قابلةً للتثبيت تطبيقًا على شاشة الجوّال.
 *
 * لماذا بالجافاسكربت لا بوسومٍ ثابتة: صفحة الأولاد واحدةٌ لأربعتهم
 * (home.html?who=…)، ولكلّ ولدٍ تطبيقُه واسمُه ولونُه وأيقونتُه. فلو
 * كتبنا الوسوم ثابتةً لخرج الأربعة بأيقونةٍ واحدةٍ واسمٍ واحد. والنظام
 * يقرأ هذه الوسوم لحظةَ يضغط الأب «إضافة إلى الشاشة الرئيسية» — وهي
 * لحظةٌ بعد تحميل الصفحة بكثير — فحقنُها عند التحميل يكفي.
 *
 * ولا عاملَ خدمةٍ (service worker) هنا عن قصد: الموقع يُحدَّث كلّ يوم،
 * وذاكرةُ عامل الخدمة تُقدّم للطفل نسخةً قديمةً وهو لا يدري — وهذا أسوأ
 * من ألّا يكون تطبيقًا. والتثبيت على آيفون لا يحتاجه أصلًا.
 */
(function(){
  var KIDS = {
    saud:   { name:"سعود",  color:"#047857" },
    osama:  { name:"أسامة", color:"#c2410c" },
    rafeef: { name:"رفيف",  color:"#5b21b6" },
    hasan:  { name:"حسن",   color:"#0e7490" }
  };
  function qs(k){
    try{ return new URLSearchParams(location.search).get(k) || ""; }
    catch(e){
      var m = new RegExp("[?&]"+k+"=([^&]*)").exec(location.search);
      return m ? decodeURIComponent(m[1]) : "";
    }
  }
  var who  = String(qs("who")||"").toLowerCase();
  var kid  = KIDS[who] || null;
  var id   = kid ? who : "dad";
  var col  = kid ? kid.color : "#2b3fa0";
  var ttl  = kid ? kid.name  : "المتابعة";

  function put(tag, attrs){
    try{
      var el = document.createElement(tag);
      for(var k in attrs) el.setAttribute(k, attrs[k]);
      (document.head || document.documentElement).appendChild(el);
    }catch(e){}
  }
  /* لا نُكرّر وسمًا موجودًا في الصفحة أصلًا */
  function has(sel){ try{ return !!document.querySelector(sel); }catch(e){ return false; } }

  if(!has('link[rel="manifest"]'))              put("link", { rel:"manifest", href:"manifest-"+id+".json" });
  if(!has('meta[name="theme-color"]'))          put("meta", { name:"theme-color", content:col });
  if(!has('link[rel="apple-touch-icon"]'))      put("link", { rel:"apple-touch-icon", href:"icons/"+id+"-192.png" });
  put("meta", { name:"apple-mobile-web-app-capable", content:"yes" });
  put("meta", { name:"mobile-web-app-capable", content:"yes" });
  /* «default» لا «black-translucent»: الأخيرة تُمرّر المحتوى تحت شريط
     الحالة فيختفي أعلى العنوان، وهي زينةٌ ثمنُها سطرٌ مقطوع. */
  put("meta", { name:"apple-mobile-web-app-status-bar-style", content:"default" });
  put("meta", { name:"apple-mobile-web-app-title", content:ttl });

  /* هل نحن داخل التطبيق المثبَّت؟ نُعلّم الجذر ليُخفى دليلُ التثبيت
     ممّن ثبّته فعلًا (انظر app.html). */
  try{
    var standalone = (window.navigator && window.navigator.standalone === true) ||
      (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches);
    if(standalone) document.documentElement.classList.add("standalone");
  }catch(e){}
})();
