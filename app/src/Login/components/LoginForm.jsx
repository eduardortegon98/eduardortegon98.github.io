import { Localized } from "../../i18n/Language";
import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { requireSupabase, supabase, isPasswordRecovery, finishPasswordRecovery } from "../../lib/supabase";
import FormStatus from "../../components/FormStatus";
import Challenge from "../../Walkie/Challenge";
import LoginHeader from "./LoginHeader";

const field = "mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-3 text-[var(--color-text)]";
const button = "w-full rounded-xl bg-[var(--color-primary)] p-3 font-semibold text-[var(--color-text)] transition hover:bg-[var(--color-primary-hover)] disabled:opacity-60";
const hasCaptcha = Boolean(import.meta.env.VITE_TURNSTILE_SITE_KEY);
const redirectTo = () => new URL(`${import.meta.env.BASE_URL}login`, window.location.origin).href;
function authError(error, fallback) {
  if (error.code === "email_not_confirmed") return "Confirma tu correo antes de iniciar sesión.";
  if (error.status === 429) return "Demasiados intentos. Espera unos minutos y vuelve a intentarlo.";
  if (error.code === "weak_password") return "La contraseña no cumple los requisitos de seguridad. Usa una más larga con letras, números y símbolos.";
  if (error.code === "signup_disabled") return "El registro está deshabilitado. Contáctanos para activar una cuenta.";
  if (error.code === "captcha_failed") return "No se pudo verificar el CAPTCHA. Inténtalo nuevamente.";
  return fallback;
}
export default function LoginForm() {
  const lock = useRef(false);
  const [mode, setMode] = useState("login");
  const [pending, setPending] = useState(false), [status, setStatus] = useState(null);
  const [user, setUser] = useState(null), [recovery, setRecovery] = useState(isPasswordRecovery);
  const [captcha, setCaptcha] = useState(""), [challengeReset, setChallengeReset] = useState(0);
  const register = mode === "register" && !recovery;
  useEffect(() => {
    if (!supabase) return;
    let active = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (active) { setUser(session?.user ?? null); if (event === "PASSWORD_RECOVERY") setRecovery(true); }
    });
    supabase.auth.getSession().then(({ data }) => { if (active) setUser(data.session?.user ?? null); });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);
  async function run(action) {
    if (lock.current) return;
    lock.current = true; setPending(true); setStatus(null);
    try { await action(requireSupabase()); }
    catch (error) { setStatus({ success: false, message: error.message || "No pudimos conectarnos. Inténtalo nuevamente." }); }
    finally { lock.current = false; setPending(false); setCaptcha(""); setChallengeReset(value => value + 1); }
  }
  function switchMode(next) { setMode(next); setStatus(null); setCaptcha(""); setChallengeReset(value => value + 1); }
  function submit(event) {
    event.preventDefault();
    const form = event.currentTarget, fields = new FormData(form);
    if ((recovery || register) && fields.get("password") !== fields.get("confirmation")) {
      setStatus({ success: false, message: "Las contraseñas no coinciden." }); return;
    }
    if (hasCaptcha && !recovery && !captcha) { setStatus({ success: false, message: "Completa la verificación antes de continuar." }); return; }
    run(async client => {
      const password = fields.get("password"), email = fields.get("email")?.trim();
      if (register) {
        const { data, error } = await client.auth.signUp({ email, password, options: { emailRedirectTo: redirectTo(), ...(captcha ? { captchaToken: captcha } : {}) } });
        if (error) throw new Error(authError(error, "No pudimos crear la cuenta. Revisa tus datos o intenta iniciar sesión si ya tienes una."));
        setUser(data.session?.user ?? null);
        setStatus({ success: true, message: data.session ? "Cuenta creada. Tu sesión ya está activa." : "Revisa tu correo para confirmar tu cuenta, incluida la carpeta de spam. Si ya tenías una cuenta, inicia sesión o recupera tu contraseña." });
      } else {
        const { error } = recovery ? await client.auth.updateUser({ password }) : await client.auth.signInWithPassword({ email, password, ...(captcha ? { options: { captchaToken: captcha } } : {}) });
        if (error) throw new Error(authError(error, recovery ? "No pudimos actualizar la contraseña. Solicita un nuevo enlace." : "No se pudo iniciar sesión. Revisa tus credenciales."));
        setStatus({ success: true, message: recovery ? "Contraseña actualizada." : "Sesión iniciada correctamente." });
        finishPasswordRecovery(); setRecovery(false);
      }
      form.reset();
    });
  }
  function reset(event) {
    const email = event.currentTarget.form.elements.email;
    if (!email.reportValidity()) return;
    if (hasCaptcha && !captcha) { setStatus({ success: false, message: "Completa la verificación antes de continuar." }); return; }
    run(async client => {
      const { error } = await client.auth.resetPasswordForEmail(email.value.trim(), { redirectTo: redirectTo(), ...(captcha ? { captchaToken: captcha } : {}) });
      if (error) throw new Error(authError(error, "No pudimos solicitar la recuperación. Inténtalo nuevamente."));
      setStatus({ success: true, message: "Si el correo está registrado, recibirás un enlace para cambiar tu contraseña." });
    });
  }
  if (user && !recovery) return <Navigate to="/panel" replace />;
  return <>
    <LoginHeader mode={recovery ? "recovery" : mode} />
    {!recovery && <Localized as="div" className="mt-7 grid grid-cols-2 gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-1" aria-label="Opciones de acceso">{[["login", "Iniciar sesión"], ["register", "Crear cuenta"]].map(([value, label]) => <Localized as="button" key={value} type="button" disabled={pending} aria-pressed={mode === value} onClick={() => switchMode(value)} className={`rounded-lg px-3 py-3 text-sm font-semibold transition ${mode === value ? "bg-[var(--color-primary)]" : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]"}`}>{label}</Localized>)}</Localized>}
    <Localized as="form" key={recovery ? "recovery" : mode} onSubmit={submit} className="mt-7 space-y-5" aria-busy={pending}>
      <Localized as="fieldset" disabled={pending} className="space-y-5">
        {!recovery && <Localized as="label" className="block text-sm font-medium">Correo electrónico<Localized as="input" name="email" type="email" required maxLength={254} autoComplete="email" className={field} /></Localized>}
        <Localized as="div"><Localized as="label" htmlFor="account-password" className="block text-sm font-medium">{recovery ? "Nueva contraseña" : "Contraseña"}</Localized><Localized as="input" id="account-password" name="password" type="password" required minLength={recovery || register ? 8 : undefined} maxLength={128} autoComplete={recovery || register ? "new-password" : "current-password"} aria-describedby={register ? "password-help" : undefined} className={field} />{register && <Localized as="p" id="password-help" className="mt-2 text-xs text-[var(--color-text-muted)]">Usa al menos 8 caracteres. Recomendamos letras, números y símbolos.</Localized>}</Localized>
        {(recovery || register) && <Localized as="label" className="block text-sm font-medium">Confirmar contraseña<Localized as="input" name="confirmation" type="password" required minLength={8} maxLength={128} autoComplete="new-password" className={field} /></Localized>}
        {!recovery && !register && <Localized as="button" type="button" onClick={reset} className="text-sm text-[var(--color-accent)] hover:underline">¿Olvidaste tu contraseña?</Localized>}
        {register && <Localized as="p" className="text-xs leading-relaxed text-[var(--color-text-muted)]">Tu cuenta te permite continuar tus consultas con el asistente. Podemos pedirte confirmar tu correo antes de iniciar sesión.</Localized>}
        {hasCaptcha && !recovery && <Challenge onToken={setCaptcha} reset={challengeReset} />}
        <Localized as="button" disabled={pending || (hasCaptcha && !recovery && !captcha)} className={button}>{pending ? "Procesando..." : recovery ? "Guardar contraseña" : register ? "Registrarme" : "Entrar"}</Localized>
      </Localized>
      <FormStatus status={status} />
    </Localized>
  </>;
}
