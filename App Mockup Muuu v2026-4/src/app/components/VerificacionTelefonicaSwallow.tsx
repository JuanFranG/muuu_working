import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Phone, ArrowLeft } from 'lucide-react';
import swallowLogo from 'figma:asset/b2e47e5361c5962f41d61459b0ba5a36338dcbbb.png';


interface VerificacionTelefonicaSwallowProps {
  phoneNumber?: string;
  onVerificationComplete: (code: string) => void;
  onResendCode: () => void;
  onGoBack?: () => void;
}

export function VerificacionTelefonicaSwallow({ 
  phoneNumber = "+57 300 123 4567",
  onVerificationComplete,
  onResendCode,
  onGoBack
}: VerificacionTelefonicaSwallowProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(40);
  const [isCodeComplete, setIsCodeComplete] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const CORRECT_CODE = '123456';

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const isComplete = code.every(digit => digit !== '');
    setIsCodeComplete(isComplete);
    
    // Reset verification status when code changes
    if (verificationStatus !== 'idle') {
      setVerificationStatus('idle');
    }
  }, [code]);

  const handleCodeChange = (index: number, value: string) => {
    // Solo permitir números
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value.slice(-1); // Solo tomar el último dígito
    setCode(newCode);

    // Auto-focus al siguiente campo
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendCode = () => {
    setCountdown(40);
    setCode(['', '', '', '', '', '']);
    setVerificationStatus('idle');
    setIsCodeComplete(false);
    onResendCode();
  };

  const handleVerifyCode = () => {
    if (!isCodeComplete) return;
    
    setIsVerifying(true);
    const enteredCode = code.join('');
    
    // Simular verificación con delay
    setTimeout(() => {
      if (enteredCode === CORRECT_CODE) {
        setVerificationStatus('success');
        // Esperar un momento para mostrar el estado de éxito antes de continuar
        setTimeout(() => {
          onVerificationComplete(enteredCode);
        }, 1800);
      } else {
        setVerificationStatus('error');
      }
      setIsVerifying(false);
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getInputStyle = (digit: string, index: number) => {
    let borderColor = '#E0E0E0';
    let backgroundColor = '#FFFFFF';
    
    if (digit) {
      backgroundColor = '#F0F7FF';
      borderColor = '#4A90E2';
    }
    
    if (verificationStatus === 'success') {
      borderColor = '#10B981'; // Verde
      backgroundColor = '#ECFDF5';
    } else if (verificationStatus === 'error') {
      borderColor = '#EF4444'; // Rojo
      backgroundColor = '#FEF2F2';
    }
    
    return {
      borderColor,
      backgroundColor
    };
  };

  return (
    <div 
      className="h-full w-full relative flex flex-col px-6 py-8"
      style={{ background: '#FFFFFF' }}
    >
      {/* Botón de flecha para volver */}
      {onGoBack && (
        <motion.button
          onClick={onGoBack}
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
      )}

      {/* Content Container */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        {/* Logo Swallow */}
        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <img 
            src={swallowLogo} 
            alt="Swallow" 
            className="w-32 h-32 object-contain"
          />
        </motion.div>

        {/* Título Principal */}
        <motion.h1 
          className="text-center px-4"
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 'bold',
            fontSize: '20px',
            color: '#2B5A9E'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Verifica tu número de teléfono
        </motion.h1>

        {/* Ícono Central */}
        <motion.div 
          className="flex items-center justify-center"
          style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#4A90E2',
            borderRadius: '50%',
            boxShadow: '0px 4px 8px rgba(0,0,0,0.1)'
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Phone size={32} color="#FFFFFF" />
        </motion.div>

        {/* Texto Descriptivo */}
        <motion.div 
          className="text-center space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '14px',
            color: '#666666',
            margin: 0
          }}>
            Enviamos un código de 6 dígitos a:
          </p>
          <p style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 'bold',
            fontSize: '16px',
            color: '#2B5A9E',
            margin: 0
          }}>
            {phoneNumber}
          </p>
          <p style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '12px',
            color: '#666666',
            margin: 0
          }}>
            Ingresa el código para continuar
          </p>
        </motion.div>

        {/* Campos de Código */}
        <motion.div 
          className="flex justify-center gap-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          {code.map((digit, index) => {
            const inputStyle = getInputStyle(digit, index);
            return (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isVerifying}
                style={{
                  width: '40px',
                  height: '44px',
                  borderRadius: '6px',
                  border: `2px solid ${inputStyle.borderColor}`,
                  backgroundColor: inputStyle.backgroundColor,
                  textAlign: 'center',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 'bold',
                  fontSize: '20px',
                  color: verificationStatus === 'success' ? '#10B981' : 
                         verificationStatus === 'error' ? '#EF4444' : '#2B5A9E',
                  outline: 'none',
                  cursor: isVerifying ? 'not-allowed' : 'text'
                }}
                className="transition-all duration-300 focus:border-[#4A90E2] focus:bg-[#F0F7FF]"
              />
            );
          })}
        </motion.div>

        {/* Botón Principal */}
        <motion.button
          onClick={handleVerifyCode}
          disabled={!isCodeComplete || isVerifying}
          className="w-full max-w-xs transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
          style={{
            height: '44px',
            borderRadius: '22px',
            border: 'none',
            backgroundColor: 
              verificationStatus === 'success' ? '#10B981' :
              verificationStatus === 'error' ? '#EF4444' :
              isCodeComplete && !isVerifying ? '#F5C842' : '#CCCCCC',
            color: '#FFFFFF',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 'bold',
            fontSize: '14px',
            cursor: (isCodeComplete && !isVerifying) ? 'pointer' : 'not-allowed'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          {isVerifying ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Verificando...</span>
            </div>
          ) : verificationStatus === 'success' ? (
            '✓ Código Correcto'
          ) : verificationStatus === 'error' ? (
            '✗ Código Incorrecto'
          ) : (
            'Verificar código'
          )}
        </motion.button>

        {/* Contador de Reenvío y mensajes de estado */}
        <motion.div 
          className="text-center space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          {verificationStatus === 'error' && (
            <p style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '12px',
              color: '#EF4444',
              margin: 0
            }}>
              Código incorrecto. Inténtalo de nuevo.
            </p>
          )}
          
          {verificationStatus === 'success' && (
            <p style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '12px',
              color: '#10B981',
              margin: 0
            }}>
              ¡Código verificado correctamente!
            </p>
          )}
          
          {verificationStatus === 'idle' && (
            countdown > 0 ? (
              <p style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '12px',
                color: '#666666',
                margin: 0
              }}>
                Reenviar código en {formatTime(countdown)}
              </p>
            ) : (
              <button
                onClick={handleResendCode}
                disabled={isVerifying}
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '12px',
                  color: isVerifying ? '#999999' : '#4A90E2',
                  textDecoration: 'underline',
                  cursor: isVerifying ? 'not-allowed' : 'pointer'
                }}
              >
                Reenviar código
              </button>
            )
          )}
          
          {/* Mostrar opción de reenvío cuando hay error - INDEPENDIENTE del timer */}
          {verificationStatus === 'error' && (
            <button
              onClick={handleResendCode}
              disabled={isVerifying}
              style={{
                background: 'none',
                border: 'none',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '12px',
                color: isVerifying ? '#999999' : '#4A90E2',
                textDecoration: 'underline',
                cursor: isVerifying ? 'not-allowed' : 'pointer',
                marginTop: '8px'
              }}
            >
              Reenviar código
            </button>
          )}
        </motion.div>
      </div>



      {/* Botones invisibles para navegación rápida */}
      {/* Esquina inferior izquierda - Volver atrás */}
      {onGoBack && (
        <div 
          className="absolute bottom-0 left-0 w-20 h-20 z-20 cursor-pointer"
          onClick={onGoBack}
          style={{ background: 'transparent' }}
        />
      )}

      {/* Esquina inferior derecha - Continuar con código correcto automáticamente */}
      <div 
        className="absolute bottom-0 right-0 w-20 h-20 z-20 cursor-pointer"
        onDoubleClick={() => {
          setCode(['1', '2', '3', '4', '5', '6']);
          setTimeout(() => {
            onVerificationComplete('123456');
          }, 1000);
        }}
        style={{ background: 'transparent' }}
      />

      {/* Esquina superior izquierda - Reenviar código */}
      <div 
        className="absolute top-0 left-0 w-20 h-20 z-20 cursor-pointer"
        onDoubleClick={handleResendCode}
        style={{ background: 'transparent' }}
      />

      {/* Esquina superior derecha - Forzar verificación exitosa (ya está el logo) */}
      <div 
        className="absolute top-16 right-0 w-16 h-16 z-20 cursor-pointer"
        onDoubleClick={() => {
          if (isCodeComplete) {
            handleVerifyCode();
          }
        }}
        style={{ background: 'transparent' }}
      />
    </div>
  );
}