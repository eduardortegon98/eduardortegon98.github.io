import { useEffect, useMemo, useRef, useState } from 'react';
import { Star, Info, X, Search, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CONTACT_STAGES, loadQualifiedContacts } from './contactStages';
import './QualifiedContacts.css';
import PortalLoading from './PortalLoading';

function Rating({ stage, en }) {
  return <span className={'contact-rating contact-stage-' + stage} aria-label={(en ? 'Contact ' : 'Contacto ') + stage + ' / 5'}>
    <span aria-hidden="true">{[1,2,3,4,5].map(value => <Star key={value} size={15} fill={value <= stage ? 'currentColor' : 'none'} />)}</span>
    <b>{en ? 'Contact' : 'Contacto'} {stage}</b>
  </span>;
}
export default function QualifiedContacts({ en = false }) {
  const [items,setItems]=useState([]), [stages,setStages]=useState({});
  const [loading,setLoading]=useState(true), [ready,setReady]=useState(false);
  const [error,setError]=useState(''), [saving,setSaving]=useState(null);
  const [term,setTerm]=useState(''), [filter,setFilter]=useState('');
  const help=useRef(null);
  const t=(es,english)=>en?english:es;
  async function loadStages() {
    const rows=[];
    for(let offset=0;;offset+=500){
      const result=await supabase.from('sales_contact_stages').select('prospect_id,stage').order('prospect_id').range(offset,offset+499);
      if(result.error)return result;
      rows.push(...result.data);
      if(result.data.length<500)return {data:rows,error:null};
    }
  }
  async function load() {
    setLoading(true);setError('');setReady(false);
    try {
      const [rows,result]=await Promise.all([
        loadQualifiedContacts(supabase),
        loadStages()
      ]);
      setItems(rows);
      if(result.error) {
        if(!['42P01','PGRST205'].includes(result.error.code)) throw result.error;
        setStages({});
      } else {
        setStages(Object.fromEntries(result.data.map(row=>[row.prospect_id,row.stage])));
        setReady(true);
      }
    } catch(e){setError(e.message || t('No pudimos cargar los contactos.','Could not load contacts.'));}
    finally{setLoading(false);}
  }
  useEffect(()=>{load();},[]);
  async function update(id,stage) {
    setSaving(id);setError('');
    try{
      const {error:failure}=await supabase.rpc('set_sales_contact_stage',{p_prospect_id:id,p_stage:stage});
      if(failure)throw failure;
      setStages(previous=>({...previous,[id]:stage}));
    }catch(e){setError(t('No se guardó el cambio: ','Change was not saved: ')+e.message);}
    finally{setSaving(null);}
  }
  const filtered=useMemo(()=>items.filter(row=>
    [row.company,row.person,row.email].join(' ').toLowerCase().includes(term.toLowerCase())
    && (filter==='' || (stages[row.id]??0)===Number(filter))),[items,stages,term,filter]);
  return <div className="qualified-contacts">
    <div className="contact-tools">
      <label className="contact-search"><Search size={16}/><input aria-label={t('Buscar contactos','Search contacts')} placeholder={t('Buscar contacto…','Search contacts…')} value={term} onChange={e=>setTerm(e.target.value)}/></label>
      <select aria-label={t('Filtrar por etapa','Filter by stage')} value={filter} onChange={e=>setFilter(e.target.value)}><option value="">{t('Todas las etapas','All stages')}</option>{CONTACT_STAGES.map((s,i)=><option key={i} value={i}>{t('Contacto','Contact')} {i} · {s[en?2:0]}</option>)}</select>
      <button title={t('Qué significa cada etapa','What each stage means')} aria-label={t('Qué significa cada etapa','What each stage means')} onClick={()=>help.current.showModal()}><Info size={18}/></button>
      <button disabled={loading || saving!==null} title={t('Actualizar','Refresh')} aria-label={t('Actualizar','Refresh')} onClick={load}><RefreshCw size={18}/></button>
    </div>
    {error && <p className="contact-notice" role="alert">{error}</p>}
    {!loading&&!ready&&!error&&<p className="contact-notice">{t('Para guardar etapas, ejecuta CONTACT-STAGES.sql en el SQL Editor de Supabase. Mientras tanto, se muestran como Contacto 0.','Run CONTACT-STAGES.sql in the Supabase SQL Editor to save stages. Until then, contacts appear at stage 0.')}</p>}
    {loading?<PortalLoading compact/>:<div className="contact-list">
      {filtered.map(row=>{const stage=stages[row.id]??0;return <article className="qualified-contact" key={row.id}>
        <div className="contact-identity"><strong>{row.company}</strong><small>{[row.person,row.email].filter(Boolean).join(' · ')}</small></div>
        <Rating stage={stage} en={en}/>
        <label><span className="contact-sr">{t('Etapa de ','Stage for ')}{row.company}</span><select value={stage} disabled={!ready || saving!==null} onChange={e=>update(row.id,Number(e.target.value))}>{CONTACT_STAGES.map((s,i)=><option key={i} value={i}>{i} · {s[en?2:0]}</option>)}</select></label>
      </article>;})}
      {!filtered.length&&<p className="contact-empty">{t('Sin contactos confirmados para este filtro. Los prospectos sin respuesta permanecen en Comunicaciones.','No confirmed contacts match this filter. Prospects who have not replied remain in Communications.')}</p>}
    </div>}
    <dialog ref={help} className="contact-help" aria-labelledby="contact-help-title" onClick={e=>{if(e.target===help.current){const r=help.current.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)help.current.close();}}}>
      <header><h3 id="contact-help-title">{t('Etapas del contacto','Contact stages')}</h3><button autoFocus aria-label={t('Cerrar ayuda','Close help')} onClick={()=>help.current.close()}><X size={18}/></button></header>
      <p>{t('Solo contactos que ya respondieron. Las estrellas indican avance comercial; cada etapa se actualiza manualmente.','Only contacts who have replied. Stars show sales progress; each stage is updated manually.')}</p>
      <ol>{CONTACT_STAGES.map((s,i)=><li key={i}><Rating stage={i} en={en}/><div><strong>{s[en?2:0]}</strong><small>{s[en?3:1]}</small></div></li>)}</ol>
    </dialog>
  </div>;
}
