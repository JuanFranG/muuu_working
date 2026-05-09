-- ================================================================
--  MUUU · Seed — 20 Flashcards para docente@muuu.com
--  id_usuario = 2  |  Estado: PUBLICADO
--
--  NOTA: Este archivo es documentación de referencia.
--  Para cargar en Railway usar el endpoint PHP:
--    GET /api/seed?key=muuu_seed_2024
--  (SeedController.php tiene los mismos datos con PDO prepared statements)
--
--  Si corres este SQL directamente en un cliente MySQL que soporte
--  múltiples statements en una sola sesión (mysql CLI, DBeaver,
--  TablePlus), funciona con LAST_INSERT_ID() entre statements.
--
--  Convención LaTeX en el campo `integral`:
--    · Texto puro (sin $) → renderMath transforma todo el string
--    · Texto mixto prose+math → usar $...$ para zonas matemáticas
--      Ejemplo: "Si $\int_a^b f(x)\,dx$ = 5, cuanto vale..."
-- ================================================================

-- ── Tema 8: Integrales Numéricas ─────────────────────────────
INSERT IGNORE INTO TEMA (id_tema, nombre, descripcion, icono, esSistema)
VALUES (8, 'Integrales Numericas', 'Metodos numericos de integracion', '🧮', 0);

-- ================================================================
--  TEMA 1 · Formulas de Integrales Inmediatas  (id_tema=1, Basico)
-- ================================================================

-- FC-01 · Regla de la potencia
INSERT INTO FLASHCARDS (integral, respuestaCorrecta, id_tema, id_dificultad, id_usuario, estado)
VALUES ('\\int x^n \\, dx \\quad (n \\neq -1)', '\\frac{x^{n+1}}{n+1} + C', 1, 1, 2, 'PUBLICADO');
INSERT INTO OPCIONES_RESPUESTA (contenidoRespuesta, esCorrecta, retroalimentacion, id_flashcard) VALUES
  ('\\frac{x^{n+1}}{n+1} + C', 1, 'Correcto. Se aumenta el exponente en 1 y se divide entre ese nuevo valor.', LAST_INSERT_ID()),
  ('x^{n+1} + C',              0, 'Falta dividir entre (n+1). La regla completa es x^{n+1}/(n+1) + C.',         LAST_INSERT_ID()),
  ('nx^{n-1} + C',             0, 'Eso es la derivada de x^n, no su integral.',                                  LAST_INSERT_ID()),
  ('\\frac{x^n}{n} + C',       0, 'El exponente debe aumentar en 1; aqui no cambia.',                            LAST_INSERT_ID());

-- FC-02 · Integral de e^x
INSERT INTO FLASHCARDS (integral, respuestaCorrecta, id_tema, id_dificultad, id_usuario, estado)
VALUES ('\\int e^x \\, dx', 'e^x + C', 1, 1, 2, 'PUBLICADO');
INSERT INTO OPCIONES_RESPUESTA (contenidoRespuesta, esCorrecta, retroalimentacion, id_flashcard) VALUES
  ('e^x + C',           1, 'Correcto. La funcion e^x es su propia integral.',             LAST_INSERT_ID()),
  ('e^{x+1} + C',       0, 'No se suma 1 al exponente en e^x; eso solo aplica a x^n.',   LAST_INSERT_ID()),
  ('xe^x + C',          0, 'Ese resultado requiere integracion por partes.',               LAST_INSERT_ID()),
  ('\\frac{e^x}{x}+C',  0, 'No se divide e^x entre x al integrar.',                      LAST_INSERT_ID());

-- FC-03 · Integral de 1/x
INSERT INTO FLASHCARDS (integral, respuestaCorrecta, id_tema, id_dificultad, id_usuario, estado)
VALUES ('\\int \\frac{1}{x} \\, dx', '\\ln|x| + C', 1, 1, 2, 'PUBLICADO');
INSERT INTO OPCIONES_RESPUESTA (contenidoRespuesta, esCorrecta, retroalimentacion, id_flashcard) VALUES
  ('\\ln|x| + C',         1, 'Correcto. El valor absoluto es necesario porque ln solo acepta positivos.', LAST_INSERT_ID()),
  ('\\frac{-1}{x^2}+C',   0, 'Eso es la derivada de 1/x con signo, no su integral.',                     LAST_INSERT_ID()),
  ('\\ln(x^2) + C',       0, 'ln(x^2) = 2ln|x|; le sobra el factor 2.',                                  LAST_INSERT_ID()),
  ('\\frac{x^0}{0} + C',  0, 'Division por cero. Por eso la regla de la potencia no aplica para n=-1.',  LAST_INSERT_ID());

