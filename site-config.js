if (window.location.hostname === 'cochemotor.es' || window.location.hostname === 'www.cochemotor.es') {
  window.COCHEMOTOR_API_BASE = 'https://api.cochemotor.es';
  const nativeFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    if (typeof input === 'string' && input.startsWith('/api/')) input = window.COCHEMOTOR_API_BASE + input;
    return nativeFetch(input, init);
  };
}

/**
 * CocheMotor — Central Editorial, Product & Multi-User SaaS Configuration
 * Metodología BIG School Webs & Arquitectura Multi-Tenant Aislada
 */

const siteConfig = {
  priceSearchRanges: [
    { value: "all", label: "Sin límite de precio" },
    { value: "5000", label: "Hasta 5.000 €" },
    { value: "10000", label: "Hasta 10.000 €" },
    { value: "15000", label: "Hasta 15.000 €" },
    { value: "20000", label: "Hasta 20.000 €" },
    { value: "over25000", label: "Más de 25.000 €" }
  ],

  metadata: {
    title: "CocheMotor — Compra claro. Vende mejor.",
    description: "Marketplace y plataforma digital para encontrar vehículos de ocasión, conectar con profesionales y comprar con más información, confianza y seguridad.",
    canonical: "https://cochemotor.es",
    domain: "cochemotor.es",
    language: "es-ES",
  },

  brand: {
    name: "CocheMotor",
    tagline: "Compra claro. Vende mejor.",
    promise: "Marketplace y plataforma digital para comprar y vender vehículos de ocasión con más confianza y control.",
    contactWhatsapp: "34612345678",
    logoLight: "assets/brand/logos/cochemotor-horizontal-light.png",
    logoDark: "assets/brand/logos/cochemotor-horizontal-dark.png",
    logoTransparent: "assets/brand/logos/cochemotor-horizontal-light.png",
    faviconSvg: "assets/brand/favicons/cochemotor-favicon.png",
    appIcon: "assets/brand/icons/cochemotor-app-icon.png",
    colors: {
      navy: "#002D62",
      red: "#D02828",
      burgundy: "#8F1D2C",
      green: "#18A66A",
      white: "#FFFFFF",
      gray: "#F3F5F7",
      graphite: "#3C3F41"
    }
  },

  navigation: [
    { label: "Coches de ocasión", href: "marketplace.html" },
    { label: "Coche Ideal", href: "demanda.html" },
    { label: "Revisión mecánica", href: "index.html#ingenieria" },
    { label: "Cómo funciona", href: "index.html#pilares" },
    { label: "Hub Profesional", href: "hub.html" },
    { label: "Planes & Tarifas", href: "index.html#planes" },
    { label: "FAQ", href: "index.html#faq" },
  ],

  // Cuentas de Profesionales Sintéticas con soporte para Web Propia / Subdominio
  users: [
    {
      id: "user-juan",
      isDemo: true,
      slug: "juan-gomez",
      subdomain: "juangomez",
      name: "Juan Gómez",
      businessName: "Juan Gómez Automoción VO",
      role: "Freelance Independiente VO",
      location: "Madrid Capital (Barrio de Salamanca)",
      address: "Calle de Alcalá 210, 28028 Madrid",
      province: "Madrid",
      community: "Comunidad de Madrid",
      phone: "34612345678",
      email: "juan.gomez@cochemotor.es",
      avatar: "👨‍💼",
      heroCover: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80",
      rating: "4.9 ★ (48 reseñas)",
      reviewsCount: 48,
      plan: "Premium (30 Días de Prueba)",
      isPremium: true,
      referralCode: "MOTOR-JUAN-2026",
      badges: ["Perfil profesional", "Información aportada por el vendedor", "Consulta documentación e ITV", "Enlaces a trámites oficiales DGT"],
      bio: "Especialista en vehículos híbridos y compactos de ocasión con historial de mantenimiento íntegro en concesionario oficial. Transparencia absoluta, contratos mercantiles claros y entrega inmediata con informe DGT en mano.",
      services: [
        "Venta de stock peritado en 100 puntos",
        "Aceptamos tu coche usado como parte de pago",
        "Financiación a medida hasta 96 meses",
        "Garantía mecánica nacional de 12 meses",
        "Cambio de titularidad telemático en 24h"
      ],
      schedule: "Lunes a Viernes: 09:30 - 14:00 y 16:30 - 20:00 · Sábados: 10:00 - 14:00 (Cita previa)"
    },
    {
      id: "user-garcia",
      isDemo: true,
      slug: "talleres-garcia",
      subdomain: "talleresgarcia",
      name: "Talleres Hnos. García",
      businessName: "Hnos. García Taller Mecánico & VO",
      role: "Taller Mecánico Partner Homologado",
      location: "Alcorcón, Madrid Sur",
      address: "Polígono Industrial Urtinsa, C/ Mercurio 14, 28923 Alcorcón (Madrid)",
      province: "Madrid",
      community: "Comunidad de Madrid",
      phone: "34655112233",
      email: "garcia.taller@cochemotor.es",
      avatar: "🔧",
      heroCover: "https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&w=1200&q=80",
      rating: "4.8 ★ (84 reseñas)",
      reviewsCount: 84,
      plan: "Premium (30 Días de Prueba)",
      isPremium: true,
      referralCode: "MOTOR-GARCIA-2026",
      badges: ["Taller Homologado CocheMotor", "Diagnosis OBD Oficial", "Elevador Disponible", "Garantía de Taller"],
      bio: "Taller mecánico con más de 25 años de experiencia en la zona sur de Madrid. Ponemos a tu disposición vehículos de ocasión totalmente revisados en nuestras propias instalaciones con diagnosis por ordenador OBD y prueba en elevador delante de ti.",
      services: [
        "Vehículos revisados en taller propio en 100 puntos",
        "Revisión gratuita a los 6 meses de la compra",
        "Tasación y compra de vehículos averiados o con golpe",
        "Prueba en elevador antes de comprar",
        "Garantía directa sin intermediarios"
      ],
      schedule: "Lunes a Viernes: 08:30 - 19:30 (Ininterrumpido) · Sábados: 09:00 - 13:30"
    },
    {
      id: "user-baviera",
      isDemo: true,
      slug: "baviera-motors",
      subdomain: "baviera",
      name: "Baviera Motors",
      businessName: "Baviera Motors Concesionario Multimarca",
      role: "Concesionario Multimarca",
      location: "Zaragoza Centro",
      address: "Avenida de Valencia 45, 50005 Zaragoza",
      province: "Zaragoza",
      community: "Aragón",
      phone: "34677990011",
      email: "contacto@bavieramotors.es",
      avatar: "🏢",
      heroCover: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      rating: "4.9 ★ (112 reseñas)",
      reviewsCount: 112,
      plan: "Premium (30 Días de Prueba)",
      isPremium: true,
      referralCode: "MOTOR-BAVIERA-2026",
      badges: ["Concesionario Oficial Partner", "Gama Premium & ECO", "Garantía Europea 12 Meses", "Envío a Domicilio"],
      bio: "Selección exclusiva de vehículos seminuevos y de ocasión con etiqueta ECO y Cero Emisiones. Todos nuestros coches cuentan con certificación de no siniestralidad, kilometraje certificado y entrega en cualquier punto de la península.",
      services: [
        "Stock premium revisado y certificado",
        "Entrega a domicilio en toda España",
        "Financiación online inmediata con DNI",
        "Recompra garantizada a los 3 años",
        "Garantía europea ampliable a 24 meses"
      ],
      schedule: "Lunes a Viernes: 09:30 - 20:30 · Sábados: 10:00 - 14:00 y 17:00 - 20:00"
    }
  ],

  chapters: {
    chapter1_hero: {
      eyebrow: "COCHES DE OCASIÓN Y HERRAMIENTAS PARA PROFESIONALES",
      headline: ["Compra o vende coches de ocasión", "con más información y confianza."],
      subhead: "Encuentra coches revisados y consulta su información antes de decidir. Si eres profesional, publica tu inventario, organiza tus contactos y vende con menos trabajo.",
      ctaLabel: "Ver coches disponibles",
      ctaTarget: "marketplace.html",
      ctaHubLabel: "Probar el panel gratis 30 días",
      ctaHubTarget: "hub.html",
      stats: [
        { value: "DGT", label: "Acceso a fuentes oficiales" },
        { value: "Por anuncio", label: "Información indicada por el vendedor" },
        { value: "Antes de comprar", label: "Solicita y comprueba la documentación" },
      ],
    },

    chapter2_manifesto: {
      number: "CAPÍTULO 01",
      title: "Comprar y vender un coche de ocasión debería ser más sencillo",
      paragraphs: [
        "Comprar un coche usado es más fácil cuando puedes consultar su información antes de contactar con el vendedor.",
        "Los profesionales también necesitan herramientas sencillas para publicar sus coches, organizar consultas y hacer seguimiento sin perder tiempo.",
        "CocheMotor reúne anuncios, revisiones e información administrativa en un mismo lugar. Cada anuncio muestra las comprobaciones y condiciones que corresponden a ese coche.",
      ],
      quote: "Consulta la información disponible y pregunta al vendedor antes de decidir.",
    },

    chapter3_engineering: {
      number: "CAPÍTULO 02",
      title: "Revisión mecánica explicada paso a paso",
      subtitle: "Diagnosis por ordenador OBD, inspección en elevador de 100 puntos y prueba dinámica en carretera.",
    },

    chapter4_pillars: {
      number: "CAPÍTULO 03",
      title: "Qué comprobamos antes de publicar un coche",
      pillars: [
        {
          code: "01 / REVISIÓN",
          title: "Revisión mecánica en 100 puntos",
          description: "Consulta los aspectos revisados en cada anuncio y pide al vendedor cualquier detalle adicional que necesites.",
        },
        {
          code: "02 / DGT",
          title: "Informe de la DGT y situación administrativa",
          description: "Consulta la información administrativa disponible, como ITV y posibles embargos, precintos o reserva de dominio según el informe consultado.",
        },
        {
          code: "03 / GARANTÍA",
          title: "Garantía indicada en cada anuncio",
          description: "Revisa la duración y las condiciones de la garantía que ofrece el vendedor antes de comprar.",
        },
      ],
    },

    chapter5_experience: {
      number: "CAPÍTULO 04",
      title: "Consulta la información desde el móvil",
      subtitle: "Contacta directamente con el taller o compraventa por WhatsApp en menos de 15 minutos, solicita vídeo en directo del motor y agenda tu prueba sin compromiso.",
    },

    chapter6_catalog: {
      number: "CAPÍTULO 05",
      title: "Vehículos publicados por profesionales",
      subtitle: "Consulta disponibilidad y confirma el distintivo ambiental en la DGT.",
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
          q: "¿Qué herramientas incluye el Panel profesional para profesionales?",
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
      subtitle: "Únete a la red de CocheMotor. Publica tu stock, recibe consultas por WhatsApp y gestiona tus oportunidades desde un mismo lugar.",
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

  // Planes para profesionales
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
        "Bolsa de pedidos (Coches Coche Ideal)",
        "Garantías mecánicas con tarifa mayorista",
        "Account Manager y soporte telefónico VIP",
      ],
      cta: "Contactar Asesoría",
    },
  ],

  // Inventario de Stock Sintético con Trazabilidad Geográfica por España y Landing B2C
  stock: [
    {
      id: "cm-001",
      userId: "user-garcia",
      brand: "Volkswagen",
      model: "Golf",
      version: "2.0 TDI Advance 150 CV",
      year: 2020,
      km: "68.000 km",
      kmNumber: 68000,
      fuel: "Diésel",
      gearbox: "Manual 6 vel.",
      power: "150 CV",
      doors: 5,
      color: "Gris Tungsteno Metalizado",
      badge: "C",
      badgeClass: "badge-c",
      price: 16900,
      monthlyPrice: "215 €/mes",
      cost: 13200,
      dealer: "Talleres Hnos. García (Madrid)",
      dealerSlug: "talleres-garcia",
      sellerName: "Talleres Hnos. García",
      sellerPhone: "34655112233",
      location: "Alcorcón",
      province: "Madrid",
      community: "Comunidad de Madrid",
      vin: "WVWZZZAUZLW048921",
      image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80",
      photos: [
        "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80"
      ],
      inspectionScore: "",
      itvDate: "",
      warranty: "",
      dgtStatus: "No consultado",
      inspectionDetails: {
        motor: "100% OK · Compresión de 28 bar uniforme en 4 cilindros, turbo Garrett sin holgura axial y sin fugas.",
        transmision: "100% OK · Embrague bimasa con 85% de vida remanente, sincronizadores de caja de 6v suaves.",
        frenos: "95% OK · Discos delanteros ventilados con 80% de grosor, pastillas Ferodo recién cambiadas.",
        chasis: "100% OK · Sin deformaciones en torretas ni largueros, silentblocks y rótulas sin holguras.",
        obd: "100% OK · Diagnosis VAG-COM sin averías registradas (0 fallos DTC en motor, ABS y airbags)."
      },
      dgtReport: {
        cargas: "0 Cargas Registrales",
        embargos: "Libre de Embargos y Precintos DGT",
        reserva: "Sin Reserva de Dominio Financiera",
        itv: "Favorable sin defectos graves",
        titulares: "1 Único Titular Particular Anterior"
      },
      highlights: ["Distribución y bomba de agua cambiadas", "Neumáticos Michelin Primacy nuevos", "Un solo propietario particular", "Historial completo en servicio oficial"],
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
      kmNumber: 35000,
      fuel: "Híbrido (HEV)",
      gearbox: "Automático e-CVT",
      power: "116 CV",
      doors: 5,
      color: "Blanco Perlado",
      badge: "ECO",
      badgeClass: "badge-eco",
      price: 15500,
      monthlyPrice: "195 €/mes",
      cost: 12800,
      dealer: "Juan Gómez Automoción (Madrid)",
      dealerSlug: "juan-gomez",
      sellerName: "Juan Gómez (Freelance VO)",
      sellerPhone: "34612345678",
      location: "Madrid Centro",
      province: "Madrid",
      community: "Comunidad de Madrid",
      vin: "VNKKHAC370A102834",
      image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80",
      photos: [
        "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80"
      ],
      inspectionScore: "",
      itvDate: "",
      warranty: "",
      dgtStatus: "No consultado",
      inspectionDetails: {
        motor: "100% OK · Sistema híbrido Toyota HSD impecable con test de salud de batería certificado.",
        transmision: "100% OK · Transmisión e-CVT con engranajes planetarios sin desgaste ni tirones.",
        frenos: "100% OK · Frenada regenerativa óptima, discos sin desgaste apreciable.",
        chasis: "100% OK · Estructura original de fábrica, pintura original en todas las piezas metálicas.",
        obd: "100% OK · Diagnosis oficial Toyota Techstream con 0 fallos de sistema híbrido."
      },
      dgtReport: {
        cargas: "0 Cargas Registrales",
        embargos: "Libre de Embargos y Precintos DGT",
        reserva: "Sin Reserva de Dominio Financiera",
        itv: "Primera ITV en 2025 superada limpia",
        titulares: "1 Propietaria particular de Madrid"
      },
      highlights: ["Etiqueta ECO sin restricciones ZBE en Madrid y Barcelona", "Consumo real homologado 3.8 L/100km", "Batería híbrida con garantía Toyota Relax", "Cámara de visión trasera y Apple CarPlay / Android Auto"],
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
      kmNumber: 52000,
      fuel: "Diésel",
      gearbox: "Automático EAT8",
      power: "130 CV",
      doors: 5,
      color: "Azul Célebes Metalizado",
      badge: "C",
      badgeClass: "badge-c",
      price: 18900,
      monthlyPrice: "240 €/mes",
      cost: 15200,
      dealer: "Juan Gómez Automoción (Madrid)",
      dealerSlug: "juan-gomez",
      sellerName: "Juan Gómez (Freelance VO)",
      sellerPhone: "34612345678",
      location: "Getafe",
      province: "Madrid",
      community: "Comunidad de Madrid",
      vin: "VF3MCYHZJMS098762",
      image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
      photos: [
        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80"
      ],
      inspectionScore: "",
      itvDate: "",
      warranty: "",
      dgtStatus: "No consultado",
      inspectionDetails: {
        motor: "96% OK · Cadena de árboles de levas de 8mm reforzada comprobada, sistema AdBlue verificado.",
        transmision: "100% OK · Caja automática Aisin EAT8 con cambios imperceptibles y convertidor perfecto.",
        frenos: "95% OK · Discos y pastillas delanteras al 85%, líquido de frenos DOT4 recién sustituido.",
        chasis: "100% OK · Suspensión equilibrada en banco MAHA, amortiguadores al 90%.",
        obd: "100% OK · Diagnosis multimarca sin errores de inyección ni de filtro de partículas FAP."
      },
      dgtReport: {
        cargas: "0 Cargas Registrales",
        embargos: "Libre de Embargos y Precintos DGT",
        reserva: "Sin Reserva de Dominio",
        itv: "ITV en vigor hasta Mayo 2026",
        titulares: "1 Titular particular en España"
      },
      highlights: ["SUV espacioso con maletero de 520 Litros", "Peugeot i-Cockpit digital con pantalla táctil de 10 pulgadas", "Frenada de emergencia autónoma y aviso de cambio de carril", "ITV recién pasada y libro de revisiones sellado"],
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
      kmNumber: 42000,
      fuel: "Diésel Mild-Hybrid",
      gearbox: "Automático Steptronic 8v",
      power: "190 CV",
      doors: 5,
      color: "Portimao Blau Metalizado",
      badge: "ECO",
      badgeClass: "badge-eco",
      price: 28900,
      monthlyPrice: "365 €/mes",
      cost: 23500,
      dealer: "Baviera Motors VO (Zaragoza)",
      dealerSlug: "baviera-motors",
      sellerName: "Baviera Motors",
      sellerPhone: "34677990011",
      location: "Zaragoza Centro",
      province: "Zaragoza",
      community: "Aragón",
      vin: "WBA31DX060FP92143",
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
      photos: [
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80"
      ],
      inspectionScore: "",
      itvDate: "",
      warranty: "",
      dgtStatus: "No consultado",
      inspectionDetails: {
        motor: "100% OK · Motor B47D20 microhíbrido de 48V impecable, cadena de distribución en cota nominal.",
        transmision: "100% OK · Caja ZF 8HP50 con cambio rápido y fluido en perfecto estado de viscosidad.",
        frenos: "100% OK · Frenos deportivos M con pinzas azules y discos ventilados impecables.",
        chasis: "100% OK · Suspensión adaptativa M con dureza variable verificada telemáticamente.",
        obd: "100% OK · Diagnosis BMW ISTA con 0 fallos de centralita ECU y batería 48V al 100%."
      },
      dgtReport: {
        cargas: "0 Cargas Registrales",
        embargos: "Libre de Embargos y Precintos DGT",
        reserva: "Sin Reserva de Dominio Financiera",
        itv: "Primera ITV en 2026",
        titulares: "1 Titular corporativo de dirección"
      },
      highlights: ["Paquete aerodinámico M Sport exterior e interior", "Faros Láser adaptativos con asistente de luces largas", "Etiqueta ECO microhíbrida de 48V", "Mantenimiento BSI BMW pagado hasta 100.000 km"],
      stage: "publicado",
      status: "disponible",
      daysInStock: 2,
      clicksCount: 0,
      leadsCount: 0,
      estimatedMarketPrice: 28500,
    },
  ],

  // Demanda activa de particulares: "Coches Coche Ideal" (Marketplace Inverso)
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

  // Definición oficial de las 13 etapas del ciclo de vida del vehículo (Spec 003 / Documento Maestro)
  VEHICLE_LIFECYCLE_STAGES: [
    { key: "captado", label: "1. Captado / Entrada", icon: "📥", badgeClass: "status-gray" },
    { key: "en_verificacion", label: "2. En Verificación", icon: "🔍", badgeClass: "status-amber" },
    { key: "en_puesta_a_punto", label: "3. En Puesta a Punto", icon: "🔧", badgeClass: "status-amber" },
    { key: "listo_para_publicar", label: "4. Listo para Publicar", icon: "✨", badgeClass: "status-blue" },
    { key: "publicado", label: "5. Publicado / Activo", icon: "📢", badgeClass: "status-green" },
    { key: "lead_activo", label: "6. Lead Activo", icon: "💬", badgeClass: "status-cyan" },
    { key: "prueba_concertada", label: "7. Prueba Concertada", icon: "🚗", badgeClass: "status-purple" },
    { key: "reservado", label: "8. Reservado", icon: "🔒", badgeClass: "status-amber" },
    { key: "contrato_pendiente", label: "9. Contrato Pendiente", icon: "📄", badgeClass: "status-amber" },
    { key: "vendido", label: "10. Vendido", icon: "🎉", badgeClass: "status-green" },
    { key: "entregado", label: "11. Entregado", icon: "🤝", badgeClass: "status-green" },
    { key: "en_posventa", label: "12. En Posventa", icon: "🛡️", badgeClass: "status-blue" },
    { key: "retirado", label: "13. Retirado", icon: "📦", badgeClass: "status-gray" }
  ],
};

