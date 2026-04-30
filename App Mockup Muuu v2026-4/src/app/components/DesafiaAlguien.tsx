import { useState } from 'react';
import { ArrowLeft, ChevronDown, X } from 'lucide-react';

interface DesafiaAlguienProps {
  onBack: () => void;
  onCreateRoom: (config: RoomConfig) => void;
}

interface RoomConfig {
  mode: 'crear' | 'unirse' | 'aleatorio';
  numQuestions: number;
  topic: string;
}

interface DuelHistory {
  id: number;
  opponentName: string;
  result: 'won' | 'lost';
  score: string;
}

export function DesafiaAlguien({ onBack, onCreateRoom }: DesafiaAlguienProps) {
  const [selectedMode, setSelectedMode] = useState<'crear' | 'unirse' | 'aleatorio'>('crear');
  const [numQuestions, setNumQuestions] = useState(5);
  const [selectedTopic, setSelectedTopic] = useState('Todos los temas');
  const [showQuestionsPicker, setShowQuestionsPicker] = useState(false);
  const [showTopicPicker, setShowTopicPicker] = useState(false);
  const [roomCode] = useState('MU·4829');

  const questionOptions = [3, 5, 10, 15, 20];
  const topicOptions = ['Todos los temas', 'Integrales por Partes', 'Sust. Trigonométrica', 'Fracciones Parciales'];

  const duelHistory: DuelHistory[] = [
    { id: 1, opponentName: 'Carlos G.', result: 'won', score: 'Victoria - 4/5 correctas' },
    { id: 2, opponentName: 'María L.', result: 'lost', score: 'Derrota - 2/5 correctas' }
  ];

  const handleCreateRoom = () => {
    onCreateRoom({ mode: selectedMode, numQuestions, topic: selectedTopic });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomCode);
  };

  return (
    <div
      className="h-full relative overflow-y-auto flex flex-col"
      style={{
        background: 'linear-gradient(135deg, #9B7EC7 0%, #7952B3 100%)'
      }}
    >
      {/* HEADER */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: '16px 20px',
          paddingTop: '20px'
        }}
      >
        <button
          onClick={onBack}
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
          Desafía a Alguien
        </h1>

        <button
          onClick={onBack}
          className="flex items-center justify-center"
          style={{
            width: '36px',
            height: '36px',
            color: '#FFFFFF'
          }}
        >
          <X size={20} strokeWidth={2.5} />
        </button>
      </div>

      {/* ARENA DE INTEGRALES SUBTITLE */}
      <div
        style={{
          textAlign: 'center',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 600,
          fontSize: '11px',
          color: 'rgba(255, 255, 255, 0.9)',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          marginBottom: '12px'
        }}
      >
        ARENA DE INTEGRALES
      </div>

      {/* AVATARES VS */}
      <div
        className="flex items-center justify-center gap-3"
        style={{
          padding: '0 20px 20px 20px'
        }}
      >
        {/* Avatar Tú */}
        <div className="flex flex-col items-center">
          <div
            className="flex items-center justify-center"
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#D4A574',
              border: '3px solid #FFFFFF',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: '24px',
              color: '#FFFFFF'
            }}
          >
            👤
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
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: '#FFD700',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 800,
            fontSize: '14px',
            color: '#1A1A1A',
            boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)'
          }}
        >
          VS
        </div>

        {/* Avatar Rival */}
        <div className="flex flex-col items-center">
          <div
            className="flex items-center justify-center"
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#B8A4D9',
              border: '3px solid #FFFFFF',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: '24px',
              color: '#FFFFFF'
            }}
          >
            ❓
          </div>
          <span
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.9)',
              marginTop: '6px'
            }}
          >
            Rival
          </span>
        </div>
      </div>

      {/* CONTENIDO */}
      <div
        className="flex-1 flex flex-col"
        style={{
          marginTop: '4px',
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: '28px',
          borderTopRightRadius: '28px',
          padding: '24px 20px',
          paddingBottom: '32px'
        }}
      >
        {/* MODO DE DESAFÍO */}
        <div style={{ marginBottom: '20px' }}>
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
            MODO DE DESAFÍO
          </h3>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setSelectedMode('crear')}
              className="flex flex-col items-center justify-center transition-all"
              style={{
                height: '80px',
                borderRadius: '12px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                fontSize: '11px',
                backgroundColor: selectedMode === 'crear' ? '#9B7EC7' : '#FFFFFF',
                color: selectedMode === 'crear' ? '#FFFFFF' : '#7952B3',
                border: selectedMode === 'crear' ? 'none' : '2px solid #E6D5F0',
                cursor: 'pointer',
                boxShadow: selectedMode === 'crear' ? '0 4px 12px rgba(155, 126, 199, 0.3)' : 'none'
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>➕</div>
              Crear sala
            </button>

            <button
              onClick={() => setSelectedMode('unirse')}
              className="flex flex-col items-center justify-center transition-all"
              style={{
                height: '80px',
                borderRadius: '12px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                fontSize: '11px',
                backgroundColor: selectedMode === 'unirse' ? '#9B7EC7' : '#FFFFFF',
                color: selectedMode === 'unirse' ? '#FFFFFF' : '#7952B3',
                border: selectedMode === 'unirse' ? 'none' : '2px solid #E6D5F0',
                cursor: 'pointer',
                boxShadow: selectedMode === 'unirse' ? '0 4px 12px rgba(155, 126, 199, 0.3)' : 'none'
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>🔑</div>
              Unirse
            </button>

            <button
              onClick={() => setSelectedMode('aleatorio')}
              className="flex flex-col items-center justify-center transition-all"
              style={{
                height: '80px',
                borderRadius: '12px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                fontSize: '11px',
                backgroundColor: selectedMode === 'aleatorio' ? '#9B7EC7' : '#FFFFFF',
                color: selectedMode === 'aleatorio' ? '#FFFFFF' : '#7952B3',
                border: selectedMode === 'aleatorio' ? 'none' : '2px solid #E6D5F0',
                cursor: 'pointer',
                boxShadow: selectedMode === 'aleatorio' ? '0 4px 12px rgba(155, 126, 199, 0.3)' : 'none'
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>🎲</div>
              Aleatorio
            </button>
          </div>
        </div>

        {/* CÓDIGO DE SALA */}
        <div
          style={{
            marginBottom: '20px',
            padding: '16px',
            backgroundColor: '#F3EBFF',
            borderRadius: '12px',
            border: '2px solid #E6D5F0'
          }}
        >
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '11px',
              fontWeight: 600,
              color: '#7D7D7D',
              marginBottom: '8px',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            Código de sala
          </p>

          <div
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 800,
              fontSize: '32px',
              color: '#7952B3',
              letterSpacing: '4px',
              textAlign: 'center',
              marginBottom: '8px'
            }}
          >
            {roomCode}
          </div>

          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '10px',
              color: '#7D7D7D',
              textAlign: 'center'
            }}
          >
            Comparte con tu rival
          </p>
        </div>

        {/* CONFIGURACIÓN */}
        <div style={{ marginBottom: '20px' }}>
          <div className="grid grid-cols-2 gap-2">
            {/* Selector Tema */}
            <div className="relative">
              <button
                onClick={() => setShowTopicPicker(!showTopicPicker)}
                className="flex items-center justify-between w-full"
                style={{
                  height: '48px',
                  padding: '0 12px',
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #E6D5F0',
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}
              >
                <span
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 500,
                    fontSize: '12px',
                    color: '#1E293B'
                  }}
                >
                  {selectedTopic.length > 12 ? selectedTopic.substring(0, 12) + '...' : selectedTopic}
                </span>
                <ChevronDown size={14} color="#7D7D7D" />
              </button>

              {showTopicPicker && (
                <div
                  className="absolute z-10 mt-1 w-full"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #E6D5F0',
                    borderRadius: '10px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {topicOptions.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => {
                        setSelectedTopic(topic);
                        setShowTopicPicker(false);
                      }}
                      className="w-full text-left hover:bg-purple-50 transition-colors"
                      style={{
                        padding: '10px 12px',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 500,
                        fontSize: '12px',
                        color: topic === selectedTopic ? '#9B7EC7' : '#1E293B',
                        backgroundColor: topic === selectedTopic ? '#F3EBFF' : 'transparent',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selector Número de Preguntas */}
            <div className="relative">
              <button
                onClick={() => setShowQuestionsPicker(!showQuestionsPicker)}
                className="flex items-center justify-between w-full"
                style={{
                  height: '48px',
                  padding: '0 12px',
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #E6D5F0',
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}
              >
                <span
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 500,
                    fontSize: '12px',
                    color: '#1E293B'
                  }}
                >
                  {numQuestions} preguntas
                </span>
                <ChevronDown size={14} color="#7D7D7D" />
              </button>

              {showQuestionsPicker && (
                <div
                  className="absolute z-10 mt-1 w-full"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #E6D5F0',
                    borderRadius: '10px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {questionOptions.map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        setNumQuestions(num);
                        setShowQuestionsPicker(false);
                      }}
                      className="w-full text-left hover:bg-purple-50 transition-colors"
                      style={{
                        padding: '10px 12px',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 500,
                        fontSize: '12px',
                        color: num === numQuestions ? '#9B7EC7' : '#1E293B',
                        backgroundColor: num === numQuestions ? '#F3EBFF' : 'transparent',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {num} preguntas
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className="space-y-2" style={{ marginBottom: '20px' }}>
          <button
            onClick={handleCreateRoom}
            className="w-full transition-all"
            style={{
              height: '52px',
              backgroundColor: '#9B7EC7',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: '15px',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(155, 126, 199, 0.4)'
            }}
          >
            Iniciar Desafío
          </button>

          <button
            onClick={copyToClipboard}
            className="w-full transition-all"
            style={{
              height: '52px',
              backgroundColor: '#FFFFFF',
              color: '#9B7EC7',
              border: '2px solid #E6D5F0',
              borderRadius: '12px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: '15px',
              cursor: 'pointer'
            }}
          >
            Copiar código
          </button>
        </div>

        {/* ÚLTIMOS ENFRENTAMIENTOS */}
        <div>
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
            ÚLTIMOS ENFRENTAMIENTOS
          </h3>

          <div className="space-y-2">
            {duelHistory.map((duel) => (
              <div
                key={duel.id}
                className="flex items-center justify-between"
                style={{
                  padding: '12px 14px',
                  backgroundColor: '#FAFAFA',
                  borderRadius: '10px',
                  border: '1px solid #F3F4F6'
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: duel.result === 'won' ? '#D1FAE5' : '#FEE2E2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 700,
                      fontSize: '14px',
                      color: duel.result === 'won' ? '#10B981' : '#EF4444'
                    }}
                  >
                    {duel.opponentName.charAt(0)}
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 600,
                        fontSize: '13px',
                        color: '#1E293B',
                        marginBottom: '2px'
                      }}
                    >
                      {duel.opponentName}
                    </p>
                    <p
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '11px',
                        color: duel.result === 'won' ? '#10B981' : '#EF4444'
                      }}
                    >
                      {duel.score}
                    </p>
                  </div>
                </div>
                <button
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#F3EBFF',
                    color: '#9B7EC7',
                    border: 'none',
                    borderRadius: '6px',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 600,
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  Revancha
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}