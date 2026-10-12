import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import PortalLoading from '../Portal/PortalLoading';
import './CountryRegions.css';
export default function CountryRegions({ country, days, en }) {
  const [state,setState]=useState({loading:true});
  useEffect(()=>{
    let active=true;const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),65000);
    setState({loading:true});
    (async()=>{
      try {
        const {data,error}=await supabase.functions.invoke('analytics-dashboard',{body:{days,regionCountry:country},signal:controller.signal});
        if(error)throw new Error('unavailable');
        if(data?.country!==country || data?.days!==days || !Array.isArray(data.regions))throw new Error('setup');
        if(active)setState({rows:data.regions});
      } catch(error){if(active)setState({error:error.message});}
      finally{clearTimeout(timeout);}
    })();
    return()=>{active=false;clearTimeout(timeout);controller.abort();};
  },[country,days]);
  if(state.loading)return <PortalLoading compact/>;
  if(state.error)return <p role="alert" className="region-status">{state.error==='setup'?(en?'Deploy the updated analytics-dashboard function in Supabase to enable regional reports.':'Actualiza la función analytics-dashboard en Supabase para activar los informes regionales.'):(en?'Could not query regions. Check the Google Analytics connection.':'No pudimos consultar las regiones. Revisa la conexión con Google Analytics.')}</p>;
  const total=state.rows.reduce((sum,row)=>sum+row.value,0);
  const max=Math.max(1,...state.rows.map(row=>row.value));
  const number=value=>new Intl.NumberFormat(en?'en-US':'es-CO').format(value);
  return <div className="country-regions"><div className="region-summary"><span>{en?'Sessions in reported regions':'Sesiones en regiones reportadas'}</span><strong>{number(total)}</strong></div>{state.rows.length?<ul>{state.rows.map(row=><li key={row.label}><div><span>{row.label==='(not set)'?(en?'Unknown region':'Región no identificada'):row.label}</span><strong>{number(row.value)}</strong><small>{total?(row.value/total*100).toFixed(1):'0.0'}%</small></div><progress value={row.value} max={max} aria-label={row.label}/></li>)}</ul>:<p className="region-status">{en?'No regional data for this country and period.':'No hay datos regionales para este país y periodo.'}</p>}<p className="region-note">{en?'Approximate Google Analytics regions, aggregated for the selected period. They may differ from administrative boundaries and are not live locations.':'Regiones aproximadas de Google Analytics, agregadas para el periodo elegido. Pueden diferir de las divisiones administrativas y no son ubicaciones en vivo.'}</p></div>;
}
