import { Link, useOutletContext } from 'react-router-dom';
import { Mail, CalendarDays, ShieldCheck, MessagesSquare, PawPrint, ArrowUpRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../i18n/Language';
import './Account.css';
export default function Account(){
 const {user,role,modules=[]}=useOutletContext();
 const {language}=useLanguage(),en=language==='en';
 const t=(es,english)=>en?english:es;
 const name=user.user_metadata?.full_name||user.user_metadata?.name||user.email?.split('@')[0]||t('Mi cuenta','My account');
 const initials=String(name).trim().split(/\s+/).filter(Boolean).slice(0,2).map(word=>word[0]).join('').toLocaleUpperCase();
 const admin=role==='super_admin';
 const available=[{id:'messages',path:'/panel/mensajes',label:t('Mensajes','Messages'),tag:'Demo',icon:MessagesSquare},{id:'arturito',path:'/panel/arturito',label:'Arturito',tag:'Beta',icon:PawPrint}].filter(item=>admin||modules.includes(item.id));
 const created=user.created_at&&new Date(user.created_at);
 const createdLabel=created&&!Number.isNaN(created.getTime())?new Intl.DateTimeFormat(en?'en-US':'es-CO',{dateStyle:'medium',timeZone:'America/Bogota'}).format(created):'—';
 return <main className="account-page">
  <Link to="/panel" className="account-back"><ArrowLeft size={16}/>{t('Volver a mi espacio','Back to my workspace')}</Link>
  <section className="account-card">
   <header className="account-profile"><span className="account-profile-avatar" aria-hidden="true">{initials}</span><div><span className="account-eyebrow">{t('MI CUENTA','MY ACCOUNT')}</span><h1>{String(name)}</h1><p>{user.email}</p></div><span className="account-role"><ShieldCheck size={14}/>{admin?t('Administrador','Administrator'):t('Cliente','Client')}</span></header>
   <dl className="account-details"><div><dt><Mail size={17}/>{t('Correo electrónico','Email address')}</dt><dd>{user.email||'—'}</dd></div><div><dt><CalendarDays size={17}/>{t('Miembro desde','Member since')}</dt><dd>{createdLabel}</dd></div></dl>
   <section className="account-modules"><h2>{t('Mis módulos','My modules')}</h2><div>{available.map(item=><Link key={item.id} to={item.path}><span className="account-module-icon"><item.icon size={22}/></span><strong>{item.label}<small>{item.tag}</small></strong><ArrowUpRight size={18}/></Link>)}</div>{!available.length&&<p>{t('Todavía no tienes módulos asignados.','No modules have been assigned yet.')}</p>}</section>
  </section>
 </main>;
}
