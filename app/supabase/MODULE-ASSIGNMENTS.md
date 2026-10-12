# Asignaciones de módulos
1. En el proyecto Supabase del portal abre SQL Editor → New query.
2. Ejecuta el archivo module-assignments.sql completo (requiere portal.sql).
3. Recarga el portal como administrador y abre Asignaciones.
4. Busca el correo del cliente registrado, selecciona Mensajes y/o Arturito y guarda.
5. El cliente debe recargar el portal o iniciar sesión nuevamente.

Solo super_admin puede asignar o revocar; el cliente solo puede leer sus propias asignaciones. No se modifica el rol del cliente ni se otorga acceso a analítica, contactos, cotizaciones o testimonios administrativos.
La vista previa de rol no simula asignaciones de una persona.
Mensajes mantiene conversaciones de demostración, no integra redes ni comparte comunicaciones reales. Arturito mantiene sensores simulados y rutinas locales separadas por usuario; no controla dispositivos.
Para futuras APIs de cada módulo, verificar también las asignaciones del usuario en el servidor y filtrar todos los datos por propietario. La protección de rutas frontend por sí sola no protege un backend.
