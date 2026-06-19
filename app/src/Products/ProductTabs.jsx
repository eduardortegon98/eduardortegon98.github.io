import React from "react";

const ProductTabs = ({ products, activeIndex, onChange }) => {
  return (
    <div className="mt-12 mb-20 flex justify-center">
      <div className="inline-flex items-center gap-2 border border-black/10 bg-white/50 rounded-md backdrop-blur-sm p-1">
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
                ? "bg-[#C0FDB9] text-black"
                : "text-black/60 hover:text-black"
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
