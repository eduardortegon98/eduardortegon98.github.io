import React from "react";

const ProductDisplay = ({ image, altText }) => {
  return (
    <div className="relative flex items-center justify-center">
      {/* GLOW DE FONDO */}
      <div className="absolute h-[420px] w-[420px] rounded-full bg-[#C0FDB9]/15 blur-3xl" />

      {/* CARD 1: Disponibilidad */}
      <div className="absolute left-0 top-12 hidden rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl lg:block">
        <p className="text-xs text-white/45">Disponibilidad</p>
        <p className="mt-1 text-xl font-bold text-[#C0FDB9]">24/7</p>
      </div>

      {/* CARD 2: Respuesta */}
      <div className="absolute bottom-16 right-0 hidden rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl lg:block">
        <p className="text-xs text-white/45">Tiempo de respuesta</p>
        <p className="mt-1 text-xl font-bold text-cyan-300">~3s</p>
      </div>

      {/* IMAGEN PRINCIPAL */}

      <img
        src={image}
        alt={altText}
        draggable="false"
        className="relative z-10 rounded-2xl w-full max-w-[680px] object-contain drop-shadow-[0_0_60px_rgba(192,253,185,0.22)] animate-float"
      />
    </div>
  );
};

export default ProductDisplay;