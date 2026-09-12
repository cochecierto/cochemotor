# Spec 001 — Infraestructura del Asistente Dealer Digital de Automoción

## Contexto y objetivo

CocheMotor necesita una infraestructura de asistencia para que freelancers (compraventas independientes) y pequeños concesionarios de vehículos de ocasión (VO) en España gestionen leads, vehículos en stock, demandas de compradores y operaciones de venta con trazabilidad, cumplimiento DGT y aislamiento estricto entre cuentas.

El asistente aplica el patrón DEALER DIGITAL: ayuda al profesional con la siguiente mejor acción comercial, genera fichas compartibles para WhatsApp y guía el checklist de trámites en España (informe DGT, contrato de compraventa y garantía legal de 1 año) con supervisión humana y sin alucinaciones.

## Usuarios / actores

- Juan / Dirección: Responsable final del proyecto.
- Compraventa Freelancer: Autónomo con stock reducido (3-15 vehículos) que opera desde móvil y WhatsApp.
- Concesionario Multimarca / Broker: Pyme con stock de 15-50 vehículos y equipo comercial.
- Comprador de VO: Particular o empresa buscando coche de ocasión.
- Coordinador del Asistente Dealer: Motor central de orquestación de tareas comerciales.
- Especialistas internos: Stock/Tasación, Leads/WhatsApp, Trámites DGT/Gestoría, Garantías mecánicas y Calidad.

## Historias de usuario

- H1: Como compraventa independiente quiero dar de alta un coche y obtener al instante una ficha pública con fotos y distintivo DGT para compartirla por WhatsApp.
- H2: Como profesional quiero registrar la búsqueda de un comprador (presupuesto, combustible, etiqueta ZBE) y recibir alertas automáticas cuando entra un coche compatible.
- H3: Como concesionario quiero que mis vehículos, márgenes y clientes permanezcan estrictamente aislados y confidenciales frente a otros concesionarios.
- H4: Como compraventa quiero un checklist guiado para cada venta que me recuerde verificar cargas en DGT, emitir el contrato y activar la garantía legal obligatoria de 1 año.

## Requisitos funcionales (criterios de aceptación EARS)

- RF-001: CUANDO se inicia una solicitud en el sistema, EL SISTEMA exigirá resolver un concesionario/profesional autorizado, un `tenant_id` y un expediente antes de consultar datos de stock o clientes.
- RF-002: SI el concesionario, el tenant o el expediente no son inequívocos, ENTONCES EL SISTEMA detendrá el trabajo y solicitará la aclaración correspondiente.
- RF-003: CUANDO se registra un vehículo en stock, EL SISTEMA asignará marca, modelo, versión, año, kilometraje, combustible, etiqueta DGT (0/ECO/C/B), precio y estado comercial.
- RF-004: CUANDO se registra una demanda de comprador, EL SISTEMA evaluará automáticamente el inventario del tenant y generará coincidencias (matches) ordenadas por compatibilidad.
- RF-005: CUANDO un especialista interno reciba un encargo, EL SISTEMA le proporcionará exclusivamente el contexto autorizado de su tenant y expediente de vehículo.
- RF-006: SI un especialista o asistente intenta modificar datos canónicos sin supervisión o ejecutar acciones externas, ENTONCES EL SISTEMA bloqueará la acción y exigirá confirmación explícita del compraventa.
- RF-007: CUANDO se comparta una ficha pública de vehículo, EL SISTEMA generará una URL segura que muestre especificaciones, fotos, distintivo DGT e hipervínculo directo a WhatsApp con mensaje pre-rellenado.
- RF-008: SI una entrada contiene datos personales reales protegidos o secretos comerciales ajenos, ENTONCES EL SISTEMA los bloqueará según la política de privacidad.
- RF-009: CUANDO se inicie un expediente de venta, EL SISTEMA creará un checklist de trámites específicos de España: verificación de informe de cargas DGT, contrato de compraventa, factura (REBU o general) y certificado de garantía de 12 meses.
- RF-010: CUANDO el flujo use datos de prueba, EL SISTEMA operará exclusivamente con datos sintéticos españoles (concesionario demo, matrículas ficticias) sin procesar identidades reales.

## Requisitos no funcionales

- Aislamiento multi-tenant comprobable mediante pruebas unitarias automatizadas.
- Mínimas dependencias: el backend del dominio local opera con la biblioteca estándar de Python (`unittest`).
- Mobile-first: diseñado para ser operado desde el navegador del smartphone y WhatsApp.
- Cumplimiento de la normativa española de consumo y tráfico (DGT).

## Casos límite

- Matrícula o bastidor con formato no válido.
- Coche sin distintivo ambiental en zona urbana con restricciones ZBE.
- Intento de consulta de stock o leads entre tenants distintos (bloqueo absoluto).
- Coche marcado como vendido que recibe solicitudes concurrentes.

## Fuera de alcance inicial

- Pagos y transferencias bancarias reales directas en la app.
- Integración telemática de pago con APIs oficiales de la DGT sin validación humana previa.
- Publicación desasistida automática en portales externos sin visto bueno del profesional.
