import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, BookOpen, ExternalLink } from 'lucide-react';
import { VANILLA_HTML, VANILLA_CSS, VANILLA_JS, SETUP_GUIDE_MARKDOWN } from '../utils/vanillaCodeStrings';

interface CodeAndGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'html' | 'css' | 'js' | 'guide';

export const CodeAndGuideModal: React.FC<CodeAndGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('guide');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getCodeContent = () => {
    switch (activeTab) {
      case 'html':
        return VANILLA_HTML;
      case 'css':
        return VANILLA_CSS;
      case 'js':
        return VANILLA_JS;
      case 'guide':
        return SETUP_GUIDE_MARKDOWN;
    }
  };

  const getFilename = () => {
    switch (activeTab) {
      case 'html':
        return 'index.html';
      case 'css':
        return 'style.css';
      case 'js':
        return 'script.js';
      case 'guide':
        return 'README.md';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCodeContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = getFilename();
    const content = getCodeContent();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    // Download html, css, js individually
    const files = [
      { name: 'index.html', content: VANILLA_HTML },
      { name: 'style.css', content: VANILLA_CSS },
      { name: 'script.js', content: VANILLA_JS },
    ];
    files.forEach((f, idx) => {
      setTimeout(() => {
        const blob = new Blob([f.content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = f.name;
        a.click();
        URL.revokeObjectURL(url);
      }, idx * 250);
    });
  };

  return (
    <div
      id="code-guide-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        id="code-guide-modal-content"
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-[#0e1424] border border-white/15 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <FileCode className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base font-semibold text-white">
                Standalone Code & Teacher Guide
              </h2>
              <p className="text-xs text-white/50">
                Pure Vanilla HTML, CSS & JavaScript — zero external dependencies
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadAll}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/80 hover:text-white flex items-center gap-1.5 transition-all"
              title="Download index.html, style.css, script.js"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download All Files</span>
            </button>
            <button
              id="close-modal-button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-all"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-black/40 border-b border-white/5 overflow-x-auto">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'guide'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Setup Guide</span>
            </button>
            <button
              onClick={() => setActiveTab('html')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                activeTab === 'html'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              index.html
            </button>
            <button
              onClick={() => setActiveTab('css')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                activeTab === 'css'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              style.css
            </button>
            <button
              onClick={() => setActiveTab('js')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                activeTab === 'js'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              script.js
            </button>
          </div>

          {/* Action buttons for current tab */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/80 hover:text-white flex items-center gap-1.5 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/80 hover:text-white flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save File</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 font-mono text-xs text-slate-300 leading-relaxed bg-[#0a0e1a]">
          {activeTab === 'guide' ? (
            <div className="font-sans space-y-4 text-sm text-slate-200">
              <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 text-xs leading-normal">
                💡 <strong>Teacher Note:</strong> This project is written purely in vanilla
                standards (HTML5, modern CSS3, and ES6+ JavaScript). It requires zero build tools,
                zero Node.js, and zero npm packages. You can run it directly on any browser.
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-semibold text-white">1. How to run locally:</h3>
                <ol className="list-decimal pl-5 space-y-1 text-slate-300 text-xs">
                  <li>Create a new folder on your computer named <code className="text-amber-400 bg-white/5 px-1 py-0.5 rounded">ai-calculator</code>.</li>
                  <li>Inside that folder, create three files: <code className="text-amber-400 bg-white/5 px-1 py-0.5 rounded">index.html</code>, <code className="text-blue-400 bg-white/5 px-1 py-0.5 rounded">style.css</code>, and <code className="text-emerald-400 bg-white/5 px-1 py-0.5 rounded">script.js</code>.</li>
                  <li>Switch to the tabs above, copy each file's code, and save them.</li>
                  <li>Double click <code className="text-amber-400 bg-white/5 px-1 py-0.5 rounded">index.html</code> to open it in Chrome, Firefox, Edge, or Safari!</li>
                </ol>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-semibold text-white">2. Key Architecture Insights:</h3>
                <ul className="list-disc pl-5 space-y-2 text-slate-300 text-xs">
                  <li>
                    <strong className="text-amber-300">Division by Zero Protection:</strong> We inspect the expression before calculating using regex <code className="bg-white/5 px-1 rounded">/\/\s*0(?![0-9.])/</code> and finite number checks. If division by zero occurs, the calculator gracefully outputs <span className="text-rose-400 font-semibold">"Cannot divide by zero"</span> instead of crashing.
                  </li>
                  <li>
                    <strong className="text-cyan-300">Web Speech API Voice Feature:</strong> Uses native <code className="bg-white/5 px-1 rounded">window.SpeechRecognition</code>. Spoken words like "twenty five plus forty" or "15 percent of 80" are transformed by the Natural Language Processor into math tokens (<code className="bg-white/5 px-1 rounded">25 + 40</code>).
                  </li>
                  <li>
                    <strong className="text-purple-300">Glassmorphism Aesthetic:</strong> Relies on <code className="bg-white/5 px-1 rounded">backdrop-filter: blur(24px)</code>, translucent borders, and soft radial background ambient gradients.
                  </li>
                  <li>
                    <strong className="text-emerald-300">Keyboard Support:</strong> An event listener on <code className="bg-white/5 px-1 rounded">window.addEventListener('keydown')</code> captures digits, numpad keys, Enter, Backspace, and Escape.
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <pre className="whitespace-pre overflow-x-auto text-[11px] sm:text-xs text-slate-200">
              <code>{getCodeContent()}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
