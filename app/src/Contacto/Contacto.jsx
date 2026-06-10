import React from "react";
import ContactHero from "./components/ContactHero";
import ContactInfo from "./components/ContactInfo";
import ContactForm from "./components/ContactForm";
import Header from "../Header/Header";

const Contacto = () => {
  return (
    <div className="  bg-[#474B4E] text-white">
      <Header/>
      <div className="relative z-10">
        <ContactHero />

        <section className="px-6 pb-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-5">
            <ContactInfo />
            <ContactForm />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contacto;