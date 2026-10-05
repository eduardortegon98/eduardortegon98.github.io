# Activar los formularios

La aplicación utiliza un único proyecto Supabase para contacto, cotizaciones, opiniones y autenticación. Las contraseñas se gestionan exclusivamente con Supabase Auth, nunca se guardan en tablas de solicitudes.

## Configuración

1. Crea un proyecto en el plan Free de Supabase o reutiliza uno existente.
2. Abre SQL Editor y ejecuta `schema.sql` completo. Es transaccional y se puede ejecutar nuevamente. Crea `contact_requests`, `quote_requests` y `customer_feedback`; no modifica la tabla antigua `FeedBack`.
3. Copia la URL del proyecto y la clave pública anon/publishable a `app/.env.local`, siguiendo `.env.example`. No uses `service_role` ni claves secretas. Las variables `VITE_*` son públicas y se incluyen durante la compilación.
4. Ejecuta `npm run build` y publica la nueva compilación. Si compilas en un proveedor de hosting, configura allí las mismas variables y vuelve a desplegar.
5. En Auth, habilita el proveedor Email y crea los usuarios autorizados desde el panel. No se añadió registro público ni panel de administración.
6. Configura Site URL como `https://eduardortegon98.github.io` y agrega `https://eduardortegon98.github.io/login` y `http://localhost:5173/login` a las URL de redirección autorizadas. Para otro dominio, usa sus URL reales.
7. Para recuperación por correo a destinatarios reales, configura SMTP. El servicio de correo predeterminado de Supabase tiene restricciones para pruebas; no garantiza el envío a cualquier visitante.

GitHub Pages: sigue la [guía de CI/CD](../docs/DEPLOYMENT.md) para publicar automáticamente desde `main`. Se publica `dist/`, con `404.html` generado para que las rutas de React y los enlaces de recuperación puedan cargar. La petición inicial a una ruta desconocida devuelve HTTP 404, aunque renderiza la aplicación. En otros hosts configura una reescritura de las rutas a `index.html` para responder HTTP 200.

## Datos y privacidad

- Consulta las solicitudes desde Table Editor en Supabase. Los visitantes, incluso si inician sesión, no pueden listar, editar ni borrar solicitudes.
- Las funciones `submit_contact`, `submit_quote` y `submit_feedback` permiten únicamente insertar campos definidos. Los límites y campos obligatorios también se validan en la base de datos.
- Para publicar una opinión, cambia `approved` a `true` desde Table Editor. La consulta pública devuelve únicamente nombre, mensaje, estrellas, identificador y fecha; nunca el correo.
- Las opiniones de la tabla antigua `FeedBack` no se migran automáticamente. Revisa y migra manualmente solo las que quieras conservar.
- El honeypot de contacto/cotización y el bloqueo del botón evitan algunos envíos accidentales y bots simples; no son límites de peticiones del servidor. Para campañas o alto volumen, añade una Edge Function con CAPTCHA y límites antes de exponer estos endpoints a tráfico intensivo.
- El widget Walkie abre WhatsApp; no es un formulario de almacenamiento ni un chat de IA.

## Verificación en el proyecto real

1. Envía contacto y cotización y verifica una nueva fila en cada tabla.
2. Envía una opinión; debe quedar con `approved=false` y no aparecer públicamente.
3. Apruébala; recarga el sitio y verifica que aparezca.
4. Inicia y cierra sesión con un usuario de Auth.
5. Solicita recuperación de contraseña y prueba el enlace recibido y el cambio de contraseña.
6. Envía sin campos obligatorios o con correo inválido: no debe guardarse.

No se considera activada la integración hasta ejecutar estos pasos contra el proyecto configurado.
