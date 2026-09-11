/**
 * CocheMotor — Central Editorial, Product & Multi-User SaaS Configuration
 * Metodología BIG School Webs & Arquitectura Multi-Tenant Aislada
 */

const siteConfig = {
  metadata: {
    title: "CocheMotor — Marketplace Digital & Hub SaaS para Profesionales del Motor",
    description: "La plataforma integral para talleres mecánicos, compraventas freelance y particulares en España: stock verificado en 100 puntos, trazabilidad DGT, generador multicanal con IA y scoring de leads.",
    canonical: "https://cochemotor.es",
    domain: "cochemotor.es",
    language: "es-ES",
  },

  brand: {
    name: "CocheMotor",
    tagline: "Marketplace Digital",
    promise: "Vehículos de ocasión con mecánica peritada y suite SaaS para profesionales.",
    contactWhatsapp: "34612345678",
    logoLight: "assets/brand/cochemotor_logo_azul_con_tagline.png",
    logoDark: "assets/brand/cochemotor_logo_blanco_sin_tagline.png",
    pistonIcon: "assets/brand/cochemotor_piston_azul_transparente.png",
    faviconSvg: "assets/brand/favicon.svg",
  },

  navigation: [
    { label: "Marketplace VO", href: "marketplace.html" },
    { label: "Coches a la Carta", href: "demanda.html" },
    { label: "Mecánica Verificada", href: "index.html#ingenieria" },
    { label: "Los 3 Pilares", href: "index.html#pilares" },
    { label: "Hub Profesional", href: "hub.html" },
    { label: "Planes & Tarifas", href: "index.html#planes" },
    { label: "FAQ", href: "index.html#faq" },
  ],

  // Cuentas de Profesionales Sintéticas para Demostración Multi-Usuario
  users: [
    {
      id: "user-juan",
      name: "Juan Gómez",
      businessName: "Juan Gómez Automoción VO",
      role: "Freelance Independiente",
      location: "Madrid Capital",
      province: "Madrid",
      community: "Comunidad de Madrid",
      phone: "34612345678",
      email: "juan.gomez@cochemotor.es",
      avatar: "👨‍💼",
      plan: "Premium (30 Días de Prueba)",
      isPremium: true,
      referralCode: "MOTOR-JUAN-2026",
    },
    {
      id: "user-garcia",
      name: "Talleres Hnos. García",
      businessName: "Hnos. García Taller & VO",
      role: "Taller Mecánico Partner",
      location: "Alcorcón, Madrid",
      province: "Madrid",
      community: "Comunidad de Madrid",
      phone: "34655112233",
      email: "garcia.taller@cochemotor.es",
      avatar: "🔧",
      plan: "Premium (30 Días de Prueba)",
      isPremium: true,
      referralCode: "MOTOR-GARCIA-2026",
    },
    {
      id: "user-baviera",
      name: "Baviera Motors",
      businessName: "Baviera Motors Concesionario",
      role: "Concesionario Multimarca",
      location: "Zaragoza Centro",
      province: "Zaragoza",
      community: "Aragón",
      phone: "34677990011",
      email: "contacto@bavieramotors.es",
      avatar: "🏢",
      plan: "Premium (30 Días de Prueba)",
      isPremium: true,
      referralCode: "MOTOR-BAVIERA-2026",
    },
  ],

  chapters: {
    chapter1_hero: {
      eyebrow: "MARKETPLACE & PLATAFORMA SAAS B2B DE AUTOMOCIÓN",
      headline: ["Coches de Segunda Mano.", "Con Mecánica Verificada.", "Sin Vicios Ocultos."],
      subhead: "Unimos a talleres mecánicos homologados, compraventas independientes y compradores en una plataforma que combina certificación pericial en 100 puntos, trazabilidad DGT y herramientas de automatización comercial.",
      ctaLabel: "Explorar Marketplace VO",
      ctaTarget: "marketplace.html",
      ctaHubLabel: "Probar Panel SaaS Gratis",
      ctaHubTarget: "hub.html",
      stats: [
        { value: "100", label: "Puntos de control pericial" },
        { value: "0 Cargas", label: "Informe DGT verificado" },
        { value: "12 Meses", label: "Garantía mecánica legal" },
      ],
    },

    chapter2_manifesto: {
      number: "CAPÍTULO 01",
      title: "La Verdad sobre Comprar y Vender Coche Usado en España",
      paragraphs: [
        "Comprar un vehículo de segunda mano en portales tradicionales se ha convertido en una ruleta rusa: cuentakilómetros manipulados, cajas de cambio al límite y embargos sorpresa en la DGT.",
        "Para los talleres mecánicos y pequeños compraventas, la situación no es mejor: horas perdidas respondiendo a 'mareantes' y curiosos en portales saturados, costes abusivos por anuncio y desconfianza del comprador particular.",
        "CocheMotor nace con un doble propósito innegociable: desterrar la desconfianza del comprador con mecánica certificada en 100 puntos y dotar al profesional independiente de una suite tecnológica de primer nivel.",
      ],
      quote: "Si un coche no supera la diagnosis OBD de motor o tiene cargas registrales, jamás entra en CocheMotor.",
    },

    chapter3_engineering: {
      number: "CAPÍTULO 02",
      title: "Ingeniería de Taller al Servicio del Comprador",
      subtitle: "Diagnosis por ordenador OBD, inspección en elevador de 100 puntos y prueba dinámica en carretera.",
    },

    chapter4_pillars: {
      number: "CAPÍTULO 03",
      title: "Los 3 Pilares del Sello CocheMotor",
      pillars: [
        {
          code: "01 / PERITAJE",
          title: "100 Puntos de Control Mecánico",
          description: "Revisión exhaustiva de compresión de cilindros, turbo, embrague, discos de freno, amortiguadores y lectura de kilometraje real en centralita (ECU).",
        },
        {
          code: "02 / DGT",
          title: "Trazabilidad Telemática DGT",
          description: "Informe oficial de la DGT emitido para cada coche: ausencia de embargos, precintos, reserva de dominio bancaria y verificación de ITV en vigor.",
        },
        {
          code: "03 / GARANTÍA",
          title: "12 Meses de Cobertura Legal Real",
          description: "Garantía mecánica obligatoria conforme a la Ley de Consumidores y Usuarios, respaldada por talleres asociados y pólizas certificadas.",
        },
      ],
    },

    chapter5_experience: {
      number: "CAPÍTULO 04",
      title: "Transparencia Total desde tu Móvil",
      subtitle: "Contacta directamente con el taller o compraventa por WhatsApp en menos de 15 minutos, solicita vídeo en directo del motor y agenda tu prueba sin compromiso.",
    },

    chapter6_catalog: {
      number: "CAPÍTULO 05",
      title: "Stock Disponible con Mecánica Verificada",
      subtitle: "Vehículos listos para entrega inmediata con distintivo ambiental DGT.",
    },

    chapter7_faq: {
      number: "CAPÍTULO 06",
      title: "Preguntas Frecuentes de Decisión",
      items: [
        {
          q: "¿Quién realiza la revisión mecánica de los vehículos?",
          a: "La inspección es realizada por talleres mecánicos profesionales homologados por la red CocheMotor, siguiendo una plantilla de peritaje estandarizada de 100 puntos y diagnosis OBD.",
        },
        {
          q: "¿Cómo sé si el coche tiene etiqueta para Zonas de Bajas Emisiones (ZBE)?",
          a: "Cada ficha técnica indica con claridad el distintivo oficial de la DGT (0 Emisiones, ECO, C o B) y su aptitud para circular sin restricciones en Madrid, Barcelona y ciudades de más de 50.000 habitantes.",
        },
        {
          q: "¿Qué herramientas incluye el Hub SaaS para profesionales?",
          a: "Incluye Generador Multicanal con IA para portales (Coches.net, Wallapop, Milanuncios), Embudo de Ventas Kanban, Copiloto IA de rotación y precios, Bolsa de pedidos y Cartelería de Parabrisas con código QR.",
        },
        {
          q: "¿Puedo entregar mi coche actual como parte de pago?",
          a: "Sí. Nuestros talleres y compraventas asociados realizan tasaciones directas en el acto para descontar el valor de tu coche usado del precio final.",
        },
        {
          q: "¿Cómo se formaliza la compra y el cambio de titularidad?",
          a: "Todo se realiza mediante contrato mercantil transparente y transferencia telemática a través de gestoría administrativa colegiada, con justificante profesional instantáneo.",
        },
      ],
    },

    chapter8_contact: {
      number: "CAPÍTULO 07",
      title: "¿Eres Taller Mecánico o Compraventa Independiente?",
      subtitle: "Únete a la red de CocheMotor. Anuncia tu stock verificado, recibe leads cualificados por WhatsApp y multiplica tu rotación de vehículos.",
      formAction: "#",
    },
  },

  // Testimonios B2B
  testimonials: [
    {
      quote: "Pasamos de perder 3 horas al día respondiendo a curiosos a cerrar ventas en 48 horas. El Generador Multicanal y el informe de 100 puntos le dan una credibilidad imbatible a nuestros coches.",
      author: "Manuel Delgado",
      role: "Director de Operaciones · Automoción Delgado (Madrid)",
      metrics: "+35% de rotación de stock",
    },
    {
      quote: "El Lead Scoring de compradores por WhatsApp nos ha cambiado la vida. Mis comerciales solo llaman a quienes tienen liquidez real o coche para tasar. Menos llamadas, más operaciones firmadas.",
      author: "Carmen Navarro",
      role: "Gerente de Ventas · Costa Cars VO (Valencia)",
      metrics: "Ahorro de 14 h/semana",
    },
    {
      quote: "Poner la ficha pericial con código QR en el parabrisas de los coches de la campa es una máquina de captar clientes que pasean por el polígono los fines de semana.",
      author: "Javier Mendoza",
      role: "Propietario · Taller y Compraventa SurMotor (Sevilla)",
      metrics: "100% de coches con garantía",
    },
  ],

  // Planes B2B
  pricing: [
    {
      id: "plan-starter",
      name: "Starter Freelance",
      tagline: "Para compraventas independientes que quieren profesionalizar su venta.",
      priceMonthly: 49,
      priceAnnual: 39,
      popular: false,
      features: [
        "Publicación ilimitada de stock",
        "Fichas públicas con distintivo DGT",
        "Generador multicanal para portales",
        "Cartelería de parabrisas con QR",
        "Embudo de ventas y leads WhatsApp",
        "30 Días de Prueba Gratuita Completa",
      ],
      cta: "Comenzar 30 Días Gratis",
    },
    {
      id: "plan-taller",
      name: "Taller Mecánico Partner",
      tagline: "Para talleres mecánicos que quieren vender stock propio verificado.",
      priceMonthly: 99,
      priceAnnual: 79,
      popular: true,
      features: [
        "Stock ilimitado de vehículos",
        "Distintivo oficial 'Sello Taller Homologado'",
        "Certificación de 100 puntos periciales",
        "Generador Multicanal IA avanzado",
        "Lead Scoring predictivo de compradores",
        "Copiloto IA de rotación y precios",
        "Prioridad de visibilidad en el Marketplace",
      ],
      cta: "Comenzar Prueba Gratuita",
    },
    {
      id: "plan-concesionario",
      name: "Concesionario Pro",
      tagline: "Para concesionarios multimarca y redes con equipo comercial.",
      priceMonthly: 199,
      priceAnnual: 159,
      popular: false,
      features: [
        "Stock ilimitado de vehículos",
        "Multi-usuario para todo el equipo",
        "Gestión centralizada de leads WhatsApp",
        "Bolsa de pedidos (Coches a la carta)",
        "Garantías mecánicas con tarifa mayorista",
        "Account Manager y soporte telefónico VIP",
      ],
      cta: "Contactar Asesoría",
    },
  ],

  // Inventario de Stock Sintético con Trazabilidad Geográfica por España
  stock: [
    {
      id: "cm-001",
      userId: "user-garcia",
      brand: "Volkswagen",
      model: "Golf",
      version: "2.0 TDI Advance 150 CV",
      year: 2020,
      km: "68.000 km",
      fuel: "Diésel",
      gearbox: "Manual 6 vel.",
      badge: "C",
      badgeClass: "badge-c",
      price: 16900,
      monthlyPrice: "215 €/mes",
      cost: 13200,
      dealer: "Talleres Hnos. García (Madrid)",
      sellerName: "Talleres Hnos. García",
      sellerPhone: "34655112233",
      location: "Alcorcón",
      province: "Madrid",
      community: "Comunidad de Madrid",
      image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80",
      inspectionScore: "98/100",
      itvDate: "Noviembre 2025",
      warranty: "12 Meses Europea",
      dgtStatus: "Informe Limpio (Sin Cargas)",
      highlights: ["Distribución recién cambiada", "Neumáticos Michelin nuevos", "Un solo propietario", "Historial en concesionario oficial"],
      stage: "leads_activos",
      status: "disponible",
      daysInStock: 12,
      clicksCount: 42,
      leadsCount: 3,
      estimatedMarketPrice: 16800,
    },
    {
      id: "cm-002",
      userId: "user-juan",
      brand: "Toyota",
      model: "Yaris",
      version: "1.5 125H Hybrid Active",
      year: 2021,
      km: "35.000 km",
      fuel: "Híbrido (HEV)",
      gearbox: "Automático e-CVT",
      badge: "ECO",
      badgeClass: "badge-eco",
      price: 15500,
      monthlyPrice: "195 €/mes",
      cost: 12800,
      dealer: "Juan Gómez Automoción (Madrid)",
      sellerName: "Juan Gómez (Freelance VO)",
      sellerPhone: "34612345678",
      location: "Madrid Centro",
      province: "Madrid",
      community: "Comunidad de Madrid",
      image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
      inspectionScore: "100/100",
      itvDate: "Enero 2026",
      warranty: "12 Meses Toyota Relax",
      dgtStatus: "Informe Limpio (Sin Cargas)",
      highlights: ["Etiqueta ECO sin restricciones ZBE", "Consumo medio 3.8 L/100km", "Batería híbrida certificada", "Cámara de visión trasera"],
      stage: "publicado",
      status: "disponible",
      daysInStock: 5,
      clicksCount: 28,
      leadsCount: 2,
      estimatedMarketPrice: 15700,
    },
    {
      id: "cm-003",
      userId: "user-juan",
      brand: "Peugeot",
      model: "3008",
      version: "1.5 BlueHDi Allure 130 CV",
      year: 2021,
      km: "52.000 km",
      fuel: "Diésel",
      gearbox: "Automático EAT8",
      badge: "C",
      badgeClass: "badge-c",
      price: 18900,
      monthlyPrice: "240 €/mes",
      cost: 15200,
      dealer: "Juan Gómez Automoción (Madrid)",
      sellerName: "Juan Gómez (Freelance VO)",
      sellerPhone: "34612345678",
      location: "Getafe",
      province: "Madrid",
      community: "Comunidad de Madrid",
      image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
      inspectionScore: "96/100",
      itvDate: "Mayo 2026",
      warranty: "12 Meses Completa",
      dgtStatus: "Informe Limpio (Sin Cargas)",
      highlights: ["SUV familiar con maletero de 520 L", "i-Cockpit digital con navegador 3D", "Frenada de emergencia activa", "ITV recién pasada"],
      stage: "prueba_en_taller",
      status: "disponible",
      daysInStock: 34,
      clicksCount: 11,
      leadsCount: 1,
      estimatedMarketPrice: 17200,
    },
    {
      id: "cm-004",
      userId: "user-baviera",
      brand: "BMW",
      model: "Serie 3",
      version: "320d Touring M Sport 190 CV",
      year: 2022,
      km: "42.000 km",
      fuel: "Diésel Mild-Hybrid",
      gearbox: "Automático Steptronic 8v",
      badge: "ECO",
      badgeClass: "badge-eco",
      price: 28900,
      monthlyPrice: "365 €/mes",
      cost: 23500,
      dealer: "Baviera Motors VO (Zaragoza)",
      sellerName: "Baviera Motors",
      sellerPhone: "34677990011",
      location: "Zaragoza Centro",
      province: "Zaragoza",
      community: "Aragón",
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
      inspectionScore: "99/100",
      itvDate: "Octubre 2026",
      warranty: "12 Meses Premium",
      dgtStatus: "Informe Limpio (Sin Cargas)",
      highlights: ["Paquete aerodinámico M Sport", "Faros Láser adaptativos", "Etiqueta ECO microhíbrida", "Mantenimiento incluido"],
      stage: "publicado",
      status: "disponible",
      daysInStock: 2,
      clicksCount: 0,
      leadsCount: 0,
      estimatedMarketPrice: 28500,
    },
  ],

  // Demanda activa de particulares: "Coches a la carta" (Marketplace Inverso)
  demandOrders: [
    {
      id: "ord-001",
      buyerName: "Alejandro R.",
      location: "Madrid / Toledo",
      community: "Comunidad de Madrid",
      province: "Madrid",
      budgetMax: 18000,
      requiredType: "SUV o Compacto Diésel / Híbrido",
      requiredBadge: "ECO o C",
      maxKm: "70.000 km",
      urgency: "Menos de 15 días (Coche averiado)",
      paymentPlan: "Financiación bancaria pre-aprobada",
      tradeIn: "Tiene Seat León 2012 para tasar",
      status: "Abierta",
      responsesCount: 2,
      date: "Hace 2 días",
    },
    {
      id: "ord-002",
      buyerName: "Elena V.",
      location: "Valencia / Alicante",
      community: "Comunidad Valenciana",
      province: "Valencia",
      budgetMax: 16000,
      requiredType: "Híbrido Urbano o Utilitario",
      requiredBadge: "ECO",
      maxKm: "50.000 km",
      urgency: "Inmediata (necesidad ZBE)",
      paymentPlan: "Al contado por transferencia",
      tradeIn: "Sin coche a cambio",
      status: "Abierta",
      responsesCount: 1,
      date: "Ayer",
    },
    {
      id: "ord-003",
      buyerName: "Carlos M.",
      location: "Sevilla / Málaga",
      community: "Andalucía",
      province: "Sevilla",
      budgetMax: 30000,
      requiredType: "Berlina o Familiar Automático",
      requiredBadge: "ECO o C",
      maxKm: "80.000 km",
      urgency: "En los próximos 30 días",
      paymentPlan: "Financiación CocheMotor",
      tradeIn: "Pendiente de valorar",
      status: "Abierta",
      responsesCount: 0,
      date: "Hoy",
    },
  ],
};

