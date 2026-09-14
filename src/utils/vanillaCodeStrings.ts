export const VANILLA_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Glassmorphism Calculator</title>
  <link rel="stylesheet" href="style.css">
  <!-- Google Fonts for sleek modern typography -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <!-- Ambient background glow elements -->
  <div class="glow-orb orb-1"></div>
  <div class="glow-orb orb-2"></div>
  <div class="glow-orb orb-3"></div>

  <div class="app-container">
    <!-- Main Calculator Card -->
    <main class="calculator-card glass">
      
      <!-- Top Bar: Title & Voice Indicator -->
      <header class="calc-header">
        <div class="brand">
          <span class="brand-badge">AI 2.0</span>
          <h1>Calculator</h1>
        </div>
        <button id="voice-btn" class="icon-btn voice-btn" title="Click to speak (e.g., '25 times 4' or '15% of 80')">
          <span class="mic-icon">🎤</span>
          <span class="pulse-ring"></span>
        </button>
      </header>

      <!-- Display Screen Area -->
      <section class="display-container">
        <!-- Previous calculation or operation chain -->
        <div id="prev-operation" class="prev-display"></div>
        
        <!-- Main number display -->
        <div id="current-display" class="current-display">0</div>
        
        <!-- AI Assistant status message -->
        <div class="ai-status-wrapper">
          <span class="status-dot" id="status-dot"></span>
          <span id="ai-status" class="ai-status">AI Assistant ready...</span>
        </div>
      </section>

      <!-- Keypad Grid -->
      <section class="keypad">
        <!-- Row 1: Clear, Delete, Modulo, Divide -->
        <button class="btn btn-action" onclick="clearDisplay()">AC</button>
        <button class="btn btn-action" onclick="deleteLast()">DEL</button>
        <button class="btn btn-action" onclick="appendOperator('%')">%</button>
        <button class="btn btn-operator" onclick="appendOperator('/')">÷</button>

        <!-- Row 2: 7, 8, 9, Multiply -->
        <button class="btn btn-num" onclick="appendNumber('7')">7</button>
        <button class="btn btn-num" onclick="appendNumber('8')">8</button>
        <button class="btn btn-num" onclick="appendNumber('9')">9</button>
        <button class="btn btn-operator" onclick="appendOperator('*')">×</button>

        <!-- Row 3: 4, 5, 6, Subtract -->
        <button class="btn btn-num" onclick="appendNumber('4')">4</button>
        <button class="btn btn-num" onclick="appendNumber('5')">5</button>
        <button class="btn btn-num" onclick="appendNumber('6')">6</button>
        <button class="btn btn-operator" onclick="appendOperator('-')">−</button>

        <!-- Row 4: 1, 2, 3, Add -->
        <button class="btn btn-num" onclick="appendNumber('1')">1</button>
        <button class="btn btn-num" onclick="appendNumber('2')">2</button>
        <button class="btn btn-num" onclick="appendNumber('3')">3</button>
        <button class="btn btn-operator" onclick="appendOperator('+')">+</button>

        <!-- Row 5: Plus/Minus, 0, Decimal, Equals -->
        <button class="btn btn-action" onclick="toggleSign()">±</button>
        <button class="btn btn-num" onclick="appendNumber('0')">0</button>
        <button class="btn btn-num" onclick="appendDecimal()">.</button>
        <button class="btn btn-equals" onclick="calculate()">=</button>
      </section>
    </main>

    <!-- Side Panel: Calculation History -->
    <aside class="history-panel glass">
      <div class="history-header">
        <h2>Calculation History</h2>
        <button class="btn-text-clear" onclick="clearHistory()" title="Clear all history">Clear</button>
      </div>
      <ul id="history-list" class="history-list">
        <!-- Rendered by script.js -->
      </ul>
    </aside>
  </div>

  <script src="script.js"></script>
</body>
</html>`;

export const VANILLA_CSS = `/* ==========================================================================
   AI Glassmorphism Calculator - CSS Stylesheet
   Designed with modern CSS Grid, Flexbox, backdrop-filter, and responsive rules
   ========================================================================== */

:root {
  /* Color Palette */
  --bg-deep: #0b0f19;
  --glass-surface: rgba(255, 255, 255, 0.06);
  --glass-border: rgba(255, 255, 255, 0.12);
  --glass-hover: rgba(255, 255, 255, 0.14);
  --glass-active: rgba(255, 255, 255, 0.22);
  
  --text-primary: #f8fafc;
  --text-secondary: rgba(248, 250, 252, 0.65);
  --text-dim: rgba(248, 250, 252, 0.4);
  
  --accent-amber: #f59e0b;
  --accent-amber-glow: rgba(245, 158, 11, 0.35);
  --accent-emerald: #10b981;
  --accent-rose: #f43f5e;
  --accent-cyan: #06b6d4;

  --font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
  --radius-lg: 24px;
  --radius-md: 16px;
  --radius-sm: 10px;
}

