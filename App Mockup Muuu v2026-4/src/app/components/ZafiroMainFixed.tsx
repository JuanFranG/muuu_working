import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Mail, Lock, Eye, EyeOff, Key, User, Building2, ChevronRight, ArrowLeft } from 'lucide-react';
import swallowLogo from 'figma:asset/00240fda12245f7d7a725e6fa602b5499ea4a363.png';
import propositosColombiaLogo from 'figma:asset/f2c01bbc9f5f1251cbe90b5a7111146b1e268103.png';
import { ZafiroHomeScreen } from './ZafiroHomeScreen';
import { VerificacionTelefonicaSwallow } from './VerificacionTelefonicaSwallow';
import { ProporcionarNumeroTelefonico } from './ProporcionarNumeroTelefonico';
import { EditarPerfil } from './EditarPerfil';
import { VerificacionEmailEnviado } from './VerificacionEmailEnviado';
import { VerificacionEmailExitosa } from './VerificacionEmailExitosa';

// Simple components without Figma imports for testing
function SimpleLoadingScreen() {
  return (    
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 via-white to-sky-50 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-300 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-8 w-40 h-40 bg-sky-200 rounded-full blur-2xl"></div>
        <div className="absolute top-1/3 right-12 w-24 h-24 bg-blue-200 rounded-full blur-lg"></div>
      </div>    
      
      {/* Contenido principal movido hacia arriba */}
      <div className="flex-1 flex flex-col items-center justify-start pt-16 z-10">
        <div className="text-center">
          <div className="mx-auto mb-8 flex justify-center items-center">
            <ImageWithFallback 
              src={swallowLogo} 
              alt="Swallow Logo" 
              style={{ width: '180px', height: 'auto' }}
              className="object-contain drop-shadow-lg"
            />
          </div>
          
          <div className="px-6 mb-8">
            <p className="text-xl text-gray-700 leading-relaxed">
              Volando hacia<br />
              nuevas oportunidades
            </p>
          </div>
          
          <div className="w-64 h-3 bg-gray-200 rounded-full mx-auto shadow-inner">
            <div className="h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full w-3/4 animate-pulse shadow-sm"></div>
          </div>
        </div>
      </div>
      
      {/* Logo de Fundación Propósitos Colombia en la parte inferior */}
      <div className="flex flex-col items-center pb-8 z-10">
        <ImageWithFallback 
          src={propositosColombiaLogo} 
          alt="Fundación Propósitos Colombia" 
          className="h-20 w-auto object-contain"
        />
        <p className="text-xs text-gray-500 text-center mt-2">
          Powered by @CIEUniMagdalena - 2025
        </p>
      </div>
    </div>
  );
}

