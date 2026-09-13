-- CocheMotor - búsquedas, favoritos, alertas y analítica
-- Requiere 001_cochemotor_mysql.sql
CREATE TABLE IF NOT EXISTS saved_searches (
  search_id VARCHAR(80) PRIMARY KEY,
  user_id VARCHAR(80) NULL,
  email VARCHAR(254) NULL,
  query_text VARCHAR(500) NULL,
  filters_json JSON NOT NULL,
  frequency VARCHAR(20) NOT NULL DEFAULT 'off',
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_saved_searches_user (user_id, status),
  INDEX idx_saved_searches_email (email, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS favorites (
  favorite_id VARCHAR(80) PRIMARY KEY,
  user_id VARCHAR(80) NULL,
  email VARCHAR(254) NULL,
  vehicle_id VARCHAR(80) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_favorite_user_vehicle (user_id, vehicle_id),
  UNIQUE KEY uq_favorite_email_vehicle (email, vehicle_id),
  INDEX idx_favorites_vehicle (vehicle_id),
  CONSTRAINT fk_favorites_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS alerts (
  alert_id VARCHAR(80) PRIMARY KEY,
  search_id VARCHAR(80) NOT NULL,
  channel VARCHAR(20) NOT NULL DEFAULT 'email',
  destination VARCHAR(254) NOT NULL,
  last_sent_at TIMESTAMP NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_alerts_due (status, last_sent_at),
  CONSTRAINT fk_alerts_search FOREIGN KEY (search_id) REFERENCES saved_searches(search_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS analytics_events (
  event_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  event_name VARCHAR(80) NOT NULL,
  session_id VARCHAR(100) NULL,
  user_id VARCHAR(80) NULL,
  vehicle_id VARCHAR(80) NULL,
  payload_json JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_events_name_date (event_name, created_at),
  INDEX idx_events_vehicle_date (vehicle_id, created_at),
  CONSTRAINT fk_events_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
