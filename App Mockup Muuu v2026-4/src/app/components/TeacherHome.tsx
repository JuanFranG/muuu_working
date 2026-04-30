import { useState, useEffect } from 'react';
import { Bell, Edit3, ClipboardList, BarChart3, Archive, Tag, Home, User, Settings, HelpCircle, ChevronRight, Users, FileStack, Upload } from 'lucide-react';
import { listarFlashcardsAPI, listarMaterialesAPI } from '../services/api';

interface TeacherHomeProps {
  userName?: string;
  onNavigate: (screen: string) => void;
}

export function TeacherHome({ userName = 'Russo', onNavigate }: TeacherHomeProps) {
  const [totalFlashcards, setTotalFlashcards] = useState<number | null>(null);
  const [totalDocumentos, setTotalDocumentos] = useState<number | null>(null);

  useEffect(() => {
    listarFlashcardsAPI()
      .then(fcs => setTotalFlashcards(fcs.length))
      .catch(() => setTotalFlashcards(null));
    listarMaterialesAPI()
      .then(mats => setTotalDocumentos(mats.length))
      .catch(() => setTotalDocumentos(null));
  }, []);

  const stats = {
    students: 89,
    successRate: 89,
    questions: 342,
    categories: 12
  };

  return (
    <div
      className="h-full w-full relative overflow-y-auto"
      style={{
        background: '#F8F4EC',
        maxWidth: '375px',
        maxHeight: '812px',
        margin: '0 auto',
        paddingBottom: '80px'
      }}
    >
      {/* Header Ámbar Cálido */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
          padding: '24px 20px 20px 20px',
          borderRadius: '0 0 24px 24px',
          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)'
        }}
      >
        {/* Fila 1: Avatar + Info + Notificaciones */}
        <div className="flex items-start justify-between mb-4">
          {/* Avatar + Información */}
          <button 
            onClick={() => onNavigate('perfilMenuDocente')}
            className="flex items-center gap-3"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0
            }}
          >
            {/* Avatar */}
            <div 
              className="flex items-center justify-center"
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                border: '2px solid rgba(255, 255, 255, 0.5)',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: '24px',
                color: '#F59E0B',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            >
              R
            </div>
            
            <div style={{ textAlign: 'left' }}>
              {/* Nombre */}
              <p 
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  fontSize: '16px',
                  color: '#78350F',
                  marginBottom: '4px'
                }}
              >
                Prof. {userName}
              </p>
              
              {/* Badge Docente */}
              <div
                style={{
                  display: 'inline-block',
                  backgroundColor: '#78350F',
                  color: '#FFFFFF',
                  padding: '3px 10px',
                  borderRadius: '10px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: '10px'
                }}
              >
                Docente
              </div>
            </div>
          </button>

          {/* Campana de Notificaciones */}
          <button 
            onClick={() => onNavigate('notificaciones')}
            className="relative transition-all hover:scale-110"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px'
            }}
          >
            <Bell size={24} color="#78350F" strokeWidth={2.5} />
            {/* Punto rojo */}
            <div 
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#EF4444',
                border: '2px solid #F59E0B'
              }}
            />
          </button>
        </div>

        {/* Fila 2: Estadísticas rápidas */}
        <div className="flex items-center gap-4">
          {/* Flashcards */}
          <div className="flex items-center gap-1.5">
            <span style={{ fontSize: '16px' }}>📚</span>
            <span 
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                color: '#78350F'
              }}
            >
              {totalFlashcards !== null ? totalFlashcards : '…'} flashcards
            </span>
          </div>

          {/* Estudiantes */}
          <div className="flex items-center gap-1.5">
            <span style={{ fontSize: '16px' }}>👥</span>
            <span 
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                color: '#78350F'
              }}
            >
              {stats.students} estudiantes
            </span>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div style={{ padding: '20px 20px 90px 20px' }}>
        {/* CTA Principal - Diseñar Flashcard */}
        <button
          onClick={() => onNavigate('disenarFlashcard')}
          className="w-full transition-all hover:scale-[1.02]"
          style={{
            background: 'linear-gradient(135deg, #F59E0B 0%, #F59E0B 100%)',
            borderRadius: '16px',
            padding: '14px',
            border: 'none',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px'
          }}
        >
          {/* Icono de lápiz en círculo blanco */}
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Edit3 size={22} color="#F59E0B" strokeWidth={2.5} />
          </div>

          {/* Textos */}
          <div style={{ flex: 1, textAlign: 'left' }}>
            <p 
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: '16px',
                color: '#78350F',
                marginBottom: '0'
              }}
            >
              Diseñar Flashcard
            </p>
          </div>

          {/* Chevron */}
          <ChevronRight size={20} color="#78350F" strokeWidth={2.5} />
        </button>

        {/* Botón de Agregar Material de Estudio */}
        <button
          onClick={() => onNavigate('agregarMaterial')}
          className="w-full transition-all hover:scale-[1.02]"
          style={{
            background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
            borderRadius: '16px',
            padding: '14px',
            border: 'none',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px'
          }}
        >
          {/* Icono de upload en círculo blanco */}
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Upload size={22} color="#F59E0B" strokeWidth={2.5} />
          </div>

          {/* Textos */}
          <div style={{ flex: 1, textAlign: 'left' }}>
            <p 
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: '16px',
                color: '#78350F',
                marginBottom: '0'
              }}
            >
              Agregar Material de Estudio
            </p>
          </div>

          {/* Chevron */}
          <ChevronRight size={20} color="#78350F" strokeWidth={2.5} />
        </button>

        {/* Grid de Estadísticas */}
        <div
          className="grid grid-cols-2 gap-3"
        >
          {/* Tarjeta 1: Mis Flashcards — estilo naranja igual que los botones de acción */}
          <button
            onClick={() => onNavigate('misFlashcards')}
            className="transition-all hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ClipboardList size={24} color="#F59E0B" strokeWidth={2.5} />
            </div>
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 800,
                fontSize: '28px',
                color: '#78350F',
                lineHeight: '1',
                margin: 0,
              }}
            >
              {totalFlashcards !== null ? totalFlashcards : '…'}
            </p>
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                fontSize: '12px',
                color: '#78350F',
                textAlign: 'center',
                margin: 0,
              }}
            >
              Mis Flashcards
            </p>
          </button>

          {/* Tarjeta 2: Tasa de aciertos */}
          <button
            onClick={() => onNavigate('estadisticas')}
            className="transition-all hover:scale-[1.02]"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span style={{ fontSize: '40px' }}>📊</span>
            <p 
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 800,
                fontSize: '32px',
                color: '#78350F',
                lineHeight: '1'
              }}
            >
              {stats.successRate}%
            </p>
            <p 
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 500,
                fontSize: '12px',
                color: '#6B7280',
                textAlign: 'center'
              }}
            >
              Tasa de aciertos
            </p>
          </button>

          {/* Tarjeta 3: Mis Documentos */}
          <button
            onClick={() => onNavigate('misDocumentos')}
            className="transition-all hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FileStack size={24} color="#F59E0B" strokeWidth={2.5} />
            </div>
            <p style={{
              fontFamily: 'Poppins, sans-serif', fontWeight: 800,
              fontSize: '28px', color: '#78350F', lineHeight: '1', margin: 0,
            }}>
              {totalDocumentos !== null ? totalDocumentos : '…'}
            </p>
            <p style={{
              fontFamily: 'Poppins, sans-serif', fontWeight: 600,
              fontSize: '12px', color: '#78350F', textAlign: 'center', margin: 0,
            }}>
              Mis Documentos
            </p>
          </button>

          {/* Tarjeta 4: Categorías */}
          <button
            onClick={() => onNavigate('categorias')}
            className="transition-all hover:scale-[1.02]"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span style={{ fontSize: '40px' }}>🏷️</span>
            <p 
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 800,
                fontSize: '32px',
                color: '#78350F',
                lineHeight: '1'
              }}
            >
              {stats.categories}
            </p>
            <p 
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 500,
                fontSize: '12px',
                color: '#6B7280',
                textAlign: 'center'
              }}
            >
              Categorías
            </p>
          </button>
        </div>
      </div>

      {/* Barra de Navegación Inferior */}
      
    </div>
  );
}