-- CocheMotor — evita que dos fichas compartan URL pública.
-- Comprobar duplicados antes de ejecutar; resolverlos conservando redirecciones 301
-- cuando ya haya URLs publicadas. No elimina ni modifica registros.
ALTER TABLE vehicles
  ADD UNIQUE KEY uq_vehicles_public_slug (public_slug);
