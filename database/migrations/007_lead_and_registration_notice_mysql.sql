-- CocheMotor — trazabilidad mínima de aviso de privacidad y solicitudes de contacto.
-- Ejecutar una vez después de 006; comprobar cada cambio antes de desplegar api/index.php.

ALTER TABLE professional_users
  ADD COLUMN privacy_notice_version VARCHAR(40) NULL AFTER email_verified,
  ADD COLUMN terms_version VARCHAR(40) NULL AFTER privacy_notice_version,
  ADD COLUMN notice_acknowledged_at DATETIME NULL AFTER terms_version;

ALTER TABLE leads
  ADD COLUMN contact_requested_at DATETIME NULL AFTER phone,
  ADD COLUMN privacy_notice_version VARCHAR(40) NULL AFTER contact_requested_at,
  ADD INDEX idx_leads_vehicle_phone_created (vehicle_id, phone, created_at);

ALTER TABLE vehicles
  MODIFY COLUMN evidence_level VARCHAR(40) NOT NULL DEFAULT 'declarado';
