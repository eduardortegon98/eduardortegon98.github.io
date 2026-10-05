# Asistente IA y solicitudes de agente

El código está preparado para Cloudflare Workers + Supabase + OpenAI Responses API.
GitHub Pages sigue alojando React. **No se activa hasta configurar el servidor y VITE_CHAT_URL.**
Sin esa variable permanece el contacto directo por WhatsApp.

## Límites aplicados antes de pagar una generación

| Control | Valor inicial |
|---|---|
| Visitante | 4 solicitudes por IP, sin reinicio diario |
| Cuenta con correo confirmado | 20 solicitudes por día UTC |
| IP, incluyendo varias cuentas | 40 solicitudes por día UTC |
| Mensaje | 500 caracteres; cuerpo HTTP máximo 6000 bytes |
| Respuesta | 300 tokens, presentación de hasta 1200 caracteres |
| Historial de cuenta | Últimos 4 pares, recortados a 4300 bytes de prompt |
| Anónimo | No reutiliza historial del servidor para evitar compartir datos entre personas en la misma IP |
| Frecuencia | 10 segundos; una solicitud activa por IP y cuenta |
| CAPTCHA | Turnstile obligatorio para cada solicitud anónima |
| Reserva global | 5000 unidades conservadoras por generación; 200000 al día inicialmente |
| Abuso | 8 intentos rechazados en 10 minutos: bloqueo de IP y cuenta durante 1 hora |
| Agente | 2 solicitudes al día por IP y cuenta; sin consumo OpenAI |

Saludos, preguntas simples de servicios y solicitudes explícitas de agente tienen respuestas locales:
cuentan como interacción, pero no generan tokens ni consumen la reserva global.
Las alertas de abuso se limitan a 5 al día en todo el sitio y las solicitudes de agente a 20 al día.

La reserva no es una factura exacta: sobreestima el consumo usando el límite de bytes de entrada,
el límite de salida y margen para el formato. No se devuelve si OpenAI falla o tarda demasiado;
no hay reintentos automáticos de generaciones. Se registra usage.total_tokens para auditar.
El presupuesto inicial equivale como máximo a 40 generaciones/día en todo el sitio.
Para cambiar el modelo o formato, recalcular también la reserva y probar su cota.
Al agotarse el presupuesto, paused=true requiere revisión manual, incluso al cambiar el día.
Los límites son persistentes y las reservas se serializan en PostgreSQL; borrar cookies o enviar
solicitudes paralelas no reinicia la cuota. La IP se obtiene del ingreso Cloudflare y se guarda con
HMAC; no se confía en X-Forwarded-For ni en una IP proporcionada por el navegador.

## Activación

1. Ejecuta también [chat.sql](../supabase/chat.sql) en el SQL Editor de Supabase.
   Estas tablas tienen RLS, sin acceso público; solo service_role ejecuta las funciones.
2. Crea un Worker de Cloudflare desde app/chat-worker. Con Wrangler instalado:
   `npx wrangler deploy` desde ese directorio. Revisa wrangler.toml; la URL de Supabase y el origen
   corresponden a este proyecto. El endpoint público será https://TU-WORKER.workers.dev/chat.
3. Configura **secretos del Worker**, nunca variables VITE_ ni archivos en git:
   OPENAI_API_KEY (clave de proyecto de la API de OpenAI con facturación habilitada),
   SUPABASE_SERVICE_ROLE_KEY (clave JWT legacy service_role), IP_HASH_SECRET (aleatorio, al menos 32 bytes)
   y TURNSTILE_SECRET_KEY.
   El token de sesión de ChatGPT no se utiliza. ChatGPT Plus no configura este backend.
   Conserva IP_HASH_SECRET: cambiarlo reinicia la identificación de IPs.
4. Crea un widget Turnstile para eduardortegon98.github.io. Usa su secreto en el Worker y su site key
   pública en VITE_TURNSTILE_SITE_KEY. En Supabase Auth habilita confirmación de correo y registro.
   Configura Site URL y redirect
   https://eduardortegon98.github.io/; activa CAPTCHA de registro y límites de Auth para reducir
   creación masiva de cuentas: usa el mismo widget y secreto Turnstile en la configuración de Auth.
   La cuenta no concede uso ilimitado.
