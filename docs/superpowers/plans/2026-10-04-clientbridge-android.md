# ClientBridge Android Implementation Plan

> Implement inline with executing-plans. Independent icon work delegated under dispatching-parallel-agents; user approved autonomous work.

Goal: verified offline Android APK with stable test signing and a public direct download.
Architecture: trusted local WebViewAssetLoader + scoped message adapter + native document/clipboard integration. CI builds/tests; local private key signs release; CI publishes the signed binary.
Tech: Java17, AGP8.13.2, Gradle8.13, SDK36, API26 minimum, AndroidX WebKit.
Spec: docs/superpowers/specs/2026-10-04-clientbridge-android-design.md

Global constraints: keep root HTML/web assets and Pages unchanged; no INTERNET/storage-wide permission, no privileged bridge for outside content, no signing keys in git/artifacts, no fabricated coauthorship.
Review focus: cancelled chooser; pending native message across pause; malicious export filename; module MIME on virtual HTTPS; reload/force-stop persistence.

1. Native shell + policy tests: write failing policy tests, add Gradle/native shell/assets adapter, run CI tests and assemble.
2. Emulator parity: write instrumentation checks; exercise all learning surfaces, offline, persisted drafts/progress, clipboard, real document save/import/cancel, back/keyboard. Capture screenshots and reports.
3. Icon: generate native adaptive/themed/fallback assets and designer source; visually inspect.
4. Signing/publication: download tested unsigned release, create/reuse private test signing key, sign/verify APK, expose signed binary through GitHub Release workflow, verify public download and source preservation.
5. Delivery: English run/install/security/signing notes and verification; APK/icon/source copies for both students and outputs.

Ledger: fresh clean clone checkout branched feat/clientbridge-android from master6794e5e. No local Java/SDK; CI used. Stable signing stays in work/android-private excluded from repository and user outputs.
