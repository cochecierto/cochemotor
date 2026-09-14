# Spec 010 — Acciones de ficha pública de vehículo

## Contexto y objetivo

La ficha pública debe permitir que una persona consulte un vehículo desde móvil u ordenador, comparta su enlace por el canal que prefiera, conserve una versión imprimible y contacte con el anunciante sin que CocheMotor envíe mensajes en su nombre.

## Actores

- Comprador de vehículo de ocasión que visita una ficha pública.
- Anunciante profesional responsable del vehículo.

## Historias

- H1: Como comprador, quiero compartir la ficha con otra persona usando las aplicaciones disponibles en mi dispositivo.
- H2: Como comprador, quiero conservar una ficha legible mediante la función de impresión/guardado PDF del navegador.
- H3: Como comprador, quiero escribir al anunciante por WhatsApp con los datos del vehículo ya preparados y revisar el texto antes de enviarlo.
- H4: Como usuario móvil o de escritorio, quiero que las acciones sean fáciles de encontrar y utilizar sin desplazamiento horizontal.

## Requisitos funcionales (EARS)

- RF-1: CUANDO el comprador active «Compartir ficha», EL SISTEMA ofrecerá el título, el resumen y la URL pública de la ficha al mecanismo de compartir del dispositivo cuando esté disponible.
- RF-2: SI el navegador no ofrece compartir nativo o lo rechaza por falta de compatibilidad, EL SISTEMA permitirá copiar la URL y mostrará un estado accesible de éxito o error.
- RF-3: CUANDO el comprador active «Guardar / imprimir ficha», EL SISTEMA preparará una versión imprimible con la información pública visible del vehículo y la URL de la ficha; el usuario decidirá desde el navegador si imprime o guarda como PDF.
- RF-4: CUANDO el comprador active WhatsApp, EL SISTEMA abrirá una conversación con el anunciante y un mensaje pre-rellenado que identifica el vehículo; el usuario podrá revisar, modificar y enviar el mensaje desde WhatsApp.
- RF-5: EL SISTEMA mantendrá las opciones existentes de llamada y solicitud de contacto como rutas separadas de la mensajería directa.
- RF-6: CUANDO se muestre la ficha en viewport de 320 px o superior, EL SISTEMA adaptará la galería, las acciones, la barra fija y los formularios al ancho disponible, sin scroll horizontal ni controles solapados.
- RF-7: EL SISTEMA no enviará mensajes automáticamente, no publicará en redes sociales en nombre del usuario y no añadirá destinatarios de contacto sin intervención explícita.
- RF-8: EL SISTEMA excluirá de la versión imprimible datos privados o internos que no estén presentes en la ficha pública.

## Límites y fuera de alcance

- No se integran APIs de publicación de Facebook, Instagram, X, LinkedIn u otras redes.
- No se incorporan librerías nuevas ni servicios externos para generar PDFs o códigos QR.
- El guardado PDF utiliza la opción del navegador «Guardar como PDF» desde el diálogo de impresión; no promete una descarga automática en todos los dispositivos.
- No se cambia el esquema de datos de leads ni se añade captura de datos personales.
- Las fichas de demostración mantienen su estado y reglas SEO actuales. Las fichas reales conservan las rutas públicas y elegibilidad de Spec 009.

## Criterios de finalización

- Los controles se entienden en móvil y escritorio, tienen nombres accesibles y estados de resultado perceptibles.
- Compartir nativo funciona cuando el navegador lo permite y el respaldo de copiar enlace funciona cuando no.
- La vista imprimible excluye navegación, controles de contacto y barras fijas.
- El enlace de WhatsApp contiene la referencia del vehículo y no envía nada hasta que el usuario confirme dentro de WhatsApp.
- Las comprobaciones responsive no encuentran scroll horizontal a 320, 390, 768, 1024 y 1440 px.
