#!/usr/bin/env bash
set -euo pipefail
trap 'mkdir -p ui-artifacts; adb pull /sdcard/Download/taskcapture-qa/. ui-artifacts/ >/dev/null 2>&1 || true' EXIT
adb shell settings put global airplane_mode_on 1
adb shell svc wifi disable
adb shell svc data disable
./gradlew --no-daemon connectedDebugAndroidTest -PtestAbi=x86_64
# The Gradle connected test task uninstalls the tested apps. Reinstall before visual QA.
adb install -r app/build/outputs/apk/debug/app-debug.apk
adb install -r app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk
adb shell settings put global window_animation_scale 1
adb shell settings put global transition_animation_scale 1
adb shell settings put global animator_duration_scale 1
adb shell am instrument -w -r -e class com.trinetzet.taskcapture.VisualTest com.trinetzet.taskcapture.glass.test/androidx.test.runner.AndroidJUnitRunner | tee visual-test.log
if ! grep -Fq 'OK (1 test)' visual-test.log; then exit 1; fi
mkdir -p ui-artifacts
adb pull /sdcard/Download/taskcapture-qa/. ui-artifacts/
adb shell am force-stop com.trinetzet.taskcapture.glass
# The legacy release contains arm64 native libraries; an x86-only emulator cannot install it.
if [[ "$(adb shell getprop ro.product.cpu.abilist)" != *arm64-v8a* ]]; then
  printf '%s\n' 'Legacy arm64 coinstallation not exercised: emulator has no arm64 ABI' > ui-artifacts/coinstall.txt
  exit 0
fi
curl --fail --location --retry 2 -o legacy.apk https://github.com/TrinetZet/TZ/releases/download/taskcapture-android-0.1.0-38464382957/TaskCapture-0.1.0-arm64.apk
adb install -r legacy.apk
adb shell pm path com.trinetzet.taskcapture | grep -Fq 'package:'
adb shell pm path com.trinetzet.taskcapture.glass | grep -Fq 'package:'
printf '%s\n' 'Legacy and Glass applications installed alongside each other' > ui-artifacts/coinstall.txt
