# TaskCapture Glass Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Выпустить TaskCapture 0.2.0 с плиткой TC, стеклянным интерфейсом, управляемыми статусами и Markdown-экспортом.

**Architecture:** Расширить существующее Java-приложение, SQLite и WorkManager. Отделить статус задачи от состояния обработки; общие UI-компоненты использовать на всех экранах. Захват через плитку использует короткую Activity с фокусом, экспорт — ограниченный FileProvider.

**Tech Stack:** Java 17, Android SDK 36/minSdk 26, AndroidX WorkManager 2.10.1, SQLite, текущие JNI/llama.cpp/Qwen3 и GitHub Actions.

**Spec:** docs/superpowers/specs/2026-10-14-taskcapture-glass-update-design.md

## Global Constraints
- Полностью офлайн; разрешение INTERNET не добавлять.
- versionCode 2, versionName 0.2.0; распространяемый ABI arm64-v8a.
- Статусы задач: backlog, in_progress, done. Обработка: pending, processing, ready, error.
- Ограничение захвата: 65 536 UTF-16 символов; текущие лимиты и полный исходник сохраняются.
- Палитра: графит, чёрный, белый и серебристые полутона, без зелёного.
- Цели касания не меньше 48 dp; системные отступы, Fold, увеличенный шрифт и TalkBack.
- «Добавлено в бэклог» показывать только после успешной записи, без ожидания LLM.
- Экспорт ВСЕХ задач в UTF-8 .md, независимо от фильтра.
- Не публиковать приватные ключи; не требовать удаления старого приложения.
- Зависимости модели, native оптимизации и ограничение потоков не менять.

## Review Focus
- Повторное создание capture Activity после записи не должно создавать вторую задачу — Task 3.
- Новый статус done во время inference не должен сбрасываться готовым результатом — Task 1.
- Многострочный Unicode/Markdown-исходник и description без текста должны попадать в экспорт — Task 2.
- Share-получатель должен читать URI после ухода Activity в фон, но не читать базу — Task 2.
- Отключённые анимации и перерисовка списка не должны скрывать успех или сбрасывать прокрутку — Tasks 3 и 4.

## File Structure
Все Java-пути ниже относительно taskcapture-android/app/src/main/java/com/trinetzet/taskcapture/.
TaskStatus.java — константы, валидация и русские названия business status.
Task.java, TaskDatabase.java, TaskRepository.java — статус, миграция, транзакционный снимок экспорта.
MarkdownExporter.java — чистая форматирующая функция без Android.
ExportController.java — save/share lifecycle и ошибки.
GlassUi.java, GlassBackground.java, GlassCardDrawable.java, SuccessView.java — единый визуальный язык и анимации.
CaptureActivity.java, ClipboardCapture.java, TaskTileService.java — входы, фокус и буфер.
MainActivity.java, TaskDetailActivity.java — фильтры, статусы, экспорт и адаптация.
Manifest/resources — плитка, тема, монохромные иконки и ограниченный FileProvider.
Unit/Android tests в существующих src/test и src/androidTest; workflow и scripts — проверка и доставка.

### Task 1: Статусы и миграция
**Files:** Create TaskStatus.java; modify Task.java, TaskDatabase.java, TaskRepository.java; extend StorageTest.java; create StatusTest.java в src/test.
**Interfaces:** Task.status: String; TaskStatus.requireValid(String): String; TaskStatus.label(String): String; TaskRepository.setStatus(String id,String status): boolean; TaskRepository.exportSnapshot(): List<Task> (включая source).
- [ ] Написать unit-тест: backlog/in_progress/done разрешены; неизвестное значение вызывает IllegalArgumentException. Android-тесты: v1 fixture после открытия v2 имеет прежние ID/source/count и status backlog; все переходы переживают reopen; complete после setStatus(done) оставляет done; несуществующий ID возвращает false.
- [ ] Запустить testDebugUnitTest и connectedDebugAndroidTest -PtestAbi=x86_64; убедиться, что новые тесты красные из-за отсутствующих интерфейсов.
- [ ] Реализовать SQLite v2 через ALTER TABLE ADD COLUMN status TEXT NOT NULL DEFAULT 'backlog'. Сохранить старый конструктор Task с default backlog для существующих тестов, добавить overload со status. Обновить проекции read/get/list. setStatus обновляет только status. exportSnapshot читает все поля в одной транзакции в стабильном порядке.
- [ ] Повторить тесты; ожидается PASS, включая существующие claim/retry/source проверки.
- [ ] Commit: feat: add independent task statuses and safe database migration.

