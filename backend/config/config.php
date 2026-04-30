<?php
// ============================================================
//  MUUU APP · Configuración de base de datos
//  Lee las variables de entorno inyectadas por Docker Compose.
//  En local sin Docker: ajustar los valores por defecto.
// ============================================================

// $_ENV no se puebla en PHP 8 por defecto (variables_order omite 'E').
// getenv() lee directamente las variables del proceso — siempre funciona.
return [
    'host'      => getenv('DB_HOST')     ?: 'localhost',
    'puerto'    => getenv('DB_PORT')     ?: '3306',
    'nombre'    => getenv('DB_NAME')     ?: 'muuu_db',
    'usuario'   => getenv('DB_USER')     ?: 'muuu_user',
    'contrasena'=> getenv('DB_PASSWORD') ?: '',
];
