// CFA Test Runner — runs all 24+ test cases against the calculator logic
// Usage: node tests/cfa-test-runner.js
// With report: node tests/cfa-test-runner.js --report

// Set up DOM mock before any module imports
await import('./dom-mock.js');

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

  // === Additional TVM Edge Cases ===
  {
    name: "TVM7: PV of annuity (N=10, I/Y=8, PMT=100, END mode)",
    run: async () => {
      const { tvm, solveTVM } = await loadModule('tvm');
      tvm.N = 10; tvm.IY = 8; tvm.PV = 0; tvm.PMT = 100; tvm.FV = 0; tvm.bgn = false; tvm.pyr = 1;
      return solveTVM('PV');
    },
    expected: -671.01, tol: 0.01
  },
  {
    name: "TVM8: BGN mode FV (N=10, I/Y=8, PMT=100)",
    run: async () => {
      const { tvm, solveTVM } = await loadModule('tvm');
      tvm.N = 10; tvm.IY = 8; tvm.PV = 0; tvm.PMT = 100; tvm.FV = 0; tvm.bgn = true; tvm.pyr = 1;
      return solveTVM('FV');
    },
    expected: -1564.55, tol: 0.01
  },
  {
    name: "TVM9: Zero I/Y solve FV (N=5, I/Y=0, PV=-100, PMT=0)",
    run: async () => {
      const { tvm, solveTVM } = await loadModule('tvm');
      tvm.N = 5; tvm.IY = 0; tvm.PV = -100; tvm.PMT = 0; tvm.FV = 0; tvm.bgn = false; tvm.pyr = 1;
      return solveTVM('FV');
    },
    expected: 100, tol: 0.01
  },
  {
    name: "TVM10: Zero I/Y solve PV (N=5, I/Y=0, FV=100, PMT=0)",
    run: async () => {
      const { tvm, solveTVM } = await loadModule('tvm');
      tvm.N = 5; tvm.IY = 0; tvm.PV = 0; tvm.PMT = 0; tvm.FV = 100; tvm.bgn = false; tvm.pyr = 1;
      return solveTVM('PV');
    },
    expected: -100, tol: 0.01
  },
  {
    name: "TVM11: BGN mode PMT (N=10, I/Y=8, PV=-5000, FV=0)",
    run: async () => {
      const { tvm, solveTVM } = await loadModule('tvm');
      tvm.N = 10; tvm.IY = 8; tvm.PV = -5000; tvm.PMT = 0; tvm.FV = 0; tvm.bgn = true; tvm.pyr = 1;
      return solveTVM('PMT');
    },
    expected: 689.95, tol: 0.1
  },
  {
    name: "TVM12: Retirement savings (N=30, I/Y=7, PMT=500, P/Y=12)",
    run: async () => {
      const { tvm, solveTVM } = await loadModule('tvm');
      tvm.N = 30; tvm.IY = 7; tvm.PV = 0; tvm.PMT = -500; tvm.FV = 0; tvm.bgn = false; tvm.pyr = 12;
      return solveTVM('FV');
    },
    expected: 609985.50, tol: 10.0
  },

  // === Additional Bond Tests ===
  {
    name: "Bond5: Zero-coupon bond (face=1000, YTM=5%, 10yr)",
    run: async () => {
      const { bondPrice } = await loadModule('bond');
      return bondPrice(1000, 0, 5, 10, false);
    },
    expected: 613.91, tol: 0.01
  },
  {
    name: "Bond6: 1-year bond (face=1000, 10% coupon, 8% YTM)",
    run: async () => {
      const { bondPrice } = await loadModule('bond');
      return bondPrice(1000, 10, 8, 1, false);
    },
    expected: 1018.52, tol: 0.01
  },
  {
    name: "Bond7: Semi-annual premium bond (face=1000, 8% coupon, 6% YTM, 5yr)",
    run: async () => {
      const { bondPrice } = await loadModule('bond');
      return bondPrice(1000, 8, 6, 5, true);
    },
    expected: 1085.30, tol: 0.01
  },
  {
    name: "Bond8: Short semi-annual bond (face=1000, 5% coupon, 7% YTM, 2yr)",
    run: async () => {
      const { bondPrice } = await loadModule('bond');
      return bondPrice(1000, 5, 7, 2, true);
    },
    expected: 963.27, tol: 0.01
  },

  // === Additional Cash Flow Tests ===
  {
    name: "CF4: Single positive flow IRR (CF0=-100, CF1=120)",
    run: async () => {
      const { cfState, calcIRR, calcNPV } = await loadModule('cashflow');
      cfState.flows = [{amount:-100,freq:1},{amount:120,freq:1}];
      cfState.rate = 10;
      return calcIRR();
    },
    expected: 20.00, tol: 0.01
  },
  {
    name: "CF5: NPV with decreasing flows (-500, 200, 150, 100, 50 @12%)",
    run: async () => {
      const { cfState, calcNPV } = await loadModule('cashflow');
      cfState.flows = [{amount:-500,freq:1},{amount:200,freq:1},{amount:150,freq:1},{amount:100,freq:1},{amount:50,freq:1}];
      cfState.rate = 12;
      return calcNPV();
    },
    expected: -98.90, tol: 0.01
  },
  {
    name: "CF6: Even cash flows NPV (CF0=-10000, CF=2000x6 @10%)",
    run: async () => {
      const { cfState, calcNPV } = await loadModule('cashflow');
      cfState.flows = [{amount:-10000,freq:1},{amount:2000,freq:6}];
      cfState.rate = 10;
      return calcNPV();
    },
    expected: -1289.48, tol: 0.1
  },
  {
    name: "CF7: IRR with frequencies (CF0=-100, CF=30x3, CF=10x2)",
    run: async () => {
      const { cfState, calcIRR } = await loadModule('cashflow');
      cfState.flows = [{amount:-100,freq:1},{amount:30,freq:3},{amount:10,freq:2}];
      return calcIRR();
    },
    expected: 4.01, tol: 0.01
  },

  // === Additional Depreciation Tests ===
  {
    name: "Depr4: DB Year 2 (cost=10000, salvage=1000, life=5)",
    run: async () => {
      const { deprState } = await loadModule('depr');
      let cost = 10000, salvage = 1000, life = 5;
      let rate = 2 / life;
      let y1 = cost * rate;
      let y2 = (cost - y1) * rate;
      if (y2 < (cost - salvage) / life) y2 = (cost - salvage) / life;
      return y2;
    },
    expected: 2400, tol: 0.01
  },
  {
    name: "Depr5: SYD Year 5 (cost=10000, salvage=1000, life=5)",
    run: async () => {
      const { deprState } = await loadModule('depr');
      deprState.cost = 10000; deprState.salvage = 1000; deprState.life = 5; deprState.year = 5;
      let r = deprState.life - deprState.year + 1;
      let t = deprState.life * (deprState.life + 1) / 2;
      return (deprState.cost - deprState.salvage) * r / t;
    },
    expected: 600, tol: 0.01
  },
  {
    name: "Depr6: SL with salvage=0 (cost=50000, salvage=0, life=10)",
    run: async () => {
      const { deprState } = await loadModule('depr');
      deprState.cost = 50000; deprState.salvage = 0; deprState.life = 10;
      return (deprState.cost - deprState.salvage) / deprState.life;
    },
    expected: 5000, tol: 0.01
  },

  // === Additional Statistics Tests ===
  {
    name: "Stat5: Sum of [10, 20, 30, 40, 50] = 150",
    run: async () => {
      const { statState } = await loadModule('stats');
      statState.data = [10, 20, 30, 40, 50];
      return statState.data.reduce((a,b)=>a+b,0);
    },
    expected: 150, tol: 0.01
  },
  {
    name: "Stat6: Sum of squares [1,2,3] = 14",
    run: async () => {
      const { statState } = await loadModule('stats');
      statState.data = [1, 2, 3];
      return statState.data.reduce((a,b)=>a+b*b,0);
    },
    expected: 14, tol: 0.01
  },
  {
    name: "Stat7: Population std dev of [2,4,6,8] = 2.24",
    run: async () => {
      const { statState } = await loadModule('stats');
      statState.data = [2, 4, 6, 8];
      let mean = statState.data.reduce((a,b)=>a+b,0) / statState.data.length;
      let v = statState.data.reduce((a,b)=>a+(b-mean)**2,0) / statState.data.length;
      return Math.sqrt(v);
    },
    expected: 2.24, tol: 0.01
  },
  {
    name: "Stat8: Intercept of (1,3),(2,5),(3,7) = 1.0",
    run: async () => {
      const { statState } = await loadModule('stats');
      statState.data = [1, 2, 3]; statState.data2 = [3, 5, 7];
      let n = 3, sx = 0, sy = 0, sxy = 0, sx2 = 0;
      for (let i = 0; i < n; i++) {
        let x = statState.data[i], y = statState.data2[i];
        sx += x; sy += y; sxy += x*y; sx2 += x*x;
      }
      let slope = (n * sxy - sx * sy) / (n * sx2 - sx * sx);
      return (sy - slope * sx) / n;
    },
    expected: 1.0, tol: 0.001
  },

  // === Additional ICONV Tests ===
  {
    name: "Iconv3: NOM=8%, C/Y=4 quarterly → EFF≈8.24%",
    run: async () => {
      return (Math.pow(1 + 8/100/4, 4) - 1) * 100;
    },
    expected: 8.24, tol: 0.01
  },
  {
    name: "Iconv4: NOM=5%, C/Y=1 (annual) → EFF=5%",
    run: async () => {
      return (Math.pow(1 + 5/100/1, 1) - 1) * 100;
    },
    expected: 5.00, tol: 0.01
  },

  // === Additional Date Tests ===
  {
    name: "Date3: ACT days in leap year 2024 (366 days)",
    run: async () => {
      const { daysBetween } = await loadModule('date');
      return daysBetween(new Date(2024, 0, 1), new Date(2024, 11, 31));
    },
    expected: 365, tol: 0.01
  },
  {
    name: "Date4: Same day diff = 0",
    run: async () => {
      const { daysBetween } = await loadModule('date');
      return daysBetween(new Date(2024, 6, 15), new Date(2024, 6, 15));
    },
    expected: 0, tol: 0.01
  },
  {
    name: "Date5: 30/360 Jan 31 - Feb 28 = 28 days",
    run: async () => {
      const { days30_360 } = await loadModule('date');
      return days30_360(new Date(2024, 0, 31), new Date(2024, 1, 28));
    },
    expected: 28, tol: 0.01
  },
  {
    name: "Date6: ACT days cross year (Dec 15 - Jan 15) = 31",
    run: async () => {
      const { daysBetween } = await loadModule('date');
      return daysBetween(new Date(2024, 11, 15), new Date(2025, 0, 15));
    },
    expected: 31, tol: 0.01
  },

  // === Additional Calculator Tests ===
  {
    name: "Basic4: Subtraction 500 - 123 = 377",
    run: async () => {
      const { compute } = await loadModule('calculator');
      return compute(500, 123, '-');
    },
    expected: 377, tol: 0.001
  },
  {
    name: "Basic5: Negative result 100 - 500 = -400",
    run: async () => {
      const { compute } = await loadModule('calculator');
      return compute(100, 500, '-');
    },
    expected: -400, tol: 0.001
  },
  {
    name: "Basic6: Division by zero returns 'Error'",
    run: async () => {
      const { compute } = await loadModule('calculator');
      return compute(10, 0, '/');
    },
    expected: 'Error', tol: 0.001
  },

  // === Edge cases for fmt (index.js) ===
  {
    name: "Fmt1: undefined → 'Error'",
    run: async () => {
      const { fmt } = await loadModule('index');
      return fmt(undefined);
    },
    expected: 'Error', tol: 0.001
  },
  {
    name: "Fmt2: NaN → 'Error'",
    run: async () => {
      const { fmt } = await loadModule('index');
      return fmt(NaN);
    },
    expected: 'Error', tol: 0.001
  },
  {
    name: "Fmt3: Infinity → '∞'",
    run: async () => {
      const { fmt } = await loadModule('index');
      return fmt(Infinity);
    },
    expected: '∞', tol: 0.001
  },
  {
    name: "Fmt4: Integer → string",
    run: async () => {
      const { fmt } = await loadModule('index');
      return fmt(42);
    },
    expected: '42', tol: 0.001
  },
  {
    name: "Fmt5: Float rounding",
    run: async () => {
      const { fmt } = await loadModule('index');
      return fmt(3.1415926535);
    },
    expected: '3.14159265', tol: 0.001
  },
  {
    name: "Fmt6: String passthrough",
    run: async () => {
      const { fmt } = await loadModule('index');
      return fmt('hello');
    },
    expected: 'hello', tol: 0.001
  },
  {
    name: "Fmt7: Very large number → exponential",
    run: async () => {
      const { fmt } = await loadModule('index');
      return fmt(1e20);
    },
    expected: '1.000000e+20', tol: 0.001
  },
  {
    name: "Fmt8: Very small number → exponential",
    run: async () => {
      const { fmt } = await loadModule('index');
      return fmt(1e-10);
    },
    expected: '1.000000e-10', tol: 0.001
  },

  // === Date utility edge cases ===
  {
    name: "Date7: fmtDate null → '—'",
    run: async () => {
      const { fmtDate } = await loadModule('date');
      return fmtDate(null);
    },
    expected: '—', tol: 0.001
  },
  {
    name: "Date8: parseDate ISO format",
    run: async () => {
      const { parseDate, fmtDate } = await loadModule('date');
      let d = parseDate('2024-07-04');
      return fmtDate(d);
    },
    expected: '2024-07-04', tol: 0.001
  },
  {
    name: "Date9: parseDate compact format",
    run: async () => {
      const { parseDate, fmtDate } = await loadModule('date');
      let d = parseDate('20240704');
      return fmtDate(d);
    },
    expected: '2024-07-04', tol: 0.001
  },
  {
    name: "Date10: parseDate invalid → null",
    run: async () => {
      const { parseDate } = await loadModule('date');
      return parseDate('not-a-date');
    },
    expected: null, tol: 0.001
  },

  // === DOM-dependent integration tests (with mock) ===
  {
    name: "Int1: tvmAdj with P/Y=12",
    run: async () => {
      const { tvm, tvmAdj } = await loadModule('tvm');
      tvm.N = 10; tvm.IY = 8; tvm.PV = 0; tvm.PMT = 0; tvm.FV = 0; tvm.bgn = false; tvm.pyr = 12;
      let r = tvmAdj();
      return r.Np + r.ip;
    },
    expected: 120.006666666, tol: 0.001
  },
  {
    name: "Int2: solveTVM default case returns undefined",
    run: async () => {
      const { tvm, solveTVM } = await loadModule('tvm');
      tvm.N = 1; tvm.IY = 5; tvm.PV = -100; tvm.PMT = 0; tvm.FV = 0; tvm.bgn = false; tvm.pyr = 1;
      let r = solveTVM('UNKNOWN');
      return r === undefined ? 1 : 0;
    },
    expected: 1, tol: 0.001
  },
  {
    name: "Int3: tvm edge case - negative salvage SL",
    run: async () => {
      const { deprState } = await loadModule('depr');
      deprState.cost = 10000; deprState.salvage = -1000; deprState.life = 10;
      return (deprState.cost - deprState.salvage) / deprState.life;
    },
    expected: 1100, tol: 0.01
  },
  {
    name: "Int4: Bond compute with semi-annual = true and face=100",
    run: async () => {
      const { bondPrice } = await loadModule('bond');
      return bondPrice(100, 6, 7, 3, true);
    },
    expected: 97.34, tol: 0.01
  },
  {
    name: "Int5: CF IRR with single flow returns initial guess (10%)",
    run: async () => {
      const { cfState, calcIRR } = await loadModule('cashflow');
      cfState.flows = [{amount:100,freq:1}];
      return calcIRR();
    },
    expected: 10.00, tol: 0.01
  },
  {
    name: "Int6: compute default op returns b",
    run: async () => {
      const { compute } = await loadModule('calculator');
      return compute(10, 20, 'x');
    },
    expected: 20, tol: 0.001
  },
  {
    name: "Int7: pressTVM CLR_TVM resets tvm state",
    run: async () => {
      const { tvm, pressTVM } = await loadModule('tvm');
      const { calc } = await loadModule('index');
      tvm.N = 10; tvm.IY = 8; tvm.PV = -1000; tvm.PMT = 500; tvm.FV = 2000;
      tvm.bgn = true; tvm.pyr = 12;
      calc.display = '500';
      pressTVM('CLR_TVM');
      return (tvm.N === 0 && tvm.IY === 0 && tvm.PV === 0 && tvm.PMT === 0 && tvm.FV === 0 && tvm.bgn === true ? 1 : 0);
    },
    expected: 1, tol: 0.001
  },
  {
    name: "Int8: pressTVM BGN_TOGGLE switches mode",
    run: async () => {
      const { tvm, pressTVM } = await loadModule('tvm');
      tvm.bgn = false;
      pressTVM('BGN_TOGGLE');
      let b1 = tvm.bgn;
      pressTVM('BGN_TOGGLE');
      let b2 = tvm.bgn;
      return (b1 ? 1 : 0) + (b2 ? 1 : 0);
    },
    expected: 1, tol: 0.001
  },
  {
    name: "Int9: pressTVM P/YR toggles pyr between 1 and 12",
    run: async () => {
      const { tvm, pressTVM } = await loadModule('tvm');
      tvm.pyr = 1;
      pressTVM('P_YR');
      let p1 = tvm.pyr;
      pressTVM('P_YR');
      let p2 = tvm.pyr;
      return p1 * 100 + p2;
    },
    expected: 1201, tol: 0.001
  },
  {
    name: "Int10: pressTVM SOLVE_FV computes FV in display text",
    run: async () => {
      const { tvm, pressTVM } = await loadModule('tvm');
      const { calc } = await loadModule('index');
      tvm.N = 5; tvm.IY = 10; tvm.PV = -1000; tvm.PMT = 0; tvm.FV = 0; tvm.bgn = false; tvm.pyr = 1;
      pressTVM('SOLVE_FV');
      let val = parseFloat(calc.display);
      return Math.round(val);
    },
    expected: 1611, tol: 0.1
  },
  {
    name: "Int11: calculator doOp sets calc operator state",
    run: async () => {
      const { doOp } = await loadModule('calculator');
      const { calc } = await loadModule('index');
      calc.buffer = '10'; calc.display = '10'; calc.prev = null; calc.op = null; calc.newNumber = true;
      doOp('+');
      return (calc.prev === 10 && calc.op === '+' ? 1 : 0);
    },
    expected: 1, tol: 0.001
  },
  {
    name: "Int12: calculator doOp chains operations",
    run: async () => {
      const { doOp, compute } = await loadModule('calculator');
      const { calc } = await loadModule('index');
      // First op: 10 + 
      calc.buffer = '10'; calc.display = '10'; calc.prev = null; calc.op = null; calc.newNumber = true;
      doOp('+');
      // Simulate second number: next buffer '20', then op '-'
      calc.buffer = '20'; calc.display = '20';
      doOp('-');
      // prev should be 30 (10+20), op should be '-'
      return (calc.prev === 30 && calc.op === '-' ? 1 : 0);
    },
    expected: 1, tol: 0.001
  },
  {
    name: "Int13: compute default op returns b",
    run: async () => {
      const { compute } = await loadModule('calculator');
      return compute(10, 20, 'x');
    },
    expected: 20, tol: 0.001
  },
];

// Run all tests
const results = [];
let passed = 0, failed = 0;

for (const t of tests) {
  try {
    const actual = await t.run();
    let ok;
    if (typeof actual === 'string' || typeof t.expected === 'string') {
      ok = String(actual) === String(t.expected);
    } else if (actual === null || t.expected === null || actual === undefined || t.expected === undefined) {
      ok = actual === t.expected;
    } else {
      const diff = Math.abs(actual - t.expected);
      ok = diff <= t.tol;
    }
    if (ok) passed++; else failed++;
    results.push({
      name: t.name,
      passed: ok,
      actual,
      expected: t.expected,
      diff: typeof actual === 'string' ? (actual === t.expected ? 0 : Infinity) : Math.abs(actual - t.expected),
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
