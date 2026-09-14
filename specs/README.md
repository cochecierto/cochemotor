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

- [Spec 004 — Coche Ideal: búsqueda por necesidad y categorías](004-coche-ideal/spec.md)
- [Spec 005 — Referencias DGT y trazabilidad del catálogo](005-dgt-reference-and-catalogue/spec.md)
- [Spec 006 — Publicación guiada de fotografías del vehículo](006-guided-vehicle-photo-publishing/spec.md)
- [Spec 007 — Conversión profesional y monetización](007-professional-conversion-monetization/spec.md)
- [Spec 008 — Demo interactiva del espacio profesional](008-professional-saas-demo/spec.md)
- [Spec 009 — Páginas públicas indexables y base SEO](009-public-seo-foundation/spec.md)
