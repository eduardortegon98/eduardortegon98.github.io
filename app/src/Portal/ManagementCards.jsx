import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, FileText, Star, MessagesSquare, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../i18n/Language';
import Portal from './Portal';
import { demoConversations } from '../Inbox/demoData';
import './ManagementCards.css';
const sources = ['contact_requests', 'quote_requests', 'customer_feedback'];
export default function ManagementCards() {
  const { language } = useLanguage(), en = language === 'en';
  const [counts, setCounts] = useState([null,null,null]);
  const [open, setOpen] = useState(false);
  const [revision, setRevision] = useState(0);
  const dialog = useRef(null), trigger = useRef(null);
  useEffect(() => {
    let active = true;
    Promise.all(sources.map(table => supabase.from(table).select('id', {count:'exact',head:true}))).then(results => {
      if(active) setCounts(results.map(result => result.error ? null : result.count));
    }).catch(() => {});
    return () => { active = false; };
  }, [revision]);
  useEffect(() => {
    if (open && dialog.current && !dialog.current.open) dialog.current.showModal();
  }, [open]);
  function closed() { setOpen(false); setRevision(value => value + 1); trigger.current?.focus(); }
  const format = value => value == null ? '—' : new Intl.NumberFormat(en ? 'en-US' : 'es-CO').format(value);
  return <section className="management-hub" aria-label={en ? 'Business management' : 'Gestión del negocio'}>
    <Link to="/panel?source=contact" className="management-card"><MessageSquare size={20}/><span>{en ? 'Contacts' : 'Contactos'}</span><strong>{format(counts[0])}</strong></Link>
    <Link to="/panel?source=quotes" className="management-card"><FileText size={20}/><span>{en ? 'Quotes' : 'Cotizaciones'}</span><strong>{format(counts[1])}</strong></Link>
    <button ref={trigger} className="management-card" aria-haspopup="dialog" onClick={() => setOpen(true)}><Star size={20}/><span>{en ? 'Testimonials' : 'Testimonios'}</span><strong>{format(counts[2])}</strong></button>
    <Link to="/panel/mensajes" className="management-card" aria-label={en ? "Communications · Demo conversations" : "Comunicaciones · Conversaciones demo"} title={en ? "Mock data · Offline" : "Datos mockeados · Sin conexión"}><MessagesSquare size={20}/><span>{en ? 'Communications' : 'Comunicaciones'}</span><strong title={en ? "Demo conversations · Mock data" : "Conversaciones demo · Datos mockeados"}>{format(demoConversations.length)}</strong></Link>
    <dialog ref={dialog} className="testimonial-dialog" aria-labelledby="testimonial-dialog-title" onClose={closed} onClick={event => { if(event.target === dialog.current) { const bounds = dialog.current.getBoundingClientRect(); if(event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.current.close(); } }}>
      <header><div><h2 id="testimonial-dialog-title">{en ? 'Review testimonials' : 'Revisar testimonios'}</h2><p>{en ? 'Open a record to approve or reject it. Real data from Supabase.' : 'Abre un registro para aprobarlo o rechazarlo. Datos reales de Supabase.'}</p></div><button autoFocus className="testimonial-dialog-close" aria-label={en ? 'Close testimonials' : 'Cerrar testimonios'} onClick={() => dialog.current.close()}><X size={18}/></button></header>
      {open && <Portal initialSource={2} testimonialsOnly/>}
    </dialog>
  </section>;
}
