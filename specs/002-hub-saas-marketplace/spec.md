# Spec 002 — Hub SaaS B2B y Marketplace Automotriz CocheMotor

## Contexto y Objetivo
Inspirado en la propuesta integral de Inmobia360.com, CocheMotor evoluciona de un catálogo de ocasión a un **SaaS B2B + Marketplace Automotriz**. Proporciona a talleres mecánicos homologados y compraventas freelance herramientas operativas de alta conversión (Generador Multicanal, Calculadora Financiera de Cuotas y Márgenes, Scoring Predictivo de Leads y Cartelería de Parabrisas con QR) a la vez que ofrece a los compradores un catálogo de vehículos con peritaje pericial en 100 puntos y trazabilidad DGT.

## Actores
- **Comprador de VO**: Particular o autónomo que busca vehículos verificados con etiqueta DGT y garantía legal.
- **Taller Mecánico / Compraventa Partner**: Profesional que gestiona stock, anuncia vehículos y usa el Hub SaaS para automatizar su operativa.
- **Coordinador CocheMotor**: Motor de reglas de negocio, scoring y generación multicanal.

## Requisitos Funcionales (EARS)
- **RF-001**: CUANDO un profesional acceda al Generador Multicanal, EL SISTEMA generará al instante 4 formatos optimizados: anuncio para portales (Coches.net/Milanuncios/Wallapop), mensaje persuasivo de WhatsApp, ficha técnica con etiqueta DGT y guión para vídeo corto (Reels/TikTok).
- **RF-002**: CUANDO se utilice la Calculadora Financiera, EL SISTEMA calculará la cuota mensual para el comprador (según precio, entrada, plazo y TAE) y el margen comercial estimado para el vendedor.
- **RF-003**: CUANDO se evalúe un lead en el módulo de Lead Scoring, EL SISTEMA clasificará al comprador en Caliente (alta liquidez/urgente), Templado o Curioso, sugiriendo la siguiente mejor acción comercial.
- **RF-004**: CUANDO se solicite la Ficha de Parabrisas, EL SISTEMA generará una vista imprimible con Sello CocheMotor, puntos periciales y código QR escaneable hacia la ficha pública.
- **RF-005**: CUANDO el usuario navegue por la sección de Planes, EL SISTEMA permitirá alternar entre facturación mensual y anual (con 2 meses de ahorro) y calcular el ROI estimado según el número de vehículos gestionados.
