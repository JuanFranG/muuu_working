<?php
// ============================================================
//  MUUU APP · Modelo — Tema
//  Operaciones CRUD sobre la tabla TEMA.
// ============================================================

require_once __DIR__ . '/Conexion.php';

class Tema
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Conexion::obtener();
    }

    // Devuelve todos los temas ordenados por id (sin stats)
    public function listar(): array
    {
        $stmt = $this->db->query(
            'SELECT id_tema, nombre, descripcion, icono
             FROM   TEMA
             ORDER BY id_tema'
        );
        return $stmt->fetchAll();
    }

    // Devuelve todos los temas con conteos de flashcards y materiales asociados
    public function listarConEstadisticas(): array
    {
        $stmt = $this->db->query(
            'SELECT
                 t.id_tema,
                 t.nombre,
                 t.descripcion,
                 t.icono,
                 COUNT(DISTINCT f.id_flashcard) AS totalFlashcards,
                 COUNT(DISTINCT m.id_material)  AS totalMateriales
             FROM   TEMA t
             LEFT JOIN FLASHCARDS f ON f.id_tema = t.id_tema
             LEFT JOIN MATERIAL   m ON m.id_tema = t.id_tema
             GROUP BY t.id_tema, t.nombre, t.descripcion, t.icono
             ORDER BY t.id_tema'
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

    // Crea un nuevo tema y devuelve el id generado
    public function crear(string $nombre, ?string $descripcion, ?string $icono): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO TEMA (nombre, descripcion, icono)
             VALUES (?, ?, ?)'
        );
        $stmt->execute([$nombre, $descripcion, $icono]);
        return (int) $this->db->lastInsertId();
    }

    // Devuelve cuántos recursos (flashcards + materiales) usan este tema
    public function contarVinculos(int $id): int
    {
        $stmt = $this->db->prepare(
            'SELECT
                 (SELECT COUNT(*) FROM FLASHCARDS WHERE id_tema = ?) +
                 (SELECT COUNT(*) FROM MATERIAL   WHERE id_tema = ?) AS total'
        );
        $stmt->execute([$id, $id]);
        return (int) ($stmt->fetchColumn() ?? 0);
    }

    // Elimina un tema (solo si no tiene vínculos)
    public function eliminar(int $id): void
    {
        $stmt = $this->db->prepare('DELETE FROM TEMA WHERE id_tema = ?');
        $stmt->execute([$id]);
    }
}