5. Agrega la variable pública **VITE_CHAT_URL** en GitHub Actions con el endpoint del Worker.
   Agrega también VITE_TURNSTILE_SITE_KEY. Vuelve a ejecutar el workflow de Pages.
   No actives estas variables antes de probar el backend.

GitHub Actions publica el frontend y prueba los controles del Worker. El backend se despliega
por separado con Wrangler; después de modificarlo, vuelve a ejecutar wrangler deploy.

El modelo está fijado a gpt-4.1-mini-2025-04-14, con store:false, sin herramientas, navegación,
archivos ni cadenas de llamadas. Las instrucciones solo contienen información de la empresa.
No se acepta historial ni instrucciones de sistema desde el frontend. La restricción temática
es una instrucción al modelo, no una garantía contra toda inyección de prompts; las cuotas y el
presupuesto siguen siendo el control de gasto aun si alguien consigue una respuesta fuera de tema.

## Notificaciones automáticas a Eduard

Requiere un remitente de **WhatsApp Business Platform / Cloud API** configurado con Meta, un
token válido y dos plantillas aprobadas. El destinatario es +57 333 725 5586; no basta con un enlace wa.me.
Configura en el Worker:

- WHATSAPP_ACCESS_TOKEN (secreto).
- WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_GRAPH_VERSION (versión soportada, por ejemplo la de tu panel),
  WHATSAPP_AGENT_TEMPLATE, WHATSAPP_ALERT_TEMPLATE, WHATSAPP_TEMPLATE_LANGUAGE.
- Ambas plantillas deben tener exactamente un parámetro de texto en el cuerpo para el detalle.
  Selecciona con Meta la categoría apropiada y cumple los requisitos de autorización del destinatario.

Los eventos se guardan en chat_outbox. Se intenta enviar al crearlos y con cron cada 5 minutos.
Hay hasta 3 intentos con lease para evitar trabajadores concurrentes. sent_at indica aceptación
por Meta, **no entrega al teléfono**; para confirmar entrega hace falta integrar sus webhooks.
Los timeouts pueden producir duplicados; no hay garantía de entrega exactamente una vez.
Si falta configuración WhatsApp, las solicitudes quedan guardadas, sin afirmar que llegó un mensaje.
Tras 3 fallos, revisa last_error, corrige la integración y restablece attempts=0 para reintentar.
Los avisos de abuso se deduplican por IP/hora y los de presupuesto por día.
Las solicitudes de agente incluyen nombre, contacto y motivo con consentimiento explícito.

## Operación y verificación

- Pausar manualmente: `update public.chat_control set enabled=false where id=1;`
- Reactivar tras revisar: `update public.chat_control set enabled=true,paused=false where id=1;`
  Esto no borra el presupuesto consumido; si se agotó, espera otro día o ajusta daily_budget.
- Revisar reservas: `select * from public.chat_control;`
- Revisar solicitudes/alertas: `select * from public.chat_outbox order by created_at desc;`
- Pruebas locales sin coste: `node --test chat-worker/policy.test.mjs` desde app.
  Para pruebas SQL, instala @electric-sql/pglite y ejecuta `node --test chat-worker/db.test.mjs`.
- Prueba real antes de activar: cuatro mensajes anónimos, quinto rechazado; login válido/forjado;
  ráfaga paralela; pausa global; solicitud de agente y recepción de plantilla en WhatsApp.
- Conserva únicamente los chats y datos de contacto el tiempo necesario. Programa limpieza
  de chat_turns y chat_outbox enviados (por ejemplo 30 días); no borres chat_limits para liberar cuotas.

Una IP puede agrupar varios usuarios y se puede cambiar con VPN/IPv6; no identifica a una persona.
El presupuesto global limita el daño de IPs rotatorias, pero no impide que consuman la cuota del
sitio. Turnstile se valida antes de cada reserva anónima; para tráfico mayor, añade controles de WAF.
CORS no es autenticación. El Worker rechaza orígenes desconocidos, pero los bots pueden imitar
ese encabezado; los controles efectivos son la identidad validada, las cuotas y el presupuesto.
