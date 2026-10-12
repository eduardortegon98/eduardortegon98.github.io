# Países en el dashboard

Actualiza en Supabase → Edge Functions → analytics-dashboard → Code el contenido con functions/analytics-dashboard/index.ts y pulsa Deploy. Conserva la validación de sesión y rol en el código. La publicación en GitHub Pages solo actualiza el frontend.

Se consulta country y sessions (hasta 250 países), usando el mismo periodo elegido en el panel. Si falla ese informe, las demás métricas continúan funcionando y el mapa indica conexión pendiente. Los informes geográficos son agregados y aproximados; no identifican personas ni posiciones en tiempo real. El mapa no necesita un proveedor de tiles ni envía datos de visitantes a terceros adicionales. La geometría simplificada está incluida en worldShapes.json, derivada de https://github.com/johan/world.geo.json (Natural Earth).
