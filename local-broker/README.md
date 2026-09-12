# Dealer Local — CocheMotor

Núcleo local inicial del asistente Dealer Digital para venta de vehículos de ocasión (VO) en España. Implementa el dominio de concesionarios, compraventas freelancers, stock con distintivos DGT, matching de demanda y expedientes de venta con trazabilidad legal española.

## Pruebas

Desde la raíz del repositorio:

```text
python -m unittest discover -s local-broker/tests -p "test_*.py"
```

El concesionario sintético de prueba es `Autos Ocasión Demo España`.


## Panel interno de solicitudes Coche Ideal

El panel local está disponible en /asesor.html. El API no permite consultar ni modificar solicitudes sin autenticación.

Antes de arrancar el broker, define una clave aleatoria fuera del repositorio:

`powershell
 = "genera-una-clave-larga-y-unica"
python local-broker/server.py
`

El panel usa X-Advisor-Key. En producción, esta clave debe sustituirse por autenticación de usuarios, HTTPS y control de permisos por asesor. No se debe guardar en HTML, JavaScript, Git ni capturas de pantalla.