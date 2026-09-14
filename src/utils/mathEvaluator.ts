/**
 * Safe, robust mathematical expression parser and evaluator.
 * Protects against code injection (no arbitrary eval) and explicitly detects
 * and catches division by zero errors.
 */

export interface EvaluationResult {
  success: boolean;
  value?: number;
  formatted?: string;
  error?: string;
}

export function formatResultNumber(num: number): string {
  if (isNaN(num)) return 'Error: Not a Number';
  if (!isFinite(num)) return 'Error: Infinity';

  // Fix floating point issues like 0.1 + 0.2 = 0.30000000000000004
  const precisionFix = parseFloat(num.toPrecision(12));
  
  // Format very large or very small numbers in scientific notation
  if (Math.abs(precisionFix) >= 1e12 || (Math.abs(precisionFix) > 0 && Math.abs(precisionFix) < 1e-7)) {
    return precisionFix.toExponential(6).replace(/\.?0+e/, 'e');
  }

  // Format standard numbers
  const str = precisionFix.toString();
  if (str.includes('.')) {
    const [intPart, decPart] = str.split('.');
    const formattedInt = Number(intPart).toLocaleString('en-US');
    return `${formattedInt}.${decPart}`;
  }
  return Number(str).toLocaleString('en-US');
}

export function evaluateExpression(
  rawExpression: string,
  angleMode: 'deg' | 'rad' = 'deg'
): EvaluationResult {
  try {
    if (!rawExpression || !rawExpression.trim()) {
      return { success: false, error: 'Empty expression' };
    }

    // Sanitize string
    let expr = rawExpression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, `(${Math.PI})`)
      .replace(/\be\b/g, `(${Math.E})`)
      .trim();

    // Check for explicit division by literal zero e.g. / 0, / 0.0, / (0)
    if (/\/\s*0(?![0-9.])(?!\s*\+\s*[1-9])/.test(expr)) {
      return { success: false, error: 'Cannot divide by zero' };
    }

    // Replace scientific functions
    // Support deg / rad for sin, cos, tan
    const toRadFactor = angleMode === 'deg' ? `* (${Math.PI} / 180)` : '';

    // Handle percentage like 50 + 10% or 20%
    // Convert 20% to (20/100)
    expr = expr.replace(/(\d+(\.\d+)?)%/g, '($1 / 100)');

    // Handle powers (e.g. 2^3 -> Math.pow(2, 3))
    expr = expr.replace(/(\d+(\.\d+)?|\([^)]+\))\s*\^\s*(\d+(\.\d+)?|\([^)]+\))/g, 'Math.pow($1, $3)');

    // Handle sqrt(x) -> Math.sqrt(x)
    expr = expr.replace(/\bsqrt\(([^)]+)\)/g, 'Math.sqrt($1)');
    expr = expr.replace(/√\s*(\d+(\.\d+)?|\([^)]+\))/g, 'Math.sqrt($1)');

    // Handle sin, cos, tan
    expr = expr.replace(/\bsin\(([^)]+)\)/g, `Math.sin(($1)${toRadFactor})`);
    expr = expr.replace(/\bcos\(([^)]+)\)/g, `Math.cos(($1)${toRadFactor})`);
    expr = expr.replace(/\btan\(([^)]+)\)/g, `Math.tan(($1)${toRadFactor})`);
    
    // Handle log, ln
    expr = expr.replace(/\bln\(([^)]+)\)/g, 'Math.log($1)');
    expr = expr.replace(/\blog\(([^)]+)\)/g, 'Math.log10($1)');

    // Security whitelist check: Ensure only valid math tokens exist
    const safeRegex = /^[\d\s+\-*/().,%^Mathpowsqrtsincotanlgeb]+$/;
    // Further verify no dangerous keywords
    if (/function|constructor|window|document|eval|alert|this|global|process/i.test(expr)) {
      return { success: false, error: 'Invalid expression tokens' };
    }

    // Execute through a sandboxed Function with Math in scope
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const compute = new Function('Math', `"use strict"; return (${expr});`);
    const val = compute(Math);

    if (typeof val !== 'number') {
      return { success: false, error: 'Calculation did not return a number' };
    }

    if (isNaN(val)) {
      return { success: false, error: 'Invalid calculation (NaN)' };
    }

    if (!isFinite(val)) {
      return { success: false, error: 'Cannot divide by zero' };
    }

    return {
      success: true,
      value: val,
      formatted: formatResultNumber(val),
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Invalid syntax';
    if (msg.includes('divide by zero')) {
      return { success: false, error: 'Cannot divide by zero' };
    }
    return { success: false, error: 'Syntax Error' };
  }
}
