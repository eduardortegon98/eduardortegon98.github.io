import React from "react";

const ProductDisplay = ({ image, altText }) => {
  return (
    <div className="relative flex items-center justify-center">
      {/* GLOW DE FONDO */}
      <div className="absolute h-[420px] w-[420px] rounded-full bg-[var(--color-primary)]/15 blur-3xl" />

      {/* CARD 1: Disponibilidad */}
      <div className="absolute left-0 top-12 hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 backdrop-blur-xl lg:block">
        <p className="text-xs text-[var(--color-text-muted)]">Disponibilidad</p>
        <p className="mt-1 text-xl font-bold text-[var(--color-accent)]">24/7</p>
      </div>

      {/* CARD 2: Respuesta */}
      <div className="absolute bottom-16 right-0 hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 backdrop-blur-xl lg:block">
        <p className="text-xs text-[var(--color-text-muted)]">Tiempo de respuesta</p>
        <p className="mt-1 text-xl font-bold text-[var(--color-accent)]">~3s</p>
      </div>

      {/* IMAGEN PRINCIPAL */}

      <img
        loading="lazy"
        decoding="async"
        src={image}
        alt={altText}
        draggable="false"
        className="relative z-10 rounded-2xl w-full max-w-[680px] object-contain drop-shadow-[0_0_60px_rgba(192,253,185,0.22)] animate-float"
      />
    </div>
  );
};

export default ProductDisplay;