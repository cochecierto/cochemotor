# VendoCoche360 (España)

Base documental y técnica de la plataforma SaaS **VendoCoche360**, diseñada para dar soporte operativo y comercial a **freelancers (compraventas independientes)** y **pequeños concesionarios de vehículos de ocasión (VO) en España**.

El proyecto implementa de manera estricta la metodología **Spec-Driven Development (SDD)** siguiendo las directrices de `mouredev/hello-sdd`.

## Estado actual

- **Gobernanza**: Project charter y modelo de negocio adaptados al mercado español de compraventa automotriz.
- **Metodología SDD**: Especificación formal activa en `specs/001-dealer-digital-automocion/` redactada en sintaxis EARS.
- **Núcleo de Dominio Local**: Módulo Python puro en `local-broker/` con suite de pruebas unitarias al 100% (verificando aislamiento multi-tenant, inventario de stock con distintivo ambiental DGT, matching de demanda y checklist de hitos legales en España: informe DGT, contrato y garantía de 1 año).

## Enlaces clave

- [Instrucciones del proyecto para agentes](AGENTS.md)
- [Índice de documentación](docs/00-INDEX.md)
- [Project charter de VendoCoche360](docs/governance/project-charter.md)
- [Metodología SDD](docs/governance/sdd-methodology.md)
- [Modelo de negocio](docs/product/BUSINESS-MODEL.md)
- [Arquitectura del producto](docs/product/PRODUCT-ARCHITECTURE.md)
- [Modelo de datos de automoción](docs/product/AUTOMOTIVE-DATA-MODEL.md)
- [Spec 001 — Dealer Digital Automoción](specs/001-dealer-digital-automocion/spec.md)

## Ejecución de pruebas locales

```bash
python -m unittest discover -s local-broker/tests -p "test_*.py"
```

