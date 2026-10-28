import {useEffect,useMemo,useState} from 'react';
import {CalendarDays,ChevronLeft,ChevronRight,Plus,Search,X,Clock3,ExternalLink,RefreshCw} from 'lucide-react';
import {supabase} from '../lib/supabase';
import {useLanguage} from '../i18n/Language';
import './MeetingPanel.css';

const states={proposed:['Propuesta','Proposed'],pending_confirmation:[t("Por confirmar","Awaiting confirmation"),'Awaiting confirmation'],confirmed:['Confirmada','Confirmed'],completed:['Realizada','Completed'],cancelled:['Cancelada','Cancelled']};
const localDate=d=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Bogota',year:'numeric',month:'2-digit',day:'2-digit'}).format(d);
const dayKey=v=>v?localDate(new Date(v)):'';
const fmt=(v,en)=>v?new Intl.DateTimeFormat(en?'en-US':(en?'en-US':'es-CO'),{timeZone:'America/Bogota',dateStyle:'medium',timeStyle:'short'}).format(new Date(v)):(en?'No date':'Sin fecha');
const time=(v,en)=>v?new Intl.DateTimeFormat(en?'en-US':(en?'en-US':'es-CO'),{timeZone:'America/Bogota',hour:'2-digit',minute:'2-digit'}).format(new Date(v)):'—';
const monday=d=>{const x=new Date(d);x.setHours(12,0,0,0);x.setDate(x.getDate()-((x.getDay()+6)%7));return x;};
const shift=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const isoLocal=v=>v?new Date(v).toISOString():null;
export default function MeetingPanel(){
 const {language}=useLanguage(),en=language==='en',t=(es,english)=>en?english:es;
 const stateLabel=s=>states[s]?.[en?1:0]||s;
 const [items,setItems]=useState([]),[prospects,setProspects]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState('');
 const [week,setWeek]=useState(()=>monday(new Date())),[query,setQuery]=useState(''),[filter,setFilter]=useState('all'),[active,setActive]=useState(null),[mode,setMode]=useState('');
 const [draft,setDraft]=useState({prospect_id:'',subject:t('Reunión comercial','Sales meeting'),proposed_start:'',notes:''});
 async function refresh(){
  if(!supabase){setError(t('Supabase no está configurado.','Supabase is not configured.'));setLoading(false);return;}
  setLoading(true);setError('');
  const [a,b]=await Promise.all([supabase.from('sales_meetings').select('*').order('proposed_start',{ascending:true,nullsFirst:false}).limit(250),supabase.from('sales_prospects').select('id,company,person,email').order('company').limit(500)]);
  if(a.error)setError(t('No se pudieron cargar las reuniones: ','Could not load meetings: ')+a.error.message);else setItems(a.data||[]);
  if(b.error)setError(t('No se pudieron cargar prospectos: ','Could not load prospects: ')+b.error.message);else setProspects(b.data||[]);
  setLoading(false);
 }
 useEffect(()=>{refresh()},[]);
 const days=useMemo(()=>Array.from({length:7},(_,i)=>shift(week,i)),[week]);
 const range=days[0].toLocaleDateString((en?'en-US':'es-CO'),{day:'numeric',month:'short'})+' — '+days[6].toLocaleDateString((en?'en-US':'es-CO'),{day:'numeric',month:'short',year:'numeric'});
 const filtered=items.filter(m=>(filter==='all'||m.status===filter)&&[m.company,m.contact_name,m.subject,m.contact_email].join(' ').toLowerCase().includes(query.toLowerCase()));
 const undated=filtered.filter(m=>!m.proposed_start);
 const upcoming=items.filter(m=>m.proposed_start&&new Date(m.proposed_start)>=new Date()&&!['cancelled','completed'].includes(m.status)).sort((a,b)=>new Date(a.proposed_start)-new Date(b.proposed_start));
 const counts={pending:items.filter(m=>['proposed','pending_confirmation'].includes(m.status)).length,confirmed:items.filter(m=>m.status==='confirmed').length,completed:items.filter(m=>m.status==='completed').length};
 function openCreate(date){setDraft({prospect_id:'',subject:t('Reunión comercial','Sales meeting'),proposed_start:date||'',notes:''});setMode('create');setActive(null);setError('')}
 function openDetail(m){setActive(m);setMode('detail');setError('')}
 async function save(){
  const p=prospects.find(x=>x.id===draft.prospect_id);
  if(!p){setError(t('Selecciona un prospecto para la reunión.','Select a prospect for the meeting.'));return}
  setLoading(true);setError('');
  const start=isoLocal(draft.proposed_start);
  const {error:e}=await supabase.from('sales_meetings').insert({prospect_id:p.id,company:p.company,contact_name:p.person,contact_email:p.email,subject:draft.subject.trim()||t('Reunión comercial','Sales meeting'),proposed_start:start,proposed_end:start?new Date(new Date(start).getTime()+30*60000).toISOString():null,notes:draft.notes,status:'proposed'});
  if(e)setError(e.message);else{setMode('');await refresh()}
  setLoading(false);
 }
 async function updateState(value){
  if(!active)return;
  if(value==='confirmed'&&!active.google_event_id){setError(t('Primero registra una invitación real de Google Calendar. No se confirmó ni envió ninguna invitación.','First register a real Google Calendar invitation. No meeting was confirmed and no invitation was sent.'));return}
  setLoading(true);const {error:e}=await supabase.from('sales_meetings').update({status:value,updated_at:new Date().toISOString()}).eq('id',active.id);
  if(e)setError(e.message);else{setMode('');await refresh()}setLoading(false);
 }
 return <div className="oc-agenda">
  <header className="oc-agenda-hero"><div><span className="oc-eyebrow">ORTCONNECT · COMERCIAL</span><h2>{t("Tu agenda","Your schedule")}<span className="oc-accent">.</span></h2><p>{t("De una respuesta a una conversación que puede convertirse en negocio.","Turn an email reply into a conversation that can become a deal.")}</p></div><button className="oc-agenda-new" onClick={()=>openCreate('')}><Plus size={18}/> Nueva reunión</button></header>
  <div className="oc-agenda-summary"><div><span>{t("Por confirmar","Awaiting confirmation")}</span><strong>{counts.pending}</strong><small>{t("Oportunidades en conversación","Opportunities in progress")}</small></div><div><span>{t("Confirmadas","Confirmed")}</span><strong>{counts.confirmed}</strong><small>{t("Reuniones acordadas","Scheduled meetings")}</small></div><div><span>{t("Realizadas","Completed")}</span><strong>{counts.completed}</strong><small>{t("Conversaciones completadas","Completed conversations")}</small></div></div>
  <div className="oc-agenda-layout"><main className="oc-agenda-main"><div className="oc-agenda-toolbar"><div><h3>{t("Calendario semanal","Weekly calendar")}</h3><span>{range}</span></div><div className="oc-agenda-nav"><button aria-label={t("Semana anterior","Previous week")} onClick={()=>setWeek(d=>shift(d,-7))}><ChevronLeft size={18}/></button><button className="oc-today" onClick={()=>setWeek(monday(new Date()))}>{t("Hoy","Today")}</button><button aria-label={t("Semana siguiente","Next week")} onClick={()=>setWeek(d=>shift(d,7))}><ChevronRight size={18}/></button></div></div>
  <div className="oc-agenda-week">{days.map((d,i)=>{const date=localDate(d);const events=filtered.filter(m=>dayKey(m.proposed_start)===date).sort((a,b)=>a.proposed_start.localeCompare(b.proposed_start));return <div className={'oc-agenda-day'+(date===localDate(new Date())?' is-today':'')} key={date}><div className="oc-day-header"><small>{(en?['Mon','Tue','Wed','Thu','Fri','Sat','Sun']:['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'])[i]}</small><strong>{d.getDate()}</strong></div><div className="oc-day-body">{events.map(m=><button key={m.id} className={'oc-slot '+m.status} onClick={()=>openDetail(m)}><small>{time(m.proposed_start,en)}</small><strong>{m.company}</strong><span>{stateLabel(m.status)}</span></button>)}{!events.length&&<div className="oc-slot-empty">{t("Disponible","Available")}</div>}<button className="oc-slot-add" aria-label={t('Proponer cita el ','Propose a meeting on ')+date} onClick={()=>openCreate(date+'T10:00')}><Plus size={14}/></button></div></div>})}</div>
  {undated.length>0&&<div className="oc-agenda-unscheduled"><h4>{t("Por programar ","Unscheduled ")}<span>{undated.length}</span></h4><div>{undated.map(m=><button key={m.id} onClick={()=>openDetail(m)}><span className="oc-mini-dot"/><strong>{m.company}</strong><small>{stateLabel(m.status)}</small></button>)}</div></div>}
  </main><aside className="oc-agenda-side"><h3>{t("Próximas reuniones","Upcoming meetings")}</h3><p>{t("Prioriza las conversaciones con mayor potencial.","Prioritize conversations with the highest potential.")}</p><div className="oc-agenda-search"><Search size={16}/><input placeholder={t("Buscar contacto...","Search contacts...")} value={query} onChange={e=>setQuery(e.target.value)}/></div><select className="oc-agenda-filter" value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">{t("Todos los estados","All statuses")}</option>{Object.keys(states).map(k=><option key={k} value={k}>{stateLabel(k)}</option>)}</select>{upcoming.filter(m=>filtered.some(f=>f.id===m.id)).slice(0,7).map(m=><button className="oc-upcoming" key={m.id} onClick={()=>openDetail(m)}><span className="oc-upcoming-date">{new Date(m.proposed_start).toLocaleDateString((en?'en-US':'es-CO'),{timeZone:'America/Bogota',day:'2-digit',month:'short'})}</span><span><strong>{m.company}</strong><small>{time(m.proposed_start,en)} · {states[m.status]}</small></span></button>)}{!upcoming.some(m=>filtered.some(f=>f.id===m.id))&&<div className="oc-empty"><CalendarDays size={29}/><strong>{t("Tu agenda está despejada","Your schedule is clear")}</strong><span>{t("Cuando registres una reunión aparecerá aquí.","When you schedule a meeting, it will appear here.")}</span></div>}</aside></div>
  {error&&<p role="alert" className="oc-agenda-error">{error}</p>}
  {mode&&<div className="oc-drawer-backdrop" onClick={()=>setMode('')}><section className="oc-drawer" onClick={e=>e.stopPropagation()} aria-label={mode==='create'?t("Nueva reunión","New meeting"):t("Detalle de la reunión","Meeting details")}><div className="oc-drawer-top"><span>{mode==='create'?t("NUEVA OPORTUNIDAD","NEW OPPORTUNITY"):t("DETALLE DE REUNIÓN","MEETING DETAILS")}</span><button aria-label={t("Cerrar","Close")} onClick={()=>setMode('')}><X size={20}/></button></div>{mode==='create'?<><h3>{t("Agendemos una conversación","Let's schedule a conversation")}</h3><p>{t("Registra una propuesta sin enviar invitaciones hasta acordar el horario.","Save a proposal without sending invitations until a time is agreed.")}</p><label>{t("Empresa o prospecto","Company or prospect")}<select value={draft.prospect_id} onChange={e=>setDraft(s=>({...s,prospect_id:e.target.value}))}><option value="">{t("Seleccionar prospecto…","Select prospect…")}</option>{prospects.map(p=><option key={p.id} value={p.id}>{p.company}{p.person?' · '+p.person:''}</option>)}</select></label><label>{t("Asunto","Subject")}<input value={draft.subject} onChange={e=>setDraft(s=>({...s,subject:e.target.value}))}/></label><label>{t("Fecha y hora propuestas","Proposed date and time")}<input type="datetime-local" value={draft.proposed_start} onChange={e=>setDraft(s=>({...s,proposed_start:e.target.value}))}/></label><label>{t("Notas","Notes")}<textarea rows={3} value={draft.notes} onChange={e=>setDraft(s=>({...s,notes:e.target.value}))}/></label><button className="oc-drawer-save" onClick={save} disabled={loading}>{t("Guardar propuesta","Save proposal")}</button></>:<><h3>{active.company}</h3><p>{active.contact_name||active.contact_email||t("Contacto por definir","Contact to be confirmed")}</p><div className="oc-detail-time"><Clock3 size={19}/><strong>{fmt(active.proposed_start,en)}</strong></div><h4>{active.subject}</h4>{active.reply_summary&&<p>{active.reply_summary}</p>}{active.notes&&<p>{active.notes}</p>}<label>{t("Estado de la reunión","Meeting status")}<select value={active.status} onChange={e=>updateState(e.target.value)} disabled={loading}>{Object.keys(states).map(k=><option key={k} value={k}>{stateLabel(k)}</option>)}</select></label>{active.google_event_url&&<a className="oc-event-link" href={active.google_event_url} target="_blank" rel="noopener noreferrer"><ExternalLink size={15}/> Abrir en Calendar</a>}</>}{error&&<p role="alert" className="oc-agenda-error">{error}</p>}</section></div>}
 </div>;
}
