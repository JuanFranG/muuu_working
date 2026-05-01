<?php
// ============================================================
//  MUUU APP · Modelo — Flashcard
//  Gestiona FLASHCARDS y OPCIONES_RESPUESTA.
//  Solo interactúa con la DB; no sabe nada de HTTP.
// ============================================================

require_once __DIR__ . '/Conexion.php';

class Flashcard
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Conexion::obtener();
    }

    // ----------------------------------------------------------
    // Crear una flashcard con sus opciones
    // Devuelve el id_flashcard recién creado.
    // ----------------------------------------------------------
    public function crear(
        string $integral,
        string $respuestaCorrecta,
        int    $idTema,
        int    $idDificultad,
        int    $idUsuario,
        string $estado,   // 'BORRADOR' | 'PUBLICADO'
        array  $opciones  // [['contenido'=>..., 'esCorrecta'=>bool, 'retroalimentacion'=>...], ...]
    ): int {
        $this->db->beginTransaction();

        try {
            $stmt = $this->db->prepare(
                'INSERT INTO FLASHCARDS
                    (integral, respuestaCorrecta, id_tema, id_dificultad, id_usuario, estado)
                 VALUES (?, ?, ?, ?, ?, ?)'
            );
            $stmt->execute([
                $integral,
                $respuestaCorrecta,
                $idTema,
                $idDificultad,
                $idUsuario,
                $estado,
            ]);

            $idFlashcard = (int) $this->db->lastInsertId();

            // Insertar opciones de respuesta
            $stmtOpc = $this->db->prepare(
                'INSERT INTO OPCIONES_RESPUESTA
                    (contenidoRespuesta, esCorrecta, retroalimentacion, id_flashcard)
                 VALUES (?, ?, ?, ?)'
            );

            foreach ($opciones as $opc) {
                $stmtOpc->execute([
                    $opc['contenido']        ?? '',
                    (int)($opc['esCorrecta']   ?? 0),
                    $opc['retroalimentacion'] ?? null,
                    $idFlashcard,
                ]);
            }

            $this->db->commit();
            return $idFlashcard;

        } catch (Throwable $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    // ----------------------------------------------------------
    // Listar flashcards de un docente
    // Si $soloPublicadas=true excluye borradores (para estudiantes).
    // ----------------------------------------------------------
    public function listarPorDocente(int $idUsuario, bool $soloPublicadas = false): array
    {
        $filtroEstado = $soloPublicadas ? "AND f.estado = 'PUBLICADO'" : '';

        $stmt = $this->db->prepare(
            "SELECT f.id_flashcard,
                    f.integral,
                    f.respuestaCorrecta,
                    f.estado,
                    f.fechaCreacion,
                    t.nombre    AS tema,
                    d.nombre    AS dificultad,
                    (SELECT COUNT(*) FROM OPCIONES_RESPUESTA
                     WHERE id_flashcard = f.id_flashcard) AS totalOpciones
             FROM   FLASHCARDS f
             JOIN   TEMA      t ON t.id_tema      = f.id_tema
             JOIN   DIFICULTAD d ON d.id_dificultad = f.id_dificultad
             WHERE  f.id_usuario = ? {$filtroEstado}
             ORDER BY f.fechaCreacion DESC"
        );
        $stmt->execute([$idUsuario]);

        return $stmt->fetchAll();
    }

    // ----------------------------------------------------------
    // Listar todas las flashcards publicadas (para estudiantes)
    // ----------------------------------------------------------
    public function listarPublicadas(): array
    {
        $stmt = $this->db->prepare(
            "SELECT f.id_flashcard,
                    f.integral,
                    f.respuestaCorrecta,
                    f.estado,
                    f.fechaCreacion,
                    t.nombre    AS tema,
                    d.nombre    AS dificultad,
                    u.nombre    AS docente,
                    u.fotoPerfil AS docenteFoto
             FROM   FLASHCARDS f
             JOIN   TEMA       t ON t.id_tema        = f.id_tema
             JOIN   DIFICULTAD d ON d.id_dificultad  = f.id_dificultad
             JOIN   USUARIO    u ON u.id_usuario      = f.id_usuario
             WHERE  f.estado = 'PUBLICADO'
             ORDER BY f.fechaCreacion DESC"
        );
        $stmt->execute();

        return $stmt->fetchAll();
    }

    // ----------------------------------------------------------
    // Buscar una flashcard por id (con sus opciones e IDs de tema/dificultad)
    // ----------------------------------------------------------
    public function buscarPorId(int $id): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT f.id_flashcard,
                    f.integral,
                    f.respuestaCorrecta,
                    f.estado,
                    f.fechaCreacion,
                    f.id_usuario,
                    f.id_tema,
                    f.id_dificultad,
                    t.nombre  AS tema,
                    d.nombre  AS dificultad
             FROM   FLASHCARDS f
             JOIN   TEMA      t ON t.id_tema      = f.id_tema
             JOIN   DIFICULTAD d ON d.id_dificultad = f.id_dificultad
             WHERE  f.id_flashcard = ?
             LIMIT  1'
        );
        $stmt->execute([$id]);
        $fila = $stmt->fetch();

        if (!$fila) {
            return null;
        }

        // Cargar opciones de respuesta
        $stmtOpc = $this->db->prepare(
            'SELECT id_opcion, contenidoRespuesta, esCorrecta, retroalimentacion
             FROM   OPCIONES_RESPUESTA
             WHERE  id_flashcard = ?
             ORDER BY id_opcion'
        );
        $stmtOpc->execute([$id]);
        $fila['opciones'] = $stmtOpc->fetchAll();

        return $fila;
    }

    // ----------------------------------------------------------
    // Actualizar una flashcard completa (reemplaza opciones)
    // ----------------------------------------------------------
    public function actualizarCompleto(
        int    $id,
        string $integral,
        string $respuestaCorrecta,
        int    $idTema,
        int    $idDificultad,
        string $estado,
        array  $opciones
    ): bool {
        $this->db->beginTransaction();

        try {
            // Actualizar datos principales
            $stmt = $this->db->prepare(
                'UPDATE FLASHCARDS
                 SET integral = ?, respuestaCorrecta = ?, id_tema = ?,
                     id_dificultad = ?, estado = ?
                 WHERE id_flashcard = ?'
            );
            $stmt->execute([
                $integral, $respuestaCorrecta, $idTema,
                $idDificultad, $estado, $id,
            ]);

            // Borrar opciones antiguas y reinsertar
            $this->db->prepare(
                'DELETE FROM OPCIONES_RESPUESTA WHERE id_flashcard = ?'
            )->execute([$id]);

            $stmtOpc = $this->db->prepare(
                'INSERT INTO OPCIONES_RESPUESTA
                    (contenidoRespuesta, esCorrecta, retroalimentacion, id_flashcard)
                 VALUES (?, ?, ?, ?)'
            );
            foreach ($opciones as $opc) {
                $stmtOpc->execute([
                    $opc['contenido']        ?? '',
                    (int)($opc['esCorrecta']   ?? 0),
                    $opc['retroalimentacion'] ?? null,
                    $id,
                ]);
            }

            $this->db->commit();
            return true;

        } catch (Throwable $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    // ----------------------------------------------------------
    // Listar flashcards publicadas de un docente CON sus opciones
    // (usado en Ponte a Prueba para el quiz del estudiante)
    // ----------------------------------------------------------
    public function listarConOpcionesPorDocente(int $idDocente): array
    {
        $stmt = $this->db->prepare(
            "SELECT f.id_flashcard,
                    f.integral,
                    f.respuestaCorrecta,
                    t.nombre AS tema,
                    d.nombre AS dificultad
             FROM   FLASHCARDS f
             JOIN   TEMA       t ON t.id_tema       = f.id_tema
             JOIN   DIFICULTAD d ON d.id_dificultad = f.id_dificultad
             WHERE  f.id_usuario = ?
               AND  f.estado     = 'PUBLICADO'
             ORDER  BY f.fechaCreacion DESC"
        );
        $stmt->execute([$idDocente]);
        $flashcards = $stmt->fetchAll();

        // Cargar opciones para cada flashcard
        $stmtOpc = $this->db->prepare(
            'SELECT id_opcion, contenidoRespuesta, esCorrecta, retroalimentacion
             FROM   OPCIONES_RESPUESTA
             WHERE  id_flashcard = ?
             ORDER  BY id_opcion'
        );

        foreach ($flashcards as &$fc) {
            $stmtOpc->execute([$fc['id_flashcard']]);
            $fc['opciones'] = $stmtOpc->fetchAll();
        }

        return $flashcards;
    }

    // ----------------------------------------------------------
    // Listar flashcards publicadas de un tema CON sus opciones
    // (usado en Ponte a Prueba por Tema)
    // ----------------------------------------------------------
    public function listarConOpcionesPorTema(int $idTema): array
    {
        $stmt = $this->db->prepare(
            "SELECT f.id_flashcard,
                    f.integral,
                    f.respuestaCorrecta,
                    t.nombre  AS tema,
                    d.nombre  AS dificultad,
                    u.nombre  AS docente
             FROM   FLASHCARDS f
             JOIN   TEMA       t ON t.id_tema       = f.id_tema
             JOIN   DIFICULTAD d ON d.id_dificultad = f.id_dificultad
             JOIN   USUARIO    u ON u.id_usuario    = f.id_usuario
             WHERE  f.id_tema  = ?
               AND  f.estado   = 'PUBLICADO'
             ORDER  BY f.fechaCreacion DESC"
        );
        $stmt->execute([$idTema]);
        $flashcards = $stmt->fetchAll();

        // Cargar opciones para cada flashcard
        $stmtOpc = $this->db->prepare(
            'SELECT id_opcion, contenidoRespuesta, esCorrecta, retroalimentacion
             FROM   OPCIONES_RESPUESTA
             WHERE  id_flashcard = ?
             ORDER  BY id_opcion'
        );

        foreach ($flashcards as &$fc) {
            $stmtOpc->execute([$fc['id_flashcard']]);
            $fc['opciones'] = $stmtOpc->fetchAll();
        }

        return $flashcards;
    }

    // ----------------------------------------------------------
    // Cambiar el estado de una flashcard
    // ----------------------------------------------------------
    public function actualizarEstado(int $id, string $estado): bool
    {
        $stmt = $this->db->prepare(
            "UPDATE FLASHCARDS SET estado = ? WHERE id_flashcard = ?"
        );
        $stmt->execute([$estado, $id]);

        return $stmt->rowCount() > 0;
    }

    // ----------------------------------------------------------
    // Eliminar una flashcard (las opciones se borran por CASCADE)
    // ----------------------------------------------------------
    public function eliminar(int $id): bool
    {
        $stmt = $this->db->prepare(
            'DELETE FROM FLASHCARDS WHERE id_flashcard = ?'
        );
        $stmt->execute([$id]);

        return $stmt->rowCount() > 0;
    }

    // ----------------------------------------------------------
    // Verificar si una flashcard pertenece a un usuario
    // (para proteger DELETE/PATCH)
    // ----------------------------------------------------------
    public function perteneceA(int $idFlashcard, int $idUsuario): bool
    {
        $stmt = $this->db->prepare(
            'SELECT COUNT(*) FROM FLASHCARDS
             WHERE id_flashcard = ? AND id_usuario = ?'
        );
        $stmt->execute([$idFlashcard, $idUsuario]);

        return (int) $stmt->fetchColumn() > 0;
    }
}
