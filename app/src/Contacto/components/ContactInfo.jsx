import { Localized } from "../../i18n/Language";
import { Mail, Phone, MapPin, MessageCircle, ArrowUpRight } from "lucide-react";
const channels = [
  { Icon: Mail, label: "Correo electrónico", value: "eduardortegon2398@gmail.com", href: "mailto:eduardortegon2398@gmail.com" },
  { Icon: Phone, label: "Teléfono", value: "+57 333 725 5586", href: "tel:+573337255586" },
  { Icon: MapPin, label: "Desde Colombia", value: "Bogotá · Conectados con tu negocio" },
];
export default function ContactInfo() {
  return <Localized as="div" className="inquiry-channels"><Localized as="h2">También nos encuentras aquí</Localized>{channels.map(({ Icon, label, value, href }) => {
    const content = <><Localized as="span" className="inquiry-channel-icon"><Icon size={18} /></Localized><Localized as="div"><Localized as="small">{label}</Localized><Localized as="strong">{value}</Localized></Localized>{href && <ArrowUpRight size={15} />}</>;
    return href ? <Localized as="a" key={label} className="inquiry-channel" href={href}>{content}</Localized> : <Localized as="div" key={label} className="inquiry-channel">{content}</Localized>;
  })}<Localized as="a" className="inquiry-whatsapp" href="https://wa.me/573337255586" target="_blank" rel="noopener noreferrer"><MessageCircle size={19} />Prefiero hablar por WhatsApp<ArrowUpRight size={16} /></Localized></Localized>;
}
