# TaskCapture Android Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking. Native execution is proposed; user review is pending.

**Goal:** Build an installable Android APK that captures selected text, saves a task automatically, and normalizes it with a bundled local LLM.

**Architecture:** Native Kotlin Android app with SQLite as the durable queue and task store. A text capture Activity persists input before scheduling WorkManager; a serialized JNI llama.cpp worker replaces provisional fields after validated inference. Android UI reads the same store.

**Tech Stack:** Kotlin, Android SDK/NDK, SQLiteOpenHelper, WorkManager, llama.cpp, bundled Qwen3 0.6B GGUF Q4, GitHub Actions.

**Spec:** docs/superpowers/specs/2026-10-13-taskcapture-android-design.md

## Global Constraints
- Repository TrinetZet/TZ, branch feat/taskcapture-android; new application under taskcapture-android.
- Android first; Windows, hotkey, OCR and screenshot capture excluded from this release.
- Real local LLM; weights bundled in APK; no phone-side download.
- Automatic save without confirmation; original text remains durable on inference failure.
- arm64-v8a installable build; x86_64 validation build only for emulator testing.
- No INTERNET, Accessibility, contact permissions, analytics or remote inference.
- Database backup disabled; Russian UI and actionable errors.
- No release private signing key in the public repository.
- Completed Actions build and actual APK required before claiming delivery.

## Review Focus
- Duplicate intent delivery during Activity recreation must not duplicate a captured record.
- Process death during inference must leave a recoverable task and intact source.
- Malformed model output or text injection must not overwrite the source or fabricate success.
- Full disk, oversized input and large import must fail visibly without corrupting existing tasks.
- Android background restrictions must delay processing without losing an already saved task.

## File Structure
Prefix: taskcapture-android/.
- settings.gradle.kts, build.gradle.kts, app/build.gradle.kts, gradle.properties: independent Android build.
- app/src/main/AndroidManifest.xml and res/: permissions, Russian labels, theme, icon.
- app/src/main/java/com/trinetzet/taskcapture/model/Task.kt: task/status types.
- .../capture/CaptureInput.kt, CaptureActivity.kt: validated external text and durable save.
- .../storage/TaskDatabase.kt, TaskRepository.kt: schema, transactions, atomic queue claim.
- .../inference/NativeModel.kt, ModelInstaller.kt, OutputValidator.kt: JNI, verified bundled weights, JSON contract.
- .../processing/ProcessingWorker.kt, QueueScheduler.kt: bounded serialized jobs, recovery.
- .../ui/MainActivity.kt, TaskEditor.kt: list/search/status/source/edit/delete/undo/manual capture.
- .../transfer/TaskTransfer.kt: bounded versioned JSON import/export.
- app/src/main/cpp/CMakeLists.txt, taskcapture_jni.cpp: native integration.
- scripts/prepare-dependencies.py, dependencies.lock.json: pinned upstream/weights and hashes.
- app/src/test/... and app/src/androidTest/...: unit, database, capture, worker and UI checks.
- fixtures/extraction.jsonl: synthetic Russian extraction examples.
- scripts/verify-apk.py, scripts/emulator-check.sh: packaged offline and E2E checks.
- README.md, docs/PRIVACY.md, docs/PROGRESS.md, THIRD_PARTY_NOTICES.md: install, limits and evidence.
- .github/workflows/taskcapture-android.yml: scoped CI and APK artifact.

## Task 1: Durable text capture and Android skeleton
**Interfaces:** Task(id: String, title: String, description: String, sourceText: String, status: TaskStatus, processing: ProcessingStatus); CaptureInput.parse(action: String?, text: CharSequence?): String; TaskRepository.capture(text: String, deliveryId: String): String; TaskRepository.get(id: String): Task?.
**Files:** build configuration, manifest/resources, model/, capture/, storage/; CaptureInputTest.kt and CapturePersistenceTest.kt.
- [ ] Write tests rejecting blank/unsupported/over-65536-character input, preserving Russian/emoji text, and rejecting duplicate deliveryId.
- [ ] Run unit/instrumentation tests before implementation; confirm meaningful failure.
- [ ] Create Android app minSdk 26, target/compileSdk 36, applicationId com.trinetzet.taskcapture. Reuse repository Gradle wrapper only after verifying its version; choose and lock compatible AGP/Kotlin/NDK versions in the build files.
- [ ] Implement SQLite v1 tables with UNIQUE delivery_id; task and queue states saved in a transaction. Provisional title uses first 100 characters, description keeps text; this is an explicitly pending task, not an AI result.
- [ ] Implement PROCESS_TEXT and SEND text/plain, exported capture Activity, no confirmation. Persist before scheduling/finish; preserve deliveryId across saved state. Catch persistence failures and show Russian error without false success.
- [ ] Verify close/reopen persistence, delivery recreation, blank and oversized inputs, and simulated database write failure.
- [ ] Commit deliverable.

