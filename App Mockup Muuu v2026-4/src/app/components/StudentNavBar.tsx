import { useThemeColors } from '../contexts/SettingsContext';

interface StudentNavBarProps {
  onNavigate: (screen: string) => void;
  currentScreen?: 'home' | 'profile';
}

export function StudentNavBar({ onNavigate, currentScreen = 'home' }: StudentNavBarProps) {
  const c = useThemeColors('student');
  return (
    <div
      className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50"
      style={{
        width: '100%',
        maxWidth: '375px',
        backgroundColor: c.bgCard,
        borderTop: `1px solid ${c.border}`,
        padding: '12px 0',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="flex items-center justify-center gap-16">
        {/* Inicio */}
        <button
          onClick={() => onNavigate('studentHome')}
          className="flex flex-col items-center gap-1 transition-all hover:scale-110"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 16px'
          }}
        >
          <span style={{ fontSize: '24px' }}>🏠</span>
          <span
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: currentScreen === 'home' ? 600 : 500,
              fontSize: '11px',
              color: currentScreen === 'home' ? '#9B7EC7' : '#7952B3'
            }}
          >
            Inicio
          </span>
        </button>

        {/* Perfil */}
        <button
          onClick={() => onNavigate('perfilMenu')}
          className="flex flex-col items-center gap-1 transition-all hover:scale-110"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 16px'
          }}
        >
          <span style={{ fontSize: '24px' }}>👤</span>
          <span
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: currentScreen === 'profile' ? 600 : 500,
              fontSize: '11px',
              color: currentScreen === 'profile' ? '#9B7EC7' : '#7952B3'
            }}
          >
            Perfil
          </span>
        </button>
      </div>
    </div>
  );
}
