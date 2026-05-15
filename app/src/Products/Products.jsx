import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";

import ortDeskBot from "../assets/ortdesk-bot.png";

const PRODUCTS = [
  {
    key: "ortdesk",
    eyebrow: "ORTDESK AI",
    title: "Recepcionistas IA",
    subtitle: "WhatsApp · Web · Atención automatizada",
    description:
      "Automatiza conversaciones, captura clientes potenciales y conecta atención inteligente con tu equipo humano.",
    note: "Atención híbrida: la IA responde primero y escala al equipo humano cuando es necesario.",
    image: ortDeskBot,
    features: [
      { label: "Atención 24/7", Icon: MessageCircle },
      { label: "IA + humano", Icon: Users },
      { label: "Flujos seguros", Icon: ShieldCheck },
    ],
  },
];

const Products = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProduct = PRODUCTS[activeIndex];

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % PRODUCTS.length);
  };

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + PRODUCTS.length) % PRODUCTS.length);
  };

  return (
    <section
      id="products"
      className="relative flex min-h-screen w-full items-center overflow-hidden bg-[#474B4E] py-16 sm:py-20"
    >
      {/* BG */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-0 h-64 w-64 rounded-full bg-[#C0FDB9]/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-16 sm:px-20 lg:px-24">
        {/* HEADER */}
        <div className="text-center">
          <div className="text-xs font-semibold tracking-[0.28em] text-white/80">
            PRODUCTOS
          </div>

          <h2 className="mt-3 text-[clamp(2rem,5vw,3.4rem)] font-extrabold tracking-tight text-[#C0FDB9]">
            Automatización inteligente
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
            Herramientas impulsadas por IA para automatizar atención,
            comunicación y procesos empresariales.
          </p>
        </div>

        {/* SLIDE */}
        <div className="mt-12 grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          {/* LEFT */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md shadow-[0_0_60px_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-between gap-3">
              <div className="text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] text-white/60">
                {activeProduct.eyebrow}
              </div>

              <div className="h-px w-12 bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent" />
            </div>

            <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              {activeProduct.title}
            </h3>

            <p className="mt-2 text-sm font-semibold text-[#C0FDB9]">
              {activeProduct.subtitle}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-white/70">
              {activeProduct.description}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {activeProduct.features.map(({ label, Icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl border border-cyan-300/10 bg-black/25 px-4 py-3"
                >
                  <div className="grid size-9 place-items-center rounded-xl border border-cyan-300/15 bg-cyan-400/10 text-cyan-100">
                    <Icon className="size-4" />
                  </div>

                  <span className="text-sm font-medium text-white/85">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-[#C0FDB9]/20 bg-[#C0FDB9]/12 p-4">
              <div className="flex gap-3">
                <Zap className="mt-0.5 size-4 shrink-0 text-[#C0FDB9]" />
                <p className="text-sm leading-relaxed text-white/80">
                  {activeProduct.note}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#C0FDB9] px-5 py-3 text-sm font-bold text-black transition hover:scale-[1.02]">
                Solicitar demo
                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </button>

              <button className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-transparent px-5 py-3 text-sm font-bold text-white/70 transition hover:border-cyan-200/25 hover:text-white">
                Ver cómo funciona
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative flex justify-center">
            <div className="absolute inset-0 rounded-full bg-[#C0FDB9]/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/20 p-4 backdrop-blur-xl shadow-[0_0_80px_rgba(192,253,185,0.12)]">
              <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#C0FDB9]/50 to-transparent" />

              <div className="absolute right-4 top-4 rounded-full border border-[#C0FDB9]/20 bg-black/30 px-3 py-1.5 text-[10px] font-bold tracking-[0.18em] text-[#C0FDB9] backdrop-blur-md">
                {activeProduct.eyebrow}
              </div>

              <img
                src={activeProduct.image}
                alt={activeProduct.title}
                className="relative mx-auto w-full max-w-[340px] rounded-[1.5rem] object-cover drop-shadow-[0_0_45px_rgba(192,253,185,0.18)]"
                draggable="false"
              />
            </div>
          </div>
        </div>

        {/* SLIDER CONTROLS */}
        {/* SIDE CONTROLS */}
        <>
          {/* LEFT */}
          <button
            type="button"
            onClick={goPrev}
            className="
      absolute left-3 top-1/2 z-20
      hidden -translate-y-1/2 lg:grid
      size-14 place-items-center
      rounded-full border border-white/10
      bg-black/25 text-white/80
      backdrop-blur-xl
      transition
      hover:scale-105
      hover:border-[#C0FDB9]/30
      hover:text-[#C0FDB9]
    "
          >
            <ArrowLeft className="size-6" />
          </button>

          {/* RIGHT */}
          <button
            type="button"
            onClick={goNext}
            className="
      absolute right-3 top-1/2 z-20
      hidden -translate-y-1/2 lg:grid
      size-14 place-items-center
      rounded-full border border-white/10
      bg-black/25 text-white/80
      backdrop-blur-xl
      transition
      hover:scale-105
      hover:border-[#C0FDB9]/30
      hover:text-[#C0FDB9]
    "
          >
            <ArrowRight className="size-6" />
          </button>

          {/* DOTS */}
          <div className="mt-10 flex items-center justify-center gap-2">
            {PRODUCTS.map((product, index) => (
              <button
                key={product.key}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={[
                  "h-2 rounded-full transition-all duration-300",
                  index === activeIndex
                    ? "w-8 bg-[#C0FDB9]"
                    : "w-2 bg-white/25 hover:bg-white/45",
                ].join(" ")}
              />
            ))}
          </div>
        </>
      </div>
    </section>
  );
};

export default Products;
