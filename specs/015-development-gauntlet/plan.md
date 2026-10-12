# Plan técnico — Spec 015

## Decisiones y restricciones

- Mantener SDD como flujo rector y añadir Gauntlet como puerta transversal de evidencia y revisión adversarial.
- Definir flujo completo para cambios relevantes y flujo reducido para cambios de bajo riesgo y alcance acotado.
- Máximo de tres rondas por defecto. El informe final distinguirá `APROBADO`, `REQUIERE_CAMBIOS` y `BLOQUEADO`.
- Para arbitrajes completos, usar un subagente independiente cuando esté disponible; declarar revisión propia si no lo está.
- No añadir dependencias, código de producto, CI, protecciones GitHub ni automatizaciones externas.
- Publicar únicamente los archivos de esta iniciativa en una rama basada en `origin/main`; abrir PR para revisión. No fusionar ni desplegar a producción.

## Componentes y responsabilidades

- `AGENTS.md`: regla breve de activación, enlace al procedimiento y relación con SDD.
- `docs/governance/gauntlet.md`: procedimiento, alcance, roles, rondas y criterios de dictamen.
- `docs/gauntlet/README.md`: ubicación y convención de los informes.
- `docs/gauntlet/_template.md`: plantilla de informe reutilizable.
- `docs/00-INDEX.md` y `specs/README.md`: enlaces de navegación.
- `specs/015-development-gauntlet/`: spec, clarificación, plan, tareas y matriz de validación.

## Modelo de datos y contratos

No aplica. El resultado operativo es documentación versionada; no se crean datos de usuarios ni servicios.

## Seguridad, privacidad y reversión

- No incluir secretos, PII ni datos operativos privados en los informes.
- No modificar archivos ajenos a la iniciativa ni incluir cambios previos del árbol local en el push.
- La reversión consiste en revertir el commit de documentación mediante el flujo Git vigente; no requiere migraciones ni cambios en producción.
- El push se limita a una rama de trabajo y PR. La integración no debe llegar a `main` sin revisión/aprobación del PR.

## Decisiones técnicas

| Decisión | Motivo | Alternativa descartada |
|---|---|---|
| Documentar procedimiento en `docs/governance/gauntlet.md` | Mantener política reusable fuera de instrucciones breves | Duplicar el prompt completo en `AGENTS.md` |
| Guardar informes en `docs/gauntlet/` | Facilitar trazabilidad versionada junto al código | Guardar informes sueltos en la raíz |
| Publicar en rama y PR | No incluir el commit local previo ni activar el auto-deploy de `main` | Empujar directamente a `main` |

## Trazabilidad hacia requisitos

| Parte del plan | RF cubiertos |
|---|---|
| Política y procedimiento | RF-1–RF-7, RF-9 |
| Plantilla y ubicación de informes | RF-8 |
| Flujo GitHub | RF-10 |

## Estrategia de pruebas

- Revisar enlaces, coherencia entre reglas, procedimiento, plantilla y requisitos.
- Inspeccionar el diff y ejecutar `git diff --check`.
- No ejecutar suites de producto: no hay código de producto afectado.
- Solicitar arbitraje adversarial independiente del diff final mediante subagente si está disponible.
- Abrir PR en GitHub y registrar URL/commit; no fusionar ni desplegar.
