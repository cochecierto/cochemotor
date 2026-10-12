# Validación — Spec 016

**Estado:** beta informativa validada, desplegada en Hostinger y verificada el 2026-10-12. PR #6 (`652d2aaf`) integró el release; PR #7 (`5eed5d2`) corrigió la caché CSS del estado sin stock. CI Linux del corte final ejecutó 90 pruebas, incluidas las cinco Bash. Workflow Hostinger #129 (`38270769178`) concluyó correctamente. El servidor local de vista previa sigue siendo estático y no representa el runtime PHP de producción.

## Matriz requisito → evidencia

| Requisito | Comprobación | Resultado | Observaciones |
|---|---|---|---|
| RF-1 | `tests.test_beta_trust`; inspección de portada/marketplace/ficha | PASS en código | Marketplace y portada usan `/api/public/vehicles`, requieren `status=disponible`, excluyen `isDemo` y `proxima_entrada`; ficha consulta solo API pública y muestra no encontrado si no existe. |
| RF-2 | `test_beta_trust`; revisión de marketplace y portada publicada | PASS | El servidor local estático no sirve PHP; en producción la portada informa el catálogo vacío, el mensaje de no stock es visible y los controles se ocultan hasta que haya anuncios reales. Código diferencia vacío, `no_matches` y error. |
| RF-3 | `test_price_bands_cover_boundaries_without_gaps`; lógica en `site-config.js` | PASS | Tramos (0,5k], (5k,10k], (10k,15k], (15k,20k], (20k,25k], >25k; links antiguos de máximo numérico compatibles. |
| RF-4 | `test_public_catalog_never_uses_demo_fixtures_as_fallback`; ficha directa | PASS en código | Fichas que no provienen del catálogo público disponible terminan como «Vehículo no encontrado»; sin CTAs activos. Demo profesional conserva fixtures. |
| RF-5 | Revisión de landing, demo y JS | PASS por inspección | La landing lista disponible/desarrollo/ilustrativa. No se verificó una sesión autenticada del panel existente. |
| RF-6 | `test_professional_demo`; revisión de claims | PASS por inspección | Generador «Borrador por plantilla»; copiloto desconectado; solicitudes/contactos ficticios; redes manuales/no conectadas. |
| RF-7 | Recorrido navegador: alta ficticia → seleccionar placeholder SVG → SEAT León → revisión local → inventario; contactos | PASS con límite | Alta en memoria, miniatura de foto confirmada, ficha añadida/revisión no pública; inventario 5; tres consultas ficticias. Código permite cambiar fase sin guardar. No se probaron otros formatos/tamaños. |
| RF-8 | Inspección de demo/landing y JS | PASS para demo actual | Memoria de pestaña; object URLs de fotos revocadas al cambiar/cerrar; sin persistencia. Política futura pendiente antes de altas reales. Acceso solo usuario de esta pestaña, sin cuenta/rol real. |
| RF-9 | `test_vehicle_sheet_finance_uses_editable_tin_not_tae`; revisión de ficha y demo | PASS por código/UI | Ficha y demo usan TIN editable inicial 7,9 %, cuota TIN/12, entrada y plazo; equivalente teórico sin costes descrito, no TAE ni oferta. |
| RF-10 | `updateMargin()` y prueba estática | PASS | Venta menos adquisición; no es margen neto y lista impuestos, preparación, garantía, reparaciones, financiación y otros costes excluidos. |
| RF-11 | Inspección de copy de demo, landing, panel y ficha | PASS por inspección | Cálculos como orientativos/ejemplo; acciones de contacto de ficha pública ocultas. |
| RF-12 | `test_beta_trust`; workflow Hostinger #129 | PASS | Demo sin APIs externas ni almacenamiento persistente; página de acceso sin formularios; rutas privadas y de escritura verificadas con 403 antes de leer cuerpo o configuración privada. |

## Criterios de finalización

- [x] RF-1–RF-12 tienen evidencia y resultado con límites indicados.
- [x] Checks locales y CI Linux pasan; CI ejecutó 90 pruebas, incluidas las cinco pruebas Bash de rollback/transacción.
- [x] Flujos comprador y profesional inspeccionados en navegador local; comprador en estado API no disponible del servidor estático.
- [x] Supuestos económicos visibles y verificados.
- [x] Ciclo de vida de datos pendiente explicitado como condición de alta real.
- [x] Árbitro independiente confirma la última corrección del corte SSH y el rollback serializado (PASS).
- [x] Preview disponible en `http://127.0.0.1:8000/demo-profesional.html`.
- [x] PR #7 integrado; CI final ejecuta 90 pruebas y Gauntlet confirma PASS de la corrección de caché.
- [x] Hostinger workflow #129 publicó el commit `5eed5d255445c417970ac0810c090e5dfac152e5`; smoke, rutas 403, hashes SFTP y snapshot para rollback verificados.
- [x] Navegador de producción confirma `styles.css?v=20261012.1`, catálogo sin stock real y búsqueda/filtros ocultos.

