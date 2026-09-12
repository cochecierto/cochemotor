# Tareas — Coche Ideal

Cada tarea debe ejecutarse de forma aislada y conservar la trazabilidad con la spec.

- [ ] T1 — Resolver decisiones pendientes de backend, deduplicación, notificación y canonical.
  - Requisitos: Persistencia y notificación, Decisiones pendientes.
  - Hecho cuando: las cuatro decisiones quedan aprobadas y reflejadas en la clarificación y el plan.
- [ ] T2 — Diseñar contrato de datos y estados de la solicitud.
  - Requisitos: Estados de seguimiento, Persistencia y notificación.
  - Hecho cuando: existe contrato versionado, validación de estados y aislamiento por tenant.
- [ ] T3 — Implementar pasos 1 y 2 con validación y conservación de borrador.
  - Requisitos: Flujo funcional, Interacción.
  - Hecho cuando: los campos, dependencias y errores se prueban sin pérdida de datos.
- [ ] T4 — Implementar paso 3, consentimiento y resumen editable.
  - Requisitos: Paso 3, Privacidad y copy.
  - Hecho cuando: el consentimiento es verificable y el resumen permite corregir antes de enviar.
- [ ] T5 — Implementar persistencia, deduplicación y notificación interna.
  - Requisitos: Persistencia y notificación.
  - Hecho cuando: éxito, duplicado, sesión caducada y fallo de persistencia tienen respuestas verificadas.
- [ ] T6 — Validar responsive, accesibilidad, privacidad y regresiones.
  - Requisitos: Responsive y accesibilidad; criterios EARS completos.
  - Hecho cuando: se recorren 320×568, 390×844, 768×1024, 1024×768, 1440×900 y móvil horizontal, con informe RF por RF.