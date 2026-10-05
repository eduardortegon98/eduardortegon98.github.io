import useSubmission from "../../hooks/useSubmission";
import FormStatus, { Honeypot } from "../../components/FormStatus";
import React from "react";
import { ArrowRight } from "lucide-react";

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-[#C0FDB9]";

const ContactForm = () => {
  const { submit, pending, status } = useSubmission("contact", "Tu mensaje quedó guardado. Nos pondremos en contacto contigo.");
  return (
    <div className="rounded-3xl border border-white bg-[var(--color-text)]/15 text-black p-8 backdrop-blur-xl lg:col-span-3">
      <h2 className="text-2xl font-bold">
        Envíanos un mensaje
      </h2>

      <p className="mt-3">
        Completa la siguiente información y nos pondremos en contacto contigo.
      </p>

      <form className="mt-10 space-y-6" onSubmit={submit} aria-busy={pending}>
        <Honeypot />
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Nombre
            </label>

            <input
              type="text"
              name="name" aria-label="name" required maxLength={120} placeholder="Tu nombre"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Correo electrónico
            </label>

            <input
              type="email"
              name="email" aria-label="email" required maxLength={254} placeholder="correo@ejemplo.com"
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
            name="subject" aria-label="subject" required maxLength={200} placeholder="¿En qué podemos ayudarte?"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Mensaje
          </label>

          <textarea
            rows={6}
            name="message" aria-label="message" required maxLength={5000} placeholder="Describe tu proyecto..."
            className={inputClass}
          />
        </div>

        <button
          type="submit" disabled={pending}
          className="
            inline-flex w-full items-center justify-center gap-2
            rounded-2xl bg-[#C0FDB9]
            px-6 py-4 font-bold text-black
            transition hover:brightness-110
          "
        >
          {pending ? "Enviando..." : "Enviar mensaje"}
          <ArrowRight size={20} />
        </button>
      <FormStatus status={status} />
      </form>
    </div>
  );
};

export default ContactForm;