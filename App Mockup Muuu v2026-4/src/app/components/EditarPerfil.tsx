import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, User, Phone, MapPin, Briefcase, Calendar, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import swallowBirdLogo from 'figma:asset/9ebfd23cb16475a09766881a0f181c6d6cd7681b.png';

interface EditarPerfilProps {
  onGoBack: () => void;
  onVerificarEmail: (email: string) => void;
  userType: 'candidate' | 'company';
  emailVerificado?: boolean;
  telefonoVerificado?: boolean;
  onToggleEmailVerification?: () => void;
  onToggleTelefonoVerification?: () => void;
  onGoToPhoneVerification?: () => void;
  onDirectToEmailVerified?: () => void;
}

export function EditarPerfil({ 
  onGoBack, 
  onVerificarEmail, 
  userType, 
  emailVerificado = false,
  telefonoVerificado = false,
  onToggleEmailVerification,
  onToggleTelefonoVerification,
  onGoToPhoneVerification,
  onDirectToEmailVerified
}: EditarPerfilProps) {
  const [formData, setFormData] = useState({
    nombre: userType === 'candidate' ? 'Andrea Martínez' : 'TechCorp Solutions',
    apellido: userType === 'candidate' ? 'González' : '',
    email: 'andrea.martinez@email.com',
    telefono: '+57 300 123 4567',
    ciudad: 'Bogotá, Colombia',
    profesion: userType === 'candidate' ? 'Desarrolladora Frontend' : 'Tecnología',
    experiencia: userType === 'candidate' ? '3 años' : '10 años en el mercado'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVerificarEmail = () => {
    onVerificarEmail(formData.email);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-white to-gray-50 relative">
      {/* Logo Swallow en esquina superior derecha - más separado */}
      <div className="absolute top-4 right-2 z-10">
        <ImageWithFallback 
          src={swallowBirdLogo} 
          alt="Swallow Logo" 
          className="h-28 w-auto object-contain p-[0px]"
        />
      </div>

      {/* Botón de flecha para volver */}
      <button
        onClick={onGoBack}
        className="absolute top-6 left-6 z-20 p-2 rounded-full hover:bg-gray-100 transition-colors"
        style={{ 
          color: '#1E3A8A'
        }}
      >
        <ArrowLeft size={28} strokeWidth={2.5} />
      </button>

      {/* Contenido principal */}
      <div className="flex-1 px-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl font-bold text-blue-800 mb-2 text-left ml-4 px-[45px] py-[0px]">
            Actualizar Perfil
          </h1>
          <p className="text-gray-600 text-left ml-4 mb-6">
            {userType === 'candidate' ? 'Mantén tu información actualizada' : 'Información de la empresa'}
          </p>

          <div className="space-y-6">
            {/* Nombre */}
            <div className="space-y-2">
              <label className="flex items-center text-gray-700 font-medium">
                <User className="w-4 h-4 mr-2 text-blue-600" />
                {userType === 'candidate' ? 'Nombre' : 'Nombre de la empresa'}
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Apellido - Solo para candidatos */}
            {userType === 'candidate' && (
              <div className="space-y-2">
                <label className="flex items-center text-gray-700 font-medium">
                  <User className="w-4 h-4 mr-2 text-blue-600" />
                  Apellido
                </label>
                <input
                  type="text"
                  value={formData.apellido}
                  onChange={(e) => handleInputChange('apellido', e.target.value)}
                  className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {/* Email con verificación */}
            <div className="space-y-2">
              <label className="flex items-center text-gray-700 font-medium">
                <Mail className="w-4 h-4 mr-2 text-blue-600" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              
              {/* Badge de estado y botón de verificación */}
              <div className="flex items-center justify-between">
                {emailVerificado ? (
                  <div className="flex items-center space-x-2">
                    <span 
                      onClick={onToggleEmailVerification}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 cursor-pointer hover:bg-green-200 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                      Verificado
                    </span>
                    <button
                      onClick={handleVerificarEmail}
                      className="text-sm text-blue-600 hover:text-blue-700 underline"
                    >
                      Cambiar email
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <span 
                      onClick={onToggleEmailVerification}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 cursor-pointer hover:bg-yellow-200 transition-colors"
                    >
                      <AlertTriangle className="w-4 h-4 mr-1 text-yellow-600" />
                      No verificado
                    </span>
                    <button
                      onClick={handleVerificarEmail}
                      className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                      style={{ minWidth: '120px', height: '32px' }}
                    >
                      Verificar Email
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <label className="flex items-center text-gray-700 font-medium">
                <Phone className="w-4 h-4 mr-2 text-blue-600" />
                Teléfono
              </label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => handleInputChange('telefono', e.target.value)}
                className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              
              {/* Badge de estado de verificación del teléfono */}
              <div className="flex items-center justify-between">
                {telefonoVerificado ? (
                  <div className="flex items-center space-x-2">
                    <span 
                      onClick={onToggleTelefonoVerification}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 cursor-pointer hover:bg-green-200 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                      Verificado
                    </span>
                    <button
                      onClick={onGoToPhoneVerification}
                      className="text-sm text-blue-600 hover:text-blue-700 underline"
                    >
                      Cambiar teléfono
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <span 
                      onClick={onToggleTelefonoVerification}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 cursor-pointer hover:bg-yellow-200 transition-colors"
                    >
                      <AlertTriangle className="w-4 h-4 mr-1 text-yellow-600" />
                      No verificado
                    </span>
                    <button
                      onClick={onGoToPhoneVerification}
                      className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                      style={{ minWidth: '120px', height: '32px' }}
                    >
                      Verificar teléfono
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Ciudad */}
            <div className="space-y-2">
              <label className="flex items-center text-gray-700 font-medium">
                <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                Ciudad
              </label>
              <input
                type="text"
                value={formData.ciudad}
                onChange={(e) => handleInputChange('ciudad', e.target.value)}
                className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Profesión/Sector */}
            <div className="space-y-2">
              <label className="flex items-center text-gray-700 font-medium">
                <Briefcase className="w-4 h-4 mr-2 text-blue-600" />
                {userType === 'candidate' ? 'Profesión' : 'Sector'}
              </label>
              <input
                type="text"
                value={formData.profesion}
                onChange={(e) => handleInputChange('profesion', e.target.value)}
                className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Experiencia */}
            <div className="space-y-2">
              <label className="flex items-center text-gray-700 font-medium">
                <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                Experiencia
              </label>
              <input
                type="text"
                value={formData.experiencia}
                onChange={(e) => handleInputChange('experiencia', e.target.value)}
                className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Botón Guardar */}
            <button
              className="w-full p-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg font-bold hover:from-blue-500 hover:to-blue-700 transition-all transform hover:scale-105 text-center"
            >
              Guardar Cambios
            </button>


          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="p-4 text-center">
        <p className="text-xs text-gray-400">
          Powered by @CIEUniMagdalena-2025
        </p>
      </div>

      {/* Botones invisibles para navegación rápida */}
      {/* Esquina inferior izquierda - Volver a pantalla principal */}
      <div 
        className="absolute bottom-0 left-0 w-16 h-16 z-20 cursor-pointer"
        onDoubleClick={onGoBack}
        style={{ background: 'transparent' }}
      />

      {/* Esquina inferior derecha - Toggle email verification */}
      <div 
        className="absolute bottom-0 right-0 w-16 h-16 z-20 cursor-pointer"
        onDoubleClick={onToggleEmailVerification}
        style={{ background: 'transparent' }}
      />

      {/* Esquina superior izquierda - Toggle teléfono verification */}
      <div 
        className="absolute top-0 left-0 w-16 h-16 z-20 cursor-pointer"
        onDoubleClick={onToggleTelefonoVerification}
        style={{ background: 'transparent' }}
      />

      {/* BOTÓN MÁS INTUITIVO - Triple click en el título para ir directo a email verificado */}
      <div 
        className="absolute top-[200px] left-4 w-64 h-8 z-20 cursor-pointer"
        onClick={(e) => {
          const detail = (e as any).detail;
          if (detail === 3 && onDirectToEmailVerified) {
            onDirectToEmailVerified();
          }
        }}
        style={{ background: 'transparent' }}
        title="Triple click en título para ir directo a email verificado"
      />
    </div>
  );
}