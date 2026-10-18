import { Navigate, useOutletContext } from 'react-router-dom';
import { BookOpen, LockKeyhole, ExternalLink } from 'lucide-react';
import diagram from '../assets/sto-ecosystem.svg';

export default function STOEcosystemDocs() {
  const { role } = useOutletContext();
  if (role !== 'super_admin') return <Navigate to="/panel" replace />;
  return <main style={{maxWidth:1200,margin:'0 auto',padding:'24px 18px 70px'}}>
    <header style={{marginBottom:20}}>
      <p style={{display:'flex',alignItems:'center',gap:8,opacity:.7}}><BookOpen size={18}/> Documentación interna · <LockKeyhole size={16}/> Solo superadministración</p>
      <h1 style={{fontSize:'clamp(1.6rem,3vw,2.4rem)',margin:'8px 0'}}>Ecosistema STO</h1>
      <p>Visión, arquitectura y modelo de negocio · Arturito como primer caso piloto independiente.</p>
    </header>
    <figure style={{margin:0}}>
      <img src={diagram} alt="Mapa de la arquitectura STO: Ortex como motor inteligente, infraestructura compartida y Arturito como primer cliente piloto independiente" style={{display:'block',width:'100%',height:'auto',borderRadius:16}}/>
      <figcaption style={{marginTop:10,opacity:.7,fontSize:13}}>Mapa estratégico editable y versionado en GitHub · No representa funcionalidades ya desplegadas.</figcaption>
    </figure>
    <section style={{marginTop:28}}>
      <h2>Principios de arquitectura</h2>
      <p><strong>STO</strong> desarrolla y comercializa soluciones. <strong>Ortex</strong> aspira a analizar necesidades y presupuestos aprobados, construir, validar y desplegar soluciones según el alcance permitido. La infraestructura ofrece capacidades comunes reutilizables.</p>
      <p><strong>Arturito</strong> es nuestro primer producto y cliente piloto de STO, no un módulo universal. Cada solución futura mantiene su propia identidad, usuarios y separación de datos.</p>
      <h2>Modelo de negocio</h2>
      <p>Suscripciones para productos reutilizables, proyectos personalizados y servicios de implementación y soporte. El objetivo de entregar en 20 minutos aplica únicamente a soluciones de alcance acotado y previamente validadas.</p>
    </section>
  </main>;
}
