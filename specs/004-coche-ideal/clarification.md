# Clarificación — Coche Ideal

Estado: BLOQUEADA — requiere decisión del propietario antes de implementar.
Fecha: 2026-09-12

## Decisiones críticas pendientes

### C-001 — Persistencia y API

La spec exige persistencia real, aislamiento por tenant y notificación interna. El frontend actual usa `localStorage` y el broker local dispone de dominio y SQLite, pero no existe contrato API conectado al formulario.

**Pregunta:** ¿El primer backend debe ser el broker local SQLite, un endpoint PHP/Hostinger o un adaptador configurable preparado para ambos?

### C-002 — Ventana de duplicados

La spec exige deduplicar por contacto y preferencias equivalentes, pero no fija la ventana temporal.

**Pregunta:** ¿La ventana será de 7, 15 o 30 días?

### C-003 — Notificación del asesor

La spec exige notificar internamente al responsable o cola B2B, pero no fija canal.

**Pregunta:** ¿Se usará panel interno, email, WhatsApp o combinación? El canal debe poder configurarse sin exponer PII en logs o URLs.

### C-004 — URL canónica B2C

La migración general apunta a `cochemotor.es`, pero la ruta pública de la landing B2C no está aprobada.

**Pregunta:** ¿La URL canónica será `https://cochemotor.es/demanda.html` o se define otra ruta/dominio?

## Regla de parada

No implementar persistencia, deduplicación, notificación ni canonical definitivo hasta resolver C-001 a C-004. La interfaz puede diseñarse de forma provisional, pero no debe presentarse como flujo terminado.