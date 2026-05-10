import { useState, useEffect } from 'react';
import { ArrowLeft, Printer, Loader2 } from 'lucide-react';
import {
  obtenerReporteDocenteAPI,
  type ReporteDocenteData,
} from '../services/api';

interface ReporteDocenteProps {
  onBack: () => void;
}

export function ReporteDocente({ onBack }: ReporteDocenteProps) {
  const [datos,    setDatos]    = useState<ReporteDocenteData | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerReporteDocenteAPI()
      .then(setDatos)
      .finally(() => setCargando(false));
  }, []);

  const handlePrint = () => {
    if (!datos) return;
    const colorTasaStr = (t: number) =>
      t >= 70 ? '#15803d' : t >= 40 ? '#b45309' : '#b91c1c';
    const tdP = 'padding:8px 10px;border-bottom:1px solid #e5e7eb';
    const thP = 'padding:9px 10px;text-align:left;color:white;font-size:11px;letter-spacing:.3px';

    const filasEstudiantes = datos.estudiantes.length === 0
      ? `<tr><td colspan="8" style="text-align:center;padding:20px;color:#9ca3af;font-style:italic;">
           Sin estudiantes suscritos
         </td></tr>`
      : datos.estudiantes.map((est, i) => `
          <tr style="background:${i % 2 === 0 ? '#fff' : '#f9fafb'}">
            <td style="${tdP};text-align:center">${i + 1}</td>
            <td style="${tdP};font-weight:600">${est.nombre}</td>
            <td style="${tdP};font-size:11px;color:#6b7280">${est.correo}</td>
            <td style="${tdP};text-align:center">${est.respondidas}</td>
            <td style="${tdP};text-align:center;color:#15803d;font-weight:700">${est.correctas}</td>
            <td style="${tdP};text-align:center;color:#b91c1c;font-weight:700">${est.incorrectas}</td>
            <td style="${tdP};text-align:center;font-weight:700;color:${colorTasaStr(est.tasa)}">
              ${est.respondidas > 0 ? `${est.tasa}%` : '—'}
            </td>
            <td style="${tdP};text-align:center;color:#4a008f;font-weight:700">${est.puntos}</td>
          </tr>`).join('');

    const filasFalladas = datos.masFalladas.length === 0
      ? `<tr><td colspan="5" style="text-align:center;padding:20px;color:#9ca3af;font-style:italic;">
           Sin datos de quizzes
         </td></tr>`
      : datos.masFalladas.map((fc, i) => `
          <tr style="background:${i % 2 === 0 ? '#fff' : '#f9fafb'}">
            <td style="${tdP};text-align:center">${i + 1}</td>
            <td style="${tdP};font-family:Georgia,serif;font-size:12px">
              ${fc.integral.replace(/\$/g, '').slice(0, 70)}${fc.integral.length > 70 ? '…' : ''}
            </td>
            <td style="${tdP}">${fc.tema}</td>
            <td style="${tdP};text-align:center">${fc.veces}</td>
            <td style="${tdP};text-align:center;font-weight:700;color:${colorTasaStr(fc.tasa)}">${fc.tasa}%</td>
          </tr>`).join('');


    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Reporte MUUU — ${datos.docente.nombre}</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 24mm 20mm; font-family: Georgia,"Times New Roman",serif;
           color: #1a1a1a; background: white; font-size: 13px; }
    h2 { font-family: Poppins,sans-serif; font-size: 13px; font-weight: 700;
         text-transform: uppercase; border-bottom: 1px solid #d1d5db;
         padding-bottom: 5px; margin: 28px 0 14px; letter-spacing: .3px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px;
            border: 1px solid #d1d5db; margin-bottom: 8px; }
    @media print {
      body { padding: 15mm 15mm; }
      @page { margin: 10mm; size: A4; }
    }
  </style>
</head>
<body>
  <!-- ENCABEZADO -->
  <div style="border-bottom:3px double #1a1a1a;padding-bottom:18px;margin-bottom:24px">
    <div style="display:flex;justify-content:space-between;align-items:flex-start">
      <div>
        <div style="font-family:Poppins,sans-serif;font-weight:900;font-size:22px;color:#4a008f">MUUU App</div>
        <div style="font-size:12px;color:#444;margin-top:3px">Universidad del Magdalena · Cálculo Integral</div>
      </div>
      <div style="text-align:right;font-size:11px;color:#555;font-family:Poppins,sans-serif">
        <div><strong>Generado:</strong> ${datos.fechaReporte}</div>
        <div><strong>Docente:</strong> ${datos.docente.nombre}</div>
        <div style="color:#6b7280">${datos.docente.correo}</div>
      </div>
    </div>
    <div style="margin-top:18px;text-align:center;font-family:Poppins,sans-serif;font-weight:700;
                font-size:17px;text-transform:uppercase;letter-spacing:.5px">
      Informe de Rendimiento Académico
    </div>
    <div style="text-align:center;font-size:11px;color:#888;margin-top:3px">
      Reporte detallado de actividad estudiantil en flashcards de Cálculo Integral
    </div>
  </div>

  <!-- SECCIÓN 1 -->
  <h2>1. Resumen General</h2>
  <table>
    <tr style="background:#4a008f">
      <th style="${thP}">Flashcards publicadas</th>
      <th style="${thP}">Estudiantes suscritos</th>
      <th style="${thP}">Materiales</th>
      <th style="${thP}">Respuestas totales</th>
      <th style="${thP}">Tasa de aciertos</th>
    </tr>
    <tr style="text-align:center;font-family:Poppins,sans-serif;font-weight:700;font-size:18px">
      <td style="padding:12px">${datos.flashcardsPublicadas}</td>
      <td style="padding:12px">${datos.totalSuscriptores}</td>
      <td style="padding:12px">${datos.materiales}</td>
      <td style="padding:12px">${datos.totalRespuestas}</td>
      <td style="padding:12px;color:${colorTasaStr(datos.tasaAciertos)}">${datos.tasaAciertos}%</td>
    </tr>
  </table>

  <!-- SECCIÓN 2 -->
  <h2>2. Rendimiento por Estudiante</h2>
  <table>
    <thead>
      <tr style="background:#4a008f">
        ${['#','Nombre','Correo','Respondidas','Correctas','Incorrectas','Aciertos','Puntos']
          .map(h => `<th style="${thP}">${h}</th>`).join('')}
      </tr>
    </thead>
    <tbody>${filasEstudiantes}</tbody>
  </table>

  <!-- SECCIÓN 3 -->
  <h2>3. Flashcards con Menor Tasa de Aciertos</h2>
  <table>
    <thead>
      <tr style="background:#4a008f">
        ${['#','Flashcard (integral)','Tema','Veces respondida','Tasa de aciertos']
          .map(h => `<th style="${thP}">${h}</th>`).join('')}
      </tr>
    </thead>
    <tbody>${filasFalladas}</tbody>
  </table>

  <!-- PIE -->
  <div style="border-top:2px solid #1a1a1a;margin-top:32px;padding-top:12px;
              display:flex;justify-content:space-between;font-size:10px;color:#9ca3af;
              font-family:Poppins,sans-serif">
    <span>MUUU App · Universidad del Magdalena · 2026</span>
    <span>Generado automáticamente · ${datos.fechaReporte}</span>
  </div>
</body>
</html>`;

    const ventana = window.open('', '_blank', 'width=900,height=700');
    if (!ventana) return;
    ventana.document.write(html);
    ventana.document.close();
    ventana.focus();
    setTimeout(() => ventana.print(), 500);
  };

  const colorTasa = (t: number) =>
    t >= 70 ? '#15803d' : t >= 40 ? '#b45309' : '#b91c1c';

  if (cargando) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} color="#7c3aed" />
      </div>
    );
  }

  if (!datos) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Poppins, sans-serif' }}>
        <p>No se pudo cargar el reporte.</p>
        <button onClick={onBack} style={{ marginTop: '16px', cursor: 'pointer' }}>Volver</button>
      </div>
    );
  }

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* ── BARRA SUPERIOR (no imprime) ── */}
      <div
        className="no-print"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px',
          background: 'linear-gradient(135deg, #4a008f, #7c3aed)',
          position: 'sticky', top: 0, zIndex: 10,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
            width: '36px', height: '36px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <ArrowLeft size={20} color="white" />
        </button>
        <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '16px', color: 'white' }}>
          Vista previa del reporte
        </span>
        <button
          onClick={handlePrint}
          style={{
            background: 'white', border: 'none', borderRadius: '20px',
            padding: '8px 18px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
            fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '13px', color: '#4a008f',
          }}
        >
          <Printer size={16} color="#4a008f" />
          Exportar PDF
        </button>
      </div>

      {/* ── CONTENIDO DEL REPORTE ── */}
      <div
        className="reporte-root"
        style={{ background: '#f8f8f8', minHeight: '100%', overflowY: 'auto' }}
      >
        <div
          className="reporte-page"
          style={{
            maxWidth: '820px', margin: '0 auto', background: 'white',
            padding: '40px 48px', fontFamily: 'Georgia, "Times New Roman", serif',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          }}
        >

          {/* ── ENCABEZADO TIPO LaTeX ── */}
          <div style={{ borderBottom: '3px double #1a1a1a', paddingBottom: '20px', marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: '22px', color: '#4a008f', letterSpacing: '-0.5px' }}>
                  MUUU App
                </div>
                <div style={{ fontSize: '13px', color: '#444', marginTop: '4px' }}>
                  Universidad del Magdalena · Cálculo Integral
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '12px', color: '#555' }}>
                <div><strong>Generado el:</strong> {datos.fechaReporte}</div>
                <div><strong>Docente:</strong> {datos.docente.nombre}</div>
                <div style={{ color: '#6b7280' }}>{datos.docente.correo}</div>
              </div>
            </div>
            <div style={{
              marginTop: '20px', textAlign: 'center',
              fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '18px', color: '#1a1a1a',
              letterSpacing: '0.5px', textTransform: 'uppercase',
            }}>
              Informe de Rendimiento Académico
            </div>
            <div style={{ textAlign: 'center', fontSize: '12px', color: '#888', marginTop: '4px' }}>
              Reporte detallado de actividad estudiantil en flashcards de Cálculo Integral
            </div>
          </div>

          {/* ── RESUMEN EJECUTIVO ── */}
          <section style={{ marginBottom: '32px' }}>
            <h2 style={h2Style}>1. Resumen General</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '16px' }}>
              {[
                { label: 'Flashcards publicadas', valor: datos.flashcardsPublicadas, icono: '📚' },
                { label: 'Estudiantes suscritos', valor: datos.totalSuscriptores,    icono: '👥' },
                { label: 'Materiales subidos',    valor: datos.materiales,           icono: '📄' },
                { label: 'Respuestas totales',    valor: datos.totalRespuestas,      icono: '📝' },
                { label: 'Tasa de aciertos',      valor: `${datos.tasaAciertos}%`,   icono: '🎯' },
                { label: 'Nivel docente',         valor: `Nv. ${Math.floor(datos.totalRespuestas / 50)}`, icono: '⭐' },
              ].map((m, i) => (
                <div key={i} style={{
                  border: '1px solid #d1d5db', borderRadius: '8px', padding: '14px',
                  textAlign: 'center', background: '#fafafa',
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>{m.icono}</div>
                  <div style={{
                    fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '22px', color: '#4a008f',
                  }}>
                    {m.valor}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>{m.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── TABLA DE ESTUDIANTES ── */}
          <section style={{ marginBottom: '32px' }}>
            <h2 style={h2Style}>2. Rendimiento por Estudiante</h2>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '8px 0 16px' }}>
              Detalle de cada estudiante suscrito al docente con su actividad en flashcards.
            </p>

            {datos.estudiantes.length === 0 ? (
              <p style={{ fontStyle: 'italic', color: '#9ca3af', fontSize: '13px' }}>
                No hay estudiantes suscritos actualmente.
              </p>
            ) : (
              <table style={tableStyle}>
                <thead>
                  <tr style={{ background: '#4a008f' }}>
                    {['#', 'Nombre', 'Correo', 'Respondidas', 'Correctas', 'Incorrectas', 'Aciertos', 'Puntos'].map(h => (
                      <th key={h} style={thStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {datos.estudiantes.map((est, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                      <td style={tdCenterStyle}>{i + 1}</td>
                      <td style={{ ...tdStyle, fontWeight: 600 }}>{est.nombre}</td>
                      <td style={{ ...tdStyle, fontSize: '11px', color: '#6b7280' }}>{est.correo}</td>
                      <td style={tdCenterStyle}>{est.respondidas}</td>
                      <td style={{ ...tdCenterStyle, color: '#15803d', fontWeight: 700 }}>{est.correctas}</td>
                      <td style={{ ...tdCenterStyle, color: '#b91c1c', fontWeight: 700 }}>{est.incorrectas}</td>
                      <td style={{ ...tdCenterStyle, fontWeight: 700, color: colorTasa(est.tasa) }}>
                        {est.respondidas > 0 ? `${est.tasa}%` : '—'}
                      </td>
                      <td style={{ ...tdCenterStyle, color: '#4a008f', fontWeight: 700 }}>{est.puntos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          {/* ── FLASHCARDS MÁS FALLADAS ── */}
          <section style={{ marginBottom: '32px' }}>
            <h2 style={h2Style}>3. Flashcards con Menor Tasa de Aciertos</h2>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '8px 0 16px' }}>
              Preguntas donde los estudiantes presentan mayor dificultad (ordenadas por tasa de aciertos ascendente).
            </p>

            {datos.masFalladas.length === 0 ? (
              <p style={{ fontStyle: 'italic', color: '#9ca3af', fontSize: '13px' }}>
                Aún no hay datos de quizzes.
              </p>
            ) : (
              <table style={tableStyle}>
                <thead>
                  <tr style={{ background: '#4a008f' }}>
                    {['#', 'Flashcard (integral)', 'Tema', 'Veces respondida', 'Tasa de aciertos'].map(h => (
                      <th key={h} style={thStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {datos.masFalladas.map((fc, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                      <td style={tdCenterStyle}>{i + 1}</td>
                      <td style={{ ...tdStyle, fontFamily: 'Georgia, serif', fontSize: '12px' }}>
                        {fc.integral.replace(/\$/g, '').slice(0, 60)}{fc.integral.length > 60 ? '…' : ''}
                      </td>
                      <td style={tdStyle}>{fc.tema}</td>
                      <td style={tdCenterStyle}>{fc.veces}</td>
                      <td style={{ ...tdCenterStyle, fontWeight: 700, color: colorTasa(fc.tasa) }}>
                        {fc.tasa}%
                        <div style={{
                          height: '4px', background: '#e5e7eb', borderRadius: '2px',
                          marginTop: '4px', overflow: 'hidden',
                        }}>
                          <div style={{
                            width: `${fc.tasa}%`, height: '100%',
                            background: colorTasa(fc.tasa), borderRadius: '2px',
                          }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          {/* ── PIE DE PÁGINA ── */}
          <div style={{
            borderTop: '2px solid #1a1a1a', paddingTop: '16px', marginTop: '8px',
            display: 'flex', justifyContent: 'space-between',
            fontSize: '11px', color: '#9ca3af',
          }}>
            <span>MUUU App · Universidad del Magdalena · 2026</span>
            <span>Generado automáticamente · {datos.fechaReporte}</span>
          </div>

        </div>
      </div>
    </>
  );
}

// ── Estilos compartidos ───────────────────────────────────────────
const h2Style: React.CSSProperties = {
  fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '14px',
  color: '#1a1a1a', borderBottom: '1px solid #d1d5db',
  paddingBottom: '6px', marginBottom: '0', letterSpacing: '0.3px',
  textTransform: 'uppercase',
};
const tableStyle: React.CSSProperties = {
  width: '100%', borderCollapse: 'collapse', fontSize: '12px',
  border: '1px solid #d1d5db',
};
const thStyle: React.CSSProperties = {
  padding: '9px 10px', textAlign: 'left', color: 'white',
  fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '11px',
  letterSpacing: '0.3px',
};
const tdStyle: React.CSSProperties = {
  padding: '9px 10px', borderBottom: '1px solid #e5e7eb',
  fontFamily: 'Georgia, serif',
};
const tdCenterStyle: React.CSSProperties = {
  ...tdStyle, textAlign: 'center',
  fontFamily: 'Poppins, sans-serif',
};
