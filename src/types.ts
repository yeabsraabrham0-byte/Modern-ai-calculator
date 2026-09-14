export interface CalculationHistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
  source: 'keyboard' | 'keypad' | 'voice' | 'nlp';
}

export interface NLPParseResult {
  originalText: string;
  mathExpression: string;
  explanation: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface CalculatorState {
  currentInput: string;
  previousExpression: string;
  aiStatus: string;
  aiStatusType: 'idle' | 'listening' | 'processing' | 'success' | 'error';
  isScientific: boolean;
  soundEnabled: boolean;
  speechSynthesisEnabled: boolean;
  angleMode: 'deg' | 'rad';
}
