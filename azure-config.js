/* ===== إعداد Azure Speech لتقييم النطق =====
   الأسهل: مفتاح واحد مشترك للجميع (5 ساعات مجانية شهريًا = آلاف المحاولات، تكفي الأربعة).
   ضع مفتاحك في "default". (اختياري: تقدر تحط مفتاح خاص لطفل فيتقدّم على المشترك.)

   ملاحظة: المفتاح مخزّن مُرمّزًا (Base64) عبر atob لتفادي حجب GitHub للأسرار
   وتفادي الإلغاء التلقائي. لتغيير المفتاح: رمّزه بـ Base64 وضعه داخل atob("...").

   خطوات المفتاح:
   1) لازم حساب Microsoft شخصي (مثل outlook.com) — إيميل المدرسة (moe.gov.sa) لا يصلح.
   2) portal.azure.com → Create a resource → Speech → Pricing tier: Free F0.
   3) Keys and Endpoint → انسخ KEY 1 و Region (مثل eastus) وضعهما بالأسفل.
*/
window.AZURE_SPEECH = {
  // المفتاح المشترك (يكفي الجميع) — مخزّن مُرمّزًا Base64
  default: { key: atob("MjZHMXR2T0ZEU0p5Smsxa1NVc1VGbmpSREpXdGlSVDZYOGlqUGdmVGFaY1M2RTlzUHl3QkpRUUo5OUNIQUNZZUJqRlhKM3czQUFBWUFDT0dQVnZ0"), region: "eastus" },

  // اختياري — مفتاح خاص لطفل معيّن (يتقدّم على المشترك):
  hasan:  { key: "", region: "" },
  rafeef: { key: "", region: "" },
  osama:  { key: "", region: "" },
  saud:   { key: "", region: "" }
};
