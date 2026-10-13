# Проверки TaskCapture Android
- DONE: упрощённый сценарий и план утверждены пользователем.
- DONE: локальные CaptureInput (5), OutputValidator (9), PromptBuilder (3) проверки RED→GREEN.
- DONE: Android storage RED подтверждён на эмуляторе run 38452917826 до реализации SQLite.
- PARTIAL: SQLite, захват PROCESS_TEXT/SEND, очередь, JNI-инференс и простой бэклог реализованы; проверка финальной сборки ещё идёт.
- PARTIAL: модель закреплена по SHA-256 и включается в APK на сборке; реальный инференс проверяется CI.
- NOT STARTED: тест на реальном Samsung Fold пользователя.
- NOT STARTED: Windows и горячая клавиша (отдельный этап).
- EXCLUDED: OCR, ручное создание, поиск, проекты, импорт/экспорт.
