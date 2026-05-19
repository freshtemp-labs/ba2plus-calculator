# BA II Plus Financial Calculator

A web-based Texas Instruments BA II Plus financial calculator emulator, built as a single HTML file with zero dependencies.

**Designed for CFA exam preparation.**

## Features

### 8 Modes
| Mode | Key | Description |
|------|-----|-------------|
| **标准** (FIN) | `Q` | Basic arithmetic, memory STO/RCL |
| **TVM** | `T` | Time Value of Money: N, I/Y, PV, PMT, FV — solve any variable |
| **现金流** | `C` | Cash Flow with frequencies: NPV, IRR |
| **债券** | `B` | Bond pricing + YTM solver (annual/semi-annual) |
| **折旧** | `D` | SL, SYD, DB (Double Declining Balance) |
| **利率转换** | `I` | Nominal ↔ Effective interest rate conversion |
| **日期** | `A` | Days between dates (30/360, ACT/360, ACT/365, ACT/ACT) |
| **统计** | `S` | Single & dual variable stats: mean, σx, sx, σ², s², Σx, Σx², correlation, slope, intercept |

### Keyboard Shortcuts
- **Numbers**: `0-9`, `.`
- **Operators**: `+`, `-`, `*`, `/`, `Enter`/`=`
- **Clear**: `Esc`
- **NEG**: `N`
- **BGN/END toggle**: `G`
- **TVM Solve**: `Shift+P` (PV), `Shift+F` (FV), `Shift+M` (PMT), `Shift+R` (N), `Shift+I` (I/Y)
- **Mode switch**: `Q`(Basic), `T`(TVM), `C`(CF), `B`(Bond), `D`(Depr), `I`(ICONV), `A`(Date), `S`(Stats)

### Accuracy Verified
All 24 CFA exam tests pass, covering:
- TVM (annuity, lump sum, loan amortization, rate of return)
- NPV/IRR with cash flow frequencies
- Bond pricing (annual, semi-annual, premium, discount, par)
- Statistics (1-VAR and 2-VAR/linear regression)
- Interest conversion (NOM↔EFF)
- Date arithmetic (30/360, actual)

## Quick Start
Open `index.html` in any modern browser. That's it — no installation, no server needed.

## Deploy

### Vercel (recommended)
```bash
vercel --prod
```

### GitHub Pages
```bash
git init
git add index.html
git commit -m "Initial commit"
gh repo create ba2-plus-calculator --public --source=.
git push origin main
# Then enable GitHub Pages in repo Settings → Pages → branch: main / (root)
```

### Local
```bash
python3 -m http.server 8765
# Open http://localhost:8765
```

## Technical
- **Zero dependencies**: Pure HTML + CSS + JavaScript
- **No frameworks**: No React, no jQuery, no npm
- **No backend**: All calculations run client-side
- **Responsive**: Works on desktop and mobile

## File
`/Users/hhh/Desktop/ba2-plus-calculator.html` (62 KB, ~1300 lines)
