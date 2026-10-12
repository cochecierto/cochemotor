# Gauntlet de calidad para cambios de desarrollo

Estado: procedimiento aprobado por Spec 015.

## Propósito y relación con SDD

Gauntlet conecta los requisitos aprobados con comprobaciones observables, revisión adversarial independiente, correcciones y un dictamen final con evidencia. Complementa el flujo de `docs/governance/sdd-methodology.md`; no sustituye la aprobación de la spec, el plan, las tareas, la validación EARS ni la aprobación humana de releases.

## Cuándo aplicarlo

Usar el flujo completo en cambios relevantes de producto, seguridad, datos, integraciones, permisos, APIs, automatizaciones o despliegue, y cuando el riesgo de regresión lo justifique.

Usar el flujo reducido en cambios documentales, refactors mecánicos o correcciones pequeñas, acotadas y de bajo riesgo. Registrar el alcance, la comprobación pertinente, la evidencia y el resultado. Si durante el trabajo aparece riesgo sustancial, ampliar al flujo completo.

## A. Preparación

1. Leer `AGENTS.md`, SDD, estado actual, decisiones, riesgos, spec activa, documentación y checks existentes.
2. Reformular objetivo, usuarios y flujo afectado; registrar alcance incluido/excluido, requisitos obligatorios, restricciones y dependencias.
3. Revisar `git status`, rama y diff inicial. Registrar fallos previos relevantes para no atribuirlos al cambio.
4. Preparar una matriz breve con requisito, comprobación, evidencia esperada y responsable.
5. Marcar hipótesis y decisiones reversibles como supuestos. Resolverlas con criterio. Detener solo el trabajo dependiente si falta una aclaración que cambie materialmente el alcance o exija una decisión no aprobada.
6. Si se usan varios agentes, asignar tareas, interfaces y archivos sin escrituras simultáneas. Designar un integrador y mantener al árbitro fuera de la implementación.

## B. Construcción

1. Implementar el alcance aprobado siguiendo las convenciones existentes y las tareas SDD.
2. Mantener la trazabilidad requisito–cambio–comprobación. No inventar datos, resultados, integraciones o capacidades.
3. Registrar decisiones asumidas y cambios de alcance; ante cambios materiales, actualizar la spec y obtener aprobación antes de continuar el trabajo dependiente.

## C. Comprobación y arbitraje

1. Ejecutar las verificaciones existentes pertinentes y las necesarias por riesgo. No ejecutar controles irrelevantes para completar una lista.
2. Pedir a un revisor que no haya implementado el cambio que inspeccione adversarialmente el diff y el resultado observable cuando sea posible. Usar un subagente árbitro cuando esté disponible.
3. Si no hay revisor independiente disponible, etiquetar la revisión como propia. El dictamen no puede ser `APROBADO`; usar `REQUIERE_CAMBIOS` si falta una condición corregible o `BLOQUEADO` si la revisión independiente no puede completarse por falta de acceso, entorno, información o autorización.
4. Buscar defectos, regresiones, incumplimientos, errores de integración, problemas de permisos, accesibilidad, seguridad y datos cuando sean pertinentes.
5. Cada hallazgo debe incluir ID, gravedad, ubicación o evidencia, pasos para reproducir, resultado esperado y criterio de corrección. No inventar ni forzar hallazgos cosméticos.
6. Adaptar la evidencia al cambio: interfaz (flujo principal, estados vacíos/error, responsive y accesibilidad afectados); API (entradas, permisos y contratos); datos/cálculos (exactitud y trazabilidad); automatización (idempotencia, errores y reintentos); contenido (fuentes y afirmaciones verificables).

## D. Corrección y repetición

1. Corregir hallazgos que incumplan requisitos o afecten funcionamiento, seguridad, calidad o experiencia.
2. Repetir las comprobaciones afectadas y revisar de nuevo la versión integrada, incluidas las interfaces entre componentes.
3. Usar como máximo tres rondas por defecto. Una ronda revisa una versión y comprueba sus correcciones. Una excepción requiere justificación y aprobación explícita.
4. Si quedan defectos abiertos al llegar al límite, informar el bloqueo y pendientes; no declarar aprobado.
5. Cualquier cambio posterior al arbitraje exige renovar el dictamen y las comprobaciones de las áreas afectadas.

## Dictamen de aceptación

Emitir `APROBADO` solo cuando todos estos criterios tengan evidencia:

- Todos los requisitos obligatorios tienen comprobación y evidencia suficiente.
- Los checks obligatorios del proyecto y los pertinentes al cambio pasan, o la excepción está identificada y expresamente autorizada.
- No quedan defectos críticos o altos abiertos ni incumplimientos obligatorios.
- La integración funciona en las partes afectadas y no hay regresiones conocidas sin resolver.
- El árbitro independiente revisó la versión final. Sin arbitraje independiente, no se permite `APROBADO`.
- Riesgos residuales, limitaciones y áreas no comprobadas están declarados.

Estados permitidos:

- `APROBADO`: se cumplen todos los criterios con evidencia.
- `REQUIERE_CAMBIOS`: existen defectos corregibles o requisitos incumplidos.
- `BLOQUEADO`: falta acceso, información, entorno o autorización necesaria para completar o comprobar el trabajo.

“No comprobado” no significa “correcto”. No rebajar criterios para aprobar ni ocultar verificaciones fallidas.

El dictamen de calidad no autoriza por sí mismo merge, publicación ni despliegue. Seguir `docs/governance/git-release-policy.md` y las autorizaciones vigentes.

## Informe

Para el flujo completo, guardar el informe en `docs/gauntlet/[nombre-de-tarea].md` usando `docs/gauntlet/_template.md` o el mecanismo de seguimiento aprobado. Incluir resumen, rama/PR/commit evaluado, matriz de requisitos y evidencia, verificaciones ejecutadas/no ejecutadas, rondas, hallazgos y correcciones, riesgos residuales, supuestos y dictamen. No incluir secretos ni PII innecesaria.

Para el flujo reducido, registrar alcance, comprobación, evidencia y resultado en el PR, commit o informe correspondiente.
