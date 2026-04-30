import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface MiProgresoProps {
  onBack: () => void;
}

interface TopicProgress {
  name: string;
  progress: number;
  color: string;
}

interface Achievement {
  id: number;
  icon: string;
  label: string;
  count: number;
  color: string;
}

export function MiProgreso({ onBack }: MiProgresoProps) {
  const [totalPoints] = useState(1980);
  const [pointsByCategory] = useState({
    dominas: 47,
    conoces: 312,
    streak: 5,
    ranking: 4
  });

  const topicsProgress: TopicProgress[] = [
    { name: 'Integrales Inmediatas', progress: 90, color: '#10B981' },
    { name: 'Integración por Partes', progress: 65, color: '#F59E0B' },
    { name: 'Fracciones Parciales', progress: 40, color: '#EF4444' },
    { name: 'Sust. Trigonométrica', progress: 20, color: '#EF4444' }
  ];

  const achievements: Achievement[] = [
    { id: 1, icon: '🔥', label: '5 días', count: 5, color: '#F59E0B' },
    { id: 2, icon: '⚡', label: '10 racha', count: 10, color: '#FFD700' },
    { id: 3, icon: '🏆', label: 'Top 3', count: 3, color: '#9B7EC7' },
    { id: 4, icon: '💯', label: '100', count: 100, color: '#10B981' }
  ];

  const getProgressBarColor = (progress: number) => {
    if (progress >= 80) return '#10B981';
    if (progress >= 40) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div
      className="h-full relative overflow-y-auto flex flex-col"
      style={{
        background: 'linear-gradient(135deg, #9B7EC7 0%, #7952B3 100%)',
        maxWidth: '375px',
        margin: '0 auto'
      }}
    >
      {/* HEADER */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: '20px',
          paddingTop: '24px'
        }}
      >
        <button
          onClick={onBack}
          className="flex items-center justify-center rounded-full transition-colors"
          style={{
            width: '36px',
            height: '36px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: '#FFFFFF'
          }}
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>

        <h1
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 700,
            fontSize: '18px',
            color: '#FFFFFF'
          }}
        >
          Mi Progreso 📊
        </h1>

        <div style={{ width: '36px' }}></div>
      </div>

      {/* PUNTOS TOTALES - HERO */}
      <div
        className="flex flex-col items-center justify-center"
        style={{
          padding: '24px 20px',
          marginTop: '8px'
        }}
      >
        <div
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 900,
            fontSize: '72px',
            color: '#FFFFFF',
            lineHeight: '1',
            marginBottom: '8px',
            textShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
          }}
        >
          {totalPoints}
        </div>
        <div
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.9)',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
        >
          Puntos Totales
        </div>
      </div>

      {/* CONTENIDO BLANCO */}
      <div
        className="flex-1 flex flex-col"
        style={{
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: '32px',
          borderTopRightRadius: '32px',
          padding: '24px 20px',
          marginTop: '16px'
        }}
      >
        {/* MÉTRICAS RÁPIDAS */}
        <div
          className="grid grid-cols-4 gap-2"
          style={{
            marginBottom: '28px'
          }}
        >
          {/* Dominas */}
          <div
            className="flex flex-col items-center"
            style={{
              padding: '12px 8px',
              backgroundColor: '#F0FDF4',
              borderRadius: '12px',
              border: '2px solid #D1FAE5'
            }}
          >
            <div
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 800,
                fontSize: '20px',
                color: '#10B981',
                marginBottom: '4px'
              }}
            >
              {pointsByCategory.dominas}
            </div>
            <div
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '9px',
                color: '#059669',
                textAlign: 'center'
              }}
            >
              Dominas
            </div>
          </div>

          {/* Conoces */}
          <div
            className="flex flex-col items-center"
            style={{
              padding: '12px 8px',
              backgroundColor: '#F3EBFF',
              borderRadius: '12px',
              border: '2px solid #E6D5F0'
            }}
          >
            <div
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 800,
                fontSize: '20px',
                color: '#9B7EC7',
                marginBottom: '4px'
              }}
            >
              {pointsByCategory.conoces}
            </div>
            <div
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '9px',
                color: '#7952B3',
                textAlign: 'center'
              }}
            >
              Conoces
            </div>
          </div>

          {/* Racha */}
          <div
            className="flex flex-col items-center"
            style={{
              padding: '12px 8px',
              backgroundColor: '#FFFBF0',
              borderRadius: '12px',
              border: '2px solid #FEF3C7'
            }}
          >
            <div
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 800,
                fontSize: '20px',
                color: '#F59E0B',
                marginBottom: '4px'
              }}
            >
              {pointsByCategory.streak}
            </div>
            <div
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '9px',
                color: '#D97706',
                textAlign: 'center'
              }}
            >
              🔥
            </div>
          </div>

          {/* Ranking */}
          <div
            className="flex flex-col items-center"
            style={{
              padding: '12px 8px',
              backgroundColor: '#FFF7ED',
              borderRadius: '12px',
              border: '2px solid #FFEDD5'
            }}
          >
            <div
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 800,
                fontSize: '20px',
                color: '#F97316',
                marginBottom: '4px'
              }}
            >
              #{pointsByCategory.ranking}
            </div>
            <div
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '9px',
                color: '#EA580C',
                textAlign: 'center'
              }}
            >
              Ranking
            </div>
          </div>
        </div>

        {/* PROGRESO POR TEMA */}
        <div style={{ marginBottom: '28px' }}>
          <h3
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: '13px',
              color: '#1E293B',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            Progreso por Tema
          </h3>

          <div className="space-y-4">
            {topicsProgress.map((topic, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 600,
                      fontSize: '13px',
                      color: '#1E293B'
                    }}
                  >
                    {topic.name}
                  </span>
                  <span
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 700,
                      fontSize: '13px',
                      color: getProgressBarColor(topic.progress)
                    }}
                  >
                    {topic.progress}%
                  </span>
                </div>
                <div
                  className="overflow-hidden"
                  style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#F3F4F6',
                    borderRadius: '4px'
                  }}
                >
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${topic.progress}%`,
                      backgroundColor: getProgressBarColor(topic.progress),
                      borderRadius: '4px'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LOGROS */}
        <div>
          <h3
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: '13px',
              color: '#1E293B',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            Logros
          </h3>

          <div
            className="grid grid-cols-4 gap-3"
            style={{
              marginBottom: '20px'
            }}
          >
            {achievements.map((achievement) => {
              // Los logros 3 (Top 3) y 4 (100) no están desbloqueados
              const isLocked = achievement.id === 3 || achievement.id === 4;
              
              return (
                <div
                  key={achievement.id}
                  className="flex flex-col items-center"
                  style={{
                    padding: '16px 8px',
                    backgroundColor: isLocked ? '#F3F4F6' : '#F9FAFB',
                    borderRadius: '12px',
                    border: `2px solid ${isLocked ? '#D1D5DB' : '#E5E7EB'}`,
                    opacity: isLocked ? 0.4 : 1,
                    filter: isLocked ? 'grayscale(100%)' : 'none'
                  }}
                >
                  <div
                    style={{
                      fontSize: '32px',
                      marginBottom: '8px'
                    }}
                  >
                    {achievement.icon}
                  </div>
                  <div
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 700,
                      fontSize: '10px',
                      color: isLocked ? '#6B7280' : achievement.color,
                      textAlign: 'center'
                    }}
                  >
                    {achievement.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}