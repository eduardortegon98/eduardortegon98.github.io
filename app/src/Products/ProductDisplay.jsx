import { Localized } from "../i18n/Language";
import React from "react";

const ProductDisplay = ({ image, altText }) => {
  return (
    <Localized as="div" className="relative flex items-center justify-center">
      {/* GLOW DE FONDO */}
      <Localized as="div" className="absolute h-[420px] w-[420px] rounded-full bg-[var(--color-primary)]/15 blur-3xl" />

      {/* CARD 1: Disponibilidad */}
      <Localized as="div" className="absolute left-0 top-12 hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 backdrop-blur-xl lg:block">
        <Localized as="p" className="text-xs text-[var(--color-text-muted)]">Disponibilidad</Localized>
        <Localized as="p" className="mt-1 text-xl font-bold text-[var(--color-accent)]">24/7</Localized>
      </Localized>

      {/* CARD 2: Respuesta */}
      <Localized as="div" className="absolute bottom-16 right-0 hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 backdrop-blur-xl lg:block">
        <Localized as="p" className="text-xs text-[var(--color-text-muted)]">Tiempo de respuesta</Localized>
        <Localized as="p" className="mt-1 text-xl font-bold text-[var(--color-accent)]">~3s</Localized>
      </Localized>

      {/* IMAGEN PRINCIPAL */}

      <Localized as="img"
        loading="lazy"
        decoding="async"
        src={image}
        alt={altText}
        draggable="false"
        className="relative z-10 rounded-2xl w-full max-w-[680px] object-contain drop-shadow-[0_0_60px_rgba(192,253,185,0.22)] animate-float"
      />
    </Localized>
  );
};

export default ProductDisplay;