import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../i18n/Language';
import { Plus, Trash2, Wallet, CalendarDays, Target, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import './FinanceDashboard.css';

const START={nu_balance:10974592.35,pila_balance:2643800,buffer:100000,monthly_salary:3000000,extra_monthly:0,house:1500000,study:900000,nu_target:1043400,pila_target:220400,health:500000,health_refund:500000,personal_budget:0,goal_date:'2027-10-18'};
const money=n=>new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(Number(n)||0);
const dateISO=()=>new Date().toLocaleDateString('en-CA');
const initialExpense={date:dateISO(),amount:'',category:'Otro',note:''};
const initialPayment={title:'',amount:'',due_date:dateISO(),status:'pending',category:'Otro'};
const monthOf=date=>(date||'').slice(0,7);
const nowMonth=()=>dateISO().slice(0,7);

export default function FinanceDashboard(){
 const {role,user}=useOutletContext();
 const {language}=useLanguage(),en=language==='en';
 const [settings,setSettings]=useState(START),[expenses,setExpenses]=useState([]),[bills,setBills]=useState([]);
 const [month,setMonth]=useState(nowMonth()),[expense,setExpense]=useState(initialExpense),[bill,setBill]=useState(initialPayment);
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),[ready,setReady]=useState(false),[saving,setSaving]=useState(false);
 const [configOpen,setConfigOpen]=useState(false);
 const own=user?.id;
 const load=async()=>{
   if(!own)return;setBusy(true);setError('');
   try{
     const [a,b,c]=await Promise.all([
       supabase.from('personal_finance_settings').select('*').eq('user_id',own).maybeSingle(),
       supabase.from('personal_finance_expenses').select('*').eq('user_id',own).order('date',{ascending:false}).limit(1000),
       supabase.from('personal_finance_bills').select('*').eq('user_id',own).order('due_date',{ascending:true}).limit(1000)
     ]);
     for(const result of [a,b,c])if(result.error)throw result.error;
     if(a.data)setSettings({...START,...a.data});
     setExpenses(b.data||[]);setBills(c.data||[]);setReady(true);
   }catch(err){setError(err.code==='42P01'||err.code==='PGRST205'?'Falta instalar las tablas privadas de Finanzas.AI en Supabase. Consulta el archivo SQL del repositorio.':err.message||'No se pudieron cargar los datos.');setReady(false);}
   finally{setBusy(false);}
 };
 useEffect(()=>{load();},[own]);
 const monthExpenses=useMemo(()=>expenses.filter(e=>monthOf(e.date)===month),[expenses,month]);
 const monthlySpent=monthExpenses.reduce((a,e)=>a+Number(e.amount),0);
 const due=bills.filter(b=>monthOf(b.due_date)===month);
 const unpaid=due.filter(b=>b.status!=='paid');
 const unpaidTotal=unpaid.reduce((a,b)=>a+Number(b.amount),0);
 const monthlyIncome=Number(settings.monthly_salary)+Number(settings.extra_monthly)+Number(settings.health_refund);
 const monthlyFixed=Number(settings.house)+Number(settings.study)+Number(settings.health)+Number(settings.nu_target)+Number(settings.pila_target)+Number(settings.personal_budget);
 const projected=monthlyIncome-monthlyFixed-monthlySpent;
 const totalDebt=Number(settings.nu_balance)+Number(settings.pila_balance);
 const targetTotal=10974592.35+2643800;
 const progress=Math.max(0,Math.min(100,(1-totalDebt/targetTotal)*100));
 const suggested=[];
 if(unpaid.length)suggested.push('Revisa los '+unpaid.length+' pagos pendientes del mes y confirma sus fechas de vencimiento.');
 if(projected<0)suggested.push('Tu presupuesto proyecta un déficit de '+money(-projected)+'. Evita abonos extraordinarios hasta cubrirlo.');
 if(Number(settings.buffer)<500000)suggested.push('Protege tu colchón actual. Prioriza llegar a $500.000 sin usar crédito.');
 if(Number(settings.health_refund)>0)suggested.push('Confirma que recibiste el reembolso de aportes antes de contarlo como dinero disponible.');
 if(monthlySpent>Number(settings.personal_budget)&&Number(settings.personal_budget)>0)suggested.push('Tus gastos diarios superan el presupuesto personal configurado.');
 if(!suggested.length)suggested.push('Mantén la tarjeta sin nuevas compras y registra cada gasto al finalizar el día.');
 const put=async(table,data,reset)=>{
   if(!ready||saving)return;setSaving(true);setError('');
   try{const {error:err}=await supabase.from(table).insert({...data,user_id:own});if(err)throw err;reset();await load();}
   catch(err){setError(err.message||'No se pudo guardar.');}finally{setSaving(false);}
 };
 const remove=async(table,id)=>{if(!ready||!window.confirm('¿Eliminar este registro?'))return;setSaving(true);const {error:err}=await supabase.from(table).delete().eq('id',id).eq('user_id',own);if(err)setError(err.message);else await load();setSaving(false);};
 const saveSettings=async()=>{if(!ready)return;setSaving(true);setError('');const clean=Object.fromEntries(Object.keys(START).map(key=>[key,key==='goal_date'?settings[key]:Math.max(0,Number(settings[key])||0)]));const {error:err}=await supabase.from('personal_finance_settings').upsert({user_id:own,...clean},{onConflict:'user_id'});if(err)setError(err.message);else{setConfigOpen(false);await load();}setSaving(false);};
 const markPaid=async(b)=>{const {error:err}=await supabase.from('personal_finance_bills').update({status:b.status==='paid'?'pending':'paid'}).eq('id',b.id).eq('user_id',own);if(err)setError(err.message);else await load();};
 if(role!=='super_admin')return <p>Acceso restringido al administrador.</p>;
 return <main className="fin-page">
   <div className="fin-intro"><div><p className="fin-eyebrow">CONTROL PERSONAL · PRIVADO</p><h2>Tu libertad financiera, día a día</h2><p>Registra los movimientos reales. Las proyecciones no sustituyen los saldos oficiales de Nu y PILA.</p></div><div className="fin-actions"><button onClick={()=>setConfigOpen(v=>!v)} className="fin-secondary"><Target size={16}/> Ajustar metas</button><button className="fin-secondary" onClick={load} disabled={busy}><RefreshCw size={16}/> Actualizar</button></div></div>
   {error&&<div className="fin-error" role="alert"><AlertTriangle size={18}/>{error}</div>}
   {!ready?<p className="fin-empty">{busy?'Cargando información privada...':'Configura primero las tablas de Supabase para registrar tus finanzas con seguridad.'}</p>:<>
   <div className="fin-kpis">
     <article><span>Deuda identificada</span><strong>{money(totalDebt)}</strong><small>Nu {money(settings.nu_balance)} · PILA {money(settings.pila_balance)}</small></article>
     <article><span>Gastos registrados este mes</span><strong>{money(monthlySpent)}</strong><small>{monthExpenses.length} movimientos</small></article>
     <article><span>Pendiente de pagar este mes</span><strong>{money(unpaidTotal)}</strong><small>{unpaid.length} compromisos sin marcar</small></article>
     <article className={projected<0?'fin-negative':'fin-positive'}><span>Disponible proyectado</span><strong>{money(projected)}</strong><small>Ingresos menos metas, presupuesto y gastos registrados</small></article>
   </div>
   <section className="fin-panel"><div className="fin-line"><div><h3>Meta de liberarte de las deudas</h3><p>Fecha objetivo: {settings.goal_date} · actualiza saldos al recibir extractos o comprobantes</p></div><strong>{progress.toFixed(1)} %</strong></div><div className="fin-track"><div style={{width:progress+'%'}}/></div><p>Falta por cubrir {money(totalDebt)} de Nu y PILA, sin incluir intereses futuros ni mora no liquidada.</p></section>
   {configOpen&&<section className="fin-panel"><h3>Metas y presupuesto mensual</h3><div className="fin-fields">{Object.entries({nu_balance:'Saldo Nu',pila_balance:'PILA pendiente',buffer:'Colchón actual',monthly_salary:'Salario neto mensual',extra_monthly:'Horas adicionales cobradas / ingreso extra',house:'Aporte a casa',study:'Maestría',nu_target:'Meta de pago mensual Nu',pila_target:'Meta mensual PILA atrasada',health:'Aporte de salud y pensión',health_refund:'Reembolso confirmado de Blu',personal_budget:'Otros gastos esenciales / presupuesto personal'}).map(([key,label])=><label key={key}>{label}<input type="number" min="0" step="100" value={settings[key]} onChange={e=>setSettings(s=>({...s,[key]:e.target.value}))}/></label>)}<label>Fecha objetivo<input type="date" value={settings.goal_date||''} onChange={e=>setSettings(s=>({...s,goal_date:e.target.value}))}/></label></div><button disabled={saving} className="fin-primary" onClick={saveSettings}>Guardar presupuesto privado</button></section>}
   <div className="fin-line fin-month"><h3><CalendarDays size={19}/> Movimientos y vencimientos</h3><label>Mes <input type="month" value={month} onChange={e=>setMonth(e.target.value)}/></label></div>
   <div className="fin-grid">
     <section className="fin-panel"><h3>Agregar gasto diario</h3><form onSubmit={e=>{e.preventDefault();if(Number(expense.amount)<=0)return;put('personal_finance_expenses',{date:expense.date,amount:Number(expense.amount),category:expense.category,note:expense.note.trim()},()=>setExpense(initialExpense));}}><div className="fin-fields"><label>Fecha<input type="date" required value={expense.date} onChange={e=>setExpense(s=>({...s,date:e.target.value}))}/></label><label>Valor COP<input type="number" min="1" required value={expense.amount} onChange={e=>setExpense(s=>({...s,amount:e.target.value}))}/></label><label>Categoría<select value={expense.category} onChange={e=>setExpense(s=>({...s,category:e.target.value}))}>{['Alimentación','Transporte','Casa','Estudio','Salud','Impulso','Ocio','Otro'].map(x=><option key={x}>{x}</option>)}</select></label><label>Descripción<input maxLength="180" value={expense.note} onChange={e=>setExpense(s=>({...s,note:e.target.value}))} placeholder="¿En qué se fue el dinero?"/></label></div><button disabled={saving} className="fin-primary"><Plus size={16}/> Guardar gasto</button></form>
      <div className="fin-items">{monthExpenses.length?monthExpenses.map(x=><div key={x.id} className="fin-item"><div><strong>{money(x.amount)}</strong><small>{x.date} · {x.category}{x.note?' · '+x.note:''}</small></div><button aria-label="Eliminar gasto" onClick={()=>remove('personal_finance_expenses',x.id)}><Trash2 size={16}/></button></div>):<p className="fin-muted">Todavía no hay gastos registrados este mes.</p>}</div>
     </section>
     <section className="fin-panel"><h3>Pagos y obligaciones del mes</h3><form onSubmit={e=>{e.preventDefault();if(Number(bill.amount)<=0||!bill.title.trim())return;put('personal_finance_bills',{title:bill.title.trim(),amount:Number(bill.amount),due_date:bill.due_date,status:'pending',category:bill.category},()=>setBill(initialPayment));}}><div className="fin-fields"><label>Concepto<input required maxLength="100" value={bill.title} onChange={e=>setBill(s=>({...s,title:e.target.value}))} placeholder="Nu, PILA, casa..."/></label><label>Valor COP<input type="number" required min="1" value={bill.amount} onChange={e=>setBill(s=>({...s,amount:e.target.value}))}/></label><label>Vence<input type="date" required value={bill.due_date} onChange={e=>setBill(s=>({...s,due_date:e.target.value}))}/></label><label>Tipo<select value={bill.category} onChange={e=>setBill(s=>({...s,category:e.target.value}))}>{['Nu','PILA','Casa','Maestría','Servicios','Otro'].map(x=><option key={x}>{x}</option>)}</select></label></div><button disabled={saving} className="fin-primary"><Plus size={16}/> Agregar pago</button></form>
      <div className="fin-items">{due.length?due.map(x=><div key={x.id} className="fin-item"><button className={x.status==='paid'?'fin-tick is-paid':'fin-tick'} onClick={()=>markPaid(x)} aria-label={x.status==='paid'?'Marcar pendiente':'Marcar pagado'}><CheckCircle2 size={19}/></button><div><strong className={x.status==='paid'?'fin-strike':''}>{x.title} · {money(x.amount)}</strong><small>Vence {x.due_date} · {x.status==='paid'?'Pagado':'Pendiente'}</small></div><button aria-label="Eliminar obligación" onClick={()=>remove('personal_finance_bills',x.id)}><Trash2 size={16}/></button></div>):<p className="fin-muted">Agrega tus pagos del mes para saber qué queda pendiente. No se duplican automáticamente las metas de presupuesto.</p>}</div>
     </section>
   </div>
   <section className="fin-panel fin-suggestions"><h3><Wallet size={19}/> Acciones sugeridas</h3>{suggested.map((x,i)=><p key={i}><CheckCircle2 size={17}/>{x}</p>)}<small>Sugerencias basadas en los registros; no ejecutan pagos ni reemplazan asesoría financiera.</small></section>
   </>}
 </main>;
