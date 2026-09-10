# Plan Técnico — Spec 001 Dealer Digital Automoción

## Arquitectura del Módulo Local
El núcleo del dominio automotriz se implementa en Python nativo bajo `local-broker/broker_core/` (o paquete de dominio automotriz), sin dependencias de terceros para garantizar portabilidad y cumplimiento de los criterios de calidad de `mouredev/hello-sdd`.

## Entidades Principales
1. `Dealership`: Concesionario o profesional independiente con `tenant_id`, `name`, `tax_id` (CIF/NIF) y provincia.
2. `Vehicle`: Coche en stock con especificaciones (marca, modelo, versión, año, km, precio, distintivo DGT B/C/ECO/0, estado).
3. `BuyerDemand`: Solicitud de comprador con presupuesto máximo, combustible y distintivo DGT deseado.
4. `CaseFile`: Expediente de operación con estados: `intake` $\to$ `contacted` $\to$ `viewing` $\to$ `dgt_check` $\to$ `contract_signed` $\to$ `warranty_issued` $\to$ `closed`.

## Estrategia de Pruebas
- Pruebas unitarias nativas con `unittest`.
- Verificación estricta de no mezcla de datos (*multi-tenant isolation*):
  - Intentar consultar o modificar vehículos de un tenant B desde la sesión del tenant A debe arrojar un error de acceso no autorizado.
- Algoritmo de matching de vehículos con demandas por presupuesto y etiqueta ambiental.
- Verificación del checklist de trámites legales en España.