### Task 2: Markdown и безопасное сохранение/отправка
**Files:** Create MarkdownExporter.java, ExportController.java; create res/xml/export_paths.xml; modify AndroidManifest.xml и app/build.gradle; create MarkdownExporterTest.java, ExportTest.java.
**Interfaces:** MarkdownExporter.render(List<Task> tasks,long exportedAt): String; ExportController(Activity,TaskRepository); showOptions(): void; onActivityResult(int,int,Intent): boolean. Provider authority = runtime packageName + ".exports".
- [ ] Написать unit-тест на fixture backlog/pending, in_progress/error, done/ready: все названия, исходники и статусы присутствуют; done имеет checkbox x; Unicode и строки с #, backticks, brackets не ломают структуру; пустой набор имеет валидный заголовок. Android-тест: ACTION_SEND содержит EXTRA_STREAM, ClipData, read grant и MIME; URI читается через resolver; попытка получить tasks.db URI отвергается.
- [ ] Запустить соответствующие тесты, подтвердить FAIL до реализации.
- [ ] Реализовать группировку backlog/in_progress/done, escaped inline title, quoted paragraphs source/description, время и состояние обработки. Экспорт использует exportSnapshot, а не видимый список. Save — ACTION_CREATE_DOCUMENT и запись на фоне в выбранный URI. Share — cache/exports, FileProvider read grant, chooser, fallback text/plain при отсутствии обработчика. Сохранить выбранный снимок при recreation, не держать большой текст в Bundle; временный файл хранится минимум 24 часа и очищается позже. Отмена меню без сообщения об ошибке.
- [ ] Запустить unit/Android-тесты; ожидается PASS и успешная UTF-8 запись в document provider.
- [ ] Commit: feat: export all task statuses to Markdown and share files.

### Task 3: Плитка, захват и стеклянное подтверждение
**Files:** Create TaskTileService.java, ClipboardCapture.java, SuccessView.java; modify CaptureActivity.java и manifest; create CaptureTest.java/TileTest.java.
**Interfaces:** ClipboardCapture.read(ClipboardManager): String (валидированный текст или IllegalArgumentException); TaskTileService extends TileService; CaptureActivity.EXTRA_CLIPBOARD — internal launch marker; SuccessView(Context), showSaved(Runnable onFinished): void.
- [ ] Написать тесты ClipData: пусто, изображение, пробельный текст, Unicode, превышение 65 536. Activity recreation после сохранения оставляет одну запись. Подтверждение с disabled animator scale видимо; ошибка сохранения не вызывает showSaved. Проверить, что internal clipboard launch не разрешён стороннему незащищённому intent через экспортируемый PROCESS_TEXT-вход.
- [ ] Запустить unit/Android-тесты, зафиксировать ожидаемые FAIL.
- [ ] Объявить TileService с BIND_QUICK_SETTINGS_TILE permission и QS_TILE intent. onClick: unlockAndRun при блокировке, запуск и collapse через PendingIntent на API34+, Intent на старых API. Использовать неэкспортируемую Activity/явный безопасный внутренний вход для clipboard, если разделение требуется для исключения spoofing. Читать буфер после window focus ровно один раз; delivery ID и saved ID переживают recreation. Сначала capture в SQLite, потом enqueue, затем SuccessView. Ошибку enqueue отделить от уже успешного сохранения. PROCESS_TEXT/SEND сохранить.
- [ ] Прогнать захват через тестовый путь, реальное нажатие плитки доступными средствами эмулятора, пустой буфер и возврат; unit/Android PASS. Документировать непроверенные OEM/lockscreen сценарии отдельно.
- [ ] Commit: feat: capture clipboard from Quick Settings with animated feedback.

