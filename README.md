<div align="center">

<img src="./app/public/Soluciones_Tecnologicas_Ortegon.png" alt="Soluciones Tecnológicas Ortegón" width="220" />

# Soluciones Tecnológicas Ortegón

### Desarrollo web, automatización e inteligencia artificial para tu negocio.

Una vitrina de servicios y proyectos, con formularios conectados a Supabase, despliegue automático y una base para atención mediante IA.

[**Visitar la página ↗**](https://eduardortegon98.github.io/) · [**Hablar con Eduard ↗**](https://wa.me/573337255586) · [**Guía del chatbot**](./app/docs/CHATBOT.md)

![CI / GitHub Pages](https://github.com/eduardortegon98/eduardortegon98.github.io/actions/workflows/pages.yml/badge.svg)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_+_Auth-3ECF8E?logo=supabase&logoColor=white)
![MIT](https://img.shields.io/badge/Licencia-MIT-C0FDB9)

</div>

---

## De una idea a una solución para tu empresa

Este proyecto reúne la presencia digital de **Soluciones Tecnológicas Ortegón**: servicios, tecnologías, portafolio y canales de contacto en una interfaz adaptable a móviles y escritorio.

La propuesta abarca desarrollo web, automatización de procesos, asistentes con IA, integraciones con WhatsApp y aplicaciones a medida.

| Solución presentada | Enfoque |
| :--- | :--- |
| **ORTWEB** | Sitios web y experiencias digitales para negocios. |
| **ORTCRM** | Gestión de contactos y seguimiento comercial. |
| **ORTDESK AI** | Asistencia y automatización de atención en WhatsApp y web. |

> El catálogo presenta la oferta de servicios. Este repositorio contiene el sitio y su infraestructura de contacto; no incluye un CRM completo ni implica que todas las soluciones del catálogo estén desplegadas.

## Lo que incluye el proyecto

- **Sitio y portafolio:** presentación de servicios, proyectos destacados y tecnologías, con animaciones y carga diferida de secciones.
- **Contacto y cotización:** formularios con validación y estados de envío, preparados para guardar solicitudes en Supabase.
- **Opiniones:** envío de testimonios y publicación de los aprobados, sin exponer correos.
- **Autenticación:** inicio y cierre de sesión, recuperación de contraseña y registro desde la página de acceso y desde el chatbot cuando se activa.
- **WhatsApp directo:** conversación con Eduard en **+57 333 725 5586**, con un mensaje preparado que el visitante confirma en WhatsApp.
- **CI/CD:** compilación y publicación automática en GitHub Pages con cada push a `main`.
- **Chatbot de empresa:** interfaz conversacional y backend preparado para OpenAI, con solicitudes de agente, CAPTCHA y controles de consumo.

## Estado de las integraciones

| Componente | Estado y configuración |
| :--- | :--- |
| Sitio y CI/CD | Despliegue verificado en GitHub Pages mediante Actions. |
| Formularios y Auth | Código integrado con Supabase. Requiere ejecutar el esquema SQL y configurar Auth; el envío real debe comprobarse en el proyecto. |
| WhatsApp directo | Número configurado. El enlace abre la conversación; no envía mensajes automáticamente. |
| Chatbot con IA | Implementado y probado localmente con servicios simulados. Pendiente de desplegar y configurar el Worker, OpenAI y Turnstile. |
| Avisos de agente y abuso | Cola y envío por WhatsApp Cloud API preparados. Pendiente de credenciales y plantillas aprobadas de Meta. |
| `backend/` | Estructura inicial de Express, separada del backend del chatbot. No se publica con GitHub Pages. |

**La IA se habilita con `VITE_CHAT_URL` y `VITE_TURNSTILE_SITE_KEY`. Mientras no se configuren, el widget mantiene el contacto directo por WhatsApp.**

### IA con consumo controlado

Los permisos se verifican en el servidor y las cuotas se almacenan en PostgreSQL.

| Control | Valor inicial |
| :--- | :--- |
| Visitantes | 4 mensajes por IP sin registro. |
| Cuentas con correo confirmado | 20 mensajes por día UTC y cuenta; 40 por IP. |
| Texto y respuesta | 500 caracteres de entrada y hasta 300 tokens de salida. |
| Frecuencia | 10 segundos entre solicitudes y una solicitud activa por IP/cuenta. |
| Presupuesto global | 200.000 unidades de reserva diarias; 5.000 por generación. Pausa al agotarse. |
| Abuso reiterado | Bloqueo temporal de una hora y alerta en cola. |
| Atención humana | Solicitud con nombre, contacto, motivo y consentimiento. |

Los saludos y algunas consultas básicas tienen respuestas locales sin llamadas a OpenAI. El historial enviado al modelo se recorta, no hay reintentos automáticos de generaciones y las claves permanecen en el servidor.

La reserva sobreestima el consumo: **no equivale a una factura exacta**. La restricción temática de la IA tampoco sustituye las cuotas. Los detalles y límites de las notificaciones están en [la guía del chatbot](./app/docs/CHATBOT.md).

## Estructura del repositorio

| Ubicación | Contenido |
| :--- | :--- |
| [`app/src/`](./app/src) | Frontend React: páginas, formularios, portafolio y widget de atención. |
| [`app/public/`](./app/public) y [`app/src/assets/`](./app/src/assets) | Identidad visual e imágenes. |
| [`app/supabase/`](./app/supabase) | Esquemas SQL, funciones de acceso y configuración de la base de datos. |
| [`app/chat-worker/`](./app/chat-worker) | Backend del chatbot para Cloudflare Workers, controles y pruebas. |
| [`app/docs/`](./app/docs) | Guías de despliegue y activación del chatbot. |
| [`backend/`](./backend) | Base inicial de una API Express. |
| [`.github/workflows/pages.yml`](./.github/workflows/pages.yml) | Pipeline de validación, compilación y despliegue del frontend. |

**Stack:** React 19 · Vite 7 · Tailwind CSS 4 · React Router · Framer Motion · Supabase/PostgreSQL · Cloudflare Workers · OpenAI Responses API.

## Ejecutar en tu equipo

Usa **Node.js 22.12+** y npm.

```bash
git clone https://github.com/eduardortegon98/eduardortegon98.github.io.git
cd eduardortegon98.github.io/app
npm ci
cp .env.example .env.local
npm run dev
```

En Windows puedes copiar `.env.example` manualmente. Completa en `app/.env.local` la URL del proyecto y la clave **pública** de Supabase.

Para habilitar los formularios, ejecuta [`schema.sql`](./app/supabase/schema.sql) y sigue [la configuración de Supabase](./app/supabase/SETUP.md). Para configurar registro, confirmación de correo y recuperación, consulta [AUTH.md](./app/docs/AUTH.md). Para activar la IA y sus alertas, sigue [CHATBOT.md](./app/docs/CHATBOT.md), que incluye el esquema adicional `chat.sql`.

**Nunca pongas claves de OpenAI, `service_role` ni tokens de WhatsApp en variables `VITE_*`: se incluyen en el frontend.**

| Comando desde `app/` | Uso |
| :--- | :--- |
| `npm run dev` | Servidor de desarrollo. |
| `npm run build` | Compilación en `dist/` y fallback de rutas `404.html`. |
| `npm run preview` | Vista local de la compilación. |
| `npm run lint` | Revisión con ESLint; existen incidencias previas pendientes. |
| `node --test scripts/check-pages-config.test.mjs chat-worker/policy.test.mjs` | Pruebas de configuración y controles del chatbot, sin consumo de API. |

## Publicación automática

Cada push a `main` ejecuta pruebas, instala dependencias con caché, compila y publica en GitHub Pages. Los pull requests se validan sin publicar y las ejecuciones anteriores de la misma rama se cancelan cuando llega una nueva.

La configuración inicial y las variables públicas se explican en [DEPLOYMENT.md](./app/docs/DEPLOYMENT.md). Si una validación falla, se conserva la versión publicada.

**El Worker se despliega por separado con Wrangler.** El workflow de Pages publica el frontend y prueba los controles del chatbot; no despliega el backend ni ejecuta migraciones SQL.

## Autor y contacto

**Eduard Ortegón** · Ingeniería electrónica, desarrollo de software e inteligencia artificial.

[GitHub](https://github.com/eduardortegon98) · [LinkedIn](https://www.linkedin.com/in/eduardortegon/) · [WhatsApp](https://wa.me/573337255586)

## Licencia

Este repositorio se distribuye bajo la [licencia MIT](./LICENSE).
