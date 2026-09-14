# Revisión de `design-mobile-apps` — CocheMotor

Fecha: 2026-09-14.

## Fuente y alcance revisado

- Repositorio: [designed-by-ai/skills](https://github.com/designed-by-ai/skills), commit `bd6696bb2db7c874ebd8d68431c1642e7d2283bd`.
- Skill: `skills/design-mobile-apps/SKILL.md`; carpeta con un solo `SKILL.md`, sin scripts auxiliares. Licencia MIT.
- Descubrimiento en skills.sh: 184,1K instalaciones; la página mostraba auditorías Gen, Agent Trust Hub, Socket y Snyk como `Pass` (instantánea del 2026-09-14). Popularidad/auditorías no sustituyen revisión local.

## Hallazgos

- La guía es una integración para diseñar en Sleek, no un especialista general para auditar o mejorar una app móvil existente.
- Exige `SLEEK_API_KEY`; sus scopes incluyen crear/eliminar proyectos, enviar mensajes que generan/actualizan pantallas, leer componentes y generar capturas. La guía informa del plan Pro de pago.
- El front matter declara que la red se limita a `sleek.design`, pero el cuerpo indica descargar iconos desde `api.iconify.design` y menciona Google Fonts. Esa discrepancia de hosts no se incorpora.
- La API recibe briefs, imágenes y genera pantallas en un servicio externo. Crear/editar proyectos allí, usar créditos o compartir referencias requiere petición expresa en la tarea correspondiente; no hay clave almacenada ni cuenta conectada para este agente.
- Auditorías comunitarias consultadas: Pass según skills.sh. No se ejecutó código; el skill no incluye scripts.

## Decisión

No se ejecuta `npx skills add` ni se instala el `SKILL.md` de Sleek en el espacio activo de agentes. Sus acciones, requisito de credencial y alcance SaaS no coinciden con el agente local solicitado. Se crea `cochemotor-mobile-app-ux`, una alternativa propia para flujos de CocheMotor, que cita WCAG/Apple y puede derivar a Sleek solo si una petición futura lo solicita. Esta decisión no impide admitir la integración Sleek en otra iniciativa con alcance, credenciales, destino de datos y límites de coste aprobados.
