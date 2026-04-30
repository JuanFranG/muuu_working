import { ArrowLeft, GraduationCap, Mail, Calendar, BookOpen, Trophy, Target, Edit } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import muuuLogo from 'figma:asset/4de3de61f8e4df99b460b6420b603ae06ba0b967.png';

interface PerfilEstudianteProps {
  onBack: () => void;
  userName?: string;
}

export function PerfilEstudiante({ onBack, userName = 'Juan Pérez' }: PerfilEstudianteProps) {
  const studentData = {
    firstName: 'Juan',
    lastName: 'Pérez',
    code: '2019215047',
    email: 'juan.perez@unimagdalena.edu.co',
    registrationDate: '15 Enero 2025',
    totalPoints: 1850,
    completedFlashcards: 42,
    studyStreak: 7,
    level: 5
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
      </div>

      {/* Header */}
      <div 
        className="absolute top-0 left-0 right-0 z-20"
        style={{ 
          height: '80px',
          backgroundColor: '#9B7EC7',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          padding: '16px 20px'
        }}
      >
        <div className="flex items-center justify-between h-full">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
            style={{ color: '#FFFFFF' }}
          >
            <ArrowLeft size={28} strokeWidth={2.5} />
          </button>

          <h1 
            style={{ 
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: '24px',
              color: '#FFFFFF'
            }}
          >
            Mi Perfil
          </h1>

          <div style={{ width: '44px' }}></div>
        </div>
      </div>

      {/* Contenido scrolleable */}
      <div 
        className="absolute"
        style={{
          top: '80px',
          left: '0',
          right: '0',
          bottom: '0',
          overflowY: 'auto',
          padding: '20px'
        }}
      >
        {/* Avatar y nombre */}
        <div className="flex flex-col items-center mb-6">
          <div 
            className="flex items-center justify-center mb-4"
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: '6px solid #9B7EC7',
              backgroundColor: '#E6D5F0',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: '48px',
              color: '#7952B3',
              position: 'relative'
            }}
          >
            {studentData.firstName.charAt(0)}
            <button
              className="absolute"
              style={{
                bottom: '0',
                right: '0',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#FFD700',
                border: '3px solid #FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Edit size={18} color="#1A1A1A" strokeWidth={2.5} />
            </button>
          </div>

          <h2 
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: '24px',
              color: '#1E293B',
              marginBottom: '4px'
            }}
          >
            {studentData.firstName} {studentData.lastName}
          </h2>

          <div
            style={{
              backgroundColor: '#9B7EC7',
              color: '#FFFFFF',
              padding: '6px 16px',
              borderRadius: '20px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              fontSize: '14px'
            }}
          >
            Nivel {studentData.level}
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div
            className="flex flex-col items-center p-4 rounded-2xl"
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #E6D5F0',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
            }}
          >
            <Trophy size={28} color="#FFD700" strokeWidth={2.5} />
            <p 
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 800,
                fontSize: '20px',
                color: '#1E293B',
                marginTop: '8px'
              }}
            >
              {studentData.totalPoints}
            </p>
            <p 
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 500,
                fontSize: '11px',
                color: '#64748B'
              }}
            >
              Puntos
            </p>
          </div>

          <div
            className="flex flex-col items-center p-4 rounded-2xl"
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #E6D5F0',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
            }}
          >
            <BookOpen size={28} color="#9B7EC7" strokeWidth={2.5} />
            <p 
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 800,
                fontSize: '20px',
                color: '#1E293B',
                marginTop: '8px'
              }}
            >
              {studentData.completedFlashcards}
            </p>
            <p 
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 500,
                fontSize: '11px',
                color: '#64748B'
              }}
            >
              Cards
            </p>
          </div>

          <div
            className="flex flex-col items-center p-4 rounded-2xl"
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #E6D5F0',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
            }}
          >
            <Target size={28} color="#10B981" strokeWidth={2.5} />
            <p 
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 800,
                fontSize: '20px',
                color: '#1E293B',
                marginTop: '8px'
              }}
            >
              {studentData.studyStreak}
            </p>
            <p 
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 500,
                fontSize: '11px',
                color: '#64748B'
              }}
            >
              Días
            </p>
          </div>
        </div>

        {/* Información personal */}
        <div
          className="p-5 rounded-2xl mb-4"
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #E6D5F0',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
          }}
        >
          <h3 
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: '16px',
              color: '#1E293B',
              marginBottom: '16px'
            }}
          >
            Información Personal
          </h3>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: '#F3EBFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <GraduationCap size={20} color="#9B7EC7" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <p 
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 500,
                    fontSize: '12px',
                    color: '#64748B'
                  }}
                >
                  Código Estudiantil
                </p>
                <p 
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 600,
                    fontSize: '14px',
                    color: '#1E293B'
                  }}
                >
                  {studentData.code}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: '#F3EBFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Mail size={20} color="#9B7EC7" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <p 
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 500,
                    fontSize: '12px',
                    color: '#64748B'
                  }}
                >
                  Correo Electrónico
                </p>
                <p 
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 600,
                    fontSize: '14px',
                    color: '#1E293B'
                  }}
                >
                  {studentData.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: '#F3EBFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Calendar size={20} color="#9B7EC7" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <p 
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 500,
                    fontSize: '12px',
                    color: '#64748B'
                  }}
                >
                  Fecha de Registro
                </p>
                <p 
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 600,
                    fontSize: '14px',
                    color: '#1E293B'
                  }}
                >
                  {studentData.registrationDate}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Botón Editar Perfil */}
        <button
          className="w-full p-4 rounded-xl transition-all hover:scale-[1.02] mb-6"
          style={{
            backgroundColor: '#9B7EC7',
            color: '#FFFFFF',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            fontSize: '16px',
            border: 'none',
            boxShadow: '0 4px 12px rgba(155, 126, 199, 0.4)',
            cursor: 'pointer'
          }}
        >
          Editar Perfil
        </button>

        {/* Logo Ada pequeño */}
        <div className="flex justify-center mb-4">
          <ImageWithFallback 
            src={muuuLogo} 
            alt="Ada la Vaca" 
            style={{ 
              width: '80px', 
              height: '80px',
              objectFit: 'contain',
              opacity: 0.3
            }}
          />
        </div>
      </div>
    </div>
  );
}
