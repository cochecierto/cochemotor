# Tareas — Spec 001 Dealer Digital Automoción

- [x] T1. Registrar especificación funcional en notación EARS y clarificación aprobada.
  (RF: RF-001..RF-010) Hecho cuando: `spec.md` y `clarification.md` están aprobados y no presentan ambigüedades.
- [x] T2. Implementar modelo de dominio de automoción (`Dealership`, `Vehicle`, `BuyerDemand`, `CaseFile`) con aislamiento multi-tenant.
  (RF: RF-001, RF-002, RF-003, RF-010) Hecho cuando: las pruebas unitarias de creación de concesionario, stock y aislamiento pasan al 100%.
- [x] T3. Implementar motor de matching básico de vehículos según demanda de comprador y distintivo DGT.
  (RF: RF-004) Hecho cuando: las pruebas devuelven vehículos compatibles en stock y filtran los no coincidentes.
- [x] T4. Implementar generación de URL y ficha pública para WhatsApp con mensaje pre-rellenado.
  (RF: RF-007) Hecho cuando: se valida el formateo de ficha y el enlace `wa.me` correspondiente.
- [x] T5. Implementar checklist de trámites legales de venta en España (DGT, contrato, garantía 1 año).
  (RF: RF-009) Hecho cuando: el expediente no puede cerrarse sin completar los hitos legales de la venta.
- [ ] T6. Exponer API local y servidor web ligero para la UI del concesionario demo.
  (RF: RF-001..RF-010) Hecho cuando: las operaciones de stock y expedientes pueden recorrerse desde el navegador local.
