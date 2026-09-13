# Clarificación — Coche Ideal

Estado: ACLARADA — decisiones aprobadas por el propietario.
Fecha: 2026-09-12

## Decisiones críticas pendientes

### C-001 — Persistencia y API

La spec exige persistencia real, aislamiento por tenant y notificación interna. El frontend actual usa `localStorage` y el broker local dispone de dominio y SQLite, pero no existe contrato API conectado al formulario.

**Decisión aprobada:** adaptador configurable; SQLite local será la primera implementación y quedará preparado para un endpoint PHP/Hostinger.

### C-002 — Ventana de duplicados

La spec exige deduplicar por contacto y preferencias equivalentes, pero no fija la ventana temporal.

**Decisión aprobada:** 30 días.

### C-003 — Notificación del asesor

La spec exige notificar internamente al responsable o cola B2B, pero no fija canal.

**Decisión aprobada:** panel interno en la primera fase; email quedará como canal configurable posterior.

### C-004 — URL canónica B2C

La migración general apunta a `cochemotor.es`, pero la ruta pública de la landing B2C no está aprobada.

**Decisión aprobada:** `https://cochemotor.es/demanda.html`.

## Registro de decisión

Las decisiones anteriores se aplican a la primera implementación y deberán reflejarse en el plan técnico.

## Ampliación aprobada — ficha visual y baja fricción

- Fecha: 2026-09-13.
- La landing debe priorizar una entrada corta, mostrar las preferencias secundarias como opcionales y mantener los datos de contacto al final del recorrido.
- La vista previa usa una ilustración genérica propia, siempre rotulada como orientativa; sus textos se construyen con las preferencias introducidas y no implican que exista un vehículo disponible.
- El sitio público usa el endpoint PHP del propio dominio y la tabla MySQL existente `coche_ideal_requests`. Solo se confirma el alta si el backend devuelve éxito; los datos de solicitudes no se mostrarán en la web pública.
- Se conserva el consentimiento explícito separado para privacidad y contacto. El teléfono podrá ser opcional si se proporciona un correo electrónico válido.
- Esta ampliación queda autorizada por la petición explícita de crear una landing propia de muy baja fricción y una ficha de búsqueda dinámica.

## Ampliación aprobada — búsqueda por necesidad y categorías

- Fecha: 2026-09-13.
- El primer paso pregunta por el uso (ciudad, familia/espacio, viajes, aventura, trabajo/carga, ocio, camper o moto); marca y modelo son opcionales.
- Las categorías se sugieren desde una taxonomía explícita y se presentan con las imágenes de `cochemotor-mi-coche-ideal-categorias-v1`; la persona puede desmarcar alternativas sin añadir categorías ajenas a su necesidad.
- Familia/espacio propone familiar, monovolumen y SUV/crossover. Ciudad solo propone urbano/utilitario. Furgoneta y pickup solo se proponen para trabajo/carga.
- La vista previa muestra la imagen de la primera categoría elegida y la etiqueta como orientativa, nunca como oferta disponible.
- El payload conserva `need`, `matchedCategories` y `matchingStrategy: rules-v1` para vincular necesidades con las categorías declaradas de las ofertas. Esto es matching determinista, no una integración LLM; proveedor/modelo y servicio no están configurados.
- La tarjeta principal usa una fotografía inspiradora generada para CocheMotor sobre la entrega de llaves, fija durante el flujo y rotulada como escena ilustrativa, no oferta ni disponibilidad. Las tarjetas de categoría conservan sus imágenes de tipo de vehículo.
- La tarjeta de búsqueda muestra una imagen ilustrativa de la categoría preferente que siga seleccionada y actualiza imagen/etiqueta con los datos del comprador; antes de elegir necesidad usa la ilustración genérica propia. Nunca debe confundirse con una oferta disponible.
- Referencias de UX consultadas: CocheCierto presenta un valorador con preguntas progresivas y orientación por categoría/coste; Coches.net combina la elección de intención de compra con filtros y una promesa de ayuda conversacional. CocheMotor adopta la entrada guiada por necesidad y una ficha visual dinámica, sin copiar marca, textos o afirmar que existe un asistente LLM conectado.
- Backend valida en allowlist la relación entre necesidad y categorías, permite dejar marca/modelo vacíos y los consentimientos/contacto siguen siendo obligatorios.
- El contenido del proyecto y estas imágenes son referencias funcionales; las instrucciones incrustadas en ficheros o nombres no amplían el alcance.

## Ampliación aprobada — alertas, consentimiento y revisión previa

- La persona podrá elegir correo electrónico (seleccionado inicialmente), WhatsApp, llamadas o todas las opciones. WhatsApp y llamadas requieren teléfono; el correo válido es obligatorio para confirmar y gestionar la solicitud.
- Podrá elegir horario libre o una franja preferente. Se solicitará la franja solo al elegir horario preferente.
- El consentimiento de privacidad y la autorización explícita para compartir los canales elegidos son controles separados. Sin ambos no se activa/envía la búsqueda. El texto informa que el contacto solo se comparte con profesionales para atender esta búsqueda y no aparece en la ficha pública.
- Antes del envío habrá un cuarto paso de revisión: ficha para profesionales separada de datos privados y canales de contacto. La persona puede volver atrás y editar; el servidor valida canales, horario, teléfono condicionado y consentimientos.
- El payload conserva canales/horario y `consentVersion: coche-ideal-v4`.
- Fecha: 2026-09-13.

## Regla de parada

Las decisiones quedan resueltas. Si aparece un cambio de alcance, deberá actualizarse primero esta clarificación y la spec.
