import { useState, useEffect } from 'react';
import { ArrowLeft, UserCircle, Settings, HelpCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import muuuLogo from 'figma:asset/4de3de61f8e4df99b460b6420b603ae06ba0b967.png';
import { meAPI } from '../services/api';
import { useThemeColors } from '../contexts/SettingsContext';

interface PerfilMenuDocenteProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
  userName?: string;
}

export function PerfilMenuDocente({ onBack, onNavigate, userName = 'García' }: PerfilMenuDocenteProps) {
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const c = useThemeColors('teacher');

  useEffect(() => {
    meAPI().then(u => { if (u?.fotoPerfil) setFotoPerfil(u.fotoPerfil); }).catch(() => {});
  }, []);

  const menuOptions = [
    {
      icon: UserCircle,
      title: 'Mi Perfil',
      description: 'Ver y editar información personal',
      action: () => onNavigate('perfilDocente')
    },
    {
      icon: Settings,
      title: 'Configuración',
      description: 'Ajustes y preferencias',
      action: () => onNavigate('configuracionesDocente')
    },
    {
      icon: HelpCircle,
      title: 'Ayuda',
      description: 'Tutoriales y soporte',
      action: () => onNavigate('ayudaDocente')
    }
  ];

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
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.03 }}>
        <div className="absolute" style={{ backgroundColor: c.yellow, width: '120px', height: '100px', top: '10%', right: '5%', borderRadius: '50% 40% 45% 55%', filter: 'blur(5px)' }}></div>
      </div>

      {/* Header */}
      <div 
        className="absolute top-0 left-0 right-0 z-20"
        style={{ 
          height: '80px',
          background: `linear-gradient(135deg, ${c.yellowDark} 0%, ${c.yellow} 100%)`,
          boxShadow: `0 4px 12px ${c.shadow}`,
          padding: '16px 20px'
        }}
      >
        <div className="flex items-center justify-between h-full">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-white/20 transition-colors" style={{ color: c.headerText }}>
            <ArrowLeft size={28} strokeWidth={2.5} />
          </button>
          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '24px', color: c.headerText }}>
            Menú
          </h1>
          <div style={{ width: '44px' }}></div>
        </div>
      </div>

      {/* Contenido */}
      <div className="absolute" style={{ top: '80px', left: '0', right: '0', bottom: '0', overflowY: 'auto', padding: '20px' }}>
        {/* Avatar y nombre */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="flex items-center justify-center mb-4"
            style={{
              width: '100px', height: '100px', borderRadius: '50%',
              border: `4px solid ${c.yellowDark}`,
              backgroundColor: fotoPerfil ? 'transparent' : c.bgCard,
              fontFamily: 'Poppins, sans-serif', fontWeight: 700,
              fontSize: '40px', color: c.yellowDark,
              boxShadow: `0 4px 12px ${c.shadow}`,
              overflow: 'hidden',
            }}
          >
            {fotoPerfil ? (
              <img src={fotoPerfil} alt="Foto de perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              userName.charAt(0).toUpperCase()
            )}
          </div>

          <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '22px', color: c.textPrimary, marginBottom: '4px' }}>
            Prof. {userName}
          </h2>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: '14px', color: c.textSecondary }}>
            Docente
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
                backgroundColor: c.bgCard,
                border: `2px solid ${c.border}`,
                boxShadow: `0 2px 12px ${c.shadow}`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}
            >
              <div style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: c.yellowPale, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <option.icon size={26} color={c.yellowDark} strokeWidth={2.5} />
              </div>
              <div className="flex-1 text-left">
                <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '16px', color: c.textPrimary, marginBottom: '2px' }}>
                  {option.title}
                </p>
                <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: '13px', color: c.textSecondary }}>
                  {option.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Logo Ada */}
        <div className="flex justify-center mt-8">
          <ImageWithFallback src={muuuLogo} alt="Ada la Vaca" style={{ width: '100px', height: '100px', objectFit: 'contain', opacity: 0.3 }} />
        </div>
      </div>
    </div>
  );
}