<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Muuu App — Iniciar Sesión</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      min-height: 100vh;
      background: linear-gradient(180deg, #F3EBFF 0%, #ffffff 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card {
      background: #fff;
      border-radius: 24px;
      box-shadow: 0 8px 32px rgba(121, 82, 179, 0.15);
      padding: 40px 36px;
      width: 100%;
      max-width: 400px;
    }

    .logo-area {
      text-align: center;
      margin-bottom: 28px;
    }

    .logo-area h1 {
      font-size: 2rem;
      font-weight: 800;
      color: #7952B3;
      letter-spacing: -1px;
    }

    .logo-area p {
      color: #7D7D7D;
      font-size: 0.9rem;
      margin-top: 4px;
    }

    .form-group {
      margin-bottom: 18px;
    }

    label {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      color: #475569;
      margin-bottom: 6px;
    }

    input[type="email"],
    input[type="password"],
    input[type="text"] {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #B8A4D9;
      border-radius: 10px;
      font-size: 0.95rem;
      color: #1E293B;
      outline: none;
      transition: border-color 0.2s;
    }

    input:focus {
      border-color: #7952B3;
      box-shadow: 0 0 0 3px rgba(121, 82, 179, 0.15);
    }

    .btn-primary {
      width: 100%;
      padding: 14px;
      background: #9B7EC7;
      color: #fff;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      margin-top: 8px;
      box-shadow: 0 4px 12px rgba(155, 126, 199, 0.4);
      transition: background 0.2s, transform 0.1s;
    }

    .btn-primary:hover  { background: #7952B3; transform: translateY(-1px); }
    .btn-primary:active { transform: translateY(0); }

    .alert {
      background: #FEE2E2;
      border: 1px solid #FECACA;
      border-radius: 8px;
      color: #991B1B;
      padding: 10px 14px;
      font-size: 0.85rem;
      margin-bottom: 16px;
    }

    .alert.success {
      background: #D1FAE5;
      border-color: #A7F3D0;
      color: #065F46;
    }

    .footer-link {
      text-align: center;
      margin-top: 20px;
      font-size: 0.88rem;
      color: #475569;
    }

    .footer-link a {
      color: #7952B3;
      font-weight: 600;
      text-decoration: none;
    }

    .footer-link a:hover { text-decoration: underline; }

    .tag {
      text-align: center;
      margin-top: 28px;
      font-size: 0.75rem;
      color: #B0BAC6;
    }
  </style>
</head>
<body>

<div class="card">

  <div class="logo-area">
    <h1>muuu</h1>
    <p>Plataforma de Cálculo Integral</p>
  </div>

  <?php if (isset($_GET['error'])): ?>
    <div class="alert">
      <?php
        echo match($_GET['error']) {
          'credenciales' => 'Correo o contraseña incorrectos.',
          default        => 'Ocurrió un error. Intenta de nuevo.',
        };
      ?>
    </div>
  <?php endif; ?>

  <?php if (isset($_GET['registro']) && $_GET['registro'] === 'exitoso'): ?>
    <div class="alert success">
      ¡Registro exitoso! Ya puedes iniciar sesión.
    </div>
  <?php endif; ?>

  <!-- Formulario — POST procesado por UserController::procesarLogin() -->
  <form method="POST" action="?action=procesarLogin">

    <div class="form-group">
      <label for="correo">Correo electrónico</label>
      <input
        type="email"
        id="correo"
        name="correo"
        placeholder="ada@muuu.com"
        required
        autocomplete="email"
      >
    </div>

    <div class="form-group">
      <label for="contrasena">Contraseña</label>
      <input
        type="password"
        id="contrasena"
        name="contrasena"
        placeholder="••••••••"
        required
        autocomplete="current-password"
      >
    </div>

    <button type="submit" class="btn-primary">Iniciar sesión</button>

  </form>

  <div class="footer-link">
    ¿No tienes cuenta?
    <a href="?action=registro">Regístrate gratis aquí</a>
  </div>

  <div class="footer-link" style="margin-top:10px;">
    <a href="/">Ir a la app completa →</a>
  </div>

  <p class="tag">Universidad del Magdalena · 2026-I</p>
</div>

</body>
</html>
