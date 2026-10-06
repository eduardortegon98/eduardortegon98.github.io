import React from "react";

const QuoteHero = () => {
  return (
    <section className="px-6 pt-32 pb-20">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <span className="inline-flex rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-primary)]/10 px-4 py-1 text-sm font-medium text-[var(--color-accent)]">
            Solicita una cotización
          </span>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight md:text-6xl">
            Cuéntanos qué necesitas.
          </h1>

          <p className="mt-6 text-lg text-[var(--color-text-muted)]">
            Diseñamos soluciones tecnológicas adaptadas a cada negocio. Cuanto
            más detalle nos brindes, más precisa será nuestra propuesta.
          </p>
        </div>
      </div>
    </section>
  );
};

export default QuoteHero;
