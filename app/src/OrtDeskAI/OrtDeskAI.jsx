import ModuleBrand from '../Portal/ModuleBrand';
import { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { BrainCircuit, Upload, FileText, Image, Search, Plus, X, Check, Trash2, Database, ShieldCheck, Clock3, HardDrive, Sparkles, FolderOpen, Download } from 'lucide-react';
import { useLanguage } from '../i18n/Language';
import PortalLoading from '../Portal/PortalLoading';
import { readSources,writeSources,removeSource } from './localKnowledge';
import './OrtDeskAI.css';
const MAX_FILE=10*1024*1024,MAX_TOTAL=50*1024*1024;
const accepted=['pdf','docx','txt','md','csv','json','png','jpg','jpeg','webp'];
const categories=[{id:'business',es:'Negocio',en:'Business'},{id:'products',es:'Productos y servicios',en:'Products and services'},{id:'support',es:'Soporte',en:'Support'},{id:'policies',es:'Políticas',en:'Policies'},{id:'other',es:'Otros',en:'Other'}];
const bytes=value=>value<1024*1024?Math.ceil(value/1024)+' KB':(value/(1024*1024)).toFixed(1)+' MB';
export default function OrtDeskAI(){
 const {user}=useOutletContext();
 return <KnowledgeWorkspace key={user.id} owner={user.id}/>;
}
function KnowledgeWorkspace({owner}){
 const {language}=useLanguage(),en=language==='en',t=(es,english)=>en?english:es;
 const [sources,setSources]=useState([]),[loading,setLoading]=useState(true),[busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState(''),[retry,setRetry]=useState(0);
 const [query,setQuery]=useState(''),[category,setCategory]=useState(''),[filter,setFilter]=useState(''),[limit,setLimit]=useState(25);
 const [mode,setMode]=useState(null),[selected,setSelected]=useState(null),[title,setTitle]=useState(''),[content,setContent]=useState(''),[origin,setOrigin]=useState('own'),[originName,setOriginName]=useState(''),[sourceCategory,setSourceCategory]=useState('business');
 const fileInput=useRef(null),dialog=useRef(null),[previewUrl,setPreviewUrl]=useState('');
 const totalBytes=sources.reduce((sum,source)=>sum+source.size,0),reviewed=sources.filter(source=>source.reviewed).length;
 useEffect(()=>{let active=true;setLoading(true);setError('');readSources(owner).then(items=>{if(active)setSources(items);}).catch(()=>{if(active)setError(t('No pudimos abrir el almacenamiento local. Reintenta o permite el almacenamiento del navegador.','Could not open local storage. Retry or allow browser storage.'));}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};},[owner,retry,language]);
 useEffect(()=>{const el=dialog.current;if(mode&&!el.open)el.showModal();else if(!mode&&el.open)el.close();},[mode]);
 useEffect(()=>{if(!selected?.blob){setPreviewUrl('');return;}const url=URL.createObjectURL(selected.blob);setPreviewUrl(url);return()=>URL.revokeObjectURL(url);},[selected]);
 async function persist(items,message){
  setBusy(true);setError('');setNotice('');
  try{await writeSources(owner,items);setSources(current=>{const changes=new Map(items.map(item=>[item.id,item]));return [...current.map(item=>changes.get(item.id)||item),...items.filter(item=>!current.some(old=>old.id===item.id))];});setNotice(message);return true;}
  catch{setError(t('No pudimos guardar. Revisa el espacio disponible y los permisos del navegador.','Could not save. Check available space and browser storage permissions.'));return false;}
  finally{setBusy(false);}
 }
 async function filesChosen(files){
  if(busy||loading)return;
  const items=[],issues=[];let used=totalBytes;
  for(const file of files){
   const ext=file.name.split('.').at(-1).toLowerCase();
   if(!accepted.includes(ext)||file.size>MAX_FILE||file.size===0){issues.push(file.name);continue;}
   if(used+file.size>MAX_TOTAL){issues.push(file.name);continue;}
   if([...sources,...items].some(source=>source.title===file.name&&source.size===file.size)){issues.push(file.name);continue;}
   items.push({id:crypto.randomUUID(),title:file.name,kind:['png','jpg','jpeg','webp'].includes(ext)?'image':'document',category:'business',origin:'own',originName:'',content:'',blob:file,size:file.size,reviewed:false,createdAt:new Date().toISOString()});used+=file.size;
  }
  if(items.length)await persist(items,t('Archivos guardados como borradores locales. Ortex todavía no los consulta.','Files saved as local drafts. Ortex does not use them yet.'));
  if(issues.length)setError(t('Se omitieron archivos vacíos, duplicados, no admitidos o fuera del límite: ','Empty, duplicate, unsupported or oversized files were skipped: ')+issues.join(', '));
  fileInput.current.value='';
 }
 function openText(){setError('');setSelected(null);setTitle('');setContent('');setOrigin('own');setOriginName('');setSourceCategory('business');setMode('text');}
 function openSource(source){setError('');setSelected(source);setSourceCategory(source.category);setMode('detail');}
 function close(){if(!busy){setMode(null);setSelected(null);}}
 async function saveText(event){
  event.preventDefault();
  if(!title.trim()||!content.trim()||(origin==='ai'&&!originName.trim()))return;
  const size=new Blob([content]).size;if(totalBytes+size>MAX_TOTAL){setError(t('Se alcanzó el límite local de 50 MB.','The 50 MB local limit was reached.'));return;}
  if(await persist([{id:crypto.randomUUID(),title:title.trim(),content:content.trim(),kind:'text',category:sourceCategory,origin,originName:originName.trim(),size,reviewed:false,createdAt:new Date().toISOString()}],t('Texto añadido como borrador local.','Text added as a local draft.'))){setMode(null);}
 }
 async function review(){
  const updated={...selected,category:sourceCategory,reviewed:!selected.reviewed};
  if(await persist([updated],t('Revisión actualizada. La indexación sigue pendiente.','Review updated. Indexing is still pending.')))setSelected(updated);
 }
 async function deleteSelected(){
  setBusy(true);setError('');
  try{await removeSource(owner,selected.id);setSources(items=>items.filter(item=>item.id!==selected.id));setMode(null);setSelected(null);setNotice(t('Fuente eliminada del navegador.','Source removed from this browser.'));}
  catch{setError(t('No pudimos eliminar la fuente.','Could not remove the source.'));}
  finally{setBusy(false);}
 }
 const categoryLabel=id=>{const value=categories.find(item=>item.id===id);return value?(en?value.en:value.es):id;};
 const visible=[...sources].sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).filter(source=>(!category||source.category===category)&&(!filter||(filter==='reviewed'?source.reviewed:!source.reviewed))&&(source.title+' '+source.originName).toLocaleLowerCase().includes(query.toLocaleLowerCase()));
 return <div className="ortdesk-ai">
  <header className="knowledge-heading"><div className="knowledge-brand"><span><BrainCircuit size={26}/></span><div><h1><ModuleBrand id="ortdesk_ai"/><small>Beta</small></h1><p>{t('El conocimiento detrás de Ortex.','The knowledge behind Ortex.')}</p></div></div><span className="knowledge-local"><HardDrive size={14}/>{t('Borradores locales','Local drafts')}</span></header>
  <div className="knowledge-summary"><article><Database size={18}/><span>{t('Fuentes','Sources')}</span><strong>{sources.length}</strong></article><article><ShieldCheck size={18}/><span>{t('Revisadas','Reviewed')}</span><strong>{reviewed}</strong></article><article><Clock3 size={18}/><span>{t('Sin indexar','Not indexed')}</span><strong>{sources.length}</strong></article></div>
  <section className="knowledge-storage-note"><HardDrive size={17}/><p>{t('Guardado solo en este navegador y dispositivo. La conexión al almacenamiento de la empresa y a los embeddings está pendiente. Añadir fuentes no entrena el modelo.','Saved only in this browser and device. Company storage and embeddings are not connected yet. Adding sources does not train the model.')}</p></section>
  {error&&<p className="knowledge-alert" role="alert">{error}<button onClick={()=>setRetry(value=>value+1)} disabled={busy||loading}>{t('Reintentar','Retry')}</button></p>}{notice&&<p className="knowledge-notice" role="status">{notice}</p>}
  <div className="knowledge-layout"><section className="knowledge-library">
   <div className="knowledge-library-toolbar"><h2>{t('Biblioteca de conocimiento','Knowledge library')}</h2><div><button className="knowledge-secondary" disabled={busy||loading} onClick={openText}><Plus size={16}/>{t('Añadir texto','Add text')}</button><button className="knowledge-primary" disabled={busy||loading} onClick={()=>fileInput.current.click()}><Upload size={16}/>{t('Añadir archivos','Add files')}</button></div></div>
   <input ref={fileInput} type="file" multiple accept=".pdf,.docx,.txt,.md,.csv,.json,.png,.jpg,.jpeg,.webp" hidden onChange={event=>filesChosen([...event.target.files])}/>
   <div className="knowledge-filters"><label><Search size={16}/><input type="search" placeholder={t('Buscar fuentes','Search sources')} aria-label={t('Buscar fuentes','Search sources')} value={query} onChange={event=>{setQuery(event.target.value);setLimit(25);}}/></label><select aria-label={t('Categoría','Category')} value={category} onChange={event=>{setCategory(event.target.value);setLimit(25);}}><option value="">{t('Todas las categorías','All categories')}</option>{categories.map(item=><option key={item.id} value={item.id}>{en?item.en:item.es}</option>)}</select><select aria-label={t('Estado de revisión','Review status')} value={filter} onChange={event=>{setFilter(event.target.value);setLimit(25);}}><option value="">{t('Todos los estados','All statuses')}</option><option value="reviewed">{t('Revisadas','Reviewed')}</option><option value="pending">{t('Sin revisar','Not reviewed')}</option></select></div>
   {loading?<PortalLoading compact/>:<div className="knowledge-sources">{visible.slice(0,limit).map(source=><button key={source.id} onClick={()=>openSource(source)} className="knowledge-source"><span className={'knowledge-source-icon '+source.kind}>{source.kind==='image'?<Image size={21}/>:source.origin==='ai'?<Sparkles size={21}/>:<FileText size={21}/>}</span><span className="knowledge-source-copy"><strong>{source.title}</strong><small>{categoryLabel(source.category)} · {bytes(source.size)} · {source.origin==='ai'?source.originName:t('Fuente propia','Own source')}</small></span><span className={'knowledge-review '+(source.reviewed?'reviewed':'')}>{source.reviewed?<Check size={12}/>:<Clock3 size={12}/>} {source.reviewed?t('Revisada','Reviewed'):t('Borrador','Draft')}</span></button>)}{!visible.length&&<div className="knowledge-empty"><FolderOpen size={38}/><h3>{sources.length?t('Sin coincidencias','No matches'):t('Dale contexto a Ortex','Give Ortex context')}</h3><p>{t('PDFs, documentos, imágenes o textos. Empieza por tus servicios, preguntas frecuentes y políticas.','PDFs, documents, images or text. Start with your services, FAQs and policies.')}</p></div>}</div>}
   {visible.length>limit&&<button className="knowledge-secondary knowledge-more" onClick={()=>setLimit(value=>value+25)}>{t('Ver más fuentes','Show more sources')}</button>}
   <footer className="knowledge-library-footer"><span>{bytes(totalBytes)} / 50 MB</span><span>{t('Máx. 10 MB por archivo','Max. 10 MB per file')}</span></footer>
  </section><aside className="knowledge-roadmap"><div><BrainCircuit size={20}/><h2>{t('De fuente a respuesta','From source to answer')}</h2></div><ol><li><span>1</span><div><strong>{t('Añadir conocimiento','Add knowledge')}</strong><p>{t('Archivos o texto propio y de otras IA.','Files or text from you and other AI tools.')}</p></div></li><li><span>2</span><div><strong>{t('Revisar el contenido','Review content')}</strong><p>{t('Comprueba su vigencia y exactitud.','Check accuracy and whether it is up to date.')}</p></div></li><li className="pending"><span>3</span><div><strong>{t('Extraer e indexar','Extract and index')}</strong><p>{t('Pendiente · Lectura de archivos, OCR y embeddings.','Pending · File extraction, OCR and embeddings.')}</p></div></li><li className="pending"><span>4</span><div><strong>{t('Consultar con Ortex','Ask Ortex')}</strong><p>{t('Pendiente · Respuestas con citas de tus fuentes.','Pending · Answers citing your sources.')}</p></div></li></ol><div className="knowledge-ai-note"><Sparkles size={17}/><p>{t('El contenido generado por otras IA se registra con su origen y requiere revisión.','Content generated by other AI tools records its origin and requires review.')}</p></div></aside></div>
  <dialog ref={dialog} className="knowledge-dialog" onCancel={event=>{if(busy)event.preventDefault();else{setMode(null);setSelected(null);}}} onClose={()=>{setMode(null);setSelected(null);}} aria-label={mode==='text'?t('Añadir conocimiento','Add knowledge'):t('Detalle de fuente','Source details')}>
   <header><h2>{mode==='text'?t('Añadir conocimiento','Add knowledge'):selected?.title}</h2><button className="compact-action" disabled={busy} onClick={close} aria-label={t('Cerrar','Close')}><X size={18}/></button></header>
   {error&&mode&&<p className="knowledge-alert" role="alert">{error}</p>}
   {mode==='text'&&<form onSubmit={saveText}><label>{t('Título','Title')}<input autoFocus required maxLength={150} value={title} disabled={busy} onChange={event=>setTitle(event.target.value)}/></label><div className="knowledge-dialog-fields"><label>{t('Origen','Origin')}<select disabled={busy} value={origin} onChange={event=>setOrigin(event.target.value)}><option value="own">{t('Conocimiento propio','My own knowledge')}</option><option value="ai">{t('Otra IA','Another AI')}</option></select></label><label>{t('Categoría','Category')}<select disabled={busy} value={sourceCategory} onChange={event=>setSourceCategory(event.target.value)}>{categories.map(item=><option key={item.id} value={item.id}>{en?item.en:item.es}</option>)}</select></label></div>{origin==='ai'&&<label>{t('IA de origen','Source AI')}<input required maxLength={100} placeholder="ChatGPT, Claude, Gemini…" disabled={busy} value={originName} onChange={event=>setOriginName(event.target.value)}/></label>}<label>{t('Contenido','Content')}<textarea required maxLength={20000} rows={8} disabled={busy} value={content} onChange={event=>setContent(event.target.value)}/></label><small>{content.length.toLocaleString()} / 20.000</small><footer><button className="knowledge-primary" disabled={busy} type="submit"><Plus size={16}/>{busy?t('Guardando…','Saving…'):t('Guardar borrador','Save draft')}</button></footer></form>}
   {mode==='detail'&&selected&&<div className="knowledge-detail"><span className="knowledge-local"><HardDrive size={13}/>{t('Local · Sin indexar','Local · Not indexed')}</span><label>{t('Categoría','Category')}<select disabled={busy} value={sourceCategory} onChange={event=>setSourceCategory(event.target.value)}>{categories.map(item=><option key={item.id} value={item.id}>{en?item.en:item.es}</option>)}</select></label>{selected.origin==='ai'&&<p>{t('Origen: ','Origin: ')}{selected.originName}</p>}{selected.kind==='image'&&previewUrl&&<img src={previewUrl} alt={selected.title} loading="lazy"/>}{selected.content?<pre>{selected.content}</pre>:<p>{t('Archivo conservado como borrador. Aún no se ha extraído su contenido.','File saved as a draft. Its content has not been extracted yet.')}</p>}{previewUrl&&<a className="knowledge-secondary" href={previewUrl} download={selected.title}><Download size={15}/>{t('Descargar archivo','Download file')}</a>}<footer><button className="knowledge-delete" disabled={busy} onClick={deleteSelected}><Trash2 size={15}/>{t('Eliminar','Delete')}</button><button className="knowledge-primary" disabled={busy} onClick={review}><Check size={15}/>{selected.reviewed?t('Volver a borrador','Mark as draft'):t('Marcar como revisada','Mark as reviewed')}</button></footer></div>}
  </dialog>
 </div>;
}
