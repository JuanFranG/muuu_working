// ============================================================
//  MUUU APP · SettingsContext
//  Gestiona preferencias del usuario: modo oscuro, notificaciones, sonido.
//  Persiste en localStorage y aplica data-theme al <html>.
// ============================================================

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface SettingsState {
  darkMode: boolean;
  notifications: boolean;
  sound: boolean;
}

interface SettingsContextType extends SettingsState {
  toggleDarkMode: () => void;
  toggleNotifications: () => void;
  toggleSound: () => void;
}

const STORAGE_KEY = 'muuu_settings';

const defaults: SettingsState = {
  darkMode: false,
  notifications: true,
  sound: true,
};

function loadSettings(): SettingsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaults, ...JSON.parse(raw) };
  } catch { /* Ignore parse errors */ }
  return defaults;
}

const SettingsContext = createContext<SettingsContextType>({
  ...defaults,
  toggleDarkMode: () => {},
  toggleNotifications: () => {},
  toggleSound: () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SettingsState>(loadSettings);

  // Persistir en localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Aplicar data-theme al <html>
  useEffect(() => {
    const html = document.documentElement;
    if (settings.darkMode) {
      html.setAttribute('data-theme', 'dark');
      html.classList.add('dark');
    } else {
      html.setAttribute('data-theme', 'light');
      html.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const toggle = (key: keyof SettingsState) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SettingsContext.Provider value={{
      ...settings,
      toggleDarkMode: () => toggle('darkMode'),
      toggleNotifications: () => toggle('notifications'),
      toggleSound: () => toggle('sound'),
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}

// ── Hook de colores temáticos ──────────────────────────────────
// Devuelve los colores correctos según el modo (light/dark) y rol.
// Los componentes usan esto en lugar de colores hardcodeados.
export function useThemeColors(role: 'student' | 'teacher' = 'student') {
  const { darkMode } = useSettings();
  const isStudent = role === 'student';

  if (darkMode) {
    return {
      bgPage:    '#0D0B14',
      bgGradient: isStudent
        ? 'linear-gradient(180deg, #1A1528 0%, #0D0B14 100%)'
        : 'linear-gradient(180deg, #1A1810 0%, #121212 100%)',
      bgCard:    '#1C1826',
      bgCardAlt: '#241F30',
      bgInput:   '#251F32',
      bgSurface: '#16121E',
      bgOverlay: 'rgba(0,0,0,0.6)',

      // Textos
      textPrimary:   '#E8E4F0',
      textSecondary: '#B0A8C0',
      textMuted:     '#6D6580',
      textOnPurple:  '#FFFFFF',
      textOnYellow:  '#1A1A1A',

      // Acentos (ligeramente más claros para contraste)
      purple:      '#B49ADB',
      purpleDark:  '#9B7EC7',
      purpleLight: '#3D3550',
      purplePale:  '#2A2438',
      purpleSoft:  '#1E1A28',
      yellow:      '#FFD700',
      yellowDark:  '#F59E0B',
      yellowLight: '#3A3520',
      yellowPale:  '#24201A',

      // Bordes y sombras
      border:     isStudent ? '#3D3550' : '#3A3520',
      borderCard: isStudent ? '#2E2840' : '#2E2A1A',
      shadow:     'rgba(0,0,0,0.4)',

      // Header
      headerBg:   isStudent ? '#9B7EC7' : '#F59E0B',
      headerText: isStudent ? '#FFFFFF' : '#1A1A1A',

      // Estados
      success: '#10B981',
      error:   '#EF4444',
      errorBg: '#3B1C1C',
      warning: '#F59E0B',
    };
  }

  // LIGHT MODE (valores actuales de la app)
  return {
    bgPage:    '#FFFFFF',
    bgGradient: isStudent
      ? 'linear-gradient(180deg, #F3EBFF 0%, #FFFFFF 100%)'
      : 'linear-gradient(180deg, #FFFDE7 0%, #FFFFFF 100%)',
    bgCard:    '#FFFFFF',
    bgCardAlt: '#FAFAFA',
    bgInput:   '#FFFFFF',
    bgSurface: isStudent ? '#F3EBFF' : '#FFFDE7',
    bgOverlay: 'rgba(0,0,0,0.3)',

    textPrimary:   '#1E293B',
    textSecondary: '#475569',
    textMuted:     '#94A3B8',
    textOnPurple:  '#FFFFFF',
    textOnYellow:  '#1A1A1A',

    purple:      '#9B7EC7',
    purpleDark:  '#7952B3',
    purpleLight: '#B8A4D9',
    purplePale:  '#E6D5F0',
    purpleSoft:  '#F3EBFF',
    yellow:      '#FFD700',
    yellowDark:  '#F59E0B',
    yellowLight: '#FFF9C4',
    yellowPale:  '#FFFDE7',

    border:     isStudent ? '#E6D5F0' : '#FED7AA',
    borderCard: isStudent ? '#E6D5F0' : '#FED7AA',
    shadow:     'rgba(0,0,0,0.05)',

    headerBg:   isStudent ? '#9B7EC7' : '#F59E0B',
    headerText: isStudent ? '#FFFFFF' : '#78350F',

    success: '#10B981',
    error:   '#EF4444',
    errorBg: '#FEE2E2',
    warning: '#F59E0B',
  };
}
