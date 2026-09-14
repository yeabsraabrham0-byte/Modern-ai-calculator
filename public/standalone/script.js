let currentInput = '0';
let previousExpression = '';
let isNewCalculation = false;
let history = [];

const currentDisplay = document.getElementById('current-display');
const prevDisplay = document.getElementById('prev-operation');
const aiStatus = document.getElementById('ai-status');
const statusDot = document.getElementById('status-dot');
const historyList = document.getElementById('history-list');
const voiceBtn = document.getElementById('voice-btn');

window.addEventListener('DOMContentLoaded', () => {
  loadHistory();
  updateDisplay();
  initVoiceRecognition();
});

function updateDisplay() {
  currentDisplay.innerText = currentInput;
  prevDisplay.innerText = previousExpression;
}

function setAIStatus(msg, type = 'ready') {
  if (aiStatus) aiStatus.innerText = msg;
  if (statusDot) {
    statusDot.className = 'status-dot';
    if (type === 'listening') statusDot.classList.add('listening');
  }
}

function appendNumber(num) {
  if (currentInput === '0' || isNewCalculation) {
    currentInput = num;
    isNewCalculation = false;
  } else {
    currentInput += num;
  }
  updateDisplay();
}

function appendDecimal() {
  if (isNewCalculation) {
    currentInput = '0.';
    isNewCalculation = false;
    updateDisplay();
    return;
  }
  const parts = currentInput.split(/[-+*/%]/);
  const lastPart = parts[parts.length - 1];
  if (!lastPart.includes('.')) {
    currentInput += '.';
    updateDisplay();
  }
}

function appendOperator(op) {
  isNewCalculation = false;
  const lastChar = currentInput.slice(-1);
  if (['+', '-', '*', '/', '%'].includes(lastChar)) {
    currentInput = currentInput.slice(0, -1) + op;
  } else {
    currentInput += op;
  }
  updateDisplay();
}

function toggleSign() {
  if (currentInput === '0') return;
  if (currentInput.startsWith('-')) {
    currentInput = currentInput.slice(1);
  } else {
    currentInput = '-' + currentInput;
  }
  updateDisplay();
}

function clearDisplay() {
  currentInput = '0';
  previousExpression = '';
  isNewCalculation = false;
  setAIStatus('Memory cleared.');
  updateDisplay();
}

function deleteLast() {
  if (isNewCalculation) {
    clearDisplay();
    return;
  }
  currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : '0';
  updateDisplay();
}

function calculate() {
  try {
    if (!currentInput || !currentInput.trim()) return;

    if (/\/\s*0(?![0-9.])/.test(currentInput)) {
      throw new Error('Cannot divide by zero');
    }

    let expr = currentInput.replace(/(\d+(\.\d+)?)%/g, '($1/100)');
    if (!/^[0-9+\-*/().%\s]+$/.test(expr)) {
      throw new Error('Invalid characters');
    }

    // eslint-disable-next-line no-new-func
    const result = Function('"use strict"; return (' + expr + ')')();

    if (!isFinite(result)) {
      throw new Error('Cannot divide by zero');
    }

    const formattedResult = Number(result.toPrecision(12)).toString();
    addHistoryItem(currentInput, formattedResult);

    previousExpression = currentInput + ' =';
    currentInput = formattedResult;
    isNewCalculation = true;
    setAIStatus('Calculation successful!');
    updateDisplay();
  } catch (error) {
    const errorMsg = error.message || 'Syntax Error';
    setAIStatus('Error: ' + errorMsg, 'error');
    currentInput = errorMsg.includes('divide by zero') ? 'Cannot divide by zero' : 'Error';
    isNewCalculation = true;
    updateDisplay();
  }
}

function loadHistory() {
  try {
    const stored = localStorage.getItem('ai_calculator_history');
    history = stored ? JSON.parse(stored) : [];
    renderHistoryUI();
  } catch {
    history = [];
  }
}

function addHistoryItem(expression, result) {
  history.unshift({ expression, result, timestamp: Date.now() });
  if (history.length > 20) history.pop();
  localStorage.setItem('ai_calculator_history', JSON.stringify(history));
  renderHistoryUI();
}

function renderHistoryUI() {
  if (!historyList) return;
  if (history.length === 0) {
    historyList.innerHTML = '<li class="empty-history">No calculations yet.</li>';
    return;
  }
  historyList.innerHTML = history.map((item, index) => `
    <li class="history-item" onclick="recallHistory(${index})">
      <div class="history-expr">${item.expression} =</div>
      <div class="history-result">${item.result}</div>
    </li>
  `).join('');
}

function recallHistory(index) {
  const item = history[index];
  if (item) {
    currentInput = item.result;
    previousExpression = item.expression;
    isNewCalculation = true;
    updateDisplay();
    setAIStatus(`Recalled: ${item.result}`);
  }
}

function clearHistory() {
  history = [];
  localStorage.removeItem('ai_calculator_history');
  renderHistoryUI();
  setAIStatus('History cleared.');
}

window.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
  else if (e.key === '.') appendDecimal();
  else if (['+', '-', '*', '/'].includes(e.key)) appendOperator(e.key);
  else if (e.key === '%') appendOperator('%');
  else if (e.key === 'Enter' || e.key === '=') {
    e.preventDefault();
    calculate();
  }
  else if (e.key === 'Backspace') deleteLast();
  else if (e.key === 'Escape') clearDisplay();
});

function initVoiceRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    if (voiceBtn) voiceBtn.style.display = 'none';
    setAIStatus('Speech recognition not available.');
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';

  voiceBtn.addEventListener('click', () => {
    try {
      voiceBtn.classList.add('listening');
      setAIStatus('Listening... Speak a calculation!', 'listening');
      recognition.start();
    } catch {
      voiceBtn.classList.remove('listening');
    }
  });

  recognition.onresult = (event) => {
    voiceBtn.classList.remove('listening');
    const transcript = event.results[0][0].transcript.toLowerCase();
    setAIStatus(`Heard: "${transcript}"`);

    let mathExpr = transcript
      .replace(/plus|and|add/g, '+')
      .replace(/minus|subtract/g, '-')
      .replace(/times|multiplied by/g, '*')
      .replace(/divided by|divide by|over/g, '/')
      .replace(/modulo|mod/g, '%');

    const percentMatch = mathExpr.match(/(\d+)\s*(?:%|percent)\s+of\s+(\d+)/);
    if (percentMatch) {
      mathExpr = `(${percentMatch[1]} / 100) * ${percentMatch[2]}`;
    }

    const cleaned = mathExpr.replace(/[^0-9+\-*/().%\s]/g, '').trim();
    if (cleaned && /[0-9]/.test(cleaned)) {
      currentInput = cleaned.replace(/\s+/g, '');
      updateDisplay();
      setTimeout(calculate, 800);
    } else {
      setAIStatus('Could not understand. Try "25 times 4"');
    }
  };

  recognition.onerror = () => {
    voiceBtn.classList.remove('listening');
    setAIStatus('Speech error. Try again.');
  };
}
