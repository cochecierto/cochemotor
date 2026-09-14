# Registro de decisiones

Todas las decisiones de esta versión están fechadas el 2026-08-27.

## D-001 — Carpeta principal

- Estado: aprobada.
- Decisión: usar `C:\Users\Usuario\Documents\Inmobia360-LATAM` como carpeta principal.
- Evidencia: instrucción explícita de Juan.

## D-002 — Mercado inicial

- Estado: aprobada.
- Decisión: Perú como mercado inicial.
- Evidencia: instrucción explícita de Juan.

## D-003 — Ciudad piloto

- Estado: aprobada.
- Decisión: Lima como ciudad piloto.
- Evidencia: instrucción explícita de Juan.

## D-004 — Identidad responsable

- Estado: aprobada.
- Decisión: la identidad responsable es Inmobia-360; Juan es propietario y responsable final.
- Evidencia: instrucción explícita de Juan.

## D-005 — Objetivo del proyecto

- Estado: aprobada.
- Decisión: crear una plataforma SaaS inmobiliaria escalable para Latinoamérica.
- Evidencia: instrucción explícita de Juan.

## D-006 — Alcance MVP Perú

- Estado: aprobada.
- Decisión: limitar el MVP a las seis capacidades descritas en `project-charter.md`.
- Evidencia: instrucción explícita de Juan.

## D-007 — Arquitectura de superficies

- Estado: aprobada.
- Decisión: separar webs comerciales WordPress + Bricks de la aplicación SaaS Next.js y mantener los dominios definidos.
- Evidencia: instrucción explícita de Juan.

## D-008 — Fuera de alcance inicial

- Estado: aprobada.
- Decisión: no abrir pagos reales, expansión regional, MLS regional, automatizaciones avanzadas, integraciones costosas ni datos personales reales.
- Evidencia: instrucción explícita de Juan.

## D-009 — Skills

- Estado: aprobada como dirección futura.
- Decisión: `latam-real-estate` será la primera skill propia; las especialistas se desarrollarán posteriormente. No se construye ni se instalan skills externas en esta fase.
- Evidencia: instrucción explícita de Juan.

## D-010 — Fase 1 documental

- Estado: aprobada.
- Decisión: crear únicamente los nueve archivos de gobierno autorizados, conservando y comparando los existentes.
- Evidencia: aprobación explícita de Juan.

## D-011 — Sistema modular de skills

- Estado: aprobada.
- Fecha: 2026-08-27.
- Decisión: utilizar `latam-real-estate` como skill directora y mantener las skills especialistas como planificadas hasta que exista una necesidad validada.
- Evidencia: directrices y aprobación de Juan.

## D-012 — Admisión de skills externas

- Estado: aprobada.
- Fecha: 2026-08-27.
- Decisión: ninguna skill externa se instalará sin revisión de procedencia, contenido, scripts, auditorías, aislamiento, fijación de versión y aprobación de Juan. Si el riesgo no se resuelve, se construirá una versión propia.
- Evidencia: directriz explícita de Juan.

## D-013 — Skill directora v0.1.0

- Estado: implementada; validación de comportamiento pendiente.
- Fecha: 2026-08-27.
- Decisión: construir `latam-real-estate` con referencias, plantillas, puertas de calidad, derechos de decisión, enrutamiento de especialistas y política de admisión externa.
- Evidencia: autorización explícita de Juan y validación estructural satisfactoria.

## D-014 — Interfaz única de comunicación

- Estado: aprobada.
- Fecha: 2026-08-27.
- Decisión: Juan mantendrá comunicación activa únicamente con `latam-real-estate`; los perfiles especialistas trabajarán internamente y sus resultados serán consolidados por la skill directora.
- Evidencia: instrucción explícita de Juan.

## D-015 — Ruta de la landing comercial de Perú

- Estado: aprobada.
- Fecha: 2026-08-27.
- Decisión: utilizar `inmobia360.com/pe/` como ruta oficial de la landing comercial del mercado piloto de Perú. La ruta anterior `inmobia360.com/peru/` queda descartada.
- Evidencia: confirmación explícita de Juan.

## D-016 — Inicio de preparación de Fase 2

