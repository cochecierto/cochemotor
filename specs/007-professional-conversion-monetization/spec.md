# Spec 007 — Conversión profesional y presentación de planes CocheMotor

## Contexto y objetivo

La portada actual mezcla tareas de compradores y profesionales y algunas acciones del buscador conducen a destinos que no corresponden con su etiqueta. Esta iniciativa clarifica ambas rutas y presenta el empaquetado comercial aprobado por Dirección sin simular pagos o límites técnicos aún no disponibles. La Spec 011 actualiza la jerarquía de esa propuesta para la fase beta: las tarifas quedan como consulta secundaria plegada.

## Usuarios / actores

- Profesional de compraventa, taller o concesionario que llega desde búsqueda, campaña o portada.
- Comprador particular que busca vehículos o quiere publicar una necesidad.
- Dirección de CocheMotor, responsable de oferta, precios y lanzamiento.

## Historias de usuario

- H1: Como profesional quiero entender rápidamente qué ofrece CocheMotor, que la beta es gratuita y cómo empezar.
- H2: Como comprador quiero encontrar su ruta sin confundirla con las herramientas profesionales.
- H3: Como profesional interesado quiero crear una cuenta beta o consultar un plan sin activar un cargo accidental.

## Requisitos funcionales (criterios de aceptación EARS)

- RF-1: CUANDO el visitante use la navegación principal, EL SISTEMA separará la ruta de compradores de la ruta de profesionales y mantendrá acceso al marketplace y Coche Ideal.
- RF-2: CUANDO el visitante pulse una acción profesional desde portada, menú o página profesional, EL SISTEMA lo dirigirá a una landing profesional o al acceso profesional correspondiente, nunca a una ficha de vendedor de ejemplo por error.
- RF-3: CUANDO el visitante abra la consulta de planes, EL SISTEMA mostrará Inicio (59 €/mes, 10 vehículos, 1 usuario), Taller Partner (79 €/mes, 10 vehículos, 2 usuarios), Profesional (129 €/mes, 35 vehículos, 5 usuarios), Concesionario (199 €/mes, 75 vehículos, 10 usuarios) y Red (desde 299 €/mes, volumen/usuarios personalizados) como propuesta futura orientativa.
- RF-4: CUANDO el visitante active facturación anual, EL SISTEMA mostrará el total anual equivalente a diez mensualidades: 590 €, 790 €, 1.290 € y 1.990 € para los cuatro primeros planes; para Red solicitará consulta comercial.
- RF-5: EL SISTEMA indicará que los importes no incluyen IVA, y que durante la beta no se inicia un cobro ni se aplican cupos técnicos de plan.
- RF-6: CUANDO el visitante pulse un CTA de un plan, EL SISTEMA permitirá crear una cuenta beta sin cargo o acceder a una cuenta existente, dejando claro que la cuenta no contrata ni activa el plan.
- RF-7: SI el usuario ve características o servicios todavía sujetos a disponibilidad, EL SISTEMA los identificará como alcance comercial previsto/consultable, no como una prestación activada automáticamente.
- RF-8: CUANDO el usuario interactúe desde móvil o teclado, EL SISTEMA mantendrá navegación accesible, foco visible, controles legibles y CTA profesional accesible.
- RF-9: EL SISTEMA mostrará una ruta B2B con propuesta, capacidades verificables, pasos de inicio, consulta de planes y preguntas frecuentes; no mostrará una calculadora de ahorro.
- RF-10: EL SISTEMA medirá mediante eventos de analítica solo si existe una integración consentida y configurada; en caso contrario, no añadirá rastreo de terceros.

## Requisitos no funcionales

- Sin dependencias nuevas; HTML/CSS/JavaScript compatible con la web estática actual.
- Responsive en móvil y escritorio, semántica HTML y respeto a `prefers-reduced-motion`.
- No introducir pagos, captura nueva de datos personales ni tracking de terceros.

## Casos límite

- Visitante confunde el plan profesional con cuenta gratis beta.
- Facturación anual para el plan Red sin precio cerrado.
- Capacidades comerciales todavía no disponibles o cupos no aplicados por software.
- Acceso a navegación y acción B2B en vista móvil.

## Fuera de alcance

- Checkout, cobro recurrente, facturación y gestión de suscripciones.
- Aplicación técnica de límites de vehículos/usuarios, permisos por plan o automatizaciones de pago.
- Activación de integraciones externas, WhatsApp API, certificaciones físicas, campañas de marketing o marca blanca.
- Añadir analítica de terceros o modificar la experiencia de acceso/auth backend.

## Criterios de finalización

- La portada diferencia y enlaza correctamente ambas audiencias.
- La página profesional ofrece las tarifas dentro de una consulta plegada y el total anual es correcto.
- Los CTAs distinguen acceso beta de contratación; ninguna ruta cobra ni promete cupos activos.
- Los enlaces, destinos, contenido responsive, teclado y accesibilidad se validan.
- Documentación y validación requisito por requisito actualizadas.

## Dudas abiertas

- Ninguna para presentar los precios aprobados por el usuario como propuesta comercial de beta. Pagos y aplicación técnica de límites permanecen fuera de alcance.