/* Reset & Box Sizing */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: var(--font-family);
  -webkit-font-smoothing: antialiased;
}

body {
  min-height: 100vh;
  background-color: var(--bg-deep);
  color: var(--text-primary);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-x: hidden;
  position: relative;
  padding: 24px 16px;
}

/* Atmospheric Ambient Glowing Orbs */
.glow-orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
  z-index: 0;
  opacity: 0.45;
}

.orb-1 {
  width: 380px;
  height: 380px;
  background: radial-gradient(circle, #3b82f6 0%, rgba(59, 130, 246, 0) 70%);
  top: -100px;
  left: -80px;
}

.orb-2 {
  width: 440px;
  height: 440px;
  background: radial-gradient(circle, #8b5cf6 0%, rgba(139, 92, 246, 0) 70%);
  bottom: -120px;
  right: -100px;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #06b6d4 0%, rgba(6, 182, 212, 0) 70%);
  top: 45%;
  left: 55%;
  transform: translate(-50%, -50%);
  opacity: 0.25;
}

/* Main Layout Wrapper */
.app-container {
  display: flex;
  gap: 24px;
  max-width: 900px;
  width: 100%;
  position: relative;
  z-index: 1;
  align-items: stretch;
}

/* Glassmorphic Container Class */
.glass {
  background: var(--glass-surface);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45),
              inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

/* Main Calculator Card */
.calculator-card {
  flex: 1.25;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.calc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-badge {
  background: rgba(6, 182, 212, 0.18);
  border: 1px solid rgba(6, 182, 212, 0.35);
  color: #38bdf8;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 20px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.brand h1 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

/* Voice Microphone Button */
.voice-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--glass-border);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}

.voice-btn:hover {
  background: rgba(255, 255, 255, 0.18);
  transform: scale(1.05);
}

.voice-btn.listening {
  background: rgba(244, 63, 94, 0.25);
  border-color: var(--accent-rose);
  animation: pulse-border 1.5s infinite;
}

@keyframes pulse-border {
  0% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.6); }
  70% { box-shadow: 0 0 0 12px rgba(244, 63, 94, 0); }
  100% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0); }
}

/* Display Screen */
.display-container {
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-md);
  padding: 20px 22px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 140px;
  text-align: right;
  word-break: break-all;
}

.prev-display {
  font-size: 1rem;
  color: var(--text-secondary);
  min-height: 24px;
  font-weight: 400;
  letter-spacing: 0.02em;
}

.current-display {
  font-size: 2.8rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.15;
  margin: 6px 0;
  transition: font-size 0.15s ease;
}

.ai-status-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  font-size: 0.8rem;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: var(--accent-cyan);
  box-shadow: 0 0 8px var(--accent-cyan);
  display: inline-block;
  transition: background-color 0.3s ease;
}

.status-dot.listening {
  background-color: var(--accent-rose);
  box-shadow: 0 0 10px var(--accent-rose);
}

.ai-status {
  color: var(--accent-cyan);
  font-style: normal;
  font-weight: 500;
}

/* Keypad Grid (4 columns) */
.keypad {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

/* Calculator Buttons */
.btn {
  height: 60px;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  font-size: 1.25rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.btn:active {
  transform: scale(0.95);
}

/* Number Keys */
.btn-num {
  background: var(--glass-surface);
  color: var(--text-primary);
  border-color: rgba(255, 255, 255, 0.08);
}

.btn-num:hover {
  background: var(--glass-hover);
  border-color: rgba(255, 255, 255, 0.2);
}

/* Action Keys (AC, DEL, %, ±) */
.btn-action {
  background: rgba(255, 255, 255, 0.08);
  color: #94a3b8;
  border-color: rgba(255, 255, 255, 0.08);
}

.btn-action:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #f1f5f9;
}

/* Operator Keys (÷, ×, −, +) */
.btn-operator {
  background: rgba(245, 158, 11, 0.16);
  color: var(--accent-amber);
  border-color: rgba(245, 158, 11, 0.28);
  font-size: 1.45rem;
}

.btn-operator:hover {
  background: rgba(245, 158, 11, 0.26);
  border-color: rgba(245, 158, 11, 0.45);
  box-shadow: 0 0 16px var(--accent-amber-glow);
}

/* Equals Button */
.btn-equals {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #ffffff;
  border: none;
  font-size: 1.5rem;
  font-weight: 600;
  box-shadow: 0 4px 18px rgba(217, 119, 6, 0.4);
}

.btn-equals:hover {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  box-shadow: 0 6px 24px rgba(245, 158, 11, 0.6);
  transform: translateY(-2px);
}

/* Side Panel: History */
.history-panel {
  flex: 0.9;
  padding: 24px;
  display: flex;
  flex-direction: column;
  max-height: 560px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--glass-border);
  margin-bottom: 16px;
}

