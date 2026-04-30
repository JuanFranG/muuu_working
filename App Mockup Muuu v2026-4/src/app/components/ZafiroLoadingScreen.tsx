import { motion } from 'motion/react';

import swallowLogo from 'figma:asset/9ebfd23cb16475a09766881a0f181c6d6cd7681b.png';

export function ZafiroLoadingScreen() {
  return (
    <div 
      className="h-full relative"
      style={{
        background: 'linear-gradient(180deg, #EEF4FF 0%, #FFFFFF 100%)'
      }}
    >


      {/* Contenido central */}
      <div className="h-full flex flex-col items-center justify-center">
        {/* Logo de Swallow con texto */}
        <motion.div 
          className="mb-8 flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Aumentado en 300% - era w-64 h-64, ahora w-80 h-80 */}
          <div className="relative">
            <img 
              src={swallowLogo} 
              alt="Swallow" 
              className="w-80 h-80 mb-4"
              style={{ 
                filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15))'
              }}
            />
            {/* Detalle amarillo dorado */}
            <div 
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full animate-pulse"
              style={{ backgroundColor: '#F59E0B' }}
            ></div>
          </div>
          <h1 className="text-7xl font-bold mb-4 relative z-10 -mt-8" style={{ 
            color: '#374151',
            fontFamily: 'Montserrat, sans-serif',
            textShadow: '0 2px 4px rgba(245, 158, 11, 0.3)'
          }}>Swallow</h1>
          
          {/* Eslogan debajo del logo */}
          <motion.p 
            className="text-lg text-center px-6 leading-relaxed relative"
            style={{ 
              color: '#374151',
              fontFamily: 'Merriweather, serif'
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            De gemas en bruto, a profesionales con 
            <span style={{ color: '#F59E0B', fontWeight: 'bold' }}> fruto</span>.
            {/* Pequeño detalle dorado debajo */}
            <div 
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-0.5"
              style={{ backgroundColor: '#F59E0B' }}
            ></div>
          </motion.p>
        </motion.div>

        {/* Indicador de carga - Barra de progreso suave */}
        <motion.div
          className="w-64 h-3 rounded-full overflow-hidden relative"
          style={{ backgroundColor: '#E5E7EB', border: '1px solid #F59E0B' }}
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 256 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.div
            className="h-full rounded-full relative"
            style={{ 
              background: 'linear-gradient(90deg, #1E3A8A 0%, #1E3A8A 80%, #F59E0B 100%)'
            }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ 
              duration: 2.2, 
              delay: 1.0,
              ease: "easeInOut"
            }}
          />
          {/* Pequeño indicador dorado que se mueve */}
          <motion.div
            className="absolute top-0 right-0 w-1 h-full"
            style={{ backgroundColor: '#F59E0B' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ 
              duration: 1, 
              delay: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div 
        className="absolute bottom-4 left-0 right-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.5 }}
      >
        <div className="text-center">
          <p className="text-xs" style={{ 
            color: '#9CA3AF',
            fontFamily: 'Montserrat, sans-serif'
          }}>
            Powered by @CIEUnimagdalena-2025
          </p>
        </div>
      </motion.div>
    </div>
  );
}