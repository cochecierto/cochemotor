# Project charter — VendoCoche360

Fecha de actualización de esta versión: 2026-09-10.

## Identidad y responsabilidad

- Identidad responsable: VendoCoche360 (AutoTech B2B / B2B2C).
- Propietario y responsable final: Juan / Dirección del proyecto.

## Objetivo

Crear una plataforma SaaS especializada en la venta de vehículos de ocasión (VO) en España que ayude a compraventas independientes (freelancers) y pequeños concesionarios multimarca a gestionar su stock, centralizar leads multicanal, generar fichas públicas profesionales, operar por WhatsApp, cruzar oferta y demanda, y acompañar la venta con checklists de trámites DGT y garantía mecánica legal obligatoria.

## Mercado y piloto

- Mercado objetivo: España.
- Enfoque inicial: Profesionales independientes (freelancers con 3-15 vehículos) y pequeños compraventas multimarca (campas de 15-50 vehículos).

## Alcance inicial aprobado (MVP)

El MVP validará primero:

1. **Captación y centralización de leads multicanal**: Registro estructurado de prospectos procedentes de portales (Coches.net, Wallapop, Milanuncios, etc.) y formularios web.
2. **Calificación de compradores y tasación de entrada**: Identificación de si el lead busca comprar al contado, financiar o entregar coche usado a cambio.
3. **Gestión básica de inventario de vehículos (Stock)**: Ficha técnica completa (marca, modelo, versión, año, km, combustible, caja de cambios, potencia, distintivo ambiental DGT 0/ECO/C/B, estado ITV, garantía incluida, precio contado/financiado).
4. **Generación de Fichas Públicas Compartibles**: URLs públicas por vehículo con galería optimizada, detalles técnicos y botón de contacto directo a WhatsApp.
5. **WhatsApp como canal operativo prioritario**: Respuestas rápidas, envío de fichas y fotos sin fricción.
6. **Matching automático**: Cruce entre compradores con demandas específicas y vehículos en stock propio o de la red de compraventas colaboradoras.
7. **Asistente Dealer Digital (Patrón BROKER/DEALER)**: Recomendación de la siguiente mejor acción comercial y checklist de trámites en España (informe DGT de cargas/embargos, contrato de compraventa, transferencia telemática y póliza de garantía legal de 1 año).

## Arquitectura de superficies aprobada

- `vendocoche360.es` (o `.com`): web institucional y captación comercial de concesionarios y compraventas.
- `app.vendocoche360.es`: aplicación SaaS privada para los profesionales.
- `demo.vendocoche360.es`: entorno de demostración con stock y leads sintéticos.
- WordPress + constructor visual: webs de presentación comercial y landings de captación B2B.
- Next.js separado: aplicación SaaS interna.
- Motor de orquestación en Python con aislamiento estricto por concesionario/cuenta (`tenant_id`).

## Fuera de alcance inicial

- Pasarelas de cobro de vehículos online o pagos reales.
- Expansión fuera de España.
- Conexión API automatizada de pago con DGT o portales sin supervisión humana.
- Publicación automática sin revisión del compraventa.
- Datos personales reales (uso exclusivo de datos sintéticos en pruebas).

