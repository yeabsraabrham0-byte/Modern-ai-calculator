import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CalculatorState, CalculationHistoryItem } from './types';
import { evaluateExpression } from './utils/mathEvaluator';
import { parseNaturalLanguageMath } from './utils/naturalLanguageParser';
import { soundEngine } from './utils/audioFeedback';
import { Display } from './components/Display';
import { Keypad } from './components/Keypad';
import { NaturalLanguageInput } from './components/NaturalLanguageInput';
import { HistoryPanel } from './components/HistoryPanel';
import { SettingsBar } from './components/SettingsBar';
import { CodeAndGuideModal } from './components/CodeAndGuideModal';
import { Sparkles, History as HistoryIcon, Calculator as CalcIcon } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'ai_calculator_history_v2';

export default function App() {
  const [state, setState] = useState<CalculatorState>({
    currentInput: '0',
    previousExpression: '',
    aiStatus: 'Ready for calculations or voice math...',
    aiStatusType: 'idle',
    isScientific: false,
    soundEnabled: true,
    speechSynthesisEnabled: false,
    angleMode: 'deg',
  });

  const [isNewCalc, setIsNewCalc] = useState(false);
  const [history, setHistory] = useState<CalculationHistoryItem[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'calc' | 'history'>('calc');

  // Reference to current recognition instance
  const recognitionRef = useRef<any>(null);

  // Load history from localStorage on initial render
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {
      // ignore
    }

    // Check Web Speech API support
    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setSpeechSupported(false);
    }
  }, []);

  // Persist history changes
  const saveHistory = (newHistory: CalculationHistoryItem[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newHistory));
    } catch {
      // ignore
    }
  };

  // Helper sound feedback
  const playSound = useCallback(
    (type: 'number' | 'operator' | 'action' = 'number') => {
      if (state.soundEnabled) {
        soundEngine.playKeyClick(type);
      }
    },
    [state.soundEnabled]
  );

  // Number input
  const handleNumber = useCallback(
    (num: string) => {
      playSound('number');
      setState((prev) => {
        let nextInput: string;
        if (prev.currentInput === '0' || isNewCalc || prev.aiStatusType === 'error') {
          nextInput = num;
        } else {
          nextInput = prev.currentInput + num;
        }
        return {
          ...prev,
          currentInput: nextInput,
          aiStatus: 'Ready...',
          aiStatusType: 'idle',
        };
      });
      setIsNewCalc(false);
    },
    [isNewCalc, playSound]
  );

  // Decimal point input
  const handleDecimal = useCallback(() => {
    playSound('number');
    setState((prev) => {
      if (isNewCalc || prev.aiStatusType === 'error') {
        setIsNewCalc(false);
        return { ...prev, currentInput: '0.', aiStatus: 'Ready...', aiStatusType: 'idle' };
      }
      const parts = prev.currentInput.split(/[-+*/%^]/);
      const lastBlock = parts[parts.length - 1];
      if (!lastBlock.includes('.')) {
        return { ...prev, currentInput: prev.currentInput + '.' };
      }
      return prev;
    });
  }, [isNewCalc, playSound]);

  // Operator input (+, -, *, /, %)
  const handleOperator = useCallback(
    (op: string) => {
      playSound('operator');
      setIsNewCalc(false);
      setState((prev) => {
        if (prev.aiStatusType === 'error') {
          return { ...prev, currentInput: '0', aiStatusType: 'idle' };
        }
        const lastChar = prev.currentInput.slice(-1);
        let nextInput = prev.currentInput;

        if (['+', '-', '*', '/', '%', '^'].includes(lastChar)) {
          nextInput = prev.currentInput.slice(0, -1) + op;
        } else {
          nextInput = prev.currentInput + op;
        }

        return {
          ...prev,
          currentInput: nextInput,
          aiStatus: `Operator: ${op}`,
          aiStatusType: 'idle',
        };
      });
    },
    [playSound]
  );

  // Toggle positive / negative
  const handleToggleSign = useCallback(() => {
    playSound('action');
    setState((prev) => {
      if (prev.currentInput === '0' || prev.aiStatusType === 'error') return prev;
      let nextInput = prev.currentInput;
      if (nextInput.startsWith('-')) {
        nextInput = nextInput.slice(1);
      } else {
        nextInput = '-' + nextInput;
      }
      return { ...prev, currentInput: nextInput };
    });
  }, [playSound]);

  // All Clear (AC)
  const handleClear = useCallback(() => {
    playSound('action');
    setState((prev) => ({
      ...prev,
      currentInput: '0',
      previousExpression: '',
      aiStatus: 'Memory cleared.',
      aiStatusType: 'idle',
    }));
    setIsNewCalc(false);
  }, [playSound]);

  // Delete last character (DEL)
  const handleDelete = useCallback(() => {
    playSound('action');
    if (isNewCalc) {
      handleClear();
      return;
    }
    setState((prev) => {
      if (prev.aiStatusType === 'error') {
        return { ...prev, currentInput: '0', aiStatusType: 'idle' };
      }
      const nextInput =
        prev.currentInput.length > 1 ? prev.currentInput.slice(0, -1) : '0';
      return { ...prev, currentInput: nextInput };
    });
  }, [isNewCalc, handleClear, playSound]);

  // Scientific functions
  const handleScientificFunc = useCallback(
    (fn: string) => {
      playSound('action');
      setIsNewCalc(false);
      setState((prev) => {
        let nextInput = prev.currentInput;
        if (fn === 'pi') {
          nextInput = prev.currentInput === '0' ? 'π' : prev.currentInput + ' * π';
        } else if (fn === 'e') {
          nextInput = prev.currentInput === '0' ? 'e' : prev.currentInput + ' * e';
        } else if (fn === 'sqrt') {
          nextInput = prev.currentInput === '0' ? 'sqrt(' : `sqrt(${prev.currentInput})`;
        } else if (fn === 'square') {
          nextInput = `(${prev.currentInput})^2`;
        } else if (fn === 'power') {
          nextInput = `${prev.currentInput}^`;
        } else if (['sin', 'cos', 'tan', 'log', 'ln'].includes(fn)) {
          nextInput = prev.currentInput === '0' ? `${fn}(` : `${fn}(${prev.currentInput})`;
        } else if (fn === '(' || fn === ')') {
          nextInput = prev.currentInput === '0' && fn === '(' ? '(' : prev.currentInput + fn;
        }

        return { ...prev, currentInput: nextInput };
      });
    },
    [playSound]
  );

  // Main Calculation Routine
  const handleCalculate = useCallback(
    (customSource: CalculationHistoryItem['source'] = 'keypad') => {
      setState((prev) => {
        if (!prev.currentInput || !prev.currentInput.trim()) return prev;

        const evalRes = evaluateExpression(prev.currentInput, prev.angleMode);

        if (!evalRes.success) {
          if (prev.soundEnabled) soundEngine.playErrorBuzz();
          return {
            ...prev,
            currentInput: evalRes.error || 'Error',
            aiStatus: `Error: ${evalRes.error || 'Invalid syntax'}`,
            aiStatusType: 'error',
          };
        }

        // Success!
        if (prev.soundEnabled) soundEngine.playSuccessChime();

        const formatted = evalRes.formatted || evalRes.value?.toString() || '0';

        // Add to history
        const historyItem: CalculationHistoryItem = {
          id: Math.random().toString(36).substring(2, 9),
          expression: prev.currentInput,
          result: formatted,
          timestamp: Date.now(),
          source: customSource,
        };

        const updatedHistory = [historyItem, ...history.slice(0, 24)];
        saveHistory(updatedHistory);

        // Optional speech synthesis readout
        if (prev.speechSynthesisEnabled && evalRes.value !== undefined) {
          soundEngine.speakResult(`Equals ${formatted}`);
        }

        return {
          ...prev,
          previousExpression: `${prev.currentInput} =`,
          currentInput: formatted,
          aiStatus: 'Calculation successful!',
          aiStatusType: 'success',
        };
      });

      setIsNewCalc(true);
    },
    [history]
  );

  // Apply expression from AI Natural Language prompt
  const handleApplyExpression = useCallback(
    (mathExpr: string, explanation: string) => {
      playSound('action');
      setState((prev) => ({
        ...prev,
        currentInput: mathExpr,
        aiStatus: explanation,
        aiStatusType: 'processing',
      }));

      // Automatically evaluate after a slight pause for natural UX
      setTimeout(() => {
        handleCalculate('nlp');
      }, 400);
    },
    [handleCalculate, playSound]
  );

  // Voice Recognition handler (Web Speech API)
  const toggleVoiceRecognition = useCallback(() => {
    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRec) {
      setState((prev) => ({
        ...prev,
        aiStatus: 'Speech recognition is not supported in this browser.',
        aiStatusType: 'error',
      }));
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setState((prev) => ({
        ...prev,
        aiStatus: 'Voice recognition stopped.',
        aiStatusType: 'idle',
      }));
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognitionRef.current = recognition;
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setState((prev) => ({
          ...prev,
          aiStatus: 'Listening... Speak a math problem!',
          aiStatusType: 'listening',
        }));
      };

      recognition.onresult = (event: any) => {
        setIsListening(false);
        const transcript = event.results[0][0].transcript;
        const parsed = parseNaturalLanguageMath(transcript);

        if (parsed) {
          setState((prev) => ({
            ...prev,
            currentInput: parsed.mathExpression,
            aiStatus: `Heard: "${transcript}" ➔ ${parsed.explanation}`,
            aiStatusType: 'processing',
          }));
          setTimeout(() => {
            handleCalculate('voice');
          }, 600);
        } else {
          setState((prev) => ({
            ...prev,
            aiStatus: `Could not parse math from: "${transcript}"`,
            aiStatusType: 'error',
          }));
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        setState((prev) => ({
          ...prev,
          aiStatus: `Voice error: ${event.error}. Try typing below.`,
          aiStatusType: 'error',
        }));
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      setState((prev) => ({
        ...prev,
        aiStatus: 'Microphone permission denied or busy.',
        aiStatusType: 'error',
      }));
    }
  }, [handleCalculate, isListening]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input field (e.g. AI prompt box)
      if (
        document.activeElement &&
        (document.activeElement.tagName === 'INPUT' ||
          document.activeElement.tagName === 'TEXTAREA')
      ) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        handleNumber(e.key);
      } else if (e.key === '.') {
        handleDecimal();
      } else if (['+', '-', '*', '/'].includes(e.key)) {
        handleOperator(e.key);
      } else if (e.key === '%') {
        handleOperator('%');
      } else if (e.key === '^') {
        handleOperator('^');
      } else if (e.key === '(' || e.key === ')') {
        handleScientificFunc(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleCalculate('keyboard');
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleDelete();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleNumber,
    handleDecimal,
    handleOperator,
    handleCalculate,
    handleDelete,
    handleClear,
    handleScientificFunc,
  ]);

  // History recall
  const handleRecallHistory = (item: CalculationHistoryItem) => {
    playSound('action');
    setState((prev) => ({
      ...prev,
      currentInput: item.result,
      previousExpression: `${item.expression} =`,
      aiStatus: `Recalled from history: ${item.result}`,
      aiStatusType: 'idle',
    }));
    setIsNewCalc(true);
    setMobileTab('calc');
  };

  // Clear history
  const handleClearHistory = () => {
    saveHistory([]);
    setState((prev) => ({
      ...prev,
      aiStatus: 'Calculation history cleared.',
      aiStatusType: 'idle',
    }));
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col justify-between relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Ambient background glowing light orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-600/30 to-indigo-600/10 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[550px] h-[550px] rounded-full bg-gradient-to-tl from-purple-600/25 to-pink-600/10 blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-[40%] left-[45%] translate-x-[-50%] translate-y-[-50%] w-[400px] h-[400px] rounded-full bg-cyan-600/15 blur-[130px] pointer-events-none z-0" />

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-4 sm:py-6 flex-1 flex flex-col justify-center">
        {/* Top Header Bar */}
        <header className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-amber-400 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#0b0f19] rounded-[14px] flex items-center justify-center">
                <CalcIcon className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">AI Calculator</h1>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
                  Vanilla Edition
                </span>
              </div>
              <p className="text-xs text-white/50 hidden sm:block">
                Modern Glassmorphism • Voice Math & NLP • Full Keyboard Support
              </p>
            </div>
          </div>

          {/* Mobile Tab Switcher */}
          <div className="flex lg:hidden items-center p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
            <button
              onClick={() => setMobileTab('calc')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                mobileTab === 'calc'
                  ? 'bg-amber-500 text-black shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Calculator
            </button>
            <button
              onClick={() => setMobileTab('history')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                mobileTab === 'history'
                  ? 'bg-amber-500 text-black shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <HistoryIcon className="w-3 h-3" />
              <span>History ({history.length})</span>
            </button>
          </div>
        </header>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left / Main Calculator Card */}
          <div
            className={`lg:col-span-8 flex flex-col gap-4 ${
              mobileTab === 'calc' ? 'flex' : 'hidden lg:flex'
            }`}
          >
            <div className="rounded-3xl bg-white/[0.04] border border-white/15 backdrop-blur-2xl p-4 sm:p-6 shadow-2xl flex flex-col gap-4">
              {/* Display Area */}
              <Display
                state={state}
                onCopy={() => navigator.clipboard.writeText(state.currentInput)}
              />

              {/* Natural Language / Voice Math Prompt */}
              <NaturalLanguageInput
                onApplyExpression={handleApplyExpression}
                onVoiceToggle={toggleVoiceRecognition}
                isListening={isListening}
                speechSupported={speechSupported}
              />

              {/* Main Keypad Grid */}
              <Keypad
                isScientific={state.isScientific}
                onNumber={handleNumber}
                onOperator={handleOperator}
                onDecimal={handleDecimal}
                onClear={handleClear}
                onDelete={handleDelete}
                onToggleSign={handleToggleSign}
                onCalculate={() => handleCalculate('keypad')}
                onScientificFunc={handleScientificFunc}
                onVoiceClick={toggleVoiceRecognition}
                isListening={isListening}
              />

              {/* Settings & Extras Bar */}
              <SettingsBar
                state={state}
                onToggleSound={() =>
                  setState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))
                }
                onToggleSpeech={() =>
                  setState((prev) => ({
                    ...prev,
                    speechSynthesisEnabled: !prev.speechSynthesisEnabled,
                  }))
                }
                onToggleScientific={() =>
                  setState((prev) => ({ ...prev, isScientific: !prev.isScientific }))
                }
                onToggleAngleMode={() =>
                  setState((prev) => ({
                    ...prev,
                    angleMode: prev.angleMode === 'deg' ? 'rad' : 'deg',
                  }))
                }
                onOpenCodeModal={() => setIsCodeModalOpen(true)}
              />
            </div>
          </div>

          {/* Right / History Sidebar */}
          <div
            className={`lg:col-span-4 ${
              mobileTab === 'history' ? 'block' : 'hidden lg:block'
            }`}
          >
            <HistoryPanel
              history={history}
              onRecall={handleRecallHistory}
              onClear={handleClearHistory}
            />
          </div>
        </div>
      </div>

      {/* Footer info & Keyboard guide */}
      <footer className="relative z-10 border-t border-white/5 py-3 px-4 text-center text-xs text-white/40">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span>⌨️ Keyboard: <span className="text-white/60">0-9</span>, <span className="text-white/60">+ - * /</span>, <span className="text-white/60">Enter (=)</span>, <span className="text-white/60">Backspace (Del)</span>, <span className="text-white/60">Esc (Clear)</span></span>
          </div>
          <div>
            Built with pure HTML, modern CSS Glassmorphism & Web Speech API
          </div>
        </div>
      </footer>

      {/* Standalone Code & Teacher Guide Modal */}
      <CodeAndGuideModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />
    </div>
  );
}
