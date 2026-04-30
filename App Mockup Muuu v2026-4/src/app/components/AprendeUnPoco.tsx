import { useState } from 'react';
import { ArrowLeft, RotateCw, Check, X, Lightbulb, ChevronRight, ChevronLeft } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import muuuLogo from 'figma:asset/4de3de61f8e4df99b460b6420b603ae06ba0b967.png';

interface AprendeUnPocoProps {
  onBack: () => void;
}

type StudyMode = 'quiz' | 'flashcard';

export function AprendeUnPoco({ onBack }: AprendeUnPocoProps) {
  const [mode, setMode] = useState<StudyMode>('quiz');
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const totalQuestions = 20;
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const progress = (currentQuestion / totalQuestions) * 100;
  const correctAnswer = 3; // Opción D es la correcta

  const options = [
    { id: 0, text: 'x·e^x - e^x + C', label: 'A' },
    { id: 1, text: 'e^x + C', label: 'B' },
    { id: 2, text: 'x·e^x + C', label: 'C' },
    { id: 3, text: '(x-1)·e^x + C', label: 'D' }
  ];

  const handleVerify = () => {
    if (selectedOption === null) return;
    setIsVerified(true);
    setIsCorrect(selectedOption === correctAnswer);
    setIsFlipped(true);
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setIsVerified(false);
      setIsCorrect(null);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(null);
      setIsVerified(false);
      setIsCorrect(null);
      setIsFlipped(false);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const toggleMode = () => {
    setMode(mode === 'quiz' ? 'flashcard' : 'quiz');
    setSelectedOption(null);
    setIsVerified(false);
    setIsCorrect(null);
    setIsFlipped(false);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const getOptionStyle = (optionId: number) => {
    const baseStyle = {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      width: '100%',
      minHeight: '52px',
      padding: '12px 16px',
      borderRadius: '12px',
      cursor: isVerified ? 'default' : 'pointer',
      transition: 'all 0.3s ease',
      fontFamily: 'Poppins, sans-serif',
      border: '2px solid #E6D5F0',
      backgroundColor: '#FFFFFF',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
    };

    // Estado seleccionada (antes de verificar)
    if (!isVerified && selectedOption === optionId) {
      return {
        ...baseStyle,
        border: '3px solid #9B7EC7',
        backgroundColor: '#9B7EC7',
        boxShadow: '0 6px 20px rgba(155, 126, 199, 0.4)',
        transform: 'scale(1.02)'
      };
    }

    // Estado correcta (después de verificar)
    if (isVerified && optionId === correctAnswer) {
      return {
        ...baseStyle,
        border: '3px solid #059669',
        backgroundColor: '#10B981',
        boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)'
      };
    }

    // Estado incorrecta (después de verificar)
    if (isVerified && selectedOption === optionId && selectedOption !== correctAnswer) {
      return {
        ...baseStyle,
        border: '3px solid #DC2626',
        backgroundColor: '#EF4444',
        boxShadow: '0 6px 20px rgba(239, 68, 68, 0.4)'
      };
    }

    // Estado normal
    return baseStyle;
  };

  const getBadgeStyle = (optionId: number) => {
    const baseStyle = {
      width: '28px',
      height: '28px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 700,
      fontSize: '14px',
      flexShrink: 0
    };

    if (!isVerified && selectedOption === optionId) {
      return {
        ...baseStyle,
        backgroundColor: '#7952B3',
        color: '#FFFFFF'
      };
    }

    if (isVerified && optionId === correctAnswer) {
      return {
        ...baseStyle,
        backgroundColor: '#047857',
        color: '#FFFFFF'
      };
    }

    if (isVerified && selectedOption === optionId && selectedOption !== correctAnswer) {
      return {
        ...baseStyle,
        backgroundColor: '#B91C1C',
        color: '#FFFFFF'
      };
    }

    return {
      ...baseStyle,
      backgroundColor: '#E6D5F0',
      color: '#7952B3'
    };
  };

  const getTextStyle = (optionId: number) => {
    const baseStyle = {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 600,
      fontSize: '15px',
      lineHeight: '1.4',
      flex: 1
    };

    if (!isVerified && selectedOption === optionId) {
      return { ...baseStyle, color: '#FFFFFF' };
    }

    if (isVerified && (optionId === correctAnswer || (selectedOption === optionId && selectedOption !== correctAnswer))) {
      return { 
        ...baseStyle, 
        color: '#FFFFFF',
        textDecoration: (selectedOption === optionId && selectedOption !== correctAnswer) ? 'line-through' : 'none'
      };
    }

    return { ...baseStyle, color: '#1E293B' };
  };

  return (
    <div 
      className="h-full relative overflow-y-auto"
      style={{ 
        background: 'linear-gradient(180deg, #F3EBFF 0%, #FFFFFF 100%)' 
      }}
    >
      {/* Manchas decorativas de fondo */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.04 }}>
        <div 
          className="absolute"
          style={{ 
            backgroundColor: '#E6D5F0',
            width: '100px',
            height: '80px',
            top: '20%',
            left: '5%',
            borderRadius: '50% 40% 45% 55%',
            filter: 'blur(8px)'
          }}
        ></div>
        <div 
          className="absolute"
          style={{ 
            backgroundColor: '#E6D5F0',
            width: '90px',
            height: '75px',
            top: '60%',
            right: '8%',
            borderRadius: '45% 55% 50% 40%',
            filter: 'blur(8px)'
          }}
        ></div>
      </div>

      {/* COMPONENTE 1: HEADER */}
      <div 
        className="sticky top-0 z-50 flex items-center justify-between"
        style={{ 
          height: '60px',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          padding: '0 16px'
        }}
      >
        {/* Botón Volver */}
        <button
          onClick={onBack}
          className="flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          style={{ width: '32px', height: '32px', color: '#9B7EC7' }}
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>

        {/* Título */}
        <h1 
          className="flex items-center gap-2"
          style={{ 
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 700,
            fontSize: '16px',
            color: '#1E293B'
          }}
        >
          Aprende un Poco 💡
        </h1>

        {/* Botón cambiar modo */}
        <button
          onClick={toggleMode}
          className="flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          style={{ width: '32px', height: '32px', fontSize: '18px' }}
          title={mode === 'quiz' ? 'Cambiar a modo flashcard' : 'Cambiar a modo quiz'}
        >
          {mode === 'quiz' ? '🎴' : '📝'}
        </button>
      </div>

      {/* COMPONENTE 2: CONTADOR DE PROGRESO */}
      <div 
        className="flex items-center justify-between"
        style={{ padding: '16px' }}
      >
        {/* Número de pregunta */}
        <span 
          style={{ 
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            fontSize: '14px',
            color: '#7952B3'
          }}
        >
          {currentQuestion}/{totalQuestions}
        </span>

        {/* Barra de progreso */}
        <div 
          className="flex-1 mx-4"
          style={{ 
            height: '6px',
            backgroundColor: '#E6D5F0',
            borderRadius: '3px',
            overflow: 'hidden'
          }}
        >
          <div 
            className="h-full transition-all duration-500"
            style={{ 
              width: `${progress}%`,
              backgroundColor: '#9B7EC7',
              borderRadius: '3px'
            }}
          ></div>
        </div>

        {/* Botón Saltar */}
        <button
          onClick={handleSkip}
          className="hover:underline transition-all"
          style={{ 
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            fontSize: '13px',
            color: '#7952B3',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Saltar →
        </button>
      </div>

      {/* COMPONENTE 3: FLASHCARD CENTRAL */}
      <div 
        className="mx-auto relative"
        style={{ 
          marginTop: '4px',
          padding: '0 16px',
          perspective: '1000px'
        }}
      >
        <div
          className="relative transition-all duration-600"
          style={{
            width: '340px',
            height: mode === 'flashcard' ? '400px' : '280px',
            margin: '0 auto',
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 0.6s ease-in-out'
          }}
        >
          {/* FRENTE DE LA FLASHCARD */}
          <div
            className="absolute w-full h-full"
            style={{
              backfaceVisibility: 'hidden',
              backgroundColor: '#FFFFFF',
              border: '4px solid #9B7EC7',
              borderRadius: '20px',
              boxShadow: '0 12px 40px rgba(155, 126, 199, 0.3)',
              padding: mode === 'flashcard' ? '32px' : '24px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Tag Categoría */}
            <div 
              className="inline-block self-start"
              style={{
                backgroundColor: '#E6D5F0',
                color: '#7952B3',
                borderRadius: '16px',
                padding: '4px 12px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                fontSize: '10px',
                textTransform: 'uppercase',
                marginBottom: '16px'
              }}
            >
              Integrales por Partes
            </div>

            {/* Pregunta */}
            <p 
              style={{ 
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: mode === 'flashcard' ? '16px' : '14px',
                color: '#1E293B',
                textAlign: 'center',
                marginBottom: mode === 'flashcard' ? '24px' : '16px'
              }}
            >
              Resuelve la siguiente integral:
            </p>

            {/* Fórmula LaTeX */}
            <div 
              className="flex-1 flex items-center justify-center"
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: mode === 'flashcard' ? '38px' : '32px',
                color: '#7952B3',
                fontStyle: 'italic',
                margin: mode === 'flashcard' ? '40px 0' : '24px 0',
                letterSpacing: '1px',
                lineHeight: '1.8'
              }}
            >
              ∫ x·e<sup>x</sup> dx
            </div>

            {/* Botón Voltear */}
            <div className="flex flex-col items-center" style={{ marginTop: 'auto' }}>
              <button
                onClick={handleFlip}
                className="flex items-center justify-center rounded-full transition-all hover:scale-110 hover:rotate-180"
                style={{
                  width: mode === 'flashcard' ? '56px' : '40px',
                  height: mode === 'flashcard' ? '56px' : '40px',
                  backgroundColor: '#9B7EC7',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 12px rgba(155, 126, 199, 0.4)',
                  border: 'none',
                  cursor: 'pointer',
                  marginBottom: mode === 'flashcard' ? '12px' : '6px'
                }}
              >
                <RotateCw size={mode === 'flashcard' ? 24 : 20} />
              </button>
              <span 
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: mode === 'flashcard' ? '11px' : '10px',
                  color: '#667388'
                }}
              >
                {mode === 'flashcard' ? 'Piensa en la respuesta y voltea' : 'Toca para voltear'}
              </span>
            </div>
          </div>

          {/* REVERSO DE LA FLASHCARD */}
          <div
            className="absolute w-full h-full"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              borderRadius: '20px',
              padding: mode === 'flashcard' ? '32px' : '24px',
              display: 'flex',
              flexDirection: 'column',
              ...(mode === 'quiz' ? {
                backgroundColor: '#FFFFFF',
                border: '4px solid #9B7EC7',
                boxShadow: '0 12px 40px rgba(155, 126, 199, 0.3)'
              } : {
                background: 'linear-gradient(135deg, #B8A4D9 0%, #9B7EC7 100%)',
                border: '4px solid #7952B3',
                boxShadow: '0 12px 40px rgba(155, 126, 199, 0.4)'
              })
            }}
          >
            {mode === 'quiz' ? (
              // Reverso modo QUIZ
              <>
                {/* Icon grande */}
                <div className="flex justify-center" style={{ marginBottom: '12px' }}>
                  <div 
                    style={{ 
                      fontSize: '48px', 
                      color: isCorrect ? '#10B981' : '#EF4444'
                    }}
                  >
                    {isCorrect ? '✓' : '✗'}
                  </div>
                </div>

                {/* Título */}
                <h2 
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 800,
                    fontSize: '18px',
                    color: '#1E293B',
                    textAlign: 'center',
                    marginBottom: '12px'
                  }}
                >
                  {isCorrect ? '¡Correcto! 🎉' : 'Ups, intenta de nuevo 😢'}
                </h2>

                {/* Respuesta correcta */}
                <div style={{ marginBottom: '12px' }}>
                  <p 
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '11px',
                      color: '#667388',
                      marginBottom: '6px',
                      textAlign: 'center'
                    }}
                  >
                    Respuesta correcta:
                  </p>
                  <div 
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '15px',
                      fontWeight: 700,
                      color: '#7952B3',
                      backgroundColor: '#F3EBFF',
                      padding: '10px',
                      borderRadius: '8px',
                      textAlign: 'center',
                      border: '2px solid #E6D5F0'
                    }}
                  >
                    {options[correctAnswer].label}) {options[correctAnswer].text}
                  </div>
                </div>

                {/* Explicación */}
                <p
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '12px',
                    color: '#4A4A4A',
                    textAlign: 'center',
                    lineHeight: '1.5'
                  }}
                >
                  {isCorrect 
                    ? 'Usaste integración por partes correctamente'
                    : 'En integración por partes, aplica u·v - ∫v·du'}
                </p>

                {/* Ada en esquina */}
                <div 
                  className="absolute"
                  style={{
                    bottom: '16px',
                    right: '16px',
                    width: '48px',
                    height: '48px'
                  }}
                >
                  <ImageWithFallback 
                    src={muuuLogo} 
                    alt={isCorrect ? "Ada Feliz" : "Ada Triste"} 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
              </>
            ) : (
              // Reverso modo FLASHCARD PURO
              <>
                {/* Label superior */}
                <p 
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 700,
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    color: 'rgba(255, 255, 255, 0.8)',
                    letterSpacing: '1.5px',
                    marginBottom: '24px'
                  }}
                >
                  RESPUESTA
                </p>

                {/* Respuesta correcta */}
                <div 
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '24px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    textAlign: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    padding: '20px',
                    borderRadius: '12px',
                    marginBottom: '32px'
                  }}
                >
                  (x-1)·e<sup>x</sup> + C
                </div>

                {/* Separador */}
                <div 
                  style={{
                    width: '60%',
                    height: '2px',
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    margin: '32px auto'
                  }}
                ></div>

                {/* Explicación */}
                <div>
                  <p 
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'rgba(255, 255, 255, 0.9)',
                      marginBottom: '12px'
                    }}
                  >
                    Explicación
                  </p>
                  <p 
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '14px',
                      color: '#FFFFFF',
                      lineHeight: '1.8',
                      textAlign: 'left'
                    }}
                  >
                    Aplicando integración por partes:<br />
                    u = x, dv = e<sup>x</sup> dx<br />
                    du = dx, v = e<sup>x</sup><br />
                    ∫u·dv = u·v - ∫v·du
                  </p>
                </div>

                {/* Botón voltear de nuevo */}
                <div className="flex flex-col items-center" style={{ marginTop: 'auto' }}>
                  <button
                    onClick={handleFlip}
                    className="flex items-center justify-center rounded-full transition-all hover:scale-110"
                    style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      color: '#FFFFFF',
                      border: 'none',
                      cursor: 'pointer',
                      marginTop: '20px',
                      marginBottom: '8px'
                    }}
                  >
                    <RotateCw size={24} />
                  </button>
                  <span 
                    style={{ 
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '11px',
                      color: 'rgba(255, 255, 255, 0.9)'
                    }}
                  >
                    Voltear de nuevo
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* COMPONENTE 4: OPCIONES MÚLTIPLES (Solo en modo QUIZ) */}
      {mode === 'quiz' && (
        <div 
          className="mx-auto mt-4 space-y-2"
          style={{ maxWidth: '343px', padding: '0 16px' }}
        >
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => !isVerified && setSelectedOption(option.id)}
              disabled={isVerified}
              style={getOptionStyle(option.id)}
              onMouseEnter={(e) => {
                if (!isVerified && selectedOption !== option.id) {
                  e.currentTarget.style.borderColor = '#9B7EC7';
                  e.currentTarget.style.backgroundColor = '#F3EBFF';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isVerified && selectedOption !== option.id) {
                  e.currentTarget.style.borderColor = '#E6D5F0';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.transform = 'translateX(0)';
                }
              }}
            >
              {/* Badge */}
              <div style={getBadgeStyle(option.id)}>
                {option.label}
              </div>

              {/* Texto */}
              <span style={getTextStyle(option.id)}>
                {option.text}
              </span>

              {/* Icons de verificación */}
              {isVerified && option.id === correctAnswer && (
                <Check size={24} style={{ color: '#FFFFFF', flexShrink: 0 }} strokeWidth={3} />
              )}
              {isVerified && selectedOption === option.id && selectedOption !== correctAnswer && (
                <X size={24} style={{ color: '#FFFFFF', flexShrink: 0 }} strokeWidth={3} />
              )}
            </button>
          ))}
        </div>
      )}

      {/* COMPONENTE 5: BOTÓN VERIFICAR/SIGUIENTE (Solo en modo QUIZ) */}
      {mode === 'quiz' && (
        <div className="flex justify-center" style={{ marginTop: '16px', paddingBottom: '20px' }}>
          {!isVerified ? (
            <button
              onClick={handleVerify}
              disabled={selectedOption === null}
              className="transition-all"
              style={{
                width: '280px',
                height: '48px',
                backgroundColor: selectedOption !== null ? '#9B7EC7' : '#CCCCCC',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 800,
                fontSize: '14px',
                textTransform: 'uppercase',
                boxShadow: selectedOption !== null ? '0 6px 20px rgba(155, 126, 199, 0.4)' : 'none',
                cursor: selectedOption !== null ? 'pointer' : 'not-allowed'
              }}
              onMouseEnter={(e) => {
                if (selectedOption !== null) {
                  e.currentTarget.style.backgroundColor = '#7952B3';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(155, 126, 199, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedOption !== null) {
                  e.currentTarget.style.backgroundColor = '#9B7EC7';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(155, 126, 199, 0.4)';
                }
              }}
            >
              Verificar Respuesta
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center justify-center gap-2 transition-all"
              style={{
                width: '280px',
                height: '56px',
                backgroundColor: isCorrect ? '#10B981' : '#9B7EC7',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 800,
                fontSize: '16px',
                textTransform: 'uppercase',
                boxShadow: `0 6px 20px rgba(${isCorrect ? '16, 185, 129' : '155, 126, 199'}, 0.4)`,
                cursor: 'pointer'
              }}
            >
              Siguiente Pregunta
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      )}

      {/* COMPONENTE 4: NAVEGACIÓN (Solo en modo FLASHCARD) */}
      {mode === 'flashcard' && (
        <div 
          className="flex justify-between"
          style={{ marginTop: '40px', padding: '0 16px', paddingBottom: '24px' }}
        >
          {/* Botón Anterior */}
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 1}
            className="flex items-center gap-2 transition-all"
            style={{
              width: '140px',
              height: '48px',
              padding: '12px 20px',
              backgroundColor: '#FFFFFF',
              border: '2px solid #9B7EC7',
              borderRadius: '12px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              color: '#9B7EC7',
              cursor: currentQuestion === 1 ? 'not-allowed' : 'pointer',
              opacity: currentQuestion === 1 ? 0.4 : 1
            }}
            onMouseEnter={(e) => {
              if (currentQuestion !== 1) {
                e.currentTarget.style.backgroundColor = '#F3EBFF';
                e.currentTarget.style.borderColor = '#7952B3';
              }
            }}
            onMouseLeave={(e) => {
              if (currentQuestion !== 1) {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.borderColor = '#9B7EC7';
              }
            }}
          >
            <ChevronLeft size={18} />
            Anterior
          </button>

          {/* Botón Siguiente */}
          <button
            onClick={handleNext}
            disabled={currentQuestion === totalQuestions}
            className="flex items-center gap-2 transition-all"
            style={{
              width: '140px',
              height: '48px',
              padding: '12px 20px',
              backgroundColor: '#9B7EC7',
              border: 'none',
              borderRadius: '12px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              color: '#FFFFFF',
              cursor: currentQuestion === totalQuestions ? 'not-allowed' : 'pointer',
              opacity: currentQuestion === totalQuestions ? 0.4 : 1
            }}
            onMouseEnter={(e) => {
              if (currentQuestion !== totalQuestions) {
                e.currentTarget.style.backgroundColor = '#7952B3';
                e.currentTarget.style.transform = 'translateX(4px)';
              }
            }}
            onMouseLeave={(e) => {
              if (currentQuestion !== totalQuestions) {
                e.currentTarget.style.backgroundColor = '#9B7EC7';
                e.currentTarget.style.transform = 'translateX(0)';
              }
            }}
          >
            Siguiente
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* COMPONENTE 6: ADA HELPER */}
      <div 
        className="fixed cursor-pointer group"
        style={{
          bottom: '24px',
          right: '24px',
          zIndex: 50
        }}
        title="¿Necesitas una pista?"
      >
        <div
          className="flex items-center justify-center rounded-full transition-all"
          style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#9B7EC7',
            border: '4px solid #7952B3',
            boxShadow: '0 6px 20px rgba(155, 126, 199, 0.5)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(155, 126, 199, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(155, 126, 199, 0.5)';
          }}
        >
          <ImageWithFallback 
            src={muuuLogo} 
            alt="Ada Helper" 
            style={{ width: '64px', height: '64px', objectFit: 'contain' }}
          />
        </div>

        {/* Tooltip */}
        <div 
          className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #9B7EC7',
            borderRadius: '12px',
            padding: '16px',
            maxWidth: '200px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
        >
          <p 
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '13px',
              color: '#4A4A4A',
              lineHeight: '1.4',
              margin: 0
            }}
          >
            Pista: Recuerda la nemotecnia 'Un día vi una vaca...'
          </p>
          {/* Arrow */}
          <div 
            style={{
              position: 'absolute',
              bottom: '-10px',
              right: '30px',
              width: '0',
              height: '0',
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderTop: '10px solid #9B7EC7'
            }}
          ></div>
        </div>
      </div>

      {/* CSS para animaciones */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}