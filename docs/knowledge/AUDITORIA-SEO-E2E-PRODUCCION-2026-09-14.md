# Auditoría SEO y de flujos E2E en producción — CocheMotor

Fecha: 2026-09-14
Ámbito: `cochemotor.es`, GitHub `cochecierto/cochemotor` (`main`), carpeta local y flujo de publicación Hostinger.
Tipo: revisión técnica y de contenido; no es certificación legal, SEO ni de disponibilidad.

## Dictamen

**La línea base histórica era NO-GO; el release posterior quedó publicado con las puertas técnicas satisfechas, pero no certifica por sí solo la operación con leads reales ni el cumplimiento legal.** La revisión inicial detectó una ficha demo con acciones de contacto y un alta sin avisos versionados. Después se publicó `06ce8be` mediante el workflow SEO SFTP `34899405644`, que pasó validación, migraciones, smoke HTTP y comparación de hashes. La operación con datos reales, el correo y la revisión jurídica siguen fuera de esta auditoría.

Una auditoría no puede garantizar posiciones SEO, conversiones ni disponibilidad futura. Sí puede fijar puertas de salida y evidencia verificable; las pendientes se detallan abajo.

## Alcance y método

- Revisión pública, sin entrar en paneles privados: inicio, marketplace, acceso/registro, página profesional, guía, privacidad, términos, ficha `cm-002` y una ruta SEO inexistente.
- Contraste de archivos servidos por Hostinger con GitHub `main` y el checkout local.
- Revisión de `AGENTS.md`, operaciones SEO, preparación UE, Spec 014, política de release y skills internas SEO y privacidad/cookies.
- Ejecución local de `python -m unittest discover -s tests -p 'test_*.py' -v`: **65 pruebas OK**.
- No se enviaron registros, leads, anuncios ni formularios de contacto. La comprobación de autenticación con los datos facilitados no produjo en el navegador una respuesta visible ni acceso al panel; queda **inconclusa**. No se repitió.
- El navegador bloqueó la apertura directa de `robots.txt`, `sitemap.xml`, `sitemap-public.php` y `/api/health` (`ERR_BLOCKED_BY_CLIENT`). Por ello no se certifican sus códigos HTTP ni la salud de base de datos desde esta sesión.

## Hallazgos que bloquean producción

### P1 — La ficha heredada de `cm-002` sirve un coche ficticio con contacto activo

**Evidencia:** `https://cochemotor.es/ficha.html?id=cm-002` muestra un Toyota Yaris de ejemplo con precio, puntuación de revisión 100/100, garantía, diagnóstico de batería, vendedor nominal, WhatsApp, llamada y formulario para nombre/teléfono. La ficha observada no indica que sea una demostración ni que el contacto esté desactivado. La portada sí llama “ejemplo no disponible” a las tarjetas, pero ese contexto se pierde al abrir la ficha.

El `seo-legacy-redirect.php` servido por Hostinger confirma que, cuando el identificador antiguo no corresponde a un vehículo publicado, lee la ficha estática `ficha.html` como fallback y añade `X-Robots-Tag: noindex, follow`; no responde 404 en esa rama. La ruta sintética, además, queda enlazada desde la portada.

La rama local añade un aviso de demostración y oculta el bloque principal de contacto para fixtures, pero `seo-legacy-redirect.php` conserva ese fallback a la ficha estática; todavía debe verificarse/corregirse el 404 del identificador inexistente exigido por RF-3.

**Impacto:** una persona puede interpretar datos de demostración como una oferta verificada y enviar datos personales o contactar a un vendedor ficticio. `noindex` reduce exposición orgánica, pero no evita el problema para visitantes.

**Salida requerida:** servir 404/410 para identificadores inexistentes o retirar el fixture de la ruta pública; para cualquier demo, rotularla en la propia ficha, eliminar datos/claims no demostrables y desactivar WhatsApp, llamada y captura de datos. Comprobar cuerpo, `X-Robots-Tag` y código HTTP desde fuera.

### P1 — El alta publicada no muestra aviso ni aceptación de privacidad/condiciones

