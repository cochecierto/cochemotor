# Plan técnico — Coche Ideal

Estado: aprobado para primera implementación con decisiones aclaradas.

## Arquitectura

La página `demanda.html` será una landing mobile-first que pregunta primero por la necesidad de movilidad. El usuario elige entre ocho usos; `demanda.js` ofrece las categorías relacionadas en tarjetas con los assets de `assets/images/coche-ideal/categories/`, deja la selección editable y actualiza textos e imagen de la ficha con la categoría preferente seleccionada. Antes de indicar un uso aparece una ilustración genérica propia. La cabecera conserva una imagen inspiradora de entrega de llaves, marcada como escena ilustrativa. Marca/modelo son opcionales. La API PHP valida la taxonomía y conserva necesidad, categorías aceptadas y versión de matching; la ruta pública solo permitirá crear solicitudes y el panel interno conserva sus operaciones separadas.

## Datos

La solicitud incluye necesidad (`preferences.need`), categorías compatibles aceptadas (`preferences.matchedCategories`), estrategia de matching (`rules-v1`), identidad de catálogo opcional (marca, modelo, versión), preferencias, territorio, contacto con canales y horario elegidos, consentimiento versionado, estado, tenant y marcas temporales. El estado inicial será `nueva`.

## Reglas

- Deduplicar contacto + preferencias equivalentes durante 30 días.
- No incluir PII en logs ni URLs.
- Notificación inicial en el panel interno; email queda configurable.
- Canonical: `https://cochemotor.es/demanda.html`.
- Consulta, propuesta, reserva y compraventa permanecen separadas.
- La confirmación de alta depende del insert MySQL; no se usa `localStorage` como sustituto silencioso de persistencia.
- El recorrido tiene cuatro pasos: necesidad, preferencias, contacto y revisión final editable antes de confirmar.
- Se ofrece correo (por defecto), WhatsApp, llamadas o todas; teléfono obligatorio solo si se selecciona WhatsApp/llamada. Horario libre o franja preferida (mañana/mediodía/tarde).
- La ficha de revisión separa lo visible a profesionales de datos privados. Política de privacidad y autorización para compartir datos son consentimientos independientes y obligatorios; API rechaza peticiones incompletas y conserva `coche-ideal-v4`.
- Las imágenes de categoría se sirven como assets estáticos aportados por el propietario; son ejemplos de tipo de vehículo y no derivan ni representan una oferta concreta.
- Matching inicial transparente por reglas, validado también por el servidor. No hay integración LLM/proveedor configurado y no se simulará una.
- Uso/categoría restringidos: ciudad→urbano; familia→familiar/monovolumen/SUV; trabajo/carga→furgoneta/pickup. Los demás mappings están centralizados en la interfaz y replicados en validación de API.

## Seguridad y privacidad

Validación en cliente y servidor, consentimiento separado, minimización, identificador no sensible y aislamiento por tenant. Canales, teléfono condicionado y franja horaria se validan en servidor. El frontend conserva un borrador temporal ante errores.

## Pruebas

Pruebas de sintaxis PHP/JS, validación del payload y errores; recorrido manual de cuatro pasos; vista previa en vivo, atrás/edición desde revisión, canales, horarios, consentimiento, duplicado y fallo; revisión responsive en 320×568, 390×844, 768×1024, 1024×768, 1440×900 y móvil horizontal.

## Riesgos

La existencia del endpoint y la tabla en el repositorio no demuestra que la migración o la configuración de credenciales estén activas en producción; el despliegue real queda fuera de esta tarea.
