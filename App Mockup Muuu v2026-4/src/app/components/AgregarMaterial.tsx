import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, FileText, Image, Video, Link as LinkIcon, ChevronDown, Eye, Sparkles, Search, Loader2 } from 'lucide-react';
import {
  listarTemasAPI,
  listarDificultadesAPI,
  crearMaterialAPI,
  actualizarMaterialAPI,
  obtenerMaterialAPI,
  uploadArchivoAPI,
  type TemaAPI,
  type DificultadAPI,
} from '../services/api';

interface AgregarMaterialProps {
  onBack:      () => void;
  materialId?: number;   // si se pasa, entra en modo edición
}

export function AgregarMaterial({ onBack, materialId }: AgregarMaterialProps) {
  const modoEdicion = materialId !== undefined;
  const [titulo, setTitulo] = useState('');
  const [nivelDificultad, setNivelDificultad] = useState('');      // id string del nivel seleccionado
  const [temaId, setTemaId] = useState<number>(0);
  const [tipoSubida, setTipoSubida] = useState<'documento' | 'foto' | 'video' | 'link' | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [archivo, setArchivo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [showDificultadDropdown, setShowDificultadDropdown] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: boolean}>({});
  const [showConfirmAdd, setShowConfirmAdd] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  // URL del archivo actualmente guardado (para modo edición)
  const [urlArchivoActual, setUrlArchivoActual] = useState('');

  // Catálogos desde API
  const [temas, setTemas]                 = useState<TemaAPI[]>([]);
  const [dificultades, setDificultades]   = useState<DificultadAPI[]>([]);
  const [cargandoCatalogos, setCargandoCatalogos] = useState(true);

  useEffect(() => {
    async function cargar() {
      try {
        const [temasData, difData] = await Promise.all([
          listarTemasAPI(),
          listarDificultadesAPI(),
        ]);
        setTemas(temasData);
        setDificultades(difData);

        // Modo edición: pre-cargar datos del material
        if (modoEdicion && materialId) {
          const mat = await obtenerMaterialAPI(materialId);
          setTitulo(mat.titulo);
          setTemaId(mat.id_tema);
          setUrlArchivoActual(mat.urlArchivo);

          // Mapear tipo DB → tipoSubida del formulario
          const tipoMap: Record<string, 'documento' | 'foto' | 'video' | 'link'> = {
            PDF: 'documento', IMAGEN: 'foto', VIDEO: 'video', LINK: 'link', RESUMEN: 'documento',
          };
          setTipoSubida(tipoMap[mat.tipo.toUpperCase()] ?? 'documento');

          // Mapear dificultad nombre → id string
          const difNombre = mat.dificultad.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
          if (difNombre.includes('bas')) setNivelDificultad('basico');
          else if (difNombre.includes('inter')) setNivelDificultad('intermedio');
          else setNivelDificultad('avanzado');

          // Si era un link, pre-cargar el input
          if (mat.tipo.toUpperCase() === 'LINK') setUrlInput(mat.urlArchivo);
        }
      } catch {
        setMensajeError('No se pudieron cargar los datos.');
      } finally {
        setCargandoCatalogos(false);
      }
    }
    cargar();
  }, []);

  // Mapear id string → id numérico en dificultades
  const getDificultadId = (): number => {
    const dif = dificultades.find(d => d.nombre.toLowerCase() === nivelDificultad);
    return dif?.id_dificultad ?? 0;
  };

  const nivelesDificultad = [
    { id: 'basico',      label: 'Básico',      color: '#10B981', emoji: '🟢' },
    { id: 'intermedio',  label: 'Intermedio',  color: '#F59E0B', emoji: '🟡' },
    { id: 'avanzado',    label: 'Avanzado',    color: '#EF4444', emoji: '🔴' },
  ];

  // Función para extraer ID de video de YouTube
  const getYouTubeVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  // Función para extraer ID de video de Vimeo
  const getVimeoVideoId = (url: string): string | null => {
    const pattern = /vimeo\.com\/(\d+)/;
    const match = url.match(pattern);
    return match ? match[1] : null;
  };

  // Función para obtener la miniatura según el tipo de video
  const getVideoThumbnail = (url: string): string | null => {
    const youtubeId = getYouTubeVideoId(url);
    if (youtubeId) {
      return `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
    }

    const vimeoId = getVimeoVideoId(url);
    if (vimeoId) {
      // Para Vimeo, usaremos una imagen placeholder ya que requiere API
      return `https://vumbnail.com/${vimeoId}.jpg`;
    }

    return null;
  };

  // Función para detectar si un link es de video
  const isVideoLink = (url: string): boolean => {
    return getYouTubeVideoId(url) !== null || getVimeoVideoId(url) !== null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setArchivo(file);
      
      // Si es un video, crear preview
      if (tipoSubida === 'video') {
        const videoURL = URL.createObjectURL(file);
        setVideoPreview(videoURL);
      }
    }
  };

  const validateFields = (): boolean => {
    const newErrors: {[key: string]: boolean} = {};

    if (!titulo)           newErrors.titulo         = true;
    if (!nivelDificultad)  newErrors.nivelDificultad = true;
    if (!tipoSubida)       newErrors.tipoSubida      = true;
    if (temaId === 0)      newErrors.tema            = true;

    if (tipoSubida === 'link' && !urlInput) {
      newErrors.urlInput = true;
    }

    // En modo edición el archivo es opcional si ya hay uno guardado
    const requiereArchivo = tipoSubida === 'documento' || tipoSubida === 'foto' || tipoSubida === 'video';
    if (requiereArchivo && !archivo && !modoEdicion) {
      newErrors.archivo = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddClick = () => {
    if (validateFields()) {
      setShowConfirmAdd(true);
    }
  };

  const handleSubmit = async () => {
    setShowConfirmAdd(false);
    setGuardando(true);
    setMensajeError('');

    try {
      // Resolver URL del archivo
      let urlArchivo: string;
      if (tipoSubida === 'link') {
        urlArchivo = urlInput;
      } else if (archivo) {
        urlArchivo = await uploadArchivoAPI(archivo);
      } else if (modoEdicion && urlArchivoActual) {
        // En edición, conservar el archivo anterior si no se cargó uno nuevo
        urlArchivo = urlArchivoActual;
      } else {
        urlArchivo = 'sin-archivo';
      }

      if (modoEdicion && materialId) {
        await actualizarMaterialAPI(materialId, {
          titulo,
          tipo:          tipoSubida!,
          urlArchivo,
          id_tema:       temaId,
          id_dificultad: getDificultadId(),
        });
        setMensajeExito('¡Material actualizado correctamente!');
      } else {
        await crearMaterialAPI({
          titulo,
          tipo:          tipoSubida!,
          urlArchivo,
          id_tema:       temaId,
          id_dificultad: getDificultadId(),
        });
        setMensajeExito('¡Material agregado exitosamente! Ya es visible para los estudiantes.');
      }
      setTimeout(() => onBack(), 1500);
    } catch (err: unknown) {
      setMensajeError(err instanceof Error ? err.message : 'Error al guardar el material.');
    } finally {
      setGuardando(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === 'basico') return '#10B981';
    if (difficulty === 'intermedio') return '#F59E0B';
    return '#EF4444';
  };

  const getDifficultyLabel = (difficulty: string) => {
    if (difficulty === 'basico') return 'Básico';
    if (difficulty === 'intermedio') return 'Intermedio';
    return 'Avanzado';
  };

  const getTypeLabel = () => {
    if (tipoSubida === 'documento') return 'PDF';
    if (tipoSubida === 'foto') return 'Imagen';
    if (tipoSubida === 'video') return 'Video';
    if (tipoSubida === 'link') return 'Link';
    return 'Material';
  };

  const getTypeIcon = () => {
    if (tipoSubida === 'documento') return '📄';
    if (tipoSubida === 'foto') return '🖼️';
    if (tipoSubida === 'video') return '🎥';
    if (tipoSubida === 'link') return '🔗';
    return '📚';
  };

  const getPreviewColor = () => {
    if (tipoSubida === 'documento') return '#FEF3C7';
    if (tipoSubida === 'foto') return '#E6D5F0';
    if (tipoSubida === 'video') return '#FFE4E4';
    if (tipoSubida === 'link') return '#E8F5E8';
    return '#FEF3C7';
  };

  return (
    <div
      className="h-full w-full relative overflow-y-auto"
      style={{
        background: 'linear-gradient(180deg, #FEF3C7 0%, #FFFBEB 100%)',
        maxWidth: '375px',
        maxHeight: '812px',
        margin: '0 auto'
      }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-50"
        style={{
          backgroundColor: '#FFFFFF',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{
            height: '60px',
            padding: '0 16px'
          }}
        >
          <button
            onClick={onBack}
            className="flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            style={{ width: '32px', height: '32px', color: '#F59E0B' }}
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>

          <h1
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: '16px',
              color: '#1E293B'
            }}
          >
            {modoEdicion ? 'Editar Material' : 'Agregar Material'}
          </h1>

          <div style={{ width: '32px' }} />
        </div>
      </div>

      {/* Contenido */}
      <div style={{ padding: '16px 20px 90px 20px' }}>
        {/* Icono principal */}
        <div
          className="flex items-center justify-center"
          style={{
            width: '70px',
            height: '70px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(245, 158, 11, 0.4)'
          }}
        >
          <Upload size={36} color="#FFFFFF" strokeWidth={2.5} />
        </div>

        <h2
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 700,
            fontSize: '19px',
            color: '#78350F',
            textAlign: 'center',
            marginBottom: '6px'
          }}
        >
          Material de Estudio
        </h2>

        <p
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '12px',
            color: '#92400E',
            textAlign: 'center',
            marginBottom: '24px'
          }}
        >
          Completa la información que deseas compartir con los estudiantes
        </p>

        {/* Mensajes de estado */}
        {mensajeExito && (
          <div style={{ margin: '0 0 12px', padding: '12px 14px', backgroundColor: '#D1FAE5',
            border: '1px solid #A7F3D0', borderRadius: '8px',
            fontFamily: 'Poppins, sans-serif', fontSize: '13px', color: '#065F46' }}>
            {mensajeExito}
          </div>
        )}
        {mensajeError && (
          <div style={{ margin: '0 0 12px', padding: '12px 14px', backgroundColor: '#FEE2E2',
            border: '1px solid #FECACA', borderRadius: '8px',
            fontFamily: 'Poppins, sans-serif', fontSize: '13px', color: '#991B1B' }}>
            {mensajeError}
          </div>
        )}

        {/* Formulario */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Título */}
          <div>
            <label
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                color: '#78350F',
                display: 'block',
                marginBottom: '8px'
              }}
            >
              Título del Material *
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => {
                setTitulo(e.target.value);
                if (errors.titulo) {
                  setErrors({...errors, titulo: false});
                }
              }}
              placeholder="Ej: Integración por Partes - Ejercicios Resueltos"
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '12px',
                border: `2px solid ${errors.titulo ? '#EF4444' : '#FDE68A'}`,
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                color: '#1E293B',
                backgroundColor: '#FFFFFF',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                if (!errors.titulo) {
                  e.target.style.borderColor = '#F59E0B';
                }
              }}
              onBlur={(e) => {
                if (!errors.titulo) {
                  e.target.style.borderColor = '#FDE68A';
                }
              }}
            />
            {errors.titulo && (
              <p style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '11px',
                color: '#EF4444',
                marginTop: '4px',
                marginLeft: '4px'
              }}>
                Llene este campo
              </p>
            )}
          </div>

          {/* Tema */}
          <div>
            <label style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600,
              fontSize: '13px', color: '#78350F', display: 'block', marginBottom: '8px' }}>
              Tema *
            </label>
            {cargandoCatalogos ? (
              <div className="flex items-center gap-2"
                style={{ color: '#9CA3AF', fontFamily: 'Poppins, sans-serif', fontSize: '13px' }}>
                <Loader2 size={16} className="animate-spin" /> Cargando temas...
              </div>
            ) : (
              <select value={temaId}
                onChange={e => { setTemaId(Number(e.target.value)); setErrors({...errors, tema: false}); }}
                style={{ width: '100%', padding: '14px 16px', borderRadius: '12px',
                  border: `2px solid ${errors.tema ? '#EF4444' : '#FDE68A'}`,
                  fontFamily: 'Poppins, sans-serif', fontSize: '14px', color: temaId ? '#1E293B' : '#9CA3AF',
                  backgroundColor: '#FFFFFF', outline: 'none', cursor: 'pointer' }}>
                <option value={0} disabled>Selecciona un tema...</option>
                {temas.map(t => (
                  <option key={t.id_tema} value={t.id_tema}>{t.nombre}</option>
                ))}
              </select>
            )}
            {errors.tema && (
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px',
                color: '#EF4444', marginTop: '4px', marginLeft: '4px' }}>
                Selecciona un tema
              </p>
            )}
          </div>

          {/* Tipo de Subida */}
          <div>
            <label
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                color: '#78350F',
                display: 'block',
                marginBottom: '8px'
              }}
            >
              Tipo de Material *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {/* Documento */}
              <button
                onClick={() => {
                  setTipoSubida('documento');
                  setVideoPreview(null);
                  if (errors.tipoSubida) {
                    setErrors({...errors, tipoSubida: false});
                  }
                }}
                className="transition-all hover:scale-[1.02]"
                style={{
                  padding: '14px 12px',
                  borderRadius: '12px',
                  border: `2px solid ${errors.tipoSubida ? '#EF4444' : (tipoSubida === 'documento' ? '#F59E0B' : '#FDE68A')}`,
                  backgroundColor: tipoSubida === 'documento' ? '#FEF3C7' : '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <FileText size={22} color={tipoSubida === 'documento' ? '#F59E0B' : '#92400E'} strokeWidth={2} />
                <span
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: tipoSubida === 'documento' ? '#F59E0B' : '#92400E'
                  }}
                >
                  Documento
                </span>
              </button>

              {/* Foto */}
              <button
                onClick={() => {
                  setTipoSubida('foto');
                  setVideoPreview(null);
                  if (errors.tipoSubida) {
                    setErrors({...errors, tipoSubida: false});
                  }
                }}
                className="transition-all hover:scale-[1.02]"
                style={{
                  padding: '14px 12px',
                  borderRadius: '12px',
                  border: `2px solid ${errors.tipoSubida ? '#EF4444' : (tipoSubida === 'foto' ? '#F59E0B' : '#FDE68A')}`,
                  backgroundColor: tipoSubida === 'foto' ? '#FEF3C7' : '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Image size={22} color={tipoSubida === 'foto' ? '#F59E0B' : '#92400E'} strokeWidth={2} />
                <span
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: tipoSubida === 'foto' ? '#F59E0B' : '#92400E'
                  }}
                >
                  Foto
                </span>
              </button>

              {/* Video */}
              <button
                onClick={() => {
                  setTipoSubida('video');
                  if (errors.tipoSubida) {
                    setErrors({...errors, tipoSubida: false});
                  }
                }}
                className="transition-all hover:scale-[1.02]"
                style={{
                  padding: '14px 12px',
                  borderRadius: '12px',
                  border: `2px solid ${errors.tipoSubida ? '#EF4444' : (tipoSubida === 'video' ? '#F59E0B' : '#FDE68A')}`,
                  backgroundColor: tipoSubida === 'video' ? '#FEF3C7' : '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Video size={22} color={tipoSubida === 'video' ? '#F59E0B' : '#92400E'} strokeWidth={2} />
                <span
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: tipoSubida === 'video' ? '#F59E0B' : '#92400E'
                  }}
                >
                  Video
                </span>
              </button>

              {/* Link */}
              <button
                onClick={() => {
                  setTipoSubida('link');
                  setVideoPreview(null);
                  if (errors.tipoSubida) {
                    setErrors({...errors, tipoSubida: false});
                  }
                }}
                className="transition-all hover:scale-[1.02]"
                style={{
                  padding: '14px 12px',
                  borderRadius: '12px',
                  border: `2px solid ${errors.tipoSubida ? '#EF4444' : (tipoSubida === 'link' ? '#F59E0B' : '#FDE68A')}`,
                  backgroundColor: tipoSubida === 'link' ? '#FEF3C7' : '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <LinkIcon size={22} color={tipoSubida === 'link' ? '#F59E0B' : '#92400E'} strokeWidth={2} />
                <span
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: tipoSubida === 'link' ? '#F59E0B' : '#92400E'
                  }}
                >
                  Link
                </span>
              </button>
            </div>
            {errors.tipoSubida && (
              <p style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '11px',
                color: '#EF4444',
                marginTop: '4px',
                marginLeft: '4px'
              }}>
                Llene este campo
              </p>
            )}
          </div>

          {/* Input de archivo o URL según selección */}
          {tipoSubida === 'link' && (
            <div>
              <label
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: '13px',
                  color: '#78350F',
                  display: 'block',
                  marginBottom: '8px'
                }}
              >
                URL del Enlace *
              </label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  if (errors.urlInput) {
                    setErrors({...errors, urlInput: false});
                  }
                }}
                placeholder="https://ejemplo.com/recurso"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: `2px solid ${errors.urlInput ? '#EF4444' : '#FDE68A'}`,
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  color: '#1E293B',
                  backgroundColor: '#FFFFFF',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  if (!errors.urlInput) {
                    e.target.style.borderColor = '#F59E0B';
                  }
                }}
                onBlur={(e) => {
                  if (!errors.urlInput) {
                    e.target.style.borderColor = '#FDE68A';
                  }
                }}
              />
              {errors.urlInput && (
                <p style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '11px',
                  color: '#EF4444',
                  marginTop: '4px',
                  marginLeft: '4px'
                }}>
                  Llene este campo
                </p>
              )}
            </div>
          )}

          {(tipoSubida === 'documento' || tipoSubida === 'foto' || tipoSubida === 'video') && (
            <div>
              <label
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: '13px',
                  color: '#78350F',
                  display: 'block',
                  marginBottom: '8px'
                }}
              >
                Subir Archivo *
              </label>
              <label
                className="w-full transition-all hover:scale-[1.01]"
                style={{
                  padding: '20px 16px',
                  borderRadius: '12px',
                  border: `2px dashed ${errors.archivo ? '#EF4444' : '#F59E0B'}`,
                  backgroundColor: '#FFFBEB',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Upload size={32} color={errors.archivo ? '#EF4444' : '#F59E0B'} strokeWidth={2} />
                <span
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: errors.archivo ? '#EF4444' : '#F59E0B'
                  }}
                >
                  {archivo ? archivo.name : 'Seleccionar archivo'}
                </span>
                <span
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '11px',
                    color: '#92400E'
                  }}
                >
                  {tipoSubida === 'documento' && 'PDF, DOC, DOCX (Max 10MB)'}
                  {tipoSubida === 'foto' && 'JPG, PNG (Max 5MB)'}
                  {tipoSubida === 'video' && 'MP4, MOV (Max 50MB)'}
                </span>
                <input
                  type="file"
                  onChange={(e) => {
                    handleFileChange(e);
                    if (errors.archivo) {
                      setErrors({...errors, archivo: false});
                    }
                  }}
                  accept={
                    tipoSubida === 'documento' ? '.pdf,.doc,.docx' :
                    tipoSubida === 'foto' ? '.jpg,.jpeg,.png' :
                    '.mp4,.mov'
                  }
                  style={{ display: 'none' }}
                />
              </label>
              {errors.archivo && (
                <p style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '11px',
                  color: '#EF4444',
                  marginTop: '4px',
                  marginLeft: '4px'
                }}>
                  Llene este campo
                </p>
              )}
            </div>
          )}

          {/* Nivel de Dificultad */}
          <div>
            <label
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                color: '#78350F',
                display: 'block',
                marginBottom: '8px'
              }}
            >
              Nivel de Dificultad *
            </label>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowDificultadDropdown(!showDificultadDropdown)}
                className="w-full flex items-center justify-between"
                style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: `2px solid ${errors.nivelDificultad ? '#EF4444' : '#FDE68A'}`,
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  color: nivelDificultad ? '#1E293B' : '#9CA3AF',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span>
                  {nivelDificultad
                    ? `${nivelesDificultad.find(n => n.id === nivelDificultad)?.emoji} ${nivelesDificultad.find(n => n.id === nivelDificultad)?.label}`
                    : 'Selecciona un nivel'}
                </span>
                <ChevronDown size={18} color="#9CA3AF" />
              </button>

              {showDificultadDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '4px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                    border: '2px solid #FDE68A',
                    zIndex: 10
                  }}
                >
                  {nivelesDificultad.map((nivel) => (
                    <button
                      key={nivel.id}
                      onClick={() => {
                        setNivelDificultad(nivel.id);
                        setShowDificultadDropdown(false);
                        if (errors.nivelDificultad) {
                          setErrors({...errors, nivelDificultad: false});
                        }
                      }}
                      className="w-full flex items-center gap-2 transition-colors hover:bg-gray-50"
                      style={{
                        padding: '12px 16px',
                        border: 'none',
                        backgroundColor: nivelDificultad === nivel.id ? '#FEF3C7' : 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>{nivel.emoji}</span>
                      <span
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '14px',
                          color: nivel.color,
                          fontWeight: nivelDificultad === nivel.id ? 600 : 500
                        }}
                      >
                        {nivel.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.nivelDificultad && (
              <p style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '11px',
                color: '#EF4444',
                marginTop: '4px',
                marginLeft: '4px'
              }}>
                Llene este campo
              </p>
            )}
          </div>

          {/* Vista Previa */}
          {titulo && tipoSubida && nivelDificultad && (
            <div style={{ marginTop: '8px' }}>
              <div
                className="flex items-center gap-2"
                style={{
                  marginBottom: '12px'
                }}
              >
                <Eye size={16} color="#F59E0B" strokeWidth={2.5} />
                <label
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 600,
                    fontSize: '13px',
                    color: '#78350F',
                    display: 'block'
                  }}
                >
                  Vista Previa (Cómo se verá para los estudiantes)
                </label>
              </div>
              
              {/* Mockup de la pantalla Aprende un Poco */}
              <div
                style={{
                  background: 'linear-gradient(180deg, #F3EBFF 0%, #FFFFFF 50%)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                  border: '2px solid #F59E0B'
                }}
              >
                {/* Header simulado de Aprende un Poco */}
                <div style={{ padding: '16px 16px 12px 16px', backgroundColor: '#FFFFFF' }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
                    <h2
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 700,
                        fontSize: '18px',
                        color: '#1E293B',
                        margin: 0
                      }}
                    >
                      Aprende un Poco
                    </h2>
                    <Sparkles size={20} color="#9B7EC7" strokeWidth={2.5} />
                  </div>

                  {/* Barra de búsqueda */}
                  <div
                    className="flex items-center gap-2"
                    style={{
                      backgroundColor: '#F3EBFF',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      marginBottom: '12px'
                    }}
                  >
                    <Search size={14} color="#9B7EC7" strokeWidth={2} />
                    <span
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '11px',
                        color: '#9CA3AF'
                      }}
                    >
                      Buscar guía o tema...
                    </span>
                  </div>

                  {/* Filtros */}
                  <div className="flex gap-1.5" style={{ marginBottom: '8px' }}>
                    <div
                      style={{
                        flex: 1,
                        height: '28px',
                        borderRadius: '8px',
                        backgroundColor: '#9B7EC7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '10px',
                          fontWeight: 600,
                          color: '#FFFFFF'
                        }}
                      >
                        Todas
                      </span>
                    </div>
                    <div
                      style={{
                        flex: 1,
                        height: '28px',
                        borderRadius: '8px',
                        backgroundColor: '#F3EBFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '10px',
                          fontWeight: 600,
                          color: '#7952B3'
                        }}
                      >
                        Guías PDF
                      </span>
                    </div>
                    <div
                      style={{
                        flex: 1,
                        height: '28px',
                        borderRadius: '8px',
                        backgroundColor: '#F3EBFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '10px',
                          fontWeight: 600,
                          color: '#7952B3'
                        }}
                      >
                        Videos
                      </span>
                    </div>
                    <div
                      style={{
                        flex: 1,
                        height: '28px',
                        borderRadius: '8px',
                        backgroundColor: '#F3EBFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '10px',
                          fontWeight: 600,
                          color: '#7952B3'
                        }}
                      >
                        Resumen
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contenido con borde superior */}
                <div style={{ padding: '12px 16px 16px 16px', backgroundColor: '#FFFFFF', borderTop: '1px solid #F3F4F6' }}>
                  {/* Label "RECIÉN AGREGADO POR EL DOCENTE" */}
                  <div className="flex items-center gap-1.5" style={{ marginBottom: '12px' }}>
                    <Sparkles size={14} color="#9B7EC7" strokeWidth={2.5} />
                    <span
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '10px',
                        fontWeight: 700,
                        color: '#9B7EC7',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      ★ RECIÉN AGREGADO POR EL DOCENTE
                    </span>
                  </div>

                  {/* Card del Material */}
                  <div
                    className="transition-all relative"
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      padding: '16px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    {/* Etiqueta de Dificultad - Esquina superior izquierda */}
                    <div
                      className="absolute"
                      style={{
                        top: '12px',
                        left: '12px',
                        backgroundColor: getDifficultyColor(nivelDificultad) + '20',
                        color: getDifficultyColor(nivelDificultad),
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 600,
                        fontSize: '10px',
                        zIndex: 1
                      }}
                    >
                      {getDifficultyLabel(nivelDificultad)}
                    </div>

                    {/* Header: Icono/Video + Título */}
                    <div className="flex items-start gap-3 mb-2" style={{ marginTop: '24px' }}>
                      {/* Icono o miniatura de video */}
                      {tipoSubida === 'video' && videoPreview ? (
                        <div
                          className="flex-shrink-0 relative overflow-hidden"
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            backgroundColor: '#000000'
                          }}
                        >
                          <video
                            src={videoPreview}
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
                      ) : tipoSubida === 'link' && urlInput && isVideoLink(urlInput) ? (
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
                            src={getVideoThumbnail(urlInput) || ''}
                            alt="Video thumbnail"
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
                            backgroundColor: getPreviewColor(),
                            fontSize: '24px'
                          }}
                        >
                          {getTypeIcon()}
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h3
                          style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: 600,
                            fontSize: '14px',
                            color: '#1E293B',
                            marginBottom: '4px',
                            lineHeight: '1.3'
                          }}
                        >
                          {titulo}
                        </h3>
                        <p
                          style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '11px',
                            color: '#7D7D7D'
                          }}
                        >
                          Prof. Garrido · {getTypeLabel()} · Material de estudio
                        </p>
                      </div>
                    </div>

                    {/* Footer: Progreso */}
                    <div className="flex items-center justify-end mt-3">
                      <span
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#9B7EC7'
                        }}
                      >
                        Sin leer
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botones de acción lado a lado */}
          <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowConfirmCancel(true)}
              className="flex-1 transition-all hover:scale-[1.02]"
              style={{
                height: '52px',
                backgroundColor: '#F3F4F6',
                color: '#78350F',
                border: 'none',
                borderRadius: '12px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>

            <button
              onClick={handleAddClick}
              className="flex-1 transition-all hover:scale-[1.02]"
              style={{
                height: '52px',
                background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(245, 158, 11, 0.4)'
              }}
            >
              Agregar
            </button>
          </div>
        </div>
      </div>

      {/* Confirmación de Agregar */}
      {showConfirmAdd && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 100
          }}
        >
          <div
            className="bg-white rounded-lg p-6"
            style={{
              width: '320px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
            }}
          >
            <h2
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: '18px',
                color: '#78350F',
                marginBottom: '16px',
                textAlign: 'center'
              }}
            >
              ¿Agregar Material de Estudio?
            </h2>
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                color: '#64748B',
                marginBottom: '8px',
                textAlign: 'center',
                lineHeight: '1.5'
              }}
            >
              ¿Estás seguro de que deseas agregar este material?
            </p>
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '13px',
                color: '#F59E0B',
                marginBottom: '24px',
                textAlign: 'center',
                fontWeight: 600,
                lineHeight: '1.5'
              }}
            >
              Será visible para todos tus estudiantes.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowConfirmAdd(false)}
                className="flex-1 transition-all hover:scale-[1.02]"
                style={{
                  height: '44px',
                  backgroundColor: '#F3F4F6',
                  color: '#78350F',
                  border: 'none',
                  borderRadius: '12px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>

              <button
                onClick={handleSubmit}
                disabled={guardando}
                className="flex-1 transition-all hover:scale-[1.02]"
                style={{
                  height: '44px',
                  background: guardando ? '#9CA3AF' : 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  fontSize: '15px',
                  cursor: guardando ? 'not-allowed' : 'pointer',
                  boxShadow: guardando ? 'none' : '0 6px 20px rgba(245, 158, 11, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                {guardando ? <Loader2 size={16} className="animate-spin" /> : null}
                {guardando ? 'Guardando...' : 'Sí, Agregar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmación de Cancelar */}
      {showConfirmCancel && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 100
          }}
        >
          <div
            className="bg-white rounded-lg p-6"
            style={{
              width: '320px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
            }}
          >
            <h2
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: '18px',
                color: '#78350F',
                marginBottom: '16px',
                textAlign: 'center'
              }}
            >
              ¿Cancelar Acción?
            </h2>
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                color: '#64748B',
                marginBottom: '8px',
                textAlign: 'center',
                lineHeight: '1.5'
              }}
            >
              ¿Estás seguro de que deseas cancelar?
            </p>
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '13px',
                color: '#EF4444',
                marginBottom: '24px',
                textAlign: 'center',
                fontWeight: 600,
                lineHeight: '1.5'
              }}
            >
              Se perderán todos los cambios realizados.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowConfirmCancel(false)}
                className="flex-1 transition-all hover:scale-[1.02]"
                style={{
                  height: '44px',
                  backgroundColor: '#F3F4F6',
                  color: '#78350F',
                  border: 'none',
                  borderRadius: '12px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                No, Continuar
              </button>

              <button
                onClick={onBack}
                className="flex-1 transition-all hover:scale-[1.02]"
                style={{
                  height: '44px',
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  fontSize: '15px',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(239, 68, 68, 0.4)'
                }}
              >
                Sí, Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}