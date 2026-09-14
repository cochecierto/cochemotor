# Plan técnico — Spec 013

## Decisiones

- Crear `.agents/skills/cochemotor-mobile-app-ux/SKILL.md` y registrar el perfil en `.agents/cochemotor-agents.json` y `.codex/skills-registry.yaml`.
- Mantener el criterio independiente de plataforma: WCAG para web y guía nativa correspondiente cuando la app/plataforma se confirme.
- No instalar Sleek; documentar source, commit, auditorías comunitarias reportadas y razón de no admisión.
- Actualizar CURRENT-STATE, índice, riesgos y decisión; no tocar código de producto.

## Responsabilidades y contratos

El agente produce revisión trazable: tarea/rol, contexto, fricción con evidencia, flujo/pantallas, propuesta, criterios de aceptación, riesgos y pruebas por dispositivo. Handoff a diseño, web, producto, privacidad y calidad.

## Seguridad, privacidad y reversión

- Sin cuentas, claves, PII, imágenes privadas, APIs o cambios de producción.
- Revertir skill/registro/documentación con Git; no hay migración ni dependencia.

## Pruebas

- Parsear JSON de agentes, comprobar que todas las rutas de skill existen y validar front matter.
- Revisar manualmente targets táctiles, distinción por plataforma, claims y límites de credenciales.
- `git diff --check`; no se modifica lógica ejecutable.
