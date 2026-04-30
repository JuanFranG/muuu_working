<?php
// ============================================================
//  MUUU APP · Controlador — UserController
//  Gestiona todo lo relacionado a la entidad USUARIO:
//
//  ── Métodos API (responden JSON) ─────────────────────────
//    login()             POST /api/auth/login
//    register()          POST /api/auth/register
//    logout()            POST /api/auth/logout
//    me()                GET  /api/auth/me
//
//  ── Métodos Vista clásica (renderizan PHP/HTML) ──────────
//    mostrarLogin()      GET  ?action=login
//    mostrarRegistro()   GET  ?action=registro
//    mostrarBienvenida() GET  ?action=bienvenida
//    procesarLogin()     POST ?action=procesarLogin
//    procesarRegistro()  POST ?action=procesarRegistro
// ============================================================

require_once __DIR__ . '/../modelo/Usuario.php';

class UserController
{
    private Usuario $modelo;

    public function __construct()
    {
        $this->modelo = new Usuario();
    }

    // =========================================================
    //  MÉTODOS API — responden JSON
    //  Usados por el frontend React vía /api/auth/*
    // =========================================================

    /** POST /api/auth/login */
    public function login(): void
    {
        $body       = $this->leerBody();
        $correo     = trim($body['correo']    ?? '');
        $contrasena = $body['contrasena'] ?? '';

        if ($correo === '' || $contrasena === '') {
            $this->responderJson(400, ['ok' => false, 'mensaje' => 'Correo y contraseña son requeridos.']);
            return;
        }

        $usuario = $this->modelo->buscarPorCorreo($correo);

        if ($usuario === null) {
            $this->responderJson(401, ['ok' => false, 'mensaje' => 'Correo no encontrado.']);
            return;
        }

        if (!(bool) $usuario['esActivo']) {
            $this->responderJson(403, ['ok' => false, 'mensaje' => 'Cuenta desactivada. Contacta a tu docente.']);
            return;
        }

        if (!password_verify($contrasena, $usuario['contrasena'])) {
            $this->responderJson(401, ['ok' => false, 'mensaje' => 'Contraseña incorrecta.']);
            return;
        }

        session_start();
        $_SESSION['id_usuario'] = $usuario['id_usuario'];
        $_SESSION['rol']        = $usuario['rol'];
        $_SESSION['nombre']     = $usuario['nombre'];

        unset($usuario['contrasena']);

        $this->responderJson(200, ['ok' => true, 'usuario' => $usuario]);
    }

    /** POST /api/auth/register */
    public function register(): void
    {
        $body       = $this->leerBody();
        $nombre     = trim($body['nombre']    ?? '');
        $correo     = trim($body['correo']    ?? '');
        $contrasena = $body['contrasena'] ?? '';
        $rol        = strtoupper(trim($body['rol'] ?? 'ESTUDIANTE'));

        if ($nombre === '' || $correo === '' || $contrasena === '') {
            $this->responderJson(400, ['ok' => false, 'mensaje' => 'Nombre, correo y contraseña son requeridos.']);
            return;
        }

        if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
            $this->responderJson(400, ['ok' => false, 'mensaje' => 'El correo no tiene un formato válido.']);
            return;
        }

        if (strlen($contrasena) < 6) {
            $this->responderJson(400, ['ok' => false, 'mensaje' => 'La contraseña debe tener al menos 6 caracteres.']);
            return;
        }

        $idRol = $rol === 'DOCENTE' ? 2 : 1;

        try {
            $idNuevo = $this->modelo->registrar($nombre, $correo, $contrasena, $idRol);
        } catch (PDOException $e) {
            if (str_starts_with((string) $e->getCode(), '23')) {
                $this->responderJson(409, ['ok' => false, 'mensaje' => 'Ese correo ya está registrado.']);
            } else {
                $this->responderJson(500, ['ok' => false, 'mensaje' => 'Error interno. Intenta de nuevo.']);
            }
            return;
        }

