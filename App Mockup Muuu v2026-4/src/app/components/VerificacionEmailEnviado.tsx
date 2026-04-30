import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import swallowBirdLogo from 'figma:asset/9ebfd23cb16475a09766881a0f181c6d6cd7681b.png';


interface VerificacionEmailEnviadoProps {
  email: string;
  onReenviarCorreo: () => void;
  onCambiarEmail: () => void;
  onVolverPerfil: () => void;
  onEmailVerificado?: () => void;
}

export function VerificacionEmailEnviado({ 
  email, 
  onReenviarCorreo, 
  onCambiarEmail, 
  onVolverPerfil,
  onEmailVerificado
}: VerificacionEmailEnviadoProps) {
  const [isReenviando, setIsReenviando] = useState(false);

  const handleReenviar = () => {
    setIsReenviando(true);
    onReenviarCorreo();
    
    // Simular proceso de reenvío
    setTimeout(() => {
      setIsReenviando(false);
    }, 2000);
  };

  return (
    <div 
      className="h-full w-full relative flex flex-col"
      style={{ background: '#FFFFFF' }}
    >
      {/* Header - Logo Swallow en esquina superior izquierda */}
      <motion.div 
        className="absolute top-6 left-6 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <ImageWithFallback 
          src={swallowBirdLogo} 
          alt="Swallow Logo" 
          className="h-24 w-auto object-contain"
        />
      </motion.div>



      {/* Content Container */}
      <div className="flex-1 flex flex-col items-center justify-start px-6 pt-32">
        {/* Título Principal - Más arriba */}
        <motion.h1 
          className="text-center mb-8"
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 'bold',
            fontSize: '28px',
            color: '#2B5A9E',
            lineHeight: '1.2'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Verifica tu correo<br />electrónico
        </motion.h1>

        {/* Ícono Central - Más grande */}
        <motion.div 
          className="flex items-center justify-center mb-8"
          style={{
            width: '100px',
            height: '100px',
            backgroundColor: '#4A90E2',
            borderRadius: '50%',
            boxShadow: '0px 6px 12px rgba(0,0,0,0.15)'
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Mail size={50} color="#FFFFFF" />
        </motion.div>

        {/* Texto Descriptivo - Letras más grandes */}
        <motion.div 
          className="text-center space-y-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '18px',
            color: '#666666',
            margin: 0,
            maxWidth: '320px',
            lineHeight: '1.5'
          }}>
            Te hemos enviado un correo de verificación a:
          </p>
          
          <p style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 'bold',
            fontSize: '20px',
            color: '#2B5A9E',
            margin: 0
          }}>
            {email}
          </p>
          
          <p style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '16px',
            color: '#666666',
            margin: 0,
            maxWidth: '320px',
            lineHeight: '1.5'
          }}>
            Revisa tu bandeja de entrada y haz clic en el enlace para completar la verificación
          </p>
        </motion.div>

        {/* Botones de Acción */}
        <motion.div 
          className="space-y-4 w-full max-w-xs"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          {/* ¿No recibiste el correo? */}
          <p style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '14px',
            color: '#666666',
            textAlign: 'center',
            margin: 0,
            marginBottom: '16px'
          }}>
            ¿No recibiste el correo?
          </p>

          {/* Botón Reenviar correo - Texto subrayado azul */}
          <button
            onClick={handleReenviar}
            disabled={isReenviando}
            className="text-center transition-all duration-300 hover:opacity-80 active:scale-95"
            style={{
              background: 'transparent',
              border: 'none',
              color: isReenviando ? '#999999' : '#4A90E2',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: '500',
              fontSize: '16px',
              cursor: isReenviando ? 'not-allowed' : 'pointer',
              textDecoration: isReenviando ? 'none' : 'underline',
              display: 'block',
              margin: '0 auto'
            }}
          >
            {isReenviando ? 'Reenviando...' : 'Reenviar correo'}
          </button>


        </motion.div>

        {/* Botón Cambiar email */}
        <motion.button
          onClick={onCambiarEmail}
          className="flex items-center justify-center space-x-2 transition-all duration-300 hover:scale-105 active:scale-95 mt-8"
          style={{
            height: '50px',
            borderRadius: '25px',
            border: 'none',
            backgroundColor: '#4A90E2',
            color: '#FFFFFF',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 'bold',
            fontSize: '14px',
            cursor: 'pointer',
            width: '180px',
            margin: '0 auto'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <ArrowLeft size={16} />
          <span>Cambiar email</span>
        </motion.button>
      </div>



      {/* Botones invisibles para navegación rápida */}
      {/* Esquina inferior derecha - Simular email verificado */}
      {onEmailVerificado && (
        <div 
          className="absolute bottom-0 right-0 w-20 h-20 z-20 cursor-pointer"
          onDoubleClick={onEmailVerificado}
          style={{ background: 'transparent' }}
        />
      )}

      {/* Esquina inferior izquierda - Volver al perfil */}
      <div 
        className="absolute bottom-0 left-0 w-16 h-16 z-20 cursor-pointer"
        onDoubleClick={onVolverPerfil}
        style={{ background: 'transparent' }}
      />

      {/* Esquina superior izquierda - Reenviar correo */}
      <div 
        className="absolute top-16 left-0 w-16 h-16 z-20 cursor-pointer"
        onDoubleClick={() => {
          handleReenviar();
        }}
        style={{ background: 'transparent' }}
      />
    </div>
  );
}