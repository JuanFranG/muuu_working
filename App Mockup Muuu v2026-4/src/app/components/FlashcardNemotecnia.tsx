import { useState } from 'react';
import { RotateCcw, Maximize2, Minimize2, X } from 'lucide-react';

interface FlashcardNemotecniaProps {
  onClose: () => void;
  question: string;
  answer: string;
  feedback?: string; // retroalimentación del docente para la respuesta correcta
}

export function FlashcardNemotecnia({ onClose, question, answer, feedback }: FlashcardNemotecniaProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      style={{
        width: '100%',
        marginBottom: '20px'
      }}
    >
      {/* Contenedor de la flashcard */}
      <div
        style={{
          width: '100%',
          maxWidth: isFullscreen ? '340px' : '300px',
          height: isFullscreen ? '500px' : '350px',
          perspective: '1000px',
          position: 'relative',
          margin: '0 auto'
        }}
      >
        {/* Botones de control - fuera de la tarjeta */}
        <div
          className="flex items-center justify-between mb-3"
          style={{
            padding: '0 8px'
          }}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={handleFlip}
              className="flex items-center justify-center rounded-full transition-all hover:scale-110"
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#9B7EC7',
                color: '#FFFFFF',
                border: 'none',
                boxShadow: '0 4px 12px rgba(155, 126, 199, 0.4)',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={18} strokeWidth={2.5} />
            </button>

            <button
              onClick={toggleFullscreen}
              className="flex items-center justify-center rounded-full transition-all hover:scale-110"
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#9B7EC7',
                color: '#FFFFFF',
                border: 'none',
                boxShadow: '0 4px 12px rgba(155, 126, 199, 0.4)',
                cursor: 'pointer'
              }}
            >
              {isFullscreen ? (
                <Minimize2 size={18} strokeWidth={2.5} />
              ) : (
                <Maximize2 size={18} strokeWidth={2.5} />
              )}
            </button>
          </div>

          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-full transition-all hover:scale-110"
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              border: 'none',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
              cursor: 'pointer'
            }}
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Contenedor con animación de flip */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            transition: 'transform 0.6s',
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Lado frontal - Pregunta */}
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              padding: '24px 20px 16px',
              border: '4px solid #9B7EC7',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: '12px',
                color: '#9B7EC7',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                flexShrink: 0
              }}
            >
              Pregunta
            </div>

            <div
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: isFullscreen ? '24px' : '20px',
                color: '#7952B3',
                fontStyle: 'italic',
                letterSpacing: '0.5px',
                lineHeight: '1.5',
                textAlign: 'center',
                flex: 1,
                width: '100%',
                overflowY: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              dangerouslySetInnerHTML={{ __html: question }}
            />

            <div
              style={{
                marginTop: '10px',
                flexShrink: 0,
                fontFamily: 'Poppins, sans-serif',
                fontSize: '12px',
                color: '#9CA3AF',
                textAlign: 'center'
              }}
            >
              Toca 🔄 para ver la respuesta
            </div>
          </div>

          {/* Lado trasero - Respuesta */}
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              padding: '24px',
              transform: 'rotateY(180deg)',
              border: '4px solid #10B981',
              overflowY: 'auto'
            }}
          >
            <div
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: '16px',
                color: '#10B981',
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                textAlign: 'center'
              }}
            >
              Respuesta & Nemotécnica
            </div>

            <div
              style={{
                flex: 1,
                overflowY: 'auto'
              }}
            >
              {/* Respuesta final */}
              <div
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: isFullscreen ? '20px' : '18px',
                  color: '#10B981',
                  fontStyle: 'italic',
                  letterSpacing: '1px',
                  lineHeight: '1.6',
                  textAlign: 'center',
                  marginBottom: '20px',
                  padding: '16px',
                  backgroundColor: '#D1FAE5',
                  borderRadius: '12px'
                }}
                dangerouslySetInnerHTML={{ __html: answer }}
              />

              {/* Retroalimentación del docente */}
              {feedback ? (
                <div
                  style={{
                    marginTop: '4px',
                    padding: '14px',
                    backgroundColor: '#FEF3C7',
                    borderRadius: '10px',
                    borderLeft: '4px solid #F59E0B'
                  }}
                >
                  <p style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 700,
                    color: '#92400E',
                    marginBottom: '6px',
                    fontSize: '12px'
                  }}>
                    💡 Retroalimentación del docente:
                  </p>
                  <p style={{
                    fontFamily: 'Poppins, sans-serif',
                    color: '#78350F',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    margin: 0
                  }}>
                    {feedback}
                  </p>
                </div>
              ) : (
                <p style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '12px',
                  color: '#9CA3AF',
                  textAlign: 'center',
                  marginTop: '8px'
                }}>
                  El docente no agregó retroalimentación para esta respuesta.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Instrucción para voltear (solo en modo normal, no fullscreen) */}
        {!isFullscreen && (
          <div
            style={{
              marginTop: '16px',
              textAlign: 'center',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '11px',
              color: '#7D7D7D',
              opacity: 0.9
            }}
          >
            {isFlipped ? 'Viendo la respuesta' : 'Viendo la pregunta'}
          </div>
        )}
      </div>

      {/* CSS para el scroll personalizado */}
      <style>{`
        div::-webkit-scrollbar {
          width: 6px;
        }
        div::-webkit-scrollbar-track {
          background: #F3F4F6;
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb {
          background: #9B7EC7;
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: #7952B3;
        }
      `}</style>
    </div>
  );
}