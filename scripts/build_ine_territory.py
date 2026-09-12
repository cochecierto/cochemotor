#!/usr/bin/env python3
"""Genera el snapshot territorial que consume CocheMotor desde un CSV del INE.

Uso:
  python scripts/build_ine_territory.py descarga/municipios.csv
  python scripts/build_ine_territory.py descarga/municipios.json

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
OUT = ROOT / "assets" / "data" / "spain_territory.js"

PROVINCE_TO_CCAA = {
    **{p: "01" for p in "04,11,14,18,21,23,29,41".split(",")},
    **{p: "02" for p in "22,44,50".split(",")}, "33": "03", "07": "04",
    **{p: "05" for p in "35,38".split(",")}, "39": "06",
    **{p: "07" for p in "05,09,24,34,37,40,42,47,49".split(",")},
    **{p: "08" for p in "02,13,16,19,45".split(",")},
    **{p: "09" for p in "08,17,25,43".split(",")},
    **{p: "10" for p in "03,12,46".split(",")},
    **{p: "11" for p in "06,10".split(",")},
    **{p: "12" for p in "15,27,32,36".split(",")}, "28": "13", "30": "14", "31": "15",
    **{p: "16" for p in "01,20,48".split(",")}, "26": "17", "51": "18", "52": "19"
}
CCAA_NAMES = {"01":"Andalucía","02":"Aragón","03":"Asturias, Principado de","04":"Balears, Illes","05":"Canarias","06":"Cantabria","07":"Castilla y León","08":"Castilla-La Mancha","09":"Cataluña","10":"Comunitat Valenciana","11":"Extremadura","12":"Galicia","13":"Madrid, Comunidad de","14":"Murcia, Región de","15":"Navarra, Comunidad Foral de","16":"País Vasco","17":"Rioja, La","18":"Ceuta","19":"Melilla"}
PROVINCE_NAMES = {"01":"Araba/Álava","02":"Albacete","03":"Alicante/Alacant","04":"Almería","05":"Ávila","06":"Badajoz","07":"Balears, Illes","08":"Barcelona","09":"Burgos","10":"Cáceres","11":"Cádiz","12":"Castellón/Castelló","13":"Ciudad Real","14":"Córdoba","15":"Coruña, A","16":"Cuenca","17":"Girona","18":"Granada","19":"Guadalajara","20":"Gipuzkoa","21":"Huelva","22":"Huesca","23":"Jaén","24":"León","25":"Lleida","26":"Rioja, La","27":"Lugo","28":"Madrid","29":"Málaga","30":"Murcia","31":"Navarra","32":"Ourense","33":"Asturias","34":"Palencia","35":"Palmas, Las","36":"Pontevedra","37":"Salamanca","38":"Santa Cruz de Tenerife","39":"Cantabria","40":"Segovia","41":"Sevilla","42":"Soria","43":"Tarragona","44":"Teruel","45":"Toledo","46":"Valencia/València","47":"Valladolid","48":"Bizkaia","49":"Zamora","50":"Zaragoza","51":"Ceuta","52":"Melilla"}

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
    if source.suffix.lower() == ".json":
        rows = json.loads(source.read_text(encoding="utf-8"))
        rows = [{
            "ccaa": PROVINCE_TO_CCAA.get(str(row.get("provincia_id", "")).zfill(2), ""),
            "comunidad": CCAA_NAMES.get(PROVINCE_TO_CCAA.get(str(row.get("provincia_id", "")).zfill(2), ""), ""),
            "cpro": str(row.get("provincia_id", "")).zfill(2),
            "provincia": PROVINCE_NAMES.get(str(row.get("provincia_id", "")).zfill(2), ""),
            "cmun": row.get("municipio_id", ""),
            "municipio": row.get("nombre", ""),
        } for row in rows]
        cols = {"ccaa_code": "ccaa", "ccaa_name": "comunidad", "province_code": "cpro", "province_name": "provincia", "municipality_code": "cmun", "municipality_name": "municipio"}
    else:
        with source.open("r", encoding="utf-8-sig", newline="") as fh:
            reader = csv.DictReader(fh, delimiter=";")
            if not reader.fieldnames:
                raise ValueError("El CSV no tiene encabezados")
            cols = resolve_headers(reader.fieldnames)
            rows = list(reader)
    communities: OrderedDict[str, dict] = OrderedDict()
    for row in rows:
        ccaa_code = str(row[cols["ccaa_code"]]).zfill(2)
        province_code = str(row[cols["province_code"]]).zfill(2)
        municipality_code = str(row[cols["municipality_code"]]).zfill(5)
        ccaa = communities.setdefault(ccaa_code, {
            "id": ccaa_code, "name": row[cols["ccaa_name"]].strip(), "provinces": OrderedDict()
        })
        province = ccaa["provinces"].setdefault(province_code, {
            "id": province_code, "name": row[cols["province_name"]].strip(), "municipalities": []
        })
        province["municipalities"].append({"id": municipality_code, "name": row[cols["municipality_name"]].strip()})
    data = []
    for ccaa in communities.values():
        ccaa["provinces"] = list(ccaa["provinces"].values())
        data.append(ccaa)
    payload = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    suffix = r'''

export const TERRITORY_SOURCE = {
  authority: 'Instituto Nacional de Estadística (INE)',
  dataset: 'Relación de municipios y sus códigos por provincias',
  country: 'ES',
  codeSystem: 'INE',
  lastReviewed: '2026-09-12',
  officialUrl: 'https://www.ine.es/daco/daco42/codmun/cod_ccaa_provincia.htm',
  municipalityDatasetUrl: 'https://datos.gob.es/es/catalogo/ea0042823-relacion-de-municipios-y-sus-codigos-por-provincias',
  status: 'official-snapshot',
  updatePolicy: 'Actualizar el snapshot local antes de cada release territorial'
};

export function getTerritorySource() { return { ...TERRITORY_SOURCE }; }
export function getCommunities() { return COMMUNITIES.map(c => ({ id: c.id, name: c.name })); }
export function getProvinces(communityId) {
  const comm = COMMUNITIES.find(c => c.id === communityId);
  return comm ? comm.provinces.map(p => ({ id: p.id, name: p.name })) : [];
}
export function getMunicipalities(provinceId) {
  for (const comm of COMMUNITIES) {
    const prov = comm.provinces.find(p => p.id === provinceId);
    if (prov) return prov.municipalities.map(m => ({ id: m.id, name: m.name }));
  }
  return [];
}
export function findLocation(query) {
  const q = query.trim().toLowerCase();
  const results = [];
  for (const comm of COMMUNITIES) {
    if (comm.name.toLowerCase().includes(q)) results.push({ type: 'community', id: comm.id, name: comm.name });
    for (const prov of comm.provinces) {
      if (prov.name.toLowerCase().includes(q)) results.push({ type: 'province', id: prov.id, name: prov.name, communityId: comm.id });
      for (const mun of prov.municipalities) {
        if (mun.name.toLowerCase().includes(q)) results.push({ type: 'municipality', id: mun.id, name: mun.name, provinceId: prov.id, communityId: comm.id });
      }
    }
  }
  return results;
}
'''
    OUT.write_text("export const COMMUNITIES = " + payload + ";\n" + suffix, encoding="utf-8")
    print(f"Generado {OUT} con {sum(len(c['provinces']) for c in data)} provincias")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
