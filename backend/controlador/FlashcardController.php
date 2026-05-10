<?php
// ============================================================
//  MUUU APP · Controlador — FlashcardController
//
//  Rutas API (responden JSON):
//    GET  /api/temas                     → listarTemas()
//    GET  /api/dificultades              → listarDificultades()
//    GET  /api/flashcards                → listar()
//    POST /api/flashcards                → crear()
//    DELETE /api/flashcards/{id}         → eliminar($id)
//    PATCH  /api/flashcards/{id}/publicar → publicar($id)
//    PATCH  /api/flashcards/{id}/borrador → borrador($id)
// ============================================================

require_once __DIR__ . '/../modelo/Flashcard.php';
require_once __DIR__ . '/../modelo/Tema.php';
require_once __DIR__ . '/../modelo/Dificultad.php';
require_once __DIR__ . '/../modelo/Notificacion.php';

class FlashcardController
{
    private Flashcard  $modeloFlashcard;
    private Tema       $modeloTema;
    private Dificultad $modeloDificultad;

    public function __construct()
    {
        $this->modeloFlashcard  = new Flashcard();
        $this->modeloTema       = new Tema();
        $this->modeloDificultad = new Dificultad();
    }

    // =========================================================
    //  GET /api/temas
    //  Devuelve todos los temas (para el dropdown del formulario)
    // =========================================================
    public function listarTemas(): void
    {
        $temas = $this->modeloTema->listar();
        $this->responder(200, ['ok' => true, 'temas' => $temas]);
    }

    // =========================================================
    //  GET /api/dificultades
    // =========================================================
    public function listarDificultades(): void
    {
        $difs = $this->modeloDificultad->listar();
        $this->responder(200, ['ok' => true, 'dificultades' => $difs]);
    }

    // =========================================================
    //  GET /api/flashcards
    //  - Si el usuario es DOCENTE: devuelve SUS flashcards
    //    (borradores + publicadas)
    //  - Si el usuario es ESTUDIANTE: devuelve todas las
    //    flashcards publicadas
    // =========================================================
    public function listar(): void
    {
        session_start();

        // ?tema=id  → Ponte a Prueba por Tema: flashcards publicadas de ese tema CON opciones
        // No requiere sesión (flashcards publicadas son de acceso público)
        if (isset($_GET['tema']) && (int)$_GET['tema'] > 0) {
            $idTema     = (int) $_GET['tema'];
            $flashcards = $this->modeloFlashcard->listarConOpcionesPorTema($idTema);
            $this->responder(200, ['ok' => true, 'flashcards' => $flashcards]);
            return;
        }

        // ?docente=id  → Ponte a Prueba: flashcards publicadas de ese docente CON opciones
        // No requiere sesión (flashcards publicadas son de acceso público)
        if (isset($_GET['docente']) && (int)$_GET['docente'] > 0) {
            $idDocente  = (int) $_GET['docente'];
            $flashcards = $this->modeloFlashcard->listarConOpcionesPorDocente($idDocente);
            $this->responder(200, ['ok' => true, 'flashcards' => $flashcards]);
            return;
        }

        if (empty($_SESSION['id_usuario'])) {
            $this->responder(401, ['ok' => false, 'mensaje' => 'No hay sesión activa.']);
            return;
        }

        $rol = $_SESSION['rol'] ?? '';

        if ($rol === 'DOCENTE') {
            $flashcards = $this->modeloFlashcard->listarPorDocente(
                (int) $_SESSION['id_usuario']
            );
        } else {
            $flashcards = $this->modeloFlashcard->listarPublicadas();
        }

        $this->responder(200, ['ok' => true, 'flashcards' => $flashcards]);
    }

