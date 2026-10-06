# Idioma global

`LanguageProvider` conserva Español/English en `localStorage` con la clave `ortegon-language` y actualiza `html.lang`. `LanguageSwitch` está en el header público y en el header del panel.

`Localized` renderiza el elemento indicado por `as`, mantiene refs y eventos, y traduce únicamente texto visible y atributos de accesibilidad, placeholders, títulos y texto alternativo. Se suscribe al contexto: las secciones diferidas y los componentes memorizados también se actualizan, sin desmontar formularios ni perder borradores.

El catálogo inglés está en `en.json`, con el texto español como clave. Para nuevos textos de interfaz, añade una entrada y usa `Localized`. Los textos dinámicos utilizan patrones explícitos en `translate`. Conserva los valores originales de los `option`: el idioma cambia su presentación, no los valores que recibe Supabase.

Mensajes de clientes, testimonios, respuestas del modelo, nombres de marca y contenido de webs externas no se traducen automáticamente. Usa `translate="no"` para contenido del usuario. Los errores nativos de validación dependen del idioma del navegador. La interfaz del asistente se traduce; el idioma de sus respuestas sigue dependiendo del backend y de la conversación.

No se usa traducción automática, servicios externos ni manipulación manual del DOM. Las preferencias siguen funcionando durante la sesión si el navegador bloquea el almacenamiento.
