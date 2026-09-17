/**
 * Panel profesional — Interactive Logic & Multi-Module SaaS Core
 * Con Navegación en Sidebar Lateral Izquierda y Aislamiento Multi-Usuario
 */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof CocheMotorStorage === 'undefined' && typeof siteConfig === 'undefined') return;

  initUserSwitcher();
  initVehicleDropdowns();
  updateKpis();
  renderPipelineBoard();
  renderLeadsTable();
  renderCopilotCards();
  renderDemandOrders();
  renderReferralSection();
  runFinancialCalculation();
  renderWindshieldCard();
  initDealRoomDropdowns();
  renderDealRoomsList();
  loadDealerWebSettings();
  initPublishProgress();
});

const MAX_VEHICLE_IMAGES = 10;

function initPublishProgress() {
  const ids = ['up-brand','up-model','up-version','up-year','up-community','up-province','up-municipality','up-price','up-km','up-fuel','up-cost','up-badge'];
  const update = () => { const value = id => document.getElementById(id)?.value?.trim() || ''; const basic = ['up-brand','up-model','up-version','up-year'].filter(id => value(id)).length; const location = ['up-community','up-province','up-municipality'].filter(id => value(id)).length; const photos = document.getElementById('up-image-file')?.files?.length || 0; const consent = document.getElementById('up-contact-consent')?.checked; const progress = document.getElementById('publish-progress'); const margin = document.getElementById('up-margin-preview'); if (progress) progress.textContent = `Datos básicos ${basic}/4 · Ubicación ${location}/3 · Fotos ${photos}/${MAX_VEHICLE_IMAGES} · Consentimiento ${consent ? 'listo' : 'pendiente'}`; const price = Number(value('up-price')); const cost = Number(value('up-cost')); if (margin) margin.textContent = price > 0 && cost > 0 ? `Margen estimado: ${(price - cost).toLocaleString('es-ES')} €` : 'Margen estimado: pendiente'; };
  ids.forEach(id => document.getElementById(id)?.addEventListener('change', update)); ['up-price','up-cost','up-km'].forEach(id => document.getElementById(id)?.addEventListener('input', update)); document.getElementById('up-image-file')?.addEventListener('change', update); document.getElementById('up-contact-consent')?.addEventListener('change', update); update();
}

async function logoutLocalSession() {
  const session = JSON.parse(localStorage.getItem('cochemotor_local_session') || 'null');
  try {
    if (session?.sessionToken) await fetch('/api/auth', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({action: 'logout', session_token: session.sessionToken})});
  } finally {
    localStorage.removeItem('cochemotor_local_session');
    window.location.replace('/acceso');
  }
}

// 1. Selector de Usuario / Concesionario (Multi-Tenant)
function initUserSwitcher() {
  const switcher = document.getElementById('hub-user-switcher');
  const roleBadge = document.getElementById('hub-user-role-badge');
  if (!switcher || !siteConfig.users) return;

  const activeUserId = CocheMotorStorage.getActiveUserId();

  switcher.innerHTML = siteConfig.users.map(u => 
    `<option value="${u.id}" ${u.id === activeUserId ? 'selected' : ''}>${u.avatar} ${u.businessName} (${u.location})</option>`
  ).join('');

  const activeUser = CocheMotorStorage.getActiveUser();
  if (roleBadge && activeUser) {
    roleBadge.innerText = `${activeUser.role} · ${activeUser.location}`;
  }
}

function handleSwitchUser(newUserId) {
  CocheMotorStorage.setActiveUserId(newUserId);
  const activeUser = CocheMotorStorage.getActiveUser();
  const roleBadge = document.getElementById('hub-user-role-badge');
  if (roleBadge && activeUser) {
    roleBadge.innerText = `${activeUser.role} · ${activeUser.location}`;
  }

  // Refrescar todas las vistas con los datos aislados de este usuario
  initVehicleDropdowns();
  updateKpis();
  renderPipelineBoard();
  renderLeadsTable();
  renderCopilotCards();
  renderReferralSection();
  loadDealerWebSettings();
}

// 2. Navegación entre pestañas de la Sidebar
function switchHubTab(tabId) {
  const tabs = [
    'tab-upload',
    'tab-pipeline',
    'tab-generator',
    'tab-copilot',
    'tab-orders',
    'tab-calculator',
    'tab-qr',
    'tab-deal-room',
    'tab-social',
    'tab-warranty',
    'tab-referrals',
    'tab-dealer-web'
  ];

  tabs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = (id === tabId) ? 'block' : 'none';
  });

  const buttons = document.querySelectorAll('.hub-nav-item');
  buttons.forEach(btn => {
    if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(tabId)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  if (tabId === 'tab-pipeline') {
    renderPipelineBoard();
    renderLeadsTable();
  } else if (tabId === 'tab-copilot') {
    renderCopilotCards();
  } else if (tabId === 'tab-orders') {
    renderDemandOrders();
  } else if (tabId === 'tab-deal-room') {
    initDealRoomDropdowns();
    renderDealRoomsList();
  } else if (tabId === 'tab-social') {
    initSocialTab();
  } else if (tabId === 'tab-warranty') {
    initWarrantyTab();
  } else if (tabId === 'tab-generator') {
    initVehicleDropdowns();
    loadVehicleForGenerator();
  }
}

// 3. KPIs del Profesional Activo
function updateKpis() {
  const stock = CocheMotorStorage.getStock();
  const leads = CocheMotorStorage.getLeads();
  const ref = CocheMotorStorage.getReferralAccount();

  const totalCarsEl = document.getElementById('kpi-total-cars');
  const activeLeadsEl = document.getElementById('kpi-active-leads');
  const avgDaysEl = document.getElementById('kpi-avg-days');
  const refFreeEl = document.getElementById('kpi-referrals-free');

  if (totalCarsEl) totalCarsEl.innerText = stock.length;
  if (activeLeadsEl) activeLeadsEl.innerText = leads.length;
  
  if (avgDaysEl) {
    const avg = stock.length ? Math.round(stock.reduce((acc, v) => acc + (v.daysInStock || 0), 0) / stock.length) : 0;
    avgDaysEl.innerText = `${avg} d`;
  }
  if (refFreeEl && ref) {
    refFreeEl.innerText = `${ref.freeMonthsEarned} meses`;
  }
  updateRecommendedAction(stock, leads);
}

function updateRecommendedAction(stock, leads) {
  const text = document.getElementById('hub-next-action-text');
  const button = document.getElementById('hub-next-action-button');
  if (!text || !button) return;
  let message = 'Añade tu primer vehículo para empezar a vender.';
  let tab = 'tab-upload';
  if (stock.some(v => v.stage === 'pendiente_validacion_contacto')) { message = `Tienes ${stock.filter(v => v.stage === 'pendiente_validacion_contacto').length} vehículo(s) pendientes de revisión de contacto.`; tab = 'tab-pipeline'; }
  else if (leads.length) { message = `Tienes ${leads.length} contacto(s) pendiente(s) de respuesta.`; tab = 'tab-pipeline'; }
  else if (stock.length) { message = 'Prepara el anuncio y comparte la ficha del vehículo para conseguir contactos.'; tab = 'tab-generator'; }
  text.textContent = message;
  button.onclick = () => switchHubTab(tab);
  renderFlowRoadmap(stock);
}

function renderFlowRoadmap(stock) {
  const list = document.getElementById('hub-flow-roadmap-steps');
  const status = document.getElementById('hub-flow-roadmap-status');
  if (!list || !status) return;
  const steps = [['captado','Alta'],['pendiente_validacion_contacto','Revisión'],['preparacion','Preparar ficha'],['publicado','Publicado'],['leads_activos','Contacto'],['prueba_en_taller','Cita / reserva'],['vendido','Venta y posventa']];
  const current = stock.length ? Math.max(...stock.map(v => Math.max(0, steps.findIndex(s => s[0] === v.stage)))) : -1;
  status.textContent = stock.length ? `${stock.length} vehículo(s) en proceso` : 'Sin vehículos todavía';
  list.innerHTML = steps.map(([key,label], index) => `<li class="${index < current ? 'is-done' : index === current ? 'is-current' : ''}"><strong>${index + 1}.</strong> ${label}</li>`).join('');
}

function runRecommendedAction() { switchHubTab('tab-upload'); }

// 4. Alta de Vehículo y Asistente
function autoCalculateBadge() {
  const year = parseInt(document.getElementById('up-year').value) || 2020;
  const fuel = document.getElementById('up-fuel').value;
  const badgeSelect = document.getElementById('up-badge');

  if (fuel === '100% Eléctrico' || fuel === 'Híbrido Enchufable (PHEV)') {
    badgeSelect.value = '0';
  } else if (fuel.includes('Híbrido') || fuel.includes('Gas')) {
    badgeSelect.value = 'ECO';
  } else if (fuel === 'Gasolina' && year >= 2006) {
    badgeSelect.value = 'C';
  } else if (fuel === 'Diésel' && year >= 2015) {
    badgeSelect.value = 'C';
  } else {
    badgeSelect.value = 'B';
  }
}

async function compressVehicleImage(file) {
  if (!file) return '';
  if (!file.type.startsWith('image/')) throw new Error('Selecciona un archivo de imagen válido.');
  if (file.size > 8 * 1024 * 1024) throw new Error('La imagen supera el máximo recomendado de 8 MB.');
  const source = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => { const image = new Image(); image.onload = () => resolve(image); image.onerror = () => reject(new Error('No se pudo leer la imagen.')); image.src = reader.result; };
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
    reader.readAsDataURL(file);
  });
  const maxWidth = 1280;
  const scale = Math.min(1, maxWidth / source.width);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(source.width * scale));
  canvas.height = Math.max(1, Math.round(source.height * scale));
  canvas.getContext('2d').drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/webp', 0.78);
}

