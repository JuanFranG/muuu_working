import { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Mail, Lock, Eye, EyeOff, User, GraduationCap, ArrowLeft, BookOpen, Lightbulb, Swords, Trophy, UserCircle, Settings, Bell, Loader2 } from 'lucide-react';
import { loginAPI, meAPI, logoutAPI, rolAFrontend, registrarAPI, loginGoogleAPI } from '../services/api';
import muuuLogo from 'figma:asset/4de3de61f8e4df99b460b6420b603ae06ba0b967.png';
import { AprendeUnPoco } from './AprendeUnPoco';
import { AprendeUnPocoMinimal } from './AprendeUnPocoMinimal';
import { StudentHome } from './StudentHome';
import { TeacherHome } from './TeacherHome';
import { DisenarFlashcard } from './DisenarFlashcard';
import { Rankings } from './Rankings';
import { PerfilEstudiante } from './PerfilEstudiante';
import { PerfilDocente } from './PerfilDocente';
import { Configuraciones } from './Configuraciones';
import { ConfiguracionesDocente } from './ConfiguracionesDocente';
import { PerfilMenu } from './PerfilMenu';
import { PerfilMenuDocente } from './PerfilMenuDocente';
import { PonteAPrueba } from './PonteAPrueba';
import { DesafiaAlguien } from './DesafiaAlguien';
import { SalaDesafio } from './SalaDesafio';
import { MiProgreso } from './MiProgreso';
import { GuiasEstudio } from './GuiasEstudio';
import { AgregarMaterial } from './AgregarMaterial';
import { MisFlashcards } from './MisFlashcards';
import { MisDocumentos } from './MisDocumentos';
import { Categorias } from './Categorias';
import { EditarPerfilMuuu } from './EditarPerfilMuuu';
import { Notificaciones } from './Notificaciones';
import { EstadisticasDocente } from './EstadisticasDocente';
import { SubpantallaIdioma } from './SubpantallaIdioma';
import { SubpantallaPrivacidad } from './SubpantallaPrivacidad';
import { SubpantallaAyuda } from './SubpantallaAyuda';
import { SettingsProvider } from '../contexts/SettingsContext';

// Pantalla Home Estudiante
function StudentHomeScreen({ userName = 'Estudiante', onNavigate }: { userName?: string; onNavigate: (screen: string) => void }) {
  const [progress] = useState(65); // Progreso del estudiante en %

  return (
    <div 
      className="h-full relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(180deg, #F3EBFF 0%, #FFFFFF 100%)' 
      }}
    >
      {/* Manchas de vaca decorativas */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div 
          className="absolute rounded-full"
          style={{ 
            backgroundColor: '#F5F5F5',
            width: '100px',
            height: '80px',
            top: '15%',
            left: '5%',
            borderRadius: '50% 40% 45% 55%'
          }}
        ></div>
        <div 
          className="absolute rounded-full"
          style={{ 
            backgroundColor: '#F5F5F5',
            width: '90px',
            height: '70px',
            top: '10%',
            right: '8%',
            borderRadius: '45% 55% 50% 40%'
          }}
        ></div>
        <div 
          className="absolute rounded-full"
          style={{ 
            backgroundColor: '#F5F5F5',
            width: '110px',
            height: '85px',
            bottom: '20%',
            left: '10%',
            borderRadius: '55% 45% 50% 50%'
          }}
        ></div>
        <div 
          className="absolute rounded-full"
          style={{ 
            backgroundColor: '#F5F5F5',
            width: '95px',
            height: '75px',
            bottom: '25%',
            right: '12%',
            borderRadius: '40% 60% 55% 45%'
          }}
        ></div>
      </div>

      {/* Header Superior */}
      <div 
        className="absolute top-0 left-0 right-0 p-4 z-20"
        style={{ 
          backgroundColor: '#FFFFFF',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)'
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ 
                backgroundColor: '#9B7EC7',
                border: '3px solid #7952B3'
              }}
            >
              <GraduationCap size={24} color="#FFFFFF" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm" style={{ 
                color: '#7D7D7D',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 500
              }}>
                Hola
              </p>
              <p style={{ 
                color: '#1E293B',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: '15px'
              }}>
                {userName}
              </p>
            </div>
          </div>
          
          {/* Icono de notificaciones */}
          <button 
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => console.log('Notificaciones')}
          >
            <Bell size={24} color="#7952B3" strokeWidth={2.5} />
            <div 
              className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: '#EF4444' }}
            ></div>
          </button>
        </div>
        
        {/* Barra de progreso */}
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#E6D5F0' }}>
          <div 
            className="h-full transition-all duration-500 rounded-full"
            style={{ 
              width: `${progress}%`,
              backgroundColor: '#9B7EC7'
            }}
          ></div>
        </div>
      </div>

      {/* Ada Mascot Central con animación bounce */}
      <div 
        className="absolute top-1/2 left-1/2 z-10 flex items-center justify-center"
        style={{
          transform: 'translate(-50%, -50%)',
          animation: 'bounce 3s ease-in-out infinite'
        }}
      >
        {/* Círculo de fondo */}
        <div
          className="absolute rounded-full"
          style={{
            width: '220px',
            height: '220px',
            backgroundColor: '#E6D5F0',
            border: '6px solid #7952B3',
            boxShadow: '0 8px 24px rgba(121, 82, 179, 0.3)'
          }}
        ></div>
        
        {/* Logo Ada */}
        <ImageWithFallback 
          src={muuuLogo} 
          alt="Ada la Vaca" 
          style={{ width: '180px', height: '180px', position: 'relative', zIndex: 1 }}
          className="object-contain"
        />
      </div>

      {/* CSS para animaciones */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.05); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(0.95); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes floatButton {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>

      {/* Botón 1: Aprende un Poco - Superior Izquierda */}
      <button
        onClick={() => onNavigate('aprendeUnPoco')}
        className="absolute flex flex-col items-center justify-center rounded-full transition-all hover:scale-110 hover:rotate-[5deg] cursor-pointer"
        style={{
          top: '25%',
          left: '12%',
          width: '110px',
          height: '110px',
          background: 'linear-gradient(135deg, #9B7EC7 0%, #7952B3 100%)',
          color: '#FFFFFF',
          boxShadow: '0 6px 20px rgba(155, 126, 199, 0.5)',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 700,
          fontSize: '12px',
          animation: 'floatButton 2s ease-in-out infinite'
        }}
      >
        <Lightbulb size={40} className="mb-1" strokeWidth={2.5} />
        <span className="text-center leading-tight">Aprende<br />un Poco</span>
      </button>

      {/* Botón 2: Desafía a Alguien - Superior Derecha */}
      <button
        onClick={() => console.log('Desafía a Alguien')}
        className="absolute flex flex-col items-center justify-center rounded-full transition-all hover:scale-110 hover:-rotate-[5deg] cursor-pointer"
        style={{
          top: '25%',
          right: '12%',
          width: '110px',
          height: '110px',
          background: 'linear-gradient(135deg, #8A2BE2 0%, #9B7EC7 100%)',
          color: '#FFFFFF',
          boxShadow: '0 6px 20px rgba(138, 43, 226, 0.5)',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 700,
          fontSize: '12px',
          animation: 'floatButton 2s ease-in-out infinite 0.3s'
        }}
      >
        <Swords size={40} className="mb-1" strokeWidth={2.5} />
        <span className="text-center leading-tight">Desafía a<br />Alguien</span>
      </button>

      {/* Botón 3: Rankings - Centro Inferior (Forma de Estrella con pulso) */}
      <button
        onClick={() => onNavigate('rankings')}
        className="absolute flex flex-col items-center justify-center rounded-full transition-all hover:scale-110 cursor-pointer"
        style={{
          bottom: '28%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '120px',
          height: '120px',
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          color: '#000000',
          boxShadow: '0 8px 24px rgba(255, 215, 0, 0.6)',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 800,
          fontSize: '14px',
          animation: 'pulse 1.5s ease-in-out infinite',
          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
        }}
      >
        <Trophy size={45} className="mb-1" strokeWidth={2.5} />
        <span>Rankings</span>
      </button>

      {/* Botón 4: Mi Perfil - Inferior Izquierda (Hexágono) */}
      <button
        onClick={() => onNavigate('perfilEstudiante')}
        className="absolute flex flex-col items-center justify-center transition-all hover:scale-110 cursor-pointer"
        style={{
          bottom: '12%',
          left: '18%',
          width: '85px',
          height: '85px',
          background: '#7952B3',
          color: '#FFFFFF',
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          boxShadow: '0 4px 12px rgba(121, 82, 179, 0.4)',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 600,
          fontSize: '11px',
          animation: 'floatButton 2s ease-in-out infinite 0.6s'
        }}
      >
        <UserCircle size={32} className="mb-1" strokeWidth={2.5} />
        <span>Perfil</span>
      </button>

      {/* Botón 5: Configuración - Inferior Derecha (Hexágono) */}
      <button
        onClick={() => onNavigate('configuraciones')}
        className="absolute flex flex-col items-center justify-center transition-all hover:scale-110 cursor-pointer"
        style={{
          bottom: '12%',
          right: '18%',
          width: '85px',
          height: '85px',
          background: '#7952B3',
          color: '#FFFFFF',
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          boxShadow: '0 4px 12px rgba(121, 82, 179, 0.4)',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 600,
          fontSize: '11px',
          animation: 'floatButton 2s ease-in-out infinite 0.9s'
        }}
      >
        <Settings size={32} className="mb-1" strokeWidth={2.5} />
        <span>Config</span>
      </button>
    </div>
  );
}

