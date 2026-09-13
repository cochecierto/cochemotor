# CocheMotor — Estado de preparación UE/ES

Fecha: 2026-09-13  
Ámbito: web pública, captación de leads, espacio profesional y API `local-broker`.

## Resultado

**GO CONDICIONADO para demo técnica. NO-GO para explotación comercial con datos reales** hasta completar la identidad del responsable, el registro de tratamientos, la política de conservación/borrado y la revisión jurídica final.

## Hechos verificados

- El backend exige HTTPS en producción y el certificado de `api.cochemotor.es` es válido.
- Los endpoints probados rechazan una modificación de perfil sin sesión y un lead para un vehículo inexistente.
- No se detectan reglas Firebase en el repositorio; la auditoría de reglas Firebase no es aplicable.
- La política de privacidad describe finalidades y derechos, pero no concreta todos los extremos exigibles al interesado.
- El aviso legal no contiene todavía denominación social/NIF/domicilio/registro verificables. No se inventan esos datos.

## Requisitos pendientes antes de producción

1. Sustituir los datos genéricos de `aviso-legal.html` y `privacidad.html` por la identidad real del responsable, domicilio, NIF, registro cuando proceda y medio de contacto efectivo.
2. Aprobar por escrito la base jurídica de cada tratamiento, categorías de datos, destinatarios/encargados, transferencias internacionales y plazos de conservación.
3. Implementar un canal autenticado para acceso, rectificación, supresión, limitación, oposición y portabilidad, con verificación de identidad y trazabilidad.
4. Añadir borrado/anominización automática conforme a los plazos aprobados; actualmente SQLite conserva leads, denuncias y solicitudes sin política automática.
5. Sustituir la clave compartida de asesor por cuentas, roles y aislamiento por tenant; limitar y auditar intentos de login y endpoints de asesor.
6. Completar inventario de terceros (fuentes, imágenes, QR, WhatsApp y analítica) y activar consentimiento previo para cualquier cookie o tecnología no técnica.
7. Ejecutar análisis de riesgos y decidir si procede una EIPD antes de perfiles, matching a escala o decisiones automatizadas.
8. Formalizar contratos de encargado, procedimiento de brechas, copias de seguridad cifradas y restauración probada.

## Cambios técnicos aplicados

- Cabeceras de seguridad en `.htaccess`: HSTS, `nosniff`, `SAMEORIGIN`, política de referencia y permisos mínimos.
- Se mantienen las correcciones previas de autorización de perfil, propiedad de leads y validación de estados.
- Se mantiene la regla de no almacenar secretos ni PII real en el repositorio.

## Base normativa consultada

- RGPD (UE) 2016/679: principios de licitud, transparencia, minimización y seguridad, especialmente artículos 5, 6, 12–14, 25 y 32.
- LSSI-CE, artículo 10: información permanente, fácil, directa y gratuita del prestador.
- Guía de cookies AEPD (mayo de 2024): consentimiento previo, granular, informado y con aceptar/rechazar al mismo nivel para tecnologías no técnicas.

Este documento es una lista técnica de preparación y no sustituye asesoramiento jurídico.
