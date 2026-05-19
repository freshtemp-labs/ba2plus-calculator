// ===== Date Arithmetic =====
import { calc, $, fmt } from './index.js';

const dateState = { dt1: null, dt2: null, convention: 'ACT/360' };

function parseDate(str) {
  if (!str) return null;
  let m = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
  m = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (m) return new Date(+m[3], +m[1] - 1, +m[2]);
  m = str.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
  return null;
}

function daysBetween(d1, d2) {
  return Math.round((d2 - d1) / (24 * 60 * 60 * 1000));
}

function days30_360(d1, d2) {
  let y1 = d1.getFullYear(), m1 = d1.getMonth() + 1, day1 = d1.getDate();
  let y2 = d2.getFullYear(), m2 = d2.getMonth() + 1, day2 = d2.getDate();
  if (day1 === 31) day1 = 30;
  if (day2 === 31 && (day1 === 30 || day1 === 31)) day2 = 30;
  return (y2 - y1) * 360 + (m2 - m1) * 30 + (day2 - day1);
}

function fmtDate(d) {
  if (!d) return '\u2014';
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function pressDate(k) {
  if (k === 'ACT_360') { dateState.convention = 'ACT/360'; }
  else if (k === 'ACT_365') { dateState.convention = 'ACT/365'; }
  else if (k === 'ACT_ACT') { dateState.convention = 'ACT/ACT'; }
  else if (k === '30_360') { dateState.convention = '30/360'; }
  else if (k === 'DAYS') {
    if (!dateState.dt1 || !dateState.dt2) {
      calc.display = '\u8bf7\u5148\u8f93\u5165\u4e24\u4e2a\u65e5\u671f';
    } else {
      let days;
      switch (dateState.convention) {
        case '30/360': days = days30_360(dateState.dt1, dateState.dt2); break;
        case 'ACT/365': days = daysBetween(dateState.dt1, dateState.dt2); break;
        case 'ACT/ACT': days = daysBetween(dateState.dt1, dateState.dt2); break;
        default: days = daysBetween(dateState.dt1, dateState.dt2);
      }
      calc.display = days + ' \u5929';
    }
  } else if (k === 'CLEAR') { dateState.dt1 = null; dateState.dt2 = null; dateState.convention = 'ACT/360'; }
  updateDateDisplay();
}

function updateDateDisplay() {
  $('labelLine').textContent = '\u65e5\u671f';
  $('subLine').textContent = `DT1=${fmtDate(dateState.dt1)}  DT2=${fmtDate(dateState.dt2)}  (${dateState.convention})`;
  let dd = $('dateDisplay');
  if (dd) dd.innerHTML = `DT1=${fmtDate(dateState.dt1)}  DT2=${fmtDate(dateState.dt2)}  (${dateState.convention})`;
  $('valueLine').textContent = calc.display;
}

export { dateState, parseDate, daysBetween, days30_360, pressDate, updateDateDisplay, fmtDate };
