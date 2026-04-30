import { useState } from 'react';
import { FlashcardModeToggle } from './FlashcardModeToggle';

interface FlashcardFullModeProps {
  onToggleMode: () => void;
  question: string;
  answer: string;
}

export function FlashcardFullMode({ onToggleMode, question, answer }: FlashcardFullModeProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center"
      style={{ padding: '20px', minHeight: '600px' }}
    >
      {/* Contenedor con animación de flip 3D */}
      <div
        style={{
          width: '100%',
          maxWidth: '350px',
          height: '500px',
          perspective: '1000px',
          position: 'relative'
        }}
      >
        {/* Card con flip */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            transition: 'transform 0.6s',
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            cursor: 'pointer'
          }}
          onClick={handleFlip}
        >
          {/* FRENTE - Pregunta */}
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(155, 126, 199, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px 32px',
              border: '4px solid #9B7EC7'
            }}
          >
            {/* Botón de toggle en esquina superior derecha */}
            <div
              className="absolute top-4 right-4"
              onClick={(e) => {
                e.stopPropagation();
                onToggleMode();
              }}
            >
              <FlashcardModeToggle isFlashcardMode={true} onClick={() => {}} />
            </div>

            {/* Label */}
            <div
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: '12px',
                color: '#9B7EC7',
                marginBottom: '32px',
                textTransform: 'uppercase',
                letterSpacing: '1.5px'
              }}
            >
              Pregunta
            </div>

            {/* Fórmula */}
            <div
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: '48px',
                color: '#7952B3',
                fontStyle: 'italic',
                letterSpacing: '1px',
                lineHeight: '1.4',
                textAlign: 'center',
                marginBottom: '32px'
              }}
              dangerouslySetInnerHTML={{ __html: question }}
            />

            {/* Instrucción */}
            <div
              style={{
                marginTop: 'auto',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '12px',
                color: '#9CA3AF',
                textAlign: 'center'
              }}
            >
              Toca para ver la respuesta
            </div>
          </div>

          {/* REVERSO - Respuesta */}
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(16, 185, 129, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              padding: '32px 24px',
              transform: 'rotateY(180deg)',
              border: '4px solid #10B981',
              overflowY: 'auto'
            }}
          >
            {/* Botón de toggle en esquina superior derecha */}
            <div
              className="absolute top-4 right-4"
              onClick={(e) => {
                e.stopPropagation();
                onToggleMode();
              }}
            >
              <FlashcardModeToggle isFlashcardMode={true} onClick={() => {}} />
            </div>

            {/* Label */}
            <div
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: '12px',
                color: '#10B981',
                marginBottom: '24px',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                textAlign: 'center'
              }}
            >
              Respuesta y Nemotécnica
            </div>

            {/* Respuesta */}
            <div
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: '32px',
                color: '#10B981',
                fontStyle: 'italic',
                letterSpacing: '1px',
                lineHeight: '1.6',
                textAlign: 'center',
                marginBottom: '24px',
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
                fontSize: '12px',
                color: '#1E293B',
                lineHeight: '1.6',
                flex: 1
              }}
            >
              <p style={{ fontWeight: 700, marginBottom: '12px', fontSize: '13px' }}>
                📝 Paso a paso:
              </p>

              <div style={{ marginBottom: '12px' }}>
                <p style={{ fontWeight: 600, marginBottom: '4px' }}>1. Identifica u = x y dv = eˣdx</p>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <p style={{ fontWeight: 600, marginBottom: '4px' }}>2. Deriva y antideriva: du = dx, v = eˣ</p>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <p style={{ fontWeight: 600, marginBottom: '4px' }}>3. Aplica ∫u·dv = u·v − ∫v·du</p>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontWeight: 600, marginBottom: '4px' }}>4. Resultado: x·eˣ − ∫eˣdx = x·eˣ − eˣ + C</p>
              </div>

              {/* Nemotécnica de Ada */}
              <div
                style={{
                  marginTop: '16px',
                  padding: '12px',
                  backgroundColor: '#FEF3C7',
                  borderRadius: '8px',
                  borderLeft: '4px solid #F59E0B'
                }}
              >
                <p style={{ fontWeight: 700, color: '#F59E0B', marginBottom: '4px', fontSize: '11px' }}>
                  💡 Nemotécnica de Ada:
                </p>
                <p style={{ color: '#92400E', fontSize: '11px', lineHeight: '1.4' }}>
                  "Una vaca sin cola vestida de uniforme" — la vaca es u, sin cola es dv, vestida es v, uniforme es du.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de estado */}
      <div
        style={{
          marginTop: '24px',
          fontFamily: 'Poppins, sans-serif',
          fontSize: '11px',
          color: '#7D7D7D',
          textAlign: 'center'
        }}
      >
        {isFlipped ? 'Viendo la respuesta' : 'Viendo la pregunta'}
      </div>
    </div>
  );
}
