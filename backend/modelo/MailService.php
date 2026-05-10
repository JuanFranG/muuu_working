<?php
// ============================================================
//  MUUU APP · Servicio de correo — MailService
//  Integración con Brevo Transactional Email API (sin Composer)
//
//  Uso:
//    MailService::nuevaSuscripcion($correoDocente, $nombreDocente, $nombreEst)
//    MailService::nuevaFlashcard($correoEst, $nombreEst, $nombreDocente, $tema)
//    MailService::nuevoMaterial($correoEst, $nombreEst, $nombreDocente, $titulo)
//
//  Requiere extensión PHP curl (instalada en Dockerfile).
//  Token leído de variable de entorno BREVO_KEY.
//  Siempre silencioso — nunca lanza excepción al caller.
// ============================================================

class MailService
{
    private const API_URL    = 'https://api.brevo.com/v3/smtp/email';
    private const FROM_EMAIL = 'jfgonzalez@unimagdalena.edu.co';
    private const FROM_NAME  = 'MUUU App';

    // =========================================================
    //  Notificación: nuevo suscriptor  →  al docente
    // =========================================================
    public static function nuevaSuscripcion(
        string $correoDocente,
        string $nombreDocente,
        string $nombreEstudiante
    ): void {
        self::enviar(
            toEmail: $correoDocente,
            toName:  $nombreDocente,
            subject: '¡Tienes un nuevo suscriptor en MUUU!',
            html:    self::plantilla(
                titulo:  '¡Nuevo suscriptor!',
                icono:   '🎉',
                cuerpo:  "<strong>{$nombreEstudiante}</strong> se ha suscrito a tu perfil en MUUU y ahora podrá ver tus flashcards y materiales publicados.",
                pie:     "Sigue creando contenido de calidad para tus estudiantes."
            ),
            text: "{$nombreEstudiante} se suscribió a tu perfil en MUUU."
        );
    }

    // =========================================================
    //  Notificación: flashcard publicada  →  a cada suscriptor
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
            subject: "Nueva flashcard disponible — {$nombreTema}",
            html:    self::plantilla(
                titulo:  'Nueva flashcard publicada',
                icono:   '📚',
                cuerpo:  "<strong>{$nombreDocente}</strong> acaba de publicar una nueva flashcard sobre <strong>{$nombreTema}</strong>. ¡Entra a MUUU y ponla a prueba!",
                pie:     "Recuerda que practicar a diario mejora tu racha."
            ),
            text: "{$nombreDocente} publicó una nueva flashcard sobre {$nombreTema}."
        );
    }

    // =========================================================
    //  Notificación: material subido  →  a cada suscriptor
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
            subject: "Nuevo material disponible — {$tituloMaterial}",
            html:    self::plantilla(
                titulo:  'Nuevo material disponible',
                icono:   '📄',
                cuerpo:  "<strong>{$nombreDocente}</strong> subió nuevo material de estudio: <strong>{$tituloMaterial}</strong>. Encuéntralo en la sección Aprende un Poco.",
                pie:     "El conocimiento está a un clic de distancia."
            ),
            text: "{$nombreDocente} subió nuevo material: {$tituloMaterial}."
        );
    }

    // =========================================================
    //  Método base — llamada HTTP a Brevo API
    // =========================================================
    private static function enviar(
        string $toEmail,
        string $toName,
        string $subject,
        string $html,
        string $text
    ): void {
        try {
            $apiKey = getenv('BREVO_KEY') ?: '';
            if ($apiKey === '') return;

            $payload = json_encode([
                'sender'      => ['email' => self::FROM_EMAIL, 'name' => self::FROM_NAME],
                'to'          => [['email' => $toEmail, 'name' => $toName]],
                'subject'     => $subject,
                'htmlContent' => $html,
                'textContent' => $text,
            ], JSON_UNESCAPED_UNICODE);

            $ch = curl_init(self::API_URL);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST           => true,
                CURLOPT_POSTFIELDS     => $payload,
                CURLOPT_HTTPHEADER     => [
                    'Content-Type: application/json',
                    'Accept: application/json',
                    'api-key: ' . $apiKey,
                ],
                CURLOPT_TIMEOUT        => 8,
            ]);
            curl_exec($ch);
            curl_close($ch);
        } catch (Throwable) {
            // Silencioso — el correo es secundario, no debe romper la respuesta HTTP
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
                <!-- Header -->
                <tr><td style="background:linear-gradient(135deg,#4a008f,#7c3aed);padding:32px 40px;text-align:center;">
                  <div style="font-size:48px;">{$icono}</div>
                  <h1 style="color:#ffffff;font-size:22px;margin:12px 0 0;font-weight:700;">{$titulo}</h1>
                </td></tr>
                <!-- Body -->
                <tr><td style="padding:36px 40px;">
                  <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;">{$cuerpo}</p>
                  <p style="color:#6b7280;font-size:13px;font-style:italic;margin:0;">{$pie}</p>
                </td></tr>
                <!-- Footer -->
                <tr><td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
                  <p style="color:#9ca3af;font-size:12px;margin:0;">
                    Este correo fue enviado automáticamente por <strong>MUUU App</strong>.<br>
                    Universidad del Magdalena · 2026
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
