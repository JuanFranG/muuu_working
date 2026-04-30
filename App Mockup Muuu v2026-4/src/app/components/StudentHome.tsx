import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Bell, Lightbulb, Swords, Trophy, BookOpen, BarChart3 } from 'lucide-react';
import muuuLogo from 'figma:asset/15c96d9f13a3f65cf154aaca4e2380bdb312d1a5.png';

interface StudentHomeProps {
  userName?: string;
  onNavigate: (screen: string) => void;
}

export function StudentHome({ userName = 'Martínez', onNavigate }: StudentHomeProps) {
  const [progress] = useState(65); // Progreso del estudiante en %
  const [streak] = useState(5); // Racha actual

  return (
    <div
      className="h-full w-full relative overflow-y-auto"
      style={{
        background: 'linear-gradient(180deg, #F3EBFF 0%, #FFFFFF 100%)',
        maxWidth: '375px',
        maxHeight: '812px',
        margin: '0 auto',
        paddingBottom: '80px'
      }}
    >
      {/* Manchas de vaca decorativas - Muy sutiles */}
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
        <div 
          className="absolute"
          style={{ 
            backgroundColor: '#F5F5F5',
            width: '100px',
            height: '85px',
            bottom: '15%',
            right: '10%',
            borderRadius: '55% 45% 50% 50%',
            filter: 'blur(5px)'
          }}
        ></div>
      </div>

      {/* COMPONENTE 1: HEADER SUPERIOR */}
      <div 
        className="sticky top-0 left-0 right-0 z-20"
        style={{ 
          height: '80px',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          padding: '16px 20px'
        }}
      >
        <div className="flex items-center justify-between h-full">
          {/* Avatar + Información del Usuario */}
          <div className="flex items-center gap-3">
            {/* A. Avatar Usuario - Ahora clickeable */}
            <button
              onClick={() => onNavigate('perfilMenu')}
              className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
              style={{ 
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: '3px solid #9B7EC7',
                backgroundColor: '#E6D5F0',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: '20px',
                color: '#7952B3'
              }}
            >
              {userName.charAt(0).toUpperCase()}
            </button>
            
            {/* B. Información Usuario */}
            <div>
              {/* Línea 1: Hola, [Nombre] */}
              <p 
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: '15px',
                  color: '#1E293B',
                  marginBottom: '2px'
                }}
              >
                Hola, {userName}
              </p>
            </div>
          </div>

          {/* Racha + Notificaciones */}
          <div className="flex items-center gap-3">
            {/* Racha */}
            <div className="flex items-center gap-1">
              <span style={{ fontSize: '20px' }}>🔥</span>
              <span
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  fontSize: '16px',
                  color: '#F59E0B'
                }}
              >
                {streak}
              </span>
            </div>

            {/* C. Icono Notificaciones */}
            <button 
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => console.log('Notificaciones')}
              style={{ width: '40px', height: '40px' }}
            >
              <Bell size={24} style={{ color: '#9B7EC7' }} strokeWidth={2} />
              {/* Badge rojo opcional */}
              <div 
                className="absolute"
                style={{ 
                  top: '6px',
                  right: '6px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#EF4444'
                }}
              ></div>
            </button>
          </div>
        </div>
      </div>

      {/* LOGO ADA CENTRAL */}
      <div 
        className="flex justify-center items-center"
        style={{
          marginTop: '16px',
          marginBottom: '12px',
          paddingLeft: '20px',
          paddingRight: '20px'
        }}
      >
        <ImageWithFallback 
          src={muuuLogo} 
          alt="Ada la Vaca" 
          style={{ 
            width: '140px',
            height: '140px',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* Pregunta motivacional */}
      <p 
        style={{ 
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 600,
          fontSize: '16px',
          color: '#7952B3',
          textAlign: 'center',
          marginBottom: '4px'
        }}
      >
        ¿Qué quieres hacer hoy?
      </p>

      {/* GRID 2x2 DE BOTONES PRINCIPALES */}
      <div 
        className="grid grid-cols-2 gap-3"
        style={{
          marginTop: '16px',
          paddingLeft: '20px',
          paddingRight: '20px'
        }}
      >
        {/* BOTÓN 1: "APRENDE UN POCO" con badge NUEVO */}
        <button
          onClick={() => onNavigate('aprendeUnPoco')}
          className="relative flex flex-col items-center justify-center transition-all cursor-pointer"
          style={{
            height: '140px',
            background: 'linear-gradient(135deg, #9B7EC7 0%, #7952B3 100%)',
            border: 'none',
            borderRadius: '16px',
            boxShadow: '0 4px 16px rgba(155, 126, 199, 0.4)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(155, 126, 199, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(155, 126, 199, 0.4)';
          }}
        >
          {/* Badge NUEVO */}
          
          <BookOpen size={48} color="#FFFFFF" strokeWidth={2.5} style={{ marginBottom: '8px' }} />
          <span 
            className="text-center"
            style={{ 
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: '14px',
              color: '#FFFFFF',
              lineHeight: '1.2'
            }}
          >
            Aprende
          </span>
          <span 
            style={{ 
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400,
              fontSize: '13px',
              color: '#FFFFFF'
            }}
          >
            un Poco
          </span>
        </button>

        {/* BOTÓN 2: "PONTE A PRUEBA" */}
        <button
          onClick={() => onNavigate('ponteAPrueba')}
          className="flex flex-col items-center justify-center transition-all cursor-pointer"
          style={{
            height: '140px',
            background: 'linear-gradient(135deg, #9B7EC7 0%, #7952B3 100%)',
            border: 'none',
            borderRadius: '16px',
            boxShadow: '0 4px 16px rgba(155, 126, 199, 0.4)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(155, 126, 199, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(155, 126, 199, 0.4)';
          }}
        >
          <Lightbulb size={48} color="#FFFFFF" strokeWidth={2.5} style={{ marginBottom: '8px' }} />
          <span 
            className="text-center"
            style={{ 
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: '14px',
              color: '#FFFFFF',
              lineHeight: '1.2'
            }}
          >
            Ponte a
          </span>
          <span 
            style={{ 
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400,
              fontSize: '13px',
              color: '#FFFFFF'
            }}
          >
            Prueba
          </span>
        </button>

        {/* BOTÓN 3: "DESAFÍA A ALGUIEN" */}
        <button
          onClick={() => onNavigate('desafiaAlguien')}
          className="flex flex-col items-center justify-center transition-all cursor-pointer"
          style={{
            height: '140px',
            background: 'linear-gradient(135deg, #8A2BE2 0%, #9B7EC7 100%)',
            border: 'none',
            borderRadius: '16px',
            boxShadow: '0 4px 16px rgba(138, 43, 226, 0.4)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(138, 43, 226, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(138, 43, 226, 0.4)';
          }}
        >
          <Swords size={48} color="#FFFFFF" strokeWidth={2.5} style={{ marginBottom: '8px' }} />
          <span 
            className="text-center"
            style={{ 
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: '14px',
              color: '#FFFFFF',
              lineHeight: '1.2'
            }}
          >
            Desafía a
          </span>
          <span 
            style={{ 
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400,
              fontSize: '13px',
              color: '#FFFFFF'
            }}
          >
            Alguien
          </span>
        </button>

        {/* BOTÓN 4: "MI PROGRESO" */}
        <button
          onClick={() => onNavigate('miProgreso')}
          className="flex flex-col items-center justify-center transition-all cursor-pointer"
          style={{
            height: '140px',
            background: 'linear-gradient(135deg, #7952B3 0%, #9B7EC7 100%)',
            border: 'none',
            borderRadius: '16px',
            boxShadow: '0 4px 16px rgba(121, 82, 179, 0.4)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(121, 82, 179, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(121, 82, 179, 0.4)';
          }}
        >
          <BarChart3 size={48} color="#FFFFFF" strokeWidth={2.5} style={{ marginBottom: '8px' }} />
          <span 
            className="text-center"
            style={{ 
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: '14px',
              color: '#FFFFFF',
              lineHeight: '1.2'
            }}
          >
            Mi
          </span>
          <span 
            style={{ 
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400,
              fontSize: '13px',
              color: '#FFFFFF'
            }}
          >
            Progreso
          </span>
        </button>
      </div>

      {/* BOTÓN RANKINGS - Centro Inferior (Circular amarillo) */}
      <div className="flex justify-center" style={{ marginTop: '24px', marginBottom: '100px' }}>
        <button
          onClick={() => onNavigate('rankings')}
          className="flex items-center justify-center rounded-full transition-all cursor-pointer"
          style={{
            width: '120px',
            height: '120px',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            border: 'none',
            boxShadow: '0 6px 20px rgba(255, 215, 0, 0.5)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 215, 0, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.5)';
          }}
        >
          <div className="flex items-center gap-1">
            <Trophy size={32} color="#1A1A1A" strokeWidth={2.5} />
          </div>
        </button>
      </div>

      {/* PROGRESO POR TEMAS */}

      {/* Barra de Navegación Inferior */}
      

      {/* CSS para las transiciones suaves */}
      <style>{`
        button {
          transition: all 0.2s ease;
        }
      `}</style>
    </div>
  );
}