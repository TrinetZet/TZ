# ClientBridge Android 1.0.1

Offline business English practice: 12 missions, 36 phrases, spaced flashcards, email studio, history and local backups.

Download **ClientBridge-v1.0.1.apk** and open it on **Android 8.0 or newer** with an up-to-date compatible Android System WebView. Allow installation from your browser/file manager when Android asks.

System clipboard, .txt/JSON Save picker and real JSON import picker are supported. No connection is needed to practise; the APK requests no permissions. Keep a JSON backup before clearing app data or uninstalling.

Package: `com.trinetzet.clientbridge`; versionName 1.0.1; versionCode 2; target API 36; minimum API 26. Stable private test distribution certificate, RSA 3072, APK signature v2/v3. Direct installation release, not a Google Play publication.

Certificate SHA-256: `de4c3b4fb4a6cf8e2e820eda1574d9bbe310b1af2e2117cc47a26cfe1c492d61`.
APK SHA-256: `f4a4b4956054d4e9551d0509a31f9dee1beb5cb9df96e4b285dc7215106ceb01`.

Verified source/build: [Android 16 emulator run](https://github.com/TrinetZet/TZ/actions/runs/37221834310), including all missions, review scheduling, clipboard, saved file bytes, import/export/cancellation with Activity recreation, keyboard/back and force-stop persistence. Before merge, the release check installs signed 1.0.0, seeds valid learning data, updates to this signed APK, and verifies loaded answers, reviews, history, drafts and the offline guide after restart. API 26 and physical/OEM devices were not runtime-tested.

Team: Иноземцев Владислав Сергеевич — ОVМП-104ивс; Грушко Тимофей Андреевич — ОVМП-102ивс.

[Web version](https://trinetzet.github.io/TZ/clientbridge/) · [Source repository](https://github.com/TrinetZet/TZ/tree/master/clientbridge-android)

## New in 1.0.1

The project now contains equivalent Russian and English instructions. Russian is the default; the language choice survives restart independently of learning progress and JSON backups. The rest of the interface remains English. Install over 1.0.0 without uninstalling to retain data. The old release remains available.
