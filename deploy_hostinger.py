#!/usr/bin/env python3
"""
CocheMotor — Despliegue Automatizado a Hostinger vía FTP / SFTP
Sube los archivos web directamente al directorio public_html/ para https://motor.cochecierto.com/
y la URL temporal https://motor.cochecierto.com/
"""

import os
import sys
import ftplib
import argparse

DEFAULT_HOST = os.getenv("HOSTINGER_FTP_HOST", "")
DEFAULT_USER = os.getenv("HOSTINGER_FTP_USER", "")
DEFAULT_PASS = os.getenv("HOSTINGER_FTP_PASS", "")
DEFAULT_DIR = os.getenv("HOSTINGER_REMOTE_DIR", "public_html")
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

FILES_TO_UPLOAD = [
    "index.html",
    "styles.css",
    "app.js",
    "site-config.js",
    "hub.html",
    "hub.js",
    "marketplace.html",
    "demanda.html",
    "ficha.html",
    ".htaccess",
]

def upload_dir_recursive(ftp, local_path, remote_path):
    for item in os.listdir(local_path):
        l_item = os.path.join(local_path, item)
        r_item = f"{remote_path}/{item}".replace("\\", "/")
        if os.path.isdir(l_item):
            try:
                ftp.mkd(r_item)
                print(f"[FTP] Directorio creado: {r_item}")
            except ftplib.error_perm:
                pass
            upload_dir_recursive(ftp, l_item, r_item)
        else:
            with open(l_item, "rb") as f:
                ftp.storbinary(f"STOR {r_item}", f)
                print(f"[FTP] Subido: {r_item}")

def main():
    parser = argparse.ArgumentParser(description="Despliegue CocheMotor a Hostinger")
    parser.add_argument("--host", default=DEFAULT_HOST, help="Servidor FTP Hostinger")
    parser.add_argument("--user", default=DEFAULT_USER, help="Usuario FTP Hostinger")
    parser.add_argument("--password", default=DEFAULT_PASS, help="Contraseña FTP")
    parser.add_argument("--dir", default=DEFAULT_DIR, help="Directorio remoto (por defecto: public_html)")
    args = parser.parse_args()

    host = args.host or input("Introduce el host FTP de Hostinger (ej. ftp.motor.cochecierto.com o IP): ").strip()
    user = args.user or input("Introduce el usuario FTP de Hostinger: ").strip()
    password = args.password or input("Introduce la contraseña FTP de Hostinger: ").strip()
    remote_dir = args.dir

    if not host or not user or not password:
        print("Error: Credenciales incompletas.")
        sys.exit(1)

    print("=" * 65)
    print("   COCHEMOTOR — DESPLIEGUE A HOSTINGER")
    print(f"   Destino: https://motor.cochecierto.com/ | {remote_dir}")
    print("=" * 65)
    print(f"[FTP] Conectando a {host}...")

    try:
        with ftplib.FTP(host, user, password) as ftp:
            print("[FTP] Conexión establecida con éxito.")
            try:
                ftp.cwd(remote_dir)
            except ftplib.error_perm:
                ftp.mkd(remote_dir)
                ftp.cwd(remote_dir)

            print(f"[FTP] Subiendo archivos web a /{remote_dir}...")
            # 1. Subir archivos principales
            for f in FILES_TO_UPLOAD:
                local_file = os.path.join(ROOT_DIR, f)
                if os.path.exists(local_file):
                    with open(local_file, "rb") as fp:
                        ftp.storbinary(f"STOR {f}", fp)
                        print(f"  ✓ {f} subido correctamente.")

            # 2. Subir carpeta assets
            assets_dir = os.path.join(ROOT_DIR, "assets")
            if os.path.exists(assets_dir):
                print("  ✓ Subiendo directorio assets/...")
                try:
                    ftp.mkd("assets")
                except ftplib.error_perm:
                    pass
                upload_dir_recursive(ftp, assets_dir, "assets")

            print("\n" + "=" * 65)
            print("   ✅ DESPLIEGUE A HOSTINGER COMPLETADO CON ÉXITO")
            print("   Producción: https://motor.cochecierto.com/")
            print("   Preview:    https://motor.cochecierto.com/")
            print("=" * 65)
    except Exception as e:
        print(f"[Error FTP] {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
