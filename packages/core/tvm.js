// ===== TVM (Time Value of Money) =====
import { calc, $, fmt } from './index.js';

const tvm = { N: 0, IY: 0, PV: 0, PMT: 0, FV: 0, bgn: false, pyr: 12 };

function tvmAdj() {
  let adjN = tvm.N * (tvm.pyr || 1);
  let adjI = tvm.IY / 100 / (tvm.pyr || 1);
  return { Np: adjN, ip: adjI };
}

function solveTVM(target) {
  let { Np, ip } = tvmAdj();
  let N = Np, i = ip;
  let { PV, PMT, FV } = tvm;
  let bgnAdj = tvm.bgn ? (1 + i) : 1;
  switch(target) {
    case 'PV':
      if (i === 0) return -(PMT * N + FV);
      let pvFactor = (1 - Math.pow(1 + i, -N)) / i;
      return -(PMT * pvFactor * bgnAdj + FV * Math.pow(1 + i, -N));
    case 'FV':
      if (i === 0) return -(PV + PMT * N);
      return -(PV * Math.pow(1 + i, N) + PMT * bgnAdj * (Math.pow(1 + i, N) - 1) / i);
    case 'PMT':
      if (i === 0) return -(PV + FV) / (N * bgnAdj);
      let pvif = (1 - Math.pow(1 + i, -N)) / i;
      return -(PV + FV * Math.pow(1 + i, -N)) / (pvif * bgnAdj);
    case 'N':
      if (i === 0) return -(PV + FV) / (PMT || 1);
      let num = PMT * bgnAdj * (1 + i) - FV * i;
      let den = PMT * bgnAdj * (1 + i) + PV * i;
      if (num / den <= 0) return NaN;
      return Math.log(num / den) / Math.log(1 + i);
    case 'IY': {
      let x = 0.05;
      let maxIter = 300;
      for (let iter = 0; iter < maxIter; iter++) {
        if (Math.abs(x) < 1e-15) {
          let f = PV + PMT * bgnAdj * N * (1 - (N-1)*x/2 + (N-1)*(N-2)*x*x/6) + FV * (1 - N*x + N*(N-1)*x*x/2);
          let fp = PMT * bgnAdj * (-N*(N-1)/2 + N*(N-1)*(N-2)*x/3) + FV * (-N + N*(N-1)*x);
          if (Math.abs(f) < 1e-10) return x / (tvm.pyr || 1) * 100;
          let dx = fp !== 0 ? -f / fp : 0.0001;
          x += dx;
        } else {
          let onePx = 1 + x;
          let onePxNegN = Math.pow(onePx, -N);
          let f = PV + PMT * bgnAdj * (1 - onePxNegN) / x + FV * onePxNegN;
          let fp = PMT * bgnAdj * (-N * onePxNegN * Math.log(onePx) / x - (1 - onePxNegN) / (x * x)) + FV * (-N) * onePxNegN / onePx;
          if (Math.abs(f) < 1e-10) return x / (tvm.pyr || 1) * 100;
          let dx = fp !== 0 ? -f / fp : 0.0001;
          x += dx;
        }
        if (x < -0.9999) x = -0.5;
        if (isNaN(x) || !isFinite(x)) return NaN;
      }
      return x / (tvm.pyr || 1) * 100;
    }
  }
}

function pressTVM(k) {
  let v = parseFloat(calc.buffer || calc.display);
  if (k === 'N') { tvm.N = isNaN(v) ? 0 : v; calc.buffer = ''; calc.newNumber = true; }
  else if (k === 'IY') { tvm.IY = isNaN(v) ? 0 : v; calc.buffer = ''; calc.newNumber = true; }
  else if (k === 'PV') { tvm.PV = isNaN(v) ? 0 : -v; calc.buffer = ''; calc.newNumber = true; }
  else if (k === 'PMT') { tvm.PMT = isNaN(v) ? 0 : v; calc.buffer = ''; calc.newNumber = true; }
  else if (k === 'FV') { tvm.FV = isNaN(v) ? 0 : v; calc.buffer = ''; calc.newNumber = true; }
  else if (k === 'CLR_TVM') { tvm.N=0; tvm.IY=0; tvm.PV=0; tvm.PMT=0; tvm.FV=0; calc.display='0'; }
  else if (k === 'BGN_TOGGLE') { tvm.bgn = !tvm.bgn; }
  else if (k === 'P_YR') { tvm.pyr = tvm.pyr === 12 ? 1 : 12; }
  else if (k === 'SOLVE_PV') { calc.display = fmt(solveTVM('PV')); }
  else if (k === 'SOLVE_FV') { calc.display = fmt(solveTVM('FV')); }
  else if (k === 'SOLVE_PMT') { calc.display = fmt(solveTVM('PMT')); }
  else if (k === 'SOLVE_N') { calc.display = fmt(solveTVM('N')); }
  else if (k === 'SOLVE_IY') { calc.display = fmt(solveTVM('IY')); }
  updateTVMDisplay();
}

function updateTVMDisplay() {
  let s = `N=${tvm.N}  I/Y=${tvm.IY}%  PV=${tvm.PV}  PMT=${tvm.PMT}  FV=${tvm.FV}`;
  $('labelLine').textContent = tvm.bgn ? 'TVM BGN' : 'TVM END';
  $('subLine').textContent = s;
  $('valueLine').textContent = calc.display;
  let bgnBtn = $('bgnBtn');
  if (bgnBtn) bgnBtn.innerHTML = tvm.bgn
    ? 'BGN <span style="font-size:9px">(\u671f\u521d)</span>'
    : 'END <span style="font-size:9px">(\u671f\u672b)</span>';
  let pyrBtn = $('pyrBtn');
  if (pyrBtn) pyrBtn.textContent = 'P/Y=' + tvm.pyr;
}

export { tvm, tvmAdj, solveTVM, pressTVM, updateTVMDisplay };
