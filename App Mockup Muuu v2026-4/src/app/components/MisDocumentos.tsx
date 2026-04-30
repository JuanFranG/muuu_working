import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Edit3, Trash2, ExternalLink, FileText, Video, Link, Image } from 'lucide-react';
import {
  listarMaterialesAPI,
  eliminarMaterialAPI,
  type MaterialAPI,
} from '../services/api';

interface MisDocumentosProps {
  onBack:          () => void;
  onEditMaterial:  (id: number) => void;
}

const TIPO_ICON: Record<string, React.ReactNode> = {
  PDF:    <FileText size={14} strokeWidth={2.5} />,
  IMAGEN: <Image    size={14} strokeWidth={2.5} />,
  VIDEO:  <Video    size={14} strokeWidth={2.5} />,
  LINK:   <Link     size={14} strokeWidth={2.5} />,
  RESUMEN:<FileText size={14} strokeWidth={2.5} />,
};

const TIPO_COLOR: Record<string, string> = {
  PDF:    '#E6D5F0',
  IMAGEN: '#D1FAE5',
  VIDEO:  '#FEE2E2',
  LINK:   '#DBEAFE',
  RESUMEN:'#FEF3C7',
};

const TIPO_TEXT: Record<string, string> = {
  PDF:    '#7952B3',
  IMAGEN: '#065F46',
  VIDEO:  '#991B1B',
  LINK:   '#1E40AF',
  RESUMEN:'#92400E',
};

function normalizarUrl(url: string): string {
  if (!url || url === 'sin-archivo') return '';
  if (url.startsWith('/uploads/')) return url;
  if (url.startsWith('http://localhost:8080/uploads/')) return url.replace('http://localhost:8080', '');
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `/uploads/${url}`;
}

