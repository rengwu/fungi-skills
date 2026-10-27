---
title: Outcome
updated: 2026-10-27
---
# Outcome

**FEAT-outcome**

Present results in a rich local window with optional feedback and a detailed CLI summary. Current basis: [independent workflows](../planning.md#independent-workflows-accepted-on-2026-10-27), superseding earlier combined sessions and custom layouts.

## Entry points and prerequisites

Invoke outcome for the conversation. Once enabled, favor using it when unsure; frequent windows are welcome. Install the complete `skills/outcome` and shared `skills/fungi` directories as siblings. No other workflow is required. Fungi must resolve on PATH with its expected protocol-1 version response.

Use `skills/outcome/assets/outcome.html` with the JSON described in `skills/outcome/references/authoring.md`. Agents choose the substance and visuals; the prepared page supplies the layout. It bundles its own renderer libraries and licenses, without imports or asset references to the interview skill.

## Expected behavior

- Render Markdown, tables, code, diagrams and embedded raster figures in a report, followed by optional Notes. Questionnaires and spikes have separate sessions; nonempty question arrays fail explicitly.
- Retain a detailed CLI summary, only slightly shorter than the rich report. Preserve accepted/proposed/implemented/checked distinctions. On launch failure, explain and give the result in the CLI.
- Reading requires no acknowledgment. Empty Notes cannot submit. Closing does not establish a decision; submitting feedback sends it and closes the window.
- Support plain text Notes and pasted images with numbered references and preview thumbnails. Save acknowledged drafts, recover them on explicit reopen, and preserve edits after failed saves/submissions.
- Return `outcome/v1`, the original `outcomeId`, and one `outcome-notes` answer. Match image artifacts by key and feedback to its original report. Combined-round drafts are rejected without rewriting them.
- Continue from meaningful feedback without creating acknowledgment loops. Fungi owns session identity, collection and recovery.

## Verification recipes

Use [setup](../verification/setup.md#outcome-checks).

1. `node --test scripts/*.test.mjs`: validate reports, optional feedback, images/drafts, malformed/oversize data, rejection of combined input and asset independence, plus existing interview transport tests.
2. `node scripts/outcome-native-smoke.mjs /absolute/path/to/fungi OUTPUT.json`: copy only outcome assets into a disposable directory; render Markdown/table/diagram/image and the stylesheet; save Notes + PNG, close, reopen and submit; reject questions and unknown schemas.
3. `node scripts/outcome-browser-smoke.mjs PUPPETEER_MODULE CHROME OUTPUT_DIR`: inspect desktop/420 px screenshots and retry behavior with an injected public bridge. A failed save or submit preserves edits; duplicate clicks do not double-submit.
4. `node scripts/native-smoke.mjs /absolute/path/to/fungi OUTPUT.json`: exercise the restored standalone interview's normal native flow separately.

## Coverage and limits

Native synthetic checks cover the installed macOS runtime and public page API. Browser screenshots/retry checks use Chromium with a test double, not native callback delivery. Physical clipboard, OS window-close recovery, human usability, prolonged idle/sleep and Windows/Linux remain untested. Normal invocation still requires Fungi on the agent's PATH.

## Verification history

- [Independent workflows](../verification/runs/2026-10-27-outcome-independent.md) — dedicated outcome page and restored interview skill.
- [Simplification checks](../verification/runs/2026-10-27-outcome-simplification.md) — historical instruction edits.
- [Initial implementation](../verification/runs/2026-10-27-outcome.md) — historical combined renderer.
