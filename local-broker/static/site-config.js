/**
 * CocheMotor — Central Editorial & Product Configuration
 * Metodología BIG School Webs: Desacoplamiento total entre datos, copy y presentación.
 */

const siteConfig = {
  metadata: {
    title: "CocheMotor — Marketplace Digital de Vehículos con Mecánica Verificada",
    description: "Compra y vende coches de segunda mano en España con certificación pericial de taller en 100 puntos y trazabilidad DGT. Cero estafas, cero vicios ocultos.",
    canonical: "https://cochemotor.es",
    domain: "cochemotor.es",
    language: "es-ES",
  },

  brand: {
    name: "CocheMotor",
    tagline: "Marketplace Digital",
    promise: "Vehículos de ocasión con mecánica peritada y garantía real en España.",
    contactWhatsapp: "34612345678",
    logoLight: "assets/brand/cochemotor_logo_transparent.png",
    logoDark: "assets/brand/cochemotor_logo_white_transparent.png",
    pistonIcon: "assets/brand/cochemotor_piston_azul_transparente.png",
    faviconSvg: "assets/brand/favicon.svg",
  },

  navigation: [
    { label: "Mecánica Verificada", href: "#inspeccion" },
    { label: "Catálogo en Stock", href: "#catalogo" },
    { label: "El Manifiesto", href: "#manifiesto" },
    { label: "Para Talleres y Freelance", href: "#profesionales" },
    { label: "Preguntas Frecuentes", href: "#faq" },
  ],

  // Estructura Editorial de 8 Capítulos (BIG School Webs)
  chapters: {
    chapter1_hero: {
      eyebrow: "MERCADO PROFESIONAL DE OCASIÓN EN ESPAÑA",
      headline: ["Coches de Segunda Mano.", "Con Mecánica Verificada.", "Sin Vicios Ocultos."],
      subhead: "Unimos a talleres mecánicos certificados, compraventas independientes y particulares en una plataforma donde cada coche pasa por 100 puntos de control pericial antes de publicarse.",
      ctaLabel: "Explorar Stock Verificado",
      ctaTarget: "#catalogo",
      stats: [
        { value: "100", label: "Puntos de control pericial" },
        { value: "0 Cargas", label: "Informe DGT verificado" },
        { value: "12 Meses", label: "Garantía mecánica obligatoria" },
      ],
    },

    chapter2_manifesto: {
      number: "CAPÍTULO 01",
      title: "La Verdad sobre Comprar Coche Usado en España",
      paragraphs: [
        "Comprar un vehículo de segunda mano en portales tradicionales se ha convertido en una ruleta rusa: kilómetros manipulados, cajas de cambio al límite de la rotura y embargos ocultos en la DGT.",
        "CocheMotor nace con un propósito innegociable: desterrar la desconfianza. Aquí no publican particulares anónimos con fotos engañosas. Cada vehículo es peritado por un taller mecánico profesional o un compraventa verificado antes de recibir la luz verde.",
      ],
      quote: "Si un coche no supera la prueba de compresión de cilindros o tiene cargas registrales, jamás entra en CocheMotor.",
    },

    chapter3_engineering: {
      number: "CAPÍTULO 02",
      title: "Ingeniería de Taller al Servicio del Comprador",
      subtitle: "Diagnosis por ordenador OBD, inspección en elevador y prueba dinámica en carretera.",
    },

    chapter4_pillars: {
      number: "CAPÍTULO 03",
      title: "Los 3 Pilares del Sello CocheMotor",
      pillars: [
        {
          code: "01 / PERITAJE",
          title: "100 Puntos de Control Mecánico",
          description: "Revisión exhaustiva de compresión de motor, turbo, embrague, discos de freno, amortiguadores y lectura de kilometraje real en centralita (ECU).",
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
      formAction: "#", // Endpoint local o webhook
    },
  },

  // Inventario de Stock Sintético para Pruebas Locales (España)
  stock: [
    {
      id: "cm-001",
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
      dealer: "Taller Hermanos García VO (Madrid)",
      location: "Alcorcón, Madrid",
      image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80",
      inspectionScore: "98/100",
      itvDate: "Noviembre 2025",
      warranty: "12 Meses Europea",
      dgtStatus: "Informe Limpio (Sin Cargas)",
      highlights: ["Distribución recién cambiada", "Neumáticos Michelin nuevos", "Un solo propietario", "Historial en concesionario oficial"],
    },
    {
      id: "cm-002",
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
      dealer: "EcoCars Ocasión (Valencia)",
      location: "Paterna, Valencia",
      image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
      inspectionScore: "100/100",
      itvDate: "Enero 2026",
      warranty: "12 Meses Toyota Relax",
      dgtStatus: "Informe Limpio (Sin Cargas)",
      highlights: ["Etiqueta ECO sin restricciones ZBE", "Consumo medio 3.8 L/100km", "Batería híbrida certificada", "Cámara de visión trasera"],
    },
    {
      id: "cm-003",
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
      dealer: "Motorsur Freelance (Sevilla)",
      location: "Dos Hermanas, Sevilla",
      image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
      inspectionScore: "96/100",
      itvDate: "Mayo 2026",
      warranty: "12 Meses Completa",
      dgtStatus: "Informe Limpio (Sin Cargas)",
      highlights: ["SUV familiar con maletero de 520 L", "i-Cockpit digital con navegador 3D", "Frenada de emergencia activa", "ITV recién pasada"],
    },
    {
      id: "cm-004",
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
      dealer: "Baviera Motors VO (Zaragoza)",
      location: "Zaragoza Centro",
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
      inspectionScore: "99/100",
      itvDate: "Octubre 2026",
      warranty: "12 Meses Premium",
      dgtStatus: "Informe Limpio (Sin Cargas)",
      highlights: ["Paquete aerodinámico M Sport", "Faros Láser adaptativos", "Etiqueta ECO microhíbrida", "Mantenimiento incluido"],
    },
  ],
};
