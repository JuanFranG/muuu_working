<?php
// ============================================================
//  MUUU APP · Modelo — Ranking
//  Gestiona la tabla RANKING (puntos, posiciones).
// ============================================================

require_once __DIR__ . '/Conexion.php';

class Ranking
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Conexion::obtener();
    }

    // ----------------------------------------------------------
    // Devuelve los top N estudiantes con puntos y nivel.
    // ----------------------------------------------------------
    public function listarTop(int $limite = 20): array
    {
        $stmt = $this->db->prepare(
            'SELECT u.id_usuario,
                    u.nombre,
                    u.fotoPerfil,
                    COALESCE(rk.puntos, 0)              AS puntos,
                    FLOOR(COALESCE(rk.puntos, 0) / 500) AS nivel
             FROM   USUARIO u
             JOIN   ROL r ON r.id_rol = u.id_rol
             LEFT JOIN RANKING rk ON rk.id_usuario = u.id_usuario
             WHERE  r.nombre = "estudiante" AND u.esActivo = 1
             ORDER  BY puntos DESC
             LIMIT  ?'
        );
        $stmt->bindValue(1, $limite, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // ----------------------------------------------------------
    // Suma puntos al estudiante. Inserta fila si no existe.
    // Luego recalcula todas las posiciones.
    // ----------------------------------------------------------
    public function sumarPuntos(int $idUsuario, int $puntos): void
    {
        // posicion = 0 como placeholder; el UPDATE de abajo la recalcula al instante
        $stmt = $this->db->prepare(
            'INSERT INTO RANKING (id_usuario, puntos, posicion)
             VALUES (?, ?, 0)
             ON DUPLICATE KEY UPDATE puntos = puntos + VALUES(puntos)'
        );
        $stmt->execute([$idUsuario, $puntos]);

        // Recalcular posiciones con ROW_NUMBER (MySQL 8+)
        $this->db->exec(
            'UPDATE RANKING r
             JOIN (
                 SELECT id_usuario,
                        ROW_NUMBER() OVER (ORDER BY puntos DESC) AS nueva_pos
                 FROM   RANKING
             ) ranked ON r.id_usuario = ranked.id_usuario
             SET r.posicion = ranked.nueva_pos'
        );
    }
}