- Estado: aprobada para preparación documental.
- Fecha: 2026-08-27.
- Decisión: preparar la arquitectura de despliegue, matriz de entornos, política de Git/releases y controles de secretos/rollback antes de conectar Hostinger o comenzar el desarrollo.
- Restricciones: no instalar dependencias, no conectar servicios externos, no desplegar y no utilizar datos personales reales.
- Evidencia: instrucción de Juan de proceder con el siguiente paso recomendado.

## D-017 — Arquitectura de dominios y subdominios

- Estado: aprobada.
- Fecha: 2026-08-27.
- Decisión: utilizar `inmobia360.com` como landing institucional de presentación del negocio; mantener las landings comerciales por país en subdirectorios; reservar subdominios como `app.inmobia360.com`, `demo.inmobia360.com` y `ayuda.inmobia360.com` para aplicación, demostración y soporte global.
- Regla: cualquier subdominio nuevo deberá tener una función concreta, validada y documentada antes de crearse.
- Evidencia: confirmación explícita de Juan.

## D-018 — Preparación del destino de alojamiento

- Estado: aprobada para preparación documental.
- Fecha: 2026-08-27.
- Decisión: definir el destino técnico de cada dominio y subdominio antes de conectar Hostinger, modificar DNS, adquirir servicios o desplegar.
- Restricciones: no realizar compras, cambios DNS, conexiones externas ni despliegues durante esta preparación.
- Evidencia: instrucción de Juan de proseguir con el siguiente paso recomendado.

## D-019 — Inventario inicial de Hostinger

- Estado: registrado; destino técnico pendiente de decisión.
- Fecha: 2026-08-27.
- Decisión: registrar como recurso disponible el VPS KVM 2 de Hostinger y el dominio `inmobia360.com`; el identificador técnico del VPS se conserva fuera de la documentación versionada. El email trial asociado a `compracaptacion.com` queda fuera del alcance de Inmobia360 LATAM.
- Restricciones: no acceder, configurar, modificar DNS, desplegar ni utilizar el VPS hasta completar la evaluación técnica y obtener autorización específica.
- Evidencia: información proporcionada explícitamente por Juan.

## D-020 — VPS como capa de orquestación de IA

- Estado: aprobada para diseño; implementación pendiente.
- Fecha: 2026-08-27.
- Decisión: evaluar el VPS KVM 2 como capa para orquestar agentes, subagentes, automatizaciones y acciones de IA, manteniendo inicialmente el modelo de IA como servicio cloud separado.
- Restricciones: no instalar modelos, runtimes ni automatizadores; no conectar servicios; no procesar datos personales reales; no ejecutar acciones irreversibles sin aprobación humana.
- Evidencia: instrucción explícita de Juan sobre el uso previsto del VPS.

## D-021 — Evaluación controlada de IA

- Estado: aprobada para diseño; proveedor e implementación pendientes.
- Fecha: 2026-08-27.
- Decisión: seleccionar el modelo y proveedor de IA mediante criterios documentados de seguridad, privacidad, coste, capacidad, portabilidad y operación. La primera fase se limitará a tareas no destructivas con datos sintéticos.
- Restricciones: no conectar proveedores, no enviar datos personales reales, no permitir cambios DNS, compras, mensajes externos ni acciones de producción automáticas.
- Evidencia: aplicación del flujo de decisión de `latam-real-estate` y autorización de Juan para proseguir.

## D-022 — Blueprint técnico inicial del MVP

- Estado: aprobado para diseño; implementación pendiente.
- Fecha: 2026-08-27.
- Decisión: estructurar funcional y técnicamente el MVP Perú antes de programar, manteniendo Lima como piloto, WhatsApp como canal prioritario y datos sintéticos.
- Restricciones: no iniciar desarrollo, no conectar IA, no activar integraciones externas ni ampliar el alcance aprobado.
- Evidencia: instrucción de Juan de proseguir con la estructura del proyecto.

## D-023 — Diseño conceptual del modelo de datos

- Estado: aprobado para diseño; implementación pendiente.
- Fecha: 2026-08-27.
- Decisión: estructurar entidades candidatas para leads, perfiles, propiedades, demandas, actividades, matches y eventos de canal, utilizando identificadores internos, datos sintéticos y trazabilidad.
- Restricciones: no crear tablas, migraciones ni operar con datos personales reales hasta validar campos, permisos, retención y requisitos legales.
- Evidencia: instrucción de Juan de proseguir con la estructura del proyecto.

