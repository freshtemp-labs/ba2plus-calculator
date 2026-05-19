// ===== Mode Switching =====
import { calc, $ } from './index.js';
import { updateDisplay } from './calculator.js';
import { updateTVMDisplay } from './tvm.js';
import { updateCFDisplay } from './cashflow.js';
import { updateBondDisplay } from './bond.js';
import { updateDeprDisplay } from './depr.js';
import { updateIconvDisplay } from './iconv.js';
import { updateDateDisplay } from './date.js';
import { updateStatDisplay } from './stats.js';

function switchMode(m) {
  calc.mode = m;
  document.querySelectorAll('.mode-tab').forEach(t => t.classList.toggle('active', t.dataset.mode === m));
  document.querySelectorAll('.keys').forEach(k => k.classList.toggle('active', k.id === 'keys-' + m));
  const modeNames = { basic: 'FIN', tvm: 'TVM', cashflow: 'CF', bond: 'BOND', depr: 'DEPR', iconv: 'ICONV', date: 'DATE', stat: 'STAT' };
  $('modeIndicator').textContent = modeNames[m] || 'FIN';
  if (m === 'basic') { calc.label = ''; updateDisplay(); }
  if (m === 'tvm') updateTVMDisplay();
  if (m === 'cashflow') updateCFDisplay();
  if (m === 'bond') updateBondDisplay();
  if (m === 'depr') updateDeprDisplay();
  if (m === 'iconv') updateIconvDisplay();
  if (m === 'date') updateDateDisplay();
  if (m === 'stat') updateStatDisplay();
}

function toggleShortcuts() {
  let p = $('shortcutPanel');
  if (p) {
    p.classList.toggle('visible');
    $('shortcutToggle').classList.toggle('active');
  }
}

export { switchMode, toggleShortcuts };
