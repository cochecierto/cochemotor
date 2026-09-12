/**
 * CocheMotor — Interactive Application & Editorial Renderer
 * Metodología BIG School Webs & Panel profesional B2B (Inspirado en Inmobia360)
 */

let isAnnualBilling = false;

document.addEventListener('DOMContentLoaded', function() {
  if (typeof siteConfig === 'undefined') {
    console.error('CocheMotor: siteConfig no encontrado.');
    return;
  }

  initBranding();
  renderChapter1Hero();
  renderChapter2Manifesto();
  renderChapter3Engineering();
  renderChapter4Pillars();
  renderChapter5Experience();
  renderChapter6Catalog();
  renderTestimonials();
  renderPricing();
  renderChapter7Faq();
  renderChapter8Professional();
  renderFooter();

  initStockFilters();
  initVehicleModal();
  updateLandingRoi();
  initMobileNavigation();
});

function initMobileNavigation() {
  var toggle = document.querySelector('.nav-menu-toggle');
  var nav = document.getElementById('site-navigation');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', function() {
    var open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('is-open', !open);
    toggle.setAttribute('aria-label', open ? 'Abrir menú de navegación' : 'Cerrar menú de navegación');
  });
  nav.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    });
  });
}

function initBranding() {
  var brandLogos = document.querySelectorAll('.brand-logo-img');
  brandLogos.forEach(function(img) {
    img.alt = siteConfig.brand.name + ' — ' + siteConfig.brand.tagline;
  });

  var verificationSeals = document.querySelectorAll('.floating-verification-seal-img');
  verificationSeals.forEach(function(img) {
    img.src = siteConfig.brand.selloVerificado || 'assets/brand/icons/cochemotor-verification-seal.png';
    img.alt = 'Sello CocheMotor Verificado';
  });
}

function renderChapter1Hero() {
  var hero = siteConfig.chapters.chapter1_hero;
  if (!hero) return;

  var eyebrowEl = document.getElementById('hero-eyebrow');
  if (eyebrowEl) eyebrowEl.textContent = hero.eyebrow;

  var headlineEl = document.getElementById('hero-headline');
  if (headlineEl && Array.isArray(hero.headline)) {
    var parts = hero.headline.filter(Boolean);
    if (parts.length >= 2) {
      headlineEl.innerHTML = parts[0] + '<br><span class="highlight">' + parts[1] + '</span>' + (parts[2] ? '<br>' + parts[2] : '');
    } else {
      headlineEl.textContent = parts.join(' ');
    }
  }

  var subheadEl = document.getElementById('hero-subhead');
  if (subheadEl) subheadEl.textContent = hero.subhead;

  var ctaBtn = document.getElementById('hero-cta');
  if (ctaBtn) {
    ctaBtn.textContent = hero.ctaLabel;
    ctaBtn.href = hero.ctaTarget;
  }

  var statsGrid = document.getElementById('hero-stats-grid');
  if (statsGrid && hero.stats) {
    statsGrid.innerHTML = hero.stats.map(function(s) {
      return '<div class="stat-item"><div class="stat-value">' + s.value + '</div><div class="stat-label">' + s.label + '</div></div>';
    }).join('');
  }
}

function renderChapter2Manifesto() {
  var ch = siteConfig.chapters.chapter2_manifesto;
  if (!ch) return;

  var badgeEl = document.getElementById('manifesto-badge');
  if (badgeEl) badgeEl.textContent = ch.number;

  var titleEl = document.getElementById('manifesto-title');
  if (titleEl) titleEl.textContent = ch.title;

  var pBox = document.getElementById('manifesto-paragraphs');
  if (pBox && ch.paragraphs) {
    pBox.innerHTML = ch.paragraphs.map(function(p) { return '<p>' + p + '</p>'; }).join('');
  }

  var quoteEl = document.getElementById('manifesto-quote');
  if (quoteEl) quoteEl.textContent = '“' + ch.quote + '”';
}

