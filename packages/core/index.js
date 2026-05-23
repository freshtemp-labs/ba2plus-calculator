// ===== Shared State & Utilities =====

const calc = {
  display: '0',
  buffer: '',
  memory: 0,
  op: null,
  prev: null,
  newNumber: true,
  mode: 'basic',
  label: ''
};

const $ = id => document.getElementById(id);

function fmt(n) {
  if (n === undefined || n === null) return 'Error';
  if (typeof n === 'string') return n;
  if (isNaN(n)) return 'Error';
  if (!isFinite(n)) return '∞';
  if (Math.abs(n) >= 1e15) return n.toExponential(6);
  if (Number.isInteger(n) && Math.abs(n) < 1e15) return String(n);
  if (Math.abs(n) >= 1e-8) return String(parseFloat(n.toFixed(8)));
  return n.toExponential(6);
}

function fmtDate(d) {
  if (!d) return '\u2014';
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

export { calc, $, fmt, fmtDate };
