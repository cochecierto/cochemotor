# Plan técnico — Spec 014

Estado: aprobado por Dirección el 2026-09-14 para implementación local.

## Diseño

1. Fijar el contrato de sesión en un helper compartido de frontend que adjunte
   `Authorization: Bearer <token>` a las operaciones protegidas; hacer que
   sesión, logout, publicación y lectura del panel lo utilicen. Mantener el
   token fuera de URL, logs y respuestas posteriores al login.
2. Añadir pruebas de contrato frontend/API que demuestren que el token llega al
   helper PHP y que llamadas sin token/expiradas devuelven 401. Usar PHP nativo
   y dobles/mocks donde el runtime de MySQL no esté disponible.
3. Completar o eliminar la llamada rota `populatePriceSearchSelect()` usando
   datos reales de filtro; encapsular inicialización para que catálogo vacío,
   fallo HTTP y query params sigan mostrando un estado válido.
4. Asegurar `POST /api/leads`: validar tipos, longitudes, información y
   declaración de contacto aprobadas, estado publicado/contactable y vínculo
   coche/tenant con consultas preparadas; añadir una defensa de tasa apropiada
   al entorno. Mantener el envío público voluntario, sin exigir cuenta.
5. En `ficha.html`, esperar el resultado del servidor antes de mostrar éxito o
   registrar el lead localmente. En error, preservar los campos; en ficha
   sintética, ocultar/deshabilitar el envío y no sugerir que el vendedor
   contactará. Retirar promesas de tiempo no respaldadas por un SLA aprobado.
6. Actualizar alta profesional con enlaces y declaraciones de privacidad según
   documentos vigentes; validar en servidor solo las aceptaciones realmente
   aprobadas, sin incorporar asesoramiento legal en el copy.
7. Medir imports de catálogo, cargar datos por demanda o sustituir el payload
   inicial por un índice compacto, con prueba que limite el tamaño de la ruta
   crítica y preserve las opciones admitidas.
8. Consolidar las listas de despliegue en un manifest/script reutilizable o
   checks de consistencia que incluyan dependencias transitivas. Versionar
   assets CSS/JS y comprobar SHA-256 del contenido servido después del deploy.
9. Añadir pruebas de estado HTTP y contenido para rutas de ficha inexistente,
   catálogo vacío y activos cacheados. No eliminar semántica SEO existente.

## Seguridad y datos

- Prohibido usar la cuenta/contraseña de producción para pruebas automatizadas.
- Probar autenticación y autorización con usuario y base sintéticos aislados.
- No realizar escrituras de leads, anuncios o consentimientos en producción.
- Reusar consultas preparadas, normalización existente y mensajes seguros.
- Las defensas de abuso no guardarán PII innecesaria ni afectarán a usuarios
  legítimos; la configuración deberá ser compatible con Hostinger.

## Validación

- Pruebas unitarias de contratos de sesión, validación de payload, datos de
  contacto, rate limit, permisos de tenant, persistencia antes de éxito,
  preservación del formulario, inventario vacío y filtros con URL.
- Smoke E2E local con navegador si disponible; de lo contrario, servidor local,
  tests HTTP, consola/JS y documentación explícita de cobertura faltante.
- Pruebas de regresión de todas las suites actuales; sintaxis PHP/JS y
  `git diff --check`.
- Revisar visual/responsive a 320, 390, 768, 1024 y 1440 px y navegación por
  teclado.
- Verificar workflows/manifests localmente. Smoke de Hostinger tras publicar
  queda para una fase posterior autorizada.
- La ruta pública de ficha inexistente debe responder 404 y no exponer
  contenido sintético como oferta real.

## Release y rollback

- Mantener cambios en rama de trabajo revisable; no empujar ni desplegar con
  esta iniciativa sin autorización explícita posterior.
- Preparar una lista de archivos afectados, commit candidato, huellas y
  rollback antes de cualquier release.
- No ejecutar migraciones productivas; si fueran imprescindibles, actualizar
  spec, preparar backup/plan de reversión y obtener aprobación específica.
