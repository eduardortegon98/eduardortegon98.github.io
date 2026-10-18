import ModuleBrand from '../Portal/ModuleBrand';
import { useEffect, useRef, useState } from 'react';
import { Navigate, useOutletContext } from 'react-router-dom';
import { PawPrint, Utensils, Droplets, Clock3, Plus, Pencil, Trash2, Check, X, CalendarDays, WifiOff, HeartPulse, CloudDrizzle, ChevronLeft, ChevronRight, Repeat2 } from 'lucide-react';
import { useLanguage } from '../i18n/Language';
import './Arturito.css';
const dayKeys = [1,2,3,4,5,6,0];
const validDate = value => typeof value==='string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(value+'T12:00:00Z').getTime()) && new Date(value+'T12:00:00Z').toISOString().slice(0,10)===value;
const isoDay = now => {const parts=Object.fromEntries(new Intl.DateTimeFormat('en',{timeZone:'America/Bogota',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now).map(part=>[part.type,part.value]));return parts.year+'-'+parts.month+'-'+parts.day;};
function addDays(iso,count){const date=new Date(iso+'T12:00:00Z');date.setUTCDate(date.getUTCDate()+count);return date.toISOString().slice(0,10);}
function mondayOf(iso){const weekday=new Date(iso+'T12:00:00Z').getUTCDay();return addDays(iso,-((weekday+6)%7));}
const validRoutine = routine => routine && typeof routine.id==='string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(routine.time) && Number.isFinite(routine.grams) && routine.grams>0 && routine.grams<=1000 && Array.isArray(routine.days) && routine.days.length>0 && routine.days.every(day=>Number.isInteger(day)&&day>=0&&day<=6) && typeof routine.enabled==='boolean' && (routine.repeatWeekly===undefined || typeof routine.repeatWeekly==='boolean') && (!routine.startDate || validDate(routine.startDate)) && (routine.repeatWeekly!==false || (Array.isArray(routine.dates)&&routine.dates.length>0&&routine.dates.every(validDate)));
function occursOn(routine,iso){return routine.repeatWeekly===false ? routine.dates.includes(iso) : (!routine.startDate || iso>=routine.startDate) && routine.days.includes(new Date(iso+'T12:00:00Z').getUTCDay());}
function overlaps(first,second){if(first.time!==second.time)return false;if(first.repeatWeekly!==false && second.repeatWeekly!==false)return first.days.some(day=>second.days.includes(day));const dated=first.repeatWeekly===false?first:second,other=dated===first?second:first;return dated.dates.some(iso=>occursOn(other,iso));}
function nextMeal(routines,now){
  const today=isoDay(now),events=[];
  for(const routine of routines){
    if(!routine.enabled)continue;
    const dates=routine.repeatWeekly===false?routine.dates:Array.from({length:8},(_,offset)=>addDays(routine.startDate && routine.startDate>today?routine.startDate:today,offset));
    for(const iso of dates){if(!occursOn(routine,iso))continue;const at=new Date(iso+'T'+routine.time+':00-05:00');if(at>now)events.push({routine,at});}
  }
  return events.sort((a,b)=>a.at-b.at)[0];
}
export default function Arturito(){
  const state=useOutletContext();
  return (state.role==='super_admin'||state.modules?.includes('arturito'))?<BetaWorkspace key={state.user.id} user={state.user}/>:<Navigate to="/panel" replace/>;
}
function BetaWorkspace({user}){
  const {language}=useLanguage(),en=language==='en';
  const t=(es,english)=>en?english:es;
  const labels=en?['Sun','Mon','Tue','Wed','Thu','Fri','Sat']:['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  const storageKey='ortegon-arturito-routines-v1:'+user.id;
  const [routines,setRoutines]=useState(()=>{try{const stored=JSON.parse(localStorage.getItem(storageKey)||'[]');return Array.isArray(stored)?stored.filter(validRoutine):[];}catch{return [];}});
  const [now,setNow]=useState(()=>new Date()),[notice,setNotice]=useState('');
  const [editing,setEditing]=useState(null),[time,setTime]=useState('08:00'),[grams,setGrams]=useState(''),[days,setDays]=useState([...dayKeys]);
  const [repeatWeekly,setRepeatWeekly]=useState(true),[weekStart,setWeekStart]=useState(()=>mondayOf(isoDay(new Date())));
  useEffect(()=>{const timer=setInterval(()=>setNow(new Date()),60000);return()=>clearInterval(timer);},[]);
  useEffect(()=>{try{localStorage.setItem(storageKey,JSON.stringify(routines));}catch{setNotice(t('No pudimos guardar las rutinas en este navegador.','Could not save routines in this browser.'));}},[routines,storageKey,language]);
  const routineDialog=useRef(null);
  const [managing,setManaging]=useState(false);
  useEffect(()=>{const dialog=routineDialog.current;if(managing&&!dialog.open)dialog.showModal();else if(!managing&&dialog.open)dialog.close();},[managing]);
  const next=nextMeal(routines,now);
  const active=routines.filter(routine=>nextMeal([routine],now)).length;
  const today=isoDay(now);
  const todayGrams=routines.filter(routine=>routine.enabled&&occursOn(routine,today)).reduce((sum,routine)=>sum+routine.grams,0);
  const calendar=dayKeys.map((day,index)=>({day,date:addDays(weekStart,index)}));
  const shortDate=iso=>new Intl.DateTimeFormat(en?'en-US':'es-CO',{day:'numeric',month:'short',timeZone:'UTC'}).format(new Date(iso+'T12:00:00Z'));
  function reset(){setEditing(null);setTime('08:00');setGrams('');setRepeatWeekly(true);setWeekStart(mondayOf(isoDay(new Date())));setDays([...dayKeys]);}
  function edit(routine){setEditing(routine.id);setTime(routine.time);setGrams(String(routine.grams));setRepeatWeekly(routine.repeatWeekly!==false);setWeekStart(mondayOf(routine.repeatWeekly===false?routine.dates[0]:routine.startDate||isoDay(new Date())));setDays([...routine.days]);document.getElementById('arturito-routine-time')?.focus();}
  function save(event){
    event.preventDefault();
    const chosenDays=days;
    const chosenDates=calendar.filter(item=>chosenDays.includes(item.day)).map(item=>item.date);
    const value=Number(grams);
    if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)||!value||value<1||value>1000||!chosenDays.length){setNotice(t('Define hora, cantidad y al menos un día.','Set a time, amount and at least one day.'));return;}
    if(!repeatWeekly && chosenDates.some(iso=>new Date(iso+'T'+time+':00-05:00')<=new Date())){setNotice(t('Alguna fecha u hora ya pasó. Elige fechas futuras o activa la repetición semanal.','A selected date or time has passed. Choose future dates or enable weekly repeat.'));return;}
    const routine={id:editing||crypto.randomUUID(),time,grams:value,days:chosenDays,repeatWeekly,dates:repeatWeekly?[]:chosenDates,startDate:weekStart,enabled:editing?routines.find(item=>item.id===editing)?.enabled??true:true};
    if(routines.some(item=>item.id!==editing&&overlaps(item,routine))){setNotice(t('Ya hay una comida a esa hora en alguno de los días o fechas elegidos.','A meal already uses that time on one of the selected days or dates.'));return;}
    setRoutines(current=>editing?current.map(item=>item.id===editing?routine:item):[...current,routine]);
    setNotice(t('Rutina guardada en este navegador. No se enviará comida: el dispositivo no está conectado.','Routine saved in this browser. No food will be dispensed: the device is not connected.'));reset();
  }
  return <div className="arturito-beta">
    <header className="arturito-heading"><div className="arturito-project"><span className="arturito-mark"><PawPrint size={25}/></span><div><h1><ModuleBrand id="arturito"/> <span className="arturito-beta-tag">Beta</span></h1><p className="arturito-slogan">{t('Un amigo para tu mejor amigo.','A friend for your best friend.')}</p><small className="arturito-signature">by Soluciones Tecnológicas Ortegón</small></div></div><span className="arturito-connection"><WifiOff size={14}/>{t('Demo · Sin dispositivo','Demo · No device')}</span><div className="arturito-mini-stats"><div><span>{t('Rutinas activas','Active routines')}</span><strong>{active}</strong></div><div><span>{t('Programado para hoy','Scheduled today')}</span><strong>{todayGrams}<small> g</small></strong></div></div></header>
    <section className="arturito-demo-banner"><strong>{t('Vista previa del producto','Product preview')}</strong><span>{t('Los niveles son simulados. Las rutinas se guardan localmente; no ejecutan dispensaciones.','Levels are simulated. Routines are saved locally and do not dispense food.')}</span></section>
    <div className="arturito-columns">
      <div className="arturito-overview">
        <section className="arturito-card"><header><h2>{t('Estado y sensores','Status and sensors')}</h2><span className="arturito-telemetry-status" title={t('Indicador de simulación: no hay lecturas de sensores reales.','Simulation indicator: no real sensor readings.')}><i aria-hidden="true"/>{t('Simulación','Simulation')}</span></header><div className="arturito-levels">
          <Level icon={Utensils} value={65} title={t('Alimento','Food')} description={t('Depósito de alimento seco','Dry food reservoir')} kind="food"/>
          <Level icon={Droplets} value={82} title={t('Agua','Water')} description={t('Depósito de agua','Water reservoir')} kind="water"/>
          <Level icon={CloudDrizzle} value={55} title={t('Humedad','Humidity')} description={t('Humedad ambiental · Demo','Ambient humidity · Demo')} kind="humidity"/>
          <article className="arturito-level pulse"><div className="arturito-level-heading"><HeartPulse size={19}/><strong>{t('Pulsaciones','Heart rate')}</strong></div><div className="arturito-pulse-reading"><HeartPulse size={38} aria-hidden="true"/><strong>— <small>bpm</small></strong></div><p>{t('Sin sensor de pulso conectado','No heart-rate sensor connected')}</p></article>
        </div></section>

      </div>
      <div className="arturito-planning-grid"><section className="arturito-card arturito-next"><header><h2>{t('Próxima alimentación','Next feeding')}</h2><button type="button" className="arturito-manage-button" onClick={()=>{reset();setNotice('');setManaging(true);}}><CalendarDays size={16}/>{t('Gestionar rutinas','Manage routines')}</button></header>{next?<><strong>{new Intl.DateTimeFormat(en?'en-US':'es-CO',{timeZone:'America/Bogota',hour:'2-digit',minute:'2-digit'}).format(next.at)}</strong><p>{new Intl.DateTimeFormat(en?'en-US':'es-CO',{timeZone:'America/Bogota',dateStyle:'medium'}).format(next.at)} · {next.routine.grams} g</p><span>{t('Programación de prueba · Hora de Bogotá','Preview schedule · Bogotá time')}</span></>:<div className="arturito-empty"><CalendarDays size={25}/><p>{t('Crea una rutina para ver la próxima alimentación.','Create a routine to preview the next feeding.')}</p></div>}</section></div>
    </div>
    <dialog ref={routineDialog} className="arturito-routine-dialog" onCancel={()=>setManaging(false)} onClose={()=>setManaging(false)} aria-label={t('Gestionar rutinas de alimentación','Manage feeding routines')}><section className="arturito-card arturito-routines"><header><h2>{t('Rutinas de alimentación','Feeding routines')}</h2><button type="button" className="compact-action" aria-label={t('Cerrar','Close')} title={t('Cerrar','Close')} onClick={()=>setManaging(false)}><X size={18}/></button></header>
        <form onSubmit={save} className="arturito-routine-form"><div className="arturito-form-heading"><strong>{editing?t('Editar rutina','Edit routine'):t('Nueva rutina','New routine')}</strong>{editing&&<button type="button" className="compact-action" aria-label={t('Cancelar edición','Cancel editing')} title={t('Cancelar edición','Cancel editing')} onClick={reset}><X size={16}/></button>}</div><div className="arturito-form-fields"><label htmlFor="arturito-routine-time">{t('Hora','Time')}<input id="arturito-routine-time" type="time" required value={time} onChange={event=>setTime(event.target.value)}/></label><label htmlFor="arturito-routine-amount">{t('Porción (g)','Portion (g)')}<input id="arturito-routine-amount" type="number" min="1" max="1000" step="1" required placeholder="—" value={grams} onChange={event=>setGrams(event.target.value)}/></label></div><fieldset className="arturito-calendar"><legend>{t('Calendario de alimentación','Feeding calendar')}</legend><div className="arturito-calendar-toolbar"><button type="button" className="compact-action" aria-label={t('Semana anterior','Previous week')} title={t('Semana anterior','Previous week')} onClick={()=>setWeekStart(value=>addDays(value,-7))}><ChevronLeft size={17}/></button><strong>{shortDate(weekStart)} — {shortDate(addDays(weekStart,6))}</strong><button type="button" className="compact-action" aria-label={t('Semana siguiente','Next week')} title={t('Semana siguiente','Next week')} onClick={()=>setWeekStart(value=>addDays(value,7))}><ChevronRight size={17}/></button></div><div className="arturito-calendar-days">{calendar.map(item=><button key={item.date} type="button" aria-pressed={days.includes(item.day)} aria-label={labels[item.day]+', '+shortDate(item.date)} className={item.date===today?'is-today':''} onClick={()=>setDays(current=>current.includes(item.day)?current.filter(day=>day!==item.day):[...current,item.day])}><span>{labels[item.day]}</span><strong>{Number(item.date.slice(-2))}</strong></button>)}</div><div className="arturito-calendar-actions"><button type="button" onClick={()=>setDays([...dayKeys])}>{t('Toda la semana','Whole week')}</button><button type="button" onClick={()=>setDays([])}>{t('Limpiar','Clear')}</button></div><label className="arturito-weekly-repeat"><Repeat2 size={17}/><span>{t('Repetir cada semana','Repeat every week')}</span><input type="checkbox" checked={repeatWeekly} onChange={event=>setRepeatWeekly(event.target.checked)}/></label><p className="arturito-calendar-note">{repeatWeekly?t('Se repetirá en los días elegidos, desde esta semana, a la misma hora.','Repeats on the selected weekdays from this week, at the same time.'):t('Solo se agendará para las fechas seleccionadas. No se repetirá.','Scheduled only for the selected dates. Does not repeat.')}</p></fieldset><div className="arturito-save-row"><small>{t('Zona horaria: Bogotá (UTC−5)','Time zone: Bogotá (UTC−5)')}</small><button type="submit"><Check size={16}/>{editing?t('Guardar cambios','Save changes'):t('Crear rutina','Create routine')}</button></div></form>
        <div className="arturito-routine-list">{routines.length?[...routines].sort((a,b)=>a.time.localeCompare(b.time)).map(routine=><article key={routine.id} className={!routine.enabled?'is-paused':''}><span className="arturito-routine-icon"><Utensils size={18}/></span><div className="arturito-routine-copy"><strong>{routine.time}<span>{routine.grams} g</span></strong><p>{routine.repeatWeekly===false ? routine.dates.map(shortDate).join(' · ') : dayKeys.filter(day=>routine.days.includes(day)).map(day=>labels[day]).join(' · ')}<span className="arturito-schedule-type">{routine.repeatWeekly===false?t('Sin repetición','Does not repeat'):t('Cada semana','Every week')}</span></p></div><button type="button" className="arturito-toggle" aria-label={t('Activar rutina de ','Enable routine at ')+routine.time} aria-pressed={routine.enabled} title={routine.enabled?t('Pausar rutina','Pause routine'):t('Activar rutina','Enable routine')} onClick={()=>setRoutines(current=>current.map(item=>item.id===routine.id?{...item,enabled:!item.enabled}:item))}><span/></button><button className="compact-action" type="button" aria-label={t('Editar rutina de ','Edit routine at ')+routine.time} title={t('Editar','Edit')} onClick={()=>edit(routine)}><Pencil size={15}/></button><button className="compact-action" type="button" aria-label={t('Eliminar rutina de ','Delete routine at ')+routine.time} title={t('Eliminar','Delete')} onClick={()=>{setRoutines(current=>current.filter(item=>item.id!==routine.id));if(editing===routine.id)reset();setNotice(t('Rutina eliminada.','Routine deleted.'));}}><Trash2 size={15}/></button></article>):<div className="arturito-empty"><Plus size={24}/><p>{t('Todavía no hay rutinas. Define una hora y porción para empezar.','No routines yet. Set a time and portion to get started.')}</p></div>}</div>
        {notice&&<p className="arturito-notice" role="status">{notice}</p>}
      </section></dialog>
    <footer className="arturito-footnote">{t('Configura las porciones según las necesidades de tu mascota. Arturito Beta no calcula una dieta ni confirma que el perro haya comido.','Set portions according to your pet’s needs. Arturito Beta does not calculate a diet or confirm that the dog has eaten.')}</footer>
  </div>;
}
function Level({icon:Icon,value,title,description,kind}){return <article className={'arturito-level '+kind}><div className="arturito-level-heading"><Icon size={19}/><strong>{title}</strong></div><div className="arturito-gauge" style={{'--level':value+'%'}}><span>{value}<small>%</small></span></div><progress value={value} max="100" aria-label={title}/><p>{description}</p></article>;}
