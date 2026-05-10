<?php
// ============================================================
//  MUUU APP · Controlador — Material
//  Rutas:
//    GET  /api/materiales       → listar (todos o del docente)
//    POST /api/materiales       → crear (solo docente)
//    GET  /api/docentes         → lista de docentes con flashcards publicadas
// ============================================================

require_once __DIR__ . '/../modelo/Material.php';
require_once __DIR__ . '/../modelo/Conexion.php';
require_once __DIR__ . '/../modelo/Notificacion.php';
require_once __DIR__ . '/../modelo/MailService.php';

class MaterialController
{
    // ── GET /api/materiales ───────────────────────────────────
    // ?docente=id  → filtra por ese docente (vista estudiante)
    public function listar(): void
    {
        session_start();

        $model = new Material();

        // Filtro por docente (para estudiante seleccionando un docente concreto)
        if (isset($_GET['docente']) && is_numeric($_GET['docente'])) {
            $materiales = $model->listarPublicosPorDocente((int) $_GET['docente']);
            echo json_encode(['ok' => true, 'materiales' => $materiales], JSON_UNESCAPED_UNICODE);
            return;
        }

        // Si el usuario es docente, devuelve sus propios materiales
        // Si es estudiante (o sin sesión), devuelve todos los materiales
        if (
            isset($_SESSION['id_usuario']) &&
            isset($_SESSION['rol']) &&
            $_SESSION['rol'] === 'DOCENTE'
        ) {
            $materiales = $model->listarPorDocente((int) $_SESSION['id_usuario']);
        } else {
            $materiales = $model->listarTodos();
        }

        echo json_encode([
            'ok'         => true,
            'materiales' => $materiales,
        ], JSON_UNESCAPED_UNICODE);
    }

    // ── GET /api/materiales/{id} ──────────────────────────────
    public function obtener(int $id): void
    {
        session_start();

        if (empty($_SESSION['id_usuario']) || ($_SESSION['rol'] ?? '') !== 'DOCENTE') {
            http_response_code(403);
            echo json_encode(['ok' => false, 'mensaje' => 'Acceso no autorizado.']);
            return;
        }

        $model    = new Material();
        $material = $model->buscarPorId($id);

        if (!$material || (int)$material['id_usuario'] !== (int)$_SESSION['id_usuario']) {
            http_response_code(404);
            echo json_encode(['ok' => false, 'mensaje' => 'Material no encontrado.']);
            return;
        }

        echo json_encode(['ok' => true, 'material' => $material], JSON_UNESCAPED_UNICODE);
    }

    // ── PUT /api/materiales/{id} ──────────────────────────────
    public function actualizar(int $id): void
    {
        session_start();

        if (empty($_SESSION['id_usuario']) || ($_SESSION['rol'] ?? '') !== 'DOCENTE') {
            http_response_code(403);
            echo json_encode(['ok' => false, 'mensaje' => 'Solo los docentes pueden editar materiales.']);
            return;
        }

        $model    = new Material();
        $existente = $model->buscarPorId($id);

        if (!$existente || (int)$existente['id_usuario'] !== (int)$_SESSION['id_usuario']) {
            http_response_code(404);
            echo json_encode(['ok' => false, 'mensaje' => 'Material no encontrado o sin permiso.']);
            return;
        }

        $body         = json_decode(file_get_contents('php://input'), true) ?? [];
        $titulo       = trim($body['titulo']       ?? '');
        $tipo         = trim($body['tipo']          ?? '');
        $urlArchivo   = trim($body['urlArchivo']    ?? $existente['urlArchivo']);
        $idTema       = (int)($body['id_tema']       ?? 0);
        $idDificultad = (int)($body['id_dificultad'] ?? 0);

        if (!$titulo || !$tipo || !$idTema || !$idDificultad) {
            http_response_code(422);
            echo json_encode(['ok' => false, 'mensaje' => 'Faltan campos obligatorios.']);
            return;
        }

        $mapaaTipo = ['documento' => 'PDF', 'foto' => 'IMAGEN', 'video' => 'VIDEO', 'link' => 'LINK'];
        $tipoDb    = $mapaaTipo[$tipo] ?? strtoupper($tipo);

        $model->actualizar($id, $titulo, $tipoDb, $urlArchivo, $idTema, $idDificultad);

        echo json_encode(['ok' => true, 'mensaje' => 'Material actualizado.'], JSON_UNESCAPED_UNICODE);
    }

