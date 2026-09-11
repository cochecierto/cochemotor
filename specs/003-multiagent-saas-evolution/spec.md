# Spec 003 — Evolución SaaS Multi-Tenant, Marketplace y Gobernanza Multi-Agente CocheMotor

## Contexto y Visión
Basado en los documentos maestros `PROMPT_MAESTRO_EQUIPO_AGENTES_IA_COCHEMOTOR.md` y `Prompt_Maestro_CocheMotor_Evolucion_SaaS_Marketplace.md`, CocheMotor evoluciona hacia una plataforma AutoTech B2B2C integral gobernada por un organigrama de 15 agentes de IA especializados. La plataforma combina un marketplace de máxima confianza con un SaaS operativo para profesionales del motor (freelances, talleres y concesionarios independientes).

## Principios Fundamentales
1. **Transparencia Radical**: Separación estricta entre datos *declarados*, *documentados*, *verificados (DGT/OBD)* y *generados por IA*.
2. **Prudencia Legal**: Asistencia guiada conforme a la normativa española de consumo, DGT y garantías de 1 año, sin sustituir peritajes judiciales o asesoramiento jurídico colegiado.
3. **Aislamiento Multi-Tenant**: Cada profesional opera en su espacio segregado con sus métricas y vehículos.
4. **Human in the Loop**: Los agentes asisten y recomiendan; el profesional valida y aprueba.

## Actores
- **Director / Orquestador (`cochemotor-director`)**: Supervisa objetivos, prioridades y trazabilidad.
- **Profesional / Taller Partner (`cochemotor-operations-coordinator` / `inventory-manager`)**: Gestiona stock a través de 13 fases y documenta inspecciones de taller en 100 puntos.
- **Comprador Particular (`cochemotor-buyer-assistant`)**: Consulta fichas enriquecidas, interactúa con el asistente prudente y accede a su expediente digital (Deal Room).

## Requisitos Funcionales (Formato EARS)

### Módulo 1: Ciclo de Vida del Vehículo (13 Fases)
- **EARS-001**: CUANDO un profesional consulte o actualice un vehículo en el inventario del Hub, EL SISTEMA permitirá transicionar entre las 13 etapas reglamentarias:
  1. `captado`
  2. `en_verificacion`
  3. `en_puesta_a_punto`
  4. `listo_para_publicar`
  5. `publicado`
  6. `lead_activo`
  7. `prueba_concertada`
  8. `reservado`
  9. `contrato_pendiente`
  10. `vendido`
  11. `entregado`
  12. `en_posventa`
  13. `retirado`

### Módulo 2: Clasificación y Evidencias de Verificación
- **EARS-002**: CUANDO se muestren datos técnicos o mecánicos de un vehículo (tanto en el Hub como en la ficha pública), EL SISTEMA etiquetará cada dato con su nivel de evidencia:
  - `declarado` (facilitado por el vendedor sin comprobación documental externa).
  - `documentado` (ficha técnica, permiso de circulación o facturas aportadas).
  - `verificado_obd` (diagnóstico electrónico en centralita ECU aportado por taller homologado).
  - `verificado_dgt` (informe telemático de cargas e historial de titularidad).

### Módulo 3: Expediente Digital y Sala Privada de Operación (Deal Room)
- **EARS-003**: CUANDO un profesional formalice un interés de compra desde el Hub, EL SISTEMA generará una Sala Digital de Operación (Expediente Digital) con identificador único, token temporal de acceso y borrador contractual referenciado en las pautas oficiales de la DGT para compraventa entre profesionales y particulares.
- **EARS-004**: CUANDO el comprador o vendedor acceda al Expediente Digital, EL SISTEMA mostrará el checklist de entrega, estado de la reserva, garantía aplicable de 12 meses y documentación anexa.

### Módulo 4: Asistente Prudente del Comprador en B2C
- **EARS-005**: CUANDO un usuario consulte una ficha de vehículo (`ficha.html`), EL SISTEMA dispondrá de un panel desplegable de "Asistente del Comprador" con:
  1. Preguntas críticas que formular al vendedor según combustible y kilometraje.
  2. Calculadora desglosada de costes de cambio de titularidad (Tasa oficial DGT de 55,70 € + ITP autonómico estimado del 4% al 8%).
  3. Checklist estructurado de comprobaciones durante la prueba dinámica en carretera.
- **EARS-006**: EL SISTEMA incluirá advertencias de prudencia en todo momento indicando que las orientaciones del asistente son de carácter informativo y no sustituyen una revisión profesional ni la verificación presencial en gestoría.

### Módulo 5: Registro y Gobernanza Multi-Agente
- **EARS-007**: EL SISTEMA mantendrá en `.agents/cochemotor-agents.json` el registro formal de los 15 agentes de IA de CocheMotor con sus roles, permisos, entradas y salidas esperadas.
