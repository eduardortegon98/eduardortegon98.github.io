import { useEffect, useState } from 'react';
import { Navigate, useOutletContext } from 'react-router-dom';
import { Search, MessagesSquare, PawPrint, Save, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../i18n/Language';
import PortalLoading from './PortalLoading';
import './Assignments.css';
export default function Assignments(){
 const state=useOutletContext();
 return state.role==='super_admin'?<AssignmentWorkspace/>:<Navigate to="/panel" replace/>;
}
function AssignmentWorkspace(){
 const {language}=useLanguage(),en=language==='en';
 const t=(es,english)=>en?english:es;
 const [clients,setClients]=useState([]),[saved,setSaved]=useState({}),[drafts,setDrafts]=useState({});
 const [search,setSearch]=useState(''),[loading,setLoading]=useState(true),[error,setError]=useState(''),[notice,setNotice]=useState(''),[pending,setPending]=useState(null),[revision,setRevision]=useState(0);
 useEffect(()=>{
  let active=true;setLoading(true);setError('');
  Promise.all([
   supabase.from('portal_profiles').select('id,email').eq('role','client').order('email'),
   supabase.from('portal_module_assignments').select('user_id,module')
  ]).then(([profiles,assignments])=>{
   if(profiles.error||assignments.error)throw new Error('configuration');
   if(!active)return;
   const values={};for(const row of assignments.data)values[row.user_id]=[...(values[row.user_id]||[]),row.module];
   setClients(profiles.data);setSaved(values);setDrafts(values);
  }).catch(()=>{if(active)setError(t('No pudimos cargar las asignaciones. Verifica la conexión y ejecuta module-assignments.sql en Supabase.','Could not load assignments. Check the connection and run module-assignments.sql in Supabase.'));}).finally(()=>{if(active)setLoading(false);});
  return()=>{active=false;};
 },[revision,language]);
 function toggle(id,module){setDrafts(all=>{const selected=all[id]||[];return {...all,[id]:selected.includes(module)?selected.filter(value=>value!==module):[...selected,module]};});setNotice('');}
 async function save(client){
  setPending(client.id);setError('');setNotice('');
  const modules=[...(drafts[client.id]||[])];
  try{
   const result=await supabase.rpc('assign_client_modules',{p_user_id:client.id,p_modules:modules});
   if(result.error)throw result.error;
   setSaved(all=>({...all,[client.id]:modules}));
   setNotice(t('Asignación guardada. El cliente verá sus módulos al volver a entrar o recargar el portal.','Assignment saved. The client will see their modules when signing in again or refreshing the portal.'));
  }catch{setError(t('No se guardaron los permisos. Verifica la conexión, tu rol administrador y la migración module-assignments.sql.','Permissions were not saved. Check your connection, administrator role and module-assignments.sql migration.'));}
  finally{setPending(null);}
 }
 const visible=clients.filter(client=>client.email.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
 return <div className="module-assignments">
  <div className="assignment-toolbar"><label><Search size={17}/><input type="search" aria-label={t('Buscar cliente por correo','Search clients by email')} placeholder={t('Buscar cliente','Search clients')} value={search} onChange={event=>setSearch(event.target.value)}/></label><button className="compact-action" disabled={loading||!!pending} onClick={()=>setRevision(value=>value+1)} title={t('Actualizar','Refresh')} aria-label={t('Actualizar','Refresh')}><RefreshCw size={17}/></button></div>
  <p className="assignment-hint">{t('Selecciona los módulos para cada cliente y guarda. Mensajes es una demo; Arturito está en beta.','Choose each client’s modules and save. Messages is a demo; Arturito is in beta.')}</p>
  {error&&<p role="alert" className="assignment-error">{error}</p>}{notice&&<p role="status" className="assignment-notice">{notice}</p>}
  {loading?<PortalLoading compact/>:<div className="assignment-list">{visible.map(client=>{
   const selected=drafts[client.id]||[],original=saved[client.id]||[];
   const dirty=selected.length!==original.length||selected.some(value=>!original.includes(value));
   return <article key={client.id}><div className="assignment-client"><span>{client.email.slice(0,1).toUpperCase()}</span><strong>{client.email}</strong></div><div className="assignment-options">{[{id:'messages',label:t('Mensajes · Demo','Messages · Demo'),icon:MessagesSquare},{id:'arturito',label:'Arturito · Beta',icon:PawPrint}].map(module=><label key={module.id}><input type="checkbox" checked={selected.includes(module.id)} disabled={!!pending} onChange={()=>toggle(client.id,module.id)}/><module.icon size={17}/>{module.label}</label>)}</div><button className="assignment-save" disabled={!dirty||!!pending} onClick={()=>save(client)}><Save size={16}/>{pending===client.id?t('Guardando…','Saving…'):t('Guardar','Save')}</button></article>;
  })}{!visible.length&&!error&&<p>{t('No hay clientes que coincidan. El cliente debe registrarse primero.','No matching clients. Clients must register first.')}</p>}</div>}
 </div>;
}
