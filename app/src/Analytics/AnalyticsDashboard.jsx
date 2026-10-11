import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowLeft, ArrowUpRight, BarChart3, Eye, Users, MousePointer2, MessageSquare, RefreshCw, ShieldCheck, Radio } from 'lucide-react';
import Access from '../Portal/Access';
import { supabase } from '../lib/supabase';
import { LanguageSwitch, useLanguage } from '../i18n/Language';
import './AnalyticsDashboard.css';

export default function AnalyticsDashboard() {
  return <Access admin>{() => <AnalyticsReport />}</Access>;
}

function AnalyticsReport() {
  const { language } = useLanguage();
  const en = language === 'en';
  const t = (es, english) => en ? english : es;
  const [days, setDays] = useState(7);
  const [revision, setRevision] = useState(0);
  const [state, setState] = useState({ loading: true });
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 65000);
    setState({ loading: true });
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke('analytics-dashboard', { body: { days }, signal: controller.signal });
        if (error) {
          let code = error.context?.status === 401 ? 'unauthorized' : error.context?.status === 403 ? 'forbidden' : error.context?.status === 404 ? 'function_missing' : 'analytics_unavailable';
          try { const response = await error.context?.json(); if (response?.error) code = response.error; } catch {}
          throw new Error(code);
        }
        if (!data?.summary || !Array.isArray(data.daily)) throw new Error(data?.error || 'analytics_unavailable');
        if (active) setState({ data });
      } catch (failure) { if (active) setState({ error: failure.message }); }
      finally { clearTimeout(timeout); }
    })();
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, [days, revision]);
  const diagnostics = {
    unauthorized: t('La sesión fue rechazada. Cierra sesión y vuelve a entrar; revisa también el filtro JWT legacy de la función.', 'Session rejected. Sign in again and check the function legacy JWT filter.'),
    forbidden: t('Tu cuenta no tiene permiso de súper administrador.', 'Your account needs super administrator access.'),
    function_missing: t('No se encontró la función analytics-dashboard en Supabase.', 'Supabase analytics-dashboard function was not found.'),
    configuration: t('Falta configuración de Supabase en la función.', 'Supabase function configuration is missing.'),
    google_credentials_missing: t('Falta GOOGLE_SERVICE_ACCOUNT_JSON o no contiene client_email y private_key.', 'GOOGLE_SERVICE_ACCOUNT_JSON is missing or lacks client_email and private_key.'),
    google_credentials_invalid: t('GOOGLE_SERVICE_ACCOUNT_JSON no contiene un JSON válido.', 'GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON.'),
    property_id_invalid: t('GA_PROPERTY_ID debe contener únicamente el ID numérico de la propiedad.', 'GA_PROPERTY_ID must contain the numeric property ID.'),
    google_auth: t('Google rechazó la clave de la cuenta de servicio.', 'Google rejected the service account key.'),
    google_api_disabled: t('Habilita Google Analytics Data API en el proyecto de la cuenta de servicio.', 'Enable Google Analytics Data API in the service account project.'),
    google_permission_denied: t('Agrega el correo de la cuenta de servicio como Lector en la propiedad de Google Analytics y verifica GA_PROPERTY_ID.', 'Grant the service account Viewer access to the Analytics property and verify GA_PROPERTY_ID.'),
    property_not_found: t('Google no encontró la propiedad. Revisa GA_PROPERTY_ID.', 'Google could not find the property. Check GA_PROPERTY_ID.'),
    google_quota: t('Google alcanzó el límite de consultas. Inténtalo más tarde.', 'Google query quota reached. Try again later.'),
  };
  const data = state.data;
  const format = value => value == null ? '—' : new Intl.NumberFormat(en ? 'en-US' : 'es-CO').format(value);
  const metrics = [
    [Users, t('Visitantes activos', 'Active visitors'), data?.summary.activeUsers, t('Personas distintas en el periodo', 'Distinct people in this period')],
    [MousePointer2, t('Sesiones', 'Sessions'), data?.summary.sessions, t('Visitas iniciadas', 'Visits started')],
    [Eye, t('Páginas vistas', 'Page views'), data?.summary.screenPageViews, t('Incluye vistas repetidas', 'Includes repeat views')],
    [MessageSquare, t('Consultas enviadas', 'Enquiries sent'), data?.leads, t('Formularios guardados con analítica aceptada', 'Saved forms with analytics consent')],
  ];
  const dateLabel = value => new Intl.DateTimeFormat(en ? 'en-US' : 'es-CO', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(value + 'T12:00:00Z'));
  return <div className="traffic-dashboard">
    <aside className="traffic-sidebar"><Link to="/" className="traffic-brand">O<span>Ortegón</span></Link><span className="traffic-eyebrow">{t('ESPACIO DE TRABAJO', 'WORKSPACE')}</span><Link to="/panel"><ArrowLeft size={18} />{t('Panel de clientes', 'Client dashboard')}</Link><div className="traffic-nav-active"><BarChart3 size={18} />{t('Analítica', 'Analytics')}</div><div className="traffic-security"><ShieldCheck size={18} /><p>{t('Solo súper administrador', 'Super administrator only')}</p><small>Google Analytics 4</small></div></aside>
    <main className="traffic-main">
      <header className="traffic-header"><div><p className="traffic-eyebrow">{t('PULSO DE TU WEB', 'YOUR WEBSITE AT A GLANCE')}</p><h1>{t('De las visitas a las oportunidades.', 'From visits to opportunities.')}</h1><p>{t('Conoce cómo llega la gente y qué explora en Soluciones Ortegón.', 'Understand how people arrive and what they explore at Soluciones Ortegón.')}</p></div><LanguageSwitch /></header>
      <div className="traffic-toolbar"><div className="traffic-range" role="group" aria-label={t('Periodo del informe', 'Report period')}>{[7, 30, 90].map(n => <button key={n} aria-pressed={days === n} onClick={() => setDays(n)}>{n} {t('días', 'days')}</button>)}</div><button className="traffic-refresh" disabled={state.loading} onClick={() => setRevision(n => n + 1)}><RefreshCw size={16} />{t('Actualizar', 'Refresh')}</button><a href="https://analytics.google.com/" target="_blank" rel="noreferrer">Google Analytics <ArrowUpRight size={16} /></a></div>
      {state.error && <section className="traffic-connection" role="status"><Activity size={26} /><div><h2>{t('Conexión de informes pendiente', 'Reports connection pending')}</h2><p>{t('No pudimos consultar Google Analytics. La conexión de lectura debe estar configurada y disponible para mostrar cifras reales.', 'We could not query Google Analytics. The read connection must be configured and available to show real figures.')}</p>{diagnostics[state.error] && <p role="alert">{diagnostics[state.error]}</p>}<a href="https://analytics.google.com/" target="_blank" rel="noreferrer">{t('Consultar en Google Analytics', 'View in Google Analytics')} <ArrowUpRight size={16} /></a></div></section>}
      {state.loading && <p role="status" className="traffic-loading">{t('Consultando informes…', 'Loading reports…')}</p>}
      <section className="traffic-metrics" aria-label={t('Resumen del tráfico', 'Traffic summary')}>{metrics.map(([Icon, label, value, note]) => <article key={label}><Icon size={20} /><span>{label}</span><strong>{format(value)}</strong><small>{note}</small></article>)}</section>
      <div className="traffic-primary"><section className="traffic-card"><div className="traffic-card-heading"><div><p className="traffic-eyebrow">{t('EVOLUCIÓN DIARIA', 'DAILY TREND')}</p><h2>{t('El ritmo de las visitas', 'The pace of visits')}</h2></div><span className="traffic-legend"><i />{t('Sesiones', 'Sessions')}</span></div>{data?.daily.length ? <Trend rows={data.daily} label={t('Sesiones diarias', 'Daily sessions')} formatDate={dateLabel} /> : <Empty loading={state.loading} en={en} />}</section>
      <section className="traffic-card traffic-live"><Radio size={22} /><p className="traffic-eyebrow">{t('ÚLTIMOS 30 MINUTOS', 'LAST 30 MINUTES')}</p><h2>{t('Ahora en tu web', 'On your website now')}</h2><strong>{format(data?.realtime?.activeUsers)}</strong><p>{t('Visitantes activos', 'Active visitors')}</p><small>{t('Actualiza para consultar de nuevo. Google puede aplicar demoras y umbrales de privacidad.', 'Refresh to check again. Google may apply delays and privacy thresholds.')}</small></section></div>
      <div className="traffic-breakdowns"><Breakdown title={t('¿De dónde llegan?', 'Where do they come from?')} subtitle={t('Origen / medio · sesiones', 'Source / medium · sessions')} rows={data?.sources} loading={state.loading} en={en} /><Breakdown title={t('¿Qué páginas exploran?', 'Which pages do they explore?')} subtitle={t('Página · vistas', 'Page · views')} rows={data?.pages} loading={state.loading} en={en} /><Breakdown title={t('¿En qué dispositivo?', 'On which device?')} subtitle={t('Dispositivo · sesiones', 'Device · sessions')} rows={data?.devices} loading={state.loading} en={en} /></div>
      <footer className="traffic-footnote"><ShieldCheck size={16} /><p>{t('Datos agregados de visitantes que aceptaron analítica. No incluye contenido de mensajes ni información personal de los formularios. Los informes históricos pueden tardar 24–48 horas.', 'Aggregate data from visitors who accepted analytics. No message contents or personal form information. Historical reports may take 24–48 hours.')}{data?.updatedAt && ` · ${t('Consulta', 'Fetched')}: ${new Intl.DateTimeFormat(en ? 'en-US' : 'es-CO', { timeStyle: 'short', timeZone: 'America/Bogota' }).format(new Date(data.updatedAt))} (Bogotá)`}</p></footer>
    </main>
  </div>;
}

