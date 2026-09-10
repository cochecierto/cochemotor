/**
 * CocheMotor — Interactive Application & Editorial Renderer
 * Metodologia BIG School Webs: Desacoplamiento total, toda la data viene de siteConfig.
 */

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
});

function initBranding() {
  var brandLogos = document.querySelectorAll('.brand-logo-img');
  brandLogos.forEach(function(img) {
    img.src = siteConfig.brand.logoLight;
    img.alt = siteConfig.brand.name + ' - ' + siteConfig.brand.tagline;
  });

  var pistonIcons = document.querySelectorAll('.floating-piston-img');
  pistonIcons.forEach(function(img) {
    img.src = siteConfig.brand.pistonIcon;
    img.alt = 'Sello Mecanico CocheMotor';
  });
}

function renderChapter1Hero() {
  var hero = siteConfig.chapters.chapter1_hero;
  if (!hero) return;

  var eyebrowEl = document.getElementById('hero-eyebrow');
  if (eyebrowEl) eyebrowEl.textContent = hero.eyebrow;

  var headlineEl = document.getElementById('hero-headline');
  if (headlineEl && Array.isArray(hero.headline)) {
    headlineEl.innerHTML = hero.headline[0] + '<br><span class="highlight">' + hero.headline[1] + '</span><br>' + hero.headline[2];
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

  renderStockGrid(siteConfig.stock);
}

function renderStockGrid(vehicles) {
  var grid = document.getElementById('stock-grid');
  if (!grid) return;

  if (vehicles.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--cm-text-secondary);">No hay vehiculos con los filtros seleccionados.</p>';
    return;
  }

  grid.innerHTML = vehicles.map(function(v) {
    var waMsg = 'Hola! He visto en CocheMotor el ' + v.brand + ' ' + v.model + ' (' + v.version + ') por ' + v.price.toLocaleString('es-ES') + ' euros y me gustaria consultar la ficha de peritaje y cita para probarlo.';
    var waUrl = 'https://wa.me/' + siteConfig.brand.contactWhatsapp + '?text=' + encodeURIComponent(waMsg);

    return '<article class="vehicle-card" data-id="' + v.id + '">' +
      '<div class="vehicle-thumb-box">' +
        '<img class="vehicle-thumb-img" src="' + v.image + '" alt="' + v.brand + ' ' + v.model + ' verificado" loading="lazy">' +
        '<span class="badge-dgt ' + v.badgeClass + '">' + v.badge + '</span>' +
        '<span class="badge-inspection">✓ ' + v.inspectionScore + '</span>' +
      '</div>' +
      '<div class="vehicle-info">' +
        '<h3 class="vehicle-title">' + v.brand + ' ' + v.model + '</h3>' +
        '<div class="vehicle-version">' + v.version + '</div>' +
        '<div class="vehicle-specs-list">' +
          '<div class="spec-cell"><strong>Ano:</strong> ' + v.year + '</div>' +
          '<div class="spec-cell"><strong>Km:</strong> ' + v.km + '</div>' +
          '<div class="spec-cell"><strong>Motor:</strong> ' + v.fuel + '</div>' +
          '<div class="spec-cell"><strong>Cambio:</strong> ' + v.gearbox + '</div>' +
        '</div>' +
        '<div class="vehicle-dealer">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> ' +
          v.dealer +
        '</div>' +
        '<div class="vehicle-pricing">' +
          '<div class="cash-price">' + v.price.toLocaleString('es-ES') + ' €</div>' +
          '<div class="monthly-price">desde ' + v.monthlyPrice + '</div>' +
        '</div>' +
        '<div class="card-cta-group">' +
          '<button class="btn btn-navy" onclick="openVehicleModal('' + v.id + '')">Ver Peritaje</button>' +
          '<a class="btn btn-whatsapp" href="' + waUrl + '" target="_blank" rel="noopener">WhatsApp</a>' +
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

      var filterType = btn.getAttribute('data-filter');
      if (filterType === 'all') {
        renderStockGrid(siteConfig.stock);
      } else if (filterType === 'eco') {
        renderStockGrid(siteConfig.stock.filter(function(v) { return v.badge === 'ECO' || v.badge === '0'; }));
      } else if (filterType === 'c') {
        renderStockGrid(siteConfig.stock.filter(function(v) { return v.badge === 'C'; }));
      } else if (filterType === 'under20k') {
        renderStockGrid(siteConfig.stock.filter(function(v) { return v.price < 20000; }));
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

  var waMsg = 'Hola! Me interesa la certificacion pericial del ' + v.brand + ' ' + v.model + ' (' + v.id + ') publicado en CocheMotor.';
  var waUrl = 'https://wa.me/' + siteConfig.brand.contactWhatsapp + '?text=' + encodeURIComponent(waMsg);

  modalContent.innerHTML = '<div class="modal-header-box">' +
    '<div class="chapter-badge">CERTIFICADO PERICIAL COCHEMOTOR</div>' +
    '<h2 class="modal-title">' + v.brand + ' ' + v.model + ' — ' + v.version + '</h2>' +
    '<p class="modal-subtitle">' + v.dealer + ' • Matricula verificada en DGT • Score ' + v.inspectionScore + '</p>' +
  '</div>' +
  '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">' +
    '<div style="background: var(--cm-surface-subtle); padding: 16px; border-radius: var(--cm-radius-md);">' +
      '<div style="font-size: 0.8rem; color: var(--cm-text-secondary);">ESTADO LEGAL DGT</div>' +
      '<div style="font-weight: 700; color: var(--cm-navy); font-size: 1.05rem;">' + v.dgtStatus + '</div>' +
      '<div style="font-size: 0.85rem; color: var(--badge-eco-bg); margin-top: 4px;">✓ Sin reservas ni embargos</div>' +
    '</div>' +
    '<div style="background: var(--cm-surface-subtle); padding: 16px; border-radius: var(--cm-radius-md);">' +
      '<div style="font-size: 0.8rem; color: var(--cm-text-secondary);">GARANTIA Y REVISION</div>' +
      '<div style="font-weight: 700; color: var(--cm-navy); font-size: 1.05rem;">' + v.warranty + '</div>' +
      '<div style="font-size: 0.85rem; color: var(--cm-text-secondary); margin-top: 4px;">Proxima ITV: ' + v.itvDate + '</div>' +
    '</div>' +
  '</div>' +
  '<h4 class="modal-section-title">Puntos Clave del Peritaje Mecanico en Taller</h4>' +
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
