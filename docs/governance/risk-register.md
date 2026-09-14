# Registro de riesgos

Fecha de revisión: 2026-08-27.

| ID | Riesgo | Estado | Mitigación |
|---|---|---|---|
| R-001 | Información incompleta en la fuente accesible | Abierto | Marcar vacíos como hipótesis o pendientes; no inventar contenido. |
| R-002 | Confusión entre hechos, hipótesis y recomendaciones | Abierto | Etiquetar cada decisión y documento con su nivel de evidencia. |
| R-003 | Copia accidental de credenciales o datos personales | Abierto | Excluir secretos, PII, direcciones protegidas e infraestructura privada. |
| R-004 | Conflictos entre decisiones futuras y documentación actual | Abierto | Usar este registro y solicitar aprobación antes de cambiar alcance. |
| R-005 | Requisitos legales y de datos inmobiliarios por país no definidos | Abierto | Realizar revisión específica antes de ingesta o lanzamiento. |
| R-006 | El alcance aprobado puede mezclarse con capacidades futuras | Abierto | Aplicar la lista de fuera de alcance del project charter y registrar excepciones. |
| R-007 | Dependencia operativa de WhatsApp en el piloto | Abierto | Validar el canal y documentar un mecanismo alternativo antes de depender de él. |
| R-008 | Arquitectura de superficies aprobada sin diseño técnico interno | Abierto | No implementar hasta completar diseño, contratos, seguridad y pruebas. |
| R-009 | Popularidad de una skill interpretada como garantía de seguridad | Abierto | Aplicar la política de admisión; popularidad es solo un filtro inicial. |
| R-010 | Auditorías externas incompletas o desactualizadas | Abierto | Bloquear admisión sin revisión local, commit fijado y reevaluación por cambios. |
| R-011 | Skill externa con instrucciones o scripts peligrosos | Abierto | Leer el árbol completo y probar en aislamiento sin credenciales ni red innecesaria. |
| R-012 | Agente de IA con permisos excesivos | Abierto | Aplicar niveles de acción, mínimo privilegio, trazabilidad y aprobación humana. |
| R-013 | Coste o uso imprevisible de modelos cloud | Abierto | Seleccionar con límites de consumo, presupuesto, alertas y apagado manual. |
| R-014 | Envío de datos sensibles a un proveedor de IA | Abierto | Usar datos sintéticos, minimizar información y revisar retención y jurisdicción antes de integrar. |
| R-015 | Ranking o reputación manipulable o injusto | Abierto | Usar interacciones verificables, metodología explicable, muestra mínima, moderación, derecho de respuesta y separar promoción pagada. |
| R-016 | Confusión entre herramienta tecnológica y servicio inmobiliario o regulado | Abierto | Definir responsabilidades, partners autorizados y límites por país antes de acompañar operaciones hasta escritura. |
| R-017 | Complejidad prematura por escala regional y marca blanca | Abierto | Validar primero el flujo individual en Lima y diseñar un núcleo común con adaptadores por país. |
| R-018 | Identidad corporativa aplicada sin activos maestros o QA | Abierto | Usar el manual como referencia, custodiar maestros y validar accesibilidad, rendimiento, contenido y aprobación de marca. |
| R-019 | indexar inventario sintético, incompleto o sin permiso verificable | Abierto | Mantener fixtures `noindex`, privacidad por defecto, validar publicación/cuenta/contacto y construir sitemap con los mismos criterios; la aprobación exige moderador configurado y auditoría; comprobar en Hostinger antes de solicitar rastreo. |
| R-020 | Skills SEO/copy comunitarias pueden incluir métricas, tácticas o promesas no verificadas | Abierto | Usar solo como referencia, contrastar afirmaciones en fuentes primarias y registrar exclusiones; no prometer ranking, tráfico o conversiones. |
| R-021 | Una política de cookies puede no reflejar scripts/proveedores activos o cambios de configuración | Abierto | Mantener inventario técnico reproducible, bloquear tecnologías no esenciales hasta elección cuando aplique y revisar política tras cambios; no declarar cumplimiento sin evidencia. |
| R-022 | Exportación de cookies de sesión puede comprometer cuentas de navegador | Mitigado | No ejecutar ni instalar `cookie-sync`; prohibir compartir/exportar tokens y cookies en perfiles de privacidad. |