function SimpleLoginScreen({ onRegister, onZoneNavigation }: { onRegister: () => void, onZoneNavigation: (direction: 'left' | 'right') => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = () => {
    // Limpiar errores previos
    setEmailError('');
    setPasswordError('');

    // Validar que el email no esté vacío
    if (!email.trim()) {
      setEmailError('Por favor ingresa tu correo electrónico');
      return;
    }

    // Validar que la contraseña no esté vacía
    if (!password.trim()) {
      setPasswordError('Por favor ingresa tu contraseña');
      return;
    }

    // Verificar si el correo es el correcto
    if (email.toLowerCase() !== 'corre@correcto.co') {
      setEmailError('Correo no encontrado');
      return;
    }

    // Verificar si la contraseña es correcta
    if (password !== '123456') {
      setPasswordError('Contraseña Incorrecta');
      return;
    }

    // Si todo está correcto, proceder al login
    alert('Login exitoso');
  };
  
  return (
    <div className="h-full flex flex-col relative" style={{ background: 'linear-gradient(180deg, #EEF4FF 0%, #FFFFFF 100%)' }}>
      
      <div className="flex-1 flex flex-col justify-center px-8 pt-4">
        <div className="text-center mb-4 flex justify-center">
          <div className="mb-4">
            <ImageWithFallback 
              src={swallowLogo} 
              alt="Swallow Logo" 
              style={{ width: '180px', height: 'auto' }}
              className="object-contain"
            />
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          <div>
            <div className="relative">
              <Mail 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                style={{ color: emailError ? '#FF4747' : '#87CEEB' }}
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
                  border: emailError ? '1px solid #FF4747' : '1px solid #87CEEB',
                  boxShadow: emailError ? '0 2px 8px rgba(255, 71, 71, 0.25)' : '0 2px 8px rgba(135, 206, 235, 0.25)'
                }}
              />
            </div>
            {emailError && (
              <p className="text-xs mt-1 ml-1" style={{ 
                color: '#FF4747',
                fontFamily: 'Montserrat, sans-serif'
              }}>
                {emailError}
              </p>
            )}
          </div>
          
          <div>
            <div className="relative">
              <Lock 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                style={{ color: passwordError ? '#FF4747' : '#87CEEB' }}
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
                  border: passwordError ? '1px solid #FF4747' : '1px solid #87CEEB',
                  boxShadow: passwordError ? '0 2px 8px rgba(255, 71, 71, 0.25)' : '0 2px 8px rgba(135, 206, 235, 0.25)'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {passwordError && (
              <p className="text-xs mt-1 ml-1" style={{ 
                color: '#FF4747',
                fontFamily: 'Montserrat, sans-serif'
              }}>
                {passwordError}
              </p>
            )}
          </div>
          
          <button
            onClick={handleLogin}
            className="w-full transition-all text-center"
            style={{
              backgroundColor: '#1A43FF',
              color: '#FFFFFF',
              padding: '16px',
              border: 'none',
              borderRadius: '12px',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600,
              boxShadow: '0px 4px 12px rgba(26, 67, 255, 0.35)',
              cursor: 'pointer'
            }}
          >
            Iniciar sesión
          </button>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">¿Aún no estás registrado?</p>
          <button
            onClick={onRegister}
            className="text-blue-600 underline hover:no-underline font-bold"
          >
            Clic aquí para registrarte, es gratis
          </button>
        </div>
      </div>

      {/* Footer with Propósitos Colombia link */}
      <div className="text-center pb-4 space-y-1">
        <p className="text-xs" style={{ 
          color: '#374151',
          fontFamily: 'Montserrat, sans-serif'
        }}>
          Haz clic <button 
            onClick={() => window.open('https://www.jcdnconsulting.com/propositos-colombia?fbclid=PAb21jcAMwt-9leHRuA2FlbQIxMQABpx3BkfjwPPmXSi2ukuu8T0s3xdZfzzmxlMegs1v_CG1rxk4DqtTtUrW3UwAV_aem_d_6gWonGPkfU_6esVPCERw', '_blank')}
            className="underline hover:no-underline transition-colors"
            style={{ 
              color: '#1A43FF',
              background: 'none',
              border: 'none',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 'inherit',
              cursor: 'pointer'
            }}
          >
            aquí
          </button> para saber más de
        </p>
        <p className="text-xs" style={{ 
          color: '#374151',
          fontFamily: 'Montserrat, sans-serif'
        }}>
          Propósitos Colombia
        </p>
      </div>

      {/* Zonas invisibles para navegación por deslizamiento */}
      <div className="absolute bottom-0 left-0 w-1/2 h-16 z-20" 
           onClick={() => onZoneNavigation('left')}
           style={{ background: 'transparent' }}
      />
      <div className="absolute bottom-0 right-0 w-1/2 h-16 z-20" 
           onClick={() => onZoneNavigation('right')}
           style={{ background: 'transparent' }}
      />
    </div>
  );
}

