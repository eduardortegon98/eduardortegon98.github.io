# Contactos calificados

Ejecuta CONTACT-STAGES.sql en Supabase > SQL Editor > New query > Run, después de PROSPECTS.sql.

Contactos muestra únicamente respuestas confirmadas: Respondió, Interesado, Reunión, Cotización y Ganado. Excluye duplicados técnicos, bloqueados y rebotes permanentes. Los demás registros siguen disponibles en Comunicaciones y Prospectos; no se eliminan solicitudes web.

Todos empiezan visualmente en Contacto 0. Un administrador cambia manualmente la etapa; ninguna respuesta, brochure o sincronización implica automáticamente una cotización, aceptación o firma. Las estrellas representan progreso comercial, no una valoración de la persona.

0: Conversando. 1: Cotización enviada. 2: Oferta recibida. 3: Oferta aceptada tras contactar de vuelta. 4: Acuerdo firmado. 5: Trabajo iniciado.

La tabla sales_contact_stages permanece separada del ingest de Notion, por lo que una sincronización no sobrescribe las etapas. RLS permite lectura solo a administradores; la escritura usa un RPC que verifica rol, contacto calificado y rango 0–5. Sin la migración, se permite consultar contactos, pero se desactiva la edición y se muestra el paso pendiente. Las etapas se almacenan en Supabase; no actualizan el Estado de Notion.
