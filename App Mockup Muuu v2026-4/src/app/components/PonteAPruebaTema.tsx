import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Loader2 } from 'lucide-react';
import { listarTemasAPI, type TemaAPI } from '../services/api';
import { useThemeColors } from '../contexts/SettingsContext';

// ─────────────────────────────────────────────────────────────
//  PonteAPruebaTema — selección de tema para el quiz
// ─────────────────────────────────────────────────────────────

interface PonteAPruebaTemaProps {
  onBack:        () => void;
  onSelectTema:  (idTema: number, nombreTema: string) => void;
}

export function PonteAPruebaTema({ onBack, onSelectTema }: PonteAPruebaTemaProps) {
  const c = useThemeColors('student');
  const [searchQuery, setSearchQuery] = useState('');
  const [temas,       setTemas]       = useState<TemaAPI[]>([]);
  const [cargando,    setCargando]    = useState(true);
  const [errorMsg,    setErrorMsg]    = useState('');

  useEffect(() => {
    let activo = true;
    async function cargar() {
      try {
        const data = await listarTemasAPI();
        if (activo) setTemas(data);
      } catch {
        if (activo) setErrorMsg('No se pudo cargar la lista de temas.');
      } finally {
        if (activo) setCargando(false);
      }
    }
    cargar();
    return () => { activo = false; };
  }, []);

  const filteredTemas = temas.filter(t => {
    const q = searchQuery.toLowerCase();
    return (
      t.nombre.toLowerCase().includes(q) ||
      (t.descripcion ?? '').toLowerCase().includes(q)
    );
  });

  return (
    <div style={{
      height: '100%', width: '100%', display: 'flex', flexDirection: 'column',
      background: c.bgGradient, overflow: 'hidden',
    }}>
      {/* ── HEADER ─────────────────────────────────────────── */}
      <div style={{
        backgroundColor: c.bgCard, boxShadow: `0 2px 8px ${c.shadow}`,
        padding: '16px 20px', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <button onClick={onBack} style={{
            width: '36px', height: '36px', borderRadius: '50%', border: 'none',
            background: 'transparent', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: c.purple,
          }}>
            <ArrowLeft size={22} strokeWidth={2.5} />
          </button>

          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '17px', color: c.textPrimary, margin: 0 }}>
            Ponte a Prueba por Tema
          </h1>

          <div style={{ width: '36px' }} />
        </div>

        {/* Buscador */}
        <div style={{
          position: 'relative', backgroundColor: c.bgSurface,
          borderRadius: '16px', border: `2px solid ${c.purplePale}`,
        }}>
          <Search size={18} strokeWidth={2.5} style={{
            position: 'absolute', left: '14px', top: '50%',
            transform: 'translateY(-50%)', color: c.purple,
          }} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Busca un tema..."
            style={{
              width: '100%', padding: '12px 16px 12px 44px',
              background: 'transparent', border: 'none', outline: 'none',
              fontFamily: 'Poppins, sans-serif', fontSize: '14px', color: c.textPrimary, boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* ── LISTA ──────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

        {cargando && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '60px', gap: '12px' }}>
            <Loader2 size={32} className="animate-spin" style={{ color: '#9B7EC7' }} />
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', color: c.textMuted, margin: 0 }}>
              Cargando temas...
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

        {!cargando && !errorMsg && filteredTemas.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: '48px', fontFamily: 'Poppins, sans-serif',
            fontSize: '14px', color: c.textMuted }}>
            {searchQuery ? 'No se encontraron temas con ese criterio.' : 'No hay temas disponibles.'}
          </div>
        )}

        {!cargando && filteredTemas.map((tema) => (
          <div key={tema.id_tema} style={{
            display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px',
            borderRadius: '20px', marginBottom: '10px', backgroundColor: c.bgCard,
            boxShadow: `0 4px 16px ${c.shadow}`, border: `1.5px solid ${c.borderCard}`,
          }}>
            {/* Info — nombre + descripción sin truncar */}
            <div style={{ flex: 1 }}>
              <h3 style={{
                fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '14px',
                color: c.textPrimary, margin: '0 0 4px 0', lineHeight: '1.35',
              }}>
                {tema.nombre}
              </h3>
              {tema.descripcion && (
                <p style={{
                  fontFamily: 'Poppins, sans-serif', fontSize: '12px', color: c.textMuted,
                  margin: 0, lineHeight: '1.45',
                }}>
                  {tema.descripcion}
                </p>
              )}
            </div>

            {/* Botón Practicar */}
            <button
              onClick={() => onSelectTema(tema.id_tema, tema.nombre)}
              style={{
                padding: '10px 18px', borderRadius: '999px', border: 'none',
                backgroundColor: c.purple, color: '#FFFFFF',
                fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '13px',
                cursor: 'pointer', boxShadow: '0 4px 12px rgba(155,126,199,0.35)',
                flexShrink: 0, whiteSpace: 'nowrap',
              }}
            >
              Practicar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