// Pantalla de Carga
function LoadingScreen() {
  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ 
      background: 'linear-gradient(180deg, #E6D5F0 0%, #FFFFFF 100%)' 
    }}>
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full blur-xl" style={{ backgroundColor: '#9B7EC7' }}></div>
        <div className="absolute bottom-20 right-8 w-40 h-40 rounded-full blur-2xl" style={{ backgroundColor: '#DDA0DD' }}></div>
        <div className="absolute top-1/3 right-12 w-24 h-24 rounded-full blur-lg" style={{ backgroundColor: '#B8A4D9' }}></div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 px-6">
        {/* Logo de Muuu (Ada) */}
        <div className="mb-8 flex justify-center items-center">
          <ImageWithFallback 
            src={muuuLogo} 
            alt="Muuu - Ada la Vaca" 
            style={{ width: '280px', height: 'auto' }}
            className="object-contain drop-shadow-2xl"
          />
        </div>

        {/* Eslogan */}
        <div className="px-6 mb-8 text-center">
          <p className="text-xl leading-relaxed" style={{ 
            color: '#475569',
            fontFamily: 'Montserrat, sans-serif'
          }}>
            Aprende Cálculo Integral<br />
            con Ada
          </p>
        </div>

        {/* Barra de progreso */}
        <div className="w-64 h-3 rounded-full mx-auto shadow-inner" style={{ backgroundColor: '#E6D5F0' }}>
          <div 
            className="h-3 rounded-full w-3/4 animate-pulse shadow-sm" 
            style={{ background: 'linear-gradient(90deg, #9B7EC7 0%, #8A2BE2 100%)' }}
          ></div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col items-center pb-8 z-10">
        <p className="text-xs text-center" style={{ color: '#7D7D7D', fontFamily: 'Montserrat, sans-serif' }}>
          Powered by @CIEUniMagdalena - 2025
        </p>
      </div>
    </div>
  );
}

// Pantalla de Inicio
function HomeScreen({ onLoginClick, onRegisterClick }: { onLoginClick: () => void; onRegisterClick: () => void }) {
  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ 
      background: 'linear-gradient(180deg, #F3EBFF 0%, #FFFFFF 100%)' 
    }}>
      {/* Elementos decorativos */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-8 w-24 h-24 rounded-full blur-xl" style={{ backgroundColor: '#FFD700' }}></div>
        <div className="absolute bottom-32 right-10 w-32 h-32 rounded-full blur-2xl" style={{ backgroundColor: '#9B7EC7' }}></div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 px-8">
        {/* Logo */}
        <div className="mb-6">
          <ImageWithFallback 
            src={muuuLogo} 
            alt="Muuu Logo" 
            style={{ width: '240px', height: 'auto' }}
            className="object-contain drop-shadow-lg"
          />
        </div>

        {/* Título y descripción */}
        <div className="text-center mb-8">
          <h1 className="text-3xl mb-3" style={{ 
            color: '#1E293B', 
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 700
          }}>
            Muuu
          </h1>
          <p className="text-base" style={{ 
            color: '#475569',
            fontFamily: 'Montserrat, sans-serif'
          }}>
            Flashcards nemotécnicas<br />
            para dominar el Cálculo Integral
          </p>
        </div>

        {/* Botones */}
        <div className="w-full max-w-sm space-y-4">
          <button
            onClick={onLoginClick}
            className="w-full p-4 rounded-xl transition-all hover:scale-[1.02]"
            style={{
              backgroundColor: '#9B7EC7',
              color: '#FFFFFF',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600,
              boxShadow: '0px 4px 16px rgba(155, 126, 199, 0.4)'
            }}
          >
            Iniciar sesión
          </button>

          <button
            onClick={onRegisterClick}
            className="w-full p-4 rounded-xl border-2 transition-all hover:scale-[1.02]"
            style={{
              backgroundColor: 'transparent',
              borderColor: '#9B7EC7',
              color: '#9B7EC7',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600
            }}
          >
            Crear cuenta nueva
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-6 z-10">
        <p className="text-xs" style={{ color: '#7D7D7D', fontFamily: 'Montserrat, sans-serif' }}>
          © 2025 Muuu - Universidad del Magdalena
        </p>
      </div>
    </div>
  );
}

