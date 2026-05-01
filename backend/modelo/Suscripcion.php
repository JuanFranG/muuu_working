<?php
// ============================================================
//  MUUU APP · Modelo — Suscripcion
//  Gestiona la tabla SUSCRIPCION (id_estudiante, id_docente).
//  Solo interactúa con la DB; no sabe nada de HTTP.
// ============================================================

require_once __DIR__ . '/Conexion.php';

class Suscripcion
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Conexion::obtener();
    }

    // ----------------------------------------------------------
    // Suscribir un estudiante a un docente (INSERT IGNORE)
    // ----------------------------------------------------------
    public function suscribir(int $idEstudiante, int $idDocente): void
    {
        $stmt = $this->db->prepare(
            'INSERT IGNORE INTO SUSCRIPCION (id_estudiante, id_docente)
             VALUES (?, ?)'
        );
        $stmt->execute([$idEstudiante, $idDocente]);
    }

    // ----------------------------------------------------------
    // Desuscribir un estudiante de un docente (DELETE)
    // ----------------------------------------------------------
    public function desuscribir(int $idEstudiante, int $idDocente): void
    {
        $stmt = $this->db->prepare(
            'DELETE FROM SUSCRIPCION
             WHERE id_estudiante = ? AND id_docente = ?'
        );
        $stmt->execute([$idEstudiante, $idDocente]);
    }

    // ----------------------------------------------------------
    // Verificar si un estudiante está suscrito a un docente
    // ----------------------------------------------------------
    public function esSuscrito(int $idEstudiante, int $idDocente): bool
    {
        $stmt = $this->db->prepare(
            'SELECT COUNT(*) FROM SUSCRIPCION
             WHERE id_estudiante = ? AND id_docente = ?'
        );
        $stmt->execute([$idEstudiante, $idDocente]);
        return (int) $stmt->fetchColumn() > 0;
    }

    // ----------------------------------------------------------
    // Listar los id_docente a los que está suscrito un estudiante
    // ----------------------------------------------------------
    public function listarDocentes(int $idEstudiante): array
    {
        $stmt = $this->db->prepare(
            'SELECT id_docente FROM SUSCRIPCION
             WHERE id_estudiante = ?'
        );
        $stmt->execute([$idEstudiante]);
        return array_column($stmt->fetchAll(), 'id_docente');
    }

    // ----------------------------------------------------------
    // Contar cuántos estudiantes están suscritos a un docente
    // ----------------------------------------------------------
    public function contarSuscritos(int $idDocente): int
    {
        $stmt = $this->db->prepare(
            'SELECT COUNT(*) FROM SUSCRIPCION
             WHERE id_docente = ?'
        );
        $stmt->execute([$idDocente]);
        return (int) $stmt->fetchColumn();
    }
}
