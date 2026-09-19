# Minimal Android Calculator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a minimal native Android calculator in `android-calculator/` and produce an installable debug APK through GitHub Actions.

**Architecture:** A single Compose activity renders the calculator and delegates input transitions to a plain Kotlin `CalculatorState`. Arithmetic is isolated in `CalculatorEngine`, so JVM unit tests exercise calculations and state transitions without an emulator.

**Tech Stack:** Kotlin, Jetpack Compose, Material 3, Gradle, Android Gradle Plugin, JUnit 4, GitHub Actions

**Spec:** `docs/superpowers/specs/2026-09-19-android-calculator-design.md`

## Global Constraints

- Keep all application files under `android-calculator/`, except the repository workflow under `.github/workflows/`.
- Do not modify existing root HTML files.
- Support digits `0–9`, `+`, `−`, `×`, `÷`, `=`, and `C`.
- Show `Нельзя делить на ноль` instead of crashing on division by zero.
- Use a simple dark Material 3 interface.
- Produce a debug APK; Google Play publication is out of scope.
- Use package `com.trinetzet.calculator`, `minSdk = 24`, and `compileSdk = 36`.
- Pin compatible stable build versions: AGP `8.13.2`, Kotlin `2.2.21`, Compose BOM `2026.09.00`, Gradle `8.13`, and Java `17`.

## Review Focus

- Leading zero input: additional digits replace a lone `0` instead of producing values such as `007`.
- Repeated operator input: the latest operator replaces the pending operator before the second operand starts.
- Missing second operand: pressing `=` leaves the displayed value stable and does not crash.
- Division by zero: display the required Russian error and recover cleanly after `C`.
- New input after a result: the first digit starts a fresh calculation instead of appending to the previous result.

---

### Task 1: Buildable Android project shell

**Files:**
- Create: `android-calculator/settings.gradle.kts`
- Create: `android-calculator/build.gradle.kts`
- Create: `android-calculator/gradle.properties`
- Create: `android-calculator/gradlew`
- Create: `android-calculator/gradlew.bat`
- Create: `android-calculator/gradle/wrapper/gradle-wrapper.properties`
- Create: `android-calculator/gradle/wrapper/gradle-wrapper.jar`
- Create: `android-calculator/app/build.gradle.kts`
- Create: `android-calculator/app/src/main/AndroidManifest.xml`
- Create: `android-calculator/app/src/main/res/values/strings.xml`
- Create: `android-calculator/app/src/main/res/values/themes.xml`

**Interfaces:**
- Consumes: none.
- Produces: Gradle tasks `:app:testDebugUnitTest` and `:app:assembleDebug`; Android application id `com.trinetzet.calculator`.

- [ ] **Step 1: Create the Gradle settings and root plugin declarations**

`settings.gradle.kts` must declare `google()`, `mavenCentral()`, root name `MinimalCalculator`, and `include(":app")`. The root build must declare Android application `8.13.2`, Kotlin Android `2.2.21`, and Compose compiler plugin `2.2.21` with `apply false`.

- [ ] **Step 2: Configure the application module**

Use `namespace = "com.trinetzet.calculator"`, `compileSdk = 36`, `minSdk = 24`, `targetSdk = 36`, Java/Kotlin target 17, Compose enabled, Compose BOM `2026.09.00`, `activity-compose`, `material3`, and JUnit `4.13.2`.

- [ ] **Step 3: Generate and pin the Gradle wrapper**

Run:

```bash
cd android-calculator
gradle wrapper --gradle-version 8.13 --distribution-type bin
chmod +x gradlew
```

Expected: wrapper scripts, properties, and JAR exist; `distributionUrl` points to `gradle-8.13-bin.zip`.

- [ ] **Step 4: Add the manifest and resources**

Declare exported `.MainActivity` as the launcher activity, app label `Мини-калькулятор`, and a dark no-action-bar theme.

- [ ] **Step 5: Verify Gradle configuration**

Run:

```bash
cd android-calculator
./gradlew tasks
```

Expected: exit code 0 and both `assembleDebug` and `testDebugUnitTest` are listed.

- [ ] **Step 6: Commit**

```bash
git add android-calculator
git commit -m "build: scaffold Android calculator project"
```

### Task 2: Arithmetic engine

**Files:**
- Create: `android-calculator/app/src/main/java/com/trinetzet/calculator/CalculatorEngine.kt`
- Test: `android-calculator/app/src/test/java/com/trinetzet/calculator/CalculatorEngineTest.kt`

