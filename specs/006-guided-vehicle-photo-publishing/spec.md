# Spec 006 — Publicación guiada de fotografías del vehículo

Estado: aprobada para implementación por confirmación explícita del propietario el 2026-09-13.
Producto: CocheMotor España.

## Contexto y objetivo

La pantalla de publicación permite seleccionar hasta diez imágenes, pero no ayuda a decidir qué fotografiar y no conserva los archivos del borrador al cambiar de página. La iniciativa convierte la sección en una guía visual sencilla, conserva el borrador mientras se completa el acceso y registra imágenes reales asociadas al vehículo sin confundirlas con las ilustraciones de ayuda.

## Usuarios / actores

- Particular que prepara la publicación de su coche.
- Profesional que prepara un vehículo para su inventario.
- Servicio de acceso y API de CocheMotor.

## Historias de usuario

- H1: Como vendedor, quiero ver ejemplos de cada toma para preparar un anuncio claro sin tener que adivinar qué fotos hacen falta.
- H2: Como vendedor, quiero añadir, sustituir o quitar cada foto y conservar el borrador al completar el acceso.
- H3: Como vendedor, quiero saber cuántas fotos llevo y qué paso me falta antes de continuar.

## Requisitos funcionales (criterios de aceptación EARS)

- RF-1: CUANDO se abra la sección de imágenes, EL SISTEMA mostrará diez tarjetas de guía con imágenes de referencia y estas etiquetas, en este orden: 3/4 frontal derecho (principal), trasera, lateral izquierdo, lateral derecho, interior delantero, interior trasero, cuadro y kilómetros, motor, maletero y neumáticos.
- RF-2: CUANDO el usuario abra la tarjeta de neumáticos, EL SISTEMA permitirá usarla para una foto libre de un desperfecto u otro detalle, sin obligar a fotografiar neumáticos.
- RF-3: CUANDO se añada, sustituya o quite una foto, EL SISTEMA actualizará su miniatura, el estado de la tarjeta, el contador y el límite disponible; cada tarjeta aceptará como máximo una imagen y el anuncio nunca aceptará más de diez.
- RF-4: CUANDO se seleccione una foto, EL SISTEMA validará formato y tamaño antes de continuar, y mostrará un error comprensible y recuperable si la foto no es válida.
- RF-5: MIENTRAS exista un borrador de publicación, EL SISTEMA conservará los campos y fotos al navegar al acceso y volver a la publicación en el mismo navegador.
- RF-6: CUANDO el usuario continúe con una cuenta verificada, EL SISTEMA cargará las fotos como archivos reales, conservará su orden y tipo de toma y las asociará al vehículo en la base de datos.
- RF-7: SI falta el acceso verificado o la carga falla, ENTONCES EL SISTEMA conservará el borrador local, explicará el siguiente paso y permitirá reintentar sin duplicar fotos ni anuncios.
- RF-8: EL SISTEMA distinguirá visual y semánticamente las imágenes de referencia de las fotos aportadas por el vendedor; nunca las registrará como fotos del vehículo.
- RF-9: EL SISTEMA permitirá completar la selección desde dispositivos móviles, teclado y lector de pantalla, anunciando por tecnología de asistencia cambios del contador y errores.
- RF-10: CUANDO se muestre la cabecera de publicación o acceso sobre una superficie blanca, EL SISTEMA utilizará la variante del logotipo con contraste para fondo claro.
- RF-11: CUANDO se visite la página de publicación, EL SISTEMA organizará el contenido en bloques reconocibles de datos del coche, fotos y contacto; en escritorio aprovechará el ancho disponible y en móvil desde 320 px no producirá desplazamiento horizontal, manteniendo una acción principal accesible y textos fáciles de escanear.

## Requisitos no funcionales

- Español claro, controles táctiles cómodos y diseño responsive.
- La jerarquía visual debe mantener marca, propósito, tarea actual, ayuda y acción primaria diferenciados; las ayudas secundarias no deben competir con el formulario.
- El total de archivos adjuntos no superará 10 por anuncio; máximo recomendado de 8 MiB por archivo, sujeto a límites efectivos del alojamiento.
- Solo se aceptarán JPEG, PNG y WebP validados por contenido, no solo por extensión o MIME declarado.
- Los nombres de almacenamiento serán aleatorios; no se conservarán nombres originales ni metadatos EXIF innecesarios.
- Los archivos no podrán ejecutarse como código y la API no devolverá rutas del sistema.
- El borrador persistirá solo en el almacenamiento local del navegador hasta la carga autenticada; no se guardarán fotos como base64 en localStorage.

## Casos límite

- Cero fotos: se puede continuar mostrando que las fotos son recomendadas, salvo que la regla de publicación existente exija lo contrario.
- Diez fotos asignadas: las tarjetas restantes no permitirán superar el límite; sustituir una foto no incrementará el contador.
- Archivo corrupto, formato no permitido, archivo mayor de 8 MiB, límite PHP superado, sesión caducada o error de red: mostrar recuperación y conservar las fotos disponibles localmente.
- Navegador sin IndexedDB o almacenamiento denegado: avisar que las fotos no podrán conservarse al salir y mantener el formulario actual usable.
- Ilustración de referencia ausente: mostrar un fallback con etiqueta y texto; no bloquear selección.
- Si la extensión PHP requerida para validar imágenes no está habilitada: rechazar la carga de forma segura y mostrar error de servicio, no aceptar el archivo sin validar.

## Fuera de alcance

- Generar, editar o retocar fotografías del vehículo.
- Hacer obligatorias las diez tomas sugeridas.
- Publicar automáticamente un vehículo como anuncio visible sin revisión o validación de contacto.
- Cambiar precios, estrategia comercial, proveedor de correo o políticas de identidad.
- Desplegar a GitHub/Hostinger en esta iniciativa sin autorización específica de release.

## Criterios de finalización

- Diez tarjetas con referencias suministradas, miniaturas reales, añadir/reemplazar/quitar y variante libre en la tarjeta 10.
- Borrador y fotos recuperables tras el paso de acceso en un navegador compatible.
- Carga autenticada con validación en servidor y vínculo de imágenes al vehículo, respetando orden y máximo 10.
- Evidencia automatizada para límites, formatos y persistencia, lint PHP/JS y revisión responsive/accesible.
- Validación de cada RF registrada en `validation.md`.

## Dudas abiertas

- Sin bloqueos funcionales. El límite de 8 MiB por foto es una decisión operativa conservadora; se informará si el alojamiento impone un límite inferior.
