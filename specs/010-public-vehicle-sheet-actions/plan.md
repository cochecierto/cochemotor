# Plan técnico — Spec 010 Acciones de ficha pública

## Diseño

- Ampliar la capa de presentación de `ficha.html` y las reglas responsive existentes sin cambiar el modelo de datos.
- Mantener WhatsApp como acción primaria de contacto y llamada/solicitud como alternativas.
- Añadir `navigator.share()` con detección de capacidad y activación directa por clic. En navegadores incompatibles, usar el portapapeles con alternativa manual si Clipboard API falla.
- Añadir mensajes de estado mediante una región `aria-live`; cancelar el selector de compartir no se mostrará como error.
- Preparar la impresión desde la propia ficha con reglas `@media print`, excluyendo navegación, formularios, barras fijas y elementos interactivos.
- Reorganizar la barra fija en móvil para mostrar dos acciones primarias, respetando área segura inferior y evitando que tape el contenido.
- No instalar dependencias, invocar APIs de redes, cambiar el endpoint de leads ni modificar la base de datos.

## Estrategia de pruebas

- Pruebas de sintaxis JS y verificación de HTML/JS local.
- Recorridos de navegador para compartir nativo simulado, fallback de portapapeles, cancelación, WhatsApp con texto/referencia y vista de impresión.
- Medición de `scrollWidth <= clientWidth` a 320×568, 390×844, 768×1024, 1024×768 y 1440×900.
- Comprobación de teclado, foco visible, nombre accesible y región de estado.
- Ejecutar la suite Python existente y `git diff --check`.