function renderChapter3Engineering() {
  var ch = siteConfig.chapters.chapter3_engineering;
  if (!ch) return;

  var badgeEl = document.getElementById('engineering-badge');
  if (badgeEl) badgeEl.textContent = ch.number;

  var titleEl = document.getElementById('engineering-title');
  if (titleEl) titleEl.textContent = ch.title;

  var subEl = document.getElementById('engineering-subtitle');
  if (subEl) subEl.textContent = ch.subtitle;
}

function renderChapter4Pillars() {
  var ch = siteConfig.chapters.chapter4_pillars;
  if (!ch) return;

  var badgeEl = document.getElementById('pillars-badge');
  if (badgeEl) badgeEl.textContent = ch.number;

  var titleEl = document.getElementById('pillars-title');
  if (titleEl) titleEl.textContent = ch.title;

  var grid = document.getElementById('pillars-grid');
  if (grid && ch.pillars) {
    grid.innerHTML = ch.pillars.map(function(p) {
      return '<div class="pillar-card"><div class="pillar-code">' + p.code + '</div><h3 class="pillar-title">' + p.title + '</h3><p class="pillar-desc">' + p.description + '</p></div>';
    }).join('');
  }
}

function renderChapter5Experience() {
  var ch = siteConfig.chapters.chapter5_experience;
  if (!ch) return;

  var badgeEl = document.getElementById('experience-badge');
  if (badgeEl) badgeEl.textContent = ch.number;

  var titleEl = document.getElementById('experience-title');
  if (titleEl) titleEl.textContent = ch.title;

  var subEl = document.getElementById('experience-subtitle');
  if (subEl) subEl.textContent = ch.subtitle;
}

function renderChapter6Catalog() {
  var ch = siteConfig.chapters.chapter6_catalog;
  if (!ch) return;

  var badgeEl = document.getElementById('catalog-badge');
  if (badgeEl) badgeEl.textContent = ch.number;

  var titleEl = document.getElementById('catalog-title');
  if (titleEl) titleEl.textContent = ch.title;

  var subEl = document.getElementById('catalog-subtitle');
  if (subEl) subEl.textContent = ch.subtitle;

  var stock = (typeof CocheMotorStorage !== 'undefined') ? CocheMotorStorage.getStock() : siteConfig.stock;
  renderStockGrid(stock);
}

