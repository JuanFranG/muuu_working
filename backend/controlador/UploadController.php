<?php
// ============================================================
//  MUUU APP · UploadController
//  Maneja la subida de archivos al servidor.
//  Solo accesible por docentes autenticados.
// ============================================================

class UploadController
{
    public function subir(): void
    {
        // --- Verificar sesión de docente ----------------------
        session_start();
        if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'DOCENTE') {
            http_response_code(401);
            echo json_encode([
                'ok'      => false,
                'mensaje' => 'No autorizado. Solo los docentes pueden subir archivos.',
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        // --- Verificar que llegó un archivo -------------------
        if (!isset($_FILES['archivo']) || $_FILES['archivo']['error'] === UPLOAD_ERR_NO_FILE) {
            http_response_code(400);
            echo json_encode([
                'ok'      => false,
                'mensaje' => 'No se recibió ningún archivo.',
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        $archivo = $_FILES['archivo'];

        // --- Verificar errores de subida ----------------------
        if ($archivo['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode([
                'ok'      => false,
                'mensaje' => 'Error al recibir el archivo. Código: ' . $archivo['error'],
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        // --- Validar tamaño (máx. 50 MB) ---------------------
        if ($archivo['size'] > 52428800) {
            http_response_code(413);
            echo json_encode([
                'ok'      => false,
                'mensaje' => 'El archivo supera el tamaño máximo permitido (50 MB).',
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        // --- Validar extensión --------------------------------
        $extensionesPermitidas = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'mp4', 'mov'];
        $nombreOriginal        = $archivo['name'];
        $extension             = strtolower(pathinfo($nombreOriginal, PATHINFO_EXTENSION));

        if (!in_array($extension, $extensionesPermitidas, true)) {
            http_response_code(415);
            echo json_encode([
                'ok'      => false,
                'mensaje' => "Tipo de archivo no permitido: .{$extension}. Tipos aceptados: " . implode(', ', $extensionesPermitidas),
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        // --- Preparar directorio de destino ------------------
        $dir = '/var/www/html/uploads/';
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        // --- Generar nombre único y mover el archivo ----------
        $nombreArchivo = uniqid() . '_' . time() . '.' . $extension;
        $rutaDestino   = $dir . $nombreArchivo;

        if (!move_uploaded_file($archivo['tmp_name'], $rutaDestino)) {
            http_response_code(500);
            echo json_encode([
                'ok'      => false,
                'mensaje' => 'No se pudo guardar el archivo en el servidor.',
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        // --- Respuesta exitosa --------------------------------
        // Devolvemos ruta relativa para que el frontend la resuelva
        // a través del proxy Vite → nginx, sin depender del host/puerto.
        $url = '/uploads/' . $nombreArchivo;

        echo json_encode([
            'ok'  => true,
            'url' => $url,
        ], JSON_UNESCAPED_UNICODE);
    }
}
