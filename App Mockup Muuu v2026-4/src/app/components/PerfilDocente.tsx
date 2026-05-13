import { useState, useEffect } from 'react';
import { ArrowLeft, Edit2, Mail, Calendar, BadgeCheck } from 'lucide-react';
import { meAPI, UsuarioAPI, obtenerEstadisticasDocenteAPI, EstadisticasDocenteAPI } from '../services/api';
import { useThemeColors } from '../contexts/SettingsContext';

interface PerfilDocenteProps {
  onBack: () => void;
  userName?: string;
  onNavigateToMenu?: () => void;
  onNavigate?: (screen: string) => void;
}

export function PerfilDocente({ onBack, userName = 'Russo', onNavigateToMenu, onNavigate }: PerfilDocenteProps) {
  const c = useThemeColors('teacher');
  const [data,  setData]  = useState<UsuarioAPI | null>(null);
  const [stats, setStats] = useState<EstadisticasDocenteAPI | null>(null);

  useEffect(() => {
    meAPI().then(u => { if (u) setData(u); }).catch(() => {});
    obtenerEstadisticasDocenteAPI().then(setStats).catch(() => {});
  }, []);

  const nombre = data?.nombre ?? userName;
  const inicial = nombre.charAt(0).toUpperCase();

  return (
    <div
      className="h-full w-full relative overflow-y-auto"
      style={{
        background: c.bgPage,
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
            {data?.fotoPerfil ? (
              <img
                src={data.fotoPerfil}
                alt="Foto de perfil"
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #F59E0B',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
              />
            ) : (
              <div
                className="flex items-center justify-center"
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  border: '3px solid #F59E0B',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  fontSize: '40px',
                  color: '#F59E0B',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
              >
                {inicial}
              </div>
            )}

            {/* Botón de edición */}
            <button
              onClick={() => onNavigate?.('editarPerfil')}
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
          {nombre}
        </h2>

        {/* Badge negro de rol */}
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
            Docente
          </div>
        </div>

        {/* Estadísticas del docente */}
        <div
          className="flex items-center justify-center gap-6 pb-6"
          style={{ padding: '0 12px 24px 12px' }}
        >
          {/* Flashcards publicadas */}
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
              {stats?.flashcardsPublicadas ?? 0}
            </p>
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 500,
                fontSize: '11px',
                color: '#92400E'
              }}
            >
              Flashcards
            </p>
          </div>

          {/* Separador */}
          <div
            style={{
              width: '1px',
              height: '40px',
              backgroundColor: '#92400E',
              opacity: 0.3
            }}
          />

          {/* Materiales */}
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
              {stats?.materiales ?? 0}
            </p>
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 500,
                fontSize: '11px',
                color: '#92400E'
              }}
            >
              Materiales
            </p>
          </div>

          {/* Separador */}
          <div
            style={{
              width: '1px',
              height: '40px',
              backgroundColor: '#92400E',
              opacity: 0.3
            }}
          />

          {/* Suscriptores */}
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
              {stats?.suscriptores ?? 0}
            </p>
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 500,
                fontSize: '11px',
                color: '#92400E'
              }}
            >
              Alumnos
            </p>
          </div>
        </div>
      </div>

      {/* Zona Inferior Blanca/Crema */}
      <div style={{ background: c.bgCard, padding: '24px 20px' }}>
        {/* Información Personal */}
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
              backgroundColor: c.bgSurface,
              boxShadow: `0 2px 8px ${c.shadow}`
            }}
          >
            {/* Nº de identificación */}
            <div style={{ padding: '16px 20px' }}>
              <div className="flex items-start gap-3">
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: '#FEF3C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}
                >
                  <BadgeCheck size={20} color="#F59E0B" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <p
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 500,
                      fontSize: '11px',
                      color: c.textMuted,
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
                      color: c.textPrimary
                    }}
                  >
                    {data?.id_usuario ?? '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* Separador */}
            <div style={{ height: '1px', backgroundColor: c.border, margin: '0 20px' }} />

            {/* Correo electrónico */}
            <div style={{ padding: '16px 20px' }}>
              <div className="flex items-start gap-3">
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: '#FEF3C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}
                >
                  <Mail size={20} color="#F59E0B" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <p
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 500,
                      fontSize: '11px',
                      color: c.textMuted,
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
                      color: c.textPrimary
                    }}
                  >
                    {(() => {
                      const correo = data?.correo ?? '';
                      const atIdx = correo.indexOf('@');
                      if (atIdx < 0) return correo;
                      return (
                        <>
                          {correo.slice(0, atIdx)}
                          <br />
                          {'@' + correo.slice(atIdx + 1)}
                        </>
                      );
                    })()}
                  </p>
                </div>
              </div>
            </div>

            {/* Separador */}
            <div style={{ height: '1px', backgroundColor: c.border, margin: '0 20px' }} />

            {/* Última actividad */}
            <div style={{ padding: '16px 20px' }}>
              <div className="flex items-start gap-3">
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: '#FEF3C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}
                >
                  <Calendar size={20} color="#F59E0B" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <p
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 500,
                      fontSize: '11px',
                      color: c.textMuted,
                      marginBottom: '2px'
                    }}
                  >
                    Última sesión
                  </p>
                  <p
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: c.textPrimary
                    }}
                  >
                    {data?.ultimaSesion
                      ? (() => {
                          const d = new Date(data.ultimaSesion);
                          const fecha = d.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
                          const hora  = d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true });
                          return `${fecha} · ${hora}`;
                        })()
                      : 'Sin sesión registrada'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botón Editar Perfil */}
        <button
          className="w-full transition-all hover:scale-[1.02]"
          onClick={() => onNavigate?.('editarPerfil')}
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
