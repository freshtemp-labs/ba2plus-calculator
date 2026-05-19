# BA II Plus Calculator

[![Tests](https://img.shields.io/badge/tests-27%2F27-%2300aa00)](tests/cfa-test-report.html)
[![Platform](https://img.shields.io/badge/platform-web%20%7C%20iOS%20%7C%20android%20%7C%20desktop-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

A fully-featured **BA II Plus financial calculator** with native apps for iOS, Android, and Desktop (macOS/Windows/Linux). Built from a single HTML codebase split into modular ES modules, wrapped with Capacitor (mobile) and Tauri (desktop).

---

## Features

| Module | Functions | Status |
|--------|-----------|--------|
| **Basic** | +, −, ×, ÷, %, ±, MEM/RCL, CE/C | ✓ |
| **TVM** | PV, FV, PMT, N, I/Y solver (Newton-Raphson), BGN/END, P/Y | ✓ |
| **Cash Flow** | NPV, IRR with frequency (F01-F0n) | ✓ |
| **Bond** | Price, YTM (annual/semi-annual), par/premium/discount | ✓ |
| **Depreciation** | Straight Line (SL), Sum-of-Years (SYD), Double Declining (DB) | ✓ |
| **ICONV** | NOM ↔ EFF interest rate conversion, C/Y adjustment | ✓ |
| **Date** | Days between dates: ACT/360, ACT/365, ACT/ACT, 30/360 | ✓ |
| **Statistics** | 1-VAR (mean, σ, s, σ², s², Σx, Σx²), 2-VAR (correlation r, slope b₁, intercept b₀) | ✓ |
| **Keyboard** | Full keyboard shortcuts: Q/T/C/B/D/I/A/S for modes, Shift+P/F/M/R/I for TVM solves | ✓ |
| **Dark/Light** | Automatic dark/light mode via `prefers-color-scheme` | ✓ |

## CFA Exam Tested

All 24+ CFA exam test cases pass with ±0.01 accuracy:

- TVM: PV, FV, PMT, N, I/Y solvers with BGN/END and P/Y adjustment
- Bond pricing: discount, premium, par — annual and semi-annual
- Cash flow: NPV and IRR with frequencies
- Depreciation: SL, SYD, DB methods
- Statistics: 1-VAR (mean, std dev) and 2-VAR (correlation, regression)
- ICONV: NOM to EFF and EFF to NOM
- Date: ACT and 30/360 day count conventions

[View Test Report](tests/cfa-test-report.html)

## Project Structure

```
ba2-plus-app/
├── packages/
│   ├── core/          # Calculator logic (ES modules)
│   │   ├── index.js   # Shared state: calc, $, fmt
│   │   ├── calculator.js  # Basic operations
│   │   ├── tvm.js         # TVM solver (Newton-Raphson)
│   │   ├── cashflow.js    # NPV/IRR with frequencies
│   │   ├── bond.js        # Bond pricing & YTM
│   │   ├── depr.js        # Depreciation (SL/SYD/DB)
│   │   ├── iconv.js       # Interest conversion
│   │   ├── date.js        # Date arithmetic
│   │   ├── stats.js       # 1-VAR and 2-VAR statistics
│   │   ├── mode.js        # Mode switching
│   │   └── keyboard.js    # Keyboard shortcuts
│   └── ui/
│       └── styles.css     # Calculator theme (dark/light)
├── apps/
│   ├── web/           # Web app (vanilla HTML/JS)
│   ├── mobile/        # Capacitor mobile wrapper
│   └── desktop/       # Tauri desktop wrapper
├── tests/
│   ├── cfa-tests.js        # 24+ CFA test cases
│   ├── cfa-test-runner.js  # Automated test runner
│   └── cfa-test-report.html  # Generated report
└── docs/              # PRD and architecture docs
```

## Quick Start

```bash
# Web (works in any browser)
cd apps/web
python3 -m http.server 8080     # or any static server

# Tests
cd ../..
node tests/cfa-test-runner.js --report

# Mobile (requires Capacitor CLI + Xcode/Android Studio)
cd apps/mobile
npm install
npm run build
npm run sync
npm run open:ios         # or open:android

# Desktop (requires Rust + Tauri CLI)
cd apps/desktop
npm install
npm run tauri dev
```

## Build for Platforms

### iOS (Capacitor)
```bash
cd apps/mobile
npm install
npm run build
npx cap sync ios
npx cap open ios
# Build archive in Xcode → App Store Connect
```

### Android (Capacitor)
```bash
cd apps/mobile
npm install
npm run build
npx cap sync android
npx cap open android
# Build signed bundle: ./gradlew bundleRelease
```

### Desktop (Tauri)
```bash
cd apps/desktop
npm install
npx tauri build
# Output: .dmg (macOS), .msi (Windows), .AppImage (Linux)
```

## Technology

- **Core**: Vanilla JavaScript (ES modules) — zero frameworks, zero dependencies
- **Mobile**: [Capacitor](https://capacitorjs.com/) — native WebView wrapper
- **Desktop**: [Tauri](https://tauri.app/) — Rust + WebView (~5 MB binary)
- **Testing**: Node.js with dynamic ES module imports

## License

MIT
