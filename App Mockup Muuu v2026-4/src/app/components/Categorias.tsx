import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Loader2, AlertTriangle, BookOpen, FileText, Tag, Lock } from 'lucide-react';
import {
  listarTemasEstadisticasAPI,
  crearTemaAPI,
  eliminarTemaAPI,
  type TemaEstadisticasAPI,
} from '../services/api';
import { useThemeColors } from '../contexts/SettingsContext';

interface CategoriasProps {
  onBack: () => void;
}

export function Categorias({ onBack }: CategoriasProps) {
  const [temas, setTemas]             = useState<TemaEstadisticasAPI[]>([]);
  const [cargando, setCargando]       = useState(true);
  const [errorMsg, setErrorMsg]       = useState('');

  // Estado del formulario de creación
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaDesc,   setNuevaDesc]   = useState('');
  const [guardando,   setGuardando]   = useState(false);
  const [errorForm,   setErrorForm]   = useState('');

  // Estado de borrado
  const [eliminandoId, setEliminandoId]         = useState<number | null>(null);
  const [errorBorrado, setErrorBorrado]          = useState<{ id: number; msg: string } | null>(null);
  const [confirmDeleteId, setConfirmDeleteId]    = useState<number | null>(null);
  const c = useThemeColors('teacher');

  const cargar = async () => {
    setCargando(true);
    setErrorMsg('');
    try {
      const data = await listarTemasEstadisticasAPI();
      setTemas(data);
    } catch {
      setErrorMsg('No se pudieron cargar las categorías.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  // ── Crear tema ─────────────────────────────────────────────
  const handleCrear = async () => {
    setErrorForm('');
    if (!nuevoNombre.trim()) {
      setErrorForm('El nombre es obligatorio.');
      return;
    }
    setGuardando(true);
    try {
      const nuevo = await crearTemaAPI({
        nombre:      nuevoNombre.trim(),
        descripcion: nuevaDesc.trim() || undefined,
      });
      setTemas(prev => [...prev, nuevo]);
      setNuevoNombre('');
      setNuevaDesc('');
      setMostrarForm(false);
    } catch (err: unknown) {
      setErrorForm(err instanceof Error ? err.message : 'Error al crear la categoría.');
    } finally {
      setGuardando(false);
    }
  };

  // ── Eliminar tema ──────────────────────────────────────────
  const handleEliminar = async (id: number) => {
    setErrorBorrado(null);
    setEliminandoId(id);
    setConfirmDeleteId(null);
    try {
      await eliminarTemaAPI(id);
      setTemas(prev => prev.filter(t => t.id_tema !== id));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'No se pudo eliminar.';
      setErrorBorrado({ id, msg });
    } finally {
      setEliminandoId(null);
    }
  };

  // ── UI ──────────────────────────────────────────────────────
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        background: c.bgGradient,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* ── Header ───────────────────────────────────────────── */}
      <div
        style={{
          background: c.headerBg,
          padding: '20px 20px 24px 20px',
          borderRadius: '0 0 24px 24px',
          boxShadow: `0 4px 12px ${c.shadow}`,
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onBack}
            style={{
              background: 'rgba(255,255,255,0.25)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <ArrowLeft size={18} color={c.headerText} strokeWidth={2.5} />
          </button>
          <div>
            <h1
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: '18px',
                color: c.headerText,
                margin: 0,
              }}
            >
              Mis Categorías
            </h1>
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '12px',
                color: c.headerText,
                opacity: 0.8,
                margin: 0,
              }}
            >
              {temas.length} tema{temas.length !== 1 ? 's' : ''} disponible{temas.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* ── Contenido ────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>

        {/* Cargando */}
        {cargando && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Loader2 size={32} color="#F59E0B" style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} />
            <p style={{ fontFamily: 'Poppins, sans-serif', color: '#92400E', marginTop: '12px', fontSize: '14px' }}>
              Cargando categorías…
            </p>
          </div>
        )}

        {/* Error general */}
        {!cargando && errorMsg && (
          <div
            style={{
              backgroundColor: '#FEF2F2',
              border: '1.5px solid #FCA5A5',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
              marginBottom: '16px',
            }}
          >
            <p style={{ fontFamily: 'Poppins, sans-serif', color: '#DC2626', fontSize: '14px', margin: 0 }}>
              {errorMsg}
            </p>
            <button
              onClick={cargar}
              style={{
                marginTop: '8px',
                background: '#F59E0B',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 16px',
                color: '#78350F',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Lista de temas */}
        {!cargando && !errorMsg && temas.map(tema => (
          <div
            key={tema.id_tema}
            style={{
              backgroundColor: c.bgCard,
              borderRadius: '16px',
              padding: '16px 20px',
              marginBottom: '12px',
              boxShadow: `0 2px 8px ${c.shadow}`,
              border: `1.5px solid ${c.borderCard}`,
            }}
          >
            {/* Fila principal */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              {/* Nombre + desc */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 700,
                    fontSize: '14px',
                    color: c.textPrimary,
                    margin: 0,
                    lineHeight: '1.4',
                  }}
                >
                  {tema.nombre}
                </p>
                {tema.descripcion && (
                  <p
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '11px',
                      color: c.textSecondary,
                      margin: '4px 0 0 0',
                      lineHeight: '1.5',
                    }}
                  >
                    {tema.descripcion}
                  </p>
                )}

                {/* Contadores */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 600,
                      color: tema.totalFlashcards > 0 ? c.yellowDark : c.textMuted,
                      backgroundColor: tema.totalFlashcards > 0 ? c.yellowPale : c.bgSurface,
                      padding: '2px 8px',
                      borderRadius: '20px',
                    }}
                  >
                    <BookOpen size={10} strokeWidth={2.5} />
                    {tema.totalFlashcards} flashcard{tema.totalFlashcards !== 1 ? 's' : ''}
                  </span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 600,
                      color: tema.totalMateriales > 0 ? '#1E40AF' : c.textMuted,
                      backgroundColor: tema.totalMateriales > 0 ? '#DBEAFE' : c.bgSurface,
                      padding: '2px 8px',
                      borderRadius: '20px',
                    }}
                  >
                    <FileText size={10} strokeWidth={2.5} />
                    {tema.totalMateriales} doc{tema.totalMateriales !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Botón: candado si es sistema, basura si es custom */}
              {tema.esSistema ? (
                <div
                  title="Tema del sistema — no se puede eliminar"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: c.bgSurface,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Lock size={15} color={c.textMuted} strokeWidth={2.5} />
                </div>
              ) : (
                <button
                  onClick={() => {
                    setErrorBorrado(null);
                    setConfirmDeleteId(tema.id_tema);
                  }}
                  disabled={eliminandoId === tema.id_tema}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#FEF2F2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  {eliminandoId === tema.id_tema
                    ? <Loader2 size={16} color="#EF4444" style={{ animation: 'spin 1s linear infinite' }} />
                    : <Trash2 size={16} color="#EF4444" strokeWidth={2.5} />
                  }
                </button>
              )}
            </div>

            {/* Confirmación de borrado (solo temas custom) */}
            {!tema.esSistema && confirmDeleteId === tema.id_tema && (
              <div
                style={{
                  marginTop: '12px',
                  backgroundColor: '#FFFBEB',
                  border: '1.5px solid #F59E0B',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', color: '#92400E', margin: 0 }}>
                  ¿Eliminar la categoría <strong>"{tema.nombre}"</strong>?
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleEliminar(tema.id_tema)}
                    style={{
                      flex: 1,
                      padding: '6px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: '#EF4444',
                      color: '#FFFFFF',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 600,
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    Sí, eliminar
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    style={{
                      flex: 1,
                      padding: '6px',
                      borderRadius: '8px',
                      border: '1.5px solid #D1D5DB',
                      backgroundColor: '#FFFFFF',
                      color: '#374151',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 600,
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Error de borrado (tiene vínculos, solo custom) */}
            {!tema.esSistema && errorBorrado?.id === tema.id_tema && (
              <div
                style={{
                  marginTop: '10px',
                  backgroundColor: '#FEF2F2',
                  border: '1.5px solid #FCA5A5',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'flex-start',
                }}
              >
                <AlertTriangle size={16} color="#DC2626" style={{ flexShrink: 0, marginTop: '1px' }} />
                <div>
                  <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', color: '#DC2626', margin: 0, fontWeight: 600 }}>
                    No se puede eliminar
                  </p>
                  <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: '#7F1D1D', margin: '3px 0 0 0' }}>
                    {errorBorrado.msg}
                  </p>
                  <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: '#7F1D1D', margin: '4px 0 0 0' }}>
                    💡 Ve a cada flashcard o documento y cambia su categoría primero.
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* ── Formulario crear categoría ───────────────────── */}
        {mostrarForm && (
          <div
            style={{
              backgroundColor: c.bgCard,
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '12px',
              boxShadow: `0 2px 8px ${c.shadow}`,
              border: `2px solid ${c.yellowDark}`,
            }}
          >
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: '14px',
                color: c.yellowDark,
                marginBottom: '12px',
                marginTop: 0,
              }}
            >
              Nueva categoría
            </p>

            {/* Nombre */}
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: c.textSecondary, margin: '0 0 4px 0' }}>
              Nombre <span style={{ color: c.error }}>*</span>
            </p>
            <input
              type="text"
              value={nuevoNombre}
              onChange={e => setNuevoNombre(e.target.value)}
              placeholder="Ej: Integrales de línea"
              maxLength={100}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '10px 12px',
                borderRadius: '10px',
                border: `1.5px solid ${c.border}`,
                backgroundColor: c.bgInput,
                fontFamily: 'Poppins, sans-serif',
                fontSize: '13px',
                color: c.textPrimary,
                marginBottom: '10px',
                outline: 'none',
              }}
            />

            {/* Descripción */}
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: c.textSecondary, margin: '0 0 4px 0' }}>
              Descripción (opcional)
            </p>
            <textarea
              value={nuevaDesc}
              onChange={e => setNuevaDesc(e.target.value)}
              placeholder="Breve descripción del tema…"
              maxLength={255}
              rows={2}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '10px 12px',
                borderRadius: '10px',
                border: `1.5px solid ${c.border}`,
                backgroundColor: c.bgInput,
                fontFamily: 'Poppins, sans-serif',
                fontSize: '13px',
                color: c.textPrimary,
                resize: 'none',
                marginBottom: '12px',
                outline: 'none',
              }}
            />

            {/* Error formulario */}
            {errorForm && (
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', color: '#DC2626', marginBottom: '10px', margin: '0 0 10px 0' }}>
                {errorForm}
              </p>
            )}

            {/* Botones acción */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleCrear}
                disabled={guardando}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  border: 'none',
                  background: `linear-gradient(135deg, ${c.yellowDark} 0%, ${c.yellow} 100%)`,
                  color: c.textOnYellow,
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: guardando ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  opacity: guardando ? 0.7 : 1,
                }}
              >
                {guardando
                  ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Guardando…</>
                  : 'Crear categoría'
                }
              </button>
              <button
                onClick={() => { setMostrarForm(false); setErrorForm(''); setNuevoNombre(''); setNuevaDesc(''); }}
                style={{
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: `1.5px solid ${c.border}`,
                  backgroundColor: c.bgSurface,
                  color: c.textPrimary,
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Estado vacío */}
        {!cargando && !errorMsg && temas.length === 0 && !mostrarForm && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <Tag size={48} color="#D1D5DB" style={{ margin: '0 auto 12px auto' }} />
            <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: '#9CA3AF', marginBottom: '4px' }}>
              No hay categorías aún
            </p>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', color: '#D1D5DB' }}>
              Crea tu primera categoría con el botón de abajo
            </p>
          </div>
        )}

        {/* Espaciado inferior */}
        <div style={{ height: '80px' }} />
      </div>

      {/* ── FAB: Crear categoría ──────────────────────────── */}
      {!mostrarForm && (
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
          }}
        >
          <button
            onClick={() => { setMostrarForm(true); setErrorBorrado(null); setConfirmDeleteId(null); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
              border: 'none',
              borderRadius: '30px',
              padding: '13px 24px',
              boxShadow: '0 4px 16px rgba(245, 158, 11, 0.45)',
              cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: '14px',
              color: '#78350F',
              whiteSpace: 'nowrap',
            }}
          >
            <Plus size={18} color="#78350F" strokeWidth={2.5} />
            Crear categoría
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
