import React from "react";

import ServiceCard from "./ServiceCard";
import { SERVICES } from "../constants";

const ServicesGrid = () => {
  return (
    <section className="px-6">
      <div className="mx-auto grid  gap-4 md:grid-cols-3">
        {SERVICES.map((service) => (
          <ServiceCard key={service.title} {...service} />
        ))}
      </div>
    </section>
  );
};

export default ServicesGrid;
