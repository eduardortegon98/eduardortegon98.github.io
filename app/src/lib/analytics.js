const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
export const analyticsConfigured = /^G-[A-Z0-9]+$/.test(measurementId || "");
export const consentKey = "ortegon-analytics-consent";
const publicPages = new Set(["/", "/contacto", "/cotizar"]);
let initialized = false;
let lastPage = null;

export function readAnalyticsConsent() {
  try { return localStorage.getItem(consentKey); } catch { return null; }
}

function allowed() {
  return analyticsConfigured && readAnalyticsConsent() === "accepted" && publicPages.has(location.pathname);
}

function initialize() {
  if (initialized || !allowed()) return;
  initialized = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("consent", "default", {
    analytics_storage: "granted", ad_storage: "denied",
    ad_user_data: "denied", ad_personalization: "denied",
  });
  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    send_page_view: false, allow_google_signals: false,
    allow_ad_personalization_signals: false,
    page_location: location.origin + location.pathname,
    page_referrer: safeReferrer(),
  });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);
}

function safeReferrer() {
  try { const url = new URL(document.referrer); return url.origin + url.pathname; } catch { return ""; }
}

export function trackPageView() {
  if (!allowed()) {
    lastPage = null;
    window.gtag?.("consent", "update", { analytics_storage: "denied" });
    window.gtag?.("set", { page_location: location.origin + "/", page_referrer: "" });
    return;
  }
  initialize();
  window.gtag("consent", "update", { analytics_storage: "granted" });
  const page = location.origin + location.pathname;
  if (page === lastPage) return;
  lastPage = page;
  const campaign = {};
  const params = new URLSearchParams(location.search);
  for (const [query, key] of [["utm_source", "campaign_source"], ["utm_medium", "campaign_medium"], ["utm_campaign", "campaign_name"]]) {
    const value = params.get(query);
    if (value && /^[a-zA-Z0-9_-]{1,80}$/.test(value)) campaign[key] = value;
  }
  window.gtag("set", { page_location: page, page_referrer: safeReferrer() });
  window.gtag("event", "page_view", { send_to: measurementId, page_location: page, page_referrer: safeReferrer(), ...campaign });
}

export function trackLead(kind) {
  if (!allowed() || !["contact", "quote"].includes(kind)) return;
  try {
    initialize();
    window.gtag("event", "generate_lead", {
      send_to: measurementId, form_name: kind, lead_source: "website",
      page_location: location.origin + location.pathname,
    });
  } catch { /* Analytics must never affect a saved submission. */ }
}
