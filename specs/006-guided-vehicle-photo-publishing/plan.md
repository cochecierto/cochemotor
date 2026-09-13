# Plan técnico — Spec 006

## Decisiones y restricciones

- Mantener la web estática existente y la API PHP/MySQL; no añadir dependencias.
- Usar los diez PNG aportados como referencias ligeras en tarjetas, separadas de las fotos que seleccione el vendedor.
- Una foto por tarjeta; las tomas sugeridas son opcionales. La décima posición alterna entre neumático y detalle/desperfecto.
- Guardar borradores locales en IndexedDB, con expiración, y restaurarlos tras regresar del flujo de acceso.
- Exigir sesión verificada para enviar archivos; validar en servidor con capacidades disponibles y fallar cerrando si no se puede validar el contenido.
- No cambiar acceso/registro más allá de seleccionar audiencia profesional para quien publica en nombre de inventario; conservar un camino para particular.
- Sin migración si basta con `vehicle_images` y `metadata_json`; usar `sort_order` existente y ampliar metadatos de imagen dentro de metadata del vehículo solo si resulta compatible. Si una alteración de esquema se vuelve imprescindible, detenerse y pedir autorización.
- Umbral local por archivo: 8 MiB; límites PHP reales y total de solicitud deben comprobarse antes de carga.

## Componentes y responsabilidades

- `publicar.html`: guía, selección por tarjeta, contador, previews, mensajes, recuperación de acceso y submit.
- `publicar.html` y `acceso.html`: variante horizontal del logotipo con contraste para fondo blanco.
- `styles.css`: identidad CocheMotor en una landing de publicación por bloques, rejillas adaptables y estados de foco/error/carga; acción persistente en móvil.
- `assets/brand/photo-guide/`: referencias compactadas de las diez tomas.
- `api/index.php`: ruta autenticada de carga y asociación segura de URLs a un vehículo, sin confiar en nombre o MIME del cliente.
- `uploads/vehicles/` y reglas `.htaccess`: almacenamiento de imágenes públicas no ejecutables, con nombres aleatorios.
- `specs/006-guided-vehicle-photo-publishing/`: contrato, trazabilidad, tareas y evidencia.

## Modelo de datos y contratos

- `vehicle_images.image_url`: URL pública opaca bajo el directorio de imágenes del vehículo.
- `vehicle_images.sort_order`: orden de la guía; índice 0 se reserva para foto principal.
- La clave de slot y etiqueta se conservan en `vehicles.metadata_json` para poder distinguir guía/orden, sin crear una migración.
- `POST /api/vehicles` recibe un único multipart con JSON de vehículo/contacto, hasta diez blobs comprimidos y metadatos de slot en el mismo orden; usa Bearer token de sesión verificada y guarda vehículo, contactos e imágenes en una transacción.
- La asociación solo se permite a vehículos del tenant autenticado. El endpoint de creación de vehículo debe completarse antes de asociar imágenes.

## Seguridad, privacidad y reversión

- Tamaño máximo 8 MiB por archivo, máximo diez, allowlist JPEG/PNG/WebP verificada por bytes y decodificación; generar nombre aleatorio y no usar filename suministrado.
- Rechazar SVG, HTML, MIME/extensión discordantes, contenido corrupto, errores de decodificación y cargas parciales.
- No registrar contenido, ruta absoluta, EXIF, correo ni teléfono en logs de error.
- Desactivar ejecución/listado de directorios en ruta de uploads y usar `nosniff`.
- Reversión: retirar las tarjetas y ruta añadidas; archivos ya subidos requieren limpieza controlada por identificador, no borrado masivo.

## Decisiones técnicas

| Decisión | Motivo | Alternativa descartada |
|---|---|---|
| IndexedDB para borradores con Blob | Sobrevive a navegación y admite archivos | `localStorage` con base64 (cuota pequeña y riesgo de rendimiento) |
| Un multipart por anuncio con imágenes precomprimidas | Permite persistir vehículo/contacto/imágenes de forma atómica y evitar subidas temporales huérfanas | Endpoints separados por imagen que exigirían almacenamiento temporal, limpieza y control de propiedad |
| Validar y guardar tras sesión verificada | Evita endpoints anónimos de subida | Cargar públicamente antes de identificar responsable |
| Reusar `vehicle_images` | Ya relaciona URL y orden con vehículo | Nueva tabla sin necesidad probada |

## Trazabilidad hacia requisitos

| Parte del plan | RF cubiertos |
|---|---|
| Tarjetas, selección y responsive | RF-1, RF-2, RF-3, RF-4, RF-8, RF-9 |
| Persistencia local | RF-5, RF-7 |
| API, almacenamiento y asociación | RF-4, RF-6, RF-7 |
| Marca en superficies blancas | RF-10 |
| Landing clara, jerarquía por tarea y adaptación móvil/escritorio | RF-11 |

## Estrategia de pruebas

- Pruebas JS manuales/automatizadas de 0, 1, 10 y 11 archivos; reemplazo, eliminación, slot 10 libre y reordenación.
- Pruebas de borrador IndexedDB: guardar, restaurar, caducidad, regreso desde acceso y fallback sin API.
- Lint PHP y pruebas unitarias auxiliares de validación de imagen para MIME permitido, extensión falsa, contenido corrupto, tamaño, sesión, propiedad del vehículo y máximo 10.
- Revisión del SQL resultante en entorno de prueba y verificación de que `vehicle_images` respeta el orden.
- Inspección en navegador integrado, viewport móvil, teclado/foco, lector mediante árbol accesible, y `git diff --check`.
