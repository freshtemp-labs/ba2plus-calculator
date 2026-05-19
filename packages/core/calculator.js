// ===== Basic Calculator Operations =====
import { calc, fmt } from './index.js';

function compute(a, b, op) {
  switch(op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b !== 0 ? a / b : 'Error';
    default: return b;
  }
}

function doOp(op) {
  let cur = parseFloat(calc.buffer || calc.display);
  if (calc.prev !== null && calc.op) {
    calc.display = String(compute(calc.prev, cur, calc.op));
    calc.prev = parseFloat(calc.display);
  } else {
    calc.prev = cur;
  }
  calc.op = op; calc.buffer = ''; calc.newNumber = true;
  calc.label = op === '+' ? '+' : op === '-' ? '\u2212' : op === '*' ? '\u00d7' : '\u00f7';
}

function press(k) {
  switch (k) {
    case '0': case '1': case '2': case '3': case '4':
    case '5': case '6': case '7': case '8': case '9': case '.':
      if (calc.newNumber) { calc.buffer = ''; calc.newNumber = false; calc.label = ''; }
      if (k === '.' && calc.buffer.includes('.')) break;
      calc.buffer += k;
      calc.display = calc.buffer;
      break;
    case 'ADD': doOp('+'); break;
    case 'SUB': doOp('-'); break;
    case 'MUL': doOp('*'); break;
    case 'DIV': doOp('/'); break;
    case 'ENTER':
      if (calc.op && calc.prev !== null) {
        let cur = parseFloat(calc.buffer || calc.display);
        calc.display = String(compute(calc.prev, cur, calc.op));
        calc.prev = null; calc.op = null; calc.buffer = ''; calc.newNumber = true;
      }
      break;
    case 'BACK':
      if (calc.buffer.length > 0) { calc.buffer = calc.buffer.slice(0, -1); calc.display = calc.buffer || '0'; }
      break;
    case 'CLEAR': calc.buffer = ''; calc.display = '0'; calc.prev = null; calc.op = null; calc.newNumber = true; calc.label = ''; break;
    case 'QUIT': calc.display = '0'; calc.buffer = ''; calc.prev = null; calc.op = null; calc.newNumber = true; calc.label = ''; break;
    case 'NEG':
      if (calc.buffer.startsWith('-')) calc.buffer = calc.buffer.slice(1);
      else if (calc.buffer !== '0') calc.buffer = '-' + calc.buffer;
      calc.display = calc.buffer;
      break;
    case 'MEM': calc.memory = parseFloat(calc.buffer || '0'); calc.label = 'M\u2192'; break;
    case 'RCL': calc.display = String(calc.memory); calc.buffer = String(calc.memory); calc.newNumber = true; break;
    default: break;
  }
  updateDisplay();
}

function updateDisplay() {
  $('valueLine').textContent = calc.display;
  $('labelLine').textContent = calc.label || '\u00a0';
  $('subLine').textContent = '';
}

export { press, doOp, compute, updateDisplay };
