# ClientBridge for Android

Offline business English practice by Иноземцев Владислав Сергеевич (ОVМП-104ивс) and Грушко Тимофей Андреевич (ОVМП-102ивс).

Version 1.1.0 (version code 3), package `com.trinetzet.clientbridge`. Minimum Android 8.0 (API 26), with an up-to-date Android System WebView. Target API 36. Built with Java 17, Gradle 8.13, Android Gradle Plugin 8.13.2 and AndroidX WebKit 1.14.0.

## Install and use

Download the APK from the GitHub Release and open it on Android. Permit installation from the browser/file manager when Android asks. Open ClientBridge; the full learning material is already inside the APK and works without a connection.

12 topics with three distinct difficulties (36 mission versions / 108 decisions / 324 replies), 36 phrases, spaced flashcards, contextual feedback, an editable email studio, local history and JSON backups are included. Copy email uses Android clipboard. Download .txt and Export progress open Android’s system Save picker. Import backup opens Android’s system file picker and asks for confirmation before replacing progress. Back returns through app navigation; the keyboard follows normal Android behavior. Progress survives closing and restarting the app. Uninstalling or clearing app data removes local progress; export a backup first if you wish to retain it. Backups can contain your edited drafts.

This distribution uses a stable private test signing certificate and is intended for direct APK installation. It is not published to Google Play. Future updates must use the same key and a higher version code. The private key is stored outside Git and all delivered files.

## Architecture and boundaries

The website includes a bilingual guide under The project; Russian is the default and its preference is stored separately from learning progress. `bundleWeb` copies its eleven runtime files into generated APK assets and adds an Android-only action adapter. Content loads from the HTTPS virtual asset origin using WebViewAssetLoader; .mjs assets have JavaScript MIME types. No INTERNET permission, analytics, broad storage permission or external server is needed.

The bridge uses AndroidX origin-scoped WebMessageListener, only for the exact trusted main document. Requests validate action, id, UTF-8 length and generated filenames. External navigation and network assets are blocked. The bridge writes clipboard text; it does not read clipboard content. File access is limited to URIs explicitly chosen in the Android system picker. The pending save payload is retained privately across Activity recreation and removed after completion or cancellation. Imported files are limited to 1 MB and use the existing application validator and confirmation.

## Build and verify

`./gradlew testDebugUnitTest assembleDebug assembleRelease assembleDebugAndroidTest` builds on Java 17 and SDK 36. Release output is unsigned by default. Never commit private signing keys. GitHub Actions builds and runs Android emulator checks; results, screenshot evidence and build outputs are retained. The publication workflow verifies and publishes the separately signed, tested release APK.

Unit checks cover origin restrictions, filename sanitization and payload size. Emulator checks exercise all 12 missions, all 36 phrases, flashcard scheduling, native clipboard, real .txt/JSON saving, cancellation, real JSON picker import, history restoration, keyboard/back, and persistence after force-stop. Hardware testing and OEM-specific picker differences are separate from emulator verification. See VERIFICATION.md for the actual completed run and binary checks.

## Update from 1.0.1

Install 1.1.0 over the previous app, without uninstalling. It uses the same signing certificate and package. Previous answers/history/partial progress remain in Legacy, with reviews and drafts preserved; they do not grant Beginner/Advanced/Expert credit. v1 backups migrate, v2 backups preserve all three profiles and saved reply orders. The release workflow tests this actual signed upgrade offline. The validation-only instrumentation APK in distribution/validation is a CI test runner, not an end-user install.

## Learning model

Choose Beginner, Advanced or Expert in Practice room and My progress. Each level has independently authored contexts, choices and feedback; Expert explores pragmatic nuance rather than longer sentences. Reply order is shuffled once per attempt and saved. Percentages award partial credit in Context judgment / Relationship & tone / Action & risk; Best-reply accuracy separately counts strongest contextual choices. Neither rubric points nor Expert practice certify CEFR or native proficiency. Profiles/recommendations are level-specific; no completed missions show Not enough practice, fewer than three distinct missions are limited evidence. The last completed profile stays visible during an unfinished retry.

The content audit covers character/word longest and shortest strategies (conservative highest-score ties), all source positions and decision ordinals. Longest now selects the best reply in 36/108 decisions; it earns 690/972 partial-credit points (70.99%), below uniformly random expected 71.57%. The former library allowed 100% by length. Source-position best answers and best length ranks are balanced 36/36/36; per-level 12/12/12.
