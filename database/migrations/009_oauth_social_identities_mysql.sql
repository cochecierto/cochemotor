-- CocheMotor — soporte de identidades OAuth y acceso social (MySQL/MariaDB)
-- Ejecutar despues de 003-008.

-- Permitir contrasenas opcionales para usuarios registrados exclusivamente mediante OAuth
ALTER TABLE professional_users MODIFY password_hash VARCHAR(255) NULL;

-- Tabla de identidades federadas de proveedores OAuth (Google, Apple, Facebook)
CREATE TABLE IF NOT EXISTS oauth_identities (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(80) NOT NULL,
    provider VARCHAR(32) NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    email VARCHAR(254) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_provider_uid (provider, provider_user_id),
    INDEX idx_oauth_user (user_id),
    CONSTRAINT fk_oauth_user FOREIGN KEY (user_id) REFERENCES professional_users (user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
