import React from "react";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

import ContactCard from "./ContactCard";

const PHONE = "3337255586";

const CONTACT_INFO = [
  {
    icon: Phone,
    title: "Teléfono",
    value: PHONE,
  },
  {
    icon: Mail,
    title: "Correo electrónico",
    value: "eduardortegon2398@gmail.com",
  },
  {
    icon: MapPin,
    title: "Ubicación",
    value: "Bogotá, Colombia",
  },
];

const ContactInfo = () => {
  return (
    <div className="space-y-6 lg:col-span-2">
      <div>
        <h2 className="text-2xl font-bold">Hablemos</h2>

        <p className="mt-3 text-white/70">
          Puedes comunicarte con nosotros a través de cualquiera de estos
          canales.
        </p>
      </div>

      <div className="space-y-4">
        {CONTACT_INFO.map((item) => (
          <ContactCard
            key={item.title}
            icon={item.icon}
            title={item.title}
            value={item.value}
          />
        ))}
      </div>

      <a
        href={`https://wa.me/${PHONE}`}
        target="_blank"
        rel="noopener noreferrer"
        className="
          inline-flex items-center gap-3 rounded-2xl
          bg-[#C0FDB9] px-6 py-4 font-bold text-black
          transition hover:brightness-110
        "
      >
        <MessageCircle size={20} />
        Hablar por WhatsApp
      </a>
    </div>
  );
};

export default ContactInfo;
