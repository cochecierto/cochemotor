# Auditoría del flujo del panel profesional — 2026-09-15

## Alcance

Revisión del panel `hub.html` en producción (`https://cochemotor.es/hub.html`) y contraste con el checkout local. Se revisaron navegación, enlaces laterales, formularios, funciones JavaScript y errores del navegador sin crear anuncios, leads ni datos personales.

## Evidencia

- Las 12 opciones de navegación (`tab-upload` a `tab-dealer-web`) tienen un destino existente y muestran exclusivamente ese panel al activarse.
- Los enlaces laterales observados apuntan a `index.html`, `perfil.html`, `marketplace.html`, `demanda.html` y `feedback-beta.html?from=hub`; todas las rutas locales están presentes.
- Las acciones del panel tienen implementaciones en `hub.js` para sesión, inventario, fichas públicas, textos, referencias, página profesional y publicaciones.
- `node --check hub.js` pasa y la consola del panel no presenta errores ni avisos.
- La batería local `python -m unittest discover -s local-broker/tests -p 'test_*.py'` pasa con 18 pruebas.

## Resultado por flujo

| Flujo | Resultado | Evidencia |
|---|---|---|
| Acceso y sesión | PASS WITH NOTES | Panel cargado con sesión profesional existente; no se probó cierre ni alta para evitar efectos externos. |
| Navegación interna | PASS | 12/12 botones activan el panel esperado. |
| Enlaces laterales | PASS | Rutas presentes y hrefs coherentes con el producto. |
| Alta de vehículo | PASS WITH NOTES | Formulario, campos y consentimiento presentes; no se envió un anuncio real. |
| Checklist fotográfico | PASS | 10 referencias visibles con texto alternativo; selector de fotos presente. |
| Funciones JavaScript | PASS | Sintaxis válida y funciones referenciadas existentes. |
| API y persistencia | PASS WITH NOTES | El código contiene manejo de 401 y errores; requiere prueba controlada con una cuenta/BD de ensayo para certificar escritura. |

## Veredicto

**PASS WITH NOTES.** El flujo de interfaz del panel está preparado para producción y no presenta fallos reproducibles en navegación o consola. Queda como comprobación operativa separada una prueba de escritura con datos de ensayo (alta de vehículo, lead y publicación) y la monitorización de API en producción.

## Prueba controlada con datos sintéticos — 2026-09-15

- Se completó el perfil mínimo de Bedoya con datos sintéticos y se mantuvo desactivada la indexación pública del perfil.
- Se enviaron a revisión dos anuncios sintéticos: un Toyota Corolla (2020, 58.000 km, Madrid) y una Ford Transit Custom (2022, 112.000 km, València), con imágenes de referencia del proyecto y textos marcados como prueba.
- El panel confirmó ambos envíos con el mensaje de revisión pendiente y mostró `2` en «Mis coches en stock».
- No se hicieron públicos los anuncios ni se generaron leads; el panel indica que deben revisarse antes de ser visibles para compradores.
