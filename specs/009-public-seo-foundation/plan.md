# Plan técnico — Spec 009

1. Añadir migración MySQL aditiva con campos de perfil comercial voluntariamente público y slug; valores predeterminados privados.
2. Actualizar formulario y acción autenticada de perfil: nombre comercial, descripción y consentimiento expreso para publicación/indexación. No alterar ni exponer los datos de sesión.
3. Añadir rutas PHP server-rendered para fichas `/vehiculos/{slug}` y profesionales `/profesionales/{slug}`. Las consultas devolverán únicamente columnas públicas y validarán cuenta/contacto/estado antes de renderizar.
4. Crear sitemap XML dinámico que consulta los mismos predicados de elegibilidad y conserva un grupo pequeño de páginas institucionales.
5. Añadir canonical absoluta, título/description únicos, Open Graph y JSON-LD `Product` + `Car`/Offer, Organization y BreadcrumbList; sin Review markup ni claims no verificados.
6. Enlazar fichas reales a las nuevas rutas; preservar fichas demostrativas con noindex y aviso de datos ficticios.
7. Escribir una guía editorial con fuentes oficiales enlazadas y una lista operativa para Search Console, indexación, consultas y conversiones. Search Console no se configura sin propiedad/verificación autorizada.
8. Validar elegibilidad con pruebas estáticas/unidad donde sea viable; PHP lint, XML parsing, protección de privacidad, sitemap/canonical y diff.

## Decisiones técnicas

- Mantener HTML/CSS/JS/PHP nativos compatibles con Hostinger; no migrar framework.
- Rutas amigables con Apache `mod_rewrite`; sitemap se sirve desde PHP.
- Estados válidos para indexar un vehículo: `vehicles.status='disponible'`, `vehicles.stage='publicado'`, usuario verificado y al menos un contacto de publicación verificado.
- Un perfil requiere consentimiento explícito persistido, cuenta verificada, nombre comercial, descripción de al menos 80 caracteres y al menos un coche que cumpla todos los criterios de indexabilidad, incluida una foto propia normalizada. Los datos de contacto nunca se incluyen en el HTML ni en JSON-LD.
- No realizar redirecciones masivas ni cambiar la URL de fichas sintéticas existentes.

## Verificación y publicación

- Pruebas de predicados: excluye demo, pendiente, vendedor no verificado, contacto sin verificar y perfil sin consentimiento.
- Lint PHP de cada endpoint y API; pruebas de contrato del markup y de sitemap XML.
- Revisión de la migración para confirmar que no modifica datos existentes y deja los perfiles privados por defecto.
- Despliegue posterior solo manual, con migración ejecutada previamente en la base de datos y smoke test de HTML/HTTP en Hostinger.
