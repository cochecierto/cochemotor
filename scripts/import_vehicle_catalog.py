#!/usr/bin/env python3
"""Importa filas EEA/DGT a un catálogo jerárquico consumible por CocheMotor.

Uso: python scripts/import_vehicle_catalog.py entrada.csv salida.js
Acepta CSV separado por coma o punto y coma. Son válidas columnas con nombres
EEA/DGT equivalentes: make/brand, model, year, fuel, version/trim.
"""
from __future__ import annotations
import csv, json, re, sys
from collections import defaultdict
from pathlib import Path

ALIASES = {
    'brand': {'make','mk','brand','manufacturer','marca'},
    'model': {'model','commercial name','cn','modelo'},
    'year': {'year','model year','registration year','ano','año'},
    'fuel': {'fuel','fuel type','fuel type - primary','ft','combustible'},
    'version': {'version','ve','trim','variant','denomination','versión','version comercial'},
}
EXCLUDED_BRANDS = {'1', 'activity', 'air-brakes', 'allied vehicles ltd', 'avelling barford', 'divisegur catalunya', 'enaire', 'electra jacetana', 'remolques ramirez', 'sin marca', 'toth es fiai'}
BRAND_CANONICAL = {'a.u.d.i.': 'AUDI', 'b.m.w.': 'BMW', 'bmw i': 'BMW', 'chevrolet': 'CHEVROLET', 'jaguar': 'JAGUAR', 'mercedes': 'MERCEDES-BENZ', 'mercedes amg': 'MERCEDES-AMG', 'mercedes-amg': 'MERCEDES-AMG', 'mercedes-benz': 'MERCEDES-BENZ', 'rolls royce': 'ROLLS-ROYCE', 'rolls-royce': 'ROLLS-ROYCE', 'tesla motors': 'TESLA', 'volkswagen, vw': 'VOLKSWAGEN', 'volkswagen v w': 'VOLKSWAGEN', 'volkswagen ag': 'VOLKSWAGEN'}
def norm(s): return re.sub(r'\s+', ' ', str(s or '').strip().lower().replace('_',' '))
def clean_brand(value):
    raw = str(value or '').strip()
    key = norm(raw)
    if key in EXCLUDED_BRANDS: return ''
    return BRAND_CANONICAL.get(key, raw.upper())
def pick(headers, names):
    lookup = {norm(h): h for h in headers}
    for n in names:
        if n in lookup: return lookup[n]
    return None
def main():
    if len(sys.argv) != 3: raise SystemExit('Uso: python scripts/import_vehicle_catalog.py entrada.csv salida.js')
    src, dst = map(Path, sys.argv[1:])
    with src.open(encoding='utf-8-sig', newline='') as f:
        sample = f.read(4096); f.seek(0)
        dialect = csv.Sniffer().sniff(sample, delimiters=',;\t')
        rows = csv.DictReader(f, dialect=dialect)
        cols = {k: pick(rows.fieldnames or [], v) for k,v in ALIASES.items()}
        missing = [k for k,v in cols.items() if not v]
        if missing: raise SystemExit('Faltan columnas: ' + ', '.join(missing))
        tree = defaultdict(lambda: defaultdict(lambda: {'years': set(), 'fuels': defaultdict(set)}))
        for row in rows:
            brand, model = clean_brand(row[cols['brand']]), row[cols['model']].strip()
            fuel, version = row[cols['fuel']].strip(), row[cols['version']].strip()
            if not brand or not model or not fuel or not version: continue
            year = row[cols['year']].strip()
            item = tree[brand][model]; item['fuels'][fuel].add(version)
            if year.isdigit(): item['years'].add(int(year))
    out = {}
    for brand, models in sorted(tree.items()):
        out[brand] = {}
        for model, item in sorted(models.items()):
            out[brand][model] = {'years': sorted(item['years']), 'fuels': {f: sorted(v) for f,v in sorted(item['fuels'].items())}}
    suffix = '''
export const VEHICLE_CATALOG_SOURCE = {
  primary: 'European Environment Agency (EEA) CO2 monitoring',
  secondary: 'Dirección General de Tráfico (DGT) MATRABA',
  updatedAt: new Date().toISOString().slice(0, 10),
  status: 'imported-snapshot'
};
export function getBrands() { return Object.keys(VEHICLES); }
export function getModels(brand) { return VEHICLES[brand] ? Object.keys(VEHICLES[brand]) : []; }
export function getYears(brand, model) { return VEHICLES[brand]?.[model]?.years || []; }
export function getFuels(brand, model) { return VEHICLES[brand]?.[model] ? Object.keys(VEHICLES[brand][model].fuels) : []; }
export function getVersions(brand, model, fuel) { return VEHICLES[brand]?.[model]?.fuels?.[fuel] || []; }
export function buildVehicleCatalogId(brand, model, year, fuel, version) {
  return [brand, model, year, fuel, version].map(value => String(value || '')
    .normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')).join(':');
}
'''
    dst.write_text('export const VEHICLES = ' + json.dumps(out, ensure_ascii=False, indent=2) + ';\n' + suffix, encoding='utf-8')
    print(f'Generado {dst}: {len(out)} marcas, {sum(len(v) for v in out.values())} modelos')
if __name__ == '__main__': main()
