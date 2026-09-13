(() => {
  'use strict';

  const vehicles = [
    { id: 'demo-v-1', brand: 'Volkswagen', model: 'Golf', trim: '1.5 TSI Life', year: 2020, km: 68000, price: 16900, fuel: 'Gasolina', status: 'available', statusLabel: 'En venta' },
    { id: 'demo-v-2', brand: 'Toyota', model: 'Corolla', trim: '1.8 Hybrid Active', year: 2021, km: 52400, price: 19500, fuel: 'Híbrido', status: 'reserved', statusLabel: 'Reservado' },
    { id: 'demo-v-3', brand: 'SEAT', model: 'León', trim: '1.5 eTSI Style', year: 2022, km: 38900, price: 20400, fuel: 'Híbrido', status: 'available', statusLabel: 'En venta' },
    { id: 'demo-v-4', brand: 'Peugeot', model: '3008', trim: '1.5 BlueHDi Allure', year: 2021, km: 73500, price: 18800, fuel: 'Diésel', status: 'draft', statusLabel: 'Borrador' },
  ];

  const contacts = [
    { id: 'demo-l-1', initials: 'LM', name: 'Lucía Martín', car: 'Toyota Corolla · Consulta recibida hoy', phase: 'new', phaseLabel: 'Nuevo' },
    { id: 'demo-l-2', initials: 'JP', name: 'Javier Pérez', car: 'Volkswagen Golf · Pidió más información', phase: 'active', phaseLabel: 'En conversación' },
    { id: 'demo-l-3', initials: 'SR', name: 'Sofía Ruiz', car: 'SEAT León · Quiere visitar el vehículo', phase: 'visit', phaseLabel: 'Visita propuesta' },
  ];

  const money = value => `${Number(value || 0).toLocaleString('es-ES')} €`;
  const number = value => Number(value || 0).toLocaleString('es-ES');
  const byId = id => document.getElementById(id);
  const create = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };

  function renderMiniVehicles() {
    const list = byId('overview-vehicle-list');
    if (!list) return;
    list.replaceChildren();
    vehicles.slice(0, 3).forEach(vehicle => {
      const row = create('div', 'demo-mini-row');
      const art = create('span', 'demo-car-art');
      const image = document.createElement('img');
      image.src = 'assets/brand/icons/vehicle-placeholder.svg';
      image.alt = '';
      art.append(image);
      const copy = create('span', 'demo-mini-car-copy');
      copy.append(create('strong', '', `${vehicle.brand} ${vehicle.model}`), create('small', '', `${vehicle.year} · ${number(vehicle.km)} km · ${money(vehicle.price)}`));
      const status = create('span', `demo-status-pill ${vehicle.status}`, vehicle.statusLabel);
      row.append(art, copy, status);
      list.append(row);
    });
  }

  function renderVehicles() {
    const list = byId('demo-vehicle-list');
    if (!list) return;
    const query = (byId('demo-vehicle-search')?.value || '').trim().toLocaleLowerCase('es');
    const activeFilter = document.querySelector('[data-demo-filter][aria-pressed="true"]')?.dataset.demoFilter || 'all';
    const filtered = vehicles.filter(vehicle => {
      const matchesQuery = `${vehicle.brand} ${vehicle.model} ${vehicle.trim}`.toLocaleLowerCase('es').includes(query);
      return matchesQuery && (activeFilter === 'all' || vehicle.status === activeFilter);
    });
    list.replaceChildren();
    if (!filtered.length) {
      list.append(create('p', 'demo-empty-state', 'No hay ejemplos que coincidan. Prueba otra búsqueda o filtro.'));
    }
    filtered.forEach(vehicle => {
      const card = create('article', 'demo-vehicle-card');
      const visual = create('div', 'demo-vehicle-visual');
      const image = document.createElement('img');
      image.src = 'assets/brand/icons/vehicle-placeholder.svg';
      image.alt = '';
      visual.append(image);
      const copy = create('div', 'demo-vehicle-copy');
      const titleRow = create('div', 'demo-vehicle-title-row');
      titleRow.append(create('h3', '', `${vehicle.brand} ${vehicle.model}`), create('span', `demo-status-pill ${vehicle.status}`, vehicle.statusLabel));
      copy.append(titleRow, create('p', '', vehicle.trim), create('strong', 'demo-vehicle-price', money(vehicle.price)));
      const meta = create('div', 'demo-vehicle-meta');
      meta.append(create('span', '', String(vehicle.year)), create('span', '', `${number(vehicle.km)} km`), create('span', '', vehicle.fuel));
      copy.append(meta);
      card.append(visual, copy);
      list.append(card);
    });
    const status = byId('demo-inventory-status');
    if (status) status.textContent = `${filtered.length} ${filtered.length === 1 ? 'vehículo sintético de ejemplo' : 'vehículos sintéticos de ejemplo'}. No hay anuncios reales.`;
  }

  function renderContacts() {
    const list = byId('demo-contact-list');
    if (!list) return;
    list.replaceChildren();
    contacts.forEach(contact => {
      const card = create('article', 'demo-contact-card');
      const person = create('div', 'demo-contact-person');
      person.append(create('span', 'demo-contact-avatar', contact.initials));
      const info = create('span', 'demo-contact-info');
      info.append(create('strong', '', contact.name), create('small', '', contact.car));
      person.append(info);
      const action = create('div', 'demo-contact-action');
      const label = create('label', '', 'Fase de ejemplo');
      const select = document.createElement('select');
      select.dataset.demoLeadStatus = contact.id;
      select.setAttribute('aria-label', `Fase ficticia de ${contact.name}`);
      [['new', 'Nuevo'], ['active', 'En conversación'], ['visit', 'Visita propuesta'], ['closed', 'Cerrado']].forEach(([value, text]) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        select.append(option);
      });
      select.value = contact.phase;
      select.addEventListener('change', () => {
        contact.phase = select.value;
        contact.phaseLabel = select.options[select.selectedIndex].textContent;
        updatePipelineCounts();
        const status = byId('demo-contact-status');
        if (status) status.textContent = `Fase de ejemplo actualizada a «${contact.phaseLabel}». Este cambio no se ha guardado ni enviado.`;
      });
      action.append(label, select);
      card.append(person, action);
      list.append(card);
    });
    updatePipelineCounts();
  }

  function updatePipelineCounts() {
    document.querySelectorAll('[data-phase-count]').forEach(counter => {
      counter.textContent = String(contacts.filter(contact => contact.phase === counter.dataset.phaseCount).length);
    });
  }

  function switchView(view) {
    document.querySelectorAll('[data-panel]').forEach(panel => { panel.hidden = panel.dataset.panel !== view; });
    document.querySelectorAll('[data-view]').forEach(button => {
      const active = button.dataset.view === view;
      button.classList.toggle('is-active', active);
      if (active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    const target = byId(`view-${view}`);
    if (target) target.querySelector('h2')?.focus({ preventScroll: true });
  }

  function updateFinance() {
    const price = Math.max(0, Number(byId('demo-finance-price')?.value) || 0);
    const down = Math.min(price, Math.max(0, Number(byId('demo-finance-down')?.value) || 0));
    const months = Math.max(1, Number(byId('demo-finance-months')?.value) || 48);
    const principal = Math.max(0, price - down);
    const monthlyRate = Math.pow(1 + 0.089, 1 / 12) - 1;
    const payment = principal ? principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months)) : 0;
    const output = byId('demo-finance-output');
    if (output) output.textContent = `${payment.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}/mes`;
  }

  function updatePreview() {
    const brand = (byId('demo-publish-brand')?.value || '').trim() || 'Marca de ejemplo';
    const model = (byId('demo-publish-model')?.value || '').trim() || 'Modelo de ejemplo';
    const year = Math.min(2026, Math.max(1990, Number(byId('demo-publish-year')?.value) || 2021));
    const km = Math.max(0, Number(byId('demo-publish-km')?.value) || 0);
    const price = Math.max(0, Number(byId('demo-publish-price')?.value) || 0);
    const fuel = byId('demo-publish-fuel')?.value || 'Gasolina';
    byId('demo-preview-title').textContent = `${brand} ${model}`;
    byId('demo-preview-specs').textContent = `${number(km)} km · Combustible ${fuel.toLocaleLowerCase('es')}`;
    byId('demo-preview-price').textContent = money(price);
    byId('demo-preview-fuel').textContent = `${fuel.toLocaleUpperCase('es')} · ${year}`;
    byId('demo-preview-status').textContent = 'Previsualización actualizada localmente. No se ha creado ni publicado ningún anuncio.';
  }

  function initialize() {
    renderMiniVehicles();
    renderVehicles();
    renderContacts();
    updateFinance();

    document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => switchView(button.dataset.view)));
    document.querySelectorAll('[data-go-view]').forEach(button => button.addEventListener('click', () => switchView(button.dataset.goView)));
    document.querySelectorAll('[data-demo-filter]').forEach(button => button.addEventListener('click', () => {
      document.querySelectorAll('[data-demo-filter]').forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
      renderVehicles();
    }));
    byId('demo-vehicle-search')?.addEventListener('input', renderVehicles);
    byId('demo-generate-copy')?.addEventListener('click', () => {
      const car = (byId('demo-copy-car').value || '').trim() || 'Este vehículo';
      const detail = (byId('demo-copy-detail').value || '').trim();
      byId('demo-copy-output').textContent = `${car}: una opción de ocasión para conocer con calma.${detail ? ` ${detail}.` : ''} Pide más información y acuerda una visita.`;
    });
    ['demo-finance-price', 'demo-finance-down', 'demo-finance-months'].forEach(id => {
      byId(id)?.addEventListener('input', updateFinance);
      byId(id)?.addEventListener('change', updateFinance);
    });
    byId('demo-preview-button')?.addEventListener('click', updatePreview);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
