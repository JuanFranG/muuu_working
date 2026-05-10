import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Sparkles, Video, Loader2, Download, ExternalLink, BookOpen } from 'lucide-react';
import { useThemeColors } from '../contexts/SettingsContext';
import {
  listarDocentesMaterialesAPI,
  listarMaterialesPorDocenteAPI,
  registrarAccesoAPI,
  registrarDescargaAPI,
  type MaterialAPI,
  type DocenteMaterialesAPI,
} from '../services/api';

interface AprendeUnPocoMinimalProps {
  onBack: () => void;
}

type FilterType = 'Todas' | 'Guías PDF' | 'Videos';

interface Task {
  id: number;
  title: string;
  subtitle: string;
  type: 'Guías PDF' | 'Videos';
  difficulty: string;
  topic: string;
  progress: number;
  icon: string;
  isNew: boolean;
  color: string;
  url: string;          // URL real del recurso
  videoThumbnail?: string;
}

// Normaliza la URL del material hacia una ruta relativa que pasa por el proxy Vite.
// Casos:
//   '/uploads/file.pdf'                        → '/uploads/file.pdf'   (ya es relativa)
//   'http://localhost:8080/uploads/file.pdf'   → '/uploads/file.pdf'   (convierte a relativa)
//   'https://storage.muuu.app/...'             → URL externa (se abre directamente)
//   'nombre-de-archivo.pdf'                    → '/uploads/nombre-de-archivo.pdf'
function normalizarUrl(urlArchivo: string): string {
  if (!urlArchivo || urlArchivo === 'sin-archivo') return '';
  // Ya es ruta relativa
  if (urlArchivo.startsWith('/uploads/')) return urlArchivo;
  // URL absoluta apuntando al backend local → convertir a relativa
  if (urlArchivo.startsWith('http://localhost:8080/uploads/')) {
    return urlArchivo.replace('http://localhost:8080', '');
  }
  // URL externa (CDN, storage externo) → dejar como está
  if (urlArchivo.startsWith('http://') || urlArchivo.startsWith('https://')) return urlArchivo;
  // Nombre de archivo sin prefijo (datos antiguos) → asumir que está en /uploads/
  return `/uploads/${urlArchivo}`;
}

// Convierte MaterialAPI → Task para el render
function materialToTask(m: MaterialAPI): Task {
  const tipo = m.tipo.toUpperCase();
  let type: Task['type'];
  let icon: string;
  let color: string;

  if (tipo === 'VIDEO') {
    type = 'Videos'; icon = '▶'; color = '#FFE4E4';
  } else if (tipo === 'PDF' || tipo === 'IMAGEN' || tipo === 'DOCUMENTO' || tipo === 'FOTO') {
    type = 'Guías PDF'; icon = '∫'; color = '#E6D5F0';
  } else {
    // LINK, RESUMEN y cualquier otro → tratarlos como enlace externo (Videos)
    type = 'Videos'; icon = '🔗'; color = '#FEF3C7';
  }

  // "Nuevo" = cargado en las últimas 48 horas
  const fechaCarga = new Date(m.fechaCarga).getTime();
  const ahora      = Date.now();
  const isNew      = (ahora - fechaCarga) < 48 * 60 * 60 * 1000;

  const docenteNombre = m.docente ? m.docente.split(' ')[0] + ' ' + (m.docente.split(' ')[1] ?? '') : 'Docente';

  return {
    id:       m.id_material,
    title:    m.titulo,
    subtitle: `${docenteNombre} · ${m.tipo} · ${m.tema}`,
    type,
    difficulty: m.dificultad,
    topic:    m.tema,
    progress: 0,
    icon,
    isNew,
    color,
    url:      normalizarUrl(m.urlArchivo),
  };
}

