# Plan técnico — Spec 008

## Experiencia

- Crear `demo-profesional.html` como ruta pública independiente del panel autenticado.
- Mantener identidad CocheMotor (azul marino, blanco, rojo de acción) y una arquitectura de trabajo: resumen, inventario, contactos y herramientas.
- Añadir un aviso visible de demo sintética y una invitación a la beta siempre localizable.
- Añadir enlace de entrada desde el hero profesional y mantener una salida clara a crear cuenta beta.

## Implementación

- Añadir hoja y script propios (`demo-profesional.css`, `demo-profesional.js`) con selectores prefijados.
- Renderizar datos sintéticos declarados en el JS; no reutilizar `hub.js`, `app.js` ni handlers del panel autenticado.
- Cambios de fase, filtros, cálculo, generador de texto y previsualización serán operaciones síncronas en memoria; sin `fetch`, `XMLHttpRequest`, `localStorage`, `sessionStorage`, IndexedDB, clipboard, impresión ni destinos de terceros.
- Los enlaces de alta usarán `acceso.html?audience=professional&return=hub&mode=register` y explicarán que el registro beta es gratuito y no contrata un plan.
- `noindex,follow` para evitar que el entorno de prueba se confunda con el servicio operativo.

## Publicación controlada

- Mantener validación automática para cambios de demo y despliegue exclusivamente manual (`workflow_dispatch`).
- Ejecutar toda la suite Python y `node --check` antes de permitir publicar.
- Usar SFTP/OpenSSH en el puerto SSH de Hostinger, clave privada y `known_hosts` fuera del repositorio; no usar FTP sin cifrar.
- Transferir solo `demo-profesional.{html,css,js}` y `profesionales.{html,css}`. Preparar una carpeta temporal remota, renombrar los archivos y no sincronizar ni borrar el resto de `public_html`.
- Tras la transferencia, comprobar por HTTPS la página y sus recursos estáticos.
- No imprimir credenciales, claves privadas ni valores de secretos en logs.

## Validación

- Prueba unitaria estática con biblioteca estándar para aislamiento, enlaces permitidos, datos sintéticos, navegación y controles interactivos.
- `node --check` para el JS de la demo.
- Smoke HTTP local de página/CSS/JS.
- Inspección visual de escritorio y móvil cuando el navegador lo permita; comprobación de consola y recorrido por cada vista.
- `git diff --check` y validación del workflow.
- Verificación pública final de `https://cochemotor.es/demo-profesional.html` y disponibilidad de CSS/JS tras el despliegue.
