# ClientBridge Android verification

Verified version 1.0.0 (code 1), package com.trinetzet.clientbridge, minimum API 26 / Android 8.0, target API 36.

## Completed source and emulator checks

[GitHub Actions run 37219361436](https://github.com/TrinetZet/TZ/actions/runs/37219361436), source commit ca20799, completed successfully. Java 17, Gradle 8.13, AGP 8.13.2, SDK/build tools 36.0.0. Unit tests and debug/release/test APK compilation passed. Android 16 / API 36 x86_64 Pixel 2 emulator, Wi-Fi and mobile data disabled; APK requests no permissions.

Both instrumentation invocations reported `OK (1 test)`:

- All 12 missions completed with correct feedback and 100% best-response results; catalog contains 36 phrases.
- Eight-card flashcard session updates review scheduling.
- Email edits persisted; native clipboard contains the exact email text.
- Actual Android system Save picker writes .txt and JSON; saved bytes were read back and checked.
- Save survives Activity destruction with “Don't keep activities”. Cancellation is reported honestly.
- Actual touched Import button opens system document picker; selected JSON restores all 12 history attempts and the edited draft after Activity recreation, with the original import confirmation.
- Actual textarea touch opens Android keyboard; Back hides keyboard and navigates through hash routes. No horizontal document overflow.
- Force-stop/relaunch retains all 12 history attempts and draft text. An abandoned pending export file is discarded; a new export opens normally.

Screenshots were visually inspected for practice, results, email studio, restored progress and restart. The standalone Android adapter browser test also verifies current in-memory backup export when storage writes fail.

## Signed binary

The tested unsigned release was aligned for 16 KB pages and signed locally using a stable private test distribution key, kept outside Git and deliverables. Every compiled APK ZIP entry remains byte-identical after signing.

APK SHA-256: `d6fc2d37ced24870487def8cb3e48d02587fb13f7573fe833b8147edfb3fef06`.
Certificate SHA-256: `de4c3b4fb4a6cf8e2e820eda1574d9bbe310b1af2e2117cc47a26cfe1c492d61`.
RSA 3072; APK signature schemes v2 and v3 verified; one signer. Signed APK size 1,024,689 bytes. Direct APK installation; no Google Play publication.

The release workflow verifies checksum/certificate and installs the exact signed APK offline on Android 16 before the PR is merged; the master publication step re-verifies the same bytes. Its actual run and public re-download comparison are recorded in the delivered verification report after publication.

## Scope and preservation

All existing `clientbridge/` files and root HTML remain unchanged. APK copies the seven web runtime assets; only generated index/app files gain Android adapter integration. No private keys, signing passwords or developer caches are in source/archive outputs. The bridge is origin/main-frame scoped and blocks external navigation/assets, validates payload sizes and filenames, and uses only explicit system-selected file URIs.

API 26 and physical/OEM devices were not runtime-tested. Android 8+ requires an up-to-date compatible Android System WebView supporting the message bridge; older providers show an update message. Hardware/OEM picker behavior remains outside emulator coverage.
