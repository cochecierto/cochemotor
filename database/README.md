# Persistencia de CocheMotor

El proyecto usa SQLite para desarrollo local y pruebas. Para producción se ha preparado un esquema MySQL/MariaDB compatible con el plan Business de Hostinger.

## Activación recomendada

1. Usar la base nueva `u560645602_cochemotor` y el usuario dedicado `u560645602_cochemotor_app`.
2. Para una base vacía, ejecutar desde phpMyAdmin las migraciones `001`–`007` en orden. Para la base existente `u560645602_cochemotor`, **no volver a ejecutar 001–003 ni migraciones ya aplicadas**: inspeccionar estructura y ejecutar únicamente las pendientes.
3. Guardar las credenciales únicamente como variables de entorno del API:

```text
COCHEMOTOR_DB_BACKEND=mysql
COCHEMOTOR_DB_HOST=srv1746.hstgr.io
COCHEMOTOR_DB_PORT=3306
COCHEMOTOR_DB_NAME=u560645602_cochemotor
COCHEMOTOR_DB_USER=u560645602_cochemotor_app
COCHEMOTOR_DB_PASSWORD=...
COCHEMOTOR_MODERATION_TOKEN=... (secreto aleatorio de al menos 32 caracteres)
COCHEMOTOR_MODERATION_ACTOR=... (identificador interno del moderador)
```

4. Hacer una copia de la base SQLite antes de migrar datos.
5. Migrar primero en una base de ensayo y verificar recuentos de vehículos, usuarios, solicitudes y contactos.

La aplicación no debe recibir estas credenciales desde el navegador ni incluirlas en GitHub. La activación de runtime requiere configurar estas variables en el entorno que ejecuta `api.cochemotor.es`.

Las migraciones deben ejecutarse una por una y comprobar su resultado antes de continuar. MySQL/MariaDB puede confirmar DDL con commit implícito; no contar con que un `ROLLBACK` revierta una migración fallida. La segunda añade búsquedas guardadas, favoritos, alertas por email y eventos analíticos; la tercera añade autenticación, contactos de publicación e imágenes con límite de aplicación de 10 por anuncio.

La cuarta añade campos del perfil comercial público. Los perfiles existentes quedan privados por defecto (`public_profile=0`); cada profesional debe activar el permiso desde su perfil y disponer de una descripción suficiente. Ejecutar esta migración antes de desplegar los endpoints SEO.

La quinta añade fecha de verificación del contacto y auditoría de decisiones de moderación. No activa anuncios existentes. La ruta `/api/moderation/vehicles` exige un secreto de al menos 32 caracteres y un identificador de moderador configurados fuera del repositorio como `COCHEMOTOR_MODERATION_TOKEN` y `COCHEMOTOR_MODERATION_ACTOR`. Si faltan, el endpoint queda deshabilitado. La acción `approve` implica que el moderador ya comprobó por un canal independiente que los datos de contacto pertenecen al anunciante; `unpublish` retira la ficha. Las notas de auditoría no deben incluir datos personales.

La sexta añade unicidad a `vehicles.public_slug`, necesaria para que cada ficha tenga un canonical inequívoco. Antes de ejecutarla, hacer una copia de seguridad reciente y comprobar duplicados con una consulta independiente de solo lectura:

```sql
SELECT public_slug, COUNT(*) AS total
FROM u560645602_cochemotor.vehicles
WHERE public_slug IS NOT NULL AND public_slug <> ''
GROUP BY public_slug
HAVING COUNT(*) > 1;
```

Si devuelve filas, no ejecutar la 006 todavía: resolver cada colisión y conservar una redirección 301 por slug antiguo que ya haya sido público. Si no devuelve filas, aplicar 006 una sola vez y verificar que aparece el índice único `uq_vehicles_public_slug`. No usar `IF NOT EXISTS` para ocultar una aplicación parcial; comparar primero la estructura real.

La séptima añade versión/fecha de lectura de avisos al alta, trazabilidad de la solicitud de contacto, un índice para limitar reenvíos repetidos y cambia el valor predeterminado de evidencia mecánica a `declarado`. No cambia los registros históricos. Antes de desplegar la nueva API, verificar por separado las columnas e índice; el formulario público de contacto requiere la 007.

## Catálogo europeo

El snapshot que consume el formulario se genera desde un fichero estructurado EEA filtrado a país `ES` y categoría `M1`. No se editan a mano sus 210 marcas ni sus versiones. Para regenerarlo:

```text
python scripts/import_vehicle_catalog.py data.csv tmp/vehicles_catalog_eea.js \
  --country ES --source-label "EEA CO2 cars and vans" \
  --source-url https://co2cars.apps.eea.europa.eu/ \
  --source-data-as-of AAAA-MM-DD --license "Revisar metadatos del paquete EEA"
```

Antes de reemplazar `assets/data/vehicles_catalog.js`, revisar el manifiesto de procedencia, el número de marcas/modelos/entradas, duplicados de combustible y la licencia del paquete. El estado `declared-not-verified` impide presentar la fuente como verificada hasta completar esa revisión. La migración `008_vehicle_catalog_mysql.sql` crea el almacenamiento canónico para futuras importaciones; no debe ejecutarse en producción sin copia de seguridad y comprobación de migraciones pendientes.

## Preflight de las migraciones SEO en la base existente

1. Crear/confirmar una copia de seguridad de `u560645602_cochemotor` en Hostinger antes de DDL y no guardar exportaciones con datos reales en el repositorio.
2. En phpMyAdmin, comprobar en `dealerships` que aún no existen `public_description`, `public_profile`, `public_profile_consent_version` ni `public_profile_consent_at`; 004 no es idempotente.
3. Comprobar en `publication_contacts` que aún no existe `contact_verified_at` y que `vehicle_moderation_history` no existe; luego 005 añade el campo y crea la tabla de auditoría.
4. Ejecutar la consulta de slugs anterior. Resolver todos los duplicados antes de 006 y documentar las redirecciones sin incluir datos personales.
5. Ejecutar cada archivo pendiente individualmente (004, luego 005, luego 006); después confirmar columnas, tabla e índice en la vista Estructura. Si algo ya existe o la ejecución devuelve error, detenerse y reconciliar el estado; no repetir el `ALTER TABLE` a ciegas.
6. Solo tras el preflight satisfactorio y las migraciones verificadas, habilitar el workflow SFTP manual. La casilla del workflow es una declaración del operador, no una comprobación automática de la base.
