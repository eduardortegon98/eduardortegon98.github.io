import React from "react";
import {
  ArrowRight,
  MessageCircle,
  ChevronDown,
} from "lucide-react";

import {
  PHONE,
  SERVICE_OPTIONS,
  BUDGET_OPTIONS,
} from "../constants";

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-[#C0FDB9]";

const selectClass = `${inputClass} appearance-none pr-12 cursor-pointer`;

const QuoteForm = () => {
  return (
    <section className="px-6 py-24 justify-center items-center">
      <div className="text-black mx-auto  rounded-3xl border border-white bg-[var(--color-text)]/15 p-8 backdrop-blur-xl md:p-10">
        {/* Encabezado */}
        <div>
          <h2 className="text-3xl font-bold">
            Solicitar cotización
          </h2>

          <p className="mt-3 ">
            Completa el formulario y prepararemos una propuesta personalizada.
          </p>
        </div>

        {/* Formulario */}
        <form className="mt-10 grid gap-6 md:grid-cols-2">
          {/* Empresa / Persona */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Empresa o persona solicitante
            </label>

            <input
              type="text"
              placeholder="Ej: Panadería San José o Juan Pérez"
              className={inputClass}
            />
          </div>

          {/* Servicio */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Servicio de interés
            </label>

            <div className="relative">
              <select className={selectClass} defaultValue="">
                <option
                  value=""
                  disabled
                  className="bg-[#111] text-white"
                >
                  Selecciona una opción
                </option>

                {SERVICE_OPTIONS.map((service) => (
                  <option
                    key={service}
                    value={service}
                    className="bg-[#111] text-white"
                  >
                    {service}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={18}
                className="
                  pointer-events-none
                  absolute right-4 top-1/2
                  -translate-y-1/2
                  text-white/50
                "
              />
            </div>
          </div>

          {/* Presupuesto */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Presupuesto estimado
            </label>

            <div className="relative">
              <select className={selectClass} defaultValue="">
                <option
                  value=""
                  disabled
                  className="bg-[#111] text-white"
                >
                  Selecciona un rango
                </option>

                {BUDGET_OPTIONS.map((budget) => (
                  <option
                    key={budget}
                    value={budget}
                    className="bg-[#111] text-white"
                  >
                    {budget}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={18}
                className="
                  pointer-events-none
                  absolute right-4 top-1/2
                  -translate-y-1/2
                  text-white/50
                "
              />
            </div>
          </div>

          {/* Botón */}
          <div className="flex items-end">
            <button
              type="submit"
              className="
                inline-flex w-full items-center justify-center gap-2
                rounded-2xl bg-[#C0FDB9]
                px-6 py-4 font-bold text-black
                transition hover:brightness-110
              "
            >
              Solicitar cotización
              <ArrowRight size={20} />
            </button>
          </div>
        </form>

        {/* WhatsApp */}
        <div className="mt-8 rounded-2xl border border-[#C0FDB9]/20 bg-[#C0FDB9]/5 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-bold">
                ¿Prefieres atención inmediata?
              </h3>

              <p className="mt-1 text-sm ">
                Escríbenos directamente por WhatsApp.
              </p>
            </div>

            <a
              href={`https://wa.me/${PHONE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center justify-center gap-2
                rounded-xl bg-[#C0FDB9]
                px-5 py-3 font-semibold text-black
                transition hover:brightness-110
              "
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteForm;