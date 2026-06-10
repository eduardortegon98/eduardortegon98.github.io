import React from "react";

import QuoteHero from "./components/QuoteHero";
import ServicesGrid from "./components/ServicesGrid";
import QuoteForm from "./components/QuoteForm";
import Header from "../Header/Header";

const Cotizar = () => {
  return (
    <div className=" min-h-screen overflow-hidden bg-[#474B4E] text-white w-full">

      <Header/>
      {/* Glow */}
      
      <div className="relative z-10 mx-auto max-w-[80%] px-6 py-24">
        <div className="grid grid-cols-2 items-start gap-20 ">
          {/* Columna izquierda */}
          <div>
            <QuoteHero />
            <ServicesGrid />
          </div>

          {/* Columna derecha */}
          <div className="lg:sticky lg:top-28">
            <QuoteForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cotizar;