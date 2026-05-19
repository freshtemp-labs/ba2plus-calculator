# BA II Plus Calculator — Product Requirements Document

## Product Overview
A cross-platform BA II Plus financial calculator for CFA exam candidates, finance professionals, and students. Originally a single-file HTML5 web app, now modularized and wrapped as native iOS, Android, and desktop applications.

## Target Audience
- CFA exam candidates (primary)
- Finance students
- Investment professionals
- Anyone needing a free BA II Plus alternative

## Core Requirements
| Requirement | Priority | Status |
|-------------|----------|--------|
| Fully offline (no network after install) | P0 | ✓ |
| CFA exam accurate (±0.01 tolerance) | P0 | ✓ |
| Sub-16ms input latency | P0 | ✓ |
| Dark mode (default), light mode support | P1 | ✓ |
| Keyboard shortcuts | P1 | ✓ |
| Touch-optimized (44px min targets) | P1 | ✓ |
| App Store ready project structure | P1 | ✓ |
| Auto light/dark theme | P2 | ✓ |

## Tech Stack
- Core: Vanilla JS (ES modules) — no frameworks
- Mobile: Capacitor (iOS + Android)
- Desktop: Tauri (macOS + Windows + Linux)
- Web: Static HTML (GitHub Pages)

## Platform Comparison
- Capacitor: ~95% code reuse from web, native WebView, App Store/Google Play
- Tauri: ~5 MB binary, Rust backend, sub-150ms startup
- Web: Zero-install, GitHub Pages distribution
