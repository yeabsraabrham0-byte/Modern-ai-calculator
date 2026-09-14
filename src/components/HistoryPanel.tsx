import React, { useState } from 'react';
import { History, Trash2, ArrowUpRight, Copy, Check, Mic, Calculator, Sparkles, Download } from 'lucide-react';
import { CalculationHistoryItem } from '../types';

interface HistoryPanelProps {
  history: CalculationHistoryItem[];
  onRecall: (item: CalculationHistoryItem) => void;
  onClear: () => void;
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onRecall,
  onClear,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, item: CalculationHistoryItem) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${item.expression} = ${item.result}`);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleExport = () => {
    if (history.length === 0) return;
    const content = history
      .map(
        (h) =>
          `[${new Date(h.timestamp).toLocaleTimeString()}] ${h.expression} = ${h.result} (${h.source})`
      )
      .join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calculator-history-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSourceIcon = (source: CalculationHistoryItem['source']) => {
    switch (source) {
      case 'voice':
        return <Mic className="w-3 h-3 text-rose-400" title="Voice Input" />;
      case 'nlp':
        return <Sparkles className="w-3 h-3 text-cyan-400" title="AI Natural Language" />;
      default:
        return <Calculator className="w-3 h-3 text-white/40" title="Keypad/Keyboard" />;
    }
  };

  return (
    <aside
      id="calculator-history-panel"
      className="flex flex-col h-full rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl p-4 sm:p-5 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-3 select-none">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-semibold text-white/90">History</h2>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-[11px] font-mono text-white/60">
            {history.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {history.length > 0 && (
            <>
              <button
                id="export-history-button"
                onClick={handleExport}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all text-xs flex items-center gap-1"
                title="Download history as text"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                id="clear-history-button"
                onClick={onClear}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-white/60 hover:text-rose-400 transition-all text-xs flex items-center gap-1"
                title="Clear all history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="text-[11px]">Clear</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* History Items List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2 max-h-[380px] sm:max-h-[480px]">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-white/30 space-y-2 select-none">
            <History className="w-8 h-8 opacity-40 stroke-1" />
            <p className="text-xs">No calculations yet</p>
            <p className="text-[11px] text-white/20">
              Type, speak, or click keypad buttons to calculate.
            </p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              onClick={() => onRecall(item)}
              className="group relative p-3 rounded-xl bg-black/25 hover:bg-white/[0.08] border border-white/5 hover:border-white/15 transition-all cursor-pointer text-right select-none"
            >
              {/* Top row: source icon + time */}
              <div className="flex items-center justify-between text-[10px] text-white/40 mb-1">
                <span className="flex items-center gap-1">
                  {getSourceIcon(item.source)}
                  <span className="capitalize">{item.source}</span>
                </span>
                <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              {/* Expression */}
              <div className="font-mono text-xs text-white/60 truncate group-hover:text-white/80">
                {item.expression} =
              </div>

              {/* Result */}
              <div className="font-mono text-lg font-semibold text-amber-400 truncate mt-0.5">
                {item.result}
              </div>

              {/* Action buttons on hover */}
              <div className="absolute left-2.5 bottom-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => handleCopy(e, item)}
                  className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-white/70 hover:text-white"
                  title="Copy to clipboard"
                >
                  {copiedId === item.id ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
                <button
                  type="button"
                  className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-white/70 hover:text-white"
                  title="Load into display"
                >
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};
