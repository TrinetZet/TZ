# ClientBridge Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement inline. User explicitly requested autonomous execution without intermediate questions.

**Goal:** Deliver a polished static English IT client communication trainer and a reviewable PR.
**Architecture:** Separate scenario content, validated state/score helpers, and browser UI. Build copies relative static assets.
**Tech Stack:** HTML, CSS, native JavaScript modules, Node test runner; no runtime dependencies.
**Spec:** docs/superpowers/specs/2026-10-04-clientbridge-design.md

## Global Constraints
- Preserve every existing website and hosting setting.
- Exactly twelve missions with at least three responses per step, contextual feedback and final emails.
- No backend, paid API, secrets, invented partner commits, or academic credit promise.
- Static relative assets support repository subpaths; copies exclude .git and node_modules.

## Review Focus
- Malformed saved progress must recover to valid empty state.
- Disabled storage must allow the complete practice flow.
- Reload after selecting an answer must restore feedback without advancing twice.
- Narrow viewports must show every control without horizontal overflow.
- Email copy failure must retain a visible selectable email and downloadable file.

### Task 1: Learning data and state
Files: clientbridge/scenarios.mjs, extra-scenarios.mjs, core.mjs, practice.mjs, tests/core.test.mjs, tests/practice.test.mjs.
Interfaces: scenarios array; freshState(), readState(raw), evaluate(scenario, choices), composeEmail(scenario, choices).
- [x] Write tests for scenario coverage, scored choice effects, per-mission email content, corrupted storage and invalid choice recovery.
- [x] Run node --test; verify missing module failure before implementation.
- [x] Implement data and pure functions, then verify tests pass.

### Task 2: Browser experience and static build
Files: clientbridge/index.html, styles.css, app.mjs, build.mjs, package.json.
Consumes: scenarios and core helpers. Produces: accessible six-view UI, review schedule, saved draft constructor, progress/history/backups and dist assets.
- [x] Add browser flow checks for all missions, search, reload, score, reset, email export and 390px layout.
- [x] Implement responsive practice, phrasebook and project views; storage failure notice and reset confirmation.
- [x] Build; run complete browser checks and inspect screenshots at desktop/mobile sizes.

### Task 3: Delivery
Files: clientbridge/README.md, verification.md.
- [x] Document English goals, local run, isolated Pages deployment, 3–5 minute script, actual AI-assisted work and proposed partner roles.
- [x] Review whole branch, fix consequential issues, rerun relevant checks.
- [x] Commit and push feature branch, create and attach PR without merging.
- [x] Copy source and documents into specified Desktop folder and outputs; verify content matches.

## Execution ledger
- Ruling: autonomous inline execution and isolated fresh clone/feature branch honour the explicit no-question request. No extra worktree was needed for a newly cloned projectless checkout.
- Ruling: user expanded scope to 12 missions / 36 phrases, scheduled review, regular practice, persistent email studio, history/weak skills and backups; spec and plan updated.
- Task 1: complete — initial missing-module RED, then 4/4 core checks GREEN; expanded review tests RED on missing practice module, then 8/8 GREEN.
- Task 2: implementation complete, full browser suite GREEN (12 missions, 8-card session, backups, 28 responsive checks). Independent review findings fixed and skip regression RED→GREEN.
- Task 3: English README and verification record complete; remote PR and copies are the remaining delivery steps.