### Task 4: Общий стеклянный интерфейс и рабочие статусы
**Files:** Create GlassUi.java, GlassBackground.java, GlassCardDrawable.java; modify MainActivity.java, TaskDetailActivity.java, SuccessView.java, res/drawable/icon.xml; add res/values/styles.xml; update FlowTest.java; create StatusUiTest.java.
**Interfaces:** GlassUi.text(Context,String,float): TextView; GlassUi.button(Context,String,Runnable): View; GlassUi.card(Context): Drawable; GlassUi.animateEntrance(View): void. Анимация учитывает ValueAnimator.areAnimatorsEnabled().
- [ ] Написать UI-тест: fixture из трёх статусов, фильтры выводят соответствующие записи; галочка переводит backlog в done, детальный выбор возвращает в in_progress; reopen сохраняет статус; экспорт при фильтре done содержит все три задачи. В FlowTest заменить привязку к старой надписи счётчика на доступные стабильные ID/content descriptions.
- [ ] Запустить UI-тесты, подтвердить FAIL на старом интерфейсе.
- [ ] Реализовать тёмный фон, световые пятна, полупрозрачные поверхности, кромки, мягкие тени и краткие анимации. MainActivity: четыре фильтра со счётчиками, карточки и галочка, экспорт, инструкция плитки и requestAddTileService на API33+. Detail: статусная панель, отдельный индикатор обработки/retry и selectable source. Обновление раз в 2 секунды меняет только изменившиеся данные и сохраняет позицию. Совместимость min26 и full source >600 сохраняется.
- [ ] Снять скриншоты главного/деталей/подтверждения: узкая и широкая область, font scale 1.3, анимации включены. Проверить визуально контраст, обрезания и отступы. Прогнать StatusUiTest и FlowTest; PASS.
- [ ] Commit: feat: redesign TaskCapture with monochrome glass surfaces and status controls.

### Task 5: Сборка, подпись и доставка 0.2.0
**Files:** Modify app/build.gradle, .github/workflows/taskcapture-android.yml, scripts/verify-apk.py, README.md; add signing/upgrade documentation to README.
**Interfaces:** workflow publishes TaskCapture-0.2.0-arm64.apk after apk+emulator success; verification JSON reports actual package/version/certificate digest.
- [ ] Добавить проверку package/version/certificate в verification script tests. Проверить legacy release workflow и доступные настройки подписи, не выводя секреты. При отсутствии прежнего приватного ключа использовать отдельный applicationId com.trinetzet.taskcapture.glass и label TaskCapture Glass, сохранив namespace/JNI классы.
- [ ] Подтвердить, что прежние assertion tests не проходят с ещё не обновлённым verification contract.
- [ ] Обновить versionCode 2/versionName 0.2.0, APK filenames/tag/release notes, Manifest/provider authority runtime package. Использовать стабильный защищённый CI key только если он реально доступен; иначе честно обозначить ограничение будущих обновлений. Не коммитить keystore и не публиковать его. Добавить проверку совместной установки legacy и новой APK при разной подписи и package.
- [ ] Запустить Actions: unit, optimized native flags, packaging/hash/no-INTERNET, ten-input actual model test, migration/storage/status/export/capture/UI Android tests. В отдельном визуальном шаге включить анимации и сохранить screenshot artifacts. Ожидается зелёный workflow; при ошибке исправить причину и повторить затронутые проверки.
- [ ] Commit: build: publish verified TaskCapture 0.2.0 safely alongside legacy version.

### Task 6: Итоговый обзор и выдача
**Files:** README.md и release notes при необходимости; весь diff обновления.
**Interfaces:** итоговая ссылка на release APK и Actions run.
- [ ] Провести один независимый обзор всей ветки по spec, особое внимание clipboard-focus, CAS/status, migration, provider permissions, signing и действительным UI-анимациям.
- [ ] Исправить найденные существенные ошибки, запустить затронутые проверки и дождаться зелёной публикации.
- [ ] Проверить release metadata: версия, размер, название файла, checksum и соответствие успешному source commit.
- [ ] Предоставить Владy прямую ссылку APK, инструкцию добавления плитки и фактический путь установки. Если отдельный package — прямо объяснить, что старая версия и её задачи сохраняются отдельно. Не заявлять проверку физического Fold, если её не было.

## Execution recommendation
Native: выполнять задачи самой в этой сессии, затем один независимый итоговый reviewer. Задачи зависят от общего status/export/UI контракта; единый исполнитель уменьшает повторное чтение контекста и стоимость. До реализации требуется согласование этого плана и выбор метода.
