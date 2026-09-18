# Plan técnico

Se mantiene PHP nativo y MySQL. El transporte usa SMTP autenticado mediante sockets TLS/SSL configurables (`COCHEMOTOR_MAIL_*`). La tabla existente conserva compatibilidad, hace nullable el campo antiguo y añade hash, uso, estado e intentos; la cuenta verificada no depende de una fecha de caducidad. La verificación compara el hash y ejecuta un `UPDATE` condicionado por estado y uso para impedir reutilización. El reenvío se expone como acción `resend_verification` con respuesta genérica.

La prueba será estática y de sintaxis PHP/JS; no se probará entrega real sin secretos SMTP y base remota.
