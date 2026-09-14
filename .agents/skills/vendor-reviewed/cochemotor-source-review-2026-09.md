# Evaluación de fuentes comunitarias para skills CocheMotor

Fecha de revisión: 2026-09-14. Las cifras de skills.sh son una instantánea de descubrimiento, no una garantía de seguridad ni calidad. No se descargaron ni ejecutaron paquetes. Los repositorios se revisaron en su rama principal; al no fijar una versión instalada, esto no es una aprobación para vendorización.

Los commits se fijan para reproducir la inspección. No se certifica aquí una auditoría externa de seguridad; ninguna fuente está admitida como skill externa vendorizada. Las decisiones de rechazo se basan en jurisdicción, propósito o instrucciones identificadas directamente.

## `coreyhaines31/marketingskills`

- Fuente: [GitHub](https://github.com/coreyhaines31/marketingskills), licencia MIT. `skills.sh` mostraba aproximadamente 206,5K instalaciones para `seo-audit`, 199,5K para `copywriting` y 124,5K para `ai-seo` el día de consulta.
- Commit revisado en `main`: `5b2c0007766c6a1cf1d53fd8fc73e979e0821022`.
- Utilidad aceptada: jerarquía práctica de auditoría y claridad centrada en usuarios; estructura y calidad editorial; atención a contenido atribuible y útil.
- Controles: no se importaron estadísticas no sustentadas, reglas rígidas de longitud, factores de posicionamiento, tácticas SEO mágicas ni promesas de conversión/cita por IA. No se copió texto extenso.
- Veredicto: adaptado como criterio interno en `cochemotor-seo` y `cochemotor-copy-automocion`; no se instala versión externa.

## `sushegaad/claude-skills-governance-risk-and-compliance --skill lgpd`

- Fuente revisada: [GitHub](https://github.com/Sushegaad/Claude-Skills-Governance-Risk-and-Compliance), skill declarada LGPD Brasil, materiales de ANPD y regulación brasileña.
- Commit revisado en `main`: `f47afba773c01222b69296be8f6701657dedb9f0`.
- Riesgo: jurisdicción no aplicable a este agente UE/España; el material incluye afirmaciones de adecuación que necesitan verificación y no deben traducirse como derecho europeo.
- Veredicto: no admitida como fuente jurídica ni instalada. Se usan AEPD, BOE y EUR-Lex.

## `browserbase/skills --skill cookie-sync`

- Fuente revisada: [GitHub](https://github.com/browserbase/skills/tree/main/skills/cookie-sync), licencia declarada MIT. Incluye script Node, Stagehand/Browserbase y exportación de cookies Chrome a un contexto persistente cloud mediante `BROWSERBASE_API_KEY`.
- Commit revisado en `main`: `6811ca31163332d9d60309cff48e77f09de37a17`.
- Riesgo: extrae material de sesión/autenticación y lo transmite a un proveedor externo; es ajeno al consentimiento de visitantes y crea riesgo directo de acceso a cuentas.
- Veredicto: rechazo; no instalar, ejecutar ni usar para auditoría de cookies.

## `kostja94/marketing-skills --skill cookie-policy-page-generator`

- Fuente revisada: [GitHub](https://github.com/kostja94/marketing-skills), licencia MIT. El árbol no contiene el slug pedido; existe `skills/pages/legal/cookie-policy`.
- Commit revisado en `main`: `70987bad4ebe9dce1f74858c1c64f3f8810f18e4`.
- Utilidad aceptada: lista estructural de elementos para inventario/transparencia (finalidad, duración, proveedor y retirada) únicamente cuando se hayan verificado.
- Riesgo: la skill hallada sugiere que analítica puede basarse en aviso/aceptación implícita. Esa afirmación no se adopta: la AEPD exige consentimiento válido para cookies no exentas y aceptación/rechazo al mismo nivel y visibilidad.
- Veredicto: no se instala; se construye skill interna UE/ES con AEPD/LSSI/RGPD como fuentes.

## Decisión y límites

La solicitud explícita de Juan autoriza crear estos perfiles internos. El resultado no incluye ejecución de `npx skills add`, código descargado, dependencias, acceso autenticado, revisión jurídica completa ni despliegue web. Revalidar fuente/versión legal antes de cada auditoría y reevaluar un community skill si se propone incorporarlo literalmente.
