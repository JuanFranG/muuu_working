import zafiroLogo from 'figma:asset/0dda94d83a5c53fcdb3d69635fedad8d14b26c69.png';
import propositosLogo from 'figma:asset/306baf54b210403d9d56b873a0c944460dd03166.png';

interface ZafiroNewHomeScreenProps {
  onCreateAccount: () => void;
  onSignIn: () => void;
}

export function ZafiroNewHomeScreen({ onCreateAccount, onSignIn }: ZafiroNewHomeScreenProps) {
  return (
    <div 
      className="h-full flex flex-col relative"
      style={{ backgroundColor: '#CBE6F7' }}
    >
      {/* Propósitos Colombia Logo - Upper right corner */}
      <div className="absolute top-4 right-4 z-10">
        <img 
          src={propositosLogo} 
          alt="Propósitos Colombia" 
          className="h-12 w-auto"
          style={{ 
            width: '15%', 
            maxWidth: '60px',
            backgroundColor: 'rgb(203, 230, 247)'
          }}
        />
      </div>

      {/* Zafiro Logo - Centered at top */}
      <div className="flex justify-center pt-20 pb-8">
        <img 
          src={zafiroLogo} 
          alt="Zafiro" 
          className="w-40 h-40"
          style={{ 
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
            maxWidth: '50%',
            width: 'clamp(120px, 45vw, 160px)'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center px-6">
        <div className="w-full max-w-sm space-y-4">
          {/* Crear cuenta button */}
          <button
            onClick={onCreateAccount}
            className="w-full text-white rounded-lg transition-opacity hover:opacity-90"
            style={{
              backgroundColor: '#C71585',
              padding: '16px 24px',
              border: '0px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '500',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            Crear cuenta
          </button>

          {/* Iniciar sesión button */}
          <button
            onClick={onSignIn}
            className="w-full text-white rounded-lg transition-opacity hover:opacity-90"
            style={{
              backgroundColor: '#FF00FF',
              padding: '16px 24px',
              border: '0px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '500',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            Iniciar sesión
          </button>
        </div>

        {/* Slogan */}
        <div className="mt-8 px-4">
          <p 
            className="text-center"
            style={{
              fontSize: '17px',
              color: '#333333',
              lineHeight: '1.4',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: '400'
            }}
          >
            De gemas en bruto, a profesionales con fruto. Empleabilidad hecha oportunidad.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="pb-8 px-6">
        <p 
          className="text-center"
          style={{ 
            fontSize: '13px',
            color: '#666666',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          Powered by @CIEUniMagdalena - 2025
        </p>
      </div>
    </div>
  );
}