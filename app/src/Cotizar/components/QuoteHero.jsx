import { Localized } from "../../i18n/Language";
import { MessageCircle, ArrowUpRight } from "lucide-react";
import { InquiryHeading } from "../../components/InquiryLayout";
import { PHONE } from "../constants";
const steps = [
  ["Nos cuentas tu idea", "El objetivo, el servicio que buscas y lo que tu negocio necesita."],
  ["Definimos el alcance", "Revisamos contigo los detalles y las prioridades del proyecto."],
  ["Preparamos una propuesta", "Una solución con alcance, tiempos y presupuesto para evaluar."],
];
export default function QuoteHero() {
  return <><InquiryHeading eyebrow="Tu próximo proyecto · Cotización" title={<>De una buena idea{" "}<Localized as="br" /><Localized as="em">a un plan concreto.</Localized></>}>Cada negocio es diferente. Cuéntanos qué quieres construir y encontremos una solución que tenga sentido para ti.</InquiryHeading><Localized as="div" className="inquiry-services"><Localized as="span">Desarrollo web</Localized><Localized as="span">Automatización</Localized><Localized as="span">Inteligencia artificial</Localized></Localized><Localized as="div" className="inquiry-process"><Localized as="h2">Así empezamos</Localized><Localized as="ol">{steps.map(([title, description], index) => <Localized as="li" key={title}><Localized as="span">{index + 1}</Localized><Localized as="div"><Localized as="strong">{title}</Localized><Localized as="p">{description}</Localized></Localized></Localized>)}</Localized></Localized><Localized as="a" className="inquiry-whatsapp" href={`https://wa.me/${PHONE}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={19} />¿Lo hablamos por WhatsApp?<ArrowUpRight size={16} /></Localized></>;
}
