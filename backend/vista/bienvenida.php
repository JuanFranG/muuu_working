<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Muuu App — Bienvenido</title>
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
      padding: 48px 40px;
      width: 100%;
      max-width: 460px;
      text-align: center;
    }

    .logo {
      font-size: 2.4rem;
      font-weight: 800;
      color: #7952B3;
      letter-spacing: -1px;
      margin-bottom: 6px;
    }

    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #9B7EC7, #7952B3);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 24px auto 16px;
      font-size: 2rem;
      color: #fff;
      font-weight: 700;
    }

    h2 {
      font-size: 1.4rem;
      color: #1E293B;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .rol-badge {
      display: inline-block;
      padding: 3px 12px;
      border-radius: 999px;
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-bottom: 20px;
    }

    .rol-badge.estudiante {
      background: #EDE9FE;
      color: #6D28D9;
    }

    .rol-badge.docente {
      background: #D1FAE5;
      color: #065F46;
    }

    .info-box {
      background: #F8F5FF;
      border: 1px solid #E9D5FF;
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 24px;
      text-align: left;
    }

    .info-box p {
      font-size: 0.88rem;
      color: #475569;
      line-height: 1.6;
    }

    .info-box span {
      font-weight: 600;
      color: #7952B3;
    }

    .btn-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .btn-primary {
      padding: 13px;
      background: #9B7EC7;
      color: #fff;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      display: block;
      box-shadow: 0 4px 12px rgba(155, 126, 199, 0.4);
      transition: background 0.2s, transform 0.1s;
    }

    .btn-primary:hover  { background: #7952B3; transform: translateY(-1px); }
    .btn-primary:active { transform: translateY(0); }

    .btn-secondary {
      padding: 12px;
      background: transparent;
      color: #7952B3;
      border: 2px solid #B8A4D9;
      border-radius: 12px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      display: block;
      transition: border-color 0.2s, background 0.2s;
    }

    .btn-secondary:hover {
      border-color: #7952B3;
      background: #F3EBFF;
    }

    .tag {
      margin-top: 28px;
      font-size: 0.75rem;
      color: #B0BAC6;
    }
  </style>
</head>
<body>

<?php
// Protección de ruta: requiere sesión activa
// (UserController::mostrarBienvenida() ya valida esto antes de incluir el archivo;
//  este guard es una segunda línea de defensa si la vista se accede directamente.)
if (!isset($_SESSION['id_usuario'])) {
    header('Location: ?action=login');
    exit;
}

$nombre   = htmlspecialchars($_SESSION['nombre'] ?? 'Usuario');
$rol      = $_SESSION['rol'] ?? 'ESTUDIANTE';
$inicial  = mb_strtoupper(mb_substr($nombre, 0, 1));
$rolLabel = $rol === 'DOCENTE' ? 'Docente' : 'Estudiante';
$rolClass = $rol === 'DOCENTE' ? 'docente' : 'estudiante';
?>

<div class="card">

  <div class="logo">muuu</div>

  <div class="avatar"><?= $inicial ?></div>

  <h2>¡Hola, <?= $nombre ?>!</h2>
  <span class="rol-badge <?= $rolClass ?>"><?= $rolLabel ?></span>

  <div class="info-box">
    <p>Sesión iniciada correctamente.<br>
       Rol: <span><?= $rolLabel ?></span><br>
       Plataforma: <span>Cálculo Integral · Muuu</span></p>
  </div>

  <div class="btn-group">
    <a href="/" class="btn-primary">Ir a la aplicación completa &rarr;</a>
    <a href="?action=logout" class="btn-secondary">Cerrar sesión</a>
  </div>

  <p class="tag">Universidad del Magdalena · 2026-I</p>

</div>

</body>
</html>
