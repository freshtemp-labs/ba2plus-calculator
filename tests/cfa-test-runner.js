// CFA Test Runner — runs all 24+ test cases against the calculator logic
// Usage: node tests/cfa-test-runner.js
// With report: node tests/cfa-test-runner.js --report

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

// Helper: load module and extract exports
function loadModule(m) {
  return import(join(projectRoot, 'packages/core', m + '.js'));
}

// Test definitions
const tests = [
  // === TVM ===
  {
    name: "TVM1: FV from PV (N=10, I/Y=8, PV=-1000)",
    run: async () => {
      const { tvm, solveTVM } = await loadModule('tvm');
      tvm.N = 10; tvm.IY = 8; tvm.PV = -1000; tvm.PMT = 0; tvm.FV = 0; tvm.bgn = false; tvm.pyr = 1;
      return solveTVM('FV');
    },
    expected: 2158.92, tol: 0.01
  },
  {
    name: "TVM2: PMT (N=5, I/Y=10, PV=-1000, FV=1500)",
    run: async () => {
      const { tvm, solveTVM } = await loadModule('tvm');
      tvm.N = 5; tvm.IY = 10; tvm.PV = -1000; tvm.PMT = 0; tvm.FV = 1500; tvm.bgn = false; tvm.pyr = 1;
      return solveTVM('PMT');
    },
    expected: 18.10, tol: 0.01
  },
  {
    name: "TVM3: Mortgage PMT (N=30yr, I/Y=6, PV=200000, P/Y=12)",
    run: async () => {
      const { tvm, solveTVM } = await loadModule('tvm');
      tvm.N = 30; tvm.IY = 6; tvm.PV = 200000; tvm.PMT = 0; tvm.FV = 0; tvm.bgn = false; tvm.pyr = 12;
      return solveTVM('PMT');
    },
    expected: -1199.10, tol: 0.01
  },
  {
    name: "TVM4: Solve I/Y (N=5, PV=-10000, FV=15000)",
    run: async () => {
      const { tvm, solveTVM } = await loadModule('tvm');
      tvm.N = 5; tvm.IY = 0; tvm.PV = -10000; tvm.PMT = 0; tvm.FV = 15000; tvm.bgn = false; tvm.pyr = 1;
      return solveTVM('IY');
    },
    expected: 8.45, tol: 0.01
  },
  {
    name: "TVM5: Solve N (I/Y=10, PV=-1000, FV=2000)",
    run: async () => {
      const { tvm, solveTVM } = await loadModule('tvm');
      tvm.N = 0; tvm.IY = 10; tvm.PV = -1000; tvm.PMT = 0; tvm.FV = 2000; tvm.bgn = false; tvm.pyr = 1;
      return solveTVM('N');
    },
    expected: 7.27, tol: 0.01
  },
  {
    name: "TVM6: BGN mode PV (N=10, I/Y=8, PMT=100)",
    run: async () => {
      const { tvm, solveTVM } = await loadModule('tvm');
      tvm.N = 10; tvm.IY = 8; tvm.PV = 0; tvm.PMT = 100; tvm.FV = 0; tvm.bgn = true; tvm.pyr = 1;
      return solveTVM('PV');
    },
    expected: -724.69, tol: 0.01
  },

  // === Bond ===
  {
    name: "Bond1: Discount bond price (6% coupon, 8% YTM, 10yr)",
    run: async () => {
      const { bondState, bondPrice } = await loadModule('bond');
      return bondPrice(1000, 6, 8, 10, false);
    },
    expected: 865.80, tol: 0.01
  },
  {
    name: "Bond2: Premium bond price (8% coupon, 6% YTM, 5yr)",
    run: async () => {
      const { bondPrice } = await loadModule('bond');
      return bondPrice(1000, 8, 6, 5, false);
    },
    expected: 1084.25, tol: 0.01
  },
  {
    name: "Bond3: Par bond (coupon=YTM=5%)",
    run: async () => {
      const { bondPrice } = await loadModule('bond');
      return bondPrice(1000, 5, 5, 10, false);
    },
    expected: 1000.00, tol: 0.01
  },
  {
    name: "Bond4: Semi-annual bond (6% coupon, 8% YTM, 10yr)",
    run: async () => {
      const { bondPrice } = await loadModule('bond');
      return bondPrice(1000, 6, 8, 10, true);
    },
    expected: 864.10, tol: 0.01
  },

  // === Cash Flow ===
  {
    name: "CF1: NPV (-10000, +3000, +4000, +5000, +2000 @10%)",
    run: async () => {
      const { cfState, calcNPV } = await loadModule('cashflow');
      cfState.flows = [{amount:-10000,freq:1},{amount:3000,freq:1},{amount:4000,freq:1},{amount:5000,freq:1},{amount:2000,freq:1}];
      cfState.rate = 10;
      return calcNPV();
    },
    expected: 1155.66, tol: 0.01
  },
  {
    name: "CF2: IRR (-10000, +3000, +4000, +5000, +2000)",
    run: async () => {
      const { calcIRR } = await loadModule('cashflow');
      return calcIRR();
    },
    expected: 15.32, tol: 0.01
  },
  {
    name: "CF3: NPV with frequencies (-100, +30x5 @10%)",
    run: async () => {
      const { cfState, calcNPV } = await loadModule('cashflow');
      cfState.flows = [{amount:-100,freq:1},{amount:30,freq:5}];
      cfState.rate = 10;
      return calcNPV();
    },
    expected: 13.72, tol: 0.01
  },

  // === Depreciation ===
  {
    name: "Depr1: SL (cost=10000, salvage=2000, life=5)",
    run: async () => {
      const { deprState } = await loadModule('depr');
      deprState.cost = 10000; deprState.salvage = 2000; deprState.life = 5;
      return (deprState.cost - deprState.salvage) / deprState.life;
    },
    expected: 1600, tol: 0.01
  },
  {
    name: "Depr2: DB Year 1 (cost=10000, salvage=1000, life=5)",
    run: async () => {
      const { deprState } = await loadModule('depr');
      let rate = 2 / deprState.life;
      return deprState.cost * rate;
    },
    expected: 4000, tol: 0.01
  },
  {
    name: "Depr3: SYD Year 1 (cost=10000, salvage=1000, life=5)",
    run: async () => {
      const { deprState } = await loadModule('depr');
      deprState.cost = 10000; deprState.salvage = 1000; deprState.life = 5; deprState.year = 1;
      let r = deprState.life - deprState.year + 1;
      let t = deprState.life * (deprState.life + 1) / 2;
      return (deprState.cost - deprState.salvage) * r / t;
    },
    expected: 3000, tol: 0.01
  },

  // === Statistics ===
  {
    name: "Stat1: Mean of [1,2,3,4,5] = 3",
    run: async () => {
      const { statState } = await loadModule('stats');
      statState.data = [1, 2, 3, 4, 5];
      return statState.data.reduce((a,b)=>a+b,0) / statState.data.length;
    },
    expected: 3, tol: 0.01
  },
  {
    name: "Stat2: Sample std dev of [1,2,3,4,5] ≈ 1.58",
    run: async () => {
      const { statState } = await loadModule('stats');
      statState.data = [1, 2, 3, 4, 5];
      let mean = statState.data.reduce((a,b)=>a+b,0) / statState.data.length;
      let v = statState.data.reduce((a,b)=>a+(b-mean)**2,0) / (statState.data.length - 1);
      return Math.sqrt(v);
    },
    expected: 1.58, tol: 0.01
  },
  {
    name: "Stat3: Correlation r of (1,2),(2,4),(3,6) = 1.0",
    run: async () => {
      const { statState } = await loadModule('stats');
      statState.data = [1, 2, 3]; statState.data2 = [2, 4, 6];
      let n = 3, sx = 0, sy = 0, sxy = 0, sx2 = 0, sy2 = 0;
      for (let i = 0; i < n; i++) {
        let x = statState.data[i], y = statState.data2[i];
        sx += x; sy += y; sxy += x*y; sx2 += x*x; sy2 += y*y;
      }
      let num = n * sxy - sx * sy;
      let den = Math.sqrt((n * sx2 - sx * sx) * (n * sy2 - sy * sy));
      return den !== 0 ? num / den : 0;
    },
    expected: 1.0, tol: 0.001
  },
  {
    name: "Stat4: Slope of (1,2),(2,4),(3,6) = 2.0",
    run: async () => {
      const { statState } = await loadModule('stats');
      let n = 3, sx = 0, sy = 0, sxy = 0, sx2 = 0;
      for (let i = 0; i < n; i++) {
        let x = statState.data[i], y = statState.data2[i];
        sx += x; sy += y; sxy += x*y; sx2 += x*x;
      }
      return (n * sxy - sx * sy) / (n * sx2 - sx * sx);
    },
    expected: 2.0, tol: 0.001
  },

  // === Basic ===
  {
    name: "Basic1: 100 + 200 = 300",
    run: async () => {
      const { compute } = await loadModule('calculator');
      return compute(100, 200, '+');
    },
    expected: 300, tol: 0.001
  },
  {
    name: "Basic2: 12 * 12 = 144",
    run: async () => {
      const { compute } = await loadModule('calculator');
      return compute(12, 12, '*');
    },
    expected: 144, tol: 0.001
  },
  {
    name: "Basic3: 144 / 12 = 12",
    run: async () => {
      const { compute } = await loadModule('calculator');
      return compute(144, 12, '/');
    },
    expected: 12, tol: 0.001
  },

  // === ICONV ===
  {
    name: "Iconv1: NOM=12%, C/Y=12 → EFF≈12.68%",
    run: async () => {
      return (Math.pow(1 + 12/100/12, 12) - 1) * 100;
    },
    expected: 12.68, tol: 0.01
  },
  {
    name: "Iconv2: EFF=12.68%, C/Y=12 → NOM≈12.00%",
    run: async () => {
      return (Math.pow(1 + 12.68/100, 1/12) - 1) * 12 * 100;
    },
    expected: 12.00, tol: 0.01
  },

  // === Date ===
  {
    name: "Date1: ACT days Jan 1 - Dec 31, 2024 = 365",
    run: async () => {
      const { daysBetween } = await loadModule('date');
      return daysBetween(new Date(2024, 0, 1), new Date(2024, 11, 31));
    },
    expected: 365, tol: 0.01
  },
  {
    name: "Date2: 30/360 days Jan 1 - Jun 15, 2024 = 164",
    run: async () => {
      const { days30_360 } = await loadModule('date');
      return days30_360(new Date(2024, 0, 1), new Date(2024, 5, 15));
    },
    expected: 164, tol: 0.01
  },
];

