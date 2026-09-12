"""Autenticación local de demostración para CocheMotor.

Diseñada para validar el flujo sin credenciales reales ni servicios externos.
"""

from __future__ import annotations

import hashlib
import hmac
import secrets
import sqlite3
from datetime import datetime, timedelta, timezone
from typing import Any


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _hash_password(password: str, salt: bytes | None = None) -> str:
    salt = salt or secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 210_000)
    return f"pbkdf2_sha256$210000${salt.hex()}${digest.hex()}"


def _check_password(password: str, encoded: str) -> bool:
    try:
        algorithm, rounds, salt_hex, digest_hex = encoded.split("$", 3)
        if algorithm != "pbkdf2_sha256":
            return False
        candidate = hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt_hex), int(rounds))
        return hmac.compare_digest(candidate.hex(), digest_hex)
    except (ValueError, TypeError):
        return False


def init_auth_schema(conn: sqlite3.Connection) -> None:
    conn.executescript("""
    CREATE TABLE IF NOT EXISTS professional_users (
        user_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        verification_token TEXT NOT NULL UNIQUE,
        email_verified INTEGER NOT NULL DEFAULT 0,
        phone TEXT,
        professional_type TEXT,
        created_at TEXT NOT NULL
    );
    """)
    conn.commit()


def register_user(conn: sqlite3.Connection, name: str, email: str, password: str) -> dict[str, Any]:
    if len(name.strip()) < 2 or "@" not in email or len(password) < 10:
        raise ValueError("Nombre, correo o contraseña no válidos")
    email = email.strip().lower()
    user_id = "usr-" + secrets.token_hex(8)
    token = secrets.token_urlsafe(32)
    try:
        conn.execute("INSERT INTO professional_users (user_id, name, email, password_hash, verification_token, created_at) VALUES (?, ?, ?, ?, ?, ?)", (user_id, name.strip(), email, _hash_password(password), token, _now().isoformat()))
        conn.commit()
    except sqlite3.IntegrityError as exc:
        raise ValueError("Ya existe una cuenta con ese correo") from exc
    return {"user_id": user_id, "name": name.strip(), "email": email, "verified": False, "verification_token": token}


def verify_user(conn: sqlite3.Connection, token: str) -> bool:
    if not token or len(token) < 20:
        return False
    cur = conn.execute("UPDATE professional_users SET email_verified = 1, verification_token = '' WHERE verification_token = ?", (token,))
    conn.commit()
    return cur.rowcount == 1


def authenticate_user(conn: sqlite3.Connection, email: str, password: str) -> dict[str, Any]:
    row = conn.execute("SELECT user_id, name, email, password_hash, email_verified, phone, professional_type FROM professional_users WHERE email = ?", (email.strip().lower(),)).fetchone()
    if not row or not _check_password(password, row["password_hash"]):
        raise ValueError("Correo o contraseña incorrectos")
    return {"user_id": row["user_id"], "name": row["name"], "email": row["email"], "verified": bool(row["email_verified"]), "phone": row["phone"], "professional_type": row["professional_type"]}


def update_profile(conn: sqlite3.Connection, user_id: str, phone: str, professional_type: str) -> bool:
    if len(phone.strip()) < 9 or not professional_type.strip():
        raise ValueError("Teléfono o tipo de profesional no válidos")
    cur = conn.execute("UPDATE professional_users SET phone = ?, professional_type = ? WHERE user_id = ?", (phone.strip(), professional_type.strip(), user_id))
    conn.commit()
    return cur.rowcount == 1
