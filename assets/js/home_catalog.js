const fill = (select, items, placeholder) => {
  if (!select) return;
  select.replaceChildren(new Option(placeholder, ''));
  items.forEach(item => select.add(new Option(item, item)));
  select.disabled = items.length === 0;
};

let catalogPromise;
const loadCatalog = () => catalogPromise || (catalogPromise = import('../data/vehicles_catalog.js?v=20260914.1'));

const initHomeCatalog = () => {
  const brand = document.getElementById('hero-filter-brand');
  const model = document.getElementById('hero-filter-model');
  if (!brand || !model) return;
  fill(brand, [], 'Cargando marcas…');
  brand.disabled = false;
  fill(model, [], 'Selecciona una marca');
  const ready = async () => {
    if (brand.dataset.catalogReady === 'true') return;
    brand.dataset.catalogLoading = 'true';
    const previous = brand.value;
    try {
      const catalog = await loadCatalog();
      fill(brand, catalog.getBrands(), 'Todas las marcas');
      brand.value = catalog.getBrands().includes(previous) ? previous : '';
      brand.dataset.catalogReady = 'true';
      brand.dataset.catalogLoading = 'false';
      fill(model, brand.value ? catalog.getModels(brand.value) : [], brand.value ? 'Todos los modelos' : 'Selecciona una marca');
    } catch (_) {
      fill(brand, [], 'No se pudieron cargar las marcas');
      brand.disabled = true;
    }
  };
  brand.addEventListener('focus', ready);
  brand.addEventListener('pointerdown', ready);
  brand.addEventListener('change', async () => {
    try {
      const catalog = await loadCatalog();
      fill(model, catalog.getModels(brand.value), 'Todos los modelos');
    } catch (_) { fill(model, [], 'No se pudieron cargar los modelos'); }
  });
  const schedule = window.requestIdleCallback || ((callback) => window.setTimeout(callback, 1200));
  schedule(() => { void ready(); }, { timeout: 1800 });
};

document.addEventListener('DOMContentLoaded', initHomeCatalog);
