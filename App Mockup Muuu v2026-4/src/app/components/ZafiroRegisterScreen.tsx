import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';


interface ZafiroRegisterScreenProps {
  onBack: () => void;
  onRegisterSuccess: () => void;
  userType: 'company' | 'candidate' | null;
}

export function ZafiroRegisterScreen({ onBack, onRegisterSuccess, userType }: ZafiroRegisterScreenProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    secondName: '',
    lastName: '',
    secondLastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpiar mensaje cuando el usuario empiece a escribir
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const isFormValid = () => {
    return (
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.phone.trim() !== '' &&
      formData.password.trim() !== '' &&
      formData.confirmPassword.trim() !== '' &&
      acceptedTerms
    );
  };

  const handleSubmit = () => {
    if (!isFormValid()) {
      setMessage({ type: 'error', text: 'Por favor completa todos los campos obligatorios y acepta los términos' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
      return;
    }

    // Simular verificación de email duplicado (30% de probabilidad)
    if (Math.random() < 0.3) {
      setMessage({ type: 'error', text: 'El correo ya está registrado' });
      return;
    }

    // Registro exitoso
    setMessage({ type: 'success', text: '¡Usuario registrado! Revisa tu correo para activar tu cuenta' });
    
    // Simular navegación después del registro exitoso
    setTimeout(() => {
      onRegisterSuccess();
    }, 2000);
  };

  if (showTerms) {
    return (
      <div className="h-full bg-white flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <button 
            onClick={() => setShowTerms(false)}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Volver
          </button>
          <h2 className="text-lg font-bold text-[rgb(30,58,138)]">Términos y Condiciones</h2>
          <div className="w-16"></div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4 text-sm">
            <h3 className="font-bold text-[rgb(30,58,138)]">Términos y Condiciones de Uso - Zafiro</h3>
            
            <p>Al usar la aplicación Zafiro, aceptas los siguientes términos:</p>
            
            <div className="space-y-2">
              <h4 className="font-semibold">1. Uso de la Plataforma</h4>
              <p>Zafiro es una plataforma de empleo que conecta profesionales con oportunidades laborales.</p>
              
              <h4 className="font-semibold">2. Privacidad</h4>
              <p>Protegemos tu información personal de acuerdo con nuestra política de privacidad.</p>
              
              <h4 className="font-semibold">3. Responsabilidades</h4>
              <p>Los usuarios deben proporcionar información veraz y actualizada en sus perfiles.</p>
              
              <h4 className="font-semibold">4. Prohibiciones</h4>
              <p>Está prohibido el uso fraudulento de la plataforma o cualquier actividad que viole las leyes aplicables.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <button
            onClick={() => {
              setAcceptedTerms(true);
              setShowTerms(false);
            }}
            className="w-full text-white py-3 rounded-lg font-medium hover:opacity-90 transition-colors"
            style={{ backgroundColor: '#DC143C' }}
          >
            Acepto los Términos y Condiciones
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white">
      {/* Header con logos */}
      <div className="flex items-center justify-between p-4 pt-8">
        {/* Logo golondrina (izquierda) */}
        <div className="w-12 h-12 bg-[rgb(30,58,138)] rounded-lg flex items-center justify-center">
          <span className="text-white text-lg">🕊️</span>
        </div>
        
        {/* Título centrado */}
        <h1 className="text-xl font-bold text-[rgb(30,58,138)]">Crear cuenta</h1>
        
        {/* Espacio vacío para balance */}
        <div className="w-24 h-12"></div>
      </div>

      {/* Contenido del formulario */}
      <div className="px-6 pb-6 flex-1 overflow-y-auto">
        <div className="space-y-4">
          {/* Primer Nombre */}
          <div>
            <label className="block text-[rgb(30,58,138)] text-sm mb-1">
              Primer Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingresa tu primer nombre"
            />
          </div>

          {/* Segundo Nombre */}
          <div>
            <label className="block text-[rgb(30,58,138)] text-sm mb-1">
              Segundo Nombre
            </label>
            <input
              type="text"
              value={formData.secondName}
              onChange={(e) => handleInputChange('secondName', e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingresa tu segundo nombre (opcional)"
            />
          </div>

          {/* Primer Apellido */}
          <div>
            <label className="block text-[rgb(30,58,138)] text-sm mb-1">
              Primer Apellido <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingresa tu primer apellido"
            />
          </div>

          {/* Segundo Apellido */}
          <div>
            <label className="block text-[rgb(30,58,138)] text-sm mb-1">
              Segundo Apellido
            </label>
            <input
              type="text"
              value={formData.secondLastName}
              onChange={(e) => handleInputChange('secondLastName', e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingresa tu segundo apellido (opcional)"
            />
          </div>

          {/* Correo Electrónico */}
          <div>
            <label className="block text-[rgb(30,58,138)] text-sm mb-1">
              Correo Electrónico <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="correo@ejemplo.com"
              />
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Número de Teléfono */}
          <div>
            <label className="block text-[rgb(30,58,138)] text-sm mb-1">
              Número de Teléfono <span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <div className="bg-gray-100 border border-gray-300 rounded-l-lg px-3 py-2 text-sm flex items-center">
                +57
              </div>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="flex-1 bg-white border border-gray-300 border-l-0 rounded-r-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="3001234567"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-[rgb(30,58,138)] text-sm mb-1">
              Contraseña <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresa tu contraseña"
              />
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirmación de Contraseña */}
          <div>
            <label className="block text-[rgb(30,58,138)] text-sm mb-1">
              Confirmación de Contraseña <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirma tu contraseña"
              />
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Términos y Condiciones */}
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              Acepto los{' '}
              <button
                type="button"
                onClick={() => setShowTerms(true)}
                className="text-[rgb(30,58,138)] underline hover:text-blue-800"
              >
                términos y condiciones
              </button>
            </label>
          </div>

          {/* Mensaje de error o éxito */}
          {message.text && (
            <div 
              className={`p-3 rounded-lg text-sm ${
                message.type === 'success' 
                  ? 'text-white' 
                  : 'bg-red-100 text-red-700'
              }`}
              style={message.type === 'success' ? { backgroundColor: '#DC143C' } : {}}
            >
              {message.text}
            </div>
          )}

          {/* Botón Crear cuenta */}
          <button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              isFormValid()
                ? 'text-white hover:opacity-90'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            style={isFormValid() ? { backgroundColor: '#DC143C' } : {}}
          >
            Crear cuenta
          </button>

          {/* Enlaces inferiores */}
          <div className="text-center space-y-2">
            <button
              onClick={onBack}
              className="text-[rgb(30,58,138)] underline hover:text-blue-800 text-sm"
            >
              Volver
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}