    // =========================================================
    //  POST /api/flashcards
    //  Body JSON esperado:
    //  {
    //    "integral":          "Resuelve: ...",
    //    "id_tema":           3,
    //    "id_dificultad":     2,
    //    "estado":            "BORRADOR" | "PUBLICADO",
    //    "opciones": [
    //      { "contenido": "...", "esCorrecta": true,  "retroalimentacion": "..." },
    //      { "contenido": "...", "esCorrecta": false, "retroalimentacion": "..." }
    //    ]
    //  }
    // =========================================================
    public function crear(): void
    {
        session_start();

        if (empty($_SESSION['id_usuario'])) {
            $this->responder(401, ['ok' => false, 'mensaje' => 'No hay sesión activa.']);
            return;
        }

        if (($_SESSION['rol'] ?? '') !== 'DOCENTE') {
            $this->responder(403, ['ok' => false, 'mensaje' => 'Solo docentes pueden crear flashcards.']);
            return;
        }

        $body = $this->leerBody();

        $integral    = trim($body['integral']     ?? '');
        $idTema      = (int)($body['id_tema']      ?? 0);
        $idDificultad = (int)($body['id_dificultad'] ?? 0);
        $estado      = strtoupper($body['estado']  ?? 'BORRADOR');
        $opciones    = $body['opciones']            ?? [];

        // Validaciones básicas
        if ($integral === '') {
            $this->responder(400, ['ok' => false, 'mensaje' => 'La pregunta (integral) es requerida.']);
            return;
        }
        if ($idTema === 0) {
            $this->responder(400, ['ok' => false, 'mensaje' => 'Debes seleccionar un tema.']);
            return;
        }
        if ($idDificultad === 0) {
            $this->responder(400, ['ok' => false, 'mensaje' => 'Debes seleccionar una dificultad.']);
            return;
        }
        if (!in_array($estado, ['BORRADOR', 'PUBLICADO'], true)) {
            $estado = 'BORRADOR';
        }
        if (empty($opciones)) {
            $this->responder(400, ['ok' => false, 'mensaje' => 'Debes incluir al menos una opción de respuesta.']);
            return;
        }

        // Extraer la respuesta correcta del array de opciones
        $respuestaCorrecta = '';
        foreach ($opciones as $opc) {
            if (!empty($opc['esCorrecta'])) {
                $respuestaCorrecta = $opc['contenido'] ?? '';
                break;
            }
        }
        if ($respuestaCorrecta === '') {
            $this->responder(400, ['ok' => false, 'mensaje' => 'Debes marcar al menos una opción como correcta.']);
            return;
        }

        try {
            $idNuevo = $this->modeloFlashcard->crear(
                $integral,
                $respuestaCorrecta,
                $idTema,
                $idDificultad,
                (int) $_SESSION['id_usuario'],
                $estado,
                $opciones
            );
        } catch (Throwable $e) {
            $this->responder(500, ['ok' => false, 'mensaje' => 'Error al guardar la flashcard: ' . $e->getMessage()]);
            return;
        }

        $mensaje = $estado === 'PUBLICADO'
            ? 'Flashcard publicada exitosamente.'
            : 'Flashcard guardada como borrador.';

        // ── Si se publicó directamente, notificar a suscriptores ──
        if ($estado === 'PUBLICADO') {
            try {
                $this->notificarNuevaFlashcard(
                    (int) $_SESSION['id_usuario'],
                    $idTema,
                    $_SESSION['nombre'] ?? 'El docente'
                );
            } catch (Throwable) { /* silencioso */ }
        }

        $this->responder(201, [
            'ok'           => true,
            'mensaje'      => $mensaje,
            'id_flashcard' => $idNuevo,
            'estado'       => $estado,
        ]);
    }

    // =========================================================
    //  GET /api/flashcards/{id}
    //  Devuelve una flashcard completa con sus opciones e IDs
    //  (para precargar el formulario de edición)
    // =========================================================
    public function obtener(int $id): void
    {
        session_start();

        if (empty($_SESSION['id_usuario'])) {
            $this->responder(401, ['ok' => false, 'mensaje' => 'No hay sesión activa.']);
            return;
        }

        $flashcard = $this->modeloFlashcard->buscarPorId($id);

        if (!$flashcard) {
            $this->responder(404, ['ok' => false, 'mensaje' => 'Flashcard no encontrada.']);
            return;
        }

        // Solo el dueño puede ver sus borradores
        if ($flashcard['estado'] === 'BORRADOR' &&
            (int)$flashcard['id_usuario'] !== (int)$_SESSION['id_usuario']) {
            $this->responder(403, ['ok' => false, 'mensaje' => 'Sin acceso a esta flashcard.']);
            return;
        }

        $this->responder(200, ['ok' => true, 'flashcard' => $flashcard]);
    }

