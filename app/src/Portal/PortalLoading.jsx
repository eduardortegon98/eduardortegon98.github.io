import { useLanguage } from '../i18n/Language';
import Cardio from '../vendor/uiball/Cardio';
import './PortalLoading.css';
export default function PortalLoading({ compact = false }) {
  const { language } = useLanguage();
  return <div className={'portal-branded-loading' + (compact ? ' compact' : '')} role="status" aria-live="polite"><div aria-hidden="true"><Cardio size={64} stroke={3} speed={1.5} color="#24573d"/></div><span>{language === 'en' ? 'Loading…' : 'Cargando…'}</span></div>;
}