.history-header h2 {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.btn-text-clear {
  background: transparent;
  border: none;
  color: var(--text-dim);
  cursor: pointer;
  font-size: 0.82rem;
  font-weight: 500;
  transition: color 0.15s;
}

.btn-text-clear:hover {
  color: var(--accent-rose);
}

.history-list {
  list-style: none;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 4px;
}

/* Custom Scrollbar for history */
.history-list::-webkit-scrollbar {
  width: 5px;
}

.history-list::-webkit-scrollbar-track {
  background: transparent;
}

.history-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}

.history-item {
  padding: 12px 14px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.15s ease;
}

.history-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
}

.history-expr {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.history-result {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--accent-amber);
}

.empty-history {
  color: var(--text-dim);
  text-align: center;
  padding: 30px 10px;
  font-size: 0.9rem;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .app-container {
    flex-direction: column;
  }
  .calculator-card {
    padding: 20px;
  }
  .btn {
    height: 54px;
    font-size: 1.15rem;
  }
  .current-display {
    font-size: 2.3rem;
  }
  .history-panel {
    max-height: 280px;
  }
}
`;

export const VANILLA_JS = `/**
 * ==============================================================================
 * AI Glassmorphism Calculator - Vanilla JavaScript
 * ==============================================================================
 * Features:
 *  1. State management & safe evaluation
 *  2. Division by zero protection
 *  3. Keyboard support (numbers, operators, enter, backspace, esc)
 *  4. Calculation history with localStorage persistence
 *  5. Web Speech API voice input + Natural Language Math Parser
 * ==============================================================================
 */

// Application State
let currentInput = '0';
let previousExpression = '';
let isNewCalculation = false;
let history = [];

// DOM Element References
const currentDisplay = document.getElementById('current-display');
const prevDisplay = document.getElementById('prev-operation');
const aiStatus = document.getElementById('ai-status');
const statusDot = document.getElementById('status-dot');
const historyList = document.getElementById('history-list');
const voiceBtn = document.getElementById('voice-btn');

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  loadHistory();
  updateDisplay();
  initVoiceRecognition();
});

/**
 * Updates the numbers shown on the calculator screen
 */
function updateDisplay() {
  currentDisplay.innerText = currentInput;
  prevDisplay.innerText = previousExpression;
}

/**
 * Updates the AI Assistant status indicator text & dot
 */
function setAIStatus(message, type = 'ready') {
  aiStatus.innerText = message;
  if (statusDot) {
    statusDot.className = 'status-dot';
    if (type === 'listening') statusDot.classList.add('listening');
  }
}

/**
 * Appends a numeric digit (0-9) to currentInput
 */
function appendNumber(num) {
  if (currentInput === '0' || isNewCalculation) {
    currentInput = num;
    isNewCalculation = false;
  } else {
    currentInput += num;
  }
  updateDisplay();
}

/**
 * Appends a decimal point, preventing duplicate dots in the active operand
 */
function appendDecimal() {
  if (isNewCalculation) {
    currentInput = '0.';
    isNewCalculation = false;
    updateDisplay();
    return;
  }

  // Find the current active number block after the last operator
  const parts = currentInput.split(/[-+*/%]/);
  const currentBlock = parts[parts.length - 1];

  if (!currentBlock.includes('.')) {
    currentInput += '.';
    updateDisplay();
  }
}

/**
 * Appends an arithmetic operator (+, -, *, /, %)
 */
function appendOperator(operator) {
  isNewCalculation = false;
  const lastChar = currentInput.slice(-1);

  // If the user presses an operator right after another operator, replace it
  if (['+', '-', '*', '/', '%'].includes(lastChar)) {
    currentInput = currentInput.slice(0, -1) + operator;
  } else {
    currentInput += operator;
  }
  updateDisplay();
}

/**
 * Toggles positive/negative sign of the active number
 */
function toggleSign() {
  try {
    if (currentInput === '0') return;
    if (currentInput.startsWith('-')) {
      currentInput = currentInput.slice(1);
    } else {
      currentInput = '-' + currentInput;
    }
    updateDisplay();
  } catch (e) {
    console.error('Sign toggle error', e);
  }
}

