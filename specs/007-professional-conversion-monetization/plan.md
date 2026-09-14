# Plan técnico — Spec 007

## Experiencia

- Página estática `profesionales.html`, reutilizando el sistema de marca y la hoja global, con una hoja pequeña propia para jerarquía, comparación de planes y mobile.
- Portada como selector de intención: búsqueda B2C sencilla y acceso B2B directo; quitar pestañas que prometen búsquedas no existentes.
- Presentación de planes generada desde `site-config.js`; cálculo anual desde importes anuales explícitos y selector accesible.
- Acciones de plan mantienen el flujo beta y dan contexto del plan seleccionado sin crear suscripciones ni cargos.

## Cambios técnicos

- Actualizar menú de portada y navegación profesional, CTA móvil y enlazado del footer.
- Añadir landing B2B con capacidades existentes expresadas en lenguaje sencillo, plan comercial, condiciones beta, extras orientativos y FAQ.
- Eliminar el uso de la calculadora ROI como sustituto de valoración y retirar resultados/ahorros garantizados; cualquier estimación se rotula como escenario.
- Actualizar registro de decisión, índice y estado del proyecto.

## Validación

- Validar enlaces internos/externos, estados mensual/anual, correspondencia de precios, rutas de acceso y etiquetado de beta.
- Revisar responsive, teclado/foco, reduced motion y contraste mediante inspección de navegador cuando esté disponible.
- Ejecutar `git diff --check` y pruebas existentes relevantes sin alterar el runtime ni instalar dependencias.
