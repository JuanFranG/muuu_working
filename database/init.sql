-- ============================================================
--  MUUU APP · Base de Datos Física
--  Universidad del Magdalena · Barrera · Russo · González
--  Motor: MySQL 8.x
--  Versión: 2.1
--    · Schema v2.0: nivel/totalPuntos/flashcardsEstudiadas
--      eliminados de USUARIO; fotoPerfil agregado; nueva tabla
--      HISTORIAL_FLASHCARD
--    · v2.1 (módulo flashcard docente):
--      FLASHCARDS + columna estado (BORRADOR|PUBLICADO)
--      FLASHCARDS + columna fechaCreacion
--      OPCIONES_RESPUESTA + columna retroalimentacion
--      TEMAS actualizados a los 7 temas del curso
-- ============================================================

CREATE DATABASE IF NOT EXISTS muuu_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE muuu_db;

-- Asegurar codificación UTF-8 para toda la sesión de carga
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Hash bcrypt de "123456" (cost=10, generado con PHP password_hash)
SET @h = '$2y$10$SuGfDTw3skrYVEXsW.eFp.b3ZdCK/41mMOfGaiV8CScDoyGuqla2G';

-- ============================================================
-- ROL
-- ============================================================
CREATE TABLE ROL (
    id_rol      BIGINT       NOT NULL AUTO_INCREMENT,
    nombre      VARCHAR(50)  NOT NULL,
    descripcion VARCHAR(255) NULL,
    CONSTRAINT PK_ROL        PRIMARY KEY (id_rol),
    CONSTRAINT UQ_ROL_nombre UNIQUE      (nombre)
) ENGINE=InnoDB;

-- ============================================================
-- USUARIO
--   · Eliminados: nivel, totalPuntos, flashcardsEstudiadas
--     (se calculan en tiempo de consulta desde RANKING e
--      HISTORIAL_FLASHCARD respectivamente)
--   · Agregado: fotoPerfil (URL del avatar)
-- ============================================================
CREATE TABLE USUARIO (
    id_usuario           BIGINT       NOT NULL AUTO_INCREMENT,
    nombre               VARCHAR(100) NOT NULL,
    correo               VARCHAR(150) NOT NULL,
    contrasena           VARCHAR(255) NOT NULL,
    esActivo             BOOLEAN      NOT NULL DEFAULT TRUE,
    fechaRegistro        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_rol               BIGINT       NOT NULL,
    rachaActual          INT          NULL     DEFAULT 0,
    fechaUltimaActividad DATE         NULL,
    fotoPerfil           VARCHAR(500) NULL,
    CONSTRAINT PK_USUARIO        PRIMARY KEY (id_usuario),
    CONSTRAINT UQ_USUARIO_correo UNIQUE      (correo),
    CONSTRAINT FK_USUARIO_ROL    FOREIGN KEY (id_rol)
        REFERENCES ROL(id_rol)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Notas de calculo para la UI:
--   nivel              = FLOOR(RANKING.puntos / 500)
--   totalPuntos        = RANKING.puntos
--   flashcardsEstudiadas = COUNT(DISTINCT id_flashcard)
--                          FROM HISTORIAL_FLASHCARD WHERE id_usuario = ?

-- ============================================================
-- TEMA  (7 temas del curso de Calculo Integral)
-- ============================================================
CREATE TABLE TEMA (
    id_tema     BIGINT       NOT NULL AUTO_INCREMENT,
    nombre      VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255) NULL,
    icono       VARCHAR(10)  NULL,
    CONSTRAINT PK_TEMA PRIMARY KEY (id_tema)
) ENGINE=InnoDB;

-- ============================================================
-- DIFICULTAD
-- ============================================================
CREATE TABLE DIFICULTAD (
    id_dificultad BIGINT      NOT NULL AUTO_INCREMENT,
    nombre        VARCHAR(50) NOT NULL,
    CONSTRAINT PK_DIFICULTAD        PRIMARY KEY (id_dificultad),
    CONSTRAINT UQ_DIFICULTAD_nombre UNIQUE      (nombre)
) ENGINE=InnoDB;

