import { useState, useEffect } from 'react';
import { ArrowLeft, Eye, Download, Users, BookOpen, FileText, BarChart3 } from 'lucide-react';
import { obtenerEstadisticasDocenteAPI, type EstadisticasDocenteAPI } from '../services/api';

interface EstadisticasDocenteProps {
  onBack: () => void;
}

const INICIAL: EstadisticasDocenteAPI = {
  flashcardsPublicadas: 0,
  suscriptores: 0,
  materiales: 0,
  accesos: 0,
  descargas: 0,
  topFlashcards: [],
};

export function EstadisticasDocente({ onBack }: EstadisticasDocenteProps) {
  const [stats,    setStats]    = useState<EstadisticasDocenteAPI>(INICIAL);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerEstadisticasDocenteAPI()
      .then(setStats)
      .finally(() => setCargando(false));
  }, []);

  const primary  = '#F59E0B';
  const dark     = '#78350F';
  const bg       = '#F8F4EC';
  const cardBg   = '#FFFFFF';

  return (
    <div
      className="h-full w-full relative overflow-y-auto"
      style={{ background: bg, maxWidth: '375px', margin: '0 auto', paddingBottom: '40px' }}
    >
      {/* HEADER */}
      <div style={{
        background: `linear-gradient(135deg, ${primary} 0%, #FBBF24 100%)`,
        padding: '24px 20px 20px 20px',
        borderRadius: '0 0 24px 24px',
        boxShadow: `0 4px 12px rgba(245,158,11,0.25)`,
      }}>
        <div className="flex items-center gap-3">
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
          <div>
            <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '18px', color: dark, margin: 0 }}>
              Mis Estadísticas
            </h1>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', color: dark, opacity: 0.7, margin: 0 }}>
              Resumen de tu actividad
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px' }}>

        {/* GRID DE MÉTRICAS PRINCIPALES */}
        <div className="grid grid-cols-2 gap-3" style={{ marginBottom: '20px' }}>

          {/* Flashcards Publicadas */}
          <div style={{
            backgroundColor: cardBg, borderRadius: '16px', padding: '18px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '8px',
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              backgroundColor: '#FEF9C3', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <BookOpen size={20} color="#D97706" strokeWidth={2.5} />
            </div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '28px', color: dark, lineHeight: 1 }}>
              {cargando ? '…' : stats.flashcardsPublicadas}
            </div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: '#6B7280' }}>
              Flashcards publicadas
            </div>
          </div>

          {/* Suscriptores */}
          <div style={{
            background: `linear-gradient(135deg, ${primary} 0%, #FBBF24 100%)`,
            borderRadius: '16px', padding: '18px',
            boxShadow: `0 4px 12px rgba(245,158,11,0.25)`, display: 'flex', flexDirection: 'column', gap: '8px',
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              backgroundColor: 'rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
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
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FileText size={20} color="#3B82F6" strokeWidth={2.5} />
            </div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '28px', color: dark, lineHeight: 1 }}>
              {cargando ? '…' : stats.materiales}
            </div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: '#6B7280' }}>
              Materiales subidos
            </div>
          </div>

          {/* Interacciones */}
          <div style={{
            backgroundColor: cardBg, borderRadius: '16px', padding: '18px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '8px',
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              backgroundColor: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <BarChart3 size={20} color="#10B981" strokeWidth={2.5} />
            </div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '28px', color: dark, lineHeight: 1 }}>
              {cargando ? '…' : stats.accesos + stats.descargas}
            </div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: '#6B7280' }}>
              Interacciones totales
            </div>
          </div>
        </div>

        {/* ACCESOS Y DESCARGAS */}
        <div style={{
          backgroundColor: cardBg, borderRadius: '16px', padding: '18px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px',
        }}>
          <h3 style={{
            fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '13px',
            color: '#1E293B', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px',
          }}>
            Actividad en Materiales
          </h3>

          <div style={{ display: 'flex', gap: '12px' }}>
            {/* Accesos */}
            <div style={{
              flex: 1, backgroundColor: '#EFF6FF', borderRadius: '12px', padding: '14px',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                backgroundColor: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Eye size={18} color="#3B82F6" strokeWidth={2.5} />
              </div>
              <div>
                <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '22px', color: '#1E40AF', lineHeight: 1 }}>
                  {cargando ? '…' : stats.accesos}
                </div>
                <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '10px', color: '#3B82F6', marginTop: '2px' }}>
                  Accesos
                </div>
              </div>
            </div>

            {/* Descargas */}
            <div style={{
              flex: 1, backgroundColor: '#F0FDF4', borderRadius: '12px', padding: '14px',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                backgroundColor: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Download size={18} color="#10B981" strokeWidth={2.5} />
              </div>
              <div>
                <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '22px', color: '#065F46', lineHeight: 1 }}>
                  {cargando ? '…' : stats.descargas}
                </div>
                <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '10px', color: '#10B981', marginTop: '2px' }}>
                  Descargas
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TOP FLASHCARDS MÁS ESTUDIADAS */}
        <div style={{
          backgroundColor: cardBg, borderRadius: '16px', padding: '18px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <h3 style={{
            fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '13px',
            color: '#1E293B', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px',
          }}>
            Flashcards Más Estudiadas
          </h3>

          {cargando ? (
            <p style={{ fontFamily: 'Poppins, sans-serif', color: '#9CA3AF', fontSize: '13px' }}>Cargando…</p>
          ) : stats.topFlashcards.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <span style={{ fontSize: '40px' }}>📚</span>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', color: '#9CA3AF', marginTop: '8px' }}>
                Aún ningún estudiante ha practicado tus flashcards
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {stats.topFlashcards.map((fc, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px', backgroundColor: i === 0 ? '#FFFBEB' : '#F9FAFB',
                  borderRadius: '12px',
                  border: i === 0 ? '2px solid #FDE68A' : '1px solid #F3F4F6',
                }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                    background: i === 0 ? 'linear-gradient(135deg, #FFD700, #FFA500)' : '#E5E7EB',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '14px',
                    color: i === 0 ? '#78350F' : '#6B7280',
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '12px',
                      color: '#1E293B', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                      margin: 0,
                    }}
                      dangerouslySetInnerHTML={{ __html: fc.integral }}
                    />
                    <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '10px', color: '#9CA3AF', margin: '2px 0 0 0' }}>
                      {fc.tema}
                    </p>
                  </div>
                  <div style={{
                    backgroundColor: primary + '22',
                    borderRadius: '8px', padding: '4px 8px', flexShrink: 0,
                  }}>
                    <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '12px', color: dark }}>
                      {fc.vecesEstudiada}×
                    </span>
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
