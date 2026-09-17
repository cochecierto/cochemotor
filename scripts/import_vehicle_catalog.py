#!/usr/bin/env python3
"""Importa un CSV de vehículos a un catálogo jerárquico de CocheMotor.

Uso: python scripts/import_vehicle_catalog.py entrada.csv salida.js
Acepta CSV separado por coma o punto y coma. Son válidas columnas con nombres
Aliases aceptados: make/brand, model, year, fuel, version/trim. La aceptación
de un alias no implica que el conjunto DGT esté autorizado o sea compatible.
"""
from __future__ import annotations
import argparse, csv, json, re
from collections import defaultdict
from datetime import date, timezone, datetime
from pathlib import Path
from urllib.parse import urlparse

ALIASES = {
    'brand': {'make','mk','brand','manufacturer','marca'},
    'model': {'model','commercial name','cn','modelo'},
    'year': {'year','model year','registration year','ano','año'},
    'fuel': {'fuel','fuel type','fuel type - primary','ft','combustible'},
    'version': {'version','ve','trim','variant','denomination','versión','version comercial'},
    'category': {'category','vehicle category','body category','categoria','categoría','segment'},
}
EXCLUDED_BRANDS = {'1', 'activity', 'air-brakes', 'allied vehicles ltd', 'avelling barford', 'divisegur catalunya', 'enaire', 'electra jacetana', 'remolques ramirez', 'sin marca', 'toth es fiai'}
BRAND_CANONICAL = {'a.u.d.i.': 'AUDI', 'b.m.w.': 'BMW', 'bmw i': 'BMW', 'chevrolet': 'CHEVROLET', 'jaguar': 'JAGUAR', 'mercedes': 'MERCEDES-BENZ', 'mercedes amg': 'MERCEDES-AMG', 'mercedes-amg': 'MERCEDES-AMG', 'mercedes-benz': 'MERCEDES-BENZ', 'rolls royce': 'ROLLS-ROYCE', 'rolls-royce': 'ROLLS-ROYCE', 'tesla motors': 'TESLA', 'volkswagen, vw': 'VOLKSWAGEN', 'volkswagen v w': 'VOLKSWAGEN', 'volkswagen ag': 'VOLKSWAGEN'}
def norm(s): return re.sub(r'\s+', ' ', str(s or '').strip().lower().replace('_',' '))
def clean_brand(value):
    raw = str(value or '').strip()
    key = norm(raw)
    if key in EXCLUDED_BRANDS: return ''
    return BRAND_CANONICAL.get(key, raw.upper())

FUEL_CANONICAL = {
    'petrol':'Gasolina','gasoline':'Gasolina','gasolina':'Gasolina',
    'diesel':'Diésel','diésel':'Diésel',
    'electric':'Eléctrico','electricity':'Eléctrico','bev':'Eléctrico',
    'petrol-electric':'Híbrido gasolina','petrol/electric':'Híbrido gasolina','hybrid petrol':'Híbrido gasolina',
    'diesel-electric':'Híbrido diésel','diesel/electric':'Híbrido diésel','hybrid diesel':'Híbrido diésel',
    'lpg':'GLP (autogás)','autogas':'GLP (autogás)','cng':'GNC (gas natural)',
}
def clean_fuel(value):
    raw = re.sub(r'\s+', ' ', str(value or '').strip())
    return FUEL_CANONICAL.get(norm(raw), raw)
def pick(headers, names):
    lookup = {norm(h): h for h in headers}
    for n in names:
        if n in lookup: return lookup[n]
    return None

def build_provenance(source_label=None, source_url=None, source_data_as_of=None, source_license=None):
    complete = bool(source_label and source_data_as_of and source_license)
    return {
        'sourceLabel': source_label or 'unknown',
        'sourceUrl': source_url,
        'sourceDataAsOf': source_data_as_of.isoformat() if source_data_as_of else None,
        'license': source_license,
        'generatedAt': datetime.now(timezone.utc).date().isoformat(),
        'provenanceStatus': 'declared-not-verified' if complete else 'incomplete',
    }

def https_url(value):
    parsed = urlparse(value)
    if parsed.scheme != 'https' or not parsed.netloc:
        raise argparse.ArgumentTypeError('La URL de procedencia debe usar HTTPS.')
    return value

def main():
    parser = argparse.ArgumentParser(description='Importa un CSV de vehículos y conserva la procedencia declarada.')
    parser.add_argument('input_csv', type=Path)
    parser.add_argument('output_js', type=Path)
    parser.add_argument('--source-label', default=None, help='Nombre exacto de la fuente; si se omite queda unknown.')
    parser.add_argument('--source-url', type=https_url, default=None, help='URL pública HTTPS de la fuente, si procede.')
    parser.add_argument('--source-data-as-of', type=date.fromisoformat, default=None, help='Fecha de referencia de los datos (AAAA-MM-DD), no fecha de importación.')
    parser.add_argument('--license', dest='source_license', default=None, help='Licencia o condiciones documentadas del conjunto.')
    parser.add_argument('--include-commercial', action='store_true', help='Incluye categorías comerciales además de turismos M1.')
    args = parser.parse_args()
    src, dst = args.input_csv, args.output_js
    with src.open(encoding='utf-8-sig', newline='') as f:
        sample = f.read(4096); f.seek(0)
        dialect = csv.Sniffer().sniff(sample, delimiters=',;\t')
        rows = csv.DictReader(f, dialect=dialect)
        cols = {k: pick(rows.fieldnames or [], v) for k,v in ALIASES.items()}
        missing = [k for k,v in cols.items() if not v and k != 'category']
        if missing: raise SystemExit('Faltan columnas: ' + ', '.join(missing))
        tree = defaultdict(lambda: defaultdict(lambda: {'years': set(), 'fuels': defaultdict(set)}))
        for row in rows:
            brand, model = clean_brand(row[cols['brand']]), row[cols['model']].strip()
            fuel, version = clean_fuel(row[cols['fuel']]), row[cols['version']].strip()
            if not brand or not model or not fuel or not version: continue
            if cols.get('category') and not args.include_commercial:
                category = norm(row[cols['category']])
                if category and category not in {'m1','passenger car','passenger cars','turismo','turismos'}: continue
            year = row[cols['year']].strip()
            item = tree[brand][model]; item['fuels'][fuel].add(version)
            if year.isdigit(): item['years'].add(int(year))
    out = {}
    for brand, models in sorted(tree.items()):
        out[brand] = {}
        for model, item in sorted(models.items()):
            out[brand][model] = {'years': sorted(item['years']), 'fuels': {f: sorted(v) for f,v in sorted(item['fuels'].items())}}
    provenance = build_provenance(args.source_label, args.source_url, args.source_data_as_of, args.source_license)
    suffix = '''
export const VEHICLE_CATALOG_SOURCE = %s;
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
''' % json.dumps(provenance, ensure_ascii=False, indent=2)
    dst.write_text('export const VEHICLES = ' + json.dumps(out, ensure_ascii=False, indent=2) + ';\n' + suffix, encoding='utf-8')
    print(f'Generado {dst}: {len(out)} marcas, {sum(len(v) for v in out.values())} modelos')
if __name__ == '__main__': main()
