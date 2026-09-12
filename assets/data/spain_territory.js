export const COMMUNITIES = [
  {
    id: "01",
    name: "Andalucía",
    provinces: [
      { id: "02", name: "Almería", municipalities: [{ id: "04017", name: "Almería" }, { id: "04018", name: "El Ejido" }] },
      { id: "04", name: "Cádiz", municipalities: [{ id: "11001", name: "Cádiz" }, { id: "11002", name: "Jerez de la Frontera" }] }
    ]
  },
  {
    id: "02",
    name: "Aragón",
    provinces: [
      { id: "22", name: "Huesca", municipalities: [{ id: "22001", name: "Huesca" }, { id: "22002", name: "Jaca" }] },
      { id: "23", name: "Teruel", municipalities: [{ id: "23001", name: "Teruel" }] }
    ]
  },
  {
    id: "03",
    name: "Cataluña",
    provinces: [
      { id: "08", name: "Barcelona", municipalities: [{ id: "08001", name: "Barcelona" }, { id: "08002", name: "Badalona" }] },
      { id: "09", name: "Girona", municipalities: [{ id: "17001", name: "Girona" }] }
    ]
  }
];

export function getCommunities() {
  return COMMUNITIES.map(c => ({ id: c.id, name: c.name }));
}
export function getProvinces(communityId) {
  const comm = COMMUNITIES.find(c => c.id === communityId);
  return comm ? comm.provinces.map(p => ({ id: p.id, name: p.name })) : [];
}
export function getMunicipalities(provinceId) {
  for (const comm of COMMUNITIES) {
    const prov = comm.provinces.find(p => p.id === provinceId);
    if (prov) return prov.municipalities.map(m => ({ id: m.id, name: m.name }));
  }
  return [];
}
export function findLocation(query) {
  const q = query.trim().toLowerCase();
  const results = [];
  for (const comm of COMMUNITIES) {
    if (comm.name.toLowerCase().includes(q)) results.push({ type: "community", id: comm.id, name: comm.name });
    for (const prov of comm.provinces) {
      if (prov.name.toLowerCase().includes(q)) results.push({ type: "province", id: prov.id, name: prov.name, communityId: comm.id });
      for (const mun of prov.municipalities) {
        if (mun.name.toLowerCase().includes(q)) results.push({ type: "municipality", id: mun.id, name: mun.name, provinceId: prov.id, communityId: comm.id });
      }
    }
  }
  return results;
}
