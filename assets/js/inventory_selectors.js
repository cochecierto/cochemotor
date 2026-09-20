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
  return { Petrol: 'Gasolina', petrol: 'Gasolina', PETROL: 'Gasolina', Diesel: 'Diésel', diesel: 'Diésel', DIESEL: 'Diésel', electric: 'Eléctrico', Electric: 'Eléctrico', ELECTRIC: 'Eléctrico', LPG: 'GLP (autogás)', lpg: 'GLP (autogás)', CNG: 'GNC (gas natural)', cng: 'GNC (gas natural)', 'Diesel-electric': 'Híbrido diésel', 'Diesel/Electric': 'Híbrido diésel', 'Petrol-electric': 'Híbrido gasolina', 'PETROL/ELECTRIC': 'Híbrido gasolina' }[value] || value;
}

function versionLabel(code, brand, model, fuel) {
  return `${brand} ${model} · ${fuelLabel(fuel)} · Motorización catalogada (código ${code})`;
}

function resetVehicleFrom(level) {
  const order = ['up-model', 'up-fuel', 'up-version', 'up-year'];
  const index = order.indexOf(level);
  order.slice(index).forEach(id => fill($(id), [], 'Selecciona una opción', true));
}

function initVehicleSelectors() {
  const brand = $('up-brand');
  const model = $('up-model');
  const version = $('up-version');
  const year = $('up-year');
  const fuel = $('up-fuel');
  if (!brand || brand.tagName !== 'SELECT' || !model || model.tagName !== 'SELECT') return;
  fill(brand, getBrands(), 'Selecciona marca');
  brand.addEventListener('change', () => {
    resetVehicleFrom('up-model');
    fill(model, getModels(brand.value), 'Selecciona modelo', false);
  });
  model.addEventListener('change', () => {
    resetVehicleFrom('up-fuel');
    const fuels = getFuels(brand.value, model.value);
    const normalizedFuels = Array.from(new Map(fuels.map(value => [fuelLabel(value), { id:value, name:fuelLabel(value) }])).values());
    fill(fuel, normalizedFuels, 'Selecciona combustible', false);
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
    const currentYear = new Date().getFullYear() + 1;
    const years = Array.from({length: currentYear - 2000 + 1}, (_, index) => currentYear - index);
    fill(year, years, 'Selecciona año', false);
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
