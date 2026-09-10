---
name: cochemotor-editorial-web
description: Diseña y construye experiencias web editoriales de alto impacto y landings de 8 capítulos para CocheMotor (cochemotor.es), basadas en el estándar BIG School Webs con configuración centralizada desacoplada.
metadata:
  short-description: Arquitectura y diseño web editorial para CocheMotor
---

# CocheMotor Editorial Web Experience

## Misión

Construir y evolucionar la presencia web de **CocheMotor** (`cochemotor.es`) aplicando la metodología editorial de **BIG School Webs**: una experiencia de alto impacto visual, narrativa contemporánea estructurada en **8 capítulos**, mobile-first riguroso y configuración centralizada desacoplada (`site.config.js`).

A diferencia de plantillas SaaS genéricas o portales de clasificados saturados, esta metodología presenta el stock de vehículos y la certificación mecánica como una **campaña editorial de alta gama** que transmite máxima confianza, rigor pericial y transparencia para eliminar el miedo a las estafas en coches de ocasión.

## Estructura de los 8 Capítulos Editoriales

1. **Capítulo 1 — Apertura Full-Bleed**: Héroe visual con el vehículo protagonista, logotipo CocheMotor con claim *Marketplace Digital*, promesa contundente y llamada a la acción (CTA) única.
2. **Capítulo 2 — El Problema y Relato de Origen**: Manifiesto editorial sobre la desconfianza histórica en la segunda mano (vicios ocultos, cuentakilómetros trucados, embargos sorpresa) y el propósito de CocheMotor.
3. **Capítulo 3 — Escena de Ingeniería de Taller**: Detalle visual macro del motor, diagnosis OBD y peritaje mecánico en boxes.
4. **Capítulo 4 — Los Tres Pilares de Confianza**:
   - *Pilar 1*: Inspección pericial rigurosa en 100 puntos de control mecánicos por talleres homologados.
   - *Pilar 2*: Trazabilidad telemática DGT (informe oficial libre de cargas, embargos y reservas de dominio).
   - *Pilar 3*: Garantía mecánica legal de 12 meses certificada con contrato transparente.
5. **Capítulo 5 — Protagonista en Contexto**: El coche verificado con el *Sello CocheMotor* listo para rodar.
6. **Capítulo 6 — La Experiencia de Compra y Catálogo Interactivo**: Cómo funciona (contacto instantáneo por WhatsApp con el taller/freelancer, prueba dinámica en campa y entrega con llaves en mano).
7. **Capítulo 7 — FAQ Editorial**: Preguntas reales de decisión resueltas con elementos nativos accesibles (`<details>` y `<summary>`).
8. **Capítulo 8 — Cierre Transaccional**: Formulario de contacto/solicitud, acceso para talleres colaboradores y footer sobrio con design tokens oficiales.

## Reglas de Arquitectura

- **Centralización Absoluta**: Todo el copy, rutas de imagen, datos de stock, colores, teléfonos de WhatsApp y textos de FAQ viven en `site.config.js`. Ningún componente visual contiene texto o datos *hardcodeados*.
- **Mobile-First Real**: Diseñado desde 320 px de ancho, con áreas táctiles mínimas de $44 \times 44\text{ px}$ y contraste accesible WCAG AA.
- **Cero Estética Barata**: Prohibido el abuso de cajas translúcidas, sombras difusas o gradientes estridentes; el impacto se logra mediante tipografía limpia (*Plus Jakarta Sans / Inter*), espacio negativo y fotografía automotriz de calidad.
- **Una Sola CTA Primaria**: Mensaje consistente y acción directa (ver stock verificado o contactar por WhatsApp).
