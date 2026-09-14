# Validación — Spec 011

| Requisito | Evidencia | Estado |
|---|---|---|
| RF-1 | Texto de beta gratuito sin fecha de fin en `profesionales.html`; navegador integrado lo expone como contenido principal | Cumple |
| RF-2 | `<details class="pro-plan-disclosure">` carece de atributo `open`; árbol de accesibilidad local muestra la consulta plegada | Cumple |
| RF-3 | Al abrir la consulta, el navegador local renderiza las cinco propuestas y su nota de no contratación; valores permanecen en `planes-profesionales.js` | Cumple |
| RF-4 | Calculadora eliminada de HTML, CSS y JS; `tests/test_beta_feedback_readiness.py` verifica que no queden selectores/lógica | Cumple |
| RF-5 | `feedback-beta.js` construye `mailto:` al enviar; no usa `fetch`, XHR ni almacenamiento. Envío no ejecutado; queda bajo control del usuario | Cumple por inspección de código |
| RF-6 | Página informa visibilidad del remitente y ausencia de almacenamiento/transmisión; enlace directo `mailto:` funciona sin JS | Cumple |
| RF-7 | Prueba verifica enlace en los diez pies públicos y el hub; render local confirma enlace en landing profesional | Cumple |
| RF-8 | `index.html` y landing profesional apuntan a `assets/brand/logos/cochemotor-final-dark.png`; se inspeccionó la variante en footer oscuro | Cumple |
| RF-9 | Navegador integrado en viewport CSS 1437 px: sin overflow horizontal (1421 px en landing abierta; 1437 px en feedback) y controles legibles. Emulación móvil/tablet y teclado completa pendiente | Parcial |

## Checks

- `python -m unittest tests.test_beta_feedback_readiness -v`: 4 pruebas correctas.
- `python -m unittest discover -s tests -p "test_*.py"`: 56 pruebas correctas.
- `python -m unittest discover -s local-broker/tests -p "test_*.py"`: 18 pruebas correctas.
- `node --check profesionales.js`, `feedback-beta.js`, `planes-profesionales.js`: correcto.
- `git diff --check`: correcto; Git muestra avisos de conversión LF/CRLF en Windows.
- Inspección visual local del formulario y la landing; pricing cerrado por defecto y visible al abrir.
- Intento de automatización responsive con Playwright bloqueado por `PermissionError: [WinError 5] Acceso denegado` al crear el proceso del navegador; requiere validación manual en dispositivos/viewport antes de cerrar T5.
- Sin despliegue a Hostinger/producción.
