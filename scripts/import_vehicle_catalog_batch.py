#!/usr/bin/env python3
"""Importa el CSV EEA por lotes a SQLite y genera un catálogo jerárquico."""
import argparse,csv,json,sqlite3,re
from pathlib import Path
from datetime import date,datetime,timezone
from import_vehicle_catalog import clean_brand,clean_fuel,norm

def main():
 p=argparse.ArgumentParser(); p.add_argument('csv',type=Path); p.add_argument('db',type=Path); p.add_argument('out',type=Path); p.add_argument('--min-year',type=int,default=2000); p.add_argument('--countries',default=''); a=p.parse_args()
 con=sqlite3.connect(a.db); con.executescript('''DROP TABLE IF EXISTS vehicle_catalog_batch; CREATE TABLE vehicle_catalog_batch(country TEXT,category TEXT,brand TEXT,model TEXT,version TEXT,fuel TEXT,year INTEGER,source TEXT, UNIQUE(country,category,brand,model,version,fuel,year));''')
 countries={norm(x) for x in a.countries.split(',') if norm(x)}; n=dup=0
 with a.csv.open(encoding='utf-8-sig',errors='replace',newline='') as f:
  r=csv.DictReader(f)
  for row in r:
   year=str(row.get('year','')).strip()
   if not year.isdigit() or not a.min_year<=int(year)<=date.today().year+1: continue
   country=str(row.get('Country','')).strip().upper(); cat=str(row.get('Ct','')).strip().upper() or 'M1'
   if countries and norm(country) not in countries: continue
   if cat not in {'M1','PASSENGER CAR','TURISMO'}: continue
   vals=(country,cat,clean_brand(row.get('Mk')),str(row.get('Cn','')).strip(),str(row.get('Ve','')).strip(),clean_fuel(row.get('Ft')),int(year),'EEA CO2 cars and vans')
   if not all(vals[:6]): continue
   try: con.execute('INSERT INTO vehicle_catalog_batch VALUES (?,?,?,?,?,?,?,?)',vals); n+=1
   except sqlite3.IntegrityError: dup+=1
   if n%10000==0: con.commit()
 con.commit(); tree={}
 for country,cat,b,m,v,f,y,s in con.execute('SELECT country,category,brand,model,version,fuel,year,source FROM vehicle_catalog_batch'):
  item=tree.setdefault(b,{}).setdefault(m,{'years':set(),'fuels':{},'countries':set(),'categories':set()}); item['years'].add(y); item['countries'].add(country); item['categories'].add(cat); item['fuels'].setdefault(f,set()).add(v)
 out={}
 for b,ms in sorted(tree.items()):
  out[b]={m:{'years':sorted(x['years']),'fuels':{f:sorted(v) for f,v in sorted(x['fuels'].items())},'countries':sorted(x['countries']),'categories':sorted(x['categories'])} for m,x in sorted(ms.items())}
 prov={'sourceLabel':'EEA CO2 cars and vans','sourceUrl':'https://co2cars.apps.eea.europa.eu/','sourceDataAsOf':'2025-12-31','license':'EEA data licence; verify package metadata before redistribution','generatedAt':datetime.now(timezone.utc).date().isoformat(),'minYear':a.min_year,'duplicateRowsSkipped':dup,'entryCount':n,'provenanceStatus':'declared-not-verified'}
 a.out.write_text('export const VEHICLES = '+json.dumps(out,ensure_ascii=False,indent=2)+';\nexport const VEHICLE_CATALOG_SOURCE = '+json.dumps(prov,ensure_ascii=False,indent=2)+';\nexport function getBrands(){return Object.keys(VEHICLES)}\nexport function getModels(b){return VEHICLES[b]?Object.keys(VEHICLES[b]):[]}\nexport function getYears(b,m){return VEHICLES[b]?.[m]?.years||[]}\nexport function getFuels(b,m){return VEHICLES[b]?.[m]?Object.keys(VEHICLES[b][m].fuels):[]}\nexport function getVersions(b,m,f){return VEHICLES[b]?.[m]?.fuels?.[f]||[]}\n',encoding='utf-8'); print(f'rows={n} duplicates={dup} brands={len(out)}')
if __name__=='__main__': main()
