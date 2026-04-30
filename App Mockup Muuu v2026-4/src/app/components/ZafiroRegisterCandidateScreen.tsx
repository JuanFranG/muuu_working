import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, User, IdCard, Phone, ArrowLeft } from 'lucide-react';
import propositosLogo from 'figma:asset/306baf54b210403d9d56b873a0c944460dd03166.png';
import swallowLogo from 'figma:asset/9ebfd23cb16475a09766881a0f181c6d6cd7681b.png';

interface ZafiroRegisterCandidateScreenProps {
  onBack: () => void;
  onRegisterSuccess: () => void;
}

interface FormErrors {
  firstName: string;
  lastName: string;
  documentType: string;
  cedula: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export function ZafiroRegisterCandidateScreen({ onBack, onRegisterSuccess }: ZafiroRegisterCandidateScreenProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    documentType: '',
    cedula: '',
    email: '',
    countryCode: '+57',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({
    firstName: '',
    lastName: '',
    documentType: '',
    cedula: '',
    email: '',
    countryCode: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'firstName':
        // Validar que solo contenga letras, espacios y caracteres especiales del español
        const nameRegex = /^[a-zA-ZáéíóúñÑ\s]+$/;
        if (value && !nameRegex.test(value)) {
          return 'Nombre inválido';
        }
        break;
      case 'lastName':
        // Validar que solo contenga letras, espacios y caracteres especiales del español
        const lastNameRegex = /^[a-zA-ZáéíóúñÑ\s]+$/;
        if (value && !lastNameRegex.test(value)) {
          return 'Apellido inválido';
        }
        break;
      case 'cedula':
        // Validar que solo contenga números
        const cedulaRegex = /^\d+$/;
        if (value && !cedulaRegex.test(value)) {
          return 'Número de documento inválido';
        }
        break;
      case 'email':
        // Validar formato de email correo@dominio.LTD
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          return 'Correo inválido';
        }
        break;
      case 'countryCode':
        // Validar formato de prefijo (+XX o +XXX)
        const countryCodeRegex = /^\+\d{1,3}$/;
        if (value && !countryCodeRegex.test(value)) {
          return 'Prefijo inexistente';
        }
        break;
      case 'phoneNumber':
        // Validar que solo contenga números y tenga formato válido
        const phoneRegex = /^\d{10}$/;
        if (value && !phoneRegex.test(value)) {
          return 'Número inválido';
        }
        break;
      case 'password':
        // Validar longitud mínima de contraseña (6 dígitos)
        if (value && value.length < 6) {
          return 'La contraseña debe tener al menos seis dígitos';
        }
        break;
      case 'confirmPassword':
        // Validar que las contraseñas coincidan
        if (value && value !== formData.password) {
          return 'Contraseña Incorrecta';
        }
        break;
    }
    return '';
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validar el campo actual inmediatamente
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
    
    // Si cambia la contraseña y ya hay algo en confirmPassword, re-validar
    if (field === 'password' && formData.confirmPassword) {
      const confirmError = formData.confirmPassword !== value ? 'Contraseña Incorrecta' : '';
      setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
    }
    
    if (message) setMessage(null);
  };

  const handleBlur = (field: string) => {
    // Validar si el campo está vacío al perder el foco
    const value = formData[field as keyof typeof formData] as string;
    if (!value) {
      setErrors(prev => ({ ...prev, [field]: 'Debe llenar este campo' }));
    }
  };

  const handleDocumentTypeBlur = () => {
    if (!formData.documentType) {
      setErrors(prev => ({ ...prev, documentType: 'Debe seleccionar un tipo de documento' }));
    }
  };

  const isFormValid = () => {
    // Verificar que todos los campos estén llenos
    const allFieldsFilled = 
      formData.firstName && 
      formData.lastName && 
      formData.documentType && 
      formData.cedula && 
      formData.email && 
      formData.countryCode && 
      formData.phoneNumber && 
      formData.password && 
      formData.confirmPassword;
    
    // Verificar que no haya errores
    const noErrors = 
      !errors.firstName && 
      !errors.lastName && 
      !errors.documentType && 
      !errors.cedula && 
      !errors.email && 
      !errors.countryCode && 
      !errors.phoneNumber && 
      !errors.password && 
      !errors.confirmPassword;
    
    return allFieldsFilled && noErrors;
  };

