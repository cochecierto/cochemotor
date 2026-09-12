# Modelo de Datos de Automoción — CocheMotor (España)

## 1. Entidad Vehículo (Stock)

Representa un coche en el inventario del compraventa o concesionario.

- `id`: Identificador único sintético / UUID.
- `tenant_id`: Identificador del concesionario o freelancer propietario.
- `vin` (Bastidor): Número de bastidor (17 caracteres alfanuméricos).
- `plate` (Matrícula): Matrícula española (ej. `1234-LMN`).
- `brand` (Marca): Ej. *Volkswagen, Toyota, BMW, Peugeot, Renault*.
- `model` (Modelo): Ej. *Golf, RAV4, Serie 3, 308, Megane*.
- `version` (Versión / Acabado): Ej. *2.0 TDI Advance 150 CV*.
- `year` (Año de primera matriculación): Entero (ej. `2019`).
- `mileage_km` (Kilómetros): Entero verificado (ej. `85000`).
- `fuel_type` (Combustible): `gasolina` | `diesel` | `hibrido` | `hibrido_enchufable` | `electrico` | `glp_gnc`.
- `gearbox` (Transmisión): `manual` | `automatico`.
- `power_cv` (Potencia): Caballos de vapor (CV).
- `dgt_badge` (Distintivo Ambiental DGT): `0_emisiones` | `eco` | `c` | `b` | `sin_distintivo`.
- `body_type` (Carrocería): `suv` | `compacto` | `berlina` | `familiar` | `monovolumen` | `coupe_cabrio` | `furgoneta`.
- `itv_status` (Estado ITV): Vigente con fecha de vencimiento.
- `warranty_months` (Garantía): Meses incluidos (mínimo 12 meses por ley en venta profesional).
- `cash_price` (Precio al contado): Decimal en Euros (€).
- `financed_price` (Precio financiado): Decimal opcional en Euros (€).
- `status` (Estado comercial): `disponible` | `reservado` | `en_preparacion` | `vendido` | `baja`.
- `public_slug`: Slug para la URL de la ficha pública compartible.
- `created_at` / `updated_at`: Marcas temporales.

## 2. Entidad Demanda de Comprador (Buyer Demand)

Representa los criterios de búsqueda de un cliente potencial.

- `id`: UUID.
- `tenant_id`: Identificador del concesionario.
- `lead_id`: Referencia al contacto.
- `budget_max`: Presupuesto máximo en Euros (€).
- `preferred_body_types`: Lista de carrocerías deseadas (`suv`, `compacto`, etc.).
- `preferred_fuel`: Lista de combustibles aceptados.
- `required_dgt_badge`: Mínimo distintivo ambiental DGT requerido (clave para ZBE en Madrid, Barcelona, etc.).
- `max_mileage_km`: Kilometraje máximo tolerable.
- `has_car_to_exchange`: Booleano (si entrega coche a cambio).
- `requires_financing`: Booleano (si necesita financiar la compra).
- `urgency`: `inmediata` | `este_mes` | `explorando`.

## 3. Entidad Expediente de Operación (Deal CaseFile)

Gestiona el ciclo de vida de una venta o tasación de compra.

- `case_id`: Identificador único de expediente (ej. `EXP-VO-2026-001`).
- `tenant_id`: Concesionario o profesional responsable.
- `vehicle_id`: Vehículo involucrado.
- `lead_id`: Cliente comprador o vendedor.
- `status`:
  - `intake`: Entrada del lead o coche.
  - `contacted`: Primer contacto realizado (prioridad WhatsApp).
  - `viewing_scheduled`: Prueba dinámica o visita programada en campa.
  - `reservation`: Señal o reserva entregada.
  - `dgt_check`: Verificación de informe de cargas DGT (sin embargos ni reservas de dominio).
  - `contract_signed`: Contrato de compraventa firmado.
  - `warranty_activated`: Póliza de garantía de 1 año emitida.
  - `transferred`: Notificación de venta y transferencia telemática DGT confirmada.
  - `closed`: Operación entregada y cerrada.
