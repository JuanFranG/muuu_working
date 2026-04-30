import { useState, useEffect } from 'react';
import { ZafiroLoadingScreen } from './ZafiroLoadingScreen';
import { ZafiroUserSelectionScreen } from './ZafiroUserSelectionScreen';
import { ZafiroLoginScreen } from './ZafiroLoginScreen';
import { ZafiroRegisterCandidateScreen } from './ZafiroRegisterCandidateScreen';
import { ZafiroRegisterCompanyScreen } from './ZafiroRegisterCompanyScreen';
import { PostureApp } from './PostureApp';

type AppState = 'loading' | 'userSelection' | 'createAccount' | 'signIn' | 'main';

export function ZafiroMain() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [userType, setUserType] = useState<'company' | 'candidate' | null>(null);

  useEffect(() => {
    // Mostrar pantalla de carga por 4 segundos, luego ir a inicio de sesión
    const timer = setTimeout(() => {
      setAppState('signIn');
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleLoginSuccess = () => {
    // Después del login exitoso, ir a la app principal
    setAppState('main');
  };

  const handleBackToUserSelection = () => {
    // Volver a la pantalla de selección de usuario desde registro
    setAppState('userSelection');
  };

  const handleBackFromLogin = () => {
    // Volver a la pantalla de carga
    setAppState('loading');
  };

  const handleGoToUserSelection = () => {
    // Ir a la pantalla de selección de roles
    setAppState('userSelection');
  };

  const handleUserTypeSelected = (selectedUserType: 'company' | 'candidate') => {
    setUserType(selectedUserType);
    // Ir directamente al formulario de registro según el tipo de usuario
    setAppState('createAccount');
  };

  const handleBackToUserSelection = () => {
    // Volver a la pantalla de selección de usuario desde registro
    setAppState('userSelection');
  };

  const handleRegisterSuccess = () => {
    // Después del registro exitoso, ir a la app principal
    setAppState('main');
  };

  if (appState === 'loading') {
    return <ZafiroLoadingScreen />;
  }

  if (appState === 'userSelection') {
    return <ZafiroUserSelectionScreen onUserTypeSelected={handleUserTypeSelected} />;
  }

  if (appState === 'createAccount') {
    // Mostrar el formulario de registro apropiado según el tipo de usuario
    if (userType === 'candidate') {
      return (
        <ZafiroRegisterCandidateScreen 
          onBack={handleBackToUserSelection}
          onRegisterSuccess={handleRegisterSuccess}
        />
      );
    } else if (userType === 'company') {
      return (
        <ZafiroRegisterCompanyScreen 
          onBack={handleBackToUserSelection}
          onRegisterSuccess={handleRegisterSuccess}
        />
      );
    }
  }

  if (appState === 'signIn') {
    // Pantalla de inicio de sesión implementada
    return (
      <ZafiroLoginScreen 
        onBack={handleBackFromLogin}
        onLogin={handleLoginSuccess}
        onRegister={handleGoToUserSelection}
        userType={userType}
      />
    );
  }

  // Estado 'main' - mostrar la aplicación completa (PostureApp) sin cambios
  return <PostureApp />;
}