import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import zafiroLogo from 'figma:asset/0dda94d83a5c53fcdb3d69635fedad8d14b26c69.png';


interface ZafiroNewLoadingScreenProps {
  onLoadingComplete: () => void;
}

export function ZafiroNewLoadingScreen({ onLoadingComplete }: ZafiroNewLoadingScreenProps) {
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    // Mostrar el logo inmediatamente
    setShowLogo(true);

    // Completar la carga después de 3 segundos
    const timer = setTimeout(() => {
      onLoadingComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <div 
      className="h-full flex flex-col relative"
      style={{ backgroundColor: '#CBE6F7' }}
    >


      {/* Main content - Centered Zafiro logo with animation */}
      <div className="flex-1 flex items-center justify-center">
        {showLogo && (
          <motion.div
            initial={{ x: '100vw', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 2.5,
              ease: [0.25, 0.25, 0.25, 1], // Smooth gliding animation
              opacity: { duration: 0.3 }
            }}
            className="flex items-center justify-center"
          >
            <img 
              src={zafiroLogo} 
              alt="Zafiro" 
              className="w-40 h-40"
              style={{ 
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
                maxWidth: '50%',
                width: 'clamp(120px, 45vw, 160px)'
              }}
            />
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="pb-8 px-6">
        <p 
          className="text-center"
          style={{ 
            fontSize: '13px',
            color: '#666666',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          Powered by @CIEUniMagdalena - 2025
        </p>
      </div>
    </div>
  );
}