/**
 * Clears entire calculator display (All Clear)
 */
function clearDisplay() {
  currentInput = '0';
  previousExpression = '';
  isNewCalculation = false;
  setAIStatus('Memory cleared.', 'ready');
  updateDisplay();
}

/**
 * Deletes the last character (Backspace)
 */
function deleteLast() {
  if (isNewCalculation) {
    clearDisplay();
    return;
  }
  currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : '0';
  updateDisplay();
}

/**
 * Safely computes the mathematical expression
 * Checks for division by zero before evaluation!
 */
function calculate() {
  try {
    if (!currentInput || currentInput.trim() === '') return;

    // Check for explicit division by zero: e.g. /0 or /0.0
    if (/\\/\\s*0(?![0-9.])/.test(currentInput)) {
      throw new Error('Cannot divide by zero');
    }

    // Prepare expression for calculation
    let expr = currentInput;
    
    // Replace percentages (e.g. 50% -> (50/100))
    expr = expr.replace(/(\\d+(\\.\\d+)?)%/g, '($1/100)');

    // Whitelist check: allow only mathematical characters to prevent code injection
    if (!/^[0-9+\\-*/().%\\s]+$/.test(expr)) {
      throw new Error('Invalid characters');
    }

    // Evaluate using sandboxed Function constructor
    // eslint-disable-next-line no-new-func
    const result = Function('"use strict"; return (' + expr + ')')();

    if (!isFinite(result)) {
      throw new Error('Cannot divide by zero');
    }

    // Fix floating point precision artifacts (like 0.1 + 0.2)
    const formattedResult = Number(result.toPrecision(12)).toString();

    // Save to history
    addHistoryItem(currentInput, formattedResult);

    previousExpression = currentInput + ' =';
    currentInput = formattedResult;
    isNewCalculation = true;
    setAIStatus('Calculation successful!', 'ready');

    updateDisplay();
  } catch (error) {
    const errorMsg = error.message || 'Syntax Error';
    setAIStatus('Error: ' + errorMsg, 'error');
    currentInput = errorMsg.includes('divide by zero') ? 'Cannot divide by zero' : 'Error';
    isNewCalculation = true;
    updateDisplay();
  }
}

/**
 * LocalStorage History Management
 */
function loadHistory() {
  try {
    const stored = localStorage.getItem('ai_calculator_history');
    history = stored ? JSON.parse(stored) : [];
    renderHistoryUI();
  } catch (e) {
    history = [];
  }
}

function addHistoryItem(expression, result) {
  history.unshift({ expression, result, timestamp: Date.now() });
  if (history.length > 20) history.pop(); // Keep recent 20
  localStorage.setItem('ai_calculator_history', JSON.stringify(history));
  renderHistoryUI();
}

