# Informe Gauntlet — Spec 016: beta transparente y recorrido local

## Estado

`PASS`

## Resumen

- Objetivo: evitar que el marketplace presente ejemplos como inventario comprable y alinear el recorrido profesional sintético/local, las capacidades y los cálculos.
- Incluye: portada, marketplace, ficha, páginas de acceso, demo profesional, panel económico, guards de API y workflow de publicación Hostinger.
- Excluye: activar alta real, DDL/migraciones, datos reales y decidir la política final de retención de futuras cuentas.
- Usuarios/flujo: comprador que consulta el catálogo; profesional que revisa capacidades y prueba la demo efímera.
- Rama: integración sobre `main` 89622cab; se preparará una rama/PR nueva porque el checkout local estaba atrasado y divergido.
- Fecha: 2026-10-12. Implementador: agente principal. Árbitro independiente: subagente autorizado.

## Matriz RF y evidencia

Ver resultados y límites RF-1..RF-12 en [`validation.md`](../../specs/016-beta-marketplace-professional-readiness/validation.md). La demo UI observada en localhost llega a revisión local y consultas ficticias; el servidor estático no expone el endpoint PHP.

## Checks antes de arbitraje

| Comprobación | Resultado | Evidencia |
|---|---|---|
| `python -m unittest discover -s tests -p 'test_*.py'` | PASS | 89 pruebas pasan localmente; 5 pruebas Bash se omiten en Windows y quedan para CI Linux. |
| `node --check` app.js, demo-profesional.js, hub.js | PASS | Sintaxis válida. |
| `php -l api/index.php` | PASS | No syntax errors. |
| `git diff --check` | PASS | Sin errores de whitespace. |
| Browser localhost | PASS parcial | Demo con alta ficticia, foto SVG sintética previsualizada, vehículo, revisión local y contactos; marketplace observó API no disponible por servidor estático. |

## Baseline y riesgos

- Baseline: preservar artefactos untracked preexistentes (zips, `panel-preview.html`, `panel/`), fuera de Spec 016.
- Supuestos: datos sintéticos solo en memoria de pestaña; no persistencia ni integraciones. Cuentas reales cerradas hasta definir el ciclo de vida de datos.
- Riesgos residuales: no se probó PHP runtime/API con BD de ensayo; catálogo vacío disponible y catálogo con publicaciones reales no se probaron; revisión pendiente.

## Rondas y hallazgos

| Ronda | Versión | Hallazgo | Evidencia/reproducción | Corrección | Revalidación |
|---|---|---|---|---|---|
| 1 | Working tree 2026-10-12 | G-01 P1: ficha decía TAE 7.95%; G-02 P2: portada confundía filtro vacío con catálogo sin stock; G-03 P2: foto no comprobada | Revisión independiente inicial | Ficha usa TIN editable 7.9% y copy sin TAE/oferta; portada separa `allStock` de resultados filtrados y permite restablecer; navegador seleccionó placeholder SVG y vio miniatura | Árbitro confirma PASS en segunda revisión; 89 pruebas locales y checks repetidos; 5 pruebas Bash reservadas para CI Linux. |

## Revisión final

- Diff inspeccionado por implementador y árbitro independiente en dos rondas.
- Resultado observado: demo sintética y temporal; catálogo del servidor estático muestra indisponibilidad y no usa ejemplos como ofertas.
- Hallazgos G-01..G-03 corregidos y confirmados por el árbitro. En la revisión del workflow el árbitro encontró una comprobación dinámica incorrecta en el smoke; al sustituirla, encontró la nueva línea mal indentada. Se corrigió y revalidó; PASS final, sin hallazgos obligatorios abiertos.
- No comprobado: API PHP runtime, DB de ensayo, catálogo vacío real/no-match observable, ficha con vehículo activo, roles autenticados y tráfico de producción. Foto SVG local comprobada; no se probaron otros formatos/tamaños.

## Dictamen

`APROBADO` localmente: RF cubiertos con validación explícita, 89 pruebas pasan localmente (5 Bash omitidas por Windows), JS/PHP y diff checks pasan, recorrido UI observado y el árbitro independiente confirmó la resolución de G-01..G-03. Persisten límites declarados: no se usó API/BD de ensayo, catálogo vacío disponible ni inventario real; no se validó producción. El árbitro da PASS técnico; CI Linux sigue pendiente para ejecutar pruebas Bash antes del merge. El usuario ya autorizó publicación y despliegue; esta autorización no equivale a evidencia de que se hayan realizado.