  const handleSubmit = () => {
    // Validar campos vacíos y actualizar errores
    const newErrors: FormErrors = {
      firstName: formData.firstName ? validateField('firstName', formData.firstName) : 'Debe llenar este campo',
      lastName: formData.lastName ? validateField('lastName', formData.lastName) : 'Debe llenar este campo',
      documentType: formData.documentType ? '' : 'Debe seleccionar un tipo de documento',
      cedula: formData.cedula ? validateField('cedula', formData.cedula) : 'Debe llenar este campo',
      email: formData.email ? validateField('email', formData.email) : 'Debe llenar este campo',
      countryCode: formData.countryCode ? validateField('countryCode', formData.countryCode) : 'Debe llenar este campo',
      phoneNumber: formData.phoneNumber ? validateField('phoneNumber', formData.phoneNumber) : 'Debe llenar este campo',
      password: formData.password ? validateField('password', formData.password) : 'Debe llenar este campo',
      confirmPassword: formData.confirmPassword ? validateField('confirmPassword', formData.confirmPassword) : 'Debe llenar este campo'
    };

    setErrors(newErrors);

    // Verificar si hay algún error
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    
    if (hasErrors) {
      return;
    }

    // Registro exitoso
    setMessage({ type: 'success', text: '¡Aspirante registrado exitosamente!' });
    
    setTimeout(() => {
      onRegisterSuccess();
    }, 2000);
  };

  return (
    <div 
      className="h-full flex flex-col relative"
      style={{
        background: 'linear-gradient(180deg, #EEF4FF 0%, #FFFFFF 100%)'
      }}
    >
      {/* Botón de flecha para volver */}
      <motion.button
        onClick={onBack}
        className="absolute top-6 left-6 z-20 p-2 rounded-full hover:bg-gray-100 transition-colors"
        style={{ 
          color: '#1E3A8A'
        }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <ArrowLeft size={28} strokeWidth={2.5} />
      </motion.button>

      {/* Logo de Propósitos Colombia - más grande */}
      <motion.div 
        className="absolute top-4 right-4 z-10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <img 
          src={propositosLogo} 
          alt="Fundación Propósitos Colombia" 
          className="h-32 w-auto"
        />
      </motion.div>

      {/* Logo de Swallow */}
      <motion.div 
        className="flex flex-col items-center"
        style={{ marginTop: '40px' }}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <img 
          src={swallowLogo} 
          alt="Swallow" 
          className="object-contain"
          style={{ 
            height: '80px',
            width: 'auto',
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))' 
          }}
        />
        <div 
          style={{ 
            backgroundColor: '#1A43FF',
            color: '#FFFFFF',
            borderRadius: '20px',
            paddingLeft: '20px',
            paddingRight: '20px',
            paddingTop: '8px',
            paddingBottom: '8px',
            marginTop: '16px',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '14px',
            fontWeight: 600
          }}
        >
          Registro de Aspirante
        </div>
      </motion.div>

