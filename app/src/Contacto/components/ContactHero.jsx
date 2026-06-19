import React from "react";

const ContactHero = () => {
  return (
    <section
      className="
        relative flex w-full flex-col items-center justify-center 
        overflow-hidden  py-32 px-6
        transition-colors duration-300 
        text-[var(--color-primary-text)]
      "
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl sm:px-10 lg:px-16">
        <div className="max-w-3xl">
          {/* Badge de Categoría con fondo sutil */}
          <span
            className="
              inline-flex rounded-full border border-[var(--color-primary)]/30 
              bg-[var(--color-primary)]/60 px-4 py-1 text-sm font-medium 
            
            "
          >
            Contacto
          </span>

          {/* Título Principal */}
          <h1
            className="
              mt-6 text-4xl font-extrabold tracking-tight 
               md:text-6xl
            "
          >
            Estamos listos para ayudarte.
          </h1>

          {/* Texto Descriptivo Mutado */}
          <p
            className="
              mt-6 text-lg leading-relaxed 
              
            "
          >
            Cuéntanos sobre tu proyecto o necesidad y encontraremos la mejor
            solución para tu negocio.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;