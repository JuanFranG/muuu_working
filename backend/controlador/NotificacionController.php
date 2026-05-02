<?php
// ============================================================
//  MUUU APP · Controlador — NotificacionController
//
//  Rutas API:
//    GET    /api/notificaciones             → listar()
//    GET    /api/notificaciones/no-leidas   → contarNoLeidas()
//    DELETE /api/notificaciones/{id}        → eliminar($id)
//    PATCH  /api/notificaciones/{id}/leer   → marcarLeida($id)
//    PATCH  /api/notificaciones/leer-todas  → marcarTodasLeidas()
// ============================================================

require_once __DIR__ . '/../modelo/Notificacion.php';

class NotificacionController
{
    private Notificacion $modelo;

    public function __construct()
    {
        $this->modelo = new Notificacion();
    }

    // =========================================================
    //  GET /api/notificaciones
    // =========================================================
    public function listar(): void
    {
        session_start();
        if (empty($_SESSION['id_usuario'])) {
            $this->responder(401, ['ok' => false, 'mensaje' => 'No hay sesión activa.']);
            return;
        }
        $notificaciones = $this->modelo->listarPorUsuario((int) $_SESSION['id_usuario']);
        $this->responder(200, ['ok' => true, 'notificaciones' => $notificaciones]);
    }

    // =========================================================
    //  GET /api/notificaciones/no-leidas
    // =========================================================
    public function contarNoLeidas(): void
    {
        session_start();
        if (empty($_SESSION['id_usuario'])) {
            $this->responder(200, ['ok' => true, 'count' => 0]);
            return;
        }
        $count = $this->modelo->contarNoLeidas((int) $_SESSION['id_usuario']);
        $this->responder(200, ['ok' => true, 'count' => $count]);
    }

    // =========================================================
    //  DELETE /api/notificaciones/{id}
    // =========================================================
    public function eliminar(int $id): void
    {
        session_start();
        if (empty($_SESSION['id_usuario'])) {
            $this->responder(401, ['ok' => false, 'mensaje' => 'No hay sesión activa.']);
            return;
        }
        $ok = $this->modelo->eliminar($id, (int) $_SESSION['id_usuario']);
        if ($ok) {
            $this->responder(200, ['ok' => true]);
        } else {
            $this->responder(404, ['ok' => false, 'mensaje' => 'Notificación no encontrada.']);
        }
    }

    // =========================================================
    //  PATCH /api/notificaciones/{id}/leer
    // =========================================================
    public function marcarLeida(int $id): void
    {
        session_start();
        if (empty($_SESSION['id_usuario'])) {
            $this->responder(401, ['ok' => false, 'mensaje' => 'No hay sesión activa.']);
            return;
        }
        $this->modelo->marcarLeida($id, (int) $_SESSION['id_usuario']);
        $this->responder(200, ['ok' => true]);
    }

    // =========================================================
    //  PATCH /api/notificaciones/leer-todas
    // =========================================================
    public function marcarTodasLeidas(): void
    {
        session_start();
        if (empty($_SESSION['id_usuario'])) {
            $this->responder(401, ['ok' => false, 'mensaje' => 'No hay sesión activa.']);
            return;
        }
        $this->modelo->marcarTodasLeidas((int) $_SESSION['id_usuario']);
        $this->responder(200, ['ok' => true]);
    }

    // =========================================================
    //  HELPER
    // =========================================================
    private function responder(int $status, array $data): void
    {
        http_response_code($status);
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
    }
}
