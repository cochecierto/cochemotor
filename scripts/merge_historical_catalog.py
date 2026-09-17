#!/usr/bin/env python3
"""Añade generaciones históricas ODbL (desde 2000) al catálogo EEA."""
import csv,json,sys
from pathlib import Path
from import_vehicle_catalog import clean_fuel

def main(src,base,out):
 p=Path(base); text=p.read_text(encoding='utf8'); a=text.index('export const VEHICLES = ')+len('export const VEHICLES = '); b=text.index(';\n\nexport const VEHICLE_CATALOG_SOURCE',a); tree=json.loads(text[a:b])
 with Path(src).open(encoding='utf8',newline='') as f:
  for r in csv.DictReader(f):
   ys=int(r['gen_year_start'] or 0); ye=int(r['gen_year_end'] or ys or 0)
   if ye<2000: continue
   brand=r['make'].strip().upper(); model=r['model'].strip(); ver=r['generation'].strip() or r['engine_label'].strip(); fuel=clean_fuel(r['fuel_type']) or 'No especificado'
   if not brand or not model or not ver: continue
   item=tree.setdefault(brand,{}).setdefault(model,{'years':[],'fuels':{}}); item['years']=sorted(set(item['years'])|set(range(max(2000,ys),min(2026,ye)+1))); item['fuels'].setdefault(fuel,[]).append(ver)
 for ms in tree.values():
  for item in ms.values(): item['fuels']={k:sorted(set(v)) for k,v in item['fuels'].items()}
 prov={'sourceLabel':'EEA + vehicle-makes-models (ODbL)','sourceUrl':'https://github.com/gor3a/vehicle-makes-models','sourceDataAsOf':'2026-09-17','license':'ODbL 1.0; attribution to vehicle-makes-models and autoevolution.com required','historicalMinYear':2000,'provenanceStatus':'declared-not-verified'}
 suffix='export const VEHICLE_CATALOG_SOURCE = '+json.dumps(prov,ensure_ascii=False,indent=2)+';\nexport function getBrands(){return Object.keys(VEHICLES)}\nexport function getModels(b){return VEHICLES[b]?Object.keys(VEHICLES[b]):[]}\nexport function getYears(b,m){return VEHICLES[b]?.[m]?.years||[]}\nexport function getFuels(b,m){return VEHICLES[b]?.[m]?Object.keys(VEHICLES[b][m].fuels):[]}\nexport function getVersions(b,m,f){return VEHICLES[b]?.[m]?.fuels?.[f]||[]}\n'
 Path(out).write_text('export const VEHICLES = '+json.dumps(tree,ensure_ascii=False,indent=2)+';\n'+suffix,encoding='utf8')
 print('brands',len(tree),'models',sum(len(x) for x in tree.values()))
if __name__=='__main__': main(*sys.argv[1:])
