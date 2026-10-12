import { useEffect, useState } from 'react';
import { Navigate, useOutletContext } from 'react-router-dom';
import { PawPrint, Utensils, Droplets, Clock3, Plus, Pencil, Trash2, Check, X, CalendarDays, WifiOff } from 'lucide-react';
import { useLanguage } from '../i18n/Language';
import './Arturito.css';
const dayKeys = [1,2,3,4,5,6,0];
const validRoutine = routine => routine && typeof routine.id==='string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(routine.time) && Number.isFinite(routine.grams) && routine.grams>0 && routine.grams<=1000 && Array.isArray(routine.days) && routine.days.length>0 && routine.days.every(day=>Number.isInteger(day)&&day>=0&&day<=6) && typeof routine.enabled==='boolean';
function nextMeal(routines, now) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en', {timeZone:'America/Bogota',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now).map(part=>[part.type,part.value]));
  const date = new Date(parts.year+'-'+parts.month+'-'+parts.day+'T12:00:00Z');
  const events=[];
  for(let offset=0;offset<8;offset++){
    const day=new Date(date);day.setUTCDate(day.getUTCDate()+offset);
    const iso=day.toISOString().slice(0,10);
    for(const routine of routines){if(!routine.enabled||!routine.days.includes(day.getUTCDay()))continue;const at=new Date(iso+'T'+routine.time+':00-05:00');if(at>now)events.push({routine,at});}
  }
  return events.sort((a,b)=>a.at-b.at)[0];
}
export default function Arturito(){
  const state=useOutletContext();
  return state.role==='super_admin'?<BetaWorkspace key={state.user.id} user={state.user}/>:<Navigate to="/panel" replace/>;
}
function BetaWorkspace({user}){
  const {language}=useLanguage(),en=language==='en';
  const t=(es,english)=>en?english:es;
  const labels=en?['Sun','Mon','Tue','Wed','Thu','Fri','Sat']:['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  const storageKey='ortegon-arturito-routines-v1:'+user.id;
  const [routines,setRoutines]=useState(()=>{try{const stored=JSON.parse(localStorage.getItem(storageKey)||'[]');return Array.isArray(stored)?stored.filter(validRoutine):[];}catch{return [];}});
  const [now,setNow]=useState(()=>new Date()),[notice,setNotice]=useState('');
  const [editing,setEditing]=useState(null),[time,setTime]=useState('08:00'),[grams,setGrams]=useState(''),[mode,setMode]=useState('daily'),[days,setDays]=useState([...dayKeys]);
  useEffect(()=>{const timer=setInterval(()=>setNow(new Date()),60000);return()=>clearInterval(timer);},[]);
  useEffect(()=>{try{localStorage.setItem(storageKey,JSON.stringify(routines));}catch{setNotice(t('No pudimos guardar las rutinas en este navegador.','Could not save routines in this browser.'));}},[routines,storageKey,language]);
  const next=nextMeal(routines,now);
  const active=routines.filter(routine=>routine.enabled).length;
  const todayDay=new Intl.DateTimeFormat('en',{timeZone:'America/Bogota',weekday:'short'}).format(now);
  const weekday=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(todayDay);
  const todayGrams=routines.filter(routine=>routine.enabled&&routine.days.includes(weekday)).reduce((sum,routine)=>sum+routine.grams,0);
  function reset(){setEditing(null);setTime('08:00');setGrams('');setMode('daily');setDays([...dayKeys]);}
  function edit(routine){setEditing(routine.id);setTime(routine.time);setGrams(String(routine.grams));setMode(routine.days.length===7?'daily':'custom');setDays([...routine.days]);document.getElementById('arturito-routine-time')?.focus();}
  function save(event){
    event.preventDefault();
    const chosenDays=mode==='daily'?[...dayKeys]:days;
    const value=Number(grams);
    if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)||!value||value<1||value>1000||!chosenDays.length){setNotice(t('Define hora, cantidad y al menos un día.','Set a time, amount and at least one day.'));return;}
    if(routines.some(routine=>routine.id!==editing&&routine.time===time&&routine.days.some(day=>chosenDays.includes(day)))){setNotice(t('Ya hay una rutina a esa hora en alguno de los días elegidos.','A routine already uses that time on one of the selected days.'));return;}
    const routine={id:editing||crypto.randomUUID(),time,grams:value,days:chosenDays,enabled:editing?routines.find(item=>item.id===editing)?.enabled??true:true};
    setRoutines(current=>editing?current.map(item=>item.id===editing?routine:item):[...current,routine]);
    setNotice(t('Rutina guardada en este navegador. No se enviará comida: el dispositivo no está conectado.','Routine saved in this browser. No food will be dispensed: the device is not connected.'));reset();
  }
  return <div className="arturito-beta">
    <header className="arturito-heading"><div className="arturito-project"><span className="arturito-mark"><PawPrint size={25}/></span><div><h1>arturito<span className="arturito-brand-dot">.</span> <span className="arturito-beta-tag">Beta</span></h1><p className="arturito-slogan">{t('Un amigo para tu mejor amigo.','A friend for your best friend.')}</p><small className="arturito-signature">by Soluciones Tecnológicas Ortegón</small></div></div><span className="arturito-connection"><WifiOff size={14}/>{t('Demo · Sin dispositivo','Demo · No device')}</span></header>
    <section className="arturito-demo-banner"><strong>{t('Vista previa del producto','Product preview')}</strong><span>{t('Los niveles son simulados. Las rutinas se guardan localmente; no ejecutan dispensaciones.','Levels are simulated. Routines are saved locally and do not dispense food.')}</span></section>
    <div className="arturito-columns">
      <div className="arturito-overview">
        <section className="arturito-card"><header><h2>{t('Reservas del dispositivo','Device supplies')}</h2><span className="arturito-pill">{t('Datos demo','Demo data')}</span></header><div className="arturito-levels">
          <Level icon={Utensils} value={65} title={t('Alimento','Food')} description={t('Depósito de alimento seco','Dry food reservoir')} kind="food"/>
          <Level icon={Droplets} value={82} title={t('Agua','Water')} description={t('Depósito de agua','Water reservoir')} kind="water"/>
        </div></section>
        <section className="arturito-card arturito-next"><header><h2>{t('Próxima alimentación','Next feeding')}</h2><Clock3 size={18}/></header>{next?<><strong>{new Intl.DateTimeFormat(en?'en-US':'es-CO',{timeZone:'America/Bogota',hour:'2-digit',minute:'2-digit'}).format(next.at)}</strong><p>{new Intl.DateTimeFormat(en?'en-US':'es-CO',{timeZone:'America/Bogota',dateStyle:'medium'}).format(next.at)} · {next.routine.grams} g</p><span>{t('Programación de prueba · Hora de Bogotá','Preview schedule · Bogotá time')}</span></>:<div className="arturito-empty"><CalendarDays size={25}/><p>{t('Crea una rutina para ver la próxima alimentación.','Create a routine to preview the next feeding.')}</p></div>}</section>
        <div className="arturito-mini-stats"><div><span>{t('Rutinas activas','Active routines')}</span><strong>{active}</strong></div><div><span>{t('Programado para hoy','Scheduled today')}</span><strong>{todayGrams}<small> g</small></strong></div></div>
      </div>
      <section className="arturito-card arturito-routines"><header><h2>{t('Rutinas de alimentación','Feeding routines')}</h2><CalendarDays size={18}/></header>
        <form onSubmit={save} className="arturito-routine-form"><div className="arturito-form-heading"><strong>{editing?t('Editar rutina','Edit routine'):t('Nueva rutina','New routine')}</strong>{editing&&<button type="button" className="compact-action" aria-label={t('Cancelar edición','Cancel editing')} title={t('Cancelar edición','Cancel editing')} onClick={reset}><X size={16}/></button>}</div><div className="arturito-form-fields"><label htmlFor="arturito-routine-time">{t('Hora','Time')}<input id="arturito-routine-time" type="time" required value={time} onChange={event=>setTime(event.target.value)}/></label><label htmlFor="arturito-routine-amount">{t('Porción (g)','Portion (g)')}<input id="arturito-routine-amount" type="number" min="1" max="1000" step="1" required placeholder="—" value={grams} onChange={event=>setGrams(event.target.value)}/></label></div><fieldset><legend>{t('Repetición','Repeat')}</legend><div className="arturito-repeat"><button type="button" aria-pressed={mode==='daily'} onClick={()=>setMode('daily')}>{t('Todos los días','Every day')}</button><button type="button" aria-pressed={mode==='custom'} onClick={()=>setMode('custom')}>{t('Elegir días','Choose days')}</button></div>{mode==='custom'&&<div className="arturito-weekdays">{dayKeys.map(day=><label key={day}><input type="checkbox" checked={days.includes(day)} onChange={event=>setDays(current=>event.target.checked?[...current,day]:current.filter(item=>item!==day))}/><span>{labels[day]}</span></label>)}</div>}</fieldset><div className="arturito-save-row"><small>{t('Zona horaria: Bogotá (UTC−5)','Time zone: Bogotá (UTC−5)')}</small><button type="submit"><Check size={16}/>{editing?t('Guardar cambios','Save changes'):t('Crear rutina','Create routine')}</button></div></form>
        <div className="arturito-routine-list">{routines.length?[...routines].sort((a,b)=>a.time.localeCompare(b.time)).map(routine=><article key={routine.id} className={!routine.enabled?'is-paused':''}><span className="arturito-routine-icon"><Utensils size={18}/></span><div className="arturito-routine-copy"><strong>{routine.time}<span>{routine.grams} g</span></strong><p>{routine.days.length===7?t('Todos los días','Every day'):dayKeys.filter(day=>routine.days.includes(day)).map(day=>labels[day]).join(' · ')}</p></div><button type="button" className="arturito-toggle" aria-label={t('Activar rutina de ','Enable routine at ')+routine.time} aria-pressed={routine.enabled} title={routine.enabled?t('Pausar rutina','Pause routine'):t('Activar rutina','Enable routine')} onClick={()=>setRoutines(current=>current.map(item=>item.id===routine.id?{...item,enabled:!item.enabled}:item))}><span/></button><button className="compact-action" type="button" aria-label={t('Editar rutina de ','Edit routine at ')+routine.time} title={t('Editar','Edit')} onClick={()=>edit(routine)}><Pencil size={15}/></button><button className="compact-action" type="button" aria-label={t('Eliminar rutina de ','Delete routine at ')+routine.time} title={t('Eliminar','Delete')} onClick={()=>{setRoutines(current=>current.filter(item=>item.id!==routine.id));if(editing===routine.id)reset();setNotice(t('Rutina eliminada.','Routine deleted.'));}}><Trash2 size={15}/></button></article>):<div className="arturito-empty"><Plus size={24}/><p>{t('Todavía no hay rutinas. Define una hora y porción para empezar.','No routines yet. Set a time and portion to get started.')}</p></div>}</div>
        {notice&&<p className="arturito-notice" role="status">{notice}</p>}
      </section>
    </div>
    <footer className="arturito-footnote">{t('Configura las porciones según las necesidades de tu mascota. Arturito Beta no calcula una dieta ni confirma que el perro haya comido.','Set portions according to your pet’s needs. Arturito Beta does not calculate a diet or confirm that the dog has eaten.')}</footer>
  </div>;
}
function Level({icon:Icon,value,title,description,kind}){return <article className={'arturito-level '+kind}><div className="arturito-level-heading"><Icon size={19}/><strong>{title}</strong></div><div className="arturito-gauge" style={{'--level':value+'%'}}><span>{value}<small>%</small></span></div><progress value={value} max="100" aria-label={title}/><p>{description}</p></article>;}
