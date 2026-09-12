import { getBrands, getModels } from '../data/vehicles_catalog.js';

const fill = (select, items, placeholder) => {
  if (!select) return;
  select.replaceChildren(new Option(placeholder, ''));
  items.forEach(item => select.add(new Option(item, item)));
  select.disabled = items.length === 0;
};

const initHomeCatalog = () => {
  const brand = document.getElementById('hero-filter-brand');
  const model = document.getElementById('hero-filter-model');
  if (!brand || !model) return;
  fill(brand, getBrands(), 'Todas las marcas');
  fill(model, [], 'Todos los modelos');
  brand.addEventListener('change', () => fill(model, getModels(brand.value), 'Todos los modelos'));
};

document.addEventListener('DOMContentLoaded', initHomeCatalog);
