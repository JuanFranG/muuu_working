-- ================================================================
--  MUUU APP · Schema completo de base de datos
--  MySQL 8.0+  (Railway)
--
--  Incluye todas las tablas, relaciones y datos iniciales
--  correspondientes a todas las iteraciones del proyecto:
--    v1  — Auth, flashcards, materiales, temas, dificultades
--    v2  — Suscripciones, fotos de perfil, racha
--    v3  — Notificaciones persistentes
--    v4  — Ranking y estadísticas de quiz
--
--  INSTRUCCIONES:
--    Ejecutar completo en una DB nueva, o sección por sección
--    si la DB ya existe (ver comentarios de migración al final).
-- ================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ── Eliminar tablas en orden inverso a las FKs ────────────────
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
--     Tipos de usuario: estudiante (1) y docente (2).
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
--     Tabla central de usuarios (estudiantes y docentes).
--     · fotoPerfil  → URL relativa en /uploads/ (puede ser NULL)
--     · rachaActual → días consecutivos de actividad
--     · fechaUltimaActividad → fecha del último acceso registrado
--     · esActivo    → 0 = cuenta suspendida
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
--     Niveles de dificultad para flashcards y materiales.
-- ================================================================
CREATE TABLE DIFICULTAD (
  id_dificultad  INT          NOT NULL AUTO_INCREMENT,
  nombre         VARCHAR(30)  NOT NULL,
  PRIMARY KEY (id_dificultad),
  UNIQUE KEY uq_dificultad_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO DIFICULTAD (nombre) VALUES
  ('Básico'),
  ('Intermedio'),
  ('Avanzado');


-- ================================================================
--  4. TEMA
--     Categorías de contenido (temas de cálculo integral, etc.).
--     · esSistema = 1 → tema creado por defecto, no eliminable
--     · esSistema = 0 → creado por un docente, eliminable si
--                       no tiene flashcards/materiales vinculados
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

-- Temas de sistema predefinidos
INSERT INTO TEMA (nombre, descripcion, icono, esSistema) VALUES
  ('Integrales Inmediatas',      'Reglas básicas de integración directa',          '📐', 1),
  ('Integración por Partes',     'Técnica ∫u dv = uv − ∫v du',                    '🔢', 1),
  ('Fracciones Parciales',       'Descomposición de fracciones racionales',        '➗', 1),
  ('Sustitución Trigonométrica', 'Cambio de variable con funciones trigonométricas','📏', 1),
  ('Integrales Impropias',       'Integración en intervalos no acotados',          '∞',  1),
  ('Aplicaciones del Cálculo',   'Áreas, volúmenes y otros problemas aplicados',   '📊', 1);


-- ================================================================
--  5. FLASHCARDS
--     Tarjetas de estudio creadas por docentes.
--     · integral          → expresión matemática (puede incluir HTML/LaTeX)
--     · respuestaCorrecta → texto de la respuesta correcta
--     · estado            → BORRADOR (no visible a estudiantes) | PUBLICADO
--     · id_usuario        → docente propietario
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
--     Opciones de respuesta (A, B, C, D) de cada flashcard.
--     · esCorrecta = 1 → esta opción es la correcta
--     · retroalimentacion → texto explicativo mostrado al responder
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
--     Materiales de estudio subidos por docentes.
--     · tipo      → PDF | IMAGEN | VIDEO | LINK | RESUMEN
--     · urlArchivo → ruta en /uploads/ o URL externa (LINK)
--     · id_usuario → docente que lo subió
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
--  8. SUSCRIPCION
--     Relación N:M entre estudiantes y docentes.
--     Un estudiante puede seguir a varios docentes y recibir
--     notificaciones de su nuevo contenido.
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
--  9. NOTIFICACION  (v3 — módulo de notificaciones)
--     Notificaciones persistentes por usuario.
--     Tipos:
--       nueva_suscripcion  → docente recibe: estudiante X se suscribió
--       nueva_flashcard    → estudiante recibe: nuevo contenido publicado
--       nuevo_material     → estudiante recibe: nuevo material subido
--       acceso_material    → docente recibe: estudiante X accedió a material
--       descarga_material  → docente recibe: estudiante X descargó material
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
--  10. RANKING  (v4 — módulo de ranking)
--      Un registro por estudiante. Acumula puntos de todos los
--      quizzes completados. posicion se recalcula automáticamente
--      con ROW_NUMBER() después de cada quiz.
--      Fórmula: 10 puntos por respuesta correcta.
--      Nivel   : FLOOR(puntos / 500)
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
--  11. HISTORIAL_FLASHCARD  (v4 — módulo de estadísticas)
--      Un registro por flashcard respondida en cada sesión de quiz.
--      Permite calcular:
--        · Flashcards únicas estudiadas (COUNT DISTINCT id_flashcard)
--        · Precisión por tema (JOIN con FLASHCARDS → TEMA)
--      resultado: 'correcta' si el estudiante acertó, 'incorrecta' si no.
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
--  FIN DEL SCHEMA
-- ================================================================
-- Verificación rápida:
SELECT 'ROL'                AS tabla, COUNT(*) AS filas FROM ROL
UNION ALL SELECT 'DIFICULTAD',         COUNT(*) FROM DIFICULTAD
UNION ALL SELECT 'TEMA',               COUNT(*) FROM TEMA
UNION ALL SELECT 'USUARIO',            COUNT(*) FROM USUARIO
UNION ALL SELECT 'FLASHCARDS',         COUNT(*) FROM FLASHCARDS
UNION ALL SELECT 'OPCIONES_RESPUESTA', COUNT(*) FROM OPCIONES_RESPUESTA
UNION ALL SELECT 'MATERIAL',           COUNT(*) FROM MATERIAL
UNION ALL SELECT 'SUSCRIPCION',        COUNT(*) FROM SUSCRIPCION
UNION ALL SELECT 'NOTIFICACION',       COUNT(*) FROM NOTIFICACION
UNION ALL SELECT 'RANKING',            COUNT(*) FROM RANKING
UNION ALL SELECT 'HISTORIAL_FLASHCARD',COUNT(*) FROM HISTORIAL_FLASHCARD;


-- ================================================================
--  MIGRACIÓN INCREMENTAL (si la DB ya existe y quieres aplicar
--  solo los cambios nuevos sin borrar datos)
-- ================================================================

/*
-- ── v2: agregar fotoPerfil y racha a USUARIO ─────────────────
ALTER TABLE USUARIO
  ADD COLUMN IF NOT EXISTS fotoPerfil           VARCHAR(300) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS rachaActual          INT          NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS fechaUltimaActividad DATE         DEFAULT NULL;

-- ── v3: tabla NOTIFICACION ────────────────────────────────────
CREATE TABLE IF NOT EXISTS NOTIFICACION (
  id_notificacion  INT           NOT NULL AUTO_INCREMENT,
  id_usuario       INT           NOT NULL,
  tipo             VARCHAR(30)   NOT NULL,
  titulo           VARCHAR(120)  NOT NULL,
  mensaje          TEXT          NOT NULL,
  leida            TINYINT(1)    NOT NULL DEFAULT 0,
  fechaCreacion    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_notificacion),
  KEY idx_notif_usuario (id_usuario),
  CONSTRAINT fk_notif_usuario
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── v4: tablas RANKING e HISTORIAL_FLASHCARD ──────────────────
CREATE TABLE IF NOT EXISTS RANKING (
  id_ranking  INT  NOT NULL AUTO_INCREMENT,
  id_usuario  INT  NOT NULL,
  puntos      INT  NOT NULL DEFAULT 0,
  posicion    INT  DEFAULT NULL,
  PRIMARY KEY (id_ranking),
  UNIQUE KEY uq_ranking_usuario (id_usuario),
  CONSTRAINT fk_ranking_usuario
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS HISTORIAL_FLASHCARD (
  id_historial  INT      NOT NULL AUTO_INCREMENT,
  id_usuario    INT      NOT NULL,
  id_flashcard  INT      NOT NULL,
  resultado     ENUM('correcta','incorrecta') NOT NULL DEFAULT 'correcta',
  fecha         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_historial),
  CONSTRAINT fk_hist_usuario
    FOREIGN KEY (id_usuario)   REFERENCES USUARIO(id_usuario)      ON DELETE CASCADE,
  CONSTRAINT fk_hist_flashcard
    FOREIGN KEY (id_flashcard) REFERENCES FLASHCARDS(id_flashcard) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Si HISTORIAL_FLASHCARD ya existía sin la columna resultado:
ALTER TABLE HISTORIAL_FLASHCARD
  ADD COLUMN IF NOT EXISTS resultado ENUM('correcta','incorrecta') NOT NULL DEFAULT 'correcta';
*/
