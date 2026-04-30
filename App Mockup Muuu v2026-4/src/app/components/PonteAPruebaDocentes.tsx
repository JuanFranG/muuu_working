import { useState, useEffect, CSSProperties } from 'react';
import { ArrowLeft, Search, Heart, Loader2 } from 'lucide-react';
import { listarDocentesAPI, type DocenteAPI } from '../services/api';

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
  const [searchQuery,     setSearchQuery]     = useState('');
  const [selectedFilter,  setSelectedFilter]  = useState<string>('Todos');
  const [docentes,        setDocentes]        = useState<DocenteAPI[]>([]);
  const [cargando,        setCargando]        = useState(true);
  const [errorMsg,        setErrorMsg]        = useState('');

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
  const temas: string[] = ['Todos', ...Array.from(
    new Set(
      docentes
        .map(d => d.temaPrincipal)
        .filter((t): t is string => typeof t === 'string' && t.length > 0)
    )
  )];

  const filteredDocentes = docentes.filter(d => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      d.nombre.toLowerCase().includes(q) ||
      (d.temaPrincipal ?? '').toLowerCase().includes(q);
    const matchesFilter =
      selectedFilter === 'Todos' || d.temaPrincipal === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div
      style={{
        height:     '100%',
        width:      '100%',
        display:    'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #F3EBFF 0%, #FFFFFF 100%)',
        overflow:   'hidden',
      }}
    >
      {/* ── HEADER ─────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          boxShadow:       '0 2px 8px rgba(0,0,0,0.08)',
          padding:         '16px 20px',
          flexShrink:      0,
        }}
      >
        {/* Fila: Flecha · Título · Corazones */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <button
            onClick={onBack}
            style={{
              width:           '36px',
              height:          '36px',
              borderRadius:    '50%',
              border:          'none',
              background:      'transparent',
              cursor:          'pointer',
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              color:           '#9B7EC7',
            }}
          >
            <ArrowLeft size={22} strokeWidth={2.5} />
          </button>

          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '17px', color: '#1E293B', margin: 0 }}>
            Ponte a Prueba 🏆
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {[1, 2, 3].map(n => (
              <Heart key={n} size={18} fill="#EF4444" color="#EF4444" strokeWidth={2} />
            ))}
          </div>
        </div>

        {/* Buscador */}
        <div
          style={{
            position:        'relative',
            backgroundColor: '#F8F9FA',
            borderRadius:    '16px',
            border:          '2px solid #E6D5F0',
            marginBottom:    '16px',
          }}
        >
          <Search
            size={18}
            strokeWidth={2.5}
            style={{
              position:  'absolute',
              left:      '14px',
              top:       '50%',
              transform: 'translateY(-50%)',
              color:     '#9B7EC7',
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Busca a tu docente o tema..."
            style={{
              width:      '100%',
              padding:    '12px 16px 12px 44px',
              background: 'transparent',
              border:     'none',
              outline:    'none',
              fontFamily: 'Poppins, sans-serif',
              fontSize:   '14px',
              color:      '#1E293B',
              boxSizing:  'border-box',
            }}
          />
        </div>

        {/* Pills de filtro — solo cuando hay más de un tema */}
        {!cargando && temas.length > 1 && (
          <div style={pillsScrollStyle}>
            {temas.map(tema => (
              <button
                key={tema}
                onClick={() => setSelectedFilter(tema)}
                style={{
                  padding:         '8px 16px',
                  borderRadius:    '999px',
                  whiteSpace:      'nowrap',
                  flexShrink:      0,
                  cursor:          'pointer',
                  fontFamily:      'Poppins, sans-serif',
                  fontWeight:      600,
                  fontSize:        '12px',
                  transition:      'all 0.2s',
                  backgroundColor: selectedFilter === tema ? '#9B7EC7' : '#F3EBFF',
                  color:           selectedFilter === tema ? '#FFFFFF'  : '#7952B3',
                  border:          selectedFilter === tema ? 'none'     : '2px solid #E6D5F0',
                  boxShadow:       selectedFilter === tema ? '0 4px 12px rgba(155,126,199,0.3)' : 'none',
                }}
              >
                {tema}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── LISTA ──────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

        {/* Cargando */}
        {cargando && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '60px', gap: '12px' }}>
            <Loader2 size={32} className="animate-spin" style={{ color: '#9B7EC7' }} />
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', color: '#7D7D7D', margin: 0 }}>
              Cargando docentes...
            </p>
          </div>
        )}

        {/* Error */}
        {!cargando && errorMsg && (
          <div
            style={{
              padding:         '16px',
              backgroundColor: '#FEE2E2',
              border:          '1px solid #FECACA',
              borderRadius:    '8px',
              fontFamily:      'Poppins, sans-serif',
              fontSize:        '13px',
              color:           '#991B1B',
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Sin resultados */}
        {!cargando && !errorMsg && filteredDocentes.length === 0 && (
          <div
            style={{
              textAlign:  'center',
              paddingTop: '48px',
              fontFamily: 'Poppins, sans-serif',
              fontSize:   '14px',
              color:      '#7D7D7D',
            }}
          >
            {searchQuery || selectedFilter !== 'Todos'
              ? 'No se encontraron docentes con ese criterio.'
              : 'Ningún docente ha publicado flashcards todavía.'}
          </div>
        )}

        {/* Cards de docentes */}
        {!cargando && filteredDocentes.map((docente, idx) => {
          const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
          const inicial     = docente.nombre.charAt(0).toUpperCase();

          return (
            <div
              key={docente.id_usuario}
              style={{
                display:         'flex',
                alignItems:      'center',
                gap:             '16px',
                padding:         '16px',
                borderRadius:    '24px',
                marginBottom:    '12px',
                backgroundColor: '#FFFFFF',
                boxShadow:       '0 4px 16px rgba(155,126,199,0.15)',
                border:          '2px solid #F3EBFF',
              }}
            >
              {/* Avatar */}
              {docente.fotoPerfil ? (
                <img
                  src={docente.fotoPerfil}
                  alt={docente.nombre}
                  style={{
                    width:        '56px',
                    height:       '56px',
                    borderRadius: '50%',
                    objectFit:    'cover',
                    border:       '3px solid #FFFFFF',
                    boxShadow:    '0 2px 8px rgba(155,126,199,0.2)',
                    flexShrink:   0,
                  }}
                />
              ) : (
                <div
                  style={{
                    width:           '56px',
                    height:          '56px',
                    borderRadius:    '50%',
                    backgroundColor: avatarColor,
                    border:          '3px solid #FFFFFF',
                    boxShadow:       '0 2px 8px rgba(155,126,199,0.2)',
                    display:         'flex',
                    alignItems:      'center',
                    justifyContent:  'center',
                    fontFamily:      'Poppins, sans-serif',
                    fontWeight:      700,
                    fontSize:        '22px',
                    color:           '#FFFFFF',
                    flexShrink:      0,
                  }}
                >
                  {inicial}
                </div>
              )}

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3
                  style={{
                    fontFamily:   'Poppins, sans-serif',
                    fontWeight:   700,
                    fontSize:     '15px',
                    color:        '#1E293B',
                    margin:       '0 0 4px 0',
                    overflow:     'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace:   'nowrap',
                  }}
                >
                  {docente.nombre}
                </h3>

                {docente.temaPrincipal && (
                  <p
                    style={{
                      fontFamily:   'Poppins, sans-serif',
                      fontSize:     '12px',
                      color:        '#7D7D7D',
                      margin:       '0 0 6px 0',
                      overflow:     'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace:   'nowrap',
                    }}
                  >
                    {docente.temaPrincipal}
                  </p>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div
                    style={{
                      width:           '6px',
                      height:          '6px',
                      borderRadius:    '50%',
                      backgroundColor: '#9B7EC7',
                      flexShrink:      0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize:   '11px',
                      fontWeight: 600,
                      color:      '#9B7EC7',
                    }}
                  >
                    {docente.totalFlashcards} Flashcards publicadas
                  </span>
                </div>
              </div>

              {/* Botón Practicar */}
              <button
                onClick={() => onSelectTeacher(String(docente.id_usuario), docente.nombre)}
                style={{
                  padding:         '10px 20px',
                  borderRadius:    '999px',
                  border:          'none',
                  backgroundColor: '#9B7EC7',
                  color:           '#FFFFFF',
                  fontFamily:      'Poppins, sans-serif',
                  fontWeight:      700,
                  fontSize:        '13px',
                  cursor:          'pointer',
                  boxShadow:       '0 4px 12px rgba(155,126,199,0.4)',
                  flexShrink:      0,
                  whiteSpace:      'nowrap',
                }}
              >
                Practicar
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
