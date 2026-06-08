import React from "react";
import ProductFeatures from "./ProductFeatures";

const ProductDetails = ({ product }) => {
  return (
    <div className="relative z-10">
      <div className="inline-flex items-center rounded-full border border-[#C0FDB9]/20 bg-[#C0FDB9]/10 px-4 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-[#C0FDB9] backdrop-blur-xl">
        {product.eyebrow}
      </div>

      <h2 className="mt-6 max-w-xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
        {product.title}
      </h2>

      <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/65 sm:text-base">
        {product.description}
      </p>

      {/* Características del producto */}
      <ProductFeatures features={product.features} />

      {/* Botones de acción */}
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <button className="inline-flex items-center justify-center rounded-2xl bg-[#C0FDB9] px-6 py-4 text-sm font-bold text-black transition hover:scale-[1.02]">
          Solicitar demo
        </button>

        <button className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-bold text-white/80 backdrop-blur-xl transition hover:bg-white/10">
          Ver producto
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;