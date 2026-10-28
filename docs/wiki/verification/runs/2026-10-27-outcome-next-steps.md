---
title: Outcome next steps and delivery guidance
updated: 2026-10-27
result: Passed
---
# Outcome next steps and delivery guidance

Passed for the exercised [Outcome](../../features/show-outcome.md) UI/model scenarios and the instruction/diagnostic checks of [shared support](../../features/fungi-support.md). The requested behavior is recorded in [planning](../../planning.md#outcome-next-steps-and-quiet-ui-accepted-on-2026-10-27). Fresh automatic continuation in the user's Claude session is outside this run's tested scope.

## Build and scope

The [manifest](../../evidence/2026-10-27-outcome-next-steps/manifest.json) records Git base `d402fae`, changed source fingerprints, Node/macOS identity and the installed `v0.1.0-alpha.2` executable hash. Native checks copy only outcome assets into isolated temporary sessions, remove the callback target and use bounded synthetic `wait` calls. Browser checks use a public-API test double in headless Chromium. No live human window was driven and no human result was recollected.

## Results

| Scenario | Expected and observed | Result | Evidence |
| --- | --- | --- | --- |
| Model behavior | 15 tests passed: multiple actions without Notes, no implicit selection, clearing selections, legacy drafts, selection + Notes + images, malformed IDs/labels, existing feedback/transport cases | Passed | [Unit summary](../../evidence/2026-10-27-outcome-next-steps/unit-summary.json) |
| Native selection-only submission | Three unchecked choices; select first and third, save, Close, reopen with both restored, submit with empty Notes; exact IDs/labels returned | Passed | [Native results](../../evidence/2026-10-27-outcome-next-steps/native.json) |
| Native Notes/image regression | Report-only input hides next steps; Notes + PNG survive save/Close/reopen and submit with matching artifact hash; invalid schema and questionnaire input still fail explicitly | Passed | [Native results](../../evidence/2026-10-27-outcome-next-steps/native.json), [retained PNG](../../evidence/2026-10-27-outcome-next-steps/native-note.png) |
| Keyboard/pointer and retry | Space selects a checkbox; multiple labels can be selected; empty Notes are allowed; clearing selections disables blank submission; save/submit errors preserve choices and Notes; retry succeeds without a duplicate submission | Passed | [Browser results](../../evidence/2026-10-27-outcome-next-steps/browser.json) |
| Layout and removed captions | Desktop and 420 px screenshots inspected: selectable actions, Notes and buttons remain; no Optional tag, paste hint or delivery explanation; no horizontal overflow or page errors | Passed | [Desktop](../../evidence/2026-10-27-outcome-next-steps/desktop.png), [narrow](../../evidence/2026-10-27-outcome-next-steps/narrow.png) |
| Manual-return diagnosis | The Imparo launch record says manual with no exact-caller callback. Installed `describe delivery` identifies `auto` as Codex-only and local interactive Claude's route as background `wait`. The former shared instructions prescribed `auto` universally | Passed | [Diagnostic excerpt](../../evidence/2026-10-27-outcome-next-steps/delivery-diagnosis.json) |
| Instructions and packaging | Shared skill selects the host route before opening; workflow and reopen examples use that selection; completed waits need no collect. All three skill validators pass and installed Codex sibling links resolve to this source | Passed | [Source manifest](../../evidence/2026-10-27-outcome-next-steps/manifest.json) |

## Limits and follow-up

Native tests establish page behavior and persistence through Fungi's installed macOS runtime. They do not establish a real host's automatic wake-up. The delivery correction matches installed capabilities, but a fresh human round in Claude Code is still needed to verify that the agent follows it and consumes background completion. Existing session data was read only for the minimal launch diagnostic, without private report text or feedback in project evidence.

Browser failure injection verifies page recovery with a test double, not native engine failures. Physical clipboard, OS window-close recovery, prolonged idle/sleep, Windows and Linux remain untested. Existing open pages and snapshotted report inputs do not gain newly authored next-step actions; the workflow change applies to subsequent reports. No Fungi engine changes were made.
