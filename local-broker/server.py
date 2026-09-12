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
from urllib.parse import urlparse, parse_qs
try:
    from local_broker.broker_core.repository import get_connection, init_db, save_coche_ideal_request, has_recent_coche_ideal_fingerprint, list_coche_ideal_requests, list_coche_ideal_history, update_coche_ideal_status, save_dealership, save_vehicle_record, save_ad_report
    from local_broker.broker_core.auth import init_auth_schema, register_user, verify_user, authenticate_user, create_session, validate_session, revoke_session, update_profile
except ModuleNotFoundError:
    from broker_core.repository import get_connection, init_db, save_coche_ideal_request, has_recent_coche_ideal_fingerprint, list_coche_ideal_requests, list_coche_ideal_history, update_coche_ideal_status, save_dealership, save_vehicle_record, save_ad_report
    from broker_core.auth import init_auth_schema, register_user, verify_user, authenticate_user, create_session, validate_session, revoke_session, update_profile

PORT = 8000
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
DIRECTORY = ROOT_DIR if os.path.exists(os.path.join(ROOT_DIR, "index.html")) else STATIC_DIR

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/auth/verify":
            db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cochemotor.db")
            init_db(db_path)
            with get_connection(db_path) as conn:
                init_auth_schema(conn)
                ok = verify_user(conn, parse_qs(parsed.query).get("token", [""])[0])
            self._json_response(200 if ok else 400, {"ok": ok, "message": "Correo verificado. Ya puedes iniciar sesión." if ok else "Enlace de verificación no válido."})
            return
        if parsed.path != "/api/coche-ideal":
            return super().do_GET()
        expected = os.environ.get("COCHEMOTOR_ADVISOR_KEY")
        provided = self.headers.get("X-Advisor-Key")
        if not expected or not provided or not secrets.compare_digest(provided, expected):
            self._json_response(401, {"ok": False, "error": "No autorizado"})
            return
        db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cochemotor.db")
        init_db(db_path)
        query = parse_qs(parsed.query)
        with get_connection(db_path) as conn:
            request_id = query.get("id", [None])[0]
            if request_id:
                self._json_response(200, {"ok": True, "history": list_coche_ideal_history(conn, request_id)})
            else:
                self._json_response(200, {"ok": True, "requests": list_coche_ideal_requests(conn, query.get("status", [None])[0])})
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
            required = (payload["vehicle"].get("brand"), payload["vehicle"].get("model"), payload["preferences"].get("budgetMax"), payload["contact"].get("name"), payload["contact"].get("email"))
            if any(value in (None, "") for value in required) or payload["consent"].get("privacy") is not True or payload["consent"].get("contact") is not True:
                self._json_response(400, {"ok": False, "error": "Faltan datos obligatorios o consentimientos"})
                return
            preferences = payload["preferences"]
            year = payload["vehicle"].get("year")
            budget_max = preferences.get("budgetMax")
            if not isinstance(year, int) or year < 1900 or year > 2100 or not isinstance(budget_max, (int, float)) or budget_max <= 0:
                self._json_response(400, {"ok": False, "error": "Año o presupuesto inválidos"})
                return
            identity = {key: value for key, value in payload.items() if key not in {"id", "createdAt", "fingerprint"}}
            raw = json.dumps(identity, sort_keys=True, ensure_ascii=False)
            fingerprint = hashlib.sha256(raw.encode("utf-8")).hexdigest()
            db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cochemotor.db")
            init_db(db_path)
            with get_connection(db_path) as conn:
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
            length = int(self.headers.get("Content-Length", "0"))
            if length > 32_000:
                self._json_response(413, {"ok": False, "error": "Solicitud demasiado grande"})
                return
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cochemotor.db")
            init_db(db_path)
            with get_connection(db_path) as conn:
                init_auth_schema(conn)
                action = payload.get("action")
                if action == "register":
                    user = register_user(conn, payload.get("name", ""), payload.get("email", ""), payload.get("password", ""))
                    query = "http://localhost:%d/api/auth/verify?token=%s" % (PORT, user["verification_token"])
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
                    ok = update_profile(conn, payload.get("user_id", ""), payload.get("phone", ""), payload.get("professional_type", ""))
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
            db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cochemotor.db")
            init_db(db_path)
            with get_connection(db_path) as conn:
                user = validate_session(conn, payload.get("session_token", ""))
                vehicle = payload.get("vehicle") or {}
                if not user or not user["verified"] or not all(vehicle.get(key) not in (None, "") for key in ("id", "brand", "model", "year", "price")):
                    self._json_response(401, {"ok": False, "error": "Sesión o vehículo no válidos"})
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
            length = int(self.headers.get("Content-Length", "0"))
            if length > 12_000:
                self._json_response(413, {"ok": False, "error": "Solicitud demasiado grande"})
                return
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            required = (payload.get("listing_reference"), payload.get("reason"), payload.get("description"))
            if not all(isinstance(value, str) and value.strip() for value in required) or payload.get("privacy_consent") is not True:
                self._json_response(400, {"ok": False, "error": "Faltan datos obligatorios o consentimiento"})
                return
            db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cochemotor.db")
            init_db(db_path)
            report = {**payload, "id": "rep-" + secrets.token_hex(6)}
            with get_connection(db_path) as conn:
                save_ad_report(conn, report)
            self._json_response(201, {"ok": True, "id": report["id"], "status": "nueva"})
        except (ValueError, TypeError, json.JSONDecodeError):
            self._json_response(400, {"ok": False, "error": "Datos de denuncia no válidos"})
        except Exception:
            self._json_response(500, {"ok": False, "error": "No se pudo registrar la denuncia"})

    def do_PUT(self):
        if urlparse(self.path).path != "/api/coche-ideal":
            self.send_error(404)
            return
        expected = os.environ.get("COCHEMOTOR_ADVISOR_KEY")
        provided = self.headers.get("X-Advisor-Key")
        if not expected or not provided or not secrets.compare_digest(provided, expected):
            self._json_response(401, {"ok": False, "error": "No autorizado"})
            return
        allowed = {"nueva", "en revisión", "opciones encontradas", "presentada al cliente", "aceptada", "descartada", "cerrada"}
        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            if not isinstance(payload, dict) or not all(isinstance(payload.get(key), dict) for key in ("vehicle", "preferences", "contact", "consent")):
                self._json_response(400, {"ok": False, "error": "Estructura inválida"})
                return
            required = (payload["vehicle"].get("brand"), payload["vehicle"].get("model"), payload["preferences"].get("budgetMax"), payload["contact"].get("name"), payload["contact"].get("email"))
            if any(value in (None, "") for value in required) or payload["consent"].get("privacy") is not True or payload["consent"].get("contact") is not True:
                self._json_response(400, {"ok": False, "error": "Faltan datos obligatorios o consentimientos"})
                return
            preferences = payload["preferences"]
            year = payload["vehicle"].get("year")
            budget_max = preferences.get("budgetMax")
            if not isinstance(year, int) or year < 1900 or year > 2100 or not isinstance(budget_max, (int, float)) or budget_max <= 0:
                self._json_response(400, {"ok": False, "error": "Año o presupuesto inválidos"})
                return
            if payload.get("status") not in allowed or not payload.get("id"):
                self._json_response(400, {"ok": False, "error": "Estado o solicitud inválidos"})
                return
            db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cochemotor.db")
            init_db(db_path)
            with get_connection(db_path) as conn:
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
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
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
