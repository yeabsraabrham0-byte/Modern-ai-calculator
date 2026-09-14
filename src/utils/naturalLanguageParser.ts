import { NLPParseResult } from '../types';

const WORD_TO_NUMBER: Record<string, number> = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
  hundred: 100,
  thousand: 1000,
  million: 1000000,
};

/**
 * Convert natural text numbers like "twenty five" or "one hundred" into digits
 */
function convertWordsToNumbers(text: string): string {
  // Replace compound tens e.g. "twenty five" -> 25
  const words = text.toLowerCase().split(/\s+/);
  const resultWords: string[] = [];

  let currentNum = 0;
  let inNumber = false;

  for (let i = 0; i < words.length; i++) {
    const w = words[i].replace(/[^a-z0-9]/g, '');
    if (WORD_TO_NUMBER[w] !== undefined) {
      const val = WORD_TO_NUMBER[w];
      inNumber = true;
      if (val === 100) {
        currentNum = (currentNum === 0 ? 1 : currentNum) * 100;
      } else if (val === 1000) {
        currentNum = (currentNum === 0 ? 1 : currentNum) * 1000;
      } else if (val === 1000000) {
        currentNum = (currentNum === 0 ? 1 : currentNum) * 1000000;
      } else {
        currentNum += val;
      }
    } else {
      if (inNumber) {
        resultWords.push(currentNum.toString());
        currentNum = 0;
        inNumber = false;
      }
      resultWords.push(words[i]);
    }
  }

  if (inNumber) {
    resultWords.push(currentNum.toString());
  }

  return resultWords.join(' ');
}

export function parseNaturalLanguageMath(input: string): NLPParseResult | null {
  if (!input || !input.trim()) return null;

  const original = input.trim();
  let text = input.toLowerCase().trim();

  // Remove common filler conversational phrases
  text = text
    .replace(/^what is\s+/i, '')
    .replace(/^calculate\s+/i, '')
    .replace(/^compute\s+/i, '')
    .replace(/^tell me\s+/i, '')
    .replace(/^please\s+/i, '')
    .replace(/^how much is\s+/i, '')
    .replace(/^find\s+/i, '')
    .replace(/\?+$/, '');

  // Convert word numbers into digits
  text = convertWordsToNumbers(text);

  let explanation = '';
  let expression = '';

  // Pattern 1: Fractions e.g. "half of X", "one third of X", "quarter of X", "three quarters of X"
  if (/half of\s+([\d.]+)/.test(text)) {
    const match = text.match(/half of\s+([\d.]+)/);
    if (match) {
      expression = `${match[1]} / 2`;
      explanation = `Calculated half of ${match[1]}`;
    }
  } else if (/quarter of\s+([\d.]+)/.test(text)) {
    const match = text.match(/quarter of\s+([\d.]+)/);
    if (match) {
      expression = `${match[1]} / 4`;
      explanation = `Calculated a quarter of ${match[1]}`;
    }
  } else if (/double\s+([\d.]+)/.test(text)) {
    const match = text.match(/double\s+([\d.]+)/);
    if (match) {
      expression = `${match[1]} * 2`;
      explanation = `Doubled ${match[1]}`;
    }
  } else if (/triple\s+([\d.]+)/.test(text)) {
    const match = text.match(/triple\s+([\d.]+)/);
    if (match) {
      expression = `${match[1]} * 3`;
      explanation = `Tripled ${match[1]}`;
    }
  }
  // Pattern 2: Percentages e.g. "15 percent of 800" or "15% of 800"
  else if (/([\d.]+)\s*(?:%|percent)\s+(?:of\s+)?([\d.]+)/.test(text)) {
    const match = text.match(/([\d.]+)\s*(?:%|percent)\s+(?:of\s+)?([\d.]+)/);
    if (match) {
      expression = `(${match[1]} / 100) * ${match[2]}`;
      explanation = `${match[1]}% of ${match[2]}`;
    }
  }
  // Pattern 3: Square root / root of X
  else if (/(?:square root of|sqrt of|root of)\s+([\d.]+)/.test(text)) {
    const match = text.match(/(?:square root of|sqrt of|root of)\s+([\d.]+)/);
    if (match) {
      expression = `sqrt(${match[1]})`;
      explanation = `Square root of ${match[1]}`;
    }
  }
  // Pattern 4: Powers e.g. "X squared", "X cubed", "X to the power of Y", "X raised to Y"
  else if (/([\d.]+)\s*squared/.test(text)) {
    const match = text.match(/([\d.]+)\s*squared/);
    if (match) {
      expression = `${match[1]} ^ 2`;
      explanation = `${match[1]} squared`;
    }
  } else if (/([\d.]+)\s*cubed/.test(text)) {
    const match = text.match(/([\d.]+)\s*cubed/);
    if (match) {
      expression = `${match[1]} ^ 3`;
      explanation = `${match[1]} cubed`;
    }
  } else if (/([\d.]+)\s*(?:to the power of|raised to the power of|raised to|power of)\s*([\d.]+)/.test(text)) {
    const match = text.match(/([\d.]+)\s*(?:to the power of|raised to the power of|raised to|power of)\s*([\d.]+)/);
    if (match) {
      expression = `${match[1]} ^ ${match[2]}`;
      explanation = `${match[1]} to the power of ${match[2]}`;
    }
  }

  // Pattern 5: General verbal arithmetic operators
  if (!expression) {
    let processed = text
      // Word operators to math symbols
      .replace(/\bplus\b|\band\b|\badd\b/g, '+')
      .replace(/\bminus\b|\btake away\b|\bsubtract\b|\bless\b/g, '-')
      .replace(/\btimes\b|\bmultiplied by\b|\bmultiply by\b|\bby\b/g, '*')
      .replace(/\bdivided by\b|\bdivide by\b|\bover\b/g, '/')
      .replace(/\bmodulo\b|\bmod\b/g, '%')
      .replace(/\bequals\b|\bequal to\b/g, '')
      .replace(/\bopen parenthesis\b|\bopen bracket\b/g, '(')
      .replace(/\bclose parenthesis\b|\bclose bracket\b/g, ')')
      // Filter to keep allowed mathematical characters
      .replace(/[^0-9+\-*/().%^√a-z]/g, ' ')
      .replace(/\s+/g, '')
      .trim();

    if (processed && /[\d]/.test(processed)) {
      expression = processed;
      explanation = `Understood: "${original}"`;
    }
  }

  if (!expression) return null;

  return {
    originalText: original,
    mathExpression: expression,
    explanation: explanation || `Parsed: ${expression}`,
    confidence: 'high',
  };
}
