# Clarificación — Spec 014

## Hechos observados

1. `hub.html` y `hub.js` envían `session_token` en JSON, pero `api/index.php`
   busca la sesión exclusivamente en `Authorization: Bearer …`; las rutas
   protegidas usan `requireUser()`.
2. `marketplace.html` llama a `populatePriceSearchSelect()` antes de cargar el
   catálogo remoto; no existe una definición de esa función en el archivo.
3. El endpoint público de vehículos responde con inventario vacío. Las pruebas
   no deben crear coches ficticios ni tratar ejemplos como anuncios reales.
4. `ficha.html` guarda el lead en almacenamiento local, hace un `POST /api/leads`
   sin esperar su resultado y muestra confirmación inmediata. El endpoint no
   valida consentimiento ni límites de abuso; deriva tenant desde el vehículo y
   sobrescribe el `tenant_id` enviado por el cliente.
5. En producción el catálogo API respondió vacío. Una ficha de ejemplo no debe
   generar una solicitud real ni aparecer como oferta con inventario disponible.
6. El alta en `acceso.html` no muestra enlace de privacidad/condiciones ni
   captura aceptación en el formulario observado. La determinación de la base
   jurídica y el texto de los avisos no se puede inferir del código.
7. El inicio importa `assets/js/home_catalog.js`, que importa el catálogo
   completo desde `assets/data/vehicles_catalog.js`; revisar tamaño y carga
   diferida antes de elegir una solución.
8. Los workflows SFTP tienen listas de archivos separadas y disparadores por
   rutas. El despliegue anterior no garantiza por sí solo que todos los
   dependientes de un cambio se publiquen ni que una caché entregue la misma
   versión que Git.

## Decisiones de alcance

- Se unificará el contrato de autenticación alrededor del token Bearer salvo
  que el plan demuestre una razón de compatibilidad para otra opción.
- Las pruebas usarán cuentas, solicitudes e inventario sintéticos locales; no
  enviarán formularios productivos ni reutilizarán credenciales reales.
- El inventario vacío se resolverá con estado vacío honesto y operable. La
  carga de anuncios reales queda en manos de Dirección y moderación.
- No se supondrá que una casilla genérica de “consentimiento” resuelve RGPD. La
  interfaz, la información y las declaraciones se basarán en los documentos y
  decisiones aprobados; cualquier decisión jurídica pendiente permanecerá
  visible como bloqueo previo al lanzamiento con datos reales.
- Un lead solo se confirmará en la interfaz después de una respuesta exitosa y
  persistente del servidor; nunca se usará solo el almacenamiento local como
  señal de recepción por el vendedor.
- Los assets compartirán una manifest/versionado y el smoke test comparará
  bytes o huellas del commit publicado, además de HTTP 200.

## Riesgos y mitigaciones

- Un cambio API puede romper clientes antiguos: mantener compatibilidad
  explícita o migrar en un mismo release, con pruebas de contrato.
- Un rate limit en hosting compartido puede necesitar almacenamiento duradero:
  elegir una solución compatible con el esquema/configuración ya existentes y
  fallar de manera segura; no añadir proveedor externo.
- El formulario de alta/lead procesa datos personales: minimización,
  consentimiento versionado y pruebas sin personas reales.
- El copy actual promete una llamada en menos de 15 minutos, pero no se encontró
  un SLA ni una operación que lo sostenga; no se conservará como promesa sin
  evidencia/aprobación.
- El workflow actual requiere pasos manuales y secretos: no modificar secretos,
  base de producción ni ejecutar un deploy sin autorización separada.

## Veredicto

`GO` para implementación local de RF-1..RF-8. Dirección aprobó spec y plan el
2026-09-14. Publicar y desplegar requiere autorización separada.
