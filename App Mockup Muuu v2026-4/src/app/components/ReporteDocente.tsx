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

/* Convierte LaTeX (con o sin $…$) a HTML renderizado por KaTeX */
const toKatex = (raw: string): string => {
  const src = raw.replace(/^\$+|\$+$/g, '').trim();
  try { return katex.renderToString(src, { throwOnError: false, displayMode: false }); }
  catch { return raw; }
};

export function ReporteDocente({ onBack }: ReporteDocenteProps) {
  const [datos,       setDatos]       = useState<ReporteDocenteData | null>(null);
  const [cargando,    setCargando]    = useState(true);
  const [generando,   setGenerando]   = useState(false);

  useEffect(() => {
    obtenerReporteDocenteAPI()
      .then(setDatos)
      .finally(() => setCargando(false));
  }, []);

  /* ─── Genera un HTML completo y lo abre en nueva pestaña para imprimir como PDF ─── */
  const exportarPDF = () => {
    if (!datos) return;
    setGenerando(true);

    // ── Helpers declarados ANTES de cualquier template literal que los use ──
    const clrStr = (t: number) => t >= 70 ? '#15803d' : t >= 40 ? '#b45309' : '#b91c1c';
    const td = 'padding:8px 10px;border-bottom:1px solid #e5e7eb;vertical-align:middle';
    const th = 'padding:9px 10px;text-align:left;color:white;font-size:11px;letter-spacing:.3px;font-family:Arial,sans-serif';

    // ── Filas de la tabla de estudiantes ──
    const rowsEst = datos.estudiantes.length === 0
      ? `<tr><td colspan="8" style="text-align:center;padding:20px;color:#9ca3af;font-style:italic">
           Sin estudiantes suscritos
         </td></tr>`
      : datos.estudiantes.map((e, i) =>
          `<tr style="background:${i % 2 === 0 ? '#fff' : '#f9fafb'}">
            <td style="${td};text-align:center;font-family:Arial,sans-serif">${i + 1}</td>
            <td style="${td};font-weight:600">${e.nombre}</td>
            <td style="${td};font-size:11px;color:#6b7280">${e.correo}</td>
            <td style="${td};text-align:center;font-family:Arial,sans-serif">${e.respondidas}</td>
            <td style="${td};text-align:center;color:#15803d;font-weight:700;font-family:Arial,sans-serif">${e.correctas}</td>
            <td style="${td};text-align:center;color:#b91c1c;font-weight:700;font-family:Arial,sans-serif">${e.incorrectas}</td>
            <td style="${td};text-align:center;font-weight:700;color:${clrStr(e.tasa)};font-family:Arial,sans-serif">
              ${e.respondidas > 0 ? `${e.tasa}%` : '—'}
            </td>
            <td style="${td};text-align:center;color:#4a008f;font-weight:700;font-family:Arial,sans-serif">${e.puntos}</td>
          </tr>`
        ).join('');

    // ── Filas de flashcards más falladas (con KaTeX renderizado) ──
    const rowsFall = datos.masFalladas.length === 0
      ? `<tr><td colspan="5" style="text-align:center;padding:20px;color:#9ca3af;font-style:italic">
           Sin datos de quizzes
         </td></tr>`
      : datos.masFalladas.map((fc, i) =>
          `<tr style="background:${i % 2 === 0 ? '#fff' : '#f9fafb'}">
            <td style="${td};text-align:center;font-family:Arial,sans-serif">${i + 1}</td>
            <td style="${td}">${toKatex(fc.integral)}</td>
            <td style="${td};font-family:Arial,sans-serif">${fc.tema}</td>
            <td style="${td};text-align:center;font-family:Arial,sans-serif">${fc.veces}</td>
            <td style="${td};text-align:center;font-weight:700;color:${clrStr(fc.tasa)};font-family:Arial,sans-serif">${fc.tasa}%</td>
          </tr>`
        ).join('');

    // ── Documento HTML completo ──
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Reporte MUUU — ${datos.docente.nombre}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      padding: 20mm 18mm;
      font-family: Georgia, "Times New Roman", serif;
      color: #1a1a1a;
      background: white;
      font-size: 13px;
    }
    h2 {
      font-family: Arial, sans-serif;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      border-bottom: 1px solid #d1d5db;
      padding-bottom: 5px;
      margin: 26px 0 14px;
      letter-spacing: .3px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      border: 1px solid #d1d5db;
      margin-bottom: 8px;
    }
    .katex { font-size: 1em; }
    @media print {
      body { padding: 12mm 14mm; }
      @page { margin: 6mm; size: A4; }
    }
  </style>
</head>
<body>

<!-- ENCABEZADO -->
<div style="border-bottom:3px double #1a1a1a;padding-bottom:18px;margin-bottom:24px">
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
  <div style="margin-top:18px;text-align:center;font-family:Arial,sans-serif;font-weight:700;
              font-size:17px;text-transform:uppercase;letter-spacing:.5px">
    Informe de Rendimiento Académico
  </div>
  <div style="text-align:center;font-size:11px;color:#888;margin-top:3px">
    Reporte detallado de actividad estudiantil en flashcards de Cálculo Integral
  </div>
</div>

<!-- 1. RESUMEN GENERAL -->
<h2>1. Resumen General</h2>
<table>
  <thead>
    <tr style="background:#4a008f">
      <th style="${th}">Flashcards publicadas</th>
      <th style="${th}">Estudiantes suscritos</th>
      <th style="${th}">Materiales</th>
      <th style="${th}">Respuestas totales</th>
      <th style="${th}">Tasa de aciertos</th>
    </tr>
  </thead>
  <tbody>
    <tr style="text-align:center;font-family:Arial,sans-serif;font-weight:700;font-size:20px">
      <td style="padding:14px">${datos.flashcardsPublicadas}</td>
      <td style="padding:14px">${datos.totalSuscriptores}</td>
      <td style="padding:14px">${datos.materiales}</td>
      <td style="padding:14px">${datos.totalRespuestas}</td>
      <td style="padding:14px;color:${clrStr(datos.tasaAciertos)}">${datos.tasaAciertos}%</td>
    </tr>
  </tbody>
</table>

<!-- 2. RENDIMIENTO POR ESTUDIANTE -->
<h2>2. Rendimiento por Estudiante</h2>
<table>
  <thead>
    <tr style="background:#4a008f">
      ${['#','Nombre','Correo','Respondidas','Correctas','Incorrectas','Aciertos','Puntos']
        .map(h => `<th style="${th}">${h}</th>`).join('')}
    </tr>
  </thead>
  <tbody>${rowsEst}</tbody>
</table>

<!-- 3. FLASHCARDS CON MENOR TASA DE ACIERTOS -->
<h2>3. Flashcards con Menor Tasa de Aciertos</h2>
<table>
  <thead>
    <tr style="background:#4a008f">
      ${['#','Flashcard (integral)','Tema','Veces respondida','Tasa de aciertos']
        .map(h => `<th style="${th}">${h}</th>`).join('')}
    </tr>
  </thead>
  <tbody>${rowsFall}</tbody>
</table>

<!-- PIE DE PÁGINA -->
<div style="border-top:2px solid #1a1a1a;margin-top:32px;padding-top:12px;
            display:flex;justify-content:space-between;font-size:10px;
            color:#9ca3af;font-family:Arial,sans-serif">
  <span>MUUU App · Universidad del Magdalena · 2026</span>
  <span>Generado automáticamente · ${datos.fechaReporte}</span>
</div>

</body>
</html>`;

    // ── Abre el reporte en nueva pestaña y dispara el diálogo de impresión ──
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const win  = window.open(url, '_blank');

    if (!win) {
      // Si el popup fue bloqueado, descarga el HTML directamente
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-${datos.docente.nombre.replace(/\s+/g, '_')}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // Esperar a que KaTeX CSS cargue antes de imprimir
      win.onload = () => {
        setTimeout(() => {
          win.print();
          URL.revokeObjectURL(url);
        }, 800);
      };
    }

    setGenerando(false);
  };

  // ── Función de color para la preview ──
  const colorTasa = (t: number) =>
    t >= 70 ? '#15803d' : t >= 40 ? '#b45309' : '#b91c1c';

  // ── Estados de carga ──
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
        <button
          onClick={onBack}
          style={{
            background:'rgba(255,255,255,0.2)', border:'none', borderRadius:'50%',
            width:'36px', height:'36px', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}
        >
          <ArrowLeft size={20} color="white" />
        </button>

        <span style={{ fontFamily:'Poppins, sans-serif', fontWeight:700, fontSize:'16px', color:'white' }}>
          Vista previa del reporte
        </span>

        <button
          onClick={exportarPDF}
          disabled={generando}
          style={{
            background: generando ? 'rgba(255,255,255,0.5)' : 'white',
            border:'none', borderRadius:'20px',
            padding:'8px 16px', cursor: generando ? 'default' : 'pointer',
            display:'flex', alignItems:'center', gap:'6px',
            fontFamily:'Poppins, sans-serif', fontWeight:700, fontSize:'13px', color:'#4a008f',
          }}
        >
          {generando
            ? <Loader2 size={15} color="#4a008f" style={{ animation:'spin 1s linear infinite' }} />
            : <FileDown size={15} color="#4a008f" />
          }
          {generando ? 'Abriendo…' : 'Exportar PDF'}
        </button>
      </div>

      {/* ── CONTENIDO VISUAL DEL REPORTE ── */}
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
              {[
                { label:'Flashcards publicadas', valor: datos.flashcardsPublicadas, icono:'📚' },
                { label:'Estudiantes suscritos',  valor: datos.totalSuscriptores,   icono:'👥' },
                { label:'Materiales subidos',     valor: datos.materiales,          icono:'📄' },
                { label:'Respuestas totales',     valor: datos.totalRespuestas,     icono:'📝' },
                { label:'Tasa de aciertos',       valor:`${datos.tasaAciertos}%`,   icono:'🎯' },
                { label:'Nivel docente',          valor:`Nv. ${Math.floor(datos.totalRespuestas / 50)}`, icono:'⭐' },
              ].map((m, i) => (
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
  fontFamily:'Poppins, sans-serif', fontWeight:700, fontSize:'14px',
  color:'#1a1a1a', borderBottom:'1px solid #d1d5db',
  paddingBottom:'6px', marginBottom:'0', textTransform:'uppercase', letterSpacing:'0.3px',
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
