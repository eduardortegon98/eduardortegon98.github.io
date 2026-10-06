import { Localized } from "../i18n/Language";
import { useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Pause, Play, Sparkles, Code2, Bot } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import robot from "../assets/ortegon-robot-hero.webp";
import "./Hero.css";

export default function Hero() {
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const visual = useRef(null);
  const enter = { hidden: { opacity: reduced ? 1 : 0, y: reduced ? 0 : 18 }, show: { opacity: 1, y: 0, transition: { duration: reduced ? 0 : 0.65 } } };
  function explore() { document.getElementById("products")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" }); }
  function tilt(event) {
    if (reduced || paused || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    visual.current.style.setProperty("--tilt", `${((event.clientX - rect.left) / rect.width - 0.5) * 8}deg`);
  }
  return (
    <Localized as="section" className={`premium-hero ${paused ? "premium-hero--paused" : ""}`} aria-labelledby="hero-title">
      <Localized as="div" className="hero-shell">
        <Localized as={motion.div} className="hero-copy" initial="hidden" animate="show" transition={{ staggerChildren: reduced ? 0 : 0.1 }}>
          <Localized as={motion.p} variants={enter} className="hero-eyebrow"><Localized as="span" /> SOLUCIONES TECNOLÓGICAS ORTEGÓN</Localized>
          <Localized as={motion.h1} variants={enter} id="hero-title">Tu próxima gran idea.<Localized as="br" /><Localized as="span">Hagámosla realidad.</Localized></Localized>
          <Localized as={motion.p} variants={enter} className="hero-description">Software, automatización e inteligencia artificial para que tu negocio avance. Un aliado tecnológico que convierte tus retos en soluciones.</Localized>
          <Localized as={motion.div} variants={enter} className="hero-actions">
            <Localized as="button" type="button" className="hero-primary" onClick={explore}>Explorar soluciones <ArrowUpRight size={18} /></Localized>
            <Localized as={Link} to="/cotizar" className="hero-secondary">Hablemos de tu proyecto <ArrowUpRight size={17} /></Localized>
          </Localized>
          <Localized as={motion.div} variants={enter} className="hero-capabilities"><Localized as="span"><Code2 size={15} /> Desarrollo web</Localized><Localized as="span"><Sparkles size={15} /> Automatización</Localized><Localized as="span"><Bot size={15} /> Inteligencia artificial</Localized></Localized>
        </Localized>
        <Localized as={motion.div} className="hero-visual-wrap" initial={{ opacity: reduced ? 1 : 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : 0.8 }}>
          <Localized as="div" ref={visual} className="hero-visual" onPointerMove={tilt} onPointerLeave={() => visual.current?.style.setProperty("--tilt", "0deg")}>
            <Localized as="div" className="hero-mascot-backdrop" aria-hidden="true" /><Localized as="div" className="hero-mascot-shadow" aria-hidden="true" />
            <Localized as="div" className="hero-mascot-tilt"><Localized as="img" className="hero-mascot" src={robot} alt="El robot de Ortegón sonríe y sostiene una tablet" width="1000" height="1000" loading="lazy" decoding="async" draggable="false" /></Localized>
            <Localized as="div" className="hero-label hero-label--top"><Localized as="span" className="hero-label-icon"><Sparkles size={18} /></Localized><Localized as="div"><Localized as="strong">Ideas que evolucionan</Localized><Localized as="span">Ingeniería + inteligencia artificial</Localized></Localized></Localized>
            <Localized as="div" className="hero-label hero-label--bottom"><Localized as="span" className="hero-label-icon"><Code2 size={18} /></Localized><Localized as="div"><Localized as="strong">Creado para tu negocio</Localized><Localized as="span">Soluciones a tu medida</Localized></Localized></Localized>
            <Localized as="span" className="hero-dot hero-dot--one" aria-hidden="true" /><Localized as="span" className="hero-dot hero-dot--two" aria-hidden="true" />
          </Localized>
          {!reduced && <Localized as="button" type="button" className="hero-motion-control" onClick={() => { setPaused(value => !value); visual.current?.style.setProperty("--tilt", "0deg"); }} aria-label={paused ? "Reanudar animación" : "Pausar animación"} aria-pressed={paused}>{paused ? <Play size={12} /> : <Pause size={12} />}{paused ? "Reanudar movimiento" : "Pausar movimiento"}</Localized>}
        </Localized>
      </Localized>
      <Localized as="div" className="hero-bottom"><Localized as="span">TECNOLOGÍA CON UN PROPÓSITO: TU NEGOCIO.</Localized><Localized as="button" type="button" onClick={explore}>Conoce lo que podemos crear <ArrowDown size={15} /></Localized></Localized>
    </Localized>
  );
}
