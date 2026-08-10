/* ===== إعداد Azure Speech لتقييم النطق =====
   الأسهل: مفتاح واحد مشترك للجميع (5 ساعات مجانية شهريًا = آلاف المحاولات، تكفي الأربعة).
   ضع مفتاحك في "default". (اختياري: تقدر تحط مفتاح خاص لطفل فيتقدّم على المشترك.)

   خطوات المفتاح:
   1) لازم حساب Microsoft شخصي (مثل outlook.com) — إيميل المدرسة (moe.gov.sa) لا يصلح.
   2) portal.azure.com → Create a resource → Speech → Pricing tier: Free F0.
   3) Keys and Endpoint → انسخ KEY 1 و Region (مثل eastus) وضعهما بالأسفل.
*/
window.AZURE_SPEECH = {
  default: { key: "", region: "" },   // ← المفتاح المشترك (يكفي الجميع)

  // اختياري — مفتاح خاص لطفل معيّن (يتقدّم على المشترك):
  hasan:  { key: "", region: "" },
  rafeef: { key: "", region: "" },
  osama:  { key: "", region: "" },
  saud:   { key: "", region: "" }
};
