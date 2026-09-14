# Clarificación — Spec 009

## Criterios confirmados al iniciar la implementación

- El catálogo preexistente en `site-config.js` se trata como sintético; no se transforma en inventario real ni se indexa.
- Un anuncio enviado por el formulario no se hace público por el mero hecho de existir en MySQL: debe tener `stage=publicado`, `status=disponible`, cuenta verificada y contacto de publicación verificado.
- El perfil profesional tiene consentimiento independiente y revocable; solo nombre comercial, actividad/descrición y anuncios públicos pasan a la página. No se publica correo, teléfono, VIN ni datos privados.
- Se exige descripción pública de al menos 80 caracteres y una ficha elegible con al menos una fotografía propia normalizada; los perfiles y su sitemap aplican la misma condición para evitar páginas vacías o inventario visualmente incompleto.
- Las rutas antiguas con `?id=` mantienen su funcionamiento para demos; solo redirigen con 301 a una ruta canónica cuando el registro cumple las reglas públicas.
- No se incluyen páginas de filtros, borradores ni demos en el sitemap. No se generan reseñas ni claims de verificación.
- La guía editorial se limita a recomendaciones generales y enlaza directamente a fuentes oficiales; Search Console requiere acceso/verificación del titular y no se configura desde código.
- Este paso trabaja en el repositorio local. La migración de producción y el despliegue remoto se separan para ejecutarse después de la validación y autorización correspondiente.

## Dudas críticas pendientes

- Confirmar el estado real de la base de datos MySQL de producción y ejecutar la migración 004 antes de instalar los endpoints nuevos.
- Confirmar en Search Console la propiedad de dominio y obtener un baseline antes de atribuir cambios de tráfico.
- Revisar el recorrido de contacto desde el perfil público: este paso no publica teléfono/email, por lo que el canal de contacto debe definirse explícitamente antes de prometer una consulta directa.
- El endpoint de publicación crea anuncios con `status=pendiente_revision` y `contact_verified=0`. Se añade localmente una transición separada y protegida para revisión manual: exige clave privada del moderador, correo de cuenta verificado y anotación de auditoría; la aprobación representa que el moderador verificó el contacto por un canal independiente. Sin migración 005 y sin secreto/actor en configuración privada, esa ruta permanece deshabilitada. No se relajan los controles SEO.
