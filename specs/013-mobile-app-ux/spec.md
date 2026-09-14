# Spec 013 — Agente de experiencia móvil CocheMotor

## Contexto y objetivo

El agente web actual ya cubre responsive, pero CocheMotor necesita una especialidad que estudie flujos completos y tareas desde el teléfono, tanto para profesionales de compraventa como para compradores. El skill `design-mobile-apps` solicitado es una integración Sleek que exige clave, operaciones cloud y puede generar costes; la necesidad inmediata se cubrirá con un agente interno y local.

## Usuarios / actores

- Profesionales que gestionan vehículos y contactos con movilidad.
- Compradores que consultan fichas y publican búsquedas.
- Producto, diseño, ingeniería web/app, privacidad y calidad.

## Historias

- H1: Como profesional móvil, quiero completar las tareas prioritarias con controles táctiles claros y sin perder datos.
- H2: Como comprador móvil, quiero entender y comparar información del coche y actuar con confianza.
- H3: Como responsable de producto, quiero evaluar cada flujo por evidencia, accesibilidad y adaptación real a dispositivos.

## Requisitos funcionales EARS

- RF-1: CUANDO se solicite una revisión móvil, EL AGENTE identificará rol, tarea, plataforma y contexto; inspeccionará el flujo actual y separará hechos de hipótesis.
- RF-2: CUANDO proponga un flujo o pantalla, EL AGENTE priorizará jerarquía móvil, controles táctiles, safe areas, teclado y estados completos sin contradecir producto o marca.
- RF-3: CUANDO revise accesibilidad, EL AGENTE evaluará objetivos táctiles con la norma apropiada a cada plataforma, foco, etiquetas, texto ampliado y alternativa a gestos.
- RF-4: CUANDO una tarea incluya formulario, permiso del dispositivo, dato personal, transmisión, pago o servicio externo, EL AGENTE señalará las decisiones de privacidad/aprobación y no ejecutará la acción.
- RF-5: CUANDO recomiende implementación, EL AGENTE utilizará el stack/componentes existentes, asociará los cambios a una spec aprobada y definirá pruebas de móvil y no-regresión de escritorio.
- RF-6: SI no puede validar el comportamiento en dispositivo o navegador real, ENTONCES EL AGENTE declarará qué evidencia falta y no afirmará que pasó la prueba.
- RF-7: EL SISTEMA registrará la fuente externa Sleek, su commit, riesgos y razón de no instalación; la skill interna quedará enlazada desde los registros del proyecto.

## Requisitos no funcionales

- Perfil en español, sin dependencias ni credenciales.
- Basado en fuentes primarias vigentes de accesibilidad y plataforma.
- Respeta aislamiento de datos personales, política de marca y gates SDD.

## Fuera de alcance

- Implementar una app nativa, cambiar el stack, comprar/crear cuenta Sleek, solicitar claves, usar créditos SaaS, publicar en tiendas o desplegar.
- Dar por hecho que existe app instalable: verificar si la superficie es Next.js, sitio responsive, PWA u otra.

## Finalización

- Skill y agente registrados; fuente externa revisada y su límite documentado.
- Validación de JSON, rutas, front matter y diff completada.
- Sin dependencias, credenciales o escrituras remotas.
