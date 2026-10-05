import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Pause, Play, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useInView, useReducedMotion, useMotionValue, useSpring } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import "./Hero.css";

export default function Hero() {
  const { theme } = useTheme();
  const reduced = useReducedMotion();
  const section = useRef(null), video = useRef(null);
  const visible = useInView(section, { amount: 0.15 });
  const [paused, setPaused] = useState(false), [ready, setReady] = useState(false);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const x = useMotionValue(0), y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 80, damping: 22 });
  const rotateY = useSpring(y, { stiffness: 80, damping: 22 });
  const base = import.meta.env.BASE_URL + "media/";
  useEffect(() => { if (reduced) setPaused(true); }, [reduced]);
  useEffect(() => {
    const change = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", change);
    return () => document.removeEventListener("visibilitychange", change);
  }, []);
  useEffect(() => {
    if (!video.current) return;
    if (visible && pageVisible && !paused && !reduced) {
      video.current.play().catch(() => setReady(false));
    } else video.current.pause();
  }, [visible, pageVisible, paused, reduced]);
  const enter = {
    hidden: { opacity: reduced ? 1 : 0, y: reduced ? 0 : 22 },
    show: { opacity: 1, y: 0, transition: { duration: reduced ? 0 : 0.75, ease: [0.22, 1, 0.36, 1] } },
  };
  function tilt(event) {
    if (reduced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(-((event.clientY - rect.top) / rect.height - 0.5) * 6);
    y.set(((event.clientX - rect.left) / rect.width - 0.5) * 6);
  }
  function explore() {
    document.getElementById("products")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }
  return (
    <section ref={section} className={`premium-hero ${theme === "light" ? "premium-hero--light" : ""} ${paused || !visible || !pageVisible ? "premium-hero--paused" : ""}`} aria-labelledby="hero-title">
      <div className="hero-ambient" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-shell">
        <motion.div className="hero-copy" initial="hidden" animate="show" transition={{ staggerChildren: reduced ? 0 : 0.12, delayChildren: reduced ? 0 : 0.12 }}>
          <motion.p variants={enter} className="hero-eyebrow"><span /> SOLUCIONES TECNOLÓGICAS ORTEGÓN</motion.p>
          <motion.h1 variants={enter} id="hero-title">Soluciones de<br />ingeniería.<br /><span>Diseñadas con IA.</span></motion.h1>
          <motion.p variants={enter} className="hero-description">Menos tareas manuales. Más posibilidades para tu negocio. Creamos software y automatizamos procesos con el compromiso de un aliado tecnológico.</motion.p>
          <motion.div variants={enter} className="hero-actions">
            <button type="button" className="hero-primary" onClick={explore}>Explorar soluciones <ArrowUpRight size={19} /></button>
            <Link to="/cotizar" className="hero-secondary">Hablemos de tu proyecto <ArrowUpRight size={17} /></Link>
          </motion.div>
          <motion.div variants={enter} className="hero-capabilities"><span>Desarrollo web</span><i /><span>Automatización</span><i /><span>Inteligencia artificial</span></motion.div>
        </motion.div>
        <motion.div className="hero-visual-wrap" initial={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduced ? 0 : 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
          <div className="hero-visual" onPointerMove={tilt} onPointerLeave={() => { x.set(0); y.set(0); }}>
            <motion.div className="hero-orbital-scene" style={{ rotateX, rotateY }}>
              <div className="hero-orbit hero-orbit--outer" aria-hidden="true"><span /></div>
              <div className="hero-orbit hero-orbit--inner" aria-hidden="true"><span /></div>
              <div className="hero-planet">
                <img src={base + "earth-orbit-poster.webp"} alt="Globo terrestre: tecnología que conecta ideas y negocios" width="480" height="480" fetchPriority="high" />
                {!reduced && <video ref={video} src={base + "earth-orbit.mp4"} poster={base + "earth-orbit-poster.webp"} muted loop playsInline preload="metadata" aria-hidden="true" tabIndex={-1} className={ready ? "is-ready" : ""} onPlay={() => setReady(true)} onError={() => setReady(false)} />}
              </div>
              <div className="hero-orbit-label hero-orbit-label--top"><Sparkles size={14} /> Ideas que evolucionan</div>
              <div className="hero-orbit-label hero-orbit-label--bottom"><span className="hero-signal" /> Ingeniería + IA</div>
            </motion.div>
          </div>
          <div className="hero-visual-footer"><span>TECNOLOGÍA SIN FRONTERAS</span>{!reduced && <button type="button" className="hero-motion-control" onClick={() => setPaused(value => !value)} aria-label={paused ? "Reanudar animación" : "Pausar animación"} aria-pressed={paused}>{paused ? <Play size={12} /> : <Pause size={12} />}{paused ? "Reanudar" : "Pausar"}</button>}</div>
        </motion.div>
      </div>
      <div className="hero-bottom"><span>DE LA IDEA A LO QUE SIGUE.</span><button type="button" onClick={explore}>Descubre nuestras soluciones <ArrowDown size={14} /></button><span className="hero-bottom-index">01 / EXPLORA</span></div>
    </section>
  );
}
