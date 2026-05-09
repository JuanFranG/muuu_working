import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Heart, Check, X, Flame, Clock, Home } from 'lucide-react';
import { FlashcardNemotecnia } from './FlashcardNemotecnia';
import { guardarResultadoQuizAPI, type ResultadoQuizItem, type FlashcardQuizAPI } from '../services/api';
import { useThemeColors } from '../contexts/SettingsContext';
import { renderMath } from '../utils/renderMath';

// ─────────────────────────────────────────────────────────────
//  QuizScreen — componente exportable del quiz de flashcards
//  Recibe las flashcards ya cargadas y un contextLabel.
//  Soporta múltiples opciones correctas y renderizado LaTeX.
// ─────────────────────────────────────────────────────────────

export interface QuizScreenProps {
  flashcards:      FlashcardQuizAPI[];
  contextLabel:    string;
  onBack:          () => void;
  onChangeContext: () => void;
}

export function QuizScreen({
  flashcards,
  contextLabel,
  onBack,
  onChangeContext,
}: QuizScreenProps) {
  const c = useThemeColors('student');
  const [currentIdx, setCurrentIdx]                 = useState(0);
  const totalQuestions                              = flashcards.length;
  const [lives, setLives]                           = useState(3);
  const [correctAnswers, setCorrectAnswers]         = useState(0);
  const [incorrectAnswers, setIncorrectAnswers]     = useState(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [timeElapsed, setTimeElapsed]               = useState(0);
  // Selección múltiple de opciones
  const [selectedOptions, setSelectedOptions]       = useState<number[]>([]);
  const [isVerified, setIsVerified]                 = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect]   = useState(false);
  const [quizEnded, setQuizEnded]                   = useState(false);
  const [quizCompleted, setQuizCompleted]           = useState(false);
  const [showExitModal, setShowExitModal]           = useState(false);
  const [showNemotecnia, setShowNemotecnia]         = useState(false);
  const [puntosGanados, setPuntosGanados]           = useState(0);

  const flashcardResultsRef = useRef<ResultadoQuizItem[]>([]);
  const resultadoGuardadoRef = useRef(false);

  const fc      = flashcards[currentIdx];
  const opciones = fc?.opciones ?? [];

  // Índices de todas las opciones correctas (soporta 1 o más)
  const correctIndices = opciones
    .map((o, i) => (o.esCorrecta ? i : -1))
    .filter(i => i >= 0);

  // Temporizador
  useEffect(() => {
    if (!quizEnded && !quizCompleted) {
      const timer = setInterval(() => setTimeElapsed(prev => prev + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [quizEnded, quizCompleted]);

  // Guardar resultado al terminar
  useEffect(() => {
    if ((!quizEnded && !quizCompleted) || resultadoGuardadoRef.current) return;
    resultadoGuardadoRef.current = true;
    const payload = {
      flashcards:  flashcardResultsRef.current,
      correctas:   correctAnswers,
      incorrectas: incorrectAnswers,
      tiempo:      timeElapsed,
    };
    console.log('[Quiz] → Enviando resultado:', JSON.stringify(payload));
    guardarResultadoQuizAPI(payload).then(r => {
      console.log('[Quiz] ← Respuesta:', JSON.stringify(r));
      setPuntosGanados(r.puntosGanados);
    }).catch(err => console.error('[Quiz] ✗ Error:', err));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizEnded, quizCompleted]);

  const options = opciones.map((o, idx) => ({
    id:    idx,
    label: String.fromCharCode(65 + idx),
    text:  o.contenidoRespuesta,
  }));

  // ── Toggle de selección (múltiple) ───────────────────────────
  const toggleOption = (optionId: number) => {
    if (isVerified) return;
    setSelectedOptions(prev =>
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  // ── Verificar ─────────────────────────────────────────────────
  const handleVerify = () => {
    if (selectedOptions.length === 0) return;
    setIsVerified(true);

    const isCorrect =
      correctIndices.length === selectedOptions.length &&
      correctIndices.every(i => selectedOptions.includes(i));

    setLastAnswerCorrect(isCorrect);

    if (fc?.id_flashcard) {
      flashcardResultsRef.current.push({
        id_flashcard: fc.id_flashcard,
        resultado: isCorrect ? 'correcta' : 'incorrecta',
      });
    }

    if (isCorrect) {
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
    setSelectedOptions([]);
    setIsVerified(false);
    setLastAnswerCorrect(false);
    setShowNemotecnia(false);
  };

  // ── Estilos de opciones ───────────────────────────────────────
  const getOptionStyle = (optionId: number) => {
    const isSelected   = selectedOptions.includes(optionId);
    const isCorrectOpt = correctIndices.includes(optionId);
    const base = {
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
      border: `2px solid ${c.purplePale}`,
      backgroundColor: c.bgCard,
      marginBottom: '8px',
      opacity: 1 as number,
    };
    if (isVerified) {
      if (isCorrectOpt)
        return { ...base, border: '2px solid #10B981', backgroundColor: '#D1FAE5', opacity: 1 };
      if (isSelected)
        return { ...base, border: '2px solid #EF4444', backgroundColor: '#FEE2E2', opacity: 1 };
      return { ...base, border: `2px solid ${c.purplePale}`, backgroundColor: c.bgCardAlt, opacity: 0.5 };
    }
    if (isSelected)
      return { ...base, border: `2px solid ${c.purple}`, backgroundColor: c.purpleSoft };
    return base;
  };

  // Texto de la opción (oscuro cuando el fondo es claro al verificar)
  const getOptionTextColor = (optionId: number): string => {
    if (!isVerified) return c.textPrimary;
    if (correctIndices.includes(optionId))          return '#047857';
    if (selectedOptions.includes(optionId))         return '#991B1B';
    return c.textMuted;
  };

  // ── Feedback unificado (soporta múltiples correctas) ─────────
  const getFeedback = () => {
    if (!isVerified) return null;
    if (lastAnswerCorrect) {
      const firstCorrect = opciones[correctIndices[0]];
      return {
        title: '¡Muy bien!',
        text:  firstCorrect?.retroalimentacion || 'Respuesta correcta.',
        emoji: '🎉',
        color: '#10B981',
      };
    }
    // Incorrecta: mostrar cuáles eran las correctas
    const correctLetters = correctIndices.map(i => String.fromCharCode(65 + i)).join(', ');
    // Retroalimentación de la primera opción incorrecta seleccionada
    const firstWrong = selectedOptions.find(i => !correctIndices.includes(i));
    const wrongFeedback = firstWrong !== undefined
      ? opciones[firstWrong]?.retroalimentacion
      : '';
    const plural = correctIndices.length > 1;
    return {
      title: 'Casi...',
      text:  wrongFeedback ||
        `La${plural ? 's' : ''} opción${plural ? 'es' : ''} correcta${plural ? 's eran' : ' era'}: ${correctLetters}.`,
      emoji: '💡',
      color: '#EF4444',
    };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setLives(3);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setConsecutiveCorrect(0);
    setTimeElapsed(0);
    setSelectedOptions([]);
    setIsVerified(false);
    setLastAnswerCorrect(false);
    setQuizEnded(false);
    setQuizCompleted(false);
    setPuntosGanados(0);
    flashcardResultsRef.current  = [];
    resultadoGuardadoRef.current = false;
  };

  // ── Pantalla: quiz terminado por 3 fallos ─────────────────────
  if (quizEnded) {
    return (
      <div className="h-full flex flex-col items-center justify-center"
        style={{ background: `linear-gradient(180deg, ${c.errorBg} 0%, ${c.bgPage} 100%)`, padding: '20px' }}>
        <div className="text-center" style={{ backgroundColor: c.bgCard, borderRadius: '24px', padding: '40px 30px', boxShadow: '0 8px 32px rgba(239,68,68,0.2)', maxWidth: '340px', width: '100%' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>😔</div>
          <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '24px', color: c.textPrimary, marginBottom: '12px' }}>
            ¡Prueba Terminada!
          </h2>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', color: c.textMuted, marginBottom: '24px', lineHeight: '1.5' }}>
            Has cometido 3 errores. No te preocupes, ¡puedes intentarlo nuevamente!
          </p>
          <div style={{ backgroundColor: c.bgSurface, borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
            <div className="flex justify-between mb-2">
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', color: c.textMuted }}>Correctas:</span>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: 600, color: '#10B981' }}>{correctAnswers}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', color: c.textMuted }}>Incorrectas:</span>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: 600, color: '#EF4444' }}>{incorrectAnswers}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', color: c.textMuted }}>Tiempo:</span>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: 600, color: c.textPrimary }}>{formatTime(timeElapsed)}</span>
            </div>
          </div>
          <button onClick={resetQuiz} className="w-full mb-3" style={{ height: '48px', backgroundColor: c.purple, color: '#FFFFFF', border: 'none', borderRadius: '12px', fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(155,126,199,0.4)' }}>
            Intentar de Nuevo
          </button>
          <button onClick={onChangeContext} className="w-full mb-2" style={{ height: '48px', backgroundColor: c.purpleSoft, color: c.purpleDark, border: 'none', borderRadius: '12px', fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
            Cambiar selección
          </button>
          <button onClick={onBack} className="w-full flex items-center justify-center gap-2" style={{ height: '48px', backgroundColor: c.bgSurface, color: c.textPrimary, border: 'none', borderRadius: '12px', fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
            <Home size={18} /> Volver al Home
          </button>
        </div>
      </div>
    );
  }

  // ── Pantalla: prueba completada ───────────────────────────────
  if (quizCompleted) {
    const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
    return (
      <div className="h-full flex flex-col items-center justify-center"
        style={{ background: `linear-gradient(180deg, #D1FAE5 0%, ${c.bgPage} 100%)`, padding: '20px' }}>
        <div className="text-center" style={{ backgroundColor: c.bgCard, borderRadius: '24px', padding: '40px 30px', boxShadow: '0 8px 32px rgba(16,185,129,0.2)', maxWidth: '340px', width: '100%' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
          <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '24px', color: c.textPrimary, marginBottom: '12px' }}>
            ¡Felicitaciones!
          </h2>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', color: c.textMuted, marginBottom: '24px', lineHeight: '1.5' }}>
            Has completado la prueba con éxito
          </p>
          <div style={{ backgroundColor: c.bgSurface, borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
            <div style={{ fontSize: '36px', fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#10B981', marginBottom: '8px' }}>{accuracy}%</div>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', color: c.textMuted, marginBottom: '16px' }}>Precisión</p>
            <div className="flex justify-between mb-2">
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', color: c.textMuted }}>Correctas:</span>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: 600, color: '#10B981' }}>{correctAnswers}/{totalQuestions}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', color: c.textMuted }}>Incorrectas:</span>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: 600, color: '#EF4444' }}>{incorrectAnswers}/{totalQuestions}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', color: c.textMuted }}>Tiempo Total:</span>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: 600, color: c.textPrimary }}>{formatTime(timeElapsed)}</span>
            </div>
          </div>
          {puntosGanados > 0 && (
            <div style={{ backgroundColor: '#FEF9C3', border: '2px solid #FDE047', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '20px' }}>⭐</span>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '14px', color: '#92400E' }}>
                +{puntosGanados} puntos ganados
              </span>
            </div>
          )}
          <button onClick={onBack} className="w-full flex items-center justify-center gap-2" style={{ height: '48px', backgroundColor: '#10B981', color: '#FFFFFF', border: 'none', borderRadius: '12px', fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(16,185,129,0.4)' }}>
            <Home size={18} /> Volver al Home
          </button>
        </div>
      </div>
    );
  }

  // ── Modal de confirmación de salida ──────────────────────────
  const ExitConfirmationModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: c.bgOverlay }}>
      <div style={{ backgroundColor: c.bgCard, borderRadius: '20px', padding: '24px', maxWidth: '320px', width: '90%', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
        <div style={{ fontSize: '36px', textAlign: 'center', marginBottom: '12px' }}>⚠️</div>
        <h3 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '18px', color: c.textPrimary, textAlign: 'center', marginBottom: '8px' }}>
          ¿Estás seguro/a?
        </h3>
        <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', color: c.textMuted, textAlign: 'center', marginBottom: '20px', lineHeight: '1.4' }}>
          Si sales ahora, perderás todo el progreso de esta prueba
        </p>
        <div className="flex gap-2">
          <button onClick={() => setShowExitModal(false)} style={{ flex: 1, height: '44px', backgroundColor: c.bgSurface, color: c.textPrimary, border: 'none', borderRadius: '10px', fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
            Continuar
          </button>
          <button onClick={onBack} style={{ flex: 1, height: '44px', backgroundColor: '#EF4444', color: '#FFFFFF', border: 'none', borderRadius: '10px', fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(239,68,68,0.3)' }}>
            Salir
          </button>
        </div>
      </div>
    </div>
  );

  const feedback = getFeedback();

  // ── Quiz principal ────────────────────────────────────────────
  return (
    <div className="h-full relative overflow-y-auto flex flex-col" style={{ background: c.bgGradient }}>
      {showExitModal && <ExitConfirmationModal />}

      {/* HEADER STICKY */}
      <div className="sticky top-0 z-50" style={{ backgroundColor: c.bgCard, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div className="flex items-center justify-between" style={{ height: '60px', padding: '0 16px' }}>
          <button onClick={() => setShowExitModal(true)}
            className="flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            style={{ width: '32px', height: '32px', color: c.purple }}>
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '16px', color: c.textPrimary }}>
            Ponte a Prueba
          </h1>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(life => (
              <Heart key={life} size={18}
                fill={life <= lives ? '#EF4444' : 'transparent'}
                color={life <= lives ? '#EF4444' : c.textMuted}
                strokeWidth={2} />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ padding: '12px 16px 16px 16px', borderTop: `1px solid ${c.border}` }}>
          <div className="flex items-center justify-center gap-2">
            <div style={{ backgroundColor: '#D1FAE5', borderRadius: '8px', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div className="flex items-center justify-center" style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#10B981' }}>
                <Check size={10} color="#FFFFFF" strokeWidth={3} />
              </div>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '12px', color: '#10B981' }}>{correctAnswers}</span>
            </div>
            <div style={{ backgroundColor: '#FEE2E2', borderRadius: '8px', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div className="flex items-center justify-center" style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#EF4444' }}>
                <X size={10} color="#FFFFFF" strokeWidth={3} />
              </div>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '12px', color: '#EF4444' }}>{incorrectAnswers}</span>
            </div>
            <div style={{ backgroundColor: consecutiveCorrect >= 2 ? '#FEF3C7' : c.bgSurface, borderRadius: '8px', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div className="flex items-center justify-center" style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: consecutiveCorrect >= 2 ? '#F59E0B' : c.textMuted }}>
                <Flame size={10} color="#FFFFFF" strokeWidth={3} />
              </div>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '12px', color: consecutiveCorrect >= 2 ? '#F59E0B' : c.textMuted }}>{consecutiveCorrect}</span>
            </div>
            <div style={{ backgroundColor: '#E0E7FF', borderRadius: '8px', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={14} color="#4F46E5" strokeWidth={2.5} />
              <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '12px', color: '#4F46E5' }}>{formatTime(timeElapsed)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 flex flex-col" style={{ padding: '20px' }}>

        {/* Barra de progreso */}
        <div style={{ marginBottom: '16px' }}>
          <div className="flex items-center justify-between mb-2" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: c.textMuted }}>
            <span>Pregunta {currentIdx + 1} de {totalQuestions}</span>
            <span>{Math.round(((currentIdx + 1) / totalQuestions) * 100)}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: c.purplePale, borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%`, height: '100%', backgroundColor: c.purple, borderRadius: '4px', transition: 'width 0.3s ease' }} />
          </div>
        </div>

        {/* Categoría */}
        <div className="inline-block self-start" style={{ backgroundColor: c.purplePale, color: c.purpleDark, borderRadius: '16px', padding: '6px 12px', fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '10px', textTransform: 'uppercase', marginBottom: '16px' }}>
          {fc?.tema ?? 'General'}
        </div>

        <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: c.purple, marginBottom: '8px', fontWeight: 600 }}>
          Flashcard — {contextLabel}
        </p>
        <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '14px', color: c.textPrimary, marginBottom: '16px' }}>
          Resuelve la siguiente integral:
        </p>

        {/* ── Tarjeta integral ────────────────────────────────── */}
        <div style={{ margin: '0 0 24px 0', backgroundColor: c.bgCard, borderRadius: '16px', boxShadow: '0 4px 16px rgba(155,126,199,0.15)', overflow: 'hidden' }}>
          {/* Fila superior: etiqueta + botón Nemotécnica */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 0 16px' }}>
            <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '10px', fontWeight: 600,
              color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Integral
            </span>
            <button onClick={() => setShowNemotecnia(!showNemotecnia)}
              style={{ backgroundColor: c.purple, color: '#FFFFFF', border: 'none', borderRadius: '10px',
                fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '12px',
                cursor: 'pointer', padding: '6px 14px', flexShrink: 0 }}>
              {showNemotecnia ? 'Ocultar' : 'Nemotécnica'}
            </button>
          </div>
          {/* Texto de la integral — pasa por renderMath para convertir LaTeX */}
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '28px', color: c.purpleDark, fontStyle: 'italic',
            letterSpacing: '1px', lineHeight: '1.8', padding: '10px 24px 20px 24px',
            textAlign: 'center', wordBreak: 'break-word' }}>
            <div dangerouslySetInnerHTML={{ __html: renderMath(fc?.integral ?? '∫ f(x) dx') }} />
          </div>
        </div>

        {showNemotecnia ? (
          <FlashcardNemotecnia
            onClose={() => setShowNemotecnia(false)}
            question={renderMath(fc?.integral ?? '∫ f(x) dx')}
            answer={renderMath(opciones.find(o => o.esCorrecta)?.contenidoRespuesta ?? '—')}
          />
        ) : (
          <>
            {/* Indicador de selección múltiple */}
            {correctIndices.length > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px',
                padding: '8px 12px', backgroundColor: c.purpleSoft, borderRadius: '10px',
                border: `1px solid ${c.purplePale}` }}>
                <span style={{ fontSize: '14px' }}>💡</span>
                <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', color: c.purpleDark,
                  margin: 0, fontWeight: 600 }}>
                  Esta pregunta tiene {correctIndices.length} respuestas correctas — selecciónalas todas
                </p>
              </div>
            )}

            {/* ── Opciones ──────────────────────────────────── */}
            <div style={{ marginBottom: '20px' }}>
              {options.map(option => (
                <button key={option.id}
                  onClick={() => toggleOption(option.id)}
                  disabled={isVerified}
                  style={getOptionStyle(option.id)}>
                  <div className="flex items-center gap-3" style={{ flex: 1, minWidth: 0 }}>
                    {/* Burbuja con letra */}
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '14px',
                      backgroundColor:
                        isVerified && correctIndices.includes(option.id)          ? '#10B981'
                        : isVerified && selectedOptions.includes(option.id)       ? '#EF4444'
                        : !isVerified && selectedOptions.includes(option.id)      ? c.purple
                        : c.purplePale,
                      color:
                        (isVerified && correctIndices.includes(option.id))
                        || (isVerified && selectedOptions.includes(option.id))
                        || (!isVerified && selectedOptions.includes(option.id))
                          ? '#FFFFFF' : c.purpleDark,
                    }}>
                      {option.label}
                    </div>
                    {/* Texto con renderMath */}
                    <span
                      style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '14px',
                        color: getOptionTextColor(option.id), flex: 1, textAlign: 'left', lineHeight: '1.5' }}
                      dangerouslySetInnerHTML={{ __html: renderMath(option.text) || option.text }}
                    />
                  </div>
                  {/* Iconos de verificación */}
                  {isVerified && correctIndices.includes(option.id) && (
                    <Check size={22} color="#10B981" strokeWidth={3} style={{ flexShrink: 0 }} />
                  )}
                  {isVerified && selectedOptions.includes(option.id) && !correctIndices.includes(option.id) && (
                    <X size={22} color="#EF4444" strokeWidth={3} style={{ flexShrink: 0 }} />
                  )}
                </button>
              ))}
            </div>

            {/* Feedback */}
            {isVerified && feedback && (
              <div style={{ marginBottom: '20px', padding: '16px', borderRadius: '16px',
                backgroundColor: lastAnswerCorrect ? '#D1FAE5' : '#FEE2E2',
                border: `3px solid ${feedback.color}`,
                boxShadow: `0 4px 16px ${lastAnswerCorrect ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                <div className="flex items-start gap-3">
                  <div style={{ fontSize: '24px', flexShrink: 0 }}>{feedback.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '16px',
                      color: feedback.color, marginBottom: '8px' }}>
                      {feedback.title}
                    </h4>
                    <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px',
                      color: lastAnswerCorrect ? '#047857' : '#991B1B', lineHeight: '1.6' }}>
                      {feedback.text}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Botón Verificar / Siguiente */}
            <div className="mt-auto pb-4">
              {!isVerified ? (
                <button onClick={handleVerify} disabled={selectedOptions.length === 0} className="w-full transition-all"
                  style={{
                    height: '52px',
                    backgroundColor: selectedOptions.length > 0 ? c.purple : c.textMuted,
                    color: '#FFFFFF', border: 'none', borderRadius: '12px',
                    fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '15px',
                    textTransform: 'uppercase',
                    boxShadow: selectedOptions.length > 0 ? '0 6px 20px rgba(155,126,199,0.4)' : 'none',
                    cursor: selectedOptions.length > 0 ? 'pointer' : 'not-allowed',
                  }}>
                  Verificar Respuesta
                </button>
              ) : (
                <button onClick={handleNext} className="w-full transition-all"
                  style={{
                    height: '52px',
                    backgroundColor: lastAnswerCorrect ? '#10B981' : c.purple,
                    color: '#FFFFFF', border: 'none', borderRadius: '12px',
                    fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '15px',
                    textTransform: 'uppercase',
                    boxShadow: `0 6px 20px rgba(${lastAnswerCorrect ? '16,185,129' : '155,126,199'},0.4)`,
                    cursor: 'pointer',
                  }}>
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
