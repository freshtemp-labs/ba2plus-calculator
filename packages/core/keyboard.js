// ===== Keyboard Shortcuts =====
import { calc } from './index.js';
import { press } from './calculator.js';
import { switchMode } from './mode.js';
import { pressTVM, updateTVMDisplay } from './tvm.js';
import { pressCF, updateCFDisplay } from './cashflow.js';
import { pressBond, updateBondDisplay } from './bond.js';
import { pressDepr, updateDeprDisplay } from './depr.js';
import { pressIconv, updateIconvDisplay } from './iconv.js';
import { pressDate, updateDateDisplay } from './date.js';
import { pressStat, updateStatDisplay } from './stats.js';

function initKeyboard() {
  document.addEventListener('keydown', function(e) {
    let key = e.key;
    if (/^[0-9]$/.test(key)) {
      e.preventDefault();
      if (calc.mode === 'basic') { press(key); return; }
      if (calc.mode === 'stat') { pressStat(key); return; }
      calc.buffer += key; calc.display = calc.buffer; calc.newNumber = false;
      if (calc.mode === 'tvm') updateTVMDisplay();
      return;
    }
    if (key === '.') {
      e.preventDefault();
      if (calc.mode === 'basic') { press('.'); return; }
      if (calc.mode === 'stat') { pressStat('.'); return; }
      if (!calc.buffer.includes('.')) calc.buffer += '.';
      calc.display = calc.buffer;
      return;
    }
    if (['+', '-', '*', '/'].includes(key)) {
      e.preventDefault();
      if (calc.mode === 'basic') press({'+':'ADD','-':'SUB','*':'MUL','/':'DIV'}[key]);
      return;
    }
    if (key === 'Enter' || key === '=') {
      e.preventDefault();
      if (calc.mode === 'basic') { press('ENTER'); return; }
      if (calc.mode === 'stat') { pressStat('ENTER'); return; }
      return;
    }
    if (key === 'Backspace') {
      e.preventDefault();
      if (calc.mode === 'basic') { press('BACK'); return; }
      if (calc.mode === 'stat') { pressStat('DEL'); return; }
      if (calc.buffer.length > 0) { calc.buffer = calc.buffer.slice(0, -1); calc.display = calc.buffer || '0'; }
      return;
    }
    if (key === 'Escape') {
      e.preventDefault();
      if (calc.mode === 'basic') press('CLEAR');
      else if (calc.mode === 'stat') pressStat('CLEAR');
      else switchMode('basic');
      return;
    }
    const mk = key.toLowerCase();
    if (mk === 'q') { e.preventDefault(); switchMode('basic'); return; }
    if (mk === 't') { e.preventDefault(); switchMode('tvm'); updateTVMDisplay(); return; }
    if (mk === 'c') { e.preventDefault(); switchMode('cashflow'); updateCFDisplay(); return; }
    if (mk === 'b') { e.preventDefault(); switchMode('bond'); updateBondDisplay(); return; }
    if (mk === 'd') { e.preventDefault(); switchMode('depr'); updateDeprDisplay(); return; }
    if (mk === 'i') { e.preventDefault(); switchMode('iconv'); updateIconvDisplay(); return; }
    if (mk === 'a') { e.preventDefault(); switchMode('date'); updateDateDisplay(); return; }
    if (mk === 's') { e.preventDefault(); switchMode('stat'); updateStatDisplay(); return; }
    // TVM variable entry (only in TVM mode)
    if (calc.mode === 'tvm') {
      const tvmVars = {n:'N', i:'IY', p:'PV', m:'PMT', f:'FV'};
      if (tvmVars[mk]) { e.preventDefault(); pressTVM(tvmVars[mk]); return; }
    }
    if (e.shiftKey && calc.mode === 'tvm') {
      const solve = {P:'SOLVE_PV',F:'SOLVE_FV',M:'SOLVE_PMT',R:'SOLVE_N',I:'SOLVE_IY'};
      if (solve[key]) { e.preventDefault(); pressTVM(solve[key]); return; }
    }
    if (key === 'n'||key==='N') { e.preventDefault(); if(calc.mode==='basic') press('NEG'); return; }
    if (key === 'g'||key==='G') { e.preventDefault(); if(calc.mode==='tvm') pressTVM('BGN_TOGGLE'); return; }
  });
}

export { initKeyboard };
