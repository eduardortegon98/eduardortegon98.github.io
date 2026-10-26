import { useEffect, useState } from 'react';
import { BriefcaseBusiness, Building2, ExternalLink, Target, Users, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useOutletContext } from 'react-router-dom';
import { useLanguage } from '../i18n/Language';
import ProspectsModal from '../Analytics/ProspectsModal';
import './Prospecting.css';

const jobs = [
  { company: 'Wompi', role: 'Desarrollador Full Stack Soporte', mode: 'Remoto · Colombia', url: 'https://www.linkedin.com/jobs/view/4481960343/', date: '2026-10-26' },
  { company: 'Experis Colombia', role: 'Ingeniero de Inteligencia Artificial', mode: 'Híbrido · Bogotá', url: 'https://www.linkedin.com/jobs/view/4483113004/', date: '2026-10-26' },
];
export default function Prospecting() {
  const { role } = useOutletContext();
  const { language } = useLanguage();
  const en = language === 'en';
  const [tab, setTab] = useState('all');
  const [showCRM, setShowCRM] = useState(false);
  const [clients,setClients]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [statusFilter,setStatusFilter]=useState('');
  const [adding,setAdding]=useState(false);
  useEffect(()=>{let active=true;(async()=>{try{const rows=[];for(let offset=0;;offset+=500){const {data,error}=await supabase.from('sales_prospects').select('id,company,person,email,status,delivery_status,sector,contacted_at,gmail_url').order('contacted_at',{ascending:false}).range(offset,offset+499);if(error)throw error;rows.push(...data);if(data.length<500)break;}if(active)setClients(rows.filter(x=>!/empleo personal/i.test(x.sector||'')));}catch(e){if(active)setError(e.message)}finally{if(active)setLoading(false)}})();return()=>{active=false}},[]);
  const replied=new Set(['Respondió','Interesado','Reunión','Cotización','Ganado']);
  const ranked=clients.filter(x=>!statusFilter||x.status===statusFilter).sort((a,b)=>Number(replied.has(b.status))-Number(replied.has(a.status))||(b.contacted_at||'').localeCompare(a.contacted_at||''));
  if (role !== 'super_admin') return null;
  const t = (es, english) => en ? english : es;
  return <section className="ort-prospecting">
    <header className="ort-prospecting-head"><div><span><Target size={15}/> ORTDESK · {t('CRECIMIENTO','GROWTH')}</span><h2>{t('Prospección','Prospecting')}</h2><p>{t('Un solo lugar para oportunidades comerciales, laborales y alianzas.','One place for sales, job opportunities and partnerships.')}</p></div><a href="https://app.notion.com/p/0eaf28ad2891459eb2ece0dad41cd61e" target="_blank" rel="noreferrer">{t('Abrir base en Notion','Open Notion database')} <ExternalLink size={15}/></a></header>
    <nav className="ort-prospecting-tabs" aria-label={t('Tipos de prospección','Prospecting types')}>{[['all',t('Todas','All')],['clients',t('Clientes','Clients')],['jobs',t('Empleo','Jobs')],['partners',t('Alianzas','Partnerships')]].map(([id,label])=><button type="button" key={id} className={tab===id?'active':''} onClick={()=>setTab(id)}>{label}</button>)}</nav>
    {(tab==='all'||tab==='clients')&&<article className="ort-prospecting-card"><div className="ort-prospecting-card-title"><Building2 size={20}/><div><h3>{t('Clientes potenciales','Sales prospects')}</h3><p>{t('Primero los que respondieron y avanzaron.','Replies and progressing leads first.')}</p></div></div><div className="ort-prospecting-metrics"><span>{clients.length} {t('prospectados','prospected')}</span><span>{clients.filter(x=>replied.has(x.status)).length} {t('respondieron o avanzaron','replied or progressed')}</span></div><div className="ort-prospecting-controls"><select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option value="">{t('Todos los estados','All statuses')}</option>{['Respondió','Interesado','Reunión','Cotización','Ganado','Contactado','No contactar'].map(v=><option key={v}>{v}</option>)}</select><button onClick={()=>setShowCRM(true)}>{t('Sincronizar Notion / CRM completo','Sync Notion / Full CRM')}</button></div>{loading?<p>{t('Cargando…','Loading…')}</p>:error?<p role="alert">{error}</p>:<div className="ort-prospecting-client-list">{ranked.map(x=><div className="ort-prospecting-client" key={x.id}><div><strong>{x.company}</strong><small>{x.person||x.email||'—'}</small></div><div><span className={'ort-prospecting-status '+(replied.has(x.status)?'positive':'')}>{x.status||'—'}</span>{x.delivery_status==='rebotado'&&<small>{t('Rebotado','Bounced')}</small>}{x.gmail_url&&<a href={x.gmail_url} target="_blank" rel="noreferrer"><ExternalLink size={16}/></a>}</div></div>)}</div>}</article>}
    {(tab==='all'||tab==='jobs')&&<article className="ort-prospecting-card"><div className="ort-prospecting-card-title"><BriefcaseBusiness size={20}/><div><h3>{t('Oportunidades laborales','Job opportunities')}</h3><p>{t('Postulaciones verificadas por correo de confirmación de LinkedIn.','Applications confirmed by LinkedIn email.')}</p></div></div><div className="ort-prospecting-jobs">{jobs.map(job=><div className="ort-prospecting-job" key={job.company}><div><strong>{job.company}</strong><span>{job.role}</span><small>{job.mode} · {job.date}</small></div><div><span className="ort-prospecting-status">{t('Postulado','Applied')}</span><a href={job.url} target="_blank" rel="noreferrer" aria-label={t('Ver vacante','View job')}><ExternalLink size={17}/></a></div></div>)}</div><small className="ort-prospecting-note">{t('Estos dos registros están guardados en Notion. Las nuevas postulaciones aún no se importan automáticamente.','These two entries are saved in Notion. New applications are not yet imported automatically.')}</small></article>}
    {(tab==='all'||tab==='partners')&&<article className="ort-prospecting-card"><div className="ort-prospecting-card-title"><Users size={20}/><div><h3>{t('Alianzas estratégicas','Strategic partnerships')}</h3></div></div><div className="ort-prospecting-jobs">{[['Leidy',t('Gestión y estrategia','Management and strategy')],['Eduard',t('Desarrollo tecnológico','Technology development')]].map(([name,description])=><div className="ort-prospecting-job" key={name}><div><strong>{name}</strong><small>{description}</small></div><span className="ort-prospecting-status positive">{t('Equipo actual','Current team')}</span></div>)}</div><button onClick={()=>setAdding(v=>!v)}><Plus size={16}/>{t('Agregar alianza','Add partnership')}</button>{adding&&<p>{t('Registra nuevas alianzas en Notion con Tipo de prospección: Alianza estratégica.','Register new partners in Notion as Strategic partnership.')} <a href="https://app.notion.com/p/0eaf28ad2891459eb2ece0dad41cd61e" target="_blank" rel="noreferrer">{t('Abrir Notion','Open Notion')}</a></p>}</article>}
    {showCRM&&<ProspectsModal en={en} onClose={()=>setShowCRM(false)}/>}
  </section>;
}
