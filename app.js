/**
 * CocheMotor — Interactive Application & Editorial Renderer
 * Metodología BIG School Webs & Panel profesional B2B (Inspirado en Inmobia360)
 */

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function safeImageSource(value) {
  try {
    const url = new URL(String(value || ''), window.location.href);
    return url.protocol === 'https:' || url.origin === window.location.origin ? url.href : 'assets/brand/icons/vehicle-placeholder.svg';
  } catch (_) {
    return 'assets/brand/icons/vehicle-placeholder.svg';
  }
}

function normalizeWhatsAppPhone(value) {
  const digits = String(value || '').replace(/\D/g, '');
  return /^\d{8,15}$/.test(digits) ? digits : '';
}

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
  renderChapter7Faq();
  renderChapter8Professional();
  renderFooter();

  initStockFilters();
  initVehicleModal();
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
  });}

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

  var stock = (typeof CocheMotorStorage !== 'undefined') ? CocheMotorStorage.getStock() : siteConfig.stock.map(function(v) { return Object.assign({}, v, { isDemo: true }); });
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
    var waMsg = 'Hola. He visto en CocheMotor el ' + v.brand + ' ' + v.model + ' (' + v.version + ') por ' + v.price.toLocaleString('es-ES') + ' €. Me gustaría consultar la información del anuncio.';
    var phone = normalizeWhatsAppPhone(v.sellerPhone) || normalizeWhatsAppPhone(siteConfig.brand.contactWhatsapp);
    var waUrl = phone ? 'https://wa.me/' + phone + '?text=' + encodeURIComponent(waMsg) : '#';
    var badgeClass = ['badge-b', 'badge-c', 'badge-eco', 'badge-zero'].includes(v.badgeClass) ? v.badgeClass : 'badge-c';
    var isSold = v.status === 'vendido';
    var isReserved = v.status === 'reservado';
    var sellerMarkup = v.isDemo ? '<span>🏪 Vendedor de demostración</span>' :
      '<a href="/dealer?id=' + encodeURIComponent(v.userId || 'user-juan') + '" style="color: var(--cm-navy); text-decoration: underline; font-weight: 700; font-size: 0.82rem;">🏪 ' + escapeHTML(v.sellerName || v.dealer) + '</a>';

    return '<article class="vehicle-card" data-id="' + escapeHTML(v.id) + '">' +
      '<div class="vehicle-thumb-box">' +
        '<img class="vehicle-thumb-img" src="' + escapeHTML(safeImageSource(v.image)) + '" alt="' + escapeHTML(v.brand) + ' ' + escapeHTML(v.model) + ' anunciado en CocheMotor" loading="lazy" decoding="async" width="640" height="360">' +
        '<span class="badge-dgt ' + badgeClass + '" title="Distintivo indicado en el anuncio; compruébalo en la DGT.">' + escapeHTML(v.badge) + ' · indicado</span>' +
        (v.isDemo ? '<span class="badge-inspection">EJEMPLO · NO DISPONIBLE</span>' : '<span class="badge-inspection">' + (v.inspectionScore ? 'Revisión indicada · ' + escapeHTML(v.inspectionScore) : 'Revisión no indicada') + '</span>') +
        (isSold ? '<span style="position: absolute; bottom: 10px; right: 10px; background: #b91c1c; color: white; padding: 4px 10px; border-radius: 4px; font-weight: 800; font-size: 0.75rem;">VENDIDO</span>' :
         isReserved ? '<span style="position: absolute; bottom: 10px; right: 10px; background: #d97706; color: white; padding: 4px 10px; border-radius: 4px; font-weight: 800; font-size: 0.75rem;">RESERVADO</span>' : '') +
      '</div>' +
      '<div class="vehicle-info">' +
        '<h3 class="vehicle-title">' + escapeHTML(v.brand) + ' ' + escapeHTML(v.model) + '</h3>' +
        '<div class="vehicle-version">' + escapeHTML(v.version) + '</div>' +
        '<div class="vehicle-specs-list">' +
          '<div class="spec-cell"><strong>Año:</strong> ' + escapeHTML(v.year) + '</div>' +
          '<div class="spec-cell"><strong>Km:</strong> ' + escapeHTML(v.km) + '</div>' +
          '<div class="spec-cell"><strong>Motor:</strong> ' + escapeHTML(v.fuel) + '</div>' +
          '<div class="spec-cell"><strong>Cambio:</strong> ' + escapeHTML(v.gearbox) + '</div>' +
        '</div>' +
        '<div class="vehicle-dealer">' + sellerMarkup + '</div>' +
        '<div class="vehicle-pricing">' +
          '<div class="cash-price">' + v.price.toLocaleString('es-ES') + ' €</div>' +
          '<div class="monthly-price">desde ' + escapeHTML(v.monthlyPrice) + '</div>' +
        '</div>' +
        '<div class="card-cta-group">' +
          '<a class="btn btn-red" href="/ficha?id=' + encodeURIComponent(v.id) + '" style="font-weight: 800;">Ver detalles</a>' +
          (v.isDemo ? '<span class="btn btn-outline" aria-label="Anuncio de demostración; contacto desactivado">Ejemplo (sin contacto)</span>' : '<a class="btn btn-outline" href="' + escapeHTML(waUrl) + '" target="_blank" rel="noopener noreferrer">WhatsApp</a>') +
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

      var currentStock = (typeof CocheMotorStorage !== 'undefined') ? CocheMotorStorage.getStock() : siteConfig.stock.map(function(v) { return Object.assign({}, v, { isDemo: true }); });
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

  var waMsg = 'Hola! Me interesa la información del ' + v.brand + ' ' + v.model + ' (' + v.id + ') publicado en CocheMotor.';
  var phone = normalizeWhatsAppPhone(v.sellerPhone) || normalizeWhatsAppPhone(siteConfig.brand.contactWhatsapp);
  var waUrl = phone ? 'https://wa.me/' + phone + '?text=' + encodeURIComponent(waMsg) : '#';

  modalContent.innerHTML = '<div class="modal-header-box">' +
    '<div class="chapter-badge">INFORMACIÓN DEL ANUNCIO</div>' +
    '<h2 class="modal-title">' + escapeHTML(v.brand) + ' ' + escapeHTML(v.model) + ' — ' + escapeHTML(v.version) + '</h2>' +
    '<p class="modal-subtitle">' + escapeHTML(v.isDemo ? 'Anuncio de demostración; no disponible para compra.' : (v.dealer + ' • Datos del anuncio pendientes de comprobación oficial')) + '</p>' +
  '</div>' +
  '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">' +
    '<div style="background: var(--cm-surface-subtle); padding: 16px; border-radius: var(--cm-radius-md);">' +
      '<div style="font-size: 0.8rem; color: var(--cm-text-secondary);">INFORMACIÓN DGT DEL ANUNCIO</div>' +
      '<div style="font-weight: 700; color: var(--cm-navy); font-size: 1.05rem;">Distintivo indicado: ' + escapeHTML(v.badge) + '</div>' +
      '<div style="font-size: 0.85rem; color: var(--cm-text-secondary); margin-top: 4px;">Solicita un informe reciente para comprobar cargas e ITV.</div>' +
    '</div>' +
    '<div style="background: var(--cm-surface-subtle); padding: 16px; border-radius: var(--cm-radius-md);">' +
      '<div style="font-size: 0.8rem; color: var(--cm-text-secondary);">GARANTÍA Y REVISIÓN</div>' +
      '<div style="font-weight: 700; color: var(--cm-navy); font-size: 1.05rem;">' + escapeHTML(v.warranty) + '</div>' +
      '<div style="font-size: 0.85rem; color: var(--cm-text-secondary); margin-top: 4px;">Fecha indicada en el anuncio; pendiente de comprobación.</div>' +
    '</div>' +
  '</div>' +
  '<h4 class="modal-section-title">Lo más importante de la revisión mecánica</h4>' +
  '<div class="modal-highlights-grid">' +
    (Array.isArray(v.highlights) ? v.highlights : []).map(function(h) { return '<div class="highlight-tag">' + escapeHTML(h) + '</div>'; }).join('') +
  '</div>' +
  '<div style="margin-top: 32px; display: flex; gap: 16px; justify-content: flex-end;">' +
    '<button class="btn btn-outline" onclick="closeVehicleModal()" style="color: var(--cm-navy); border-color: var(--cm-border-strong);">Cerrar Ficha</button>' +
    (v.isDemo ? '<span class="btn btn-outline" aria-label="Anuncio de demostración; contacto desactivado">Ejemplo (sin contacto)</span>' : '<a class="btn btn-whatsapp" href="' + escapeHTML(waUrl) + '" target="_blank" rel="noopener noreferrer">Contactar por WhatsApp</a>') +
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
  if (price && price !== 'all') params.set('price', price);
  window.location.href = '/marketplace' + (params.toString() ? '?' + params.toString() : '');
}
