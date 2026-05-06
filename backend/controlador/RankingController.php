<?php
// ============================================================
//  MUUU APP · Controlador — Ranking / Quiz / Estadísticas
//
//  Rutas:
//    GET  /api/ranking                     → listar()
//    POST /api/quiz/resultado               → guardarResultado()
//    GET  /api/estadisticas/estudiante      → estadisticasEstudiante()
//    GET  /api/estadisticas/docente         → estadisticasDocente()
// ============================================================

require_once __DIR__ . '/../modelo/Ranking.php';
require_once __DIR__ . '/../modelo/HistorialFlashcard.php';
require_once __DIR__ . '/../modelo/Conexion.php';

class RankingController
{
    // ── GET /api/ranking ─────────────────────────────────────
    public function listar(): void
    {
        $modelo      = new Ranking();
        $estudiantes = $modelo->listarTop(20);

        $resultado = [];
        foreach ($estudiantes as $i => $est) {
            $pos = $i + 1;
            $resultado[] = [
                'id'         => (int) $est['id_usuario'],
                'nombre'     => $est['nombre'],
                'fotoPerfil' => $est['fotoPerfil'],
                'puntos'     => (int) $est['puntos'],
                'nivel'      => (int) $est['nivel'],
                'posicion'   => $pos,
                'medalla'    => match (true) {
                    $pos === 1 => 'oro',
                    $pos === 2 => 'plata',
                    $pos === 3 => 'bronce',
                    default    => null,
                },
            ];
        }

        echo json_encode(['ok' => true, 'estudiantes' => $resultado]);
    }

    // ── POST /api/quiz/resultado ─────────────────────────────
    public function guardarResultado(): void
    {
        session_start();
        if (empty($_SESSION['id_usuario'])) {
            http_response_code(401);
            echo json_encode(['ok' => false, 'error' => 'No autenticado']);
            return;
        }

        $body        = json_decode(file_get_contents('php://input'), true) ?? [];
        $flashcards  = $body['flashcards']   ?? [];   // [{id_flashcard, resultado}]
        $correctas   = max(0, (int)($body['correctas']   ?? 0));

        $idUsuario = (int) $_SESSION['id_usuario'];

        // Persistir historial por flashcard
        $historialGuardado = 0;
        $erroresHistorial  = [];
        if (!empty($flashcards)) {
            $historial = new HistorialFlashcard();
            foreach ($flashcards as $fc) {
                $fcId = (int)($fc['id_flashcard'] ?? 0);
                if ($fcId > 0) {
                    $res = ($fc['resultado'] ?? '') === 'correcta' ? 'correcta' : 'incorrecta';
                    try {
                        $historial->insertar($idUsuario, $fcId, $res);
                        $historialGuardado++;
                    } catch (Throwable $e) {
                        $erroresHistorial[] = "fc#{$fcId}: " . $e->getMessage();
                    }
                }
            }
        }

        // 10 puntos por respuesta correcta
        $puntosGanados = $correctas * 10;
        if ($puntosGanados > 0) {
            $ranking = new Ranking();
            $ranking->sumarPuntos($idUsuario, $puntosGanados);
        }

        // ── Actualizar racha de actividad diaria ─────────────
        try {
            $db   = Conexion::obtener();
            $stmt = $db->prepare(
                'SELECT rachaActual, fechaUltimaActividad FROM USUARIO WHERE id_usuario = ?'
            );
            $stmt->execute([$idUsuario]);
            $u = $stmt->fetch();

            $hoy   = date('Y-m-d');
            $ayer  = date('Y-m-d', strtotime('-1 day'));
            $ultima = $u ? ($u['fechaUltimaActividad'] ?? null) : null;
            $racha  = $u ? max(0, (int)($u['rachaActual'] ?? 0)) : 0;

            if ($ultima === null || $ultima < $ayer) {
                // Primera vez o racha rota (más de un día sin actividad)
                $nuevaRacha = 1;
            } elseif ($ultima === $ayer) {
                // Hizo quiz ayer → incrementar
                $nuevaRacha = $racha + 1;
            } else {
                // Ya hizo quiz hoy → mantener racha actual
                $nuevaRacha = $racha;
            }

            // Solo escribir si cambió la fecha o la racha
            if ($ultima !== $hoy || $nuevaRacha !== $racha) {
                $db->prepare(
                    'UPDATE USUARIO SET rachaActual = ?, fechaUltimaActividad = ? WHERE id_usuario = ?'
                )->execute([$nuevaRacha, $hoy, $idUsuario]);
            }
        } catch (Throwable) { /* no bloquear si falla la racha */ }

        echo json_encode([
            'ok'               => true,
            'puntosGanados'    => $puntosGanados,
            'historialGuardado'=> $historialGuardado,
            'flashcardsEnviadas'=> count($flashcards),
            'errores'          => $erroresHistorial,
        ]);
    }

