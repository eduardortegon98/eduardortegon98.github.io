import React from "react";

const ProductBackground = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-[#C0FDB9]/10 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[420px] w-[420px] rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_45%)]" />
    </div>
  );
};

export default ProductBackground;