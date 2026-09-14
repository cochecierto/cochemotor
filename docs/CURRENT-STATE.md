# Estado actual

# Estado actual

Fecha de actualización: 2026-09-13.

## Repositorio local

La carpeta estaba vacía antes de esta migración. No existían archivos, directorios ni `.git`; por tanto, no hubo sobrescrituras ni conflictos físicos.

## Conocimiento confirmado en la fuente accesible

- Identidad responsable: CocheMotor (base previa Inmobia360 adaptada).
- Propietario y responsable final: Juan / Dirección del proyecto.
- Nombre del proyecto: CocheMotor.
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

## Actualización CocheMotor — 2026-09-13

- Dirección aprobó la Spec 007 para una landing profesional independiente y
  la presentación de la propuesta de monetización adjunta.
- La cuenta beta continúa sin cargos; precios, importes anuales y cupos se
  presentan como propuesta comercial. No hay checkout ni enforcement
  automático de los límites durante la beta.
- Los servicios opcionales son referencias sujetas a alcance y disponibilidad;
  pagos, suscripciones e integraciones externas siguen fuera de alcance.
- Se implementa localmente una landing progresiva para publicar búsquedas Coche
  Ideal por necesidad de movilidad. La taxonomía sugiere tipos compatibles con
  imágenes de categoría; marca/modelo son opcionales y el backend valida los
  tipos enviados. Se persisten `need`, `matchedCategories` y `rules-v1` como
  señales preparadas para matching de demanda/oferta. No existe integración LLM
  conectada. La conexión MySQL efectiva y el despliegue quedan pendientes de
  comprobar en el entorno remoto.

- Se aprueba la Spec 008: ruta independiente de demo profesional con datos
  sintéticos, interacciones solo en memoria y CTA al registro beta gratuito.
  No se conecta al API ni al panel real ni inicia pagos. Hostinger confirma SSH
  activo y conexión SFTP verificada. La demo ya se publicó y se volvió a
  desplegar por GitHub Actions manual (validación y publicación exitosas); la
  clave privada está guardada como secreto cifrado, fuera del repositorio. La
  URL pública es `https://cochemotor.es/demo-profesional.html`.

- La Spec 009 implementa en el árbol local fichas y perfiles SEO renderizados en
  servidor, sitemap dinámico, canonical/JSON-LD y guía editorial. Las 46 pruebas
  automatizadas pasan. El 2026-09-14 se creó un backup manual de archivos y base
  de datos en hPanel, y se aplicaron las migraciones 004–006 en MySQL; se
  verificaron los campos de consentimiento y contacto, la tabla de auditoría y
  el índice único de `vehicles.public_slug`. Antes de la migración no había
  slugs duplicados y `vehicles` estaba vacía. No se ha probado PDO contra la
  base remota ni Apache extremo a extremo.
  El código SEO aún no se ha publicado: `/sitemap.xml` y `/robots.txt` daban el
  error de Hostinger y `/ficha.html?id=cm-002` servía la ficha sintética en la
  inspección del 2026-09-13. No remitir sitemap a Google hasta publicar y
  comprobar las rutas. Search Console y baseline siguen pendientes. El File
  Browser lista herramientas y carpetas de desarrollo dentro de `public_html`;
  el `.htaccess` local refuerza su bloqueo, pero su efecto remoto no se ha
  probado.

## Actualización CocheMotor — 2026-09-14

- Se implementa localmente la Spec 010 en `ficha.html`: compartir mediante el
  menú nativo del dispositivo, copia de enlace con alternativa compatible,
  WhatsApp editable y vista para imprimir o guardar como PDF desde el navegador.
- En móvil, la barra fija prioriza WhatsApp y compartir; la ficha ofrece llamada
  y solicitud de información por separado. No se integra publicación social ni
  se añade captura de datos personales. Las miniaturas que fallen al cargar se
  retiran de la galería para evitar iconos rotos.
