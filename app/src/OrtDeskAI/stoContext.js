export const STO_CONTEXT_VERSION='2026-10-18-v2';
export const STO_CONTEXT={
  organization:'Soluciones Tecnológicas Ortegón',
  abbreviation:'STO',
  vision:'Hacer accesible la tecnología personalizada a cualquier negocio, con propuestas ajustadas a sus necesidades y presupuesto.',
  tagline:'Tecnología que construye oportunidades',
  ortex:{role:'Inteligencia y coordinación de construcción de soluciones',inputs:['Texto','Voz','Documentos','WhatsApp','Portal web','Móvil'],capabilitiesPlanned:['Analizar alcance y presupuesto','Proponer soluciones para aprobación','Diseñar y construir','Probar y desplegar','Aprender de resultados autorizados'],status:'Visión futura, no motor de generación y despliegue autónomo en producción'},
  infrastructure:[{title:'Constructor',description:'Genera y ensambla aplicaciones según necesidades'},{title:'Datos',description:'Modelos, permisos y gestión de información'},{title:'Infraestructura',description:'Recursos, configuración de dominios y despliegue'},{title:'Seguridad',description:'Validación, protección y cumplimiento'},{title:'Integraciones',description:'APIs, pagos, mensajería y servicios externos'},{title:'Monitoreo',description:'Supervisión, optimización y mantenimiento'}],
  tenants:[{title:'Arturito',type:'piloto',sector:'Mascotas',details:['Aplicación móvil','Portal web','Dispositivo IoT','Panel de administración'],note:'Primer producto funcional e independiente de STO; caso piloto, no módulo común de todos los clientes.'},{title:'Tienda online',type:'ejemplo',sector:'Retail',details:['Catálogo','Pedidos','Inventario','Panel de administración']},{title:'Restaurante',type:'ejemplo',sector:'Gastronomía',details:['Menú digital','Reservas','Pedidos','Panel de administración']},{title:'Clínica',type:'ejemplo',sector:'Salud',details:['Citas','Historias clínicas','Pacientes','Panel de administración']},{title:'Empresa',type:'ejemplo',sector:'Corporativo',details:['CRM / ERP','Procesos internos','Usuarios','Panel de administración']}],
  businessModel:[{name:'Suscripciones (SaaS)',type:'recurrente',items:['Planes por uso','Acceso a soluciones','Mantenimiento']},{name:'Proyectos',type:'por proyecto',items:['Desarrollos personalizados','Integraciones específicas','Implementaciones']},{name:'Servicios',type:'por servicio',items:['Asesoría y consultoría','Soporte técnico','Capacitación']}],
  process:['Necesidad','Análisis','Propuesta y aprobación','Construcción y pruebas','Entrega en dominio'],
  timeTarget:'20 minutos solo para alcances pequeños, repetibles y validados; no es garantía general',
  roadmap:['Arturito como piloto','Reutilización en más negocios','Ortex avanzado','Empresas grandes'],
  currentReality:'Este documento expresa la visión del producto. El frontend no envía aún este contexto a Ortex y no hay conexión de generación autónoma.',
};
export function getSTOContextForOrtex(){
  return {schema:'sto.ortex.context.v1',version:STO_CONTEXT_VERSION,source:'frontend:sto-ecosystem',data:STO_CONTEXT};
}
export const STO_CONTEXT_TEXT=[
  STO_CONTEXT.organization+' — '+STO_CONTEXT.tagline,
  'Visión: '+STO_CONTEXT.vision,
  'Ortex: '+STO_CONTEXT.ortex.role+'. Estado: '+STO_CONTEXT.ortex.status,
  'Entradas: '+STO_CONTEXT.ortex.inputs.join(', '),
  'Capacidades previstas: '+STO_CONTEXT.ortex.capabilitiesPlanned.join('; '),
  'Infraestructura: '+STO_CONTEXT.infrastructure.map(x=>x.title+': '+x.description).join('; '),
  'Soluciones/tenants: '+STO_CONTEXT.tenants.map(x=>x.title+' ('+x.type+'): '+x.details.join(', ')+(x.note?' — '+x.note:'')).join('; '),
  'Modelo de negocio: '+STO_CONTEXT.businessModel.map(x=>x.name+': '+x.items.join(', ')).join('; '),
  'Proceso: '+STO_CONTEXT.process.join(' → '),
  'Tiempo objetivo: '+STO_CONTEXT.timeTarget,
  'Evolución: '+STO_CONTEXT.roadmap.join(' → '),
  STO_CONTEXT.currentReality
].join('\n\n');
