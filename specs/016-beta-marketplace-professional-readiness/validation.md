# Validación — Spec 016

**Estado:** validación local completa y árbitro independiente PASS; navegador en servidor estático de localhost, sin API PHP ni catálogo real conectado.

## Matriz requisito → evidencia

| Requisito | Comprobación | Resultado | Observaciones |
|---|---|---|---|
| RF-1 | `tests.test_beta_trust`; inspección de portada/marketplace/ficha | PASS en código | Marketplace y portada usan `/api/public/vehicles`, requieren `status=disponible`, excluyen `isDemo` y `proxima_entrada`; ficha consulta solo API pública y muestra no encontrado si no existe. |
| RF-2 | `test_beta_trust`; revisión y navegador de `/marketplace.html` | PASS con limitación ambiental | API no servida por HTTP estático: navegador observó indisponibilidad, no catálogo vacío. Código diferencia vacío real, `no_matches` y error. Portada restaura filtros tras coincidencias cero. |
| RF-3 | `test_price_bands_cover_boundaries_without_gaps`; lógica en `site-config.js` | PASS | Tramos (0,5k], (5k,10k], (10k,15k], (15k,20k], (20k,25k], >25k; links antiguos de máximo numérico compatibles. |
| RF-4 | `test_public_catalog_never_uses_demo_fixtures_as_fallback`; ficha directa | PASS en código | Fichas que no provienen del catálogo público disponible terminan como «Vehículo no encontrado»; sin CTAs activos. Demo profesional conserva fixtures. |
| RF-5 | Revisión de landing, demo y JS | PASS por inspección | La landing lista disponible/desarrollo/ilustrativa. No se verificó una sesión autenticada del panel existente. |
| RF-6 | `test_professional_demo`; revisión de claims | PASS por inspección | Generador «Borrador por plantilla»; copiloto desconectado; solicitudes/contactos ficticios; redes manuales/no conectadas. |
| RF-7 | Recorrido navegador: alta ficticia → seleccionar placeholder SVG → SEAT León → revisión local → inventario; contactos | PASS con límite | Alta en memoria, miniatura de foto confirmada, ficha añadida/revisión no pública; inventario 5; tres consultas ficticias. Código permite cambiar fase sin guardar. No se probaron otros formatos/tamaños. |
| RF-8 | Inspección de demo/landing y JS | PASS para demo actual | Memoria de pestaña; object URLs de fotos revocadas al cambiar/cerrar; sin persistencia. Política futura pendiente antes de altas reales. Acceso solo usuario de esta pestaña, sin cuenta/rol real. |
| RF-9 | `test_vehicle_sheet_finance_uses_editable_tin_not_tae`; revisión de ficha y demo | PASS por código/UI | Ficha y demo usan TIN editable inicial 7,9 %, cuota TIN/12, entrada y plazo; equivalente teórico sin costes descrito, no TAE ni oferta. |
| RF-10 | `updateMargin()` y prueba estática | PASS | Venta menos adquisición; no es margen neto y lista impuestos, preparación, garantía, reparaciones, financiación y otros costes excluidos. |
| RF-11 | Inspección de copy de demo, landing, panel y ficha | PASS por inspección | Cálculos como orientativos/ejemplo; acciones de contacto de ficha pública ocultas. |
| RF-12 | `test_beta_trust`; revisión de rutas | PASS con límite | Demo sin APIs externas ni almacenamiento persistente; altas, Coche Ideal, escritura de inventario y leads bloqueados en API. No se inspeccionó tráfico en API desplegada. |

## Criterios de finalización

- [x] RF-1–RF-12 tienen evidencia y resultado con límites indicados.
- [x] Checks locales pertinentes pasan.
- [x] Flujos comprador y profesional inspeccionados en navegador local; comprador en estado API no disponible del servidor estático.
- [x] Supuestos económicos visibles y verificados.
- [x] Ciclo de vida de datos pendiente explicitado como condición de alta real.
- [x] Árbitro independiente confirma correcciones G-01..G-03.
- [x] Preview disponible en `http://127.0.0.1:8000/demo-profesional.html`.

## Comprobaciones ejecutadas

| Comando/flujo | Resultado | Evidencia |
|---|---|---|
| `python -m unittest discover -s tests -p 'test_*.py'` | PASS | 78 pruebas. |
| `node --check app.js demo-profesional.js hub.js` (individualmente) | PASS | Sin errores de sintaxis. |
| `php -l api/index.php` | PASS | No syntax errors. |
| `git diff --check` | PASS | Sin errores de whitespace. |
| Recorrido UI localhost | PASS con límite | Alta sintética, selección y miniatura SVG de prueba, vehículo, revisión local, inventario y contactos. No se probaron formatos/tamaños adicionales. |
| Catálogo vacío con API disponible | NO EJECUTADO | Servidor HTTP estático no sirve endpoint PHP. |
| Inventario real publicado / filtros reales | NO EJECUTADO | No se usaron datos ni API de producción. |
| Solicitudes reales/API de producción | NO EJECUTADO | Bloqueadas intencionalmente por alcance. |

## Veredicto

`PASS local` — 78 pruebas y checks de sintaxis pasan; árbitro independiente confirma correcciones G-01..G-03 sin hallazgos obligatorios abiertos. Límites ambientales y comprobaciones no ejecutadas siguen declarados. No implica permiso de publicar, fusionar o desplegar.
