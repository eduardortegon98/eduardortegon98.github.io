import { useEffect, useRef, useState } from 'react';
import { Navigate, useOutletContext } from 'react-router-dom';
import { Search, Save, RefreshCw, X, ChevronLeft, ChevronRight, Settings2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { moduleById } from './modules';
import { readClientModules, readModuleCatalog } from './moduleData';
import { useLanguage } from '../i18n/Language';
import PortalLoading from './PortalLoading';
import './Assignments.css';
const PAGE=20,MODULE_PAGE=25;
export default function Assignments(){
 const state=useOutletContext();
 return state.role==='super_admin'?<AssignmentWorkspace/>:<Navigate to="/panel" replace/>;
}
function AssignmentWorkspace(){
 const {language}=useLanguage(),en=language==='en',t=(es,english)=>en?english:es;
 const [clients,setClients]=useState([]),[search,setSearch]=useState(''),[page,setPage]=useState(0),[total,setTotal]=useState(0);
 const [loading,setLoading]=useState(true),[error,setError]=useState(''),[revision,setRevision]=useState(0),[client,setClient]=useState(null),[notice,setNotice]=useState('');
 const dialog=useRef(null);
 useEffect(()=>{
  let active=true;setLoading(true);setError('');setClients([]);
  const timer=setTimeout(async()=>{
   try{
    let query=supabase.from('portal_profiles').select('id,email',{count:'exact'}).eq('role','client').order('email').order('id');
    if(search.trim())query=query.ilike('email','%'+search.trim().replace(/[\\%_]/g,'\\$&')+'%');
    const result=await query.range(page*PAGE,(page+1)*PAGE-1);
    if(result.error)throw result.error;
    if(active){setClients(result.data);setTotal(result.count);}
   }catch{if(active){setError(t('No pudimos cargar los clientes. Reintenta.','Could not load clients. Try again.'));setTotal(0);}}
   finally{if(active)setLoading(false);}
  },search?250:0);
  return()=>{active=false;clearTimeout(timer);};
 },[search,page,revision,language]);
 useEffect(()=>{if(client&&!dialog.current.open)dialog.current.showModal();else if(!client&&dialog.current.open)dialog.current.close();},[client]);
 return <div className="module-assignments">
  <div className="assignment-toolbar"><label><Search size={17}/><input type="search" aria-label={t('Buscar cliente por correo','Search clients by email')} placeholder={t('Buscar cliente','Search clients')} value={search} onChange={event=>{setSearch(event.target.value);setPage(0);}}/></label><button className="compact-action" disabled={loading} onClick={()=>setRevision(value=>value+1)} title={t('Actualizar','Refresh')} aria-label={t('Actualizar','Refresh')}><RefreshCw size={17}/></button></div>
  <p className="assignment-hint">{t('Elige un cliente y gestiona sus módulos en un solo lugar.','Choose a client and manage their modules in one place.')}</p>
  {error&&<p role="alert" className="assignment-error">{error}</p>}{notice&&<p role="status" className="assignment-notice">{notice}</p>}
  {loading?<PortalLoading compact/>:<div className="assignment-list">{clients.map(item=><article key={item.id}><div className="assignment-client"><span>{item.email.slice(0,1).toUpperCase()}</span><strong>{item.email}</strong></div><button className="assignment-save" onClick={()=>{setNotice('');setClient(item);}}><Settings2 size={16}/>{t('Gestionar módulos','Manage modules')}</button></article>)}{!clients.length&&!error&&<p>{t('No hay clientes que coincidan. El cliente debe registrarse primero.','No matching clients. Clients must register first.')}</p>}</div>}
  <div className="assignment-pagination"><span>{total} {t('clientes','clients')}</span><button className="compact-action" disabled={loading||page===0} onClick={()=>setPage(value=>value-1)} aria-label={t('Página anterior','Previous page')}><ChevronLeft size={17}/></button><span>{page+1} / {Math.max(1,Math.ceil(total/PAGE))}</span><button className="compact-action" disabled={loading||(page+1)*PAGE>=total} onClick={()=>setPage(value=>value+1)} aria-label={t('Página siguiente','Next page')}><ChevronRight size={17}/></button></div>
  <dialog ref={dialog} className="assignment-dialog" onCancel={event=>{event.preventDefault();}} aria-label={t('Asignar módulos','Assign modules')}>{client&&<ModulePicker key={client.id} client={client} close={()=>setClient(null)} onSaved={()=>{setNotice(t('Asignación guardada. El cliente debe recargar su portal.','Assignment saved. The client should refresh their portal.'));setClient(null);}}/>}</dialog>
 </div>;
}
function ModulePicker({client,close,onSaved}){
 const {language}=useLanguage(),en=language==='en',t=(es,english)=>en?english:es;
 const [catalog,setCatalog]=useState([]),[selected,setSelected]=useState(new Set()),[original,setOriginal]=useState(new Set());
 const [loading,setLoading]=useState(true),[pending,setPending]=useState(false),[error,setError]=useState(''),[retry,setRetry]=useState(0);
 const [query,setQuery]=useState(''),[category,setCategory]=useState(''),[selectedOnly,setSelectedOnly]=useState(false),[page,setPage]=useState(0);
 useEffect(()=>{
  let active=true;setLoading(true);setError('');
  Promise.all([readModuleCatalog(),readClientModules(client.id)]).then(([rows,assigned])=>{
   if(!active)return;setCatalog(rows);const ids=new Set(assigned.map(row=>row.module));setSelected(ids);setOriginal(new Set(ids));
  }).catch(()=>{if(active)setError(t('No pudimos cargar el catálogo. Verifica la conexión y ejecuta module-catalog.sql en Supabase.','Could not load the catalog. Check the connection and run module-catalog.sql in Supabase.'));}).finally(()=>{if(active)setLoading(false);});
  return()=>{active=false;};
 },[client.id,retry,language]);
 const name=module=>en?module.name_en:module.name_es;
 const installed=catalog.filter(module=>moduleById.has(module.id));
 const categories=[...new Set(installed.map(module=>module.category))].sort();
 const categoryName=id=>{const known=[...moduleById.values()].find(module=>module.category===id);return known?(known.categoryLabel[language]||known.categoryLabel.es):id;};
 const filtered=installed.filter(module=>(!category||module.category===category)&&(!selectedOnly||selected.has(module.id))&&(name(module)+' '+module.id).toLocaleLowerCase().includes(query.toLocaleLowerCase()));
 const dirty=selected.size!==original.size||[...selected].some(id=>!original.has(id));
 const currentPage=Math.min(page,Math.max(0,Math.ceil(filtered.length/MODULE_PAGE)-1));
 function toggle(id){setSelected(values=>{const next=new Set(values);next.has(id)?next.delete(id):next.add(id);return next;});}
 function batch(add){setSelected(values=>{const next=new Set(values);for(const module of filtered){if(add)next.add(module.id);else next.delete(module.id);}return next;});}
 async function save(){
  setPending(true);setError('');
  try{const result=await supabase.rpc('assign_client_modules',{p_user_id:client.id,p_modules:[...selected]});if(result.error)throw result.error;onSaved();}
  catch{setError(t('No se guardaron los permisos. Revisa la conexión y la migración module-catalog.sql.','Permissions were not saved. Check the connection and module-catalog.sql migration.'));}
  finally{setPending(false);}
 }
 return <div className="module-picker" onKeyDown={event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();if(!pending)close();}}}>
  <header><div><h2>{t('Módulos del cliente','Client modules')}</h2><p>{client.email}</p></div><button className="compact-action" disabled={pending} onClick={close} aria-label={t('Cerrar','Close')} title={t('Cerrar','Close')}><X size={18}/></button></header>
  {error&&<p className="assignment-error" role="alert">{error}<button disabled={pending||loading} onClick={()=>setRetry(value=>value+1)}>{t('Reintentar','Retry')}</button></p>}
  {loading?<PortalLoading compact/>:<>
   <div className="module-picker-filters"><label><Search size={16}/><input type="search" autoFocus aria-label={t('Buscar módulo','Search modules')} placeholder={t('Buscar módulo','Search modules')} value={query} disabled={pending} onChange={event=>{setQuery(event.target.value);setPage(0);}}/></label><select disabled={pending} aria-label={t('Categoría','Category')} value={category} onChange={event=>{setCategory(event.target.value);setPage(0);}}><option value="">{t('Todas las categorías','All categories')}</option>{categories.map(id=><option key={id} value={id}>{categoryName(id)}</option>)}</select></div>
   <div className="module-picker-bulk"><label><input type="checkbox" checked={selectedOnly} disabled={pending} onChange={event=>{setSelectedOnly(event.target.checked);setPage(0);}}/>{t('Solo seleccionados','Selected only')}</label><button disabled={pending||!filtered.length} onClick={()=>batch(true)}>{t('Seleccionar resultados','Select results')} ({filtered.length})</button><button disabled={pending||!filtered.length} onClick={()=>batch(false)}>{t('Quitar resultados','Remove results')}</button></div>
   <div className="module-picker-results">{filtered.slice(currentPage*MODULE_PAGE,(currentPage+1)*MODULE_PAGE).map(module=>{
    const registered=moduleById.get(module.id),Icon=registered.icon;
    return <label key={module.id}><input type="checkbox" disabled={pending} checked={selected.has(module.id)} onChange={()=>toggle(module.id)}/><span className="picker-module-icon"><Icon size={19}/></span><span><strong>{name(module)}</strong><small>{categoryName(module.category)}{registered.tag?' · '+registered.tag:''}</small></span></label>;
   })}{!filtered.length&&<p>{t('No hay módulos que coincidan.','No matching modules.')}</p>}</div>
   {catalog.length>installed.length&&<p className="assignment-hint">{t('Hay módulos del catálogo cuya implementación aún no está desplegada. No se ofrecen para asignación.','Some catalog modules have not been deployed yet. They are not offered for assignment.')}</p>}
   <div className="assignment-pagination"><span>{filtered.length} {t('resultados','results')}</span><button className="compact-action" disabled={pending||currentPage===0} onClick={()=>setPage(currentPage-1)} aria-label={t('Página anterior','Previous page')}><ChevronLeft size={17}/></button><span>{currentPage+1} / {Math.max(1,Math.ceil(filtered.length/MODULE_PAGE))}</span><button className="compact-action" disabled={pending||(currentPage+1)*MODULE_PAGE>=filtered.length} onClick={()=>setPage(currentPage+1)} aria-label={t('Página siguiente','Next page')}><ChevronRight size={17}/></button></div>
   <footer><div><strong>{selected.size} {t('seleccionados','selected')}</strong><button disabled={pending||!selected.size} onClick={()=>setSelected(new Set())}>{t('Quitar todos','Remove all')}</button></div><button className="assignment-save" disabled={pending||!dirty||!catalog.length} onClick={save}><Save size={16}/>{pending?t('Guardando…','Saving…'):t('Guardar asignación','Save assignment')}</button></footer>
  </>}
 </div>;
}
