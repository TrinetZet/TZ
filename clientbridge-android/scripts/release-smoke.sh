#!/usr/bin/env bash
set -euo pipefail
mkdir -p clientbridge-android/release-evidence
trap 'adb logcat -d > clientbridge-android/release-evidence/logcat.txt; adb exec-out screencap -p > clientbridge-android/release-evidence/installed-release.png' EXIT
adb shell svc wifi disable
adb shell svc data disable
curl -L --fail https://github.com/TrinetZet/TZ/releases/download/clientbridge-android-v1.0.0/ClientBridge-v1.0.0.apk -o /tmp/clientbridge-old.apk
adb install /tmp/clientbridge-old.apk
adb install clientbridge-android/distribution/validation/ClientBridge-instrumentation.apk
run_check() {
 adb shell am instrument -w -r -e class "com.trinetzet.clientbridge.UpgradeTest#$1" com.trinetzet.clientbridge.test/androidx.test.runner.AndroidJUnitRunner | tee "clientbridge-android/release-evidence/$1.txt"
 grep -q 'OK (1 test)' "clientbridge-android/release-evidence/$1.txt"
}
run_check seedOldVersion
adb shell am force-stop com.trinetzet.clientbridge
adb install -r clientbridge-android/distribution/ClientBridge-v1.0.1.apk
run_check verifyUpgradeGuide
adb shell am force-stop com.trinetzet.clientbridge
run_check verifyRestartLanguage
adb shell am start -W -n com.trinetzet.clientbridge/.MainActivity
sleep 3
adb shell pidof com.trinetzet.clientbridge
