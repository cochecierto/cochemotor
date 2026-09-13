# Spec 008 — Demo interactiva del espacio profesional

## Contexto y objetivo

La landing profesional explica las capacidades de CocheMotor, pero actualmente solo ofrece una vista ilustrativa estática. Esta iniciativa añade una ruta pública de demostración para que un profesional pueda explorar y probar interacciones de la herramienta con datos sintéticos antes de decidir si crea una cuenta beta gratuita.

## Usuarios / actores

- Profesional de compraventa, taller o concesionario que evalúa CocheMotor.
- Dirección de CocheMotor, responsable de la propuesta beta y de las capacidades mostradas.

## Historias de usuario

- H1: Como profesional quiero recorrer el panel y entender cómo se organiza mi trabajo sin registrarme primero.
- H2: Como visitante quiero probar filtros, cambios de estado y herramientas de ejemplo sin que se publiquen datos ni se contacte a terceros.
- H3: Como profesional interesado quiero pasar claramente desde la demo a crear una cuenta beta gratuita, sabiendo que no estoy contratando un plan.

## Requisitos funcionales (EARS)

- RF-1: CUANDO un visitante abra la ruta pública de demostración, EL SISTEMA mostrará un espacio profesional separado del panel autenticado y avisará de forma persistente que se trata de una demo con datos sintéticos.
- RF-2: CUANDO el visitante navegue por resumen, inventario, contactos y herramientas, EL SISTEMA permitirá cambiar de sección sin iniciar sesión ni cargar datos de una cuenta.
- RF-3: CUANDO el visitante filtre el inventario o modifique el estado de un contacto de ejemplo, EL SISTEMA actualizará únicamente la vista en memoria y sin persistencia.
- RF-4: CUANDO el visitante pruebe el formulario de anuncio, generador de texto o calculadora, EL SISTEMA producirá una previsualización local y no publicará, copiará ni enviará contenido.
- RF-5: EL SISTEMA no hará llamadas de red desde la demo, salvo cargar recursos estáticos del propio sitio; no invocará API, almacenamiento del navegador, WhatsApp, portales, correo, impresión ni ventanas externas.
- RF-6: CUANDO el visitante elija crear una cuenta beta, EL SISTEMA ofrecerá un CTA visible que enlazará al registro profesional existente, indicando que la beta es gratuita y no activa un plan de pago.
- RF-7: CUANDO el visitante use teclado o móvil, EL SISTEMA mantendrá controles semánticos, foco visible, navegación responsive y estado accesible para tecnologías de asistencia.
- RF-8: EL SISTEMA identificará de forma explícita las fichas, contactos, métricas y resultados generados como ejemplos sintéticos; no usará datos reales de clientes.

## Requisitos de publicación

- RF-9: CUANDO se solicite una publicación manual y las validaciones sean correctas, EL SISTEMA transferirá por SFTP únicamente la demo y sus enlaces de entrada, verificará la ruta pública y no eliminará otros archivos del alojamiento.

## Requisitos no funcionales

- HTML, CSS y JavaScript nativos; sin dependencias nuevas.
- Aislamiento de la demo respecto a `hub.html` y sus handlers autenticados.
- Sin analítica nueva, cookies, almacenamiento local ni envío de información.
- Carga ligera y soporte de `prefers-reduced-motion`.
- Secretos SFTP y clave de host fijada fuera del repositorio; producción no se ejecuta automáticamente con cada push.

## Casos límite

- Enlace directo a la demo sin sesión iniciada.
- El visitante cambia varias veces de sección o recarga después de simular una edición: los ejemplos vuelven a sus valores iniciales.
- El visitante pulsa un CTA de registro: la única salida del entorno de prueba es la ruta de acceso/registro profesional ya existente.
- JavaScript desactivado: la página explica el propósito y conserva un enlace funcional para el alta beta.

## Fuera de alcance

- Conectar la demo al API, base de datos, cuenta real o inventario real.
- Guardar preferencias o cambios de demo entre sesiones.
- Publicar anuncios, contactar compradores, compartir datos, generar QR, imprimir o lanzar integraciones.
- Crear una cuenta automáticamente o iniciar cobros/planes.
- Configurar base de datos, API u otras partes de la infraestructura.

## Criterios de finalización

- Existe una URL directa y descubrible desde la landing profesional.
- Las cuatro áreas principales y las simulaciones son utilizables con datos inventados.
- Una prueba estática confirma que la ruta no contiene llamadas API, persistencia local ni enlaces de acción a proveedores externos.
- Los CTAs conducen al registro beta profesional existente.
- Navegación por teclado, móvil y consola sin errores bloqueantes comprobadas.
- Validación requisito por requisito y documentación actualizadas.

## Clarificación

- La demo es una experiencia frontend aislada, no un modo alternativo del panel de producción.
- Todos los cambios de ejemplo viven solo en memoria; recargar restablece el estado.
- El alta beta es una salida voluntaria y directa al flujo existente; no se envían datos desde la demo.
- Dirección confirmó la vía SFTP. La publicación será manual, limitada a cinco archivos y dependerá de credenciales protegidas en GitHub Actions.
- La creación de credenciales de despliegue dedicadas queda sujeta a confirmación explícita del propietario.