    // =========================================================
    //  PUT /api/flashcards/{id}
    //  Actualiza integral, tema, dificultad, estado y opciones.
    // =========================================================
    public function actualizar(int $id): void
    {
        session_start();

        if (empty($_SESSION['id_usuario'])) {
            $this->responder(401, ['ok' => false, 'mensaje' => 'No hay sesión activa.']);
            return;
        }

        if (($_SESSION['rol'] ?? '') !== 'DOCENTE') {
            $this->responder(403, ['ok' => false, 'mensaje' => 'Solo docentes pueden editar flashcards.']);
            return;
        }

        if (!$this->modeloFlashcard->perteneceA($id, (int) $_SESSION['id_usuario'])) {
            $this->responder(403, ['ok' => false, 'mensaje' => 'No tienes permiso para editar esta flashcard.']);
            return;
        }

        $body = $this->leerBody();

        $integral     = trim($body['integral']      ?? '');
        $idTema       = (int)($body['id_tema']       ?? 0);
        $idDificultad = (int)($body['id_dificultad'] ?? 0);
        $estado       = strtoupper($body['estado']   ?? 'BORRADOR');
        $opciones     = $body['opciones']             ?? [];

        if ($integral === '' || $idTema === 0 || $idDificultad === 0 || empty($opciones)) {
            $this->responder(400, ['ok' => false, 'mensaje' => 'Datos incompletos.']);
            return;
        }
        if (!in_array($estado, ['BORRADOR', 'PUBLICADO'], true)) {
            $estado = 'BORRADOR';
        }

        $respuestaCorrecta = '';
        foreach ($opciones as $opc) {
            if (!empty($opc['esCorrecta'])) {
                $respuestaCorrecta = $opc['contenido'] ?? '';
                break;
            }
        }
        if ($respuestaCorrecta === '') {
            $this->responder(400, ['ok' => false, 'mensaje' => 'Debes marcar al menos una opción como correcta.']);
            return;
        }

        try {
            $this->modeloFlashcard->actualizarCompleto(
                $id, $integral, $respuestaCorrecta,
                $idTema, $idDificultad, $estado, $opciones
            );
        } catch (Throwable $e) {
            $this->responder(500, ['ok' => false, 'mensaje' => 'Error al actualizar: ' . $e->getMessage()]);
            return;
        }

        $this->responder(200, [
            'ok'      => true,
            'mensaje' => $estado === 'PUBLICADO'
                ? 'Flashcard actualizada y publicada.'
                : 'Cambios guardados como borrador.',
            'estado'  => $estado,
        ]);
    }

    // =========================================================
    //  DELETE /api/flashcards/{id}
    // =========================================================
    public function eliminar(int $id): void
    {
        session_start();

        if (empty($_SESSION['id_usuario'])) {
            $this->responder(401, ['ok' => false, 'mensaje' => 'No hay sesión activa.']);
            return;
        }

        // Verificar que la flashcard le pertenece al docente
        if (!$this->modeloFlashcard->perteneceA($id, (int) $_SESSION['id_usuario'])) {
            $this->responder(403, ['ok' => false, 'mensaje' => 'No tienes permiso para eliminar esta flashcard.']);
            return;
        }

        $eliminada = $this->modeloFlashcard->eliminar($id);

        if ($eliminada) {
            $this->responder(200, ['ok' => true, 'mensaje' => 'Flashcard eliminada.']);
        } else {
            $this->responder(404, ['ok' => false, 'mensaje' => 'Flashcard no encontrada.']);
        }
    }