-- FC-04 · Integral de cos(x)
INSERT INTO FLASHCARDS (integral, respuestaCorrecta, id_tema, id_dificultad, id_usuario, estado)
VALUES ('\\int \\cos(x) \\, dx', '\\sin(x) + C', 1, 1, 2, 'PUBLICADO');
INSERT INTO OPCIONES_RESPUESTA (contenidoRespuesta, esCorrecta, retroalimentacion, id_flashcard) VALUES
  ('\\sin(x) + C',   1, 'Correcto. La integral de cos(x) es sin(x) + C.',           LAST_INSERT_ID()),
  ('-\\sin(x) + C',  0, 'Eso es la derivada de -cos(x), no la integral de cos(x).', LAST_INSERT_ID()),
  ('-\\cos(x) + C',  0, '-cos(x) es la integral de sin(x), no de cos(x).',          LAST_INSERT_ID()),
  ('\\tan(x) + C',   0, 'tan(x) es la integral de sec^2(x), no de cos(x).',         LAST_INSERT_ID());

-- ================================================================
--  TEMA 2 · Integracion por Partes — ILATE  (id_tema=2)
-- ================================================================

-- FC-05 · ∫ x·eˣ dx  (Intermedio)
INSERT INTO FLASHCARDS (integral, respuestaCorrecta, id_tema, id_dificultad, id_usuario, estado)
VALUES ('\\int x e^x \\, dx', 'e^x(x-1) + C', 2, 2, 2, 'PUBLICADO');
INSERT INTO OPCIONES_RESPUESTA (contenidoRespuesta, esCorrecta, retroalimentacion, id_flashcard) VALUES
  ('e^x(x-1) + C',          1, 'Correcto. ILATE: u=x, dv=e^x dx -> xe^x - e^x + C.',        LAST_INSERT_ID()),
  ('xe^x + C',              0, 'Falta restar la integral de v du. El resultado es xe^x - e^x.', LAST_INSERT_ID()),
  ('e^x(x+1) + C',          0, 'El signo del segundo termino debe ser negativo.',              LAST_INSERT_ID()),
  ('\\frac{x^2}{2}e^x + C', 0, 'Integrar e^x no produce x^2/2.',                             LAST_INSERT_ID());

-- FC-06 · ∫ x·ln(x) dx  (Intermedio)
INSERT INTO FLASHCARDS (integral, respuestaCorrecta, id_tema, id_dificultad, id_usuario, estado)
VALUES ('\\int x \\ln(x) \\, dx', '\\frac{x^2}{2}\\ln(x) - \\frac{x^2}{4} + C', 2, 2, 2, 'PUBLICADO');
INSERT INTO OPCIONES_RESPUESTA (contenidoRespuesta, esCorrecta, retroalimentacion, id_flashcard) VALUES
  ('\\frac{x^2}{2}\\ln(x) - \\frac{x^2}{4} + C', 1, 'Correcto. ILATE: u=ln(x), dv=x dx -> x^2/2 ln(x) - x^2/4.', LAST_INSERT_ID()),
  ('\\frac{x^2}{2}\\ln(x) + \\frac{x^2}{4} + C', 0, 'El signo del segundo termino debe ser negativo.',             LAST_INSERT_ID()),
  ('x\\ln(x) - x + C',                            0, 'Esa es la integral de ln(x), no de x*ln(x).',                LAST_INSERT_ID()),
  ('\\frac{x^2 \\ln(x)}{4} + C',                  0, 'Falta el termino generado al resolver la segunda integral.',  LAST_INSERT_ID());

