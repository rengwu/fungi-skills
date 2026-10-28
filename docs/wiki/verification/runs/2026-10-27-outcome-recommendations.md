---
title: Outcome recommendations
updated: 2026-10-27
result: Passed
---
# Outcome recommendations

Passed for the selected [Outcome](../../features/outcome.md) scenarios. The user identified that next steps looked equally weighted and should include a recommendation. Each action now accepts an optional plain-text `recommendation` reason. The page renders “Recommended” and that reason; the skill directs authors to recommend the strongest next action and put it first. Choices remain unchecked by default.

## Build and scope

The [manifest](../../evidence/2026-10-27-outcome-recommendations/manifest.json) records base revision `d402fae5800c262e07ef2c8faaa3ab2aec335e02`, dirty source hashes, Node/macOS identity and the installed Fungi executable hash/version. The native driver copied outcome assets into an isolated temporary directory, disabled the real conversation callback and used bounded synthetic sessions. The browser driver used isolated headless Chromium with a public-bridge test double. No human session was changed.

## Results

| Scenario | Expected and observed | Result | Evidence |
| --- | --- | --- | --- |
| Model and compatibility | 16 tests passed. Recommendation reasons survive selection and drafts; recommended actions start unselected; older actions/drafts without reasons remain valid; malformed reasons are rejected | Passed | [Manifest and check summary](../../evidence/2026-10-27-outcome-recommendations/manifest.json) |
| Recommendation presentation | One authored action displays “Recommended” and its reason; ordinary actions have no marker; the checkbox references its reason with `aria-describedby` | Passed | [Browser results](../../evidence/2026-10-27-outcome-recommendations/browser.json) |
| Layout | Inspected 1200 px and 420 px screenshots. The marker and reason are readable, the narrow reason wraps, and the page has no horizontal overflow or browser errors | Passed | [Desktop](../../evidence/2026-10-27-outcome-recommendations/desktop.png), [narrow](../../evidence/2026-10-27-outcome-recommendations/narrow.png) |
| Native persistence and submission | Recommended and ordinary actions start unchecked. Select first and third, save, close, reopen and submit without Notes; returned actions preserve the recommendation reason and original IDs/labels | Passed | [Native results](../../evidence/2026-10-27-outcome-recommendations/native.json) |
| Selection/retry regression | Keyboard and pointer selection work; clearing selections disables empty submission; save/submit errors preserve edits; retry does not duplicate submission | Passed | [Browser results](../../evidence/2026-10-27-outcome-recommendations/browser.json) |
| Existing native report flow | Notes and image survive save/reopen/submit with matching artifact hash; invalid schemas and questionnaire input still fail | Passed | [Native results](../../evidence/2026-10-27-outcome-recommendations/native.json), [retained image](../../evidence/2026-10-27-outcome-recommendations/native-note.png) |
| Skill structure | Outcome skill validation and whitespace checks pass | Passed | [Manifest](../../evidence/2026-10-27-outcome-recommendations/manifest.json) |

## Limits and cleanup

Recommendation quality still depends on the author and the task. The updated instructions were reviewed but not tested through an independent agent invocation. Existing report inputs have no recommendation metadata and are not retroactively changed. Accessibility checks covered DOM associations, not a screen-reader session. Human callback delivery, physical clipboard interaction and Windows/Linux were outside this run's scope.

The browser and loopback server closed on completion. Native results and image evidence were copied and hash-checked before removing only this run's temporary fixture directory. Human sessions and installed runtime files were untouched.
