import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  BrainCircuit,
  Bot,
  Layers3,
  Orbit,
  Globe,
  Cpu,
  Atom,
  Wind,
  Terminal,
  Plug,
  ChevronDown,
} from "lucide-react";
import { animate } from "framer-motion";

import imgStack from "../assets/img_stack.png";

const STACK = [
  {
    key: "intelligence",
    title: "DESARROLLO",

    description:
      "Creamos plataformas modernas enfocadas en rendimiento, automatización y experiencia de usuario.",

    details: [
      "Interfaces modernas y responsivas",
      "Sistemas escalables",
      "Experiencias optimizadas para conversión",
    ],

    items: [
      { label: "Plataformas Web", Icon: Globe },
      { label: "Automatización Inteligente", Icon: BrainCircuit },
      { label: "IA Conversacional", Icon: Bot },
    ],
  },

  {
    key: "technologies",
    title: "TECNOLOGÍAS",

    description:
      "Utilizamos arquitecturas modernas para construir soluciones rápidas y preparadas para crecer.",

    details: [
      "Frontend interactivo",
      "Arquitectura escalable",
      "Procesamiento inteligente",
    ],

    items: [
      { label: "Frontend Moderno", Icon: Atom },
      { label: "Arquitectura Escalable", Icon: Wind },
      { label: "Procesamiento Inteligente", Icon: Terminal },
    ],
  },

  {
    key: "predict",
    title: "PREDICCIÓN",

    description:
      "Transformamos datos en información útil para optimizar decisiones empresariales.",

    details: [
      "Análisis inteligente",
      "Predicción de patrones",
      "Optimización operativa",
    ],

    items: [
      { label: "Predicción de Datos", Icon: BrainCircuit },
      { label: "Análisis Inteligente", Icon: Layers3 },
      { label: "Optimización de Procesos", Icon: Orbit },
    ],
  },

  {
    key: "automation",
    title: "AUTOMATIZACIÓN IA",

    description:
      "Conectamos automatización e inteligencia artificial para mejorar atención y productividad.",

    details: [
      "Integraciones empresariales",
      "Recepcionistas IA",
      "Automatización de atención",
    ],

    items: [
      { label: "Integraciones Empresariales", Icon: Plug },
      { label: "Asistentes Virtuales IA", Icon: Bot },
      { label: "Automatización de Atención", Icon: Cpu },
    ],
  },
];

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

