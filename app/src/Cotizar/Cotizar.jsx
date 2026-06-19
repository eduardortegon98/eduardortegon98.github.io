import React from "react";
import QuoteHero from "./components/QuoteHero";
import ServicesGrid from "./components/ServicesGrid";
import QuoteForm from "./components/QuoteForm";
import Header from "../Header/Header";

const Cotizar = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] text-black w-full overflow-x-hidden">
      <Header />

      {/* Contenedor principal responsivo */}
      <div className="relative grid grid-cols-[5fr_5fr] z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-24">
        <div >
          <QuoteHero />
          <ServicesGrid />
        </div>

        <div>
          <QuoteForm />
        </div>
      </div>
    </div>
  );
};

export default Cotizar;
