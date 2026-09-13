# Tareas — Coche Ideal

Cada tarea conserva trazabilidad con la spec 004 y la ampliación de landing/ficha visual.

- [x] T1 — Resolver backend, deduplicación, notificación y canonical.
  - Requisitos: Persistencia y notificación; decisiones de la clarificación.
  - Hecho cuando: la clarificación y el plan indican endpoint MySQL, ventana de duplicados de 30 días, cola interna existente y canonical.
- [x] T2 — Usar el esquema existente de solicitudes y definir payload de ficha.
  - Requisitos: Estados de seguimiento; persistencia; datos de vista previa.
  - Hecho cuando: el contrato conserva preferencias, contacto mínimo, consentimiento versionado e identificador no sensible.
- [x] T3 — Implementar landing progresiva, ficha ilustrativa y validaciones.
  - Requisitos: Flujo funcional; interacción; baja fricción.
  - Hecho cuando: el formulario progresa y la vista previa cambia imagen, categoría y datos de búsqueda según la preferencia seleccionada, sin mostrar una oferta real; antes de seleccionar usa la ilustración genérica de CocheMotor.
- [x] T4 — Implementar contacto, consentimiento y resumen.
  - Requisitos: Paso de contacto; privacidad; resumen previo.
  - Hecho cuando: nombre y correo son obligatorios, teléfono opcional y los dos consentimientos deben aceptarse antes de enviar.
- [x] T5 — Implementar POST MySQL y deduplicación.
  - Requisitos: Persistencia; duplicado; fallo de persistencia.
  - Hecho cuando: `/api/coche-ideal` valida el payload, inserta en una transacción y responde sin filtrar PII.
- [ ] T6 — Validación final en navegador y base activa.
  - Requisitos: Responsive, accesibilidad, privacidad y criterios EARS.
  - Hecho cuando: se prueba vista previa, navegación, envío, duplicado y error a 320, 390, 768, 1024 y 1440 px; la conexión real MySQL se confirma en el entorno autorizado.
- [x] T7 — Priorizar la búsqueda por necesidad y proponer categorías visuales.
  - Requisitos: entrada por intención, assets entregados, asociación entre búsquedas y ofertas.
  - Hecho cuando: necesidades y categorías compatibles están mapeadas, las tarjetas usan imágenes reales de categoría, marca/modelo son opcionales y furgonetas/pickups solo aparecen para trabajo/carga.
- [x] T8 — Validar taxonomía y persistir señal de matching.
  - Requisitos: integridad de datos y separación entre matching actual y LLM futuro.
  - Hecho cuando: frontend y API comparten un allowlist, `need`, `matchedCategories` y `rules-v1` se guardan, y categorías ajenas a la necesidad se rechazan.
- [x] T9 — Añadir canales de alerta, horario preferido, consentimiento explícito y revisión final.
  - Requisitos: privacidad, elección de contacto, revisión previa y baja fricción.
  - Hecho cuando: email/WhatsApp/llamadas/todas y horario libre/preferido quedan en el payload; teléfono/franja se validan según elección; API solo guarda con ambos consentimientos y la ficha separa información compartible de datos privados.
