import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MessageSquare, FileText, Star, MessagesSquare, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../i18n/Language';
import Portal from './Portal';
import { loadRegisteredOutreach } from '../Inbox/registeredOutreach';
import './ManagementCards.css';
const sources = ['contact_requests', 'quote_requests', 'customer_feedback'];
export default function ManagementCards() {
  const { language } = useLanguage(), en = language === 'en';
  const [registeredCount,setRegisteredCount]=useState(null);
  const [counts, setCounts] = useState([null,null,null]);
  const [params, setParams] = useSearchParams();
  const [activeSource, setActiveSource] = useState(() => ({ contact: 0, quotes: 1, testimonials: 2 }[params.get('source')] ?? null));
  const open = activeSource !== null;
  const modalTitle = [en ? 'Contacts' : 'Contactos', en ? 'Quotes' : 'Cotizaciones', en ? 'Testimonials' : 'Testimonios'][activeSource] || '';
  const [revision, setRevision] = useState(0);
  const dialog = useRef(null), trigger = useRef(null);
  useEffect(() => {
    let active = true;
    loadRegisteredOutreach(supabase).then(rows=>{if(active)setRegisteredCount(rows.length);}).catch(()=>{if(active)setRegisteredCount(null);});
    Promise.all(sources.map(table => supabase.from(table).select('id', {count:'exact',head:true}))).then(results => {
      if(active) setCounts(results.map(result => result.error ? null : result.count));
    }).catch(() => {});
    return () => { active = false; };
  }, [revision]);
  useEffect(() => {
    if (open && dialog.current && !dialog.current.open) dialog.current.showModal();
  }, [open]);
  function show(source, event) { trigger.current = event.currentTarget; setActiveSource(source); }
  function closed() { setActiveSource(null); setRevision(value => value + 1); if(params.has('source')) {const next = new URLSearchParams(params); next.delete('source'); setParams(next, {replace:true});} trigger.current?.focus(); }
  const format = value => value == null ? '—' : new Intl.NumberFormat(en ? 'en-US' : 'es-CO').format(value);
  return <section className="management-hub" aria-label={en ? 'Business management' : 'Gestión del negocio'}>
    <button className="management-card" aria-haspopup="dialog" onClick={event => show(0, event)}><MessageSquare size={20}/><span>{en ? 'Contacts' : 'Contactos'}</span><strong>{format(counts[0])}</strong></button>
    <button className="management-card" aria-haspopup="dialog" onClick={event => show(1, event)}><FileText size={20}/><span>{en ? 'Quotes' : 'Cotizaciones'}</span><strong>{format(counts[1])}</strong></button>
    <button className="management-card" aria-haspopup="dialog" onClick={event => show(2, event)}><Star size={20}/><span>{en ? 'Testimonials' : 'Testimonios'}</span><strong>{format(counts[2])}</strong></button>
    <Link to="/panel/mensajes" className="management-card" aria-label={en ? "Communications · Registered contacts" : "Comunicaciones · Contactos registrados"} title={en ? "Real CRM records · Meta not connected" : "Registros reales del CRM · Meta sin conectar"}><MessagesSquare size={20}/><span>{en ? 'Communications' : 'Comunicaciones'}</span><strong title={en ? "Registered initial social contacts" : "Primeros contactos registrados en redes"}>{format(registeredCount)}</strong></Link>
    <dialog ref={dialog} className="testimonial-dialog" aria-labelledby="testimonial-dialog-title" onClose={closed} onClick={event => { if(event.target === dialog.current) { const bounds = dialog.current.getBoundingClientRect(); if(event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.current.close(); } }}>
      <header><div><h2 id="testimonial-dialog-title">{modalTitle}</h2><p>{activeSource === 2 ? (en ? 'Review and approve or reject real testimonials.' : 'Revisa y aprueba o rechaza testimonios reales.') : (en ? 'Filter requests and open their details. Real data from Supabase.' : 'Filtra solicitudes y consulta sus detalles. Datos reales de Supabase.')}</p></div><button autoFocus className="testimonial-dialog-close" aria-label={en ? 'Close records' : 'Cerrar registros'} onClick={() => dialog.current.close()}><X size={18}/></button></header>
      {open && <Portal key={activeSource} initialSource={activeSource} recordsOnly/>}
    </dialog>
  </section>;
}
