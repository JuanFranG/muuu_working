import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import zafiroLogo from 'figma:asset/0dda94d83a5c53fcdb3d69635fedad8d14b26c69.png';


interface ZafiroAccountActionScreenProps {
  onActionSelected: (action: 'signIn' | 'createAccount') => void;
}

export function ZafiroAccountActionScreen({ onActionSelected }: ZafiroAccountActionScreenProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Activar la animación de despliegue desde la esquina superior izquierda
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleActionSelection = (action: 'signIn' | 'createAccount') => {
    onActionSelected(action);
  };

  const handlePropositosClick = () => {
    window.open('https://www.instagram.com/propositoscolombia/', '_blank');
  };

  return (
    <div 
      className="h-full relative"
      style={{
        background: 'linear-gradient(to bottom, rgb(135, 206, 235), rgb(255, 255, 255))'
      }}
    >


      {/* Cuenta Text - Top Center */}
      <motion.div 
        className="absolute top-6 left-0 right-0 z-10"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h1 className="text-[#1e3a8a] text-3xl font-bold text-center">
          Cuenta
        </h1>
      </motion.div>

      {/* Main Content Container */}
      <div className="h-full flex flex-col items-center justify-start pt-24">
        {/* Logo de Zafiro con texto - igual que en login */}
        <motion.div 
          className="flex flex-col items-center mb-4"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <img 
            src={zafiroLogo} 
            alt="Zafiro" 
            className="w-60 h-60"
            style={{ 
              filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.15))' 
            }}
          />
          <h1 className="text-4xl font-bold text-blue-800 -mt-8">
            Zafiro
          </h1>
        </motion.div>

        {/* Question Text */}
        <motion.p 
          className="text-[#1e3a8a] text-lg mb-6 text-center font-medium"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          ¿qué deseo hacer?
        </motion.p>

        {/* Action Selection Buttons */}
        <motion.div 
          className="w-full max-w-xs space-y-4"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <button
            onClick={() => handleActionSelection('signIn')}
            className="w-full bg-[#DC143C] text-white py-6 px-8 rounded-xl shadow-lg hover:bg-[#B91C3C] transition-colors duration-200 active:scale-95 transform text-2xl font-bold text-center"
          >
            Iniciar Sesión
          </button>

          <button
            onClick={() => handleActionSelection('createAccount')}
            className="w-full bg-[#DC143C] text-white py-6 px-8 rounded-xl shadow-lg hover:bg-[#B91C3C] transition-colors duration-200 active:scale-95 transform text-2xl font-bold text-center"
          >
            Crear cuenta
          </button>
        </motion.div>
      </div>

      {/* Footer with Propósitos Colombia link */}
      <motion.div 
        className="absolute bottom-4 left-0 right-0"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >

        <p className="text-center text-gray-600 text-xs">
          Powered by CIU UniMagdalena, 2025
        </p>
      </motion.div>
    </div>
  );
}