function populatePriceSearchSelect(select, selectedValue = "all", noLimitLabel) {
  if (!select || !Array.isArray(siteConfig.priceSearchRanges)) return;
  const ranges = siteConfig.priceSearchRanges.map(range => ({ ...range }));
  if (noLimitLabel) ranges[0].label = noLimitLabel;

  // Keep existing shared links with numeric price thresholds working.
  const legacyValue = String(selectedValue || "all");
  if (legacyValue !== "all" && legacyValue !== "over25000" &&
      /^\d+$/.test(legacyValue) && !ranges.some(range => range.value === legacyValue)) {
    ranges.splice(ranges.length - 1, 0, {
      value: legacyValue,
      label: `Hasta ${Number(legacyValue).toLocaleString("es-ES")} €`
    });
  }

  select.replaceChildren(...ranges.map(range => {
    const option = document.createElement("option");
    option.value = range.value;
    option.textContent = range.label;
    return option;
  }));
  select.value = ranges.some(range => range.value === legacyValue) ? legacyValue : "all";
}

function matchesPriceSearchRange(price, range) {
  const amount = Number(price);
  if (!Number.isFinite(amount)) return false;
  if (range === "all" || range === "") return true;
  if (range === "over25000") return amount > 25000;
  const maximum = Number(range);
  return Number.isFinite(maximum) && maximum > 0 && amount <= maximum;
}

