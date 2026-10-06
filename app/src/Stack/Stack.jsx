import { Localized } from "../i18n/Language";
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
    <Localized as="div"
      className={`
        rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] backdrop-blur-md
        px-4 py-4 sm:px-5 sm:py-5 lg:px-6
        shadow-[0_0_60px_rgba(0,0,0,0.35)]
        ${invisible ? "invisible" : ""}
      `}
    >
      <Localized as="div" className="flex items-center justify-between gap-3">
        <Localized as="div" className="text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] sm:tracking-[0.24em] text-[var(--color-text)]">
          {title}
        </Localized>
        <Localized as="div" className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent via-[var(--color-primary-soft)] to-transparent" />
      </Localized>

      <Localized as="div" className="mt-4 space-y-3">
        {items.map(({ label, Icon }, idx) => (
          <Localized as="div"
            key={idx}
            className="
              flex items-center gap-3 rounded-xl border border-[var(--color-accent)] bg-[var(--color-bg)]
              px-3 py-3 sm:px-4
            "
          >
            <Localized as="div"
              className="
                grid size-9 shrink-0 place-items-center rounded-xl border border-[var(--color-accent)]
                bg-[var(--color-primary-soft)] text-[var(--color-accent)] shadow-[0_0_18px_rgba(47,107,69,0.10)]
                sm:size-10
              "
            >
              <Icon className="size-5 sm:size-6" />
            </Localized>

            <Localized as="div" className="text-sm sm:text-base font-medium text-[var(--color-text-muted)]">
              {label}
            </Localized>
          </Localized>
        ))}
      </Localized>
    </Localized>
  );

  return (
    <Localized as="div" ref={ref} className="group relative [perspective:1200px]">
      {/* Este bloque define el tamaño real de la card */}
      <FrontContent invisible />

      <Localized as="div"
        className="
          absolute inset-0 rounded-2xl transition-transform duration-700
          [transform-style:preserve-3d]
          group-hover:[transform:rotateY(180deg)]
        "
      >
        {/* FRONT */}
        <Localized as="div"
          className="
            absolute inset-0 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] backdrop-blur-md
            px-4 py-4 sm:px-5 sm:py-5 lg:px-6
            shadow-[0_0_60px_rgba(0,0,0,0.35)]
            transition will-change-transform group-hover:border-[var(--color-accent)]
            [backface-visibility:hidden]
          "
        >
          <Localized as="div" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-primary-soft)] to-transparent" />

          <Localized as="div"
            className={[
              "pointer-events-none absolute top-1/2 hidden -translate-y-1/2 lg:block",
              isLeft ? "-right-2" : "-left-2",
            ].join(" ")}
          >
            <Localized as="div" className="relative size-4">
              <Localized as="div" className="absolute inset-0 rounded-full bg-[var(--color-primary-soft)] blur-[6px] opacity-0 transition group-hover:opacity-100" />
              <Localized as="div" className="absolute inset-0 rounded-full bg-[var(--color-primary-soft)] blur-[10px] opacity-60" />
            </Localized>
          </Localized>

          <Localized as="div" className="flex items-center justify-between gap-3">
            <Localized as="div" className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text)] font-mono">
              {title}
            </Localized>
            <Localized as="div" className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent via-[var(--color-primary-soft)] to-transparent" />
          </Localized>

          <Localized as="div" className="mt-4 space-y-3">
            {items.map(({ label, Icon }, idx) => (
              <Localized as="div"
                key={idx}
                className="
                  flex items-center gap-3 rounded-xl border border-[var(--color-accent)] bg-[var(--color-bg)]
                  px-3 py-3 sm:px-4
                  transition group-hover:border-[var(--color-accent)]
                "
              >
                <Localized as="div"
                  className="
                    grid size-9 shrink-0 place-items-center rounded-xl border border-[var(--color-accent)]
                    bg-[var(--color-primary-soft)] text-[var(--color-accent)] shadow-[0_0_18px_rgba(47,107,69,0.10)]
                    sm:size-10
                  "
                >
                  <Icon className="size-5 sm:size-6" />
                </Localized>

                <Localized as="div" className="text-sm sm:text-base font-medium text-[var(--color-text-muted)]">
                  {label}
                </Localized>
              </Localized>
            ))}
          </Localized>
        </Localized>

        {/* BACK */}
        <Localized as="div"
          className="
    absolute inset-0 rounded-2xl border border-[var(--color-accent)]
    bg-gradient-to-br from-[var(--color-surface)] via-[var(--color-surface)] to-[var(--color-surface)]
    px-4 py-4 sm:px-5 sm:py-5 lg:px-6
    shadow-[0_0_70px_rgba(47,107,69,0.18)]
    [transform:rotateY(180deg)] [backface-visibility:hidden]
    overflow-y-auto overflow-x-hidden
    [&::-webkit-scrollbar]:hidden
    [-ms-overflow-style:none]
    [scrollbar-width:none]
  "
        >
          <Localized as="div" className="flex items-center justify-between gap-3">
            <Localized as="div" className="text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] sm:tracking-[0.24em] text-[var(--color-accent)]">
              {title}
            </Localized>
            <Localized as="div" className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent via-[var(--color-primary-soft)] to-transparent" />
          </Localized>

          <Localized as="h3" className="mt-3 text-sm sm:text-base font-extrabold text-[var(--color-accent)]">
            {items[0]?.label}
          </Localized>

          <Localized as="p" className="mt-2 text-[11px] sm:text-xs leading-relaxed text-[var(--color-text-muted)]">
            {description}
          </Localized>

          <Localized as="div" className="mt-3 space-y-1.5">
            {details.slice(0, 3).map((detail, idx) => (
              <Localized as="div"
                key={idx}
                className="
          rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]
          px-3 py-1.5 text-[11px] sm:text-xs leading-snug text-[var(--color-text-muted)]
        "
              >
                ✦ {detail}
              </Localized>
            ))}
          </Localized>
        </Localized>
      </Localized>
    </Localized>
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
    <Localized as="div"
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
      <Localized as="div" className="pointer-events-none absolute -inset-16 rounded-full bg-[var(--color-primary-soft)] blur-3xl" />

      <Localized as="div" className="pointer-events-none absolute -inset-16 translate-x-10 rounded-full bg-[var(--color-primary-soft)] blur-3xl" />

      <Localized as="img"
        loading="lazy"
        decoding="async"
        src={imgStack}
        alt="Robot de Ortegón: inteligencia artificial y tecnología"
        draggable={false}
        className="
          relative z-10
          block
          mx-auto
          w-full
          max-w-[650px]
          h-auto
          object-contain
          drop-shadow-[0_0_50px_rgba(47,107,69,0.20)]
        "
      />


    </Localized>
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
    <Localized as="section"
      className="
    relative w-full overflow-hidden
    bg-[var(--color-bg)]
    py-16 sm:py-20 lg:min-h-screen lg:py-24
  "
      id="stack"
    >
      <Localized as="div" className="pointer-events-none absolute inset-0">
        <Localized as="div" className="absolute -top-28 left-6 h-52 w-52 rounded-full bg-[var(--color-primary)]/10 blur-3xl sm:left-10 sm:h-72 sm:w-72" />

        <Localized as="div" className="absolute -bottom-32 right-6 h-56 w-56 rounded-full bg-[var(--color-primary)]/5 blur-3xl sm:right-10 sm:h-80 sm:w-80" />
      </Localized>

      <Localized as="div" className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <Localized as="div" className="text-center">
          <Localized as="h2" className="mt-3 font-extrabold tracking-tight text-[var(--color-accent)] text-[clamp(1.9rem,5vw,3.4rem)]">
            Nuestras Tecnologías
          </Localized>

          <Localized as="p" className="mx-auto mt-3 max-w-2xl px-2 text-sm leading-relaxed  sm:text-base">
            Diseñamos soluciones donde la IA, el software y la automatización
            trabajan juntos para optimizar procesos reales.
          </Localized>
        </Localized>

        <Localized as="div" ref={wrapRef} className="relative mt-10 sm:mt-14">
          {/* SVG solo desktop */}
          {m && (
            <Localized as="svg"
              className="pointer-events-none absolute inset-0 hidden lg:block"
              width={m.w}
              height={m.h}
              viewBox={`0 0 ${m.w} ${m.h}`}
            >
              <Localized as="defs">
                <Localized as="linearGradient" id="wire" x1="0" y1="0" x2="1" y2="0">
                  <Localized as="stop" offset="0" stopColor="rgba(47,107,69,0.08)" />
                  <Localized as="stop" offset="0.5" stopColor="rgba(47,107,69,0.85)" />
                  <Localized as="stop" offset="1" stopColor="rgba(47,107,69,0.08)" />
                </Localized>

                <Localized as="filter" id="softGlow">
                  <Localized as="feGaussianBlur" stdDeviation="3" result="b" />
                  <Localized as="feColorMatrix"
                    in="b"
                    type="matrix"
                    values="
                      1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 1.8 0"
                    result="g"
                  />
                  <Localized as="feMerge">
                    <Localized as="feMergeNode" in="g" />
                    <Localized as="feMergeNode" in="SourceGraphic" />
                  </Localized>
                </Localized>
              </Localized>
            </Localized>
          )}

          {/* layout responsive */}
          <Localized as="div" className="grid grid-cols-1 items-center gap-6 lg:grid-cols-3 lg:gap-8">
            <Localized as="div" className="order-2 space-y-5 lg:order-1 lg:space-y-6">
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
            </Localized>

            <Localized as="div" className="order-1 flex justify-center lg:order-2">
              <ChipCenter ref={refs.chip} />
            </Localized>

            <Localized as="div" className="order-3 space-y-5 lg:space-y-6">
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
            </Localized>
          </Localized>
          <Localized as="div" className=" flex justify-center">
            <Localized as="button"
              type="button"
              onClick={() => goTo("projects")}
              className="
      rounded-full
      bg-[var(--color-primary)]
      p-4
      text-[var(--color-text)]
      shadow-[0_8px_24px_rgba(32,58,43,0.06)]
      transition-all duration-300
      hover:scale-110
      hover:bg-[var(--color-primary-hover)]
      hover:shadow-[0_0_25px_rgba(192,253,185,0.45)]
      animate-bounce
    "
              aria-label="Ir a tecnologías"
            >
              <ChevronDown className="h-5 w-5" />
            </Localized>
          </Localized>
        </Localized>
      </Localized>
    </Localized>
  );
};

export default Stack;
