import { useEffect, useRef } from "react";
export default function Challenge({ onToken, reset }) {
  const container = useRef(null);
  useEffect(() => {
    const sitekey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
    if (!sitekey) return;
    let alive = true, widget;
    const render = () => {
      if (!alive || !window.turnstile || !container.current) return;
      widget = window.turnstile.render(container.current, { sitekey, action: "ortegon_chat", theme: "light",
        callback: token => onToken(token), "expired-callback": () => onToken(""), "error-callback": () => onToken("") });
    };
    let script = document.querySelector('script[data-ortegon-turnstile]');
    if (!script) {
      script = document.createElement("script"); script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true; script.dataset.ortegonTurnstile = "true"; document.head.appendChild(script);
    }
    if (window.turnstile) render(); else script.addEventListener("load", render);
    return () => { alive = false; script.removeEventListener("load", render); if (widget !== undefined) window.turnstile?.remove(widget); };
  }, [onToken, reset]);
  return <div ref={container} className="min-h-12" aria-label="Verificación contra abuso"/>;
}
