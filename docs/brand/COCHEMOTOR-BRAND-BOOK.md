# Manual de Identidad de Marca y Design Tokens: CocheMotor (cochemotor.es)

> **Versión 1.0.0 — Especificación Técnica de Identidad Visual y Producto Digital**  
> Dirección de Arte y Diseño UI/UX para Automoción Transaccional B2B2C

---

## 1. Fundamentos y Territorio de Marca

* **Nombre de Marca**: **CocheMotor** (`cochemotor.es`).
* **Propósito**: Conectar a freelancers, talleres mecánicos y pequeños concesionarios con compradores particulares a través de una plataforma digital transparente, eliminando estafas, vicios ocultos y desconfianza mediante **inspección mecánica peritada y trazabilidad DGT**.
* **Personalidad de Marca**: Técnica, rigurosa, transparente, segura, tecnológica y accesible.
* **Tagline Oficial**: *Tu Marketplace de Automoción Digital* / *Mecánica Verificada de Ocasión*.

---

## BLOQUE 1: Logotipo y Sistema Vectorial

### 1. Construcción Geométrica del Isotipo
El símbolo gráfico sintetiza la aerodinámica automotriz y la ingeniería mecánica:
* **Morfología**:
  - **Línea Superior**: Silueta estilizada en trazo continuo de un vehículo deportivo/coupé aerodinámico.
  - **Línea Inferior**: La talonera y el chasis se transforman orgánicamente en un conjunto mecánico horizontal compuesto por **biela y pistón**.
  - **Rueda Trasera**: Diseñada como una corona o llanta de engranaje dentado, reforzando la precisión de taller.
  - **Rueda Delantera / Cilindro**: El pistón con sus ranuras de compresión funciona como soporte del eje delantero.
* **Retícula de Construcción**:
  - Basada en una rejilla modular de `8px` con curvas trazadas en arcos tangentes proporcionales (relación aurea $\phi = 1.618$).
  - Grosor de trazo uniforme de `1.5X` con remates redondeados (*rounded caps*) para suavizar la agresividad mecánica.
  - Testeado para legibilidad extrema: funciona desde formatos monumentales (fachadas de talleres y vinilos) hasta **Favicon de 16x16 px** y app icon de 48x48 px mediante la versión aislada del pistón.

### 2. Wordmark / Logotipo Tipográfico
* **Composición**: `CocheMotor` se compone en una sola palabra con capitalización CamelCase para potenciar el naming de dominio digital.
  - **"Coche"**: Tipografía Neogrotesca en peso *Medium / Regular*, transmitiendo cercanía y accesibilidad.
  - **"Motor"**: Tipografía en peso *Bold / Black*, aportando peso visual, tracción y contundencia industrial.
* **Kerning y Tracking**: Kerning métrico optimizado manualmente con tracking de `-0.02em` para evitar dispersión óptica en pantallas retina.

### 3. Versiones del Identificador
1. **Versión Principal (Horizontal)**: Isotipo a la izquierda + Wordmark `CocheMotor` a la derecha (o Isotipo superior centrado + Wordmark + Tagline inferior). Uso principal en header web y cabeceras de contratos.
2. **Versión Vertical / Reducida (Stacked)**: Isotipo superior centrado sobre el wordmark. Ideal para avatares, apps móviles y perfiles sociales.
3. **Símbolo Independiente (Isotipo / Icono)**: El isotipo completo o el glifo del pistón aislado como favicon, splash screen y marca de agua en peritajes.
4. **Variantes Cromáticas**:
   - **Positivo (Fondo Claro)**: Isotipo y texto en *Deep Navy* (`#002D62`) o *Graphite Charcoal* (`#3C3F41`).
   - **Negativo (Fondo Oscuro)**: Isotipo en *Cyan Electric Blue* (`#00BFFF`) y texto en *Crisp White* (`#FFFFFF`).
   - **Monocromo / Escala de Grises**: 100% negro (`#000000`) o blanco puro (`#FFFFFF`) para estampación en sellos de caucho, facturas blanco y negro o grabados láser.

### 4. Zonas de Reserva y Tamaños Mínimos
* **Área de Exclusión**: Se define la variable `X` equivalente a la altura de la letra **"o"** del wordmark. Ningún elemento gráfico, borde o tipografía puede situarse a menos de `1X` alrededor del logotipo.
* **Tamaños Mínimos**:
  - **Digital**: Logo completo: ancho mínimo de `120 px`. Isotipo aislado: mínimo `16x16 px`.
  - **Impreso**: Logo completo: ancho mínimo de `28 mm`. Isotipo aislado: `6 mm`.

