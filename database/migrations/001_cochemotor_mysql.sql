-- CocheMotor - esquema inicial para MySQL/MariaDB de Hostinger
-- Ejecutar una sola vez en la base elegida. No contiene credenciales.
CREATE TABLE IF NOT EXISTS dealerships (
  tenant_id VARCHAR(80) PRIMARY KEY,
  display_name VARCHAR(160) NOT NULL,
  dealer_slug VARCHAR(160) NOT NULL UNIQUE,
  phone_whatsapp VARCHAR(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS vehicles (
  vehicle_id VARCHAR(80) PRIMARY KEY,
  tenant_id VARCHAR(80) NOT NULL,
  brand VARCHAR(80) NOT NULL,
  model VARCHAR(120) NOT NULL,
  version VARCHAR(180) NOT NULL,
  year SMALLINT NOT NULL,
  mileage_km INT NOT NULL,
  cash_price DECIMAL(12,2) NOT NULL,
  dgt_badge VARCHAR(12) NOT NULL,
  stage VARCHAR(40) NOT NULL DEFAULT 'publicado',
  evidence_level VARCHAR(40) NOT NULL DEFAULT 'verificado_obd',
  status VARCHAR(40) NOT NULL DEFAULT 'disponible',
  public_slug VARCHAR(180) NOT NULL,
  metadata_json JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_vehicles_public (status, brand, model, year, cash_price),
  INDEX idx_vehicles_tenant (tenant_id),
  CONSTRAINT fk_vehicles_dealer FOREIGN KEY (tenant_id) REFERENCES dealerships(tenant_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS leads (
  lead_id VARCHAR(80) PRIMARY KEY,
  tenant_id VARCHAR(80) NOT NULL,
  vehicle_id VARCHAR(80) NOT NULL,
  buyer_name VARCHAR(120) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  payment_method VARCHAR(40) NULL,
  score SMALLINT NOT NULL DEFAULT 90,
  status VARCHAR(40) NOT NULL DEFAULT 'nuevo',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_leads_tenant_status (tenant_id, status, created_at),
  CONSTRAINT fk_leads_dealer FOREIGN KEY (tenant_id) REFERENCES dealerships(tenant_id) ON DELETE CASCADE,
  CONSTRAINT fk_leads_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS coche_ideal_requests (
  request_id VARCHAR(80) PRIMARY KEY,
  tenant_id VARCHAR(80) NOT NULL,
  fingerprint CHAR(64) NOT NULL,
  payload_json JSON NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'nueva',
  consent_version VARCHAR(40) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_coche_ideal_fingerprint (fingerprint),
  INDEX idx_coche_ideal_status (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS coche_ideal_status_history (
  history_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  request_id VARCHAR(80) NOT NULL,
  previous_status VARCHAR(50) NULL,
  new_status VARCHAR(50) NOT NULL,
  actor VARCHAR(80) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_coche_ideal_history (request_id, created_at),
  CONSTRAINT fk_coche_ideal_history_request FOREIGN KEY (request_id) REFERENCES coche_ideal_requests(request_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS ad_reports (
  report_id VARCHAR(80) PRIMARY KEY,
  listing_reference VARCHAR(160) NOT NULL,
  reason VARCHAR(80) NOT NULL,
  description TEXT NOT NULL,
  reporter_email VARCHAR(254) NULL,
  privacy_consent TINYINT(1) NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'nueva',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_ad_reports_status (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