**Evidencia:** el formulario de registro abierto en producción contiene nombre, correo, contraseña y botón de alta; no muestra enlaces ni casillas visibles de privacidad/condiciones. El `api/index.php` de Hostinger y de GitHub `main` inserta la cuenta sin validar declaraciones de lectura/aceptación ni guardar sus versiones.

La copia local actual sí requiere esas declaraciones y la API las valida. Esas correcciones no están en `main` ni en los archivos de producción comparados. La migración `007_lead_and_registration_notice_mysql.sql` es prerequisito de la nueva API y el workflow la exige junto con respaldo verificado; no se considera probada en producción en esta auditoría.

**Impacto:** falta una capa de transparencia y trazabilidad en el alta actual. No equivale a una conclusión jurídica completa, pero incumple el requisito de producto RF-6 aprobado para el alta y el release no puede considerarse conforme a ese contrato.

**Salida requerida:** publicar la UI y API compatibles entre sí, tras respaldar la base y aplicar/verificar migración 007; probar en una base de ensayo alta válida, rechazo sin declaraciones, enlace de verificación, correo recibido, inicio de sesión y sesión autenticada. Revisar el contenido legal con Dirección/asesoría.

### P1 — Contacto y leads reales todavía no están validados

No se envió el formulario, correctamente, porque la ficha revisada es un fixture. Tampoco se validó persistencia ante error, asociación al tenant de un vehículo elegible, rate limit, aviso de privacidad mostrado, correo, o que el éxito solo aparezca tras persistir. La suite local cubre contratos y casos simulados; no prueba MySQL ni Hostinger.

**Salida requerida:** staging/base aislada con vehículo y contacto sintéticos; probar éxito, fallo, duplicado/límite, consentimiento ausente, vehículo no elegible y conservación del borrador. Después, un smoke de solo lectura en producción sin crear leads reales.

## SEO técnico y contenido

### Señales positivas observadas

- Inicio servido con título, descripción, canonical a `https://cochemotor.es/`, Open Graph/Twitter y bloque JSON-LD.
- La guía de compra tiene un único H1, estructura por etapas, enlaces a fuentes de la DGT y advertencia de que no sustituye asesoramiento.
- La página profesional separa beta gratuita de precios futuros y rotula como ilustrativo su panel de ejemplo.
- Una URL SEO de vehículo inexistente muestra una página de error no indexable en el contenido observado. Falta confirmar status HTTP 404; la ruta antigua `ficha.html?id=...` sí cae en el fixture, por lo que debe corregirse por separado.
- Robots publicado declara sitemap y bloquea `/api/`; el archivo existe. No se verificó la respuesta pública del sitemap dinámico en esta sesión.

### Mejoras pendientes

- Normalizar el selector de marcas del inicio: la lista visible incluye denominaciones duplicadas, fabricantes de vehículos recreativos y variantes societarias. Afecta a búsqueda y calidad de filtros; validar catálogo oficial antes de normalizar.
- El marketplace no mostró tarjetas de inventario en el DOM revisado y tampoco un estado vacío explicativo claro. Diferenciar “sin stock publicado” de error/carga y ofrecer una acción pertinente.
- No se accedió a Google Search Console ni se dispone de baseline de impresiones, clics, CTR, indexación o consultas. No hay base para prometer mejora de ranking o tráfico.
- Sitemap, canonical y status codes en producción requieren prueba HTTP externa; un archivo fuente correcto y la prueba local no demuestran que Apache, PHP, MySQL y Hostinger los sirvan correctamente.
- No se midieron Core Web Vitals ni waterfall en móvil. La reducción/carga bajo demanda del catálogo está probada por código/tests locales, no por transferencia real de producción.

## Privacidad, cookies y seguridad del flujo

