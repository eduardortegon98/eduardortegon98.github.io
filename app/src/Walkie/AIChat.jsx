import { Localized } from "../i18n/Language";
import { useEffect, useRef, useState } from "react";
import { Bot, X } from "lucide-react";
import { supabase, requireSupabase } from "../lib/supabase";
import Challenge from "./Challenge";

const field = "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-[var(--color-text)]";
const button = "rounded-xl bg-[var(--color-primary)] px-4 py-3 font-semibold text-[var(--color-text)] disabled:opacity-50";
const whatsapp = "https://wa.me/573337255586";
export default function AIChat() {
  const [open, setOpen] = useState(false), [message, setMessage] = useState("");
  const [turns, setTurns] = useState([]), [pending, setPending] = useState(false);
  const [status, setStatus] = useState(""), [loginRequired, setLoginRequired] = useState(false);
  const [user, setUser] = useState(null), [remaining, setRemaining] = useState(null);
  const [handoff, setHandoff] = useState(false), [authOpen, setAuthOpen] = useState(false);
  const [captcha, setCaptcha] = useState(""), [challengeReset, setChallengeReset] = useState(0);
  const lock = useRef(false), bottom = useRef(null);
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        setTurns([]); setRemaining(null); setLoginRequired(false); setAuthOpen(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  useEffect(() => { bottom.current?.scrollIntoView({ block: "nearest" }); }, [turns, pending]);
  useEffect(() => {
    const escape = event => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, []);
  async function request(payload) {
    if (!import.meta.env.VITE_CHAT_URL) throw new Error("El asistente aún no está configurado. Contáctanos por WhatsApp.");
    const { data } = await requireSupabase().auth.getSession();
    const response = await fetch(import.meta.env.VITE_CHAT_URL, {
      method: "POST", headers: { "Content-Type": "application/json",
        ...(data.session ? { Authorization: "Bearer " + data.session.access_token } : {}) },
      body: JSON.stringify({ ...payload, captcha }), signal: AbortSignal.timeout(35000),
    });
    const result = await response.json();
    if (!response.ok) {
      if (result.code === "login_required" || result.code === "auth") { setLoginRequired(true); setAuthOpen(true); }
      throw new Error(result.message || "El asistente no está disponible. Contáctanos por WhatsApp.");
    }
    return result;
  }
  async function run(action) {
    if (lock.current) return;
    lock.current = true; setPending(true); setStatus("");
    try { await action(); } catch (error) { setStatus(error.name === "TimeoutError" ? "La respuesta tardó demasiado. Puedes solicitar un agente." : error.message); }
    finally { lock.current = false; setPending(false); setCaptcha(""); setChallengeReset(value => value + 1); }
  }
  function send(event) {
    event.preventDefault();
    const text = message.trim();
    if (!text || text.length > 500 || loginRequired) return;
    run(async () => {
      const result = await request({ action: "message", message: text });
      setTurns(current => [...current.slice(-18), { role: "user", text }, { role: "assistant", text: result.answer }]);
      setMessage(""); setRemaining(result.remaining);
      if (!user && result.remaining === 0) { setLoginRequired(true); setAuthOpen(true); }
    });
  }
  function authenticate(event, signup) {
    event.preventDefault();
    const form = event.currentTarget.closest("form");
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    run(async () => {
      const client = requireSupabase();
      const credentials = { email: data.get("email").trim(), password: data.get("password") };
      const result = signup ? await client.auth.signUp({ ...credentials, options: { emailRedirectTo: window.location.origin + "/", captchaToken: captcha } }) :
        await client.auth.signInWithPassword({ ...credentials, options: { captchaToken: captcha } });
      if (result.error) throw new Error(signup ? "No pudimos crear la cuenta. Revisa los datos e inténtalo más tarde." : "No pudimos iniciar sesión. Revisa tus credenciales y confirma tu correo.");
      setStatus(signup ? "Revisa tu correo para confirmar la cuenta y luego inicia sesión." : "Sesión iniciada. Hablemos de tu proyecto.");
      form.reset();
    });
  }
  function sendHandoff(event) {
    event.preventDefault(); const form = event.currentTarget; const data = new FormData(form);
    run(async () => {
      const result = await request({ action: "handoff", name: data.get("name"), contact: data.get("contact"), reason: data.get("reason"), consent: data.get("consent") === "on" });
      setStatus(result.message); setHandoff(false); form.reset();
    });
  }
  return <>
    <Localized as="button" type="button" onClick={() => setOpen(true)} aria-label="Abrir asistente de la empresa" className="fixed bottom-6 right-6 z-50 rounded-full bg-[var(--color-primary)] p-4 text-[var(--color-text)] shadow-xl"><Bot /></Localized>
    {open && <Localized as="section" role="dialog" aria-modal="false" aria-label="Asistente de Soluciones Ortegón" className="fixed bottom-4 right-4 left-4 z-[60] flex max-h-[90svh] flex-col overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-[0_14px_40px_rgba(32,58,43,0.08)] sm:left-auto sm:w-[420px]">
      <Localized as="header" className="flex items-center justify-between border-b border-[var(--color-border)] p-4"><Localized as="div"><Localized as="h2" className="font-bold">Asistente Ortegón</Localized><Localized as="p" className="text-xs text-[var(--color-text-muted)]">IA para consultas sobre nuestros servicios</Localized></Localized><Localized as="button" type="button" onClick={() => setOpen(false)} aria-label="Cerrar asistente"><X /></Localized></Localized>
      <Localized as="div" className="space-y-3 overflow-y-auto p-4">
        <Localized as="p" className="rounded-xl bg-[var(--color-surface)] p-3 text-sm">Hola, ¿qué necesitas para tu negocio? Puedes consultar nuestros servicios o solicitar atención de Eduard.</Localized>
        <Localized as="p" className="text-xs text-[var(--color-text-muted)]">Guardamos las consultas para continuar la conversación y controlar el uso. No compartas información sensible. La IA puede equivocarse.</Localized>
        <Localized as="div" role="log" aria-label="Conversación" aria-live="polite" className="space-y-3">{turns.map((turn, index) => <Localized as="p" key={index} className={`whitespace-pre-wrap rounded-xl p-3 text-sm ${turn.role === "user" ? "ml-6 bg-[var(--color-primary)]/15" : "mr-6 bg-[var(--color-surface)]"}`}><Localized as="strong" className="block text-xs text-[var(--color-text-muted)]">{turn.role === "user" ? "Tú" : "Asistente"}</Localized><Localized as="span" translate="no">{turn.text}</Localized></Localized>)}</Localized>
        {pending && <Localized as="p" role="status" className="text-sm">Procesando…</Localized>}
        {status && <Localized as="p" role="status" className="rounded-xl border border-[var(--color-border)] p-3 text-sm">{status}</Localized>}
        {!user && <Localized as="p" className="text-xs text-[var(--color-text-muted)]">{remaining === null ? "Hasta 4 consultas sin registro." : `Consultas gratuitas restantes: ${remaining}.`} El límite se comparte por IP.</Localized>}
        {user && <Localized as="p" className="text-xs text-[var(--color-text-muted)]">Sesión activa. Hasta 20 consultas al día; solo asuntos de la empresa.</Localized>}
        {authOpen && !user && <Localized as="form" onSubmit={event => authenticate(event, false)} className="space-y-3 rounded-xl border border-[var(--color-border)] p-3">
          <Localized as="p" className="text-sm">Inicia sesión o crea una cuenta con correo confirmado.</Localized>
          <Localized as="label" className="block text-sm">Correo<Localized as="input" name="email" type="email" required maxLength={254} autoComplete="email" className={field}/></Localized>
          <Localized as="label" className="block text-sm">Contraseña<Localized as="input" name="password" type="password" required minLength={8} maxLength={128} autoComplete="current-password" className={field}/></Localized>
          <Localized as="div" className="flex gap-2"><Localized as="button" disabled={pending || !captcha} className={button}>Entrar</Localized><Localized as="button" type="button" disabled={pending || !captcha} onClick={event => authenticate(event, true)} className="rounded-xl border border-[var(--color-border)] p-3">Crear cuenta</Localized></Localized>
        </Localized>}
        {handoff && <Localized as="form" onSubmit={sendHandoff} className="space-y-3 rounded-xl border border-[var(--color-border)] p-3">
          <Localized as="label" className="block text-sm">Nombre<Localized as="input" name="name" required maxLength={120} className={field}/></Localized>
          <Localized as="label" className="block text-sm">WhatsApp o correo<Localized as="input" name="contact" required maxLength={254} className={field}/></Localized>
          <Localized as="label" className="block text-sm">¿En qué necesitas ayuda?<Localized as="textarea" name="reason" required maxLength={500} defaultValue={message} className={field}/></Localized>
          <Localized as="label" className="flex gap-2 text-xs"><Localized as="input" name="consent" type="checkbox" required/>Autorizo compartir estos datos con Eduard para que me contacte.</Localized>
          <Localized as="button" disabled={pending || (!user && !captcha)} className={button}>Enviar solicitud a Eduard</Localized>
        </Localized>}
        <Localized as="div" ref={bottom}/>
      </Localized>
      <Localized as="footer" className="space-y-3 border-t border-[var(--color-border)] p-4">
        {!user && <Challenge onToken={setCaptcha} reset={challengeReset}/>}
        <Localized as="form" onSubmit={send} className="space-y-2"><Localized as="label" className="sr-only" htmlFor="ai-message">Mensaje al asistente</Localized><Localized as="textarea" id="ai-message" value={message} onChange={event => setMessage(event.target.value)} required maxLength={500} rows={2} placeholder="Cuéntanos sobre tu proyecto…" disabled={pending || loginRequired} className={field}/>
          <Localized as="div" className="flex items-center justify-between"><Localized as="span" className="text-xs text-[var(--color-text-muted)]">{message.length}/500</Localized><Localized as="button" disabled={pending || loginRequired || !message.trim() || (!user && !captcha)} className={button}>Enviar</Localized></Localized>
        </Localized>
        <Localized as="div" className="flex flex-wrap gap-3 text-sm"><Localized as="button" type="button" disabled={pending} onClick={() => {setHandoff(value => !value); setAuthOpen(false);}}>Solicitar agente</Localized><Localized as="a" href={whatsapp} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)]">WhatsApp directo</Localized>{!user && <Localized as="button" type="button" onClick={() => setAuthOpen(value => !value)}>Iniciar sesión</Localized>}</Localized>
      </Localized>
    </Localized>}
  </>;
}
