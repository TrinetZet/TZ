# ClientBridge

**Business English for the human side of IT.** An interactive, reusable practice app for students and early-career IT professionals who communicate with international clients.

## Learning goals

Practise asking precise questions, confirming scope, negotiating realistic terms, communicating problems with ownership, and writing clear follow-up emails. Twelve authored missions cover requirements, time/budget negotiation, delays, complaints, scope changes, secure access, cross-border meetings, handover, incident updates, design feedback, invoice follow-up and asynchronous collaboration. Difficulty labels (B1–C1) are approximate learning guides, not certified proficiency assessments.

Each mission has three decisions and three response options at each decision. Feedback explains tone, vocabulary and next steps; weak replies show a stronger alternative. Each response earns 0–3 points for clarity, business tone and actionable next steps. A mission score is earned points / 27 × 100, rounded. This is a transparent authored rubric, not AI grading of free-form language.

## Everyday features

- Search/filter 12 missions and continue incomplete work. A recommendation prioritises unfinished work, then new missions, then a low-scoring mission. Random practice starts a new answer set while retaining past attempts.
- Search 36 business expressions by wording, meaning or example and filter by topic.
- Review up to eight due flashcards per session, recall before revealing, and self-rate Again / Good / Easy. Again returns in 10 minutes; Good starts at 1 day and doubles; Easy starts at 3 days and triples. Intervals are capped at 90 days. Unseen cards are always available.
- See completed missions, practice days, up to 200 historical attempts, latest skill profile and a suggested 10-minute routine. History displays the last 20 attempts; opening an entry opens the latest answer set for that mission.
- Generate model emails for all 12 contexts. Customise recipient, sign-off, subject, key message and next step; edit, copy or download the working draft. Draft edits are saved on the device. Generating a new email replaces the current studio draft.
- Export and import a local JSON learning backup. Import requires confirmation before replacing current progress. Reset requires confirmation and removes answers, review schedules, history and drafts.

## Run locally

No runtime dependencies, API keys, backend or external fonts are required. Use an HTTP server because browsers restrict JavaScript modules opened with `file://`.

```bash
cd clientbridge
python3 -m http.server 8000
```

Open http://localhost:8000/ . For repository-subpath testing, serve the repository root instead and open http://localhost:8000/clientbridge/ . The actual delivered workspace preview uses http://127.0.0.1:8765/clientbridge/ while its local server is running.

## Build and tests

Node.js 20+ is needed only for development checks and the optional static build.

```bash
npm test
npm run build
```

The build produces `dist/` with seven static assets. The source folder itself can also be hosted directly.

For the optional browser smoke suite, install Playwright as a local development tool, install Chromium, and serve the repository root on port 8765:

```bash
npm install --no-save playwright@1.62.1
npx playwright install chromium
# In a separate terminal, from the repository root:
python3 -m http.server 8765
# From clientbridge/:
node tests/browser-check.cjs
```

`CLIENTBRIDGE_URL` overrides the base URL. `CLIENTBRIDGE_SCREENSHOTS` optionally selects a directory for screenshots. `PLAYWRIGHT_MODULE_PATH` can point to an existing Playwright installation. The browser suite exercises all 12 missions, reload/locks, weak replies, phrase filters, a complete review session, email copy/export, history backups/import/reset, responsive routes, reduced motion and blocked/corrupt storage. Playwright is a test-only tool; it is not shipped to the website.

## Safe deployment in TZ

All existing root HTML sites and hosting settings are preserved. This PR adds `clientbridge/` and its design/plan documents only, without merging or enabling a new deployment configuration.

After review and merge into `master`:

