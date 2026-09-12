# CocheMotor (cochemotor.es)

Plataforma digital y SaaS B2B2C donde **freelancers, talleres mecánicos y pequeños concesionarios** anuncian y venden stock verificado de vehículos de ocasión en España a compradores particulares que buscan evitar estafas y averías ocultas.

El proyecto implementa de manera estricta la metodología **Spec-Driven Development (SDD)** siguiendo las directrices de `mouredev/hello-sdd` y cuenta con un sistema de diseño visual normativo.

## Estado actual

- **Identidad de Marca y Arte**: Manual de identidad, Board visual y tokens CSS/JSON en `docs/brand/COCHEMOTOR-BRAND-BOOK.md` con paleta Deep Navy (`#002D62`), Graphite Charcoal (`#3C3F41`) y Cyan Electric Blue (`#00BFFF`).
- **Gobernanza**: Project charter y modelo de negocio adaptados al mercado español de compraventa y talleres mecánicos.
- **Staff de Agentes**: Agente Director (`cochemotor-director`) y especialista en marca (`cochemotor-brand-identity`) coordinando las especificaciones.
- **Metodología SDD**: Especificación formal activa en `specs/001-dealer-digital-automocion/` redactada en sintaxis EARS.
- **Núcleo de Dominio Local**: Módulo Python puro en `local-broker/` con suite de pruebas unitarias al 100% (verificando aislamiento multi-tenant, inventario de stock con distintivo ambiental DGT, matching de demanda y checklist de hitos legales en España: informe DGT, contrato y garantía de 1 año).

## Enlaces clave

- [Manual de Marca y Tokens CocheMotor](docs/brand/COCHEMOTOR-BRAND-BOOK.md)
- [Tokens de Diseño CSS](.agents/skills/cochemotor-brand-identity/references/brand-tokens.css)
- [Instrucciones del proyecto para agentes](AGENTS.md)
- [Índice de documentación](docs/00-INDEX.md)
- [Project charter de CocheMotor](docs/governance/project-charter.md)
- [Metodología SDD](docs/governance/sdd-methodology.md)
- [Modelo de negocio](docs/product/BUSINESS-MODEL.md)
- [Arquitectura del producto](docs/product/PRODUCT-ARCHITECTURE.md)
- [Modelo de datos de automoción](docs/product/AUTOMOTIVE-DATA-MODEL.md)
- [Spec 001 — Dealer Digital Automoción](specs/001-dealer-digital-automocion/spec.md)

## Ejecución de pruebas locales

```bash
python -m unittest discover -s local-broker/tests -p "test_*.py"
```



- [Referencia visual de producto CocheMotor](docs/brand/COCHEMOTOR-PRODUCT-VISUAL-REFERENCE.png)
