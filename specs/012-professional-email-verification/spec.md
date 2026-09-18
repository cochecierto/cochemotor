# Spec 012 — Verificación de correo profesional

## Objetivo

Asegurar que el alta profesional solo queda operativa cuando el correo de verificación se entrega y se confirma. Una vez confirmada, la verificación permanece activa mientras exista la cuenta.

## Requisitos

- **RF-1:** Cuando una persona solicita el alta, el sistema debe generar un token aleatorio, guardar únicamente su hash y el estado `pending`, sin caducidad de la verificación de la cuenta.
- **RF-2:** Si el transporte SMTP no está configurado o falla, el alta no debe presentarse como enviada y debe registrar `send_failed`.
- **RF-3:** Cuando se abre un enlace válido y no utilizado, el sistema debe confirmar la cuenta mediante una actualización atómica y marcar `verified` de forma permanente.
- **RF-4:** Un enlace inválido o ya utilizado no debe confirmar la cuenta; una cuenta ya verificada conserva esa condición sin límite temporal.
- **RF-5:** Una persona con cuenta pendiente debe poder solicitar un nuevo enlace sin revelar si el correo existe; el sistema debe renovar token e intento de envío.
- **RF-6:** La interfaz debe exigir contraseña y confirmación idénticas en el alta y permitir mostrar u ocultar ambos campos.
- **RF-7:** La interfaz debe ofrecer reenvío cuando el inicio de sesión detecte una cuenta no verificada.

## Fuera de alcance

No se envían correos desde este cambio, no se despliega producción y no se almacenan credenciales en el repositorio. La activación del SMTP y la migración remota requieren configuración del entorno.

## Criterios de aceptación

La suite estática debe detectar SMTP configurado por entorno, ausencia de `mail()`, hash/uso único sin condición de caducidad, estados de entrega, reenvío y los controles de contraseña en acceso.html.
