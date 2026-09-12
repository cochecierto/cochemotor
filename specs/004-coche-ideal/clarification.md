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

## Regla de parada

Las decisiones quedan resueltas. Si aparece un cambio de alcance, deberá actualizarse primero esta clarificación y la spec.