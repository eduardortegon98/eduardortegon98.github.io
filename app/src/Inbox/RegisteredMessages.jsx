import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowUpRight, Clock3, Database, Instagram, RefreshCw, Search, Send, WifiOff, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../i18n/Language';
import PortalLoading from '../Portal/PortalLoading';
import { loadRegisteredOutreach } from './registeredOutreach';
import './RegisteredMessages.css';
const initials=name=>name.trim().split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toLocaleUpperCase();
export default function RegisteredMessages(){
 const {language}=useLanguage(),en=language==='en',t=(es,english)=>en?english:es;
 const [items,setItems]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState(''),[revision,setRevision]=useState(0);
 const [syncing,setSyncing]=useState(false),[notice,setNotice]=useState(''),[query,setQuery]=useState(''),[channel,setChannel]=useState(''),[selected,setSelected]=useState(null),[mobileOpen,setMobileOpen]=useState(false);
 useEffect(()=>{
  let active=true;setLoading(true);setError('');
  loadRegisteredOutreach(supabase).then(rows=>{if(active){setItems(rows);setSelected(current=>rows.some(row=>row.id===current)?current:rows[0]?.id||null);}}).catch(()=>{if(active){setError(t('No pudimos cargar la actividad. Verifica la conexión y la sincronización de prospectos con Notion.','Could not load activity. Check the connection and Notion prospect synchronization.'));setItems([]);}}).finally(()=>{if(active)setLoading(false);});
  return()=>{active=false;};
 },[revision,language]);
 async function sync(){
  setSyncing(true);setNotice('');setError('');
  try{const result=await supabase.functions.invoke('sync-prospects',{body:{}});if(result.error||!result.data?.success)throw new Error('sync');setNotice(t('Notion sincronizado. Se actualizó el registro de contactos; no se consultó Instagram.','Notion synced. Contact records were updated; Instagram was not queried.'));setRevision(value=>value+1);}
  catch{setError(t('No pudimos sincronizar. Revisa la función sync-prospects y sus permisos.','Could not sync. Check the sync-prospects function and its permissions.'));}
  finally{setSyncing(false);}
 }
 const visible=useMemo(()=>items.filter(item=>(!channel||item.channel===channel)&&(item.name+' '+item.subject).toLocaleLowerCase().includes(query.toLocaleLowerCase())),[items,query,channel]);
 const current=visible.find(item=>item.id===selected)||visible[0];
 const date=value=>{const raw=value?.slice(0,10);if(!/^\d{4}-\d{2}-\d{2}$/.test(raw||''))return '—';return new Intl.DateTimeFormat(en?'en-US':'es-CO',{dateStyle:'medium',timeZone:'UTC'}).format(new Date(raw+'T12:00:00Z'));};
 const channels=[...new Set(items.map(item=>item.channel))].sort();
 const replied=item=>['Respondió','Interesado','Reunión','Cotización','Ganado'].includes(item.status);
 return <div className="registered-messages">
  <div className="registered-toolbar"><div><span className="registered-source"><Database size={13}/>{t('Registros reales · CRM','Real records · CRM')}</span><span className="registered-offline"><WifiOff size={13}/>{t('n8n / Meta sin conectar','n8n / Meta not connected')}</span></div><div><button className="compact-action" aria-label={t('Actualizar registros','Refresh records')} title={t('Actualizar registros','Refresh records')} disabled={loading||syncing} onClick={()=>setRevision(value=>value+1)}><RefreshCw size={17}/></button><button className="registered-sync" disabled={loading||syncing} onClick={sync}><RefreshCw size={14}/>{syncing?t('Sincronizando…','Syncing…'):t('Sincronizar Notion','Sync Notion')}</button></div></div>
  {error&&<p className="registered-error" role="alert">{error}</p>}{notice&&<p className="registered-notice" role="status">{notice}</p>}
  {loading?<PortalLoading compact/>:<div className={'registered-grid'+(mobileOpen?' thread-open':'')}>
   <aside className="registered-list"><header><h2>{t('Contactos iniciales','Initial contacts')}<span>{visible.length}</span></h2><label><Search size={16}/><input type="search" aria-label={t('Buscar contacto','Search contacts')} placeholder={t('Buscar contacto','Search contacts')} value={query} onChange={event=>{setQuery(event.target.value);setMobileOpen(false);}}/></label>{channels.length>1&&<select aria-label={t('Canal','Channel')} value={channel} onChange={event=>{setChannel(event.target.value);setMobileOpen(false);}}><option value="">{t('Todos los canales','All channels')}</option>{channels.map(name=><option key={name}>{name}</option>)}</select>}</header><div className="registered-contact-list">{visible.map(item=><button key={item.id} className={current?.id===item.id?'selected':''} aria-pressed={current?.id===item.id} onClick={()=>{setSelected(item.id);setMobileOpen(true);}}><span className="registered-avatar">{initials(item.name)}</span><span className="registered-contact-copy"><strong>{item.name}</strong><small>{item.channel} · {date(item.date)}</small><span>{replied(item)?t('Respuesta registrada en CRM','Reply recorded in CRM'):t('Primer contacto registrado','Initial contact recorded')}</span></span></button>)}{!visible.length&&<p className="registered-empty">{items.length?t('Sin coincidencias.','No matches.'):t('No hay contactos de redes sincronizados. Pulsa Sincronizar Notion para importar los que ya contactaste.','No social contacts synced. Sync Notion to import the people you already contacted.')}</p>}</div></aside>
   <section className="registered-thread" aria-label={t('Detalle del contacto inicial','Initial contact details')}>{current?<><header><button className="registered-back compact-action" aria-label={t('Volver a contactos','Back to contacts')} onClick={()=>setMobileOpen(false)}><ArrowLeft size={18}/></button><span className="registered-avatar">{initials(current.name)}</span><div className="registered-thread-name"><h2>{current.name}</h2><div><span>{current.channel}</span><span>{current.status||t('Contactado','Contacted')}</span></div></div>{current.profileUrl&&<a href={current.profileUrl} target="_blank" rel="noopener noreferrer" className="compact-action" title={t('Abrir perfil','Open profile')} aria-label={t('Abrir perfil de ','Open profile of ')+current.name}><ArrowUpRight size={18}/></a>}</header>
    <div className="registered-timeline"><span className="registered-date">{date(current.date)}</span><div className="registered-event"><span className="registered-so" aria-label="Soluciones Ortegón">SO</span><div><span className="registered-event-label"><MessageSquare size={13}/>{t('Actividad de contacto','Contact activity')}</span><p>{t('Primer contacto realizado por ','Initial outreach via ')}{current.channel}.</p><small>{t('Registrado por el administrador. El texto original del mensaje aún no se ha sincronizado.','Recorded by the administrator. The original message text has not been synced yet.')}</small><footer><Clock3 size={12}/>{t('Envío y lectura sin verificar por Meta','Sending and read status not verified by Meta')}</footer></div></div>
    <div className="registered-integration-note"><WifiOff size={16}/><p>{t('Las respuestas, el historial y el envío desde este panel estarán disponibles al conectar n8n y la cuenta de Meta.','Replies, history and sending from this panel will be available after connecting n8n and the Meta account.')}</p></div>
    {current.notes&&<details className="registered-notes"><summary>{t('Seguimiento del CRM','CRM follow-up')}</summary><p>{current.notes}</p></details>}
    </div><div className="registered-compose"><textarea disabled aria-label={t('Respuesta pendiente de integración','Reply awaiting integration')} placeholder={t('Conecta n8n e Instagram para responder desde aquí','Connect n8n and Instagram to reply here')}/><button className="compact-action" disabled aria-label={t('Envío no disponible','Sending unavailable')} title={t('Integración pendiente','Integration pending')}><Send size={18}/></button></div>
   </>:<div className="registered-empty"><Instagram size={32}/><p>{t('Selecciona un contacto para ver su actividad.','Choose a contact to view their activity.')}</p></div>}</section>
  </div>}
 </div>;
}
