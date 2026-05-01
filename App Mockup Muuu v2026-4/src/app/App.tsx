import { useState, useEffect } from 'react';
import { MuuuApp } from './components/MuuuApp';

export default function App() {
  // Detecta si estamos en móvil para omitir el marco del teléfono
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── Móvil: pantalla completa sin marco ──────────────────────
  if (isMobile) {
    return (
      <div
        style={{
          width: '100%',
          height: '100dvh',   // altura dinámica (respeta la barra del navegador móvil)
          overflow: 'hidden',
          backgroundColor: '#FFFFFF',
          position: 'fixed',
          inset: 0,
        }}
      >
        <MuuuApp />
      </div>
    );
  }

  // ── Desktop: marco de teléfono centrado ─────────────────────
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="relative">
        {/* Marco iPhone */}
        <div className="w-[375px] h-[812px] bg-black rounded-[60px] p-2 shadow-2xl">
          {/* Pantalla */}
          <div className="w-full h-full bg-white rounded-[50px] overflow-hidden relative">
            <div className="size-full relative z-0">
              <MuuuApp />
            </div>
          </div>
        </div>

        {/* Botones laterales del iPhone */}
        <div className="absolute top-20 -left-1 w-1 h-12 bg-gray-800 rounded-l-sm" />
        <div className="absolute top-40 -left-1 w-1 h-16 bg-gray-800 rounded-l-sm" />
        <div className="absolute top-60 -left-1 w-1 h-16 bg-gray-800 rounded-l-sm" />
        <div className="absolute top-40 -right-1 w-1 h-20 bg-gray-800 rounded-r-sm" />
      </div>
    </div>
  );
}