### 5. Usos Incorrectos
- ❌ No alterar la proporción entre "Coche" y "Motor".
- ❌ No deformar, rotar o aplicar perspectiva artificial al isotipo.
- ❌ No aplicar biselados, degradados radiales no normalizados ni sombras difusas (*drop shadows* sucias).
- ❌ No usar el color Cyan Electric Blue para el texto principal sobre fondo blanco (falta de contraste WCAG).
- ❌ No colocar el logotipo sobre fotografías complejas sin una máscara o fondo de contraste.

---

## BLOQUE 2: Paleta Cromática Técnica y Accesibilidad

Tabla técnica normalizada para producción digital e impresa:

| Rol de Color | Nombre | HEX | RGB | CMYK | Pantone (PMS) | Función en UI |
|---|---|---|---|---|---|---|
| **Primario** | **Deep Navy Blue** | `#002D62` | `0, 45, 98` | `100, 80, 20, 40` | PMS 295 C | Fondos oscuros institucionales, headers, titulares H1/H2 |
| **Secundario** | **Graphite Charcoal** | `#3C3F41` | `60, 63, 65` | `65, 55, 50, 45` | PMS 425 C | Textos principales de lectura, bordes y elementos estructurales |
| **Acento / CTA** | **Cyan Electric Blue** | `#00BFFF` | `0, 191, 255` | `70, 15, 0, 0` | PMS 298 C | Botones de acción, enlaces activos, badges de verificación |
| **Superficie** | **Crisp White** | `#FFFFFF` | `255, 255, 255` | `0, 0, 0, 0` | — | Fondo de aplicación y tarjetas de vehículos |
| **Fondo Neutro** | **Cool Off-White** | `#F4F7FB` | `244, 247, 251` | `4, 2, 1, 0` | — | Fondo general de páginas para descanso visual |
| **Éxito (Semáforo)** | **Verified Green** | `#059669` | `5, 150, 105` | `80, 10, 75, 5` | PMS 7724 C | Tag "Mecánica Verificada / Sin Cargas DGT" |
| **Alerta (Semáforo)** | **Warning Amber** | `#D97706` | `217, 119, 6` | `10, 60, 100, 5` | PMS 1385 C | Tag "ITV Próxima / Revisión Pendiente" |
| **Peligro (Semáforo)** | **Hazard Red** | `#DC2626` | `220, 38, 38` | `5, 95, 95, 5` | PMS 1795 C | Tag "Embargo DGT / Avería Crítica" |

### Contraste y Accesibilidad (WCAG 2.1 AA / AAA)
- **Deep Navy (`#002D62`) sobre Crisp White (`#FFFFFF`)**: Ratio **13.8:1** (Supera ampliamente **AAA** para texto y UI).
- **Graphite Charcoal (`#3C3F41`) sobre Crisp White (`#FFFFFF`)**: Ratio **9.6:1** (Supera **AAA** para cuerpo de texto).
- **Crisp White (`#FFFFFF`) sobre Deep Navy (`#002D62`)**: Ratio **13.8:1** (Supera **AAA**).
- **Cyan Electric Blue (`#00BFFF`)**: 
  - Al ser un color de alta luminosidad, sobre fondo blanco alcanza un ratio de 2.1:1 (insuficiente para texto).
  - **Regla de uso accesible**: El Cyan `#00BFFF` se usa como fondo de botón con texto en *Deep Navy* (`#002D62`), logrando un ratio de **6.5:1 (Pasa WCAG AA y AAA en botones)**, o como color de iconos y trazos decorativos.

---

## BLOQUE 3: Sistema Tipográfico

### 1. Familias Tipográficas
* **Tipografía Display / Identidad**: **Synergy Grotesk**
  - Para comunicación corporativa y logomarca.
  - *Alternativa oficial Google Fonts para web/app*: **Plus Jakarta Sans** (geometría moderna, excelente legibilidad en cabeceras de producto).
* **Tipografía de Interfaz y Datos**: **Inter** (Google Fonts)
  - Diseñada específicamente para pantallas.
  - Altura de la 'x' generosa y soporte nativo para **números tabulares** (`font-feature-settings: 'tnum'`), imprescindible para comparar precios (`14.500 €`), kilometrajes (`68.000 km`) y fechas de matriculación sin desalineaciones.

