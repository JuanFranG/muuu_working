import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Check, X, Flame, Clock, Home, Loader2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import muuuLogo from 'figma:asset/15c96d9f13a3f65cf154aaca4e2380bdb312d1a5.png';
import { FlashcardNemotecnia } from './FlashcardNemotecnia';
import { PonteAPruebaDocentes } from './PonteAPruebaDocentes';
import {
  listarFlashcardsDocenteAPI,
  type FlashcardQuizAPI,
} from '../services/api';

interface PonteAPruebaProps {
  onBack: () => void;
}

// ─────────────────────────────────────────────────────────────
// Componente principal — maneja el flujo:
//   'selectTeacher' → PonteAPruebaDocentes
//   'loading'       → spinner mientras carga flashcards
//   'quiz'          → quiz real
//   'noFlashcards'  → docente sin flashcards publicadas
// ─────────────────────────────────────────────────────────────
type PATScreen = 'selectTeacher' | 'loading' | 'quiz' | 'noFlashcards';

export function PonteAPrueba({ onBack }: PonteAPruebaProps) {
  const [screen, setScreen]           = useState<PATScreen>('selectTeacher');
  const [flashcards, setFlashcards]   = useState<FlashcardQuizAPI[]>([]);
  const [docenteNombre, setDocenteNombre] = useState('');

  // ── Cuando el estudiante selecciona un docente ─────────────
  const handleSelectTeacher = async (teacherId: string, teacherName: string) => {
    setDocenteNombre(teacherName);
    setScreen('loading');
    try {
      const fcs = await listarFlashcardsDocenteAPI(Number(teacherId));
      if (fcs.length === 0) {
        setScreen('noFlashcards');
      } else {
        setFlashcards(fcs);
        setScreen('quiz');
      }
    } catch {
      setFlashcards([]);
      setScreen('noFlashcards');
    }
  };

  // ── Pantalla: Seleccionar docente ─────────────────────────
  if (screen === 'selectTeacher') {
    return (
      <PonteAPruebaDocentes
        onBack={onBack}
        onSelectTeacher={(id, name) => handleSelectTeacher(id, name)}
      />
    );
  }

  // ── Pantalla: Cargando ────────────────────────────────────
  if (screen === 'loading') {
    return (
      <div className="h-full flex flex-col items-center justify-center"
        style={{ background: 'linear-gradient(180deg, #F3EBFF 0%, #FFFFFF 100%)' }}>
        <Loader2 size={40} style={{ color: '#9B7EC7' }} className="animate-spin" />
        <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', color: '#7D7D7D', marginTop: '16px' }}>
          Cargando flashcards de {docenteNombre}...
        </p>
      </div>
    );
  }

  // ── Pantalla: Sin flashcards ──────────────────────────────
  if (screen === 'noFlashcards') {
    return (
      <div className="h-full flex flex-col items-center justify-center"
        style={{ background: 'linear-gradient(180deg, #F3EBFF 0%, #FFFFFF 100%)', padding: '24px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>📭</div>
        <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '20px',
          color: '#1E293B', textAlign: 'center', marginBottom: '8px' }}>
          Sin flashcards publicadas
        </h2>
        <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', color: '#7D7D7D',
          textAlign: 'center', marginBottom: '24px', lineHeight: '1.5' }}>
          {docenteNombre} aún no ha publicado flashcards de práctica.
        </p>
        <button onClick={() => setScreen('selectTeacher')}
          style={{ height: '48px', padding: '0 32px', backgroundColor: '#9B7EC7',
            color: '#FFFFFF', border: 'none', borderRadius: '12px',
            fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
          ← Elegir otro docente
        </button>
      </div>
    );
  }

  // ── Quiz: preparar datos de la flashcard actual ───────────
  return <QuizScreen flashcards={flashcards} docenteNombre={docenteNombre}
           onBack={onBack} onChangeTeacher={() => setScreen('selectTeacher')} />;
}

