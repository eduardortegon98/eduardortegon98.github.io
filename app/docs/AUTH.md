# Acceso y registro

La ruta `/login` permite iniciar sesión, crear una cuenta (correo y contraseña confirmada), recuperar contraseña y cerrar sesión. El registro usa Supabase Auth: no concede permisos de administración.

En Supabase, habilita el proveedor Email y el registro de nuevos usuarios. Mantén activada la confirmación de correo para el chatbot. Configura Site URL como `https://eduardortegon98.github.io/` y autoriza `https://eduardortegon98.github.io/login` en Redirect URLs para confirmación y recuperación. Si cambia el dominio o el subdirectorio, actualiza estas URLs.

Si existe `VITE_TURNSTILE_SITE_KEY`, los formularios de acceso, registro y recuperación incluyen Turnstile. Para que Supabase lo valide en el servidor, configura su protección CAPTCHA con el secreto correspondiente y ajusta los límites de Auth en el dashboard. Nunca incluyas ese secreto en el frontend.

La contraseña de registro exige al menos 8 caracteres y confirmación coincidente; Supabase aplica sus requisitos adicionales. Si la confirmación de correo está activada, se muestra la instrucción para revisar el correo y no se da una sesión por creada hasta recibirla de Supabase. Si está desactivada, la UI reconoce la sesión inmediata devuelta por el proveedor.

Referencias: https://supabase.com/docs/reference/javascript/auth-signup y https://supabase.com/docs/guides/auth/redirect-urls.
