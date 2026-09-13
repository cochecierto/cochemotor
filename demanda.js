import { getBrands, getModels } from './assets/data/vehicles_catalog.js';
import { getCommunities, getProvinces } from './assets/data/spain_territory.js';

const form = document.getElementById('demand-form');
const $ = (id) => document.getElementById(id);
const brand = $('ci-brand');
const model = $('ci-model');
const otherBrand = $('ci-other-brand');
const otherBrandWrap = $('other-brand-wrap');
const otherModel = $('ci-other-model');
const maxBudget = $('ci-budget-max');
const fuel = $('ci-fuel');
const gearbox = $('ci-gearbox');
const year = $('ci-year');
const community = $('ci-community');
const province = $('ci-province');
const status = $('form-status');
const formSteps = [...document.querySelectorAll('.demand-step')];
const submitButton = $('step-submit');
const categoryGrid = $('demand-categories');
const channelInputs = [...document.querySelectorAll('[data-contact-channel]')];
const selectedCategories = new Set();
let selectedNeed = '';
let currentStep = 1;
let sending = false;

const categories = {
  urban: { label: 'Urbano y utilitario', image: 'category-01-urbano-utilitario.webp', description: 'Compacto y práctico para moverte y aparcar en ciudad.' },
  fastback: { label: 'Fastback', image: 'category-04-fastback.webp', description: 'Confort y diseño para trayectos largos.' },
  family: { label: 'Familiar', image: 'category-05-familiar.webp', description: 'Más espacio para personas y equipaje.' },
  suv: { label: 'SUV y crossover', image: 'category-06-suv-crossover.webp', description: 'Posición elevada y versatilidad diaria.' },
  coupe4x4: { label: 'Coupé deportivo 4x4', image: 'category-07-cope-deportivo-4x4.webp', description: 'Conducción deportiva con tracción total.' },
  offroad: { label: 'Todoterreno', image: 'category-08-todoterreno.webp', description: 'Pensado para caminos y terrenos exigentes.' },
  convertible: { label: 'Descapotable', image: 'category-09-descapotable.webp', description: 'Para disfrutar conduciendo al aire libre.' },
  minivan: { label: 'Monovolumen', image: 'category-10-monovolumen.webp', description: 'Interior amplio y flexible para la familia.' },
  van: { label: 'Furgoneta', image: 'category-11-furgoneta.webp', description: 'Volumen y acceso cómodo para carga o trabajo.' },
  pickup: { label: 'Pickup', image: 'category-12-pickup.webp', description: 'Zona de carga abierta para equipo y trabajo.' },
  camper: { label: 'Autocaravana y camper', image: 'category-13-autocaravana-camper.webp', description: 'Vehículo y alojamiento para viajar a tu ritmo.' },
  motorcycle: { label: 'Moto', image: 'category-14-moto.webp', description: 'Una alternativa ágil de dos ruedas.' }
};

const needs = {
  city: { label: 'Moverme por ciudad', categories: ['urban'] },
  family: { label: 'Familia y espacio', categories: ['family', 'minivan', 'suv'] },
  travel: { label: 'Viajes frecuentes', categories: ['fastback', 'family', 'suv'] },
  adventure: { label: 'Campo y aventura', categories: ['suv', 'offroad', 'coupe4x4'] },
  work: { label: 'Trabajo y carga', categories: ['van', 'pickup'] },
  leisure: { label: 'Ocio y conducción', categories: ['convertible', 'fastback', 'coupe4x4'] },
  camper: { label: 'Viajar con casa', categories: ['camper'] },
  motorcycle: { label: 'Moverme en moto', categories: ['motorcycle'] }
};

function addOptions(select, items, placeholder) {
  select.replaceChildren(new Option(placeholder, ''));
  items.forEach((item) => select.add(new Option(item.name ?? item, item.id ?? item)));
}

addOptions(brand, getBrands(), 'Me da igual');
brand.add(new Option('Otra marca', '__other__'));
addOptions(community, getCommunities(), 'Cualquier zona');
for (let y = new Date().getFullYear() + 1; y >= 1980; y -= 1) year.add(new Option(String(y), String(y)));

function setStatus(message = '', tone = 'error') {
  status.textContent = message;
  if (message) status.dataset.tone = tone;
  else delete status.dataset.tone;
}

function selectedLocation() {
  if (province.value) return province.selectedOptions[0]?.textContent || 'España';
  if (community.value) return community.selectedOptions[0]?.textContent || 'España';
  return 'España · zona por elegir';
}

