import { useEffect, useState } from 'react';
import { Navigate, useOutletContext } from 'react-router-dom';
import { Activity, Settings2, Check, X, ArrowUpRight, BarChart3, Eye, Users, MousePointer2, MessageSquare, RefreshCw, ShieldCheck, Radio, Globe2, Linkedin, Search, Share2, Mail, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../i18n/Language';
import './AnalyticsDashboard.css';
import './AdminCharts.css';
import './GlassAnalytics.css';
import WorldAudience from './WorldAudience';
import ManagementCards from '../Portal/ManagementCards';
import PortalLoading from '../Portal/PortalLoading';
import EditableBoard from './EditableBoard';
import CountryRegions from './CountryRegions';

export default function AnalyticsDashboard() {
  const { role } = useOutletContext();
  return role === 'super_admin' ? <AnalyticsReport /> : <Navigate to="/panel" replace />;
}

function AnalyticsReport() {
  const { user } = useOutletContext();
  const { language } = useLanguage();
  const en = language === 'en';
  const t = (es, english) => en ? english : es;
  const [panelEditing, setPanelEditing] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [focus, setFocus] = useState('countries');
  const [requestedFocus, setRequestedFocus] = useState('countries');
  const changingChart = focus !== requestedFocus;
  const openingMetric = focus === 'countries' && requestedFocus !== 'countries';
  const closingMetric = focus !== 'countries' && requestedFocus === 'countries';
  const mapOnly = focus === 'countries' && requestedFocus === 'countries';
  useEffect(() => {
    if (focus === requestedFocus) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setFocus(requestedFocus); return; }
    const timer = setTimeout(() => setFocus(requestedFocus), 360);
    return () => clearTimeout(timer);
  }, [focus, requestedFocus]);
  const [days, setDays] = useState(7);
  const [revision, setRevision] = useState(0);
  const [state, setState] = useState({ loading: true });
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 65000);
    setState(previous => ({ ...previous, loading: true, error: undefined }));
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
    filters_not_supported: t('Actualiza la función analytics-dashboard en Supabase para activar los filtros. No se mostrarán cifras sin filtrar como si estuvieran filtradas.', 'Deploy the updated Supabase analytics-dashboard function to enable filters.'),
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
  const metricKey = { 'activeUsers': 0, 'sessions': 1, 'screenPageViews': 2 };
  const activeMetric = metrics[metricKey[focus] ?? 1];
  const expandedTitle = focus === 'regions' ? selectedCountry + ' · ' + t('Regiones', 'Regions') : focus === 'countries' ? t('Audiencia mundial', 'Worldwide audience') : focus === 'sources' ? t('Orígenes del tráfico', 'Traffic sources') : focus === 'devices' ? t('Dispositivos', 'Devices') : focus === 'pages' ? t('Páginas más visitadas', 'Most visited pages') : focus === 'leads' ? t('Consultas enviadas', 'Enquiries sent') : activeMetric[1];
  return <div className="traffic-dashboard analytics-interactive customizable-analytics">
    <main aria-busy={Boolean(state.loading)} className={`traffic-main ${mapOnly ? "is-map-only" : "has-open-metric"} ${closingMetric ? "is-closing-metric" : ""} ${openingMetric ? "is-opening-metric" : ""}`} data-focus={focus}>
      
      <div className="traffic-toolbar"><div className="analytics-period-actions" role="group" aria-label={t('Periodo y actualización','Period and refresh')}><div className="traffic-range" role="group" aria-label={t('Periodo del informe', 'Report period')}>{[7, 30, 90].map(n => <button key={n} aria-pressed={days === n} onClick={() => setDays(n)}>{n} {t('días', 'days')}</button>)}</div><button className="traffic-refresh compact-action" aria-label={t('Actualizar', 'Refresh')} title={t('Actualizar', 'Refresh')} disabled={state.loading} onClick={() => setRevision(n => n + 1)}><RefreshCw size={17} aria-hidden="true"/></button></div><div className="analytics-config-actions" role="group" aria-label={t('Configuración y herramientas','Settings and tools')}><button className="compact-action" aria-controls="dashboard-personalization" aria-expanded={panelEditing} aria-label={panelEditing ? t('Terminar edición','Finish editing') : t('Personalizar panel','Customize panel')} title={panelEditing ? t('Terminar edición','Finish editing') : t('Personalizar panel','Customize panel')} onClick={()=>setPanelEditing(value=>!value)}>{panelEditing?<Check size={17} aria-hidden="true"/>:<Settings2 size={17} aria-hidden="true"/>}</button><a className="compact-action" href="https://analytics.google.com/" target="_blank" rel="noreferrer" aria-label="Google Analytics" title="Google Analytics"><BarChart3 size={17} aria-hidden="true"/></a></div></div>
      {state.error && <section className="traffic-connection" role="status"><Activity size={26} /><div><h2>{t('Conexión de informes pendiente', 'Reports connection pending')}</h2><p>{t('No pudimos consultar Google Analytics. La conexión de lectura debe estar configurada y disponible para mostrar cifras reales.', 'We could not query Google Analytics. The read connection must be configured and available to show real figures.')}</p>{diagnostics[state.error] && <p role="alert">{diagnostics[state.error]}</p>}<a href="https://analytics.google.com/" target="_blank" rel="noreferrer">{t('Consultar en Google Analytics', 'View in Google Analytics')} <ArrowUpRight size={16} /></a></div></section>}
      {state.loading && <PortalLoading overlay/>}
      <EditableBoard editing={panelEditing} storageKey={'ortegon-analytics-layout-v1:'+user.id} en={en} widgets={[
        ...metrics.map(([Icon,label,value,note],index)=>{const key=['activeUsers','sessions','screenPageViews','leads'][index];return {id:key,title:label,className:'traffic-metrics',content:<button className="analytics-metric-button" aria-pressed={focus===key} aria-controls="analytics-focus-chart" onClick={()=>setRequestedFocus(key)}><Icon size={20}/><span>{label}</span><strong>{format(value)}</strong></button>};}),
        {id:'map',title:t('Mapa mundial','World map'),className:'wide',content:<section className="analytics-persistent-map traffic-card"><div className="traffic-card-heading"><h2>{t('Audiencia mundial', 'Worldwide audience')}</h2><Globe2 size={18}/></div><WorldAudience rows={data?.countries} status={data?.geographyStatus} en={en} onCountrySelect={country => { setSelectedCountry(country); setRequestedFocus('regions'); }}/></section>},
        {id:'detail',title:t('Gráfico ampliado','Expanded chart'),className:'wide',content:(focus !== 'countries' || requestedFocus !== 'countries') && <section className={`analytics-focus-area traffic-card ${closingMetric || openingMetric ? "metric-transition-hidden" : "metric-transition-visible"}`} id="analytics-focus-chart" aria-label={t('Gráfico seleccionado', 'Selected chart')}>
        <div className="traffic-card-heading"><div><p className="traffic-eyebrow">{t('EXPLORA TUS RESULTADOS', 'EXPLORE YOUR RESULTS')}</p><h2 aria-live="polite">{expandedTitle}</h2></div><button className="analytics-close-metric" onClick={() => setRequestedFocus('countries')} aria-label={t('Cerrar métrica', 'Close metric')} title={t('Cerrar métrica', 'Close metric')}><X size={17} aria-hidden="true"/></button></div>
        <div className={`analytics-focus-content ${changingChart ? "is-leaving" : ""}`} key={focus}>
        {focus === 'regions' ? <CountryRegions country={selectedCountry} days={days} en={en}/> : !data && state.loading ? <Empty loading en={en}/> : !data ? <Empty en={en}/> : ['activeUsers','sessions','screenPageViews'].includes(focus) ? (data.daily.length ? <Trend rows={data.daily} metric={focus} label={expandedTitle} formatDate={dateLabel}/> : <Empty en={en}/>) : focus === 'countries' ? <WorldAudience rows={data.countries} status={data.geographyStatus} en={en}/> : focus === 'sources' || focus === 'devices' ? <Donut title={expandedTitle} subtitle={t('Sesiones del periodo seleccionado', 'Sessions in the selected period')} rows={focus === 'sources' ? data.sources : data.devices} en={en}/> : focus === 'pages' ? <Breakdown title={expandedTitle} subtitle={t('Página · vistas', 'Page · views')} rows={data.pages} en={en}/> : <div className="analytics-lead-detail"><MessageSquare size={28}/><strong>{format(data.leads)}</strong><p>{t('Eventos generate_lead registrados por Google en este periodo.', 'Google generate_lead events recorded in this period.')}</p><small>{t('Este informe devuelve un total. No incluye una serie diaria de consultas.', 'This report returns a total and does not include a daily enquiries series.')}</small></div>}
        </div>
      </section>},
        ...[['sources',Globe2,t('Orígenes','Sources'),data?.sources?.[0]?.label],['devices',MousePointer2,t('Dispositivos','Devices'),data?.devices?.[0]?.label],['pages',Eye,t('Páginas','Pages'),data?.pages?.[0]?.label]].map(([key,Icon,label,leading])=>({id:key,title:label,content:<button className="analytics-report-tile" aria-pressed={focus===key} aria-controls="analytics-focus-chart" onClick={()=>setRequestedFocus(key)}><Icon size={20}/><div><strong>{label}</strong><span>{leading||t('Sin datos disponibles','No data available')}</span></div><ArrowUpRight size={16}/></button>})),
        {id:'realtime',title:t('Tiempo real','Realtime'),content:<section className="analytics-live-tile"><Radio size={18}/><span>{t('Activos · últimos 30 min', 'Active · last 30 min')}</span><strong>{format(data?.realtime?.activeUsers)}</strong><small>{t('Actualiza para consultar de nuevo.', 'Refresh to query again.')}</small></section>},
        {id:'management',title:t('Gestión del negocio','Business management'),className:'full',content:<ManagementCards/>}
      ]}/>
      <footer className="traffic-footnote"><ShieldCheck size={16} /><p>{t('Datos agregados de visitantes que aceptaron analítica. No incluye contenido de mensajes ni información personal de los formularios. Los informes históricos pueden tardar 24–48 horas.', 'Aggregate data from visitors who accepted analytics. No message contents or personal form information. Historical reports may take 24–48 hours.')}{data?.updatedAt && ` · ${t('Consulta', 'Fetched')}: ${new Intl.DateTimeFormat(en ? 'en-US' : 'es-CO', { timeStyle: 'short', timeZone: 'America/Bogota' }).format(new Date(data.updatedAt))} (Bogotá)`}</p></footer>
    </main>
  </div>;
}

