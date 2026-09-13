# Validación — Spec 006

## Matriz requisito → evidencia

| Requisito | Test o evidencia | Resultado | Observaciones |
|---|---|---|---|
| RF-1 | `tests/test_guided_photo_publishing.py`; diez slots en `publicar.html` y diez assets WebP | PASS | Orden y referencias comprobados. |
| RF-2 | Test de copy para slot 10 | PASS | Neumático o desperfecto/detalle. |
| RF-3 | Slots fijos (10), una input por slot, contador por tarjetas y reintento de replace/remove | PASS estático | No se pudo interactuar con la página local en navegador. |
| RF-4 | Cliente valida formato/resolución/tamaño; PHP verifica contenido, dimensiones y normaliza WebP | GO CONDICIONADO | El PHP local no tiene GD; carga segura rechaza con 503. Hostinger debe confirmar GD+WebP. |
| RF-5 | IndexedDB para Blob, expiración 7 días; borrador de texto local con expiración | PASS estático | Browser local no disponible para prueba de navegación. |
| RF-6 | API multipart crea vehículo/contacto/imágenes y comprueba sesión verificada/tenant | GO CONDICIONADO | PHP lint PASS; no hay GD ni acceso a DB de prueba, por lo que falta integración real. |
| RF-7 | Código conserva borrador ante error; ID idempotente evita anuncio duplicado en reintento | PASS estático | Falta prueba de integración con DB. |
| RF-8 | Las tarjetas rotulan las referencias como “Ejemplo” y las vistas subidas como “Foto añadida”; test de assets | PASS | Se guardan solamente los blobs elegidos por el usuario. |
| RF-9 | Labels/input de archivo, estados `role=status`, descripciones, foco visible y breakpoints CSS | PASS estático | Inspección visual real pendiente por política de URL local del navegador. |
| RF-10 | `tests/test_guided_photo_publishing.py`; `cochemotor-horizontal-light.png` en publicar y acceso | PASS | Asset corporativo con contraste para fondo blanco. |
| RF-11 | `tests/test_guided_photo_publishing.py`; grupos Datos/Fotos/Contacto, anchura de escritorio, breakpoints 600/360 px y CTA móvil fijo en `styles.css` | PASS estático | Sin revisión visual en navegador: la política del navegador bloqueó el archivo local. |

## Criterios de finalización

- [x] Todos los RF tienen evidencia estática.
- [x] Tests estáticos relevantes en verde.
- [ ] Flujo principal revisado visualmente en navegador y probado con API/base MySQL.
- [x] Seguridad y privacidad revisadas; sin GD la API rechaza carga.
- [x] Rollback y entorno documentados en `plan.md`.
- [x] Aprobación del alcance: propietario, 2026-09-13.

## Veredicto

`GO CONDICIONADO` — cambios locales implementados; verificar extensión GD/WebP y configuración `post_max_size`/`upload_max_filesize` en Hostinger, y ejecutar prueba de extremo a extremo antes de producción.

## Pruebas ejecutadas

- `php -l api/index.php`: PASS.
- `python -m unittest tests.test_guided_photo_publishing -v`: 6/6 PASS.
- `python -m py_compile tests/test_guided_photo_publishing.py`: PASS.
- Sintaxis del JavaScript inline con `new Function(...)`: PASS.
- Balance de llaves CSS: PASS.
- `git diff --check`: PASS.
- PHP local: `getimagesize` disponible; GD (`imagecreatefromstring`, `imagewebp`) no disponible; el servidor de prueba no puede completar cargas por diseño seguro.
- Navegador: la política bloqueó `file:///.../publicar.html`; no se intentó ninguna vía alternativa para abrir el archivo local.
