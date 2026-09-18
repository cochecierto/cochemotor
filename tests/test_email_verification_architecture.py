from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
API = (ROOT / "api" / "index.php").read_text(encoding="utf-8")
UI = (ROOT / "acceso.html").read_text(encoding="utf-8")
MIGRATION = (ROOT / "database" / "migrations" / "004_email_verification_delivery_mysql.sql").read_text(encoding="utf-8")

def test_secure_delivery_contract():
    assert "COCHEMOTOR_MAIL_HOST" in API and "stream_socket_client" in API
    assert "@mail(" not in API
    for marker in ("verification_token_hash", "verification_used_at", "email_status", "email_send_attempts"):
        assert marker in API and marker in MIGRATION
    assert "send_failed" in API and "resend_verification" in API
    assert "verification_used_at IS NULL" in API
    assert "verification_expires_at>UTC_TIMESTAMP()" not in API

def test_access_offers_resend():
    assert "resend_verification" in UI
    assert "Reenviar correo de verificación" in UI
    assert "register-password-confirm" in UI
    assert "Las contraseñas no coinciden" in UI
    assert "auth-password-toggle" in UI