const chartColors = ['#36816a', '#5888c6', '#ad83bf', '#d99a4b', '#64aeb8', '#cf8090', '#8d9e62', '#7f91a6', '#a1bbac', '#baab99'];
function Donut({ title, subtitle, rows, loading, en }) {
  const [hovered, setHovered] = useState(null);
  const total = (rows || []).reduce((sum, row) => sum + row.value, 0);
  let offset = 0;
  const segments = (rows || []).map((row, i) => {
    const percent = total > 0 ? row.value / total * 100 : 0;
    const segment = { ...row, percent, offset, color: chartColors[i % chartColors.length] };
    offset += percent;
    return segment;
  });
  const format = value => new Intl.NumberFormat(en ? 'en-US' : 'es-CO').format(value);
  return <section className="traffic-card analytics-donut-card"><h2>{title}</h2><p className="traffic-subtitle">{subtitle}</p>{total > 0 ? <div className="analytics-donut-layout"><div className={`analytics-donut ${hovered !== null ? "is-inspecting" : ""}`}><svg viewBox="0 0 120 120" role="img" aria-label={title}><title>{title}</title><circle cx="60" cy="60" r="45" fill="none" stroke="#edf1ed" strokeWidth="13"/>{segments.map((row, i) => <circle key={row.label + i} className={`analytics-donut-segment ${hovered === i ? "is-active" : ""}`} tabIndex={0} aria-label={`${row.label}: ${format(row.value)}, ${row.percent.toFixed(1)}%`} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} onFocus={() => setHovered(i)} onBlur={() => setHovered(null)} onClick={() => setHovered(hovered === i ? null : i)} cx="60" cy="60" r="45" fill="none" stroke={row.color} strokeWidth="13" pathLength="100" strokeDasharray={row.percent + ' ' + (100 - row.percent)} strokeDashoffset={-row.offset} transform="rotate(-90 60 60)"><title>{row.label}: {format(row.value)} ({row.percent.toFixed(1)}%)</title></circle>)}</svg><div><strong>{format(hovered !== null ? segments[hovered]?.value || 0 : total)}</strong><span>{hovered !== null ? segments[hovered]?.label : (en ? 'sessions shown' : 'sesiones mostradas')}</span></div></div><ul className="analytics-donut-legend">{segments.map((row, i) => <li key={row.label + i} className={hovered === i ? "is-active" : ""} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}><i style={{background:row.color}}/><span title={row.label}>{row.label}</span><strong>{row.percent.toFixed(1)}%</strong><small>{format(row.value)}</small></li>)}</ul></div> : <Empty loading={loading} en={en}/>}</section>;
}

