import { useState, useEffect } from 'react';
import { LoadingScreen } from './LoadingScreen';
import { WelcomeScreen } from './WelcomeScreen';
import { PostureApp } from './PostureApp';

type AppState = 'loading' | 'welcome' | 'createAccount' | 'signIn' | 'main';

export function SitBaxMain() {
  const [appState, setAppState] = useState<AppState>('loading');

  useEffect(() => {
    // Mostrar pantalla de carga por 2 segundos
    const timer = setTimeout(() => {
      setAppState('welcome');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleCreateAccount = () => {
    // Por ahora, ir directamente a la app principal
    // Después se implementará la pantalla de registro
    setAppState('main');
  };

  const handleSignIn = () => {
    // Por ahora, ir directamente a la app principal
    // Después se implementará la pantalla de inicio de sesión
    setAppState('main');
  };

  if (appState === 'loading') {
    return <LoadingScreen />;
  }

  if (appState === 'welcome') {
    return (
      <WelcomeScreen 
        onCreateAccount={handleCreateAccount}
        onSignIn={handleSignIn}
      />
    );
  }

  if (appState === 'createAccount') {
    // Placeholder para pantalla de registro (se implementará después)
    return (
      <div className="h-full bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Pantalla de Registro</h2>
          <p className="mb-4">Esta pantalla se implementará próximamente</p>
          <button 
            onClick={() => setAppState('welcome')}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (appState === 'signIn') {
    // Placeholder para pantalla de inicio de sesión (se implementará después)
    return (
      <div className="h-full bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Pantalla de Inicio de Sesión</h2>
          <p className="mb-4">Esta pantalla se implementará próximamente</p>
          <button 
            onClick={() => setAppState('welcome')}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  // Estado 'main' - mostrar la aplicación completa (PostureApp)
  return <PostureApp />;
}