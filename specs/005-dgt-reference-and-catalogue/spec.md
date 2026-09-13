# Spec 005 — Referencias DGT y trazabilidad del catálogo

Estado: aprobada para implementación por solicitud explícita del propietario el 2026-09-13.
Producto: CocheMotor España.

## Objetivo

Ayudar a comprador y profesional a acudir a fuentes oficiales de la DGT y evitar que la interfaz presente datos declarados o de demostración como comprobaciones oficiales. Mantener trazabilidad honesta del catálogo local y dejar preparada una importación auditable, sin automatizar consultas personales o protegidas.

## Usuarios / actores

- Comprador que revisa un anuncio de vehículo.
- Profesional o vendedor que prepara la información del anuncio.
- Responsable técnico que mantiene el catálogo estructurado.

## Requisitos funcionales (EARS)

- RF-1: Cuando se muestre una ficha de vehículo, el sistema ofrecerá enlaces oficiales a informe del vehículo, consulta del distintivo ambiental y llamadas a revisión de la DGT.
- RF-2: Cuando no exista evidencia documental de una comprobación, el sistema no afirmará que el vehículo está libre de cargas, tiene ITV vigente ni que la información fue verificada telemáticamente por la DGT.
- RF-3: Cuando se muestre el distintivo ambiental en una ficha, el sistema aclarará que la clasificación visible es informativa/declarada y ofrecerá la consulta oficial por matrícula.
- RF-4: Cuando se importe un catálogo desde CSV, el sistema registrará una fecha de generación separada de la fecha efectiva de los datos; si la procedencia, la fecha o la licencia no se proporcionan, quedarán marcadas como desconocidas y no se inferirán.
- RF-5: El sistema no consultará automáticamente matrículas/VIN ni descargará ni redistribuirá microdatos DGT sin validar primero el esquema, los permisos y las condiciones de reutilización.
- RF-6: Los enlaces externos oficiales abrirán con protección contra acceso a la ventana de origen y serán accesibles por teclado y lector de pantalla.

## Requisitos no funcionales

- No enviar matrículas, VIN, datos personales o identificadores de anuncio en URLs externas.
- Conservar la operación principal aunque los sitios de la DGT no estén disponibles.
- Usar HTTPS y enlazar páginas oficiales, no endpoints internos ni consultas automatizadas no documentadas.

## Casos límite

- Informe DGT no aportado, antiguo o no comprobable desde la ficha: mostrar que no consta verificación y remitir a la consulta oficial.
- Dato del distintivo declarado por el vendedor que no coincide con la consulta DGT: la fuente oficial es la referencia para el comprador; CocheMotor no resolverá automáticamente la discrepancia.
- CSV sin metadatos de fuente/licencia/fecha: importar únicamente como snapshot con procedencia desconocida, sujeto a revisión antes de uso público.
- Enlace oficial temporalmente caído: conservar datos actuales y permitir reintento manual.

## Fuera de alcance

- API o consulta automática de matrícula/VIN, scraping del portal o uso de credenciales DGT.
- Reproducción/redistribución de los microdatos MATRABA o MOVE/PADRÓN/ZBE.
- Certificación de cargas, embargos, titularidad, ITV o garantía por parte de CocheMotor sin evidencia contractual y técnica.
- Sustituir el catálogo existente por ficheros DGT sin auditoría de esquema, cobertura, calidad y licencia.

## Criterios de finalización

- Enlaces DGT visibles y funcionales en ficha.
- No aparecen afirmaciones de verificación o estado registral carentes de evidencia.
- El catálogo no atribuye una fecha de actualización de datos igual a la fecha de cada visita/carga.
- Validación automatizada de enlaces, procedencia y sintaxis aplicable; revisión independiente de QA.
