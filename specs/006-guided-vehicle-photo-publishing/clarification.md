# Clarificación — Spec 006

## Ambigüedades

1. El usuario aprobó diez posiciones en el orden indicado y especificó que la décima puede sustituirse por un desperfecto/detalle. Se interpreta como una posición opcional de detalle libre.
2. La persistencia del borrador se limita al mismo navegador/dispositivo; no se sincroniza antes del acceso.
3. La petición de rediseño pide una landing dentro de `publicar.html`, no una URL o embudo nuevo. La captura evidencia demasiado espacio lateral en escritorio, ayudas DGT demasiado prominentes y una larga tarea sin agrupación editorial.

## Contradicciones entre requisitos

1. Ninguna.

## Casos límite no cubiertos

1. La eliminación automática de borradores caducados se hará al iniciar el flujo y mediante fecha de expiración local; no se conservarán fotos indefinidamente.
2. Si el navegador no admite IndexedDB, se ofrecerá continuar sin fotos persistentes y se advertirá antes del acceso.

## Conflictos con la gobernanza

1. Ninguno identificado. No se guardarán secretos ni se desplegará sin autorización específica.

## Riesgos pendientes

1. Las directivas PHP del hosting (`upload_max_filesize`, `post_max_size`) y extensiones para validar imágenes pueden diferir del entorno local. Responsable: implementación; resolver con rechazos seguros y documentar cualquier requisito de producción.
2. El flujo de acceso actual usa un token de sesión en localStorage y la validación de cuenta presenta un enlace de demo. Esta iniciativa preserva el borrador y requiere sesión verificada para carga; no pretende sustituir el proveedor de correo/verificación existente.

## Veredicto

`GO CONDICIONADO` — requisitos funcionales aprobados; la carga se habilitará solo si el servidor confirma soporte de validación y almacenamiento. La extensión de acceso/email real queda fuera de alcance.
