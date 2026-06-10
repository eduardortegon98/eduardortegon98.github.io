import React from "react";
import { ArrowRight } from "lucide-react";

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-[#C0FDB9]";

const ContactForm = () => {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl lg:col-span-3">
      <h2 className="text-2xl font-bold">
        Envíanos un mensaje
      </h2>

      <p className="mt-3 text-white/70">
        Completa la siguiente información y nos pondremos en contacto contigo.
      </p>

      <form className="mt-10 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Nombre
            </label>

            <input
              type="text"
              placeholder="Tu nombre"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Correo electrónico
            </label>

            <input
              type="email"
              placeholder="correo@ejemplo.com"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Asunto
          </label>

          <input
            type="text"
            placeholder="¿En qué podemos ayudarte?"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Mensaje
          </label>

          <textarea
            rows={6}
            placeholder="Describe tu proyecto..."
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          className="
            inline-flex w-full items-center justify-center gap-2
            rounded-2xl bg-[#C0FDB9]
            px-6 py-4 font-bold text-black
            transition hover:brightness-110
          "
        >
          Enviar mensaje
          <ArrowRight size={20} />
        </button>
      </form>
    </div>
  );
};

export default ContactForm;