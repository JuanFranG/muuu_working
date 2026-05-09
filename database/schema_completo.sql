-- ================================================================
--  MUUU APP · Schema completo de base de datos
--  MySQL 8.0+  (Railway)
--
--  Tablas:
--    ROL · USUARIO · DIFICULTAD · TEMA · FLASHCARDS
--    OPCIONES_RESPUESTA · MATERIAL · SUSCRIPCION
--    NOTIFICACION · RANKING · HISTORIAL_FLASHCARD
--
--  Versiones:
--    v1 — Auth, flashcards, materiales, temas, dificultades
--    v2 — Suscripciones, fotos de perfil, racha
--    v3 — Notificaciones persistentes
--    v4 — Ranking y estadísticas de quiz
--    v5 — HISTORIAL_FLASHCARD.resultado (correcta/incorrecta)
--
--  Para DB nueva    → ejecutar completo
--  Para DB existente → ver sección MIGRACIÓN al final
-- ================================================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS HISTORIAL_FLASHCARD;
DROP TABLE IF EXISTS RANKING;
DROP TABLE IF EXISTS NOTIFICACION;
DROP TABLE IF EXISTS SUSCRIPCION;
DROP TABLE IF EXISTS OPCIONES_RESPUESTA;
DROP TABLE IF EXISTS FLASHCARDS;
DROP TABLE IF EXISTS MATERIAL;
DROP TABLE IF EXISTS TEMA;
DROP TABLE IF EXISTS DIFICULTAD;
DROP TABLE IF EXISTS USUARIO;
DROP TABLE IF EXISTS ROL;

SET FOREIGN_KEY_CHECKS = 1;


