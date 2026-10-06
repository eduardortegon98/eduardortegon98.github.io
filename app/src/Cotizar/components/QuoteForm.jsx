import { Localized } from "../../i18n/Language";
import { ClipboardList } from "lucide-react";
import useSubmission from "../../hooks/useSubmission";
import { Honeypot } from "../../components/FormStatus";
import { InquirySection, InquiryField, InquirySelect, InquiryStepForm } from "../../components/InquiryLayout";
import { SERVICE_OPTIONS, BUDGET_OPTIONS } from "../constants";
export default function QuoteForm() {
  const { submit, pending, status } = useSubmission("quote", "Tu solicitud quedó guardada. Te contactaremos para preparar la propuesta.");
  return <Localized as="section" className="inquiry-card" aria-labelledby="quote-form-title"><Localized as="header" className="inquiry-card-heading"><Localized as="span" className="inquiry-card-icon"><ClipboardList size={21} /></Localized><Localized as="div"><Localized as="h2" id="quote-form-title">Cuéntanos sobre tu proyecto</Localized><Localized as="p">Los detalles nos ayudan a preparar una propuesta a tu medida.</Localized></Localized></Localized><InquiryStepForm pending={pending} submit={submit} status={status} submitLabel="Solicitar mi cotización" pendingLabel="Enviando tu solicitud..." note="Enviar esta solicitud no te compromete a contratar." honeypot={<Honeypot />}>
    <InquirySection number="01" title="Tus datos de contacto">
      <InquiryField id="quote-name" label="Tu nombre o empresa" wide><Localized as="input" id="quote-name" name="name" required maxLength={120} autoComplete="organization" placeholder="¿Para quién construiremos la solución?" /></InquiryField>
      <InquiryField id="quote-email" label="Correo electrónico"><Localized as="input" id="quote-email" name="email" type="email" required maxLength={254} autoComplete="email" placeholder="tu@empresa.com" /></InquiryField>
      <InquiryField id="quote-phone" label="Teléfono" optional><Localized as="input" id="quote-phone" name="phone" type="tel" maxLength={40} autoComplete="tel" placeholder="+57 300 000 0000" /></InquiryField>
    </InquirySection>
    <InquirySection number="02" title="La solución que buscas">
      <InquiryField id="quote-service" label="Servicio de interés"><InquirySelect id="quote-service" name="service" options={SERVICE_OPTIONS} placeholder="Elige un servicio" /></InquiryField>
      <InquiryField id="quote-budget" label="Presupuesto estimado"><InquirySelect id="quote-budget" name="budget" options={BUDGET_OPTIONS} placeholder="Elige un rango" /></InquiryField>
      <InquiryField id="quote-message" label="¿Qué te gustaría lograr?" wide hint="Incluye el objetivo, las funciones que imaginas y si tienes una fecha en mente."><Localized as="textarea" id="quote-message" name="message" required maxLength={5000} rows={4} placeholder="Necesitamos una solución que nos ayude a..." /></InquiryField>
    </InquirySection>
    </InquiryStepForm></Localized>;
}
