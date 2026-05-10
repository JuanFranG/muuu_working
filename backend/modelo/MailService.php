<?php
// ============================================================
//  MUUU APP · Servicio de correo — MailService
//  SMTP directo a Brevo (smtp-relay.brevo.com:587 + STARTTLS)
//  Sin librerías externas — solo sockets PHP nativos.
//
//  Variables de entorno requeridas:
//    BREVO_SMTP_USER  →  aada10001@smtp-brevo.com
//    BREVO_SMTP_PASS  →  (password SMTP de Brevo)
//
//  Uso:
//    MailService::nuevaSuscripcion(...)
//    MailService::nuevaFlashcard(...)
//    MailService::nuevoMaterial(...)
// ============================================================

class MailService
{
    private const SMTP_HOST  = 'smtp-relay.brevo.com';
    private const SMTP_PORT  = 587;
    private const FROM_EMAIL = 'jfgonzalez@unimagdalena.edu.co';
    private const FROM_NAME  = 'MUUU App';

    // =========================================================
    //  Notificación: nuevo suscriptor → al docente
    // =========================================================
    public static function nuevaSuscripcion(
        string $correoDocente,
        string $nombreDocente,
        string $nombreEstudiante
    ): void {
        self::enviar(
            toEmail: $correoDocente,
            toName:  $nombreDocente,
            subject: 'Nuevo suscriptor en MUUU',
            html:    self::plantilla(
                titulo: 'Nuevo suscriptor',
                icono:  '&#127881;',
                cuerpo: "<strong>{$nombreEstudiante}</strong> se ha suscrito a tu perfil en MUUU y ahora podra ver tus flashcards y materiales publicados.",
                pie:    'Sigue creando contenido de calidad para tus estudiantes.'
            ),
            text: "{$nombreEstudiante} se suscribio a tu perfil en MUUU."
        );
    }

    // =========================================================
    //  Notificación: flashcard publicada → a cada suscriptor
    // =========================================================
    public static function nuevaFlashcard(
        string $correoEstudiante,
        string $nombreEstudiante,
        string $nombreDocente,
        string $nombreTema
    ): void {
        self::enviar(
            toEmail: $correoEstudiante,
            toName:  $nombreEstudiante,
            subject: "Nueva flashcard disponible - {$nombreTema}",
            html:    self::plantilla(
                titulo: 'Nueva flashcard publicada',
                icono:  '&#128218;',
                cuerpo: "<strong>{$nombreDocente}</strong> acaba de publicar una nueva flashcard sobre <strong>{$nombreTema}</strong>. Entra a MUUU y ponla a prueba.",
                pie:    'Recuerda que practicar a diario mejora tu racha.'
            ),
            text: "{$nombreDocente} publico una nueva flashcard sobre {$nombreTema}."
        );
    }

    // =========================================================
    //  Notificación: material subido → a cada suscriptor
    // =========================================================
    public static function nuevoMaterial(
        string $correoEstudiante,
        string $nombreEstudiante,
        string $nombreDocente,
        string $tituloMaterial
    ): void {
        self::enviar(
            toEmail: $correoEstudiante,
            toName:  $nombreEstudiante,
            subject: "Nuevo material disponible - {$tituloMaterial}",
            html:    self::plantilla(
                titulo: 'Nuevo material disponible',
                icono:  '&#128196;',
                cuerpo: "<strong>{$nombreDocente}</strong> subio nuevo material de estudio: <strong>{$tituloMaterial}</strong>. Encuentralo en la seccion Aprende un Poco.",
                pie:    'El conocimiento esta a un clic de distancia.'
            ),
            text: "{$nombreDocente} subio nuevo material: {$tituloMaterial}."
        );
    }

