import React from "react";

const ProductTabs = ({ products, activeIndex, onChange }) => {
  return (
    <div className="mt-12 flex flex-wrap justify-center gap-2">
      {products.map((product, index) => (
        <button
          key={product.key}
          onClick={() => onChange(index)}
          className={`
            px-4 py-2 rounded-xl text-xs font-bold transition-all
            ${activeIndex === index 
              ? "bg-[#C0FDB9] text-black scale-105" 
              : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"}
          `}
        >
          {product.eyebrow}
        </button>
      ))}
    </div>
  );
};

export default ProductTabs;