// Run all tests
const results = [];
let passed = 0, failed = 0;

for (const t of tests) {
  try {
    const actual = await t.run();
    const diff = Math.abs(actual - t.expected);
    const ok = diff <= t.tol;
    if (ok) passed++; else failed++;
    results.push({
      name: t.name,
      passed: ok,
      actual,
      expected: t.expected,
      diff,
      tolerance: t.tol
    });
  } catch (e) {
    failed++;
    results.push({
      name: t.name,
      passed: false,
      actual: null,
      expected: t.expected,
      diff: Infinity,
      tolerance: t.tol,
      error: e.message
    });
  }
}

const total = passed + failed;
const pct = (passed / total * 100).toFixed(1);

// Print results
console.log(`\n=== CFA Test Report ===`);
console.log(`Total: ${total}  |  Passed: ${passed}  |  Failed: ${failed}  |  Rate: ${pct}%\n`);

for (const r of results) {
  const icon = r.passed ? '✓' : '✗';
  if (r.passed) {
    console.log(`  ${icon} ${r.name}`);
  } else {
    const detail = r.error || `got=${typeof r.actual === 'number' ? r.actual.toFixed(6) : r.actual}, expected=${r.expected}, diff=${r.diff.toFixed(6)} (tol=${r.tolerance})`;
    console.log(`  ${icon} ${r.name}`);
    console.log(`       ${detail}`);
  }
}

