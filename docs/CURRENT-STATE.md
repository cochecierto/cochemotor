# Estado actual

# Estado actual

Fecha de actualización: 2026-09-10.

## Repositorio local

La carpeta estaba vacía antes de esta migración. No existían archivos, directorios ni `.git`; por tanto, no hubo sobrescrituras ni conflictos físicos.

## Conocimiento confirmado en la fuente accesible

- Identidad responsable: VendoCoche360 (base previa Inmobia360 adaptada).
- Propietario y responsable final: Juan / Dirección del proyecto.
- Nombre del proyecto: VendoCoche360.
- Mercado objetivo: España.
- Enfoque: Plataforma SaaS B2B/B2B2C para freelancers de compraventa y pequeños concesionarios de vehículos de ocasión (VO).
- MVP aprobado: captación y centralización de leads multicanal; inventario de vehículos con distintivo ambiental DGT (0/ECO/C/B), año, km y precio; fichas públicas compartibles; canal prioritario WhatsApp; matching automático demanda-vehículo; checklist de trámites legales en España (DGT, contrato y garantía mecánica de 1 año).
- Metodología SDD aplicada: Spec 001 activa (`specs/001-dealer-digital-automocion/`) en sintaxis EARS, plan técnico, tareas T1-T5 completadas y matriz de validación comprobada.
- Dominio local en Python puro (`local-broker/`): suite de 6 pruebas unitarias pasando al 100% (aislamiento multi-tenant, generación de enlaces WhatsApp, matching de stock y estados de expediente).
- El contexto de producto se ha enriquecido con referencias funcionales externas sobre campañas, rendimiento de oficina, hubs de herramientas, colaboración profesional, formación y gestión de agentes; se conservan como benchmarks, no como especificaciones ni activos reutilizables.
- Se han definido como candidatos funcionales `mk.inmobia360.com` para marketing del agente, `red.inmobia360.com` para colaboración y `academia.inmobia360.com` para formación; ninguno está activado ni aprobado para despliegue.
- El staff propio incluye perfiles de diseño/publicidad, operaciones de broker/oficina, formación/políticas/soporte, integraciones/ecosistema y Red Profesional/colaboración.
- Se incorpora el perfil `inmobia360-business-planning` para planes de negocio, análisis comercial, KPI, previsiones, monedas y prorrateo de costes/beneficios por agente, equipo, agencia y broker.
- Se incorpora al contexto de Academia el benchmark formativo de liderazgo y crecimiento de oficina, con rutas candidatas para CEO de oficina, broker, líder de equipo y agente. Debe transformarse en contenido original, accionable y validado para Perú.
- Se incorpora al contexto de Academia el flujo candidato de captación en exclusiva: prospección, primera visita, cualificación, documentación, análisis de mercado, segunda visita, plan de marketing, decisión y seguimiento. Los contenidos legales y fiscales de la fuente quedan pendientes de adaptación local.
- Se incorpora al contexto de Academia el benchmark de onboarding guiado: bienvenida, activación, checklist, formación progresiva, práctica, mentoría, evidencias, revisión semanal y asistente contextual para soporte y seguimiento.
- Se incorpora al staff `inmobia360-onboarding-assistant`, especializado en rutas, estados, evidencias, recordatorios, bloqueos y escalado del onboarding por rol. Trabajará coordinado con Academia, Operaciones, Producto, Arquitectura, Datos y Planificación empresarial.

## No confirmado todavía

Siguen pendientes de validación: precios y margen, segmentos detallados, KPIs numéricos, fechas del roadmap, arquitectura técnica interna, modelo de datos completo, requisitos legales por país, reputación y ranking, marca blanca, responsabilidades hasta escritura, copy final de landings, pruebas independientes de comportamiento, diseño de las skills especialistas planificadas, alcance definitivo de Academia/Marketing Kit/Red Profesional, reglas de referidos y permisos de broker/oficina, vocabulario y fuentes de eventos comerciales, fórmulas de KPI, política de tipos de cambio y reglas de prorrateo de costes/beneficios, perfiles y KPI propios de liderazgo de oficina, criterios legales y metodología de captación en exclusiva para Perú, etapas, evidencias, responsables y notificaciones del onboarding asistido, rutas por rol, eventos de progreso y criterios de escalado.

