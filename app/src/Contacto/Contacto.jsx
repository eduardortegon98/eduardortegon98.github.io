import ContactHero from "./components/ContactHero";
import ContactInfo from "./components/ContactInfo";
import ContactForm from "./components/ContactForm";
import { InquiryLayout } from "../components/InquiryLayout";
export default function Contacto() {
  return <InquiryLayout sidebar={<><ContactHero /><ContactInfo /></>}><ContactForm /></InquiryLayout>;
}
