import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, FileText, Star, MessagesSquare, ArrowUpRight, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../i18n/Language';
import Portal from './Portal';
import './ManagementCards.css';
const sources = ['contact_requests', 'quote_requests', 'customer_feedback'];
export default function ManagementCards() {
  const { language } = useLanguage(), en = language === 'en';
  const [counts, setCounts] = useState([null,null,null]);
  const [pending, setPending] = useState(null);
  const [open, setOpen] = useState(false);
  const [revision, setRevision] = useState(0);
  const dialog = useRef(null), trigger = useRef(null);
  useEffect(() => {
    let active = true;
    Promise.all(sources.map(table => supabase.from(table).select('id', {count:'exact',head:true}))).then(results => {
      if(active) setCounts(results.map(result => result.error ? null : result.count));
    }).catch(() => {});
    (async () => {
      let result = await supabase.from('customer_feedback').select('id', {count:'exact',head:true}).eq('moderation_status','pending');
      if(['42703','PGRST204'].includes(result.error?.code)) result = await supabase.from('customer_feedback').select('id', {count:'exact',head:true}).eq('approved',false);
      if(active) setPending(result.error ? null : result.count);
    })().catch(() => {});
    return () => { active = false; };
  }, [revision]);
  useEffect(() => {
    if (open && dialog.current && !dialog.current.open) dialog.current.showModal();
  }, [open]);
  function closed() { setOpen(false); setRevision(value => value + 1); trigger.current?.focus(); }
  const format = value => value == null ? '—' : new Intl.NumberFormat(en ? 'en-US' : 'es-CO').format(value);
  return <section className="management-hub" aria-label={en ? 'Business management' : 'Gestión del negocio'}>
    <Link to="/panel?source=contact" className="management-card"><MessageSquare size={20}/><span>{en ? 'Contacts' : 'Contactos'}</span><strong>{format(counts[0])}</strong><small>{en ? 'Real website requests' : 'Solicitudes reales de la web'}</small><ArrowUpRight size={16}/></Link>
    <Link to="/panel?source=quotes" className="management-card"><FileText size={20}/><span>{en ? 'Quotes' : 'Cotizaciones'}</span><strong>{format(counts[1])}</strong><small>{en ? 'Real quote requests' : 'Cotizaciones reales recibidas'}</small><ArrowUpRight size={16}/></Link>
    <button ref={trigger} className="management-card" aria-haspopup="dialog" onClick={() => setOpen(true)}><Star size={20}/><span>{en ? 'Testimonials' : 'Testimonios'}</span><strong>{format(counts[2])}</strong><small>{format(pending)} {en ? 'pending review' : 'pendientes de revisión'}</small><ArrowUpRight size={16}/></button>
    <Link to="/panel/mensajes" className="management-card"><MessagesSquare size={20}/><span>{en ? 'Communications' : 'Comunicaciones'}</span><strong className="management-demo">Demo</strong><small>{en ? 'Mock data · Offline' : 'Datos mockeados · Sin conexión'}</small><ArrowUpRight size={16}/></Link>
    <dialog ref={dialog} className="testimonial-dialog" aria-labelledby="testimonial-dialog-title" onClose={closed} onClick={event => { if(event.target === dialog.current) { const bounds = dialog.current.getBoundingClientRect(); if(event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.current.close(); } }}>
      <header><div><h2 id="testimonial-dialog-title">{en ? 'Review testimonials' : 'Revisar testimonios'}</h2><p>{en ? 'Open a record to approve or reject it. Real data from Supabase.' : 'Abre un registro para aprobarlo o rechazarlo. Datos reales de Supabase.'}</p></div><button autoFocus className="testimonial-dialog-close" aria-label={en ? 'Close testimonials' : 'Cerrar testimonios'} onClick={() => dialog.current.close()}><X size={18}/></button></header>
      {open && <Portal initialSource={2} testimonialsOnly/>}
    </dialog>
  </section>;
}
