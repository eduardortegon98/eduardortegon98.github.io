# Bandeja de comunicaciones
Mensajes tiene una sola bandeja, sin demo ni conversaciones ficticias.
Filtros Todos, Emails, Instagram, WhatsApp, Facebook, LinkedIn y otros canales presentes en el CRM. Emails incluye asunto, dirección y enlace al hilo original de Gmail. Historial original y envío esperan las integraciones reales.
El administrador ve los registros de sales_prospects bajo RLS super_admin existente. El cliente con módulo asignado ve la misma estructura vacía, sin leer el CRM global, hasta que tenga sus integraciones por empresa. No se han cambiado permisos.
Se incluyen contactos con fecha, hilo Gmail o aviso de entrega (para email). Se excluyen intentos bloqueados antes del envío y registros técnicos duplicados.
La actividad refleja el contacto manual registrado, no una transcripción ni confirmación de entrega. Las notas de fallo/retraso y respuestas del CRM se muestran sin inventar mensajes ni marcar como leído.
Sincronizar Notion refresca registros CRM; no conecta Gmail ni Meta. El envío está deshabilitado. No se requiere SQL adicional para esta actualización; conserva compatibilidad con el esquema anterior a contact_channel.
Para n8n/Gmail/Meta: cuentas por empresa, IDs únicos de conversación/mensaje, webhooks autenticados, deduplicación y filtrado del propietario en servidor antes de exponer historial. La clave/token nunca va en frontend.
