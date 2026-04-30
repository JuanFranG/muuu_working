<?php
// ============================================================
//  MUUU APP · Modelo — Material
//  Gestiona los materiales de estudio subidos por docentes.
//  La tabla MATERIAL en DB tiene tipo VARCHAR(20).
// ============================================================

require_once __DIR__ . '/Conexion.php';

class Material
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Conexion::obtener();
    }

    // ----------------------------------------------------------
    // Listar todos los materiales publicados (para estudiantes)
    // ----------------------------------------------------------
    public function listarTodos(): array
    {
        $stmt = $this->db->prepare(
            "SELECT m.id_material,
                    m.titulo,
                    m.tipo,
                    m.urlArchivo,
                    m.fechaCarga,
                    t.nombre    AS tema,
                    d.nombre    AS dificultad,
                    u.nombre    AS docente,
                    u.fotoPerfil AS docenteFoto
             FROM   MATERIAL  m
             JOIN   TEMA      t ON t.id_tema       = m.id_tema
             JOIN   DIFICULTAD d ON d.id_dificultad = m.id_dificultad
             JOIN   USUARIO   u ON u.id_usuario    = m.id_usuario
             ORDER  BY m.fechaCarga DESC"
        );
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // ----------------------------------------------------------
    // Listar materiales de un docente específico
    // ----------------------------------------------------------
    public function listarPorDocente(int $idUsuario): array
    {
        $stmt = $this->db->prepare(
            "SELECT m.id_material,
                    m.titulo,
                    m.tipo,
                    m.urlArchivo,
                    m.fechaCarga,
                    t.nombre    AS tema,
                    d.nombre    AS dificultad
             FROM   MATERIAL  m
             JOIN   TEMA      t ON t.id_tema       = m.id_tema
             JOIN   DIFICULTAD d ON d.id_dificultad = m.id_dificultad
             WHERE  m.id_usuario = ?
             ORDER  BY m.fechaCarga DESC"
        );
        $stmt->execute([$idUsuario]);
        return $stmt->fetchAll();
    }

    // ----------------------------------------------------------
    // Crear un material nuevo
    // Devuelve el id_material recién creado.
    // ----------------------------------------------------------
    public function crear(
        string $titulo,
        string $tipo,
        string $urlArchivo,
        int    $idTema,
        int    $idDificultad,
        int    $idUsuario
    ): int {
        $stmt = $this->db->prepare(
            'INSERT INTO MATERIAL
                (titulo, tipo, urlArchivo, id_tema, id_dificultad, id_usuario)
             VALUES (?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([$titulo, $tipo, $urlArchivo, $idTema, $idDificultad, $idUsuario]);
        return (int) $this->db->lastInsertId();
    }

    // ----------------------------------------------------------
    // Buscar un material por id (con id_tema e id_dificultad para edición)
    // ----------------------------------------------------------
    public function buscarPorId(int $id): ?array
    {
        $stmt = $this->db->prepare(
            "SELECT m.id_material,
                    m.titulo,
                    m.tipo,
                    m.urlArchivo,
                    m.fechaCarga,
                    m.id_tema,
                    m.id_dificultad,
                    m.id_usuario,
                    t.nombre    AS tema,
                    d.nombre    AS dificultad
             FROM   MATERIAL   m
             JOIN   TEMA        t ON t.id_tema        = m.id_tema
             JOIN   DIFICULTAD  d ON d.id_dificultad  = m.id_dificultad
             WHERE  m.id_material = ?"
        );
        $stmt->execute([$id]);
        $fila = $stmt->fetch();
        return $fila ?: null;
    }

    // ----------------------------------------------------------
    // Actualizar un material (el archivo es opcional: si viene
    // vacío se conserva la urlArchivo anterior)
    // ----------------------------------------------------------
    public function actualizar(
        int    $id,
        string $titulo,
        string $tipo,
        string $urlArchivo,
        int    $idTema,
        int    $idDificultad
    ): bool {
        $stmt = $this->db->prepare(
            'UPDATE MATERIAL
             SET titulo = ?, tipo = ?, urlArchivo = ?,
                 id_tema = ?, id_dificultad = ?
             WHERE id_material = ?'
        );
        $stmt->execute([$titulo, $tipo, $urlArchivo, $idTema, $idDificultad, $id]);
        return $stmt->rowCount() > 0;
    }

    // ----------------------------------------------------------
    // Eliminar un material
    // ----------------------------------------------------------
    public function eliminar(int $id): bool
    {
        $stmt = $this->db->prepare('DELETE FROM MATERIAL WHERE id_material = ?');
        $stmt->execute([$id]);
        return $stmt->rowCount() > 0;
    }

    // ----------------------------------------------------------
    // Lista materiales de un docente concreto (vista pública:
    // incluye nombre/foto del docente, para el filtro del estudiante)
    // ----------------------------------------------------------
    public function listarPublicosPorDocente(int $idDocente): array
    {
        $stmt = $this->db->prepare(
            "SELECT m.id_material,
                    m.titulo,
                    m.tipo,
                    m.urlArchivo,
                    m.fechaCarga,
                    t.nombre    AS tema,
                    d.nombre    AS dificultad,
                    u.nombre    AS docente,
                    u.fotoPerfil AS docenteFoto
             FROM   MATERIAL   m
             JOIN   TEMA        t ON t.id_tema        = m.id_tema
             JOIN   DIFICULTAD  d ON d.id_dificultad  = m.id_dificultad
             JOIN   USUARIO     u ON u.id_usuario     = m.id_usuario
             WHERE  m.id_usuario = ?
             ORDER  BY m.fechaCarga DESC"
        );
        $stmt->execute([$idDocente]);
        return $stmt->fetchAll();
    }

    // ----------------------------------------------------------
    // Docentes que tienen al menos un material cargado
    // (para la pantalla de selección del estudiante)
    // ----------------------------------------------------------
    public function listarDocentesConMateriales(): array
    {
        $stmt = $this->db->prepare(
            "SELECT u.id_usuario,
                    u.nombre,
                    u.fotoPerfil,
                    COUNT(m.id_material)  AS totalMateriales,
                    (SELECT t2.nombre
                     FROM   MATERIAL  m2
                     JOIN   TEMA      t2 ON t2.id_tema = m2.id_tema
                     WHERE  m2.id_usuario = u.id_usuario
                     GROUP  BY m2.id_tema
                     ORDER  BY COUNT(*) DESC
                     LIMIT  1) AS temaPrincipal
             FROM   USUARIO   u
             JOIN   ROL       r ON r.id_rol      = u.id_rol
             JOIN   MATERIAL  m ON m.id_usuario  = u.id_usuario
             WHERE  r.nombre = 'DOCENTE'
             GROUP  BY u.id_usuario, u.nombre, u.fotoPerfil
             ORDER  BY totalMateriales DESC"
        );
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
