# Spec 011 — Preparación de experiencia para la beta profesional

## Contexto y objetivo

Hacer más transparente la experiencia beta de CocheMotor: explicar que el acceso es gratuito mientras dure la beta, conservar la propuesta económica como referencia secundaria y ofrecer una forma simple de compartir comentarios. Reforzar además la legibilidad de la marca en fondos oscuros.

## Usuarios / actores

- Profesional que explora la landing o el espacio profesional durante la beta.
- Visitante de cualquier página pública de CocheMotor.
- Dirección de CocheMotor, que revisa los comentarios recibidos.

## Historias de usuario

- H1: Como profesional, quiero saber con claridad si la beta tiene coste y qué condiciones no están activas.
- H2: Como profesional, quiero consultar los precios previstos solo si deseo conocer esa referencia.
- H3: Como usuario, quiero dejar feedback fácilmente y revisar el mensaje antes de enviarlo.
- H4: Como visitante, quiero reconocer la marca en el footer oscuro.

## Requisitos funcionales (EARS)

- RF-1: MIENTRAS el servicio esté en beta, EL SISTEMA informará que el acceso no tiene coste y que la beta continúa hasta nuevo aviso; no anunciará una fecha final.
- RF-2: CUANDO un visitante consulte la landing profesional, EL SISTEMA mostrará las tarifas solo dentro de una sección plegada titulada como propuesta posterior a la beta; por defecto estará cerrada.
- RF-3: CUANDO el visitante abra la propuesta de planes, EL SISTEMA conservará importes, anualidad y cupos aprobados, indicando que son orientativos, no aplican durante la beta y no suponen contratación.
- RF-4: EL SISTEMA no mostrará la calculadora de ahorro de anuncios en la ruta profesional.
- RF-5: CUANDO una persona envíe el formulario de feedback, EL SISTEMA preparará un borrador `mailto:` con su valoración y comentario; la persona podrá revisarlo y enviarlo en su cliente de correo. EL SISTEMA no guardará ni transmitirá el contenido automáticamente.
- RF-6: EL SISTEMA explicará que al enviar el correo la dirección remitente será visible para CocheMotor y ofrecerá un enlace directo de correo como alternativa sin JavaScript.
- RF-7: CUANDO un usuario visite cualquier footer público del sitio o el pie de navegación del espacio profesional, EL SISTEMA ofrecerá acceso al feedback beta.
- RF-8: CUANDO se muestre el logotipo en el footer de fondo oscuro, EL SISTEMA usará la variante existente con “Coche” blanco y “Motor” rojo.
- RF-9: CUANDO la página se visualice entre 320 y 1440 px o se navegue con teclado, EL SISTEMA mantendrá contenido legible, foco visible, controles usables y sin desbordamiento horizontal.

## No funcionales

- Sin dependencias nuevas, APIs, persistencia, analítica ni envío en segundo plano.
- Español de España claro, accesible y compatible con lectores de pantalla.
- La navegación a comentarios podrá incluir solo un valor de procedencia no sensible y validado.

## Fuera de alcance

- Cambiar importes, límites, duración comprometida de beta o estrategia comercial.
- Crear buzón, CRM, endpoint o base de datos para comentarios.
- Añadir consentimiento de marketing o seguimiento de uso.
- Enviar, publicar o desplegar cambios en servicios externos.

## Criterios de finalización

- Tarifas secundarias y plegadas; aviso de beta gratuito y sin fecha inventada.
- Calculadora de ahorro retirada de la landing y su JavaScript/CSS.
- Formulario de feedback genera un borrador editable, sin transmisión automática ni persistencia.
- Enlaces de feedback disponibles en footers públicos y en el espacio profesional.
- Footer principal usa el logo oscuro aprobado existente.
- Validación requisito por requisito, pruebas automatizadas y revisión responsive local completadas.

## Aprobación

Alcance aprobado por Dirección el 2026-09-14. Cambios locales; cualquier publicación requiere autorización de despliegue independiente.
