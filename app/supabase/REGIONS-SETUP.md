# Regiones por país

Actualiza functions/analytics-dashboard/index.ts en Supabase → Edge Functions → analytics-dashboard → Code → Deploy. El frontend se despliega con GitHub Pages; la función requiere este paso por separado.

Al seleccionar con clic o teclado un país con sesiones en el mapa, se abre la segunda tarjeta con regiones y sesiones del mismo periodo. Se realiza una sola consulta regional a Google Analytics, con filtro exacto del país y hasta 1000 regiones. No se vuelven a consultar los demás informes. El servidor valida país y periodo, exige super_admin y mantiene caché por país/periodo durante 60 segundos. Los cambios rápidos de país cancelan la petición anterior en el frontend.

La información es agregada y aproximada. Los datos no identificados se etiquetan y no se asignan a una región inventada. Si el backend antiguo no admite el informe, se muestra una instrucción para actualizarlo.
