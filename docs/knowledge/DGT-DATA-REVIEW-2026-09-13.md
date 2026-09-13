# Revisión de fuentes DGT para CocheMotor — 2026-09-13

## Fuentes oficiales revisadas

- [Comprar vehículo usado](https://www.dgt.es/nuestros-servicios/tu-vehiculo/vas-a-comprar-o-vender-un-vehiculo-de-segunda-mano/comprar-un-vehiculo-de-segunda-mano/)
- [Vender vehículo usado](https://www.dgt.es/nuestros-servicios/tu-vehiculo/vas-a-comprar-o-vender-un-vehiculo-de-segunda-mano/vender-un-vehiculo-de-segunda-mano/)
- [Informe de un vehículo](https://www.dgt.es/nuestros-servicios/tu-vehiculo/tus-vehiculos/informe-de-un-vehiculo/)
- [Consulta del distintivo ambiental](https://sede.dgt.gob.es/es/vehiculos/informacion-de-vehiculos/distintivo-ambiental/index.html)
- [Llamadas a revisión](https://www.dgt.es/muevete-con-seguridad/vehiculos-seguros/llamadas-a-revision/)
- [Microdatos mensuales del parque](https://www.dgt.es/menusecundario/dgt-en-cifras/dgt-en-cifras-resultados/dgt-en-cifras-detalle/Microdatos-de-parque-de-vehiculos-mensual/)
- [Ficheros mensuales del parque](https://www.dgt.es/menusecundario/dgt-en-cifras/matraba-listados/parque-vehiculos-mensual.html)
- [Descarga MOVE/PADRÓN/ZBE para organismos](https://www.dgt.es/nuestros-servicios/para-ayuntamientos-y-otras-administraciones/intermediacion-de-datos-y-descarga-de-ficheros/descarga-de-ficheros-move-padron-y-arci/)

## Hechos observados

- La DGT ofrece consulta del distintivo por matrícula e informes de vehículo como trámites oficiales; CocheMotor debe enlazar el trámite y no presentarlo como una API abierta.
- La página de microdatos presenta ZIP mensuales y diseño de registro. Indica que desde el 1 de febrero de 2025 los ficheros MATRABA no incluyen el bastidor completo; el acceso requiere acreditar interés legítimo.
- MOVE/PADRÓN/ZBE se ofrecen a organismos/entidades locales con alta y permisos, no como feed general para una web comercial.
- La fecha de actualización de una página web no demuestra por sí sola la fecha de los datos dentro de cada fichero ni los derechos de redistribución.

## Recomendación de implementación

Usar enlaces a los trámites oficiales desde las fichas; indicar claramente cuando el dato es declarado/no verificado; conservar procedencia, licencia, fecha del dato y fecha de generación para cada snapshot. Antes de importar un fichero concreto, revisar su esquema, campos identificativos, finalidad, licencia y calidad. No consultar matrícula/VIN en segundo plano, hacer scraping ni redistribuir ficheros restringidos.

## Estado del catálogo local

El catálogo de CocheMotor se consume como snapshot local. Su metadata anterior calculaba `updatedAt` en tiempo de ejecución, lo que podía aparentar una actualización de datos con cada visita; además agrupaba EEA y DGT sin atribución de fichero, fecha o licencia verificable. Esta metadata debe corregirse y no utilizarse como garantía de exactitud.
