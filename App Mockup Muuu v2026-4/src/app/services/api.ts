// ============================================================
//  MUUU APP · Servicio de API
//  Todas las llamadas al backend PHP pasan por aquí.
//  Usa credentials:'include' para que la cookie de sesión
//  PHP viaje en cada petición.
// ============================================================

const BASE = '/api';

// ────────────────────────────────────────────────────────────
//  TIPOS
// ────────────────────────────────────────────────────────────

export interface UsuarioAPI {
  id_usuario:           number;
  nombre:               string;
  correo:               string;
  rol:                  'ESTUDIANTE' | 'DOCENTE';
  esActivo:             boolean;
  rachaActual:          number | null;
  fechaUltimaActividad: string | null;
  fotoPerfil:           string | null;
  totalPuntos:          number;
  nivel:                number;
  posicion:             number | null;
  flashcardsEstudiadas: number;
}

export interface TemaAPI {
  id_tema:     number;
  nombre:      string;
  descripcion: string | null;
  icono:       string | null;
}

export interface TemaEstadisticasAPI extends TemaAPI {
  totalFlashcards: number;
  totalMateriales: number;
  esSistema:       boolean;
}

export interface DificultadAPI {
  id_dificultad: number;
  nombre:        string;
}

export interface OpcionAPI {
  contenido:        string;
  esCorrecta:       boolean;
  retroalimentacion: string;
}

export interface FlashcardAPI {
  id_flashcard:      number;
  integral:          string;
  respuestaCorrecta: string;
  estado:            'BORRADOR' | 'PUBLICADO';
  fechaCreacion:     string;
  tema:              string;
  dificultad:        string;
  totalOpciones?:    number;
  docente?:          string;
  docenteFoto?:      string | null;
}

// ────────────────────────────────────────────────────────────
//  HELPER INTERNO
// ────────────────────────────────────────────────────────────

async function peticion<T>(
  metodo: string,
  ruta:   string,
  body?:  object
): Promise<T> {
  const opciones: RequestInit = {
    method:      metodo,
    credentials: 'include',
    headers:     { 'Content-Type': 'application/json' },
  };

  if (body !== undefined) {
    opciones.body = JSON.stringify(body);
  }

  const res  = await fetch(`${BASE}${ruta}`, opciones);
  const json = await res.json();

  if (!json.ok) {
    throw new Error(json.mensaje ?? 'Error desconocido del servidor.');
  }

  return json as T;
}

// ────────────────────────────────────────────────────────────
//  AUTH
// ────────────────────────────────────────────────────────────

/** Inicia sesión y devuelve el usuario autenticado */
export async function loginAPI(
  correo:     string,
  contrasena: string
): Promise<UsuarioAPI> {
  const data = await peticion<{ ok: boolean; usuario: UsuarioAPI }>(
    'POST', '/auth/login', { correo, contrasena }
  );
  return data.usuario;
}

/** Registra un nuevo usuario. No inicia sesión automáticamente. */
export async function registrarAPI(
  nombre:     string,
  correo:     string,
  contrasena: string,
  rol:        'ESTUDIANTE' | 'DOCENTE'
): Promise<{ id_usuario: number }> {
  const data = await peticion<{ ok: boolean; id_usuario: number }>(
    'POST', '/auth/register', { nombre, correo, contrasena, rol }
  );
  return { id_usuario: data.id_usuario };
}

/** Cierra la sesión activa */
export async function logoutAPI(): Promise<void> {
  await peticion<{ ok: boolean }>('POST', '/auth/logout');
}

/** Devuelve el usuario de la sesión activa, o null si no hay sesión */
export async function meAPI(): Promise<UsuarioAPI | null> {
  try {
    const data = await peticion<{ ok: boolean; usuario: UsuarioAPI }>(
      'GET', '/auth/me'
    );
    return data.usuario;
  } catch {
    return null;
  }
}

