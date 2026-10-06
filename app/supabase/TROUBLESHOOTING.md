# Reparar los 404 de formularios

La revisión del proyecto publicado confirmó `404 / PGRST202` en las cuatro funciones:

| Función | Uso |
| --- | --- |
| `submit_feedback` | Guardar opiniones |
| `list_approved_feedback` | Mostrar opiniones aprobadas |
| `submit_contact` | Guardar contactos |
| `submit_quote` | Guardar cotizaciones |

La API no encuentra las funciones con los parámetros del frontend. Puede faltar la instalación del esquema o su actualización en la caché de PostgREST. El endpoint público de configuración de Auth respondió 200; eso no verifica envío de correos ni inicio de sesión.

## Reparación

1. Abre el proyecto Supabase que coincide con `VITE_SUPABASE_URL` de GitHub Actions.
2. En **SQL Editor → New query**, copia y ejecuta **todo** [schema.sql](schema.sql). Incluye tablas, funciones, permisos y `NOTIFY pgrst, 'reload schema'`. No borra las tablas existentes ni modifica la antigua `FeedBack`.
3. Si el SQL falla, corrige el error indicado antes de continuar: una tabla existente con estructura distinta puede requerir una migración específica.
4. Recarga la web y envía una opinión de prueba. Debe aparecer en `customer_feedback` con `approved=false`.
5. Pon `approved=true` en esa fila para comprobar la consulta pública; después elimina la opinión de prueba desde Table Editor.
6. Comprueba también contacto y cotización en sus tablas respectivas.

No hace falta cambiar las claves ni volver a desplegar por ejecutar el SQL en el mismo proyecto. No uses la clave `service_role` en el frontend ni habilites acceso público a correos para evitar el 404.

## Chat

`VITE_CHAT_URL` debe apuntar al Worker desplegado, no a GitHub Pages. La interfaz ahora muestra un error de configuración antes de realizar una petición si falta esta variable. El backend necesita además las funciones de [chat.sql](chat.sql), sus secretos y la configuración descrita en [la guía del chat](../docs/CHATBOT.md).

La revisión no prueba envío real de WhatsApp, consumo de OpenAI ni entrega de correos. Esas comprobaciones requieren la configuración y credenciales de sus servicios.
