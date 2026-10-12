# Spec 016 — Transparencia de stock y recorrido profesional de beta

**Estado:** aprobada por Dirección el 2026-10-12 tras responder las aclaraciones; implementación local autorizada. Sin autorización de publicación o despliegue.

## Contexto y objetivo

La experiencia pública muestra registros sintéticos junto al inventario publicado y la superficie profesional presenta módulos con distintos niveles de funcionamiento sin un mapa único de disponibilidad. Los mensajes de cero resultados y algunas herramientas económicas tampoco explican siempre sus supuestos. La iniciativa debe alinear lo que compradores y profesionales entienden con lo que funciona, manteniendo datos sintéticos hasta que haya profesionales suscritos.

## Usuarios / actores

- Comprador que busca un vehículo de ocasión.
- Profesional que evalúa o usa la beta.
- Dirección, responsable de condiciones comerciales, disponibilidad y tratamiento de datos.
- Equipo de desarrollo y árbitro Gauntlet independiente.

## Historias de usuario

- H1: Como comprador quiero distinguir un vehículo real disponible de un ejemplo y saber qué hacer si no hay stock.
- H2: Como profesional quiero saber qué herramientas están disponibles, en desarrollo o son ilustrativas antes de crear una cuenta.
- H3: Como profesional quiero recorrer las funciones disponibles con datos sintéticos sin enviar mensajes ni publicar información real por accidente.
- H4: Como profesional quiero entender qué se guarda, quién puede verlo y qué ocurrirá con mis datos al terminar la beta.
- H5: Como usuario quiero interpretar los cálculos de cuota y margen conociendo sus supuestos y límites.

## Requisitos funcionales (criterios de aceptación EARS)

- RF-1: CUANDO el sistema renderice el catálogo público, EL SISTEMA incluirá únicamente vehículos reales, publicados, vigentes y contactables desde la fuente pública autorizada; los registros sintéticos y los estados de próxima entrada no contarán como stock comprable ni como resultados del marketplace.
- RF-2: SI no hay vehículos publicados, ENTONCES EL SISTEMA explicará que todavía no hay stock y ofrecerá un siguiente paso informativo sin recopilar datos; SI hay stock pero los filtros no devuelven resultados, EL SISTEMA distinguirá ese caso y facilitará ampliar o restablecer filtros. Un fallo de API se comunicará como indisponibilidad, no como inventario vacío.
- RF-3: CUANDO el usuario filtre por precio, EL SISTEMA ofrecerá tramos comprensibles y sin huecos, incluidos precios superiores a 20.000 €, y aplicará los mismos límites que muestra en la interfaz.
- RF-4: CUANDO se muestre información de inventario sintético, EL SISTEMA la mantendrá en una superficie de demostración claramente identificada, sin contacto ni publicación externa, y separada de las fichas y búsquedas públicas de vehículos reales.
- RF-5: CUANDO la web, landing, demo o panel nombre una capacidad profesional, EL SISTEMA identificará su estado como «Disponible en beta», «En desarrollo» o «Ilustrativa» y explicará las acciones que realmente ejecuta, sin prometer una capacidad no conectada.
- RF-6: CUANDO se genere texto mediante una plantilla local, EL SISTEMA lo denominará borrador por plantilla y aclarará que no usa un modelo de IA; las solicitudes de compradores y los contactos sintéticos se identificarán como tales, y las capacidades no operativas no se presentarán como demanda real.
- RF-7: CUANDO se pruebe el flujo profesional en el entorno local, EL EQUIPO podrá recorrer autenticación de prueba, creación de vehículo, incorporación de fotos, revisión, ficha compartible y gestión de una consulta usando solo datos sintéticos, en un entorno aislado sin efectos externos. La publicación será solo una previsualización local no indexable.
- RF-8: CUANDO una pantalla de beta explique almacenamiento, EL SISTEMA detallará las categorías de datos, ubicación y acceso verificados. EL SISTEMA indicará que la política de fin de beta está pendiente de decisión y que se decidirá antes de habilitar cuentas reales; no prometerá retención, exportación ni borrado.
- RF-9: CUANDO se muestre una cuota, EL SISTEMA identificará importe financiado, entrada, plazo y periodicidad; usará un TIN anual editable con valor inicial 7,9 % y mostrará, si procede, únicamente el equivalente teórico por capitalización mensual sin costes, sin llamarlo TAE ni oferta de financiación.
- RF-10: CUANDO se muestre un margen, EL SISTEMA identificará los conceptos incluidos y hará visibles los impuestos, preparación, garantía, reparaciones, financiación y otros costes que no estén incluidos en el cálculo mostrado.
- RF-11: CUANDO se presenten resultados económicos, EL SISTEMA los marcará como orientativos, no vinculantes y dependientes de los datos introducidos; no afirmará rentabilidad real ni condiciones de un financiador.
- RF-12: EL SISTEMA preservará el uso de datos sintéticos en demo y validación local; no creará anuncios, cuentas de prueba con datos reales, consultas reales ni mensajes externos durante las comprobaciones de esta iniciativa.

