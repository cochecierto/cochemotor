# Plan técnico — Coche Ideal

Estado: aprobado para primera implementación con decisiones aclaradas.

## Arquitectura

La interfaz de `demanda.html` usará un controlador de pasos y un adaptador de solicitudes. El adaptador tendrá una implementación local con `localStorage` para demo y una frontera preparada para conectar SQLite/endpoint Hostinger sin acoplar la UI al transporte. La persistencia real del broker se incorporará detrás de la misma frontera.

## Datos

La solicitud incluye identidad de catálogo (marca, modelo, versión), preferencias, territorio, contacto, consentimiento versionado, estado, tenant y marcas temporales. El estado inicial será `nueva`.

## Reglas

- Deduplicar contacto + preferencias equivalentes durante 30 días.
- No incluir PII en logs ni URLs.
- Notificación inicial en el panel interno; email queda configurable.
- Canonical: `https://cochemotor.es/demanda.html`.
- Consulta, propuesta, reserva y compraventa permanecen separadas.

## Seguridad y privacidad

Validación en cliente y servidor, consentimiento separado, minimización, identificador no sensible y aislamiento por tenant. El frontend conserva un borrador temporal ante errores.

## Pruebas

Pruebas unitarias del adaptador y deduplicación; recorrido manual de los tres pasos; validación de errores, atrás, resumen, consentimiento, duplicado y fallo; revisión responsive en 320×568, 390×844, 768×1024, 1024×768, 1440×900 y móvil horizontal.

## Riesgos

La primera fase local no equivale aún a persistencia multiusuario en producción. La publicación queda condicionada a conectar y probar el endpoint persistente autorizado.