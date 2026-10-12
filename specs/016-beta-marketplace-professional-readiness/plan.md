# Plan técnico — Spec 016

**Estado:** aprobado para implementación local el 2026-10-12, según las aclaraciones de Dirección.

## Decisiones y restricciones

- Base: rama local `codex/016-beta-trust-workflow`. No se publicará ni desplegará esta iniciativa.
- Se parte de la regla del usuario: datos sintéticos hasta que haya profesionales suscritos. No crear datos reales ni efectos externos durante la verificación local.
- La UI pública consumirá solo el endpoint/fuente pública de vehículos reales autorizados. Los fixtures `siteConfig.stock` seguirán disponibles para la demo aislada, no como fallback del marketplace público.
- El CTA sin stock es informativo, sin captura. No se habilita alta real; beta y recorrido de prueba local usan datos sintéticos. Explicar almacenamiento/acceso comprobados y señalar que la política de fin de beta se decidirá antes de cuentas reales.
- Usar TIN editable de 7,9 % inicial. Si se muestra equivalente anual, presentarlo como cálculo teórico mensual compuesto, sin costes; nunca como TAE.
- No desplegar ni publicar esta iniciativa como parte del plan técnico local.

## Componentes y responsabilidades

- `index.html`, `app.js`, `site-config.js`: estado del catálogo en portada, distinción stock vacío y CTA.
- `marketplace.html`, `site-config.js`: fuente de resultados, estados vacíos/errores, filtros y bandas de precio.
- `ficha.html`: rechazo consistente de fichas sintéticas como oferta/contacto y explicación de su estado.
- `profesionales.html`, `profesionales.js`, `demo-profesional.html`, `demo-profesional.js`: catálogo de capacidades por disponibilidad y lenguaje consistente con acciones reales.
- `demo-profesional.html`, `demo-profesional.js`: recorrido de prueba local aislado con datos sintéticos en memoria; sin correo, escritura de API, contacto real ni indexación. No reutilizar `hub.html` como flujo porque su autenticación/datos existentes no son un sandbox aprobado.
- `tests/`: pruebas de regresión de estados de catálogo, afirmaciones y supuestos económicos; solo se añadirán tras aprobación de esta spec.
- `docs/`: política de datos beta y registro de cierre cuando Dirección decida el tratamiento de fin de beta.

## Modelo de datos y contratos

- Catálogo público: solo entidades devueltas por API con estado publicado, visibilidad pública y contacto autorizado. Fixtures sintéticos permanecen identificados con `isDemo` en la demo.
- Demo profesional: perfil, vehículos, fotos y contactos sintéticos identificados como ficticios en estado JavaScript de la pestaña; no usar SQLite ni almacenamiento persistente.
- Consulta sintética: enlazada al vehículo sintético y visible solo en el panel/demo de prueba; nunca se presenta como lead de un comprador real.
- Estado de catálogo: `available`, `empty`, `no_matches` o `unavailable`, para no convertir errores de servicio en falsa ausencia de inventario.
- Estado de capacidades: `Disponible en beta`, `En desarrollo` o `Ilustrativa`, con descripción de acciones observables y salida/limitación.
- Cálculos: entrada explícita, tasa/plazo/entrada, fórmula de cuota; margen según conceptos introducidos. No derivar una oferta real ni taxonomía fiscal.

## Seguridad, privacidad y reversión

- No escribir datos de demo en SQLite, localStorage, sessionStorage, IndexedDB ni backend; fotos locales viven como object URLs revocables en esa pestaña.
- No enviar correo, notificaciones, WhatsApp, publicación social, solicitudes reales ni solicitudes HTTP a integraciones externas desde pruebas. El recorrido sintético será localhost-only y no publicará páginas indexables.
- No añadir bypass de autenticación al bundle de producción; cualquier facilitador de prueba debe quedar aislado y ser imposible de activar en producción.
- No mostrar fixtures en rutas indexables ni generar sitemap/URLs públicas para ellos.
- Revertir por commit de la rama local o rollback de los archivos afectados; sin cambios de esquema remoto.

## Decisiones técnicas

| Decisión | Motivo | Alternativa descartada |
|---|---|---|
| Separar catálogo público de fixtures demo | Evita presentar ejemplos como oferta y hace fiel el conteo/filtro | Mantener fallback sintético en búsquedas públicas |
| Diferenciar catálogo vacío, filtro sin coincidencias y error de API | Evita una señal falsa cuando no hay servicio o stock | Un único estado «sin resultados» |
| Estado común de disponibilidad por módulo | Evita contradicciones entre landing, demo y panel | Copys independientes sin trazabilidad |
| Simulación económica marcada como estimación y basada en supuestos visibles | Evita prometer financiación/margen que no se calcula | Mostrar una cifra mensual aislada |
| Flujo E2E local sintético e aislado | Permite verificar valor real sin crear datos ni acciones externas | Probar con cuenta/vehículo/leads reales |

## Trazabilidad hacia requisitos

| Parte del plan | RF cubiertos |
|---|---|
| Catálogo, filtros y estados | RF-1–RF-4 |
| Disponibilidad y copy de capacidades | RF-5–RF-6 |
| Recorrido sintético local | RF-7–RF-8, RF-12 |
| Calculadoras y supuestos | RF-9–RF-11 |

## Estrategia de pruebas

- Unitarias/estáticas: filtros por límites de precio, fixtures no usados como catálogo público, política de salida de fichas sintéticas, etiquetas de estado y ausencia de claims de IA/demanda real no implementados.
- Integración local: catálogo vacío disponible y API no disponible; los estados con vehículos publicados y filtros sin coincidencias se revisan en lógica y pruebas unitarias con fixtures sintéticos, nunca en el inventario real.
- Recorrido manual/local: cuenta de prueba, vehículo, fotos sintéticas, borrador/revisión, previsualización/ficha y consulta sintética; revisar aislamiento, recarga, permisos y ausencia de red externa.
- Cálculos: casos de entrada cero, cuota positiva, término/plazo, tasa y costes excluidos; comparar fórmulas verificadas con valores exactos.
- UX: responsive, teclado, lector de pantalla, mensajes accesibles y páginas/fichas de demo.
- Revisión independiente Gauntlet tras implementar y validar; hasta tres rondas según política.
- No ejecutar pruebas, migraciones, envíos de correo ni acciones de producción antes de aprobar el plan y la clarificación.
