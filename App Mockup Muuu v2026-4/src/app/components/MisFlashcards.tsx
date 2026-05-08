import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Edit3, Trash2, Eye, EyeOff } from 'lucide-react';
import {
  listarFlashcardsAPI,
  eliminarFlashcardAPI,
  publicarFlashcardAPI,
  moverABorradorAPI,
  type FlashcardAPI,
} from '../services/api';
import { useThemeColors } from '../contexts/SettingsContext';

interface MisFlashcardsProps {
  onBack:          () => void;
  onEditFlashcard: (id: number) => void;
}

type Filtro = 'Todas' | 'PUBLICADO' | 'BORRADOR';

export function MisFlashcards({ onBack, onEditFlashcard }: MisFlashcardsProps) {
  const [flashcards, setFlashcards] = useState<FlashcardAPI[]>([]);
  const [cargando,   setCargando]   = useState(true);
  const [errorMsg,   setErrorMsg]   = useState('');
  const [filtro,     setFiltro]     = useState<Filtro>('Todas');
  const [accionando, setAccionando] = useState<number | null>(null); // id en proceso
  const c = useThemeColors('teacher');

  const cargar = async () => {
    setCargando(true);
    setErrorMsg('');
    try {
      const data = await listarFlashcardsAPI();
      setFlashcards(data);
    } catch {
      setErrorMsg('No se pudieron cargar las flashcards.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const filtradas = flashcards.filter(f =>
    filtro === 'Todas' || f.estado === filtro
  );

  const handleEliminar = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('¿Eliminar esta flashcard? Esta acción no se puede deshacer.')) return;
    setAccionando(id);
    try {
      await eliminarFlashcardAPI(id);
      setFlashcards(prev => prev.filter(f => f.id_flashcard !== id));
    } catch {
      alert('Error al eliminar la flashcard.');
    } finally {
      setAccionando(null);
    }
  };

  const handleToggleEstado = async (fc: FlashcardAPI, e: React.MouseEvent) => {
    e.stopPropagation();
    setAccionando(fc.id_flashcard);
    try {
      if (fc.estado === 'PUBLICADO') {
        await moverABorradorAPI(fc.id_flashcard);
        setFlashcards(prev => prev.map(f =>
          f.id_flashcard === fc.id_flashcard ? { ...f, estado: 'BORRADOR' } : f
        ));
      } else {
        await publicarFlashcardAPI(fc.id_flashcard);
        setFlashcards(prev => prev.map(f =>
          f.id_flashcard === fc.id_flashcard ? { ...f, estado: 'PUBLICADO' } : f
        ));
      }
    } catch {
      alert('Error al cambiar el estado.');
    } finally {
      setAccionando(null);
    }
  };

  const totalPublicadas = flashcards.filter(f => f.estado === 'PUBLICADO').length;
  const totalBorradores = flashcards.filter(f => f.estado === 'BORRADOR').length;

  return (
    <div style={{
      height: '100%', width: '100%', display: 'flex', flexDirection: 'column',
      background: c.bgGradient, overflow: 'hidden',
    }}>
      {/* HEADER */}
      <div style={{
        backgroundColor: c.headerBg, padding: '16px 20px', flexShrink: 0,
        boxShadow: `0 2px 8px ${c.shadow}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <button onClick={onBack} style={{
            width: '36px', height: '36px', borderRadius: '50%', border: 'none',
            background: 'rgba(255,255,255,0.25)', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <ArrowLeft size={20} color={c.headerText} strokeWidth={2.5} />
          </button>
          <div>
            <h1 style={{
              fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '18px',
              color: c.headerText, margin: 0,
            }}>
              Mis Flashcards
            </h1>
            {!cargando && (
              <p style={{
                fontFamily: 'Poppins, sans-serif', fontSize: '12px', color: c.headerText,
                opacity: 0.8, margin: 0,
              }}>
                {flashcards.length} total · {totalPublicadas} publicadas · {totalBorradores} borradores
              </p>
            )}
          </div>
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['Todas', 'PUBLICADO', 'BORRADOR'] as Filtro[]).map(f => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              style={{
                padding: '6px 14px', borderRadius: '999px', border: 'none',
                cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
                fontWeight: 600, fontSize: '12px',
                backgroundColor: filtro === f ? c.headerText : 'rgba(255,255,255,0.25)',
                color: filtro === f ? c.headerBg : c.headerText,
              }}
            >
              {f === 'PUBLICADO' ? 'Publicadas' : f === 'BORRADOR' ? 'Borradores' : 'Todas'}
            </button>
          ))}
        </div>
      </div>

      {/* LISTA */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>

        {cargando && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '60px', gap: '12px' }}>
            <Loader2 size={32} className="animate-spin" color={c.yellowDark} />
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', color: c.textMuted }}>
              Cargando tus flashcards...
            </p>
          </div>
        )}

        {!cargando && errorMsg && (
          <div style={{
            padding: '16px', backgroundColor: '#FEE2E2', borderRadius: '8px',
            fontFamily: 'Poppins, sans-serif', fontSize: '13px', color: '#991B1B',
          }}>
            {errorMsg}
          </div>
        )}

        {!cargando && !errorMsg && filtradas.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: '60px' }}>
            <p style={{ fontSize: '48px', marginBottom: '12px' }}>📭</p>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', color: c.textMuted }}>
              {filtro === 'Todas'
                ? 'Aún no has creado ninguna flashcard.'
                : `No tienes flashcards en estado ${filtro === 'PUBLICADO' ? 'Publicado' : 'Borrador'}.`}
            </p>
          </div>
        )}

        {!cargando && filtradas.map(fc => (
          <div
            key={fc.id_flashcard}
            onClick={() => onEditFlashcard(fc.id_flashcard)}
            style={{
              backgroundColor: c.bgCard, borderRadius: '16px', padding: '16px',
              marginBottom: '12px', cursor: 'pointer',
              boxShadow: `0 2px 12px ${c.shadow}`,
              border: `2px solid ${fc.estado === 'PUBLICADO' ? c.success : c.borderCard}`,
              transition: 'transform 0.15s',
            }}
          >
            {/* Estado badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{
                padding: '3px 10px', borderRadius: '999px',
                fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '10px',
                backgroundColor: fc.estado === 'PUBLICADO' ? (c.darkMode ? 'rgba(16, 185, 129, 0.2)' : '#D1FAE5') : (c.darkMode ? c.yellowPale : '#FEF3C7'),
                color: fc.estado === 'PUBLICADO' ? c.success : c.yellowDark,
              }}>
                {fc.estado === 'PUBLICADO' ? '✓ Publicada' : '✏ Borrador'}
              </span>
              <span style={{
                fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: c.textMuted,
              }}>
                {new Date(fc.fechaCreacion).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>

            {/* Integral */}
            <p style={{
              fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '16px',
              color: c.textPrimary, marginBottom: '8px', lineHeight: '1.5',
              overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}>
              {fc.integral}
            </p>

            {/* Meta: tema · dificultad */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <span style={{
                padding: '2px 8px', borderRadius: '6px',
                backgroundColor: c.darkMode ? c.purplePale : '#E6D5F0', color: c.darkMode ? c.purple : '#7952B3',
                fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '10px',
              }}>
                {fc.tema}
              </span>
              <span style={{
                padding: '2px 8px', borderRadius: '6px',
                backgroundColor: c.bgSurface, color: c.textSecondary,
                fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '10px',
              }}>
                {fc.dificultad}
              </span>
              {fc.totalOpciones !== undefined && (
                <span style={{
                  padding: '2px 8px', borderRadius: '6px',
                  backgroundColor: c.darkMode ? c.yellowPale : '#FFF8EC', color: c.yellowDark,
                  fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '10px',
                }}>
                  {fc.totalOpciones} opciones
                </span>
              )}
            </div>

            {/* Botones de acción */}
            <div style={{ display: 'flex', gap: '8px' }} onClick={e => e.stopPropagation()}>
              {/* Editar */}
              <button
                onClick={() => onEditFlashcard(fc.id_flashcard)}
                style={{
                  flex: 1, padding: '8px', borderRadius: '10px', border: 'none',
                  backgroundColor: c.yellowDark, color: c.textOnYellow, cursor: 'pointer',
                  fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                }}
              >
                <Edit3 size={13} strokeWidth={2.5} />
                Editar
              </button>

              {/* Publicar / Borrador */}
              <button
                onClick={e => handleToggleEstado(fc, e)}
                disabled={accionando === fc.id_flashcard}
                style={{
                  flex: 1, padding: '8px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                  backgroundColor: fc.estado === 'PUBLICADO' ? (c.darkMode ? c.yellowPale : '#FEF3C7') : (c.darkMode ? 'rgba(16, 185, 129, 0.2)' : '#D1FAE5'),
                  color: fc.estado === 'PUBLICADO' ? c.yellowDark : c.success,
                  fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                  opacity: accionando === fc.id_flashcard ? 0.6 : 1,
                }}
              >
                {fc.estado === 'PUBLICADO'
                  ? <><EyeOff size={13} strokeWidth={2.5} /> Borrador</>
                  : <><Eye size={13} strokeWidth={2.5} /> Publicar</>
                }
              </button>

              {/* Eliminar */}
              <button
                onClick={e => handleEliminar(fc.id_flashcard, e)}
                disabled={accionando === fc.id_flashcard}
                style={{
                  width: '36px', height: '36px', borderRadius: '10px', border: 'none',
                  backgroundColor: c.errorBg, color: c.error, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: accionando === fc.id_flashcard ? 0.6 : 1, flexShrink: 0,
                }}
              >
                <Trash2 size={15} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
