# ClientBridge design

A static English business-communication trainer for the course «Деловой иностранный язык», presented by Иноземцев Владислав Сергеевич (ОVМП-104ивс) and Грушко Тимофей Андреевич (ОVМП-102ивс). The user approved the idea and explicitly requested autonomous implementation without further questions. Design choices below are reversible.

## Experience
A navy navigation rail, warm off-white workspace, mint accents and compact editorial typography. Responsive layout stacks on narrow screens. Twelve missions cover requirements, negotiation, delays, complaints, scope changes, secure access, meetings, handover, incidents, design feedback, invoices and async work. Each mission contains three client messages and three answer choices per message. Feedback explains business tone and vocabulary; scores measure clarity, tone and action, not academic grades. Results include a contextual client email, editable locally and downloadable. The 36-phrase phrasebook supports search and topic filters. Flashcards use self-rated local review scheduling. Email studio has editable context fields and persistent drafts. Progress includes up to 200 historical attempts, weak skill profile, next practice plan and confirmed JSON backup restore. Mission recommendations and random practice support regular use. Project page identifies both students and distinguishes proposed responsibilities from verified implementation.

## Architecture
Independent `clientbridge/` directory; existing files and hosting configuration remain untouched. Native HTML/CSS/ES modules; no runtime dependencies, backend, API keys or external fonts. Scenario data, pure learning/state functions and DOM rendering are separate modules. A Node build copies static assets into `dist/`; relative URLs support GitHub Pages repository subpaths. Browser localStorage stores validated choices, active mission, review records, historical attempts and drafts. Corrupt or unavailable storage falls back safely. Reset uses an explicit in-app confirmation.

## Verification
Node tests exercise scores, contextual emails, state validation, review intervals, recommendations, import handling and content completeness. Browser checks exercise 12 missions, answer locks, reload/resume, all six navigation views, reset, search/filter, review session, email editing/copy/export, history backup/import and narrow layouts. Build and repository diff verified before PR. Copies exclude git internals, dependencies and secrets.

## Course and team boundaries
No promise of automatic credit; this project does not replace the three mandatory test assignments. Teacher approval criteria and email address are unknown. No teacher message is sent. No fabricated contribution history for Тимофей. Publishing changes require a separate safe deployment choice; PR does not merge automatically.

## Scope expansion
The user subsequently requested a reusable multi-function app, 10–12 scenarios, regular practice, spaced review, working email construction, history/weak skills and backup transfer. The implementation uses 12 missions and 36 phrases, preserving the original four scenarios. All scheduling and assessment algorithms run locally.
