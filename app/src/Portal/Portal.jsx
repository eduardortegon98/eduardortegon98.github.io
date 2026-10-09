import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, MessageSquare, FileText, Star, LogOut, ArrowRight, RefreshCw, Search } from 'lucide-react';
import Access from './Access';
import { supabase } from '../lib/supabase';
import { Localized as L, LanguageSwitch, useLanguage } from '../i18n/Language';
import './Portal.css';
import { BarChart3 } from 'lucide-react';
const sources = [
  { table: 'contact_requests', label: 'Contacto', icon: MessageSquare, columns: 'id,created_at,name,email,subject,message' },
  { table: 'quote_requests', label: 'Cotizaciones', icon: FileText, columns: 'id,created_at,name,email,phone,service,budget,message' },
  { table: 'customer_feedback', label: 'Testimonios', icon: Star, columns: 'id,created_at,name,email,message,rating,approved' },
];
export default function Portal() { return <Access>{state => <Dashboard key={state.user.id + state.role} {...state} />}</Access>; }
function Dashboard({ user, role }) {
  const admin = role === 'super_admin';
  const { language } = useLanguage();
  const [source, setSource] = useState(0), [search, setSearch] = useState(''), [page, setPage] = useState(0);
  const [rows, setRows] = useState([]), [counts, setCounts] = useState(null), [total, setTotal] = useState(0), [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true), [error, setError] = useState(''), [revision, setRevision] = useState(0), [logoutPending, setLogoutPending] = useState(false);
  const detailHeading = useRef(null);
  useEffect(() => { if (selected) { detailHeading.current?.focus(); detailHeading.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }); } }, [selected]);
  const config = sources[source];
  useEffect(() => {
    if (!admin) return;
    let active = true;
    setCounts(null);
    Promise.all(sources.map(s => supabase.from(s.table).select('id', { count: 'exact', head: true }))).then(results => {
      if (active && results.every(r => !r.error)) setCounts(results.map(r => r.count));
    }).catch(() => {});
    return () => { active = false; };
  }, [admin, revision]);
  useEffect(() => {
    if (!admin) return;
    let active = true;
    setLoading(true); setError(''); setRows([]); setSelected(null);
    const timeout = setTimeout(async () => {
      try {
        let request = supabase.from(config.table).select(config.columns, { count: 'exact' }).order('created_at', { ascending: false }).order('id').range(page * 25, page * 25 + 24);
        if (search.trim()) request = request.ilike('name', `%${search.trim().replace(/[\\%_]/g, '\\$&')}%`);
        const result = await request;
        if (result.error) throw result.error;
        if (active) { setRows(result.data); setTotal(result.count); }
      } catch { if (active) { setError('No pudimos cargar los registros. Revisa la conexión y la instalación del portal en Supabase.'); setTotal(0); } }
      finally { if (active) setLoading(false); }
    }, search ? 250 : 0);
    return () => { active = false; clearTimeout(timeout); };
  }, [admin, config, search, page, revision]);
  async function logout() {
    setLogoutPending(true);
    try { const { error: failure } = await supabase.auth.signOut(); if (failure) throw failure; }
    catch { setError('No pudimos cerrar sesión. Inténtalo nuevamente.'); }
    finally { setLogoutPending(false); }
  }
  function switchSource(index) { setSource(index); setPage(0); setSearch(''); setSelected(null); }
  const date = value => new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'es-CO', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
  return <div className="portal-app">
    <aside className="portal-nav"><Link to="/" className="portal-brand">O. <span>Ortegón</span></Link><L as="p" className="portal-eyebrow">ESPACIO DE TRABAJO</L><L as="div" className="portal-nav-current"><LayoutDashboard size={18} />{admin ? 'Dashboard' : 'Portal de cliente'}</L>{admin && <L as={Link} to="/panel/mensajes" className="portal-nav-link"><MessageSquare size={18} />Bandeja demo</L>}<div className="portal-account"><span>{user.email}</span><L as="small">{admin ? 'Súper admin' : 'Cliente'}</L><L as="button" disabled={logoutPending} onClick={logout}><LogOut size={16} />{logoutPending ? 'Saliendo…' : 'Cerrar sesión'}</L></div></aside>
    <main className="portal-main"><header className="portal-header"><div><L as="p" className="portal-eyebrow">{admin ? 'CENTRO DE CLIENTES' : 'TU CUENTA'}</L><L as="h1">{admin ? 'Cada oportunidad, en orden.' : 'Bienvenido a tu portal.'}</L><L as="p">{admin ? 'Información real recibida desde los formularios de tu página.' : 'Tu cuenta de cliente está activa. Las funciones del portal se habilitarán en una próxima etapa.'}</L></div><LanguageSwitch /></header>
    {admin && <Link to="/panel/analitica" className="portal-nav-link"><BarChart3 size={18} />{language === 'en' ? 'Website analytics' : 'Analítica de la web'}<ArrowRight size={16} /></Link>}
    {!admin ? <section className="portal-welcome"><Users size={36} /><L as="h2">Portal de cliente</L><L as="p">Este espacio no tiene acceso a los leads ni a los datos de otros clientes.</L><L as={Link} to="/cotizar">Solicitar cotización <ArrowRight size={16} /></L><L as={Link} to="/contacto">Contactar</L>{error && <L as="p" role="alert">{error}</L>}</section> : <>
      <section className="portal-metrics" aria-label={language === 'en' ? 'Total records by source' : 'Total de registros por origen'}>{sources.map((s, i) => { const Icon = s.icon; return <button key={s.table} onClick={() => switchSource(i)} aria-pressed={source === i}><Icon size={22} /><L>{s.label}</L><strong>{counts ? counts[i] : '—'}</strong><L as="small">Registros recibidos</L></button>; })}</section>
      <section className="portal-records"><div className="portal-toolbar"><div className="portal-tabs" role="group" aria-label={language === 'en' ? 'Record source' : 'Origen de los registros'}>{sources.map((s, i) => <L as="button" key={s.table} aria-pressed={source === i} className={source === i ? 'active' : ''} onClick={() => switchSource(i)}>{s.label}</L>)}</div><L as="button" className="portal-refresh" onClick={() => setRevision(n => n + 1)} disabled={loading}><RefreshCw size={16} />Actualizar</L></div>
      <div className="portal-search"><Search size={18} /><L as="input" aria-label="Buscar por nombre" placeholder="Buscar por nombre" maxLength={120} value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} /><span>{loading ? '…' : total} <L>resultados</L></span></div>
      {error ? <L as="p" className="portal-empty" role="alert">{error}</L> : loading ? <L as="p" className="portal-empty" role="status">Cargando registros…</L> : !rows.length ? <L as="p" className="portal-empty">No hay registros para esta búsqueda.</L> : <div className="portal-table-wrap"><table><thead><tr>{['Cliente', 'Solicitud', 'Fecha', 'Detalle'].map(t => <L as="th" key={t} scope="col">{t}</L>)}</tr></thead><tbody>{rows.map(row => <tr key={row.id}><td><strong>{row.name}</strong><small>{row.email || '—'}</small></td><td>{row.subject || row.service || <L>{row.approved ? 'Publicado' : 'Pendiente de aprobación'}</L>}{row.rating && <small>{row.rating}/5 ★</small>}</td><td>{date(row.created_at)}</td><td><L as="button" onClick={() => setSelected(row)}>Ver detalle</L></td></tr>)}</tbody></table></div>}
      <div className="portal-pagination"><L as="button" disabled={loading || page === 0} onClick={() => setPage(n => n - 1)}>Anterior</L><span>{page + 1} / {Math.max(1, Math.ceil(total / 25))}</span><L as="button" disabled={loading || (page + 1) * 25 >= total} onClick={() => setPage(n => n + 1)}>Siguiente</L></div></section>
      <L as="p" className="portal-footnote">Los mensajes de WhatsApp, Instagram y Facebook todavía están en modo demo y no se incluyen en estos totales.</L>
      {selected && <section className="portal-detail" aria-labelledby="lead-detail-title"><div><h2 ref={detailHeading} tabIndex={-1} id="lead-detail-title">{selected.name}</h2><L as="button" onClick={() => setSelected(null)}>Cerrar detalle</L></div><dl><L as="dt">Correo electrónico</L><dd>{selected.email || '—'}</dd><L as="dt">Fecha</L><dd>{date(selected.created_at)}</dd>{[['phone', 'Teléfono'], ['subject', 'Asunto'], ['service', 'Servicio'], ['budget', 'Presupuesto'], ['rating', 'Calificación']].filter(([key]) => selected[key]).map(([key, label]) => <div key={key}><L as="dt">{label}</L><dd>{selected[key]}</dd></div>)}</dl><L as="h3">Mensaje</L><p className="portal-message">{selected.message}</p></section>}
    </>}</main></div>;
}

