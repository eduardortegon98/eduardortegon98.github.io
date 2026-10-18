# ORTDESK.AI — base de conocimiento de Ortex
Primera versión de preparación de fuentes. Admin tiene acceso; clientes solo con ortdesk_ai asignado por ModuleRoute.
El catálogo SQL permite asignarlo a clientes después de module-catalog.sql. Ejecutar app/supabase/ortdesk-ai-module.sql para registrar este módulo en una instalación existente.
## Lo que funciona
Guardar PDF/DOCX/TXT/MD/CSV/JSON/PNG/JPG/WEBP en IndexedDB del navegador; límite 10 MB por archivo y 50 MB por usuario en esta versión. Pegar textos de hasta 20.000 caracteres, indicando origen propio u otra IA. Buscar, categorizar, revisar, descargar archivos y eliminar. No hay fuentes ficticias.
Los datos se separan por ID de usuario dentro del mismo navegador. No se sincronizan con Supabase ni se comparten entre miembros de una empresa. La categoría puede cambiarse al revisar.
## Lo pendiente
Almacenamiento privado de empresa, modelo de empresas y membresías, extracción PDF/DOCX/OCR, versiones, indexación/embeddings, búsqueda con filtros por empresa, respuestas con citas y límites de gasto.
No hay llamadas a OpenAI, procesamiento del archivo ni entrenamiento. Revisada no significa indexada. El contenido de otras IA también necesita revisión.
Para producción: bucket privado, políticas de propietario/empresa y asignación verificadas en servidor, cola de ingestión con estados reales, eliminación de archivos y vectores vinculados, trazabilidad de fuente/página y autorización por empresa antes de recuperar cualquier fragmento.
Borrar los datos del navegador elimina los borradores locales. Descargar los archivos permite conservar originales; los textos son visibles para copiarlos.

## Documento inicial del ecosistema STO
Cuando el superadministrador abre por primera vez OrtDesk.AI en un navegador, `seedSTOEcosystem.js` importa automáticamente **Ecosistema STO — Arquitectura y visión.svg** como fuente en la biblioteca local. La fuente incluye el diagrama SVG versionado en `app/src/assets/sto-ecosystem.svg` y una explicación textual de Ortex, Arturito, los servicios compartidos y el modelo de negocio. No se vuelve a importar si el usuario la elimina en ese navegador.
Esto **no significa que Ortex ya pueda responder con esos datos**: la indexación y recuperación de conocimiento siguen pendientes. Tampoco se sincroniza a otros dispositivos, dado que la biblioteca actual utiliza IndexedDB. El esquema de documentación accesible por ruta administrativa es adicional y no es la biblioteca.
