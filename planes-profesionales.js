// Propuesta comercial aprobada para presentar durante la beta; no configura cobros ni límites de cuenta.
window.cocheMotorProfessionalPlans = [
  {
    id: 'inicio',
    name: 'Inicio',
    tagline: 'Para empezar con un inventario pequeño.',
    priceMonthly: 59,
    annualTotal: 590,
    vehicles: 10,
    users: 1,
    popular: false,
    features: [
      'Fichas de vehículo compartibles',
      'Ayuda para redactar anuncios',
      'Seguimiento básico de contactos'
    ]
  },
  {
    id: 'taller-partner',
    name: 'Taller Partner',
    tagline: 'Para talleres que también comercializan vehículos.',
    priceMonthly: 79,
    annualTotal: 790,
    vehicles: 10,
    users: 2,
    popular: false,
    features: [
      'Perfil profesional de taller',
      'Fichas compartibles y guía de fotografías',
      'Seguimiento de consultas y solicitudes'
    ]
  },
  {
    id: 'profesional',
    name: 'Profesional',
    tagline: 'Para compraventas que quieren ordenar stock y consultas.',
    priceMonthly: 129,
    annualTotal: 1290,
    vehicles: 35,
    users: 5,
    popular: true,
    features: [
      'Seguimiento de contactos por etapas',
      'Herramientas para preparar fichas y anuncios',
      'Calculadoras y solicitudes de compradores'
    ]
  },
  {
    id: 'concesionario',
    name: 'Concesionario',
    tagline: 'Para equipos con un inventario amplio.',
    priceMonthly: 199,
    annualTotal: 1990,
    vehicles: 75,
    users: 10,
    popular: false,
    features: [
      'Herramientas de stock y seguimiento comercial',
      'Configuración del equipo según necesidades',
      'Puesta en marcha acompañada, a consultar'
    ]
  },
  {
    id: 'red',
    name: 'Red',
    tagline: 'Para varias sedes o equipos con necesidades propias.',
    priceMonthly: 299,
    annualTotal: null,
    vehicles: null,
    users: null,
    popular: false,
    features: [
      'Desde 75 vehículos activos',
      'Usuarios y sedes según propuesta',
      'Integraciones y migración a valorar'
    ]
  }
];
