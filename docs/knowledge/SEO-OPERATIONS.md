# SEO operativo — CocheMotor

## Propósito y límites

Search Console mide visibilidad en Google, rastreo e indexación; no mide conversiones dentro de la web. Este proyecto no tiene actualmente un sistema analítico consentido ni un evento de contacto implementado para las fichas SEO. No se instalan etiquetas publicitarias ni analítica de terceros, no se procesa PII para atribución y este documento no representa un informe de resultados.

## Datos estructurados de vehículos

Las fichas expresan un coche en JSON-LD como `Product` + `Car`, con oferta, condición usada, foto y datos visibles. Google indica que `Car` no se trata automáticamente como subtipo de `Product` para snippets de producto. No añadimos valoraciones ni reseñas porque no hay opiniones verificadas en la plataforma. Un resultado enriquecido no garantiza más impresiones, clics ni posición. El programa específico de vehicle listings de Google y su elegibilidad geográfica deben revisarse por separado antes de adoptar feed o onboarding de concesionarios.

Referencias: [guía de snippets de producto](https://developers.google.com/search/docs/appearance/structured-data/product-snippet), [políticas de datos estructurados](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) y [programa Vehicle Listings](https://developers.google.com/vehicle-listings/onboarding-guide).

## Puesta en marcha en Search Console

1. Verificar la propiedad de dominio `cochemotor.es` con un método que Dirección controle. No guardar tokens en Git; si se elige DNS, el titular gestiona el TXT.
2. Enviar `https://cochemotor.es/sitemap.xml` y revisar errores de lectura.
3. En el informe de indexación, segmentar por fichas `/vehiculos/` y perfiles `/profesionales/`; inspeccionar algunas URL válidas y otras que deben devolver 404/noindex.
4. Revisar semanalmente durante las primeras 8 semanas y después mensualmente: páginas descubiertas/indexadas, errores 404/5xx, consultas, impresiones, clics y CTR por tipo de página.
5. Usar Inspección de URL tras publicar contenido real; solicitar indexación no garantiza inclusión ni posición.
6. Comparar cada 28 días y anotar fecha, cambio y página afectada. No atribuir cambios a una intervención aislada sin contemplar temporada, inventario y demanda.

## Indicadores y definición

- Indexación: URL elegibles con estado indexado / total de URL elegibles enviadas.
- Descubrimiento: URL elegibles conocidas por Google; separar las encontradas en sitemap de otras fuentes.
- Rendimiento orgánico: clics, impresiones, CTR y posición media por consulta y tipo de página (ficha, perfil, guía).
- Conversión SEO: **pendiente de medición**. Search Console no ofrece conversiones onsite, y las fichas públicas aún no tienen un CTA de consulta medible. Antes de atribuir leads orgánicos, definir un CTA y una señal first-party agregada; no guardar URL completa, consulta de búsqueda, correo, teléfono, IP ni identificadores de sesión en el evento.
- Señales disponibles sin analítica onsite: usar Search Console para clics orgánicos y comparar tendencias con el recuento agregado de contactos que gestione el sistema, sin afirmar atribución orgánica cuando no exista vínculo consentido y fiable.
- Calidad: fichas despublicadas aún rastreables, perfiles vacíos, datos estructurados inválidos y páginas que devuelven error.

## Diseño de medición propia pendiente de revisión

La tabla heredada `analytics_events` permite `session_id`, `user_id` y un `payload_json` libre. No conectarla a las fichas SEO ni enviar allí eventos hasta sustituir ese contrato por uno minimizado y revisar la finalidad, base jurídica, aviso, retención y controles de acceso. No generar identificadores para atribuir una visita a una persona o a un lead.

La guía de la AEPD para medición de audiencia contempla una posible exención de consentimiento solo bajo condiciones estrictas: medición exclusiva del sitio, datos estadísticos anónimos, sin reutilización, combinación con otros tratamientos ni transmisión a terceros; exige informar y limitar duración/retención. Por eso la exención no se presume por ser analítica propia o no usar una etiqueta publicitaria. Dirección debe aprobar la configuración y el aviso antes de instrumentar.

Si se aprueba medición propia, empezar con vistas y acciones por tipo de página agregadas diariamente, sin URL completa, query string, texto libre, IP, correo, teléfono, identificador de usuario/sesión ni dimensiones de baja frecuencia. Guardar como máximo los agregados y un inventario de cambios; validar anonimización efectiva, acceso, borrado y retención antes de producción. Para atribuir tráfico orgánico, seguir usando Search Console: el evento onsite no debe afirmar una fuente que no se haya obtenido de forma lícita y fiable.

Referencia de cumplimiento: [AEPD, Guía sobre uso de cookies para herramientas de medición de audiencia (enero de 2024)](https://www.aepd.es/guias/guia-cookies-analiticas-externas.pdf). Este criterio técnico no sustituye la validación jurídica del responsable.

## Baseline antes de comparar

Guardar exportación de 28 días de Search Console y recuento del sitemap en la fecha de activación. Registrar aparte la fecha de cada cambio y el inventario elegible. A fecha de implementación no se dispone de acceso ni de datos de Search Console; no hay posiciones, tráfico ni conversiones atribuidas que afirmar. La tabla `analytics_events` existe en el esquema MySQL, pero no está integrada en las páginas SEO ni se debe considerar una fuente de datos activa.

## Dependencias para producción

- Ejecutar `database/migrations/004_public_seo_profiles_mysql.sql`, `005_publication_moderation_mysql.sql` y `006_unique_public_vehicle_slugs_mysql.sql` una sola vez, en orden, en la base de CocheMotor. Antes de 006, comprobar `SELECT public_slug, COUNT(*) FROM vehicles GROUP BY public_slug HAVING COUNT(*) > 1`; si hubiera duplicados, resolverlos conservando redirecciones 301 antes de crear el índice único.
- Desplegar endpoints PHP, reglas `.htaccess`, formulario de perfil, guía y sitemap con `.github/workflows/deploy-seo-hostinger.yml`. El workflow no publica con push; su ejecución SFTP exige confirmar una copia reciente de la base y que 004–006 ya fueron aplicadas, con duplicados de slugs resueltos; después verifica sitemap, robots, canonical del inicio, JSON-LD y guía.
- Verificar consultas y vistas con registros reales controlados antes de solicitar indexación.
- Si se desactiva un perfil o anuncio, confirmar que sale del sitemap y pasa a 404/noindex.
- El sitemap dinámico responde `503` si faltan credenciales o falla MySQL, para que el buscador pueda reintentar; no debe sustituir silenciosamente el inventario real por una lista incompleta de rutas estáticas.
- `publicar.html` es un flujo de conversión, no una landing editorial: queda fuera del sitemap y marcado `noindex,follow`. Las páginas públicas indexables declaran canonical absoluto coherente con las rutas del sitemap.
- Una ficha sin al menos una foto propia subida y normalizada puede seguir accesible en el marketplace, pero lleva `X-Robots-Tag: noindex,follow` y queda fuera del sitemap; no se obliga a completar las diez sugerencias fotográficas.
- La revisión de anuncios es manual. Antes de aprobar, comprobar la identidad del anunciante, la exactitud visible del anuncio y que el contacto aportado le pertenece por un canal independiente. Después llamar `POST /api/moderation/vehicles` con `Authorization: Bearer <secreto>` y JSON `{"vehicle_id":"…","contact_id":"…","decision":"approve","note":"Revisión completada y contacto validado"}`. La aprobación valida únicamente ese `contact_id`. Para retirar, usar `decision=unpublish`. No incluir PII en `note`.
- Habilitar la moderación solo después de ejecutar migración 005 y configurar `COCHEMOTOR_MODERATION_TOKEN` (secreto aleatorio de alta entropía, mínimo 32 caracteres) y `COCHEMOTOR_MODERATION_ACTOR` en la configuración privada del servidor. No enviar el secreto desde páginas HTML ni guardarlo en GitHub.
