import { ArrowLeft, Edit2 } from 'lucide-react';

interface PerfilDocenteProps {
  onBack: () => void;
  userName?: string;
  onNavigateToMenu?: () => void;
}

export function PerfilDocente({ onBack, userName = 'Russo', onNavigateToMenu }: PerfilDocenteProps) {
  const teacherData = {
    firstName: 'María',
    lastName: 'García',
    code: 'DOC-2024001',
    email: 'maria.garcia@midominio.edu.co',
    registrationDate: '10 Enero 2025',
    totalStudents: 124,
    flashcardsCreated: 87,
    averageScore: 8.5,
    department: 'Matemáticas'
  };

  return (
    <div 
      className="h-full w-full relative overflow-y-auto"
      style={{ 
        background: '#FFFFFF',
        maxWidth: '375px',
        maxHeight: '812px',
        margin: '0 auto'
      }}
    >
      {/* Zona Superior Amarilla */}
      <div style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)' }}>
        {/* Header */}
        <div 
          style={{ 
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <button
            onClick={onNavigateToMenu || onBack}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ArrowLeft size={28} color="#78350F" strokeWidth={2.5} />
          </button>

          <h1 
            style={{ 
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: '20px',
              color: '#78350F',
              flex: 1
            }}
          >
            Mi Perfil
          </h1>
        </div>

        {/* Avatar con icono de edición */}
        <div className="flex justify-center mb-4" style={{ paddingTop: '8px' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div 
              className="flex items-center justify-center"
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                border: '3px solid #F59E0B', // Borde igual al del botón de edición
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: '40px',
                color: '#F59E0B',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
            >
              M
            </div>
            
            {/* Botón de edición morado diagonal abajo-derecha */}
            <button
              style={{
                position: 'absolute',
                right: '-4px',
                bottom: '4px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#9B7EC7',
                border: '3px solid #F59E0B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(155, 126, 199, 0.5)'
              }}
            >
              <Edit2 size={16} color="#FFFFFF" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Nombre */}
        <h2 
          className="text-center mb-2"
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 700,
            fontSize: '22px',
            color: '#78350F'
          }}
        >
          {teacherData.firstName} {teacherData.lastName}
        </h2>

        {/* Badge negro de departamento */}
        <div className="flex justify-center mb-5">
          <div
            style={{
              backgroundColor: '#000000',
              color: '#FFFFFF',
              padding: '6px 16px',
              borderRadius: '12px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              fontSize: '12px'
            }}
          >
            {teacherData.department}
          </div>
        </div>

        {/* Estadísticas - Una línea horizontal con separadores | */}
        <div 
          className="flex items-center justify-center gap-6 pb-6"
          style={{ padding: '0 12px 24px 12px' }}
        >
          {/* Estudiantes */}
          <div className="flex flex-col items-center">
            <p 
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 800,
                fontSize: '24px',
                color: '#78350F',
                lineHeight: '1',
                marginBottom: '4px'
              }}
            >
              {teacherData.totalStudents}
            </p>
            <p 
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 500,
                fontSize: '11px',
                color: '#92400E'
              }}
            >
              Estudiantes
            </p>
          </div>

          {/* Separador | */}
          <div 
            style={{
              width: '1px',
              height: '40px',
              backgroundColor: '#92400E',
              opacity: 0.3
            }}
          />

          {/* Cards */}
          <div className="flex flex-col items-center">
            <p 
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 800,
                fontSize: '24px',
                color: '#78350F',
                lineHeight: '1',
                marginBottom: '4px'
              }}
            >
              {teacherData.flashcardsCreated}
            </p>
            <p 
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 500,
                fontSize: '11px',
                color: '#92400E'
              }}
            >
              Cards
            </p>
          </div>

          {/* Separador | */}
          <div 
            style={{
              width: '1px',
              height: '40px',
              backgroundColor: '#92400E',
              opacity: 0.3
            }}
          />

          {/* Promedio */}
          <div className="flex flex-col items-center">
            
            
          </div>
        </div>
      </div>

      {/* Zona Inferior Blanca/Crema */}
      <div style={{ background: '#FFFBF0', padding: '24px 20px' }}>
        {/* Información Personal - Card única con separadores */}
        <div className="mb-6">
          <h3 
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: '11px',
              color: '#78350F',
              letterSpacing: '0.5px',
              marginBottom: '12px',
              textTransform: 'uppercase'
            }}
          >
            Información Personal
          </h3>

          <div
            className="rounded-xl overflow-hidden"
            style={{
              backgroundColor: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
            }}
          >
            {/* Nº de identificación */}
            <div style={{ padding: '16px 20px' }}>
              <div className="flex items-center gap-3">
                <span style={{ fontSize: '28px' }}>🪪</span>
                <div className="flex-1">
                  <p 
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 500,
                      fontSize: '11px',
                      color: '#9CA3AF',
                      marginBottom: '2px'
                    }}
                  >
                    Nº de identificación
                  </p>
                  <p 
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#1F2937'
                    }}
                  >
                    {teacherData.code}
                  </p>
                </div>
              </div>
            </div>

            {/* Separador */}
            <div style={{ height: '1px', backgroundColor: '#E5E7EB', margin: '0 20px' }} />

            {/* Correo electrónico */}
            <div style={{ padding: '16px 20px' }}>
              <div className="flex items-center gap-3">
                <span style={{ fontSize: '28px' }}>📧</span>
                <div className="flex-1">
                  <p 
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 500,
                      fontSize: '11px',
                      color: '#9CA3AF',
                      marginBottom: '2px'
                    }}
                  >
                    Correo electrónico
                  </p>
                  <p 
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#1F2937'
                    }}
                  >
                    {teacherData.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Separador */}
            <div style={{ height: '1px', backgroundColor: '#E5E7EB', margin: '0 20px' }} />

            {/* Fecha de registro */}
            <div style={{ padding: '16px 20px' }}>
              <div className="flex items-center gap-3">
                <span style={{ fontSize: '28px' }}>📅</span>
                <div className="flex-1">
                  <p 
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 500,
                      fontSize: '11px',
                      color: '#9CA3AF',
                      marginBottom: '2px'
                    }}
                  >
                    Fecha de registro
                  </p>
                  <p 
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#1F2937'
                    }}
                  >
                    {teacherData.registrationDate}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botón Editar Perfil - Ancho completo */}
        <button
          className="w-full transition-all hover:scale-[1.02]"
          style={{
            background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
            color: '#78350F',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 700,
            fontSize: '16px',
            padding: '16px',
            borderRadius: '12px',
            border: 'none',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
            cursor: 'pointer'
          }}
        >
          Editar Perfil
        </button>
      </div>
    </div>
  );
}