function renderStockGrid(vehicles) {
  var grid = document.getElementById('stock-grid');
  if (!grid) return;

  if (vehicles.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--cm-text-secondary);">No hay vehículos con los filtros seleccionados.</p>';
    return;
  }

  grid.innerHTML = vehicles.map(function(v) {
    var waMsg = 'Hola! He visto en CocheMotor el ' + v.brand + ' ' + v.model + ' (' + v.version + ') por ' + v.price.toLocaleString('es-ES') + ' € y me gustaría consultar la ficha de peritaje y cita para probarlo.';
    var waUrl = 'https://wa.me/' + (v.sellerPhone || siteConfig.brand.contactWhatsapp) + '?text=' + encodeURIComponent(waMsg);
    var isSold = v.status === 'vendido';
    var isReserved = v.status === 'reservado';

    return '<article class="vehicle-card" data-id="' + v.id + '">' +
      '<div class="vehicle-thumb-box">' +
        '<img class="vehicle-thumb-img" src="' + v.image + '" alt="' + v.brand + ' ' + v.model + ' verificado" loading="lazy">' +
        '<span class="badge-dgt ' + (v.badgeClass || 'badge-c') + '">' + v.badge + '</span>' +
        '<span class="badge-inspection">✓ ' + (v.inspectionScore || '98/100') + '</span>' +
        (isSold ? '<span style="position: absolute; bottom: 10px; right: 10px; background: #b91c1c; color: white; padding: 4px 10px; border-radius: 4px; font-weight: 800; font-size: 0.75rem;">VENDIDO</span>' :
         isReserved ? '<span style="position: absolute; bottom: 10px; right: 10px; background: #d97706; color: white; padding: 4px 10px; border-radius: 4px; font-weight: 800; font-size: 0.75rem;">RESERVADO</span>' : '') +
      '</div>' +
      '<div class="vehicle-info">' +
        '<h3 class="vehicle-title">' + v.brand + ' ' + v.model + '</h3>' +
        '<div class="vehicle-version">' + v.version + '</div>' +
        '<div class="vehicle-specs-list">' +
          '<div class="spec-cell"><strong>Año:</strong> ' + v.year + '</div>' +
          '<div class="spec-cell"><strong>Km:</strong> ' + v.km + '</div>' +
          '<div class="spec-cell"><strong>Motor:</strong> ' + v.fuel + '</div>' +
          '<div class="spec-cell"><strong>Cambio:</strong> ' + v.gearbox + '</div>' +
        '</div>' +
        '<div class="vehicle-dealer">' +
          '<a href="dealer.html?id=' + (v.userId || 'user-garcia') + '" style="color: var(--cm-navy); text-decoration: underline; font-weight: 700; font-size: 0.82rem;">' +
          '🏪 ' + (v.sellerName || v.dealer) +
          '</a>' +
        '</div>' +
        '<div class="vehicle-pricing">' +
          '<div class="cash-price">' + v.price.toLocaleString('es-ES') + ' €</div>' +
          '<div class="monthly-price">desde ' + v.monthlyPrice + '</div>' +
        '</div>' +
        '<div class="card-cta-group">' +
          '<a class="btn btn-red" href="ficha.html?id=' + v.id + '" style="font-weight: 800;">Ver detalles</a>' +
          '<a class="btn btn-outline" href="' + waUrl + '" target="_blank" rel="noopener">WhatsApp</a>' +
        '</div>' +
      '</div>' +
    '</article>';
  }).join('');
}

function initStockFilters() {
  var filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      filterBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var currentStock = (typeof CocheMotorStorage !== 'undefined') ? CocheMotorStorage.getStock() : siteConfig.stock;
      var filterType = btn.getAttribute('data-filter');
      if (filterType === 'all') {
        renderStockGrid(currentStock);
      } else if (filterType === 'eco') {
        renderStockGrid(currentStock.filter(function(v) { return v.badge === 'ECO' || v.badge === '0'; }));
      } else if (filterType === 'c') {
        renderStockGrid(currentStock.filter(function(v) { return v.badge === 'C'; }));
      } else if (filterType === 'under20k') {
        renderStockGrid(currentStock.filter(function(v) { return v.price < 20000; }));
      }
    });
  });
}

// NUEVO: Renderizado de Testimonios B2B
function renderTestimonials() {
  var grid = document.getElementById('testimonials-grid');
  if (!grid || !siteConfig.testimonials) return;

  grid.innerHTML = siteConfig.testimonials.map(function(t) {
    return '<div class="testimonial-card">' +
      '<div class="test-metric">' + t.metrics + '</div>' +
      '<div class="test-quote">“' + t.quote + '”</div>' +
      '<div class="test-author">' +
        '<h4>' + t.author + '</h4>' +
        '<p>' + t.role + '</p>' +
      '</div>' +
    '</div>';
  }).join('');
}

// NUEVO: Renderizado de Planes para profesionales
function renderPricing() {
  var grid = document.getElementById('pricing-grid');
  if (!grid || !siteConfig.pricing) return;

  grid.innerHTML = siteConfig.pricing.map(function(p) {
    var price = isAnnualBilling ? p.priceAnnual : p.priceMonthly;
    var periodText = isAnnualBilling ? '/mes (facturado anual)' : '/mes';

    return '<div class="price-card ' + (p.popular ? 'popular' : '') + '">' +
      (p.popular ? '<div class="popular-ribbon">MÁS POPULAR</div>' : '') +
      '<div class="price-header">' +
        '<h3>' + p.name + '</h3>' +
        '<p>' + p.tagline + '</p>' +
      '</div>' +
      '<div class="price-amount-box">' +
        '<div class="price-val">' + price + ' €</div>' +
        '<div class="price-period">' + periodText + '</div>' +
      '</div>' +
      '<ul class="price-features-list">' +
        p.features.map(function(f) { return '<li>' + f + '</li>'; }).join('') +
      '</ul>' +
      '<a href="hub.html" class="btn ' + (p.popular ? 'btn-red' : 'btn-navy') + '" style="width: 100%;">' +
        p.cta +
      '</a>' +
    '</div>';
  }).join('');
}

