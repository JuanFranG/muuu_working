import { useState, useEffect } from 'react';
import { ArrowLeft, FileDown, Loader2 } from 'lucide-react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import {
  obtenerReporteDocenteAPI,
  type ReporteDocenteData,
} from '../services/api';

interface ReporteDocenteProps {
  onBack: () => void;
}

/* Renderiza LaTeX en MathML (sin CSS externo, sin fuentes custom —
   el navegador lo muestra nativamente en Chrome 109+, Safari, Firefox) */
const toMath = (raw: string): string => {
  const src = raw.replace(/^\$+|\$+$/g, '').trim();
  try {
    return katex.renderToString(src, { throwOnError: false, output: 'mathml' });
  } catch {
    return raw;
  }
};

/* Renderiza LaTeX en HTML+CSS para la preview de React (usa katex.min.css importado arriba) */
const toKatex = (raw: string): string => {
  const src = raw.replace(/^\$+|\$+$/g, '').trim();
  try {
    return katex.renderToString(src, { throwOnError: false, displayMode: false });
  } catch {
    return raw;
  }
};

export function ReporteDocente({ onBack }: ReporteDocenteProps) {
  const [datos,    setDatos]    = useState<ReporteDocenteData | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerReporteDocenteAPI()
      .then(setDatos)
      .finally(() => setCargando(false));
  }, []);

  const exportarPDF = () => {
    if (!datos) return;

    /* ── Constantes declaradas primero ── */
    const clr = (t: number) => t >= 70 ? '#15803d' : t >= 40 ? '#b45309' : '#b91c1c';
    const tdI = 'padding:8px 10px;border-bottom:1px solid #e5e7eb;vertical-align:middle';
    const thI = 'padding:9px 10px;text-align:left;color:#fff;font-size:11px;letter-spacing:.3px;font-family:Arial,sans-serif';

    const rowsEst = datos.estudiantes.length === 0
      ? `<tr><td colspan="8" style="text-align:center;padding:20px;color:#9ca3af;font-style:italic">Sin estudiantes suscritos</td></tr>`
      : datos.estudiantes.map((e, i) =>
          `<tr style="background:${i % 2 === 0 ? '#fff' : '#f9fafb'}">
            <td style="${tdI};text-align:center">${i + 1}</td>
            <td style="${tdI};font-weight:600">${e.nombre}</td>
            <td style="${tdI};font-size:11px;color:#6b7280">${e.correo}</td>
            <td style="${tdI};text-align:center">${e.respondidas}</td>
            <td style="${tdI};text-align:center;color:#15803d;font-weight:700">${e.correctas}</td>
            <td style="${tdI};text-align:center;color:#b91c1c;font-weight:700">${e.incorrectas}</td>
            <td style="${tdI};text-align:center;font-weight:700;color:${clr(e.tasa)}">${e.respondidas > 0 ? `${e.tasa}%` : '—'}</td>
            <td style="${tdI};text-align:center;color:#4a008f;font-weight:700">${e.puntos}</td>
          </tr>`).join('');

    const rowsFall = datos.masFalladas.length === 0
      ? `<tr><td colspan="5" style="text-align:center;padding:20px;color:#9ca3af;font-style:italic">Sin datos de quizzes</td></tr>`
      : datos.masFalladas.map((fc, i) =>
          `<tr style="background:${i % 2 === 0 ? '#fff' : '#f9fafb'}">
            <td style="${tdI};text-align:center">${i + 1}</td>
            <td style="${tdI}">${toMath(fc.integral)}</td>
            <td style="${tdI}">${fc.tema}</td>
            <td style="${tdI};text-align:center">${fc.veces}</td>
            <td style="${tdI};text-align:center;font-weight:700;color:${clr(fc.tasa)}">${fc.tasa}%</td>
          </tr>`).join('');

    const thsHTML = (cols: string[]) =>
      cols.map(h => `<th style="${thI}">${h}</th>`).join('');

    /* ── Contenido del reporte (sin <html>/<head>, solo el body) ── */
    const contenido = `
<div style="border-bottom:3px double #1a1a1a;padding-bottom:16px;margin-bottom:22px">
  <div style="display:flex;justify-content:space-between;align-items:flex-start">
    <div>
      <div style="font-family:Arial,sans-serif;font-weight:900;font-size:22px;color:#4a008f">MUUU App</div>
      <div style="font-size:12px;color:#444;margin-top:3px">Universidad del Magdalena · Cálculo Integral</div>
    </div>
    <div style="text-align:right;font-size:11px;color:#555;font-family:Arial,sans-serif">
      <div><strong>Generado:</strong> ${datos.fechaReporte}</div>
      <div><strong>Docente:</strong> ${datos.docente.nombre}</div>
      <div style="color:#6b7280">${datos.docente.correo}</div>
    </div>
  </div>
  <div style="margin-top:16px;text-align:center;font-family:Arial,sans-serif;font-weight:700;font-size:16px;text-transform:uppercase;letter-spacing:.5px">
    Informe de Rendimiento Académico
  </div>
  <div style="text-align:center;font-size:11px;color:#888;margin-top:3px">
    Reporte detallado de actividad estudiantil en flashcards de Cálculo Integral
  </div>
</div>

<h2 style="font-family:Arial,sans-serif;font-size:12px;font-weight:700;text-transform:uppercase;border-bottom:1px solid #d1d5db;padding-bottom:5px;margin:24px 0 12px;letter-spacing:.4px">1. Resumen General</h2>
<table style="width:100%;border-collapse:collapse;font-size:12px;border:1px solid #d1d5db;margin-bottom:8px">
  <thead><tr style="background:#4a008f">${thsHTML(['Flashcards','Estudiantes','Materiales','Respuestas','Tasa aciertos'])}</tr></thead>
  <tbody>
    <tr style="text-align:center;font-family:Arial,sans-serif;font-weight:700;font-size:20px">
      <td style="padding:12px">${datos.flashcardsPublicadas}</td>
      <td style="padding:12px">${datos.totalSuscriptores}</td>
      <td style="padding:12px">${datos.materiales}</td>
      <td style="padding:12px">${datos.totalRespuestas}</td>
      <td style="padding:12px;color:${clr(datos.tasaAciertos)}">${datos.tasaAciertos}%</td>
    </tr>
  </tbody>
</table>

<h2 style="font-family:Arial,sans-serif;font-size:12px;font-weight:700;text-transform:uppercase;border-bottom:1px solid #d1d5db;padding-bottom:5px;margin:24px 0 12px;letter-spacing:.4px">2. Rendimiento por Estudiante</h2>
<table style="width:100%;border-collapse:collapse;font-size:12px;border:1px solid #d1d5db;margin-bottom:8px">
  <thead><tr style="background:#4a008f">${thsHTML(['#','Nombre','Correo','Respondidas','Correctas','Incorrectas','Aciertos','Puntos'])}</tr></thead>
  <tbody>${rowsEst}</tbody>
</table>

<h2 style="font-family:Arial,sans-serif;font-size:12px;font-weight:700;text-transform:uppercase;border-bottom:1px solid #d1d5db;padding-bottom:5px;margin:24px 0 12px;letter-spacing:.4px">3. Flashcards con Menor Tasa de Aciertos</h2>
<table style="width:100%;border-collapse:collapse;font-size:12px;border:1px solid #d1d5db;margin-bottom:8px">
  <thead><tr style="background:#4a008f">${thsHTML(['#','Flashcard (integral)','Tema','Veces respondida','Tasa aciertos'])}</tr></thead>
  <tbody>${rowsFall}</tbody>
</table>

<div style="border-top:2px solid #1a1a1a;margin-top:28px;padding-top:10px;display:flex;justify-content:space-between;font-size:10px;color:#9ca3af;font-family:Arial,sans-serif">
  <span>MUUU App · Universidad del Magdalena · 2026</span>
  <span>Generado automáticamente · ${datos.fechaReporte}</span>
</div>`;

    /* ── Inyectar en la misma página con CSS que oculta el resto al imprimir ── */
    const styleEl = document.createElement('style');
    styleEl.id = '__muuu_print_style__';
    styleEl.textContent = `
      @media print {
        body > *:not(#__muuu_report__) { display: none !important; }
        #__muuu_report__ {
          display: block !important;
          position: fixed;
          top: 0; left: 0;
          width: 100%;
          padding: 14mm 16mm;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 13px;
          color: #1a1a1a;
          background: white;
        }
        @page { margin: 6mm; size: A4 portrait; }
      }
    `;

    const divEl = document.createElement('div');
    divEl.id = '__muuu_report__';
    divEl.style.display = 'none';
    divEl.innerHTML = contenido;

    document.head.appendChild(styleEl);
    document.body.appendChild(divEl);

    /* ── Imprimir y limpiar ── */
    window.print();

    const limpiar = () => {
      document.getElementById('__muuu_print_style__')?.remove();
      document.getElementById('__muuu_report__')?.remove();
    };

    if ('onafterprint' in window) {
      window.onafterprint = limpiar;
    } else {
      setTimeout(limpiar, 3000);
    }
  };

  /* ── color para la preview de React ── */
  const colorTasa = (t: number) =>
    t >= 70 ? '#15803d' : t >= 40 ? '#b45309' : '#b91c1c';

  if (cargando) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%' }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <Loader2 size={32} style={{ animation:'spin 1s linear infinite' }} color="#7c3aed" />
      </div>
    );
  }

  if (!datos) {
    return (
      <div style={{ padding:'40px', textAlign:'center', fontFamily:'Poppins, sans-serif' }}>
        <p>No se pudo cargar el reporte.</p>
        <button onClick={onBack} style={{ marginTop:'16px', cursor:'pointer' }}>Volver</button>
      </div>
    );
  }

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* ── BARRA SUPERIOR ── */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'14px 20px',
        background:'linear-gradient(135deg, #4a008f, #7c3aed)',
        position:'sticky', top:0, zIndex:10,
      }}>
        <button onClick={onBack} style={{
          background:'rgba(255,255,255,0.2)', border:'none', borderRadius:'50%',
          width:'36px', height:'36px', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <ArrowLeft size={20} color="white" />
        </button>

        <span style={{ fontFamily:'Poppins, sans-serif', fontWeight:700, fontSize:'16px', color:'white' }}>
          Vista previa del reporte
        </span>

        <button onClick={exportarPDF} style={{
          background:'white', border:'none', borderRadius:'20px',
          padding:'8px 16px', cursor:'pointer',
          display:'flex', alignItems:'center', gap:'6px',
          fontFamily:'Poppins, sans-serif', fontWeight:700, fontSize:'13px', color:'#4a008f',
        }}>
          <FileDown size={15} color="#4a008f" />
          Exportar PDF
        </button>
      </div>

      {/* ── CONTENIDO VISUAL ── */}
      <div style={{ background:'#f8f8f8', minHeight:'100%', overflowY:'auto' }}>
        <div style={{
          maxWidth:'820px', margin:'0 auto', background:'white',
          padding:'40px 48px', fontFamily:'Georgia, "Times New Roman", serif',
          boxShadow:'0 4px 24px rgba(0,0,0,0.08)',
        }}>

          {/* Encabezado */}
          <div style={{ borderBottom:'3px double #1a1a1a', paddingBottom:'20px', marginBottom:'28px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div>
                <div style={{ fontFamily:'Poppins, sans-serif', fontWeight:900, fontSize:'22px', color:'#4a008f' }}>
                  MUUU App
                </div>
                <div style={{ fontSize:'13px', color:'#444', marginTop:'4px' }}>
                  Universidad del Magdalena · Cálculo Integral
                </div>
              </div>
              <div style={{ textAlign:'right', fontSize:'12px', color:'#555' }}>
                <div><strong>Generado el:</strong> {datos.fechaReporte}</div>
                <div><strong>Docente:</strong> {datos.docente.nombre}</div>
                <div style={{ color:'#6b7280' }}>{datos.docente.correo}</div>
              </div>
            </div>
            <div style={{ marginTop:'20px', textAlign:'center', fontFamily:'Poppins, sans-serif', fontWeight:700, fontSize:'18px', textTransform:'uppercase', letterSpacing:'0.5px' }}>
              Informe de Rendimiento Académico
            </div>
            <div style={{ textAlign:'center', fontSize:'12px', color:'#888', marginTop:'4px' }}>
              Reporte detallado de actividad estudiantil en flashcards de Cálculo Integral
            </div>
          </div>

          {/* Resumen */}
          <section style={{ marginBottom:'32px' }}>
            <h2 style={h2Style}>1. Resumen General</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', marginTop:'16px' }}>
              {([
                { label:'Flashcards publicadas', valor: datos.flashcardsPublicadas, icono:'📚' },
                { label:'Estudiantes suscritos',  valor: datos.totalSuscriptores,   icono:'👥' },
                { label:'Materiales subidos',     valor: datos.materiales,          icono:'📄' },
                { label:'Respuestas totales',     valor: datos.totalRespuestas,     icono:'📝' },
                { label:'Tasa de aciertos',       valor:`${datos.tasaAciertos}%`,   icono:'🎯' },
                { label:'Nivel docente',          valor:`Nv. ${Math.floor(datos.totalRespuestas / 50)}`, icono:'⭐' },
              ] as const).map((m, i) => (
                <div key={i} style={{ border:'1px solid #d1d5db', borderRadius:'8px', padding:'14px', textAlign:'center', background:'#fafafa' }}>
                  <div style={{ fontSize:'24px', marginBottom:'6px' }}>{m.icono}</div>
                  <div style={{ fontFamily:'Poppins, sans-serif', fontWeight:800, fontSize:'22px', color:'#4a008f' }}>{m.valor}</div>
                  <div style={{ fontSize:'11px', color:'#6b7280', marginTop:'4px' }}>{m.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Tabla estudiantes */}
          <section style={{ marginBottom:'32px' }}>
            <h2 style={h2Style}>2. Rendimiento por Estudiante</h2>
            <p style={{ fontSize:'12px', color:'#6b7280', margin:'8px 0 16px' }}>
              Detalle de cada estudiante suscrito con su actividad en flashcards.
            </p>
            {datos.estudiantes.length === 0 ? (
              <p style={{ fontStyle:'italic', color:'#9ca3af', fontSize:'13px' }}>No hay estudiantes suscritos.</p>
            ) : (
              <table style={tableStyle}>
                <thead>
                  <tr style={{ background:'#4a008f' }}>
                    {['#','Nombre','Correo','Respondidas','Correctas','Incorrectas','Aciertos','Puntos'].map(h => (
                      <th key={h} style={thStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {datos.estudiantes.map((est, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                      <td style={tdC}>{i + 1}</td>
                      <td style={{ ...tdS, fontWeight:600 }}>{est.nombre}</td>
                      <td style={{ ...tdS, fontSize:'11px', color:'#6b7280' }}>{est.correo}</td>
                      <td style={tdC}>{est.respondidas}</td>
                      <td style={{ ...tdC, color:'#15803d', fontWeight:700 }}>{est.correctas}</td>
                      <td style={{ ...tdC, color:'#b91c1c', fontWeight:700 }}>{est.incorrectas}</td>
                      <td style={{ ...tdC, fontWeight:700, color:colorTasa(est.tasa) }}>
                        {est.respondidas > 0 ? `${est.tasa}%` : '—'}
                      </td>
                      <td style={{ ...tdC, color:'#4a008f', fontWeight:700 }}>{est.puntos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          {/* Flashcards falladas */}
          <section style={{ marginBottom:'32px' }}>
            <h2 style={h2Style}>3. Flashcards con Menor Tasa de Aciertos</h2>
            <p style={{ fontSize:'12px', color:'#6b7280', margin:'8px 0 16px' }}>
              Preguntas donde los estudiantes presentan mayor dificultad.
            </p>
            {datos.masFalladas.length === 0 ? (
              <p style={{ fontStyle:'italic', color:'#9ca3af', fontSize:'13px' }}>Aún no hay datos de quizzes.</p>
            ) : (
              <table style={tableStyle}>
                <thead>
                  <tr style={{ background:'#4a008f' }}>
                    {['#','Flashcard (integral)','Tema','Veces respondida','Tasa de aciertos'].map(h => (
                      <th key={h} style={thStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {datos.masFalladas.map((fc, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                      <td style={tdC}>{i + 1}</td>
                      <td style={{ ...tdS, fontSize:'13px' }}
                          dangerouslySetInnerHTML={{ __html: toKatex(fc.integral) }} />
                      <td style={tdS}>{fc.tema}</td>
                      <td style={tdC}>{fc.veces}</td>
                      <td style={{ ...tdC, fontWeight:700, color:colorTasa(fc.tasa) }}>
                        {fc.tasa}%
                        <div style={{ height:'4px', background:'#e5e7eb', borderRadius:'2px', marginTop:'4px', overflow:'hidden' }}>
                          <div style={{ width:`${fc.tasa}%`, height:'100%', background:colorTasa(fc.tasa), borderRadius:'2px' }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          {/* Pie */}
          <div style={{ borderTop:'2px solid #1a1a1a', paddingTop:'16px', marginTop:'8px', display:'flex', justifyContent:'space-between', fontSize:'11px', color:'#9ca3af' }}>
            <span>MUUU App · Universidad del Magdalena · 2026</span>
            <span>Generado automáticamente · {datos.fechaReporte}</span>
          </div>

        </div>
      </div>
    </>
  );
}

// ── Estilos compartidos ──────────────────────────────────────────
const h2Style: React.CSSProperties = {
  fontFamily:'Poppins, sans-serif', fontWeight:700, fontSize:'14px', color:'#1a1a1a',
  borderBottom:'1px solid #d1d5db', paddingBottom:'6px', marginBottom:'0',
  textTransform:'uppercase', letterSpacing:'0.3px',
};
const tableStyle: React.CSSProperties = {
  width:'100%', borderCollapse:'collapse', fontSize:'12px', border:'1px solid #d1d5db',
};
const thStyle: React.CSSProperties = {
  padding:'9px 10px', textAlign:'left', color:'white',
  fontFamily:'Poppins, sans-serif', fontWeight:700, fontSize:'11px', letterSpacing:'0.3px',
};
const tdS: React.CSSProperties = {
  padding:'9px 10px', borderBottom:'1px solid #e5e7eb', fontFamily:'Georgia, serif',
};
const tdC: React.CSSProperties = {
  ...tdS, textAlign:'center', fontFamily:'Poppins, sans-serif',
};
