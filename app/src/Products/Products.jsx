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

  // Controladores con límites estrictos
  const goNext = () => {
    if (activeIndex < PRODUCTS.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  // Constantes para verificar si estamos en los extremos
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === PRODUCTS.length - 1;

  return (
    <section
      id="products"
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#474B4E] py-20"
    >
      <ProductBackground />

      <ProductTabs
        products={PRODUCTS}
        activeIndex={activeIndex}
        onChange={setActiveIndex}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16">
        {/* Flecha Izquierda (Anterior) */}
        <div className="absolute left-4 top-1/2 -mx-10 -translate-y-1/2 z-20 hidden xl:block">
          <button
            onClick={goPrev}
            disabled={isFirst}
            className={`p-3 rounded-full transition-all
              ${
                isFirst
                  ? "opacity-25 cursor-not-allowed bg-white/5 text-white"
                  : "bg-[#C0FDB9] text-black animate-pulse hover:scale-110"
              }`}
          >
            <ArrowLeft className="size-6" />
          </button>
        </div>

        {/* Flecha Derecha (Siguiente) */}
        <div className="absolute right-4 top-1/2 -mx-10 -translate-y-1/2 z-20 hidden xl:block">
          <button
            onClick={goNext}
            disabled={isLast}
            className={`p-3 rounded-full transition-all
              ${
                isLast
                  ? "opacity-25 cursor-not-allowed bg-white/5 text-white"
                  : "bg-[#C0FDB9] text-black animate-pulse hover:scale-110"
              }`}
          >
            <ArrowRight className="size-6" />
          </button>
        </div>

        {/* Layout Principal */}
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
