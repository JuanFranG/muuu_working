import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Mail, Lock, Eye, EyeOff, User, GraduationCap, ArrowLeft, BookOpen, Lightbulb, Swords, Trophy, UserCircle, Settings, Bell, Loader2 } from 'lucide-react';
import { loginAPI, meAPI, logoutAPI, rolAFrontend, registrarAPI } from '../services/api';
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

// Pantalla de Login
function LoginScreen({ onBack, onRegister, onLoginSuccess }: { onBack: () => void; onRegister: () => void; onLoginSuccess: (role: 'student' | 'teacher', lastName: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      const nombre  = usuario.nombre.split(' ')[0]; // primer nombre
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
            color: '#1E293B',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 700
          }}>
            Bienvenido a Muuu
          </h2>
        </div>

        {/* Formulario */}
        <div className="space-y-4 mb-6">
          {/* Email */}
          <div>
            <div className="relative">
              <Mail 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                style={{ color: emailError ? '#EF4444' : '#9B7EC7' }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                placeholder="Correo electrónico"
                className="w-full p-4 pl-12 rounded-lg focus:outline-none focus:ring-2"
                style={{
                  border: emailError ? '2px solid #EF4444' : '2px solid #B8A4D9',
                  boxShadow: emailError ? '0 2px 8px rgba(239, 68, 68, 0.25)' : '0 2px 8px rgba(184, 164, 217, 0.25)'
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
                style={{ color: passwordError ? '#EF4444' : '#9B7EC7' }}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                placeholder="Contraseña"
                className="w-full p-4 pl-12 pr-12 rounded-lg focus:outline-none focus:ring-2"
                style={{
                  border: passwordError ? '2px solid #EF4444' : '2px solid #B8A4D9',
                  boxShadow: passwordError ? '0 2px 8px rgba(239, 68, 68, 0.25)' : '0 2px 8px rgba(184, 164, 217, 0.25)'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                style={{ color: '#7D7D7D' }}
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
            className="w-full p-4 rounded-xl transition-all flex items-center justify-center gap-2"
            style={{
              backgroundColor: isLoading ? '#B8A4D9' : '#9B7EC7',
              color: '#FFFFFF',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600,
              boxShadow: '0px 4px 12px rgba(155, 126, 199, 0.4)',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading && <Loader2 size={18} className="animate-spin" />}
            {isLoading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </div>

        {/* Link a registro */}
        <div className="text-center">
          <p className="text-sm mb-2" style={{ color: '#475569', fontFamily: 'Montserrat, sans-serif' }}>
            ¿No tienes cuenta?
          </p>
          <button
            onClick={onRegister}
            className="underline hover:no-underline"
            style={{ color: '#9B7EC7', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
          >
            Regístrate gratis aquí
          </button>
        </div>
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

// Componente Principal
type AppState = 'loading' | 'home' | 'login' | 'roleSelection' | 'register' | 'registroExitoso' | 'studentHome' | 'teacherHome' | 'aprendeUnPoco' | 'aprendeUnPocoMinimal' | 'disenarFlashcard' | 'editarFlashcard' | 'misFlashcards' | 'misDocumentos' | 'editarMaterial' | 'rankings' | 'perfilEstudiante' | 'perfilDocente' | 'configuraciones' | 'configuracionesDocente' | 'perfilMenu' | 'perfilMenuDocente' | 'ponteAPrueba' | 'desafiaAlguien' | 'salaDesafio' | 'miProgreso' | 'guiasEstudio' | 'agregarMaterial';

export function MuuuApp() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [userRole, setUserRole] = useState<'student' | 'teacher' | null>(null);
  const [userName, setUserName] = useState('Martínez');
  const [showNavOverlay, setShowNavOverlay] = useState(false);
  const [flashcardEditarId, setFlashcardEditarId] = useState<number | undefined>(undefined);
  const [materialEditarId,  setMaterialEditarId]  = useState<number | undefined>(undefined);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppState('home');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

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
    setShowNavOverlay(false);
  };

  // BOTONES INVISIBLES DE NAVEGACIÓN
  const NavButtons = () => (
    <>
      {/* Botón invisible esquina superior izquierda - Toggle menú navegación */}
      <button
        onClick={() => setShowNavOverlay(!showNavOverlay)}
        className="fixed top-0 left-0 z-[9999]"
        style={{
          width: '60px',
          height: '60px',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          opacity: 0.01
        }}
        title="Navegación rápida"
      />

      {/* Botón invisible esquina superior derecha - Loading */}
      <button
        onClick={() => navigateToScreen('loading')}
        className="fixed top-0 right-0 z-[9999]"
        style={{
          width: '60px',
          height: '60px',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          opacity: 0.01
        }}
        title="Loading Screen"
      />

      {/* Botón invisible esquina inferior izquierda - Student Home */}
      <button
        onClick={() => navigateToScreen('studentHome')}
        className="fixed bottom-0 left-0 z-[9999]"
        style={{
          width: '60px',
          height: '60px',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          opacity: 0.01
        }}
        title="Student Home"
      />

      {/* Botón invisible esquina inferior derecha - Teacher Home */}
      <button
        onClick={() => navigateToScreen('teacherHome')}
        className="fixed bottom-0 right-0 z-[9999]"
        style={{
          width: '60px',
          height: '60px',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          opacity: 0.01
        }}
        title="Teacher Home"
      />

      {/* Overlay de navegación */}
      {showNavOverlay && (
        <div 
          className="fixed inset-0 z-[9998] flex items-center justify-center"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)'
          }}
          onClick={() => setShowNavOverlay(false)}
        >
          <div 
            className="relative"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '32px',
              maxWidth: '340px',
              width: '90%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
              <h2 
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  fontSize: '20px',
                  color: '#1E293B',
                  marginBottom: '8px'
                }}
              >
                🚀 Navegación Rápida
              </h2>
              <p 
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '12px',
                  color: '#64748B'
                }}
              >
                Salta a cualquier pantalla
              </p>
            </div>

            {/* Grid de botones */}
            <div style={{ display: 'grid', gap: '8px' }}>
              {/* Pantallas generales */}
              <button
                onClick={() => navigateToScreen('loading')}
                className="transition-all hover:scale-[1.02]"
                style={{
                  padding: '14px 16px',
                  backgroundColor: '#F3EBFF',
                  border: '2px solid #E6D5F0',
                  borderRadius: '12px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: '#7952B3',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                🔄 Pantalla de Carga
              </button>

              <button
                onClick={() => navigateToScreen('home')}
                className="transition-all hover:scale-[1.02]"
                style={{
                  padding: '14px 16px',
                  backgroundColor: '#F3EBFF',
                  border: '2px solid #E6D5F0',
                  borderRadius: '12px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: '#7952B3',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                🏠 Inicio (Home)
              </button>

              <button
                onClick={() => navigateToScreen('login')}
                className="transition-all hover:scale-[1.02]"
                style={{
                  padding: '14px 16px',
                  backgroundColor: '#F3EBFF',
                  border: '2px solid #E6D5F0',
                  borderRadius: '12px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: '#7952B3',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                🔐 Login
              </button>

              <button
                onClick={() => navigateToScreen('roleSelection')}
                className="transition-all hover:scale-[1.02]"
                style={{
                  padding: '14px 16px',
                  backgroundColor: '#F3EBFF',
                  border: '2px solid #E6D5F0',
                  borderRadius: '12px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: '#7952B3',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                👤 Selección de Rol
              </button>

              <button
                onClick={() => {
                  setUserRole('student');
                  navigateToScreen('register');
                }}
                className="transition-all hover:scale-[1.02]"
                style={{
                  padding: '14px 16px',
                  backgroundColor: '#F3EBFF',
                  border: '2px solid #E6D5F0',
                  borderRadius: '12px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: '#7952B3',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                📝 Registro Estudiante
              </button>

              <button
                onClick={() => {
                  setUserRole('teacher');
                  navigateToScreen('register');
                }}
                className="transition-all hover:scale-[1.02]"
                style={{
                  padding: '14px 16px',
                  backgroundColor: '#FFFDE7',
                  border: '2px solid #FFF9C4',
                  borderRadius: '12px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: '#F59E0B',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                📝 Registro Docente
              </button>

              {/* Divisor */}
              <div 
                style={{
                  height: '1px',
                  backgroundColor: '#E6D5F0',
                  margin: '8px 0'
                }}
              />

              {/* Pantallas de estudiante */}
              <button
                onClick={() => navigateToScreen('studentHome')}
                className="transition-all hover:scale-[1.02]"
                style={{
                  padding: '14px 16px',
                  backgroundColor: '#9B7EC7',
                  border: '2px solid #7952B3',
                  borderRadius: '12px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#FFFFFF',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                🎓 Home Estudiante
              </button>

              <button
                onClick={() => navigateToScreen('aprendeUnPoco')}
                className="transition-all hover:scale-[1.02]"
                style={{
                  padding: '14px 16px',
                  backgroundColor: '#9B7EC7',
                  border: '2px solid #7952B3',
                  borderRadius: '12px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#FFFFFF',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                💡 Aprende un Poco (Original)
              </button>

              <button
                onClick={() => navigateToScreen('aprendeUnPocoMinimal')}
                className="transition-all hover:scale-[1.02]"
                style={{
                  padding: '14px 16px',
                  backgroundColor: '#9B7EC7',
                  border: '2px solid #7952B3',
                  borderRadius: '12px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#FFFFFF',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                💡 Aprende un Poco (Minimal)
              </button>

              <button
                onClick={() => navigateToScreen('ponteAPrueba')}
                className="transition-all hover:scale-[1.02]"
                style={{
                  padding: '14px 16px',
                  backgroundColor: '#9B7EC7',
                  border: '2px solid #7952B3',
                  borderRadius: '12px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#FFFFFF',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                🏆 Ponte a Prueba
              </button>

              <button
                onClick={() => navigateToScreen('desafiaAlguien')}
                className="transition-all hover:scale-[1.02]"
                style={{
                  padding: '14px 16px',
                  backgroundColor: '#9B7EC7',
                  border: '2px solid #7952B3',
                  borderRadius: '12px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#FFFFFF',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                ⚔️ Desafía a Alguien
              </button>

              <button
                onClick={() => navigateToScreen('miProgreso')}
                className="transition-all hover:scale-[1.02]"
                style={{
                  padding: '14px 16px',
                  backgroundColor: '#9B7EC7',
                  border: '2px solid #7952B3',
                  borderRadius: '12px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#FFFFFF',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                📊 Mi Progreso
              </button>

              <button
                onClick={() => navigateToScreen('rankings')}
                className="transition-all hover:scale-[1.02]"
                style={{
                  padding: '14px 16px',
                  backgroundColor: '#9B7EC7',
                  border: '2px solid #7952B3',
                  borderRadius: '12px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#FFFFFF',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                🏅 Rankings
              </button>

              <button
                onClick={() => {
                  setUserRole('student');
                  navigateToScreen('perfilEstudiante');
                }}
                className="transition-all hover:scale-[1.02]"
                style={{
                  padding: '14px 16px',
                  backgroundColor: '#9B7EC7',
                  border: '2px solid #7952B3',
                  borderRadius: '12px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#FFFFFF',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                👤 Perfil Estudiante
              </button>

              {/* Divisor */}
              <div 
                style={{
                  height: '1px',
                  backgroundColor: '#FFF9C4',
                  margin: '8px 0'
                }}
              />

              {/* Pantallas de docente */}
              <button
                onClick={() => navigateToScreen('teacherHome')}
                className="transition-all hover:scale-[1.02]"
                style={{
                  padding: '14px 16px',
                  backgroundColor: '#FFD700',
                  border: '2px solid #FFA000',
                  borderRadius: '12px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#1A1A1A',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                👨‍🏫 Home Docente
              </button>

              <button
                onClick={() => navigateToScreen('disenarFlashcard')}
                className="transition-all hover:scale-[1.02]"
                style={{
                  padding: '14px 16px',
                  backgroundColor: '#FFD700',
                  border: '2px solid #FFA000',
                  borderRadius: '12px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#1A1A1A',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                ✏️ Diseñar Flashcard
              </button>
            </div>

            {/* Footer info */}
            <div 
              style={{
                marginTop: '20px',
                padding: '12px',
                backgroundColor: '#F8F9FA',
                borderRadius: '8px',
                textAlign: 'center'
              }}
            >
              <p 
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '11px',
                  color: '#64748B',
                  lineHeight: '1.4'
                }}
              >
                <strong>Atajos:</strong><br />
                Esquina superior izq. = Este menú<br />
                Esquina inferior izq. = Student Home<br />
                Esquina inferior der. = Teacher Home
              </p>
            </div>

            {/* Botón cerrar */}
            <button
              onClick={() => setShowNavOverlay(false)}
              className="absolute top-4 right-4 transition-all hover:scale-110"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#F1F5F9',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748B'
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );

  if (appState === 'loading') {
    return (
      <>
        <LoadingScreen />
        <NavButtons />
      </>
    );
  }

  if (appState === 'home') {
    return (
      <>
        <HomeScreen onLoginClick={() => setAppState('login')} onRegisterClick={() => setAppState('roleSelection')} />
        <NavButtons />
      </>
    );
  }

  if (appState === 'login') {
    return (
      <>
        <LoginScreen 
          onBack={() => setAppState('home')} 
          onRegister={() => setAppState('roleSelection')}
          onLoginSuccess={(role, lastName) => {
            setUserRole(role);
            setUserName(lastName);
            if (role === 'student') {
              setAppState('studentHome');
            } else {
              setAppState('teacherHome');
            }
          }}
        />
        <NavButtons />
      </>
    );
  }

  if (appState === 'roleSelection') {
    return (
      <>
        <RoleSelectionScreen onRoleSelected={handleRoleSelected} onBack={() => setAppState('home')} />
        <NavButtons />
      </>
    );
  }

  if (appState === 'register') {
    return (
      <>
        <RegisterScreen userType={userRole} onBack={() => setAppState('roleSelection')} onRegisterSuccess={handleRegisterSuccess} />
        <NavButtons />
      </>
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
      <>
        <StudentHome userName={userName} onNavigate={setAppState} />
        <NavButtons />
      </>
    );
  }

  if (appState === 'aprendeUnPoco') {
    return (
      <>
        <AprendeUnPocoMinimal onBack={() => setAppState('studentHome')} />
        <NavButtons />
      </>
    );
  }

  if (appState === 'aprendeUnPocoMinimal') {
    return (
      <>
        <AprendeUnPocoMinimal onBack={() => setAppState('studentHome')} />
        <NavButtons />
      </>
    );
  }

  // Versión original de Aprende un Poco (mantenida para referencia)
  if (appState === 'aprendeUnPocoOriginal') {
    return (
      <>
        <AprendeUnPoco onBack={() => setAppState('studentHome')} />
        <NavButtons />
      </>
    );
  }

  if (appState === 'ponteAPrueba') {
    return (
      <>
        <PonteAPrueba onBack={() => setAppState('studentHome')} />
        <NavButtons />
      </>
    );
  }

  if (appState === 'desafiaAlguien') {
    return (
      <>
        <DesafiaAlguien 
          onBack={() => setAppState('studentHome')} 
          onCreateRoom={(config) => {
            console.log('Creating room with config:', config);
            setAppState('salaDesafio');
          }}
        />
        <NavButtons />
      </>
    );
  }

  if (appState === 'salaDesafio') {
    return (
      <>
        <SalaDesafio 
          onBack={() => setAppState('desafiaAlguien')} 
          onStartGame={() => {
            console.log('Starting game');
            // Aquí podría ir a una pantalla de juego
            setAppState('studentHome');
          }}
        />
        <NavButtons />
      </>
    );
  }

  if (appState === 'miProgreso') {
    return (
      <>
        <MiProgreso onBack={() => setAppState('studentHome')} />
        <NavButtons />
      </>
    );
  }

  if (appState === 'guiasEstudio') {
    return (
      <>
        <GuiasEstudio onBack={() => setAppState('studentHome')} />
        <NavButtons />
      </>
    );
  }

  if (appState === 'teacherHome') {
    return (
      <>
        <TeacherHome userName={userName} onNavigate={setAppState} />
        <NavButtons />
      </>
    );
  }

  if (appState === 'disenarFlashcard') {
    return (
      <>
        <DisenarFlashcard onBack={() => setAppState('teacherHome')} />
        <NavButtons />
      </>
    );
  }

  if (appState === 'misFlashcards') {
    return (
      <>
        <MisFlashcards
          onBack={() => setAppState('teacherHome')}
          onEditFlashcard={(id) => {
            setFlashcardEditarId(id);
            setAppState('editarFlashcard');
          }}
        />
        <NavButtons />
      </>
    );
  }

  if (appState === 'editarFlashcard') {
    return (
      <>
        <DisenarFlashcard
          onBack={() => setAppState('misFlashcards')}
          flashcardId={flashcardEditarId}
        />
        <NavButtons />
      </>
    );
  }

  if (appState === 'agregarMaterial') {
    return (
      <>
        <AgregarMaterial onBack={() => setAppState('teacherHome')} />
        <NavButtons />
      </>
    );
  }

  if (appState === 'misDocumentos') {
    return (
      <>
        <MisDocumentos
          onBack={() => setAppState('teacherHome')}
          onEditMaterial={(id) => { setMaterialEditarId(id); setAppState('editarMaterial'); }}
        />
        <NavButtons />
      </>
    );
  }

  if (appState === 'editarMaterial') {
    return (
      <>
        <AgregarMaterial
          onBack={() => setAppState('misDocumentos')}
          materialId={materialEditarId}
        />
        <NavButtons />
      </>
    );
  }

  if (appState === 'rankings') {
    return (
      <>
        <Rankings onBack={() => setAppState('studentHome')} />
        <NavButtons />
      </>
    );
  }

  if (appState === 'perfilEstudiante') {
    return (
      <>
        <PerfilEstudiante onBack={() => setAppState('perfilMenu')} />
        <NavButtons />
      </>
    );
  }

  if (appState === 'perfilDocente') {
    return (
      <>
        <PerfilDocente 
          onBack={() => setAppState('perfilMenuDocente')} 
          onNavigateToMenu={() => setAppState('perfilMenuDocente')}
        />
        <NavButtons />
      </>
    );
  }

  if (appState === 'configuraciones') {
    return (
      <>
        <Configuraciones 
          onBack={() => setAppState('perfilMenu')} 
          onLogout={() => setAppState('login')}
        />
        <NavButtons />
      </>
    );
  }

  if (appState === 'configuracionesDocente') {
    return (
      <>
        <ConfiguracionesDocente 
          onBack={() => setAppState('teacherHome')} 
          onLogout={() => setAppState('login')}
        />
        <NavButtons />
      </>
    );
  }

  if (appState === 'perfilMenu') {
    return (
      <>
        <PerfilMenu 
          userName={userName} 
          onBack={() => setAppState('studentHome')} 
          onNavigate={setAppState} 
        />
        <NavButtons />
      </>
    );
  }

  if (appState === 'perfilMenuDocente') {
    return (
      <>
        <PerfilMenuDocente 
          userName={userName} 
          onBack={() => setAppState('teacherHome')} 
          onNavigate={setAppState} 
        />
        <NavButtons />
      </>
    );
  }

  return null;
}