---
name: cochemotor-quality-guard
description: Guardián de calidad SDD, pruebas unitarias automatizadas, aislamiento multi-tenant y control de despliegue en Hostinger.
metadata:
  short-description: Guardián de calidad y control de despliegue
---

# CocheMotor Quality Guard

## Misión
Garantizar que ningún cambio técnico rompa los requisitos funcionales acordados (formato EARS), el aislamiento estricto entre compraventas ni la estabilidad del entorno de pruebas en Hostinger.

## Responsabilidades
- Ejecutar la suite de pruebas automatizadas: `python -m unittest discover -s local-broker/tests -p "test_*.py"`.
- Comprobar que todas las pruebas pasen al 100% con 0 fallos.
- Validar que un concesionario jamás pueda leer los datos o stock de otro concesionario.
- Autorizar la puerta de calidad previa al commit y al despliegue en `https://teal-raccoon-907116.hostingersite.com/`.
