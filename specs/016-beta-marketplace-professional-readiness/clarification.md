# Clarificación — Spec 016

Revisión de alcance basada en el resumen de Dirección recibido el 2026-10-12. Las tres decisiones abiertas fueron respondidas explícitamente por Dirección en esta conversación; implementación local autorizada, sin publicación/despliegue.

## Ambigüedades

1. El CTA sin stock podría explicar Coche Ideal o recopilar una solicitud real. La segunda opción guarda datos de contacto y crea expectativas de atención que requieren un profesional disponible.
2. «Datos sintéticos hasta tener los primeros profesionales suscritos» no precisa si permite altas beta reales, captura de compradores, persistencia local de prueba o envío de correo de verificación. El flujo de prueba solicitado debe evitar PII y efectos externos.
3. La fecha de fin de beta se menciona como hito, pero no hay una política aprobada de exportación, retención o eliminación del inventario, fotos, cuentas y consultas.
4. Los simuladores tienen supuestos distintos: el demo usa un tipo efectivo anual fijo del 8,9 % para capitalización mensual; el panel usa TIN editable por defecto del 7,9 % convertido a tasa mensual; la ficha contiene una referencia de TAE aproximada. No hay una entidad financiera conectada ni fuente de mercado aprobada.

## Contradicciones entre requisitos

1. El criterio de no tener stock sintético visible para compradores contradice el fallback actual del marketplace a `siteConfig.stock` cuando el endpoint público no devuelve datos. Debe prevalecer la regla de solo inventario público autorizado; la demo profesional conserva sus ejemplos en su superficie aislada.
2. La demo declara que el texto es una plantilla sin IA, mientras varias etiquetas del panel/SEO la describen como IA. La afirmación debe coincidir en todas las superficies.
3. El panel describe solicitudes con «presupuesto real», aunque el conjunto local parte de solicitudes sintéticas. Los datos de muestra no pueden atribuirse a compradores reales.

## Casos límite no cubiertos

1. Diferenciar cero coincidencias por filtros, catálogo real vacío y error/no configuración de API.
2. Bloquear el alta o contacto desde una ficha sintética abierta directamente por URL.
3. Separar la autenticación local de prueba y su verificación del sistema real, sin añadir bypass en producción.
4. Mostrar el límite exacto de una banda de precio (20.000/20.001/25.000 €) sin saltos ni solapamientos.
5. Comunicar el tratamiento de borradores, fotos y contactos al concluir la beta.

## Conflictos con la gobernanza

1. SDD exige aprobación de spec y clarificación `GO` antes de modificar código. Este borrador no autoriza implementación.
2. Política de privacidad, retención y condiciones de cuenta no deben prometer una conducta aún no aprobada ni verificada. Se resolverá la política antes de cambiar esos textos.
3. El Gauntlet final no sustituye la autorización separada para publicar cambios o desplegar.

## Riesgos pendientes

1. CTA que capture datos sin capacidad real para responder: pérdida de confianza y riesgo de tratamiento innecesario. Responsable: Dirección.
2. Cambio de política de fin de beta sin plazo, responsable o comportamiento técnico confirmado. Responsable: Dirección y privacidad.
3. Mostrar TAE aparente como condición comercial: engaño involuntario si ignora comisiones, vinculaciones o gastos. Responsable: Dirección; el equipo debe limitar el simulador a una estimación matemática explicada.
4. Un modo local de prueba mal aislado puede reutilizar credenciales, base de datos o correo real. Responsable: implementación y árbitro.

## Respuestas de Dirección y restricciones vinculantes

1. **CTA y captura:** «Solo informativo y recorrido local sintético». No se aceptarán cuentas beta reales, contactos reales ni solicitudes de compradores antes de contar con profesionales suscritos. El CTA sin stock será informativo y no abrirá formularios que almacenen PII. El flujo de prueba será únicamente local y sintético.
2. **Fin de beta:** «No prometer aún; decidirlo antes de habilitar cuentas reales». Se explicarán almacenamiento y accesos actualmente comprobables. No se inventará una promesa de conservación, exportación o eliminación; resolverla es condición previa a cuentas reales.
3. **Financiación:** «Conservar TIN editable 7,9 % y mostrar equivalente teórico sin costes». Se evita llamar TAE al cálculo matemático, ya que no incorpora costes ni comisiones.

## Veredicto

`GO` para implementar localmente el alcance de `spec.md`, sujeto a las restricciones anteriores. La solicitud previa de versión local para verificar el proceso autoriza el recorrido de prueba sintético. No hay autorización para publicar a GitHub, fusionar ni desplegar.

## Enmienda de Dirección — release informativa, 2026-10-12

Dirección sustituye la restricción anterior de no publicar/desplegar para esta iniciativa y autoriza continuar hasta publicar en GitHub y desplegar en Hostinger la versión informativa de la beta. La autorización no permite habilitar altas/cuentas reales, solicitudes, leads, OAuth, escrituras de inventario, mensajería ni aplicar DDL. La publicación queda condicionada a backup reciente verificado, revisión Gauntlet independiente, validación automatizada y verificación en producción de los activos y flujos del release.