## Task 2: Bundled model and native inference
**Interfaces:** ModelInstaller.ensureInstalled(context: Context): File; NativeModel.extract(modelPath: String, text: String): String; OutputValidator.parse(json: String): NormalizedTask(title: String, description: String).
**Files:** inference/, cpp/, scripts/prepare-dependencies.py, dependencies.lock.json, fixtures/, THIRD_PARTY_NOTICES.md; OutputValidatorTest.kt and NativeModelTest.kt.
- [ ] Write tests for empty/malformed JSON, empty title, excessive fields, 160-character title/4096-character description limits, Unicode and unchanged source.
- [ ] Run validator tests and confirm failure before implementing validator.
- [ ] Resolve upstream llama.cpp commit and Qwen3-0.6B Q4_K_M GGUF artifact from a documented model repository. Record immutable revisions, exact URL/path, SHA-256, model license and llama.cpp MIT notice. Fail dependency preparation on mismatch; do not commit model bytes to Git.
- [ ] Follow official llama.cpp Android example/API at the selected pinned commit; wire CPU backend through JNI and CMake for arm64-v8a and x86_64, with generic ISA settings for compatibility.
- [ ] Implement atomic asset copy, available-space check and SHA-256 verification. Infer with 2048-token context, <=256 output tokens, 4 CPU threads, fixed task instruction, no tools, /no_think and constrained title/description JSON. Input beyond context gets visible truncation marker while full source stays in SQLite.
- [ ] Implement validator; reject invalid output instead of treating it as normalized. Catch runtime errors and keep the original task.
- [ ] Run at least 10 synthetic Russian examples with the actual bundled model. Record input/output validity and latency without asserting unmeasured quality; injection input cannot invoke tools or modify other records.
- [ ] Commit deliverable with dependency pinning and license evidence.

## Task 3: Recoverable background processing
**Interfaces:** QueueScheduler.enqueue(context: Context): Unit; ProcessingWorker.doWork(): ListenableWorker.Result; TaskRepository.claimNext(): Task?; TaskRepository.complete(id: String, normalized: NormalizedTask): Unit; TaskRepository.fail(id: String, code: String): Unit; TaskRepository.retry(id: String): Unit.
**Files:** processing/, queue-related storage functions; ProcessingWorkerTest.kt and QueueRecoveryTest.kt.
- [ ] Write tests with fake inference for one active task, successful normalized update, malformed result/error retaining source, process interruption reclaim, retry, and scheduling delay retaining queued tasks.
- [ ] Confirm failures before worker implementation.
- [ ] Implement unique sequential WorkManager queue and atomic claims, with persisted claim timeout and resumable queue drain. Bound attempts; retries after user action reset error/attempt state. Keep deleted tasks deleted if late inference completes.
- [ ] Use real Android foreground execution only where required, declaring the applicable service type and runtime behavior according to the target SDK. Do not promise immediate completion after background capture.
- [ ] Run capture -> queue -> actual inference -> durable normalized task on emulator. Kill/relaunch during processing and verify source survives and ID remains stable.
- [ ] Commit deliverable.

## Task 4: Usable backlog and portable files
**Interfaces:** TaskRepository.list(query: String, status: TaskStatus?): List<Task>; update/delete/restore functions; TaskTransfer.export(tasks: List<Task>): String; TaskTransfer.import(json: String, repository: TaskRepository): ImportResult.
**Files:** ui/, transfer/, storage CRUD; TaskTransferTest.kt and BacklogUiTest.kt.
- [ ] Write tests for manual/edit/status/search, source preservation after edit, delete/undo, version-1 export round trip, conflicting ID, malformed/oversized import and database rollback.
- [ ] Confirm failing tests before implementation.
- [ ] Implement Russian task list, search, backlog/in progress/done, detail/editor and pending/error labels. Include retry and manual creation. Show model preparation/processing truthfully.
- [ ] Implement import/export through Storage Access Framework. JSON v1 imports limited to 5 MiB and 10000 records; validate entire file before transaction. Preserve IDs if new, skip identical records, issue new IDs for conflicting records, reject unsupported schema.
- [ ] Run UI and persistence/transfer checks after process restart.
- [ ] Commit deliverable.

## Task 5: Actions APK delivery and evidence
**Interfaces:** scripts/verify-apk.py APK_PATH prints verification summary and exits nonzero on missing assets/native runtime, unexpected INTERNET permission or wrong applicationId. Workflow outputs signed TaskCapture APK, SHA256SUMS.txt and verification report.
**Files:** scoped workflow, verification scripts, README/docs.
- [ ] Add checks that fail on missing GGUF/ABI, incorrect hash, internet permission, backup-enabled manifest, or unsigned APK.
- [ ] Implement workflow scoped to this branch/project: checkout, Java 17, SDK 36/build-tools 36, pinned NDK/CMake/Gradle, verified dependencies, unit tests, native builds and assembleDebug/assembleDebugAndroidTest.
- [ ] Run x86_64 emulator checks with networking disabled and a bundled model; verify PROCESS_TEXT and SEND, DB persistence, one real inference, JSON import/export and worker recovery. Distinguish emulator evidence from real phone checks.
- [ ] Use debug signing for the clearly labeled test APK. Do not claim production signing or stable upgrade identity; keep the unsigned release build separate if generated.
- [ ] Upload arm64 APK and report with SHA-256 through Actions artifact; configure upload size/compression for the large bundled model. Use an actual artifact download link after success; do not invent release URLs.
- [ ] Push via GitHub connector, inspect the resulting Actions run and logs, fix failures, and wait for successful completion.
- [ ] Update docs/PROGRESS.md with DONE/PARTIAL/BLOCKED evidence, package size, commit/run IDs, model/license versions and unperformed device checks.
- [ ] Commit and deliver a specific APK artifact link with brief install steps. Ask Vlad to test in airplane mode on Fold; real-device test remains pending until observed.

## Plan Self-Review
Each specification section maps to a task: capture/persistence (1), local model/licenses (2), recovery/background (3), register/export (4), permissions/CI/install/report (5).
Review Focus failures have explicit tests in tasks 1, 2, 3 and 4.
No promised cloud calls or rule-based substitute. Actual model integration/packaging remains a required release criterion.
Source links for implementation research: https://github.com/ggml-org/llama.cpp/blob/master/docs/android.md and the Android API documentation at the pinned implementation stage.
Execution recommendation: native, because all tasks share the persistence/inference interfaces and the user requested direct delivery; avoid separate agent handoffs.
