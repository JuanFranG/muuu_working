import { ArrowLeft, Check } from 'lucide-react';
import { useThemeColors } from '../contexts/SettingsContext';

interface Props {
  onBack: () => void;
  role?: 'student' | 'teacher';
}

const idiomas = [
  { code: 'es', name: 'Español',  flag: '🇪🇸', active: true },
  { code: 'en', name: 'English',  flag: '🇺🇸', active: false },
  { code: 'fr', name: 'Français', flag: '🇫🇷', active: false },
];

export function SubpantallaIdioma({ onBack, role = 'student' }: Props) {
  const c = useThemeColors(role);

  return (
    <div className="h-full w-full relative overflow-hidden" style={{ background: c.bgGradient }}>
      {/* Header */}
      <div
        className="absolute top-0 left-0 right-0 z-20"
        style={{
          height: '80px',
          backgroundColor: c.headerBg,
          boxShadow: `0 2px 8px ${c.shadow}`,
          padding: '16px 20px',
        }}
      >
        <div className="flex items-center justify-between h-full">
          <button onClick={onBack} className="p-2 rounded-full" style={{ color: c.headerText }}>
            <ArrowLeft size={28} strokeWidth={2.5} />
          </button>
          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '24px', color: c.headerText }}>
            Idioma
          </h1>
          <div style={{ width: '44px' }} />
        </div>
      </div>

      {/* Contenido */}
      <div className="absolute" style={{ top: '80px', left: 0, right: 0, bottom: 0, overflowY: 'auto', padding: '20px' }}>
        <div className="p-5 rounded-2xl" style={{ backgroundColor: c.bgCard, border: `2px solid ${c.border}`, boxShadow: `0 2px 8px ${c.shadow}` }}>
          <div className="space-y-2">
            {idiomas.map((lang) => (
              <button
                key={lang.code}
                disabled={!lang.active}
                className="w-full flex items-center justify-between p-4 rounded-xl transition-all"
                style={{
                  backgroundColor: lang.active ? c.bgSurface : c.bgCardAlt,
                  border: lang.active ? `2px solid ${c.purple}` : `2px solid ${c.border}`,
                  opacity: lang.active ? 1 : 0.6,
                  cursor: lang.active ? 'default' : 'not-allowed',
                }}
              >
                <div className="flex items-center gap-4">
                  <span style={{ fontSize: '28px' }}>{lang.flag}</span>
                  <div className="text-left">
                    <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '15px', color: c.textPrimary }}>
                      {lang.name}
                    </p>
                    {!lang.active && (
                      <span
                        className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs"
                        style={{
                          backgroundColor: c.purplePale,
                          color: c.textMuted,
                          fontFamily: 'Poppins, sans-serif',
                          fontWeight: 500,
                        }}
                      >
                        Próximamente
                      </span>
                    )}
                  </div>
                </div>
                {lang.active && (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: c.purple }}
                  >
                    <Check size={18} color="#FFFFFF" strokeWidth={3} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Nota */}
        <p className="text-xs text-center mt-6" style={{ color: c.textMuted, fontFamily: 'Poppins, sans-serif' }}>
          Estamos trabajando para agregar más idiomas.
          <br />¡Gracias por tu paciencia! 🐮
        </p>
      </div>
    </div>
  );
}
