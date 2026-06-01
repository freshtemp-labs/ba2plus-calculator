# BA II Plus Financial Calculator

[![CI](https://github.com/freshtemp-labs/ba2plus-calculator/actions/workflows/ci.yml/badge.svg)](https://github.com/freshtemp-labs/ba2plus-calculator/actions/workflows/ci.yml)
[![Web Deploy](https://github.com/freshtemp-labs/ba2plus-calculator/actions/workflows/web-deploy.yml/badge.svg)](https://github.com/freshtemp-labs/ba2plus-calculator/actions/workflows/web-deploy.yml)
[![Android Build](https://github.com/freshtemp-labs/ba2plus-calculator/actions/workflows/android-build.yml/badge.svg)](https://github.com/freshtemp-labs/ba2plus-calculator/actions/workflows/android-build.yml)
[![iOS Build](https://github.com/freshtemp-labs/ba2plus-calculator/actions/workflows/ios-build.yml/badge.svg)](https://github.com/freshtemp-labs/ba2plus-calculator/actions/workflows/ios-build.yml)
[![Desktop Build](https://github.com/freshtemp-labs/ba2plus-calculator/actions/workflows/desktop-build.yml/badge.svg)](https://github.com/freshtemp-labs/ba2plus-calculator/actions/workflows/desktop-build.yml)

A web-based Texas Instruments BA II Plus financial calculator emulator — built as a zero-dependency PWA, packaged for iOS/Android via Capacitor and Desktop via Tauri.

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
All 82 CFA exam tests pass (100%), covering:
- TVM (annuity, lump sum, loan amortization, rate of return)
- NPV/IRR with cash flow frequencies
- Bond pricing (annual, semi-annual, premium, discount, par)
- Statistics (1-VAR and 2-VAR/linear regression)
- Interest conversion (NOM↔EFF)
- Date arithmetic (30/360, actual)

## Quick Start
Open `index.html` in any modern browser. That's it — no installation, no server needed.

## Deploy (CI/CD)

Builds are managed via **GitHub Actions** — see [`.github/workflows/`](.github/workflows/).

| Workflow | Trigger | Artifact |
|----------|---------|---------|
|| [CI](.github/workflows/ci.yml) | PR / push to main | Lint + 82 tests |
| [Web Deploy](.github/workflows/web-deploy.yml) | Push to main | Builds with Vite → GitHub Pages |
| [Android Build](.github/workflows/android-build.yml) | Push to main / manual | Debug APK artifact |
| [iOS Build](.github/workflows/ios-build.yml) | Push to main / manual | Simulator build validation |
| [Desktop Build](.github/workflows/desktop-build.yml) | Push to main / manual | macOS .dmg + Linux AppImage |

### Local Development
```bash
# Web (Vite dev server)
npm run dev:web

# iOS/Android (Capacitor)
npm run dev:mobile

# Desktop (Tauri)
cd apps/desktop && npx tauri dev
```

## Technical
- **Zero dependencies**: Pure HTML + CSS + JavaScript
- **No frameworks**: No React, no jQuery, no npm
- **No backend**: All calculations run client-side
- **Responsive**: Works on desktop and mobile

## File
`/Users/hhh/Desktop/ba2-plus-calculator.html` (62 KB, ~1300 lines)
