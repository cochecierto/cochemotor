import { getBrands, getModels, getYears, getFuels, getVersions, buildVehicleCatalogId } from '../data/vehicles_catalog.js';
import { getCommunities, getProvinces, getMunicipalities } from '../data/spain_territory.js';

const $ = (id) => document.getElementById(id);

function fill(select, items, placeholder, disabled = false) {
  if (!select) return;
  select.innerHTML = `<option value="">${placeholder}</option>` + items.map(item => {
    const primitive = typeof item === 'string' || typeof item === 'number';
    const value = primitive ? item : item.id;
    const label = primitive ? item : item.name;
    return `<option value="${value}">${label}</option>`;
  }).join('');
  select.disabled = disabled || items.length === 0;
}

function fuelLabel(value) {
  return { Petrol: 'Gasolina', PETROL: 'Gasolina', Diesel: 'Diésel', DIESEL: 'Diésel', electric: 'Eléctrico', Electric: 'Eléctrico' }[value] || value;
}

function versionLabel(code, brand, model, fuel) {
  return `${brand} ${model} · ${fuelLabel(fuel)} · Motorización catalogada (código ${code})`;
}

function resetVehicleFrom(level) {
  const order = ['up-model', 'up-version', 'up-year', 'up-fuel'];
  const index = order.indexOf(level);
  order.slice(index).forEach(id => fill($(id), [], 'Selecciona una opción', true));
}

function initVehicleSelectors() {
  const brand = $('up-brand');
  const model = $('up-model');
  const version = $('up-version');
  const year = $('up-year');
  const fuel = $('up-fuel');
  if (!brand) return;
  fill(brand, getBrands(), 'Selecciona marca');
  brand.addEventListener('change', () => {
    resetVehicleFrom('up-model');
    fill(model, getModels(brand.value), 'Selecciona modelo', false);
  });
  model.addEventListener('change', () => {
    resetVehicleFrom('up-version');
    const fuels = getFuels(brand.value, model.value);
    fill(fuel, fuels, 'Selecciona combustible', false);
    fill(version, [], 'Selecciona combustible', true);
  });
  fuel.addEventListener('change', () => {
    const versions = getVersions(brand.value, model.value, fuel.value);
    if (version) {
      version.innerHTML = `<option value="">Selecciona versión / motorización</option>` + versions.map(code => `<option value="${code}">${versionLabel(code, brand.value, model.value, fuel.value)}</option>`).join('');
      version.disabled = versions.length === 0;
    }
  });
  version.addEventListener('change', () => {
    fill(year, getYears(brand.value, model.value), 'Selecciona año', false);
    const id = buildVehicleCatalogId(brand.value, model.value, '', fuel.value, version.value);
    version.dataset.catalogId = id;
  });
}

function initTerritorySelectors() {
  const community = $('up-community');
  const province = $('up-province');
  const municipality = $('up-municipality');
  if (!community) return;
  fill(community, getCommunities(), 'Selecciona comunidad autónoma');
  community.addEventListener('change', () => {
    fill(province, getProvinces(community.value), 'Selecciona provincia', false);
    fill(municipality, [], 'Selecciona provincia', true);
  });
  province.addEventListener('change', () => {
    fill(municipality, getMunicipalities(province.value), 'Selecciona municipio', false);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initVehicleSelectors();
  initTerritorySelectors();
});
