(function () {
  'use strict';
  var KEY = 'cochemotor_cookie_consent_v1';
  var COOKIE = 'cm_cookie_consent';
  var state = null;
  try { state = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (_) { state = null; }

  function save(preferences) {
    var value = { version: 1, necessary: true, analytics: !!preferences.analytics, marketing: !!preferences.marketing, updatedAt: new Date().toISOString() };
    try { localStorage.setItem(KEY, JSON.stringify(value)); } catch (_) {}
    document.cookie = COOKIE + '=' + encodeURIComponent(JSON.stringify({ necessary: true, analytics: value.analytics, marketing: value.marketing })) + '; Max-Age=31536000; Path=/; SameSite=Lax; Secure';
    state = value;
    window.dispatchEvent(new CustomEvent('cochemotor:cookie-consent', { detail: value }));
    close();
  }
  function close() { var el = document.getElementById('cm-cookie-banner'); if (el) el.remove(); var modal = document.getElementById('cm-cookie-settings'); if (modal) modal.remove(); }
  function esc(value) { return String(value).replace(/[&<>"']/g, function (c) { return ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]; }); }
  function settings() {
    if (document.getElementById('cm-cookie-settings')) return;
    var modal = document.createElement('div'); modal.id = 'cm-cookie-settings'; modal.className = 'cm-cookie-overlay'; modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true'); modal.setAttribute('aria-labelledby', 'cm-cookie-settings-title');
    modal.innerHTML = '<div class="cm-cookie-dialog"><button type="button" class="cm-cookie-close" aria-label="Cerrar configuración">×</button><h2 id="cm-cookie-settings-title">Configurar cookies</h2><p>Elige qué categorías autorizas. Las cookies necesarias siempre están activas porque permiten seguridad, sesión y preferencias básicas.</p><div class="cm-cookie-option"><div><strong>Necesarias</strong><span>Seguridad, sesión y funcionamiento esencial.</span></div><b>Siempre activas</b></div><label class="cm-cookie-option"><div><strong>Medición</strong><span>Actualmente no usamos analítica de terceros.</span></div><input id="cm-cookie-analytics" type="checkbox"></label><label class="cm-cookie-option"><div><strong>Marketing</strong><span>Actualmente no usamos publicidad comportamental.</span></div><input id="cm-cookie-marketing" type="checkbox"></label><div class="cm-cookie-actions"><button type="button" class="cm-cookie-secondary" data-cookie-reject>Rechazar no necesarias</button><button type="button" class="cm-cookie-primary" data-cookie-save>Guardar selección</button></div><p class="cm-cookie-note">Puedes cambiar tu elección en cualquier momento desde «Configurar cookies».</p></div>';
    document.body.appendChild(modal);
    modal.querySelector('.cm-cookie-close').onclick = close;
    modal.querySelector('[data-cookie-reject]').onclick = function () { save({ analytics: false, marketing: false }); };
    modal.querySelector('[data-cookie-save]').onclick = function () { save({ analytics: modal.querySelector('#cm-cookie-analytics').checked, marketing: modal.querySelector('#cm-cookie-marketing').checked }); };
    modal.querySelector('#cm-cookie-analytics').checked = !!(state && state.analytics); modal.querySelector('#cm-cookie-marketing').checked = !!(state && state.marketing);
  }
  function banner() {
    if (state || document.getElementById('cm-cookie-banner')) return;
    var banner = document.createElement('aside'); banner.id = 'cm-cookie-banner'; banner.className = 'cm-cookie-banner'; banner.setAttribute('role', 'region'); banner.setAttribute('aria-label', 'Preferencias de cookies');
    banner.innerHTML = '<div><strong>Tu privacidad importa</strong><p>Usamos tecnologías necesarias para que CocheMotor funcione. No activamos analítica ni marketing sin tu elección. Consulta la <a href="/privacidad#cookies">política de cookies</a>.</p></div><div class="cm-cookie-actions"><button type="button" class="cm-cookie-secondary" data-cookie-reject>Rechazar no necesarias</button><button type="button" class="cm-cookie-secondary" data-cookie-settings>Configurar</button><button type="button" class="cm-cookie-primary" data-cookie-accept>Aceptar todas</button></div>';
    document.body.appendChild(banner);
    banner.querySelector('[data-cookie-reject]').onclick = function () { save({ analytics: false, marketing: false }); };
    banner.querySelector('[data-cookie-accept]').onclick = function () { save({ analytics: true, marketing: true }); };
    banner.querySelector('[data-cookie-settings]').onclick = settings;
  }
  function mount() { banner(); var manage = document.createElement('button'); manage.type = 'button'; manage.className = 'cm-cookie-manage'; manage.textContent = 'Configurar cookies'; manage.onclick = settings; document.body.appendChild(manage); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
}());
