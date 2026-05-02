import { useState, useEffect } from 'react';
import {
  ArrowLeft, Bell, UserPlus, BookOpen, FileText, Eye, Download,
  Trash2, CheckCheck, Loader2, BellOff,
} from 'lucide-react';
import {
  listarNotificacionesAPI, eliminarNotificacionAPI,
  marcarTodasLeidasAPI, type NotificacionAPI,
} from '../services/api';

interface NotificacionesProps {
  onBack: () => void;
  rol:    'ESTUDIANTE' | 'DOCENTE';
}

// ── Helpers de tema (color / ícono) por tipo ─────────────────
type TipoNotif =
  | 'nueva_suscripcion'
  | 'nueva_flashcard'
  | 'nuevo_material'
  | 'acceso_material'
  | 'descarga_material';

const TIPO_CONFIG: Record<TipoNotif, { icon: React.FC<any>; color: string; bg: string }> = {
  nueva_suscripcion: { icon: UserPlus,   color: '#9B7EC7', bg: '#F3EBFF' },
  nueva_flashcard:   { icon: BookOpen,   color: '#7952B3', bg: '#EDE4F8' },
  nuevo_material:    { icon: FileText,   color: '#059669', bg: '#D1FAE5' },
  acceso_material:   { icon: Eye,        color: '#F59E0B', bg: '#FEF3C7' },
  descarga_material: { icon: Download,   color: '#3B82F6', bg: '#DBEAFE' },
};

function getConfig(tipo: string) {
  return TIPO_CONFIG[tipo as TipoNotif] ?? {
    icon: Bell, color: '#64748B', bg: '#F1F5F9',
  };
}

