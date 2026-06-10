import React from "react";

const ServiceCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <Icon size={30} className="text-[#C0FDB9]" />

      <h3 className="mt-4 text-xl font-bold">{title}</h3>

      <p className="mt-2 text-white/70">{description}</p>
    </div>
  );
};

export default ServiceCard;
