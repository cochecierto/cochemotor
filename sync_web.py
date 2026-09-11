#!/usr/bin/env python3
"""
CocheMotor — Sincronizador de Archivos Web
Mantiene paridad 100% entre la raíz del repositorio (para despliegue Hostinger en cochemotor.es)
y local-broker/static/ (entorno de pruebas y desarrollo local).
"""

import os
import shutil

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(ROOT_DIR, "local-broker", "static")

WEB_FILES = [
    "index.html",
    "index.php",
    "styles.css",
    "app.js",
    "site-config.js",
    "hub.html",
    "hub.js",
    "marketplace.html",
    "demanda.html",
    "ficha.html",
    "dealer.html",
    "aviso-legal.html",
    "privacidad.html",
    "terminos.html",
]

def sync(source="root"):
    """
    source: 'root' (copia de raiz a static) o 'static' (copia de static a raiz)
    """
    src_dir = ROOT_DIR if source == "root" else STATIC_DIR
    dst_dir = STATIC_DIR if source == "root" else ROOT_DIR

    print(f"[CocheMotor Sync] Sincronizando archivos desde {source.upper()} hacia destino...")

    os.makedirs(dst_dir, exist_ok=True)

    for filename in WEB_FILES:
        s_path = os.path.join(src_dir, filename)
        d_path = os.path.join(dst_dir, filename)
        if os.path.exists(s_path):
            shutil.copy2(s_path, d_path)
            print(f"  [OK] Sincronizado: {filename}")
        else:
            print(f"  [WARN] Archivo no encontrado en origen: {filename}")

    # Sincronizar directorio assets
    s_assets = os.path.join(src_dir, "assets")
    d_assets = os.path.join(dst_dir, "assets")
    if os.path.exists(s_assets):
        if os.path.exists(d_assets):
            shutil.rmtree(d_assets)
        shutil.copytree(s_assets, d_assets)
        print("  [OK] Directorio assets/ sincronizado completamente.")

    print("[CocheMotor Sync] Sincronizacion completada con exito.")

if __name__ == "__main__":
    sync("root")