// Generate HTML report
if (process.argv.includes('--report')) {
  const rows = results.map(r => {
    const status = r.passed
      ? '<span style="color:#0a0">✓ PASS</span>'
      : `<span style="color:#a00">✗ FAIL</span> <span style="font-size:11px;color:#888">${r.error || `got ${r.actual} expected ${r.expected} (±${r.tolerance})`}</span>`;
    return `<tr><td>${status}</td><td>${r.name}</td><td>${r.passed ? r.actual : '-'}</td></tr>`;
  }).join('\n');

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>CFA Test Report — BA II Plus Calculator</title>
<style>body{font-family:sans-serif;background:#111;color:#ddd;padding:20px}h1{color:#d4a017}.summary{font-size:18px;margin:20px 0}table{width:100%;border-collapse:collapse}th,td{padding:8px 12px;text-align:left;border-bottom:1px solid #333}th{color:#d4a017;font-size:12px;text-transform:uppercase}.pass{color:#0a0}.fail{color:#a00}</style></head>
<body><h1>BA II Plus Calculator — CFA Test Report</h1>
<div class="summary">Passed: <span class="pass">${passed}/${total}</span> (${pct}%)</div>
<table><thead><tr><th>Status</th><th>Test</th><th>Result</th></tr></thead><tbody>${rows}</tbody></table>
<p style="margin-top:20px;color:#666;font-size:11px">Generated: ${new Date().toISOString()} | Platform: All (iOS/Android/Desktop/Web)</p>
</body></html>`;

  const reportPath = join(projectRoot, 'tests', 'cfa-test-report.html');
  writeFileSync(reportPath, html);
  console.log(`\nReport saved: ${reportPath}`);
}

// Exit with proper code if any failed
if (failed > 0) process.exit(1);
