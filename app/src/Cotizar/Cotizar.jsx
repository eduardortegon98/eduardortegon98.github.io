import QuoteHero from "./components/QuoteHero";
import QuoteForm from "./components/QuoteForm";
import { InquiryLayout } from "../components/InquiryLayout";
export default function Cotizar() {
  return <InquiryLayout sidebar={<QuoteHero />}><QuoteForm /></InquiryLayout>;
}
