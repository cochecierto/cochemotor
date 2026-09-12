#!/usr/bin/env python3
"""Genera el snapshot territorial que consume CocheMotor desde un CSV del INE.

Uso:
  python scripts/build_ine_territory.py descarga/municipios.csv

El CSV debe incluir los códigos/nombres de comunidad, provincia y municipio.
Se aceptan encabezados habituales del INE (CCAA/CPRO/CMUN y sus literales).
La descarga oficial se obtiene desde la operación del INE enlazada en
assets/data/spain_territory.js; este script evita depender de una API en cada
búsqueda y deja el snapshot revisable en Git.
"""
from __future__ import annotations

import csv
import json
import sys
from collections import OrderedDict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "data" / "spain_territory.generated.js"

ALIASES = {
    "ccaa_code": {"ccaa", "cauto", "codigo comunidad", "codigo ccaa", "codauto"},
    "ccaa_name": {"ccaa_name", "comunidad", "comunidad autonoma", "literal ccaa"},
    "province_code": {"cpro", "provincia code", "codigo provincia", "codprov"},
    "province_name": {"province", "provincia", "literal provincia"},
    "municipality_code": {"cmun", "municipio code", "codigo municipio", "codmun"},
    "municipality_name": {"municipality", "municipio", "literal municipio"},
}

def key(value: str) -> str:
    return " ".join(value.strip().lower().replace("_", " ").split())

def resolve_headers(headers: list[str]) -> dict[str, str]:
    normalized = {key(h): h for h in headers}
    resolved = {}
    for target, candidates in ALIASES.items():
        for candidate in candidates:
            if candidate in normalized:
                resolved[target] = normalized[candidate]
                break
    missing = set(ALIASES) - set(resolved)
    if missing:
        raise ValueError(f"Faltan columnas territoriales: {', '.join(sorted(missing))}")
    return resolved

def main() -> int:
    if len(sys.argv) != 2:
        print("Uso: python scripts/build_ine_territory.py <municipios.csv>", file=sys.stderr)
        return 2
    source = Path(sys.argv[1])
    with source.open("r", encoding="utf-8-sig", newline="") as fh:
        reader = csv.DictReader(fh, delimiter=";")
        if not reader.fieldnames:
            raise ValueError("El CSV no tiene encabezados")
        cols = resolve_headers(reader.fieldnames)
        communities: OrderedDict[str, dict] = OrderedDict()
        for row in reader:
            ccaa = communities.setdefault(row[cols["ccaa_code"]].zfill(2), {
                "id": row[cols["ccaa_code"]].zfill(2),
                "name": row[cols["ccaa_name"]].strip(),
                "provinces": OrderedDict(),
            })
            province = ccaa["provinces"].setdefault(row[cols["province_code"]].zfill(2), {
                "id": row[cols["province_code"]].zfill(2),
                "name": row[cols["province_name"]].strip(),
                "municipalities": [],
            })
            province["municipalities"].append({
                "id": row[cols["municipality_code"]].zfill(5),
                "name": row[cols["municipality_name"]].strip(),
            })
        data = []
        for ccaa in communities.values():
            ccaa["provinces"] = list(ccaa["provinces"].values())
            data.append(ccaa)
    payload = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    OUT.write_text("export const COMMUNITIES = " + payload + ";\n", encoding="utf-8")
    print(f"Generado {OUT} con {sum(len(c['provinces']) for c in data)} provincias")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
