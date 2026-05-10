<?php
// ============================================================
//  MUUU APP · Controlador — SuscripcionController
//
//  Rutas API:
//    GET    /api/suscripciones           → listar()
//    POST   /api/suscripciones           → suscribir()
//    DELETE /api/suscripciones/:idDocente → desuscribir($idDocente)
// ============================================================

require_once __DIR__ . '/../modelo/Suscripcion.php';
require_once __DIR__ . '/../modelo/Notificacion.php';

class SuscripcionController
{
    private Suscripcion $modelo;

    public function __construct()
    {
        $this->modelo = new Suscripcion();
    }

    // =========================================================
    //  GET /api/suscripciones
    //  - Si ESTUDIANTE: devuelve array de id_docente suscritos
    //  - Si DOCENTE:    devuelve { count: N }
    // =========================================================
    public function listar(): void
    {
        session_start();

        if (empty($_SESSION['id_usuario'])) {
            $this->responder(401, ['ok' => false, 'mensaje' => 'No hay sesión activa.']);
            return;
        }

        $rol = $_SESSION['rol'] ?? '';
        $id  = (int) $_SESSION['id_usuario'];

        if ($rol === 'DOCENTE') {
            $count = $this->modelo->contarSuscritos($id);
            $this->responder(200, ['ok' => true, 'count' => $count]);
        } else {
            $docentes = $this->modelo->listarDocentes($id);
            $this->responder(200, ['ok' => true, 'docentes' => $docentes]);
        }
    }

    // =========================================================
    //  POST /api/suscripciones
    //  Body JSON: { "id_docente": N }
    //  Suscribe al estudiante autenticado al docente indicado.
    // =========================================================
    public function suscribir(): void
    {
        session_start();

        if (empty($_SESSION['id_usuario'])) {
            $this->responder(401, ['ok' => false, 'mensaje' => 'No hay sesión activa.']);
            return;
        }

        if (($_SESSION['rol'] ?? '') !== 'ESTUDIANTE') {
            $this->responder(403, ['ok' => false, 'mensaje' => 'Solo los estudiantes pueden suscribirse.']);
            return;
        }

        $body      = json_decode(file_get_contents('php://input'), true) ?? [];
        $idDocente = (int)($body['id_docente'] ?? 0);

        if ($idDocente <= 0) {
            $this->responder(400, ['ok' => false, 'mensaje' => 'id_docente es requerido.']);
            return;
        }

        $this->modelo->suscribir((int) $_SESSION['id_usuario'], $idDocente);

        // ── Notificar al docente (in-app + email) ────────────
        try {
            $nombreEst  = $_SESSION['nombre'] ?? 'Un estudiante';
            $modeloNotif = new Notificacion();

            $modeloNotif->insertar(
                $idDocente,
                'nueva_suscripcion',
                'Nuevo suscriptor',
                "{$nombreEst} se suscribió a tu perfil"
            );

        } catch (Throwable) { /* no bloquear la respuesta si falla */ }

        $this->responder(200, ['ok' => true, 'mensaje' => 'Suscripción registrada.']);
    }

    // =========================================================
    //  DELETE /api/suscripciones/:idDocente
    //  Desuscribe al estudiante autenticado del docente indicado.
    // =========================================================
    public function desuscribir(int $idDocente): void
    {
        session_start();

        if (empty($_SESSION['id_usuario'])) {
            $this->responder(401, ['ok' => false, 'mensaje' => 'No hay sesión activa.']);
            return;
        }

        if (($_SESSION['rol'] ?? '') !== 'ESTUDIANTE') {
            $this->responder(403, ['ok' => false, 'mensaje' => 'Solo los estudiantes pueden desuscribirse.']);
            return;
        }

        $this->modelo->desuscribir((int) $_SESSION['id_usuario'], $idDocente);

        $this->responder(200, ['ok' => true, 'mensaje' => 'Suscripción eliminada.']);
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
