# Contexto consolidado de investigación — CocheMotor

Estado: referencia de producto y estrategia. No sustituye validación legal, comercial ni técnica.

## Decisiones consolidadas

- CocheMotor es una plataforma AutoTech B2B2C independiente de CocheCierto.
- Buyer persona pagador y prioritario: freelancers de compraventa, talleres y pequeños concesionarios multimarca.
- La capa B2C sirve para captar particulares y sus necesidades, sin desplazar el posicionamiento profesional.
- `Coche Ideal` es la landing y flujo B2C para solicitar una búsqueda personalizada sin pago, reserva ni compromiso automático.
- El flujo distingue consulta, propuesta de vehículo y posterior reserva o compraventa.
- El matching B2B debe respetar tenant, consentimiento, trazabilidad y estados operativos.
- La identidad aprobada es CocheMotor: `Compra claro. Vende mejor.`; dominio objetivo: `cochemotor.es`.

## Requisitos funcionales recordados

Coche Ideal recoge vehículo, presupuesto y preferencias, datos de contacto, provincia y consentimientos verificables. Debe conservar datos al navegar, validar obligatorios, mostrar resumen antes de enviar, registrar la solicitud, notificar al asesor y permitir estados: nueva, en revisión, opciones encontradas, presentada al cliente, aceptada, descartada y cerrada.

Las propuestas deben informar de características, estado, historial, kilometraje, equipamiento, precio y costes antes de cualquier decisión. La búsqueda no garantiza disponibilidad ni compra.

## Datos y fuentes

El catálogo de vehículos debe ser propio y versionado para permitir Marca → Modelo → Año → Combustible → Versión sin depender de una API comercial. Las fuentes externas sirven para enriquecer o revisar, no para bloquear el flujo principal. La territorialidad española debe modelarse con CCAA, provincias y municipios normalizados y con identificadores estables.

## Principios de comunicación

- Copy B2B para captación y operación profesional.
- Landing independiente y copy B2C para Coche Ideal.
- No usar nombres, teléfonos, correos ni datos personales reales en demos, fixtures o ejemplos.
- Configurar textos sensibles y datos de contacto mediante variables.
- No presentar hipótesis de mercado, obligaciones legales o disponibilidad de datos como hechos verificados.

## Referencias del proyecto

- `docs/brand/COCHEMOTOR-BRAND-BOOK.md`
- `docs/brand/BRAND-CONTEXT.md`
- `specs/004-coche-ideal/spec.md`
- `.agents/skills/cochemotor-coche-ideal/SKILL.md`
- `docs/governance/project-charter.md`