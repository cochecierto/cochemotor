# Plan técnico — Spec 005

## Decisiones y restricciones

- Implementar enlaces oficiales estáticos y accesibles desde ficha pública.
- Corregir lenguaje y valores predeterminados que afirman verificaciones DGT sin evidencia.
- Separar fecha de importación/generación y fecha declarada de los datos fuente en los metadatos del catálogo.
- No añadir dependencias, llamadas de red, formularios de matrícula ni datos descargados.

## Componentes y responsabilidades

- `ficha.html`: sección de comprobaciones oficiales, aviso de estado declarado/no verificado y enlaces DGT.
- `assets/data/vehicles_catalog.js`: metadatos de snapshot sin fecha dinámica engañosa.
- `scripts/import_vehicle_catalog.py`: conservar procedencia declarada de la fuente de entrada y no inferir la fecha del dato desde la fecha de ejecución.
- `docs/knowledge/DGT-DATA-REVIEW-2026-09-13.md`: registro de recursos, limitaciones y política de integración.

## Modelo de datos y contratos

Metadatos del catálogo: `sourceLabel`, `sourceUrl`, `sourceDataAsOf`, `license`, `generatedAt`, `provenanceStatus`. Campos de fuente desconocidos deben tener valor explícito `null`/`unknown`; `generatedAt` describe el artefacto, no la vigencia de los datos. `declared-not-verified` solo indica que se proporcionaron metadatos; no certifica su exactitud ni los derechos de uso.

## Seguridad, privacidad y reversión

- Los enlaces no incluyen placa, VIN, IDs de coche ni parámetros sensibles.
- Enlaces externos usarán `target="_blank"` con `rel="noopener noreferrer"`.
- El rollback consiste en revertir el bloque de enlaces/copy y metadatos; no hay migración de base de datos ni efecto externo.

## Trazabilidad

| Parte del plan | Requisitos |
|---|---|
| Ficha pública DGT | RF-1, RF-2, RF-3, RF-6 |
| Metadatos de catálogo/importador | RF-4 |
| Límites de integración | RF-5 |

## Estrategia de pruebas

- Pruebas estáticas para enlaces oficiales, seguridad de enlaces y ausencia de afirmaciones no acreditadas.
- Importar un CSV sintético con y sin metadatos y comprobar que fecha de generación no se confunde con fecha de fuente.
- Revisar a mano responsive, foco/labels y render de los estados con y sin campos opcionales.
