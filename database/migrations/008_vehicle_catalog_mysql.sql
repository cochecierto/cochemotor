-- Catálogo canónico de vehículos. Las fuentes se conservan y nunca se sobrescriben.
CREATE TABLE IF NOT EXISTS vehicle_catalog_sources (
  source_id VARCHAR(80) PRIMARY KEY,
  source_label VARCHAR(160) NOT NULL,
  source_url VARCHAR(500) NOT NULL,
  licence VARCHAR(120) NOT NULL,
  data_as_of DATE NULL,
  imported_at DATETIME NOT NULL,
  checksum_sha256 CHAR(64) NOT NULL,
  provenance_status ENUM('declared','verified','revoked') NOT NULL DEFAULT 'declared'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS vehicle_catalog_entries (
  catalog_id CHAR(64) PRIMARY KEY,
  source_id VARCHAR(80) NOT NULL,
  source_record_id VARCHAR(180) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(160) NOT NULL,
  generation VARCHAR(160) NULL,
  variant VARCHAR(180) NULL,
  fuel_type VARCHAR(40) NOT NULL,
  body_style VARCHAR(80) NULL,
  year_from SMALLINT NULL,
  year_to SMALLINT NULL,
  power_kw DECIMAL(7,2) NULL,
  displacement_cc SMALLINT NULL,
  co2_g_km DECIMAL(7,2) NULL,
  consumption_wltp DECIMAL(7,3) NULL,
  raw_json JSON NOT NULL,
  first_seen_at DATETIME NOT NULL,
  last_seen_at DATETIME NOT NULL,
  UNIQUE KEY uq_catalog_source_record (source_id, source_record_id),
  KEY idx_catalog_lookup (brand, model, fuel_type),
  CONSTRAINT fk_catalog_source FOREIGN KEY (source_id) REFERENCES vehicle_catalog_sources(source_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
