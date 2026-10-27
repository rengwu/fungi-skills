---
title: Independent outcome and grill-form checks
updated: 2026-10-27
result: Passed
---
# Independent outcome and grill-form checks

Passed for the separation of [Outcome](../../features/outcome.md) and [Grill form](../../features/grill-form.md). The [accepted direction](../../planning.md#independent-workflows-accepted-on-2026-10-27) restores separate sessions, prepared layouts and a detailed CLI summary.

## Build and checks

The [manifest](../../evidence/2026-10-27-outcome-independent/manifest.json) records the base Git revision, dirty-source hashes, macOS/Node environment and exact installed Fungi binary (`v0.1.0-alpha.2`). All tracked grill-form skill/runtime files match the pre-outcome baseline exactly, and no added files remain in that skill. Outcome has its own HTML/CSS/modules and licensed renderer bundles. Each workflow depends only on the shared Fungi skill.

| Scenario | Observed | Result |
| --- | --- | --- |
| Unit/model checks | 12 passed: report validation, optional Notes, image/draft round trips, malformed/oversize feedback, rejected combined inputs, asset independence and existing interview transport | Passed |
| Isolated native outcome | Copied only outcome assets; stylesheet, Markdown/table/diagram/image rendered; optional Notes + PNG persisted through Close/reopen and submitted | Passed |
| Removed combined flow | Nonempty questions rejected with a visible separate-session message; unknown schemas rejected | Passed |
| Restored native interview | Original choice, image, draft, preview-state and untouched-item behavior passed unchanged | Passed |
| Desktop and 420 px layout | Inspected screenshots show report and Notes; no questionnaire or document overflow | Passed |
| UI retry behavior | Injected save/submit failures preserved feedback; retry succeeded and duplicate click did not submit twice | Passed |
| Packaging and docs | Both skill validators passed; source/installed links resolve; no cross-workflow asset dependency | Passed |

Evidence: [unit summary](../../evidence/2026-10-27-outcome-independent/unit-summary.json), [native outcome](../../evidence/2026-10-27-outcome-independent/native.json), [native interview regression](../../evidence/2026-10-27-outcome-independent/grill-regression.json), [browser checks](../../evidence/2026-10-27-outcome-independent/browser.json), [desktop screenshot](../../evidence/2026-10-27-outcome-independent/desktop.png), [narrow screenshot](../../evidence/2026-10-27-outcome-independent/narrow.png), [outcome image artifact](../../evidence/2026-10-27-outcome-independent/native-note.png), [interview image artifact](../../evidence/2026-10-27-outcome-independent/grill-note.png).

The first browser fixture served the new stylesheet as a binary file, so Chromium did not apply it. Visual inspection caught the unstyled page. The fixture now serves CSS correctly; both browser and native checks assert the stylesheet is applied. Final screenshots were rerun and inspected after that test-fixture fix.

## Limits

Native checks used isolated synthetic sessions with the callback target removed and an explicit installed binary path. They establish page/API behavior, not a human callback or normal PATH-based launch. Browser retry checks inject the public bridge; they do not establish native failure recovery. Human usability, physical clipboard, OS window-close recovery, sleep/wake, Windows and Linux remain untested. Existing session data and prior evidence were preserved; old combined-round drafts are explicitly rejected by the new report-only page.
