#!/usr/bin/env bash
set -euo pipefail
mkdir -p clientbridge-android/release-evidence
trap 'adb logcat -d > clientbridge-android/release-evidence/logcat.txt; adb exec-out screencap -p > clientbridge-android/release-evidence/installed-release.png' EXIT
adb shell svc wifi disable
adb shell svc data disable
adb install clientbridge-android/distribution/ClientBridge-v1.0.0.apk
adb shell am start -W -n com.trinetzet.clientbridge/.MainActivity
sleep 6
adb shell pidof com.trinetzet.clientbridge
adb shell uiautomator dump /sdcard/clientbridge-ui.xml
adb pull /sdcard/clientbridge-ui.xml clientbridge-android/release-evidence/ui.xml
grep -q 'Your next great conversation' clientbridge-android/release-evidence/ui.xml
adb shell am force-stop com.trinetzet.clientbridge
adb shell am start -W -n com.trinetzet.clientbridge/.MainActivity
sleep 3
adb shell pidof com.trinetzet.clientbridge
