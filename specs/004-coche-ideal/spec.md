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

### Paso 1 — Necesidad y tipos que encajan

El sistema preguntará primero qué necesidad quiere resolver la persona: ciudad, familia/espacio, viajes frecuentes, campo/aventura, trabajo/carga, ocio/conducción, camper o moto. Mostrará una propuesta de categorías asociadas en tarjetas con imágenes. La persona podrá quitar alternativas, pero debe mantener al menos una. Marca y modelo serán preferencias opcionales; no bloquearán una búsqueda por necesidad.

La taxonomía inicial será: ciudad→urbano/utilitario; familia→familiar, monovolumen y SUV/crossover; viajes→fastback, familiar y SUV; aventura→SUV, todoterreno y coupé deportivo 4x4; trabajo/carga→furgoneta y pickup; ocio→descapotable, fastback y coupé deportivo 4x4; camper→autocaravana/camper; moto→moto. La furgoneta/pickup no se sugerirá en necesidades genéricas de coche.

### Paso 2 — Presupuesto y preferencias

Campos: presupuesto mínimo y máximo (o rango equivalente), combustible (`indiferente`, `gasolina`, `diésel`, `híbrido`, `híbrido enchufable`, `eléctrico`), cambio (`indiferente`, `manual`, `automático`), año mínimo y plazo (`lo antes posible`, `1–2 meses`, `3–6 meses`, `solo informativo`).

### Paso 3 — Contacto y alertas

Nombre y correo son obligatorios; teléfono solo si se elige WhatsApp o llamada. Se podrá elegir uno o varios canales (correo, WhatsApp, llamadas o todos), más horario libre o preferente (mañana, mediodía o tarde). La política de privacidad y el permiso explícito para compartir los canales seleccionados son consentimientos independientes. Sin los dos permisos no se activa ni envía la búsqueda. Los datos de contacto no forman parte de la ficha pública.

### Paso 4 — Revisión y publicación

Antes de enviar, la persona verá por separado la ficha que recibirán los profesionales y sus datos privados/canales elegidos. Podrá volver atrás y editar. El backend vuelve a validar permisos, canales, horario y teléfono condicionado antes de guardar.

## Interacción

- La landing abre con una pregunta directa y el primer grupo corto de campos; las preferencias secundarias aparecen de forma progresiva.
- La landing usa una escena inspiradora ilustrativa de entrega de llaves (no oferta ni garantía de disponibilidad). La ficha tiene su propia imagen orientativa, que comienza con una silueta genérica y cambia a la categoría preferente marcada (incluyendo cambios de selección), junto con etiqueta accesible. La vista previa se actualiza con necesidad, marca/modelo, presupuesto y zona.
- La solicitud transmite la necesidad, categorías marcadas y `matchingStrategy: rules-v1`; el matching inicial es transparente por reglas y no se describe como LLM.
- Indicador visible de 4 pasos y paso actual.
- Botones `Continuar` y `Atrás`.
- Los datos se conservan al retroceder y ante errores de validación.
- El último paso muestra la ficha y los datos de contacto en bloques separados; se puede editar retrocediendo antes del envío.
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
- Cuando el visitante cambie de necesidad, el sistema propondrá exclusivamente las categorías permitidas para ese uso.
- Cuando el visitante no indique marca o modelo, el sistema permitirá continuar si ha elegido una necesidad, al menos una categoría y presupuesto.
- Mientras el visitante complete la solicitud, el sistema actualizará una ficha ilustrativa sin presentar la imagen como un vehículo disponible.
- Cuando cambie la necesidad o desmarque el tipo sugerido, la ficha mostrará la imagen de la primera categoría compatible que siga seleccionada; si no hay selección, mantendrá una imagen genérica. La imagen se identificará como orientativa.
- Cuando el visitante no indique una preferencia secundaria, el sistema la tratará como indiferente y no impedirá avanzar.
- Cuando el visitante retroceda, el sistema restaurará los valores introducidos.
- Cuando se alcance el resumen, el sistema mostrará todas las preferencias y datos antes del envío.
- Cuando se elija WhatsApp o llamada, el sistema exigirá teléfono; si se elige solo correo, el teléfono será opcional.
- Cuando se seleccione horario preferente, el sistema exigirá una franja horaria válida; el horario libre no requiere franja.
- Cuando falte alguno de los consentimientos o el servidor reciba canales u horarios no permitidos, el sistema rechazará la solicitud sin activar el contacto.
- En la ficha para profesionales nunca aparecerán nombre, correo o teléfono; compartir canales de contacto requiere permiso explícito.
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
- Exponer como pública una solicitud incompleta o antes de confirmar su persistencia en el backend.

## Decisiones pendientes

- El endpoint público de captura persistirá solicitudes en la tabla `coche_ideal_requests`; no devolverá ni expondrá datos personales públicamente.
- [NECESITA ACLARACIÓN: política exacta de deduplicación y ventana temporal].
- [NECESITA ACLARACIÓN: canal interno de notificación al asesor].
- [NECESITA ACLARACIÓN: dominio final de la landing B2C y canonical SEO].
