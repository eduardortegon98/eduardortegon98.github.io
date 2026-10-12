# Catálogo y asignaciones escalables
## Activación
Después de portal.sql y module-assignments.sql, ejecutar module-catalog.sql completo en Supabase SQL Editor. Preserva las asignaciones actuales.
El catálogo elimina el límite de dos IDs y valida cada asignación contra módulos existentes y habilitados. La RPC guarda la selección en una transacción y serializa cambios del mismo cliente. Solo super_admin puede modificar permisos. Los clientes solo leen los propios.

## Registrar una funcionalidad
1. Implementar el componente del módulo y proteger sus APIs/datos por usuario en el servidor.
2. Añadir un descriptor en app/src/Portal/modules.jsx: id, path, etiquetas ES/EN, categoría, icono y componente lazy. IDs estables, slug de hasta 80 caracteres; rutas dentro de /panel, únicas y sin colisionar con cuenta/analitica/asignaciones.
3. Insertar su registro en public.portal_modules (SQL de administrador), con el mismo id, name_es, name_en, category, enabled.
4. Desplegar. Rutas, sidebar, entrada y cuenta usan el registro central sin modificar listas por separado.
Ejemplo de SQL tras implementar y registrar el módulo:
insert into public.portal_modules(id,name_es,name_en,category) values('inventory','Inventario','Inventory','operations');

Registrar un nombre no implementa una funcionalidad. El selector solo ofrece IDs presentes tanto en el catálogo habilitado como en el registro de componentes desplegados.

## Uso
Buscar cliente (paginación servidor de 20), Gestionar módulos, buscar o filtrar categoría, seleccionar resultados completos (incluye las páginas no visibles), revisar Solo seleccionados y Guardar asignación.
El catálogo y los permisos se leen en lotes de 500; se renderizan 25 módulos por página. El sidebar muestra búsqueda/categoría al superar 8 módulos y carga visualmente 20 cada vez. La cuenta muestra 6 y permite ver más.
No se cargan las asignaciones de todos los clientes al abrir el listado. Se consultan exclusivamente las del cliente elegido.
El cliente entra al primer módulo habilitado según el orden del registro central. Los demás permanecen accesibles en el sidebar.
Mensajes sigue siendo demo; Arturito beta, sensores simulados y rutinas locales. La migración no conecta dispositivos ni redes.

## Verificación pendiente en Supabase
Tras ejecutar la migración: comprobar que clientes no pueden ejecutar assign_client_modules ni leer permisos ajenos; admin puede asignar más de dos IDs registrados, revocar y guardar selección vacía; IDs desconocidos o deshabilitados se rechazan.
