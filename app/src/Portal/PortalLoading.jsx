import { useLanguage } from '../i18n/Language';
import './PortalLoading.css';
export default function PortalLoading({ compact = false }) {
  const { language } = useLanguage();
  return <div className={'portal-branded-loading' + (compact ? ' compact' : '')} role="status" aria-live="polite"><div className="portal-loader-spinner" aria-hidden="true"/><span>{language === 'en' ? 'Loading…' : 'Cargando…'}</span></div>;
}
