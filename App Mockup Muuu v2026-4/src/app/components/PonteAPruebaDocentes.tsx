import { useState, useEffect, CSSProperties } from 'react';
import { ArrowLeft, Search, Heart, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { listarDocentesAPI, suscribirseAPI, type DocenteAPI } from '../services/api';

interface PonteAPruebaDocentesProps {
  onBack:           () => void;
  onSelectTeacher:  (teacherId: string, teacherName: string) => void;
}

const AVATAR_COLORS = ['#9B7EC7', '#8A2BE2', '#B8A4D9', '#9370DB', '#7952B3'];

// Estilos para ocultar la barra de scroll horizontal en los filtros
const pillsScrollStyle: CSSProperties = {
  scrollbarWidth: 'none' as CSSProperties['scrollbarWidth'],
  overflowX:      'auto',
  paddingBottom:  '8px',
  display:        'flex',
  gap:            '8px',
};

export function PonteAPruebaDocentes({ onBack, onSelectTeacher }: PonteAPruebaDocentesProps) {
  const [searchQuery,    setSearchQuery]    = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('Todos');
  const [docentes,       setDocentes]       = useState<DocenteAPI[]>([]);
  const [cargando,       setCargando]       = useState(true);
  const [errorMsg,       setErrorMsg]       = useState('');
  const [suscribiendo,   setSuscribiendo]   = useState<number | null>(null);
  const [expandidos,     setExpandidos]     = useState<Set<number>>(new Set());

  const toggleExpandir = (id: number) =>
    setExpandidos(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  useEffect(() => {
    let activo = true;
    async function cargar() {
      try {
        const data = await listarDocentesAPI();
        if (activo) setDocentes(data);
      } catch {
        if (activo) setErrorMsg('No se pudo cargar la lista de docentes.');
      } finally {
        if (activo) setCargando(false);
      }
    }
    cargar();
    return () => { activo = false; };
  }, []);

  // Filtros dinámicos derivados de los temas de los docentes
  const filtrosTemas: string[] = ['Todos', ...Array.from(
    new Set(docentes.flatMap(d => d.temas))
  )];

  const filteredDocentes = docentes.filter(d => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      d.nombre.toLowerCase().includes(q) ||
      d.temas.some(t => t.toLowerCase().includes(q));
    const matchesFilter =
      selectedFilter === 'Todos' || d.temas.includes(selectedFilter);
    return matchesSearch && matchesFilter;
  });

  // Suscribirse a un docente
  const handleSuscribir = async (idDocente: number) => {
    setSuscribiendo(idDocente);
    try {
      await suscribirseAPI(idDocente);
      setDocentes(prev => prev.map(d =>
        d.id_usuario === idDocente
          ? { ...d, esSuscrito: true, totalSuscritos: d.totalSuscritos + 1 }
          : d
      ));
    } catch {
      // silencioso — el usuario ya puede reintentar
    } finally {
      setSuscribiendo(null);
    }
  };

  return (
    <div style={{
      height:        '100%',
      width:         '100%',
      display:       'flex',
      flexDirection: 'column',
      background:    'linear-gradient(180deg, #F3EBFF 0%, #FFFFFF 100%)',
      overflow:      'hidden',
    }}>
      {/* ── HEADER ─────────────────────────────────────────── */}
      <div style={{
        backgroundColor: '#FFFFFF',
        boxShadow:       '0 2px 8px rgba(0,0,0,0.08)',
        padding:         '16px 20px',
        flexShrink:      0,
      }}>
        {/* Fila: Flecha · Título · Corazones */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <button onClick={onBack} style={{
            width: '36px', height: '36px', borderRadius: '50%', border: 'none',
            background: 'transparent', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: '#9B7EC7',
          }}>
            <ArrowLeft size={22} strokeWidth={2.5} />
          </button>

          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '17px', color: '#1E293B', margin: 0 }}>
            Elige un Docente
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {[1, 2, 3].map(n => (
              <Heart key={n} size={18} fill="#EF4444" color="#EF4444" strokeWidth={2} />
            ))}
          </div>
        </div>

        {/* Buscador */}
        <div style={{
          position: 'relative', backgroundColor: '#F8F9FA',
          borderRadius: '16px', border: '2px solid #E6D5F0', marginBottom: '16px',
        }}>
          <Search size={18} strokeWidth={2.5} style={{
            position: 'absolute', left: '14px', top: '50%',
            transform: 'translateY(-50%)', color: '#9B7EC7',
          }} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Busca a tu docente o tema..."
            style={{
              width: '100%', padding: '12px 16px 12px 44px',
              background: 'transparent', border: 'none', outline: 'none',
              fontFamily: 'Poppins, sans-serif', fontSize: '14px', color: '#1E293B', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Pills de filtro */}
        {!cargando && filtrosTemas.length > 1 && (
          <div style={pillsScrollStyle}>
            {filtrosTemas.map(tema => (
              <button key={tema} onClick={() => setSelectedFilter(tema)} style={{
                padding: '8px 16px', borderRadius: '999px', whiteSpace: 'nowrap',
                flexShrink: 0, cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
                fontWeight: 600, fontSize: '12px', transition: 'all 0.2s',
                backgroundColor: selectedFilter === tema ? '#9B7EC7' : '#F3EBFF',
                color:           selectedFilter === tema ? '#FFFFFF'  : '#7952B3',
                border:          selectedFilter === tema ? 'none'     : '2px solid #E6D5F0',
                boxShadow:       selectedFilter === tema ? '0 4px 12px rgba(155,126,199,0.3)' : 'none',
              }}>
                {tema}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── LISTA ──────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

        {cargando && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '60px', gap: '12px' }}>
            <Loader2 size={32} className="animate-spin" style={{ color: '#9B7EC7' }} />
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', color: '#7D7D7D', margin: 0 }}>
              Cargando docentes...
            </p>
          </div>
        )}

        {!cargando && errorMsg && (
          <div style={{
            padding: '16px', backgroundColor: '#FEE2E2', border: '1px solid #FECACA',
            borderRadius: '8px', fontFamily: 'Poppins, sans-serif', fontSize: '13px', color: '#991B1B',
          }}>
            {errorMsg}
          </div>
        )}

        {!cargando && !errorMsg && filteredDocentes.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: '48px', fontFamily: 'Poppins, sans-serif', fontSize: '14px', color: '#7D7D7D' }}>
            {searchQuery || selectedFilter !== 'Todos'
              ? 'No se encontraron docentes con ese criterio.'
              : 'Ningún docente ha publicado flashcards todavía.'}
          </div>
        )}

        {!cargando && filteredDocentes.map((docente, idx) => {
          const avatarColor  = AVATAR_COLORS[idx % AVATAR_COLORS.length];
          const inicial      = docente.nombre.charAt(0).toUpperCase();
          const cargandoEste = suscribiendo === docente.id_usuario;
          const expandido    = expandidos.has(docente.id_usuario);
          const TEMAS_VISIBLES = 2;
          const temasVisibles  = expandido ? docente.temas : docente.temas.slice(0, TEMAS_VISIBLES);
          const temasOcultos   = docente.temas.length - TEMAS_VISIBLES;

          return (
            <div key={docente.id_usuario} style={{
              display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 16px',
              borderRadius: '20px', marginBottom: '10px', backgroundColor: '#FFFFFF',
              boxShadow: '0 4px 16px rgba(155,126,199,0.12)', border: '1.5px solid #EDE4F8',
            }}>
              {/* Avatar */}
              {docente.fotoPerfil ? (
                <img src={docente.fotoPerfil} alt={docente.nombre} style={{
                  width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover',
                  border: '2px solid #EDE4F8', flexShrink: 0, marginTop: '2px',
                }} />
              ) : (
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%', backgroundColor: avatarColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '20px',
                  color: '#FFFFFF', flexShrink: 0, marginTop: '2px',
                }}>
                  {inicial}
                </div>
              )}

              {/* Info central */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Nombre completo */}
                <h3 style={{
                  fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '14px',
                  color: '#1E293B', margin: '0 0 6px 0', lineHeight: '1.3',
                }}>
                  {docente.nombre}
                </h3>

                {/* Pills de temas */}
                {docente.temas.length > 0 && (
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {temasVisibles.map(t => (
                        <span key={t} style={{
                          backgroundColor: '#F3EBFF', color: '#7952B3',
                          padding: '3px 8px', borderRadius: '999px',
                          fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '10px',
                        }}>
                          {t}
                        </span>
                      ))}
                      {!expandido && temasOcultos > 0 && (
                        <button onClick={() => toggleExpandir(docente.id_usuario)} style={{
                          backgroundColor: '#EDE4F8', color: '#9B7EC7',
                          padding: '3px 8px', borderRadius: '999px', border: 'none',
                          fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '10px',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px',
                        }}>
                          +{temasOcultos} <ChevronDown size={10} strokeWidth={2.5} />
                        </button>
                      )}
                      {expandido && temasOcultos > 0 && (
                        <button onClick={() => toggleExpandir(docente.id_usuario)} style={{
                          backgroundColor: '#EDE4F8', color: '#9B7EC7',
                          padding: '3px 8px', borderRadius: '999px', border: 'none',
                          fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '10px',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px',
                        }}>
                          Menos <ChevronUp size={10} strokeWidth={2.5} />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Flashcards */}
                <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px',
                  fontWeight: 600, color: '#9B7EC7' }}>
                  {docente.totalFlashcards} Flashcards
                </span>
              </div>

              {/* Columna derecha: badge Suscrito + botón acción */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '6px', flexShrink: 0 }}>
                {/* Badge Suscrito (siempre ocupa espacio para mantener alineación) */}
                <div style={{ height: '20px', display: 'flex', alignItems: 'center' }}>
                  {docente.esSuscrito && (
                    <span style={{
                      backgroundColor: '#D1FAE5', color: '#10B981', padding: '2px 8px',
                      borderRadius: '999px', fontFamily: 'Poppins, sans-serif',
                      fontWeight: 600, fontSize: '10px', whiteSpace: 'nowrap',
                    }}>
                      ✓ Suscrito
                    </span>
                  )}
                </div>

                {/* Botón acción */}
                {!docente.esSuscrito ? (
                  <button
                    onClick={() => handleSuscribir(docente.id_usuario)}
                    disabled={cargandoEste}
                    style={{
                      padding: '9px 16px', borderRadius: '999px', border: 'none',
                      backgroundColor: cargandoEste ? '#CCCCCC' : '#9B7EC7',
                      color: '#FFFFFF', fontFamily: 'Poppins, sans-serif', fontWeight: 700,
                      fontSize: '12px', cursor: cargandoEste ? 'not-allowed' : 'pointer',
                      boxShadow: cargandoEste ? 'none' : '0 4px 12px rgba(155,126,199,0.35)',
                      whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '5px',
                    }}
                  >
                    {cargandoEste && <Loader2 size={12} className="animate-spin" />}
                    Suscribirse
                  </button>
                ) : (
                  <button
                    onClick={() => onSelectTeacher(String(docente.id_usuario), docente.nombre)}
                    style={{
                      padding: '9px 16px', borderRadius: '999px', border: 'none',
                      backgroundColor: '#9B7EC7', color: '#FFFFFF',
                      fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '12px',
                      cursor: 'pointer', boxShadow: '0 4px 12px rgba(155,126,199,0.35)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Practicar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
