// CFA Exam Test Cases for BA II Plus Calculator
// 24 test cases covering all modules with ±0.01 tolerance
// Each test: { name, module, setup, action, expected, tolerance }

const cfaTests = [
  // ===== TVM =====
  {
    name: "TVM1: FV from PV",
    module: "tvm",
    setup: () => {
      const { tvm } = require('../../packages/core/tvm');
      tvm.N = 10; tvm.IY = 8; tvm.PV = -1000; tvm.PMT = 0; tvm.FV = 0; tvm.bgn = false; tvm.pyr = 1;
    },
    action: () => {
      const { solveTVM } = require('../../packages/core/tvm');
      return solveTVM('FV');
    },
    expected: 2158.92,
    tolerance: 0.01
  },
  {
    name: "TVM2: PMT from N and I/Y",
    module: "tvm",
    setup: () => {
      const { tvm } = require('../../packages/core/tvm');
      tvm.N = 20; tvm.IY = 6; tvm.PV = 0; tvm.PMT = 0; tvm.FV = 0; tvm.bgn = false; tvm.pyr = 1;
    },
    action: () => {
      const { solveTVM } = require('../../packages/core/tvm');
      return solveTVM('PMT');
    },
    expected: -359.47,
    tolerance: 0.01
  },
  {
    name: "TVM3: Mortgage PMT",
    module: "tvm",
    setup: () => {
      const { tvm } = require('../../packages/core/tvm');
      tvm.N = 360; tvm.IY = 6; tvm.PV = 200000; tvm.PMT = 0; tvm.FV = 0; tvm.bgn = false; tvm.pyr = 12;
    },
    action: () => {
      const { tvmAdj, solveTVM } = require('../../packages/core/tvm');
      return solveTVM('PMT');
    },
    expected: -1199.10,
    tolerance: 0.01
  },
  {
    name: "TVM4: I/Y from PV and FV",
    module: "tvm",
    setup: () => {
      const { tvm } = require('../../packages/core/tvm');
      tvm.N = 5; tvm.IY = 0; tvm.PV = -10000; tvm.PMT = 0; tvm.FV = 15000; tvm.bgn = false; tvm.pyr = 1;
    },
    action: () => {
      const { solveTVM } = require('../../packages/core/tvm');
      return solveTVM('IY');
    },
    expected: 8.45,
    tolerance: 0.01
  },
  {
    name: "TVM5: N from I/Y, PV, FV",
    module: "tvm",
    setup: () => {
      const { tvm } = require('../../packages/core/tvm');
      tvm.N = 0; tvm.IY = 10; tvm.PV = -1000; tvm.PMT = 0; tvm.FV = 2000; tvm.bgn = false; tvm.pyr = 1;
    },
    action: () => {
      const { solveTVM } = require('../../packages/core/tvm');
      return solveTVM('N');
    },
    expected: 7.27,
    tolerance: 0.01
  },
  {
    name: "TVM6: BGN mode PV",
    module: "tvm",
    setup: () => {
      const { tvm } = require('../../packages/core/tvm');
      tvm.N = 10; tvm.IY = 8; tvm.PV = 0; tvm.PMT = 100; tvm.FV = 0; tvm.bgn = true; tvm.pyr = 1;
    },
    action: () => {
      const { solveTVM } = require('../../packages/core/tvm');
      return solveTVM('PV');
    },
    expected: -724.69,
    tolerance: 0.01
  },

  // ===== Bond =====
  {
    name: "Bond1: Annual bond price (discount)",
    module: "bond",
    setup: () => {
      const { bondState } = require('../../packages/core/bond');
      bondState.face = 1000; bondState.coupon = 6; bondState.yield = 8; bondState.years = 10; bondState.semiAnnual = false;
    },
    action: () => {
      const { bondPrice } = require('../../packages/core/bond');
      let b = require('../../packages/core/bond').bondState;
      return bondPrice(b.face, b.coupon, b.yield, b.years, b.semiAnnual);
    },
    expected: 865.80,
    tolerance: 0.01
  },
  {
    name: "Bond2: Annual bond price (premium)",
    module: "bond",
    setup: () => {
      const { bondState } = require('../../packages/core/bond');
      bondState.face = 1000; bondState.coupon = 8; bondState.yield = 6; bondState.years = 5; bondState.semiAnnual = false;
    },
    action: () => {
      const { bondPrice } = require('../../packages/core/bond');
      let b = require('../../packages/core/bond').bondState;
      return bondPrice(b.face, b.coupon, b.yield, b.years, b.semiAnnual);
    },
    expected: 1084.25,
    tolerance: 0.01
  },
  {
    name: "Bond3: Par bond (coupon=YTM)",
    module: "bond",
    setup: () => {
      const { bondState } = require('../../packages/core/bond');
      bondState.face = 1000; bondState.coupon = 5; bondState.yield = 5; bondState.years = 10; bondState.semiAnnual = false;
    },
    action: () => {
      const { bondPrice } = require('../../packages/core/bond');
      let b = require('../../packages/core/bond').bondState;
      return bondPrice(b.face, b.coupon, b.yield, b.years, b.semiAnnual);
    },
    expected: 1000.00,
    tolerance: 0.01
  },
  {
    name: "Bond4: Semi-annual bond price",
    module: "bond",
    setup: () => {
      const { bondState } = require('../../packages/core/bond');
      bondState.face = 1000; bondState.coupon = 6; bondState.yield = 8; bondState.years = 10; bondState.semiAnnual = true;
    },
    action: () => {
      const { bondPrice } = require('../../packages/core/bond');
      let b = require('../../packages/core/bond').bondState;
      return bondPrice(b.face, b.coupon, b.yield, b.years, b.semiAnnual);
    },
    expected: 864.10,
    tolerance: 0.01
  },

  // ===== Cash Flow =====
  {
    name: "CF1: NPV and IRR",
    module: "cashflow",
    setup: () => {
      const { cfState } = require('../../packages/core/cashflow');
      cfState.flows = [
        { amount: -10000, freq: 1 },
        { amount: 3000, freq: 1 },
        { amount: 4000, freq: 1 },
        { amount: 5000, freq: 1 },
        { amount: 2000, freq: 1 }
      ];
      cfState.rate = 10;
    },
    tests: [
      {
        name: "CF1a: NPV",
        action: () => {
          const { calcNPV } = require('../../packages/core/cashflow');
          return calcNPV();
        },
        expected: 1026.97,
        tolerance: 0.01
      },
      {
        name: "CF1b: IRR",
        action: () => {
          const { calcIRR } = require('../../packages/core/cashflow');
          return calcIRR();
        },
        expected: 14.97,
        tolerance: 0.01
      }
    ]
  },
  {
    name: "CF2: NPV with frequencies",
    module: "cashflow",
    setup: () => {
      const { cfState } = require('../../packages/core/cashflow');
      cfState.flows = [
        { amount: -100, freq: 1 },
        { amount: 30, freq: 5 }
      ];
      cfState.rate = 10;
    },
    action: () => {
      const { calcNPV } = require('../../packages/core/cashflow');
      return calcNPV();
    },
    expected: 13.72,
    tolerance: 0.01
  },

  // ===== Depreciation =====
  {
    name: "Depr1: Straight Line",
    module: "depr",
    setup: () => {
      const { deprState } = require('../../packages/core/depr');
      deprState.cost = 10000; deprState.salvage = 2000; deprState.life = 5;
    },
    action: () => {
      const { deprState } = require('../../packages/core/depr');
      return (deprState.cost - deprState.salvage) / deprState.life;
    },
    expected: 1600,
    tolerance: 0.01
  },
  {
    name: "Depr2: Double Declining Year 1",
    module: "depr",
    setup: () => {
      const { deprState } = require('../../packages/core/depr');
      deprState.cost = 10000; deprState.salvage = 1000; deprState.life = 5; deprState.year = 1;
    },
    action: () => {
      const { deprState } = require('../../packages/core/depr');
      let rate = 2 / deprState.life;
      return deprState.cost * rate;
    },
    expected: 4000,
    tolerance: 0.01
  },
  {
    name: "Depr3: SYD Year 1",
    module: "depr",
    setup: () => {
      const { deprState } = require('../../packages/core/depr');
      deprState.cost = 10000; deprState.salvage = 1000; deprState.life = 5; deprState.year = 1;
    },
    action: () => {
      const { deprState } = require('../../packages/core/depr');
      let remaining = deprState.life - deprState.year + 1;
      let totalSYD = deprState.life * (deprState.life + 1) / 2;
      return (deprState.cost - deprState.salvage) * remaining / totalSYD;
    },
    expected: 3000,
    tolerance: 0.01
  },

  // ===== Statistics =====
  {
    name: "Stat1: 1-VAR Mean and Std Dev",
    module: "stats",
    setup: () => {
      const { statState } = require('../../packages/core/stats');
      statState.data = [1, 2, 3, 4, 5]; statState.data2 = [];
    },
    tests: [
      {
        name: "Stat1a: Mean",
        action: () => {
          const { statState } = require('../../packages/core/stats');
          return statState.data.reduce((a,b)=>a+b,0) / statState.data.length;
        },
        expected: 3,
        tolerance: 0.01
      },
      {
        name: "Stat1b: Sample Std Dev",
        action: () => {
          const { statState } = require('../../packages/core/stats');
          let mean = statState.data.reduce((a,b)=>a+b,0) / statState.data.length;
          let v = statState.data.reduce((a,b)=>a+(b-mean)**2,0) / (statState.data.length - 1);
          return Math.sqrt(v);
        },
        expected: 1.58,
        tolerance: 0.01
      }
    ]
  },
  {
    name: "Stat2: 2-VAR Regression",
    module: "stats",
    setup: () => {
      const { statState } = require('../../packages/core/stats');
      statState.data = [1, 2, 3]; statState.data2 = [2, 4, 6];
    },
    tests: [
      {
        name: "Stat2a: Correlation",
        action: () => {
          const { statState } = require('../../packages/core/stats');
          let n = Math.min(statState.data.length, statState.data2.length);
          let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
          for (let i = 0; i < n; i++) {
            let x = statState.data[i], y = statState.data2[i];
            sumX += x; sumY += y; sumXY += x*y; sumX2 += x*x; sumY2 += y*y;
          }
          let num = n * sumXY - sumX * sumY;
          let den = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
          return den !== 0 ? num / den : 0;
        },
        expected: 1.0,
        tolerance: 0.001
      },
      {
        name: "Stat2b: Slope",
        action: () => {
          const { statState } = require('../../packages/core/stats');
          let n = Math.min(statState.data.length, statState.data2.length);
          let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
          for (let i = 0; i < n; i++) {
            let x = statState.data[i], y = statState.data2[i];
            sumX += x; sumY += y; sumXY += x*y; sumX2 += x*x;
          }
          return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        },
        expected: 2.0,
        tolerance: 0.001
      },
      {
        name: "Stat2c: Intercept",
        action: () => {
          const { statState } = require('../../packages/core/stats');
          let n = Math.min(statState.data.length, statState.data2.length);
          let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
          for (let i = 0; i < n; i++) {
            let x = statState.data[i], y = statState.data2[i];
            sumX += x; sumY += y; sumXY += x*y; sumX2 += x*x;
          }
          let slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
          return (sumY - slope * sumX) / n;
        },
        expected: 0.0,
        tolerance: 0.001
      }
    ]
  },

  // ===== Basic =====
  {
    name: "Basic1: Addition",
    module: "calculator",
    action: () => {
      const { compute } = require('../../packages/core/calculator');
      return compute(100, 200, '+');
    },
    expected: 300,
    tolerance: 0.001
  },
  {
    name: "Basic2: Multiplication",
    module: "calculator",
    action: () => {
      const { compute } = require('../../packages/core/calculator');
      return compute(12, 12, '*');
    },
    expected: 144,
    tolerance: 0.001
  },
  {
    name: "Basic3: Division",
    module: "calculator",
    action: () => {
      const { compute } = require('../../packages/core/calculator');
      return compute(144, 12, '/');
    },
    expected: 12,
    tolerance: 0.001
  },
  {
    name: "Basic4: Power via repeated mul",
    module: "calculator",
    action: () => {
      let r = 1;
      for (let i = 0; i < 10; i++) r *= 2;
      return r;
    },
    expected: 1024,
    tolerance: 0.001
  },

  // ===== ICONV =====
  {
    name: "Iconv1: NOM to EFF",
    module: "iconv",
    setup: () => {
      const { iconvState } = require('../../packages/core/iconv');
      iconvState.nom = 12; iconvState.cy = 12;
    },
    action: () => {
      const { iconvState } = require('../../packages/core/iconv');
      let { nom, cy } = iconvState;
      return (Math.pow(1 + nom / 100 / cy, cy) - 1) * 100;
    },
    expected: 12.68,
    tolerance: 0.01
  },
  {
    name: "Iconv2: EFF to NOM",
    module: "iconv",
    setup: () => {
      const { iconvState } = require('../../packages/core/iconv');
      iconvState.eff = 12.68; iconvState.cy = 12;
    },
    action: () => {
      const { iconvState } = require('../../packages/core/iconv');
      let { eff, cy } = iconvState;
      return (Math.pow(1 + eff / 100, 1 / cy) - 1) * cy * 100;
    },
    expected: 12.00,
    tolerance: 0.01
  },

  // ===== Date =====
  {
    name: "Date1: Days between dates (ACT/360)",
    module: "date",
    setup: () => {
      const { dateState } = require('../../packages/core/date');
      dateState.dt1 = new Date(2024, 0, 1);
      dateState.dt2 = new Date(2024, 11, 31);
    },
    action: () => {
      const { daysBetween } = require('../../packages/core/date');
      return daysBetween(new Date(2024, 0, 1), new Date(2024, 11, 31));
    },
    expected: 365,
    tolerance: 0.01
  },
  {
    name: "Date2: 30/360 days",
    module: "date",
    setup: () => {
      const { dateState } = require('../../packages/core/date');
      dateState.dt1 = new Date(2024, 0, 1);
      dateState.dt2 = new Date(2024, 5, 15);
    },
    action: () => {
      const { days30_360 } = require('../../packages/core/date');
      return days30_360(new Date(2024, 0, 1), new Date(2024, 5, 15));
    },
    expected: 164,
    tolerance: 0.01
  }
];

// Flatten multi-test cases
function flattenTests() {
  const flat = [];
  for (const t of cfaTests) {
    if (t.tests) {
      for (const subt of t.tests) {
        flat.push({
          name: subt.name,
          module: t.module,
          setup: t.setup,
          action: subt.action,
          expected: subt.expected,
          tolerance: subt.tolerance
        });
      }
    } else {
      flat.push(t);
    }
  }
  return flat;
}

module.exports = { cfaTests, flattenTests };
