/* Coche Ideal — frontera de persistencia configurable (demo local / backend futuro). */
(function (global) {
  'use strict';
  const KEY = 'cochemotor_coche_ideal_requests_v1';
  const DEDUP_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

  function read() {
    try { return JSON.parse(global.localStorage.getItem(KEY) || '[]'); }
    catch (_) { return []; }
  }
  function normalize(value) { return String(value || '').trim().toLowerCase(); }
  function fingerprint(request) {
    return [request.contact?.email, request.contact?.phone, request.vehicle?.brand, request.vehicle?.model, request.preferences?.fuel, request.preferences?.gearbox].map(normalize).join('|');
  }
  function create(request, options = {}) {
    const now = Date.now();
    const items = read();
    const fp = fingerprint(request);
    const duplicate = items.find(item => item.fingerprint === fp && now - item.createdAt < (options.dedupWindowMs || DEDUP_WINDOW_MS));
    if (duplicate) return { ok: false, duplicate: true, existingId: duplicate.id };
    const record = { ...request, id: `ci-${now.toString(36)}`, fingerprint: fp, status: 'nueva', tenantId: options.tenantId || 'public-intake', createdAt: now, consentVersion: request.consentVersion || 'pending' };
    items.push(record);
    global.localStorage.setItem(KEY, JSON.stringify(items));
    return { ok: true, request: record };
  }
  global.CocheIdealRepository = { create, list: read, DEDUP_WINDOW_MS };
})(window);