    // ── DELETE /api/materiales/{id} ───────────────────────────
    public function eliminarMaterial(int $id): void
    {
        session_start();

        if (empty($_SESSION['id_usuario']) || ($_SESSION['rol'] ?? '') !== 'DOCENTE') {
            http_response_code(403);
            echo json_encode(['ok' => false, 'mensaje' => 'Solo los docentes pueden eliminar materiales.']);
            return;
        }

        $model    = new Material();
        $existente = $model->buscarPorId($id);

        if (!$existente || (int)$existente['id_usuario'] !== (int)$_SESSION['id_usuario']) {
            http_response_code(404);
            echo json_encode(['ok' => false, 'mensaje' => 'Material no encontrado o sin permiso.']);
            return;
        }

        $model->eliminar($id);
        echo json_encode(['ok' => true, 'mensaje' => 'Material eliminado.'], JSON_UNESCAPED_UNICODE);
    }

    // ── GET /api/docentes-materiales ──────────────────────────
    // Docentes que tienen al menos un material (para el selector del estudiante)
    public function listarDocentesMateriales(): void
    {
        $model    = new Material();
        $docentes = $model->listarDocentesConMateriales();
        echo json_encode(['ok' => true, 'docentes' => $docentes], JSON_UNESCAPED_UNICODE);
    }

    // ── POST /api/materiales ──────────────────────────────────
    public function crear(): void
    {
        session_start();

        if (empty($_SESSION['id_usuario']) || ($_SESSION['rol'] ?? '') !== 'DOCENTE') {
            http_response_code(403);
            echo json_encode(['ok' => false, 'mensaje' => 'Solo los docentes pueden subir material.']);
            return;
        }

        $body = json_decode(file_get_contents('php://input'), true) ?? [];

        $titulo       = trim($body['titulo']      ?? '');
        $tipo         = trim($body['tipo']         ?? '');
        $urlArchivo   = trim($body['urlArchivo']   ?? 'sin-archivo');
        $idTema       = (int)($body['id_tema']      ?? 0);
        $idDificultad = (int)($body['id_dificultad'] ?? 0);

        // Validaciones básicas
        if (!$titulo || !$tipo || !$idTema || !$idDificultad) {
            http_response_code(422);
            echo json_encode(['ok' => false, 'mensaje' => 'Faltan campos obligatorios (titulo, tipo, id_tema, id_dificultad).']);
            return;
        }

        // Mapear tipo frontend → tipo DB
        $tiposPermitidos = ['documento', 'foto', 'video', 'link', 'PDF', 'IMAGEN', 'VIDEO', 'LINK', 'RESUMEN'];
        if (!in_array($tipo, $tiposPermitidos, true)) {
            http_response_code(422);
            echo json_encode(['ok' => false, 'mensaje' => "Tipo de material no válido: {$tipo}"]);
            return;
        }

        // Normalizar: si viene en minúsculas del frontend, convertir a valor DB
        $mapaaTipo = [
            'documento' => 'PDF',
            'foto'      => 'IMAGEN',
            'video'     => 'VIDEO',
            'link'      => 'LINK',
        ];
        $tipoDb = $mapaaTipo[$tipo] ?? strtoupper($tipo);

        $model      = new Material();
        $idMaterial = $model->crear(
            $titulo,
            $tipoDb,
            $urlArchivo,
            $idTema,
            $idDificultad,
            (int) $_SESSION['id_usuario']
        );

        // ── Notificar a estudiantes suscritos ────────────────
        try {
            $modeloNotif = new Notificacion();
            $nombreDoc   = $_SESSION['nombre'] ?? 'El docente';
            $suscritos   = $modeloNotif->listarSuscritosPorDocente((int) $_SESSION['id_usuario']);
            foreach ($suscritos as $est) {
                // Notificación in-app
                $modeloNotif->insertar(
                    (int) $est['id_estudiante'],
                    'nuevo_material',
                    'Nuevo material disponible',
                    "{$nombreDoc} subió nuevo material: {$titulo}"
                );
                // Email
                MailService::nuevoMaterial(
                    correoEstudiante: $est['correo'],
                    nombreEstudiante: $est['nombre'],
                    nombreDocente:    $nombreDoc,
                    tituloMaterial:   $titulo
                );
            }
        } catch (Throwable) { /* silencioso */ }

        http_response_code(201);
        echo json_encode([
            'ok'         => true,
            'id_material' => $idMaterial,
            'mensaje'    => 'Material creado exitosamente.',
        ], JSON_UNESCAPED_UNICODE);
    }