    // =========================================================
    //  Envío SMTP con STARTTLS — implementación nativa PHP
    // =========================================================
    public static function enviar(
        string $toEmail,
        string $toName,
        string $subject,
        string $html,
        string $text
    ): void {
        try {
            $user = getenv('BREVO_SMTP_USER') ?: '';
            $pass = getenv('BREVO_SMTP_PASS') ?: '';
            if ($user === '' || $pass === '') return;

            // ── 1. Conectar al servidor SMTP (plain, antes de STARTTLS) ──
            $socket = fsockopen(self::SMTP_HOST, self::SMTP_PORT, $errno, $errstr, 10);
            if (!$socket) return;

            $read = function () use ($socket): string {
                $resp = '';
                while ($line = fgets($socket, 512)) {
                    $resp .= $line;
                    if ($line[3] === ' ') break; // línea final del multiline
                }
                return $resp;
            };
            $send = function (string $cmd) use ($socket): void {
                fwrite($socket, $cmd . "\r\n");
            };

            $read(); // 220 banner

            // ── 2. EHLO ─────────────────────────────────────────────────
            $send('EHLO muuu-app');
            $read();

            // ── 3. STARTTLS ──────────────────────────────────────────────
            $send('STARTTLS');
            $read(); // 220 Go ahead

            // ── 4. Upgrade a TLS ─────────────────────────────────────────
            stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);

            // ── 5. EHLO otra vez (sobre TLS) ─────────────────────────────
            $send('EHLO muuu-app');
            $read();

            // ── 6. AUTH LOGIN ─────────────────────────────────────────────
            $send('AUTH LOGIN');
            $read(); // 334 Username:
            $send(base64_encode($user));
            $read(); // 334 Password:
            $send(base64_encode($pass));
            $read(); // 235 Authentication successful

            // ── 7. Sobre ──────────────────────────────────────────────────
            $send("MAIL FROM:<" . self::FROM_EMAIL . ">");
            $read();
            $send("RCPT TO:<{$toEmail}>");
            $read();
            $send('DATA');
            $read(); // 354 Start input

            // ── 8. Cabeceras + cuerpo multipart ───────────────────────────
            $boundary = 'muuu_' . md5(uniqid());
            $fromFmt  = self::FROM_NAME . ' <' . self::FROM_EMAIL . '>';
            $toFmt    = "{$toName} <{$toEmail}>";
            $date     = date('r');

            $message  = "From: {$fromFmt}\r\n";
            $message .= "To: {$toFmt}\r\n";
            $message .= "Subject: {$subject}\r\n";
            $message .= "Date: {$date}\r\n";
            $message .= "MIME-Version: 1.0\r\n";
            $message .= "Content-Type: multipart/alternative; boundary=\"{$boundary}\"\r\n";
            $message .= "\r\n";
            $message .= "--{$boundary}\r\n";
            $message .= "Content-Type: text/plain; charset=UTF-8\r\n\r\n";
            $message .= $text . "\r\n";
            $message .= "--{$boundary}\r\n";
            $message .= "Content-Type: text/html; charset=UTF-8\r\n\r\n";
            $message .= $html . "\r\n";
            $message .= "--{$boundary}--\r\n";
            $message .= "\r\n.\r\n"; // fin de DATA

            fwrite($socket, $message);
            $read(); // 250 OK

            // ── 9. Cerrar ─────────────────────────────────────────────────
            $send('QUIT');
            fclose($socket);

        } catch (Throwable) {
            // Silencioso — el correo nunca rompe la respuesta HTTP
        }
    }

    // =========================================================
    //  Plantilla HTML base
    // =========================================================
    private static function plantilla(
        string $titulo,
        string $icono,
        string $cuerpo,
        string $pie
    ): string {
        return <<<HTML
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f3ff;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ff;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.08);">
        <tr><td style="background:linear-gradient(135deg,#4a008f,#7c3aed);padding:32px 40px;text-align:center;">
          <div style="font-size:48px;">{$icono}</div>
          <h1 style="color:#ffffff;font-size:22px;margin:12px 0 0;font-weight:700;">{$titulo}</h1>
        </td></tr>
        <tr><td style="padding:36px 40px;">
          <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;">{$cuerpo}</p>
          <p style="color:#6b7280;font-size:13px;font-style:italic;margin:0;">{$pie}</p>
        </td></tr>
        <tr><td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
          <p style="color:#9ca3af;font-size:12px;margin:0;">
            Correo enviado automaticamente por <strong>MUUU App</strong><br>
            Universidad del Magdalena &middot; 2026
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
HTML;
    }
}
