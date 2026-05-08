import { ArrowLeft, MessageCircle, Mail, Info, ChevronDown, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useThemeColors } from '../contexts/SettingsContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import muuuLogo from 'figma:asset/4de3de61f8e4df99b460b6420b603ae06ba0b967.png';

interface Props {
  onBack: () => void;
  role?: 'student' | 'teacher';
}

const faqs = [
  {
    q: '¿Qué es Muuu?',
    a: 'Muuu es una plataforma educativa gamificada de la Universidad del Magdalena que te permite aprender y repasar contenidos a través de flashcards, desafíos y materiales de estudio.',
  },
  {
    q: '¿Cómo puedo ganar puntos?',
    a: 'Ganas puntos al estudiar flashcards, completar desafíos en "Ponte a Prueba", mantener tu racha diaria y participar en duelos contra otros estudiantes.',
  },
  {
    q: '¿Puedo cambiar mi rol de Estudiante a Docente?',
    a: 'No es posible cambiar de rol directamente. Si necesitas un cambio de rol, contacta al administrador del sistema a través del correo de soporte.',
  },
  {
    q: '¿Mis datos están seguros?',
    a: 'Sí. Tus datos están almacenados de forma segura y protegidos con cifrado. No compartimos tu información con terceros.',
  },
  {
    q: '¿Cómo vinculo mi cuenta de Google?',
    a: 'En la pantalla de inicio de sesión, presiona "Continuar con Google". Si ya tienes una cuenta con el mismo correo, se vinculará automáticamente.',
  },
];

export function SubpantallaAyuda({ onBack, role = 'student' }: Props) {
  const c = useThemeColors(role);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Muuu - Aprende jugando 🐮',
          text: '¡Descubre Muuu! La plataforma educativa gamificada de la Universidad del Magdalena.',
          url: 'https://muuu-working.onrender.com',
        });
      } catch { /* User cancelled */ }
    } else {
      await navigator.clipboard.writeText('https://muuu-working.onrender.com');
      alert('Link copiado al portapapeles ✓');
    }
  };

  return (
    <div className="h-full w-full relative overflow-hidden" style={{ background: c.bgGradient }}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20" style={{ height: '80px', backgroundColor: c.headerBg, boxShadow: `0 2px 8px ${c.shadow}`, padding: '16px 20px' }}>
        <div className="flex items-center justify-between h-full">
          <button onClick={onBack} className="p-2 rounded-full" style={{ color: c.headerText }}>
            <ArrowLeft size={28} strokeWidth={2.5} />
          </button>
          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '24px', color: c.headerText }}>
            Ayuda y Soporte
          </h1>
          <div style={{ width: '44px' }} />
        </div>
      </div>

      <div className="absolute" style={{ top: '80px', left: 0, right: 0, bottom: 0, overflowY: 'auto', padding: '20px' }}>

        {/* ── FAQ ── */}
        <div className="p-5 rounded-2xl mb-4" style={{ backgroundColor: c.bgCard, border: `2px solid ${c.border}`, boxShadow: `0 2px 8px ${c.shadow}` }}>
          <h3 className="flex items-center gap-2 mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '16px', color: c.textPrimary }}>
            <MessageCircle size={20} color={c.purple} /> Preguntas frecuentes
          </h3>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-3 rounded-xl"
                  style={{ backgroundColor: openFaq === i ? c.bgSurface : 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  <p className="text-left" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: '14px', color: c.textPrimary, flex: 1, paddingRight: '8px' }}>
                    {faq.q}
                  </p>
                  <ChevronDown
                    size={18}
                    color={c.textMuted}
                    style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0 }}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-3 pb-3 pt-1">
                    <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', color: c.textSecondary, lineHeight: '1.5' }}>
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Contacto ── */}
        <div className="p-5 rounded-2xl mb-4" style={{ backgroundColor: c.bgCard, border: `2px solid ${c.border}`, boxShadow: `0 2px 8px ${c.shadow}` }}>
          <h3 className="flex items-center gap-2 mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '16px', color: c.textPrimary }}>
            <Mail size={20} color={c.purple} /> Contacto
          </h3>

          <a
            href="mailto:cie@unimagdalena.edu.co?subject=Soporte%20Muuu%20-%20Reporte"
            className="flex items-center justify-between p-3 rounded-xl mb-2"
            style={{ backgroundColor: c.bgSurface, textDecoration: 'none' }}
          >
            <div>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '14px', color: c.textPrimary }}>Reportar un problema</p>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', color: c.textMuted }}>cie@unimagdalena.edu.co</p>
            </div>
            <ExternalLink size={18} color={c.textMuted} />
          </a>

          {/* Compartir */}
          <button
            onClick={handleShare}
            className="w-full flex items-center justify-between p-3 rounded-xl"
            style={{ backgroundColor: c.bgSurface, border: 'none', cursor: 'pointer' }}
          >
            <div className="text-left">
              <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '14px', color: c.textPrimary }}>Compartir Muuu</p>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', color: c.textMuted }}>Invita a tus compañeros 🐮</p>
            </div>
            <ExternalLink size={18} color={c.textMuted} />
          </button>
        </div>

        {/* ── Acerca de ── */}
        <div className="p-5 rounded-2xl mb-4" style={{ backgroundColor: c.bgCard, border: `2px solid ${c.border}`, boxShadow: `0 2px 8px ${c.shadow}` }}>
          <h3 className="flex items-center gap-2 mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '16px', color: c.textPrimary }}>
            <Info size={20} color={c.purple} /> Acerca de Muuu
          </h3>
          <div className="flex flex-col items-center">
            <ImageWithFallback src={muuuLogo} alt="Muuu Logo" style={{ width: '80px', height: '80px', objectFit: 'contain', marginBottom: '12px' }} />
            <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '18px', color: c.textPrimary }}>Muuu</p>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', color: c.textMuted, marginBottom: '4px' }}>Versión 1.0.0</p>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', color: c.textMuted, textAlign: 'center' }}>
              Plataforma educativa gamificada
              <br />Universidad del Magdalena
              <br />CIE — 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