function currentBrand() {
  return brand.value === '__other__' ? otherBrand.value.trim() : brand.value;
}

function currentModel() {
  return brand.value === '__other__' ? otherModel.value.trim() : model.value;
}

function needCategoryIds() {
  return needs[selectedNeed]?.categories || [];
}

function preferredCategoryId() {
  return needCategoryIds().find((id) => selectedCategories.has(id)) || '';
}

function updateCategoryBadges() {
  const preferred = preferredCategoryId();
  categoryGrid.querySelectorAll('.demand-category').forEach((card) => {
    const input = card.querySelector('input');
    const badge = card.querySelector('.demand-category-badge');
    badge.textContent = input.value === preferred ? 'Recomendado' : input.checked ? 'También encaja' : 'Incluir';
  });
}

function renderCategories() {
  const categoryIds = needCategoryIds();
  categoryGrid.replaceChildren();
  selectedCategories.clear();
  categoryIds.forEach((id, index) => {
    const category = categories[id];
    selectedCategories.add(id);
    const label = document.createElement('label');
    label.className = 'demand-category is-selected';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.value = id;
    input.checked = true;
    input.setAttribute('aria-label', `Incluir ${category.label} en mi búsqueda`);
    const image = document.createElement('img');
    image.src = `assets/images/coche-ideal/categories/${category.image}`;
    image.alt = '';
    image.loading = 'lazy';
    image.decoding = 'async';
    image.width = 480;
    image.height = 270;
    const body = document.createElement('span');
    body.className = 'demand-category-copy';
    const title = document.createElement('strong');
    title.textContent = category.label;
    const description = document.createElement('small');
    description.textContent = category.description;
    body.append(title, description);
    const badge = document.createElement('span');
    badge.className = 'demand-category-badge';
    badge.textContent = index === 0 ? 'Recomendado' : 'Incluir';
    label.append(input, image, body, badge);
    input.addEventListener('change', () => {
      if (input.checked) selectedCategories.add(id);
      else selectedCategories.delete(id);
      label.classList.toggle('is-selected', input.checked);
      updateCategoryBadges();
      updatePreview();
    });
    categoryGrid.append(label);
  });
  $('category-picker').hidden = categoryIds.length === 0;
  updateCategoryBadges();
  updatePreview();
}

function updatePreview() {
  const need = needs[selectedNeed];
  const preferredCategory = categories[preferredCategoryId()];
  const chosenName = [currentBrand(), currentModel()].filter(Boolean).join(' ');
  const previewImage = $('preview-vehicle-image');
  previewImage.src = preferredCategory
    ? `assets/images/coche-ideal/categories/${preferredCategory.image}`
    : 'assets/images/coche-ideal-placeholder.svg';
  previewImage.alt = preferredCategory
    ? `Imagen orientativa de ${preferredCategory.label.toLowerCase()} para tu búsqueda`
    : 'Ilustración orientativa de un coche';
  $('preview-type-label').textContent = preferredCategory ? 'Tipo orientativo' : 'Imagen orientativa';
  $('preview-category-label').textContent = preferredCategory?.label || 'Tu búsqueda empieza aquí';
  $('preview-title').textContent = chosenName || (need?.label ?? 'Tu próximo vehículo');
  $('preview-location').textContent = selectedLocation();
  $('preview-budget').textContent = maxBudget.value && Number(maxBudget.value) > 0
    ? `Presupuesto máximo: ${Number(maxBudget.value).toLocaleString('es-ES')} €`
    : 'Presupuesto: por indicar';
  const tags = [
    ...(need ? [need.label] : []),
    ...[...selectedCategories].map((id) => categories[id]?.label).filter(Boolean),
    fuel.value,
    gearbox.value,
    year.value ? `Desde ${year.value}` : ''
  ].filter(Boolean);
  const target = $('preview-tags');
  target.replaceChildren(...(tags.length ? tags : ['Elige tu necesidad', 'Sin compromiso']).slice(0, 4).map((label) => {
    const chip = document.createElement('span');
    chip.textContent = label;
    return chip;
  }));
}

function clearErrors() {
  document.querySelectorAll('.demand-error').forEach((node) => { node.textContent = ''; });
  form.querySelectorAll('[aria-invalid="true"]').forEach((node) => node.removeAttribute('aria-invalid'));
  setStatus();
}

