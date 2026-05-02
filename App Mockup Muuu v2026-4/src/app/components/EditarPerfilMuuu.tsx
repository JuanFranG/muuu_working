import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Camera, User, Lock, Eye, EyeOff, CheckCircle, Loader2 } from 'lucide-react';
import { meAPI, actualizarPerfilAPI, subirFotoPerfilAPI } from '../services/api';

interface EditarPerfilMuuuProps {
  onBack: () => void;
  rol: 'ESTUDIANTE' | 'DOCENTE';
}

export function EditarPerfilMuuu({ onBack, rol }: EditarPerfilMuuuProps) {
  const isDocente = rol === 'DOCENTE';
  const primary   = isDocente ? '#F59E0B' : '#9B7EC7';
  const dark      = isDocente ? '#78350F' : '#7952B3';
  const bg        = isDocente ? '#FFFBF0' : '#F3EBFF';
  const border    = isDocente ? '#FDE68A' : '#E6D5F0';

  const [nombre,          setNombre]          = useState('');
  const [fotoPerfil,      setFotoPerfil]      = useState<string | null>(null);
  const [inicial,         setInicial]         = useState('');
  const [mostrarPass,     setMostrarPass]     = useState(false);
  const [passActual,      setPassActual]      = useState('');
  const [passNueva,       setPassNueva]       = useState('');
  const [passConfirmar,   setPassConfirmar]   = useState('');
  const [verActual,       setVerActual]       = useState(false);
  const [verNueva,        setVerNueva]        = useState(false);
  const [verConfirmar,    setVerConfirmar]    = useState(false);
  const [guardando,       setGuardando]       = useState(false);
  const [subiendoFoto,    setSubiendoFoto]    = useState(false);
  const [mensaje,         setMensaje]         = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    meAPI().then(u => {
      if (!u) return;
      setNombre(u.nombre ?? '');
      setFotoPerfil(u.fotoPerfil ?? null);
      setInicial((u.nombre ?? '?').charAt(0).toUpperCase());
    }).catch(() => {});
  }, []);

  const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendoFoto(true);
    try {
      const url = await subirFotoPerfilAPI(file);
      setFotoPerfil(url);
      setMensaje({ tipo: 'ok', texto: 'Foto actualizada.' });
    } catch (err: any) {
      setMensaje({ tipo: 'error', texto: err.message ?? 'Error al subir la foto.' });
    } finally {
      setSubiendoFoto(false);
    }
  };

  const handleGuardar = async () => {
    setMensaje(null);
    if (!nombre.trim()) {
      setMensaje({ tipo: 'error', texto: 'El nombre no puede estar vacío.' });
      return;
    }
    if (mostrarPass) {
      if (!passActual) {
        setMensaje({ tipo: 'error', texto: 'Ingresa tu contraseña actual.' });
        return;
      }
      if (passNueva.length < 6) {
        setMensaje({ tipo: 'error', texto: 'La nueva contraseña debe tener al menos 6 caracteres.' });
        return;
      }
      if (passNueva !== passConfirmar) {
        setMensaje({ tipo: 'error', texto: 'Las contraseñas no coinciden.' });
        return;
      }
    }

    setGuardando(true);
    try {
      await actualizarPerfilAPI({
        nombre: nombre.trim(),
        ...(mostrarPass ? { contrasenaActual: passActual, nuevaContrasena: passNueva } : {}),
      });
      setMensaje({ tipo: 'ok', texto: 'Perfil actualizado correctamente.' });
      setPassActual(''); setPassNueva(''); setPassConfirmar('');
      if (mostrarPass) setMostrarPass(false);
    } catch (err: any) {
      setMensaje({ tipo: 'error', texto: err.message ?? 'No se pudo guardar.' });
    } finally {
      setGuardando(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '13px 16px',
    border: `2px solid ${border}`, borderRadius: '12px',
    fontFamily: 'Poppins, sans-serif', fontSize: '14px', color: '#1E293B',
    background: '#FFFFFF', outline: 'none', boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: 'Poppins, sans-serif', fontWeight: 600,
    fontSize: '12px', color: '#64748B', marginBottom: '6px', display: 'block',
  };

  return (
    <div style={{
      height: '100%', width: '100%', display: 'flex', flexDirection: 'column',
      background: bg, maxWidth: '375px', maxHeight: '812px', margin: '0 auto', overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{
        background: isDocente
          ? 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)'
          : '#9B7EC7',
        padding: '16px 20px', flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <ArrowLeft size={24} color={isDocente ? dark : '#FFFFFF'} strokeWidth={2.5} />
        </button>
        <h1 style={{
          fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '18px',
          color: isDocente ? dark : '#FFFFFF', margin: 0,
        }}>
          Editar Perfil
        </h1>
      </div>

      <div style={{ padding: '28px 20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Avatar */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            {fotoPerfil ? (
              <img src={fotoPerfil} alt="Foto de perfil" style={{
                width: '100px', height: '100px', borderRadius: '50%',
                objectFit: 'cover', border: `4px solid ${primary}`,
              }} />
            ) : (
              <div style={{
                width: '100px', height: '100px', borderRadius: '50%',
                backgroundColor: '#FFFFFF', border: `4px solid ${primary}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '40px', color: primary,
              }}>
                {subiendoFoto ? <Loader2 size={32} className="animate-spin" color={primary} /> : inicial}
              </div>
            )}
            <button
              onClick={() => fileRef.current?.click()}
              disabled={subiendoFoto}
              style={{
                position: 'absolute', bottom: '2px', right: '-2px',
                width: '34px', height: '34px', borderRadius: '50%',
                backgroundColor: primary, border: '3px solid #FFFFFF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Camera size={16} color="#FFFFFF" strokeWidth={2.5} />
            </button>
            <input
              ref={fileRef} type="file" accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFotoChange}
            />
          </div>
        </div>

        {/* Mensaje de feedback */}
        {mensaje && (
          <div style={{
            padding: '12px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: mensaje.tipo === 'ok' ? '#D1FAE5' : '#FEE2E2',
            border: `1px solid ${mensaje.tipo === 'ok' ? '#6EE7B7' : '#FECACA'}`,
          }}>
            {mensaje.tipo === 'ok' && <CheckCircle size={16} color="#10B981" />}
            <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px',
              color: mensaje.tipo === 'ok' ? '#065F46' : '#991B1B' }}>
              {mensaje.texto}
            </span>
          </div>
        )}

        {/* Nombre */}
        <div>
          <label style={labelStyle}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={14} color={primary} strokeWidth={2.5} />
              Nombre completo
            </span>
          </label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            style={inputStyle}
            placeholder="Tu nombre completo"
          />
        </div>

        {/* Sección cambiar contraseña */}
        <div style={{
          backgroundColor: '#FFFFFF', borderRadius: '16px',
          border: `1.5px solid ${border}`, overflow: 'hidden',
        }}>
          <button
            onClick={() => setMostrarPass(p => !p)}
            style={{
              width: '100%', padding: '16px 18px', background: 'none', border: 'none',
              display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
            }}
          >
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px', backgroundColor: bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Lock size={18} color={primary} strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600,
              fontSize: '14px', color: '#1E293B', flex: 1, textAlign: 'left' }}>
              Cambiar contraseña
            </span>
            <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', color: primary, fontWeight: 600 }}>
              {mostrarPass ? 'Cancelar' : 'Cambiar'}
            </span>
          </button>

          {mostrarPass && (
            <div style={{ padding: '4px 18px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Contraseña actual', val: passActual, setVal: setPassActual, ver: verActual, setVer: setVerActual },
                { label: 'Nueva contraseña', val: passNueva, setVal: setPassNueva, ver: verNueva, setVer: setVerNueva },
                { label: 'Confirmar nueva contraseña', val: passConfirmar, setVal: setPassConfirmar, ver: verConfirmar, setVer: setVerConfirmar },
              ].map(({ label, val, setVal, ver, setVer }) => (
                <div key={label}>
                  <label style={labelStyle}>{label}</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={ver ? 'text' : 'password'}
                      value={val}
                      onChange={e => setVal(e.target.value)}
                      style={{ ...inputStyle, paddingRight: '44px' }}
                      placeholder="••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setVer((v: boolean) => !v)}
                      style={{
                        position: 'absolute', right: '12px', top: '50%',
                        transform: 'translateY(-50%)', background: 'none', border: 'none',
                        cursor: 'pointer', color: '#9CA3AF',
                      }}
                    >
                      {ver ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botón guardar */}
        <button
          onClick={handleGuardar}
          disabled={guardando}
          style={{
            width: '100%', padding: '15px',
            background: isDocente
              ? 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)'
              : '#9B7EC7',
            color: isDocente ? dark : '#FFFFFF',
            border: 'none', borderRadius: '14px',
            fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '15px',
            cursor: guardando ? 'not-allowed' : 'pointer',
            opacity: guardando ? 0.7 : 1,
            boxShadow: isDocente
              ? '0 4px 12px rgba(245,158,11,0.3)'
              : '0 4px 12px rgba(155,126,199,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}
        >
          {guardando && <Loader2 size={18} className="animate-spin" />}
          {guardando ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  );
}
