/**
 * CocheMotor Hub — Interactive Logic & Multi-Module SaaS Core
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
  loadDealerWebSettings();
});

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
}

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

function handleCreateVehicle(event) {
  event.preventDefault();

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
  const highlightsText = document.getElementById('up-highlights').value.trim();

  const demoImages = [
    "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"
  ];
  const finalImg = customImg || demoImages[Math.floor(Math.random() * demoImages.length)];

  const highlights = highlightsText 
    ? highlightsText.split('\n').map(h => h.trim()).filter(Boolean)
    : [
        "Revisión completa de 100 puntos en taller homologado",
        "Diagnosis electrónica OBD sin fallos en centralita",
        "Informe telemático DGT sin cargas ni reservas de dominio",
        "Garantía legal de 12 meses incluida en contrato"
      ];

  const activeUser = CocheMotorStorage.getActiveUser();

  const newVehicle = {
    id: `cm-${Date.now().toString().slice(-4)}`,
    userId: activeUser.id,
    brand,
    model,
    version,
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
    province: activeUser.province,
    community: activeUser.community,
    image: finalImg,
    inspectionScore: "98/100",
    itvDate: "En vigor 2026",
    warranty: "12 Meses Legal",
    dgtStatus: "Informe Limpio (Sin Cargas)",
    highlights,
    stage: "publicado",
    status: "disponible",
    daysInStock: 0,
    clicksCount: 0,
    leadsCount: 0,
    estimatedMarketPrice: price,
  };

  CocheMotorStorage.saveVehicle(newVehicle);
  updateKpis();
  initVehicleDropdowns();

  alert(`✅ ¡Vehículo ${brand} ${model} guardado con éxito en tu inventario!\n\nGenerando al instante los anuncios para Wallapop, WhatsApp y ficha digital...`);

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
              <img src="${car.image}" alt="${car.brand}" class="pipeline-card-img">
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

              <select class="pipeline-select-stage" onchange="changeCarStage('${car.id}', this.value)">
                ${stages.map(s => `
                  <option value="${s.key}" ${s.key === st.key ? 'selected' : ''}>
                    Mover a: ${s.label}
                  </option>
                `).join('')}
              </select>

              <div style="display: flex; gap: 4px; margin-top: 6px;">
                <a href="ficha.html?id=${car.id}" target="_blank" style="flex: 1; text-align: center; font-size: 0.72rem; padding: 4px; background: var(--cm-surface-subtle); border-radius: 4px; color: var(--cm-navy); font-weight: 700; text-decoration: none;">
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
                <a href="https://wa.me/${l.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hola ' + l.buyerName + ', te contacto de CocheMotor por tu consulta sobre el ' + l.vehicleTitle + '. ¿Podemos hablar o agendar prueba?')}" target="_blank" class="btn btn-cyan" style="padding: 6px 12px; font-size: 0.78rem; text-decoration: none;">
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

  const publicFichaUrl = `${window.location.origin}/ficha.html?id=${v.id}`;
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
  window.open(`ficha.html?id=${select.value}`, '_blank');
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
        <img src="${v.image}" alt="${v.brand}" style="width: 80px; height: 60px; object-fit: cover; border-radius: 6px;">
        
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

// 9. Bolsa de Pedidos (Coches a la Carta)
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
          <span style="font-size: 0.82rem; font-weight: 700; color: var(--cm-cyan); background: var(--cm-surface-subtle); padding: 6px 12px; border-radius: 999px;">
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
            ${stock.length ? stock.map(s => `
              <option value="${s.id}">${s.brand} ${s.model} (${s.price.toLocaleString('es-ES')} € - Etiqueta ${s.badge})</option>
            `).join('') : '<option value="">No tienes coches compatibles</option>'}
          </select>
        </div>

        <button class="btn btn-cyan" style="padding: 8px 18px; font-size: 0.88rem;" onclick="postulateVehicleToOrder('${ord.id}')" ${!stock.length ? 'disabled' : ''}>
          🚀 Postular Coche al Comprador
        </button>
      </div>
    </div>
  `).join('');
}

function postulateVehicleToOrder(orderId) {
  const select = document.getElementById(`order-car-select-${orderId}`);
  if (!select || !select.value) {
    alert("Selecciona un coche válido de tu stock para postular.");
    return;
  }
  const vehicleId = select.value;

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

  const fichaUrl = encodeURIComponent(`${window.location.origin}/ficha.html?id=${v.id}`);
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
  if (urlEl) urlEl.innerText = `https://motor.cochecierto.com/?ref=${ref.referralCode}`;
  if (countEl) countEl.innerText = `${ref.referredCount} colegas registrados`;
  if (freeEl) freeEl.innerText = `${ref.freeMonthsEarned} meses (€ ${ref.freeMonthsEarned * 99} ahorro)`;
  if (badgeEl) badgeEl.innerText = ref.isGoldPartner ? '⭐ Gold Partner Verificado' : 'Miembro Estándar';
}

function copyReferralLink() {
  const ref = CocheMotorStorage.getReferralAccount();
  const msg = `¡Hola colega! Te paso la plataforma que estoy usando para publicar mis coches con fichas digitales en 100 puntos y cartelería con QR: CocheMotor.

Regístrate con mi enlace de embajador para tener 60 DÍAS GRATIS (en vez de 30) de la suite completa:
https://motor.cochecierto.com/?ref=${ref.referralCode}`;

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
  const fullUrl = `${window.location.origin}/dealer.html?id=${activeUser.id}`;

  if (titleEl) titleEl.textContent = activeUser.businessName || activeUser.name;
  if (subEl) subEl.textContent = `${sub}.motor.cochecierto.com`;
  if (urlEl) {
    urlEl.textContent = fullUrl;
    urlEl.href = `dealer.html?id=${activeUser.id}`;
  }
  if (btnOpen) {
    btnOpen.href = `dealer.html?id=${activeUser.id}`;
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
  const link = `${window.location.origin}/dealer.html?id=${activeUser.id}`;
  navigator.clipboard.writeText(link);
  alert('¡Enlace de tu web comercial copiado al portapapeles!');
}
