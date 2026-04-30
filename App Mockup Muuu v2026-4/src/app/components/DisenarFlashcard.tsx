import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Eye, EyeOff, Loader2 } from 'lucide-react';
import {
  listarTemasAPI,
  listarDificultadesAPI,
  crearFlashcardAPI,
  obtenerFlashcardAPI,
  actualizarFlashcardAPI,
  type TemaAPI,
  type DificultadAPI,
} from '../services/api';

interface DisenarFlashcardProps {
  onBack:          () => void;
  flashcardId?:    number;   // Si se pasa, entra en modo edición
}

interface Option {
  id: string;
  label: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export function DisenarFlashcard({ onBack, flashcardId }: DisenarFlashcardProps) {
  const modoEdicion = flashcardId !== undefined;

  const [question, setQuestion]         = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState<number>(0);
  const [dificultadId, setDificultadId]     = useState<number>(0);
  const [options, setOptions]           = useState<Option[]>([
    { id: 'A', label: 'A', text: '', isCorrect: true,  feedback: '' },
    { id: 'B', label: 'B', text: '', isCorrect: false, feedback: '' },
    { id: 'C', label: 'C', text: '', isCorrect: false, feedback: '' },
    { id: 'D', label: 'D', text: '', isCorrect: false, feedback: '' },
  ]);
  const [showPreview, setShowPreview] = useState(true);

  // Catálogos cargados desde la API
  const [temas, setTemas]           = useState<TemaAPI[]>([]);
  const [dificultades, setDificultades] = useState<DificultadAPI[]>([]);
  const [cargandoCatalogos, setCargandoCatalogos] = useState(true);

  // Estado de guardado
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  // ── Cargar catálogos y, si es edición, precargar flashcard ─
  useEffect(() => {
    async function cargar() {
      try {
        const [temasData, difData] = await Promise.all([
          listarTemasAPI(),
          listarDificultadesAPI(),
        ]);
        setTemas(temasData);
        setDificultades(difData);

        // Modo edición: cargar la flashcard existente
        if (modoEdicion && flashcardId) {
          const fc = await obtenerFlashcardAPI(flashcardId);
          setQuestion(fc.integral);
          setSelectedTopicId(fc.id_tema);
          setDificultadId(fc.id_dificultad);
          setOptions(
            fc.opciones.map((o, i) => ({
              id:        String.fromCharCode(65 + i),
              label:     String.fromCharCode(65 + i),
              text:      o.contenidoRespuesta,
              isCorrect: Boolean(o.esCorrecta),
              feedback:  o.retroalimentacion ?? '',
            }))
          );
        }
      } catch (err) {
        setMensajeError('No se pudieron cargar los datos. Verifica la conexión.');
      } finally {
        setCargandoCatalogos(false);
      }
    }
    cargar();
  }, []);

  // ── Opciones ───────────────────────────────────────────────
  const handleOptionChange  = (id: string, text: string) =>
    setOptions(options.map(opt => opt.id === id ? { ...opt, text } : opt));

  const handleFeedbackChange = (id: string, feedback: string) =>
    setOptions(options.map(opt => opt.id === id ? { ...opt, feedback } : opt));

  const handleCorrectChange  = (id: string) =>
    setOptions(options.map(opt => ({ ...opt, isCorrect: opt.id === id })));

  const handleAddOption = () => {
    const nextLabel = String.fromCharCode(65 + options.length);
    if (options.length < 10) {
      setOptions([...options, { id: nextLabel, label: nextLabel, text: '', isCorrect: false, feedback: '' }]);
    }
  };

  const insertSymbol = (symbol: string) => setQuestion(prev => prev + symbol);

  // Convierte texto con notación LaTeX básica a HTML visualizable
  const renderMath = (text: string): string => {
    if (!text) return '';
    return text
      .replace(/\\int/g, '∫')
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '<span style="display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;font-size:0.85em"><span style="border-bottom:1.5px solid currentColor;padding:0 2px">$1</span><span style="padding:0 2px">$2</span></span>')
      .replace(/\\sqrt\{([^}]+)\}/g, '√<span style="text-decoration:overline">$1</span>')
      .replace(/\^{([^}]+)}/g, '<sup>$1</sup>')
      .replace(/\^(\w)/g,       '<sup>$1</sup>')
      .replace(/_{([^}]+)}/g,   '<sub>$1</sub>')
      .replace(/_(\w)/g,        '<sub>$1</sub>')
      .replace(/\\cdot/g, '·')
      .replace(/\\times/g, '×')
      .replace(/\\pi/g, 'π')
      .replace(/\\infty/g, '∞')
      .replace(/\\alpha/g, 'α')
      .replace(/\\beta/g, 'β')
      .replace(/\\theta/g, 'θ')
      .replace(/\\sin/g, 'sin')
      .replace(/\\cos/g, 'cos')
      .replace(/\\tan/g, 'tan')
      .replace(/\\ln/g, 'ln')
      .replace(/\\log/g, 'log')
      .replace(/\n/g, '<br/>');
  };

  // ── Validación común ──────────────────────────────────────
  const validar = (): string | null => {
    if (!question.trim())    return 'Escribe la pregunta principal.';
    if (selectedTopicId === 0) return 'Selecciona un tema.';
    if (dificultadId === 0)  return 'Selecciona el nivel de dificultad.';
    const tieneCorrecta = options.some(o => o.isCorrect && o.text.trim());
    if (!tieneCorrecta)      return 'Marca al menos una opción correcta con su texto.';
    return null;
  };

  // ── Helper: construir payload ─────────────────────────────
  const buildPayload = (estado: 'BORRADOR' | 'PUBLICADO') => ({
    integral:      question.trim(),
    id_tema:       selectedTopicId,
    id_dificultad: dificultadId,
    estado,
    opciones:      options.map(o => ({
      contenido:         o.text.trim(),
      esCorrecta:        o.isCorrect,
      retroalimentacion: o.feedback.trim(),
    })),
  });

  // ── Guardar borrador ──────────────────────────────────────
  const handleSaveDraft = async () => {
    const error = validar();
    if (error) { setMensajeError(error); return; }

    setGuardando(true);
    setMensajeError('');
    setMensajeExito('');

    try {
      if (modoEdicion && flashcardId) {
        await actualizarFlashcardAPI(flashcardId, buildPayload('BORRADOR'));
        setMensajeExito('✅ Cambios guardados como borrador.');
      } else {
        await crearFlashcardAPI(buildPayload('BORRADOR'));
        setMensajeExito('✅ Borrador guardado. Solo tú puedes verlo.');
        resetFormulario();
      }
    } catch (err: unknown) {
      setMensajeError(err instanceof Error ? err.message : 'Error al guardar el borrador.');
    } finally {
      setGuardando(false);
    }
  };

  // ── Publicar ──────────────────────────────────────────────
  const handlePublish = async () => {
    const error = validar();
    if (error) { setMensajeError(error); return; }

    setGuardando(true);
    setMensajeError('');
    setMensajeExito('');

    try {
      if (modoEdicion && flashcardId) {
        await actualizarFlashcardAPI(flashcardId, buildPayload('PUBLICADO'));
        setMensajeExito('🎉 Flashcard actualizada y publicada.');
      } else {
        await crearFlashcardAPI(buildPayload('PUBLICADO'));
        setMensajeExito('🎉 Flashcard publicada. Ya está visible para los estudiantes.');
        resetFormulario();
      }
    } catch (err: unknown) {
      setMensajeError(err instanceof Error ? err.message : 'Error al publicar la flashcard.');
    } finally {
      setGuardando(false);
    }
  };

  const resetFormulario = () => {
    setQuestion('');
    setSelectedTopicId(0);
    setDificultadId(0);
    setOptions([
      { id: 'A', label: 'A', text: '', isCorrect: true,  feedback: '' },
      { id: 'B', label: 'B', text: '', isCorrect: false, feedback: '' },
      { id: 'C', label: 'C', text: '', isCorrect: false, feedback: '' },
      { id: 'D', label: 'D', text: '', isCorrect: false, feedback: '' },
    ]);
  };

  // Mapeo de dificultad id → color/emoji para los botones
  const difMeta: Record<string, { color: string; emoji: string }> = {
    'Basico':      { color: '#10B981', emoji: '🟢' },
    'Básico':      { color: '#10B981', emoji: '🟢' },
    'Intermedio':  { color: '#F59E0B', emoji: '🟡' },
    'Avanzado':    { color: '#EF4444', emoji: '🔴' },
  };

  // ── RENDER ────────────────────────────────────────────────
  return (
    <div className="h-full w-full relative overflow-hidden" style={{ backgroundColor: '#FAF8F3' }}>

      {/* HEADER */}
      <div className="absolute top-0 left-0 right-0 z-50"
        style={{ background: 'linear-gradient(135deg, #F5A623 0%, #F7B955 100%)', padding: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div className="flex items-center gap-3">
          <button onClick={onBack} style={{ padding: '4px' }}>
            <ArrowLeft size={24} style={{ color: '#3D2301' }} strokeWidth={2.5} />
          </button>
          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '18px',
            color: '#3D2301', letterSpacing: '-0.3px', lineHeight: '1.2' }}>
            {modoEdicion ? 'Editar' : 'Diseñar'}<br />Flashcard ✏️
          </h1>
        </div>
        <button onClick={handleSaveDraft} disabled={guardando}
          style={{ height: '40px', padding: '0 24px',
            backgroundColor: 'rgba(61,35,1,0.15)', color: '#3D2301',
            fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '14px',
            borderRadius: '8px', border: 'none', cursor: guardando ? 'not-allowed' : 'pointer',
            opacity: guardando ? 0.6 : 1 }}>
          {guardando ? 'Guardando...' : 'Guardar'}
        </button>
      </div>

      {/* VISTA PREVIA MINIMIZADA */}
      {!showPreview && (
        <div className="absolute z-40" style={{ top: '88px', width: '100%' }}>
          <div onClick={() => setShowPreview(true)}
            className="mx-4 flex items-center justify-between cursor-pointer"
            style={{ padding: '10px 12px', backgroundColor: '#FFFCF0',
              border: '2px dashed #D4A017', borderRadius: '8px' }}>
            <div className="flex items-center gap-2">
              <Eye size={16} style={{ color: '#78350F' }} />
              <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '11px',
                color: '#78350F', letterSpacing: '0.3px' }}>VISTA PREVIA ESTUDIANTE</p>
            </div>
          </div>
        </div>
      )}

      {/* ÁREA SCROLLEABLE */}
      <div className="overflow-y-auto"
        style={{ paddingTop: showPreview ? '308px' : '148px', paddingBottom: '100px', height: '100%' }}>
        <div style={{ padding: '0 16px' }}>

          {/* VISTA PREVIA COMPLETA */}
          {showPreview && (
            <div className="absolute z-40"
              style={{ top: '88px', width: 'calc(100% - 32px)', maxWidth: '343px' }}>
              <div style={{ position: 'relative', padding: '16px', backgroundColor: '#FFFCF0',
                border: '2px dashed #D4A017', borderRadius: '12px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '10px',
                  textTransform: 'uppercase', color: '#78350F', marginBottom: '8px' }}>
                  VISTA PREVIA ESTUDIANTE
                </p>
                {/* Pregunta con render LaTeX */}
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '15px', fontWeight: 600,
                  color: '#1E293B', marginBottom: '12px', lineHeight: '1.6',
                  fontStyle: question ? 'normal' : 'italic' }}
                  dangerouslySetInnerHTML={{
                    __html: question
                      ? renderMath(question)
                      : 'Resuelve la siguiente integral:' }}
                />
                <div style={{ fontSize: '12px', color: '#4A4A4A', marginTop: '12px' }}>
                  {options.slice(0, 2).map(o => (
                    <div key={o.id} style={{ marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600 }}>{o.label})</span>{' '}
                      <span dangerouslySetInnerHTML={{ __html: renderMath(o.text) || `Opción ${o.label}` }} />
                    </div>
                  ))}
                </div>
                <button onClick={() => setShowPreview(false)}
                  className="absolute bottom-3 right-3 flex items-center justify-center rounded-full"
                  style={{ width: '32px', height: '32px', backgroundColor: '#D4A017',
                    color: '#FFFFFF', border: 'none', cursor: 'pointer' }}>
                  <EyeOff size={16} />
                </button>
              </div>
            </div>
          )}

          {/* MENSAJES DE ESTADO */}
          {mensajeExito && (
            <div style={{ margin: '8px 0 12px', padding: '12px 14px', backgroundColor: '#D1FAE5',
              border: '1px solid #A7F3D0', borderRadius: '8px',
              fontFamily: 'Poppins, sans-serif', fontSize: '13px', color: '#065F46' }}>
              {mensajeExito}
            </div>
          )}
          {mensajeError && (
            <div style={{ margin: '8px 0 12px', padding: '12px 14px', backgroundColor: '#FEE2E2',
              border: '1px solid #FECACA', borderRadius: '8px',
              fontFamily: 'Poppins, sans-serif', fontSize: '13px', color: '#991B1B' }}>
              {mensajeError}
            </div>
          )}

          {/* ── SECCIÓN: TEMA ── */}
          <div className="mb-4" style={{ padding: '16px', backgroundColor: '#FFFFFF',
            border: '2px solid #E5E7EB', borderRadius: '10px',
            marginTop: showPreview ? '20px' : '0' }}>
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '14px',
              color: '#1E293B', marginBottom: '10px' }}>
              Tema <span style={{ color: '#EF4444' }}>*</span>
            </h2>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: '#6B7280', marginBottom: '12px' }}>
              Selecciona la categoría de esta flashcard
            </p>

            {cargandoCatalogos ? (
              <div className="flex items-center gap-2" style={{ color: '#9CA3AF', fontFamily: 'Poppins, sans-serif', fontSize: '13px' }}>
                <Loader2 size={16} className="animate-spin" /> Cargando temas...
              </div>
            ) : (
              <select value={selectedTopicId}
                onChange={e => setSelectedTopicId(Number(e.target.value))}
                className="w-full"
                style={{ padding: '12px 14px', backgroundColor: '#FFFFFF',
                  border: `2px solid ${selectedTopicId ? '#D4A017' : '#E6B82E'}`,
                  borderRadius: '8px', fontFamily: 'Poppins, sans-serif', fontWeight: 500,
                  fontSize: '13px', color: selectedTopicId ? '#1E293B' : '#9CA3AF',
                  cursor: 'pointer', outline: 'none', appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23E6B82E' d='M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '40px' }}>
                <option value={0} disabled>Selecciona un tema...</option>
                {temas.map(t => (
                  <option key={t.id_tema} value={t.id_tema}>
                    {t.nombre}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* ── SECCIÓN: DIFICULTAD ── */}
          <div className="mb-4" style={{ padding: '16px', backgroundColor: '#FFFFFF',
            border: '2px solid #E5E7EB', borderRadius: '10px' }}>
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '14px',
              color: '#1E293B', marginBottom: '10px' }}>
              Dificultad <span style={{ color: '#EF4444' }}>*</span>
            </h2>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: '#6B7280', marginBottom: '12px' }}>
              Selecciona el nivel de dificultad
            </p>
            {cargandoCatalogos ? (
              <div className="flex items-center gap-2" style={{ color: '#9CA3AF', fontFamily: 'Poppins, sans-serif', fontSize: '13px' }}>
                <Loader2 size={16} className="animate-spin" /> Cargando...
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {dificultades.map(d => {
                  const meta = difMeta[d.nombre] ?? { color: '#6B7280', emoji: '⚪' };
                  const activo = dificultadId === d.id_dificultad;
                  return (
                    <button key={d.id_dificultad} onClick={() => setDificultadId(d.id_dificultad)}
                      style={{ padding: '12px 8px',
                        backgroundColor: activo ? '#FEF3C7' : '#FAFAFA',
                        border: activo ? `2px solid ${meta.color}` : '2px solid #E5E7EB',
                        borderRadius: '8px', fontFamily: 'Poppins, sans-serif',
                        fontWeight: activo ? 600 : 500, fontSize: '12px',
                        color: activo ? meta.color : '#4A4A4A', cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '18px' }}>{meta.emoji}</span>
                      <span>{d.nombre}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── SECCIÓN: PREGUNTA PRINCIPAL ── */}
          <div className="mb-4" style={{ padding: '16px', backgroundColor: '#FFFFFF',
            border: '2px solid #E5E7EB', borderRadius: '10px' }}>
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '14px',
              color: '#1E293B', marginBottom: '10px' }}>
              1. Pregunta principal <span style={{ color: '#EF4444' }}>*</span>
            </h2>
            <textarea value={question} onChange={e => setQuestion(e.target.value)}
              placeholder="Resuelve la siguiente integral:" className="w-full resize-none" rows={2}
              style={{ padding: '10px', border: '2px solid #D1D5DB', borderRadius: '8px',
                fontFamily: 'Poppins, sans-serif', fontSize: '13px', lineHeight: '1.4',
                outline: 'none', backgroundColor: '#FFFFFF', marginBottom: '10px' }}
              onFocus={e => { e.target.style.borderColor = '#E6B82E'; e.target.style.boxShadow = '0 0 0 3px rgba(230,184,46,0.1)'; }}
              onBlur={e => { e.target.style.borderColor = '#D1D5DB'; e.target.style.boxShadow = 'none'; }} />

            {/* Barra de herramientas */}
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '10px', color: '#9CA3AF', marginBottom: '6px' }}>
              Símbolos — haz clic para insertar. Puedes usar: <code style={{fontSize:'10px'}}>^2</code> para superíndice, <code style={{fontSize:'10px'}}>_n</code> para subíndice, <code style={{fontSize:'10px'}}>\frac{"{a}{b}"}</code> para fracción.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[
                { sym: '∫',    tip: 'Integral'           },
                { sym: '∬',    tip: 'Integral doble'     },
                { sym: 'dx',   tip: 'Diferencial x'      },
                { sym: '·',    tip: 'Punto medio'        },
                { sym: 'π',    tip: 'Pi'                 },
                { sym: '√',    tip: 'Raíz cuadrada'      },
                { sym: '∞',    tip: 'Infinito'           },
                { sym: 'α',    tip: 'Alpha'              },
                { sym: 'β',    tip: 'Beta'               },
                { sym: 'θ',    tip: 'Theta'              },
              ].map(({ sym, tip }) => (
                <button key={sym} onClick={() => insertSymbol(sym)} title={tip}
                  className="flex items-center justify-center"
                  style={{ minWidth: '36px', height: '32px', padding: '0 6px',
                    backgroundColor: '#FFFEF9', border: '1.5px solid #D1D5DB', borderRadius: '6px',
                    fontFamily: 'serif', fontSize: '16px', color: '#4A4A4A', cursor: 'pointer' }}>
                  {sym}
                </button>
              ))}
              {/* Plantilla integral típica */}
              <button
                onClick={() => insertSymbol('∫ f(x) dx')}
                title="Insertar plantilla de integral"
                style={{ height: '32px', padding: '0 10px', backgroundColor: '#FEF3C7',
                  border: '1.5px solid #D4A017', borderRadius: '6px',
                  fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '11px',
                  color: '#78350F', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                + plantilla ∫
              </button>
            </div>
          </div>

          {/* ── SECCIÓN: OPCIONES Y RETROALIMENTACIÓN ── */}
          <div className="mb-4" style={{ padding: '16px', backgroundColor: '#FFFFFF',
            border: '2px solid #E5E7EB', borderRadius: '10px' }}>
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '14px',
              color: '#1E293B', marginBottom: '6px' }}>
              2. Opciones y retroalimentación <span style={{ color: '#EF4444' }}>*</span>
            </h2>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: '#6B7280', marginBottom: '12px' }}>
              Marca la respuesta correcta ✓ y escribe la retroalimentación de cada opción
            </p>

            {options.map(option => (
              <div key={option.id} style={{ marginBottom: '10px', padding: '12px',
                backgroundColor: '#FAFAFA',
                border: `2px solid ${option.isCorrect ? '#10B981' : '#E5E7EB'}`,
                borderRadius: '8px' }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center justify-center flex-shrink-0"
                    style={{ width: '32px', height: '32px',
                      backgroundColor: option.isCorrect ? '#10B981' : '#E5B32E',
                      color: '#FFFFFF', fontFamily: 'Poppins, sans-serif',
                      fontWeight: 700, fontSize: '14px', borderRadius: '50%' }}>
                    {option.label}
                  </div>
                  <input type="text" value={option.text}
                    onChange={e => handleOptionChange(option.id, e.target.value)}
                    placeholder={`Escribe la opción ${option.label}`} className="flex-1"
                    style={{ height: '36px', padding: '8px', border: '1.5px solid #D1D5DB',
                      borderRadius: '6px', fontFamily: 'Poppins, sans-serif',
                      fontSize: '12px', outline: 'none', backgroundColor: '#FFFFFF' }}
                    onFocus={e => { e.target.style.borderColor = '#E6B82E'; }}
                    onBlur={e => { e.target.style.borderColor = '#D1D5DB'; }} />
                  <div className="flex items-center gap-1 px-2 py-1"
                    style={{ backgroundColor: option.isCorrect ? '#10B981' : '#FFFFFF',
                      border: `1.5px solid ${option.isCorrect ? '#10B981' : '#D1D5DB'}`,
                      borderRadius: '6px' }}>
                    <input type="checkbox" checked={option.isCorrect}
                      onChange={() => handleCorrectChange(option.id)}
                      id={`correct-${option.id}`}
                      style={{ width: '14px', height: '14px', cursor: 'pointer', accentColor: '#10B981' }} />
                    <label htmlFor={`correct-${option.id}`}
                      style={{ fontFamily: 'Poppins, sans-serif', fontSize: '10px', fontWeight: 600,
                        color: option.isCorrect ? '#FFFFFF' : '#6B7280', cursor: 'pointer',
                        whiteSpace: 'nowrap' }}>
                      Correcta
                    </label>
                  </div>
                </div>

                {/* Retroalimentación */}
                <div style={{ padding: '10px',
                  backgroundColor: option.isCorrect ? '#E8F5E9' : '#FFFBF0',
                  borderRadius: '6px',
                  border: `1.5px solid ${option.isCorrect ? '#10B981' : '#E6B82E'}` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span style={{ fontSize: '16px' }}>{option.isCorrect ? '✅' : '💡'}</span>
                    <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '10px', fontWeight: 700,
                      color: option.isCorrect ? '#047857' : '#92400E' }}>
                      {option.isCorrect ? 'Retroalimentación — acierto' : 'Retroalimentación — error'}
                    </p>
                  </div>
                  <textarea value={option.feedback}
                    onChange={e => handleFeedbackChange(option.id, e.target.value)}
                    placeholder={option.isCorrect
                      ? '¿Por qué esta respuesta es correcta?'
                      : 'Explica por qué esta opción es incorrecta'}
                    className="w-full resize-none" rows={2}
                    style={{ padding: '8px', border: '1px solid transparent', borderRadius: '4px',
                      fontFamily: 'Poppins, sans-serif', fontSize: '11px', lineHeight: '1.4',
                      outline: 'none', backgroundColor: '#FFFFFF', color: '#4A4A4A' }}
                    onFocus={e => { e.target.style.borderColor = option.isCorrect ? '#10B981' : '#E6B82E'; }}
                    onBlur={e => { e.target.style.borderColor = 'transparent'; }} />
                </div>
              </div>
            ))}

            {options.length < 10 && (
              <button onClick={handleAddOption}
                className="w-full flex items-center justify-center gap-2"
                style={{ height: '40px', backgroundColor: 'transparent',
                  border: '2px dashed #E6B82E', borderRadius: '8px',
                  fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '13px',
                  color: '#D4A017', cursor: 'pointer', marginTop: '8px' }}>
                <Plus size={18} />
                Agregar opción {String.fromCharCode(65 + options.length)}
              </button>
            )}
          </div>

        </div>
      </div>

      {/* FOOTER FIJO */}
      <div className="absolute bottom-0 z-50"
        style={{ backgroundColor: '#FFFFFF', borderTop: '2px solid #E5E7EB',
          padding: '12px 16px', width: '100%', boxShadow: '0 -2px 10px rgba(0,0,0,0.05)' }}>
        <div className="flex gap-3">
          <button onClick={handleSaveDraft} disabled={guardando}
            style={{ flex: 1, height: '44px', backgroundColor: '#FFFFFF',
              color: '#1E293B', fontFamily: 'Poppins, sans-serif', fontWeight: 700,
              fontSize: '13px', border: '2px solid #1E293B', borderRadius: '8px',
              cursor: guardando ? 'not-allowed' : 'pointer', opacity: guardando ? 0.6 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            {guardando && <Loader2 size={14} className="animate-spin" />}
            Guardar Borrador
          </button>
          <button onClick={handlePublish} disabled={guardando}
            style={{ flex: 1, height: '44px',
              background: guardando ? '#9CA3AF' : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: '#FFFFFF', fontFamily: 'Poppins, sans-serif', fontWeight: 700,
              fontSize: '13px', border: 'none', borderRadius: '8px',
              cursor: guardando ? 'not-allowed' : 'pointer',
              boxShadow: guardando ? 'none' : '0 4px 12px rgba(16,185,129,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            {guardando ? <Loader2 size={14} className="animate-spin" /> : '✓'}
            {guardando ? 'Procesando...' : 'Publicar'}
          </button>
        </div>
      </div>
    </div>
  );
}
