import { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import propositosLogo from 'figma:asset/306baf54b210403d9d56b873a0c944460dd03166.png';
import swallowLogo from 'figma:asset/9ebfd23cb16475a09766881a0f181c6d6cd7681b.png';

interface ZafiroLoginScreenErrorEmailProps {
  onBack: () => void;
  onLogin: () => void;
  onRegister: () => void;
  userType: 'company' | 'candidate' | null;
}

export function ZafiroLoginScreenErrorEmail({ onBack, onLogin, onRegister, userType }: ZafiroLoginScreenErrorEmailProps) {
  const [email, setEmail] = useState('notfound@example.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const emailError = 'Correo no encontrado';

  const handlePropositosClick = () => {
    window.open('https://www.jcdnconsulting.com/propositos-colombia?fbclid=PAb21jcAMwt-9leHRuA2FlbQIxMQABpx3BkfjwPPmXSi2ukuu8T0s3xdZfzzmxlMegs1v_CG1rxk4DqtTtUrW3UwAV_aem_d_6gWonGPkfU_6esVPCERw', '_blank');
  };

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRegister();
  };

  return (
    <div 
      className="h-full flex flex-col relative"
      style={{
        background: 'linear-gradient(180deg, #EEF4FF 0%, #FFFFFF 100%)'
      }}
    >
        {/* Logo de Propósitos Colombia en esquina superior derecha */}
        <motion.div 
          className="absolute top-4 right-4 z-10"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img 
            src={propositosLogo} 
            alt="Fundación Propósitos Colombia" 
            className="h-32 w-auto"
          />
        </motion.div>

        {/* Logo de Swallow centrado con texto */}
        <motion.div 
          className="flex flex-col items-center pt-8 pb-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative">
            <img 
              src={swallowLogo} 
              alt="Swallow" 
              className="w-80 h-80 object-contain -mb-4"
              style={{ 
                filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15))' 
              }}
            />
            {/* Detalles amarillo dorado */}
            <div 
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full animate-bounce"
              style={{ backgroundColor: '#F59E0B' }}
            ></div>
            <div 
              className="absolute bottom-6 left-2 w-2 h-2 rounded-full"
              style={{ backgroundColor: '#F59E0B', opacity: 0.8 }}
            ></div>
          </div>
          <h1 className="text-5xl font-bold -mt-8" style={{ 
            color: '#374151',
            fontFamily: 'Montserrat, sans-serif',
            textShadow: '0 2px 4px rgba(245, 158, 11, 0.3)'
          }}>
            Swallow
          </h1>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center px-8">
          <div className="space-y-6">
            {/* Email Field - CON ERROR */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative"
            >
              <div 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
                style={{ color: '#EF4444' }}
              >
                <Mail size={20} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico"
                className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                style={{ 
                  background: '#FFFFFF',
                  border: '1px solid #EF4444',
                  color: '#374151',
                  fontFamily: 'Montserrat, sans-serif',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.25)'
                }}
              />
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs mt-1 ml-1"
                style={{ 
                  color: '#EF4444',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '12px'
                }}
              >
                {emailError}
              </motion.p>
            </motion.div>

            {/* Password Field - NORMAL */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
                style={{ color: '#87CEEB' }}
              >
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full pl-12 pr-12 py-3 rounded-lg focus:outline-none focus:ring-2"
                style={{ 
                  background: '#FFFFFF',
                  border: '1px solid #87CEEB',
                  color: '#374151',
                  fontFamily: 'Montserrat, sans-serif',
                  boxShadow: '0 2px 8px rgba(135, 206, 235, 0.25)'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
                style={{ color: '#9CA3AF' }}
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </motion.div>

            {/* Separator Line */}
            <motion.div 
              className="flex justify-center"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="w-32 h-px" style={{ backgroundColor: '#E5E7EB' }}></div>
            </motion.div>

            {/* Login Button */}
            <motion.button
              onClick={onLogin}
              className="w-full transition-all hover:scale-105 text-center relative overflow-hidden"
              style={{
                backgroundColor: '#1A43FF',
                color: '#FFFFFF',
                padding: '16px',
                border: 'none',
                borderRadius: '12px',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600,
                boxShadow: '0px 4px 12px rgba(26, 67, 255, 0.35)',
                cursor: 'pointer'
              }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              Iniciar sesión
            </motion.button>

            {/* Registration Section */}
            <motion.div 
              className="text-center space-y-4"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <p className="text-sm" style={{ 
                color: '#374151',
                fontFamily: 'Merriweather, serif'
              }}>
                ¿Aún no estás registrado?
              </p>
              <button
                onClick={handleRegisterClick}
                className="text-sm underline hover:no-underline transition-all block mx-auto font-bold cursor-pointer"
                style={{ 
                  color: '#1A43FF',
                  fontFamily: 'Montserrat, sans-serif'
                }}
                type="button"
              >
                Clic aquí para registrarte, es gratis
              </button>
            </motion.div>

            {/* Propósitos Colombia Section */}
            <motion.div 
              className="text-center space-y-1 mt-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <p className="text-xs" style={{ 
                color: '#374151',
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
                color: '#374151',
                fontFamily: 'Montserrat, sans-serif'
              }}>
                Propósitos Colombia
              </p>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.div 
          className="pb-8 px-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          {/* Separator Line */}
          <div className="flex justify-center mb-4">
            <div className="w-48 h-px relative" style={{ backgroundColor: '#E5E7EB' }}>
              {/* Pequeño acento dorado en el centro */}
              <div 
                className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-px"
                style={{ backgroundColor: '#F59E0B' }}
              ></div>
            </div>
          </div>
        </motion.div>
      </div>
  );
}