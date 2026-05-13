-- ================================================================
--  MUUU APP · Schema Final Completo
--  MySQL 8.0+ (Railway)
--
--  Versión definitiva que consolida:
--    v1 — Auth, flashcards, materiales, temas, dificultades
--    v2 — Suscripciones, fotoPerfil, rachaActual
--    v3 — NOTIFICACION
--    v4 — RANKING + HISTORIAL_FLASHCARD
--    v5 — HISTORIAL_FLASHCARD.resultado
--    v6 — USUARIO.googleId (OAuth Google)
--    v7 — USUARIO.ultimaSesion (timestamp de login)
--
--  Tablas (11):
--    ROL · USUARIO · DIFICULTAD · TEMA · FLASHCARDS
--    OPCIONES_RESPUESTA · MATERIAL · SUSCRIPCION
--    NOTIFICACION · RANKING · HISTORIAL_FLASHCARD
--
--  Uso:
--    DB nueva    → ejecutar completo
--    DB existente → ver sección MIGRACIÓN al final
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
--     Catálogo de roles de la aplicación.
-- ================================================================
CREATE TABLE ROL (
  id_rol  INT         NOT NULL AUTO_INCREMENT,
  nombre  VARCHAR(20) NOT NULL,
  PRIMARY KEY (id_rol),
  UNIQUE KEY uq_rol_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO ROL (id_rol, nombre) VALUES
  (1, 'estudiante'),
  (2, 'docente');


-- ================================================================
--  2. USUARIO
--     · contrasena           → NULL para cuentas creadas con Google
--     · fotoPerfil           → URL relativa /uploads/... o NULL
--     · rachaActual          → días consecutivos con actividad en quiz
--     · fechaUltimaActividad → fecha del último quiz completado
--     · ultimaSesion         → datetime exacto del último login
--     · googleId             → sub de Google OAuth (UNIQUE, NULL si no usa Google)
--     · esActivo             → 0 = cuenta suspendida
-- ================================================================
CREATE TABLE USUARIO (
  id_usuario           INT          NOT NULL AUTO_INCREMENT,
  nombre               VARCHAR(100) NOT NULL,
  correo               VARCHAR(150) NOT NULL,
  contrasena           VARCHAR(255)          DEFAULT NULL,   -- NULL para cuentas Google
  fotoPerfil           VARCHAR(300)          DEFAULT NULL,
  esActivo             TINYINT(1)   NOT NULL DEFAULT 1,
  rachaActual          INT          NOT NULL DEFAULT 0,
  fechaUltimaActividad DATE                  DEFAULT NULL,
  ultimaSesion         DATETIME              DEFAULT NULL
    COMMENT 'Fecha y hora del último inicio de sesión en la app',
  googleId             VARCHAR(100)          DEFAULT NULL,
  id_rol               INT          NOT NULL,
  PRIMARY KEY (id_usuario),
  UNIQUE KEY uq_usuario_correo  (correo),
  UNIQUE KEY uq_usuario_google  (googleId),
  CONSTRAINT fk_usuario_rol
    FOREIGN KEY (id_rol) REFERENCES ROL(id_rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ================================================================
--  3. DIFICULTAD
-- ================================================================
CREATE TABLE DIFICULTAD (
  id_dificultad INT         NOT NULL AUTO_INCREMENT,
  nombre        VARCHAR(30) NOT NULL,
  PRIMARY KEY (id_dificultad),
  UNIQUE KEY uq_dificultad_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO DIFICULTAD (id_dificultad, nombre) VALUES
  (1, 'Basico'),
  (2, 'Intermedio'),
  (3, 'Avanzado');


-- ================================================================
--  4. TEMA
--     · esSistema = 1 → creado por el sistema, no eliminable por docentes
--     · esSistema = 0 → creado por un docente, eliminable si no tiene vínculos
--
--  IDs fijos (coinciden con la DB de Railway en producción):
--    1  Formulas de Integrales Inmediatas
--    2  Integracion por Partes — ILATE
--    3  Sustitucion Trigonometrica
--    4  Fracciones Parciales
--    5  Identidades Trigonometricas para Reduccion de Potencias
--    6  Teorema Fundamental del Calculo
--    7  Propiedades de la Integral Definida
--    8  Integrales Numericas
-- ================================================================
CREATE TABLE TEMA (
  id_tema     INT          NOT NULL AUTO_INCREMENT,
  nombre      VARCHAR(100) NOT NULL,
  descripcion TEXT                  DEFAULT NULL,
  icono       VARCHAR(10)           DEFAULT NULL,
  esSistema   TINYINT(1)   NOT NULL DEFAULT 0,
  PRIMARY KEY (id_tema),
  UNIQUE KEY uq_tema_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO TEMA (id_tema, nombre, descripcion, icono, esSistema) VALUES
  (1, 'Formulas de Integrales Inmediatas',
      'Integrales directas de la tabla estandar',                          '📋', 1),
  (2, 'Integracion por Partes — ILATE',
      'Metodo integral u dv = uv menos integral v du (ILATE)',             '🐄', 1),
  (3, 'Sustitucion Trigonometrica',
      'Sustitucion con seno, coseno o tangente',                           '📐', 1),
  (4, 'Fracciones Parciales',
      'Descomposicion de fracciones racionales',                           '✂️', 1),
  (5, 'Identidades Trigonometricas para Reduccion de Potencias',
      'Reduccion de potencias con identidades trigonometricas',            '🔢', 1),
  (6, 'Teorema Fundamental del Calculo',
      'Relacion entre derivacion e integracion',                           '⚖️', 1),
  (7, 'Propiedades de la Integral Definida',
      'Linealidad, aditividad y acotamiento',                              '📊', 1),
  (8, 'Integrales Numericas',
      'Metodos numericos de integracion',                                  '🧮', 0);


-- ================================================================
--  5. FLASHCARDS
--     · integral          → pregunta (puede contener LaTeX con $...$)
--     · respuestaCorrecta → texto de la opción correcta (redundante con
--                           OPCIONES_RESPUESTA pero útil para consultas rápidas)
--     · estado            → BORRADOR (solo visible al docente) |
--                           PUBLICADO (visible a estudiantes)
-- ================================================================
CREATE TABLE FLASHCARDS (
  id_flashcard      INT      NOT NULL AUTO_INCREMENT,
  integral          TEXT     NOT NULL,
  respuestaCorrecta TEXT     NOT NULL,
  estado            ENUM('BORRADOR','PUBLICADO') NOT NULL DEFAULT 'BORRADOR',
  fechaCreacion     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_tema           INT      NOT NULL,
  id_dificultad     INT      NOT NULL,
  id_usuario        INT      NOT NULL,  -- docente dueño
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
--     · esCorrecta       → puede haber más de una opción correcta por flashcard
--     · retroalimentacion → explicación que ve el estudiante al responder
-- ================================================================
CREATE TABLE OPCIONES_RESPUESTA (
  id_opcion          INT  NOT NULL AUTO_INCREMENT,
  contenidoRespuesta TEXT NOT NULL,
  esCorrecta         TINYINT(1) NOT NULL DEFAULT 0,
  retroalimentacion  TEXT DEFAULT NULL,
  id_flashcard       INT  NOT NULL,
  PRIMARY KEY (id_opcion),
  CONSTRAINT fk_opcion_flashcard
    FOREIGN KEY (id_flashcard) REFERENCES FLASHCARDS(id_flashcard) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ================================================================
--  7. MATERIAL
--     · tipo       → PDF | IMAGEN | VIDEO | LINK | RESUMEN
--     · urlArchivo → ruta relativa /uploads/... (disco Render)
--                    o URL externa (YouTube, Google Drive, etc.)
-- ================================================================
CREATE TABLE MATERIAL (
  id_material   INT          NOT NULL AUTO_INCREMENT,
  titulo        VARCHAR(200) NOT NULL,
  tipo          VARCHAR(20)  NOT NULL,
  urlArchivo    VARCHAR(500) NOT NULL,
  fechaCarga    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_tema       INT          NOT NULL,
  id_dificultad INT          NOT NULL,
  id_usuario    INT          NOT NULL,  -- docente que lo subió
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
--     PK compuesta: un estudiante no puede suscribirse dos veces
--     al mismo docente.
-- ================================================================
CREATE TABLE SUSCRIPCION (
  id_estudiante INT NOT NULL,
  id_docente    INT NOT NULL,
  PRIMARY KEY (id_estudiante, id_docente),
  CONSTRAINT fk_suscripcion_estudiante
    FOREIGN KEY (id_estudiante) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE,
  CONSTRAINT fk_suscripcion_docente
    FOREIGN KEY (id_docente)    REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ================================================================
--  9. NOTIFICACION
--     Tipos usados en el sistema:
--       nueva_suscripcion  → docente recibe aviso de nuevo suscriptor
--       nueva_flashcard    → estudiante recibe aviso de nueva flashcard publicada
--       nuevo_material     → estudiante recibe aviso de nuevo material
--       acceso_material    → docente recibe aviso de acceso a su material
--       descarga_material  → docente recibe aviso de descarga de su material
-- ================================================================
CREATE TABLE NOTIFICACION (
  id_notificacion INT          NOT NULL AUTO_INCREMENT,
  id_usuario      INT          NOT NULL,
  tipo            VARCHAR(30)  NOT NULL,
  titulo          VARCHAR(120) NOT NULL,
  mensaje         TEXT         NOT NULL,
  leida           TINYINT(1)   NOT NULL DEFAULT 0,
  fechaCreacion   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_notificacion),
  KEY idx_notif_usuario       (id_usuario),
  KEY idx_notif_usuario_leida (id_usuario, leida),
  CONSTRAINT fk_notif_usuario
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ================================================================
--  10. RANKING
--      Un único registro por estudiante (UNIQUE en id_usuario).
--      · puntos   → se incrementan +10 por cada respuesta correcta en quiz
--      · nivel    → calculado en consulta: FLOOR(puntos / 500)
--      · posicion → actualizada al consultar el top (ROW_NUMBER en app)
-- ================================================================
CREATE TABLE RANKING (
  id_ranking INT NOT NULL AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  puntos     INT NOT NULL DEFAULT 0,
  posicion   INT          DEFAULT NULL,
  PRIMARY KEY (id_ranking),
  UNIQUE KEY uq_ranking_usuario (id_usuario),
  CONSTRAINT fk_ranking_usuario
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ================================================================
--  11. HISTORIAL_FLASHCARD
--      Un registro por cada flashcard respondida en cada sesión de quiz.
--      Permite calcular:
--        · Estadísticas por tema del estudiante
--        · Tasa de aciertos global del docente
--        · Top 5 flashcards más falladas
--        · flashcardsEstudiadas (COUNT DISTINCT en perfil)
-- ================================================================
CREATE TABLE HISTORIAL_FLASHCARD (
  id_historial INT      NOT NULL AUTO_INCREMENT,
  id_usuario   INT      NOT NULL,
  id_flashcard INT      NOT NULL,
  resultado    ENUM('correcta','incorrecta') NOT NULL DEFAULT 'correcta',
  fecha        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_historial),
  KEY idx_hist_usuario            (id_usuario),
  KEY idx_hist_usuario_flashcard  (id_usuario, id_flashcard),
  CONSTRAINT fk_hist_usuario
    FOREIGN KEY (id_usuario)   REFERENCES USUARIO(id_usuario)      ON DELETE CASCADE,
  CONSTRAINT fk_hist_flashcard
    FOREIGN KEY (id_flashcard) REFERENCES FLASHCARDS(id_flashcard) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ================================================================
--  VERIFICACIÓN
-- ================================================================
SELECT 'ROL'                 AS tabla, COUNT(*) AS filas FROM ROL
UNION ALL SELECT 'USUARIO',              COUNT(*) FROM USUARIO
UNION ALL SELECT 'DIFICULTAD',           COUNT(*) FROM DIFICULTAD
UNION ALL SELECT 'TEMA',                 COUNT(*) FROM TEMA
UNION ALL SELECT 'FLASHCARDS',           COUNT(*) FROM FLASHCARDS
UNION ALL SELECT 'OPCIONES_RESPUESTA',   COUNT(*) FROM OPCIONES_RESPUESTA
UNION ALL SELECT 'MATERIAL',             COUNT(*) FROM MATERIAL
UNION ALL SELECT 'SUSCRIPCION',          COUNT(*) FROM SUSCRIPCION
UNION ALL SELECT 'NOTIFICACION',         COUNT(*) FROM NOTIFICACION
UNION ALL SELECT 'RANKING',              COUNT(*) FROM RANKING
UNION ALL SELECT 'HISTORIAL_FLASHCARD',  COUNT(*) FROM HISTORIAL_FLASHCARD;


-- ================================================================
--  MIGRACIÓN INCREMENTAL (si ya tienes datos y solo falta alguna columna)
-- ================================================================

-- v6: Google OAuth
-- ALTER TABLE USUARIO MODIFY COLUMN contrasena VARCHAR(255) DEFAULT NULL;
-- ALTER TABLE USUARIO ADD COLUMN googleId VARCHAR(100) DEFAULT NULL;
-- ALTER TABLE USUARIO ADD UNIQUE KEY uq_usuario_google (googleId);

-- v7: timestamp de último login
-- ALTER TABLE USUARIO
--   ADD COLUMN ultimaSesion DATETIME DEFAULT NULL
--   COMMENT 'Fecha y hora del último inicio de sesión en la app';

-- v5: resultado en historial
-- ALTER TABLE HISTORIAL_FLASHCARD
--   ADD COLUMN resultado ENUM('correcta','incorrecta') NOT NULL DEFAULT 'correcta';

-- Temas 5-8 (si solo tenías los 4 originales)
-- INSERT IGNORE INTO TEMA (id_tema, nombre, descripcion, icono, esSistema) VALUES
--   (5,'Identidades Trigonometricas para Reduccion de Potencias','','🔢',1),
--   (6,'Teorema Fundamental del Calculo','Relacion entre derivacion e integracion','⚖️',1),
--   (7,'Propiedades de la Integral Definida','Linealidad, aditividad y acotamiento','📊',1),
--   (8,'Integrales Numericas','Metodos numericos de integracion','🧮',0);
