import {useEffect,useMemo,useState} from 'react';
import {CalendarDays,ChevronLeft,ChevronRight,Plus,Search,X,Clock3,ExternalLink,RefreshCw} from 'lucide-react';
import {supabase} from '../lib/supabase';
import './MeetingPanel.css';

const states={proposed:'Propuesta',pending_confirmation:'Por confirmar',confirmed:'Confirmada',completed:'Realizada',cancelled:'Cancelada'};
const localDate=d=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Bogota',year:'numeric',month:'2-digit',day:'2-digit'}).format(d);
const dayKey=v=>v?localDate(new Date(v)):'';
const fmt=v=>v?new Intl.DateTimeFormat('es-CO',{timeZone:'America/Bogota',dateStyle:'medium',timeStyle:'short'}).format(new Date(v)):'Sin fecha';
const time=v=>v?new Intl.DateTimeFormat('es-CO',{timeZone:'America/Bogota',hour:'2-digit',minute:'2-digit'}).format(new Date(v)):'—';
const monday=d=>{const x=new Date(d);x.setHours(12,0,0,0);x.setDate(x.getDate()-((x.getDay()+6)%7));return x;};
const shift=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const isoLocal=v=>v?new Date(v).toISOString():null;
export default function MeetingPanel(){
 const [items,setItems]=useState([]),[prospects,setProspects]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState('');
 const [week,setWeek]=useState(()=>monday(new Date())),[query,setQuery]=useState(''),[filter,setFilter]=useState('all'),[active,setActive]=useState(null),[mode,setMode]=useState('');
 const [draft,setDraft]=useState({prospect_id:'',subject:'Reunión comercial',proposed_start:'',notes:''});
 async function refresh(){
  if(!supabase){setError('Supabase no está configurado.');setLoading(false);return;}
  setLoading(true);setError('');
  const [a,b]=await Promise.all([supabase.from('sales_meetings').select('*').order('proposed_start',{ascending:true,nullsFirst:false}).limit(250),supabase.from('sales_prospects').select('id,company,person,email').order('company').limit(500)]);
  if(a.error)setError('No se pudieron cargar las reuniones: '+a.error.message);else setItems(a.data||[]);
  if(b.error)setError('No se pudieron cargar prospectos: '+b.error.message);else setProspects(b.data||[]);
  setLoading(false);
 }
 useEffect(()=>{refresh()},[]);
 const days=useMemo(()=>Array.from({length:7},(_,i)=>shift(week,i)),[week]);
 const range=days[0].toLocaleDateString('es-CO',{day:'numeric',month:'short'})+' — '+days[6].toLocaleDateString('es-CO',{day:'numeric',month:'short',year:'numeric'});
 const filtered=items.filter(m=>(filter==='all'||m.status===filter)&&[m.company,m.contact_name,m.subject,m.contact_email].join(' ').toLowerCase().includes(query.toLowerCase()));
 const undated=filtered.filter(m=>!m.proposed_start);
 const upcoming=items.filter(m=>m.proposed_start&&new Date(m.proposed_start)>=new Date()&&!['cancelled','completed'].includes(m.status)).sort((a,b)=>new Date(a.proposed_start)-new Date(b.proposed_start));
 const counts={pending:items.filter(m=>['proposed','pending_confirmation'].includes(m.status)).length,confirmed:items.filter(m=>m.status==='confirmed').length,completed:items.filter(m=>m.status==='completed').length};
 function openCreate(date){setDraft({prospect_id:'',subject:'Reunión comercial',proposed_start:date||'',notes:''});setMode('create');setActive(null);setError('')}
 function openDetail(m){setActive(m);setMode('detail');setError('')}
 async function save(){
  const p=prospects.find(x=>x.id===draft.prospect_id);
  if(!p){setError('Selecciona un prospecto para la reunión.');return}
  setLoading(true);setError('');
  const start=isoLocal(draft.proposed_start);
  const {error:e}=await supabase.from('sales_meetings').insert({prospect_id:p.id,company:p.company,contact_name:p.person,contact_email:p.email,subject:draft.subject.trim()||'Reunión comercial',proposed_start:start,proposed_end:start?new Date(new Date(start).getTime()+30*60000).toISOString():null,notes:draft.notes,status:'proposed'});
  if(e)setError(e.message);else{setMode('');await refresh()}
  setLoading(false);
 }
 async function updateState(value){
  if(!active)return;
  if(value==='confirmed'&&!active.google_event_id){setError('Primero registra una invitación real de Google Calendar. No se confirmó ni envió ninguna invitación.');return}
  setLoading(true);const {error:e}=await supabase.from('sales_meetings').update({status:value,updated_at:new Date().toISOString()}).eq('id',active.id);
  if(e)setError(e.message);else{setMode('');await refresh()}setLoading(false);
 }
 return <div className="oc-agenda">
  <header className="oc-agenda-hero"><div><span className="oc-eyebrow">ORTCONNECT · COMERCIAL</span><h2>Tu agenda<span className="oc-accent">.</span></h2><p>De una respuesta a una conversación que puede convertirse en negocio.</p></div><button className="oc-agenda-new" onClick={()=>openCreate('')}><Plus size={18}/> Nueva reunión</button></header>
  <div className="oc-agenda-summary"><div><span>Por confirmar</span><strong>{counts.pending}</strong><small>Oportunidades en conversación</small></div><div><span>Confirmadas</span><strong>{counts.confirmed}</strong><small>Reuniones acordadas</small></div><div><span>Realizadas</span><strong>{counts.completed}</strong><small>Conversaciones completadas</small></div></div>
  <div className="oc-agenda-layout"><main className="oc-agenda-main"><div className="oc-agenda-toolbar"><div><h3>Calendario semanal</h3><span>{range}</span></div><div className="oc-agenda-nav"><button aria-label="Semana anterior" onClick={()=>setWeek(d=>shift(d,-7))}><ChevronLeft size={18}/></button><button className="oc-today" onClick={()=>setWeek(monday(new Date()))}>Hoy</button><button aria-label="Semana siguiente" onClick={()=>setWeek(d=>shift(d,7))}><ChevronRight size={18}/></button></div></div>
  <div className="oc-agenda-week">{days.map((d,i)=>{const date=localDate(d);const events=filtered.filter(m=>dayKey(m.proposed_start)===date).sort((a,b)=>a.proposed_start.localeCompare(b.proposed_start));return <div className={'oc-agenda-day'+(date===localDate(new Date())?' is-today':'')} key={date}><div className="oc-day-header"><small>{['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'][i]}</small><strong>{d.getDate()}</strong></div><div className="oc-day-body">{events.map(m=><button key={m.id} className={'oc-slot '+m.status} onClick={()=>openDetail(m)}><small>{time(m.proposed_start)}</small><strong>{m.company}</strong><span>{states[m.status]||m.status}</span></button>)}{!events.length&&<div className="oc-slot-empty">Disponible</div>}<button className="oc-slot-add" aria-label={'Proponer cita el '+date} onClick={()=>openCreate(date+'T10:00')}><Plus size={14}/></button></div></div>})}</div>
  {undated.length>0&&<div className="oc-agenda-unscheduled"><h4>Por programar <span>{undated.length}</span></h4><div>{undated.map(m=><button key={m.id} onClick={()=>openDetail(m)}><span className="oc-mini-dot"/><strong>{m.company}</strong><small>{states[m.status]||m.status}</small></button>)}</div></div>}
  </main><aside className="oc-agenda-side"><h3>Próximas reuniones</h3><p>Prioriza las conversaciones con mayor potencial.</p><div className="oc-agenda-search"><Search size={16}/><input placeholder="Buscar contacto..." value={query} onChange={e=>setQuery(e.target.value)}/></div><select className="oc-agenda-filter" value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">Todos los estados</option>{Object.entries(states).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select>{upcoming.filter(m=>filtered.some(f=>f.id===m.id)).slice(0,7).map(m=><button className="oc-upcoming" key={m.id} onClick={()=>openDetail(m)}><span className="oc-upcoming-date">{new Date(m.proposed_start).toLocaleDateString('es-CO',{timeZone:'America/Bogota',day:'2-digit',month:'short'})}</span><span><strong>{m.company}</strong><small>{time(m.proposed_start)} · {states[m.status]}</small></span></button>)}{!upcoming.some(m=>filtered.some(f=>f.id===m.id))&&<div className="oc-empty"><CalendarDays size={29}/><strong>Tu agenda está despejada</strong><span>Cuando registres una reunión aparecerá aquí.</span></div>}</aside></div>
  {error&&<p role="alert" className="oc-agenda-error">{error}</p>}
  {mode&&<div className="oc-drawer-backdrop" onClick={()=>setMode('')}><section className="oc-drawer" onClick={e=>e.stopPropagation()} aria-label={mode==='create'?'Nueva reunión':'Detalle de la reunión'}><div className="oc-drawer-top"><span>{mode==='create'?'NUEVA OPORTUNIDAD':'DETALLE DE REUNIÓN'}</span><button aria-label="Cerrar" onClick={()=>setMode('')}><X size={20}/></button></div>{mode==='create'?<><h3>Agendemos una conversación</h3><p>Registra una propuesta sin enviar invitaciones hasta acordar el horario.</p><label>Empresa o prospecto<select value={draft.prospect_id} onChange={e=>setDraft(s=>({...s,prospect_id:e.target.value}))}><option value="">Seleccionar prospecto…</option>{prospects.map(p=><option key={p.id} value={p.id}>{p.company}{p.person?' · '+p.person:''}</option>)}</select></label><label>Asunto<input value={draft.subject} onChange={e=>setDraft(s=>({...s,subject:e.target.value}))}/></label><label>Fecha y hora propuestas<input type="datetime-local" value={draft.proposed_start} onChange={e=>setDraft(s=>({...s,proposed_start:e.target.value}))}/></label><label>Notas<textarea rows={3} value={draft.notes} onChange={e=>setDraft(s=>({...s,notes:e.target.value}))}/></label><button className="oc-drawer-save" onClick={save} disabled={loading}>Guardar propuesta</button></>:<><h3>{active.company}</h3><p>{active.contact_name||active.contact_email||'Contacto por definir'}</p><div className="oc-detail-time"><Clock3 size={19}/><strong>{fmt(active.proposed_start)}</strong></div><h4>{active.subject}</h4>{active.reply_summary&&<p>{active.reply_summary}</p>}{active.notes&&<p>{active.notes}</p>}<label>Estado de la reunión<select value={active.status} onChange={e=>updateState(e.target.value)} disabled={loading}>{Object.entries(states).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></label>{active.google_event_url&&<a className="oc-event-link" href={active.google_event_url} target="_blank" rel="noopener noreferrer"><ExternalLink size={15}/> Abrir en Calendar</a>}</>}{error&&<p role="alert" className="oc-agenda-error">{error}</p>}</section></div>}
 </div>;
}