- En las páginas muestreadas no se vio un banner de cookies. Esto **no prueba incumplimiento** si solo hay almacenamiento estrictamente necesario; tampoco prueba que no existan etiquetas o tecnologías de terceros. No se obtuvo un inventario completo de cookies, almacenamiento, peticiones y proveedores en sesión limpia, antes y después de una elección.
- El login guarda un token de sesión en `localStorage`. Es funcional, pero queda expuesto a JavaScript del mismo origen ante XSS; mantener CSP ausente en la auditoría de seguridad previa deja una mejora de defensa en profundidad. Evaluar cookie de sesión `HttpOnly`, `Secure`, `SameSite` y protección CSRF antes de cambiar el contrato.
- La política de privacidad publicada identifica un buzón y enumera finalidades/derechos, pero el contenido muestreado no concreta plazos de conservación ni la información completa de destinatarios/encargados y transferencias. El propio informe de preparación UE del repo ya registra estos pendientes; requiere identidad real y revisión profesional.
- La ficha sintética observada presenta un formulario de datos de contacto sin el aviso/solicitud visible que sí exige la nueva ruta SEO local.
- La AEPD requiere consentimiento previo para tecnologías no técnicas sujetas a consentimiento y opciones de aceptar/rechazar al mismo nivel; el RGPD art. 13 exige informar, entre otros elementos aplicables, sobre finalidad/base jurídica, destinatarios, conservación y derechos. Hace falta inventario técnico para decidir si una CMP es necesaria; no se recomienda añadirla a ciegas.

## Sincronización y estado del release

- GitHub `main`: `06ce8bece08ecd158dcca8c99fcac0aad02df587` (`docs: record SEO and production E2E audit`).
- Checkout local: rama `codex/014-web-flows-production-readiness`, `HEAD 06ce8bece08ecd158dcca8c99fcac0aad02df587`.
- El workflow SEO SFTP `34899405644` terminó `success`: validó rutas, sintaxis, sitemap, secretos/host key, promoción por staging, sitemap/robots/guía públicos y hashes de activos contra ese SHA.
- Las 65 pruebas locales pasan, pero no cubren correo ni conexión PDO a la base Hostinger. La Spec 014 quedó publicada con release y hashes verificados; las pruebas de correo y conexión productiva siguen fuera de alcance.
- En `u560645602_cochemotor` se verificaron los campos de la migración 007, el índice `idx_leads_vehicle_phone_created`, el índice único `uq_vehicles_public_slug` y el valor por defecto `vehicles.evidence_level='declarado'`; no se crearon cuentas ni leads reales.

## Plan de salida verificable

1. Corregir la ruta heredada para que ningún ID inválido devuelva la ficha demo. Desactivar formularios/acciones de contacto en demos y asegurar un estado vacío honesto.
2. Alinear el alta UI/API con privacidad y términos versionados. Verificar el esquema 007 en staging y preparar backup/restauración antes de la base productiva.
3. Publicar el commit aprobado por el canal con permisos de escritura; ejecutar CI y el workflow de Hostinger solo con las guardias satisfechas. Comparar hashes de activos y guardar SHA desplegado.
4. Hacer smoke HTTP público: inicio, robots, sitemap XML válido, canonical, ficha inexistente 404/noindex, ficha real elegible, páginas privadas noindex, assets con hashes y estado vacío.
5. Completar pruebas E2E con usuario/base de ensayo: registro, verificación de correo, login, panel, creación/publicación, lead, sesión caducada, logout y reintento fallido sin pérdida de datos. No usar fichas ficticias para leads reales.
6. Ejecutar inventario de cookies/almacenamiento/terceros en navegador limpio. Solo entonces decidir banner/CMP y actualizar privacidad con finalidad, base, conservación, receptores y transferencias reales.
7. Capturar baseline de Search Console y rendimiento móvil; documentar fecha/commit y repetir tras publicar. No declarar impacto SEO hasta medirlo.

## Fuentes oficiales consultadas

- [AEPD — Guía de cookies](https://www.aepd.es/guias/guia-cookies.pdf) y [FAQ sobre cookies](https://www.aepd.es/preguntas-frecuentes/17-internet-y-redes-sociales/FAQ-1707-importancia-de-las-cookies-en-la-proteccion-de-datos).
- [BOE — Ley 34/2002 consolidada, art. 22](https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758).
- [EUR-Lex — Reglamento (UE) 2016/679, arts. 5 y 13](https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=es).

## Límites

No es auditoría de penetración ni dictamen jurídico. No se accedió a Search Console, correo, base de producción, logs, métricas del servidor o historial de indexación. La inspección de páginas no equivale a medir código HTTP si no se obtuvo la respuesta de red. Las credenciales facilitadas no se guardan en este informe.

