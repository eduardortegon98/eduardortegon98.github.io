# Centro global de notificaciones

La única campana del portal pertenece al header global, en PortalLayout. No agregar campanas ni centros paralelos dentro de los módulos.

PortalNotifications vive por encima del Outlet. Conserva avisos y lectura entre rutas y aísla el registro por usuario/rol. La vista previa de cliente no carga ni expone avisos de administrador.

## Fuentes actuales

- Comercial: acciones abiertas, pagos pendientes, contratos enviados a firma y nuevas respuestas previamente registradas. Solo contactos confirmados accesibles al administrador.
- Metadatos locales y estado de lectura existente; no envíos, push, canales externos en vivo ni escrituras nuevas a Supabase.
- La consulta de contactos se actualiza al abrir el portal, manualmente o cada cinco minutos. Los vencimientos se recalculan cada minuto. Los cambios locales se comunican inmediatamente con ortdesk:commercial-change; las otras pestañas usan storage.

## Agregar un módulo

Usar usePortalNotifications desde NotificationContext y llamar publish({id,title,module,path,...}). El id debe ser estable e idempotente y no comenzar con crm:. path debe ser una ruta interna /panel. No crear otra campana ni simular mensajes externos. Añadir autorización por tenant antes de migrar a backend.

Cada aviso comercial usa contact y section en la URL para abrir el área correcta de la ficha. El estado de lectura no marca una tarea como completada ni un pago como realizado.

## Verificación

node src/Portal/Notifications/notificationModel.test.mjs

Comprueba rutas, lectura, deduplicación, alcance por contacto, aislamiento por usuario/rol y actualización en la misma pestaña.