    // ── POST /api/materiales/{id}/acceso ─────────────────────
    public function registrarAcceso(int $id): void
    {
        session_start();
        if (empty($_SESSION['id_usuario'])) {
            http_response_code(401);
            echo json_encode(['ok' => false]);
            return;
        }

        $model    = new Material();
        $material = $model->buscarPorId($id);
        if (!$material) {
            http_response_code(404);
            echo json_encode(['ok' => false]);
            return;
        }

        try {
            $nombreEst = $_SESSION['nombre'] ?? 'Un estudiante';
            $idDocente = (int) $material['id_usuario'];
            (new Notificacion())->insertar(
                $idDocente,
                'acceso_material',
                'Material consultado',
                "{$nombreEst} accedió al material \"{$material['titulo']}\""
            );
        } catch (Throwable) { /* silencioso */ }

        http_response_code(200);
        echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
    }

    // ── POST /api/materiales/{id}/descarga ────────────────────
    public function registrarDescarga(int $id): void
    {
        session_start();
        if (empty($_SESSION['id_usuario'])) {
            http_response_code(401);
            echo json_encode(['ok' => false]);
            return;
        }

        $model    = new Material();
        $material = $model->buscarPorId($id);
        if (!$material) {
            http_response_code(404);
            echo json_encode(['ok' => false]);
            return;
        }

        try {
            $nombreEst = $_SESSION['nombre'] ?? 'Un estudiante';
            $idDocente = (int) $material['id_usuario'];
            (new Notificacion())->insertar(
                $idDocente,
                'descarga_material',
                'Material descargado',
                "{$nombreEst} descargó el material \"{$material['titulo']}\""
            );
        } catch (Throwable) { /* silencioso */ }

        http_response_code(200);
        echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
    }

    // ── GET /api/docentes ─────────────────────────────────────
    // Devuelve docentes que tienen flashcards publicadas,
    // incluyendo totalSuscritos y esSuscrito (si hay sesión de estudiante).
    public function listarDocentes(): void
    {
        session_start();

        $db = Conexion::obtener();

        // Detectar si hay un estudiante en sesión para personalizar esSuscrito
        $idEstudiante = null;
        if (
            isset($_SESSION['id_usuario'], $_SESSION['rol']) &&
            $_SESSION['rol'] === 'ESTUDIANTE'
        ) {
            $idEstudiante = (int) $_SESSION['id_usuario'];
        }

        $sql = "SELECT u.id_usuario,
                       u.nombre,
                       u.fotoPerfil,
                       COUNT(DISTINCT f.id_flashcard) AS totalFlashcards,
                       GROUP_CONCAT(DISTINCT t.nombre ORDER BY t.nombre SEPARATOR '|||') AS temas,
                       (SELECT COUNT(*) FROM SUSCRIPCION
                        WHERE id_docente = u.id_usuario) AS totalSuscritos,
                       " . ($idEstudiante !== null
                           ? "(SELECT COUNT(*) FROM SUSCRIPCION
                              WHERE id_docente = u.id_usuario
                                AND id_estudiante = :idEstudiante) AS esSuscrito"
                           : "0 AS esSuscrito") . "
                FROM   USUARIO    u
                JOIN   ROL        r ON r.id_rol     = u.id_rol
                JOIN   FLASHCARDS f ON f.id_usuario = u.id_usuario
                                   AND f.estado     = 'PUBLICADO'
                LEFT   JOIN TEMA  t ON t.id_tema    = f.id_tema
                WHERE  r.nombre = 'DOCENTE'
                GROUP  BY u.id_usuario, u.nombre, u.fotoPerfil
                ORDER  BY totalFlashcards DESC";

        $stmt = $db->prepare($sql);
        if ($idEstudiante !== null) {
            $stmt->bindValue(':idEstudiante', $idEstudiante, PDO::PARAM_INT);
        }

        $stmt->execute();
        $raw      = $stmt->fetchAll();
        $docentes = array_map(function (array $d): array {
            $temas = $d['temas']
                ? array_values(array_filter(explode('|||', $d['temas'])))
                : [];
            return [
                'id_usuario'      => (int)  $d['id_usuario'],
                'nombre'          =>        $d['nombre'],
                'fotoPerfil'      =>        $d['fotoPerfil'],
                'totalFlashcards' => (int)  $d['totalFlashcards'],
                'temas'           =>        $temas,
                'totalSuscritos'  => (int)  $d['totalSuscritos'],
                'esSuscrito'      => (bool) $d['esSuscrito'],
            ];
        }, $raw);

        echo json_encode([
            'ok'       => true,
            'docentes' => $docentes,
        ], JSON_UNESCAPED_UNICODE);
    }
}