async function handleCreateVehicle(event) {
  event.preventDefault();

  const localSession = JSON.parse(localStorage.getItem('cochemotor_local_session') || 'null');
  if (!localSession?.verified) {
    alert('Para publicar un coche debes verificar tu correo y entrar con tu cuenta profesional.');
    window.location.href = '/acceso?return=hub';
    return;
  }
  if (!localSession.phone || !localSession.professionalType || !localSession.profileComplete) {
    alert('Completa tu perfil profesional antes de publicar un coche.');
    window.location.href = '/perfil';
    return;
  }

  const brand = document.getElementById('up-brand').value.trim();
  const model = document.getElementById('up-model').value.trim();
  const version = document.getElementById('up-version').value.trim();
  const year = parseInt(document.getElementById('up-year').value);
  const km = document.getElementById('up-km').value.trim();
  const fuel = document.getElementById('up-fuel').value;
  const gearbox = document.getElementById('up-gearbox').value;
  const badge = document.getElementById('up-badge').value;
  const price = parseFloat(document.getElementById('up-price').value);
  const cost = parseFloat(document.getElementById('up-cost').value) || (price * 0.82);
  const customImg = document.getElementById('up-image-url').value.trim();
  const imageFile = document.getElementById('up-image-file')?.files?.[0];
  const highlightsText = document.getElementById('up-highlights').value.trim();
  const communitySelect = document.getElementById('up-community');
  const provinceSelect = document.getElementById('up-province');
  const municipalitySelect = document.getElementById('up-municipality');

  const demoImages = [
    "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"
  ];
  let finalImg = customImg || demoImages[Math.floor(Math.random() * demoImages.length)];
  try {
    if (imageFile) finalImg = await compressVehicleImage(imageFile);
  } catch (error) {
    alert(error.message);
    return;
  }

  const highlights = highlightsText 
    ? highlightsText.split('\n').map(h => h.trim()).filter(Boolean)
    : [
        "Revisión completa de 100 puntos en taller homologado",
        "Diagnosis electrónica OBD sin fallos en centralita",
        "Informe telemático DGT sin cargas ni reservas de dominio",
        "Garantía legal de 12 meses incluida en contrato"
      ];

  const activeUser = CocheMotorStorage.getActiveUser();

  const stageSelect = document.getElementById('up-lifecycle-stage');
  const stage = stageSelect ? stageSelect.value : 'publicado';
  const evidenceSelect = document.getElementById('up-evidence-level');
  const evidenceLevel = evidenceSelect ? evidenceSelect.value : 'verificado_obd';

  const newVehicle = {
    id: `cm-${Date.now().toString().slice(-4)}`,
    userId: activeUser.id,
    brand,
    model,
    version,
    catalogId: (window.CocheMotorVehicleCatalog?.buildVehicleCatalogId || (() => ''))(brand, model, year, fuel, version),
    catalogSource: window.CocheMotorVehicleCatalog?.VEHICLE_CATALOG_SOURCE?.primary || 'CocheMotor catálogo local',
    year,
    km,
    fuel,
    gearbox,
    badge,
    badgeClass: badge === 'ECO' ? 'badge-eco' : badge === '0' ? 'badge-zero' : badge === 'B' ? 'badge-b' : 'badge-c',
    price,
    monthlyPrice: `${Math.round(price * 0.0135)} €/mes`,
    cost,
    dealer: activeUser.businessName,
    sellerName: activeUser.name,
    sellerPhone: activeUser.phone,
    location: activeUser.location,
    community: communitySelect?.selectedOptions[0]?.textContent || activeUser.community,
    communityId: communitySelect?.value || '',
    province: provinceSelect?.selectedOptions[0]?.textContent || activeUser.province,
    provinceId: provinceSelect?.value || '',
    municipality: municipalitySelect?.selectedOptions[0]?.textContent || activeUser.location,
    municipalityId: municipalitySelect?.value || '',
    image: finalImg,
    inspectionScore: "98/100",
    itvDate: "En vigor 2026",
    warranty: "12 Meses Legal",
    dgtStatus: "Informe Limpio (Sin Cargas)",
    highlights,
    stage: stage,
    evidenceLevel: evidenceLevel,
    status: (stage === 'vendido' || stage === 'entregado') ? 'vendido' : (stage === 'reservado' || stage === 'contrato_pendiente') ? 'reservado' : 'disponible',
    daysInStock: 0,
    clicksCount: 0,
    leadsCount: 0,
    estimatedMarketPrice: price,
  };

  CocheMotorStorage.saveVehicle(newVehicle);
  const authSession = JSON.parse(localStorage.getItem('cochemotor_local_session') || 'null');
  fetch('/api/vehicles', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({session_token: authSession?.sessionToken, vehicle: newVehicle}) })
    .then(response => { if (!response.ok) throw new Error('No se pudo sincronizar el vehículo con el broker local.'); })
    .catch(error => console.warn(error.message));
  updateKpis();
  initVehicleDropdowns();

  alert(`Vehículo ${brand} ${model} guardado con éxito en tu inventario.\n\nPreparando los anuncios y la ficha digital...`);

  switchHubTab('tab-generator');
  const genSelect = document.getElementById('gen-vehicle-select');
  if (genSelect) {
    genSelect.value = newVehicle.id;
    loadVehicleForGenerator();
  }
}

// 5. Inicializar Selectores de Coches
function initVehicleDropdowns() {
  const genSelect = document.getElementById('gen-vehicle-select');
  const qrSelect = document.getElementById('qr-vehicle-select');

  const stock = CocheMotorStorage.getStock();
  if (!stock || !stock.length) {
    if (genSelect) genSelect.innerHTML = '<option value="">(No tienes coches en stock aún)</option>';
    if (qrSelect) qrSelect.innerHTML = '<option value="">(No tienes coches en stock aún)</option>';
    return;
  }

  const optionsHtml = stock.map(v => 
    `<option value="${v.id}">${v.brand} ${v.model} (${v.version}) — ${v.price.toLocaleString('es-ES')} €</option>`
  ).join('');

  if (genSelect) genSelect.innerHTML = optionsHtml;
  if (qrSelect) qrSelect.innerHTML = optionsHtml;
}

