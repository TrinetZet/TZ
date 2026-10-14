# TaskCapture Windows Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans inline. Steps use checkbox syntax; one whole-branch independent review.

**Goal:** Выпустить устанавливаемую Windows-версию с выделением по горячей клавише, локальной моделью и редактируемым MD-бэклогом.
**Architecture:** Pure .NET core handles validated MD/tasks/statuses. WPF owns UI, Win32 capture and background queue. Separate native process reuses pinned Android engine; Actions builds and verifies self-contained installer.
**Tech Stack:** .NET10/C#/WPF/Win32, C++17/llama.cpp/Qwen3, Inno Setup, GitHub Actions Windows2022.
**Spec:** docs/superpowers/specs/2026-10-14-taskcapture-windows-design.md

## Global Constraints
- Windows x64, feat/taskcapture-windows; Android and master untouched.
- UTF8 MD only task store; three readable texts, editable stages, mandatory backlog.
- Capture65536 UTF16; inference first600codepoints,300sec,4threads; offline bundled pinned model.
- No task success before durable write, no silent arbitrary MD overwrite or stale clipboard capture.
- Reduced motion, monochrome glass, current-user installer and unsigned distribution honestly described.

## Review Focus
- Model result after manual title/source or status edit must preserve the user's edits (Task1/2).
- Existing arbitrary MD, malformed file, external editor save or deletion must not lose data (Task1).
- Clipboard unchanged or focus changed must not reuse stale text; modifier release and hotkey conflicts (Task2).
- Custom stage deletion and a file switch must retain tasks/queue at original path (Task1/3).
- Background capture must work with window hidden and toast must not take selection focus (Task2/3).

### Task1: Canonical MD and task mutations
Files: Core/Models.cs, MarkdownCodec.cs, MarkdownStore.cs; Core.Tests/Program.cs/csproj.
Interfaces: TaskItem immutable record; TaskStage(Id,Name,IsDone); TaskDocument(Stages,Tasks). MarkdownCodec.Encode/Decode. MarkdownStore.Read(),Capture(source),Edit(id,expectedFingerprint,title,description,source),SetStage(id,stageId),ReplaceStages(stages),Complete(id,revision,normalized),Fail(id,error),Retry(id),Dispose().
- [ ] Write tests for Unicode/fences roundtrip, all stages readable, invalid input, disk reopen/edit/status, external valid/malformed/deleted file, .bak and second-store lock, manual edit vs inference and orphan-stage rejection; run RED.
- [ ] Implement atomic UTF8 store and validation. Observe GREEN across all core tests. Commit.

### Task2: Capture and offline processing
Files: Core/PromptBuilder.cs, OutputValidator.cs; App/HotkeyService.cs, SelectionCapture.cs, NativeMethods.cs, OfflineModel.cs, TaskQueue.cs, AppSettings.cs; native/CMakeLists.txt/worker.cpp; Windows.Tests/Program.cs/csproj.
Interfaces: Hotkey.Parse(string)/TryRegister(hwnd,combination); SelectionCapture.CaptureAsync() -> string with foreground+clipboard sequence checks; OfflineModel.NormalizeAsync(source,ct) -> NormalizedTask; TaskQueue operates original MarkdownStore and Changed/Error events, cancellation on store switch.
- [ ] Test literal prompt bounds/instruction quoting, malformed output, actual Win32 hotkey copy across a second process and no-selection/clipboard unchanged, registration conflict. Run RED.
- [ ] Implement modifier release/copy/focus guards, settings atomic persistence, bounded UTF8 worker. Run core+Windows contracts and real model output. Commit.

### Task3: Glass UI and lifecycle
Files: App/App.xaml/cs, MainWindow.xaml/cs, Glass.xaml, SetupWindow.xaml/cs, StageWindow.xaml/cs, EditWindow.xaml/cs, ToastWindow.xaml/cs, Motion.cs, TrayService.cs, App.ico.
Interfaces: Main owns store and queue; settings Save validates new hotkey/path before old replaced; task editor fingerprint CAS; each saved mutation Refresh() and immediate MD write. Tray holds app alive and Exit disposes queue/hotkey/store.
- [ ] Windows tests first exercise fresh setup, source/title/description update written in MD, custom model, filtered status list, narrow window/animations off and task hidden-window capture; run RED.
- [ ] Implement UI and startup/exit/path-switch behavior with cancellation. Capture actual WPF screenshots; inspect. Run suite GREEN. Commit.

### Task4: Installer, independent review and release
Files: scripts/build.ps1, qa.ps1, verify-dist.py; installer.iss; dependencies lock references; README.md; .github/workflows/taskcapture-windows.yml.
- [ ] Run build verification tests with wrong model hash/missing runtime; observe RED. Implement self-contained publish/native model packaging and Inno Setup current-user install/uninstall. Verify GREEN.
- [ ] Actions: core tests, real Win32/WPF tests, native actual model, distribution hashes, installation and retained MD after uninstall. Upload QA screenshots/logs and installer/portable/checksums. Independent reviewer on full branch; fix Important/Critical with reproductions and green checks.
- [ ] Publish exact successful artifact on current source head, verify release assets/SHA, direct installer link and documented limitations. Keep feature branch; no master merge.
