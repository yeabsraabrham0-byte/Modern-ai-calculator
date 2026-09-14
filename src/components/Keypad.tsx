import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Delete, Mic, Volume2 } from 'lucide-react';

interface KeypadProps {
  isScientific: boolean;
  onNumber: (num: string) => void;
  onOperator: (op: string) => void;
  onDecimal: () => void;
  onClear: () => void;
  onDelete: () => void;
  onToggleSign: () => void;
  onCalculate: () => void;
  onScientificFunc: (fn: string) => void;
  onVoiceClick: () => void;
  isListening: boolean;
}

export const Keypad: React.FC<KeypadProps> = ({
  isScientific,
  onNumber,
  onOperator,
  onDecimal,
  onClear,
  onDelete,
  onToggleSign,
  onCalculate,
  onScientificFunc,
  onVoiceClick,
  isListening,
}) => {
  return (
    <div id="calculator-keypad" className="flex flex-col gap-2.5 sm:gap-3">
      {/* Scientific Expansion Panel */}
      <AnimatePresence>
        {isScientific && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-2.5 p-2 rounded-xl bg-white/[0.03] border border-white/5 mb-1">
              <button
                id="btn-sqrt"
                onClick={() => onScientificFunc('sqrt')}
                className="h-11 sm:h-12 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-sm font-medium font-mono border border-white/5 active:scale-95 transition-all"
                title="Square Root"
              >
                √x
              </button>
              <button
                id="btn-square"
                onClick={() => onScientificFunc('square')}
                className="h-11 sm:h-12 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-sm font-medium font-mono border border-white/5 active:scale-95 transition-all"
                title="Squared"
              >
                x²
              </button>
              <button
                id="btn-power"
                onClick={() => onScientificFunc('power')}
                className="h-11 sm:h-12 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-sm font-medium font-mono border border-white/5 active:scale-95 transition-all"
                title="Power (x^y)"
              >
                xʸ
              </button>
              <button
                id="btn-sin"
                onClick={() => onScientificFunc('sin')}
                className="h-11 sm:h-12 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-sm font-medium font-mono border border-white/5 active:scale-95 transition-all"
                title="Sine"
              >
                sin
              </button>
              <button
                id="btn-cos"
                onClick={() => onScientificFunc('cos')}
                className="h-11 sm:h-12 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-sm font-medium font-mono border border-white/5 active:scale-95 transition-all"
                title="Cosine"
              >
                cos
              </button>
              <button
                id="btn-tan"
                onClick={() => onScientificFunc('tan')}
                className="h-11 sm:h-12 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-sm font-medium font-mono border border-white/5 active:scale-95 transition-all"
                title="Tangent"
              >
                tan
              </button>
              <button
                id="btn-log"
                onClick={() => onScientificFunc('log')}
                className="h-11 sm:h-12 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-sm font-medium font-mono border border-white/5 active:scale-95 transition-all"
                title="Logarithm (base 10)"
              >
                log
              </button>
              <button
                id="btn-ln"
                onClick={() => onScientificFunc('ln')}
                className="h-11 sm:h-12 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-sm font-medium font-mono border border-white/5 active:scale-95 transition-all"
                title="Natural Log (ln)"
              >
                ln
              </button>
              <button
                id="btn-pi"
                onClick={() => onScientificFunc('pi')}
                className="h-11 sm:h-12 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 text-sm font-medium font-mono border border-white/5 active:scale-95 transition-all"
                title="Pi Constant"
              >
                π
              </button>
              <button
                id="btn-e"
                onClick={() => onScientificFunc('e')}
                className="h-11 sm:h-12 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 text-sm font-medium font-mono border border-white/5 active:scale-95 transition-all"
                title="Euler Constant"
              >
                e
              </button>
              <button
                id="btn-open-paren"
                onClick={() => onScientificFunc('(')}
                className="h-11 sm:h-12 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-sm font-medium font-mono border border-white/5 active:scale-95 transition-all"
                title="Open Parenthesis"
              >
                (
              </button>
              <button
                id="btn-close-paren"
                onClick={() => onScientificFunc(')')}
                className="h-11 sm:h-12 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-sm font-medium font-mono border border-white/5 active:scale-95 transition-all"
                title="Close Parenthesis"
              >
                )
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main 4x5 Keypad Grid */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
        {/* Row 1: AC, DEL, Voice / %, Divide */}
        <button
          id="btn-clear-all"
          onClick={onClear}
          className="h-14 sm:h-16 rounded-2xl bg-white/10 hover:bg-white/15 text-rose-300 hover:text-rose-200 text-base sm:text-lg font-semibold border border-white/10 active:scale-95 transition-all flex items-center justify-center shadow-sm"
          title="All Clear (Esc)"
        >
          AC
        </button>
        <button
          id="btn-delete"
          onClick={onDelete}
          className="h-14 sm:h-16 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white text-base sm:text-lg font-semibold border border-white/10 active:scale-95 transition-all flex items-center justify-center shadow-sm"
          title="Delete last character (Backspace)"
        >
          <Delete className="w-5 h-5" />
        </button>
        <button
          id="btn-percent"
          onClick={() => onOperator('%')}
          className="h-14 sm:h-16 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white text-base sm:text-lg font-semibold border border-white/10 active:scale-95 transition-all flex items-center justify-center shadow-sm"
          title="Percentage"
        >
          %
        </button>
        <button
          id="btn-divide"
          onClick={() => onOperator('/')}
          className="h-14 sm:h-16 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 hover:text-amber-300 text-2xl font-medium border border-amber-500/30 active:scale-95 transition-all flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.15)]"
          title="Divide (/)"
        >
          ÷
        </button>

        {/* Row 2: 7, 8, 9, Multiply */}
        <button
          id="btn-7"
          onClick={() => onNumber('7')}
          className="h-14 sm:h-16 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-white text-xl sm:text-2xl font-mono font-medium border border-white/10 active:scale-95 transition-all flex items-center justify-center shadow-sm"
        >
          7
        </button>
        <button
          id="btn-8"
          onClick={() => onNumber('8')}
          className="h-14 sm:h-16 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-white text-xl sm:text-2xl font-mono font-medium border border-white/10 active:scale-95 transition-all flex items-center justify-center shadow-sm"
        >
          8
        </button>
        <button
          id="btn-9"
          onClick={() => onNumber('9')}
          className="h-14 sm:h-16 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-white text-xl sm:text-2xl font-mono font-medium border border-white/10 active:scale-95 transition-all flex items-center justify-center shadow-sm"
        >
          9
        </button>
        <button
          id="btn-multiply"
          onClick={() => onOperator('*')}
          className="h-14 sm:h-16 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 hover:text-amber-300 text-2xl font-medium border border-amber-500/30 active:scale-95 transition-all flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.15)]"
          title="Multiply (*)"
        >
          ×
        </button>

        {/* Row 3: 4, 5, 6, Subtract */}
        <button
          id="btn-4"
          onClick={() => onNumber('4')}
          className="h-14 sm:h-16 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-white text-xl sm:text-2xl font-mono font-medium border border-white/10 active:scale-95 transition-all flex items-center justify-center shadow-sm"
        >
          4
        </button>
        <button
          id="btn-5"
          onClick={() => onNumber('5')}
          className="h-14 sm:h-16 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-white text-xl sm:text-2xl font-mono font-medium border border-white/10 active:scale-95 transition-all flex items-center justify-center shadow-sm"
        >
          5
        </button>
        <button
          id="btn-6"
          onClick={() => onNumber('6')}
          className="h-14 sm:h-16 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-white text-xl sm:text-2xl font-mono font-medium border border-white/10 active:scale-95 transition-all flex items-center justify-center shadow-sm"
        >
          6
        </button>
        <button
          id="btn-subtract"
          onClick={() => onOperator('-')}
          className="h-14 sm:h-16 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 hover:text-amber-300 text-2xl font-medium border border-amber-500/30 active:scale-95 transition-all flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.15)]"
          title="Subtract (-)"
        >
          −
        </button>

        {/* Row 4: 1, 2, 3, Add */}
        <button
          id="btn-1"
          onClick={() => onNumber('1')}
          className="h-14 sm:h-16 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-white text-xl sm:text-2xl font-mono font-medium border border-white/10 active:scale-95 transition-all flex items-center justify-center shadow-sm"
        >
          1
        </button>
        <button
          id="btn-2"
          onClick={() => onNumber('2')}
          className="h-14 sm:h-16 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-white text-xl sm:text-2xl font-mono font-medium border border-white/10 active:scale-95 transition-all flex items-center justify-center shadow-sm"
        >
          2
        </button>
        <button
          id="btn-3"
          onClick={() => onNumber('3')}
          className="h-14 sm:h-16 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-white text-xl sm:text-2xl font-mono font-medium border border-white/10 active:scale-95 transition-all flex items-center justify-center shadow-sm"
        >
          3
        </button>
        <button
          id="btn-add"
          onClick={() => onOperator('+')}
          className="h-14 sm:h-16 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 hover:text-amber-300 text-2xl font-medium border border-amber-500/30 active:scale-95 transition-all flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.15)]"
          title="Add (+)"
        >
          +
        </button>

        {/* Row 5: Plus/Minus, 0, Decimal, Equals */}
        <button
          id="btn-toggle-sign"
          onClick={onToggleSign}
          className="h-14 sm:h-16 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white text-lg font-semibold border border-white/10 active:scale-95 transition-all flex items-center justify-center shadow-sm"
          title="Toggle positive/negative (±)"
        >
          ±
        </button>
        <button
          id="btn-0"
          onClick={() => onNumber('0')}
          className="h-14 sm:h-16 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-white text-xl sm:text-2xl font-mono font-medium border border-white/10 active:scale-95 transition-all flex items-center justify-center shadow-sm"
        >
          0
        </button>
        <button
          id="btn-decimal"
          onClick={onDecimal}
          className="h-14 sm:h-16 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-white text-xl sm:text-2xl font-mono font-medium border border-white/10 active:scale-95 transition-all flex items-center justify-center shadow-sm"
          title="Decimal point (.)"
        >
          .
        </button>
        <button
          id="btn-equals"
          onClick={onCalculate}
          className="h-14 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black text-2xl sm:text-3xl font-bold active:scale-95 transition-all flex items-center justify-center shadow-[0_4px_24px_rgba(245,158,11,0.45)] cursor-pointer"
          title="Calculate (Enter / =)"
        >
          =
        </button>
      </div>
    </div>
  );
};