function toggleBillingPeriod() {
  isAnnualBilling = !isAnnualBilling;
  var mBtn = document.getElementById('toggle-monthly');
  var aBtn = document.getElementById('toggle-annual');

  if (isAnnualBilling) {
    mBtn.classList.remove('active');
    aBtn.classList.add('active');
  } else {
    aBtn.classList.remove('active');
    mBtn.classList.add('active');
  }
  renderPricing();
}

// NUEVO: Calculadora de Ahorro ROI en Landing
function updateLandingRoi() {
  var carsSlider = document.getElementById('roi-cars-slider');
  var portalSlider = document.getElementById('roi-portal-slider');
  if (!carsSlider || !portalSlider) return;

  var cars = parseInt(carsSlider.value);
  var portalCost = parseInt(portalSlider.value);

  document.getElementById('roi-cars-val').textContent = cars + ' coches/mes';
  document.getElementById('roi-portal-val').textContent = portalCost + ' €/coche';

  // Ahorro anual estimado (portales tradicionales vs CocheMotor Partner + tiempo de comerciales)
  var annualTraditionalPortalCost = cars * portalCost * 12;
  var cochemotorPartnerCost = 99 * 12; // Plan partner taller
  var netSavings = Math.max(0, annualTraditionalPortalCost - cochemotorPartnerCost);

  // Horas ahorradas: 1.5 horas ahorradas por vehículo publicado (copys, WhatsApp, filtros)
  var hoursSaved = Math.round(cars * 1.5 * 12);

  document.getElementById('roi-res-money').textContent = netSavings.toLocaleString('es-ES') + ' €';
  document.getElementById('roi-res-hours').textContent = hoursSaved + ' Horas';
}

function renderChapter7Faq() {
  var ch = siteConfig.chapters.chapter7_faq;
  if (!ch) return;

  var badgeEl = document.getElementById('faq-badge');
  if (badgeEl) badgeEl.textContent = ch.number;

  var titleEl = document.getElementById('faq-title');
  if (titleEl) titleEl.textContent = ch.title;

  var faqList = document.getElementById('faq-list');
  if (faqList && ch.items) {
    faqList.innerHTML = ch.items.map(function(item, idx) {
      return '<details class="faq-item"' + (idx === 0 ? ' open' : '') + '>' +
        '<summary class="faq-summary">' + item.q + '</summary>' +
        '<div class="faq-answer">' + item.a + '</div>' +
      '</details>';
    }).join('');
  }
}

function renderChapter8Professional() {
  var ch = siteConfig.chapters.chapter8_contact;
  if (!ch) return;

  var badgeEl = document.getElementById('pro-badge');
  if (badgeEl) badgeEl.textContent = ch.number;

  var titleEl = document.getElementById('pro-title');
  if (titleEl) titleEl.textContent = ch.title;

  var subEl = document.getElementById('pro-subtitle');
  if (subEl) subEl.textContent = ch.subtitle;
}

function renderFooter() {
  var currentYear = new Date().getFullYear();
  var yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = currentYear;
}

