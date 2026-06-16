import React, { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { PRODUCTS } from "./constants";

// Subcomponentes
import ProductBackground from "./ProductBackground";
import ProductDetails from "./ProductDetails";
import ProductDisplay from "./ProductDisplay";
import ProductTabs from "./ProductTabs";

const Products = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeProduct = PRODUCTS[activeIndex];

  const isFirst = activeIndex === 0;
  const isLast = activeIndex === PRODUCTS.length - 1;

  const goNext = () => {
    if (!isLast) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (!isFirst) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  const arrowButtonClass = (disabled) =>
    [
      "rounded-full p-3 transition-all",
      disabled
        ? `
          cursor-not-allowed
          opacity-25
          bg-[var(--color-disabled)]
          text-[var(--color-text)]
        `
        : `
          bg-[var(--color-primary)]
          text-black
          animate-pulse
          hover:scale-110
          hover:bg-[var(--color-primary-hover)]
        `,
    ].join(" ");

  return (
    <section
      id="products"
      className="
    relative flex min-h-screen w-full flex-col
    items-center justify-center overflow-hidden
    bg-[var(--color-bg-secondary)]
    py-20
  "
    >
      <ProductBackground />

      <ProductTabs
        products={PRODUCTS}
        activeIndex={activeIndex}
        onChange={setActiveIndex}
      />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16">
          {/* Flecha izquierda */}
          <div
            className="
              absolute -left-4 top-1/2 z-20 hidden
              -translate-y-1/2 xl:block 
            "
          >
            <button
              onClick={goPrev}
              disabled={isFirst}
              className={arrowButtonClass(isFirst)}
              aria-label="Producto anterior"
            >
              <ArrowLeft className="size-6" />
            </button>
          </div>

          {/* Flecha derecha */}
          <div
            className="
              absolute -right-4 top-1/2 z-20 hidden
              -translate-y-1/2 xl:block
            "
          >
            <button
              onClick={goNext}
              disabled={isLast}
              className={arrowButtonClass(isLast)}
              aria-label="Siguiente producto"
            >
              <ArrowRight className="size-6" />
            </button>
          </div>

          {/* Layout principal */}
          <div className="grid w-full items-center gap-16 lg:grid-cols-2">
            <ProductDetails product={activeProduct} />

            <ProductDisplay
              image={activeProduct.image}
              altText={activeProduct.title}
            />
          </div>
        </div>
    </section>
  );
};

export default Products;
