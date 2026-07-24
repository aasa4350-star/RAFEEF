/* قفل بكلمة مرور لكل الصفحات.
   الحماية "قفل رابط" — تمنع من يفتح الرابط بدون كلمة المرور.
   لتغيير كلمة المرور: احسب SHA-256 للكلمة الجديدة وضعها في PW_HASH. */
(function () {
  var KEY = "rafeef_auth_v1";
  var PW_HASH = "ef26a007e8ce86f234d90558116832a305989082cddd9f7148676a97c595d46f"; // = rafeef2026

  async function sha(s) {
    var b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
    return Array.from(new Uint8Array(b)).map(function (x) { return x.toString(16).padStart(2, "0"); }).join("");
  }

  try { if (localStorage.getItem(KEY) === PW_HASH) return; } catch (e) {}

  function mount() {
    if (document.getElementById("__gate")) return;
    var ov = document.createElement("div");
    ov.id = "__gate";
    ov.setAttribute("style",
      "position:fixed;inset:0;z-index:2147483647;background:#0b1220;color:#fff;" +
      "display:flex;align-items:center;justify-content:center;direction:rtl;" +
      "font-family:Tahoma,'Segoe UI',system-ui,sans-serif");
    ov.innerHTML =
      '<div style="text-align:center;padding:24px;max-width:330px;width:90%">' +
        '<div style="font-size:2.6rem">🔒</div>' +
        '<h2 style="margin:10px 0 4px;font-size:1.4rem">صفحة محمية</h2>' +
        '<p style="opacity:.75;font-size:.9rem;margin:0 0 14px">اكتب كلمة المرور للدخول</p>' +
        '<input id="__pw" type="password" inputmode="text" autocomplete="off" ' +
          'style="width:100%;padding:13px;border-radius:12px;border:0;font-size:1.1rem;text-align:center;box-sizing:border-box">' +
        '<button id="__go" style="width:100%;padding:13px;border-radius:12px;border:0;margin-top:12px;' +
          'background:#3b5bdb;color:#fff;font-weight:800;font-size:1.05rem;cursor:pointer">دخول</button>' +
        '<p id="__err" style="color:#f87171;font-size:.85rem;height:18px;margin:10px 0 0"></p>' +
      '</div>';
    (document.body || document.documentElement).appendChild(ov);

    var pw = document.getElementById("__pw");
    var err = document.getElementById("__err");
    async function go() {
      var h = await sha(pw.value);
      if (h === PW_HASH) {
        try { localStorage.setItem(KEY, PW_HASH); } catch (e) {}
        ov.remove();
      } else {
        err.textContent = "كلمة المرور غير صحيحة";
        pw.value = ""; pw.focus();
      }
    }
    document.getElementById("__go").addEventListener("click", go);
    pw.addEventListener("keydown", function (e) { if (e.key === "Enter") go(); });
    pw.focus();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
