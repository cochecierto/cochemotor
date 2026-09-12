# Constitución de CocheMotor

Estado: principios aprobados para el trabajo SDD.

1. **Contrato antes del código.** Toda iniciativa debe tener objetivo, usuarios, alcance, requisitos EARS, casos límite, fuera de alcance y dudas abiertas antes de implementar.
2. **Trazabilidad requisito a validación.** Cada requisito funcional debe vincularse a una tarea y a una evidencia de prueba o revisión.
3. **Separación de responsabilidades.** Producto define el contrato; ingeniería implementa; calidad valida; dirección aprueba cambios de alcance y release.
4. **Privacidad por diseño.** No se usan datos personales reales en demos, fixtures, logs o URLs. El consentimiento, el aislamiento multi-tenant y la minimización son obligatorios.
5. **Marca y experiencia coherentes.** CocheMotor mantiene identidad propia, accesibilidad WCAG AA, responsive mobile-first y configuración centralizada de copy y marca.
6. **Cambios controlados.** Un cambio de alcance actualiza primero la spec; ningún despliegue se realiza sin validación y aprobación explícita.

## Puerta de decisión

Una iniciativa solo puede avanzar con `GO` cuando no quedan dudas críticas, sus tareas están trazadas y existe evidencia de validación. Si falta una decisión material, el estado es `GO CONDICIONADO`, `NO-GO` o `INFORMACIÓN INSUFICIENTE`.