-- FC-07 · ∫ eˣ·sin(x) dx  (Avanzado)
INSERT INTO FLASHCARDS (integral, respuestaCorrecta, id_tema, id_dificultad, id_usuario, estado)
VALUES ('\\int e^x \\sin(x) \\, dx', '\\frac{e^x(\\sin(x)-\\cos(x))}{2} + C', 2, 3, 2, 'PUBLICADO');
INSERT INTO OPCIONES_RESPUESTA (contenidoRespuesta, esCorrecta, retroalimentacion, id_flashcard) VALUES
  ('\\frac{e^x(\\sin(x)-\\cos(x))}{2} + C', 1, 'Correcto. Dos partes ciclicas: 2I = e^x(sin-cos) -> I = e^x(sin-cos)/2.', LAST_INSERT_ID()),
  ('\\frac{e^x(\\sin(x)+\\cos(x))}{2} + C', 0, 'El signo entre sin y cos debe ser negativo.',                              LAST_INSERT_ID()),
  ('e^x \\cos(x) + C',                      0, 'No es suficiente con una sola integracion por partes.',                    LAST_INSERT_ID()),
  ('e^x(\\sin(x)-\\cos(x)) + C',            0, 'Falta dividir entre 2 al despejar I de la ecuacion ciclica.',              LAST_INSERT_ID());

-- ================================================================
--  TEMA 3 · Sustitucion Trigonometrica  (id_tema=3)
-- ================================================================

-- FC-08 · ∫ 1/√(1-x²) dx  (Intermedio)
INSERT INTO FLASHCARDS (integral, respuestaCorrecta, id_tema, id_dificultad, id_usuario, estado)
VALUES ('\\int \\frac{1}{\\sqrt{1-x^2}} \\, dx', 'arcsin(x) + C', 3, 2, 2, 'PUBLICADO');
INSERT INTO OPCIONES_RESPUESTA (contenidoRespuesta, esCorrecta, retroalimentacion, id_flashcard) VALUES
  ('arcsin(x) + C',      1, 'Correcto. Sustitucion x=sin(t): integral de dt = arcsin(x) + C.', LAST_INSERT_ID()),
  ('arctan(x) + C',      0, 'arctan surge de 1/(1+x^2), no de 1/sqrt(1-x^2).',                 LAST_INSERT_ID()),
  ('arccos(x) + C',      0, 'La derivada de arccos es -1/sqrt(1-x^2); hay un signo diferente.', LAST_INSERT_ID()),
  ('\\sqrt{1-x^2} + C',  0, 'Derivar sqrt(1-x^2) da -x/sqrt(1-x^2), no 1/sqrt(1-x^2).',       LAST_INSERT_ID());

-- FC-09 · ∫ 1/(1+x²) dx  (Basico)
INSERT INTO FLASHCARDS (integral, respuestaCorrecta, id_tema, id_dificultad, id_usuario, estado)
VALUES ('\\int \\frac{1}{1+x^2} \\, dx', 'arctan(x) + C', 3, 1, 2, 'PUBLICADO');
INSERT INTO OPCIONES_RESPUESTA (contenidoRespuesta, esCorrecta, retroalimentacion, id_flashcard) VALUES
  ('arctan(x) + C',         1, 'Correcto. Formula directa: integral de 1/(1+x^2) = arctan(x) + C.', LAST_INSERT_ID()),
  ('arcsin(x) + C',         0, 'arcsin(x) es la integral de 1/sqrt(1-x^2), no de 1/(1+x^2).',      LAST_INSERT_ID()),
  ('\\ln(1+x^2) + C',       0, 'Para ln necesitarias 2x en el numerador.',                           LAST_INSERT_ID()),
  ('\\frac{1}{(1+x^2)^2}+C',0, 'Eso seria integrar nuevamente, no el resultado de una integracion.', LAST_INSERT_ID());

-- FC-10 · ∫ 1/√(a²-x²) dx  (Avanzado)
INSERT INTO FLASHCARDS (integral, respuestaCorrecta, id_tema, id_dificultad, id_usuario, estado)
VALUES ('\\int \\frac{1}{\\sqrt{a^2-x^2}} \\, dx \\quad (a>0)', 'arcsin(x/a) + C', 3, 3, 2, 'PUBLICADO');
INSERT INTO OPCIONES_RESPUESTA (contenidoRespuesta, esCorrecta, retroalimentacion, id_flashcard) VALUES
  ('arcsin(x/a) + C',                 1, 'Correcto. Sustitucion x=a*sin(t) lleva a integral de dt = arcsin(x/a).', LAST_INSERT_ID()),
  ('arctan(x/a) + C',                 0, 'arctan(x/a) es la integral de 1/(a^2+x^2), no de 1/sqrt(a^2-x^2).',     LAST_INSERT_ID()),
  ('\\frac{1}{a}arcsin(x) + C',       0, 'Falta dividir el argumento (no el coeficiente) entre a.',                LAST_INSERT_ID()),
  ('\\frac{x}{a\\sqrt{a^2-x^2}}+C',  0, 'Esa es la derivada de arcsin(x/a), no la integral.',                     LAST_INSERT_ID());

