# Moderación de testimonios

1. En el proyecto de Supabase de la aplicación, abre **SQL Editor → New query**.
2. Copia y ejecuta todo `feedback-moderation.sql`. Requiere `schema.sql` y `portal.sql` instalados previamente.
3. Entra en la web con una cuenta `super_admin`. En **Dashboard → Testimonios → Ver detalle**, revisa el texto y pulsa **Aprobar testimonio** o **Rechazar testimonio**.
4. Recarga el panel para comprobar que la decisión quedó guardada. Solo los aprobados aparecen en la página pública; los rechazados permanecen en el panel y pueden aprobarse después.

La decisión se guarda mediante una función que comprueba el rol en el servidor. No se conceden permisos generales de edición a clientes o visitantes. Antes de instalar el SQL, el panel continúa mostrando los registros existentes e indica cómo activar la moderación al intentar guardar.
