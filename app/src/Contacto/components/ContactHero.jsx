import { Localized } from "../../i18n/Language";
import { InquiryHeading } from "../../components/InquiryLayout";
export default function ContactHero() {
  return <InquiryHeading eyebrow="Hablemos · Contacto" title={<>Una conversación.{" "}<Localized as="br" /><Localized as="em">Muchas posibilidades.</Localized></>}>¿Tienes una idea, una pregunta o un reto en tu negocio? Cuéntanos. Empecemos por entender lo que necesitas.</InquiryHeading>;
}
