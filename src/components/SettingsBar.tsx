import React from 'react';
import { Volume2, VolumeX, Code, Sparkles, SlidersHorizontal, BookOpen, ExternalLink } from 'lucide-react';
import { CalculatorState } from '../types';

interface SettingsBarProps {
  state: CalculatorState;
  onToggleSound: () => void;
  onToggleSpeech: () => void;
  onToggleScientific: () => void;
  onToggleAngleMode: () => void;
  onOpenCodeModal: () => void;
}

export const SettingsBar: React.FC<SettingsBarProps> = ({
  state,
  onToggleSound,
  onToggleSpeech,
  onToggleScientific,
  onToggleAngleMode,
  onOpenCodeModal,
}) => {
  return (
    <div
      id="settings-toolbar"
      className="flex flex-wrap items-center justify-between gap-2 p-2 sm:p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md text-xs select-none"
    >
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Sound toggle button */}
        <button
          id="toggle-sound-btn"
          onClick={onToggleSound}
          className={`px-2.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
            state.soundEnabled
              ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
              : 'bg-white/5 border-white/5 text-white/40 hover:text-white/70'
          }`}
          title={state.soundEnabled ? 'Keypad sound ON' : 'Keypad sound MUTED'}
        >
          {state.soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span>Audio FX</span>
        </button>

        {/* Text-to-Speech toggle */}
        <button
          id="toggle-speech-btn"
          onClick={onToggleSpeech}
          className={`px-2.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
            state.speechSynthesisEnabled
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : 'bg-white/5 border-white/5 text-white/40 hover:text-white/70'
          }`}
          title={state.speechSynthesisEnabled ? 'Speech readout ON' : 'Speech readout OFF'}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Voice Reply</span>
        </button>

        {/* Scientific mode toggle */}
        <button
          id="toggle-scientific-btn"
          onClick={onToggleScientific}
          className={`px-2.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
            state.isScientific
              ? 'bg-purple-500/20 border-purple-500/35 text-purple-300'
              : 'bg-white/5 border-white/5 text-white/50 hover:text-white/80'
          }`}
          title="Toggle scientific keypad (trig, power, log, constants)"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Scientific</span>
        </button>

        {/* DEG / RAD toggle */}
        {state.isScientific && (
          <button
            id="toggle-angle-mode-btn"
            onClick={onToggleAngleMode}
            className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-mono text-cyan-400 transition-all"
            title="Toggle Degrees / Radians"
          >
            {state.angleMode.toUpperCase()}
          </button>
        )}
      </div>

      {/* Beginner Guide & Standalone HTML/CSS/JS Source Code Modal */}
      <div className="flex items-center gap-1.5">
        <a
          href="/standalone/index.html"
          target="_blank"
          rel="noreferrer"
          className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-cyan-300 transition-all flex items-center gap-1.5"
          title="Open pure vanilla HTML in separate tab"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Vanilla Tab</span>
        </a>

        <button
          id="open-code-modal-btn"
          onClick={onOpenCodeModal}
          className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-medium transition-all flex items-center gap-1.5 shadow-sm"
          title="View complete commented HTML, CSS, and JS files + setup guide"
        >
          <Code className="w-3.5 h-3.5" />
          <span>HTML/CSS/JS Code</span>
        </button>
      </div>
    </div>
  );
};