// ── Formateo de fecha ─────────────────────────────────────────
function formatearFecha(iso: string): string {
  const fecha = new Date(iso);
  const ahora = new Date();
  const diffMs = ahora.getTime() - fecha.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffH   = Math.floor(diffMin / 60);
  const diffD   = Math.floor(diffH   / 24);

  if (diffMin < 1)  return 'Ahora mismo';
  if (diffMin < 60) return `Hace ${diffMin} min`;
  if (diffH   < 24) return `Hace ${diffH} h`;
  if (diffD   < 7)  return `Hace ${diffD} día${diffD > 1 ? 's' : ''}`;

  return fecha.toLocaleDateString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

// ─────────────────────────────────────────────────────────────
export function Notificaciones({ onBack, rol }: NotificacionesProps) {
  const isDocente = rol === 'DOCENTE';
  const primary   = isDocente ? '#F59E0B' : '#9B7EC7';
  const dark      = isDocente ? '#78350F' : '#FFFFFF';
  const bg        = isDocente ? '#FFFBF0' : '#F3EBFF';
  const headerBg  = isDocente
    ? 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)'
    : '#9B7EC7';

  const [notificaciones, setNotificaciones] = useState<NotificacionAPI[]>([]);
  const [cargando,       setCargando]       = useState(true);
  const [eliminando,     setEliminando]     = useState<number | null>(null);

  // Al montar: cargar notificaciones y marcar todas como leídas
  useEffect(() => {
    let activo = true;
    listarNotificacionesAPI()
      .then(lista => { if (activo) setNotificaciones(lista); })
      .catch(() => {})
      .finally(() => { if (activo) setCargando(false); });

    // Marcar todas como leídas en segundo plano
    marcarTodasLeidasAPI().catch(() => {});

    return () => { activo = false; };
  }, []);

  const handleEliminar = async (id: number) => {
    setEliminando(id);
    try {
      await eliminarNotificacionAPI(id);
      setNotificaciones(prev => prev.filter(n => n.id_notificacion !== id));
    } catch { /* silencioso */ }
    finally { setEliminando(null); }
  };

  const handleEliminarTodas = async () => {
    // Eliminar una por una (no hay endpoint bulk, pero la lista suele ser pequeña)
    const ids = notificaciones.map(n => n.id_notificacion);
    setNotificaciones([]);
    for (const id of ids) {
      await eliminarNotificacionAPI(id).catch(() => {});
    }
  };

  return (
    <div style={{
      height: '100%', width: '100%', display: 'flex', flexDirection: 'column',
      background: bg, maxWidth: '375px', maxHeight: '812px', margin: '0 auto',
    }}>
      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{
        background: headerBg, padding: '16px 20px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={onBack} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ArrowLeft size={24} color={dark} strokeWidth={2.5} />
          </button>
          <h1 style={{
            fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '18px',
            color: dark, margin: 0,
          }}>
            Notificaciones
          </h1>
        </div>

        {/* Botón eliminar todas */}
        {notificaciones.length > 0 && (
          <button
            onClick={handleEliminarTodas}
            title="Eliminar todas"
            style={{
              background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px',
              padding: '6px 10px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '5px',
            }}
          >
            <Trash2 size={15} color={dark} strokeWidth={2.5} />
            <span style={{
              fontFamily: 'Poppins, sans-serif', fontWeight: 600,
              fontSize: '11px', color: dark,
            }}>
              Limpiar
            </span>
          </button>
        )}
      </div>

      {/* ── Contenido ─────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>

        {/* Cargando */}
        {cargando && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            paddingTop: '60px', gap: '12px',
          }}>
            <Loader2 size={32} className="animate-spin" style={{ color: primary }} />
            <p style={{
              fontFamily: 'Poppins, sans-serif', fontSize: '14px',
              color: '#64748B', margin: 0,
            }}>
              Cargando notificaciones…
            </p>
          </div>
        )}

        {/* Sin notificaciones */}
        {!cargando && notificaciones.length === 0 && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            paddingTop: '64px', gap: '16px',
          }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              backgroundColor: '#FFFFFF', border: `2px solid ${primary}20`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <BellOff size={32} color={primary} strokeWidth={1.5} />
            </div>
            <p style={{
              fontFamily: 'Poppins, sans-serif', fontWeight: 600,
              fontSize: '15px', color: '#1E293B', margin: 0,
            }}>
              Todo al día
            </p>
            <p style={{
              fontFamily: 'Poppins, sans-serif', fontSize: '13px',
              color: '#94A3B8', margin: 0, textAlign: 'center',
            }}>
              No tienes notificaciones nuevas
            </p>
          </div>
        )}

        {/* Lista de notificaciones */}
        {!cargando && notificaciones.map(n => {
          const cfg      = getConfig(n.tipo);
          const Icono    = cfg.icon;
          const noLeida  = !n.leida;

          return (
            <div key={n.id_notificacion} style={{
              backgroundColor: '#FFFFFF',
              border: noLeida ? `1.5px solid ${primary}40` : '1.5px solid #F1F5F9',
              borderRadius: '16px', padding: '14px 14px 14px 14px',
              marginBottom: '10px', display: 'flex', alignItems: 'flex-start', gap: '12px',
              boxShadow: noLeida
                ? `0 4px 14px ${primary}18`
                : '0 2px 8px rgba(0,0,0,0.05)',
            }}>
              {/* Ícono de tipo */}
              <div style={{
                width: '42px', height: '42px', borderRadius: '12px',
                backgroundColor: cfg.bg, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icono size={20} color={cfg.color} strokeWidth={2.2} />
              </div>

              {/* Texto */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <span style={{
                    fontFamily: 'Poppins, sans-serif', fontWeight: 700,
                    fontSize: '13px', color: '#1E293B',
                  }}>
                    {n.titulo}
                  </span>
                  {noLeida && (
                    <span style={{
                      width: '7px', height: '7px', borderRadius: '50%',
                      backgroundColor: primary, flexShrink: 0,
                      display: 'inline-block',
                    }} />
                  )}
                </div>
                <p style={{
                  fontFamily: 'Poppins, sans-serif', fontSize: '12px',
                  color: '#475569', margin: '0 0 6px 0', lineHeight: '1.4',
                }}>
                  {n.mensaje}
                </p>
                <span style={{
                  fontFamily: 'Poppins, sans-serif', fontSize: '11px',
                  color: '#94A3B8', fontWeight: 500,
                }}>
                  {formatearFecha(n.fechaCreacion)}
                </span>
              </div>

              {/* Botón eliminar */}
              <button
                onClick={() => handleEliminar(n.id_notificacion)}
                disabled={eliminando === n.id_notificacion}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '4px', flexShrink: 0, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  opacity: eliminando === n.id_notificacion ? 0.4 : 0.6,
                }}
              >
                {eliminando === n.id_notificacion
                  ? <Loader2 size={15} className="animate-spin" color="#94A3B8" />
                  : <Trash2   size={15} color="#94A3B8" strokeWidth={2} />
                }
              </button>
            </div>
          );
        })}

        {/* Resumen leídas al pie */}
        {!cargando && notificaciones.length > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '6px', paddingTop: '8px', paddingBottom: '8px',
          }}>
            <CheckCheck size={14} color="#94A3B8" strokeWidth={2} />
            <span style={{
              fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: '#94A3B8',
            }}>
              Todas marcadas como leídas
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