        $this->responderJson(201, ['ok' => true, 'mensaje' => 'Registro exitoso.', 'id_usuario' => $idNuevo]);
    }

    /** POST /api/auth/logout */
    public function logout(): void
    {
        session_start();
        session_destroy();
        $this->responderJson(200, ['ok' => true, 'mensaje' => 'Sesión cerrada.']);
    }

    /** GET /api/auth/me */
    public function me(): void
    {
        session_start();

        if (empty($_SESSION['id_usuario'])) {
            $this->responderJson(401, ['ok' => false, 'mensaje' => 'No hay sesión activa.']);
            return;
        }

        $usuario = $this->modelo->buscarPorId((int) $_SESSION['id_usuario']);

        if ($usuario === null) {
            $this->responderJson(401, ['ok' => false, 'mensaje' => 'Sesión inválida.']);
            return;
        }

        $this->responderJson(200, ['ok' => true, 'usuario' => $usuario]);
    }

    // =========================================================
    //  MÉTODOS VISTA CLÁSICA — renderizan PHP/HTML
    //  Usados por vista/index.php vía ?action=...
    //  Cumplen el patrón MVC clásico del taller
    // =========================================================

    /** Muestra el formulario de inicio de sesión */
    public function mostrarLogin(): void
    {
        require __DIR__ . '/../vista/login.php';
    }

    /** Muestra el formulario de registro */
    public function mostrarRegistro(): void
    {
        require __DIR__ . '/../vista/registro.php';
    }

    /** Muestra la pantalla de bienvenida (requiere sesión activa) */
    public function mostrarBienvenida(): void
    {
        session_start();
        if (empty($_SESSION['id_usuario'])) {
            header('Location: ?action=login');
            exit;
        }
        require __DIR__ . '/../vista/bienvenida.php';
    }

    /** Procesa el formulario de login (POST desde vista/login.php) */
    public function procesarLogin(): void
    {
        session_start();
        $correo     = trim($_POST['correo']    ?? '');
        $contrasena = $_POST['contrasena'] ?? '';

        $usuario = $this->modelo->buscarPorCorreo($correo);

        if ($usuario && (bool) $usuario['esActivo'] && password_verify($contrasena, $usuario['contrasena'])) {
            $_SESSION['id_usuario'] = $usuario['id_usuario'];
            $_SESSION['rol']        = $usuario['rol'];
            $_SESSION['nombre']     = $usuario['nombre'];
            header('Location: ?action=bienvenida');
        } else {
            header('Location: ?action=login&error=credenciales');
        }
        exit;
    }

    /** Procesa el formulario de registro (POST desde vista/registro.php) */
    public function procesarRegistro(): void
    {
        $nombre     = trim($_POST['nombre']    ?? '');
        $correo     = trim($_POST['correo']    ?? '');
        $contrasena = $_POST['contrasena'] ?? '';
        $rol        = $_POST['rol'] ?? 'ESTUDIANTE';
        $idRol      = $rol === 'DOCENTE' ? 2 : 1;

        try {
            $this->modelo->registrar($nombre, $correo, $contrasena, $idRol);
            header('Location: ?action=login&registro=exitoso');
        } catch (PDOException $e) {
            $errorCode = str_starts_with((string) $e->getCode(), '23') ? 'duplicado' : 'interno';
            header("Location: ?action=registro&error={$errorCode}");
        }
        exit;
    }

    // =========================================================
    //  HELPERS PRIVADOS
    // =========================================================

    /** Lee el body JSON del request (para métodos API) */
    private function leerBody(): array
    {
        return json_decode(file_get_contents('php://input'), true) ?? [];
    }

    /** Envía respuesta JSON con código HTTP (para métodos API) */
    private function responderJson(int $status, array $data): void
    {
        http_response_code($status);
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
    }
}
