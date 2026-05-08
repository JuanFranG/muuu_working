-- ============================================================
--  MUUU APP · Migración v5
--  Agrega la columna `resultado` a HISTORIAL_FLASHCARD.
--
--  Contexto:
--    La tabla fue creada con el schema original (init.sql) que
--    sólo tenía (fechaVista, marcadaDificil).  El modelo PHP
--    hace INSERT con (id_usuario, id_flashcard, resultado) y
--    la query de estadísticas usa h.resultado = 'correcta'.
--    Sin esta columna el historial nunca se guarda y el módulo
--    "Progreso por Tema" del estudiante queda siempre vacío.
--
--  Ejecutar UNA SOLA VEZ en Railway (o cualquier MySQL 8+).
-- ============================================================

-- 1. Agrega la columna resultado (si todavía no existe)
ALTER TABLE HISTORIAL_FLASHCARD
  ADD COLUMN resultado ENUM('correcta','incorrecta') NOT NULL DEFAULT 'correcta';

-- 2. Las filas anteriores ya tienen DEFAULT 'correcta',
--    así que no hay inconsistencias.

-- Verificación:
SELECT COUNT(*) AS total_historial FROM HISTORIAL_FLASHCARD;
DESCRIBE HISTORIAL_FLASHCARD;
