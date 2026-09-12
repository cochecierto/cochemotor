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
    from local_broker.broker_core.repository import get_connection, init_db, save_coche_ideal_request, has_recent_coche_ideal_fingerprint, list_coche_ideal_requests
except ModuleNotFoundError:
    from broker_core.repository import get_connection, init_db, save_coche_ideal_request, has_recent_coche_ideal_fingerprint, list_coche_ideal_requests

PORT = 8000
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
DIRECTORY = ROOT_DIR if os.path.exists(os.path.join(ROOT_DIR, "index.html")) else STATIC_DIR

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        parsed = urlparse(self.path)
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
            self._json_response(200, {"ok": True, "requests": list_coche_ideal_requests(conn, query.get("status", [None])[0])})
    def do_POST(self):
        if self.path != "/api/coche-ideal":
            self.send_error(404)
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
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

    def _json_response(self, status, data):
        body = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
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
