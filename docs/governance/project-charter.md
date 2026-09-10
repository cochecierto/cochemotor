# Project charter — CocheMotor

Fecha de actualización de esta versión: 2026-09-10.

## Identidad y responsabilidad

- Identidad responsable: CocheMotor (`cochemotor.es` / AutoTech B2B2C).
- Propietario y responsable final: Juan / Dirección del proyecto.

## Objetivo

Crear una plataforma digital y SaaS especializada en la venta de vehículos de ocasión (VO) con mecánica verificada en España que ayude a compraventas independientes (freelancers), talleres mecánicos y pequeños concesionarios multimarca a gestionar su stock, centralizar leads multicanal, generar fichas públicas profesionales, operar por WhatsApp, certificar la calidad mecánica con sello pericial, cruzar oferta y demanda, y acompañar la venta con checklists de trámites DGT y garantía mecánica legal obligatoria de 1 año.

## Mercado y piloto

- Mercado objetivo: España.
- Enfoque inicial: Profesionales independientes (freelancers con 3-15 vehículos), talleres mecánicos asociados y pequeños compraventas multimarca (campas de 15-50 vehículos).

## Alcance inicial aprobado (MVP)

El MVP validará primero:

1. **Captación y centralización de leads multicanal**: Registro estructurado de prospectos procedentes de portales (Coches.net, Wallapop, Milanuncios, etc.) y formularios web.
2. **Calificación de compradores y tasación de entrada**: Identificación de si el lead busca comprar al contado, financiar o entregar coche usado a cambio.
3. **Gestión básica de inventario de vehículos (Stock)**: Ficha técnica completa (marca, modelo, versión, año, km, combustible, caja de cambios, potencia, distintivo ambiental DGT 0/ECO/C/B, estado ITV, garantía incluida, precio contado/financiado).
4. **Sello CocheMotor de Mecánica Verificada**: Integración visual del distintivo de 100 puntos de control para fotos y fichas de producto.
5. **Generación de Fichas Públicas Compartibles**: URLs públicas por vehículo con galería optimizada, detalles técnicos y botón de contacto directo a WhatsApp.
6. **WhatsApp como canal operativo prioritario**: Respuestas rápidas, envío de fichas y fotos sin fricción.
7. **Matching automático**: Cruce entre compradores con demandas específicas y vehículos en stock propio o de la red de compraventas colaboradoras.
8. **Asistente Dealer Digital (Patrón BROKER/DEALER)**: Recomendación de la siguiente mejor acción comercial y checklist de trámites en España (informe DGT de cargas/embargos, contrato de compraventa, transferencia telemática y póliza de garantía legal de 1 año).

## Arquitectura de superficies aprobada

- `cochemotor.es`: web institucional, marketplace y captación comercial de concesionarios, talleres y compradores.
- `app.cochemotor.es`: aplicación SaaS privada para los profesionales.
- `demo.cochemotor.es`: entorno de demostración con stock y leads sintéticos.
- WordPress + constructor visual: webs de presentación comercial y landings de captación B2B.
- Next.js separado: aplicación SaaS interna.
- Motor de orquestación en Python con aislamiento estricto por concesionario/cuenta (`tenant_id`).

## Fuera de alcance inicial

- Pasarelas de cobro de vehículos online o pagos reales.
- Expansión fuera de España.
- Conexión API automatizada de pago con DGT o portales sin supervisión humana.
- Publicación automática sin revisión del compraventa.
- Datos personales reales (uso exclusivo de datos sintéticos en pruebas).

