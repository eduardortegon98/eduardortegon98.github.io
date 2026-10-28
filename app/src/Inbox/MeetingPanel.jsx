import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, RefreshCw, Plus, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './MeetingPanel.css';

const statuses={proposed:'Propuesta',pending_confirmation:'Esperando confirmación',confirmed:'Confirmada',completed:'Realizada',cancelled:'Cancelada'};
const fmt=value=>value?new Intl.DateTimeFormat('es-CO',{dateStyle:'medium',timeStyle:'short',timeZone:'America/Bogota'}).format(new Date(value)):'Por definir';

export default function MeetingPanel(){
 const [meetings,setMeetings]=useState([]),[prospects,setProspects]=useState([]),[busy,setBusy]=useState(false),[error,setError]=useState(''),[search,setSearch]=useState(''),[status,setStatus]=useState('all'),[adding,setAdding]=useState(false);
 const [draft,setDraft]=useState({prospect_id:'',subject:'Reunión comercial',proposed_start:'',notes:''});
 async function refresh(){
  if(!supabase){setError('Supabase no está configurado.');return;}
  setBusy(true);setError('');
  const [m,p]=await Promise.all([supabase.from('sales_meetings').select('*').order('proposed_start',{ascending:true,nullsFirst:false}).limit(250),supabase.from('sales_prospects').select('id,company,person,email,status').order('company').limit(500)]);
  if(m.error)setError('No se pudieron cargar las reuniones: '+m.error.message);else setMeetings(m.data||[]);
  if(!p.error)setProspects(p.data||[]);
  setBusy(false);
 }
 useEffect(()=>{refresh();},[]);
 const filtered=useMemo(()=>meetings.filter(m=>(status==='all'||m.status===status)&&[m.company,m.contact_name,m.contact_email,m.subject].join(' ').toLowerCase().includes(search.toLowerCase())),[meetings,search,status]);
 const totals=useMemo(()=>Object.fromEntries(Object.keys(statuses).map(s=>[s,meetings.filter(m=>m.status===s).length])),[meetings]);
 async function save(){
  const p=prospects.find(p=>p.id===draft.prospect_id);
  if(!p){setError('Selecciona un prospecto.');return;}
  setBusy(true);setError('');
  const start=draft.proposed_start?new Date(draft.proposed_start).toISOString():null;
  const {error:e}=await supabase.from('sales_meetings').insert({prospect_id:p.id,company:p.company,contact_name:p.person,contact_email:p.email,subject:draft.subject.trim()||'Reunión comercial',proposed_start:start,proposed_end:start?new Date(new Date(start).getTime()+30*60000).toISOString():null,notes:draft.notes,status:'proposed'});
  if(e)setError('No se pudo guardar: '+e.message);else{setAdding(false);setDraft({prospect_id:'',subject:'Reunión comercial',proposed_start:'',notes:''});await refresh();}
  setBusy(false);
 }
 async function changeStatus(m,newStatus){
  if(newStatus==='confirmed'&&!m.google_event_id){setError('Para confirmar, crea primero la invitación en Google Calendar y registra el evento. No se han enviado invitaciones automáticamente.');return;}
  setBusy(true);const {error:e}=await supabase.from('sales_meetings').update({status:newStatus,updated_at:new Date().toISOString()}).eq('id',m.id);
  if(e)setError(e.message);else await refresh();
  setBusy(false);
 }
 return <section className="oc-meetings">
  <div className="oc-meetings-head"><div><h2><CalendarDays size={22}/> Agenda comercial</h2><p>Organiza propuestas de reunión derivadas de respuestas a nuestros correos. Las invitaciones de Calendar requieren confirmación.</p></div><div className="oc-meetings-actions"><button onClick={refresh} disabled={busy}><RefreshCw size={16}/> Actualizar</button><button className="primary" onClick={()=>setAdding(x=>!x)}><Plus size={16}/> Nueva cita</button></div></div>
  <div className="oc-meeting-stats">{[['Todas',meetings.length],['Por confirmar',totals.proposed+totals.pending_confirmation],['Confirmadas',totals.confirmed],['Realizadas',totals.completed]].map(([name,value])=><div key={name}><strong>{value}</strong><span>{name}</span></div>)}</div>
  {error&&<p role="alert" className="oc-meeting-error">{error}</p>}
  {adding&&<div className="oc-meeting-editor"><h3>Crear propuesta de reunión</h3><label>Prospecto<select value={draft.prospect_id} onChange={e=>setDraft(d=>({...d,prospect_id:e.target.value}))}><option value="">Seleccionar…</option>{prospects.map(p=><option key={p.id} value={p.id}>{p.company}{p.person?' · '+p.person:''}</option>)}</select></label><label>Asunto<input value={draft.subject} onChange={e=>setDraft(d=>({...d,subject:e.target.value}))}/></label><label>Fecha sugerida (hora local)<input type="datetime-local" value={draft.proposed_start} onChange={e=>setDraft(d=>({...d,proposed_start:e.target.value}))}/></label><label>Notas<textarea value={draft.notes} onChange={e=>setDraft(d=>({...d,notes:e.target.value}))}/></label><button className="primary" onClick={save} disabled={busy}>Guardar propuesta</button></div>}
  <div className="oc-meeting-filters"><input type="search" placeholder="Buscar empresa, contacto o asunto" value={search} onChange={e=>setSearch(e.target.value)}/><select value={status} onChange={e=>setStatus(e.target.value)}><option value="all">Todos los estados</option>{Object.entries(statuses).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></div>
  <div className="oc-meeting-list">{!filtered.length?<p className="oc-meeting-empty">No hay reuniones en este filtro. Registra una propuesta cuando un cliente muestre interés por correo.</p>:filtered.map(m=><article key={m.id} className="oc-meeting-card"><div><span className={'oc-meeting-pill '+m.status}>{statuses[m.status]||m.status}</span><h3>{m.company}</h3><strong>{m.subject}</strong><p>{m.contact_name||m.contact_email||'Contacto por definir'}</p><p><CalendarDays size={15}/> {fmt(m.proposed_start)}</p>{m.reply_summary&&<p>{m.reply_summary}</p>}{m.notes&&<small>{m.notes}</small>}</div><div className="oc-meeting-card-actions">{m.google_event_url&&<a href={m.google_event_url} target="_blank" rel="noopener noreferrer"><ExternalLink size={15}/> Calendar</a>}<select aria-label={'Estado de '+m.company} value={m.status} onChange={e=>changeStatus(m,e.target.value)} disabled={busy}>{Object.entries(statuses).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></div></article>)}</div>
 </section>;
}