    // ── GET /api/estadisticas/estudiante ─────────────────────
    public function estadisticasEstudiante(): void
    {
        session_start();
        if (empty($_SESSION['id_usuario'])) {
            http_response_code(401);
            echo json_encode(['ok' => false, 'error' => 'No autenticado']);
            return;
        }

        $idUsuario = (int) $_SESSION['id_usuario'];
        $historial = new HistorialFlashcard();
        try {
            $porTema = $historial->estadisticasPorTema($idUsuario);
        } catch (Throwable) {
            $porTema = [];
        }

        $temasData = [];
        foreach ($porTema as $t) {
            $total     = (int) $t['total'];
            $correctas = (int) $t['correctas'];
            $progreso  = $total > 0 ? (int) round(($correctas / $total) * 100) : 0;
            $temasData[] = [
                'tema'      => $t['tema'],
                'total'     => $total,
                'correctas' => $correctas,
                'progreso'  => $progreso,
            ];
        }

        echo json_encode(['ok' => true, 'data' => ['porTema' => $temasData]]);
    }

    // ── GET /api/estadisticas/docente ────────────────────────
    public function estadisticasDocente(): void
    {
        session_start();
        if (empty($_SESSION['id_usuario'])) {
            http_response_code(401);
            echo json_encode(['ok' => false, 'error' => 'No autenticado']);
            return;
        }

        $idDocente = (int) $_SESSION['id_usuario'];
        $db        = Conexion::obtener();

        // Flashcards publicadas
        $stmt = $db->prepare('SELECT COUNT(*) FROM FLASHCARDS WHERE id_usuario = ? AND estado = "PUBLICADO"');
        $stmt->execute([$idDocente]);
        $flashcardsPublicadas = (int) $stmt->fetchColumn();

        // Suscriptores
        $stmt = $db->prepare('SELECT COUNT(*) FROM SUSCRIPCION WHERE id_docente = ?');
        $stmt->execute([$idDocente]);
        $suscriptores = (int) $stmt->fetchColumn();

        // Materiales subidos
        $stmt = $db->prepare('SELECT COUNT(*) FROM MATERIAL WHERE id_usuario = ?');
        $stmt->execute([$idDocente]);
        $materiales = (int) $stmt->fetchColumn();

        // Accesos (notificaciones tipo acceso_material hacia el docente)
        $accesos = 0;
        $descargas = 0;
        try {
            $stmt = $db->prepare('SELECT COUNT(*) FROM NOTIFICACION WHERE id_usuario = ? AND tipo = "acceso_material"');
            $stmt->execute([$idDocente]);
            $accesos = (int) $stmt->fetchColumn();

            $stmt = $db->prepare('SELECT COUNT(*) FROM NOTIFICACION WHERE id_usuario = ? AND tipo = "descarga_material"');
            $stmt->execute([$idDocente]);
            $descargas = (int) $stmt->fetchColumn();
        } catch (Throwable) { /* NOTIFICACION puede no existir aún */ }

        // Tasa de aciertos global: % de respuestas correctas de estudiantes
        // sobre TODAS las flashcards de este docente
        $tasaAciertos = 0;
        try {
            $stmt = $db->prepare(
                "SELECT COUNT(*)                                    AS total,
                        COALESCE(SUM(h.resultado = 'correcta'), 0) AS correctas
                 FROM   HISTORIAL_FLASHCARD h
                 JOIN   FLASHCARDS f ON f.id_flashcard = h.id_flashcard
                 WHERE  f.id_usuario = ?"
            );
            $stmt->execute([$idDocente]);
            $fila = $stmt->fetch();
            $total     = (int) $fila['total'];
            $correctas = (int) $fila['correctas'];
            $tasaAciertos = $total > 0 ? (int) round(($correctas / $total) * 100) : 0;
        } catch (Throwable) {}

        // Top 5 flashcards más estudiadas del docente (con tasa de aciertos por flashcard)
        $topFlashcards = [];
        try {
            $stmt = $db->prepare(
                "SELECT f.integral,
                        t.nombre                                    AS tema,
                        COUNT(*)                                    AS veces,
                        COALESCE(SUM(h.resultado = 'correcta'), 0) AS correctas_fc
                 FROM   HISTORIAL_FLASHCARD h
                 JOIN   FLASHCARDS f ON f.id_flashcard = h.id_flashcard
                 JOIN   TEMA       t ON t.id_tema      = f.id_tema
                 WHERE  f.id_usuario = ?
                 GROUP  BY f.id_flashcard
                 ORDER  BY veces DESC
                 LIMIT  5"
            );
            $stmt->execute([$idDocente]);
            foreach ($stmt->fetchAll() as $r) {
                $v = (int) $r['veces'];
                $c = (int) $r['correctas_fc'];
                $topFlashcards[] = [
                    'integral'       => $r['integral'],
                    'tema'           => $r['tema'],
                    'vecesEstudiada' => $v,
                    'tasaAciertos'   => $v > 0 ? (int) round(($c / $v) * 100) : 0,
                ];
            }
        } catch (Throwable) {}

        echo json_encode([
            'ok'   => true,
            'data' => [
                'flashcardsPublicadas' => $flashcardsPublicadas,
                'suscriptores'         => $suscriptores,
                'materiales'           => $materiales,
                'accesos'              => $accesos,
                'descargas'            => $descargas,
                'tasaAciertos'         => $tasaAciertos,
                'topFlashcards'        => $topFlashcards,
            ],
        ]);
    }
}