-- ================================================================
--  1. ROL
-- ================================================================
CREATE TABLE ROL (
  id_rol  INT          NOT NULL AUTO_INCREMENT,
  nombre  VARCHAR(20)  NOT NULL,
  PRIMARY KEY (id_rol),
  UNIQUE KEY uq_rol_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO ROL (id_rol, nombre) VALUES
  (1, 'estudiante'),
  (2, 'docente');


-- ================================================================
--  2. USUARIO
--     · fotoPerfil           → URL en /uploads/ o NULL
--     · rachaActual          → días consecutivos de actividad
--     · fechaUltimaActividad → fecha del último acceso
--     · esActivo             → 0 = cuenta suspendida
-- ================================================================
CREATE TABLE USUARIO (
  id_usuario           INT           NOT NULL AUTO_INCREMENT,
  nombre               VARCHAR(100)  NOT NULL,
  correo               VARCHAR(150)  NOT NULL,
  contrasena           VARCHAR(255)  NOT NULL,
  fotoPerfil           VARCHAR(300)  DEFAULT NULL,
  esActivo             TINYINT(1)    NOT NULL DEFAULT 1,
  rachaActual          INT           NOT NULL DEFAULT 0,
  fechaUltimaActividad DATE          DEFAULT NULL,
  id_rol               INT           NOT NULL,
  PRIMARY KEY (id_usuario),
  UNIQUE KEY uq_usuario_correo (correo),
  CONSTRAINT fk_usuario_rol
    FOREIGN KEY (id_rol) REFERENCES ROL(id_rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ================================================================
--  3. DIFICULTAD
-- ================================================================
CREATE TABLE DIFICULTAD (
  id_dificultad  INT          NOT NULL AUTO_INCREMENT,
  nombre         VARCHAR(30)  NOT NULL,
  PRIMARY KEY (id_dificultad),
  UNIQUE KEY uq_dificultad_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO DIFICULTAD (id_dificultad, nombre) VALUES
  (1, 'Basico'),
  (2, 'Intermedio'),
  (3, 'Avanzado');


-- ================================================================
--  4. TEMA
--     · esSistema = 1 → no eliminable por docentes
--     · esSistema = 0 → creado por docente, eliminable si sin vínculos
--
--  IDs fijos para coincidir con la DB de Railway:
--    1 Formulas de Integrales Inmediatas
--    2 Integracion por Partes — ILATE
--    3 Sustitucion Trigonometrica
--    4 Fracciones Parciales
--    5 Identidades Trigonometricas para Reduccion de Potencias
--    6 Teorema Fundamental del Calculo
--    7 Propiedades de la Integral Definida
--    8 Integrales Numericas
-- ================================================================
CREATE TABLE TEMA (
  id_tema      INT           NOT NULL AUTO_INCREMENT,
  nombre       VARCHAR(100)  NOT NULL,
  descripcion  TEXT          DEFAULT NULL,
  icono        VARCHAR(10)   DEFAULT NULL,
  esSistema    TINYINT(1)    NOT NULL DEFAULT 0,
  PRIMARY KEY (id_tema),
  UNIQUE KEY uq_tema_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO TEMA (id_tema, nombre, descripcion, icono, esSistema) VALUES
  (1, 'Formulas de Integrales Inmediatas',                  'Integrales directas de la tabla estandar',                       '📋', 1),
  (2, 'Integracion por Partes — ILATE',                     'Metodo integral u dv = uv menos integral v du (ILATE)',           '🐄', 1),
  (3, 'Sustitucion Trigonometrica',                         'Sustitucion con seno, coseno o tangente',                        '📐', 1),
  (4, 'Fracciones Parciales',                               'Descomposicion de fracciones racionales',                        '✂️', 1),
  (5, 'Identidades Trigonometricas para Reduccion de Potencias', 'Reduccion de potencias con identidades trigonometricas',    '🔢', 1),
  (6, 'Teorema Fundamental del Calculo',                    'Relacion entre derivacion e integracion',                        '⚖️', 1),
  (7, 'Propiedades de la Integral Definida',                'Linealidad, aditividad y acotamiento',                           '📊', 1),
  (8, 'Integrales Numericas',                               'Metodos numericos de integracion',                               '🧮', 0);


-- ================================================================
--  5. FLASHCARDS
--     · integral          → expresión matemática (LaTeX con $...$)
--     · respuestaCorrecta → texto de la respuesta correcta
--     · estado            → BORRADOR | PUBLICADO
-- ================================================================
CREATE TABLE FLASHCARDS (
  id_flashcard      INT           NOT NULL AUTO_INCREMENT,
  integral          TEXT          NOT NULL,
  respuestaCorrecta TEXT          NOT NULL,
  estado            ENUM('BORRADOR','PUBLICADO') NOT NULL DEFAULT 'BORRADOR',
  fechaCreacion     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_tema           INT           NOT NULL,
  id_dificultad     INT           NOT NULL,
  id_usuario        INT           NOT NULL,
  PRIMARY KEY (id_flashcard),
  CONSTRAINT fk_flashcard_tema
    FOREIGN KEY (id_tema)       REFERENCES TEMA(id_tema),
  CONSTRAINT fk_flashcard_dificultad
    FOREIGN KEY (id_dificultad) REFERENCES DIFICULTAD(id_dificultad),
  CONSTRAINT fk_flashcard_usuario
    FOREIGN KEY (id_usuario)    REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ================================================================
--  6. OPCIONES_RESPUESTA
--     · esCorrecta      = 1 → opción correcta (puede haber varias)
--     · retroalimentacion → texto explicativo al responder
-- ================================================================
CREATE TABLE OPCIONES_RESPUESTA (
  id_opcion          INT           NOT NULL AUTO_INCREMENT,
  contenidoRespuesta TEXT          NOT NULL,
  esCorrecta         TINYINT(1)    NOT NULL DEFAULT 0,
  retroalimentacion  TEXT          DEFAULT NULL,
  id_flashcard       INT           NOT NULL,
  PRIMARY KEY (id_opcion),
  CONSTRAINT fk_opcion_flashcard
    FOREIGN KEY (id_flashcard) REFERENCES FLASHCARDS(id_flashcard) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ================================================================
--  7. MATERIAL
--     · tipo       → PDF | IMAGEN | VIDEO | LINK | RESUMEN
--     · urlArchivo → ruta /uploads/ o URL externa
-- ================================================================
CREATE TABLE MATERIAL (
  id_material   INT           NOT NULL AUTO_INCREMENT,
  titulo        VARCHAR(200)  NOT NULL,
  tipo          VARCHAR(20)   NOT NULL,
  urlArchivo    VARCHAR(500)  NOT NULL,
  fechaCarga    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_tema       INT           NOT NULL,
  id_dificultad INT           NOT NULL,
  id_usuario    INT           NOT NULL,
  PRIMARY KEY (id_material),
  CONSTRAINT fk_material_tema
    FOREIGN KEY (id_tema)       REFERENCES TEMA(id_tema),
  CONSTRAINT fk_material_dificultad
    FOREIGN KEY (id_dificultad) REFERENCES DIFICULTAD(id_dificultad),
  CONSTRAINT fk_material_usuario
    FOREIGN KEY (id_usuario)    REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ================================================================
--  8. SUSCRIPCION  (N:M estudiante ↔ docente)
-- ================================================================
CREATE TABLE SUSCRIPCION (
  id_estudiante  INT  NOT NULL,
  id_docente     INT  NOT NULL,
  PRIMARY KEY (id_estudiante, id_docente),
  CONSTRAINT fk_suscripcion_estudiante
    FOREIGN KEY (id_estudiante) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE,
  CONSTRAINT fk_suscripcion_docente
    FOREIGN KEY (id_docente)    REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ================================================================
--  9. NOTIFICACION  (v3)
--     Tipos: nueva_suscripcion · nueva_flashcard · nuevo_material
--            acceso_material   · descarga_material
-- ================================================================
CREATE TABLE NOTIFICACION (
  id_notificacion  INT           NOT NULL AUTO_INCREMENT,
  id_usuario       INT           NOT NULL,
  tipo             VARCHAR(30)   NOT NULL,
  titulo           VARCHAR(120)  NOT NULL,
  mensaje          TEXT          NOT NULL,
  leida            TINYINT(1)    NOT NULL DEFAULT 0,
  fechaCreacion    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_notificacion),
  KEY idx_notif_usuario (id_usuario),
  KEY idx_notif_leida   (id_usuario, leida),
  CONSTRAINT fk_notif_usuario
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ================================================================
--  10. RANKING  (v4)
--      Un registro por estudiante. posicion → ROW_NUMBER() tras quiz.
--      Fórmula: +10 pts por correcta. Nivel = FLOOR(puntos / 500).
-- ================================================================
CREATE TABLE RANKING (
  id_ranking  INT  NOT NULL AUTO_INCREMENT,
  id_usuario  INT  NOT NULL,
  puntos      INT  NOT NULL DEFAULT 0,
  posicion    INT  DEFAULT NULL,
  PRIMARY KEY (id_ranking),
  UNIQUE KEY uq_ranking_usuario (id_usuario),
  CONSTRAINT fk_ranking_usuario
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ================================================================
--  11. HISTORIAL_FLASHCARD  (v4 + v5)
--      Un registro por flashcard respondida en cada sesión.
--      resultado: 'correcta' | 'incorrecta'
-- ================================================================
CREATE TABLE HISTORIAL_FLASHCARD (
  id_historial  INT      NOT NULL AUTO_INCREMENT,
  id_usuario    INT      NOT NULL,
  id_flashcard  INT      NOT NULL,
  resultado     ENUM('correcta','incorrecta') NOT NULL DEFAULT 'correcta',
  fecha         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_historial),
  KEY idx_hist_usuario (id_usuario),
  KEY idx_hist_tema    (id_usuario, id_flashcard),
  CONSTRAINT fk_hist_usuario
    FOREIGN KEY (id_usuario)   REFERENCES USUARIO(id_usuario)      ON DELETE CASCADE,
  CONSTRAINT fk_hist_flashcard
    FOREIGN KEY (id_flashcard) REFERENCES FLASHCARDS(id_flashcard) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ================================================================
--  VERIFICACIÓN
-- ================================================================
SELECT 'ROL'                   AS tabla, COUNT(*) AS filas FROM ROL
UNION ALL SELECT 'DIFICULTAD',            COUNT(*) FROM DIFICULTAD
UNION ALL SELECT 'TEMA',                  COUNT(*) FROM TEMA
UNION ALL SELECT 'USUARIO',               COUNT(*) FROM USUARIO
UNION ALL SELECT 'FLASHCARDS',            COUNT(*) FROM FLASHCARDS
UNION ALL SELECT 'OPCIONES_RESPUESTA',    COUNT(*) FROM OPCIONES_RESPUESTA
UNION ALL SELECT 'MATERIAL',              COUNT(*) FROM MATERIAL
UNION ALL SELECT 'SUSCRIPCION',           COUNT(*) FROM SUSCRIPCION
UNION ALL SELECT 'NOTIFICACION',          COUNT(*) FROM NOTIFICACION
UNION ALL SELECT 'RANKING',               COUNT(*) FROM RANKING
UNION ALL SELECT 'HISTORIAL_FLASHCARD',   COUNT(*) FROM HISTORIAL_FLASHCARD;


-- ================================================================
--  MIGRACIÓN INCREMENTAL (DB existente)
-- ================================================================
/*
-- v2: fotoPerfil y racha
ALTER TABLE USUARIO
  ADD COLUMN IF NOT EXISTS fotoPerfil           VARCHAR(300) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS rachaActual          INT          NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS fechaUltimaActividad DATE         DEFAULT NULL;

-- v3: NOTIFICACION
CREATE TABLE IF NOT EXISTS NOTIFICACION ( ... );

-- v4: RANKING + HISTORIAL_FLASHCARD
CREATE TABLE IF NOT EXISTS RANKING ( ... );
CREATE TABLE IF NOT EXISTS HISTORIAL_FLASHCARD ( ... );

-- v5: columna resultado en HISTORIAL_FLASHCARD
ALTER TABLE HISTORIAL_FLASHCARD
  ADD COLUMN IF NOT EXISTS resultado ENUM('correcta','incorrecta') NOT NULL DEFAULT 'correcta';

-- Temas 5-8 (si solo tenias los 4 originales)
INSERT IGNORE INTO TEMA (id_tema, nombre, descripcion, icono, esSistema) VALUES
  (5, 'Identidades Trigonometricas para Reduccion de Potencias', 'Reduccion de potencias con identidades trigonometricas', '🔢', 1),
  (6, 'Teorema Fundamental del Calculo', 'Relacion entre derivacion e integracion', '⚖️', 1),
  (7, 'Propiedades de la Integral Definida', 'Linealidad, aditividad y acotamiento', '📊', 1),
  (8, 'Integrales Numericas', 'Metodos numericos de integracion', '🧮', 0);
*/
