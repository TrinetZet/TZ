# ClientBridge Android 1.1.0

Three independently authored practice levels: Beginner, Advanced and Expert. Twelve topics × three levels × three decisions = 36 mission versions, 108 contextual decisions and 324 credible replies. Expert explores pragmatic nuance, not a CEFR/native certificate.

Choose difficulty in Practice room or My progress. Reply order is shuffled once per attempt and saved. Profiles, accuracy, attempts and recommendations are separate per level. Best-reply accuracy is shown alongside partial-credit points: longest-response selection now yields 36/108 best replies (33.33%) and 690/972 practice points (70.99%), versus uniformly random expected 71.57% points. The old library allowed 100% from length alone.

Previous answers, partial attempts, history and drafts remain Legacy; shared reviews/drafts stay intact. Old v1 backups migrate without granting new-level mastery. Russian/English instructions under The project are updated, Russian by default; their preference stays independent.

Install **ClientBridge-v1.1.0.apk** over 1.0.1 without uninstalling. Android 8.0+ with an up-to-date compatible Android System WebView. Clipboard and actual system Save/Open pickers support .txt and JSON; no network or permissions are required. Export a backup before clearing data/uninstalling.

Package `com.trinetzet.clientbridge`; versionName 1.1.0; versionCode 3; min API 26; target API 36. Same stable private test distribution certificate, RSA3072, APK v2/v3. Direct installation, not Google Play.

Certificate SHA-256: `de4c3b4fb4a6cf8e2e820eda1574d9bbe310b1af2e2117cc47a26cfe1c492d61`.
APK SHA-256: `faca686dad386b1ff6f11771ac10720b84418e8784ca84b514ecfa752a0addc0`.

[Full offline build/emulator checks](https://github.com/TrinetZet/TZ/actions/runs/37225709696) passed, including all36missions, native files/clipboard, recreation, import, keyboard/back and force-stop persistence. Before merge the release workflow tests the exact signed APK updating 1.0.1, verifies loaded Legacy/empty new profiles, guide/difficulty restart, then repeats full native checks. Physical/OEM devices and API26 were not runtime-tested.

Team: Иноземцев Владислав Сергеевич — ОVМП-104ивс; Грушко Тимофей Андреевич — ОVМП-102ивс. Unverified partner contributions are not attributed.

[Website](https://trinetzet.github.io/TZ/clientbridge/) · [Source](https://github.com/TrinetZet/TZ/tree/master/clientbridge-android)
