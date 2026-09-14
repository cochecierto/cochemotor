-- CocheMotor — verificación del contacto y auditoría de moderación.
-- Ejecutar una sola vez después de 004_public_seo_profiles_mysql.sql.
-- No promueve registros existentes: los anuncios siguen en su estado actual.

ALTER TABLE publication_contacts
  ADD COLUMN contact_verified_at DATETIME NULL AFTER contact_verified;

CREATE TABLE IF NOT EXISTS vehicle_moderation_history (
  history_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  vehicle_id VARCHAR(80) NOT NULL,
  actor VARCHAR(80) NOT NULL,
  decision VARCHAR(20) NOT NULL,
  previous_stage VARCHAR(40) NOT NULL,
  new_stage VARCHAR(40) NOT NULL,
  previous_status VARCHAR(40) NOT NULL,
  new_status VARCHAR(40) NOT NULL,
  note VARCHAR(500) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_vehicle_moderation_history (vehicle_id, created_at),
  CONSTRAINT fk_vehicle_moderation_history_vehicle
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
