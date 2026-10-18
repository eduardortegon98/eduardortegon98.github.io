# Sincronización Notion → Supabase

## 1. Base de datos
Ya ejecutaste `app/supabase/PROSPECTS.sql`. Comprueba en SQL Editor:
```sql
select count(*) from public.sales_prospects;
```
El primer resultado debe ser 0 antes de importar.

## 2. Integración de Notion
- En Notion abre Settings → Connections / Integrations → Develop or manage integrations (o https://www.notion.so/profile/integrations).
- Crea una integración **interna**, solo de lectura (Read content). Copia su secreto; no lo compartas en chat ni en GitHub.
- Abre «Soluciones Tecnológicas Ortegón | CRM Comercial» y en el menú ••• → Connections añade esa integración. Si la base es una subpágina, comparte la base directamente con la integración.
- Confirma que la integración puede ver los registros del CRM.

## 3. Secrets de Supabase
En Supabase → tu proyecto → Edge Functions → Secrets, añade:
- `NOTION_API_KEY` = token secreto de la integración de Notion.
- `NOTION_DATA_SOURCE_ID` = `18af7b9d-22ce-4ab9-9f37-989537d61f98`.

La función usa automáticamente `SUPABASE_URL`, `SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY` del proyecto; no los copies al frontend.
Si tu proyecto usa nuevas publishable keys y no expone `SUPABASE_ANON_KEY`, tendrás que configurar esa variable del lado de Edge Functions o adaptar la autenticación antes de ejecutar.

## 4. Desplegar función (independiente de GitHub Pages)
Recomendado con Supabase CLI desde la carpeta del repositorio:
```bash
cd app
npx supabase login
npx supabase link --project-ref TU_PROJECT_REF
npx supabase functions deploy sync-prospects
```
Reemplaza TU_PROJECT_REF por el Project Ref visible en Supabase → Settings → General.
El código está en `app/supabase/functions/sync-prospects/index.ts`.
Alternativa: crea la función `sync-prospects` desde el dashboard de Supabase, pega el contenido de ese archivo en `index.ts` y pulsa Deploy.
Mantén la verificación JWT activada si la configuración del proyecto usa JWT legacy compatible. Para proyectos con keys modernas, revisa la configuración JWT de Supabase y utiliza la validación de identidad implementada dentro de la función; nunca elimines esa validación.

## 5. Importación desde el panel
1. Inicia sesión con tu usuario `super_admin`.
2. Abre `https://solucionesortegon.com/panel/analitica`.
3. En el popup de Prospectos pulsa **Sincronizar Notion**.
4. Espera el mensaje con el número de prospectos sincronizados.
5. Consulta de nuevo `select count(*) from public.sales_prospects;`.

La función recorre las páginas de Notion de 100 en 100 y realiza upsert por `notion_page_id`, sin duplicar registros. Solamente puede ser ejecutada por un usuario autenticado con perfil `super_admin`. No borra registros antiguos al desaparecer de Notion: para sincronización bidireccional o purgado habría que diseñar ese comportamiento por separado.

## 6. Comportamiento y limitaciones
- Notion es la fuente de datos. La importación es **manual** desde el popup, no automática por cron.
- Países que la propiedad País de Notion no admite (Chile, España, Estados Unidos) se recuperan provisionalmente de Sector.
- Estado comercial y estado de entrega se diferencian. Se inferirá `rebotado` / `bloqueado` / `retrasado` de las notas «Próxima acción» y, en los demás, `sin confirmar`.
- Si aparece `notion_query_failed`, revisa permiso de la integración y data source ID.
- Si aparece `forbidden`, verifica `portal_profiles.role = 'super_admin'`.
- Si aparece `database_upsert_failed`, comprueba SQL y estructura de la tabla.
- No guardes secrets en GitHub Actions de frontend ni en variables `VITE_...`.

## 7. Canal de contacto y agrupación
- Notion incorpora Canal de contacto (selección) y vista Por canal de contacto.
- Ejecutar PROSPECTS-CHANNELS.sql en Supabase SQL Editor para añadir contact_channel/contact_url a una instalación existente sin alterar estados.
- Volver a desplegar sync-prospects con el index.ts actualizado. La publicación de GitHub Pages no despliega funciones de Supabase.
- Abrir Analítica → Prospectos → Sincronizar Notion. La columna Canal, el filtro y Agrupar por → Canal de contacto usarán ese campo.
- Durante la actualización, si faltan las columnas, el frontend vuelve al esquema previo y detecta Instagram solo por el asunto explícito de contacto y correo solo por un enlace Gmail; no infiere correo por disponer de email.
- La clasificación de canal no confirma entrega, respuesta ni interés. Los estados comerciales y notas se conservan.
- Los enlaces Instagram de esta primera campaña se extraen del @usuario del asunto; canales sin enlace se muestran sin botón.
- El estado de entrega de correo no se aplica a Instagram u otras redes. Las respuestas en redes requieren actualización por parte del administrador.
