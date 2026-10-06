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
    <section className={`premium-hero ${paused ? "premium-hero--paused" : ""}`} aria-labelledby="hero-title">
      <div className="hero-shell">
        <motion.div className="hero-copy" initial="hidden" animate="show" transition={{ staggerChildren: reduced ? 0 : 0.1 }}>
          <motion.p variants={enter} className="hero-eyebrow"><span /> SOLUCIONES TECNOLÓGICAS ORTEGÓN</motion.p>
          <motion.h1 variants={enter} id="hero-title">Tu próxima gran idea.<br /><span>Hagámosla realidad.</span></motion.h1>
          <motion.p variants={enter} className="hero-description">Software, automatización e inteligencia artificial para que tu negocio avance. Un aliado tecnológico que convierte tus retos en soluciones.</motion.p>
          <motion.div variants={enter} className="hero-actions">
            <button type="button" className="hero-primary" onClick={explore}>Explorar soluciones <ArrowUpRight size={18} /></button>
            <Link to="/cotizar" className="hero-secondary">Hablemos de tu proyecto <ArrowUpRight size={17} /></Link>
          </motion.div>
          <motion.div variants={enter} className="hero-capabilities"><span><Code2 size={15} /> Desarrollo web</span><span><Sparkles size={15} /> Automatización</span><span><Bot size={15} /> Inteligencia artificial</span></motion.div>
        </motion.div>
        <motion.div className="hero-visual-wrap" initial={{ opacity: reduced ? 1 : 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : 0.8 }}>
          <div ref={visual} className="hero-visual" onPointerMove={tilt} onPointerLeave={() => visual.current?.style.setProperty("--tilt", "0deg")}>
            <div className="hero-mascot-backdrop" aria-hidden="true" /><div className="hero-mascot-shadow" aria-hidden="true" />
            <div className="hero-mascot-tilt"><img className="hero-mascot" src={robot} alt="El robot de Ortegón sonríe y sostiene una tablet" width="1000" height="1000" loading="lazy" decoding="async" draggable="false" /></div>
            <div className="hero-label hero-label--top"><span className="hero-label-icon"><Sparkles size={18} /></span><div><strong>Ideas que evolucionan</strong><span>Ingeniería + inteligencia artificial</span></div></div>
            <div className="hero-label hero-label--bottom"><span className="hero-label-icon"><Code2 size={18} /></span><div><strong>Creado para tu negocio</strong><span>Soluciones a tu medida</span></div></div>
            <span className="hero-dot hero-dot--one" aria-hidden="true" /><span className="hero-dot hero-dot--two" aria-hidden="true" />
          </div>
          {!reduced && <button type="button" className="hero-motion-control" onClick={() => { setPaused(value => !value); visual.current?.style.setProperty("--tilt", "0deg"); }} aria-label={paused ? "Reanudar animación" : "Pausar animación"} aria-pressed={paused}>{paused ? <Play size={12} /> : <Pause size={12} />}{paused ? "Reanudar movimiento" : "Pausar movimiento"}</button>}
        </motion.div>
      </div>
      <div className="hero-bottom"><span>TECNOLOGÍA CON UN PROPÓSITO: TU NEGOCIO.</span><button type="button" onClick={explore}>Conoce lo que podemos crear <ArrowDown size={15} /></button></div>
    </section>
  );
}
