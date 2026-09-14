(function () {
  'use strict';

  const annualMode = { enabled: false };
  const contactEmail = 'hola@cochemotor.es';

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[char]));
  }

  function euro(value, decimals = 0) {
    return Number(value).toLocaleString('es-ES', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function planContactHref(plan, billing) {
    const period = billing === 'annual' ? 'anual' : 'mensual';
    const subject = `Consulta sobre el plan CocheMotor ${plan.name}`;
    const body = `Hola, me gustaría recibir información sobre el plan ${plan.name} (${period}).\n\nGracias.`;
    return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function planCard(plan) {
    const hasAnnual = Number.isFinite(plan.annualTotal);
    const isCustom = plan.id === 'red';
    const price = annualMode.enabled && hasAnnual
      ? `<strong>${euro(plan.annualTotal)} €</strong><span>/año</span>`
      : `<strong>${isCustom ? 'Desde ' : ''}${euro(plan.priceMonthly)} €</strong><span>/mes</span>`;
    const equivalent = annualMode.enabled && hasAnnual
      ? `<p class="plan-annual-equivalent">${euro(plan.annualTotal / 12, 2)} €/mes equivalente</p>`
      : `<p class="plan-annual-equivalent">${annualMode.enabled && isCustom ? 'Precio anual a consultar' : '&nbsp;'}</p>`;
    const capacity = [
      plan.vehicles ? `Hasta ${plan.vehicles} vehículos` : 'Más de 75 vehículos',
      plan.users ? `${plan.users} ${plan.users === 1 ? 'usuario' : 'usuarios'}` : 'Equipo a medida'
    ].map(escapeHtml);
    const features = plan.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join('');
    const mainCta = isCustom || plan.id === 'concesionario'
      ? `<a class="btn btn-red" href="${escapeHtml(planContactHref(plan, annualMode.enabled ? 'annual' : 'monthly'))}">Consultar propuesta</a>`
      : `<a class="btn ${plan.popular ? 'btn-red' : 'btn-navy'}" href="acceso.html?audience=professional&amp;return=hub&amp;mode=register">Crear cuenta beta gratis</a><a class="plan-consult-link" href="${escapeHtml(planContactHref(plan, annualMode.enabled ? 'annual' : 'monthly'))}">Consultar condiciones de este plan</a>`;

    return `<article class="pro-plan-card${plan.popular ? ' is-popular' : ''}">
      ${plan.popular ? '<span class="plan-ribbon">RECOMENDADO</span>' : ''}
      <div class="plan-audience">${escapeHtml(plan.tagline)}</div>
      <h3>${escapeHtml(plan.name)}</h3>
      <div class="plan-price">${price}</div>
      ${equivalent}
      <div class="plan-capacity"><span>${capacity[0]}</span><span>${capacity[1]}</span></div>
      <ul class="plan-features">${features}</ul>
      ${mainCta}
      <p class="plan-cta-note">La beta es gratuita. Este botón no activa el plan ni genera cargos.</p>
    </article>`;
  }

  function renderPlans() {
    const grid = document.getElementById('pro-plan-grid');
    const plans = window.cocheMotorProfessionalPlans;
    if (!grid || !Array.isArray(plans)) return;
    grid.innerHTML = plans.map(planCard).join('');
  }

  function initBilling() {
    document.querySelectorAll('[data-billing]').forEach((button) => {
      button.addEventListener('click', () => {
        annualMode.enabled = button.dataset.billing === 'annual';
        document.querySelectorAll('[data-billing]').forEach((option) => {
          const selected = option === button;
          option.classList.toggle('is-selected', selected);
          option.setAttribute('aria-pressed', String(selected));
        });
        renderPlans();
      });
    });
  }

  function initNavigation() {
    const toggle = document.querySelector('.pro-header .nav-menu-toggle');
    const nav = document.getElementById('pro-navigation');
    if (!toggle || !nav) return;
    const close = () => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú');
      nav.classList.remove('is-open');
    };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      nav.classList.toggle('is-open', open);
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const year = document.getElementById('pro-year');
    if (year) year.textContent = String(new Date().getFullYear());
    initBilling();
    initNavigation();
    renderPlans();
  });
}());
