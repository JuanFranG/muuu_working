import { ArrowLeft, Lock, Mail, Shield, UserX, Trash2, Loader2, AlertTriangle, Link2 } from 'lucide-react';
import { useState } from 'react';
import { useThemeColors } from '../contexts/SettingsContext';
import { useSoundEffects } from '../hooks/useSoundEffects';

// Importamos la API de actualizar perfil
const BASE = '/api';
async function peticionPriv<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.mensaje || 'Error en la petición');
  return data;
}

interface Props {
  onBack: () => void;
  onLogout: () => void;
  role?: 'student' | 'teacher';
  userEmail?: string;
  userRole?: string;
  hasGoogle?: boolean;
}

export function SubpantallaPrivacidad({ onBack, onLogout, role = 'student', userEmail, userRole, hasGoogle }: Props) {
  const c = useThemeColors(role);
  const { playSuccess, playError, playClick } = useSoundEffects();

  // ── Cambiar contraseña ──
  const [showPassword, setShowPassword] = useState(false);
  const [contrasenaActual, setContrasenaActual] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [isChanging, setIsChanging] = useState(false);

  // ── Eliminar cuenta ──
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleChangePassword = async () => {
    setPasswordMsg('');
    setPasswordErr('');

    if (!contrasenaActual || !nuevaContrasena) {
      setPasswordErr('Completa todos los campos.');
      playError();
      return;
    }
    if (nuevaContrasena.length < 6) {
      setPasswordErr('La nueva contraseña debe tener al menos 6 caracteres.');
      playError();
      return;
    }
    if (nuevaContrasena !== confirmarContrasena) {
      setPasswordErr('Las contraseñas no coinciden.');
      playError();
      return;
    }

    setIsChanging(true);
    try {
      await peticionPriv('PATCH', '/auth/perfil', { contrasenaActual, nuevaContrasena });
      setPasswordMsg('Contraseña actualizada correctamente ✓');
      setContrasenaActual('');
      setNuevaContrasena('');
      setConfirmarContrasena('');
      setShowPassword(false);
      playSuccess();
    } catch (err: unknown) {
      setPasswordErr(err instanceof Error ? err.message : 'Error al cambiar contraseña.');
      playError();
    } finally {
      setIsChanging(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteText !== 'ELIMINAR') return;
    setIsDeleting(true);
    try {
      await peticionPriv('DELETE', '/auth/cuenta', {});
      playSuccess();
      onLogout();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error al eliminar cuenta.');
      playError();
    } finally {
      setIsDeleting(false);
    }
  };

  const inputStyle = {
    backgroundColor: c.bgInput,
    border: `2px solid ${c.border}`,
    color: c.textPrimary,
    fontFamily: 'Poppins, sans-serif',
    fontSize: '14px',
  };

  return (
    <div className="h-full w-full relative overflow-hidden" style={{ background: c.bgGradient }}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20" style={{ height: '80px', backgroundColor: c.headerBg, boxShadow: `0 2px 8px ${c.shadow}`, padding: '16px 20px' }}>
        <div className="flex items-center justify-between h-full">
          <button onClick={onBack} className="p-2 rounded-full" style={{ color: c.headerText }}>
            <ArrowLeft size={28} strokeWidth={2.5} />
          </button>
          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '22px', color: c.headerText }}>
            Privacidad y Seguridad
          </h1>
          <div style={{ width: '44px' }} />
        </div>
      </div>

      <div className="absolute" style={{ top: '80px', left: 0, right: 0, bottom: 0, overflowY: 'auto', padding: '20px' }}>

        {/* ── Info de sesión ── */}
        <div className="p-5 rounded-2xl mb-4" style={{ backgroundColor: c.bgCard, border: `2px solid ${c.border}`, boxShadow: `0 2px 8px ${c.shadow}` }}>
          <h3 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '16px', color: c.textPrimary, marginBottom: '12px' }}>
            Tu cuenta
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail size={18} color={c.purple} />
              <div>
                <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', color: c.textMuted }}>Correo</p>
                <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', color: c.textPrimary, fontWeight: 500 }}>{userEmail || 'No disponible'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield size={18} color={c.purple} />
              <div>
                <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', color: c.textMuted }}>Rol</p>
                <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', color: c.textPrimary, fontWeight: 500 }}>{userRole || 'No disponible'}</p>
              </div>
            </div>
            {hasGoogle && (
              <div className="flex items-center gap-3">
                <Link2 size={18} color={c.purple} />
                <div>
                  <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', color: c.textMuted }}>Google</p>
                  <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', color: c.success, fontWeight: 500 }}>Cuenta vinculada ✓</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Cambiar contraseña ── */}
        <div className="p-5 rounded-2xl mb-4" style={{ backgroundColor: c.bgCard, border: `2px solid ${c.border}`, boxShadow: `0 2px 8px ${c.shadow}` }}>
          <button
            onClick={() => { setShowPassword(!showPassword); playClick(); }}
            className="w-full flex items-center justify-between"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: c.bgSurface }}>
                <Lock size={20} color={c.purple} strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '14px', color: c.textPrimary }}>Cambiar contraseña</p>
                <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', color: c.textMuted }}>Actualiza tu contraseña</p>
              </div>
            </div>
            <ArrowLeft size={20} color={c.textMuted} style={{ transform: showPassword ? 'rotate(-90deg)' : 'rotate(180deg)', transition: 'transform 0.2s' }} />
          </button>

          {showPassword && (
            <div className="mt-4 space-y-3">
              <input type="password" placeholder="Contraseña actual" value={contrasenaActual} onChange={e => setContrasenaActual(e.target.value)} className="w-full p-3 rounded-lg" style={inputStyle} />
              <input type="password" placeholder="Nueva contraseña" value={nuevaContrasena} onChange={e => setNuevaContrasena(e.target.value)} className="w-full p-3 rounded-lg" style={inputStyle} />
              <input type="password" placeholder="Confirmar nueva contraseña" value={confirmarContrasena} onChange={e => setConfirmarContrasena(e.target.value)} className="w-full p-3 rounded-lg" style={inputStyle} />
              <button
                onClick={handleChangePassword}
                disabled={isChanging}
                className="w-full p-3 rounded-xl flex items-center justify-center gap-2"
                style={{ backgroundColor: c.purple, color: '#FFFFFF', fontFamily: 'Poppins, sans-serif', fontWeight: 600, cursor: isChanging ? 'not-allowed' : 'pointer', opacity: isChanging ? 0.7 : 1 }}
              >
                {isChanging && <Loader2 size={16} className="animate-spin" />}
                {isChanging ? 'Guardando...' : 'Guardar contraseña'}
              </button>
              {passwordMsg && <p className="text-sm text-center" style={{ color: c.success, fontFamily: 'Poppins, sans-serif' }}>{passwordMsg}</p>}
              {passwordErr && <p className="text-sm text-center" style={{ color: c.error, fontFamily: 'Poppins, sans-serif' }}>{passwordErr}</p>}
            </div>
          )}
        </div>

        {/* ── Zona peligrosa ── */}
        <div className="p-5 rounded-2xl mb-4" style={{ backgroundColor: c.errorBg, border: `2px solid ${c.error}40` }}>
          <h3 className="flex items-center gap-2 mb-3" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '16px', color: c.error }}>
            <AlertTriangle size={20} /> Zona peligrosa
          </h3>

          {!showDeleteConfirm ? (
            <button
              onClick={() => { setShowDeleteConfirm(true); playClick(); }}
              className="w-full flex items-center justify-between p-3 rounded-xl"
              style={{ backgroundColor: 'transparent', border: `2px solid ${c.error}40`, cursor: 'pointer' }}
            >
              <div className="flex items-center gap-3">
                <Trash2 size={20} color={c.error} />
                <div className="text-left">
                  <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '14px', color: c.error }}>Eliminar cuenta</p>
                  <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', color: c.textMuted }}>Esta acción es irreversible</p>
                </div>
              </div>
            </button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-start gap-2 p-3 rounded-lg" style={{ backgroundColor: c.bgCard }}>
                <UserX size={20} color={c.error} className="mt-0.5 flex-shrink-0" />
                <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', color: c.textPrimary }}>
                  Se eliminarán <strong>permanentemente</strong> todos tus datos: flashcards, puntos, progreso y materiales. Escribe <strong>ELIMINAR</strong> para confirmar.
                </p>
              </div>
              <input
                type="text"
                placeholder='Escribe "ELIMINAR"'
                value={deleteText}
                onChange={e => setDeleteText(e.target.value.toUpperCase())}
                className="w-full p-3 rounded-lg"
                style={{ ...inputStyle, borderColor: c.error }}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowDeleteConfirm(false); setDeleteText(''); }}
                  className="flex-1 p-3 rounded-xl"
                  style={{ backgroundColor: c.bgCard, border: `2px solid ${c.border}`, color: c.textPrimary, fontFamily: 'Poppins, sans-serif', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteText !== 'ELIMINAR' || isDeleting}
                  className="flex-1 p-3 rounded-xl flex items-center justify-center gap-2"
                  style={{ backgroundColor: deleteText === 'ELIMINAR' ? c.error : '#999', color: '#FFFFFF', fontFamily: 'Poppins, sans-serif', fontWeight: 600, cursor: deleteText === 'ELIMINAR' && !isDeleting ? 'pointer' : 'not-allowed' }}
                >
                  {isDeleting && <Loader2 size={16} className="animate-spin" />}
                  Eliminar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
