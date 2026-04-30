<?php
// ============================================================
//  MUUU APP · Modelo — Usuario  (schema v2.1)
//  Cambios respecto a v1:
//    · Eliminados: nivel, totalPuntos, flashcardsEstudiadas
//    · Agregado: fotoPerfil
//    · nivel y totalPuntos se calculan desde RANKING
//    · flashcardsEstudiadas desde HISTORIAL_FLASHCARD
// ============================================================

require_once __DIR__ . '/Conexion.php';

class Usuario
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Conexion::obtener();
    }

    // ----------------------------------------------------------
    // Buscar por correo (para login)
    // ----------------------------------------------------------
    public function buscarPorCorreo(string $correo): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT u.id_usuario,
                    u.nombre,
                    u.correo,
                    u.contrasena,
                    u.esActivo,
                    u.rachaActual,
                    u.fechaUltimaActividad,
                    u.fotoPerfil,
                    r.nombre AS rol
             FROM   USUARIO u
             JOIN   ROL     r ON r.id_rol = u.id_rol
             WHERE  u.correo = ?
             LIMIT  1'
        );
        $stmt->execute([$correo]);
        $fila = $stmt->fetch();

        return $fila ?: null;
    }

    // ----------------------------------------------------------
    // Registrar nuevo usuario
    // ----------------------------------------------------------
    public function registrar(
        string $nombre,
        string $correo,
        string $contrasena,
        int    $idRol
    ): int {
        $hash = password_hash($contrasena, PASSWORD_BCRYPT);

        $stmt = $this->db->prepare(
            'INSERT INTO USUARIO (nombre, correo, contrasena, id_rol)
             VALUES (?, ?, ?, ?)'
        );
        $stmt->execute([$nombre, $correo, $hash, $idRol]);

        return (int) $this->db->lastInsertId();
    }

    // ----------------------------------------------------------
    // Buscar por id — incluye puntos, nivel y flashcards
    // calculados desde RANKING e HISTORIAL_FLASHCARD
    // ----------------------------------------------------------
    public function buscarPorId(int $id): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT u.id_usuario,
                    u.nombre,
                    u.correo,
                    u.esActivo,
                    u.rachaActual,
                    u.fechaUltimaActividad,
                    u.fotoPerfil,
                    r.nombre                                    AS rol,
                    COALESCE(rk.puntos, 0)                      AS totalPuntos,
                    FLOOR(COALESCE(rk.puntos, 0) / 500)         AS nivel,
                    rk.posicion,
                    COALESCE(
                        (SELECT COUNT(DISTINCT h.id_flashcard)
                         FROM HISTORIAL_FLASHCARD h
                         WHERE h.id_usuario = u.id_usuario), 0
                    )                                           AS flashcardsEstudiadas
             FROM   USUARIO u
             JOIN   ROL     r  ON r.id_rol   = u.id_rol
             LEFT JOIN RANKING rk ON rk.id_usuario = u.id_usuario
             WHERE  u.id_usuario = ?
             LIMIT  1'
        );
        $stmt->execute([$id]);
        $fila = $stmt->fetch();

        return $fila ?: null;
    }
}
