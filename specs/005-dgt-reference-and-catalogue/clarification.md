# Clarificación — Spec 005

Estado: aclarada por la solicitud explícita de implementación del propietario.
Fecha: 2026-09-13.

## Ambigüedades

1. La solicitud no autoriza usar credenciales, datos identificables de vehículos ni servicios DGT de acceso restringido. El alcance se limita a enlaces oficiales y trazabilidad del catálogo público/local.
2. La ficha actual contiene afirmaciones estáticas de informe DGT y VIN de ejemplo. Se tratarán como texto de demostración no acreditado y se eliminarán/reformularán para la superficie pública.
3. No se ha aprobado licencia de reutilización para todos los conjuntos de datos DGT. No se copiarán o redistribuirán estos conjuntos.

## Contradicciones entre requisitos

Ninguna. La facilidad de acceso a trámites se resuelve con enlaces salientes, no con una automatización no autorizada.

## Casos límite no cubiertos

La actualización y validación de datos DGT requiere evaluar cada fichero y versión por separado. Queda fuera de esta entrega hasta disponer de esquema, licencia y criterio de actualización aprobados.

## Conflictos con la gobernanza

La arquitectura actual es HTML/JS estática y el charter local prevé futuras integraciones reguladas. Esta tarea no cambia arquitectura, no introduce dependencias ni conecta servicios externos.

## Riesgos pendientes

1. Cobertura/licencia/calidad de los microdatos y catálogo actuales: responsable de resolución, propietario del producto, antes de importar datos DGT.
2. Validez de la información de cada anuncio: el anunciante debe aportar evidencia; CocheMotor debe evitar presentarla como verificada automáticamente.

## Veredicto

`GO` para enlaces oficiales, copy de límites de verificación y metadatos de procedencia. `NO-GO` para ingesta automática o consultas de matrículas.
