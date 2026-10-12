# Tareas — Spec 016

**Estado:** aprobada para implementación local; decisiones de clarificación cerradas el 2026-10-12.

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
- [x] T7. Ejecutar matriz de validación y Gauntlet independiente; corregir hallazgos. (78 pruebas locales; árbitro PASS tras corregir G-01..G-03.)
  (RF: RF-1–RF-12) Hecho cuando: informe local versionado con evidencia real, riesgos y dictamen.
- [x] T8. Preparar paquete local de revisión para Dirección.
  (RF: RF-1–RF-12) Hecho cuando: rama local usa datos sintéticos, enlace de preview funcional y estado Git documentado; sin despliegue remoto.

## Reglas de ejecución

- No habilitar cuentas reales ni desplegar como parte de T2–T8.
- Implementar una tarea cada vez y cubrir los cambios de comportamiento con pruebas antes de modificar código cuando aplique.
- La demo local no crea credenciales ni escribe datos; no introducir excepciones de autenticación en producción.
- Si aparece una decisión sobre retención, fiscalidad, precios o captura real no aprobada, detener solo la parte dependiente y actualizar spec/clarificación.
