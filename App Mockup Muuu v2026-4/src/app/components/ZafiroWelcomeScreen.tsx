import { motion } from 'motion/react';

import zafiroLogo from 'figma:asset/0dda94d83a5c53fcdb3d69635fedad8d14b26c69.png';

export function ZafiroWelcomeScreen({ onCreateAccount, onSignIn }: { 
  onCreateAccount: () => void;
  onSignIn: () => void;
}) {
  return (
    <div 
      className="h-full relative"
      style={{ backgroundColor: '#CBE6F7' }}
    >
      {/* Logo de Propósitos Colombia en esquina superior derecha */}
      <motion.div 
        className="absolute top-4 right-4 z-10"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <img 
          src={propositosLogo} 
          alt="Fundación Propósitos Colombia" 
          className="h-24 w-auto"
        />
      </motion.div>

      {/* Contenido central */}
      <div className="h-full flex flex-col items-center justify-center px-8">
        {/* Logo de Zafiro con texto */}
        <motion.div 
          className="mb-8 flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.img 
            src={zafiroLogo} 
            alt="Zafiro" 
            className="w-80 h-80 -mb-8"
            style={{ 
              filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.15))'
            }}
            initial={{ rotate: -10, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
          <motion.h1 
            className="text-6xl font-bold text-blue-800 relative z-10"
            style={{ marginTop: '-1rem' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Zafiro
          </motion.h1>
        </motion.div>

        {/* Botones de autenticación */}
        <motion.div 
          className="w-full max-w-xs space-y-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          {/* Botón Crear cuenta - rojo magenta con letras blancas */}
          <motion.button
            onClick={onCreateAccount}
            className="w-full py-4 px-6 rounded-lg shadow-lg hover:opacity-90 transition-all duration-200 font-medium text-lg text-white hover:scale-105"
            style={{ backgroundColor: '#DC143C' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            Crear cuenta
          </motion.button>

          {/* Botón Iniciar sesión - mismo tono rojo con letras blancas */}
          <motion.button
            onClick={onSignIn}
            className="w-full py-4 px-6 rounded-lg shadow-lg hover:opacity-90 transition-all duration-200 font-medium text-lg text-white hover:scale-105"
            style={{ backgroundColor: '#DC143C' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.4 }}
          >
            Iniciar sesión
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
        >
          <p className="text-blue-800 text-sm px-4 leading-relaxed">
            De gemas en bruto, a profesionales con fruto.
            <br />
            Empleabilidad hecha oportunidad.
          </p>
        </motion.div>
      </div>
    </div>
  );
}