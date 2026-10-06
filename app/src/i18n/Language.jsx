import { createContext, useContext, useEffect, useState, Children, isValidElement, Fragment, cloneElement } from "react";
import en from "./en.json";
import "./language.css";
const LanguageContext = createContext({ language: "es", setLanguage: () => {} });
const TranslateContext = createContext(true);
const spanish = { "OFFICIAL": "OFICIAL", "SEARCH": "BUSCAR", "SELECTED": "SELECCIONADO", "TIP": "CONSEJO", "Open docs →": "Abrir documentación →", "Open project": "Abrir proyecto", "Open selected documentation": "Abrir documentación seleccionada", "Empty key": "Casilla vacía", "Empty": "Vacío", "Website": "Sitio web" };
export function translate(text, language) {
  if (typeof text !== "string") return text;
  if (language !== "en") return spanish[text.trim()] || text;
  const normalized = text.replace(/\s+/g, " ").trim();
  const translated = en[normalized];
  if (translated) return `${/^\s/.test(text) ? " " : ""}${translated}${/\s$/.test(text) ? " " : ""}`;
  const patterns = [
    [/^Seleccionar documentación de (.+)$/, (_, a) => `Select documentation for ${a}`],
    [/^Abrir docs oficiales de (.+)$/, (_, a) => `Open official docs for ${a}`],
    [/^Abrir búsqueda de (.+)$/, (_, a) => `Search documentation for ${a}`],
    [/^Consultas gratuitas restantes: (\d+)\.$/, (_, a) => `Free questions remaining: ${a}.`],
    [/^Paso (\d+) de (\d+)$/, (_, a, b) => `Step ${a} of ${b}`],
    [/^Calificar con (\d+) estrellas$/, (_, a) => `Rate ${a} stars`],
    [/^Conversación con (.+)$/, (_, a) => `Conversation with ${a}`],
    [/^Escribe una respuesta para (.+)…$/, (_, a) => `Write a reply to ${a}…`],
    [/^(\d+) pendientes de lectura$/, (_, a) => `${a} waiting to be read`],
  ];
  for (const [pattern, replacement] of patterns) if (pattern.test(normalized)) return normalized.replace(pattern, replacement);
  return text;
}
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => { try { return localStorage.getItem("ortegon-language") === "en" ? "en" : "es"; } catch { return "es"; } });
  useEffect(() => { document.documentElement.lang = language; try { localStorage.setItem("ortegon-language", language); } catch { /* Preference works without storage. */ } }, [language]);
  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
}
export function useLanguage() { return useContext(LanguageContext); }
// Translate display text without changing form values, URLs or identifiers.
export function Localized({ as: Element = "span", children, translate: enabled, ...props }) {
  const { language } = useLanguage();
  const inherited = useContext(TranslateContext);
  const active = inherited && enabled !== false && enabled !== "no";
  const text = value => active ? translate(value, language) : value;
  const translatedProps = { ...props };
  for (const key of ["placeholder", "title", "alt", "aria-label"]) if (typeof props[key] === "string") translatedProps[key] = text(props[key]);
  if (Element === "option" && props.value === undefined && typeof children === "string") translatedProps.value = children;
  const localizeChildren = nodes => Children.map(nodes, child => {
    if (!isValidElement(child)) return text(child);
    // Fragments have no DOM element of their own to translate their text.
    if (child.type === Fragment) return cloneElement(child, {}, localizeChildren(child.props.children));
    return child;
  });
  const content = localizeChildren(children);
  const element = <Element {...translatedProps} translate={enabled}>{content}</Element>;
  return active === inherited ? element : <TranslateContext.Provider value={active}>{element}</TranslateContext.Provider>;
}
export function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();
  return <div className="language-switch" role="group" aria-label={language === "es" ? "Idioma de la página" : "Page language"}>
    {[["es", "ES", "Español"], ["en", "EN", "English"]].map(([value, label, title]) => <button key={value} type="button" lang={value} title={title} aria-label={title} aria-pressed={language === value} onClick={() => setLanguage(value)}>{label}</button>)}
  </div>;
}
