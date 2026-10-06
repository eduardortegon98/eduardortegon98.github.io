import { Localized } from "../../i18n/Language";
import React from "react";
import ServiceCard from "./ServiceCard";
import { SERVICES } from "../constants";

const ServicesGrid = () => {
  return (
    <Localized as="section" className="py-8 px-4 sm:px-6">
      {/* Reducido de max-w-7xl a max-w-4xl para comprimir el ancho total */}
      <Localized as="div" className="mx-auto max-w-4xl">
        {/* Reducido el gap (espacio entre tarjetas) de 6 a 4 */}
        <Localized as="div" className="grid w-full gap-4 justify-center sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </Localized>
      </Localized>
    </Localized>
  );
};

export default ServicesGrid;