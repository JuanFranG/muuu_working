# Muuu — Aplicación Web de Estudio con Flashcards

> Programa de Ingeniería de Sistemas
> Facultad de ingeniería 
> Universidad del Magdalena · 2026-1

---

## Integrantes

| Nombre | Rol |
|---|---|
| Juan Gonzalez | Desarrollo Full-Stack |
| Shania Russo | Desarrollo Full-Stack |
| David Hasbum | Desarrollo Full-Stack |
| Isabel Duran | Desarrollo Full-Stack |

---

## ¿Qué es Muuu?

Muuu es una Progressive Web App (PWA) de estudio basada en flashcards. Permite a **docentes** crear y publicar tarjetas de estudio organizadas por temas, y a **estudiantes** practicarlas mediante cuestionarios interactivos. La plataforma también incluye material de estudio (documentos, videos, links), sistema de suscripción docente-estudiante, retos entre usuarios y seguimiento de progreso.

---

## Arquitectura: MVC

El proyecto sigue el patrón **Modelo-Vista-Controlador (MVC)** con una separación clara entre el frontend (React) y el backend (PHP):

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND (Vista)                   │
│          React + TypeScript + Vite                   │
│  Componentes → comunica con el backend via API REST  │
└─────────────────────┬───────────────────────────────┘
                      │ HTTP / JSON
┌─────────────────────▼───────────────────────────────┐
│               BACKEND PHP (MVC)                      │
│                                                      │
│  index.php (Front Controller / Router)               │
│       │                                              │
│       ├── Controlador/  (lógica de negocio)          │
│       │     FlashcardController.php                  │
│       │     MaterialController.php                   │
│       │     TemaController.php                       │
│       │     SuscripcionController.php                │
│       │     UserController.php                       │
│       │     UploadController.php                     │
│       │                                              │
│       └── Modelo/  (acceso a base de datos)          │
│             Flashcard.php                            │
│             Material.php                             │
│             Tema.php                                 │
│             Suscripcion.php                          │
│             Usuario.php                              │
│             Dificultad.php                           │
│             Conexion.php                             │
└─────────────────────┬───────────────────────────────┘
                      │ PDO
┌─────────────────────▼───────────────────────────────┐
│              BASE DE DATOS MySQL                     │
│               Desplegada en Railway                  │
└─────────────────────────────────────────────────────┘
```

- **Modelo**: clases PHP que encapsulan todas las consultas SQL mediante PDO.  
- **Controlador**: recibe la petición HTTP, llama al modelo y responde en JSON.  
- **Vista**: el frontend React consume la API y renderiza la interfaz.

---

## Tecnologías

### Frontend
| Tecnología | Uso |
|---|---|
| React 18 + TypeScript | Framework UI y tipado estático |
| Vite 6 | Bundler y servidor de desarrollo |
| Tailwind CSS 4 | Utilidades de estilos |
| Lucide React | Librería de iconos |
| Recharts | Gráficas de progreso |

### Backend
| Tecnología | Uso |
|---|---|
| PHP 8.3 | Lenguaje del servidor |
| PDO | Acceso a base de datos |
| MySQL | Base de datos relacional |
| Sesiones PHP | Autenticación y control de roles |

### Infraestructura
| Tecnología | Uso |
|---|---|
| Docker + Nginx | Contenedorización y servidor web |
| Railway | Despliegue del backend y base de datos MySQL |
| Render.com | Despliegue de la imagen Docker en producción |
| GitHub | Control de versiones |

---

## Estructura del proyecto

```
muuu/
├── backend/                    # API REST en PHP (MVC)
│   ├── index.php               # Front Controller — enruta todas las peticiones
│   ├── config/
│   │   └── config.php          # Configuración de base de datos (variables de entorno)
│   ├── controlador/            # Capa Controlador
│   │   ├── FlashcardController.php
│   │   ├── MaterialController.php
│   │   ├── TemaController.php
│   │   ├── SuscripcionController.php
│   │   ├── UserController.php
│   │   └── UploadController.php
│   ├── modelo/                 # Capa Modelo
│   │   ├── Conexion.php
│   │   ├── Flashcard.php
│   │   ├── Material.php
│   │   ├── Tema.php
│   │   ├── Suscripcion.php
│   │   ├── Usuario.php
│   │   └── Dificultad.php
│   └── uploads/                # Archivos subidos por docentes
│
├── App Mockup Muuu v2026-4/    # Aplicación React (Frontend)
│   ├── index.html
│   ├── vite.config.ts
│   ├── package.json
│   └── src/
│       ├── main.tsx
│       └── app/
│           ├── components/     # Pantallas y componentes UI
│           │   ├── MuuuApp.tsx             # Orquestador principal (router de pantallas)
│           │   ├── WelcomeScreen.tsx        # Pantalla de bienvenida / login
│           │   ├── StudentHome.tsx          # Home del estudiante
│           │   ├── TeacherHome.tsx          # Home del docente
│           │   ├── PonteAPrueba.tsx         # Menú de selección del modo quiz
│           │   ├── PonteAPruebaDocentes.tsx # Quiz — selección de docente
│           │   ├── PonteAPruebaTema.tsx     # Quiz — selección de tema
│           │   ├── QuizScreen.tsx           # Pantalla de quiz interactivo
│           │   ├── AprendeUnPocoMinimal.tsx # Visor de material de estudio
│           │   ├── DisenarFlashcard.tsx     # Formulario de creación de flashcard
│           │   ├── MisFlashcards.tsx        # Listado de flashcards del docente
│           │   ├── Categorias.tsx           # Gestión de categorías/temas
│           │   ├── AgregarMaterial.tsx      # Subida de material de estudio
│           │   ├── MiProgreso.tsx           # Estadísticas del estudiante
│           │   ├── SalaDesafio.tsx          # Sala de desafío entre usuarios
│           │   └── ...                     # Más pantallas de perfil y configuración
│           └── services/
│               └── api.ts                  # Capa de comunicación con el backend
│
├── Dockerfile                  # Imagen multi-stage (Node → PHP+Nginx)
├── supervisord.conf            # Gestión de procesos Nginx + PHP-FPM
└── .env.example                # Variables de entorno requeridas
```

---

## Roles de usuario

| Rol | Capacidades |
|---|---|
| **Docente** | Crear/editar/publicar flashcards, subir material, gestionar categorías, ver estadísticas |
| **Estudiante** | Practicar con flashcards, acceder a material, suscribirse a docentes, ver su progreso |

---

## Variables de entorno requeridas

```env
DB_HOST=
DB_PORT=3306
DB_NAME=muuu_db
DB_USER=
DB_PASSWORD=
```

---

## Despliegue local

```bash
# Backend (requiere PHP 8.3 + MySQL)
cd backend
php -S localhost:8080

# Frontend
cd "App Mockup Muuu v2026-4"
npm install
npm run dev
```

O con Docker:

```bash
docker build -t muuu-app .
docker run -p 10000:10000 --env-file .env muuu-app
```
