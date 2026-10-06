import React from "react";

const ServiceCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="group h-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 backdrop-blur-md transition-all duration-300 hover:border-[var(--color-border)] hover:bg-[var(--color-surface)] hover:-translate-y-0.5">
      {/* Contenedor del icono: más estilizado y con animación al pasar el mouse */}
      <div className="inline-flex items-center justify-center rounded-xl bg-[var(--color-surface)] p-2.5 text-[var(--color-accent)] transition-colors duration-300 group-hover:bg-[var(--color-primary)]/10">
        <Icon size={20} className="transition-transform duration-300 group-hover:scale-110" />
      </div>

      {/* Título más compacto y con tracking ajustado */}
      <h3 className="mt-4 text-base font-bold tracking-tight text-[var(--color-text)] transition-colors duration-300 group-hover:text-[var(--color-accent)]">
        {title}
      </h3>

      {/* Descripción compacta, legible y con tipografía suave */}
      <p className="mt-1.5 text-xs text-[var(--color-text-muted)] leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default ServiceCard;