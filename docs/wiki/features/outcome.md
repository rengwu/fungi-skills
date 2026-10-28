---
title: Outcome
updated: 2026-10-28
---
# Outcome

**FEAT-outcome**

Present results in a rich local window with selectable follow-up actions, optional feedback and a detailed CLI summary. Current basis: [independent workflows](../planning.md#independent-workflows-accepted-on-2026-10-27) and [selectable next steps](../planning.md#outcome-next-steps-and-quiet-ui-accepted-on-2026-10-27), superseding earlier combined sessions and custom layouts.

## Entry points and prerequisites

Invoke outcome for the conversation. Once enabled, favor using it when unsure; frequent windows are welcome. Install `skills/outcome`, `skills/fungi-ui` and `skills/fungi` as siblings, with Node.js 22+ for assembly. No other workflow is required. Fungi must resolve on PATH with its expected protocol-1 version response.

Run `skills/outcome/scripts/assemble.mjs --input INPUT.json` and open the returned `html`/`input` paths. The composition template and schema remain with outcome; reusable rendering, controls, inline image editing and libraries come from the [shared UI kit](fungi-ui.md). Neither workflow imports the other.

## Expected behavior

- Render Markdown, tables, code, diagrams and embedded raster figures in a report, followed by next-step checkboxes when supplied and always-present Notes. Questionnaires and spikes have separate sessions; nonempty question arrays fail explicitly.
- Author recommended follow-up work as `nextSteps` actions instead of a prose-only list. Multiple actions can be selected; all start unchecked. Omit the section when no actions are offered.
- Identify the strongest next action with an optional `recommendation` reason and put it first. The page shows “Recommended” beside its label and the reason below, associated with the checkbox for accessibility. Recommend multiple actions only when useful together; recommendations never preselect actions.
- Retain a detailed CLI summary, only slightly shorter than the rich report. Preserve accepted/proposed/implemented/checked distinctions. On launch failure, explain and give the result in the CLI.
- Reading requires no acknowledgment. A selection alone or Notes alone can submit. With neither, submission is disabled. Closing does not establish a decision; submitting feedback sends it and closes the window.
- Keep the Notes label and controls without the Optional tag, paste hint or explanatory delivery caption. Image pasting still works; save status and actionable errors remain visible.
- Support plain text Notes and pasted images with clickable inline image chips and previews. Save acknowledged drafts, recover them on explicit reopen, and preserve edits after failed saves/submissions.
- Return `outcome/v1`, the original `outcomeId`, one `outcome-notes` answer and `selectedNextSteps` with original IDs/labels and optional recommendation reasons in report order. Selected actions request next work; they do not answer underlying design questions. Unselected actions are unresolved, not rejected.
- Restore selections with Notes and images. Earlier report drafts without selections remain readable; combined-round drafts and mismatched actions are rejected without rewriting them. Match image artifacts by key and feedback to its original report.
- Continue from meaningful feedback without creating acknowledgment loops. Fungi owns session identity, collection and recovery.

## Verification recipes

Use [setup](../verification/setup.md#outcome-checks).

1. `node --test scripts/*.test.mjs`: validate reports, optional selections/Notes, recommendation reasons without implicit selection, images/drafts, malformed/oversize data, rejection of combined input and asset independence, plus existing interview transport tests.
2. `node scripts/outcome-native-smoke.mjs /absolute/path/to/fungi OUTPUT.json`: assemble outcome and the shared kit into a disposable directory; render Markdown/table/diagram/image and the stylesheet; save Notes + PNG, close, reopen and submit; separately reopen multiple selections and submit without Notes; reject questions and unknown schemas.
3. `node scripts/outcome-browser-smoke.mjs PUPPETEER_MODULE CHROME OUTPUT_DIR`: inspect 1200/420 px screenshots, recommendation markers/reasons and keyboard/pointer selection with an injected public bridge. Clearing feedback disables submission; a failed save or submit preserves edits/selections; duplicate clicks do not double-submit.
4. `node scripts/native-smoke.mjs /absolute/path/to/fungi OUTPUT.json`: exercise the restored standalone interview's normal native flow separately.

## Coverage and limits

Native synthetic checks cover the installed macOS runtime and public page API. Browser screenshots/retry checks use Chromium with a test double, not native callback delivery. Physical clipboard, OS window-close recovery, human usability, prolonged idle/sleep and Windows/Linux remain untested. Normal invocation still requires Fungi on the agent's PATH.

## Verification history

- [Shared UI extraction](../verification/runs/2026-10-28-ui-kit.md) — migrated composition, inline Notes, shared tables and retained bundles.

- [Recommended next steps](../verification/runs/2026-10-27-outcome-recommendations.md) — recommendation rendering, unchecked defaults, native draft/submit round-trip and desktop/narrow layout.
- [Next steps and delivery guidance](../verification/runs/2026-10-27-outcome-next-steps.md) — selection-only submission, persistence, retry behavior, quieter UI and host-aware launch instructions.
- [Independent workflows](../verification/runs/2026-10-27-outcome-independent.md) — dedicated outcome page and restored interview skill.
- [Simplification checks](../verification/runs/2026-10-27-outcome-simplification.md) — historical instruction edits.
- [Initial implementation](../verification/runs/2026-10-27-outcome.md) — historical combined renderer.