function Empty({ loading, en }) { return <div className="traffic-empty"><BarChart3 size={30} /><p>{loading ? (en ? 'Loading…' : 'Cargando…') : (en ? 'No data available yet' : 'Aún no hay datos disponibles')}</p></div>; }
function Breakdown({ title, subtitle, rows, loading, en }) {
  const total = (rows || []).reduce((sum, row) => sum + row.value, 0);
  return <section className="traffic-card"><h2>{title}</h2><p className="traffic-subtitle">{subtitle}</p>{rows?.length ? <ul className="traffic-ranking">{rows.map((row, i) => <li key={row.label + i}><div><span title={row.label}>{row.label}</span><strong>{new Intl.NumberFormat(en ? 'en-US' : 'es-CO').format(row.value)}</strong></div><progress value={row.value} max={Math.max(total, 1)} aria-label={row.label} /></li>)}</ul> : <Empty loading={loading} en={en} />}</section>;
}
function Trend({ rows, label, formatDate }) {
  const max = Math.max(1, ...rows.map(row => row.sessions));
  const points = rows.map((row, i) => `${40 + i * 620 / Math.max(1, rows.length - 1)},${190 - row.sessions / max * 155}`).join(' ');
  return <><svg className="traffic-chart" viewBox="0 0 700 225" role="img" aria-label={label}><title>{label}</title>{[0, .5, 1].map(r => <g key={r}><line x1="40" x2="660" y1={190-r*155} y2={190-r*155} stroke="#e6ede9" /><text x="30" y={194-r*155} textAnchor="end" fill="#708279" fontSize="11">{Math.round(max*r)}</text></g>)}<polygon points={`40,190 ${points} 660,190`} fill="#e8f3ec" /><polyline points={points} fill="none" stroke="#367958" strokeWidth="3" strokeLinejoin="round" />{rows.length === 1 && <circle cx="40" cy={190-rows[0].sessions/max*155} r="4" fill="#367958" />}<text x="40" y="216" fill="#708279" fontSize="11">{formatDate(rows[0].date)}</text><text x="660" y="216" textAnchor="end" fill="#708279" fontSize="11">{formatDate(rows.at(-1).date)}</text></svg><details className="traffic-chart-data"><summary>{label}</summary><div><table><thead><tr><th>{label}</th><th>#</th></tr></thead><tbody>{rows.map(row => <tr key={row.date}><td>{formatDate(row.date)}</td><td>{row.sessions}</td></tr>)}</tbody></table></div></details></>;
}
