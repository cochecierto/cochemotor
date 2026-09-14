# Tareas — Spec 014

- [x] T1. Aprobar spec y clarificación. Hecho cuando: Dirección aprueba el
  alcance RF-1..RF-8 y los límites de datos/release el 2026-09-14.
- [x] T2. Aprobar plan técnico. Hecho cuando: los contratos, pruebas,
  compatibilidad, protección de leads y release quedan aprobados el 2026-09-14.
- [x] T3. Añadir regresiones para Bearer, selector de precio, persistencia de
  leads y release. Las pruebas nuevas fallaron en la línea base y ya pasan.
- [x] T4. Corregir sesión y publicación autenticada. Cubierto por pruebas de
  contrato y sintaxis, con cargas del panel ligadas al usuario autenticado.
- [x] T5. Corregir inicializador del selector de precio y carga de catálogo
  diferida en inicio; añadir estados de error/vacío.
- [x] T6. La ficha real espera persistencia y conserva datos si falla la API;
  las fichas demo no exponen contacto.
- [x] T7. El alta exige declaraciones versionadas; leads validan datos, anuncio
  y contacto elegibles, honeypot y límite de reenvíos.
- [x] T8. El catálogo de 4.2 MB ya no es dependencia estática de la ruta crítica.
- [x] T9. El workflow incluye activos de runtime y compara hashes SHA-256 tras
  publicar. El SQL permanece en el repositorio y no se sube a public_html.
- [x] T10. Validación local: 65 pruebas Python y lint PHP/JS pasan. La matriz
  registra evidencia local y pasos que requieren producción.
- [ ] T11. Release Hostinger, solo con autorización separada. Hecho cuando: se
  verifica en producción el commit y hashes publicados sin crear datos reales.
