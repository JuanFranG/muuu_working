<?php
// ============================================================
//  MUUU APP · Modelo — HistorialFlashcard
//  Registra cada flashcard respondida en un quiz y provee
//  estadísticas de progreso por tema para el estudiante.
// ============================================================

require_once __DIR__ . '/Conexion.php';

class HistorialFlashcard
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Conexion::obtener();
    }

    // ----------------------------------------------------------
    // Registra el resultado de una flashcard en una sesión de quiz.
    // $resultado: 'correcta' | 'incorrecta'
    // ----------------------------------------------------------
    public function insertar(int $idUsuario, int $idFlashcard, string $resultado): void
    {
        $stmt = $this->db->prepare(
            'INSERT INTO HISTORIAL_FLASHCARD (id_usuario, id_flashcard, resultado)
             VALUES (?, ?, ?)'
        );
        $stmt->execute([$idUsuario, $idFlashcard, $resultado]);
    }

    // ----------------------------------------------------------
    // Devuelve progreso por tema para un estudiante:
    //   tema, total (respuestas), correctas, progreso (%).
    // ----------------------------------------------------------
    public function estadisticasPorTema(int $idUsuario): array
    {
        $stmt = $this->db->prepare(
            'SELECT t.nombre                        AS tema,
                    COUNT(*)                        AS total,
                    SUM(h.resultado = "correcta")   AS correctas
             FROM   HISTORIAL_FLASHCARD h
             JOIN   FLASHCARDS f ON f.id_flashcard = h.id_flashcard
             JOIN   TEMA       t ON t.id_tema      = f.id_tema
             WHERE  h.id_usuario = ?
             GROUP  BY t.id_tema, t.nombre
             ORDER  BY total DESC'
        );
        $stmt->execute([$idUsuario]);
        return $stmt->fetchAll();
    }
}
