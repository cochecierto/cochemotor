# Spec 014 — Corrección integral de flujos web y publicación

Estado: aprobada por Dirección el 2026-09-14 para implementación local.

## Contexto y objetivo

La revisión de producción del 2026-09-14 detectó fallos que interrumpen el
acceso profesional y el marketplace, además de diferencias entre los activos
locales y los servidos por Hostinger. Esta iniciativa debe restaurar los flujos
existentes y dejar una ruta de publicación reproducible y verificable, sin
inventar inventario ni afirmar que SEO o disponibilidad comercial estén
garantizados.

## Usuarios / actores

- Visitantes que buscan vehículos en el marketplace.
- Profesionales que inician sesión, consultan su panel y publican stock.
- Personas que envían una solicitud de información sobre un vehículo.
- Dirección que revisa el resultado local y decide cualquier publicación.

## Requisitos funcionales (EARS)

- RF-1: CUANDO una persona autenticada abra el panel o ejecute una acción
  protegida, EL SISTEMA validará la misma sesión en cliente y servidor y
  conservará la sesión válida en una navegación directa a `hub.html`.
- RF-2: CUANDO el cliente invoque una ruta API protegida, EL SISTEMA enviará el
  token de sesión mediante un contrato único y el servidor rechazará sesiones
  ausentes, caducadas o inválidas sin perder el borrador de publicación.
- RF-3: CUANDO se cargue el marketplace con o sin parámetros de búsqueda, EL
  SISTEMA inicializará los filtros sin excepciones JavaScript y mostrará
  resultados publicados o un estado vacío fiel al inventario real. Cuando una
  ruta pública de ficha represente un recurso inexistente, responderá 404 sin
  presentar contenido de ejemplo como una oferta real.
- RF-4: CUANDO se envíe un lead, EL SISTEMA validará en servidor los campos,
  la solicitud de contacto, la información de privacidad mostrada y límites
  básicos de abuso; asociará el lead al tenant derivado de un vehículo real,
  publicado y contactable, sin confiar en `tenant_id` del cliente.
- RF-5: CUANDO se solicite información desde una ficha real, EL SISTEMA solo
  confirmará el envío después de persistirlo; ante un fallo conservará los
  campos introducidos y dará un mensaje recuperable. Las fichas de ejemplo no
  crearán leads ni prometerán una llamada no coordinada.
- RF-6: CUANDO una persona cree una cuenta, EL SISTEMA mostrará los enlaces de
  privacidad y condiciones aplicables antes del envío y solo recogerá las
  declaraciones/consentimientos aprobados, guardando su versión cuando
  corresponda. No se inventará una base jurídica ni se presentará una
  certificación de cumplimiento.
- RF-7: CUANDO el sitio cargue el catálogo de marcas y modelos, EL SISTEMA
  evitará bloquear la primera vista con el fichero de catálogo completo y
  seguirá permitiendo elegir opciones válidas.
- RF-8: CUANDO un cambio web se apruebe para publicar, EL SISTEMA dispondrá de
  un flujo de release que incluya todos los activos dependientes y una
  comprobación posterior de versión/huella para confirmar que Hostinger sirve
  el mismo contenido que GitHub.

## No funcionales

- Sin dependencias nuevas salvo aprobación posterior y justificación.
- Mantener HTML, CSS, JavaScript y PHP compatibles con el alojamiento actual.
- No exponer credenciales, tokens, datos personales ni contenido privado en
  registros, repositorio o respuestas públicas.
- Cubrir el recorrido con pruebas automatizadas y pruebas de integración con
  servicios sustitutos; las pruebas de producción serán de solo lectura hasta
  autorizar por separado acciones con efectos persistentes.
- Conservar la política de despliegue: validar y revisar primero; publicación
  externa exige autorización explícita y rollback documentado.

## Fuera de alcance

- Crear, importar o moderar inventario real sin datos y autorización de
  Dirección.
- Cambiar estrategia SEO, claims comerciales, precios o requisitos legales.
- Crear cuentas, anuncios, solicitudes o leads reales durante las pruebas.
- Publicar en GitHub o desplegar en Hostinger como parte de la implementación
  local; requieren autorización independiente.

## Criterios de finalización

- RF-1..RF-8 tienen pruebas y evidencia de validación requisito por requisito.
- El login llega al panel y las rutas protegidas rechazan/aceptan sesión según
  corresponda en pruebas sin depender de credenciales reales.
- El marketplace termina de inicializar con resultados y con inventario vacío;
  no hay errores bloqueantes en consola, y las rutas de vehículo inexistente
  devuelven 404 sin presentar contenido de ejemplo como oferta real.
- El alta de leads demuestra validación, información/contacto, límites de abuso,
  asociación tenant/vehículo real, persistencia antes de confirmar y recuperación
  del borrador; no crea datos con fichas sintéticas.
- Las rutas y los activos del release son verificables por contenido y
  corresponden al mismo commit; el CSS actualizado no queda oculto por caché.
- La vista inicial no descarga el catálogo completo innecesariamente; se
  registra tamaño transferido y comportamiento móvil.
- No se declara preparación E2E de producción hasta validar dependencias,
  cuentas, permisos, inventario, migraciones y rutas reales en el hosting.

## Aprobación

Dirección aprobó el 2026-09-14 la implementación local de RF-1 a RF-8. El
despliegue/push y cualquier escritura de datos en producción quedan fuera de
esta aprobación y requieren autorización independiente.
