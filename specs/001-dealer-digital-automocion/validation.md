# Validación de Requisitos — Spec 001 Dealer Digital Automoción

Matriz de comprobación formal requisito por requisito:

| ID Requisito | Descripción EARS | Estado | Evidencia de Validación |
|---|---|:---:|---|
| **RF-001** | Resolución de concesionario autorizado y tenant_id antes de consultar stock. | PASS | Test `test_resolve_dealership_and_tenant` verificado en `test_automotive_domain.py`. |
| **RF-002** | Bloqueo ante tenant o expediente no unívoco. | PASS | Test `test_unauthorized_or_ambiguous_tenant_blocked` verificado. |
| **RF-003** | Registro de vehículo en stock con atributos DGT, km, año y precio. | PASS | Test `test_register_vehicle_with_dgt_badge` verificado. |
| **RF-004** | Matching automático de demandas con stock compatible. | PASS | Test `test_matching_demand_with_vehicle_stock` verificado. |
| **RF-005** | Aislamiento multi-tenant estricto entre concesionarios. | PASS | Test `test_strict_multi_tenant_vehicle_isolation` verificado (Tenant A no accede a Tenant B). |
| **RF-006** | Bloqueo de acciones externas no autorizadas. | PASS | Verificado en orquestador de expedientes. |
| **RF-007** | Ficha pública del vehículo con enlace formateado a WhatsApp. | PASS | Test `test_generate_public_whatsapp_link` verificado. |
| **RF-008** | Protección de datos sensibles y PII. | PASS | Filtro de datos y anonimización de pruebas verificado. |
| **RF-009** | Checklist de trámites legales en España (DGT, contrato, garantía 1 año). | PASS | Test `test_case_file_spanish_legal_milestones` verificado. |
| **RF-010** | Operación 100% con datos sintéticos españoles en pruebas. | PASS | Verificado con suite `test_automotive_domain.py`. |
