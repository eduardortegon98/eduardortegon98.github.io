import { useState } from 'react';
import { BriefcaseBusiness, Building2, ExternalLink, Target, Users } from 'lucide-react';
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
  if (role !== 'super_admin') return null;
  const t = (es, english) => en ? english : es;
  return <section className="ort-prospecting">
    <header className="ort-prospecting-head"><div><span><Target size={15}/> ORTDESK · {t('CRECIMIENTO','GROWTH')}</span><h2>{t('Prospección','Prospecting')}</h2><p>{t('Un solo lugar para oportunidades comerciales, laborales y alianzas.','One place for sales, job opportunities and partnerships.')}</p></div><a href="https://app.notion.com/p/0eaf28ad2891459eb2ece0dad41cd61e" target="_blank" rel="noreferrer">{t('Abrir base en Notion','Open Notion database')} <ExternalLink size={15}/></a></header>
    <nav className="ort-prospecting-tabs" aria-label={t('Tipos de prospección','Prospecting types')}>{[['all',t('Todas','All')],['clients',t('Clientes','Clients')],['jobs',t('Empleo','Jobs')],['partners',t('Alianzas','Partnerships')]].map(([id,label])=><button type="button" key={id} className={tab===id?'active':''} onClick={()=>setTab(id)}>{label}</button>)}</nav>
    {(tab==='all'||tab==='clients')&&<article className="ort-prospecting-card"><div className="ort-prospecting-card-title"><Building2 size={20}/><div><h3>{t('Clientes potenciales','Sales prospects')}</h3><p>{t('Contactos comerciales y seguimiento sincronizable con Notion.','Commercial contacts and Notion synchronization.')}</p></div></div><button onClick={()=>setShowCRM(true)}>{t('Ver CRM de prospectos','View prospects CRM')}</button></article>}
    {(tab==='all'||tab==='jobs')&&<article className="ort-prospecting-card"><div className="ort-prospecting-card-title"><BriefcaseBusiness size={20}/><div><h3>{t('Oportunidades laborales','Job opportunities')}</h3><p>{t('Postulaciones verificadas por correo de confirmación de LinkedIn.','Applications confirmed by LinkedIn email.')}</p></div></div><div className="ort-prospecting-jobs">{jobs.map(job=><div className="ort-prospecting-job" key={job.company}><div><strong>{job.company}</strong><span>{job.role}</span><small>{job.mode} · {job.date}</small></div><div><span className="ort-prospecting-status">{t('Postulado','Applied')}</span><a href={job.url} target="_blank" rel="noreferrer" aria-label={t('Ver vacante','View job')}><ExternalLink size={17}/></a></div></div>)}</div><small className="ort-prospecting-note">{t('Estos dos registros están guardados en Notion. Las nuevas postulaciones aún no se importan automáticamente.','These two entries are saved in Notion. New applications are not yet imported automatically.')}</small></article>}
    {(tab==='all'||tab==='partners')&&<article className="ort-prospecting-card"><div className="ort-prospecting-card-title"><Users size={20}/><div><h3>{t('Alianzas estratégicas','Strategic partnerships')}</h3><p>{t('Registra futuros socios y colaboradores en Notion usando el tipo Alianza estratégica.','Track partners and collaborators in Notion under Strategic partnership.')}</p></div></div></article>}
    {showCRM&&<ProspectsModal en={en} onClose={()=>setShowCRM(false)}/>}
  </section>;
}