- Edge local verificó la ficha a 320, 390, 768, 1024 y 1440 px, y en los cortes
  de sus breakpoints: no hay scroll horizontal ni solape de acciones fijas. La
  emulación de impresión confirma que se excluyen controles y aparece la URL.
  No se abrió el diálogo de impresión ni el selector nativo de compartir.
- Las suites web (52), dominio local (18) y específicas (5), la sintaxis JS y
  `git diff --check` pasan. El commit `edbf787` de esta Spec 010 llegó a `main`
  y el auto-deploy de Hostinger se verificó como completado. La URL pública
  `https://cochemotor.es/ficha.html?id=cm-001` se comprobó con las acciones.

## Actualización CocheMotor — Spec 011, 2026-09-14

- Dirección aprobó mantener precios y cupos como propuesta futura secundaria,
  cerrada por defecto. La beta seguirá indicada como gratuita mientras dure,
  sin anunciar una fecha de finalización. Se retira la calculadora de ahorro
  de la landing profesional.
- Se añade un formulario de feedback que prepara un borrador de correo editable;
  no guarda respuestas ni las transmite automáticamente. Se añade acceso desde
  los footers públicos y el espacio profesional, y se reutiliza el logo existente
  para fondos oscuros en el footer de inicio.
- La implementación de Spec 011 no se ha desplegado a producción. El alta profesional
  completa, la verificación del correo, privacidad y el aislamiento de cuentas
  siguen pendientes de una revisión integral independiente; esta iniciativa no
  los cambia ni certifica por sí sola la preparación total para lanzar.

## Actualización CocheMotor — Spec 012, 2026-09-14

- Se refuerza el perfil de copy de automoción con controles de evidencia,
  claims, claridad y experimentación responsable.
- Se incorporan perfiles internos para SEO/descubribilidad en buscadores con IA
  y para revisión técnica/documental de privacidad y cookies en UE/España.
- Se revisaron las skills comunitarias solicitadas. Sus prácticas útiles de
  SEO/copy se adaptan; `cookie-sync` se excluye porque exporta cookies Chrome a
  Browserbase, `lgpd` se excluye por ser legislación brasileña y no se adopta
  la recomendación de aceptación implícita de la skill similar de política de
  cookies.
- No se han añadido paquetes, scripts de terceros ni CMP. El commit
  `6f6f6f2dcbf8eb2c6cf64554c3e9515149e98c10` ya está en `main`; las 56 pruebas,
  la sintaxis JavaScript/PHP y el workflow de validación de GitHub pasaron.
- El job SFTP automático quedó omitido al hacer push (`workflow_dispatch`
  manual). Dirección autorizó la publicación: el run 34888240791 en GitHub
  Actions completó validación, SFTP y smoke test con éxito para demo, acceso
  profesional y API, incluyendo cambios web pendientes de la Spec 011. GET
  públicos comprobaron HTTP 200 en demo, profesionales, CSS y JavaScript.
- El perfil de privacidad cita AEPD, LSSI-CE, ePrivacy y RGPD y no certifica
  cumplimiento. Para una conclusión real aún hace falta inventario actualizado
  de cookies, etiquetas, proveedores y comportamiento antes/después de elegir.

## Actualización CocheMotor — Spec 013, 2026-09-14

- Se crea localmente `cochemotor-mobile-app-ux`, centrado en flujos móviles
  B2B/B2C, controles táctiles, accesibilidad y pruebas por dispositivo, en
  coordinación con el agente web existente.
- La skill comunitaria `design-mobile-apps` se revisó en el commit
  `bd6696bb2db7c874ebd8d68431c1642e7d2283bd`; no se instaló porque se limita a
  Sleek, requiere `SLEEK_API_KEY`, contempla operaciones cloud/créditos y
  declara un host restringido mientras también indica llamadas a otros hosts.
- El perfil interno no requiere claves, dependencias ni servicios externos y
  no crea una app nativa ni modifica la web. Está publicado en `main` mediante
  `a380382`; el despliegue Hostinger del mismo commit ejecutó el workflow de
  demo/acceso/API existente. La Spec 013 no añade activos web publicables.
