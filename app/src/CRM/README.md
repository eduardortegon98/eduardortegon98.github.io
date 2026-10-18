# Gestión comercial · prototipo frontend

Entrada: /panel/comercial, solo para super_admin, desde la sidebar y la card Contactos de Analítica.

## Datos y alcance

- Contactos: lectura de respuestas confirmadas existentes en Supabase mediante la misma regla de Contacto 0–5. No genera clientes ficticios ni considera un primer envío como respuesta.
- Etapas existentes: lectura inicial opcional de sales_contact_stages. Una vez hay gestión local para un contacto, esta prevalece en este prototipo. No se escribe en esa tabla ni en ningún otro backend.
- Metadatos: localStorage con clave por auth user ID. Adjuntos: IndexedDB, también con claves por usuario/contacto. Separación de interfaz, no una frontera de seguridad del servidor ni cifrado. No utilizar documentos sensibles reales hasta conectar Storage privado y políticas de acceso.
- El guardado local puede perderse al limpiar el navegador y no se comparte entre dispositivos o colaboradores. La UI lo indica. Los errores de cuota no deben mostrarse como éxito.
- No requiere SQL, secretos nuevos, n8n ni cambios de backend en esta fase.

## Checklist implementada

1. Adjuntos hasta 20 MB, categorías, descarga, eliminación y vinculación con cotización/contrato/pago.
2. Próxima acción con fecha/hora, responsable, completar/reabrir y aviso de vencimiento.
3. Historial de cambios locales, adjuntos y referencia de respuesta CRM; no inventa mensajes originales.
4. Notas internas editables.
5. Ficha comercial: persona, email, teléfono, canal, servicio, presupuesto/moneda, responsable y necesidades.
6. Catálogo de responsables, asignación y filtro. No crea usuarios ni permisos.
7. Oportunidades por etapa: arrastrar/soltar y selector accesible alternativo, registro de cambios.
8. Cotizaciones con valor/moneda, versión, vigencia, estado y archivo.
9. Contratos con versión, estados, archivo y fecha obligatoria para marcar firmado. Registro manual; sin firma electrónica.
10. Pagos/anticipos con vencimiento, método, comprobante y referencia; saldos separados por moneda.
11. Conversión a cliente: solicitud local de cuenta, módulos y proyecto inicial. No crea cuenta ni concede accesos.
12. Proyectos/entregables con responsable, fecha, estados de aprobación manual y checklist de hitos.
13. Búsqueda de contactos, correo, teléfono, servicio, notas, adjuntos, propuestas y proyectos. Posibles duplicados por email, teléfono o empresa, sin fusiones automáticas.
14. Notificaciones derivadas de acciones/pagos vencidos, contratos enviados a firma y nuevas respuestas CRM detectadas al actualizar tras la primera carga. Marcado de lectura local; sin push ni polling de proveedores.
15. Panel de estado de canales: no simula conexiones, envíos ni sincronización. Acceso a Comunicaciones. Notion se indica como lectura de registros existentes en Supabase.
16. Métricas locales de respuestas confirmadas, cotizaciones, etapas 4–5 e ingresos manuales, por canal; monedas separadas.
17. Catálogo de métodos de pago, instrucciones, enlace HTTPS, edición/archivo; sin procesamiento ni almacenamiento de tarjetas/CVV.

## Backend incremental sugerido

1. Ficha y responsable + notas/historial con RLS por organización/tenant.
2. Storage privado y URLs firmadas para documentos; límites, validación y política de retención.
3. Tareas, recordatorios y notificaciones persistentes.
4. Cotizaciones, contratos, proyectos y pagos con auditoría. Integración de firma/pagos por separado.
5. Conversión a cliente/assignments mediante RPC autorizado, sin conceder permisos desde el frontend.
6. Integraciones de canales e idempotencia de eventos; métricas verificadas por origen.

No modificar este prototipo para escribir automáticamente al backend sin incorporar autorización, aislamiento por organización y migraciones correspondientes.

## Validación

- model.test.mjs: separación de monedas, métricas por canal, duplicados, vencimientos, acciones terminadas y persistencia por cuenta.
- ESLint para los nuevos JS/JSX y build Vite.
