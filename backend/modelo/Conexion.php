<?php
// ============================================================
//  MUUU APP · Modelo — Conexion
//  Patrón Singleton: una sola instancia PDO por request.
//
//  Diferencia respecto al taller:
//    Taller → mysqli procedural
//    Aquí  → PDO con prepared statements tipados
//            (más seguro, misma idea del taller)
// ============================================================

class Conexion
{
    private static ?PDO $instancia = null;

    /**
     * Devuelve la instancia única de PDO.
     * La crea la primera vez que se llama.
     */
    public static function obtener(): PDO
    {
        if (self::$instancia === null) {
            $cfg = require __DIR__ . '/../config/config.php';

            $dsn = sprintf(
                'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
                $cfg['host'],
                $cfg['puerto'],
                $cfg['nombre']
            );

            self::$instancia = new PDO($dsn, $cfg['usuario'], $cfg['contrasena'], [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8mb4' COLLATE 'utf8mb4_unicode_ci'",
            ]);
        }

        return self::$instancia;
    }

    // Evita que se clone o serialice la instancia
    private function __construct() {}
    private function __clone() {}
}
