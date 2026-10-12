import { useLanguage } from '../i18n/Language';
import Ring2 from '../vendor/uiball/Ring2';
import './PortalLoading.css';
export default function PortalLoading({ compact = false }) {
  const { language } = useLanguage();
  return <div className={'portal-branded-loading' + (compact ? ' compact' : '')} role="status" aria-live="polite"><div aria-hidden="true"><Ring2 size={40} stroke={4} strokeLength={0.25} speed={0.8} color="#24573d"/></div><span>{language === 'en' ? 'Loading…' : 'Cargando…'}</span></div>;
}