// Capa de Almacenamiento Reactiva y Persistente Multi-Tenant (LocalStorage + Memoria)
const CocheMotorStorage = {
  STORAGE_KEYS: {
    STOCK: "cochemotor_stock_v2",
    LEADS: "cochemotor_leads_v2",
    ORDERS: "cochemotor_orders_v2",
    ACTIVE_USER: "cochemotor_active_user_v2",
    BUYER_REG: "cochemotor_buyer_registered_v2",
    DEAL_ROOMS: "cochemotor_deal_rooms_v1",
    SOCIAL_POSTS: "cochemotor_social_posts_v1",
    WARRANTY_CASES: "cochemotor_warranty_cases_v1",
  },

  // Obtener definición de etapas
  getLifecycleStages() {
    return siteConfig.VEHICLE_LIFECYCLE_STAGES;
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
        const saved = JSON.parse(stored);
        if (Array.isArray(saved)) {
          const demoIds = new Set(siteConfig.stock.map(vehicle => vehicle.id));
          return saved.map(vehicle => demoIds.has(vehicle.id) ? { ...vehicle, isDemo: true } : vehicle);
        }
      }
    } catch (e) {}
    // El inventario embebido es sintético y debe seguir identificado como demo.
    const initial = siteConfig.stock.map(vehicle => ({ ...vehicle, isDemo: true }));
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

  getDealerBySlugOrId(idOrSlug) {
    if (!idOrSlug) return this.getActiveUser();
    const clean = idOrSlug.trim().toLowerCase();
    return siteConfig.users.find(u => 
      u.id.toLowerCase() === clean || 
      (u.slug && u.slug.toLowerCase() === clean) ||
      (u.subdomain && u.subdomain.toLowerCase() === clean)
    ) || this.getActiveUser();
  },

  getPublicStockByDealer(userIdOrSlug) {
    const dealer = this.getDealerBySlugOrId(userIdOrSlug);
    return this.getStock(dealer ? dealer.id : null);
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

  // Gestión del Expediente Digital / Sala Privada de Operación (Deal Room)
  getDealRooms(userId = null) {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.DEAL_ROOMS);
      if (stored) {
        const allRooms = JSON.parse(stored);
        // Retirar datos de demostración heredados que podían parecer operaciones reales.
        const cleanedRooms = allRooms.filter(r => r.id !== 'deal-cm-901');
        if (cleanedRooms.length !== allRooms.length) this.saveAllDealRooms(cleanedRooms);
        const targetUserId = (userId !== null) ? userId : this.getActiveUserId();
        if (targetUserId === 'all') return cleanedRooms;
        return cleanedRooms.filter(r => (r.sellerUserId || "user-juan") === targetUserId);
      }
    } catch (e) {}

    // Expedientes iniciales de demostración
    const defaultRooms = [
      {
        id: "deal-cm-901",
        token: "demo-only",
        isDemo: true,
        vehicleId: "cm-001",
        vehicleTitle: "Volkswagen Golf 2.0 TDI Advance",
        sellerUserId: "user-garcia",
        sellerName: "Talleres Hnos. García",
        buyerName: "Comprador de demostración",
        buyerPhone: "",
        buyerEmail: "",
        agreedPrice: 16900,
        depositAmount: 500,
        depositStatus: "Ejemplo — no es un pago real",
        paymentMethod: "Al contado contra entrega",
        status: "contrato_preparado", // borrador, reserva_pagada, contrato_preparado, firmado, entregado
        contractType: "Profesional a Particular (Ley Consumidores y Usuarios)",
        warrantyMonths: null,
        warrantyType: "Condiciones no especificadas (expediente de demostración)",
        dgtStatus: "No consultado",
        deliveryChecklist: [
          { item: "Permiso de circulación original firmado", checked: false },
          { item: "Ficha técnica ITV; revisar fecha y resultado", checked: false },
          { item: "Doble juego de llaves con mando", checked: false },
          { item: "Informe de revisión/diagnosis disponible", checked: false },
          { item: "Justificante provisional telemático de gestoría DGT", checked: false }
        ],
        createdAt: "2026-09-10",
        expiresAt: "2026-09-24",
      }
    ];

    try {
      localStorage.setItem(this.STORAGE_KEYS.DEAL_ROOMS, JSON.stringify(defaultRooms));
    } catch (e) {}
    return defaultRooms;
  },

  saveAllDealRooms(rooms) {
    try {
      localStorage.setItem(this.STORAGE_KEYS.DEAL_ROOMS, JSON.stringify(rooms));
    } catch (e) {}
  },

  createDealRoom(roomData) {
    const rooms = this.getDealRooms('all');
    const newRoom = {
      id: `deal-${Date.now().toString().slice(-5)}`,
      token: `tok_${Math.random().toString(36).substring(2, 10)}`,
      createdAt: new Date().toISOString().split('T')[0],
      expiresAt: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      deliveryChecklist: [
        { item: "Permiso de circulación original firmado", checked: false },
        { item: "Ficha técnica ITV; revisar fecha y resultado", checked: false },
        { item: "Doble juego de llaves con mando", checked: false },
        { item: "Informe de revisión/diagnosis disponible", checked: false },
        { item: "Justificante provisional telemático de gestoría DGT", checked: false }
      ],
      ...roomData
    };
    rooms.unshift(newRoom);
    this.saveAllDealRooms(rooms);
    return newRoom;
  },

  getDealRoomByTokenOrId(tokenOrId) {
    const rooms = this.getDealRooms('all');
    return rooms.find(r => r.id === tokenOrId || r.token === tokenOrId) || null;
  },

  // Centro de Publicación Social y Difusión Asistida en Grupos de Facebook (Spec 003 / Módulo 20)
  getFacebookGroupsLibrary() {
    return [
      { id: "grp-1", name: "Coches Segunda Mano Madrid & Centro", members: "142.000 miembros", province: "Madrid", url: "https://facebook.com/groups/coches-segunda-mano-madrid" },
      { id: "grp-2", name: "Compra Venta Vehículos Ocasión España", members: "215.000 miembros", province: "Nacional", url: "https://facebook.com/groups/compraventa-vehiculos-espana" },
      { id: "grp-3", name: "Mercado Automoción & Talleres VO", members: "89.000 miembros", province: "Nacional", url: "https://facebook.com/groups/mercado-automocion-vo" },
      { id: "grp-4", name: "Coches Ocasión Valencia y Levante", members: "68.000 miembros", province: "Comunidad Valenciana", url: "https://facebook.com/groups/coches-valencia-levante" }
    ];
  },

  getSocialPosts(userId = null) {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.SOCIAL_POSTS);
      if (stored) {
        const allPosts = JSON.parse(stored);
        const targetUserId = (userId !== null) ? userId : this.getActiveUserId();
        if (targetUserId === 'all') return allPosts;
        return allPosts.filter(p => (p.sellerUserId || "user-juan") === targetUserId);
      }
    } catch (e) {}

    const defaultPosts = [
      {
        id: "post-101",
        sellerUserId: "user-garcia",
        vehicleId: "cm-001",
        vehicleTitle: "Volkswagen Golf 2.0 TDI Advance",
        channel: "facebook_groups",
        groupName: "Coches Segunda Mano Madrid & Centro",
        status: "publicado_manual",
        publishedAt: "Hoy, 10:30",
        clicksTracked: 14,
        leadsTracked: 1,
      }
    ];

    try {
      localStorage.setItem(this.STORAGE_KEYS.SOCIAL_POSTS, JSON.stringify(defaultPosts));
    } catch (e) {}
    return defaultPosts;
  },

  saveAllSocialPosts(posts) {
    try {
      localStorage.setItem(this.STORAGE_KEYS.SOCIAL_POSTS, JSON.stringify(posts));
    } catch (e) {}
  },

  addSocialPost(postData) {
    const posts = this.getSocialPosts('all');
    const newPost = {
      id: `post-${Date.now().toString().slice(-5)}`,
      publishedAt: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) + " (Hoy)",
      clicksTracked: 0,
      leadsTracked: 0,
      ...postData
    };
    posts.unshift(newPost);
    this.saveAllSocialPosts(posts);
    return newPost;
  },

  // Gestión de Garantías y Posventa (Spec 003 / Módulo 17)
  getWarrantyCases(userId = null) {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.WARRANTY_CASES);
      if (stored) {
        const allCases = JSON.parse(stored);
        const targetUserId = (userId !== null) ? userId : this.getActiveUserId();
        if (targetUserId === 'all') return allCases;
        return allCases.filter(c => (c.sellerUserId || "user-juan") === targetUserId);
      }
    } catch (e) {}

    const defaultCases = [
      {
        id: "gar-001",
        sellerUserId: "user-garcia",
        vehicleId: "cm-001",
        vehicleTitle: "Volkswagen Golf 2.0 TDI Advance",
        buyerName: "David Muñoz Pérez",
        buyerPhone: "34611223344",
        deliveryDate: "2026-08-15",
        warrantyExpirationDate: "2027-08-15",
        status: "en_taller", // abierta, en_taller, resuelta, rechazada_desgaste
        claimedIssue: "Ruido leve en pastilla delantera izquierda al frenar en frío",
        issueType: "desgaste_ajuste", // falta_conformidad, desgaste_ajuste, mal_uso
        assignedWorkshop: "Talleres Hnos. García (Alcorcón)",
        resolutionNotes: "Sustitución de juego de pastillas sin coste en garantía de cortesía del taller.",
        openedAt: "2026-09-02",
      }
    ];

    try {
      localStorage.setItem(this.STORAGE_KEYS.WARRANTY_CASES, JSON.stringify(defaultCases));
    } catch (e) {}
    return defaultCases;
  },

  saveAllWarrantyCases(cases) {
    try {
      localStorage.setItem(this.STORAGE_KEYS.WARRANTY_CASES, JSON.stringify(cases));
    } catch (e) {}
  },

  addWarrantyCase(caseData) {
    const cases = this.getWarrantyCases('all');
    const newCase = {
      id: `gar-${Date.now().toString().slice(-4)}`,
      openedAt: new Date().toISOString().split('T')[0],
      status: "abierta",
      ...caseData
    };
    cases.unshift(newCase);
    this.saveAllWarrantyCases(cases);
    return newCase;
  },

  updateWarrantyStatus(caseId, newStatus, notes = "") {
    const cases = this.getWarrantyCases('all');
    const target = cases.find(c => c.id === caseId);
    if (target) {
      target.status = newStatus;
      if (notes) target.resolutionNotes = notes;
      this.saveAllWarrantyCases(cases);
    }
    return target;
  }
};