function showStep(step) {
  currentStep = step;
  formSteps.forEach((node) => { node.hidden = Number(node.dataset.step) !== step; });
  document.querySelectorAll('[data-step-label]').forEach((node) => {
    const index = Number(node.dataset.stepLabel);
    node.classList.toggle('is-current', index === step);
    if (index < step) node.dataset.complete = 'true';
    else delete node.dataset.complete;
  });
  const progress = document.querySelector('.demand-progress');
  progress.setAttribute('aria-valuenow', String(step));
  $('progress-fill').style.width = `${(step / 4) * 100}%`;
  $('step-kicker').textContent = `PASO ${step} DE 4`;
  $('form-title').textContent = ['Empieza por lo que necesitas', 'Ajusta tu búsqueda', 'Elige cómo contactarte', 'Revisa y publica'][step - 1];
  $('step-back').hidden = step === 1;
  $('step-next').hidden = step === 4;
  submitButton.hidden = step !== 4;
  if (step === 4) renderSummary();
  updatePreview();
}

function failField(id, message) {
  const field = $(id);
  if (field) field.setAttribute('aria-invalid', 'true');
  const error = document.querySelector(`[data-error-for="${id}"]`);
  if (error) error.textContent = message;
  field?.focus();
  return false;
}

function validateStep() {
  clearErrors();
  if (currentStep === 1) {
    if (!selectedNeed) { $('need-error').textContent = 'Elige qué uso quieres resolver para ver los tipos que pueden encajar.'; document.querySelector('.demand-need')?.focus(); return false; }
    if (!selectedCategories.size) { $('category-heading').scrollIntoView({ behavior: 'smooth', block: 'center' }); setStatus('Deja al menos un tipo de vehículo para que podamos buscar opciones.'); return false; }
    if (brand.value === '__other__' && !otherBrand.value.trim()) return failField('ci-other-brand', 'Escribe la marca o deja «Me da igual».');
    if (brand.value !== '__other__' && brand.value && !model.value) {
      // Marca sin modelo es válida: amplía las opciones sin bloquear la búsqueda.
    }
    const price = Number(maxBudget.value);
    if (!Number.isFinite(price) || price < 500 || price > 1_000_000) return failField('ci-budget-max', 'Indica un presupuesto máximo entre 500 y 1.000.000 €.');
  }
  if (currentStep === 3) {
    const fullName = $('ci-name').value.trim();
    if (fullName.length < 2) return failField('ci-name', 'Escribe tu nombre.');
    if (!$('ci-email').validity.valid || !$('ci-email').value.trim()) return failField('ci-email', 'Escribe un correo electrónico válido.');
    const selectedChannels = channelInputs.filter((input) => input.checked).map((input) => input.value);
    if (!selectedChannels.length) { $('channel-error').textContent = 'Selecciona al menos un canal de contacto.'; channelInputs[0]?.focus(); return false; }
    if (selectedChannels.some((channel) => ['whatsapp', 'call'].includes(channel)) && !$('ci-phone').value.trim()) return failField('ci-phone', 'Añade un teléfono para WhatsApp o llamadas.');
    const schedule = form.querySelector('[name="contact-schedule"]:checked')?.value || 'flexible';
    if (schedule === 'preferred' && !$('ci-preferred-time').value) return failField('ci-preferred-time', 'Elige la franja horaria que prefieres.');
    if (!$('ci-privacy').checked) { $('ci-privacy').focus(); setStatus('Necesitamos que aceptes la política de privacidad para gestionar la búsqueda.'); return false; }
    if (!$('ci-contact').checked) { $('ci-contact').focus(); setStatus('Para activar la búsqueda y recibir propuestas, necesitamos tu permiso para compartir los canales que has seleccionado.'); return false; }
  }
  return true;
}

