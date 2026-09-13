# Auditoría de seguridad de CocheMotor — 2026-09-13

## Veredicto

**Apto con reservas (riesgo actual: moderado, 3/5).** El flujo principal está protegido frente a los abusos comprobados, pero queda deuda de seguridad operativa antes de usar datos reales a escala.

## Alcance y evidencia

- Código: `local-broker/server.py`, `local-broker/broker_core/auth.py`, páginas profesionales y pruebas.
- Infraestructura: VPS 1823868, Docker/Traefik, DNS y TLS de `api.cochemotor.es`.
- Despliegue validado en Hostinger desde `main`, commit `f34433b`.
- Suite: `python -m unittest discover -s local-broker/tests -p "test_*.py"` → 17 pruebas OK.
- Pruebas negativas públicas: perfil sin sesión → `401`; lead con vehículo inexistente → `404`; `/api/health` → `200`.
- No existen `firebase.json`, `.firebaserc`, `firestore.rules` ni `storage.rules`; la auditoría específica Firebase no aplica a esta arquitectura.

## Correcciones aplicadas

### P1 — IDOR en actualización de perfil — corregido

`action=profile` aceptaba un `user_id` sin comprobar una sesión. Ahora valida `session_token` y exige que el usuario de la sesión coincida con el `user_id` solicitado. El cliente también envía el token.

### P1 — Integridad de leads por tenant — corregido

El servidor ya no confía en el `tenant_id` enviado por el navegador. Exige que el vehículo exista y deriva el tenant desde la relación persistida vehículo-propietario.

### P2 — Contrato incompatible de actualización Coche Ideal — corregido

El `PUT /api/coche-ideal` exigía por error toda la estructura de una creación aunque el panel enviaba solo `{id, status}`. Ahora acepta únicamente ese contrato mínimo y una lista cerrada de estados.

### Infraestructura — TLS — corregido

Se abrió TCP 80 en el firewall `API_Vera` para la validación HTTP de Let’s Encrypt. Traefik fue reiniciado y el certificado público de `api.cochemotor.es` quedó emitido por Let’s Encrypt.

## Riesgos pendientes y actualización recomendada

1. **P1 — Clave única de asesor compartida.** Leads y Coche Ideal usan `X-Advisor-Key` global. Si se filtra, permite leer o modificar todos los tenants. Migrar a sesiones autenticadas, autorización por tenant y roles; rotar la clave después.
2. **P1 — Sin limitación de intentos.** Registro, login, verificación y formularios públicos no muestran rate limiting persistente. Añadir límites por IP e identidad y backoff para login.
3. **P1 — SQLite en un único volumen.** Adecuada para demo, no para alta concurrencia, backups auditables o recuperación operativa. Planificar PostgreSQL gestionado con backups cifrados, migraciones y pruebas de restauración.
4. **P2 — Cabeceras incompletas.** Añadir Content-Security-Policy compatible, `Permissions-Policy` y HSTS solo tras verificar todos los subdominios HTTPS.
5. **P2 — PII en respuestas de asesor.** Aplicar minimización, retención limitada, auditoría de accesos y exportación/borrado RGPD antes de datos reales.
6. **P2 — Backend acoplado a `main`.** El contenedor descarga la rama al arrancar. Fijar un commit o imagen versionada, validar checksum y ejecutar smoke tests antes de promover.

## Próximo orden recomendado

1. Sustituir la clave global por sesión + RBAC + aislamiento por tenant.
2. Añadir rate limiting y auditoría sin registrar secretos ni PII.
3. Añadir backup/restore probado y migración de persistencia cuando crezca el uso.
4. Activar despliegue automático solo con checks verdes, revisión y rollback.

No se ha ejecutado todavía una rotación de secretos, un cambio de base de datos ni una modificación adicional de infraestructura.
