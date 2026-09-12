# Spec 004 — Coche Ideal

Estado: propuesta funcional para validación.
Producto: CocheMotor B2C/B2B.
Alcance: landing y módulo B2C conectado al soporte operativo B2B.

## Objetivo

Permitir que un particular registre una necesidad de vehículo cuando no encuentra una unidad adecuada en el stock visible. La solicitud es una consulta sin pago, reserva ni compromiso automático. Un asesor la revisa y puede buscar alternativas en fuentes autorizadas, comprobar la información disponible y presentar propuestas claras.

## Público y separación de superficies

- Buyer persona principal de CocheMotor: freelancers, talleres y pequeños concesionarios.
- La capa B2C se presenta en una landing independiente con identidad CocheMotor y copy de conversión para particulares.
- La solicitud B2C alimenta el trabajo B2B de matching y atención profesional.
- La solicitud, la propuesta y la reserva/compraventa son fases distintas y no deben compartir un consentimiento ambiguo.

## Flujo funcional

### Paso 1 — Definición del vehículo

El sistema solicitará marca, modelo y acabado o versión. Marca incluirá `Otra marca`; cuando se seleccione, aparecerá un campo de texto obligatorio para especificarla. El modelo dependerá de la marca y el acabado será texto libre u opción del catálogo cuando exista.

### Paso 2 — Presupuesto y preferencias

Campos: presupuesto mínimo y máximo (o rango equivalente), combustible (`indiferente`, `gasolina`, `diésel`, `híbrido`, `híbrido enchufable`, `eléctrico`), cambio (`indiferente`, `manual`, `automático`), año mínimo y plazo (`lo antes posible`, `1–2 meses`, `3–6 meses`, `solo informativo`).

### Paso 3 — Datos del solicitante

Campos obligatorios: nombre y apellidos, teléfono, correo electrónico, provincia y aceptación verificable de la política de privacidad y del contacto relacionado con la solicitud. No se usarán nombres, teléfonos ni correos reales en fixtures, demos o pruebas.

## Interacción

- Indicador visible de 3 pasos y paso actual.
- Botones `Continuar` y `Atrás`.
- Los datos se conservan al retroceder y ante errores de validación.
- El último paso muestra un resumen editable antes del envío.
- El envío muestra confirmación visual con identificador ficticio o no sensible y el estado `nueva`.
- El sistema debe gestionar campos inválidos, solicitud duplicada, sesión caducada y fallo de persistencia sin perder silenciosamente los datos.

## Estados de seguimiento

La solicitud tendrá exactamente uno de estos estados: `nueva`, `en_revision`, `opciones_encontradas`, `presentada_al_cliente`, `aceptada`, `descartada`, `cerrada`.

La aceptación de una propuesta no equivale a una reserva ni a una compraventa. La reserva, si se incorpora después, deberá ser un módulo contractual independiente que identifique vehículo, precio, condiciones, señal, plazo y cancelación, con autorización expresa del cliente.

## Trabajo del asesor

El asesor podrá revisar la petición, buscar fuentes nacionales o internacionales autorizadas, filtrar opciones por compatibilidad, comprobar historial, kilometraje, estado y equipamiento, y presentar una o varias alternativas con características, condiciones y costes. La interfaz debe indicar que la disponibilidad, precio y adquisición no están garantizados hasta confirmación expresa.

## Persistencia y notificación

- Registrar la solicitud en el sistema con identificador, fecha, preferencias, consentimiento, versión de política y estado.
- Asociar la solicitud a un asesor o cola B2B sin exponer datos a otro tenant.
- Notificar internamente al responsable mediante el canal configurado; no incluir PII en logs ni URLs.
- El frontend puede conservar temporalmente un borrador, pero el envío válido debe registrarse en backend o servicio persistente autorizado.
- Debe existir deduplicación por contacto y preferencias equivalentes dentro de una ventana configurable, sin bloquear solicitudes legítimamente nuevas.

## Privacidad y copy

Todos los textos legales, emails, teléfonos, dominios y mensajes sensibles se leerán desde configuración. La solicitud de búsqueda no debe afirmar compra garantizada, disponibilidad asegurada, ausencia universal de cargas, garantía automática ni verificación que no esté respaldada por evidencia. La decisión final corresponde al cliente.

## Responsive y accesibilidad

El módulo será mobile-first, con una columna en móvil, controles táctiles, foco visible, labels asociados, mensajes de error junto al campo y resumen legible. El indicador de pasos no dependerá solo del color. Las acciones principales serán concretas: `Continuar`, `Revisar solicitud`, `Enviar búsqueda` y `Volver atrás`.

## Criterios de aceptación EARS

- Cuando un visitante inicia el módulo, el sistema mostrará el paso 1 y el indicador de progreso 1/3.
- Cuando el visitante complete un paso válido, el sistema permitirá avanzar y conservará sus datos.
- Cuando falte un campo obligatorio o tenga formato inválido, el sistema impedirá avanzar y mostrará un error comprensible sin borrar lo introducido.
- Cuando el visitante elija `Otra marca`, el sistema exigirá el nombre de la marca alternativa.
- Cuando el visitante retroceda, el sistema restaurará los valores introducidos.
- Cuando se alcance el resumen, el sistema mostrará todas las preferencias y datos antes del envío.
- Cuando se envíe una solicitud con consentimiento válido, el sistema registrará una solicitud `nueva`, mostrará confirmación y notificará al asesor responsable.
- Cuando exista una solicitud duplicada según la política configurada, el sistema informará al usuario y ofrecerá continuar o revisar la solicitud existente sin crear duplicados silenciosos.
- Cuando falle el envío o la persistencia, el sistema mostrará un error accionable y conservará el borrador local de forma temporal.
- Cuando un asesor presente alternativas, el sistema distinguirá visualmente `opciones_encontradas` o `presentada_al_cliente` de cualquier reserva o compraventa.
- En cualquier estado, el sistema aislará solicitudes por tenant y no mostrará PII en logs, URLs ni datos de ejemplo.

## Fuera de alcance

- Pago de señales o reservas dentro de esta primera fase.
- Compra automática, financiación automática o compromiso de adquisición.
- Scraping o integración de fuentes sin autorización.
- Uso de datos personales reales en fixtures, demos o pruebas.
- Promesa de encontrar exactamente la unidad solicitada.

## Decisiones pendientes

- [NECESITA ACLARACIÓN: backend persistente concreto y contrato API].
- [NECESITA ACLARACIÓN: política exacta de deduplicación y ventana temporal].
- [NECESITA ACLARACIÓN: canal interno de notificación al asesor].
- [NECESITA ACLARACIÓN: dominio final de la landing B2C y canonical SEO].