function renderSummary() {
  const summary = $('demand-summary');
  const listing = document.createElement('section');
  listing.className = 'demand-summary-block';
  const heading = document.createElement('h3');
  heading.textContent = 'Ficha que verán los profesionales';
  const selectedPreferredCategory = categories[preferredCategoryId()];
  if (selectedPreferredCategory) {
    const feature = document.createElement('div');
    feature.className = 'demand-summary-featured';
    const image = document.createElement('img');
    image.src = `assets/images/coche-ideal/categories/${selectedPreferredCategory.image}`;
    image.alt = `Imagen orientativa de la categoría ${selectedPreferredCategory.label}, elegida como preferente`;
    image.width = 480;
    image.height = 270;
    image.decoding = 'async';
    const copy = document.createElement('div');
    copy.className = 'demand-summary-featured-copy';
    const badge = document.createElement('span');
    badge.className = 'demand-summary-featured-label';
    badge.textContent = 'Tipo preferente';
    const title = document.createElement('strong');
    title.textContent = selectedPreferredCategory.label;
    const description = document.createElement('p');
    description.textContent = selectedPreferredCategory.description;
    copy.append(badge, title, description);
    feature.append(image, copy);
    listing.append(heading, feature);
  } else {
    listing.append(heading);
  }
  const list = document.createElement('ul');
  const listingItems = [
    needs[selectedNeed]?.label,
    [...selectedCategories].map((id) => categories[id]?.label).filter(Boolean).join(', '),
    [currentBrand(), currentModel()].filter(Boolean).join(' '),
    maxBudget.value ? `Hasta ${Number(maxBudget.value).toLocaleString('es-ES')} €` : '',
    fuel.value || 'Combustible indiferente',
    gearbox.value || 'Cambio indiferente',
    year.value ? `Desde ${year.value}` : '',
    selectedLocation()
  ].filter(Boolean);
  listingItems.forEach((label) => { const li = document.createElement('li'); li.textContent = label; list.append(li); });
  listing.append(list);

  const privateBlock = document.createElement('section');
  privateBlock.className = 'demand-summary-private';
  const privateHeading = document.createElement('h3');
  privateHeading.textContent = 'Datos privados y contacto';
  const privateList = document.createElement('ul');
  const channels = channelInputs.filter((input) => input.checked).map((input) => input.nextElementSibling.textContent.trim());
  const scheduleValue = form.querySelector('[name="contact-schedule"]:checked')?.value || 'flexible';
  const preferredLabel = $('ci-preferred-time').selectedOptions[0]?.textContent || '';
  const privateItems = [
    `Nombre: ${$('ci-name').value.trim()}`,
    `Correo: ${$('ci-email').value.trim()}`,
    $('ci-phone').value.trim() ? `Teléfono: ${$('ci-phone').value.trim()}` : '',
    `Alertas por: ${channels.join(', ')}`,
    scheduleValue === 'preferred' ? `Horario: ${preferredLabel}` : 'Horario: libre'
  ].filter(Boolean);
  privateItems.forEach((label) => { const li = document.createElement('li'); li.textContent = label; privateList.append(li); });
  const privateNote = document.createElement('p');
  privateNote.textContent = 'Estos datos no aparecerán en la ficha pública. Has autorizado compartir tu nombre y solo los datos necesarios para los canales elegidos con profesionales que tengan una oferta relacionada con esta búsqueda.';
  privateBlock.append(privateHeading, privateList, privateNote);
  summary.replaceChildren(listing, privateBlock);
}

function collectRequest() {
  const provinceName = province.value ? province.selectedOptions[0]?.textContent || '' : '';
  const communityName = community.value ? community.selectedOptions[0]?.textContent || '' : '';
  const matchedCategories = [...selectedCategories];
  return {
    vehicle: {
      brand: currentBrand(),
      model: currentModel(),
      version: '',
      year: year.value ? Number(year.value) : null,
      fuel: fuel.value || 'Indiferente'
    },
    preferences: {
      need: { id: selectedNeed, label: needs[selectedNeed].label },
      matchedCategories,
      matchingStrategy: 'rules-v1',
      budgetMin: null,
      budgetMax: Number(maxBudget.value),
      fuel: fuel.value || 'Indiferente',
      gearbox: gearbox.value || 'Indiferente',
      minYear: year.value ? Number(year.value) : null,
      bodyType: categories[matchedCategories[0]]?.label || '',
      timing: 'Indiferente',
      communityId: community.value || '',
      community: communityName,
      provinceId: province.value || '',
      province: provinceName,
      acceptsNearby: $('ci-location-flexible').checked
    },
    contact: {
      name: $('ci-name').value.trim(),
      email: $('ci-email').value.trim(),
      phone: $('ci-phone').value.trim(),
      channels: channelInputs.filter((input) => input.checked).map((input) => input.value),
      schedule: form.querySelector('[name="contact-schedule"]:checked')?.value || 'flexible',
      preferredTime: form.querySelector('[name="contact-schedule"]:checked')?.value === 'preferred' ? $('ci-preferred-time').value : '',
      communityId: community.value || '',
      provinceId: province.value || '',
      province: provinceName,
      municipalityId: ''
    },
    consent: { privacy: $('ci-privacy').checked, contact: $('ci-contact').checked },
    consentVersion: 'coche-ideal-v4',
    website: $('ci-website').value.trim()
  };
}

document.querySelectorAll('.demand-need').forEach((button) => button.addEventListener('click', () => {
  selectedNeed = button.dataset.need;
  $('need-error').textContent = '';
  document.querySelectorAll('.demand-need').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
  renderCategories();
}));