-- ================================================================
--  TEMA 4 · Fracciones Parciales  (id_tema=4)
-- ================================================================

-- FC-11 · ∫ 1/(x²-1) dx  (Intermedio)
INSERT INTO FLASHCARDS (integral, respuestaCorrecta, id_tema, id_dificultad, id_usuario, estado)
VALUES ('\\int \\frac{1}{x^2-1} \\, dx', '\\frac{1}{2}\\ln|\\frac{x-1}{x+1}| + C', 4, 2, 2, 'PUBLICADO');
INSERT INTO OPCIONES_RESPUESTA (contenidoRespuesta, esCorrecta, retroalimentacion, id_flashcard) VALUES
  ('\\frac{1}{2}\\ln|\\frac{x-1}{x+1}|+C', 1, 'Correcto. Fracciones parciales: 1/(x^2-1) = (1/2)/(x-1) - (1/2)/(x+1).', LAST_INSERT_ID()),
  ('\\ln|x^2-1| + C',                       0, 'Para eso el numerador tendria que ser 2x.',                                LAST_INSERT_ID()),
  ('\\frac{1}{2}\\ln|x^2-1| + C',           0, 'Falta separar en factores lineales correctamente.',                        LAST_INSERT_ID()),
  ('arctan(x) + C',                          0, 'arctan surge de 1/(1+x^2); aqui el denominador es x^2-1.',                LAST_INSERT_ID());

-- FC-12 · ∫ 2x/(x²+3x+2) dx  (Avanzado)
INSERT INTO FLASHCARDS (integral, respuestaCorrecta, id_tema, id_dificultad, id_usuario, estado)
VALUES ('\\int \\frac{2x}{x^2+3x+2} \\, dx', '-2\\ln|x+1| + 4\\ln|x+2| + C', 4, 3, 2, 'PUBLICADO');
INSERT INTO OPCIONES_RESPUESTA (contenidoRespuesta, esCorrecta, retroalimentacion, id_flashcard) VALUES
  ('-2\\ln|x+1| + 4\\ln|x+2| + C', 1, 'Correcto. (x+1)(x+2): fracciones parciales dan A=-2, B=4.', LAST_INSERT_ID()),
  ('4\\ln|x+1| - 2\\ln|x+2| + C',  0, 'Los coeficientes estan invertidos.',                         LAST_INSERT_ID()),
  ('\\ln|x^2+3x+2| + C',           0, 'Para eso el numerador seria 2x+3 (derivada del denominador).', LAST_INSERT_ID()),
  ('2\\ln|x^2+3x+2| + C',          0, 'No se puede integrar directamente; hay que descomponer.',     LAST_INSERT_ID());

-- ================================================================
--  TEMA 5 · Identidades Trig Reduccion de Potencias  (id_tema=5)
-- ================================================================

-- FC-13 · ∫ sin²(x) dx  (Intermedio)
INSERT INTO FLASHCARDS (integral, respuestaCorrecta, id_tema, id_dificultad, id_usuario, estado)
VALUES ('\\int \\sin^2(x) \\, dx', '\\frac{x}{2} - \\frac{\\sin(2x)}{4} + C', 5, 2, 2, 'PUBLICADO');
INSERT INTO OPCIONES_RESPUESTA (contenidoRespuesta, esCorrecta, retroalimentacion, id_flashcard) VALUES
  ('\\frac{x}{2} - \\frac{\\sin(2x)}{4} + C', 1, 'Correcto. Identidad: sin^2(x) = (1-cos(2x))/2.',               LAST_INSERT_ID()),
  ('\\frac{x}{2} + \\frac{\\sin(2x)}{4} + C', 0, 'El signo es negativo porque viene de (1-cos(2x))/2.',           LAST_INSERT_ID()),
  ('-\\sin(x)\\cos(x) + C',                    0, '-sin(x)cos(x) = -sin(2x)/2, difiere del resultado correcto.',   LAST_INSERT_ID()),
  ('\\frac{\\sin^3(x)}{3} + C',                0, 'Elevar al cubo seria para la integral de sin^2(x)*cos(x)dx.',  LAST_INSERT_ID());

