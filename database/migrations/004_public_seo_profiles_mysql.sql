-- CocheMotor — consentimiento explícito para perfiles profesionales públicos.
-- Ejecutar una sola vez tras 003. La migración no publica perfiles existentes.
ALTER TABLE dealerships
  ADD COLUMN public_description TEXT NULL AFTER display_name,
  ADD COLUMN public_profile TINYINT(1) NOT NULL DEFAULT 0 AFTER public_description,
  ADD COLUMN public_profile_consent_version VARCHAR(40) NULL AFTER public_profile,
  ADD COLUMN public_profile_consent_at DATETIME NULL AFTER public_profile_consent_version;

CREATE INDEX idx_dealerships_public_profile
  ON dealerships (public_profile, dealer_slug);