export function MisDocumentos({ onBack, onEditMaterial }: MisDocumentosProps) {
  const [materiales, setMateriales] = useState<MaterialAPI[]>([]);
  const [cargando,   setCargando]   = useState(true);
  const [errorMsg,   setErrorMsg]   = useState('');
  const [accionando, setAccionando] = useState<number | null>(null);

  const cargar = async () => {
    setCargando(true);
    setErrorMsg('');
    try {
      const data = await listarMaterialesAPI();
      setMateriales(data);
    } catch {
      setErrorMsg('No se pudieron cargar los materiales.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const handleEliminar = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('¿Eliminar este material? Esta acción no se puede deshacer.')) return;
    setAccionando(id);
    try {
      await eliminarMaterialAPI(id);
      setMateriales(prev => prev.filter(m => m.id_material !== id));
    } catch {
      alert('Error al eliminar el material.');
    } finally {
      setAccionando(null);
    }
  };

  const handlePrevisualizar = (m: MaterialAPI, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = normalizarUrl(m.urlArchivo);
    if (!url) { alert('Este material no tiene archivo disponible.'); return; }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const tipoLabel = (tipo: string) => {
    const map: Record<string, string> = {
      PDF: 'PDF', IMAGEN: 'Imagen', VIDEO: 'Video', LINK: 'Enlace', RESUMEN: 'Resumen',
    };
    return map[tipo.toUpperCase()] ?? tipo;
  };

  return (
    <div style={{
      height: '100%', width: '100%', display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(180deg, #FFF8EC 0%, #FFFFFF 100%)', overflow: 'hidden',
    }}>
      {/* HEADER */}
      <div style={{
        backgroundColor: '#F5A623', padding: '16px 20px', flexShrink: 0,
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={onBack} style={{
            width: '36px', height: '36px', borderRadius: '50%', border: 'none',
            background: 'rgba(61,35,1,0.15)', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <ArrowLeft size={20} style={{ color: '#3D2301' }} strokeWidth={2.5} />
          </button>
          <div>
            <h1 style={{
              fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '18px',
              color: '#3D2301', margin: 0,
            }}>
              Mis Documentos 📁
            </h1>
            {!cargando && (
              <p style={{
                fontFamily: 'Poppins, sans-serif', fontSize: '12px', color: '#3D2301',
                opacity: 0.7, margin: 0,
              }}>
                {materiales.length} material{materiales.length !== 1 ? 'es' : ''} subidos
              </p>
            )}
          </div>
        </div>
      </div>

      {/* LISTA */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>

        {cargando && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '60px', gap: '12px' }}>
            <Loader2 size={32} className="animate-spin" style={{ color: '#F5A623' }} />
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', color: '#7D7D7D' }}>
              Cargando tus documentos...
            </p>
          </div>
        )}

        {!cargando && errorMsg && (
          <div style={{
            padding: '16px', backgroundColor: '#FEE2E2', borderRadius: '8px',
            fontFamily: 'Poppins, sans-serif', fontSize: '13px', color: '#991B1B',
          }}>
            {errorMsg}
          </div>
        )}

        {!cargando && !errorMsg && materiales.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: '60px' }}>
            <p style={{ fontSize: '48px', marginBottom: '12px' }}>📭</p>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', color: '#7D7D7D' }}>
              Aún no has subido ningún material.
            </p>
          </div>
        )}

        {!cargando && materiales.map(m => {
          const tipoUp    = (m.tipo ?? '').toUpperCase();
          const urlValida = normalizarUrl(m.urlArchivo) !== '';

          return (
            <div
              key={m.id_material}
              style={{
                backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '16px',
                marginBottom: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                border: '2px solid #FEF3C7',
              }}
            >
              {/* Cabecera: tipo badge + fecha */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  padding: '3px 10px', borderRadius: '999px',
                  fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '10px',
                  backgroundColor: TIPO_COLOR[tipoUp] ?? '#F3F4F6',
                  color: TIPO_TEXT[tipoUp] ?? '#6B7280',
                }}>
                  {TIPO_ICON[tipoUp] ?? <FileText size={14} />}
                  {tipoLabel(m.tipo)}
                </span>
                <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: '#9CA3AF' }}>
                  {new Date(m.fechaCarga).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>

              {/* Título */}
              <p style={{
                fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '15px',
                color: '#1E293B', marginBottom: '8px', lineHeight: '1.4',
              }}>
                {m.titulo}
              </p>

              {/* Tags: tema + dificultad + sin-archivo */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span style={{
                  padding: '2px 8px', borderRadius: '6px',
                  backgroundColor: '#E6D5F0', color: '#7952B3',
                  fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '10px',
                }}>
                  {m.tema}
                </span>
                <span style={{
                  padding: '2px 8px', borderRadius: '6px',
                  backgroundColor: '#F3F4F6', color: '#6B7280',
                  fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '10px',
                }}>
                  {m.dificultad}
                </span>
                {!urlValida && (
                  <span style={{
                    padding: '2px 8px', borderRadius: '6px',
                    backgroundColor: '#FEE2E2', color: '#991B1B',
                    fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '10px',
                  }}>
                    ⚠ Sin archivo
                  </span>
                )}
              </div>

              {/* Botones */}
              <div style={{ display: 'flex', gap: '8px' }} onClick={e => e.stopPropagation()}>
                {/* Previsualizar */}
                {urlValida && (
                  <button
                    onClick={e => handlePrevisualizar(m, e)}
                    style={{
                      flex: 1, padding: '8px', borderRadius: '10px', border: 'none',
                      backgroundColor: '#EDE9FE', color: '#6D28D9', cursor: 'pointer',
                      fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '12px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                    }}
                  >
                    <ExternalLink size={13} strokeWidth={2.5} />
                    Ver
                  </button>
                )}

                {/* Editar */}
                <button
                  onClick={() => onEditMaterial(m.id_material)}
                  style={{
                    flex: 1, padding: '8px', borderRadius: '10px', border: 'none',
                    backgroundColor: '#F5A623', color: '#3D2301', cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                  }}
                >
                  <Edit3 size={13} strokeWidth={2.5} />
                  Editar
                </button>

                {/* Eliminar */}
                <button
                  onClick={e => handleEliminar(m.id_material, e)}
                  disabled={accionando === m.id_material}
                  style={{
                    width: '36px', height: '36px', borderRadius: '10px', border: 'none',
                    backgroundColor: '#FEE2E2', color: '#DC2626', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: accionando === m.id_material ? 0.6 : 1, flexShrink: 0,
                  }}
                >
                  <Trash2 size={15} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