-- FC-14 · ∫ sin³(x) dx  (Intermedio)
INSERT INTO FLASHCARDS (integral, respuestaCorrecta, id_tema, id_dificultad, id_usuario, estado)
VALUES ('\\int \\sin^3(x) \\, dx', '-\\cos(x) + \\frac{\\cos^3(x)}{3} + C', 5, 2, 2, 'PUBLICADO');
INSERT INTO OPCIONES_RESPUESTA (contenidoRespuesta, esCorrecta, retroalimentacion, id_flashcard) VALUES
  ('-\\cos(x) + \\frac{\\cos^3(x)}{3} + C', 1, 'Correcto. sin^3 = sin(1-cos^2); u=cos(x) da -u + u^3/3.', LAST_INSERT_ID()),
  ('\\cos(x) - \\frac{\\cos^3(x)}{3} + C',  0, 'Los signos estan invertidos.',                             LAST_INSERT_ID()),
  ('-\\frac{\\cos^3(x)}{3} + C',             0, 'Falta el termino -cos(x) de integrar sin(x).',            LAST_INSERT_ID()),
  ('\\frac{\\sin^4(x)}{4} + C',              0, 'Esa formula requiere cos(x) en el diferencial.',          LAST_INSERT_ID());

-- ================================================================
--  TEMA 6 · Teorema Fundamental del Calculo  (id_tema=6)
-- ================================================================

-- FC-15 · TFC Parte 1  (Basico)
-- Nota: texto mixto prose+math → usar $...$ para zonas matemáticas
INSERT INTO FLASHCARDS (integral, respuestaCorrecta, id_tema, id_dificultad, id_usuario, estado)
VALUES ('Si $F(x) = \\int_0^x t^2 \\, dt$, cual es la derivada $F\'(x)$?', 'x^2', 6, 1, 2, 'PUBLICADO');
INSERT INTO OPCIONES_RESPUESTA (contenidoRespuesta, esCorrecta, retroalimentacion, id_flashcard) VALUES
  ('x^2',            1, 'Correcto. TFC Parte 1: si F(x) = integral de f(t)dt entonces F\'(x) = f(x) = x^2.', LAST_INSERT_ID()),
  ('\\frac{x^3}{3}', 0, 'Eso es F(x) misma, no su derivada.',                                                 LAST_INSERT_ID()),
  ('2x',             0, 'Eso seria la derivada de x^2, no de la integral de t^2.',                            LAST_INSERT_ID()),
  ('t^2',            0, 'La variable t se reemplaza por el limite superior x al derivar.',                    LAST_INSERT_ID());

-- FC-16 · TFC Parte 2 — integral definida concreta  (Basico)
INSERT INTO FLASHCARDS (integral, respuestaCorrecta, id_tema, id_dificultad, id_usuario, estado)
VALUES ('\\int_1^3 (2x+1) \\, dx', '10', 6, 1, 2, 'PUBLICADO');
INSERT INTO OPCIONES_RESPUESTA (contenidoRespuesta, esCorrecta, retroalimentacion, id_flashcard) VALUES
  ('10', 1, 'Correcto. Antiderivada x^2+x. Evaluar: (9+3)-(1+1) = 12-2 = 10.',  LAST_INSERT_ID()),
  ('8',  0, 'Verifica: F(3)=12, F(1)=2, diferencia = 10.',                        LAST_INSERT_ID()),
  ('12', 0, 'Solo evaluaste F(3); debes restar F(1) = 2.',                         LAST_INSERT_ID()),
  ('14', 0, 'Revisa la antiderivada de 2x+1: es x^2+x, no x^2+2x.',              LAST_INSERT_ID());

-- ================================================================
--  TEMA 7 · Propiedades de la Integral Definida  (id_tema=7)
-- ================================================================

-- FC-17 · Linealidad  (Basico)
INSERT INTO FLASHCARDS (integral, respuestaCorrecta, id_tema, id_dificultad, id_usuario, estado)
VALUES ('Si $\\int_a^b f(x)\\,dx$ = 5 y $\\int_a^b g(x)\\,dx$ = 3, cuanto vale $\\int_a^b [2f(x)+g(x)]\\,dx$?', '13', 7, 1, 2, 'PUBLICADO');
INSERT INTO OPCIONES_RESPUESTA (contenidoRespuesta, esCorrecta, retroalimentacion, id_flashcard) VALUES
  ('13', 1, 'Correcto. Linealidad: 2*5 + 1*3 = 13.',                          LAST_INSERT_ID()),
  ('16', 0, 'Serian 2*(5+3)=16 solo si ambas tuvieran coeficiente 2.',         LAST_INSERT_ID()),
  ('8',  0, 'Eso seria solo 5+3 sin aplicar el coeficiente 2.',                LAST_INSERT_ID()),
  ('11', 0, 'Verifica: 2*5 + 1*3 = 10 + 3 = 13.',                            LAST_INSERT_ID());

