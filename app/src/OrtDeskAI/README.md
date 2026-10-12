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