## Requisitos no funcionales

- No añadir dependencias salvo aprobación posterior justificada.
- Mantener HTML, CSS, JavaScript y Python compatibles con la arquitectura y alojamiento actuales.
- Mantener accesibilidad por teclado, estados comprensibles para lectores de pantalla y diseño adaptable en superficies afectadas.
- Separar la base de datos local de ensayo de cualquier base existente o de producción.
- No registrar secretos, PII real ni credenciales en pruebas, informes o repositorio.

## Casos límite

- No existe inventario publicado y la API está disponible.
- La API falla o no está configurada; el sistema debe comunicar indisponibilidad sin recurrir a vehículos sintéticos.
- Hay inventario publicado, pero ninguno coincide con los filtros.
- Solo hay ejemplos sintéticos en una demo profesional.
- El usuario llega por URL directa a una ficha de un vehículo de demostración.
- Las fotos de prueba exceden tamaño o formato permitido, o la persistencia local falla.
- La verificación de cuenta requeriría correo externo; el flujo local deberá usar el mecanismo sintético aprobado y no enviar correo.
- El plazo o entrada hacen que el importe financiado sea cero.
- Los costes no introducidos son desconocidos o fiscalidad está pendiente.
- Termina la beta mientras hay borradores, fotos o consultas almacenadas.

## Fuera de alcance

- Añadir o inventar inventario real, profesionales, testimonios, solicitudes o contactos.
- Crear un proveedor de IA, copiloto conectado a mercado, entidad financiera, publicación automática en redes o integración externa.
- Activar pagos, suscripciones, publicidad, analítica o mensajería automática.
- Desplegar en producción o cambiar permisos/infraestructura como parte de la primera implementación local.
- Definir condiciones legales de conservación/eliminación o comprometer una tasa financiera sin decisión de Dirección.

## Criterios de finalización

- Ningún vehículo sintético aparece en búsqueda o inventario público como una oferta; la ausencia de stock real y la ausencia de coincidencias se entienden y ofrecen un siguiente paso aprobado.
- Los filtros tienen intervalos completos y su lógica coincide con las etiquetas.
- Existe un inventario coherente de capacidades por estado en la landing, demo y panel; todas las afirmaciones de IA, solicitudes/contactos, redes y copiloto están alineadas con el código.
- Un recorrido local aislado y sintético cubre el flujo profesional acordado, incluida la consulta de ejemplo, sin salida de datos ni publicación indexable.
- La información de almacenamiento, accesos y fin de beta coincide con la política aprobada y con la implementación comprobada.
- Los simuladores exponen TIN editable inicial 7,9 %, fórmula/supuestos y exclusiones sin presentarse como TAE, asesoramiento u oferta.
- RF-1–RF-12 tienen validación requisito por requisito; las comprobaciones automatizadas y manuales pertinentes pasan y la revisión Gauntlet independiente se registra.
- No se realiza publicación o despliegue remoto sin autorización específica posterior.

## Decisiones de clarificación aprobadas

- Hasta contar con profesionales suscritos, el sitio será informativo y no captará solicitudes de compradores ni altas reales. La verificación del recorrido será local y sintética, sin correo, publicación pública ni integraciones externas.
- No se promete una política de conservación, exportación o borrado al terminar la beta; deberá decidirse antes de habilitar cuentas reales.
- El simulador conservará un TIN editable del 7,9 % inicial y mostrará solo un equivalente matemático teórico sin costes, claramente distinguido de la TAE.