-- FC-18 · Intervalo degenerado  (Basico)
INSERT INTO FLASHCARDS (integral, respuestaCorrecta, id_tema, id_dificultad, id_usuario, estado)
VALUES ('Cual es el valor de $\\int_a^a f(x) \\, dx$?', '0', 7, 1, 2, 'PUBLICADO');
INSERT INTO OPCIONES_RESPUESTA (contenidoRespuesta, esCorrecta, retroalimentacion, id_flashcard) VALUES
  ('0',          1, 'Correcto. Si los limites coinciden, el area tiene ancho cero: resultado = 0.', LAST_INSERT_ID()),
  ('f(a)',       0, 'La integral sobre un punto es 0, no el valor de la funcion.',                  LAST_INSERT_ID()),
  ('2f(a)',      0, 'Un intervalo de longitud cero siempre da integral 0.',                         LAST_INSERT_ID()),
  ('Indefinido', 0, 'La integral existe y vale 0 cuando los dos limites son iguales.',              LAST_INSERT_ID());

-- ================================================================
--  TEMA 8 · Integrales Numéricas  (id_tema=8)
-- ================================================================

-- FC-19 · Regla del Trapecio n=1  (Basico)
INSERT INTO FLASHCARDS (integral, respuestaCorrecta, id_tema, id_dificultad, id_usuario, estado)
VALUES ('Formula del Metodo del Trapecio para aproximar $\\int_a^b f(x)\\,dx$ con n=1', '\\frac{b-a}{2}[f(a)+f(b)]', 8, 1, 2, 'PUBLICADO');
INSERT INTO OPCIONES_RESPUESTA (contenidoRespuesta, esCorrecta, retroalimentacion, id_flashcard) VALUES
  ('\\frac{b-a}{2}[f(a)+f(b)]', 1, 'Correcto. Area del trapecio de base (b-a) y alturas f(a), f(b).', LAST_INSERT_ID()),
  ('(b-a)[f(a)+f(b)]',          0, 'Falta dividir entre 2; la formula del trapecio siempre lleva ese factor.', LAST_INSERT_ID()),
  ('\\frac{b-a}{4}[f(a)+f(b)]', 0, 'El denominador correcto es 2, no 4.',                              LAST_INSERT_ID()),
  ('\\frac{b-a}{2}[f(a)-f(b)]', 0, 'Las alturas se suman, no se restan.',                              LAST_INSERT_ID());

-- FC-20 · Regla de Simpson 1/3 n=2  (Intermedio)
INSERT INTO FLASHCARDS (integral, respuestaCorrecta, id_tema, id_dificultad, id_usuario, estado)
VALUES ('Formula de la Regla de Simpson 1/3 para aproximar $\\int_a^b f(x)\\,dx$ con n=2', '\\frac{b-a}{6}[f(a)+4f(m)+f(b)]  donde  m=\\frac{a+b}{2}', 8, 2, 2, 'PUBLICADO');
INSERT INTO OPCIONES_RESPUESTA (contenidoRespuesta, esCorrecta, retroalimentacion, id_flashcard) VALUES
  ('\\frac{b-a}{6}[f(a)+4f(m)+f(b)]', 1, 'Correcto. Simpson 1/3: (b-a)/6 * [f(a)+4f(m)+f(b)], m = punto medio.', LAST_INSERT_ID()),
  ('\\frac{b-a}{3}[f(a)+4f(m)+f(b)]', 0, 'El denominador debe ser 6, no 3.',                                       LAST_INSERT_ID()),
  ('\\frac{b-a}{6}[f(a)+2f(m)+f(b)]', 0, 'El coeficiente del punto medio es 4, no 2.',                             LAST_INSERT_ID()),
  ('\\frac{b-a}{4}[f(a)+f(m)+f(b)]',  0, 'Esa no es ninguna formula estandar de cuadratura.',                      LAST_INSERT_ID());

-- ================================================================
--  VERIFICACIÓN
-- ================================================================
SELECT COUNT(*) AS flashcards_insertadas
FROM   FLASHCARDS
WHERE  id_usuario = 2 AND estado = 'PUBLICADO';
