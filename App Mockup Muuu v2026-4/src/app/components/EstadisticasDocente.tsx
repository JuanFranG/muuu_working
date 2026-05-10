import { useState, useEffect } from 'react';
import { ArrowLeft, Eye, Download, Users, BookOpen, FileText, BarChart3, FileDown } from 'lucide-react';
import { obtenerEstadisticasDocenteAPI, type EstadisticasDocenteAPI } from '../services/api';
import { useThemeColors } from '../contexts/SettingsContext';
import { ReporteDocente } from './ReporteDocente';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * Convierte LaTeX / texto mixto a HTML usando KaTeX.
 * Soporta texto puro, $…$ o mezcla "Si $\int…$ = 5, entonces…"
 */
const renderLatex = (raw: string): string => {
  if (!raw) return '';
  if (raw.includes('$')) {
    return raw.replace(/\$([^$]+)\$?/g, (_m, inner) => {
      try { return katex.renderToString(inner.trim(), { throwOnError: false, displayMode: false, strict: false }); }
      catch { return inner; }
    });
  }
  const src = raw.trim();
  try { return katex.renderToString(src, { throwOnError: false, displayMode: false, strict: false }); }
  catch { return raw; }
};

interface EstadisticasDocenteProps {
  onBack: () => void;
}

const INICIAL: EstadisticasDocenteAPI = {
  flashcardsPublicadas: 0,
  suscriptores:         0,
  materiales:           0,
  accesos:              0,
  descargas:            0,
  tasaAciertos:         0,
  topFlashcards:        [],
};

