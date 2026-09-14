import React, { useState } from 'react';
import { Copy, Check, Sparkles, Volume2, Mic } from 'lucide-react';
import { CalculatorState } from '../types';

interface DisplayProps {
  state: CalculatorState;
  onCopy: () => void;
}

export const Display: React.FC<DisplayProps> = ({ state, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // Determine dynamic font size based on input length
  const getFontSizeClass = (text: string) => {
    const len = text.length;
    if (len > 18) return 'text-xl sm:text-2xl';
    if (len > 13) return 'text-2xl sm:text-3xl';
    if (len > 9) return 'text-3xl sm:text-4xl';
    return 'text-4xl sm:text-5xl';
  };

  const isError = state.aiStatusType === 'error';
  const isListening = state.aiStatusType === 'listening';

  return (
    <div
      id="calculator-display-container"
      className="relative rounded-2xl bg-black/40 border border-white/10 p-5 sm:p-6 backdrop-blur-md flex flex-col justify-between min-h-[140px] sm:min-h-[160px] shadow-inner transition-all duration-200"
    >
      {/* Top row: Mode tag + Copy button */}
      <div className="flex items-center justify-between text-xs text-white/50 mb-1 select-none">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 font-mono text-[11px] text-cyan-400">
            {state.angleMode.toUpperCase()}
          </span>
          {state.isScientific && (
            <span className="px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 font-mono text-[11px] text-purple-300">
              SCI
            </span>
          )}
          {state.speechSynthesisEnabled && (
            <span className="flex items-center gap-1 text-emerald-400">
              <Volume2 className="w-3 h-3" />
              <span className="text-[10px]">TTS</span>
            </span>
          )}
        </div>

        <button
          id="copy-result-button"
          onClick={handleCopyClick}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-white/60 hover:text-white transition-all flex items-center gap-1 text-[11px]"
          title="Copy current display to clipboard"
          aria-label="Copy result"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Previous calculation / formula chain */}
      <div
        id="previous-expression"
        className="font-mono text-sm sm:text-base text-white/50 text-right min-h-[22px] truncate select-all"
      >
        {state.previousExpression || ' '}
      </div>

      {/* Main active input / result */}
      <div
        id="current-display"
        className={`font-mono font-semibold tracking-tight text-right text-white break-all leading-tight my-1.5 transition-all select-all ${getFontSizeClass(
          state.currentInput
        )} ${isError ? 'text-rose-400' : ''}`}
      >
        {state.currentInput}
      </div>

      {/* AI Assistant Status bar */}
      <div
        id="ai-status-bar"
        className="flex items-center justify-between border-t border-white/5 pt-2.5 mt-1 text-xs select-none"
      >
        <div className="flex items-center gap-2 truncate pr-2">
          {isListening ? (
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
          ) : (
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                isError
                  ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]'
                  : 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
              }`}
            />
          )}

          <span
            id="ai-status-message"
            className={`truncate font-medium text-[12px] sm:text-[13px] ${
              isError
                ? 'text-rose-400'
                : isListening
                ? 'text-rose-300 font-semibold'
                : 'text-cyan-300'
            }`}
          >
            {state.aiStatus}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-white/40 shrink-0">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>AI Engine</span>
        </div>
      </div>
    </div>
  );
};
