<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Muuu App — Crear cuenta</title>
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
      max-width: 420px;
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
      margin-bottom: 16px;
    }

    label {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      color: #475569;
      margin-bottom: 6px;
    }

    input[type="text"],
    input[type="email"],
    input[type="password"],
    select {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #B8A4D9;
      border-radius: 10px;
      font-size: 0.95rem;
      color: #1E293B;
      outline: none;
      transition: border-color 0.2s;
      background: #fff;
    }

    input:focus, select:focus {
      border-color: #7952B3;
      box-shadow: 0 0 0 3px rgba(121, 82, 179, 0.15);
    }

    select {
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%237952B3' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 16px center;
      padding-right: 40px;
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

    .hint {
      font-size: 0.78rem;
      color: #94A3B8;
      margin-top: 4px;
    }
  </style>
</head>
<body>

<div class="card">

  <div class="logo-area">
    <h1>muuu</h1>
    <p>Crea tu cuenta gratuita</p>
  </div>

  <?php if (isset($_GET['error'])): ?>
    <div class="alert">
      <?php
        echo match($_GET['error']) {
          'duplicado' => 'Ese correo ya está registrado. Prueba con otro.',
          'interno'   => 'Error interno del servidor. Intenta de nuevo más tarde.',
          default     => 'Ocurrió un error. Intenta de nuevo.',
        };
      ?>
    </div>
  <?php endif; ?>

  <!-- Formulario — POST procesado por UserController::procesarRegistro() -->
  <form method="POST" action="?action=procesarRegistro">

    <div class="form-group">
      <label for="nombre">Nombre completo</label>
      <input
        type="text"
        id="nombre"
        name="nombre"
        placeholder="Ada Lovelace"
        required
        autocomplete="name"
      >
    </div>

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
        minlength="6"
        autocomplete="new-password"
      >
      <p class="hint">Mínimo 6 caracteres.</p>
    </div>

    <div class="form-group">
      <label for="rol">Rol</label>
      <select id="rol" name="rol">
        <option value="ESTUDIANTE" selected>Estudiante</option>
        <option value="DOCENTE">Docente</option>
      </select>
    </div>

    <button type="submit" class="btn-primary">Crear cuenta</button>

  </form>

  <div class="footer-link">
    ¿Ya tienes cuenta?
    <a href="?action=login">Inicia sesión aquí</a>
  </div>

  <p class="tag">Universidad del Magdalena · 2026-I</p>
</div>

</body>
</html>
