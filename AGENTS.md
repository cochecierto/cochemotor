# VendoCoche360 — Instrucciones del proyecto

## Identidad y responsabilidad

- Identidad responsable: VendoCoche360 (anteriormente base Inmobia360 adaptada).
- Propietario y responsable final: Juan / Dirección del proyecto.

## Estado del proyecto

Esta base documental y técnica define la plataforma SaaS para el sector profesional de compraventa de vehículos de ocasión en España (freelancers y pequeños concesionarios VO). El proyecto aplica de forma estricta la metodología Spec-Driven Development (SDD) basada en `mouredev/hello-sdd`.

## Reglas

1. Leer este archivo y `docs/00-INDEX.md` antes de actuar.
2. Consultar `docs/CURRENT-STATE.md` y los registros de decisiones y riesgos.
3. No inventar datos de mercado, precios, entrevistas, resultados, arquitectura implementada ni decisiones aprobadas.
4. Separar hechos, hipótesis, estimaciones y recomendaciones.
5. No modificar el alcance, mercado inicial, presupuesto, precios o estrategia sin aprobación explícita.
6. No sobrescribir archivos sin control de versiones; ante conflicto, detenerse y documentarlo.
7. No programar ni instalar dependencias salvo autorización explícita (mantener núcleo ligero en Python nativo).
8. No guardar credenciales, tokens, datos personales reales (PII), matrículas reales protegidas ni infraestructura privada.
9. No desplegar ni cambiar permisos externos sin autorización.
10. Actualizar la documentación afectada cuando una decisión sea aprobada.

## Flujo SDD obligatorio

- Para cada iniciativa, leer `docs/governance/sdd-methodology.md` y la spec activa en `specs/` antes de implementar.
- No escribir código antes de aprobar la spec y completar la clarificación.
- Mantener separadas la spec funcional, el plan técnico, las tareas y la validación requisito por requisito (formato EARS).
- Trabajar una tarea cada vez, con pruebas antes del código cuando aplique.
- Ante un cambio de alcance, actualizar primero la spec y detener la implementación hasta obtener aprobación.

## Ámbito conocido

- Proyecto: VendoCoche360 (AutoTech SaaS B2B / B2B2C).
- Mercado inicial: España (concesionarios de compraventa multimarca y compraventas autónomos/freelancers).
- Objetivo: crear una plataforma SaaS de gestión de stock, leads y ventas asistidas para profesionales de automoción de segunda mano.
- MVP aprobado:
  1. Captación y centralización de leads multicanal (Coches.net, Wallapop, Milanuncios, web propia).
  2. Calificación de compradores y de particulares que entregan coche a cambio.
  3. Gestión de inventario de vehículos (marca, modelo, versión, matrícula/VIN, km, año, combustible, etiqueta DGT B/C/ECO/0, estado ITV, garantía legal).
  4. Generación de fichas públicas atractivas y compartibles por vehículo.
  5. Canal prioritario y operativo: WhatsApp para envío instantáneo de fichas y fotos.
  6. Matching automático entre demanda de compradores y coches en stock.
  7. Asistente Dealer Digital con tareas guiadas paso a paso y checklist de trámites DGT y garantía legal de 1 año.
- Arquitectura aprobada: webs comerciales en WordPress + constructor visual; aplicación SaaS desacoplada (Next.js); asistente de orquestación en Python puro con aislamiento estricto por concesionario/compraventa (multi-tenant).
- Fuera de alcance inicial: pasarela de pagos reales, expansión internacional, integraciones API de pago sin autorizar, publicación masiva automatizada sin control humano y datos personales reales.
