# Tareas — Spec 016

**Estado:** aprobada para implementación local; decisiones de clarificación cerradas el 2026-10-12.

Enmienda 2026-10-12: Dirección autoriza publicación a GitHub y despliegue en Hostinger del estado informativo sin escrituras, sin cuentas reales y sin DDL. Las tareas T9–T11 extienden el cierre técnico de la iniciativa; no alteran RF-1–RF-12 ni abren alta.

- [x] T1. Aprobar CTA sin stock, límites de captura, prueba local y comunicación de fin de beta.
  (RF: RF-2, RF-7, RF-8, RF-12) Hecho cuando: clarification emite `GO` y la spec queda aprobada.
- [x] T2. Separar fixtures sintéticos del inventario público y resolver vacío/error/no coincidencias.
  (RF: RF-1, RF-2, RF-4) Hecho cuando: el catálogo público solo contiene publicaciones autorizadas y los tres estados se verifican por separado.
- [x] T3. Completar bandas y lógica de filtros de precio.
  (RF: RF-3) Hecho cuando: límites no se solapan ni dejan huecos y los tests cubren bordes.
- [x] T4. Inventariar y alinear capacidades de landing, demo, panel y metadatos.
  (RF: RF-5, RF-6) Hecho cuando: ningún módulo afirma IA, demanda real o publicación conectada que no ejecuta.
- [x] T5. Habilitar o documentar el recorrido local aislado con datos sintéticos según clarificación.
  (RF: RF-7, RF-8, RF-12) Hecho cuando: el flujo acordado se completa sin datos/efectos externos y se registra almacenamiento/acceso.
- [x] T6. Hacer explícitos los supuestos y exclusiones de cuota y margen.
  (RF: RF-9, RF-10, RF-11) Hecho cuando: entradas, tasa/tipo, fórmula, gastos y límites visibles coinciden con el cálculo.
- [x] T7. Ejecutar matriz de validación y Gauntlet independiente; corregir hallazgos. (89 pruebas pasan; 5 pruebas Bash reservadas para CI Linux; arbitraje final PASS.)
  (RF: RF-1–RF-12) Hecho cuando: informe local versionado con evidencia real, riesgos y dictamen.
- [x] T8. Preparar paquete local de revisión para Dirección.
  (RF: RF-1–RF-12) Hecho cuando: rama local usa datos sintéticos, enlace de preview funcional y estado Git documentado; sin despliegue remoto.
- [x] T9. Cerrar las rutas de creación de cuenta que sobreviven al bloqueo de OAuth, y retirar controles muertos si la API falla.
  (RF: RF-2, RF-8, RF-12) Hecho cuando: callback OAuth devuelve 403 antes de red/DB/creación de cuentas y controles de búsqueda se ocultan en indisponibilidad.
- [x] T10. Preparar release completo, compatible con solo lectura, y actualizarlo respecto a main.
  (RF: RF-1–RF-12) Hecho cuando: SFTP incluye cada activo permitido; el promotor conserva snapshot, serializa promoción/rollback y restaura si falla la promoción o el smoke test; guardia confirma backup y no DDL; solo existe un workflow de publicación.
- [x] T11. PR #6 y PR #7 fusionados; despliegue Hostinger verificado por workflow manual #129.
  (RF: RF-1–RF-12) Hecho cuando: PR integrado en main, GitHub Actions concluye con éxito y producción muestra beta informativa, no stock sintético y endpoints de escritura cerrados.

## Reglas de ejecución

- No habilitar cuentas reales, OAuth ni escrituras públicas; el único despliegue autorizado es la beta informativa sin DDL.
- Implementar una tarea cada vez y cubrir los cambios de comportamiento con pruebas antes de modificar código cuando aplique.
- La demo local no crea credenciales ni escribe datos; no introducir excepciones de autenticación en producción.
- Si aparece una decisión sobre retención, fiscalidad, precios o captura real no aprobada, detener solo la parte dependiente y actualizar spec/clarificación.

