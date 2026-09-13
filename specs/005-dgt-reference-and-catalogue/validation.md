# Validación — Spec 005

## Matriz requisito → evidencia

| Requisito | Test o evidencia | Resultado | Observaciones |
|---|---|---|---|
| RF-1 | `ficha.html` bloque de recursos DGT; comprobación de destinos oficiales en `docs/knowledge/DGT-DATA-REVIEW-2026-09-13.md` | PASS | Enlaces a informe, distintivo y llamadas a revisión; se enlaza guía de compraventa. |
| RF-2 | Revisión estática de `app.js`, `hub.js`, `site-config.js`, `ficha.html`, `marketplace.html`, `dealer.html`, `index.html` y `publicar.html`; claims de estado DGT/ITV y garantía condicionados a información declarada | PASS* | *QA de páginas principales; no incluye QA visual ni revisión exhaustiva de copias archivadas/local-broker. |
| RF-3 | `ficha.html` insignia “indicado”, nota de demostración y enlace oficial de distintivo | PASS | Valores del vendedor/de demo no se presentan como verificación DGT. |
| RF-4 | `tests/test_vehicle_catalog_import.py` (3/3); metadata del snapshot en `assets/data/vehicles_catalog.js` | PASS | Fecha fuente desconocida separada de la generación; procedencia/licencia sin atribución inventada. |
| RF-5 | Revisión de alcance | PASS | No se implementa consulta ni ingesta externa. |
| RF-6 | Inspección de enlaces oficiales HTTPS con `rel="noopener noreferrer"`, nombres descriptivos y notas de apertura | PASS* | *Inspección de código; no se ejecutó lector de pantalla ni prueba real de teclado. |

## Veredicto

`GO CON LIMITACIONES`

La revisión independiente final confirmó que se corrigió el último hallazgo del perfil profesional: datos demo sin contacto, contacto real condicionado al teléfono y contenido dinámico escapado. La aprobación se limita al alcance enumerado y a las verificaciones estáticas ejecutadas.

## Pruebas ejecutadas

- `python -m unittest tests.test_vehicle_catalog_import -v`: 3/3 PASS.
- `python -m py_compile scripts/import_vehicle_catalog.py tests/test_vehicle_catalog_import.py`: PASS.
- `node --check app.js`, `hub.js`, `site-config.js`, `assets/js/home_catalog.js`, `assets/js/inventory_selectors.js`: PASS.
- `git diff --check`: PASS.
- Catálogo: diff de metadata únicamente (6 inserciones / 4 eliminaciones); los registros no se modificaron.
- No hubo importación de datos DGT, consultas a matrículas/VIN, commit, push ni despliegue.

## Límites de la validación

No se probó la interfaz en navegador, con tecnologías de asistencia ni contra backend/Hostinger. Los datos demo no son ofertas reales. Una revisión externa de reutilización/licencia del dataset y el esquema del archivo concreto siguen siendo requisito antes de importar datos oficiales.
