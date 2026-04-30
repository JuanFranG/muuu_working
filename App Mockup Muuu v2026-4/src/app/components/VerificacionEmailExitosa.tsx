import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import swallowBirdLogo from 'figma:asset/9ebfd23cb16475a09766881a0f181c6d6cd7681b.png';

interface VerificacionEmailExitosaProps {
  email: string;
  onContinuarPerfil: () => void;
}

export function VerificacionEmailExitosa({ 
  email, 
  onContinuarPerfil 
}: VerificacionEmailExitosaProps) {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Countdown para auto-redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          onContinuarPerfil();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onContinuarPerfil]);

  return (
    <div 
      className="h-full w-full relative flex flex-col"
      style={{ background: '#FFFFFF' }}
    >
      {/* Content Container - Layout reorganizado sin solapamientos */}
      <div className="flex-1 flex flex-col px-6 py-8">
        {/* Sección Superior - Logo y Título */}
        <div className="flex flex-col items-center mb-8">
          {/* Logo Swallow */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="w-20 h-20">
              <ImageWithFallback 
                src={swallowBirdLogo} 
                alt="Swallow" 
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>

          {/* Título Principal */}
          <motion.h1 
            className="text-center mb-4"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 'bold',
              fontSize: '24px',
              color: '#16A34A',
              margin: 0
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            ¡Email verificado!
          </motion.h1>

          {/* Ícono Central - Checkmark Verde */}
          <motion.div 
            className="flex items-center justify-center mb-6"
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#16A34A',
              borderRadius: '50%',
              boxShadow: '0px 4px 8px rgba(0,0,0,0.1)'
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <CheckCircle size={40} color="#FFFFFF" />
          </motion.div>
        </div>

        {/* Sección Central - Información del Email */}
        <div className="flex flex-col items-center mb-8">
          {/* Texto de Éxito */}
          <motion.div 
            className="text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <p style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '16px',
              color: '#666666',
              margin: 0,
              maxWidth: '300px',
              lineHeight: '1.5'
            }}>
              Tu correo electrónico ha sido<br />verificado exitosamente
            </p>
          </motion.div>

          {/* Email con status verificado */}
          <motion.div 
            className="text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <p style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 'bold',
              fontSize: '16px',
              color: '#2B5A9E',
              margin: '0 0 8px 0'
            }}>
              {email}
            </p>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}>
              <CheckCircle size={16} color="#16A34A" />
              <span style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: '500',
                fontSize: '14px',
                color: '#16A34A',
                margin: 0
              }}>
                Verificado
              </span>
            </div>
          </motion.div>

          {/* Texto de beneficios */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <p style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '14px',
              color: '#666666',
              margin: 0,
              maxWidth: '280px',
              lineHeight: '1.4',
              textAlign: 'center'
            }}>
              Ahora podrás recibir notificaciones<br />importantes sobre tu perfil<br />y oportunidades laborales
            </p>
          </motion.div>
        </div>

        {/* Sección Inferior - Botón y Countdown */}
        <div className="flex flex-col items-center mt-auto">
          {/* Botón Principal */}
          <motion.button
            onClick={onContinuarPerfil}
            className="transition-all duration-300 hover:scale-105 active:scale-95 mb-4 flex items-center justify-center"
            style={{
              height: '50px',
              borderRadius: '25px',
              border: 'none',
              backgroundColor: '#16A34A',
              color: '#FFFFFF',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: 'pointer',
              width: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            Continuar al perfil
          </motion.button>

          {/* Auto-redirect countdown */}
          <motion.div 
            className="text-center mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            <p style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '12px',
              color: '#999999',
              margin: 0
            }}>
              Auto-redirect en {countdown} segundos...
            </p>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.div 
        className="text-center pb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.8 }}
      >
        <p style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '10px',
          color: '#999999',
          margin: 0
        }}>
          Powered by @CIEUniMagdalena-2025
        </p>
      </motion.div>

      {/* Botones invisibles para navegación rápida */}
      {/* Esquina inferior izquierda - Continuar al perfil */}
      <div 
        className="absolute bottom-0 left-0 w-16 h-16 z-20 cursor-pointer"
        onDoubleClick={onContinuarPerfil}
        style={{ background: 'transparent' }}
      />

      {/* Esquina inferior derecha - Continuar inmediatamente */}
      <div 
        className="absolute bottom-0 right-0 w-16 h-16 z-20 cursor-pointer"
        onClick={onContinuarPerfil}
        style={{ background: 'transparent' }}
      />
    </div>
  );
}