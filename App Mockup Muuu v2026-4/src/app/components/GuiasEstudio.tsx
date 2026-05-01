import { ArrowLeft, BookOpen } from 'lucide-react';

interface GuiasEstudioProps {
  onBack: () => void;
}

export function GuiasEstudio({ onBack }: GuiasEstudioProps) {
  return (
    <div
      className="h-full relative overflow-y-auto flex flex-col"
      style={{
        background: 'linear-gradient(135deg, #7952B3 0%, #9B7EC7 100%)'
      }}
    >
      {/* HEADER */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: '20px',
          paddingTop: '24px'
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
            fontSize: '18px',
            color: '#FFFFFF'
          }}
        >
          Guías de Estudio
        </h1>

        <div style={{ width: '36px' }}></div>
      </div>

      {/* CONTENIDO */}
      <div
        className="flex-1 flex flex-col items-center justify-center"
        style={{
          marginTop: '40px',
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: '32px',
          borderTopRightRadius: '32px',
          padding: '40px 20px'
        }}
      >
        <div
          className="flex items-center justify-center"
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            backgroundColor: '#F3EBFF',
            marginBottom: '24px'
          }}
        >
          <BookOpen size={60} color="#9B7EC7" strokeWidth={2} />
        </div>

        <h2
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 700,
            fontSize: '24px',
            color: '#1E293B',
            marginBottom: '12px',
            textAlign: 'center'
          }}
        >
          Próximamente
        </h2>

        <p
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '14px',
            color: '#7D7D7D',
            textAlign: 'center',
            maxWidth: '280px',
            lineHeight: '1.6'
          }}
        >
          Estamos trabajando en las guías de estudio para que puedas aprender aún más con Ada
        </p>

        <button
          onClick={onBack}
          style={{
            marginTop: '32px',
            padding: '14px 28px',
            backgroundColor: '#9B7EC7',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(155, 126, 199, 0.3)'
          }}
        >
          Volver al Home
        </button>
      </div>
    </div>
  );
}