## D-024 — Dirección de producto y contexto de marca

- Estado: aprobada para diseño; implementación, activación de subdominios y modelo comercial pendientes.
- Fecha: 2026-08-27.
- Decisión: orientar la evolución hacia una plataforma PropTech guiada para agentes y pequeñas agencias, con espacio privado, páginas públicas de propiedades, asistente de productividad, Red Profesional regional y futuro directorio de agentes con reputación verificable.
- Decisión de marca: mantener `inmobia360.com` como dominio principal y usar la identidad del manual maestro como referencia común; “Red Profesional” sustituye a “MLS” como denominación de producto.
- Alcance futuro: contemplar configuración por país, staff local, marca blanca y acompañamiento de operaciones hasta hitos de cierre, sujetos a validación legal, operativa y comercial por país.
- Restricciones: no activar ranking, pagos, comisiones, marca blanca, subdominios nacionales o acompañamiento regulado hasta definir metodología, responsabilidades, costes, permisos y aprobación específica.
- Evidencia: instrucción explícita de Juan y manual maestro de identidad corporativa proporcionado para contexto.

## D-025 — Adopción de Spec-Driven Development

- Estado: aprobada para preparación documental y uso en iniciativas autorizadas.
- Fecha: 2026-08-28.
- Decisión: adoptar un flujo SDD adaptado a Inmobia360 LATAM: contexto y
  constitución, spec funcional, clarificación, plan técnico, tareas,
  implementación trazable, validación RF por RF y gestión de cambios desde la
  spec.
- Alcance: se aplica a nuevas iniciativas y no altera por sí misma el alcance
  del MVP, la arquitectura aprobada, los precios, el presupuesto ni las
  decisiones pendientes.
- Restricciones: no copiar código o dependencias del repositorio de referencia;
  no programar antes de aprobar la spec; usar datos sintéticos y mantener la
  aprobación humana para decisiones reservadas.
- Evidencia: estudio de `mouredev/hello-sdd` y aprobación explícita de Juan.

## D-026 — Web publicada como referencia de evolución

- Estado: aprobada como referencia funcional y visual; adopción concreta por
  iniciativa pendiente.
- Fecha: 2026-09-10.
- Decisión: utilizar la web publicada `https://inmobia360.com/` como referencia
  para estudiar la experiencia, superficies y capacidades que Juan quiere
  evolucionar en Inmobia360 LATAM.
- Alcance: la referencia no modifica automáticamente el mercado inicial Perú,
  la ciudad piloto Lima, los precios pendientes, el alcance del MVP ni la
  arquitectura aprobada.
- Restricciones: precios, métricas, testimonios, claims, datos visibles,
  scoring predictivo, IA, integraciones y código publicado requieren validación
  específica mediante SDD antes de incorporarse o desplegarse.
- Evidencia: auditoría publicada de la URL realizada el 2026-09-10 y aprobación
  explícita de Juan para tomarla como referencia.

## D-027 — Repositorio broker como referencia de infraestructura

- Estado: referencia técnica aprobada; adaptación e implementación pendientes.
- Fecha: 2026-09-10.
- Decisión: estudiar y adaptar la infraestructura de `inmobia360/broker` para
  construir el asistente digital de profesionales inmobiliarios de Inmobia360
  LATAM.
- Alcance inicial: BROKER como interlocutor, coordinación de especialistas,
  expedientes, aislamiento por agencia/tenant, memoria gobernada, ingesta
  trazable y control independiente de calidad.
- Restricciones: adaptar España a Perú/Lima; no copiar datos, secretos,
  normativa, código o dependencias sin revisión; no activar integraciones,
  MCP, acciones externas ni datos personales reales; aplicar SDD antes de
  implementar.
- Evidencia: auditoría del repositorio en el commit `03c6b49`, Spec 001 y
  aprobación explícita de Juan para usarlo como referencia.

## D-028 — Alcance inicial de la infraestructura de asistente

