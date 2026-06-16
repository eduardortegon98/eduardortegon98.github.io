import React from "react";
import ProductFeatures from "./ProductFeatures";

const ProductDetails = ({ product }) => {
  return (
    <div className="relative z-10">
      {/* Badge */}
      <div
        className="
          inline-flex items-center rounded-full
          border border-[var(--color-primary)]
          bg-[var(--color-primary)]
          px-4 py-1.5
          text-[11px] font-semibold
          tracking-[0.2em]
          text-[var(--color-text-on-secondary)]
          backdrop-blur-xl
        "
      >
        {product.eyebrow}
      </div>

      {/* Título */}
      <h2
        className="
          mt-6 max-w-xl
          text-3xl font-black
          leading-[1.05] tracking-tight
          text-[var(--color-text-on-secondary)]
          sm:text-4xl lg:text-5xl
        "
      >
        {product.title}
      </h2>

      {/* Descripción */}
      <p
        className="
          mt-6 max-w-lg
          text-sm leading-relaxed
          text-[var(--color-text)]
          sm:text-base
        "
      >
        {product.description}
      </p>

      {/* Características */}
      <ProductFeatures features={product.features} />

      {/* Botones */}
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        {/* CTA principal */}
        <button
          className="
            inline-flex items-center justify-center
            rounded-2xl
            bg-[var(--color-primary)]
            px-6 py-4
            text-sm font-bold
            text-[var(--color-text-on-secondary)]
            transition-all duration-200
            hover:scale-[1.02]
            hover:bg-[var(--color-primary-hover)]
          "
        >
          Solicitar demo
        </button>

        {/* CTA secundario */}
        <button
          className="
            inline-flex items-center justify-center
            rounded-2xl
            border border-[var(--color-border)]
            bg-[var(--color-primary)]/40
            px-6 py-4
            text-sm font-bold
            text-[var(--color-text-on-secondary)]
            backdrop-blur-xl
            transition-all duration-200
            hover:bg-[var(--color-primary)]/20
          "
        >
          Ver producto
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;