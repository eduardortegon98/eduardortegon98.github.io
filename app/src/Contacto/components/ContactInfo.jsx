import { Mail, Phone, MapPin, MessageCircle, ArrowUpRight } from "lucide-react";
const channels = [
  { Icon: Mail, label: "Correo electrónico", value: "eduardortegon2398@gmail.com", href: "mailto:eduardortegon2398@gmail.com" },
  { Icon: Phone, label: "Teléfono", value: "+57 333 725 5586", href: "tel:+573337255586" },
  { Icon: MapPin, label: "Desde Colombia", value: "Bogotá · Conectados con tu negocio" },
];
export default function ContactInfo() {
  return <div className="inquiry-channels"><h2>También nos encuentras aquí</h2>{channels.map(({ Icon, label, value, href }) => {
    const content = <><span className="inquiry-channel-icon"><Icon size={18} /></span><div><small>{label}</small><strong>{value}</strong></div>{href && <ArrowUpRight size={15} />}</>;
    return href ? <a key={label} className="inquiry-channel" href={href}>{content}</a> : <div key={label} className="inquiry-channel">{content}</div>;
  })}<a className="inquiry-whatsapp" href="https://wa.me/573337255586" target="_blank" rel="noopener noreferrer"><MessageCircle size={19} />Prefiero hablar por WhatsApp<ArrowUpRight size={16} /></a></div>;
}
