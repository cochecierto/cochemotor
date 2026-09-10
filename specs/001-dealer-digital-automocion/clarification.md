# Clarificación — Spec 001 Dealer Digital Automoción

## Preguntas y Decisiones Aprobadas

### 1. ¿Cómo se identifican los profesionales y concesionarios en la fase inicial?
- **Decisión**: Se modelan con `Dealership` (concesionario o compraventa independiente), asignando un `tenant_id` y un `slug` único (ej. `coches-madrid-demo`). Todo el stock y clientes se indexan bajo este `tenant_id`.

### 2. ¿Qué datos del vehículo son obligatorios para publicar la ficha pública?
- **Decisión**: Marca, modelo, año, kilometraje, precio al contado, combustible y distintivo ambiental DGT (0/ECO/C/B/Sin distintivo). La matrícula puede anonimizarse visualmente en la ficha pública con fotos, pero se guarda en el expediente interno para la verificación DGT.

### 3. ¿Cómo se gestiona el canal WhatsApp?
- **Decisión**: En el MVP no se contrata aún la API costosa de Meta. Se utiliza el estándar universal `https://wa.me/34XXXXXXXXX?text=Hola,%20me%20interesa%20el%20vehiculo...` que permite abrir la conversación nativa en el móvil del comprador y vendedor con un solo toque.

### 4. ¿Qué datos de prueba se utilizan?
- **Decisión**: Se define el concesionario sintético `Autos Ocasión Demo España` con vehículos y matrículas de prueba en territorio español.
