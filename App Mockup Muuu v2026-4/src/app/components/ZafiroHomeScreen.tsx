import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import swallowLogo from 'figma:asset/00240fda12245f7d7a725e6fa602b5499ea4a363.png';

interface ZafiroHomeScreenProps {
  onLoginClick: () => void;
  onCreateAccountClick: () => void;
  onZoneNavigation?: (direction: 'left' | 'right') => void;
}

export function ZafiroHomeScreen({ onLoginClick, onCreateAccountClick, onZoneNavigation }: ZafiroHomeScreenProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Activar la animación de despliegue desde la esquina superior izquierda
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handlePropositosClick = () => {
    window.open('https://www.jcdnconsulting.com/propositos-colombia?fbclid=PAb21jcAMwt-9leHRuA2FlbQIxMQABpx3BkfjwPPmXSi2ukuu8T0s3xdZfzzmxlMegs1v_CG1rxk4DqtTtUrW3UwAV_aem_d_6gWonGPkfU_6esVPCERw', '_blank');
  };

  return (
    <div 
      className="h-full relative"
      style={{
        background: 'linear-gradient(180deg, #EEF4FF 0%, #FFFFFF 100%)'
      }}
    >


      {/* Main Content Container */}
      <div className="h-full flex flex-col items-center justify-center px-6 pb-20">
        {/* Logo de Swallow con eslogan */}
        <motion.div 
          className="flex flex-col items-center mb-12"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="mb-6">
            <img 
              src={swallowLogo} 
              alt="Swallow" 
              className="w-80 h-80 object-contain"
              style={{ 
                filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15))' 
              }}
            />
          </div>
          {/* Eslogan debajo del logo */}
          <p 
            className="text-xl text-center font-medium"
            style={{ 
              color: '#374151',
              fontFamily: 'Montserrat, sans-serif'
            }}
          >
            Volando hacia nuevas oportunidades
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="w-full max-w-sm space-y-4"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {/* Botón 1 - PRIMARIO "Iniciar Sesión" */}
          <button
            onClick={onLoginClick}
            className="w-full transition-all duration-200 text-center group mx-auto block"
            style={{ 
              width: '280px',
              height: '50px',
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: '#1A43FF',
              color: '#FFFFFF',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600,
              fontSize: '18px',
              border: 'none',
              boxShadow: '0px 4px 12px rgba(26, 67, 255, 0.35)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#0028E6';
              e.currentTarget.style.boxShadow = '0px 6px 14px rgba(26, 67, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1A43FF';
              e.currentTarget.style.boxShadow = '0px 4px 12px rgba(26, 67, 255, 0.35)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.boxShadow = '0px 2px 6px rgba(26, 67, 255, 0.35)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.backgroundColor = '#0028E6';
              e.currentTarget.style.boxShadow = '0px 6px 14px rgba(26, 67, 255, 0.4)';
            }}
          >
            Iniciar Sesión
          </button>

          {/* Botón 2 - SECUNDARIO "Crear Cuenta" */}
          <button
            onClick={onCreateAccountClick}
            className="w-full transition-all duration-200 text-center group mx-auto block"
            style={{ 
              width: '280px',
              height: '50px',
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: '#FFFFFF',
              color: '#1A43FF',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600,
              fontSize: '18px',
              border: '2px solid #1A43FF',
              boxShadow: '0px 2px 8px rgba(26, 67, 255, 0.2)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F0F4FF';
              e.currentTarget.style.boxShadow = '0px 3px 10px rgba(26, 67, 255, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.boxShadow = '0px 2px 8px rgba(26, 67, 255, 0.2)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.boxShadow = '0px 1px 4px rgba(26, 117, 215, 0.2)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.backgroundColor = '#F0F7FF';
              e.currentTarget.style.boxShadow = '0px 3px 10px rgba(26, 117, 215, 0.25)';
            }}
          >
            Crear Cuenta
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
        <div className="text-center space-y-1">
          <p className="text-xs" style={{ 
            color: '#9CA3AF',
            fontFamily: 'Montserrat, sans-serif'
          }}>
            Haz clic <button 
              onClick={handlePropositosClick}
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
            color: '#9CA3AF',
            fontFamily: 'Montserrat, sans-serif'
          }}>
            Propósitos Colombia
          </p>
        </div>
      </motion.div>

      {/* Zonas invisibles para navegación por deslizamiento */}
      {onZoneNavigation && (
        <>
          <div className="absolute bottom-0 left-0 w-1/2 h-16 z-20" 
               onClick={() => onZoneNavigation('left')}
               style={{ background: 'transparent' }}
          />
          <div className="absolute bottom-0 right-0 w-1/2 h-16 z-20" 
               onClick={() => onZoneNavigation('right')}
               style={{ background: 'transparent' }}
          />
        </>
      )}
    </div>
  );
}