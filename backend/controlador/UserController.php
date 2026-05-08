<?php
// ============================================================
//  MUUU APP · Controlador — UserController
//  Gestiona todo lo relacionado a la entidad USUARIO:
//
//  ── Métodos API (responden JSON) ────────────────────────────
//    login()             POST /api/auth/login
//    loginGoogle()       POST /api/auth/google
//    register()          POST /api/auth/register
//    logout()            POST /api/auth/logout
//    me()                GET  /api/auth/me
//
//  ── Métodos Vista clásica (renderizan PHP/HTML) ──────────────
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

    /** POST /api/auth/google
     *
     *  Flujo de dos pasos para usuarios nuevos:
     *
     *  Paso 1 — sin 'rol' en el body:
     *    · Verifica token con Google
     *    · Si el usuario YA EXISTE  → inicia sesión, devuelve { ok, esNuevo:false, usuario }
     *    · Si el usuario ES NUEVO   → devuelve { ok, esNuevo:true, nombre } (sin sesión)
     *      El frontend muestra la pantalla de selección de rol.
     *
     *  Paso 2 — con 'rol' en el body ('ESTUDIANTE' | 'DOCENTE'):
     *    · Verifica token otra vez (el access_token sigue válido)
     *    · Crea el usuario con el rol elegido
     *    · Inicia sesión y devuelve { ok, esNuevo:false, usuario }
     */
    public function loginGoogle(): void
    {
        $body        = $this->leerBody();
        $accessToken = trim($body['accessToken'] ?? '');
        $rolElegido  = strtoupper(trim($body['rol'] ?? ''));

        if ($accessToken === '') {
            $this->responderJson(400, ['ok' => false, 'mensaje' => 'Token de Google no proporcionado.']);
            return;
        }

        // ── 1. Verificar token con Google userinfo ───────────────────────
        $context    = stream_context_create([
            'http' => [
                'timeout' => 5,
                'header'  => "Authorization: Bearer {$accessToken}\r\n",
            ],
        ]);
        $respGoogle = @file_get_contents(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            false,
            $context
        );

        if ($respGoogle === false) {
            $this->responderJson(502, ['ok' => false, 'mensaje' => 'No se pudo verificar el token con Google. Intenta de nuevo.']);
            return;
        }

        $payload = json_decode($respGoogle, true);

        if (!$payload || empty($payload['sub']) || empty($payload['email'])) {
            $this->responderJson(401, ['ok' => false, 'mensaje' => 'Token de Google inválido.']);
            return;
        }

        if (($payload['email_verified'] ?? false) !== true) {
            $this->responderJson(401, ['ok' => false, 'mensaje' => 'El correo de Google no está verificado.']);
            return;
        }

        $correo   = $payload['email'];
        $nombre   = $payload['name']    ?? $correo;
        $googleId = $payload['sub'];
        $foto     = $payload['picture'] ?? null;

        // ── 2. Buscar usuario existente ──────────────────────────────────
        $usuarioExistente = $this->modelo->buscarPorGoogleOCorreo($correo, $googleId);

        // ── 3a. Usuario existente → vincular googleId si falta y loguear ─
        if ($usuarioExistente !== null) {
            // Vincular googleId si la cuenta era tradicional (sin googleId)
            if (empty($usuarioExistente['googleId'] ?? '')) {
                $this->modelo->vincularGoogle((int) $usuarioExistente['id_usuario'], $googleId);
            }

            if (!(bool) $usuarioExistente['esActivo']) {
                $this->responderJson(403, ['ok' => false, 'mensaje' => 'Cuenta desactivada. Contacta a tu docente.']);
                return;
            }

            session_start();
            $_SESSION['id_usuario'] = $usuarioExistente['id_usuario'];
            $_SESSION['rol']        = $usuarioExistente['rol'];
            $_SESSION['nombre']     = $usuarioExistente['nombre'];

            $this->responderJson(200, ['ok' => true, 'esNuevo' => false, 'usuario' => $usuarioExistente]);
            return;
        }

        // ── 3b. Usuario nuevo y aún no eligió rol → pedir selección ─────
        if ($rolElegido === '') {
            $this->responderJson(200, [
                'ok'      => true,
                'esNuevo' => true,
                'nombre'  => $nombre,
            ]);
            return;
        }

        // ── 3c. Usuario nuevo con rol elegido → crear cuenta ─────────────
        $idRol   = $rolElegido === 'DOCENTE' ? 2 : 1;
        $usuario = $this->modelo->crearConGoogle($correo, $nombre, $googleId, $foto, $idRol);

        if ($usuario === null) {
            $this->responderJson(500, ['ok' => false, 'mensaje' => 'Error al crear tu cuenta. Intenta de nuevo.']);
            return;
        }

        session_start();
        $_SESSION['id_usuario'] = $usuario['id_usuario'];
        $_SESSION['rol']        = $usuario['rol'];
        $_SESSION['nombre']     = $usuario['nombre'];

        $this->responderJson(200, ['ok' => true, 'esNuevo' => false, 'usuario' => $usuario]);
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

    /** PATCH /api/auth/perfil — actualizar nombre y/o contraseña */
    public function actualizarPerfil(): void
    {
        session_start();

        if (empty($_SESSION['id_usuario'])) {
            $this->responderJson(401, ['ok' => false, 'mensaje' => 'No hay sesión activa.']);
            return;
        }

        $id   = (int) $_SESSION['id_usuario'];
        $body = $this->leerBody();

        $nombre           = isset($body['nombre'])           ? trim($body['nombre'])           : null;
        $contrasenaActual = isset($body['contrasenaActual']) ? $body['contrasenaActual']        : null;
        $nuevaContrasena  = isset($body['nuevaContrasena'])  ? $body['nuevaContrasena']         : null;

        // Si quieren cambiar contraseña, validar la actual primero
        if ($nuevaContrasena !== null) {
            if ($contrasenaActual === null) {
                $this->responderJson(400, ['ok' => false, 'mensaje' => 'Debes ingresar tu contraseña actual.']);
                return;
            }
            if (strlen($nuevaContrasena) < 6) {
                $this->responderJson(400, ['ok' => false, 'mensaje' => 'La nueva contraseña debe tener al menos 6 caracteres.']);
                return;
            }
            $hashActual = $this->modelo->obtenerContrasena($id);
            if (!password_verify($contrasenaActual, $hashActual ?? '')) {
                $this->responderJson(401, ['ok' => false, 'mensaje' => 'La contraseña actual no es correcta.']);
                return;
            }
        }

        // Nada que actualizar
        if ($nombre === null && $nuevaContrasena === null) {
            $this->responderJson(400, ['ok' => false, 'mensaje' => 'No hay cambios que guardar.']);
            return;
        }

        // Validar nombre si viene
        if ($nombre !== null && $nombre === '') {
            $this->responderJson(400, ['ok' => false, 'mensaje' => 'El nombre no puede estar vacío.']);
            return;
        }

        $this->modelo->actualizarPerfil($id, $nombre, $nuevaContrasena);

        // Actualizar nombre en sesión si cambió
        if ($nombre !== null) {
            $_SESSION['nombre'] = $nombre;
        }

        $this->responderJson(200, ['ok' => true, 'mensaje' => 'Perfil actualizado correctamente.']);
    }

    /** POST /api/auth/foto — subir/cambiar foto de perfil */
    public function subirFoto(): void
    {
        session_start();

        if (empty($_SESSION['id_usuario'])) {
            http_response_code(401);
            echo json_encode(['ok' => false, 'mensaje' => 'No hay sesión activa.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        if (!isset($_FILES['foto']) || $_FILES['foto']['error'] === UPLOAD_ERR_NO_FILE) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'mensaje' => 'No se recibió ninguna imagen.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $archivo    = $_FILES['foto'];
        $extension  = strtolower(pathinfo($archivo['name'], PATHINFO_EXTENSION));
        $permitidos = ['jpg', 'jpeg', 'png', 'webp'];

        if (!in_array($extension, $permitidos, true)) {
            http_response_code(415);
            echo json_encode(['ok' => false, 'mensaje' => 'Solo se permiten imágenes JPG, PNG o WEBP.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        if ($archivo['size'] > 5242880) { // 5 MB
            http_response_code(413);
            echo json_encode(['ok' => false, 'mensaje' => 'La imagen no puede superar 5 MB.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $dir = '/var/www/html/uploads/';
        if (!is_dir($dir)) mkdir($dir, 0755, true);

        $nombreArchivo = 'foto_' . (int) $_SESSION['id_usuario'] . '_' . time() . '.' . $extension;
        $rutaDestino   = $dir . $nombreArchivo;

        if (!move_uploaded_file($archivo['tmp_name'], $rutaDestino)) {
            http_response_code(500);
            echo json_encode(['ok' => false, 'mensaje' => 'No se pudo guardar la imagen.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $url = '/uploads/' . $nombreArchivo;
        $this->modelo->actualizarFoto((int) $_SESSION['id_usuario'], $url);

        echo json_encode(['ok' => true, 'url' => $url], JSON_UNESCAPED_UNICODE);
    }

    /** DELETE /api/auth/cuenta — eliminar cuenta permanentemente */
    public function eliminarCuenta(): void
    {
        session_start();

        if (empty($_SESSION['id_usuario'])) {
            $this->responderJson(401, ['ok' => false, 'mensaje' => 'No hay sesión activa.']);
            return;
        }

        $id = (int) $_SESSION['id_usuario'];

        try {
            $this->modelo->eliminar($id);
        } catch (\PDOException $e) {
            $this->responderJson(500, ['ok' => false, 'mensaje' => 'Error al eliminar la cuenta: ' . $e->getMessage()]);
            return;
        }

        // Destruir sesión
        session_unset();
        session_destroy();
        if (ini_get('session.use_cookies')) {
            $p = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
        }

        $this->responderJson(200, ['ok' => true, 'mensaje' => 'Cuenta eliminada correctamente.']);
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
