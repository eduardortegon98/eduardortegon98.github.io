import Logo from '../../public/Soluciones_Tecnologicas_Ortegon.png';
import { useLanguage } from '../i18n/Language';
import './PortalLoading.css';
export default function PortalLoading({ compact = false }) {
  const { language } = useLanguage();
  return <div className={'portal-branded-loading' + (compact ? ' compact' : '')} role="status" aria-live="polite"><div className="portal-loading-mark"><img src={Logo} width="96" height="64" alt="Soluciones Ortegón" decoding="async"/></div><span>{language === 'en' ? 'Loading…' : 'Cargando…'}</span><div className="portal-loading-track" aria-hidden="true"><i/></div></div>;
}
