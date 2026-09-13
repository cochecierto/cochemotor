# Tareas — Spec 006

- [x] T1. Optimizar e incorporar las referencias aprobadas. (RF-1, RF-8) Hecho cuando: diez archivos ligeros se sirven desde assets propios y corresponden a sus etiquetas.
- [x] T2. Implementar guía de diez tarjetas, selección/previsualización, variante libre y contador. (RF-1–RF-4, RF-8, RF-9) Hecho cuando: los estados y límite son accesibles y comprobables.
- [x] T3. Implementar persistencia local de campos y archivos entre navegación de acceso y retorno. (RF-5, RF-7) Hecho cuando: el navegador restaura los mismos blobs y expiración/fallback son seguros.
- [x] T4. Añadir carga autenticada, validación del servidor y asociación de imágenes. (RF-4, RF-6, RF-7) Hecho cuando: uploads verificados llegan a `vehicle_images` con propietario y orden correctos. Hecho en código; la ejecución de carga queda condicionada a GD/WebP en hosting.
- [x] T5. Aplicar la variante correcta del logotipo sobre superficies blancas de publicación y acceso. (RF-10) Hecho cuando: ambas pantallas cargan el asset horizontal con contraste para fondo claro.
- [x] T6. Rediseñar la jerarquía de la publicación para escritorio y móvil. (RF-11) Hecho cuando: formulario y guía quedan agrupados, escaneables y utilizables desde 320 px sin overflow, sujeto a comprobación visual real.
- [ ] T7. Probar y revisar flujo completo, seguridad y responsive. (RF-1–RF-11) Hecho cuando: validación documentada por requisito y sin fallos conocidos de severidad alta.

## Reglas de ejecución

- Implementar una sola tarea cada vez.
- Escribir primero los tests cuando sea aplicable.
- Detener la carga si no hay validación de imagen disponible en PHP.
- No desplegar ni subir a GitHub sin autorización específica de release.
