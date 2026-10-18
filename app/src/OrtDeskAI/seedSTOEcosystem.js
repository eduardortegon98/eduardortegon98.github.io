import diagramUrl from '../assets/sto-ecosystem.svg?url';
import { readSources, writeSources } from './localKnowledge';

// One versioned source in the admin's knowledge library. It is not yet indexed by Ortex.
const SOURCE_ID = 'sto-ecosystem-strategy-v1';
const FLAG = 'ortdesk:knowledge:seeded:sto-ecosystem-v1';
const knowledge = `# Soluciones Tecnológicas Ortegón — Visión y arquitectura
STO es una empresa que desarrolla soluciones tecnológicas personalizadas para negocios de cualquier tamaño. Su mercado inicial son los pequeños negocios, sin limitar su crecimiento a ellos. El cliente explica su necesidad y presupuesto; STO propone un alcance factible y entrega una solución utilizable.
Ortex es la inteligencia transversal y visión futura de STO. Su objetivo es interpretar solicitudes en texto o voz, identificar límites de presupuesto, proponer alcances para aprobación humana y, con las autorizaciones necesarias, diseñar, construir, probar y desplegar soluciones funcionales en dominios. La entrega en 20 minutos es una meta solo para casos acotados y previamente validados, no una garantía general ni una función ya implementada.
STO comparte infraestructura tecnológica reutilizable: construcción de software, gestión de datos, aprovisionamiento, seguridad, integraciones y monitoreo. Las implementaciones de clientes tienen separación de datos, usuarios, permisos y eventualmente recursos dedicados.
Arturito es el primer proyecto funcional y caso piloto de STO: un producto independiente para mascotas, con identidad propia y el lema «Un amigo para tu mejor amigo». NO es un módulo transversal que todos los clientes de STO utilicen ni es lo mismo que Ortex.
OrtDesk es la gestión de información de negocio; OrtConnect, comunicaciones; OrtSites, sitios y software a medida; OrtAccess, identidad y permisos; OrtLens, análisis; OrtFlow, coordinación de procesos. Su alcance futuro está sujeto a validación y no todas las capacidades están hoy funcionales.
Modelo de negocio: suscripciones por productos reutilizables (SaaS), proyectos personalizados y servicios de implementación, integración, mantenimiento y soporte.
Principios: tecnología accesible y personalizable; vender soluciones útiles, no obligar al cliente a aprender múltiples módulos; separar el núcleo compartido de los productos especializados; verificar seguridad y costos antes del despliegue; no declarar implementado lo que es visión futura.
Este documento es una fuente de conocimiento interna de STO, versión 1, pendiente de indexación y consulta automática con Ortex.`;

export async function seedSTOEcosystem(owner) {
  // Respect a prior deliberate deletion; never restore it automatically on later visits.
  const key = FLAG + ':' + owner;
  if (localStorage.getItem(key) === 'done') return readSources(owner);
  const current = await readSources(owner);
  if (current.some(item => item.id === SOURCE_ID)) {
    localStorage.setItem(key, 'done');
    return current;
  }
  // Fetch the same diagram displayed in the internal admin documentation.
  const result = await fetch(diagramUrl);
  if (!result.ok) throw new Error('sto_diagram_unavailable');
  const blob = await result.blob();
  const source = {
    id: SOURCE_ID,
    title: 'Ecosistema STO — Arquitectura y visión.svg',
    kind: 'image',
    category: 'business',
    origin: 'own',
    originName: '',
    content: knowledge,
    blob,
    size: blob.size + new Blob([knowledge]).size,
    reviewed: false,
    createdAt: new Date().toISOString()
  };
  await writeSources(owner, [source]);
  localStorage.setItem(key, 'done');
  return [...current, { ...source, owner }];
}
