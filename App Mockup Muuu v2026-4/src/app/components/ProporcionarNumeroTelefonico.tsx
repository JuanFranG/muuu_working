import { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

import swallowLogo from 'figma:asset/b2e47e5361c5962f41d61459b0ba5a36338dcbbb.png';

interface ProporcionarNumeroTelefonicoProps {
  onBack: () => void;
  onContinue: (phoneData: { prefix: string; number: string }) => void;
  userType: 'candidate' | 'company';
}

export function ProporcionarNumeroTelefonico({ 
  onBack, 
  onContinue, 
  userType 
}: ProporcionarNumeroTelefonicoProps) {
  const [phoneData, setPhoneData] = useState({
    prefix: '+57',
    number: ''
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [phoneError, setPhoneError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setPhoneData(prev => ({ ...prev, [field]: value }));
    if (message) setMessage(null);
    if (phoneError) setPhoneError('');
  };

  const validatePhoneNumber = (number: string) => {
    // Validar que solo contenga números
    const hasInvalidChars = /[^\d]/.test(number);
    if (hasInvalidChars) {
      return 'Número de teléfono inválido';
    }

    // Validar que tenga exactamente 10 dígitos
    if (number.length !== 10) {
      return 'Número de teléfono inválido';
    }

    return '';
  };

  const isFormValid = () => {
    return phoneData.prefix && phoneData.number && validatePhoneNumber(phoneData.number) === '';
  };

  const handleSubmit = () => {
    // Validar si el campo está vacío
    if (!phoneData.number.trim()) {
      setPhoneError('Debes ingresar tu número telefónico');
      return;
    }

    // Validar el número de teléfono
    const phoneValidationError = validatePhoneNumber(phoneData.number);
    if (phoneValidationError) {
      setPhoneError(phoneValidationError);
      return;
    }

    if (!isFormValid()) {
      setMessage({ type: 'error', text: 'Por favor completa todos los campos' });
      return;
    }

    onContinue(phoneData);
  };

  // Paleta de colores según tipo de usuario
  const colors = userType === 'candidate' 
    ? {
        primary: '#1E3A8A',
        secondary: '#87CEEB',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)',
        borderColor: '#1E3A8A',
        buttonGradient: 'linear-gradient(135deg, #87CEEB 0%, #6BB6E6 100%)',
        shadow: 'rgba(30, 58, 138, 0.25)'
      }
    : {
        primary: '#F59E0B',
        secondary: '#F59E0B',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #FEF9E7 100%)',
        borderColor: '#F59E0B',
        buttonGradient: 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)',
        shadow: 'rgba(245, 158, 11, 0.25)'
      };

  return (
    <div 
      className="h-full flex flex-col relative"
      style={{ background: colors.background }}
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

      {/* Header con logo y título */}
      <motion.div 
        className="flex flex-col items-center pt-8 pb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="relative mb-4">
          <ImageWithFallback 
            src={swallowLogo} 
            alt="Swallow" 
            className="w-32 h-32 object-contain"
            style={{ 
              filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15))' 
            }}
          />
        </div>
        
        <h1 
          className="text-2xl font-bold mb-2" 
          style={{ 
            color: '#374151',
            fontFamily: 'Montserrat, sans-serif',
            textShadow: `0 2px 4px ${colors.shadow}`
          }}
        >
          Swallow
        </h1>
        
        <p 
          className="text-sm mb-4" 
          style={{ 
            color: '#374151',
            fontFamily: 'Montserrat, sans-serif'
          }}
        >
          Volando hacia nuevas oportunidades
        </p>
      </motion.div>

      {/* Contenido principal */}
      <div className="flex-1 px-6 pb-6 flex flex-col">
        {/* Pregunta principal */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 
            className="text-xl font-bold mb-2"
            style={{
              color: colors.primary,
              fontFamily: 'Montserrat, sans-serif'
            }}
          >
            ¿Puedes darnos tu número telefónico?
          </h2>
          <p 
            className="text-sm"
            style={{
              color: '#666666',
              fontFamily: 'Montserrat, sans-serif',
              lineHeight: '1.5'
            }}
          >
            Te ayudará a recibir notificaciones importantes<br />
            y mantener tu cuenta segura
          </p>
        </motion.div>

        {/* Formulario de teléfono */}
        <div className="space-y-6 mb-8" style={{ marginBottom: phoneError ? '3rem' : '2rem' }}>
          {/* Campos de prefijo y número */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex gap-3"
          >
            {/* Prefijo */}
            <div className="relative flex-1">
              <div 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
                style={{ color: colors.primary }}
              >
                <Phone size={20} />
              </div>
              <select
                value={phoneData.prefix}
                onChange={(e) => handleInputChange('prefix', e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 appearance-none"
                style={{ 
                  background: colors.background,
                  border: `1px solid ${colors.borderColor}`,
                  color: '#374151',
                  fontFamily: 'Montserrat, sans-serif',
                  boxShadow: `0 2px 8px ${colors.shadow}`
                }}
              >
                <option value="+57">+57</option>
                <option value="+1">+1</option>
                <option value="+34">+34</option>
                <option value="+52">+52</option>
                <option value="+54">+54</option>
                <option value="+56">+56</option>
                <option value="+51">+51</option>
              </select>
            </div>

            {/* Número de teléfono */}
            <div className="relative flex-[2]">
              <input
                type="tel"
                value={phoneData.number}
                onChange={(e) => {
                  // Solo permitir números
                  const numbersOnly = e.target.value.replace(/\D/g, '');
                  handleInputChange('number', numbersOnly);
                  
                  // Validar en tiempo real
                  if (numbersOnly.length > 0) {
                    const validationError = validatePhoneNumber(numbersOnly);
                    setPhoneError(validationError);
                  } else {
                    setPhoneError('');
                  }
                }}
                placeholder="Número de teléfono"
                className="w-full pl-4 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                style={{ 
                  background: colors.background,
                  border: phoneError ? '1px solid #FF4747' : `1px solid ${colors.borderColor}`,
                  color: '#374151',
                  fontFamily: 'Montserrat, sans-serif',
                  boxShadow: phoneError ? '0 2px 8px rgba(255, 71, 71, 0.25)' : `0 2px 8px ${colors.shadow}`
                }}
                maxLength={10}
              />
              {phoneError && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs mt-1 ml-1 absolute"
                  style={{ 
                    color: '#FF4747',
                    fontFamily: 'Montserrat, sans-serif',
                    top: '100%',
                    left: '0'
                  }}
                >
                  {phoneError}
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* Disclaimer */}
          <motion.div 
            className="text-center px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <p 
              className="text-xs leading-relaxed"
              style={{
                color: '#9CA3AF',
                fontFamily: 'Montserrat, sans-serif',
                lineHeight: '1.4'
              }}
            >
              Se enviará un código de verificación a este número<br />
              para confirmar que es tuyo y mantener tu cuenta segura
            </p>
          </motion.div>

          {/* Mensaje de error */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-center text-sm p-3 rounded ${
                message.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </div>

        {/* Botones */}
        <div className="space-y-4 mt-auto">
          {/* Botón continuar */}
          <motion.button
            onClick={handleSubmit}
            className="w-full rounded-xl transition-all hover:scale-105 text-center"
            style={{
              backgroundColor: userType === 'candidate' ? '#1A43FF' : '#F59E0B',
              color: '#FFFFFF',
              height: '56px',
              borderRadius: '12px',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600,
              fontSize: '16px',
              boxShadow: userType === 'candidate'
                ? '0px 4px 12px rgba(26, 67, 255, 0.4)'
                : '0px 6px 16px rgba(245, 158, 11, 0.5)',
              border: 'none'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            Continuar
          </motion.button>
        </div>
      </div>



      {/* Botones invisibles para navegación rápida */}
      {/* Esquina inferior izquierda - Volver */}
      <div 
        className="absolute bottom-0 left-0 w-16 h-16 z-20 cursor-pointer"
        onDoubleClick={onBack}
        style={{ background: 'transparent' }}
      />

      {/* Esquina inferior derecha - Continuar con datos de prueba */}
      <div 
        className="absolute bottom-0 right-0 w-16 h-16 z-20 cursor-pointer"
        onClick={() => onContinue({ prefix: '+57', number: '3001234567' })}
        style={{ background: 'transparent' }}
      />

      {/* Triple click en logo para bypass */}
      <div 
        className="absolute top-8 left-1/2 transform -translate-x-1/2 w-32 h-32 z-20 cursor-pointer"
        onClick={(e) => {
          if (e.detail === 3) {
            onContinue({ prefix: '+57', number: '3001234567' });
          }
        }}
        style={{ background: 'transparent' }}
      />
    </div>
  );
}