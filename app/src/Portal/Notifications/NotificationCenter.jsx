import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, X, CheckCheck, RefreshCw, Inbox, AlertCircle } from 'lucide-react';
import { usePortalNotifications } from './NotificationContext';
import { useLanguage } from '../../i18n/Language';
import ContactStageTooltip from '../ContactStageTooltip';
import { contactData, loadWorkspace } from '../../CRM/model';
export default function NotificationCenter({userId}){
  const state=usePortalNotifications(),{language}=useLanguage(),en=language==='en';
  const t=(es,english)=>en?english:es;
  const [open,setOpen]=useState(false),[filter,setFilter]=useState('all');
  const dialog=useRef(null),trigger=useRef(null),id=useId();
  useEffect(()=>{if(open&&!dialog.current.open)dialog.current.showModal();},[open]);
  function close(){dialog.current?.close();setOpen(false);trigger.current?.focus();}
  const items=state.items.filter(item=>filter!=='unread'||!item.read);
  const date=value=>value?new Date(value.length===10?value+'T12:00:00':value).toLocaleString(en?'en-US':'es-CO',{dateStyle:'medium',...(value.length>10?{timeStyle:'short'}:{})}):'';
  return <><button ref={trigger} className="global-notification-trigger" aria-label={t('Notificaciones','Notifications')+(state.unread?' · '+state.unread:'')} aria-haspopup="dialog" aria-expanded={open} aria-controls={id} title={t('Notificaciones','Notifications')} onClick={()=>setOpen(true)}><Bell size={19}/>{state.unread>0&&<span>{state.unread>99?'99+':state.unread}</span>}</button>
    {open&&<dialog ref={dialog} id={id} className="global-notification-panel" aria-labelledby={id+'-title'} onCancel={event=>{event.preventDefault();close();}} onClick={event=>{if(event.target===dialog.current){const bounds=dialog.current.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)close();}}}>
      <header><div><h2 id={id+'-title'}>{t('Notificaciones','Notifications')}</h2><small>{state.unread} {t('sin leer','unread')}</small></div><button aria-label={t('Cerrar notificaciones','Close notifications')} onClick={close}><X size={18}/></button></header>
      <div className="global-notification-tools"><div role="group" aria-label={t('Filtrar notificaciones','Filter notifications')}><button aria-pressed={filter==='all'} onClick={()=>setFilter('all')}>{t('Todas','All')}</button><button aria-pressed={filter==='unread'} onClick={()=>setFilter('unread')}>{t('Sin leer','Unread')}</button></div><div><button title={t('Marcar todas como leídas','Mark all as read')} aria-label={t('Marcar todas como leídas','Mark all as read')} disabled={!state.unread} onClick={()=>state.markRead(state.items.map(item=>item.id))}><CheckCheck size={17}/></button><button title={t('Actualizar','Refresh')} aria-label={t('Actualizar notificaciones','Refresh notifications')} disabled={state.loading} onClick={state.refresh}><RefreshCw size={16}/></button></div></div>
      <p className="global-notification-source">{t('Avisos internos · guardado local. Los canales externos siguen pendientes de integración.','Internal notices · local storage. External channels still require integration.')}</p>
      {state.error&&<p className="global-notification-error" role="alert"><AlertCircle size={16}/>{state.error==='save_failed'?t('No fue posible guardar el estado de lectura.','Could not save read status.'):t('No se pudieron actualizar los contactos.','Could not refresh contacts.')}</p>}
      <div className="global-notification-list">{items.map(item=><article key={item.id} className={item.read?'is-read':''}><Link to={item.path} onClick={event=>{if(state.markRead([item.id]))close();else event.preventDefault();}}><span className={'global-notification-dot'+(item.overdue?' overdue':'')} aria-hidden="true"/><span><strong>{item.title}</strong><small>{item.company||item.module||t('Portal','Portal')}</small>{item.due&&<small>{date(item.due)}{item.overdue?' · '+t('Vencido','Overdue'):''}</small>}</span></Link>{item.contactId&&<ContactStageTooltip stage={contactData(loadWorkspace(userId),item.contactId).stage} en={en} compact/>}</article>)}{!items.length&&<div className="global-notification-empty"><Inbox size={26}/><p>{state.preview?t('Sin avisos de administrador en la vista de cliente.','Administrator notices are hidden in client preview.'):t('No tienes notificaciones en esta vista.','No notifications in this view.')}</p></div>}</div>
    </dialog>}
  </>;
}
