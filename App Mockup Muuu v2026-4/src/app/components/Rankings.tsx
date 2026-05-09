import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Medal, Crown } from 'lucide-react';
import { meAPI, obtenerRankingAPI, type RankingItemAPI } from '../services/api';
import { useThemeColors } from '../contexts/SettingsContext';

interface RankingsProps {
  onBack: () => void;
}

export function Rankings({ onBack }: RankingsProps) {
  const c = useThemeColors('student');
  const [estudiantes, setEstudiantes] = useState<RankingItemAPI[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([obtenerRankingAPI(), meAPI()]).then(([ranking, me]) => {
      setEstudiantes(ranking);
      if (me) setCurrentUserId(me.id_usuario);
    }).finally(() => setCargando(false));
  }, []);

  // Solo mostrar los 5 primeros
  const topEstudiantes = estudiantes.slice(0, 5);

  const currentUserIndex = topEstudiantes.findIndex(e => e.id === currentUserId);
  const currentUser      = currentUserIndex !== -1 ? topEstudiantes[currentUserIndex] : null;
  const thirdPlacePoints = topEstudiantes[2]?.puntos ?? 0;
  const pointsToThird    = currentUser && currentUser.posicion > 3
    ? thirdPlacePoints - currentUser.puntos
    : 0;

  const getMedalIcon = (medalla: string | null, size: number = 24) => {
    if (medalla === 'oro')    return <Crown size={size} color="#FFD700" fill="#FFD700" />;
    if (medalla === 'plata')  return <Medal size={size} color="#C0C0C0" fill="#C0C0C0" />;
    if (medalla === 'bronce') return <Medal size={size} color="#CD7F32" fill="#CD7F32" />;
    return null;
  };

  const getMedalBackground = (medalla: string | null) => {
    if (medalla === 'oro')    return 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)';
    if (medalla === 'plata')  return 'linear-gradient(135deg, #E8E8E8 0%, #C0C0C0 100%)';
    if (medalla === 'bronce') return 'linear-gradient(135deg, #D4A574 0%, #CD7F32 100%)';
    return '#E6D5F0';
  };

  const isCurrent = (est: RankingItemAPI) => est.id === currentUserId;

  return (
    <div
      className="h-full w-full relative overflow-hidden"
      style={{
        background: c.bgGradient,
        maxWidth: '375px',
        maxHeight: '812px',
        margin: '0 auto'
      }}
    >
      {/* Manchas decorativas */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.05 }}>
        <div className="absolute" style={{ backgroundColor: '#F5F5F5', width: '120px', height: '100px', top: '10%', right: '5%', borderRadius: '50% 40% 45% 55%', filter: 'blur(5px)' }} />
        <div className="absolute" style={{ backgroundColor: '#F5F5F5', width: '80px', height: '70px', top: '40%', left: '8%', borderRadius: '45% 55% 50% 40%', filter: 'blur(5px)' }} />
      </div>

      {/* Header */}
      <div
        className="absolute top-0 left-0 right-0 z-20"
        style={{ height: '100px', backgroundColor: c.bgCard, boxShadow: `0 2px 8px ${c.shadow}`, padding: '16px 20px' }}
      >
        <div className="flex items-center justify-between h-full">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 transition-colors" style={{ color: c.purpleDark }}>
            <ArrowLeft size={28} strokeWidth={2.5} />
          </button>
          <div className="flex items-center gap-2">
            <Trophy size={28} color="#FFD700" strokeWidth={2.5} />
            <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '24px', color: c.textPrimary }}>Rankings</h1>
          </div>
          <div style={{ width: '44px' }} />
        </div>
      </div>

      {/* Avatar del usuario actual */}
      {currentUser && (
        <div className="absolute" style={{ top: '120px', left: '50%', transform: 'translateX(-50%)', zIndex: 5 }}>
          <div
            style={{
              width: '80px', height: '80px', borderRadius: '50%',
              backgroundColor: currentUser.fotoPerfil ? 'transparent' : '#9B7EC7',
              border: '4px solid #7952B3',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '32px', color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(155,126,199,0.4)',
              overflow: 'hidden',
            }}
          >
            {currentUser.fotoPerfil
              ? <img src={currentUser.fotoPerfil} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : currentUser.nombre.charAt(0).toUpperCase()
            }
          </div>
        </div>
      )}

      {/* Lista de Rankings */}
      <div
        className="absolute"
        style={{ top: '220px', left: '20px', right: '20px', bottom: pointsToThird > 0 ? '110px' : '20px', overflowY: 'auto' }}
      >
        {cargando ? (
          <div className="flex items-center justify-center h-32">
            <p style={{ fontFamily: 'Poppins, sans-serif', color: '#9B7EC7', fontSize: '14px' }}>Cargando ranking…</p>
          </div>
        ) : topEstudiantes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2">
            <span style={{ fontSize: '48px' }}>🏆</span>
            <p style={{ fontFamily: 'Poppins, sans-serif', color: '#9B7EC7', fontSize: '14px', fontWeight: 600 }}>
              ¡Sé el primero en el ranking!
            </p>
            <p style={{ fontFamily: 'Poppins, sans-serif', color: '#9CA3AF', fontSize: '12px' }}>
              Completa quizzes para ganar puntos
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {topEstudiantes.map((est, index) => {
              const esCurrent = isCurrent(est);
              return (
                <div
                  key={est.id}
                  className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:scale-[1.02]"
                  style={{
                    background: est.medalla
                      ? getMedalBackground(est.medalla)
                      : esCurrent
                        ? 'linear-gradient(135deg, #9B7EC7 0%, #7952B3 100%)'
                        : c.bgCard,
                    border: est.medalla
                      ? 'none'
                      : esCurrent
                        ? '3px solid #7952B3'
                        : `2px solid ${c.purplePale}`,
                    boxShadow: est.medalla
                      ? '0 4px 12px rgba(0,0,0,0.15)'
                      : esCurrent
                        ? '0 6px 20px rgba(155,126,199,0.5)'
                        : '0 2px 8px rgba(0,0,0,0.08)',
                    position: 'relative',
                  }}
                >
                  {/* Badge "Tú" */}
                  {esCurrent && !est.medalla && (
                    <div style={{
                      position: 'absolute', top: '-8px', right: '12px',
                      backgroundColor: '#FFD700', color: '#1A1A1A',
                      padding: '4px 10px', borderRadius: '12px',
                      fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '11px',
                      boxShadow: '0 2px 8px rgba(255,215,0,0.4)',
                    }}>
                      Tú
                    </div>
                  )}

                  {/* Posición */}
                  <div className="flex items-center justify-center" style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    backgroundColor: est.medalla || esCurrent ? 'rgba(255,255,255,0.3)' : c.purplePale,
                    fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '16px',
                    color: est.medalla || esCurrent ? '#FFFFFF' : c.purpleDark,
                  }}>
                    {index + 1}
                  </div>

                  {/* Avatar */}
                  <div className="flex items-center justify-center" style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    border: est.medalla || esCurrent ? '3px solid rgba(255,255,255,0.5)' : '3px solid #9B7EC7',
                    backgroundColor: est.medalla || esCurrent ? 'rgba(255,255,255,0.4)' : '#E6D5F0',
                    overflow: 'hidden', flexShrink: 0,
                    fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '20px',
                    color: est.medalla ? '#1A1A1A' : esCurrent ? '#1A1A1A' : c.purpleDark,
                  }}>
                    {est.fotoPerfil
                      ? <img src={est.fotoPerfil} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : est.nombre.charAt(0).toUpperCase()
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <p style={{
                      fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '16px',
                      color: est.medalla ? (est.medalla === 'oro' ? '#1A1A1A' : c.textPrimary) : esCurrent ? '#FFFFFF' : c.textPrimary,
                      marginBottom: '2px',
                    }}>
                      {est.nombre}
                    </p>
                    <p style={{
                      fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: '14px',
                      color: est.medalla ? (est.medalla === 'oro' ? '#1A1A1A' : '#64748B') : esCurrent ? 'rgba(255,255,255,0.9)' : '#64748B',
                    }}>
                      {est.puntos.toLocaleString()} puntos
                    </p>
                  </div>

                  {/* Medalla */}
                  <div>{getMedalIcon(est.medalla, 32)}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Barra de puntos al podio */}
      {currentUser && pointsToThird > 0 && (
        <div className="absolute" style={{
          bottom: '20px', left: '20px', right: '20px',
          backgroundColor: c.bgCard, border: `2px solid ${c.purplePale}`,
          borderRadius: '16px', padding: '16px',
          boxShadow: `0 4px 12px ${c.shadow}`, zIndex: 10,
        }}>
          <div className="flex items-center justify-between mb-2">
            <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '13px', color: c.purpleDark }}>
              Te faltan {pointsToThird.toLocaleString()} puntos para el podio
            </span>
            <Medal size={20} color="#CD7F32" fill="#CD7F32" />
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: c.purplePale, borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min(100, (currentUser.puntos / thirdPlacePoints) * 100)}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #9B7EC7 0%, #7952B3 100%)',
              borderRadius: '4px', transition: 'width 0.5s ease',
            }} />
          </div>
        </div>
      )}
    </div>
  );
}
