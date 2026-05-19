// ===== Interest Conversion (ICONV) =====
import { calc, $, fmt } from './index.js';

const iconvState = { nom: 0, eff: 0, cy: 12 };

function pressIconv(k) {
  let v = parseFloat(calc.buffer || '0');
  if (k === 'NOM') { iconvState.nom = isNaN(v) ? 0 : v; calc.buffer = ''; calc.newNumber = true; }
  else if (k === 'EFF') { iconvState.eff = isNaN(v) ? 0 : v; calc.buffer = ''; calc.newNumber = true; }
  else if (k === 'C_Y') { iconvState.cy = Math.max(1, Math.floor(isNaN(v) ? 12 : v)); calc.buffer = ''; calc.newNumber = true; }
  else if (k === 'NOM_TO_EFF') {
    let { nom, cy } = iconvState;
    iconvState.eff = (Math.pow(1 + nom / 100 / cy, cy) - 1) * 100;
    calc.display = fmt(iconvState.eff) + '%';
  }
  else if (k === 'EFF_TO_NOM') {
    let { eff, cy } = iconvState;
    iconvState.nom = (Math.pow(1 + eff / 100, 1 / cy) - 1) * cy * 100;
    calc.display = fmt(iconvState.nom) + '%';
  }
  else if (k === 'CLEAR') { iconvState.nom = 0; iconvState.eff = 0; iconvState.cy = 12; }
  updateIconvDisplay();
}

function updateIconvDisplay() {
  let iconvNom = $('iconvNom');
  if (iconvNom) iconvNom.textContent = iconvState.nom;
  let iconvEff = $('iconvEff');
  if (iconvEff) iconvEff.textContent = iconvState.eff;
  let iconvCY = $('iconvCY');
  if (iconvCY) iconvCY.textContent = iconvState.cy;
  $('labelLine').textContent = '\u5229\u7387\u8f6c\u6362';
  $('subLine').textContent = `NOM=${iconvState.nom}%  EFF=${iconvState.eff}%  C/Y=${iconvState.cy}`;
  $('valueLine').textContent = calc.display;
}

export { iconvState, pressIconv, updateIconvDisplay };
