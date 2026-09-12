# Arquitectura del Producto — CocheMotor

## Orientación General
La arquitectura de CocheMotor se organiza por capas modulares diseñadas para maximizar la velocidad comercial, la rotación de stock de vehículos de ocasión (VO) y la trazabilidad operativa y legal en España.

## Capas Funcionales

1. **Espacio Privado del Compraventa / Concesionario (`app.cochemotor.es`)**:
   - **Gestor de Stock**: Registro ágil de vehículos por matrícula o bastidor, carga optimizada de fotos y vídeo, control de días en stock (alerta de depreciación a los 45-60 días).
   - **Bandeja de Leads y Respuestas WhatsApp**: Centralización de contactos entrantes de Coches.net, Wallapop, Milanuncios y web propia, con generación de respuestas rápidas con enlaces a fichas públicas.
   - **Cartera de Demandas de Compradores**: Registro de clientes que buscan configuraciones específicas (SUV, etiqueta ECO, etc.).
   - **Motor de Matching Stock-Demanda**: Notificación automática cuando entra un vehículo que encaja con un comprador en espera.

2. **Escaparate y Fichas Públicas Compartibles (`cochemotor.es/v/:slug`)**:
   - Páginas web ligeras, ultra rápidas y adaptadas a móviles.
   - Galería de fotos HD con selector de detalles mecánicos e interiores.
   - Distintivo ambiental DGT visible (0 / ECO / C / B) con explicación de acceso a Zonas de Bajas Emisiones (ZBE).
   - Ficha técnica oficial (ITV, kilometraje verificado, historial de mantenimiento, garantía de 12 meses incluida).
   - Botón directo "Contactar por WhatsApp" con mensaje pre-rellenado con la referencia del vehículo.

3. **Asistente Dealer Digital (Patrón BROKER/DEALER)**:
   - Asistente inteligente guiado que orienta al compraventa en la siguiente acción para no perder el lead.
   - Tareas paso a paso para el cierre de la operación:
     - Comprobación de cargas en DGT (informe oficial telemático).
     - Generación del contrato de compraventa profesional-consumidor.
     - Tramitación de la garantía mecánica legal de 1 año.
     - Notificación de venta y cambio de titularidad telemática con gestoría colegiada.

4. **Red Colaborativa B2B de Vehículos (Stock Compartido)**:
   - Posibilidad de compartir vehículos entre compraventas autorizados con comisión acordada (*co-broking automotriz*).
   - Aislamiento absoluto de datos: ningún concesionario ve los datos de clientes ni márgenes internos de otro.

## Desacoplamiento Tecnológico
- **Frontend Comercial y Landing B2B**: WordPress + constructor visual para máxima flexibilidad en captación y SEO.
- **Aplicación SaaS Core**: Next.js (React) para una experiencia de usuario rápida y reactiva.
- **Capa de Lógica de Negocio y Orquestación**: Backend en Python (mínimas dependencias, arquitectura limpia, aislamiento multi-tenant estricto por cuenta `tenant_id`).
