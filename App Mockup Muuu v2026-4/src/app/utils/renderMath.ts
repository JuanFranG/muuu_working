/**
 * renderMath — convierte texto con LaTeX a HTML usando KaTeX.
 *
 * Soporta tres formas de entrada:
 *
 * 1. MIXTA con delimitadores $…$:
 *      "Si $\int_a^b f(x)\,dx$ = 5, entonces $\int_a^b 2f(x)\,dx$ = 10"
 *    → solo las zonas entre $…$ se renderizan con KaTeX; el texto
 *      exterior queda intacto.  Funciona incluso si el $ de cierre
 *      está ausente (p.ej. el flashcard se guardó sin él).
 *
 * 2. PURA (sin delimitadores $):
 *      "\int_a^b f(x)\,dx"
 *    → el string completo se pasa a KaTeX.
 *
 * 3. TEXTO PLANO (sin $ ni secuencias LaTeX):
 *      "¿Cuál es la derivada de x²?"
 *    → se devuelve tal cual (solo se convierten saltos de línea).
 */

import katex from 'katex';
import 'katex/dist/katex.min.css';

/** Renderiza un string LaTeX con KaTeX; devuelve el original si falla. */
function renderKatex(latex: string): string {
  try {
    return katex.renderToString(latex.trim(), {
      throwOnError: false,
      displayMode:  false,
      strict:       false,
    });
  } catch {
    return latex;
  }
}

// Regex de comandos LaTeX (igual que en ReporteDocente: captura \, \; \! sueltos también)
const LATEX_CMD_MATH =
  /\\[a-zA-Z]+(?:\*)?(?:\[[^\]]*\])?(?:\{[^}]*\})*(?:[_^]\{[^}]*\}|[_^][a-zA-Z0-9])*(?:\\,|\\;|\\!|\\quad)?|\\[,;!]/g;

/**
 * Renderiza un fragmento que puede ser LaTeX puro o mezcla texto/LaTeX.
 * Si contiene chars no-ASCII (acentos, ñ, ¿, ¡…) usa modo mixto:
 * solo los comandos \… se pasan a KaTeX; el texto plano queda intacto.
 */
function renderFragment(inner: string): string {
  if (/[^\x00-\x7F]/.test(inner)) {
    // Modo mixto
    let result = '';
    let lastIdx = 0;
    LATEX_CMD_MATH.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = LATEX_CMD_MATH.exec(inner)) !== null) {
      result += inner.slice(lastIdx, m.index);
      result += renderKatex(m[0]);
      lastIdx = m.index + m[0].length;
    }
    result += inner.slice(lastIdx);
    return result;
  }
  // LaTeX puro
  return renderKatex(inner);
}

export function renderMath(text: string): string {
  if (!text) return '';

  // ── Modo mixto: hay al menos un $ en el texto ─────────────────────────────
  if (text.includes('$')) {
    const resultado = text.replace(/\$([^$]+)\$?/g, (_match, inner) =>
      renderFragment(inner)
    );
    return resultado.replace(/\n/g, '<br/>');
  }

  // ── Modo puro o mezcla sin $: tiene \ o ^ o _ ────────────────────────────
  if (text.includes('\\') || /[_^{]/.test(text)) {
    return renderFragment(text);
  }

  // ── Texto plano ───────────────────────────────────────────────────────────
  return text.replace(/\n/g, '<br/>');
}
