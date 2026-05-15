import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Users,
} from "lucide-react";

import ortDeskBot from "../assets/ortdesk-bot.png";

const PRODUCTS = [
  {
    key: "ortdesk",
    eyebrow: "ORTDESK AI",
    title: "Tu recepcionista inteligente para WhatsApp",
    subtitle: "WhatsApp · Web · Atención automatizada",
    description:
      "Automatiza conversaciones, captura leads y conecta clientes con tu equipo humano sin perder contexto.",
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
    setActiveIndex(
      (prev) => (prev - 1 + PRODUCTS.length) % PRODUCTS.length
    );
  };

  return (
    <section
      id="products"
      className="
        relative
        flex
        min-h-screen
        w-full
        items-center
        overflow-hidden
        bg-[#474B4E]
        py-20
      "
    >
      {/* BG */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-[#C0FDB9]/10 blur-3xl" />

        <div className="absolute bottom-[-10%] right-[-10%] h-[420px] w-[420px] rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_45%)]" />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 px-6 sm:px-10 lg:grid-cols-2 lg:px-16">
        {/* LEFT */}
        <div className="relative z-10">
          <div
            className="
              inline-flex
              items-center
              rounded-full
              border
              border-[#C0FDB9]/20
              bg-[#C0FDB9]/10
              px-4
              py-1.5
              text-[11px]
              font-semibold
              tracking-[0.2em]
              text-[#C0FDB9]
              backdrop-blur-xl
            "
          >
            {activeProduct.eyebrow}
          </div>

          <h2
            className="
              mt-6
              max-w-xl
              text-4xl
              font-black
              leading-[1.05]
              tracking-tight
              text-white
              sm:text-5xl
              lg:text-6xl
            "
          >
            {activeProduct.title}
          </h2>

          <p
            className="
              mt-6
              max-w-lg
              text-sm
              leading-relaxed
              text-white/65
              sm:text-base
            "
          >
            {activeProduct.description}
          </p>

          {/* FEATURES */}
          <div className="mt-8 flex flex-wrap gap-3">
            {activeProduct.features.map(({ label, Icon }) => (
              <div
                key={label}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/10
                  bg-white/5
                  px-4
                  py-2
                  backdrop-blur-xl
                "
              >
                <Icon className="size-4 text-[#C0FDB9]" />

                <span className="text-sm font-medium text-white/80">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* BUTTONS */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button
              className="
                inline-flex
                items-center
                justify-center
                rounded-2xl
                bg-[#C0FDB9]
                px-6
                py-4
                text-sm
                font-bold
                text-black
                transition
                hover:scale-[1.02]
              "
            >
              Solicitar demo
            </button>

            <button
              className="
                inline-flex
                items-center
                justify-center
                rounded-2xl
                border
                border-white/10
                bg-white/5
                px-6
                py-4
                text-sm
                font-bold
                text-white/80
                backdrop-blur-xl
                transition
                hover:bg-white/10
              "
            >
              Ver producto
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative flex items-center justify-center">
          {/* GLOW */}
          <div className="absolute h-[420px] w-[420px] rounded-full bg-[#C0FDB9]/15 blur-3xl" />

          {/* CARD 1 */}
          <div
            className="
              absolute
              left-0
              top-12
              hidden
              rounded-2xl
              border
              border-white/10
              bg-white/5
              px-5
              py-4
              backdrop-blur-xl
              lg:block
            "
          >
            <p className="text-xs text-white/45">
              Disponibilidad
            </p>

            <p className="mt-1 text-xl font-bold text-[#C0FDB9]">
              24/7
            </p>
          </div>

          {/* CARD 2 */}
          <div
            className="
              absolute
              bottom-16
              right-0
              hidden
              rounded-2xl
              border
              border-white/10
              bg-white/5
              px-5
              py-4
              backdrop-blur-xl
              lg:block
            "
          >
            <p className="text-xs text-white/45">
              Tiempo de respuesta
            </p>

            <p className="mt-1 text-xl font-bold text-cyan-300">
              ~3s
            </p>
          </div>

          {/* IMAGE */}
          <img
            src={activeProduct.image}
            alt={activeProduct.title}
            draggable="false"
            className="
              relative
              z-10
              w-full
              max-w-[520px]
              object-contain
              drop-shadow-[0_0_60px_rgba(192,253,185,0.22)]
              animate-float
            "
          />
        </div>

        {/* CONTROLS */}
        

        
      </div>
    </section>
  );
};

export default Products;