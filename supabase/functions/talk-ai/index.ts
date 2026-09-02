// Supabase Edge Function: talk-ai
// وسيط آمن بين صفحة المحادثة (talk.html) ونموذج ذكاء اصطناعي.
// المفتاح يبقى سرًّا على السيرفر ولا يظهر في المتصفح.
//
// النشر (مرة واحدة، أو بعد أيّ تعديلٍ على هذا الملف):
//   1) احصل على مفتاح Gemini مجّاني من https://aistudio.google.com/apikey
//   2) أضف السرّ:   supabase secrets set GEMINI_API_KEY=المفتاح
//   3) انشر:        supabase functions deploy talk-ai --no-verify-jwt
//  (أو من لوحة Supabase: Edge Functions → إنشاء دالة talk-ai + Secrets)
//
// بديل: لو حطّيت OPENAI_API_KEY بدل Gemini، يستخدمه تلقائيًا.

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// اللصق من الجوال كثير يجيب مسافة أو سطر جديد أو علامات تنصيص حول المفتاح،
// وقوقل ترفض المفتاح وقتها بـ 401. ننظّفه قبل الاستعمال.
function cleanKey(raw: string | undefined): string {
  let k = String(raw || "").trim();
  k = k.replace(/^["'“”‘’]+|["'“”‘’]+$/g, "");
  k = k.replace(/\s+/g, "");
  // النسخ من المتصفّح قد يجلب محارف غير مرئية (مسافة غير فاصلة، علامات اتجاه،
  // BOM) لا يمسكها \s وترفضها الترويسة بـ«not a valid ByteString».
  // نُبقي فقط المحارف التي تسمح بها ترويسة HTTP (ASCII المطبوع).
  k = k.replace(/[^\x21-\x7E]/g, "");
  return k;
}

/* بلاغ الأب (٢ سبتمبر ٢٠٢٦): «هل يطلع لي نسبة صحة الجملة؟» — التقييم
   السابق كان صوتيًّا بحتًا (نطق الكلمات عبر Azure)، ولا شيء يقيس هل
   الجملة التي قالها الطفل صحيحةٌ نحويًّا ومعناها مضبوط. صار النموذج
   نفسه (الذي يردّ على الطفل أصلًا) يُقيّم جملته الأخيرة معه في نفس
   الطلب — لا طلبٌ إضافي، فلا تكلفة أو بطءٌ زائد — ويُعيد الردّ بصيغة
   JSON منظّمة بدل نصٍّ حرّ، ليقدر talk.html يستخرج التقييم بثقة. */
function sys(child: string, topic: string): string {
  return [
    `You are a warm, patient English conversation partner for ${child || "a student"}, an Arabic-speaking school child.`,
    `Speak ONLY in simple, clear English suitable for a young learner.`,
    `Keep your "reply" to 1-2 short sentences, then ask ONE easy follow-up question to keep the conversation going.`,
    `Be encouraging and friendly. Never use difficult words. Never write Arabic. Do not use emojis heavily (one at most).`,
    `Also silently grade the CHILD'S LAST message for basic English correctness (grammar, word order, word choice) —`,
    `be lenient, as expected from a young learner speaking aloud, and ignore capitalization/punctuation since it comes from speech-to-text, not real writing mistakes.`,
    `Set "correct" to true if the sentence is understandable and reasonably correct English for this age, false only if it has a real grammar mistake.`,
    `If false, set "fixed" to the corrected full sentence (simple English, same meaning); otherwise leave "fixed" as an empty string.`,
    `Respond ONLY with a JSON object, no text before or after it, in exactly this shape: {"reply": "...", "correct": true, "fixed": ""}`,
    topic ? `Current topic: ${topic}.` : "",
  ].filter(Boolean).join(" ");
}

type ModelResult = { reply: string; correct: boolean | null; fixed: string | null };

/* استخراج {reply, correct, fixed} من نصّ النموذج الخام. بعض النماذج
   تُغلّف الـJSON بأسوار ```json``` رغم التعليمات — نُزيلها. وإن فشل
   التحليل كليًّا (نموذجٌ لم يلتزم بالصيغة) نُرجع النصّ الخام كردٍّ
   عاديّ بلا تقييم (correct:null) بدل إفشال الطلب كلّه — فالردّ نفسه
   أهمّ من التقييم، ولا نُخاطر به. */
function parseModelJSON(raw: string): ModelResult {
  let t = raw.trim();
  if (t.startsWith("```")) t = t.replace(/^```json?\s*/i, "").replace(/```\s*$/, "").trim();
  try {
    const obj = JSON.parse(t);
    const reply = String(obj.reply || "").trim();
    if (!reply) throw new Error("empty reply");
    return {
      reply,
      correct: typeof obj.correct === "boolean" ? obj.correct : null,
      fixed: (obj.fixed && String(obj.fixed).trim()) || null,
    };
  } catch {
    return { reply: raw.trim(), correct: null, fixed: null };
  }
}

// بلاغ الأب (٣١ أغسطس ٢٠٢٦): المحادثة "آلية مكررة" — يقصد الردّ
// الاحتياطي المُقيَّد بأسئلةٍ ثابتة، لأنّ talk-ai كانت تفشل دائمًا فيرجع
// إليه. فحصنا الاتصال الحقيقي بالدالّة فوجدناها تصل Gemini فعلًا (المفتاح
// سليم، لا 401 كما كان موثَّقًا سابقًا)، لكنّها تنهار بخطأ "503 مزدحمٌ
// حاليًا" باستمرار — وسبب هذا أنّ "gemini-flash-latest" صار يُشير الآن
// إلى Gemini 3.7 Flash، النموذج الذي أُطلق قبل أيامٍ قليلة (١٣ أغسطس
// ٢٠٢٦) ولا يزال زحامه شديدًا من كثرة من يهاجرون إليه. فنحاول عليه أوّلًا
// (فهو الأحدث)، وإن ازدحم (503) نُعيد المحاولة مرّةً بعد مهلةٍ قصيرة —
// فرسالة Google نفسها تقول إنّ الازدحام "عادةً مؤقّت" — فإن استمرّ نتحوّل
// إلى "gemini-2.5-flash" الأقدم والأكثر استقرارًا كخيارٍ أخير.
async function callGeminiModel(model: string, key: string, system: string, contents: any[]): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    // ملاحظة: maxOutputTokens مرتفع لأن موديلات Gemini الحديثة تستهلك جزءًا في "التفكير"؛ نبقيه واسعًا وردّ النظام يبقى قصيرًا.
    body: JSON.stringify({
      system_instruction: { parts: [{ text: system }] },
      contents,
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.85,
        topP: 0.9,
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            reply: { type: "STRING" },
            correct: { type: "BOOLEAN" },
            fixed: { type: "STRING" },
          },
          required: ["reply", "correct"],
        },
      },
    }),
  });
  if (!res.ok) {
    const status = res.status;
    const bodyText = (await res.text()).slice(0, 200);
    const err = new Error("gemini " + status + " (keyLen=" + key.length + ") " + bodyText) as Error & { status?: number };
    err.status = status;
    throw err;
  }
  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];
  return parts.map((p: any) => p.text || "").join(" ").trim();
}
function sleep(ms: number): Promise<void> { return new Promise((r) => setTimeout(r, ms)); }
async function callGemini(key: string, system: string, messages: any[]): Promise<string> {
  const contents = messages.slice(-14).map((m) => ({
    role: m.role === "model" ? "model" : "user",
    parts: [{ text: String(m.content || "") }],
  }));
  // مفاتيح Google الجديدة تبدأ بـ«AQ.» ولا تُقبل في ?key= بل في ترويسة x-goog-api-key،
  // والقديمة «AIza» تُقبل في الاثنين — فنرسلها في الترويسة دائمًا (مُطبَّقٌ داخل callGeminiModel).
  // محاولتان لا ثلاث: كل محاولةٍ فاشلة على Gemini تستغرق نحو ١٠ ثوانٍ في
  // الملاحظة الفعلية، فثلاثٌ منها وحدها تلامس مهلة العميل. محاولتان هنا
  // تترك متّسعًا لمحاولة OpenAI بعدهما (انظر Deno.serve أسفله) دون تجاوز
  // مهلة العميل الإجمالية.
  const models = ["gemini-flash-latest", "gemini-2.5-flash"];
  const delays = [0, 500];
  let lastErr: unknown = null;
  for (let i = 0; i < models.length; i++) {
    if (delays[i]) await sleep(delays[i]);
    try {
      return await callGeminiModel(models[i], key, system, contents);
    } catch (e) {
      lastErr = e;
      const status = (e as { status?: number })?.status;
      // 401/403 (مفتاحٌ فاسد) لا تنفع فيه إعادة المحاولة على نموذجٍ آخر — نتوقّف فورًا.
      if (status === 401 || status === 403) throw e;
      // غير ذلك (503 ازدحام غالبًا) نجرّب الخطوة التالية في القائمة.
    }
  }
  throw lastErr;
}

