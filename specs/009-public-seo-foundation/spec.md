# Spec 009 — Páginas públicas indexables y base SEO

## Contexto y objetivo

CocheMotor necesita que las fichas públicas de vehículos y los perfiles profesionales reales puedan ser rastreados con contenido útil y metadatos propios. El catálogo embebido del frontend es sintético y los anuncios captados por API comienzan pendientes; ninguno de esos datos debe confundirse con oferta activa.

## Historias

- H1: Como comprador, quiero abrir una ficha compartible con información real y clara del vehículo.
- H2: Como profesional, quiero decidir expresamente si mi perfil comercial se muestra públicamente.
- H3: Como buscador, quiero recibir páginas y datos estructurados coherentes con el contenido visible.
- H4: Como responsable del sitio, quiero medir indexación y consultas sin inventar métricas ni publicar páginas vacías.

## Requisitos EARS

- RF-1: CUANDO un usuario solicite una ficha, EL SISTEMA servirá HTML renderizado desde el servidor solo si el vehículo está disponible, publicado, asociado a una cuenta con correo verificado y tiene un contacto de publicación verificado. Para indexarlo, además debe tener al menos una imagen propia normalizada; si no, la ficha sigue accesible pero lleva `noindex`.
- RF-2: SI la ficha no existe o no satisface todos los controles de publicación, EL SISTEMA devolverá 404 y `noindex`; nunca incluirá la URL en el sitemap.
- RF-3: CUANDO un profesional guarde el perfil, EL SISTEMA solo lo hará indexable si activa un consentimiento específico, tiene correo verificado, nombre comercial, descripción pública suficiente y al menos un anuncio elegible con fotografía propia normalizada.
- RF-4: EL SISTEMA no expondrá email, teléfono personal, VIN, datos privados de contacto, credenciales ni información no visible autorizada en las páginas públicas.
- RF-5: CUANDO exista una ficha o perfil público válido, EL SISTEMA incluirá título, descripción, canonical, migas de pan y datos estructurados que correspondan con el HTML visible.
- RF-6: CUANDO se solicite `/sitemap.xml`, EL SISTEMA incluirá solo páginas estáticas públicas seleccionadas y fichas/perfiles elegibles; excluirá demos, páginas privadas, borradores y parámetros de búsqueda.
- RF-7: EL SISTEMA mantendrá la navegación compatible con la web actual; el catálogo local sintético seguirá identificado como demostración y no se convertirá en contenido indexable.
- RF-8: EL SISTEMA ofrecerá una guía editorial original y útil, basada en fuentes oficiales, y documentará una medición que separe Search Console (búsqueda/indexación) de conversiones onsite (no disponibles hasta instrumentación first-party con privacidad revisada).

## Límites y privacidad

- No se publican automáticamente los anuncios recibidos. Se añade una acción de moderación manual protegida por secreto externo y con auditoría; desplegar no habilita ni aprueba anuncios por sí mismo.
- No se indexan vehículos antes de que un flujo autorizado cambie los estados y se confirme el contacto.
- No se muestran teléfonos o correos públicos como consecuencia implícita del consentimiento del perfil.
- No se añaden reseñas, certificaciones, garantía, distintivos DGT o datos de inspección no sustentados.
- No se instalan dependencias ni se envían datos a analítica externa.
- El despliegue a Hostinger requiere ejecución manual posterior; no forma parte de esta iniciativa hasta que se valide localmente.

## Criterios de finalización

- Los controles de elegibilidad y privacidad están implementados y cubiertos por pruebas.
- Rutas públicas entregan contenido inicial indexable server-side para registros elegibles y 404/noindex para otros.
- Sitemap dinámico y canonical apuntan a la misma URL pública.
- El marcado estructurado se limita a datos visibles, sin valoraciones inventadas.
- La guía tiene fuentes oficiales; las métricas y la configuración de Search Console quedan documentadas con límites explícitos.
- Lint PHP, pruebas automatizadas, validación XML, `git diff --check` y revisión de cambios pasan.
