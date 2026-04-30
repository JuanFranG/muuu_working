export function WelcomeScreen({ onCreateAccount, onSignIn }: { 
  onCreateAccount: () => void;
  onSignIn: () => void;
}) {
  return (
    <div className="h-full bg-gradient-to-b from-sky-200 to-sky-300 flex flex-col items-center justify-center px-8">
      {/* Logo de Propósitos Colombia */}
      <div className="mb-12">
        <div className="bg-white rounded-full p-4 shadow-lg">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">PC</span>
          </div>
        </div>
      </div>

      {/* Título de la app */}
      <div className="mb-16 text-center">
        <h1 className="text-3xl font-bold text-blue-800 mb-2">SitBax</h1>
        <p className="text-blue-600 text-base">Tu próxima oportunidad laboral te está esperando</p>
      </div>

      {/* Botones de autenticación */}
      <div className="w-full max-w-xs space-y-4">
        {/* Botón Crear cuenta */}
        <button
          onClick={onCreateAccount}
          className="w-full py-4 px-6 bg-rose-600 text-white rounded-lg shadow-lg hover:bg-rose-700 transition-colors duration-200 font-medium text-lg"
        >
          Crear cuenta
        </button>

        {/* Botón Iniciar sesión */}
        <button
          onClick={onSignIn}
          className="w-full py-4 px-6 bg-white text-blue-800 border-2 border-blue-800 rounded-lg shadow-lg hover:bg-blue-50 transition-colors duration-200 font-medium text-lg"
        >
          Iniciar sesión
        </button>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <p className="text-blue-600 text-sm">Conecta con las mejores oportunidades</p>
      </div>
    </div>
  );
}