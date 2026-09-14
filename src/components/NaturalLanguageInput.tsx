import React, { useState } from 'react';
import { Mic, Sparkles, Send, MicOff } from 'lucide-react';
import { parseNaturalLanguageMath } from '../utils/naturalLanguageParser';

interface NaturalLanguageInputProps {
  onApplyExpression: (expression: string, explanation: string) => void;
  onVoiceToggle: () => void;
  isListening: boolean;
  speechSupported: boolean;
}

const EXAMPLE_QUERIES = [
  '15% of 850',
  'half of 450',
  'sqrt of 144',
  '25 times 4 plus 10',
  'double 64',
];

export const NaturalLanguageInput: React.FC<NaturalLanguageInputProps> = ({
  onApplyExpression,
  onVoiceToggle,
  isListening,
  speechSupported,
}) => {
  const [inputText, setInputText] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputText(val);
    if (val.trim()) {
      const parsed = parseNaturalLanguageMath(val);
      if (parsed) {
        setPreview(`${parsed.explanation} ➔ ${parsed.mathExpression}`);
      } else {
        setPreview(null);
      }
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const parsed = parseNaturalLanguageMath(inputText);
    if (parsed) {
      onApplyExpression(parsed.mathExpression, parsed.explanation);
      setInputText('');
      setPreview(null);
    } else {
      // Fallback: apply directly
      onApplyExpression(inputText.trim(), `Interpreted: ${inputText}`);
      setInputText('');
      setPreview(null);
    }
  };

  const handleChipClick = (query: string) => {
    setInputText(query);
    const parsed = parseNaturalLanguageMath(query);
    if (parsed) {
      onApplyExpression(parsed.mathExpression, parsed.explanation);
      setInputText('');
      setPreview(null);
    }
  };

  return (
    <div
      id="ai-prompt-container"
      className="p-3 sm:p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md flex flex-col gap-2.5 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-medium text-cyan-300">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Ask AI or Speak Math</span>
        </div>

        {isListening && (
          <span className="text-[11px] font-mono text-rose-400 animate-pulse flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block" />
            Listening...
          </span>
        )}
      </div>

      {/* Input Box with Voice & Send Buttons */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          id="ai-text-input"
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder={
            isListening
              ? 'Listening to your voice...'
              : "Type or speak (e.g., '15% of 850', 'square root of 81')"
          }
          className="w-full h-11 pl-3.5 pr-20 rounded-xl bg-black/40 border border-white/15 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-cyan-400/70 focus:ring-1 focus:ring-cyan-400/40 transition-all"
        />

        <div className="absolute right-1.5 flex items-center gap-1">
          {/* Microphone Voice button */}
          <button
            id="voice-recognition-button"
            type="button"
            onClick={onVoiceToggle}
            className={`p-2 rounded-lg transition-all ${
              isListening
                ? 'bg-rose-500 text-white animate-bounce'
                : 'bg-white/10 hover:bg-white/20 text-white/80 hover:text-white'
            }`}
            title={
              speechSupported
                ? isListening
                  ? 'Stop listening'
                  : 'Click to speak a calculation'
                : 'Speech recognition not supported in this browser'
            }
            aria-label="Voice input"
          >
            {isListening ? (
              <Mic className="w-4 h-4 text-white" />
            ) : speechSupported ? (
              <Mic className="w-4 h-4 text-cyan-400" />
            ) : (
              <MicOff className="w-4 h-4 text-white/40" />
            )}
          </button>

          {/* Send / Apply button */}
          <button
            id="submit-ai-prompt-button"
            type="submit"
            disabled={!inputText.trim()}
            className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 hover:text-cyan-300 disabled:opacity-30 disabled:pointer-events-none transition-all"
            title="Compute expression"
            aria-label="Submit"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Live parsing preview tag */}
      {preview && (
        <div className="text-[11px] font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-500/20 px-2.5 py-1 rounded-lg truncate">
          {preview}
        </div>
      )}

      {/* Suggested Quick Prompt Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-[11px]">
        <span className="text-white/30 shrink-0 select-none">Try:</span>
        {EXAMPLE_QUERIES.map((query) => (
          <button
            key={query}
            type="button"
            onClick={() => handleChipClick(query)}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-white/60 hover:text-cyan-300 transition-all font-mono"
          >
            {query}
          </button>
        ))}
      </div>
    </div>
  );
};
