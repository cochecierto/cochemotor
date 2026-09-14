# Validación — Spec 010 Acciones de ficha pública

| Requisito | Estado | Evidencia |
|---|---|---|
| RF-1 | Renderizado comprobado; acción nativa pendiente | `navigator.share()` recibe título, resumen y URL; los controles aparecen en la ficha de demo cargada localmente en Edge. |
| RF-2 | Implementado; acción pendiente | Respaldo Clipboard API y `execCommand('copy')`, con estado `aria-live`; prueba unitaria estática pasa. |
| RF-3 | Estilos comprobados; diálogo del sistema pendiente | Modo de impresión emulado: se ocultan cabecera, acciones, formulario y barra fija; la URL pública aparece. El usuario elige guardar como PDF en el diálogo del navegador. |
| RF-4 | Conservado | WhatsApp abre con referencia en el texto editable; el usuario revisa y envía desde WhatsApp. |
| RF-5 | Conservado | Se mantienen llamada y formulario de solicitud existentes como rutas separadas. |
| RF-6 | Verificado | Edge local a 320, 390, 768, 1024 y 1440 px, además de los cortes 430/431, 600/601, 800/801, 960/961 y 994/995: `documentElement.scrollWidth === clientWidth` y sin solape entre acciones fijas. |
| RF-7 | Verificado en código | No hay envío automático ni publicación social; compartir usa el selector del sistema. |
| RF-8 | Verificado en emulación | El modo print oculta la cabecera, formulario de contacto, controles y barra fija; deja título, datos públicos, imágenes disponibles y URL de la ficha. |

## Resultado

`python -m unittest tests.test_public_vehicle_sheet_actions`: 5 pruebas OK.
`python -m unittest discover -s tests -p "test_*.py"`: 52 pruebas OK.
`python -m unittest discover -s local-broker/tests -p "test_*.py"`: 18 pruebas OK.
`node --check` sobre el script inline de `ficha.html`: OK. `git diff --check`: OK.

La inspección visual y del árbol accesible en Edge local confirmó que las tres opciones aparecen también en la ficha de demo. Una miniatura con URL fallida se retira al producirse el error para evitar el icono de imagen rota. La emulación de impresión verificó el contenido y los controles visibles; no se abrió el diálogo del sistema ni se ejecutó el selector nativo de compartir.
