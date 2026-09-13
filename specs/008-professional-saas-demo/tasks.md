# Tareas — Spec 008

- [x] T1. Revisar el panel autenticado, la landing profesional, el flujo de alta beta y las políticas de seguridad. Hecho cuando: la demo queda aislada del panel real y no se reutilizan acciones con efectos externos.
- [x] T2. Definir requisitos, límites y plan técnico para la demo sintética. Hecho cuando: Spec 008 y clarificación dejan sin dudas el aislamiento, interacción y CTA.
- [x] T3. Construir la ruta pública y enlazarla desde la landing profesional. Hecho cuando: demo responsive muestra resumen, inventario, contactos y herramientas.
- [x] T4. Implementar interacción en memoria y CTA a la beta. Hecho cuando: filtros, estados, generador, previsualización y cálculo funcionan sin persistir ni llamar API.
- [x] T5. Validar aislamiento, navegación, responsive, accesibilidad básica y smoke HTTP. Hecho cuando: RF-1..RF-8 tienen evidencia en validation.md.
- [x] T6. Actualizar índice y registros de CocheMotor. Hecho cuando: ruta, límites de demo y estado se documentan sin alterar otros cambios locales.
- [x] T7. Preparar workflow manual SFTP con validación previa y transferencia acotada sin borrado remoto. Hecho cuando: el workflow solo publica los cinco archivos de esta iniciativa y hace smoke test.
- [x] T8. Dar de alta la clave pública de despliegue en Hostinger y configurar los secretos no privados de Actions (host, usuario, raíz web y `known_hosts`). Hostinger acepta la clave y SFTP de solo lectura confirma el acceso. Pendiente: que Dirección guarde `HOSTINGER_SSH_PRIVATE_KEY` desde el archivo local de forma segura; el valor privado no se copia mediante un canal que pueda registrarlo.
- [x] T9. Publicación manual por SFTP realizada y verificada: demo, estilos, script y landing profesional responden HTTP 200; CTA y navegación/filtro comprobados en la página pública. La demo solo usa información sintética y en memoria.