- Estado: aprobado para planificación SDD; implementación pendiente.
- Fecha: 2026-09-10.
- Decisión: la primera entrega incluirá infraestructura de agentes y
  expedientes, además de una interfaz web local.
- Datos de prueba: agencia sintética `Inmobiliaria Demo Broker`, con
  `tenant_id: tenant-inmobiliaria-demo-broker` y
  `agency_slug: inmobiliaria-demo-broker`.
- Backend: autorizado para desarrollarse localmente antes de elegir base de
  datos y almacenamiento definitivos.
- MCP: reservado para una fase posterior.
- Restricciones: datos sintéticos, sin servicios externos, sin producción y
  con aprobación de la spec y del plan antes de escribir código.
- Evidencia: respuestas explícitas de Juan a las preguntas de clarificación de
  la Spec 001.

## D-029 — Stack local inicial del asistente

- Estado: aprobado para la Tarea 1; implementación pendiente.
- Fecha: 2026-09-10.
- Decisión: usar Python con biblioteca estándar para el backend local y una
  interfaz HTML/CSS/JavaScript estática servida localmente por ese backend.
- Estructura: `local-broker/`, separada de la futura aplicación Next.js,
  WordPress y base de datos.
- Motivo: validar el flujo de agentes y expedientes sin instalar dependencias
  ni conectar servicios externos.
- Restricciones: no elegir todavía base de datos definitiva, proveedor IA,
  MCP ni infraestructura de producción.
- Evidencia: aprobación de Juan del backend local y de la interfaz web local,
  y cierre de la Tarea 1 del plan SDD.

## D-030 — Landing profesional y propuesta comercial durante la beta

- Estado: aprobado para presentación informativa en la web.
- Fecha: 2026-09-13.
- Decisión: publicar una ruta profesional separada y mostrar la propuesta de
  cinco paquetes de monetización adjunta: Inicio (59 €), Taller Partner
  (79 €), Profesional (129 €), Concesionario (199 €) y Red (desde 299 €),
  con los límites y precios anuales definidos en Spec 007.
- Condiciones: precios sin IVA; cuenta beta gratuita; ningún clic activa un
  plan, cobro o suscripción. Los límites de usuarios/vehículos son referencia
  comercial y no se aplican automáticamente durante la beta.
- No permanencia ni comisión por ventas: propuesta comercial; sus condiciones
  finales se informarán y aceptarán antes de cualquier contratación.
- Servicios opcionales de la propuesta: solo orientativos, a consultar y
  sujetos a alcance/disponibilidad; no existe compra en línea.
- Restricciones: pasarela de pagos, suscripciones reales, enforcement de cupos,
  servicios de inspección e integraciones externas quedan fuera de esta entrega.
- Evidencia: aprobación expresa de Dirección para implementar los cambios y
  el informe de monetización adjunto.

## D-031 — Captación de búsquedas Coche Ideal

- Estado: aprobada para implementación local.
- Fecha: 2026-09-13.
- Decisión: rediseñar `demanda.html` como landing sencilla y progresiva para
  compradores, con una ficha ilustrativa que se actualiza con sus preferencias
  y una captura pública persistida en `coche_ideal_requests`.
- Condiciones: nombre y correo obligatorios, teléfono opcional, consentimientos
  explícitos y datos personales no visibles en la ficha pública. La ilustración
  no representa disponibilidad ni una unidad real.
- Restricciones: no alterar infraestructura o datos remotos, desplegar ni
  confirmar conexión real MySQL hasta la validación en el entorno autorizado.
- Evidencia: petición explícita de crear una landing de baja fricción y tomar
  como referencias funcionales CocheCierto y Coches.net.

## D-032 — Búsqueda por necesidad y matching de categorías

- Estado: aprobada para implementación local.
- Fecha: 2026-09-13.
- Decisión: iniciar la búsqueda por necesidad de movilidad; sugerir categorías
  con las imágenes entregadas; guardar necesidad, categorías aceptadas y la
  estrategia `rules-v1` para relacionar demanda con ofertas.
- Reglas visibles: familia ofrece familiar/monovolumen/SUV; ciudad ofrece
  urbano/utilitario; furgoneta y pickup se reservan a trabajo/carga. Marca y
  modelo quedan como filtros opcionales, nunca bloqueo.
