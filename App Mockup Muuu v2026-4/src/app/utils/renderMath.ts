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

export function renderMath(text: string): string {
  if (!text) return '';

  // ── Modo mixto: hay al menos un $ en el texto ─────────────────────────────
  if (text.includes('$')) {
    // Capturamos cada segmento "$…$" (con $ de cierre opcional)
    // para manejar flashcards mal cerrados.
    // La regex sustituye el trozo entre $ (y el posible $ de cierre)
    // por la salida de KaTeX; el texto fuera de $ queda sin tocar.
    const resultado = text.replace(/\$([^$]+)\$?/g, (_match, inner) =>
      renderKatex(inner)
    );
    return resultado.replace(/\n/g, '<br/>');
  }

  // ── Modo puro: sin $, pero parece LaTeX (tiene \ o ^ o _) ────────────────
  if (text.includes('\\') || /[_^{]/.test(text)) {
    return renderKatex(text);
  }

  // ── Texto plano ───────────────────────────────────────────────────────────
  return text.replace(/\n/g, '<br/>');
}
