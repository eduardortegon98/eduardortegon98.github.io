import { useLanguage } from '../i18n/Language';
import { Cardio } from 'ldrs/react';
import 'ldrs/react/Cardio.css';
import './PortalLoading.css';
export default function PortalLoading({ compact = false, overlay = false }) {
  const { language } = useLanguage();
  return <div className={'portal-branded-loading' + (compact ? ' compact' : '') + (overlay ? ' overlay' : '')} role="status" aria-live="polite" aria-label={language === 'en' ? 'Loading' : 'Cargando'}><div className="portal-cardio" aria-hidden="true"><Cardio size="42" stroke="3" speed="2" color="#24573d"/></div></div>;
}