function renderHistoryUI() {
  if (!historyList) return;

  if (history.length === 0) {
    historyList.innerHTML = '<li class="empty-history">No calculations yet. Start calculating or speak!</li>';
    return;
  }

  historyList.innerHTML = history.map((item, index) => \`
    <li class="history-item" onclick="recallHistory(\${index})">
      <div class="history-expr">\${item.expression} =</div>
      <div class="history-result">\${item.result}</div>
    </li>
  \`).join('');
}

function recallHistory(index) {
  const item = history[index];
  if (item) {
    currentInput = item.result;
    previousExpression = item.expression;
    isNewCalculation = true;
    updateDisplay();
    setAIStatus(\`Recalled: \${item.result}\`);
  }
}

function clearHistory() {
  history = [];
  localStorage.removeItem('ai_calculator_history');
  renderHistoryUI();
  setAIStatus('History cleared.');
}

/**
 * Keyboard Event Support
 */
window.addEventListener('keydown', (e) => {
  // Numbers 0-9
  if (e.key >= '0' && e.key <= '9') {
    appendNumber(e.key);
  }
  // Decimal
  else if (e.key === '.') {
    appendDecimal();
  }
  // Operators
  else if (['+', '-', '*', '/'].includes(e.key)) {
    appendOperator(e.key);
  }
  else if (e.key === '%') {
    appendOperator('%');
  }
  // Calculate on Enter or '='
  else if (e.key === 'Enter' || e.key === '=') {
    e.preventDefault();
    calculate();
  }
  // Backspace to delete
  else if (e.key === 'Backspace') {
    deleteLast();
  }
  // Escape to All Clear
  else if (e.key === 'Escape') {
    clearDisplay();
  }
});

/**
 * AI-Powered Voice & Natural Language Math Feature (Web Speech API)
 */
function initVoiceRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    if (voiceBtn) {
      voiceBtn.title = "Voice recognition not supported on this browser";
      voiceBtn.style.opacity = '0.5';
    }
    setAIStatus('Voice recognition not supported in this browser.');
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  voiceBtn.addEventListener('click', () => {
    try {
      voiceBtn.classList.add('listening');
      setAIStatus('Listening... Speak a math problem!', 'listening');
      recognition.start();
    } catch (e) {
      voiceBtn.classList.remove('listening');
      setAIStatus('Microphone active or permission needed.');
    }
  });

  recognition.onresult = (event) => {
    voiceBtn.classList.remove('listening');
    const transcript = event.results[0][0].transcript.toLowerCase();
    setAIStatus(\`Heard: "\${transcript}"\`, 'ready');

    // Natural Language Math Parser
    parseSpokenMath(transcript);
  };

  recognition.onerror = (event) => {
    voiceBtn.classList.remove('listening');
    setAIStatus('Speech recognition error: ' + event.error, 'error');
  };

  recognition.onend = () => {
    voiceBtn.classList.remove('listening');
  };
}

/**
 * Translates verbal phrases like "25 times 4" or "10 percent of 80" into math
 */
function parseSpokenMath(text) {
  let mathExpr = text
    // Replace verbal operators
    .replace(/plus|and|add/g, '+')
    .replace(/minus|take away|subtract/g, '-')
    .replace(/times|multiplied by|multiply/g, '*')
    .replace(/divided by|divide by|over/g, '/')
    .replace(/modulo|mod/g, '%')
    .replace(/equals|equal to/g, '');

  // Handle percentages: "X percent of Y" -> (X/100)*Y
  const percentMatch = mathExpr.match(/(\\d+)\\s*(?:%|percent)\\s+of\\s+(\\d+)/);
  if (percentMatch) {
    mathExpr = \`(\${percentMatch[1]} / 100) * \${percentMatch[2]}\`;
  }

  // Remove non-mathematical words/characters
  const cleaned = mathExpr.replace(/[^0-9+\\-*/().%\\s]/g, '').trim();

  if (cleaned && /[0-9]/.test(cleaned)) {
    currentInput = cleaned.replace(/\\s+/g, '');
    updateDisplay();
    // Auto-calculate after 800ms
    setTimeout(() => {
      calculate();
    }, 800);
  } else {
    setAIStatus('Could not parse numbers from speech. Try again!');
  }
}
`;

export const SETUP_GUIDE_MARKDOWN = `### Step-by-Step Beginner Setup Guide

Follow these simple steps to run this calculator on your own computer without installing any tools or libraries:

#### 1. Create a Project Folder
Create a new folder on your computer named:
\`ai-calculator\`

#### 2. Create the Three Files
Inside your new \`ai-calculator\` folder, create three plain text files:
- **\`index.html\`** (The structure & buttons)
- **\`style.css\`** (The modern Glassmorphism visual design)
- **\`script.js\`** (The calculation logic, keyboard listeners & voice input)

#### 3. Copy and Paste the Code
Copy the provided code into each corresponding file and save:
- Paste the HTML code into \`index.html\`
- Paste the CSS code into \`style.css\`
- Paste the JavaScript code into \`script.js\`

#### 4. Open in Any Web Browser
Double-click \`index.html\` or right-click and choose **Open With > Google Chrome** (or Edge/Safari).
That's it! Your modern AI-powered glassmorphism calculator is live!

---

### Core Concepts Explained for Beginners

1. **Glassmorphism Styling**:
   Achieved using \`backdrop-filter: blur(24px)\` and semi-transparent RGBA backgrounds (\`rgba(255, 255, 255, 0.06)\`). This gives the frosted glass look with ambient background light.

2. **Handling Division by Zero**:
   Before calculating, we check the expression for \`/ 0\`. If detected, we throw an Error and display a friendly message (\`"Cannot divide by zero"\`) rather than crashing or returning \`Infinity\`.

3. **Web Speech API**:
   Uses browser native \`window.SpeechRecognition\` to listen for speech, and our natural language parser converts verbal phrases ("twenty-five times four") into mathematical operations (\`25 * 4\`).

4. **Keyboard Support**:
   A \`keydown\` event listener on the \`window\` checks \`e.key\` so you can use your physical keyboard's number pad, Enter, and Backspace keys naturally.

5. **LocalStorage Persistence**:
   Past calculations are saved in your browser's \`localStorage\` as JSON, so your history remains intact even if you reload the page.
`;
