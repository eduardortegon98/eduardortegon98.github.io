import React from "react";

const ProductTabs = ({ products, activeIndex, onChange }) => {
  return (
    <div className="mt-12 mb-20 flex justify-center">
      <div className="inline-flex flex-wrap justify-center items-center gap-2 border border-[var(--color-border)] bg-[var(--color-surface)] rounded-md backdrop-blur-sm p-1">
        {products.map((product, index) => {
          const isActive = activeIndex === index;

          return (
            <button
              key={product.key}
              onClick={() => onChange(index)}
              className={`
            px-5 py-2 text-sm font-semibold rounded-md tracking-wider transition-all
            ${
              isActive
                ? "bg-[var(--color-primary)] text-[var(--color-text)]"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }
          `}
            >
              {product.eyebrow}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductTabs;
