"""Repositorio de persistencia SQLite nativa para CocheMotor (Spec 003 / Opción C)."""

from __future__ import annotations

import json
import sqlite3
from dataclasses import asdict
from pathlib import Path
from typing import Any

DB_FILE = Path(__file__).parent / "cochemotor.db"


def get_connection(db_path: Path = DB_FILE) -> sqlite3.Connection:
    """Crea la conexión a la base de datos SQLite con modo WAL y foreign keys."""
    conn = sqlite3.connect(str(db_path))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn


def init_db(db_path: Path = DB_FILE) -> None:
    """Inicializa el esquema multi-tenant relacional en SQLite."""
    conn = get_connection(db_path)
    try:
        conn.executescript("""
        CREATE TABLE IF NOT EXISTS dealerships (
            tenant_id TEXT PRIMARY KEY,
            display_name TEXT NOT NULL,
            dealer_slug TEXT NOT NULL UNIQUE,
            phone_whatsapp TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS vehicles (
            vehicle_id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            brand TEXT NOT NULL,
            model TEXT NOT NULL,
            version TEXT NOT NULL,
            year INTEGER NOT NULL,
            mileage_km INTEGER NOT NULL,
            cash_price REAL NOT NULL,
            dgt_badge TEXT NOT NULL,
            stage TEXT NOT NULL DEFAULT 'publicado',
            evidence_level TEXT NOT NULL DEFAULT 'verificado_obd',
            status TEXT NOT NULL DEFAULT 'disponible',
            public_slug TEXT NOT NULL,
            metadata_json TEXT,
            FOREIGN KEY (tenant_id) REFERENCES dealerships (tenant_id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS leads (
            lead_id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            vehicle_id TEXT NOT NULL,
            buyer_name TEXT NOT NULL,
            phone TEXT NOT NULL,
            payment_method TEXT,
            score INTEGER DEFAULT 90,
            status TEXT DEFAULT 'nuevo',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (tenant_id) REFERENCES dealerships (tenant_id) ON DELETE CASCADE,
            FOREIGN KEY (vehicle_id) REFERENCES vehicles (vehicle_id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS deal_rooms (
            deal_id TEXT PRIMARY KEY,
            token TEXT NOT NULL UNIQUE,
            tenant_id TEXT NOT NULL,
            vehicle_id TEXT NOT NULL,
            buyer_name TEXT NOT NULL,
            buyer_phone TEXT NOT NULL,
            agreed_price REAL NOT NULL,
            deposit_amount REAL NOT NULL,
            deposit_status TEXT,
            status TEXT DEFAULT 'contrato_preparado',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (tenant_id) REFERENCES dealerships (tenant_id) ON DELETE CASCADE,
            FOREIGN KEY (vehicle_id) REFERENCES vehicles (vehicle_id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS coche_ideal_requests (
            request_id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            fingerprint TEXT NOT NULL,
            payload_json TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'nueva',
            consent_version TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS coche_ideal_status_history (
            history_id INTEGER PRIMARY KEY AUTOINCREMENT,
            request_id TEXT NOT NULL,
            previous_status TEXT,
            new_status TEXT NOT NULL,
            actor TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS warranty_cases (
            case_id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            vehicle_id TEXT NOT NULL,
            buyer_name TEXT NOT NULL,
            issue_description TEXT NOT NULL,
            issue_type TEXT NOT NULL,
            assigned_workshop TEXT NOT NULL,
            status TEXT DEFAULT 'abierta',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (tenant_id) REFERENCES dealerships (tenant_id) ON DELETE CASCADE,
            FOREIGN KEY (vehicle_id) REFERENCES vehicles (vehicle_id) ON DELETE CASCADE
        );
        CREATE TABLE IF NOT EXISTS ad_reports (
            report_id TEXT PRIMARY KEY,
            listing_reference TEXT NOT NULL,
            reason TEXT NOT NULL,
            description TEXT NOT NULL,
            reporter_email TEXT,
            privacy_consent INTEGER NOT NULL,
            status TEXT NOT NULL DEFAULT 'nueva',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)
        conn.commit()
    finally:
        conn.close()


def save_dealership(conn: sqlite3.Connection, tenant_id: str, display_name: str, dealer_slug: str, phone: str) -> None:
    conn.execute(
        """
        INSERT OR REPLACE INTO dealerships (tenant_id, display_name, dealer_slug, phone_whatsapp)
        VALUES (?, ?, ?, ?)
        """,
        (tenant_id, display_name, dealer_slug, phone),
    )


def save_ad_report(conn: sqlite3.Connection, report: dict[str, Any]) -> str:
    conn.execute("INSERT INTO ad_reports (report_id, listing_reference, reason, description, reporter_email, privacy_consent) VALUES (?, ?, ?, ?, ?, ?)", (report["id"], report["listing_reference"], report["reason"], report["description"], report.get("email", ""), 1))
    conn.commit()
    return report["id"]


def save_lead_record(conn: sqlite3.Connection, lead: dict[str, Any]) -> str:
    conn.execute("INSERT INTO leads (lead_id, tenant_id, vehicle_id, buyer_name, phone, payment_method, score, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (lead["id"], lead["tenant_id"], lead["vehicle_id"], lead["buyer_name"], lead["phone"], lead.get("payment_method", ""), int(lead.get("score", 0)), "nuevo"))
    conn.commit()
    return lead["id"]


def save_vehicle_record(conn: sqlite3.Connection, vehicle_dict: dict[str, Any]) -> None:
    conn.execute(
        """
        INSERT OR REPLACE INTO vehicles (
            vehicle_id, tenant_id, brand, model, version, year, mileage_km,
            cash_price, dgt_badge, stage, evidence_level, status, public_slug, metadata_json
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            vehicle_dict["vehicle_id"],
            vehicle_dict["tenant_id"],
            vehicle_dict["brand"],
            vehicle_dict["model"],
            vehicle_dict.get("version", ""),
            vehicle_dict["year"],
            vehicle_dict["mileage_km"],
            vehicle_dict["cash_price"],
            vehicle_dict["dgt_badge"],
            vehicle_dict.get("stage", "publicado"),
            vehicle_dict.get("evidence_level", "verificado_obd"),
            vehicle_dict.get("status", "disponible"),
            vehicle_dict.get("public_slug", ""),
            json.dumps(vehicle_dict.get("metadata", {})),
        ),
    )