export function EstadisticasDocente({ onBack }: EstadisticasDocenteProps) {
  const c = useThemeColors('teacher');
  const [stats,        setStats]        = useState<EstadisticasDocenteAPI>(INICIAL);
  const [cargando,     setCargando]     = useState(true);
  const [verReporte,   setVerReporte]   = useState(false);

  // useEffect ANTES de cualquier return condicional (Rules of Hooks)
  useEffect(() => {
    obtenerEstadisticasDocenteAPI()
      .then(setStats)
      .finally(() => setCargando(false));
  }, []);

  if (verReporte) return <ReporteDocente onBack={() => setVerReporte(false)} />;

  const primary = c.yellowDark;
  const dark    = c.headerText;
  const bg      = c.bgGradient;
  const cardBg  = c.bgCard;

  const getAciertosColor = (pct: number) => {
    if (pct >= 70) return '#10B981';
    if (pct >= 40) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div
      className="h-full w-full relative overflow-y-auto"
      style={{ background: c.bgPage, maxWidth: '375px', margin: '0 auto', paddingBottom: '40px' }}
    >
      {/* ── HEADER ───────────────────────────────────────────── */}
      <div style={{
        background: `linear-gradient(135deg, ${primary} 0%, #FBBF24 100%)`,
        padding: '24px 20px 28px 20px',
        borderRadius: '0 0 28px 28px',
        boxShadow: '0 4px 12px rgba(245,158,11,0.25)',
      }}>
        <div className="flex items-center gap-3" style={{ marginBottom: '20px' }}>
          <button
            onClick={onBack}
            style={{
              background: 'rgba(255,255,255,0.2)', border: 'none',
              borderRadius: '50%', width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <ArrowLeft size={20} color={dark} strokeWidth={2.5} />
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '18px', color: dark, margin: 0 }}>
              Mis Estadísticas
            </h1>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', color: dark, opacity: 0.7, margin: 0 }}>
              Rendimiento de tus flashcards
            </p>
          </div>
          <button
            onClick={() => setVerReporte(true)}
            style={{
              background: 'rgba(255,255,255,0.95)', border: 'none',
              borderRadius: '20px', padding: '7px 14px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '5px',
              fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '12px', color: '#4a008f',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            }}
          >
            <FileDown size={15} color="#4a008f" strokeWidth={2.5} />
            PDF
          </button>
        </div>

        {/* ── HERO: Tasa de aciertos global ────────────────── */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: '20px',
          padding: '20px 24px',
          display: 'flex', alignItems: 'center', gap: '16px',
        }}>
          {/* Círculo de progreso visual */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <svg width="80" height="80" viewBox="0 0 80 80">
              {/* Fondo */}
              <circle cx="40" cy="40" r="32" fill="none" stroke="#FDE68A" strokeWidth="8" />
              {/* Progreso */}
              <circle
                cx="40" cy="40" r="32"
                fill="none"
                stroke={getAciertosColor(cargando ? 0 : stats.tasaAciertos)}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 32}`}
                strokeDashoffset={`${2 * Math.PI * 32 * (1 - (cargando ? 0 : stats.tasaAciertos) / 100)}`}
                transform="rotate(-90 40 40)"
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
              />
            </svg>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '16px', color: dark }}>
                {cargando ? '…' : `${stats.tasaAciertos}%`}
              </span>
            </div>
          </div>

          <div>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '16px', color: dark, margin: '0 0 4px 0' }}>
              Tasa de aciertos global
            </p>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', color: '#92400E', margin: 0, lineHeight: '1.4' }}>
              Porcentaje de respuestas correctas de los estudiantes en tus flashcards
            </p>
            {!cargando && stats.tasaAciertos === 0 && (
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: '#B45309', margin: '6px 0 0 0', fontStyle: 'italic' }}>
                Aún no hay datos de quizzes
              </p>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: '20px' }}>

        {/* ── GRID DE MÉTRICAS ─────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3" style={{ marginBottom: '20px' }}>

          {/* Flashcards publicadas */}
          <div style={{
            backgroundColor: cardBg, borderRadius: '16px', padding: '18px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '8px',
          }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FEF9C3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={20} color="#D97706" strokeWidth={2.5} />
            </div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '28px', color: dark, lineHeight: 1 }}>
              {cargando ? '…' : stats.flashcardsPublicadas}
            </div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: c.textMuted }}>
              Flashcards publicadas
            </div>
          </div>

          {/* Suscriptores */}
          <div style={{
            background: `linear-gradient(135deg, ${primary} 0%, #FBBF24 100%)`,
            borderRadius: '16px', padding: '18px',
            boxShadow: '0 4px 12px rgba(245,158,11,0.25)', display: 'flex', flexDirection: 'column', gap: '8px',
          }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} color={dark} strokeWidth={2.5} />
            </div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '28px', color: dark, lineHeight: 1 }}>
              {cargando ? '…' : stats.suscriptores}
            </div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: dark, opacity: 0.8 }}>
              Estudiantes suscritos
            </div>
          </div>

          {/* Materiales */}
          <div style={{
            backgroundColor: cardBg, borderRadius: '16px', padding: '18px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '8px',
          }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={20} color="#3B82F6" strokeWidth={2.5} />
            </div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '28px', color: dark, lineHeight: 1 }}>
              {cargando ? '…' : stats.materiales}
            </div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: c.textMuted }}>
              Materiales subidos
            </div>
          </div>

          {/* Total interacciones */}
          <div style={{
            backgroundColor: cardBg, borderRadius: '16px', padding: '18px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '8px',
          }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart3 size={20} color="#10B981" strokeWidth={2.5} />
            </div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '28px', color: dark, lineHeight: 1 }}>
              {cargando ? '…' : stats.accesos + stats.descargas}
            </div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: c.textMuted }}>
              Interacciones totales
            </div>
          </div>
        </div>

        {/* ── ACCESOS Y DESCARGAS ───────────────────────────── */}
        <div style={{
          backgroundColor: cardBg, borderRadius: '16px', padding: '18px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px',
        }}>
          <h3 style={{
            fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '13px',
            color: c.textPrimary, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px',
          }}>
            Actividad en Materiales
          </h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1, backgroundColor: '#EFF6FF', borderRadius: '12px', padding: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Eye size={18} color="#3B82F6" strokeWidth={2.5} />
              </div>
              <div>
                <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '22px', color: '#1E40AF', lineHeight: 1 }}>
                  {cargando ? '…' : stats.accesos}
                </div>
                <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '10px', color: '#3B82F6', marginTop: '2px' }}>Accesos</div>
              </div>
            </div>
            <div style={{ flex: 1, backgroundColor: '#F0FDF4', borderRadius: '12px', padding: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Download size={18} color="#10B981" strokeWidth={2.5} />
              </div>
              <div>
                <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '22px', color: '#065F46', lineHeight: 1 }}>
                  {cargando ? '…' : stats.descargas}
                </div>
                <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '10px', color: '#10B981', marginTop: '2px' }}>Descargas</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── TOP FLASHCARDS CON TASA DE ACIERTOS ─────────── */}
        <div style={{
          backgroundColor: cardBg, borderRadius: '16px', padding: '18px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <h3 style={{
            fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '13px',
            color: c.textPrimary, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px',
          }}>
            Flashcards Más Practicadas
          </h3>

          {cargando ? (
            <p style={{ fontFamily: 'Poppins, sans-serif', color: c.textMuted, fontSize: '13px' }}>Cargando…</p>
          ) : stats.topFlashcards.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <span style={{ fontSize: '40px' }}>📚</span>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', color: c.textMuted, marginTop: '8px' }}>
                Aún ningún estudiante ha practicado tus flashcards
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {stats.topFlashcards.map((fc, i) => (
                <div key={i} style={{
                  padding: '14px',
                  backgroundColor: i === 0 ? c.yellowPale : c.bgSurface,
                  borderRadius: '12px',
                  border: i === 0 ? `2px solid ${c.yellowLight}` : `1px solid ${c.border}`,
                }}>
                  {/* Fila superior: posición + integral + veces */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                      background: i === 0 ? 'linear-gradient(135deg, #FFD700, #FFA500)' : c.border,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '12px',
                      color: i === 0 ? '#78350F' : '#6B7280',
                    }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontFamily: 'KaTeX_Main, Georgia, serif', fontWeight: 600, fontSize: '13px',
                          color: c.textPrimary, margin: '0 0 2px 0',
                          overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                        }}
                        dangerouslySetInnerHTML={{ __html: renderLatex(fc.integral) }}
                      />
                      <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '10px', color: c.textMuted, margin: 0 }}>
                        {fc.tema} · {fc.vecesEstudiada} {fc.vecesEstudiada === 1 ? 'vez' : 'veces'}
                      </p>
                    </div>
                  </div>

                  {/* Barra de tasa de aciertos */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '10px', color: c.textMuted }}>
                        Tasa de aciertos
                      </span>
                      <span style={{
                        fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '11px',
                        color: getAciertosColor(fc.tasaAciertos),
                      }}>
                        {fc.tasaAciertos}%
                      </span>
                    </div>
                    <div style={{ height: '6px', backgroundColor: c.border, borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${fc.tasaAciertos}%`,
                        height: '100%',
                        backgroundColor: getAciertosColor(fc.tasaAciertos),
                        borderRadius: '3px',
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
