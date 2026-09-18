-- CocheMotor — entrega y verificación segura de correo profesional
ALTER TABLE professional_users
    MODIFY verification_token VARCHAR(255) NULL,
    ADD COLUMN verification_token_hash CHAR(64) NULL AFTER verification_token,
    ADD COLUMN verification_expires_at DATETIME NULL AFTER verification_token_hash,
    ADD COLUMN verification_used_at DATETIME NULL AFTER verification_expires_at,
    ADD COLUMN email_status VARCHAR(24) NOT NULL DEFAULT 'pending' AFTER verification_used_at,
    ADD COLUMN email_last_sent_at DATETIME NULL AFTER email_status,
    ADD COLUMN email_send_attempts SMALLINT UNSIGNED NOT NULL DEFAULT 0 AFTER email_last_sent_at;
CREATE INDEX idx_professional_email_status ON professional_users (email_status, email_last_sent_at);
CREATE INDEX idx_professional_verification ON professional_users (verification_token_hash, verification_expires_at);