function openVehicleModal(vehicleId) {
  var v = siteConfig.stock.find(function(item) { return item.id === vehicleId; });
  if (!v) return;

  var modalOverlay = document.getElementById('vehicle-modal');
  var modalContent = document.getElementById('modal-dynamic-content');
  if (!modalOverlay || !modalContent) return;

  var waMsg = 'Hola! Me interesa la certificación pericial del ' + v.brand + ' ' + v.model + ' (' + v.id + ') publicado en CocheMotor.';
  var waUrl = 'https://wa.me/' + siteConfig.brand.contactWhatsapp + '?text=' + encodeURIComponent(waMsg);

  modalContent.innerHTML = '<div class="modal-header-box">' +
    '<div class="chapter-badge">CERTIFICADO PERICIAL COCHEMOTOR</div>' +
    '<h2 class="modal-title">' + v.brand + ' ' + v.model + ' — ' + v.version + '</h2>' +
    '<p class="modal-subtitle">' + v.dealer + ' • Matrícula verificada en DGT • Score ' + v.inspectionScore + '</p>' +
  '</div>' +
  '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">' +
    '<div style="background: var(--cm-surface-subtle); padding: 16px; border-radius: var(--cm-radius-md);">' +
      '<div style="font-size: 0.8rem; color: var(--cm-text-secondary);">ESTADO LEGAL DGT</div>' +
      '<div style="font-weight: 700; color: var(--cm-navy); font-size: 1.05rem;">' + v.dgtStatus + '</div>' +
      '<div style="font-size: 0.85rem; color: var(--badge-eco-bg); margin-top: 4px;">✓ Sin reservas ni embargos</div>' +
    '</div>' +
    '<div style="background: var(--cm-surface-subtle); padding: 16px; border-radius: var(--cm-radius-md);">' +
      '<div style="font-size: 0.8rem; color: var(--cm-text-secondary);">GARANTÍA Y REVISIÓN</div>' +
      '<div style="font-weight: 700; color: var(--cm-navy); font-size: 1.05rem;">' + v.warranty + '</div>' +
      '<div style="font-size: 0.85rem; color: var(--cm-text-secondary); margin-top: 4px;">Próxima ITV: ' + v.itvDate + '</div>' +
    '</div>' +
  '</div>' +
  '<h4 class="modal-section-title">Puntos Clave del Peritaje Mecánico en Taller</h4>' +
  '<div class="modal-highlights-grid">' +
    v.highlights.map(function(h) { return '<div class="highlight-tag">' + h + '</div>'; }).join('') +
  '</div>' +
  '<div style="margin-top: 32px; display: flex; gap: 16px; justify-content: flex-end;">' +
    '<button class="btn btn-outline" onclick="closeVehicleModal()" style="color: var(--cm-navy); border-color: var(--cm-border-strong);">Cerrar Ficha</button>' +
    '<a class="btn btn-whatsapp" href="' + waUrl + '" target="_blank" rel="noopener">Contactar por WhatsApp</a>' +
  '</div>';

  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeVehicleModal() {
  var modalOverlay = document.getElementById('vehicle-modal');
  if (modalOverlay) modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

function initVehicleModal() {
  var modalOverlay = document.getElementById('vehicle-modal');
  if (!modalOverlay) return;

  modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) {
      closeVehicleModal();
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeVehicleModal();
  });
}

function switchHeroSearchTab(tabEl, mode) {
  document.querySelectorAll('.hero-search-tab').forEach(function(t) {
    t.classList.remove('active');
  });
  tabEl.classList.add('active');
  if (mode === 'profesionales') {
    window.location.href = 'dealer.html?id=user-garcia';
  } else if (mode === 'valoracion') {
    window.location.href = '#calculadora-roi';
  }
}

function executeHeroSearch() {
  var brandEl = document.getElementById('hero-filter-brand');
  var modelEl = document.getElementById('hero-filter-model');
  var priceEl = document.getElementById('hero-filter-price');
  var brand = brandEl ? brandEl.value : '';
  var model = modelEl ? modelEl.value : '';
  var price = priceEl ? priceEl.value : '';
  var params = new URLSearchParams();
  if (brand) params.set('brand', brand);
  if (model) params.set('model', model);
  if (price) params.set('price', price);
  window.location.href = 'marketplace.html' + (params.toString() ? '?' + params.toString() : '');
}
