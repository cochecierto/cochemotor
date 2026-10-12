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
  let demoAccountCreated = false;
  let demoPreviewVehicleAdded = false;

  const modulePreviews = {
    copilot: { icon: '€', title: 'Copiloto de Precios · ilustrativo', description: 'Vista de muestra para revisar cómo podría organizarse un análisis de precios.', detail: 'No existe una recomendación conectada a fuentes actuales del mercado.', boundary: 'No consulta anuncios ni datos de mercado en directo; no debe usarse para decidir precios.' },
    orders: { icon: '◎', title: 'Solicitudes · datos ficticios', description: 'Ejemplos visuales de cómo podría organizarse una solicitud de búsqueda.', detail: 'CocheMotor no acepta solicitudes reales durante esta fase de beta.', boundary: 'Los contactos mostrados son ficticios; no hay demanda ni compradores reales.' },
    qr: { icon: '▤', title: 'Cartel Parabrisas QR', description: 'Prepara material para mostrar los datos de un vehículo y facilitar que una persona interesada amplíe la información.', detail: 'El panel permite trabajar con la ficha del vehículo y sus materiales de apoyo.', boundary: 'No se genera un QR funcional ni se publica o imprime ningún cartel desde esta demo.' },
    'deal-room': { icon: '□', title: 'Documentación de operaciones', description: 'Organiza la información y los pasos asociados a una operación para mantener el proceso más claro.', detail: 'La herramienta agrupa elementos de seguimiento y documentación de una operación.', boundary: 'No se cargan documentos reales, no se solicitan firmas y no se crea ninguna operación aquí.' },
    social: { icon: '▦', title: 'Compartir texto manualmente', description: 'Prepara un texto de ejemplo para copiarlo y revisarlo fuera de la demo.', detail: 'La herramienta no tiene conexión con cuentas sociales.', boundary: 'No publica ni envía contenido a redes o grupos.' },
    warranty: { icon: '◇', title: 'Garantías y seguimiento posventa', description: 'Mantén a mano el seguimiento posterior a la venta y la información relacionada con garantías.', detail: 'El módulo está pensado para acompañar tareas posteriores a la entrega del vehículo.', boundary: 'No se registran ventas, garantías ni datos de clientes en esta vista.' },
    referrals: { icon: '↗', title: 'Afiliados B2B', description: 'Consulta herramientas de colaboración y recomendación entre profesionales del sector.', detail: 'El área profesional contempla seguimiento de colaboraciones y referencias B2B.', boundary: 'No se crean invitaciones, referencias ni recompensas reales en esta demo.' },
    'dealer-web': { icon: '○', title: 'Mi página profesional', description: 'Descubre el espacio pensado para presentar el perfil y el inventario de un negocio.', detail: 'El panel profesional permite gestionar la presencia pública del negocio en CocheMotor.', boundary: 'Esta pantalla no publica una página ni modifica un perfil real.' },
  };

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
    const inventoryButton = document.querySelector('[data-view="inventory"] b');
    if (inventoryButton) inventoryButton.textContent = String(vehicles.length);
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

  function switchView(view, source = null) {
    const button = source || document.querySelector(`[data-view="${view}"]`);
    const panelName = button?.dataset.panel || view;
    document.querySelectorAll('.demo-view[data-panel]').forEach(panel => { panel.hidden = panel.dataset.panel !== panelName; });
    document.querySelectorAll('[data-view]').forEach(button => {
      const active = button.dataset.view === view;
      button.classList.toggle('is-active', active);
      if (active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    const module = modulePreviews[button?.dataset.module];
    if (module) {
      byId('module-preview-icon').textContent = module.icon;
      byId('module-preview-title').textContent = module.title;
      byId('module-preview-description').textContent = module.description;
      byId('module-preview-heading').textContent = module.title;
      byId('module-preview-detail').textContent = module.detail;
      byId('module-preview-boundary').textContent = module.boundary;
    }
    const target = byId(panelName === 'module-preview' ? 'view-module-preview' : `view-${panelName}`);
    if (target) target.querySelector('h2')?.focus({ preventScroll: true });
  }

  function updateFinance() {
    const price = Math.max(0, Number(byId('demo-finance-price')?.value) || 0);
    const down = Math.min(price, Math.max(0, Number(byId('demo-finance-down')?.value) || 0));
    const months = Math.max(1, Number(byId('demo-finance-months')?.value) || 48);
    const principal = Math.max(0, price - down);
    const tin = Math.min(100, Math.max(0, Number(byId('demo-finance-tin')?.value) || 0));
    const monthlyRate = tin / 1200;
    const equivalent = Math.pow(1 + monthlyRate, 12) - 1;
    const payment = principal ? (monthlyRate > 0 ? principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months)) : principal / months) : 0;
    const output = byId('demo-finance-output');
    if (output) output.textContent = `${payment.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}/mes`;
    const equivalentOutput = byId('demo-finance-equivalent');
    if (equivalentOutput) equivalentOutput.textContent = `${(equivalent * 100).toLocaleString('es-ES', { maximumFractionDigits: 2 })} %`;
  }

  function updateMargin() {
    const cost = Math.max(0, Number(byId('demo-margin-cost')?.value) || 0);
    const sale = Math.max(0, Number(byId('demo-margin-sale')?.value) || 0);
    const margin = sale - cost;
    const output = byId('demo-margin-output');
    const note = byId('demo-margin-note');
    if (output) output.textContent = `${margin.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })} (${cost ? (margin / cost * 100).toLocaleString('es-ES', { maximumFractionDigits: 1 }) : '—'} % sobre coste)`;
    if (note) note.textContent = margin < 0 ? 'Venta menos coste de adquisición. El resultado es orientativo y no incluye impuestos, preparación, garantía, reparaciones, financiación ni otros gastos.' : 'Venta menos coste de adquisición; no es margen neto. Excluye impuestos, preparación, garantía, reparaciones, financiación y otros gastos.';
  }

  function updatePreview() {
    if (!demoAccountCreated) {
      const status = byId('demo-account-status');
      if (status) status.textContent = 'Simula primero el alta ficticia. No se crearán credenciales ni se guardarán datos.';
      byId('demo-account-create')?.focus();
      return;
    }
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
    const demoVehicle = {
      id: 'demo-local-vehicle', brand, model, trim: `${fuel} · ficha local`, year, km, price, fuel,
      status: 'draft', statusLabel: 'Borrador local'
    };
    const existingVehicle = vehicles.findIndex(vehicle => vehicle.id === demoVehicle.id);
    if (existingVehicle >= 0) vehicles[existingVehicle] = demoVehicle;
    else vehicles.push(demoVehicle);
    demoPreviewVehicleAdded = true;
    byId('demo-preview-publish').disabled = false;
    renderVehicles();
    renderMiniVehicles();
    byId('demo-preview-status').textContent = 'Vehículo sintético añadido a esta sesión. La ficha es una previsualización local: no se guarda ni se publica.';
  }

  function initialize() {
    renderMiniVehicles();
    renderVehicles();
    renderContacts();
    updateFinance();
    updateMargin();

    byId('demo-account-create')?.addEventListener('click', () => {
      demoAccountCreated = true;
      byId('demo-account-status').textContent = 'Alta ficticia completada en memoria. No se han creado credenciales ni enviado datos.';
      byId('demo-account-create').disabled = true;
      document.querySelector('.demo-profile-card small').textContent = 'Cuenta ficticia activa en esta sesión';
    });
    byId('demo-preview-publish')?.addEventListener('click', () => {
      if (!demoPreviewVehicleAdded) return;
      const vehicle = vehicles.find(item => item.id === 'demo-local-vehicle');
      if (vehicle) vehicle.statusLabel = 'Revisión simulada · no pública';
      renderVehicles();
      byId('demo-preview-status').textContent = 'Paso de revisión simulado. La ficha sigue local, no se comparte, publica ni indexa.';
    });

    const photoInput = byId('demo-publish-photos');
    let photoUrls = [];
    photoInput?.addEventListener('change', () => {
      photoUrls.forEach(url => URL.revokeObjectURL(url));
      photoUrls = Array.from(photoInput.files || []).slice(0, 10).map(file => URL.createObjectURL(file));
      const preview = byId('demo-photo-preview');
      if (!preview) return;
      preview.replaceChildren();
      photoUrls.forEach((url, index) => {
        const image = document.createElement('img');
        image.src = url;
        image.alt = `Previsualización local de foto ${index + 1}`;
        image.style.cssText = 'width:72px;height:54px;object-fit:cover;margin:6px;border-radius:6px';
        preview.append(image);
      });
      const note = document.createElement('small');
      note.textContent = `${photoUrls.length} foto(s) en memoria temporal. No se suben ni se guardan.`;
      preview.append(note);
    });
    window.addEventListener('beforeunload', () => photoUrls.forEach(url => URL.revokeObjectURL(url)), { once: true });

    document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => switchView(button.dataset.view, button)));
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
    ['demo-finance-price', 'demo-finance-down', 'demo-finance-months', 'demo-finance-tin'].forEach(id => {
      byId(id)?.addEventListener('input', updateFinance);
      byId(id)?.addEventListener('change', updateFinance);
    });
    ['demo-margin-cost', 'demo-margin-sale'].forEach(id => byId(id)?.addEventListener('input', updateMargin));
    byId('demo-preview-button')?.addEventListener('click', updatePreview);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
