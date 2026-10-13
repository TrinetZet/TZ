#!/usr/bin/env bash
set -euo pipefail
adb shell settings put global airplane_mode_on 1
adb shell svc wifi disable
adb shell svc data disable
./gradlew --no-daemon connectedDebugAndroidTest -PtestAbi=x86_64
