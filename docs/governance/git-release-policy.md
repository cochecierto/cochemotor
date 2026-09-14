# Política de Git y releases

Estado: referencia operativa del repositorio CocheMotor; despliegues requieren autorización explícita de Dirección.

## Repositorio

- Repositorio canónico: `https://github.com/cochecierto/cochemotor.git`.
- `main`: cambios aprobados y candidatos a producción.
- Ramas de trabajo: cambios aislados y revisables.
- No se deben incluir credenciales, tokens, dumps de bases de datos ni datos personales.

## Flujo recomendado

1. Confirmar el árbol de trabajo y la rama antes de editar.
2. Actualizar documentación o código con alcance limitado.
3. Ejecutar validaciones automáticas y revisión de seguridad.
4. Revisar los cambios locales antes de publicar.
5. Hacer push/despliegue solo con autorización explícita; registrar commit, entorno, resultado y URL verificada.

## Releases

Producción: Hostinger, dominio `cochemotor.es`, raíz publicada `public_html`; verificar en hPanel el estado de auto-deploy de `main` en cada publicación. Un push a GitHub no demuestra por sí solo que Hostinger haya completado el despliegue. Cada release deberá indicar alcance, commit, entorno, validaciones, aprobador, riesgos conocidos y procedimiento de rollback. No se considera ensayado el rollback hasta registrar una prueba.
