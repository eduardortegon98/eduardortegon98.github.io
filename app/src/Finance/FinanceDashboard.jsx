import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../i18n/Language';
import { Plus, Trash2, RefreshCw } from 'lucide-react';
import './FinanceDashboard.css';

const DEFAULTS={nu_balance:10974592.35,pila_balance:2643800,monthly_salary:3000000,study:900000,house:1500000,extra_monthly:0,health:500000,health_refund:0,nu_target:950000,pila_target:0,buffer:126000,personal_budget:0,goal_date:'2027-10-18'};
const pesos=value=>new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(Number(value)||0);
const localDate=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')};
const currentMonth=()=>localDate().slice(0,7);
const fmtDate=date=>date?new Date(date+'T12:00:00').toLocaleDateString('es-CO',{day:'2-digit',month:'short'}):'';
const initial={date:localDate(),amount:'',category:'Otro',note:''};
export default function FinanceDashboard(){
 const {user,role}=useOutletContext();
 const {language}=useLanguage();
 const en=language==='en';
 const [settings,setSettings]=useState(DEFAULTS),[expenses,setExpenses]=useState([]),[bills,setBills]=useState([]),[extras,setExtras]=useState([]),[incomes,setIncomes]=useState([]);
 const [month,setMonth]=useState(currentMonth()),[tab,setTab]=useState('gasto'),[form,setForm]=useState(initial);
 const [isReady,setReady]=useState(false),[loading,setLoading]=useState(true),[saving,setSaving]=useState(false),[error,setError]=useState(''),[edit,setEdit]=useState(false);
 const [paymentFor,setPaymentFor]=useState('Banco'),[hours,setHours]=useState(''),[historyOpen,setHistoryOpen]=useState(false);
 const owner=user?.id;
 const refresh=async()=>{
  if(!owner)return;
  setLoading(true);setError('');
  try{
   const queries=await Promise.all([
    supabase.from('personal_finance_settings').select('*').eq('user_id',owner).maybeSingle(),
    supabase.from('personal_finance_expenses').select('*').eq('user_id',owner).order('date',{ascending:false}).limit(1000),
    supabase.from('personal_finance_bills').select('*').eq('user_id',owner).order('due_date',{ascending:false}).limit(1000),
    supabase.from('personal_finance_extras').select('*').eq('user_id',owner).order('date',{ascending:false}).limit(1000),
    supabase.from('personal_finance_income').select('*').eq('user_id',owner).order('date',{ascending:false}).limit(1000)
   ]);
   for(const q of queries)if(q.error)throw q.error;
   setSettings({...DEFAULTS,...(queries[0].data||{})});
   setExpenses(queries[1].data||[]);setBills(queries[2].data||[]);setExtras(queries[3].data||[]);setIncomes(queries[4].data||[]);setReady(true);
  }catch(e){setError('No se pudieron cargar los datos. Si no has actualizado Supabase, ejecuta el SQL de OrtFinance. '+(e.message||''));setReady(false)}
  finally{setLoading(false)}
 };
 useEffect(()=>{refresh()},[owner]);
 const filteredExpenses=useMemo(()=>expenses.filter(x=>x.date.slice(0,7)===month),[expenses,month]);
 const paid=bills.filter(x=>x.status==='paid'&&x.due_date.slice(0,7)===month);
 const worked=extras.filter(x=>x.date.slice(0,7)===month);
 const received=incomes.filter(x=>x.date.slice(0,7)===month);
 const totalReceived=received.reduce((a,x)=>a+Number(x.amount),0);
 const hoursTotal=worked.reduce((a,x)=>a+Number(x.hours),0);
 const extraEarned=worked.reduce((a,x)=>a+Number(x.amount),0);
 const spent=filteredExpenses.reduce((a,x)=>a+Number(x.amount),0);
 const ants=filteredExpenses.filter(x=>x.category==='Gasto hormiga').reduce((a,x)=>a+Number(x.amount),0);
 const debtNu=Number(settings.nu_balance),debtPila=Number(settings.pila_balance),master=Number(settings.study);
 const totalDebt=debtNu+debtPila;
 const goal=totalDebt+master; // Master's monthly payment is a separate obligation, not outstanding debt.
 const expected=[{name:'Casa',amount:Number(settings.house)},{name:'Máster',amount:master},{name:'Banco',amount:Number(settings.nu_target)},{name:'PILA atrasada',amount:Number(settings.pila_target)},{name:'Salud y pensión',amount:Number(settings.health)}];
 const remaining=expected.map(x=>({...x,paid:paid.filter(p=>p.category===x.name).reduce((a,p)=>a+Number(p.amount),0)})).map(x=>({...x,remaining:Math.max(0,x.amount-x.paid)}));
 const remainingTotal=remaining.reduce((a,x)=>a+x.remaining,0);
 const actions=[];
 if(remaining.some(x=>x.name==='Banco'&&x.remaining>0))actions.push('Revisa el próximo vencimiento de Nu y separa el dinero de la cuota.');
 if(remaining.some(x=>x.name==='Salud y pensión'&&x.remaining>0))actions.push('Verifica tu planilla de salud y pensión y conserva el comprobante para Blu.');
 if(ants>0)actions.push('Este mes llevas '+pesos(ants)+' en gastos hormiga. Revisa cuáles puedes evitar.');
 if(Number(settings.buffer)<500000)actions.push('Mantén protegido el colchón de '+pesos(settings.buffer)+'.');
 if(!actions.length)actions.push('Vas al día con los pagos registrados. Sigue anotando cada gasto.');
 const save=async()=>{
  if(!isReady||saving)return;
  setError('');setSaving(true);
  try{
   const amount=Number(form.amount),note=form.note.trim();
   if(!form.date||!Number.isFinite(amount)||amount<=0)throw new Error('Ingresa un valor mayor que cero.');
   let table,record;
   if(tab==='ingreso'){table='personal_finance_income';record={date:form.date,amount,source:paymentFor,note};}
   else if(tab==='gasto'){table='personal_finance_expenses';record={date:form.date,amount,category:form.category,note};}
   else if(tab==='pago'){table='personal_finance_bills';record={due_date:form.date,amount,title:note||paymentFor,category:paymentFor,status:'paid'};}
   else {const h=Number(hours);if(!Number.isFinite(h)||h<=0)throw new Error('Indica las horas trabajadas.');table='personal_finance_extras';record={date:form.date,hours:h,amount,note};}
   const {error:e}=await supabase.from(table).insert({...record,user_id:owner});if(e)throw e;
   setForm(initial);setHours('');await refresh();
  }catch(e){setError(e.message||'No se guardó el registro.')}finally{setSaving(false)}
 };
 const del=async(table,id)=>{if(!window.confirm('¿Eliminar este movimiento?'))return;setError('');const {error:e}=await supabase.from(table).delete().eq('id',id).eq('user_id',owner);if(e)setError(e.message);else await refresh()};
 const saveGoals=async()=>{
  setSaving(true);setError('');
  const payload={user_id:owner,...Object.fromEntries(Object.keys(DEFAULTS).map(k=>[k,k==='goal_date'?settings[k]:Math.max(0,Number(settings[k])||0)]))};
  const {error:e}=await supabase.from('personal_finance_settings').upsert(payload,{onConflict:'user_id'});
  if(e)setError(e.message);else{setEdit(false);await refresh()}setSaving(false);
 };
 if(role!=='super_admin')return <p>Solo el administrador puede consultar sus finanzas.</p>;
 const movements=[...filteredExpenses.map(x=>({id:x.id,date:x.date,label:x.note||x.category,amount:x.amount,kind:'Gasto',table:'personal_finance_expenses'})),...paid.map(x=>({id:x.id,date:x.due_date,label:x.title,amount:x.amount,kind:'Pago',table:'personal_finance_bills'})),...worked.map(x=>({id:x.id,date:x.date,label:x.note||'Horas en Blu',amount:x.amount,kind:x.hours+' h extra',table:'personal_finance_extras'})),...received.map(x=>({id:x.id,date:x.date,label:x.note||x.source,amount:x.amount,kind:'Recibí · '+x.source,table:'personal_finance_income'}))].sort((a,b)=>b.date.localeCompare(a.date));
 return <main className="fin-page fin-simple">
  <div className="fin-head"><div><p className="fin-eyebrow">TU LIBRETA PERSONAL</p><h2>OrtFinance.AI</h2><p>Lo que debes, lo que pagas y lo que estás logrando. Sin fórmulas complicadas.</p></div><button className="fin-secondary" onClick={refresh}><RefreshCw size={16}/> Actualizar</button></div>
  {error&&<p className="fin-error" role="alert">{error}</p>}
  {!isReady?<p className="fin-empty">{loading?'Cargando tu libreta...':'Activa las tablas de OrtFinance en Supabase para comenzar.'}</p>:<>
  <div className="fin-overview"><section className="fin-section fin-goal"><div className="fin-line"><div><span className="fin-label">META PARA RETOMAR STO</span><h3>Estar libre de deudas</h3></div><button className="fin-link" onClick={()=>setEdit(!edit)}>{edit?'Cerrar':'Editar cifras'}</button></div><div className="fin-goal-number">{pesos(totalDebt)}</div><p>Esto falta por pagar entre el banco y PILA. El máster es un pago mensual aparte.</p><div className="fin-track"><div style={{width:Math.max(0,Math.min(100,(1-totalDebt/(10974592.35+2643800))*100))+'%'}}/></div><small>Objetivo: {settings.goal_date} · Actualiza los saldos después de pagar.</small></section>
  <section className="fin-section"><h3>Debes</h3><div className="fin-simple-rows"><div><span>Máster <small>Este mes</small></span><strong>{pesos(master)}</strong></div><div><span>Banco · Nu <small>Deuda restante</small></span><strong>{pesos(debtNu)}</strong></div><div><span>PILA <small>Aportes atrasados</small></span><strong>{pesos(debtPila)}</strong></div></div></section>
  <section className="fin-section fin-income"><div className="fin-line"><h3>Recibí</h3><span className="fin-tag">{received.length} ingresos</span></div><div className="fin-income-amount">{pesos(totalReceived)}</div><p>Este mes</p>{received.slice(0,3).map(x=><div className="fin-entry" key={x.id}><span>{fmtDate(x.date)}<small>{x.source}</small></span><strong>{pesos(x.amount)}</strong></div>)}{!received.length&&<p className="fin-muted">Sin ingresos anotados todavía.</p>}</section>
  <section className="fin-section fin-paid"><div className="fin-line"><h3>Pagaste</h3><span className="fin-tag">{paid.length} registros</span></div><p>Cuándo · Cuánto · A quién</p>{paid.length?paid.map(x=><div className="fin-entry" key={x.id}><span>{fmtDate(x.due_date)}<small>{x.title}</small></span><strong>{pesos(x.amount)}</strong></div>):<p className="fin-muted">Todavía no has registrado pagos este mes.</p>}</section>
   <section className="fin-section fin-extras"><div className="fin-line"><h3>Extras</h3><span className="fin-tag">{month}</span></div><div className="fin-simple-rows"><div><span>Trabajadas <small>Horas extra en Blu</small></span><strong>{hoursTotal} h</strong></div><div><span>Ganado en extras</span><strong>{pesos(extraEarned)}</strong></div><div><span>Gastados <small>Gastos diarios registrados</small></span><strong>{pesos(spent)}</strong></div><div><span>Gastos hormiga</span><strong>{pesos(ants)}</strong></div></div></section>
   <section className="fin-section fin-buffer"><div className="fin-line"><h3>Mi colchón</h3><button className="fin-link" onClick={()=>setEdit(true)}>Editar</button></div><div className="fin-buffer-number">{pesos(settings.buffer)}</div><p>Dinero de emergencia disponible. Solo cambia cuando actualices la cifra.</p></section>
  </div>
  <section className="fin-section fin-add"><div className="fin-line"><h3>Agregar movimiento</h3><label className="fin-month">Mes <input type="month" value={month} onChange={e=>setMonth(e.target.value)}/></label></div>
   <div className="fin-tabs">{[['ingreso','Recibí'],['gasto','Gasté'],['pago','Pagué'],['extra','Trabajé extra']].map(([key,title])=><button key={key} className={tab===key?'selected':''} onClick={()=>setTab(key)}>{title}</button>)}</div>
   <form className="fin-simple-form" onSubmit={e=>{e.preventDefault();save()}}>
    <label>Cuándo<input type="date" required value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))}/></label>
    <label>Cuánto (COP)<input type="number" min="1" required placeholder="Ej. 20000" value={form.amount} onChange={e=>setForm(p=>({...p,amount:e.target.value}))}/></label>
    {tab==='ingreso'?<label>De quién<select value={paymentFor} onChange={e=>setPaymentFor(e.target.value)}>{['Blu','Cliente STO','Reembolso','Otro'].map(x=><option key={x}>{x}</option>)}</select></label>:tab==='pago'?<label>A quién<select value={paymentFor} onChange={e=>setPaymentFor(e.target.value)}>{['Banco','Máster','PILA atrasada','Salud y pensión','Casa','Otro'].map(x=><option key={x}>{x}</option>)}</select></label>:tab==='gasto'?<label>Tipo<select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}>{['Otro','Gasto hormiga','Alimentación','Transporte','Salud','Casa','Estudio','Ocio'].map(x=><option key={x}>{x}</option>)}</select></label>:<label>Horas trabajadas<input type="number" min=".25" step=".25" required value={hours} onChange={e=>setHours(e.target.value)} placeholder="Ej. 8"/></label>}
    <label>Detalle (opcional)<input maxLength="180" value={form.note} onChange={e=>setForm(p=>({...p,note:e.target.value}))} placeholder={tab==='ingreso'?'Ej. quincena de Blu':tab==='pago'?'Ej. cuota de octubre':tab==='extra'?'Ej. lunes en Blu':'Ej. café'}/></label>
    <button type="submit" className="fin-primary" disabled={saving}><Plus size={16}/> Guardar</button>
   </form>
  </section>
  <section className="fin-section fin-month-due"><h3>Este mes falta pagar</h3><div className="fin-simple-rows">{remaining.map(x=><div key={x.name}><span>{x.name}</span><strong>{x.remaining<=0?'Pagado':pesos(x.remaining)}</strong></div>)}</div><p className="fin-muted">Los pagos aparecen como cubiertos cuando los registras en «Pagué».</p></section>
  <section className="fin-section fin-tips"><h3>Siguiente paso</h3><div className="fin-action-list">{actions.slice(0,2).map((a,i)=><p key={i}>✓ {a}</p>)}</div></section>
  {edit&&<section className="fin-section"><h3>Actualizar mis cifras</h3><p>Los pagos registrados no disminuyen automáticamente el saldo total de Nu o PILA: confirma el nuevo saldo en sus aplicaciones y actualízalo aquí.</p><div className="fin-settings">{[['nu_balance','Banco · saldo pendiente'],['pila_balance','PILA atrasada · saldo pendiente'],['study','Máster · mensualidad'],['house','Casa · mensualidad'],['nu_target','Banco · pago mensual'],['pila_target','PILA atrasada · pago previsto'],['health','Salud y pensión · mensual'],['buffer','Colchón'],['monthly_salary','Salario mensual'],['extra_monthly','Ingreso extra previsto'],['health_refund','Reembolso de Blu confirmado']].map(([key,label])=><label key={key}>{label}<input type="number" min="0" value={settings[key]} onChange={e=>setSettings(s=>({...s,[key]:e.target.value}))}/></label>)}<label>Fecha meta<input type="date" value={settings.goal_date} onChange={e=>setSettings(s=>({...s,goal_date:e.target.value}))}/></label></div><button className="fin-primary" disabled={saving} onClick={saveGoals}>Guardar mis cifras</button></section>}
  <section className="fin-section fin-history"><div className="fin-line"><h3>Historial de {month}</h3><button className="fin-link" onClick={()=>setHistoryOpen(v=>!v)}>{historyOpen?"Ocultar":"Ver movimientos ("+movements.length+")"}</button></div>{historyOpen&&<>{movements.length?movements.map(x=><div key={x.table+x.id} className="fin-entry"><span>{fmtDate(x.date)} · {x.kind}<small>{x.label}</small></span><strong>{pesos(x.amount)}</strong><button className="fin-remove" aria-label="Eliminar movimiento" title="Eliminar" onClick={()=>del(x.table,x.id)}><Trash2 size={15}/></button></div>):<p className="fin-muted">Tu libreta está vacía este mes. Agrega tu primer movimiento arriba.</p>}</>}</section>
  </>}
 </main>;
}
