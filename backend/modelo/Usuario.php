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
                    u.googleId,
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

    // ----------------------------------------------------------
    // Actualizar nombre y/o contraseña del perfil
    // ----------------------------------------------------------
    public function actualizarPerfil(int $id, ?string $nombre, ?string $nuevaContrasena): void
    {
        if ($nombre !== null && $nuevaContrasena !== null) {
            $stmt = $this->db->prepare(
                'UPDATE USUARIO SET nombre = ?, contrasena = ? WHERE id_usuario = ?'
            );
            $stmt->execute([$nombre, password_hash($nuevaContrasena, PASSWORD_BCRYPT), $id]);
        } elseif ($nombre !== null) {
            $stmt = $this->db->prepare(
                'UPDATE USUARIO SET nombre = ? WHERE id_usuario = ?'
            );
            $stmt->execute([$nombre, $id]);
        } elseif ($nuevaContrasena !== null) {
            $stmt = $this->db->prepare(
                'UPDATE USUARIO SET contrasena = ? WHERE id_usuario = ?'
            );
            $stmt->execute([password_hash($nuevaContrasena, PASSWORD_BCRYPT), $id]);
        }
    }

    // ----------------------------------------------------------
    // Actualizar foto de perfil
    // ----------------------------------------------------------
    public function actualizarFoto(int $id, string $url): void
    {
        $stmt = $this->db->prepare(
            'UPDATE USUARIO SET fotoPerfil = ? WHERE id_usuario = ?'
        );
        $stmt->execute([$url, $id]);
    }

    // ----------------------------------------------------------
    // Obtener contraseña hash actual (para verificar antes de cambiar)
    // ----------------------------------------------------------
    public function obtenerContrasena(int $id): ?string
    {
        $stmt = $this->db->prepare(
            'SELECT contrasena FROM USUARIO WHERE id_usuario = ? LIMIT 1'
        );
        $stmt->execute([$id]);
        $fila = $stmt->fetch();
        return $fila ? $fila['contrasena'] : null;
    }

    // ----------------------------------------------------------
    // Buscar usuario existente por googleId O por correo (solo lectura)
    // Devuelve el usuario completo o null si no existe.
    // ----------------------------------------------------------
    public function buscarPorGoogleOCorreo(string $correo, string $googleId): ?array
    {
        // 1. Buscar por googleId
        $stmt = $this->db->prepare(
            'SELECT id_usuario FROM USUARIO WHERE googleId = ? LIMIT 1'
        );
        $stmt->execute([$googleId]);
        $fila = $stmt->fetch();
        if ($fila) {
            return $this->buscarPorId((int) $fila['id_usuario']);
        }

        // 2. Buscar por correo (cuenta tradicional sin googleId)
        $stmt = $this->db->prepare(
            'SELECT id_usuario FROM USUARIO WHERE correo = ? LIMIT 1'
        );
        $stmt->execute([$correo]);
        $fila = $stmt->fetch();
        if ($fila) {
            return $this->buscarPorId((int) $fila['id_usuario']);
        }

        return null;
    }

    // ----------------------------------------------------------
    // Vincular googleId a una cuenta existente (ya buscada por correo)
    // ----------------------------------------------------------
    public function vincularGoogle(int $id, string $googleId): void
    {
        $this->db->prepare(
            'UPDATE USUARIO SET googleId = ? WHERE id_usuario = ? AND googleId IS NULL'
        )->execute([$googleId, $id]);
    }

    // ----------------------------------------------------------
    // Crear nuevo usuario via Google con rol elegido por el usuario
    // ----------------------------------------------------------
    public function crearConGoogle(
        string  $correo,
        string  $nombre,
        string  $googleId,
        ?string $fotoPerfil,
        int     $idRol
    ): ?array {
        $stmt = $this->db->prepare(
            'INSERT INTO USUARIO (nombre, correo, contrasena, fotoPerfil, googleId, id_rol)
             VALUES (?, ?, NULL, ?, ?, ?)'
        );
        $stmt->execute([$nombre, $correo, $fotoPerfil, $googleId, $idRol]);
        return $this->buscarPorId((int) $this->db->lastInsertId());
    }

    // ----------------------------------------------------------
    // Eliminar cuenta y todos sus datos relacionados
    // ----------------------------------------------------------
    public function eliminar(int $id): void
    {
        // Orden de eliminación respetando claves foráneas
        $tablas = [
            'DELETE FROM NOTIFICACION WHERE id_usuario = ?',
            'DELETE FROM HISTORIAL_FLASHCARD WHERE id_usuario = ?',
            'DELETE FROM RESULTADO WHERE id_usuario = ?',
            'DELETE FROM SUSCRIPCION WHERE id_usuario = ?',
            'DELETE FROM FLASHCARD WHERE id_usuario = ?',
            'DELETE FROM MATERIAL WHERE id_usuario = ?',
            'DELETE FROM USUARIO WHERE id_usuario = ?',
        ];
        foreach ($tablas as $sql) {
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$id]);
        }
    }
}
