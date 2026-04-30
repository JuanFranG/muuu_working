import { ArrowLeft, Trophy, Medal, Crown } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import muuuLogo from 'figma:asset/15c96d9f13a3f65cf154aaca4e2380bdb312d1a5.png';

interface RankingsProps {
  onBack: () => void;
  userName?: string;
}

const mockStudents = [
  { id: 1, name: 'Ana García', points: 2450, avatar: 'A', medal: 'gold' },
  { id: 2, name: 'Carlos López', points: 2280, avatar: 'C', medal: 'silver' },
  { id: 3, name: 'María Rodríguez', points: 2150, avatar: 'M', medal: 'bronze' },
  { id: 4, name: 'Juan Martínez', points: 1980, avatar: 'J', medal: null },
  { id: 5, name: 'Laura Pérez', points: 1850, avatar: 'L', medal: null },
  { id: 6, name: 'Pedro Gómez', points: 1720, avatar: 'P', medal: null },
  { id: 7, name: 'Sofia Torres', points: 1650, avatar: 'S', medal: null },
  { id: 8, name: 'Diego Ramírez', points: 1580, avatar: 'D', medal: null }
];

export function Rankings({ onBack, userName = 'Juan' }: RankingsProps) {
  // Mostrar solo los 5 primeros
  const topStudents = mockStudents.slice(0, 5);
  
  // Encontrar al usuario actual en la lista
  const currentUserIndex = topStudents.findIndex(student => 
    student.name.toLowerCase().includes(userName.toLowerCase())
  );
  const currentUserPosition = currentUserIndex !== -1 ? currentUserIndex + 1 : null;
  
  // Calcular puntos que faltan para el podio (tercer puesto)
  const thirdPlacePoints = topStudents[2].points;
  const currentUser = topStudents[currentUserIndex];
  const pointsToThird = currentUser ? thirdPlacePoints - currentUser.points : 0;

  const getMedalIcon = (medal: string | null, size: number = 24) => {
    if (medal === 'gold') return <Crown size={size} color="#FFD700" fill="#FFD700" />;
    if (medal === 'silver') return <Medal size={size} color="#C0C0C0" fill="#C0C0C0" />;
    if (medal === 'bronze') return <Medal size={size} color="#CD7F32" fill="#CD7F32" />;
    return null;
  };

  const getMedalBackground = (medal: string | null) => {
    if (medal === 'gold') return 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)';
    if (medal === 'silver') return 'linear-gradient(135deg, #E8E8E8 0%, #C0C0C0 100%)';
    if (medal === 'bronze') return 'linear-gradient(135deg, #D4A574 0%, #CD7F32 100%)';
    return '#E6D5F0';
  };

  const isCurrentUser = (student: typeof mockStudents[0]) => {
    return student.name.toLowerCase().includes(userName.toLowerCase());
  };

  return (
    <div 
      className="h-full w-full relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(180deg, #F3EBFF 0%, #FFFFFF 100%)',
        maxWidth: '375px',
        maxHeight: '812px',
        margin: '0 auto'
      }}
    >
      {/* Manchas de vaca decorativas */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.05 }}>
        <div 
          className="absolute"
          style={{ 
            backgroundColor: '#F5F5F5',
            width: '120px',
            height: '100px',
            top: '10%',
            right: '5%',
            borderRadius: '50% 40% 45% 55%',
            filter: 'blur(5px)'
          }}
        ></div>
        <div 
          className="absolute"
          style={{ 
            backgroundColor: '#F5F5F5',
            width: '80px',
            height: '70px',
            top: '40%',
            left: '8%',
            borderRadius: '45% 55% 50% 40%',
            filter: 'blur(5px)'
          }}
        ></div>
      </div>

      {/* Header */}
      <div 
        className="absolute top-0 left-0 right-0 z-20"
        style={{ 
          height: '100px',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          padding: '16px 20px'
        }}
      >
        <div className="flex items-center justify-between h-full">
          {/* Botón volver */}
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            style={{ color: '#7952B3' }}
          >
            <ArrowLeft size={28} strokeWidth={2.5} />
          </button>

          {/* Título */}
          <div className="flex items-center gap-2">
            <Trophy size={28} color="#FFD700" strokeWidth={2.5} />
            <h1 
              style={{ 
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: '24px',
                color: '#1E293B'
              }}
            >
              Rankings
            </h1>
          </div>

          {/* Espacio para simetría */}
          <div style={{ width: '44px' }}></div>
        </div>
      </div>

      {/* Foto de perfil del usuario logueado */}
      <div 
        className="absolute"
        style={{
          top: '120px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 5
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#9B7EC7',
            border: '4px solid #7952B3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 700,
            fontSize: '32px',
            color: '#FFFFFF',
            boxShadow: '0 4px 12px rgba(155, 126, 199, 0.4)'
          }}
        >
          {userName.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Lista de Rankings */}
      <div
        className="absolute"
        style={{
          top: '220px',
          left: '20px',
          right: '20px',
          bottom: '20px',
          overflowY: 'auto'
        }}
      >
        <div className="space-y-3">
          {topStudents.map((student, index) => {
            const isCurrent = isCurrentUser(student);
            return (
              <div
                key={student.id}
                className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:scale-[1.02]"
                style={{
                  background: student.medal 
                    ? getMedalBackground(student.medal) 
                    : isCurrent 
                      ? 'linear-gradient(135deg, #9B7EC7 0%, #7952B3 100%)'
                      : '#FFFFFF',
                  border: student.medal 
                    ? 'none' 
                    : isCurrent 
                      ? '3px solid #7952B3'
                      : '2px solid #E6D5F0',
                  boxShadow: student.medal 
                    ? '0 4px 12px rgba(0, 0, 0, 0.15)' 
                    : isCurrent
                      ? '0 6px 20px rgba(155, 126, 199, 0.5)'
                      : '0 2px 8px rgba(0, 0, 0, 0.08)',
                  position: 'relative'
                }}
              >
                {/* Indicador de "Tú" para el usuario actual */}
                {isCurrent && !student.medal && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '12px',
                      backgroundColor: '#FFD700',
                      color: '#1A1A1A',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 700,
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      boxShadow: '0 2px 8px rgba(255, 215, 0, 0.4)'
                    }}
                  >
                    Tú
                  </div>
                )}

                {/* Posición */}
                <div 
                  className="flex items-center justify-center"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: student.medal 
                      ? 'rgba(255, 255, 255, 0.3)' 
                      : isCurrent 
                        ? 'rgba(255, 255, 255, 0.3)'
                        : '#E6D5F0',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 800,
                    fontSize: '16px',
                    color: student.medal || isCurrent ? '#FFFFFF' : '#7952B3'
                  }}
                >
                  {index + 1}
                </div>

                {/* Avatar */}
                <div 
                  className="flex items-center justify-center"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: student.medal || isCurrent 
                      ? '3px solid rgba(255, 255, 255, 0.5)' 
                      : '3px solid #9B7EC7',
                    backgroundColor: student.medal || isCurrent 
                      ? 'rgba(255, 255, 255, 0.4)' 
                      : '#E6D5F0',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 700,
                    fontSize: '20px',
                    color: student.medal ? '#1A1A1A' : isCurrent ? '#1A1A1A' : '#7952B3'
                  }}
                >
                  {student.avatar}
                </div>

                {/* Información del estudiante */}
                <div className="flex-1">
                  <p 
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 700,
                      fontSize: '16px',
                      color: student.medal 
                        ? (student.medal === 'gold' ? '#1A1A1A' : '#1E293B') 
                        : isCurrent 
                          ? '#FFFFFF' 
                          : '#1E293B',
                      marginBottom: '2px'
                    }}
                  >
                    {student.name}
                  </p>
                  <p 
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 500,
                      fontSize: '14px',
                      color: student.medal 
                        ? (student.medal === 'gold' ? '#1A1A1A' : '#64748B') 
                        : isCurrent 
                          ? 'rgba(255, 255, 255, 0.9)' 
                          : '#64748B'
                    }}
                  >
                    {student.points.toLocaleString()} puntos
                  </p>
                </div>

                {/* Medalla/Trofeo */}
                <div>
                  {getMedalIcon(student.medal, 32)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Barra de puntos al podio */}
      {currentUser && pointsToThird > 0 && (
        <div 
          className="absolute"
          style={{
            bottom: '20px',
            left: '20px',
            right: '20px',
            backgroundColor: '#FFFFFF',
            border: '2px solid #E6D5F0',
            borderRadius: '16px',
            padding: '16px',
            boxShadow: '0 4px 12px rgba(155, 126, 199, 0.15)',
            zIndex: 10
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span 
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                color: '#7952B3'
              }}
            >
              Te faltan {pointsToThird.toLocaleString()} puntos para el podio
            </span>
            <Medal size={20} color="#CD7F32" fill="#CD7F32" />
          </div>
          
          {/* Barra de progreso */}
          <div 
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#E6D5F0',
              borderRadius: '4px',
              overflow: 'hidden'
            }}
          >
            <div 
              style={{
                width: `${(currentUser.points / thirdPlacePoints) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #9B7EC7 0%, #7952B3 100%)',
                borderRadius: '4px',
                transition: 'width 0.5s ease'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}