**Interfaces:**
- Consumes: none.
- Produces: `enum class Operation`; `sealed interface CalculationResult`; `CalculatorEngine.calculate(left: Double, right: Double, operation: Operation): CalculationResult`.

- [ ] **Step 1: Write failing arithmetic tests**

Create tests that assert:

```kotlin
assertEquals(CalculationResult.Value(7.0), CalculatorEngine.calculate(5.0, 2.0, Operation.ADD))
assertEquals(CalculationResult.Value(3.0), CalculatorEngine.calculate(5.0, 2.0, Operation.SUBTRACT))
assertEquals(CalculationResult.Value(10.0), CalculatorEngine.calculate(5.0, 2.0, Operation.MULTIPLY))
assertEquals(CalculationResult.Value(2.5), CalculatorEngine.calculate(5.0, 2.0, Operation.DIVIDE))
assertEquals(CalculationResult.DivisionByZero, CalculatorEngine.calculate(5.0, 0.0, Operation.DIVIDE))
```

- [ ] **Step 2: Run tests and confirm failure**

Run:

```bash
cd android-calculator
./gradlew :app:testDebugUnitTest --tests "*CalculatorEngineTest"
```

Expected: compilation fails because `CalculatorEngine`, `Operation`, and `CalculationResult` do not exist.

- [ ] **Step 3: Implement the arithmetic types**

Define:

```kotlin
enum class Operation { ADD, SUBTRACT, MULTIPLY, DIVIDE }

sealed interface CalculationResult {
    data class Value(val number: Double) : CalculationResult
    data object DivisionByZero : CalculationResult
}

object CalculatorEngine {
    fun calculate(left: Double, right: Double, operation: Operation): CalculationResult =
        when (operation) {
            Operation.ADD -> CalculationResult.Value(left + right)
            Operation.SUBTRACT -> CalculationResult.Value(left - right)
            Operation.MULTIPLY -> CalculationResult.Value(left * right)
            Operation.DIVIDE -> if (right == 0.0) {
                CalculationResult.DivisionByZero
            } else {
                CalculationResult.Value(left / right)
            }
        }
}
```

- [ ] **Step 4: Run engine tests**

Run the command from Step 2.

Expected: all five tests pass.

- [ ] **Step 5: Commit**

```bash
git add android-calculator/app/src/main/java android-calculator/app/src/test
git commit -m "feat: add calculator arithmetic engine"
```

### Task 3: Calculator input state

**Files:**
- Create: `android-calculator/app/src/main/java/com/trinetzet/calculator/CalculatorState.kt`
- Test: `android-calculator/app/src/test/java/com/trinetzet/calculator/CalculatorStateTest.kt`

**Interfaces:**
- Consumes: `Operation`, `CalculationResult`, and `CalculatorEngine.calculate`.
- Produces: immutable `data class CalculatorState` with `display: String`, `onDigit(digit: Int)`, `onOperation(operation: Operation)`, `onEquals()`, and `clear()`.

- [ ] **Step 1: Write failing state-transition tests**

Cover all of these exact scenarios:

```kotlin
assertEquals("12", CalculatorState().onDigit(1).onDigit(2).display)
assertEquals("7", CalculatorState().onDigit(0).onDigit(7).display)
assertEquals(
    "8",
    CalculatorState().onDigit(8)
        .onOperation(Operation.ADD)
        .onOperation(Operation.MULTIPLY)
        .display
)
assertEquals("9", CalculatorState().onDigit(9).onEquals().display)
assertEquals(
    "Нельзя делить на ноль",
    CalculatorState().onDigit(8)
        .onOperation(Operation.DIVIDE)
        .onDigit(0)
        .onEquals()
        .display
)
assertEquals(
    "0",
    CalculatorState().onDigit(8)
        .onOperation(Operation.DIVIDE)
        .onDigit(0)
        .onEquals()
        .clear()
        .display
)
assertEquals(
    "4",
    CalculatorState().onDigit(1)
        .onOperation(Operation.ADD)
        .onDigit(2)
        .onEquals()
        .onDigit(4)
        .display
)
```

Also test a complete `12 + 3 = 15` flow.

- [ ] **Step 2: Run state tests and confirm failure**

Run:

```bash
cd android-calculator
./gradlew :app:testDebugUnitTest --tests "*CalculatorStateTest"
```

Expected: compilation fails because `CalculatorState` does not exist.

- [ ] **Step 3: Implement immutable state transitions**