function SimpleUserSelectionScreen({ onUserTypeSelected, onBackToHome, onZoneNavigation }: { onUserTypeSelected: (type: 'candidate' | 'company') => void, onBackToHome: () => void, onZoneNavigation: (direction: 'left' | 'right') => void }) {
  return (
    <div className="h-full flex flex-col relative" style={{ background: 'linear-gradient(180deg, #EEF4FF 0%, #FFFFFF 100%)' }}>
      
      {/* Botón de flecha para volver */}
      <button
        onClick={onBackToHome}
        className="absolute top-6 left-6 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors"
        style={{ 
          color: '#1E3A8A'
        }}
      >
        <ArrowLeft size={28} strokeWidth={2.5} />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Logo de Swallow */}
        <div className="flex flex-col items-center mb-6">
          <ImageWithFallback 
            src={swallowLogo} 
            alt="Swallow Logo" 
            style={{ width: '180px', height: 'auto' }}
            className="object-contain mb-4"
          />
        </div>

        {/* Question Text */}
        <h2 
          className="text-xl mb-8 text-center"
          style={{ 
            color: '#374151',
            fontFamily: 'Montserrat, sans-serif'
          }}
        >
          Antes de empezar, ¿quién soy?
        </h2>

        {/* User Type Selection Cards */}
        <div className="w-full max-w-sm space-y-4">
          {/* Aspirante Card */}
          <button
            onClick={() => onUserTypeSelected('candidate')}
            className="w-full p-5 rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-98 transform flex items-center justify-between"
            style={{ 
              backgroundColor: '#F0F9FF',
              border: '3px solid #1A43FF',
              fontFamily: 'Montserrat, sans-serif'
            }}
          >
            <div className="flex items-center gap-4">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#1A43FF' }}
              >
                <User size={28} color="#FFFFFF" strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <p className="text-lg font-semibold" style={{ color: '#1A43FF', fontFamily: 'Montserrat, sans-serif' }}>
                  Soy Aspirante
                </p>
                <p className="text-sm" style={{ color: '#1A43FF', opacity: 0.7, fontFamily: 'Montserrat, sans-serif' }}>
                  Busco empleo
                </p>
              </div>
            </div>
            <ChevronRight size={24} style={{ color: '#1A43FF' }} />
          </button>

          {/* Empresa Card */}
          <button
            onClick={() => onUserTypeSelected('company')}
            className="w-full p-5 rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-98 transform flex items-center justify-between"
            style={{ 
              backgroundColor: '#FFFBEB',
              border: '3px solid #F59E0B',
              fontFamily: 'Montserrat, sans-serif'
            }}
          >
            <div className="flex items-center gap-4">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#F59E0B' }}
              >
                <Building2 size={28} color="#FFFFFF" strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <p className="text-lg font-semibold" style={{ color: '#F59E0B', fontFamily: 'Montserrat, sans-serif' }}>
                  Soy Empresa
                </p>
                <p className="text-sm" style={{ color: '#F59E0B', opacity: 0.7, fontFamily: 'Montserrat, sans-serif' }}>
                  Busco candidatos
                </p>
              </div>
            </div>
            <ChevronRight size={24} style={{ color: '#F59E0B' }} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 right-0">
        <div className="text-center text-xs" style={{ 
          color: '#9CA3AF',
          fontFamily: 'Montserrat, sans-serif'
        }}>
          Powered by @CIEUniMagdalena2025
        </div>
      </div>

      {/* Zonas invisibles para navegación por deslizamiento */}
      <div className="absolute bottom-0 left-0 w-1/2 h-16 z-20" 
           onClick={() => onZoneNavigation('left')}
           style={{ background: 'transparent' }}
      />
      <div className="absolute bottom-0 right-0 w-1/2 h-16 z-20" 
           onClick={() => onZoneNavigation('right')}
           style={{ background: 'transparent' }}
      />
    </div>
  );
}

