# Cross-Platform Setup Guide

## Prerequisites

### All Platforms
- Node.js >= 18
- npm >= 9

### iOS (Capacitor)
- macOS with Xcode 15+
- CocoaPods (`sudo gem install cocoapods`)
- Apple Developer account ($99/year)

### Android (Capacitor)
- Android Studio (SDK 34+)
- Java 17+
- `ANDROID_HOME` environment variable

### Desktop (Tauri)
- Rust toolchain (`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`)
- macOS: Xcode CLI tools
- Windows: WebView2 (pre-installed on Win10+)
- Linux: WebKitGTK (`sudo apt install libwebkit2gtk-4.1-dev`)

## Setup Steps

### 1. Web App (testing locally)
```bash
cd apps/web
python3 -m http.server 8080
# Open http://localhost:8080
```

### 2. Tests
```bash
cd ../..
node tests/cfa-test-runner.js --report
open tests/cfa-test-report.html
```

### 3. iOS App
```bash
cd apps/mobile
npm install
npm run build
npx cap sync ios
npx cap open ios
# In Xcode: select simulator → Product → Run
```

### 4. Android App
```bash
cd apps/mobile
npm install
npm run build
npx cap sync android
npx cap open android
# In Android Studio: Run → app
```

### 5. Desktop App
```bash
cd apps/desktop
npm install
npx tauri dev    # Development with hot reload
npx tauri build  # Production build (.dmg/.msi/.AppImage)
```

## CI/CD (GitHub Actions)
The monorepo structure supports multi-platform CI:
1. Push to `main` triggers all builds
2. Web → GitHub Pages
3. Web artifacts copied to Capacitor www/
4. Tauri builds → release artifacts
