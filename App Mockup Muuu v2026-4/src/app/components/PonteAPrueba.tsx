import { useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { PonteAPruebaDocentes } from './PonteAPruebaDocentes';
import { PonteAPruebaTema } from './PonteAPruebaTema';
import { QuizScreen } from './QuizScreen';
import {
  listarFlashcardsDocenteAPI,
  listarFlashcardsPorTemaAPI,
  type FlashcardQuizAPI,
} from '../services/api';

// ─────────────────────────────────────────────────────────────
//  PonteAPrueba — orquestador con menú de selección
//
//  Flujos:
//    menu
//    → (docente) → loadingDocente → quizDocente | sinFlashcardsDocente
//    → (tema)    → selectTema → loadingTema → quizTema | sinFlashcardsTema
// ─────────────────────────────────────────────────────────────

type PATScreen =
  | 'menu'
  | 'selectDocente'
  | 'loadingDocente'
  | 'quizDocente'
  | 'sinFlashcardsDocente'
  | 'selectTema'
  | 'loadingTema'
  | 'quizTema'
  | 'sinFlashcardsTema';

interface PonteAPruebaProps {
  onBack: () => void;
}

export function PonteAPrueba({ onBack }: PonteAPruebaProps) {
  const [screen, setScreen]           = useState<PATScreen>('menu');
  const [flashcards, setFlashcards]   = useState<FlashcardQuizAPI[]>([]);
  const [contextLabel, setContextLabel] = useState('');

  // ── Flujo Docente ─────────────────────────────────────────
  const handleSelectDocente = async (teacherId: string, teacherName: string) => {
    setContextLabel(teacherName);
    setScreen('loadingDocente');
    try {
      const fcs = await listarFlashcardsDocenteAPI(Number(teacherId));
      if (fcs.length === 0) {
        setScreen('sinFlashcardsDocente');
      } else {
        setFlashcards(fcs);
        setScreen('quizDocente');
      }
    } catch {
      setScreen('sinFlashcardsDocente');
    }
  };

  // ── Flujo Tema ────────────────────────────────────────────
  const handleSelectTema = async (idTema: number, nombreTema: string) => {
    setContextLabel(nombreTema);
    setScreen('loadingTema');
    try {
      const fcs = await listarFlashcardsPorTemaAPI(idTema);
      if (fcs.length === 0) {
        setScreen('sinFlashcardsTema');
      } else {
        setFlashcards(fcs);
        setScreen('quizTema');
      }
    } catch {
      setScreen('sinFlashcardsTema');
    }
  };

  // ── Seleccionar docente ───────────────────────────────────
  if (screen === 'selectDocente') {
    return (
      <PonteAPruebaDocentes
        onBack={() => setScreen('menu')}
        onSelectTeacher={(id, name) => handleSelectDocente(id, name)}
      />
    );
  }

  // ── Seleccionar tema ──────────────────────────────────────
  if (screen === 'selectTema') {
    return (
      <PonteAPruebaTema
        onBack={() => setScreen('menu')}
        onSelectTema={(id, nombre) => handleSelectTema(id, nombre)}
      />
    );
  }

  // ── Cargando (docente o tema) ─────────────────────────────
  if (screen === 'loadingDocente' || screen === 'loadingTema') {
    return (
      <div className="h-full flex flex-col items-center justify-center"
        style={{ background: 'linear-gradient(180deg, #F3EBFF 0%, #FFFFFF 100%)' }}>
        <Loader2 size={40} style={{ color: '#9B7EC7' }} className="animate-spin" />
        <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px',
          color: '#7D7D7D', marginTop: '16px' }}>
          Cargando flashcards de {contextLabel}...
        </p>
      </div>
    );
  }

  // ── Sin flashcards (docente) ──────────────────────────────
  if (screen === 'sinFlashcardsDocente') {
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
          {contextLabel} aún no ha publicado flashcards de práctica.
        </p>
        <button onClick={() => setScreen('selectDocente')} style={{
          height: '48px', padding: '0 32px', backgroundColor: '#9B7EC7',
          color: '#FFFFFF', border: 'none', borderRadius: '12px',
          fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
          marginBottom: '12px'
        }}>
          ← Elegir otro docente
        </button>
        <button onClick={() => setScreen('menu')} style={{
          height: '44px', padding: '0 24px', backgroundColor: '#F3EBFF',
          color: '#7952B3', border: 'none', borderRadius: '12px',
          fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '14px', cursor: 'pointer'
        }}>
          Volver al menú
        </button>
      </div>
    );
  }

  // ── Sin flashcards (tema) ─────────────────────────────────
  if (screen === 'sinFlashcardsTema') {
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
          El tema "{contextLabel}" aún no tiene flashcards publicadas.
        </p>
        <button onClick={() => setScreen('selectTema')} style={{
          height: '48px', padding: '0 32px', backgroundColor: '#9B7EC7',
          color: '#FFFFFF', border: 'none', borderRadius: '12px',
          fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
          marginBottom: '12px'
        }}>
          ← Elegir otro tema
        </button>
        <button onClick={() => setScreen('menu')} style={{
          height: '44px', padding: '0 24px', backgroundColor: '#F3EBFF',
          color: '#7952B3', border: 'none', borderRadius: '12px',
          fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '14px', cursor: 'pointer'
        }}>
          Volver al menú
        </button>
      </div>
    );
  }

  // ── Quiz Docente ──────────────────────────────────────────
  if (screen === 'quizDocente') {
    return (
      <QuizScreen
        flashcards={flashcards}
        contextLabel={contextLabel}
        onBack={onBack}
        onChangeContext={() => setScreen('selectDocente')}
      />
    );
  }

  // ── Quiz Tema ─────────────────────────────────────────────
  if (screen === 'quizTema') {
    return (
      <QuizScreen
        flashcards={flashcards}
        contextLabel={contextLabel}
        onBack={onBack}
        onChangeContext={() => setScreen('selectTema')}
      />
    );
  }

  // ── Menú principal ────────────────────────────────────────
  return (
    <div className="h-full flex flex-col"
      style={{ background: 'linear-gradient(180deg, #F3EBFF 0%, #FFFFFF 100%)' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <button onClick={onBack} style={{
          width: '36px', height: '36px', borderRadius: '50%', border: 'none',
          background: 'transparent', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center', color: '#9B7EC7'
        }}>
          <ArrowLeft size={22} strokeWidth={2.5} />
        </button>
        <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '17px',
          color: '#1E293B', margin: 0 }}>
          Ponte a Prueba 🏆
        </h1>
      </div>

      {/* Contenido del menú */}
      <div className="flex-1 flex flex-col justify-center" style={{ padding: '24px' }}>
        <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', color: '#7D7D7D',
          textAlign: 'center', marginBottom: '32px', lineHeight: '1.5' }}>
          Elige cómo quieres practicar
        </p>

        {/* Tarjeta: Docente */}
        <button
          onClick={() => setScreen('selectDocente')}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #9B7EC7 0%, #7952B3 100%)',
            borderRadius: '20px',
            padding: '28px 24px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px',
            boxShadow: '0 8px 24px rgba(155,126,199,0.35)',
            transition: 'transform 0.2s ease',
          }}
        >
          <div style={{ fontSize: '48px', lineHeight: '1' }}>👨‍🏫</div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '18px',
              color: '#FFFFFF', margin: '0 0 6px 0' }}>
              Ponte a prueba con un Docente
            </p>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px',
              color: 'rgba(255,255,255,0.85)', margin: 0 }}>
              Elige tu profesor y practica sus flashcards
            </p>
          </div>
        </button>

        {/* Tarjeta: Tema */}
        <button
          onClick={() => setScreen('selectTema')}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #7952B3 0%, #5B3F9A 100%)',
            borderRadius: '20px',
            padding: '28px 24px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 8px 24px rgba(91,63,154,0.35)',
            transition: 'transform 0.2s ease',
          }}
        >
          <div style={{ fontSize: '48px', lineHeight: '1' }}>📚</div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '18px',
              color: '#FFFFFF', margin: '0 0 6px 0' }}>
              Ponte a prueba con un Tema
            </p>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px',
              color: 'rgba(255,255,255,0.85)', margin: 0 }}>
              Explora flashcards por categoría
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