// Capa de Almacenamiento Reactiva y Persistente Multi-Tenant (LocalStorage + Memoria)
const CocheMotorStorage = {
  STORAGE_KEYS: {
    STOCK: "cochemotor_stock_v2",
    LEADS: "cochemotor_leads_v2",
    ORDERS: "cochemotor_orders_v2",
    ACTIVE_USER: "cochemotor_active_user_v2",
    BUYER_REG: "cochemotor_buyer_registered_v2",
  },

  getActiveUserId() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.ACTIVE_USER);
      if (stored) return stored;
    } catch (e) {}
    return "user-juan";
  },

  setActiveUserId(userId) {
    try {
      localStorage.setItem(this.STORAGE_KEYS.ACTIVE_USER, userId);
    } catch (e) {}
    return userId;
  },

  getActiveUser() {
    const uid = this.getActiveUserId();
    return siteConfig.users.find(u => u.id === uid) || siteConfig.users[0];
  },

  getAllPublicStock() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.STOCK);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {}
    // Inicializar con todo el stock
    const initial = siteConfig.stock.slice();
    this.saveAllStock(initial);
    return initial;
  },

  getStock(userId = null) {
    const all = this.getAllPublicStock();
    const targetUserId = (userId !== null) ? userId : this.getActiveUserId();
    if (targetUserId === 'all') return all;
    return all.filter(v => (v.userId || "user-juan") === targetUserId);
  },

  saveAllStock(stockList) {
    try {
      localStorage.setItem(this.STORAGE_KEYS.STOCK, JSON.stringify(stockList));
    } catch (e) {}
  },

  saveVehicle(vehicle) {
    const stock = this.getAllPublicStock();
    const activeUser = this.getActiveUser();
    
    // Asegurar vinculación con el usuario activo si no viene especificado
    if (!vehicle.userId) {
      vehicle.userId = activeUser.id;
      vehicle.dealer = activeUser.businessName;
      vehicle.sellerName = activeUser.name;
      vehicle.sellerPhone = activeUser.phone;
      vehicle.province = activeUser.province;
      vehicle.community = activeUser.community;
      vehicle.location = activeUser.location;
    }

    const existingIndex = stock.findIndex(v => v.id === vehicle.id);
    if (existingIndex >= 0) {
      stock[existingIndex] = { ...stock[existingIndex], ...vehicle };
    } else {
      stock.unshift(vehicle);
    }
    this.saveAllStock(stock);
    return vehicle;
  },

  getVehicleById(id) {
    return this.getAllPublicStock().find(v => v.id === id) || null;
  },

  updateVehicleStage(vehicleId, newStage) {
    const stock = this.getAllPublicStock();
    const v = stock.find(item => item.id === vehicleId);
    if (v) {
      v.stage = newStage;
      if (newStage === "vendido") {
        v.status = "vendido";
      } else if (newStage === "reserva_dgt") {
        v.status = "reservado";
      } else {
        v.status = "disponible";
      }
      this.saveAllStock(stock);
    }
    return v;
  },

  getLeads(userId = null) {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.LEADS);
      if (stored) {
        const allLeads = JSON.parse(stored);
        const targetUserId = (userId !== null) ? userId : this.getActiveUserId();
        if (targetUserId === 'all') return allLeads;
        return allLeads.filter(l => (l.sellerUserId || "user-juan") === targetUserId);
      }
    } catch (e) {}

    const defaultLeads = [
      {
        id: "lead-101",
        sellerUserId: "user-juan",
        vehicleId: "cm-002",
        vehicleTitle: "Toyota Yaris Hybrid",
        buyerName: "Laura Benítez",
        phone: "34677889900",
        email: "laura.b@outlook.es",
        paymentMethod: "Al contado",
        tradeIn: "No",
        score: 95,
        scoreTag: "Muy Caliente",
        date: "Hoy, 11:20",
        status: "Nuevo Lead Entrante",
        notes: "Pregunta si la batería híbrida tiene garantía Toyota Relax activa.",
      },
      {
        id: "lead-102",
        sellerUserId: "user-juan",
        vehicleId: "cm-003",
        vehicleTitle: "Peugeot 3008 Allure",
        buyerName: "Marcos Serrano",
        phone: "34655443322",
        email: "marcos.s@gmail.com",
        paymentMethod: "Financiado",
        tradeIn: "Sí (Seat Ibiza 2011)",
        score: 91,
        scoreTag: "Caliente",
        date: "Ayer, 18:45",
        status: "Prueba Agendada",
        notes: "Quiere tasar coche usado en taller y financiar a 72 meses.",
      },
      {
        id: "lead-103",
        sellerUserId: "user-garcia",
        vehicleId: "cm-001",
        vehicleTitle: "Volkswagen Golf 2.0 TDI",
        buyerName: "David Muñoz",
        phone: "34611223344",
        email: "david.m@gmail.com",
        paymentMethod: "Al contado",
        tradeIn: "No",
        score: 94,
        scoreTag: "Muy Caliente",
        date: "Hoy, 09:15",
        status: "Cita Fijada",
        notes: "Viene de Madrid sur a probarlo en elevador.",
      },
    ];

    try {
      localStorage.setItem(this.STORAGE_KEYS.LEADS, JSON.stringify(defaultLeads));
    } catch (e) {}

    const targetUserId = (userId !== null) ? userId : this.getActiveUserId();
    return defaultLeads.filter(l => (l.sellerUserId || "user-juan") === targetUserId);
  },

  saveAllLeads(leads) {
    try {
      localStorage.setItem(this.STORAGE_KEYS.LEADS, JSON.stringify(leads));
    } catch (e) {}
  },

  addLead(lead) {
    let allLeads = [];
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.LEADS);
      if (stored) allLeads = JSON.parse(stored);
    } catch (e) {}

    // Vincular con el vendedor del vehículo
    const v = this.getVehicleById(lead.vehicleId);
    lead.sellerUserId = v ? (v.userId || "user-juan") : this.getActiveUserId();

    allLeads.unshift(lead);
    this.saveAllLeads(allLeads);

    // Incrementar métricas del coche
    if (v) {
      v.leadsCount = (v.leadsCount || 0) + 1;
      if (v.stage === "publicado") v.stage = "leads_activos";
      this.saveVehicle(v);
    }
    return lead;
  },

  getOrders() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.ORDERS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return siteConfig.demandOrders || [];
  },

  saveAllOrders(orders) {
    try {
      localStorage.setItem(this.STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {}
  },

  addOrder(order) {
    const orders = this.getOrders();
    orders.unshift(order);
    this.saveAllOrders(orders);
    return order;
  },

  postulateOrder(orderId, vehicleId) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.responsesCount = (order.responsesCount || 0) + 1;
      order.lastPostulatedVehicleId = vehicleId;
      this.saveAllOrders(orders);
    }
    return order;
  },

  isBuyerRegistered() {
    try {
      return localStorage.getItem(this.STORAGE_KEYS.BUYER_REG) === 'true';
    } catch (e) {
      return false;
    }
  },

  setBuyerRegistered(userData) {
    try {
      localStorage.setItem(this.STORAGE_KEYS.BUYER_REG, 'true');
      localStorage.setItem("cochemotor_buyer_data", JSON.stringify(userData));
    } catch (e) {}
  },

  getReferralAccount() {
    const user = this.getActiveUser();
    return {
      partnerName: user.name,
      referralCode: user.referralCode || "MOTOR-JUAN-2026",
      referredCount: 3,
      freeMonthsEarned: 3,
      isGoldPartner: true,
      hasSharedStockAccess: false,
    };
  },
};
