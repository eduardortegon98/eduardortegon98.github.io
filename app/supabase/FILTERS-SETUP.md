# Filtros del panel

Despliega la versión actual de functions/analytics-dashboard/index.ts en Supabase → Edge Functions → analytics-dashboard → Code → Deploy. GitHub Pages solo publica el frontend.

Los filtros admitidos son país (country), dispositivo (deviceCategory) y origen/medio (sessionSourceMedium), combinados con AND y el periodo de 7/30/90 días. Google aplica los filtros a todos los informes históricos, incluidos leads y países. El dato de los últimos 30 minutos queda sin filtrar y se identifica como tal. La función valida dimensiones y longitud, verifica sesión y rol, y separa la caché por filtros. No se aceptan consultas arbitrarias.

Los selectores usan las opciones de los informes obtenidos, por lo que pueden mostrar solo los primeros 10 orígenes. Limpia los filtros para recuperar las opciones. Si la función antigua no admite filtros, el panel avisa y no muestra datos sin filtrar como resultados filtrados.

La distribución y visibilidad de tarjetas se guardan por usuario en localStorage del navegador. No cambian el rol, no se guardan datos de visitantes y no se sincronizan entre dispositivos. Puedes restaurar todo desde Personalizar panel.
