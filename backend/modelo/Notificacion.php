<?php
// ============================================================
//  MUUU APP · Modelo — Notificacion
//  Gestiona la tabla NOTIFICACION.
// ============================================================

require_once __DIR__ . '/Conexion.php';

class Notificacion
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Conexion::obtener();
    }

    // ----------------------------------------------------------
    // Insertar una nueva notificación para un usuario
    // ----------------------------------------------------------
    public function insertar(int $idUsuario, string $tipo, string $titulo, string $mensaje): void
    {
        $stmt = $this->db->prepare(
            'INSERT INTO NOTIFICACION (id_usuario, tipo, titulo, mensaje)
             VALUES (?, ?, ?, ?)'
        );
        $stmt->execute([$idUsuario, $tipo, $titulo, $mensaje]);
    }

    // ----------------------------------------------------------
    // Listar todas las notificaciones de un usuario (más reciente primero)
    // ----------------------------------------------------------
    public function listarPorUsuario(int $idUsuario): array
    {
        $stmt = $this->db->prepare(
            'SELECT id_notificacion, tipo, titulo, mensaje, leida, fechaCreacion
             FROM   NOTIFICACION
             WHERE  id_usuario = ?
             ORDER  BY fechaCreacion DESC'
        );
        $stmt->execute([$idUsuario]);
        return array_map(function (array $r): array {
            return [
                'id_notificacion' => (int)  $r['id_notificacion'],
                'tipo'            =>        $r['tipo'],
                'titulo'          =>        $r['titulo'],
                'mensaje'         =>        $r['mensaje'],
                'leida'           => (bool) $r['leida'],
                'fechaCreacion'   =>        $r['fechaCreacion'],
            ];
        }, $stmt->fetchAll());
    }

    // ----------------------------------------------------------
    // Contar notificaciones no leídas de un usuario
    // ----------------------------------------------------------
    public function contarNoLeidas(int $idUsuario): int
    {
        $stmt = $this->db->prepare(
            'SELECT COUNT(*) FROM NOTIFICACION
             WHERE  id_usuario = ? AND leida = 0'
        );
        $stmt->execute([$idUsuario]);
        return (int) $stmt->fetchColumn();
    }

    // ----------------------------------------------------------
    // Eliminar una notificación (verifica propiedad)
    // ----------------------------------------------------------
    public function eliminar(int $idNotificacion, int $idUsuario): bool
    {
        $stmt = $this->db->prepare(
            'DELETE FROM NOTIFICACION
             WHERE  id_notificacion = ? AND id_usuario = ?'
        );
        $stmt->execute([$idNotificacion, $idUsuario]);
        return $stmt->rowCount() > 0;
    }

    // ----------------------------------------------------------
    // Marcar una notificación como leída
    // ----------------------------------------------------------
    public function marcarLeida(int $idNotificacion, int $idUsuario): void
    {
        $stmt = $this->db->prepare(
            'UPDATE NOTIFICACION SET leida = 1
             WHERE  id_notificacion = ? AND id_usuario = ?'
        );
        $stmt->execute([$idNotificacion, $idUsuario]);
    }

    // ----------------------------------------------------------
    // Marcar todas las notificaciones de un usuario como leídas
    // ----------------------------------------------------------
    public function marcarTodasLeidas(int $idUsuario): void
    {
        $stmt = $this->db->prepare(
            'UPDATE NOTIFICACION SET leida = 1
             WHERE  id_usuario = ?'
        );
        $stmt->execute([$idUsuario]);
    }

    // ----------------------------------------------------------
    // Obtener los estudiantes suscritos a un docente (para notificar)
    // Devuelve: id_estudiante, nombre, correo
    // ----------------------------------------------------------
    public function listarSuscritosPorDocente(int $idDocente): array
    {
        $stmt = $this->db->prepare(
            'SELECT s.id_estudiante, u.nombre, u.correo
             FROM   SUSCRIPCION s
             JOIN   USUARIO     u ON u.id_usuario = s.id_estudiante
             WHERE  s.id_docente = ?'
        );
        $stmt->execute([$idDocente]);
        return $stmt->fetchAll();
    }

    // ----------------------------------------------------------
    // Obtener correo y nombre de un usuario por su id
    // ----------------------------------------------------------
    public function buscarCorreoPorId(int $idUsuario): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT nombre, correo FROM USUARIO WHERE id_usuario = ?'
        );
        $stmt->execute([$idUsuario]);
        $row = $stmt->fetch();
        return $row ?: null;
    }
}
