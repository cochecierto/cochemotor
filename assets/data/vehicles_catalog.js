export const VEHICLES = {
  "Seat": {
    "Leon": {
      "years": [2020, 2021, 2022, 2023],
      "fuels": {
        "Gasolina": ["1.0 TSI", "1.5 TSI"],
        "Diésel": ["1.6 TDI"]
      }
    },
    "Ibiza": {
      "years": [2019, 2020, 2021],
      "fuels": {
        "Gasolina": ["1.0 TSI"],
        "Diésel": ["1.6 TDI"]
      }
    }
  },
  "Volkswagen": {
    "Golf": {
      "years": [2018, 2019, 2020, 2021, 2022],
      "fuels": {
        "Gasolina": ["1.5 TSI", "2.0 TSI"],
        "Diésel": ["2.0 TDI"],
        "Híbrido (HEV)": ["eHybrid"],
        "Híbrido Enchufable (PHEV)": ["GTE"]
      }
    },
    "Polo": {
      "years": [2019, 2020, 2021],
      "fuels": {
        "Gasolina": ["1.0 TSI"]
      }
    }
  },
  "Toyota": {
    "Corolla": {
      "years": [2020, 2021, 2022],
      "fuels": {
        "Gasolina": ["1.8 Hybrid"],
        "Híbrido (HEV)": ["Hybrid"],
        "100% Eléctrico": ["bZ4X"]
      }
    },
    "Yaris": {
      "years": [2019, 2020, 2021],
      "fuels": {
        "Gasolina": ["1.5"],
        "Híbrido (HEV)": ["Hybrid"]
      }
    }
  },
  "Audi": {
    "A3": {
      "years": [2020, 2021, 2022],
      "fuels": {
        "Gasolina": ["1.5 TFSI"],
        "Diésel": ["2.0 TDI"]
      }
    }
  },
  "Ford": {
    "Focus": {
      "years": [2019, 2020, 2021],
      "fuels": {
        "Gasolina": ["1.5 EcoBoost"],
        "Diésel": ["1.5 TDCi"]
      }
    }
  }
};

// Contrato estable del catálogo. Los datos ampliados se generan con
// scripts/import_vehicle_catalog.py y conservan la fuente de cada registro.
export const VEHICLE_CATALOG_SOURCE = {
  primary: 'European Environment Agency (EEA) CO2 monitoring',
  secondary: 'Dirección General de Tráfico (DGT) MATRABA',
  updatedAt: '2026-09-12',
  status: 'fixture-ready-for-import'
};

export function getBrands() { return Object.keys(VEHICLES); }
export function getModels(brand) { return VEHICLES[brand] ? Object.keys(VEHICLES[brand]) : []; }
export function getYears(brand, model) { return VEHICLES[brand] && VEHICLES[brand][model] ? VEHICLES[brand][model].years : []; }
export function getFuels(brand, model) { return VEHICLES[brand] && VEHICLES[brand][model] ? Object.keys(VEHICLES[brand][model].fuels) : []; }
export function getVersions(brand, model, fuel) { return (VEHICLES[brand] && VEHICLES[brand][model] && VEHICLES[brand][model].fuels[fuel]) ? VEHICLES[brand][model].fuels[fuel] : []; }

export function buildVehicleCatalogId(brand, model, year, fuel, version) {
  return [brand, model, year, fuel, version].map(value => String(value || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')).join(':');
}

export function getVehicleOptions(brand, model, fuel, version) {
  return { brand, model, fuel, version, years: getYears(brand, model), catalogSource: VEHICLE_CATALOG_SOURCE.primary };
}

if (typeof window !== 'undefined') {
  window.CocheMotorVehicleCatalog = { VEHICLES, VEHICLE_CATALOG_SOURCE, buildVehicleCatalogId, getVehicleOptions };
}