export function AprendeUnPocoMinimal({ onBack }: AprendeUnPocoMinimalProps) {
  const c = useThemeColors('student');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [allTasks, setAllTasks]       = useState<Task[]>([]);
  const [cargando, setCargando]       = useState(true);
  const [errorMsg, setErrorMsg]       = useState('');

  // ── Selección de docente ──────────────────────────────────
  const [docentes, setDocentes]             = useState<DocenteMaterialesAPI[]>([]);
  const [docenteSeleccionado, setDocenteSeleccionado] = useState<DocenteMaterialesAPI | null>(null);
  const [cargandoDocentes, setCargandoDocentes] = useState(true);

  // Paso 1: cargar lista de docentes con materiales
  useEffect(() => {
    listarDocentesMaterialesAPI()
      .then(ds => setDocentes(ds))
      .catch(() => setErrorMsg('No se pudo cargar la lista de docentes.'))
      .finally(() => setCargandoDocentes(false));
  }, []);

  // Paso 2: cuando se selecciona un docente, cargar sus materiales
  useEffect(() => {
    if (!docenteSeleccionado) return;
    setCargando(true);
    setErrorMsg('');
    listarMaterialesPorDocenteAPI(docenteSeleccionado.id_usuario)
      .then(mats => setAllTasks(mats.map(materialToTask)))
      .catch(() => setErrorMsg('No se pudo cargar el material de este docente.'))
      .finally(() => setCargando(false));
  }, [docenteSeleccionado]);

  const filteredTasks = allTasks.filter(task => {
    const matchesFilter = selectedFilter === 'Todas' || task.type === selectedFilter;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const newTasks        = filteredTasks.filter(t => t.isNew);
  const regularTasks    = filteredTasks.filter(t => !t.isNew);

  // Determina si la URL es un enlace externo válido
  // URL válida si es externa (http/https) o es ruta relativa al servidor (/uploads/)
  const esUrlValida = (url: string) =>
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('/uploads/');

  // Abre el contenido en una nueva pestaña y registra el acceso
  const abrirContenido = (task: Task) => {
    if (!esUrlValida(task.url)) return;
    window.open(task.url, '_blank', 'noopener,noreferrer');
    registrarAccesoAPI(task.id);
  };

  // Descarga el contenido y registra la descarga
  const descargarContenido = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!esUrlValida(task.url)) return;
    const link = document.createElement('a');
    link.href = task.url;
    link.download = task.title;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    registrarDescargaAPI(task.id);
  };

  const getDifficultyColor = (difficulty: string) => {
    const d = difficulty.toLowerCase();
    if (d.includes('bás') || d.includes('bas')) return '#10B981';
    if (d.includes('inter'))                     return '#F59E0B';
    return '#EF4444';
  };

  const getDifficultyLabel = (difficulty: string) => {
    const d = difficulty.toLowerCase();
    if (d.includes('bás') || d.includes('bas')) return 'Básico';
    if (d.includes('inter'))                     return 'Intermedio';
    return 'Avanzado';
  };

  const getProgressLabel = (progress: number) => {
    if (progress === 0)   return 'Sin leer';
    if (progress === 100) return '✓ Leído';
    return `${progress}%`;
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return '#10B981';
    return '#9B7EC7';
  };

  const renderTask = (task: Task) => (
    <div
      key={task.id}
      className="transition-all hover:scale-[1.01] relative"
      style={{
        backgroundColor: c.bgCard,
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '12px',
        boxShadow: `0 2px 8px ${c.shadow}`,
        cursor: esUrlValida(task.url) ? 'pointer' : 'default'
      }}
      onClick={() => abrirContenido(task)}
    >
      {/* Etiqueta de Dificultad - Esquina superior izquierda */}
      <div
        className="absolute"
        style={{
          top: '12px',
          left: '12px',
          backgroundColor: getDifficultyColor(task.difficulty) + '20',
          color: getDifficultyColor(task.difficulty),
          padding: '4px 10px',
          borderRadius: '6px',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 600,
          fontSize: '10px',
          zIndex: 1
        }}
      >
        {getDifficultyLabel(task.difficulty)}
      </div>

      {/* Etiqueta de Temática - Esquina superior derecha */}
      <div
        className="absolute"
        style={{
          top: '12px',
          right: '12px',
          backgroundColor: '#9B7EC7' + '20',
          color: '#7952B3',
          padding: '4px 10px',
          borderRadius: '6px',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 600,
          fontSize: '10px',
          zIndex: 1,
          maxWidth: '140px',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        {task.topic}
      </div>

      {/* Header: Icono + Título */}
      <div className="flex items-start gap-3 mb-2" style={{ marginTop: '24px' }}>
        {/* Icono o miniatura de video */}
        {task.type === 'Videos' && task.videoThumbnail ? (
          <div
            className="flex-shrink-0 relative overflow-hidden"
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#000000'
            }}
          >
            <img
              src={task.videoThumbnail}
              alt={task.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)'
              }}
            >
              <Video size={20} color="#FFFFFF" strokeWidth={2} />
            </div>
          </div>
        ) : (
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: task.color,
              fontFamily: 'Georgia, serif',
              fontSize: '24px',
              color: '#7952B3'
            }}
          >
            {task.icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              color: c.textPrimary,
              marginBottom: '4px',
              lineHeight: '1.3'
            }}
          >
            {task.title}
          </h3>
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '11px',
              color: c.textMuted
            }}
          >
            {task.subtitle}
          </p>
        </div>
      </div>

      {/* Footer: Progreso + Botón de acción */}
      <div className="flex items-center justify-between mt-3">

        {/* Progreso */}
        <div>
          {task.progress > 0 && task.progress < 100 && (
            <div className="flex items-center gap-2">
              <div style={{ width: '60px', height: '6px', backgroundColor: c.purplePale,
                borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${task.progress}%`, height: '100%',
                  backgroundColor: '#9B7EC7', borderRadius: '3px', transition: 'width 0.3s ease' }} />
              </div>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700,
                fontSize: '11px', color: getProgressColor(task.progress) }}>
                {getProgressLabel(task.progress)}
              </span>
            </div>
          )}
          {task.progress === 0 && (
            <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600,
              fontSize: '11px', color: '#7D7D7D' }}>
              {getProgressLabel(task.progress)}
            </span>
          )}
          {task.progress === 100 && (
            <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700,
              fontSize: '11px', color: '#10B981' }}>
              {getProgressLabel(task.progress)}
            </span>
          )}
        </div>

        {/* Botón de acción: Descargar (docs/imágenes) o Abrir (videos/links) */}
        {esUrlValida(task.url) && (
          task.type === 'Videos' ? (
            /* Videos y links: abrir en nueva pestaña */
            <button
              onClick={(e) => { e.stopPropagation(); window.open(task.url, '_blank', 'noopener,noreferrer'); }}
              className="flex items-center gap-1 transition-all hover:scale-105"
              style={{
                backgroundColor: '#9B7EC7', color: '#FFFFFF', border: 'none',
                borderRadius: '8px', padding: '6px 12px', cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '11px'
              }}
            >
              <ExternalLink size={13} strokeWidth={2.5} />
              Abrir
            </button>
          ) : (
            /* PDFs e imágenes: descargar */
            <button
              onClick={(e) => descargarContenido(task, e)}
              className="flex items-center gap-1 transition-all hover:scale-105"
              style={{
                backgroundColor: '#9B7EC7', color: '#FFFFFF', border: 'none',
                borderRadius: '8px', padding: '6px 12px', cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '11px'
              }}
            >
              <Download size={13} strokeWidth={2.5} />
              Descargar
            </button>
          )
        )}
      </div>
    </div>
  );

  // ── PANTALLA 1: Selección de docente ──────────────────────
  if (!docenteSeleccionado) {
    return (
      <div style={{
        height: '100%', width: '100%', display: 'flex', flexDirection: 'column',
        background: c.bgGradient, overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: '60px', backgroundColor: c.bgCard,
          boxShadow: `0 2px 8px ${c.shadow}`, padding: '0 16px', flexShrink: 0,
        }}>
          <button onClick={onBack} style={{
            width: '32px', height: '32px', borderRadius: '50%', border: 'none',
            background: 'none', cursor: 'pointer', color: '#9B7EC7',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '16px', color: c.textPrimary }}>
            Aprende un Poco
          </h1>
          <div style={{ width: '32px' }}>
            <Sparkles size={20} color="#9B7EC7" strokeWidth={2.5} />
          </div>
        </div>

        {/* Subtítulo */}
        <div style={{ padding: '20px 16px 8px' }}>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '15px', color: c.textPrimary, margin: 0 }}>
            ¿De qué docente quieres aprender?
          </p>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', color: c.textMuted, margin: '4px 0 0' }}>
            Selecciona un docente para ver sus materiales
          </p>
        </div>

        {/* Lista de docentes */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px 24px' }}>
          {cargandoDocentes && (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '60px' }}>
              <Loader2 size={32} className="animate-spin" style={{ color: '#9B7EC7' }} />
            </div>
          )}

          {!cargandoDocentes && errorMsg && (
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', color: '#991B1B',
              padding: '12px', backgroundColor: '#FEE2E2', borderRadius: '8px' }}>
              {errorMsg}
            </p>
          )}

          {!cargandoDocentes && !errorMsg && docentes.length === 0 && (
            <div style={{ textAlign: 'center', paddingTop: '60px' }}>
              <p style={{ fontSize: '48px' }}>📭</p>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', color: '#64748B' }}>
                Ningún docente ha subido material todavía.
              </p>
            </div>
          )}

          {!cargandoDocentes && docentes.map(doc => (
            <button
              key={doc.id_usuario}
              onClick={() => setDocenteSeleccionado(doc)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '14px',
                padding: '14px 16px', marginBottom: '10px', borderRadius: '16px',
                border: 'none', cursor: 'pointer',
                backgroundColor: c.bgCard, boxShadow: `0 2px 10px ${c.shadow}`,
                textAlign: 'left',
              }}
            >
              {/* Avatar */}
              <div style={{
                width: '52px', height: '52px', borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #9B7EC7 0%, #7C3AED 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '20px', color: '#FFFFFF',
              }}>
                {doc.fotoPerfil
                  ? <img src={doc.fotoPerfil} alt={doc.nombre} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  : doc.nombre.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '14px',
                  color: c.textPrimary, margin: 0 }}>
                  {doc.nombre}
                </p>
                <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', color: c.textMuted, margin: '2px 0 0' }}>
                  {doc.totalMateriales} material{doc.totalMateriales !== 1 ? 'es' : ''}
                  {doc.temaPrincipal ? ` · ${doc.temaPrincipal}` : ''}
                </p>
              </div>

              {/* Flecha */}
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                backgroundColor: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <BookOpen size={16} color="#7C3AED" strokeWidth={2.5} />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── PANTALLA 2: Materiales del docente seleccionado ────────
  return (
    <div
      className="h-full relative overflow-hidden flex flex-col"
      style={{
        background: c.bgGradient
      }}
    >
      {/* HEADER STICKY */}
      <div
        className="sticky top-0 z-50 flex items-center justify-between"
        style={{
          height: '60px',
          backgroundColor: c.bgCard,
          boxShadow: `0 2px 8px ${c.shadow}`,
          padding: '0 16px'
        }}
      >
        {/* Botón Volver — regresa a la lista de docentes */}
        <button
          onClick={() => { setDocenteSeleccionado(null); setAllTasks([]); }}
          className="flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          style={{ width: '32px', height: '32px', color: '#9B7EC7' }}
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>

        {/* Título */}
        <h1
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 700,
            fontSize: '15px',
            color: c.textPrimary,
            textAlign: 'center',
            flex: 1,
          }}
        >
          {docenteSeleccionado.nombre.split(' ')[0]}
        </h1>

        {/* Icono */}
        <div style={{ width: '32px', height: '32px' }}>
          <Sparkles size={20} color="#9B7EC7" strokeWidth={2.5} />
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA */}
      <div
        style={{
          padding: '12px 16px',
          backgroundColor: c.bgCard,
          borderBottom: `1px solid ${c.border}`
        }}
      >
        <div
          className="flex items-center gap-2"
          style={{
            backgroundColor: c.purpleSoft,
            borderRadius: '12px',
            padding: '10px 14px'
          }}
        >
          <Search size={18} color="#9B7EC7" strokeWidth={2} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar guía o tema..."
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '13px',
              color: c.textPrimary
            }}
          />
        </div>
      </div>

      {/* FILTROS - 4 botones horizontales */}
      <div
        className="flex gap-2"
        style={{
          padding: '12px 16px',
          backgroundColor: c.bgCard,
          borderBottom: `1px solid ${c.border}`
        }}
      >
        {(['Todas', 'Guías PDF', 'Videos'] as FilterType[]).map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className="flex-1 transition-all"
            style={{
              height: '36px',
              borderRadius: '10px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              fontSize: '12px',
              backgroundColor: selectedFilter === filter ? c.purple : c.purpleSoft,
              color: selectedFilter === filter ? '#FFFFFF' : c.purpleDark,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* CONTENIDO SCROLLABLE */}
      <div className="flex-1 overflow-y-auto" style={{ padding: '16px' }}>

        {/* Cargando */}
        {cargando && (
          <div className="flex flex-col items-center justify-center" style={{ paddingTop: '80px', gap: '12px' }}>
            <Loader2 size={32} style={{ color: '#9B7EC7' }} className="animate-spin" />
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', color: '#7D7D7D' }}>
              Cargando material...
            </p>
          </div>
        )}

        {/* Error */}
        {!cargando && errorMsg && (
          <div style={{ padding: '16px', backgroundColor: '#FEE2E2', border: '1px solid #FECACA',
            borderRadius: '8px', fontFamily: 'Poppins, sans-serif', fontSize: '13px', color: '#991B1B' }}>
            {errorMsg}
          </div>
        )}

        {/* SECCIÓN: RECIÉN AGREGADO POR EL DOCENTE */}
        {!cargando && newTasks.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <div className="flex items-center gap-2" style={{ marginBottom: '12px' }}>
              <Sparkles size={16} color="#9B7EC7" strokeWidth={2.5} />
              <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '12px',
                color: '#9B7EC7', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                ★ Recién agregado por el docente
              </h2>
            </div>
            {newTasks.map(renderTask)}
          </div>
        )}

        {/* SECCIÓN: TEMAS DISPONIBLES */}
        {!cargando && regularTasks.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '12px',
              color: '#7D7D7D', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
              📚 Temas disponibles
            </h2>
            {regularTasks.map(renderTask)}
          </div>
        )}

        {/* Empty state */}
        {!cargando && !errorMsg && filteredTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center" style={{ paddingTop: '80px' }}>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px',
              color: '#7D7D7D', textAlign: 'center' }}>
              El docente aún no ha subido material de estudio.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}