const StackCard = React.forwardRef(function StackCard(
  { title, items, description, details = [], side = "left" },
  ref,
) {
  const isLeft = side === "left";

  const FrontContent = ({ invisible = false }) => (
    <div
      className={`
        rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md
        px-4 py-4 sm:px-5 sm:py-5 lg:px-6
        shadow-[0_0_60px_rgba(0,0,0,0.35)]
        ${invisible ? "invisible" : ""}
      `}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] sm:tracking-[0.24em] text-white/60">
          {title}
        </div>
        <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent" />
      </div>

      <div className="mt-4 space-y-3">
        {items.map(({ label, Icon }, idx) => (
          <div
            key={idx}
            className="
              flex items-center gap-3 rounded-xl border border-cyan-300/10 bg-black/30
              px-3 py-3 sm:px-4
            "
          >
            <div
              className="
                grid size-9 shrink-0 place-items-center rounded-xl border border-cyan-300/15
                bg-cyan-400/10 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.10)]
                sm:size-10
              "
            >
              <Icon className="size-5 sm:size-6" />
            </div>

            <div className="text-sm sm:text-base font-medium text-white/90">
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div ref={ref} className="group relative [perspective:1200px]">
      {/* Este bloque define el tamaño real de la card */}
      <FrontContent invisible />

      <div
        className="
          absolute inset-0 rounded-2xl transition-transform duration-700
          [transform-style:preserve-3d]
          group-hover:[transform:rotateY(180deg)]
        "
      >
        {/* FRONT */}
        <div
          className="
            absolute inset-0 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md
            px-4 py-4 sm:px-5 sm:py-5 lg:px-6
            shadow-[0_0_60px_rgba(0,0,0,0.35)]
            transition will-change-transform group-hover:border-cyan-200/25
            [backface-visibility:hidden]
          "
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/20 to-transparent" />

          <div
            className={[
              "pointer-events-none absolute top-1/2 hidden -translate-y-1/2 lg:block",
              isLeft ? "-right-2" : "-left-2",
            ].join(" ")}
          >
            <div className="relative size-4">
              <div className="absolute inset-0 rounded-full bg-cyan-200/70 blur-[6px] opacity-0 transition group-hover:opacity-100" />
              <div className="absolute inset-0 rounded-full bg-cyan-200/40 blur-[10px] opacity-60" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] sm:tracking-[0.24em] text-white/60">
              {title}
            </div>
            <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent" />
          </div>

          <div className="mt-4 space-y-3">
            {items.map(({ label, Icon }, idx) => (
              <div
                key={idx}
                className="
                  flex items-center gap-3 rounded-xl border border-cyan-300/10 bg-black/30
                  px-3 py-3 sm:px-4
                  transition group-hover:border-cyan-200/15
                "
              >
                <div
                  className="
                    grid size-9 shrink-0 place-items-center rounded-xl border border-cyan-300/15
                    bg-cyan-400/10 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.10)]
                    sm:size-10
                  "
                >
                  <Icon className="size-5 sm:size-6" />
                </div>

                <div className="text-sm sm:text-base font-medium text-white/90">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BACK */}
        <div
          className="
    absolute inset-0 rounded-2xl border border-cyan-300/20
    bg-gradient-to-br from-[#111818]/95 via-[#172323]/95 to-[#0b1111]/95
    px-4 py-4 sm:px-5 sm:py-5 lg:px-6
    shadow-[0_0_70px_rgba(34,211,238,0.18)]
    [transform:rotateY(180deg)] [backface-visibility:hidden]
    overflow-y-auto overflow-x-hidden
    [&::-webkit-scrollbar]:hidden
    [-ms-overflow-style:none]
    [scrollbar-width:none]
  "
        >
          <div className="flex items-center justify-between gap-3">
            <div className="text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] sm:tracking-[0.24em] text-cyan-100/70">
              {title}
            </div>
            <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent" />
          </div>

          <h3 className="mt-3 text-sm sm:text-base font-extrabold text-[#C0FDB9]">
            {items[0]?.label}
          </h3>

          <p className="mt-2 text-[11px] sm:text-xs leading-relaxed text-white/70">
            {description}
          </p>

          <div className="mt-3 space-y-1.5">
            {details.slice(0, 3).map((detail, idx) => (
              <div
                key={idx}
                className="
          rounded-lg border border-white/10 bg-white/[0.04]
          px-3 py-1.5 text-[11px] sm:text-xs leading-snug text-white/80
        "
              >
                ✦ {detail}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

function useMeasurePorts(wrapperRef, refs) {
  const [data, setData] = useState(null);

  const measure = () => {
    const wrap = wrapperRef.current;
    if (!wrap) return;
    const wr = wrap.getBoundingClientRect();

    const centerOf = (el) => {
      const r = el.getBoundingClientRect();
      return {
        x: r.left - wr.left + r.width / 2,
        y: r.top - wr.top + r.height / 2,
        w: r.width,
        h: r.height,
      };
    };

    const chip = refs.chip.current;
    const L1 = refs.intelligence.current;
    const L2 = refs.predict.current;
    const R1 = refs.product.current;
    const R2 = refs.automation.current;

    if (!chip || !L1 || !L2 || !R1 || !R2) return;

    const chipC = centerOf(chip);
    const a = centerOf(L1);
    const b = centerOf(L2);
    const c = centerOf(R1);
    const d = centerOf(R2);

    const portLeft = (card) => ({ x: card.x + card.w / 2 - 8, y: card.y });
    const portRight = (card) => ({ x: card.x - card.w / 2 + 8, y: card.y });

    const chipLeft = { x: chipC.x - chipC.w * 0.18, y: chipC.y };
    const chipRight = { x: chipC.x + chipC.w * 0.18, y: chipC.y };

    setData({
      w: wr.width,
      h: wr.height,
      chip: chipC,
      targets: { chipLeft, chipRight },
      ports: {
        intelligence: { from: portLeft(a), to: chipLeft },
        predict: {
          from: portLeft(b),
          to: { x: chipLeft.x, y: chipLeft.y + chipC.h * 0.18 },
        },
        product: { from: portRight(c), to: chipRight },
        automation: {
          from: portRight(d),
          to: { x: chipRight.x, y: chipRight.y + chipC.h * 0.18 },
        },
      },
    });
  };

  useLayoutEffect(() => {
    measure();
  }, []);

  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    const ro = new ResizeObserver(() => measure());
    if (wrapperRef.current) ro.observe(wrapperRef.current);

    const t = setTimeout(measure, 80);

    return () => {
      clearTimeout(t);
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return data;
}

const ChipCenter = React.forwardRef(function ChipCenter(_, ref) {
  return (
    <div
      ref={ref}
      className="
        relative
        mx-auto
        flex
        items-center
        justify-center
        w-full
        max-w-[700px]
      "
    >
      <div className="pointer-events-none absolute -inset-16 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="pointer-events-none absolute -inset-16 translate-x-10 rounded-full bg-blue-500/10 blur-3xl" />

      <img
        src={imgStack}
        alt="Chip"
        draggable={false}
        className="
          block
          mx-auto
          w-full
          max-w-[650px]
          h-auto
          object-contain
          drop-shadow-[0_0_50px_rgba(34,211,238,0.20)]
        "
      />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="absolute h-[96%] w-[96%] rounded-full border border-cyan-300/10" />
        <div className="absolute h-[78%] w-[78%] rounded-full border border-cyan-300/10" />
        <div className="absolute h-[60%] w-[60%] rounded-full border border-cyan-300/10" />
      </div>
    </div>
  );
});

const Stack = () => {
  const wrapRef = useRef(null);

  const refs = {
    chip: useRef(null),
    intelligence: useRef(null),
    product: useRef(null),
    predict: useRef(null),
    automation: useRef(null),
  };

  const goTo = (id) => {
    const el = document.getElementById(id);

    if (!el) return;

    animate(window.scrollY, el.offsetTop, {
      duration: 1.2,
      ease: "easeInOut",
      onUpdate: (latest) => {
        window.scrollTo(0, latest);
      },
    });
  };

  const m = useMeasurePorts(wrapRef, refs);

  return (
    <section
      className="
    relative w-full overflow-hidden
    bg-[var(--color-bg-secondary)]
    py-16 sm:py-20 lg:min-h-screen lg:py-24
  "
      id="stack"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 left-6 h-52 w-52 rounded-full bg-[#C0FDB9]/10 blur-3xl sm:left-10 sm:h-72 sm:w-72" />

        <div className="absolute -bottom-32 right-6 h-56 w-56 rounded-full bg-[#C0FDB9]/5 blur-3xl sm:right-10 sm:h-80 sm:w-80" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="mt-3 font-extrabold tracking-tight text-[#C0FDB9] text-[clamp(1.9rem,5vw,3.4rem)]">
            Nuestras Tecnologías
          </h2>

          <p className="mx-auto mt-3 max-w-2xl px-2 text-sm leading-relaxed text-[var(--color-surface)] sm:text-base">
            Diseñamos soluciones donde la IA, el software y la automatización
            trabajan juntos para optimizar procesos reales.
          </p>
        </div>

        <div ref={wrapRef} className="relative mt-10 sm:mt-14">
          {/* SVG solo desktop */}
          {m && (
            <svg
              className="pointer-events-none absolute inset-0 hidden lg:block"
              width={m.w}
              height={m.h}
              viewBox={`0 0 ${m.w} ${m.h}`}
            >
              <defs>
                <linearGradient id="wire" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="rgba(34,211,238,0.08)" />
                  <stop offset="0.5" stopColor="rgba(34,211,238,0.85)" />
                  <stop offset="1" stopColor="rgba(34,211,238,0.08)" />
                </linearGradient>

                <filter id="softGlow">
                  <feGaussianBlur stdDeviation="3" result="b" />
                  <feColorMatrix
                    in="b"
                    type="matrix"
                    values="
                      1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 1.8 0"
                    result="g"
                  />
                  <feMerge>
                    <feMergeNode in="g" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            </svg>
          )}

          {/* layout responsive */}
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-3 lg:gap-8">
            <div className="order-2 space-y-5 lg:order-1 lg:space-y-6">
              <StackCard
                ref={refs.intelligence}
                title={STACK[0].title}
                items={STACK[0].items}
                description={STACK[0].description}
                details={STACK[0].details}
                side="left"
              />

              <StackCard
                title={STACK[2].title}
                items={STACK[2].items}
                description={STACK[2].description}
                details={STACK[2].details}
                side="left"
              />
            </div>

            <div className="order-1 flex justify-center lg:order-2">
              <ChipCenter ref={refs.chip} />
            </div>

            <div className="order-3 space-y-5 lg:space-y-6">
              <StackCard
                title={STACK[1].title}
                items={STACK[1].items}
                description={STACK[1].description}
                details={STACK[1].details}
                side="right"
              />

              <StackCard
                title={STACK[3].title}
                items={STACK[3].items}
                description={STACK[3].description}
                details={STACK[3].details}
                side="right"
              />
            </div>
          </div>
          <div className=" flex justify-center">
            <button
              type="button"
              onClick={() => goTo("projects")}
              className="
      rounded-full
      bg-[var(--color-primary)]
      p-4
      text-black
      shadow-lg
      transition-all duration-300
      hover:scale-110
      hover:bg-[var(--color-primary-hover)]
      hover:shadow-[0_0_25px_rgba(192,253,185,0.45)]
      animate-bounce
    "
              aria-label="Ir a tecnologías"
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stack;
