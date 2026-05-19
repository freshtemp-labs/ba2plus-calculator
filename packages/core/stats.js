// ===== Statistics (1-VAR & 2-VAR) =====
import { calc, $, fmt } from './index.js';

const statState = { data: [], data2: [], buffer: '', newEntry: true, mode: '1VAR' };

function pressStat(k) {
  if (k === '1VAR') { statState.mode = '1VAR'; statState.data2 = []; }
  else if (k === '2VAR') { statState.mode = '2VAR'; }
  if (k >= '0' && k <= '9') {
    if (statState.newEntry) { statState.buffer = ''; statState.newEntry = false; }
    statState.buffer += k;
    calc.display = statState.buffer;
  } else if (k === '.') {
    if (statState.newEntry) { statState.buffer = '0.'; statState.newEntry = false; }
    else if (!statState.buffer.includes('.')) statState.buffer += '.';
    calc.display = statState.buffer;
  } else if (k === 'NEG') {
    if (statState.buffer.startsWith('-')) statState.buffer = statState.buffer.slice(1);
    else if (statState.buffer && statState.buffer !== '0') statState.buffer = '-' + statState.buffer;
    calc.display = statState.buffer;
  } else if (k === 'ENTER') {
    let v = parseFloat(statState.buffer || '0');
    if (!isNaN(v)) {
      if (statState.mode === '2VAR' && statState.data.length > statState.data2.length) {
        statState.data2.push(v);
      } else {
        statState.data.push(v);
      }
    }
    statState.newEntry = true; statState.buffer = '';
    calc.display = '\u2713 ' + v;
  } else if (k === 'DEL') {
    if (statState.data.length > 0) statState.data.pop();
    if (statState.data2.length > statState.data.length) statState.data2.pop();
    calc.display = 'deleted';
  } else if (k === 'CLEAR') {
    statState.data = []; statState.data2 = []; statState.buffer = ''; statState.newEntry = true; statState.mode = '1VAR';
    calc.display = '0';
  } else if (k === 'N') { calc.display = String(statState.data.length); }
  else if (k === 'MEAN') {
    if (statState.data.length === 0) { calc.display = '0'; }
    else { calc.display = fmt(statState.data.reduce((a,b)=>a+b,0) / statState.data.length); }
  } else if (k === 'STD') {
    if (statState.data.length < 1) { calc.display = '0'; }
    else {
      let mean = statState.data.reduce((a,b)=>a+b,0) / statState.data.length;
      let v = statState.data.reduce((a,b)=>a+(b-mean)**2,0) / statState.data.length;
      calc.display = fmt(Math.sqrt(v));
    }
  } else if (k === 'STD_S') {
    if (statState.data.length < 2) { calc.display = '0'; }
    else {
      let mean = statState.data.reduce((a,b)=>a+b,0) / statState.data.length;
      let v = statState.data.reduce((a,b)=>a+(b-mean)**2,0) / (statState.data.length - 1);
      calc.display = fmt(Math.sqrt(v));
    }
  } else if (k === 'VAR') {
    if (statState.data.length < 1) { calc.display = '0'; }
    else {
      let mean = statState.data.reduce((a,b)=>a+b,0) / statState.data.length;
      let v = statState.data.reduce((a,b)=>a+(b-mean)**2,0) / statState.data.length;
      calc.display = fmt(v);
    }
  } else if (k === 'VAR_S') {
    if (statState.data.length < 2) { calc.display = '0'; }
    else {
      let mean = statState.data.reduce((a,b)=>a+b,0) / statState.data.length;
      let v = statState.data.reduce((a,b)=>a+(b-mean)**2,0) / (statState.data.length - 1);
      calc.display = fmt(v);
    }
  } else if (k === 'SUM') { calc.display = fmt(statState.data.reduce((a,b)=>a+b,0)); }
  else if (k === 'SUMSQ') { calc.display = fmt(statState.data.reduce((a,b)=>a+b*b,0)); }
  else if (k === 'CORR') {
    let n = Math.min(statState.data.length, statState.data2.length);
    if (n < 2) { calc.display = '\u9700\u8981\u22652\u7ec4\u6570\u636e'; }
    else {
      let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
      for (let i = 0; i < n; i++) {
        let x = statState.data[i], y = statState.data2[i];
        sumX += x; sumY += y; sumXY += x*y; sumX2 += x*x; sumY2 += y*y;
      }
      let num = n * sumXY - sumX * sumY;
      let den = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
      calc.display = fmt(den !== 0 ? num / den : 0);
    }
  } else if (k === 'SLOPE') {
    let n = Math.min(statState.data.length, statState.data2.length);
    if (n < 2) { calc.display = '\u9700\u8981\u22652\u7ec4\u6570\u636e'; }
    else {
      let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
      for (let i = 0; i < n; i++) {
        let x = statState.data[i], y = statState.data2[i];
        sumX += x; sumY += y; sumXY += x*y; sumX2 += x*x;
      }
      let num = n * sumXY - sumX * sumY;
      let den = n * sumX2 - sumX * sumX;
      calc.display = fmt(den !== 0 ? num / den : 0);
    }
  } else if (k === 'INTERCEPT') {
    let n = Math.min(statState.data.length, statState.data2.length);
    if (n < 2) { calc.display = '\u9700\u8981\u22652\u7ec4\u6570\u636e'; }
    else {
      let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
      for (let i = 0; i < n; i++) {
        let x = statState.data[i], y = statState.data2[i];
        sumX += x; sumY += y; sumXY += x*y; sumX2 += x*x;
      }
      let slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      let intercept = (sumY - slope * sumX) / n;
      calc.display = fmt(intercept);
    }
  }
  updateStatDisplay();
}

function updateStatDisplay() {
  let modeLabel = statState.mode === '1VAR' ? '\u5355\u53d8\u91cf' : '\u53cc\u53d8\u91cf(X+Y)';
  let n = statState.data.length;
  let n2 = statState.data2.length;
  let sc = $('statCount');
  if (sc) sc.textContent = `${modeLabel}: ${n} \u70b9` + (n2 > 0 ? ` (Y:${n2})` : '');
  let sm = $('statMode');
  if (sm) sm.textContent = statState.mode;
  if (statState.mode === '1VAR') {
    let preview = statState.data.slice(-5).join(', ');
    $('labelLine').textContent = '\u7edf\u8ba1(1-VAR)';
    $('subLine').textContent = preview ? `[${preview}${statState.data.length > 5 ? '...' : ''}]` : '(\u8f93\u5165\u6570\u636e)';
  } else {
    let n3 = Math.min(n, n2);
    let pairs = [];
    for (let i = 0; i < Math.min(n3, 3); i++) pairs.push(`(${statState.data[i]},${statState.data2[i]})`);
    $('labelLine').textContent = '\u7edf\u8ba1(2-VAR)';
    $('subLine').textContent = pairs.length > 0 ? pairs.join(' ') + (n3 > 3 ? '...' : '') : '(\u8f93\u5165X, \u518d\u6309ENTER\u8f93\u5165Y)';
  }
  $('valueLine').textContent = calc.display;
}

export { statState, pressStat, updateStatDisplay };
