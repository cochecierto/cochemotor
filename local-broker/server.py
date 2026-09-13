#!/usr/bin/env python3
"""
CocheMotor — Local Broker & Static HTTP Server
Sirve la web editorial de CocheMotor en http://localhost:8000
Sin dependencias externas (0 npm, 0 pip requeridos para ejecucion).
"""

import http.server
import socketserver
import os
import sys
import json
import hashlib
import secrets
import threading
import time
from urllib.parse import urlparse, parse_qs
try:
    from local_broker.broker_core.repository import get_connection, init_db, save_coche_ideal_request, has_recent_coche_ideal_fingerprint, list_coche_ideal_requests, list_coche_ideal_history, update_coche_ideal_status, save_dealership, save_vehicle_record, save_ad_report, save_lead_record, list_lead_records
    from local_broker.broker_core.auth import init_auth_schema, register_user, verify_user, authenticate_user, create_session, validate_session, revoke_session, update_profile, can_update_profile
except ModuleNotFoundError:
    from broker_core.repository import get_connection, init_db, save_coche_ideal_request, has_recent_coche_ideal_fingerprint, list_coche_ideal_requests, list_coche_ideal_history, update_coche_ideal_status, save_dealership, save_vehicle_record, save_ad_report, save_lead_record, list_lead_records
    from broker_core.auth import init_auth_schema, register_user, verify_user, authenticate_user, create_session, validate_session, revoke_session, update_profile, can_update_profile

try:
    PORT = int(os.environ.get("COCHEMOTOR_PORT", "8000"))
except ValueError:
    PORT = 8000
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
DIRECTORY = ROOT_DIR if os.path.exists(os.path.join(ROOT_DIR, "index.html")) else STATIC_DIR
DB_PATH = os.environ.get("COCHEMOTOR_DB_PATH", os.path.join(os.path.dirname(os.path.abspath(__file__)), "cochemotor.db"))
_RATE_LIMIT_LOCK = threading.Lock()
_RATE_LIMIT_BUCKETS: dict[tuple[str, str], list[float]] = {}


def _rate_limited(scope: str, client: str, limit: int, window: int = 60) -> bool:
    """Small process-local limiter; the reverse proxy remains the production boundary."""
    now = time.monotonic()
    key = (scope, client or "unknown")
    with _RATE_LIMIT_LOCK:
        recent = [stamp for stamp in _RATE_LIMIT_BUCKETS.get(key, []) if now - stamp < window]
        if len(recent) >= limit:
            _RATE_LIMIT_BUCKETS[key] = recent
            return True
        recent.append(now)
        _RATE_LIMIT_BUCKETS[key] = recent
        if len(_RATE_LIMIT_BUCKETS) > 2048:
            _RATE_LIMIT_BUCKETS.clear()
        return False


