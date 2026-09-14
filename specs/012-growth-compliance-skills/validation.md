# Validación — Spec 012

## Matriz requisito → evidencia

| Requisito | Test o evidencia | Resultado | Observaciones |
|---|---|---|---|
| RF-1 | `.agents/skills/cochemotor-seo/SKILL.md` | PASS | Auditoría priorizada y reproducible |
| RF-2 | `.agents/skills/cochemotor-seo/SKILL.md` | PASS | No promete posiciones ni cifras sin fuente |
| RF-3 | `.agents/skills/cochemotor-copy-automocion/SKILL.md` | PASS | Evidencia y revisión de claims añadidas |
| RF-4 | `.agents/skills/cochemotor-privacy-cookies/SKILL.md` | PASS | Fuentes UE/España enlazadas |
| RF-5 | Skill privacidad/cookies | PASS | Prohíbe inventar inventario/política |
| RF-6 | Skill privacidad/cookies | PASS | Detección previa y criterio de consentimiento |
| RF-7 | `.codex/vendor-lock.yaml` y referencia de evaluación | PASS | Fuentes, commits, alcance y rechazo/adaptación anotados; YAML revisado manualmente |
| RF-8 | `.agents/cochemotor-agents.json` y registry | PASS | JSON parseado; skills con rutas y handoffs registrados; YAML del registry revisado manualmente |

## Criterios de finalización

- [x] Todos los RF tienen evidencia.
- [x] JSON parseado; YAML y rutas estructurales revisados manualmente. No hay parser YAML preinstalado y no se añadieron dependencias solo para validar documentación.
- [x] Seguridad y privacidad revisadas; no se importaron dependencias.
- [x] Publicar cambios aprobados en `origin/main`: commit `6f6f6f2dcbf8eb2c6cf64554c3e9515149e98c10`.
- [x] GitHub Actions valida el commit: workflow run [34887101765](https://github.com/cochecierto/cochemotor/actions/runs/34887101765) con éxito.
- [ ] Despliegue Hostinger: el job SFTP automático quedó `skipped` porque solo acepta `workflow_dispatch`; la ejecución manual publicará la demo, acceso profesional y API. Requiere confirmación justo antes de activar desde la UI.
- [x] Aprobador: petición explícita de Juan, 2026-09-14.

## Veredicto

`GO CONDICIONADO` — los perfiles internos están publicados y validados; el despliegue manual Hostinger está pendiente de confirmación en UI. La evaluación real de cumplimiento de `cochemotor.es` requiere inventario técnico y revisión específica.
