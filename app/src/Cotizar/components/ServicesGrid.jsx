import React from "react";
import ServiceCard from "./ServiceCard";
import { SERVICES } from "../constants";

const ServicesGrid = () => {
  return (
    <section className="py-8 px-4 sm:px-6">
      {/* Reducido de max-w-7xl a max-w-4xl para comprimir el ancho total */}
      <div className="mx-auto max-w-4xl">
        {/* Reducido el gap (espacio entre tarjetas) de 6 a 4 */}
        <div className="grid w-full gap-4 justify-center sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;