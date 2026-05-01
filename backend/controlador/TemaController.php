<?php
// ============================================================
//  MUUU APP · Controlador — Tema
//  Gestión de categorías (temas) por el docente.
//
//  Rutas:
//    GET    /api/temas-estadisticas  → listar con conteos
//    POST   /api/temas               → crear
//    DELETE /api/temas/{id}          → eliminar (si no tiene vínculos)
// ============================================================

require_once __DIR__ . '/../modelo/Tema.php';
require_once __DIR__ . '/../modelo/Conexion.php';

class TemaController
{
    private function soloDocente(): void
    {
        session_start();
        if (empty($_SESSION['usuario']) || $_SESSION['usuario']['rol'] !== 'DOCENTE') {
            http_response_code(403);
            echo json_encode(['ok' => false, 'mensaje' => 'Acceso solo para docentes.'], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }

    // GET /api/temas-estadisticas
    public function listarConEstadisticas(): void
    {
        $this->soloDocente();
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
            ], $temas),
        ], JSON_UNESCAPED_UNICODE);
    }

    // POST /api/temas
    public function crear(): void
    {
        $this->soloDocente();

        $body       = json_decode(file_get_contents('php://input'), true) ?? [];
        $nombre     = trim($body['nombre']     ?? '');
        $descripcion = trim($body['descripcion'] ?? '') ?: null;
        $icono      = trim($body['icono']      ?? '') ?: null;

        if ($nombre === '') {
            http_response_code(422);
            echo json_encode(['ok' => false, 'mensaje' => 'El nombre del tema es obligatorio.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $modelo   = new Tema();
        $id_tema  = $modelo->crear($nombre, $descripcion, $icono);
        $creado   = $modelo->buscarPorId($id_tema);

        http_response_code(201);
        echo json_encode([
            'ok'    => true,
            'tema'  => [
                'id_tema'         => $creado['id_tema'],
                'nombre'          => $creado['nombre'],
                'descripcion'     => $creado['descripcion'],
                'icono'           => $creado['icono'],
                'totalFlashcards' => 0,
                'totalMateriales' => 0,
            ],
            'mensaje' => 'Tema creado correctamente.',
        ], JSON_UNESCAPED_UNICODE);
    }

    // DELETE /api/temas/{id}
    public function eliminar(int $id): void
    {
        $this->soloDocente();

        $modelo   = new Tema();
        $tema     = $modelo->buscarPorId($id);

        if (!$tema) {
            http_response_code(404);
            echo json_encode(['ok' => false, 'mensaje' => 'Tema no encontrado.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $vinculos = $modelo->contarVinculos($id);
        if ($vinculos > 0) {
            http_response_code(409);
            echo json_encode([
                'ok'       => false,
                'mensaje'  => "Este tema tiene {$vinculos} recurso(s) asociado(s) (flashcards o documentos). Cambia su categoría antes de eliminar el tema.",
                'vinculos' => $vinculos,
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        $modelo->eliminar($id);
        echo json_encode(['ok' => true, 'mensaje' => 'Tema eliminado correctamente.'], JSON_UNESCAPED_UNICODE);
    }
}