### 2. Jerarquía Tipográfica y Escala Modular (Rem / Px)

```css
/* Design Tokens Tipográficos - Base 16px */
--text-display-1: 3.5rem;    /* 56px - Line-height: 1.1  - Weight: 800 (Hero Banner) */
--text-h1:        2.25rem;   /* 36px - Line-height: 1.2  - Weight: 700 (Títulos de página) */
--text-h2:        1.875rem;  /* 30px - Line-height: 1.25 - Weight: 700 (Ficha Vehículo: Modelo) */
--text-h3:        1.5rem;    /* 24px - Line-height: 1.3  - Weight: 600 (Secciones / Garantía) */
--text-h4:        1.25rem;   /* 20px - Line-height: 1.4  - Weight: 600 (Precio / Titulares card) */
--text-body-lg:   1.125rem;  /* 18px - Line-height: 1.5  - Weight: 400/500 (Entradillas) */
--text-body:      1rem;      /* 16px - Line-height: 1.5  - Weight: 400 (Párrafos estándar) */
--text-body-sm:   0.875rem;  /* 14px - Line-height: 1.4  - Weight: 500 (Metadatos / Ubicación) */
--text-caption:   0.75rem;   /* 12px - Line-height: 1.3  - Weight: 500 (Avisos legales) */
--text-data-badge:0.6875rem; /* 11px - Line-height: 1.0  - Weight: 700 - Uppercase (Badges DGT/KM) */
```

---

## BLOQUE 4: Sello de Certificación y Subsistema Visual

### "Sello CocheMotor: Mecánica Verificada"
Insignia de confianza que diferencia a la plataforma frente a los portales tradicionales donde proliferan coches con vicios ocultos:

1. **Estructura Visual**:
   - **Forma**: Escudo heráldico contemporáneo o roseta circular con micro-dentado perimetral (alusión al engranaje).
   - **Centro**: Silueta del pistón en vector blanco rodeado por el anillo Cyan Electric Blue.
   - **Texto Perimétrico**: `• COCHEMOTOR CERTIFIED • MECÁNICA VERIFICADA •`.
   - **Sub-tag**: `100 PUNTOS DE CONTROL · GARANTÍA 12M`.
2. **Aplicaciones**:
   - **Watermark en Fotos de Vehículos**: Colocado en la esquina superior derecha al 85% de opacidad para certificar que el coche fue inspeccionado por un taller oficial adherido.
   - **Ficha Digital**: Badge animado con microinteracción al pasar el cursor, desplegando el desglose de compresión de motor, frenos, diagnosis OBD y cargas DGT.
   - **Vinilo para Talleres / Concesionarios**: Adhesivo para lunas y escaparates de los talleres asociados en España.

---

## BLOQUE 5: Estructura de Assets y Entregables

Estructura de carpetas recomendada para el repositorio y entrega en Figma:

```
assets/brand/
├── 01_logos/
│   ├── horizontal/
│   │   ├── cochemotor_logo_primary.svg
│   │   ├── cochemotor_logo_white.svg
│   │   └── cochemotor_logo_monochrome.svg
│   ├── stacked/
│   │   ├── cochemotor_stacked_primary.svg
│   │   └── cochemotor_stacked_white.svg
│   └── symbol/
│       ├── cochemotor_symbol.svg
│       ├── cochemotor_piston_icon.svg
│       └── favicon.ico (16x16, 32x32, 48x48)
├── 02_badges/
│   ├── sello_mecanica_verificada_badge.svg
│   ├── sello_mecanica_verificada_dark.svg
│   └── watermark_certificacion.png
├── 03_icons/ (Stroke 1.5px - 24x24 px)
│   ├── icon_car.svg
│   ├── icon_engine.svg
│   ├── icon_piston.svg
│   ├── icon_gear.svg
│   ├── icon_dashboard_speedometer.svg
│   ├── icon_shield_check.svg
│   ├── icon_dgt_badge.svg
│   ├── icon_key.svg
│   ├── icon_tag_price.svg
│   ├── icon_map_pin.svg
│   ├── icon_warranty_document.svg
│   └── icon_user_handshake.svg
└── 04_tokens/
    ├── brand-tokens.json
    └── brand-tokens.css
```
