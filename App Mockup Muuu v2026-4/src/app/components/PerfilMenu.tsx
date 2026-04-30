import { ArrowLeft, UserCircle, Settings, LogOut } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import muuuLogo from 'figma:asset/4de3de61f8e4df99b460b6420b603ae06ba0b967.png';

interface PerfilMenuProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
  userName?: string;
}

export function PerfilMenu({ onBack, onNavigate, userName = 'Juan' }: PerfilMenuProps) {
  const menuOptions = [
    {
      icon: UserCircle,
      title: 'Mi Perfil',
      description: 'Ver y editar información personal',
      color: '#9B7EC7',
      bgColor: '#F3EBFF',
      action: () => onNavigate('perfilEstudiante')
    },
    {
      icon: Settings,
      title: 'Configuración',
      description: 'Ajustes y preferencias',
      color: '#7952B3',
      bgColor: '#E6D5F0',
      action: () => onNavigate('configuraciones')
    }
  ];

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
            Menú
          </h1>

          <div style={{ width: '44px' }}></div>
        </div>
      </div>

      {/* Contenido */}
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
        <div className="flex flex-col items-center mb-8">
          <div 
            className="flex items-center justify-center mb-4"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              border: '5px solid #9B7EC7',
              backgroundColor: '#E6D5F0',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: '40px',
              color: '#7952B3'
            }}
          >
            {userName.charAt(0).toUpperCase()}
          </div>

          <h2 
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: '22px',
              color: '#1E293B',
              marginBottom: '4px'
            }}
          >
            {userName}
          </h2>

          <p 
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 500,
              fontSize: '14px',
              color: '#64748B'
            }}
          >
            Estudiante
          </p>
        </div>

        {/* Opciones del menú */}
        <div className="space-y-4 mb-6">
          {menuOptions.map((option, index) => (
            <button
              key={index}
              onClick={option.action}
              className="w-full p-5 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                backgroundColor: '#FFFFFF',
                border: `2px solid ${option.bgColor}`,
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  backgroundColor: option.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <option.icon size={26} color={option.color} strokeWidth={2.5} />
              </div>
              <div className="flex-1 text-left">
                <p 
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 600,
                    fontSize: '16px',
                    color: '#1E293B',
                    marginBottom: '2px'
                  }}
                >
                  {option.title}
                </p>
                <p 
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 400,
                    fontSize: '13px',
                    color: '#64748B'
                  }}
                >
                  {option.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Logo Ada pequeño */}
        <div className="flex justify-center mt-8">
          <ImageWithFallback 
            src={muuuLogo} 
            alt="Ada la Vaca" 
            style={{ 
              width: '100px', 
              height: '100px',
              objectFit: 'contain',
              opacity: 0.3
            }}
          />
        </div>
      </div>
    </div>
  );
}
