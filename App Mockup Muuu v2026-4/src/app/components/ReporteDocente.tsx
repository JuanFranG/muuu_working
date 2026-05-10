import { useState, useEffect } from 'react';
import { ArrowLeft, FileDown, Loader2, Users, BookOpen, FileText, BarChart3, Target } from 'lucide-react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import muuuLogo from 'figma:asset/4de3de61f8e4df99b460b6420b603ae06ba0b967.png';
import {
  obtenerReporteDocenteAPI,
  type ReporteDocenteData,
} from '../services/api';

interface ReporteDocenteProps {
  onBack: () => void;
}

/**
 * LaTeX/texto mixto → HTML (usa katex.min.css ya cargado en la página).
 *
 * Soporta:
 *  · Puro:  "\int_a^b f(x)\,dx"                 → KaTeX directo
 *  · $…$:   "$\int_a^b f(x)\,dx$"               → strip $ + KaTeX
 *  · Mixto: "Si $\int_a^b f(x)\,dx$ = 5 ..."    → partes $…$ con KaTeX,
 *            texto plano intacto ($ de cierre opcional)
 */
const toKatex = (raw: string): string => {
  if (!raw) return '';

  // Mixto: hay al menos un $
  if (raw.includes('$')) {
    return raw.replace(/\$([^$]+)\$?/g, (_m, inner) => {
      try { return katex.renderToString(inner.trim(), { throwOnError: false, displayMode: false, strict: false }); }
      catch { return inner; }
    });
  }

  // Puro LaTeX sin delimitadores
  const src = raw.trim();
  try { return katex.renderToString(src, { throwOnError: false, displayMode: false, strict: false }); }
  catch { return raw; }
};

const colorTasa = (t: number) =>
  t >= 70 ? '#15803d' : t >= 40 ? '#b45309' : '#dc2626';

