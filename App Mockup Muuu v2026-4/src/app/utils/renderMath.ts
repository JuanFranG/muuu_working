/**
 * Convierte texto con notación LaTeX/matemática básica a HTML visualizable.
 * Compartido entre QuizScreen, DisenarFlashcard y FlashcardNemotecnia.
 *
 * MODO DELIMITADO (recomendado para texto mixto):
 *   Usar $...$ para marcar zonas matemáticas:
 *   "Si $\int_a^b f(x)\,dx$ = 5, entonces..."
 *   → Solo el contenido dentro de $...$ se transforma.
 *   → El texto fuera queda intacto (solo se convierten saltos de línea).
 *
 * MODO COMPLETO (retrocompatible):
 *   Si el texto no contiene $, se aplica la transformación a todo el string.
 *   Todos los flashcards existentes siguen funcionando sin cambios.
 */
export function renderMath(text: string): string {
  if (!text) return '';

  // ── Modo delimitado: si hay $...$ procesar solo esas zonas ──
  if (text.includes('$')) {
    // Divide en partes: índices pares = texto plano, impares = math
    const parts = text.split(/\$([^$]+)\$/);
    return parts
      .map((part, i) =>
        i % 2 === 0
          ? part.replace(/\n/g, '<br/>')   // texto plano → solo saltos
          : applyLatexTransforms(part)      // zona math → transformar todo
      )
      .join('');
  }

  // ── Modo completo (retrocompatible): transforma todo el string ──
  return applyLatexTransforms(text);
}

/**
 * Grupo que captura contenido con UN nivel de anidamiento de llaves.
 * Ejemplo: captura  x^{n+1}  dentro de  \frac{x^{n+1}}{n+1}
 *   (?:[^{}]  → cualquier char que no sea llave
 *    |\{[^}]*\})*  → O un grupo {…} sin llaves internas
 */
const BRACE_CONTENT = '(?:[^{}]|\\{[^}]*\\})*';

/** Aplica todas las transformaciones LaTeX → HTML a un string. */
function applyLatexTransforms(text: string): string {
  return text
    .replace(/\\int/g, '∫')
    // \frac con soporte de llaves anidadas en numerador y denominador
    .replace(
      new RegExp(`\\\\frac\\{(${BRACE_CONTENT})\\}\\{(${BRACE_CONTENT})\\}`, 'g'),
      '<span style="display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;font-size:0.85em">' +
      '<span style="border-bottom:1.5px solid currentColor;padding:0 2px">$1</span>' +
      '<span style="padding:0 2px">$2</span></span>')
    // \sqrt con soporte de llaves anidadas
    .replace(
      new RegExp(`\\\\sqrt\\{(${BRACE_CONTENT})\\}`, 'g'),
      '√<span style="text-decoration:overline">$1</span>')
    .replace(/\^{([^}]+)}/g,  '<sup>$1</sup>')
    .replace(/\^(\w)/g,        '<sup>$1</sup>')
    .replace(/_{([^}]+)}/g,   '<sub>$1</sub>')
    .replace(/_(\w)/g,         '<sub>$1</sub>')
    .replace(/\\cdot/g,  '·')
    .replace(/\\times/g, '×')
    .replace(/\\pi/g,    'π')
    .replace(/\\infty/g, '∞')
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g,  'β')
    .replace(/\\theta/g, 'θ')
    .replace(/\\gamma/g, 'γ')
    .replace(/\\delta/g, 'δ')
    .replace(/\\sigma/g, 'σ')
    .replace(/\\omega/g, 'ω')
    .replace(/\\sin/g,   'sin')
    .replace(/\\cos/g,   'cos')
    .replace(/\\tan/g,   'tan')
    .replace(/\\ln/g,    'ln')
    .replace(/\\log/g,   'log')
    .replace(/\\lim/g,   'lim')
    .replace(/\\neq/g,   '≠')
    .replace(/\\leq/g,   '≤')
    .replace(/\\geq/g,   '≥')
    // Espaciado LaTeX
    .replace(/\\,/g,     '&thinsp;')
    .replace(/\\;/g,     '&ensp;')
    .replace(/\\quad/g,  '&emsp;')
    .replace(/\\!/g,     '')
    .replace(/\n/g,      '<br/>');
}
