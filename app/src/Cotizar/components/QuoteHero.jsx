import { MessageCircle, ArrowUpRight } from "lucide-react";
import { InquiryHeading } from "../../components/InquiryLayout";
import { PHONE } from "../constants";
const steps = [
  ["Nos cuentas tu idea", "El objetivo, el servicio que buscas y lo que tu negocio necesita."],
  ["Definimos el alcance", "Revisamos contigo los detalles y las prioridades del proyecto."],
  ["Preparamos una propuesta", "Una solución con alcance, tiempos y presupuesto para evaluar."],
];
export default function QuoteHero() {
  return <><InquiryHeading eyebrow="Tu próximo proyecto · Cotización" title={<>De una buena idea{" "}<br /><em>a un plan concreto.</em></>}>Cada negocio es diferente. Cuéntanos qué quieres construir y encontremos una solución que tenga sentido para ti.</InquiryHeading><div className="inquiry-services"><span>Desarrollo web</span><span>Automatización</span><span>Inteligencia artificial</span></div><div className="inquiry-process"><h2>Así empezamos</h2><ol>{steps.map(([title, description], index) => <li key={title}><span>{index + 1}</span><div><strong>{title}</strong><p>{description}</p></div></li>)}</ol></div><a className="inquiry-whatsapp" href={`https://wa.me/${PHONE}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={19} />¿Lo hablamos por WhatsApp?<ArrowUpRight size={16} /></a></>;
}
