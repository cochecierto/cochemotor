/**
 * Motor de matching determinista para stock y demandas.
 * La puntuación es explicable y funciona sin API externa.
 */
const norm = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

export function scoreVehicleAgainstDemand(vehicle, demand) {
  if (!vehicle || !demand) return { score: 0, reasons: [], eligible: false };
  const reasons = [];
  let score = 0;

  const same = (a, b) => a && b && norm(a) === norm(b);
  const locationMatch = demand.municipalityId && vehicle.municipalityId === demand.municipalityId;
  const provinceMatch = demand.provinceId && vehicle.provinceId === demand.provinceId;
  const communityMatch = demand.communityId && vehicle.communityId === demand.communityId;

  if (demand.budgetMax && Number(vehicle.price ?? vehicle.cashPrice) > Number(demand.budgetMax)) return { score: 0, reasons: ['Supera el presupuesto máximo'], eligible: false };
  if (demand.maxKm && Number(vehicle.km ?? vehicle.mileageKm) > Number(demand.maxKm)) return { score: 0, reasons: ['Supera el kilometraje máximo'], eligible: false };
  if (demand.requiredBadge && !same(vehicle.badge ?? vehicle.dgtBadge, demand.requiredBadge)) return { score: 0, reasons: ['No coincide la etiqueta DGT'], eligible: false };

  if (same(vehicle.brand, demand.brand)) { score += 25; reasons.push('Marca coincidente'); }
  if (same(vehicle.model, demand.model)) { score += 25; reasons.push('Modelo coincidente'); }
  if (demand.yearMin && Number(vehicle.year) >= Number(demand.yearMin)) { score += 8; reasons.push('Año mínimo cumplido'); }
  if (demand.fuel && same(vehicle.fuel, demand.fuel)) { score += 12; reasons.push('Combustible coincidente'); }
  if (demand.version && same(vehicle.version, demand.version)) { score += 10; reasons.push('Versión coincidente'); }
  if (locationMatch) { score += 20; reasons.push('Mismo municipio'); }
  else if (provinceMatch) { score += 14; reasons.push('Misma provincia'); }
  else if (communityMatch) { score += 8; reasons.push('Misma comunidad autónoma'); }

  return { score: Math.min(score, 100), reasons, eligible: true };
}

export function matchVehiclesToDemand(vehicles = [], demand = {}) {
  return vehicles.map(vehicle => ({ vehicle, ...scoreVehicleAgainstDemand(vehicle, demand) }))
    .filter(result => result.eligible)
    .sort((a, b) => b.score - a.score);
}

export function buildVehicleIdentity({ brand, model, year, fuel, version } = {}) {
  return [brand, model, year, fuel, version].filter(Boolean).map(norm).join('|');
}