export function ReporteDocente({ onBack }: ReporteDocenteProps) {
  const [datos,    setDatos]    = useState<ReporteDocenteData | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerReporteDocenteAPI()
      .then(setDatos)
      .finally(() => setCargando(false));
  }, []);

  /* ─────────────────────────────────────────────────────────────────────
     EXPORTAR PDF — inyecta un <div> en el body, imprime con window.print()
     Usa toKatex() (HTML) porque el CSS de KaTeX ya está cargado en la página.
     Sin position:fixed → flujo normal → varias páginas.
  ───────────────────────────────────────────────────────────────────────*/
  const exportarPDF = () => {
    if (!datos) return;

    // ── helpers ANTES de los template literals ──
    const clr = (t: number) => t >= 70 ? '#15803d' : t >= 40 ? '#b45309' : '#dc2626';

    // Tabla estudiantes: 7 columnas (Cor + Inc combinadas) con anchos fijos
    const TH = 'padding:6px 5px;color:#fff;font-size:9px;letter-spacing:.2px;font-family:Arial,sans-serif;font-weight:700;text-align:left';
    const TD = 'padding:5px 5px;border-bottom:1px solid #e5e7eb;vertical-align:middle;font-size:9px;overflow:hidden';

    const rowsEst = datos.estudiantes.length === 0
      ? `<tr><td colspan="7" style="text-align:center;padding:14px;color:#9ca3af;font-style:italic;font-size:10px">Sin estudiantes suscritos</td></tr>`
      : datos.estudiantes.map((e, i) =>
          `<tr style="background:${i % 2 === 0 ? '#fff' : '#f9fafb'}">
            <td style="${TD};text-align:center;width:4%">${i + 1}</td>
            <td style="${TD};font-weight:600;width:18%;word-break:break-word">${e.nombre}</td>
            <td style="${TD};color:#6b7280;width:28%;word-break:break-all">${e.correo}</td>
            <td style="${TD};text-align:center;width:9%">${e.respondidas}</td>
            <td style="${TD};text-align:center;width:14%;color:#15803d;font-weight:700">${e.correctas}&nbsp;/&nbsp;<span style="color:#dc2626">${e.incorrectas}</span></td>
            <td style="${TD};text-align:center;width:12%;font-weight:700;color:${clr(e.tasa)}">${e.respondidas > 0 ? `${e.tasa}%` : '—'}</td>
            <td style="${TD};text-align:center;width:9%;color:#4a008f;font-weight:700">${e.puntos}</td>
          </tr>`).join('');

    // Tabla flashcards falladas: toKatex() — CSS ya está en la página
    const rowsFall = datos.masFalladas.length === 0
      ? `<tr><td colspan="5" style="text-align:center;padding:14px;color:#9ca3af;font-style:italic;font-size:10px">Sin datos de quizzes</td></tr>`
      : datos.masFalladas.map((fc, i) =>
          `<tr style="background:${i % 2 === 0 ? '#fff' : '#f9fafb'}">
            <td style="${TD};text-align:center;width:4%">${i + 1}</td>
            <td style="${TD};width:42%;font-size:11px">${toKatex(fc.integral)}</td>
            <td style="${TD};width:28%">${fc.tema}</td>
            <td style="${TD};text-align:center;width:12%">${fc.veces}</td>
            <td style="${TD};text-align:center;width:14%;font-weight:700;color:${clr(fc.tasa)}">${fc.tasa}%</td>
          </tr>`).join('');

    const thRow = (cols: string[]) => cols.map(h => `<th style="${TH}">${h}</th>`).join('');
    const H2 = 'font-family:Arial,sans-serif;font-size:11px;font-weight:700;text-transform:uppercase;border-bottom:1px solid #d1d5db;padding-bottom:4px;margin:18px 0 8px;letter-spacing:.4px;color:#1a1a1a';

    const contenido = `
<div style="border-bottom:3px double #1a1a1a;padding-bottom:12px;margin-bottom:18px">
  <div style="display:flex;justify-content:space-between;align-items:center">
    <div style="display:flex;align-items:center;gap:10px">
      <img src="${muuuLogo}" style="height:44px;width:auto" alt="MUUU">
      <div>
        <div style="font-family:Arial,sans-serif;font-weight:900;font-size:20px;color:#4a008f;line-height:1">MUUU App</div>
        <div style="font-size:10px;color:#555;margin-top:3px">Universidad del Magdalena · Cálculo Integral</div>
      </div>
    </div>
    <div style="text-align:right;font-size:10px;color:#555;font-family:Arial,sans-serif;line-height:1.6">
      <div><strong>Generado:</strong> ${datos.fechaReporte}</div>
      <div><strong>Docente:</strong> ${datos.docente.nombre}</div>
      <div style="color:#6b7280">${datos.docente.correo}</div>
    </div>
  </div>
  <div style="margin-top:12px;text-align:center;font-family:Arial,sans-serif;font-weight:700;font-size:14px;text-transform:uppercase;letter-spacing:.5px">Informe de Rendimiento Académico</div>
  <div style="text-align:center;font-size:9px;color:#888;margin-top:2px">Reporte detallado de actividad estudiantil en flashcards de Cálculo Integral</div>
</div>

<h2 style="${H2}">1. Resumen General</h2>
<table style="width:100%;border-collapse:collapse;font-size:11px;border:1px solid #d1d5db;margin-bottom:4px">
  <thead><tr style="background:#4a008f">${thRow(['Flashcards publicadas','Estudiantes suscritos','Materiales','Respuestas totales','Tasa de aciertos'])}</tr></thead>
  <tbody>
    <tr style="text-align:center;font-family:Arial,sans-serif;font-weight:800;font-size:18px">
      <td style="padding:10px">${datos.flashcardsPublicadas}</td>
      <td style="padding:10px">${datos.totalSuscriptores}</td>
      <td style="padding:10px">${datos.materiales}</td>
      <td style="padding:10px">${datos.totalRespuestas}</td>
      <td style="padding:10px;color:${clr(datos.tasaAciertos)}">${datos.tasaAciertos}%</td>
    </tr>
  </tbody>
</table>

<h2 style="${H2}">2. Rendimiento por Estudiante</h2>
<table style="width:100%;border-collapse:collapse;table-layout:fixed;border:1px solid #d1d5db;margin-bottom:4px">
  <colgroup>
    <col style="width:4%"><col style="width:18%"><col style="width:28%">
    <col style="width:9%"><col style="width:14%"><col style="width:12%"><col style="width:9%">
  </colgroup>
  <thead><tr style="background:#4a008f">${thRow(['#','Nombre','Correo','Resp.','Cor. / Inc.','Aciertos','Puntos'])}</tr></thead>
  <tbody>${rowsEst}</tbody>
</table>

<h2 style="${H2}">3. Flashcards con Menor Tasa de Aciertos</h2>
<table style="width:100%;border-collapse:collapse;table-layout:fixed;border:1px solid #d1d5db;margin-bottom:4px">
  <colgroup>
    <col style="width:4%"><col style="width:42%"><col style="width:28%">
    <col style="width:12%"><col style="width:14%">
  </colgroup>
  <thead><tr style="background:#4a008f">${thRow(['#','Flashcard (integral)','Tema','Veces resp.','Tasa aciertos'])}</tr></thead>
  <tbody>${rowsFall}</tbody>
</table>

<div style="border-top:2px solid #1a1a1a;margin-top:22px;padding-top:8px;display:flex;justify-content:space-between;font-size:9px;color:#9ca3af;font-family:Arial,sans-serif">
  <span>MUUU App · Universidad del Magdalena · 2026</span>
  <span>Generado automáticamente · ${datos.fechaReporte}</span>
</div>`;

    const styleEl = document.createElement('style');
    styleEl.id = '__muuu_print_style__';
    styleEl.textContent = `
      @media print {
        body > *:not(#__muuu_report__) { display: none !important; }
        #__muuu_report__ {
          display: block !important;
          font-family: Georgia, serif;
          font-size: 11px;
          color: #1a1a1a;
          background: white;
          width: 100%;
          height: auto !important;
          overflow: visible !important;
        }
        table  { page-break-inside: auto; }
        tr     { page-break-inside: avoid; page-break-after: auto; }
        h2     { page-break-after: avoid; }
        .katex { font-size: 1em; }
        @page  { margin: 12mm 13mm; size: A4 portrait; }
      }
    `;

    const divEl = document.createElement('div');
    divEl.id = '__muuu_report__';
    divEl.style.display = 'none';
    divEl.innerHTML = contenido;

    document.head.appendChild(styleEl);
    document.body.appendChild(divEl);
    window.print();

    const limpiar = () => {
      document.getElementById('__muuu_print_style__')?.remove();
      document.getElementById('__muuu_report__')?.remove();
    };
    if ('onafterprint' in window) { window.onafterprint = limpiar; }
    else { setTimeout(limpiar, 4000); }
  };

  /* ── Estados de carga ── */
  if (cargando) return (
    <div style={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f3f0ff' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <Loader2 size={36} color="#7c3aed" style={{ animation:'spin 1s linear infinite' }} />
    </div>
  );

  if (!datos) return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:'Poppins, sans-serif' }}>
      <p style={{ color:'#6b7280' }}>No se pudo cargar el reporte.</p>
      <button onClick={onBack} style={{ marginTop:'12px', padding:'8px 20px', borderRadius:'20px', border:'none', background:'#7c3aed', color:'white', cursor:'pointer', fontFamily:'Poppins, sans-serif', fontWeight:700 }}>Volver</button>
    </div>
  );

  return (
    <>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* ── WRAPPER PRINCIPAL: height 100vh, flex-column ── */}
      <div style={{ height:'100vh', display:'flex', flexDirection:'column', background:'#f3f0ff', overflow:'hidden' }}>

        {/* ── HEADER fijo ── */}
        <div style={{
          flexShrink: 0,
          background:'linear-gradient(135deg, #4a008f 0%, #7c3aed 100%)',
          padding:'14px 20px',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          boxShadow:'0 2px 12px rgba(74,0,143,0.3)',
        }}>
          <button onClick={onBack} style={{
            background:'rgba(255,255,255,0.15)', border:'none', borderRadius:'50%',
            width:'36px', height:'36px', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <ArrowLeft size={20} color="white" />
          </button>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontFamily:'Poppins, sans-serif', fontWeight:700, fontSize:'16px', color:'white' }}>
              Reporte del Docente
            </div>
            <div style={{ fontFamily:'Poppins, sans-serif', fontSize:'11px', color:'rgba(255,255,255,0.7)' }}>
              {datos.docente.nombre}
            </div>
          </div>
          <button onClick={exportarPDF} style={{
            background:'white', border:'none', borderRadius:'20px',
            padding:'8px 16px', cursor:'pointer',
            display:'flex', alignItems:'center', gap:'6px',
            fontFamily:'Poppins, sans-serif', fontWeight:700, fontSize:'12px', color:'#4a008f',
            boxShadow:'0 2px 8px rgba(0,0,0,0.15)',
          }}>
            <FileDown size={14} color="#4a008f" />
            Exportar PDF
          </button>
        </div>

        {/* ── CONTENIDO SCROLLABLE ── */}
        <div style={{ flex:1, overflowY:'auto', padding:'16px' }}>

          {/* Tarjetas de resumen */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'10px', marginBottom:'14px' }}>
            {[
              { label:'Flashcards publicadas', valor: datos.flashcardsPublicadas, icon: <BookOpen size={18} color="#7c3aed"/>, bg:'#f3f0ff', clr:'#4a008f' },
              { label:'Estudiantes suscritos',  valor: datos.totalSuscriptores,   icon: <Users size={18} color="#0369a1"/>,   bg:'#e0f2fe', clr:'#0369a1' },
              { label:'Materiales subidos',     valor: datos.materiales,          icon: <FileText size={18} color="#0891b2"/>, bg:'#ecfeff', clr:'#0e7490' },
              { label:'Respuestas totales',     valor: datos.totalRespuestas,     icon: <BarChart3 size={18} color="#16a34a"/>,bg:'#f0fdf4', clr:'#15803d' },
            ].map((c, i) => (
              <div key={i} style={{ background:c.bg, borderRadius:'14px', padding:'14px', display:'flex', alignItems:'center', gap:'12px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
                <div style={{ width:'38px', height:'38px', borderRadius:'10px', background:'white', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {c.icon}
                </div>
                <div>
                  <div style={{ fontFamily:'Poppins, sans-serif', fontWeight:800, fontSize:'22px', color:c.clr, lineHeight:1 }}>{c.valor}</div>
                  <div style={{ fontFamily:'Poppins, sans-serif', fontSize:'10px', color:'#6b7280', marginTop:'3px' }}>{c.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Tasa de aciertos global */}
          <div style={{ background:'white', borderRadius:'14px', padding:'16px', marginBottom:'14px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)', display:'flex', alignItems:'center', gap:'16px' }}>
            <div style={{ position:'relative', flexShrink:0 }}>
              <svg width="72" height="72" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="28" fill="none" stroke="#ede9fe" strokeWidth="7"/>
                <circle cx="36" cy="36" r="28" fill="none"
                  stroke={colorTasa(datos.tasaAciertos)} strokeWidth="7" strokeLinecap="round"
                  strokeDasharray={`${2*Math.PI*28}`}
                  strokeDashoffset={`${2*Math.PI*28*(1-datos.tasaAciertos/100)}`}
                  transform="rotate(-90 36 36)" style={{ transition:'stroke-dashoffset .6s ease' }}/>
              </svg>
              <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Poppins, sans-serif', fontWeight:800, fontSize:'15px', color:'#1a1a1a' }}>
                {datos.tasaAciertos}%
              </div>
            </div>
            <div>
              <div style={{ fontFamily:'Poppins, sans-serif', fontWeight:700, fontSize:'15px', color:'#1a1a1a', marginBottom:'4px' }}>Tasa de aciertos global</div>
              <div style={{ fontFamily:'Poppins, sans-serif', fontSize:'11px', color:'#6b7280', lineHeight:'1.4' }}>
                Porcentaje de respuestas correctas de los estudiantes en tus flashcards
              </div>
            </div>
            <div style={{ marginLeft:'auto', textAlign:'center' }}>
              <Target size={20} color={colorTasa(datos.tasaAciertos)} />
            </div>
          </div>

          {/* Tabla estudiantes */}
          <div style={{ background:'white', borderRadius:'14px', padding:'16px', marginBottom:'14px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontFamily:'Poppins, sans-serif', fontWeight:700, fontSize:'12px', color:'#1a1a1a', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'12px' }}>
              Rendimiento por Estudiante
            </h3>
            {datos.estudiantes.length === 0 ? (
              <p style={{ color:'#9ca3af', fontStyle:'italic', fontSize:'13px', fontFamily:'Poppins, sans-serif' }}>Sin estudiantes suscritos.</p>
            ) : (
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'11px', minWidth:'540px' }}>
                  <thead>
                    <tr style={{ background:'#4a008f' }}>
                      {['#','Nombre','Correo','Resp.','Cor./Inc.','Aciertos','Puntos'].map(h => (
                        <th key={h} style={{ padding:'8px 8px', textAlign:'left', color:'white', fontFamily:'Poppins, sans-serif', fontWeight:700, fontSize:'10px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {datos.estudiantes.map((est, i) => (
                      <tr key={i} style={{ background: i%2===0?'#fff':'#faf9ff' }}>
                        <td style={tdSt}>{i+1}</td>
                        <td style={{ ...tdSt, fontWeight:600 }}>{est.nombre}</td>
                        <td style={{ ...tdSt, fontSize:'10px', color:'#6b7280' }}>{est.correo}</td>
                        <td style={{ ...tdSt, textAlign:'center' }}>{est.respondidas}</td>
                        <td style={{ ...tdSt, textAlign:'center' }}>
                          <span style={{ color:'#15803d', fontWeight:700 }}>{est.correctas}</span>
                          <span style={{ color:'#9ca3af' }}> / </span>
                          <span style={{ color:'#dc2626', fontWeight:700 }}>{est.incorrectas}</span>
                        </td>
                        <td style={{ ...tdSt, textAlign:'center', fontWeight:700, color:colorTasa(est.tasa) }}>
                          {est.respondidas > 0 ? `${est.tasa}%` : '—'}
                        </td>
                        <td style={{ ...tdSt, textAlign:'center', color:'#4a008f', fontWeight:700 }}>{est.puntos}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Flashcards falladas */}
          <div style={{ background:'white', borderRadius:'14px', padding:'16px', marginBottom:'14px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontFamily:'Poppins, sans-serif', fontWeight:700, fontSize:'12px', color:'#1a1a1a', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'12px' }}>
              Flashcards con Menor Tasa de Aciertos
            </h3>
            {datos.masFalladas.length === 0 ? (
              <p style={{ color:'#9ca3af', fontStyle:'italic', fontSize:'13px', fontFamily:'Poppins, sans-serif' }}>Sin datos de quizzes.</p>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                {datos.masFalladas.map((fc, i) => (
                  <div key={i} style={{ border:`1px solid ${i===0?'#c4b5fd':'#e5e7eb'}`, borderRadius:'10px', padding:'12px', background: i===0?'#faf9ff':'#fafafa' }}>
                    <div style={{ display:'flex', alignItems:'flex-start', gap:'10px', marginBottom:'8px' }}>
                      <div style={{ width:'26px', height:'26px', borderRadius:'50%', flexShrink:0, background: i===0?'linear-gradient(135deg,#7c3aed,#4a008f)':'#e5e7eb', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:'11px', color: i===0?'white':'#6b7280' }}>
                        {i+1}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:'13px', marginBottom:'2px' }}
                             dangerouslySetInnerHTML={{ __html: toKatex(fc.integral) }}/>
                        <div style={{ fontFamily:'Poppins, sans-serif', fontSize:'10px', color:'#6b7280' }}>
                          {fc.tema} · {fc.veces} {fc.veces===1?'vez':'veces'}
                        </div>
                      </div>
                      <div style={{ fontFamily:'Poppins, sans-serif', fontWeight:800, fontSize:'16px', color:colorTasa(fc.tasa), flexShrink:0 }}>
                        {fc.tasa}%
                      </div>
                    </div>
                    <div style={{ height:'5px', background:'#e5e7eb', borderRadius:'3px', overflow:'hidden' }}>
                      <div style={{ width:`${fc.tasa}%`, height:'100%', background:colorTasa(fc.tasa), borderRadius:'3px', transition:'width .5s ease' }}/>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pie de la preview */}
          <div style={{ textAlign:'center', fontFamily:'Poppins, sans-serif', fontSize:'10px', color:'#9ca3af', paddingBottom:'8px' }}>
            Generado el {datos.fechaReporte} · MUUU App · Universidad del Magdalena
          </div>

        </div>{/* fin scroll */}
      </div>{/* fin wrapper */}
    </>
  );
}

// ── estilos inline reutilizables para la preview ──
const tdSt: React.CSSProperties = {
  padding: '8px 8px',
  borderBottom: '1px solid #f0f0f0',
  fontFamily: 'Poppins, sans-serif',
  verticalAlign: 'middle',
};
