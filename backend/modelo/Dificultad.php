<?php
// ============================================================
//  MUUU APP · Modelo — Dificultad
//  Lee los niveles de dificultad de la tabla DIFICULTAD.
// ============================================================

require_once __DIR__ . '/Conexion.php';

class Dificultad
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Conexion::obtener();
    }

    // Devuelve todas las dificultades ordenadas por id
    public function listar(): array
    {
        $stmt = $this->db->query(
            'SELECT id_dificultad, nombre
             FROM   DIFICULTAD
             ORDER BY id_dificultad'
        );

        return $stmt->fetchAll();
    }
}
