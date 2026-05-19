// ===== Depreciation =====
import { calc, $, fmt } from './index.js';

const deprState = { cost: 10000, salvage: 1000, life: 5, year: 1 };

function pressDepr(k) {
  let v = parseFloat(calc.buffer || '0');
  if (k === 'COST') { deprState.cost = isNaN(v) ? 10000 : v; calc.buffer = ''; calc.newNumber = true; }
  else if (k === 'SALV') { deprState.salvage = isNaN(v) ? 1000 : v; calc.buffer = ''; calc.newNumber = true; }
  else if (k === 'LIFE') { deprState.life = isNaN(v) ? 5 : v; calc.buffer = ''; calc.newNumber = true; }
  else if (k === 'YEAR') { deprState.year = isNaN(v) ? 1 : v; calc.buffer = ''; calc.newNumber = true; }
  else if (k === 'SL') {
    let d = (deprState.cost - deprState.salvage) / deprState.life;
    calc.display = fmt(d);
  }
  else if (k === 'SYD') {
    let { cost, salvage, life, year } = deprState;
    let remaining = life - year + 1;
    let totalSYD = life * (life + 1) / 2;
    let d = (cost - salvage) * remaining / totalSYD;
    calc.display = fmt(d);
  }
  else if (k === 'DB') {
    let { cost, salvage, life, year } = deprState;
    let rate = 2 / life;
    let book = cost;
    for (let y = 1; y < year; y++) book -= book * rate;
    let d = book * rate;
    let maxD = book - salvage;
    if (d > maxD) d = maxD;
    if (d < 0) d = 0;
    calc.display = fmt(d);
  }
  else if (k === 'CLEAR') { Object.assign(deprState, {cost:10000, salvage:1000, life:5, year:1}); }
  updateDeprDisplay();
}

function updateDeprDisplay() {
  let d = deprState;
  $('labelLine').textContent = '\u6298\u65e7';
  $('subLine').textContent = `\u6210\u672c=${d.cost}  \u6b8b\u503c=${d.salvage}  \u5e74\u9650=${d.life}  \u7b2c${d.year}\u5e74`;
  $('valueLine').textContent = calc.display;
}

export { deprState, pressDepr, updateDeprDisplay };