1. Inspect **Settings → Pages** before changing any source. If this repository already publishes `master` from `/ (root)`, ClientBridge will be available under the existing Pages domain at `/TZ/clientbridge/`. If it uses a custom domain, use that domain’s matching `clientbridge/` path.
2. If Pages is not enabled, publishing `master` from `/ (root)` would make this folder available at `https://trinetzet.github.io/TZ/clientbridge/`. This is an anticipated URL, not a verified live deployment.
3. If the repository publishes `/docs` or uses a workflow/custom site, do not switch its source just for this project. Add the seven ClientBridge assets to that existing output under `clientbridge/`, or deploy `dist/` to a separate static site after agreeing on the destination.

All asset URLs are relative, so a repository subpath works. Do not upload `node_modules`, `.git`, keys or local progress backups to hosting. A separate host can publish the contents of `dist/` at its root.

## A 3–5 minute demonstration

**0:00–0:35 — The purpose.** “ClientBridge helps an IT team practise business English with an international client. It connects language choices with scope, trust and practical next steps.” Show the mission catalogue and level filter.

**0:35–1:50 — A conversation.** Start *Make the brief clear*. Choose a weak first reply and explain why overpromising is risky. Read the feedback and stronger alternative. Continue, confirm weekly totals and CSV export, then choose measurable acceptance criteria. Show the score dimensions and professional model follow-up email.

**1:50–2:40 — A learning habit.** Open Review cards, start a session, recall a phrase and reveal its example. Rate it Good. Explain the next review date and the Again / Easy alternatives.

**2:40–3:30 — A useful writing tool.** Open Email studio, choose a security or delay context, edit the recipient and action/deadline, generate a draft and demonstrate text export. Explain that templates are local and editable; free text is not automatically graded.

**3:30–4:30 — Evidence and continuity.** Open My progress, show the skill profile, attempt history and next practice plan. Show backup export and import confirmation. Explain local-only persistence, no automatic cross-device sync and reduced-motion support.

**4:30–5:00 — Course discussion.** Ask which learning outcomes the teacher values and whether a project presentation can count towards the course. Do not claim guaranteed credit or that this replaces required assignments.

## Team and contribution transparency

- **Иноземцев Владислав Сергеевич — ОVМП-104ивс** (Vladislav Inozemtsev).
- **Грушко Тимофей Андреевич — ОVМП-102ивс** (Timofey Grushko).

Vladislav selected and approved the concept and requested the scope and design. This initial implementation, scenario drafts, documentation and automated checks were produced with Codex assistance. Both students should review the material, adapt it to their course, and be able to explain how it works before presenting it.

**Proposed roles, not completed-work claims:** Vladislav — product coordination, technical validation and demo; Timofey — language review, scenario refinement and rehearsal. No completed implementation work, commits or historical coauthorship are invented for Timofey. Record actual subsequent contributions when they happen.

Teacher approval criteria and email address are unknown. The project is intended for discussion, does not guarantee automatic credit and does not replace the three mandatory test assignments. Nothing is sent to the teacher automatically.

## Data and limitations

The app stores choice indices, review schedules, up to 200 attempts and editable drafts in `localStorage` under `clientbridge.progress.v1`. Opening the same site on another device does not share progress. Export/import provides manual transfer. Storage denial leaves the app usable for the current session and displays a notice. Malformed progress is sanitised; unknown IDs, invalid answer prefixes and invalid review records are ignored. Backup files include your drafts.

The scenarios simulate clients and use authored response options. Later messages follow a fixed learning path, rather than a dynamic conversation tree. Model emails are explicitly based on the mission brief, not a transcript of the learner’s replies. There is no speech recognition, server account, collaborative editing, certified CEFR assessment or AI grading. Dates in the practice content are examples; check and update them in real correspondence.

## Source map

`scenarios.mjs` and `extra-scenarios.mjs`: authored content and phrasebook. `core.mjs`: validated saved state, rubric and model emails. `practice.mjs`: review scheduling, recommendation and import validation. `app.mjs`: views and interactions. `styles.css`: responsive design, animations, focus states and reduced motion. `build.mjs`: static asset copy. `tests/`: unit and browser checks.