      {/* Formulario */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto" style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Nombre */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            <div 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
              style={{ color: '#1E3A8A' }}
            >
              <User size={20} />
            </div>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              onBlur={() => handleBlur('firstName')}
              placeholder="Primer nombre"
              className="w-full pl-12 pr-4 focus:outline-none"
              style={{ 
                background: '#FFFFFF',
                border: `2px solid ${errors.firstName ? '#FF4747' : '#1A43FF'}`,
                borderRadius: '12px',
                height: '56px',
                padding: '16px',
                paddingLeft: '48px',
                color: '#374151',
                fontFamily: 'Montserrat, sans-serif'
              }}
            />
            {errors.firstName && (
              <p className="text-sm mt-1" style={{ color: '#FF4747', fontFamily: 'Montserrat, sans-serif' }}>
                {errors.firstName}
              </p>
            )}
          </motion.div>

          {/* Apellido */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative"
          >
            <div 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
              style={{ color: '#1A43FF' }}
            >
              <User size={20} />
            </div>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              onBlur={() => handleBlur('lastName')}
              placeholder="Primer apellido"
              className="w-full focus:outline-none"
              style={{ 
                background: '#FFFFFF',
                border: `2px solid ${errors.lastName ? '#FF4747' : '#1A43FF'}`,
                borderRadius: '12px',
                height: '56px',
                padding: '16px',
                paddingLeft: '48px',
                color: '#374151',
                fontFamily: 'Montserrat, sans-serif'
              }}
            />
            {errors.lastName && (
              <p className="text-sm mt-1" style={{ color: '#FF4747', fontFamily: 'Montserrat, sans-serif' }}>
                {errors.lastName}
              </p>
            )}
          </motion.div>

          {/* Tipo de Documento y Número */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex gap-3"
          >
            {/* Selector de Tipo de Documento */}
            <div className="relative flex-1">
              <div 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
                style={{ color: '#1A43FF' }}
              >
                <IdCard size={20} />
              </div>
              <select
                value={formData.documentType}
                onChange={(e) => {
                  handleInputChange('documentType', e.target.value);
                  if (e.target.value) {
                    setErrors(prev => ({ ...prev, documentType: '' }));
                  }
                }}
                onBlur={handleDocumentTypeBlur}
                className="w-full focus:outline-none appearance-none"
                style={{ 
                  background: '#FFFFFF',
                  border: `2px solid ${errors.documentType ? '#FF4747' : '#1A43FF'}`,
                  borderRadius: '12px',
                  height: '56px',
                  padding: '16px',
                  paddingLeft: '48px',
                  color: formData.documentType ? '#374151' : '#9CA3AF',
                  fontFamily: 'Montserrat, sans-serif'
                }}
              >
                <option value="" disabled>Tipo de doc.</option>
                <option value="CC">CC</option>
                <option value="CE">CE</option>
                <option value="TI">TI</option>
                <option value="PP">PP</option>
              </select>
            </div>

            {/* Campo de Número de Documento */}
            <div className="relative flex-[2]">
              <input
                type="text"
                value={formData.cedula}
                onChange={(e) => handleInputChange('cedula', e.target.value)}
                onBlur={() => handleBlur('cedula')}
                placeholder="Número de documento"
                className="w-full focus:outline-none"
                style={{ 
                  background: '#FFFFFF',
                  border: `2px solid ${errors.cedula ? '#FF4747' : '#1A43FF'}`,
                  borderRadius: '12px',
                  height: '56px',
                  padding: '16px',
                  color: '#374151',
                  fontFamily: 'Montserrat, sans-serif'
                }}
              />
            </div>
          </motion.div>
          {/* Mensajes de error para tipo de documento y número */}
          {(errors.documentType || errors.cedula) && (
            <div className="-mt-2" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {errors.documentType && (
                <p className="text-sm" style={{ color: '#FF4747', fontFamily: 'Montserrat, sans-serif' }}>
                  {errors.documentType}
                </p>
              )}
              {errors.cedula && (
                <p className="text-sm" style={{ color: '#FF4747', fontFamily: 'Montserrat, sans-serif' }}>
                  {errors.cedula}
                </p>
              )}
            </div>
          )}

          {/* Prefijo/Código de País y Número de Teléfono */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="flex gap-3"
          >
            {/* Prefijo/Código de País */}
            <div className="relative flex-1">
              <div 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
                style={{ color: '#1A43FF' }}
              >
                <Phone size={20} />
              </div>
              <input
                type="text"
                value={formData.countryCode}
                onChange={(e) => handleInputChange('countryCode', e.target.value)}
                onBlur={() => handleBlur('countryCode')}
                placeholder="+57"
                className="w-full focus:outline-none"
                style={{ 
                  background: '#FFFFFF',
                  border: `2px solid ${errors.countryCode ? '#FF4747' : '#1A43FF'}`,
                  borderRadius: '12px',
                  height: '56px',
                  padding: '16px',
                  paddingLeft: '48px',
                  color: '#374151',
                  fontFamily: 'Montserrat, sans-serif'
                }}
              />
            </div>

            {/* Campo de Número de Teléfono */}
            <div className="relative flex-[2]">
              <input
                type="text"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                onBlur={() => handleBlur('phoneNumber')}
                placeholder="Número de teléfono"
                className="w-full focus:outline-none"
                style={{ 
                  background: '#FFFFFF',
                  border: `2px solid ${errors.phoneNumber ? '#FF4747' : '#1A43FF'}`,
                  borderRadius: '12px',
                  height: '56px',
                  padding: '16px',
                  color: '#374151',
                  fontFamily: 'Montserrat, sans-serif'
                }}
              />
            </div>
          </motion.div>
          {(errors.countryCode || errors.phoneNumber) && (
            <div className="-mt-2">
              {errors.countryCode && (
                <p className="text-sm" style={{ color: '#FF4747', fontFamily: 'Montserrat, sans-serif' }}>
                  {errors.countryCode}
                </p>
              )}
              {errors.phoneNumber && (
                <p className="text-sm" style={{ color: '#FF4747', fontFamily: 'Montserrat, sans-serif' }}>
                  {errors.phoneNumber}
                </p>
              )}
            </div>
          )}

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="relative"
          >
            <div 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
              style={{ color: '#1A43FF' }}
            >
              <Mail size={20} />
            </div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="Correo electrónico"
              className="w-full focus:outline-none"
              style={{ 
                background: '#FFFFFF',
                border: `2px solid ${errors.email ? '#FF4747' : '#1A43FF'}`,
                borderRadius: '12px',
                height: '56px',
                padding: '16px',
                paddingLeft: '48px',
                color: '#374151',
                fontFamily: 'Montserrat, sans-serif'
              }}
            />
            {errors.email && (
              <p className="text-sm mt-1" style={{ color: '#FF4747', fontFamily: 'Montserrat, sans-serif' }}>
                {errors.email}
              </p>
            )}
          </motion.div>

          {/* Contraseña */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="relative"
          >
            <div 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
              style={{ color: '#1A43FF' }}
            >
              <Lock size={20} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              placeholder="Contraseña"
              className="w-full focus:outline-none"
              style={{ 
                background: '#FFFFFF',
                border: `2px solid ${errors.password ? '#FF4747' : '#1A43FF'}`,
                borderRadius: '12px',
                height: '56px',
                padding: '16px',
                paddingLeft: '48px',
                paddingRight: '48px',
                color: '#374151',
                fontFamily: 'Montserrat, sans-serif'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              style={{ color: '#9CA3AF' }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && (
              <p className="text-sm mt-1" style={{ color: '#FF4747', fontFamily: 'Montserrat, sans-serif' }}>
                {errors.password}
              </p>
            )}
          </motion.div>

          {/* Confirmar Contraseña */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="relative"
          >
            <div 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
              style={{ color: '#1A43FF' }}
            >
              <Lock size={20} />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              onBlur={() => handleBlur('confirmPassword')}
              placeholder="Confirmar contraseña"
              className="w-full focus:outline-none"
              style={{ 
                background: '#FFFFFF',
                border: `2px solid ${errors.confirmPassword ? '#FF4747' : '#1A43FF'}`,
                borderRadius: '12px',
                height: '56px',
                padding: '16px',
                paddingLeft: '48px',
                paddingRight: '48px',
                color: '#374151',
                fontFamily: 'Montserrat, sans-serif'
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              style={{ color: '#9CA3AF' }}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.confirmPassword && (
              <p className="text-sm mt-1" style={{ color: '#FF4747', fontFamily: 'Montserrat, sans-serif' }}>
                {errors.confirmPassword}
              </p>
            )}
          </motion.div>

          {/* Mensaje */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-center text-sm p-2 rounded ${
                message.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
              }`}
            >
              {message.text}
            </motion.div>
          )}

          {/* Botón de registro */}
          <motion.button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className="w-full transition-all text-center"
            style={{
              backgroundColor: isFormValid() ? '#1A43FF' : '#9CA3AF',
              color: '#FFFFFF',
              height: '56px',
              border: 'none',
              borderRadius: '12px',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600,
              fontSize: '16px',
              boxShadow: isFormValid() 
                ? '0px 4px 12px rgba(26, 67, 255, 0.4)'
                : '0px 4px 12px rgba(156, 163, 175, 0.25)',
              cursor: isFormValid() ? 'pointer' : 'not-allowed',
              marginBottom: '24px'
            }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            Registrarme como Aspirante
          </motion.button>
        </div>
      </div>

      {/* Footer con referencia a Propósitos Colombia */}
      <motion.div 
        className="px-6 py-3 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <div className="flex flex-col items-center justify-center gap-1">
          <span style={{ 
            color: '#9CA3AF', 
            fontSize: '11px', 
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 'normal'
          }}>
            Haz clic 
            <a 
              href="https://propositos.org.co" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: '#1A43FF', 
                textDecoration: 'underline',
                fontWeight: 'normal'
              }}
            >
              aquí
            </a>
            {' '}para saber más de
          </span>
          <span style={{ 
            color: '#9CA3AF', 
            fontSize: '11px', 
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 'normal'
          }}>
            Propósitos Colombia
          </span>
        </div>
      </motion.div>

    </div>
  );
}
