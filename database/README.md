# Persistencia de CocheMotor

El proyecto usa SQLite para desarrollo local y pruebas. Para producción se ha preparado un esquema MySQL/MariaDB compatible con el plan Business de Hostinger.

## Activación recomendada

1. Usar la base nueva `u560645602_cochemotor` y el usuario dedicado `u560645602_cochemotor_app`.
2. Ejecutar desde phpMyAdmin, en orden, `migrations/001_cochemotor_mysql.sql`, `002_search_and_engagement_mysql.sql` y `003_auth_and_publication_mysql.sql`.
3. Guardar las credenciales únicamente como variables de entorno del API:

```text
COCHEMOTOR_DB_BACKEND=mysql
COCHEMOTOR_DB_HOST=srv1746.hstgr.io
COCHEMOTOR_DB_PORT=3306
COCHEMOTOR_DB_NAME=u560645602_cochemotor
COCHEMOTOR_DB_USER=u560645602_cochemotor_app
COCHEMOTOR_DB_PASSWORD=...
```

4. Hacer una copia de la base SQLite antes de migrar datos.
5. Migrar primero en una base de ensayo y verificar recuentos de vehículos, usuarios, solicitudes y contactos.

La aplicación no debe recibir estas credenciales desde el navegador ni incluirlas en GitHub. La activación de runtime requiere configurar estas variables en el entorno que ejecuta `api.cochemotor.es`.

Las migraciones deben ejecutarse en orden. La segunda añade búsquedas guardadas, favoritos, alertas por email y eventos analíticos; la tercera añade autenticación, contactos de publicación e imágenes con límite de aplicación de 10 por anuncio.
