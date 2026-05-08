import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Bell, Lightbulb, Swords, Trophy, BookOpen, BarChart3, Flame } from 'lucide-react';
import muuuLogo from 'figma:asset/15c96d9f13a3f65cf154aaca4e2380bdb312d1a5.png';
import { meAPI, contarNoLeidasAPI } from '../services/api';
import { useThemeColors, useSettings } from '../contexts/SettingsContext';

interface StudentHomeProps {
  userName?: string;
  onNavigate: (screen: string) => void;
}

export function StudentHome({ userName = 'Martínez', onNavigate }: StudentHomeProps) {
  const [progress] = useState(65);
  const [streak] = useState(5);
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const [noLeidas,   setNoLeidas]   = useState(0);
  const c = useThemeColors('student');
  const { notifications } = useSettings();

  useEffect(() => {
    meAPI().then(u => { if (u?.fotoPerfil) setFotoPerfil(u.fotoPerfil); }).catch(() => {});
    contarNoLeidasAPI().then(setNoLeidas).catch(() => {});
  }, []);

  return (
    <div
      className="h-full w-full relative overflow-y-auto"
      style={{
        background: c.bgGradient,
        maxWidth: '375px',
        maxHeight: '812px',
        margin: '0 auto',
        paddingBottom: '80px'
      }}
    >
      {/* Manchas de vaca decorativas */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.05 }}>
        <div className="absolute" style={{ backgroundColor: c.bgCardAlt, width: '120px', height: '100px', top: '10%', right: '5%', borderRadius: '50% 40% 45% 55%', filter: 'blur(5px)' }}></div>
        <div className="absolute" style={{ backgroundColor: c.bgCardAlt, width: '80px', height: '70px', top: '40%', left: '8%', borderRadius: '45% 55% 50% 40%', filter: 'blur(5px)' }}></div>
        <div className="absolute" style={{ backgroundColor: c.bgCardAlt, width: '100px', height: '85px', bottom: '15%', right: '10%', borderRadius: '55% 45% 50% 50%', filter: 'blur(5px)' }}></div>
      </div>

      {/* HEADER SUPERIOR */}
      <div 
        className="sticky top-0 left-0 right-0 z-20"
        style={{ 
          height: '80px',
          backgroundColor: c.bgCard,
          boxShadow: `0 2px 8px ${c.shadow}`,
          padding: '16px 20px'
        }}
      >
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('perfilMenu')}
              className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
              style={{
                width: '48px', height: '48px', borderRadius: '50%',
                border: `3px solid ${c.purple}`,
                backgroundColor: fotoPerfil ? 'transparent' : c.purplePale,
                fontFamily: 'Poppins, sans-serif', fontWeight: 700,
                fontSize: '20px', color: c.purpleDark,
                overflow: 'hidden', padding: 0,
              }}
            >
              {fotoPerfil ? (
                <img src={fotoPerfil} alt="Foto de perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                userName.charAt(0).toUpperCase()
              )}
            </button>
            <div>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '15px', color: c.textPrimary, marginBottom: '2px' }}>
                Hola, {userName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Flame size={20} color="#9B2355" strokeWidth={2} fill="#9B2355" />
              <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '16px', color: '#9B2355' }}>
                {streak}
              </span>
            </div>

            <button
              className="relative p-2 rounded-full transition-colors"
              onClick={() => onNavigate('notificaciones')}
              style={{ width: '40px', height: '40px', backgroundColor: 'transparent' }}
            >
              <Bell size={24} style={{ color: c.purple }} strokeWidth={2} />
              {notifications && noLeidas > 0 && (
                <div className="absolute" style={{ top: '4px', right: '4px', minWidth: '17px', height: '17px', borderRadius: '999px', backgroundColor: '#EF4444', border: `2px solid ${c.bgCard}`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>
                  <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '9px', color: '#FFFFFF', lineHeight: 1 }}>
                    {noLeidas > 99 ? '99+' : noLeidas}
                  </span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* LOGO ADA CENTRAL */}
      <div className="flex justify-center items-center" style={{ marginTop: '16px', marginBottom: '12px', paddingLeft: '20px', paddingRight: '20px' }}>
        <ImageWithFallback src={muuuLogo} alt="Ada la Vaca" style={{ width: '140px', height: '140px', objectFit: 'contain' }} />
      </div>

      {/* Pregunta motivacional */}
      <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '16px', color: c.purpleDark, textAlign: 'center', marginBottom: '4px' }}>
        ¿Qué quieres hacer hoy?
      </p>

      {/* GRID 2x2 DE BOTONES PRINCIPALES */}
      <div className="grid grid-cols-2 gap-3" style={{ marginTop: '16px', paddingLeft: '20px', paddingRight: '20px' }}>
        {/* BOTÓN 1: APRENDE UN POCO */}
        <button
          onClick={() => onNavigate('aprendeUnPoco')}
          className="relative flex flex-col items-center justify-center transition-all cursor-pointer"
          style={{ height: '140px', background: 'linear-gradient(135deg, #9B7EC7 0%, #7952B3 100%)', border: 'none', borderRadius: '16px', boxShadow: '0 4px 16px rgba(155, 126, 199, 0.4)' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <BookOpen size={48} color="#FFFFFF" strokeWidth={2.5} style={{ marginBottom: '8px' }} />
          <span className="text-center" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '14px', color: '#FFFFFF', lineHeight: '1.2' }}>Aprende</span>
          <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: '13px', color: '#FFFFFF' }}>un Poco</span>
        </button>

        {/* BOTÓN 2: PONTE A PRUEBA */}
        <button
          onClick={() => onNavigate('ponteAPrueba')}
          className="flex flex-col items-center justify-center transition-all cursor-pointer"
          style={{ height: '140px', background: 'linear-gradient(135deg, #9B7EC7 0%, #7952B3 100%)', border: 'none', borderRadius: '16px', boxShadow: '0 4px 16px rgba(155, 126, 199, 0.4)' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <Lightbulb size={48} color="#FFFFFF" strokeWidth={2.5} style={{ marginBottom: '8px' }} />
          <span className="text-center" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '14px', color: '#FFFFFF', lineHeight: '1.2' }}>Ponte a</span>
          <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: '13px', color: '#FFFFFF' }}>Prueba</span>
        </button>

        {/* BOTÓN 3: DESAFÍA A ALGUIEN */}
        <button
          onClick={() => onNavigate('desafiaAlguien')}
          className="flex flex-col items-center justify-center transition-all cursor-pointer"
          style={{ height: '140px', background: 'linear-gradient(135deg, #8A2BE2 0%, #9B7EC7 100%)', border: 'none', borderRadius: '16px', boxShadow: '0 4px 16px rgba(138, 43, 226, 0.4)' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <Swords size={48} color="#FFFFFF" strokeWidth={2.5} style={{ marginBottom: '8px' }} />
          <span className="text-center" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '14px', color: '#FFFFFF', lineHeight: '1.2' }}>Desafía a</span>
          <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: '13px', color: '#FFFFFF' }}>Alguien</span>
        </button>

        {/* BOTÓN 4: MI PROGRESO */}
        <button
          onClick={() => onNavigate('miProgreso')}
          className="flex flex-col items-center justify-center transition-all cursor-pointer"
          style={{ height: '140px', background: 'linear-gradient(135deg, #7952B3 0%, #9B7EC7 100%)', border: 'none', borderRadius: '16px', boxShadow: '0 4px 16px rgba(121, 82, 179, 0.4)' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <BarChart3 size={48} color="#FFFFFF" strokeWidth={2.5} style={{ marginBottom: '8px' }} />
          <span className="text-center" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '14px', color: '#FFFFFF', lineHeight: '1.2' }}>Mi</span>
          <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: '13px', color: '#FFFFFF' }}>Progreso</span>
        </button>
      </div>

      {/* BOTÓN RANKINGS */}
      <div className="flex justify-center" style={{ marginTop: '24px', marginBottom: '100px' }}>
        <button
          onClick={() => onNavigate('rankings')}
          className="flex items-center justify-center rounded-full transition-all cursor-pointer"
          style={{ width: '120px', height: '120px', background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', border: 'none', boxShadow: '0 6px 20px rgba(255, 215, 0, 0.5)' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <div className="flex items-center gap-1">
            <Trophy size={32} color="#1A1A1A" strokeWidth={2.5} />
          </div>
        </button>
      </div>

      <style>{`
        button { transition: all 0.2s ease; }
      `}</style>
    </div>
  );
}