/** Convierte el rol de la API al formato del frontend */
export function rolAFrontend(rol: UsuarioAPI['rol']): 'student' | 'teacher' {
  return rol === 'DOCENTE' ? 'teacher' : 'student';
}

/** Actualiza nombre y/o contraseña del usuario en sesión */
export async function actualizarPerfilAPI(params: {
  nombre?: string;
  contrasenaActual?: string;
  nuevaContrasena?: string;
}): Promise<void> {
  await peticion<{ ok: boolean }>('PATCH', '/auth/perfil', params);
}

/** Sube una nueva foto de perfil y devuelve la URL */
export async function subirFotoPerfilAPI(foto: File): Promise<string> {
  const fd = new FormData();
  fd.append('foto', foto);
  const resp = await fetch('/api/auth/foto', {
    method: 'POST',
    credentials: 'include',
    body: fd,
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error((err as any).mensaje ?? 'Error al subir la foto.');
  }
  const data = await resp.json() as { ok: boolean; url: string };
  return data.url;
}

// ────────────────────────────────────────────────────────────
//  CATÁLOGOS
// ────────────────────────────────────────────────────────────

/** Lista todos los temas disponibles */
export async function listarTemasAPI(): Promise<TemaAPI[]> {
  const data = await peticion<{ ok: boolean; temas: TemaAPI[] }>(
    'GET', '/temas'
  );
  return data.temas;
}

/** Lista temas con conteo de flashcards y materiales asociados (solo docente) */
export async function listarTemasEstadisticasAPI(): Promise<TemaEstadisticasAPI[]> {
  const data = await peticion<{ ok: boolean; temas: TemaEstadisticasAPI[] }>(
    'GET', '/temas-estadisticas'
  );
  return data.temas;
}

/** Crea un nuevo tema (solo docente) */
export async function crearTemaAPI(params: {
  nombre:      string;
  descripcion?: string;
  icono?:       string;
}): Promise<TemaEstadisticasAPI> {
  const data = await peticion<{ ok: boolean; tema: TemaEstadisticasAPI; mensaje: string }>(
    'POST', '/temas', params
  );
  return data.tema;
}

/** Elimina un tema (solo si no tiene flashcards o materiales vinculados) */
export async function eliminarTemaAPI(id: number): Promise<void> {
  await peticion<{ ok: boolean }>('DELETE', `/temas/${id}`);
}

/** Lista todos los niveles de dificultad */
export async function listarDificultadesAPI(): Promise<DificultadAPI[]> {
  const data = await peticion<{ ok: boolean; dificultades: DificultadAPI[] }>(
    'GET', '/dificultades'
  );
  return data.dificultades;
}

// ────────────────────────────────────────────────────────────
//  FLASHCARDS
// ────────────────────────────────────────────────────────────

/** Lista flashcards del docente (o todas las publicadas si es estudiante) */
export async function listarFlashcardsAPI(): Promise<FlashcardAPI[]> {
  const data = await peticion<{ ok: boolean; flashcards: FlashcardAPI[] }>(
    'GET', '/flashcards'
  );
  return data.flashcards;
}

/** Crea una nueva flashcard (borrador o publicada) */
export async function crearFlashcardAPI(params: {
  integral:       string;
  id_tema:        number;
  id_dificultad:  number;
  estado:         'BORRADOR' | 'PUBLICADO';
  opciones:       OpcionAPI[];
}): Promise<{ id_flashcard: number; estado: string; mensaje: string }> {
  return await peticion<{ ok: boolean; id_flashcard: number; estado: string; mensaje: string }>(
    'POST', '/flashcards', params
  );
}

/** Elimina una flashcard del docente */
export async function eliminarFlashcardAPI(id: number): Promise<void> {
  await peticion<{ ok: boolean }>('DELETE', `/flashcards/${id}`);
}

/** Publica una flashcard (cambia estado a PUBLICADO) */
export async function publicarFlashcardAPI(id: number): Promise<void> {
  await peticion<{ ok: boolean }>('PATCH', `/flashcards/${id}/publicar`);
}

/** Mueve una flashcard a borrador (cambia estado a BORRADOR) */
export async function moverABorradorAPI(id: number): Promise<void> {
  await peticion<{ ok: boolean }>('PATCH', `/flashcards/${id}/borrador`);
}

// ────────────────────────────────────────────────────────────
//  FLASHCARDS QUIZ (Ponte a Prueba) — con opciones incluidas
// ────────────────────────────────────────────────────────────

export interface OpcionQuizAPI {
  id_opcion:         number;
  contenidoRespuesta: string;
  esCorrecta:        boolean;
  retroalimentacion: string;
}

export interface FlashcardQuizAPI {
  id_flashcard: number;
  integral:     string;
  tema:         string;
  dificultad:   string;
  opciones:     OpcionQuizAPI[];
}

/** Flashcards publicadas de un docente CON sus opciones (para el quiz) */
export async function listarFlashcardsDocenteAPI(
  idDocente: number
): Promise<FlashcardQuizAPI[]> {
  const data = await peticion<{ ok: boolean; flashcards: FlashcardQuizAPI[] }>(
    'GET', `/flashcards?docente=${idDocente}`
  );
  return data.flashcards;
}

/** Flashcards publicadas de un tema CON sus opciones (para el quiz por tema) */
export async function listarFlashcardsPorTemaAPI(
  idTema: number
): Promise<FlashcardQuizAPI[]> {
  const data = await peticion<{ ok: boolean; flashcards: FlashcardQuizAPI[] }>(
    'GET', `/flashcards?tema=${idTema}`
  );
  return data.flashcards;
}

// ────────────────────────────────────────────────────────────
//  DOCENTES (para Ponte a Prueba)
// ────────────────────────────────────────────────────────────

export interface DocenteAPI {
  id_usuario:      number;
  nombre:          string;
  fotoPerfil:      string | null;
  totalFlashcards: number;
  temas:           string[];
  totalSuscritos:  number;
  esSuscrito:      boolean;
}

/** Lista de docentes que tienen flashcards publicadas */
export async function listarDocentesAPI(): Promise<DocenteAPI[]> {
  const data = await peticion<{ ok: boolean; docentes: DocenteAPI[] }>(
    'GET', '/docentes'
  );
  return data.docentes;
}

// ────────────────────────────────────────────────────────────
//  MATERIAL DE ESTUDIO (Aprende un Poco / Agregar Material)
// ────────────────────────────────────────────────────────────

export interface MaterialAPI {
  id_material:  number;
  titulo:       string;
  tipo:         string;   // PDF | IMAGEN | VIDEO | LINK | RESUMEN
  urlArchivo:   string;
  fechaCarga:   string;
  tema:         string;
  dificultad:   string;
  docente:      string;
  docenteFoto:  string | null;
}

/** Lista todos los materiales (estudiante ve todos; docente ve los propios) */
export async function listarMaterialesAPI(): Promise<MaterialAPI[]> {
  const data = await peticion<{ ok: boolean; materiales: MaterialAPI[] }>(
    'GET', '/materiales'
  );
  return data.materiales;
}

/** Crea un nuevo material de estudio (solo docente) */
export async function crearMaterialAPI(params: {
  titulo:        string;
  tipo:          string;
  urlArchivo:    string;
  id_tema:       number;
  id_dificultad: number;
}): Promise<{ id_material: number; mensaje: string }> {
  return await peticion<{ ok: boolean; id_material: number; mensaje: string }>(
    'POST', '/materiales', params
  );
}

// ────────────────────────────────────────────────────────────
//  MATERIAL DETALLE (para edición) + CRUD
// ────────────────────────────────────────────────────────────

export interface MaterialDetalleAPI {
  id_material:   number;
  titulo:        string;
  tipo:          string;
  urlArchivo:    string;
  fechaCarga:    string;
  id_tema:       number;
  id_dificultad: number;
  id_usuario:    number;
  tema:          string;
  dificultad:    string;
}

/** Obtiene un material completo por id (para editar) */
export async function obtenerMaterialAPI(id: number): Promise<MaterialDetalleAPI> {
  const data = await peticion<{ ok: boolean; material: MaterialDetalleAPI }>(
    'GET', `/materiales/${id}`
  );
  return data.material;
}

/** Actualiza un material existente */
export async function actualizarMaterialAPI(
  id: number,
  params: {
    titulo:        string;
    tipo:          string;
    urlArchivo:    string;
    id_tema:       number;
    id_dificultad: number;
  }
): Promise<{ mensaje: string }> {
  return await peticion<{ ok: boolean; mensaje: string }>(
    'PUT', `/materiales/${id}`, params
  );
}

/** Elimina un material del docente */
export async function eliminarMaterialAPI(id: number): Promise<void> {
  await peticion<{ ok: boolean }>('DELETE', `/materiales/${id}`);
}

// ────────────────────────────────────────────────────────────
//  DOCENTES CON MATERIALES (para Aprende un Poco del estudiante)
// ────────────────────────────────────────────────────────────

export interface DocenteMaterialesAPI {
  id_usuario:      number;
  nombre:          string;
  fotoPerfil:      string | null;
  totalMateriales: number;
  temaPrincipal:   string | null;
}

/** Lista docentes que tienen materiales cargados */
export async function listarDocentesMaterialesAPI(): Promise<DocenteMaterialesAPI[]> {
  const data = await peticion<{ ok: boolean; docentes: DocenteMaterialesAPI[] }>(
    'GET', '/docentes-materiales'
  );
  return data.docentes;
}

/** Materiales de un docente concreto (vista pública del estudiante) */
export async function listarMaterialesPorDocenteAPI(
  idDocente: number
): Promise<MaterialAPI[]> {
  const data = await peticion<{ ok: boolean; materiales: MaterialAPI[] }>(
    'GET', `/materiales?docente=${idDocente}`
  );
  return data.materiales;
}

// ────────────────────────────────────────────────────────────
//  FLASHCARD DETALLE (para edición)
// ────────────────────────────────────────────────────────────

export interface OpcionDetalleAPI {
  id_opcion:         number;
  contenidoRespuesta: string;
  esCorrecta:        boolean;
  retroalimentacion: string;
}

export interface FlashcardDetalleAPI {
  id_flashcard:      number;
  integral:          string;
  respuestaCorrecta: string;
  estado:            'BORRADOR' | 'PUBLICADO';
  fechaCreacion:     string;
  id_tema:           number;
  id_dificultad:     number;
  tema:              string;
  dificultad:        string;
  opciones:          OpcionDetalleAPI[];
}

/** Obtiene una flashcard completa con sus opciones (para editar) */
export async function obtenerFlashcardAPI(id: number): Promise<FlashcardDetalleAPI> {
  const data = await peticion<{ ok: boolean; flashcard: FlashcardDetalleAPI }>(
    'GET', `/flashcards/${id}`
  );
  return data.flashcard;
}

/** Actualiza una flashcard existente */
export async function actualizarFlashcardAPI(
  id: number,
  params: {
    integral:      string;
    id_tema:       number;
    id_dificultad: number;
    estado:        'BORRADOR' | 'PUBLICADO';
    opciones:      OpcionAPI[];
  }
): Promise<{ estado: string; mensaje: string }> {
  return await peticion<{ ok: boolean; estado: string; mensaje: string }>(
    'PUT', `/flashcards/${id}`, params
  );
}

// ────────────────────────────────────────────────────────────
//  UPLOAD DE ARCHIVOS
// ────────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────
//  SUSCRIPCIONES
// ────────────────────────────────────────────────────────────

/**
 * ESTUDIANTE: devuelve array de id_docente a los que está suscrito.
 * DOCENTE: devuelve el conteo de suscriptores como { count: N }.
 * Este helper es genérico — usa las funciones tipadas de abajo.
 */
async function _suscripcionesRaw(): Promise<{ ok: boolean; docentes?: number[]; count?: number }> {
  return peticion<{ ok: boolean; docentes?: number[]; count?: number }>('GET', '/suscripciones');
}

/** Lista los id_docente a los que el estudiante autenticado está suscrito */
export async function listarSuscripcionesAPI(): Promise<number[]> {
  const data = await _suscripcionesRaw();
  return data.docentes ?? [];
}

/** Suscribe al estudiante autenticado al docente indicado */
export async function suscribirseAPI(id_docente: number): Promise<void> {
  await peticion<{ ok: boolean }>('POST', '/suscripciones', { id_docente });
}

/** Desuscribe al estudiante autenticado del docente indicado */
export async function desuscribirseAPI(id_docente: number): Promise<void> {
  await peticion<{ ok: boolean }>('DELETE', `/suscripciones/${id_docente}`);
}

/** Retorna el número de estudiantes suscritos al docente autenticado */
export async function contarSuscriptoresAPI(): Promise<number> {
  const data = await peticion<{ ok: boolean; count: number }>('GET', '/suscripciones');
  return data.count ?? 0;
}

/** Sube un archivo al servidor y devuelve la URL pública */
export async function uploadArchivoAPI(archivo: File): Promise<string> {
  const formData = new FormData();
  formData.append('archivo', archivo);

  // IMPORTANT: Do NOT set Content-Type header manually — browser sets it with boundary
  const resp = await fetch('/api/upload', {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error((err as { mensaje?: string }).mensaje ?? 'Error al subir el archivo.');
  }

  const data = await resp.json() as { ok: boolean; url: string; mensaje?: string };
  if (!data.ok) throw new Error(data.mensaje ?? 'Error al subir el archivo.');
  return data.url;
}

// ────────────────────────────────────────────────────────────
//  NOTIFICACIONES
// ────────────────────────────────────────────────────────────

export interface NotificacionAPI {
  id_notificacion: number;
  tipo:            string;   // 'nueva_suscripcion' | 'nueva_flashcard' | 'nuevo_material' | 'acceso_material' | 'descarga_material'
  titulo:          string;
  mensaje:         string;
  leida:           boolean;
  fechaCreacion:   string;   // ISO datetime string
}

/** Lista todas las notificaciones del usuario autenticado */
export async function listarNotificacionesAPI(): Promise<NotificacionAPI[]> {
  const data = await peticion<{ ok: boolean; notificaciones: NotificacionAPI[] }>('GET', '/notificaciones');
  return data.notificaciones ?? [];
}

/** Devuelve el número de notificaciones no leídas (para badge en campana) */
export async function contarNoLeidasAPI(): Promise<number> {
  try {
    const data = await peticion<{ ok: boolean; count: number }>('GET', '/notificaciones/no-leidas');
    return data.count ?? 0;
  } catch {
    return 0;
  }
}

/** Elimina una notificación por ID */
export async function eliminarNotificacionAPI(id: number): Promise<void> {
  await peticion<{ ok: boolean }>('DELETE', `/notificaciones/${id}`);
}

/** Marca una notificación como leída */
export async function marcarLeidaAPI(id: number): Promise<void> {
  await peticion<{ ok: boolean }>('PATCH', `/notificaciones/${id}/leer`);
}

/** Marca todas las notificaciones del usuario como leídas */
export async function marcarTodasLeidasAPI(): Promise<void> {
  await peticion<{ ok: boolean }>('PATCH', '/notificaciones/leer-todas');
}

// ────────────────────────────────────────────────────────────
//  TRACKING DE MATERIALES
// ────────────────────────────────────────────────────────────

/** Registra que el estudiante abrió un material (notifica al docente) */
export async function registrarAccesoAPI(idMaterial: number): Promise<void> {
  try {
    await peticion<{ ok: boolean }>('POST', `/materiales/${idMaterial}/acceso`);
  } catch { /* silencioso — no bloquear UX */ }
}

/** Registra que el estudiante descargó un material (notifica al docente) */
export async function registrarDescargaAPI(idMaterial: number): Promise<void> {
  try {
    await peticion<{ ok: boolean }>('POST', `/materiales/${idMaterial}/descarga`);
  } catch { /* silencioso — no bloquear UX */ }
}

// ────────────────────────────────────────────────────────────
//  RANKING
// ────────────────────────────────────────────────────────────

export interface RankingItemAPI {
  id:          number;
  nombre:      string;
  fotoPerfil:  string | null;
  puntos:      number;
  nivel:       number;
  posicion:    number;
  medalla:     'oro' | 'plata' | 'bronce' | null;
}

/** Lista los top 20 estudiantes por puntos */
export async function obtenerRankingAPI(): Promise<RankingItemAPI[]> {
  try {
    const data = await peticion<{ ok: boolean; estudiantes: RankingItemAPI[] }>('GET', '/ranking');
    return data.estudiantes ?? [];
  } catch {
    return [];
  }
}

// ────────────────────────────────────────────────────────────
//  QUIZ — guardar resultado
// ────────────────────────────────────────────────────────────

export interface ResultadoQuizItem {
  id_flashcard: number;
  resultado:    'correcta' | 'incorrecta';
}

/** Guarda el resultado del quiz: persiste historial y otorga puntos */
export async function guardarResultadoQuizAPI(params: {
  flashcards:  ResultadoQuizItem[];
  correctas:   number;
  incorrectas: number;
  tiempo:      number;
}): Promise<{ puntosGanados: number }> {
  try {
    const data = await peticion<{ ok: boolean; puntosGanados: number }>(
      'POST', '/quiz/resultado', params
    );
    return { puntosGanados: data.puntosGanados ?? 0 };
  } catch {
    return { puntosGanados: 0 };
  }
}

// ────────────────────────────────────────────────────────────
//  ESTADÍSTICAS
// ────────────────────────────────────────────────────────────

export interface ProgresoTemaAPI {
  tema:      string;
  total:     number;
  correctas: number;
  progreso:  number;   // 0-100
}

export interface EstadisticasEstudianteAPI {
  porTema: ProgresoTemaAPI[];
}

/** Estadísticas de progreso por tema del estudiante autenticado */
export async function obtenerEstadisticasEstudianteAPI(): Promise<EstadisticasEstudianteAPI> {
  try {
    const data = await peticion<{ ok: boolean; data: EstadisticasEstudianteAPI }>(
      'GET', '/estadisticas/estudiante'
    );
    return data.data ?? { porTema: [] };
  } catch {
    return { porTema: [] };
  }
}

export interface TopFlashcardDocenteAPI {
  integral:        string;
  tema:            string;
  vecesEstudiada:  number;
}

export interface EstadisticasDocenteAPI {
  flashcardsPublicadas: number;
  suscriptores:         number;
  materiales:           number;
  accesos:              number;
  descargas:            number;
  topFlashcards:        TopFlashcardDocenteAPI[];
}

/** Estadísticas del docente autenticado */
export async function obtenerEstadisticasDocenteAPI(): Promise<EstadisticasDocenteAPI> {
  try {
    const data = await peticion<{ ok: boolean; data: EstadisticasDocenteAPI }>(
      'GET', '/estadisticas/docente'
    );
    return data.data ?? {
      flashcardsPublicadas: 0, suscriptores: 0, materiales: 0,
      accesos: 0, descargas: 0, topFlashcards: [],
    };
  } catch {
    return {
      flashcardsPublicadas: 0, suscriptores: 0, materiales: 0,
      accesos: 0, descargas: 0, topFlashcards: [],
    };
  }
}