- Restricciones: matching por reglas solamente; no existe proveedor LLM
  configurado. No afirmar que hay IA semántica ni conexión LLM activa. Sin
  push ni despliegue en esta tarea.
- Evidencia: nueva petición sobre `cochemotor-mi-coche-ideal-categorias-v1`.

## D-033 — Preferencias de contacto y revisión de búsqueda

- Estado: aprobada para implementación local.
- Fecha: 2026-09-13.
- Decisión: permitir alertas por correo, WhatsApp, llamadas o todas; horario libre o franja preferente. El teléfono/franja se exige solo cuando corresponde.
- Privacidad: no exponer datos personales en la ficha para profesionales. La activación requiere aceptación de privacidad y autorización separada para compartir los canales elegidos, y el backend los vuelve a validar (`coche-ideal-v4`).
- UX: separar en cuatro pasos y presentar una revisión previa editable antes de publicar/enviar.
- Restricciones: no push ni despliegue en esta tarea; la conexión real de producción requiere validación aparte.
- Evidencia: petición del usuario para elegir alertas, expresar consentimiento y revisar la ficha antes de confirmar.

## D-034 — Imagen de vehículo sincronizada con la búsqueda

- Estado: aprobada para implementación local.
- Fecha: 2026-09-13.
- Decisión: la tarjeta en vivo y la revisión mostrarán la imagen de la primera categoría compatible que permanezca seleccionada; antes de elegir, usarán una ilustración genérica propia.
- UX: mantener una imagen separada de entrega de llaves como inspiración; la imagen de categoría es orientativa, tiene texto alternativo y no representa una oferta.
- Referencias de interacción: orientación progresiva por pasos del valorador de CocheCierto y entrada de compra más asistencia conversacional de Coches.net; no copiar marcas/copy ni afirmar una integración LLM.
- Restricciones: sin push ni despliegue en esta tarea.

## D-035 — Demo aislada del espacio profesional

- Estado: aprobada para implementación local.
- Fecha: 2026-09-13.
- Decisión: crear una ruta pública de demostración separada del panel autenticado, con datos sintéticos y acciones simuladas únicamente en memoria.
- Conversión: ofrecer registro profesional beta gratuito mediante el flujo existente; el CTA no contratará un plan ni iniciará pagos.
- Restricciones de la demo: no API, persistencia, analítica, contacto con terceros, publicación, impresión, clipboard ni integraciones. La simulación permanece aislada aunque la ruta esté en producción.
- Evidencia: petición explícita de Dirección de permitir al profesional explorar y probar la herramienta de forma segura antes de registrarse.

## D-036 — Despliegue limitado de la demo profesional por SFTP

- Estado: aprobado para preparar el flujo; despliegue público pendiente de credenciales SSH dedicadas.
- Fecha: 2026-09-13.
- Decisión: sustituir el envío de esta iniciativa por FTP sin cifrar por SFTP/OpenSSH, con validación previa y publicación manual.
- Alcance remoto: solo `demo-profesional.html`, `demo-profesional.css`, `demo-profesional.js`, `profesionales.html` y `profesionales.css`; no borrar/sincronizar otros ficheros del sitio.
- Seguridad: clave privada y `known_hosts` fuera de Git; el workflow exige verificación de host estricta y no muestra secretos. No despliega automáticamente en cada push.
- Condición: Dirección confirmó “Sí, configúrala” para la clave de despliegue exclusiva de Hostinger/GitHub Actions.
- Evidencia: verificación del dominio confirmó que `/demo-profesional.html` aún devuelve 404; el hPanel muestra SSH activo y el último despliegue del sitio fue anterior a esta demo.

## D-037 — Base de SEO orgánico para vehículos y profesionales

