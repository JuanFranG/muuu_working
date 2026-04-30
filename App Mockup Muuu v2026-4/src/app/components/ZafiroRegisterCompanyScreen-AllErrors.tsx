import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, Building, FileText } from 'lucide-react';
import propositosLogo from 'figma:asset/306baf54b210403d9d56b873a0c944460dd03166.png';
import swallowLogo from 'figma:asset/9ebfd23cb16475a09766881a0f181c6d6cd7681b.png';

interface ZafiroRegisterCompanyScreenAllErrorsProps {
  onBack: () => void;
  onRegisterSuccess: () => void;
}

export function ZafiroRegisterCompanyScreenAllErrors({ onBack, onRegisterSuccess }: ZafiroRegisterCompanyScreenAllErrorsProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: 'Juan Pérez',
    documentType: 'NIT',
    nit: '123',
    email: 'invalidemail',
    password: '123',
    confirmPassword: '456'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div 
      className="h-full flex flex-col relative"
      style={{
        background: 'linear-gradient(180deg, #EEF4FF 0%, #FFFFFF 100%)'
      }}
    >
      {/* Logo de Propósitos Colombia */}
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

      {/* Logo de Swallow */}
      <motion.div 
        className="flex flex-col items-center pt-6 pb-4"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="relative">
          <img 
            src={swallowLogo} 
            alt="Swallow" 
            className="w-[160px] h-[160px]"
            style={{ 
              filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15))' 
            }}
          />
          <div 
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full animate-pulse"
            style={{ backgroundColor: '#F59E0B' }}
          ></div>
        </div>
        <h1 className="text-3xl font-bold -mt-4" style={{ 
          color: '#374151',
          fontFamily: 'Montserrat, sans-serif',
          textShadow: '0 2px 4px rgba(245, 158, 11, 0.3)'
        }}>
          Swallow
        </h1>
        <p className="text-sm mt-1" style={{ 
          color: '#374151',
          fontFamily: 'Merriweather, serif'
        }}>
          Registro de Empresa - Todos los Errores
        </p>
      </motion.div>

      {/* Formulario */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        <div className="space-y-4">
          {/* Nombre de la empresa - CON ERROR */}
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
              <Building size={20} />
            </div>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              placeholder="Nombre de la empresa"
              className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2"
              style={{ 
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FEF9E7 100%)',
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
              Ingresa nombre válido
            </motion.p>
          </motion.div>

          {/* Nombre de contacto - NORMAL */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative"
            style={{ marginTop: '2rem' }}
          >
            <div 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
              style={{ color: '#F59E0B' }}
            >
              <Building size={20} />
            </div>
            <input
              type="text"
              value={formData.contactName}
              onChange={(e) => handleInputChange('contactName', e.target.value)}
              placeholder="Nombre del contacto"
              className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2"
              style={{ 
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FEF9E7 100%)',
                border: '1px solid #F59E0B',
                color: '#374151',
                fontFamily: 'Montserrat, sans-serif',
                boxShadow: '0 2px 8px rgba(245, 158, 11, 0.25)'
              }}
            />
          </motion.div>

          {/* Tipo de Documento y Número - NIT CON ERROR */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex gap-3"
          >
            {/* Selector de Tipo de Documento - NORMAL */}
            <div className="relative flex-1">
              <div 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
                style={{ color: '#F59E0B' }}
              >
                <FileText size={20} />
              </div>
              <select
                value={formData.documentType}
                onChange={(e) => handleInputChange('documentType', e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 appearance-none"
                style={{ 
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #FEF9E7 100%)',
                  border: '1px solid #F59E0B',
                  color: '#374151',
                  fontFamily: 'Montserrat, sans-serif',
                  boxShadow: '0 2px 8px rgba(245, 158, 11, 0.25)'
                }}
              >
                <option value="NIT">NIT</option>
                <option value="CC">CC</option>
                <option value="CE">CE</option>
              </select>
            </div>

            {/* Campo de Número de Documento - CON ERROR */}
            <div className="relative flex-[2]">
              <input
                type="text"
                value={formData.nit}
                onChange={(e) => handleInputChange('nit', e.target.value)}
                placeholder="Número de documento"
                className="w-full pl-4 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                style={{ 
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #FEF9E7 100%)',
                  border: '1px solid #EF4444',
                  color: '#374151',
                  fontFamily: 'Montserrat, sans-serif',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.25)'
                }}
              />
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs mt-1 ml-1 absolute"
                style={{ 
                  color: '#EF4444',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '12px',
                  top: '100%',
                  left: '0'
                }}
              >
                NIT inválido
              </motion.p>
            </div>
          </motion.div>

          {/* Email - CON ERROR */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="relative"
            style={{ marginTop: '2rem' }}
          >
            <div 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
              style={{ color: '#EF4444' }}
            >
              <Mail size={20} />
            </div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Correo electrónico"
              className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2"
              style={{ 
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)',
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
              Correo electrónico inválido
            </motion.p>
          </motion.div>

          {/* Contraseña - CON ERROR */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="relative"
            style={{ marginTop: '2rem' }}
          >
            <div 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
              style={{ color: '#EF4444' }}
            >
              <Lock size={20} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Contraseña"
              className="w-full pl-12 pr-12 py-3 rounded-lg focus:outline-none focus:ring-2"
              style={{ 
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)',
                border: '1px solid #EF4444',
                color: '#374151',
                fontFamily: 'Montserrat, sans-serif',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.25)'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              style={{ color: '#9CA3AF' }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
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
              La contraseña debe tener al menos 6 caracteres
            </motion.p>
          </motion.div>

          {/* Confirmar Contraseña - CON ERROR */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="relative"
            style={{ marginTop: '2rem' }}
          >
            <div 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
              style={{ color: '#EF4444' }}
            >
              <Lock size={20} />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Confirmar contraseña"
              className="w-full pl-12 pr-12 py-3 rounded-lg focus:outline-none focus:ring-2"
              style={{ 
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)',
                border: '1px solid #EF4444',
                color: '#374151',
                fontFamily: 'Montserrat, sans-serif',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.25)'
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              style={{ color: '#9CA3AF' }}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
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
              Las contraseñas no coinciden
            </motion.p>
          </motion.div>

          {/* Botón de registro - DESHABILITADO */}
          <motion.button
            className="w-full text-center cursor-not-allowed"
            style={{
              backgroundColor: '#9CA3AF',
              color: '#FFFFFF',
              padding: '16px',
              border: 'none',
              borderRadius: '12px',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600,
              boxShadow: '0px 4px 12px rgba(156, 163, 175, 0.25)',
              marginTop: '2rem'
            }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            disabled
          >
            Registrarme como Empresa
          </motion.button>

          {/* Botón volver */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <button
              onClick={onBack}
              className="text-sm underline hover:no-underline transition-all"
              style={{ 
                color: '#1A75D7',
                fontFamily: 'Montserrat, sans-serif'
              }}
            >
              Volver
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}