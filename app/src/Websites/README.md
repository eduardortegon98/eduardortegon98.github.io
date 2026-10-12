# Websites
Gestión de proyectos web reales guardados en Supabase. Requiere ejecutar app/supabase/websites.sql después de portal.sql y module-catalog.sql.
El administrador registra proyecto, cliente existente, dominio, repositorio, estado del diseño y acción solicitada. Puede archivar/restaurar el registro. Los clientes con Websites asignado solo leen sus propios proyectos no archivados.
La vinculación de un proyecto al cliente no le concede el módulo automáticamente: usar Assignments.
Publicar/Suspender/Reactivar son solicitudes pendientes de integración. No ejecutan ninguna llamada a GitHub/DNS/hosting; la publicación real se muestra Sin verificar. Archivar no borra ni despublica código.
Listado de 12 registros por página con búsqueda de nombre y filtros; selección de propietario con búsqueda de correo y hasta 20 coincidencias por consulta. No hay datos simulados.
RLS de propietario + producto habilitado; inserción/edición solo vía RPC con autorización super_admin y validación de cliente/estados/dominio/repo. Clientes no reciben permisos de escritura.
La clave de integración GitHub futura debe vivir en backend, nunca navegador. Automatización futura de publicación debe registrar resultados reales, impedir despliegues de sitios suspendidos, conservar código/datos y permitir reactivación.
No se ha ejecutado la migración remota ni probado sus políticas en Supabase desde esta sesión. Verificar después: cliente no lee proyecto ajeno ni modifica, admin guarda/edita/archiva/restaura, quitar Websites revoca lectura de proyectos, acciones no afectan hosting.
