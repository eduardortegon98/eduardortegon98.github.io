<div align="center">

<img src="./public/Soluciones_Tecnologicas_Ortegon.png" alt="Soluciones Tecnológicas Ortegón" width="240" />

# Soluciones Tecnológicas Ortegón

### Ingeniería, software e inteligencia artificial para impulsar negocios.

Sitio web de presentación de servicios y portafolio: una experiencia visual para explorar soluciones, conocer proyectos y dar el primer paso hacia una implementación tecnológica.

[**Explorar el sitio ↗**](https://eduardortegon98.github.io/) · [**Conectar en LinkedIn ↗**](https://www.linkedin.com/in/eduardortegon/) · [**Ver el código**](./src)

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES_Modules-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![MIT](https://img.shields.io/badge/Licencia-MIT-C0FDB9?style=flat-square)

</div>

---

## Una vitrina para convertir ideas en proyectos

**Soluciones Tecnológicas Ortegón** reúne desarrollo web, automatización y servicios de inteligencia artificial en una presentación orientada a negocios. El sitio combina una identidad en verde, una estética tecnológica y componentes adaptables a diferentes tamaños de pantalla.

Este repositorio contiene el frontend del sitio. Su objetivo es comunicar la propuesta de valor, mostrar trabajos y facilitar el contacto con posibles clientes.

## Soluciones que presenta el sitio

| Solución | Enfoque |
| :--- | :--- |
| **ORTWEB** | Desarrollo de sitios web y experiencias digitales para negocios. |
| **ORTCRM** | Propuesta de gestión de contactos y seguimiento comercial. |
| **ORTDESK AI** | Propuesta de asistencia y automatización de atención en WhatsApp y web. |

> Estas son las ofertas presentadas en el catálogo. El frontend de este repositorio no implementa por sí mismo un CRM ni un asistente de IA en producción.

## Qué encontrarás

- **Página principal:** propuesta de valor, catálogo de soluciones, tecnologías y proyectos.
- **Portafolio visual:** tarjetas con formato de celular y enlaces a los trabajos destacados.
- **Navegación por rutas:** páginas de contacto, cotización e inicio de sesión.
- **Interacciones y animaciones:** transiciones con Framer Motion, desplazamiento animado y elementos visuales.
- **Carga diferida:** páginas con `React.lazy` y secciones que se renderizan al acercarse al área visible.
- **Base para testimonios:** componentes de envío y consulta de opiniones conectados a Supabase, actualmente sin montar en la página principal.

## Proyectos destacados

Los siguientes trabajos están incluidos en el portafolio del sitio; sus implementaciones pertenecen a proyectos separados.

| Proyecto | Descripción | Enlace |
| :--- | :--- | :--- |
| **BluRealty.AI** | Plataforma inmobiliaria con enfoque en inteligencia artificial. | [Visitar](https://blurealty.ai/) |
| **5IG Solutions** | Landing page para una empresa de soluciones tecnológicas. | [Visitar](https://5igsolutions.com/) |
| **enSEÑArte LSC** | Plataforma de aprendizaje de Lengua de Señas Colombiana. | [Ver presentación](https://www.linkedin.com/feed/update/urn:li:activity:7346741868321288192/) |

## Tecnologías

| Área | Herramientas |
| :--- | :--- |
| Interfaz | React 19 y JavaScript |
| Desarrollo y compilación | Vite 7 |
| Estilos | Tailwind CSS 4 y CSS |
| Navegación | React Router 7 |
| Animación | Framer Motion |
| Iconografía | Lucide React y React Icons |
| Opiniones de clientes | Supabase |
| Recursos gráficos incluidos | Three.js, OGL y componentes de efectos visuales |
| Publicación | `gh-pages` |

## Ejecutar localmente

Requiere **Node.js 20.19+ o 22.12+** y npm, compatibles con Vite 7.

```bash
git clone https://github.com/eduardortegon98/eduardortegon98.github.io.git
cd eduardortegon98.github.io/app
npm ci
npm run dev
```

Abre la dirección que Vite indique en la terminal.

### Configuración de Supabase

Si vas a activar los componentes de opiniones, crea un archivo `.env.local` dentro de `app/`:

```dotenv
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-publica-anon
```

Los componentes utilizan la tabla `FeedBack`, con campos `id`, `name`, `email`, `message`, `rating`, `approved` y `created_at`. La consulta muestra hasta seis opiniones aprobadas, de la más reciente a la más antigua.

Configura el esquema y las políticas de acceso en Supabase antes de habilitar el módulo. Para mantener la aprobación manual, `approved` debe iniciar en `false` y los visitantes no deben poder modificarlo. Utiliza únicamente la clave pública del cliente; una clave `service_role` no debe incluirse en variables `VITE_*`.

### Comandos disponibles

| Comando | Uso |
| :--- | :--- |
| `npm run dev` | Iniciar el servidor de desarrollo. |
| `npm run build` | Generar la versión de producción en `dist/`. |
| `npm run preview` | Previsualizar la compilación localmente. |
| `npm run lint` | Ejecutar ESLint. |
| `npm run deploy` | Compilar y publicar `dist/` en la rama `gh-pages`. |

La configuración de Vite utiliza `base: '/'`, adecuada para el sitio raíz de este repositorio. GitHub Pages debe estar configurado para servir la rama publicada. Como la aplicación usa `BrowserRouter`, el alojamiento también necesita una estrategia de fallback para abrir o recargar rutas como `/contacto`.

## Guía del código

| Ubicación | Responsabilidad |
| :--- | :--- |
| `src/App.jsx` | Definición de rutas y carga de páginas. |
| `src/Home/` y `src/Hero/` | Composición de la página principal y presentación. |
| `src/Products/` | Catálogo ORTWEB, ORTCRM y ORTDESK AI. |
| `src/Projects/` | Proyectos y tarjetas del portafolio. |
| `src/Stack/` | Presentación visual de tecnologías y capacidades. |
| `src/Contacto/` y `src/Cotizar/` | Interfaces de contacto y cotización. |
| `src/Login/` | Interfaz de inicio de sesión. |
| `src/Walkie/` | Widget de mensajes con sugerencias y enlace a WhatsApp. |
| `src/FeedBack/` y `src/lib/supabase.js` | Componentes de opiniones y cliente de Supabase. |
| `src/context/` y `src/hooks/` | Contexto de tema y detección de visibilidad. |
| `public/` y `src/assets/` | Identidad visual, imágenes y recursos. |

## Estado actual

La presentación comercial y el portafolio están implementados en el frontend. Algunas funciones requieren integración antes de utilizarlas como servicios completos:

- **Contacto y cotización:** formularios visuales, todavía sin lógica de envío.
- **Inicio de sesión:** interfaz disponible, sin autenticación conectada.
- **Widget de mensajes:** utiliza sugerencias basadas en palabras clave; el destino de WhatsApp contiene un valor de ejemplo y el audio está pendiente.
- **Opiniones:** componentes con integración a Supabase, actualmente sin renderizar en el home.
- **Datos comerciales:** revisar los teléfonos de ejemplo antes de publicar para clientes.

## Autor y contacto

**Eduard Ortegón** · Soluciones Tecnológicas Ortegón

[GitHub](https://github.com/eduardortegon98) · [LinkedIn](https://www.linkedin.com/in/eduardortegon/) · [Facebook](https://www.facebook.com/solucionestecnologicasortegon)

## Licencia

Código distribuido bajo la [licencia MIT](../LICENSE).
