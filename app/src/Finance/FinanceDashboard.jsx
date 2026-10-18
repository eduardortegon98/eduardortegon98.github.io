import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../i18n/Language';
import { Plus, Trash2, RefreshCw, Eye, X } from 'lucide-react';
import './FinanceDashboard.css';

const DEFAULTS={nu_balance:10974592.35,pila_balance:2643800,monthly_salary:3000000,study:900000,house:1500000,extra_monthly:0,health:500000,health_refund:0,nu_target:950000,pila_target:0,buffer:126000,personal_budget:0,goal_date:'2027-10-18',nu_paid_month:'2026-10',nu_last_payment_amount:963048,nu_next_due:'2026-11-15',pila_last_processed_month:'2026-10-01'};
const pesos=value=>new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(Number(value)||0);
const localDate=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')};
const currentMonth=()=>localDate().slice(0,7);
const fmtDate=date=>date?new Date(date+'T12:00:00').toLocaleDateString('es-CO',{day:'2-digit',month:'short'}):'';
const initial={date:localDate(),amount:'',category:'Otro',note:''};
export default function FinanceDashboard(){
 const {user,role}=useOutletContext();
 const {language}=useLanguage();
 const en=language==='en';
 const [settings,setSettings]=useState(DEFAULTS),[expenses,setExpenses]=useState([]),[bills,setBills]=useState([]),[extras,setExtras]=useState([]),[incomes,setIncomes]=useState([]),[bufferMovements,setBufferMovements]=useState([]);
 const [month,setMonth]=useState(currentMonth()),[tab,setTab]=useState('gasto'),[form,setForm]=useState(initial);
 const [isReady,setReady]=useState(false),[loading,setLoading]=useState(true),[saving,setSaving]=useState(false),[error,setError]=useState(''),[edit,setEdit]=useState(false);
 const [bufferDirection,setBufferDirection]=useState('out'),[historyCategory,setHistoryCategory]=useState('Todas');
 const [incomeCurrency,setIncomeCurrency]=useState('COP'),[trm,setTrm]=useState(null),[trmLoading,setTrmLoading]=useState(false),[trmError,setTrmError]=useState('');
 const [hourlyUsd,setHourlyUsd]=useState(''),[paymentFor,setPaymentFor]=useState('Banco'),[hours,setHours]=useState(''),[historyOpen,setHistoryOpen]=useState(false),[historyMonth,setHistoryMonth]=useState(currentMonth());
 const owner=user?.id;
 useEffect(()=>{if(owner)setHourlyUsd(window.localStorage.getItem('ortfinance_extra_hourly_usd_'+owner)||'');},[owner]);
 const setHourlyRate=value=>{
  setHourlyUsd(value);
  if(owner){if(value)window.localStorage.setItem('ortfinance_extra_hourly_usd_'+owner,value);else window.localStorage.removeItem('ortfinance_extra_hourly_usd_'+owner);}
 };
 const extraEstimate=tab==='extra'&&trm&&trm.date===form.date&&Number(hours)>0&&Number(hourlyUsd)>0?Math.round(Number(hours)*Number(hourlyUsd)*trm.rate*100)/100:null;
 useEffect(()=>{
  if(!((tab==='ingreso'&&incomeCurrency==='USD')||tab==='extra')||!form.date){setTrm(null);setTrmError('');setTrmLoading(false);return;}
  let cancelled=false;
  setTrm(null);setTrmLoading(true);setTrmError('');
  const controller=new AbortController();
  fetch('https://api.dolarencolombia.co/v1/trm/'+form.date,{signal:controller.signal})
   .then(async response=>{if(!response.ok)throw new Error('HTTP '+response.status);return response.json()})
   .then(data=>{
    const rate=Number(data.valor);
    if(!Number.isFinite(rate)||rate<=0)throw new Error('La API no devolvió una tasa válida.');
    if(!cancelled){setTrm({rate,date:form.date,validFrom:data.fecha||form.date,source:'dolarencolombia.co / Superfinanciera'});setTrmError('');}
   })
   .catch(err=>{if(!cancelled&&err.name!=='AbortError')setTrmError('No pudimos obtener la TRM de esa fecha. '+err.message);})
   .finally(()=>{if(!cancelled)setTrmLoading(false)});
  return()=>{cancelled=true;controller.abort()};
 },[tab,incomeCurrency,form.date]);
 const refresh=async()=>{
  if(!owner)return;
  setLoading(true);setError('');
  try{
   const rolled=await supabase.rpc('rollover_my_pila');
   if(rolled.error)throw rolled.error;
   const queries=await Promise.all([
    supabase.from('personal_finance_settings').select('*').eq('user_id',owner).maybeSingle(),
    supabase.from('personal_finance_expenses').select('*').eq('user_id',owner).order('date',{ascending:false}).limit(1000),
    supabase.from('personal_finance_bills').select('*').eq('user_id',owner).order('due_date',{ascending:false}).limit(1000),
    supabase.from('personal_finance_extras').select('*').eq('user_id',owner).order('date',{ascending:false}).limit(1000),
    supabase.from('personal_finance_income').select('*').eq('user_id',owner).order('date',{ascending:false}).limit(1000),
    supabase.from('personal_finance_buffer_movements').select('*').eq('user_id',owner).order('date',{ascending:false}).limit(1000)
   ]);
   for(const q of queries)if(q.error)throw q.error;
   setSettings({...DEFAULTS,...(queries[0].data||{})});
   setExpenses(queries[1].data||[]);setBills(queries[2].data||[]);setExtras(queries[3].data||[]);setIncomes(queries[4].data||[]);setBufferMovements(queries[5].data||[]);setReady(true);
  }catch(e){setError('No se pudieron cargar los datos. Si no has actualizado Supabase, ejecuta el SQL de OrtFinance. '+(e.message||''));setReady(false)}
  finally{setLoading(false)}
 };
 useEffect(()=>{refresh()},[owner]);
 const filteredExpenses=useMemo(()=>expenses.filter(x=>x.date.slice(0,7)===month),[expenses,month]);
 const paid=bills.filter(x=>x.status==='paid'&&x.due_date.slice(0,7)===month);
 const hasNuPayment=month===settings.nu_paid_month&&!paid.some(x=>x.category==='Banco');
 const visiblePayments=paid.length+(hasNuPayment?1:0);
 const dorisPaid=paid.filter(x=>x.category==='Casa').reduce((sum,x)=>sum+Number(x.amount),0);
 const dorisGoal=Number(settings.house);
 const dorisCovered=dorisGoal>0&&dorisPaid>=dorisGoal;
 const worked=extras.filter(x=>x.date.slice(0,7)===month);
 const received=incomes.filter(x=>x.date.slice(0,7)===month);
 const totalReceived=received.reduce((a,x)=>a+Number(x.amount),0);
 const hoursTotal=worked.reduce((a,x)=>a+Number(x.hours),0);
 const extraEarned=worked.reduce((a,x)=>a+Number(x.amount),0);
 const spent=filteredExpenses.reduce((a,x)=>a+Number(x.amount),0);
 const ants=filteredExpenses.filter(x=>x.category==='Gasto hormiga').reduce((a,x)=>a+Number(x.amount),0);
 const debtNu=Number(settings.nu_balance),debtPila=Number(settings.pila_balance),master=Number(settings.study);
 const totalDebt=debtNu+debtPila;
 const originalDebt=10974592.35+2643800;
 const progress=Math.max(0,Math.min(100,(1-totalDebt/originalDebt)*100));
 const light=totalDebt<=0?'green':progress>=50?'yellow':'red';
 const lightName=light==='green'?'VERDE':light==='yellow'?'AMARILLO':'ROJÍSIMO';
 const lightMessage=light==='green'?'¡Sin deuda de Nu ni PILA atrasada! Mantén el control.':light==='yellow'?'Ya pagaste al menos la mitad de la deuda inicial. Todavía falta.':'Todavía debemos más de la mitad de la deuda inicial. Prioridad: cumplir cuotas y evitar deuda nueva.';
 const goal=totalDebt+master; // Master's monthly payment is a separate obligation, not outstanding debt.
 const expected=[{name:'Casa',amount:Number(settings.house)},{name:'Máster',amount:master},{name:'Banco',amount:Number(settings.nu_target)},{name:'PILA atrasada',amount:Number(settings.pila_target)},{name:'Salud y pensión',amount:Number(settings.health)}];
 const bankPaidThisMonth=month===settings.nu_paid_month||paid.some(p=>p.category==='Banco'&&Number(p.amount)>0);
 const remaining=expected.map(x=>({...x,paid:paid.filter(p=>p.category===x.name).reduce((a,p)=>a+Number(p.amount),0)})).map(x=>({...x,remaining:x.name==='Banco'&&bankPaidThisMonth?0:Math.max(0,x.amount-x.paid)}));
 const remainingTotal=remaining.reduce((a,x)=>a+x.remaining,0);
 const actions=[];
 if(!bankPaidThisMonth&&remaining.some(x=>x.name==='Banco'&&x.remaining>0))actions.push('Revisa el próximo vencimiento de Nu y separa el dinero de la cuota.');
 if(remaining.some(x=>x.name==='Salud y pensión'&&x.remaining>0))actions.push('Verifica tu planilla de salud y pensión y conserva el comprobante para Blu.');
 if(ants>0)actions.push('Este mes llevas '+pesos(ants)+' en gastos hormiga. Revisa cuáles puedes evitar.');
 if(Number(settings.buffer)<500000)actions.push('Mantén protegido el colchón de '+pesos(settings.buffer)+'.');
 if(!actions.length)actions.push('Vas al día con los pagos registrados. Sigue anotando cada gasto.');
 const save=async()=>{
  if(!isReady||saving)return;
  setError('');setSaving(true);
  try{
   const enteredAmount=Number(form.amount),note=form.note.trim();
   if(((tab==='ingreso'&&incomeCurrency==='USD')||tab==='extra')&&(!trm||trmLoading||trm.date!==form.date))throw new Error('Espera a que cargue la TRM oficial de la fecha de transferencia.');
   const amount=tab==='extra'?extraEstimate:tab==='ingreso'&&incomeCurrency==='USD'?Math.round(enteredAmount*trm.rate*100)/100:enteredAmount;
   if(!form.date||!Number.isFinite(amount)||amount<=0)throw new Error('Ingresa un valor mayor que cero.');
   let table,record;
   if(tab==='colchon'){
    const {error:e}=await supabase.rpc('move_my_finance_buffer',{p_amount:amount,p_direction:bufferDirection,p_date:form.date,p_note:note});
    if(e)throw e;
    setForm(initial);await refresh();return;
   }
   if(tab==='ingreso'){
    table='personal_finance_income';
    const conversion=incomeCurrency==='USD'?'USD '+enteredAmount+' × TRM '+trm.rate+' COP/USD ('+form.date+'; fuente: dolarencolombia.co). ':'';
    record={date:form.date,amount,source:paymentFor,note:conversion+note};
   }
   else if(tab==='gasto'){table='personal_finance_expenses';record={date:form.date,amount,category:form.category,note};}
   else if(tab==='pago'){table='personal_finance_bills';record={due_date:form.date,amount,title:note||paymentFor,category:paymentFor,status:'paid'};}
   else {
    const h=Number(hours),rate=Number(hourlyUsd);
    if(!Number.isFinite(h)||h<=0)throw new Error('Indica las horas trabajadas.');
    if(!Number.isFinite(rate)||rate<=0)throw new Error('Configura tu tarifa en USD por hora.');
    table='personal_finance_extras';
    record={date:form.date,hours:h,amount,note:'Estimado: '+h+' h × USD '+rate+'/h × TRM '+trm.rate+' ('+form.date+'; dolarencolombia.co). '+note};
   }
   const {error:e}=await supabase.from(table).insert({...record,user_id:owner});if(e)throw e;
   setForm(initial);setHours('');await refresh();
  }catch(e){setError(e.message||'No se guardó el registro.')}finally{setSaving(false)}
 };
 const del=async(table,id)=>{if(!window.confirm('¿Eliminar este registro? Esta acción no se puede deshacer.'))return;setError('');const {error:e}=table==='personal_finance_buffer_movements'
   ?await supabase.rpc('undo_my_finance_buffer_movement',{p_id:id})
   :await supabase.from(table).delete().eq('id',id).eq('user_id',owner);
   if(e)setError(e.message);else await refresh()};
 const removeConfirmedNu=async()=>{
  if(!window.confirm('¿Quitar la cuota Nu marcada como pagada? Esto no cambia el saldo total de la deuda.'))return;
  setError('');
  const {error:e}=await supabase.from('personal_finance_settings').update({nu_paid_month:'',nu_last_payment_amount:0}).eq('user_id',owner);
  if(e)setError(e.message||'No se pudo corregir el pago Nu.');else await refresh();
 };
 const saveGoals=async()=>{
  setSaving(true);setError('');
  const payload={user_id:owner,...Object.fromEntries(Object.keys(DEFAULTS).map(k=>[k,['goal_date','nu_paid_month','nu_next_due','pila_last_processed_month'].includes(k)?settings[k]:Math.max(0,Number(settings[k])||0)]))};
  const {error:e}=await supabase.from('personal_finance_settings').upsert(payload,{onConflict:'user_id'});
  if(e)setError(e.message);else{setEdit(false);await refresh()}setSaving(false);
 };
 if(role!=='super_admin')return <p>Solo el administrador puede consultar sus finanzas.</p>;
 const historyPaid=bills.filter(x=>x.status==='paid'&&x.due_date.slice(0,7)===historyMonth);
 const historyHasNu=historyMonth===settings.nu_paid_month&&!historyPaid.some(x=>x.category==='Banco');
 const movements=[...(historyHasNu?[{id:'nu-confirmed-'+month,date:historyMonth+'-01',label:'Cuota Nu registrada como pagada (fecha exacta no indicada)',amount:settings.nu_last_payment_amount,kind:'Pago confirmado',category:'Banco',table:null}]:[]),...bufferMovements.filter(x=>x.date.slice(0,7)===historyMonth).map(x=>({id:x.id,date:x.date,label:x.note||'Movimiento del colchón',amount:x.amount,kind:x.direction==='in'?'Colchón · entrada':'Colchón · salida',category:'Colchón',table:'personal_finance_buffer_movements'})),...expenses.filter(x=>x.date.slice(0,7)===historyMonth).map(x=>({id:x.id,date:x.date,label:x.note||x.category,amount:x.amount,kind:'Gasto',category:x.category||'Otro',table:'personal_finance_expenses'})),...historyPaid.map(x=>({id:x.id,date:x.due_date,label:x.title,amount:x.amount,kind:'Pago',category:x.category||'Otro',table:'personal_finance_bills'})),...extras.filter(x=>x.date.slice(0,7)===historyMonth).map(x=>({id:x.id,date:x.date,label:x.note||'Horas en Blu',amount:x.amount,kind:x.hours+' h extra · estimado',category:'Extras',table:'personal_finance_extras'})),...incomes.filter(x=>x.date.slice(0,7)===historyMonth).map(x=>({id:x.id,date:x.date,label:x.note||x.source,amount:x.amount,kind:'Recibí · '+x.source,category:'Ingreso · '+x.source,table:'personal_finance_income'}))].sort((a,b)=>b.date.localeCompare(a.date));
 const categories=['Todas',...Array.from(new Set(movements.map(x=>x.category))).sort((a,b)=>a.localeCompare(b,'es'))];
 const filteredMovements=historyCategory==='Todas'?movements:movements.filter(x=>x.category===historyCategory);
 return <main className="fin-page fin-simple">
  <div className="fin-head"><div><p className="fin-eyebrow">TU LIBRETA PERSONAL</p><h2>OrtFinance.AI</h2><p>Lo que debes, lo que pagas y lo que estás logrando. Sin fórmulas complicadas.</p></div><button className="fin-secondary" onClick={refresh}><RefreshCw size={16}/> Actualizar</button></div>
  {error&&<p className="fin-error" role="alert">{error}</p>}
  {!isReady?<p className="fin-empty">{loading?'Cargando tu libreta...':'Activa las tablas de OrtFinance en Supabase para comenzar.'}</p>:<>
  <div className="fin-family-health">
    <section className={'fin-person-card fin-doris '+(dorisCovered?'fin-person-happy':'fin-person-pending')} aria-label={'Doris: '+(dorisCovered?'aporte cubierto':'aporte por confirmar')}>
      <div className="fin-person-top"><div><span className="fin-traffic-eyebrow">SALUD FINANCIERA DE DORIS</span><h3>Doris</h3></div><span className="fin-person-face" role="img" aria-label={dorisCovered?'Carita feliz':'Carita triste'}>{dorisCovered?'😊':'😟'}</span></div>
      <div className="fin-person-status">{dorisCovered?'FELIZ':'PENDIENTE'}</div>
      <p>{dorisCovered?'Este mes recibió todo su presupuesto. ❤️':'Falta registrar el aporte completo de este mes.'}</p>
      <div className="fin-doris-columns"><div><small>Recibió</small><strong>{pesos(dorisPaid)}</strong></div><div><small>Meta del mes</small><strong>{pesos(dorisGoal)}</strong></div></div>
      <div className="fin-track"><div style={{width:(dorisGoal>0?Math.min(100,dorisPaid/dorisGoal*100):0)+'%'}}/></div>
      <small className="fin-doris-helper">Regístralo en «Pagué → Doris (casa)». No se cuenta dos veces.</small>
    </section>
    <section className={'fin-person-card fin-eduard fin-traffic-'+light} aria-label={'Eduard: '+lightName}>
      <div className="fin-person-top"><div><span className="fin-traffic-eyebrow">SALUD FINANCIERA DE EDUARD</span><h3>Eduard</h3></div><span className="fin-person-face" role="img" aria-label={light==='green'?'Carita muy feliz':light==='yellow'?'Carita enfocada':'Carita triste'}>{light==='green'?'🥳':light==='yellow'?'😤':'😢'}</span></div>
      <div className="fin-person-main"><div><div className="fin-person-status">{light==='red'?'ROJÍSIMO':light==='yellow'?'ENFOCADO':'¡RE FELIZ!'}</div><p>{lightMessage}</p></div><div className="fin-traffic-lights fin-vertical" aria-hidden="true"><span className={light==='red'?'on':''}/><span className={light==='yellow'?'on':''}/><span className={light==='green'?'on':''}/></div></div>
      <div className="fin-eduard-progress">
        <div className="fin-eduard-progress-heading"><span>Camino a estar libre de deudas</span><strong>{progress.toFixed(1)}%</strong></div>
        <div className="fin-track" role="progressbar" aria-label="Progreso de pago de las deudas de Eduard" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Number(progress.toFixed(1))}><div style={{width:progress+'%'}}/></div>
        <div className="fin-person-bottom"><strong>{pesos(totalDebt)} por pagar</strong><span>Meta: {settings.goal_date}</span></div>
        <button type="button" className="fin-link fin-eduard-edit" onClick={()=>setEdit(!edit)}>{edit?'Cerrar edición':'Editar saldos y meta'}</button>
      </div>
    </section>
  </div>
  <div className="fin-overview"><section className="fin-section fin-debts"><h3>Debes</h3><div className="fin-simple-rows"><div><span>Máster <small>Cuota de este mes</small></span><strong>{pesos(master)}</strong></div><div><span>Banco · Nu <small>Saldo total · cuota de octubre pagada</small></span><strong>{pesos(debtNu)}</strong></div><div><span>PILA atrasada <small>Sin pagar · aportes de meses anteriores</small></span><strong>{pesos(debtPila)}</strong><em className="fin-pending-pill">Pendiente</em></div><div><span>Salud y pensión <small>Aporte de este mes · separado de PILA atrasada</small></span><strong>{pesos(Math.max(0,Number(settings.health)-paid.filter(p=>p.category==='Salud y pensión').reduce((sum,p)=>sum+Number(p.amount),0)))}</strong></div></div></section>
  <section className="fin-section fin-income"><div className="fin-line"><h3>Recibí</h3><span className="fin-tag">{received.length} ingresos</span></div><div className="fin-income-amount">{pesos(totalReceived)}</div><p>Este mes</p>{received.slice(0,3).map(x=><div className="fin-entry" key={x.id}><span>{fmtDate(x.date)}<small>{x.source}</small></span><strong>{pesos(x.amount)}</strong><button type="button" className="fin-remove fin-inline-delete" title="Eliminar ingreso no recibido" aria-label={'Eliminar ingreso '+pesos(x.amount)+' de '+x.source} onClick={()=>del('personal_finance_income',x.id)}><Trash2 size={15}/></button></div>)}{!received.length&&<p className="fin-muted">Sin ingresos anotados todavía.</p>}</section>
  <section className="fin-section fin-paid"><div className="fin-line"><h3>Pagaste</h3><span className="fin-tag">{visiblePayments} {visiblePayments===1?'registro':'registros'}</span></div><div className="fin-ledger-head"><span>Cuándo / a quién</span><span>Cuánto</span></div>{hasNuPayment&&<div className="fin-entry"><span>Cuota Nu · {month}<small>Pagada · fecha exacta sin registrar</small></span><strong>{pesos(settings.nu_last_payment_amount)}</strong><button type="button" className="fin-remove fin-inline-delete" title="Quitar pago Nu marcado como pagado" aria-label="Quitar pago Nu confirmado" onClick={removeConfirmedNu}><Trash2 size={15}/></button></div>}{paid.length?paid.map(x=><div className="fin-entry" key={x.id}><span>{fmtDate(x.due_date)}<small>{x.title}</small></span><strong>{pesos(x.amount)}</strong><button type="button" className="fin-remove fin-inline-delete" title="Eliminar pago no realizado" aria-label={'Eliminar pago '+pesos(x.amount)+' a '+x.title} onClick={()=>del('personal_finance_bills',x.id)}><Trash2 size={15}/></button></div> ):!hasNuPayment&&<p className="fin-muted">Todavía no has registrado pagos este mes.</p>}</section>
   <section className="fin-section fin-extras"><div className="fin-line"><h3>Extras</h3><span className="fin-tag">{month}</span></div><div className="fin-simple-rows"><div><span>Trabajadas <small>Horas extra en Blu</small></span><strong>{hoursTotal} h</strong></div><div><span>Estimado en extras</span><strong>{pesos(extraEarned)}</strong></div><div><span>Gastados <small>Gastos diarios registrados</small></span><strong>{pesos(spent)}</strong></div><div><span>Gastos hormiga</span><strong>{pesos(ants)}</strong></div></div></section>
   <section className="fin-section fin-buffer"><div className="fin-line"><h3>Mi colchón</h3><button className="fin-link" onClick={()=>setEdit(true)}>Editar</button></div><div className="fin-buffer-number">{pesos(settings.buffer)}</div><p>Dinero disponible para emergencias. Las entradas y salidas se registran desde Movimientos → Colchón.</p></section>
  <section className="fin-section fin-add fin-overview-add"><div className="fin-line"><h3>Movimientos</h3><div className="fin-movement-actions"><button type="button" className="fin-eye-button" title="Ver historial de movimientos" aria-label="Ver historial de movimientos" onClick={()=>{setHistoryMonth(month);setHistoryCategory('Todas');setHistoryOpen(true)}}><Eye size={19}/></button><label className="fin-month">Mes <input type="month" value={month} onChange={e=>setMonth(e.target.value)}/></label></div></div>
   <div className="fin-tabs">{[['ingreso','Recibí'],['gasto','Gasté'],['pago','Pagué'],['extra','Trabajé extra'],['colchon','Colchón']].map(([key,title])=><button key={key} className={tab===key?'selected':''} onClick={()=>setTab(key)}>{title}</button>)}</div>
   <form className="fin-simple-form" onSubmit={e=>{e.preventDefault();save()}}>
    <label>Cuándo<input type="date" required value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))}/></label>
    {tab!=='extra'&&<label>Cuánto ({tab==='ingreso'?incomeCurrency:'COP'})<input type="number" min={tab==='ingreso'&&incomeCurrency==='USD'?'0.01':'1'} step={tab==='ingreso'&&incomeCurrency==='USD'?'0.01':'1'} required placeholder={tab==='ingreso'&&incomeCurrency==='USD'?'Ej. 200.50':'Ej. 20000'} value={form.amount} onChange={e=>setForm(p=>({...p,amount:e.target.value}))}/></label>}
    {tab==='ingreso'?<label>De quién<select value={paymentFor} onChange={e=>setPaymentFor(e.target.value)}>{['Blu','Cliente STO','Reembolso','Otro'].map(x=><option key={x}>{x}</option>)}</select></label>:tab==='pago'?<label>A quién<select value={paymentFor} onChange={e=>setPaymentFor(e.target.value)}>{[['Banco','Banco'],['Máster','Máster'],['PILA atrasada','PILA atrasada'],['Salud y pensión','Salud y pensión'],['Casa','Doris (casa)'],['Otro','Otro']].map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>:tab==='gasto'?<label>Tipo<select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}>{['Otro','Gasto hormiga','Alimentación','Transporte','Salud','Casa','Estudio','Ocio'].map(x=><option key={x}>{x}</option>)}</select></label>:tab==='colchon'?<label>Operación<select value={bufferDirection} onChange={e=>setBufferDirection(e.target.value)}><option value="out">Sacar del colchón</option><option value="in">Guardar en el colchón</option></select></label>:<label>Horas trabajadas<input type="number" min=".25" step=".25" required value={hours} onChange={e=>setHours(e.target.value)} placeholder="Ej. 8"/></label>}
    <label>Detalle (opcional)<input maxLength="180" value={form.note} onChange={e=>setForm(p=>({...p,note:e.target.value}))} placeholder={tab==='ingreso'?'Ej. quincena de Blu':tab==='pago'?'Ej. cuota de octubre':tab==='extra'?'Ej. lunes en Blu':tab==='colchon'?'Ej. ahorro o préstamo familiar':'Ej. café'}/></label>
    <button type="submit" className="fin-primary" disabled={saving||((tab==='extra'||(tab==='ingreso'&&incomeCurrency==='USD'))&&(!trm||trmLoading||trm.date!==form.date))}><Plus size={16}/> Guardar</button>
   </form>
  </section>
  </div>
  {edit&&<section className="fin-section"><h3>Actualizar mis cifras</h3><p>Los pagos registrados no disminuyen automáticamente el saldo total de Nu o PILA: confirma el nuevo saldo en sus aplicaciones y actualízalo aquí.</p><div className="fin-settings">{[['nu_balance','Banco · saldo pendiente'],['pila_balance','PILA atrasada · saldo pendiente'],['study','Máster · mensualidad'],['house','Casa · mensualidad'],['nu_target','Banco · pago mensual'],['pila_target','PILA atrasada · pago previsto'],['health','Salud y pensión · este mes'],['buffer','Colchón'],['monthly_salary','Salario mensual'],['extra_monthly','Ingreso extra previsto'],['health_refund','Reembolso de Blu confirmado'],['nu_last_payment_amount','Última cuota Nu pagada']].map(([key,label])=><label key={key}>{label}<input type="number" min="0" value={settings[key]} onChange={e=>setSettings(s=>({...s,[key]:e.target.value}))}/></label>)}<label>Mes ya pagado de Nu<input type="month" value={settings.nu_paid_month||''} onChange={e=>setSettings(s=>({...s,nu_paid_month:e.target.value}))}/></label><label>Próximo vencimiento Nu<input type="date" value={settings.nu_next_due||''} onChange={e=>setSettings(s=>({...s,nu_next_due:e.target.value}))}/></label><label>Fecha meta<input type="date" value={settings.goal_date} onChange={e=>setSettings(s=>({...s,goal_date:e.target.value}))}/></label></div><button className="fin-primary" disabled={saving} onClick={saveGoals}>Guardar mis cifras</button></section>}
  {historyOpen&&<div className="fin-history-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setHistoryOpen(false)}}><section className="fin-history-modal" role="dialog" aria-modal="true" aria-label="Historial de movimientos"><div className="fin-history-header"><div><span className="fin-eyebrow">ORTFINANCE.AI</span><h3>Historial de movimientos</h3></div><button type="button" className="fin-eye-button" aria-label="Cerrar historial" onClick={()=>setHistoryOpen(false)}><X size={20}/></button></div><div className="fin-history-toolbar"><label>Filtrar por mes<input type="month" value={historyMonth} onChange={e=>setHistoryMonth(e.target.value)}/></label><label>Categoría<select value={historyCategory} onChange={e=>setHistoryCategory(e.target.value)}>{categories.map(category=><option key={category} value={category}>{category}</option>)}</select></label><span className="fin-tag">{filteredMovements.length} {filteredMovements.length===1?'movimiento':'movimientos'}</span></div><div className="fin-history-scroll">{filteredMovements.length?filteredMovements.map(x=><div key={(x.table||'confirmed')+x.id} className="fin-entry"><span>{x.table?fmtDate(x.date):historyMonth} · {x.kind}<small>{x.label}</small></span><strong>{pesos(x.amount)}</strong>{!x.table&&<button type="button" className="fin-remove" aria-label="Quitar pago Nu confirmado" title="Quitar pago Nu confirmado" onClick={()=>{setHistoryOpen(false);removeConfirmedNu()}}><Trash2 size={15}/></button>}{x.table&&<button className="fin-remove" aria-label="Eliminar movimiento" title="Eliminar" onClick={()=>del(x.table,x.id)}><Trash2 size={15}/></button>}</div>):<p className="fin-muted">No hay movimientos con estos filtros.</p>}</div></section></div>}
  </>}
 </main>;
}
