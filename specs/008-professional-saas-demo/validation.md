# Validación — Spec 008

| Requisito | Evidencia | Estado |
|---|---|---|
| RF-1 | Ruta `/demo-profesional.html` respondió HTTP 200 en el servidor local; aviso persistente “datos sintéticos”; página `noindex`; no requiere sesión | Cumple |
| RF-2 | Navegación accesible del navegador local entre Resumen, Inventario, Contactos, Herramientas y Preparar anuncio | Cumple |
| RF-3 | Inventario filtrado a “Reservados” (1 resultado); fase de Lucía movida a “Cerrado” y contador actualizado; estado afirma que no se guarda ni envía | Cumple |
| RF-4 | Generador produjo borrador local; simulador calculó 392 €/mes con datos de ejemplo; previsualización cambió a “SEAT Demo Coche” e indicó que no creó/publicó anuncio | Cumple |
| RF-5 | `tests/test_professional_demo.py`: no hay fetch, XHR, beacon, storage del navegador, clipboard, impresión, ventanas ni formularios; únicamente se permiten los enlaces internos descritos | Cumple |
| RF-6 | CTAs del header, hero, menú y footer apuntan al registro profesional beta existente; CTA también visible desde `profesionales.html`; copy indica gratis y sin contratación | Cumple |
| RF-7 | HTML semántico, labels, estados live, foco visible, skip link, `hidden`, breakpoints 1050/760/420 y reduced motion; inspección de render desktop local | Cumple con nota |
| RF-8 | Datos demo declarados en memoria; nombres de contactos ficticios, vehículos sintéticos y etiqueta de demo en página y tarjetas | Cumple |

## Publicación

- Estado comprobado el 2026-09-13: `https://cochemotor.es/demo-profesional.html` devuelve “This Page Does Not Exist”; la ruta aún no está publicada.
- El workflow de `main` valida en push/PR; solo despliega con ejecución manual, clave SFTP y `known_hosts` fijado. Transfiere cinco archivos y no borra ni sincroniza el resto del sitio.
- La raíz SFTP se verificó como `domains/cochemotor.es/public_html`; conexión SFTP de solo lectura correcta. La clave pública dedicada está en Hostinger y GitHub contiene host, usuario, raíz y `known_hosts` como secretos.
- Falta guardar `HOSTINGER_SSH_PRIVATE_KEY` desde el archivo local de clave privada, ejecutar el workflow y verificar la URL pública. El dominio sigue devolviendo 404 hasta completar esa configuración y el despliegue.

## Checks

- `python -m unittest discover -s tests -p 'test_*.py' -v`: 24 pruebas pasan, incluidas las 6 pruebas de esta demo.
- `node --check demo-profesional.js`: correcto.
- `git diff --check` para los archivos de esta iniciativa: correcto.
- Navegador local: ruta cargó; filtros, navegación, cambio de fase, contadores, cálculo, generador y previsualización verificados.
- Nota: el navegador de esta sesión no permitió cambiar la ventana a un tamaño móvil; los breakpoints móviles se comprobaron por inspección estática, queda pendiente una pasada visual real en 390×844.
- No hay suite automatizada de navegador ni dependencias añadidas. Push y despliegue quedan pendientes de guardar la clave privada en GitHub Actions.