// ─────────────────────────────────────────────────────────────
// Sub-componente del quiz real (usa flashcards de la API)
// ─────────────────────────────────────────────────────────────
function QuizScreen({
  flashcards,
  docenteNombre,
  onBack,
  onChangeTeacher,
}: {
  flashcards:      FlashcardQuizAPI[];
  docenteNombre:   string;
  onBack:          () => void;
  onChangeTeacher: () => void;
}) {
  const [currentIdx, setCurrentIdx]     = useState(0);
  const totalQuestions                  = flashcards.length;
  const [lives, setLives]               = useState(3);
  const [correctAnswers, setCorrectAnswers]     = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [timeElapsed, setTimeElapsed]   = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isVerified, setIsVerified]     = useState(false);
  const [quizEnded, setQuizEnded]       = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showNemotecnia, setShowNemotecnia] = useState(false);

  // Flashcard actual
  const fc              = flashcards[currentIdx];
  const opciones        = fc?.opciones ?? [];
  // Índice de la opción correcta (para comparar con selectedOption)
  const correctAnswer   = opciones.findIndex(o => o.esCorrecta);

  // Temporizador
  useEffect(() => {
    if (!quizEnded && !quizCompleted) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizEnded, quizCompleted]);

  // Mapear opciones de la flashcard al formato del quiz
  const options = opciones.map((o, idx) => ({
    id:    idx,
    label: String.fromCharCode(65 + idx),  // A, B, C, D...
    text:  o.contenidoRespuesta,
  }));

  // Retroalimentación dinámica desde la API
  const feedbackTexts: Record<number, { title: string; text: string; emoji: string }> = {};
  opciones.forEach((o, idx) => {
    feedbackTexts[idx] = {
      title: o.esCorrecta ? '¡Muy bien!' : 'Casi...',
      text:  o.retroalimentacion || (o.esCorrecta
        ? 'Respuesta correcta.'
        : 'Esa no es la respuesta correcta. Revisa el procedimiento.'),
      emoji: o.esCorrecta ? '🎉' : '💡',
    };
  });

  const handleVerify = () => {
    if (selectedOption === null) return;
    setIsVerified(true);

    if (selectedOption === correctAnswer) {
      setCorrectAnswers(prev => prev + 1);
      setConsecutiveCorrect(prev => prev + 1);
    } else {
      setIncorrectAnswers(prev => prev + 1);
      const newLives = lives - 1;
      setLives(newLives);
      setConsecutiveCorrect(0);
      if (newLives === 0) setQuizEnded(true);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 >= totalQuestions) {
      setQuizCompleted(true);
      return;
    }
    setCurrentIdx(prev => prev + 1);
    setSelectedOption(null);
    setIsVerified(false);
    setShowNemotecnia(false);
  };

  const getOptionStyle = (optionId: number) => {
    const baseStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      minHeight: '56px',
      padding: '12px 16px',
      borderRadius: '12px',
      cursor: isVerified ? 'default' : 'pointer',
      transition: 'all 0.2s ease',
      fontFamily: 'Poppins, sans-serif',
      border: '2px solid #E6D5F0',
      backgroundColor: '#FFFFFF',
      marginBottom: '8px',
      opacity: 1,
    };

    // ── Después de verificar ─────────────────────────────────
    if (isVerified) {
      // Respuesta correcta → siempre verde
      if (optionId === correctAnswer) {
        return { ...baseStyle, border: '2px solid #10B981', backgroundColor: '#D1FAE5', opacity: 1 };
      }
      // Selección incorrecta → rojo
      if (selectedOption === optionId) {
        return { ...baseStyle, border: '2px solid #EF4444', backgroundColor: '#FEE2E2', opacity: 1 };
      }
      // Opciones no relevantes → atenuadas para no confundir
      return { ...baseStyle, border: '2px solid #E6D5F0', backgroundColor: '#FAFAFA', opacity: 0.5 };
    }

    // ── Antes de verificar ───────────────────────────────────
    if (selectedOption === optionId) {
      return { ...baseStyle, border: '2px solid #9B7EC7', backgroundColor: '#F3EBFF' };
    }

    return baseStyle;
  };

  // ── helpers ──────────────────────────────────────────────
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Pantalla de fin de prueba (3 fallos)
  if (quizEnded) {
    return (
      <div
        className="h-full flex flex-col items-center justify-center"
        style={{
          background: 'linear-gradient(180deg, #FEE2E2 0%, #FFFFFF 100%)',
          padding: '20px'
        }}
      >
        <div
          className="text-center"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '40px 30px',
            boxShadow: '0 8px 32px rgba(239, 68, 68, 0.2)',
            maxWidth: '340px',
            width: '100%'
          }}
        >
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>😔</div>
          
          <h2
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: '24px',
              color: '#1E293B',
              marginBottom: '12px'
            }}
          >
            ¡Prueba Terminada!
          </h2>
          
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              color: '#7D7D7D',
              marginBottom: '24px',
              lineHeight: '1.5'
            }}
          >
            Has cometido 3 errores. No te preocupes, ¡puedes intentarlo nuevamente!
          </p>

          {/* Resumen */}
          <div
            style={{
              backgroundColor: '#F3F4F6',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px'
            }}
          >
            <div className="flex justify-between mb-2">
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', color: '#7D7D7D' }}>
                Correctas:
              </span>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: 600, color: '#10B981' }}>
                {correctAnswers}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', color: '#7D7D7D' }}>
                Incorrectas:
              </span>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: 600, color: '#EF4444' }}>
                {incorrectAnswers}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', color: '#7D7D7D' }}>
                Tiempo:
              </span>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                {formatTime(timeElapsed)}
              </span>
            </div>
          </div>

          {/* Botones */}
          <button
            onClick={() => { setCurrentIdx(0); setLives(3); setCorrectAnswers(0); setIncorrectAnswers(0); setConsecutiveCorrect(0); setTimeElapsed(0); setSelectedOption(null); setIsVerified(false); setQuizEnded(false); setQuizCompleted(false); }}
            className="w-full mb-3"
            style={{
              height: '48px',
              backgroundColor: '#9B7EC7',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(155, 126, 199, 0.4)'
            }}
          >
            Intentar de Nuevo
          </button>

          <button
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2"
            style={{
              height: '48px',
              backgroundColor: '#F3F4F6',
              color: '#1E293B',
              border: 'none',
              borderRadius: '12px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <Home size={18} />
            Volver al Home
          </button>
        </div>
      </div>
    );
  }

  // Pantalla de prueba completada
  if (quizCompleted) {
    const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
    
    return (
      <div
        className="h-full flex flex-col items-center justify-center"
        style={{
          background: 'linear-gradient(180deg, #D1FAE5 0%, #FFFFFF 100%)',
          padding: '20px'
        }}
      >
        <div
          className="text-center"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '40px 30px',
            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.2)',
            maxWidth: '340px',
            width: '100%'
          }}
        >
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
          
          <h2
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: '24px',
              color: '#1E293B',
              marginBottom: '12px'
            }}
          >
            ¡Felicitaciones!
          </h2>
          
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              color: '#7D7D7D',
              marginBottom: '24px',
              lineHeight: '1.5'
            }}
          >
            Has completado la prueba con éxito
          </p>

          {/* Resumen */}
          <div
            style={{
              backgroundColor: '#F3F4F6',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px'
            }}
          >
            <div
              style={{
                fontSize: '36px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                color: '#10B981',
                marginBottom: '8px'
              }}
            >
              {accuracy}%
            </div>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', color: '#7D7D7D', marginBottom: '16px' }}>
              Precisión
            </p>
            
            <div className="flex justify-between mb-2">
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', color: '#7D7D7D' }}>
                Correctas:
              </span>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: 600, color: '#10B981' }}>
                {correctAnswers}/{totalQuestions}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', color: '#7D7D7D' }}>
                Incorrectas:
              </span>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: 600, color: '#EF4444' }}>
                {incorrectAnswers}/{totalQuestions}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', color: '#7D7D7D' }}>
                Tiempo Total:
              </span>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                {formatTime(timeElapsed)}
              </span>
            </div>
          </div>

          {/* Botones */}
          <button
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2"
            style={{
              height: '48px',
              backgroundColor: '#10B981',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
            }}
          >
            <Home size={18} />
            Volver al Home
          </button>
        </div>
      </div>
    );
  }

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
          Si sales ahora, perderás todo el progreso de esta prueba
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
            Continuar
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
        background: 'linear-gradient(180deg, #F3EBFF 0%, #FFFFFF 100%)'
      }}
    >
      {/* Modal de confirmación */}
      {showExitModal && <ExitConfirmationModal />}

      {/* HEADER STICKY */}
      <div
        className="sticky top-0 z-50"
        style={{
          backgroundColor: '#FFFFFF',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        }}
      >
        {/* Fila 1: Botón volver, título y corazones */}
        <div
          className="flex items-center justify-between"
          style={{
            height: '60px',
            padding: '0 16px'
          }}
        >
          <button
            onClick={() => setShowExitModal(true)}
            className="flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            style={{ width: '32px', height: '32px', color: '#9B7EC7' }}
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>

          <h1
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: '16px',
              color: '#1E293B'
            }}
          >
            Ponte a Prueba 🏆
          </h1>

          {/* Corazones al lado del título */}
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((life) => (
              <Heart
                key={life}
                size={18}
                fill={life <= lives ? '#EF4444' : 'transparent'}
                color={life <= lives ? '#EF4444' : '#CBD5E1'}
                strokeWidth={2}
              />
            ))}
          </div>
        </div>

        {/* Fila 2: Stats con recuadros */}
        <div
          style={{
            padding: '12px 16px 16px 16px',
            borderTop: '1px solid #F3F4F6'
          }}
        >
          <div className="flex items-center justify-center gap-2">
            {/* Correctas */}
            <div
              style={{
                backgroundColor: '#D1FAE5',
                borderRadius: '8px',
                padding: '6px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981'
                }}
              >
                <Check size={10} color="#FFFFFF" strokeWidth={3} />
              </div>
              <span
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: '12px',
                  color: '#10B981'
                }}
              >
                {correctAnswers}
              </span>
            </div>

            {/* Incorrectas */}
            <div
              style={{
                backgroundColor: '#FEE2E2',
                borderRadius: '8px',
                padding: '6px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: '#EF4444'
                }}
              >
                <X size={10} color="#FFFFFF" strokeWidth={3} />
              </div>
              <span
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: '12px',
                  color: '#EF4444'
                }}
              >
                {incorrectAnswers}
              </span>
            </div>

            {/* Racha consecutiva */}
            <div
              style={{
                backgroundColor: consecutiveCorrect >= 2 ? '#FEF3C7' : '#F3F4F6',
                borderRadius: '8px',
                padding: '6px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: consecutiveCorrect >= 2 ? '#F59E0B' : '#9CA3AF'
                }}
              >
                <Flame size={10} color="#FFFFFF" strokeWidth={3} />
              </div>
              <span
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: '12px',
                  color: consecutiveCorrect >= 2 ? '#F59E0B' : '#9CA3AF'
                }}
              >
                {consecutiveCorrect}
              </span>
            </div>

            {/* Temporizador */}
            <div
              style={{
                backgroundColor: '#E0E7FF',
                borderRadius: '8px',
                padding: '6px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Clock size={14} color="#4F46E5" strokeWidth={2.5} />
              <span
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: '12px',
                  color: '#4F46E5'
                }}
              >
                {formatTime(timeElapsed)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 flex flex-col" style={{ padding: '20px' }}>
        {/* Barra de progreso */}
        <div style={{ marginBottom: '16px' }}>
          <div
            className="flex items-center justify-between mb-2"
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '11px',
              color: '#7D7D7D'
            }}
          >
            <span>Pregunta {currentIdx + 1} de {totalQuestions}</span>
            <span>{Math.round(((currentIdx + 1) / totalQuestions) * 100)}%</span>
          </div>
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#E6D5F0',
              borderRadius: '4px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${((currentIdx + 1) / totalQuestions) * 100}%`,
                height: '100%',
                backgroundColor: '#9B7EC7',
                borderRadius: '4px',
                transition: 'width 0.3s ease'
              }}
            ></div>
          </div>
        </div>

        {/* Categoría */}
        <div
          className="inline-block self-start"
          style={{
            backgroundColor: '#E6D5F0',
            color: '#7952B3',
            borderRadius: '16px',
            padding: '6px 12px',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            fontSize: '10px',
            textTransform: 'uppercase',
            marginBottom: '16px'
          }}
        >
          {fc?.tema ?? 'Integración'}
        </div>

        {/* Subtítulo: docente */}
        <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px',
          color: '#9B7EC7', marginBottom: '8px', fontWeight: 600 }}>
          Flashcard de {docenteNombre}
        </p>

        {/* Título */}
        <p
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 700,
            fontSize: '14px',
            color: '#1E293B',
            marginBottom: '16px'
          }}
        >
          Resuelve la siguiente integral:
        </p>

        {/* Integral con render básico */}
        <div
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: '30px',
            color: '#7952B3',
            fontStyle: 'italic',
            margin: '0 0 24px 0',
            letterSpacing: '1px',
            lineHeight: '1.8',
            padding: '20px 24px',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 4px 16px rgba(155, 126, 199, 0.15)',
            position: 'relative'
          }}
        >
          <div className="flex items-center justify-center mb-3"
            dangerouslySetInnerHTML={{ __html: fc?.integral ?? '∫ f(x) dx' }} />
          
          {/* Botón nemotécnica dentro del cuadro */}
          <button
            onClick={() => setShowNemotecnia(!showNemotecnia)}
            className="absolute top-4 right-4"
            style={{
              backgroundColor: '#9B7EC7',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              fontSize: '12px',
              cursor: 'pointer',
              padding: '6px 12px'
            }}
          >
            {showNemotecnia ? 'Ocultar' : 'Nemotécnica'}
          </button>
        </div>

        {/* Mostrar flashcard cuando showNemotecnia es true */}
        {showNemotecnia ? (
          <FlashcardNemotecnia
            onClose={() => setShowNemotecnia(false)}
            question={fc?.integral ?? '∫ f(x) dx'}
            answer={opciones.find(o => o.esCorrecta)?.contenidoRespuesta ?? '—'}
          />
        ) : (
          <>
            {/* Opciones */}
            <div style={{ marginBottom: '20px' }}>
              {options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => !isVerified && setSelectedOption(option.id)}
                  disabled={isVerified}
                  style={getOptionStyle(option.id)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 700,
                        fontSize: '14px',
                        // Solo se colorean las opciones realmente activas
                        backgroundColor: isVerified && option.id === correctAnswer
                          ? '#10B981'
                          : isVerified && selectedOption === option.id && selectedOption !== correctAnswer
                          ? '#EF4444'
                          : !isVerified && selectedOption === option.id
                          ? '#9B7EC7'
                          : '#E6D5F0',
                        // Texto blanco SOLO en opciones realmente destacadas (fix del bug)
                        color: (isVerified && option.id === correctAnswer)
                          || (isVerified && selectedOption === option.id)
                          || (!isVerified && selectedOption === option.id)
                          ? '#FFFFFF' : '#7952B3',
                        flexShrink: 0
                      }}
                    >
                      {option.label}
                    </div>
                    <span
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 600,
                        fontSize: '15px',
                        color: '#1E293B',
                        flex: 1,
                        textAlign: 'left'
                      }}
                    >
                      {option.text}
                    </span>
                  </div>

                  {isVerified && option.id === correctAnswer && (
                    <Check size={24} color="#10B981" strokeWidth={3} />
                  )}
                  {isVerified && selectedOption === option.id && selectedOption !== correctAnswer && (
                    <X size={24} color="#EF4444" strokeWidth={3} />
                  )}
                </button>
              ))}
            </div>

            {/* Card de feedback - aparece después de verificar */}
            {isVerified && selectedOption !== null && (
              <div
                style={{
                  marginBottom: '20px',
                  padding: '16px',
                  borderRadius: '16px',
                  backgroundColor: selectedOption === correctAnswer ? '#D1FAE5' : '#FEE2E2',
                  border: `3px solid ${selectedOption === correctAnswer ? '#10B981' : '#EF4444'}`,
                  boxShadow: `0 4px 16px ${selectedOption === correctAnswer ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                  animation: 'slideUp 0.3s ease-out'
                }}
              >
                <div className="flex items-start gap-3">
                  <div style={{ fontSize: '24px', flexShrink: 0 }}>
                    {feedbackTexts[selectedOption].emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 700,
                        fontSize: '16px',
                        color: selectedOption === correctAnswer ? '#10B981' : '#EF4444',
                        marginBottom: '8px'
                      }}
                    >
                      {feedbackTexts[selectedOption].title}
                    </h4>
                    <p
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '13px',
                        color: '#1E293B',
                        lineHeight: '1.6'
                      }}
                    >
                      {feedbackTexts[selectedOption].text}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Botón Verificar / Siguiente */}
            <div className="mt-auto pb-4">
              {!isVerified ? (
                <button
                  onClick={handleVerify}
                  disabled={selectedOption === null}
                  className="w-full transition-all"
                  style={{
                    height: '52px',
                    backgroundColor: selectedOption !== null ? '#9B7EC7' : '#CCCCCC',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 800,
                    fontSize: '15px',
                    textTransform: 'uppercase',
                    boxShadow: selectedOption !== null ? '0 6px 20px rgba(155, 126, 199, 0.4)' : 'none',
                    cursor: selectedOption !== null ? 'pointer' : 'not-allowed'
                  }}
                >
                  Verificar Respuesta
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="w-full transition-all"
                  style={{
                    height: '52px',
                    backgroundColor: selectedOption === correctAnswer ? '#10B981' : '#9B7EC7',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 800,
                    fontSize: '15px',
                    textTransform: 'uppercase',
                    boxShadow: `0 6px 20px rgba(${selectedOption === correctAnswer ? '16, 185, 129' : '155, 126, 199'}, 0.4)`,
                    cursor: 'pointer'
                  }}
                >
                  Siguiente Pregunta
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}