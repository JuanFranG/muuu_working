<?php
// ============================================================
//  MUUU APP · Modelo — Tema
//  Lee los temas de la tabla TEMA.
// ============================================================

require_once __DIR__ . '/Conexion.php';

class Tema
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Conexion::obtener();
    }

    // Devuelve todos los temas ordenados por id
    public function listar(): array
    {
        $stmt = $this->db->query(
            'SELECT id_tema, nombre, descripcion, icono
             FROM   TEMA
             ORDER BY id_tema'
        );

        return $stmt->fetchAll();
    }

    // Busca un tema por id
    public function buscarPorId(int $id): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT id_tema, nombre, descripcion, icono
             FROM   TEMA
             WHERE  id_tema = ?
             LIMIT  1'
        );
        $stmt->execute([$id]);
        $fila = $stmt->fetch();

        return $fila ?: null;
    }
}
