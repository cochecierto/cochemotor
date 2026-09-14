# Plan técnico — Spec 012

## Decisiones y restricciones

- Crear skills nativas del proyecto sin dependencias ni instalación `npx`.
- Reforzar la skill de copy existente; añadir una skill para auditoría SEO y otra para privacidad/cookies UE-España.
- Tratar las fuentes comunitarias como material revisado, fijado a la fecha de consulta; no copiar texto extenso ni instrucciones inseguras o ajenas a jurisdicción.
- No tocar páginas del producto ni código ejecutable. La publicación de la rama principal está autorizada; solo se desplegarán archivos si forman parte de los payloads SFTP documentados.

## Componentes y responsabilidades

- `.agents/skills/cochemotor-seo/SKILL.md`: auditoría técnica/editorial y visibilidad en búsqueda/IA.
- `.agents/skills/cochemotor-copy-automocion/SKILL.md`: copy de automoción, claims y experimentación responsable.
- `.agents/skills/cochemotor-privacy-cookies/SKILL.md`: evaluación documental/técnica UE-España con evidencias y fuentes oficiales.
- `.agents/cochemotor-agents.json`: registro de perfiles y handoffs.
- `.codex/skills-registry.yaml`, `.codex/vendor-lock.yaml` y `references/`: inventario y admisión.

## Modelo de datos y contratos

No se añaden datos persistentes de producto. Los perfiles producirán informes con URL/superficie revisada, evidencia reproducible, impacto, certeza, recomendación, responsable y necesidad de aprobación. No hay payload de Hostinger para los perfiles/documentos.

## Seguridad, privacidad y reversión

- La auditoría de cookies nunca pedirá o exportará cookies del navegador ni credenciales.
- Probar sitios públicos sin autenticación ni carga de datos; usar evidencia redactada y no guardar datos de visitantes.
- Reversión: restaurar los archivos documentales mediante Git; no requiere migración.

## Decisiones técnicas

| Decisión | Motivo | Alternativa descartada |
|---|---|---|
| Skills internas adaptadas | Permite separar heurísticas útiles de afirmaciones incorrectas y jurisdicción ajena | Instalar íntegramente instrucciones comunitarias |
| Sin scripts ni paquetes | El propósito es guía de agente, y algunas fuentes implican credenciales o red | `npx skills add` en el árbol operativo |
| Auditoría SEO con evidencia | Reduce recomendaciones genéricas e impactos no verificables | Prometer posiciones, tráfico o factores de ranking |

## Trazabilidad hacia requisitos

| Parte del plan | RF cubiertos |
|---|---|
| Skill SEO | RF-1, RF-2 |
| Skill copy | RF-3 |
| Skill privacidad/cookies | RF-4, RF-5, RF-6 |
| Registro y gobernanza | RF-7, RF-8 |

## Estrategia de pruebas

- Analizar JSON y YAML sin instalar dependencias; comprobar rutas de skills y nombres registrados.
- Revisar manualmente fuentes, límites legales, exposición de secretos, claims y criterios de no-invención.
- `git diff --check` y matriz RF de validación.
