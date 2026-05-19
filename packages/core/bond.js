// ===== Bond Pricing & YTM =====
import { calc, $, fmt } from './index.js';

const bondState = { face: 1000, coupon: 5, price: null, yield: 5, years: 10, semiAnnual: false };

function bondPrice(face, coupon, yld, years, semiAnnual) {
  let periods = semiAnnual ? years * 2 : years;
  let rate = semiAnnual ? yld / 200 : yld / 100;
  let cpn = semiAnnual ? coupon / 200 * face : coupon / 100 * face;
  let p = 0;
  for (let t = 1; t <= periods; t++) {
    p += cpn / Math.pow(1 + rate, t);
  }
  p += face / Math.pow(1 + rate, periods);
  return p;
}

function pressBond(k) {
  let v = parseFloat(calc.buffer || '0');
  if (k === 'SET_FV') { bondState.face = isNaN(v) ? 1000 : v; calc.buffer = ''; calc.newNumber = true; }
  else if (k === 'SET_CPN') { bondState.coupon = isNaN(v) ? 5 : v; calc.buffer = ''; calc.newNumber = true; }
  else if (k === 'SET_YLD') { bondState.yield = isNaN(v) ? 5 : v; calc.buffer = ''; calc.newNumber = true; }
  else if (k === 'SET_N') { bondState.years = isNaN(v) ? 10 : v; calc.buffer = ''; calc.newNumber = true; }
  else if (k === 'SET_PRICE') { bondState.price = isNaN(v) ? null : v; calc.buffer = ''; calc.newNumber = true; }
  else if (k === 'SET_PA') { bondState.semiAnnual = false; }
  else if (k === 'SET_SA') { bondState.semiAnnual = true; }
  else if (k === 'PRICE') {
    let { face, coupon, yield: yld, years, semiAnnual } = bondState;
    calc.display = fmt(bondPrice(face, coupon, yld, years, semiAnnual));
  }
  else if (k === 'YTM') {
    let { face, coupon, price, years, semiAnnual } = bondState;
    if (price === null || price === 0) { calc.display = 'Error: \u8bf7\u8f93\u5165\u4ef7\u683c'; }
    else {
      let y = 0.05;
      for (let iter = 0; iter < 500; iter++) {
        let periods = semiAnnual ? years * 2 : years;
        let r = semiAnnual ? y / 2 : y;
        let cpn = semiAnnual ? coupon / 200 * face : coupon / 100 * face;
        let p = 0, dp = 0;
        for (let t = 1; t <= periods; t++) {
          let disc = Math.pow(1 + r, t);
          p += cpn / disc;
          dp += -t * cpn / (disc * (1 + r));
        }
        let discN = Math.pow(1 + r, periods);
        p += face / discN;
        dp += -periods * face / (discN * (1 + r));
        let dyRatio = semiAnnual ? 0.5 : 1;
        dp *= dyRatio;
        let f = p - price;
        if (Math.abs(f) < 1e-8) { calc.display = fmt(y * 100); updateBondDisplay(); return; }
        let dy = dp !== 0 ? -f / dp : 0.001;
        if (Math.abs(dy) > 0.1) dy = Math.sign(dy) * 0.1;
        y += dy;
        if (y < 0.0001) y = 0.0001;
        if (isNaN(y) || !isFinite(y)) break;
      }
      calc.display = (y >= 0 && y < 10) ? fmt(y * 100) + '(\u8fd1\u4f3c)' : 'Error';
    }
  }
  else if (k === 'CLEAR') { Object.assign(bondState, {face:1000, coupon:5, price:null, yield:5, years:10, semiAnnual:false}); }
  updateBondDisplay();
}

function updateBondDisplay() {
  let b = bondState;
  $('labelLine').textContent = '\u503a\u5238';
  let priceStr = b.price !== null ? `  \u4ef7\u683c=${b.price}` : '';
  $('subLine').textContent = `\u9762\u503c=${b.face}  \u7968\u606f=${b.coupon}%  \u6536\u76ca\u7387=${b.yield}%  \u671f\u9650=${b.years}\u5e74${priceStr}  ${b.semiAnnual ? '\u534a\u5e74' : '\u6bcf\u5e74'}\u4ed8\u606f`;
  $('valueLine').textContent = calc.display;
}

export { bondState, bondPrice, pressBond, updateBondDisplay };
