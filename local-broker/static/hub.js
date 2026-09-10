/**
 * CocheMotor Hub — Interactive Logic
 * Herramientas SaaS para Talleres y Compraventas (Inspirado en Inmobia360)
 */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof siteConfig === 'undefined') return;

  initVehicleDropdowns();
  runFinancialCalculation();
  runLeadScoring();
  renderWindshieldCard();
});

function switchHubTab(tabId) {
  const tabs = ['tab-generator', 'tab-calculator', 'tab-scoring', 'tab-qr'];
  tabs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = (id === tabId) ? 'block' : 'none';
  });

  const buttons = document.querySelectorAll('.hub-tab-btn');
  buttons.forEach(btn => {
    if (btn.getAttribute('onclick').includes(tabId)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function initVehicleDropdowns() {
  const genSelect = document.getElementById('gen-vehicle-select');
  const qrSelect = document.getElementById('qr-vehicle-select');

  if (!siteConfig.stock) return;

  const optionsHtml = siteConfig.stock.map(v => 
    `<option value="${v.id}">${v.brand} ${v.model} (${v.version}) — ${v.price.toLocaleString('es-ES')} €</option>`
  ).join('');

  if (genSelect) {
    genSelect.innerHTML = optionsHtml;
    loadVehicleForGenerator();
  }
  if (qrSelect) {
    qrSelect.innerHTML = optionsHtml;
    renderWindshieldCard();
  }
}

// 1. Generador Multicanal IA
function loadVehicleForGenerator() {
  generateVehicleCopy();
}

function generateVehicleCopy() {
  const select = document.getElementById('gen-vehicle-select');
  const channel = document.getElementById('gen-channel').value;
  const tone = document.getElementById('gen-tone').value;
  const outputEl = document.getElementById('gen-output-text');

  if (!select) return;
  const v = siteConfig.stock.find(item => item.id === select.value);
  if (!v) return;

  let text = '';

  if (channel === 'portales') {
    text = `🚗 ${v.brand.toUpperCase()} ${v.model.toUpperCase()} — ${v.version} | ${v.year} | ${v.km}

✅ CERTIFICACIÓN PERICIAL COCHEMOTOR:
- Puntos de inspección en taller superados: ${v.inspectionScore}.
- Diagnóstico electrónico OBD sin fallos en centralita.
- Distintivo ambiental DGT: Etiqueta ${v.badge} (${v.badge === 'ECO' || v.badge === '0' ? 'Acceso libre a ZBE' : 'Apto para circular en ZBE'}).
- Estado administrativo: ${v.dgtStatus}.
- Garantía legal mecánica: ${v.warranty}.

🔧 PUNTOS DESTACADOS POR EL TALLER:
${v.highlights.map(h => `• ${h}`).join('
')}

💰 PRECIO AL CONTADO: ${v.price.toLocaleString('es-ES')} €
💳 FINANCIACIÓN DISPONIBLE: Desde ${v.monthlyPrice}
📍 UBICACIÓN Y PRUEBA: ${v.dealer} (${v.location}).
📲 Contacto directo por WhatsApp para enviar vídeo en detalle del motor o agendar prueba dinámica.`;
  } 
  else if (channel === 'whatsapp') {
    text = `Hola! Te comparto la ficha técnica del ${v.brand} ${v.model} (${v.version}) que tenemos en campa:

• Año: ${v.year} | Kilómetros: ${v.km}
• Distintivo DGT: ${v.badge}
• Precio: ${v.price.toLocaleString('es-ES')} € (o desde ${v.monthlyPrice})
• Garantía: ${v.warranty}

Superó 100 puntos de control mecánico y la diagnosis OBD de motor en nuestro taller. ¿Te gustaría que te envíe un vídeo corto del vano motor en marcha o prefieres pasar a probarlo esta semana?`;
  }
  else if (channel === 'ficha') {
    text = `FICHA DE HOMOLOGACIÓN COCHEMOTOR — REF: ${v.id.toUpperCase()}
--------------------------------------------------
VEHÍCULO: ${v.brand} ${v.model} ${v.version}
AÑO DE MATRICULACIÓN: ${v.year} | DISTINTIVO DGT: ${v.badge}
KILOMETRAJE VERIFICADO EN CENTRALITA: ${v.km}
INSPECCIÓN PERICIAL EN ELEVADOR: ${v.inspectionScore} (APTO)
REVISIÓN DE CARGAS TELEMÁTICAS DGT: ${v.dgtStatus}
COBERTURA MECÁNICA ASOCIADA: ${v.warranty}
PRÓXIMA INSPECCIÓN ITV: ${v.itvDate}
CONCESIONARIO / TALLER EMISOR: ${v.dealer}`;
  }
  else if (channel === 'video') {
    text = `🎬 GUIÓN DE VÍDEO CORTO (REELS / TIKTOK / SHORTS)
--------------------------------------------------
[GANCHO - 0 a 3 seg]:
(Plano frontal rápido del frontal y arranque de motor)
"¿Buscabas un ${v.brand} ${v.model} pero te daba miedo que viniera con avería oculta o kilómetros afeitados?"

[DESARROLLO - 3 a 15 seg]:
(Cámara enseña elevador de taller y ordenador de diagnosis OBD)
"Este ejemplar de ${v.year} con ${v.km} acaba de salir de nuestro taller asociado con un score de ${v.inspectionScore}. Cero holguras, distribución revisada y neumáticos al 90%."

[CIERRE Y LLAMADA A LA ACCIÓN - 15 a 25 seg]:
"Etiqueta ${v.badge} de la DGT para entrar en el centro sin multas, 12 meses de garantía y entrega inmediata por ${v.price.toLocaleString('es-ES')} €. Escríbenos al enlace de la bio para ver el informe pericial completo."`;
  }

  outputEl.textContent = text;
  const statusEl = document.getElementById('copy-status-badge');
  if (statusEl) statusEl.textContent = '✓ Generado con éxito';
}

function copyGeneratedText() {
  const outputEl = document.getElementById('gen-output-text');
  if (!outputEl) return;
  navigator.clipboard.writeText(outputEl.textContent).then(() => {
    alert('¡Copiado al portapapeles listo para pegar en Coches.net, Wallapop o WhatsApp!');
  });
}

// 2. Calculadora Financiera & Margen
function runFinancialCalculation() {
  const price = parseFloat(document.getElementById('calc-price').value) || 0;
  const cost = parseFloat(document.getElementById('calc-cost').value) || 0;
  const deposit = parseFloat(document.getElementById('calc-deposit').value) || 0;
  const months = parseInt(document.getElementById('calc-months').value) || 72;
  const annualRate = parseFloat(document.getElementById('calc-rate').value) || 7.95;

  const financed = Math.max(0, price - deposit);
  const monthlyRate = (annualRate / 100) / 12;

  let installment = 0;
  if (monthlyRate > 0 && months > 0 && financed > 0) {
    installment = (financed * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
  } else if (months > 0) {
    installment = financed / months;
  }

  const margin = Math.max(0, price - cost);
  const roi = cost > 0 ? ((margin / cost) * 100).toFixed(1) : 0;

  document.getElementById('calc-result-installment').innerHTML = `${Math.round(installment)} €<span style="font-size: 1.2rem; color: #94a3b8; font-weight: 500;">/mes</span>`;
  document.getElementById('calc-result-financed').textContent = `${financed.toLocaleString('es-ES')} €`;
  document.getElementById('calc-result-margin').textContent = `${margin.toLocaleString('es-ES')} €`;
  document.getElementById('calc-result-roi').textContent = `${roi}%`;
}

function copyFinancialQuote() {
  const price = document.getElementById('calc-price').value;
  const deposit = document.getElementById('calc-deposit').value;
  const months = document.getElementById('calc-months').value;
  const installment = document.getElementById('calc-result-installment').textContent.replace('/mes', '').trim();

  const msg = `Simulación de Financiación CocheMotor:
• Precio vehículo: ${parseFloat(price).toLocaleString('es-ES')} €
• Entrada inicial: ${parseFloat(deposit).toLocaleString('es-ES')} €
• Plazo: ${months} cuotas
• Cuota mensual estimada: ${installment}/mes (T.I.N. 7.95%)

Sujeto a aprobación bancaria habitual con DNI y nómina.`;

  navigator.clipboard.writeText(msg).then(() => {
    alert('Propuesta de cuota copiada para enviar por WhatsApp.');
  });
}

// 3. Scoring Predictivo de Leads
function runLeadScoring() {
  const p = parseInt(document.getElementById('score-payment').value) || 0;
  const t = parseInt(document.getElementById('score-tradein').value) || 0;
  const u = parseInt(document.getElementById('score-urgency').value) || 0;
  const v = parseInt(document.getElementById('score-visit').value) || 0;

  const total = p + t + u + v;
  const scoreEl = document.getElementById('lead-score-number');
  const catEl = document.getElementById('lead-score-category');
  const actionEl = document.getElementById('lead-score-action');

  scoreEl.textContent = `${total}/100`;

  if (total >= 80) {
    catEl.innerHTML = '🔥 LEAD MUY CALIENTE — PRIORIDAD ALTA';
    catEl.style.color = '#009640';
    catEl.style.background = 'rgba(0, 150, 64, 0.15)';
    actionEl.textContent = 'Llamar en menos de 10 minutos. Ofrecer cita inmediata para prueba dinámica en taller y enviar por WhatsApp el certificado de 100 puntos periciales para fijar reserva.';
  } else if (total >= 50) {
    catEl.innerHTML = '⚡ LEAD TEMPLADO — INTERÉS REAL';
    catEl.style.color = '#002D62';
    catEl.style.background = 'rgba(0, 45, 98, 0.12)';
    actionEl.textContent = 'Enviar vídeo del motor por WhatsApp y propuesta de tasación de su coche usado. Proponer 2 franjas horarias este fin de semana para prueba.';
  } else {
    catEl.innerHTML = '❄️ LEAD FRÍO / CURIOSO — BAJA PRIORIDAD';
    catEl.style.color = '#e11d48';
    catEl.style.background = 'rgba(225, 29, 72, 0.12)';
    actionEl.textContent = 'No invertir tiempo en llamadas largas. Enviar enlace estándar de la ficha pública por WhatsApp y esperar confirmación de solvencia o cita presencial.';
  }
}

// 4. Cartelería con QR
function renderWindshieldCard() {
  const select = document.getElementById('qr-vehicle-select');
  if (!select) return;
  const v = siteConfig.stock.find(item => item.id === select.value);
  if (!v) return;

  document.getElementById('ws-title').textContent = `${v.brand} ${v.model}`;
  document.getElementById('ws-version').textContent = v.version;
  document.getElementById('ws-km').textContent = v.km;
  document.getElementById('ws-year').textContent = v.year;
  document.getElementById('ws-warranty').textContent = v.warranty;
  document.getElementById('ws-score').textContent = v.inspectionScore;
  document.getElementById('ws-price').textContent = `${v.price.toLocaleString('es-ES')} €`;
  document.getElementById('ws-monthly').textContent = `o desde ${v.monthlyPrice}`;
  document.getElementById('ws-dealer').textContent = `Vehículo en exposición: ${v.dealer}`;

  const badgeEl = document.getElementById('ws-badge');
  badgeEl.className = `badge-dgt ${v.badgeClass}`;
  badgeEl.textContent = `ETIQUETA ${v.badge}`;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent('https://cochemotor.es/stock/' + v.id)}`;
  document.getElementById('ws-qr-img').src = qrUrl;
}
