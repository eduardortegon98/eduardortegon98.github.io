# Bandeja unificada — demo frontend

Ruta `/panel`, disponible tras iniciar sesión con Supabase. El login redirige automáticamente al panel; las sesiones de recuperación permanecen en `/login` para cambiar la contraseña. Al cerrar sesión se vuelve al login.

Incluye conversaciones de ejemplo de WhatsApp, Instagram y Facebook, búsqueda, filtros por canal/estado/sin leer, estados editables, borradores independientes y respuestas locales. En móvil se alterna entre lista y conversación.

Los datos viven únicamente en memoria y se reinician al recargar o salir. No hay llamadas a Meta, envío real, sincronización ni persistencia de mensajes. Cualquier cuenta autenticada puede acceder a esta demo con datos ficticios.

Antes de conectar conversaciones reales, implementar roles de administrador/agente, autorización del backend y aislamiento por negocio. El registro público existente no debe permitir acceder a mensajes reales. La comprobación de sesión del frontend es navegación, no una barrera de autorización para datos.
