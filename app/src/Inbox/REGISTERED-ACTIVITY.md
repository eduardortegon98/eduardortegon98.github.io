# Actividad real registrada
Messages abre Actividad registrada para super_admin. La demo se mantiene en una pestaña separada. Clientes con el módulo asignado solo acceden a la demo: no tienen acceso al CRM global.
Los registros se leen de sales_prospects, protegido por la política super_admin existente. No se amplían permisos ni se requieren tablas nuevas.
Solo se incluyen canales Instagram/WhatsApp/Facebook con fecha de contacto. En instalaciones anteriores al campo contact_channel se reconoce Instagram por el asunto explícito Contacto por Instagram.
La lista se pagina internamente en lotes de 500, sin truncarse a 1.000. ID estable del registro sincronizado evita duplicación al sincronizar; no crea conversaciones ni mensajes en la base.
La actividad inicial es una constancia del contacto manual confirmado por Eduard, no una transcripción del DM ni una confirmación de entrega/lectura por Meta. Se muestra exactamente esa distinción.
Los textos originales, timestamps de envío, respuestas, webhooks y envío bidireccional esperan integración de n8n/Meta. El compositor permanece deshabilitado; Abrir perfil abre la plataforma, sin enviar mensajes.
Sincronizar Notion invoca la misma función sync-prospects ya instalada. Si los ocho contactos aún no se importaron, pulsar este botón. No necesita cambiar secrets ni añadir permisos.
La card Comunicaciones de Analytics cuenta actividad registrada real, no las cuatro conversaciones de demostración.
La integración futura debe usar propietario/empresa, account ID del proveedor, conversation ID y message ID únicos del proveedor, webhooks autenticados y filtrado por tenant. No entregar el CRM global a clientes.
