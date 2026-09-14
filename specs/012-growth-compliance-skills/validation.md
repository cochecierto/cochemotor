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
- [ ] Publicar cambios aprobados en `origin/main` y verificar CI.
- [x] Despliegue web no aplicable: no se modificaron archivos en el payload SFTP de Hostinger; no se lanzó un despliegue ajeno al alcance.
- [x] Aprobador: petición explícita de Juan, 2026-09-14.

## Veredicto

`GO` para los perfiles internos documentales. La evaluación de cumplimiento real de `cochemotor.es` queda pendiente de inventario técnico y revisión específica.