## Comprobaciones ejecutadas

| Comando/flujo | Resultado | Evidencia |
|---|---|---|
| `python -m unittest discover -s tests -p 'test_*.py'` | PASS | 89 pruebas localmente; 5 pruebas Bash omitidas porque Windows no tiene Bash. CI Linux final ejecutó las 90 pruebas. |
| `node --check app.js demo-profesional.js hub.js` (individualmente) | PASS | Sin errores de sintaxis. |
| `php -l api/index.php` | PASS | No syntax errors. |
| `node --check app.js demo-profesional.js hub.js site-config.js` | PASS | Sin errores de sintaxis. |
| `git diff --check` | PASS | Sin errores de whitespace. |
| Recorrido UI localhost | PASS con límite | Alta sintética, selección y miniatura SVG de prueba, vehículo, revisión local, inventario y contactos. No se probaron formatos/tamaños adicionales. |
| Catálogo vacío con API disponible | PASS en producción | La portada informa que no hay vehículos reales y oculta los controles de búsqueda/filtros; no había datos reales que probar. |
| PR #7 y CI | PASS | Integrado como `5eed5d255445c417970ac0810c090e5dfac152e5`; CI Linux ejecutó 90 pruebas. |
| Workflow Hostinger #129 | PASS | Promoción transaccional, smoke, rutas 403 y comparación SHA-256 de activos remotos. Snapshot: `.cochemotor-backup-38270769178-1-5eed5d255445`. |
| Inspección visual de producción | PASS | `styles.css?v=20261012.1`; mensaje de catálogo vacío visible, búsqueda y filtros con `display:none`. |
| Inventario real publicado / filtros reales | PENDIENTE DE STOCK | No hay anuncios reales; la lógica de filtros con publicaciones reales requiere inventario legítimo. |
| Solicitudes reales/API de producción | NO EJECUTADO | Bloqueadas intencionalmente por alcance. |

## Arbitraje y dictamen

La primera revisión local de RF corrigió G-01..G-03. La revisión de preparación de release detectó después (a) promoción SFTP secuencial sin rollback probado y rutas de captura todavía habilitadas, y (b) que una caída SSH durante una promoción parcial no activaba el rollback del workflow. Las rutas de captura se bloquearon antes de procesar el cuerpo o cargar configuración privada; se retiraron los formularios/clientes de autenticación de la página; el cliente arma recuperación antes de SSH y el promotor serializa recuperación con `flock`. Se agregaron pruebas para fallo parcial, recuperación solicitada desde cliente y lock.

En revisión posterior a la primera publicación, la inspección visual real detectó que el navegador mantenía la URL cacheada del CSS y aún mostraba filtros con catálogo vacío. El árbitro pidió invalidar explícitamente la caché; PR #7 añadió reglas específicas `[hidden]`, cambió a `styles.css?v=20261012.1` y agregó regresión. Gauntlet confirmó PASS.

El árbitro señaló el smoke de portada que esperaba copy dinámico dentro del HTML estático y luego detectó la sangría YAML de su sustitución. Ambos puntos se corrigieron; el smoke descarga `site-config.js`, busca el mensaje inicial allí y el árbitro confirmó que el comando sigue dentro de `run: |`. PR #6 quedó integrado como `652d2aaf8b75235b6f77c9313cc712465122274b`; PR #7 integró la corrección de caché como `5eed5d255445c417970ac0810c090e5dfac152e5`. CI final ejecutó 90 pruebas. El workflow Hostinger #129 finalizó correctamente y verificó el smoke, endpoints privados/escrituras con 403, hashes de los activos descargados por SFTP y el snapshot de rollback `.cochemotor-backup-38270769178-1-5eed5d255445`. La portada publicada usa `styles.css?v=20261012.1`; la observación visual confirmó catálogo sin stock y filtros/búsqueda ocultos.

**Dictamen:** `PUBLICADA — BETA INFORMATIVA`. CI Linux ejecutó 90 pruebas; JS/PHP/shell/sitemap pasaron y el árbitro confirmó PASS de la corrección de caché. El workflow #129 verificó promoción transaccional, smoke de rutas, respuestas 403 y hashes remotos. La portada en producción muestra que no hay stock y oculta búsqueda/filtros; no se habilitaron cuentas, solicitudes, leads, escrituras ni DDL. Límites: no se probó PHP/BD de ensayo, aún no hay inventario real para validar filtros con anuncios y la política de ciclo de vida de datos debe decidirse antes de activar altas reales.

