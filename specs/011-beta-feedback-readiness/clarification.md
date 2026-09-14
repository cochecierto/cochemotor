# Clarificación — Spec 011

## Decisiones resueltas

1. Se conservan precios y cupos actuales como propuesta futura consultable, cerrada inicialmente. No se modifica su cuantía ni se anuncia una fecha de fin de beta.
2. La gratuidad se expresa como vigente durante toda la beta y sin fecha final prometida. No se emplea “hasta el lunes” ni “durante unos días”.
3. Feedback se prepara como correo editable al buzón público existente `hola@cochemotor.es`; el navegador no envía datos ni almacena respuestas.
4. El enlace de feedback aparece en footers públicos y en el pie de navegación de `hub.html`. Los footers que solo contienen texto legal también tendrán el enlace.
5. Se reutiliza `assets/brand/logos/cochemotor-final-dark.png`, que ya existe y está aprobado para fondos oscuros.

## Riesgos y mitigaciones

- Riesgo: el cliente de correo no está configurado. Mitigación: enlace directo visible a `mailto:` y explicación de comportamiento.
- Riesgo: el comentario podría incluir información personal. Mitigación: no solicitarla, pedir que no se incluyan datos sensibles y dejar el envío bajo control de la persona.
- Riesgo: páginas públicas sin footer convencional. Mitigación: incluir enlace en `hub.html`; no añadirlo en el pie propio del formulario de `publicar.html` porque no es footer de sitio.

## Veredicto

`GO` — las decisiones de interacción, privacidad y contenido están resueltas y aprobadas; se puede implementar el alcance local de esta spec.
