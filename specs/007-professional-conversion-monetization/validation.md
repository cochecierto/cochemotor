# Validación — Spec 007

| Requisito | Evidencia | Estado |
|---|---|---|
| RF-1 | Árbol accesible de la portada: marketplace, demanda, profesionales y publicación separadas; página B2B con menú de herramientas/planes/FAQ | Cumple |
| RF-2 | CTA "Soy profesional" y enlace bajo el buscador abren `profesionales.html`; no existe pestaña de profesional que lleve a ficha demo | Cumple |
| RF-3 | Vista de navegador: cinco planes a 59/79/129/199/desde 299 €, cupos de 10/10/35/75/75+ y usuarios 1/2/5/10/a medida | Cumple |
| RF-4 | Prueba del selector anual: 590/790/1.290/1.990 € y equivalentes mensuales 49,17/65,83/107,50/165,83 €; Red anual a consultar | Cumple |
| RF-5 | Copy visible: precios sin IVA, sin checkout/cargos y cupos aún no aplicados | Cumple |
| RF-6 | Cada alta dirige a acceso profesional en modo registro beta; copy aclara que no contrata el plan | Cumple |
| RF-7 | Beta y extras identificados como sujetos a disponibilidad; revisión e integraciones no se prometen como activas | Cumple |
| RF-8 | Vista 390×844: CTA y menú visibles; menú expandible con enlaces accesibles; estilos de foco visibles y reduced motion definido | Cumple |
| RF-9 | Landing contiene propuesta, herramientas, pasos, calculadora de escenario, planes, condiciones y FAQ | Cumple |
| RF-10 | Sin scripts de analítica ni píxeles nuevos en `profesionales.html`; no se añadió rastreo | Cumple |

## Checks

- `node --check` para `app.js`, `site-config.js`, `profesionales.js` y `planes-profesionales.js`: correcto.
- `git diff --check`: correcto (solo avisos de normalización CRLF existentes del entorno).
- `python` XML parser para `sitemap.xml`: correcto.
- HTTP smoke local: 200 para portada, landing, CSS, JS, datos de planes, `robots.txt` y `sitemap.xml`.
- Navegador integrado local: render desktop y móvil 390×844; selector anual y calculadora interactivos; enlaces del menú verificados.
- No hay suite de frontend configurada; no se instalaron dependencias.
- No se hizo push ni despliegue; esta entrega corresponde al árbol de trabajo local.
