# Especificaciones de iniciativas

Esta carpeta contiene las especificaciones funcionales y técnicas de
iniciativas concretas de Inmobia360 LATAM siguiendo la metodología SDD.

## Estructura

Cada iniciativa usa el siguiente formato:

```text
specs/NNN-nombre/
├── spec.md
├── clarification.md
├── plan.md
├── tasks.md
└── validation.md
```

`NNN` es un número secuencial de tres dígitos. La spec aprobada define el
alcance funcional; el plan define cómo; las tareas ordenan la ejecución y la
validación aporta evidencia requisito por requisito.

## Reglas

- No se programa antes de aprobar la spec y superar la clarificación.
- No se incluyen datos personales reales.
- No se cambia el alcance aprobado sin actualizar primero la spec y registrar
  la decisión correspondiente.
- Las plantillas están en `specs/_template/`.

## CocheMotor

- [Spec 005 — Referencias DGT y trazabilidad del catálogo](005-dgt-reference-and-catalogue/spec.md)
