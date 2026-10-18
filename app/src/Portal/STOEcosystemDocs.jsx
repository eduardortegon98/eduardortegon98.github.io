import { Navigate, useOutletContext } from 'react-router-dom';
import { BrainCircuit, BarChart3, Store, PawPrint, UtensilsCrossed, Stethoscope, Building2, Plus, Mic, MessageSquare, FileText, Globe2, Smartphone, ShieldCheck, Database, Cloud, Plug, Activity, Blocks, CircleCheck, BookOpen } from 'lucide-react';
import { STO_CONTEXT,STO_CONTEXT_VERSION } from '../OrtDeskAI/stoContext';
import './STOEcosystemDocs.css';
const tenantIcons=[PawPrint,Store,UtensilsCrossed,Stethoscope,Building2,Plus];
const inputs=[MessageSquare,Mic,FileText,MessageSquare,Globe2,Smartphone];
const infraIcons=[Blocks,Database,Cloud,ShieldCheck,Plug,Activity];
const mIcons=[Database,Blocks,ShieldCheck];
export default function STOEcosystemDocs(){
 const {role}=useOutletContext();
 if(role!=='super_admin')return <Navigate to="/panel" replace/>;
 return <main className="sto-map-page">
  <div className="sto-map">
   <header className="sto-map-top">
     <div className="sto-map-logo">ST<span>O</span></div>
     <div className="sto-map-title"><h1>Soluciones Tecnológicas Ortegón (STO)</h1><p>Tecnología que construye oportunidades</p></div>
     <div className="sto-map-vision"><CircleCheck/><div><strong>Visión</strong><p>{STO_CONTEXT.vision}</p></div></div>
   </header>
   <section className="sto-map-clients">
    <div className="sto-map-heading"><h2>Clientes / Negocios</h2><p>Diferentes industrias, diferentes necesidades, una misma plataforma.</p></div>
    {[...STO_CONTEXT.tenants,{title:'Nuevos negocios',sector:'Cualquier industria',type:'ejemplo'}].map((c,i)=>{const Icon=tenantIcons[i];return <article key={c.title} className={'sto-map-client sto-map-client-'+i}><Icon/><strong>{c.title}</strong><small>{c.sector}{i===0?' · Piloto':''}</small></article>})}
   </section>
   <div className="sto-map-core-row">
    <aside className="sto-map-inputs">{STO_CONTEXT.ortex.inputs.map((t,i)=>{const Icon=inputs[i];return <div key={t}><Icon/><span>{t}</span></div>})}</aside>
    <div className="sto-map-input-arrow">Entrada desde cualquier canal <span>→</span></div>
    <section className="sto-map-ortex">
      <div className="sto-map-ortex-main"><BrainCircuit/><div><h2>Ortex</h2><p>La inteligencia que entiende, planifica y construye soluciones</p></div></div>
      <ul>{STO_CONTEXT.ortex.capabilitiesPlanned.map(t=><li key={t}><CircleCheck/>{t}</li>)}</ul>
    </section>
   </div>
   <div className="sto-map-down">↓</div>
   <section className="sto-map-infra">
     <h2>Infraestructura STO</h2><p>Servicios compartidos, seguros y escalables para todos los negocios.</p>
     <div className="sto-map-infra-grid">{STO_CONTEXT.infrastructure.map((x,i)=>{const Icon=infraIcons[i];return <article key={x.title}><Icon/><strong>{x.title}</strong><small>{x.description}</small></article>})}</div>
   </section>
   <div className="sto-map-down">↓</div>
   <section className="sto-map-tenants">
    <div className="sto-map-heading"><h2>Soluciones / Tenants</h2><p>Cada negocio tiene su propia solución, datos y dominio. Comparten infraestructura, no información privada.</p></div>
    {STO_CONTEXT.tenants.map((t,i)=>{const Icon=tenantIcons[i];return <article key={t.title} className={'sto-map-tenant sto-map-tenant-'+i}><div className="sto-map-tenant-header"><Icon/><strong>{t.title}</strong>{t.type==='piloto'&&<span>Piloto</span>}</div><ul>{t.details.map(d=><li key={d}>✓ {d}</li>)}</ul><div className="sto-map-domain">{t.type==='piloto'?'Primer caso real':'Ejemplo futuro'}</div></article>})}
   </section>
   <section className="sto-map-lower">
    <div className="sto-map-revenue"><h2>Modelo de negocio</h2><div>{STO_CONTEXT.businessModel.map((m,i)=>{const Icon=mIcons[i];return <article key={m.name}><Icon/><strong>{m.name}</strong><ul>{m.items.map(it=><li key={it}>✓ {it}</li>)}</ul><small>Ingresos {m.type}</small></article>})}</div></div>
    <div className="sto-map-process"><h2>Flujo de creación de una solución</h2><div className="sto-map-steps">{STO_CONTEXT.process.map((x,i)=><div key={x}><span>{i+1}</span><strong>{x}</strong></div>)}</div><p>Tiempo objetivo: 20 minutos (según alcance y validaciones)</p></div>
   </section>
   <footer className="sto-map-footer"><strong>Evolución</strong>{STO_CONTEXT.roadmap.map((s,i)=><span key={s}><b>{i+1}</b>{s}</span>)}</footer>
  </div>
  <p className="sto-map-note"><BookOpen size={16}/> Documento estratégico v{STO_CONTEXT_VERSION}. Representa objetivos y ejemplos, no capacidades operativas ya desplegadas. Contexto estructurado disponible para futura integración con Ortex; conexión desactivada.</p>
 </main>
}
