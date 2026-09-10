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

PORT = 8000
DIRECTORY = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

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