def get_vehicles_by_tenant(conn: sqlite3.Connection, tenant_id: str) -> list[dict[str, Any]]:
    rows = conn.execute("SELECT * FROM vehicles WHERE tenant_id = ?", (tenant_id,)).fetchall()
    return [dict(r) for r in rows]

def save_coche_ideal_request(conn: sqlite3.Connection, request: dict[str, Any], fingerprint: str, tenant_id: str = "public-intake") -> str:
    """Persiste una solicitud pública Coche Ideal sin registrar PII en logs."""
    request_id = request["id"]
    conn.execute("INSERT INTO coche_ideal_requests (request_id, tenant_id, fingerprint, payload_json, status, consent_version) VALUES (?, ?, ?, ?, ?, ?)", (request_id, tenant_id, fingerprint, json.dumps(request, ensure_ascii=False), "nueva", request.get("consentVersion", "pending")))
    conn.commit()
    return request_id



def list_coche_ideal_requests(conn: sqlite3.Connection, status: str | None = None) -> list[dict[str, Any]]:
    query = "SELECT request_id, tenant_id, payload_json, status, consent_version, created_at FROM coche_ideal_requests"
    params: tuple[str, ...] = ()
    if status:
        query += " WHERE status = ?"
        params = (status,)
    query += " ORDER BY created_at DESC"
    rows = conn.execute(query, params).fetchall()
    return [{**json.loads(row["payload_json"]), "id": row["request_id"], "status": row["status"], "createdAt": row["created_at"], "consentVersion": row["consent_version"]} for row in rows]
def update_coche_ideal_status(conn: sqlite3.Connection, request_id: str, status: str, actor: str = "advisor") -> bool:
    row = conn.execute("SELECT 1 FROM coche_ideal_requests WHERE request_id = ?", (request_id,)).fetchone()
    if not row:
        return False
    previous = conn.execute("SELECT status FROM coche_ideal_requests WHERE request_id = ?", (request_id,)).fetchone()["status"]
    conn.execute("UPDATE coche_ideal_requests SET status = ? WHERE request_id = ?", (status, request_id))
    conn.execute("INSERT INTO coche_ideal_status_history (request_id, previous_status, new_status, actor) VALUES (?, ?, ?, ?)", (request_id, previous, status, actor))
    conn.commit()
    return True
def list_coche_ideal_history(conn: sqlite3.Connection, request_id: str) -> list[dict[str, Any]]:
    rows = conn.execute("SELECT request_id, previous_status, new_status, actor, created_at FROM coche_ideal_status_history WHERE request_id = ? ORDER BY created_at ASC, history_id ASC", (request_id,)).fetchall()
    return [dict(row) for row in rows]
def has_recent_coche_ideal_fingerprint(conn: sqlite3.Connection, fingerprint: str, days: int = 30) -> bool:
    row = conn.execute("SELECT 1 FROM coche_ideal_requests WHERE fingerprint = ? AND created_at >= datetime('now', ?)", (fingerprint, f"-{days} days")).fetchone()
    return row is not None