-- ============================================================
-- FLASHCARDS
--   . estado: BORRADOR (solo visible al docente) o
--             PUBLICADO (visible a estudiantes)
--   . fechaCreacion: para ordenar y auditoria
-- ============================================================
CREATE TABLE FLASHCARDS (
    id_flashcard      BIGINT       NOT NULL AUTO_INCREMENT,
    integral          TEXT         NOT NULL,
    respuestaCorrecta VARCHAR(500) NOT NULL,
    id_tema           BIGINT       NOT NULL,
    id_dificultad     BIGINT       NOT NULL,
    id_usuario        BIGINT       NOT NULL,
    estado            ENUM('BORRADOR','PUBLICADO') NOT NULL DEFAULT 'BORRADOR',
    fechaCreacion     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT PK_FLASHCARDS        PRIMARY KEY (id_flashcard),
    CONSTRAINT FK_FLASHCARD_TEMA    FOREIGN KEY (id_tema)
        REFERENCES TEMA(id_tema)             ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT FK_FLASHCARD_DIFIC   FOREIGN KEY (id_dificultad)
        REFERENCES DIFICULTAD(id_dificultad) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT FK_FLASHCARD_USUARIO FOREIGN KEY (id_usuario)
        REFERENCES USUARIO(id_usuario)       ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ============================================================
-- OPCIONES_RESPUESTA
--   . retroalimentacion: explicacion por opcion
-- ============================================================
CREATE TABLE OPCIONES_RESPUESTA (
    id_opcion          BIGINT       NOT NULL AUTO_INCREMENT,
    contenidoRespuesta VARCHAR(500) NOT NULL,
    esCorrecta         BOOLEAN      NOT NULL DEFAULT FALSE,
    retroalimentacion  TEXT         NULL,
    id_flashcard       BIGINT       NOT NULL,
    CONSTRAINT PK_OPCIONES         PRIMARY KEY (id_opcion),
    CONSTRAINT FK_OPCION_FLASHCARD FOREIGN KEY (id_flashcard)
        REFERENCES FLASHCARDS(id_flashcard) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- HISTORIAL_FLASHCARD
-- ============================================================
CREATE TABLE HISTORIAL_FLASHCARD (
    id_historial   BIGINT   NOT NULL AUTO_INCREMENT,
    id_usuario     BIGINT   NOT NULL,
    id_flashcard   BIGINT   NOT NULL,
    fechaVista     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    marcadaDificil BOOLEAN  NOT NULL DEFAULT FALSE,
    CONSTRAINT PK_HISTORIAL         PRIMARY KEY (id_historial),
    CONSTRAINT FK_HIST_USUARIO      FOREIGN KEY (id_usuario)
        REFERENCES USUARIO(id_usuario)      ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT FK_HIST_FLASHCARD    FOREIGN KEY (id_flashcard)
        REFERENCES FLASHCARDS(id_flashcard) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- SALA
-- ============================================================
CREATE TABLE SALA (
    id_sala         BIGINT      NOT NULL AUTO_INCREMENT,
    codigoSala      VARCHAR(10) NOT NULL,
    fechaCreacion   DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fechaExpiracion DATETIME    NULL,
    CONSTRAINT PK_SALA        PRIMARY KEY (id_sala),
    CONSTRAINT UQ_SALA_codigo UNIQUE      (codigoSala)
) ENGINE=InnoDB;

-- ============================================================
-- COMPETENCIA
-- ============================================================
CREATE TABLE COMPETENCIA (
    id_competencia   BIGINT   NOT NULL AUTO_INCREMENT,
    fechaCompetencia DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    numeroRondas     INT      NOT NULL DEFAULT 5,
    ganador          BIGINT   NULL,
    id_sala          BIGINT   NOT NULL,
    CONSTRAINT PK_COMPETENCIA  PRIMARY KEY (id_competencia),
    CONSTRAINT FK_COMP_GANADOR FOREIGN KEY (ganador)
        REFERENCES USUARIO(id_usuario) ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT FK_COMP_SALA    FOREIGN KEY (id_sala)
        REFERENCES SALA(id_sala)       ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ============================================================
-- USUARIO_COMPETENCIA
-- ============================================================
CREATE TABLE USUARIO_COMPETENCIA (
    id_usuario     BIGINT NOT NULL,
    id_competencia BIGINT NOT NULL,
    puntaje        INT    NOT NULL DEFAULT 0,
    CONSTRAINT PK_UCOMP          PRIMARY KEY (id_usuario, id_competencia),
    CONSTRAINT FK_UC_USUARIO     FOREIGN KEY (id_usuario)
        REFERENCES USUARIO(id_usuario)         ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT FK_UC_COMPETENCIA FOREIGN KEY (id_competencia)
        REFERENCES COMPETENCIA(id_competencia) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- MATERIAL
-- ============================================================
CREATE TABLE MATERIAL (
    id_material   BIGINT                         NOT NULL AUTO_INCREMENT,
    titulo        VARCHAR(200)                   NOT NULL,
    tipo          VARCHAR(20)                    NOT NULL,  -- PDF | IMAGEN | VIDEO | LINK | RESUMEN
    urlArchivo    VARCHAR(500)                   NOT NULL,
    numeroPaginas INT                            NULL,
    fechaCarga    DATETIME                       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_tema       BIGINT                         NOT NULL,
    id_usuario    BIGINT                         NOT NULL,
    id_dificultad BIGINT                         NOT NULL,
    CONSTRAINT PK_MATERIAL    PRIMARY KEY (id_material),
    CONSTRAINT FK_MAT_TEMA    FOREIGN KEY (id_tema)
        REFERENCES TEMA(id_tema)               ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT FK_MAT_USUARIO FOREIGN KEY (id_usuario)
        REFERENCES USUARIO(id_usuario)         ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT FK_MAT_DIFIC   FOREIGN KEY (id_dificultad)
        REFERENCES DIFICULTAD(id_dificultad)   ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ============================================================
-- PROGRESO_MATERIAL
-- ============================================================
CREATE TABLE PROGRESO_MATERIAL (
    id_progreso       BIGINT   NOT NULL AUTO_INCREMENT,
    porcentaje        INT      NOT NULL DEFAULT 0,
    completado        BOOLEAN  NOT NULL DEFAULT FALSE,
    fechaUltimoAcceso DATETIME NULL,
    id_usuario        BIGINT   NOT NULL,
    id_material       BIGINT   NOT NULL,
    CONSTRAINT PK_PROGRESO      PRIMARY KEY (id_progreso),
    CONSTRAINT UQ_PROG_USR_MAT  UNIQUE      (id_usuario, id_material),
    CONSTRAINT FK_PROG_USUARIO  FOREIGN KEY (id_usuario)
        REFERENCES USUARIO(id_usuario)   ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT FK_PROG_MATERIAL FOREIGN KEY (id_material)
        REFERENCES MATERIAL(id_material) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- RANKING  (fuente unica de puntuacion)
--   nivel = FLOOR(puntos / 500)
-- ============================================================
CREATE TABLE RANKING (
    id_ranking         BIGINT   NOT NULL AUTO_INCREMENT,
    posicion           INT      NOT NULL,
    puntos             INT      NOT NULL DEFAULT 0,
    puntosParaPodio    INT      NULL,
    fechaActualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                                         ON UPDATE CURRENT_TIMESTAMP,
    id_usuario         BIGINT   NOT NULL,
    CONSTRAINT PK_RANKING         PRIMARY KEY (id_ranking),
    CONSTRAINT UQ_RANKING_USUARIO UNIQUE      (id_usuario),
    CONSTRAINT FK_RANKING_USUARIO FOREIGN KEY (id_usuario)
        REFERENCES USUARIO(id_usuario) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;


-- ============================================================
-- ============================================================
--  D A T O S   D E   P R U E B A
-- ============================================================
-- ============================================================

-- ROLES
INSERT INTO ROL (nombre, descripcion) VALUES
('ESTUDIANTE', 'Usuario que estudia y participa en desafios'),
('DOCENTE',    'Usuario que carga material y disena flashcards');

-- USUARIOS  (contrasena de todos: 123456)
INSERT INTO USUARIO (nombre, correo, contrasena, id_rol, rachaActual, fechaUltimaActividad, fotoPerfil) VALUES
-- Usuarios demo siempre presentes
('Ada Lovelace',       'ada@muuu.com',                  @h, 1, 7, '2026-04-21', NULL),  -- id=1
('Docente Muuu',       'docente@muuu.com',               @h, 2, 0,  NULL,        NULL),  -- id=2
-- Equipo del proyecto
('Juan F. Barrera',    'jbarrera@unimagdalena.edu.co',   @h, 1, 7, '2026-04-21', NULL),  -- id=3
('Sebastian Russo',    'srusso@unimagdalena.edu.co',     @h, 1, 5, '2026-04-20', NULL),  -- id=4
('David J. Gonzalez',  'dgonzalez@unimagdalena.edu.co',  @h, 1, 3, '2026-04-19', NULL),  -- id=5
-- Docentes adicionales
('Carlos Perez',       'cperez@unimagdalena.edu.co',     @h, 2, 0,  NULL,        NULL),  -- id=6
('Laura Gomez',        'lgomez@unimagdalena.edu.co',     @h, 2, 0,  NULL,        NULL),  -- id=7
-- Mas estudiantes
('Maria F. Rios',      'mrios@unimagdalena.edu.co',      @h, 1, 2, '2026-04-18', NULL),  -- id=8
('Andres Suarez',      'asuarez@unimagdalena.edu.co',    @h, 1, 1, '2026-04-17', NULL),  -- id=9
('Valentina Torres',   'vtorres@unimagdalena.edu.co',    @h, 1, 0, '2026-04-15', NULL);  -- id=10

-- TEMAS (7 temas del curso)
INSERT INTO TEMA (nombre, descripcion, icono) VALUES
('Formulas de Integrales Inmediatas',                    'Integrales directas de la tabla estandar',               '📋'),  -- id=1
('Integracion por Partes — ILATE',                       'Metodo integral u dv = uv menos integral v du (ILATE)',   '🐄'),  -- id=2
('Sustitucion Trigonometrica',                           'Sustitucion con seno, coseno o tangente',                '📐'),  -- id=3
('Fracciones Parciales',                                 'Descomposicion de fracciones racionales',                '✂️'),  -- id=4
('Identidades Trigonometricas para Reduccion de Potencias','Reduccion de potencias con identidades trigonometricas','🔢'),  -- id=5
('Teorema Fundamental del Calculo',                      'Relacion entre derivacion e integracion',                '⚖️'),  -- id=6
('Propiedades de la Integral Definida',                  'Linealidad, aditividad y acotamiento',                   '📊');  -- id=7

-- DIFICULTAD
INSERT INTO DIFICULTAD (nombre) VALUES
('Basico'),       -- id=1
('Intermedio'),   -- id=2
('Avanzado');     -- id=3

-- FLASHCARDS (creadas por docente@muuu.com id=2)
INSERT INTO FLASHCARDS (integral, respuestaCorrecta, id_tema, id_dificultad, id_usuario, estado) VALUES
('Resuelve: integral de 2x por e^(x^2) dx',            'e^(x^2) + C',                          1, 1, 2, 'PUBLICADO'),  -- id=1
('Resuelve: integral de x por e^x dx',                  'x·e^x − e^x + C',                      2, 1, 2, 'PUBLICADO'),  -- id=2
('Resuelve: integral de x por ln(x) dx',                '(x^2/2)·ln(x) − x^2/4 + C',           2, 2, 2, 'PUBLICADO'),  -- id=3
('Resuelve: integral de 1/(x^2−1) dx',                 '(1/2)·ln|(x−1)/(x+1)| + C',           4, 2, 2, 'PUBLICADO'),  -- id=4
('Resuelve: integral de sen^2(x) dx',                   'x/2 − sen(2x)/4 + C',                  5, 2, 2, 'PUBLICADO'),  -- id=5
('Resuelve: integral de x^2 por cos(x) dx',             '2x·cos(x)+(x^2−2)·sen(x) + C',        2, 3, 2, 'PUBLICADO'),  -- id=6
('Resuelve: integral de 1/(1+x^2) dx',                  'arctan(x) + C',                         1, 1, 2, 'PUBLICADO'),  -- id=7
('Resuelve: integral impropia de e^(−x) de 0 a inf',   '1',                                     6, 3, 2, 'BORRADOR');   -- id=8

-- OPCIONES_RESPUESTA
-- Flashcard 1
INSERT INTO OPCIONES_RESPUESTA (contenidoRespuesta, esCorrecta, retroalimentacion, id_flashcard) VALUES
('e^(x^2) + C',      TRUE,  'Correcto. Sustituyendo u=x^2, du=2x dx, la integral se reduce a integral de e^u du = e^u + C.', 1),
('2·e^(x^2) + C',    FALSE, 'Incorrecto. El factor 2 ya aparece en du = 2x dx; no se duplica en el resultado.', 1),
('x·e^(x^2) + C',    FALSE, 'Incorrecto. La antiderivada de e^(x^2) no incluye el factor x aislado.', 1),
('e^(2x) + C',       FALSE, 'Incorrecto. El exponente es x^2, no 2x.', 1);
-- Flashcard 2
INSERT INTO OPCIONES_RESPUESTA (contenidoRespuesta, esCorrecta, retroalimentacion, id_flashcard) VALUES
('x·e^x − e^x + C',  TRUE,  'Correcto. Integracion por partes: u=x, dv=e^x dx → uv − integral v du = x·e^x − e^x + C.', 2),
('e^x + C',           FALSE, 'Incorrecto. Falta el termino resultante de la integracion por partes.', 2),
('x^2·e^x/2 + C',    FALSE, 'Incorrecto. No se aplica la regla de potencias aqui.', 2),
('x·e^x + e^x + C',  FALSE, 'Incorrecto. El signo del segundo termino debe ser negativo.', 2);
-- Flashcard 3
INSERT INTO OPCIONES_RESPUESTA (contenidoRespuesta, esCorrecta, retroalimentacion, id_flashcard) VALUES
('(x^2/2)·ln(x) − x^2/4 + C', TRUE,  'Correcto. Partes con u=ln(x), dv=x dx.', 3),
('x^2·ln(x)/2 + C',            FALSE, 'Incorrecto. Falta el termino de la integral resultante.', 3),
('ln(x)/x + C',                 FALSE, 'Incorrecto. Esa es la derivada de ln(x), no la antiderivada.', 3),
('x·ln(x) − x + C',            FALSE, 'Incorrecto. Esa formula corresponde a integral de ln(x) dx.', 3);
-- Flashcard 4
INSERT INTO OPCIONES_RESPUESTA (contenidoRespuesta, esCorrecta, retroalimentacion, id_flashcard) VALUES
('(1/2)·ln|(x−1)/(x+1)| + C', TRUE,  'Correcto. Fracciones parciales: 1/(x^2−1) = A/(x−1) + B/(x+1).', 4),
('ln|x^2−1| + C',               FALSE, 'Incorrecto. No se puede integrar directamente el logaritmo del denominador.', 4),
('arctan(x) + C',               FALSE, 'Incorrecto. arctan(x) corresponde a integral de 1/(1+x^2) dx.', 4),
('(1/2)·ln|x+1| + C',          FALSE, 'Incorrecto. Falta el termino con (x−1).', 4);
-- Flashcard 7
INSERT INTO OPCIONES_RESPUESTA (contenidoRespuesta, esCorrecta, retroalimentacion, id_flashcard) VALUES
('arctan(x) + C',   TRUE,  'Correcto. Integral inmediata estandar: integral de 1/(1+x^2) dx = arctan(x) + C.', 7),
('arcsen(x) + C',   FALSE, 'Incorrecto. arcsen(x) corresponde a integral de 1/raiz(1−x^2) dx.', 7),
('ln(1+x^2) + C',   FALSE, 'Incorrecto. ln(1+x^2)/2 seria la antiderivada de x/(1+x^2).', 7),
('tan(x) + C',      FALSE, 'Incorrecto. La antiderivada de tan(x) es −ln|cos(x)|+C.', 7);

-- HISTORIAL_FLASHCARD
INSERT INTO HISTORIAL_FLASHCARD (id_usuario, id_flashcard, fechaVista, marcadaDificil) VALUES
-- jbarrera (id=3)
(3, 1, '2026-04-15 09:00:00', FALSE),
(3, 2, '2026-04-15 09:05:00', FALSE),
(3, 3, '2026-04-15 09:10:00', TRUE),
(3, 4, '2026-04-16 10:00:00', FALSE),
(3, 5, '2026-04-16 10:05:00', TRUE),
(3, 6, '2026-04-17 08:00:00', FALSE),
(3, 7, '2026-04-18 08:10:00', FALSE),
-- srusso (id=4)
(4, 1, '2026-04-15 11:00:00', FALSE),
(4, 2, '2026-04-16 11:10:00', FALSE),
(4, 3, '2026-04-16 09:00:00', TRUE),
(4, 7, '2026-04-17 09:15:00', FALSE),
-- dgonzalez (id=5)
(5, 1, '2026-04-14 14:00:00', FALSE),
(5, 4, '2026-04-14 14:10:00', TRUE),
(5, 5, '2026-04-15 16:00:00', FALSE),
-- ada (id=1)
(1, 1, '2026-04-20 10:00:00', FALSE),
(1, 2, '2026-04-20 10:10:00', FALSE),
(1, 7, '2026-04-21 09:00:00', FALSE);

-- MATERIAL
INSERT INTO MATERIAL (titulo, tipo, urlArchivo, numeroPaginas, id_tema, id_usuario, id_dificultad) VALUES
('Guia completa: Integracion por Partes',          'PDF',    'https://storage.muuu.app/materiales/integ-partes.pdf', 12,   2, 2, 2),
('Video: Sustitucion trigonometrica paso a paso',  'VIDEO',  'https://storage.muuu.app/videos/sust-trig.mp4',       NULL,  3, 2, 2),
('Resumen: Fracciones Parciales',                  'RESUMEN','https://storage.muuu.app/resumenes/frac-parciales.pdf', 4,   4, 6, 2),
('Guia: Teorema Fundamental del Calculo',          'PDF',    'https://storage.muuu.app/materiales/tfc.pdf',           8,   6, 2, 1);

-- SALAS
INSERT INTO SALA (codigoSala, fechaCreacion, fechaExpiracion) VALUES
('MUUU-A1B2', '2026-04-10 14:00:00', '2026-04-10 14:30:00'),
('MUUU-C3D4', '2026-04-15 10:00:00', '2026-04-15 10:30:00');

-- COMPETENCIAS
INSERT INTO COMPETENCIA (fechaCompetencia, numeroRondas, ganador, id_sala) VALUES
('2026-04-10 14:05:00', 5, 3, 1),
('2026-04-15 10:10:00', 5, 4, 2);

INSERT INTO USUARIO_COMPETENCIA (id_usuario, id_competencia, puntaje) VALUES
(3, 1, 450), (5, 1, 320),
(4, 2, 400), (8, 2, 280);

-- PROGRESO_MATERIAL
INSERT INTO PROGRESO_MATERIAL (porcentaje, completado, fechaUltimoAcceso, id_usuario, id_material) VALUES
(100, TRUE,  '2026-04-16 08:00:00', 3, 1),
(60,  FALSE, '2026-04-18 09:30:00', 3, 2),
(100, TRUE,  '2026-04-15 11:00:00', 4, 1),
(30,  FALSE, '2026-04-14 14:00:00', 5, 3);

-- RANKING  (nivel = FLOOR(puntos/500))
INSERT INTO RANKING (posicion, puntos, puntosParaPodio, id_usuario) VALUES
(1, 1850,    0, 3),   -- jbarrera   nivel=3
(2, 1400,    0, 4),   -- srusso     nivel=2
(3, 1300,    0, 5),   -- dgonzalez  nivel=2
(4,  800,  500, 1),   -- ada        nivel=1
(5,  750,  550, 8),   -- mrios      nivel=1
(6,  300, 1000, 9);   -- asuarez    nivel=0
