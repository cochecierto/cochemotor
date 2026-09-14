# Validación — Spec 009

| Requisito | Evidencia local | Estado |
|---|---|---|
| RF-1 | `seo-public.php` exige estado `disponible` + `publicado`, cuenta verificada y contacto verificado; solo indexa si hay una imagen subida/normalizada | Cumple en código; PDO/MySQL de producción aún por probar |
| RF-2 | `cmNotFound()` responde 404/noindex; páginas sin foto siguen accesibles con `X-Robots-Tag: noindex`; sitemap no las incluye | Cumple estático; Apache/DB todavía sin prueba extremo a extremo |
| RF-3 | `perfil.html` solicita consentimiento explícito; migración 004 deja `public_profile=0`; API exige cuenta verificada, nombre, descripción y consentimiento; perfil y sitemap requieren al menos un coche con foto propia normalizada | Cumple en código; esquema 004 aplicado en Hostinger |
| RF-4 | Consultas server-side seleccionan columnas públicas; el JSON de `/api/public/vehicles` no contiene email, teléfono, credenciales o tokens | Cumple en pruebas estáticas |
| RF-5 | Páginas server-rendered crean canonical, title/description únicos, OG/Twitter y JSON-LD `Product` + `Car`, `Organization` y `BreadcrumbList`; la migración 006 impone slug único y la API heredada valida su sintaxis | Cumple en código; esquema 006 aplicado; inspección Rich Results de URL pública pendiente |
| RF-6 | `sitemap-public.php` incluye rutas estáticas canónicas y filtra vehículos/perfiles con criterios públicos; excluye la pantalla `publicar.html` y responde 503 si no puede verificar el inventario dinámico | Cumple en código; respuesta MySQL/Apache pendiente |
| RF-7 | `ficha.html`, `dealer.html` y `perfil.html` tienen noindex; redirecciones antiguas solo ocurren si la ficha/perfil es elegible | Cumple en código y test estático |
| RF-8 | La guía editorial enlaza fuentes DGT y dirige a marketplace/búsqueda Coche Ideal; `SEO-OPERATIONS.md` separa métricas GSC de conversiones onsite y deja claras las dependencias de privacidad | Cumple contenido local; Search Console y medición onsite pendientes |
| Seguridad de publicación | `POST /api/moderation/vehicles` requiere secreto y actor privados, comprueba cuenta/contacto, limita decisiones y registra historial en tabla de migración 005 | Código y esquema 005 presentes; conexión PDO y secretos privados no comprobados |

## Validaciones ejecutadas

- `python -m unittest discover -s tests -p 'test_*.py' -v`: 46 tests aprobados.
- `php -l api/index.php`, `seo-public.php`, `seo-legacy-redirect.php`, `sitemap-public.php`: sin errores de sintaxis.
- `node` compiló los bloques JavaScript inline de `marketplace.html` correctamente.
- `sitemap.xml` pasó el parser XML estándar.
- `git diff --check`: sin errores; quedan advertencias Git normales de conversión LF/CRLF.
- `.github/workflows/deploy-seo-hostinger.yml` valida localmente el alcance SFTP y exige confirmación de las migraciones en la ejecución manual; no se ha ejecutado contra producción.
- Canonicals absolutos añadidos a las páginas estáticas de entrada incluidas en el sitemap; `/publicar.html` queda fuera del sitemap y marcado `noindex,follow`.
- Las páginas de acceso y panel (`acceso.html`, `hub.html`, `asesor.html`, `asesor-leads.html`) permiten el rastreo necesario para leer `noindex,follow`; permanecen fuera del sitemap. `/api/` continúa bloqueado en `robots.txt`.
- La acción de moderación exige revisión humana: el código no puede acreditar por sí mismo titularidad del teléfono/correo, por eso la aprobación queda bajo control del moderador.

## Estado de producción

- Antes de los cambios de esquema se creó desde hPanel un backup manual de archivos y base de datos (2026-09-14, 08:15).
- Se aplicaron las migraciones 004, 005 y 006 en la base `u560645602_cochemotor`. phpMyAdmin confirmó las columnas de perfil/consentimiento, `contact_verified_at`, la tabla `vehicle_moderation_history` y el índice único `uq_vehicles_public_slug` sobre `vehicles.public_slug`.
- La inspección previa encontró cero slugs públicos duplicados; `vehicles` estaba vacía en ese momento.
- No se probó el PDO contra la base real ni se ejecutó una validación extremo a extremo con Apache.
- Comprobación de solo lectura del dominio el 2026-09-13: `https://cochemotor.es/sitemap.xml` y `/robots.txt` muestran la página de error de Hostinger en lugar de XML/robots; `/ficha.html?id=cm-002` todavía sirve el anuncio sintético de Toyota Yaris. El SEO preparado localmente no está desplegado y no se puede confirmar que esa ficha de producción tenga `noindex` sin inspeccionar su `<head>`.
- El administrador de archivos lista `.git`, `.github`, `database`, `docs`, `tests`, `sync_web.py` y `iniciar_cochemotor.bat` dentro de `public_html`. La regla local `.htaccess` ya deniega carpetas internas y ahora bloquea también extensiones de desarrollo/documentación (`.py`, `.bat`, `.sh`, `.md`, `.log`); falta publicar y verificar la respuesta HTTP de esos recursos.
- El entorno local no contiene la configuración privada `cochemotor-private/config.php` ni tiene el driver PHP `pdo_mysql`; por eso las pruebas de rutas con MySQL real requieren el servidor, no pueden simularse aquí con seguridad.
- `seo-public.php`, `sitemap-public.php` y la ruta antigua dependen de la configuración privada de CocheMotor y de la migración aplicada.
- No hubo push ni despliegue SFTP; el código SEO sigue pendiente de publicar y verificar en web pública. No afirmar que Google ya rastrea o indexa estas URL.
- Falta acceso/verificación de Search Console, baseline, prueba de Rich Results en páginas reales y definición del CTA de contacto sin exponer datos personales.
- La ruta de moderación existe en el código local: clave privada de al menos 32 caracteres comparada en tiempo constante, actor configurado, decisiones limitadas a aprobar/retirar, cuenta verificada, contacto requerido y auditoría relacional. La tabla 005 está creada; faltan secretos privados en el hosting. La verificación efectiva del contacto es responsabilidad del moderador y no se simula desde código.
