import { useState } from 'react';
import { ArrowLeft, Copy, X, ChevronDown } from 'lucide-react';

interface SalaDesafioProps {
  onBack: () => void;
  onStartGame: () => void;
}

export function SalaDesafio({ onBack, onStartGame }: SalaDesafioProps) {
  const [roomCode] = useState('MU·4829');
  const [currentState, setCurrentState] = useState<'waiting' | 'rival-joined'>('waiting');
  const [numQuestions] = useState(5);
  const [topic] = useState('Todos los temas');
  const [showExitModal, setShowExitModal] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomCode);
    // Mostrar feedback visual
  };

  const cancelRoom = () => {
    setShowExitModal(true);
  };

  // Modal de confirmación de salida
  const ExitConfirmationModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '24px',
          maxWidth: '320px',
          width: '90%',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
        }}
      >
        <div style={{ fontSize: '36px', textAlign: 'center', marginBottom: '12px' }}>⚠️</div>
        
        <h3
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 700,
            fontSize: '18px',
            color: '#1E293B',
            textAlign: 'center',
            marginBottom: '8px'
          }}
        >
          ¿Estás seguro/a?
        </h3>
        
        <p
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '13px',
            color: '#7D7D7D',
            textAlign: 'center',
            marginBottom: '20px',
            lineHeight: '1.4'
          }}
        >
          Si sales ahora, se cerrará la sala y el rival no podrá unirse
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => setShowExitModal(false)}
            style={{
              flex: 1,
              height: '44px',
              backgroundColor: '#F3F4F6',
              color: '#1E293B',
              border: 'none',
              borderRadius: '10px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Quedarme
          </button>
          
          <button
            onClick={onBack}
            style={{
              flex: 1,
              height: '44px',
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
            }}
          >
            Salir
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="h-full relative overflow-y-auto flex flex-col"
      style={{
        background: 'linear-gradient(135deg, #9B7EC7 0%, #7952B3 100%)'
      }}
    >
      {/* Modal de confirmación */}
      {showExitModal && <ExitConfirmationModal />}

      {/* HEADER */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: '16px 20px',
          paddingTop: '20px'
        }}
      >
        <button
          onClick={cancelRoom}
          className="flex items-center justify-center rounded-full transition-colors"
          style={{
            width: '36px',
            height: '36px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: '#FFFFFF'
          }}
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>

        <h1
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 700,
            fontSize: '17px',
            color: '#FFFFFF'
          }}
        >
          Sala de Desafío ⚔️
        </h1>

        <div style={{ width: '36px' }}></div>
      </div>

      {/* AVATARES VS */}
      <div
        className="flex items-center justify-center gap-3"
        style={{
          padding: '16px 20px'
        }}
      >
        {/* Avatar Tú */}
        <div className="flex flex-col items-center">
          <div
            className="flex items-center justify-center"
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#D4A574',
              border: '3px solid #FFFFFF',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: '20px',
              color: '#FFFFFF'
            }}
          >
            M
          </div>
          <span
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              fontSize: '11px',
              color: '#FFFFFF',
              marginTop: '6px'
            }}
          >
            Tú
          </span>
        </div>

        {/* VS Badge */}
        <div
          className="flex items-center justify-center"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: '#FFD700',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 800,
            fontSize: '13px',
            color: '#1A1A1A',
            boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)'
          }}
        >
          VS
        </div>

        {/* Avatar Rival */}
        <div className="flex flex-col items-center">
          <div
            className="flex items-center justify-center relative"
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: currentState === 'rival-joined' ? '#B8A4D9' : 'rgba(255, 255, 255, 0.3)',
              border: currentState === 'rival-joined' ? '3px solid #FFFFFF' : '3px dashed rgba(255, 255, 255, 0.6)',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: '20px',
              color: '#FFFFFF'
            }}
          >
            {currentState === 'rival-joined' ? 'R' : '?'}
            {currentState === 'waiting' && (
              <div
                className="absolute animate-ping"
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)'
                }}
              ></div>
            )}
          </div>
          <span
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              fontSize: '11px',
              color: currentState === 'rival-joined' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.9)',
              marginTop: '6px'
            }}
          >
            {currentState === 'rival-joined' ? 'Rival' : 'Esperando...'}
          </span>
        </div>
      </div>

      {/* CONTENIDO */}
      <div
        className="flex-1 flex flex-col"
        style={{
          marginTop: '20px',
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: '28px',
          borderTopRightRadius: '28px',
          padding: '24px 20px',
          paddingBottom: '32px'
        }}
      >
        {/* CÓDIGO DE SALA */}
        <div style={{ marginBottom: '20px' }}>
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              color: '#7D7D7D',
              marginBottom: '10px',
              textAlign: 'center'
            }}
          >
            Comparte este código con tu rival
          </p>

          <div
            className="flex items-center justify-center"
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 800,
              fontSize: '40px',
              color: '#7952B3',
              letterSpacing: '6px',
              marginBottom: '12px'
            }}
          >
            {roomCode}
          </div>

          <div className="flex justify-center">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 transition-all hover:scale-105"
              style={{
                padding: '8px 16px',
                backgroundColor: '#F3EBFF',
                color: '#9B7EC7',
                border: '1px solid #E6D5F0',
                borderRadius: '8px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              📋 Copiar código
            </button>
          </div>
        </div>

        {/* ESTADO DE LA SALA */}
        {currentState === 'waiting' && (
          <div
            className="flex items-start gap-3"
            style={{
              marginBottom: '20px',
              padding: '14px',
              backgroundColor: '#FEF9F3',
              borderRadius: '10px',
              border: '1px solid #F3E8D7'
            }}
          >
            <div
              className="animate-pulse flex-shrink-0"
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#F59E0B',
                marginTop: '6px'
              }}
            ></div>
            <div>
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: '12px',
                  color: '#1E293B',
                  marginBottom: '2px'
                }}
              >
                Esperando que se una el rival...
              </p>
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '11px',
                  color: '#7D7D7D',
                  lineHeight: '1.4'
                }}
              >
                La partida se inicia automáticamente cuando el rival ingrese con el código MU·4829
              </p>
            </div>
          </div>
        )}

        {/* CONFIGURACIÓN DE LA PARTIDA */}
        <div
          style={{
            marginBottom: '20px',
            padding: '16px',
            backgroundColor: '#F9FAFB',
            borderRadius: '10px'
          }}
        >
          <h3
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: '11px',
              color: '#7D7D7D',
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            Configuración
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '12px',
                  color: '#7D7D7D'
                }}
              >
                Tema
              </span>
              <span
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: '12px',
                  color: '#1E293B'
                }}
              >
                {topic}
              </span>
            </div>

            <div className="flex justify-between">
              <span
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '12px',
                  color: '#7D7D7D'
                }}
              >
                Preguntas
              </span>
              <span
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: '12px',
                  color: '#1E293B'
                }}
              >
                {numQuestions} preguntas
              </span>
            </div>

            <div className="flex justify-between">
              <span
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '12px',
                  color: '#7D7D7D'
                }}
              >
                Estado
              </span>
              <div className="flex items-center gap-1">
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: currentState === 'waiting' ? '#F59E0B' : '#10B981'
                  }}
                ></div>
                <span
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 600,
                    fontSize: '12px',
                    color: currentState === 'waiting' ? '#F59E0B' : '#10B981'
                  }}
                >
                  {currentState === 'waiting' ? 'En espera' : 'Listo'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTONES */}
        <div className="space-y-2">
          {currentState === 'rival-joined' && (
            <button
              onClick={onStartGame}
              className="w-full transition-all"
              style={{
                height: '50px',
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: '15px',
                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                cursor: 'pointer'
              }}
            >
              ¡Iniciar Desafío! 🎯
            </button>
          )}

          <button
            onClick={cancelRoom}
            className="w-full transition-all flex items-center justify-center gap-2"
            style={{
              height: '44px',
              backgroundColor: 'transparent',
              color: '#EF4444',
              border: '2px solid #EF4444',
              borderRadius: '10px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
            Cancelar sala
          </button>
        </div>
      </div>
    </div>
  );
}