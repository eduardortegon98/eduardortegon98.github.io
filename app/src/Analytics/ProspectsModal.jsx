import { Fragment, useEffect, useMemo, useState } from 'react';
import { X, Search, ExternalLink, RefreshCw, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './ProspectsModal.css';
import { getContactChannel, getContactUrl, channelClass } from './prospectChannels';

export default function ProspectsModal({ onClose, en = false }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const [error, setError] = useState('');
  const [channel, setChannel] = useState('');
  const [groupBy, setGroupBy] = useState('');
  const [schemaPending,setSchemaPending] = useState(false);
  const [term, setTerm] = useState('');
  const [country, setCountry] = useState('');
  const [status, setStatus] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const t = (es, english) => en ? english : es;

  async function load() {
    setLoading(true);
    setError('');
    try {
      if (!supabase) throw new Error('Supabase no está configurado.');
      const base='id,company,email,person,country,sector,status,delivery_status,contacted_at,subject,gmail_url,notes,updated_at';
      const rows=[];let legacy=false;
      for(let offset=0;;offset+=500){
        const request=columns=>supabase.from('sales_prospects').select(columns).order('updated_at',{ascending:false}).order('id').range(offset,offset+499);
        let result=await request(legacy?base:base+',contact_channel,contact_url');
        if(result.error&&['42703','PGRST204'].includes(result.error.code)){legacy=true;result=await request(base);}
        if(result.error)throw result.error;
        rows.push(...result.data);
        if(result.data.length<500)break;
      }
      setSchemaPending(legacy);
      setItems(rows);

    } catch (e) { setError(e?.message || 'No fue posible consultar prospectos.'); }
    finally { setLoading(false); }
  }
  async function syncNotion() {
    setSyncing(true);
    setSyncMessage('');
    try {
      const { data, error: failure } = await supabase.functions.invoke('sync-prospects', { body: {} });
      if (failure || !data?.success) throw new Error(data?.error || failure?.message || 'sync_failed');
      setSyncMessage(t(`${data.synced} prospectos sincronizados.`, `${data.synced} prospects synced.`));
      await load();
    } catch (e) { setSyncMessage(t('No se pudo sincronizar Notion: ', 'Notion sync failed: ') + (e?.message || 'error')); }
    finally { setSyncing(false); }
  }
  useEffect(() => {
    load();
    const handle = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, []);
  const countries = useMemo(() => [...new Set(items.map(i => i.country).filter(Boolean))].sort(), [items]);
  const statuses = useMemo(() => [...new Set(items.map(i => i.status).filter(Boolean))].sort(), [items]);
  const channels=useMemo(()=>[...new Set(items.map(getContactChannel))].sort(),[items]);
  const channelLabel=value=>en?({'Correo electrónico':'Email','Teléfono':'Phone','Formulario web':'Web form','Otro':'Other','Por verificar':'Unverified'}[value]||value):value;
  const filtered = useMemo(() => items.filter(i => {
    const query = [i.company, i.email, i.person, i.notes, i.sector, i.subject, getContactChannel(i)].join(' ').toLowerCase();
    const day = i.contacted_at?.slice(0, 10) || '';
    return (!channel || getContactChannel(i) === channel) && (!term || query.includes(term.toLowerCase())) && (!country || i.country === country)
      && (!status || i.status === status) && (!from || (day && day >= from)) && (!to || (day && day <= to));
  }), [items, term, country, status, from, to, channel]);
  const groups=useMemo(()=>groupBy==='channel'? [...new Set(filtered.map(getContactChannel))].sort().map(key=>({key,rows:filtered.filter(item=>getContactChannel(item)===key)})):[{key:'all',rows:filtered}],[filtered,groupBy]);
  return <div className="prospects-overlay" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
    <section className="prospects-dialog" role="dialog" aria-modal="true" aria-labelledby="prospects-heading">
      <header className="prospects-heading"><div><span className="prospects-kicker">CRM · SOLUCIONES ORTEGÓN</span><h2 id="prospects-heading">{t('Prospectos comerciales','Sales prospects')}</h2><p>{t('Seguimiento por canal de contacto','Contact tracking by channel')}</p></div>
        <div className="prospects-heading-actions"><button onClick={syncNotion} disabled={syncing || loading} className="prospects-sync-button" title={t('Importar cambios de Notion','Import changes from Notion')} aria-label={t('Sincronizar Notion','Sync Notion')}><RefreshCw size={16}/><span>{syncing ? t('Sincronizando…','Syncing…') : t('Sincronizar Notion','Sync Notion')}</span></button><button title={t('Actualizar','Refresh')} aria-label={t('Actualizar','Refresh')} onClick={load} disabled={loading}><RefreshCw size={18}/></button><button title={t('Cerrar','Close')} aria-label={t('Cerrar','Close')} onClick={onClose}><X size={19}/></button></div></header>
      {schemaPending&&<p className="prospects-sync-message" role="status">{t('Canales detectados de los datos existentes. Ejecuta PROSPECTS-CHANNELS.sql y actualiza sync-prospects para guardar el canal de Notion.','Channels detected from existing data. Run PROSPECTS-CHANNELS.sql and update sync-prospects to persist the Notion channel.')}</p>}
      {syncMessage && <p role="status" className="prospects-sync-message">{syncMessage}</p>}
      <div className="prospects-filters">
        <label className="prospects-search"><Search size={17}/><input value={term} onChange={e => setTerm(e.target.value)} placeholder={t('Buscar empresa, persona o correo','Search company, person or email')}/></label>
        <label>{t('Canal de contacto','Contact channel')}<select value={channel} onChange={event=>setChannel(event.target.value)}><option value="">{t('Todos','All')}</option>{channels.map(value=><option key={value} value={value}>{channelLabel(value)}</option>)}</select></label>
        <label>{t('Agrupar por','Group by')}<select value={groupBy} onChange={event=>setGroupBy(event.target.value)}><option value="">{t('Sin agrupar','No grouping')}</option><option value="channel">{t('Canal de contacto','Contact channel')}</option></select></label>
        <label>{t('País','Country')}<select value={country} onChange={e => setCountry(e.target.value)}><option value="">{t('Todos','All')}</option>{countries.map(c => <option key={c}>{c}</option>)}</select></label>
        <label>{t('Estado','Status')}<select value={status} onChange={e => setStatus(e.target.value)}><option value="">{t('Todos','All')}</option>{statuses.map(s => <option key={s}>{s}</option>)}</select></label>
        <label>{t('Desde','From')}<input type="date" value={from} onChange={e => setFrom(e.target.value)}/></label>
        <label>{t('Hasta','To')}<input type="date" value={to} onChange={e => setTo(e.target.value)}/></label>
      </div>
      <div className="prospects-summary"><span><Users size={16}/> {filtered.length} / {items.length} {t('prospectos','prospects')}</span><span>{filtered.filter(i => i.status === 'Respondió').length} {t('respuestas','replies')}</span><span>{filtered.filter(i => i.delivery_status === 'rebotado').length} {t('rebotes','bounces')}</span><span>{filtered.filter(i => i.delivery_status === 'bloqueado').length} {t('bloqueados','blocked')}</span></div>
      {error && <div className="prospects-error" role="alert">{t('No se pudieron cargar los datos. Ejecuta la migración de Supabase y configura la sincronización con Notion.','Could not load data. Apply the Supabase migration and set up Notion synchronization.')} <small>{error}</small></div>}
      {loading ? <p className="prospects-empty">{t('Consultando prospectos…','Loading prospects…')}</p> : !error && !filtered.length ? <p className="prospects-empty">{items.length ? t('No hay resultados con estos filtros.','No matching prospects.') : t('Sin datos sincronizados todavía.','No synchronized records yet.')}</p> : !error && <div className="prospects-table-wrap"><table><thead><tr><th>{t('Empresa','Company')}</th><th>{t('Contacto','Contact')}</th><th>{t('Canal','Channel')}</th><th>{t('País','Country')}</th><th>{t('Estado','Status')}</th><th>{t('Entrega','Delivery')}</th><th>{t('Fecha','Date')}</th><th>{t('Enlace','Link')}</th></tr></thead><tbody>{groups.map(group=><Fragment key={group.key}>{groupBy==='channel'&&<tr className="prospects-group-row"><th scope="rowgroup" colSpan={8}><span className={'prospects-channel prospects-channel--'+channelClass(group.key)}>{channelLabel(group.key)}</span><span>{group.rows.length} {t('prospectos','prospects')}</span></th></tr>}{group.rows.map(i=><tr key={i.id}><td><strong>{i.company}</strong><small>{i.sector}</small></td><td>{i.person || '—'}<small>{i.email}</small></td><td><span className={'prospects-channel prospects-channel--'+channelClass(getContactChannel(i))}>{channelLabel(getContactChannel(i))}</span></td><td>{i.country || '—'}</td><td><span className={`prospects-pill prospects-pill--${({ "No contactar": "do-not-contact", "Contactado": "contacted", "Respondió": "replied" })[i.status] || "other"}`}>{i.status || '—'}</span></td><td>{getContactChannel(i)==='Correo electrónico'?(i.delivery_status||'—'):t('No aplica','Not applicable')}<small title={i.notes}>{i.notes}</small></td><td>{i.contacted_at?.slice(0,10) || '—'}</td><td>{getContactUrl(i) ? <a href={getContactUrl(i)} target="_blank" rel="noreferrer" aria-label={t('Abrir contacto en ','Open contact in ')+channelLabel(getContactChannel(i))}><ExternalLink size={16}/></a> : '—'}</td></tr>)}</Fragment>)}</tbody></table></div>}
      <footer className="prospects-footer"><span>{t('Datos privados; únicamente disponibles para súper administradores.','Private data; super administrators only.')}</span><a href="https://app.notion.com/p/0eaf28ad2891459eb2ece0dad41cd61e" target="_blank" rel="noreferrer">{t('Abrir Notion','Open Notion')} <ExternalLink size={14}/></a></footer>
    </section>
  </div>;
}
