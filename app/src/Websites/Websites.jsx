import ModuleBrand from '../Portal/ModuleBrand';
import { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Globe2, Plus, Search, RefreshCw, Pencil, ArrowUpRight, Github, WifiOff, X, Save, Archive, RotateCcw, ChevronLeft, ChevronRight, CheckCircle2, Clock3 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../i18n/Language';
import PortalLoading from '../Portal/PortalLoading';
import './Websites.css';
const PAGE=12;
const designs=[{id:'draft',es:'Borrador',en:'Draft'},{id:'review',es:'En revisión',en:'In review'},{id:'approved',es:'Aprobado',en:'Approved'}];
const actions=[{id:'none',es:'Sin solicitud',en:'No request'},{id:'publish',es:'Publicar',en:'Publish'},{id:'pause',es:'Suspender',en:'Suspend'},{id:'resume',es:'Reactivar',en:'Reactivate'}];
export default function Websites(){
 const state=useOutletContext();return <WebsiteWorkspace key={state.user.id+state.role} state={state}/>;
}
function WebsiteWorkspace({state}){
 const {language}=useLanguage(),en=language==='en',t=(es,english)=>en?english:es,admin=state.role==='super_admin';
 const [rows,setRows]=useState([]),[total,setTotal]=useState(0),[counts,setCounts]=useState(null),[loading,setLoading]=useState(true),[error,setError]=useState(''),[notice,setNotice]=useState('');
 const [search,setSearch]=useState(''),[status,setStatus]=useState(''),[archived,setArchived]=useState(false),[page,setPage]=useState(0),[revision,setRevision]=useState(0),[editing,setEditing]=useState(null),[working,setWorking]=useState(null);
 const dialog=useRef(null);
 useEffect(()=>{
  let active=true;setLoading(true);setError('');setRows([]);
  const timer=setTimeout(async()=>{
   try{
    let query=supabase.from('portal_websites').select('id,owner_id,name,domain,repo_url,design_status,requested_action,archived,updated_at,portal_profiles(email)',{count:'exact'}).eq('archived',admin?archived:false).order('created_at',{ascending:false}).order('id');
    if(!admin)query=query.eq('owner_id',state.user.id);
    if(search.trim())query=query.ilike('name','%'+search.trim().replace(/[\\%_]/g,'\\$&')+'%');
    if(status)query=query.eq('design_status',status);
    const result=await query.range(page*PAGE,(page+1)*PAGE-1);if(result.error)throw result.error;
    if(active){setRows(result.data);setTotal(result.count);}
   }catch{if(active){setError(t('No pudimos cargar las webs. Verifica la conexión y ejecuta websites.sql en Supabase.','Could not load websites. Check your connection and run websites.sql in Supabase.'));setTotal(0);}}
   finally{if(active)setLoading(false);}
  },search?250:0);
  return()=>{active=false;clearTimeout(timer);};
 },[state.user.id,admin,search,status,archived,page,revision,language]);
 useEffect(()=>{
  let active=true;setCounts(null);
  const count=(field,value)=>{let query=supabase.from('portal_websites').select('id',{count:'exact',head:true}).eq('archived',false);if(!admin)query=query.eq('owner_id',state.user.id);return field?query.eq(field,value):query;};
  Promise.all([count(),count('design_status','approved')]).then(results=>{if(active&&results.every(result=>!result.error))setCounts(results.map(result=>result.count));}).catch(()=>{});
  return()=>{active=false;};
 },[state.user.id,admin,revision]);
 useEffect(()=>{if(editing&&!dialog.current.open)dialog.current.showModal();else if(!editing&&dialog.current.open)dialog.current.close();},[editing]);
 async function archive(row){
  if(!window.confirm(row.archived?t('¿Restaurar el registro de esta web?','Restore this website record?'):t('¿Archivar este registro? La web y el repositorio no se modifican.','Archive this record? The live website and repository are unchanged.')))return;
  setWorking(row.id);setError('');setNotice('');
  try{const result=await supabase.rpc('archive_portal_website',{p_id:row.id,p_archived:!row.archived});if(result.error)throw result.error;setNotice(t('Registro actualizado. No se realizó ningún cambio en el hosting.','Record updated. No hosting changes were made.'));setRevision(value=>value+1);}
  catch{setError(t('No pudimos actualizar el registro.','Could not update the record.'));}
  finally{setWorking(null);}
 }
 return <div className="websites-workspace"><ModuleBrand id="websites" as="h1" className="module-brand-heading"/>
  <div className="websites-toolbar"><label><Search size={17}/><input type="search" placeholder={t('Buscar web por nombre','Find website by name')} aria-label={t('Buscar web','Search websites')} value={search} onChange={event=>{setSearch(event.target.value);setPage(0);}}/></label><select aria-label={t('Estado del diseño','Design status')} value={status} onChange={event=>{setStatus(event.target.value);setPage(0);}}><option value="">{t('Todos los diseños','All designs')}</option>{designs.map(item=><option key={item.id} value={item.id}>{en?item.en:item.es}</option>)}</select>{admin&&<select aria-label={t('Registros archivados','Archived records')} value={String(archived)} onChange={event=>{setArchived(event.target.value==='true');setPage(0);}}><option value="false">{t('En gestión','Managed')}</option><option value="true">{t('Archivadas','Archived')}</option></select>}<button className="compact-action" disabled={loading||!!working} onClick={()=>setRevision(value=>value+1)} title={t('Actualizar','Refresh')} aria-label={t('Actualizar','Refresh')}><RefreshCw size={17}/></button>{admin&&<button className="websites-primary" onClick={()=>setEditing({})}><Plus size={16}/>{t('Nueva web','New website')}</button>}</div>
  <div className="websites-stats"><article><Globe2 size={19}/><span>{t('Webs en gestión','Managed websites')}</span><strong>{counts?.[0]??'—'}</strong></article><article><CheckCircle2 size={19}/><span>{t('Diseños aprobados','Approved designs')}</span><strong>{counts?.[1]??'—'}</strong></article><article><WifiOff size={19}/><span>{t('Conexión de hosting','Hosting connection')}</span><strong className="websites-pending">{t('Pendiente','Pending')}</strong></article></div>
  <div className="websites-integration"><WifiOff size={17}/><p>{t('Dominio y repositorio son referencias. Publicar, suspender o reactivar registra una solicitud; aún no ejecuta cambios en GitHub, DNS o hosting.','Domain and repository are references. Publish, suspend or reactivate records a request; GitHub, DNS and hosting changes are not connected yet.')}</p></div>
  {error&&<p className="websites-error" role="alert">{error}</p>}{notice&&<p className="websites-notice" role="status">{notice}</p>}
  {loading?<PortalLoading compact/>:<div className="websites-grid">{rows.map(row=>{
   const design=designs.find(item=>item.id===row.design_status),action=actions.find(item=>item.id===row.requested_action);
   return <article key={row.id} className="website-card"><header><span className="website-icon"><Globe2 size={25}/></span><div><h2>{row.name}</h2><p>{row.portal_profiles?.email||t('Cliente','Client')}</p></div>{admin&&!row.archived&&<button className="compact-action" onClick={()=>setEditing(row)} title={t('Editar web','Edit website')} aria-label={t('Editar web ','Edit website ')+row.name}><Pencil size={16}/></button>}</header><div className="website-design"><span className={row.design_status}>{en?design?.en:design?.es}</span><small>{row.archived?t('Archivada','Archived'):t('Diseño','Design')}</small></div><dl><div><dt>{t('Dominio','Domain')}</dt><dd>{row.domain||t('Sin asignar','Not assigned')}</dd></div><div><dt>{t('Publicación real','Live publication')}</dt><dd className="website-disconnected"><WifiOff size={12}/>{t('Sin verificar','Not verified')}</dd></div></dl>{row.requested_action!=='none'&&<div className="website-request"><Clock3 size={14}/>{en?action?.en:action?.es} · {t('Solicitud pendiente de conexión','Request awaiting integration')}</div>}<footer>{row.domain&&<a href={'https://'+row.domain} target="_blank" rel="noopener noreferrer" className="websites-secondary"><ArrowUpRight size={15}/>{t('Abrir dominio','Open domain')}</a>}{row.repo_url&&admin&&<a href={row.repo_url} target="_blank" rel="noopener noreferrer" className="compact-action" aria-label={t('Abrir repositorio','Open repository')} title={t('Repositorio','Repository')}><Github size={17}/></a>}{admin&&<button className="compact-action website-archive" disabled={!!working} onClick={()=>archive(row)} title={row.archived?t('Restaurar registro','Restore record'):t('Archivar registro','Archive record')} aria-label={row.archived?t('Restaurar registro','Restore record'):t('Archivar registro','Archive record')}>{row.archived?<RotateCcw size={16}/>:<Archive size={16}/>}</button>}</footer></article>;
  })}{!rows.length&&!error&&<div className="websites-empty"><Globe2 size={38}/><h2>{t('Tus webs, en un solo lugar','Your websites, in one place')}</h2><p>{admin?t('Registra una web y vincúlala con su cliente.','Register a website and link it to its client.'):t('Aquí aparecerán las webs que tu administrador vincule a tu cuenta.','Websites linked to your account by your administrator will appear here.')}</p></div>}</div>}
  <div className="websites-pagination"><span>{total} {t('webs','websites')}</span><button className="compact-action" disabled={loading||page===0} onClick={()=>setPage(value=>value-1)} aria-label={t('Página anterior','Previous page')}><ChevronLeft size={17}/></button><span>{page+1} / {Math.max(1,Math.ceil(total/PAGE))}</span><button className="compact-action" disabled={loading||(page+1)*PAGE>=total} onClick={()=>setPage(value=>value+1)} aria-label={t('Página siguiente','Next page')}><ChevronRight size={17}/></button></div>
  <dialog ref={dialog} className="website-dialog" aria-label={t('Gestionar web','Manage website')} onCancel={event=>event.preventDefault()}>{editing&&<WebsiteEditor key={editing.id||'new'} website={editing} close={()=>setEditing(null)} saved={()=>{setEditing(null);setRevision(value=>value+1);setNotice(t('Web guardada en Supabase. Las acciones de publicación siguen pendientes de conexión.','Website saved in Supabase. Publication actions still await integration.'));}}/>}</dialog>
 </div>;
}
function WebsiteEditor({website,close,saved}){
 const {language}=useLanguage(),en=language==='en',t=(es,english)=>en?english:es;
 const [name,setName]=useState(website.name||''),[domain,setDomain]=useState(website.domain||''),[repo,setRepo]=useState(website.repo_url||''),[design,setDesign]=useState(website.design_status||'draft'),[action,setAction]=useState(website.requested_action||'none');
 const [client,setClient]=useState(website.owner_id?{id:website.owner_id,email:website.portal_profiles?.email||''}:null),[query,setQuery]=useState(''),[clients,setClients]=useState([]),[finding,setFinding]=useState(false),[clientError,setClientError]=useState(''),[error,setError]=useState(''),[pending,setPending]=useState(false);
 useEffect(()=>{
  let active=true;setFinding(true);setClientError('');
  const timer=setTimeout(async()=>{
   try{let request=supabase.from('portal_profiles').select('id,email').eq('role','client').order('email').order('id').limit(20);
    if(query.trim())request=request.ilike('email','%'+query.trim().replace(/[\\%_]/g,'\\$&')+'%');
    const result=await request;if(result.error)throw result.error;if(active)setClients(result.data);
   }catch{if(active)setClientError(t('No pudimos buscar clientes.','Could not search clients.'));}
   finally{if(active)setFinding(false);}
  },250);
  return()=>{active=false;clearTimeout(timer);};
 },[query,language]);
 async function submit(event){
  event.preventDefault();setError('');
  const normalizedDomain=domain.trim().toLowerCase(),repoUrl=repo.trim();
  if(!client){setError(t('Selecciona un cliente registrado.','Select a registered client.'));return;}
  if(normalizedDomain&&!/^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/.test(normalizedDomain)){setError(t('Escribe solo el dominio, sin https ni rutas.','Enter only the domain, without https or paths.'));return;}
  if(repoUrl&&!/^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/.test(repoUrl)){setError(t('Usa la URL del repositorio: https://github.com/usuario/repo','Use the repository URL: https://github.com/owner/repo'));return;}
  setPending(true);
  try{const result=await supabase.rpc('save_portal_website',{p_id:website.id||null,p_owner_id:client.id,p_name:name.trim(),p_domain:normalizedDomain,p_repo_url:repoUrl,p_design_status:design,p_requested_action:action});if(result.error)throw result.error;saved();}
  catch{setError(t('No pudimos guardar. Revisa la conexión y ejecuta websites.sql en Supabase.','Could not save. Check your connection and run websites.sql in Supabase.'));}
  finally{setPending(false);}
 }
 return <form className="website-editor" onSubmit={submit} onKeyDown={event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();if(!pending)close();}}}><header><h2>{website.id?t('Editar web','Edit website'):t('Nueva web','New website')}</h2><button type="button" className="compact-action" disabled={pending} onClick={close} aria-label={t('Cerrar','Close')}><X size={18}/></button></header>
  {error&&<p className="websites-error" role="alert">{error}</p>}
  <label>{t('Nombre del proyecto','Project name')}<input required autoFocus maxLength={150} value={name} disabled={pending} onChange={event=>setName(event.target.value)}/></label>
  <fieldset><legend>{t('Cliente propietario','Client owner')}</legend>{client&&<div className="website-selected-client"><CheckCircle2 size={15}/><strong>{client.email||client.id}</strong><button type="button" disabled={pending} onClick={()=>setClient(null)}>{t('Cambiar','Change')}</button></div>}{!client&&<><label>{t('Buscar por correo','Search by email')}<input type="search" value={query} disabled={pending} onChange={event=>setQuery(event.target.value)}/></label>{clientError&&<p role="alert">{clientError}</p>}<div className="website-client-results">{finding?<small>{t('Buscando…','Searching…')}</small>:clients.map(item=><button key={item.id} type="button" disabled={pending} onClick={()=>setClient(item)}>{item.email}</button>)}{!finding&&!clients.length&&!clientError&&<small>{t('Sin coincidencias. El cliente debe registrarse primero.','No matches. The client must register first.')}</small>}</div><small>{t('Hasta 20 resultados. Escribe el correo para encontrar al cliente.','Up to 20 results. Enter the email to find your client.')}</small></>}</fieldset>
  <div className="website-editor-fields"><label>{t('Dominio','Domain')}<input maxLength={253} placeholder="cliente.com" value={domain} disabled={pending} onChange={event=>setDomain(event.target.value)}/></label><label>{t('Diseño','Design')}<select value={design} disabled={pending} onChange={event=>{setDesign(event.target.value);if(event.target.value!=='approved'&&action==='publish')setAction('none');}}>{designs.map(item=><option key={item.id} value={item.id}>{en?item.en:item.es}</option>)}</select></label></div>
  <label>{t('Repositorio GitHub','GitHub repository')}<input type="url" maxLength={300} placeholder="https://github.com/usuario/repo" value={repo} disabled={pending} onChange={event=>setRepo(event.target.value)}/></label>
  <label>{t('Acción solicitada · Sin ejecución automática','Requested action · No automatic execution')}<select value={action} disabled={pending} onChange={event=>setAction(event.target.value)}>{actions.map(item=><option key={item.id} value={item.id} disabled={item.id==='publish'&&design!=='approved'}>{en?item.en:item.es}</option>)}</select></label>
  <p className="website-editor-note">{t('Registrar la web no habilita el producto al cliente: asígnale Websites desde Assignments. Los dominios requieren conexión DNS y HTTPS posterior.','Registering a website does not grant product access: assign Websites through Assignments. Domains need DNS and HTTPS setup later.')}</p>
  <footer><button className="websites-primary" type="submit" disabled={pending||!client}><Save size={16}/>{pending?t('Guardando…','Saving…'):t('Guardar web','Save website')}</button></footer>
 </form>;
}
