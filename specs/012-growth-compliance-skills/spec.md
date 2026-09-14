# Spec 012 — Skills internas de SEO, copy y privacidad web

## Contexto y objetivo

CocheMotor necesita perfiles operativos coherentes para SEO (incluida la visibilidad en respuestas de IA), copywriting y privacidad/cookies. Las skills comunitarias solicitadas sirven como referencias, pero no deben introducir afirmaciones no verificadas, instrucciones de otra jurisdicción ni código que gestione credenciales.

## Usuarios / actores

- Dirección y equipo de contenido de CocheMotor, para webs dirigidas a España.
- Perfiles growth, SEO, copy, web y cumplimiento que revisan contenido e implementación.

## Historias de usuario

- H1: Como responsable de crecimiento, quiero auditar páginas por impacto y evidencia para priorizar mejoras SEO.
- H2: Como editor, quiero redactar copy claro y fiel al producto sin promesas inventadas.
- H3: Como responsable del sitio, quiero evaluar cookies y privacidad con criterios UE/España y fuentes oficiales actuales.

## Requisitos funcionales (criterios de aceptación EARS)

- RF-1: CUANDO se solicite trabajo SEO, EL PERFIL revisará intención, rastreo/indexación, contenido, enlaces internos, datos estructurados y rendimiento relevante, priorizará por impacto/evidencia/esfuerzo y distinguirá hallazgo de recomendación.
- RF-2: CUANDO se solicite SEO para buscadores con IA, EL PERFIL aplicará contenido útil, comprensible, verificable y atribuible; no afirmará factores de ranking, cuotas, resultados ni requisitos especiales sin fuente primaria vigente.
- RF-3: CUANDO se redacte o revise copy, EL PERFIL usará contexto y tono CocheMotor, explicitará público/superficie/objetivo, preservará hechos y marcará claims pendientes de prueba o revisión legal.
- RF-4: CUANDO se auditen privacidad y cookies, EL PERFIL solicitará inventario técnico comprobado, distinguirá acceso/almacenamiento en terminal de tratamiento de datos personales y contrastará criterios con AEPD, LSSI y RGPD vigentes.
- RF-5: SI no existe inventario verificado de cookies, proveedores, finalidades, duración o transferencias, ENTONCES EL PERFIL no los inventará ni redactará una política que los presente como hechos.
- RF-6: SI se detecta tecnología no esencial que almacena o accede a información del terminal antes de una elección válida, ENTONCES EL PERFIL marcará hallazgo prioritario y describirá cómo reproducirlo; no declarará cumplimiento sin validar el sitio completo.
- RF-7: EL SISTEMA registrará en el vendor lock la fuente, referencia/fecha consultada, alcance utilizado y motivo de admisión o rechazo de cada skill externa solicitada.
- RF-8: EL SISTEMA enlazará los perfiles desde el registro interno y definirá handoffs con growth, copy, web, seguridad, calidad y dirección.

## Requisitos no funcionales

- Documentación en español claro, legible y versionada; no requiere dependencias de runtime.
- Fuentes legales enlazadas a textos oficiales, con recordatorio de verificar vigencia y asesoramiento especializado en decisiones jurídicas.
- Ningún perfil almacenará secretos, cookies de sesión, PII real ni credenciales.

## Casos límite

- La skill solicitada no existe bajo ese slug exacto en el repositorio fuente.
- Una recomendación de la fuente comunitaria contradice una fuente oficial o aplica a Brasil.
- La web cambia proveedores/cookies después de redactar su política.
- SEO y conversión piden claims no sustentados o tracking sin revisión de privacidad.

## Fuera de alcance

- Instalar literalmente skills externas no admitidas, automatizar cambios en producción, ejecutar rastreos autenticados, crear CMP o modificar cookies/web/política publicada.
- Certificar cumplimiento jurídico, garantizar ranking, indexación, tráfico o conversiones.
- Desplegar estas skills como parte de la web pública: no son archivos del sitio ni forman parte del payload SFTP.
- Subir otros cambios de la web a Hostinger que no estén incluidos en esta spec.

## Criterios de finalización

- Skills internas SEO y privacidad/cookies creadas; skill de copy existente reforzada sin reemplazar su tono aprobado.
- Perfiles registrados y JSON válido; registry y vendor lock actualizados.
- Fuentes y decisiones de admisión documentadas; controles no inventan contenido técnico o legal del sitio.
- Validación estructural, enlaces internos, diff y trazabilidad RF completados.

## Dudas abiertas

- Ninguna para este alcance documental. La configuración real de cookies y las decisiones legales concretas requieren inventario y revisión posterior.
