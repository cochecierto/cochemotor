# Spec 015 — Gauntlet de calidad para cambios de desarrollo

## Contexto y objetivo

CocheMotor ya aplica Spec-Driven Development (SDD), con validación requisito por requisito y revisión desde responsabilidades separadas. Falta un procedimiento operativo uniforme que conecte la definición del cambio con una revisión adversarial independiente, la corrección de hallazgos y un dictamen de calidad basado en evidencia.

Esta iniciativa incorpora el método Gauntlet al flujo de desarrollo del repositorio local y su repositorio GitHub. Gauntlet complementará SDD y respetará sus puertas de aprobación; no sustituirá la aprobación de specs ni autorizará por sí mismo publicar, fusionar o desplegar cambios de producto.

## Usuarios / actores

- Responsable del proyecto: define y aprueba el alcance de iniciativas según el gobierno vigente.
- Coordinador/implementador: prepara el cambio, mantiene la trazabilidad y corrige hallazgos.
- Árbitro independiente: revisa adversarialmente la versión integrada final y sus evidencias; cuando haya subagente disponible, será un subagente distinto del implementador.
- Mantenedores del repositorio: aplican el flujo de GitHub y los controles ya configurados.

## Historias de usuario

- H1: Como responsable del proyecto quiero que los cambios relevantes tengan requisitos, comprobaciones y evidencias explícitas para decidir con información verificable.
- H2: Como mantenedor quiero que una revisión independiente encuentre defectos antes de dar por terminado un cambio.
- H3: Como implementador quiero un flujo proporcional al riesgo que no convierta cambios triviales en auditorías innecesarias.
- H4: Como equipo quiero que el informe deje claro qué se comprobó, qué falló, qué no se pudo comprobar y quién revisó.

## Requisitos funcionales (criterios de aceptación EARS)

- RF-1: CUANDO una iniciativa relevante de software, seguridad, datos, integración, permisos o despliegue comience, EL EQUIPO registrará objetivo, alcance incluido y excluido, restricciones, dependencias, riesgos, supuestos, comprobaciones, evidencia esperada y responsables, además de respetar la aprobación SDD aplicable.
- RF-2: CUANDO un cambio sea documental, de bajo riesgo y acotado, EL EQUIPO podrá usar una revisión reducida que registre alcance, comprobación pertinente, evidencia y resultado sin exigir rondas completas de arbitraje.
- RF-3: MIENTRAS se construya una iniciativa, EL IMPLEMENTADOR trabajará dentro del alcance aprobado, mantendrá trazabilidad con los requisitos y resolverá decisiones reversibles documentando supuestos; si surge una decisión material no aprobada, la elevará antes de continuar la parte dependiente.
- RF-4: CUANDO la iniciativa requiera arbitraje, EL COORDINADOR asignará la revisión a un subagente u otro revisor que no haya implementado el cambio cuando esté disponible; si no hay revisor independiente disponible, el informe identificará la revisión como propia y el dictamen no podrá ser `APROBADO`.
- RF-5: CUANDO se audite una versión, EL ÁRBITRO inspeccionará el diff y el resultado observable cuando sea posible, e informará cada hallazgo con identificador, gravedad, ubicación/evidencia, pasos de reproducción, resultado esperado y criterio de corrección.
- RF-6: CUANDO haya hallazgos corregibles, EL EQUIPO corregirá los incumplimientos y repetirá las comprobaciones afectadas y la revisión de la versión integrada, hasta un máximo predeterminado de tres rondas; cualquier excepción requerirá justificación y aprobación explícita.
- RF-7: CUANDO se emita el dictamen final, EL INFORME usará exactamente uno de estos estados: `APROBADO`, `REQUIERE_CAMBIOS` o `BLOQUEADO`, conforme a los criterios de aceptación de esta spec; “no comprobado” no contará como aprobado.
- RF-8: CUANDO concluya una iniciativa con Gauntlet completo, EL EQUIPO guardará un informe versionado en `docs/gauntlet/[nombre-de-tarea].md` o en el mecanismo de seguimiento aprobado, con resumen, versión revisada, matriz requisito-evidencia, comprobaciones ejecutadas/no ejecutadas, rondas, hallazgos, correcciones, riesgos residuales y dictamen.
- RF-9: EL DICTAMEN DE CALIDAD no autorizará por sí mismo merge, publicación ni despliegue; esas acciones seguirán requiriendo las autorizaciones y protecciones vigentes.
- RF-10: CUANDO una tarea se publique en GitHub, EL EQUIPO integrará los cambios mediante el flujo de ramas y revisión vigente, sin incluir cambios locales ajenos a esta iniciativa ni sobrescribir trabajo preexistente.

## Requisitos no funcionales

- El proceso será compatible con el SDD vigente y sus términos de salida; Gauntlet añadirá el dictamen de calidad sin reemplazar las puertas SDD.
- El proceso usará las comprobaciones existentes y pertinentes al riesgo. No requerirá instalar dependencias ni crear infraestructura nueva como condición del método.
- Los informes no incluirán secretos, PII innecesaria ni resultados de pruebas no ejecutadas.
- La integración será legible en el flujo local de Codex/equipo y en la documentación versionada del repositorio GitHub.

## Casos límite

- No hay revisor independiente disponible: revisión propia declarada; el estado no puede ser `APROBADO` y será `REQUIERE_CAMBIOS` o `BLOQUEADO` según corresponda.
- No existe interfaz o entorno desplegable para observar: documentar qué evidencia observable no estuvo disponible.
- Falla una comprobación previa ajena al cambio: registrarla como baseline previo y no atribuirla automáticamente a la iniciativa.
- Se alcanza el máximo de tres rondas con defectos abiertos: `REQUIERE_CAMBIOS` o `BLOQUEADO`, nunca `APROBADO`.
- Falta acceso, información o entorno imprescindible: `BLOQUEADO` y enumerar el bloqueo.
- Un cambio posterior al arbitraje altera áreas revisadas: repetir las comprobaciones afectadas y renovar el dictamen.
- El repositorio local tiene commits o archivos sin seguimiento ajenos al cambio: preservarlos y evitar incluirlos en la publicación remota.

## Fuera de alcance

- Cambiar el producto CocheMotor o sus funcionalidades de cara a usuarios.
- Modificar criterios de aprobación de negocio, seguridad, SDD, GitHub o despliegue existentes.
- Crear o alterar workflows de CI, protecciones de ramas, permisos, secretos o automatizaciones externas.
- Fusionar o desplegar cambios de producto por el mero hecho de obtener `APROBADO`.
- Exigir arbitraje independiente para cambios de bajo riesgo que usen el flujo reducido.

## Criterios de finalización

- La política de uso y el procedimiento Gauntlet están documentados y enlazados desde las instrucciones del repositorio.
- Los criterios diferencian el flujo completo del reducido, definen los estados finales y preservan las puertas SDD y de release.
- Hay una plantilla reutilizable de informe y un lugar documentado para guardarlo.
- Los informes exigen evidencia real, documentan pruebas no ejecutadas y permiten rastrear hallazgos y correcciones.
- La estrategia de GitHub evita incorporar el commit local previo no relacionado ni archivos sin seguimiento existentes.
- La revisión independiente está definida; la disponibilidad de subagente se resuelve por iniciativa y se declara si falta.

## Dudas abiertas

- Ninguna para preparar el plan. La dirección autorizó usar un subagente árbitro cuando esté disponible y publicar esta integración en GitHub. La integración remota se realizará tras aprobar esta spec y revisar la preparación Git de la rama.