async function callOpenAI(key: string, system: string, messages: any[]): Promise<string> {
  const msgs = [{ role: "system", content: system }].concat(
    messages.slice(-14).map((m) => ({
      role: m.role === "model" ? "assistant" : "user",
      content: String(m.content || ""),
    })),
  );
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + key },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: msgs,
      max_tokens: 200,
      temperature: 0.85,
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) throw new Error("openai " + res.status + " " + (await res.text()).slice(0, 200));
  const data = await res.json();
  return (data?.choices?.[0]?.message?.content || "").trim();
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: cors });

  try {
    const body = await req.json().catch(() => ({}));
    const messages = Array.isArray(body.messages) ? body.messages : [];
    if (!messages.length) {
      return new Response(JSON.stringify({ error: "no messages" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
    }
    const system = sys(body.child || "", body.topic || "");

    const gk = cleanKey(Deno.env.get("GEMINI_API_KEY"));
    const ok = cleanKey(Deno.env.get("OPENAI_API_KEY"));
    if (!gk && !ok) {
      return new Response(JSON.stringify({ error: "no API key configured" }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
    }
    // بلاغ الأب (٣١ أغسطس ٢٠٢٦): كان الكود يختار مزوّدًا واحدًا فقط حسب
    // أيّ مفتاحٍ موجود (Gemini إن وُجد، وإلّا OpenAI) — فلو أُضيف مفتاح
    // OpenAI بجانب مفتاح Gemini القائم، بقي Gemini هو المُستعمَل دائمًا
    // ولن يُجرَّب OpenAI أبدًا مهما فشل Gemini؛ إذ لم يكن هناك تحوّلٌ بين
    // مزوِّدَين، بل اختيارٌ واحدٌ فقط عند بداية الطلب. فصرنا نُجرِّب Gemini
    // أوّلًا إن وُجد مفتاحه (مجّانيّ)، فإن فشل ووُجد مفتاح OpenAI (مدفوع)
    // نستعمله ملاذًا أخيرًا بدل الاستسلام مباشرةً للردّ الآلي بالعميل.
    let raw = "";
    let lastErr: unknown = null;
    if (gk) {
      try { raw = await callGemini(gk, system, messages); }
      catch (e) { lastErr = e; }
    }
    if (!raw && ok) {
      try { raw = await callOpenAI(ok, system, messages); lastErr = null; }
      catch (e) { lastErr = e; }
    }
    if (!raw && lastErr) throw lastErr;

    let result: ModelResult = raw ? parseModelJSON(raw) : { reply: "", correct: null, fixed: null };
    if (!result.reply) result.reply = "That's nice! Can you tell me more?";
    return new Response(JSON.stringify(result), { headers: { ...cors, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String((e as Error)?.message || e) }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
  }
});
