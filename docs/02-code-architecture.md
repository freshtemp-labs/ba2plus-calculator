# Code Architecture

## Modular Structure
```
packages/core/     ← Calculator engine (10 ES modules)
packages/ui/       ← CSS theme
apps/web/          ← Web app entry point
apps/mobile/       ← Capacitor wrapper
apps/desktop/      ← Tauri wrapper
tests/             ← CFA test suite
```

## Core Module Dependencies
```
index.js (calc, $, fmt)
  ├── calculator.js (press, doOp, compute)
  ├── tvm.js (TVM state + solveTVM Newton-Raphson)
  ├── cashflow.js (NPV/IRR with frequencies)
  ├── bond.js (bond pricing, YTM solver)
  ├── depr.js (SL/SYD/DB)
  ├── iconv.js (NOM↔EFF)
  ├── date.js (day count conventions)
  ├── stats.js (1-VAR, 2-VAR)
  ├── mode.js (switchMode, toggleShortcuts)
  └── keyboard.js (keydown → press actions)
```

## Key Algorithms
- **TVM I/Y solver**: Newton-Raphson with Taylor expansion near zero
- **IRR solver**: Newton-Raphson with bounds clipping
- **Bond YTM**: Newton-Raphson with semi-annual chain rule

## State Management
All state lives in module-level objects (no classes):
- `calc` — display, buffer, operation, mode
- `tvm` — TVM variables
- `cfState` — cash flow data
- `bondState` — bond parameters
- `deprState` — depreciation parameters
- `iconvState` — interest conversion
- `dateState` — date pairs and convention
- `statState` — data arrays and mode

## Platform Adaptation
- Web: Direct `<script type="module">` import; global `window.*` for onclick
- Capacitor: Same web code in WebView; plugins for haptics/clipboard
- Tauri: Same web code with native window via Rust/WebKit

## Test Strategy
- Node.js ESM imports test each module's math functions directly
- 27 CFA exam scenarios with ±0.01 tolerance
- HTML report auto-generated
