import { ArrowLeft, Bell, Moon, Globe, Volume2, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import muuuLogo from 'figma:asset/4de3de61f8e4df99b460b6420b603ae06ba0b967.png';

interface ConfiguracionesDocenteProps {
  onBack: () => void;
  onLogout: () => void;
}

export function ConfiguracionesDocente({ onBack, onLogout }: ConfiguracionesDocenteProps) {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [sound, setSound] = useState(true);

  const primaryColor = '#F59E0B';
  const headerBg = 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)';
  const headerText = '#78350F';
  const bgGradient = '#F8F4EC';
  const borderColor = '#FED7AA';

  const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
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
      ></div>
    </button>
  );

  return (
    <div 
      className="h-full w-full relative overflow-hidden"
      style={{ 
        background: bgGradient,
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
          background: headerBg,
          boxShadow: '0 2px 8px rgba(245, 158, 11, 0.25)',
          padding: '16px 20px'
        }}
      >
        <div className="flex items-center justify-between h-full">
          <button
            onClick={onBack}
            className="p-2 rounded-full transition-colors"
            style={{ 
              color: headerText,
              backgroundColor: 'rgba(120, 53, 15, 0.1)'
            }}
          >
            <ArrowLeft size={28} strokeWidth={2.5} />
          </button>

          <h1 
            style={{ 
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: '24px',
              color: headerText
            }}
          >
            Configuración
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
        {/* Preferencias */}
        <div
          className="p-5 rounded-2xl mb-4"
          style={{
            backgroundColor: '#FFFFFF',
            border: `2px solid ${borderColor}`,
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
            Preferencias
          </h3>

          <div className="space-y-4">
            {/* Notificaciones */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: '#FEF3C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Bell size={20} color={primaryColor} strokeWidth={2.5} />
                </div>
                <div>
                  <p 
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#1E293B'
                    }}
                  >
                    Notificaciones
                  </p>
                  <p 
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 400,
                      fontSize: '12px',
                      color: '#64748B'
                    }}
                  >
                    Recibir alertas
                  </p>
                </div>
              </div>
              <ToggleSwitch enabled={notifications} onChange={() => setNotifications(!notifications)} />
            </div>

            {/* Modo oscuro */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: '#FEF3C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Moon size={20} color={primaryColor} strokeWidth={2.5} />
                </div>
                <div>
                  <p 
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#1E293B'
                    }}
                  >
                    Modo Oscuro
                  </p>
                  <p 
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 400,
                      fontSize: '12px',
                      color: '#64748B'
                    }}
                  >
                    Próximamente
                  </p>
                </div>
              </div>
              <ToggleSwitch enabled={darkMode} onChange={() => setDarkMode(!darkMode)} />
            </div>

            {/* Sonido */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: '#FEF3C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Volume2 size={20} color={primaryColor} strokeWidth={2.5} />
                </div>
                <div>
                  <p 
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#1E293B'
                    }}
                  >
                    Sonido
                  </p>
                  <p 
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 400,
                      fontSize: '12px',
                      color: '#64748B'
                    }}
                  >
                    Efectos de sonido
                  </p>
                </div>
              </div>
              <ToggleSwitch enabled={sound} onChange={() => setSound(!sound)} />
            </div>
          </div>
        </div>

        {/* General */}
        <div
          className="p-5 rounded-2xl mb-4"
          style={{
            backgroundColor: '#FFFFFF',
            border: `2px solid ${borderColor}`,
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
            General
          </h3>

          <div className="space-y-3">
            {/* Idioma */}
            <button
              className="w-full flex items-center justify-between p-3 rounded-xl transition-all hover:bg-gray-50"
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer'
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: '#FEF3C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Globe size={20} color={primaryColor} strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <p 
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#1E293B'
                    }}
                  >
                    Idioma
                  </p>
                  <p 
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 400,
                      fontSize: '12px',
                      color: '#64748B'
                    }}
                  >
                    Español
                  </p>
                </div>
              </div>
              <ChevronRight size={20} color="#94A3B8" />
            </button>

            {/* Privacidad */}
            <button
              className="w-full flex items-center justify-between p-3 rounded-xl transition-all hover:bg-gray-50"
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer'
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: '#FEF3C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Shield size={20} color={primaryColor} strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <p 
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#1E293B'
                    }}
                  >
                    Privacidad y Seguridad
                  </p>
                  <p 
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 400,
                      fontSize: '12px',
                      color: '#64748B'
                    }}
                  >
                    Gestiona tus datos
                  </p>
                </div>
              </div>
              <ChevronRight size={20} color="#94A3B8" />
            </button>

            {/* Ayuda */}
            <button
              className="w-full flex items-center justify-between p-3 rounded-xl transition-all hover:bg-gray-50"
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer'
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: '#FEF3C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <HelpCircle size={20} color={primaryColor} strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <p 
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#1E293B'
                    }}
                  >
                    Ayuda y Soporte
                  </p>
                  <p 
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 400,
                      fontSize: '12px',
                      color: '#64748B'
                    }}
                  >
                    Centro de ayuda
                  </p>
                </div>
              </div>
              <ChevronRight size={20} color="#94A3B8" />
            </button>
          </div>
        </div>

        {/* Cerrar sesión */}
        <button
          className="w-full flex items-center justify-center gap-3 p-4 rounded-xl transition-all hover:scale-[1.02] mb-4"
          style={{
            backgroundColor: '#FEE2E2',
            border: '2px solid #FCA5A5',
            color: '#DC2626',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            fontSize: '16px',
            cursor: 'pointer'
          }}
          onClick={onLogout}
        >
          <LogOut size={20} strokeWidth={2.5} />
          Cerrar Sesión
        </button>

        {/* Información de versión */}
        <div className="text-center mb-4">
          <p 
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '12px',
              color: '#94A3B8',
              marginBottom: '4px'
            }}
          >
            Versión 1.0.0
          </p>
          <p 
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '11px',
              color: '#CBD5E1'
            }}
          >
            © 2025 Muuu - Universidad del Magdalena
          </p>
        </div>

        {/* Logo Ada pequeño */}
        <div className="flex justify-center mb-4">
          <ImageWithFallback 
            src={muuuLogo} 
            alt="Ada la Vaca" 
            style={{ 
              width: '60px', 
              height: '60px',
              objectFit: 'contain',
              opacity: 0.2
            }}
          />
        </div>
      </div>
    </div>
  );
}