function Sources({ rows, loading, en }) {
  if (!rows?.length) return <Empty loading={loading} en={en}/>;
  const total = rows.reduce((sum, row) => sum + row.value, 0);
  return <ol className="traffic-sources">{rows.map((row, index) => {
    const origin = row.label.split(' / ')[0];
    const lower = origin.toLowerCase();
    const [Icon, name] = lower.includes('linkedin') ? [Linkedin, 'LinkedIn'] : lower.includes('google') ? [Search, 'Google'] : lower.includes('instagram') ? [Share2, 'Instagram'] : lower.includes('facebook') || lower === 'fb' ? [Share2, 'Facebook'] : lower.includes('whatsapp') ? [MessageSquare, 'WhatsApp'] : lower === '(direct)' ? [ExternalLink, en ? 'Direct visits' : 'Visitas directas'] : lower.includes('email') ? [Mail, en ? 'Email' : 'Correo'] : [Globe2, origin];
    const percent = total ? row.value / total * 100 : 0;
    return <li key={row.label + index}><span className="traffic-source-rank">{String(index + 1).padStart(2, '0')}</span><span className="traffic-source-icon"><Icon size={20}/></span><div className="traffic-source-name"><strong>{name}</strong><span title={row.label}>{row.label}</span></div><div className="traffic-source-bar"><progress value={row.value} max={Math.max(total, 1)} aria-label={row.label}/></div><div className="traffic-source-value"><strong>{new Intl.NumberFormat(en ? 'en-US' : 'es-CO').format(row.value)}</strong><span>{percent.toFixed(1)}%</span></div></li>;
  })}</ol>;
}

