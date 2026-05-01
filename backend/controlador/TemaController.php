<?php
// ============================================================
//  MUUU APP · Controlador — Tema
//  Gestión de categorías (temas) por el docente.
//
//  Rutas:
//    GET    /api/temas-estadisticas  → listarConEstadisticas (autenticado)
//    POST   /api/temas               → crear        (solo docente)
//    DELETE /api/temas/{id}          → eliminar     (solo docente, sin vínculos, no-sistema)
// ============================================================

require_once __DIR__ . '/../modelo/Tema.php';
require_once __DIR__ . '/../modelo/Conexion.php';

class TemaController
{
    // Sesión iniciada (igual que el resto de controladores del proyecto)
    private function iniciarSesion(): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    private function requireAuth(): void
    {
        $this->iniciarSesion();
        if (empty($_SESSION['id_usuario'])) {
            http_response_code(401);
            echo json_encode(['ok' => false, 'mensaje' => 'No hay sesión activa.'], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }

    private function requireDocente(): void
    {
        $this->requireAuth();
        if (($_SESSION['rol'] ?? '') !== 'DOCENTE') {
            http_response_code(403);
            echo json_encode(['ok' => false, 'mensaje' => 'Acceso solo para docentes.'], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }

    // GET /api/temas-estadisticas  (cualquier usuario autenticado)
    public function listarConEstadisticas(): void
    {
        $this->requireAuth();
        $modelo = new Tema();
        $temas  = $modelo->listarConEstadisticas();

        echo json_encode([
            'ok'    => true,
            'temas' => array_map(fn($t) => [
                'id_tema'         => (int) $t['id_tema'],
                'nombre'          => $t['nombre'],
                'descripcion'     => $t['descripcion'],
                'icono'           => $t['icono'],
                'totalFlashcards' => (int) $t['totalFlashcards'],
                'totalMateriales' => (int) $t['totalMateriales'],
                'esSistema'       => (bool) $t['esSistema'],
            ], $temas),
        ], JSON_UNESCAPED_UNICODE);
    }

    // POST /api/temas  (solo docente)
    public function crear(): void
    {
        $this->requireDocente();

        $body        = json_decode(file_get_contents('php://input'), true) ?? [];
        $nombre      = trim($body['nombre']      ?? '');
        $descripcion = trim($body['descripcion'] ?? '') ?: null;
        $icono       = trim($body['icono']       ?? '') ?: null;

        if ($nombre === '') {
            http_response_code(422);
            echo json_encode(['ok' => false, 'mensaje' => 'El nombre del tema es obligatorio.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $modelo  = new Tema();
        $id_tema = $modelo->crear($nombre, $descripcion, $icono);
        $creado  = $modelo->buscarPorId($id_tema);

        http_response_code(201);
        echo json_encode([
            'ok'     => true,
            'tema'   => [
                'id_tema'         => (int) $creado['id_tema'],
                'nombre'          => $creado['nombre'],
                'descripcion'     => $creado['descripcion'],
                'icono'           => $creado['icono'],
                'totalFlashcards' => 0,
                'totalMateriales' => 0,
                'esSistema'       => false,
            ],
            'mensaje' => 'Tema creado correctamente.',
        ], JSON_UNESCAPED_UNICODE);
    }

    // DELETE /api/temas/{id}  (solo docente, no-sistema, sin recursos vinculados)
    public function eliminar(int $id): void
    {
        $this->requireDocente();

        $modelo = new Tema();
        $tema   = $modelo->buscarPorId($id);

        if (!$tema) {
            http_response_code(404);
            echo json_encode(['ok' => false, 'mensaje' => 'Tema no encontrado.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        // Temas del sistema: no se pueden borrar
        if (!empty($tema['esSistema'])) {
            http_response_code(403);
            echo json_encode([
                'ok'      => false,
                'mensaje' => 'Este tema es del sistema y no puede eliminarse.',
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        $vinculos = $modelo->contarVinculos($id);
        if ($vinculos > 0) {
            http_response_code(409);
            echo json_encode([
                'ok'       => false,
                'mensaje'  => "Este tema tiene {$vinculos} recurso(s) vinculado(s). Cambia la categoría de esas flashcards o documentos antes de eliminarlo.",
                'vinculos' => $vinculos,
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        $modelo->eliminar($id);
        echo json_encode(['ok' => true, 'mensaje' => 'Tema eliminado correctamente.'], JSON_UNESCAPED_UNICODE);
    }
}
