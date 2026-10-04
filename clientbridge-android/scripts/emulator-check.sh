#!/usr/bin/env bash
set -euo pipefail
collect() {
 adb shell settings put global always_finish_activities 0 || true
 adb logcat -d > clientbridge-android/emulator-logcat.txt || true
 adb exec-out screencap -p > clientbridge-android/emulator-screen.png || true
 adb pull /sdcard/Android/data/com.trinetzet.clientbridge/files/screenshots clientbridge-android/emulator-screenshots || true
}
trap collect EXIT
adb install -r clientbridge-android/app/build/outputs/apk/debug/app-debug.apk
adb install -r clientbridge-android/app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk
adb shell svc wifi disable
adb shell svc data disable
adb shell settings put secure show_ime_with_hard_keyboard 1
adb shell am instrument -w -r -e class 'com.trinetzet.clientbridge.OfflineTest#learningAndNativeFiles' com.trinetzet.clientbridge.test/androidx.test.runner.AndroidJUnitRunner | tee clientbridge-android/emulator-learning.txt
grep -q 'OK (1 test)' clientbridge-android/emulator-learning.txt
adb shell am force-stop com.trinetzet.clientbridge
printf '%s' '{"id":"9","text":"abandoned"}' | adb shell "run-as com.trinetzet.clientbridge sh -c 'cat > files/pending-export.json'"
adb shell am instrument -w -r -e class 'com.trinetzet.clientbridge.OfflineTest#persistedAfterForceStop' com.trinetzet.clientbridge.test/androidx.test.runner.AndroidJUnitRunner | tee clientbridge-android/emulator-restart.txt
grep -q 'OK (1 test)' clientbridge-android/emulator-restart.txt
