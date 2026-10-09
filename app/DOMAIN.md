# Dominio de producción

Dominio: https://solucionesortegon.com

Este repositorio se despliega mediante GitHub Actions. Guardar solucionesortegon.com en Settings > Pages > Custom domain; un archivo CNAME no configura el dominio cuando se usa Actions.

En la zona DNS de Hostinger, configurar cuatro registros A para @:

- 185.199.108.153
- 185.199.109.153
- 185.199.110.153
- 185.199.111.153

Configurar www como CNAME hacia eduardortegon98.github.io. Revisar y sustituir únicamente registros A/AAAA/ALIAS/CNAME que entren en conflicto con estos hosts; conservar los registros de correo y verificación.

Activar Enforce HTTPS en GitHub Pages cuando el certificado esté disponible.

En Supabase > Authentication > URL Configuration:
- Site URL: https://solucionesortegon.com
- Autorizar las URLs de retorno que usa la aplicación en este dominio, incluyendo /login para recuperación. Mantener las URLs de desarrollo necesarias.

Si se usa el chatbot de IA, añadir el nuevo origen a la lista permitida del worker y el dominio a Turnstile antes de activarlo.

Después de la propagación, verificar inicio, /contacto, /cotizar, /login, imágenes y recuperación de contraseña.

Documentación: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