Store `display`, nullable `storedOperand`, nullable `pendingOperation`, `replaceDisplay`, and `resultShown`. Validate digits with `require(digit in 0..9)`. Format whole-number results without `.0`; preserve non-whole decimal results. On division by zero, set the required message and make `clear()` fully recover the initial state.

- [ ] **Step 4: Run all unit tests**

Run:

```bash
cd android-calculator
./gradlew :app:testDebugUnitTest
```

Expected: engine and state suites pass.

- [ ] **Step 5: Commit**

```bash
git add android-calculator/app/src/main/java android-calculator/app/src/test
git commit -m "feat: add calculator input state"
```

### Task 4: Compose calculator screen

**Files:**
- Create: `android-calculator/app/src/main/java/com/trinetzet/calculator/MainActivity.kt`
- Create: `android-calculator/app/src/main/java/com/trinetzet/calculator/CalculatorScreen.kt`
- Create: `android-calculator/app/src/main/java/com/trinetzet/calculator/CalculatorTheme.kt`

**Interfaces:**
- Consumes: `CalculatorState` transition methods and `Operation`.
- Produces: `@Composable fun CalculatorScreen()`; launcher `MainActivity`.

- [ ] **Step 1: Implement the dark theme**

Define a dark `ColorScheme` and wrap content in `MaterialTheme`. Keep system bars dark and use high-contrast text.

- [ ] **Step 2: Implement the screen state and display**

Inside `CalculatorScreen`, keep `CalculatorState` with `rememberSaveable` using its displayed and pending values or a dedicated saver. Render the display right-aligned, with one line and ellipsis for overflow.

- [ ] **Step 3: Implement the four-row keypad**

Render these rows:

```text
7 8 9 ÷
4 5 6 ×
1 2 3 −
C 0 = +
```

Digit buttons call `onDigit`; operator buttons map to `Operation`; `=` calls `onEquals`; `C` calls `clear`. Use equal-width buttons, a minimum touch target of 48 dp, orange operator buttons, and a distinct clear button.

- [ ] **Step 4: Connect the activity**

Set Compose content in `MainActivity.onCreate`, apply `CalculatorTheme`, and place `CalculatorScreen` inside a full-screen surface.

- [ ] **Step 5: Build the APK**

Run:

```bash
cd android-calculator
./gradlew :app:testDebugUnitTest :app:assembleDebug
```

Expected: tests pass and `app/build/outputs/apk/debug/app-debug.apk` exists.

- [ ] **Step 6: Commit**

```bash
git add android-calculator/app/src/main
git commit -m "feat: add calculator Compose interface"
```

### Task 5: GitHub Actions APK artifact and usage guide

**Files:**
- Create: `.github/workflows/android-calculator.yml`
- Create: `android-calculator/README.md`

**Interfaces:**
- Consumes: Gradle tasks `:app:testDebugUnitTest` and `:app:assembleDebug`.
- Produces: GitHub Actions artifact `minimal-calculator-apk` containing `app-debug.apk`.

- [ ] **Step 1: Add the workflow**

Create a workflow named `Build Android Calculator` triggered by `workflow_dispatch` and pushes affecting `android-calculator/**` or the workflow itself. Use `actions/checkout@v4`, `actions/setup-java@v4` with Temurin 17 and Gradle cache, run tests, assemble debug, and upload the APK with `actions/upload-artifact@v4`.

- [ ] **Step 2: Add installation instructions**

Document:

1. Open the repository’s Actions tab.
2. Open the latest successful `Build Android Calculator` run.
3. Download `minimal-calculator-apk` from Artifacts.
4. Extract the ZIP on the phone.
5. Open `app-debug.apk` and allow installation from the browser or file manager when Android requests it.

Include the local verification commands and state that this debug APK is for testing.

- [ ] **Step 3: Run final local verification**

Run:

```bash
cd android-calculator
./gradlew clean :app:testDebugUnitTest :app:assembleDebug
test -f app/build/outputs/apk/debug/app-debug.apk
```

Expected: every command exits 0.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/android-calculator.yml android-calculator/README.md
git commit -m "ci: build downloadable calculator APK"
```

- [ ] **Step 5: Verify the GitHub workflow**

Push the branch, wait for `Build Android Calculator`, inspect failed job logs if necessary, and confirm the run ends successfully with artifact `minimal-calculator-apk`.

- [ ] **Step 6: Install smoke test**

Download the artifact, install `app-debug.apk` on an Android device, launch it, and manually verify `12 + 3 = 15`, `8 ÷ 0`, and `C`. Record any device-specific failure before declaring completion.
