# Prospectos en Analytics — configuración pendiente

Se añadió un popup para super_admin en /panel/analitica. El panel consulta public.sales_prospects aplicando RLS. No se muestran prospectos ficticios.

1. Ejecuta `app/supabase/PROSPECTS.sql` en Supabase SQL Editor.
2. Sincroniza la base «Soluciones Tecnológicas Ortegón | CRM Comercial» (Notion data source `18af7b9d-22ce-4ab9-9f37-989537d61f98`) desde un proceso seguro del lado del servidor usando una integración de Notion y la service role de Supabase. Guarda ambos secretos solo en Supabase secrets. Haz UPSERT por `notion_page_id`.
3. Mapea Empresa→company, Persona→person, Email→email, País→country, Sector→sector, Estado→status, Fecha de contacto→contacted_at, Asunto→subject, Enlace Gmail→gmail_url, Próxima acción→notes. Los países fuera de la lista de selección actual de Notion pueden extraerse de Sector hasta que se amplíe esa propiedad. Interpreta estados de entrega en Próxima acción sin confundir bloqueos del conector con rebotes de SMTP.
4. Si quieres datos en tiempo real, programa sincronización periódica desde Supabase o un webhook validado de Notion. Solo GitHub Pages no sincroniza el CRM.

No se ha ejecutado SQL ni se ha desplegado función en Supabase. El popup mostrará estado vacío o error hasta hacer estos pasos.
