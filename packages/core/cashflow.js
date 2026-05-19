// ===== Cash Flow (NPV/IRR) =====
import { calc, $, fmt } from './index.js';

const cfState = { flows: [], rate: 10 };

function calcNPV() {
  let r = cfState.rate / 100;
  let npv = 0, period = 0;
  for (let i = 0; i < cfState.flows.length; i++) {
    let f = cfState.flows[i];
    let amt = f ? f.amount : 0;
    let cnt = f ? (f.freq || 1) : 1;
    for (let j = 0; j < cnt; j++) {
      npv += amt / Math.pow(1 + r, period);
      period++;
    }
  }
  return npv;
}

function calcIRR() {
  let x = 0.1;
  for (let iter = 0; iter < 300; iter++) {
    let f = 0, fp = 0, period = 0;
    for (let i = 0; i < cfState.flows.length; i++) {
      let f2 = cfState.flows[i];
      let amt = f2 ? f2.amount : 0;
      let cnt = f2 ? (f2.freq || 1) : 1;
      for (let j = 0; j < cnt; j++) {
        f += amt / Math.pow(1 + x, period);
        fp += -period * amt / Math.pow(1 + x, period + 1);
        period++;
      }
    }
    if (Math.abs(f) < 1e-10) return x * 100;
    if (fp === 0) break;
    x -= f / fp;
    if (x < -0.999) x = -0.5;
    if (x > 9.99) x = 10;
    if (isNaN(x) || !isFinite(x)) return NaN;
  }
  return x * 100;
}

function pressCF(k) {
  let v = parseFloat(calc.buffer || '0');
  if (k === 'CF0') {
    if (cfState.flows.length === 0) cfState.flows[0] = { amount: isNaN(v) ? 0 : v, freq: 1 };
    else cfState.flows[0].amount = isNaN(v) ? 0 : v;
    calc.buffer = ''; calc.newNumber = true;
  } else if (k === 'CF') {
    cfState.flows.push({ amount: isNaN(v) ? 0 : v, freq: 1 });
    calc.buffer = ''; calc.newNumber = true;
  } else if (k === 'FREQ') {
    if (cfState.flows.length > 1) {
      let last = cfState.flows[cfState.flows.length - 1];
      last.freq = Math.max(1, Math.floor(isNaN(v) ? 1 : v));
      calc.display = 'F' + (cfState.flows.length - 1) + '=' + last.freq;
      calc.buffer = ''; calc.newNumber = true;
    }
  } else if (k === 'CLEAR') { cfState.flows = []; cfState.rate = 10; }
  else if (k === 'NPV') { calc.display = fmt(calcNPV()); }
  else if (k === 'IRR') { calc.display = fmt(calcIRR()); }
  else if (k === 'DELETE') {
    if (cfState.flows.length > 1) cfState.flows.pop();
  }
  updateCFDisplay();
}

function updateCFDisplay() {
  let n = cfState.flows.length;
  let cfCount = $('cfCount');
  if (cfCount) cfCount.textContent = n > 0 ? n + ' \u884c' : '0 \u884c';
  let cfRate = $('cfRate');
  if (cfRate) cfRate.textContent = cfState.rate;
  let totalPeriods = 0;
  cfState.flows.forEach(f => totalPeriods += (f ? f.freq || 1 : 0));
  let cfTotalPeriods = $('cfTotalPeriods');
  if (cfTotalPeriods) cfTotalPeriods.textContent = totalPeriods;
  let cfLines = cfState.flows.map((f, i) => {
    if (!f) return `CF${i}=0`;
    let s = `CF${i}=${f.amount}`;
    if (i > 0 && f.freq > 1) s += `(\u00d7${f.freq})`;
    return s;
  });
  $('labelLine').textContent = '\u73b0\u91d1\u6d41';
  $('subLine').textContent = (cfLines.join('  ') || '(\u65e0\u6570\u636e)') + `  | ${totalPeriods} \u671f`;
  $('valueLine').textContent = calc.display;
}

export { cfState, calcNPV, calcIRR, pressCF, updateCFDisplay };
