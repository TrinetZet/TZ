#!/usr/bin/env bash
set -euo pipefail
adb shell settings put global airplane_mode_on 1
adb shell svc wifi disable
adb shell svc data disable
./gradlew --no-daemon connectedDebugAndroidTest -PtestAbi=x86_64
adb shell am force-stop com.trinetzet.taskcapture
adb shell am start -n com.trinetzet.taskcapture/.MainActivity
adb shell uiautomator dump /sdcard/taskcapture-ui.xml
adb pull /sdcard/taskcapture-ui.xml emulator-ui.xml
