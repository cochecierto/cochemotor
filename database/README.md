# Persistencia de CocheMotor

El proyecto usa SQLite para desarrollo local y pruebas. Para producción se ha preparado un esquema MySQL/MariaDB compatible con el plan Business de Hostinger.

## Activación recomendada

1. Seleccionar una base existente y sin uso en Hostinger.
2. Crear un usuario con permisos sobre esa base, sin permisos globales.
3. Ejecutar `migrations/001_cochemotor_mysql.sql` desde phpMyAdmin.
4. Guardar las credenciales únicamente como variables de entorno del API:

```text
COCHEMOTOR_DB_BACKEND=mysql
COCHEMOTOR_DB_HOST=srv1746.hstgr.io
COCHEMOTOR_DB_PORT=3306
COCHEMOTOR_DB_NAME=...
COCHEMOTOR_DB_USER=...
COCHEMOTOR_DB_PASSWORD=...
```

5. Hacer una copia de la base SQLite antes de migrar datos.
6. Migrar primero en una base de ensayo y verificar recuentos de vehículos, usuarios, solicitudes y contactos.

La aplicación no debe recibir estas credenciales desde el navegador ni incluirlas en GitHub. La migración de runtime se activará después de confirmar la base concreta y el entorno que ejecuta `api.cochemotor.es`.

Las migraciones deben ejecutarse en orden: primero `migrations/001_cochemotor_mysql.sql` y después `migrations/002_search_and_engagement_mysql.sql`. La segunda añade búsquedas guardadas, favoritos, alertas por email y eventos analíticos sin almacenar el historial de navegación completo.