function Empty({ loading, en }) { return <div className="traffic-empty"><BarChart3 size={30} /><p>{loading ? (en ? 'Loading…' : 'Cargando…') : (en ? 'No data available yet' : 'Todavía no hay visitas registradas en este periodo')}</p></div>; }
function Breakdown({ title, subtitle, rows, loading, en }) {
  const total = (rows || []).reduce((sum, row) => sum + row.value, 0);
  return <section className="traffic-card"><h2>{title}</h2><p className="traffic-subtitle">{subtitle}</p>{rows?.length ? <ul className="traffic-ranking">{rows.map((row, i) => <li key={row.label + i}><div><span title={row.label}>{row.label}</span><strong>{new Intl.NumberFormat(en ? 'en-US' : 'es-CO').format(row.value)}</strong></div><progress value={row.value} max={Math.max(total, 1)} aria-label={row.label} /></li>)}</ul> : <Empty loading={loading} en={en} />}</section>;
}
function Trend({ rows, label, formatDate, metric = 'sessions' }) {
  const [hovered, setHovered] = useState(null);
  const max = Math.max(1, ...rows.map(row => row[metric]));
  const coords = rows.map((row, i) => ({ x: 40 + i * 620 / Math.max(1, rows.length - 1), y: 190 - row[metric] / max * 155 }));
  const points = coords.map(point => point.x + ',' + point.y).join(' ');
  const active = hovered === null ? null : coords[hovered];
  const selected = hovered === null ? null : rows[hovered];
  const tooltipX = active ? Math.min(568, Math.max(40, active.x - 66)) : 40;
  return <><svg className="traffic-chart analytics-interactive-trend" viewBox="0 0 700 225" role="group" aria-label={label} onMouseLeave={() => setHovered(null)}><title>{label}</title>{[0, .5, 1].map(r => <g key={r}><line x1="40" x2="660" y1={190-r*155} y2={190-r*155} stroke="#e6ede9"/><text x="30" y={194-r*155} textAnchor="end" fill="#708279" fontSize="11">{Math.round(max*r)}</text></g>)}<polygon className="analytics-trend-fill" points={`40,190 ${points} 660,190`} fill="#e8f3ec"/><polyline className="analytics-trend-line" points={points} fill="none" stroke="#367958" strokeWidth="3" strokeLinejoin="round"/>
  {coords.map((point, i) => <g key={rows[i].date} className={hovered === i ? "analytics-trend-point is-active" : "analytics-trend-point"}><rect x={Math.max(40,point.x - 310/Math.max(1,rows.length - 1))} y="25" width={Math.max(7,620/Math.max(1,rows.length - 1))} height="170" fill="transparent" tabIndex={0} role="button" aria-label={formatDate(rows[i].date) + ': ' + rows[i][metric]} onMouseEnter={() => setHovered(i)} onFocus={() => setHovered(i)} onBlur={() => setHovered(null)} onClick={() => setHovered(i)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setHovered(i); } if (event.key === 'Escape') setHovered(null); }}/><circle cx={point.x} cy={point.y} r={rows.length === 1 ? 4 : 3} fill="#367958" pointerEvents="none"/></g>)}
  {active && selected && <g className="analytics-trend-tooltip" pointerEvents="none"><line x1={active.x} x2={active.x} y1="25" y2="190" stroke="#79a98a" strokeDasharray="4 4"/><circle className="analytics-point-halo" cx={active.x} cy={active.y} r="10" fill="#367958" opacity=".15"/><circle cx={active.x} cy={active.y} r="5" fill="#367958" stroke="white" strokeWidth="2"/><rect x={tooltipX} y="5" width="132" height="44" rx="7" fill="#fff" stroke="#ccdfd2"/><text x={tooltipX+12} y="21" fontSize="10" fill="#718879">{formatDate(selected.date)}</text><text x={tooltipX+12} y="39" fontSize="13" fontWeight="700" fill="#2d6242">{selected[metric]}</text></g>}
  <text x="40" y="216" fill="#708279" fontSize="11">{formatDate(rows[0].date)}</text><text x="660" y="216" textAnchor="end" fill="#708279" fontSize="11">{formatDate(rows.at(-1).date)}</text></svg><details className="traffic-chart-data"><summary>{label}</summary><div><table><thead><tr><th>{label}</th><th>#</th></tr></thead><tbody>{rows.map(row => <tr key={row.date}><td>{formatDate(row.date)}</td><td>{row[metric]}</td></tr>)}</tbody></table></div></details></>;
}