function SimpleRegisterScreen({ userType, onBack, onRegisterSubmit, onZoneNavigation }: { userType: 'candidate' | 'company' | null, onBack: () => void, onRegisterSubmit: () => void, onZoneNavigation: (direction: 'left' | 'right') => void }) {
  const isCandidate = userType === 'candidate';
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estados para formulario
  const [formData, setFormData] = useState({
    companyName: '',
    firstName: '',
    lastName: '',
    documentType: isCandidate ? '' : 'NIT',
    document: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Estados para errores
  const [errors, setErrors] = useState({
    companyName: '',
    firstName: '',
    lastName: '',
    document: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Función de validación
  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'companyName':
        if (!value.trim()) {
          return 'Debe llenar este campo';
        }
        const companyNameRegex = /^[a-zA-ZáéíóúñÑ\s&.-]+$/;
        if (value && !companyNameRegex.test(value)) {
          return 'Ingresa nombre válido';
        }
        break;
      case 'firstName':
      case 'lastName':
        if (!value.trim()) {
          return 'Debe llenar este campo';
        }
        const nameRegex = /^[a-zA-ZáéíóúñÑ\s]+$/;
        if (value && !nameRegex.test(value)) {
          return field === 'firstName' ? 'Ingresa nombres válidos' : 'Ingresa apellidos válidos';
        }
        break;
      case 'document':
        if (!value.trim()) {
          return 'Debe llenar este campo';
        }
        if (!isCandidate && formData.documentType === 'NIT') {
          const nitRegex = /^\d{1,3}\.\d{3}\.\d{3}[-–]\d{1}$/;
          if (value && !nitRegex.test(value)) {
            return 'NIT inválido';
          }
        } else if (isCandidate) {
          const cedulaRegex = /^\d{7,10}$/;
          if (value && !cedulaRegex.test(value)) {
            return 'Número de documento inválido';
          }
        }
        break;
      case 'email':
        if (!value.trim()) {
          return 'Debe llenar este campo';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          return 'Correo inválido';
        }
        break;
      case 'password':
        if (!value.trim()) {
          return 'Debe llenar este campo';
        }
        if (value && value.length < 6) {
          return 'La contraseña debe tener al menos seis dígitos';
        }
        break;
      case 'confirmPassword':
        if (!value.trim()) {
          return 'Debe llenar este campo';
        }
        if (value && value !== formData.password) {
          return 'Las contraseñas no coinciden';
        }
        break;
    }
    return '';
  };

  // Manejo de cambios en inputs
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validar el campo actual inmediatamente
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
    
    // Re-validar confirmPassword si se cambia password
    if (field === 'password' && formData.confirmPassword) {
      const confirmError = formData.confirmPassword !== value ? 'Las contraseñas no coinciden' : '';
      setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  // Manejo de pérdida de foco
  const handleBlur = (field: string) => {
    const value = formData[field as keyof typeof formData] as string;
    if (!value || !value.trim()) {
      setErrors(prev => ({ ...prev, [field]: 'Debe llenar este campo' }));
    }
  };

  // Función para validar todo el formulario al hacer submit
  const handleSubmit = () => {
    const newErrors = {
      companyName: '',
      firstName: '',
      lastName: '',
      document: '',
      email: '',
      password: '',
      confirmPassword: ''
    };

    // Validar todos los campos según el tipo de usuario
    if (isCandidate) {
      newErrors.firstName = validateField('firstName', formData.firstName);
      newErrors.lastName = validateField('lastName', formData.lastName);
      newErrors.document = validateField('document', formData.document);
      newErrors.email = validateField('email', formData.email);
      newErrors.password = validateField('password', formData.password);
      newErrors.confirmPassword = validateField('confirmPassword', formData.confirmPassword);
    } else {
      newErrors.companyName = validateField('companyName', formData.companyName);
      newErrors.document = validateField('document', formData.document);
      newErrors.email = validateField('email', formData.email);
      newErrors.password = validateField('password', formData.password);
      newErrors.confirmPassword = validateField('confirmPassword', formData.confirmPassword);
    }

    setErrors(newErrors);

    // Si hay algún error, no continuar
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    if (hasErrors) {
      return;
    }

    // Si todo está correcto, continuar
    onRegisterSubmit();
  };

  // Validar si el formulario es válido
  const isFormValid = () => {
    if (isCandidate) {
      const allFieldsFilled = formData.firstName && formData.lastName && formData.document && 
                             formData.email && formData.password && formData.confirmPassword;
      const noErrors = !errors.firstName && !errors.lastName && !errors.document && !errors.email && 
                       !errors.password && !errors.confirmPassword;
      return allFieldsFilled && noErrors;
    } else {
      const allFieldsFilled = formData.companyName && formData.document && 
                             formData.email && formData.password && formData.confirmPassword;
      const noErrors = !errors.companyName && !errors.document && !errors.email && 
                       !errors.password && !errors.confirmPassword;
      return allFieldsFilled && noErrors;
    }
  };
  
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-white to-gray-50 relative">
      
      {/* Botón de flecha para volver */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors"
        style={{ 
          color: '#1E3A8A'
        }}
      >
        <ArrowLeft size={28} strokeWidth={2.5} />
      </button>
      
      <div className={`flex-1 px-6 overflow-y-auto ${isCandidate ? 'py-2' : 'py-4'}`}>
        <div className={`text-center ${isCandidate ? 'mb-3' : 'mb-4'}`}>
          <div className="mx-auto flex justify-center mb-2" style={{ marginTop: '60px' }}>
            <ImageWithFallback 
              src={swallowLogo} 
              alt="Swallow Logo" 
              className="w-32 h-32 object-contain"
            />
          </div>
          <div 
            className={`inline-block px-4 py-2 rounded-full text-white text-sm font-bold ${
              isCandidate ? 'mb-3' : 'mb-4'
            }`}
            style={{
              backgroundColor: isCandidate ? '#1A43FF' : '#F59E0B',
              boxShadow: isCandidate 
                ? '0px 4px 12px rgba(26, 67, 255, 0.4)' 
                : '0px 6px 16px rgba(245, 158, 11, 0.5)'
            }}
          >
            Registro de {isCandidate ? 'Aspirante' : 'Empresa'}
          </div>
        </div>
        
        <div className={isCandidate ? 'space-y-2' : 'space-y-3'}>
          {/* Nombre de empresa / Primer nombre */}
          <div>
            <input
              type="text"
              value={isCandidate ? formData.firstName : formData.companyName}
              onChange={(e) => handleInputChange(isCandidate ? 'firstName' : 'companyName', e.target.value)}
              onBlur={() => handleBlur(isCandidate ? 'firstName' : 'companyName')}
              placeholder={isCandidate ? "Primer nombre" : "Nombre de la empresa"}
              className={`w-full border-2 rounded-lg focus:outline-none focus:ring-2 ${
                isCandidate ? 'p-2.5' : 'p-3'
              }`}
              style={{
                borderColor: (isCandidate ? errors.firstName : errors.companyName) ? '#FF4747' : (isCandidate ? '#93C5FD' : '#FDE68A'),
                boxShadow: (isCandidate ? errors.firstName : errors.companyName) ? '0 2px 8px rgba(255, 71, 71, 0.25)' : 'none'
              }}
            />
            {(isCandidate ? errors.firstName : errors.companyName) && (
              <p className="text-xs mt-1" style={{ color: '#FF4747', fontFamily: 'Montserrat, sans-serif' }}>
                {isCandidate ? errors.firstName : errors.companyName}
              </p>
            )}
          </div>

          {/* Apellido (solo para candidatos) */}
          {isCandidate && (
            <div>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                onBlur={() => handleBlur('lastName')}
                placeholder="Primer apellido"
                className="w-full p-2.5 border-2 rounded-lg focus:outline-none focus:ring-2"
                style={{
                  borderColor: errors.lastName ? '#FF4747' : '#93C5FD',
                  boxShadow: errors.lastName ? '0 2px 8px rgba(255, 71, 71, 0.25)' : 'none'
                }}
              />
              {errors.lastName && (
                <p className="text-xs mt-1" style={{ color: '#FF4747', fontFamily: 'Montserrat, sans-serif' }}>
                  {errors.lastName}
                </p>
              )}
            </div>
          )}
          
          {/* Tipo de documento (solo candidatos) */}
          {isCandidate && (
            <select
              value={formData.documentType}
              onChange={(e) => handleInputChange('documentType', e.target.value)}
              className="w-full p-2.5 border-2 border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 appearance-none"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                color: formData.documentType === '' ? '#D1D5DB' : '#374151'
              }}
            >
              <option value="" disabled style={{ color: '#D1D5DB' }}>Tipo de documento</option>
              <option value="CC" style={{ color: '#374151' }}>Cédula de Ciudadanía (CC)</option>
              <option value="CE" style={{ color: '#374151' }}>Cédula de Extranjería (CE)</option>
              <option value="PP" style={{ color: '#374151' }}>Pasaporte (PP)</option>
            </select>
          )}
          
          {/* Documento */}
          <div>
            <input
              type="text"
              value={formData.document}
              onChange={(e) => handleInputChange('document', e.target.value)}
              onBlur={() => handleBlur('document')}
              placeholder={isCandidate ? "Número de documento" : "NIT (XXX.XXX.XXX-Y)"}
              className={`w-full border-2 rounded-lg focus:outline-none focus:ring-2 ${
                isCandidate ? 'p-2.5' : 'p-3'
              }`}
              style={{
                borderColor: errors.document ? '#FF4747' : (isCandidate ? '#3B82F6' : '#FBBF24'),
                boxShadow: errors.document ? '0 2px 8px rgba(255, 71, 71, 0.25)' : 'none'
              }}
            />
            {errors.document && (
              <p className="text-xs mt-1" style={{ color: '#FF4747', fontFamily: 'Montserrat, sans-serif' }}>
                {errors.document}
              </p>
            )}
          </div>


          
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="Correo electrónico"
              className={`w-full border-2 rounded-lg focus:outline-none focus:ring-2 ${
                isCandidate ? 'p-2.5 pl-9' : 'p-3 pl-10'
              }`}
              style={{
                borderColor: errors.email ? '#FF4747' : '#93C5FD',
                boxShadow: errors.email ? '0 2px 8px rgba(255, 71, 71, 0.25)' : 'none'
              }}
            />
            {errors.email && (
              <p className="text-xs mt-1" style={{ color: '#FF4747', fontFamily: 'Montserrat, sans-serif' }}>
                {errors.email}
              </p>
            )}
          </div>
          
          {/* Contraseña */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              placeholder="Contraseña"
              className={`w-full border-2 rounded-lg focus:outline-none focus:ring-2 ${
                isCandidate ? 'p-2.5 pl-9 pr-11' : 'p-3 pl-10 pr-12'
              }`}
              style={{
                borderColor: errors.password ? '#FF4747' : '#93C5FD',
                boxShadow: errors.password ? '0 2px 8px rgba(255, 71, 71, 0.25)' : 'none'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            {errors.password && (
              <p className="text-xs mt-1" style={{ color: '#FF4747', fontFamily: 'Montserrat, sans-serif' }}>
                {errors.password}
              </p>
            )}
          </div>
          
          {/* Confirmar contraseña */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              onBlur={() => handleBlur('confirmPassword')}
              placeholder="Confirmar contraseña"
              className={`w-full border-2 rounded-lg focus:outline-none focus:ring-2 ${
                isCandidate ? 'p-2.5 pl-9 pr-11' : 'p-3 pl-10 pr-12'
              }`}
              style={{
                borderColor: errors.confirmPassword ? '#FF4747' : '#93C5FD',
                boxShadow: errors.confirmPassword ? '0 2px 8px rgba(255, 71, 71, 0.25)' : 'none'
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            {errors.confirmPassword && (
              <p className="text-xs mt-1" style={{ color: '#FF4747', fontFamily: 'Montserrat, sans-serif' }}>
                {errors.confirmPassword}
              </p>
            )}
          </div>
          
          {/* Términos y condiciones */}
          <div className={`text-xs text-gray-600 text-center leading-tight ${
            isCandidate ? 'py-1' : 'py-2'
          }`}>
            Al registrarte, aceptas nuestros{' '}
            <a href="#" className="text-blue-600 underline hover:no-underline">
              Términos y Condiciones
            </a>{' '}
            y{' '}
            <a href="#" className="text-blue-600 underline hover:no-underline">
              Política de Privacidad
            </a>
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className={`w-full text-white rounded-lg font-bold transition-all text-center ${
              isCandidate ? 'p-2.5' : 'p-3'
            }`}
            style={{
              backgroundColor: isFormValid() 
                ? (isCandidate ? '#1A43FF' : '#F59E0B')
                : '#9CA3AF',
              boxShadow: isFormValid()
                ? (isCandidate 
                  ? '0px 4px 12px rgba(26, 67, 255, 0.4)' 
                  : '0px 6px 16px rgba(245, 158, 11, 0.5)')
                : '0px 4px 12px rgba(156, 163, 175, 0.25)',
              cursor: isFormValid() ? 'pointer' : 'not-allowed'
            }}
          >
            Registrarme como {isCandidate ? 'Aspirante' : 'Empresa'}
          </button>
          
          {/* Zona invisible para desarrollador - doble tap esquina superior derecha */}
          <div 
            className="absolute top-0 right-0 w-16 h-16 z-30 cursor-pointer"
            onDoubleClick={onRegisterSubmit}
            style={{ background: 'transparent' }}
          />
          
          {/* Footer con referencia a Propósitos Colombia */}
          <div className="text-center py-2 space-y-1">
            <p className="text-xs" style={{ 
              color: '#9CA3AF',
              fontFamily: 'Montserrat, sans-serif'
            }}>
              Haz clic <button 
                onClick={() => window.open('https://www.jcdnconsulting.com/propositos-colombia?fbclid=PAb21jcAMwt-9leHRuA2FlbQIxMQABpx3BkfjwPPmXSi2ukuu8T0s3xdZfzzmxlMegs1v_CG1rxk4DqtTtUrW3UwAV_aem_d_6gWonGPkfU_6esVPCERw', '_blank')}
                className="underline hover:no-underline transition-colors"
                style={{ 
                  color: '#1E3A8A',
                  background: 'none',
                  border: 'none',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: 'inherit',
                  cursor: 'pointer'
                }}
              >
                aquí
              </button> para saber más de
            </p>
            <p className="text-xs" style={{ 
              color: '#9CA3AF',
              fontFamily: 'Montserrat, sans-serif'
            }}>
              Propósitos Colombia
            </p>
          </div>
        </div>
      </div>

      {/* Zonas invisibles para navegación por deslizamiento */}
      <div className="absolute bottom-0 right-0 w-1/2 h-16 z-20" 
           onClick={() => onZoneNavigation('right')}
           style={{ background: 'transparent' }}
      />
    </div>
  );
}

type AppState = 'loading' | 'home' | 'signIn' | 'userSelection' | 'proporcionarTelefono' | 'phoneVerification' | 'createAccount' | 'main' | 'editarPerfil' | 'emailEnviado' | 'emailVerificado';

export function ZafiroMainFixed() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [userType, setUserType] = useState<'company' | 'candidate' | null>(null);
  const [registeredPhone, setRegisteredPhone] = useState<string>('+57 300 123 4567');
  const [phoneData, setPhoneData] = useState<{ prefix: string; number: string }>({ prefix: '+57', number: '' });
  const [userEmail, setUserEmail] = useState<string>('andrea.martinez@email.com');
  const [emailVerificado, setEmailVerificado] = useState<boolean>(false);
  const [telefonoVerificado, setTelefonoVerificado] = useState<boolean>(true);

  // Función para navegar entre pantallas usando zonas invisibles
  const handleZoneNavigation = (direction: 'left' | 'right') => {
    switch (appState) {
      case 'home':
        if (direction === 'right') setAppState('signIn');
        break;
      case 'signIn':
        if (direction === 'left') setAppState('home');
        if (direction === 'right') setAppState('userSelection');
        break;
      case 'userSelection':
        if (direction === 'left') setAppState('signIn');
        if (direction === 'right' && userType) setAppState('proporcionarTelefono');
        break;
      case 'proporcionarTelefono':
        if (direction === 'left') setAppState('userSelection');
        if (direction === 'right') setAppState('phoneVerification');
        break;
      case 'phoneVerification':
        if (direction === 'left') setAppState('proporcionarTelefono');
        if (direction === 'right') setAppState('createAccount');
        break;
      case 'createAccount':
        if (direction === 'left') setAppState('phoneVerification');
        break;
      case 'main':
        if (direction === 'left') setAppState('phoneVerification');
        break;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppState('home');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleGoToLogin = () => {
    setAppState('signIn');
  };

  const handleGoToUserSelection = () => {
    setAppState('userSelection');
  };

  const handleBackToHome = () => {
    setAppState('home');
  };

  const handleUserTypeSelected = (selectedUserType: 'company' | 'candidate') => {
    setUserType(selectedUserType);
    setAppState('proporcionarTelefono');
  };

  const handleBackToUserSelection = () => {
    setAppState('userSelection');
  };

  const handleRegisterSubmit = () => {
    setAppState('main');
  };

  const handlePhoneDataSubmit = (phoneInfo: { prefix: string; number: string }) => {
    setPhoneData(phoneInfo);
    setRegisteredPhone(`${phoneInfo.prefix} ${phoneInfo.number}`);
    setAppState('phoneVerification');
  };

  const handleBackToPhoneInput = () => {
    setAppState('proporcionarTelefono');
  };

  const handleVerificationComplete = (code: string) => {
    console.log('Código verificado:', code);
    setAppState('createAccount');
  };

  const handleResendCode = () => {
    console.log('Reenviando código...');
  };

  const handleGoBackFromVerification = () => {
    setAppState('proporcionarTelefono');
  };

  const handleBackToPhoneVerification = () => {
    setAppState('phoneVerification');
  };

  // Handlers para flujo de verificación de email
  const handleGoToEditarPerfil = () => {
    setAppState('editarPerfil');
  };

  const handleVerificarEmail = (email: string) => {
    setUserEmail(email);
    setAppState('emailEnviado');
  };

  const handleReenviarCorreo = () => {
    console.log('Reenviando correo de verificación...');
  };

  const handleCambiarEmail = () => {
    setAppState('editarPerfil');
  };

  const handleVolverPerfil = () => {
    setAppState('editarPerfil');
  };

  const handleEmailVerificado = () => {
    setEmailVerificado(true);
    setAppState('emailVerificado');
  };

  const handleContinuarPerfil = () => {
    setAppState('editarPerfil');
  };

  // Handlers para toggles de verificación (botones secretos)
  const handleToggleEmailVerification = () => {
    setEmailVerificado(!emailVerificado);
  };

  const handleToggleTelefonoVerification = () => {
    setTelefonoVerificado(!telefonoVerificado);
  };

  const handleGoToPhoneVerification = () => {
    setAppState('phoneVerification');
  };

  if (appState === 'loading') {
    return <SimpleLoadingScreen />;
  }

  if (appState === 'home') {
    return <ZafiroHomeScreen onLoginClick={handleGoToLogin} onCreateAccountClick={handleGoToUserSelection} onZoneNavigation={handleZoneNavigation} />;
  }

  if (appState === 'signIn') {
    return <SimpleLoginScreen onRegister={handleGoToUserSelection} onZoneNavigation={handleZoneNavigation} />;
  }

  if (appState === 'userSelection') {
    return <SimpleUserSelectionScreen onUserTypeSelected={handleUserTypeSelected} onBackToHome={handleBackToHome} onZoneNavigation={handleZoneNavigation} />;
  }

  if (appState === 'createAccount') {
    return <SimpleRegisterScreen userType={userType} onBack={handleBackToPhoneVerification} onRegisterSubmit={handleRegisterSubmit} onZoneNavigation={handleZoneNavigation} />;
  }

  if (appState === 'proporcionarTelefono') {
    return (
      <ProporcionarNumeroTelefonico
        onBack={handleBackToUserSelection}
        onContinue={handlePhoneDataSubmit}
        userType={userType || 'candidate'}
      />
    );
  }

  if (appState === 'phoneVerification') {
    return (
      <VerificacionTelefonicaSwallow 
        phoneNumber={registeredPhone}
        onVerificationComplete={handleVerificationComplete}
        onResendCode={handleResendCode}
        onGoBack={handleGoBackFromVerification}
      />
    );
  }

  if (appState === 'editarPerfil') {
    return (
      <EditarPerfil 
        onGoBack={() => setAppState('main')}
        onVerificarEmail={handleVerificarEmail}
        userType={userType || 'candidate'}
        emailVerificado={emailVerificado}
        telefonoVerificado={telefonoVerificado}
        onToggleEmailVerification={handleToggleEmailVerification}
        onToggleTelefonoVerification={handleToggleTelefonoVerification}
        onGoToPhoneVerification={handleGoToPhoneVerification}
        onDirectToEmailVerified={handleEmailVerificado}
      />
    );
  }

  if (appState === 'emailEnviado') {
    return (
      <VerificacionEmailEnviado 
        email={userEmail}
        onReenviarCorreo={handleReenviarCorreo}
        onCambiarEmail={handleCambiarEmail}
        onVolverPerfil={handleVolverPerfil}
        onEmailVerificado={handleEmailVerificado}
      />
    );
  }

  if (appState === 'emailVerificado') {
    return (
      <VerificacionEmailExitosa 
        email={userEmail}
        onContinuarPerfil={handleContinuarPerfil}
      />
    );
  }

  // Pantalla de Bienvenida después de verificación exitosa
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 via-white to-sky-50 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-300 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-8 w-40 h-40 bg-sky-200 rounded-full blur-2xl"></div>
        <div className="absolute top-1/3 right-12 w-24 h-24 bg-blue-200 rounded-full blur-lg"></div>
      </div>


      
      <div className="flex-1 flex flex-col items-center justify-center text-center z-10 px-6">
        {/* Texto de bienvenida ARRIBA del logo - dividido en dos líneas */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-800 mb-4 leading-tight">
            ¡Bienvenido a<br />Swallow!
          </h1>
        </div>
        
        {/* Logo de Swallow */}
        <div className="w-[280px] h-[280px] mx-auto mb-6 flex justify-center items-center">
          <ImageWithFallback 
            src={swallowLogo} 
            alt="Swallow Logo" 
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>
        
        {/* Eslogan debajo del logo */}
        <div className="px-6 mb-8">
          <p className="text-xl text-gray-700 leading-relaxed">
            Volando hacia<br />
            nuevas oportunidades
          </p>
        </div>
        
        {/* Botón Continuar */}
        <div className="px-6 mb-4">
          <button
            onClick={handleGoToEditarPerfil}
            className="w-full max-w-xs mx-auto block px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Continuar
          </button>


        </div>
      </div>

      {/* Botón invisible para volver - esquina inferior izquierda */}
      <div 
        className="absolute bottom-0 left-0 w-20 h-20 z-20 cursor-pointer"
        onClick={() => setAppState('phoneVerification')}
        style={{ background: 'transparent' }}
      />

      {/* Zona invisible para acceder a editar perfil - esquina superior izquierda */}
      <div 
        className="absolute top-0 left-0 w-20 h-20 z-20 cursor-pointer"
        onClick={handleGoToEditarPerfil}
        style={{ background: 'transparent' }}
      />

      {/* BOTÓN INTUITIVO - Triple click en el logo para ir a verificación exitosa */}
      <div 
        className="absolute top-[450px] left-1/2 transform -translate-x-1/2 w-32 h-32 z-20 cursor-pointer"
        onClick={(e) => {
          const detail = (e as any).detail;
          if (detail === 3) {
            handleEmailVerificado();
          }
        }}
        style={{ background: 'transparent' }}
        title="Triple click para ver pantalle de email verificado"
      />



      {/* Zonas invisibles para navegación por deslizamiento */}
      <div className="absolute bottom-0 left-0 w-1/2 h-16 z-20" 
           onClick={() => handleZoneNavigation('left')}
           style={{ background: 'transparent' }}
      />
      <div className="absolute bottom-0 right-0 w-1/2 h-16 z-20" 
           onClick={() => handleZoneNavigation('right')}
           style={{ background: 'transparent' }}
      />

      {/* BOTÓN MÁS INTUITIVO - Click en esquina superior derecha del logo de Propósitos */}
      <div 
        className="absolute top-4 right-4 w-8 h-8 z-30 cursor-pointer"
        onDoubleClick={handleEmailVerificado}
        style={{ background: 'transparent' }}
        title="Doble click para email verificado"
      />
    </div>
  );
}