// Botón de Google en su propio componente para aislar useGoogleLogin.
// Solo se renderiza si VITE_GOOGLE_CLIENT_ID está definido, lo que garantiza
// que siempre esté dentro de un GoogleOAuthProvider válido.
function GoogleLoginButton({
  onLoginSuccess,
  onGoogleNuevo,
}: {
  onLoginSuccess: (role: 'student' | 'teacher', lastName: string) => void;
  onGoogleNuevo:  (accessToken: string, nombre: string) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState('');

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setError('');
      try {
        const resultado = await loginGoogleAPI(tokenResponse.access_token);
        if (resultado.esNuevo) {
          onGoogleNuevo(tokenResponse.access_token, resultado.nombre);
        } else {
          const rol    = rolAFrontend(resultado.usuario.rol);
          const nombre = resultado.usuario.nombre.split(' ')[0];
          onLoginSuccess(rol, nombre);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error al ingresar con Google.');
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => setError('No se pudo abrir Google. Intenta de nuevo.'),
  });

  return (
    <div className="mb-4">
      {/* Separador */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px" style={{ backgroundColor: '#E2D9F3' }} />
        <span className="text-xs" style={{ color: '#9CA3AF', fontFamily: 'Montserrat, sans-serif' }}>o</span>
        <div className="flex-1 h-px" style={{ backgroundColor: '#E2D9F3' }} />
      </div>

      <button
        id="btn-google-login"
        onClick={() => { setError(''); googleLogin(); }}
        disabled={isLoading}
        className="w-full p-4 rounded-xl border-2 transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
        style={{
          backgroundColor: '#FFFFFF',
          borderColor:     '#B8A4D9',
          boxShadow:       '0 2px 8px rgba(184, 164, 217, 0.2)',
          fontFamily:      'Montserrat, sans-serif',
          fontWeight:      600,
          color:           '#1E293B',
          cursor:          isLoading ? 'not-allowed' : 'pointer',
          opacity:         isLoading ? 0.7 : 1,
        }}
      >
        {isLoading ? (
          <Loader2 size={20} className="animate-spin" style={{ color: '#9B7EC7' }} />
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        )}
        {isLoading ? 'Conectando con Google...' : 'Continuar con Google'}
      </button>

      {error && (
        <p className="text-xs mt-2 text-center" style={{ color: '#EF4444', fontFamily: 'Montserrat, sans-serif' }}>
          {error}
        </p>
      )}
    </div>
  );
}

// Pantalla de Login
function LoginScreen({ onBack, onRegister, onLoginSuccess, onGoogleNuevo }: {
  onBack:         () => void;
  onRegister:     () => void;
  onLoginSuccess: (role: 'student' | 'teacher', lastName: string) => void;
  onGoogleNuevo:  (accessToken: string, nombre: string) => void;
}) {
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError]   = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading]     = useState(false);
  const c = useThemeColors('student');

  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');

    if (!email.trim()) {
      setEmailError('Por favor ingresa tu correo');
      return;
    }
    if (!password.trim()) {
      setPasswordError('Por favor ingresa tu contraseña');
      return;
    }

    setIsLoading(true);
    try {
      const usuario = await loginAPI(email.trim(), password);
      const rol     = rolAFrontend(usuario.rol);
      const nombre  = usuario.nombre.split(' ')[0];
      onLoginSuccess(rol, nombre);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al iniciar sesión.';
      if (msg.toLowerCase().includes('contraseña')) {
        setPasswordError(msg);
      } else {
        setEmailError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col relative" style={{ 
      background: c.bgGradient 
    }}>
      {/* Botón volver */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-10 p-2 rounded-full transition-colors"
        style={{ color: c.purple, backgroundColor: c.bgCardAlt }}
      >
        <ArrowLeft size={28} strokeWidth={2.5} />
      </button>

      <div className="flex-1 flex flex-col justify-center px-8">
        {/* Logo */}
        <div className="text-center mb-6">
          <ImageWithFallback 
            src={muuuLogo} 
            alt="Muuu Logo" 
            style={{ width: '180px', height: 'auto' }}
            className="object-contain mx-auto mb-4"
          />
          <h2 className="text-2xl" style={{ 
            color: c.textPrimary,
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 700
          }}>
            Bienvenido a Muuu
          </h2>
        </div>

        {/* Formulario */}
        <div className="space-y-4 mb-4">
          {/* Email */}
          <div>
            <div className="relative">
              <Mail 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                style={{ color: c.purple }}
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                style={{ 
                  backgroundColor: c.bgInput, 
                  borderColor: emailError ? c.error : c.border,
                  color: c.textPrimary,
                  fontFamily: 'Montserrat, sans-serif',
                }}
              />
            </div>
            {emailError && (
              <p className="text-xs mt-1 ml-1" style={{ color: '#EF4444', fontFamily: 'Montserrat, sans-serif' }}>
                {emailError}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <Lock 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                style={{ color: c.purple }}
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                style={{ 
                  backgroundColor: c.bgInput, 
                  borderColor: passwordError ? c.error : c.border,
                  color: c.textPrimary,
                  fontFamily: 'Montserrat, sans-serif',
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1"
                style={{ color: c.textMuted }}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {passwordError && (
              <p className="text-xs mt-1 ml-1" style={{ color: '#EF4444', fontFamily: 'Montserrat, sans-serif' }}>
                {passwordError}
              </p>
            )}
          </div>

        {/* Botón Login */}
          <button 
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-semibold transition-all shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
            style={{ 
              backgroundColor: c.purple, 
              color: c.textOnPurple,
              fontFamily: 'Montserrat, sans-serif',
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading && <Loader2 size={18} className="animate-spin" />}
            {isLoading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </div>

        {/* Link a registro */}
        <div className="text-center mt-6">
          <p style={{ color: c.textMuted, fontFamily: 'Montserrat, sans-serif' }}>
            ¿No tienes cuenta?
          </p>
          <button 
            onClick={onRegister}
            style={{ 
              color: c.purple, 
              fontFamily: 'Montserrat, sans-serif',
              textDecoration: 'underline'
            }}
            className="font-semibold hover:opacity-80 transition-opacity mt-1"
          >
            Regístrate gratis aquí
          </button>
        </div>

        {/* Botón Google — siempre visible debajo de registrarse */}
        <GoogleLoginButton
          onLoginSuccess={onLoginSuccess}
          onGoogleNuevo={onGoogleNuevo}
        />
      </div>
    </div>
  );
}

// Pantalla de Selección de Rol
function RoleSelectionScreen({ onRoleSelected, onBack }: { onRoleSelected: (role: 'student' | 'teacher') => void; onBack: () => void }) {
  return (
    <div className="h-full flex flex-col relative" style={{ 
      background: 'linear-gradient(180deg, #F3EBFF 0%, #FFFFFF 100%)' 
    }}>
      {/* Botón volver */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors"
        style={{ color: '#7952B3' }}
      >
        <ArrowLeft size={28} strokeWidth={2.5} />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Logo */}
        <div className="mb-8">
          <ImageWithFallback 
            src={muuuLogo} 
            alt="Muuu Logo" 
            style={{ width: '180px', height: 'auto' }}
            className="object-contain"
          />
        </div>

        {/* Pregunta */}
        <h2 className="text-xl mb-8 text-center" style={{ 
          color: '#1E293B',
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 600
        }}>
          ¿Cómo quieres usar Muuu?
        </h2>

        {/* Opciones de Rol */}
        <div className="w-full max-w-sm space-y-4">
          {/* Estudiante */}
          <button
            onClick={() => onRoleSelected('student')}
            className="w-full p-5 rounded-2xl transition-all hover:scale-[1.02] flex items-center justify-between"
            style={{
              backgroundColor: '#F3EBFF',
              border: '3px solid #9B7EC7'
            }}
          >
            <div className="flex items-center gap-4">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#9B7EC7' }}
              >
                <GraduationCap size={28} color="#FFFFFF" strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <p className="text-lg" style={{ color: '#9B7EC7', fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>
                  Soy Estudiante
                </p>
                <p className="text-sm" style={{ color: '#7952B3', fontFamily: 'Montserrat, sans-serif' }}>
                  Quiero aprender
                </p>
              </div>
            </div>
            <ArrowLeft size={24} style={{ color: '#9B7EC7', transform: 'rotate(180deg)' }} />
          </button>

          {/* Docente */}
          <button
            onClick={() => onRoleSelected('teacher')}
            className="w-full p-5 rounded-2xl transition-all hover:scale-[1.02] flex items-center justify-between"
            style={{
              backgroundColor: '#FFFDE7',
              border: '3px solid #FFD700'
            }}
          >
            <div className="flex items-center gap-4">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#FFD700' }}
              >
                <BookOpen size={28} color="#1A1A1A" strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <p className="text-lg" style={{ color: '#FFC107', fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>
                  Soy Docente
                </p>
                <p className="text-sm" style={{ color: '#F59E0B', fontFamily: 'Montserrat, sans-serif' }}>
                  Quiero enseñar
                </p>
              </div>
            </div>
            <ArrowLeft size={24} style={{ color: '#FFD700', transform: 'rotate(180deg)' }} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-6">
        <p className="text-xs" style={{ color: '#7D7D7D', fontFamily: 'Montserrat, sans-serif' }}>
          Powered by @CIEUniMagdalena - 2025
        </p>
      </div>
    </div>
  );
}

// Pantalla de Registro
function RegisterScreen({ userType, onBack, onRegisterSuccess }: { userType: 'student' | 'teacher' | null; onBack: () => void; onRegisterSuccess: (userName: string) => void }) {
  const isStudent = userType === 'student';
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    code: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    code: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) return 'Debe llenar este campo';
        const nameRegex = /^[a-zA-ZáéíóúñÑ\\s]+$/;
        if (!nameRegex.test(value)) return 'Nombre inválido';
        break;
      case 'code':
        if (!value.trim()) return 'Debe llenar este campo';
        const codeRegex = isStudent ? /^\d{7,10}$/ : /^[A-Z0-9]{5,10}$/;
        if (!codeRegex.test(value)) return isStudent ? 'Código inválido' : 'Código docente inválido';
        break;
      case 'email':
        if (!value.trim()) return 'Debe llenar este campo';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Correo inválido';
        break;
      case 'password':
        if (!value.trim()) return 'Debe llenar este campo';
        if (value.length < 6) return 'Mínimo 6 caracteres';
        break;
      case 'confirmPassword':
        if (!value.trim()) return 'Debe llenar este campo';
        if (value !== formData.password) return 'Las contraseñas no coinciden';
        break;
    }
    return '';
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));

    if (field === 'password' && formData.confirmPassword) {
      const confirmError = formData.confirmPassword !== value ? 'Las contraseñas no coinciden' : '';
      setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const handleBlur = (field: string) => {
    const value = formData[field as keyof typeof formData];
    if (!value || !value.trim()) {
      setErrors(prev => ({ ...prev, [field]: 'Debe llenar este campo' }));
    }
  };

  const isFormValid = () => {
    const allFieldsFilled = formData.firstName && formData.lastName && formData.code && 
                           formData.email && formData.password && formData.confirmPassword;
    const noErrors = !errors.firstName && !errors.lastName && !errors.code && 
                     !errors.email && !errors.password && !errors.confirmPassword;
    return allFieldsFilled && noErrors;
  };

  const handleSubmit = async () => {
    if (!isFormValid()) return;
    setIsLoading(true);
    setApiError('');
    try {
      const nombre = `${formData.firstName} ${formData.lastName}`.trim();
      const rol: 'ESTUDIANTE' | 'DOCENTE' = isStudent ? 'ESTUDIANTE' : 'DOCENTE';
      await registrarAPI(nombre, formData.email, formData.password, rol);
      onRegisterSuccess(formData.lastName);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'Error al registrarse. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const primaryColor = isStudent ? '#9B7EC7' : '#FFD700';
  const bgColor = isStudent ? '#F3EBFF' : '#FFFDE7';
  const borderColor = isStudent ? '#B8A4D9' : '#FFF9C4';

  return (
    <div className="h-full flex flex-col relative" style={{ background: `linear-gradient(180deg, ${bgColor} 0%, #FFFFFF 100%)` }}>
      {/* Botón volver */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors"
        style={{ color: primaryColor }}
      >
        <ArrowLeft size={28} strokeWidth={2.5} />
      </button>

      <div className="flex-1 px-6 py-4 overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-4 mt-14">
          <ImageWithFallback 
            src={muuuLogo} 
            alt="Muuu Logo" 
            className="w-28 h-28 object-contain mx-auto mb-3"
          />
          <div 
            className="inline-block px-4 py-2 rounded-full text-white"
            style={{
              backgroundColor: primaryColor,
              boxShadow: `0px 4px 12px ${isStudent ? 'rgba(155, 126, 199, 0.4)' : 'rgba(255, 215, 0, 0.4)'}`
            }}
          >
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>
              Registro de {isStudent ? 'Estudiante' : 'Docente'}
            </p>
          </div>
        </div>

        {/* Formulario */}
        <div className="space-y-3">
          {/* Nombre */}
          <div>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              onBlur={() => handleBlur('firstName')}
              placeholder="Nombres"
              className="w-full p-3 border-2 rounded-lg focus:outline-none"
              style={{
                borderColor: errors.firstName ? '#EF4444' : borderColor,
                boxShadow: errors.firstName ? '0 2px 8px rgba(239, 68, 68, 0.25)' : 'none'
              }}
            />
            {errors.firstName && (
              <p className="text-xs mt-1" style={{ color: '#EF4444', fontFamily: 'Montserrat, sans-serif' }}>
                {errors.firstName}
              </p>
            )}
          </div>

          {/* Apellido */}
          <div>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              onBlur={() => handleBlur('lastName')}
              placeholder="Apellidos"
              className="w-full p-3 border-2 rounded-lg focus:outline-none"
              style={{
                borderColor: errors.lastName ? '#EF4444' : borderColor,
                boxShadow: errors.lastName ? '0 2px 8px rgba(239, 68, 68, 0.25)' : 'none'
              }}
            />
            {errors.lastName && (
              <p className="text-xs mt-1" style={{ color: '#EF4444', fontFamily: 'Montserrat, sans-serif' }}>
                {errors.lastName}
              </p>
            )}
          </div>

          {/* Código */}
          <div>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => handleInputChange('code', e.target.value)}
              onBlur={() => handleBlur('code')}
              placeholder={isStudent ? "Código estudiantil" : "Código docente"}
              className="w-full p-3 border-2 rounded-lg focus:outline-none"
              style={{
                borderColor: errors.code ? '#EF4444' : borderColor,
                boxShadow: errors.code ? '0 2px 8px rgba(239, 68, 68, 0.25)' : 'none'
              }}
            />
            {errors.code && (
              <p className="text-xs mt-1" style={{ color: '#EF4444', fontFamily: 'Montserrat, sans-serif' }}>
                {errors.code}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#7D7D7D' }} />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="Correo electrónico"
              className="w-full p-3 pl-10 border-2 rounded-lg focus:outline-none"
              style={{
                borderColor: errors.email ? '#EF4444' : borderColor,
                boxShadow: errors.email ? '0 2px 8px rgba(239, 68, 68, 0.25)' : 'none'
              }}
            />
            {errors.email && (
              <p className="text-xs mt-1" style={{ color: '#EF4444', fontFamily: 'Montserrat, sans-serif' }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Contraseña */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#7D7D7D' }} />
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              placeholder="Contraseña"
              className="w-full p-3 pl-10 pr-12 border-2 rounded-lg focus:outline-none"
              style={{
                borderColor: errors.password ? '#EF4444' : borderColor,
                boxShadow: errors.password ? '0 2px 8px rgba(239, 68, 68, 0.25)' : 'none'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              style={{ color: '#7D7D7D' }}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            {errors.password && (
              <p className="text-xs mt-1" style={{ color: '#EF4444', fontFamily: 'Montserrat, sans-serif' }}>
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirmar Contraseña */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#7D7D7D' }} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              onBlur={() => handleBlur('confirmPassword')}
              placeholder="Confirmar contraseña"
              className="w-full p-3 pl-10 pr-12 border-2 rounded-lg focus:outline-none"
              style={{
                borderColor: errors.confirmPassword ? '#EF4444' : borderColor,
                boxShadow: errors.confirmPassword ? '0 2px 8px rgba(239, 68, 68, 0.25)' : 'none'
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              style={{ color: '#7D7D7D' }}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            {errors.confirmPassword && (
              <p className="text-xs mt-1" style={{ color: '#EF4444', fontFamily: 'Montserrat, sans-serif' }}>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Términos */}
          <div className="text-xs text-center py-2" style={{ color: '#475569', fontFamily: 'Montserrat, sans-serif' }}>
            Al registrarte, aceptas nuestros{' '}
            <a href="#" className="underline hover:no-underline" style={{ color: primaryColor }}>
              T��rminos y Condiciones
            </a>
          </div>

          {/* Error de API */}
          {apiError && (
            <div
              className="w-full p-3 rounded-xl text-sm text-center"
              style={{
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600,
              }}
            >
              {apiError}
            </div>
          )}

          {/* Botón Registro */}
          <button
            onClick={handleSubmit}
            disabled={!isFormValid() || isLoading}
            className="w-full p-3 rounded-xl transition-all flex items-center justify-center gap-2"
            style={{
              backgroundColor: (isFormValid() && !isLoading) ? primaryColor : '#CCCCCC',
              color: (isFormValid() && !isLoading) ? '#FFFFFF' : '#7D7D7D',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600,
              boxShadow: (isFormValid() && !isLoading)
                ? `0px 4px 12px ${isStudent ? 'rgba(155, 126, 199, 0.4)' : 'rgba(255, 215, 0, 0.4)'}`
                : 'none',
              cursor: (isFormValid() && !isLoading) ? 'pointer' : 'not-allowed'
            }}
          >
            {isLoading ? (
              <><Loader2 size={16} className="animate-spin" /> Registrando...</>
            ) : (
              `Registrarme como ${isStudent ? 'Estudiante' : 'Docente'}`
            )}
          </button>

          {/* Footer */}
          <div className="text-center py-2">
            <p className="text-xs" style={{ color: '#7D7D7D', fontFamily: 'Montserrat, sans-serif' }}>
              Powered by @CIEUniMagdalena - 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Pantalla de selección de rol para nuevos usuarios que entran con Google
function GoogleRoleSelectionScreen({
  nombre,
  onRoleSelected,
  onBack,
}: {
  nombre:        string;
  onRoleSelected: (role: 'student' | 'teacher') => void;
  onBack:        () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [rolElegido, setRolElegido] = useState<'student' | 'teacher' | null>(null);

  const handleSelect = async (role: 'student' | 'teacher') => {
    setRolElegido(role);
    setIsLoading(true);
    await onRoleSelected(role);
    setIsLoading(false);
  };

  return (
    <div className="h-full flex flex-col relative" style={{
      background: 'linear-gradient(180deg, #F3EBFF 0%, #FFFFFF 100%)'
    }}>
      {/* Botón volver */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors"
        style={{ color: '#7952B3' }}
      >
        <ArrowLeft size={28} strokeWidth={2.5} />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Logo */}
        <div className="mb-6">
          <ImageWithFallback
            src={muuuLogo}
            alt="Muuu Logo"
            style={{ width: '140px', height: 'auto' }}
            className="object-contain"
          />
        </div>

        {/* Saludo con nombre de Google */}
        <div className="text-center mb-2">
          <p className="text-sm" style={{ color: '#7D7D7D', fontFamily: 'Montserrat, sans-serif' }}>
            ¡Hola, <strong style={{ color: '#7952B3' }}>{nombre.split(' ')[0]}</strong>!
          </p>
        </div>

        {/* Pregunta */}
        <h2 className="text-xl mb-8 text-center" style={{
          color: '#1E293B',
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 700
        }}>
          ¿Cómo quieres usar Muuu?
        </h2>

        {/* Tarjetas de rol */}
        <div className="w-full max-w-sm space-y-4">

          {/* Estudiante */}
          <button
            onClick={() => handleSelect('student')}
            disabled={isLoading}
            className="w-full p-5 rounded-2xl transition-all hover:scale-[1.02] flex items-center justify-between"
            style={{
              backgroundColor: '#F3EBFF',
              border: `3px solid ${rolElegido === 'student' ? '#7952B3' : '#9B7EC7'}`,
              opacity: isLoading && rolElegido !== 'student' ? 0.5 : 1,
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#9B7EC7' }}
              >
                {rolElegido === 'student' && isLoading ? (
                  <Loader2 size={28} color="#FFFFFF" className="animate-spin" />
                ) : (
                  <GraduationCap size={28} color="#FFFFFF" strokeWidth={2.5} />
                )}
              </div>
              <div className="text-left">
                <p className="text-lg" style={{ color: '#9B7EC7', fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>
                  Soy Estudiante
                </p>
                <p className="text-sm" style={{ color: '#7952B3', fontFamily: 'Montserrat, sans-serif' }}>
                  Quiero aprender
                </p>
              </div>
            </div>
            <ArrowLeft size={24} style={{ color: '#9B7EC7', transform: 'rotate(180deg)' }} />
          </button>

          {/* Docente */}
          <button
            onClick={() => handleSelect('teacher')}
            disabled={isLoading}
            className="w-full p-5 rounded-2xl transition-all hover:scale-[1.02] flex items-center justify-between"
            style={{
              backgroundColor: '#FFFDE7',
              border: `3px solid ${rolElegido === 'teacher' ? '#F59E0B' : '#FFD700'}`,
              opacity: isLoading && rolElegido !== 'teacher' ? 0.5 : 1,
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#FFD700' }}
              >
                {rolElegido === 'teacher' && isLoading ? (
                  <Loader2 size={28} color="#1A1A1A" className="animate-spin" />
                ) : (
                  <BookOpen size={28} color="#1A1A1A" strokeWidth={2.5} />
                )}
              </div>
              <div className="text-left">
                <p className="text-lg" style={{ color: '#FFC107', fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>
                  Soy Docente
                </p>
                <p className="text-sm" style={{ color: '#F59E0B', fontFamily: 'Montserrat, sans-serif' }}>
                  Quiero enseñar
                </p>
              </div>
            </div>
            <ArrowLeft size={24} style={{ color: '#FFD700', transform: 'rotate(180deg)' }} />
          </button>
        </div>

        {/* Nota */}
        <p className="text-xs text-center mt-6 px-4" style={{ color: '#9CA3AF', fontFamily: 'Montserrat, sans-serif' }}>
          Tu cuenta de Google se vinculará automáticamente.
        </p>
      </div>

      {/* Footer */}
      <div className="text-center pb-6">
        <p className="text-xs" style={{ color: '#7D7D7D', fontFamily: 'Montserrat, sans-serif' }}>
          Powered by @CIEUniMagdalena - 2025
        </p>
      </div>
    </div>
  );
}

// Componente Principal
type AppState = 'loading' | 'home' | 'login' | 'roleSelection' | 'register' | 'registroExitoso' | 'googleRoleSelection' | 'studentHome' | 'teacherHome' | 'aprendeUnPoco' | 'aprendeUnPocoMinimal' | 'disenarFlashcard' | 'editarFlashcard' | 'misFlashcards' | 'misDocumentos' | 'editarMaterial' | 'rankings' | 'perfilEstudiante' | 'perfilDocente' | 'configuraciones' | 'configuracionesDocente' | 'perfilMenu' | 'perfilMenuDocente' | 'ponteAPrueba' | 'desafiaAlguien' | 'salaDesafio' | 'miProgreso' | 'guiasEstudio' | 'agregarMaterial' | 'categorias' | 'editarPerfil' | 'notificaciones' | 'estadisticasDocente' | 'idioma' | 'privacidad' | 'ayuda' | 'idiomaDocente' | 'privacidadDocente' | 'ayudaDocente';

export function MuuuApp() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [userRole, setUserRole] = useState<'student' | 'teacher' | null>(null);
  const [userName, setUserName] = useState('Martínez');
  const [flashcardEditarId, setFlashcardEditarId] = useState<number | undefined>(undefined);
  const [materialEditarId,  setMaterialEditarId]  = useState<number | undefined>(undefined);
  const [prevPerfilScreen,  setPrevPerfilScreen]  = useState<AppState>('perfilEstudiante');
  // Datos del usuario para subpantallas
  const [userEmail, setUserEmail] = useState<string>('');
  const [hasGoogle, setHasGoogle] = useState<boolean>(false);
  // Estado temporal para el flujo de nuevo usuario Google
  const [googlePendiente, setGooglePendiente] = useState<{ accessToken: string; nombre: string } | null>(null);

  const TEACHER_SCREENS: AppState[] = [
    'teacherHome', 'disenarFlashcard', 'editarFlashcard',
    'misFlashcards', 'misDocumentos', 'editarMaterial',
    'agregarMaterial', 'categorias', 'perfilDocente',
    'perfilMenuDocente', 'configuracionesDocente',
    'idiomaDocente', 'privacidadDocente', 'ayudaDocente'
  ];
  const isTeacherScreen = TEACHER_SCREENS.includes(appState);
  const themeRole = isTeacherScreen ? 'teacher' : 'student';
  const c = useThemeColors(themeRole);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppState('home');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // ── Actualiza theme-color según la pantalla activa ───────
  useEffect(() => {
    const color = c.headerBg;
    const bodyBg = c.bgPage;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', color);
    document.body.style.backgroundColor = bodyBg;
  }, [c.headerBg, c.bgPage]);

  const handleRoleSelected = (role: 'student' | 'teacher') => {
    setUserRole(role);
    setAppState('register');
  };

  const handleRegisterSuccess = (_lastName: string) => {
    // Mostrar pantalla de éxito — el usuario debe iniciar sesión por su cuenta
    setAppState('registroExitoso');
  };

  const navigateToScreen = (screen: AppState) => {
    // Asegurar que tenemos el rol apropiado si navegamos a pantallas específicas
    if (screen === 'studentHome' || screen === 'aprendeUnPoco') {
      setUserRole('student');
    } else if (screen === 'teacherHome' || screen === 'disenarFlashcard') {
      setUserRole('teacher');
    }
    setAppState(screen);
  };

  if (appState === 'loading') {
    return (
      <LoadingScreen />
    );
  }

  if (appState === 'home') {
    return (
      <HomeScreen onLoginClick={() => setAppState('login')} onRegisterClick={() => setAppState('roleSelection')} />
    );
  }

  if (appState === 'login') {
    return (
      <LoginScreen
        onBack={() => setAppState('home')}
        onRegister={() => setAppState('roleSelection')}
        onLoginSuccess={(role, lastName) => {
          setUserRole(role);
          setUserName(lastName);
          // Obtener datos completos del usuario
          meAPI().then(u => {
            if (u) {
              setUserEmail(u.correo);
              setHasGoogle(!!u.googleId);
            }
          }).catch(() => {});
          if (role === 'student') {
            setAppState('studentHome');
          } else {
            setAppState('teacherHome');
          }
        }}
        onGoogleNuevo={(accessToken, nombre) => {
          setGooglePendiente({ accessToken, nombre });
          setAppState('googleRoleSelection');
        }}
      />
    );
  }

  if (appState === 'googleRoleSelection' && googlePendiente) {
    return (
      <GoogleRoleSelectionScreen
        nombre={googlePendiente.nombre}
        onRoleSelected={async (rolElegido) => {
          try {
            const resultado = await loginGoogleAPI(
              googlePendiente.accessToken,
              rolElegido === 'student' ? 'ESTUDIANTE' : 'DOCENTE'
            );
            if (!resultado.esNuevo) {
              const nombre = resultado.usuario.nombre.split(' ')[0];
              setUserRole(rolElegido);
              setUserName(nombre);
              setGooglePendiente(null);
              setAppState(rolElegido === 'student' ? 'studentHome' : 'teacherHome');
            }
          } catch (err) {
            console.error('Error al completar registro con Google:', err);
          }
        }}
        onBack={() => {
          setGooglePendiente(null);
          setAppState('login');
        }}
      />
    );
  }

  if (appState === 'roleSelection') {
    return (
      <RoleSelectionScreen onRoleSelected={handleRoleSelected} onBack={() => setAppState('home')} />
    );
  }

  if (appState === 'register') {
    return (
      <RegisterScreen userType={userRole} onBack={() => setAppState('roleSelection')} onRegisterSuccess={handleRegisterSuccess} />
    );
  }

  if (appState === 'registroExitoso') {
    const isStudentReg = userRole === 'student';
    const primaryColor = isStudentReg ? '#9B7EC7' : '#F59E0B';
    return (
      <div
        className="h-full flex flex-col items-center justify-center px-8 gap-6"
        style={{ background: isStudentReg ? 'linear-gradient(180deg, #F3EBFF 0%, #FFFFFF 100%)' : 'linear-gradient(180deg, #FFF8EC 0%, #FFFFFF 100%)' }}
      >
        {/* Ícono de éxito */}
        <div
          className="flex items-center justify-center rounded-full"
          style={{ width: '100px', height: '100px', backgroundColor: primaryColor, boxShadow: `0 8px 24px ${isStudentReg ? 'rgba(155,126,199,0.4)' : 'rgba(245,158,11,0.4)'}` }}
        >
          <span style={{ fontSize: '48px' }}>✅</span>
        </div>

        {/* Texto */}
        <div className="text-center">
          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '24px', color: '#1E293B', marginBottom: '8px' }}>
            ¡Registro exitoso!
          </h1>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', color: '#64748B', lineHeight: '1.6' }}>
            Tu cuenta ha sido creada correctamente.{'\n'}
            Inicia sesión para comenzar a usar Muuu.
          </p>
        </div>

        {/* Botón ir a login */}
        <button
          onClick={() => setAppState('login')}
          className="w-full py-4 rounded-2xl transition-all hover:opacity-90"
          style={{
            backgroundColor: primaryColor,
            color: '#FFFFFF',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 700,
            fontSize: '16px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: `0 4px 16px ${isStudentReg ? 'rgba(155,126,199,0.4)' : 'rgba(245,158,11,0.4)'}`,
          }}
        >
          Iniciar Sesión
        </button>

        <button
          onClick={() => setAppState('home')}
          style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  if (appState === 'studentHome') {
    return (
      <StudentHome userName={userName} onNavigate={setAppState} />
    );
  }

  if (appState === 'aprendeUnPoco') {
    return (
      <AprendeUnPocoMinimal onBack={() => setAppState('studentHome')} />
    );
  }

  if (appState === 'aprendeUnPocoMinimal') {
    return (
      <AprendeUnPocoMinimal onBack={() => setAppState('studentHome')} />
    );
  }

  // Versión original de Aprende un Poco (mantenida para referencia)
  if (appState === 'aprendeUnPocoOriginal') {
    return (
      <AprendeUnPoco onBack={() => setAppState('studentHome')} />
    );
  }

  if (appState === 'ponteAPrueba') {
    return (
      <PonteAPrueba onBack={() => setAppState('studentHome')} />
    );
  }

  if (appState === 'desafiaAlguien') {
    return (
      <DesafiaAlguien
        onBack={() => setAppState('studentHome')}
        onCreateRoom={(config) => {
          console.log('Creating room with config:', config);
          setAppState('salaDesafio');
        }}
      />
    );
  }

  if (appState === 'salaDesafio') {
    return (
      <SalaDesafio
        onBack={() => setAppState('desafiaAlguien')}
        onStartGame={() => {
          console.log('Starting game');
          // Aquí podría ir a una pantalla de juego
          setAppState('studentHome');
        }}
      />
    );
  }

  if (appState === 'miProgreso') {
    return (
      <MiProgreso onBack={() => setAppState('studentHome')} />
    );
  }

  if (appState === 'guiasEstudio') {
    return (
      <GuiasEstudio onBack={() => setAppState('studentHome')} />
    );
  }

  if (appState === 'teacherHome') {
    return (
      <TeacherHome userName={userName} onNavigate={setAppState} />
    );
  }

  if (appState === 'disenarFlashcard') {
    return (
      <DisenarFlashcard onBack={() => setAppState('teacherHome')} />
    );
  }

  if (appState === 'misFlashcards') {
    return (
      <MisFlashcards
        onBack={() => setAppState('teacherHome')}
        onEditFlashcard={(id) => {
          setFlashcardEditarId(id);
          setAppState('editarFlashcard');
        }}
      />
    );
  }

  if (appState === 'editarFlashcard') {
    return (
      <DisenarFlashcard
        onBack={() => setAppState('misFlashcards')}
        flashcardId={flashcardEditarId}
      />
    );
  }

  if (appState === 'agregarMaterial') {
    return (
      <AgregarMaterial onBack={() => setAppState('teacherHome')} />
    );
  }

  if (appState === 'misDocumentos') {
    return (
      <MisDocumentos
        onBack={() => setAppState('teacherHome')}
        onEditMaterial={(id) => { setMaterialEditarId(id); setAppState('editarMaterial'); }}
      />
    );
  }

  if (appState === 'editarMaterial') {
    return (
      <AgregarMaterial
        onBack={() => setAppState('misDocumentos')}
        materialId={materialEditarId}
      />
    );
  }

  if (appState === 'categorias') {
    return (
      <Categorias onBack={() => setAppState('teacherHome')} />
    );
  }

  if (appState === 'rankings') {
    return (
      <Rankings onBack={() => setAppState('studentHome')} />
    );
  }

  if (appState === 'estadisticasDocente') {
    return (
      <EstadisticasDocente onBack={() => setAppState('teacherHome')} />
    );
  }

  if (appState === 'perfilEstudiante') {
    return (
      <PerfilEstudiante
        onBack={() => setAppState('perfilMenu')}
        onNavigate={(screen) => {
          setPrevPerfilScreen('perfilEstudiante');
          setAppState(screen as AppState);
        }}
      />
    );
  }

  if (appState === 'perfilDocente') {
    return (
      <PerfilDocente
        onBack={() => setAppState('perfilMenuDocente')}
        onNavigateToMenu={() => setAppState('perfilMenuDocente')}
        onNavigate={(screen) => {
          setPrevPerfilScreen('perfilDocente');
          setAppState(screen as AppState);
        }}
      />
    );
  }

  if (appState === 'editarPerfil') {
    return (
      <EditarPerfilMuuu
        onBack={() => setAppState(prevPerfilScreen)}
        rol={userRole === 'teacher' ? 'DOCENTE' : 'ESTUDIANTE'}
      />
    );
  }

  if (appState === 'configuraciones') {
    return (
      <Configuraciones
        onBack={() => setAppState('perfilMenu')}
        onLogout={() => setAppState('login')}
        onNavigate={(screen) => setAppState(screen as AppState)}
      />
    );
  }

  if (appState === 'configuracionesDocente') {
    return (
      <ConfiguracionesDocente
        onBack={() => setAppState('perfilMenuDocente')}
        onLogout={() => setAppState('login')}
        onNavigate={(screen) => setAppState((screen + 'Docente') as AppState)}
      />
    );
  }

  // Subpantallas de configuración — Estudiante
  if (appState === 'idioma') {
    return <SubpantallaIdioma onBack={() => setAppState('configuraciones')} role="student" />;
  }
  if (appState === 'privacidad') {
    return <SubpantallaPrivacidad onBack={() => setAppState('configuraciones')} onLogout={() => setAppState('login')} role="student" userEmail={userEmail} userRole="Estudiante" hasGoogle={hasGoogle} />;
  }
  if (appState === 'ayuda') {
    return <SubpantallaAyuda onBack={() => setAppState('configuraciones')} role="student" />;
  }

  // Subpantallas de configuración — Docente
  if (appState === 'idiomaDocente') {
    return <SubpantallaIdioma onBack={() => setAppState('configuracionesDocente')} role="teacher" />;
  }
  if (appState === 'privacidadDocente') {
    return <SubpantallaPrivacidad onBack={() => setAppState('configuracionesDocente')} onLogout={() => setAppState('login')} role="teacher" userEmail={userEmail} userRole="Docente" hasGoogle={hasGoogle} />;
  }
  if (appState === 'ayudaDocente') {
    return <SubpantallaAyuda onBack={() => setAppState('configuracionesDocente')} role="teacher" />;
  }

  if (appState === 'notificaciones') {
    return (
      <Notificaciones
        onBack={() => setAppState(userRole === 'teacher' ? 'teacherHome' : 'studentHome')}
        rol={userRole === 'teacher' ? 'DOCENTE' : 'ESTUDIANTE'}
      />
    );
  }

  if (appState === 'perfilMenu') {
    return (
      <PerfilMenu
        userName={userName}
        onBack={() => setAppState('studentHome')}
        onNavigate={setAppState}
      />
    );
  }

  if (appState === 'perfilMenuDocente') {
    return (
      <PerfilMenuDocente
        userName={userName}
        onBack={() => setAppState('teacherHome')}
        onNavigate={setAppState}
      />
    );
  }

  return null;
}