import { Localized } from "../i18n/Language";
import React, { useState } from "react";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { animate, AnimatePresence, motion } from "framer-motion";

import { PRODUCTS } from "./constants";

// Subcomponentes
import ProductBackground from "./ProductBackground";
import ProductDetails from "./ProductDetails";
import ProductDisplay from "./ProductDisplay";
import ProductTabs from "./ProductTabs";

const Products = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const activeProduct = PRODUCTS[activeIndex];

  const isFirst = activeIndex === 0;
  const isLast = activeIndex === PRODUCTS.length - 1;

  const goNext = () => {
    if (!isLast) {
      setDirection(1);
      setActiveIndex((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (!isFirst) {
      setDirection(-1);
      setActiveIndex((prev) => prev - 1);
    }
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
          text-[var(--color-text)]
          animate-pulse
          hover:scale-110
          hover:bg-[var(--color-primary-hover)]
        `,
    ].join(" ");

  return (
    <Localized as="section"
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

      <Localized as="div" className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16">
        {/* Flecha izquierda */}
        <Localized as="div"
          className="
              absolute -left-4 top-1/2 z-20 hidden
              -translate-y-1/2 xl:block 
            "
        >
          <Localized as="button"
            onClick={goPrev}
            disabled={isFirst}
            className={arrowButtonClass(isFirst)}
            aria-label="Producto anterior"
          >
            <ArrowLeft className="size-6" />
          </Localized>
        </Localized>

        {/* Flecha derecha */}
        <Localized as="div"
          className="
              absolute -right-4 top-1/2 z-20 hidden
              -translate-y-1/2 xl:block
            "
        >
          <Localized as="button"
            onClick={goNext}
            disabled={isLast}
            className={arrowButtonClass(isLast)}
            aria-label="Siguiente producto"
          >
            <ArrowRight className="size-6" />
          </Localized>
        </Localized>

        {/* Layout principal */}
        <AnimatePresence mode="wait" custom={direction}>
          <Localized as={motion.div}
            key={activeIndex}
            custom={direction}
            variants={{
              enter: (direction) => ({
                x: direction > 0 ? 100 : -100,
                opacity: 0,
              }),
              center: {
                x: 0,
                opacity: 1,
              },
              exit: (direction) => ({
                x: direction > 0 ? -100 : 100,
                opacity: 0,
              }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.45,
              ease: "easeInOut",
            }}
          >
            <Localized as="div" className="grid w-full items-center gap-16 lg:grid-cols-2">
              <ProductDetails product={activeProduct} />

              <ProductDisplay
                image={activeProduct.image}
                altText={activeProduct.title}
              />
            </Localized>
          </Localized>
        </AnimatePresence>

        <Localized as="div" className="mt-16 flex justify-center">
          <Localized as="button"
            type="button"
            onClick={() => goTo("stack")}
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
  );
};

export default Products;
