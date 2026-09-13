-- CocheMotor — autenticación y trazabilidad de publicación (MySQL/MariaDB)
-- Ejecutar después de 001 y 002.

CREATE TABLE IF NOT EXISTS professional_users (
    user_id VARCHAR(80) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    verification_token VARCHAR(255) NOT NULL UNIQUE,
    email_verified TINYINT(1) NOT NULL DEFAULT 0,
    phone VARCHAR(32) NULL,
    professional_type VARCHAR(80) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS professional_sessions (
    token VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(80) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_sessions_user_expiry (user_id, expires_at),
    CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES professional_users (user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS publication_contacts (
    contact_id VARCHAR(80) PRIMARY KEY,
    vehicle_id VARCHAR(80) NULL,
    user_id VARCHAR(80) NULL,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(254) NOT NULL,
    phone VARCHAR(32) NULL,
    whatsapp_opt_in TINYINT(1) NOT NULL DEFAULT 0,
    contact_verified TINYINT(1) NOT NULL DEFAULT 0,
    consent_version VARCHAR(40) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_publication_contacts_email (email),
    INDEX idx_publication_contacts_vehicle (vehicle_id),
    CONSTRAINT fk_publication_contact_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles (vehicle_id) ON DELETE SET NULL,
    CONSTRAINT fk_publication_contact_user FOREIGN KEY (user_id) REFERENCES professional_users (user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS vehicle_images (
    image_id VARCHAR(80) PRIMARY KEY,
    vehicle_id VARCHAR(80) NOT NULL,
    image_url VARCHAR(2048) NOT NULL,
    sort_order TINYINT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_vehicle_images_vehicle_order (vehicle_id, sort_order),
    CONSTRAINT fk_vehicle_images_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles (vehicle_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
