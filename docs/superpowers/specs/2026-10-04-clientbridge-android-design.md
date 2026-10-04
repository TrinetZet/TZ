# ClientBridge Android design

User approved an installable Android APK with offline parity, a polished icon, verified emulator flows and a public direct download. The user explicitly requested autonomous implementation and authorised CI and publishing. Google Play is out of scope.

## Architecture
Separate `clientbridge-android/`, retaining all existing web files and hosting. Java 17 / Android Gradle Plugin 8.13.2 / Gradle 8.13. Android 8+ (API 26), target/compile 36; requires a sufficiently current Android System WebView. Build copies the seven current ClientBridge files; only the bundled index gains an Android adapter script. Assets are served through WebViewAssetLoader at a virtual HTTPS origin with explicit JavaScript MIME for mjs.

No INTERNET or broad storage permission. WebView main navigation and subresources are restricted to the packaged origin and allowlisted assets. A main-frame-only WebMessageListener is bound to that exact origin. Messages are validated and restricted to copying text or saving text via Android system document chooser. Import uses WebChromeClient and user-selected content URI. Export callback reports cancellation and failure honestly. Persistent DOM storage, hash/back navigation, keyboard/insets and view restoration preserve the existing learning flow.

## Signing and delivery
CI builds and runs unit/instrumentation tests, exporting an unsigned release package plus reports. The final APK is signed locally with a stable test-distribution key held in private work storage outside git and deliverables. No key or credential is committed. The signed APK may be committed as a public distribution binary, then a minimal CI job verifies its signature/hash and publishes it as a GitHub Release asset. CI uses its built-in scoped token; no additional personal credentials. This is a directly installable test-signed APK, not a Play Store release.

## Verification
Unit tests reject untrusted paths, excessive payloads and unsafe names. Emulator tests exercise offline missions, scores, review, draft persistence, clipboard, actual save/import chooser, cancel handling, back and keyboard. Force-stop/relaunch test checks persistent progress. Compare final APK runtime assets to the tested release build; verify signature, package/min SDK and downloaded bytes. State physical device testing limits plainly. Preserve offline current content; later website updates require a new APK.

## Icon
Navy/mint custom bridge/chat identity, adaptive foreground/background, themed monochrome, fallback mipmaps, SVG source and PNG512/1024 delivered. Two students named as project team; no invented partner implementation contribution.
