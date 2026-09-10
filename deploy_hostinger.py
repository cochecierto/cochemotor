#!/usr/bin/env python3
"""
CocheMotor — Despliegue Automatizado a Hostinger vía FTP / SFTP
Sube recursivamente el contenido de local-broker/static/ al directorio public_html/
"""

import os
import sys
import ftplib

HOST = os.getenv("HOSTINGER_FTP_HOST", "")
USER = os.getenv("HOSTINGER_FTP_USER", "")
PASSWORD = os.getenv("HOSTINGER_FTP_PASS", "")
REMOTE_DIR = os.getenv("HOSTINGER_REMOTE_DIR", "public_html")
LOCAL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "local-broker", "static")

def upload_dir(ftp, local_path, remote_path):
    for item in os.listdir(local_path):
        l_item = os.path.join(local_path, item)
        r_item = f"{remote_path}/{item}".replace("\\", "/")
        if os.path.isdir(l_item):
            try:
                ftp.mkd(r_item)
                print(f"[FTP] Directorio creado: {r_item}")
            except ftplib.error_perm:
                pass
            upload_dir(ftp, l_item, r_item)
        else:
            with open(l_item, "rb") as f:
                ftp.storbinary(f"STOR {r_item}", f)
                print(f"[FTP] Subido: {r_item}")

def main():
    if not HOST or not USER or not PASSWORD:
        print("=" * 60)
        print("   COCHEMOTOR — DESPLIEGUE A HOSTINGER (FTP)")
        print("=" * 60)
        print("Faltan las credenciales FTP. Configura las variables de entorno:")
        print("  - HOSTINGER_FTP_HOST  (ej: ftp.tudominio.com o la IP del servidor Hostinger)")
        print("  - HOSTINGER_FTP_USER  (usuario FTP de hPanel)")
        print("  - HOSTINGER_FTP_PASS  (contrasena FTP)")
        print("=" * 60)
        sys.exit(1)

    print(f"[CocheMotor] Conectando a {HOST} con usuario {USER}...")
    try:
        with ftplib.FTP(HOST, USER, PASSWORD) as ftp:
            print("[CocheMotor] Conexión establecida con éxito.")
            try:
                ftp.cwd(REMOTE_DIR)
            except ftplib.error_perm:
                ftp.mkd(REMOTE_DIR)
                ftp.cwd(REMOTE_DIR)
            print(f"[CocheMotor] Subiendo archivos desde {LOCAL_DIR} hacia /{REMOTE_DIR}...")
            upload_dir(ftp, LOCAL_DIR, REMOTE_DIR)
            print("=" * 60)
            print("   ✅ DESPLIEGUE A HOSTINGER COMPLETADO CON ÉXITO")
            print("=" * 60)
    except Exception as e:
        print(f"[Error FTP] {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
