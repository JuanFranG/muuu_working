import { useState, useEffect } from 'react';
import { ArrowLeft, Flame } from 'lucide-react';
import { meAPI, obtenerEstadisticasEstudianteAPI, type ProgresoTemaAPI } from '../services/api';
import { useThemeColors } from '../contexts/SettingsContext';

interface MiProgresoProps {
  onBack: () => void;
}

export function MiProgreso({ onBack }: MiProgresoProps) {
  const c = useThemeColors('student');
  const [totalPoints,    setTotalPoints]    = useState<number | null>(null);
  const [rachaActual,    setRachaActual]    = useState<number>(0);
  const [posicion,       setPosicion]       = useState<number | null>(null);
  const [flashcardsTotales, setFlashcardsTotales] = useState<number>(0);
  const [porTema,        setPorTema]        = useState<ProgresoTemaAPI[]>([]);
  const [cargando,       setCargando]       = useState(true);

  useEffect(() => {
    Promise.all([meAPI(), obtenerEstadisticasEstudianteAPI()]).then(([me, stats]) => {
      if (me) {
        setTotalPoints(me.totalPuntos ?? 0);
        setRachaActual(me.rachaActual ?? 0);
        setPosicion(me.posicion ?? null);
        setFlashcardsTotales(me.flashcardsEstudiadas ?? 0);
      }
      setPorTema(stats.porTema ?? []);
    }).finally(() => setCargando(false));
  }, []);

  // Contar flashcards con progreso >= 80% ("dominas") y el resto ("conoces")
  const dominas = porTema.filter(t => t.progreso >= 80).length;
  const conoces = porTema.filter(t => t.progreso > 0 && t.progreso < 80).length;

  const getProgressBarColor = (progress: number) => {
    if (progress >= 80) return '#10B981';
    if (progress >= 40) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div
      className="h-full relative overflow-y-auto flex flex-col"
      style={{ background: 'linear-gradient(135deg, #9B7EC7 0%, #7952B3 100%)', maxWidth: '375px', margin: '0 auto' }}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between" style={{ padding: '20px', paddingTop: '24px' }}>
        <button
          onClick={onBack}
          className="flex items-center justify-center rounded-full transition-colors"
          style={{ width: '36px', height: '36px', backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '18px', color: '#FFFFFF' }}>
          Mi Progreso
        </h1>
        <div style={{ width: '36px' }} />
      </div>

      {/* PUNTOS TOTALES - HERO */}
      <div className="flex flex-col items-center justify-center" style={{ padding: '24px 20px', marginTop: '8px' }}>
        {cargando ? (
          <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '32px', color: 'rgba(255,255,255,0.6)' }}>…</div>
        ) : (
          <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: '72px', color: '#FFFFFF', lineHeight: '1', marginBottom: '8px', textShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
            {totalPoints ?? 0}
          </div>
        )}
        <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '14px', color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Puntos Totales
        </div>
      </div>

      {/* CONTENIDO ADAPTADO AL TEMA */}
      <div
        className="flex-1 flex flex-col"
        style={{ backgroundColor: c.bgCard, borderTopLeftRadius: '32px', borderTopRightRadius: '32px', padding: '24px 20px', marginTop: '16px' }}
      >
        {/* MÉTRICAS RÁPIDAS */}
        <div className="grid grid-cols-4 gap-2" style={{ marginBottom: '28px' }}>
          {/* Dominas */}
          <div className="flex flex-col items-center" style={{ padding: '12px 8px', backgroundColor: c.bgSurface, borderRadius: '12px', border: `2px solid ${c.border}` }}>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '20px', color: '#10B981', marginBottom: '4px' }}>
              {cargando ? '…' : dominas}
            </div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '9px', color: '#059669', textAlign: 'center' }}>
              Dominas
            </div>
          </div>

          {/* Conoces */}
          <div className="flex flex-col items-center" style={{ padding: '12px 8px', backgroundColor: c.purpleSoft, borderRadius: '12px', border: `2px solid ${c.purplePale}` }}>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '20px', color: c.purple, marginBottom: '4px' }}>
              {cargando ? '…' : conoces}
            </div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '9px', color: c.purpleDark, textAlign: 'center' }}>
              Conoces
            </div>
          </div>

          {/* Racha */}
          <div className="flex flex-col items-center" style={{ padding: '12px 8px', backgroundColor: c.bgSurface, borderRadius: '12px', border: `2px solid ${c.border}` }}>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '20px', color: '#9B2355', marginBottom: '4px' }}>
              {cargando ? '…' : rachaActual}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flame size={16} color="#9B2355" strokeWidth={2} />
            </div>
          </div>

          {/* Ranking */}
          <div className="flex flex-col items-center" style={{ padding: '12px 8px', backgroundColor: c.bgSurface, borderRadius: '12px', border: `2px solid ${c.border}` }}>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '20px', color: '#F97316', marginBottom: '4px' }}>
              {cargando ? '…' : posicion ? `#${posicion}` : '–'}
            </div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '9px', color: '#EA580C', textAlign: 'center' }}>
              Ranking
            </div>
          </div>
        </div>

        {/* PROGRESO POR TEMA */}
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '13px', color: c.textPrimary, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Progreso por Tema
          </h3>

          {cargando ? (
            <p style={{ fontFamily: 'Poppins, sans-serif', color: c.textMuted, fontSize: '13px' }}>Cargando…</p>
          ) : porTema.length === 0 ? (
            <div style={{ backgroundColor: c.bgSurface, borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', color: c.textMuted }}>
                Aún no has respondido ningún quiz
              </p>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', color: c.purpleLight, marginTop: '4px' }}>
                Completa quizzes para ver tu progreso aquí
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {porTema.map((topic, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '13px', color: c.textPrimary }}>
                      {topic.tema}
                    </span>
                    <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '13px', color: getProgressBarColor(topic.progreso) }}>
                      {topic.progreso}%
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: c.bgSurface, borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      className="h-full transition-all duration-500"
                      style={{ width: `${topic.progreso}%`, backgroundColor: getProgressBarColor(topic.progreso), borderRadius: '4px' }}
                    />
                  </div>
                  <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '10px', color: c.textMuted, marginTop: '4px' }}>
                    {topic.correctas} de {topic.total} correctas
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RESUMEN */}
        <div>
          <h3 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '13px', color: c.textPrimary, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Resumen
          </h3>

          <div className="grid grid-cols-2 gap-3" style={{ marginBottom: '20px' }}>
            <div style={{ padding: '16px', backgroundColor: c.purpleSoft, borderRadius: '12px', border: `2px solid ${c.purplePale}` }}>
              <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '28px', color: c.purpleDark }}>
                {cargando ? '…' : flashcardsTotales}
              </div>
              <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: c.purple, marginTop: '4px' }}>
                Flashcards estudiadas
              </div>
            </div>

            <div style={{ padding: '16px', backgroundColor: c.bgSurface, borderRadius: '12px', border: `2px solid ${c.border}` }}>
              <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '28px', color: '#F97316' }}>
                {cargando ? '…' : (totalPoints ?? 0)}
              </div>
              <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: '#FB923C', marginTop: '4px' }}>
                Puntos ganados
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