// 6. Embudo de Ventas Kanban
function renderPipelineBoard() {
  const boardEl = document.getElementById('pipeline-kanban-board');
  if (!boardEl) return;

  const stock = CocheMotorStorage.getStock();

  const stages = [
    { key: "pendiente_validacion_contacto", label: "0. Pendiente de revisión", icon: "🕒" },
    { key: "preparacion", label: "1. En Puesta a Punto", icon: "🔧" },
    { key: "publicado", label: "2. Publicado / Activo", icon: "📢" },
    { key: "leads_activos", label: "3. Leads Activos", icon: "💬" },
    { key: "prueba_en_taller", label: "4. Cita / Prueba", icon: "🚗" },
    { key: "reserva_dgt", label: "5. Reserva / DGT", icon: "📋" },
    { key: "vendido", label: "6. Vendido / Entregado", icon: "🎉" }
  ];

  boardEl.innerHTML = stages.map(st => {
    const carsInStage = stock.filter(v => (v.stage || 'publicado') === st.key);
    
    return `
      <div class="pipeline-col">
        <div class="pipeline-col-header">
          <span class="pipeline-col-title">${st.icon} ${st.label}</span>
          <span class="pipeline-col-badge">${carsInStage.length}</span>
        </div>

        <div style="flex: 1;">
          ${carsInStage.length === 0 ? `
            <div style="font-size: 0.75rem; color: #94a3b8; text-align: center; padding: 24px 8px;">
              Sin coches en esta fase
            </div>
          ` : carsInStage.map(car => `
            <div class="pipeline-card">
              <img src="${car.image}" alt="${car.brand}" class="pipeline-card-img" loading="lazy" decoding="async" width="320" height="180">
              <div class="pipeline-card-title">${car.brand} ${car.model}</div>
              <div class="pipeline-card-price">${car.price.toLocaleString('es-ES')} €</div>
              
              <div class="pipeline-card-meta">
                <span>⏱️ ${car.daysInStock || 0} d en campa</span>
                <span>🔥 ${car.leadsCount || 0} leads</span>
              </div>

              ${car.daysInStock <= 3 && (!car.clicksCount && !car.leadsCount) ? `
                <div style="font-size: 0.7rem; background: #fef3c7; color: #b45309; padding: 2px 4px; border-radius: 3px; margin-top: 4px; font-weight: 700;">
                  ⚠️ 72h sin clics: revisar portada
                </div>
              ` : ''}

              ${car.daysInStock >= 30 ? `
                <div style="font-size: 0.7rem; background: #fee2e2; color: #b91c1c; padding: 2px 4px; border-radius: 3px; margin-top: 4px; font-weight: 700;">
                  🚨 +30d parado: rebajar precio
                </div>
              ` : ''}

              ${st.key === 'pendiente_validacion_contacto' ? `
                <p class="pipeline-pending-note" role="status">🕒 Esperando verificación del contacto. Podrás activar el anuncio cuando CocheMotor lo apruebe.</p>
              ` : `
                <select class="pipeline-select-stage" aria-label="Cambiar fase de ${car.brand} ${car.model}" onchange="changeCarStage('${car.id}', this.value)">
                  ${stages.filter(s => s.key !== 'pendiente_validacion_contacto').map(s => `
                    <option value="${s.key}" ${s.key === st.key ? 'selected' : ''}>Mover a: ${s.label}</option>
                  `).join('')}
                </select>
              `}

              <div style="display: flex; gap: 4px; margin-top: 6px;">
                <a href="/ficha?id=${car.id}" target="_blank" style="flex: 1; text-align: center; font-size: 0.72rem; padding: 4px; background: var(--cm-surface-subtle); border-radius: 4px; color: var(--cm-navy); font-weight: 700; text-decoration: none;">
                  Ver Ficha ↗
                </a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function changeCarStage(vehicleId, newStage) {
  CocheMotorStorage.updateVehicleStage(vehicleId, newStage);
  renderPipelineBoard();
  updateKpis();
}

function renderLeadsTable() {
  const tableEl = document.getElementById('pipeline-leads-table');
  if (!tableEl) return;

  const leads = CocheMotorStorage.getLeads();
  if (!leads.length) {
    tableEl.innerHTML = '<p style="color: var(--cm-text-secondary); font-size: 0.9rem; padding: 12px 0;">No tienes leads recibidos en tus coches por el momento.</p>';
    return;
  }

  tableEl.innerHTML = `
    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem;">
        <thead>
          <tr style="border-bottom: 2px solid var(--cm-border); text-align: left; color: var(--cm-text-secondary); font-size: 0.78rem; text-transform: uppercase;">
            <th style="padding: 10px;">Interesado</th>
            <th style="padding: 10px;">Vehículo</th>
            <th style="padding: 10px;">Pago Previsto</th>
            <th style="padding: 10px;">Coche a Cambio</th>
            <th style="padding: 10px;">Score IA</th>
            <th style="padding: 10px;">Estado</th>
            <th style="padding: 10px; text-align: right;">Acción Directa</th>
          </tr>
        </thead>
        <tbody>
          ${leads.map(l => `
            <tr style="border-bottom: 1px solid var(--cm-border);">
              <td style="padding: 12px 10px; font-weight: 700; color: var(--cm-navy);">
                ${l.buyerName}<br>
                <span style="font-size: 0.75rem; color: var(--cm-text-secondary); font-weight: 400;">${l.phone}</span>
              </td>
              <td style="padding: 12px 10px;">${l.vehicleTitle}</td>
              <td style="padding: 12px 10px;">${l.paymentMethod}</td>
              <td style="padding: 12px 10px;">${l.tradeIn}</td>
              <td style="padding: 12px 10px;">
                <span style="background: rgba(0, 150, 64, 0.12); color: var(--badge-eco-bg); font-weight: 800; padding: 3px 8px; border-radius: 999px; font-size: 0.78rem;">
                  🔥 ${l.score}/100 (${l.scoreTag})
                </span>
              </td>
              <td style="padding: 12px 10px; font-weight: 600;">${l.status}</td>
              <td style="padding: 12px 10px; text-align: right;">
                <a href="https://wa.me/${l.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hola ' + l.buyerName + ', te contacto de CocheMotor por tu consulta sobre el ' + l.vehicleTitle + '. ¿Podemos hablar o agendar prueba?')}" target="_blank" class="btn btn-red" style="padding: 6px 12px; font-size: 0.78rem; text-decoration: none;">
                  💬 WhatsApp
                </a>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// 7. Generador Multicanal IA
function loadVehicleForGenerator() {
  generateVehicleCopy();
}

function generateVehicleCopy() {
  const select = document.getElementById('gen-vehicle-select');
  const channel = document.getElementById('gen-channel').value;
  const tone = document.getElementById('gen-tone').value;
  const outputEl = document.getElementById('gen-output-text');

  if (!select) return;
  const stock = CocheMotorStorage.getStock();
  if (!stock.length) {
    outputEl.innerText = "No tienes coches registrados en tu cuenta todavía. Ve a 'Subir Vehículo' para añadir tu primer coche.";
    return;
  }

  const v = stock.find(item => item.id === select.value) || stock[0];
  if (!v) return;

  const publicFichaUrl = `${window.location.origin}//ficha?id=${v.id}`;
  let text = '';

  if (channel === 'portales') {
    text = `🚗 ${v.brand.toUpperCase()} ${v.model.toUpperCase()} — ${v.version} (${v.year})
📍 ${v.km} | ${v.fuel} | ${v.gearbox} | Distintivo DGT: ${v.badge}

✅ CERTIFICACIÓN MECÁNICA COCHEMOTOR (100 Puntos Periciales):
- Revisión en elevador: Compresión, amortiguadores, frenos y estado de neumáticos superados (${v.inspectionScore || '98/100'}).
- Diagnosis electrónica OBD: Centralita limpia sin códigos de avería.
- Informe oficial DGT: ${v.dgtStatus}. Libre de embargos y cargas.
- ITV al día: ${v.itvDate || 'En vigor'}.
- Garantía mecánica legal: ${v.warranty || '12 Meses Europea incluida en contrato'}.

🔧 PUNTOS DESTACADOS:
${(v.highlights || []).map(h => `• ${h}`).join('\n')}

💰 PRECIO AL CONTADO: ${v.price.toLocaleString('es-ES')} €
💳 FINANCIACIÓN DISPONIBLE: Desde ${v.monthlyPrice} sin entrada obligatoria.
📍 UBICACIÓN Y PRUEBA DINÁMICA: ${v.dealer} (${v.location}). Aceptamos vehículo como parte de pago tras tasación en taller.

👉 Ficha digital completa con fotos HD y peritaje:
${publicFichaUrl}

📲 Contacto directo por WhatsApp para solicitar vídeo en marcha del vano motor o agendar cita.`;
  } 
  else if (channel === 'whatsapp') {
    text = `Hola! Te comparto los detalles del ${v.brand} ${v.model} (${v.version}) que tenemos listo para entrega en campa:

• Año: ${v.year} | Kilómetros: ${v.km}
• Distintivo DGT: Etiqueta ${v.badge} (Apto Zonas Bajas Emisiones)
• Precio al contado: ${v.price.toLocaleString('es-ES')} € (o desde ${v.monthlyPrice})
• Garantía: ${v.warranty || '12 Meses completa'}

El coche pasó 100 puntos de control mecánico y la diagnosis electrónica de motor sin fallos.

Puedes ver la ficha técnica interactiva y las fotos detalladas aquí:
${publicFichaUrl}

¿Te gustaría que te envíe un vídeo corto del motor encendido o prefieres pasar a probarlo esta semana?`;
  }
  else if (channel === 'ficha') {
    text = `FICHA DE HOMOLOGACIÓN COCHEMOTOR — REF: ${v.id.toUpperCase()}
==================================================
VEHÍCULO: ${v.brand} ${v.model}
VERSIÓN: ${v.version}
AÑO DE MATRICULACIÓN: ${v.year}
KILOMETRAJE CERTIFICADO: ${v.km}
DISTINTIVO AMBIENTAL: DGT ${v.badge}
COMBUSTIBLE: ${v.fuel} | TRANSMISIÓN: ${v.gearbox}

AUDITORÍA DE ESTADO:
- Puntuación pericial de taller: ${v.inspectionScore || '98/100'}
- Trazabilidad DGT: Telemáticamente verificado (Sin cargas)
- Cobertura legal: 12 Meses según Ley Consumidores y Usuarios

PRECIO DE VENTA: ${v.price.toLocaleString('es-ES')} €
URL OFICIAL COMPARTIBLE: ${publicFichaUrl}`;
  }
  else if (channel === 'video') {
    text = `🎬 GUIÓN DE VÍDEO CORTO (REELS / TIKTOK / SHORTS)
--------------------------------------------------
[0:00 - 0:03] GANCHO VISUAL:
(Plano detalle arrancando el motor en frío y mostrando el cuadro de mandos con ${v.km} sin testigos).
VOZ EN OFF: "Si estás buscando un ${v.brand} ${v.model} que no te deje tirado a los dos meses, mira esto..."

[0:04 - 0:15] VALOR Y RIGOR TÉCNICO:
(Plano del coche en elevador y mostrando los neumáticos nuevos).
VOZ EN OFF: "Acaba de entrar esta unidad del ${v.year}. Tiene ${v.km} certificados, etiqueta DGT ${v.badge} para entrar al centro sin multas y diagnosis OBD limpia en centralita."

[0:16 - 0:25] PRECIO Y GARANTÍA:
(Plano del interior impecable y pantalla multimedia).
VOZ EN OFF: "Se entrega con 1 año de garantía mecánica legal por escrito y transferencia incluida por ${v.price.toLocaleString('es-ES')} € o desde ${v.monthlyPrice}."

[0:26 - 0:30] LLAMADA A LA ACCIÓN:
(Muestra el cartel de parabrisas con QR).
VOZ EN OFF: "Escríbeme por WhatsApp al enlace de la bio para pasarte el vídeo del motor o agendar prueba en taller."`;
  }

  outputEl.innerText = text;
}

function copyGeneratedText() {
  const text = document.getElementById('gen-output-text').innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert("📋 ¡Texto copiado al portapapeles! Listo para pegar en Wallapop, Coches.net o WhatsApp.");
  });
}

function viewPublicVehiclePage() {
  const select = document.getElementById('gen-vehicle-select');
  if (!select || !select.value) return;
  window.open(`/ficha?id=${select.value}`, '_blank');
}

// 8. Copiloto IA de Precios y Rotación
function renderCopilotCards() {
  const container = document.getElementById('copilot-cards-container');
  if (!container) return;

  const stock = CocheMotorStorage.getStock();
  if (!stock.length) {
    container.innerHTML = '<p style="color: var(--cm-text-secondary); padding: 20px;">No tienes vehículos en stock para analizar.</p>';
    return;
  }

  container.innerHTML = stock.map(v => {
    const days = v.daysInStock || 0;
    const clicks = v.clicksCount || 0;
    const leads = v.leadsCount || 0;
    const marketPrice = v.estimatedMarketPrice || v.price;
    const delta = Math.round(((v.price - marketPrice) / marketPrice) * 100);

    let cardClass = 'healthy';
    let alertBadge = '<span style="color: var(--badge-eco-bg); font-weight: 800;">🟢 Ritmo Saludable</span>';
    let actionTip = 'Rotación adecuada. Continúa respondiendo a los leads entrantes por WhatsApp.';

    if (days <= 3 && clicks === 0 && leads === 0) {
      cardClass = 'alert-72h';
      alertBadge = '<span style="color: #b45309; font-weight: 800;">🟡 Alerta 72h Sin Clics</span>';
      actionTip = '<strong>Acción recomendada:</strong> Cambia la foto principal por una toma frontal exterior con luz natural y añade en el título de Wallapop "Etiqueta ' + v.badge + ' + Garantía 1 Año".';
    } else if (days >= 30) {
      cardClass = 'alert-30d';
      alertBadge = '<span style="color: #b91c1c; font-weight: 800;">🔴 Alerta Crítica (+30 Días)</span>';
      if (delta > 5) {
        actionTip = `<strong>Acción de choque:</strong> El precio está un <strong>${delta}% por encima</strong> de vehículos similares en tu provincia. Ajustar a <strong>${Math.round(marketPrice).toLocaleString('es-ES')} €</strong> y publicar oferta de fin de semana para desbloquear campa.`;
      } else {
        actionTip = '<strong>Acción de choque:</strong> El precio está en rango pero falta interés. Graba un vídeo corto de prueba dinámica para Reels/TikTok y ofrece 1 año de mantenimiento gratuito.';
      }
    }

    return `
      <div class="copilot-card ${cardClass}">
        <img src="${v.image}" alt="${v.brand}" loading="lazy" decoding="async" width="80" height="60" style="width: 80px; height: 60px; object-fit: cover; border-radius: 6px;">
        
        <div>
          <div style="font-weight: 800; font-size: 1.05rem; color: var(--cm-navy);">${v.brand} ${v.model}</div>
          <div style="font-size: 0.85rem; color: var(--cm-text-secondary);">${v.version} · ${v.year}</div>
          <div style="margin-top: 4px;">${alertBadge}</div>
        </div>

        <div style="font-size: 0.82rem; line-height: 1.6; background: var(--cm-surface-subtle); padding: 10px; border-radius: 6px;">
          <div>⏱️ <strong>Días en stock:</strong> ${days} días</div>
          <div>👀 <strong>Clics / Visitas:</strong> ${clicks}</div>
          <div>📩 <strong>Leads recibidos:</strong> ${leads}</div>
          <div>💶 <strong>Vs. Mercado:</strong> ${delta > 0 ? '+' + delta + '%' : delta + '%'}</div>
        </div>

        <div style="font-size: 0.85rem; color: var(--cm-graphite); line-height: 1.5;">
          ${actionTip}
          <div style="margin-top: 8px;">
            <button class="btn btn-outline" style="padding: 4px 10px; font-size: 0.78rem;" onclick="switchHubTab('tab-generator'); document.getElementById('gen-vehicle-select').value='${v.id}'; loadVehicleForGenerator();">
              ✍️ Regenerar Anuncio
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// 9. Bolsa de Pedidos (Coche Ideal)
function renderDemandOrders() {
  const container = document.getElementById('demand-orders-container');
  if (!container) return;

  const orders = CocheMotorStorage.getOrders();
  const stock = CocheMotorStorage.getStock();

  container.innerHTML = orders.map(ord => `
    <div style="background: var(--cm-white); border: 1px solid var(--cm-border); border-radius: var(--cm-radius-md); padding: 24px; margin-bottom: 20px; box-shadow: var(--cm-shadow-sm);">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; margin-bottom: 14px;">
        <div>
          <span class="chapter-badge" style="background: rgba(0, 150, 64, 0.12); color: var(--badge-eco-bg); margin-bottom: 4px;">COMPRADOR VERIFICADO</span>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--cm-navy); margin: 4px 0;">
            ${ord.requiredType} (Presupuesto máx: ${ord.budgetMax.toLocaleString('es-ES')} €)
          </h3>
          <div style="font-size: 0.85rem; color: var(--cm-text-secondary);">
            Solicitado por <strong>${ord.buyerName}</strong> (${ord.location}) · Urgencia: <strong>${ord.urgency}</strong>
          </div>
        </div>

        <div style="text-align: right;">
          <span style="font-size: 0.82rem; font-weight: 700; color: var(--cm-navy); background: var(--cm-surface-subtle); padding: 6px 12px; border-radius: 999px;">
            ${ord.responsesCount || 0} Propuestas enviadas
          </span>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; font-size: 0.85rem; background: var(--cm-surface-subtle); padding: 14px; border-radius: 6px; margin-bottom: 18px;">
        <div>🏷️ <strong>Etiqueta DGT:</strong> ${ord.requiredBadge}</div>
        <div>🚗 <strong>Kilometraje máx:</strong> ${ord.maxKm}</div>
        <div>💳 <strong>Financiación:</strong> ${ord.paymentPlan}</div>
        <div>🔄 <strong>Coche a cambio:</strong> ${ord.tradeIn}</div>
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <label style="font-size: 0.85rem; font-weight: 700; color: var(--cm-navy);">Ofrecer de mi stock:</label>
          <select id="order-car-select-${ord.id}" class="form-control" style="font-size: 0.85rem; padding: 6px 12px; width: auto;">
            ${stock.filter(s => isVehicleCompatible(s, ord)).length ? stock.filter(s => isVehicleCompatible(s, ord)).map(s => `
              <option value="${s.id}">${s.brand} ${s.model} (${s.price.toLocaleString('es-ES')} € - Etiqueta ${s.badge})</option>
            `).join('') : '<option value="">No tienes coches compatibles</option>'}
          </select>
        </div>

        <button class="btn btn-red" style="padding: 8px 18px; font-size: 0.88rem;" onclick="postulateVehicleToOrder('${ord.id}')" ${!stock.some(s => isVehicleCompatible(s, ord)) ? 'disabled' : ''}>
          🚀 Postular Coche al Comprador
        </button>
      </div>
    </div>
  `).join('');
}

function isVehicleCompatible(vehicle, order) {
  const km = Number(String(vehicle.kmNumber ?? vehicle.km ?? '').replace(/[^0-9]/g, '')) || 0;
  const maxKm = Number(String(order.maxKm ?? '').replace(/[^0-9]/g, '')) || Infinity;
  const allowedBadges = String(order.requiredBadge || '').split(/\s+o\s+|,|\//i).map(v => v.trim().toUpperCase()).filter(Boolean);
  return Number(vehicle.price) <= Number(order.budgetMax) && km <= maxKm && (!allowedBadges.length || allowedBadges.includes(String(vehicle.badge || '').toUpperCase()));
}

function postulateVehicleToOrder(orderId) {
  const select = document.getElementById(`order-car-select-${orderId}`);
  if (!select || !select.value) {
    alert("Selecciona un coche válido de tu stock para postular.");
    return;
  }
  const vehicleId = select.value;
  const order = CocheMotorStorage.getOrders().find(item => item.id === orderId);
  const vehicle = CocheMotorStorage.getStock().find(item => item.id === vehicleId);
  if (!order || !vehicle || !isVehicleCompatible(vehicle, order)) {
    alert('Este vehículo no cumple el presupuesto, kilometraje o etiqueta DGT solicitados.');
    return;
  }

  CocheMotorStorage.postulateOrder(orderId, vehicleId);
  renderDemandOrders();
  alert("🎉 ¡Vehículo postulado con éxito al comprador!\n\nSe ha enviado una ficha técnica previa. En cuanto el comprador pulse 'Solicitar contacto', recibirás una alerta directa a tu WhatsApp.");
}

// 10. Calculadora Financiera & Margen
function runFinancialCalculation() {
  const price = parseFloat(document.getElementById('calc-price').value) || 16900;
  const cost = parseFloat(document.getElementById('calc-cost').value) || 13200;
  const downpayment = parseFloat(document.getElementById('calc-downpayment').value) || 0;
  const months = parseInt(document.getElementById('calc-months').value) || 72;
  const tin = parseFloat(document.getElementById('calc-tin').value) || 7.9;

  const financedAmount = Math.max(0, price - downpayment);
  const monthlyRate = (tin / 100) / 12;

  let monthlyPayment = 0;
  if (financedAmount > 0 && monthlyRate > 0) {
    monthlyPayment = (financedAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
  } else if (months > 0) {
    monthlyPayment = financedAmount / months;
  }

  const margin = price - cost;
  const roi = cost > 0 ? (margin / cost) * 100 : 0;

  const resMonthly = document.getElementById('calc-result-monthly');
  const resMargin = document.getElementById('calc-result-margin');
  const resRoi = document.getElementById('calc-result-roi');

  if (resMonthly) resMonthly.innerText = `${Math.round(monthlyPayment).toLocaleString('es-ES')} €/mes`;
  if (resMargin) resMargin.innerText = `${Math.round(margin).toLocaleString('es-ES')} €`;
  if (resRoi) resRoi.innerText = `${roi.toFixed(1)}%`;
}

function copyFinancialQuote() {
  const price = document.getElementById('calc-price').value;
  const downpayment = document.getElementById('calc-downpayment').value;
  const months = document.getElementById('calc-months').value;
  const monthly = document.getElementById('calc-result-monthly').innerText;

  const msg = `Propuesta de Financiación CocheMotor:
• Precio del coche: ${Number(price).toLocaleString('es-ES')} €
• Entrada: ${Number(downpayment).toLocaleString('es-ES')} €
• Plazo: ${months} cuotas
• Cuota estimada: ${monthly} (Garantía legal de 1 año y transferencia incluidas).
¿Te preparo la simulación formal con tu DNI y última nómina?`;

  navigator.clipboard.writeText(msg).then(() => {
    alert("📋 ¡Propuesta de financiación copiada para WhatsApp!");
  });
}

// 11. Ficha de Parabrisas A4 con QR
function renderWindshieldCard() {
  const select = document.getElementById('qr-vehicle-select');
  if (!select) return;

  const stock = CocheMotorStorage.getStock();
  if (!stock.length) return;

  const v = stock.find(item => item.id === select.value) || stock[0];
  if (!v) return;

  document.getElementById('qr-card-title').innerText = `${v.brand.toUpperCase()} ${v.model.toUpperCase()}`;
  document.getElementById('qr-card-version').innerText = v.version;
  document.getElementById('qr-card-year').innerText = v.year;
  document.getElementById('qr-card-km').innerText = v.km;
  document.getElementById('qr-card-fuel').innerText = v.fuel;
  document.getElementById('qr-card-warranty').innerText = v.warranty || '12 Meses';
  document.getElementById('qr-card-price').innerText = `${v.price.toLocaleString('es-ES')} €`;

  const badgeEl = document.getElementById('qr-card-badge');
  badgeEl.innerText = `DGT ${v.badge}`;
  badgeEl.className = `badge-dgt ${v.badgeClass || 'badge-c'}`;

  const fichaUrl = encodeURIComponent(`${window.location.origin}//ficha?id=${v.id}`);
  document.getElementById('qr-img-element').src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${fichaUrl}&color=002D62`;
}

// 12. Programa de Afiliados B2B
function renderReferralSection() {
  const ref = CocheMotorStorage.getReferralAccount();
  if (!ref) return;

  const codeEl = document.getElementById('ref-code-display');
  const urlEl = document.getElementById('ref-full-url');
  const countEl = document.getElementById('ref-stat-count');
  const freeEl = document.getElementById('ref-stat-free');
  const badgeEl = document.getElementById('ref-stat-badge');

  if (codeEl) codeEl.innerText = ref.referralCode;
  if (urlEl) urlEl.innerText = `https://cochemotor.es/?ref=${ref.referralCode}`;
  if (countEl) countEl.innerText = `${ref.referredCount} colegas registrados`;
  if (freeEl) freeEl.innerText = `${ref.freeMonthsEarned} meses (€ ${ref.freeMonthsEarned * 99} ahorro)`;
  if (badgeEl) badgeEl.innerText = ref.isGoldPartner ? '⭐ Gold Partner Verificado' : 'Miembro Estándar';
}

function copyReferralLink() {
  const ref = CocheMotorStorage.getReferralAccount();
  const msg = `¡Hola colega! Te paso la plataforma que estoy usando para publicar mis coches con fichas digitales en 100 puntos y cartelería con QR: CocheMotor.

Regístrate con mi enlace de embajador para tener 60 DÍAS GRATIS (en vez de 30) de la suite completa:
https://cochemotor.es/?ref=${ref.referralCode}`;

  navigator.clipboard.writeText(msg).then(() => {
    alert("📲 ¡Enlace de afiliado copiado al portapapeles! Listo para enviar a tus contactos de compraventa por WhatsApp.");
  });
}


// Función para inicializar y cargar ajustes de la Web Propia del Dealer
function loadDealerWebSettings() {
  const activeUser = CocheMotorStorage.getActiveUser();
  if (!activeUser) return;

  const titleEl = document.getElementById('dealer-web-title');
  const subEl = document.getElementById('dealer-subdomain-display');
  const urlEl = document.getElementById('dealer-url-display');
  const btnOpen = document.getElementById('btn-open-dealer-web');

  const sub = activeUser.subdomain || activeUser.slug || 'taller';
  const fullUrl = `${window.location.origin}//dealer?id=${activeUser.id}`;

  if (titleEl) titleEl.textContent = activeUser.businessName || activeUser.name;
  if (subEl) subEl.textContent = `${sub}.cochemotor.es`;
  if (urlEl) {
    urlEl.textContent = fullUrl;
    urlEl.href = `/dealer?id=${activeUser.id}`;
  }
  if (btnOpen) {
    btnOpen.href = `/dealer?id=${activeUser.id}`;
  }

  // Cargar formulario
  const nameIn = document.getElementById('setting-dealer-name');
  const subIn = document.getElementById('setting-dealer-subdomain');
  const phoneIn = document.getElementById('setting-dealer-phone');
  const addrIn = document.getElementById('setting-dealer-address');
  const schedIn = document.getElementById('setting-dealer-schedule');
  const bioIn = document.getElementById('setting-dealer-bio');

  if (nameIn) nameIn.value = activeUser.businessName || activeUser.name;
  if (subIn) subIn.value = sub;
  if (phoneIn) phoneIn.value = activeUser.phone || '';
  if (addrIn) addrIn.value = activeUser.address || activeUser.location || '';
  if (schedIn) schedIn.value = activeUser.schedule || 'Lunes a Viernes 09:00 - 19:30';
  if (bioIn) bioIn.value = activeUser.bio || '';
}

function saveDealerSettings(event) {
  event.preventDefault();
  const activeUser = CocheMotorStorage.getActiveUser();
  if (!activeUser) return;

  activeUser.businessName = document.getElementById('setting-dealer-name').value.trim();
  activeUser.subdomain = document.getElementById('setting-dealer-subdomain').value.trim().toLowerCase();
  activeUser.phone = document.getElementById('setting-dealer-phone').value.trim();
  activeUser.address = document.getElementById('setting-dealer-address').value.trim();
  activeUser.schedule = document.getElementById('setting-dealer-schedule').value.trim();
  activeUser.bio = document.getElementById('setting-dealer-bio').value.trim();

  // Guardar en siteConfig
  const userIdx = siteConfig.users.findIndex(u => u.id === activeUser.id);
  if (userIdx >= 0) {
    siteConfig.users[userIdx] = activeUser;
  }

  loadDealerWebSettings();
  alert('¡Datos de tu web comercial actualizados correctamente!');
}

function copyDealerWebLink() {
  const activeUser = CocheMotorStorage.getActiveUser();
  const sub = activeUser.subdomain || activeUser.slug || 'taller';
  const fullUrl = `${window.location.origin}//dealer?id=${activeUser.id}`;
  navigator.clipboard.writeText(fullUrl).then(() => {
    alert(`🌐 Enlace a tu web copiado:\n${fullUrl}\n\nPuedes pegarlo en tu perfil de Instagram, Facebook o WhatsApp Business.`);
  });
}

// =========================================================================================
// MÓDULO: EXPEDIENTES DIGITALES & SALA PRIVADA DE OPERACIONES (DEAL ROOM)
// =========================================================================================

function initDealRoomDropdowns() {
  const dealSelect = document.getElementById('deal-vehicle-select');
  if (!dealSelect) return;
  const stock = CocheMotorStorage.getStock();
  dealSelect.innerHTML = stock.map(v => 
    `<option value="${v.id}">${v.brand} ${v.model} (${v.version}) — ${v.price.toLocaleString('es-ES')} €</option>`
  ).join('');

  // Sincronizar precio pactado al cambiar de coche
  dealSelect.onchange = () => {
    const chosen = stock.find(v => v.id === dealSelect.value);
    if (chosen) {
      const priceIn = document.getElementById('deal-agreed-price');
      if (priceIn) priceIn.value = chosen.price;
    }
  };

  if (stock.length > 0) {
    const priceIn = document.getElementById('deal-agreed-price');
    if (priceIn && !priceIn.value) priceIn.value = stock[0].price;
  }
}

function handleCreateDealRoom(event) {
  event.preventDefault();
  const vehicleId = document.getElementById('deal-vehicle-select').value;
  const buyerName = document.getElementById('deal-buyer-name').value.trim();
  const buyerPhone = document.getElementById('deal-buyer-phone').value.trim();
  const agreedPrice = parseFloat(document.getElementById('deal-agreed-price').value);
  const deposit = parseFloat(document.getElementById('deal-deposit').value) || 500;

  const stock = CocheMotorStorage.getStock();
  const vehicle = stock.find(v => v.id === vehicleId) || stock[0];
  const activeUser = CocheMotorStorage.getActiveUser();

  const newRoom = CocheMotorStorage.createDealRoom({
    vehicleId: vehicle.id,
    vehicleTitle: `${vehicle.brand} ${vehicle.model} ${vehicle.version || ''}`.trim(),
    sellerUserId: activeUser.id,
    sellerName: activeUser.businessName || activeUser.name,
    buyerName,
    buyerPhone,
    buyerEmail: `${buyerName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
    agreedPrice,
    depositAmount: deposit,
    depositStatus: "Confirmada (Señal telemática)",
    paymentMethod: "Al contado contra entrega y contrato",
    status: "contrato_preparado",
    contractType: "Profesional a Particular (Conforme a DGT & Ley Consumidores)",
    warrantyMonths: 12,
    warrantyType: "Garantía Mecánica Europea 1 Año",
    dgtStatus: "Informe Favorable Telemático Sin Cargas",
  });

  // Mover el vehículo en el pipeline a "reservado"
  CocheMotorStorage.updateVehicleStage(vehicle.id, 'reservado');
  updateKpis();
  renderPipelineBoard();

  alert(`✅ ¡Expediente Digital creado con éxito para ${buyerName}!\n\nID: ${newRoom.id}\nToken seguro generado para sala privada.`);
  renderDealRoomsList();
  event.target.reset();
  initDealRoomDropdowns();
}

function renderDealRoomsList() {
  const container = document.getElementById('deal-rooms-list');
  const counter = document.getElementById('deal-rooms-counter');
  if (!container) return;

  const rooms = CocheMotorStorage.getDealRooms();
  if (counter) counter.textContent = `${rooms.length} expediente(s) activo(s)`;

  if (rooms.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 32px 16px; color: var(--cm-text-secondary); font-size: 0.9rem;">
        No tienes expedientes abiertos todavía. Pulsa en "Abrir Nuevo Expediente" para preparar una venta con contrato DGT.
      </div>
    `;
    return;
  }

  container.innerHTML = rooms.map(room => {
    const checklistHtml = (room.deliveryChecklist || []).map(ch => `
      <label style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: var(--cm-graphite); margin-bottom: 4px;">
        <input type="checkbox" ${ch.checked ? 'checked' : ''} onchange="toggleChecklistItem('${room.id}', '${ch.item}', this.checked)">
        <span>${ch.item}</span>
      </label>
    `).join('');

    return `
      <div style="border: 1px solid var(--cm-border); border-radius: var(--cm-radius-md); padding: 20px; background: #f8fafc;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; margin-bottom: 14px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-weight: 800; color: var(--cm-navy); font-size: 1.1rem;">${room.vehicleTitle}</span>
              <span style="font-size: 0.72rem; background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 999px; font-weight: 800;">
                Exp: ${room.id}
              </span>
            </div>
            <div style="font-size: 0.85rem; color: var(--cm-text-secondary); margin-top: 4px;">
              👤 Comprador: <strong>${room.buyerName}</strong> (${room.buyerPhone}) · Fecha: ${room.createdAt}
            </div>
          </div>

          <div style="text-align: right;">
            <div style="font-size: 1.3rem; font-weight: 800; color: var(--cm-navy);">
              ${(room.agreedPrice || 0).toLocaleString('es-ES')} €
            </div>
            <span style="font-size: 0.78rem; color: #16a34a; font-weight: 700;">
              Señal: ${(room.depositAmount || 500)} € (${room.depositStatus})
            </span>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 18px; margin-top: 14px; border-top: 1px solid var(--cm-border); padding-top: 14px;">
          <div>
            <h5 style="font-size: 0.82rem; font-weight: 800; text-transform: uppercase; color: var(--cm-navy); margin-bottom: 8px;">
              📋 Checklist de Entrega Oficial (DGT & Taller)
            </h5>
            ${checklistHtml}
          </div>

          <div style="background: white; border: 1px solid var(--cm-border); border-radius: 8px; padding: 14px;">
            <div style="font-size: 0.78rem; font-weight: 800; text-transform: uppercase; color: var(--cm-text-secondary); margin-bottom: 6px;">
              SALA PRIVADA DEL COMPRADOR (DEAL ROOM)
            </div>
            <div style="font-size: 0.78rem; color: var(--cm-graphite); margin-bottom: 10px;">
              Enlace revocable con token seguro para que el comprador revise documentación y acepte condiciones.
            </div>
            <div style="display: flex; gap: 8px; flex-direction: column;">
              <button class="btn btn-navy" style="padding: 8px 12px; font-size: 0.8rem; font-weight: 700;" onclick="copyDealRoomLink('${room.token}')">
                🔗 Copiar Enlace Seguro para WhatsApp
              </button>
              <button class="btn btn-outline" style="padding: 8px 12px; font-size: 0.8rem; font-weight: 700;" onclick="previewContractDGT('${room.id}')">
                📄 Ver Borrador de Contrato DGT
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function toggleChecklistItem(roomId, itemText, isChecked) {
  const rooms = CocheMotorStorage.getDealRooms('all');
  const room = rooms.find(r => r.id === roomId);
  if (room && room.deliveryChecklist) {
    const item = room.deliveryChecklist.find(i => i.item === itemText);
    if (item) item.checked = isChecked;
    CocheMotorStorage.saveAllDealRooms(rooms);
  }
}

function copyDealRoomLink(token) {
  const url = `${window.location.origin}//ficha?deal_token=${token}`;
  navigator.clipboard.writeText(url).then(() => {
    alert(`🔐 ¡Enlace privado de la Deal Room copiado!\n\n${url}\n\nEnvíalo por WhatsApp al comprador para que consulte el expediente telemático de su compra.`);
  });
}

function previewContractDGT(roomId) {
  const room = CocheMotorStorage.getDealRooms('all').find(r => r.id === roomId);
  if (!room) return;

  const printWindow = window.open('', '_blank', 'width=850,height=950');
  if (!printWindow) {
    alert("Por favor, permite las ventanas emergentes para abrir el contrato formal.");
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Contrato Mercantil de Compraventa — ${room.id}</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; font-size: 13px; }
        .header-box { border-bottom: 2px solid #002D62; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
        .contract-title { font-size: 18px; font-weight: 800; color: #002D62; margin: 0; }
        .section-title { font-size: 13px; font-weight: 800; color: #002D62; text-transform: uppercase; margin-top: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; }
        .parties-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 10px; }
        .party-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px; }
        .clause { margin-top: 10px; text-align: justify; }
        .signature-box { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 50px; text-align: center; }
        .signature-line { border-top: 1px solid #64748b; margin-top: 60px; padding-top: 8px; font-weight: 700; font-size: 12px; }
        @media print {
          .no-print { display: none; }
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="margin-bottom: 20px; text-align: right;">
        <button onclick="window.print()" style="background: #002D62; color: white; border: none; padding: 10px 20px; font-weight: bold; border-radius: 6px; cursor: pointer;">
          🖨️ Imprimir / Guardar en PDF
        </button>
      </div>

      <div class="header-box">
        <div>
          <h1 class="contract-title">CONTRATO MERCANTIL DE COMPRAVENTA DE VEHÍCULO USADO</h1>
          <div style="font-size: 11px; color: #64748b;">Conforme a las pautas de la DGT (dgt.es) y Real Decreto Legislativo 1/2007 (Ley de Consumidores)</div>
        </div>
        <div style="text-align: right; font-weight: bold; color: #002D62;">
          EXPEDIENTE: ${room.id}<br>
          <span style="font-size: 11px; font-weight: normal; color: #64748b;">Fecha: ${room.createdAt}</span>
        </div>
      </div>

      <div class="section-title">1. REUNIDOS Y COMPARECIENTES</div>
      <div class="parties-grid">
        <div class="party-card">
          <strong style="color: #002D62;">DE UNA PARTE (VENDEDOR PROFESIONAL):</strong><br>
          Razón Social: <strong>${room.sellerName}</strong><br>
          Actividad: Venta de Vehículos de Ocasión / Taller Mecánico<br>
          Régimen Fiscal: REBU (Régimen Especial Bienes Usados)
        </div>
        <div class="party-card">
          <strong style="color: #002D62;">DE OTRA PARTE (COMPRADOR PARTICULAR):</strong><br>
          Nombre: <strong>${room.buyerName}</strong><br>
          Teléfono: ${room.buyerPhone}<br>
          Email: ${room.buyerEmail || 'Declarado en expediente'}
        </div>
      </div>

      <div class="section-title">2. OBJETO DE LA TRANSMISIÓN</div>
      <p class="clause">
        El vendedor transmite al comprador la propiedad del vehículo de ocasión: <strong>${room.vehicleTitle}</strong>, con informe telemático DGT favorable y sin cargas registrales ni reservas de dominio anotadas.
      </p>

      <div class="section-title">3. PRECIO Y FORMA DE PAGO</div>
      <p class="clause">
        El precio pactado asciende a la cantidad de <strong>${(room.agreedPrice || 0).toLocaleString('es-ES')} EUROS</strong>, habiéndose entregado en concepto de señal/reserva la suma de <strong>${room.depositAmount} EUROS</strong> (${room.depositStatus}), abonándose el resto mediante ${room.paymentMethod}.
      </p>

      <div class="section-title">4. GARANTÍA LEGAL Y ESTADO MECÁNICO</div>
      <p class="clause">
        Conforme al Real Decreto Legislativo 1/2007, el vehículo cuenta con <strong>${room.warrantyMonths} MESES DE GARANTÍA LEGAL EUROPEA</strong> frente a defectos de no conformidad no imputables a desgaste ordinario o mal uso. Se adjunta copia de la diagnosis OBD y el certificado de 100 puntos en elevador de CocheMotor.
      </p>

      <div class="section-title">5. TRÁMITES DE TRANSFERENCIA DGT</div>
      <p class="clause">
        La tramitación del cambio de titularidad se realiza de forma telemática en la Dirección General de Tráfico, entregándose justificante profesional provisional de gestoría válido para circular.
      </p>

      <div class="signature-box">
        <div>
          EL VENDEDOR
          <div class="signature-line">${room.sellerName}</div>
        </div>
        <div>
          EL COMPRADOR
          <div class="signature-line">${room.buyerName}</div>
        </div>
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
}

// =========================================================================================
// MÓDULO: DIFUSIÓN EN REDES SOCIALES & GRUPOS DE FACEBOOK (SPEC 003 / MÓDULO 20)
// =========================================================================================

let currentSocialChannel = 'facebook';

function initSocialTab() {
  const socialSelect = document.getElementById('social-vehicle-select');
  if (!socialSelect) return;
  const stock = CocheMotorStorage.getStock();
  socialSelect.innerHTML = stock.map(v => 
    `<option value="${v.id}">${v.brand} ${v.model} (${v.version}) — ${v.price.toLocaleString('es-ES')} €</option>`
  ).join('');

  renderFacebookGroupsList();
  renderSocialHistory();
  generateSocialCopy();
}

function setSocialChannel(channel, btn) {
  currentSocialChannel = channel;
  ['btn-chan-fb', 'btn-chan-insta', 'btn-chan-wa'].forEach(id => {
    const b = document.getElementById(id);
    if (b) {
      b.classList.remove('btn-red');
      b.classList.add('btn-outline');
    }
  });
  if (btn) {
    btn.classList.remove('btn-outline');
    btn.classList.add('btn-red');
  }
  generateSocialCopy();
}

function generateSocialCopy() {
  const select = document.getElementById('social-vehicle-select');
  const output = document.getElementById('social-copy-output');
  if (!select || !output) return;

  const stock = CocheMotorStorage.getStock();
  const car = stock.find(v => v.id === select.value) || stock[0];
  if (!car) return;

  const activeUser = CocheMotorStorage.getActiveUser();
  const url = `${window.location.origin}//ficha?id=${car.id}&utm_source=${currentSocialChannel}`;

  if (currentSocialChannel === 'facebook') {
    output.value = 
`🚗 ¡NUEVA ENTRADA DISPONIBLE EN TALLER! 🚗
------------------------------------------
🔹 ${car.brand} ${car.model} ${car.version} (${car.year})
🛣️ Kilometraje certificado: ${car.km}
⛽ Motor: ${car.fuel} · ${car.gearbox || 'Manual'}
🏷️ Distintivo ambiental DGT: Etiqueta ${car.badge}

✅ 100 PUNTOS DE CONTROL MECÁNICO EN ELEVADOR
✅ DIAGNOSIS TELEMÁTICA OBD SIN FALLOS (0 DTC)
✅ INFORME DGT LIMPIO (Sin cargas ni embargos)
✅ 1 AÑO DE GARANTÍA LEGAL EUROPEA INCLUIDA

💶 PRECIO PROFESIONAL: ${car.price.toLocaleString('es-ES')} € (Financiación desde ${car.monthlyPrice || 'consultar'})
📍 Ubicación: ${activeUser.businessName} (${car.location || activeUser.location})

📲 Consulta la ficha completa con fotos HD y peritaje pericial:
👉 ${url}`;
  } else if (currentSocialChannel === 'instagram') {
    output.value = 
`🔥 ${car.brand} ${car.model} ${car.year} | Mecánica Certificada en 100 Puntos 🔥

Buscando unidad impecable? Este ${car.model} cuenta con diagnosis OBD limpia, etiqueta DGT ${car.badge} y 12 meses de garantía europea.

💶 ${car.price.toLocaleString('es-ES')} €
📍 ${activeUser.location}
📲 Ficha completa en el link de la bio o por DM.

#CochesSegundaMano #CocheOcasión #${car.brand} #${car.model} #CocheMotor #TallerMecánico #VehículosDeOcasión`;
  } else {
    output.value = 
`🚗 *${car.brand} ${car.model} (${car.year})*
🛣️ ${car.km} · Etiqueta DGT ${car.badge}
✅ 100 Puntos de peritaje · 12M Garantía
💶 *${car.price.toLocaleString('es-ES')} €*

Ver ficha y vídeo de motor en elevador:
${url}`;
  }
}

function copySocialCopy() {
  const output = document.getElementById('social-copy-output');
  if (!output) return;
  output.select();
  navigator.clipboard.writeText(output.value).then(() => {
    alert('📋 ¡Texto optimizado copiado al portapapeles! Listo para pegar en Facebook, Instagram o WhatsApp.');
  });
}

function recordSocialPublication() {
  const select = document.getElementById('social-vehicle-select');
  const stock = CocheMotorStorage.getStock();
  const car = stock.find(v => v.id === select.value) || stock[0];
  const activeUser = CocheMotorStorage.getActiveUser();

  CocheMotorStorage.addSocialPost({
    sellerUserId: activeUser.id,
    vehicleId: car.id,
    vehicleTitle: `${car.brand} ${car.model}`,
    channel: currentSocialChannel,
    groupName: currentSocialChannel === 'facebook' ? 'Grupos de Compraventa VO' : currentSocialChannel === 'instagram' ? 'Feed & Stories' : 'WhatsApp Status',
    status: 'publicado_manual',
  });

  alert('✓ ¡Publicación registrada en el historial comercial!');
  renderSocialHistory();
}

function renderFacebookGroupsList() {
  const container = document.getElementById('facebook-groups-list');
  if (!container) return;
  const groups = CocheMotorStorage.getFacebookGroupsLibrary();

  container.innerHTML = groups.map(g => `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: #f8fafc; border: 1px solid var(--cm-border); border-radius: 8px;">
      <div>
        <div style="font-weight: 700; color: var(--cm-navy); font-size: 0.88rem;">${g.name}</div>
        <div style="font-size: 0.75rem; color: var(--cm-text-secondary);">${g.members} · Ámbito: ${g.province}</div>
      </div>
      <a href="${g.url}" target="_blank" class="btn btn-outline" style="padding: 6px 10px; font-size: 0.78rem; font-weight: 700; text-decoration: none;">
        Abrir Grupo ↗
      </a>
    </div>
  `).join('');
}

function renderSocialHistory() {
  const container = document.getElementById('social-history-table');
  if (!container) return;
  const posts = CocheMotorStorage.getSocialPosts();

  if (posts.length === 0) {
    container.innerHTML = `<div style="text-align: center; padding: 20px; font-size: 0.85rem; color: var(--cm-text-secondary);">No hay publicaciones registradas todavía.</div>`;
    return;
  }

  container.innerHTML = `
    <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
      <thead>
        <tr style="border-bottom: 2px solid var(--cm-border); color: var(--cm-navy);">
          <th style="padding: 8px;">Vehículo</th>
          <th style="padding: 8px;">Canal / Grupo</th>
          <th style="padding: 8px;">Fecha</th>
          <th style="padding: 8px;">Clics</th>
          <th style="padding: 8px;">Estado</th>
        </tr>
      </thead>
      <tbody>
        ${posts.map(p => `
          <tr style="border-bottom: 1px solid var(--cm-border);">
            <td style="padding: 8px; font-weight: 700;">${p.vehicleTitle}</td>
            <td style="padding: 8px;">${p.groupName || p.channel}</td>
            <td style="padding: 8px; color: var(--cm-text-secondary);">${p.publishedAt}</td>
            <td style="padding: 8px; font-weight: 700; color: var(--cm-navy);">${p.clicksTracked || 0} clics</td>
            <td style="padding: 8px;"><span style="background: #dcfce7; color: #166534; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem; font-weight: 700;">✓ Publicado</span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// =========================================================================================
// MÓDULO: GESTIÓN DE GARANTÍAS Y POSVENTA (SPEC 003 / MÓDULO 17)
// =========================================================================================

function initWarrantyTab() {
  const vehicleSelect = document.getElementById('warranty-vehicle-select');
  if (!vehicleSelect) return;
  const stock = CocheMotorStorage.getStock();
  vehicleSelect.innerHTML = stock.map(v => 
    `<option value="${v.id}">${v.brand} ${v.model} (${v.version})</option>`
  ).join('');

  renderWarrantyCases();
}

function handleCreateWarrantyCase(event) {
  event.preventDefault();
  const vehicleId = document.getElementById('warranty-vehicle-select').value;
  const buyerName = document.getElementById('warranty-buyer-name').value.trim();
  const issueType = document.getElementById('warranty-issue-type').value;
  const issueDesc = document.getElementById('warranty-issue-desc').value.trim();

  const stock = CocheMotorStorage.getStock();
  const car = stock.find(v => v.id === vehicleId) || stock[0];
  const activeUser = CocheMotorStorage.getActiveUser();

  const newCase = CocheMotorStorage.addWarrantyCase({
    sellerUserId: activeUser.id,
    vehicleId: car.id,
    vehicleTitle: `${car.brand} ${car.model}`,
    buyerName,
    buyerPhone: "34612345678",
    deliveryDate: new Date().toISOString().split('T')[0],
    warrantyExpirationDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
    claimedIssue: issueDesc,
    issueType,
    assignedWorkshop: activeUser.businessName,
    resolutionNotes: "En evaluación pericial de taller",
  });

  alert(`🛡️ ¡Parte de garantía ${newCase.id} registrado correctamente!\n\nAsignado a: ${activeUser.businessName}`);
  event.target.reset();
  renderWarrantyCases();
}

function renderWarrantyCases() {
  const container = document.getElementById('warranty-cases-list');
  const counter = document.getElementById('warranty-counter');
  if (!container) return;

  const cases = CocheMotorStorage.getWarrantyCases();
  if (counter) counter.textContent = `${cases.length} incidencia(s) registrada(s)`;

  if (cases.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 24px; color: var(--cm-text-secondary); font-size: 0.88rem;">
        No hay incidencias de garantía activas. Todas las unidades operan con normalidad.
      </div>
    `;
    return;
  }

  container.innerHTML = cases.map(c => {
    const isClosed = c.status === 'resuelta' || c.status === 'rechazada_desgaste';
    const typeLabel = c.issueType === 'falta_conformidad' ? '⚠️ Falta de Conformidad (Garantía Legal)' : c.issueType === 'desgaste_ajuste' ? '🔧 Desgaste / Ajuste Menor' : '❌ Mal Uso / Exclusión';

    return `
      <div style="border: 1px solid var(--cm-border); border-radius: var(--cm-radius-md); padding: 18px; background: #f8fafc;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px; margin-bottom: 10px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-weight: 800; color: var(--cm-navy); font-size: 1.05rem;">${c.vehicleTitle}</span>
              <span style="font-size: 0.72rem; background: ${isClosed ? '#dcfce7' : '#fef3c7'}; color: ${isClosed ? '#166534' : '#b45309'}; padding: 2px 8px; border-radius: 999px; font-weight: 800;">
                ${c.status.toUpperCase()}
              </span>
            </div>
            <div style="font-size: 0.82rem; color: var(--cm-text-secondary); margin-top: 4px;">
              👤 Comprador: <strong>${c.buyerName}</strong> (${c.buyerPhone}) · Fecha apertura: ${c.openedAt}
            </div>
          </div>
          <div style="font-size: 0.8rem; background: white; border: 1px solid var(--cm-border); padding: 4px 8px; border-radius: 6px; font-weight: 700; color: var(--cm-navy);">
            Cobertura hasta: ${c.warrantyExpirationDate || '12 meses'}
          </div>
        </div>

        <div style="background: white; border: 1px solid var(--cm-border); border-radius: 6px; padding: 12px; margin-bottom: 12px; font-size: 0.85rem;">
          <div style="font-size: 0.75rem; font-weight: 700; color: #0284c7; margin-bottom: 4px;">TIPO: ${typeLabel}</div>
          <div style="color: var(--cm-graphite);"><strong>Síntoma reportado:</strong> ${c.claimedIssue}</div>
          ${c.resolutionNotes ? `<div style="color: #16a34a; margin-top: 6px;"><strong>Resolución:</strong> ${c.resolutionNotes}</div>` : ''}
        </div>

        <div style="display: flex; gap: 8px; justify-content: flex-end;">
          ${!isClosed ? `
            <button class="btn btn-red" style="padding: 6px 12px; font-size: 0.8rem; font-weight: 700;" onclick="resolveWarrantyModal('${c.id}')">
              ✓ Registrar Reparación / Cierre
            </button>
          ` : `
            <span style="font-size: 0.78rem; color: #16a34a; font-weight: 700;">✓ Incidencia cerrada en conformidad</span>
          `}
        </div>
      </div>
    `;
  }).join('');
}

function resolveWarrantyModal(caseId) {
  const notes = prompt("Indica los trabajos de reparación realizados en el taller:");
  if (notes) {
    CocheMotorStorage.updateWarrantyStatus(caseId, 'resuelta', notes);
    renderWarrantyCases();
    alert("✓ Incidencia resuelta y registrada en el historial del expediente.");
  }
}
