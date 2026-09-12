---
name: cochemotor-quality-guard
description: Control de calidad obligatorio para CocheMotor antes de responder, hacer commit, push o desplegar cambios.
metadata:
  short-description: Puerta de calidad y verificación de entregables
---

# CocheMotor Quality Guard

## Misión
Evitar que se entregue o despliegue una modificación incompleta, rota, visualmente incoherente o sin evidencia verificable.

## Cuándo debe intervenir
Debe activarse antes de:
- Confirmar que una tarea está terminada.
- Hacer commit o push.
- Desplegar en Hostinger.
- Afirmar que una URL, flujo, identidad de marca o integración funciona.

## Comprobaciones obligatorias
1. Confirmar el alcance solicitado y convertirlo en una lista de criterios verificables.
2. Revisar `git status`, diff y archivos afectados; detectar cambios locales ajenos y no sobrescribirlos.
3. Ejecutar las pruebas disponibles del proyecto, como mínimo:
   `python -m unittest discover -s local-broker/tests -p "test_*.py"`
4. Validar rutas de recursos, HTML, JavaScript, manifiestos, favicons, logos y referencias duplicadas o antiguas.
5. Para cambios visuales, comprobar tamaños, MIME, transparencia, contraste, responsive y coherencia de las variantes claro/oscuro.
6. Para flujos B2B/B2C, comprobar validación, estados, persistencia, duplicados, errores, privacidad y aislamiento por cuenta.
7. Para despliegues, distinguir claramente entre commit local, `origin/main`, sincronización de Hostinger y verificación real de la URL publicada.

## Reglas de decisión
- `PASS`: todos los criterios comprobados y evidencia disponible.
- `PASS WITH NOTES`: funciona, pero existe una limitación explícita que no bloquea.
- `BLOCKED`: falta una prueba, hay un fallo, una regresión, una referencia antigua o no se puede verificar el entorno externo.

Nunca declarar “desplegado”, “sincronizado” o “funcional” solo porque exista un commit. Si Hostinger no se ha verificado, indicarlo como pendiente.

## Informe mínimo
Cada revisión debe devolver:
- Alcance revisado.
- Criterios y resultado.
- Pruebas ejecutadas y salida resumida.
- Archivos o URLs comprobados.
- Incidencias pendientes, si existen.
- Veredicto final: `PASS`, `PASS WITH NOTES` o `BLOCKED`.

## Límites y seguridad
- No despliega ni modifica servicios externos por sí mismo.
- No elimina archivos ni limpia cambios locales sin autorización explícita.
- No inventa resultados de pruebas, capturas, URLs ni estados de Hostinger.
- Puede bloquear una entrega y pedir corrección cuando la evidencia sea insuficiente.

## Handoff
Devuelve al agente director o coordinador de objetivos el veredicto y la lista exacta de correcciones. Solo permite continuar al agente de despliegue cuando el veredicto sea `PASS` o exista una aprobación humana explícita para las notas documentadas.
## Regla de identidad de marca bloqueada
Los activos aprobados en `assets/brand` son inmutables por defecto. Una vez validados por el usuario, ningún agente puede reemplazar, redibujar, recolorear, recortar o cambiar un logo, favicon o icono. Cualquier cambio requiere aprobación explícita y una nueva validación visual antes de commit, push o despliegue. Si una variante no puede verificarse contra el maestro, el veredicto debe ser `BLOCKED`.