<?php
// ============================================================
//  MUUU APP · Router central (Front Controller)
//  Todas las peticiones al backend pasan por aquí.
//
//  Rutas estáticas:
//    POST /api/auth/login
//    POST /api/auth/register
//    POST /api/auth/logout
//    GET  /api/auth/me
//    GET  /api/temas
//    GET  /api/dificultades
//    GET  /api/flashcards         (acepta ?docente=id para Ponte a Prueba)
//    POST /api/flashcards
//    GET  /api/materiales
//    POST /api/materiales
//    GET  /api/docentes           (lista docentes con flashcards publicadas)
//
//  Rutas dinámicas (con parámetro :id):
//    DELETE /api/flashcards/{id}
//    PATCH  /api/flashcards/{id}/publicar
//    PATCH  /api/flashcards/{id}/borrador
// ============================================================

// --- 0. Buffer + manejadores de error en JSON ----------------
ob_start();

set_error_handler(function (int $errno, string $errstr): bool {
    throw new ErrorException($errstr, 0, $errno);
});

set_exception_handler(function (Throwable $e): void {
    ob_clean();
    http_response_code(500);
    echo json_encode([
        'ok'      => false,
        'mensaje' => 'Error interno: ' . $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE);
});

// --- 1. Headers globales JSON --------------------------------
header('Content-Type: application/json; charset=utf-8');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// --- 2. Extraer ruta y método --------------------------------
$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri    = preg_replace('#^/api/#', '', $uri);
$uri    = trim($uri, '/');
$metodo = $_SERVER['REQUEST_METHOD'];
$clave  = "{$metodo}:{$uri}";

// --- 3. Autoload ---------------------------------------------
spl_autoload_register(function (string $clase): void {
    $dirs = [
        __DIR__ . "/modelo/{$clase}.php",
        __DIR__ . "/controlador/{$clase}.php",
    ];
    foreach ($dirs as $ruta) {
        if (file_exists($ruta)) {
            require_once $ruta;
            return;
        }
    }
});

require_once __DIR__ . '/modelo/Conexion.php';

// --- 4. Rutas estáticas --------------------------------------
$rutasEstaticas = [
    // Auth
    'POST:auth/login'    => ['UserController',      'login'],
    'POST:auth/google'   => ['UserController',      'loginGoogle'],
    'POST:auth/register' => ['UserController',      'register'],
    'POST:auth/logout'   => ['UserController',      'logout'],
    'GET:auth/me'        => ['UserController',      'me'],
    'PATCH:auth/perfil'  => ['UserController',      'actualizarPerfil'],
    'POST:auth/foto'     => ['UserController',      'subirFoto'],
    'DELETE:auth/cuenta' => ['UserController',      'eliminarCuenta'],
    // Catálogos
    'GET:temas'          => ['FlashcardController', 'listarTemas'],
    'GET:dificultades'   => ['FlashcardController', 'listarDificultades'],
    // Flashcards (sin ID)
    'GET:flashcards'     => ['FlashcardController', 'listar'],
    'POST:flashcards'    => ['FlashcardController', 'crear'],
    // Materiales
    'GET:materiales'            => ['MaterialController',  'listar'],
    'POST:materiales'           => ['MaterialController',  'crear'],
    // Docentes con flashcards (Ponte a Prueba) y con materiales (Aprende un Poco)
    'GET:docentes'              => ['MaterialController',  'listarDocentes'],
    'GET:docentes-materiales'   => ['MaterialController',  'listarDocentesMateriales'],
    // Subida de archivos (solo docentes)
    'POST:upload'        => ['UploadController',    'subir'],
    // Temas — estadísticas y creación
    'GET:temas-estadisticas' => ['TemaController',  'listarConEstadisticas'],
    'POST:temas'             => ['TemaController',  'crear'],
    // Suscripciones
    'GET:suscripciones'      => ['SuscripcionController', 'listar'],
    'POST:suscripciones'     => ['SuscripcionController', 'suscribir'],
    // Notificaciones
    'GET:notificaciones'              => ['NotificacionController', 'listar'],
    'GET:notificaciones/no-leidas'    => ['NotificacionController', 'contarNoLeidas'],
    'PATCH:notificaciones/leer-todas' => ['NotificacionController', 'marcarTodasLeidas'],
    // Seed + diagnóstico temporal
    'GET:seed'                           => ['SeedController',    'seed'],
    'GET:seed/test-email'                => ['SeedController',    'testEmail'],
    // Ranking y estadísticas
    'GET:ranking'                        => ['RankingController', 'listar'],
    'POST:quiz/resultado'                => ['RankingController', 'guardarResultado'],
    'GET:estadisticas/estudiante'        => ['RankingController', 'estadisticasEstudiante'],
    'GET:estadisticas/docente'           => ['RankingController', 'estadisticasDocente'],
];

if (isset($rutasEstaticas[$clave])) {
    [$clase, $accion] = $rutasEstaticas[$clave];
    (new $clase())->$accion();
    ob_end_flush();
    exit;
}

// --- 5. Rutas dinámicas (con parámetro numérico :id) ---------
$rutasDinamicas = [
    '#^GET:flashcards/(\d+)$#'              => ['FlashcardController', 'obtener'],
    '#^PUT:flashcards/(\d+)$#'              => ['FlashcardController', 'actualizar'],
    '#^DELETE:flashcards/(\d+)$#'           => ['FlashcardController', 'eliminar'],
    '#^PATCH:flashcards/(\d+)/publicar$#'   => ['FlashcardController', 'publicar'],
    '#^PATCH:flashcards/(\d+)/borrador$#'   => ['FlashcardController', 'borrador'],
    // Temas — eliminar por id
    '#^DELETE:temas/(\d+)$#'               => ['TemaController',      'eliminar'],
    // Materiales CRUD por id
    '#^GET:materiales/(\d+)$#'              => ['MaterialController',  'obtener'],
    '#^PUT:materiales/(\d+)$#'              => ['MaterialController',  'actualizar'],
    '#^DELETE:materiales/(\d+)$#'           => ['MaterialController',  'eliminarMaterial'],
    // Suscripciones — desuscribir por id_docente
    '#^DELETE:suscripciones/(\d+)$#'             => ['SuscripcionController',    'desuscribir'],
    // Notificaciones por id
    '#^DELETE:notificaciones/(\d+)$#'            => ['NotificacionController',   'eliminar'],
    '#^PATCH:notificaciones/(\d+)/leer$#'        => ['NotificacionController',   'marcarLeida'],
    // Materiales — acceso y descarga
    '#^POST:materiales/(\d+)/acceso$#'           => ['MaterialController',       'registrarAcceso'],
    '#^POST:materiales/(\d+)/descarga$#'         => ['MaterialController',       'registrarDescarga'],
];

foreach ($rutasDinamicas as $patron => [$clase, $accion]) {
    if (preg_match($patron, $clave, $coincidencias)) {
        $id = (int) $coincidencias[1];
        (new $clase())->$accion($id);
        ob_end_flush();
        exit;
    }
}

// --- 6. Ruta no encontrada -----------------------------------
http_response_code(404);
echo json_encode([
    'ok'      => false,
    'mensaje' => "Ruta no encontrada: [{$metodo}] /api/{$uri}",
], JSON_UNESCAPED_UNICODE);

ob_end_flush();