function updateContactControls() {
  const all = $('channel-all');
  all.checked = channelInputs.length > 0 && channelInputs.every((input) => input.checked);
  const needsPhone = channelInputs.some((input) => input.checked && ['whatsapp', 'call'].includes(input.value));
  $('ci-phone').required = needsPhone;
  $('phone-optional-note').textContent = needsPhone ? 'obligatorio para el canal elegido' : 'opcional';
  const schedule = form.querySelector('[name="contact-schedule"]:checked')?.value || 'flexible';
  $('preferred-time-wrap').hidden = schedule !== 'preferred';
  $('ci-preferred-time').required = schedule === 'preferred';
}

channelInputs.forEach((input) => input.addEventListener('change', () => {
  $('channel-error').textContent = '';
  updateContactControls();
}));
$('channel-all').addEventListener('change', () => {
  channelInputs.forEach((input) => { input.checked = $('channel-all').checked; });
  $('channel-error').textContent = '';
  updateContactControls();
});
form.querySelectorAll('[name="contact-schedule"]').forEach((input) => input.addEventListener('change', updateContactControls));
updateContactControls();

brand.addEventListener('change', () => {
  const isOther = brand.value === '__other__';
  otherBrandWrap.hidden = !isOther;
  model.hidden = isOther;
  model.disabled = isOther || !brand.value;
  otherModel.hidden = !isOther;
  model.replaceChildren(new Option(isOther ? 'Escribe tu modelo' : 'Elige un modelo', ''));
  if (brand.value && !isOther) addOptions(model, getModels(brand.value), 'Me da igual');
  updatePreview();
});
otherBrand.addEventListener('input', updatePreview);
otherModel.addEventListener('input', updatePreview);
model.addEventListener('change', updatePreview);
maxBudget.addEventListener('input', updatePreview);
[fuel, gearbox, year].forEach((field) => field.addEventListener('change', updatePreview));
community.addEventListener('change', () => {
  const available = community.value ? getProvinces(community.value) : [];
  addOptions(province, available, community.value ? 'Elige una provincia' : 'Cualquier provincia');
  province.disabled = !community.value;
  updatePreview();
});
province.addEventListener('change', updatePreview);
document.querySelectorAll('[data-budget]').forEach((button) => button.addEventListener('click', () => {
  maxBudget.value = button.dataset.budget;
  updatePreview();
  maxBudget.focus();
}));

$('step-next').addEventListener('click', () => {
  if (!validateStep()) return;
  showStep(Math.min(4, currentStep + 1));
  $('form-title').scrollIntoView({ behavior: 'smooth', block: 'center' });
});
$('step-back').addEventListener('click', () => { clearErrors(); showStep(Math.max(1, currentStep - 1)); });

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (sending || !validateStep()) return;
  if ($('ci-website').value.trim()) return;
  sending = true;
  submitButton.disabled = true;
  submitButton.textContent = 'Enviando…';
  const request = collectRequest();
  try {
    const response = await fetch('/api/coche-ideal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(request),
      credentials: 'same-origin'
    });
    const result = await response.json().catch(() => ({}));
    if (response.status === 409 || result.duplicate) {
      setStatus('Ya recibimos una búsqueda muy parecida recientemente. Revisa tu correo o vuelve atrás si tus preferencias han cambiado.', 'info');
      submitButton.disabled = false;
      submitButton.textContent = 'Volver a intentarlo';
      sending = false;
      return;
    }
    if (!response.ok || result.ok !== true) throw new Error(result.error || 'No se pudo guardar la búsqueda.');
    setStatus('¡Listo! Hemos recibido tu búsqueda. Si encontramos una opción que encaje, te escribiremos.', 'success');
    submitButton.textContent = 'Búsqueda enviada';
    formSteps.forEach((node) => { node.hidden = true; });
    $('step-back').hidden = true;
    $('step-next').hidden = true;
    document.querySelector('.demand-progress').hidden = true;
    document.querySelector('.demand-step-labels').hidden = true;
    document.querySelector('.demand-privacy-note').textContent = 'La solicitud se ha guardado. No has reservado ni comprado ningún vehículo.';
    form.dataset.submitted = 'true';
  } catch (_) {
    setStatus('No hemos podido guardar la búsqueda ahora. Tus datos siguen en este formulario; inténtalo de nuevo en unos minutos.');
    submitButton.disabled = false;
    submitButton.textContent = 'Volver a intentarlo';
    sending = false;
  }
});

showStep(1);
