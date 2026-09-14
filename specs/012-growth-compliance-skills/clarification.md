# Clarificación — Spec 012

## Ambigüedades

1. La petición inicial autoriza adaptar las skills aportadas como fuentes de referencia, no exige instalación literal. La petición posterior autoriza publicar en GitHub y solicita despliegue a Hostinger; se aplica a los cambios de esta spec. Estos son perfiles/documentos de agente y no forman parte de los archivos del sitio enviados por el workflow SFTP.
2. La expresión LGPD se refiere a una fuente brasileña; el alcance del nuevo perfil se limita a la UE/España como pidió el usuario.

## Contradicciones entre requisitos

1. `cookie-sync` sincroniza cookies locales de autenticación a un contexto cloud y no gestiona consentimiento; contradice el objetivo de cumplimiento y se excluye.
2. La skill `lgpd` trata legislación brasileña; no es fuente de requisitos UE y se excluye como guía normativa.
3. La skill `cookie-policy-page-generator` no existe con ese nombre en el árbol revisado de `kostja94/marketing-skills`; existe `skills/pages/legal/cookie-policy`, cuya sugerencia de consentimiento implícito para analítica no se incorpora.

## Casos límite no cubiertos

1. La política real no puede redactarse sin escaneo/inventario comprobado de tecnologías y proveedores.
2. Exenciones de consentimiento para almacenamiento estrictamente necesario o medición de audiencia dependen de las condiciones y orientación vigentes; no se presumen.

## Conflictos con la gobernanza

1. Ninguno para crear documentación interna. Se mantienen las restricciones contra dependencias y credenciales reales; el despliegue a Hostinger solo procede para un payload web aplicable, que no existe en esta spec.

## Riesgos pendientes

1. Cambios normativos o guías nuevas: revalidar fuentes oficiales antes de usar el perfil en una auditoría real. Responsable: perfil de cumplimiento y Dirección.
2. Claims SEO/copy sin evidencia: exigir trazabilidad, revisión de marca/producto y aprobación humana.

## Veredicto

`GO CONDICIONADO` — se admite la adaptación interna documentada; no se importan paquetes, scripts ni orientación jurídica no aplicable.
