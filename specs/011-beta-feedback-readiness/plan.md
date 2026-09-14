# Plan técnico — Spec 011

## Experiencia

- Presentar estado beta gratuito en la landing profesional y mover tarifas a un `details` cerrado inicialmente.
- Eliminar la calculadora y toda lógica/CSS exclusiva de ella.
- Crear página estática de feedback con selección de utilidad y comentario opcional; validación cliente y borrador mailto editable.
- Enlazar la página desde cada footer público y el pie de navegación del hub.
- Corregir el logo del footer principal y usar el logo oscuro ya aprobado en la landing profesional.

## Seguridad y privacidad

- Ninguna llamada de red, almacenamiento local, API, analítica o transmisión automática.
- Usar lista permitida para `from`; no copiar query arbitraria al correo.
- Validar campos en cliente y construir `mailto:` mediante `URLSearchParams`.
- Avisar que al enviar correo se revela la dirección remitente y recomendar no incluir datos sensibles.

## Validación

- Pruebas estáticas de alcance, enlaces, defaults de disclosure, ausencia de calculadora y seguridad de privacidad.
- `node --check` para JavaScript nuevo/modificado y suites existentes.
- `git diff --check`; inspección local en 320, 390, 768, 1024 y 1440 px, teclado y ancho móvil apaisado.
