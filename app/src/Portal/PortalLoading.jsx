import { useLanguage } from '../i18n/Language';
import { Cardio } from 'ldrs/react';
import 'ldrs/react/Cardio.css';
import './PortalLoading.css';
export default function PortalLoading({ compact = false }) {
  const { language } = useLanguage();
  return <div className={'portal-branded-loading' + (compact ? ' compact' : '')} role="status" aria-live="polite"><div aria-hidden="true"><Cardio size="50" stroke="4" speed="2" color="#24573d"/></div><span>{language === 'en' ? 'Loading…' : 'Cargando…'}</span></div>;
}
