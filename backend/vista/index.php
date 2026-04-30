<?php
// ============================================================
//  MUUU APP · Punto de entrada — Vistas Clásicas (MVC Opción B)
//
//  URL pattern:  /vista/?action=<accion>
//
//  Acciones disponibles:
//    login            → UserController::mostrarLogin()
//    registro         → UserController::mostrarRegistro()
//    bienvenida       → UserController::mostrarBienvenida()
//    procesarLogin    → UserController::procesarLogin()   (POST)
//    procesarRegistro → UserController::procesarRegistro() (POST)
//    logout           → cierra sesión y redirige a login
//
//  Sin ?action → redirige a login.
// ============================================================

// Autoload: busca clases en /controlador/ y /modelo/
spl_autoload_register(function (string $clase): void {
    $dirs = [
        __DIR__ . "/../controlador/{$clase}.php",
        __DIR__ . "/../modelo/{$clase}.php",
    ];
    foreach ($dirs as $ruta) {
        if (file_exists($ruta)) {
            require_once $ruta;
            return;
        }
    }
});

// Conexion siempre disponible (modelos la necesitan)
require_once __DIR__ . '/../modelo/Conexion.php';

// Leer la acción solicitada (GET o POST)
$action = trim($_GET['action'] ?? 'login');

// Instanciar el controlador
$ctrl = new UserController();

// Despachar acción
switch ($action) {

    case 'login':
        $ctrl->mostrarLogin();
        break;

    case 'registro':
        $ctrl->mostrarRegistro();
        break;

    case 'bienvenida':
        $ctrl->mostrarBienvenida();
        break;

    case 'procesarLogin':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: ?action=login');
            exit;
        }
        $ctrl->procesarLogin();
        break;

    case 'procesarRegistro':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: ?action=registro');
            exit;
        }
        $ctrl->procesarRegistro();
        break;

    case 'logout':
        session_start();
        session_destroy();
        header('Location: ?action=login');
        exit;

    default:
        // Acción desconocida → redirige a login
        header('Location: ?action=login');
        exit;
}
