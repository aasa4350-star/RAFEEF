// Supabase Edge Function: talk-ai
// وسيط آمن بين صفحة المحادثة (talk.html) ونموذج ذكاء اصطناعي.
// المفتاح يبقى سرًّا على السيرفر ولا يظهر في المتصفح.
//
// النشر (مرة واحدة):
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
  return k;
}

function sys(child: string, topic: string): string {
  return [
    `You are a warm, patient English conversation partner for ${child || "a student"}, an Arabic-speaking school child.`,
    `Speak ONLY in simple, clear English suitable for a young learner.`,
    `Keep EVERY reply to 1-2 short sentences, then ask ONE easy follow-up question to keep the conversation going.`,
    `Be encouraging and friendly. If the child makes a small mistake, gently say the correct sentence once, without lecturing.`,
    `Never use difficult words. Never write Arabic. Do not use emojis heavily (one at most).`,
    topic ? `Current topic: ${topic}.` : "",
  ].filter(Boolean).join(" ");
}

async function callGemini(key: string, system: string, messages: any[]): Promise<string> {
  const contents = messages.slice(-14).map((m) => ({
    role: m.role === "model" ? "model" : "user",
    parts: [{ text: String(m.content || "") }],
  }));
  // مفاتيح Google الجديدة تبدأ بـ«AQ.» ولا تُقبل في ?key= بل في ترويسة x-goog-api-key،
  // والقديمة «AIza» تُقبل في الاثنين — فنرسلها في الترويسة دائمًا.
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    // ملاحظة: maxOutputTokens مرتفع لأن موديلات Gemini الحديثة تستهلك جزءًا في "التفكير"؛ نبقيه واسعًا وردّ النظام يبقى قصيرًا.
    body: JSON.stringify({
      system_instruction: { parts: [{ text: system }] },
      contents,
      generationConfig: { maxOutputTokens: 800, temperature: 0.85, topP: 0.9 },
    }),
  });
  if (!res.ok) {
    // نضيف طول المفتاح فقط (بدون كشفه) لأن 401 غالبًا سببه مفتاح ناقص أو ملصوق غلط.
    throw new Error(
      "gemini " + res.status + " (keyLen=" + key.length + ") " + (await res.text()).slice(0, 200),
    );
  }
  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];
  return parts.map((p: any) => p.text || "").join(" ").trim();
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
    body: JSON.stringify({ model: "gpt-4o-mini", messages: msgs, max_tokens: 120, temperature: 0.85 }),
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
    let reply = "";
    if (gk) reply = await callGemini(gk, system, messages);
    else if (ok) reply = await callOpenAI(ok, system, messages);
    else {
      return new Response(JSON.stringify({ error: "no API key configured" }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
    }

    if (!reply) reply = "That's nice! Can you tell me more?";
    return new Response(JSON.stringify({ reply }), { headers: { ...cors, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String((e as Error)?.message || e) }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
  }
});
