-- ================================================================
--  MUUU APP · Migración: Autenticación con Google
--
--  Cambios:
--    1. contrasena → nullable (usuarios de Google no tienen contraseña propia)
--    2. googleId   → nuevo campo para el ID único de Google (sub)
--
--  Ejecutar en Railway desde el panel SQL o con un cliente MySQL.
-- ================================================================

-- 1. Permitir contrasena NULL (usuarios de Google no la necesitan)
ALTER TABLE USUARIO
  MODIFY COLUMN contrasena VARCHAR(255) DEFAULT NULL;

-- 2. Agregar columna googleId (si no existe ya)
ALTER TABLE USUARIO
  ADD COLUMN IF NOT EXISTS googleId VARCHAR(100) DEFAULT NULL;

-- 3. Índice único para googleId (evita duplicados)
-- Nota: ignora el error si el índice ya existe
ALTER TABLE USUARIO
  ADD UNIQUE KEY uq_usuario_google (googleId);

-- Verificación rápida
SELECT
  id_usuario,
  nombre,
  correo,
  IF(contrasena IS NULL, 'Google', 'Local') AS tipo_auth,
  googleId
FROM USUARIO
ORDER BY id_usuario
LIMIT 10;