    // =========================================================
    //  PATCH /api/flashcards/{id}/publicar
    // =========================================================
    public function publicar(int $id): void
    {
        session_start();
        if (empty($_SESSION['id_usuario'])) {
            $this->responder(401, ['ok' => false, 'mensaje' => 'No hay sesión activa.']);
            return;
        }
        if (!$this->modeloFlashcard->perteneceA($id, (int) $_SESSION['id_usuario'])) {
            $this->responder(403, ['ok' => false, 'mensaje' => 'No tienes permiso para modificar esta flashcard.']);
            return;
        }

        // Comprobar estado previo (solo notificar si estaba en BORRADOR)
        $flashcard = $this->modeloFlashcard->buscarPorId($id);
        $eraPublicada = $flashcard && ($flashcard['estado'] ?? '') === 'PUBLICADO';

        $ok = $this->modeloFlashcard->actualizarEstado($id, 'PUBLICADO');
        if (!$ok) {
            $this->responder(404, ['ok' => false, 'mensaje' => 'Flashcard no encontrada.']);
            return;
        }

        // Notificar solo al pasar de BORRADOR → PUBLICADO
        if (!$eraPublicada && $flashcard) {
            try {
                $this->notificarNuevaFlashcard(
                    (int) $_SESSION['id_usuario'],
                    (int) $flashcard['id_tema'],
                    $_SESSION['nombre'] ?? 'El docente'
                );
            } catch (Throwable) { /* silencioso */ }
        }

        $this->responder(200, ['ok' => true, 'mensaje' => 'Flashcard publicada exitosamente.', 'estado' => 'PUBLICADO']);
    }

    // =========================================================
    //  PATCH /api/flashcards/{id}/borrador
    // =========================================================
    public function borrador(int $id): void
    {
        $this->cambiarEstado($id, 'BORRADOR', 'Flashcard movida a borrador.');
    }

    // =========================================================
    //  HELPERS PRIVADOS
    // =========================================================

    private function notificarNuevaFlashcard(int $idDocente, int $idTema, string $nombreDocente): void
    {
        $modeloNotif = new Notificacion();

        // Obtener nombre del tema
        $temas      = $this->modeloTema->listar();
        $nombreTema = 'un tema';
        foreach ($temas as $t) {
            if ((int) $t['id_tema'] === $idTema) {
                $nombreTema = $t['nombre'];
                break;
            }
        }

        $suscritos = $modeloNotif->listarSuscritosPorDocente($idDocente);
        foreach ($suscritos as $est) {
            // Notificación in-app
            $modeloNotif->insertar(
                (int) $est['id_estudiante'],
                'nueva_flashcard',
                'Nueva flashcard publicada',
                "{$nombreDocente} publicó una nueva flashcard sobre {$nombreTema}"
            );
        }
    }

    private function cambiarEstado(int $id, string $nuevoEstado, string $mensajeOk): void
    {
        session_start();

        if (empty($_SESSION['id_usuario'])) {
            $this->responder(401, ['ok' => false, 'mensaje' => 'No hay sesión activa.']);
            return;
        }

        if (!$this->modeloFlashcard->perteneceA($id, (int) $_SESSION['id_usuario'])) {
            $this->responder(403, ['ok' => false, 'mensaje' => 'No tienes permiso para modificar esta flashcard.']);
            return;
        }

        $ok = $this->modeloFlashcard->actualizarEstado($id, $nuevoEstado);

        if ($ok) {
            $this->responder(200, ['ok' => true, 'mensaje' => $mensajeOk, 'estado' => $nuevoEstado]);
        } else {
            $this->responder(404, ['ok' => false, 'mensaje' => 'Flashcard no encontrada.']);
        }
    }

    private function leerBody(): array
    {
        return json_decode(file_get_contents('php://input'), true) ?? [];
    }

    private function responder(int $status, array $data): void
    {
        http_response_code($status);
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
    }
}