def _advisor_session(handler: "Handler") -> dict | None:
    """Authorize internal operations with a verified session and explicit allowlist."""
    bearer = handler.headers.get("Authorization", "")
    if not bearer.startswith("Bearer "):
        return None
    allowed = {item.strip() for item in os.environ.get("COCHEMOTOR_ADVISOR_USER_IDS", "").split(",") if item.strip()}
    if not allowed:
        return None
    init_db(DB_PATH)
    with get_connection(DB_PATH) as conn:
        user = validate_session(conn, bearer[7:].strip())
    return user if user and user.get("verified") and user.get("user_id") in allowed else None

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/health":
            self._json_response(200, {"ok": True, "service": "cochemotor-broker"})
            return
        if parsed.path == "/api/auth/verify":
            init_db(DB_PATH)
            with get_connection(DB_PATH) as conn:
                init_auth_schema(conn)
                ok = verify_user(conn, parse_qs(parsed.query).get("token", [""])[0])
            self._json_response(200 if ok else 400, {"ok": ok, "message": "Correo verificado. Ya puedes iniciar sesión." if ok else "Enlace de verificación no válido."})
            return
        if parsed.path != "/api/coche-ideal":
            if parsed.path == "/api/leads":
                advisor = _advisor_session(self)
                if not advisor:
                    self._json_response(403, {"ok": False, "error": "Panel de asesor no configurado o no autorizado"})
                    return
                init_db(DB_PATH)
                with get_connection(DB_PATH) as conn:
                    self._json_response(200, {"ok": True, "leads": list_lead_records(conn, advisor["user_id"])})
                return
            return super().do_GET()
        if not _advisor_session(self):
            self._json_response(403, {"ok": False, "error": "Panel de asesor no configurado o no autorizado"})
            return
        init_db(DB_PATH)
        query = parse_qs(parsed.query)
        with get_connection(DB_PATH) as conn:
            request_id = query.get("id", [None])[0]
            if request_id:
                self._json_response(200, {"ok": True, "history": list_coche_ideal_history(conn, request_id)})
            else:
                self._json_response(200, {"ok": True, "requests": list_coche_ideal_requests(conn, query.get("status", [None])[0])})

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors_headers()
        self.end_headers()
    def do_POST(self):
        if self.path == "/api/auth":
            self._handle_auth()
            return
        if self.path == "/api/vehicles":
            self._handle_vehicle()
            return
        if self.path == "/api/report":
            self._handle_report()
            return
        if self.path == "/api/leads":
            self._handle_lead()
            return
        if self.path != "/api/coche-ideal":
            self.send_error(404)
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length > 32_000:
                self._json_response(413, {"ok": False, "error": "Solicitud demasiado grande"})
                return
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            if not isinstance(payload, dict) or not all(isinstance(payload.get(key), dict) for key in ("vehicle", "preferences", "contact", "consent")):
                self._json_response(400, {"ok": False, "error": "Estructura inválida"})
                return
            if str(payload.pop("website", "")).strip():
                self._json_response(400, {"ok": False, "error": "Solicitud inválida"})
                return
            required = (payload["preferences"].get("budgetMax"), payload["preferences"].get("need"), payload["contact"].get("name"), payload["contact"].get("email"))
            if any(value in (None, "") for value in required) or payload["consent"].get("privacy") is not True or payload["consent"].get("contact") is not True:
                self._json_response(400, {"ok": False, "error": "Faltan datos obligatorios o consentimientos"})
                return
            need = payload["preferences"].get("need")
            need_categories = {
                "city": {"urban"}, "family": {"family", "minivan", "suv"},
                "travel": {"fastback", "family", "suv"}, "adventure": {"suv", "offroad", "coupe4x4"},
                "work": {"van", "pickup"}, "leisure": {"convertible", "fastback", "coupe4x4"},
                "camper": {"camper"}, "motorcycle": {"motorcycle"}
            }
            selected_categories = payload["preferences"].get("matchedCategories")
            if (not isinstance(need, dict) or not isinstance(need.get("id"), str) or need.get("id") not in need_categories or
                    not isinstance(need.get("label"), str) or not 2 <= len(need["label"].strip()) <= 80 or
                    not isinstance(selected_categories, list) or not 1 <= len(selected_categories) <= 4 or
                    any(not isinstance(category, str) for category in selected_categories) or
                    len(set(selected_categories)) != len(selected_categories) or
                    any(category not in need_categories[need["id"]] for category in selected_categories) or
                    payload["preferences"].get("matchingStrategy") != "rules-v1"):
                self._json_response(400, {"ok": False, "error": "La necesidad o los tipos de vehículo no son válidos"})
                return
            contact = payload["contact"]
            if (not isinstance(contact["email"], str) or len(contact["email"].strip()) > 254 or "@" not in contact["email"] or
                    not isinstance(contact["name"], str) or len(contact["name"].strip()) > 120 or
                    not isinstance(contact.get("phone", ""), str) or len(contact.get("phone", "")) > 32):
                self._json_response(400, {"ok": False, "error": "Datos de contacto demasiado largos"})
                return
            channels = contact.get("channels")
            schedule = contact.get("schedule")
            preferred_time = contact.get("preferredTime", "")
            allowed_channels = {"email", "whatsapp", "call"}
            if (not isinstance(channels, list) or not 1 <= len(channels) <= 3 or
                    any(not isinstance(channel, str) or channel not in allowed_channels for channel in channels) or
                    len(set(channels)) != len(channels) or
                    schedule not in {"flexible", "preferred"} or
                    (schedule == "preferred" and preferred_time not in {"morning", "midday", "afternoon"}) or
                    (schedule == "flexible" and preferred_time != "") or
                    (any(channel in {"whatsapp", "call"} for channel in channels) and len(contact.get("phone", "").strip()) < 6)):
                self._json_response(400, {"ok": False, "error": "Revisa cómo prefieres que te contactemos"})
                return
            preferences = payload["preferences"]
            year = payload["vehicle"].get("year")
            budget_max = preferences.get("budgetMax")
            if (year is not None and (not isinstance(year, int) or year < 1950 or year > 2100)) or not isinstance(budget_max, (int, float)) or budget_max < 500 or budget_max > 1_000_000:
                self._json_response(400, {"ok": False, "error": "Año o presupuesto inválidos"})
                return
            identity = {key: value for key, value in payload.items() if key not in {"id", "createdAt", "fingerprint"}}
            raw = json.dumps(identity, sort_keys=True, ensure_ascii=False)
            fingerprint = hashlib.sha256(raw.encode("utf-8")).hexdigest()
            init_db(DB_PATH)
            with get_connection(DB_PATH) as conn:
                if has_recent_coche_ideal_fingerprint(conn, fingerprint):
                    self._json_response(409, {"ok": False, "duplicate": True})
                    return
                request_id = payload.get("id", "ci-" + fingerprint[:12])
                payload["id"] = request_id
                save_coche_ideal_request(conn, payload, fingerprint)
            self._json_response(201, {"ok": True, "id": request_id, "status": "nueva"})
        except (ValueError, json.JSONDecodeError, KeyError):
            self._json_response(400, {"ok": False, "error": "Solicitud inválida"})
        except Exception:
            self._json_response(500, {"ok": False, "error": "No se pudo guardar la solicitud"})

    def _handle_auth(self):
        try:
            action_hint = "auth-login" if self.command == "POST" else "auth"
            if _rate_limited(action_hint, self.client_address[0], 10 if action_hint == "auth-login" else 30):
                self._json_response(429, {"ok": False, "error": "Demasiadas solicitudes. Inténtalo más tarde."})
                return
            length = int(self.headers.get("Content-Length", "0"))
            if length > 32_000:
                self._json_response(413, {"ok": False, "error": "Solicitud demasiado grande"})
                return
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            init_db(DB_PATH)
            with get_connection(DB_PATH) as conn:
                init_auth_schema(conn)
                action = payload.get("action")
                if action == "register":
                    user = register_user(conn, payload.get("name", ""), payload.get("email", ""), payload.get("password", ""))
                    public_base = os.environ.get("COCHEMOTOR_PUBLIC_BASE_URL", "").rstrip("/")
                    if not public_base:
                        forwarded_proto = self.headers.get("X-Forwarded-Proto", "http").split(",")[0].strip()
                        forwarded_host = self.headers.get("X-Forwarded-Host") or self.headers.get("Host") or ("localhost:%d" % PORT)
                        public_base = "%s://%s" % (forwarded_proto, forwarded_host)
                    query = "%s/api/auth/verify?token=%s" % (public_base, user["verification_token"])
                    user.pop("verification_token", None)
                    self._json_response(201, {"ok": True, "user": user, "verification_url": query})
                    return
                if action == "login":
                    user = authenticate_user(conn, payload.get("email", ""), payload.get("password", ""))
                    self._json_response(200, {"ok": True, "user": user, "session_token": create_session(conn, user["user_id"])})
                    return
                if action == "session":
                    user = validate_session(conn, payload.get("session_token", ""))
                    self._json_response(200 if user else 401, {"ok": bool(user), "user": user})
                    return
                if action == "logout":
                    revoke_session(conn, payload.get("session_token", ""))
                    self._json_response(200, {"ok": True})
                    return
                if action == "profile":
                    session_user = validate_session(conn, payload.get("session_token", ""))
                    requested_user_id = payload.get("user_id", "")
                    if not can_update_profile(session_user, requested_user_id):
                        self._json_response(401, {"ok": False, "error": "Sesión no autorizada"})
                        return
                    ok = update_profile(conn, requested_user_id, payload.get("phone", ""), payload.get("professional_type", ""))
                    self._json_response(200 if ok else 404, {"ok": ok})
                    return
            self._json_response(400, {"ok": False, "error": "Acción de acceso no válida"})
        except (ValueError, json.JSONDecodeError, KeyError):
            self._json_response(400, {"ok": False, "error": "Datos de acceso no válidos"})
        except Exception:
            self._json_response(500, {"ok": False, "error": "No se pudo completar el acceso"})

    def _handle_vehicle(self):
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length > 32_000:
                self._json_response(413, {"ok": False, "error": "Solicitud demasiado grande"})
                return
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            init_db(DB_PATH)
            with get_connection(DB_PATH) as conn:
                user = validate_session(conn, payload.get("session_token", ""))
                vehicle = payload.get("vehicle") or {}
                if not user or not user["verified"] or not all(vehicle.get(key) not in (None, "") for key in ("id", "brand", "model", "year", "price")):
                    self._json_response(401, {"ok": False, "error": "Sesión o vehículo no válidos"})
                    return
                images = vehicle.get("images", [])
                if not isinstance(images, list) or len(images) > 10:
                    self._json_response(400, {"ok": False, "error": "Un anuncio puede tener como máximo 10 imágenes."})
                    return
                tenant_id = user["user_id"]
                save_dealership(conn, tenant_id, user["name"], tenant_id, user.get("phone") or "")
                save_vehicle_record(conn, {"vehicle_id": vehicle["id"], "tenant_id": tenant_id, "brand": vehicle["brand"], "model": vehicle["model"], "version": vehicle.get("version", ""), "year": int(vehicle["year"]), "mileage_km": int(str(vehicle.get("km", "0")).replace(".", "").replace(" km", "") or 0), "cash_price": float(vehicle["price"]), "dgt_badge": vehicle.get("badge", ""), "stage": vehicle.get("stage", "publicado"), "evidence_level": vehicle.get("evidenceLevel", "declarado"), "status": vehicle.get("status", "disponible"), "public_slug": vehicle["id"], "metadata": vehicle})
            self._json_response(201, {"ok": True, "id": vehicle["id"]})
        except (ValueError, TypeError, json.JSONDecodeError, KeyError):
            self._json_response(400, {"ok": False, "error": "Datos del vehículo no válidos"})
        except Exception:
            self._json_response(500, {"ok": False, "error": "No se pudo guardar el vehículo"})

    def _handle_report(self):
        try:
            if _rate_limited("report", self.client_address[0], 10):
                self._json_response(429, {"ok": False, "error": "Demasiadas solicitudes. Inténtalo más tarde."})
                return
            length = int(self.headers.get("Content-Length", "0"))
            if length > 12_000:
                self._json_response(413, {"ok": False, "error": "Solicitud demasiado grande"})
                return
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            required = (payload.get("listing_reference"), payload.get("reason"), payload.get("description"))
            if not all(isinstance(value, str) and value.strip() for value in required) or payload.get("privacy_consent") is not True:
                self._json_response(400, {"ok": False, "error": "Faltan datos obligatorios o consentimiento"})
                return
            if (len(payload["listing_reference"].strip()) > 160 or len(payload["reason"].strip()) > 80 or
                    len(payload["description"].strip()) > 2000 or
                    (payload.get("email") and (not isinstance(payload["email"], str) or len(payload["email"].strip()) > 254))):
                self._json_response(400, {"ok": False, "error": "Datos de denuncia demasiado largos"})
                return
            init_db(DB_PATH)
            report = {**payload, "id": "rep-" + secrets.token_hex(6)}
            with get_connection(DB_PATH) as conn:
                save_ad_report(conn, report)
            self._json_response(201, {"ok": True, "id": report["id"], "status": "nueva"})
        except (ValueError, TypeError, json.JSONDecodeError):
            self._json_response(400, {"ok": False, "error": "Datos de denuncia no válidos"})
        except Exception:
            self._json_response(500, {"ok": False, "error": "No se pudo registrar la denuncia"})

    def _handle_lead(self):
        try:
            if _rate_limited("lead", self.client_address[0], 20):
                self._json_response(429, {"ok": False, "error": "Demasiadas solicitudes. Inténtalo más tarde."})
                return
            length = int(self.headers.get("Content-Length", "0"))
            if length > 8_000:
                self._json_response(413, {"ok": False, "error": "Solicitud demasiado grande"})
                return
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            if not all(isinstance(payload.get(key), str) and payload[key].strip() for key in ("vehicle_id", "tenant_id", "buyer_name", "phone")):
                self._json_response(400, {"ok": False, "error": "Faltan datos de contacto"})
                return
            limits = {"vehicle_id": 80, "tenant_id": 80, "buyer_name": 120, "phone": 32}
            if any(len(payload[key].strip()) > limit for key, limit in limits.items()):
                self._json_response(400, {"ok": False, "error": "Datos de contacto demasiado largos"})
                return
            init_db(DB_PATH)
            lead = {**payload, "id": "lead-" + secrets.token_hex(6)}
            with get_connection(DB_PATH) as conn:
                owner = conn.execute("SELECT tenant_id FROM vehicles WHERE vehicle_id = ?", (lead["vehicle_id"],)).fetchone()
                if not owner:
                    self._json_response(404, {"ok": False, "error": "Vehículo no encontrado"})
                    return
                lead["tenant_id"] = owner["tenant_id"]
                save_lead_record(conn, lead)
            self._json_response(201, {"ok": True, "id": lead["id"]})
        except (ValueError, TypeError, json.JSONDecodeError):
            self._json_response(400, {"ok": False, "error": "Datos de contacto no válidos"})
        except Exception as error:
            print("[CocheMotor] Error registrando lead: %s" % error)
            self._json_response(500, {"ok": False, "error": "No se pudo registrar el contacto"})

    def do_PUT(self):
        if urlparse(self.path).path != "/api/coche-ideal":
            self.send_error(404)
            return
        if not _advisor_session(self):
            self._json_response(403, {"ok": False, "error": "Panel de asesor no configurado o no autorizado"})
            return
        allowed = {"nueva", "en revisión", "opciones encontradas", "presentada al cliente", "aceptada", "descartada", "cerrada"}
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length > 8_000:
                self._json_response(413, {"ok": False, "error": "Solicitud demasiado grande"})
                return
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            if not isinstance(payload, dict) or not isinstance(payload.get("id"), str) or not payload["id"].strip() or payload.get("status") not in allowed or not set(payload).issubset({"id", "status"}):
                self._json_response(400, {"ok": False, "error": "Estado o solicitud inválidos"})
                return
            init_db(DB_PATH)
            with get_connection(DB_PATH) as conn:
                if not update_coche_ideal_status(conn, payload["id"], payload["status"]):
                    self._json_response(404, {"ok": False, "error": "Solicitud no encontrada"})
                    return
            self._json_response(200, {"ok": True, "id": payload["id"], "status": payload["status"]})
        except (ValueError, json.JSONDecodeError):
            self._json_response(400, {"ok": False, "error": "Solicitud inválida"})
    def _json_response(self, status, data):
        body = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("X-Frame-Options", "SAMEORIGIN")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        self.send_header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
        self.send_header("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
        self._cors_headers()
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _cors_headers(self):
        origin = self.headers.get("Origin")
        if origin in ("https://cochemotor.es", "https://www.cochemotor.es"):
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
            self.send_header("Vary", "Origin")
    def log_message(self, format, *args):
        sys.stdout.write("[CocheMotor Local Server] %s - %s\n" % (self.address_string(), format % args))
        sys.stdout.flush()

def main():
    if not os.path.exists(DIRECTORY):
        print("Error: Directorio static no encontrado.")
        sys.exit(1)

    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print("=" * 60)
        print("   COCHEMOTOR - SERVIDOR LOCAL DE DESARROLLO")
        print("=" * 60)
        print("   -> URL Local:     http://localhost:%d" % PORT)
        print("   -> Directorio:    %s" % DIRECTORY)
        print("   -> Estado:        Listo para pruebas y navegacion")
        print("   -> Detener:       Presiona Ctrl+C en cualquier momento")
        print("=" * 60)
        sys.stdout.flush()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n[CocheMotor] Servidor local detenido correctamente.")

if __name__ == "__main__":
    main()
