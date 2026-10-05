import { useEffect, useRef, useState } from "react";
import { Bot, X } from "lucide-react";
import { supabase, requireSupabase } from "../lib/supabase";
import Challenge from "./Challenge";

const field = "w-full rounded-xl border border-white/15 bg-white/5 p-3 text-white";
const button = "rounded-xl bg-[#C0FDB9] px-4 py-3 font-semibold text-black disabled:opacity-50";
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
    <button type="button" onClick={() => setOpen(true)} aria-label="Abrir asistente de la empresa" className="fixed bottom-6 right-6 z-50 rounded-full bg-[#C0FDB9] p-4 text-black shadow-xl"><Bot /></button>
    {open && <section role="dialog" aria-modal="false" aria-label="Asistente de Soluciones Ortegón" className="fixed bottom-4 right-4 left-4 z-[60] flex max-h-[90svh] flex-col overflow-hidden rounded-3xl border border-white/15 bg-[#0b0d12] text-white shadow-2xl sm:left-auto sm:w-[420px]">
      <header className="flex items-center justify-between border-b border-white/10 p-4"><div><h2 className="font-bold">Asistente Ortegón</h2><p className="text-xs text-white/60">IA para consultas sobre nuestros servicios</p></div><button type="button" onClick={() => setOpen(false)} aria-label="Cerrar asistente"><X /></button></header>
      <div className="space-y-3 overflow-y-auto p-4">
        <p className="rounded-xl bg-white/5 p-3 text-sm">Hola, ¿qué necesitas para tu negocio? Puedes consultar nuestros servicios o solicitar atención de Eduard.</p>
        <p className="text-xs text-white/50">Guardamos las consultas para continuar la conversación y controlar el uso. No compartas información sensible. La IA puede equivocarse.</p>
        <div role="log" aria-label="Conversación" aria-live="polite" className="space-y-3">{turns.map((turn, index) => <p key={index} className={`whitespace-pre-wrap rounded-xl p-3 text-sm ${turn.role === "user" ? "ml-6 bg-[#C0FDB9]/15" : "mr-6 bg-white/5"}`}><strong className="block text-xs text-white/60">{turn.role === "user" ? "Tú" : "Asistente"}</strong>{turn.text}</p>)}</div>
        {pending && <p role="status" className="text-sm">Procesando…</p>}
        {status && <p role="status" className="rounded-xl border border-white/10 p-3 text-sm">{status}</p>}
        {!user && <p className="text-xs text-white/60">{remaining === null ? "Hasta 4 consultas sin registro." : `Consultas gratuitas restantes: ${remaining}.`} El límite se comparte por IP.</p>}
        {user && <p className="text-xs text-white/60">Sesión activa. Hasta 20 consultas al día; solo asuntos de la empresa.</p>}
        {authOpen && !user && <form onSubmit={event => authenticate(event, false)} className="space-y-3 rounded-xl border border-white/10 p-3">
          <p className="text-sm">Inicia sesión o crea una cuenta con correo confirmado.</p>
          <label className="block text-sm">Correo<input name="email" type="email" required maxLength={254} autoComplete="email" className={field}/></label>
          <label className="block text-sm">Contraseña<input name="password" type="password" required minLength={8} maxLength={128} autoComplete="current-password" className={field}/></label>
          <div className="flex gap-2"><button disabled={pending || !captcha} className={button}>Entrar</button><button type="button" disabled={pending || !captcha} onClick={event => authenticate(event, true)} className="rounded-xl border border-white/20 p-3">Crear cuenta</button></div>
        </form>}
        {handoff && <form onSubmit={sendHandoff} className="space-y-3 rounded-xl border border-white/10 p-3">
          <label className="block text-sm">Nombre<input name="name" required maxLength={120} className={field}/></label>
          <label className="block text-sm">WhatsApp o correo<input name="contact" required maxLength={254} className={field}/></label>
          <label className="block text-sm">¿En qué necesitas ayuda?<textarea name="reason" required maxLength={500} defaultValue={message} className={field}/></label>
          <label className="flex gap-2 text-xs"><input name="consent" type="checkbox" required/>Autorizo compartir estos datos con Eduard para que me contacte.</label>
          <button disabled={pending || (!user && !captcha)} className={button}>Enviar solicitud a Eduard</button>
        </form>}
        <div ref={bottom}/>
      </div>
      <footer className="space-y-3 border-t border-white/10 p-4">
        {!user && <Challenge onToken={setCaptcha} reset={challengeReset}/>}
        <form onSubmit={send} className="space-y-2"><label className="sr-only" htmlFor="ai-message">Mensaje al asistente</label><textarea id="ai-message" value={message} onChange={event => setMessage(event.target.value)} required maxLength={500} rows={2} placeholder="Cuéntanos sobre tu proyecto…" disabled={pending || loginRequired} className={field}/>
          <div className="flex items-center justify-between"><span className="text-xs text-white/50">{message.length}/500</span><button disabled={pending || loginRequired || !message.trim() || (!user && !captcha)} className={button}>Enviar</button></div>
        </form>
        <div className="flex flex-wrap gap-3 text-sm"><button type="button" disabled={pending} onClick={() => {setHandoff(value => !value); setAuthOpen(false);}}>Solicitar agente</button><a href={whatsapp} target="_blank" rel="noopener noreferrer" className="text-[#C0FDB9]">WhatsApp directo</a>{!user && <button type="button" onClick={() => setAuthOpen(value => !value)}>Iniciar sesión</button>}</div>
      </footer>
    </section>}
  </>;
}
