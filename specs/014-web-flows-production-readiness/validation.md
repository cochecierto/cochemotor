# Validación — Spec 014

Validación local completada el 2026-09-14. No se inició sesión con una cuenta
real, no se escribieron datos en producción, no se aplicó DDL remoto y no se
publicó el commit.

| Requisito | Evidencia local | Estado |
|---|---|---|
| RF-1 | Hub consulta `/api/auth` con Bearer, adapta `email_verified` a `verified` y espera `COCHEMOTOR_AUTH_READY`; probado por regresión de contrato. | Implementado; falta recorrido con sesión/API real. |
| RF-2 | API extrae Bearer; `GET /api/vehicles` y `GET /api/leads` son del usuario autenticado. | Implementado; falta probar tokens válidos, ausentes y caducados contra BD de ensayo. |
| RF-3 | Inicializador de precio incluido en `site-config.js`; marketplace conserva filtros y procesa respuesta API con fallback; rutas inexistentes devuelven 404 en el renderer SEO. | Código y sintaxis revisados; falta navegador contra staging y verificación HTTP del 404. |
| RF-4 | POST de lead valida tamaño, honeypot, formato, petición expresa, versión de aviso, vehículo publicado, contacto verificado y 3 solicitudes/10 min; el tenant procede de la fila del vehículo. | Contrato y sintaxis pasan; falta integración con migración 007 en una BD de ensayo. |
| RF-5 | La ficha SEO real espera respuesta y solo confirma tras `response.ok`; errores conservan los campos. Fichas demo no permiten contactar. | Regresión estática pasa; falta guardar/forzar error en API de ensayo. |
| RF-6 | Registro requiere enlaces y checks versionados; los anuncios entran pendientes y evidencia `declarado`. | Pruebas de forma y sintaxis pasan; falta validar entrega de correo y alta en BD de ensayo. |
| RF-7 | `vehicles_catalog.js` mide 4,214,640 bytes y dejó de importarse estáticamente desde `home_catalog.js`; el módulo se difiere hasta interacción/idle. | Dependencia retirada de ruta inicial por revisión estática; falta medir waterfall/Core Web Vitals en navegador. |
| RF-8 | Workflow contempla scripts, runtime, API, guardia 004–007 y compara SHA-256 de activos con URLs cache-busted. | Workflow revisado en código; hash remoto solo se confirma al hacer un despliegue autorizado. |

Verificaciones ejecutadas: `python -m unittest discover -s tests -p 'test_*.py'`
(65 pasan); `php -l` en API y rutas SEO; `node --check` en `hub.js`,
`site-config.js`, `assets/js/home_catalog.js` y `assets/js/public-lead-form.js`;
`git diff --check` sin errores.

Smoke de navegador local servido desde PHP: el marketplace mantuvo `brand=Toyota`,
`price=20000` y `q=corolla` en sus controles/URL; cambiar el precio actualizó
el filtro y su query string; con la API no configurada mostró estado vacío sin
error de consola. Inicio cargó el selector de marca y al elegir Toyota presentó
modelos asociados; el catálogo completo se solicita por el módulo diferido. La
API local no pudo iniciar porque no está disponible la configuración privada
necesaria; por ello el smoke no valida sesión, registro, persistencia de leads
ni escritura de anuncios.

No es posible afirmar resultado extremo a extremo en producción todavía. Antes
del release se necesita copia reciente de BD, aplicar/verificar 007 tras las
migraciones anteriores, probar en staging con datos sintéticos, publicar el
commit y revisar los hashes y flujos reales. El workflow bloquea release si
no se marcan backup y esquema listos; no ejecuta migraciones automáticamente.
