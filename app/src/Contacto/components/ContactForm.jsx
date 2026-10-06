import { MessageSquare } from "lucide-react";
import useSubmission from "../../hooks/useSubmission";
import { Honeypot } from "../../components/FormStatus";
import { InquirySection, InquiryField, InquiryStepForm } from "../../components/InquiryLayout";
export default function ContactForm() {
  const { submit, pending, status } = useSubmission("contact", "Tu mensaje quedó guardado. Nos pondremos en contacto contigo.");
  return <section className="inquiry-card" aria-labelledby="contact-form-title"><header className="inquiry-card-heading"><span className="inquiry-card-icon"><MessageSquare size={21} /></span><div><h2 id="contact-form-title">Déjanos tu mensaje</h2><p>No necesitas tenerlo todo resuelto. Empecemos por tu idea.</p></div></header>
    <InquiryStepForm pending={pending} submit={submit} status={status} submitLabel="Enviar mensaje" pendingLabel="Enviando tu mensaje..." note="Usaremos tus datos para responder a tu consulta." honeypot={<Honeypot />}>
      <InquirySection number="01" title="Primero, conozcámonos">
        <InquiryField id="contact-name" label="Tu nombre"><input id="contact-name" name="name" required maxLength={120} autoComplete="name" placeholder="¿Cómo te llamas?" /></InquiryField>
        <InquiryField id="contact-email" label="Correo electrónico"><input id="contact-email" name="email" type="email" required maxLength={254} autoComplete="email" placeholder="tu@empresa.com" /></InquiryField>
      </InquirySection>
      <InquirySection number="02" title="¿Qué tienes en mente?">
        <InquiryField id="contact-subject" label="Asunto" wide><input id="contact-subject" name="subject" required maxLength={200} placeholder="Por ejemplo: una web para mi negocio" /></InquiryField>
        <InquiryField id="contact-message" label="Tu mensaje" wide hint="Cuéntanos qué necesitas, qué te gustaría mejorar o qué duda tienes."><textarea id="contact-message" name="message" required maxLength={5000} rows={5} placeholder="Hola, me gustaría..." /></InquiryField>
      </InquirySection>
      </InquiryStepForm>
  </section>;
}
