import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../i18n/Language";
import { analyticsConfigured, consentKey, readAnalyticsConsent, trackPageView } from "../lib/analytics";
import "./Analytics.css";

export default function Analytics() {
  const { pathname, search } = useLocation();
  const { language } = useLanguage();
  const [consent, setConsent] = useState(readAnalyticsConsent);
  const [editing, setEditing] = useState(false);
  const publicPage = ["/", "/contacto", "/cotizar"].includes(pathname);
  const en = language === "en";
  useEffect(() => { trackPageView(); }, [pathname, search, consent]);
  function choose(value) {
    try { localStorage.setItem(consentKey, value); } catch { /* Without storage, tracking stays disabled. */ }
    setConsent(value); setEditing(false);
  }
  if (!analyticsConfigured || !publicPage) return null;
  if (consent && !editing) return <button className="analytics-preferences" onClick={() => setEditing(true)}>{en ? "Cookies" : "Cookies"}</button>;
  return <section className="analytics-consent" aria-label={en ? "Analytics preferences" : "Preferencias de analítica"}>
    <div><strong>{en ? "Help us improve this website" : "Ayúdanos a mejorar esta web"}</strong>
      <p>{en ? "With your permission, we use Google Analytics cookies to measure visits and successful enquiries. Form contents are not sent to Google. You can change your choice in Cookies." : "Con tu permiso, usamos cookies de Google Analytics para medir visitas y consultas enviadas. No enviamos el contenido de formularios a Google. Puedes cambiar tu elección en Cookies."} <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noreferrer">{en ? "How Google uses data" : "Cómo usa Google los datos"}</a></p>
    </div>
    <div className="analytics-actions"><button onClick={() => choose("rejected")}>{en ? "Reject" : "Rechazar"}</button><button onClick={() => choose("accepted")}>{en ? "Accept analytics" : "Aceptar analítica"}</button></div>
  </section>;
}
