-- ============================================================
--  Migración: agregar columna ultimaSesion a USUARIO
--  Registra fecha y hora exactas de cada inicio de sesión.
-- ============================================================
ALTER TABLE USUARIO
  ADD COLUMN IF NOT EXISTS ultimaSesion DATETIME DEFAULT NULL
  COMMENT 'Fecha y hora del último inicio de sesión en la app';
