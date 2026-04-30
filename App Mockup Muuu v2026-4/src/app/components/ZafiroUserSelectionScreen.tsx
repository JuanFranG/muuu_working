import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Building2, ChevronRight, ArrowLeft } from 'lucide-react';
import swallowLogo from 'figma:asset/00240fda12245f7d7a725e6fa602b5499ea4a363.png';

interface ZafiroUserSelectionScreenProps {
  onUserTypeSelected: (userType: 'company' | 'candidate') => void;
  onBackToHome?: () => void;
}

export function ZafiroUserSelectionScreen({ onUserTypeSelected, onBackToHome }: ZafiroUserSelectionScreenProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Activar la animación de despliegue desde la esquina superior izquierda
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleUserTypeSelection = (userType: 'company' | 'candidate') => {
    onUserTypeSelected(userType);
  };

  const handlePropositosClick = () => {
    window.open('https://www.jcdnconsulting.com/propositos-colombia?fbclid=PAb21jcAMwt-9leHRuA2FlbQIxMQABpx3BkfjwPPmXSi2ukuu8T0s3xdZfzzmxlMegs1v_CG1rxk4DqtTtUrW3UwAV_aem_d_6gWonGPkfU_6esVPCERw', '_blank');
  };

  return (
    <div 
      className="h-full relative flex flex-col"
      style={{
        background: 'linear-gradient(180deg, #EEF4FF 0%, #FFFFFF 100%)'
      }}
    >
      {/* Main Content Container */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
        {/* Logo de Swallow */}
        <motion.div 
          className="flex flex-col items-center mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <img 
            src={swallowLogo} 
            alt="Swallow" 
            className="object-contain mb-2"
            style={{
              maxWidth: '180px',
              height: 'auto'
            }}
          />
        </motion.div>

        {/* Question Text */}
        <motion.h2 
          className="mb-6 text-center"
          style={{ 
            color: '#F8F9FA',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '16px',
            fontWeight: 400
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Antes de empezar, ¿quién soy?
        </motion.h2>

        {/* User Type Selection Cards */}
        <motion.div 
          className="w-full max-w-sm"
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {/* Aspirante Card */}
          <button
            onClick={() => handleUserTypeSelection('candidate')}
            className="transition-all duration-200 hover:scale-[1.02] active:scale-98 transform flex items-center"
            style={{ 
              width: '360px',
              height: '56px',
              padding: '16px',
              gap: '12px',
              borderRadius: '12px',
              backgroundColor: '#FFFFFF',
              border: '2px solid #1A43FF',
              boxShadow: '0px 4px 12px rgba(26, 67, 255, 0.35)',
              fontFamily: 'Montserrat, sans-serif',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div className="flex items-center" style={{ gap: '12px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                backgroundColor: '#1A43FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <User size={24} color="#FFFFFF" strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <p style={{ color: '#1A43FF', fontSize: '16px', fontWeight: 600, margin: 0 }}>
                  Soy Aspirante
                </p>
                <p style={{ color: '#1A43FF', fontSize: '12px', fontWeight: 400, opacity: 0.7, margin: 0 }}>
                  Busco empleo
                </p>
              </div>
            </div>
            <ChevronRight size={20} style={{ color: '#1A43FF' }} />
          </button>

          {/* Empresa Card */}
          <button
            onClick={() => handleUserTypeSelection('company')}
            className="transition-all duration-200 hover:scale-[1.02] active:scale-98 transform flex items-center"
            style={{ 
              width: '360px',
              height: '56px',
              padding: '16px',
              gap: '12px',
              borderRadius: '12px',
              backgroundColor: '#FFFFFF',
              border: '2px solid #F59E0B',
              boxShadow: '0px 4px 12px rgba(245, 158, 11, 0.35)',
              fontFamily: 'Montserrat, sans-serif',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div className="flex items-center" style={{ gap: '12px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                backgroundColor: '#F59E0B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Building2 size={24} color="#FFFFFF" strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <p style={{ color: '#F59E0B', fontSize: '16px', fontWeight: 600, margin: 0 }}>
                  Soy Empresa
                </p>
                <p style={{ color: '#F59E0B', fontSize: '12px', fontWeight: 400, opacity: 0.7, margin: 0 }}>
                  Ofrezco empleo
                </p>
              </div>
            </div>
            <ChevronRight size={20} style={{ color: '#F59E0B' }} />
          </button>
        </motion.div>
      </div>

      {/* Back Button - AL PIE DE LA PANTALLA */}
      <motion.div 
        className="absolute bottom-20 left-0 right-0 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        {onBackToHome && (
          <button
            onClick={onBackToHome}
            className="px-10 py-3 transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#1A43FF',
              border: '2px solid #1A43FF',
              borderRadius: '12px',
              boxShadow: '0px 2px 8px rgba(26, 67, 255, 0.2)',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600
            }}
          >
            Volver
          </button>
        )}
      </motion.div>

      {/* Footer */}
      <motion.div 
        className="absolute bottom-4 left-0 right-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <div className="text-center text-xs leading-tight px-4" style={{ 
          color: '#9CA3AF',
          fontFamily: 'Montserrat, sans-serif'
        }}>
          <span>Haz clic </span>
          <a 
            onClick={handlePropositosClick}
            className="cursor-pointer underline hover:opacity-70 transition-opacity"
            style={{ color: '#9CA3AF' }}
          >
            aquí
          </a>
          <span> para saber más de</span>
          <br />
          <span>Propósitos Colombia</span>
        </div>
      </motion.div>
    </div>
  );
}