## Hipótesis de trabajo

- El MVP debe validarse primero en Lima antes de considerar expansión.
- WhatsApp será el canal prioritario para la operación inicial en Perú.
- La separación entre webs comerciales y aplicación SaaS permitirá evolucionar cada superficie de forma independiente.

Estas hipótesis no sustituyen validación de usuarios, mercado, legalidad ni viabilidad técnica.

## Recursos de infraestructura informados por Juan

- Suscripción VPS Hostinger: KVM 2; identificador privado omitido de la documentación versionada.
- Dominio Hostinger: `inmobia360.com`.
- Suscripción `Starter Business Email Trial` asociada a `compracaptacion.com`; queda fuera del alcance actual de Inmobia360 LATAM.

Estos datos son un inventario informado. No implican autorización para acceder, configurar, modificar DNS o desplegar.

## Dirección técnica prevista para IA

- El VPS KVM 2 se evaluará como capa de orquestación de IA, automatizaciones y agentes internos.
- El modelo de IA se considera inicialmente un servicio cloud separado.
- El proveedor, modelo, permisos, costes y datos permitidos siguen pendientes de validación.
- El modelo de datos inmobiliarios cuenta con un diseño conceptual inicial; no existen tablas ni migraciones implementadas.
- La revisión de preparación del repositorio concluye `GO CONDICIONADO` para continuar la preparación documental y `NO-GO` para programar o desplegar: siguen pendientes la validación de Fase 2, el blueprint técnico, los contratos API, los roles/permisos, la seguridad, las pruebas y el plan de releases.
- Se propone `inmobia360-performance-marketing` como futura especialidad unificada para publicidad de pago, análisis social, atribución y formatos; no está implementada ni aprobada para conexiones externas.
- La investigación automatizada de competidores y portales queda como propuesta futura de `inmobia360-market-intelligence`, sujeta a límites legales, de privacidad y de seguridad.
- Se ha adoptado documentalmente una metodología SDD propia, con `specs/`,
  plantillas de spec/clarificación/plan/tareas/validación y reglas de trazabilidad.
  Su uso queda limitado a iniciativas autorizadas y no implica que exista código
  implementado.
- La web publicada `https://inmobia360.com/` queda registrada como referencia
  autorizada de experiencia y capacidades para futuras iniciativas. Su auditoría
  está en `docs/knowledge/PUBLISHED-WEB-AUDIT-2026-09-10.md`. No se adopta por
  ello su mercado visible, precios, métricas, testimonios, claims ni código como
  decisiones aprobadas o como implementación presente en este repositorio.
- El repositorio `inmobia360/broker`, commit `03c6b49`, queda registrado como
  referencia técnica para una infraestructura de asistente digital. Se ha
  creado la Spec 001 para adaptar su patrón de BROKER, especialistas,
  expedientes, memoria aislada, ingesta y control de calidad a Perú/Lima. La
  implementación de código queda pendiente de clarificación y aprobación de la
  spec.
- Juan ha definido el alcance inicial de la Spec 001: infraestructura de agentes
  y expedientes más interfaz web local, usando la agencia sintética
  `Inmobiliaria Demo Broker`; backend local autorizado y MCP reservado para una
  fase posterior. El plan técnico y la implementación siguen pendientes de
  aprobación de la puerta SDD.
- La Tarea 1 de la Spec 001 está completada: el stack local será Python con
  biblioteca estándar y una interfaz HTML/CSS/JavaScript estática servida por
  el backend, dentro de `local-broker/`. La Tarea 2 será el siguiente paso y
  aún no existe código implementado.
- La Tarea 2 de la Spec 001 está completada con el dominio inicial de agencia,
  tenant y expediente en `local-broker/`; sus 5 pruebas pasan. T3 es el
  siguiente paso y todavía no existe orquestación BROKER implementada.
