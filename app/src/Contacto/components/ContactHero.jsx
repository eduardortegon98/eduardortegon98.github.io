import React from "react";

const ContactHero = () => {
  return (
    <section className="px-6 pt-32 pb-16">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full border border-[#C0FDB9]/30 bg-[#C0FDB9]/10 px-4 py-1 text-sm font-medium text-[#C0FDB9]">
            Contacto
          </span>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight md:text-6xl">
            Estamos listos para ayudarte.
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-white/70">
            Cuéntanos sobre tu proyecto o necesidad y encontraremos la mejor solución para tu negocio.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;