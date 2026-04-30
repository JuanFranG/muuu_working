import { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import propositosLogo from 'figma:asset/306baf54b210403d9d56b873a0c944460dd03166.png';
import swallowLogo from 'figma:asset/9ebfd23cb16475a09766881a0f181c6d6cd7681b.png';

interface ZafiroLoginScreenProps {
  onBack: () => void;
  onLogin: () => void;
  onRegister: () => void;
  userType: 'company' | 'candidate' | null;
}

export function ZafiroLoginScreen({ onBack, onLogin, onRegister, userType }: ZafiroLoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = () => {
    // Limpiar errores previos
    setEmailError('');
    setPasswordError('');

    // Validar que el email no esté vacío
    if (!email.trim()) {
      setEmailError('Por favor ingresa tu correo electrónico');
      return;
    }

    // Validar que la contraseña no esté vacía
    if (!password.trim()) {
      setPasswordError('Por favor ingresa tu contraseña');
      return;
    }

    // Verificar si el correo es el correcto
    if (email.toLowerCase() !== 'corre@correcto.co') {
      setEmailError('Correo no encontrado');
      return;
    }

    // Verificar si la contraseña es correcta
    if (password !== '123456') {
      setPasswordError('Contraseña Incorrecta');
      return;
    }

    // Si todo está correcto, proceder al login
    onLogin();
  };

  const handlePropositosClick = () => {
    window.open('https://www.jcdnconsulting.com/propositos-colombia?fbclid=PAb21jcAMwt-9leHRuA2FlbQIxMQABpx3BkfjwPPmXSi2ukuu8T0s3xdZfzzmxlMegs1v_CG1rxk4DqtTtUrW3UwAV_aem_d_6gWonGPkfU_6esVPCERw', '_blank');
  };

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Navegando a registro...'); // Para debug
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
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative"
            >
              {/* ELEMENTO 41: CAJA "EMAIL" */}
              <div 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
                style={{ color: emailError ? '#FF4747' : '#87CEEB' }}
              >
                <Mail size={20} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(''); // Limpiar error al escribir
                }}
                placeholder="Correo electrónico"
                className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                style={{ 
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)',
                  border: emailError ? '1px solid #FF4747' : '1px solid #87CEEB',
                  color: '#374151',
                  fontFamily: 'Montserrat, sans-serif',
                  boxShadow: emailError ? '0 2px 8px rgba(255, 71, 71, 0.25)' : '0 2px 8px rgba(135, 206, 235, 0.25)'
                }}
                onFocus={(e) => e.target.style.border = emailError ? '2px solid #FF4747' : '2px solid #1E3A8A'}
                onBlur={(e) => e.target.style.border = emailError ? '1px solid #FF4747' : '1px solid #87CEEB'}
              />
              {emailError && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs mt-1 ml-1"
                  style={{ 
                    color: '#FF4747',
                    fontFamily: 'Montserrat, sans-serif'
                  }}
                >
                  {emailError}
                </motion.p>
              )}
            </motion.div>

            {/* Password Field */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {/* ELEMENTO 42: CAJA "CONTRASEÑA" */}
              <div 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
                style={{ color: passwordError ? '#FF4747' : '#87CEEB' }}
              >
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError(''); // Limpiar error al escribir
                }}
                placeholder="Contraseña"
                className="w-full pl-12 pr-12 py-3 rounded-lg focus:outline-none focus:ring-2"
                style={{ 
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)',
                  border: passwordError ? '1px solid #FF4747' : '1px solid #87CEEB',
                  color: '#374151',
                  fontFamily: 'Montserrat, sans-serif',
                  boxShadow: passwordError ? '0 2px 8px rgba(255, 71, 71, 0.25)' : '0 2px 8px rgba(135, 206, 235, 0.25)'
                }}
                onFocus={(e) => e.target.style.border = passwordError ? '2px solid #FF4747' : '2px solid #1E3A8A'}
                onBlur={(e) => e.target.style.border = passwordError ? '1px solid #FF4747' : '1px solid #87CEEB'}
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
              {passwordError && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs mt-1 ml-1"
                  style={{ 
                    color: '#FF4747',
                    fontFamily: 'Montserrat, sans-serif'
                  }}
                >
                  {passwordError}
                </motion.p>
              )}
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

            {/* ELEMENTO 6: BOTÓN "CONTINUAR" EN REGISTRO / Login Button */}
            <motion.button
              onClick={handleLogin}
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
              {/* ELEMENTO 22: TEXTO "¿YA TIENES CUENTA? INICIAR SESIÓN" */}
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