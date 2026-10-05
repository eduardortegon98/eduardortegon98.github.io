import { INSTRUCTIONS, POLICY, validateBody, makeInput, extractText, fixedReply } from "./policy.mjs";

async function rpc(env, name, body) {
  const response = await fetch(env.SUPABASE_URL + "/rest/v1/rpc/" + name, {
    method: "POST", headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: "Bearer " + env.SUPABASE_SERVICE_ROLE_KEY, "Content-Type": "application/json" },
    body: JSON.stringify(body), signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error("database");
  return response.status === 204 ? null : response.json();
}
async function identity(request, env) {
  const token = request.headers.get("Authorization");
  if (!token) return null;
  if (!/^Bearer [A-Za-z0-9_.-]+$/.test(token)) throw new Error("auth");
  const response = await fetch(env.SUPABASE_URL + "/auth/v1/user", {
    headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: token }, signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error("auth");
  const user = await response.json();
  if (!user.id || !user.email_confirmed_at || user.is_anonymous) throw new Error("auth");
  return user.id;
}
async function hashIP(ip, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(ip));
  return Array.from(new Uint8Array(signature), x => x.toString(16).padStart(2, "0")).join("");
}
export async function notify(env) {
  // Leave the queue untouched until WhatsApp is configured.
  if (!env.WHATSAPP_ACCESS_TOKEN || !env.WHATSAPP_PHONE_NUMBER_ID || !env.WHATSAPP_GRAPH_VERSION ||
      !env.WHATSAPP_AGENT_TEMPLATE || !env.WHATSAPP_ALERT_TEMPLATE || !env.WHATSAPP_TEMPLATE_LANGUAGE) return;
  if (!/^v\d+\.\d+$/.test(env.WHATSAPP_GRAPH_VERSION) || !/^\d+$/.test(env.WHATSAPP_TO) || !/^\d+$/.test(env.WHATSAPP_PHONE_NUMBER_ID)) throw new Error("whatsapp_config");
  const alerts = await rpc(env, "chat_claim_alerts", {});
  for (const alert of alerts) {
    let success = false;
    let failure = "whatsapp_timeout";
    try {
      const response = await fetch("https://graph.facebook.com/" + env.WHATSAPP_GRAPH_VERSION + "/" + env.WHATSAPP_PHONE_NUMBER_ID + "/messages", {
        method: "POST", headers: { Authorization: "Bearer " + env.WHATSAPP_ACCESS_TOKEN, "Content-Type": "application/json" },
        body: JSON.stringify({
          messaging_product: "whatsapp", to: env.WHATSAPP_TO, type: "template",
          template: { name: alert.kind === "agent" ? env.WHATSAPP_AGENT_TEMPLATE : env.WHATSAPP_ALERT_TEMPLATE,
            language: { code: env.WHATSAPP_TEMPLATE_LANGUAGE },
            components: [{ type: "body", parameters: [{ type: "text", text: alert.detail.replace(/\s+/g, " ").slice(0, 700) }] }] },
        }), signal: AbortSignal.timeout(10000),
      });
      const result = await response.json();
      success = response.ok && !!result.messages?.[0]?.id;
      failure = success ? "" : "whatsapp_http_" + response.status;
    } catch { /* queue retry; never log tokens or visitor text */ }
    await rpc(env, "chat_ack_alert", { p_id: alert.id, p_lease: alert.lease, p_success: success, p_error: failure });
  }
}
const messages = {
  login_required: "Ya usaste tus 4 mensajes gratuitos. Inicia sesión o crea una cuenta para continuar.",
  daily_limit: "Llegaste al límite de mensajes de hoy. Puedes solicitar un agente.",
  cooldown: "Espera unos segundos antes de enviar otro mensaje.",
  handoff_limit: "Ya recibimos tus solicitudes de contacto de hoy.",
  blocked: "El acceso se suspendió temporalmente por demasiados intentos. Inténtalo en una hora.",
  paused: "El asistente está pausado. Puedes solicitar un agente o escribirnos por WhatsApp.",
};
export default {
  async fetch(request, env, ctx) {
    const cors = { "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN, "Access-Control-Allow-Headers": "authorization,content-type",
      "Access-Control-Allow-Methods": "POST,OPTIONS", "Cache-Control": "no-store", Vary: "Origin" };
    const reply = (data, status = 200) => Response.json(data, { status, headers: cors });
    if (request.headers.get("Origin") !== env.ALLOWED_ORIGIN) return reply({ code: "forbidden" }, 403);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST" || new URL(request.url).pathname !== "/chat") return reply({ code: "not_found" }, 404);
    if (!env.OPENAI_API_KEY || !env.SUPABASE_SERVICE_ROLE_KEY || !env.IP_HASH_SECRET || !env.TURNSTILE_SECRET_KEY) return reply({ code: "unavailable", message: "El asistente aún no está configurado. Contáctanos por WhatsApp." }, 503);
    let reservation, ip;
    try {
      // Cloudflare supplies this header at its ingress. Never accept an IP from JSON or X-Forwarded-For.
      const clientIP = request.headers.get("CF-Connecting-IPv6") || request.headers.get("CF-Connecting-IP");
      if (!request.cf || !clientIP) return reply({ code: "unavailable" }, 503);
      if (!request.headers.get("Content-Type")?.startsWith("application/json")) return reply({ code: "invalid" }, 400);
      if (Number(request.headers.get("Content-Length") || 0) > 6000) return reply({ code: "invalid" }, 413);
      // Enforce a streamed byte limit even when Content-Length is absent.
      const reader = request.body?.getReader(); if (!reader) throw new Error("invalid");
      const chunks = []; let size = 0;
      while (true) {
        const { done, value } = await reader.read(); if (done) break;
        size += value.length; if (size > 6000) { await reader.cancel(); throw new Error("invalid"); }
        chunks.push(value);
      }
      const bytes = new Uint8Array(size); let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
      let body; try { body = JSON.parse(new TextDecoder().decode(bytes)); } catch { throw new Error("invalid"); }
      validateBody(body);
      const user = await identity(request, env);
      if (!user) {
        if (typeof body.captcha !== "string" || body.captcha.length > 2048) throw new Error("invalid");
        const verification = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
          method: "POST", body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: body.captcha, remoteip: clientIP }),
          signal: AbortSignal.timeout(8000),
        });
        const challenge = await verification.json();
        if (!challenge.success || challenge.hostname !== new URL(env.ALLOWED_ORIGIN).hostname || challenge.action !== "ortegon_chat") throw new Error("invalid");
      }
      ip = await hashIP(clientIP, env.IP_HASH_SECRET);
      const localAnswer = body.action === "message" ? fixedReply(body.message) : null;
      reservation = await rpc(env, "chat_reserve", { p_ip: ip, p_user: user, p_action: localAnswer ? "local" : body.action });
      if (reservation.code !== "ok") {
        ctx.waitUntil(notify(env).catch(() => console.error("notification_queue_error")));
        return reply({ code: reservation.code, message: messages[reservation.code] }, reservation.code === "paused" ? 503 : 429);
      }
      if (body.action === "handoff") {
        const id = await rpc(env, "chat_handoff", { p_ip: ip, p_subject: reservation.subject, p_lease: reservation.lease,
          p_name: body.name.trim(), p_contact: body.contact.trim(), p_reason: body.reason.trim() });
        ctx.waitUntil(notify(env).catch(() => console.error("notification_queue_error")));
        return reply({ code: "ok", requestId: id, message: "Tu solicitud quedó guardada para Eduard. Te contactaremos con los datos que nos diste." });
      }
      if (localAnswer) {
        await rpc(env, "chat_finish", { p_ip: ip, p_subject: reservation.subject, p_lease: reservation.lease,
          p_question: body.message.trim(), p_answer: localAnswer, p_usage: 0 });
        return reply({ code: "ok", answer: localAnswer, remaining: reservation.remaining });
      }
      const input = makeInput(reservation.history, body.message);
      // No automatic retries: an ambiguous timeout must not incur a second paid generation.
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST", headers: { Authorization: "Bearer " + env.OPENAI_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4.1-mini-2025-04-14", instructions: INSTRUCTIONS, input,
          max_output_tokens: POLICY.outputTokens, store: false }), signal: AbortSignal.timeout(20000),
      });
      if (!response.ok) throw new Error("provider");
      const result = await response.json();
      const answer = extractText(result);
      if (!answer) throw new Error("provider");
      await rpc(env, "chat_finish", { p_ip: ip, p_subject: reservation.subject, p_lease: reservation.lease,
        p_question: body.message.trim(), p_answer: answer, p_usage: result.usage?.total_tokens || 0 });
      return reply({ code: "ok", answer, remaining: reservation.remaining });
    } catch (error) {
      if (reservation?.code === "ok") {
        try { await rpc(env, "chat_finish", { p_ip: ip, p_subject: reservation.subject, p_lease: reservation.lease, p_question: "", p_answer: "", p_usage: 0 }); } catch { /* lease expires */ }
      }
      const code = ["auth", "invalid"].includes(error.message) ? error.message : "unavailable";
      return reply({ code, message: code === "auth" ? "Inicia sesión con un correo confirmado." :
        code === "invalid" ? "Revisa el mensaje y los datos de contacto." : "No pudimos responder. Puedes solicitar un agente." }, code === "auth" ? 401 : code === "invalid" ? 400 : 503);
    }
  },
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(notify(env).catch(() => console.error("notification_queue_error")));
  },
};