- Estado: aprobada para implementación local; migración y publicación en producción pendientes.
- Fecha: 2026-09-13.
- Decisión: crear rutas renderizadas en servidor para vehículos y perfiles públicos, canonical y sitemap dinámicos, marcado estructurado veraz, una guía editorial con fuentes oficiales y un procedimiento de medición en Search Console.
- Privacidad: los perfiles quedan privados por defecto y requieren consentimiento expreso, correo verificado y descripción suficiente. Un coche solo se expone si su anuncio está publicado/disponible y tanto la cuenta como el contacto están verificados. No se muestran correos, teléfonos ni datos sensibles.
- Migración: añadir columnas de perfil público mediante `004_public_seo_profiles_mysql.sql`; la ejecución remota debe preceder al despliegue de los endpoints.
- Restricciones: los coches de demostración siguen con `noindex`; no se inventan reseñas, controles DGT, garantías ni métricas; no se ejecuta la migración ni se despliega sin autorización específica.
- Evidencia: petición expresa de iniciar la ruta SEO priorizada y las reglas de elegibilidad documentadas en Spec 009.

## D-038 — Moderación manual previa a indexar anuncios

- Estado: implementada localmente; activación en producción pendiente de migración y secretos privados.
- Fecha: 2026-09-13.
- Decisión: añadir `POST /api/moderation/vehicles` para aprobar o retirar anuncios con credencial separada, cuenta profesional verificada y anotación de auditoría. Aprobar implica que un moderador comprobó el contacto por un canal independiente; no se activa nada automáticamente al desplegar.
- Privacidad y seguridad: secreto de mínimo 32 caracteres y actor se configuran fuera de Git; la ruta queda deshabilitada si faltan. Las notas no deben incluir datos personales. La migración 005 registra fecha de verificación y transiciones.
- Motivo: las páginas indexables requieren anuncio y contacto verificados, pero el flujo de alta solo genera publicaciones pendientes; sin transición autorizada el objetivo SEO no era operable.
- Restricciones: no ejecutar migración, configurar secreto, aprobar registros ni desplegar desde este paso local.

## D-039 — Separar rendimiento de búsqueda y conversión onsite

- Estado: aplicada a la documentación operativa; instrumentación de conversiones pendiente.
- Fecha: 2026-09-13.
- Decisión: Search Console será la fuente de impresiones, clics, CTR, posición e indexación en Google. No se le atribuirán conversiones onsite.
- Medición pendiente: las páginas SEO aún no tienen CTA de consulta medible y la tabla `analytics_events` no está conectada a dichas páginas. Antes de medir conversiones, definir CTA y evento first-party, revisar la finalidad/retención/consentimiento y evitar PII o identificadores persistentes.
- Evidencia: revisión del código actual y la matriz de preparación UE/ES; no se encontró CMP/consentimiento analítico activo.

## D-040 — Requisito de imagen para indexar fichas de vehículo

- Estado: aplicado localmente en las páginas y el sitemap.
- Fecha: 2026-09-13.
- Decisión: una ficha de vehículo sin al menos una imagen propia normalizada sigue visible para uso del producto, pero responde `X-Robots-Tag: noindex, follow` y no se incluye en el sitemap.
- Alcance: no exigir las diez fotos sugeridas ni bloquear la publicación por SEO. Los perfiles públicos mantienen su criterio de consentimiento, descripción suficiente y al menos un anuncio real disponible con una foto propia normalizada; los vehículos sin foto siguen fuera del índice y sitemap.
- Motivo: no presentar como página de búsqueda útil una ficha visualmente vacía ni usar un placeholder como si fuera fotografía del vehículo.

## D-041 — Guía editorial de compra basada en requisitos DGT vigentes

- Estado: aplicada localmente; validación de fuentes revisada el 2026-09-13.
- Decisión: ampliar la guía de compra con pasos sobre informe reducido/completo, posibles impedimentos de transferencia, contrato, ITP, titularidad, ITV y seguro. Cada paso remite a páginas oficiales DGT y no se presenta como servicio de verificación de CocheMotor.
- Evidencia: páginas oficiales DGT consultadas; requisitos de compra actualizados el 2026-04-30 y página de informes de vehículo consultada el 2026-09-13.

## D-042 — CTA editorial a inventario y búsqueda por necesidad

- Estado: aplicado localmente.
- Fecha: 2026-09-13.
- Decisión: la guía prioriza el enlace a coches disponibles y ofrece, como alternativa secundaria, el flujo existente para crear una búsqueda gratuita según necesidad.
- Restricciones: no se captura información nueva desde la guía, no se agregan píxeles ni se atribuyen conversiones sin medición consentida.
