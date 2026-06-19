import React from "react";

const ServiceCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="group h-full rounded-2xl border border-white/40 bg-white/[0.03] p-5 backdrop-blur-md transition-all duration-300 hover:border-white hover:bg-white/[0.06] hover:-translate-y-0.5">
      {/* Contenedor del icono: más estilizado y con animación al pasar el mouse */}
      <div className="inline-flex items-center justify-center rounded-xl bg-white/[0.04] p-2.5 text-[#C0FDB9] transition-colors duration-300 group-hover:bg-[#C0FDB9]/10">
        <Icon size={20} className="transition-transform duration-300 group-hover:scale-110" />
      </div>

      {/* Título más compacto y con tracking ajustado */}
      <h3 className="mt-4 text-base font-bold tracking-tight text-black transition-colors duration-300 group-hover:text-[#C0FDB9]">
        {title}
      </h3>

      {/* Descripción compacta, legible y con tipografía suave */}
      <p className="mt-1.5 text-xs text-black/60 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default ServiceCard;