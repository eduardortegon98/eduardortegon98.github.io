# Despliegue automático en GitHub Pages

El workflow `.github/workflows/pages.yml` se ejecuta con cada push a `main`. Instala dependencias con `npm ci`, compila `app/`, comprueba la salida y publica `app/dist/` mediante las acciones oficiales de Pages. Los pull requests hacia `main` ejecutan las pruebas de configuración y el build, pero no publican.

## Activación inicial (una sola vez)

1. En **Settings → Pages → Build and deployment → Source**, selecciona **GitHub Actions**. La configuración anterior desde la rama `gh-pages` no se utiliza con este flujo.
2. En **Settings → Secrets and variables → Actions → Variables**, añade:
   - `VITE_SUPABASE_URL`: URL HTTPS del proyecto Supabase.
   - `VITE_SUPABASE_ANON_KEY`: clave pública anon o publishable.
   También se admiten secrets con los mismos nombres; las variables tienen prioridad. Nunca añadas una clave secreta ni `service_role`: Vite incluye estos valores en el JavaScript público.
3. En **Settings → Environments → github-pages**, permite despliegues desde `main` si hay restricciones de ramas heredadas. Sin revisores obligatorios, los despliegues no requerirán intervención.
4. En **Actions → CI / GitHub Pages → Run workflow**, selecciona `main` para el primer despliegue. Los siguientes pushes lo disparan automáticamente.

No se requieren tokens personales ni claves de escritura externas: el job de publicación utiliza el token del workflow y OIDC con permisos limitados a Pages.

## Velocidad y comportamiento

- Caché npm basada en `app/package-lock.json` y Node.js 22.
- Una sola instalación y compilación por ejecución. No se vuelve a compilar en el job de publicación.
- Los pushes nuevos cancelan las ejecuciones anteriores de la misma rama para priorizar el commit reciente.
- Cualquier fallo en compilación, validación de archivos o configuración impide publicar y conserva la última versión desplegada.
- Cada push a `main` dispara el flujo, incluso si solo cambia documentación, para mantener un comportamiento predecible.
- También admite ejecución manual. Solo `main` puede publicar.
- Las acciones están fijadas por SHA para que su versión no cambie silenciosamente.

La verificación de configuración comprueba formato, tipo de clave y caducidad; no prueba conectividad, la existencia de las tablas ni que las credenciales pertenezcan al mismo proyecto. Ejecuta también la [guía de Supabase](../supabase/SETUP.md).

## Comprobación local

Desde `app/`:

```bash
node --test scripts/check-pages-config.test.mjs
npm ci
npm run build
```

Para comprobar la configuración real, exporta las dos variables y ejecuta `node scripts/check-pages-config.mjs`. El script no carga `.env.local` por sí mismo ni imprime los valores.

## Si falla

Abre la ejecución en Actions y revisa el primer paso con error. Si faltan variables, configúralas y vuelve a ejecutar todos los jobs. Si Pages rechaza la publicación, revisa Source y las ramas permitidas del entorno `github-pages`.

La recuperación de contraseña y las rutas internas dependen del `404.html` generado durante el build. GitHub Pages puede responder HTTP 404 al abrir directamente una ruta de React, aunque la aplicación se renderice.

El flujo valida la compilación y la configuración de despliegue. No ejecuta ESLint global: el repositorio tiene incidencias anteriores pendientes de limpieza; tampoco realiza migraciones de Supabase automáticamente.
