/**
 * Convierte texto con notación LaTeX/matemática básica a HTML visualizable.
 * Compartido entre QuizScreen, DisenarFlashcard y FlashcardNemotecnia.
 */
export function renderMath(text: string): string {
  if (!text) return '';
  return text
    .replace(/\\int/g, '∫')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g,
      '<span style="display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;font-size:0.85em">' +
      '<span style="border-bottom:1.5px solid currentColor;padding:0 2px">$1</span>' +
      '<span style="padding:0 2px">$2</span></span>')
    .replace(/\\sqrt\{([^}]+)\}/g, '√<span style="text-decoration:overline">$1</span>')
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
    .replace(/\\sin/g,   'sin')
    .replace(/\\cos/g,   'cos')
    .replace(/\\tan/g,   'tan')
    .replace(/\\ln/g,    'ln')
    .replace(/\\log/g,   'log')
    .replace(/\n/g,      '<br/>');
}
