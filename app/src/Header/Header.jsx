import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Localized, LanguageSwitch, useLanguage } from "../i18n/Language";
import Logo from "../../public/Soluciones_Tecnologicas_Ortegon.png";
import "./Header.css";
const navItems = [{ label: "Login", href: "/login" }, { label: "Contacto", href: "/contacto" }];
export default function Header() {
  const { pathname } = useLocation();
  const { language } = useLanguage();
  const [open, setOpen] = useState(false), [visible, setVisible] = useState(true), [scrolled, setScrolled] = useState(false);
  const header = useRef(null);
  useEffect(() => { setOpen(false); setVisible(true); }, [pathname]);
  useEffect(() => {
    let previous = window.scrollY, frame;
    const update = () => {
      frame = undefined;
      const y = Math.max(0, window.scrollY);
      setScrolled(y > 16);
      const focused = header.current?.contains(document.activeElement) && document.activeElement.matches(":focus-visible");
      if (y < 160 || open || focused) setVisible(true);
      else if (Math.abs(y - previous) >= 8) setVisible(y < previous);
      if (Math.abs(y - previous) >= 8 || y < 160) previous = y;
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const escape = event => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("keydown", escape);
    return () => { window.removeEventListener("scroll", scroll); window.removeEventListener("keydown", escape); if (frame) cancelAnimationFrame(frame); };
  }, [open]);
  const shown = visible || open;
  return <Localized as="header" ref={header} className={`site-header ${scrolled ? "is-scrolled" : ""} ${shown ? "" : "is-hidden"}`} inert={!shown ? true : undefined} onFocusCapture={() => setVisible(true)}>
    <Localized as="div" className="site-header-bar">
      <Localized as={Link} to="/" className="site-brand" aria-label="Soluciones Tecnológicas Ortegón">
        <Localized as="span" className="site-brand-mark"><Localized as="img" src={Logo} loading="lazy" decoding="async" width="1536" height="1024" alt="" /></Localized>
        <Localized as="span" className="site-brand-copy"><Localized as="span">Soluciones Tecnológicas</Localized><Localized as="strong">Ortegón<Localized as="i" aria-hidden="true">.</Localized></Localized></Localized>
      </Localized>
      <Localized as="div" className="site-header-actions"><Localized as="nav" className="site-desktop-nav" aria-label={language === "en" ? "Main navigation" : "Navegación principal"}>{navItems.map(item => <Localized as={Link} key={item.href} to={item.href} aria-current={pathname === item.href ? "page" : undefined}>{item.label}</Localized>)}<Localized as={Link} className="site-quote" to="/cotizar" aria-current={pathname === "/cotizar" ? "page" : undefined}>Cotizar<ArrowUpRight size={16} /></Localized></Localized><LanguageSwitch /><Localized as="button" className="site-menu-toggle" type="button" aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open} aria-controls="site-mobile-navigation" onClick={() => { setOpen(value => !value); setVisible(true); }}>{open ? <X size={21} /> : <Menu size={21} />}</Localized></Localized>
    </Localized>
    {open && <Localized as="nav" id="site-mobile-navigation" className="site-mobile-nav" aria-label={language === "en" ? "Main navigation" : "Navegación principal"}>{navItems.map(item => <Localized as={Link} key={item.href} to={item.href} aria-current={pathname === item.href ? "page" : undefined} onClick={() => setOpen(false)}>{item.label}</Localized>)}<Localized as={Link} to="/cotizar" className="site-quote" onClick={() => setOpen(false)}>Cotizar<ArrowUpRight size={16} /></Localized></Localized>}
  </Localized>;
}
