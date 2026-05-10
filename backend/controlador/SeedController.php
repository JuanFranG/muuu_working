<?php
// ============================================================
//  MUUU · Seed temporal — 20 flashcards para docente@muuu.com
//  ELIMINAR este archivo tras correr el seed.
//  Acceso: GET /api/seed?key=muuu_seed_2024
// ============================================================

require_once __DIR__ . '/../modelo/Conexion.php';

class SeedController
{
    public function seed(): void
    {
        // Clave de seguridad mínima
        if (($_GET['key'] ?? '') !== 'muuu_seed_2024') {
            http_response_code(403);
            echo json_encode(['ok' => false, 'mensaje' => 'Unauthorized']);
            return;
        }

        $db = Conexion::obtener();
        $insertados = 0;

        // ── Tema 8: Integrales Numéricas ───────────────────────
        $db->exec(
            "INSERT IGNORE INTO TEMA (nombre, descripcion, icono)
             VALUES ('Integrales Numericas', 'Metodos numericos de integracion', '🧮')"
        );
        $t8 = (int) $db->query(
            "SELECT id_tema FROM TEMA WHERE nombre = 'Integrales Numericas' LIMIT 1"
        )->fetchColumn();

        // ── Datos de las 20 flashcards ─────────────────────────
        // Formato: [integral, respuestaCorrecta, id_tema, id_dificultad, opciones[]]
        // opciones: [contenido, esCorrecta, retroalimentacion]
        $flashcards = [

            // ── TEMA 1 — Integrales Inmediatas ─────────────────
            [
                '\\int x^n \\, dx \\quad (n \\neq -1)',
                '\\frac{x^{n+1}}{n+1} + C',
                1, 1,
                [
                    ['\\frac{x^{n+1}}{n+1} + C', 1, 'Correcto. Se aumenta el exponente en 1 y se divide entre ese nuevo valor.'],
                    ['x^{n+1} + C',               0, 'Falta dividir entre (n+1). La regla completa es x^{n+1}/(n+1) + C.'],
                    ['nx^{n-1} + C',              0, 'Eso es la derivada de x^n, no su integral.'],
                    ['\\frac{x^n}{n} + C',        0, 'El exponente debe aumentar en 1; aqui no cambia.'],
                ],
            ],
            [
                '\\int e^x \\, dx',
                'e^x + C',
                1, 1,
                [
                    ['e^x + C',          1, 'Correcto. La funcion e^x es su propia integral.'],
                    ['e^{x+1} + C',      0, 'No se suma 1 al exponente en e^x; eso solo aplica a x^n.'],
                    ['xe^x + C',         0, 'Ese resultado requiere integracion por partes.'],
                    ['\\frac{e^x}{x}+C', 0, 'No se divide e^x entre x al integrar.'],
                ],
            ],
            [
                '\\int \\frac{1}{x} \\, dx',
                '\\ln|x| + C',
                1, 1,
                [
                    ['\\ln|x| + C',         1, 'Correcto. El valor absoluto es necesario porque ln solo acepta positivos.'],
                    ['\\frac{-1}{x^2} + C', 0, 'Eso es la derivada de 1/x con signo, no su integral.'],
                    ['\\ln(x^2) + C',       0, 'ln(x^2) = 2ln|x|; le sobra el factor 2.'],
                    ['\\frac{x^0}{0} + C',  0, 'Division por cero. Por eso la regla de la potencia no aplica para n=-1.'],
                ],
            ],
            [
                '\\int \\cos(x) \\, dx',
                '\\sin(x) + C',
                1, 1,
                [
                    ['\\sin(x) + C',  1, 'Correcto. La integral de cos(x) es sin(x) + C.'],
                    ['-\\sin(x) + C', 0, 'Eso es la derivada de -cos(x), no la integral de cos(x).'],
                    ['-\\cos(x) + C', 0, '-cos(x) es la integral de sin(x), no de cos(x).'],
                    ['\\tan(x) + C',  0, 'tan(x) es la integral de sec^2(x), no de cos(x).'],
                ],
            ],

            // ── TEMA 2 — Integracion por Partes ────────────────
            [
                '\\int x e^x \\, dx',
                'e^x(x-1) + C',
                2, 2,
                [
                    ['e^x(x-1) + C',          1, 'Correcto. ILATE: u=x, dv=e^x dx -> xe^x - e^x + C.'],
                    ['xe^x + C',              0, 'Falta restar la integral de v du. El resultado es xe^x - e^x.'],
                    ['e^x(x+1) + C',          0, 'El signo del segundo termino debe ser negativo.'],
                    ['\\frac{x^2}{2}e^x + C', 0, 'Integrar e^x no produce x^2/2.'],
                ],
            ],
            [
                '\\int x \\ln(x) \\, dx',
                '\\frac{x^2}{2}\\ln(x) - \\frac{x^2}{4} + C',
                2, 2,
                [
                    ['\\frac{x^2}{2}\\ln(x) - \\frac{x^2}{4} + C', 1, 'Correcto. ILATE: u=ln(x), dv=x dx -> x^2/2 ln(x) - x^2/4.'],
                    ['\\frac{x^2}{2}\\ln(x) + \\frac{x^2}{4} + C', 0, 'El signo del segundo termino debe ser negativo.'],
                    ['x\\ln(x) - x + C',                            0, 'Esa es la integral de ln(x), no de x*ln(x).'],
                    ['\\frac{x^2 \\ln(x)}{4} + C',                  0, 'Falta el termino generado al resolver la segunda integral.'],
                ],
            ],
            [
                '\\int e^x \\sin(x) \\, dx',
                '\\frac{e^x(\\sin(x)-\\cos(x))}{2} + C',
                2, 3,
                [
                    ['\\frac{e^x(\\sin(x)-\\cos(x))}{2} + C', 1, 'Correcto. Dos partes ciclicas: 2I = e^x(sin-cos) -> I = e^x(sin-cos)/2.'],
                    ['\\frac{e^x(\\sin(x)+\\cos(x))}{2} + C', 0, 'El signo entre sin y cos debe ser negativo.'],
                    ['e^x \\cos(x) + C',                      0, 'No es suficiente con una sola integracion por partes.'],
                    ['e^x(\\sin(x)-\\cos(x)) + C',            0, 'Falta dividir entre 2 al despejar I de la ecuacion ciclica.'],
                ],
            ],

            // ── TEMA 3 — Sustitucion Trigonometrica ────────────
            [
                '\\int \\frac{1}{\\sqrt{1-x^2}} \\, dx',
                'arcsin(x) + C',
                3, 2,
                [
                    ['arcsin(x) + C',       1, 'Correcto. Sustitucion x=sin(t): integral de dt = arcsin(x) + C.'],
                    ['arctan(x) + C',       0, 'arctan surge de 1/(1+x^2), no de 1/sqrt(1-x^2).'],
                    ['arccos(x) + C',       0, 'La derivada de arccos es -1/sqrt(1-x^2); hay un signo de diferencia.'],
                    ['\\sqrt{1-x^2} + C',   0, 'Derivar sqrt(1-x^2) da -x/sqrt(1-x^2), no 1/sqrt(1-x^2).'],
                ],
            ],
            [
                '\\int \\frac{1}{1+x^2} \\, dx',
                'arctan(x) + C',
                3, 1,
                [
                    ['arctan(x) + C',          1, 'Correcto. Formula directa: integral de 1/(1+x^2) = arctan(x) + C.'],
                    ['arcsin(x) + C',           0, 'arcsin(x) es la integral de 1/sqrt(1-x^2), no de 1/(1+x^2).'],
                    ['\\ln(1+x^2) + C',         0, 'Para ln necesitarias 2x en el numerador.'],
                    ['\\frac{1}{(1+x^2)^2}+C',  0, 'Eso seria integrar nuevamente, no el resultado de una integracion.'],
                ],
            ],
            [
                '\\int \\frac{1}{\\sqrt{a^2-x^2}} \\, dx \\quad (a>0)',
                'arcsin(x/a) + C',
                3, 3,
                [
                    ['arcsin(x/a) + C',                  1, 'Correcto. Sustitucion x=a*sin(t) lleva a integral de dt = arcsin(x/a).'],
                    ['arctan(x/a) + C',                  0, 'arctan(x/a) es la integral de 1/(a^2+x^2), no de 1/sqrt(a^2-x^2).'],
                    ['\\frac{1}{a} arcsin(x) + C',       0, 'Falta dividir el argumento (no el coeficiente) entre a.'],
                    ['\\frac{x}{a\\sqrt{a^2-x^2}} + C',  0, 'Esa es la derivada de arcsin(x/a), no la integral.'],
                ],
            ],

            // ── TEMA 4 — Fracciones Parciales ──────────────────
            [
                '\\int \\frac{1}{x^2-1} \\, dx',
                '\\frac{1}{2}\\ln|\\frac{x-1}{x+1}| + C',
                4, 2,
                [
                    ['\\frac{1}{2}\\ln|\\frac{x-1}{x+1}|+C', 1, 'Correcto. Fracciones parciales: 1/(x^2-1) = (1/2)/(x-1) - (1/2)/(x+1).'],
                    ['\\ln|x^2-1| + C',                       0, 'Para eso el numerador tendria que ser 2x.'],
                    ['\\frac{1}{2}\\ln|x^2-1| + C',           0, 'Falta separar en factores lineales correctamente.'],
                    ['arctan(x) + C',                          0, 'arctan surge de 1/(1+x^2); aqui el denominador es x^2-1.'],
                ],
            ],
            [
                '\\int \\frac{2x}{x^2+3x+2} \\, dx',
                '-2\\ln|x+1| + 4\\ln|x+2| + C',
                4, 3,
                [
                    ['-2\\ln|x+1| + 4\\ln|x+2| + C', 1, 'Correcto. (x+1)(x+2): fracciones parciales dan A=-2, B=4.'],
                    ['4\\ln|x+1| - 2\\ln|x+2| + C',  0, 'Los coeficientes estan invertidos.'],
                    ['\\ln|x^2+3x+2| + C',           0, 'Para eso el numerador seria 2x+3 (derivada del denominador).'],
                    ['2\\ln|x^2+3x+2| + C',          0, 'No se puede integrar directamente; hay que descomponer.'],
                ],
            ],

            // ── TEMA 5 — Identidades Trig Reduccion ────────────
            [
                '\\int \\sin^2(x) \\, dx',
                '\\frac{x}{2} - \\frac{\\sin(2x)}{4} + C',
                5, 2,
                [
                    ['\\frac{x}{2} - \\frac{\\sin(2x)}{4} + C', 1, 'Correcto. Identidad: sin^2(x) = (1-cos(2x))/2.'],
                    ['\\frac{x}{2} + \\frac{\\sin(2x)}{4} + C', 0, 'El signo es negativo porque viene de (1-cos(2x))/2.'],
                    ['-\\sin(x)\\cos(x) + C',                    0, '-sin(x)cos(x) = -sin(2x)/2, difiere del resultado.'],
                    ['\\frac{\\sin^3(x)}{3} + C',                0, 'Elevar al cubo seria para la integral de sin^2(x)*cos(x).'],
                ],
            ],
            [
                '\\int \\sin^3(x) \\, dx',
                '-\\cos(x) + \\frac{\\cos^3(x)}{3} + C',
                5, 2,
                [
                    ['-\\cos(x) + \\frac{\\cos^3(x)}{3} + C', 1, 'Correcto. sin^3 = sin(1-cos^2); u=cos(x) da -u + u^3/3.'],
                    ['\\cos(x) - \\frac{\\cos^3(x)}{3} + C',  0, 'Los signos estan invertidos.'],
                    ['-\\frac{\\cos^3(x)}{3} + C',             0, 'Falta el termino -cos(x) de integrar sin(x).'],
                    ['\\frac{\\sin^4(x)}{4} + C',              0, 'Esa formula requiere cos(x) en el diferencial.'],
                ],
            ],

            // ── TEMA 6 — Teorema Fundamental del Calculo ───────
            [
                'Si $F(x) = \\int_0^x t^2 \\, dt$, cual es la derivada $F\'(x)$?',
                'x^2',
                6, 1,
                [
                    ['x^2',            1, "Correcto. TFC Parte 1: si F(x) = integral de f(t)dt entonces F'(x) = f(x) = x^2."],
                    ['\\frac{x^3}{3}', 0, 'Eso es F(x) misma, no su derivada.'],
                    ['2x',             0, 'Eso seria la derivada de x^2, no de la integral de t^2.'],
                    ['t^2',            0, 'La variable t se reemplaza por el limite superior x al derivar.'],
                ],
            ],
            [
                '\\int_1^3 (2x+1) \\, dx',
                '10',
                6, 1,
                [
                    ['10', 1, 'Correcto. Antiderivada x^2+x. Evaluar: (9+3)-(1+1) = 12-2 = 10.'],
                    ['8',  0, 'Verifica: F(3)=12, F(1)=2, diferencia = 10.'],
                    ['12', 0, 'Solo evaluaste F(3); debes restar F(1) = 2.'],
                    ['14', 0, 'Revisa la antiderivada de 2x+1: es x^2+x, no x^2+2x.'],
                ],
            ],

            // ── TEMA 7 — Propiedades Integral Definida ─────────
            [
                'Si $\\int_a^b f(x)\\,dx$ = 5 y $\\int_a^b g(x)\\,dx$ = 3, cuanto vale $\\int_a^b [2f(x)+g(x)]\\,dx$?',
                '13',
                7, 1,
                [
                    ['13', 1, 'Correcto. Linealidad: 2*5 + 1*3 = 13.'],
                    ['16', 0, 'Serian 2*(5+3)=16 solo si ambas tuvieran coeficiente 2.'],
                    ['8',  0, 'Eso seria solo 5+3 sin aplicar el coeficiente 2.'],
                    ['11', 0, 'Verifica: 2*5 + 1*3 = 10 + 3 = 13.'],
                ],
            ],
            [
                'Cual es el valor de $\\int_a^a f(x) \\, dx$?',
                '0',
                7, 1,
                [
                    ['0',          1, 'Correcto. Si los limites coinciden, el area tiene ancho cero: resultado = 0.'],
                    ['f(a)',       0, 'La integral sobre un punto es 0, no el valor de la funcion.'],
                    ['2f(a)',      0, 'Un intervalo de longitud cero siempre da integral 0.'],
                    ['Indefinido', 0, 'La integral existe y vale 0 cuando los dos limites son iguales.'],
                ],
            ],

            // ── TEMA 8 — Integrales Numéricas ──────────────────
            [
                'Formula del Metodo del Trapecio para aproximar $\\int_a^b f(x)\\,dx$ con n=1',
                '\\frac{b-a}{2}[f(a)+f(b)]',
                $t8, 1,
                [
                    ['\\frac{b-a}{2}[f(a)+f(b)]', 1, 'Correcto. Area del trapecio de base (b-a) y alturas f(a), f(b).'],
                    ['(b-a)[f(a)+f(b)]',           0, 'Falta dividir entre 2; la formula siempre lleva ese factor.'],
                    ['\\frac{b-a}{4}[f(a)+f(b)]',  0, 'El denominador correcto es 2, no 4.'],
                    ['\\frac{b-a}{2}[f(a)-f(b)]',  0, 'Las alturas se suman, no se restan.'],
                ],
            ],
            [
                'Formula de la Regla de Simpson 1/3 para aproximar $\\int_a^b f(x)\\,dx$ con n=2',
                '\\frac{b-a}{6}[f(a) + 4f(m) + f(b)]  donde  m = \\frac{a+b}{2}',
                $t8, 2,
                [
                    ['\\frac{b-a}{6}[f(a)+4f(m)+f(b)]', 1, 'Correcto. Simpson 1/3: (b-a)/6 * [f(a) + 4f(m) + f(b)], m = punto medio.'],
                    ['\\frac{b-a}{3}[f(a)+4f(m)+f(b)]', 0, 'El denominador debe ser 6, no 3.'],
                    ['\\frac{b-a}{6}[f(a)+2f(m)+f(b)]', 0, 'El coeficiente del punto medio es 4, no 2.'],
                    ['\\frac{b-a}{4}[f(a)+f(m)+f(b)]',  0, 'Esa no es ninguna formula estandar de cuadratura.'],
                ],
            ],
        ];

        // ── Insertar flashcards con sus opciones ───────────────
        $stmtFC = $db->prepare(
            'INSERT INTO FLASHCARDS
               (integral, respuestaCorrecta, id_tema, id_dificultad, id_usuario, estado)
             VALUES (?, ?, ?, ?, 2, "PUBLICADO")'
        );

        $stmtOpc = $db->prepare(
            'INSERT INTO OPCIONES_RESPUESTA
               (contenidoRespuesta, esCorrecta, retroalimentacion, id_flashcard)
             VALUES (?, ?, ?, ?)'
        );

        foreach ($flashcards as $fc) {
            [$integral, $respuesta, $idTema, $idDificultad, $opciones] = $fc;

            $stmtFC->execute([$integral, $respuesta, $idTema, $idDificultad]);
            $idFC = (int) $db->lastInsertId();
            $insertados++;

            foreach ($opciones as [$contenido, $esCorrecta, $retro]) {
                $stmtOpc->execute([$contenido, $esCorrecta, $retro, $idFC]);
            }
        }

        echo json_encode([
            'ok'          => true,
            'flashcards'  => $insertados,
            'tema8_id'    => $t8,
            'mensaje'     => "Se insertaron {$insertados} flashcards para docente@muuu.com.",
        ], JSON_UNESCAPED_UNICODE);
    }

}
