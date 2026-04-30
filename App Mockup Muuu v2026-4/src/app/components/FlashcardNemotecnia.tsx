import { useState } from 'react';
import { RotateCcw, Maximize2, Minimize2, X } from 'lucide-react';

interface FlashcardNemotecniaProps {
  onClose: () => void;
  question: string;
  answer: string;
}

export function FlashcardNemotecnia({ onClose, question, answer }: FlashcardNemotecniaProps) {
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
              justifyContent: 'center',
              padding: '32px',
              border: '4px solid #9B7EC7'
            }}
          >
            <div
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: '16px',
                color: '#9B7EC7',
                marginBottom: '20px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              Pregunta
            </div>

            <div
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: isFullscreen ? '48px' : '40px',
                color: '#7952B3',
                fontStyle: 'italic',
                letterSpacing: '1px',
                lineHeight: '1.4',
                textAlign: 'center'
              }}
              dangerouslySetInnerHTML={{ __html: question }}
            />

            <div
              style={{
                marginTop: 'auto',
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
              Respuesta & Nemotécnica 💡
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
                  fontSize: isFullscreen ? '28px' : '24px',
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

              {/* Paso a paso */}
              <div
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '13px',
                  color: '#1E293B',
                  lineHeight: '1.6'
                }}
              >
                <p style={{ fontWeight: 700, marginBottom: '12px', color: '#7952B3' }}>
                  📝 Paso a paso:
                </p>

                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontWeight: 600, marginBottom: '6px' }}>1. Identifica u y dv:</p>
                  <div style={{ paddingLeft: '12px', color: '#7D7D7D' }}>
                    <p>• u = x</p>
                    <p>• dv = e<sup>x</sup> dx</p>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontWeight: 600, marginBottom: '6px' }}>2. Calcula du y v:</p>
                  <div style={{ paddingLeft: '12px', color: '#7D7D7D' }}>
                    <p>• du = dx</p>
                    <p>• v = e<sup>x</sup></p>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontWeight: 600, marginBottom: '6px' }}>3. Aplica la fórmula:</p>
                  <div
                    style={{
                      fontFamily: 'Georgia, serif',
                      fontSize: '16px',
                      color: '#7952B3',
                      fontStyle: 'italic',
                      padding: '12px',
                      backgroundColor: '#F3EBFF',
                      borderRadius: '8px',
                      margin: '8px 0',
                      textAlign: 'center'
                    }}
                  >
                    ∫ u dv = uv - ∫ v du
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontWeight: 600, marginBottom: '6px' }}>4. Sustituye:</p>
                  <div
                    style={{
                      fontFamily: 'Georgia, serif',
                      fontSize: '16px',
                      color: '#7952B3',
                      fontStyle: 'italic',
                      padding: '12px',
                      backgroundColor: '#F3EBFF',
                      borderRadius: '8px',
                      margin: '8px 0',
                      textAlign: 'center'
                    }}
                  >
                    x·e<sup>x</sup> - ∫ e<sup>x</sup> dx
                  </div>
                </div>

                <div>
                  <p style={{ fontWeight: 600, marginBottom: '6px' }}>5. Resuelve:</p>
                  <div
                    style={{
                      fontFamily: 'Georgia, serif',
                      fontSize: '16px',
                      color: '#10B981',
                      fontStyle: 'italic',
                      padding: '12px',
                      backgroundColor: '#D1FAE5',
                      borderRadius: '8px',
                      margin: '8px 0',
                      textAlign: 'center',
                      fontWeight: 700
                    }}
                  >
                    x·e<sup>x</sup> - e<sup>x</sup> + C
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '20px',
                    padding: '12px',
                    backgroundColor: '#FEF3C7',
                    borderRadius: '8px',
                    borderLeft: '4px solid #F59E0B'
                  }}
                >
                  <p style={{ fontWeight: 700, color: '#F59E0B', marginBottom: '4px', fontSize: '12px' }}>
                    💡 Tip Nemotécnico:
                  </p>
                  <p style={{ color: '#92400E', fontSize: '12px', lineHeight: '1.4' }}>
                    "El producto de x con exponencial: deriva la x, integra el resto, resta lo que falta"
                  </p>
                </div>
              </div>
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