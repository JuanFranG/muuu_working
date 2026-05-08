// ============================================================
//  MUUU APP · Configuraciones (Estudiante)
//  Módulo funcional: toggles reales, navegación a subpantallas.
// ============================================================

import { ArrowLeft, Bell, Moon, Globe, Volume2, Shield, HelpCircle, LogOut, ChevronRight, Share2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useSettings, useThemeColors } from '../contexts/SettingsContext';
import { useSoundEffects } from '../hooks/useSoundEffects';
import muuuLogo from 'figma:asset/4de3de61f8e4df99b460b6420b603ae06ba0b967.png';

interface ConfiguracionesProps {
  onBack: () => void;
  userRole?: 'student' | 'teacher';
  onLogout: () => void;
  onNavigate?: (screen: string) => void;
}

export function Configuraciones({ onBack, userRole = 'student', onLogout, onNavigate }: ConfiguracionesProps) {
  const { darkMode, notifications, sound, toggleDarkMode, toggleNotifications, toggleSound } = useSettings();
  const c = useThemeColors(userRole);
  const { playToggle, playClick } = useSoundEffects();

  const isStudent = userRole === 'student';
  const primaryColor = isStudent ? c.purple : c.yellow;

  const handleToggle = (fn: () => void) => {
    fn();
    playToggle();
  };

  const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      onClick={() => handleToggle(onChange)}
      style={{
        width: '52px',
        height: '28px',
        borderRadius: '14px',
        backgroundColor: enabled ? primaryColor : '#CBD5E1',
        position: 'relative',
        transition: 'all 0.3s',
        border: 'none',
        cursor: 'pointer'
      }}
    >
      <div
        style={{
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          position: 'absolute',
          top: '3px',
          left: enabled ? '27px' : '3px',
          transition: 'all 0.3s',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
        }}
      />
    </button>
  );

  const navTo = (screen: string) => {
    playClick();
    onNavigate?.(screen);
  };

  const handleShare = async () => {
    playClick();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Muuu - Aprende jugando 🐮',
          text: '¡Descubre Muuu! La plataforma educativa de la Universidad del Magdalena.',
          url: 'https://muuu-working.onrender.com',
        });
      } catch { /* User cancelled */ }
    } else {
      await navigator.clipboard.writeText('https://muuu-working.onrender.com');
      alert('Link copiado al portapapeles ✓');
    }
  };

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
      {/* Header */}
      <div
        className="absolute top-0 left-0 right-0 z-20"
        style={{
          height: '80px',
          backgroundColor: c.headerBg,
          boxShadow: `0 2px 8px ${c.shadow}`,
          padding: '16px 20px'
        }}
      >
        <div className="flex items-center justify-between h-full">
          <button
            onClick={onBack}
            className="p-2 rounded-full transition-colors"
            style={{
              color: c.headerText,
              backgroundColor: isStudent ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            }}
          >
            <ArrowLeft size={28} strokeWidth={2.5} />
          </button>

          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '24px', color: c.headerText }}>
            Configuración
          </h1>

          <div style={{ width: '44px' }} />
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
        {/* ── Preferencias ── */}
        <div
          className="p-5 rounded-2xl mb-4"
          style={{
            backgroundColor: c.bgCard,
            border: `2px solid ${c.border}`,
            boxShadow: `0 2px 8px ${c.shadow}`
          }}
        >
          <h3 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '16px', color: c.textPrimary, marginBottom: '16px' }}>
            Preferencias
          </h3>

          <div className="space-y-4">
            {/* Notificaciones */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: c.bgSurface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bell size={20} color={primaryColor} strokeWidth={2.5} />
                </div>
                <div>
                  <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '14px', color: c.textPrimary }}>Notificaciones</p>
                  <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: '12px', color: c.textSecondary }}>
                    {notifications ? 'Activadas' : 'Desactivadas'}
                  </p>
                </div>
              </div>
              <ToggleSwitch enabled={notifications} onChange={toggleNotifications} />
            </div>

            {/* Modo oscuro */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: c.bgSurface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Moon size={20} color={primaryColor} strokeWidth={2.5} />
                </div>
                <div>
                  <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '14px', color: c.textPrimary }}>Modo Oscuro</p>
                  <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: '12px', color: c.textSecondary }}>
                    {darkMode ? 'Activado' : 'Desactivado'}
                  </p>
                </div>
              </div>
              <ToggleSwitch enabled={darkMode} onChange={toggleDarkMode} />
            </div>

            {/* Sonido */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: c.bgSurface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Volume2 size={20} color={primaryColor} strokeWidth={2.5} />
                </div>
                <div>
                  <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '14px', color: c.textPrimary }}>Sonido</p>
                  <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: '12px', color: c.textSecondary }}>
                    {sound ? 'Efectos activados' : 'Silenciado'}
                  </p>
                </div>
              </div>
              <ToggleSwitch enabled={sound} onChange={toggleSound} />
            </div>
          </div>
        </div>

        {/* ── General ── */}
        <div
          className="p-5 rounded-2xl mb-4"
          style={{
            backgroundColor: c.bgCard,
            border: `2px solid ${c.border}`,
            boxShadow: `0 2px 8px ${c.shadow}`
          }}
        >
          <h3 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '16px', color: c.textPrimary, marginBottom: '16px' }}>
            General
          </h3>

          <div className="space-y-3">
            {/* Idioma */}
            <button onClick={() => navTo('idioma')} className="w-full flex items-center justify-between p-3 rounded-xl transition-all hover:bg-gray-50" style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}>
              <div className="flex items-center gap-3">
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: c.bgSurface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Globe size={20} color={primaryColor} strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '14px', color: c.textPrimary }}>Idioma</p>
                  <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: '12px', color: c.textSecondary }}>Español</p>
                </div>
              </div>
              <ChevronRight size={20} color={c.textMuted} />
            </button>

            {/* Privacidad */}
            <button onClick={() => navTo('privacidad')} className="w-full flex items-center justify-between p-3 rounded-xl transition-all hover:bg-gray-50" style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}>
              <div className="flex items-center gap-3">
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: c.bgSurface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={20} color={primaryColor} strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '14px', color: c.textPrimary }}>Privacidad y Seguridad</p>
                  <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: '12px', color: c.textSecondary }}>Gestiona tus datos</p>
                </div>
              </div>
              <ChevronRight size={20} color={c.textMuted} />
            </button>

            {/* Ayuda */}
            <button onClick={() => navTo('ayuda')} className="w-full flex items-center justify-between p-3 rounded-xl transition-all hover:bg-gray-50" style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}>
              <div className="flex items-center gap-3">
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: c.bgSurface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <HelpCircle size={20} color={primaryColor} strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '14px', color: c.textPrimary }}>Ayuda y Soporte</p>
                  <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: '12px', color: c.textSecondary }}>Centro de ayuda</p>
                </div>
              </div>
              <ChevronRight size={20} color={c.textMuted} />
            </button>

            {/* Compartir */}
            <button onClick={handleShare} className="w-full flex items-center justify-between p-3 rounded-xl transition-all hover:bg-gray-50" style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}>
              <div className="flex items-center gap-3">
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: c.bgSurface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Share2 size={20} color={primaryColor} strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '14px', color: c.textPrimary }}>Compartir Muuu</p>
                  <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: '12px', color: c.textSecondary }}>Invita a tus compañeros 🐮</p>
                </div>
              </div>
              <ChevronRight size={20} color={c.textMuted} />
            </button>
          </div>
        </div>

        {/* ── Cerrar sesión ── */}
        <button
          className="w-full flex items-center justify-center gap-3 p-4 rounded-xl transition-all hover:scale-[1.02] mb-4"
          style={{
            backgroundColor: c.errorBg,
            border: `2px solid ${c.error}60`,
            color: c.error,
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            fontSize: '16px',
            cursor: 'pointer'
          }}
          onClick={() => { playClick(); onLogout(); }}
        >
          <LogOut size={20} strokeWidth={2.5} />
          Cerrar Sesión
        </button>

        {/* Versión */}
        <div className="text-center mb-4">
          <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', color: c.textMuted, marginBottom: '4px' }}>
            Versión 1.0.0
          </p>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: c.textMuted }}>
            © 2025 Muuu - Universidad del Magdalena
          </p>
        </div>

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <ImageWithFallback
            src={muuuLogo}
            alt="Ada la Vaca"
            style={{ width: '60px', height: '60px', objectFit: 'contain', opacity: 0.2 }}
          />
        </div>
      </div>
    </div>
  );
}