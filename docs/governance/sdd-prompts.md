# Prompts operativos SDD — CocheMotor

Plantillas adaptadas de `mouredev/hello-sdd`. Son guías de trabajo, no sustituyen decisiones aprobadas.

## Constitución

Define objetivo, usuarios, mercado, restricciones, riesgos, datos permitidos y criterios de éxito. Separa hechos, hipótesis y decisiones pendientes.

## Spec

Escribe el contrato funcional sin stack ni nombres de archivos: historias, RF numerados en EARS, casos límite, fuera de alcance y dudas abiertas.

## Clarificación

Revisa ambigüedades, contradicciones, huecos, privacidad, multi-tenant, errores y criterios no verificables. No implementes mientras queden dudas críticas.

## Plan

Describe arquitectura, modelo de datos, contratos, seguridad, alternativas descartadas y estrategia de pruebas. Vincula cada RF con una decisión técnica.

## Tareas

Divide el plan en tareas pequeñas, ordenadas y verificables. Cada tarea incluye RF cubiertos y `Hecho cuando:`.

## Implementación

Trabaja una tarea cada vez, con pruebas primero cuando aplique. No amplíes alcance ni ocultes fallos.

## Validación

Recorre cada RF con evidencia de prueba, revisión visual, accesibilidad, seguridad, rendimiento y regresión. Emite `GO`, `GO CONDICIONADO`, `NO-GO` o `INFORMACIÓN INSUFICIENTE`.

## Cambio

Si cambia el alcance, actualiza primero la spec, documenta el impacto y espera aprobación antes de modificar plan, tareas o código.